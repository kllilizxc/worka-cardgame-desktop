import { describe, expect, test } from 'bun:test';

// Defaults to the shipped artifact. An isolated, freshly compiled bundle may be
// supplied while validating source changes before the publication rebuild.
const actionsEntry = process.env.WORKA_TODO_ACTIONS_ENTRY
  ?? new URL('../notes/note-11/worka-prebuilt/actions.mjs', import.meta.url).href;
const todo = await import(actionsEntry);
const capabilityKey = Symbol.for('worka.note-capability');
const model = todo.note[Symbol.for('worka.note-model.v2')];
const updateCheck = model.update.checks.find((check: any) => check.name === '关键能力与稳定身份');

// Bind the same read-only context used by the real host update checker, using
// the bundled SDK itself. Reuse its JSON output/input schemas for this harness.
const invokeCheck = todo.note.query({
  visibility: 'private',
  input: todo.queries.workflowStatus[capabilityKey].input,
  output: todo.productionRequest[capabilityKey].output,
}, async (context: any) => updateCheck.run(context));

type Snapshot = { value: { items: Array<Record<string, unknown>> }; revision: string };

function harness(snapshots: Snapshot[]) {
  const reads: string[] = [];
  const context = {
    note: { id: 'local-todo-note', stateRef: 'state:local-todo-note' },
    store: {
      read: async (ref: string) => {
        expect(ref).toBe('state:local-todo-note');
        const snapshot = snapshots[Math.min(reads.length, snapshots.length - 1)];
        reads.push(ref);
        return structuredClone(snapshot);
      },
    },
    resources: { read: async () => { throw new Error('Update checks must not query CardGame providers'); } },
  };
  return { context, reads };
}

describe('portable Todo local-state update check', () => {
  test('accepts empty local state without CardGame project configuration', async () => {
    const { context, reads } = harness([{ value: { items: [] }, revision: 'state-1' }]);
    expect(await invokeCheck(context, {})).toBe(true);
    expect(reads).toEqual(['state:local-todo-note', 'state:local-todo-note']);
  });

  test('preserves stable identities for current and legacy local item shapes', async () => {
    const items = [
      { id: 'active', title: 'Current item', status: 'todo', createdAt: '2026-10-17T00:00:00Z' },
      { id: 'working', title: 'In progress', status: 'in_progress' },
      { id: 'blocked', title: 'Legacy blocked item', status: 'blocked' },
      { id: 'complete', title: 'Legacy completed item', completed: true },
      { id: 'old', title: 'Legacy item without status' },
    ];
    const snapshot = { value: { items }, revision: 'state-2' };
    const { context, reads } = harness([snapshot]);
    expect(await invokeCheck(context, {})).toBe(true);
    expect(reads).toHaveLength(2);
    expect(snapshot.value.items).toEqual(items);
  });

  test('fails when the query observes a different local-state revision', async () => {
    const value = { items: [{ id: 'item-1', title: 'Original item' }] };
    const { context } = harness([{ value, revision: 'state-1' }, { value, revision: 'state-2' }]);
    expect(await invokeCheck(context, {})).toBe(false);
  });

  test('fails when the query projection changes a stable item identity', async () => {
    const { context } = harness([
      { value: { items: [{ id: 'item-1', title: 'Original item' }] }, revision: 'state-1' },
      { value: { items: [{ id: 'different-item', title: 'Original item' }] }, revision: 'state-1' },
    ]);
    expect(await invokeCheck(context, {})).toBe(false);
  });
});
