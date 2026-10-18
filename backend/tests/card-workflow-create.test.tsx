import {expect,mock,test} from 'bun:test';
import {Window} from 'happy-dom';
import {Activity,act} from 'react';
import {createRoot} from 'react-dom/client';
import {randomUUID} from 'node:crypto';
import {CommandOutcomeError} from '@dsh-workbench/runtime';
import {RuntimeProvider,NoteViewContext} from '@dsh-workbench/react/internal';
import {CreateCardWorkflow} from '../../notes/note-1/card-workflow-create';
import {createCardWorkflow} from '../../notes/note-1/actions';
import {createCardPipeline} from '../plugins/cardgame-content/src/card-pipeline';

const browser=new Window({url:'http://localhost/'});
for(const name of ['window','document','navigator','HTMLElement','SVGElement','Document','DocumentFragment','ShadowRoot','HTMLButtonElement','HTMLInputElement','Element','Node','NodeFilter','Event','CustomEvent','MouseEvent','KeyboardEvent','MutationObserver','ResizeObserver','getComputedStyle'] as const){
 const value=name==='window'?browser:name==='getComputedStyle'?browser.getComputedStyle.bind(browser):browser[name];Object.defineProperty(globalThis,name,{value,configurable:true,writable:true});
}
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true,requestAnimationFrame:browser.requestAnimationFrame.bind(browser),cancelAnimationFrame:browser.cancelAnimationFrame.bind(browser),CSS:browser.CSS,matchMedia:browser.matchMedia.bind(browser)});
const flush=async(fn?:()=>unknown)=>act(async()=>{await fn?.();});
function button(container:HTMLElement,text:string){const result=[...container.querySelectorAll<HTMLButtonElement>('button')].find(value=>value.textContent?.trim()===text);if(!result)throw Error(`Missing button ${text}: ${container.textContent}`);return result;}
async function fixture({unknown=false,wait=false,rejectFirst=false,waitNavigation=false}:{unknown?:boolean;wait?:boolean;rejectFirst?:boolean;waitNavigation?:boolean}={}){
 const records=new Map<string,any>();let creates=0,generation='generation-one',navigationFails=true;
 const inputs:any[]=[],receiptReads:any[]=[];let lastResult:any,receiptRecoverable=false;
 let finishNavigation!:()=>void;const navigationGate=waitNavigation?new Promise<void>(yes=>{finishNavigation=yes;}):Promise.resolve();
 const workflow:any={query:async({id}:any)=>{const production=records.get(id);if(!production)throw Object.assign(Error('missing'),{code:'not-found'});return {production};},command:async(name:string,input:any)=>{expect(name).toBe('upsertProduction');const production={id:input.id??randomUUID(),projectId:'project-one',revision:1,batch:input.batch};records.set(production.id,production);creates++;return {production};}};
 const pipeline=createCardPipeline({query:async({id}:any)=>({id,name:id,revision:'v1',json:{id,name:id,kind:'unit',cardFace:{}}})} as any,workflow);
 let finish!:()=>void;const gate=wait?new Promise<void>(yes=>{finish=yes;}):Promise.resolve();
 const invoke=mock(async(name:string,input:any,options:any)=>{
  expect(name).toBe('createCardWorkflow');inputs.push({...input,transportRequestId:options.requestId});await gate;
  if(rejectFirst&&inputs.length===1)throw new CommandOutcomeError('host rejected before effects',`command:${options.requestId}`,'failed');
  const result=await createCardWorkflow({note:{id:'cards',version:'v1',stateRef:'cards:state'},caller:{kind:'user',requestId:options.requestId},store:{read:async()=>({value:{projectId:'project-one',notes:{production:'production-note'}},revision:'config-one'})},extensions:{request:async(_extension:string,method:string,value:any)=>{expect(value.projectGeneration).toBe(generation);return pipeline.command(method,value);}}} as any,input);
  lastResult=result;if(unknown)throw Error('receipt lost after creation');return result;
 });
 const open=mock(async()=>{await navigationGate;if(navigationFails)throw Error('injected navigation failure');});
 let version=0;
 const snapshot=(data:any)=>({key:'query',epoch:'host',version:++version,data,stale:false});
 let statusListener:((value:any)=>void)|undefined;
 const runtime:any={note:{id:'cards'},invokeAction:invoke,openNote:open,resources:{subscribe:async(request:any,listener:any)=>{if(request.name==='status'){statusListener=listener;listener(snapshot({projectGeneration:generation}));return()=>{if(statusListener===listener)statusListener=undefined;};}listener(snapshot({value:{},revision:'c1'}));return()=>{};},revalidate:async(request:any)=>{if(request.name==='command'){receiptReads.push(request);return snapshot(receiptRecoverable?{status:'completed',result:lastResult}:{status:'ambiguous',error:'still unknown'});}return snapshot({projectGeneration:generation});}}};
 const container=document.createElement('div');document.body.append(container);const root=createRoot(container);
 const element=(ids=['card-one'],mode:'visible'|'hidden'='visible')=><RuntimeProvider runtime={runtime}><NoteViewContext.Provider value={{metadata:{id:'cards',name:'Cards'},mode:'expanded',layout:{width:800,maxHeight:600}}}><Activity mode={mode}><CreateCardWorkflow projectId="project-one" itemIds={ids} featureId="feature-one"/></Activity></NoteViewContext.Provider></RuntimeProvider>;
 await flush(()=>root.render(element()));
 return {container,invoke,open,inputs,records,receiptReads,element,finish,finishNavigation,recover(){receiptRecoverable=true;},get creates(){return creates;},success(){navigationFails=false;},async render(ids=['card-one']){await flush(()=>root.render(element(ids)));},async hide(){await flush(()=>root.render(element(['card-one'],'hidden')));},async remove(){await flush(()=>root.render(null));},async generation(value:string){generation=value;await flush(()=>statusListener?.(snapshot({projectGeneration:generation})));},async close(){await flush(()=>root.unmount());container.remove();}};
}

test('actual creation succeeds before navigation fails: repeated open and remount never create a second production',async()=>{
 const f=await fixture();
 try{
  await flush(()=>button(f.container,'制作卡面').click());expect(f.creates).toBe(1);expect(f.container.textContent).toContain('制作单已创建，打开失败');
  await flush(()=>button(f.container,'打开已创建制作单').click());expect(f.creates).toBe(1);expect(f.invoke).toHaveBeenCalledTimes(1);expect(f.open).toHaveBeenCalledTimes(2);
  const requestId=f.inputs[0].transportRequestId;expect([...f.records.values()][0].batch.creation.requestId).toBe(requestId);
  await f.remove();await f.render();await flush(()=>button(f.container,'打开已创建制作单').click());expect(f.creates).toBe(1);expect(f.invoke).toHaveBeenCalledTimes(1);
  f.success();await flush(()=>button(f.container,'打开已创建制作单').click());expect(f.container.textContent).toContain('制作卡面');expect(f.creates).toBe(1);
 }finally{await f.close();}
});

test('same-key concurrent clicks share creation; an explicit new production has a fresh stable business request',async()=>{
 const f=await fixture({wait:true});
 try{
  await flush(()=>{const target=button(f.container,'制作卡面');target.click();target.click();});expect(f.invoke).toHaveBeenCalledTimes(1);
  await flush(()=>f.finish());expect(f.creates).toBe(1);
  await flush(()=>button(f.container,'新建另一制作单').click());expect(f.creates).toBe(2);expect(f.inputs[1].transportRequestId).not.toBe(f.inputs[0].transportRequestId);
 }finally{await f.close();}
});

test('different selections and project generations cannot consume each other’s saved target',async()=>{
 const f=await fixture();
 try{
  await flush(()=>button(f.container,'制作卡面').click());await f.render(['card-two']);await flush(()=>button(f.container,'制作卡面').click());expect(f.creates).toBe(2);
  await f.render();await flush(()=>button(f.container,'打开已创建制作单').click());expect(f.creates).toBe(2);
  await f.generation('generation-two');await flush(()=>button(f.container,'制作卡面').click());expect(f.creates).toBe(3);expect(f.inputs[2].projectGeneration).toBe('generation-two');
 }finally{await f.close();}
});

test('an unknown post-create receipt stays locked through remount and never auto-replays',async()=>{
 const f=await fixture({unknown:true});
 try{
  await flush(()=>button(f.container,'制作卡面').click());expect(f.creates).toBe(1);expect(f.container.textContent).toContain('创建结果尚未确认');
  await f.remove();await f.render();await flush(()=>button(f.container,'核对创建结果').click());expect(f.invoke).toHaveBeenCalledTimes(1);expect(f.open).not.toHaveBeenCalled();expect(f.receiptReads).toHaveLength(1);
  f.recover();await flush(()=>button(f.container,'核对创建结果').click());expect(f.invoke).toHaveBeenCalledTimes(1);expect(f.creates).toBe(1);expect(f.open).toHaveBeenCalledTimes(1);expect(f.receiptReads).toHaveLength(2);
 }finally{await f.close();}
});

test('the actual note action forwards the stable host request ID into business creation deduplication',async()=>{
 const f=await fixture();
 try{
  const input={itemIds:['card-one'],featureId:'feature-one',projectGeneration:'generation-one'};
  const first=await f.invoke('createCardWorkflow',input,{requestId:'same-host-intent'});
  const second=await f.invoke('createCardWorkflow',input,{requestId:'same-host-intent'});
  expect(second).toEqual(first);expect(f.creates).toBe(1);expect([...f.records.values()][0].batch.creation.requestId).toBe('same-host-intent');
 }finally{await f.close();}
});


for(const change of ['unmount','selection','generation','hidden'] as const)test(`a late creation receipt cannot navigate after its ${change} owner retires`,async()=>{
 const f=await fixture({wait:true});
 try{
  await flush(()=>button(f.container,'制作卡面').click());expect(f.invoke).toHaveBeenCalledTimes(1);
  if(change==='unmount')await f.remove();else if(change==='hidden')await f.hide();else if(change==='selection')await f.render(['card-two']);else await f.generation('generation-two');
  // This fixture keeps business creation on its original project for the
  // lifecycle assertion; selection/unmount never cancel an admitted command.
  if(change==='generation')await f.generation('generation-one');
  await flush(()=>f.finish());expect(f.open).not.toHaveBeenCalled();
  await f.render();expect(f.container.textContent).toContain('打开已创建制作单');
  await flush(()=>button(f.container,'打开已创建制作单').click());expect(f.invoke).toHaveBeenCalledTimes(1);expect(f.open).toHaveBeenCalledTimes(1);
 }finally{await f.close();}
});

test('a late successful navigation cannot dismiss another selection owner’s saved receipt',async()=>{
 const f=await fixture({waitNavigation:true});f.success();
 try{
  await flush(()=>button(f.container,'制作卡面').click());expect(f.open).toHaveBeenCalledTimes(1);
  await f.render(['card-two']);await flush(()=>f.finishNavigation());
  await f.render();expect(f.container.textContent).toContain('打开已创建制作单');expect(f.invoke).toHaveBeenCalledTimes(1);
 }finally{await f.close();}
});

test('host rejection offers an explicit new-intent retry without locking the button forever',async()=>{
 const f=await fixture({rejectFirst:true});
 try{
  await flush(()=>button(f.container,'制作卡面').click());expect(f.creates).toBe(0);expect(f.container.textContent).toContain('创建未执行');
  await flush(()=>button(f.container,'重试创建').click());expect(f.creates).toBe(1);expect(f.invoke).toHaveBeenCalledTimes(2);expect(f.inputs[1].transportRequestId).not.toBe(f.inputs[0].transportRequestId);
 }finally{await f.close();}
});
