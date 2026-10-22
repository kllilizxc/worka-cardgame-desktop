import {access,mkdtemp,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';

const source=process.env.WORKA_SOURCE_ROOT;
if(!source)throw Error('Set WORKA_SOURCE_ROOT to the Worka checkout used to build this desktop.');
const worka=resolve(source),root=resolve(import.meta.dir,'../..');
const stage=await mkdtemp(resolve(tmpdir(),'cardgame-note-types-'));
try{
  const sdk=resolve(worka,'dist/sdk');
  await access(resolve(sdk,'react/types/index.d.ts'));
  await access(resolve(sdk,'runtime/types/index.d.ts'));
  const styles=resolve(stage,'styles.d.ts');
  // The runtime builder supplies CSS assets; these side-effect imports carry no TS values.
  await writeFile(styles,"declare module '*.css';\ndeclare module '@heroui/styles/css';\n");
  let failed=false;
  for(let index=1;index<=12;index++){
    const config=resolve(stage,`note-${index}.json`);
    await writeFile(config,JSON.stringify({compilerOptions:{
      target:'ESNext',module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',
      strict:true,skipLibCheck:true,allowImportingTsExtensions:true,noEmit:true,
      types:['bun','react','react-dom'],typeRoots:[resolve(worka,'node_modules/@types')],lib:['ESNext','DOM','DOM.Iterable'],
      paths:{
        '@dsh-workbench/runtime':[resolve(sdk,'runtime/types/index.d.ts')],
        '@dsh-workbench/runtime/internal':[resolve(sdk,'runtime/types/internal.d.ts')],
        '@dsh-workbench/react':[resolve(sdk,'react/types/index.d.ts')],
        '@dsh-workbench/react/internal':[resolve(sdk,'react/types/internal.d.ts')],
        '@realiz3r/worka/extension-contracts':[resolve(sdk,'runtime/types/extension-contracts.d.ts')],
      },
    },include:[styles,resolve(root,`notes/note-${index}/*.ts`),resolve(root,`notes/note-${index}/*.tsx`)]},null,2));
    const child=Bun.spawn([resolve(worka,'node_modules/.bin/tsc'),'-p',config],{stdout:'inherit',stderr:'inherit'});
    const code=await child.exited;failed ||= code!==0;
    console.log(`Strict note-${index}: ${code===0?'pass':'FAIL'}`);
  }
  if(failed)throw Error('Strict note type checking failed.');
}finally{await rm(stage,{recursive:true,force:true});}
