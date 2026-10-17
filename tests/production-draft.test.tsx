// Run with WORKA_SOURCE_ROOT pointing at the checked-out SDK used for the build.
import {expect,test} from 'bun:test';
import {join} from 'node:path';
const worka=process.env.WORKA_SOURCE_ROOT;
if(worka){
 const {flush,mount,button}=await import(join(worka,'tests/web/dom-test-helpers.tsx'));
 const {RuntimeProvider,NoteViewContext}=await import('@dsh-workbench/react/internal');
 const {NoteSurfaceProvider}=await import(join(worka,'sdk/react/src/note-surface.tsx'));
 const {default:View}=await import('../notes/note-4/view');
 const {useNoteDraft}=await import('@dsh-workbench/react');
 const {ProductionScope,useProductionNote}=await import('../notes/note-4/surface');
 const {requirementFields,requirementPatch}=await import('../notes/note-4/requirement-draft');
 function fixture(){
  let generation='binding-a',version=0,pageRevision='1';
  const reads:any[]=[],copies:string[]=[];
  let production:any={id:'production',projectId:'p',brief:'original',revision:1,requirementRevision:1,status:'draft',rounds:[],candidateRefs:[]};
  const checkpoints=new Map<string,any>();
  const bridge:any={request:async(method:string,params:any)=>{if(method==='ui.draftRecover')return checkpoints.get(params.key)??null;if(method==='ui.draftCheckpoint'){checkpoints.set(params.key,params.checkpoint);return {accepted:true};}if(method==='ui.draftClear'){checkpoints.delete(params.key);return {accepted:true};}throw Error(method);}};
  const listeners=new Set<{request:any;listener:(value:any)=>void}>(),calls:any[]=[];
  const data=(name:string,input:any={})=>name==='state'?{value:{},revision:'config'}:name==='projectBinding'?{configured:true,projectId:'p',projectGeneration:generation}:name==='productions'?{items:[input.cursor?{...production,id:'second-page',brief:'second page first item'}:production],...(input.cursor?{}:{next:'opaque-next'}),revision:pageRevision,total:2}:name==='production'?{production}:name==='media'?{url:'https://example.invalid/candidate.png',revision:'real-sha'}:name==='featureChoices'?{items:[]}:{features:[],todos:[],units:[]};
  const snapshot=(request:any)=>({key:request.name,epoch:'host',version:++version,data:structuredClone(data(request.name,request.input)),stale:false});
  const runtime:any={note:{id:'production-note'},resources:{subscribe:async(request:any,listener:any)=>{reads.push(request);const subscription={request,listener};listeners.add(subscription);listener(snapshot(request));return ()=>listeners.delete(subscription);},revalidate:async(request:any)=>{reads.push(request);return snapshot(request);}},copyText:async(text:string)=>{copies.push(text);},invokeAction:async(name:string,input:any,options:any)=>{calls.push({name,input,requestId:options?.requestId});if(name==='setViewState')return {revision:'state2'};if(input.projectGeneration!==generation)throw Error('项目绑定已变化');if(name==='generate'||name==='newRound')return {status:'queued'};if(input.baseRevision!==production.revision)throw Error('revision conflict');production={...production,...input.patch,revision:production.revision+1};return {production,revision:production.revision};}};
  const publish=(name:string)=>{for(const item of listeners)if(item.request.name===name)item.listener(snapshot(item.request));};
  const render=(children:any)=><RuntimeProvider runtime={runtime}><NoteViewContext.Provider value={{metadata:{id:'production-note',name:'Production'},mode:'expanded',layout:{width:900,maxHeight:900},snapshot:{value:{selectedId:'production'},revision:'state1'}}}><NoteSurfaceProvider bridge={bridge}>{children}</NoteSurfaceProvider></NoteViewContext.Provider></RuntimeProvider>;
  return {runtime,calls,reads,copies,render,publish,checkpoints,changePageRevision(){pageRevision='2';publish('productions');},candidate(revision='real-sha'){production={...production,candidateRefs:[{id:'candidate-id',revision}]};publish('production');},get production(){return production;},update(){production={...production,brief:'server update',revision:production.revision+1};publish('production');},rebind(){generation='binding-b';publish('projectBinding');}};
 }
 test('real requirement editor keeps input on revision changes and never recovers it into a rebound project',async()=>{
  const f=fixture(),view=await mount(f.render(<View/>));
  let second:any;
  try{
   const input=view.container.querySelector('.cg-requirement-editor input') as HTMLInputElement;
   expect(input.value).toBe('original');expect(button(view.container,'保存需求').disabled).toBe(true);
   await flush(()=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(input,'unsaved requirement');input.dispatchEvent(new Event('input',{bubbles:true}));});
   expect(button(view.container,'保存需求').disabled).toBe(false);
   await flush(()=>f.update());expect(input.value).toBe('unsaved requirement');
   await flush(()=>button(view.container,'保存需求').click());expect(f.calls[0].input.baseRevision).toBe(1);expect(input.value).toBe('unsaved requirement');expect(view.container.textContent).toContain('revision conflict');
   await flush(()=>f.rebind());expect(input.value).toBe('unsaved requirement');expect(view.container.textContent).toContain('原草稿仍保留');
   expect(f.checkpoints.has('requirement:production-note:binding-a:production')).toBe(true);
   await view.unmount();second=await mount(f.render(<View/>));
   expect((second.container.querySelector('.cg-requirement-editor input') as HTMLInputElement).value).toBe('server update');
   expect(f.checkpoints.get('requirement:production-note:binding-a:production').value.brief).toBe('unsaved requirement');
  }finally{if(second)await second.unmount();else await view.unmount();}
 });
 test('native draft retains dirty requirement on query revision, retries the original CAS, and pins scope through rebind',async()=>{
  const f=fixture();let draft:any,api:any;
  function Editor(){api=useProductionNote();const selected=api.useQuery('production',{productionId:'production'});draft=useNoteDraft({key:`requirement:${api.metadata.id}:${api.scopeGeneration}:production`,source:selected.draftSource((value:any)=>({value:requirementFields(value?.production),revision:value?.production.revision})),save:async(value:any,context:any)=>{const result=await api.actions.updateProduction({productionId:'production',baseRevision:context.revision,requestId:context.requestId,patch:requirementPatch(value)},context);return {revision:result.revision};}});return <input aria-label="probe" value={draft.value.brief} readOnly/>;}
  const view=await mount(f.render(<ProductionScope><Editor/></ProductionScope>));
  try{
   await flush(()=>draft.set({...draft.value,brief:'unfinished user text'}));await flush(()=>f.update());expect(draft.value.brief).toBe('unfinished user text');
   await flush(async()=>expect(await draft.save()).toBe(false));expect(f.calls[0].input.baseRevision).toBe(1);expect(draft.dirty).toBe(true);expect(draft.error.message).toContain('conflict');
   await flush(async()=>expect(await draft.save()).toBe(false));expect(f.calls[1].requestId).toBe(f.calls[0].requestId);
   await flush(()=>f.rebind());expect(view.container.textContent).toContain('原草稿仍保留');expect(draft.value.brief).toBe('unfinished user text');
   await flush(async()=>expect(await draft.save()).toBe(false));expect(f.calls.at(-1).input.projectGeneration).toBe('binding-a');expect(draft.error.message).toContain('项目绑定');
  }finally{await view.unmount();}
 });
 test('real view paging owns opaque cursors, resets snapshot/filter pages, and pins generation',async()=>{
  const f=fixture(),view=await mount(f.render(<View/>));
  try{
   const list=()=>view.container.querySelector('.cg-expanded-list')!;
   expect(list().textContent).toContain('original');
   (list() as HTMLElement).scrollTop=900;
   await flush(()=>button(view.container,'下一页（最多 100 项）').click());
   expect(list().textContent).toContain('second page first item');expect(list().textContent).not.toContain('original');expect((list() as HTMLElement).scrollTop).toBe(0);
   expect(f.reads.filter(r=>r.name==='productions').at(-1).input).toMatchObject({cursor:'opaque-next',projectGeneration:'binding-a'});
   await flush(()=>f.changePageRevision());expect(list().textContent).toContain('original');expect(view.container.textContent).toContain('第 1 页');
   await flush(()=>button(view.container,'下一页（最多 100 项）').click());
   const search=view.container.querySelector('.cg-toolbar input') as HTMLInputElement;
   await flush(()=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(search,'changed filter');search.dispatchEvent(new Event('input',{bubbles:true}));});
   expect(view.container.textContent).toContain('第 1 页');expect(f.reads.filter(r=>r.name==='productions').at(-1).input).not.toHaveProperty('cursor');
   await flush(()=>f.rebind());await flush(()=>button(view.container,'下一页（最多 100 项）').click());
   expect(f.reads.filter(r=>r.name==='productions').every(r=>r.input.projectGeneration==='binding-a')).toBe(true);
  }finally{await view.unmount();}
 });
 test('native action failures keep the current page and rejection input; copy requires verified resource facts',async()=>{
  const f=fixture();f.candidate();const view=await mount(f.render(<View/>));
  try{
   await flush(()=>button(view.container,'下一页（最多 100 项）').click());
   f.runtime.invokeAction=async()=>{throw Error('command failed');};
   const generate=Array.from(view.container.querySelectorAll('button')).find(b=>b.textContent==='明确生成')!;
   await flush(()=>generate.click());expect(view.container.textContent).toContain('command failed');expect(view.container.textContent).toContain('第 2 页');
   await flush(()=>button(view.container,'否决').click());const reason=view.container.querySelector('[aria-label="否决原因"]') as HTMLInputElement;
   await flush(()=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(reason,'keep this explanation');reason.dispatchEvent(new Event('input',{bubbles:true}));});
   await flush(()=>button(view.container,'确认').click());expect((view.container.querySelector('[aria-label="否决原因"]') as HTMLInputElement).value).toBe('keep this explanation');
   await flush(()=>button(view.container,'取消').click());
   f.runtime.copyText=async()=>{throw Error('clipboard unavailable');};await flush(()=>button(view.container,'复制候选引用').click());expect(view.container.textContent).toContain('clipboard unavailable');expect(view.container.textContent).not.toContain('候选引用已复制');
   f.runtime.copyText=async(text:string)=>{f.copies.push(text);};await flush(()=>button(view.container,'复制候选引用').click());expect(JSON.parse(f.copies[0])).toEqual({kind:'asset',projectId:'p',projectGeneration:'binding-a',id:'candidate-id',revision:'real-sha'});expect(view.container.textContent).toContain('候选引用已复制');
   await flush(()=>f.candidate('unregistered-sha'));await flush(()=>button(view.container,'复制候选引用').click());expect(f.copies).toHaveLength(1);expect(view.container.textContent).toContain('候选资源尚未核验');expect(view.container.textContent).not.toContain('候选引用已复制');
  }finally{await view.unmount();}
 });
}else test.skip('production draft integration needs WORKA_SOURCE_ROOT',()=>{});
