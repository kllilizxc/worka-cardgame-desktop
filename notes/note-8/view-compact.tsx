import {useNote,NoteIcon,type NoteMetadata} from '@dsh-workbench/react';
import {Button,ScrollShadow} from '@heroui/react';
import {useState} from 'react';
import {CompactGallery} from './compact-gallery';
import {StoryCompact} from './story-compact';
import {BalanceCompact} from './balance-compact';
import {modeLabel,relativeTime} from './content-format';
import {encodeContentRef,recentChangeLabel,recentChangesForMode,type CardGameConfig,type LibraryMode,type StatusData,type ContentRef,type RecentChangeItem} from './content-model';

export default function CompactSurface() {
  const noteApi=useNote<typeof import('./actions')>();
  const {config,state,metadata}=noteApi;
  const updateData=(patch:Partial<typeof state>)=>noteApi.actions.setViewState({patch,expectedRevision:noteApi.stateRevision});
  if(!config.projectId)return <section className="cg-library cg-setup compact"><style>{STYLES}</style><span className="cg-brand-icon"><NoteIcon icon={metadata.icon} size={18}/></span><strong>连接 CardGame 项目</strong><p>展开后选择一次项目目录，连接此桌面的全部游戏便笺。</p></section>;
  if(config.presentation==='balance')return <BalanceCompact selectedMetric={state.views?.balanceMetricSelection} onSelectMetric={(kind,metric)=>updateData({views:{...state.views,balanceMetricSelection:{kind,metric}}}).then(()=>{})} openCards={()=>{if(config.notes?.cards)void noteApi.host.openNote(config.notes.cards);}}/>;
  if(config.presentation==='story')return <StoryCompact selected={state.views?.storySelection} selectedNode={state.views?.storyNodeSelection?.storyId===state.views?.storySelection?state.views?.storyNodeSelection?.nodeId:undefined}
    onSelect={async id=>{await updateData({views:{...state.views,storySelection:id}});await noteApi.host.openNote(metadata.id);}}
    onNodeSelect={async nodeId=>{if(state.views?.storySelection){await updateData({views:{...state.views,storyNodeSelection:{storyId:state.views.storySelection,nodeId}}});await noteApi.host.openNote(metadata.id);}}}/>;
  const libraryMode=config.mode??'knowledge';
  if(libraryMode==='knowledge')return <KnowledgeCompact config={config} metadata={metadata}/>;
  if(libraryMode==='cards'||config.assetScope)return <CompactGallery kind={libraryMode==='cards'?'cards':config.assetScope!} metadata={metadata} open={id=>void noteApi.host.openNote(metadata.id,encodeContentRef({projectId:config.projectId!,kind:libraryMode==='cards'?'card':'asset',id}))}/>;
  return <RecentCompact projectId={config.projectId} mode={libraryMode} metadata={metadata}/>;
}
function RecentCompact({projectId,mode,metadata}:{projectId:string;mode:LibraryMode;metadata:NoteMetadata}){
  const noteApi=useNote<typeof import('./actions')>();
  const status=noteApi.useQuery('status',{});
  return <CompactView mode={mode} projectId={projectId} status={status.data} metadata={metadata} openContent={ref=>void noteApi.host.openNote(noteApi.metadata.id,encodeContentRef({...ref,projectId:ref.projectId||projectId}))}/>;
}

function KnowledgeCompact({ config, metadata }: { config: CardGameConfig; metadata: NoteMetadata }) {
  const noteApi = useNote<typeof import("./actions")>();
  const resources = config.resources ?? [];
  const workbench = noteApi.host;
  const [error, setError] = useState('');
  const open = (path?: string) => {
    setError('');
    void workbench.openNote(noteApi.metadata.id, path ? encodeContentRef({ projectId: config.projectId!, kind: 'document', path, intent: 'reference' }) : undefined).catch(cause => setError(String(cause)));
  };
  return <section className="cg-knowledge-summary" style={{ height: "100dvh", padding: "12px 16px", background: "var(--wb-paper)", borderRadius: 16, color: "var(--wb-ink-soft)", fontFamily: "var(--wb-font-family)", boxSizing: "border-box", display: 'flex', flexDirection: 'column', gap: 8 }}>
    <style>{`.cg-knowledge-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;flex:1;min-height:0}.cg-knowledge-grid>button{display:flex;justify-content:flex-start;text-align:left;gap:8px;height:100%;min-height:32px;min-width:0;width:100%;padding:6px 10px;font-size:12px;white-space:normal}.cg-knowledge-grid>button span{min-width:0;overflow-wrap:anywhere}.cg-knowledge-summary footer{flex-shrink:0}.cg-knowledge-summary footer button{height:22px;min-height:22px;padding:0;font-size:11px;color:var(--wb-muted)}@media(max-width:400px){.cg-knowledge-grid{grid-template-columns:minmax(0,1fr)}.cg-knowledge-grid>button:nth-child(n+3){display:none}}`}</style>
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span style={{ width: 26, height: 26, borderRadius: 7, display: "grid", placeItems: "center", background: "var(--wb-success)", color: "white" }}><NoteIcon icon={metadata.icon} size={14} /></span>
      <div style={{ flex: 1 }}><strong style={{ fontSize: 14, color: "var(--wb-ink)" }}>{metadata.name || "知识库"}</strong></div>
      <span style={{ fontSize: 10.5, color: "var(--wb-success)", background: "var(--wb-success-pale)", padding: "2px 7px", borderRadius: 999 }}>{resources.length} 入口</span>
    </div>
    <div className="cg-knowledge-grid">{resources.slice(0, 4).map(item => <Button key={item.path} size="sm" variant="tertiary" onPress={() => open(item.path)}><span style={{ color: "var(--wb-success)" }}>▤</span><span>{item.title}</span></Button>)}</div>
    {resources.length > 4 && <footer><Button size="sm" variant="tertiary" onPress={() => open()}>全部 {resources.length} 份资料 ↗</Button></footer>}
    {error && <p role="alert" style={{ margin: 0, fontSize: 12, color: 'var(--wb-danger)' }}>{error}</p>}
  </section>;
}

function CompactView({
  mode,
  projectId,
  status,
  metadata,
  openContent,
}: {
  mode: LibraryMode;
  projectId: string;
  status?: StatusData;
  metadata: NoteMetadata;
  openContent: (ref: Omit<ContentRef, "projectId"> & { projectId?: string }, noteKind?: keyof NonNullable<CardGameConfig["notes"]>) => void;
}) {
  const noteApi = useNote<typeof import("./actions")>();
  const result = noteApi.useQuery("recentChanges", ({ limit: 6 }), { enabled: Boolean(projectId) });
  const items = recentChangesForMode((result.data?.items ?? []), mode).slice(0, 3);
  return <section className="cg-library cg-compact" data-library-mode={mode}>
    <style>{STYLES}</style>
    <div className="cg-compact-head">
      <div className="cg-brand"><span className="cg-brand-icon"><NoteIcon icon={metadata.icon} size={13} /></span><strong>{modeLabel(mode)}</strong></div>
      <span className="cg-compact-count">{compactCount(mode, status)}</span>
    </div>
    <ScrollShadow className="cg-compact-list" style={{ maxHeight: 122 }}>
      {result.loading && <span className="cg-muted">正在读取…</span>}
      {!result.loading && items.length === 0 && <span className="cg-muted">暂无最近变化</span>}
      {items.map(item => <button className="cg-compact-row" key={`${item.kind}:${item.id ?? item.path}:${item.at}`} type="button" onClick={() => openContent(compactRef(mode, item))}>
        <span className={`cg-recent-change is-${item.change}`}>{item.change === "created" ? "新建" : "更新"}</span>
        <span className="cg-ellipsis">{recentChangeLabel(item)}</span>
        <span className="cg-recent-time">{relativeTime(item.at)}</span>
      </button>)}
    </ScrollShadow>
    {result.error && <span className="cg-error" role="alert">{result.error.message}</span>}
    <span className="cg-compact-foot">展开查看完整检索、详情和编辑</span>
  </section>;
}

function compactCount(mode: LibraryMode, status?: StatusData): string {
  if (!status) return "";
  const value = mode === "knowledge" ? status.documents : mode === "cards" ? status.cards : status.assets;
  return typeof value === "number" ? `${value.toLocaleString("zh-CN")} 项` : "";
}

function compactRef(mode: LibraryMode, item: RecentChangeItem): Omit<ContentRef, "projectId"> {
  return { kind: mode === "cards" ? "card" : "asset", id: item.id, path: item.path, ...(item.kind === "version" ? {context: {changeKind: "version"}} : {}) };
}


const STYLES=`.cg-library{box-sizing:border-box;min-width:0;min-height:100dvh;height:100dvh;overflow:hidden;background:var(--wb-paper);color:var(--wb-ink);font-family:var(--wb-font-family,system-ui,sans-serif);font-size:13px}
.cg-library *{box-sizing:border-box;min-width:0}
.cg-library button,.cg-library input,.cg-library textarea,.cg-library select{font:inherit}
.cg-library button{cursor:pointer}
.cg-library button:focus-visible,.cg-library input:focus-visible,.cg-library textarea:focus-visible,.cg-library select:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}
.cg-brand{display:flex;align-items:center;gap:9px;min-width:0}
.cg-brand strong{display:block;font-size:15px;color:var(--wb-ink);line-height:1.25}
.cg-brand-icon{display:inline-grid;place-items:center;width:26px;height:26px;flex:0 0 26px;border-radius:8px;background:var(--wb-accent-pale);color:var(--wb-accent)}
.cg-muted{color:var(--wb-muted);font-size:11px}
.cg-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cg-compact{min-height:100dvh;padding:15px 16px 13px;background:var(--wb-paper);color:var(--wb-ink);display:flex;flex-direction:column;gap:10px}
.cg-compact-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.cg-compact-count{font-size:10px;color:var(--wb-muted)}
.cg-compact-list{display:flex;flex-direction:column;gap:2px}
.cg-compact-row{display:flex;align-items:center;gap:7px;width:100%;min-height:31px;padding:5px 6px;border:0;background:transparent;color:var(--wb-ink-soft);text-align:left}
.cg-compact-row:hover{background:var(--wb-surface-deep)}
.cg-item-icon{color:var(--wb-accent);font-size:13px}
.cg-arrow{margin-left:auto;color:var(--wb-muted)}
.cg-compact-foot{margin-top:auto;color:var(--wb-muted);font-size:10px;text-align:center}
.cg-setup{display:flex;align-items:center;justify-content:center;gap:8px;padding:24px;text-align:center}
.cg-setup p{color:var(--wb-muted);font-size:11px}
.cg-recent-change{flex:0 0 auto;padding:1px 5px;border-radius:999px;font-size:9px;background:var(--wb-accent-pale);color:var(--wb-accent)}
.cg-recent-change.is-created{background:var(--wb-success-pale);color:var(--wb-success)}
.cg-recent-time{margin-left:auto;flex:0 0 auto;font-size:10px;color:var(--wb-muted)}
@media(max-width:680px){.cg-compact{padding:14px}.cg-compact .cg-compact-list{max-height:120px!important}}`;
