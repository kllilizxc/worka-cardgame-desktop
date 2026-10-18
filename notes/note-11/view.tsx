import {NoteIcon,useNote,useNoteDraft,QueryState} from '@dsh-workbench/react';

import React, { useEffect, useMemo, useRef, useState } from "react";
// @ts-expect-error The note bundler loads the shared stylesheet export.
import "@heroui/styles/css";
import {jsonObject} from './contract';
import type { TodoState, TodoPage, TodoItem, TodoImage, TodoPriority, TodoStatus, TodoRequirement, TodoRead } from "./actions";
import { ImageAttachments, MAX_PASTED_IMAGES, mergePastedImages, pasteClipboardImages } from "./images";

function cardGameLink(context: { projectId: string; kind: "production"; id: string; intent: "open" }): string {
  return `cg:${encodeURIComponent(JSON.stringify(context))}`;
}

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

function requirementFields(item?:TodoRequirement) {
  return {title:item?.title??'',description:item?.description??'',images:(item?.images??[]).map(image=>({...image}))};
}
function requirementItem(value:unknown,scope:{projectId:string;itemId:string;projectGeneration?:string}):TodoRequirement|undefined {
  const item=(value as {item?:TodoRequirement}|null)?.item;
  const generation=(value as {projectGeneration?:unknown}|null)?.projectGeneration;
  return generation===scope.projectGeneration&&item?.id===scope.itemId&&item.projectId===scope.projectId&&typeof item.title==='string'&&typeof item.revision==='number'?item:undefined;
}
function RequirementEditor({item,projectGeneration,onSaved}:{item:TodoItem;projectGeneration?:string;onSaved:()=>void}) {
  const {metadata,actions,useQuery}=useNote<typeof import('./actions')>();
  // A configuration change must never redirect an already open requirement.
  const [scope]=useState(()=>({projectId:item.projectId,itemId:item.id,...(projectGeneration?{projectGeneration}:{})}));
  const [editing,setEditing]=useState(false);
  const [pasteError,setPasteError]=useState('');
  const detail=useQuery('todo',{projectId:scope.projectId,id:scope.itemId,...(scope.projectGeneration?{projectGeneration:scope.projectGeneration}:{})},{enabled:editing});
  const current=requirementItem(detail.data,scope);
  const source=detail.draftSource(value=>{
    const selected=requirementItem(value,scope);
    return {value:requirementFields(selected),revision:selected?(value as TodoRead).requirementFingerprint:undefined};
  });
  const draft=useNoteDraft({key:`todo-requirement:${metadata.id}:${scope.projectId}:${scope.projectGeneration??"legacy"}:${scope.itemId}`,
    source:{...source,ready:source.ready&&Boolean(current),error:source.error??(detail.data!==undefined&&!current?new Error('待办来源无效，请重新读取'):undefined),
      refresh:async()=>{const next=await source.refresh();if(next.revision===undefined)throw new Error('待办来源无效，请重新读取');return next;}},
    command:{
      action:actions.editTodo,
      input:(value,context)=>{
        if(typeof context.revision!=='string')throw Error('需求来源未就绪');
        return {...scope,...value,baseFingerprint:context.revision};
      },
      receipt:(result,value)=>{
        if(result.projectId!==scope.projectId||result.projectGeneration!==scope.projectGeneration||result.id!==scope.itemId||!result.requirementFingerprint)throw Error('待办保存回执无效，请核对当前事项');
        return {value:{...value,title:value.title.trim(),description:value.description.trim()},revision:result.requirementFingerprint};
      },
    }});
  // Recovered drafts reopen their editor; ordinary rows do not read details.
  useEffect(()=>{if(draft.dirty)setEditing(true);},[draft.dirty]);
  const edit=()=>{setPasteError('');setEditing(true);};
  const handlePaste=async(event:React.ClipboardEvent<HTMLElement>)=>{
    const editor=event.currentTarget.closest('form');
    try { const additions=await pasteClipboardImages(event);if(!additions.length)return;
      if(editor?.isConnected)draft.set(previous=>({...previous,images:mergePastedImages(previous.images,additions)}));
    } catch(error) {if(editor?.isConnected)setPasteError(String(error instanceof Error?error.message:error));}
  };
  const displayed=item;
  const imageCount='imageCount' in item?item.imageCount:item.images?.length??0;
  const imageNames='imageNames' in item?item.imageNames:(item.images??[]).flatMap(image=>image.name?[image.name]:[]);
  if(!editing&&!draft.dirty)return <div onDoubleClick={event=>{if(!(event.target as HTMLElement).closest('button'))edit();}} onKeyDown={event=>{if(event.key==='Enter' && !(event.target as HTMLElement).closest('button')){event.preventDefault();edit();}}} tabIndex={0} title="双击编辑" aria-label={`编辑待办：${displayed.title}`} style={{flex:1,minWidth:0}}>
    <h3 style={{margin:0,fontSize:13.5,fontWeight:500,whiteSpace:'pre-wrap'}}>{displayed.title}{'titleTruncated' in displayed&&displayed.titleTruncated?'…':''}</h3>
    {displayed.description&&<p style={{fontSize:12,whiteSpace:'pre-wrap',margin:'4px 0'}}>{displayed.description}{'descriptionTruncated' in displayed&&displayed.descriptionTruncated?'…':''}</p>}
    <button type="button" onClick={edit}> {imageCount?`查看 ${imageCount} 张图片 / 编辑需求`:'编辑需求'} </button>
    {imageNames.length>0&&<small>{imageNames.join('、')}</small>}
  </div>;
  if(editing&&!current&&!draft.dirty)return <QueryState query={detail}>{()=>null}</QueryState>;
  const error=draft.error?.message??pasteError;
  return <form style={{display:'grid',gap:6,flex:1,minWidth:0}} onSubmit={async event=>{event.preventDefault();if(draft.dirty&&draft.value.title.trim()&&await draft.save())onSaved();}}>
    <textarea autoFocus aria-label="待办标题" rows={2} value={draft.value.title} onChange={event=>draft.set(previous=>({...previous,title:event.target.value}))} onPaste={handlePaste}/>
    <textarea aria-label="待办详情" rows={3} value={draft.value.description} onChange={event=>draft.set(previous=>({...previous,description:event.target.value}))} onPaste={handlePaste} placeholder="待办详情"/>
    <ImageAttachments images={draft.value.images} onRemove={id=>draft.set(previous=>({...previous,images:previous.images.filter(image=>image.id!==id)}))}/>
    {current?.conclusion&&<details><summary>执行结论</summary><p style={{whiteSpace:'pre-wrap'}}>{current.conclusion}</p></details>}
    <small>在标题或详情中粘贴图片 · 最多 {MAX_PASTED_IMAGES} 张</small>
    <small>保存后点击“继续交付”，才会发送到执行台。</small>
    {error&&<span role="alert">{error}</span>}
    <div><button type="submit" disabled={draft.saving||!draft.dirty||!draft.value.title.trim()}>保存修改</button><button type="button" disabled={draft.saving} onClick={()=>{draft.reset();setEditing(false);setPasteError('');}}>取消</button></div>
  </form>;
}

const CATEGORY_BUTTON_STYLE:React.CSSProperties={flexShrink:0,fontSize:12,minHeight:44,padding:"6px 12px",border:0,borderRadius:"var(--wb-radius-small)",background:"transparent",color:"var(--wb-ink-soft)",cursor:"pointer"};

export default function View(){
 const {state:storedData,mode,metadata,config,useQuery,usePagedQuery,actions,host:workbench}=useNote<typeof import('./actions')>();
  const projectId=config.projectId||(typeof storedData.projectId==='string'?storedData.projectId:'');
  const [loaded,setLoaded]=useState<{revision?:string;items:TodoItem[]}>({items:[]});
  const [filterCategory,setFilterCategory]=useState<string|null>(null);
  const page=usePagedQuery('todos',{projectId,limit:100,...(filterCategory!==null?{category:filterCategory}:{})},{enabled:!!projectId});
  const categoryPage=usePagedQuery('categories',{projectId,limit:100},{enabled:!!projectId&&mode==='expanded'});
  const totals=useQuery('workflowStatus',{projectId},{enabled:!!projectId});
  const focus = useMemo(() => typeof window === "undefined" ? undefined : decodeCardGameFocus(new URLSearchParams(window.location.search).get("focus")), []);
  const [draftContext, setDraftContext] = useState<Record<string,unknown> | undefined>(() => focus?.projectId === projectId && focus.kind === "todo" && focus.intent === "draft" ? focus.context : undefined);
  const focused = useQuery("todo", {projectId,id:focus?.id || ""}, {enabled:!!projectId && focus?.projectId === projectId && focus?.kind === "todo" && !!focus.id});
  useEffect(()=>{
    const incoming=page.data;if(!incoming)return;
    setLoaded(old=>({revision:incoming.revision,items:page.pageIndex>0&&old.revision===incoming.revision?[...old.items.filter(item=>!incoming.items.some(next=>next.id===item.id)),...incoming.items].slice(-500):incoming.items}));
  },[page.data,page.pageIndex]);
  const data = { items: loaded.items, executionDesk: {noteId: config?.notes?.execution || ""} };
  const draftRef = contentReferenceFromDraft(draftContext);
  const changed=()=>{page.reset();void page.refresh();};

  const [quickInput, setQuickInput] = useState(() => {
    if (!draftContext) return "";
    if (typeof draftContext.title === "string") return draftContext.title;
    if (typeof draftContext.brief === "string") return draftContext.brief;
    return "";
  });
  const [quickImages, setQuickImages] = useState<TodoImage[]>([]);
  const [activeColumnInput, setActiveColumnInput] = useState<TodoStatus | null>(focus?.intent === "draft" ? "todo" : null);
  const [columnInputTitle, setColumnInputTitle] = useState(quickInput);
  const [columnInputImages, setColumnInputImages] = useState<TodoImage[]>([]);
  const [columnInputCategory, setColumnInputCategory] = useState("开发");
  const [columnInputPriority, setColumnInputPriority] = useState<TodoPriority>("medium");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [delegatingItemId, setDelegatingItemId] = useState<string | null>(null);
  // Config arrives asynchronously. Apply the deep-link context once its project
  // is known, without replacing text already entered or restoring a saved draft.
  const draftFocusApplied = useRef(Boolean(draftContext));
  useEffect(() => {
    if (draftFocusApplied.current || !projectId || focus?.projectId !== projectId || focus.kind !== "todo" || focus.intent !== "draft") return;
    draftFocusApplied.current = true;
    setDraftContext(focus.context);
    const title = typeof focus.context?.title === "string" ? focus.context.title : typeof focus.context?.brief === "string" ? focus.context.brief : "";
    if (title) {
      setQuickInput(current => current || title);
      setColumnInputTitle(current => current || title);
    }
  }, [focus, projectId]);


  const items = useMemo(() => {
    const selected=focused.data&&'item' in focused.data?focused.data.item:undefined;
    const source=selected&&!data.items.some(item=>item.id===selected.id)?[selected,...data.items]:data.items;
    return source.map(item=>({...item,status:normalizeStatus(item),delivery:item.status === "blocked" ? "需要处理" : item.status === "done" ? "已完成" : "执行进展",next:"打开执行台"}));
  }, [data.items,focused.data]);
  useEffect(() => { if(focus?.id) document.getElementById(`todo-${focus.id}`)?.scrollIntoView({block:"center"}); }, [focus?.id,focused.data]);

  const categories = useMemo(() => {
    const current:Array<{category:string;count?:number}>=categoryPage.items;
    return filterCategory!==null&&!current.some(item=>item.category===filterCategory)
      ? [{category:filterCategory},...current] : current;
  }, [categoryPage.items,filterCategory]);

  const filteredItems = useMemo(() => {
    if (filterCategory === null) return items;
    return items.filter((i) => i.category === filterCategory);
  }, [items, filterCategory]);

  const todoItems = useMemo(() => filteredItems.filter((i) => i.status === "todo"), [filteredItems]);
  const inProgressItems = useMemo(() => filteredItems.filter((i) => i.status === "in_progress"), [filteredItems]);
  const doneItems = useMemo(() => filteredItems.filter((i) => i.status === "done"), [filteredItems]);

  const totalCount = totals.data?.counts.todos ?? items.length;
  const doneCount = totals.data?.counts.done ?? items.filter((i) => i.status === "done").length;
  const inProgressCount = totals.data ? totals.data.counts.inProgress + totals.data.counts.blocked : items.filter((i) => i.status === "in_progress").length;
  const pendingCount = totals.data?.counts.todo ?? items.filter((i) => i.status === "todo").length;
  const progressRatio = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleQuickPaste = async (event: React.ClipboardEvent<HTMLElement>) => {
    try { const additions=await pasteClipboardImages(event);if(additions.length)setQuickImages(mergePastedImages(quickImages,additions)); }
    catch(error) {showToast(error instanceof Error?error.message:"图片粘贴失败");}
  };
  const handleColumnPaste = async (event: React.ClipboardEvent<HTMLElement>) => {
    try { const additions=await pasteClipboardImages(event);if(additions.length)setColumnInputImages(mergePastedImages(columnInputImages,additions)); }
    catch(error) {showToast(error instanceof Error?error.message:"图片粘贴失败");}
  };

  const revisionFor = (id: string) => {
    const item = items.find(value => value.id === id);
    if (!item) throw new Error("待办已更新，请重新打开");
    return item.revision;
  };

  const handleQuickAdd = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const title = quickInput.trim() || (quickImages.length ? "图片待办" : "");
    if (!title) return;
    try {
      await actions.addTodo({ title, images: quickImages, status: "todo", priority: "medium", ...(draftContext ? {context:jsonObject.parse(draftContext)} : {}) });
      setQuickInput(""); setQuickImages([]); setDraftContext(undefined); changed();
      showToast("已录入待办");
    } catch (err) { showToast(err instanceof Error ? err.message : "录入失败"); }
  };

  const handleAddInColumn = async (status: TodoStatus) => {
    const title = columnInputTitle.trim() || (columnInputImages.length ? "图片待办" : "");
    if (!title) { setActiveColumnInput(null); return; }
    try {
      await actions.addTodo({
        title, images: columnInputImages, status, priority: columnInputPriority,
        category: columnInputCategory, ...(draftContext ? {context:jsonObject.parse(draftContext)} : {}),
      });
      setColumnInputTitle(""); setColumnInputImages([]); setActiveColumnInput(null);
      setDraftContext(undefined); changed(); showToast("任务已加入看板");
    } catch (err) { showToast(err instanceof Error ? err.message : "添加失败"); }
  };

  const handleToggle = async (id: string) => {
    try {
      await actions.toggleTodo({ id, baseRevision: revisionFor(id) }); changed();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "操作失败");
    }
  };

  const handleMove = async (id: string, newStatus: TodoStatus) => {
    try {
      await actions.updateStatus({ id, status: newStatus, baseRevision:revisionFor(id) }); changed();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "操作失败");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await actions.removeTodo({ id, baseRevision:revisionFor(id) }); changed();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "操作失败");
    }
  };

  const handleClearDone = async () => {
    try {
      await actions.clearCompleted({items:doneItems.map(item=>({id:item.id,baseRevision:item.revision}))}); changed();
      showToast("已清理完成事项");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "操作失败");
    }
  };

  const handleAiSuggest = async () => {
    setIsAiLoading(true);
    showToast("AI 规划梳理中...");
    try {
      const res = await actions.generateSuggestions({ prompt: "当前项目极简敏捷迭代" });
      changed(); showToast(`已智能规划新增 ${res.addedCount} 项任务`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "规划失败");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDelegate = async (item: TodoItem) => {
    if (delegatingItemId) return;
    setDelegatingItemId(item.id);
    try {
      await actions.delegateTodo({ itemId: item.id, projectId,projectGeneration:item.projectGeneration }); changed();
      showToast("需求已送入执行台原会话");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "交办失败");
    } finally {
      setDelegatingItemId(null);
    }
  };

  if(projectId&&!page.data&&!loaded.items.length&&!focused.data)return <QueryState query={page}>{()=>null}</QueryState>;

  // ==========================================
  // COMPACT MODE: 手机桌面小组件 (固定高度摘要)
  // ==========================================
  if (mode === "compact") {
    return (
      <div
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
            onChange={(e) => setQuickInput(e.target.value)}
            onPaste={handleQuickPaste}
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
        <ImageAttachments compact images={quickImages} onRemove={id=>setQuickImages(current=>current.filter(image=>image.id!==id))}/>

        {/* 待办微清单 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.slice(0, 4).map((item) => {
            const isDone = item.status === "done";
            const pri = item.priority ? PRIORITY_META[item.priority] : null;

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

                {('imageCount' in item?item.imageCount:item.images?.length) ? <span aria-label={`${'imageCount' in item?item.imageCount:item.images?.length} 张图片`} style={{fontSize:11,color:"var(--wb-muted)"}}>▧{'imageCount' in item?item.imageCount:item.images?.length}</span> : null}

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

  // ==========================================
  // EXPANDED MODE: 现代敏捷三列看板 (冷淡高级 + 适度色彩活力中和)
  // ==========================================
  return (
    <div className="todo-expanded"
      style={{
        boxSizing: "border-box",
        padding: "24px 28px 36px",
        background: "var(--wb-surface)",
        color: "var(--wb-ink)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <style>{`@media(max-width:680px){
        .todo-expanded{padding:14px 12px 24px!important;gap:14px!important}
        .todo-expanded>header{padding:16px 14px!important}
        .todo-board{grid-template-columns:minmax(0,1fr)!important}
        .todo-board>div{min-height:160px!important}
        .todo-expanded button,.todo-expanded input{min-height:36px}
        .todo-expanded input{font-size:16px!important;min-width:0}
        .todo-expanded button{white-space:normal;overflow-wrap:anywhere}
      }`}</style>
      {draftRef && <div style={{fontSize:12,color:"var(--wb-muted)"}}>反馈草稿 · {String(draftRef.path||draftRef.id||"当前内容")}{draftRef.revision ? ` · ${String(draftRef.revision).slice(0,10)}` : ""}</div>}
      {page.error && <div role="alert">{page.error.message}</div>}
      {page.loading && !items.length && <div role="status">正在读取待办…</div>}
      {/* 顶部全景面板：包含统计卡片与经典彩色进度条 */}
      <header
        style={{
          background: "var(--wb-paper)",
          border: "1px solid var(--wb-line)",
          borderRadius: 12,
          padding: "18px 22px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          {/* 左侧品牌标示 */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--wb-accent), var(--wb-accent-strong))",
                color: "var(--wb-accent-foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 3px 10px rgba(59, 130, 246, 0.3)",
              }}
            >
              <NoteIcon icon={metadata.icon} size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--wb-ink)" }}>
                  {metadata.name}
                </h1>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    fontFamily: "ui-monospace, monospace",
                    color: "var(--wb-accent)",
                    background: "var(--wb-accent-pale)",
                    padding: "2px 7px",
                    borderRadius: 4,
                    border: "1px solid var(--wb-accent-pale)",
                  }}
                >
                  KANBAN
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--wb-muted)", marginTop: 3 }}>
                {`${totalCount} 项待办 · ${pendingCount} 待开始 · ${inProgressCount} 进行中 · ${doneCount} 完成`}
              </div>
            </div>
          </div>

          {/* 右侧动作按钮组 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {toast && (
              <span
                style={{
                  fontSize: 12,
                  color: "var(--wb-accent-strong)",
                  padding: "4px 10px",
                  background: "var(--wb-accent-pale)",
                  borderRadius: 6,
                  border: "1px solid var(--wb-accent-pale)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {toast}
              </span>
            )}

            <button
              type="button"
              disabled={isAiLoading}
              onClick={handleAiSuggest}
              style={{
                height: 32,
                padding: "0 13px",
                background: "var(--wb-paper)",
                border: "1px solid var(--wb-line)",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "var(--wb-indigo)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                transition: "all 0.15s ease",
              }}
            >
              <SvgSparkles size={13} />
              {isAiLoading ? "AI 规划中…" : "AI 智能拆解建议"}
            </button>

            {doneItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearDone}
                style={{
                  height: 32,
                  padding: "0 11px",
                  background: "var(--wb-paper)",
                  border: "1px solid var(--wb-line)",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "var(--wb-muted)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {doneItems.length === doneCount ? "清理完成项" : "清理当前完成项"}
              </button>
            )}
          </div>
        </div>

        {/* 标志性彩色渐变进度条与四色数据指标条 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
            <span style={{ color: "var(--wb-muted)", fontWeight: 500 }}>
              总闭环进度 ({doneCount}/{totalCount})
            </span>
            <span style={{ fontWeight: 700, fontFamily: "ui-monospace, monospace", color: "var(--wb-ink)" }}>
              {progressRatio}%
            </span>
          </div>

          <div
            style={{
              height: 7,
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
                boxShadow: "0 0 10px rgba(16, 185, 129, 0.35)",
              }}
            />
          </div>
        </div>
      </header>

      {/* Classification pages are independent of the Todo result page. */}
      <div aria-label="待办分类" style={{display:"grid",gap:8,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,overflowX:"auto",padding:"0 2px"}}>
          <button type="button" aria-pressed={filterCategory===null} onClick={()=>setFilterCategory(null)} style={{...CATEGORY_BUTTON_STYLE,background:filterCategory===null?"var(--wb-accent-pale)":"transparent",color:filterCategory===null?"var(--wb-accent)":"var(--wb-ink-soft)",fontWeight:filterCategory===null?600:400}}>全部</button>
          {categories.map(({category,count})=><button key={category} type="button" aria-pressed={filterCategory===category}
            onClick={()=>setFilterCategory(category)} style={{...CATEGORY_BUTTON_STYLE,background:filterCategory===category?"var(--wb-accent-pale)":"transparent",color:filterCategory===category?"var(--wb-accent)":"var(--wb-ink-soft)",fontWeight:filterCategory===category?600:400}}>
            {category}{count!==undefined&&<span style={{marginLeft:6,fontVariantNumeric:"tabular-nums",color:"var(--wb-muted)"}}>{count}</span>}
          </button>)}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",fontSize:12,color:"var(--wb-muted)"}}>
          {categoryPage.total!==undefined&&<span>共 {categoryPage.total} 个分类 · 第 {categoryPage.pageIndex+1} 页</span>}
          {categoryPage.hasPrevious&&<button type="button" disabled={categoryPage.loading} onClick={categoryPage.previous} style={CATEGORY_BUTTON_STYLE}>上一页分类</button>}
          {categoryPage.hasNext&&<button type="button" disabled={categoryPage.loading} onClick={categoryPage.next} style={CATEGORY_BUTTON_STYLE}>下一页分类</button>}
        </div>
        <QueryState query={categoryPage}>{()=>null}</QueryState>
      </div>

      {/* Kanban Board Grid: 铺满高度与微质感色彩强化 */}
      <div className="todo-board"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
          flex: 1,
          alignItems: "stretch",
        }}
      >
        {COLUMNS.map((col) => {
          const colItems =
            col.id === "todo" ? todoItems : col.id === "in_progress" ? inProgressItems : doneItems;
          const isAdding = activeColumnInput === col.id;

          return (
            <div
              key={col.id}
              style={{
                background: "var(--wb-surface-deep)",
                borderRadius: 10,
                border: "1px solid var(--wb-line)",
                padding: "14px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 460,
              }}
            >
              {/* Column Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: col.dotColor,
                      boxShadow: `0 0 6px ${col.dotColor}88`,
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--wb-ink)" }}>{col.title}</span>
                  <span style={{ fontSize: 10, color: "var(--wb-muted-light)", letterSpacing: "0.06em", fontFamily: "ui-monospace, monospace" }}>
                    {col.tag}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "ui-monospace, monospace",
                      color: col.badgeText,
                      background: col.badgeBg,
                      border: "1px solid rgba(0,0,0,0.06)",
                      padding: "1px 7px",
                      borderRadius: 10,
                    }}
                  >
                    {colItems.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveColumnInput(isAdding ? null : col.id);
                      setColumnInputTitle("");
                      setColumnInputImages([]);
                    }}
                    title="添加卡片"
                    style={{
                      width: 24,
                      height: 24,
                      border: "1px solid var(--wb-line)",
                      borderRadius: 5,
                      background: "var(--wb-paper)",
                      color: "var(--wb-ink-soft)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <SvgPlus size={12} />
                  </button>
                </div>
              </div>

              {/* Inline Column Add Input */}
              {isAdding && (
                <div
                  style={{
                    background: "var(--wb-paper)",
                    borderRadius: 8,
                    border: "1.5px solid var(--wb-accent)",
                    padding: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)",
                  }}
                >
                  <input
                    autoFocus
                    value={columnInputTitle}
                    onChange={(e) => setColumnInputTitle(e.target.value)}
                    onPaste={handleColumnPaste}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void handleAddInColumn(col.id);
                      if (e.key === "Escape") setActiveColumnInput(null);
                    }}
                    placeholder="输入任务描述或粘贴图片，按 Enter 添加…"
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: 13,
                      color: "var(--wb-ink)",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                  <ImageAttachments images={columnInputImages} onRemove={id=>setColumnInputImages(current=>current.filter(image=>image.id!==id))}/>
                  <small style={{color:"var(--wb-muted)"}}>可粘贴图片 · 最多 {MAX_PASTED_IMAGES} 张</small>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, paddingTop: 4, borderTop: "1px solid var(--wb-surface-deep)" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {(["low", "medium", "high"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setColumnInputPriority(p)}
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: 4,
                            border: columnInputPriority === p ? `1.5px solid ${PRIORITY_META[p].text}` : "1px solid var(--wb-line)",
                            background: columnInputPriority === p ? PRIORITY_META[p].bg : "var(--wb-paper)",
                            color: columnInputPriority === p ? PRIORITY_META[p].text : "var(--wb-muted)",
                            cursor: "pointer",
                          }}
                        >
                          {PRIORITY_META[p].label}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => setActiveColumnInput(null)}
                        style={{
                          padding: "3px 8px",
                          fontSize: 11,
                          border: "none",
                          background: "transparent",
                          color: "var(--wb-muted)",
                          cursor: "pointer",
                        }}
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleAddInColumn(col.id)}
                        style={{
                          padding: "3px 10px",
                          fontSize: 11,
                          fontWeight: 600,
                          border: "none",
                          borderRadius: 4,
                          background: "var(--wb-accent)",
                          color: "var(--wb-accent-foreground)",
                          cursor: "pointer",
                        }}
                      >
                        添加
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card List in Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                {colItems.map((item) => {
                  const pri = item.priority ? PRIORITY_META[item.priority] : PRIORITY_META.medium;
                  const createdTime = item.createdAt ? new Date(item.createdAt).toLocaleDateString([], { month: "2-digit", day: "2-digit" }) : "";
                  const projectGeneration=item.projectGeneration??focused.data?.projectGeneration;

                  return (
                    <div
                      key={item.id}
                      id={`todo-${item.id}`}
                      style={{
                        background: "var(--wb-paper)",
                        border: "1px solid var(--wb-line)",
                        borderRadius: 8,
                        padding: "12px 14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <RequirementEditor key={`${item.projectId}:${projectGeneration??"legacy"}:${item.id}`} item={item} projectGeneration={projectGeneration} onSaved={changed}/>
                      {item.taskId && <button type="button" onClick={()=>void workbench.openNote(data.executionDesk.noteId,item.taskId)} style={{border:0,background:'var(--wb-accent-pale)',color:'var(--wb-accent)',padding:'6px 8px',borderRadius:6,fontSize:12,textAlign:'left'}}>{String(item.delivery || "执行进展")} · {String(item.next || "打开执行台")} ↗</button>}
                      {item.conclusion && (
                        <div
                          style={{
                            color: "var(--wb-ink-soft)",
                            fontSize: 11.5,
                            lineHeight: 1.45,
                            padding: "7px 8px",
                            borderRadius: 6,
                            background: "var(--wb-surface)",
                            border: "1px solid var(--wb-surface-deep)",
                          }}
                        >
                          <span style={{ color: "var(--wb-muted-light)", marginRight: 5 }}>反馈</span>
                          {item.conclusion}
                        </div>
                      )}

                      {/* Card Bottom Meta & Actions */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingTop: 8,
                          borderTop: "1px solid var(--wb-surface)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {item.category && (
                            <span
                              style={{
                                fontSize: 10.5,
                                color: "var(--wb-ink-soft)",
                                background: "var(--wb-surface-deep)",
                                padding: "2px 6px",
                                borderRadius: 4,
                                border: "1px solid var(--wb-line)",
                              }}
                            >
                              {item.category}
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 600,
                              fontFamily: "ui-monospace, monospace",
                              color: pri.text,
                              background: pri.bg,
                              border: `1px solid ${pri.border}`,
                              padding: "1px 6px",
                              borderRadius: 4,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <i style={{ width: 5, height: 5, borderRadius: "50%", background: pri.dot, display: "inline-block" }} />
                            {pri.label}
                          </span>
                          {createdTime && (
                            <span
                              style={{
                                fontSize: 10,
                                color: "var(--wb-muted-light)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 3,
                                fontFamily: "ui-monospace, monospace",
                              }}
                            >
                              <SvgClock size={10} />
                              {createdTime}
                            </span>
                          )}
                        </div>

                        {/* Status Shift & Delete */}
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <button
                            type="button"
                            onClick={() => void handleDelegate(item)}
                            disabled={delegatingItemId !== null}
                            title={col.id === "done" ? "再次交办此待办" : "交办此待办"}
                            style={{
                              border: "1px solid var(--wb-accent-pale)",
                              background: delegatingItemId === item.id ? "var(--wb-accent-pale)" : "var(--wb-paper)",
                              borderRadius: 4,
                              fontSize: 11,
                              padding: "2px 7px",
                              color: "var(--wb-accent)",
                              cursor: delegatingItemId !== null ? "wait" : "pointer",
                              opacity: delegatingItemId !== null && delegatingItemId !== item.id ? 0.55 : 1,
                            }}
                          >
                            {delegatingItemId === item.id ? "提交中…" : item.taskId || ('hasDelivery' in item&&item.hasDelivery) ? "继续交付" : "交办"}
                          </button>

                          {config?.notes?.production && <button type="button" style={{border:0,background:"transparent",color:"var(--wb-muted)",fontSize:11,cursor:"pointer"}} onClick={async()=>{try{if(!item.productionId)await actions.productionRequest({projectId,todoId:item.id});await workbench.openNote(config.notes!.production,item.productionId?cardGameLink({projectId,kind:'production',id:item.productionId,intent:'open'}):undefined);if(!item.productionId)showToast('制作单请求已送达，建立后会显示在制作便笺');}catch(error){showToast(error instanceof Error?error.message:String(error));}}}>{item.productionId?"制作单":"转为制作单"}</button>}
                          {col.id !== "todo" && (
                            <button
                              type="button"
                              disabled={Boolean(item.taskId)}
                              onClick={() => void handleMove(item.id, col.id === "done" ? "in_progress" : "todo")}
                              title="移到前一列"
                              style={{
                                border: "1px solid var(--wb-line)",
                                background: "var(--wb-surface)",
                                borderRadius: 4,
                                fontSize: 11,
                                padding: "2px 7px",
                                color: "var(--wb-ink-soft)",
                                cursor: "pointer",
                                transition: "all 0.12s ease",
                              }}
                            >
                              ←
                            </button>
                          )}

                          {col.id !== "done" && (
                            <button
                              type="button"
                              disabled={Boolean(item.taskId)}
                              onClick={() => void handleMove(item.id, col.id === "todo" ? "in_progress" : "done")}
                              title="移到后一列"
                              style={{
                                border: "1px solid var(--wb-line)",
                                background: "var(--wb-surface)",
                                borderRadius: 4,
                                fontSize: 11,
                                padding: "2px 7px",
                                color: "var(--wb-ink-soft)",
                                cursor: "pointer",
                              }}
                            >
                              →
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => void handleRemove(item.id)}
                            title="删除"
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "var(--wb-muted-light)",
                              cursor: "pointer",
                              padding: "2px 4px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <SvgTrash size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colItems.length === 0 && !isAdding && !page.loading && !page.error && (
                  <div
                    style={{
                      flex: 1,
                      minHeight: 120,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--wb-muted-light)",
                      fontSize: 12,
                      border: "1.5px dashed var(--wb-line)",
                      borderRadius: 8,
                      background: "color-mix(in srgb, var(--wb-paper) 50%, transparent)",
                    }}
                  >
                    暂无卡片
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <QueryState query={page}>{()=>null}</QueryState>
      {(page.hasNext || (page.total??totalCount) > items.length) && <div style={{display:"flex",alignItems:"center",gap:12,fontSize:12,color:"var(--wb-muted)"}}><span>当前载入 {items.length} / {page.total??totalCount} 项</span>{page.hasNext && <button type="button" disabled={page.loading} onClick={page.next}>加载更多</button>}</div>}
    </div>
  );
}

function contentReferenceFromDraft(context?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!context) return undefined;
  const nested = context.ref;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) return nested as Record<string, unknown>;
  if (["kind", "id", "path", "revision"].some(field => context[field] !== undefined)) return context;
  return undefined;
}

function statusLabel(status: TodoStatus): string {
  return status === "todo" ? "待办" : status === "in_progress" ? "进行中" : status === "done" ? "完成" : "阻塞";
}

function decodeCardGameFocus(itemId: string | null): { projectId: string; kind: string; id?: string; intent?: string; context?: Record<string, unknown> } | undefined {
  if (!itemId?.startsWith("cg:")) return undefined;
  try {
    const value = JSON.parse(decodeURIComponent(itemId.slice(3))) as Record<string, unknown>;
    if (!value || typeof value.projectId !== "string" || typeof value.kind !== "string") return undefined;
    return {
      projectId: value.projectId,
      kind: value.kind,
      ...(typeof value.id === "string" ? { id: value.id } : {}),
      ...(typeof value.intent === "string" ? { intent: value.intent } : {}),
      ...(value.context && typeof value.context === "object" && !Array.isArray(value.context) ? { context: value.context as Record<string, unknown> } : {}),
    };
  } catch {
    return undefined;
  }
}
