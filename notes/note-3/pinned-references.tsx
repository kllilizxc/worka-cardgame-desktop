import { Button } from '@heroui/react';
import {ReferenceCollection} from './reference-collection';
import {useNote,useMutation} from '@dsh-workbench/react';
import {MutationNotice} from './mutation-notice';
import type { CandidateDisplay } from './model';

export function PreviewReferences({ candidate }: { candidate?: CandidateDisplay }) {
  const {actions,useQuery}=useNote<typeof import('./actions')>();
  const references = useQuery('pinnedReferences', {});
  const commit = candidate?.repos?.game?.commit;
  const eligible = !!candidate && !!commit && candidate.options?.formalPreview !== true;
  const target = useQuery('previewReferenceTarget', { key: candidate?.key ?? '', commit: commit ?? '' }, { enabled: eligible });
  const remove=useMutation(actions.removePinnedReference,{query:references});
  const pin=useMutation(actions.pinPreviewReference,{key:JSON.stringify([candidate?.key,commit]),query:references});
  const busy=[remove.status,pin.status].some(status=>status==='pending'||status==='unknown');
  const error=remove.error?.message??pin.error?.message;
  return <ReferenceCollection items={(references.data?.items ?? []).map(item => ({ key: item.key,
    label: `${item.title}${item.anchor ? ` / ${item.anchor}` : ''}`, warning: item.freshness !== 'current',
    status: `${item.revision.slice(0, 12)} · ${item.freshness === 'current' ? item.kind === 'battleComparison' ? '历史报告一致，不代表当前项目' : '版本一致' : item.freshness === 'stale' ? '版本已变化，需移除后重新固定' : '无法读取或定位'}`,
  }))} limit={references.data?.limit ?? 8} pending={references.loading || references.stale} busy={busy} error={error || references.error?.message}
    onRemove={key=>void remove.mutate({key})} onRefresh={()=>{void references.refresh().catch(()=>{});if(eligible)void target.refresh().catch(()=>{});}}>
    {!eligible ? <span>可查看和移除已有引用；选择游戏候选后可固定确切候选。正式内容快照不作为制作候选。</span> : <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>{target.data?.title ?? candidate?.title} · {target.data ? `来源需求 ${target.data.binding.requirementRevision ?? '未记录'} / 第 ${target.data.binding.round ?? '未记录'} 轮 · ${target.data.binding.current ? '当前候选' : '历史候选'}` : '正在核对候选身份…'}</span>
      <Button size="sm" variant="secondary" isDisabled={busy || target.loading || target.stale || !!target.error || !target.data} onPress={() => void pin.mutate({key:candidate!.key,commit:commit!,revision:target.data!.revision})}>固定当前候选</Button>
      {target.error && <span role="alert">{target.error.message}</span>}
    </div>}
    <MutationNotice mutation={pin}/><MutationNotice mutation={remove}/>
  </ReferenceCollection>;
}
