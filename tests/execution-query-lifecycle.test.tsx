import {expect,test} from 'bun:test';
import {hostUiFixture,button,deferred,flush,mount,typeInto,until} from './host-ui-fixture';
const {default:View}=await import('../notes/note-2/view');

function task(id:string,archived=false){return {
 id,goal:`Task ${id}`,sourceIdentity:id,source:{key:id,id,version:'1',revision:'1',value:{},noteId:'todo',itemId:id},
 scope:[],status:'paused',archived,continuationSeq:0,activeMs:0,approvalWaitMs:0,longWaitNotified:false,
 evidence:[],proposals:[],createdAt:1,updatedAt:1,owner:{sessionId:'session-'+id,noteId:'worker-'+id},
};}
async function fixture(options:{compact?:boolean;wait?:boolean}={}){
 let delegations:any={one:task('one'),two:task('two',true)};
 const gate=deferred<void>();if(!options.wait)gate.resolve();
 const subscriptions=new Set<string>();
 const f=await hostUiFixture({config:{projectId:'game',notes:{todo:'todo',execution:'execution'}},query:name=>{
  if(name==='workspace')return {delegations};
  if(name==='overview')return {summary:`${Object.values(delegations).filter((row:any)=>!row.archived).length} 项活动委托`,items:Object.values(delegations).filter((row:any)=>!row.archived).map((row:any)=>({id:row.id,title:row.goal,status:row.status})).slice(0,4)};
  if(name==='evidence')return [];
  throw Error('Unexpected execution query '+name);
 },execute:async(name,input)=>{
  await gate.promise;
  if(name==='archiveDelegation'||name==='restoreDelegation'){
   const row=delegations[input.delegationId];row.archived=name==='archiveDelegation';
   await f.publish('workspace');await f.publish('overview');
   return {id:row.id,archived:row.archived};
  }
  return null;
 }});
 const subscribe=f.runtime.resources.subscribe;
 f.runtime.resources.subscribe=async(request:any,listener:any)=>{
  subscriptions.add(request.name);const release=await subscribe(request,listener);
  return ()=>{subscriptions.delete(request.name);release();};
 };
 const render=(mode:'compact'|'expanded'='expanded')=>f.render(<View/>,mode);
 const view=await mount(render(options.compact?'compact':'expanded'));
 await until(()=>!!view.container.querySelector(options.compact?'.note-overview':'.desk'));
 return {...f,view,render,gate,subscriptions,
  async update(){delegations={...delegations,three:task('three')};await f.publish('overview');await f.publish('workspace');},
  async close(){gate.resolve();await view.unmount();await f.close();}};
}

test('execution query root reads only overview while compact and deletes the detail tree on collapse',async()=>{
 const f=await fixture({compact:true});try{
  expect(f.reads.some(read=>read.name==='workspace')).toBe(false);
  expect(!!f.view.container.querySelector('button,input,textarea,iframe')).toBe(false);
  await f.view.rerender(f.render());await until(()=>!!f.view.container.querySelector('.desk'));
  expect(f.view.container.textContent).toContain('Task one');
  const original=f.view.container.querySelector('.desk');
  const search=()=>f.view.container.querySelector('.desk-search input') as HTMLInputElement;
  await typeInto(search(),'Task');
  await f.view.rerender(f.render('compact'));await until(()=>!f.view.container.querySelector('.desk'));
  expect(f.subscriptions.has('workspace')).toBe(false);
  expect(!!f.view.container.querySelector('.note-overview button,.note-overview input,.note-overview iframe')).toBe(false);
  await flush(()=>f.update());await until(()=>f.view.container.textContent?.includes('Task three')===true);
  await f.view.rerender(f.render());await until(()=>!!f.view.container.querySelector('.desk'));
  expect(f.view.container.querySelector('.desk')===original).toBe(false);
  expect(search().value).toBe('Task');expect(f.view.container.textContent).toContain('Task three');expect(f.calls).toHaveLength(0);
 }finally{await f.close();}
});

test('execution archive is host-owned through detail removal and revalidates the actual workspace',async()=>{
 const f=await fixture({wait:true});try{
  await flush(()=>{button(f.view.container,'归档').click();button(f.view.container,'归档').click();});await until(()=>f.calls.length===1);
  expect(f.calls[0]!.input).toEqual({delegationId:'one'});
  await f.view.rerender(f.render('compact'));await until(()=>!f.view.container.querySelector('.desk'));
  await flush(()=>f.gate.resolve());
  await f.view.rerender(f.render());await until(()=>f.view.container.textContent?.includes('还没有委托')===true,'archived command workspace readback');
  const archived=Array.from(f.view.container.querySelectorAll('button')).find(item=>item.textContent?.startsWith('已归档'))!;
  await flush(()=>archived.click());await until(()=>!!f.view.container.querySelector('[data-task-id="one"]'),'archived task row');
  expect(f.calls).toHaveLength(1);
  const row=f.view.container.querySelector('[data-task-id="one"]') as HTMLElement;
  await flush(()=>button(row,'恢复').click());await until(()=>!f.view.container.querySelector('[data-task-id="one"]'));
  expect(f.calls.map(call=>call.name)).toEqual(['archiveDelegation','restoreDelegation']);
 }finally{await f.close();}
},20000);

test('execution workspace read errors use query retry without creating a mutation',async()=>{
 const f=await fixture();try{
  f.failRead('workspace',Error('workspace read unavailable'));await flush(()=>f.publish('workspace'));
  expect(f.view.container.textContent).toContain('workspace read unavailable');
  f.failRead('workspace');await flush(()=>button(f.view.container,'重试').click());
  await until(()=>!f.view.container.textContent?.includes('workspace read unavailable'));
  expect(!!f.view.container.querySelector('[data-task-id="one"]')).toBe(true);expect(f.calls).toHaveLength(0);
 }finally{await f.close();}
});
