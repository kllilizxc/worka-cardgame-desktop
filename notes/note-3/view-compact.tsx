import {useNote,composeQueries,QueryState,NoteIcon} from '@dsh-workbench/react';
import {Button} from '@heroui/react';
import {useState} from 'react';
import {previewRows,canViewPreview,featureStatus,featureTitle,compactRank,STATUS,TONE,FONT} from './view-model';
import type {DisplayData} from './model';

function useCompactPreview(){
  const {config,metadata,host:workbench,useQuery,usePagedQuery}=useNote<typeof import('./actions')>();
  const root=useQuery('state.summary',{});
  const page=usePagedQuery('candidates.page',{limit:30,maxBytes:256*1024});
  const query=composeQueries({candidates:page},{summary:root});
  const data:DisplayData={...root.data,title:root.data?.title??metadata.name,attached:root.data?.attached??[],candidates:page.items,archivedCandidates:undefined,outbox:undefined};
  const operations:Record<string,{status:string;startedAt:number}>={};
  const rows=previewRows(data,operations);
  const groups=[...new Set(rows.map(row=>row.group))].map(key=>({key,rows:rows.filter(row=>row.group===key)}));
  const availableFeatures=groups.filter(group=>group.rows.some(row=>canViewPreview(row.status))).length;
  const archived:NonNullable<DisplayData['archivedCandidates']>=[];
  const [error,setError]=useState('');
  const open=(key:string)=>{const row=rows.find(item=>item.spec.key===key);if(row)void workbench.openNote(metadata.id,'preview:'+encodeURIComponent(JSON.stringify([row.owner.key,row.surface]))).catch(cause=>setError(String(cause)));};
  return {config,metadata,workbench,query,data,operations,rows,groups,availableFeatures,archived,error,setError,attach:open,setActiveKey:open,startAndAttach:open};
}

const TONE_BG:Record<string,string>={repairing:'var(--wb-accent-pale)',waiting:'var(--wb-warning-pale)',checking:'var(--wb-accent-pale)',unchecked:'var(--wb-warning-pale)',verificationFailed:'var(--wb-danger-pale)',unverified:'var(--wb-warning-pale)',blocked:'var(--wb-danger-pale)',stale:'var(--wb-warning-pale)',declared:'var(--wb-surface-deep)',ready:'var(--wb-success-pale)',starting:'var(--wb-accent-pale)',stopped:'var(--wb-surface-deep)',stopping:'var(--wb-surface-deep)',failed:'var(--wb-danger-pale)',unknown:'var(--wb-warning-pale)',disconnected:'var(--wb-surface-deep)'};
export default function Compact(){
  const model=useCompactPreview();
  const {config,data,metadata,groups,availableFeatures,archived,rows,operations,attach,setActiveKey,startAndAttach,error}=model;
  // Compact contains summaries only; defineNoteView owns the expanded branch.
    return <section className="preview-compact" style={{boxSizing:'border-box',width:'100%',minHeight:'100dvh',background:'var(--wb-paper)',borderRadius:16,padding:'14px 16px 12px',fontFamily:FONT,fontSize:13,color:'var(--wb-ink)',minWidth:0,display:'flex',flexDirection:'column',gap:10}}>
      <style>{`
        .preview-compact-header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:10px;}
        .preview-compact-brand{display:flex;align-items:center;gap:8px;min-width:0}
        .preview-compact-logo{width:24px;height:24px;border-radius:6px;background:var(--wb-accent-pale);color:var(--wb-accent);display:grid;place-items:center;flex-shrink:0}
        .preview-compact-title{font-size:13.5px;font-weight:650;color:var(--wb-ink);line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .preview-compact-count{font-size:11px;color:var(--wb-muted);white-space:nowrap;flex-shrink:0}
        .preview-compact-list{display:flex;flex-direction:column;gap:6px;min-width:0}
        .preview-compact-row{display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0;padding:6px 8px;border-radius:8px;background:var(--wb-surface);transition:background .18s ease;cursor:pointer}
        .preview-compact-row:hover{background:var(--wb-surface-deep)}
        .preview-compact-meta{display:flex;align-items:center;gap:8px;min-width:0;flex:1}
        .preview-compact-name{font-size:12px;font-weight:500;line-height:1.4;color:var(--wb-ink);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .preview-compact-tail{display:flex;align-items:center;gap:6px;flex-shrink:0}
        .preview-compact-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:999px;font-size:11px;line-height:1.4;white-space:nowrap;font-weight:500}
        .preview-compact-action{height:24px!important;min-height:24px!important;padding:0 8px!important;border-radius:6px!important;font-size:11.5px!important;font-weight:600!important;background:var(--wb-accent-pale)!important;color:var(--wb-accent)!important;border:none!important;box-shadow:none!important;transition:background .18s ease,color .18s ease!important}
        .preview-compact-action:hover:not(:disabled){background:var(--wb-accent)!important;color:var(--wb-accent-foreground)!important}
        .preview-compact-action:disabled{opacity:.5}
      `}</style>
      <div className="preview-compact-header">
        <div className="preview-compact-brand">
          <span className="preview-compact-logo" aria-hidden="true"><NoteIcon icon={metadata.icon} size={13} /></span>
          <strong className="preview-compact-title">{config?.projectId ? '试玩' : data.title||metadata.name||'候选预览'}</strong>
        </div>
        <span className="preview-compact-count">{model.query.data&&(groups.length?`${groups.length} 个版本组${availableFeatures?` · ${availableFeatures} 可预览`:''}${archived.length?` · 归档 ${archived.length}`:''}`:archived.length?`已归档 ${archived.length} 个版本组`:'尚无试玩版本')}</span>
      </div>
      <QueryState query={model.query}>{()=> <>
      {!rows.length&&<p className="preview-compact-empty" style={{fontSize:12,lineHeight:1.7,color:'var(--wb-muted)',margin:'4px 0 0'}}>执行台委托产出可运行候选后会自动同步到这里。</p>}
      <div className="preview-compact-list">
        {[...groups].sort((a,b)=>compactRank(a.rows)-compactRank(b.rows)).slice(0,4).map(group=>{
          const featureRows=group.rows;
          const status=featureStatus(featureRows,operations);
          const available=featureRows.filter(row=>canViewPreview(row.status)).length;
          const needsStart=featureRows.some(row=>['stopped','failed','waiting'].includes(row.status));
          const operating=featureRows.some(row=>Boolean(operations[row.owner.key]));
          const summary=featureRows.every(row=>row.status==='ready')?'可预览':available?'可查看 · 待核验':STATUS[status]??status;
          const snapshotAt=featureRows[0].owner.options?.snapshotCreatedAt;
          const snapshotTime=typeof snapshotAt==='string'?new Date(snapshotAt):undefined;
          const displayName=featureRows[0].owner.options?.formalPreview===true&&snapshotTime&&Number.isFinite(snapshotTime.getTime())
            ?`正式版 · ${snapshotTime.toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}`:featureTitle(featureRows[0].groupName);
          const dotColor=TONE[status]??'var(--wb-muted-light)';
          const badgeBg=TONE_BG[status]??'var(--wb-surface-deep)';
          return <div className="preview-compact-row" key={group.key} title={displayName} onClick={()=>{const target=featureRows.find(row=>canViewPreview(row.status))??featureRows[0];void model.workbench.openNote(metadata.id,'preview:'+encodeURIComponent(JSON.stringify([target.owner.key,target.surface]))).catch(cause=>model.setError(String(cause)));}}>
            <div className="preview-compact-meta">
              <span className="preview-status-dot" style={{width:6,height:6,borderRadius:3,background:dotColor,flexShrink:0}}/>
              <span className="preview-compact-name">{displayName}</span>
            </div>
            <div className="preview-compact-tail">
              <span className="preview-compact-badge" style={{color:dotColor,background:badgeBg}}>
                {summary}
              </span>
              {needsStart
                ?<Button variant="tertiary" size="sm" className="preview-compact-action" type="button" aria-label={`启动 ${displayName}`} isDisabled={operating} onPress={event=>{(event as any)?.stopPropagation?.();startAndAttach(featureRows[0].spec.key);}} onClick={e=>e.stopPropagation()}>{operating?'启动中…':'启动'}</Button>
                :null}
            </div>
          </div>;
        })}
        {groups.length>4&&<span title="点击卡片展开查看全部版本" style={{fontSize:11,lineHeight:1.35,color:'var(--wb-muted-light)',whiteSpace:'nowrap',paddingTop:2}}>还有 {groups.length-4} 个版本组 · 展开查看全部 ↗</span>}
      </div>
      </>}</QueryState>
      {error&&<p role="alert" style={{fontSize:11.5,color:'var(--wb-danger)',margin:'4px 0 0'}}>{error}</p>}
    </section>;
}
