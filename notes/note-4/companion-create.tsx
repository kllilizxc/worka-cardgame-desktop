import {MutationNotice} from './mutation-notice';
import {useState} from 'react';
import {useMutation} from '@dsh-workbench/react';
import {useProductionNote} from './surface';
import { Button, Input, Label, TextField } from '@heroui/react';

/** Creates a playable rule draft from a named unit without copying or editing that unit. */
export function CompanionCreate({ onCreated }: { onCreated: (id: string) => void | Promise<void> }) {
  const { actions, useQuery, host: workbench, metadata, scopeGeneration, projectId } = useProductionNote();
  const choices = useQuery('companionChoices', {});
  const [navigationError,setNavigationError]=useState('');
  const initial={projectId,projectGeneration:scopeGeneration,unitId:'',sourceRevision:'',featureId:'',todoId:'',name:'',targetLabel:'',bonus:'3',brief:''};
  const input=useQuery('companionCreateInput',{projectGeneration:scopeGeneration});
  const save=useMutation(actions.createCompanion,{draft:input,input:value=>value});
  const draft=save.draft;
  const {unitId,featureId,todoId,name,targetLabel,bonus,brief}=draft.ready?draft.value:initial;
  const field = (key: keyof typeof initial, value: string) => draft.set(previous => ({ ...previous, [key]: value }));
  const busy = draft.locked;
  const error = save.error?.message ?? navigationError;
  const source = useQuery('sourceCard', { id: unitId }, { enabled: Boolean(unitId) });
  const definition = source.data?.json;
  async function openCreated(){if(save.status!=='success'||save.data===undefined)return;try{await onCreated(save.data.production.id);setNavigationError('');}catch(cause){setNavigationError(String(cause));}}
  async function create(){await save.mutate();}
  return <details className="cw-companion"><summary>设计配套符箓</summary><div className="cw-companion-fields">
    <p>选择现有单位，创建只给该标签友方单位增加本回合攻击的独立草稿。原卡保持原样；插画可在下一步复用。</p>
    <label>所属功能<select aria-label="配套卡所属功能" value={featureId} disabled={busy} onChange={e => field('featureId', e.target.value)}><option value="">选择已有功能</option>{(choices.data?.features ?? []).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
    <label>关联待办<select aria-label="配套卡关联待办" value={todoId} disabled={busy} onChange={e => field('todoId', e.target.value)}><option value="">暂不关联</option>{(choices.data?.todos ?? []).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
    <label>配套单位<select aria-label="配套单位" value={unitId} disabled={busy} onChange={e => { const unitId=e.target.value;const sourceRevision=choices.data?.units.find(unit=>unit.id===unitId)?.revision??'';draft.set(value=>({...value,unitId,sourceRevision,targetLabel:''})); }}><option value="">选择已有单位</option>{(choices.data?.units ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label>目标标签<select aria-label="符箓目标标签" value={targetLabel} disabled={busy || !definition} onChange={e => field('targetLabel', e.target.value)}><option value="">选择单位已有标签</option>{(definition?.labels ?? []).map((label: string) => <option key={label}>{label}</option>)}</select></label>
    <TextField value={name} onChange={value => field('name', value)} isDisabled={busy} fullWidth><Label>新符箓名称</Label><Input /></TextField>
    <TextField value={bonus} onChange={value => field('bonus', value)} isDisabled={busy}><Label>本回合攻击增益</Label><Input type="number" min={1} max={9} /></TextField>
    <TextField value={brief} onChange={value => field('brief', value)} isDisabled={busy} fullWidth><Label>制作目标与验收</Label><Input /></TextField>
    {definition && targetLabel && <p role="status">效果：一个带有「{targetLabel}」标签的己方单位，本回合攻击 +{bonus}。配套来源：{definition.name}。</p>}
    {(choices.error || source.error) && <p role="alert">{choices.error?.message ?? source.error?.message}</p>}{error && <p role="alert">{error}</p>}
    {save.status==='success'&&save.data!==undefined && <Button variant="secondary" onPress={() => { void openCreated(); }}>打开已创建制作单</Button>}
    <MutationNotice mutation={save} resetLabel="再建一个配套符箓"/>
    <Button isDisabled={busy || !definition || !featureId || !name.trim() || !brief.trim() || !targetLabel} onPress={() => void create()}>{busy ? '保存草稿…' : '创建配套符箓制作单'}</Button>
  </div><style>{`.cw-companion{margin:18px 0;max-width:100%;min-width:0}.cw-companion summary{cursor:pointer;padding:12px 0;font-weight:650}.cw-companion-fields{display:flex;flex-direction:column;gap:14px;padding:12px 0}.cw-companion label{display:flex;flex-direction:column;gap:6px;min-width:0}.cw-companion select{width:100%;min-height:44px;color:var(--wb-ink);background:var(--wb-surface);border:1px solid var(--wb-line);border-radius:var(--wb-radius-small);padding:8px;min-width:0}.cw-companion p{font-size:13px;line-height:1.65;margin:0;color:var(--wb-muted)}`}</style></details>;
}
