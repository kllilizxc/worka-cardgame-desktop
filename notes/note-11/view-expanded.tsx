import {z} from 'zod';
import {ImageAttachments} from './images';
import {useNote,useMutation,useViewState,QueryState,NoteIcon,type QueryResult} from '@dsh-workbench/react';
import {useMemo,useState} from 'react';
import type {ClipboardEvent,FormEvent} from 'react';
import {Button,SearchField} from '@heroui/react';
import {MutationNotice} from './mutation-notice';
import type {TodoItem,TodoImage,TodoStatus,TodoStats} from './actions';

const STATUS={todo:'待办',in_progress:'进行中',blocked:'需要处理',done:'完成'} as const;
const PRIORITY={low:'低',medium:'中',high:'高'} as const;
type Api=ReturnType<typeof useNote<typeof import('./actions')>>;
const contextSchema=z.record(z.string(),z.json());
type Context=z.output<typeof contextSchema>;
const focusSchema=z.object({projectId:z.string(),kind:z.literal('todo'),id:z.string().optional(),intent:z.string().optional(),context:z.record(z.string(),z.json()).optional()});
function focusValue(focus?:string){
 if(!focus?.startsWith('cg:'))return undefined;
 try{const parsed=focusSchema.safeParse(JSON.parse(decodeURIComponent(focus.slice(3))));return parsed.success?parsed.data:undefined;}catch{return undefined;}
}
export default function View(){
 const api=useNote<typeof import('./actions')>();
 const binding=api.useQuery('projectBinding',{});
 return <QueryState query={binding}>{value=>value.configured&&value.projectGeneration?<Board projectId={value.projectId} generation={value.projectGeneration}/>:<p>请先从内容库连接 CardGame 项目。</p>}</QueryState>;
}
function Board({projectId,generation}:{projectId:string;generation:string}){
 const {actions,useQuery,usePagedQuery,host,metadata,focus,focusRequestId}=useNote<typeof import('./actions')>();
 const [query,setQuery]=useViewState('todo-query','');
 const [category,setCategory]=useViewState('todo-category','');
 const [editor,setEditor]=useViewState('todo-editor','');
 const [composing,setComposing]=useViewState('todo-composing',false);
 const [dismissedFocus,setDismissedFocus]=useViewState('todo-dismissed-focus','');
 const focusToken=JSON.stringify([focus,focusRequestId]);
 const [createStatus,setCreateStatus]=useState<TodoStatus>('todo');
 const [confirmClear,setConfirmClear]=useState(false);
 const context=useMemo(()=>focusValue(focus),[focus]);
 const page=usePagedQuery('todos',{projectId,projectGeneration:generation,limit:100,...(category?{category}:{})});
 const categories=usePagedQuery('categories',{projectId,projectGeneration:generation,limit:100});
 const totals=useQuery('workflowStatus',{projectId});
 const selected=useQuery('todo',{projectId,projectGeneration:generation,id:context?.id??''},{enabled:context?.projectId===projectId&&typeof context.id==='string'});
 const suggest=useMutation(actions.generateSuggestions,{query:totals});
 const clear=useMutation(actions.clearCompleted,{query:totals});
 const items=page.items;
 const focused=selected.data&&'item'in selected.data?selected.data.item:undefined;
 const rows=focused&&!items.some(item=>item.id===focused.id)?[focused,...items]:items;
 const shown=rows.filter(item=>`${item.title} ${item.description??''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
 const done=items.filter(item=>item.status==='done');
 const counts=totals.data?.counts;
 return <section className="todo-board"><style>{STYLE}</style>
  <header><NoteIcon icon={metadata.icon} size={18}/><h1>待办</h1><span>{counts?`${counts.todo} 待办 · ${counts.inProgress+counts.blocked} 进行中 · ${counts.done} 完成`:'正在读取统计…'}</span></header>
  <div className="todo-toolbar"><SearchField aria-label="搜索当前页待办" value={query} onChange={setQuery}><SearchField.Group><SearchField.SearchIcon/><SearchField.Input placeholder="搜索当前页"/><SearchField.ClearButton/></SearchField.Group></SearchField>
   <Button onPress={()=>{setCreateStatus('todo');setComposing(true);}}>新建待办</Button>
   <Button variant="secondary" isDisabled={suggest.status==='pending'||suggest.status==='unknown'} onPress={()=>void suggest.mutate({projectId,projectGeneration:generation,prompt:'当前项目极简敏捷迭代'})}>AI 建议</Button>
   {confirmClear?<><span>清理当前页 {done.length} 项已完成待办？</span><Button isDisabled={clear.status==='pending'||clear.status==='unknown'} onPress={()=>void clear.mutate({projectId,projectGeneration:generation,items:done.map(item=>({id:item.id,baseRevision:item.revision}))})}>确认清理</Button><Button variant="tertiary" onPress={()=>setConfirmClear(false)}>取消</Button></>:<Button variant="tertiary" isDisabled={!done.length} onPress={()=>setConfirmClear(true)}>清理已完成</Button>}
  </div>
  <MutationNotice mutation={suggest}/><MutationNotice mutation={clear}/>
  <nav className="todo-categories"><Button variant={!category?'secondary':'tertiary'} onPress={()=>setCategory('')}>全部分类</Button>{categories.items.map(item=><Button key={item.category} variant={category===item.category?'secondary':'tertiary'} onPress={()=>setCategory(item.category)}>{item.category||'未分类'} · {item.count}</Button>)}<Button isDisabled={!categories.hasPrevious} variant="tertiary" onPress={categories.previous}>上一组</Button><Button isDisabled={!categories.hasNext} variant="tertiary" onPress={categories.next}>下一组</Button></nav>
  <QueryState query={categories}>{()=>null}</QueryState>
  {(composing||context?.intent==='draft'&&context.projectId===projectId&&dismissedFocus!==focusToken)&&<TaskComposer projectId={projectId} generation={generation} initialStatus={createStatus} context={context?.projectId===projectId?context.context:undefined} onClose={()=>{setComposing(false);setDismissedFocus(focusToken);}}/>}
  <QueryState query={page}>{()=><div className="todo-columns">{(['todo','in_progress','done'] as const).map(status=><section key={status}><header><h2>{STATUS[status]}</h2><span>{shown.filter(item=>(item.status==='blocked'?'in_progress':item.status)===status).length}</span><Button variant="tertiary" onPress={()=>{setCreateStatus(status);setComposing(true);}}>＋</Button></header>
   {shown.filter(item=>(item.status==='blocked'?'in_progress':item.status)===status).map(item=><Task key={item.id} item={item} projectId={projectId} generation={generation} board={totals} editing={editor===item.id} onEdit={()=>setEditor(item.id)} onClose={()=>setEditor('')}/>)}
  </section>)}</div>}</QueryState>
  <footer><Button variant="tertiary" isDisabled={!page.hasPrevious} onPress={page.previous}>上一页</Button><span>第 {page.pageIndex+1} 页 · 共 {page.total??items.length} 项</span><Button variant="tertiary" isDisabled={!page.hasNext} onPress={page.next}>下一页</Button></footer>
 </section>;
}
function Task({item,projectId,generation,board,editing,onEdit,onClose}:{item:TodoItem;projectId:string;generation:string;board:QueryResult<TodoStats>;editing:boolean;onEdit():void;onClose():void}){
 const {actions,host,config}=useNote<typeof import('./actions')>();
 const key=JSON.stringify([projectId,generation,item.id]);
 const status=useMutation(actions.updateStatus,{key,query:board});
 const toggle=useMutation(actions.toggleTodo,{key,query:board});
 const remove=useMutation(actions.removeTodo,{key,query:board});
 const delegate=useMutation(actions.delegateTodo,{key,query:board});
 const production=useMutation(actions.productionRequest,{key,query:board});
 const [deleting,setDeleting]=useState(false),[navigationError,setNavigationError]=useState('');
 const states=[status,toggle,remove,delegate,production];
 const busy=states.some(value=>value.status==='pending'||value.status==='unknown');
 const open=(id:string,target?:string)=>void host.openNote(id,target).catch(cause=>setNavigationError(String(cause)));
 return <article className="todo-task" id={`todo-${item.id}`}>
  {editing?<TaskEditor projectId={projectId} generation={generation} itemId={item.id} onClose={onClose}/>:<><button className="todo-title" type="button" aria-label={`编辑待办：${item.title}`} onClick={onEdit}>{item.title}</button>{item.description&&<p>{item.description}{'descriptionTruncated'in item&&item.descriptionTruncated?'…':''}</p>}<Button variant="tertiary" onPress={onEdit}>编辑需求{'imageCount'in item&&item.imageCount?` · ${item.imageCount} 张图`:''}</Button></>}
  <div className="todo-meta"><span>{item.category||'未分类'}</span><span>优先级：{PRIORITY[item.priority??'medium']}</span><span>{STATUS[item.status]}</span></div>
  {item.conclusion&&<details><summary>执行结论</summary><p>{item.conclusion}</p></details>}
  {item.taskId&&config.notes?.execution&&<Button variant="secondary" onPress={()=>open(config.notes!.execution!,item.taskId)}>打开执行进展</Button>}
  <div className="todo-controls"><Button variant="secondary" isDisabled={busy} onPress={()=>void delegate.mutate({itemId:item.id,projectId,projectGeneration:generation})}>{item.taskId?'继续交付':'交办'}</Button>
   {config.notes?.production&&(item.productionId?<Button variant="tertiary" onPress={()=>open(config.notes!.production!,`cg:${encodeURIComponent(JSON.stringify({projectId,kind:'production',id:item.productionId,intent:'open'}))}`)}>制作单</Button>:<Button variant="tertiary" isDisabled={busy} onPress={()=>void production.mutate({projectId,projectGeneration:generation,todoId:item.id})}>转为制作单</Button>)}
   {!item.taskId&&<><select aria-label="待办状态" value={item.status} disabled={busy} onChange={event=>void status.mutate({projectId,projectGeneration:generation,id:item.id,status:event.target.value as TodoStatus,baseRevision:item.revision})}>{Object.entries(STATUS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select><Button variant="tertiary" isDisabled={busy} onPress={()=>void toggle.mutate({projectId,projectGeneration:generation,id:item.id,baseRevision:item.revision})}>{item.status==='done'?'重新打开':'完成'}</Button></>}
   {deleting?<><Button variant="tertiary" isDisabled={busy} onPress={()=>void remove.mutate({projectId,projectGeneration:generation,id:item.id,baseRevision:item.revision})}>确认删除</Button><Button variant="tertiary" onPress={()=>setDeleting(false)}>取消</Button></>:<Button variant="tertiary" isDisabled={busy} onPress={()=>setDeleting(true)}>删除</Button>}
  </div>{states.map((mutation,index)=><MutationNotice key={index} mutation={mutation}/>)}{navigationError&&<p role="alert">{navigationError}</p>}
 </article>;
}
function TaskEditor({projectId,generation,itemId,onClose}:{projectId:string;generation:string;itemId:string;onClose():void}){
 const {actions,useQuery}=useNote<typeof import('./actions')>();
 const source=useQuery('editInput',{projectId,projectGeneration:generation,itemId});
 const save=useMutation(actions.editTodo,{draft:source,input:(value,{baseline})=>({projectId:baseline.projectId,projectGeneration:baseline.projectGeneration,itemId:baseline.itemId,title:value.title,description:value.description,images:value.images,baseFingerprint:baseline.baseFingerprint})});
 const draft=save.draft;
 if(!draft.ready)return <><MutationNotice mutation={save}/><Button variant="tertiary" onPress={onClose}>关闭编辑</Button></>;
 const paste=(event:ClipboardEvent<HTMLElement>)=>{const files=Array.from(event.clipboardData.files).filter(file=>file.type.startsWith('image/'));if(files.length){event.preventDefault();void draft.attach('images',files,'inline-image');}};
 return <form className="todo-form" onSubmit={event=>{event.preventDefault();void save.mutate();}}>
  <label>标题<textarea aria-label="待办标题" value={draft.value.title} disabled={draft.locked} onChange={event=>{const title=event.target.value;draft.set(value=>({...value,title}));}} onPaste={paste}/></label>
  <label>详情<textarea aria-label="待办详情" rows={4} value={draft.value.description} disabled={draft.locked} onChange={event=>{const description=event.target.value;draft.set(value=>({...value,description}));}} onPaste={paste}/></label>
  <ImageAttachments images={draft.value.images} onRemove={draft.locked?undefined:id=>draft.set(value=>({...value,images:value.images.filter(item=>item.id!==id)}))}/>
  <small>最多 3 张，单张上传最大 4 MiB。宿主为静态图生成内嵌预览；合计上限 900,000 字符，超出时需更换较小图片。</small><label>图片<input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" disabled={draft.locked} onChange={event=>{void draft.attach('images',Array.from(event.target.files??[]),'inline-image');event.target.value='';}}/></label>
  {draft.attachments.map(job=><div key={job.id} role={job.error?'alert':'status'}>{job.name} · {job.status} {job.error?.message}<button type="button" onClick={()=>void job.retry()}>重试 / 核对</button><button type="button" onClick={()=>void job.remove()}>移除</button></div>)}
  <div className="todo-controls"><Button type="submit" isDisabled={draft.locked||!draft.dirty||!draft.value.title.trim()}>保存修改</Button><Button variant="tertiary" onPress={onClose}>关闭编辑</Button></div>
  <MutationNotice mutation={save}/>
 </form>;
}
function TaskComposer({projectId,generation,initialStatus,context,onClose}:{projectId:string;generation:string;initialStatus:TodoStatus;context?:Context;onClose():void}){
 const {actions,useQuery}=useNote<typeof import('./actions')>();
 const source=useQuery('createInput',{projectId,projectGeneration:generation,status:initialStatus,context:context??{}});
 const save=useMutation(actions.createTask,{draft:source,input:value=>value});
 const draft=save.draft;
 if(!draft.ready)return <><MutationNotice mutation={save}/><Button variant="tertiary" onPress={onClose}>收起</Button></>;
 const field=(key:'title'|'description'|'category'|'dueDate',text:string)=>draft.set(value=>({...value,[key]:text}));
 const paste=(event:ClipboardEvent<HTMLElement>)=>{const files=Array.from(event.clipboardData.files).filter(file=>file.type.startsWith('image/'));if(files.length){event.preventDefault();void draft.attach('images',files,'inline-image');}};
 return <form className="todo-composer todo-form" onSubmit={event=>{event.preventDefault();void save.mutate();}}><h2>新建待办</h2>
  <label>标题<input value={draft.value.title} disabled={draft.locked} onChange={event=>field('title',event.target.value)} onPaste={paste}/></label>
  <label>详情<textarea rows={3} value={draft.value.description} disabled={draft.locked} onChange={event=>field('description',event.target.value)} onPaste={paste}/></label>
  <div className="todo-controls"><label>状态<select value={draft.value.status} disabled={draft.locked} onChange={event=>{const status=event.target.value as TodoStatus;draft.set(value=>({...value,status}));}}>{Object.entries(STATUS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><label>优先级<select value={draft.value.priority} disabled={draft.locked} onChange={event=>{const priority=event.target.value as 'low'|'medium'|'high';draft.set(value=>({...value,priority}));}}>{Object.entries(PRIORITY).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><label>分类<input value={draft.value.category} disabled={draft.locked} onChange={event=>field('category',event.target.value)}/></label><label>截止日期<input type="date" value={draft.value.dueDate} disabled={draft.locked} onChange={event=>field('dueDate',event.target.value)}/></label></div>
  <ImageAttachments images={draft.value.images} onRemove={draft.locked?undefined:id=>draft.set(value=>({...value,images:value.images.filter(item=>item.id!==id)}))}/>
  <small>最多 3 张，单张上传最大 4 MiB。宿主为静态图生成内嵌预览；合计上限 900,000 字符，超出时需更换较小图片。</small><label>图片<input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" disabled={draft.locked} onChange={event=>{void draft.attach('images',Array.from(event.target.files??[]),'inline-image');event.target.value='';}}/></label>
  {draft.attachments.map(job=><div key={job.id} role={job.error?'alert':'status'}>{job.name} · {job.status} {job.error?.message}<button type="button" onClick={()=>void job.retry()}>重试 / 核对</button><button type="button" onClick={()=>void job.remove()}>移除</button></div>)}
  <div className="todo-controls"><Button type="submit" isDisabled={draft.locked||!draft.value.title.trim()}>创建待办</Button><Button variant="tertiary" onPress={onClose}>收起</Button></div><MutationNotice mutation={save} resetLabel="再建一项待办"/>
 </form>;
}
const STYLE=`.todo-board{box-sizing:border-box;min-height:100dvh;background:var(--wb-paper);color:var(--wb-ink);font:13px/1.5 var(--wb-font-family,system-ui);padding:24px;display:flex;flex-direction:column;gap:20px;min-width:0}.todo-board *{box-sizing:border-box}.todo-board h1{font-size:20px;margin:0}.todo-board h2{font-size:14px;margin:0}.todo-board header,.todo-toolbar,.todo-categories,.todo-controls,.todo-board footer{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.todo-board header>span{margin-left:auto;color:var(--wb-muted)}.todo-columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.todo-columns>section{display:flex;flex-direction:column;gap:12px;min-width:0}.todo-task,.todo-composer{display:flex;flex-direction:column;gap:12px;background:var(--wb-surface);padding:16px;border-radius:var(--wb-radius-small);min-width:0}.todo-task p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--wb-ink-soft)}.todo-title{padding:0;background:transparent;border:0;color:var(--wb-ink);font:600 14px/1.5 inherit;text-align:left;cursor:pointer;white-space:pre-wrap}.todo-meta{display:flex;gap:8px;flex-wrap:wrap;color:var(--wb-muted);font-size:12px}.todo-form label{display:grid;gap:6px;min-width:0}.todo-board input,.todo-board textarea,.todo-board select{font:inherit;max-width:100%;min-width:0;min-height:40px;color:var(--wb-ink);background:var(--wb-paper);padding:8px;border:0;border-radius:var(--wb-radius-small)}.todo-form{display:grid;gap:12px}.todo-images{display:flex;gap:8px;flex-wrap:wrap}.todo-images>div{display:grid;gap:4px}.todo-images img{max-width:180px;max-height:160px;object-fit:contain}.todo-board [role=alert]{color:var(--wb-danger)}.todo-board button:focus-visible,.todo-board input:focus-visible,.todo-board textarea:focus-visible,.todo-board select:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}.todo-board footer{justify-content:center}@media(max-width:680px){.todo-board{padding:16px}.todo-columns{grid-template-columns:1fr}.todo-board button,.todo-board input,.todo-board select{min-height:44px}}`;
