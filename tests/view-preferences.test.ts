import { describe, expect, test } from 'bun:test';
import { z, type NoteState } from '@dsh-workbench/runtime';
import { bindActionContext, type ActionContext } from '@dsh-workbench/runtime/internal';
import * as library from '../notes/note-1/actions';
import { stateSchema } from '../notes/note-1/model';

test('legacy library titles survive model validation without changing stored preferences', () => {
  const saved = { title: 'Existing library', views: { knowledgeSelection: { path: 'memory/index.md' } } };
  expect(stateSchema.parse(saved)).toEqual(saved);
});
import * as production from '../notes/note-4/actions';

/**
 * Only the host's CAS storage is simulated. The real action validates its wire
 * input and the installed SDK owns read/mutate/CAS/retry/no-op behavior.
 * First-read barriers make the races deterministic instead of relying on timing.
 */
function fixture<N>(note: N, seed: NoteState<N>, concurrentReads = 0) {
  const stateRef = 'preferences:isolated';
  let value = structuredClone(seed), revision = 1, reads = 0;
  let attempts = 0, accepted = 0, conflicts = 0;
  let release!: () => void;
  const firstReads = new Promise<void>(resolve => { release = resolve; });
  const raw = {
    note: { id: 'isolated-note', version: 'test', stateRef },
    caller: { kind: 'user' },
    store: {
      read: async (ref: string) => {
        // Preference changes must not read project config or domain resources.
        expect(ref).toBe(stateRef);
        const snapshot = { value: structuredClone(value), revision: String(revision) };
        reads++;
        if (reads <= concurrentReads) {
          if (reads === concurrentReads) release();
          await firstReads;
        }
        return snapshot;
      },
      update: async (ref: string, request: {
        baseRevision: string; patch: object;
        ops: Array<{ path: Array<string | number>; value: NoteState<N> }>;
      }) => {
        expect(ref).toBe(stateRef);
        attempts++;
        if (request.baseRevision !== String(revision)) {
          conflicts++;
          throw Object.assign(new Error('State revision conflict'), { code: 'revision-conflict' });
        }
        expect(request.patch).toEqual({});
        expect(request.ops).toHaveLength(1);
        expect(request.ops[0]!.path).toEqual([]);
        value = structuredClone(request.ops[0]!.value);
        revision++;
        accepted++;
        return { value: structuredClone(value), revision: String(revision) };
      },
    },
    db: {}, files: {}, notes: {}, resources: {}, events: {},
  } as unknown as ActionContext;
  return {
    raw,
    context: bindActionContext(note, raw),
    state: () => structuredClone(value),
    stats: () => ({ reads, attempts, accepted, conflicts, revision: String(revision) }),
  };
}

function inputSchema(action: unknown): z.ZodType {
  return (action as { [key: symbol]: { input: z.ZodType } })[Symbol.for('worka.note-capability')]!.input;
}

describe('content-library preference actions', () => {
  test('the wire contract accepts field intents without a rendered revision or whole collections', () => {
    const schema = inputSchema(library.setViewState);
    expect(schema.safeParse({ patch: { query: 'units' } }).success).toBe(true);
    expect(schema.safeParse({ bookmark: { key: 'card:CARD_A', saved: true } }).success).toBe(true);
    expect(schema.safeParse({ filter: { name: 'Portraits', kind: 'image' } }).success).toBe(true);
    const wire = JSON.stringify(z.toJSONSchema(schema));
    expect(wire).not.toContain('"expectedRevision"');
    expect(wire).not.toContain('"bookmarks"');
    expect(wire).not.toContain('"assetsFilters"');
  });

  test('concurrent query and different view leaves survive actual SDK CAS retries', async () => {
    const seed: NoteState<typeof library.note> = {
      query: 'old', bookmarks: ['document:guide'],
      views: { cards: 'grid', assets: 'grid', knowledge: 'reader',
        knowledgeSelection: { path: 'docs/start.md' }, assetsFilters: [{ name: 'Original', kind: 'image' }] },
    };
    const f = fixture(library.note, seed, 4);
    const saved = await Promise.all([
      library.setViewState(f.context, { patch: { query: 'data/units.json' } }),
      library.setViewState(f.context, { patch: { views: { cards: 'table' } } }),
      library.setViewState(f.context, { patch: { views: { assets: 'list' } } }),
      library.setViewState(f.context, { patch: { views: { cardsSelection: ['CARD_A'] } } }),
    ]);
    expect(f.state()).toEqual({ ...seed, query: 'data/units.json',
      views: { ...seed.views, cards: 'table', assets: 'list', cardsSelection: ['CARD_A'] } });
    expect(f.stats().accepted).toBe(4);
    expect(f.stats().conflicts).toBeGreaterThanOrEqual(3);
    expect(new Set(saved.map(result => result.revision)).size).toBe(4);
  });

  test('simultaneous focus path and selection initialize missing views', async () => {
    const f = fixture(library.note, {}, 2);
    await Promise.all([
      library.setViewState(f.context, { patch: { query: 'data/units.json' } }),
      library.setViewState(f.context, { patch: { views: { cardsSelection: ['CARD_A'] } } }),
    ]);
    expect(f.state()).toEqual({ query: 'data/units.json', views: { cardsSelection: ['CARD_A'] } });
    expect(f.stats().conflicts).toBeGreaterThan(0);
  });

  test('empty and nullable leaf values clear selections without clearing sibling leaves', async () => {
    const f = fixture(library.note, { views: { cardsSelection: ['CARD_A'], assetsSelection: 'asset-a',
      battleComparisonSelection: { before: { experimentId: 'old-a', reportId: 'a' }, after: { experimentId: 'old-b', reportId: 'b' } },
      storyNodeSelection: { storyId: 'story-old', nodeId: 'old' } } }, 3);
    await Promise.all([
      library.setViewState(f.context, { patch: { views: { cardsSelection: [] } } }),
      library.setViewState(f.context, { patch: { views: { battleComparisonSelection: null } } }),
      library.setViewState(f.context, { patch: { views: { storyNodeSelection: { storyId: 'story-new', nodeId: 'new' } } } }),
    ]);
    expect(f.state().views).toEqual({ cardsSelection: [], assetsSelection: 'asset-a',
      battleComparisonSelection: null, storyNodeSelection: { storyId: 'story-new', nodeId: 'new' } });
    expect(f.stats().conflicts).toBeGreaterThan(0);
  });

  test('one combined intent applies all fields and preserves explicit empty strings', async () => {
    const f = fixture(library.note, { query: 'old', bookmarks: ['keep'],
      views: { assetsSelection: 'old-asset', knowledge: 'source' } });
    await library.setViewState(f.context, {
      patch: { query: '', views: { assetsSelection: '', balanceMetricSelection: { kind: 'unit', metric: 'health' } } },
      bookmark: { key: 'added', saved: true },
      filter: { name: 'Saved', maxWidth: 0, maxDurationMs: 0 },
    });
    expect(f.state()).toEqual({ query: '', bookmarks: ['keep', 'added'], views: {
      assetsSelection: '', knowledge: 'source', balanceMetricSelection: { kind: 'unit', metric: 'health' },
      assetsFilters: [{ name: 'Saved', maxWidth: 0, maxDurationMs: 0 }],
    } });
    expect(f.stats().accepted).toBe(1);
  });

  test('bookmark saves and removals preserve concurrent independent keys', async () => {
    const f = fixture(library.note, { bookmarks: ['keep', 'remove'], views: { cards: 'grid' } }, 3);
    await Promise.all([
      library.setViewState(f.context, { bookmark: { key: 'new-a', saved: true } }),
      library.setViewState(f.context, { bookmark: { key: 'remove', saved: false } }),
      library.setViewState(f.context, { bookmark: { key: 'new-b', saved: true } }),
    ]);
    expect(f.state().bookmarks?.slice().sort()).toEqual(['keep', 'new-a', 'new-b']);
    expect(f.state().views).toEqual({ cards: 'grid' });
    expect(f.stats().accepted).toBe(3);
    expect(f.stats().conflicts).toBeGreaterThan(0);
  });

  test('repeated bookmark desired states are idempotent rather than toggles', async () => {
    const f = fixture(library.note, {}, 2);
    const save = { bookmark: { key: 'same', saved: true } };
    await Promise.all([library.setViewState(f.context, save), library.setViewState(f.context, save)]);
    expect(f.state().bookmarks).toEqual(['same']);
    expect(f.stats().accepted).toBe(1);
    expect(f.stats().conflicts).toBe(1);
    await library.setViewState(f.context, save);
    expect(f.stats().accepted).toBe(1);
    await library.setViewState(f.context, { bookmark: { key: 'same', saved: false } });
    const afterRemoval = f.stats();
    await library.setViewState(f.context, { bookmark: { key: 'same', saved: false } });
    expect(f.state().bookmarks).toEqual([]);
    expect(f.stats().accepted).toBe(afterRemoval.accepted);
  });

  test('concurrent new bookmarks keep the newest keys within the 200-item bound', async () => {
    const f = fixture(library.note, { bookmarks: Array.from({ length: 199 }, (_, i) => `old-${i}`) }, 2);
    await Promise.all([
      library.setViewState(f.context, { bookmark: { key: 'new-a', saved: true } }),
      library.setViewState(f.context, { bookmark: { key: 'new-b', saved: true } }),
    ]);
    expect(f.state().bookmarks).toHaveLength(200);
    expect(new Set(f.state().bookmarks).size).toBe(200);
    expect(f.state().bookmarks).toContain('new-a');
    expect(f.state().bookmarks).toContain('new-b');
  });

  test('filters upsert by name against current state and replace old optional fields', async () => {
    const f = fixture(library.note, { query: 'keep', bookmarks: ['keep'], views: { cards: 'table',
      assetsFilters: [{ name: 'Original', kind: 'image' }, { name: 'Replace', kind: 'audio', minDurationMs: 400 }] } }, 3);
    await Promise.all([
      library.setViewState(f.context, { filter: { name: 'Replace', format: 'png' } }),
      library.setViewState(f.context, { filter: { name: 'Added', status: 'candidate' } }),
      library.setViewState(f.context, { patch: { views: { assets: 'list' } } }),
    ]);
    expect(f.state().views?.assetsFilters?.slice().sort((a, b) => a.name.localeCompare(b.name))).toEqual([
      { name: 'Added', status: 'candidate' }, { name: 'Original', kind: 'image' }, { name: 'Replace', format: 'png' },
    ]);
    expect(f.state()).toMatchObject({ query: 'keep', bookmarks: ['keep'], views: { cards: 'table', assets: 'list' } });
    expect(f.stats().accepted).toBe(3);
    expect(f.stats().conflicts).toBeGreaterThan(0);
  });

  test('concurrent same-name filter changes leave one complete winning value', async () => {
    const f = fixture(library.note, {}, 2);
    const inputs = [{ filter: { name: 'Same', kind: 'image', minWidth: 64 } },
      { filter: { name: 'Same', kind: 'audio', minDurationMs: 200 } }];
    const results = await Promise.all(inputs.map(input => library.setViewState(f.context, input)));
    const last = Number(results[0]!.revision) > Number(results[1]!.revision) ? 0 : 1;
    expect(f.state().views?.assetsFilters).toEqual([inputs[last]!.filter]);
    const writes = f.stats().accepted;
    await library.setViewState(f.context, inputs[last]!);
    expect(f.stats().accepted).toBe(writes);
  });

  test('concurrent filters keep the newest names within the 20-item bound', async () => {
    const f = fixture(library.note, { views: { assetsFilters: Array.from({ length: 19 }, (_, i) => ({ name: `old-${i}` })) } }, 2);
    await Promise.all([
      library.setViewState(f.context, { filter: { name: 'new-a', format: 'png' } }),
      library.setViewState(f.context, { filter: { name: 'new-b', format: 'ogg' } }),
    ]);
    expect(f.state().views?.assetsFilters).toHaveLength(20);
    expect(new Set(f.state().views?.assetsFilters?.map(filter => filter.name)).size).toBe(20);
    expect(f.state().views?.assetsFilters).toContainEqual({ name: 'new-a', format: 'png' });
    expect(f.state().views?.assetsFilters).toContainEqual({ name: 'new-b', format: 'ogg' });
    await library.setViewState(f.context, { filter: { name: 'new-a', kind: 'image' } });
    expect(f.state().views?.assetsFilters).toHaveLength(20);
    expect(f.state().views?.assetsFilters?.filter(filter => filter.name === 'new-a')).toEqual([{ name: 'new-a', kind: 'image' }]);
  });
});

describe('production preferences and business revision boundaries', () => {
  test('the production preference contract no longer requires a rendered revision', () => {
    const schema = inputSchema(production.setViewState);
    expect(schema.safeParse({ patch: { query: 'new', selectedId: 'selected' } }).success).toBe(true);
    expect(JSON.stringify(z.toJSONSchema(schema))).not.toContain('"expectedRevision"');
  });

  test('concurrent production query and selection changes preserve both preferences', async () => {
    const f = fixture(production.note, { query: 'old', selectedId: 'old-id' }, 2);
    await Promise.all([
      production.setViewState(f.context, { patch: { query: 'new' } }),
      production.setViewState(f.context, { patch: { selectedId: 'new-id' } }),
    ]);
    expect(f.state()).toEqual({ query: 'new', selectedId: 'new-id' });
    expect(f.stats().accepted).toBe(2);
    expect(f.stats().conflicts).toBe(1);
  });

  test('real requirement saves still require and forward their original business CAS once', async () => {
    const f = fixture(production.note, {});
    const calls: Array<{ extension: string; method: string; input: unknown }> = [];
    f.raw.extensions = { request: async (extension, method, input) => {
      calls.push({ extension, method, input });
      throw Object.assign(new Error('Production revision conflict'), { code: 'revision-conflict' });
    } };
    const context = bindActionContext(production.note, f.raw);
    const input: Parameters<typeof production.updateProduction>[1] = {
      productionId: 'production-a', projectGeneration: 'binding-a', baseRevision: 7,
      requestId: 'same-edit-intent', patch: { brief: 'unsaved user text' },
    };
    await expect(production.updateProduction(context, input)).rejects.toMatchObject({ code: 'revision-conflict' });
    expect(calls).toEqual([{ extension: 'cardgame-content', method: 'updateProduction', input }]);
    expect(inputSchema(production.updateProduction).safeParse({ productionId: 'production-a', patch: {} }).success).toBe(false);
    expect(f.stats()).toMatchObject({ reads: 0, accepted: 0, attempts: 0 });
  });

  test('document/card workflow revisions remain in the real business action contracts', () => {
    expect(inputSchema(library.saveDocument).parse({ path: 'docs/start.md', content: 'text', expectedRevision: 'document-v1' }))
      .toMatchObject({ expectedRevision: 'document-v1' });
    expect(inputSchema(library.updateCard).parse({ id: 'CARD_A', patch: {}, expectedRevision: 'card-v1' }))
      .toMatchObject({ expectedRevision: 'card-v1' });
    expect(inputSchema(library.createCardWorkflow).parse({ itemIds: ['CARD_A'], featureId: 'feature-a', expectedRevision: 'card-v1' }))
      .toMatchObject({ expectedRevision: 'card-v1' });
    expect(inputSchema(library.switchCardTheme).safeParse({ id: 'CARD_A', themeId: 'jade' }).success).toBe(false);
    expect(inputSchema(production.cardWorkflow).parse({ operation: 'saveCardDraft', productionId: 'production-a', baseRevision: 7 }))
      .toMatchObject({ baseRevision: 7 });
  });
});
