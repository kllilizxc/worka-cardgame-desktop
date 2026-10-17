import { createHash, randomUUID } from 'node:crypto';
import { lstat, readFile, realpath } from 'node:fs/promises';
import { isAbsolute, join, relative, sep } from 'node:path';
import type { Caller, Extension, ResourceContext, ResourceValue, WorkaExtensionHost } from '@realiz3r/worka/host';
import type { CardgameProject } from './plugins/cardgame-content/src/registration';

type Media = NonNullable<WorkaExtensionHost['media']>;
type MediaResolver = Parameters<Media['register']>[1];
type Note = Awaited<ReturnType<WorkaExtensionHost['app']['note']>>['value'];
type Config = Record<string, unknown>;
export const CARDGAME_ROLES = ['cards', 'execution', 'preview', 'production', 'tracker', 'knowledge', 'assets', 'audio', 'story', 'todo', 'balance'] as const;
const roles = new Set<string>(CARDGAME_ROLES);
const providerName = 'cardgame-content';
const record = (value: unknown): value is Config => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
export const desktopProjectId = (desktopId: string) => `cardgame-${createHash('sha256').update(desktopId).digest('hex').slice(0, 32)}`;

/** Runtime-only owner configuration. These records and paths are never package inputs. */
export interface ProjectBinding {
  schemaVersion: 1;
  desktopId: string;
  projectId: string;
  root: string;
  notes: Record<string, string>;
  /** Opaque durable binding epoch; never a user-supplied directory identity. */
  generation?: string;
  /** Only the first in-place upgrade may reconcile unversioned historical rounds. */
  legacyGeneration?: string;
}
export type CardgameProviderFactory = (host: WorkaExtensionHost, media: Media, packageRoot: string, bunPath: string,
  projects: CardgameProject[], previewNote: (projectId: string) => Promise<string>) => Promise<Extension>;
export interface ProjectBindingOptions {
  host: WorkaExtensionHost;
  media: Media;
  packageRoot: string;
  bunPath: string;
  createProvider: CardgameProviderFactory;
  isNoteController: (caller: Caller, noteId: string) => boolean;
  beforeNativeTool?: Extension['beforeNativeTool'];
  /** Tests can observe validation without importing the actual backend or native addons. */
  validateRoot?: (root: unknown) => Promise<string>;
}

/** Only explicit setup and trusted persisted bindings may call this filesystem boundary. */
export async function validateProjectRoot(value: unknown): Promise<string> {
  if (typeof value !== 'string' || !value.trim() || value.includes('\0') || !isAbsolute(value)) throw Error('请选择 CardGame 项目的绝对目录');
  const info = await lstat(value);
  if (!info.isDirectory() || info.isSymbolicLink()) throw Error('CardGame 项目必须是实际目录，不能是符号链接');
  const root = await realpath(value);
  for (const path of ['package.json', 'public/data/cards/units.json']) {
    const segments = path.split('/');
    for (let index = 1; index <= segments.length; index++) {
      const part = join(root, ...segments.slice(0, index));
      const entry = await lstat(part);
      const actual = await realpath(part), inside = relative(root, actual);
      if (entry.isSymbolicLink() || !inside || inside === '..' || inside.startsWith('..' + sep) || isAbsolute(inside)) throw Error(`CardGame 项目文件越界：${path}`);
      if (index < segments.length && !entry.isDirectory()) throw Error(`CardGame 项目目录无效：${path}`);
      if (index === segments.length && (!entry.isFile() || entry.size > (path === 'package.json' ? 1024 * 1024 : 16 * 1024 * 1024))) throw Error(`CardGame 项目文件无效或过大：${path}`);
    }
    const json: unknown = JSON.parse(await readFile(join(root, path), 'utf8'));
    if (path === 'package.json'
      ? !record(json) || typeof json.name !== 'string' || !json.name.trim()
      : !record(json) || !Array.isArray(json.units)) throw Error(`CardGame 项目 JSON 无效：${path}`);
  }
  return root;
}

/** One native provider owns desktop-specific providers; importing it never selects a project. */
export function createProjectBindingManager(options: ProjectBindingOptions): Extension {
  const { host, media } = options;
  const bindings = host.app.records({ owner: providerName, collection: 'desktop-bindings', storagePrefix: 'cardgame-content:desktop-bindings:' });
  const epochMigrations = new Map<string, Promise<ProjectBinding>>();
  const children = new Map<string, Promise<{ provider: Extension; resolveMedia?: MediaResolver }>>();
  const active = new Set<Promise<unknown>>();
  const setups = new Map<string, Promise<unknown>>();
  const listeners = new Map<string, Set<() => void>>();
  const subscriptions = new Set<() => Promise<void>>();
  const transitions = new Set<string>();
  const quarantined = new Set<string>();
  const projectWork = new Map<string, Set<Promise<void>>>();
  const suspendSubscriptions = new Map<string, Set<() => Promise<void>>>();
  const storageKey = (binding: ProjectBinding) => createHash('sha256').update(binding.root).digest('hex').slice(0, 24);
  async function withChild<T>(binding: ProjectBinding, operation: (entry: Awaited<ReturnType<typeof child>>) => Promise<T>): Promise<T> {
    if (quarantined.has(binding.desktopId)) throw Error('CardGame 旧项目服务未能完整关闭，请重启宿主后重试');
    if (transitions.has(binding.desktopId)) throw Error('CardGame 正在切换项目目录，请稍后重试');
    let release!: () => void;
    const done = new Promise<void>(resolve => { release = resolve; });
    const work = projectWork.get(binding.desktopId) ?? new Set<Promise<void>>();
    work.add(done); projectWork.set(binding.desktopId, work);
    try {
      const current = await bindingByProject(binding.projectId);
      if (!current || current.root !== binding.root || current.generation !== binding.generation) throw Error('CardGame 项目目录已变化，请刷新后重试');
      return await operation(await child(binding));
    } finally { release(); work.delete(done); if (!work.size) projectWork.delete(binding.desktopId); }
  }
  let closing = false, closePromise: Promise<void> | undefined;
  const assertOpen = () => { if (closing) throw Error('CardGame 服务正在关闭'); };
  const tracked = <T>(operation: () => Promise<T>): Promise<T> => {
    try { assertOpen(); } catch (error) { return Promise.reject(error); }
    const work = Promise.resolve().then(operation);
    active.add(work); void work.finally(() => active.delete(work)).catch(() => undefined);
    return work;
  };
  const validateRoot = options.validateRoot ?? validateProjectRoot;

  async function trustedNote(noteId: unknown): Promise<{ note: Note; config: Config; desktopId: string; role: string }> {
    if (typeof noteId !== 'string' || !noteId) throw Error('CardGame 操作需要当前便笺身份');
    const { value: note } = await host.app.note(noteId);
    if (!note || note.id !== noteId || note.archived || note.draft || typeof note.desktopId !== 'string' || !note.desktopId) throw Error('CardGame 便笺不属于可用桌面');
    const config = (await host.app.core.readRecord<Config>('states', `${noteId}:config`))?.value;
    if (!record(config) || typeof config.cardgameRole !== 'string' || !roles.has(config.cardgameRole)) throw Error('当前便笺不是 CardGame 桌面角色');
    return { note, config, desktopId: note.desktopId, role: config.cardgameRole };
  }
  function checkedBinding(value: unknown, projectId: string): ProjectBinding {
    if (!record(value) || value.schemaVersion !== 1 || typeof value.desktopId !== 'string' || !value.desktopId
      || value.projectId !== projectId || desktopProjectId(value.desktopId) !== projectId
      || (value.generation !== undefined && (typeof value.generation !== 'string' || !value.generation.trim()))
      || typeof value.root !== 'string' || !isAbsolute(value.root) || !record(value.notes)
      || !value.notes.cards || !value.notes.preview
      || Object.entries(value.notes).some(([role, id]) => !roles.has(role) || typeof id !== 'string' || !id)
      || new Set(Object.values(value.notes)).size !== Object.values(value.notes).length) throw Error('CardGame 项目绑定无效，请重新核对桌面配置');
    return value as unknown as ProjectBinding;
  }
  async function bindingByProject(projectId: string): Promise<ProjectBinding | undefined> {
    if (!/^cardgame-[a-f0-9]{32}$/.test(projectId)) throw Error('CardGame 项目身份无效');
    const saved = await bindings.read<ProjectBinding>(projectId);
    if (!saved) return undefined;
    const binding = checkedBinding(saved.value, projectId);
    if (binding.generation) return binding;
    // Upgrade old bindings once. No event can leave before its epoch is durable.
    let migration=epochMigrations.get(projectId);
    if(!migration){
      migration=(async()=>{
        const latest=await bindings.read<ProjectBinding>(projectId);
        if(!latest)throw Error('项目绑定已移除');
        const current=checkedBinding(latest.value,projectId);
        if(current.generation)return current;
        const generation=randomUUID();
        const migrated={...current,generation,legacyGeneration:generation};
        try{await bindings.write(projectId,migrated,{expectedRevision:latest.revision});return migrated;}
        catch(error){const concurrent=await bindings.read<ProjectBinding>(projectId);if(concurrent){const checked=checkedBinding(concurrent.value,projectId);if(checked.generation)return checked;}throw error;}
      })();
      epochMigrations.set(projectId,migration);
      void migration.finally(()=>epochMigrations.delete(projectId)).catch(()=>undefined);
    }
    return migration;
  }
  async function scoped(noteId: unknown, input?: Config) {
    const scope = await trustedNote(noteId), projectId = desktopProjectId(scope.desktopId);
    if (input?.projectId !== undefined && input.projectId !== '' && input.projectId !== projectId) throw Error('不能访问另一桌面的 CardGame 项目');
    const binding = await bindingByProject(projectId);
    if (binding && (binding.desktopId !== scope.desktopId || binding.notes[scope.role] !== scope.note.id)) throw Error('CardGame 角色绑定已变化，请重新配置当前桌面');
    if(input?.projectGeneration!==undefined&&input.projectGeneration!==binding?.generation)throw Error('CardGame 项目绑定已变化，旧编辑或回执不能写入当前项目');
    return { ...scope, binding, projectId };
  }
  async function previewNote(projectId: string) {
    const binding = await bindingByProject(projectId);
    if (!binding) throw Error('CardGame 项目尚未配置');
    const scope = await trustedNote(binding.notes.preview);
    if (scope.desktopId !== binding.desktopId || scope.role !== 'preview') throw Error('试玩便笺已移出当前 CardGame 桌面');
    return scope.note.id;
  }
  async function child(binding: ProjectBinding) {
    assertOpen();
    let pending = children.get(binding.projectId);
    if (!pending) {
      pending = (async () => {
        const root = await validateRoot(binding.root);
        if (root !== binding.root) throw Error('CardGame 项目目录身份已变化，请重新核对绑定');
        let resolveMedia: MediaResolver | undefined;
        const proxy: Media = {
          register(name, resolver) {
            if (name !== providerName || resolveMedia) throw Error('CardGame 子服务媒体注册冲突');
            resolveMedia = resolver;
            return () => { if (resolveMedia === resolver) resolveMedia = undefined; };
          },
          issue(name, input) {
            if (name !== providerName || input.projectId !== binding.projectId) throw Error('CardGame 媒体项目身份不符');
            return media.issue(providerName, { ...input, projectGeneration: binding.generation });
          },
        };
        const childHost = Object.create(host) as WorkaExtensionHost;
        Object.defineProperty(childHost, 'dataRoot', { value: join(host.dataRoot, 'cardgame-desktops', binding.projectId, storageKey(binding)) });
        const provider = await options.createProvider(childHost, proxy, options.packageRoot, options.bunPath,
          [{ id: binding.projectId, root }], previewNote);
        return { provider, get resolveMedia() { return resolveMedia; } };
      })();
      children.set(binding.projectId, pending);
      void pending.catch(() => { if (children.get(binding.projectId) === pending) children.delete(binding.projectId); });
    }
    return pending;
  }
  const removeMedia = media.register(providerName, input => tracked(async () => {
    if (typeof input.projectId !== 'string') throw Error('CardGame 媒体缺少项目身份');
    const binding = await bindingByProject(input.projectId);
    if (!binding) throw Error('CardGame 项目尚未配置');
    if (input.projectGeneration !== binding.generation) throw Error('CardGame 媒体引用属于旧项目目录，请刷新后重试');
    return withChild(binding, async entry => {
      if (!entry.resolveMedia) throw Error('CardGame 媒体服务不可用');
      return entry.resolveMedia(input);
    });
  }));

  async function collectRoles(desktopId: string): Promise<Record<string, string>> {
    const notes: Record<string, string> = {};
    for (const row of await host.app.core.listNotes({ desktopId })) {
      // Recheck host-returned records even if an adapter ignores its filter.
      if (row.value.desktopId !== desktopId || row.value.archived || row.value.draft) continue;
      const config = (await host.app.core.readRecord<Config>('states', `${row.value.id}:config`))?.value;
      const role = config?.cardgameRole;
      if (typeof role !== 'string' || !roles.has(role)) continue;
      if (notes[role]) throw Error(`当前桌面有重复 CardGame 角色：${role}`);
      notes[role] = row.value.id;
    }
    if (!notes.cards || !notes.preview) throw Error('当前桌面缺少 cards 或 preview 角色便笺');
    return notes;
  }
  async function configure(input: Config, caller: Caller) {
    if (!caller.noteId || !['user', 'agent'].includes(caller.kind) || caller.readOnly || caller.replay || caller.dryRun
      || caller.scheduleId || caller.commentSource || !options.isNoteController(caller, caller.noteId)) throw Error('项目配置仅允许当前便笺的用户或所属 Agent 明确执行');
    const scope = await trustedNote(caller.noteId);
    if (quarantined.has(scope.desktopId)) throw Error('CardGame 旧项目服务未能完整关闭，请重启宿主后重试');
    if (input.desktopId !== undefined && input.desktopId !== scope.desktopId) throw Error('不能配置另一桌面');
    const previous = setups.get(scope.desktopId) ?? Promise.resolve();
    const job = previous.catch(() => undefined).then(async () => {
      assertOpen();
      const currentScope = await trustedNote(caller.noteId);
      if (currentScope.desktopId !== scope.desktopId) throw Error('便笺桌面已变化');
      const notes = await collectRoles(scope.desktopId);
      if (notes[currentScope.role] !== caller.noteId) throw Error('当前便笺角色不属于此桌面');
      const projectId = desktopProjectId(scope.desktopId), saved = await bindings.read<ProjectBinding>(projectId);
      const existing = saved ? checkedBinding(saved.value, projectId) : undefined;
      if (caller.kind === 'agent' && (!caller.approve || !await caller.approve(`允许 CardGame 桌面读取并绑定项目目录 ${String(input.root)}？`, 'cardgame.configureProject'))) throw Error('项目目录需要原生确认；请由用户在内容库选择目录');
      const root = await validateRoot(input.root);
      const generation=existing?.root===root&&existing.generation?existing.generation:randomUUID();
      const legacyGeneration=existing?.root===root?(existing.generation?existing.legacyGeneration:generation):undefined;
      const binding: ProjectBinding = { schemaVersion: 1, desktopId: scope.desktopId, projectId, root, notes, generation, ...(legacyGeneration?{legacyGeneration}:{}) };
      const changing = existing && existing.root !== root;
      const written: Array<{ noteId: string; before: Config }> = [];
      transitions.add(scope.desktopId);
      try {
        if (changing) {
          await Promise.all([...(suspendSubscriptions.get(scope.desktopId) ?? [])].map(suspend => suspend()));
          await Promise.all([...(projectWork.get(scope.desktopId) ?? [])]);
          const running = children.get(projectId);
          if (running) {
            const old = await running;
            try { await old.provider.beginClose?.(); await old.provider.close(); }
            catch (error) { quarantined.add(scope.desktopId); throw error; }
            children.delete(projectId);
          }
          if (host.previewProcesses) {
            const ownedNotes = new Set(Object.values(existing.notes));
            for (const preview of await host.previewProcesses.list()) if (preview.value.noteId && ownedNotes.has(preview.value.noteId)) await host.previewProcesses.stop(preview.key);
          }
        }
        // Config is a projection; only the final durable binding grants project access.
        for (const [role, noteId] of Object.entries(notes)) {
          await host.app.core.updateRecord<Config>('states', `${noteId}:config`, async config => {
            const current = await trustedNote(noteId);
            if (current.desktopId !== scope.desktopId || current.role !== role || config?.cardgameRole !== role) throw Error('配置期间桌面角色已变化，请重试');
            written.push({ noteId, before: { ...config } });
            return { ...config, projectId, projectRoot: root, notes: { ...(record(config?.notes) ? config.notes : {}), ...notes } };
          });
        }
        assertOpen();
        await bindings.write(projectId, binding, { expectedRevision: saved?.revision ?? null });
        return { configured: true, projectId, projectRoot: root, notes: { ...notes } };
      } catch (error) {
        const failures: unknown[] = [];
        for (const { noteId, before } of written.reverse()) try {
          await host.app.core.updateRecord<Config>('states', `${noteId}:config`, config => {
            if (config?.projectId !== projectId || config.projectRoot !== root) return config ?? {};
            const restored = { ...config };
            for (const key of ['projectId', 'projectRoot', 'notes']) {
              if (Object.hasOwn(before, key)) restored[key] = before[key]; else delete restored[key];
            }
            return restored;
          });
        } catch (rollback) { failures.push(rollback); }
        if (failures.length) throw new AggregateError([error, ...failures], 'CardGame 项目绑定失败，配置回滚未完成');
        throw error;
      } finally {
        transitions.delete(scope.desktopId);
        for (const invalidate of listeners.get(scope.desktopId) ?? []) { try { invalidate(); } catch { /* Observers do not own setup. */ } }
      }
    });
    setups.set(scope.desktopId, job);
    void job.finally(() => { if (setups.get(scope.desktopId) === job) setups.delete(scope.desktopId); }).catch(() => undefined);
    return job;
  }
  const query = {
    version: '1',
    load(value: ResourceValue, context: ResourceContext): Promise<ResourceValue> { return tracked<ResourceValue>(async ():Promise<ResourceValue> => {
      if (!record(value)) throw Error('CardGame 查询无效');
      const scope = await scoped(context.scope.noteId, value);
      if (value.op === 'projectBinding') return scope.binding
        ? { configured: true, projectId: scope.projectId, projectGeneration:scope.binding!.generation!, projectRoot: scope.binding.root, notes: { ...scope.binding.notes } }
        : { configured: false, projectId: scope.projectId, setupRequired: true };
      if (!scope.binding) throw Error('CardGame 项目尚未配置，请先从当前桌面选择项目目录');
      return withChild(scope.binding, async ({ provider }) => {
        if (!provider.resources?.query) throw Error('CardGame 查询服务不可用');
        const result=await provider.resources.query.load({ ...value, projectId: scope.projectId, projectGeneration:scope.binding!.generation!, allowLegacyReconciliation:scope.binding!.legacyGeneration===scope.binding!.generation }, context);
        return record(result)?{...result,projectGeneration:scope.binding!.generation!}:result;
      });
    }); },
    async subscribe(value: ResourceValue, invalidate: (error?: unknown) => void, context: Omit<ResourceContext, 'read'>) {
      assertOpen();
      if (!record(value)) throw Error('CardGame 查询无效');
      const scope = await scoped(context.scope.noteId, value);
      assertOpen();
      let disposed = false, release: (() => void | Promise<void>) | undefined, chain = Promise.resolve();
      const attach = () => {
        chain = chain.then(async () => {
          if (disposed || closing) return;
          await release?.(); release = undefined;
          const current = await scoped(context.scope.noteId, value);
          if (current.desktopId !== scope.desktopId) throw Error('便笺已移出当前桌面');
          if (current.binding && value.op !== 'projectBinding') {
            const next = await withChild(current.binding, ({ provider }) => Promise.resolve(provider.resources?.query?.subscribe?.({ ...value, projectId: current.projectId, projectGeneration:current.binding!.generation!, allowLegacyReconciliation:current.binding!.legacyGeneration===current.binding!.generation }, invalidate, context)));
            if (disposed || closing) await next?.(); else release = next;
          }
        }).catch(error => { if (!disposed && !closing) invalidate(error); });
      };
      const changed = () => { invalidate(); attach(); };
      const suspend = async () => { await chain; await release?.(); release = undefined; };
      const suspensions = suspendSubscriptions.get(scope.desktopId) ?? new Set<() => Promise<void>>();
      suspensions.add(suspend); suspendSubscriptions.set(scope.desktopId, suspensions);
      const set = listeners.get(scope.desktopId) ?? new Set<() => void>();
      set.add(changed); listeners.set(scope.desktopId, set);
      const dispose = async () => {
        if (disposed) return; disposed = true; set.delete(changed);
        suspensions.delete(suspend); if (!suspensions.size) suspendSubscriptions.delete(scope.desktopId);
        if (!set.size) listeners.delete(scope.desktopId);
        subscriptions.delete(dispose); await chain; await release?.(); release = undefined;
      };
      subscriptions.add(dispose); attach(); await chain;
      return dispose;
    },
  };
  return {
    resources: { query },
    beforeNativeTool: options.beforeNativeTool && (input => tracked(() => options.beforeNativeTool!(input))),
    noteContext: (note, binding) => tracked(async () => {
      // The host record, rather than a caller-supplied NoteRecord, determines scope.
      let scope: Awaited<ReturnType<typeof scoped>>;
      try { scope = await scoped(note.id); } catch { return []; }
      if (!scope.binding) return ['CardGame 项目尚未配置。请由用户明确选择项目目录；不要读取导入配置中的旧项目路径。'];
      return withChild(scope.binding, async ({ provider }) => await provider.noteContext?.(scope.note, binding) ?? []);
    }),
    invoke: (method, input, caller) => tracked(async () => {
      if (method === 'configureProject') return configure(input, caller);
      if(['bindProduction','productionResult','receiveResult','recordCandidates','recordAdoption'].includes(method)&&typeof input.projectGeneration!=='string')throw Error('旧回执缺少项目代次；请在当前制作单重新核对原轮次并重试，不要重建桌面');
      const scope = await scoped(caller.noteId, input);
      if (!scope.binding) throw Error('CardGame 项目尚未配置，请先从当前桌面选择项目目录');
      return withChild(scope.binding, ({ provider }) => provider.invoke(method, { ...input, projectId: scope.projectId, projectGeneration:scope.binding!.generation!, allowLegacyReconciliation:scope.binding!.legacyGeneration===scope.binding!.generation }, caller));
    }),
    async beginClose() {
      closing = true;
      await Promise.allSettled([...children.values()].map(async pending => (await pending).provider.beginClose?.()));
    },
    close() {
      return closePromise ??= (async () => {
        closing = true;
        const errors: unknown[] = [];
        try { removeMedia(); } catch (error) { errors.push(error); }
        const subscriptionsClosed = await Promise.allSettled([...subscriptions].map(dispose => dispose()));
        await Promise.allSettled([...active]);
        const results = await Promise.allSettled([...children.values()].map(async pending => (await pending).provider.close()));
        listeners.clear(); children.clear();
        for (const result of [...subscriptionsClosed, ...results]) if (result.status === 'rejected') errors.push(result.reason);
        if (errors.length) throw new AggregateError(errors, 'CardGame 子服务关闭失败');
      })();
    },
  };
}
