import { mkdir, mkdtemp, rm, rename } from 'node:fs/promises';
import { prepareDesktopExtension } from '@realiz3r/worka/desktop-package';
import { resolve } from 'node:path';
import { materializeContentNotes } from './materialize-content-notes';

const root = resolve(import.meta.dir, '..');
const content = await materializeContentNotes(resolve(root, '..'));
console.log(`Prepared ${content.files.length} shared content sources for ${content.notes} notes`);
for(const change of content.dependencyChanges)console.log(`Aligned ${change.note} ${change.field}.${change.name}: ${JSON.stringify(change.from)} -> ${JSON.stringify(change.to)}`);
await mkdir(resolve(root, 'dist'), { recursive: true });
const result = await Bun.build({
  entrypoints: [resolve(root, 'plugin.ts')],
  outdir: resolve(root, 'dist'),
  target: 'node', format: 'esm', naming: 'plugin.js',
  external: ['@realiz3r/worka/host', 'sharp', 'music-metadata', 'bun:sqlite', 'node:sqlite'],
  sourcemap: 'none', minify: false,
});
if (!result.success) throw new AggregateError(result.logs, 'CardGame backend build failed');
console.log(`Built ${result.outputs.length} backend entry`);

const staging = await mkdtemp(resolve(root, '../.cardgame-package-'));
try {
  const files = await prepareDesktopExtension(root, resolve(staging, 'package'), { entry: 'dist/plugin.js', capabilities: ['cardgame-content'] });
  const target = resolve(root, '../extensions/cardgame');
  await mkdir(resolve(root, '../extensions'), {recursive:true});
  await rm(target, {recursive:true,force:true});
  await rename(resolve(staging, 'package'), target);
  console.log(`Packaged ${files.length} verified backend files`);
} finally { await rm(staging, {recursive:true,force:true}); }
