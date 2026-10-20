import {expect,test} from 'bun:test';
import {hostUiFixture,button,deferred,flush,mount,until} from '../../tests/host-ui-fixture';
import {randomUUID} from 'node:crypto';
import {OperationRejectedError} from '@dsh-workbench/runtime';
import {createCardWorkflow} from '../../notes/note-1/actions';
import {createCardPipeline} from '../plugins/cardgame-content/src/card-pipeline';
const {CreateCardWorkflow}=await import('../../notes/note-1/card-workflow-create');

async function fixture(options:{wait?:boolean;rejectFirst?:boolean}={}){
 const records=new Map<string,any>(),gate=deferred<void>();
 let creates=0,generation='generation-one',navigationFails=true;
 if(!options.wait)gate.resolve();
 const workflow:any={query:async({id}:any)=>{const production=records.get(id);if(!production)throw Object.assign(Error('missing'),{code:'not-found'});return {production};},command:async(name:string,input:any)=>{
  expect(name).toBe('upsertProduction');const production={id:input.id??randomUUID(),projectId:'project-one',revision:1,batch:input.batch};records.set(production.id,production);creates++;return {production};
 }};
 const pipeline=createCardPipeline({query:async({id}:any)=>({id,name:id,revision:'v1',json:{id,name:id,kind:'unit',cardFace:{}}})} as any,workflow);
 const f=await hostUiFixture({config:{projectId:'project-one',notes:{production:'production-note'}},query:(name)=>{
  if(name==='status')return {projectGeneration:generation};throw Error('Unexpected query '+name);
 },execute:async(name,input,context)=>{
  expect(name).toBe('createCardWorkflow');await gate.promise;
  if(options.rejectFirst&&f.calls.length===1)throw new OperationRejectedError('provider rejected before effects');
  return createCardWorkflow({note:{id:'cards',version:'v1',stateRef:'cards:state'},caller:context.caller,steps:context.steps,
   store:{read:async()=>({value:{projectId:'project-one',notes:{production:'production-note'}},revision:'config-one'})},
   extensions:{request:async(_extension:string,method:string,value:any)=>{if(value.projectGeneration!==generation)throw Error('项目绑定已变化');return pipeline.command(method,value);}},
  } as any,input);
 },openNote:async()=>{if(navigationFails)throw Error('injected navigation failure');}});
 const element=(ids=['card-one'])=>f.render(<CreateCardWorkflow projectId="project-one" itemIds={ids} featureId="feature-one"/>);
 const view=await mount(element());await until(()=>!button(view.container,'制作卡面').disabled);
 return {...f,view,records,gate,element,get creates(){return creates;},navigationWorks(){navigationFails=false;},async rebind(value:string){generation=value;await f.publish('status');},
  async close(){gate.resolve();await view.unmount();await f.close();}};
}
const saved=(container:HTMLElement)=>container.textContent?.includes('打开已创建制作单')===true;

test('actual card batch creation commits before explicit navigation; repeated open and DOM replacement never replay',async()=>{
 const f=await fixture();try{
  await flush(()=>button(f.view.container,'制作卡面').click());await until(()=>saved(f.view.container));
  expect(f.creates).toBe(1);expect(f.opened).toHaveLength(0);
  expect([...f.records.values()][0].batch.creation.requestId).toBe(f.calls[0]!.requestId);
  await flush(()=>button(f.view.container,'打开已创建制作单').click());expect(f.view.container.textContent).toContain('injected navigation failure');
  await f.view.rerender(f.render(null));await f.view.rerender(f.element());await until(()=>saved(f.view.container));
  await flush(()=>button(f.view.container,'打开已创建制作单').click());expect(f.calls).toHaveLength(1);expect(f.opened).toHaveLength(2);
  f.navigationWorks();await flush(()=>button(f.view.container,'打开已创建制作单').click());expect(f.creates).toBe(1);
 }finally{await f.close();}
});

test('same-key concurrent creation shares one business intent; explicit new creation obtains a new intent',async()=>{
 const f=await fixture({wait:true});try{
  await flush(()=>{const control=button(f.view.container,'制作卡面');control.click();control.click();});await until(()=>f.calls.length===1);expect(f.creates).toBe(0);
  await flush(()=>f.gate.resolve());await until(()=>saved(f.view.container));expect(f.creates).toBe(1);
  await flush(()=>button(f.view.container,'清除提示').click());await until(()=>!button(f.view.container,'制作卡面').disabled);
  await flush(()=>button(f.view.container,'制作卡面').click());await until(()=>f.creates===2);
  expect(f.calls[1]!.requestId).not.toBe(f.calls[0]!.requestId);
 }finally{await f.close();}
});

test('different selections and project generations never consume another saved target',async()=>{
 const f=await fixture();try{
  await flush(()=>button(f.view.container,'制作卡面').click());await until(()=>saved(f.view.container));
  await f.view.rerender(f.element(['card-two']));await until(()=>!button(f.view.container,'制作卡面').disabled);
  await flush(()=>button(f.view.container,'制作卡面').click());await until(()=>f.creates===2);
  await f.view.rerender(f.element());await until(()=>saved(f.view.container));expect(f.creates).toBe(2);
  await flush(()=>f.rebind('generation-two'));await until(()=>!button(f.view.container,'制作卡面').disabled);
  await flush(()=>button(f.view.container,'制作卡面').click());await until(()=>f.creates===3);expect(f.calls[2]!.input.projectGeneration).toBe('generation-two');
 }finally{await f.close();}
});

for(const change of ['unmount','selection'] as const)test(`late creation after ${change} remains available without automatic navigation`,async()=>{
 const f=await fixture({wait:true});try{
  await flush(()=>button(f.view.container,'制作卡面').click());await until(()=>f.calls.length===1);
  await f.view.rerender(change==='unmount'?f.render(null):f.element(['card-two']));
  await flush(()=>f.gate.resolve());await until(()=>f.creates===1);expect(f.opened).toHaveLength(0);
  await f.view.rerender(f.element());await until(()=>saved(f.view.container));await flush(()=>button(f.view.container,'打开已创建制作单').click());
  expect(f.calls).toHaveLength(1);expect(f.opened).toHaveLength(1);
 }finally{await f.close();}
});

test('a known provider rejection permits a later explicit creation without reusing the failed intent',async()=>{
 const f=await fixture({rejectFirst:true});try{
  await flush(()=>button(f.view.container,'制作卡面').click());await until(()=>f.view.container.textContent?.includes('provider rejected')===true);
  expect(f.creates).toBe(0);expect(button(f.view.container,'制作卡面').disabled).toBe(false);
  await flush(()=>button(f.view.container,'制作卡面').click());await until(()=>f.creates===1);expect(f.calls).toHaveLength(2);expect(f.calls[1]!.requestId).not.toBe(f.calls[0]!.requestId);
 }finally{await f.close();}
});
