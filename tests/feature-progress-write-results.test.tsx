import {expect,test} from 'bun:test';
import {hostUiFixture,button,deferred,flush,mount,typeInto,until} from './host-ui-fixture';
import {OperationRejectedError} from '@dsh-workbench/runtime';
import * as actions from '../notes/note-6/actions';
const {View}=await import('../notes/note-6/view');

const candidate={id:'candidate-one',projectId:'game',productionId:'production-one',featureId:'feature-one',cardId:'CARD_1',commit:'d'.repeat(40),candidateHash:'a'.repeat(64),targetBaseRevision:'b'.repeat(64),validationManifest:'c'.repeat(64),status:'candidate',previewVerified:true};
const feature={id:'feature-one',title:'Synthetic feature',archived:false,autoArchived:false,totalPrs:0,mergedPrs:0,links:[],gameCandidates:[candidate]};
const initial=()=>({serverUrl:'https://example.invalid',status:'running',totalCount:1,activeCount:1,archivedCount:0,errors:[],features:[structuredClone(feature)]});
const adopted=()=>({...candidate,status:'adopted',adoptionId:'adoption-one',adoptedAt:'2026-10-17'});
const changesConfig={projectId:'game',presentation:'changes',notes:{preview:'preview-note',production:'production-note'}};
async function fixture(options:{wait?:boolean;eventError?:Error;badArchiveReceipt?:boolean;adopted?:boolean;failReadback?:boolean;rejectFirst?:boolean;candidate?:any;changes?:boolean}={}){
 let authority:any=initial();if(options.adopted)authority.features[0].gameCandidates=[adopted()];if(options.candidate)authority.features[0].gameCandidates=[options.candidate];
 const gate=deferred<void>();if(!options.wait)gate.resolve();
 const providerCalls:any[]=[],events:any[]=[];
 const change=()=>({id:'change-one',projectId:'game',productionId:'production-one',featureId:'feature-one',title:'Synthetic game change',revision:7,requirementRevision:4,round:2,updatedAt:'2026-10-17',stage:'review',candidates:authority.features[0].gameCandidates.map((item:any)=>({...item,kind:'card',targetId:'CARD_1',current:true}))});
 const f=await hostUiFixture({config:options.changes?changesConfig:{},query:(name)=>{
  if(name==='view'||name==='summary')return authority;
  if(name==='overview')return {summary:'1 项功能',items:[{id:feature.id,title:feature.title,status:'进行中'}]};
  if(name==='diagnostics')return {ci:{}};
  if(name==='projectChoices')return {items:[{id:'game',name:'Synthetic project'}]};
  if(name==='changes')return {items:[change()],total:1};
  if(name==='pinnedReferences')return {items:[{key:'pin-one',title:'Pinned candidate',kind:'candidate',revision:candidate.commit,freshness:'current'}],limit:8};
  if(name==='candidateDiff')return {candidateId:candidate.id,commit:candidate.commit,baseCurrent:true,comparison:'current',files:[]};
  throw Error('Unexpected feature query '+name);
 },execute:async(name,input,execution)=>{
  await gate.promise;
  if(options.rejectFirst&&f.calls.length===1)throw new OperationRejectedError('provider did not start');
  const ctx:any={note:{id:f.runtime.note.id,stateRef:'fixture'},store:{read:async()=>({value:{},revision:'0'})},caller:execution.caller,steps:execution.steps,
   extensions:{request:async(_provider:string,method:string,value:any)=>{
    providerCalls.push({method,input:structuredClone(value)});
    if(method==='archive'){
     authority={...authority,activeCount:value.archived?0:1,archivedCount:value.archived?1:0,features:authority.features.map((item:any)=>item.id===value.id?{...item,archived:value.archived}:item)};
     return options.badArchiveReceipt?null:{id:value.id,archived:value.archived,title:feature.title,revision:'archive-revision'};
    }
    if(method==='feature.save')return {id:value.id,revision:'created-revision',registered:true,record:{id:value.id,...value.patch}};
    const next=method==='confirmGameCandidate'?adopted():{...adopted(),status:'undone',undoneAt:'2026-10-17'};
    authority.features[0].gameCandidates=[next];return {candidate:next,adoptionId:next.adoptionId};
   }},events:{publish:async(...args:any[])=>{events.push(args);if(options.eventError)throw options.eventError;return {id:'archive-event'};}},
  };
  let result:unknown;
  if(['setArchiveStatus','confirmGameCandidate','undoGameCandidate','createFeature'].includes(name))result=await (actions as any)[name](ctx,input);
  else if(name==='discussChange')result={sessionId:'prepared-session'};
  else result={accepted:true};
  if(options.failReadback)f.failRead('view',Error('readback unavailable'));
  else await f.publish('view');
  return result;
 }});
 const view=await mount(f.render(<View/>));await until(()=>view.container.textContent?.includes(options.changes?'Synthetic game change':feature.title)===true);
 return {...f,view,gate,providerCalls,events,get authority(){return authority;},
  async close(){gate.resolve();await view.unmount();await f.close();}};
}
const content=(container:HTMLElement)=>{const clone=container.cloneNode(true) as HTMLElement;clone.querySelectorAll('style').forEach(item=>item.remove());return clone.textContent??'';};
const clickTwice=(control:HTMLButtonElement)=>{control.click();control.click();};

test('archive partial success preserves the committed receipt and separate failed notification without replay',async()=>{
 const f=await fixture({eventError:Error('synthetic event sink failure')});try{
  await flush(()=>clickTwice(button(f.view.container,'归档')));await until(()=>content(f.view.container).includes('归档已保存，通知状态：synthetic event sink failure'));
  expect(f.calls).toHaveLength(1);expect(f.providerCalls.map(call=>call.method)).toEqual(['archive']);expect(f.events).toHaveLength(1);
  await flush(()=>button(f.view.container,'已归档 (1)').click());expect(content(f.view.container)).toContain(feature.title);expect(button(f.view.container,'恢复').disabled).toBe(false);
  await flush(()=>button(f.view.container,'恢复').click());await until(()=>f.providerCalls.length===2);expect(f.providerCalls[1]!.input.archived).toBe(false);
 }finally{await f.close();}
});

test('archive without a usable domain receipt keeps its unverified business result visible',async()=>{
 const f=await fixture({badArchiveReceipt:true});try{
  await flush(()=>button(f.view.container,'归档').click());await until(()=>content(f.view.container).includes('台账修订未核对'));
  expect(f.calls).toHaveLength(1);expect(f.events).toHaveLength(0);expect(content(f.view.container)).not.toContain('归档已保存');
 }finally{await f.close();}
});

for(const operation of ['confirm','undo'] as const)test(`candidate ${operation} remains one frozen command through DOM replacement and failed readback`,async()=>{
 const f=await fixture({adopted:operation==='undo',wait:true,failReadback:true});try{
  if(operation==='undo')await flush(()=>button(f.view.container,'查看决策与记录 ▾').click());
  const label=operation==='confirm'?'加入我的游戏':'撤销采用';await flush(()=>clickTwice(button(f.view.container,label)));await until(()=>f.calls.length===1);
  expect(button(f.view.container,label).disabled).toBe(true);expect(f.calls[0]!.input).toMatchObject({candidateId:candidate.id,projectId:candidate.projectId,productionId:candidate.productionId,candidateHash:candidate.candidateHash,targetBaseRevision:candidate.targetBaseRevision,validationManifest:candidate.validationManifest,...(operation==='undo'?{adoptionId:'adoption-one'}:{})});
  await f.view.rerender(f.render(null));await flush(()=>f.gate.resolve());await f.view.rerender(f.render(<View/>));
  await until(()=>content(f.view.container).includes('readback unavailable'));expect(f.calls).toHaveLength(1);expect(f.opened).toHaveLength(0);
  f.failRead('view');await flush(()=>button(f.view.container,'核对 / 重新读取').click());await until(()=>!content(f.view.container).includes('readback unavailable'));
  expect(f.calls).toHaveLength(1);expect(f.providerCalls).toHaveLength(1);
 }finally{await f.close();}
});

test('confirmed before-effect rejection allows a new explicit candidate intent',async()=>{
 const f=await fixture({rejectFirst:true});try{
  await flush(()=>button(f.view.container,'加入我的游戏').click());await until(()=>content(f.view.container).includes('provider did not start'));
  await until(()=>!button(f.view.container,'加入我的游戏').disabled);expect(f.providerCalls).toHaveLength(0);
  await flush(()=>button(f.view.container,'加入我的游戏').click());await until(()=>f.providerCalls.length===1);
  expect(f.calls).toHaveLength(2);expect(f.calls[1]!.requestId).not.toBe(f.calls[0]!.requestId);
 }finally{await f.close();}
});

for(const field of ['projectId','productionId','featureId','candidateHash','targetBaseRevision','validationManifest'] as const)test(`candidate missing ${field} cannot be adopted by the actual UI`,async()=>{
 const f=await fixture({candidate:{...candidate,[field]:''}});try{
  expect(button(f.view.container,'加入我的游戏').disabled).toBe(true);await flush(()=>button(f.view.container,'加入我的游戏').click());expect(f.calls).toHaveLength(0);
 }finally{await f.close();}
});

test('new feature business input survives collapse, writes a stable ID, and waits for explicit viewing',async()=>{
 const f=await fixture();try{
  await flush(()=>button(f.view.container,'新建需求').click());
  const title=()=>f.view.container.querySelector('[placeholder="这次想完成什么？"]') as HTMLInputElement;
  const summary=()=>f.view.container.querySelector('[placeholder="描述结果、约束和验收方式"]') as HTMLTextAreaElement;
  await until(()=>!!title()&&!title().disabled);await typeInto(title(),'User requirement');await typeInto(summary(),'Preserve rule logic and acceptance');await flush(()=>button(f.view.container,'Synthetic project').click());
  await flush(()=>button(f.view.container,'收起新需求').click());await flush(()=>button(f.view.container,'新建需求').click());expect(title().value).toBe('User requirement');
  await flush(()=>button(f.view.container,'创建需求').click());await until(()=>content(f.view.container).includes('查看已创建需求'));
  expect(title().disabled).toBe(true);expect(f.calls[0]!.name).toBe('createFeature');expect(f.providerCalls[0]!.input.id).toBe(f.calls[0]!.requestId);expect(f.opened).toHaveLength(0);
  await flush(()=>button(f.view.container,'查看已创建需求').click());expect(f.calls).toHaveLength(1);
 }finally{await f.close();}
});

test('changes view keeps explicit discussion, exact navigation, and separate reference commands',async()=>{
 const f=await fixture({changes:true});try{
  await flush(()=>button(f.view.container,'继续讨论').click());await until(()=>content(f.view.container).includes('打开已准备的讨论会话'));
  expect(f.calls.at(-1)).toMatchObject({name:'discussChange',input:{productionId:candidate.productionId}});expect(f.opened).toHaveLength(0);
  await flush(()=>button(f.view.container,'打开已准备的讨论会话').click());expect(f.opened.at(-1)).toEqual({id:'prepared-session'});
  await flush(()=>button(f.view.container,'试玩这个版本').click());let nav=f.opened.at(-1)!;expect(nav.id).toBe('preview-note');expect(JSON.parse(decodeURIComponent(nav.focus!.slice(3)))).toEqual({kind:'preview',id:candidate.id,revision:candidate.commit});
  await flush(()=>button(f.view.container,'查看制作过程').click());nav=f.opened.at(-1)!;expect(nav.id).toBe('production-note');expect(JSON.parse(decodeURIComponent(nav.focus!.slice(3)))).toEqual({projectId:candidate.projectId,kind:'production',id:candidate.productionId});
  await flush(()=>button(f.view.container,'固定候选').click());await until(()=>f.calls.some(call=>call.name==='pinChangeReference'));expect(f.calls.at(-1)!.input).toMatchObject({productionId:candidate.productionId,revision:7,candidateId:candidate.id,commit:candidate.commit});
  expect(f.calls.some(call=>call.name==='confirmGameCandidate'||call.name==='undoGameCandidate')).toBe(false);
 }finally{await f.close();}
});
