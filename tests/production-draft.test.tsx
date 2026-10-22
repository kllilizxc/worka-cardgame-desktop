import {expect,test} from 'bun:test';
import {hostUiFixture,button,flush,mount,typeInto,until} from './host-ui-fixture';
import {requirementFields} from '../notes/note-4/requirement-draft';
import {updateProduction,rejectCandidate} from '../notes/note-4/actions';
const {default:View}=await import('../notes/note-4/view');

async function fixture(){
 let generation='binding-a',pageRevision='1',failure='';
 let production:any={id:'production',projectId:'p',brief:'original',revision:1,requirementRevision:1,status:'draft',rounds:[],candidateRefs:[]};
 const copies:string[]=[],writes:any[]=[];
 const f=await hostUiFixture({config:{selectedId:'production'},query:(name,input={})=>{
  if(name==='preferences')return {selectedId:'production'};
  if(name==='projectBinding')return {configured:true,projectId:'p',projectGeneration:generation};
  if(name==='overview')return {summary:'2 项制作请求',items:[{id:production.id,title:production.brief,status:production.status}]};
  if(input.projectGeneration&&input.projectGeneration!==generation)throw Error('项目绑定已变化');
  if(name==='productions')return {items:[input.cursor?{...production,id:'second-page',brief:'second page first item'}:production],...(input.cursor?{}:{next:'opaque-next'}),revision:pageRevision,total:2};
  if(name==='production')return {production};
  if(name==='productionEditInput')return {...requirementFields(production),productionId:input.productionId,projectId:'p',projectGeneration:generation,revision:production.revision};
  if(name==='productionCreateInput')return {...requirementFields(),projectId:'p',projectGeneration:generation};
  if(name==='cardRequestInput')return {brief:'',featureId:'',projectId:'p',projectGeneration:generation};
  if(name==='companionCreateInput')return {projectId:'p',projectGeneration:generation,unitId:'',sourceRevision:'',featureId:'',todoId:'',name:'',targetLabel:'',bonus:'3',brief:''};
  if(name==='candidateRejectInput')return {productionId:input.productionId,candidateId:input.candidateId,reason:'',revision:production.revision,projectGeneration:generation};
  if(name==='featureChoices')return {items:[]};
  if(name==='companionChoices')return {features:[],todos:[],units:[]};
  if(name==='media')return {url:'https://example.invalid/candidate.png',revision:'real-sha'};
  throw Error('Unexpected production query '+name);
 },execute:async(name,input,context)=>{
  if(failure)throw Error(failure);
  const ctx:any={note:{id:f.runtime.note.id,stateRef:'fixture'},store:{read:async()=>({value:{},revision:'config'})},caller:context.caller,steps:context.steps,
   extensions:{request:async(_extension:string,method:string,value:any)=>{
    writes.push({method,input:structuredClone(value)});
    if(value.projectGeneration!==generation)throw Error('项目绑定已变化');
    if(value.baseRevision!==production.revision)throw Error('revision conflict');
    production={...production,...value.patch,revision:production.revision+1};
    return {production,revision:production.revision};
   }}};
  if(name==='updateProduction')return updateProduction(ctx,input);
  if(name==='rejectCandidate')return rejectCandidate(ctx,input);
  return {status:'queued'};
 }});
 f.runtime.copyText=async(text:string)=>{copies.push(text);};
 const view=await mount(f.render(<View/>));
 const input=()=>view.container.querySelector('.cg-requirement-editor input') as HTMLInputElement|null;
 await until(()=>!!input()&&!input()!.disabled);
 return {...f,view,input,copies,writes,get production(){return production;},fail(value='command failed'){failure=value;},
  async update(){production={...production,brief:'server update',revision:production.revision+1};await f.publish('production');await f.publish('productionEditInput');},
  async changePageRevision(){pageRevision='2';await f.publish('productions');},
  async rebind(){generation='binding-b';await f.publish('projectBinding');},
  async candidate(revision='real-sha'){production={...production,candidateRefs:[{id:'candidate-id',revision}]};await f.publish('production');},
  async close(){await view.unmount();await f.close();}};
}

test('actual requirement input retains its original CAS after publication and remains pinned through rebind',async()=>{
 const f=await fixture();try{
  await typeInto(f.input()!,'unsaved requirement');await until(()=>!button(f.view.container,'保存需求').disabled);
  await flush(()=>f.update());expect(f.input()!.value).toBe('unsaved requirement');
  await flush(()=>button(f.view.container,'保存需求').click());await until(()=>f.view.container.textContent?.includes('revision conflict')===true);
  expect(f.writes[0].input.baseRevision).toBe(1);expect(f.input()!.value).toBe('unsaved requirement');
  await flush(()=>f.rebind());expect(f.view.container.textContent).toContain('原草稿仍保留');expect(f.input()!.value).toBe('unsaved requirement');
  await flush(()=>button(f.view.container,'读取当前项目').click());await until(()=>f.input()?.value==='server update');
  expect(f.calls).toHaveLength(1);expect(f.writes[0].input.projectGeneration).toBe('binding-a');
 }finally{await f.close();}
});

test('requirement draft survives complete expanded DOM replacement and needs explicit discard',async()=>{
 const f=await fixture();try{
  await typeInto(f.input()!,'durable requirement');await until(()=>!button(f.view.container,'保存需求').disabled);
  const original=f.input();await f.view.rerender(f.render(<View/>,'compact'));
  await until(()=>!f.view.container.querySelector('.cg-requirement-editor'));expect(!!f.view.container.querySelector('.cg-compact input,.cg-compact textarea,.cg-compact iframe')).toBe(false);
  await f.view.rerender(f.render(<View/>));await until(()=>f.input()?.value==='durable requirement');expect(f.input()).not.toBe(original);
  await flush(()=>button(f.view.container,'放弃输入').click());await flush(()=>button(f.view.container,'确认放弃').click());
  await until(()=>f.input()?.value==='original');expect(f.calls).toHaveLength(0);
 }finally{await f.close();}
});

test('production paging owns opaque cursors, resets on filter and snapshot changes, and keeps opened generation',async()=>{
 const f=await fixture();try{
  const list=()=>f.view.container.querySelector('.cg-expanded-list') as HTMLElement;
  expect(list().textContent).toContain('original');list().scrollTop=900;
  await flush(()=>button(f.view.container,'下一页（最多 100 项）').click());await until(()=>list().textContent?.includes('second page first item')===true);
  expect(list().textContent).not.toContain('original');expect(list().scrollTop).toBe(0);
  expect(f.reads.filter(r=>r.name==='productions').at(-1)!.input).toMatchObject({cursor:'opaque-next',projectGeneration:'binding-a'});
  await flush(()=>f.changePageRevision());await until(()=>list().textContent?.includes('original')===true);expect(f.view.container.textContent).toContain('第 1 页');
  await flush(()=>button(f.view.container,'下一页（最多 100 项）').click());
  await typeInto(f.view.container.querySelector('.cg-toolbar input') as HTMLInputElement,'changed filter');
  await until(()=>f.reads.filter(r=>r.name==='productions').at(-1)!.input.q==='changed filter');
  expect(f.reads.filter(r=>r.name==='productions').at(-1)!.input).not.toHaveProperty('cursor');
  await flush(()=>f.rebind());expect(f.reads.filter(r=>r.name==='productions').every(r=>r.input.projectGeneration==='binding-a')).toBe(true);expect(f.calls).toHaveLength(0);
 }finally{await f.close();}
});

test('candidate rejection opens its deferred draft, retains failed input, and copy uses verified resource facts',async()=>{
 const f=await fixture();try{
  await flush(()=>f.candidate());await until(()=>!!f.view.container.querySelector('.cg-candidate'));
  await flush(()=>button(f.view.container,'否决').click());
  const reason=()=>f.view.container.querySelector('[aria-label="否决原因"]') as HTMLInputElement;
  await until(()=>!!reason()&&!reason().disabled);await typeInto(reason(),'keep this explanation');
  f.fail();await flush(()=>button(f.view.container,'确认').click());await until(()=>f.view.container.textContent?.includes('command failed')===true);
  expect(reason().value).toBe('keep this explanation');expect(f.calls[0]!.input.reason).toBe('keep this explanation');
  await flush(()=>button(f.view.container,'取消').click());await flush(()=>button(f.view.container,'否决').click());expect(reason().value).toBe('keep this explanation');
  f.runtime.copyText=async()=>{throw Error('clipboard unavailable');};await flush(()=>button(f.view.container,'取消').click());await flush(()=>button(f.view.container,'复制候选引用').click());
  expect(f.view.container.textContent).toContain('clipboard unavailable');expect(f.view.container.textContent).not.toContain('候选引用已复制');
  f.runtime.copyText=async(text:string)=>{f.copies.push(text);};await flush(()=>button(f.view.container,'复制候选引用').click());
  expect(JSON.parse(f.copies[0]!)).toEqual({kind:'asset',projectId:'p',projectGeneration:'binding-a',id:'candidate-id',revision:'real-sha'});
  await flush(()=>f.candidate('unregistered-sha'));await flush(()=>button(f.view.container,'复制候选引用').click());
  expect(f.copies).toHaveLength(1);expect(f.view.container.textContent).toContain('候选版本尚未核验');
 }finally{await f.close();}
});
