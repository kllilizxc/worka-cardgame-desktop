import {useNote,useViewState,NoteIcon} from '@dsh-workbench/react';
import {Button,ScrollShadow} from '@heroui/react';
import type {GameChange} from './game-change-model';

const labels: Record<GameChange['stage'], string> = {
  draft: '草稿', running: '制作中', 'needs-input': '需要补充', failed: '制作失败', stale: '版本需核对',
  cancelled: '已取消', paused: '已暂停', interrupted: '制作中断',
  generated: '待建立候选', checking: '待试玩检查', review: '待我确认', adopted: '已加入游戏', undone: '已撤销',
};
/** Original game-change cards; all write and confirmation controls live in expanded. */
export default function GameChangesCompact(){
  const {metadata,useQuery,host}=useNote<typeof import('./actions')>();
  const [query]=useViewState('changes:search','');
  const [filter]=useViewState('changes:filter','all');
  const result=useQuery('changes',{query,...(filter!=='all'?{filter}:{}),limit:3});
  const items=result.data?.items??[];
  return <section className="gc-root gc-compact">
    <style>{styles}{compactStyles}</style>
    <header className="gc-heading"><NoteIcon icon={metadata.icon} size={20}/><strong>改动</strong>
      <span>{result.data?`${result.data.total} 项`:'尚未读取'}</span>
      <Button size="sm" variant="secondary" onPress={()=>void host.openNote(metadata.id)}>提出想法</Button>
    </header>
    {result.error&&<p className="gc-error" role="alert">{result.error.message}</p>}
    {result.stale&&result.data&&<span className="gc-muted">正在核对最新状态</span>}
    {result.loading&&<p role="status">正在读取改动…</p>}
    {!result.loading&&!result.error&&!items.length&&<div className="gc-empty"><strong>{query||filter!=='all'?'没有匹配的改动':'还没有制作记录'}</strong><p>{query||filter!=='all'?'调整关键词或状态继续查找。':'通过便笺原生对话提出想法，生成结果后在这里查看。'}</p></div>}
    <ScrollShadow className="gc-list">{items.map(change=><article className="gc-item" key={`${change.projectId}:${change.id}`}>
      <div className="gc-item-heading"><div className="gc-compact-meta"><small>{change.round?`第 ${change.round} 轮`:'制作记录'}</small><span className={`gc-stage gc-${change.stage}`}>{labels[change.stage]}</span></div><strong title={change.title}>{change.title}</strong></div>
    </article>)}</ScrollShadow>
    <footer className="gc-reference-tools"/>
  </section>;
}
const compactStyles = `.gc-compact .gc-item{box-sizing:border-box;padding:12px;margin-bottom:10px;border-radius:10px;background:var(--wb-surface)}.gc-compact .gc-item:first-child{padding-top:12px}.gc-compact .gc-item-heading{flex-direction:column;align-items:stretch;gap:8px;min-width:0}.gc-compact .gc-item-heading>strong{width:100%;max-width:100%;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;white-space:normal;overflow:hidden;line-height:1.6}.gc-compact-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--wb-muted);font-size:11px}.gc-compact .gc-stage{padding:2px 7px;background:var(--wb-surface-deep);border-radius:999px}.gc-compact .gc-list{overflow-x:hidden}`;

const styles = `.gc-reference-tools{display:flex;justify-content:flex-end;flex-shrink:0}.gc-change>summary{cursor:pointer;min-height:44px;align-items:center}.gc-change>summary::before{content:"›";color:var(--wb-muted)}.gc-change[open]>summary::before{content:"⌄"}.gc-change>summary>strong{flex:1}.gc-change:not([open])>summary>strong{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.gc-change>summary:focus-visible{outline:2px solid var(--wb-accent);outline-offset:3px}.gc-change-body{padding-top:12px}.gc-change-body>p{white-space:pre-wrap;overflow-wrap:anywhere}.gc-heading{flex-wrap:wrap}.gc-diff{flex-basis:100%;min-width:0}.gc-diff-files{font-size:12px;overflow-wrap:anywhere}.gc-diff-files details{padding:8px 0}.gc-diff-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.gc-diff-columns pre{white-space:pre-wrap;overflow-wrap:anywhere}.gc-diff-columns>div{min-width:0}@media(max-width:520px){.gc-diff-columns{grid-template-columns:minmax(0,1fr)}}.gc-root{box-sizing:border-box;height:100dvh;display:flex;flex-direction:column;gap:16px;padding:20px;background:var(--wb-paper);color:var(--wb-ink);font-family:var(--wb-font-family);font-size:14px;min-width:0}.gc-heading,.gc-tools,.gc-actions,.gc-pagination{display:flex;align-items:center;gap:10px}.gc-heading>strong{font-size:18px}.gc-heading>span{color:var(--wb-muted);flex:1}.gc-tools>*{min-width:0}.gc-tools>button{flex-shrink:0}.gc-list{flex:1;min-height:0;min-width:0}.gc-item{padding:16px 0}.gc-item:first-child{padding-top:0}.gc-item-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.gc-item-heading>strong{min-width:0;overflow-wrap:anywhere}.gc-stage{font-size:12px;flex-shrink:0;color:var(--wb-muted)}.gc-review{color:var(--wb-accent)}.gc-failed,.gc-error{color:var(--wb-danger)}.gc-adopted{color:var(--wb-success)}.gc-running,.gc-needs-input,.gc-stale{color:var(--wb-warning)}.gc-meta,.gc-muted{display:block;font-size:12px;color:var(--wb-muted);overflow-wrap:anywhere;margin:5px 0}.gc-candidates{display:grid;gap:10px;margin:12px 0}.gc-candidate{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px;background:var(--wb-surface);border-radius:var(--wb-radius-small)}.gc-candidate>div{flex:1;min-width:120px}.gc-candidate>.gc-diff{flex:1 0 100%;min-width:0}.gc-candidate>p{flex-basis:100%;margin:0}.gc-actions{flex-wrap:wrap}.gc-pagination{justify-content:space-between;color:var(--wb-muted)}.gc-confirm{padding:20px;max-width:520px;overflow-wrap:anywhere}.gc-confirm h2{font-size:18px}.gc-empty p{color:var(--wb-muted)}.gc-error{overflow-wrap:anywhere;margin:0}.gc-compact{padding:14px;gap:10px;font-size:12px}.gc-compact .gc-heading>strong{font-size:14px}.gc-compact .gc-item{padding:7px 0}.gc-compact .gc-item-heading>strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gc-compact .gc-stage{font-size:11px}@media(max-width:520px){.gc-expanded{padding:14px}.gc-reference-tools{justify-content:flex-start}.gc-item-heading{flex-direction:column;gap:4px}.gc-tools{flex-wrap:wrap}.gc-candidate{align-items:flex-start}}`;
