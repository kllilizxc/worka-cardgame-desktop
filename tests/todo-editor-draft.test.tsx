import {expect,test} from 'bun:test';
import {hostUiFixture,button,deferred,flush,mount,typeInto,until} from './host-ui-fixture';
import {fixture as workflowFixture} from '../backend/tests/todo-editor-fixture';
import * as actions from '../notes/note-11/actions';
const {default:View}=await import('../notes/note-11/view');

async function fixture(options:{wait?:boolean;failReadback?:boolean}={}){
 const business=await workflowFixture(),gate=deferred<void>();
 let release=()=>gate.resolve();if(!options.wait)release();
 const query=async(name:string,input:any)=>{
  const method=(actions.queries as any)[name];
  if(!method)throw Error('Unexpected query '+name);
  return method(business.actionContext(),input);
 };
 const f=await hostUiFixture({config:{projectId:business.input.projectId},query,execute:async(name,input,context)=>{
  await gate.promise;
  const result=await (actions as any)[name]({...business.actionContext(),caller:context.caller,steps:context.steps},input);
  if(options.failReadback)f.failRead('editInput',Error('injected readback outage'));
  return result;
 }});
 const render=(mode:'compact'|'expanded'='expanded')=>f.render(<View/>,mode);
 const view=await mount(render());
 await until(()=>!!view.container.querySelector('[aria-label="编辑待办：Original requirement"]'));
 const title=()=>view.container.querySelector('[aria-label="待办标题"]') as HTMLTextAreaElement|null;
 const edit=async(value='Unfinished user requirement')=>{
  await flush(()=>button(view.container,'编辑待办：Original requirement').click());
  await until(()=>!!title());await typeInto(title()!,value);
  await until(()=>f.requests.some(value=>value.op==='set')&&!view.container.textContent?.includes('正在保留输入…'),'durable input');
 };
 const submit=()=>title()!.closest('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
 return {...f,business,view,render,title,edit,submit,release,async close(){release();await view.unmount();await f.close();}};
}

test('real Todo input survives collapse and complete expanded DOM replacement; explicit discard restores its source',async()=>{
 const f=await fixture();try{
  await f.edit();const old=f.title();
  await f.view.rerender(f.render('compact'));expect(f.title()).toBeNull();
  expect(f.view.container.querySelector('form,textarea,input,iframe,button')).toBeNull();
  await f.view.rerender(f.render());await until(()=>f.title()?.value==='Unfinished user requirement');
  expect(f.title()).not.toBe(old);expect(f.calls).toHaveLength(0);
  await flush(()=>button(f.view.container,'放弃输入').click());await flush(()=>button(f.view.container,'确认放弃').click());
  await until(()=>f.title()?.value==='Original requirement');expect(f.calls).toHaveLength(0);
 }finally{await f.close();}
});

test('repeated Todo submit uses one frozen business CAS; pending fields and post-success fields remain locked',async()=>{
 const f=await fixture({wait:true});try{
  await f.edit('Submitted requirement');await flush(()=>{f.submit();f.submit();});await until(()=>f.calls.length===1);
  expect(f.title()!.disabled).toBe(true);
  expect(f.title()!.value).toBe('Submitted requirement');expect(f.calls[0]!.input.baseFingerprint).toBe(f.business.input.baseFingerprint);
  expect(f.calls[0]!.input.projectGeneration).toBe(f.business.bindingA.projectGeneration);
  await flush(()=>f.release());await until(()=>f.view.container.textContent?.includes('操作已确认。')===true);
  expect((await f.business.detail()).item.title).toBe('Submitted requirement');expect(f.calls).toHaveLength(1);expect(f.title()!.disabled).toBe(true);
  await flush(()=>button(f.view.container,'继续编辑').click());await until(()=>f.title()?.disabled===false);
  expect(f.title()!.value).toBe('Submitted requirement');
 }finally{await f.close();}
});

test('Todo success with unavailable source retries the read without another write',async()=>{
 const f=await fixture({failReadback:true});try{
  await f.edit();await flush(()=>f.submit());await until(()=>f.view.container.textContent?.includes('injected readback outage')===true);
  expect(f.calls).toHaveLength(1);expect(f.title()!.disabled).toBe(true);
  f.failRead('editInput');await flush(()=>button(f.view.container,'核对 / 重新读取').click());
  await until(()=>!f.view.container.textContent?.includes('injected readback outage'));expect(f.calls).toHaveLength(1);
  await flush(()=>button(f.view.container,'继续编辑').click());await until(()=>f.title()?.disabled===false);
  expect(f.title()!.value).toBe('Unfinished user requirement');
 }finally{await f.close();}
});

test('dirty Todo baseline cannot follow the same project into a replacement directory',async()=>{
 const f=await fixture();try{
  await f.edit('Old directory only');const oldGeneration=f.business.bindingA.projectGeneration;
  let replacement:any;await flush(async()=>{replacement=await f.business.rebindB();});expect(replacement.projectGeneration).not.toBe(oldGeneration);
  await flush(()=>f.submit());await until(()=>f.view.container.textContent?.includes('旧编辑或回执')===true);
  expect(f.calls[0]!.input.projectGeneration).toBe(oldGeneration);expect((await f.business.detail()).item.title).toBe('Original requirement');
  await flush(()=>f.publish('projectBinding'));await until(()=>f.title()?.value==='Original requirement');
  expect(f.calls).toHaveLength(1);
 }finally{await f.close();}
});

test('an accepted image intake finishes in the host after the Todo editor closes',async()=>{
 const f=await fixture();try{
  await f.edit('Text preserved while image arrives');
  const {default:sharp}=await import('sharp');const bytes=await sharp({create:{width:2,height:2,channels:4,background:'#ff0000'}}).png().toBuffer();
  const image=new File([bytes],'pixel.png',{type:'image/png'});
  const input=f.view.container.querySelector('input[type=file]') as HTMLInputElement;
  Object.defineProperty(input,'files',{configurable:true,value:[image]});
  await flush(()=>input.dispatchEvent(new Event('change',{bubbles:true})));
  await until(()=>f.requests.some(value=>value.op==='attach'));
  await flush(()=>button(f.view.container,'关闭编辑').click());expect(f.title()).toBeNull();
  await flush(()=>button(f.view.container,'编辑待办：Original requirement').click());
  await until(()=>!!f.title()&&!!f.view.container.querySelector('img'));
  expect(f.title()!.value).toBe('Text preserved while image arrives');expect(f.calls).toHaveLength(0);
 }finally{await f.close();}
});

test('Todo compact only reads its bounded overview and exposes no business controls',async()=>{
 const business=await workflowFixture();
 const f=await hostUiFixture({config:{projectId:business.input.projectId},query:(name,input)=>(actions.queries as any)[name](business.actionContext(),input)});
 const view=await mount(f.render(<View/>,'compact'));try{
  await until(()=>view.container.textContent?.includes('Original requirement')===true);
  expect(view.container.querySelector('button,iframe,input,textarea,video,audio')).toBeNull();
  expect(f.reads.filter(read=>!['state','readiness','overview'].includes(read.name))).toEqual([]);
  expect(f.requests).toHaveLength(0);
 }finally{await view.unmount();await f.close();}
});

test('a known Todo requirement conflict keeps editable input and explicit discard adopts the new business version',async()=>{
 const f=await fixture();try{
  await f.edit('Keep my rejected draft');
  await f.business.manager.invoke('updateTodo',{projectId:f.business.input.projectId,id:'todo-one',baseRevision:1,patch:{title:'Remote requirement'}},{kind:'action',noteId:'a-todo'} as any);
  await flush(()=>f.submit());await until(()=>f.view.container.textContent?.includes('该需求已被修改')===true&&f.title()?.disabled===false);
  expect(f.title()!.value).toBe('Keep my rejected draft');expect(f.calls).toHaveLength(1);expect((await f.business.detail()).item.title).toBe('Remote requirement');
  await flush(()=>button(f.view.container,'放弃输入').click());await flush(()=>button(f.view.container,'确认放弃').click());await until(()=>f.title()?.value==='Remote requirement');
  expect(f.calls).toHaveLength(1);
 }finally{await f.close();}
});
