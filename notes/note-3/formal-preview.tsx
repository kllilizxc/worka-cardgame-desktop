import { Button } from '@heroui/react';
import {useNote,useMutation} from '@dsh-workbench/react';
import {MutationNotice} from './mutation-notice';

export function FormalPreview({ onOpen }: { onOpen(key: string): void }) {
  const {actions,useQuery}=useNote<typeof import('./actions')>();
  const resource = useQuery('formalPreview',{});

  const action=useMutation(actions.prepareFormalPreview,{query:resource});
  const busy=action.status==='pending'||action.status==='unknown',error=action.error?.message;
  const record=resource.data?.record;
  const prepare=(fresh:boolean)=>action.mutate({fresh});
  return <section aria-label="正式内容快照" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', flexShrink: 0, minWidth: 0, fontSize: 12 }}>
    <strong>正式版</strong>
    <span style={{ color: 'var(--wb-muted)', overflowWrap: 'anywhere' }}>{resource.loading || resource.stale ? '正在核对…' : resource.error ? '读取失败' : !record ? '尚未准备' : resource.data?.freshness === 'current' ? '与项目一致' : resource.data?.freshness === 'stale' ? '项目已变化 · 历史快照' : '无法核对'}</span>
    <Button size="sm" variant="secondary" isDisabled={busy || resource.loading || !!resource.error || resource.data?.freshness === 'unavailable'} onPress={()=>record?onOpen(`${record.key}:web`):void prepare(false)}>{busy ? '正在准备…' : record ? '打开此快照' : '准备当前正式版'}</Button>
    <details style={{ width: '100%', color: 'var(--wb-muted)' }}><summary>快照详情与更新</summary>
      {record && <p>{record.commit.slice(0, 8)} · {new Date(record.createdAt).toLocaleString()}</p>}
      <p>预览准备时的项目内容（含未提交修改），使用独立存档。</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{record && <Button size="sm" variant="secondary" isDisabled={busy} onPress={() => void prepare(true)}>更新正式快照</Button>}
      <Button size="sm" variant="tertiary" isDisabled={busy} onPress={() => { void resource.refresh().catch(() => {}); }}>核对版本</Button></div>
    </details>
    <MutationNotice mutation={action}/>{action.status==='success'&&action.data!==undefined&&<Button size="sm" onPress={()=>onOpen(`${action.data!.key}:web`)}>打开已准备的快照</Button>}
    {(error || resource.error || resource.data?.error) && <span role="alert" style={{ width: '100%', overflowWrap: 'anywhere' }}>{error || resource.error?.message || resource.data?.error}</span>}
  </section>;
}
