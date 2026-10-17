import { createHash, randomUUID } from 'node:crypto';
import { lstat, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, relative, resolve } from 'node:path';
import { completePublicationSource } from '@realiz3r/worka/desktop-package';

const noteIds = [1, 7, 8, 9, 10, 12] as const;
const contractSource = 'backend/plugins/cardgame-content/src/contract.ts';
const provenanceFile = 'content-sources.json';
const dependencyFields=['dependencies','devDependencies','peerDependencies','optionalDependencies','overrides'] as const;
const jsonRecord=(bytes:Buffer,name:string):Record<string,unknown>=>{const value:unknown=JSON.parse(bytes.toString('utf8'));if(!value||typeof value!=='object'||Array.isArray(value))throw Error(`Invalid content metadata: ${name}`);return value as Record<string,unknown>;};
const allowedImports = new Set(['@realiz3r/worka/extension-contracts', 'zod']);
const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const sourceName = (name: string) => !!name && !/[\\:\x00-\x1f]/.test(name) && !isAbsolute(name)
  && name.split('/').every(part => !!part && part !== '.' && part !== '..' && !/[. ]$/.test(part)
    && !['.git','node_modules','.sdk','.build'].includes(part) && !/^\.env(?:\.|$)|^(?:credentials|secrets)\.(?:json|ya?ml)$|\.(?:pem|key)$/i.test(part));
const instanceFile = (name: string) => !name.includes('/') && (['package.json','worka-note.json',provenanceFile,'README.md','SKILL.md',
  'bun.lock','bun.lockb','package-lock.json','npm-shrinkwrap.json','pnpm-lock.yaml','yarn.lock'].includes(name)
  || /(?:^|[.-])config(?:[.-]|$)/i.test(name) || /^icon\./i.test(name));

/** This is an import boundary for a trusted schema module, not a JavaScript sandbox. */
export function validateContentContract(source: string): void {
  const transpiler = new Bun.Transpiler({ loader: 'ts' });
  // Parse without running author code. Runtime imports and re-exports are checked
  // by Bun; the token pass also covers erased type imports and dynamic loaders.
  for (const dependency of transpiler.scanImports(source)) {
    if (dependency.kind !== 'import-statement' || !allowedImports.has(dependency.path))
      throw new Error(`Public content contract cannot import ${dependency.path}`);
  }
  const tokens = [...source.matchAll(/\/\/[^\r\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[\p{ID_Start}_$][\p{ID_Continue}$]*|[^\s]/gu)]
    .map(match => match[0]).filter(token => !token.startsWith('//') && !token.startsWith('/*'));
  const moduleName = (token: string | undefined) => {
    if (!token || !/^["']/.test(token)) throw new Error('Public content contract needs a literal static import');
    const name = token.slice(1, -1);
    if (name.includes('\\') || !allowedImports.has(name)) throw new Error(`Public content contract cannot import ${name}`);
  };
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    if (token === 'require' || token === 'import' && ['(', '.'].includes(tokens[index + 1]!))
      throw new Error('Public content contract cannot use dynamic imports or loaders');
    if (token === 'from' && /^["']/.test(tokens[index + 1] ?? '')) moduleName(tokens[index + 1]);
    if (token === 'import' && /^["']/.test(tokens[index + 1] ?? '')) moduleName(tokens[index + 1]);
  }
}

async function checkedPath(root: string, name: string): Promise<string> {
  const path = resolve(root, name), local = relative(root, path);
  if (isAbsolute(local) || local === '..' || local.startsWith('../') || local.startsWith('..\\'))
    throw new Error(`Content source path escapes the desktop: ${name}`);
  let cursor = root;
  for (const part of ['', ...local.split(/[\\/]/).filter(Boolean)]) {
    cursor = part ? resolve(cursor, part) : cursor;
    try {
      if ((await lstat(cursor)).isSymbolicLink()) throw new Error(`Content source path cannot contain a symlink: ${name}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }
  return path;
}

async function bytesAt(root: string, name: string): Promise<Buffer> {
  const path = await checkedPath(root, name);
  if (!(await lstat(path)).isFile()) throw new Error(`Content source must be a regular file: ${name}`);
  return readFile(path);
}

async function optionalBytes(root: string, name: string): Promise<Buffer | undefined> {
  try { return await bytesAt(root, name); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
}

async function replaceFile(root: string, name: string, bytes: Buffer): Promise<void> {
  const path = await checkedPath(root, name);
  await mkdir(dirname(path), {recursive:true});
  const temporary = resolve(dirname(path), `.${basename(path)}.content-${randomUUID()}`);
  try {
    await writeFile(temporary, bytes, { flag: 'wx' });
    await rename(temporary, path);
  } finally { await rm(temporary, { force: true }); }
}

function priorFiles(bytes: Buffer | undefined): string[] {
  if (!bytes) return [];
  const previous = JSON.parse(bytes.toString('utf8'));
  if (previous.schemaVersion !== 1 || !previous.files || typeof previous.files !== 'object' || Array.isArray(previous.files)
    || !Object.entries(previous.files).every(([name, digest]) => sourceName(name) && !instanceFile(name) && typeof digest === 'string' && /^[a-f\d]{64}$/.test(digest)))
    throw new Error('Invalid content source provenance');
  return Object.keys(previous.files);
}

/** Normal build preparation. Check mode verifies the same inventory without writes. */
export async function materializeContentNotes(root: string, options: { mode?: 'write' | 'check' } = {}) {
  root = resolve(root);
  const mode = options.mode ?? 'write';
  if (mode !== 'write' && mode !== 'check') throw new Error('Unknown content materialization mode');
  const contract = await bytesAt(root, contractSource);
  validateContentContract(contract.toString('utf8'));
  const sourceDirectory = await checkedPath(root, 'notes/note-1');
  const sources = new Map<string, Buffer>([['contract.ts', contract]]);
  const closure = await completePublicationSource(sourceDirectory, {schemaVersion:1,name:'Shared content business',files:[]}, {
    entrypoints:['actions.ts','view.tsx','worker.ts','model.ts','package.json','tsconfig.json'],
  });
  for (const name of closure.files) {
    if (name === 'contract.ts' || instanceFile(name)) continue;
    if (!sourceName(name)) throw Error(`Invalid shared content source: ${name}`);
    sources.set(name, await bytesAt(root, `notes/note-1/${name}`));
  }
  const sharedPackage=jsonRecord(await bytesAt(root,'notes/note-1/package.json'),'package.json');
  const files = Object.fromEntries([...sources].map(([name, bytes]) => [name, hash(bytes)]));
  const provenance = Buffer.from(JSON.stringify({ schemaVersion: 1, contractSource, sharedSource: 'notes/note-1', files }, null, 2) + '\n');
  const plans=[];
  const dependencyChanges:Array<{note:string;field:string;name:string;from:unknown;to:unknown}>=[];
  // Preflight the whole inventory before touching any note. Only previously owned
  // shared files can be removed; instance metadata and extra files stay untouched.
  for (const id of noteIds) {
    const directory = `notes/note-${id}`;
    if (!(await lstat(await checkedPath(root, directory))).isDirectory()) throw new Error(`Missing content note: ${directory}`);
    const previous = await optionalBytes(root, `${directory}/${provenanceFile}`);
    const prior = new Set(priorFiles(previous));
    const obsolete=[...prior].filter(name=>!sources.has(name));
    for (const name of [...sources.keys(), ...obsolete]) {
      const current=await optionalBytes(root, `${directory}/${name}`);
      if (previous && directory !== 'notes/note-1' && sources.has(name) && !prior.has(name) && current && hash(current) !== files[name])
        throw Error(`Shared source conflicts with an independent instance file: ${directory}/${name}`);
    }
    const packageBytes=await bytesAt(root,`${directory}/package.json`);
    const packageManifest=jsonRecord(packageBytes,`${directory}/package.json`);
    for(const field of dependencyFields){
      const required=sharedPackage[field];
      if(required===undefined)continue;
      if(!required||typeof required!=='object'||Array.isArray(required))throw Error(`Invalid shared ${field}`);
      const current=packageManifest[field];
      if(current!==undefined&&(!current||typeof current!=='object'||Array.isArray(current)))throw Error(`Invalid ${directory} ${field}`);
      for(const[name,to]of Object.entries(required)){const from=(current as Record<string,unknown>|undefined)?.[name];if(from!==undefined&&JSON.stringify(from)!==JSON.stringify(to))dependencyChanges.push({note:directory,field,name,from,to});}
      packageManifest[field]={...(current as Record<string,unknown>|undefined),...required};
    }
    const publicationBytes=await bytesAt(root,`${directory}/worka-note.json`);
    const publication=jsonRecord(publicationBytes,`${directory}/worka-note.json`);
    if(!Array.isArray(publication.files)||publication.files.some(file=>typeof file!=='string'))throw Error(`Invalid content source list: ${directory}`);
    const owned=new Set([...priorFiles(previous),...sources.keys()]);
    // Worka derives code/type imports from actions/view. Only explicit extra resources stay here.
    publication.files=[...new Set(publication.files.filter(file=>!owned.has(file)))];
    const metadata=[['package.json',packageBytes,Buffer.from(JSON.stringify(packageManifest,null,2)+'\n')],['worka-note.json',publicationBytes,Buffer.from(JSON.stringify(publication,null,2)+'\n')]] as const;
    plans.push({directory,obsolete,previous,metadata});
  }
  let written = 0, removed = 0;
  for (const {directory,obsolete,previous,metadata} of plans) {
    for (const [name, bytes] of sources) {
      // note-1 owns its shared source. Never write an earlier captured copy back
      // over a concurrent author edit; the final hash guard detects that edit.
      if (directory === 'notes/note-1' && name !== 'contract.ts') continue;
      const target = `${directory}/${name}`;
      const current = await optionalBytes(root, target);
      if (current && hash(current) === files[name]) continue;
      if (mode === 'check') throw new Error(`Content source hash mismatch: ${target}`);
      await replaceFile(root, target, bytes); written++;
      if (hash(await bytesAt(root, target)) !== files[name]) throw new Error(`Content source hash mismatch after copy: ${target}`);
    }
    for (const name of obsolete) {
      // Canonical unreferenced drafts remain the author's files; only generated
      // copies in the other instances belong to this cleanup.
      if (directory === 'notes/note-1') continue;
      if (!await optionalBytes(root, `${directory}/${name}`)) continue;
      if (mode === 'check') throw new Error(`Obsolete generated content source: ${directory}/${name}`);
      await rm(await checkedPath(root, `${directory}/${name}`)); removed++;
    }
    for(const [name,current,next]of metadata){
      if(current.equals(next))continue;
      if(mode==='check')throw Error(`Content metadata mismatch: ${directory}/${name}`);
      await replaceFile(root,`${directory}/${name}`,next);written++;
    }
    if (!previous?.equals(provenance)) {
      if (mode === 'check') throw new Error(`Content source provenance mismatch: ${directory}/${provenanceFile}`);
      await replaceFile(root, `${directory}/${provenanceFile}`, provenance); written++;
    }
  }
  // A concurrent source edit must not silently package a mixed generation.
  if (hash(await bytesAt(root, contractSource)) !== files['contract.ts']) throw new Error('Public content contract changed during materialization');
  for (const [name] of sources) {
    if (name !== 'contract.ts' && hash(await bytesAt(root, `notes/note-1/${name}`)) !== files[name])
      throw new Error(`Shared content source changed during materialization: ${name}`);
  }
  return { notes: noteIds.length, contractSha256: files['contract.ts'], files:Object.keys(files),written,removed,dependencyChanges };
}
