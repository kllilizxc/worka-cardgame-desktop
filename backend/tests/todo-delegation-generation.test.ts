import {expect,test} from 'bun:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {Database} from 'bun:sqlite';
import {fixture,configure} from './todo-editor-fixture';
import * as actions from '../../notes/note-11/actions';
import {events} from '../../notes/note-11/contracts';
async function script(name:string){const source=await readFile(new URL(`../../relations/relation-7/draft/scripts/${name}.ts`,import.meta.url),'utf8');return new Function(new Bun.Transpiler({loader:'ts'}).transformSync(source)+';return run;')() as (event:any,api:any)=>Promise<any>;}
const todo={noteId:'a-todo',codeVersion:'todo-v1',capabilities:{queries:['todo'],actions:['bindExecution','feedback']}};
const desk={noteId:'desk',codeVersion:'desk-v1',capabilities:{queries:['task','progress'],actions:['acceptRequirement']}};
const objectId=(projectId:string,generation:string)=>`cardgame-todo:${JSON.stringify([projectId,generation,'todo-one'])}`;
const delegation=(projectId:string,projectGeneration:string,requestId:string)=>({projectId,projectGeneration,todoId:'todo-one',todoObjectId:objectId(projectId,projectGeneration),requestId,requestKey:`cardgame-todo-request:${projectGeneration}:${requestId}`,requirementRevision:1,payload:{goal:'A work',scope:[]}});
function requestRows(f:Awaited<ReturnType<typeof fixture>>,root:string){
 const path=join(f.dataRoot,'cardgame-desktops',f.input.projectId,createHash('sha256').update(root).digest('hex').slice(0,24),'cardgame-workflow.sqlite');
 const db=new Database(path,{readonly:true,create:false});try{return db.query('SELECT request_id,status,payload_json FROM workflow_requests ORDER BY rowid').all() as Array<{request_id:string;status:string;payload_json:string}>;}finally{db.close();}
}
function publisher(f:Awaited<ReturnType<typeof fixture>>){
 const published:any[]=[],seen=new Map<string,string>();
 const context=()=>({...f.actionContext(),events:{publish:async(name:string,payload:any,options:any)=>{
  // The current SDK delegates parsing to the action worker's event boundary.
  // Keep that real declared schema while isolating delivery from host/model work.
  payload=await (events.cardGameDelegationRequested as any)[Symbol.for('worka.note-capability')].output.parseAsync(payload);
  const key=JSON.stringify([name,options.key]),duplicate=seen.has(key),id=seen.get(key)??`event-${seen.size+1}`;
  seen.set(key,id);published.push({id,noteId:'a-todo',name,payload:structuredClone(payload),options:structuredClone(options)});return {id,duplicate};
 }}});
 return {published,context};
}
async function controlledDesk(f:Awaited<ReturnType<typeof fixture>>){
 const run=await script('delegate'),tasks=new Map<string,any>(),bindings:any[]=[],dispatched:any[]=[];
 return {tasks,bindings,dispatched,deliver:(event:any)=>run(event,{
  describe:async()=>[todo,desk],bindingList:async({ref}:any)=>bindings.filter(binding=>binding.source.noteId===ref.noteId&&binding.source.objectId===ref.objectId),
  query:async(value:any)=>value.noteId==='a-todo'?actions.queries.todo(f.actionContext(),value.input):tasks.get(value.input.delegationId),
  action:async(value:any)=>{
   if(value.noteId==='a-todo')return actions.bindExecution(f.actionContext(),value.input);
   dispatched.push(value);const delegationId=value.input.delegationId??`task-${tasks.size+1}`;
   tasks.set(delegationId,{source:{noteId:value.input.source.noteId,itemId:value.input.source.objectId,value:structuredClone(value.input.source.value)},status:'running'});
   return {delegationId,status:'running'};
  },bindingLink:async(value:any)=>bindings.push(value),
 })};
}

test('a delayed A delegation event cannot dispatch or bind the same-ID same-revision B Todo',async()=>{
 const f=await fixture(),run=await script('delegate');await f.rebindB();let dispatched=0;
 const result=await run({noteId:'a-todo',payload:delegation(f.input.projectId,f.bindingA.projectGeneration,'old-A')},{describe:async()=>[todo,desk],bindingList:async()=>[],query:async(value:any)=>actions.queries.todo(f.actionContext(),value.input),action:async(value:any)=>{if(value.noteId==='desk'){dispatched++;return {delegationId:'wrong-B-task'};}return actions.bindExecution(f.actionContext(),value.input);},bindingLink:async()=>{}}).catch(()=>({outcome:'agent'}));
 expect(result.outcome).toBe('agent');expect(dispatched).toBe(0);const current=await f.detail();expect(current.item.taskId).toBeUndefined();expect(current.item.revision).toBe(1);
});

test('an A task progress event cannot update the same-ID same-revision B Todo',async()=>{
 const f=await fixture(),run=await script('progress'),source={...(await f.detail()).item,projectGeneration:f.bindingA.projectGeneration};await f.rebindB();let writes=0;
 const result=await run({noteId:'desk',id:'old-A-progress',payload:{delegationId:'task-A'}},{describe:async()=>[todo,desk],query:async(value:any)=>value.noteId==='todo'?actions.queries.todo(f.actionContext(),value.input):value.noteId==='a-todo'?actions.queries.todo(f.actionContext(),value.input):value.name==='task'?{source:{noteId:'a-todo',itemId:objectId(source.projectId,source.projectGeneration),value:source}}:{status:'done',conclusion:'A finished'},action:async(value:any)=>{writes++;return actions.feedback(f.actionContext(),value.input);}}).catch(()=>({outcome:'agent'}));
 expect(result.outcome).toBe('agent');expect(writes).toBe(0);expect((await f.detail()).item).toMatchObject({status:'todo',revision:1});
});

test('real manager A/B default delegations publish distinct events and dispatch generation-scoped sources',async()=>{
 const f=await fixture(),p=publisher(f),d=await controlledDesk(f),input={projectId:f.input.projectId,itemId:'todo-one'};
 const first:any=await actions.delegateTodo(p.context(),input);
 expect(first.requestId).toContain(f.bindingA.projectGeneration);expect(first.duplicate).toBe(false);
 expect((await d.deliver(p.published[0])).outcome).toBe('completed');expect((await f.detail()).item.taskId).toBe('task-1');
 const retry:any=await actions.delegateTodo(p.context(),input);expect(retry).toMatchObject({requestId:first.requestId,eventId:first.eventId,duplicate:true});
 const bindingB=await f.rebindB(),second:any=await actions.delegateTodo(p.context(),input);
 expect(second.requestId).toContain(bindingB.projectGeneration);expect(second.requestId).not.toBe(first.requestId);expect(second.duplicate).toBe(false);expect(second.eventId).not.toBe(first.eventId);
 expect(p.published[2].options.key).not.toBe(p.published[0].options.key);expect((await d.deliver(p.published[2])).outcome).toBe('completed');
 expect(d.dispatched).toHaveLength(2);expect(d.dispatched[0].input.source.objectId).not.toBe(d.dispatched[1].input.source.objectId);expect(d.dispatched[0].input.updateId).not.toBe(d.dispatched[1].input.updateId);
 expect(d.dispatched[1].input.delivery).toBe('queue');expect((await f.detail()).item.taskId).toBe('task-2');
});

test('explicit business request IDs stay unchanged and retry within their generation without swallowing B events',async()=>{
 const f=await fixture(),p=publisher(f),d=await controlledDesk(f),input={projectId:f.input.projectId,itemId:'todo-one',requestId:'caller-stable'};
 const first:any=await actions.delegateTodo(p.context(),input),retry:any=await actions.delegateTodo(p.context(),input);
 expect(first.requestId).toBe(input.requestId);expect(retry).toMatchObject({requestId:input.requestId,eventId:first.eventId,duplicate:true});
 expect((await d.deliver(p.published[0])).outcome).toBe('completed');
 const storedA=requestRows(f,f.a);expect(storedA).toHaveLength(1);expect(storedA[0].request_id).toBe(p.published[0].payload.requestKey);expect(storedA[0].status).toBe('accepted');expect(JSON.parse(storedA[0].payload_json).requestId).toBe(input.requestId);
 await f.rebindB();const second:any=await actions.delegateTodo(p.context(),input);
 expect(second.requestId).toBe(input.requestId);expect(second.duplicate).toBe(false);expect(second.eventId).not.toBe(first.eventId);
 expect((await d.deliver(p.published[2])).outcome).toBe('completed');expect(d.dispatched).toHaveLength(2);
 expect(requestRows(f,f.b)[0].status).toBe('accepted');
 expect(d.dispatched[0].input.updateId).not.toBe(d.dispatched[1].input.updateId);expect(d.bindings[0].source.objectId).not.toBe(d.bindings[1].source.objectId);
 await expect(actions.delegateTodo(p.context(),{...input,goal:'Different work under the same request'})).rejects.toMatchObject({code:'request-id-reuse'});
 expect(p.published).toHaveLength(3);
});

test('returning A in a new generation namespaces an explicit request and refuses its old execution source',async()=>{
 const f=await fixture(),p=publisher(f),d=await controlledDesk(f),input={projectId:f.input.projectId,itemId:'todo-one',requestId:'caller-stable'};
 const first:any=await actions.delegateTodo(p.context(),input);expect((await d.deliver(p.published[0])).outcome).toBe('completed');
 await f.rebindB();await actions.delegateTodo(p.context(),input);expect((await d.deliver(p.published[1])).outcome).toBe('completed');
 await configure(f.manager,f.a);const again:any=await actions.delegateTodo(p.context(),input);
 expect(again.projectGeneration).not.toBe(first.projectGeneration);expect(again.requestId).toBe(input.requestId);expect(again.duplicate).toBe(false);expect(again.eventId).not.toBe(first.eventId);
 expect(p.published[2].payload.requestKey).not.toBe(p.published[0].payload.requestKey);
 const stored=requestRows(f,f.a);expect(stored).toHaveLength(2);expect(new Set(stored.map(row=>row.request_id)).size).toBe(2);expect(stored.every(row=>JSON.parse(row.payload_json).requestId===input.requestId)).toBe(true);
 expect((await d.deliver(p.published[2])).outcome).toBe('agent');expect(d.dispatched).toHaveLength(2);expect(d.tasks.size).toBe(2);expect((await f.detail()).item.taskId).toBe('task-1');
 const retry:any=await actions.delegateTodo(p.context(),input);expect(retry).toMatchObject({requestId:input.requestId,eventId:again.eventId,duplicate:true});
});

test('a maximum-length caller request keeps its exact value and a bounded host event key',async()=>{
 const f=await fixture(),p=publisher(f),requestId='\\'.repeat(300);
 const first:any=await actions.delegateTodo(p.context(),{projectId:f.input.projectId,itemId:'todo-one',requestId});
 expect(first.requestId).toBe(requestId);expect(p.published[0].options.key.length).toBeLessThanOrEqual(512);
 expect(p.published[0].payload.requestKey).toBe(p.published[0].options.key);
 const retry:any=await actions.delegateTodo(p.context(),{projectId:f.input.projectId,itemId:'todo-one',requestId});expect(retry).toMatchObject({requestId,eventId:first.eventId,duplicate:true});
});

test('the real note delegation event and receipt remain small with a 550KB original image',async()=>{
 const f=await fixture(),p=publisher(f),d=await controlledDesk(f),image={id:'large',dataUrl:'data:image/png;base64,'+'A'.repeat(550_000)};
 await f.manager.invoke('updateTodo',{projectId:f.input.projectId,id:'todo-one',baseRevision:1,patch:{images:[image]}},{kind:'action',noteId:'a-todo'} as any);
 const result:any=await actions.delegateTodo(p.context(),{projectId:f.input.projectId,itemId:'todo-one',goal:'Check the original image',scope:['Only this Todo']});
 expect(Buffer.byteLength(JSON.stringify(result))).toBeLessThan(1024);expect(Buffer.byteLength(JSON.stringify(p.published[0]))).toBeLessThan(2048);
 expect(p.published[0].payload.payload).toEqual({goal:'Check the original image',scope:['Only this Todo']});expect(JSON.stringify(p.published[0])).not.toContain('data:image');
 expect(result.item).toBeUndefined();expect(result.payload).toBeUndefined();expect((await f.detail()).item.images[0].dataUrl).toBe(image.dataUrl);
 expect((await d.deliver(p.published[0])).outcome).toBe('completed');expect(d.dispatched[0].input.source.value.images[0].dataUrl).toBe(image.dataUrl);
});

test('the real event API validates generation identity and rejects undeclared requirement snapshots',async()=>{
 const f=await fixture(),p=publisher(f),payload=delegation(f.input.projectId,f.bindingA.projectGeneration,'contract');
 await expect(events.cardGameDelegationRequested.publish(p.context(),{...payload,projectGeneration:''})).rejects.toThrow();
 await expect(events.cardGameDelegationRequested.publish(p.context(),{...payload,todoObjectId:''})).rejects.toThrow();
 expect(p.published).toHaveLength(0);
 await expect(events.cardGameDelegationRequested.publish(p.context(),{...payload,payload:{...payload.payload,requirement:{images:['must not travel']}}} as any,{key:payload.requestKey,exclusive:true})).rejects.toThrow();
 expect(p.published).toHaveLength(0);
});
