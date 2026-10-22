import {useNote,NoteIcon,QueryState} from '@dsh-workbench/react';
import type {FormEvent} from 'react';
import '@heroui/styles/css';
import type {TodoStatus,TodoPriority} from './actions';

function normalizeStatus(item: { status?: string; completed?: boolean }): TodoStatus {
  if (item.status === "in_progress" || item.status === "done" || item.status === "todo") {
    return item.status;
  }
  if (item.status === "blocked") return "in_progress";
  return item.completed ? "done" : "todo";
}

// 雅致高级微彩色阶 (保留高级感与适度愉悦感，避免纯灰冷漠)
const PRIORITY_META: Record<
  TodoPriority,
  { label: string; text: string; bg: string; border: string; dot: string }
> = {
  high: { label: "高优", text: "var(--wb-danger)", bg: "var(--wb-danger-pale)", border: "var(--wb-danger-pale)", dot: "var(--wb-danger)" },
  medium: { label: "中优", text: "var(--wb-warning)", bg: "var(--wb-warning-pale)", border: "var(--wb-warning-pale)", dot: "var(--wb-warning)" },
  low: { label: "低优", text: "var(--wb-success)", bg: "var(--wb-success-pale)", border: "var(--wb-success-pale)", dot: "var(--wb-success)" },
};

const COLUMNS: Array<{
  id: TodoStatus;
  title: string;
  tag: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
}> = [
  {
    id: "todo",
    title: "待办",
    tag: "BACKLOG",
    accent: "var(--wb-muted)",
    badgeBg: "var(--wb-surface-deep)",
    badgeText: "var(--wb-ink-soft)",
    dotColor: "var(--wb-muted-light)",
  },
  {
    id: "in_progress",
    title: "进行中",
    tag: "IN PROGRESS",
    accent: "var(--wb-accent)",
    badgeBg: "var(--wb-accent-pale)",
    badgeText: "var(--wb-accent-strong)",
    dotColor: "var(--wb-accent)",
  },
  {
    id: "done",
    title: "已完成",
    tag: "COMPLETED",
    accent: "var(--wb-success)",
    badgeBg: "var(--wb-success-pale)",
    badgeText: "var(--wb-success)",
    dotColor: "var(--wb-success)",
  },
];

function SvgCheck({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SvgPlus({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SvgTrash({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function SvgSparkles({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
    </svg>
  );
}


function SvgClock({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function Compact(){
  const {metadata,config,useQuery,usePagedQuery,host}=useNote<typeof import('./actions')>();
  const projectId=config.projectId??'';
  const page=usePagedQuery('todos',{projectId,limit:100},{enabled:!!projectId});
  const totals=useQuery('workflowStatus',{projectId},{enabled:!!projectId});
  const items=page.items.map(item=>({...item,status:normalizeStatus(item)}));
  const totalCount=totals.data?.counts.todos??items.length;
  const doneCount=totals.data?.counts.done??items.filter(item=>item.status==='done').length;
  const inProgressCount=totals.data?totals.data.counts.inProgress+totals.data.counts.blocked:items.filter(item=>item.status==='in_progress').length;
  const pendingCount=totals.data?.counts.todo??items.filter(item=>item.status==='todo').length;
  const progressRatio=totalCount>0?Math.round(doneCount/totalCount*100):0;
  const quickInput='';
  const handleQuickAdd=(event?:FormEvent)=>{event?.preventDefault();void host.openNote(metadata.id);};
  const handleToggle=(_id:string)=>host.openNote(metadata.id);
    return (
      <div data-compact-surface="todo"
        style={{
          boxSizing: "border-box",
          minHeight: "100dvh",
          padding: 16,
          background: "var(--wb-paper)",
          color: "var(--wb-ink)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
        }}
      >
        <QueryState query={page}>{()=>null}</QueryState>
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, var(--wb-accent), var(--wb-accent-strong))",
                color: "var(--wb-accent-foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.25)",
              }}
            >
              <NoteIcon icon={metadata.icon} size={14} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--wb-ink)", lineHeight: 1.2 }}>
                {metadata.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--wb-muted)", marginTop: 2 }}>
                {pendingCount + inProgressCount > 0 ? `${pendingCount + inProgressCount} 项未完成` : "全部完成 🎉"}
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "ui-monospace, monospace",
              padding: "2px 8px",
              borderRadius: 12,
              background: progressRatio === 100 && totalCount > 0 ? "var(--wb-success-pale)" : "var(--wb-accent-pale)",
              color: progressRatio === 100 && totalCount > 0 ? "var(--wb-success)" : "var(--wb-accent)",
            }}
          >
            {progressRatio}%
          </div>
        </div>

        {/* 经典高质感彩色渐变进度条 (Blue -> Emerald) */}
        <div
          style={{
            height: 6,
            background: "var(--wb-surface-deep)",
            borderRadius: 999,
            overflow: "hidden",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressRatio}%`,
              background: "linear-gradient(90deg, var(--wb-accent) 0%, var(--wb-success) 100%)",
              borderRadius: 999,
              transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 0 8px rgba(16, 185, 129, 0.35)",
            }}
          />
        </div>

        {/* 快速录入输入框 */}
        <form onSubmit={handleQuickAdd} style={{ display: "flex", gap: 6 }}>
          <input
            value={quickInput}
            readOnly
            placeholder="快速添加待办事项…（可粘贴图片）"
            style={{
              flex: 1,
              height: 30,
              padding: "0 10px",
              background: "var(--wb-surface)",
              border: "1px solid var(--wb-line)",
              borderRadius: 6,
              fontSize: 12,
              color: "var(--wb-ink)",
              outline: "none",
              transition: "all 0.15s ease",
            }}
          />
          <button
            type="submit"
            style={{
              height: 30,
              padding: "0 10px",
              background: "linear-gradient(135deg, var(--wb-accent), var(--wb-accent-strong))",
              border: "none",
              borderRadius: 6,
              color: "var(--wb-accent-foreground)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 1px 4px rgba(37, 99, 235, 0.25)",
            }}
          >
            <SvgPlus size={14} />
          </button>
        </form>

        {/* 待办微清单 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.slice(0, 4).map((item) => {
            const isDone = item.status === "done";
            const pri = item.priority ? PRIORITY_META[item.priority] : null;
            const imageCount = 'imageCount' in item ? item.imageCount : 0;

            return (
              <div
                key={item.id}
                role="button" tabIndex={0} aria-disabled={Boolean(item.taskId)} title={item.taskId?"状态由执行台更新":undefined}
                onClick={() => !item.taskId && void handleToggle(item.id)}
                onKeyDown={event => { if (!item.taskId && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); void handleToggle(item.id); } }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 9px",
                  borderRadius: 6,
                  cursor: "pointer",
                  userSelect: "none",
                  background: isDone ? "var(--wb-surface)" : "var(--wb-paper)",
                  border: isDone ? "1px solid var(--wb-surface-deep)" : "1px solid var(--wb-line)",
                  boxShadow: isDone ? "none" : "0 1px 2px rgba(0,0,0,0.02)",
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 4,
                    border: isDone ? "1px solid var(--wb-success)" : "1.5px solid var(--wb-line)",
                    background: isDone ? "var(--wb-success)" : "var(--wb-paper)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--wb-accent-foreground)",
                    flexShrink: 0,
                    transition: "all 0.15s ease",
                  }}
                >
                  {isDone && <SvgCheck size={10} />}
                </div>

                <span
                  style={{
                    fontSize: 12,
                    color: isDone ? "var(--wb-muted-light)" : "var(--wb-ink)",
                    textDecoration: isDone ? "line-through" : "none",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </span>

                {imageCount ? <span aria-label={`${imageCount} 张图片`} style={{fontSize:11,color:"var(--wb-muted)"}}>▧{imageCount}</span> : null}

                {item.status === "in_progress" && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--wb-accent)",
                      background: "var(--wb-accent-pale)",
                      padding: "1px 6px",
                      borderRadius: 4,
                      border: "1px solid var(--wb-accent-pale)",
                    }}
                  >
                    进行中
                  </span>
                )}

                {pri && !isDone && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: pri.text,
                      background: pri.bg,
                      border: `1px solid ${pri.border}`,
                      padding: "1px 5px",
                      borderRadius: 3,
                    }}
                  >
                    {pri.label}
                  </span>
                )}
              </div>
            );
          })}

          {items.length === 0 && !page.loading && !page.error && (
            <div style={{ fontSize: 12, color: "var(--wb-muted-light)", textAlign: "center", padding: "16px 0" }}>
              暂无待办事项，输入上方内容回车快速添加
            </div>
          )}

          {items.length > 4 && (
            <div style={{ fontSize: 11, color: "var(--wb-muted)", textAlign: "center", marginTop: 2 }}>
              展开查看看板其余 {items.length - 4} 项
            </div>
          )}
        </div>
      </div>
    );
}
