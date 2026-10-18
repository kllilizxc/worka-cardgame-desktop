import {afterEach,expect,test} from 'bun:test';
import {join} from 'node:path';
import {fixture,read} from './todo-editor-fixture';
import * as actions from '../../notes/note-11/actions';
import {bindQueryContext} from '@dsh-workbench/runtime/internal';
const worka=process.env.WORKA_BUILD_SOURCE_ROOT??process.env.WORKA_SOURCE_ROOT;
if(!worka)throw Error('Set WORKA_BUILD_SOURCE_ROOT to the framework providing the shared query protocol');
const {ResourceRegistry}=await import(join(worka,'src/resources/registry.ts'));
const {QueryDependencies}=await import(join(worka,'src/core/query-dependencies.ts'));
const {CoreStore}=await import(join(worka,'src/core/store.ts'));
const {memoryExecutionStoreFor}=await import(join(worka,'src/core/execution-store.ts'));
const {CommandRegistry}=await import(join(worka,'src/resources/commands.ts'));
const {NoteIntegration}=await import(join(worka,'src/notes.ts'));
const {NOTE_RUNTIME_SCOPE}=await import(join(worka,'src/application/capabilities.ts'));
const {asRecordStorage}=await import(join(worka,'tests/fixtures/record-storage.ts'));
const cleanup:Array<()=>Promise<void>>=[];
afterEach(async()=>{for(const close of cleanup.splice(0).reverse())await close();});
const bytes=(value:unknown)=>Buffer.byteLength(JSON.stringify(value));
const image={id:'large',dataUrl:'data:image/png;base64,'+'A'.repeat(550_000),name:'Reference image',width:32,height:24};
const caller={kind:'action',noteId:'a-todo'} as const;
async function project(){const f=await fixture();await f.manager.invoke('updateTodo',{projectId:f.input.projectId,id:'todo-one',baseRevision:1,patch:{images:[image],category:'开发'}},caller);return f;}
async function managed(f:Awaited<ReturnType<typeof fixture>>){
 const registry=new ResourceRegistry(new QueryDependencies());cleanup.push(()=>registry.close());
 registry.register('extension.cardgame-content.query',f.manager.resources!.query!);
 for(const name of ['todos','todo','categories','workflowStatus'] as const)registry.register(name,{version:'1',load:async(input:any,context:any)=>{
  const raw={note:{id:'a-todo',stateRef:'fixture'},store:{read:async()=>({value:{projectId:f.input.projectId},revision:'fixture'})},resources:{read:async(request:any)=>{try{return {key:'extension',epoch:'fixture',version:1,stale:false,data:await context.read(request)};}catch(error:any){return {key:'extension',epoch:'fixture',version:1,stale:true,error:error.message,errorCode:error.code};}}},db:{},notes:{}};
  return actions.queries[name](bindQueryContext(actions.note,raw as any),input);
 }});
 const scope={workspace:'todo-display',access:'test',noteId:'a-todo',displayPage:'todo-page',displayNoteId:'a-todo',displayContract:1 as const};
 return {registry,scope,query:(name:string,input:any)=>registry.read({name,input},scope)};
}
async function transport(f:Awaited<ReturnType<typeof fixture>>){
 const core=await CoreStore.open(asRecordStorage({async loadAll(){return {tables:{},global:null};},async putRecord(){},async deleteRecord(){},async close(){}}),{executionStore:memoryExecutionStoreFor({})});core.desktopRunnable=async()=>true;
 const commands=new CommandRegistry(core),notes=new NoteIntegration({[NOTE_RUNTIME_SCOPE]:true,core,commands,note:async()=>({value:{id:'a-todo'}})} as any,'/unused',process.execPath);
 commands.register('note.action',{run:(input:any,context:any)=>notes.executeCommand(context.noteId!,input.name,input.input,context)});
 let runs=0;notes.engine.invokeAction=async(_id:string,name:keyof typeof actions,input:any)=>{runs++;return (actions[name] as any)(f.actionContext(),input);};
 cleanup.push(async()=>{await commands.close();await core.close();});return {notes,get runs(){return runs;}};
}

test('real SQLite summaries and managed details keep legal original images available after delegation',async()=>{
 const f=await project();await f.manager.invoke('createTodo',{projectId:f.input.projectId,id:'todo-two',title:'Second image requirement',images:[image],category:'美术'},caller);
 await f.manager.invoke('delegateTodo',{projectId:f.input.projectId,itemId:'todo-one',requestId:'prepare-only'},caller);
 const m=await managed(f),first:any=await m.query('todos',{projectId:f.input.projectId,limit:1});
 expect(first.error).toBeUndefined();expect(first.data.total).toBe(2);expect(first.data.items).toHaveLength(1);expect(first.data.items[0].images).toBeUndefined();expect(first.data.items[0].imageCount).toBe(1);expect(bytes(first)).toBeLessThan(4096);
 const second:any=await m.query('todos',{projectId:f.input.projectId,limit:1,cursor:first.data.next});expect(second.data.items).toHaveLength(1);expect(second.data.items[0].id).not.toBe(first.data.items[0].id);expect(second.data.next).toBeUndefined();
 const detail:any=await m.query('todo',{projectId:f.input.projectId,id:'todo-one'});expect(detail.error).toBeUndefined();expect(detail.data.item.images[0].dataUrl).toBe(image.dataUrl);expect(detail.data.item.delivery).toBeUndefined();expect(detail.data.history).toBeUndefined();expect(detail.data.execution).toBeUndefined();
 const history:any=await m.query('todo',{projectId:f.input.projectId,id:'todo-one',view:'history'});expect(history.data.history).toHaveLength(3);expect(history.data.item).toBeUndefined();
 const status:any=await m.query('workflowStatus',{projectId:f.input.projectId});expect(status.data.categories).toBeUndefined();expect(status.data.counts.todos).toBe(2);
 const categories:any=await m.query('categories',{projectId:f.input.projectId});expect(categories.data.items).toEqual([{category:'开发',count:1},{category:'美术',count:1}]);expect(categories.data.total).toBe(2);
});

test('real action transport saves one 550KB image copy with a small replay-safe receipt',async()=>{
 const f=await project(),source=await f.detail(),t=await transport(f);
 const input={...f.input,images:source.item.images,baseFingerprint:source.requirementFingerprint};expect(bytes(input)).toBeLessThan(600_000);
 const result:any=await t.notes.invoke('a-todo','editTodo',input,{kind:'user',requestId:'large-save'});expect(result).toMatchObject({projectId:f.input.projectId,id:'todo-one',revision:3,projectGeneration:f.bindingA.projectGeneration});expect(result.detailTruncated).toBeUndefined();expect(result.item).toBeUndefined();expect(bytes(result)).toBeLessThan(512);
 expect(await t.notes.invoke('a-todo','editTodo',input,{kind:'user',requestId:'large-save'})).toEqual(result);expect(t.runs).toBe(1);
 const current=await f.detail();expect(current.item.title).toBe('Old-directory draft');expect(current.item.images[0].dataUrl).toBe(image.dataUrl);expect(current.requirementFingerprint).toBe(result.requirementFingerprint);
 const created:any=await t.notes.invoke('a-todo','addTodo',{projectId:f.input.projectId,title:'Created with image',images:[image]},{kind:'user',requestId:'large-create'});expect(created.id).toBeTruthy();expect(created.detailTruncated).toBeUndefined();expect(bytes(created)).toBeLessThan(512);
});

test('summary search uses full business text and never indexes image payloads',async()=>{
 const f=await project();await f.manager.invoke('updateTodo',{projectId:f.input.projectId,id:'todo-one',baseRevision:2,patch:{description:'x'.repeat(400)+' needle beyond preview'}},caller);
 const m=await managed(f),match:any=await m.query('todos',{projectId:f.input.projectId,q:'needle'});expect(match.data.total).toBe(1);expect(match.data.items[0].description).not.toContain('needle');expect(match.data.items[0].descriptionTruncated).toBe(true);
 const falseMatch:any=await m.query('todos',{projectId:f.input.projectId,q:'A'.repeat(64)});expect(falseMatch.data.total).toBe(0);
 const category:any=await m.query('todos',{projectId:f.input.projectId,category:'美术'});expect(category.data.total).toBe(0);
});

test('a real derived display cursor preserves collection-stale after a source change',async()=>{
 const f=await project();await f.manager.invoke('createTodo',{projectId:f.input.projectId,id:'todo-two',title:'Second'},caller);
 const m=await managed(f),first:any=await m.query('todos',{projectId:f.input.projectId,limit:1});
 await f.manager.invoke('updateTodo',{projectId:f.input.projectId,id:'todo-one',baseRevision:2,patch:{title:'Changed'}},caller);
 await expect(m.query('todos',{projectId:f.input.projectId,limit:1,cursor:first.data.next})).rejects.toMatchObject({code:'collection-stale'});
});

test('text reads retain complete business text without images and cannot share summary cursors',async()=>{
 const f=await project(),description='Full requirement '.repeat(100),title='Long title '.repeat(30);
 await f.manager.invoke('updateTodo',{projectId:f.input.projectId,id:'todo-one',baseRevision:2,patch:{title,description}},caller);
 await f.manager.invoke('createTodo',{projectId:f.input.projectId,id:'todo-two',title:'Other'},caller);
 const m=await managed(f),first:any=await m.query('todos',{projectId:f.input.projectId,view:'text',limit:1}),page=first.data;expect(first.error).toBeUndefined();
 const nextSnapshot:any=await m.query('todos',{projectId:f.input.projectId,view:'text',limit:1,cursor:page.next}),next=nextSnapshot.data;expect(nextSnapshot.error).toBeUndefined();
 const full=[...page.items,...next.items].find((item:any)=>item.id==='todo-one');expect(full.title).toBe(title.trim());expect(full.description).toBe(description.trim());expect(JSON.stringify(full)).not.toContain('data:image');
 await expect(read(f.manager,{op:'todos',projectId:f.input.projectId,limit:1,cursor:page.next})).rejects.toMatchObject({code:'collection-stale'});
 const literal:any=await read(f.manager,{op:'todos',projectId:f.input.projectId,q:'%'});expect(literal.total).toBe(0);
});

test('real complete-requirement CAS rejects image metadata changes but accepts a status-only revision',async()=>{
 const f=await project(),before=await f.detail();
 await f.manager.invoke('updateTodo',{projectId:f.input.projectId,id:'todo-one',baseRevision:2,patch:{images:[{...image,name:'New metadata',width:64}]}},caller);
 await expect(actions.editTodo(f.actionContext(),{...f.input,images:before.item.images,baseFingerprint:before.requirementFingerprint})).rejects.toThrow('该需求已被修改');
 const current=await f.detail();expect(current.item.images[0].name).toBe('New metadata');
 await f.manager.invoke('updateTodo',{projectId:f.input.projectId,id:'todo-one',baseRevision:3,patch:{status:'in_progress'}},caller);
 const result=await actions.editTodo(f.actionContext(),{...f.input,images:current.item.images,baseFingerprint:current.requirementFingerprint});
 expect(result.revision).toBe(5);const saved=await f.detail();expect(saved.item.status).toBe('in_progress');expect(saved.item.images[0].name).toBe('New metadata');
});

test('the real public query stale code reaches the native React pager and returns to its first page',async()=>{
 const domRoot=process.env.WORKA_SOURCE_ROOT;if(!domRoot)throw Error('Set WORKA_SOURCE_ROOT for the DOM fixture');
 await import(join(domRoot,'tests/web/dom-test-helpers.tsx'));
 const {act,createElement}=await import('react'),{createRoot}=await import('react-dom/client');
 const {RuntimeProvider}=await import('@dsh-workbench/react/internal'),{usePagedQuery}=await import('@dsh-workbench/react');
 const f=await project();await f.manager.invoke('createTodo',{projectId:f.input.projectId,id:'todo-two',title:'Second'},caller);
 const m=await managed(f),requests:any[]=[],codes:string[]=[];
 const client:any={subscribe:async(request:any,listener:any)=>{requests.push(request);m.registry.invalidate(request,m.scope);return m.registry.subscribe(request,m.scope,(snapshot:any)=>{if(snapshot.errorCode)codes.push(snapshot.errorCode);listener(snapshot);});},read:(request:any)=>m.registry.read(request,m.scope),revalidate:async(request:any)=>{m.registry.invalidate(request,m.scope);return m.registry.read(request,m.scope);}};
 let page:any;function Probe(){page=usePagedQuery('todos',{projectId:f.input.projectId,limit:1});return createElement('div',null,page.items.map((item:any)=>item.title).join(','));}
 const container=document.createElement('div');document.body.append(container);const root=createRoot(container);
 const settle=async(predicate:()=>boolean)=>{for(let i=0;i<100&&!predicate();i++)await act(async()=>{await new Promise(resolve=>setTimeout(resolve,1));});expect(predicate()).toBe(true);};
 try{
  await act(async()=>root.render(createElement(RuntimeProvider,{runtime:{note:{id:'a-todo'},resources:client} as any,children:createElement(Probe)})));
  await settle(()=>page.hasNext);
  await f.manager.invoke('updateTodo',{projectId:f.input.projectId,id:'todo-one',baseRevision:2,patch:{title:'Fresh source requirement'}},caller);
  await act(async()=>page.next());
  await settle(()=>codes.includes('collection-stale')&&page.pageIndex===0&&!page.loading&&page.items.some((item:any)=>item.title==='Fresh source requirement'));
  expect(requests.some(request=>request.input.cursor)).toBe(true);expect(requests.at(-1).input.cursor).toBeUndefined();expect(page.hasPrevious).toBe(false);expect(page.error).toBeUndefined();expect(page.items[0].id).toBe('todo-one');
 }finally{await act(async()=>root.unmount());container.remove();}
});
