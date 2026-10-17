import {afterEach,expect,test} from 'bun:test';
import {mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {describeCapabilities} from '@dsh-workbench/runtime/internal';
import * as note from '../notes/note-4/worka-prebuilt/actions.mjs';
import {createWorkflowService,type WorkflowService} from '../backend/plugins/cardgame-content/src/workflow';
import {createProductionEvents} from '../backend/plugins/cardgame-content/src/production-events';
const cleanup:Array<()=>Promise<unknown>>=[];afterEach(async()=>{for(const fn of cleanup.splice(0).reverse())await fn();});
async function fixture(){
 const root=await mkdtemp(join(tmpdir(),'production-artifact-'));cleanup.push(()=>rm(root,{recursive:true,force:true}));
 const workflow=createWorkflowService({dataRoot:root,projects:[{id:'trusted',root}]});cleanup.push(()=>workflow.close());
 const events=createProductionEvents(workflow,{} as never),published:any[]=[],commands:any[]=[],scope={projectId:'trusted',projectGeneration:'binding'};
 const context:any={note:{id:'production-note',stateRef:'state'},store:{read:async()=>({value:{cardgameRole:'production'},revision:'config'})},extensions:{request:async(name:string,method:string,input:any)=>{expect(name).toBe('cardgame-content');commands.push({method,input});return method==='prepareProductionEvent'?events.prepare({...input,...scope}):workflow.command(method,{...input,...scope});}},events:{publish:async(name:string,payload:any,options:any)=>{const old=published.find(item=>item.options.key===options.key);const event={id:old?.id??'event-'+published.length,name,payload,options};published.push(event);return {id:event.id,duplicate:Boolean(old)};}},resources:{read:async({name,input}:any)=>name==='extension.official-feature-tracker.state'?{data:{features:[]}}:{data:await workflow.query({...input,...scope})}},notes:{read:async()=>({desktopId:'desktop'}),lookup:async()=>[{id:'tracker',actions:['setArchiveStatus','confirmGameCandidate']} ]}};
 return {workflow,context,published,commands};
}
test('shipped note artifact delegates default scope and canonical generation to the binding service',async()=>{
 const f=await fixture(),created=await note.upsertRequest(f.context,{brief:'Actual requirement',pinnedRefs:['reference']});
 expect(f.commands[0].input).not.toHaveProperty('projectId');expect(created.production.projectId).toBe('trusted');
 const id=created.production.id,first=await note.generate(f.context,{productionId:id}),retry=await note.retry(f.context,{productionId:id});
 expect(first.requestId).toBe(retry.requestId);expect(retry.duplicate).toBe(true);expect(f.published[0].payload).toMatchObject({projectId:'trusted',projectGeneration:'binding',productionId:id,requestId:first.requestId});expect(f.published[0].payload).not.toHaveProperty('submit');
 const detail=await note.queries.production(f.context,{productionId:id});expect(detail.production.id).toBe(id);
 const page=await note.queries.productions(f.context,{});expect(page.items[0].id).toBe(id);
});
test('shipped query contracts preserve an absent companion context without JSON string wrappers',async()=>{
 const f=await fixture(),created=await note.upsertRequest(f.context,{brief:'No companion'});
 expect(await note.queries.productionContext(f.context,{productionId:created.production.id})).toEqual({});
});
test('shipped legacy generic adoption errors before publishing any event',async()=>{
 const f=await fixture(),created=await note.upsertRequest(f.context,{brief:'candidate only'});
 await expect(note.adoptAsset(f.context,{productionId:created.production.id,candidateId:'candidate'})).rejects.toThrow('通用素材直接采用尚未开放');expect(f.published).toHaveLength(0);
});
test('shipped production query projects opaque cursors and keeps collection revision on every page',async()=>{
 const f=await fixture();for(let n=0;n<5;n++)await note.upsertRequest(f.context,{id:'page-'+n,brief:'page '+n});
 const first=await note.queries.productions(f.context,{limit:2});const second=await note.queries.productions(f.context,{limit:2,cursor:first.next});
 expect(first.next).toBe(first.nextCursor);expect(first.next).toBeString();expect(second.revision).toBe(first.revision);expect(second.items[0].id).not.toBe(first.items[0].id);
});
test('every shipped public action and query declares the metadata required by native loading',()=>{
 const contract=describeCapabilities(note);
 expect(contract.queries).toHaveLength(Object.keys(note.queries).length);
 for(const operation of [...contract.actions,...contract.queries])if(operation.visibility!=='private')expect(operation.description.trim(),operation.name).toBeTruthy();
});
