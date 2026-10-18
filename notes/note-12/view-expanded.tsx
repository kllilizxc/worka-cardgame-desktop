import {formatTime,relativeTime,modeLabel} from "./content-format";
import {ContentCollection,CollectionPagination} from "./content-collection";
import {jsonObject,type ContentQueryOutput} from "./contract";
import {AssetFilterPanel} from "./asset-filter-panel";
import { DeckWorkspace } from "./deck-workspace";
import { PinnedReferences } from './pinned-references';
import { ImagePreview } from './image-preview';
import { CardsWorkspace } from "./cards-workspace";
import { CreateCardWorkflow } from "./card-workflow-create";
import { AudioPreview } from './audio-preview';
import { AudioGuidance } from './audio-guidance';
import { StoryWorkspace } from './story-workspace';
import { BalanceWorkspace } from './balance-workspace';
import {useNote,useNoteDraft,NoteIcon,type NoteMetadata} from '@dsh-workbench/react';
import { Button, ScrollShadow, SearchField, Spinner, TextField, Label, Input } from "@heroui/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownPre } from "./mermaid";
import { useCallback, useEffect, useInsertionEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type {
  AssetData,
  AssetFilters,
  AssetItem,
  BacklinkItem,
  CardData,
  CardGameConfig,
  CardItem,
  ContentKind,
  ContentRef,
  DocumentData,
  GraphData,
  LibraryItem,
  LibraryMode,
  LibraryState,
  ViewStatePatch,
  MediaData,
  RecentChangeItem,
  StatusData,
  VersionItem,
} from "./content-model";
import { decodeContentRef, decodeMarkdownUrlPath, encodeContentRef, itemLabel, markdownContentTarget, mediaSource, recentChangeLabel, recentChangesForMode, registeredReferenceFromFocus, resolveRelativePath } from "./content-model";

const PAGE_SIZE = 100;
const MAX_GRAPH_NODES = 100;
const LONG_SCENE_BYTES = 24 * 1024;
const CARD_REFINEMENTS = `.cg-recent-toggle{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:4px 6px;border:0;background:transparent;color:var(--wb-ink-soft);text-align:left;cursor:pointer}.cg-recent-toggle strong{font-size:12px}.cg-recent-toggle span{font-size:11px;color:var(--wb-muted)}.cg-recent-toggle:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px;border-radius:6px}.cg-card-source{margin-top:14px;color:var(--wb-ink-soft);font-size:12px}.cg-card-source summary{cursor:pointer;padding:8px 0}.cg-card-source .cg-editor-label{display:block;margin:10px 0}.cg-card-source .cg-json-editor{width:100%}`;


type NoteApi = ReturnType<typeof useNote<typeof import("./actions")>>;
type Actions = NoteApi["actions"];

export default function ExpandedSurface() {return <View mode="expanded" />;}

function View({mode}: {mode: 'compact' | 'expanded'}){
  const noteApi = useNote<typeof import("./actions")>();
  const {metadata, state} = noteApi;
  const config = noteApi.config;
  if (!config?.projectId) return <LibraryView mode={mode} />;
  return <div className="cg-context-shell">
    <style>{`.cg-context-shell{height:100dvh;display:flex;flex-direction:column;min-width:0;background:var(--wb-paper)}.cg-context-body{flex:1;min-height:0;overflow:auto}.cg-context-body>.cg-library{height:100%;min-height:0;display:flex;flex-direction:column}.cg-context-body .cg-workspace,.cg-context-body .cl-workspace{height:auto;min-height:0;flex:1}.cg-context-body .reader-layout{height:auto;min-height:0;flex:1}.cg-context-footer{display:flex;justify-content:flex-end;padding:4px 14px;flex-shrink:0}@media(max-width:680px){.cg-context-footer{justify-content:flex-start}}`}</style>
    <div className="cg-context-body"><LibraryView mode={mode} /></div>
    <footer className="cg-context-footer" style={{alignItems:"flex-start",gap:12}}><details style={{marginRight:"auto",maxWidth:560}}><summary>项目目录</summary><SetupView mode="expanded" metadata={metadata} initialRoot={config.projectRoot} /></details><PinnedReferences config={config} state={state} /></footer>
  </div>;
}

function ResourceRegistration() {
  const noteApi = useNote<typeof import("./actions")>();
  const actions = noteApi.actions;
  const [path, setPath] = useState(''), [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState('');
  return <details style={{ padding: '12px 4px', fontSize: 12 }}><summary>添加资料</summary>
    <form style={{ display: 'grid', gap: 10, marginTop: 12, minWidth: 0 }} onSubmit={event => {
      event.preventDefault(); setBusy(true); setError(''); setMessage('');
      void actions.addResource({ path, ...(title.trim() ? { title } : {}) }).then(() => { setMessage('已添加，可从资料入口打开。'); setPath(''); setTitle(''); }, cause => setError(cause instanceof Error ? cause.message : String(cause))).finally(() => setBusy(false));
    }}>
      <label>文件或目录路径<input aria-label="资料绝对路径" required value={path} onChange={event => setPath(event.target.value)} placeholder="/本机路径/index.md" style={{ width: '100%', boxSizing: 'border-box', color: 'var(--wb-ink)', background: 'var(--wb-surface)', padding: 8, borderRadius: 'var(--wb-radius-small)' }} /></label>
      <label>名称（可选）<input value={title} onChange={event => setTitle(event.target.value)} style={{ width: '100%', boxSizing: 'border-box', color: 'var(--wb-ink)', background: 'var(--wb-surface)', padding: 8, borderRadius: 'var(--wb-radius-small)' }} /></label>
      <Button type="submit" size="sm" variant="secondary" isDisabled={busy}>{busy ? '正在添加…' : '添加'}</Button>
      {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    </form>
  </details>;
}

function LibraryView({mode}: {mode: 'compact' | 'expanded'}) {
  const noteApi = useNote<typeof import("./actions")>();
  const {state: data, metadata, focus, focusRequestId} = noteApi;
  const [preferenceError,setPreferenceError]=useState<Error>();
  // Keep this surface’s write/receipt order, including after a rejected save.
  const preferenceWrites=useRef<Promise<unknown>>(Promise.resolve());
  const savePreferences=useCallback(async(input:Parameters<Actions['setViewState']>[0])=>{
    const pending=preferenceWrites.current.then(()=>noteApi.actions.setViewState(input));
    preferenceWrites.current=pending.catch(()=>undefined);
    try { const saved=await pending;setPreferenceError(undefined);return saved; }
    catch(cause){setPreferenceError(new Error(`界面选择尚未确认保存：${cause instanceof Error?cause.message:String(cause)}`));throw cause;}
  },[noteApi.actions]);
  const updateData=useCallback((patch:ViewStatePatch)=>savePreferences({patch}),[savePreferences]);
  const config = noteApi.config;
  const workbench = noteApi.host;
  const actions = noteApi.actions;
  const libraryMode: LibraryMode = config?.mode ?? "knowledge";
  const projectId = config?.projectId ?? "";
  const state = data ?? {};
  const query = state.query ?? "";
  const focusRef = useMemo(() => decodeContentRef(focus), [focus]);
  const status = noteApi.useQuery("status", {}, { enabled: Boolean(projectId) && libraryMode !== "knowledge" && config.presentation !== "story" && config.presentation !== "balance" });

  // Event handlers may fire-and-forget, but a rejected save remains visible above the view.
  const saveState=useCallback(async(patch:ViewStatePatch)=>{await updateData(patch).catch(()=>undefined);},[updateData]);
  const saveBookmark=useCallback(async(key:string,saved:boolean)=>{await savePreferences({bookmark:{key,saved}}).catch(()=>undefined);},[savePreferences]);
  const saveNamedFilter=useCallback(async(filter:AssetFilters)=>{await savePreferences({filter}).catch(()=>undefined);},[savePreferences]);

  const openContent = useCallback((ref: Omit<ContentRef, "projectId"> & { projectId?: string }, noteKind?: keyof NonNullable<CardGameConfig["notes"]>) => {
    const targetNote = noteKind ? config?.notes?.[noteKind] || noteApi.metadata.id : noteApi.metadata.id;
    const project = ref.projectId || projectId;
    if (!project || !targetNote) return;
    void workbench.openNote(targetNote, encodeContentRef({ ...ref, projectId: project }));
  }, [config?.notes, libraryMode, projectId, noteApi.metadata.id, workbench]);

  if (!config?.projectId) return <SetupView mode={mode} metadata={metadata} />;

  if (config.presentation === 'balance') return <><ErrorState error={preferenceError}/><BalanceWorkspace selectedMetric={state.views?.balanceMetricSelection}
    battleSelection={state.views?.battleComparisonSelection}
    onSelectBattle={async selection => { await updateData({ views: { battleComparisonSelection: selection } }); }}
    onSelectMetric={async (kind, metric) => { await updateData({ views: { balanceMetricSelection: { kind, metric } } }); }}
    /></>;

  if (config.presentation === 'story') return <><ErrorState error={preferenceError}/><StoryWorkspace selected={state.views?.storySelection}
    onSource={async source => {
      if (!config.notes?.knowledge) throw Error('尚未关联知识便笺，请配置项目便笺关系');
      await workbench.openNote(config.notes?.knowledge, encodeContentRef({ projectId, kind: 'document', id: source.id, path: source.path, revision: source.revision }));
    }}
    selectedNode={state.views?.storyNodeSelection?.storyId === state.views?.storySelection ? state.views?.storyNodeSelection?.nodeId : undefined}
    onNodeSelect={async nodeId => { if (state.views?.storySelection) { await updateData({ views: { storyNodeSelection: { storyId: state.views.storySelection, nodeId } } }); if (mode === 'compact') await workbench.openNote(noteApi.metadata.id); } }}
    onSelect={async id => { await updateData({ views: { storySelection: id } }); if (mode === 'compact') await workbench.openNote(noteApi.metadata.id); }} /></>;

  if (libraryMode === "knowledge") {
    return <section className="cg-library reference-reader" data-library-mode="knowledge">
      <style>{STYLES}{READER_STYLES}</style>
      <ErrorState error={preferenceError}/>
      <KnowledgeView projectId={projectId} state={state} query={query} setState={saveState} saveBookmark={saveBookmark} saveNamedFilter={saveNamedFilter} openContent={openContent} actions={actions} config={config} focusRef={focusRef} focusRequestId={focusRequestId} />
    </section>;
  }

  return <section className="cg-library" data-library-mode={libraryMode}>
    <style>{STYLES + CARD_REFINEMENTS}</style>
    <ErrorState error={preferenceError}/>
    <header className="cg-topbar">
      <div className="cg-brand">
        <span className="cg-brand-icon"><NoteIcon icon={metadata.icon} size={15} /></span>
        <div>
          <strong>{config.assetScope === 'art' ? '美术' : config.assetScope === 'audio' ? '音频' : modeLabel(libraryMode)}</strong>
          <span className="cg-subtitle" title={projectId}>CardGame</span>
        </div>
      </div>
      <div className="cg-status" aria-live="polite">
        {status.loading ? <Spinner size="sm" /> : status.error ? <span className="cg-error">连接异常</span> : <span className="cg-dot" />}
        {!status.error && <span title={status.data?.indexedAt ? `索引 ${formatTime(status.data.indexedAt)}` : undefined}>{status.data?.indexedAt ? "已连接" : "内容索引"}</span>}
      </div>
    </header>
    {config.assetScope === 'audio' && <AudioGuidance />}
    {libraryMode === "cards" && <CardsView projectId={projectId} state={state} query={query} setState={saveState} saveBookmark={saveBookmark} saveNamedFilter={saveNamedFilter} openContent={openContent} actions={actions} focusRef={focusRef} focusRequestId={focusRequestId} />}
    {libraryMode === "assets" && <AssetsView projectId={projectId} state={state} query={query} setState={saveState} saveBookmark={saveBookmark} saveNamedFilter={saveNamedFilter} openContent={openContent} actions={actions} focusRef={focusRef} focusRequestId={focusRequestId} />}
  </section>;
}

function SetupView({ mode, metadata, initialRoot = "" }: { mode: "compact" | "expanded"; metadata: NoteMetadata; initialRoot?: string }) {
  const noteApi = useNote<typeof import("./actions")>();
  const actions = noteApi.actions;
  const [root, setRoot] = useState(initialRoot);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <section className={`cg-library cg-setup ${mode}`}>
    <style>{STYLES}</style>
    <span className="cg-brand-icon"><NoteIcon icon={metadata.icon} size={18} /></span>
    <strong>连接 CardGame 项目</strong>
    {mode === 'compact' ? <p>展开后选择一次项目目录，连接此桌面的全部游戏便笺。</p> : <>
      <p>选择本机 CardGame 源码目录。此桌面将读取项目内容。切换目录会先停止旧项目任务和预览；正式源码变更仍需在功能进展中确认采用。</p>
      <form style={{display:'grid',gap:12,width:'100%',maxWidth:560,minWidth:0}} onSubmit={event => {
        event.preventDefault(); setBusy(true); setError('');
        void actions.configureProject({root}).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : String(cause))).finally(() => setBusy(false));
      }}>
        <TextField aria-label="CardGame 项目目录" fullWidth isRequired value={root} onChange={setRoot} isDisabled={busy}>
          <Label>CardGame 项目目录</Label>
          <Input placeholder="本机项目的绝对路径" />
        </TextField>
        <Button type="submit" isDisabled={busy || !root.trim()}>{busy ? '正在连接…' : '连接此桌面'}</Button>
        {error && <p role="alert" style={{color:'var(--wb-danger)',overflowWrap:'anywhere'}}>{error}</p>}
      </form>
    </>}
  </section>;
}

function SearchBox({ value, onChange, onSubmit, label, placeholder }: { value: string; onChange: (value: string) => void; onSubmit: () => void; label: string; placeholder: string }) {
  return <SearchField aria-label={label} value={value} onChange={onChange} onSubmit={onSubmit} fullWidth>
    <SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder={placeholder} /><SearchField.ClearButton aria-label="清空搜索" /></SearchField.Group>
  </SearchField>;
}

function Toolbar({ children, search, onSearch, searchPlaceholder, searchLabel }: { children?: ReactNode; search: string; onSearch: (value: string) => void; searchPlaceholder: string; searchLabel: string }) {
  const [value, setValue] = useState(search);
  useEffect(() => setValue(search), [search]);
  return <div className="cg-toolbar">
    <div className="cg-search"><SearchBox value={value} onChange={setValue} onSubmit={() => onSearch(value)} label={searchLabel} placeholder={searchPlaceholder} /></div>
    <div className="cg-toolbar-actions">{children}</div>
  </div>;
}

function ToggleButton({ active, children, onPress, label }: { active: boolean; children: ReactNode; onPress: () => void; label?: string }) {
  return <Button size="sm" variant={active ? "primary" : "tertiary"} aria-label={label} onPress={onPress}>{children}</Button>;
}

function EmptyState({ text, detail }: { text: string; detail?: string }) {
  return <div className="cg-empty"><strong>{text}</strong>{detail && <span>{detail}</span>}</div>;
}

function ErrorState({ error }: { error?: Error | null }) {
  if (!error) return null;
  return <p className="cg-error" role="alert">{error.message}</p>;
}

const RECENT_CHANGES_PAGE = 10;
const RECENT_CHANGES_COLLAPSED = 5;


function RecentChanges({ projectId, mode, onLocate }: { projectId: string; mode: "cards" | "assets"; onLocate: (item: RecentChangeItem) => void }) {
  const noteApi = useNote<typeof import("./actions")>();
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const result = noteApi.usePagedQuery("recentChanges", { limit: RECENT_CHANGES_PAGE }, { enabled: Boolean(projectId) });
  const items = useMemo(() => recentChangesForMode(result.items, mode), [result.items, mode]);
  const visible = expanded ? items : items.slice(0, RECENT_CHANGES_COLLAPSED);
  if (!result.loading && !result.error && items.length === 0 && !result.hasNext && !result.hasPrevious) return null;
  return <section className="cg-recent" aria-label="最近变化">
    <button type="button" className="cg-recent-toggle" aria-expanded={open} onClick={() => setOpen(value => !value)}><strong>最近变化</strong><span>{items.length} 条 · {open ? "收起" : "展开"}</span></button>
    {open && <>
    {result.loading && result.items.length === 0 && <span className="cg-muted">正在读取…</span>}
    {visible.map(item => <button type="button" className="cg-recent-row" key={`${item.kind}:${item.id ?? item.path}:${item.at}`} onClick={() => onLocate(item)}>
      <span className={`cg-recent-change is-${item.change}`}>{item.change === "created" ? "新建" : "更新"}</span>
      <span className="cg-ellipsis">{recentChangeLabel(item)}</span>
      <span className="cg-recent-time">{relativeTime(item.at)}</span>
    </button>)}
    <ErrorState error={result.error} />
    <div className="cg-recent-foot">
      {!expanded && items.length > RECENT_CHANGES_COLLAPSED && <Button size="sm" variant="tertiary" onPress={() => setExpanded(true)}>展开全部（{items.length}）</Button>}
      <CollectionPagination page={result} label="最近变化" />
    </div>
    </>}
  </section>;
}



interface LibraryViewProps {
  projectId: string;
  state: LibraryState;
  query: string;
  setState: (patch: ViewStatePatch) => Promise<void>;
  saveBookmark: (key:string,saved:boolean) => Promise<void>;
  saveNamedFilter: (filter:AssetFilters) => Promise<void>;
  openContent: (ref: Omit<ContentRef, "projectId"> & { projectId?: string }, noteKind?: keyof NonNullable<CardGameConfig["notes"]>) => void;
  actions: Actions;
  config?: CardGameConfig;
  focusRef?: ContentRef;
  focusRequestId?: number;
}

interface ReferenceTarget {
  kind: "asset" | "card";
  id?: string;
  path?: string;
  title: string;
}

function referenceTargetFromFocus(ref: ContentRef | undefined, projectId: string): ReferenceTarget | undefined {
  if (!ref || ref.projectId !== projectId || ref.intent !== "backlinks") return undefined;
  const context = ref.context;
  const assetId = typeof context?.assetId === "string" ? context.assetId : undefined;
  const cardId = typeof context?.cardId === "string" ? context.cardId : undefined;
  const kind = ref.kind === "asset" || ref.kind === "card" ? ref.kind : assetId ? "asset" : cardId ? "card" : undefined;
  if (!kind) return undefined;
  const id = ref.id || (kind === "asset" ? assetId : cardId);
  const path = ref.path || (typeof context?.path === "string" ? context.path : undefined);
  if (!id && !path) return undefined;
  const title = typeof context?.title === "string" && context.title.trim() ? context.title : kind === "asset" ? "资源引用" : "卡牌引用";
  return { kind, id, path, title };
}

type ReaderLocation = { id?: string; path: string; line?: number; anchor?: string; resourcePath?: string; title?: string };

function KnowledgeView({ projectId, state, setState, saveBookmark, openContent, config, focusRef, focusRequestId }: LibraryViewProps) {
  const noteApi = useNote<typeof import("./actions")>();
  const [selected, setSelected] = useState<ReaderLocation>();
  const [selectedReference, setSelectedReference] = useState<{ resourcePath: string; path?: string; title: string } | undefined>(() => !focusRef && config?.resources?.[0] ? {resourcePath: config.resources[0].path, title: config.resources[0].title} : undefined);
  const [referenceTarget, setReferenceTarget] = useState<ReferenceTarget>();
  const [history, setHistory] = useState<ReaderLocation[]>([]);
  const [forward, setForward] = useState<ReaderLocation[]>([]);
  const [scriptMode, setScriptMode] = useState<boolean>();
  const [scriptReloadToken, setScriptReloadToken] = useState(0);
  const [showRelations, setShowRelations] = useState<"none" | "backlinks" | "graph">("none");
  const [graphDepth, setGraphDepth] = useState<1 | 2>(1);
  const appliedFocus = useRef<{ref?: ContentRef; requestId?: number} | undefined>(undefined);
  const metaResource = noteApi.useQuery("documentMeta", (selected ? { id: selected.id, path: selected.path } : {}), { enabled: Boolean(selected) });
  const selectedMeta = metaResource.data?.path === selected?.path ? metaResource.data : undefined;
  const preferScript = Boolean(selectedMeta?.isScene && selectedMeta.size >= LONG_SCENE_BYTES && !selected?.line && !selected?.anchor);
  const readingScript = Boolean(selectedMeta?.isScene && (scriptMode ?? preferScript));
  const docResource = noteApi.useQuery("document", (selected ? { id: selected.id, path: selected.path } : {}), { enabled: Boolean(selected && selectedMeta && !readingScript) });
  const referenceResource = noteApi.useQuery("referenceDocument", (selectedReference ? { resourcePath: selectedReference.resourcePath, path: selectedReference.path } : undefined), { enabled: Boolean(selectedReference) });
  const backlinkTarget = selected
    ? { id: selected.id, path: selected.path }
    : referenceTarget
      ? { id: referenceTarget.path ? undefined : referenceTarget.id, path: referenceTarget.path }
      : undefined;
  const backlinkResource = noteApi.usePagedQuery("backlinks", (backlinkTarget && showRelations === "backlinks" ? { id: backlinkTarget.id, path: backlinkTarget.path, limit: PAGE_SIZE } : {}), { enabled: Boolean(backlinkTarget && showRelations === "backlinks") });
  const graphResource = noteApi.useQuery("graph", (selected && showRelations === "graph" ? { id: selected.id, path: selected.path, limit: MAX_GRAPH_NODES, depth: graphDepth } : {}), { enabled: Boolean(selected && showRelations === "graph") });


  const openDocument = useCallback((item: ReaderLocation, remember = true) => {
    const current: ReaderLocation | undefined = selectedReference ? { ...selectedReference, path: selectedReference.path || selectedReference.resourcePath } : selected;
    if (current && current.path !== item.path) {
      if (remember) {
        setHistory(previous => [...previous.slice(-49), current]);
        setForward([]);
      }
    }
    setSelected({ id: item.id, path: item.path, line: item.line, anchor: item.anchor });
    setScriptMode(undefined);
    setScriptReloadToken(0);
    void setState({ views: { knowledgeSelection: { id: item.id, path: item.path } } });
    setSelectedReference(undefined);
    setReferenceTarget(undefined);
    setShowRelations("none");
  }, [selected, selectedReference, setState]);

  useEffect(() => {
    if (appliedFocus.current?.ref === focusRef && appliedFocus.current?.requestId === focusRequestId) return;
    const target = referenceTargetFromFocus(focusRef, projectId);
    if (target) {
      appliedFocus.current = {ref: focusRef, requestId: focusRequestId};
      setSelected(undefined);
      setSelectedReference(undefined);
      setReferenceTarget(target);
      setShowRelations("backlinks");
      backlinkResource.reset();
      return;
    }
    if (!focusRef) {
      appliedFocus.current = {ref: focusRef, requestId: focusRequestId};
      return;
    }
    if (focusRef.projectId !== projectId || focusRef.kind !== "document" || !focusRef.path) return;
    appliedFocus.current = {ref: focusRef, requestId: focusRequestId};
    if (focusRef.intent === 'reference') {
      const resource = registeredReferenceFromFocus(focusRef, projectId, config?.resources ?? []);
      if (resource) { setSelected(undefined); setReferenceTarget(undefined); setSelectedReference({ resourcePath: resource.path, title: resource.title }); }
      return;
    }
    openDocument({ id: focusRef.id, path: focusRef.path, anchor: focusRef.anchor });
    if (focusRef.intent === "backlinks") setShowRelations("backlinks");
  }, [focusRef, focusRequestId, openDocument, projectId, config?.resources, state.views?.knowledgeSelection]);

  const goBack = useCallback(() => {
    const previous = history.at(-1);
    if (!previous) return;
    setHistory(items => items.slice(0, -1));
    const current = selectedReference ? { ...selectedReference, path: selectedReference.path || selectedReference.resourcePath } : selected;
    if (current) setForward(items => [...items.slice(-49), current]);
    if (previous.resourcePath) { setSelected(undefined); setSelectedReference({ resourcePath: previous.resourcePath, path: previous.path, title: previous.title || "知识库" }); }
    else openDocument(previous, false);
  }, [history, openDocument, selected, selectedReference]);

  const goForward = useCallback(() => {
    const next = forward.at(-1);
    if (!next) return;
    setForward(items => items.slice(0, -1));
    const current = selectedReference ? { ...selectedReference, path: selectedReference.path || selectedReference.resourcePath } : selected;
    if (current) setHistory(items => [...items.slice(-49), current]);
    if (next.resourcePath) { setSelected(undefined); setSelectedReference({ resourcePath: next.resourcePath, path: next.path, title: next.title || "知识库" }); }
    else openDocument(next, false);
  }, [forward, openDocument, selected, selectedReference]);

  const openGraphNode = useCallback((node: LibraryItem & { kind?: ContentKind; type?: ContentKind }) => {
    if ((node.kind || node.type) === "asset") {
      openContent({ kind: "asset", id: node.id, path: node.path }, "assets");
      return;
    }
    openDocument({ id: node.id, path: node.path || node.id });
  }, [openContent, openDocument]);

  const openReference = useCallback((resource: { resourcePath: string; path?: string; title: string }) => {
    const root = config?.projectRoot?.replace(/\/$/, "");
    const path = resource.path || resource.resourcePath;
    if (root && path.startsWith(root + "/")) { openDocument({ path: path.slice(root.length + 1) }); return; }
    const current = selectedReference ? { ...selectedReference, path: selectedReference.path || selectedReference.resourcePath } : selected;
    if (current) setHistory(items => [...items.slice(-49), current]);
    setForward([]);
    setSelected(undefined);
    setScriptMode(undefined);
    setSelectedReference(resource);
    setReferenceTarget(undefined);
    setShowRelations("none");
  }, [config?.projectRoot, openDocument, selected, selectedReference]);

  const navigateDocument: LibraryViewProps["openContent"] = (ref, noteKind) => {
    if (ref.kind === "document" && ref.path && (!noteKind || noteKind === "knowledge")) openDocument({ id: ref.id, path: ref.path, anchor: ref.anchor });
    else openContent(ref, noteKind);
  };

  const reloadDocument = () => {
    if (selected) {
      void metaResource.refresh();
      if (readingScript && selectedMeta) {
        setScriptReloadToken(value => value + 1);
      } else {
        void docResource.refresh();
      }
    }
    else if (selectedReference) void referenceResource.refresh();
  };

  const bookmarks = state.bookmarks ?? [];
  const bookmarkKey = selected ? encodeContentRef({ projectId, kind: "document", id: selected.id, path: selected.path, revision: selectedMeta?.revision }) : "";
  const bookmarked = Boolean(bookmarkKey && bookmarks.includes(bookmarkKey));
  const toggleBookmark = useCallback(() => {
    if (!bookmarkKey) return;
    void saveBookmark(bookmarkKey,!bookmarked);
  }, [bookmarkKey, bookmarked, saveBookmark]);

  const busy = selected ? metaResource.loading || (!readingScript && docResource.loading) : referenceResource.loading;
  const selectedIsScene = selectedMeta?.isScene === true;
  const readingPath = selected?.path || referenceResource.data?.path || selectedReference?.resourcePath || '';
  const readingTitle = selected?.title || selectedReference?.title || readingPath.split(/[\\/]/).filter(Boolean).at(-1) || '知识库';
  return <div className="reader-layout">
    <nav className="reader-nav" aria-label="资料入口">
      <strong className="reader-title">知识库</strong>
      {config?.resources?.map(resource => <button type="button" key={resource.path} aria-current={selectedReference?.resourcePath === resource.path || Boolean(selected && config.projectRoot && resource.path === `${config.projectRoot}/${selected.path}`)} onClick={() => openReference({ resourcePath: resource.path, title: resource.title })}>{resource.title}</button>)}
      <ResourceRegistration />
    </nav>
    <main className="reader-main">
      <div className="reader-toolbar">
        <Button size="sm" variant="tertiary" isDisabled={!history.length || busy} onPress={goBack}>← 返回</Button>
        {forward.length > 0 && <Button size="sm" variant="tertiary" isDisabled={busy} onPress={goForward}>前进 →</Button>}
        <details className="reader-path"><summary title="查看来源路径">{readingTitle}</summary><p style={{ margin: '6px 0' }}>{readingPath || '知识库'}</p></details>
        <Button size="sm" variant="tertiary" isDisabled={(!selected && !selectedReference) || busy} onPress={reloadDocument}>重新读取</Button>
        {selected && selectedIsScene && <Button size="sm" variant="tertiary" onPress={() => setScriptMode(!readingScript)}>{readingScript ? '查看场景原文' : '按对白阅读'}</Button>}
        {selected && <details className="reader-more"><summary aria-label="文件操作">⋯</summary><div className="reader-menu">
          <Button size="sm" variant="tertiary" onPress={toggleBookmark}>{bookmarked ? "取消收藏" : "收藏"}</Button>
          <Button size="sm" variant="tertiary" onPress={() => setShowRelations(showRelations === "backlinks" ? "none" : "backlinks")}>查看引用</Button>
          <Button size="sm" variant="tertiary" onPress={() => setShowRelations(showRelations === "graph" ? "none" : "graph")}>关系图</Button>
          <TodoShortcut onOpen={() => openContent({ kind: "todo", intent: "draft", context: { projectId, kind: "document", id: selected.id, path: selected.path, revision: selectedMeta?.revision } }, "todo")} />
        </div></details>}
        {busy && <Spinner size="sm" />}
      </div>
      {referenceTarget && !selected && <ReferenceTargetPanel target={referenceTarget} items={backlinkResource.items} page={backlinkResource} loading={backlinkResource.loading} error={backlinkResource.error} onOpen={openDocument} />}
      {selectedReference && <ReferenceDocumentPanel key={selectedReference.path || selectedReference.resourcePath} resource={selectedReference} document={referenceResource.data} loading={referenceResource.loading} error={referenceResource.error} onOpen={path => openReference({ ...selectedReference, path })} />}
      {selected && <>
        {showRelations !== "none" && <div className="reader-inspector"><Button size="sm" variant="tertiary" onPress={() => setShowRelations("none")}>关闭</Button>{showRelations === "backlinks" ? <BacklinksPanel items={backlinkResource.items} page={backlinkResource} loading={backlinkResource.loading} error={backlinkResource.error} onOpen={openDocument} /> : <GraphPanel data={graphResource.data} loading={graphResource.loading} depth={graphDepth} onDepthChange={setGraphDepth} onOpen={openGraphNode} />}</div>}
        <ErrorState error={metaResource.error || (!readingScript ? docResource.error : undefined)} />
        {readingScript && selectedMeta ? <ScriptSceneReader key={`${selected.path}:${selectedMeta.revision}:${scriptReloadToken}`} projectId={projectId} path={selected.path} revision={selectedMeta.revision} onRefresh={() => {
          setScriptMode(false);
          void metaResource.refresh();
          void docResource.refresh();
        }} onSourceLine={line => { setSelected(item => item ? { ...item, line } : item); setScriptMode(false); }} /> : docResource.data?.path === selected.path ? <MarkdownDocument projectId={projectId} document={docResource.data} focusLine={selected.line} focusAnchor={selected.anchor} openContent={navigateDocument} /> : <LoadingDocument />}
      </>}
    </main>
  </div>;
}

function LoadingRows() {
  return <div className="cg-loading-lines" aria-busy="true"><span /><span /><span /></div>;
}

function LoadingDocument() {
  return <ScrollShadow className="cg-document-scroll"><LoadingRows /></ScrollShadow>;
}

function ScriptSceneReader({ projectId, path, revision, onRefresh, onSourceLine }: { projectId: string; path: string; revision: string; onRefresh: () => void; onSourceLine: (line: number) => void }) {
  const noteApi = useNote<typeof import("./actions")>();
  const [offset, setOffset] = useState(0);
  const page = noteApi.useQuery('storyScenePage', { path, expectedRevision: revision, offset, limit: 24 });
  const content = page.data?.offset === offset ? page.data : undefined;
  return <div className="cg-script-reader">
    {page.error && <div className="cg-script-error" role="alert">场景原文已变化或无法读取。<Button size="sm" variant="tertiary" onPress={onRefresh}>返回原文并重新读取</Button><ErrorState error={page.error} /></div>}
    {page.loading && !content && <LoadingDocument />}
    {content && <>
      <div className="cg-script-heading"><strong>{content.title}</strong><span>{content.chapter || '未标注章节'} · {content.dialogueCount} 条对白 · 场景 {content.nodeId}</span><p>{content.summary}</p></div>
      {content.diagnostics.length > 0 && <div className="cg-script-error" role="alert">{content.diagnostics.map((item, index) => <p key={index}>{item.line ? `第 ${item.line} 行：` : ''}{item.detail}</p>)}</div>}
      <ScrollShadow className="cg-document-scroll cg-script-lines" key={offset}>
        {content.items.length === 0 ? <p className="cg-muted">此场景没有可读对白；叙述和选项请查看场景原文。</p> : content.items.map(item => <div className="cg-script-line" key={item.id}>
          <div><strong>{item.speakerName}</strong>{item.emotion && <span>{item.emotion}</span>}<Button size="sm" variant="tertiary" onPress={() => onSourceLine(item.line)}>原文第 {item.line} 行</Button></div>
          <p>{item.text}</p>
        </div>)}
      </ScrollShadow>
      <div className="cg-script-pager" aria-live="polite"><span>{content.dialogueCount ? `${content.offset + 1}–${content.offset + content.items.length} / ${content.dialogueCount}` : '0 条对白'}</span><Button size="sm" variant="tertiary" isDisabled={offset === 0 || page.loading} onPress={() => setOffset(value => Math.max(0, value - 24))}>上一页</Button><Button size="sm" variant="tertiary" isDisabled={content.nextOffset === undefined || page.loading} onPress={() => setOffset(content.nextOffset!)}>下一页</Button></div>
    </>}
  </div>;
}

function MarkdownDocument({ projectId, document, focusLine, focusAnchor, openContent }: { projectId: string; document: DocumentData; focusLine?: number; focusAnchor?: string; openContent: LibraryViewProps["openContent"] }) {
  const articleRef = useRef<HTMLElement>(null);
  const frontmatter = document.content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/u)?.[0] ?? '';
  const sourceLineOffset = frontmatter.match(/\n/gu)?.length ?? 0;
  const body = document.content.slice(frontmatter.length);
  useEffect(() => { articleRef.current?.parentElement?.scrollTo(0, 0); }, [document.path]);
  useEffect(() => {
    if (!articleRef.current) return;
    if (focusAnchor) {
      let anchor = focusAnchor;
      try { anchor = decodeURIComponent(anchor); } catch { /* Literal malformed escapes remain navigable. */ }
      [...articleRef.current.querySelectorAll<HTMLElement>("[id]")].find(element => element.id === anchor)?.scrollIntoView({ block: "start" });
      return;
    }
    if (!focusLine) return;
    const elements = [...articleRef.current.querySelectorAll<HTMLElement>("[data-source-line]")];
    const target = elements.reduce<HTMLElement | undefined>((nearest, element) => {
      const line = Number(element.dataset.sourceLine) + sourceLineOffset;
      if (!Number.isFinite(line)) return nearest;
      return !nearest || Math.abs(line - focusLine) < Math.abs(Number(nearest.dataset.sourceLine) + sourceLineOffset - focusLine) ? element : nearest;
    }, undefined);
    const viewport = articleRef.current.parentElement;
    if (target && viewport) {
      const targetRect = target.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      viewport.scrollTop += targetRect.top - viewportRect.top - (viewportRect.height - targetRect.height) / 2;
    }
  }, [document.content, focusLine, focusAnchor, sourceLineOffset]);
  return <ScrollShadow className="cg-document-scroll">
    <article className="cg-markdown" ref={articleRef}>
      <Markdown skipHtml remarkPlugins={[remarkGfm]} components={{
        h1: ({ children, node }) => <h1 {...sourceLineProps(node)} id={slugify(children)}>{children}</h1>,
        h2: ({ children, node }) => <h2 {...sourceLineProps(node)} id={slugify(children)}>{children}</h2>,
        h3: ({ children, node }) => <h3 {...sourceLineProps(node)} id={slugify(children)}>{children}</h3>,
        h4: ({ children, node }) => <h4 {...sourceLineProps(node)} id={slugify(children)}>{children}</h4>,
        h5: ({ children, node }) => <h5 {...sourceLineProps(node)} id={slugify(children)}>{children}</h5>,
        h6: ({ children, node }) => <h6 {...sourceLineProps(node)} id={slugify(children)}>{children}</h6>,
        p: ({ children, node }) => <p {...sourceLineProps(node)}>{children}</p>,
        li: ({ children, node }) => <li {...sourceLineProps(node)}>{children}</li>,
        blockquote: ({ children, node }) => <blockquote {...sourceLineProps(node)}>{children}</blockquote>,
        a: ({ href, children }) => {
          if (!href) return <span>{children}</span>;
          if (/^(https?:|mailto:)/i.test(href)) return <a href={href} target="_blank" rel="noreferrer">{children} ↗</a>;
          if (href.startsWith("#")) return <a href={href}>{children}</a>;
          const target = markdownContentTarget(document, href);
          return <a href={`#${slugify(children)}`} onClick={(event) => { event.preventDefault(); openContent(target.ref, target.noteKind); }}>{children}</a>;
        },
        img: ({ src, alt }) => <InlineImage projectId={projectId} from={document.path} src={typeof src === "string" ? src : ""} alt={alt || "图片"} />,
        pre: MarkdownPre,
      }}>{body}</Markdown>
    </article>
  </ScrollShadow>;
}

function ReferenceDocumentPanel({ resource, document, loading, error, onOpen }: { resource: { resourcePath: string; path?: string; title: string }; document?: import("@dsh-workbench/runtime").z.output<typeof import("./contract").referenceDocumentSchema>; loading: boolean; error?: Error | null; onOpen: (path: string) => void }) {
  if (document?.format && ![".md", ".markdown"].includes(document.format)) return <div className="cg-reference-document"><ErrorState error={error} /><ScrollShadow className="cg-document-scroll"><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 12 }}>{document.content}</pre></ScrollShadow></div>;
  return <div className="cg-reference-document"><ErrorState error={error} />{loading && <LoadingDocument />}{!loading && document && <ScrollShadow className="cg-document-scroll"><article className="cg-markdown"><Markdown skipHtml remarkPlugins={[remarkGfm]} components={{ pre: MarkdownPre, a: ({ href, children }) => { if (!href) return <span>{children}</span>; if (/^(https?:|mailto:)/i.test(href)) return <a href={href} target="_blank" rel="noreferrer">{children} ↗</a>; if (href.startsWith("#")) return <a href={href}>{children}</a>; const [path, anchor] = href.split("#", 2); return <a href={`#${anchor || ""}`} onClick={(event) => { event.preventDefault(); onOpen(resolveRelativePath(document.path || resource.resourcePath, path)); }}>{children}</a>; }, img: ({ src, alt }) => typeof src === "string" ? <img src={src} alt={alt || "图片"} loading="lazy" /> : <span className="cg-image-loading">图片</span> }}>{document.content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")}</Markdown></article></ScrollShadow>}</div>;
}

function InlineImage({ projectId, from, src, alt }: { projectId: string; from: string; src: string; alt: string }) {
  const noteApi = useNote<typeof import("./actions")>();
  const [expanded, setExpanded] = useState(false);
  const external = /^(https?:|data:|blob:)/i.test(src);
  // The backend resolves this path relative to `from` exactly once.
  const path = decodeMarkdownUrlPath(src.split("#", 1)[0]);
  const media = noteApi.useQuery("media", { path, from, variant: "thumbnail" }, { enabled: Boolean(src) && !external });
  const original = noteApi.useQuery("media", { path, from, variant: "original" }, { enabled: Boolean(src) && !external && expanded });
  const url = external ? src : mediaSource(media.data);
  const originalUrl = external ? src : mediaSource(original.data);
  if (media.error) return <span className="cg-error" role="img" aria-label={alt}>图片加载失败：{media.error.message}</span>;
  if (!url) return <span className="cg-image-loading" role="img" aria-label={alt}>正在加载图片…</span>;
  return <span><button type="button" className="cg-inline-image" title="查看原图" style={{ border: 0, padding: 0, background: "transparent", cursor: "zoom-in" }} onClick={() => setExpanded(true)}><img src={url} alt={alt} loading="lazy" /></button>{expanded && <span role="dialog" aria-label="原图" style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24, background: "rgba(0,0,0,.9)" }}><Button size="sm" onPress={() => setExpanded(false)}>关闭原图</Button>{original.error ? <span className="cg-error">{original.error.message}</span> : originalUrl ? <img src={originalUrl} alt={alt} style={{ maxWidth: "100%", maxHeight: "calc(100% - 50px)", objectFit: "contain", imageRendering: "pixelated" }} /> : <Spinner size="sm" />}</span>}</span>;
}

function ReferenceTargetPanel({ target, items, page, loading, error, onOpen }: { target: ReferenceTarget; items: BacklinkItem[]; page: import("./content-collection").CollectionPage; loading: boolean; error?: Error | null; onOpen: (item: { id?: string; path: string; line?: number }) => void }) {
  return <div className="cg-reference-target-panel"><div className="cg-document-head"><div className="cg-document-heading"><strong>{target.title}</strong><span>{target.kind === "asset" ? "资源" : "卡牌"} · {target.path || target.id}</span></div><span className="cg-muted">只读引用</span></div><p className="cg-reference-target-note">该内容由内容库管理，知识库只显示引用它的 Markdown 来源。</p><BacklinksPanel items={items} page={page} loading={loading} error={error} onOpen={onOpen} /></div>;
}

function BacklinksPanel({ items, page, loading, error, onOpen }: { items: BacklinkItem[]; page: import("./content-collection").CollectionPage; loading: boolean; error?: Error | null; onOpen: (item: { id?: string; path: string; line?: number }) => void }) {
  return <div className="cg-relation-panel"><div className="cg-panel-heading">反向链接 <span>{items.length}</span></div><ErrorState error={error} />{loading && <Spinner size="sm" />}{!loading && !error && !items.length && <span className="cg-muted">没有引用</span>}<ContentCollection items={items} label="反向链接" rowSize={60} itemClassName="cg-backlink-row" textValue={item => item.title || item.sourcePath || item.path || item.id} onSelect={id => { const item = items.find(item => item.id === id); if (item) onOpen({ id: item.sourceId || item.id, path: item.sourcePath || item.path || item.id, line: item.line }); }} renderItem={item => <><strong>{item.title || item.sourcePath || item.path}</strong><span>{item.snippet || (item.line ? `第 ${item.line} 行` : "打开来源")}</span></>} /><CollectionPagination page={page} label="反向链接" /></div>;
}

function GraphPanel({ data, loading, depth, onDepthChange, onOpen }: { data?: GraphData; loading: boolean; depth: 1 | 2; onDepthChange: (depth: 1 | 2) => void; onOpen: (item: LibraryItem & { kind?: ContentKind; type?: ContentKind }) => void }) {
  const nodes = (data?.nodes ?? []).slice(0, MAX_GRAPH_NODES);
  const edges = (data?.edges ?? []).slice(0, 400);
  const positions = useMemo(() => {
    const centerX = 320, centerY = 122, radius = Math.min(100, Math.max(42, nodes.length * 7));
    return nodes.map((node, index) => {
      const angle = nodes.length <= 1 ? 0 : (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
      return { node, x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
    });
  }, [nodes]);
  const lookup = useMemo(() => {
    const map = new Map<string, (typeof positions)[number]>();
    positions.forEach(position => { map.set(position.node.id, position); if (position.node.path) map.set(position.node.path, position); });
    return map;
  }, [positions]);
  const graphEdges = edges.map(edge => ({ source: lookup.get(edge.sourceId || ""), target: lookup.get(edge.targetId || edge.targetPath || "") })).filter(edge => edge.source && edge.target);
  return <div className="cg-relation-panel"><div className="cg-panel-heading"><span>局部关系图</span><span>{nodes.length}{data?.truncated ? "+" : ""} 节点 · {depth} 层</span></div><div className="cg-graph-actions"><Button size="sm" variant={depth === 1 ? "primary" : "tertiary"} onPress={() => onDepthChange(1)}>1 层</Button><Button size="sm" variant={depth === 2 ? "primary" : "tertiary"} onPress={() => onDepthChange(2)}>2 层</Button></div>{loading && <Spinner size="sm" />}{!loading && !nodes.length && <span className="cg-muted">暂无关系</span>}{Boolean(nodes.length) && <svg className="cg-graph-svg" viewBox="0 0 640 244" role="img" aria-label={`包含 ${nodes.length} 个节点和 ${graphEdges.length} 条有向边的局部关系图`}><defs><marker id="cg-graph-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="var(--wb-accent)" /></marker></defs>{graphEdges.map((edge, index) => <line key={`${edge.source?.node.id}:${edge.target?.node.id}:${index}`} x1={edge.source?.x} y1={edge.source?.y} x2={edge.target?.x} y2={edge.target?.y} markerEnd="url(#cg-graph-arrow)" />)}{positions.map(position => <g key={position.node.id} className="cg-graph-svg-node" role="button" tabIndex={0} aria-label={`打开 ${itemLabel(position.node)}`} onClick={() => onOpen(position.node)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(position.node); } }}><circle cx={position.x} cy={position.y} r="19" /><text x={position.x} y={position.y + 3} textAnchor="middle">{truncateGraphLabel(itemLabel(position.node))}</text></g>)}</svg>}</div>;
}


function sourceLineProps(node: unknown): { "data-source-line"?: number } {
  const position = recordValue(node && typeof node === "object" ? (node as Record<string, unknown>).position : undefined);
  const start = recordValue(position?.start);
  const line = start?.line;
  return typeof line === "number" && Number.isFinite(line) ? { "data-source-line": line } : {};
}

function truncateGraphLabel(value: string): string {
  return value.length > 12 ? `${value.slice(0, 11)}…` : value;
}

function slugify(children: ReactNode): string {
  const text = plainText(children).trim().toLowerCase();
  return text.replace(/\s+/g, "-").replace(/[^\p{L}\p{N}_-]/gu, "");
}

function plainText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(plainText).join("");
  if (value && typeof value === "object" && "props" in value) return plainText((value.props as { children?: ReactNode }).children);
  return "";
}

function CardsView({ projectId, state, query, setState, openContent, actions, focusRef, focusRequestId }: LibraryViewProps) {
  const noteApi = useNote<typeof import("./actions")>();
  const workbench = noteApi.host;
  const [showDecks, setShowDecks] = useState(false);
  const [deckCardFocus, setDeckCardFocus] = useState<string>();
  const [view, setView] = useState<"table" | "grid">(state.views?.cards ?? "grid");
  const [selectedIds, setSelectedIds] = useState<string[]>(() => state.views?.cardsSelection ?? []);
  const [cardError, setCardError] = useState<Error>();
  const [filterKind, setFilterKind] = useState("");
  const [filterRarity, setFilterRarity] = useState("");
  const featureChoices = noteApi.useQuery('featureChoices', {}, { enabled: Boolean(projectId) });
  const cardListResource = noteApi.usePagedQuery("cards", ({ query, kind: filterKind || undefined, rarity: filterRarity || undefined, limit: PAGE_SIZE }), { enabled: Boolean(projectId) });
  const selectedId = selectedIds.at(-1);
  const cardResource = noteApi.useQuery("card", (selectedId ? { id: selectedId } : {}), { enabled: Boolean(selectedId) });
  const projectGeneration = cardResource.data?.projectGeneration ?? (cardListResource.data as ContentQueryOutput<'cards'> | undefined)?.projectGeneration;
  const cardSourceText = cardResource.data ? JSON.stringify(cardResource.data.json, null, 2) : '';
  const draftKey = `card-workflow:${noteApi.metadata.id}:${projectId}:${projectGeneration ?? 'pending'}:${selectedId ?? ''}`;
  // This draft creates a production; the source card is never its save target.
  // Keep every user-selected command input in the recoverable business value.
  const editor = useNoteDraft({ key: draftKey,
    value: { text: cardSourceText, featureId: '', itemId: selectedId ?? '', projectId, projectGeneration: projectGeneration ?? '' },
    revision: cardResource.data?.revision,
    command: {
      action: actions.createCardWorkflow,
      input: (value, context) => {
        if (!value.itemId) throw new Error('请先选择卡牌');
        if (!value.featureId) throw new Error('请先选择已有功能');
        if (!value.projectGeneration || typeof context.revision !== 'string') throw new Error('来源版本尚未就绪，请等待卡牌读取完成');
        return { itemIds: [value.itemId], featureId: value.featureId, draft: jsonObject.parse(JSON.parse(value.text)), expectedRevision: context.revision, requestId: context.requestId, projectGeneration: value.projectGeneration };
      },
      receipt: (result, value) => {
        const target = decodeContentRef(result.itemId);
        if (!result.noteId || target?.projectId !== value.projectId || target.kind !== 'production' || !target.id) throw new Error('制作单保存回执无效，请核对创建结果');
        return { value };
      },
    } });
  const featureId = editor.value.featureId;
  const cardDraft = editor.value.text;
  const owner = useRef<symbol | undefined>(undefined), displayed = useRef(false), opening = useRef<symbol | undefined>(undefined);
  useInsertionEffect(() => { const token = Symbol(); owner.current = token; return () => { if (owner.current === token) owner.current = undefined; }; }, [draftKey]);
  useEffect(() => { displayed.current = true; return () => { displayed.current = false; }; }, []);
  const cardDirty = editor.dirty || editor.saving;
  const visiblePages = cardListResource.items;
  const appliedFocus = useRef<{ref?: ContentRef; requestId?: number} | undefined>(undefined);

  const selectCard = useCallback((id: string, query?:string) => {
    if (selectedId !== id && cardDirty && typeof window !== "undefined" && !window.confirm("当前卡牌 JSON 有未保存草稿，确定切换卡牌吗？")) return false;
    if (selectedId !== id && cardDirty) {
      editor.reset();
      setCardError(undefined);
    }
    const next = [id];
    setSelectedIds(next);
    void setState({ ...(query!==undefined?{query}:{}),views:{cardsSelection:next} });
  }, [cardDirty, selectedId, setState]);



  useEffect(() => {
    if (appliedFocus.current?.ref === focusRef && appliedFocus.current?.requestId === focusRequestId) return;
    if (!focusRef) {
      appliedFocus.current = {ref: focusRef, requestId: focusRequestId};
      return;
    }
    if (focusRef.projectId !== projectId || focusRef.kind !== "card" || (!focusRef.id && !focusRef.path)) return;
    appliedFocus.current = {ref: focusRef, requestId: focusRequestId};
    cardListResource.reset();
    setShowDecks(false);
    setDeckCardFocus(undefined);
    if (focusRef.id) selectCard(focusRef.id,focusRef.path);
    else if(focusRef.path)void setState({query:focusRef.path});
  }, [focusRef, focusRequestId, projectId, selectCard, setState]);

  const submitSearch = useCallback((value: string) => {
    void setState({ query: value });
  }, [setState]);


  async function openSavedCard(token = owner.current) {
    const target = editor.getResult();
    if (!target || !token || owner.current !== token || !displayed.current || opening.current === token) return;
    opening.current = token;
    try { await workbench.openNote(target.noteId, target.itemId); if (owner.current === token && displayed.current) setCardError(undefined); }
    catch (cause) { if (owner.current === token && displayed.current) setCardError(new Error(`制作单已保存，打开失败：${cause instanceof Error ? cause.message : String(cause)}`)); }
    finally { if (opening.current === token) opening.current = undefined; }
  }
  async function updateCard() {
    const token = owner.current;
    setCardError(undefined);
    if (await editor.save()) await openSavedCard(token);
  }

  const cardViewState = (next: "table" | "grid") => { setView(next); void setState({ views: { cards: next } }); };

  if (showDecks) return <DeckWorkspace projectId={projectId} onBack={() => setShowDecks(false)} onCard={id => { if (selectCard(id) !== false) { setDeckCardFocus(id); setShowDecks(false); } }} />;

  return <CardsWorkspace onOpenDecks={() => setShowDecks(true)}
    projectId={projectId} cards={visiblePages} activeCard={cardResource.data ?? visiblePages.find(item => item.id === selectedId)} selectedId={selectedId} focusRequestId={focusRequestId} focusId={deckCardFocus || (focusRef?.kind === "card" ? focusRef.id : undefined)}
    query={query} kind={filterKind} rarity={filterRarity} total={cardListResource.total} loading={cardListResource.loading} error={cardListResource.error}
    dirty={cardDirty} page={cardListResource} view={view} onSearch={submitSearch} onView={cardViewState} onSelect={selectCard}
    onFilters={(kind, rarity) => { setFilterKind(kind); setFilterRarity(rarity); }}
    renderRecent={open => <RecentChanges projectId={projectId} mode="cards" onLocate={item => { if (item.kind === "card" && item.id) open(item.id); }} />}
    renderActions={itemIds => <>{(selectedId || itemIds.length > 0) && <div className="cg-inline-actions cg-selection-actions"><select className="cg-select" aria-label="所属功能" value={featureId} onChange={event => { const featureId = event.target.value; editor.set(previous => ({ ...previous, featureId })); }}><option value="">选择已有功能</option>{(featureChoices.data?.items ?? []).map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select>{itemIds.length > 0 && <CreateCardWorkflow projectId={projectId} itemIds={itemIds} featureId={featureId} disabled={editor.saving || cardDraft !== cardSourceText} />}{featureChoices.error && <span className="cg-error" role="alert">{featureChoices.error.message}</span>}</div>}</>}
    renderComparison={cards => <CardComparison cards={cards} />}
    detail={<>{editor.result && <Button variant="secondary" onPress={() => { void openSavedCard(); }}>打开已保存制作单</Button>}        {cardResource.data && <LibraryCardFace card={cardResource.data} />}
         {selectedId && <CardDetailPanel card={cardResource.data} fallback={visiblePages.find(item => item.id === selectedId)} draft={cardDraft} dirty={cardDirty} saving={editor.saving} canSave={Boolean(featureId && editor.value.projectGeneration && editor.value.text)} error={editor.error || cardError || cardResource.error} onDraft={text => editor.set(previous => ({ ...previous, text }))} onSave={() => void updateCard()} onOpenKnowledge={(path) => openContent({ kind: "card", id: selectedId, path, intent: "backlinks", context: { cardId: selectedId } }, "knowledge")} onOpenTodo={() => openContent({ kind: "todo", intent: "draft", context: { projectId, kind: "card", id: selectedId, revision: cardResource.data?.revision } }, "todo")} />}</>}
  />;
}

function LibraryCardFace({ card }: { card: CardData }) {
  const noteApi = useNote<typeof import("./actions")>();
  const face = recordValue(card.json.cardFace);
  const variants = recordValue(face?.variants);
  const theme = typeof face?.themeId === 'string' ? face.themeId : 'jade';
  const [previewTheme, setPreviewTheme] = useState(theme);
  useEffect(() => setPreviewTheme(theme), [card.id, theme]);
  const preview = recordValue(variants?.[previewTheme])?.preview;
  const path = typeof preview === 'string' ? preview : undefined;
  const media = noteApi.useQuery('media', { path: path ? 'public' + path : undefined, variant: 'original' }, { enabled: Boolean(path) });
  if (!face || !variants) return null;
  return <div style={{ display: 'grid', justifyItems: 'center', gap: 10, padding: '12px 0 20px' }}>{media.data?.url && <img src={media.data.url} alt={card.name + '卡面'} style={{ width: 'min(100%, 260px)' }} />}<div className="cg-inline-actions" aria-label="预览卡面主题">{Object.keys(variants).map(themeId => <Button key={themeId} size="sm" variant={previewTheme === themeId ? 'primary' : 'secondary'} onPress={() => setPreviewTheme(themeId)}>{themeId === 'jade' ? '青玉' : themeId === 'scroll' ? '宣纸' : themeId}</Button>)}</div><small className="cg-muted">主题预览 · 通过制作单建立改动候选</small>{media.error && <span className="cg-error" role="alert">{media.error.message}</span>}</div>;
}


function CardDetailPanel({ card, fallback, draft, dirty, saving, canSave, error, onDraft, onSave, onOpenKnowledge, onOpenTodo }: { card?: CardData; fallback?: CardItem; draft: string; dirty: boolean; saving: boolean; canSave: boolean; error?: Error | null; onDraft: (value: string) => void; onSave: () => void; onOpenKnowledge: (path: string) => void; onOpenTodo: () => void }) {
  const sourceEditor = <details className="cg-card-source" open={dirty}><summary>高级：查看与编辑原始数据{dirty ? " · 未保存" : ""}</summary><label className="cg-editor-label">原始 JSON <textarea className="cg-editor cg-json-editor" aria-label="卡牌原始 JSON" value={draft} onChange={event => onDraft(event.target.value)} spellCheck={false} /></label><Button size="sm" variant="primary" isDisabled={!dirty || !canSave || saving} onPress={onSave}>保存到制作单</Button></details>;
  const item = card || fallback;
  if (!item) return draft ? <div className="cg-detail-panel"><p className="cg-muted">卡牌来源暂不可用，已保留的草稿仍可核对保存结果。</p><ErrorState error={error} />{sourceEditor}</div> : <EmptyState text="卡牌加载中" />;
  const sourcePath = card?.path || fallback?.path;
  return <div className="cg-detail-panel"><div className="cg-detail-heading"><div><strong>{item.name || item.title || item.id}</strong><span>{item.id} · {item.kind || "未分类"} · {item.rarity || "—"}</span></div>{dirty && <span className="cg-warning">未保存</span>}</div><div className="cg-card-fields"><span>费用 <b>{item.cost ?? "—"}</b></span><span>标签 <b>{item.labels?.join("、") || "—"}</b></span><span>版本 <b>{item.revision?.slice(0, 10) || "—"}</b></span></div><div className="cg-inline-actions">{sourcePath && <Button size="sm" variant="tertiary" onPress={() => onOpenKnowledge(sourcePath)}>在知识库打开</Button>}<TodoShortcut onOpen={onOpenTodo} /></div><ErrorState error={error} />{sourceEditor}</div>;
}

function CardComparison({ cards }: { cards: CardItem[] }) {
  return <div className="cg-compare-panel"><div className="cg-panel-heading">选中比较 <span>{cards.length} / 3</span></div><div className="cg-compare-grid">{cards.map(card => <ComparedCard key={card.id} card={card} />)}</div></div>;
}

function ComparedCard({ card }: { card: CardItem }) {
  const noteApi = useNote<typeof import("./actions")>();
  const detail = noteApi.useQuery("card", { id: card.id });
  return <div><strong>{card.name || card.title || card.id}</strong>{detail.loading && <Spinner size="sm" />}<ErrorState error={detail.error} />{detail.data && <pre>{JSON.stringify(detail.data.json, null, 2)}</pre>}</div>;
}

function AssetsView({ projectId, state, query, setState, saveBookmark, saveNamedFilter, openContent, actions, focusRef, focusRequestId }: LibraryViewProps) {
  const noteApi = useNote<typeof import("./actions")>();
  const [view, setView] = useState<"grid" | "list">(state.views?.assets ?? "grid");
  const [selectedId, setSelectedId] = useState<string | undefined>(() => state.views?.assetsSelection);
  const [filter, setFilter] = useState<AssetFilters>({ name: "当前筛选" });
  const [showFilter, setShowFilter] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string>();
  const [selectedVersionId, setSelectedVersionId] = useState<string>();
  const [versionTarget, setVersionTarget] = useState<string>();
  const filters = state.views?.assetsFilters ?? [];
  const listResource = noteApi.usePagedQuery("assets", ({ query, ...assetQuery(filter), limit: PAGE_SIZE }), { enabled: Boolean(projectId) });
  const assetResource = noteApi.useQuery("asset", (selectedId ? { id: selectedId } : {}), { enabled: Boolean(selectedId) });
  const versionOwner = noteApi.useQuery("asset", {versionId: versionTarget}, {enabled: Boolean(versionTarget)});
  const versionsResource = noteApi.usePagedQuery("versions", (selectedId ? { id: selectedId, limit: PAGE_SIZE } : {}), { enabled: Boolean(selectedId) });
  const visibleAssets = listResource.items;
  const appliedFocus = useRef<{ref?: ContentRef; requestId?: number} | undefined>(undefined);

  useEffect(() => {
    if (appliedFocus.current?.ref === focusRef && appliedFocus.current?.requestId === focusRequestId) return;
    if (!focusRef) {
      appliedFocus.current = {ref: focusRef, requestId: focusRequestId};
      return;
    }
    if (focusRef.projectId !== projectId || focusRef.kind !== "asset" || !focusRef.id) return;
    appliedFocus.current = {ref: focusRef, requestId: focusRequestId};
    listResource.reset();
    if (focusRef.context?.changeKind === 'version') {setVersionTarget(focusRef.id); return;}
    setVersionTarget(undefined);
    setSelectedId(focusRef.id);
    void setState({ views: { assetsSelection: focusRef.id } });
    setSelectedVersionId(undefined);
    setPlayingAudioId(undefined);
  }, [focusRef, focusRequestId, projectId, setState, state.views]);

  useEffect(() => {
    if (!versionTarget || !versionOwner.data) return;
    selectAsset(versionOwner.data.id);
    setSelectedVersionId(versionTarget);
  }, [versionTarget, versionOwner.data]);

  const submitSearch = useCallback((value: string) => {
    void setState({ query: value });
  }, [setState]);

  const changeView = (next: "grid" | "list") => { setView(next); void setState({ views: { assets: next } }); };
  const applyFilter = (next: AssetFilters) => { setFilter(next); setShowFilter(false); };
  const saveFilter = (value: AssetFilters) => { void saveNamedFilter(value); };
  const selectAsset = (id: string) => { setVersionTarget(undefined); setSelectedId(id); void setState({ views: { assetsSelection: id } }); setSelectedVersionId(undefined); setPlayingAudioId(undefined); };
  const locateChange = (item: RecentChangeItem) => { if (!item.id) return; if (item.kind === 'version') setVersionTarget(item.id); else if (item.kind === 'asset') selectAsset(item.id); };
  const selected = visibleAssets.find(item => item.id === selectedId);
  const selectedAsset = assetResource.data ?? selected;
  const bookmarkKey = selectedAsset ? encodeContentRef({ projectId, kind: "asset", id: selectedAsset.id, path: selectedAsset.path, revision: selectedAsset.revision }) : "";
  const bookmarked = Boolean(bookmarkKey && (state.bookmarks ?? []).includes(bookmarkKey));
  const toggleBookmark = () => { if(bookmarkKey)void saveBookmark(bookmarkKey,!bookmarked); };

  return <div className="cg-workspace cg-assets">
    <RecentChanges projectId={projectId} mode="assets" onLocate={locateChange} />
    {versionOwner.loading && <p role="status">正在定位资源版本…</p>}<ErrorState error={versionOwner.error} />
    <Toolbar search={query} onSearch={submitSearch} searchPlaceholder="搜索资源名称、标签、格式或类型" searchLabel="搜索资源库">
      <ToggleButton active={view === "grid"} onPress={() => changeView("grid")} label="网格视图">网格</ToggleButton>
      <ToggleButton active={view === "list"} onPress={() => changeView("list")} label="列表视图">列表</ToggleButton>
      <Button size="sm" variant={showFilter ? "primary" : "tertiary"} onPress={() => setShowFilter(!showFilter)}>筛选</Button>
    </Toolbar>
    {showFilter && <AssetFilterPanel filter={filter} saved={filters} onApply={applyFilter} onSave={saveFilter} />}
     <div className="cg-card-summary"><span>{typeof listResource.total === "number" ? `${visibleAssets.length} / ${listResource.total.toLocaleString("zh-CN")} 项资源` : `已载入 ${visibleAssets.length} 项`}</span><span>当前版本</span></div>
    <div className="cg-assets-layout">
      <main className="cg-asset-list">
        <ContentCollection items={visibleAssets} label="资源库" layout={view === "grid" ? "grid" : "stack"}
          className="cg-asset-collection" itemClassName={view === "grid" ? "cg-asset-tile" : "cg-asset-list-row"}
          selectedIds={selectedId ? [selectedId] : []} onSelect={selectAsset}
          rowSize={72} tileSize={[145, 196]} textValue={asset => asset.name || asset.title || asset.id}
          empty={listResource.loading ? <LoadingRows /> : <EmptyState text="没有找到资源" detail="可以按类型、格式、尺寸、时长或版本状态筛选。" />}
          renderItem={asset => view === "grid" ? <AssetTile asset={asset} playing={playingAudioId === asset.id} onPlay={() => { selectAsset(asset.id); setPlayingAudioId(playingAudioId === asset.id ? undefined : asset.id); }} /> : <AssetListRow asset={asset} />} />
        <ErrorState error={listResource.error} />
        <CollectionPagination page={listResource} label="资源" />
      </main>
       <aside className="cg-asset-detail">
        {!selectedId && visibleAssets.length > 0 && <EmptyState text="选择资源查看详情" />}
         {selectedId && <AssetDetailPanel projectId={projectId} asset={selectedAsset} versions={versionsResource.items} versionPage={versionsResource} selectedVersionId={selectedVersionId} setSelectedVersionId={setSelectedVersionId} playingAudioId={playingAudioId} setPlayingAudioId={setPlayingAudioId} bookmarked={bookmarked} onBookmark={toggleBookmark} onOpenKnowledge={(path, context) => openContent({ kind: "asset", id: selectedId, path, intent: "backlinks", context: { assetId: selectedId, ...context } }, "knowledge")} onOpenTodo={() => openContent({ kind: "todo", intent: "draft", context: { projectId, kind: "asset", id: selectedId, revision: selectedAsset?.revision } }, "todo")} />}
      </aside>
    </div>
  </div>;
}

function assetQuery(filter: AssetFilters) {
  return {
    kind: filter.kind || undefined,
    mimeType: filter.mimeType || undefined,
    format: filter.format || undefined,
    minWidth: filter.minWidth,
    maxWidth: filter.maxWidth,
    minDurationMs: filter.minDurationMs,
    maxDurationMs: filter.maxDurationMs,
    status: filter.status || undefined,
  };
}

function AssetTile({ asset, playing, onPlay }: { asset: AssetItem; playing: boolean; onPlay: () => void }) {
  return <><div className="cg-thumb"><MediaThumbnail asset={asset} variant="thumbnail" /><span className="cg-asset-kind">{asset.kind || asset.mimeType || "资源"}</span></div><strong className="cg-ellipsis">{asset.name || asset.title || asset.id}</strong><small>{asset.width && asset.height ? `${asset.width} × ${asset.height}` : asset.durationMs ? formatDuration(asset.durationMs) : asset.format || ""}</small>{isAudioAsset(asset) && <Button size="sm" variant="tertiary" className="cg-tile-audio" onPress={onPlay} aria-label={playing ? `暂停试听 ${asset.name || asset.id}` : `试听 ${asset.name || asset.id}`}>{playing ? "暂停试听" : "试听"}</Button>}</>;
}

function AssetListRow({ asset }: { asset: AssetItem }) {
  return <><span className="cg-list-thumb"><MediaThumbnail asset={asset} variant="thumbnail" /></span><span className="cg-asset-list-main"><strong>{asset.name || asset.title || asset.id}</strong><small>{asset.kind || asset.mimeType || "资源"} · {asset.format || ""}</small></span><span>{asset.width && asset.height ? `${asset.width}×${asset.height}` : "—"}</span><span>{asset.frameCount ? `${asset.frameCount} 帧` : asset.durationMs ? formatDuration(asset.durationMs) : "—"}</span><span>{asset.revision?.slice(0, 10) || "—"}</span></>;
}

function MediaThumbnail({ asset, variant }: { asset: AssetItem; variant: "thumbnail" | "original" | "waveform" }) {
  const noteApi = useNote<typeof import("./actions")>();
  const media = noteApi.useQuery("media", ({ id: asset.id, versionId: asset.currentVersionId, path: asset.path, variant }), { enabled: Boolean(asset.id) });
  const url = mediaSource(media.data);
  if (isAudioAsset(asset) && variant === "thumbnail") return <span className="cg-audio-thumb">♫</span>;
  if (media.error) return <span role="status">预览不可用</span>;
  if (!url) return <span className="cg-media-loading" aria-label="媒体加载中">…</span>;
  return <ImagePreview src={url} alt={asset.name || asset.title || asset.id} loading="lazy" />;
}

const AUDIO_WAVEFORM_LIMIT = 20 * 1024 * 1024;

interface AudioWaveformState {
  bars?: number[];
  loading: boolean;
  error?: string;
}

function useAudioWaveform(url: string | undefined, enabled: boolean): AudioWaveformState {
  const [state, setState] = useState<AudioWaveformState>({ loading: false });
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    let audioContext: AudioContext | undefined;
    if (!enabled || !url) {
      setState({ loading: false });
      return () => controller.abort();
    }
    setState({ loading: true });
    const load = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`音频读取失败（${response.status}）`);
        const contentLength = Number(response.headers.get("content-length"));
        if (Number.isFinite(contentLength) && contentLength > AUDIO_WAVEFORM_LIMIT) {
          throw new Error("音频超过 20 MB，已保留播放器，暂不生成波形");
        }
        const bytes = await response.arrayBuffer();
        if (bytes.byteLength > AUDIO_WAVEFORM_LIMIT) {
          throw new Error("音频超过 20 MB，已保留播放器，暂不生成波形");
        }
        const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextCtor) throw new Error("当前环境不支持波形解析，已保留播放器");
        audioContext = new AudioContextCtor();
        const decoded = await audioContext.decodeAudioData(bytes.slice(0));
        if (cancelled) return;
        setState({ loading: false, bars: waveformBars(decoded) });
      } catch (cause) {
        if (cancelled || (cause instanceof DOMException && cause.name === "AbortError")) return;
        setState({ loading: false, error: cause instanceof Error ? cause.message : "波形不可用，已保留播放器" });
      } finally {
        if (audioContext) await audioContext.close().catch(() => undefined);
      }
    };
    void load();
    return () => {
      cancelled = true;
      controller.abort();
      void audioContext?.close().catch(() => undefined);
    };
  }, [enabled, url]);
  return state;
}

function waveformBars(buffer: AudioBuffer, count = 96): number[] {
  const bars: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const start = Math.floor(index * buffer.length / count);
    const end = Math.max(start + 1, Math.floor((index + 1) * buffer.length / count));
    let peak = 0;
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const data = buffer.getChannelData(channel);
      for (let sample = start; sample < Math.min(end, data.length); sample += 1) peak = Math.max(peak, Math.abs(data[sample]));
    }
    bars.push(Math.max(0.04, Math.min(1, peak)));
  }
  return bars;
}

function AudioWaveform({ state }: { state: AudioWaveformState }) {
  if (state.loading) return <span className="cg-muted">正在解析波形…</span>;
  if (state.error) return <span className="cg-muted">{state.error}</span>;
  if (!state.bars?.length) return <span className="cg-muted">暂无波形</span>;
  return <svg className="cg-waveform" viewBox="0 0 96 1" preserveAspectRatio="none" role="img" aria-label="音频波形">{state.bars.map((bar, index) => <rect key={index} x={index} y={(1 - bar) / 2} width={0.72} height={bar} rx={0.08} />)}</svg>;
}

interface SpriteLayout {
  columns: number;
  rows: number;
  frameWidth: number;
  frameHeight: number;
  imageWidth: number;
  imageHeight: number;
}

function spriteLayout(asset: AssetData, media: MediaData, frameCount: number): SpriteLayout | undefined {
  const metadata = recordValue(media.metadata) || recordValue(asset.metadata);
  const imageWidth = positiveNumber(media.width) || positiveNumber(asset.width) || positiveNumber(recordNumber(metadata, "width"));
  const imageHeight = positiveNumber(media.height) || positiveNumber(asset.height) || positiveNumber(recordNumber(metadata, "height"));
  if (!imageWidth || !imageHeight) return undefined;
  const columns = positiveInteger(recordNumber(metadata, "columns")) || Math.max(1, Math.ceil(Math.sqrt(frameCount)));
  const rows = positiveInteger(recordNumber(metadata, "rows")) || Math.max(1, Math.ceil(frameCount / columns));
  const frameWidth = positiveNumber(recordNumber(metadata, "frameWidth")) || Math.floor(imageWidth / columns);
  const frameHeight = positiveNumber(recordNumber(metadata, "frameHeight")) || Math.floor(imageHeight / rows);
  if (!frameWidth || !frameHeight) return undefined;
  return { columns, rows, frameWidth, frameHeight, imageWidth, imageHeight };
}

function SpriteFrame({ asset, media, url, frame, frameCount, zoom }: { asset: AssetData; media: MediaData; url: string; frame: number; frameCount: number; zoom: number }) {
  const layout = spriteLayout(asset, media, frameCount);
  if (!layout) return <span className="cg-muted">媒体缺少帧尺寸，无法裁剪预览</span>;
  const column = frame % layout.columns;
  const row = Math.floor(frame / layout.columns);
  const width = layout.frameWidth * zoom;
  const height = layout.frameHeight * zoom;
  return <div className="cg-sprite-frame" style={{ width, height }}><img src={url} alt={`${asset.name || asset.title || asset.id} 第 ${frame + 1} 帧`} style={{ width: layout.imageWidth * zoom, height: layout.imageHeight * zoom, maxWidth: "none", maxHeight: "none", transform: `translate(-${column * width}px, -${row * height}px)` }} /></div>;
}

function recordValue(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function recordNumber(record: Record<string, unknown> | undefined, key: string): number | undefined {
  return positiveNumber(record?.[key]);
}

function positiveNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

function positiveInteger(value: unknown): number | undefined {
  const number = positiveNumber(value);
  return number && Number.isInteger(number) ? number : undefined;
}

function AssetDetailPanel({ projectId, asset, versions, versionPage, selectedVersionId, setSelectedVersionId, playingAudioId, setPlayingAudioId, bookmarked, onBookmark, onOpenKnowledge, onOpenTodo }: { projectId: string; asset?: AssetData; versions: VersionItem[]; versionPage: import("@dsh-workbench/react").PagedQueryResult<VersionItem>; selectedVersionId?: string; setSelectedVersionId: (id: string | undefined) => void; playingAudioId?: string; setPlayingAudioId: (id: string | undefined) => void; bookmarked: boolean; onBookmark: () => void; onOpenKnowledge: (path: string, context?: Record<string, unknown>) => void; onOpenTodo: () => void }) {
  const noteApi = useNote<typeof import("./actions")>();
  const [showVersions, setShowVersions] = useState(false);
  const [zoom, setZoom] = useState<1 | 2 | 4 | 8>(1);
  const [frame, setFrame] = useState(0);
  const [speed, setSpeed] = useState(8);
  const [loop, setLoop] = useState(true);
  const [playingFrames, setPlayingFrames] = useState(false);
  const media = noteApi.useQuery("media", (asset ? { id: asset.id, versionId: selectedVersionId || asset.currentVersionId, path: asset.path, variant: "original" } : {}), { enabled: Boolean(asset) });
  const frameCount = media.data?.frameCount || asset?.frameCount || 1;
  const url = mediaSource(media.data);
  const audio = Boolean(asset && isAudioAsset(asset));
  const waveform = useAudioWaveform(audio ? url : undefined, audio);
  useEffect(() => {
    if (!playingFrames || frameCount <= 1) return;
    const timer = window.setInterval(() => setFrame(current => { const next = current + 1; if (next >= frameCount) return loop ? 0 : current; return next; }), Math.max(40, 1000 / Math.max(1, speed)));
    return () => window.clearInterval(timer);
  }, [frameCount, loop, playingFrames, speed]);
  if (!asset) return <EmptyState text="资源加载中" />;
  const sourcePath = media.data?.path || versions.find(version => version.id === (selectedVersionId || asset.currentVersionId))?.path || asset.path;
  const sprite = frameCount > 1 || /sprite|sheet|animation/i.test(String(asset.kind || ""));
  return <div className="cg-asset-detail-panel"><div className="cg-detail-heading"><div><strong>{asset.name || asset.title || asset.id}</strong><span>{asset.kind || asset.mimeType || "资源"}</span></div><Button size="sm" variant={bookmarked ? "primary" : "tertiary"} onPress={onBookmark}>{bookmarked ? "已收藏" : "收藏"}</Button></div><div className="cg-media-stage">{audio ? <div className="cg-audio-stage"><span className="cg-audio-glyph">♫</span>{url && <AudioPreview src={url} autoPlay={playingAudioId === asset.id} onPlay={() => setPlayingAudioId(asset.id)} onPause={() => setPlayingAudioId(undefined)} onEnded={() => setPlayingAudioId(undefined)} />}{url && <AudioWaveform state={waveform} />}</div> : url ? <div className={`cg-image-stage${sprite ? " is-sprite" : ""}`}>{sprite ? <SpriteFrame asset={asset} media={media.data!} url={url} frame={frame} frameCount={frameCount} zoom={zoom} /> : <ImagePreview retry src={url} alt={asset.name || asset.title || asset.id} style={{ imageRendering: "pixelated", transform: `scale(${zoom})` }} />}</div> : <span className="cg-media-loading">正在加载媒体…</span>}</div>{url && !audio && <div className="cg-sprite-controls"><label>缩放 <select value={zoom} onChange={event => setZoom(Number(event.target.value) as 1 | 2 | 4 | 8)}><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option><option value={8}>8×</option></select></label>{sprite && <><label>帧 <input type="number" min={0} max={Math.max(0, frameCount - 1)} value={frame} onChange={event => setFrame(Math.max(0, Math.min(frameCount - 1, Number(event.target.value))))} /></label><label>速度 <input type="number" min={1} max={60} value={speed} onChange={event => setSpeed(Number(event.target.value) || 8)} /></label><label className="cg-check"><input type="checkbox" checked={loop} onChange={event => setLoop(event.target.checked)} />循环</label><Button size="sm" variant={playingFrames ? "primary" : "tertiary"} onPress={() => setPlayingFrames(value => !value)}>{playingFrames ? "暂停帧" : "播放帧"}</Button><span>当前帧 {frame + 1} / {frameCount}</span></>}</div>}<details className="cg-resource-info"><summary>资源信息</summary><p className="cg-muted" style={{ overflowWrap: "anywhere" }}>{asset.id}</p><div className="cg-asset-meta"><span>尺寸 <b>{asset.width && asset.height ? `${asset.width} × ${asset.height}` : "—"}</b></span><span>时长 <b>{asset.durationMs ? formatDuration(asset.durationMs) : "—"}</b></span><span>帧数 <b>{asset.frameCount || "—"}</b></span><span>格式 <b>{asset.format || asset.mimeType || "—"}</b></span><span>版本 <b>{asset.revision?.slice(0, 10) || "—"}</b></span><span>元数据 <b>{asset.metadataRevision?.slice(0, 10) || "—"}</b></span></div></details><div className="cg-inline-actions">{sourcePath && <Button size="sm" variant="tertiary" onPress={() => onOpenKnowledge(sourcePath)}>在知识库查看引用</Button>}<TodoShortcut onOpen={onOpenTodo} /></div><ErrorState error={media.error} /><div className="cg-versions"><button type="button" className="cg-versions-toggle" onClick={() => setShowVersions(value => !value)} aria-expanded={showVersions}>历史版本（{versionPage.total ?? versions.length}） {showVersions ? "⌃" : "⌄"}</button>{showVersions && <div className="cg-version-list">{versionPage.loading && <Spinner size="sm" />}{versions.map(version => { const versionId = version.id; const isSelected = versionId === (selectedVersionId || asset.currentVersionId); return <div className="cg-version-row" key={version.id}><span><strong>{version.id}</strong><small>{version.adopted ? "已采用" : version.source === "candidate" ? "候选" : "项目版本"} · {formatTime(version.createdAt)}</small></span><span className="cg-inline-actions"><Button size="sm" variant={isSelected ? "primary" : "tertiary"} onPress={() => setSelectedVersionId(versionId)}>{isSelected ? "查看中" : "查看"}</Button></span></div>; })}<CollectionPagination page={versionPage} label="历史版本" /></div>}</div></div>;
}

function isAudioAsset(asset: AssetItem): boolean {
  return /^audio\//i.test(String(asset.mimeType || "")) || /audio|sound|music|voice/i.test(String(asset.kind || ""));
}

function TodoShortcut({ onOpen }: { onOpen: () => void }) {
  return <Button size="sm" variant="tertiary" onPress={onOpen}>记到 Todo</Button>;
}

function formatDuration(value: number): string {
  const seconds = Math.max(0, Math.round(value > 10000 ? value / 1000 : value));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

const READER_STYLES = `
.cg-library.reference-reader{height:100dvh;padding:24px;box-sizing:border-box;background:var(--wb-paper);color:var(--wb-ink-soft);font-family:system-ui;overflow:hidden}
.reference-reader .reader-layout{display:grid;grid-template-columns:200px minmax(0,1fr);gap:28px;height:100%;min-height:0}
.reference-reader .reader-nav{display:flex;flex-direction:column;gap:4px;min-height:0;overflow-y:auto;overscroll-behavior:contain}
.reference-reader .reader-title{font-size:15px;padding:8px 12px 14px}
.reference-reader .reader-nav>button{display:block;flex-shrink:0;text-align:left;border:0;border-radius:10px;padding:10px 12px;color:inherit;background:transparent;font:inherit;font-size:13px;cursor:pointer}
.reference-reader .reader-nav>button:hover{background:var(--wb-surface-deep)}
.reference-reader .reader-nav>button[aria-current=true]{background:var(--wb-accent-pale);color:var(--wb-accent)}
.reference-reader .reader-main{display:flex;flex-direction:column;min-height:0;min-width:0;gap:12px;overflow:hidden}
.reference-reader .reader-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:8px;border-bottom:1px solid var(--wb-line-soft);padding-bottom:10px;flex-shrink:0}
.reference-reader .reader-toolbar>.button{background:var(--wb-surface-deep);color:var(--wb-accent)}
.reference-reader .reader-path{flex:1;font-size:11px;color:var(--wb-muted);overflow-wrap:anywhere}
.reference-reader .reader-more{position:relative}.reference-reader .reader-more>summary{list-style:none;padding:6px 12px;cursor:pointer;font-weight:700;border-radius:8px;background:var(--wb-surface-deep)}
.reference-reader .reader-menu{position:absolute;right:0;top:100%;z-index:10;padding:8px;min-width:150px;display:flex;flex-direction:column;align-items:stretch;background:var(--wb-paper);border-radius:10px;box-shadow:var(--wb-shadow-popover)}
.reference-reader .reader-inspector{max-height:40%;overflow:auto;border-bottom:1px solid var(--wb-line-soft);flex-shrink:0}
.reference-reader .cg-document-scroll{flex:1;min-height:0;overflow-y:auto;scrollbar-gutter:stable;padding-right:8px}
.reference-reader .cg-script-reader{display:flex;flex:1;min-height:0;min-width:0;flex-direction:column;gap:10px}
.reference-reader .cg-script-heading{flex-shrink:0;display:flex;flex-direction:column;gap:4px;min-width:0}.reference-reader .cg-script-heading strong{font-size:19px;color:var(--wb-ink)}.reference-reader .cg-script-heading span{font-size:11px;color:var(--wb-muted);overflow-wrap:anywhere}.reference-reader .cg-script-heading p{margin:4px 0 0;font-size:13px;line-height:1.6;overflow-wrap:anywhere}
.reference-reader .cg-script-lines{display:flex;flex-direction:column;gap:9px}.reference-reader .cg-script-line{padding:10px 12px;background:var(--wb-surface);border-radius:var(--wb-radius-small,8px);overflow-wrap:anywhere}.reference-reader .cg-script-line>div{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.reference-reader .cg-script-line strong{color:var(--wb-ink);font-size:13px}.reference-reader .cg-script-line span{color:var(--wb-muted);font-size:11px}.reference-reader .cg-script-line .button{margin-left:auto}.reference-reader .cg-script-line p{margin:7px 0 0;line-height:1.7;font-size:14px}.reference-reader .cg-script-pager{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap;flex-shrink:0}.reference-reader .cg-script-pager span{margin-right:auto;color:var(--wb-muted);font-size:12px}.reference-reader .cg-script-error{color:var(--wb-warning);font-size:12px}.reference-reader .cg-script-error p{margin:4px 0}
.reference-reader .cg-markdown{font-size:14px;line-height:1.8;padding:0;overflow-wrap:anywhere}.reference-reader .cg-markdown h1{font-size:23px;line-height:1.4;margin:12px 0 20px}.reference-reader .cg-markdown h2{font-size:18px;margin:28px 0 12px}.reference-reader .cg-markdown h3{font-size:15px;margin:22px 0 10px}.reference-reader .cg-markdown p,.reference-reader .cg-markdown ul,.reference-reader .cg-markdown ol{margin:10px 0}.reference-reader .cg-markdown pre{white-space:pre-wrap;overflow-wrap:anywhere;background:var(--wb-surface);padding:14px;border-radius:10px;font-size:12px}.reference-reader .cg-markdown table{width:100%;border-collapse:collapse;font-size:12px;table-layout:fixed}.reference-reader .cg-markdown td,.reference-reader .cg-markdown th{border:1px solid var(--wb-line);padding:8px;text-align:left}
@media(max-width:700px){.cg-library.reference-reader{padding:12px}.reference-reader .reader-layout{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);gap:12px}.reference-reader .reader-nav{flex-direction:row;flex-wrap:wrap;max-height:36dvh}.reference-reader .reader-title{display:none}.reference-reader .reader-nav>button{white-space:nowrap;padding:8px}.reference-reader .cg-script-pager{padding-right:72px}.reference-reader .cg-markdown table{display:block;overflow-x:auto}}
`;

const STYLES = `
.cg-card-tile,.cg-asset-tile{cursor:pointer}.cg-compare-chip,.cg-tile-audio{border:0;background:transparent;cursor:pointer;padding:3px 0}
.cg-graph-actions{display:flex;gap:5px;margin:6px 0}.cg-graph-svg{display:block;width:100%;height:244px;overflow:visible;background:var(--wb-surface);border:1px solid var(--wb-line-soft);border-radius:var(--wb-radius-small,8px)}.cg-graph-svg line{stroke:var(--wb-accent);stroke-opacity:.55;stroke-width:1.4}.cg-graph-svg-node{cursor:pointer}.cg-graph-svg-node circle{fill:var(--wb-accent-pale);stroke:var(--wb-accent);stroke-width:1.5}.cg-graph-svg-node text{fill:var(--wb-ink-soft);font-size:8px;pointer-events:none}.cg-graph-svg-node:focus circle,.cg-graph-svg-node:hover circle{fill:var(--wb-accent);stroke:var(--wb-ink)}.cg-graph-svg-node:focus text,.cg-graph-svg-node:hover text{fill:var(--wb-paper)}
.cg-new-document{display:flex;flex-direction:column;gap:12px;min-height:100%;padding:4px 4px 20px}.cg-new-document .cg-editor-label{display:flex;flex-direction:column;gap:5px;color:var(--wb-muted);font-size:11px}.cg-new-document .cg-editor-label input{height:34px;padding:0 9px;border:1px solid var(--wb-line);border-radius:var(--wb-radius-small,8px);background:var(--wb-surface);color:var(--wb-ink)}
.cg-library{box-sizing:border-box;min-width:0;min-height:100dvh;height:100dvh;overflow:hidden;background:var(--wb-paper);color:var(--wb-ink);font-family:var(--wb-font-family,system-ui,sans-serif);font-size:13px}
.cg-library *{box-sizing:border-box;min-width:0}.cg-library button,.cg-library input,.cg-library textarea,.cg-library select{font:inherit}.cg-library button{cursor:pointer}.cg-library button:focus-visible,.cg-library input:focus-visible,.cg-library textarea:focus-visible,.cg-library select:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}
.cg-library .cg-topbar{height:58px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 22px;border-bottom:1px solid var(--wb-line-soft);background:var(--wb-paper)}
.cg-brand{display:flex;align-items:center;gap:9px;min-width:0}.cg-brand strong{display:block;font-size:15px;color:var(--wb-ink);line-height:1.25}.cg-subtitle{display:block;margin-top:2px;color:var(--wb-muted);font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:280px}.cg-brand-icon{display:inline-grid;place-items:center;width:26px;height:26px;flex:0 0 26px;border-radius:8px;background:var(--wb-accent-pale);color:var(--wb-accent)}
.cg-status{display:flex;align-items:center;gap:6px;color:var(--wb-muted);font-size:11px;white-space:nowrap}.cg-dot{width:7px;height:7px;border-radius:50%;background:var(--wb-success)}.cg-error{color:var(--wb-danger);font-size:12px}.cg-muted{color:var(--wb-muted);font-size:11px}.cg-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cg-workspace{display:flex;flex-direction:column;height:calc(100dvh - 58px);min-height:0;padding:14px 20px 20px;gap:12px}.cg-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;flex:0 0 auto}.cg-search{flex:1 1 280px;min-width:180px}.cg-toolbar-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.cg-select{height:32px;max-width:150px;padding:0 9px;border:1px solid var(--wb-line);border-radius:var(--wb-radius-small,8px);background:var(--wb-surface);color:var(--wb-ink-soft)}
.cg-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:130px;color:var(--wb-muted);text-align:center;padding:20px}.cg-empty strong{color:var(--wb-ink-soft);font-size:13px}.cg-empty span{font-size:11px;line-height:1.55}.cg-section-head,.cg-card-summary{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--wb-muted);font-size:11px;min-height:26px}.cg-pager-label{font-size:11px;color:var(--wb-muted)}
.cg-knowledge-layout{display:grid;grid-template-columns:190px minmax(220px,290px) minmax(0,1fr);gap:18px;min-height:0;flex:1}.cg-sidebar,.cg-results-column,.cg-document-column,.cg-card-list,.cg-card-detail,.cg-asset-list,.cg-asset-detail{min-height:0;min-width:0}.cg-sidebar{display:flex;flex-direction:column;gap:7px}.cg-sidebar-title{color:var(--wb-muted);font-size:11px;font-weight:650;letter-spacing:.04em;padding:3px 4px}.cg-sidebar-relations{margin-top:8px}.cg-tree-scroll,.cg-reference-list{min-height:0;max-height:calc(100dvh - 255px)}.cg-tree-branch{min-width:0}.cg-tree-row,.cg-reference-row{display:flex;align-items:center;gap:5px;width:100%;min-height:30px;border:0;border-radius:7px;padding:4px 7px;background:transparent;color:var(--wb-ink-soft);text-align:left}.cg-tree-row:hover,.cg-reference-row:hover,.cg-tree-row:focus-visible,.cg-reference-row:focus-visible{background:var(--wb-surface-deep)}.cg-tree-children{padding-left:12px}.cg-tree-caret{width:10px;color:var(--wb-muted)}.cg-tree-folder{color:var(--wb-accent)}.cg-tree-loading{display:block;padding:6px 22px}.cg-sidebar-actions{display:flex;gap:6px;flex-wrap:wrap}.cg-reference-row{font-size:11px}.cg-reference-row.is-selected{background:var(--wb-accent-pale);color:var(--wb-accent)}
.cg-results-column{display:flex;flex-direction:column;gap:8px}.cg-results-column .cg-virtual{flex:1}.cg-result-row{display:flex;align-items:stretch;gap:5px;border-bottom:1px solid var(--wb-line-soft);min-width:0}.cg-result-row.is-selected{background:var(--wb-accent-pale)}.cg-result-main{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;flex:1;min-width:0;border:0;background:transparent;padding:7px 9px;color:var(--wb-ink-soft);text-align:left}.cg-result-main strong{font-size:12px;color:var(--wb-ink)}.cg-result-path,.cg-snippet,.cg-match{font-size:10px;color:var(--wb-muted);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cg-snippet{color:var(--wb-ink-soft)}.cg-match{color:var(--wb-accent)}.cg-bookmark,.cg-compare-check{border:0;background:transparent;color:var(--wb-muted);padding:8px;align-self:center}.cg-bookmark.is-bookmarked{color:var(--wb-warning)}.cg-loading-lines{display:flex;flex-direction:column;gap:12px;padding:16px}.cg-loading-lines span{height:12px;border-radius:5px;background:color-mix(in srgb,var(--wb-muted) 16%,var(--wb-paper));animation:cg-breathe 1.5s ease-in-out infinite alternate}.cg-loading-lines span:nth-child(2){width:82%}.cg-loading-lines span:nth-child(3){width:65%}@keyframes cg-breathe{from{opacity:.45}to{opacity:.9}}
.cg-document-column{display:flex;flex-direction:column;gap:8px;overflow:hidden}.cg-document-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;border-bottom:1px solid var(--wb-line-soft);padding-bottom:9px}.cg-document-heading{display:flex;flex-direction:column;gap:3px;min-width:0}.cg-document-heading strong{font-size:17px;color:var(--wb-ink);overflow-wrap:anywhere}.cg-document-heading span{font-size:10px;color:var(--wb-muted);overflow-wrap:anywhere}.cg-inline-actions,.cg-document-actions,.cg-filter-actions,.cg-asset-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.cg-document-actions{min-height:28px}.cg-document-actions .cg-muted{margin-left:auto}.cg-document-scroll{min-height:0;flex:1;padding-right:6px}.cg-markdown{max-width:860px;padding:4px 8px 30px;color:var(--wb-ink-soft);line-height:1.78;overflow-wrap:anywhere}.cg-markdown h1,.cg-markdown h2,.cg-markdown h3{color:var(--wb-ink);line-height:1.35;scroll-margin-top:12px}.cg-markdown h1{font-size:25px;margin:12px 0 18px}.cg-markdown h2{font-size:19px;margin:25px 0 10px}.cg-markdown h3{font-size:15px;margin:19px 0 8px}.cg-markdown p,.cg-markdown ul,.cg-markdown ol{margin:10px 0}.cg-markdown ul,.cg-markdown ol{padding-left:24px}.cg-markdown a{color:var(--wb-accent);text-decoration:underline;text-underline-offset:3px}.cg-markdown blockquote{margin:14px 0;padding-left:13px;border-left:3px solid var(--wb-line);color:var(--wb-muted)}.cg-markdown table{width:100%;border-collapse:collapse;display:block;overflow-x:auto}.cg-markdown th,.cg-markdown td{padding:7px 9px;border-bottom:1px solid var(--wb-line-soft);text-align:left}.cg-markdown code{font-family:ui-monospace,SFMono-Regular,monospace;font-size:.9em;background:var(--wb-surface-deep);padding:2px 4px;border-radius:4px}.cg-code-block{overflow:auto;padding:12px;border-radius:var(--wb-radius-small,8px);background:var(--wb-surface);font-size:12px;line-height:1.55}.cg-inline-image{display:block;margin:12px 0}.cg-inline-image img{display:block;max-width:100%;max-height:420px;object-fit:contain;image-rendering:auto}.cg-image-loading{display:inline-flex;align-items:center;min-height:60px;padding:10px 14px;background:var(--wb-surface);color:var(--wb-muted);font-size:11px}.cg-editor{display:block;width:100%;min-height:0;flex:1;resize:none;padding:14px;border:1px solid var(--wb-line);border-radius:var(--wb-radius-small,8px);background:var(--wb-surface);color:var(--wb-ink);font-family:ui-monospace,SFMono-Regular,monospace;font-size:12px;line-height:1.6}.cg-editor-label{display:flex;flex-direction:column;gap:6px;color:var(--wb-muted);font-size:11px;min-height:0;flex:1}.cg-editor-label .cg-editor{height:300px;flex:1}.cg-conflict{padding:11px;background:var(--wb-warning-pale);color:var(--wb-ink-soft);font-size:11px;display:flex;flex-direction:column;gap:7px}.cg-conflict-columns{display:grid;grid-template-columns:1fr 1fr;gap:8px;min-width:0}.cg-conflict pre{max-height:150px;overflow:auto;margin:0;padding:8px;background:var(--wb-paper);font:10px/1.5 ui-monospace,SFMono-Regular,monospace;white-space:pre-wrap}.cg-move-panel{display:flex;flex-direction:column;gap:8px;padding:10px;background:var(--wb-surface)}.cg-move-panel label{display:flex;align-items:center;gap:7px;color:var(--wb-muted);font-size:11px}.cg-move-panel input,.cg-filter-panel input,.cg-filter-panel select,.cg-sprite-controls input,.cg-sprite-controls select{min-width:0;height:30px;padding:4px 8px;border:1px solid var(--wb-line);border-radius:6px;background:var(--wb-paper);color:var(--wb-ink-soft)}.cg-move-panel input{flex:1}.cg-move-list{display:flex;flex-direction:column;gap:4px;color:var(--wb-muted);font-size:10px}.cg-move-list span{overflow-wrap:anywhere}
.cg-relation-panel{display:flex;flex-direction:column;gap:7px;min-height:0;max-height:260px;padding-top:4px}.cg-panel-heading{display:flex;align-items:center;justify-content:space-between;color:var(--wb-ink-soft);font-size:11px;font-weight:650}.cg-panel-heading span{color:var(--wb-muted);font-weight:400}.cg-backlink-row{display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;padding:7px;border:0;border-bottom:1px solid var(--wb-line-soft);background:transparent;color:var(--wb-ink-soft);text-align:left}.cg-backlink-row strong{font-size:11px}.cg-backlink-row span{font-size:10px;color:var(--wb-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%}.cg-graph-list{display:flex;flex-direction:column;gap:6px;overflow:auto}.cg-graph-node{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 6px;padding:6px 7px;background:var(--wb-surface)}.cg-graph-node span,.cg-graph-node small{font-size:10px;color:var(--wb-muted)}.cg-graph-node strong{font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cg-graph-node small{grid-column:2}
.cg-card-summary{padding:0 3px}.cg-cards-layout,.cg-assets-layout{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(290px,.85fr);gap:18px;min-height:0;flex:1}.cg-card-list,.cg-asset-list{min-height:0;display:flex;flex-direction:column;gap:8px}.cg-card-detail,.cg-asset-detail{overflow:auto;padding-right:4px}.cg-card-row{display:flex;align-items:stretch;gap:4px;border-bottom:1px solid var(--wb-line-soft);min-height:58px}.cg-card-row.is-active{background:var(--wb-accent-pale)}.cg-card-row-main{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(90px,1fr) minmax(65px,.6fr) minmax(58px,.5fr) 42px minmax(80px,1fr);align-items:center;gap:7px;width:100%;border:0;background:transparent;color:var(--wb-ink-soft);text-align:left;padding:6px 8px}.cg-card-row-main strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--wb-ink);font-size:12px}.cg-card-row-main span{font-size:10px;color:var(--wb-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cg-card-row-main em{font-style:normal;font-size:10px;color:var(--wb-accent);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cg-compare-check{flex:0 0 34px}.cg-compare-check.is-checked{color:var(--wb-accent);font-weight:700}.cg-card-grid-row,.cg-asset-grid-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;padding-bottom:10px}.cg-card-tile{display:flex;flex-direction:column;align-items:flex-start;gap:5px;min-height:165px;padding:12px;border:1px solid var(--wb-line-soft);border-radius:var(--wb-radius-small,8px);background:var(--wb-surface);color:var(--wb-ink-soft);text-align:left}.cg-card-tile:hover,.cg-card-tile.is-active{background:var(--wb-accent-pale);border-color:var(--wb-accent)}.cg-card-glyph{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;background:var(--wb-accent-pale);color:var(--wb-accent);font-size:21px}.cg-card-tile strong{font-size:12px;color:var(--wb-ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%}.cg-card-tile span:not(.cg-card-glyph):not(.cg-compare-chip),.cg-card-tile small{font-size:10px;color:var(--wb-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%}.cg-compare-chip{margin-top:auto;color:var(--wb-accent);font-size:10px}.cg-compare-chip.is-checked{font-weight:700}.cg-detail-panel,.cg-asset-detail-panel{display:flex;flex-direction:column;gap:12px;min-height:100%;padding:4px 4px 20px}.cg-detail-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.cg-detail-heading>div{display:flex;flex-direction:column;gap:3px;min-width:0}.cg-detail-heading strong{font-size:17px;color:var(--wb-ink);overflow-wrap:anywhere}.cg-detail-heading span{font-size:10px;color:var(--wb-muted);overflow-wrap:anywhere}.cg-warning{color:var(--wb-warning)!important}.cg-card-fields,.cg-asset-meta{display:flex;flex-wrap:wrap;gap:7px 14px;color:var(--wb-muted);font-size:11px}.cg-card-fields b,.cg-asset-meta b{color:var(--wb-ink-soft);font-weight:550}.cg-json-editor{min-height:260px;flex:none}.cg-compare-panel{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}.cg-compare-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:8px}.cg-compare-grid>div{min-width:0;background:var(--wb-surface);padding:8px}.cg-compare-grid strong{font-size:11px}.cg-compare-grid pre{max-height:220px;overflow:auto;margin:7px 0 0;font:10px/1.45 ui-monospace,SFMono-Regular,monospace;white-space:pre-wrap}
.cg-filter-panel{display:flex;flex-direction:column;gap:10px;padding:12px;background:var(--wb-surface)}.cg-filter-heading{display:flex;align-items:baseline;gap:9px}.cg-filter-heading strong{color:var(--wb-ink-soft);font-size:12px}.cg-filter-heading span{color:var(--wb-muted);font-size:10px}.cg-filter-fields{display:flex;align-items:flex-end;gap:9px;flex-wrap:wrap}.cg-filter-fields>div{width:150px}.cg-filter-fields label{display:flex;flex-direction:column;gap:4px;color:var(--wb-muted);font-size:10px}.cg-filter-fields input,.cg-filter-fields select{width:120px}.cg-filter-actions{justify-content:flex-end}.cg-asset-grid-row{grid-template-columns:repeat(4,minmax(0,1fr))}.cg-asset-tile{display:flex;flex-direction:column;align-items:flex-start;gap:4px;min-height:186px;border:0;border-radius:var(--wb-radius-small,8px);padding:7px;background:var(--wb-surface);color:var(--wb-ink-soft);text-align:left}.cg-asset-tile:hover,.cg-asset-tile[data-active]{background:var(--wb-accent-pale);border-color:var(--wb-accent)}.cg-thumb{position:relative;display:grid;place-items:center;width:100%;height:92px;overflow:hidden;background:repeating-conic-gradient(var(--wb-surface-deep) 0 25%,var(--wb-paper) 0 50%) 0 / 12px 12px}.cg-thumb img{display:block;max-width:100%;max-height:100%;object-fit:contain;image-rendering:auto}.cg-asset-kind{position:absolute;left:4px;bottom:4px;padding:2px 4px;border-radius:4px;background:var(--wb-paper);color:var(--wb-muted);font-size:9px}.cg-asset-tile strong,.cg-asset-tile small{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cg-asset-tile strong{font-size:11px;color:var(--wb-ink)}.cg-asset-tile small{font-size:10px;color:var(--wb-muted)}.cg-tile-audio{color:var(--wb-accent);font-size:10px}.cg-media-loading{color:var(--wb-muted);font-size:17px}.cg-audio-thumb{font-size:28px;color:var(--wb-accent)}.cg-asset-list-row{display:grid;grid-template-columns:42px minmax(0,1fr) 90px 80px 80px;align-items:center;gap:8px;min-height:72px;width:100%;border:0;border-bottom:1px solid var(--wb-line-soft);background:transparent;color:var(--wb-muted);text-align:left;padding:6px}.cg-asset-list-row:hover,.cg-asset-list-row[data-active]{background:var(--wb-accent-pale)}.cg-list-thumb{display:grid;place-items:center;width:38px;height:38px;overflow:hidden;background:var(--wb-surface)}.cg-list-thumb img{max-width:100%;max-height:100%;object-fit:contain}.cg-asset-list-main{display:flex;flex-direction:column;gap:2px;min-width:0}.cg-asset-list-main strong{font-size:11px;color:var(--wb-ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cg-asset-list-main small,.cg-asset-list-row>span:not(.cg-list-thumb):not(.cg-asset-list-main){font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 .cg-media-stage{display:grid;place-items:center;min-height:190px;overflow:hidden;background:repeating-conic-gradient(var(--wb-surface-deep) 0 25%,var(--wb-paper) 0 50%) 0 / 14px 14px}.cg-image-stage{position:relative;display:grid;place-items:center;min-height:190px;max-width:100%;overflow:auto}.cg-image-stage>img{display:block;max-width:100%;max-height:310px;object-fit:contain;transform-origin:center;transition:transform .12s}.cg-image-stage.is-sprite{padding:16px}.cg-sprite-frame{position:relative;overflow:hidden;flex:0 0 auto;background:transparent}.cg-sprite-frame img{position:absolute;top:0;left:0;display:block;object-fit:fill;image-rendering:pixelated;transform-origin:top left}.cg-audio-stage{display:flex;flex-direction:column;align-items:center;gap:12px;width:100%;padding:20px}.cg-audio-glyph{font-size:52px;color:var(--wb-accent)}.cg-audio-stage audio{width:100%;max-width:360px}.cg-waveform{display:block;width:100%;height:65px;max-width:420px;fill:var(--wb-accent);opacity:.8}.cg-sprite-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap;color:var(--wb-muted);font-size:10px}.cg-sprite-controls label{display:flex;align-items:center;gap:4px}.cg-sprite-controls input,.cg-sprite-controls select{width:58px;height:28px}.cg-sprite-controls .cg-check{color:var(--wb-ink-soft)}.cg-asset-metadata{display:flex;flex-direction:column;gap:8px;padding:9px 10px;background:var(--wb-surface);border-radius:var(--wb-radius-small,8px)}.cg-asset-metadata summary{cursor:pointer;color:var(--wb-ink-soft);font-size:11px}.cg-asset-metadata-fields{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cg-asset-metadata-fields label{display:flex;flex-direction:column;gap:4px;color:var(--wb-muted);font-size:10px}.cg-asset-metadata-fields input{height:30px;min-width:0;padding:4px 8px;border:1px solid var(--wb-line);border-radius:6px;background:var(--wb-paper);color:var(--wb-ink-soft)}.cg-reject-version{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.cg-reject-version input{flex:1;min-width:120px;height:30px;padding:4px 8px;border:1px solid var(--wb-line);border-radius:6px;background:var(--wb-paper);color:var(--wb-ink-soft)}.cg-versions{display:flex;flex-direction:column;gap:7px;padding-top:4px}.cg-versions-toggle{border:0;background:transparent;color:var(--wb-ink-soft);font-size:11px;text-align:left;padding:4px 0}.cg-version-list{display:flex;flex-direction:column;gap:6px}.cg-version-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px;background:var(--wb-surface)}.cg-version-row>span{display:flex;flex-direction:column;gap:2px;min-width:0}.cg-version-row strong{font-size:11px;color:var(--wb-ink-soft)}.cg-version-row small{font-size:10px;color:var(--wb-muted)}.cg-reference-document,.cg-reference-target-panel{display:flex;flex-direction:column;min-height:0;flex:1}.cg-reference-target-note{margin:0;padding:9px 10px;background:var(--wb-surface);color:var(--wb-muted);font-size:11px;line-height:1.6}.cg-reference-document .cg-document-scroll{margin-top:8px}.cg-reference-document .cg-markdown img{display:block;max-width:100%;max-height:400px;object-fit:contain}
.cg-compact{min-height:100dvh;padding:15px 16px 13px;background:var(--wb-paper);color:var(--wb-ink);display:flex;flex-direction:column;gap:10px}.cg-compact-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.cg-compact-head .cg-brand strong{font-size:13px}.cg-compact-head .cg-brand-icon{width:23px;height:23px;flex-basis:23px;border-radius:7px}.cg-compact-count{font-size:10px;color:var(--wb-muted)}.cg-compact-list{display:flex;flex-direction:column;gap:2px}.cg-compact-row{display:flex;align-items:center;gap:7px;width:100%;min-height:31px;padding:5px 6px;border:0;background:transparent;color:var(--wb-ink-soft);text-align:left}.cg-compact-row:hover{background:var(--wb-surface-deep)}.cg-item-icon{color:var(--wb-accent);font-size:13px}.cg-arrow{margin-left:auto;color:var(--wb-muted)}.cg-compact-foot{margin-top:auto;color:var(--wb-muted);font-size:10px;text-align:center}.cg-setup{display:flex;align-items:center;justify-content:center;gap:8px;padding:24px;text-align:center}.cg-setup p{color:var(--wb-muted);font-size:11px}
.cg-recent{display:flex;flex-direction:column;gap:3px;flex:0 0 auto;padding:7px 9px;background:var(--wb-surface);border-radius:var(--wb-radius-small,8px)}.cg-recent-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px}.cg-recent-head strong{font-size:11px;color:var(--wb-ink-soft)}.cg-recent-head span{font-size:10px;color:var(--wb-muted)}.cg-recent-row{display:flex;align-items:center;gap:7px;width:100%;min-height:26px;padding:3px 5px;border:0;border-radius:6px;background:transparent;color:var(--wb-ink-soft);text-align:left;font-size:11px}.cg-recent-row:hover{background:var(--wb-surface-deep)}.cg-recent-row .cg-ellipsis{flex:1}.cg-recent-change{flex:0 0 auto;padding:1px 5px;border-radius:999px;font-size:9px;background:var(--wb-accent-pale);color:var(--wb-accent)}.cg-recent-change.is-created{background:var(--wb-success-pale);color:var(--wb-success)}.cg-recent-time{margin-left:auto;flex:0 0 auto;font-size:10px;color:var(--wb-muted)}.cg-recent-foot{display:flex;gap:7px;justify-content:flex-end}.cg-selection-actions{margin-bottom:10px}
@media(max-width:960px){.cg-knowledge-layout{grid-template-columns:150px minmax(190px,1fr)}.cg-document-column{grid-column:1 / -1;min-height:330px;max-height:48dvh}.cg-cards-layout,.cg-assets-layout{grid-template-columns:minmax(0,1fr) minmax(250px,.65fr)}.cg-card-row-main{grid-template-columns:minmax(0,1.5fr) minmax(75px,1fr) minmax(55px,.6fr) minmax(50px,.5fr) 34px minmax(60px,.7fr)}}
@media(max-width:680px){.cg-library .cg-topbar{height:52px;padding:0 12px}.cg-subtitle{max-width:150px}.cg-workspace{height:calc(100dvh - 52px);padding:10px 11px 14px}.cg-toolbar-actions{width:100%;overflow:auto;flex-wrap:nowrap;padding-bottom:2px}.cg-toolbar-actions>*{flex:0 0 auto}.cg-knowledge-layout{display:flex;flex-direction:column;gap:10px;overflow:auto}.cg-sidebar{order:1;max-height:190px}.cg-tree-scroll{max-height:90px}.cg-results-column{order:2;min-height:270px}.cg-document-column{order:3;min-height:430px;max-height:none}.cg-cards-layout,.cg-assets-layout{display:flex;flex-direction:column;gap:10px;overflow:auto}.cg-card-list,.cg-asset-list{min-height:300px}.cg-card-detail,.cg-asset-detail{min-height:390px}.cg-card-grid-row,.cg-asset-grid-row{grid-template-columns:repeat(2,minmax(0,1fr))}.cg-card-row-main{grid-template-columns:minmax(0,1.2fr) minmax(70px,1fr) 45px 45px}.cg-card-row-main span:nth-of-type(3),.cg-card-row-main span:nth-of-type(4),.cg-card-row-main em{display:none}.cg-asset-list-row{grid-template-columns:38px minmax(0,1fr) 65px}.cg-asset-list-row>span:nth-last-child(-n+2){display:none}.cg-filter-fields{display:grid;grid-template-columns:1fr 1fr;width:100%}.cg-filter-fields input,.cg-filter-fields select{width:100%}.cg-conflict-columns{grid-template-columns:1fr}.cg-document-head{align-items:flex-start}.cg-inline-actions{flex-wrap:nowrap}.cg-compact{padding:14px}.cg-compact .cg-compact-list{max-height:120px!important}}
@media(prefers-reduced-motion:reduce){.cg-library *,.cg-library *::before{animation:none!important;transition:none!important}}
`;
