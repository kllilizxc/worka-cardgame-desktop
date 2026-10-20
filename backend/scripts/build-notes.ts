import { access, mkdir, mkdtemp, readFile, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { materializeContentNotes } from './materialize-content-notes';

/** Build with the exact Worka checkout whose SDK and host will load this branch. */
const worka = process.env.WORKA_SOURCE_ROOT;
if (!worka) throw Error('Set WORKA_SOURCE_ROOT to the Worka checkout used to build this desktop.');
const source = resolve(worka);
const root = resolve(import.meta.dir, '../..');
const [{ BunNoteBuilder }, { completePublicationSource }, { copyPublication, readNotePublication },
  { publicationHash }, { preparePublishedNote, readPublishedArtifact }, { nodeRuntimeTarget }] = await Promise.all([
  import(resolve(source, 'src/runtime/build.ts')),
  import(resolve(source, 'src/publication-source-files.ts')),
  import(resolve(source, 'src/note-publication.ts')),
  import(resolve(source, 'src/published-note-source.ts')),
  import(resolve(source, 'src/runtime/published-artifact.ts')),
  import(resolve(source, 'scripts/node-runtime-target.ts')),
]);
await materializeContentNotes(root);
const target = await nodeRuntimeTarget();
const stage = await mkdtemp(resolve(root, '.cardgame-package-notes-'));
try {
  // Resolve all bundled SDK code and compiler dependencies from the same host.
  await symlink(resolve(source,'node_modules'),resolve(stage,'node_modules'),'dir');
  const publications:Array<{id:string;original:string;publication:string}>=[];
  for (let index = 1; index <= 12; index++) {
    const id = `note-${index}`;
    const original = resolve(root, 'notes', id);
    const directory = resolve(stage, id);
    const definition = await completePublicationSource(original, await readNotePublication(original));
    definition.files = definition.files.filter((file: string) => !file.startsWith('worka-prebuilt/'));
    await copyPublication(original, directory, definition);
    const version = await publicationHash(directory);
    const authoredManifest = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'));
    const builder = new BunNoteBuilder({
      bunExecutable: process.execPath,
      installDependencies: false,
      authoredManifest,
      runtimeTarget: target,
      tailwindHelper: resolve(source, 'dist/tailwind-helper.mjs'),
      contractHelper: resolve(source, 'dist/build-note-contract.mjs'),
      fileSystem: {
        exists: async (path: string) => {
          try { await access(path); return true; }
          catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false; throw error; }
        },
        readFile: (path: string) => readFile(path, 'utf8'),
        writeFile: async (path: string, content: string) => { await writeFile(path, content); },
        mkdir: async (path: string) => { await mkdir(path, { recursive: true }); },
      },
      commandRunner: { run: async (command: {command: string; args: string[]; cwd: string; env?: Record<string, string | undefined>}) => {
        const child = Bun.spawn([command.command, ...command.args], {
          cwd: command.cwd, env: { ...process.env, ...command.env }, stdout: 'pipe', stderr: 'pipe',
        });
        const [exitCode, stdout, stderr] = await Promise.all([
          child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
        ]);
        return { exitCode, stdout, stderr };
      } },
    });
    await builder.build({ noteId: id, version, directory, outputDirectory: resolve(directory, 'output') });
    // This release includes complete contract documentation, even though the
    // generic builder also supports notes that omit optional metadata.
    const contract=JSON.parse(await readFile(resolve(directory,'output/contract/manifest.json'),'utf8'));
    if(contract.status!=='ready')throw Error(`Incomplete contract documentation for ${id}: ${(contract.diagnostics??[]).join('; ')}`);
    const publication=resolve(stage,'published-'+id);
    await preparePublishedNote(directory, publication);
    await readPublishedArtifact(publication, target);
    publications.push({id,original,publication});
    console.log(`Built and verified ${id}`);
  }
  // Build the whole desktop before replacing any runnable compiler output.
  for(const {id,original,publication} of publications){
    const publishedDefinition=await readNotePublication(publication);
    await copyPublication(publication,original,{...publishedDefinition,files:publishedDefinition.files.filter((file:string)=>!file.startsWith('worka-prebuilt/'))});
    // Replace the complete verified compiler directory instead of merging it
    // into an older build's content-addressed chunks.
    try { await rename(resolve(original,'worka-prebuilt'),resolve(stage,'old-'+id)); }
    catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
    await rename(resolve(publication,'worka-prebuilt'),resolve(original,'worka-prebuilt'));
    await writeFile(resolve(original,'worka-note.json'),await readFile(resolve(publication,'worka-note.json')));
    await readPublishedArtifact(original, target);
  }
  for (let index = 1; index <= 12; index++) await readPublishedArtifact(resolve(root, 'notes', `note-${index}`), target);
  console.log('Published and verified all 12 notes');
} finally {
  await rm(stage, { recursive: true, force: true });
}
