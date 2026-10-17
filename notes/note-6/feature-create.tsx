import { useRef, useState } from 'react';
import {useNoteDraft} from '@dsh-workbench/react';
import {useActions,useResource} from './surface';
import { Button, Input, Label, TextArea, TextField } from '@heroui/react';

/** New records use the authoritative tracker and its registered project names. */
export function CreateFeature({ onCreated }: { onCreated: (id: string) => void | Promise<void> }) {
  const actions = useActions<typeof import('./actions')>();
  const projects = useResource<{ items: Array<{ id: string; name: string }> }>('projectChoices', {});
  const [open, setOpen] = useState(false);
  const items:Array<{id:string;name:string}> = projects.data?.items ?? [];
  const created = useRef<string | undefined>(undefined);
  const [navigationError, setNavigationError] = useState('');
  const draft = useNoteDraft({ key: 'create-feature', value: { title: '', summary: '', projectId: '' }, save: async (value, context) => {
    const result = await actions.recordFeature({ id: context.requestId, baseRevision: null, patch: {
      title: value.title.trim(), summary: value.summary.trim(), next: '完成规则核对、制作与试玩验收',
      body: value.summary.trim(), links: [{ repo: value.projectId || (items.length === 1 ? items[0]!.id : ''), branches: [] }],
    } }, context);
    if (!result.registered || !result.id) throw new Error('台账未确认保存，请重试当前需求。');
    if (!context.signal.aborted) created.current = result.id;
    return { value: { title: '', summary: '', projectId: '' } };
  } });
  const { title, summary } = draft.value;
  const project = draft.value.projectId || (items.length === 1 ? items[0]!.id : '');
  const setSelected = (projectId: string) => draft.set(value => ({ ...value, projectId }));
  const busy = draft.saving;
  const error = draft.error?.message ?? navigationError;
  const setTitle = (title: string) => draft.set(value => ({ ...value, title }));
  const setSummary = (summary: string) => draft.set(value => ({ ...value, summary }));
  async function openCreated() {
    if (!created.current) return;
    try { await onCreated(created.current); setNavigationError(''); setOpen(false); }
    catch (cause) { setNavigationError(`需求已保存，打开失败：${cause instanceof Error ? cause.message : String(cause)}`); }
  }
  async function save() {
    setNavigationError('');
    if (project && title.trim() && summary.trim() && await draft.save()) await openCreated();
  }
  return <div className="feature-create">
    <Button variant="secondary" onPress={() => setOpen(value => !value)} isDisabled={busy}>{open ? '收起新需求' : '新建需求'}</Button>
    {open && <section className="feature-create-form" aria-label="新建功能需求">
      <TextField value={title} onChange={setTitle} isDisabled={busy} fullWidth><Label>需求名称</Label><Input placeholder="这次想完成什么？" /></TextField>
      <TextField value={summary} onChange={setSummary} isDisabled={busy} fullWidth><Label>目标与验收</Label><TextArea rows={4} placeholder="描述结果、约束和验收方式" /></TextField>
      <div><p>所属项目</p><div className="feature-project-choices">{items.map(item => <Button key={item.id} variant={project === item.id ? 'primary' : 'secondary'} aria-pressed={project === item.id} onPress={() => setSelected(item.id)} isDisabled={busy}>{item.name}</Button>)}</div></div>
      {projects.loading && <p role="status">正在读取项目…</p>}
      {projects.error && <p role="alert">{projects.error.message}</p>}
      {!projects.loading && !projects.error && !items.length && <p role="alert">尚未关联项目，请先在便笺对话中关联实际项目。</p>}
      {error && <p role="alert">{error}</p>}
      {navigationError && created.current && <Button variant="secondary" onPress={() => { void openCreated(); }}>查看已创建需求</Button>}
      <Button onPress={() => void save()} isDisabled={busy || !project || !title.trim() || !summary.trim()}>{busy ? '正在保存需求…' : '创建需求并查看'}</Button>
    </section>}
    <style>{`.feature-create{padding:12px 20px 0}.feature-create-form{display:flex;flex-direction:column;gap:14px;padding:16px 0;max-width:720px}.feature-create-form p{margin:0 0 8px;font-size:13px}.feature-create-form [role=alert]{color:var(--wb-danger)}.feature-project-choices{display:flex;gap:8px;flex-wrap:wrap}.feature-create-form>.button{align-self:flex-start;min-height:44px}@media(max-width:680px){.feature-create{padding:12px 16px 0}.feature-create-form>.button{width:100%}}`}</style>
  </div>;
}
