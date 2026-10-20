import {expect,test} from 'bun:test';
import {hostUiFixture,button,deferred,flush,mount,typeInto,until} from './host-ui-fixture';
import {encodeContentRef} from '../notes/note-1/content-model';
import {createCardWorkflow} from '../notes/note-1/actions';
const {default:View}=await import('../notes/note-1/view-expanded');
const target={id:'production-note',focus:encodeContentRef({projectId:'game',kind:'production',id:'created-production'})};

async function fixture(options:{wait?:boolean}={}){
 let generation='generation-A',sourceRevision='source-1',sourceUnavailable=false,finished=0;
 const gate=deferred<void>(),writes:any[]=[];if(!options.wait)gate.resolve();
 const cards=['card-one','card-two'].map(id=>({id,name:id,title:id,path:'cards/one.json',type:'card',kind:'unit',rarity:'common',revision:sourceRevision,json:{id,cost:1}}));
 const card=(id:string)=>({...cards.find(card=>card.id===id)!,revision:sourceRevision,projectGeneration:generation});
 const config={projectId:'game',mode:'cards',notes:{production:'production-note'},views:{cardsSelection:['card-one']}};
 const context=(execution:any)=>({note:{id:'cards',stateRef:'cards:state'},caller:execution.caller,steps:execution.steps,
  store:{read:async()=>({value:config,revision:'config'})},resources:{read:async(request:any)=>({key:'card',epoch:'provider',version:1,data:card(request.input.id),stale:false})},
  extensions:{request:async(_extension:string,method:string,input:any)=>{
   if(input.projectGeneration!==generation)throw Error('项目绑定已变化');
   writes.push({method,input:structuredClone(input)});
   return {production:{id:'created-production',projectId:'game',revision:method==='createCardBatch'?1:2}};
  }},
 });
 const f=await hostUiFixture({config,query:(name,input={})=>{
  if(name==='preferences')return {views:{cardsSelection:['card-one']}};
  if((name==='card'||name==='cardEditInput')&&sourceUnavailable)throw Error('source card unavailable');
  if(name==='card')return card(input.id);
  if(name==='cardEditInput')return {text:JSON.stringify(card(input.id).json,null,2),featureId:'',itemId:input.id,projectId:'game',projectGeneration:generation,revision:sourceRevision};
  if(name==='cards')return {items:sourceUnavailable?cards.filter(card=>card.id!=='card-one'):cards,total:cards.length,revision:sourceRevision,projectGeneration:generation};
  if(name==='featureChoices')return {items:[{id:'feature-one',title:'Feature one'},{id:'feature-two',title:'Feature two'}]};
  if(name==='status')return {projectGeneration:generation,projectId:'game',phase:'ready',documents:0,directories:0,cards:2,assets:0,errors:[]};
  return {items:[]};
 },execute:async(name,input,execution)=>{expect(name).toBe('createCardWorkflow');await gate.promise;try{return await createCardWorkflow(context(execution) as any,input);}finally{finished++;}},openNote:async()=>{throw Error('navigation unavailable');}});
 const render=(selected='card-one')=>f.render(<View/>, 'expanded',encodeContentRef({projectId:'game',kind:'card',id:selected}));
 const view=await mount(render());
 const field=()=>view.container.querySelector('[aria-label="卡牌原始 JSON"]') as HTMLTextAreaElement|null;
 const feature=()=>view.container.querySelector('[aria-label="所属功能"]') as HTMLSelectElement;
 await until(()=>!!field()&&!feature()?.disabled);
 const edit=async(text='{"id":"card-one","cost":7}')=>{
  await typeInto(field()!,text);await flush(()=>{feature().value='feature-one';feature().dispatchEvent(new Event('change',{bubbles:true}));});
  await until(()=>!button(view.container,'保存到制作单').disabled);
 };
 return {...f,view,render,empty:()=>f.render(null),field,feature,edit,writes,gate,get finished(){return finished;},
  async changeSource(){sourceRevision='source-2';await f.publish('card');await f.publish('cards');await f.publish('cardEditInput');},
  async removeSource(){sourceUnavailable=true;await f.publish('card');await f.publish('cards');await f.publish('cardEditInput');},
  async rebind(){generation='generation-B';await f.publish('card');await f.publish('cards');await f.publish('status');},
  async close(){gate.resolve();await view.unmount();await f.close();}};
}

test('actual source-card editor freezes JSON and feature until receipt and uses its original domain version',async()=>{
 const f=await fixture({wait:true});try{
  await f.edit();await flush(()=>{button(f.view.container,'保存到制作单').click();button(f.view.container,'保存到制作单').click();});await until(()=>f.calls.length===1);
  expect(f.field()!.disabled).toBe(true);expect(f.feature().disabled).toBe(true);
  expect(f.calls[0]!.input).toMatchObject({itemIds:['card-one'],featureId:'feature-one',draft:{id:'card-one',cost:7},expectedRevision:'source-1',projectGeneration:'generation-A'});
  await flush(()=>f.gate.resolve());await until(()=>f.view.container.textContent?.includes('打开已保存制作单')===true);
  expect(f.writes.map(write=>write.method)).toEqual(['createCardBatch','saveCardDraft']);expect(f.opened).toHaveLength(0);
  expect(f.field()!.value).toBe('{"id":"card-one","cost":7}');expect(f.field()!.disabled).toBe(true);
  await flush(()=>button(f.view.container,'打开已保存制作单').click());expect(f.opened).toEqual([target]);expect(f.view.container.textContent).toContain('navigation unavailable');expect(f.calls).toHaveLength(1);
 }finally{await f.close();}
});

test('source-card JSON and feature survive DOM replacement before submit, and accepted result survives another replacement',async()=>{
 const f=await fixture();try{
  await f.edit();const original=f.field();await f.view.rerender(f.empty());await f.view.rerender(f.render());
  await until(()=>f.field()?.value==='{"id":"card-one","cost":7}');expect(f.field()).not.toBe(original);expect(f.feature().value).toBe('feature-one');
  await flush(()=>button(f.view.container,'保存到制作单').click());await until(()=>f.view.container.textContent?.includes('打开已保存制作单')===true);
  await f.view.rerender(f.empty());await f.view.rerender(f.render());await until(()=>f.view.container.textContent?.includes('打开已保存制作单')===true);
  expect(f.calls).toHaveLength(1);expect(f.opened).toHaveLength(0);await flush(()=>button(f.view.container,'打开已保存制作单').click());expect(f.calls).toHaveLength(1);
 }finally{await f.close();}
});

for(const change of ['selection','rebind'] as const)test(`late source-card receipt after ${change} does not navigate or retarget the frozen write`,async()=>{
 const f=await fixture({wait:true});try{
  await f.edit();await flush(()=>button(f.view.container,'保存到制作单').click());await until(()=>f.calls.length===1);
  if(change==='selection')await f.view.rerender(f.render('card-two'));else await flush(()=>f.rebind());
  await flush(()=>f.gate.resolve());await until(()=>f.finished===1);
  expect(f.opened).toHaveLength(0);expect(f.calls).toHaveLength(1);expect(f.calls[0]!.input.projectGeneration).toBe('generation-A');
  if(change==='selection'){await f.view.rerender(f.render());await until(()=>f.view.container.textContent?.includes('打开已保存制作单')===true);}
 }finally{await f.close();}
});

test('source updates never replace the dirty JSON baseline; explicit discard adopts the new source',async()=>{
 const f=await fixture();try{
  await f.edit();await flush(()=>f.changeSource());expect(f.field()!.value).toBe('{"id":"card-one","cost":7}');expect(f.feature().value).toBe('feature-one');
  await flush(()=>button(f.view.container,'放弃输入').click());await flush(()=>button(f.view.container,'确认放弃').click());
  await until(()=>f.feature().value==='');expect(JSON.parse(f.field()!.value)).toEqual({id:'card-one',cost:1});expect(f.calls).toHaveLength(0);
 }finally{await f.close();}
});
