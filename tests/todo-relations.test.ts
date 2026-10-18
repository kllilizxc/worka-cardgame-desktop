import {expect,test} from 'bun:test';
import {readFile} from 'node:fs/promises';
async function script(relative:string){const source=await readFile(new URL('../relations/'+relative,import.meta.url),'utf8');const javascript=new Bun.Transpiler({loader:'ts'}).transformSync(source);return new Function(javascript+';return run;')() as (event:any,api:any)=>Promise<any>;}
const todo={noteId:'todo',codeVersion:'todo-v1',capabilities:{queries:['todo'],actions:['bindExecution','feedback']}};
const desk={noteId:'desk',codeVersion:'desk-v1',capabilities:{queries:['task','progress'],actions:['acceptRequirement']}};
const requirement={projectId:'game',projectGeneration:'generation-A',id:'todo-one',title:'Original',description:'Full requirement',images:[{id:'image',dataUrl:'data:image/png;base64,AA=='}],status:'in_progress',requirementRevision:1,revision:2,delegationId:'original-task'};
const todoObjectId=`cardgame-todo:${JSON.stringify(['game','generation-A','todo-one'])}`;
const request=(requestId='request',requirementRevision=1)=>({projectId:'game',projectGeneration:'generation-A',todoId:'todo-one',todoObjectId,requestId,requestKey:`cardgame-todo-request:generation-A:${requestId}`,requirementRevision,payload:{goal:'Do the work',scope:[]}});

test('the actual Todo relation resumes the existing delegation using small requirement metadata',async()=>{
 const run=await script('relation-7/draft/scripts/delegate.ts'),queries:any[]=[],calls:any[]=[],links:any[]=[];
 const result=await run({noteId:'todo',payload:request()},{describe:async()=>[todo,desk],bindingList:async()=>[],query:async(value:any)=>{queries.push(value);return value.noteId==='todo'?{item:requirement}:{source:{noteId:'todo',itemId:todoObjectId,value:requirement},status:'running'};},action:async(value:any)=>{calls.push(value);return value.noteId==='desk'?{delegationId:'original-task'}:{todoRevision:3};},bindingLink:async(value:any)=>links.push(value)});
 expect(result.outcome).toBe('completed');expect(queries.find(value=>value.noteId==='desk').input.delegationId).toBe('original-task');
 expect(calls[0].input.delivery).toBe('steer');expect(calls[0].input.source.value).toBe(requirement);expect(calls[0].input.source.objectId).toBe(todoObjectId);expect(calls[0].input.updateId).toBe(request().requestKey);expect(calls[1].input.todoId).toBe('todo-one');expect(calls[1].input.requestId).toBe('request');expect(links).toHaveLength(1);
});

test('the actual Todo progress relation needs only requirement identity, revision and status',async()=>{
 const run=await script('relation-7/draft/scripts/progress.ts'),calls:any[]=[];
 const result=await run({noteId:'desk',id:'event-progress',payload:{delegationId:'original-task'}},{describe:async()=>[todo,desk],query:async(value:any)=>value.noteId==='todo'?{item:requirement}:value.name==='task'?{source:{noteId:'todo',itemId:todoObjectId,value:requirement}}:{status:'done',conclusion:'Verified done'},action:async(value:any)=>{calls.push(value);return {id:'todo-one',revision:3};}});
 expect(result.outcome).toBe('completed');expect(calls).toHaveLength(1);expect(calls[0].input).toMatchObject({itemId:'todo-one',status:'done',conclusion:'Verified done',requirementRevision:1});
});

test('the actual production relation retains the existing production reference and full request brief',async()=>{
 const run=await script('relation-6/draft/scripts/create.ts'),calls:any[]=[],links:any[]=[];
 const production={noteId:'production',codeVersion:'production-v1',capabilities:{queries:[],actions:['upsertRequest','bindTodo']}};
 const brief='Full unabridged business requirement '.repeat(30);
 const result=await run({noteId:'todo',payload:{projectId:'game',projectGeneration:'generation-A',todoId:'todo-one',brief}},{describe:async()=>[todo,production],query:async()=>({item:{...requirement,productionId:'existing-production'}}),action:async(value:any)=>{calls.push(value);return value.name==='upsertRequest'?{production:{id:'existing-production'}}:{todoRevision:3};},bindingLink:async(value:any)=>links.push(value)});
 expect(result.outcome).toBe('completed');expect(calls[0].input).toMatchObject({productionId:'existing-production',todoId:'todo-one',brief});expect(calls[1].input.productionId).toBe('existing-production');expect(links).toHaveLength(1);
});

test('the actual delegation relation refuses a changed requirement before dispatch',async()=>{
 const run=await script('relation-7/draft/scripts/delegate.ts');let calls=0;
 const result=await run({noteId:'todo',payload:request('old-request',0)},{describe:async()=>[todo,desk],query:async()=>({item:requirement}),action:async()=>{calls++;}});
 expect(result.outcome).toBe('agent');expect(calls).toBe(0);
});

test('the actual relation refuses a task from another generation even when the binding target matches',async()=>{
 const run=await script('relation-7/draft/scripts/delegate.ts');let calls=0;
 const result=await run({noteId:'todo',payload:request()},{describe:async()=>[todo,desk],bindingList:async()=>[{kind:'delegation',target:{noteId:'desk',objectId:'original-task'}}],query:async(value:any)=>value.noteId==='todo'?{item:requirement}:{source:{noteId:'todo',itemId:todoObjectId,value:{...requirement,projectGeneration:'generation-B'}},status:'running'},action:async()=>{calls++;}});
 expect(result.outcome).toBe('agent');expect(calls).toBe(0);
});

test('the actual progress relation refuses an unscoped task source before reading or writing a Todo',async()=>{
 const run=await script('relation-7/draft/scripts/progress.ts');let reads=0,writes=0;
 const result=await run({noteId:'desk',payload:{delegationId:'original-task'}},{describe:async()=>[todo,desk],query:async(value:any)=>{if(value.noteId==='todo')reads++;return {source:{noteId:'todo',itemId:'todo-one',value:requirement}};},action:async()=>{writes++;}});
 expect(result.outcome).toBe('agent');expect(reads).toBe(0);expect(writes).toBe(0);
});
