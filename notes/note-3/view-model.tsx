import {NoteIcon,composeQueries,QueryState} from '@dsh-workbench/react';
import {useNote,useMutation,useViewState} from '@dsh-workbench/react';
import {MutationNotice} from './mutation-notice';
import {Button} from '@heroui/react';
import {previewRows as hostRows,rowState} from './projection';
import type {SurfaceDisplay} from './model';
type PreviewTask={id:string;label:string;surfaces:string[];status:'pending'|'running'|'completed'|'failed'|'unknown'|'skipped';error?:string};
import type {PreviewProgress} from '@dsh-workbench/runtime';
import {useEffect,useRef,useState} from 'react';


import type {CandidateDisplay,DisplayData} from './model';

export const STATUS:Record<string,string>={repairing:'自动修复中',waiting:'需要你处理',stopFailed:'停止失败',checking:'检查中',unchecked:'已启动，未核验',verificationFailed:'检查失败',unverified:'版本待核验',blocked:'依赖阻塞',stale:'版本待更新',declared:'待启动',ready:'可预览',starting:'启动中',stopped:'已停止',stopping:'停止中',failed:'启动失败',unknown:'需要核对',disconnected:'待启动'};
export const TONE:Record<string,string>={repairing:'var(--wb-accent)',waiting:'var(--wb-warning)',checking:'var(--wb-accent)',unchecked:'var(--wb-warning)',verificationFailed:'var(--wb-danger)',unverified:'var(--wb-warning)',blocked:'var(--wb-danger)',stale:'var(--wb-warning)',declared:'var(--wb-warning)',ready:'var(--wb-success)',starting:'var(--wb-accent)',stopped:'var(--wb-muted-light)',stopping:'var(--wb-muted-light)',failed:'var(--wb-danger)',unknown:'var(--wb-warning)',disconnected:'var(--wb-muted-light)'};
const TONE_BG:Record<string,string>={repairing:'var(--wb-accent-pale)',waiting:'var(--wb-warning-pale)',checking:'var(--wb-accent-pale)',unchecked:'var(--wb-warning-pale)',verificationFailed:'var(--wb-danger-pale)',unverified:'var(--wb-warning-pale)',blocked:'var(--wb-danger-pale)',stale:'var(--wb-warning-pale)',declared:'var(--wb-surface-deep)',ready:'var(--wb-success-pale)',starting:'var(--wb-accent-pale)',stopped:'var(--wb-surface-deep)',stopping:'var(--wb-surface-deep)',failed:'var(--wb-danger-pale)',unknown:'var(--wb-warning-pale)',disconnected:'var(--wb-surface-deep)'};
/** Matches the workbench shell so the note does not look like a foreign panel. */
export const FONT='var(--wb-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif)';
export const MONO='ui-monospace, SFMono-Regular, Menlo, monospace';
export const DEVICES=[
  {key:'desktop',label:'desktop',maxWidth:'none'},
  {key:'phone',label:'phone',maxWidth:'390px'},
  {key:'pad',label:'pad',maxWidth:'768px'},
] as const;
type DeviceKey=typeof DEVICES[number]['key'];

type PendingOperation={status:string;startedAt:number;operationId?:string};
type Row={operationId?:string;activeOperation?:boolean;tasks?:PreviewTask[];diagnostics?:{stage?:string;log?:string};logPath?:string;startedAt?:number;progress?:PreviewProgress;feedback?:{state:string;summary?:string;checkedAt?:number};surface?:string;spec:CandidateDisplay;owner:CandidateDisplay;name:string;group:string;groupName:string;status:string;url:string;error?:string;live:boolean;host?:SurfaceDisplay};

/** A deep link must never silently fall back to another candidate/version. */
export function selectPreviewRow(rows: Row[], activeKey?: string, focus?: string | null): Row | undefined {
  if (activeKey) return rows.find(row => row.spec.key === activeKey);
  if (!focus) return rows[0];
  try {
    if(focus.startsWith('preview:')){const [key,surface]=JSON.parse(decodeURIComponent(focus.slice(8)));return rows.find(row=>row.owner.key===key&&(!surface||row.surface===surface));}
    if (!focus.startsWith('cg:')) return rows.find(row=>row.spec.key===focus||row.owner.key===focus);
    const ref = JSON.parse(decodeURIComponent(focus.slice(3)));
    if (ref.kind !== 'preview' || typeof ref.id !== 'string' || typeof ref.revision !== 'string') return undefined;
    return rows.find(row => row.owner.key === ref.id && (row.owner.repos?.game?.commit ?? row.owner.revision) === ref.revision);
  } catch { return undefined; }
}

export function previewWantsVersions(focus?: string | null): boolean {
  if (!focus?.startsWith('cg:')) return false;
  try { const ref = JSON.parse(decodeURIComponent(focus.slice(3))); return ref.kind === 'preview' && ref.intent === 'versions'; }
  catch { return false; }
}

function surfaceName(name:string, candidate:CandidateDisplay):string{
  const commit=candidate.repos?.game?.commit;
  return commit&&/^[0-9a-f]{40}$/i.test(commit)?`${name} · ${commit.slice(0,8)}`:name;
}

/** Rows render the host's status as-is; the view never infers process state. */
export function previewRows(data:DisplayData,pending:Record<string,PendingOperation>={}):Row[]{
  return hostRows(data).map(row=>{
    const host=row.status;const owner=row.candidate;
    const local=pending[owner.key];
    const awaiting=Boolean(local&&(!host||host.updatedAt<local.startedAt));
    const live=Boolean(host&&(host.phase==='ready'||host.phase==='verifying'||host.phase==='failed'&&host.failure?.step==='verify'));
    const known=owner.surfaces?.find(s=>s.name===row.surface);
    return {
      spec:{...owner,key:row.surface?`${owner.key}:${row.surface}`:owner.key},owner,surface:row.surface||undefined,name:surfaceName(known?.title||row.name,owner),host,
      group:owner.featureId||`${owner.originNoteId??''}:${owner.delegationId||owner.key}`,
      groupName:owner.title?.replace(/\s*[（(]适配器[：:].*$/,'').replace(/\s+四端预览$/,'')||owner.featureId||'未关联需求',
      status:awaiting?local.status:rowState(row),url:row.url??'',live,
      tasks:(Array.isArray(host?.steps)?host.steps:undefined)?.map(step=>({id:step.id,label:step.label,surfaces:[row.surface],status:step.state,error:step.detail})),
      progress:host?.message?{stage:host.phase,message:host.message,receivedAt:host.updatedAt,stageStartedAt:host.since}:undefined,
      startedAt:host?.since,error:host?.failure?.message,
      diagnostics:host?.failure?{stage:host.failure.step,log:typeof host.failure.log==='string'?host.failure.log:undefined}:undefined,
      logPath:host?.logDir,
      feedback:host?.failure?{state:host.failure.handling,summary:host.failure.handlingNote,checkedAt:host.failure.at}:undefined,
      activeOperation:awaiting||Boolean(host&&['queued','preparing','starting','verifying','stopping'].includes(host.phase)),
      operationId:host?.pass,
    };
  });
}

export function feedbackLabel(state:string){
  return ({'awaiting-approval':'等待你确认交给 Agent 修复',retrying:'Worka 正在自动重试',agent:'已交给 Agent 修复','agent-done':'修复任务已结束','waiting-user':'需要你处理后重新启动',exhausted:'自动修复已用完，需要你查看',pending:'正在将失败交回执行台',delivered:'执行台已收到失败反馈',queued:'执行台已接手，等待当前轮结束后处理',running:'执行台正在处理预览问题',paused:'原任务已暂停，反馈已保留', 'needs-input':'等待手动重试或授权 Agent 修复',completed:'执行台已结束本轮，预览仍未通过',unreceived:'尚未确认执行台收到反馈',unknown:'暂时无法获取执行台处理状态'} as Record<string,string>)[state]??'执行台已收到反馈';
}

export function canViewPreview(status:string){return ['ready','unchecked','verificationFailed'].includes(status);}

export function featureStatus(rows:Row[],operations:Record<string,PendingOperation>={}):string{
  const operation=rows.map(row=>operations[row.owner.key]).find(Boolean);
  if(operation)return operation.status;
  const statuses=new Set(rows.map(row=>row.status));
  return ['starting','checking','stopping','repairing','waiting','failed','verificationFailed','ready','unchecked','stopped']
    .find(status=>statuses.has(status))??'stopped';
}

/** Compact lists show what is running or needs attention before stopped candidates. */
export function compactRank(rows:{status:string}[]):number{
  if(rows.some(row=>['starting','checking','stopping','repairing'].includes(row.status)))return 0;
  if(rows.some(row=>canViewPreview(row.status)))return 1;
  if(rows.some(row=>['waiting','failed'].includes(row.status)))return 2;
  return 3;
}

export function featureTitle(value:string):string{
  return value.replace(/\s*[·•]\s*todo-[^\s]+.*$/i,'').replace(/\s+todo-[^\s]+.*$/i,'').trim()||value;
}

export function navigationUrl(value:string,base:string){
  const url=new URL(value,base);
  if(!['http:','https:'].includes(url.protocol))throw Error('请输入 http 或 https 地址');
  return url.href;
}


export const GLYPH={
  play:'M8 5.5v13l11-6.5z',
  stop:'M7 7h10v10H7z',
  reload:'M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5',
  external:'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  link:'M10.5 13.5a4 4 0 0 0 5.7 0l2.3-2.3a4 4 0 0 0-5.7-5.7l-1 1M13.5 10.5a4 4 0 0 0-5.7 0l-2.3 2.3a4 4 0 0 0 5.7 5.7l1-1',
  close:'M6 6l12 12M18 6L6 18',
  fullscreen:'M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5',
  more:'M5 12h.01M12 12h.01M19 12h.01',
  deviceDesktop:'M4 5h16v11H4zM8 20h8M12 16v4',
  devicePhone:'M8 3.5h8v17H8zM11 17.5h2',
  devicePad:'M5 3.5h14v17H5zM11 17.5h2',
  refresh:'M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5',
  warning:'M12 3.5 21 19H3zM12 9v4.5M12 16.5h.01',
} as const;

export function Glyph({path,size=15,filled=false}:{path:string;size?:number;filled?:boolean}){
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{display:'block'}}
    fill={filled?'currentColor':'none'} stroke={filled?'none':'currentColor'} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d={path}/>
  </svg>;
}

export function TransportButton({path,filled,label,primary,onClick,disabled,loading}:{path:string;filled?:boolean;label:string;primary?:boolean;onClick:()=>void;disabled?:boolean;loading?:boolean}){
  return <Button variant="tertiary" size="sm" type="button" className={`preview-transport-button${primary?' preview-transport-primary':''}`} aria-label={label} isDisabled={disabled} onClick={onClick}
    style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:primary?36:32,height:primary?36:32,borderRadius:primary?18:16,border:0,background:primary?'var(--wb-accent)':'var(--wb-surface)',color:primary?'var(--wb-accent-foreground)':disabled?'var(--wb-muted-light)':'var(--wb-ink-soft)',cursor:disabled?'default':'pointer',padding:0,fontFamily:'inherit',flexShrink:0}}>
    <span className={loading?'preview-spinner':undefined}><Glyph path={loading?GLYPH.reload:path} filled={!loading&&filled} size={primary?16:14}/></span>
  </Button>;
}

export function DeviceSwitcher({device,onClick}:{device:DeviceKey;onClick:()=>void}){
  const current=DEVICES.find(item=>item.key===device)??DEVICES[0];
  const next=DEVICES[(DEVICES.findIndex(item=>item.key===current.key)+1)%DEVICES.length];
  const icon=current.key==='desktop'?GLYPH.deviceDesktop:current.key==='phone'?GLYPH.devicePhone:GLYPH.devicePad;
  const label=`切换设备：当前 ${current.label}，点击切换到 ${next.label}`;
  return <Button variant="tertiary" size="sm" type="button" className="preview-transport-button preview-device-switcher" aria-label={label} onClick={onClick}
    style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:32,height:32,border:0,borderRadius:16,background:'var(--wb-surface)',color:'var(--wb-ink-soft)',cursor:'pointer',padding:0,fontFamily:'inherit',flexShrink:0}}>
    <Glyph path={icon} size={14}/>
  </Button>;
}

export function PreviewLoading({progress,status,startedAt,tasks}:{progress?:PreviewProgress;status:string;startedAt?:number;tasks?:PreviewTask[]}){
  const total=tasks?.length??0;
  const completed=tasks?.filter(t=>t.status==='completed').length??0;
  const [mountedAt]=useState(Date.now());
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
  const elapsed=Math.max(0,Math.floor((now-(startedAt??mountedAt))/1000));
  const silent=progress?Math.max(0,Math.floor((now-progress.receivedAt)/1000)):0;
  return <div role="status" className="preview-loading" style={{display:'grid',justifyItems:'center',gap:10,maxWidth:440,color:'var(--wb-ink-soft)',textAlign:'center'}}>
    <strong className="preview-loading-title" style={{fontSize:13,fontWeight:500}}>{progress?.message||`${STATUS[status]}，请稍候…`}</strong>
    <span className="preview-loading-meta" aria-hidden="true" style={{fontSize:12}}>总耗时 {elapsed} 秒</span>
    {total>0?<>
      <div className="preview-progress-track" role="progressbar" aria-label="预览总进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(completed/total*100)} style={{width:260,maxWidth:'100%',height:8,borderRadius:4,overflow:'hidden',background:'var(--wb-line)'}}>
        <div className="preview-progress-value" style={{height:'100%',width:`${completed/total*100}%`,background:'var(--wb-accent)',transition:'width .3s ease'}}/>
      </div>
      <span className="preview-loading-meta" aria-hidden="true" style={{fontSize:12}}>总进度 {completed}/{total} · {Math.floor(completed/total*100)}%</span>
    </>:<span className="preview-loading-meta" aria-hidden="true" style={{fontSize:12}}>未提供总进度</span>}
    {silent>=30&&<span className="preview-loading-warning" style={{fontSize:12,color:'var(--wb-warning)'}}>暂时没有新进度；仍在等待结果。</span>}
  </div>;
}

export function failureMessage(row:Row,error:string){
  const reason=error||(row.diagnostics?.log?.includes('stderr:')?row.diagnostics.log.split('stderr:').at(-1)!.trim():undefined)||row.error||'';
  const detail=reason.replace(/^Error:\s*/i,'').trim().slice(0,400);
  if(/版本|revision/i.test(reason))return {title:'候选版本需要核对',description:'当前运行版本与候选要求不一致，请核对后重新启动。',reason:detail};
  const note=row.host?.failure?.handlingNote;
  return {title:row.status==='waiting'?'需要你处理后才能启动':row.status==='repairing'?'正在自动修复':'预览暂时无法启动',description:note||'具体原因见下方；可重新启动当前端。',reason:detail};
}

export function usePreviewModel(){
  const note=useNote<typeof import('./actions')>();
  const {config,useQuery,usePagedQuery,actions,host:workbench,mode,layout,metadata,focus:requestedFocus,focusRequestId}=note;
  const runtime={note:{id:note.metadata.id},resolvePreviewUrl:workbench.resolvePreviewUrl};
  const [showArchive,setShowArchive]=useState(false);
  const root=useQuery('state.summary',{});
  const page=usePagedQuery('candidates.page',{limit:30,maxBytes:256*1024});
  const archivePage=usePagedQuery('archivedCandidates.page',{limit:20,maxBytes:256*1024},{enabled:mode==='expanded'&&showArchive});
  const outbox=useQuery('outbox.page',{limit:20,maxBytes:128*1024},{enabled:mode==='expanded'});
  const focus=requestedFocus ?? (typeof window==='undefined'?null:new URLSearchParams(window.location.search).get('focus'));
  let focusKey='';
  try{if(focus?.startsWith('cg:')){const ref=JSON.parse(decodeURIComponent(focus.slice(3)));if(ref.kind==='preview')focusKey=ref.id;}
      else if(focus?.startsWith('preview:'))focusKey=JSON.parse(decodeURIComponent(focus.slice(8)))[0];
      else focusKey=focus??'';}catch{}
  const [externalKey,setExternalKey]=useState('');
  const defaultCandidate=!focus?(config.projectId?page.items.find(candidate=>candidate.options?.formalPreview===true):undefined)??page.items[0]:undefined;
  const lookupKey=externalKey||focusKey||defaultCandidate?.key||'';
  const exact=useQuery('candidates.detail',{key:lookupKey},{enabled:mode==='expanded'&&Boolean(lookupKey)});
  const fallbackKey=lookupKey.includes(':')?lookupKey.slice(0,lookupKey.lastIndexOf(':')):'';
  const fallback=useQuery('candidates.detail',{key:fallbackKey},{enabled:mode==='expanded'&&Boolean(fallbackKey)&&exact.data===null});
  const extra=exact.data??(exact.data===null?fallback.data:undefined);
  const data:DisplayData={...root.data,title:root.data?.title??metadata.name,attached:root.data?.attached??[],candidates:[...(page.data?.items??[]),...(extra&&!page.data?.items?.some(x=>x.key===extra.key)?[extra]:[])],archivedCandidates:archivePage.data?.items,outbox:outbox.data?.items};
  const resource=composeQueries({candidates:page,...(mode==='expanded'&&lookupKey?{focus:exact}:{}),...(mode==='expanded'&&fallbackKey&&exact.data===null?{fallback}:{})},{summary:root,...(mode==='expanded'&&showArchive?{archive:archivePage}:{}),...(mode==='expanded'?{outbox}:{})});
  const nextPage=page.next, previousPage=page.previous, resetPage=page.reset;
  const nextArchive=archivePage.next, previousArchive=archivePage.previous;


  const stage=useRef<HTMLDivElement>(null);
  const mutations={
    start:useMutation(actions.start,{query:root}),stop:useMutation(actions.stop,{query:root}),
    verify:useMutation(actions.verify,{query:root}),check:useMutation(actions.check,{query:root}),
    attach:useMutation(actions.attach,{query:root}),archive:useMutation(actions.archive,{query:root}),
    restore:useMutation(actions.restore,{query:root}),forget:useMutation(actions.forget,{query:root}),
    repair:useMutation(actions.requestRepair,{query:root}),
  };
  const operations:Record<string,PendingOperation>={};
  const [collapsed,setCollapsed]=useState<string[]>([]);
  const [menu,setMenu]=useState(false);
  const [showAddress,setShowAddress]=useState(false);
  const repairing=mutations.repair.status==='pending'||mutations.repair.status==='unknown';
  const [urls,setUrls]=useState<Record<string,string>>({});
  const [draft,setDraft]=useState('');
  const [frameReady,setFrameReady]=useState<Record<string,string>>({});
  const [fullscreen,setFullscreen]=useState(false);
  const [device,setDevice]=useViewState('preview:device','desktop' as DeviceKey);
  useEffect(()=>{const change=()=>setFullscreen(document.fullscreenElement===stage.current);document.addEventListener('fullscreenchange',change);return()=>document.removeEventListener('fullscreenchange',change);},[]);
  const [error,setError]=useState('');
  const [activeKey,updateActiveKey]=useState<string|undefined>(undefined);
  const setActiveKey=(key:string|undefined)=>{updateActiveKey(key);setExternalKey(rows.find(row=>row.spec.key===key)?.owner.key??key??'');};
  // A new navigation request takes precedence over the local version selection.
  useEffect(()=>{updateActiveKey(undefined);setExternalKey('');},[focus,focusRequestId]);
  // Keep only previews opened in this document; durable history must not boot hidden apps.
  const [loaded,setLoaded]=useState<string[]>([]);
  const [reload,setReload]=useState<Record<string,number>>({});
  const [confirmForget,setConfirmForget]=useState<string|null>(null);
  const run=(fn:()=>Promise<unknown>)=>{setError('');void fn().catch(e=>setError(String(e)));};

  const archived=(data.archivedCandidates??[]).filter(spec=>!(data.candidates??[]).some(active=>active.key===spec.key));
  const rows=previewRows(data,operations);
  const preferredKey=activeKey??(!focus&&config?.projectId?rows.find(row=>row.owner.options?.formalPreview===true)?.spec.key:undefined);
  // A playing candidate has its own bounded query owner; paging only navigates the list.
  const playerRows=mode==='expanded'?extra?previewRows({...data,candidates:[extra]},operations):[]:rows;
  const current=selectPreviewRow(playerRows,preferredKey,focus);
  const focusError=(focus||activeKey)&&!previewWantsVersions(focus)&&!current&&!resource.loading&&!resource.error?'所选试玩版本不存在或已归档，请在列表中重新选择。':'';
  const currentIsCandidate=Boolean(current&&(data.candidates??[]).some(spec=>spec.key===current.owner.key));
  const [resolvedUrls,setResolvedUrls]=useState<Record<string,string>>({});
  const [accessErrors,setAccessErrors]=useState<Record<string,string>>({});
  const accessKey=(row:Row)=>JSON.stringify([urls[row.spec.key]??row.url,row.host?.pass,reload[row.spec.key]??0]);
  // Both presentations use the same live documents, including previously opened versions.
  const frames=mode==='expanded'&&current&&canViewPreview(current.status)?[current]:[];
  const requestedUrls=JSON.stringify(frames.map(row=>({url:urls[row.spec.key]??row.url,key:accessKey(row)})));
  useEffect(()=>{
    let cancelled=false;
    const requested=JSON.parse(requestedUrls) as Array<{url:string;key:string}>;
    const wanted=new Set(requested.map(item=>item.key));
    setResolvedUrls(value=>Object.fromEntries(Object.entries(value).filter(([key])=>wanted.has(key))));setAccessErrors({});
    for(const {url,key} of requested.filter(item=>item.url)) {
      void runtime.resolvePreviewUrl(url).then(href=>{if(!cancelled)setResolvedUrls(value=>({...value,[key]:href}));},error=>{if(!cancelled)setAccessErrors(value=>({...value,[key]:String(error)}));});
    }
    return()=>{cancelled=true;};
  },[workbench,requestedUrls]);
  const selectedAccess=current?accessKey(current):'';
  const currentUrl=resolvedUrls[selectedAccess]??'';
  const accessError=accessErrors[selectedAccess];
  // The compact project player and expanded player own the same live document.
  const openedKey=mode==='expanded'&&currentUrl?current?.spec.key:undefined;
  // Default playback pins its identity across pages; a focused revision stays authoritative.
  useEffect(()=>{if(openedKey){setLoaded([openedKey]);if(!focus)setActiveKey(openedKey);}},[openedKey,focus]);
  const activeDevice=DEVICES.find(item=>item.key===device)??DEVICES[0];
  const cycleDevice=()=>setDevice(currentDevice=>DEVICES[(DEVICES.findIndex(item=>item.key===currentDevice)+1)%DEVICES.length].key);
  const addressSource=useRef<{key?:string;url:string}>({url:''});
  useEffect(()=>{const previous=addressSource.current;const key=current?.spec.key;addressSource.current={key,url:currentUrl};setDraft(value=>key!==previous.key||value===previous.url?currentUrl:value);},[current?.spec.key,currentUrl]);
  const groups=[...new Set(rows.map(row=>row.group))].map(key=>({key,rows:rows.filter(row=>row.group===key)}));
  const availableFeatures=groups.filter(group=>group.rows.some(row=>canViewPreview(row.status))).length;
  const effectiveStatus=current?.status??'';
  const requestRepair=(row:Row)=>mutations.repair.mutate({key:row.owner.key,surface:row.surface??''});
  const mutationNotices=<>{Object.entries(mutations).map(([name,mutation])=><MutationNotice key={name} mutation={mutation}/>)}
    {mutations.repair.status==='success'&&mutations.repair.data?.accepted===false&&<p role="alert">{mutations.repair.data.reason??'执行台未接收修复请求'}</p>}
    {mutations.repair.status==='success'&&typeof mutations.repair.data?.session==='string'&&<Button onPress={()=>run(()=>workbench.openSession(mutations.repair.data!.session!))}>查看已创建修复会话</Button>}
  </>;
  /** An Agent repair starts only from this click; afterwards the same place opens that Agent's session. */
  const repairButton=(row:Row)=>{
    const failure=row.host?.phase==='failed'?row.host.failure:undefined;
    if(!failure||failure.owner==='user')return null;
    if(failure.handling==='awaiting-approval'||failure.handling==='exhausted')return <Button variant="tertiary" size="sm" type="button" className="preview-retry preview-action preview-action-secondary preview-repair" isDisabled={repairing||row.activeOperation} onPress={()=>void requestRepair(row)}>{repairing?'正在交给 Agent…':'交给 Agent 修复'}</Button>;
    if(failure.handling==='agent'||failure.handling==='agent-done'){
      const session=failure.session;
      return <Button variant="tertiary" size="sm" type="button" className="preview-retry preview-action preview-action-secondary preview-repair" isDisabled={!session} onPress={()=>{if(session)void workbench.openSession(session).catch(e=>setError(String(e)));}}>{session?'查看修复会话':'修复任务启动中…'}</Button>;
    }
    return null;
  };
  const frameToken=(row:Row)=>`${urls[row.spec.key]??row.url}:${reload[row.spec.key]??0}`;

  const label=(spec:CandidateDisplay)=>spec.title||spec.key;
  const attach=(key:string)=>{setActiveKey(key);setLoaded([key]);void mutations.attach.mutate({key});};
  const reloadFrame=(key:string)=>setReload(state=>({...state,[key]:(state[key]??0)+1}));
  /** Not-ready play starts the process and remembers the frame, so it appears once ready. */
  const startAndAttach=(key:string,onlySurface=false)=>{
    const row=rows.find(item=>item.spec.key===key);if(!row)return;
    if(mutations.start.status==='pending'||mutations.start.status==='unknown')return;
    setActiveKey(key);setLoaded([key]);
    void mutations.start.mutate({key:row.owner.key,...(onlySurface&&row.surface?{surface:row.surface}:{})});
    void mutations.attach.mutate({key});
  };
  const openDelegation=(spec:CandidateDisplay)=>{if(spec.originNoteId&&spec.delegationId)void workbench.openNote(spec.originNoteId,spec.delegationId).catch(e=>setError(String(e)));};
  const draftTodo=()=>{
    if(!config?.feedbackInTodo||!config.notes?.todo)return;
    const context=current?{ref:{projectId:config.projectId,kind:'preview',id:current.owner.key,revision:current.owner.repos?.[current.surface || 'game']?.commit || current.owner.repos?.game?.commit || current.owner.revision,...(current.surface?{surface:current.surface}:{})}}:undefined;
    void workbench.openNote(config.notes.todo,'cg:'+encodeURIComponent(JSON.stringify({projectId:config.projectId,kind:'todo',intent:'draft',...(context?{context}:{})}))).catch(e=>setError(String(e)));
  };
  const attachedHere=Boolean(current&&loaded.includes(current.spec.key)&&canViewPreview(current.status));

  return {refresh:resource.refresh!,query:resource,page,nextPage,previousPage,resetPage,archivePage,nextArchive,previousArchive,previewTarget:(row:Row)=>urls[row.spec.key]??row.url,closePreview:()=>setLoaded([]),config,runtime,data,actions,workbench,stage,operations,collapsed,setCollapsed,menu,setMenu,showAddress,setShowAddress,showArchive,setShowArchive,setUrls,draft,setDraft,frameReady,setFrameReady,fullscreen,device,error:error||focusError,setError,setActiveKey,loaded,reload,confirmForget,setConfirmForget,run,archived,rows,current,currentIsCandidate,resolvedUrls,accessKey,currentUrl,accessError,activeDevice,cycleDevice,groups,availableFeatures,mutations,mutationNotices,effectiveStatus,repairButton,frameToken,label,attach,reloadFrame,startAndAttach,openDelegation,draftTodo,attachedHere,layout,metadata,focus,focusRequestId,mode};
}
export type PreviewModel = ReturnType<typeof usePreviewModel>;


export type {CandidateSummary,FeedbackSummary} from './model';
