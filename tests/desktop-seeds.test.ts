import {expect,test} from 'bun:test';
import {join} from 'node:path';
import {describeCapabilities,noteDefinition} from '@dsh-workbench/runtime/internal';
import desktop from '../desktop.json';

// Exercise the exported bytes and the same model guard that activation runs.
// Source-only checks cannot detect a stale publication contract.
const worka=process.env.WORKA_SOURCE_ROOT;
if(worka){
  const {validateModelData}=await import(join(worka,'src/note-config.ts'));
  for(const entry of desktop.notes)test(`${entry.key} exported seed preserves its executable state and config`,async()=>{
    const module=await import(join(import.meta.dir,'..',entry.source.path,'worka-prebuilt/actions.mjs'));
    const contract=describeCapabilities(module),definition=noteDefinition(module.note)!;
    expect(definition).toBeDefined();
    const state='initialState' in entry?entry.initialState:contract.model?.state?.initial??{};
    const config='initialConfig' in entry?entry.initialConfig:contract.model?.config?.defaults??{};
    expect(()=>validateModelData(contract,state,config)).not.toThrow();
    if(definition.state)expect(await definition.state.schema.parseAsync(state)).toEqual(state);
    if(definition.config)expect(await definition.config.schema.partial().parseAsync(config)).toEqual(config);
    if(['note-1','note-7','note-8','note-9','note-10','note-12'].includes(entry.key)){
      expect(contract.update?.dataVersion).toBe('cardgame-library@1');
      expect(contract.update?.compatibleFrom).toEqual(['cardgame-library@1']);
      const legacyState={title:entry.name};
      expect(()=>validateModelData(contract,legacyState,config)).not.toThrow();
      expect(await definition.state!.schema.parseAsync(legacyState)).toEqual(legacyState);
      expect(()=>validateModelData(contract,{title:123},config)).toThrow('Note state does not match');
    }
  });
}
