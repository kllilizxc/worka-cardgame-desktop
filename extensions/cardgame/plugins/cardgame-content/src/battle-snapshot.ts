import { createHash, randomUUID } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, realpath, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';

export interface BattleSnapshotManifest {
  schemaVersion: 1;
  scope?: 'game-preview';
  id: string;
  createdAt: string;
  contentRevision: string;
  runtimeRevision: string;
  snapshotRevision: string;
  files: Array<{ path: string; sha256: string; bytes: number }>;
}
const digest = (bytes: string | Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const roots = ['src', 'public', 'package.json', 'bun.lock', 'bun.lockb', 'package-lock.json', 'pnpm-lock.yaml', 'tsconfig.json', 'tsconfig.node.json'];
const limit = 512 * 1024 * 1024;
type SnapshotScope = 'battle' | 'game-preview';
const previewRoots = [...roots, 'index.html', 'vite', 'vite.config.ts', 'vite.config.mjs', 'tsconfig.app.json', 'knowledge'];
async function filesIn(root: string, scope: SnapshotScope = 'battle') {
  const files: string[] = [];
  async function walk(path: string, optional = false) {
    const absolute = join(root, path);
    const info = await lstat(absolute).catch(error => { if (optional && (error as NodeJS.ErrnoException).code === 'ENOENT') return undefined; throw error; });
    if (!info) return;
    if (info.isSymbolicLink() || !(await realpath(absolute)).startsWith(root + sep)) throw Error(`实验快照不接受符号链接或越界文件：${path}`);
    if (info.isDirectory()) for (const child of (await readdir(absolute)).sort()) await walk(`${path}/${child}`);
    else if (info.isFile()) { files.push(path); if (files.length > 20_000) throw Error('实验快照超过 20000 个文件'); }
    else throw Error(`实验快照包含非普通文件：${path}`);
  }
  for (const path of scope === 'game-preview' ? previewRoots : roots) await walk(path, !['src', 'public', 'package.json'].includes(path));
  return files.sort();
}
/** Read the same project-file identity as snapshots without creating a copy or starting a game. */
export async function readBattleProjectRevision(projectRoot: string, scope: SnapshotScope = 'battle') {
  const root = await realpath(projectRoot);
  async function scan() {
    const paths = await filesIn(root, scope), files: BattleSnapshotManifest['files'] = [];
    let total = 0;
    for (const path of paths) {
      const absolute = join(root, path), info = await lstat(absolute);
      if (!info.isFile() || info.isSymbolicLink() || !(await realpath(absolute)).startsWith(root + sep)) throw Error(`核对期间文件身份变化：${path}`);
      if (info.size > limit - total) throw Error('项目核对超过 512 MiB');
      const bytes = await readFile(absolute); total += bytes.length;
      if (total > limit) throw Error('项目核对超过 512 MiB');
      files.push({ path, sha256: digest(bytes), bytes: bytes.length });
    }
    return files;
  }
  const first = await scan(), second = await scan();
  if (JSON.stringify(first) !== JSON.stringify(second)) throw Error('核对期间项目发生变化，请刷新重试');
  return { contentRevision: digest(JSON.stringify(first.filter(file => file.path.startsWith('public/')))),
    runtimeRevision: digest(JSON.stringify(first.filter(file => !file.path.startsWith('public/')))) };
}
/** Copies current bytes, including uncommitted changes, into a private independent experiment input. */
export async function createBattleSnapshot(projectRoot: string, destinationRoot: string, scope: SnapshotScope = 'battle') {
  const source = await realpath(projectRoot), destination = resolve(destinationRoot);
  async function futureRealpath(path: string): Promise<string> {
    try { return await realpath(path); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; return join(await futureRealpath(dirname(path)), path.slice(dirname(path).length + 1)); }
  }
  const canonicalDestination = await futureRealpath(destination);
  if (canonicalDestination === source || canonicalDestination.startsWith(source + sep)) throw Error('实验快照必须保存在游戏项目之外');
  await mkdir(destination, { recursive: true, mode: 0o700 });
  const id = randomUUID(), staging = join(destination, `.${id}.pending`), final = join(destination, id);
  await mkdir(staging, { mode: 0o700 });
  try {
    for (const path of ['src', 'public']) await mkdir(join(staging, 'project', path), { recursive: true, mode: 0o700 });
    const paths = await filesIn(source, scope), files: BattleSnapshotManifest['files'] = [];
    let total = 0;
    for (const path of paths) {
      const info = await lstat(join(source, path));
      if (!info.isFile() || info.isSymbolicLink() || !(await realpath(join(source, path))).startsWith(source + sep)) throw Error(`快照期间文件身份变化：${path}`);
      if (info.size > limit - total) throw Error('实验快照超过 512 MiB');
      const bytes = await readFile(join(source, path)); total += bytes.length;
      if (total > limit) throw Error('实验快照超过 512 MiB');
      files.push({ path, sha256: digest(bytes), bytes: bytes.length });
      const target = join(staging, 'project', path);
      await mkdir(dirname(target), { recursive: true, mode: 0o700 });
      await writeFile(target, bytes, { mode: 0o600, flag: 'wx' });
    }
    if (JSON.stringify(await filesIn(source, scope)) !== JSON.stringify(paths)) throw Error('生成快照期间项目文件列表发生变化，请重试');
    for (const file of files) if (digest(await readFile(join(source, file.path))) !== file.sha256) throw Error(`生成快照期间内容发生变化：${file.path}`);
    const revision = (entries: typeof files) => digest(JSON.stringify(entries));
    const manifest: BattleSnapshotManifest = { schemaVersion: 1, ...(scope === 'game-preview' ? { scope } : {}), id, createdAt: new Date().toISOString(), files,
      contentRevision: revision(files.filter(file => file.path.startsWith('public/'))),
      runtimeRevision: revision(files.filter(file => !file.path.startsWith('public/'))), snapshotRevision: revision(files) };
    await writeFile(join(staging, 'manifest.json'), JSON.stringify(manifest, null, 2), { mode: 0o600 });
    await rename(staging, final);
    return { directory: final, projectRoot: join(final, 'project'), manifest };
  } catch (error) { await rm(staging, { recursive: true, force: true }); throw error; }
}
/** Validate the served snapshot before accepting a report; a changed snapshot cannot retain its old version label. */
export async function verifyBattleSnapshot(directory: string): Promise<BattleSnapshotManifest> {
  const manifest: BattleSnapshotManifest = JSON.parse(await readFile(join(directory, 'manifest.json'), 'utf8'));
  if (manifest.schemaVersion !== 1 || (manifest.scope !== undefined && manifest.scope !== 'game-preview') || !Array.isArray(manifest.files)) throw Error('无效实验快照清单');
  const root = await realpath(join(directory, 'project'));
  const paths = await filesIn(root, manifest.scope ?? 'battle');
  if (JSON.stringify(paths) !== JSON.stringify(manifest.files.map(file => file.path))) throw Error('实验快照文件列表已变化');
  for (const file of manifest.files) {
    const bytes = await readFile(join(root, file.path));
    if (bytes.length !== file.bytes || digest(bytes) !== file.sha256) throw Error(`实验快照已变化：${file.path}`);
  }
  const revision = (entries: typeof manifest.files) => digest(JSON.stringify(entries));
  if (manifest.snapshotRevision !== revision(manifest.files) || manifest.contentRevision !== revision(manifest.files.filter(file => file.path.startsWith('public/'))) || manifest.runtimeRevision !== revision(manifest.files.filter(file => !file.path.startsWith('public/')))) throw Error('实验快照指纹不一致');
  return manifest;
}

/** Full playable project input; never changes the narrower historical battle identity. */
export const createGamePreviewSnapshot = (projectRoot: string, destinationRoot: string) => createBattleSnapshot(projectRoot, destinationRoot, 'game-preview');
export const readGamePreviewProjectRevision = (projectRoot: string) => readBattleProjectRevision(projectRoot, 'game-preview');
