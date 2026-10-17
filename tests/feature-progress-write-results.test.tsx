import {createElement} from 'react';
import {expect,test} from 'bun:test';
import {CommandOutcomeError} from '@dsh-workbench/runtime';
import {RuntimeProvider,NoteViewContext} from '@dsh-workbench/react/internal';
import {join} from 'node:path';
const worka=process.env.WORKA_SOURCE_ROOT;
if(!worka)throw Error('Set WORKA_SOURCE_ROOT to the checked-out SDK used for the build');
const {button,deferred,flush,mount}=await import(join(worka,'tests/web/dom-test-helpers.tsx'));
import {View} from '../notes/note-6/view';
import {setArchiveStatus,confirmGameCandidate,undoGameCandidate} from '../notes/note-6/actions';

const candidate = {id:'candidate-one',projectId:'game',productionId:'production-one',featureId:'feature-one',cardId:'CARD_1',
  commit:'d'.repeat(40),candidateHash:'a'.repeat(64),targetBaseRevision:'b'.repeat(64),validationManifest:'c'.repeat(64),status:'candidate' as const,previewVerified:true};
const feature = {id:'feature-one',title:'Synthetic feature',archived:false,autoArchived:false,totalPrs:0,mergedPrs:0,links:[],gameCandidates:[candidate]};
const initial = () => ({serverUrl:'https://example.invalid',status:'running',totalCount:1,activeCount:1,archivedCount:0,errors:[],features:[structuredClone(feature)]});
const adopted = () => ({...candidate,status:'adopted' as const,adoptionId:'adoption-one',adoptedAt:'2026-10-17'});

type FixtureOptions = {
  invoke?:(name:string,input:any,fixture:any)=>Promise<any>;
  revalidate?:(fixture:any)=>Promise<any>;
  eventError?:Error;
  receipt?:(value:any)=>any;
  adopted?:boolean;
  features?:any[];
  config?:Record<string,unknown>;
  resourceData?:(name:string,input:any,fixture:any)=>any;
};
async function fixture(options:FixtureOptions={}) {
  let authority:any = initial();
  if (options.adopted) authority.features[0].gameCandidates = [adopted()];
  if (options.features) authority={...authority,features:structuredClone(options.features),activeCount:options.features.filter(item=>!item.archived).length};
  let version=1, viewListener:((snapshot:any)=>void)|undefined;
  const calls:{name:string;input:any;requestId?:string}[]=[], providerCalls:string[]=[], events:any[]=[], reads:string[]=[];
  const snapshot=(data=authority,extra={})=>({key:'view',epoch:'fixture',version:++version,data:structuredClone(data),stale:false,...extra});
  const f = {get authority(){return authority;},set authority(value){authority=value;},calls,providerCalls,events,reads,snapshot,
    publish(data=authority,extra={}){viewListener?.(snapshot(data,extra));},
    setArchive(archived:boolean,id=feature.id){const features=authority.features.map((item:any)=>item.id===id?{...item,archived}:item);authority={...authority,activeCount:features.filter((item:any)=>!item.archived).length,archivedCount:features.filter((item:any)=>item.archived).length,features};},
    setCandidate(value:any){authority={...authority,features:authority.features.map((item:any)=>item.id===value.featureId?{...item,gameCandidates:item.gameCandidates.map((current:any)=>current.id===value.id?value:current)}:item)};},
  };
  const ctx:any = {note:{id:'feature-write-results',stateRef:'fixture'},store:{read:async()=>({value:{},revision:'0'})},
    extensions:{request:async(_provider:string,method:string,input:any)=>{
      providerCalls.push(method);
      if(method==='archive') { f.setArchive(input.archived,input.id); const receipt={id:input.id,archived:input.archived,title:feature.title,revision:'archive-revision'}; return options.receipt?options.receipt(receipt):receipt; }
      const value=method==='confirmGameCandidate'?adopted():{...adopted(),status:'undone',undoneAt:'2026-10-17'};
      f.setCandidate(value);return {candidate:value,adoptionId:value.adoptionId};
    }},events:{publish:async(...args:any[])=>{events.push(args);if(options.eventError)throw options.eventError;return {id:'archive-event'};}},
  };
  const navigations:any[]=[],copies:string[]=[],queryReads:any[]=[];
  const otherListeners=new Map<string,(snapshot:any)=>void>();
  const readData=(name:string,input:any)=>options.resourceData?.(name,input,f)??(name==='view'?authority:name==='state'?{value:options.config??{},revision:'config-1'}:name==='summary'?authority:{ci:{}});
  const runtime:any = {note:{id:'feature-write-results'},store:{read:async()=>({value:{},revision:'0'}),subscribe:async()=>()=>{}},surface:{registerDraft:()=>()=>{}},
    resources:{subscribe:async(request:any,listener:any)=>{queryReads.push(request);if(request.name==='view')viewListener=listener;else otherListeners.set(request.name,listener);listener(snapshot(readData(request.name,request.input)));return()=>{if(request.name==='view'&&viewListener===listener)viewListener=undefined;else if(otherListeners.get(request.name)===listener)otherListeners.delete(request.name);};},
      read:async(request:any)=>snapshot(readData(request.name,request.input)),
      revalidate:async(request:any)=>{reads.push(request.name);if(request.name==='view'&&options.revalidate)return options.revalidate(f);const result=snapshot(readData(request.name,request.input));if(request.name==='view')viewListener?.(result);else otherListeners.get(request.name)?.(result);return result;}},
    openNote:async(...args:any[])=>navigations.push({kind:'note',args}),openSession:async(...args:any[])=>navigations.push({kind:'session',args}),copyText:async(text:string)=>copies.push(text),
    invokeAction:async(name:string,input:any,actionOptions:any)=>{
      calls.push({name,input,requestId:actionOptions?.requestId});if(options.invoke)return options.invoke(name,input,f);
      if(name==='setArchiveStatus')return setArchiveStatus(ctx,input);
      if(name==='confirmGameCandidate')return confirmGameCandidate(ctx,input);
      if(name==='undoGameCandidate')return undoGameCandidate(ctx,input);
      if(name==='discussChange')return {sessionId:'prepared-session'};
      return {accepted:true};
    },
  };
  const render=()=>mount(createElement(RuntimeProvider,{runtime,children:createElement(NoteViewContext.Provider,{value:{metadata:{id:runtime.note.id,name:'功能进展'},mode:'expanded',layout:{width:800,maxHeight:600},snapshot:{value:{},revision:'0'}},children:createElement(View)})}));
  const view=await render();

  return {...f,get authority(){return f.authority;},view,runtime,render,navigations,copies,queryReads};
}
const twice=(control:HTMLButtonElement)=>{control.click();control.click();};
const content=(f:any)=>{const copy=f.view.container.cloneNode(true) as HTMLElement;copy.querySelectorAll('style').forEach(element=>element.remove());return copy.textContent;};
const card=(f:any,title=feature.title)=>Array.from(f.view.container.querySelectorAll('article') as NodeListOf<HTMLElement>).find(element=>element.querySelector('h2')?.textContent===title)!;

// These tests drive the bundled action proxy, actual note view, and archive /
// candidate action handlers. Faults are injected at write-receipt and read edges.
test('archive event partial success retains the committed receipt and never rolls the card back or replays',async()=>{
  const f=await fixture({eventError:new Error('synthetic event sink failure')});
  try {
    await flush(()=>twice(button(f.view.container,'归档')));
    expect(f.calls.map(call=>call.name)).toEqual(['setArchiveStatus']);
    expect(f.providerCalls).toEqual(['archive']);expect(f.events).toHaveLength(1);expect(f.reads).toEqual(['view']);
    expect(content(f)).toContain('已保存归档');
    expect(content(f)).toContain('关联归档事件发布失败：synthetic event sink failure');
    await flush(()=>button(f.view.container,'已归档 (1)').click());
    expect(button(f.view.container,'恢复').disabled).toBe(false);
    expect(content(f)).toContain(feature.title);
  } finally {await f.view.unmount();}
});

for(const status of ['ambiguous','completed'] as const)test(`archive ${status} dropped receipt is verified with one authoritative read and no second write`,async()=>{
  const error=new CommandOutcomeError('synthetic dropped receipt','archive-command',status,status==='completed');
  const f=await fixture({invoke:async(name,input,state)=>{state.setArchive(true);throw error;}});
  try {
    await flush(()=>twice(button(f.view.container,'归档')));
    expect(f.calls.map(call=>call.name)).toEqual(['setArchiveStatus']);expect(f.reads).toEqual(['view']);
    expect(content(f)).toContain('归档状态已核对');
    expect(content(f)).not.toContain('归档失败');
    await flush(()=>button(f.view.container,'已归档 (1)').click());
    expect(button(f.view.container,'恢复').disabled).toBe(false);
  }finally{await f.view.unmount();}
});

for(const readFault of ['throw','stale','missing','unconfirmed'] as const)test(`archive uncertain write stays pending after ${readFault} read and never replays`,async()=>{
  const f=await fixture({invoke:async()=>{throw new CommandOutcomeError('receipt lost','archive-unknown','ambiguous');},
    revalidate:async state=>{if(readFault==='throw')throw Error('synthetic read failure');return state.snapshot(readFault==='missing'?undefined:initial(),readFault==='stale'?{stale:true}:readFault==='missing'?{data:undefined}:{});}});
  try {
    await flush(()=>button(f.view.container,'归档').click());
    expect(content(f)).toContain('归档结果待核实');expect(content(f)).toContain('archive-unknown');
    expect(button(f.view.container,'已归档 (0)')).toBeDefined();
    const pending=button(f.view.container,'待核实');expect(pending.disabled).toBe(true);
    await flush(()=>twice(pending));expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
    await flush(()=>{f.setArchive(true);f.publish();});
    await flush(()=>button(f.view.container,'已归档 (1)').click());
    expect(button(f.view.container,'恢复').disabled).toBe(false);
    expect(content(f)).toContain('归档状态已核对');expect(f.calls).toHaveLength(1);
  }finally{await f.view.unmount();}
});

for(const receipt of [null,{id:'other',archived:true,revision:'wrong'}])test(`unusable archive receipt ${JSON.stringify(receipt)} is verified without replay or fabricated write failure`,async()=>{
  const f=await fixture({receipt:()=>receipt});
  try {
    await flush(()=>button(f.view.container,'归档').click());
    expect(content(f)).toContain('归档状态已核对');
    expect(f.calls).toHaveLength(1);expect(f.providerCalls).toEqual(['archive']);expect(f.events).toHaveLength(0);expect(f.reads).toEqual(['view']);
  }finally{await f.view.unmount();}
});

test('accepted archive and event failure remain distinct from a failed verification read',async()=>{
  const f=await fixture({eventError:Error('event failed'),revalidate:async()=>{throw Error('read failed');}});
  try{
    await flush(()=>button(f.view.container,'归档').click());
    expect(content(f)).toContain('已保存，页面回读待刷新：read failed');
    expect(content(f)).toContain('关联归档事件发布失败：event failed');
    await flush(()=>{f.publish();});
    expect(content(f)).toContain('已保存归档');expect(content(f)).toContain('关联归档事件发布失败：event failed');
    expect(f.calls).toHaveLength(1);
  }finally{await f.view.unmount();}
});

for(const operation of ['confirm','undo'] as const)test(`candidate ${operation} succeeds while refresh fails: accepted fact remains visible and cannot replay`,async()=>{
  const f=await fixture({adopted:operation==='undo',revalidate:async()=>{throw Error('synthetic refresh failure');}});
  try{
    if(operation==='undo')await flush(()=>button(f.view.container,'查看决策与记录 ▾').click());
    await flush(()=>twice(button(f.view.container,operation==='confirm'?'加入我的游戏':'撤销采用')));
    expect(f.calls.map(call=>call.name)).toEqual([operation==='confirm'?'confirmGameCandidate':'undoGameCandidate']);
    expect(f.providerCalls).toEqual([operation==='confirm'?'confirmGameCandidate':'undoGameCandidate']);expect(f.reads).toEqual(['view']);
    expect(content(f)).toContain(`${operation==='confirm'?'采用':'撤销采用'}已完成，页面回读待刷新：synthetic refresh failure`);
    // The card stays at the last authoritative query value until publication.
    expect(content(f)).toContain(operation==='confirm'?'1 个试玩候选':'已采用于');
    expect(content(f)).not.toContain(operation==='confirm'?'已采用于':'已撤销于');
    expect(button(f.view.container,operation==='confirm'?'加入我的游戏':'撤销采用').disabled).toBe(true);
    await flush(()=>{f.publish();});
    expect(content(f)).toContain('已核对候选状态');expect(f.calls).toHaveLength(1);
  }finally{await f.view.unmount();}
});

for(const status of ['ambiguous','completed'] as const)test(`candidate ${status} dropped receipt is verified against identity, status and adoption`,async()=>{
  const f=await fixture({invoke:async(_name,_input,state)=>{state.setCandidate(adopted());throw new CommandOutcomeError('candidate receipt lost','candidate-command',status,status==='completed');}});
  try{
    await flush(()=>twice(button(f.view.container,'加入我的游戏')));
    expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
    expect(content(f)).toContain('候选状态已核对；操作回执不可用');
    expect(content(f)).toContain('已采用于');expect(content(f)).not.toContain('加入我的游戏');
    expect(button(f.view.container,'撤销采用').disabled).toBe(false);
  }finally{await f.view.unmount();}
});

for(const fault of ['unavailable','wrong-identity','missing-adoption'] as const)test(`candidate ambiguous result remains pending for ${fault} verification without replay`,async()=>{
  const f=await fixture({invoke:async()=>{throw new CommandOutcomeError('candidate receipt lost','candidate-unknown','ambiguous');},
    revalidate:async state=>{if(fault==='unavailable')throw Error('read unavailable');state.setCandidate({...adopted(),...(fault==='wrong-identity'?{candidateHash:'new-candidate'}:{adoptionId:undefined})});return state.snapshot();}});
  try{
    await flush(()=>button(f.view.container,'加入我的游戏').click());
    expect(content(f)).toContain('采用结果待核实');expect(content(f)).toContain('candidate-unknown');
    const pending=button(f.view.container,fault==='unavailable'?'加入我的游戏':'撤销采用');expect(pending.disabled).toBe(true);
    await flush(()=>twice(pending));expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
    await flush(()=>{f.setCandidate(adopted());f.publish();});
    expect(f.calls).toHaveLength(1);expect(content(f)).not.toContain('加入我的游戏');
    expect(content(f)).toContain('候选状态已核对');
  }finally{await f.view.unmount();}
});

test('undo ambiguous result cannot be verified against a different adoption',async()=>{
  const f=await fixture({adopted:true,invoke:async()=>{throw new CommandOutcomeError('undo receipt lost','undo-unknown','ambiguous');},
    revalidate:async state=>{state.setCandidate({...adopted(),status:'undone',adoptionId:'another-adoption'});return state.snapshot();}});
  try{
    await flush(()=>button(f.view.container,'查看决策与记录 ▾').click());
    await flush(()=>button(f.view.container,'撤销采用').click());
    expect(content(f)).toContain('撤销采用结果待核实');expect(content(f)).toContain('已撤销于');expect(content(f)).not.toContain('撤销采用已完成');
    expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
  }finally{await f.view.unmount();}
});

test('in-flight candidate action only dispatches once before its receipt or verification returns',async()=>{
  const receipt=deferred<any>();const read=deferred<any>();
  const f=await fixture({invoke:async()=>receipt.promise,revalidate:async()=>read.promise});
  try{
    await flush(()=>twice(button(f.view.container,'加入我的游戏')));expect(f.calls).toHaveLength(1);expect(f.reads).toHaveLength(0);
    await flush(()=>receipt.resolve({candidate:adopted()}));expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
    await flush(()=>read.resolve(f.snapshot({...initial(),features:[{...feature,gameCandidates:[adopted()]}]})));
    expect(f.calls).toHaveLength(1);
  }finally{await f.view.unmount();}
});

test('malformed archive receipt with unavailable verification never claims the write succeeded',async()=>{
  const f=await fixture({receipt:()=>null,revalidate:async()=>{throw Error('unavailable');}});
  try{
    await flush(()=>button(f.view.container,'归档').click());
    expect(content(f)).toContain('归档结果待核实');
    expect(content(f)).not.toContain('已保存');
    expect(f.calls).toHaveLength(1);expect(f.providerCalls).toEqual(['archive']);expect(f.events).toHaveLength(0);expect(f.reads).toEqual(['view']);
  }finally{await f.view.unmount();}
});

test('unusable candidate receipt with unavailable verification stays unknown instead of claiming adoption',async()=>{
  const f=await fixture({invoke:async()=>({candidate:{...adopted(),candidateHash:'different'}}),revalidate:async()=>{throw Error('unavailable');}});
  try{
    await flush(()=>button(f.view.container,'加入我的游戏').click());
    expect(content(f)).toContain('采用结果待核实');
    expect(content(f)).toContain('操作回执无法核对');
    expect(content(f)).not.toContain('采用已完成');
    expect(button(f.view.container,'加入我的游戏').disabled).toBe(true);expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
  }finally{await f.view.unmount();}
});

test('in-flight archive stays one dispatch while waiting for authoritative verification',async()=>{
  const read=deferred<any>();
  const f=await fixture({revalidate:async()=>read.promise});
  try{
    await flush(()=>twice(button(f.view.container,'归档')));expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
    expect(button(f.view.container,'已归档 (0)')).toBeDefined();
    const busy=button(f.view.container,'处理中…');expect(busy.disabled).toBe(true);
    await flush(()=>twice(busy));expect(f.calls).toHaveLength(1);
    await flush(()=>read.resolve(f.snapshot()));expect(f.calls).toHaveLength(1);
  }finally{await f.view.unmount();}
});

for(const status of ['ambiguous','completed'] as const)test(`archive event ${status} outcome is pending verification rather than a false publication failure`,async()=>{
  const f=await fixture({eventError:new CommandOutcomeError('event receipt unavailable','event-command',status,status==='completed')});
  try{
    await flush(()=>button(f.view.container,'归档').click());
    expect(content(f)).toContain('已保存归档');expect(content(f)).toContain('关联归档事件结果待核实');
    expect(content(f)).toContain('event-command');
    expect(content(f)).not.toContain('发布失败');
    expect(f.calls).toHaveLength(1);expect(f.providerCalls).toEqual(['archive']);expect(f.events).toHaveLength(1);
  }finally{await f.view.unmount();}
});

test('accepted adoption receipt stays distinct when the authoritative view has a different adoption',async()=>{
  const f=await fixture({revalidate:async state=>{state.setCandidate({...adopted(),adoptionId:'different-adoption'});return state.snapshot();}});
  try{
    await flush(()=>button(f.view.container,'加入我的游戏').click());
    expect(content(f)).toContain('采用已完成，当前记录已变化');
    expect(content(f)).not.toContain('候选状态已核对');
    expect(button(f.view.container,'撤销采用').disabled).toBe(false);
    expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
  }finally{await f.view.unmount();}
});

for(const write of ['accepted','ambiguous'] as const)for(const operation of ['archive','candidate'] as const)test(`${operation} ${write}: a desired stream before read rejection still unlocks without replay`,async()=>{
  const read=deferred<any>();
  const f=await fixture({revalidate:async()=>read.promise,...(write==='ambiguous'?{invoke:async(_name:string,_input:any,state:any)=>{
    if(operation==='archive')state.setArchive(true);else state.setCandidate(adopted());
    throw new CommandOutcomeError('receipt unavailable','stream-race-command','ambiguous');
  }}:{})});
  try{
    await flush(()=>button(f.view.container,operation==='archive'?'归档':'加入我的游戏').click());
    expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
    // Deliver and commit the authoritative stream while revalidation is held.
    await flush(()=>f.publish());
    await flush(()=>read.reject(Error('read rejected after fresh stream')));
    if(operation==='archive'){
      await flush(()=>button(f.view.container,'已归档 (1)').click());
      expect(button(f.view.container,'恢复').disabled).toBe(false);
      expect(content(f)).toContain(write==='accepted'?'已核对功能状态':'归档状态已核对');
    }else{
      expect(button(f.view.container,'撤销采用').disabled).toBe(false);
      expect(content(f)).toContain(write==='accepted'?'已核对候选状态':'候选状态已核对');
    }
    expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
  }finally{await f.view.unmount();}
});

const otherCandidate={...candidate,id:'candidate-two',featureId:'feature-two',cardId:'CARD_2'};
const otherFeature={...feature,id:'feature-two',title:'Other synthetic feature',gameCandidates:[otherCandidate]};
for(const operation of ['archive','candidate'] as const)test(`${operation}: an unknown target does not block another target or replay either intent`,async()=>{
  const f=await fixture({features:[feature,otherFeature],invoke:async(name,input,state)=>{
    if((input.id||input.candidateId)===(operation==='archive'?feature.id:candidate.id))throw new CommandOutcomeError('first receipt lost','independent-one','ambiguous');
    if(operation==='archive'){
      state.setArchive(input.archived,input.id);
      return {accepted:true,receiptVerified:true,receipt:{id:input.id,archived:input.archived,revision:'other-revision'},event:{status:'published',eventId:'other-event'}};
    }
    const value={...otherCandidate,status:name==='undoGameCandidate'?'undone':'adopted',adoptionId:'adoption-two',adoptedAt:'2026-10-17'};
    state.setCandidate(value);return {candidate:value,adoptionId:value.adoptionId};
  },revalidate:async state=>{if(state.reads.length===1)throw Error('first verification unavailable');return state.snapshot();}});
  try{
    const label=operation==='archive'?'归档':'加入我的游戏';
    await flush(()=>button(card(f),label).click());
    expect(button(card(f),operation==='archive'?'待核实':label).disabled).toBe(true);
    expect(button(card(f,otherFeature.title),label).disabled).toBe(false);
    await flush(()=>twice(button(card(f,otherFeature.title),label)));
    expect(f.calls).toHaveLength(2);expect(f.reads).toEqual(['view','view']);
    expect(button(card(f),operation==='archive'?'待核实':label).disabled).toBe(true);
    if(operation==='candidate'){
      expect(button(card(f,otherFeature.title),'撤销采用').disabled).toBe(false);
      await flush(()=>button(card(f,otherFeature.title),'撤销采用').click());
      expect(f.calls).toHaveLength(3);expect(f.calls[2]!.input.candidateId).toBe(otherCandidate.id);
    }
  }finally{await f.view.unmount();}
});

for(const operation of ['archive','candidate'] as const)test(`${operation}: a confirmed receipt and fresh different authority show separate facts and unlock the target`,async()=>{
  const f=await fixture({revalidate:async state=>{
    if(operation==='archive')state.setArchive(false);else state.setCandidate(candidate);
    return state.snapshot();
  }});
  try{
    await flush(()=>button(f.view.container,operation==='archive'?'归档':'加入我的游戏').click());
    expect(content(f)).toContain(operation==='archive'?'已保存，当前记录已变化':'采用已完成，当前记录已变化');
    expect(content(f)).not.toContain('状态已核对');
    expect(button(f.view.container,operation==='archive'?'归档':'加入我的游戏').disabled).toBe(false);
    expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
    expect(button(f.view.container,'已归档 (0)')).toBeDefined();
  }finally{await f.view.unmount();}
});

test('candidate confirm pending verification also blocks undo of that same target after a fresh stream',async()=>{
  const read=deferred<any>();
  const f=await fixture({revalidate:async()=>read.promise});
  try{
    await flush(()=>button(f.view.container,'加入我的游戏').click());
    await flush(()=>f.publish());
    expect(button(f.view.container,'撤销采用').disabled).toBe(true);
    await flush(()=>twice(button(f.view.container,'撤销采用')));expect(f.calls).toHaveLength(1);
    await flush(()=>read.resolve(f.snapshot()));
    expect(button(f.view.container,'撤销采用').disabled).toBe(false);expect(f.calls).toHaveLength(1);
  }finally{await f.view.unmount();}
});

test('dismissed uncertain archive notice keeps its target blocked and never replays',async()=>{
  const f=await fixture({invoke:async()=>{throw new CommandOutcomeError('receipt missing','dismissed-command','ambiguous');},revalidate:async()=>{throw Error('unavailable');}});
  try{
    await flush(()=>button(f.view.container,'归档').click());
    expect(content(f)).toContain('归档结果待核实');
    await flush(()=>button(f.view.container,'关闭提示').click());
    expect(content(f)).not.toContain('归档结果待核实');
    const pending=button(f.view.container,'待核实');expect(pending.disabled).toBe(true);
    await flush(()=>twice(pending));expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
  }finally{await f.view.unmount();}
});

for(const operation of ['archive','candidate'] as const)test(`${operation}: unresolved intent survives a true note remount in the same runtime without replay`,async()=>{
  const f=await fixture({invoke:async()=>{throw new CommandOutcomeError('receipt lost','remount-command','ambiguous');},revalidate:async()=>{throw Error('unavailable');}});
  try{
    await flush(()=>button(f.view.container,operation==='archive'?'归档':'加入我的游戏').click());
    await f.view.unmount();f.view=await f.render();await flush();
    expect(content(f)).toContain('结果待核实');expect(content(f)).toContain('remount-command');
    expect(button(f.view.container,operation==='archive'?'待核实':'加入我的游戏').disabled).toBe(true);
    expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
    await flush(()=>{if(operation==='archive')f.setArchive(true);else f.setCandidate(adopted());f.publish();});
    expect(f.calls).toHaveLength(1);expect(content(f)).toContain('状态已核对');
  }finally{await f.view.unmount();}
});

test('candidate receipt notice remains visible if fresh authoritative data removes its row',async()=>{
  const f=await fixture({revalidate:async state=>{state.authority={...initial(),features:[{...feature,gameCandidates:[]}]};return state.snapshot();}});
  try{
    await flush(()=>button(f.view.container,'加入我的游戏').click());
    expect(content(f)).toContain('采用已完成，当前记录已变化');
    expect(content(f)).toContain(candidate.id);
    expect(f.view.container.querySelector('.ft-adoption-record')).toBeNull();
    expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
  }finally{await f.view.unmount();}
});

for(const scope of ['project','production'] as const)test(`same candidate ID in a different ${scope} has an independent intent and verification lock`,async()=>{
  const scopedCandidate={...otherCandidate,id:candidate.id,...(scope==='project'?{projectId:'other-game'}:{productionId:'other-production'})};
  const scopedFeature={...otherFeature,gameCandidates:[scopedCandidate]};
  const f=await fixture({features:[feature,scopedFeature],invoke:async(_name,input,state)=>{
    if(input.projectId===candidate.projectId&&input.productionId===candidate.productionId)throw new CommandOutcomeError('first scope receipt lost','scoped-command','ambiguous');
    const value={...scopedCandidate,status:'adopted',adoptionId:'scoped-adoption',adoptedAt:'2026-10-17'};
    state.setCandidate(value);return {candidate:value,adoptionId:value.adoptionId};
  },revalidate:async state=>{if(state.reads.length===1)throw Error('first scope read unavailable');return state.snapshot();}});
  try{
    await flush(()=>button(card(f),'加入我的游戏').click());
    expect(button(card(f),'加入我的游戏').disabled).toBe(true);
    expect(button(card(f,scopedFeature.title),'加入我的游戏').disabled).toBe(false);
    await flush(()=>twice(button(card(f,scopedFeature.title),'加入我的游戏')));
    expect(f.calls).toHaveLength(2);expect(f.calls.map(call=>call.input.candidateId)).toEqual([candidate.id,candidate.id]);
    expect(button(card(f),'加入我的游戏').disabled).toBe(true);
    expect(button(card(f,scopedFeature.title),'撤销采用').disabled).toBe(false);
    expect(content(f)).toContain('采用结果待核实');expect(f.reads).toEqual(['view','view']);
  }finally{await f.view.unmount();}
});

for(const status of ['failed','cancelled'] as const)for(const operation of ['archive','candidate'] as const)test(`${operation}: host ${status} before effects shows an ended failure and permits a new user intent`,async()=>{
  const f=await fixture({invoke:async(name,input,state)=>{
    if(state.calls.length===1)throw new CommandOutcomeError('provider did not start','not-started-command',status);
    if(name==='setArchiveStatus'){
      state.setArchive(input.archived,input.id);
      return {accepted:true,receiptVerified:true,receipt:{id:input.id,archived:input.archived,revision:'next-revision'},event:{status:'published',eventId:'next-event'}};
    }
    const value=adopted();state.setCandidate(value);return {candidate:value,adoptionId:value.adoptionId};
  }});
  try{
    const label=operation==='archive'?'归档':'加入我的游戏';
    await flush(()=>button(f.view.container,label).click());
    expect(content(f)).toContain(`${operation==='archive'?'归档':'采用'}未完成`);
    expect(content(f)).toContain('not-started-command');expect(content(f)).not.toContain('结果待核实');
    expect(content(f)).not.toContain('状态已核对');expect(f.calls).toHaveLength(1);
    expect(button(f.view.container,label).disabled).toBe(false);
    await flush();expect(f.calls).toHaveLength(1);
    await flush(()=>twice(button(f.view.container,label)));
    expect(f.calls).toHaveLength(2);expect(f.reads).toEqual(['view','view']);
    expect(content(f)).not.toContain('未完成');
    if(operation==='archive')expect(button(f.view.container,'已归档 (1)')).toBeDefined();
    else expect(button(f.view.container,'撤销采用').disabled).toBe(false);
  }finally{await f.view.unmount();}
});

for(const status of ['failed','cancelled'] as const)for(const operation of ['archive','candidate'] as const)test(`${operation}: ${status} receipt plus independently achieved state reports verification, never invocation success`,async()=>{
  const f=await fixture({invoke:async()=>{throw new CommandOutcomeError('provider did not start','not-executed-command',status);},revalidate:async state=>{
    if(operation==='archive')state.setArchive(true);else state.setCandidate(adopted());
    return state.snapshot();
  }});
  try{
    await flush(()=>button(f.view.container,operation==='archive'?'归档':'加入我的游戏').click());
    expect(content(f)).toContain('状态已核对');expect(content(f)).toContain('操作回执不可用');
    expect(content(f)).not.toContain('未完成');expect(content(f)).not.toContain('已保存归档');expect(content(f)).not.toContain('采用已完成');
    expect(f.calls).toHaveLength(1);expect(f.reads).toEqual(['view']);
  }finally{await f.view.unmount();}
});

for(const field of ['projectId','productionId','featureId','candidateHash','targetBaseRevision','validationManifest'] as const)test(`CardGame ambiguous candidate rejects fresh mismatched ${field}`,async()=>{
 const f=await fixture({invoke:async()=>{throw new CommandOutcomeError('receipt missing','identity-command','ambiguous');},revalidate:async state=>{
   state.authority={...initial(),features:[{...feature,gameCandidates:[{...adopted(),[field]:'different'}]}]};return state.snapshot();
 }});
 try{
  await flush(()=>button(f.view.container,'加入我的游戏').click());
  expect(content(f)).toContain('采用结果待核实');expect(content(f)).not.toContain('候选状态已核对');
  if(field==='projectId'||field==='productionId'){
   expect(button(f.view.container,'撤销采用').disabled).toBe(false); // A different scope is an independent target.
   await flush(()=>{f.setCandidate(candidate);f.publish();});
   expect(button(f.view.container,'加入我的游戏').disabled).toBe(true);
  }else{const pending=button(f.view.container,'撤销采用');expect(pending.disabled).toBe(true);await flush(()=>twice(pending));}
  expect(f.calls).toHaveLength(1);
  await flush(()=>{f.setCandidate(adopted());f.publish();});
  expect(button(f.view.container,'撤销采用').disabled).toBe(false);expect(f.calls).toHaveLength(1);
 }finally{await f.view.unmount();}
});
for(const operation of ['archive','candidate'] as const)test(`CardGame ${operation} targets run concurrently before either receipt returns`,async()=>{
 const one=deferred<any>(),two=deferred<any>();
 const f=await fixture({features:[feature,otherFeature],invoke:async(_name,input,state)=>{
  const first=(input.id||input.candidateId)===(operation==='archive'?feature.id:candidate.id);
  await (first?one.promise:two.promise);
  if(operation==='archive'){state.setArchive(input.archived,input.id);return {accepted:true,receiptVerified:true,receipt:{id:input.id,archived:input.archived,revision:'saved'},event:{status:'not-required'}};}
  const value={...(first?candidate:otherCandidate),status:'adopted',adoptionId:first?'one':'two'};state.setCandidate(value);return {candidate:value};
 }});
 try{
  const label=operation==='archive'?'归档':'加入我的游戏';
  await flush(()=>twice(button(card(f),label)));await flush(()=>twice(button(card(f,otherFeature.title),label)));
  expect(f.calls).toHaveLength(2);expect(f.reads).toEqual([]);expect(new Set(f.calls.map(call=>call.requestId)).size).toBe(2);
  await flush(()=>two.resolve({}));expect(f.calls).toHaveLength(2);expect(f.reads).toEqual(['view']);
  await flush(()=>one.resolve({}));expect(f.calls).toHaveLength(2);expect(f.reads).toEqual(['view','view']);
 }finally{await f.view.unmount();}
});

const changesConfig={projectId:'game',presentation:'changes',notes:{preview:'preview-note',production:'production-note'}};
const changeData=(state:any)=>({id:'change-one',projectId:'game',productionId:'production-one',featureId:'feature-one',title:'Synthetic game change',revision:7,requirementRevision:4,round:2,updatedAt:'2026-10-17',stage:'review',
 candidates:state.authority.features[0].gameCandidates.map((item:any)=>({...item,kind:'card',targetId:'CARD_1',current:true}))});
const gameResources=(name:string,_input:any,state:any)=>name==='changes'?{items:[changeData(state)],total:1}:name==='pinnedReferences'?{items:[{key:'pin-one',title:'Pinned candidate',kind:'candidate',revision:candidate.commit,freshness:'current'}],limit:8}
 :name==='candidateDiff'?{candidateId:candidate.id,commit:candidate.commit,baseCurrent:true,comparison:'current',files:[]}:undefined;
test('CardGame changes retains discussion, exact preview/production navigation and reference actions',async()=>{
 const f=await fixture({config:changesConfig,resourceData:gameResources});
 try{
  await flush(()=>button(f.view.container,'继续讨论').click());expect(f.calls.at(-1)).toMatchObject({name:'discussChange',input:{productionId:candidate.productionId}});
  expect(f.navigations.at(-1)).toEqual({kind:'session',args:['prepared-session']});
  await flush(()=>button(f.view.container,'试玩这个版本').click());
  let nav=f.navigations.at(-1);expect(nav.args[0]).toBe('preview-note');expect(JSON.parse(decodeURIComponent(nav.args[1].slice(3)))).toEqual({kind:'preview',id:candidate.id,revision:candidate.commit});
  await flush(()=>button(f.view.container,'查看制作过程').click());
  nav=f.navigations.at(-1);expect(nav.args[0]).toBe('production-note');expect(JSON.parse(decodeURIComponent(nav.args[1].slice(3)))).toEqual({projectId:candidate.projectId,kind:'production',id:candidate.productionId});
  await flush(()=>button(f.view.container,'固定候选').click());expect(f.calls.at(-1)).toMatchObject({name:'pinChangeReference',input:{productionId:candidate.productionId,revision:7,candidateId:candidate.id,commit:candidate.commit}});
  await flush(()=>button(f.view.container,'固定改动').click());expect(f.calls.at(-1)).toMatchObject({name:'pinChangeReference',input:{productionId:candidate.productionId,revision:7}});
  await flush(()=>button(f.view.container,'固定引用 1/8').click());
  await flush(()=>button(f.view.container,'移除固定引用 Pinned candidate').click());expect(f.calls.at(-1)).toMatchObject({name:'removePinnedReference',input:{key:'pin-one'}});
  expect(f.calls.some(call=>call.name==='confirmGameCandidate'||call.name==='undoGameCandidate')).toBe(false);
  await flush(()=>button(f.view.container,'关闭').click());
  await flush(()=>button(f.view.container,'功能与采用记录').click());expect(content(f)).toContain(feature.title);
  await flush(()=>button(f.view.container,'返回改动').click());expect(content(f)).toContain('Synthetic game change');
 }finally{await f.view.unmount();}
});
for(const result of ['accepted','ambiguous'] as const)test(`CardGame changes ${result} with failed read remains in dialog, blocked and recoverable`,async()=>{
 const f=await fixture({config:changesConfig,resourceData:gameResources,revalidate:async()=>{throw Error('read unavailable');},...(result==='ambiguous'?{invoke:async()=>{throw new CommandOutcomeError('receipt missing','change-command','ambiguous');}}:{})});
 try{
  await flush(()=>button(f.view.container,'加入游戏').click());
  await flush(()=>twice(button(f.view.container,'确认加入')));
  expect(f.calls).toHaveLength(1);expect(f.calls[0]).toMatchObject({name:'confirmGameCandidate',input:{projectId:candidate.projectId,productionId:candidate.productionId,candidateId:candidate.id,featureId:candidate.featureId,candidateHash:candidate.candidateHash,targetBaseRevision:candidate.targetBaseRevision,validationManifest:candidate.validationManifest}});
  const dialog=f.view.container.querySelector('dialog[aria-label="确认加入游戏"]')!;
  expect(dialog.textContent).toContain(result==='accepted'?'采用已完成，页面回读待刷新':'采用结果待核实');
  expect(button(dialog,'确认加入').disabled).toBe(true);expect(f.reads).toEqual(['view']);
  await flush(()=>button(dialog,'取消').click());expect(button(f.view.container,'加入游戏').disabled).toBe(true);
  await flush(()=>{f.setCandidate(adopted());f.publish();});
  await flush(()=>button(f.view.container,'刷新改动').click());
  expect(button(f.view.container,'撤销采用').disabled).toBe(false);expect(f.calls).toHaveLength(1);
 }finally{await f.view.unmount();}
});
