import {expect,test} from 'bun:test';
import {readFileSync} from 'node:fs';
function relation(number:number,script:string){const source=readFileSync(new URL(`../relations/relation-${number}/draft/scripts/${script}.ts`,import.meta.url),'utf8');return new Function(new Bun.Transpiler({loader:'ts'}).transformSync(source)+'\nreturn run;')();}
const generate=relation(5,'generate'),result=relation(5,'result'),candidates=relation(3,'candidates');
const request={projectId:'p',projectGeneration:'epoch',productionId:'production',requestId:'round-request',round:1};
const submit={projectId:'p',productionId:'production',requestId:'round-request',round:1,goal:'frozen goal',scope:['approved'],requirement:{requirementRevision:1}};
const nodes=[{noteId:'production-note',codeVersion:'p1',capabilities:{actions:['bindExecution','receiveResult','recordCandidates'],queries:['production','productionDispatch']}},{noteId:'desk',codeVersion:'d1',capabilities:{actions:['acceptRequirement'],queries:['task','requirements']}}];
function harness(legacy=false){
 const actions:any[]=[],queries:any[]=[],links:any[]=[];let failBind=false;
 const task={id:'task',status:'running',source:{noteId:'production-note',itemId:'production',value:submit},requirementVersion:1,updates:[{id:request.requestId,version:1}]};
 const api={describe:async()=>nodes,query:async(query:any)=>{queries.push(query);if(query.name==='productionDispatch')return {production:{id:'production'},round:{round:1,dispatchRevision:2},submit,legacyReconciliation:legacy};if(query.name==='requirements')return [{id:'task',sourceRef:{noteId:'production-note',objectId:'production'},source:submit}];if(query.name==='task')return task;throw Error('unexpected query');},action:async(action:any)=>{actions.push(action);if(action.name==='bindExecution'&&failBind){failBind=false;throw Error('lost bind response');}return {delegationId:'task',status:'running'};},bindingLink:async(value:any)=>{links.push(value);}};
 return {api,actions,queries,task,links,failNextBind(){failBind=true;}};
}
test('lost bind retry uses same canonical intent, update ID and operation; event submit is ignored',async()=>{
 const f=harness(),event={noteId:'production-note',payload:{...request,submit:{goal:'injected',scope:['elsewhere']}}};f.failNextBind();
 await expect(generate(event,f.api)).rejects.toThrow('lost bind');await generate(event,f.api);
 const dispatches=f.actions.filter(action=>action.name==='acceptRequirement');expect(dispatches).toHaveLength(2);expect(dispatches[0]).toEqual(dispatches[1]);expect(dispatches[0].input).toMatchObject({updateId:'round-request',goal:'frozen goal',scope:['approved']});expect(dispatches[0].operationId).toBe('dispatch');
});
test('unversioned old event never dispatches; explicit in-place legacy recovery only queries and binds existing task',async()=>{
 const f=harness(true);const old={...request,projectGeneration:undefined};expect((await generate({noteId:'production-note',payload:old},f.api)).outcome).toBe('agent');expect(f.actions).toHaveLength(0);
 const recovered=await generate({noteId:'production-note',payload:request},f.api);expect(recovered.summary).toContain('没有重新执行');expect(f.actions.map(action=>action.name)).toEqual(['bindExecution']);expect(f.actions[0].input.receipt.result.delegationId).toBe('task');
});
test('legacy mismatched or unknown side effects remain paused, never get a new update ID',async()=>{
 const f=harness(true);f.task.source.value={...submit,goal:'another requirement'};
 expect((await generate({noteId:'production-note',payload:request},f.api)).outcome).toBe('agent');expect(f.actions).toHaveLength(0);
 f.api.query=async(query:any)=>query.name==='productionDispatch'?{production:{id:'production'},round:{round:1,dispatchRevision:2},submit,legacyReconciliation:true}:[];
 expect((await generate({noteId:'production-note',payload:request},f.api)).summary).toContain('结果未知');expect(f.actions).toHaveLength(0);
});
test('automatic result requires exact original generation, request, round, requirement and actual file claims',async()=>{
 const f=harness();Object.assign(f.task,{status:'completed',source:{noteId:'production-note',itemId:'production',value:{...submit,projectGeneration:'epoch'}},execution:{requirementVersion:1,result:{value:{productionResult:{productionId:'production',requestId:'round-request',round:1,requirementRevision:1,status:'completed',candidates:[{sourcePath:'/frozen/image.png'}]}}}}});
 await result({noteId:'desk',payload:{delegationId:'task'}},f.api);expect(f.actions.map(action=>action.name)).toEqual(['receiveResult']);expect(f.actions[0].input.projectGeneration).toBe('epoch');
 f.actions.length=0;(f.task as any).execution.result.value.productionResult.round=2;expect((await result({noteId:'desk',payload:{delegationId:'task'}},f.api)).outcome).toBe('agent');expect(f.actions).toHaveLength(0);
 delete (f.task.source.value as any).projectGeneration;expect((await result({noteId:'desk',payload:{delegationId:'task'}},f.api)).outcome).toBe('agent');expect(f.actions).toHaveLength(0);
});
test('old candidate round cannot mutate the asset library',async()=>{
 const actions:any[]=[];const api={describe:async()=>[nodes[0],{noteId:'library',capabilities:{actions:['registerCandidates']}}],query:async()=>({production:{projectId:'p',requirementRevision:2,rounds:[{round:2,requestId:'new',requirementRevision:2}]}}),action:async(value:any)=>actions.push(value)};
 const answer=await candidates({noteId:'production-note',payload:{...request,sourceRequestId:request.requestId,candidates:[{sourcePath:'/old/image.png'}]}},api);expect(answer.summary).toContain('旧轮次');expect(actions).toHaveLength(0);
});

test('successful binding followed by link failure repairs only the link, never changes queue into steer',async()=>{
 const f=harness();let bound=false,failLink=true;
 const originalQuery=f.api.query,originalAction=f.api.action;
 f.task.source.value={...submit,projectGeneration:'epoch'} as any;
 f.api.query=async query=>{const response:any=await originalQuery(query);if(query.name==='productionDispatch'&&bound)response.production.execution={delegationId:'task',requestId:request.requestId};return response;};
 f.api.action=async action=>{const response=await originalAction(action);if(action.name==='bindExecution')bound=true;return response;};
 f.api.bindingLink=async()=>{if(failLink){failLink=false;throw Error('lost link');}};
 const event={noteId:'production-note',payload:request};await expect(generate(event,f.api)).rejects.toThrow('lost link');const repaired=await generate(event,f.api);
 expect(repaired.summary).toContain('仅修复缺失关联');expect(f.actions.filter(action=>action.name==='acceptRequirement')).toHaveLength(1);expect(f.actions[0].input.delivery).toBe('queue');
});

test('candidate rejection while adoption waits prevents any library side effect',async()=>{
 const calls:any[]=[];const adopted=relation(3,'adopt');
 const api={describe:async()=>[{...nodes[0],capabilities:{queries:['production'],actions:['recordAdoption']}},{noteId:'library',capabilities:{actions:['adoptVersion']}}],query:async()=>({production:{projectId:'p',candidateRefs:[{id:'candidate',rejectedAt:'now'}]}}),action:async(value:any)=>calls.push(value)};
 const answer=await adopted({noteId:'production-note',payload:{...request,candidateId:'candidate'}},api);expect(answer.summary).toContain('否决');expect(calls).toHaveLength(0);
});

test('legacy generic adoption cannot mutate the library or fabricate completed receipt',async()=>{
 const calls:any[]=[];
 const answer=await relation(3,'adopt')({noteId:'production-note',payload:{...request,candidateId:'candidate'}},{describe:async()=>nodes,query:async()=>({production:{projectId:'p',candidateRefs:[{id:'candidate'}]}}),action:async(value:any)=>calls.push(value),bindingLink:async(value:any)=>calls.push(value)});
 expect(answer.outcome).toBe('agent');expect(answer.summary).toContain('未执行采用');expect(calls).toHaveLength(0);
});
