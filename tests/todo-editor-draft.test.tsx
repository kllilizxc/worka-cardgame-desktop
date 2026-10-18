import {act,createElement,type ReactNode} from 'react';
import {expect,test} from 'bun:test';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const worka=process.env.WORKA_SOURCE_ROOT;
if(!worka)throw Error('Set WORKA_SOURCE_ROOT to the checked-out SDK used for the build');
const {button,deferred}=await import(join(worka,'tests/web/dom-test-helpers.tsx')) as {
  button(container:ParentNode,label:string):HTMLButtonElement;
  deferred<T>():{promise:Promise<T>;resolve(value:T):void;reject(reason:unknown):void};
};
const {RuntimeProvider,NoteViewContext}=await import('@dsh-workbench/react/internal');
const {default:View}=await import('../notes/note-11/view');
import {editTodo} from '../notes/note-11/actions';

// The packed SDK and this renderer must use the same installed React. The
// shared source helper initializes the DOM, but owns a different source install.
async function flush(action?:()=>unknown){await act(async()=>{await action?.();});}
async function mount(element:ReactNode){
  const {createRoot}=await import('react-dom/client');
  const container=document.createElement('div');document.body.append(container);
  const root=createRoot(container);await flush(()=>root.render(element));
  return {container,rerender:(next:ReactNode)=>flush(()=>root.render(next)),async unmount(){await flush(()=>root.unmount());container.remove();}};
}

const initial=()=>({id:'todo-one',projectId:'game',title:'Original requirement',description:'Original details',images:[{id:'image-one',dataUrl:'data:image/png;base64,AA==',type:'image/png',name:'reference'}],status:'todo',priority:'medium',revision:1,requirementRevision:1,createdAt:'2026-10-17',updatedAt:'2026-10-17'});
const fingerprint=(item:any)=>createHash('sha256').update(JSON.stringify([item.title,item.description??'',(item.images??[]).map((image:any)=>[image.id,image.dataUrl,image.type??null,image.name??null,image.width??null,image.height??null])])).digest('hex');
type FixtureOptions={todosPending?:boolean;detailPending?:boolean;categories?:Array<{category:string;count:number}>;categoryError?:boolean;invoke?:(name:string,input:any,options:any,fixture:any)=>Promise<any>;revalidate?:(request:any,fixture:any)=>Promise<any>};
async function fixture(options:FixtureOptions={}){
  const previousParent=Object.getOwnPropertyDescriptor(window,'parent'),previousContext=Object.getOwnPropertyDescriptor(globalThis,'__DSH_WORKBENCH_CONTEXT__');
  const messages:any[]=[];
  Object.defineProperty(window,'parent',{configurable:true,value:{postMessage:(message:any)=>messages.push(message)}});
  Object.defineProperty(globalThis,'__DSH_WORKBENCH_CONTEXT__',{configurable:true,value:{token:'todo-fixture',parentOrigin:window.location.origin,mode:'expanded'}});
  let item:any=initial(),projectId='game',projectGeneration='generation-A',version=0,deleted=false;
  const calls:any[]=[],commands:any[]=[],reads:any[]=[],checkpoints=new Map<string,any>();
  const listeners=new Set<{request:any;listener:(snapshot:any)=>void}>();
  const data=(request:any)=>request.name==='state'?{value:{projectId,notes:{execution:'execution-note'}},revision:'config-1'}:request.name==='todos'?{items:deleted?[]:[{...item,projectGeneration,images:undefined,imageCount:item.images?.length??0,imageNames:(item.images??[]).flatMap((image:any)=>image.name?[image.name]:[])}],revision:projectGeneration+':'+item.revision+':'+deleted,total:deleted?0:1}:request.name==='todo'?{item:{...item,projectGeneration},requirementFingerprint:fingerprint(item),projectGeneration}:request.name==='workflowStatus'?{counts:{todos:1,todo:1,inProgress:0,done:0,blocked:0}}:request.name==='categories'?{items:(options.categories??[]).slice(request.input.cursor?100:0,request.input.cursor?200:100),...(!request.input.cursor&&(options.categories?.length??0)>100?{next:'category-next'}:{}),revision:'categories-1',total:options.categories?.length??0}:{};
  const snapshot=(request:any)=>({key:request.name,epoch:'fixture',version:++version,...(deleted&&request.name==='todo'?{error:'Todo not found',stale:true}:request.name==='categories'&&options.categoryError?{error:'分类读取失败',stale:true}:{data:structuredClone(data(request)),stale:false})});
  const f={get item(){return item;},set item(value){item=value;},calls,commands,reads,checkpoints,snapshot,
    publish(name:string){for(const subscription of listeners)if(subscription.request.name===name)subscription.listener(snapshot(subscription.request));},
    removeSource(){deleted=true;f.publish('todos');f.publish('todo');},
    rebind(){projectId='other-project';f.publish('state');},
    rebindSameProject(){projectGeneration='generation-B';item=initial();f.publish('state');f.publish('todo');f.publish('todos');},
  };
  const context:any={note:{id:'todo-editor',stateRef:'fixture'},store:{read:async()=>({value:{projectId},revision:'config-1'})},resources:{read:async(request:any)=>{if(request.input.projectGeneration!==undefined&&request.input.projectGeneration!==projectGeneration)throw Error('CardGame 项目绑定已变化');return snapshot({name:'todo',input:request.input});}},extensions:{request:async(_provider:string,method:string,input:any)=>{
    if(input.projectGeneration!==undefined&&input.projectGeneration!==projectGeneration)throw Error('CardGame 项目绑定已变化');commands.push({method,input,projectGeneration});if(input.projectId!==item.projectId)throw Error('wrong project');if(input.baseRevision!==item.revision)throw Error('revision conflict');
    item={...item,...input.patch,revision:item.revision+1,requirementRevision:item.requirementRevision+1};return {item:structuredClone(item),revision:item.revision,requirementFingerprint:fingerprint(item)};
  }}};
  const runtime:any={note:{id:'todo-editor'},store:{read:async()=>({value:{projectId},revision:'state-1'}),subscribe:async()=>()=>{}},
    resources:{subscribe:async(request:any,listener:any)=>{reads.push(request);const subscription={request,listener};listeners.add(subscription);if(!(options.todosPending&&request.name==='todos'||options.detailPending&&request.name==='todo'))listener(snapshot(request));return()=>listeners.delete(subscription);},read:async(request:any)=>snapshot(request),revalidate:async(request:any)=>{reads.push(request);return options.revalidate?options.revalidate(request,f):snapshot(request);}},
    invokeAction:async(name:string,input:any,actionOptions:any)=>{calls.push({name,input,options:actionOptions});if(options.invoke){const result=await options.invoke(name,input,actionOptions,f);return result.item?{projectId:result.item.projectId,projectGeneration:input.projectGeneration,id:result.item.id,revision:result.item.revision,requirementRevision:result.item.requirementRevision,requirementFingerprint:fingerprint(result.item)}:result;}if(name==='editTodo')return editTodo(context,input);throw Error(`Unexpected action ${name}`);},
  };
  const bridge:any={request:async(method:string,params:any)=>{if(method==='ui.draftRecover')return checkpoints.get(params.key)??null;if(method==='ui.draftCheckpoint'){checkpoints.set(params.key,params.checkpoint);return {accepted:true};}if(method==='ui.draftClear'){checkpoints.delete(params.key);return {accepted:true};}throw Error(method);}};
  const render=(mode:'compact'|'expanded'='expanded')=>createElement(RuntimeProvider,{runtime,bridge,children:createElement(NoteViewContext.Provider,{value:{metadata:{id:'todo-editor',name:'Todo'},mode,layout:{width:900,maxHeight:900},snapshot:{value:{projectId:'game'},revision:'state-1'}},children:createElement(View)})});
  const mounted=await mount(render());
  await flush(()=>window.dispatchEvent(new MessageEvent('message',{source:window.parent,origin:window.location.origin,data:{bridge:'dsh-workbench-parent',version:messages.at(-1)?.version,kind:'notification',token:'todo-fixture',method:'ui.surfaceActive',params:{active:true}}})));
  const view={...mounted,async unmount(){await mounted.unmount();if(previousParent)Object.defineProperty(window,'parent',previousParent);else delete (window as any).parent;if(previousContext)Object.defineProperty(globalThis,'__DSH_WORKBENCH_CONTEXT__',previousContext);else delete (globalThis as any).__DSH_WORKBENCH_CONTEXT__;}};
  return {...f,get item(){return f.item;},set item(value){f.item=value;},view,render,runtime,guard:()=>messages.filter(message=>message.method==='ui.unsavedChanges').at(-1)?.params};
}
const title=(f:any)=>f.view.container.querySelector('[aria-label="待办标题"]') as HTMLTextAreaElement;
const form=(f:any)=>title(f).closest('form')!;
const input=(element:HTMLTextAreaElement,value:string)=>{Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')!.set!.call(element,value);element.dispatchEvent(new Event('input',{bubbles:true}));};
const submit=(f:any)=>form(f).dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
async function edit(f:any,value='Unfinished user requirement'){
  await flush(()=>f.view.container.querySelector('[aria-label="编辑待办：Original requirement"]')!.dispatchEvent(new MouseEvent('dblclick',{bubbles:true})));
  await flush(()=>input(title(f),value));
  expect(title(f).value).toBe(value);
}

test('Todo requirement registers an unsaved recoverable draft and explicit cancel clears it',async()=>{
  const f=await fixture();try{
    expect(f.reads.filter(request=>request.name==='todo')).toHaveLength(0);
    await edit(f);
    expect(f.guard()).toEqual({dirty:true,saving:false});
    expect([...f.checkpoints.values()].some(value=>value.value.title==='Unfinished user requirement')).toBe(true);
    await flush(()=>button(f.view.container,'取消').click());expect(f.checkpoints.size).toBe(0);expect(title(f)).toBeNull();expect(f.guard()).toEqual({dirty:false,saving:false});
  }finally{await f.view.unmount();}
});

test('same-batch repeated Todo submits dispatch one original CAS intent',async()=>{
  const receipt=deferred<any>();const f=await fixture({invoke:async()=>receipt.promise});try{
    await edit(f);await flush(()=>{submit(f);submit(f);});
    expect(f.guard()).toEqual({dirty:true,saving:true});
    expect(f.calls).toHaveLength(1);expect(f.calls[0].input.baseFingerprint).toBe(fingerprint(initial()));expect(f.calls[0].input.base).toBeUndefined();
    await flush(()=>receipt.resolve({item:{...initial(),title:'Unfinished user requirement',revision:2},revision:2}));
  }finally{await f.view.unmount();}
});

test('Todo edits made after save starts survive the older receipt',async()=>{
  const receipt=deferred<any>();const f=await fixture({invoke:async()=>receipt.promise});try{
    await edit(f,'Submitted user requirement');await flush(()=>submit(f));
    await flush(()=>input(title(f),'Newer unsaved requirement'));
    f.item={...f.item,title:'Submitted user requirement',revision:2};
    await flush(()=>receipt.resolve({item:f.item,revision:2}));
    expect(title(f)?.value).toBe('Newer unsaved requirement');
    expect(f.guard()).toEqual({dirty:true,saving:false});
    expect([...f.checkpoints.values()].some(value=>value.value.title==='Newer unsaved requirement')).toBe(true);
    expect(f.calls).toHaveLength(1);
  }finally{await f.view.unmount();}
});

test('remote requirement updates preserve the original title, details and image CAS on retries',async()=>{
  const f=await fixture();try{
    await edit(f);
    f.item={...f.item,title:'Another author requirement',description:'Another author details',images:[],revision:2};
    await flush(()=>f.publish('todo'));
    expect(title(f).value).toBe('Unfinished user requirement');
    await flush(()=>submit(f));expect(f.view.container.textContent).toContain('该需求已被修改');
    expect(f.commands).toHaveLength(0);expect(title(f).value).toBe('Unfinished user requirement');
    await flush(()=>submit(f));expect(f.calls).toHaveLength(2);
    expect(f.calls[0].options.requestId).toBe(f.calls[1].options.requestId);
    expect(f.calls[1].input.baseFingerprint).toBe(fingerprint(initial()));
    expect(f.checkpoints.size).toBe(1);
  }finally{await f.view.unmount();}
});

test('requirement save allows an unrelated status revision and retains image removal',async()=>{
  const f=await fixture();try{
    await edit(f);await flush(()=>button(f.view.container,'移除图片 1').click());
    f.item={...f.item,status:'in_progress',revision:2};await flush(()=>f.publish('todo'));
    await flush(()=>submit(f));
    expect(f.commands).toHaveLength(1);expect(f.commands[0].input).toMatchObject({projectId:'game',id:'todo-one',baseRevision:2,patch:{title:'Unfinished user requirement',description:'Original details',images:[]}});
    expect(f.calls[0].input.baseFingerprint).toBe(fingerprint(initial()));
    expect(f.checkpoints.size).toBe(0);expect(f.guard()).toEqual({dirty:false,saving:false});
  }finally{await f.view.unmount();}
});

test('accepted Todo save with failed causal refresh retries only the read',async()=>{
  let unavailable=true;
  const f=await fixture({revalidate:async(request,state)=>{if(request.name==='todo'&&unavailable)throw Error('synthetic read unavailable');return state.snapshot(request);}});
  try{
    await edit(f);await flush(()=>submit(f));
    expect(f.commands).toHaveLength(1);expect(f.calls).toHaveLength(1);
    expect(f.view.container.textContent).toContain('synthetic read unavailable');expect(f.checkpoints.size).toBe(1);
    await flush(()=>submit(f));expect(f.calls).toHaveLength(1);expect(f.commands).toHaveLength(1);
    unavailable=false;await flush(()=>submit(f));
    expect(f.calls).toHaveLength(1);expect(f.commands).toHaveLength(1);expect(f.checkpoints.size).toBe(0);
    expect(button(f.view.container,'保存修改').disabled).toBe(true);
  }finally{await f.view.unmount();}
});

test('restored Todo requirement opens without replay and keeps a business-only value',async()=>{
  const f=await fixture();try{
    await edit(f);await f.view.rerender(f.render('compact'));await f.view.rerender(f.render());
    expect(title(f)?.value).toBe('Unfinished user requirement');expect(f.calls).toHaveLength(0);
    const [key,checkpoint]=[...f.checkpoints][0]!;
    expect(key).toBe('todo-requirement:todo-editor:game:generation-A:todo-one');
    expect(Object.keys(checkpoint.value).sort()).toEqual(['description','images','title']);
    await flush(()=>submit(f));expect(f.calls).toHaveLength(1);expect(f.calls[0].input.projectId).toBe('game');
    expect(f.calls[0].input.baseFingerprint).toBe(fingerprint(initial()));
  }finally{await f.view.unmount();}
});

test('configuration rebind cannot redirect an open Todo requirement to a different project',async()=>{
  const f=await fixture();try{
    await edit(f);await flush(()=>f.rebind());await flush(()=>submit(f));
    expect(f.calls).toHaveLength(1);expect(f.calls[0].input.projectId).toBe('game');
    expect(f.commands).toHaveLength(1);expect(f.commands[0].input.projectId).toBe('game');
    expect(f.reads.filter(request=>request.name==='todo').every(request=>request.input.projectId==='game')).toBe(true);
  }finally{await f.view.unmount();}
});

test('a same-ID Todo from a different project never receives the first project draft',async()=>{
  const f=await fixture();try{
    await edit(f);await flush(()=>{f.rebind();f.item={...initial(),projectId:'other-project',title:'Other project requirement'};f.publish('todos');});
    expect(title(f)).toBeNull();expect(f.checkpoints.has('todo-requirement:todo-editor:game:generation-A:todo-one')).toBe(true);
    await flush(()=>f.view.container.querySelector('[aria-label="编辑待办：Other project requirement"]')!.dispatchEvent(new MouseEvent('dblclick',{bubbles:true})));
    expect(title(f).value).toBe('Other project requirement');expect(f.calls).toHaveLength(0);
  }finally{await f.view.unmount();}
});

function clipboardFixture(){
  const previousReader=Object.getOwnPropertyDescriptor(globalThis,'FileReader'),previousImage=Object.getOwnPropertyDescriptor(globalThis,'Image');
  let complete!:()=>void;
  class ClipboardReader{result='data:image/gif;base64,AA==';onload?:()=>void;readAsDataURL(){complete=()=>this.onload?.();}}
  class ClipboardImage{naturalWidth=1;naturalHeight=1;onload?:()=>void;set src(_value:string){queueMicrotask(()=>this.onload?.());}}
  Object.defineProperty(globalThis,'FileReader',{configurable:true,value:ClipboardReader});
  Object.defineProperty(globalThis,'Image',{configurable:true,value:ClipboardImage});
  return {paste(element:HTMLTextAreaElement){const event=new Event('paste',{bubbles:true,cancelable:true});Object.defineProperty(event,'clipboardData',{value:{items:[{type:'image/gif',getAsFile:()=>({type:'image/gif',size:1,name:'pasted.gif'})}]}});element.dispatchEvent(event);},complete:()=>complete(),restore(){if(previousReader)Object.defineProperty(globalThis,'FileReader',previousReader);else delete (globalThis as any).FileReader;if(previousImage)Object.defineProperty(globalThis,'Image',previousImage);else delete (globalThis as any).Image;}};
}

test('delayed clipboard conversion merges images without overwriting newer text',async()=>{
  const clipboard=clipboardFixture(),f=await fixture();try{
    await edit(f);await flush(()=>clipboard.paste(title(f)));
    await flush(()=>input(title(f),'Typed during image conversion'));await flush(()=>clipboard.complete());
    expect(title(f).value).toBe('Typed during image conversion');
    expect(f.view.container.querySelectorAll('.cardgame-image-thumb')).toHaveLength(2);
    await flush(()=>submit(f));expect(f.calls[0].input.title).toBe('Typed during image conversion');expect(f.calls[0].input.images).toHaveLength(2);
    expect(f.calls[0].input.baseFingerprint).toBe(fingerprint(initial()));
  }finally{await f.view.unmount();clipboard.restore();}
});

test('cancelled clipboard conversion cannot resurrect a draft in a reopened editor',async()=>{
  const clipboard=clipboardFixture(),f=await fixture();try{
    await edit(f);await flush(()=>clipboard.paste(title(f)));await flush(()=>button(f.view.container,'取消').click());
    await edit(f,'New editing session');await flush(()=>clipboard.complete());
    expect(title(f).value).toBe('New editing session');expect(f.view.container.querySelectorAll('.cardgame-image-thumb')).toHaveLength(1);
    expect(f.calls).toHaveLength(0);
  }finally{await f.view.unmount();clipboard.restore();}
});

test('a receipt after editor removal never replays or drops a recovered requirement',async()=>{
  const receipt=deferred<any>();const f=await fixture({invoke:async()=>receipt.promise});try{
    await edit(f,'Accepted while hidden');await flush(()=>submit(f));await f.view.rerender(f.render('compact'));
    expect(f.calls[0].options.signal.aborted).toBe(false);
    f.item={...f.item,title:'Accepted while hidden',revision:2};await flush(()=>receipt.resolve({item:f.item,revision:2}));
    await f.view.rerender(f.render());
    expect(f.calls).toHaveLength(1);expect(f.checkpoints.size).toBe(0);
    expect(f.view.container.textContent).toContain('Accepted while hidden');
  }finally{await f.view.unmount();}
});

test('existing large-image requirements remain saveable when SDK recovery warns about its size limit',async()=>{
  const f=await fixture();try{
    f.item={...f.item,images:[{id:'large-image',dataUrl:'data:image/gif;base64,'+'A'.repeat(550_000)}]};await flush(()=>f.publish('todos'));
    await edit(f);expect(f.guard()).toEqual({dirty:true,saving:false});
    expect(f.view.container.textContent).toContain('自动恢复暂不可用');
    await flush(()=>submit(f));expect(f.commands).toHaveLength(1);expect(f.calls[0].input.images[0].dataUrl.length).toBeGreaterThan(550_000);
    expect(f.guard()).toEqual({dirty:false,saving:false});
  }finally{await f.view.unmount();}
});


test('same-project directory replacement never restores the old generation requirement',async()=>{
  const f=await fixture();try{
    await edit(f,'Old directory draft');
    await f.view.rerender(f.render('compact'));
    await flush(()=>f.rebindSameProject());
    await f.view.rerender(f.render());
    expect(title(f)).toBeNull();
    expect(f.checkpoints.has('todo-requirement:todo-editor:game:generation-A:todo-one')).toBe(true);
    await edit(f,'New directory draft');await flush(()=>submit(f));
    expect(f.calls).toHaveLength(1);expect(f.commands).toHaveLength(1);
    expect(f.calls[0].input.projectGeneration).toBe('generation-B');
    expect(f.commands[0].input.projectGeneration).toBe('generation-B');
    expect(f.item.title).toBe('New directory draft');
  }finally{await f.view.unmount();}
});

test('an already open requirement cannot write through a same-ID directory rebind',async()=>{
  const f=await fixture();try{
    await edit(f,'Old directory draft');
    await flush(()=>f.rebindSameProject());
    expect(title(f)).toBeNull();
    expect(f.item.title).toBe('Original requirement');expect(f.commands).toHaveLength(0);
    expect(f.checkpoints.has('todo-requirement:todo-editor:game:generation-A:todo-one')).toBe(true);
  }finally{await f.view.unmount();}
});

test('editTodo keeps the expected directory generation on both the read and update command',async()=>{
  const f=await fixture();try{
    await edit(f);await flush(()=>submit(f));
    expect(f.calls[0].input.projectGeneration).toBe('generation-A');
    expect(f.commands[0].input.projectGeneration).toBe('generation-A');
    await flush(()=>f.rebindSameProject());
    await expect(editTodo({note:{id:'stale',stateRef:'state'},store:{read:async()=>({value:{projectId:'game'},revision:'config'})},resources:{read:async(request:any)=>{expect(request.input.projectGeneration).toBe('generation-A');throw Error('CardGame 项目绑定已变化');}},extensions:{request:async()=>{throw Error('Must not mutate');}}} as any,{projectId:'game',projectGeneration:'generation-A',itemId:'todo-one',title:'Stale edit',images:[],baseFingerprint:fingerprint(initial())})).rejects.toThrow('项目绑定已变化');
    expect(f.commands).toHaveLength(1);
  }finally{await f.view.unmount();}
});

test('a focused Todo owns its detail generation before the first list page arrives',async()=>{
  const oldHref=window.location.href,priorScroll=Object.getOwnPropertyDescriptor(HTMLElement.prototype,'scrollIntoView');
  Object.defineProperty(HTMLElement.prototype,'scrollIntoView',{configurable:true,value:()=>{}});
  const focus='cg:'+encodeURIComponent(JSON.stringify({projectId:'game',kind:'todo',id:'todo-one',intent:'open'}));
  window.history.replaceState(null,'','?focus='+encodeURIComponent(focus));
  const f=await fixture({todosPending:true});
  try{
    await edit(f,'Typed while first list page loads');
    const field=title(f);
    expect(f.checkpoints.has('todo-requirement:todo-editor:game:generation-A:todo-one')).toBe(true);
    expect(f.checkpoints.has('todo-requirement:todo-editor:game:legacy:todo-one')).toBe(false);
    await flush(()=>f.publish('todos'));
    expect(title(f)).toBe(field);expect(title(f).value).toBe('Typed while first list page loads');
    await flush(()=>submit(f));
    expect(f.calls[0].input.projectGeneration).toBe('generation-A');
    expect(f.item.title).toBe('Typed while first list page loads');
  }finally{
    await f.view.unmount();window.history.replaceState(null,'',oldHref);
    if(priorScroll)Object.defineProperty(HTMLElement.prototype,'scrollIntoView',priorScroll);else delete (HTMLElement.prototype as any).scrollIntoView;
  }
});


test('concurrent image metadata changes reject the older complete requirement',async()=>{
 const f=await fixture();try{
  await edit(f);f.item={...f.item,images:f.item.images.map((image:any)=>({...image,name:'Changed elsewhere',width:40,height:20})),revision:2};
  await flush(()=>f.publish('todo'));await flush(()=>submit(f));
  expect(f.commands).toHaveLength(0);expect(f.view.container.textContent).toContain('该需求已被修改');expect(title(f).value).toBe('Unfinished user requirement');
 }finally{await f.view.unmount();}
});


test('list cards show lightweight image metadata and read complete images only on demand',async()=>{
 const f=await fixture({detailPending:true});try{
  expect(f.view.container.querySelectorAll('.cardgame-image-thumb')).toHaveLength(0);expect(f.view.container.textContent).toContain('reference');
  expect(f.reads.filter((request:any)=>request.name==='todo')).toHaveLength(0);
  await flush(()=>button(f.view.container,'查看 1 张图片 / 编辑需求').click());
  expect(title(f)).toBeNull();expect(f.view.container.querySelectorAll('.cardgame-image-thumb')).toHaveLength(0);
  await flush(()=>f.publish('todo'));
  expect(title(f).value).toBe('Original requirement');expect(f.view.container.querySelectorAll('.cardgame-image-thumb')).toHaveLength(1);expect(f.calls).toHaveLength(0);
 }finally{await f.view.unmount();}
});

test('category pages keep their selected filter visible and the all-categories escape available',async()=>{
  const categories=Array.from({length:101},(_,index)=>({category:index===0?'ALL':index===1?'__proto__':index===2?'constructor':`分类 ${String(index+1).padStart(3,'0')}`,count:index+1}));
  const f=await fixture({categories});try{
    const nav=()=>f.view.container.querySelector('[aria-label="待办分类"]')!;
    const category=(label:string)=>Array.from(nav().querySelectorAll('button')).find(element=>element.textContent?.startsWith(label)) as HTMLButtonElement;
    expect(nav().textContent).toContain('共 101 个分类');expect(nav().textContent).not.toContain('分类 101');
    await flush(()=>category('ALL').click());expect(category('ALL').getAttribute('aria-pressed')).toBe('true');
    expect(f.reads.filter(request=>request.name==='todos').at(-1)?.input.category).toBe('ALL');
    await flush(()=>button(nav(),'下一页分类').click());expect(nav().textContent).toContain('分类 101');
    expect(category('ALL').getAttribute('aria-pressed')).toBe('true');expect(category('__proto__')).toBeUndefined();
    expect(f.reads.filter(request=>request.name==='categories').at(-1)?.input.cursor).toBe('category-next');
    await flush(()=>button(nav(),'全部').click());expect(button(nav(),'全部').getAttribute('aria-pressed')).toBe('true');expect(category('ALL')).toBeUndefined();
    expect(f.reads.filter(request=>request.name==='todos').at(-1)?.input.category).toBeUndefined();
    await flush(()=>button(nav(),'上一页分类').click());expect(category('__proto__')).toBeDefined();expect(category('constructor')).toBeDefined();
    await flush(()=>category('__proto__').click());expect(f.reads.filter(request=>request.name==='todos').at(-1)?.input.category).toBe('__proto__');
  }finally{await f.view.unmount();}
});

test('a category read failure stays local and leaves Todo requirements and all-categories navigation usable',async()=>{
  const f=await fixture({categoryError:true});try{
    const nav=f.view.container.querySelector('[aria-label="待办分类"]')!;
    expect(nav.textContent).toContain('分类读取失败');expect(button(nav,'全部').disabled).toBe(false);
    expect(f.view.container.querySelector('[aria-label="编辑待办：Original requirement"]')).not.toBeNull();
    await edit(f);expect(title(f).value).toBe('Unfinished user requirement');
  }finally{await f.view.unmount();}
});

test('large-image edits survive real category row removal with a shared copy-or-discard exit',async()=>{
 const f=await fixture({categories:[{category:'A',count:1},{category:'B',count:1}]});try{
  f.item={...f.item,category:'A',images:[{id:'large-image',dataUrl:'data:image/gif;base64,'+'A'.repeat(550_000)}]};await flush(()=>f.publish('todos'));
  await edit(f,'Large draft survives filtering');expect(f.guard()).toEqual({dirty:true,saving:false});expect(f.checkpoints.size).toBe(0);
  const nav=f.view.container.querySelector('[aria-label="待办分类"]')!,category=(label:string)=>Array.from(nav.querySelectorAll('button')).find(control=>control.textContent?.startsWith(label)) as HTMLButtonElement;
  await flush(()=>category('B').click());expect(title(f)).toBeNull();expect(f.guard()).toEqual({dirty:true,saving:false});expect(f.view.container.textContent).toContain('未显示的编辑');
  await flush(()=>{const details=f.view.container.querySelector('aside[aria-label="未显示的编辑"] details') as HTMLDetailsElement;details.open=true;details.dispatchEvent(new Event('toggle'));});const retained=f.view.container.querySelector('[aria-label="保留的编辑内容"]') as HTMLTextAreaElement;
  expect(retained.value).toContain('Large draft survives filtering');expect(retained.value).toContain('A'.repeat(550_000));
  await flush(()=>category('A').click());expect(title(f).value).toBe('Large draft survives filtering');expect(f.view.container.querySelectorAll('.cardgame-image-thumb')).toHaveLength(1);
  await flush(()=>submit(f));expect(f.commands).toHaveLength(1);expect(f.commands[0].input.patch.images[0].dataUrl).toBe(f.item.images[0].dataUrl);expect(f.guard()).toEqual({dirty:false,saving:false});
 }finally{await f.view.unmount();}
});

test('a source deleted while hidden retains readable large edits and an explicit discard escape',async()=>{
 const f=await fixture({categories:[{category:'A',count:1},{category:'B',count:1}]});try{
  f.item={...f.item,category:'A',images:[{id:'large-image',dataUrl:'data:image/gif;base64,'+'A'.repeat(550_000)}]};await flush(()=>f.publish('todos'));await edit(f,'Keep or copy removed source');
  const nav=f.view.container.querySelector('[aria-label="待办分类"]')!,other=Array.from(nav.querySelectorAll('button')).find(control=>control.textContent?.startsWith('B'))!;
  await flush(()=>other.click());await flush(()=>f.removeSource());expect(title(f)).toBeNull();
  await flush(()=>{const details=f.view.container.querySelector('aside[aria-label="未显示的编辑"] details') as HTMLDetailsElement;details.open=true;details.dispatchEvent(new Event('toggle'));});expect((f.view.container.querySelector('[aria-label="保留的编辑内容"]') as HTMLTextAreaElement).value).toContain('Keep or copy removed source');
  await flush(()=>button(f.view.container,'放弃此编辑').click());expect(f.guard().dirty).toBe(true);await flush(()=>button(f.view.container,'确认放弃').click());
  expect(f.guard()).toEqual({dirty:false,saving:false});expect(f.view.container.textContent).not.toContain('未显示的编辑');expect(f.calls).toHaveLength(0);
 }finally{await f.view.unmount();}
});
