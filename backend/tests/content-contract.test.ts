import { afterEach, expect, test } from 'bun:test';
import { createHash, randomUUID } from 'node:crypto';
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { requestExtension, isOperationRejectedError } from '@dsh-workbench/runtime';
import { createContentService } from '../plugins/cardgame-content/src/content';
import { contentActions, contentQueries, referenceDocumentSchema, referenceResourceSchema } from '../plugins/cardgame-content/src/contract';
import { runBattleExperiment } from '../plugins/cardgame-content/src/battle-experiment';
import { createBattleExecutionService } from '../plugins/cardgame-content/src/battle-execution-service';
import { exploreStoryPaths } from '../plugins/cardgame-content/src/story-execution';
import { createStoryExecutionService } from '../plugins/cardgame-content/src/story-execution-service';
import {bindQueryContext} from '@dsh-workbench/runtime/internal';
import {queries as libraryQueries,note as libraryNote} from '../../notes/note-1/actions';

const roots: string[] = [];
const services: Array<{ close(): Promise<void> }> = [];
afterEach(async () => {
  for (const service of services.splice(0).reverse()) await service.close();
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true });
});
const digest = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const projectId = 'contract-fixture';
async function put(root: string, name: string, data: string | Buffer) {
  await mkdir(dirname(join(root, name)), { recursive: true }); await writeFile(join(root, name), data);
}
function wav() {
  const bytes = Buffer.alloc(44 + 160);
  bytes.write('RIFF'); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write('WAVEfmt ', 8);
  bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(8000, 24); bytes.writeUInt32LE(16000, 28); bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34);
  bytes.write('data', 36); bytes.writeUInt32LE(160, 40);
  return bytes;
}
async function fixture(cardCount = 3) {
  const root = await mkdtemp(join(tmpdir(), 'cardgame-contract-')); roots.push(root);
  const game = join(root, 'game'), dataRoot = join(root, 'data');
  const cards = Array.from({ length: cardCount }, (_, index) => ({ id: `UNIT_${String(index).padStart(3, '0')}`, name: `Unit ${index}`, kind: 'unit', description: 'Contract fixture', rarity: 'common', realmId: 'realm_qi_1', race: 'beast', linggen: [], gongfaIds: [], attack: index + 1, health: 2, labels: ['fixture'] }));
  await put(game, 'public/data/cards/units.json', JSON.stringify({ units: cards }));
  await put(game, 'knowledge/a.md', '# Source\n\n[Target](b.md#target)\n');
  await put(game, 'knowledge/b.md', '# Target\n\nReference body\n');
  await put(game, 'knowledge/scene.md', '---\nscene: true\nnodeId: start\ntitle: Scene\nchapter: Chapter one\n---\n# Scene\n\nA small scene.\n\n## 对话\n- Narrator：Hello <!-- story-line: {"id":"line.1","speakerId":"narrator"} -->\n- Narrator：Goodbye <!-- story-line: {"id":"line.2","speakerId":"narrator"} -->\n');
  await put(game, 'public/assets/sample.png', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6RkAAAAASUVORK5CYII=', 'base64'));
  await put(game, 'public/assets/sample.wav', wav());
  await put(game, 'public/data/story/sample.json', JSON.stringify({ title: 'Story fixture', entryNodeId: 'start', nodes: [{ id: 'start', title: 'Start', body: 'Start detail' }, { id: 'end', title: 'End' }], choices: [{ id: 'go', from: 'start', to: 'end', text: 'Continue' }] }));
  await put(game, 'public/data/decks/sample.json', JSON.stringify({ name: 'Fixture deck', cards: [{ id: cards[0]!.id, count: 2 }, { id: 'MISSING', count: 1 }] }));
  await put(game, 'public/data/content-catalog.json', JSON.stringify({ schemaVersion: 1, resources: [{ resourceId: 'story.sample', kind: 'story', publicPath: 'data/story/sample.json' }, { resourceId: 'deck.sample', kind: 'deck', publicPath: 'data/decks/sample.json' }] }));
  const start = () => { const service = createContentService({ dataRoot, projects: [{ id: projectId, root: game }] }); services.push(service); return service; };
  return { root, game, dataRoot, start };
}

test('actual indexed documents, references and MovePreview source objects satisfy the contract', async () => {
  const { start, game } = await fixture(); const service = start();
  const documents = contentQueries.documents.output.parse(await service.query({ projectId, op: 'documents', limit: 2 }));
  expect(documents.items.length).toBe(2); expect(documents.next).toBeTruthy();
  const raw = await service.query({ projectId, op: 'document', path: 'knowledge/b.md' });
  const before = JSON.stringify(raw), document = contentQueries.document.output.parse(raw);
  expect(document.content).toContain('Reference body'); expect(JSON.stringify(raw)).toBe(before);
  expect(referenceDocumentSchema.parse(raw).content).toBe(document.content);
  expect(referenceResourceSchema.parse({ title: document.title, path: document.path, root: game, revision: document.revision }).path).toBe('knowledge/b.md');
  const preview = contentQueries.movePreview.output.parse(await service.query({ projectId, op: 'movePreview', path: 'knowledge/b.md', toPath: 'knowledge/moved.md' }));
  expect(preview.source).toMatchObject({ id: document.id, path: document.path, content: document.content });
  expect(preview.affected.length).toBeGreaterThan(0); expect(preview.canApply).toBe(true);
  const backlinks = contentQueries.backlinks.output.parse(await service.query({ projectId, op: 'backlinks', path: document.path }));
  expect(backlinks.items.length).toBe(1); expect(backlinks.items[0]!.sourcePath).toBe('knowledge/a.md');
  const graph = contentQueries.graph.output.parse(await service.query({ projectId, op: 'graph', path: 'knowledge/a.md' }));
  expect(graph.nodes.length).toBe(2); expect(graph.edges.length).toBe(1);
  expect(contentQueries.documentMeta.output.parse(await service.query({ projectId, op: 'documentMeta', path: 'knowledge/scene.md' })).isScene).toBe(true);
});

test('nonempty card detail, summaries, counts and cursor boundaries use actual query outputs', async () => {
  const { start } = await fixture(103); const service = start();
  const first = contentQueries.cards.output.parse(await service.query({ projectId, op: 'cards', limit: 1000 }));
  expect(first.items.length).toBe(100); expect(first.total).toBe(103); expect(first.next).toBeTruthy();
  const last = contentQueries.cards.output.parse(await service.query({ projectId, op: 'cards', limit: 100, cursor: first.next! }));
  expect(last.items.length).toBe(3); expect(last.next).toBeUndefined();
  expect(new Set([...first.items, ...last.items].map(item => item.id)).size).toBe(103);
  const detail = contentQueries.card.output.parse(await service.query({ projectId, op: 'card', id: first.items[0]!.id }));
  expect(detail.json.name).toBe(detail.name); expect(detail.json.kind).toBe('unit');
  expect(contentQueries.cards.output.parse(await service.query({ projectId, op: 'cards', limit: 0 })).items.length).toBe(1);
  await expect(service.query({ projectId, op: 'cards', cursor: '!invalid!' })).rejects.toThrow();
  const balance = contentQueries.balanceOverview.output.parse(await service.query({ projectId, op: 'balanceOverview' }));
  expect(balance.cardCount).toBe(103); expect(balance.groups[0]!.attack?.sample).toBe(103);
  expect(contentQueries.status.output.parse(await service.query({ projectId, op: 'status' })).phase).toBe('ready');
});

test('the actual note query and typed resource helper preserve canonical pages and revision resets', async () => {
  const {start,game}=await fixture(5),service=start();
  const wire:unknown[]=[];
  const raw={note:{id:'library',version:'fixture',stateRef:'library:state'},store:{read:async()=>({revision:'config-r1',value:{projectId,mode:'cards'}})},
    resources:{read:async(request:{name:string;input:unknown})=>{
      expect(request.name).toBe('extension.cardgame-content.query');
      const input=await contentQueries.cards.resource.input.parseAsync(request.input);wire.push(input);
      return {key:'cards',epoch:'fixture',version:1,stale:false,data:await service.query(input)};
    }},db:{},notes:{}};
  const context=bindQueryContext(libraryNote,raw as unknown as Parameters<typeof bindQueryContext>[1]);
  const first=await libraryQueries.cards(context,{limit:2});
  expect(first.items).toHaveLength(2);expect(first.next).toBeTruthy();expect(first.revision).not.toBe('');
  expect(Object.hasOwn(first,'nextCursor')).toBe(false);
  const second=await libraryQueries.cards(context,{limit:2,cursor:first.next});
  expect(second.revision).toBe(first.revision);expect(second.items[0]!.id).toBe('UNIT_002');
  const source=JSON.parse(await readFile(join(game,'public/data/cards/units.json'),'utf8'));
  source.units[0].name='Updated first card';await put(game,'public/data/cards/units.json',JSON.stringify(source));
  await service.query({projectId,op:'card',id:'UNIT_000',freshKind:'unit'});
  const resumed=await libraryQueries.cards(context,{limit:2,cursor:first.next});
  expect(resumed.revision).not.toBe(first.revision);expect(resumed.items[0]!.name).toBe('Updated first card');
  await expect(libraryQueries.cards(context,{limit:2,cursor:resumed.next,query:'Unit 1'})).rejects.toThrow('another project or query');
  expect(wire[0]).toMatchObject({projectId,op:'cards',limit:2});
});

test('real PNG and WAV indexing, version history and original media preserve nullable metrics', async () => {
  const { start } = await fixture(); const service = start();
  const assets = contentQueries.assets.output.parse(await service.query({ projectId, op: 'assets' }));
  expect(assets.items.length).toBe(2);
  for (const asset of assets.items) {
    const detail = contentQueries.asset.output.parse(await service.query({ projectId, op: 'asset', id: asset.id }));
    const versions = contentQueries.versions.output.parse(await service.query({ projectId, op: 'versions', assetId: asset.id, limit: 1 }));
    expect(versions.items.length).toBe(1); expect(versions.items[0]!.source).toBe('project');
    const media = contentQueries.media.output.parse(await service.query({ projectId, op: 'media', id: asset.id, variant: 'original' }));
    expect(media.size).toBeGreaterThan(0); expect(media.mimeType).toBe(asset.mimeType);
    if (detail.kind === 'image') { expect(detail.width).toBe(1); expect(detail.durationMs).toBeNull(); expect(versions.items[0]!.durationMs).toBeNull(); }
    if (detail.kind === 'audio') { expect(detail.durationMs).toBeGreaterThan(0); expect(detail.width).toBeNull(); expect(media.width).toBeNull(); }
  }
  const changes = contentQueries.recentChanges.output.parse(await service.query({ projectId, op: 'recentChanges', limit: 2 }));
  expect(changes.items.length).toBe(2); expect(changes.next).toBeTruthy();
  expect(contentQueries.inspection.output.parse(await service.query({ projectId, op: 'inspection' })).findings.length).toBeGreaterThan(0);
});

test('story structure, selected nodes, dialogue paging, compile output and build history parse', async () => {
  const { start } = await fixture(); const service = start();
  const catalog = contentQueries.gameCatalog.output.parse(await service.query({ projectId, op: 'gameCatalog', kind: 'story', limit: 1 }));
  expect(catalog.items.length).toBe(1);
  const analysis = contentQueries.storyAnalysis.output.parse(await service.query({ projectId, op: 'storyAnalysis', id: 'story.sample' }));
  expect('nodes' in analysis && analysis.nodes.length).toBe(2);
  const selected = contentQueries.storyAnalysis.output.parse(await service.query({ projectId, op: 'storyAnalysis', id: 'story.sample', nodeId: 'start' }));
  expect('selectedNode' in selected && selected.selectedNode.detail).toBe('Start detail');
  const page = contentQueries.storyScenePage.output.parse(await service.query({ projectId, op: 'storyScenePage', path: 'knowledge/scene.md', limit: 1 }));
  expect(page.items.length).toBe(1); expect(page.nextOffset).toBe(1);
  const next = contentQueries.storyScenePage.output.parse(await service.query({ projectId, op: 'storyScenePage', path: page.path, offset: page.nextOffset, limit: 1, expectedRevision: page.revision }));
  expect(next.items[0]!.id).toBe('line.2'); expect(next.nextOffset).toBeUndefined();
  const compiled = contentActions.compileStory.output.parse(await service.command('compileStory', { projectId, entry: 'knowledge/scene.md', storyId: 'story.compiled' }));
  expect(compiled.nodeCount).toBe(1);
  expect(contentQueries.storyBuilds.output.parse(await service.query({ projectId, op: 'storyBuilds' })).items.length).toBe(1);
  const deck = contentQueries.gameDeck.output.parse(await service.query({ projectId, op: 'gameDeck', id: 'deck.sample' }));
  expect(deck.cards.length).toBe(2); expect(deck.cards[1]!.missing).toBe(true); expect(deck.total).toBe(3);
});

const noProcess = { spawn: async () => { throw new Error('Contract regression must not spawn model or external work'); } };
test('real deterministic story exploration reports survive the persisted query boundary', async () => {
  const { game, dataRoot, start } = await fixture(); const content = start();
  const current = await content.query({ projectId, op: 'storyAnalysis', id: 'story.sample' }) as { revision: string; catalogRevision: string };
  const explored = exploreStoryPaths({ initialState: { currentNodeId: 'start' }, inspect: state => ({ currentNodeId: state.currentNodeId, choices: state.currentNodeId === 'start' ? [{ id: 'go', visible: true, selectable: true }, { id: 'locked', visible: true, selectable: false, disabledReason: 'Needs key' }] : [] }), transition: () => ({ status: 'selected', nextStoryState: { currentNodeId: 'end' } }) });
  expect(explored.witnesses.length).toBe(1); expect(explored.blockedExamples.length).toBe(1);
  const report = { schemaVersion: 1, storyId: 'story.sample', storyRevision: current.revision, catalogRevision: current.catalogRevision, runtimeRevision: 'a'.repeat(64), createdAt: new Date().toISOString(), totalNodes: 2, unvisitedNodeIds: [], ...explored };
  await put(dataRoot, `story-execution/${digest(JSON.stringify([projectId, 'story.sample']))}.json`, JSON.stringify({ status: 'succeeded', startedAt: report.createdAt, report }));
  const execution = createStoryExecutionService({ dataRoot, projects: [{ id: projectId, root: game }], packageRoot: game, subprocess: noProcess, bunPath: process.execPath, content }); services.push(execution);
  const result = contentQueries.storyExecutionReport.output.parse(await execution.query(projectId, 'story.sample'));
  expect(result.status).toBe('succeeded'); expect(result.contentMatches).toBe(true); expect(result.report!.witnesses[0]!.nodeId).toBe('end');
});

test('real deterministic battle reports and paired comparison parse through historical query service', async () => {
  const { game, dataRoot } = await fixture();
  const settings = { deckId: 'deck.sample', encounterId: 'encounter.sample', policyVersion: 'deterministic@1', seeds: [1, 2, 3], turnLimit: 10, actionLimit: 20, opening: 'player-first' as const };
  const report = await runBattleExperiment({ contentRevision: 'a'.repeat(64), runtimeRevision: 'b'.repeat(64), adapterVersion: 'fixture@1', deckCardIds: ['UNIT_000'], run: async ({ seed }) => ({ outcome: seed === 1 ? 'victory' : seed === 2 ? 'defeat' : 'draw', turns: 1, actions: 2, playedCardIds: ['UNIT_000'], finalStateHash: 'c'.repeat(64) }) }, settings);
  expect(report.summary.valid).toBe(3);
  const experimentId = randomUUID(), before = { experimentId, reportId: randomUUID() }, after = { experimentId, reportId: randomUUID() };
  const directory = `battle-experiments/${digest(projectId)}/runs/${experimentId}`;
  await put(dataRoot, `${directory}/output/reports/${before.reportId}.json`, JSON.stringify(report));
  await put(dataRoot, `${directory}/output/reports/${after.reportId}.json`, JSON.stringify(report));
  const execution = await createBattleExecutionService({ dataRoot, projects: [{ id: projectId, root: game }], packageRoot: game, subprocess: noProcess, bunPath: process.execPath }); services.push(execution);
  const historical = contentQueries.battleExperiments.output.parse(await execution.query(projectId));
  expect(historical.reports.length).toBe(2); expect(historical.reports[0]!.report.trials.length).toBe(3);
  const comparison = contentQueries.battleComparison.output.parse(await execution.compare(projectId, before, after));
  expect(comparison.pairedCount).toBe(3); expect(comparison.pairs.length).toBe(3);
});

test('input routes reject undeclared authority and wrong types before dispatch; invalid post-write output stays uncertain', async () => {
  expect(contentQueries.cards.resource.input.safeParse({ projectId, op: 'cards', limit: 1, access: { noteId: 'other' }, caller: { kind: 'user' }, workspaceRoot: '/unexpected' }).success).toBe(false);
  expect(contentQueries.cards.resource.input.safeParse({ projectId, op: 'saveDocument' }).success).toBe(false);
  expect(contentQueries.cards.resource.input.safeParse({ projectId, op: 'cards', limit: '1' }).success).toBe(false);
  const { game, start } = await fixture(); const service = start(); let writes = 0;
  const original = contentQueries.document.output.parse(await service.query({ projectId, op: 'document', path: 'knowledge/b.md' }));
  const extensions = { request: async (_extension: string, method: string, input?: Record<string, unknown>) => {
    expect(method).toBe('saveDocument'); writes++; await service.command('saveDocument', input); return { invalid: true };
  } };
  const error = await requestExtension(extensions, contentActions.saveDocument.method, { projectId, path: 'knowledge/b.md', expectedRevision: original.revision, content: '# Saved\n\nActual write\n' }).catch(error => error);
  expect(writes).toBe(1); expect(await readFile(join(game, 'knowledge/b.md'), 'utf8')).toContain('Actual write');
  expect(error.message).toContain('after invocation; inspect effects before retrying'); expect(isOperationRejectedError(error)).toBe(false);
});

// Optional real-source coverage copies only selected inputs into a disposable
// project. The supplied checkout is read-only throughout the regression.
const actualSource = process.env.CARDGAME_CONTRACT_GAME_ROOT;
test.skipIf(!actualSource)('selected actual game JSON and knowledge sources parse without changing their checkout', async () => {
  const { game, start } = await fixture();
  const files = ['public/data/cards/units.json', 'public/data/content-catalog.json'];
  const catalog = JSON.parse(await readFile(join(actualSource!, 'public/data/content-catalog.json'), 'utf8'));
  const selected: Record<string, string> = {};
  for (const kind of ['story', 'deck']) {
    const row = catalog.resources.filter((entry: { kind: string }) => entry.kind === kind).sort((a: { resourceId: string }, b: { resourceId: string }) => a.resourceId.localeCompare(b.resourceId, 'en'))[0];
    selected[kind] = row.resourceId; files.push(`public/${row.publicPath}`);
  }
  files.push(...(await readdir(join(actualSource!, 'knowledge'))).filter(name => name.endsWith('.md')).sort().slice(0, 2).map(name => `knowledge/${name}`));
  const hashes = new Map<string, string>();
  for (const file of files) {
    hashes.set(file, digest(await readFile(join(actualSource!, file))));
    await mkdir(dirname(join(game, file)), { recursive: true }); await copyFile(join(actualSource!, file), join(game, file));
  }
  const service = start();
  const cards = contentQueries.cards.output.parse(await service.query({ projectId, op: 'cards', limit: 2 }));
  expect(cards.items.length).toBe(2);
  expect(contentQueries.card.output.parse(await service.query({ projectId, op: 'card', id: cards.items[0]!.id })).json.id).toBe(cards.items[0]!.id);
  const actualDocument = files.find(file => file.startsWith('knowledge/'))!;
  expect(contentQueries.document.output.parse(await service.query({ projectId, op: 'document', path: actualDocument })).content.length).toBeGreaterThan(0);
  const story = contentQueries.storyAnalysis.output.parse(await service.query({ projectId, op: 'storyAnalysis', id: selected.story! }));
  expect('nodes' in story && story.nodes.length).toBeGreaterThan(0);
  expect(contentQueries.gameDeck.output.parse(await service.query({ projectId, op: 'gameDeck', id: selected.deck! })).cards.length).toBeGreaterThan(0);
  for (const [file, before] of hashes) expect(digest(await readFile(join(actualSource!, file)))).toBe(before);
});
