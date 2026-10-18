import {afterEach,expect,test} from 'bun:test';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {contentActions,contentQueries} from '../plugins/cardgame-content/src/contract';
import {createFormalPreviewService} from '../plugins/cardgame-content/src/formal-preview';
import {createPinnedReferenceService} from '../plugins/cardgame-content/src/pinned-references';
import {cardgameQueries,pinPreviewReference,prepareFormalPreview,removePinnedReference} from '../../notes/note-3/cardgame-operations';

const roots:string[]=[];
afterEach(async()=>{for(const root of roots.splice(0))await rm(root,{recursive:true,force:true});});
const projectId='preview-contract-fixture';
async function formalFixture(){
  const root=await mkdtemp(join(tmpdir(),'preview-contract-'));roots.push(root);
  const game=join(root,'game');
  await mkdir(join(game,'src'),{recursive:true});await mkdir(join(game,'public'),{recursive:true});
  await writeFile(join(game,'src/index.ts'),'export const sample="isolated";');
  await writeFile(join(game,'public/content.json'),'{}');
  await writeFile(join(game,'package.json'),JSON.stringify({name:'isolated-preview',version:'1.0.0'}));
  const registered:any[]=[];
  const service=createFormalPreviewService({dataRoot:join(root,'data'),projects:[{id:projectId,root:game}],register:async(record,repo)=>registered.push({record,repo})});
  return {service,game,registered};
}

test('the actual formal snapshot service satisfies the shared query and action contracts',async()=>{
  const f=await formalFixture();
  try{
    expect(contentQueries.formalPreview.output.parse(await f.service.query(projectId))).toEqual({record:null,freshness:'missing'});
    const result=await f.service.prepare(projectId);
    expect(contentActions.prepareFormalPreview.output.parse(result)).toEqual(result);
    expect(f.registered).toHaveLength(1);
    expect(await readFile(join(f.registered[0].repo,'src/index.ts'),'utf8')).toContain('isolated');
    expect(contentQueries.formalPreview.output.parse(await f.service.query(projectId))).toMatchObject({record:result,freshness:'current'});
    await writeFile(join(f.game,'public/content.json'),'{"changed":true}');
    expect(contentQueries.formalPreview.output.parse(await f.service.query(projectId)).freshness).toBe('stale');
    await rm(join(f.game,'src'),{recursive:true});
    const unavailable=contentQueries.formalPreview.output.parse(await f.service.query(projectId));
    expect(unavailable).toMatchObject({record:result,freshness:'unavailable'});expect(unavailable.error).toBeTruthy();
  }finally{await f.service.close();}
});

function pinnedFixture(){
  const candidate={id:'candidate-1',projectId,productionId:'production-1',candidateHash:'a'.repeat(64),commit:'b'.repeat(40),status:'candidate',cardId:'CARD_1'};
  const production={id:'production-1',projectId,revision:3,requirementRevision:2,status:'draft',brief:'Test candidate',rounds:[{round:1,requirementRevision:2,status:'completed'}],gameCandidates:[candidate],gameCandidateOrigins:{[candidate.id]:{requirementRevision:2,round:1}}};
  const records=new Map<string,any>();
  const core:any={readRecord:async(_table:string,key:string)=>records.get(key),updateRecord:async(_table:string,key:string,update:any)=>{const previous=records.get(key);const value=await update(previous?.value);const row={value,revision:String(Number(previous?.revision??0)+1)};records.set(key,row);return row;},subscribe:()=>()=>{}};
  const service=createPinnedReferenceService(core,async()=>({production}));
  return {service,candidate,production};
}

test('the actual pinned reference service produces the full candidate identity and bounded pinned page',async()=>{
  const {service,candidate,production}=pinnedFixture();
  const target=await service.describe(projectId,{kind:'candidate',id:candidate.id,context:{productionId:production.id,commit:candidate.commit}});
  expect(contentQueries.previewReferenceTarget.output.parse(target).key).toBe(target.key);
  expect(contentQueries.previewReferenceTarget.output.parse(target).binding).toMatchObject({current:true,candidateHash:candidate.candidateHash,requirementRevision:2,round:1});
  expect(contentActions.pinReference.output.parse(await service.pin(projectId,target)).items).toHaveLength(1);
  expect(contentQueries.pinnedReferences.output.parse(await service.query(projectId)).items[0]).toMatchObject({key:target.key,freshness:'current'});
  expect(contentActions.removePinnedReference.output.parse(await service.remove(projectId,target.key))).toEqual({removed:true});
});

test('preview actions send only canonical locator fields and retain the exact revision check',async()=>{
  const {service,candidate,production}=pinnedFixture();
  const target=await service.describe(projectId,{kind:'candidate',id:candidate.id,context:{productionId:production.id,commit:candidate.commit}});
  const calls:any[]=[];
  const ctx:any={note:{id:'preview-contract-test',stateRef:'preview-state'},store:{read:async()=>({value:{projectId},revision:'config-1'})},config:{read:async()=>({value:{projectId},revision:'config-1'})},resources:{read:async(request:any)=>({key:request.name,epoch:'fixture',version:1,stale:false,data:{...target,projectGeneration:'binding-one'}})},extensions:{request:async(extension:string,method:string,input:any)=>{
    calls.push({extension,method,input});
    if(method==='pinReference'){const parsed=contentActions.pinReference.method.input.parse(input);return service.pin(projectId,parsed);}
    if(method==='removePinnedReference'){const parsed=contentActions.removePinnedReference.method.input.parse(input);return service.remove(projectId,parsed.key);}
    throw Error('Unexpected command');
  }}};
  await pinPreviewReference(ctx,{key:candidate.id,commit:candidate.commit,revision:target.revision});
  expect(calls).toHaveLength(1);
  expect(Object.keys(calls[0].input).sort()).toEqual(['context','id','kind','projectGeneration','projectId','revision']);
  expect(calls[0].input.projectGeneration).toBe('binding-one');
  expect(calls[0].input.context).toEqual({productionId:production.id,commit:candidate.commit});
  await expect(pinPreviewReference(ctx,{key:candidate.id,commit:candidate.commit,revision:'stale'})).rejects.toThrow('候选身份已变化');
  expect(calls).toHaveLength(1);
  await removePinnedReference(ctx,{key:target.key});expect(calls).toHaveLength(2);
});

test('shared preview contracts reject malformed provider payloads before the view can label them current',async()=>{
  const ctx:any={note:{id:'preview-contract-test',stateRef:'preview-state'},store:{read:async()=>({value:{projectId},revision:'config-1'})},config:{read:async()=>({value:{projectId},revision:'config-1'})},resources:{read:async()=>({key:'view',epoch:'fixture',version:1,stale:false,data:{record:null,freshness:'fabricated'}})}};
  await expect(cardgameQueries.formalPreview(ctx,{})).rejects.toThrow('Invalid option');
  const output:any={note:ctx.note,store:ctx.store,config:ctx.config,extensions:{request:async()=>({key:'missing-identity'})}};
  await expect(prepareFormalPreview(output,{})).rejects.toThrow('returned invalid output after invocation');
});
