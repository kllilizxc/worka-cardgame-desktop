import { createHash } from 'node:crypto';
import { afterEach, expect, test } from 'bun:test';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createProjectBindingManager, desktopProjectId, validateProjectRoot } from '../project-binding';
import { requestExtension, readExtension, type ResourceSnapshot } from '@dsh-workbench/runtime';
import type { ResourceRequest, ResourcesClient } from '@dsh-workbench/runtime/internal';
import { configureProjectContract, contentActions, contentQueries } from '../plugins/cardgame-content/src/contract';

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
  const invocations: Array<{ method: string; input: any; caller: any }> = [];
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
          async invoke(method, input, caller) { invocations.push({ method, input, caller }); return { method, projectId: input.projectId, url: proxy.issue('cardgame-content', input) }; },
          async noteContext() { return ['scoped context']; },
          async close() { releaseMedia(); events.push('close:' + projects[0]!.id); },
        };
      }, ...extra,
    });
    managers.push(created); return created;
  }
  return { host, media, manager, note, notes, configs, records, events, invocations, mediaHandlers, setLoad: (value: typeof load) => load = value,
    setWriteFailure(value: boolean) { failWrite = value; }, get createCount() { return createCount; }, get validationCount() { return validationCount; }, get releaseSubscription() { return releaseSubscription; } };
}
const mediaInput = (f: ReturnType<typeof fixture>, projectId: string) => ({projectId,projectGeneration:f.records.get(projectId).value.generation});
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
  expect(await read(manager, { op: 'cards' })).toMatchObject({ projectId: desktopProjectId('a'), items: [] });
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
  const image = await f.mediaHandlers.get('cardgame-content')(mediaInput(f, desktopProjectId('a')));
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
  expect((await f.mediaHandlers.get('cardgame-content')(mediaInput(f, desktopProjectId('a')))).path).toBe(rootA + '/synthetic.png');
  expect((await f.mediaHandlers.get('cardgame-content')(mediaInput(f, desktopProjectId('b')))).path).toBe(rootB + '/synthetic.png');
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
 await configure(manager,a); const oldMedia=mediaInput(f,desktopProjectId('a'));await read(manager,{op:'cards'});
 const dispose=await manager.resources!.query!.subscribe!({op:'cards'},()=>{},context());
 let enter!:()=>void,finish!:()=>void;const entered=new Promise<void>(resolve=>enter=resolve);
 f.setLoad(async()=>{enter();await new Promise<void>(resolve=>finish=resolve);return {old:true};});
 const pending=read(manager,{op:'cards'});await entered;
 const switching=configure(manager,b);await new Promise(resolve=>setTimeout(resolve,20));
 expect(f.events.filter(e=>e.startsWith('close:'))).toHaveLength(0);
 await expect(read(manager,{op:'cards'})).rejects.toThrow('切换');
 finish();await pending;await switching;
 expect(f.events.filter(e=>e.startsWith('close:'))).toHaveLength(1);expect(f.releaseSubscription).toBeGreaterThan(0);
 await expect(f.mediaHandlers.get('cardgame-content')(oldMedia)).rejects.toThrow('旧项目');
 expect((await f.mediaHandlers.get('cardgame-content')(mediaInput(f,desktopProjectId('a')))).path).toBe(b+'/synthetic.png');
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

test('binding epoch is durable, changes on rebind, and fences stale same-id actions/receipts',async()=>{
 const a=await project(),b=await project(),f=fixture(),manager=f.manager();
 await configure(manager,a);
 const initial=(await read(manager,{op:'projectBinding'}) as any).projectGeneration;
 expect(initial).toMatch(/^[0-9a-f-]{36}$/);
 await configure(manager,a);expect((await read(manager,{op:'projectBinding'}) as any).projectGeneration).toBe(initial);
 await expect(manager.invoke('updateProduction',{productionId:'same',baseRevision:1,projectGeneration:initial},user())).resolves.toMatchObject({method:'updateProduction'});
 await configure(manager,b);
 const next=(await read(manager,{op:'projectBinding'}) as any).projectGeneration;expect(next).not.toBe(initial);
 for(const method of ['updateProduction','bindProduction','productionResult','recordCandidates','recordAdoption'])await expect(manager.invoke(method,{productionId:'same',baseRevision:1,projectGeneration:initial},user())).rejects.toThrow('旧编辑或回执');
 for(const method of ['bindProduction','productionResult','recordCandidates','recordAdoption'])await expect(manager.invoke(method,{productionId:'same'},user())).rejects.toThrow('旧回执缺少');
 await expect(read(manager,{op:'production',productionId:'same',projectGeneration:initial})).rejects.toThrow('旧编辑或回执');
 await configure(manager,a);expect((await read(manager,{op:'projectBinding'}) as any).projectGeneration).not.toBe(initial);
});
test('legacy epoch migration persists once before work and persistence failure does not grant access',async()=>{
 const root=await project(),f=fixture(),manager=f.manager();await configure(manager,root);
 const stored=f.records.get(desktopProjectId('a'));delete stored.value.generation;
 f.setWriteFailure(true);await expect(read(manager,{op:'cards'})).rejects.toThrow('durable write failure');expect(f.createCount).toBe(0);
 f.setWriteFailure(false);const first=await read(manager,{op:'projectBinding'}) as any;
 expect(first.projectGeneration).toMatch(/^[0-9a-f-]{36}$/);expect(f.records.get(desktopProjectId('a')).value.generation).toBe(first.projectGeneration);
 await manager.close();const reopened=f.manager();expect((await read(reopened,{op:'projectBinding'}) as any).projectGeneration).toBe(first.projectGeneration);
});

test('legacy reconciliation privilege is persisted for one unchanged binding and cannot be caller-spoofed after rebind',async()=>{
 const f=fixture(),root=await project(),manager=f.manager(),projectId=desktopProjectId('a');
 await configure(manager,root);const row=f.records.get(projectId);delete row.value.generation;
 let seen:any;f.setLoad(async input=>{seen=input;return {items:[]};});
 await read(manager,{op:'cards'});const generation=f.records.get(projectId).value.generation;
 expect(seen.allowLegacyReconciliation).toBe(true);expect(f.records.get(projectId).value.legacyGeneration).toBe(generation);
 await configure(manager,root);await read(manager,{op:'cards'});expect(seen.allowLegacyReconciliation).toBe(true);
 await configure(manager,await project());await read(manager,{op:'cards',allowLegacyReconciliation:true});expect(seen.allowLegacyReconciliation).toBe(false);
 await configure(manager,root);await read(manager,{op:'cards',allowLegacyReconciliation:true});expect(seen.allowLegacyReconciliation).toBe(false);expect(f.records.get(projectId).value.generation).not.toBe(generation);
});


/** These adapters are test transports only: the manager remains the real authority. */
function helperTransports(manager: ReturnType<typeof createProjectBindingManager>, caller = user()) {
  const requests: Array<{ extension: string; method: string; input: unknown }> = [];
  const reads: ResourceRequest[] = [];
  const extensions = { request: async (extension: string, method: string, input?: Record<string, unknown>) => {
    requests.push({ extension, method, input });
    expect(extension).toBe('cardgame-content');
    return manager.invoke(method, input ?? {}, caller);
  } };
  const resources: Pick<ResourcesClient, 'read'> = { read: async <T>(request: ResourceRequest) => {
    reads.push(request);
    expect(request.name).toBe('extension.cardgame-content.query');
    const data = await manager.resources!.query!.load(request.input, context(caller.noteId));
    return { key: 'fixture-query', epoch: 'fixture-epoch', version: 1, stale: false, data } as ResourceSnapshot<T>;
  } };
  return { extensions, resources, requests, reads };
}

test('typed configure helper preserves desktop scope through the actual manager guard', async () => {
  const root = await project(), f = fixture(), manager = f.manager();
  const transport = helperTransports(manager);
  await expect(requestExtension(transport.extensions, configureProjectContract, { root, desktopId: 'b' })).rejects.toThrow('另一桌面');
  expect(transport.requests).toEqual([{ extension: 'cardgame-content', method: 'configureProject', input: { root, desktopId: 'b' } }]);
  expect(f.validationCount).toBe(0); expect(f.createCount).toBe(0); expect(f.records.size).toBe(0);
});

test('typed command helpers preserve project and epoch fields so real manager guards reject stale or foreign work', async () => {
  const root = await project(), f = fixture(), manager = f.manager(); await configure(manager, root);
  const transport = helperTransports(manager), projectId = desktopProjectId('a');
  const generation = f.records.get(projectId).value.generation;
  for (const attack of [
    { projectId: desktopProjectId('b'), projectGeneration: generation, message: '另一桌面' },
    { projectId, projectGeneration: 'expired-generation', message: '旧编辑或回执' },
  ]) {
    const input = { projectId: attack.projectId, projectGeneration: attack.projectGeneration, path: 'knowledge/example.md', content: 'must not write' };
    await expect(requestExtension(transport.extensions, contentActions.saveDocument.method, input)).rejects.toThrow(attack.message);
    expect(transport.requests.at(-1)!.input).toEqual(input);
  }
  // Moving the host-owned note to another desktop must also fence its old input.
  f.notes.get('a-cards').desktopId = 'b';
  await expect(requestExtension(transport.extensions, contentActions.saveDocument.method, { projectId, projectGeneration: generation, path: 'knowledge/example.md', content: 'must not write' })).rejects.toThrow('另一桌面');
  expect(f.createCount).toBe(0); expect(f.invocations).toEqual([]);
});

test('typed resource helper preserves project and epoch through the actual manager resource load', async () => {
  const root = await project(), f = fixture(), manager = f.manager(); await configure(manager, root);
  const transport = helperTransports(manager), projectId = desktopProjectId('a');
  const generation = f.records.get(projectId).value.generation;
  for (const attack of [
    { projectId: desktopProjectId('b'), projectGeneration: generation, message: '另一桌面' },
    { projectId, projectGeneration: 'expired-generation', message: '旧编辑或回执' },
  ]) {
    const input = { op: 'cards' as const, projectId: attack.projectId, projectGeneration: attack.projectGeneration, limit: 1 };
    await expect(readExtension(transport.resources, contentQueries.cards.resource, input)).rejects.toThrow(attack.message);
    expect(transport.reads.at(-1)!.input).toEqual(input);
  }
  expect(f.createCount).toBe(0);
  let childInput: any;
  f.setLoad(async input => { childInput = input; return { items: [], total: 0, revision: 'fixture-1' }; });
  const valid = { op: 'cards' as const, projectId, projectGeneration: generation, limit: 1 };
  const snapshot = await readExtension(transport.resources, contentQueries.cards.resource, valid);
  expect(snapshot.data).toEqual({ items: [], total: 0, revision: 'fixture-1', projectGeneration: generation }); expect(transport.reads.at(-1)!.input).toEqual(valid);
  expect(childInput).toMatchObject({ projectId, projectGeneration: generation, allowLegacyReconciliation: false });
  expect(f.createCount).toBe(1);
  f.notes.get('a-cards').desktopId = 'b';
  await expect(readExtension(transport.resources, contentQueries.cards.resource, valid)).rejects.toThrow('另一桌面');
});

for (const forged of [
  { _draftSource: { kind: 'native-session', noteId: 'b-cards', sessionId: 'forged' } },
  { allowLegacyReconciliation: true },
  { desktopId: 'b' },
  { caller: { kind: 'user', noteId: 'b-cards' } },
  { access: { noteId: 'b-cards' } },
]) test(`typed helper rejects undeclared authority before dispatch: ${Object.keys(forged)[0]}`, async () => {
  const root = await project(), f = fixture(), manager = f.manager(); await configure(manager, root);
  const transport = helperTransports(manager), projectId = desktopProjectId('a');
  const projectGeneration = f.records.get(projectId).value.generation;
  await expect(requestExtension(transport.extensions, contentActions.saveDocument.method, { projectId, projectGeneration, path: 'knowledge/example.md', content: 'must not write', ...forged } as never)).rejects.toThrow();
  await expect(readExtension(transport.resources, contentQueries.cards.resource, { projectId, projectGeneration, op: 'cards', ...forged } as never)).rejects.toThrow();
  expect(transport.requests).toEqual([]); expect(transport.reads).toEqual([]);
  expect(f.createCount).toBe(0); expect(f.invocations).toEqual([]);
});

for (const flag of ['readOnly', 'dryRun', 'replay'] as const) test(`typed configure helper cannot erase the host-bound caller ${flag} restriction`, async () => {
  const f = fixture(), manager = f.manager();
  const caller: ReturnType<typeof user> & Partial<Record<'readOnly' | 'dryRun' | 'replay', boolean>> = { ...user(), [flag]: true };
  const transport = helperTransports(manager, caller);
  await expect(requestExtension(transport.extensions, configureProjectContract, { root: '/must-not-be-read' })).rejects.toThrow('仅允许');
  expect(transport.requests).toHaveLength(1);
  expect(caller[flag]).toBe(true);
  expect(f.validationCount).toBe(0); expect(f.createCount).toBe(0); expect(f.records.size).toBe(0);
});
