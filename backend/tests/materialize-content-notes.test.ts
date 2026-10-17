import { afterEach, expect, test } from 'bun:test';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { completePublicationSource } from '@realiz3r/worka/desktop-package';
import { materializeContentNotes, validateContentContract } from '../scripts/materialize-content-notes';

const roots: string[] = [];
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); });
const noteIds = [1, 7, 8, 9, 10, 12];
const contract = `import { z, extensionResource } from '@realiz3r/worka/extension-contracts';
export const entry = extensionResource({name:'extension.example.item',input:z.object({id:z.string()}),output:z.string()});\n`;
async function put(root: string, name: string, data: string | Buffer) { await mkdir(dirname(join(root, name)), { recursive: true }); await writeFile(join(root, name), data); }
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'cardgame-content-sources-')); roots.push(root);
  await put(root, 'backend/plugins/cardgame-content/src/contract.ts', contract);
  for (const id of noteIds) {
    for (const name of ['README.md', 'SKILL.md', 'icon.svg', 'config.ts', 'config.json', 'config-local.ts', 'instance.config.ts'])
      await put(root, `notes/note-${id}/${name}`, `instance:${id}:${name}`);
  }
  for(const id of noteIds){
    await put(root,`notes/note-${id}/package.json`,JSON.stringify({name:`note-${id}`,dependencies:{[`extra-${id}`]:'1.0.0',...(id===1?{'shared-ui':'2.0.0'}:{})}}));
    await put(root,`notes/note-${id}/worka-note.json`,JSON.stringify({schemaVersion:1,name:`Note ${id}`,files:['README.md','icon.svg','surface.ts','instance.json']}));
    await put(root,`notes/note-${id}/surface.ts`,'retired adapter');
  }
  await rm(join(root,'notes/note-1/surface.ts'));
  await put(root, 'notes/note-1/actions.ts', 'import {helper} from "./helper"; export const save = () => "canonical" + helper;\n');
  await put(root, 'notes/note-1/view.tsx', 'export const View = () => null;\n');
  await put(root, 'notes/note-1/helper.ts', 'export const helper = 1;\n');
  return root;
}

test('normal preparation copies exact contract bytes and shared note code, preserving instance metadata', async () => {
  const root = await fixture();
  const result = await materializeContentNotes(root);
  expect(result.notes).toBe(6);
  expect(result.contractSha256).toBe(createHash('sha256').update(contract).digest('hex'));
  for (const id of noteIds) {
    expect(await readFile(join(root, `notes/note-${id}/contract.ts`), 'utf8')).toBe(contract);
    expect(await readFile(join(root, `notes/note-${id}/actions.ts`), 'utf8')).toContain('canonical');
    expect(await readFile(join(root, `notes/note-${id}/helper.ts`), 'utf8')).toContain('helper = 1');
    for (const name of ['README.md', 'SKILL.md', 'icon.svg', 'config.ts', 'config.json', 'config-local.ts', 'instance.config.ts'])
      expect(await readFile(join(root, `notes/note-${id}/${name}`), 'utf8')).toBe(`instance:${id}:${name}`);
    const pkg=JSON.parse(await readFile(join(root,`notes/note-${id}/package.json`),'utf8'));
    expect(pkg.name).toBe(`note-${id}`);expect(pkg.dependencies[`extra-${id}`]).toBe('1.0.0');expect(pkg.dependencies['shared-ui']).toBe('2.0.0');
    const publication=JSON.parse(await readFile(join(root,`notes/note-${id}/worka-note.json`),'utf8'));
    expect(publication.name).toBe(`Note ${id}`);expect(publication.files).not.toContain('contract.ts');expect(publication.files).toContain('instance.json');expect(publication.files).toContain('surface.ts');
    if(id!==1)expect(await readFile(join(root,`notes/note-${id}/surface.ts`),'utf8')).toBe('retired adapter');
    const provenance = JSON.parse(await readFile(join(root, `notes/note-${id}/content-sources.json`), 'utf8'));
    expect(provenance.contractSource).toBe('backend/plugins/cardgame-content/src/contract.ts');
    expect(provenance.files['contract.ts']).toBe(result.contractSha256);
  }
  expect(await materializeContentNotes(root)).toMatchObject({ written: 0, removed: 0 });
  expect(await materializeContentNotes(root, { mode: 'check' })).toMatchObject({ written: 0, removed: 0 });
});

test('canonical dependency conflicts are reconciled explicitly while unrelated dependencies survive',async()=>{
 const root=await fixture();await put(root,'notes/note-8/package.json',JSON.stringify({name:'note-8',dependencies:{'shared-ui':'1.0.0','unrelated-business':'9.9.9'}}));
 const result=await materializeContentNotes(root);expect(result.dependencyChanges).toContainEqual({note:'notes/note-8',field:'dependencies',name:'shared-ui',from:'1.0.0',to:'2.0.0'});
 const target=JSON.parse(await readFile(join(root,'notes/note-8/package.json'),'utf8'));expect(target.dependencies).toMatchObject({'shared-ui':'2.0.0','unrelated-business':'9.9.9'});
});

test('independent added resources and declared business dependencies survive ordinary preparation', async () => {
  const root = await fixture();
  await materializeContentNotes(root);
  await put(root,'notes/note-8/local-assets/independent.txt','instance eight resource');
  const metadata=JSON.parse(await readFile(join(root,'notes/note-8/worka-note.json'),'utf8'));
  metadata.files.push('local-assets/independent.txt');
  await put(root,'notes/note-8/worka-note.json',JSON.stringify(metadata));
  const manifest=JSON.parse(await readFile(join(root,'notes/note-8/package.json'),'utf8'));
  manifest.dependencies['independent-business']='3.4.5';
  await put(root,'notes/note-8/package.json',JSON.stringify(manifest));
  await materializeContentNotes(root);
  expect(await readFile(join(root,'notes/note-8/local-assets/independent.txt'),'utf8')).toBe('instance eight resource');
  expect(JSON.parse(await readFile(join(root,'notes/note-8/worka-note.json'),'utf8')).files).toContain('local-assets/independent.txt');
  expect(JSON.parse(await readFile(join(root,'notes/note-8/package.json'),'utf8')).dependencies['independent-business']).toBe('3.4.5');
});

test('a business import cannot expand the note closure into backend implementation', async () => {
  const root = await fixture();
  await put(root,'backend/private.ts','export const privateImplementation = "server only";');
  await put(root,'notes/note-1/actions.ts','export {privateImplementation} from "../../backend/private";');
  await expect(materializeContentNotes(root)).rejects.toThrow('源码依赖不能发布');
  await expect(readFile(join(root,'notes/note-8/contract.ts'))).rejects.toThrow();
});

test('a newly shared source cannot overwrite an independent instance resource', async () => {
  const root = await fixture();
  await materializeContentNotes(root);
  await put(root,'notes/note-8/nested/helper.ts','export const helper = "independent";');
  await put(root,'notes/note-1/nested/helper.ts','export const helper = "new shared business";');
  await put(root,'notes/note-1/actions.ts','export {helper} from "./nested/helper";');
  await expect(materializeContentNotes(root)).rejects.toThrow('independent instance file');
  expect(await readFile(join(root,'notes/note-8/nested/helper.ts'),'utf8')).toContain('independent');
  await expect(readFile(join(root,'notes/note-7/nested/helper.ts'))).rejects.toThrow();
});

test('check mode detects target hash drift without changing the target', async () => {
  const root = await fixture();
  await materializeContentNotes(root);
  await put(root, 'notes/note-8/contract.ts', '// drift\n');
  await expect(materializeContentNotes(root, { mode: 'check' })).rejects.toThrow('hash mismatch: notes/note-8/contract.ts');
  expect(await readFile(join(root, 'notes/note-8/contract.ts'), 'utf8')).toBe('// drift\n');
});

test('check mode detects provenance drift and normal preparation restores exact hashes', async () => {
  const root = await fixture();
  await materializeContentNotes(root);
  const path = join(root, 'notes/note-7/content-sources.json');
  const provenance = JSON.parse(await readFile(path, 'utf8'));
  provenance.files['contract.ts'] = '0'.repeat(64);
  await writeFile(path, JSON.stringify(provenance));
  await expect(materializeContentNotes(root, { mode: 'check' })).rejects.toThrow('provenance mismatch');
  await materializeContentNotes(root);
  await expect(materializeContentNotes(root, { mode: 'check' })).resolves.toMatchObject({ written: 0 });
});

test('removed shared files are pruned only from the previous generated inventory', async () => {
  const root = await fixture();
  await materializeContentNotes(root);
  await put(root, 'notes/note-8/instance.ts', 'preserve local instance file');
  await put(root, 'notes/note-1/actions.ts', 'export const save = () => "canonical";\n');
  await rm(join(root, 'notes/note-1/helper.ts'));
  const result = await materializeContentNotes(root);
  expect(result.removed).toBe(5);
  await expect(readFile(join(root, 'notes/note-8/helper.ts'))).rejects.toThrow();
  expect(await readFile(join(root, 'notes/note-8/instance.ts'), 'utf8')).toBe('preserve local instance file');
});

test('ordinary backend build syncs nested types, images and business packages; all six source exports rebuild independently', async () => {
  const root = await fixture();
  const host = dirname(createRequire(import.meta.url).resolve('@realiz3r/worka/package.json'));
  await mkdir(join(root,'node_modules/@realiz3r'),{recursive:true});
  await symlink(host,join(root,'node_modules/@realiz3r/worka'));
  for (const file of ['build.ts','materialize-content-notes.ts'])
    await cp(join(import.meta.dir,'../scripts',file),join(root,'backend/scripts',file));
  await put(root,'backend/plugin.ts','export const backend = "fixture";');
  await put(root,'backend/package.json',JSON.stringify({name:'@fixture/content-backend',version:'1.0.0',type:'module',files:['dist'],scripts:{build:'bun scripts/build.ts'},peerDependencies:{'@realiz3r/worka':'^0.3.15'}}));
  await put(root,'notes/note-1/actions.ts','import type {Label} from "./nested/types"; import {helper} from "./nested/helper"; import {business} from "business-helper"; export const save = (): Label => helper + business;');
  await put(root,'notes/note-1/view.tsx','import image from "./nested/image.png"; export default () => image;');
  await put(root,'notes/note-1/nested/helper.ts','export const helper = "nested-";');
  await put(root,'notes/note-1/nested/types.d.ts','export type Label = string;');
  await put(root,'notes/note-1/nested/image.png',Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6RkAAAAASUVORK5CYII=','base64'));
  await put(root,'notes/note-1/packages/helper/package.json',JSON.stringify({name:'business-helper',version:'1.0.0',type:'module',exports:'./index.ts'}));
  await put(root,'notes/note-1/packages/helper/index.ts','export {business} from "./nested/value";');
  await put(root,'notes/note-1/packages/helper/nested/value.ts','export const business = "business";');
  for (const id of noteIds) {
    await put(root,`notes/note-${id}/package.json`,JSON.stringify({name:`note-${id}`,type:'module',dependencies:{'business-helper':'file:./packages/helper'}}));
    await put(root,`notes/note-${id}/worka-note.json`,JSON.stringify({schemaVersion:1,name:`Note ${id}`,files:['README.md','icon.svg']}));
  }
  const build = Bun.spawn([process.execPath,'run','build'],{cwd:join(root,'backend'),env:{...process.env,PATH:dirname(process.execPath)+':'+process.env.PATH},stdout:'pipe',stderr:'pipe'});
  const [exitCode,stdout,stderr] = await Promise.all([build.exited,new Response(build.stdout).text(),new Response(build.stderr).text()]);
  expect({exitCode,stderr:exitCode?stderr:''}).toEqual({exitCode:0,stderr:''});
  expect(stdout).toContain('shared content sources for 6 notes');
  const required = ['nested/helper.ts','nested/types.d.ts','nested/image.png','packages/helper/package.json','packages/helper/index.ts','packages/helper/nested/value.ts'];
  for (const id of noteIds) {
    const source=join(root,`notes/note-${id}`),recipient=join(root,`export-${id}`);
    const provenance=JSON.parse(await readFile(join(source,'content-sources.json'),'utf8'));
    for (const file of required) expect(provenance.files[file]).toMatch(/^[a-f\d]{64}$/);
    const frozen=await completePublicationSource(source,JSON.parse(await readFile(join(source,'worka-note.json'),'utf8')));
    for (const file of required) expect(frozen.files).toContain(file);
    for (const file of frozen.files) await put(recipient,file,await readFile(join(source,file)));
    const install=Bun.spawn([process.execPath,'install','--offline','--ignore-scripts'],{cwd:recipient,stdout:'pipe',stderr:'pipe'});
    expect(await install.exited).toBe(0);
    const actions=await Bun.build({entrypoints:[join(recipient,'actions.ts')],target:'node',format:'esm',outdir:join(recipient,'output')});
    expect(actions.success).toBe(true);
    expect((await import(join(recipient,'output/actions.js'))).save()).toBe('nested-business');
    const view=await Bun.build({entrypoints:[join(recipient,'view.tsx')],target:'browser',outdir:join(recipient,'browser')});
    expect(view.success).toBe(true);
    expect(view.outputs.some(output=>output.path.endsWith('.png'))).toBe(true);
  }
});

for (const dependency of [
  `import { Service } from './service';`,
  `import type { Secret } from '../../../../../private';`,
  `export type { Secret } from '../backend';`,
  `export * from '@realiz3r/worka/host';`,
  `import fs from 'node:fs';`,
  `import { z } from '@dsh-workbench/runtime/internal';`,
  `const load = () => import('./service');`,
  `const load = () => import(path);`,
  `import service = require('./service');`,
]) test(`contract import boundary rejects ${dependency}`, async () => {
  const root = await fixture();
  await put(root, 'backend/plugins/cardgame-content/src/contract.ts', dependency);
  await expect(materializeContentNotes(root)).rejects.toThrow('contract');
  await expect(readFile(join(root, 'notes/note-1/contract.ts'))).rejects.toThrow();
});

test('contract validator allows only the public contract entry and zod, including type-only imports', () => {
  expect(() => validateContentContract(`import type { ZodType } from 'zod'; import { z } from 'zod'; export { extensionMethod } from '@realiz3r/worka/extension-contracts'; export type { ExtensionResource } from '@realiz3r/worka/extension-contracts'; export const value=z.string();`)).not.toThrow();
});

test('a target symlink fails the whole preflight without writing earlier notes', async () => {
  const root = await fixture();
  await put(root, 'outside.ts', 'outside remains');
  await symlink(join(root, 'outside.ts'), join(root, 'notes/note-12/contract.ts'));
  await expect(materializeContentNotes(root)).rejects.toThrow('symlink');
  await expect(readFile(join(root, 'notes/note-1/contract.ts'))).rejects.toThrow();
  expect(await readFile(join(root, 'outside.ts'), 'utf8')).toBe('outside remains');
});


test('non-file targets fail the whole preflight before earlier notes are written', async () => {
  const root = await fixture();
  await mkdir(join(root, 'notes/note-12/actions.ts'));
  await expect(materializeContentNotes(root)).rejects.toThrow('regular file');
  await expect(readFile(join(root, 'notes/note-1/contract.ts'))).rejects.toThrow();
});
