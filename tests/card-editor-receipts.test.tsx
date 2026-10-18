import {Activity,createElement,useState} from 'react';
import {expect,test} from 'bun:test';
import {join} from 'node:path';
import {CommandOutcomeError} from '@dsh-workbench/runtime';
import {encodeContentRef} from '../notes/note-1/content-model';
const worka=process.env.WORKA_SOURCE_ROOT;
if(!worka)throw Error('Set WORKA_SOURCE_ROOT to the checked-out SDK used for the build');
const {button,deferred,flush,mount}=await import(join(worka,'tests/web/dom-test-helpers.tsx'));
const {RuntimeProvider,NoteViewContext}=await import('@dsh-workbench/react/internal');
const surfaces={
  1:(await import('../notes/note-1/view-expanded')).default,
  7:(await import('../notes/note-7/view-expanded')).default,
  9:(await import('../notes/note-9/view-expanded')).default,
};
const target={noteId:'production-note',itemId:encodeContentRef({projectId:'game',kind:'production',id:'created-production'})};
type FixtureOptions={sourceUnavailable?:boolean;note?:1|7|9;lost?:boolean;wait?:boolean;checkpoints?:Map<string,any>;receipt?:unknown};
async function fixture(options:FixtureOptions={}){
  let version=0,generation='generation-A',shown=true,selectedId='card-one',receiptReady=false,sourceRevision='source-1',sourceUnavailable=options.sourceUnavailable??false;
  const checkpoints=options.checkpoints??new Map<string,any>(),calls:any[]=[],opens:any[]=[],receiptReads:any[]=[],sourceReads:any[]=[];
  const gate=deferred<void>();
  let tick=()=>{};
  const subscriptions=new Set<{request:any;listener:(value:any)=>void}>();
  const cards=['card-one','card-two'].map(id=>({id,name:id,type:'card',kind:'unit',rarity:'common',revision:sourceRevision,json:{id,cost:1}}));
  const config={projectId:'game',mode:'cards',notes:{production:'production-note'}};
  const data=(request:any)=>{
    if(request.name==='state')return {value:config,revision:'config'};
    if(request.name==='card')return {...cards.find(card=>card.id===request.input.id),revision:sourceRevision,projectGeneration:generation};
    if(request.name==='cards')return {items:sourceUnavailable?cards.filter(card=>card.id!=='card-one'):cards,revision:sourceRevision,total:cards.length,projectGeneration:generation};
    if(request.name==='featureChoices')return {items:[{id:'feature-one',title:'Feature one'},{id:'feature-two',title:'Feature two'}]};
    if(request.name==='status')return {projectGeneration:generation,projectId:'game',phase:'ready',documents:0,directories:0,cards:2,assets:0,errors:[]};
    return {items:[]};
  };
  const snapshot=(value:any)=>({key:'fixture',epoch:'host',version:++version,data:structuredClone(value),stale:false});
  const querySnapshot=(request:any)=>request.name==='card'&&sourceUnavailable?{key:'fixture',epoch:'host',version:++version,error:'source card unavailable',stale:true}:snapshot(data(request));
  const runtime:any={note:{id:'card-editor'},resources:{
    subscribe:async(request:any,listener:any)=>{const sub={request,listener};subscriptions.add(sub);listener(querySnapshot(request));return()=>subscriptions.delete(sub);},
    revalidate:async(request:any)=>{if(request.name==='command'){receiptReads.push(request);return snapshot(receiptReady?{status:'completed',result:options.receipt??target}:{status:'ambiguous',error:'creation still unknown'});}sourceReads.push(request);return snapshot(data(request));},
  },invokeAction:async(name:string,input:any,actionOptions:any)=>{
    if(name==='setViewState')return {value:{},revision:'view-2'};
    expect(name).toBe('createCardWorkflow');calls.push({name,input,options:actionOptions});
    if(options.wait)await gate.promise;
    if(options.lost)throw new CommandOutcomeError('creation receipt lost',`command:${actionOptions.requestId}`,'ambiguous');
    return options.receipt??target;
  },openNote:async(noteId:string,itemId:string)=>{opens.push({noteId,itemId});throw Error('navigation unavailable');}};
  const bridge:any={request:async(method:string,params:any)=>{
    if(method==='ui.draftRecover')return checkpoints.get(params.key)??null;
    if(method==='ui.draftCheckpoint'){checkpoints.set(params.key,structuredClone(params.checkpoint));return {accepted:true};}
    if(method==='ui.draftClear'){checkpoints.delete(params.key);return {accepted:true};}
    throw Error(method);
  }};
  function Frame(){const [,update]=useState(0);tick=()=>update(value=>value+1);return <RuntimeProvider runtime={runtime} bridge={bridge}><NoteViewContext.Provider value={{metadata:{id:'card-editor',name:'Cards'},mode:'expanded',layout:{width:900,maxHeight:700},focus:encodeContentRef({projectId:'game',kind:'card',id:selectedId}),snapshot:{value:{views:{cardsSelection:[selectedId]}},revision:'view-1'}}}><Activity mode={shown?'visible':'hidden'}>{createElement(surfaces[options.note??1])}</Activity></NoteViewContext.Provider></RuntimeProvider>;}
  const view=await mount(<Frame/>);
  return {view,calls,opens,receiptReads,sourceReads,checkpoints,gate,runtime,
    removeSource(){sourceUnavailable=true;for(const sub of subscriptions)sub.listener(querySnapshot(sub.request));},recover(){receiptReady=true;},hide(){shown=false;tick();},show(){shown=true;tick();},select(id:string){selectedId=id;tick();},
    publish(){for(const sub of subscriptions)sub.listener(querySnapshot(sub.request));},
    rebind(){generation='generation-B';for(const sub of subscriptions)sub.listener(querySnapshot(sub.request));},
    sourceChanges(){sourceRevision='source-2';for(const sub of subscriptions)sub.listener(querySnapshot(sub.request));},
  };
}
const field=(f:any)=>f.view.container.querySelector('[aria-label="卡牌原始 JSON"]') as HTMLTextAreaElement;
async function edit(f:any,text='{"id":"card-one","cost":7}',feature='feature-one'){
  await flush(()=>{Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')!.set!.call(field(f),text);field(f).dispatchEvent(new Event('input',{bubbles:true}));});
  expect(field(f).value).toBe(text);
  await chooseFeature(f,feature);
  expect(field(f).value).toBe(text);
}
async function chooseFeature(f:any,feature:string){await flush(()=>{const select=f.view.container.querySelector('[aria-label="所属功能"]') as HTMLSelectElement;select.value=feature;select.dispatchEvent(new Event('change',{bubbles:true}));});}
const save=(f:any)=>button(f.view.container,'保存到制作单').click();

for(const note of [1,7,9] as const)test(`note ${note} card JSON creation accepts its receipt without waiting for the unchanged source`,async()=>{
  const f=await fixture({note});try{
    await edit(f);await flush(()=>{save(f);save(f);});
    expect(f.calls).toHaveLength(1);expect(f.calls[0].input).toMatchObject({itemIds:['card-one'],featureId:'feature-one',draft:{id:'card-one',cost:7},expectedRevision:'source-1',projectGeneration:'generation-A'});
    expect(f.sourceReads).toHaveLength(0);expect(field(f).value).toBe('{"id":"card-one","cost":7}');
    expect(button(f.view.container,'保存到制作单').disabled).toBe(true);
    expect(f.view.container.textContent).toContain('制作单已保存，打开失败：navigation unavailable');
    await flush(()=>button(f.view.container,'打开已保存制作单').click());expect(f.calls).toHaveLength(1);expect(f.opens).toHaveLength(2);
    const saved=[...f.checkpoints.values()].find(checkpoint=>checkpoint.receipt);
    expect(saved.receipt.result).toEqual(target);expect(saved.uncertain).toBe(false);
  }finally{await f.view.unmount();}
});

test('accepted card target survives a frontend restart without replay or automatic navigation',async()=>{
  const first=await fixture();await edit(first);await flush(()=>save(first));const checkpoints=first.checkpoints;await first.view.unmount();
  const next=await fixture({checkpoints});try{
    expect(next.calls).toHaveLength(0);expect(next.opens).toHaveLength(0);expect(button(next.view.container,'保存到制作单').disabled).toBe(true);
    await flush(()=>button(next.view.container,'打开已保存制作单').click());expect(next.opens).toEqual([target]);expect(next.calls).toHaveLength(0);
  }finally{await next.view.unmount();}
});

test('lost card creation receipt recovers from host command status with its original feature after restart',async()=>{
  const first=await fixture({lost:true});await edit(first);await flush(()=>save(first));
  const checkpoints=first.checkpoints,requestId=first.calls[0].options.requestId;await first.view.unmount();
  const next=await fixture({checkpoints});try{
    expect(next.calls).toHaveLength(0);expect(field(next).value).toBe('{"id":"card-one","cost":7}');
    expect((next.view.container.querySelector('[aria-label="所属功能"]') as HTMLSelectElement).value).toBe('feature-one');
    await chooseFeature(next,'feature-two');await flush(()=>save(next));expect(next.calls).toHaveLength(0);expect(next.opens).toHaveLength(0);
    next.recover();await flush(()=>save(next));
    expect(next.calls).toHaveLength(0);expect(next.receiptReads.every(read=>read.input.executionId===`command:${requestId}`)).toBe(true);
    expect((next.view.container.querySelector('[aria-label="所属功能"]') as HTMLSelectElement).value).toBe('feature-two');
    expect(button(next.view.container,'打开已保存制作单')).toBeDefined();
  }finally{await next.view.unmount();}
});

for(const transition of ['hide','select','rebind'] as const)test(`late card receipt after ${transition} cannot navigate from the retired owner`,async()=>{
  const f=await fixture({wait:true});const priorConfirm=window.confirm;window.confirm=()=>true;
  try{
    await edit(f);await flush(()=>save(f));expect(f.calls).toHaveLength(1);
    await flush(()=>transition==='select'?f.select('card-two'):f[transition]());
    await flush(()=>f.gate.resolve());expect(f.opens).toHaveLength(0);expect(f.calls).toHaveLength(1);
    if(transition==='hide'){await flush(()=>f.show());expect(button(f.view.container,'打开已保存制作单')).toBeDefined();expect(f.opens).toHaveLength(0);}
  }finally{window.confirm=priorConfirm;f.gate.resolve();await f.view.unmount();}
});

test('feature selection remains available to the independent batch creation entry',async()=>{
  const f=await fixture();try{await chooseFeature(f,'feature-one');expect(button(f.view.container,'制作卡面').disabled).toBe(false);}finally{await f.view.unmount();}
});

for(const note of [1,7,9] as const)test(`note ${note} creation pins every source read and write to the selected directory generation`,async()=>{
  const {createCardWorkflow}=await import(`../notes/note-${note}/actions.ts`);
  const reads:any[]=[],writes:any[]=[];
  const ctx:any={note:{id:'cards',stateRef:'cards:state'},caller:{kind:'user',requestId:'request-one'},
    store:{read:async()=>({value:{projectId:'game',notes:{production:'production-note'}},revision:'config'})},
    resources:{read:async(request:any)=>{reads.push(request);return {key:'card',epoch:'fixture',version:1,data:{id:'card-one',name:'Card one',title:'Card one',path:'cards/one.json',type:'card',kind:'unit',revision:'source-1',json:{id:'card-one',cost:1}},stale:false};}},
    extensions:{request:async(_extension:string,method:string,input:any)=>{writes.push({method,input});return {production:{id:'created-production',projectId:'game',revision:method==='createCardBatch'?1:2}};}},
  };
  expect(await createCardWorkflow(ctx,{itemIds:['card-one'],featureId:'feature-one',draft:{id:'card-one',cost:7},expectedRevision:'source-1',projectGeneration:'generation-A'})).toEqual(target);
  expect(reads).toHaveLength(1);expect(reads[0].input.projectGeneration).toBe('generation-A');
  expect(writes.map(write=>write.method)).toEqual(['createCardBatch','saveCardDraft']);
  expect(writes.every(write=>write.input.projectGeneration==='generation-A')).toBe(true);
  expect(writes[0].input.sourceRevisions).toEqual({'card-one':'source-1'});
});

test('a newer source and newer local edit cannot turn a production receipt into a source-save conflict',async()=>{
  const f=await fixture({wait:true});try{
    await edit(f);await flush(()=>save(f));await flush(()=>f.sourceChanges());
    await edit(f,'{"id":"card-one","cost":9}','feature-two');
    await flush(()=>f.gate.resolve());
    expect(f.calls).toHaveLength(1);expect(f.calls[0].input.expectedRevision).toBe('source-1');
    expect(f.sourceReads).toHaveLength(0);expect(field(f).value).toBe('{"id":"card-one","cost":9}');
    expect((f.view.container.querySelector('[aria-label="所属功能"]') as HTMLSelectElement).value).toBe('feature-two');
    expect(button(f.view.container,'保存到制作单').disabled).toBe(false);expect(button(f.view.container,'打开已保存制作单')).toBeDefined();
  }finally{f.gate.resolve();await f.view.unmount();}
});

test('a wrong-project production receipt remains unresolved and never navigates or replays',async()=>{
  const f=await fixture({receipt:{noteId:'other-note',itemId:encodeContentRef({projectId:'other-project',kind:'production',id:'wrong-target'})}});try{
    await edit(f);await flush(()=>save(f));expect(f.calls).toHaveLength(1);expect(f.opens).toHaveLength(0);
    expect(f.view.container.textContent).toContain('制作单保存回执无效');
    f.recover();await flush(()=>save(f));expect(f.calls).toHaveLength(1);expect(f.receiptReads).toHaveLength(1);expect(f.opens).toHaveLength(0);
    expect(field(f).value).toBe('{"id":"card-one","cost":7}');
  }finally{await f.view.unmount();}
});


test('lost production receipt remains verifiable when its original card source becomes unavailable',async()=>{
  const f=await fixture({lost:true});try{
    await edit(f);await flush(()=>save(f));expect(f.calls).toHaveLength(1);
    await flush(()=>f.removeSource());expect(field(f).value).toBe('{"id":"card-one","cost":7}');
    f.recover();expect(button(f.view.container,'保存到制作单').disabled).toBe(false);await flush(()=>save(f));
    expect(f.calls).toHaveLength(1);expect(f.receiptReads).toHaveLength(1);expect(button(f.view.container,'打开已保存制作单')).toBeDefined();
  }finally{await f.view.unmount();}
});


test('a restarted interrupted creation exposes receipt verification after its source card was deleted',async()=>{
  const first=await fixture({lost:true});await edit(first);await flush(()=>save(first));const checkpoints=first.checkpoints;await first.view.unmount();
  const recovered=await fixture({checkpoints,sourceUnavailable:true});try{
    expect(field(recovered).value).toBe('{"id":"card-one","cost":7}');expect(recovered.view.container.textContent).toContain('卡牌来源暂不可用');
    recovered.recover();await flush(()=>save(recovered));expect(recovered.calls).toHaveLength(0);expect(recovered.receiptReads).toHaveLength(1);
    expect(button(recovered.view.container,'打开已保存制作单')).toBeDefined();
  }finally{await recovered.view.unmount();}
});
