import { createHash } from 'node:crypto';
import { afterEach, expect, test } from 'bun:test';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createProjectBindingManager, desktopProjectId, validateProjectRoot } from '../project-binding';

const temporary: string[] = [];
const managers: ReturnType<typeof createProjectBindingManager>[] = [];
afterEach(async () => {
  await Promise.allSettled(managers.splice(0).map(manager => manager.close()));
  await Promise.all(temporary.splice(0).map(path => rm(path, { recursive: true, force: true })));
});
async function project() {
  const root = await mkdtemp(join(tmpdir(), 'cardgame-binding-')); temporary.push(root);
  await mkdir(join(root, 'public/data/cards'), { recursive: true });
  await writeFile(join(root, 'package.json'), JSON.stringify({ name: 'synthetic-cardgame' }));
  await writeFile(join(root, 'public/data/cards/units.json'), JSON.stringify({ units: [] }));
  return root;
}
function fixture() {
  const notes = new Map<string, any>();
  const configs = new Map<string, any>();
  const records = new Map<string, any>();
  const events: string[] = [];
  let serial = 0, createCount = 0, validationCount = 0, failWrite = false;
  const mediaHandlers = new Map<string, any>();
  const row = (value: any) => ({ value: structuredClone(value), revision: String(++serial) });
  function note(desktopId: string, role: string | undefined, id = `${desktopId}-${role ?? 'weather'}`) {
    notes.set(id, { id, desktopId, stateRef: id + ':state', archived: false, draft: false });
    configs.set(id + ':config', row({ ...(role ? { cardgameRole: role } : {}), unrelated: { keep: true }, projectRoot: '/never-read-imported-root', notes: { imported: 'foreign-id' } }));
    return id;
  }
  for (const desk of ['a', 'b']) { note(desk, 'cards'); note(desk, 'preview'); note(desk, undefined); }
  const host: any = {
    dataRoot: '/runtime-only-synthetic-data',
    app: {
      records: () => ({
        async read(key: string) { return structuredClone(records.get(key)); },
        async write(key: string, value: any, options: any) {
          if (failWrite) throw Error('synthetic durable write failure');
          if ((records.get(key)?.revision ?? null) !== options.expectedRevision) throw Error('binding CAS conflict');
          const saved = row(value); records.set(key, saved); return structuredClone(saved);
        },
      }),
      async note(id: string) { const value = notes.get(id); if (!value) throw Error('note not found'); return row(value); },
      core: {
        async readRecord(_table: string, key: string) { return structuredClone(configs.get(key)); },
        // Deliberately return neighbors to prove the manager verifies every desktop itself.
        async listNotes() { return [...notes.values()].map(value => row(value)); },
        async updateRecord(_table: string, key: string, update: any) {
          const saved = row(await update(structuredClone(configs.get(key)?.value)));
          configs.set(key, saved); events.push('write:' + key); return structuredClone(saved);
        },
      },
    },
  };
  const media: any = {
    register(name: string, resolver: any) {
      if (mediaHandlers.has(name)) throw Error('duplicate media provider');
      mediaHandlers.set(name, resolver); return () => mediaHandlers.delete(name);
    },
    issue(name: string, input: any) { return JSON.stringify({ name, input }); },
  };
  let load: (input: any) => Promise<any> = async input => ({ projectId: input.projectId, items: [] });
  let releaseSubscription = 0;
  function manager(extra: any = {}) {
    const created = createProjectBindingManager({ host, media, packageRoot: '/package', bunPath: '/approved/bun',
      isNoteController: (caller, noteId) => caller.kind === 'user' || caller.kind === 'agent' && caller.controlNoteId === noteId,
      validateRoot: async root => { validationCount++; return validateProjectRoot(root); },
      async createProvider(childHost, proxy, _packageRoot, _bunPath, projects, previewNote) {
        createCount++; events.push('create:' + projects[0]!.id);
        expect(childHost.dataRoot).toContain(projects[0]!.id);
        expect(await previewNote(projects[0]!.id)).toBe(`${projects[0]!.id === desktopProjectId('a') ? 'a' : 'b'}-preview`);
        const releaseMedia = proxy.register('cardgame-content', async input => ({ path: projects[0]!.root + '/synthetic.png', mimeType: 'image/png', revision: String(input.projectId) }));
        return {
          resources: { query: { version: '1', load: async input => load(input), subscribe: async () => () => { releaseSubscription++; } } },
          async invoke(method, input) { return { method, projectId: input.projectId, url: proxy.issue('cardgame-content', input) }; },
          async noteContext() { return ['scoped context']; },
          async close() { releaseMedia(); events.push('close:' + projects[0]!.id); },
        };
      }, ...extra,
    });
    managers.push(created); return created;
  }
  return { host, media, manager, note, notes, configs, records, events, mediaHandlers, setLoad: (value: typeof load) => load = value,
    setWriteFailure(value: boolean) { failWrite = value; }, get createCount() { return createCount; }, get validationCount() { return validationCount; }, get releaseSubscription() { return releaseSubscription; } };
}
const mediaInput = (root: string, projectId: string) => ({ projectId, projectGeneration: createHash('sha256').update(root).digest('hex').slice(0,24) });
const user = (noteId = 'a-cards') => ({ kind: 'user' as const, noteId });
const context = (noteId = 'a-cards') => ({ scope: { workspace: 'test', access: 'test', noteId }, signal: new AbortController().signal, read: async () => null }) as any;
const configure = (manager: ReturnType<typeof createProjectBindingManager>, root: string, caller: any = user()) => manager.invoke('configureProject', { root }, caller);
const read = (manager: ReturnType<typeof createProjectBindingManager>, input: any, noteId = 'a-cards') => manager.resources!.query!.load(input, context(noteId));

test('unconfigured import/status never selects imported paths or creates a child', async () => {
  const f = fixture(), manager = f.manager();
  expect(f.validationCount).toBe(0); expect(f.createCount).toBe(0);
  expect(await read(manager, { op: 'projectBinding', root: '/untrusted-query-root' })).toEqual({ configured: false, setupRequired: true, projectId: desktopProjectId('a') });
  await expect(read(manager, { op: 'cards' })).rejects.toThrow('尚未配置');
  expect(f.validationCount).toBe(0); expect(f.createCount).toBe(0);
  expect(f.events).toEqual([]);
});

test('root validation rejects relative, nonexistent, malformed and symlinked projects', async () => {
  await expect(validateProjectRoot('relative/project')).rejects.toThrow('绝对');
  await expect(validateProjectRoot('/nonexistent-cardgame-fixture-path')).rejects.toThrow();
  const root = await project();
  await writeFile(join(root, 'package.json'), 'invalid');
  await expect(validateProjectRoot(root)).rejects.toThrow();
  await writeFile(join(root, 'package.json'), '{"name":"synthetic-cardgame"}');
  const outside = await project();
  await rm(join(root, 'public/data/cards/units.json'));
  await symlink(join(outside, 'public/data/cards/units.json'), join(root, 'public/data/cards/units.json'));
  await expect(validateProjectRoot(root)).rejects.toThrow('越界');
  const link = join(outside, 'root-link'); await symlink(root, link);
  await expect(validateProjectRoot(link)).rejects.toThrow('实际目录');
});

for (const caller of [
  { kind: 'schedule', noteId: 'a-cards' }, { kind: 'action', noteId: 'a-cards' },
  { kind: 'agent', noteId: 'a-cards', controlNoteId: 'b-cards' },
  { kind: 'user', noteId: 'a-cards', dryRun: true }, { kind: 'user', noteId: 'a-cards', replay: true },
  { kind: 'agent', noteId: 'a-cards', controlNoteId: 'a-cards', readOnly: true },
  { kind: 'agent', noteId: 'a-cards', controlNoteId: 'a-cards', scheduleId: 'scheduled' },
]) test(`setup denies ${JSON.stringify(caller)} before root access`, async () => {
  const f = fixture(), manager = f.manager();
  await expect(configure(manager, '/must-not-be-read', caller)).rejects.toThrow('仅允许');
  expect(f.validationCount).toBe(0); expect(f.events).toEqual([]);
});

test('setup rejects duplicate/missing roles before filesystem access', async () => {
  const f = fixture(); f.note('a', 'cards', 'a-duplicate');
  const manager = f.manager();
  await expect(configure(manager, '/must-not-be-read')).rejects.toThrow('重复');
  expect(f.validationCount).toBe(0);
  f.notes.delete('a-duplicate'); f.notes.delete('a-preview');
  await expect(configure(manager, '/must-not-be-read')).rejects.toThrow('缺少');
  expect(f.validationCount).toBe(0);
});

test('owner Agent setup changes only tagged same-desktop config and remains lazy', async () => {
  const root = await project(), f = fixture(), manager = f.manager();
  const beforeNeighbor = structuredClone(f.configs.get('b-cards:config'));
  const beforeWeather = structuredClone(f.configs.get('a-weather:config'));
  await configure(manager, root, { kind: 'agent', noteId: 'a-cards', controlNoteId: 'a-cards', approve: async () => true });
  expect(f.createCount).toBe(0);
  expect(f.configs.get('a-cards:config').value).toEqual({ cardgameRole: 'cards', unrelated: { keep: true }, projectId: desktopProjectId('a'), projectRoot: root, notes: { imported: 'foreign-id', cards: 'a-cards', preview: 'a-preview' } });
  expect(f.configs.get('b-cards:config')).toEqual(beforeNeighbor);
  expect(f.configs.get('a-weather:config')).toEqual(beforeWeather);
  await expect(read(manager, { op: 'cards', projectId: desktopProjectId('b') })).rejects.toThrow('另一桌面');
  await expect(manager.invoke('configureProject', { root, desktopId: 'b' }, user())).rejects.toThrow('另一桌面');
  expect(await read(manager, { op: 'cards' })).toEqual({ projectId: desktopProjectId('a'), items: [] });
  expect(f.createCount).toBe(1);
  await configure(manager, root);
  await read(manager, { op: 'cards' }); expect(f.createCount).toBe(1);
  const different = await project();
  await configure(manager, different);
  expect(await read(manager, {op:'projectBinding'})).toMatchObject({projectRoot:different});
  await read(manager,{op:'cards'}); expect(f.createCount).toBe(2);
});

test('persisted binding restores after restart with lazy media and query routing', async () => {
  const root = await project(), f = fixture(), manager = f.manager();
  await configure(manager, root); await manager.close();
  const restored = f.manager();
  expect(f.createCount).toBe(0);
  expect(await read(restored, { op: 'projectBinding' })).toMatchObject({ configured: true, projectRoot: root });
  expect(f.createCount).toBe(0);
  const result = await restored.invoke('synthetic', {}, user()) as any;
  expect(JSON.parse(result.url).input.projectId).toBe(desktopProjectId('a'));
  const image = await f.mediaHandlers.get('cardgame-content')(mediaInput(root, desktopProjectId('a')));
  expect(image.path).toBe(root + '/synthetic.png');
  expect(f.createCount).toBe(1);
  await expect(f.mediaHandlers.get('cardgame-content')({ projectId: desktopProjectId('b') })).rejects.toThrow('尚未配置');
  f.notes.get('a-cards').desktopId = 'b';
  await expect(read(restored, { op: 'cards', projectId: desktopProjectId('a') })).rejects.toThrow('另一桌面');
});

test('two desktops keep independent providers and only one media registration', async () => {
  const rootA = await project(), rootB = await project(), f = fixture(), manager = f.manager();
  await configure(manager, rootA); await configure(manager, rootB, user('b-cards'));
  await Promise.all([read(manager, { op: 'cards' }), read(manager, { op: 'cards' }, 'b-cards'), read(manager, { op: 'cards' })]);
  expect(f.createCount).toBe(2); expect(f.mediaHandlers.size).toBe(1);
  expect((await f.mediaHandlers.get('cardgame-content')(mediaInput(rootA, desktopProjectId('a')))).path).toBe(rootA + '/synthetic.png');
  expect((await f.mediaHandlers.get('cardgame-content')(mediaInput(rootB, desktopProjectId('b')))).path).toBe(rootB + '/synthetic.png');
  await manager.close();
  expect(f.events.filter(value => value.startsWith('close:'))).toHaveLength(2);
  expect(f.mediaHandlers.size).toBe(0);
});

test('configuration invalidates an unconfigured subscription and attaches child subscription', async () => {
  const root = await project(), f = fixture(), manager = f.manager(); let changes = 0;
  const dispose = await manager.resources!.query!.subscribe!({ op: 'cards' }, () => { changes++; }, context());
  expect(f.createCount).toBe(0);
  await configure(manager, root);
  // Await the managed reattachment rather than a fixed timeout.
  await dispose!();
  expect(changes).toBe(1);
  expect(f.releaseSubscription).toBeLessThanOrEqual(1);
});

test('close drains admitted queries, closes children once and rejects later work', async () => {
  const root = await project(), f = fixture(), manager = f.manager();
  await configure(manager, root); await read(manager, { op: 'cards' });
  let finish!: () => void, entered!: () => void;
  const started = new Promise<void>(resolve => { entered = resolve; });
  f.setLoad(async () => { entered(); await new Promise<void>(resolve => { finish = resolve; }); return { done: true }; });
  const pending = read(manager, { op: 'cards' }); await started;
  const closing = manager.close();
  expect(f.events.filter(value => value.startsWith('close:'))).toHaveLength(0);
  await expect(read(manager, { op: 'cards' })).rejects.toThrow('关闭');
  finish(); await pending; await closing; await manager.close();
  expect(f.events.filter(value => value.startsWith('close:'))).toHaveLength(1);
});

test('incomplete config projections never become authority and same setup repairs failed persistence', async () => {
  const root = await project(), f = fixture(), manager = f.manager(); f.setWriteFailure(true);
  await expect(configure(manager, root)).rejects.toThrow('durable write failure');
  expect(f.configs.get('a-cards:config').value.projectRoot).toBe('/never-read-imported-root');
  expect(await read(manager, { op: 'projectBinding' })).toMatchObject({ configured: false, setupRequired: true });
  await expect(read(manager, { op: 'cards' })).rejects.toThrow('尚未配置');
  expect(f.createCount).toBe(0);
  f.setWriteFailure(false); await configure(manager, root);
  expect(await read(manager, { op: 'projectBinding' })).toMatchObject({ configured: true });
  expect(await read(manager, { op: 'cards' })).toMatchObject({ projectId: desktopProjectId('a') });
});

test('root validation rejects unrelated JSON instead of treating every object as game data', async () => {
  const root = await project();
  await writeFile(join(root, 'public/data/cards/units.json'), '{}');
  await expect(validateProjectRoot(root)).rejects.toThrow('JSON 无效');
  await writeFile(join(root, 'public/data/cards/units.json'), '{"units":[]}');
  await writeFile(join(root, 'package.json'), '{}');
  await expect(validateProjectRoot(root)).rejects.toThrow('JSON 无效');
});

test('shutdown aggregates media/subscription errors and still closes the child', async () => {
  const root = await project(), f = fixture(); let childClosed = false;
  const manager = f.manager({
    media: { ...f.media, register(name: string, resolver: any) {
      const release = f.media.register(name, resolver);
      return () => { release(); throw Error('media teardown failure'); };
    } },
    async createProvider() { return {
      resources: { query: { version: '1', load: async () => null, subscribe: async () => () => { throw Error('subscription teardown failure'); } } },
      invoke: async () => null,
      async close() { childClosed = true; },
    }; },
  });
  await configure(manager, root);
  await manager.resources!.query!.subscribe!({ op: 'cards' }, () => {}, context());
  let failure: any;
  try { await manager.close(); } catch (error) { failure = error; }
  expect(failure).toBeInstanceOf(AggregateError);
  expect(failure.errors.map((error: Error) => error.message)).toEqual(['media teardown failure', 'subscription teardown failure']);
  expect(childClosed).toBe(true);
});

for (const approve of [undefined, async () => false]) test('owner Agent cannot bind a root without native approval', async () => {
 const f=fixture(), manager=f.manager();
 await expect(configure(manager,'/must-not-be-read',{kind:'agent',noteId:'a-cards',controlNoteId:'a-cards',approve})).rejects.toThrow('原生确认');
 expect(f.validationCount).toBe(0);expect(f.events).toEqual([]);
});
test('changing roots drains old requests and subscriptions, isolates data and invalidates old media', async () => {
 const a=await project(),b=await project(),f=fixture(),manager=f.manager();
 await configure(manager,a);await read(manager,{op:'cards'});
 const dispose=await manager.resources!.query!.subscribe!({op:'cards'},()=>{},context());
 let enter!:()=>void,finish!:()=>void;const entered=new Promise<void>(resolve=>enter=resolve);
 f.setLoad(async()=>{enter();await new Promise<void>(resolve=>finish=resolve);return {old:true};});
 const pending=read(manager,{op:'cards'});await entered;
 const switching=configure(manager,b);await new Promise(resolve=>setTimeout(resolve,20));
 expect(f.events.filter(e=>e.startsWith('close:'))).toHaveLength(0);
 await expect(read(manager,{op:'cards'})).rejects.toThrow('切换');
 finish();await pending;await switching;
 expect(f.events.filter(e=>e.startsWith('close:'))).toHaveLength(1);expect(f.releaseSubscription).toBeGreaterThan(0);
 await expect(f.mediaHandlers.get('cardgame-content')(mediaInput(a,desktopProjectId('a')))).rejects.toThrow('旧项目');
 expect((await f.mediaHandlers.get('cardgame-content')(mediaInput(b,desktopProjectId('a')))).path).toBe(b+'/synthetic.png');
 await dispose!();
});
test('bad replacement and failed persistence preserve the old binding and restore config projections', async () => {
 const a=await project(),b=await project(),f=fixture(),manager=f.manager();await configure(manager,a);await read(manager,{op:'cards'});
 await expect(configure(manager,'/nonexistent-cardgame-replacement')).rejects.toThrow();
 expect(await read(manager,{op:'projectBinding'})).toMatchObject({projectRoot:a});expect(f.events.filter(e=>e.startsWith('close:'))).toHaveLength(0);
 f.setWriteFailure(true);await expect(configure(manager,b)).rejects.toThrow('durable write failure');
 expect(await read(manager,{op:'projectBinding'})).toMatchObject({projectRoot:a});expect(f.configs.get('a-cards:config').value.projectRoot).toBe(a);
 await read(manager,{op:'cards'});expect(f.createCount).toBe(2);
});

test('root change stops only previews owned by current desktop roles', async () => {
 const a=await project(),b=await project(),f=fixture(),stopped:string[]=[];
 f.host.previewProcesses={list:async()=>[{key:'own',value:{noteId:'a-preview'}},{key:'neighbor',value:{noteId:'b-preview'}},{key:'unowned',value:{}}],stop:async(key:string)=>{stopped.push(key);}};
 const manager=f.manager();await configure(manager,a);await configure(manager,b);expect(stopped).toEqual(['own']);
});
test('failed old provider disposal cannot create an overlapping new provider', async () => {
 const a=await project(),b=await project(),f=fixture();let creates=0;
 const manager=f.manager({createProvider:async()=>{creates++;return{invoke:async()=>({}),resources:{query:{version:'1',load:async()=>({})}},close:async()=>{throw Error('synthetic failed disposal');}};}});
 await configure(manager,a);await read(manager,{op:'cards'});
 await expect(configure(manager,b)).rejects.toThrow('failed disposal');
 await expect(read(manager,{op:'cards'})).rejects.toThrow('重启');
 await expect(configure(manager,b)).rejects.toThrow('重启');expect(creates).toBe(1);
});
