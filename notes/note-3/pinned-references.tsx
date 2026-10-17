import { useState } from 'react';
import { Button } from '@heroui/react';
import {ReferenceCollection} from './reference-collection';
import {useNote} from '@dsh-workbench/react';
import type { CandidateSpec } from './model';

export function PreviewReferences({ candidate }: { candidate?: CandidateSpec }) {
  const {actions,useQuery}=useNote<typeof import('./actions')>();
  const references = useQuery<{ items: Array<{ key: string; title: string; anchor?: string; kind: string; revision: string; freshness: string }>; limit: number }>('pinnedReferences', {});
  const commit = candidate?.repos?.game?.commit;
  const eligible = !!candidate && !!commit && candidate.options?.formalPreview !== true;
  const target = useQuery<{ title: string; revision: string; binding: { current: boolean; requirementRevision: number | null; round: number | null } }>('previewReferenceTarget', { key: candidate?.key ?? '', commit: commit ?? '' }, { enabled: eligible });
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  async function act(work: () => Promise<unknown>) {
    setBusy(true); setError('');
    try { await work(); await references.refresh(); } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
    finally { setBusy(false); }
  }
  return <ReferenceCollection items={(references.data?.items ?? []).map(item => ({ key: item.key,
    label: `${item.title}${item.anchor ? ` / ${item.anchor}` : ''}`, warning: item.freshness !== 'current',
    status: `${item.revision.slice(0, 12)} · ${item.freshness === 'current' ? item.kind === 'battleComparison' ? '历史报告一致，不代表当前项目' : '版本一致' : item.freshness === 'stale' ? '版本已变化，需移除后重新固定' : '无法读取或定位'}`,
  }))} limit={references.data?.limit ?? 8} pending={references.loading || references.stale} busy={busy} error={error || references.error?.message}
    onRemove={key => void act(() => actions.removePinnedReference({ key }))} onRefresh={() => void act(async () => { await references.refresh(); if (eligible) await target.refresh(); })}>
    {!eligible ? <span>可查看和移除已有引用；选择游戏候选后可固定确切候选。正式内容快照不作为制作候选。</span> : <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>{target.data?.title ?? candidate?.title} · {target.data ? `来源需求 ${target.data.binding.requirementRevision ?? '未记录'} / 第 ${target.data.binding.round ?? '未记录'} 轮 · ${target.data.binding.current ? '当前候选' : '历史候选'}` : '正在核对候选身份…'}</span>
      <Button size="sm" variant="secondary" isDisabled={busy || target.loading || target.stale || !!target.error || !target.data} onPress={() => void act(() => actions.pinPreviewReference({ key: candidate!.key, commit: commit!, revision: target.data!.revision }))}>固定当前候选</Button>
      {target.error && <span role="alert">{target.error.message}</span>}
    </div>}
  </ReferenceCollection>;
}
