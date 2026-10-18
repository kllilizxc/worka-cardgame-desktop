import {createElement,type ReactNode} from 'react';
import {expect,test} from 'bun:test';
import {RuntimeProvider,NoteViewContext} from '@dsh-workbench/react/internal';
import {join} from 'node:path';
import {usePreviewModel,type PreviewModel} from '../notes/note-3/view-model';
import Expanded from '../notes/note-3/view-expanded';
import {View as NoteView} from '../notes/note-3/view';
import type {CandidateSpec} from '../notes/note-3/model';
const worka=process.env.WORKA_SOURCE_ROOT;
if(!worka)throw Error('Set WORKA_SOURCE_ROOT to the checked-out SDK used for the build');
const {button,flush,mount}=await import(join(worka,'tests/web/dom-test-helpers.tsx')) as {
  button(container:ParentNode,label:string):HTMLButtonElement; flush(action?:()=>unknown):Promise<void>;
  mount(element:ReactNode):Promise<{container:HTMLDivElement;rerender(element:ReactNode):Promise<void>;unmount():Promise<void>}>;
};

const candidate=(key:string):CandidateSpec=>({key,title:`Version ${key}`,featureId:`feature-${key}`,revision:'revision-one',receivedAt:0,
  surfaces:[{name:'web',url:`https://${key}.example.invalid/`}],
  status:{web:{phase:'ready',pass:'pass-1',since:1,updatedAt:1,url:`https://${key}.example.invalid/`,verified:{ok:true,checks:[],at:1}}}});
const one=candidate('one'),two=candidate('two'),archived=candidate('archived');
const focus=(key:string)=>'preview:'+encodeURIComponent(JSON.stringify([key,'web']));

type Options={mode?:'compact'|'expanded';focus?:string;focusRequestId?:string;expanded?:boolean;rootView?:boolean;pagePending?:boolean;detailPending?:boolean;pageError?:string;archiveError?:string};
async function fixture(options:Options={}){
  let version=0,revision='r1',detailMissing=false,detailRevision:string|undefined;
  const reads:any[]=[],refreshes:any[]=[],commands:any[]=[],embed:any[]=[];
  const listeners=new Set<{request:any;listener:(snapshot:any)=>void}>();
  const errors:Record<string,string|undefined>={'candidates.page':options.pageError,'archivedCandidates.page':options.archiveError};
  const read=(request:any)=>{
    if(request.name==='readiness')return {missingCapabilities:[],missingConfig:[]};
    if(request.name==='state')return {value:{},revision:'config-1'};
    if(request.name==='state.summary')return {title:'Preview',candidates:{kind:'collection',collection:'candidates',revision}};
    if(request.name==='candidates.page')return {items:request.input.cursor?[two]:[one],revision,...(request.input.cursor?{}:{next:'second'})};
    if(request.name==='archivedCandidates.page')return {items:[archived],revision,...(request.input.cursor?{}:{next:'archive-second'})};
    if(request.name==='outbox.page')return {items:[],revision};
    if(request.name==='candidates.detail'){
      const selected=detailMissing?undefined:[one,two].find(item=>item.key===request.input.key);
      return selected?{...selected,revision:detailRevision??selected.revision}:null;
    }
    return {};
  };
  const snapshot=(request:any)=>({key:request.name,epoch:'preview-fixture',version:++version,stale:false,
    ...(errors[request.name]?{error:errors[request.name]}:{data:read(request)})});
  const runtime:any={note:{id:'preview-fixture'},resources:{
    subscribe:async(request:any,listener:any)=>{reads.push(request);const subscription={request,listener};listeners.add(subscription);if(!(request.name==='candidates.page'&&options.pagePending||request.name==='candidates.detail'&&options.detailPending))listener(snapshot(request));return()=>listeners.delete(subscription);},
    revalidate:async(request:any)=>{refreshes.push(request);const result=snapshot(request);for(const value of listeners)if(value.request.name===request.name&&JSON.stringify(value.request.input)===JSON.stringify(request.input))value.listener(result);return result;},
  },invokeAction:async(name:string,input:any)=>{commands.push({name,input});return {accepted:true};},
    background:{hold:async()=>{},release:async()=>{}},resolvePreviewUrl:async(url:string)=>url,
    openNote:async()=>{},openSession:async()=>{},
  };
  const bridge:any={request:async(method:string,input:any)=>{embed.push({method,input});if(method==='ui.embedAcquire')return {leaseId:'preview-lease',url:input.target};return {accepted:true};}};
  let model!:PreviewModel;
  const context:any={metadata:{id:runtime.note.id,name:'Preview'},mode:options.mode??'expanded',focus:options.focus,focusRequestId:options.focusRequestId,layout:{width:800,maxHeight:600},managed:true};
  function Probe(){model=usePreviewModel();return options.expanded?<Expanded model={model}/>:<span>{model.current?.spec.key}</span>;}
  const render=()=>createElement(RuntimeProvider,{runtime,bridge,children:createElement(NoteViewContext.Provider,{value:{...context},children:createElement(options.rootView?NoteView:Probe)})});
  const view=await mount(render());
  return {...view,reads,refreshes,commands,embed,get model(){return model;},
    async navigate(nextFocus:string,requestId:string){context.focus=nextFocus;context.focusRequestId=requestId;await view.rerender(render());},
    async publish(name:string,{nextRevision,error,missing,selectedRevision}:{nextRevision?:string;error?:string;missing?:boolean;selectedRevision?:string}={}){if(nextRevision)revision=nextRevision;if(missing!==undefined)detailMissing=missing;if(selectedRevision!==undefined)detailRevision=selectedRevision;errors[name]=error;await flush(()=>{for(const value of [...listeners])if(value.request.name===name)value.listener(snapshot(value.request));});},
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
    expect(f.reads.filter(read=>read.name!=='state'&&read.name!=='readiness').map(read=>read.name).sort()).toEqual(['candidates.page','state.summary']);
    expect(f.container.querySelector('iframe')).toBeNull();
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
    expect(f.refreshes.some(read=>read.name==='candidates.page')).toBe(true);
    expect(f.refreshes.some(read=>read.name==='archivedCandidates.page'||read.name==='outbox.page')).toBe(false);
    await f.publish('candidates.page');
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
    await f.publish('candidates.page');
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
    await flush(()=>f.model.nextPage());
    expect(f.model.current?.owner.key).toBe('one');
    expect(f.container.querySelector('iframe')).toBe(frame);
    expect(f.reads.filter(read=>read.name==='candidates.detail'&&read.input.key==='one')).toHaveLength(1);
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
