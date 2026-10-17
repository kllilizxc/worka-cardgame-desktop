import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { devNull } from 'node:os';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createGamePreviewSnapshot, readGamePreviewProjectRevision, verifyBattleSnapshot } from './battle-snapshot';

export interface FormalPreviewRecord extends Record<string, string> {
  projectId: string; key: string; snapshotId: string; createdAt: string;
  commit: string; contentRevision: string; runtimeRevision: string; snapshotRevision: string;
}
const run = promisify(execFile);
const git = async (cwd: string, ...args: string[]) => (await run('git', ['-c', `core.hooksPath=${devNull}`, '-c', 'commit.gpgsign=false', ...args], {
  cwd, timeout: 120_000, maxBuffer: 1024 * 1024, env: { ...process.env, GIT_CONFIG_GLOBAL: devNull, GIT_CONFIG_NOSYSTEM: '1', GIT_TERMINAL_PROMPT: '0' },
})).stdout.trim();

/** Owns immutable input only. The existing preview service owns servers and worktrees. */
export function createFormalPreviewService(options: {
  dataRoot: string; projects: Array<{ id: string; root: string }>;
  register(record: FormalPreviewRecord, repo: string): Promise<unknown>;
}) {
  const projects = new Map(options.projects.map(project => [project.id, project]));
  const pending = new Map<string, Promise<FormalPreviewRecord>>();
  let closed = false;
  function paths(projectId: string) {
    const project = projects.get(projectId);
    if (!project) throw Error('未登记的 CardGame 项目');
    const root = join(options.dataRoot, 'formal-previews', projectId);
    return { project, root, snapshots: join(root, 'snapshots'), latest: join(root, 'latest.json') };
  }
  async function read(projectId: string): Promise<FormalPreviewRecord | undefined> {
    const { latest } = paths(projectId);
    const value = await readFile(latest, 'utf8').catch(error => { if (error.code === 'ENOENT') return undefined; throw error; });
    if (!value) return undefined;
    const record = JSON.parse(value) as FormalPreviewRecord;
    if (record.projectId !== projectId || !/^[a-f0-9-]{36}$/.test(record.snapshotId) || record.key !== `formal-${record.snapshotId}` || !/^[a-f0-9]{40}$/.test(record.commit)) throw Error('正式试玩快照记录无效');
    return record;
  }
  async function validate(record: FormalPreviewRecord) {
    const { snapshots } = paths(record.projectId);
    const directory = join(snapshots, record.snapshotId), repo = join(directory, 'project');
    const manifest = await verifyBattleSnapshot(directory);
    if (manifest.scope !== 'game-preview' || manifest.snapshotRevision !== record.snapshotRevision || manifest.contentRevision !== record.contentRevision || manifest.runtimeRevision !== record.runtimeRevision) throw Error('正式试玩快照身份已变化');
    if (await git(repo, 'rev-parse', 'HEAD') !== record.commit || await git(repo, 'status', '--porcelain', '--untracked-files=all')) throw Error('正式试玩提交已变化');
    return repo;
  }
  return {
    async query(projectId: string) {
      const record = await read(projectId);
      if (!record) return { record: null, freshness: 'missing' as const };
      try {
        await validate(record);
        const current = await readGamePreviewProjectRevision(paths(projectId).project.root);
        return { record, freshness: current.contentRevision === record.contentRevision && current.runtimeRevision === record.runtimeRevision ? 'current' as const : 'stale' as const };
      } catch (error) { return { record, freshness: 'unavailable' as const, error: error instanceof Error ? error.message : String(error) }; }
    },
    prepare(projectId: string, fresh = false): Promise<FormalPreviewRecord> {
      if (closed) return Promise.reject(Error('正式试玩服务已关闭'));
      if (pending.has(projectId)) return Promise.reject(Error('该项目正在准备正式试玩，请等待完成'));
      const operation = (async () => {
        const { project, root, snapshots, latest } = paths(projectId);
        let record = fresh ? undefined : await read(projectId);
        if (!record) {
          const snapshot = await createGamePreviewSnapshot(project.root, snapshots);
          await git(snapshot.projectRoot, 'init', '--quiet');
          await git(snapshot.projectRoot, 'add', '-A');
          await git(snapshot.projectRoot, '-c', 'user.name=Worka Preview', '-c', 'user.email=worka-preview@local.invalid', 'commit', '--quiet', '-m', 'Snapshot current formal game');
          record = { projectId, key: `formal-${snapshot.manifest.id}`, snapshotId: snapshot.manifest.id, createdAt: snapshot.manifest.createdAt,
            commit: await git(snapshot.projectRoot, 'rev-parse', 'HEAD'), contentRevision: snapshot.manifest.contentRevision,
            runtimeRevision: snapshot.manifest.runtimeRevision, snapshotRevision: snapshot.manifest.snapshotRevision };
          await mkdir(root, { recursive: true });
          const temporary = join(root, `${record.snapshotId}.json.pending`);
          await writeFile(temporary, JSON.stringify(record), { mode: 0o600 });
          await rename(temporary, latest);
        }
        const repo = await validate(record);
        await options.register(record, repo);
        return record;
      })();
      pending.set(projectId, operation);
      void operation.finally(() => pending.delete(projectId)).catch(() => {});
      return operation;
    },
    async close() { closed = true; await Promise.allSettled([...pending.values()]); },
  };
}
