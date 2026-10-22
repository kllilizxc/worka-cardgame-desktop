import {useState,type ReactNode} from 'react';
import { Button, ListBox, Select, ScrollShadow, SearchField } from '@heroui/react';
import {useNote,useMutation,useViewState,NoteDialog,NoteIcon} from '@dsh-workbench/react';
import {ReferenceCollection} from './reference-collection';
import type {WidgetProps} from './surface';
import {MutationNotice} from './mutation-notice';
import type {GameChange,Diff} from './game-change-model';
export type {GameChange} from './game-change-model';

const labels: Record<GameChange['stage'], string> = {
  draft: '草稿', running: '制作中', 'needs-input': '需要补充', failed: '制作失败', stale: '版本需核对',
  cancelled: '已取消', paused: '已暂停', interrupted: '制作中断',
  generated: '待建立候选', checking: '待试玩检查', review: '待我确认', adopted: '已加入游戏', undone: '已撤销',
};
type Props = {
  mode: 'compact' | 'expanded'; metadata: WidgetProps['metadata'];
  candidateState(change:GameChange,candidateId:string,operation:'confirm'|'undo'):{blocked:boolean;pending:boolean;message:string};
  notices:ReactNode; ready:boolean;
  onEngineering(featureId?: string): void;
  onDiscuss(change?:GameChange):void;
  onPreview(candidateId: string, commit: string): Promise<void>;
  onProduction(change: GameChange): Promise<void>;
  onCandidate(change:GameChange,candidateId:string,operation:'confirm'|'undo'):void;
};

export function GameChanges({ mode, metadata, candidateState, notices, ready, onEngineering, onDiscuss, onPreview, onProduction, onCandidate }: Props) {
  const {actions:referenceActions,useQuery}=useNote<typeof import('./actions')>();
  const references=useQuery('pinnedReferences',{}, {enabled:mode==='expanded'});
  const pin=useMutation(referenceActions.pinChangeReference,{query:references});
  const remove=useMutation(referenceActions.removePinnedReference,{query:references});
  const pinning=[pin.status,remove.status].some(status=>status==='pending'||status==='unknown');
  const pinError=pin.error?.message??remove.error?.message;
  const [query,setQuery]=useViewState('changes:search','');
  const [filter,setFilter]=useViewState('changes:filter','all');
  const [cursor, setCursor] = useState<string | undefined>();
  const [previous, setPrevious] = useState<Array<string | undefined>>([]);
  const [notice, setNotice] = useState('');
  const [navigating, setNavigating] = useState(false);
  const [confirmation, setConfirmation] = useState<{ change: GameChange; candidateId: string; operation: 'confirm' | 'undo' }>();
  const result = useQuery('changes', { query, ...(filter !== 'all' ? { filter } : {}), limit: mode === 'compact' ? 3 : 30, ...(cursor ? { cursor } : {}) });
  const diff = useQuery('candidateDiff', { productionId: confirmation?.change.productionId || '', candidateId: confirmation?.candidateId || '' }, { enabled: Boolean(confirmation) });
  const items:GameChange[] = result.data?.items ?? [];
  const selected = confirmation && items.find(item => item.id === confirmation.change.id && item.projectId === confirmation.change.projectId && item.productionId === confirmation.change.productionId && item.featureId === confirmation.change.featureId);
  const selectedCandidate = selected?.candidates.find(item => item.id === confirmation?.candidateId);
  const selectedAction=confirmation?candidateState(confirmation.change,confirmation.candidateId,confirmation.operation):undefined;
  const selectionCurrent = !!selected && selected.revision === confirmation?.change.revision && !!selectedCandidate
    && (confirmation?.operation === 'undo' ? selectedCandidate.status === 'adopted'
      : selected.stage === 'review' && selectedCandidate.current && selectedCandidate.previewVerified && selectedCandidate.status === 'candidate');
  async function act(operation: () => Promise<unknown>) {
    setNotice('');
    try { await operation(); } catch (error) { setNotice(error instanceof Error ? error.message : String(error)); }
  }
  async function navigate(operation: () => Promise<unknown>) {
    if (navigating) return;
    setNavigating(true);
    try { await act(operation); } finally { setNavigating(false); }
  }
  return <section className={`gc-root gc-${mode}`}>
    <style>{styles}{compactStyles}</style>
    <header className="gc-heading"><NoteIcon icon={metadata.icon} size={20} /><strong>改动</strong>
      <span>{result.data ? `${result.data.total} 项` : '尚未读取'}</span>
      <Button size="sm" variant="secondary" isDisabled={navigating} onPress={() => onDiscuss()}>提出想法</Button>
      {mode === 'expanded' && <Button size="sm" variant="tertiary" onPress={() => void act(() => result.refresh())} aria-label="刷新改动">刷新</Button>}
    </header>
    {mode === 'expanded' && <div className="gc-tools">
      <SearchField aria-label="搜索改动" value={query} onChange={value => { setQuery(value); setCursor(undefined); setPrevious([]); }} fullWidth>
        <SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="搜索改动" /><SearchField.ClearButton /></SearchField.Group>
      </SearchField>
      <Select aria-label="筛选改动状态" value={filter} onChange={value => { setFilter(String(value ?? 'all')); setCursor(undefined); setPrevious([]); }} style={{ minWidth: 160, flexShrink: 0 }}>
        <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
        <Select.Popover><ListBox>{Object.entries({ all: '全部状态', draft: '草稿', running: '制作中', candidate: '待检查或确认', attention: '需处理', adopted: '已加入游戏', undone: '已撤销' }).map(([id, label]) => <ListBox.Item key={id} id={id} textValue={label}>{label}</ListBox.Item>)}</ListBox></Select.Popover>
      </Select>
      <Button variant="tertiary" onPress={() => onEngineering()}>工程记录</Button>
    </div>}
    {notices}<MutationNotice mutation={pin}/><MutationNotice mutation={remove}/>
    {(result.error || notice) && <p className="gc-error" role="alert">{result.error?.message || notice}</p>}
    {result.stale && result.data && <span className="gc-muted">正在核对最新状态</span>}
    {result.loading && <p role="status">正在读取改动…</p>}
    {!result.loading && !result.error && !items.length && <div className="gc-empty"><strong>{query || filter !== 'all' ? '没有匹配的改动' : '还没有制作记录'}</strong><p>{query || filter !== 'all' ? '调整关键词或状态继续查找。' : '通过便笺原生对话提出想法，生成结果后在这里查看。'}</p></div>}
    <ScrollShadow className="gc-list">
      {items.map(change => <article className="gc-item" key={`${change.projectId}:${change.id}`}>
        {mode === 'compact' ? <div className="gc-item-heading"><div className="gc-compact-meta"><small>{change.round ? `第 ${change.round} 轮` : '制作记录'}</small><span className={`gc-stage gc-${change.stage}`}>{labels[change.stage]}</span></div><strong title={change.title}>{change.title}</strong></div> : <details className="gc-change"><summary className="gc-item-heading"><strong title={change.title}>{change.title}</strong><span className={`gc-stage gc-${change.stage}`}>{labels[change.stage]}</span></summary><div className="gc-change-body">
          <div className="gc-meta">{change.round ? `第 ${change.round} 轮 · ` : ''}需求版本 {change.requirementRevision} · {change.productionId}</div>
          {change.detail && <p>{change.detail}</p>}
          <div className="gc-candidates">{change.candidates.filter(candidate => candidate.current || candidate.status === 'adopted').map(candidate => <div key={candidate.id} className="gc-candidate">
            <div><strong>{candidate.targetId}</strong><span className="gc-meta">候选 {candidate.commit.slice(0, 8)} · {candidate.status === 'adopted' ? '已加入' : candidate.status === 'undone' ? '已撤销' : candidate.previewVerified ? '试玩检查已通过' : '待试玩检查'}</span></div>
            <CandidateDifference productionId={change.productionId} candidateId={candidate.id} />
            <Button size="sm" variant="tertiary" isDisabled={pinning || result.stale || !!result.error} onPress={() => void pin.mutate({productionId:change.productionId,revision:change.revision,candidateId:candidate.id,commit:candidate.commit})}>固定候选</Button>
            <Button size="sm" variant="secondary" isDisabled={navigating} onPress={() => void navigate(() => onPreview(candidate.id, candidate.commit))}>试玩这个版本</Button>
            {change.stage === 'review' && candidate.status === 'candidate' && candidate.current && candidate.previewVerified && <Button size="sm" isDisabled={candidateState(change,candidate.id,'confirm').blocked || !ready || result.stale || !!result.error} onPress={() => setConfirmation({ change, candidateId: candidate.id, operation: 'confirm' })}>加入游戏</Button>}
            {candidate.status === 'adopted' && <Button size="sm" variant="secondary" isDisabled={candidateState(change,candidate.id,'undo').blocked || !ready || result.stale || !!result.error} onPress={() => setConfirmation({ change, candidateId: candidate.id, operation: 'undo' })}>撤销采用</Button>}
            {candidateState(change,candidate.id,candidate.status==='adopted'?'undo':'confirm').message && <p className="gc-error" role="alert">{candidateState(change,candidate.id,candidate.status==='adopted'?'undo':'confirm').message}</p>}
          </div>)}</div>
          <div className="gc-actions"><Button size="sm" variant="tertiary" isDisabled={pinning || result.stale || !!result.error} onPress={() => void pin.mutate({productionId:change.productionId,revision:change.revision})}>固定改动</Button><Button size="sm" variant="secondary" isDisabled={navigating} onPress={() => onDiscuss(change)}>继续讨论</Button><Button size="sm" variant="tertiary" isDisabled={navigating} onPress={() => void navigate(() => onProduction(change))}>查看制作过程</Button>{change.featureId && <Button size="sm" variant="tertiary" onPress={() => onEngineering(change.featureId)}>功能与采用记录</Button>}</div>
        </div></details>}
      </article>)}
    </ScrollShadow>
    {mode === 'expanded' && <footer className="gc-pagination"><Button size="sm" variant="tertiary" isDisabled={!previous.length} onPress={() => { setCursor(previous.at(-1)); setPrevious(previous.slice(0, -1)); }}>上一页</Button><span>第 {previous.length + 1} 页</span><Button size="sm" variant="tertiary" isDisabled={!result.data?.nextCursor || result.stale} onPress={() => { setPrevious([...previous, cursor]); setCursor(result.data?.nextCursor); }}>下一页</Button></footer>}
    <footer className="gc-reference-tools">
    {mode === 'expanded' && <ReferenceCollection items={(references.data?.items ?? []).map((item:{key:string;title:string;anchor?:string;kind:string;revision:string;freshness:string}) => ({ key: item.key,
      label: `${item.title}${item.anchor ? ` / ${item.anchor}` : ''}`, warning: item.freshness !== 'current',
      status: `${item.revision.slice(0, 12)} · ${item.freshness === 'current' ? item.kind === 'battleComparison' ? '历史报告一致，不代表当前项目' : '版本一致' : item.freshness === 'stale' ? '版本已变化，需移除后重新固定' : '无法读取或定位'}`,
    }))} limit={references.data?.limit ?? 8} pending={references.loading || references.stale} busy={pinning} error={pinError || references.error?.message}
      onRemove={key => void remove.mutate({key})} onRefresh={() => void act(()=>references.refresh())}>
      <span>使用下方“固定改动”或“固定候选”，不会发送消息或采用候选。</span>
    </ReferenceCollection>}
    </footer>
    <NoteDialog open={!!confirmation} label={confirmation?.operation === 'undo' ? '撤销采用' : '确认加入游戏'} onOpenChange={open => { if (!open && !selectedAction?.pending) setConfirmation(undefined); }}>
      <div className="gc-confirm"><h2>{confirmation?.operation === 'undo' ? '撤销这次采用？' : '加入游戏？'}</h2>
        <p>{confirmation?.change.title}</p><p>候选 {selectedCandidate?.commit.slice(0, 8)} · {selectedCandidate?.targetId}</p>
        <p>{confirmation?.operation === 'undo' ? '将检查采用后的修改；存在冲突时保留当前内容并说明原因。' : '仅将这个候选及其依赖加入正式游戏。试玩检查不代表已经完成人工体验。'}</p>
        {diff.loading && <p role="status">正在核对候选差异…</p>}
        {diff.error && <p role="alert">{diff.error.message}</p>}
        {diff.data && <DifferenceFiles diff={diff.data} />}
        {!selectionCurrent && <p className="gc-error">记录已变化，请关闭并核对当前候选。</p>}
        {selectedAction?.message && <p className="gc-error" role="alert">{selectedAction.message}</p>}
        <div className="gc-actions"><Button variant="secondary" isDisabled={selectedAction?.pending} onPress={() => setConfirmation(undefined)}>取消</Button><Button isDisabled={selectedAction?.blocked || !ready || !selectionCurrent || result.stale || !!result.error || confirmation?.operation === 'confirm' && (!diff.data?.baseCurrent || diff.stale || !!diff.error)} onPress={()=>{if(confirmation&&selectionCurrent)onCandidate(confirmation.change,confirmation.candidateId,confirmation.operation);}}>{selectedAction?.pending ? '正在处理…' : confirmation?.operation === 'undo' ? '确认撤销' : '确认加入'}</Button></div>
      </div>
    </NoteDialog>
  </section>;
}

function CandidateDifference({ productionId, candidateId }: { productionId: string; candidateId: string }) {
  const [open, setOpen] = useState(false);
  const {useQuery}=useNote<typeof import('./actions')>();
  const result=useQuery('candidateDiff',{productionId,candidateId},{enabled:open});
  return <div className="gc-diff"><Button size="sm" variant="tertiary" onPress={() => setOpen(!open)}>{open ? '收起差异' : '查看差异'}</Button>{open && <>
    {result.loading && <p role="status">正在读取差异…</p>}{result.error && <p role="alert">{result.error.message}</p>}{result.data && <DifferenceFiles diff={result.data} />}
  </>}</div>;
}
function DifferenceFiles({ diff }: { diff: Diff }) {
  return <div className="gc-diff-files"><p>{diff.comparison === 'adoption-record' ? '采用时的历史差异' : diff.baseCurrent ? '当前正式内容 → 所选候选' : '正式基线已变化，需重新建立候选'}</p>
    <ScrollShadow style={{ maxHeight: 320 }}>{diff.files.filter(file => file.changed).map(file => <details key={file.path}><summary>{file.path} · {file.beforeBytes} → {file.afterBytes} 字节</summary>
      {file.binary ? <p>二进制资源发生变化，请在对应资源视图核对。</p> : file.truncated ? <p>文件较大，请在制作记录中查看完整内容。</p> : <div className="gc-diff-columns"><div><strong>变更前</strong><pre>{file.before ?? '文件不存在'}</pre></div><div><strong>变更后</strong><pre>{file.after ?? '文件不存在'}</pre></div></div>}
    </details>)}</ScrollShadow>
  </div>;
}

const compactStyles = `.gc-compact .gc-item{box-sizing:border-box;padding:12px;margin-bottom:10px;border-radius:10px;background:var(--wb-surface)}.gc-compact .gc-item:first-child{padding-top:12px}.gc-compact .gc-item-heading{flex-direction:column;align-items:stretch;gap:8px;min-width:0}.gc-compact .gc-item-heading>strong{width:100%;max-width:100%;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;white-space:normal;overflow:hidden;line-height:1.6}.gc-compact-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--wb-muted);font-size:11px}.gc-compact .gc-stage{padding:2px 7px;background:var(--wb-surface-deep);border-radius:999px}.gc-compact .gc-list{overflow-x:hidden}`;

const styles = `.gc-reference-tools{display:flex;justify-content:flex-end;flex-shrink:0}.gc-change>summary{cursor:pointer;min-height:44px;align-items:center}.gc-change>summary::before{content:"›";color:var(--wb-muted)}.gc-change[open]>summary::before{content:"⌄"}.gc-change>summary>strong{flex:1}.gc-change:not([open])>summary>strong{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.gc-change>summary:focus-visible{outline:2px solid var(--wb-accent);outline-offset:3px}.gc-change-body{padding-top:12px}.gc-change-body>p{white-space:pre-wrap;overflow-wrap:anywhere}.gc-heading{flex-wrap:wrap}.gc-diff{flex-basis:100%;min-width:0}.gc-diff-files{font-size:12px;overflow-wrap:anywhere}.gc-diff-files details{padding:8px 0}.gc-diff-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.gc-diff-columns pre{white-space:pre-wrap;overflow-wrap:anywhere}.gc-diff-columns>div{min-width:0}@media(max-width:520px){.gc-diff-columns{grid-template-columns:minmax(0,1fr)}}.gc-root{box-sizing:border-box;height:100dvh;display:flex;flex-direction:column;gap:16px;padding:20px;background:var(--wb-paper);color:var(--wb-ink);font-family:var(--wb-font-family);font-size:14px;min-width:0}.gc-heading,.gc-tools,.gc-actions,.gc-pagination{display:flex;align-items:center;gap:10px}.gc-heading>strong{font-size:18px}.gc-heading>span{color:var(--wb-muted);flex:1}.gc-tools>*{min-width:0}.gc-tools>button{flex-shrink:0}.gc-list{flex:1;min-height:0;min-width:0}.gc-item{padding:16px 0}.gc-item:first-child{padding-top:0}.gc-item-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.gc-item-heading>strong{min-width:0;overflow-wrap:anywhere}.gc-stage{font-size:12px;flex-shrink:0;color:var(--wb-muted)}.gc-review{color:var(--wb-accent)}.gc-failed,.gc-error{color:var(--wb-danger)}.gc-adopted{color:var(--wb-success)}.gc-running,.gc-needs-input,.gc-stale{color:var(--wb-warning)}.gc-meta,.gc-muted{display:block;font-size:12px;color:var(--wb-muted);overflow-wrap:anywhere;margin:5px 0}.gc-candidates{display:grid;gap:10px;margin:12px 0}.gc-candidate{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px;background:var(--wb-surface);border-radius:var(--wb-radius-small)}.gc-candidate>div{flex:1;min-width:120px}.gc-candidate>.gc-diff{flex:1 0 100%;min-width:0}.gc-candidate>p{flex-basis:100%;margin:0}.gc-actions{flex-wrap:wrap}.gc-pagination{justify-content:space-between;color:var(--wb-muted)}.gc-confirm{padding:20px;max-width:520px;overflow-wrap:anywhere}.gc-confirm h2{font-size:18px}.gc-empty p{color:var(--wb-muted)}.gc-error{overflow-wrap:anywhere;margin:0}.gc-compact{padding:14px;gap:10px;font-size:12px}.gc-compact .gc-heading>strong{font-size:14px}.gc-compact .gc-item{padding:7px 0}.gc-compact .gc-item-heading>strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gc-compact .gc-stage{font-size:11px}@media(max-width:520px){.gc-expanded{padding:14px}.gc-reference-tools{justify-content:flex-start}.gc-item-heading{flex-direction:column;gap:4px}.gc-tools{flex-wrap:wrap}.gc-candidate{align-items:flex-start}}`;
