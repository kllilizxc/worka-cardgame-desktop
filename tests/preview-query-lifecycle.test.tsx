import {hostUiFixture,button,deferred,flush,mount,until} from './host-ui-fixture';
import {createElement} from 'react';
import {expect,test} from 'bun:test';
import type {PreviewModel} from '../notes/note-3/view-model';
import type {CandidateSpec} from '../notes/note-3/model';
const {NoteViewContext}=await import('@dsh-workbench/react/internal');
const {usePreviewModel}=await import('../notes/note-3/view-model');
const {default:Expanded}=await import('../notes/note-3/view-expanded');
const {View:NoteView}=await import('../notes/note-3/view');

const candidate=(key:string):CandidateSpec=>({key,title:`Version ${key}`,featureId:`feature-${key}`,revision:'revision-one',receivedAt:0,
  surfaces:[{name:'web',url:`https://${key}.example.invalid/`}],
  status:{web:{phase:'ready',pass:'pass-1',since:1,updatedAt:1,url:`https://${key}.example.invalid/`,verified:{ok:true,checks:[],at:1}}}});
const one=candidate('one'),two=candidate('two'),archived=candidate('archived');
const focus=(key:string)=>'preview:'+encodeURIComponent(JSON.stringify([key,'web']));

type Options={mode?:'compact'|'expanded';focus?:string;focusRequestId?:string;expanded?:boolean;rootView?:boolean;pagePending?:boolean;detailPending?:boolean;pageError?:string;archiveError?:string};
async function fixture(options:Options={}){
  let revision='r1',detailMissing=false,detailRevision:string|undefined;
  const refreshes:any[]=[],embed:any[]=[];
  const pageName=options.rootView&&options.mode==='compact'?'overview':'candidates.page';
  const pending=new Map<string,ReturnType<typeof deferred<void>>>();
  if(options.pagePending)pending.set(pageName,deferred<void>());
  if(options.detailPending)pending.set('candidates.detail',deferred<void>());
  const f=await hostUiFixture({query:async(name,input)=>{
    if(pending.has(name))await pending.get(name)!.promise;
    if(name==='overview')return {summary:'1 个候选版本',items:[{id:one.key,title:one.title,status:'可预览'}]};
    if(name==='state.summary')return {title:'Preview',candidates:{kind:'collection',collection:'candidates',revision}};
    if(name==='candidates.page')return {items:input.cursor?[two]:[one],revision,...(input.cursor?{}:{next:'second'})};
    if(name==='archivedCandidates.page')return {items:[archived],revision,...(input.cursor?{}:{next:'archive-second'})};
    if(name==='outbox.page')return {items:[],revision};
    if(name==='candidates.detail'){
      const selected=detailMissing?undefined:[one,two].find(item=>item.key===input.key);
      return selected?{...selected,revision:detailRevision??selected.revision}:null;
    }
    return {};
  }});
  if(options.pageError)f.failRead(pageName,Error(options.pageError));
  if(options.archiveError)f.failRead('archivedCandidates.page',Error(options.archiveError));
  f.runtime.resolvePreviewUrl=async(url:string)=>url;
  const revalidate=f.runtime.resources.revalidate;
  f.runtime.resources.revalidate=async(request:any)=>{refreshes.push(request);return revalidate(request);};
  const request=f.bridge.request;
  f.bridge.request=async(method:string,input:any)=>{if(method.startsWith('ui.embed')){embed.push({method,input});return method==='ui.embedAcquire'?{leaseId:'preview-lease',url:input.target}:{accepted:true};}return request(method,input);};
  let model!:PreviewModel;
  const context:any={metadata:{id:f.runtime.note.id,name:'Preview'},mode:options.mode??'expanded',focus:options.focus,focusRequestId:options.focusRequestId,layout:{width:800,maxHeight:600},managed:true};
  function Probe(){model=usePreviewModel();return options.expanded?<Expanded model={model}/>:<span>{model.current?.spec.key}</span>;}
  const render=()=>f.render(createElement(NoteViewContext.Provider,{value:{...context},children:createElement(options.rootView?NoteView:Probe)}),options.mode);
  const view=await mount(render());
  if(options.rootView)await flush(()=>import('../notes/note-3/view-compact'));
  await until(()=>options.rootView?Boolean(view.container.querySelector('.note-overview')):Boolean(model?.page.data||model?.page.error||options.pagePending));
  return {...view,reads:f.reads,refreshes,commands:f.calls,embed,get model(){return model;},
    async unmount(){for(const gate of pending.values())gate.resolve();pending.clear();await view.unmount();await f.close();},
    async navigate(nextFocus:string,requestId:string){context.focus=nextFocus;context.focusRequestId=requestId;await view.rerender(render());},
    async publish(name:string,{nextRevision,error,missing,selectedRevision}:{nextRevision?:string;error?:string;missing?:boolean;selectedRevision?:string}={}){if(nextRevision)revision=nextRevision;if(missing!==undefined)detailMissing=missing;if(selectedRevision!==undefined)detailRevision=selectedRevision;f.failRead(name,error?Error(error):undefined);pending.get(name)?.resolve();pending.delete(name);await flush(()=>f.publish(name));},
  };
}

test('native candidate pagination drops both cursor stacks when the source revision changes',async()=>{
  const f=await fixture();
  try{
    await flush(()=>f.model.nextPage());
    expect(f.reads.filter(read=>read.name==='candidates.page').at(-1).input.cursor).toBe('second');
    await f.publish('candidates.page',{nextRevision:'r2'});
    expect(f.reads.filter(read=>read.name==='candidates.page').at(-1).input.cursor).toBeUndefined();
    expect(f.model.page.hasPrevious).toBe(false);
    await flush(()=>f.model.setShowArchive(true));
    await flush(()=>f.model.nextArchive());
    expect(f.reads.filter(read=>read.name==='archivedCandidates.page').at(-1).input.cursor).toBe('archive-second');
    await f.publish('archivedCandidates.page',{nextRevision:'r3'});
    expect(f.reads.filter(read=>read.name==='archivedCandidates.page').at(-1).input.cursor).toBeUndefined();
    expect(f.model.archivePage.hasPrevious).toBe(false);
  }finally{await f.unmount();}
});

test('archived read failures stay visible and their retry refreshes the actual query',async()=>{
  const f=await fixture({expanded:true,archiveError:'Archive unavailable'});
  try{
    await flush(()=>button(f.container,'更多试玩操作').click());
    const archives=Array.from(f.container.querySelectorAll('button')).find(control=>control.textContent?.startsWith('已归档'))!;
    await flush(()=>archives.click());
    expect(f.container.textContent).toContain('Archive unavailable');
    expect(f.model.query.issues?.some(issue=>issue.source==='archive')).toBe(true);
    await flush(()=>button(f.container,'重试').click());
    expect(f.refreshes.some(read=>read.name==='archivedCandidates.page')).toBe(true);
    await f.publish('archivedCandidates.page');
    expect(f.container.textContent).not.toContain('Archive unavailable');
    expect(f.container.textContent).toContain('Version archived');
    expect(f.commands).toEqual([]);
  }finally{await f.unmount();}
});

test('a repeated focus request overrides the local version choice without starting the candidate',async()=>{
  const f=await fixture({focus:focus('one'),focusRequestId:'request-1'});
  try{
    expect(f.model.current?.owner.key).toBe('one');
    await flush(()=>f.model.setActiveKey('two:web'));
    expect(f.model.current?.owner.key).toBe('two');
    await f.navigate(focus('one'),'request-2');
    expect(f.model.current?.owner.key).toBe('one');
    expect(f.commands).toEqual([]);
  }finally{await f.unmount();}
});

test('paging an opened candidate keeps its exact bounded detail and managed player',async()=>{
  const f=await fixture({expanded:true});
  try{
    await flush(()=>f.model.attach('one:web'));
    const frame=f.container.querySelector('iframe');expect(frame).not.toBeNull();
    await flush(()=>f.model.nextPage());
    expect(f.model.current?.owner.key).toBe('one');
    expect(f.container.querySelector('iframe')).toBe(frame);
    expect(f.reads.some(read=>read.name==='candidates.detail'&&read.input.key==='one')).toBe(true);
    expect(f.reads.some(read=>read.name==='view'||read.name.endsWith('.field'))).toBe(false);
    expect(f.commands.filter(call=>call.name==='start')).toEqual([]);
    expect(f.embed.filter(call=>call.method==='ui.embedAcquire')).toHaveLength(1);
  }finally{await f.unmount();}
  expect(f.embed.filter(call=>call.method==='ui.embedRelease')).toHaveLength(1);
});

test('the real compact entry stays query-only and leaves archives, outbox, and detail unopened',async()=>{
  const f=await fixture({mode:'compact',rootView:true});
  try{
    expect(f.container.textContent).toContain('Version one');
    expect(f.reads.filter(read=>read.name!=='state'&&read.name!=='readiness').map(read=>read.name).sort()).toEqual(['overview']);
    expect(f.container.querySelector('iframe')).toBeNull();
    expect(f.container.querySelectorAll('button,input,textarea')).toHaveLength(0);
    expect(f.commands).toEqual([]);
  }finally{await f.unmount();}
});


test('the same versions deep link reopens on a new host focus request',async()=>{
  const versions='cg:'+encodeURIComponent(JSON.stringify({kind:'preview',id:'one',revision:'',intent:'versions'}));
  const f=await fixture({expanded:true,focus:versions,focusRequestId:'versions-1'});
  try{
    const dialog=()=>f.container.querySelector<HTMLDialogElement>('dialog[aria-label="选择试玩版本"]')!;
    expect(dialog().open).toBe(true);
    await flush(()=>button(dialog(),'关闭').click());
    expect(dialog().open).toBe(false);
    await f.navigate(versions,'versions-2');
    expect(dialog().open).toBe(true);
    expect(f.commands).toEqual([]);
  }finally{await f.unmount();}
});

test('a requested CardGame revision never silently selects a different snapshot',async()=>{
  const requested='cg:'+encodeURIComponent(JSON.stringify({kind:'preview',id:'one',revision:'unavailable-commit'}));
  const f=await fixture({focus:requested,focusRequestId:'missing-revision'});
  try{
    expect(f.model.current).toBeUndefined();
    expect(f.model.error).toContain('不存在或已归档');
    expect(f.commands).toEqual([]);
  }finally{await f.unmount();}
});


test('compact initial page failure offers the actual retry and never claims the candidate list is empty',async()=>{
  const f=await fixture({mode:'compact',rootView:true,pageError:'Candidate unavailable'});
  try{
    expect(f.container.textContent).toContain('Candidate unavailable');
    expect(f.container.textContent).not.toContain('尚无试玩版本');
    expect(f.container.textContent).not.toContain('执行台委托产出');
    await flush(()=>button(f.container,'重试').click());
    expect(f.refreshes.some(read=>read.name==='overview')).toBe(true);
    expect(f.refreshes.some(read=>read.name==='archivedCandidates.page'||read.name==='outbox.page')).toBe(false);
    await f.publish('overview');
    expect(f.container.textContent).toContain('Version one');
    expect(f.container.textContent).not.toContain('Candidate unavailable');
    expect(f.commands).toEqual([]);
  }finally{await f.unmount();}
});

test('compact pending query uses the shared loading state instead of a business empty list',async()=>{
  const f=await fixture({mode:'compact',rootView:true,pagePending:true});
  try{
    expect(f.container.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(f.container.textContent).not.toContain('尚无试玩版本');
    expect(f.container.textContent).not.toContain('执行台委托产出');
    await f.publish('overview');
    expect(f.container.textContent).toContain('Version one');
    expect(f.container.querySelector('[aria-busy="true"]')).toBeNull();
  }finally{await f.unmount();}
});


test('a deep-linked player waits for its independent detail owner and survives paging during deferred reads',async()=>{
  const f=await fixture({expanded:true,focus:focus('one'),focusRequestId:'deep-link',detailPending:true});
  try{
    expect(f.container.querySelector('iframe')).toBeNull();
    expect(f.container.textContent).not.toContain('所选试玩版本不存在');
    await f.publish('candidates.detail');
    const frame=f.container.querySelector('iframe');expect(frame).not.toBeNull();
    expect(f.model.current?.owner.key).toBe('one');
    const detailReadsBeforePage=f.reads.filter(read=>read.name==='candidates.detail'&&read.input.key==='one').length;
    await flush(()=>f.model.nextPage());
    expect(f.model.current?.owner.key).toBe('one');
    expect(f.container.querySelector('iframe')).toBe(frame);
    expect(f.reads.filter(read=>read.name==='candidates.detail'&&read.input.key==='one')).toHaveLength(detailReadsBeforePage);
    expect(f.embed.filter(call=>call.method==='ui.embedAcquire')).toHaveLength(1);
    expect(f.embed.filter(call=>call.method==='ui.embedRelease')).toHaveLength(0);
    await f.publish('candidates.detail',{missing:true});
    expect(f.container.querySelector('iframe')).toBeNull();
    expect(f.model.error).toContain('不存在或已归档');
    expect(f.commands.filter(call=>call.name==='start')).toEqual([]);
  }finally{await f.unmount();}
});

test('an independent player detail failure is an error rather than a missing candidate',async()=>{
  const f=await fixture({expanded:true,focus:focus('one'),detailPending:true});
  try{
    await f.publish('candidates.detail',{error:'Selected candidate unavailable'});
    expect(f.container.textContent).toContain('Selected candidate unavailable');
    expect(f.model.error).not.toContain('不存在或已归档');
    expect(f.container.querySelector('iframe')).toBeNull();
  }finally{await f.unmount();}
});


test('an exact CardGame revision stays authoritative after playback begins and detail changes',async()=>{
  const requested='cg:'+encodeURIComponent(JSON.stringify({kind:'preview',id:'one',revision:'revision-one'}));
  const f=await fixture({expanded:true,focus:requested,focusRequestId:'exact-one'});
  try{
    expect(f.container.querySelector('iframe')).not.toBeNull();
    expect(f.model.current?.owner.revision).toBe('revision-one');
    await f.publish('candidates.detail',{selectedRevision:'revision-two'});
    expect(f.model.current).toBeUndefined();
    expect(f.container.querySelector('iframe')).toBeNull();
    expect(f.model.error).toContain('不存在或已归档');
    expect(f.commands.filter(call=>call.name==='start')).toEqual([]);
  }finally{await f.unmount();}
});
