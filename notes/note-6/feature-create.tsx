import {useState} from 'react';
import {useNote,useMutation} from '@dsh-workbench/react';
import {MutationNotice} from './mutation-notice';

import { Button, Input, Label, TextArea, TextField } from '@heroui/react';

/** New records use the authoritative tracker and its registered project names. */
export function CreateFeature({ onCreated }: { onCreated: (id: string) => void | Promise<void> }) {
  const {actions,useQuery}=useNote<typeof import('./actions')>();
  const projects=useQuery('projectChoices',{});
  const [open,setOpen]=useState(false),[navigationError,setNavigationError]=useState('');
  const items=projects.data?.items??[];
  const save=useMutation(actions.createFeature,{draft:{initial:{title:'',summary:'',projectId:''}},input:value=>value});
  const draft=save.draft,{title,summary,projectId:project}=draft.value;
  const setSelected=(projectId:string)=>draft.set(value=>({...value,projectId}));
  const busy=!draft.ready||draft.locked,error=save.error?.message??navigationError;
  const setTitle=(title:string)=>draft.set(value=>({...value,title}));
  const setSummary=(summary:string)=>draft.set(value=>({...value,summary}));
  const created=save.status==='success'&&save.data?.registered===true?save.data.id:undefined;
  async function openCreated(){if(!created)return;try{await onCreated(created);setNavigationError('');}catch(cause){setNavigationError(`需求已保存，打开失败：${cause instanceof Error?cause.message:String(cause)}`);}}
  return <div className="feature-create">
    <Button variant="secondary" onPress={() => setOpen(value => !value)}>{open ? '收起新需求' : '新建需求'}</Button>
    {open && <section className="feature-create-form" aria-label="新建功能需求">
      <TextField value={title} onChange={setTitle} isDisabled={busy} fullWidth><Label>需求名称</Label><Input placeholder="这次想完成什么？" /></TextField>
      <TextField value={summary} onChange={setSummary} isDisabled={busy} fullWidth><Label>目标与验收</Label><TextArea rows={4} placeholder="描述结果、约束和验收方式" /></TextField>
      <div><p>所属项目</p><div className="feature-project-choices">{items.map(item => <Button key={item.id} variant={project === item.id ? 'primary' : 'secondary'} aria-pressed={project === item.id} onPress={() => setSelected(item.id)} isDisabled={busy}>{item.name}</Button>)}</div></div>
      {projects.loading && <p role="status">正在读取项目…</p>}
      {projects.error && <p role="alert">{projects.error.message}</p>}
      {!projects.loading && !projects.error && !items.length && <p role="alert">尚未关联项目，请先在便笺对话中关联实际项目。</p>}
      {error&&<p role="alert">{error}</p>}<MutationNotice mutation={save} resetLabel="再建需求"/>{save.status==='success'&&save.data?.registered!==true&&<p role="alert">台账已返回，请核对记录是否登记成功。</p>}
      {created && <Button variant="secondary" onPress={() => { void openCreated(); }}>查看已创建需求</Button>}
      <Button onPress={() => void save.mutate()} isDisabled={busy || !project || !title.trim() || !summary.trim()}>{busy ? '正在保存需求…' : '创建需求'}</Button>
    </section>}
    <style>{`.feature-create{padding:12px 20px 0}.feature-create-form{display:flex;flex-direction:column;gap:14px;padding:16px 0;max-width:720px}.feature-create-form p{margin:0 0 8px;font-size:13px}.feature-create-form [role=alert]{color:var(--wb-danger)}.feature-project-choices{display:flex;gap:8px;flex-wrap:wrap}.feature-create-form>.button{align-self:flex-start;min-height:44px}@media(max-width:680px){.feature-create{padding:12px 16px 0}.feature-create-form>.button{width:100%}}`}</style>
  </div>;
}
