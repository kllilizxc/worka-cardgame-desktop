import {afterEach,expect,test} from 'bun:test';
import {mkdtemp,mkdir,writeFile,rm,symlink} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {createWorkflowService,type WorkflowService,type ProductionRecord} from '../plugins/cardgame-content/src/workflow';
import {createProductionEvents} from '../plugins/cardgame-content/src/production-events';
import type {ContentService} from '../plugins/cardgame-content/src/types';
const roots:string[]=[],services:WorkflowService[]=[];
afterEach(async()=>{for(const service of services.splice(0))await service.close();for(const root of roots.splice(0))await rm(root,{recursive:true,force:true});});
async function fixture(){
 const root=await mkdtemp(join(tmpdir(),'production-delivery-'));roots.push(root);
 const service=createWorkflowService({dataRoot:root,projects:[{id:'p',root}]});services.push(service);
 const {production}=await service.command('upsertProduction',{projectId:'p',id:'production',brief:'Make a portrait'}) as {production:ProductionRecord};
 const assets=new Map<string,Record<string,unknown>>();
 const content={query:async(input:Record<string,unknown>)=>{const value=assets.get(input.op==='versions'?'versions:'+String(input.assetId):String(input.id));if(!value)throw Error('asset not found');return value;},resolveMedia:async(input:Record<string,unknown>)=>{const value=assets.get(String(input.id));if(!value)throw Error('file not found');return value;}} as unknown as ContentService;
 const events=createProductionEvents(service,content),scope={projectId:'p',projectGeneration:'epoch',productionId:production.id};
 return {root,service,assets,events,scope,production};
}
async function reserve(f:Awaited<ReturnType<typeof fixture>>,newRound=false){return f.service.command('reserveProduction',{...f.scope,newRound}) as Promise<any>;}
const bind=(f:Awaited<ReturnType<typeof fixture>>,round:any,id:string)=>f.service.command('bindProduction',{...f.scope,requestId:round.requestId,receipt:{status:'accepted',result:{delegationId:id,status:'running'}}}) as Promise<any>;

test('late bind and repeated current bind cannot roll back a newer round or completed result',async()=>{
 const f=await fixture(),r1=await reserve(f);await bind(f,r1,'task-one');const r2=await reserve(f,true);const active=await bind(f,r2,'task-two');
 const late=await bind(f,r1,'task-one');expect(late.production.generation.requestId).toBe(r2.requestId);expect(late.production.execution.delegationId).toBe('task-two');expect(late.revision).toBe(active.revision);
 const duplicate=await bind(f,r2,'task-two');expect(duplicate.revision).toBe(active.revision);
 const completed:any=await f.service.command('productionResult',{...f.scope,requestId:r2.requestId,round:r2.round.round,revision:r2.round.requirementRevision,status:'completed'});
 const repeated=await bind(f,r2,'task-two');expect(repeated.production.status).toBe('completed');expect(repeated.revision).toBe(completed.production.revision);
});
test('dispatch is canonical and rejects old round triggers without creating another reservation',async()=>{
 const f=await fixture(),event=await f.events.prepare({...f.scope,kind:'generation'}),again=await f.events.prepare({...f.scope,kind:'generation',retry:true});
 expect(again.key).toBe(event.key);expect(event.payload).not.toHaveProperty('submit');
 const canonical:any=await f.service.query({...event.payload,op:'productionDispatch',submit:{goal:'tampered',scope:['/unrelated']}});expect(canonical.submit.goal).toBe('Make a portrait');expect(canonical.submit.scope).not.toContain('/unrelated');
 await reserve(f,true);await expect(f.service.query({...event.payload,op:'productionDispatch'})).rejects.toThrow('轮次或需求');
});
test('result files must exist inside their frozen round, including symlink resolution',async()=>{
 const f=await fixture(),r=await reserve(f),base={...f.scope,requestId:r.requestId,round:r.round.round,revision:r.round.requirementRevision,status:'completed'};
 await expect(f.events.receiveResult({...base,candidates:[{sourcePath:join(r.round.requirement.outputDirectory,'missing.png')}]})).rejects.toThrow();
 const outside=join(f.root,'outside.png');await writeFile(outside,'outside');await expect(f.events.receiveResult({...base,candidates:[{sourcePath:outside}]})).rejects.toThrow('冻结轮次');
 const link=join(r.round.requirement.outputDirectory,'link.png');await symlink(outside,link);await expect(f.events.receiveResult({...base,candidates:[{sourcePath:link}]})).rejects.toThrow('冻结轮次');
 const file=join(r.round.requirement.outputDirectory,'portrait.png');await writeFile(file,'real bytes');await expect(f.events.prepare({...f.scope,kind:'candidates',candidates:[{sourcePath:file,base64:Buffer.from('fake').toString('base64')}]})).rejects.toThrow('内联数据');const received:any=await f.events.receiveResult({...base,candidates:[{sourcePath:file}]});expect(received.production.rounds[0].result.candidateRefs[0].revision).toBe(createHash('sha256').update('real bytes').digest('hex'));
});
test('candidate registrations are round-specific, real, and idempotent; forged facts fail',async()=>{
 const f=await fixture();
 for(let n=1;n<=2;n++){
  const r=await reserve(f,n===2),file=join(r.round.requirement.outputDirectory,'image.png');await writeFile(file,'image-'+n);
  const event=await f.events.prepare({...f.scope,kind:'candidates',round:r.round.round,candidates:[{sourcePath:file}]});
  const source=(event.payload.candidates as Array<any>)[0],candidate={id:'candidate-'+n,revision:source.revision,status:'candidate'};
  await expect(f.events.recordCandidates({...event.payload,sourceCandidates:[source],candidates:[candidate]})).rejects.toThrow('asset not found');
  f.assets.set(candidate.id,candidate);
  const first:any=await f.events.recordCandidates({...event.payload,sourceCandidates:[source],candidates:[candidate]});
  const retry:any=await f.events.recordCandidates({...event.payload,sourceCandidates:[source],candidates:[candidate]});expect(retry.production.revision).toBe(first.production.revision);expect(retry.production.candidateRegistration.requestId).toBe(event.key);
 }
 const current:any=await f.service.query({...f.scope,op:'production'});expect(current.production.candidateRefs).toHaveLength(2);
 await expect(f.service.command('recordCandidates',{...f.scope,candidates:[{id:'fake'}]})).rejects.toThrow('真实回执');
 await expect(f.service.command('recordAdoption',{...f.scope,candidateId:'candidate-1',assetId:'fake',versionId:'fake'})).rejects.toThrow('真实回执');
});

test('legacy in-place upgrade reconciles only; rebind cannot reissue an old intent',async()=>{
 const f=await fixture();
 const legacy:any=await f.service.command('reserveProduction',{projectId:'p',productionId:f.production.id});
 await expect(f.events.prepare({...f.scope,kind:'generation',retry:true})).rejects.toThrow('旧项目绑定');
 const recovered=await f.events.prepare({...f.scope,allowLegacyReconciliation:true,kind:'generation',retry:true});
 expect(recovered.payload.requestId).toBe(legacy.requestId);expect(recovered.key).toContain(f.scope.projectGeneration);
 const dispatch:any=await f.service.query({...recovered.payload,allowLegacyReconciliation:true,op:'productionDispatch'});expect(dispatch.legacyReconciliation).toBe(true);
 await expect(f.events.prepare({...f.scope,projectGeneration:'rebound',kind:'generation',retry:true})).rejects.toThrow('旧项目绑定');
 await expect(f.events.receiveResult({...f.scope,projectGeneration:'rebound',requestId:legacy.requestId,round:legacy.round.round,revision:legacy.round.requirementRevision,status:'completed'})).rejects.toThrow('旧项目绑定');
 const fresh:any=await f.events.prepare({...f.scope,projectGeneration:'rebound',kind:'generation',newRound:true});expect(fresh.payload.requestId).not.toBe(legacy.requestId);
 const current:any=await f.service.query({...fresh.payload,op:'productionDispatch'});expect(current.legacyReconciliation).toBe(false);expect(current.round.projectGeneration).toBe('rebound');
});
test('late dispatch receipt is historical evidence and never overwrites terminal result',async()=>{
 const f=await fixture(),r=await reserve(f);
 await f.service.command('productionResult',{...f.scope,requestId:r.requestId,round:r.round.round,revision:r.round.requirementRevision,status:'completed',result:{conclusion:'verified result'}});
 const late:any=await bind(f,r,'delayed-task');expect(late.production.status).toBe('completed');expect(late.production.rounds[0].result.conclusion).toBe('verified result');expect(late.production.rounds[0].dispatchReceipt.result.delegationId).toBe('delayed-task');
 const again:any=await bind(f,r,'delayed-task');expect(again.revision).toBe(late.revision);
 const detail:any=await f.service.query({...f.scope,op:'production'});expect(detail.history.some((entry:any)=>entry.event==='late-binding-receipt')).toBe(true);
});

test('candidate preparation and recording cannot relabel an old round after rebinding',async()=>{
 const f=await fixture(),r=await reserve(f),file=join(r.round.requirement.outputDirectory,'old.png');await writeFile(file,'old');
 const event=await f.events.prepare({...f.scope,kind:'candidates',candidates:[{sourcePath:file}]});
 await expect(f.events.prepare({...f.scope,projectGeneration:'new-epoch',kind:'candidates',candidates:[{sourcePath:file}]})).rejects.toThrow('旧项目绑定');
 await expect(f.events.recordCandidates({...event.payload,projectGeneration:'new-epoch',sourceCandidates:event.payload.candidates,candidates:[{id:'old'}]})).rejects.toThrow('旧项目绑定');
});
test('caller receipts and candidate metadata cannot replace verified asset identities',async()=>{
 const f=await fixture(),r=await reserve(f),file=join(r.round.requirement.outputDirectory,'real.png');await writeFile(file,'real');
 const event=await f.events.prepare({...f.scope,kind:'candidates',candidates:[{sourcePath:file}]}),source=(event.payload.candidates as Array<any>)[0];
 f.assets.set('candidate',{id:'candidate',status:'candidate',revision:source.revision,mimeType:'image/png'});
 const registered:any=await f.events.recordCandidates({...event.payload,sourceCandidates:[source],candidates:[{id:'candidate',assetId:'forged',versionId:'forged'}],receipt:{status:'failed',result:{id:'forged'}}});
 expect(registered.production.candidateRefs[0]).not.toHaveProperty('assetId');
 f.assets.set('formal',{id:'formal',currentVersionId:'real-version',revision:source.revision});f.assets.set('versions:formal',{items:[{id:'real-version',candidateId:'candidate'}]});
 const input={...f.scope,candidateId:'candidate',assetId:'formal',versionId:'real-version',requestId:'adoption',receipt:{status:'completed',result:{assetId:'forged',versionId:'forged'}}};
 const adopted:any=await f.events.recordAdoption(input);expect(adopted.production.adoption).toMatchObject({assetId:'formal',version:'real-version'});expect(JSON.stringify(adopted.production.adoption)).not.toContain('forged');
 const duplicate:any=await f.events.recordAdoption(input);expect(duplicate.production.revision).toBe(adopted.production.revision);
});

test('binding a Todo after reservation does not mutate the frozen dispatch or retry fingerprint',async()=>{
 const f=await fixture(),event=await f.events.prepare({...f.scope,kind:'generation'});
 const first:any=await f.service.query({...event.payload,op:'productionDispatch'});
 await f.service.command('createTodo',{projectId:'p',id:'todo',title:'Linked later'});
 await f.service.command('bindTodo',{...f.scope,todoId:'todo'});
 const next:any=await f.service.query({...event.payload,op:'productionDispatch'});expect(next.submit).toEqual(first.submit);
 const retry=await f.events.prepare({...f.scope,kind:'generation',retry:true});expect(retry.key).toBe(event.key);
 const list:any=await f.service.query({...f.scope,op:'productions'});expect(list.items[0].todoId).toBe('todo');
});

test('production pages share a cursor-independent revision and invalidate after mutations across filters',async()=>{
 const f=await fixture();
 for(let n=0;n<6;n++)await f.service.command('upsertProduction',{projectId:'p',id:'entry-'+n,brief:'page '+n});
 const first:any=await f.service.query({...f.scope,op:'productions',limit:2,q:'page'});
 const second:any=await f.service.query({...f.scope,op:'productions',limit:2,q:'page',cursor:first.nextCursor});
 expect(first.items).toHaveLength(2);expect(second.items).toHaveLength(2);expect(second.revision).toBe(first.revision);expect(first.total).toBe(6);expect(first.nextCursor).toBeString();
 expect(second.items.every((item:any)=>!first.items.some((before:any)=>before.id===item.id))).toBe(true);
 const other:any=await f.service.query({...f.scope,op:'production',productionId:'entry-0'});
 await f.service.command('updateProduction',{...f.scope,productionId:'entry-0',baseRevision:other.production.revision,patch:{brief:'outside filter'}});
 const changed:any=await f.service.query({...f.scope,op:'productions',limit:2,q:'page'});expect(changed.revision).not.toBe(first.revision);expect(changed.total).toBe(5);
});
test('generic adoption preparation explicitly fails without publishing a replacement workflow',async()=>{
 const f=await fixture();await expect(f.events.prepare({...f.scope,kind:'adoption',candidateId:'candidate'})).rejects.toThrow('通用素材直接采用尚未开放');
});
