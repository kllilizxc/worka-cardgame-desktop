import {expect,test} from 'bun:test';
import {hostUiFixture,button,deferred,flush,mount,typeInto,until} from './host-ui-fixture';
const {default:View}=await import('../notes/note-5/view');

test('weather modern root opens search on demand and preserves a selected-city command after collapse',async()=>{
 const gate=deferred<void>(),config:any={units:'metric'};
 const place={name:'Synthetic City',latitude:12,longitude:34,country:'Fixture'};
 const f=await hostUiFixture({config,query:(name,input)=>{
  if(name==='overview')return {summary:config.place?.name??'展开后选择天气城市',items:[]};
  if(name==='view')return {status:'empty',current:null,hourly:[],daily:[]};
  if(name==='searchPlaces'){expect(input.query).toBe('Synthetic');return {results:[place]};}
  throw Error('Unexpected weather query '+name);
 },execute:async(name,input)=>{
  expect(name).toBe('usePlace');await gate.promise;config.place={...input.place,source:'search'};
  await f.publish('state');await f.publish('view');await f.publish('overview');
  return {value:config,revision:'config-2'};
 }});
 const render=(mode:'compact'|'expanded')=>f.render(<View/>,mode);
 const view=await mount(render('compact'));
 try{
  await until(()=>!!view.container.querySelector('.note-overview'));
  expect(f.reads.some(read=>read.name==='view'||read.name==='searchPlaces')).toBe(false);
  expect(!!view.container.querySelector('button,input,textarea,iframe')).toBe(false);
  await view.rerender(render('expanded'));await until(()=>!!view.container.querySelector('.wx-search input'));
  const original=view.container.querySelector('.wx-search input') as HTMLInputElement;
  await typeInto(original,'Synthetic');await flush(()=>button(view.container,'搜索').click());
  await until(()=>!!view.container.querySelector('.wx-results'));expect(f.calls).toHaveLength(0);
  await flush(()=>{button(view.container,'使用').click();button(view.container,'使用').click();});await until(()=>f.calls.length===1);
  await view.rerender(render('compact'));await until(()=>!view.container.querySelector('.wx-search'));
  await flush(()=>gate.resolve());await until(()=>view.container.textContent?.includes('Synthetic City')===true);
  await view.rerender(render('expanded'));await until(()=>!!view.container.querySelector('.wx'));
  expect(view.container.textContent).toContain('Synthetic City');expect(original.isConnected).toBe(false);
  expect(f.calls).toHaveLength(1);expect(f.calls[0]!.input).toEqual({place});
 }finally{gate.resolve();await view.unmount();await f.close();}
},20000);
