/** All data is deterministic synthetic display data; no local project is read. */
export const fixedTime=Date.parse('2026-10-22T04:00:00Z');
const page=(items:any[],total=items.length)=>({items,total,revision:'fixture-r1'});
const cardNames=['霜月剑客','风林守望','赤炎灵狐','青莲药师','星河游龙'];
const colors=['#145c63','#345a9a','#994832','#71814a','#785c9f'];
const svg=(index:number)=>'data:image/svg+xml;base64,'+btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="750" height="1081"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${colors[index%5]}"/><stop offset="1" stop-color="#131b31"/></linearGradient></defs><rect width="750" height="1081" rx="36" fill="url(#g)"/><rect x="30" y="30" width="690" height="1021" rx="24" fill="none" stroke="#d7ba78" stroke-width="14"/><circle cx="375" cy="420" r="210" fill="#d5c9a3" opacity=".22"/><path d="M375 170L540 570L375 810L210 570Z" fill="none" stroke="#ebd9a1" stroke-width="12"/><circle cx="375" cy="490" r="80" fill="#f4e5b7" opacity=".8"/><rect x="120" y="880" width="510" height="14" rx="7" fill="#d5c9a3"/><rect x="205" y="920" width="340" height="10" rx="5" fill="#d5c9a3" opacity=".6"/></svg>`);
const cards=cardNames.map((name,i)=>({type:'card',id:`card-${i}`,name,title:name,kind:'unit',facePreview:`/cards/${i}.png`,revision:1,attack:2+i,health:4+i}));
const art=Array.from({length:6},(_,i)=>({type:'asset',id:`art-${i}`,name:`山河场景 ${i+1}`,kind:'image',mimeType:'image/png',version:1}));
const audio=['山门晨曲','战斗鼓点','剑鸣回声'].map((name,i)=>({type:'asset',id:`audio-${i}`,name,kind:'audio',mimeType:'audio/ogg',durationMs:[92500,14700,1800][i]}));
const todos=[{id:'a',title:'补齐卡牌伤害反馈',status:'in_progress',priority:'high',imageCount:2},{id:'b',title:'细化山门剧情分支',status:'todo',priority:'medium'},{id:'c',title:'校准新手牌组数值',status:'todo',priority:'low'},{id:'d',title:'完成首批音效资源',status:'done'},{id:'e',title:'验证完整试玩流程',status:'todo'}];
const tasks=['卡牌伤害表现','山门故事分支','音效资源检查'].map((title,i)=>({id:`task-${i}`,title,goal:title,sourceIdentity:`source-${i}`,source:{key:`source-${i}`,id:`source-${i}`,version:'1',revision:'1',value:{title},noteId:'todo',itemId:`todo-${i}`},scope:[],status:['running','paused','completed'][i],archived:false,continuationSeq:0,activeMs:0,approvalWaitMs:0,longWaitNotified:false,evidence:[],proposals:[],createdAt:fixedTime-1000*(i+1),updatedAt:fixedTime-1000*(i+1),owner:{sessionId:`session-${i}`,noteId:`worker-${i}`}}));
const candidates=['山门探索 · 第 2 版','战斗界面 · 第 1 版','卡牌动画 · 第 3 版'].map((title,i)=>({key:`preview-${i}`,title,featureId:`feature-${i}`,revision:`revision-${i}`,receivedAt:fixedTime-1000,surfaces:[{name:'web',url:`https://preview-${i}.example.invalid/`}],status:{web:{phase:i===2?'stopped':'ready',pass:`pass-${i}`,since:fixedTime-1000,updatedAt:fixedTime-1000,url:`https://preview-${i}.example.invalid/`,...(i===2?{}:{verified:{ok:true,checks:[],at:fixedTime-1000}})}}}));
const productions=[{id:'p1',brief:'山河主题卡牌 · 首批五张',status:'running',workflowKind:'card-generation',cardProgress:{done:3,total:5}},{id:'p2',brief:'山门场景与氛围插图',status:'completed'},{id:'p3',brief:'新手牌组的平衡调整',status:'draft',deckProgress:{distinctCards:12,totalCopies:24,targetSize:30}}];
const changes=['让卡牌受击更有层次','补齐分支故事的收束节点','调整新手牌组开场节奏'].map((title,i)=>({id:`change-${i}`,projectId:'fixture',productionId:`p${i+1}`,title,revision:2,requirementRevision:1,round:i+1,updatedAt:'2026-10-22T03:00:00Z',stage:['review','running','adopted'][i],candidates:[]}));
const preferences={query:'',views:{storySelection:'story-1',storyNodeSelection:{storyId:'story-1',nodeId:'path-a'},balanceMetricSelection:{kind:'unit',metric:'attack'}}};
const weather={forecastFor:{latitude:31.23,longitude:121.47,units:'metric'},status:'ok',fetchedAt:'2026-10-22T03:50:00Z',timezone:'Asia/Shanghai',utcOffsetSeconds:28800,current:{time:'2026-10-22T12:00',temperature:23,apparent:22,humidity:64,code:2,isDay:true,precipitation:0,windSpeed:12,windDirection:125,windGust:18,pressure:1015,cloudCover:36},hourly:Array.from({length:12},(_,i)=>({time:`2026-10-22T${String(12+i).padStart(2,'0')}:00`,temperature:23-Math.floor(i/3),code:i>5?3:2,precipProb:i*3,isDay:i<6,windSpeed:12})),daily:Array.from({length:7},(_,i)=>({date:`2026-10-${22+i}`,code:i%2?3:2,tMax:25-i,tMin:17-i,sunrise:`2026-10-${22+i}T06:00`,sunset:`2026-10-${22+i}T17:30`,uvMax:4,precipProbMax:i*7,windMax:15}))};
export function fixture(note:any,icon:any){
 const config={projectId:'fixture',notes:{cards:'note-1',todo:'note-11',execution:'note-2'},...note.initialConfig,...(note.key==='note-5'?{units:'metric',place:{name:'上海',admin1:'上海',country:'中国',latitude:31.23,longitude:121.47,timezone:'Asia/Shanghai'}}:{})};
 const state={...preferences,delegations:Object.fromEntries(tasks.map(t=>[t.id,t])),...note.initialState};
 if(note.key==='note-2')state.delegations=Object.fromEntries(tasks.map(t=>[t.id,t]));
 const reads:any[]=[],writes:string[]=[];
 return {config,state,metadata:{id:note.key,name:note.name,icon},layout:{width:note.layout.width,maxHeight:note.layout.height},reads,writes,read(name:string,input:any){
  if(name==='preferences')return preferences;
  if(name==='workspace')return {delegations:Object.fromEntries(tasks.map(t=>[t.id,t]))};
  if(name==='cards')return page(cards,48);
  if(name==='assets')return page(config.assetScope==='audio'?audio:art,config.assetScope==='audio'?12:28);
  if(name==='media'){const i=Number(String(input.id??input.path??'').match(/\d+/)?.[0]??0);return {url:svg(i),mimeType:'image/svg+xml'};}
  if(name==='gameCatalog')return input.kind==='story'?page([{id:'story-1',title:'山门初见',kind:'story'},{id:'story-2',title:'云海试炼',kind:'story'}]):page([],input.kind==='deck'?8:12);
  if(name==='storyAnalysis')return {id:'story-1',title:'山门初见',entry:'start',nodes:[{id:'start',title:'抵达山门'},{id:'path-a',title:'拜访药师'},{id:'path-b',title:'剑池试炼'},{id:'finish',title:'初入仙门'}],edges:[{id:'e1',from:'start',to:'path-a',text:'寻访'},{id:'e2',from:'start',to:'path-b',text:'试炼',conditional:true},{id:'e3',from:'path-a',to:'finish',text:'完成'},{id:'e4',from:'path-b',to:'finish',text:'完成'}],terminalIds:['finish']};
  if(name==='balanceOverview')return {cardCount:48,groups:[{kind:'unit',attack:{mean:4.2},health:{mean:6.8}}]};
  if(name==='battleExperiments')return {reports:[{id:'run-a'},{id:'run-b'}]};
  if(name==='state.summary')return {title:'候选预览',attached:[]};
  if(name==='candidates.page')return page(candidates);
  if(name==='projectBinding')return {configured:true,projectId:'fixture',projectGeneration:'generation-1'};
  if(name==='productions')return page(productions,7);
  if(name==='changes')return page(changes,9);
  if(name==='summary')return {features:[],total:0};
  if(name==='diagnostics')return {ci:{},syncing:false};
  if(name==='todos')return page(todos);
  if(name==='workflowStatus')return {counts:{todos:5,todo:3,inProgress:1,blocked:0,done:1}};
  if(name==='view'&&note.key==='note-5')return weather;
  throw Error(`Unexpected visual query ${note.key}: ${name}`);
 }};
}
