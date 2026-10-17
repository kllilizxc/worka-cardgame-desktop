import { afterEach, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { createContentService } from '../plugins/cardgame-content/src/content';
import { contentQueries } from '../plugins/cardgame-content/src/contract';
import { createProductionEvents } from '../plugins/cardgame-content/src/production-events';
import type { WorkflowService } from '../plugins/cardgame-content/src/workflow';
import type { ContentQuery, ContentService, Page } from '../plugins/cardgame-content/src/types';

const directories: string[] = [];
const services: ContentService[] = [];
const databases: Database[] = [];
afterEach(async () => {
  for (const database of databases.splice(0)) database.close();
  for (const service of services.splice(0)) await service.close();
  for (const directory of directories.splice(0)) await rm(directory, { recursive: true, force: true });
});
const unit = (id: string) => ({ id, name: id, kind: 'unit', description: 'Paging fixture', rarity: 'common', realmId: 'qi', race: 'beast', linggen: [], gongfaIds: [], attack: 1, health: 2 });
async function put(root: string, name: string, data: string | Buffer) { await mkdir(dirname(join(root, name)), { recursive: true }); await writeFile(join(root, name), data); }
async function fixture(count = 5) {
  const directory = await mkdtemp(join(tmpdir(), 'cardgame-pages-')); directories.push(directory);
  const game = join(directory, 'game'), dataRoot = join(directory, 'data');
  const cards = Array.from({ length: count }, (_, i) => unit(`UNIT_${String(i + 1).padStart(3, '0')}`));
  await put(game, 'public/data/cards/units.json', JSON.stringify({ units: cards }));
  await put(game, 'knowledge/target.md', '# Target\n\nTarget content.\n');
  await put(game, 'knowledge/source.md', '# Source\n\n[First](target.md)\n[Second](target.md) [Third](target.md)\n');
  await put(game, 'knowledge/another.md', '# Another\n\n[Fourth](target.md)\n');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6RkAAAAASUVORK5CYII=', 'base64');
  await put(game, 'public/assets/one.png', png); await put(game, 'public/assets/two.png', png);
  await put(game, 'public/data/content-catalog.json', JSON.stringify({ resources: [{ kind: 'story', resourceId: 'story.a', publicPath: 'data/story/a.json' }, { kind: 'story', resourceId: 'story.b', publicPath: 'data/story/b.json' }] }));
  const start = () => { const service = createContentService({ dataRoot, projects: [{ id: 'a', root: game }, { id: 'b', root: game }] }); services.push(service); return service; };
  const external = () => { const database = new Database(join(dataRoot, 'content.sqlite')); databases.push(database); return database; };
  return { game, dataRoot, cards, start, external };
}
function page(service: ContentService, query: ContentQuery) { return service.query(query) as Promise<Page<Record<string, unknown>>>; }
const cardsQuery = { projectId: 'a', op: 'cards' as const, limit: 2 };

test('all public SQL page operations return canonical pages and never expose private cursors', async () => {
  const f = await fixture(), service = f.start();
  const assetPage = await page(service, { projectId: 'a', op: 'assets', limit: 1 });
  const queries: ContentQuery[] = [cardsQuery, { projectId: 'a', op: 'documents', limit: 1 }, { projectId: 'a', op: 'directories', limit: 1 },
    { projectId: 'a', op: 'backlinks', path: 'knowledge/target.md', limit: 1 }, { projectId: 'a', op: 'assets', limit: 1 },
    { projectId: 'a', op: 'versions', assetId: String(assetPage.items[0]!.id), limit: 1 }, { projectId: 'a', op: 'recentChanges', limit: 1 },
    { projectId: 'a', op: 'storyBuilds', limit: 1 }, { projectId: 'a', op: 'gameCatalog', kind: 'story', limit: 1 }];
  for (const query of queries) {
    const result = await page(service, query);
    expect(Array.isArray(result.items)).toBe(true); expect(typeof result.revision).toBe('string'); expect(result.revision.length).toBeGreaterThan(0);
    expect(Object.hasOwn(result, 'nextCursor')).toBe(false);
    if (result.next) expect((await page(service, { ...query, cursor: result.next } as ContentQuery)).revision).toBe(result.revision);
  }
});

test('stable cursor pages have exact upper and final boundaries without duplicates', async () => {
  const f = await fixture(103), service = f.start();
  const first = contentQueries.cards.output.parse(await service.query({ ...cardsQuery, limit: 1000 }));
  expect(first.items).toHaveLength(100); expect(first.total).toBe(103); expect(first.next).toBeTruthy();
  const final = contentQueries.cards.output.parse(await service.query({ ...cardsQuery, limit: 1000, cursor: first.next! }));
  expect(final.items).toHaveLength(3); expect(final.next).toBeUndefined(); expect(final.revision).toBe(first.revision);
  expect(new Set([...first.items, ...final.items].map(item => item.id)).size).toBe(103);
});

for (const mutation of ['insert', 'update', 'delete'] as const) test(`an actual source ${mutation} restarts an old cursor at the current first page with a new revision`, async () => {
  const f = await fixture(), service = f.start();
  const first = await page(service, cardsQuery); expect(first.next).toBeTruthy();
  const updated = structuredClone(f.cards);
  if (mutation === 'insert') updated.unshift(unit('UNIT_000'));
  if (mutation === 'update') updated[0]!.name = 'Updated first unit';
  if (mutation === 'delete') updated.shift();
  await put(f.game, 'public/data/cards/units.json', JSON.stringify({ units: updated }));
  await service.query({ projectId: 'a', op: 'card', id: updated[0]!.id, freshKind: 'unit' });
  const resumed = await page(service, { ...cardsQuery, cursor: first.next! }), current = await page(service, cardsQuery);
  expect(resumed.revision).not.toBe(first.revision); expect(resumed.revision).toBe(current.revision); expect(resumed.items).toEqual(current.items);
  expect(new Set(resumed.items.map(item => item.id)).size).toBe(resumed.items.length);
  expect(resumed.items[0]!.id).toBe(updated[0]!.id); expect(resumed.items[0]!.name).toBe(updated[0]!.name);
});

test('cursors reject different project, operation, filters and page size', async () => {
  const f = await fixture(), service = f.start(), first = await page(service, cardsQuery);
  for (const query of [{ ...cardsQuery, projectId: 'b' }, { projectId: 'a', op: 'documents' as const, limit: 2 },
    { ...cardsQuery, q: 'UNIT' }, { ...cardsQuery, labels: ['fixture'] }, { ...cardsQuery, limit: 3 }])
    await expect(page(service, { ...query, cursor: first.next! })).rejects.toThrow('another project or query');
  for (const cursor of ['bad cursor', Buffer.from(JSON.stringify({ path: 'legacy-unversioned' })).toString('base64url')])
    await expect(page(service, { ...cardsQuery, cursor })).rejects.toThrow('malformed');
  await expect(service.query({ projectId: 'a', op: 'inspection', cursor: first.next! })).rejects.toThrow('malformed');
  // Property order does not create a false query identity.
  const again = await page(service, { limit: 2, op: 'cards', projectId: 'a', cursor: first.next! });
  expect(again.items[0]!.id).toBe('UNIT_003');
});

test('multiple backlink rows in the same document and line each have a complete seek key', async () => {
  const f = await fixture(), service = f.start();
  let cursor: string | undefined; const seen: string[] = []; let revision: string | undefined;
  do {
    const result = await page(service, { projectId: 'a', op: 'backlinks', path: 'knowledge/target.md', limit: 1, ...(cursor ? { cursor } : {}) });
    expect(result.items).toHaveLength(1); revision ??= result.revision; expect(result.revision).toBe(revision);
    seen.push(`${result.items[0]!.sourcePath}:${result.items[0]!.line}:${result.items[0]!.label}`); cursor = result.next;
  } while (cursor);
  expect(seen).toHaveLength(4); expect(new Set(seen).size).toBe(4);
  const together = await page(service, { projectId: 'a', op: 'backlinks', path: 'knowledge/target.md', limit: 100 });
  expect(together.items).toHaveLength(4);
  expect(new Set(together.items.map(item => item.id)).size).toBe(4);
  const sameDocument = together.items.filter(item => item.sourcePath === 'knowledge/source.md');
  expect(sameDocument).toHaveLength(3);
  expect(new Set(sameDocument.map(item => item.sourceId)).size).toBe(1);
  const validated = contentQueries.backlinks.output.parse(together);
  expect(validated.items.map(item => item.label)).toEqual(together.items.map(item => item.label));
});

test('external SQLite changes and service restart fence old cursors without derived schema state', async () => {
  const f = await fixture(), service = f.start(), first = await page(service, cardsQuery), database = f.external();
  database.query('UPDATE cards SET name = ? WHERE project_id = ? AND id = ?').run('External update', 'a', 'UNIT_001');
  const external = await page(service, { ...cardsQuery, cursor: first.next! });
  expect(external.revision).not.toBe(first.revision); expect(external.items[0]!.name).toBe('External update');
  expect(database.query("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'content_page%'").all()).toEqual([]);
  await service.close(); const reopened = f.start();
  const restarted = await page(reopened, { ...cardsQuery, cursor: external.next! });
  expect(restarted.revision).not.toBe(external.revision); expect(restarted.items[0]!.id).toBe('UNIT_001');
});

test('read-only pages keep the revision stable and catalog file changes reset their cursor', async () => {
  const f = await fixture(), service = f.start();
  const source = await readFile(join(f.game, 'public/data/cards/units.json'));
  const first = await page(service, cardsQuery), same = await page(service, cardsQuery);
  expect(same.revision).toBe(first.revision); expect(same.next).toBe(first.next);
  expect(await readFile(join(f.game, 'public/data/cards/units.json'))).toEqual(source);
  const query = { projectId: 'a', op: 'gameCatalog' as const, kind: 'story' as const, limit: 1 };
  const catalog = await page(service, query);
  await put(f.game, 'public/data/content-catalog.json', JSON.stringify({ resources: [{ kind: 'story', resourceId: 'story.0', publicPath: 'data/story/zero.json' }, { kind: 'story', resourceId: 'story.a', publicPath: 'data/story/a.json' }] }));
  const current = await page(service, { ...query, cursor: catalog.next! });
  expect(current.revision).not.toBe(catalog.revision); expect(current.items[0]!.id).toBe('story.0');
});

test('a concurrent external change during an asynchronous page rejects the mixed result', async () => {
  const f = await fixture(), service = f.start(); await page(service, cardsQuery); const database = f.external();
  // Hold an actual async loader boundary and mutate through a separate SQLite
  // connection before its result returns. The query adapter must fence it.
  const load = Reflect.get(service, 'queryGameCatalog') as (input: ContentQuery) => Promise<unknown>;
  Reflect.set(service, 'queryGameCatalog', async (input: ContentQuery) => {
    const result = await load.call(service, input);
    database.query('UPDATE cards SET name = ? WHERE project_id = ? AND id = ?').run('Concurrent update', 'a', 'UNIT_001');
    return result;
  });
  await expect(page(service, { projectId: 'a', op: 'gameCatalog', kind: 'story', limit: 1 })).rejects.toThrow('changed while reading a page');
});

test('version focus resolves its real owning asset outside the currently loaded asset page', async () => {
  const f = await fixture(), service = f.start();
  const first = contentQueries.assets.output.parse(await service.query({ projectId: 'a', op: 'assets', limit: 1 }));
  const second = contentQueries.assets.output.parse(await service.query({ projectId: 'a', op: 'assets', limit: 1, cursor: first.next! }));
  const asset = second.items[0]!, versions = contentQueries.versions.output.parse(await service.query({ projectId: 'a', op: 'versions', assetId: asset.id }));
  expect(first.items.some(item => item.id === asset.id)).toBe(false);
  const focused = contentQueries.asset.output.parse(await service.query({ projectId: 'a', op: 'asset', versionId: versions.items[0]!.id }));
  expect(focused.id).toBe(asset.id);
  await expect(service.query({ projectId: 'a', op: 'asset', versionId: 'missing-version' })).rejects.toThrow('not found in this project');
  await expect(service.query({ projectId: 'a', op: 'asset', id: first.items[0]!.id, versionId: versions.items[0]!.id })).rejects.toThrow('do not match');
});


for (const changesBetweenPages of [false, true]) test(`production adoption consumes canonical version pages and fences mixed generations: ${changesBetweenPages}`, async () => {
  const f = await fixture();
  await put(f.game, 'public/assets/version-100.png', await readFile(join(f.game, 'public/assets/one.png')));
  const service = f.start();
  const assets = await page(service, { projectId: 'a', op: 'assets', limit: 1 }), assetId = String(assets.items[0]!.id), database = f.external();
  const original = database.query('SELECT * FROM asset_versions WHERE project_id = ? AND asset_id = ?').get('a', assetId) as { id: string };
  for (let index = 0; index < 101; index++) database.query(`INSERT INTO asset_versions(project_id,id,asset_id,path,revision,mime_type,size,source,candidate_id,created_at,adopted)
    SELECT project_id,?,asset_id,?,revision,mime_type,size,source,?,created_at,adopted FROM asset_versions WHERE project_id = ? AND id = ?`)
    .run(`version-${index}`, `public/assets/version-${String(index).padStart(3, '0')}.png`, index === 100 ? 'candidate' : null, 'a', original.id);
  database.query('UPDATE assets SET current_version_id = ? WHERE project_id = ? AND id = ?').run('version-100', 'a', assetId);
  let reads = 0, commits = 0;
  const content: ContentService = {
    query: async input => {
      const result = await service.query(input);
      if (input.op === 'versions') {
        reads++;
        if (changesBetweenPages && reads === 1) database.query('UPDATE cards SET name = ? WHERE project_id = ? AND id = ?').run('Concurrent update', 'a', 'UNIT_001');
      }
      return result;
    }, command: service.command.bind(service), resolveMedia: service.resolveMedia.bind(service), subscribe: service.subscribe.bind(service), close: async () => {},
  };
  const workflow = { query: async () => ({ production: { projectId: 'a' } }), command: async () => { commits++; return { accepted: true }; } } as unknown as WorkflowService;
  const pending = createProductionEvents(workflow, content).recordAdoption({ productionId: 'production', candidateId: 'candidate', assetId, versionId: 'version-100' });
  if (changesBetweenPages) { await expect(pending).rejects.toThrow('版本列表已变化'); expect(commits).toBe(0); }
  else { await expect(pending).resolves.toEqual({ accepted: true }); expect(commits).toBe(1); }
  expect(reads).toBe(2);
});
