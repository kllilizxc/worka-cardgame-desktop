import { createHash, randomUUID } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { type ReactNode } from 'react';

const worka = process.env.WORKA_SOURCE_ROOT;
if (!worka) throw Error('Set WORKA_SOURCE_ROOT to the Worka checkout used to build this branch');
export const { button, deferred, flush, mount } = await import(resolve(worka, 'tests/web/dom-test-helpers.tsx'));
const {RuntimeProvider,NoteViewContext}=await import('@dsh-workbench/react/internal');
const [{ CoreStore }, { CommandRegistry }, { NoteMutations }, { noteFilesHost }, { MemoryRecordStorage }, { hostMutationManager }, {ActionSteps}] = await Promise.all([
  import(resolve(worka, 'src/core/store.ts')),
  import(resolve(worka, 'src/resources/commands.ts')),
  import(resolve(worka, 'src/note-mutations/service.ts')),
  import(resolve(worka, 'src/note-files.ts')),
  import(resolve(worka, 'tests/fixtures/record-storage.ts')),
  import(resolve(worka, 'sdk/react/src/host-mutation-controller.ts')),
  import(resolve(worka, 'src/runtime/action-steps.ts')),
]);

export async function until(check: () => boolean, description = 'UI update') {
  for (let attempt = 0; attempt < 300; attempt++) {
    await flush(() => new Promise(resolve => setTimeout(resolve, 5)));
    if (check()) return;
  }
  throw Error(`Timed out waiting for ${description}`);
}

export async function typeInto(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  await flush(() => {
    const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

/** Real CoreStore, command ledger, draft service, file intake and subscriptions.
 * Only business queries, business execution and provider/network I/O are fixtures. */
export async function hostUiFixture(options: {
  config?: Record<string, unknown>;
  query(name: string, input: any): unknown | Promise<unknown>;
  execute?(name: string, input: any, context: any): unknown | Promise<unknown>;
  openNote?(id: string, focus?: string): Promise<unknown>;
}) {
  const id = 'fixture-' + randomUUID();
  const directory = await mkdtemp(resolve(tmpdir(), 'cardgame-ui-host-'));
  const core = await CoreStore.open(new MemoryRecordStorage());
  await core.createNote({ id, name: 'CardGame fixture', codeVersion: 'test-code' });
  const commands = new CommandRegistry(core);
  const stepStore=new ActionSteps(()=>({
    read: (key:string)=>core.readRecord('records',id+':'+key),
    write: (key:string,value:any,options:any)=>core.writeRecord('records',id+':'+key,value,
      options.baseRevision===undefined?{}:{expectedRevision:options.baseRevision}),
    delete: (key:string)=>core.deleteRecord('records',id+':'+key),
    list: async()=>({items:[]}),
  }));
  const bytes = new Map<string, Uint8Array>();
  const files = noteFilesHost(core, {
    async save(data: Uint8Array, name: string) {
      const attachmentId = createHash('sha256').update(data).digest('hex');
      bytes.set(attachmentId, Uint8Array.from(data));
      return { attachmentId, name, bytes: data.byteLength };
    },
    async *read(ref: { attachmentId: string }) {
      const value = bytes.get(ref.attachmentId);
      if (!value) throw Error('Missing fixture attachment');
      yield value;
    },
  });
  const calls: Array<{ name: string; input: any; requestId: string }> = [];
  const reads: Array<{ name: string; input: any }> = [];
  const requests: any[] = [], opened: Array<{ id: string; focus?: string }> = [];
  const failures = new Map<string, Error>();
  let version = 0;
  const data = async (name: string, input: any) => {
    if (failures.has(name)) throw failures.get(name);
    if (name === 'readiness') return { missingConfig: [], missingCapabilities: [], relations: [] };
    if (name === 'state') return { value: options.config ?? {}, revision: 'config-1' };
    return options.query(name, input);
  };
  const host = new NoteMutations({ core, commands, files,
    query: async (_id: string, query: { name: string; input: any }) => {
      core.dependencies.read('business-query:' + query.name);
      return structuredClone(await data(query.name, query.input));
    },
    execute: async (operation: { action: string }, input: unknown, context: any) => {
      calls.push({ name: operation.action, input: structuredClone(input), requestId: context.requestId });
      const step=(capability:string,args:any)=>stepStore.handle(capability,args,context.executionId,{} as any);
      const steps={
        claim:(scope:string)=>step('steps.claim',{scope}),
        read:(scope:string,name:string,options:any)=>step('steps.read',{scope,name,supportsStarted:options?.supportsStarted}),
        write:(scope:string,name:string,record:any)=>step('steps.write',{scope,name,record}),
        clear:(scope:string)=>step('steps.clear',{scope}),
      };
      try { return options.execute ? await options.execute(operation.action, input, { ...context,
        caller:{...context.caller,requestId:context.requestId},files,steps }) : null; }
      finally {stepStore.release(context.executionId);}
    },
  }, directory);
  const scope = { noteId: id, codeVersion: 'test-code', writerId: 'frame-one' };
  const subscriptions = new Set<{ request: any; listener: (value: any) => void }>();
  const resource = async (request: { name: string; input: any }) => {
    reads.push(structuredClone(request));
    try { return { key: request.name, epoch: 'fixture', version: ++version, stale: false, data: structuredClone(await data(request.name, request.input)) }; }
    catch (error) { return { key: request.name, epoch: 'fixture', version: ++version, stale: false, error: String(error) }; }
  };
  const runtime: any = {
    note: { id, name: 'CardGame fixture', stateRef: id + ':state' },
    setCompactSurface: async () => {},
    resources: {
      read: resource, revalidate: resource,
      subscribe: async (request: any, listener: (value: any) => void) => {
        const entry = { request, listener }; subscriptions.add(entry);
        listener(await resource(request)); return () => subscriptions.delete(entry);
      },
    },
    mutations: {
      request: async (request: any) => { requests.push(structuredClone(request)); return host.request(scope, request); },
      subscribe: async (slot: string, listener: (value: any) => void, onError: (error: Error) => void) => {
        let active = true, release: (() => void) | undefined;
        const read = async () => {
          try {
            const captured = await core.dependencies.capture(true, () => host.read(scope, slot));
            const retain = core.dependencies.retain({ epoch: captured.reactive.epoch, dependencies: captured.reactive.dependencies ?? {} });
            if (active) { release?.(); release = retain; listener(captured.data); } else retain();
          } catch (cause) { if (active) onError(cause instanceof Error ? cause : Error(String(cause))); }
        };
        const stop = core.dependencies.subscribe(() => void read());
        await read(); return () => { active = false; stop(); release?.(); };
      },
    },
    invokeAction: async () => { throw Error('The rendered view must hand business execution to the mutation service'); },
    openNote: async (target: string, focus?: string) => { opened.push({ id: target, focus }); return options.openNote?.(target, focus); },
    openSession: async (target: string) => { opened.push({ id: target }); },
    copyText: async () => {},
  };
  let viewState: Record<string, unknown> = {};
  const bridge: any = { request: async (method: string, input: any) => {
    if (method === 'ui.viewStateGet') return viewState;
    if (method === 'ui.viewStateSet') { viewState = structuredClone(input.values); return { accepted: true }; }
    throw Error('Unexpected UI transport: ' + method);
  } };
  return { runtime, bridge, core, host, files, calls, reads, requests, opened,
    render(children: ReactNode, mode: 'compact' | 'expanded' = 'expanded', focus?: string) {
      return <RuntimeProvider runtime={runtime} bridge={bridge}><NoteViewContext.Provider value={{ metadata: { id, name: 'CardGame fixture' }, mode, layout: { width: 1000, maxHeight: 1000 }, focus, managed: true }}>{children}</NoteViewContext.Provider></RuntimeProvider>;
    },
    async publish(name: string) {
      core.dependencies.invalidate('business-query:' + name);
      for (const item of subscriptions) if (item.request.name === name) item.listener(await resource(item.request));
    },
    failRead(name: string, error?: Error) { if (error) failures.set(name, error); else failures.delete(name); },
    async close() {
      hostMutationManager(runtime).dispose(); await commands.close(); await host.close(); await core.close();
      await rm(directory, { recursive: true, force: true });
    },
  };
}
