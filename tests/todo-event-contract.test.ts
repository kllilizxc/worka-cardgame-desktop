import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
const todo=await import(process.env.CARDGAME_TODO_ACTIONS_ENTRY??'../notes/note-11/worka-prebuilt/actions.mjs');

// Default: exercise the shipped, self-contained artifact. A source override is
// available for pre-build contract checks. No note-local install, model,
// extension provider, running host, or network connection is needed.
const capabilityKey = Symbol.for('worka.note-capability');
const productionName = 'cardgame.todo.productionRequested';
const delegationName = 'cardgame.todo.delegationRequested';

type Published = {
  id: string;
  name: string;
  payload: Record<string, any>;
  options: { key?: string; exclusive?: boolean };
};

function harness(options: { projectId?: string; prepared?: unknown } = {}) {
  const published: Published[] = [];
  const commands: Array<{ extension: string; method: string; input: any }> = [];
  const seen = new Map<string, string>();
  const context = {
    caller: { kind: 'user', requestId: 'fixture-request' },
    note: { id: 'todo-note', version: 'test', stateRef: 'state:todo-note' },
    store: {
      read: async () => ({ value: { projectId: options.projectId ?? 'project-1' }, revision: 'config-1' }),
    },
    resources: {read:async(request:any)=>({key:'todo',epoch:'fixture',version:1,stale:false,data:{item:{projectId:request.input.projectId,id:request.input.id,title:'Current requirement',description:'Complete full requirement text',status:'todo',priority:'medium',revision:1,requirementRevision:1,createdAt:'2026-01-01',updatedAt:'2026-01-01'},requirementFingerprint:'fixture'}})},
    extensions: {
      request: async (extension: string, method: string, input: any) => {
        commands.push({ extension, method, input });
        if (extension !== 'cardgame-content' || method !== 'delegateTodo') throw new Error('Unexpected extension call');
        if (options.prepared === undefined) throw new Error('No prepared delegation fixture');
        return structuredClone(options.prepared);
      },
    },
    events: {
      publish: async (name: string, payload: any, publishOptions: Published['options']) => {
        // Match the action worker's declared event boundary, including current
        // SDK versions that intentionally defer parsing until publication.
        const event = Object.values(todo.events).find(event => event.name === name);
        payload = await metadata(event).output.parseAsync(payload);
        const key = `${name}:${publishOptions.key}`;
        const duplicate = seen.has(key);
        const id = seen.get(key) ?? `event-${seen.size + 1}`;
        seen.set(key, id);
        published.push({ id, name, payload: structuredClone(payload), options: { ...publishOptions } });
        return { id, duplicate };
      },
    },
  };
  return { context, published, commands };
}

function relation(number: number, script: string): (event: any, api: any) => Promise<any> {
  const source = readFileSync(new URL(`../relations/relation-${number}/draft/scripts/${script}.ts`, import.meta.url), 'utf8');
  const javascript = new Bun.Transpiler({ loader: 'ts' }).transformSync(source);
  return new Function(`${javascript}\nreturn run;`)();
}

function metadata(value: any): any {
  return value[capabilityKey];
}

function preparedDelegation() {
  // Same JSON transport shape as cardgame-content's delegateTodo response:
  // optional undefined values are omitted by its JSON clone before returning.
  return JSON.parse(JSON.stringify({
    pending: true,
    requestId: 'todo-repair:project-1:generation-1:todo-1:4',
    fingerprint: 'requirement-fingerprint',
    item: {
      projectId: 'project-1', projectGeneration: 'generation-1', id: 'todo-1', title: 'Repair card layout',
      revision: 7, requirementRevision: 4,
    },
    payload: {
      projectId: 'project-1', projectGeneration: 'generation-1', itemId: 'todo-1',
      todoObjectId: `cardgame-todo:${JSON.stringify(['project-1', 'generation-1', 'todo-1'])}`, businessKey: 'todo:project-1:generation-1:todo-1',
      requestId: 'todo-repair:project-1:generation-1:todo-1:4',
      requestKey: 'cardgame-todo-request:generation-1:todo-repair:project-1:generation-1:todo-1:4',
      goal: 'Repair card layout', scope: ['Only the selected card'],
      requirement: {
        itemId: 'todo-1', title: 'Repair card layout', description: '', images: [],
        priority: 'medium', category: '', dueDate: null, requirementRevision: 4,
      },
      cwd: undefined, resumePaused: true, delegationId: undefined,
    },
  }));
}

describe('portable Todo event contracts', () => {
  test('exports public, model-bound events with the exact relation subscription names', () => {
    for (const [event, name, relationNumber] of [
      [todo.events.cardGameProductionRequested, productionName, 6],
      [todo.events.cardGameDelegationRequested, delegationName, 7],
    ] as const) {
      expect(event.name).toBe(name);
      expect(metadata(event)).toMatchObject({ kind: 'event', name, visibility: 'public', objectRef: relationNumber === 7 ? '/todoObjectId' : '/todoId' });
      expect(metadata(event).model).toBe(todo.note);
      expect(metadata(event).description.trim().length).toBeGreaterThan(0);
      expect(readFileSync(new URL(`../relations/relation-${relationNumber}/draft/SKILL.md`, import.meta.url), 'utf8'))
        .toContain(`${name}: scripts/`);
    }
    for (const operation of [todo.productionRequest, todo.delegateTodo]) {
      expect(metadata(operation).visibility).toBe('public');
      expect(metadata(operation).model).toBe(todo.note);
    }
  });

  test('productionRequest publishes normalized identity and preserves production requirement fields', async () => {
    const { context, published, commands } = harness();
    const input = {
      projectId: ' project-2 ', todoId: ' todo-2 ', brief: ' Draw the selected card ', title: 'Card art',
      targetAsset: { key: 'cards/card-2', frame: 0, optional: null },
      pinnedRefs: ['cards/reference-1', { kind: 'card', id: 'card-1', revision: 3 }],
      batch: { count: 2, variants: [true, null] }, context: { kind: 'todo', id: 'todo-2' },
      requestId: 'request-2', featureId: 'feature-2', contentRefs: ['legacy-reference'],
    };
    const result = await todo.productionRequest(context, input);
    expect(result).toEqual({ status: 'queued', todoId: 'todo-2', requestId: 'request-2', eventId: 'event-1', duplicate: false });
    expect(published).toEqual([{
      id: 'event-1', name: productionName,
      payload: { ...input, projectId: 'project-2', todoId: 'todo-2', brief: 'Draw the selected card', businessKey: 'todo:project-2:todo-2' },
      options: { key: 'request-2', exclusive: true },
    }]);
    expect(commands).toEqual([]);
  });

  test('productionRequest uses configured project, fallback brief and the same key on retries', async () => {
    const { context, published } = harness();
    const first = await todo.productionRequest(context, { todoId: ' todo-1 ', brief: ' ', title: ' ' });
    const second = await todo.productionRequest(context, { todoId: 'todo-1', brief: ' ', title: ' ' });
    expect(first).toMatchObject({ requestId: 'todo-production:project-1:legacy:todo-1', duplicate: false });
    expect(second).toMatchObject({ requestId: first.requestId, eventId: first.eventId, duplicate: true });
    expect(published[0].payload).toMatchObject({ projectId: 'project-1', todoId: 'todo-1', brief: 'Complete full requirement text', title:'Current requirement', businessKey: 'todo:project-1:todo-1' });
    expect(published[1].options).toEqual({ key: first.requestId, exclusive: true });
  });

  test('productionRequest falls back to title and accepts JSON batch values', async () => {
    for (const batch of [null, false, 0, 'single', ['a', { count: 1 }]]) {
      const { context, published } = harness();
      await todo.productionRequest(context, { todoId: 'todo-1', title: ' Title fallback ', batch });
      expect(published[0].payload.brief).toBe('Title fallback');
      expect(published[0].payload.batch).toEqual(batch);
    }
  });

  test('invalid production identity or declared payload never reaches the event publisher', async () => {
    const { context, published } = harness();
    await expect(todo.productionRequest(context, { todoId: ' ' })).rejects.toThrow('制作请求需要 todoId');
    const missingProject = harness({ projectId: '' });
    await expect(todo.productionRequest(missingProject.context, { todoId: 'todo-1' })).rejects.toThrow('需要 projectId');
    await expect(todo.events.cardGameProductionRequested.publish(context, {
      projectId: 'project-1', todoId: '', brief: 'Draft', businessKey: 'todo:project-1:todo-1',
    })).rejects.toThrow();
    await expect(todo.events.cardGameProductionRequested.publish(context, {
      projectId: 'project-1', todoId: 'todo-1', brief: 'Draft', businessKey: 'todo:project-1:todo-1', pinnedRefs: [42],
    })).rejects.toThrow();
    expect(published).toEqual([]);
    expect(missingProject.published).toEqual([]);
  });

  test('actual production relation consumes the emitted payload and binds the original Todo', async () => {
    const { context, published } = harness();
    await todo.productionRequest(context, { todoId: 'todo-1', title: 'Selected card', featureId: 'feature-1' });
    const calls: any[] = [];
    const result = await relation(6, 'create')({ ...published[0], noteId: context.note.id }, {
      describe: async () => [
        { noteId: 'todo-note', codeVersion: 'todo-version', capabilities: { queries: ['todo'], actions: [] } },
        { noteId: 'production-note', codeVersion: 'production-version', capabilities: { queries: [], actions: ['upsertRequest', 'bindTodo'] } },
      ],
      query: async (request: any) => {
        expect(request).toMatchObject({ noteId: 'todo-note', name: 'todo', input: { projectId: 'project-1', id: 'todo-1' } });
        return { item: { projectId: 'project-1', id: 'todo-1', productionId: 'production-existing' } };
      },
      action: async (request: any) => {
        calls.push(request);
        if (request.name === 'upsertRequest') return { production: { id: 'production-existing' } };
        if (request.name === 'bindTodo') return {};
        throw new Error('Unexpected production action');
      },
      bindingLink: async (request: any) => { calls.push(request); },
    });
    expect(result.outcome).toBe('completed');
    expect(calls).toEqual([
      { noteId: 'production-note', name: 'upsertRequest', codeVersion: 'production-version', operationId: 'upsert',
        input: { ...published[0].payload, todoId: 'todo-1', productionId: 'production-existing' } },
      { noteId: 'production-note', name: 'bindTodo', codeVersion: 'production-version', operationId: 'bind',
        input: { projectId: 'project-1', todoId: 'todo-1', productionId: 'production-existing' } },
      { kind: 'production', source: { noteId: 'todo-note', objectId: 'todo-1' }, target: { noteId: 'production-note', objectId: 'production-existing' } },
    ]);
  });

  test('delegateTodo publishes the persisted request and numeric requirement revision unchanged', async () => {
    const prepared = preparedDelegation();
    const { context, published, commands } = harness({ prepared });
    const result = await todo.delegateTodo(context, { itemId: 'todo-1', goal: 'User goal', scope: ['Only the selected card'] });
    expect(commands).toEqual([{ extension: 'cardgame-content', method: 'delegateTodo',
      input: { itemId: 'todo-1', goal: 'User goal', scope: ['Only the selected card'], projectId: 'project-1', requestId: 'fixture-request' } }]);
    expect(published).toEqual([{
      id: 'event-1', name: delegationName,
      payload: { projectId: 'project-1', projectGeneration: 'generation-1', todoId: 'todo-1', todoObjectId: prepared.payload.todoObjectId,
        requestId: prepared.requestId, requestKey: `cardgame-todo-request:generation-1:${prepared.requestId}`,
        payload: { goal: prepared.payload.goal, scope: prepared.payload.scope }, requirementRevision: 4 },
      options: { key: `cardgame-todo-request:generation-1:${prepared.requestId}`, exclusive: true },
    }]);
    expect(result).toEqual({ projectId: 'project-1', projectGeneration: 'generation-1', itemId: 'todo-1', requestId: prepared.requestId, eventId: 'event-1', duplicate: false });
  });

  test('delegateTodo does not publish an unprepared result or a malformed revision', async () => {
    for (const prepared of [{ pending: false, status: 'accepted' }, { pending: true, requestId: 'no-payload' }]) {
      const { context, published } = harness({ prepared });
      expect(await todo.delegateTodo(context, { itemId: 'todo-1' })).toEqual(prepared);
      expect(published).toEqual([]);
    }
    const prepared = preparedDelegation();
    prepared.payload.requirement.requirementRevision = '4';
    const { context, published } = harness({ prepared });
    await expect(todo.delegateTodo(context, { itemId: 'todo-1' })).rejects.toThrow();
    expect(published).toEqual([]);
  });

  test('actual delegation relation accepts the declared prepared payload and records its stable request', async () => {
    const prepared = preparedDelegation();
    const { context, published } = harness({ prepared });
    await todo.delegateTodo(context, { itemId: 'todo-1' });
    const calls: any[] = [];
    const result = await relation(7, 'delegate')({ ...published[0], noteId: context.note.id }, {
      describe: async () => [
        { noteId: 'todo-note', codeVersion: 'todo-version', capabilities: { queries: ['todo'], actions: ['bindExecution'] } },
        { noteId: 'desk-note', codeVersion: 'desk-version', capabilities: { queries: ['task'], actions: ['acceptRequirement'] } },
      ],
      query: async (request: any) => {
        expect(request).toMatchObject({ noteId: 'todo-note', name: 'todo', input: { projectId: 'project-1', id: 'todo-1' } });
        return { item: prepared.item };
      },
      bindingList: async () => [],
      action: async (request: any) => {
        calls.push(request);
        if (request.name === 'acceptRequirement') return { delegationId: 'delegation-1', status: 'queued' };
        if (request.name === 'bindExecution') return {};
        throw new Error('Unexpected delegation action');
      },
      bindingLink: async (request: any) => { calls.push(request); },
    });
    expect(result.outcome).toBe('completed');
    expect(calls[0]).toMatchObject({ noteId: 'desk-note', name: 'acceptRequirement', input: {
      updateId: published[0].payload.requestKey, goal: prepared.payload.goal, scope: prepared.payload.scope,
      source: { noteId: 'todo-note', objectId: prepared.payload.todoObjectId, revision: '4', value: prepared.item }, delivery: 'queue',
    } });
    expect(calls[0].input).not.toHaveProperty('cwd');
    expect(calls[1]).toMatchObject({ noteId: 'todo-note', name: 'bindExecution', input: {
      projectId: 'project-1', todoId: 'todo-1', requestId: prepared.requestId,
      receipt: { status: 'accepted', result: { delegationId: 'delegation-1', status: 'queued', deskNoteId: 'desk-note' } },
    } });
    expect(calls[2]).toEqual({ kind: 'delegation', source: { noteId: 'todo-note', objectId: prepared.payload.todoObjectId }, target: { noteId: 'desk-note', objectId: 'delegation-1' } });
  });
});
