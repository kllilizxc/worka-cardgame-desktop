import {useLocale} from '@dsh-workbench/react';
import {ui} from './messages';
import {NoteGuidance} from '@dsh-workbench/react';
import {withNotePrerequisites} from '@dsh-workbench/react';
import {taskOutcome, currentTaskOutcome} from '@dsh-workbench/runtime';
import {inspectionPresentation} from './inspection';
import { NoteIcon } from "@dsh-workbench/react";
import { executionPresentation } from "./execution-presentation";
import { SearchField, ScrollShadow } from "@heroui/react";
import { useMemo, useState, useEffect, useRef } from "react";
import { useNote } from "@dsh-workbench/react";
import { recordedExecutionStatus, requirementProgress } from "./projection";
import type {Delegation,ExecutionDeskState} from "./model";
import { compareDeskTasks, executionDisplayName, isExecuting } from "./display";


const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

/**
 * 状态配色与释义。`review` 与 `unknown` 是两种完全不同的情况，必须分开展示：
 * - review：原生这一轮已经跑完，但这次委托的业务结论还没有记录（checkpoint）。
 * - unknown：原生执行状态无法确认（找不到运行 / 调用边界出错），需要只读核对。
 */
const STATUS: Record<string, { label: string; color: string; soft: string; border: string; hint: string }> = {
  dispatching: { get label() { return ui("投递中"); }, color: "var(--wb-accent)", soft: "var(--wb-accent-pale)", border: "var(--wb-accent-pale)", get hint() { return ui("正在把委托投递给原生会话。"); } },
  interrupted: {get label() { return ui("已中断"); }, color: "var(--wb-warning)", soft: "var(--wb-warning-pale)", border: "var(--wb-warning-pale)", get hint() { return ui("宿主中断了本轮执行，已保留现有记录。"); }},
  stopping: {get label() { return ui("正在停止"); }, color: "var(--wb-muted)", soft: "var(--wb-surface)", border: "var(--wb-line)", get hint() { return ui("已请求停止，等待执行确认。"); }},
  running: { get label() { return ui("执行中"); }, color: "var(--wb-accent)", soft: "var(--wb-accent-pale)", border: "var(--wb-accent-pale)", get hint() { return ui("原生会话正在执行这个委托。"); } },
  review: {
    get label() { return ui("本轮结束"); },
    color: "var(--wb-warning)",
    soft: "var(--wb-warning-pale)",
    border: "var(--wb-warning-pale)",
    get hint() { return ui("本轮执行已结束，成果尚未记录或仍有剩余工作；这不表示需要用户确认，也不会自动开启补录会话。"); },
  },
  "needs-input": { get label() { return ui("需补充"); }, color: "var(--wb-warning)", soft: "var(--wb-warning-pale)", border: "var(--wb-warning-pale)", get hint() { return ui("宿主存在尚未回答的问题或尚未处理的审批请求。"); } },
  paused: { get label() { return ui("已暂停"); }, color: "var(--wb-muted)", soft: "var(--wb-surface)", border: "var(--wb-line)", get hint() { return ui("已暂停，不会再自动推进；恢复后继续。"); } },
  completed: { get label() { return ui("本轮结束"); }, color: "var(--wb-success)", soft: "var(--wb-success-pale)", border: "var(--wb-success-pale)", get hint() { return ui("本轮执行正常结束；不代表预览通过、代码合入或发布。"); } },
  blocked: { get label() { return ui("受阻"); }, color: "var(--wb-danger)", soft: "var(--wb-danger-pale)", border: "var(--wb-danger-pale)", get hint() { return ui("存在无法自行推进的阻塞，需要处理。"); } },
  failed: { get label() { return ui("执行异常"); }, color: "var(--wb-danger)", soft: "var(--wb-danger-pale)", border: "var(--wb-danger-pale)", get hint() { return ui("原生执行失败，需要查看原因后决定是否重试。"); } },
  cancelled: { get label() { return ui("已取消"); }, color: "var(--wb-muted)", soft: "var(--wb-surface)", border: "var(--wb-line)", get hint() { return ui("执行已被取消。"); } },
  unknown: {
    get label() { return ui("结果未知"); },
    color: "var(--wb-warning)",
    soft: "var(--wb-warning-pale)",
    border: "var(--wb-warning-pale)",
    get hint() { return ui("原生执行状态无法确认（例如找不到运行记录或调用边界出错）。会先做一次只读核对，不会盲目重放原动作。"); },
  },
};

function statusOf(status: string) {
  return STATUS[status] ?? STATUS.unknown;
}

function statusOfTask(item: Delegation) {
  const executionStatus = recordedExecutionStatus(item);
  const status = item.execution?.status === 'cancel-requested' ? 'stopping'
    : item.execution?.result?.interrupted && executionStatus === 'unknown' ? 'interrupted' : executionStatus;
  return statusOf(status);
}

function resultOf(item: Delegation): string {
  return currentTaskOutcome(item)?.summary?.trim() || item.execution?.result?.text?.trim() || "";
}

function taskTitle(item: Delegation): string {
  const title = executionDisplayName(item);
  const suffix = item.source.itemId ? ` · ${item.source.itemId}` : "";
  return suffix && title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
}

function Icon({ path, size = 13 }: { path: string; size?: number }) {
  useLocale();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const ICON = {
  desk: "m4 6 8-4 8 4-8 4-8-4Zm0 6 8 4 8-4m-16 5 8 4 8-4",
  refresh: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16m0 0h5m-5 0v5M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8m0 0h-5m5 0V3",
  pause: "M10 4H6v16h4V4Zm8 0h-4v16h4V4Z",
  archive: "M21 8v13H3V8M1 3h22v5H1zM10 12h4",
  restore: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3",
  source: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 6 6v4",
  plus: "M12 5v14M5 12h14",
  chevronDown: "m6 9 6 6 6-6",
};

function IconButton({
  icon,
  label,
  onClick,
  tone = "var(--wb-muted-light)",
  size = 26,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  tone?: string;
  size?: number;
}) {
  useLocale();
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: size,
        height: size,
        display: "grid",
        placeItems: "center",
        border: "none",
        borderRadius: 6,
        background: hover ? "var(--wb-surface-deep)" : "transparent",
        color: hover ? "var(--wb-ink-soft)" : tone,
        cursor: "pointer",
        flexShrink: 0,
        transition: "all 0.12s ease",
      }}
    >
      <Icon path={icon} size={size <= 22 ? 12 : 13} />
    </button>
  );
}

function needsAction(item: Delegation) { return executionPresentation(item).needsAction || inspectionPresentation(item).needsReview; }

function ProposalDiff({delegationId,proposalId,index}:{delegationId:string;proposalId:string;index:number}){
  useLocale();
 const {actions}=useNote<typeof import('./actions')>();const [text,setText]=useState('');
 return <div><button className="desk-link" onClick={()=>void actions.inspectProposal({delegationId,proposalId,operationIndex:index}).then(r=>setText(r.diff||ui("无差异"))).catch(e=>setText(String(e)))}>{ui.rich("打开修改差异")}</button>{text&&<pre style={{whiteSpace:'pre-wrap',maxHeight:360,overflow:'auto'}}>{text}</pre>}</div>;
}

function TaskRow({ item, onOpen, onArchive, onRestore, onSource, onPreview, onTracker, highlighted }: {
  item: Delegation;
  onOpen: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onSource: () => void;
  onPreview: () => void;
  onTracker: () => void;
  highlighted: boolean;
}) {
  useLocale();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { if (highlighted) ref.current?.scrollIntoView({ block: "center" }); }, [highlighted]);
  // Evidence is in the task's file; read it only for tasks that show it.
  const {useQuery}=useNote<typeof import("./actions")>();
  const evidence = useQuery("evidence", { delegationId: item.id }, { enabled: Boolean(item.origin) }).data ?? [];
  const result = executionPresentation(item);
  const summary = resultOf(item) || item.execution?.error || statusOfTask(item).hint;
  const retry = item.nextDispatchAt !== undefined ? ui("正在重试投递") :
    item.lastDispatchError && !item.owner ? ui("投递失败：{p0}", { p0: item.lastDispatchError }) : "";
  const canOpen = Boolean(item.owner?.sessionId);
  return <article ref={ref} className="desk-row" data-task-id={item.id}
    style={{ background: highlighted ? "var(--wb-accent-pale)" : undefined }}>
    <button type="button" className="desk-open" onClick={onOpen} disabled={!canOpen}
      aria-label={canOpen ? ui("打开会话：{p0}", { p0: taskTitle(item) }) : taskTitle(item)}>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span className="desk-title">{taskTitle(item)}</span>
        {item.origin && <span className="desk-summary">{item.origin.label} · {inspectionPresentation(item).type}</span>}
        <span className="desk-summary">{summary.replace(/\s+/g, " ")}</span>
      </span>
      <span className="desk-status" title={statusOfTask(item).hint} style={{ color: statusOfTask(item).color }}>{statusOfTask(item).label} · {taskOutcome(item).delivery}</span>
      {canOpen && <span className="desk-open-icon"><Icon path={ICON.external} size={13} /></span>}
    </button>
     <div className="desk-meta"><span>{item.origin ? inspectionPresentation(item).next : result.next}</span>
      {result.executionError && <span className="desk-notice" title={result.executionError}>{ui.rich("本轮运行异常：{p0}", { p0: result.executionError })}</span>}
      <span>{ui.rich("需求第 {p0} 版 · {p1}", { p0: item.requirementVersion ?? 1, p1: ({saved:ui("待投递"),queued:ui("变更待处理"),delivered:ui("已送入原会话"),handled:ui("已处理")})[requirementProgress(item)] })}</span>
      {retry && <span className="desk-notice" title={item.lastDispatchError}>{retry}</span>}
      {item.source.noteId && <button type="button" className="desk-link" onClick={onSource}>{ui.rich("查看来源")}</button>}
      {item.preview?.noteId && <button type="button" className="desk-link" onClick={onPreview}>{ui.rich("查看预览台")}</button>}
      <button type="button" className="desk-link" title={ui("打开 Feature Tracker 总览")} onClick={onTracker}>Feature Tracker ↗</button>
      {!canOpen && <span>{ui.rich("尚未建立会话")}</span>}
      <button type="button" className="desk-link desk-archive" onClick={item.archived ? onRestore : onArchive}>{item.archived ? ui("恢复") : ui("归档")}</button>
    </div>
    {item.origin && <details className="desk-meta" open={highlighted}><summary>{ui.rich("查看证据与修复提案（{p0}）", { p0: item.proposals?.length ?? 0 })}</summary><div>
      {evidence.map((e,i)=><p key={i}>{e.summary} {e.ref && <code>{e.ref}</code>}</p>)}
      {(item.proposals??[]).map(p=><section key={p.id}><strong>{p.summary}</strong>{p.operations.map((o,i)=><div key={i}>{o.repository} · {o.targetRef}<br/>{ui.rich("基线 ")}<code>{o.expectedBase}</code><br/>{ui.rich("候选 ")}<code>{o.head}</code>{o.kind==='git-merge'&&<ProposalDiff delegationId={item.id} proposalId={p.id} index={i}/>} {o.kind==='pr-merge'&&<a href={o.url} target="_blank" rel="noreferrer">{ui.rich("查看代码差异")}</a>}</div>)}{p.evidence.map((e,i)=><p key={i}>{e}</p>)}</section>)}
    </div></details>}
  </article>;
}

/** 紧凑小组件行 */
function CompactRow({
  item,
  onOpen,
  onArchive,
  onRestore,
  highlighted,
}: {
  item: Delegation;
  onOpen: () => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  highlighted: boolean;
}) {
  useLocale();
  const [hover, setHover] = useState(false);
  const canOpen = Boolean(item.owner?.sessionId);

  return (
    <div
      role={canOpen ? "button" : undefined}
      tabIndex={canOpen ? 0 : undefined}
      onClick={(event) => { if (canOpen) { event.stopPropagation(); onOpen(); } }}
      onKeyDown={(e) => {
        if (canOpen && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "3px 6px",
        borderRadius: 6,
        background: highlighted ? "var(--wb-accent-pale)" : hover && canOpen ? "var(--wb-surface)" : "transparent",
        cursor: canOpen ? "pointer" : "default",
        transition: "background 0.12s ease",
      }}
    >
      <i
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: statusOfTask(item).color,
          flexShrink: 0,
        }}
      />
      <div style={{ minWidth: 0, flex: 1, display: "flex", alignItems: "center" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: item.archived ? "var(--wb-muted)" : "var(--wb-ink)",
            lineHeight: 1.25,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {taskTitle(item)}{item.origin && <small> {ui.rich(" · 来自巡检 · {p0}", { p0: inspectionPresentation(item).type })}</small>}
        </div>
      </div>
      <span
        title={statusOfTask(item).hint}
        style={{ fontSize: 10.5, color: statusOfTask(item).color, fontWeight: 600, flexShrink: 0, cursor: "help", lineHeight: 1.25 }}
      >
        {statusOfTask(item).label} · {taskOutcome(item).delivery}
      </span>
      <IconButton
        icon={item.archived ? ICON.restore : ICON.archive}
        label={item.archived ? ui("恢复到活动列表") : ui("归档")}
        size={22}
        onClick={() => (item.archived ? onRestore(item.id) : onArchive(item.id))}
      />
    </div>
  );
}

function Tabs({
  value,
  onChange,
  active,
  archived,
  compact,
}: {
  value: "active" | "archived";
  onChange: (next: "active" | "archived") => void;
  active: number;
  archived: number;
  compact?: boolean;
}) {
  useLocale();
  const options: Array<{ id: "active" | "archived"; label: string; count: number }> = [
    { id: "active", label: compact ? ui("活动") : ui("活动委托"), count: active },
    { id: "archived", label: ui("已归档"), count: archived },
  ];
  return (
    <div
      style={{
        display: "inline-flex",
        background: "var(--wb-surface-deep)",
        borderRadius: 8,
        padding: 2,
        gap: 2,
        flexShrink: 0,
      }}
    >
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            style={{
              border: "none",
              borderRadius: 6,
              padding: compact ? "3px 8px" : "4px 12px",
              fontSize: compact ? 11 : 12,
              fontWeight: selected ? 650 : 450,
              color: selected ? "var(--wb-ink)" : "var(--wb-muted)",
              background: selected ? "var(--wb-paper)" : "transparent",
              boxShadow: selected ? "0 1px 2px rgba(15,23,42,0.06)" : "none",
              cursor: "pointer",
              transition: "all 0.12s ease",
            }}
          >
            {option.label}
            <span style={{ marginLeft: 5, color: selected ? "var(--wb-muted)" : "var(--wb-muted-light)", fontFamily: MONO, fontSize: 11 }}>
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const EMPTY_ACTIVE = () => ui("暂无活动委托。从待办交办或巡检发现新问题时，委托会自动出现在这里。");
const EMPTY_ARCHIVED = () => ui("暂无已归档委托。");
function View() {
  useLocale();
  const {state:data,config,actions,host:workbench,mode,metadata,focus} = useNote<typeof import("./actions")>();
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const focusArchived = focus ? data.delegations?.[focus]?.archived : undefined;
  const [tab, setTab] = useState<"active" | "archived">(focusArchived ? "archived" : "active");

  const all = useMemo(() => Object.values(data.delegations ?? {}), [data.delegations]);
  const active = useMemo(() => all.filter((i) => !i.archived), [all]);
  const archived = useMemo(() => all.filter((i) => i.archived), [all]);
  const running = useMemo(
    () => active.filter(isExecuting).length,
    [active],
  );
  const needsAttention = useMemo(
    () => active.filter(needsAction).length,
    [active],
  );

  const run = async (fn: () => Promise<unknown>) => {
    setError("");
    try {
      await fn();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  };

  const handleArchive = (id: string) => void run(() => actions.archiveDelegation({ delegationId: id }));
  const handleRestore = (id: string) => void run(() => actions.restoreDelegation({ delegationId: id }));

  // Surface attention items first, then the most recently interacted or completed task.
  const list = [...(tab === "archived" ? archived : active)].sort((a,b)=>Number(needsAction(b))-Number(needsAction(a))||compareDeskTasks(a,b));
  const filtered = list.filter(item => (filter === "all" || (filter === "inspection" ? item.origin?.kind === "inspection" : filter === "attention" ? needsAction(item) : isExecuting(item))) &&
    `${taskTitle(item)} ${item.goal} ${resultOf(item)}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const shown = filtered;
  const openTask = async (item: Delegation) => {
    if (!item.owner) return;
    await workbench.openSession(item.owner.sessionId);
    if (item.outcome) await actions.markResultRead({delegationId:item.id,recordedAt:item.outcome.recordedAt});
  };

  const openDshPanel = () => void run(async () => {
    await workbench.openSession("__note_conversation__:" + metadata.id);
  });

  // ---------------------------------------------------------------- compact
  if (mode === "compact") {
    const summary =
      needsAttention > 0
        ? ui("{p0} 项待处理", { p0: needsAttention })
        : running > 0
          ? ui("{p0} 项执行中", { p0: running })
          : active.length > 0
            ? ui("{p0} 项活动", { p0: active.length })
            : ui("暂无活动");

    return (
      <div
        style={{
          boxSizing: "border-box",
          width: "100%",
          height: "100dvh",
          minHeight: 0,
          overflow: "hidden",
          padding: "10px 12px",
          background: "var(--wb-paper)",
          color: "var(--wb-ink)",
          fontFamily: FONT,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "linear-gradient(135deg, #4f46e5 0%, var(--wb-accent) 100%)",
                color: "var(--wb-accent-foreground)",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 2px 5px rgba(79, 70, 229, 0.25)",
                flexShrink: 0,
              }}
            >
              <NoteIcon icon={metadata.icon} size={13} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {metadata.name}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--wb-muted)", marginTop: 1 }}>{summary}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:2,flexShrink:0}}>
            <button type="button" aria-label={ui("发起 DSH 消息面板")} title={ui("发起 DSH 消息面板")} onClick={openDshPanel} style={{ display: "inline-flex", alignItems: "center", gap: 2, height: 22, padding: "0 6px", border: "none", borderRadius: 6, background: "var(--wb-accent-pale)", color: "var(--wb-accent)", cursor: "pointer", flexShrink: 0, fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>
              <Icon path={ICON.plus} size={11} />{ui.rich("新增")}</button>
            <Tabs value={tab} onChange={next=>{setTab(next);setFilter("all");}} active={active.length} archived={archived.length} compact />
          </div>
        </div>

        {tab === "active" && <div role="group" aria-label={ui("筛选执行状态")} style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[["all", ui("全部"), active.length], ["inspection", ui("来自巡检"), active.filter(i=>i.origin).length], ["attention", ui("待处理"), needsAttention], ["running", ui("执行中"), running]].map(([id,label,count])=><button key={id} type="button" aria-pressed={filter===id} onClick={()=>setFilter(String(id))} style={{border:"1px solid var(--wb-line)",borderRadius:6,padding:"4px 7px",fontSize:11,cursor:"pointer",background:filter===id?"var(--wb-accent-pale)":"var(--wb-paper)",color:filter===id?"var(--wb-accent)":"var(--wb-ink-soft)"}}>{label} {count}</button>)}
        </div>}

        {shown.length ? (
          <ScrollShadow aria-label={ui("委托列表")} style={{ flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {shown.map((item) => (
              <CompactRow
                key={item.id}
                item={item}
                highlighted={focus === item.id}
                onOpen={() => void run(() => openTask(item))}
                onArchive={handleArchive}
                onRestore={handleRestore}
              />
            ))}
          </div>
          </ScrollShadow>
        ) : (
          <div style={{ padding: "4px 12px", flex: 1, minHeight: 0, overflowY: "auto", textAlign: "center", fontSize: 12, color: "var(--wb-muted-light)" }}>
            {tab === "archived" ? EMPTY_ARCHIVED() : filter === "running" ? ui("暂无执行中的任务") : filter === "attention" ? ui("暂无待处理任务") : <NoteGuidance title={ui("还没有委托")} description={ui("先记录待办，再明确交办给执行台。")} action={{label:ui("查看交办来源"),onPress:()=>workbench.openLinkedNote('repair','source')}} secondary={{label:ui("连接来源"),onPress:()=>workbench.openSetup()}}/>}
          </div>
        )}

        {error ? <div style={{ fontSize: 11, color: "var(--wb-danger)" }}>{error}</div> : null}
      </div>
    );
  }

  const changeTab = (next: "active" | "archived") => { setTab(next); setFilter("all"); };
  return <section className="desk" style={{ fontFamily: FONT }}>
    <style>{`
      .desk { box-sizing: border-box; width: 100%; margin: 0; padding: 20px 20px 24px; background: var(--wb-paper); min-height: 100dvh; color: var(--wb-ink); }
      .desk * { box-sizing: border-box; }
      .desk button, .desk input { font-family: inherit; }
      .desk button:focus-visible, .desk input:focus-visible { outline: 2px solid var(--wb-accent); outline-offset: 3px; }
      .desk-control { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--wb-line); border-radius: 7px; padding: 7px 10px; background: var(--wb-paper); color: var(--wb-ink-soft); font-size: 12px; cursor: pointer; }
      .desk-control:hover { background: var(--wb-surface); }
      .desk-list { display: grid; gap: 4px; }
      .desk-list > div { position: relative; min-width: 0; }
      .desk-row { position: relative; width: 100%; min-width: 0; border-radius: 10px; padding: 14px 12px; background: transparent; color: var(--wb-muted-light); transition: background .12s ease; }
      .desk-open { display: flex; align-items: flex-start; gap: 14px; width: 100%; min-width: 0; padding: 0; border: 0; background: transparent; text-align: left; cursor: pointer; color: inherit; }
      .desk-open:disabled { cursor: default; opacity: 1; }
      .desk-status { font-size: 11px; flex-shrink: 0; line-height: 21px; }
      .desk-open-icon { display: flex; align-items: center; height: 21px; }
      .desk-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 14px; margin-top: 9px; font-size: 11px; line-height: 1.5; }
      .desk-link { border: 0; padding: 2px 0; background: transparent; color: var(--wb-muted); font-size: 11px; cursor: pointer; }
      .desk-link:hover { color: var(--wb-accent); text-decoration: underline; text-underline-offset: 3px; }
      .desk-link:disabled { cursor: default; }
      .desk-archive { margin-left: auto; }
      .desk-notice { color: var(--wb-warning); overflow-wrap: anywhere; }
      .desk-list > div + div::before { content: ""; position: absolute; top: -3px; left: 12px; right: 12px; height: 2px; clip-path: ellipse(50% 50% at 50% 50%); background: linear-gradient(90deg, transparent, var(--wb-line-soft) 24%, var(--wb-line) 50%, var(--wb-line-soft) 76%, transparent); opacity: .78; pointer-events: none; }
      .desk-row:hover { background: var(--wb-surface); }
      .desk-title { display: block; overflow-wrap: anywhere; }
      .desk-title { color: var(--wb-ink); font-size: 14px; font-weight: 550; line-height: 1.5; }
      .desk-summary { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; margin-top: 4px; color: var(--wb-muted); font-size: 12px; line-height: 1.6; }
      .desk-toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin: 22px 0 12px; }
      .desk-search { min-width: 120px; width: 180px; flex: 1; max-width: 260px; }

      @media (max-width: 480px) { .desk { padding: 16px 10px; } .desk-row { padding: 12px 10px; } .desk-open { gap: 8px; } .desk-search { max-width: none; flex-basis: 100%; } .desk-control { min-height:38px; } .desk-meta { gap:8px; } .desk-link { min-height:32px; } }
    `}</style>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div><h1 style={{ margin: 0, fontSize: 21, fontWeight: 650 }}>{metadata.name}</h1>
          <p style={{ margin: "7px 0 0", color: "var(--wb-muted-light)", fontSize: 12 }}>{running ? ui("{p0} 项执行中 · ", { p0: running }) : ""}{needsAttention ? ui("{p0} 项待处理", { p0: needsAttention }) : ui("所有进展，一处查看")}</p></div>
        <details style={{ position: "relative", flexShrink: 0 }}><summary className="desk-control">{ui.rich("管理")}</summary>
          <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 1, padding: 8, background: "var(--wb-paper)", border: "1px solid var(--wb-line)", borderRadius: 8, width: 160, display: "grid", gap: 6 }}>
            <button type="button" className="desk-control" onClick={() => void run(() => actions.reconcile({}))}>{ui.rich("核对执行状态")}</button>
            <button type="button" className="desk-control" onClick={() => void run(() => actions.stow({}))}>{ui.rich("暂停后台执行")}</button>
          </div>
        </details>
      </header>
      <div className="desk-toolbar">
        {config?.notes?.todo && <button type="button" className="desk-control" onClick={() => void workbench.openNote(config.notes!.todo!, 'cg:' + encodeURIComponent(JSON.stringify({ projectId: config.projectId, kind: 'todo', intent: 'draft', context: { ref: { kind: 'execution', noteId: config.notes?.execution } } })))}>{ui.rich("记录 Todo")}</button>}
        <Tabs value={tab} onChange={changeTab} active={active.length} archived={archived.length} />
        <button type="button" className="desk-control" onClick={openDshPanel}>{ui.rich("+ 手动新增")}</button>
        {<>{[["inspection", ui("来自巡检")], ["attention", ui("待处理")], ["running", ui("执行中")]].filter(([id])=>tab==="active"||id==="inspection").map(([id, label]) => <button type="button" key={id} className="desk-control" aria-pressed={filter === id} style={filter === id ? { background: "var(--wb-accent-pale)", color: "var(--wb-accent)", borderColor: "var(--wb-accent-pale)" } : undefined} onClick={() => setFilter(filter === id ? "all" : id!)}>{label}</button>)}</>}
        <SearchField aria-label={ui("搜索委托")} value={query} onChange={setQuery} fullWidth className="desk-search"><SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder={ui("搜索委托…")} /><SearchField.ClearButton aria-label={ui("清空搜索")} /></SearchField.Group></SearchField>
      </div>
      {shown.length ? <div className="desk-list">{shown.map((item) => <div key={item.id}><TaskRow item={item} highlighted={focus === item.id}
        onOpen={() => { if (item.owner) void run(() => openTask(item)); }}
        onArchive={() => handleArchive(item.id)} onRestore={() => handleRestore(item.id)}
        onPreview={() => void run(() => workbench.openNote(item.preview!.noteId!))}
        onTracker={() => void run(() => workbench.openLinkedNote("tracker", "target"))}
        onSource={() => {
          const source = item.source.value;
          const slackItemId = source && typeof source === "object" && !Array.isArray(source) && typeof source.slackItemId === "string" ? source.slackItemId : undefined;
          void run(() => workbench.openNote(item.source.noteId!, slackItemId ?? item.source.itemId));
        }} />{config?.projectId&&item.feedback?.filter(feedback=>feedback.candidateKey&&feedback.status==='failed'&&!feedback.repairRequestId).slice(-1).map(feedback=><button key={feedback.id} type="button" className="desk-control" style={{margin:'0 12px 12px'}} onClick={()=>void run(()=>actions.requestPreviewRepair({delegationId:item.id,feedbackId:feedback.id}))}>{ui.rich("修复这个试玩版本")}</button>)}</div>)}</div> :
        <div style={{ padding: "64px 16px", textAlign: "center", color: "var(--wb-muted-light)", fontSize: 13, lineHeight: 1.8 }}>{query || filter !== "all" ? ui("没有匹配的委托") : tab === "archived" ? EMPTY_ARCHIVED() : <NoteGuidance title={ui("还没有委托")} description={EMPTY_ACTIVE()} action={{label:ui("查看交办来源"),onPress:()=>workbench.openLinkedNote("repair","source")}} secondary={{label:ui("连接来源"),onPress:()=>workbench.openSetup()}}/>}</div>}
    {error && <div role="alert" style={{ marginTop: 16, color: "var(--wb-danger)", fontSize: 12 }}>{error}</div>}
  </section>;
}

export default withNotePrerequisites(View);
