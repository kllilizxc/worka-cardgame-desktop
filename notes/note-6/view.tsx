import {useViewProps} from './surface';
import { CreateFeature } from './feature-create';
import { GameChanges, type GameChange } from './game-changes';
import {withNotePrerequisites} from '@dsh-workbench/react';

import {NoteIcon} from '@dsh-workbench/react';

import { Button, Dropdown, SearchField } from "@heroui/react";
import { useEffect, useRef, useState, useMemo } from "react";
import {useActions,useRuntime,useResource,useWorkbench,useNoteConfig,type WidgetProps} from './surface';


type ItemLink = {
  number?: number;
  url: string;
  label: string;
  title: string;
  state?: string;
  tone?: "ok" | "failed" | "pending" | "muted";
};

type EnvBranchData = {
  branch?: string;
  merge?: { label: string; tone: string; stale?: boolean; hidden?: boolean };
  ci?: { label: string; tone: string; stale?: boolean; hidden?: boolean };
  deploy?: { label: string; tone: string; stale?: boolean; hidden?: boolean };
  prs?: ItemLink[];
  ciLinks?: ItemLink[];
  deploymentLinks?: ItemLink[];
};

type FeatureLink = {
  repo: string;
  trackingLabel?: string;
  mappingIssue?: string;
  repoName: string;
  repoNameShort: string;
  url: string;
  branches: string[];
  allPrs?: Array<ItemLink & { branch?: string }>;
  envBranches: {
    dev?: EnvBranchData;
    pre?: EnvBranchData;
    main?: EnvBranchData;
  };
};

type ExecutionTarget = {
  noteId?: string;
  delegationId?: string;
};

type FeatureItem = {
  id: string;
  title: string;
  summary: string;
  next: string;
  body: string;
  createdAt?: string;
  archived: boolean;
  /** True when the archive comes from the delivery state, not a manual flag. */
  autoArchived?: boolean;
  totalPrs: number;
  mergedPrs: number;
  links: FeatureLink[];
  /** Optional precise target for newer records; old records fall back to the desk. */
  execution?: ExecutionTarget;
  gameCandidates?: GameCandidate[];
};

type LedgerIssue = { file: string; error: string };

type GameCandidate = {
  id: string; projectId: string; productionId: string; cardId: string; featureId: string;
  kind?: 'card' | 'story' | 'documents' | 'deck'; targetId?: string;
  candidateHash: string; targetBaseRevision: string; validationManifest: string; commit: string;
  status: 'candidate' | 'adopted' | 'undone'; previewVerified: boolean;
  adoptedAt?: string; undoneAt?: string; adoptionId?: string;
};
const gameCandidateLabel = (candidate: GameCandidate) => candidate.kind === 'deck' ? `牌组 ${candidate.targetId}` : candidate.kind === 'story' ? `剧情 ${candidate.targetId}`
  : candidate.kind === 'documents' ? `资料 ${candidate.targetId}` : `卡牌 ${candidate.cardId}`;

type TrackerState = {
  serverUrl?: string;
  status?: string;
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
  /** Ledger records that failed to parse; while present every write is blocked. */
  errors?: LedgerIssue[];
  features?: FeatureItem[];
};

const COPY_ENVIRONMENTS = ["dev", "pre", "main"] as const;
type CopyRange = (typeof COPY_ENVIRONMENTS)[number] | "all";

function buildFeatureCopyText(feature: FeatureItem, range: CopyRange) {
  const entries: string[] = [];
  const seen = new Set<string>();

  for (const link of feature.links ?? []) {
    const branchByEnvironment = COPY_ENVIRONMENTS.map((environment) =>
      link.envBranches?.[environment]?.branch || environment
    );
    const branchRank = new Map<string, number>();
    branchByEnvironment.forEach((branch, index) => {
      if (!branchRank.has(branch)) branchRank.set(branch, index);
    });

    const appendPr = (pr: ItemLink & { branch?: string }) => {
      if (!pr.url || pr.state === "merged") return;
      const key = JSON.stringify([link.repo, pr.url]);
      if (seen.has(key)) return;
      seen.add(key);
      entries.push(pr.url);
    };

    if (range === "all") {
      const prs = [...(link.allPrs ?? [])].sort((a, b) => {
        const branchA = a.branch || "未知分支";
        const branchB = b.branch || "未知分支";
        return (branchRank.get(branchA) ?? COPY_ENVIRONMENTS.length) -
          (branchRank.get(branchB) ?? COPY_ENVIRONMENTS.length) ||
          branchA.localeCompare(branchB) || (a.number ?? 0) - (b.number ?? 0);
      });
      for (const pr of prs) {
        appendPr(pr);
      }
    } else {
      const branchData = link.envBranches?.[range];
      for (const pr of branchData?.prs ?? []) {
        appendPr(pr);
      }
    }
  }

  const sections = [`Feature 内容\n${feature.title}`];
  sections.push(`PR 链接：\n${entries.length ? entries.join("\n") : "无该范围内的 PR"}`);
  return { text: sections.join("\n\n"), count: entries.length };
}

function SyncDiagnostics({compact=false}:{compact?:boolean}) {
  const resource=useResource<any>('diagnostics',{});
  const entries=Object.entries(resource.data?.ci ?? {}).filter(([,o]:any)=>o.error);
  if(compact) {
    if(entries.length)return <span className="compact-diagnostic" title="展开卡片查看 CI 查询详情">CI 异常 · {entries.length}</span>;
    return resource.data?.syncing ? <span className="compact-diagnostic" role="status">后台同步中</span> : null;
  }
  if(!entries.length)return resource.data?.syncing ? <span role="status">后台同步中…</span> : null;
  return <details style={{padding:'8px 12px',maxHeight:220,overflow:'auto'}}><summary>CI 查询失败：{entries.length} 项</summary>
    {entries.map(([key,o]:any)=><p key={key}>{o.stage} / {o.category || o.error} · 上次成功：{o.checkedAt ? new Date(o.checkedAt).toLocaleString() : '尚无'} · 下一次重试：{o.retryAt ? new Date(o.retryAt).toLocaleString() : '待调度'}</p>)}
  </details>;
}
function BrandIcon({ icon }: { icon: WidgetProps["metadata"]["icon"] }) {
  return (<span className="brand-logo" aria-hidden="true">
              <NoteIcon icon={icon} size={13} />
            </span>);
}

export function View(){
 const { data: initialData, mode, metadata }=useViewProps<TrackerState>();
  const runtime = useRuntime();
  const config = useNoteConfig<{ projectId?: string; presentation?: string; notes?: { production?: string; preview?: string } }>();
  const [showEngineering, setShowEngineering] = useState(false);
  const changesView = config?.presentation === 'changes' && !showEngineering;
  const actions = useActions<typeof import("./actions")>();
  const resource = useResource<TrackerState>(mode === "compact" ? "summary" : "view", {});
  const data = resource.data ?? initialData;
  const workbench = useWorkbench();
  const [refreshing, setRefreshing] = useState(false);
  const [navigationError, setNavigationError] = useState("");
  const [archiveError, setArchiveError] = useState("");
  const [archiveBusy, setArchiveBusy] = useState("");
  // Optimistic archive state so a click is visible before the background sync
  // finishes; a failed action removes the override again.
  const [archiveOverrides, setArchiveOverrides] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "has-links" | "pending" | "merged" | "archived">("all");
  const [search, setSearch] = useState("");
  const [openDocs, setOpenDocs] = useState<Record<string, boolean>>({});
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<Record<string, { message: string; error: boolean }>>({});
  const [candidateBusy, setCandidateBusy] = useState('');
  const [candidateError, setCandidateError] = useState<Record<string, string>>({});

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await actions.refresh({});
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyFeature = async (feature: FeatureItem, range: CopyRange) => {
    const { text, count } = buildFeatureCopyText(feature, range);
    try {
      await workbench.copyText(text);
      setCopyFeedback((previous) => ({
        ...previous,
        [feature.id]: { message: count ? `已复制 ${count} 个 PR` : "已复制文案（无 PR）", error: false },
      }));
    } catch (error) {
      console.error(error);
      setCopyFeedback((previous) => ({ ...previous, [feature.id]: { message: "复制失败，请重试", error: true } }));
    }
  };



  const openExecutionDesk = async (feature?: FeatureItem, _link?: FeatureLink) => {
    setNavigationError("");
    const target = feature?.execution;
    try {
      let delegationId = target?.delegationId;
      let noteId = target?.noteId;
      const connected=await runtime.resources.read<Array<{nodes:Array<{noteId:string;queries:string[]}>}>>({name:'connectedNodes',input:{}});
      if(connected.error)throw new Error(connected.error);
      const desks=[...new Set((connected.data??[]).flatMap(relation=>relation.nodes.filter(node=>node.queries.includes('progress')).map(node=>node.noteId)))];
      if(!noteId&&feature){
        const related=await runtime.resources.read<Array<{source:{noteId:string;objectId:string};target:{noteId:string;objectId:string}}>>({name:'relatedObjects',input:{}});
        if(related.error)throw new Error(related.error);
        const exact=[...new Set((related.data??[]).filter(binding=>binding.source.objectId===feature.id&&desks.includes(binding.target.noteId))
          .map(binding=>JSON.stringify(binding.target)))].map(value=>JSON.parse(value) as {noteId:string;objectId:string});
        if(exact.length>1){setNavigationError('该功能关联多个执行任务，请在执行台核对。');return;}
        if(exact.length===1){noteId=exact[0]!.noteId;delegationId=exact[0]!.objectId;}
      }
      if(!noteId&&desks.length===1)noteId=desks[0];
      if (noteId) await workbench.openNote(noteId, delegationId);
      else setNavigationError('没有唯一的关联执行台，请先检查连线。');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setNavigationError(message);
      console.error(error);
    }
  };

  // Manual archive flag wins over the optimistic override only on failure.
  const isArchived = (f: FeatureItem) => archiveOverrides[f.id] ?? f.archived;

  const handleArchiveToggle = async (feature: FeatureItem) => {
    const archived = !isArchived(feature);
    setArchiveError("");
    setArchiveBusy(feature.id);
    setArchiveOverrides((prev) => ({ ...prev, [feature.id]: archived }));
    try {
      await actions.setArchiveStatus({ id: feature.id, archived });
    } catch (error) {
      setArchiveOverrides((prev) => {
        const next = { ...prev };
        delete next[feature.id];
        return next;
      });
      const message = error instanceof Error ? error.message : String(error);
      setArchiveError(`「${feature.title}」${archived ? "归档" : "恢复"}失败：${message}`);
      return;
    } finally {
      setArchiveBusy("");
    }
    // The write already succeeded; a slow or failed refresh must not undo the card.
    try {
      await runtime.resources.revalidate({ name: "view", input: {} });
      setArchiveOverrides((prev) => {
        const next = { ...prev };
        delete next[feature.id];
        return next;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDoc = (id: string) => {
    setOpenDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const candidateAction = async (candidate: GameCandidate, operation: 'confirm' | 'undo') => {
    setCandidateBusy(candidate.id);
    setCandidateError(previous => ({ ...previous, [candidate.id]: '' }));
    const identity = { projectId: candidate.projectId, productionId: candidate.productionId, candidateId: candidate.id, featureId: candidate.featureId,
      candidateHash: candidate.candidateHash, targetBaseRevision: candidate.targetBaseRevision, validationManifest: candidate.validationManifest };
    try {
      if (operation === 'confirm') await actions.confirmGameCandidate(identity);
      else await actions.undoGameCandidate({ ...identity, adoptionId: candidate.adoptionId! });
      await runtime.resources.revalidate({ name: 'view', input: {} });
    } catch (error) { setCandidateError(previous => ({ ...previous, [candidate.id]: (error as Error).message })); throw error; }
    finally { setCandidateBusy(''); }
  };

  const features = data?.features ?? [];
  const ledgerIssues = data?.errors ?? [];
  const activeFeatures = useMemo(() => features.filter((f) => !isArchived(f)), [features, archiveOverrides]);
  const compactActiveCount = data.activeCount ?? activeFeatures.length;
  const archivedFeatures = useMemo(() => features.filter((f) => isArchived(f)), [features, archiveOverrides]);

  const displayedFeatures = useMemo(() => {
    let list = features;
    if (filter === "archived") {
      list = archivedFeatures;
    } else {
      list = activeFeatures;
      if (filter === "has-links") {
        list = list.filter((f) => f.links && f.links.length > 0);
      } else if (filter === "pending") {
        list = list.filter((f) =>
          f.links.some((l) =>
            (["dev", "pre", "main"] as const).some((env) => l.envBranches[env]?.merge?.tone === "pending")
          )
        );
      } else if (filter === "merged") {
        list = list.filter(
          (f) => f.links.length > 0 && f.totalPrs > 0 && f.mergedPrs === f.totalPrs
        );
      }
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.summary.toLowerCase().includes(q) ||
          f.id.toLowerCase().includes(q) ||
          f.next.toLowerCase().includes(q) ||
          f.links.some((l) => l.repoName.toLowerCase().includes(q))
      );
    }
    return list;
  }, [features, activeFeatures, archivedFeatures, filter, search]);

  const renderBadge = (f: FeatureItem) => {
    if (!f.links || f.links.length === 0) {
      return <span className="badge-overall muted">尚未关联项目</span>;
    }
    if (f.totalPrs > 0 && f.mergedPrs === f.totalPrs) {
      return <span className="badge-overall ok">✓ 全部合并 ({f.mergedPrs}/{f.totalPrs})</span>;
    }
    if (f.mergedPrs > 0) {
      return <span className="badge-overall pending">部分合并 ({f.mergedPrs}/{f.totalPrs})</span>;
    }
    if (f.totalPrs > 0) {
      return <span className="badge-overall pending">待合并 ({f.totalPrs} PR)</span>;
    }
    return <span className="badge-overall muted">未登记 PR</span>;
  };

  // Segments of one step: one anchor per PR / pipeline run / service.
  const renderSegments = (items?: ItemLink[]) => {
    if (!items || items.length === 0) return null;
    return items.map((it, idx) => {
      const toneClass = it.tone ? ` tone-${it.tone}` : "";
      return (
        <a key={idx} href={it.url} target="_blank" rel="noopener noreferrer" className={`chip-link${toneClass}`} title={it.title}>
          {it.label ?? String(idx + 1)}
        </a>
      );
    });
  };

  // One segmented chip per step: [ verdict │ source … ].
  const renderStage = (
    name: string,
    stateObj: { label: string; tone: string; stale?: boolean; hidden?: boolean } | undefined,
    segments?: React.ReactNode
  ) => {
    if (stateObj?.hidden) return null;
    const tone = stateObj?.tone || "muted";
    const label = stateObj?.label || "未知";
    const stale = Boolean(stateObj?.stale);
    const okPrefix = tone === "ok" ? "✓ " : "";
    return (
      <div className="stage-row">
        <span className="stage-name">{name}</span>
        <div className="stage-chip">
          <span className={`chip-status tone-${tone}`}>
            {okPrefix}{label}
            {stale ? " · 缓存" : ""}
          </span>
          {segments}
        </div>
      </div>
    );
  };

  // Compact Mode (for DSH Workbench Canvas)
  if (changesView) return <GameChanges mode={mode} metadata={metadata} busy={candidateBusy} errors={candidateError}
    ready={!resource.stale && !resource.error}
    onDiscuss={async change => {
      const session = await actions.discussChange(change ? { productionId: change.productionId } : {});
      await workbench.openSession(session.sessionId);
    }}
    onPreview={async (candidateId, commit) => {
      if (!config?.notes?.preview) throw Error('尚未关联试玩便笺，请配置项目便笺关系');
      await workbench.openNote(config.notes.preview, `cg:${encodeURIComponent(JSON.stringify({ kind: 'preview', id: candidateId, revision: commit }))}`);
    }}
    onEngineering={featureId => { setShowEngineering(true); setSearch(featureId ?? ''); if (featureId) setOpenDocs(previous => ({ ...previous, [featureId]: true })); }}
    onProduction={async (change: GameChange) => {
      if (!config?.notes?.production) throw Error('尚未关联制作便笺，请配置项目便笺关系');
      await workbench.openNote(config.notes.production, `cg:${encodeURIComponent(JSON.stringify({ projectId: change.projectId, kind: 'production', id: change.productionId }))}`);
    }}
    onCandidate={async (change, candidateId, operation) => {
      const candidate = features.flatMap(feature => feature.gameCandidates ?? []).find(item => item.id === candidateId && item.productionId === change.productionId && item.projectId === change.projectId && item.featureId === change.featureId);
      if (!candidate) throw Error('候选信息已变化，请刷新后重新选择');
      await candidateAction(candidate, operation);
    }} />;

  if (mode === "compact") {
    return (
      <section className="ft-widget compact">
        <style>{css}</style>
        <header className="navbar-compact">
          <div className="brand-box">
            <BrandIcon icon={metadata.icon} />
            <span className="brand-title">{metadata.name}</span>
            <span className="brand-count">{compactActiveCount} 个功能</span>
          </div>
          <div className="navbar-actions">
            {config?.presentation === 'changes' && <Button size="sm" variant="tertiary" onPress={() => { setShowEngineering(false); setSearch(''); }}>返回改动</Button>}
            <span className="sync-box">
              <span className={`dot ${refreshing ? "busy" : ""}`} />
              {refreshing ? "同步中..." : "在线"}
            </span>
            <button
              className="btn-compact-refresh"
              disabled={refreshing}
              onClick={() => void handleRefresh()}
              aria-label="刷新功能进展"
              title="刷新功能进展"
            >
              <svg className={`refresh-spin ${refreshing ? "is-spinning" : ""}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16m0 0h5m-5 0v5M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8m0 0h-5m5 0V3" />
              </svg>
            </button>
          </div>
        </header>

        <div className="compact-card-list">
          {activeFeatures.slice(0, 3).map((f) => (
            <article key={f.id} className="feature-card-compact">
              <div className="compact-feature-card-head">
                <div className="card-header-compact">
                  <div className="compact-feature-title-row">
                    <span className="feature-title" style={{ fontSize: "14px" }} title={f.title}>{f.title}</span>
                    <button
                      type="button"
                      className="btn-compact-feature-execution"
                      onClick={() => void openExecutionDesk(f)}
                      aria-label={`打开「${f.title}」对应的执行台任务`}
                      title="打开该功能对应的执行台任务"
                    >
                      ↗
                    </button>
                  </div>
                  <div className="compact-feature-meta">
                    {renderBadge(f)}
                    {f.summary && <div className="feature-summary" title={f.summary}>{f.summary}</div>}
                  </div>
                </div>
              </div>
            </article>
          ))}
          {compactActiveCount > 3 && (
            <div className="compact-more">
              还有 {compactActiveCount - 3} 个功能，展开查看完整矩阵 ↗
            </div>
          )}
        </div>

        <footer className="compact-footer">
          <div className="compact-footer-status">
            <SyncDiagnostics compact />
            <span
              className={`compact-ledger-status${ledgerIssues.length > 0 ? " is-warning" : resource.error || data?.status === "error" ? " is-failed" : ""}`}
              title={ledgerIssues.length > 0 ? `台账 ${ledgerIssues.length} 条记录无法解析，其他记录仍可操作` : resource.error || data?.status === "error" ? "状态同步暂不可用" : "功能进展自动同步"}
            >
              {ledgerIssues.length > 0 ? `台账异常 · ${ledgerIssues.length}` : resource.error || data?.status === "error" ? "同步异常" : "自动同步"}
            </span>
          </div>
          <div className="compact-footer-actions">
            <button
              type="button"
              className="btn-compact-execution"
              onClick={() => void openExecutionDesk()}
              title="打开执行台总览"
            >
              执行台总览 ↗
            </button>
            <a href={data?.serverUrl || "http://127.0.0.1:47831"} target="_blank" rel="noopener noreferrer" style={{ color: "var(--link)", fontWeight: 550 }}>
              独立看板 ↗
            </a>
          </div>
          {navigationError && <span className="navigation-error" role="alert">执行台打开失败：{navigationError}</span>}
        </footer>
      </section>
    );
  }

  // Expanded feature matrix
  return (
    <section className="ft-widget expanded">
      <SyncDiagnostics />
      <style>{css}</style>

      <CreateFeature onCreated={id => { setFilter("all"); setSearch(""); setOpenDocs(previous => ({ ...previous, [id]: true })); }} />

      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand-box">
            <BrandIcon icon={metadata.icon} />
            <span className="brand-title">{metadata.name}</span>
            <span className="brand-count">{compactActiveCount} 个功能</span>
          </div>

          <div className="navbar-actions">
            <SearchField aria-label="搜索功能或仓库" value={search} onChange={setSearch} fullWidth className="search-box"><SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="搜索功能或仓库…" /><SearchField.ClearButton aria-label="清空搜索" /></SearchField.Group></SearchField>
            {config?.presentation === 'changes' && <Button size="sm" variant="tertiary" onPress={() => { setShowEngineering(false); setSearch(''); }}>返回改动</Button>}

            <span className="sync-box" title="后台自动同步，数据变化时更新">
              <span className={`dot ${refreshing || data?.status === "syncing" ? "busy" : data?.status === "error" ? "error" : ""}`} />
              {refreshing ? "同步中..." : data?.status === "syncing" ? "后台同步中..." : data?.status === "error" ? "查询异常" : "已就绪"}
            </span>

            <button className="btn-nav" disabled={refreshing} onClick={() => void handleRefresh()}>
              ↻ 刷新
            </button>

            <button
              type="button"
              className="btn-nav btn-execution"
              onClick={() => void openExecutionDesk()}
              title="打开执行台总览"
            >
              对应任务 ↗
            </button>

            <a
              href={data?.serverUrl || "http://127.0.0.1:47831"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-nav"
              title="在新标签页打开独立看板"
            >
              独立页面 ↗
            </a>
          </div>
        </div>
      </header>
      {navigationError && <div className="navigation-error expanded-navigation-error" role="alert">执行台打开失败：{navigationError}</div>}

      {ledgerIssues.length > 0 && (
        <div className="alert-box ledger-alert" role="alert">
          <strong>台账有 {ledgerIssues.length} 条记录无法解析，这些记录暂不可操作，其他记录可正常归档 / 恢复。</strong>
          <ul className="alert-list">
            {ledgerIssues.map((issue) => (
              <li key={issue.file}>
                <code>{issue.file.split("/").pop() || issue.file}</code> — {issue.error}
              </li>
            ))}
          </ul>
          <span className="alert-hint">请按每条记录的具体错误修复，修复后自动恢复显示，无需重启。</span>
        </div>
      )}

      {archiveError && (
        <div className="alert-box archive-alert" role="alert">
          <span>{archiveError}</span>
          <button type="button" className="alert-dismiss" onClick={() => setArchiveError("")} aria-label="关闭提示">×</button>
        </div>
      )}

      {/* Toolbar: Segmented Controls + Collapse */}
      <div className="toolbar-strip">
        <div className="segmented-control">
          <button className={`segment-tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            全部
          </button>
          <button className={`segment-tab ${filter === "has-links" ? "active" : ""}`} onClick={() => setFilter("has-links")}>
            有关联项目
          </button>
          <button className={`segment-tab ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
            进行中
          </button>
          <button className={`segment-tab ${filter === "merged" ? "active" : ""}`} onClick={() => setFilter("merged")}>
            已合并
          </button>
          <button className={`segment-tab ${filter === "archived" ? "active" : ""}`} onClick={() => setFilter("archived")}>
            已归档 ({archivedFeatures.length})
          </button>
        </div>

        <button className="btn-nav" onClick={() => setAllCollapsed(!allCollapsed)}>
          {allCollapsed ? "展开全部" : "折叠全部"}
        </button>
      </div>

      {/* Main Feature Cards Feed */}
      <div className="feature-feed">
        {displayedFeatures.map((f) => {
          const hasLinks = f.links && f.links.length > 0;
          const hasDoc = Boolean(f.body && f.body.trim());
          const isDocOpen = Boolean(openDocs[f.id]);

          return (
            <article key={f.id} className="feature-card">
              <header className="card-header">
                <div className="card-header-main">
                  <div className="feature-title-row">
                    <h2 className="feature-title">{f.title}</h2>
                    {renderBadge(f)}
                  </div>

                  {f.summary && <div className="feature-summary">{f.summary}</div>}
                  {!!f.gameCandidates?.length && <div className="feature-summary">游戏创作：{f.gameCandidates.filter(candidate => candidate.status === 'candidate').length} 个试玩候选 · {f.gameCandidates.filter(candidate => candidate.status === 'adopted').length} 个已采用</div>}

                  <div className="feature-meta-bar">
                    <span>首次记录于 12 小时前</span>
                    {f.next && (
                      <>
                        <span className="meta-dot">·</span>
                        <span>
                          <b>下一步：</b>
                          {f.next}
                        </span>
                      </>
                    )}
                    {(hasDoc || Boolean(f.gameCandidates?.length)) && (
                      <>
                        <span className="meta-dot">·</span>
                        <button className="btn-doc-toggle" onClick={() => toggleDoc(f.id)}>
                          {isDocOpen ? "收起决策与记录 ▴" : "查看决策与记录 ▾"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="card-header-actions">
                  <Dropdown>
                    <Dropdown.Trigger
                      className="copy-trigger"
                      aria-label={`复制「${f.title}」的功能内容与 PR 链接`}
                    >
                      复制文案 <span aria-hidden="true">▾</span>
                    </Dropdown.Trigger>
                    <Dropdown.Popover placement="bottom end">
                      <Dropdown.Menu
                        aria-label={`选择「${f.title}」的 PR 范围`}
                        onAction={(key) => void handleCopyFeature(f, String(key) as CopyRange)}
                      >
                        <Dropdown.Item id="dev">全部 dev</Dropdown.Item>
                        <Dropdown.Item id="pre">全部 pre</Dropdown.Item>
                        <Dropdown.Item id="main">全部 main</Dropdown.Item>
                        <Dropdown.Item id="all">全部分支</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown.Popover>
                  </Dropdown>
                  {copyFeedback[f.id] && (
                    <span className={`copy-feedback${copyFeedback[f.id].error ? " is-error" : ""}`} role="status">
                      {copyFeedback[f.id].message}
                    </span>
                  )}
                  <button
                    type="button"
                    className="btn-nav btn-execution"
                    onClick={() => void openExecutionDesk(f)}
                    title="打开该功能对应的执行台任务"
                  >
                    对应任务 ↗
                  </button>
                  {f.autoArchived ? (
                    <span
                      className="badge-auto-archived"
                      title="关联 PR 已合并且各环境部署完成，按交付状态自动归档；交付状态回退时会自动回到进行中，因此没有手动恢复"
                    >
                      自动归档
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn-nav"
                      disabled={archiveBusy === f.id}
                      onClick={() => void handleArchiveToggle(f)}
                      title={isArchived(f) ? "恢复为进行中" : "归档该功能"}
                    >
                      {archiveBusy === f.id ? "处理中…" : isArchived(f) ? "恢复" : "归档"}
                    </button>
                  )}
                </div>
              </header>

              {!allCollapsed && (
                <div className="card-body-content">
                  {!!f.gameCandidates?.length && <div className="ft-candidates" aria-label="游戏候选">{f.gameCandidates.filter(candidate => candidate.status === 'candidate').map(candidate => <div key={candidate.id} className="ft-candidate"><span>{gameCandidateLabel(candidate)} · 版本 {candidate.commit.slice(0, 8)}</span><span>{candidate.previewVerified ? '试玩检查已通过' : '等待试玩检查'}</span>{candidate.previewVerified && <button className="btn-nav" disabled={Boolean(candidateBusy)} onClick={() => void candidateAction(candidate, 'confirm').catch(() => undefined)}>加入我的游戏</button>}{candidateError[candidate.id] && <span role="alert">{candidateError[candidate.id]}</span>}</div>)}</div>}
                  {hasLinks ? (
                    <div className="table-scroll">
                      <table className="matrix-table">
                        <thead>
                          <tr>
                            <th className="col-project">项目 / 仓库</th>
                            <th className="col-env">
                              <span className="env-header-badge">
                                <span className="env-dot dev"></span>DEV
                              </span>
                            </th>
                            <th className="col-env">
                              <span className="env-header-badge">
                                <span className="env-dot pre"></span>PRE
                              </span>
                            </th>
                            <th className="col-env">
                              <span className="env-header-badge">
                                <span className="env-dot prod"></span>MAIN
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {f.links.map((link) => (
                            <tr key={link.repo}>
                              <td>
                                <div className="project-cell">
                                  {link.url ? <a href={link.url} target="_blank" rel="noopener noreferrer" className="project-name-link">
                                    <span>{link.repoNameShort}</span>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <line x1="7" y1="17" x2="17" y2="7"></line>
                                      <polyline points="7 7 17 7 17 17"></polyline>
                                    </svg>
                                  </a> : <span className="project-name-link">{link.repoNameShort}</span>}
                                  {link.mappingIssue && <div role="status">{link.mappingIssue}</div>}
                                  {link.trackingLabel && !link.mappingIssue && <div>{link.trackingLabel}</div>}
                                  <div className="project-repo-path">{link.repoName}</div>
                                  {link.branches && link.branches.length > 0 && (
                                    <div className="branch-pills">
                                      {link.branches.map((b) => (
                                        <span key={b} className="branch-tag">{b}</span>
                                      ))}
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    className="project-execution-link"
                                    onClick={() => void openExecutionDesk(f, link)}
                                    title={`在执行台打开 ${link.repoNameShort} 对应任务`}
                                  >
                                    执行台项目 ↗
                                  </button>
                                </div>
                              </td>

                              {(["dev", "pre", "main"] as const).map((branch) => {
                                const b = link.envBranches[branch];
                                return (
                                  <td key={branch} className="cell-env">
                                    <div className="stage-stack">
                                      {renderStage("合并", b?.merge, renderSegments(b?.prs))}
                                      {renderStage("CI", b?.ci, renderSegments(b?.ciLinks))}
                                      {renderStage("部署", b?.deploy, renderSegments(b?.deploymentLinks))}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-links-box">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span>尚未关联代码仓库 · 当前仅记录技术目标与方案决策</span>
                    </div>
                  )}

                  {(hasDoc || Boolean(f.gameCandidates?.length)) && isDocOpen && (
                    <div className="doc-panel">{f.body}{f.gameCandidates?.filter(candidate => candidate.status !== 'candidate').map(candidate => <div key={candidate.id} className="ft-adoption-record"><span>{gameCandidateLabel(candidate)} · {candidate.status === 'adopted' ? `已采用于 ${candidate.adoptedAt ?? ''}` : `已撤销于 ${candidate.undoneAt ?? ''}`} · 候选 {candidate.commit.slice(0, 8)}</span>{candidate.status === 'adopted' && <button className="btn-nav" disabled={Boolean(candidateBusy)} onClick={() => void candidateAction(candidate, 'undo').catch(() => undefined)}>撤销采用</button>}{candidateError[candidate.id] && <span role="alert">{candidateError[candidate.id]}</span>}</div>)}</div>
                  )}
                </div>
              )}
            </article>
          );
        })}

        {displayedFeatures.length === 0 && (
          <div className="empty-feed">没有匹配的功能记录</div>
        )}
      </div>
    </section>
  );
}

const css = `
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "PingFang SC", "Helvetica Neue", "Segoe UI", sans-serif;
  --font-mono: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;

  --bg-page: var(--wb-surface);
  --surface: var(--wb-paper);
  --surface-subtle: var(--wb-surface);
  --surface-header: var(--wb-paper);
  --surface-hover: var(--wb-surface-deep);
  --surface-active: var(--wb-surface-deep);


  --text-primary: var(--wb-ink);
  --text-secondary: var(--wb-ink-soft);
  --text-muted: var(--wb-muted);
  --text-faint: var(--wb-muted-light);

  --link: var(--wb-accent);
  --link-hover: var(--wb-accent-strong);

  --tone-ok-fg: var(--wb-success);
  --tone-ok-bg: var(--wb-success-pale);

  --tone-pending-fg: var(--wb-warning);
  --tone-pending-bg: var(--wb-warning-pale);

  --tone-failed-fg: var(--wb-danger);
  --tone-failed-bg: var(--wb-danger-pale);

  --tone-muted-fg: var(--wb-ink-soft);
  --tone-muted-bg: var(--wb-surface);


  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-pill: 9999px;
}

.ft-widget {
  box-sizing: border-box;
  width: 100%;
  font-family: var(--font-sans);
  color: var(--text-primary);
  background-color: var(--bg-page);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
.ft-widget * { box-sizing: border-box; }
.ft-widget.expanded { padding: 16px 20px 24px; min-width: 0; overflow-wrap: anywhere; }
.ft-widget .toolbar-strip { flex-wrap: wrap; }
.ft-widget .segmented-control { max-width: 100%; overflow-x: auto; }
.ft-widget .navbar-inner { flex-wrap: wrap; height: auto; min-height: 52px; padding: 8px 0; }
.ft-widget .feature-feed, .ft-widget .feature-card, .ft-widget .table-scroll { min-width: 0; max-width: 100%; }
.ft-widget .matrix-table { min-width: 760px; }
a { color: var(--link); text-decoration: none; }
a:hover { color: var(--link-hover); }

/* Compact View */
.ft-widget.compact {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 14px 16px 12px;
  background: var(--surface);
  border-radius: var(--radius-md);
}
.navbar-compact {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.compact-card-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 0 0 auto;
}
.compact-feature-card-head { display: block; }
.card-header-compact {
  min-width: 0;
  flex: 1;
}
.feature-card-compact {
  min-width: 0;
  border: 0;
  border-radius: var(--radius-md);
  padding: 0;
  background: var(--surface);
  box-shadow: none;
}

/* Expanded Navbar */
.navbar {
  background: var(--surface);
  border: 0;
  position: sticky;
  top: 0;
  z-index: 40;
  margin: 0 0 18px;
}
.navbar-inner {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 28px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand-box {
  flex-shrink: 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-logo {
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  border-radius: 5px;
  background: var(--link);
  color: var(--wb-accent-foreground);
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}
.brand-title {
  font-size: 15px;
  font-weight: 650;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}
.brand-count {
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 550;
  color: var(--text-muted);
  background: transparent;
  padding: 2px 0;
  border-radius: var(--radius-sm);
  border: 0;
}
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.card-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.copy-trigger { min-height: 32px; height: 32px; padding: 0 9px; font-size: 11px; font-weight: 600; gap: 5px; }
.copy-feedback { max-width: 170px; color: var(--tone-ok-fg); font-size: 11px; line-height: 1.35; text-align: right; }
.copy-feedback.is-error { color: var(--tone-failed-fg); }
.search-box {
  position: relative;
  width: 220px;
}
.sync-box {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--tone-ok-fg);
}
.dot.busy {
  background-color: var(--link);
  animation: pulse 1s infinite alternate;
}
.dot.error {
  background-color: var(--tone-failed-fg);
}
@keyframes pulse { from { opacity: 0.3; } to { opacity: 1; } }

.btn-nav {
  background: var(--surface-subtle);
  border: 0;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  height: 32px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.12s ease;
  white-space: nowrap;
}
.btn-nav:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.toolbar-strip {
  max-width: 1360px;
  margin: 0 auto 14px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.segmented-control {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: var(--surface-hover);
  padding: 2px;
  border-radius: var(--radius-md);
  border: 0;
}
.segment-tab {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.12s ease;
}
.segment-tab:hover { color: var(--text-primary); }
.segment-tab.active {
  background: var(--surface);
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: none;
}

.feature-feed {
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* Light mode needs a recessed canvas and white cards, not near-white on near-white. */
:root[data-theme="light"] .ft-widget.expanded {
  --bg-page: color-mix(in srgb, var(--wb-surface) 92%, var(--wb-ink));
  --surface-subtle: var(--wb-surface-deep);
}
:root[data-theme="light"] .expanded .feature-card {
  --feature-surface: var(--wb-paper);
  --feature-inset: var(--wb-surface-deep);
}

/* Dark mode: lower surface contrast and desaturate accents so dense status data stays calm. */
:root[data-theme="dark"] .ft-widget {
  --bg-page: color-mix(in srgb, var(--wb-surface) 90%, var(--wb-paper) 10%);
  --surface: color-mix(in srgb, var(--wb-paper) 86%, var(--wb-surface) 14%);
  --surface-subtle: color-mix(in srgb, var(--wb-surface-deep) 70%, var(--wb-surface) 30%);
  --surface-hover: color-mix(in srgb, var(--wb-surface-deep) 64%, var(--wb-paper) 36%);
  --surface-active: color-mix(in srgb, var(--wb-surface-deep) 52%, var(--wb-paper) 48%);
  --text-primary: color-mix(in srgb, var(--wb-ink) 82%, var(--wb-paper) 18%);
  --text-secondary: color-mix(in srgb, var(--wb-ink-soft) 82%, var(--wb-paper) 18%);
  --text-muted: color-mix(in srgb, var(--wb-muted) 90%, var(--wb-paper) 10%);
  --text-faint: color-mix(in srgb, var(--wb-muted-light) 88%, var(--wb-paper) 12%);
  --link: color-mix(in srgb, var(--wb-accent) 82%, var(--wb-paper) 18%);
  --link-hover: color-mix(in srgb, var(--wb-accent-strong) 82%, var(--wb-paper) 18%);
  --tone-ok-fg: color-mix(in srgb, var(--wb-success) 78%, var(--wb-paper) 22%);
  --tone-ok-bg: color-mix(in srgb, var(--wb-success-pale) 78%, var(--bg-page) 22%);
  --tone-pending-fg: color-mix(in srgb, var(--wb-warning) 78%, var(--wb-paper) 22%);
  --tone-pending-bg: color-mix(in srgb, var(--wb-warning-pale) 78%, var(--bg-page) 22%);
  --tone-failed-fg: color-mix(in srgb, var(--wb-danger) 78%, var(--wb-paper) 22%);
  --tone-failed-bg: color-mix(in srgb, var(--wb-danger-pale) 78%, var(--bg-page) 22%);
  --tone-muted-fg: var(--text-secondary);
  --tone-muted-bg: color-mix(in srgb, var(--surface-subtle) 76%, var(--bg-page) 24%);
}
:root[data-theme="dark"] .ft-widget .feature-card {
  --feature-surface: color-mix(in srgb, var(--surface) 88%, var(--bg-page) 12%);
  --feature-inset: color-mix(in srgb, var(--feature-surface) 85%, var(--bg-page) 15%);
}

/* Feature Card */
.feature-card {
  --feature-surface: color-mix(in srgb, var(--surface) 97%, var(--text-primary));
  --feature-inset: color-mix(in srgb, var(--feature-surface) 96%, var(--text-primary));
  background: var(--feature-surface);
  border: 0;
  border-radius: var(--radius-lg);
  box-shadow: none;
  overflow: hidden;
}
.feature-card:hover {
  box-shadow: none;
}
.card-header {
  padding: 24px 24px 18px;
  background: transparent;
  border: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.card-header-main { flex: 1; min-width: 0; }
.feature-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.feature-title {
  font-size: 16px;
  font-weight: 650;
  color: var(--text-primary);
  letter-spacing: -0.25px;
  margin: 0;
}
.badge-overall {
  font-size: 11px;
  font-weight: 550;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  line-height: 1.45;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
}
.badge-overall.ok {
  color: var(--tone-ok-fg);
  background: var(--tone-ok-bg);
}
.badge-overall.pending {
  color: var(--tone-pending-fg);
  background: var(--tone-pending-bg);
}
.badge-overall.muted {
  color: var(--tone-muted-fg);
  background: var(--tone-muted-bg);
}

.feature-summary {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 8px;
  line-height: 1.65;
  max-width: 960px;
}
.feature-meta-bar {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.meta-dot {
  color: var(--text-faint);
  font-size: 10px;
}
.feature-meta-bar b {
  color: var(--text-secondary);
  font-weight: 550;
}
.btn-doc-toggle {
  font-size: 11px;
  color: var(--link);
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.btn-doc-toggle:hover {
  color: var(--link-hover);
  text-decoration: underline;
}

/* Matrix Table Grid */
.table-scroll { overflow-x: auto; padding-bottom: 8px; }
.matrix-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  text-align: left;
}
.matrix-table thead th {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  padding: 12px 24px 8px;
  background: transparent;
  border: 0;
  letter-spacing: 0.3px;
}
.matrix-table th.col-project { width: 25%; }
.matrix-table th.col-env {
  width: 25%;
  border: 0;
}
.env-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 650;
  color: var(--text-secondary);
  text-transform: uppercase;
}
.env-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.env-dot.dev { background: var(--link); }
.env-dot.pre { background: var(--tone-pending-fg); }
.env-dot.prod { background: var(--tone-ok-fg); }

.matrix-table tbody tr {
  border: 0;
  transition: background-color 0.12s ease;
}
.matrix-table tbody tr:last-child { border-bottom: none; }
.matrix-table tbody tr:hover { background-color: var(--feature-inset); }
.matrix-table td {
  padding: 20px 24px;
  vertical-align: top;
}
.project-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.project-name-link {
  font-size: 13px;
  font-weight: 650;
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.project-name-link svg {
  opacity: 0.5;
  transition: opacity 0.15s;
}
.project-name-link:hover svg { opacity: 1; }
.project-repo-path {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  word-break: break-all;
}
.branch-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}
.branch-tag {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  background: var(--surface-subtle);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  border: 0;
}
.project-execution-link {
  align-self: flex-start;
  margin-top: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--link);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}
.project-execution-link:hover {
  color: var(--link-hover);
  text-decoration: underline;
}
.matrix-table td.cell-env {
  border: 0;
}

/* Pipeline Stages — one segmented chip per step
   (status verdict and source links share a single ButtonGroup) */
.stage-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stage-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 22px;
}
.stage-name {
  width: 24px;
  flex: 0 0 24px;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 550;
}
.stage-chip {
  display: inline-flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 2px;
  white-space: nowrap;
  border: 0;
  border-radius: var(--radius-sm);
  background: var(--surface-subtle);
  overflow: hidden;
  line-height: 1;
  box-shadow: none;
}
.chip-status {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  color: var(--tone-muted-fg);
  background: var(--surface-subtle);
  border: 0;
  user-select: none;
}
.chip-status.tone-ok { color: var(--tone-ok-fg); background: var(--tone-ok-bg); }
.chip-status.tone-pending { color: var(--tone-pending-fg); background: var(--tone-pending-bg); }
.chip-status.tone-failed { color: var(--tone-failed-fg); background: var(--tone-failed-bg); }
.chip-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  min-width: 20px;
  padding: 0 5px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  color: var(--link);
  text-decoration: none;
  border: 0;
  transition: background 0.12s ease, color 0.12s ease;
}
.chip-link:hover {
  background: var(--surface-hover);
  color: var(--link-hover);
}
.chip-link.tone-ok { color: var(--tone-ok-fg); background: var(--tone-ok-bg); font-weight: 650; }
.chip-link.tone-ok:hover { background: var(--tone-ok-bg); }
.chip-link.tone-failed { color: var(--tone-failed-fg); background: var(--tone-failed-bg); font-weight: 700; }
.chip-link.tone-failed:hover { background: var(--tone-failed-bg); }
.chip-link.tone-pending { color: var(--tone-pending-fg); background: var(--tone-pending-bg); font-weight: 600; }
.chip-link.tone-pending:hover { background: var(--tone-pending-bg); }
.chip-link.tone-muted { color: var(--wb-muted); background: var(--surface-subtle); font-weight: 500; }
.chip-link.tone-muted:hover { background: var(--surface-active); }
.stage-chip > :last-child {
  border: 0;
}

.empty-links-box {
  padding: 22px 24px;
  background: var(--surface-subtle);
  border: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}
.empty-links-box svg { color: var(--text-faint); }
.doc-panel {
  padding: 18px 22px;
  background: var(--surface-subtle);
  border: 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.65;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}
.empty-feed {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
  font-size: 13px;
  background: var(--surface);
  border: 0;
  border-radius: var(--radius-lg);
}

/* A tapered rule separates summaries: thin at both ends, thicker in the middle. */
.feature-card-compact + .feature-card-compact::before {
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  margin: 7px 0;
  background: var(--text-faint);
  opacity: .22;
  clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%);
}
.compact-feature-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.compact-feature-title-row .feature-title {
  flex: 1 1 auto;
}
.compact .feature-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}
.compact-feature-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin-top: 5px;
}
.compact-feature-meta .badge-overall {
  flex: 0 0 auto;
  min-height: 24px;
  padding: 0 8px;
  line-height: 1;
  white-space: nowrap;
}
.compact .feature-summary,
.compact-feature-meta .feature-summary {
  flex: 1 1 auto;
  min-width: 0;
  color: var(--text-muted);
  margin-top: 0;
  display: block;
  line-height: 1.4;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.compact .navbar-actions { width: auto; margin-left: auto; flex-shrink: 0; }
.compact-more { margin-top: 6px; font-size: 11px; line-height: 1.4; color: var(--text-muted); }
.compact-footer {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 10px;
  color: var(--text-faint);
  padding-top: 8px;
  margin-top: auto;
}
.compact-footer a { white-space: nowrap; }
.compact-footer-status {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
  gap: 8px;
  white-space: nowrap;
}
.compact-diagnostic { color: var(--text-muted); }
.compact-ledger-status { color: var(--text-faint); }
.compact-ledger-status.is-warning { color: var(--tone-pending-fg); }
.compact-ledger-status.is-failed { color: var(--tone-failed-fg); }
.compact-footer-actions {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 10px;
}
.btn-compact-execution {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--link);
  font: inherit;
  font-weight: 550;
  cursor: pointer;
  white-space: nowrap;
}
.btn-compact-execution:hover { color: var(--link-hover); text-decoration: underline; }
.btn-compact-feature-execution {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  margin: 0;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--text-faint);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.btn-compact-feature-execution:hover {
  color: var(--link);
  background: var(--surface-subtle);
}
.navigation-error {
  color: var(--tone-failed-fg);
  overflow-wrap: anywhere;
}
.expanded-navigation-error {
  max-width: 1360px;
  margin: -8px auto 12px;
  font-size: 11px;
}
/* Write-blocked / action-failed notices: same recessed surface as other inline panels. */
.alert-box {
  max-width: 1360px;
  margin: 0 auto 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--tone-failed-bg);
  color: var(--tone-failed-fg);
  font-size: 12px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.alert-list {
  margin: 6px 0 0;
  padding-left: 18px;
}
.alert-list code {
  font-family: var(--font-mono);
  font-size: 11px;
}
.alert-hint {
  display: block;
  margin-top: 6px;
  color: var(--text-secondary);
}
.archive-alert {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.alert-dismiss {
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 15px;
  line-height: 1;
  padding: 0 2px;
  cursor: pointer;
}
.badge-auto-archived {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  background: var(--surface-subtle);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.btn-compact-refresh {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; flex-shrink: 0; padding: 0;
  border: 0; border-radius: 8px; background: var(--surface-subtle);
  color: var(--text-muted); cursor: pointer;
}
.btn-compact-refresh:hover { background: var(--surface-hover); color: var(--text-primary); }
.refresh-spin.is-spinning { animation: ft-spin 1s linear infinite; }
@keyframes ft-spin { to { transform: rotate(360deg); } }
.ft-widget :is(button, a, input):focus-visible { outline: 2px solid var(--link); outline-offset: 3px; }
.ft-widget button:disabled { cursor: wait; opacity: .55; }
.ft-widget .sync-box { white-space: nowrap; flex-shrink: 0; }
.matrix-table tbody tr:nth-child(even) { background: var(--feature-inset); }
.feature-card .doc-panel, .feature-card .empty-links-box { background: var(--feature-inset); }
.ft-candidates{display:grid;gap:8px;margin-bottom:14px}.ft-candidate,.ft-adoption-record{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:9px 11px;border:1px solid var(--wb-muted-light);border-radius:8px;font-size:12px}.ft-candidate span:nth-child(2){color:var(--text-muted)}.ft-candidate [role=alert],.ft-adoption-record [role=alert]{color:var(--wb-danger);width:100%}.ft-adoption-record{margin-top:9px}.ft-adoption-record .btn-nav{margin-left:auto}
.stage-chip { max-width: 100%; }
.chip-link { overflow-wrap: anywhere; white-space: normal; line-height: 1.4; }
.chip-link:hover { text-decoration: underline; }
.expanded .navbar { background: var(--bg-page); }
.expanded .navbar-actions { flex-wrap: wrap; }
.expanded .search-box { flex: 1 1 180px; }
@media(max-width:680px){
  .ft-widget.expanded{padding:12px 12px 20px}
  .expanded .navbar-inner,.expanded .navbar-actions{gap:10px;flex-wrap:wrap}
  .expanded .navbar-actions{width:100%;min-width:0}
  .expanded .search-box{width:100%;min-width:0;flex:1 1 100%}
  .expanded .segmented-control{flex-wrap:nowrap;max-width:100%}
  .expanded .segmented-control button{flex-shrink:0;min-height:36px}
  .expanded .card-header{padding:18px 16px;gap:10px;flex-direction:column;align-items:stretch}
  .expanded .card-header-actions{flex-wrap:wrap;justify-content:flex-start}
  .expanded .copy-feedback{flex:0 1 100%;max-width:100%}
  .expanded .feature-title-row{align-items:flex-start;gap:8px}
  .expanded .table-scroll{overscroll-behavior-x:contain}
  .expanded .btn-nav{white-space:nowrap;flex-shrink:0;min-height:36px}
}
@media(prefers-reduced-motion:reduce){
  .ft-widget *, .ft-widget *::before { animation:none !important; transition:none !important; }
}
`;

export default withNotePrerequisites(View);
