/** Explicit Bun runner: load the registered game's own validators and transition functions. */
import { readFile, realpath, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { exploreStoryPaths } from '../src/story-execution';
const hash = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');
export async function runStoryExecution(input: { projectRoot: string; storyId: string; stateLimit?: number; depthLimit?: number }) {
  const root = await realpath(input.projectRoot);
  const catalogBytes = await readFile(join(root, 'public/data/content-catalog.json'));
  const catalog = JSON.parse(catalogBytes.toString());
  const entries = (catalog.resources ?? []).filter((entry: any) => entry.kind === 'story' && entry.resourceId === input.storyId);
  if (entries.length !== 1) throw Error('Story must have a unique catalog entry');
  const path = entries[0].publicPath;
  if (typeof path !== 'string' || !path.startsWith('data/') || path.includes('\\') || path.split('/').some((part: string) => part === '..' || part === '.')) throw Error('Invalid story catalog path');
  const sourcePath = await realpath(join(root, 'public', path));
  if (!sourcePath.startsWith(join(root, 'public/data') + sep)) throw Error('Story path escapes project data');
  const bytes = await readFile(sourcePath);
  if (bytes.length > 8 * 1024 * 1024) throw Error('Story exceeds 8 MiB');
  const directory = await mkdtemp(join(tmpdir(), 'worka-story-execution-'));
  try {
    const modulePath = (path: string) => JSON.stringify(join(root, path));
    const entry = join(directory, 'entry.ts');
    await writeFile(entry, [
      `export {validateStoryGraphResource} from ${modulePath('src/game/scenes/story/storyContentAdapter.ts')};`,
      `export {createStoryFlowViewModel,createStoryChoiceTransition,indexStoryGraph,createInitialStoryRuntime} from ${modulePath('src/game/scenes/story/storyFlowViewModel.ts')};`,
      `export {attachStoryActorAbilities} from ${modulePath('src/game/state/StoryState.ts')};`,
      `export {default as npcCatalog} from ${modulePath('public/data/world/npcs.json')};`,
    ].join('\n'));
    const built = await Bun.build({ entrypoints: [entry], target: 'bun', minify: true });
    if (!built.success || built.outputs.length !== 1) throw Error('Game story runtime could not be bundled: ' + built.logs.map(log => log.message).join('; '));
    const code = await built.outputs[0]!.text();
    const bundle = join(directory, 'runtime.mjs');
    await writeFile(bundle, code);
    const runtime = await import(pathToFileURL(bundle).href);
    const graph = runtime.validateStoryGraphResource(JSON.parse(bytes.toString()));
    const index = runtime.indexStoryGraph(graph);
    const initialState = runtime.attachStoryActorAbilities(runtime.createInitialStoryRuntime(graph), runtime.npcCatalog.npcs);
    const report = exploreStoryPaths({ initialState,
      inspect: (state, selected) => runtime.createStoryFlowViewModel(graph, { storyState: state, selectedChoiceIds: selected }, index),
      transition: (state, selected, choiceId) => runtime.createStoryChoiceTransition(runtime.createStoryFlowViewModel(graph, { storyState: state, selectedChoiceIds: selected }, index), choiceId),
    }, input);
    // Prevent an input changing mid-run from being labeled as a stable report.
    if (hash(await readFile(sourcePath)) !== hash(bytes) || hash(await readFile(join(root, 'public/data/content-catalog.json'))) !== hash(catalogBytes)) throw Error('Story inputs changed during analysis; rerun');
    return { schemaVersion: 1, storyId: input.storyId, storyRevision: hash(bytes), catalogRevision: hash(catalogBytes), runtimeRevision: hash(code), createdAt: new Date().toISOString(),
      totalNodes: graph.nodes.length, totalChoices: graph.choices.length,
      unvisitedNodeIds: graph.nodes.map((node: { id: string }) => node.id).filter((id: string) => !report.reachedNodeIds.includes(id)),
      initialStatePolicy: 'isolated-story-seed-with-npc-defaults', ...report };
  } finally { await rm(directory, { recursive: true, force: true }); }
}
if (import.meta.main) {
  const flag = (name: string) => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1]; };
  const projectRoot = flag('--project'), storyId = flag('--story'), output = flag('--output');
  if (!projectRoot || !storyId || !output) throw Error('Required: --project PATH --story ID --output FILE');
  const report = await runStoryExecution({ projectRoot, storyId });
  if (output === '-') { process.stdout.write(JSON.stringify(report)); } else {
  await writeFile(resolve(output), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ storyId, exploredStates: report.exploredStates, reachedNodes: report.reachedNodeIds.length, bounded: report.bounded, externalStops: report.externalStops, errors: report.errors }));
  }
}
