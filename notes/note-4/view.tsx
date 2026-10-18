import {ProductionScope,useProductionNote} from './surface';
import {NoteIcon,useNoteDraft,useAction} from '@dsh-workbench/react';
import { Button, Input, Label, ScrollShadow, SearchField, Spinner, TextField } from '@heroui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ProductionState } from './actions';
import { isCardBatch,type Production,type Candidate } from './contracts';
import {requirementFields,requirementPatch} from './requirement-draft';
import { CardWorkflow, CreateCardWorkflow } from './card-workflow';

const PAGE_SIZE = 100;

export default function View(){return <ProductionScope><ProductionView/></ProductionScope>}
function ProductionView(){
  const api=useProductionNote();
  const { state:data, mode, metadata, config, actions, host:workbench, useQuery, usePagedQuery, projectId, scopeGeneration }=api;
  const preferenceWrites=useRef<Promise<unknown>>(Promise.resolve());
  const updateData=(patch:Partial<ProductionState>)=>{
    const pending=preferenceWrites.current.then(()=>actions.setViewState({patch}));
    preferenceWrites.current=pending.catch(()=>undefined);return pending;
  };
  const navigation=useAction();
  const [cardDirty,setCardDirty]=useState(false);
  const [query, setQuery] = useState(data?.query ?? "");
  const [selectedId, setSelectedId] = useState(data?.selectedId);
  const [candidateOffset, setCandidateOffset] = useState(0);
  const page = usePagedQuery("productions", { q: query, limit: PAGE_SIZE });
  const items=page.items;
  const selected = useQuery("production", { productionId: selectedId || '', historyLimit: 20 }, { enabled: Boolean(selectedId) });
  const focusItem = typeof location !== "undefined" ? new URLSearchParams(location.search).get("focus") : null;
  const focusContext = useMemo(() => decodeCardGameFocus(focusItem), [focusItem]);
  useEffect(() => {
    if (focusContext?.projectId === projectId && focusContext.kind === "production" && focusContext.id) setSelectedId(focusContext.id);
  }, [focusContext, projectId]);

  const detail=selected.data?.production;
  const isCardProduction=Boolean(selectedId&&detail?.id===selectedId&&isCardBatch(detail.batch));
  const requirement=useNoteDraft({key:`requirement:${metadata.id}:${scopeGeneration}:${selectedId??''}`,
    source:selected.draftSource(value=>({value:requirementFields(value?.production),revision:value?.production.revision})),
    save:async(value,context)=>{
      if(!selectedId||typeof context.revision!=='number')throw new Error('请先读取制作单');
      const result=await actions.updateProduction({productionId:selectedId,baseRevision:context.revision,requestId:context.requestId,patch:requirementPatch(value)},context);
      return {revision:result.revision??result.production.revision};
    }});
  const edit=(key:keyof typeof requirement.value,value:string)=>requirement.set(previous=>({...previous,[key]:value}));
  useEffect(()=>setCandidateOffset(0),[detail?.id]);

  function selectProduction(id:string){
    if(requirement.saving)return false;
    if((requirement.dirty||cardDirty)&&!window.confirm('切换制作单会关闭未保存的编辑，确定继续吗？'))return false;
    setSelectedId(id);void navigation.run(()=>saveState({selectedId:id}));return true;
  }
  async function saveState(patch: Partial<ProductionState>) {
    try{await updateData(patch);}
    catch(cause){throw new Error(`界面选择尚未确认保存：${cause instanceof Error?cause.message:String(cause)}`);}
  }

  const created=useRef<string|undefined>(undefined);
  const newRequest=useNoteDraft({key:`create-production:${metadata.id}:${scopeGeneration}`,value:requirementFields(),save:async(value,context)=>{
    const result=await actions.upsertRequest(requirementPatch(value),context);
    if(!context.signal.aborted)created.current=result.production.id;
    return {value:requirementFields()};
  }});
  const createField=(key:keyof typeof newRequest.value,value:string)=>newRequest.set(previous=>({...previous,[key]:value}));
  async function saveDraft(){
    if(await newRequest.save()){
      page.reset();
      if(created.current)selectProduction(created.current);
    }
  }

  async function run(item: Production, newRound = false) {
    if (newRound) await actions.newRound({ productionId: item.id });
    else if ((item.roundCount ?? item.rounds?.length ?? 0) > 0 && ["queued", "running", "reserved"].includes(item.status)) await actions.retry({ productionId: item.id });
    else await actions.generate({ productionId: item.id });
    page.reset();
  }
  async function reject(production: Production, candidate: Candidate, reason?: string) {
    const candidateId = candidate.id ?? candidate.key ?? candidate.assetId;
    if (!candidateId) throw new Error('候选还没有登记身份');
    await actions.rejectCandidate({ productionId: production.id, candidateId, baseRevision: production.revision, ...(reason ? { reason } : {}) });
    page.reset();
  }

  if (mode === "compact") return <section className="cg-production cg-compact"><style>{STYLES}</style><header><span className="cg-brand"><NoteIcon icon={metadata.icon} size={14} /><strong>AI 生产</strong></span><span>{page.total ?? items.length} 请求</span></header><ScrollShadow className="cg-list" style={{ maxHeight: 120 }}>{page.loading && <Spinner size="sm" />}{items.slice(0, 3).map(item => <button className="cg-row" type="button" key={item.id} onClick={() => { if(selectProduction(item.id))void workbench.openNote(metadata.id); }}><span className={`cg-status-dot status-${item.status}`} /><span className="cg-title">{item.brief}</span><span className="cg-status">{(item.deckProgress ? `${item.deckProgress.distinctCards} 种 · ${item.deckProgress.totalCopies}/${item.deckProgress.targetSize} 张` : item.workflowKind === "card-generation" ? `${item.cardProgress?.done ?? 0}/${item.cardProgress?.total ?? 0} 制卡进度` : productionLabel(item.status))}</span></button>)}{!page.loading && items.length === 0 && <span className="cg-muted">暂无制作请求</span>}</ScrollShadow>{page.error && <span className="cg-error">{page.error.message}</span>}</section>;

  return (
    <section className="cg-production">
      <style>{STYLES}</style>
      <header className="cg-header">
        <div className="cg-brand"><span className="cg-icon"><NoteIcon icon={metadata.icon} size={16} /></span><div><strong>AI 资源生产</strong><small>{"当前已连接项目"}</small></div></div>
        <span className="cg-muted">{page.total ?? items.length} 请求</span>
      </header>
      {isCardProduction ? <div className="cg-card-route"><Button size="sm" variant="tertiary" style={{ color: 'var(--wb-accent)', background: 'transparent' }} onPress={() => { selectProduction(''); }}>← 返回</Button></div> : <div className="cg-toolbar">
        <SearchField aria-label="搜索制作请求" value={query} onChange={value => { setQuery(value); page.reset(); void navigation.run(()=>saveState({ query: value })); }} onSubmit={() => page.reset()} fullWidth>
          <SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="搜索 brief 或请求 ID" /><SearchField.ClearButton aria-label="清空搜索" /></SearchField.Group>
        </SearchField>
      </div>}
      {isCardProduction ? <CardWorkflow productionId={detail!.id} libraryNoteId={config?.notes?.cards} onEditing={setCardDirty} /> : <>
      <CreateCardWorkflow onCreated={id => { page.reset(); selectProduction(id); }} />
      <details><summary className="cg-muted">其他素材制作请求</summary>
      <form className="cg-create" onSubmit={event => { event.preventDefault(); void saveDraft(); }}>
        <TextField value={newRequest.value.brief} onChange={value=>createField('brief',value)} fullWidth aria-label="新建制作草稿"><Label>新建制作草稿</Label><Input placeholder="描述要制作的素材和验收目标…" /></TextField>
        <label className="cg-field">目标资源 JSON<textarea value={newRequest.value.targetAsset} onChange={event=>createField('targetAsset',event.target.value)} placeholder="{&quot;kind&quot;:&quot;asset&quot;,&quot;id&quot;:&quot;…&quot;}" /></label>
        <label className="cg-field">固定参考（每行一条）<textarea value={newRequest.value.pinnedRefs} onChange={event=>createField('pinnedRefs',event.target.value)} placeholder="cards/hero.md / asset:portrait" /></label>
        <label className="cg-field">批次 JSON<textarea value={newRequest.value.batch} onChange={event=>createField('batch',event.target.value)} placeholder="{&quot;count&quot;:4}" /></label>
        <Button type="submit" variant="primary" isDisabled={!newRequest.value.brief.trim() || newRequest.saving}>{newRequest.saving ? "保存中…" : "保存草稿"}</Button>
      {newRequest.error&&<p role="alert">{newRequest.error.message}</p>}</form>
      </details>
      <div className="cg-body">
        <ScrollShadow key={`${query}:${page.pageIndex}`} className="cg-list cg-expanded-list">
          {page.loading && items.length === 0 && <div className="cg-loading"><Spinner />正在读取…</div>}
          {items.map(item => {
            const roundCount = item.roundCount ?? item.rounds?.length ?? 0;
            const candidateCount = item.candidateCount ?? item.candidateRefs?.length ?? 0;
            return <article className={`cg-item ${selectedId === item.id ? "selected" : ""}`} key={item.id} onClick={() => { selectProduction(item.id); }}>
              <div className="cg-item-head"><span className={`cg-status-dot status-${item.status}`} /><strong>{item.brief}</strong><span className="cg-pill">{(item.deckProgress ? `${item.deckProgress.distinctCards} 种 · ${item.deckProgress.totalCopies}/${item.deckProgress.targetSize} 张` : item.workflowKind === "card-generation" ? `${item.cardProgress?.done ?? 0}/${item.cardProgress?.total ?? 0} 制卡进度` : productionLabel(item.status))}</span></div>
              <div className="cg-item-meta"><span>{item.id}</span><span>rev {item.revision}</span><span>{candidateCount} 资源候选</span>{item.gameCandidateCount !== undefined && <span>{item.gameCandidateCount} 游戏版本（含历史）</span>}<span>{roundCount} 轮</span></div>
              <ProductionCommands item={item} disabled={selectedId===item.id&&(requirement.dirty||requirement.saving)} run={run}/>

            </article>;
          })}
          {!page.loading && items.length === 0 && <div className="cg-empty"><strong>暂无制作请求</strong><span>先保存一个草稿，再明确生成。</span></div>}
          <div className="cg-detail-actions"><Button variant="tertiary" isDisabled={!page.hasPrevious||page.loading} onPress={page.previous}>上一页</Button><span>第 {page.pageIndex+1} 页</span><Button variant="tertiary" isDisabled={!page.hasNext||page.loading} onPress={page.next}>下一页（最多 {PAGE_SIZE} 项）</Button></div>
        </ScrollShadow>
        <aside className="cg-detail">
          {isCardBatch(detail?.batch) ? <p className="cg-muted">卡牌制作步骤、模板预览和生图回填位于上方。选择其他制作单可继续素材生产。</p> : detail ? <>
            <span className="cg-eyebrow">制作请求 · {detail.id}</span>
            <h2>{detail.brief}</h2>
            <div className="cg-requirement-editor">
              <TextField value={requirement.value.brief} onChange={value=>edit('brief',value)} fullWidth aria-label="编辑需求"><Label>需求</Label><Input /></TextField>
              <label className="cg-field">目标资源 JSON<textarea value={requirement.value.targetAsset} onChange={event=>edit('targetAsset',event.target.value)} /></label>
              <label className="cg-field">固定参考<textarea value={requirement.value.pinnedRefs} onChange={event=>edit('pinnedRefs',event.target.value)} /></label>
              <label className="cg-field">批次 JSON<textarea value={requirement.value.batch} onChange={event=>edit('batch',event.target.value)} /></label>
              <Button size="sm" variant="tertiary" isDisabled={requirement.saving||!requirement.dirty} onPress={()=>void requirement.save()}>{requirement.saving?"保存中…":"保存需求"}</Button>{requirement.dirty&&<span role="status">未保存的需求</span>}{requirement.error&&<p role="alert">{requirement.error.message}</p>}{requirement.conflicted&&<Button variant="tertiary" onPress={()=>{if(window.confirm("放弃当前未保存编辑，重新载入服务器需求？"))requirement.reset();}}>放弃编辑并重载</Button>}
            </div>
            <div className="cg-detail-status"><span>{productionLabel(detail.status)}</span><span>rev {detail.revision}</span><span>{detail.rounds?.length ?? detail.roundCount ?? 0} 轮</span></div>
            {selected.data?.execution && <div className="cg-execution"><h3>执行进度</h3><div className="cg-detail-status"><span>{selected.data.execution.status === 'completed' ? '执行完成' : productionLabel(selected.data.execution.status || '未知')}</span>{selected.data.execution.id && <span>{selected.data.execution.id}</span>}{selected.data.execution.updatedAt && <span>{selected.data.execution.updatedAt}</span>}</div>{selected.data.execution.outcome?.summary && <p>{selected.data.execution.outcome.summary}</p>}{selected.data.execution.delivery?.status && <span className="cg-muted">交付：{selected.data.execution.delivery.status}</span>}</div>}
            <ProductionCommands item={detail} disabled={requirement.dirty||requirement.saving} run={run}/>

            <h3>资源候选（每页比较 3 个）</h3><p className="cg-muted">可查看、复制候选引用或否决。通用素材尚不支持直接写入正式游戏；卡牌与牌组请在原制作单建立试玩候选，再到功能进展确认。</p>
            <ScrollShadow className="cg-candidates" style={{ maxHeight: 390 }}>{(detail.candidateRefs ?? []).slice(candidateOffset, candidateOffset + 3).map((candidate: Candidate) => <CandidateMedia key={candidate.id ?? candidate.key ?? candidate.assetId} candidate={candidate} adopted={detail.adoption?.candidateId !== undefined && detail.adoption?.candidateId === (candidate.id ?? candidate.key ?? candidate.assetId)} onReject={reason => reject(detail, candidate, reason)} />)}{!detail.candidateRefs?.length && <span className="cg-muted">尚无资源候选；生成完成后由资源后端登记。</span>}</ScrollShadow>
            {(detail.candidateRefs?.length ?? 0) > 3 && <div className="cg-detail-actions"><Button size="sm" variant="tertiary" isDisabled={candidateOffset === 0} onPress={() => setCandidateOffset(Math.max(0, candidateOffset - 3))}>上一组</Button><span className="cg-muted">{candidateOffset + 1}–{Math.min(candidateOffset + 3, detail.candidateRefs!.length)} / {detail.candidateRefs!.length}</span><Button size="sm" variant="tertiary" isDisabled={candidateOffset + 3 >= detail.candidateRefs!.length} onPress={() => setCandidateOffset(candidateOffset + 3)}>下一组</Button></div>}
            <h3>轮次与结果</h3>
            <ScrollShadow className="cg-history" style={{ maxHeight: 170 }}>{detail.rounds?.slice().reverse().map((round) => <div className="cg-history-row" key={round.requestId}><strong>第 {round.round} 轮 · {productionLabel(round.status)}</strong><span>{round.result?.conclusion || round.result?.error || round.requestId}</span><small>{round.updatedAt}</small></div>)}</ScrollShadow>
          </> : <div className="cg-empty"><strong>选择一个制作请求</strong><span>生成状态、候选和轮次结果会按需读取。</span></div>}
        </aside>
      </div>
      </>}
      {(navigation.error || page.error || selected.error) && <p className="cg-error" role="alert">{navigation.error?.message || page.error?.message || selected.error?.message}</p>}
    </section>
  );
}

/** Each production's controls have independent pending/error ownership. */
function ProductionCommands({item,disabled,run}:{item:Production;disabled:boolean;run:(item:Production,newRound?:boolean)=>Promise<void>}){
  const action=useAction(),roundCount=item.roundCount??item.rounds?.length??0;
  const running=["running","queued","reserved"].includes(item.status);
  if(item.workflowKind==='card-generation')return <span className="cg-muted">卡牌工作流 · 选择继续</span>;
  return <div className="cg-item-actions">
    <Button size="sm" variant="primary" isDisabled={disabled||action.pending||running} onPress={()=>void action.run(()=>run(item))}>{running?'执行中':'明确生成'}</Button>
    {roundCount>0&&<Button size="sm" variant="tertiary" isDisabled={disabled||action.pending} onPress={()=>void action.run(()=>run(item))}>重试交办</Button>}
    <Button size="sm" variant="tertiary" isDisabled={disabled||action.pending} onPress={()=>void action.run(()=>run(item,true))}>新一轮</Button>
    {action.error&&<p className="cg-error" role="alert">{action.error.message}</p>}
  </div>;
}
function CandidateMedia({candidate,adopted,onReject}:{candidate:Candidate;adopted?:boolean;onReject:(reason?:string)=>Promise<void>}) {
  const {useQuery,host,projectId,scopeGeneration}=useProductionNote();
  const rejectAction=useAction(),copy=useAction();
  const [rejecting,setRejecting]=useState(false),[reason,setReason]=useState(''),[copied,setCopied]=useState(false);
  const id=candidate.id??candidate.key??candidate.assetId;
  const media=useQuery('media',id?{id,variant:'original'}:{},{enabled:Boolean(id)});
  const resolved={...candidate,...media.data},src=media.data?.url??media.data?.src??media.data?.data;
  const mimeType=resolved.mimeType??'',rejected=typeof candidate.rejectedAt==='string';
  const confirmReject=()=>rejectAction.run(async()=>{await onReject(reason.trim()||undefined);setRejecting(false);setReason('');});
  const copyReference=()=>{setCopied(false);return copy.run(async()=>{
    if(!id||!media.data||media.error||media.stale||!candidate.revision||media.data.revision!==candidate.revision)throw Error('候选资源尚未核验或版本已变化，请先核对登记回执');
    // These are service-verified candidate facts, never an invented adopted version.
    await host.copyText(JSON.stringify({kind:'asset',projectId,projectGeneration:scopeGeneration,id,revision:media.data.revision},null,2));
    setCopied(true);
  });};
  return <div className={`cg-candidate${rejected?' rejected':''}`}>
    <div className="cg-media-preview">{src&&mimeType.startsWith('audio/')?<audio controls preload="metadata" src={src} onPlay={event=>{document.querySelectorAll('audio').forEach(audio=>{if(audio!==event.currentTarget)audio.pause();});}}/>:src&&mimeType.startsWith('video/')?<video controls preload="metadata" src={src}/>:src?<img src={src} alt="候选预览" loading="lazy"/>:<span className="cg-muted">{media.loading?'媒体读取中…':'暂无预览'}</span>}</div>
    <div className="cg-candidate-info"><strong>{id}</strong><small>{mimeType||candidate.version||'候选引用'}</small><small>{resolved.width?`${resolved.width} × ${resolved.height??'?'}`:''}{resolved.durationMs?` · ${Math.round(resolved.durationMs/1000)}s`:''}{resolved.revision?` · rev ${resolved.revision}`:''}</small>{rejected&&<small className="cg-rejected-label">已否决{candidate.rejectReason?`：${candidate.rejectReason}`:''}</small>}{media.error&&<p role="alert">{media.error.message}</p>}{(copy.error||rejectAction.error)&&<p role="alert">{copy.error?.message??rejectAction.error?.message}</p>}{copied&&<small role="status">候选引用已复制</small>}</div>
    {rejecting?<span className="cg-reject-prompt"><input value={reason} disabled={rejectAction.pending} onChange={event=>setReason(event.target.value)} onKeyDown={event=>{if(event.key==='Enter')void confirmReject();}} placeholder="原因（可选）" aria-label="否决原因" autoFocus/><Button size="sm" variant="primary" isDisabled={rejectAction.pending} onPress={()=>void confirmReject()}>确认</Button><Button size="sm" variant="tertiary" isDisabled={rejectAction.pending} onPress={()=>{setRejecting(false);setReason('');}}>取消</Button></span>:<><Button size="sm" variant="tertiary" isDisabled={copy.pending} onPress={()=>void copyReference()}>复制候选引用</Button>{!adopted&&!rejected&&<Button size="sm" variant="tertiary" isDisabled={rejectAction.pending} onPress={()=>setRejecting(true)}>否决</Button>}</>}
  </div>;
}

function decodeCardGameFocus(itemId: string | null): { projectId: string; kind: string; id?: string } | undefined {
  if (!itemId?.startsWith("cg:")) return undefined;
  try {
    const value = JSON.parse(decodeURIComponent(itemId.slice(3))) as Record<string, unknown>;
    if (!value || typeof value.projectId !== "string" || typeof value.kind !== "string") return undefined;
    return { projectId: value.projectId, kind: value.kind, ...(typeof value.id === "string" ? { id: value.id } : {}) };
  } catch {
    return undefined;
  }
}

function productionLabel(status: string): string {
  if (status === 'needs-input') return '需要补充';
  if (status === 'pending') return '等待执行';
  if (status === 'cancelled') return '已取消';
  if (status === 'paused') return '已暂停';
  if (status === 'interrupted') return '制作中断';
  return status === "draft" ? "草稿" : status === "reserved" ? "待交办" : status === "queued" ? "排队" : status === "running" ? "进行中" : status === "completed" ? "已生成" : status === "adopted" ? "已采用" : status === "failed" ? "失败" : status === "stale" ? "旧结果" : status;
}

const STYLES = `
.cg-production{box-sizing:border-box;min-height:100dvh;padding:16px;background:var(--wb-paper);color:var(--wb-ink);font-family:var(--wb-font-family);display:flex;flex-direction:column;gap:14px;min-width:0}.cg-production.cg-compact{padding:12px;gap:8px;font-size:12px}.cg-production header,.cg-brand,.cg-toolbar,.cg-create,.cg-item-head,.cg-item-meta,.cg-item-actions,.cg-detail-status,.cg-detail-actions,.cg-candidate{display:flex;align-items:center;gap:8px}.cg-header{justify-content:space-between}.cg-brand small{display:block;color:var(--wb-muted);font-size:11px;margin-top:2px}.cg-icon{display:grid;place-items:center}.cg-toolbar{flex-wrap:wrap}.cg-create{align-items:end;flex-wrap:wrap}.cg-field{display:grid;gap:3px;min-width:150px;color:var(--wb-muted);font-size:11px}.cg-field textarea{min-height:34px;max-width:220px;border:1px solid var(--wb-line);border-radius:6px;padding:5px;background:var(--wb-paper);color:var(--wb-ink);font:inherit}.cg-requirement-editor{display:grid;gap:7px;margin:12px 0}.cg-requirement-editor .cg-field textarea{max-width:none}.cg-create .heroui-TextField{flex:1;min-width:0}.cg-body{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(250px,.85fr);gap:16px;min-height:0;flex:1}.cg-list{display:flex;flex-direction:column;gap:8px;min-height:0}.cg-expanded-list{max-height:590px;overflow:auto;padding-right:4px}.cg-row{display:flex;align-items:center;gap:7px;width:100%;padding:7px 4px;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer}.cg-title{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cg-status,.cg-muted,.cg-eyebrow,.cg-item-meta,.cg-history-row small{color:var(--wb-muted)}.cg-item{padding:11px;border-radius:var(--wb-radius-small);background:var(--wb-surface);cursor:pointer}.cg-item.selected{background:var(--wb-accent-pale)}.cg-item-head strong{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cg-item-meta{font-size:11px;flex-wrap:wrap;margin-top:7px}.cg-item-actions,.cg-detail-actions{margin-top:8px;flex-wrap:wrap}.cg-pill{font-size:11px;padding:2px 6px;border-radius:999px;background:var(--wb-surface-deep);color:var(--wb-ink-soft)}.cg-status-dot{width:8px;height:8px;border-radius:50%;background:var(--wb-muted);flex:none}.status-queued,.status-running,.status-reserved{background:var(--wb-accent)}.status-completed,.status-adopted{background:var(--wb-success)}.status-failed,.status-stale{background:var(--wb-danger)}.cg-detail{min-width:0;padding:14px;background:var(--wb-surface);border-radius:var(--wb-radius)}.cg-detail h2{font-size:18px;margin:8px 0}.cg-detail h3{font-size:13px;margin:18px 0 8px}.cg-candidates,.cg-history{display:flex;flex-direction:column;gap:8px}.cg-candidate{padding:8px;background:var(--wb-surface-deep);border-radius:var(--wb-radius-small)}.cg-media-preview{width:180px;min-height:130px;display:grid;place-items:center;overflow:hidden;border-radius:6px;background:var(--wb-paper)}.cg-media-preview img,.cg-media-preview video{width:180px;max-height:160px;object-fit:contain}.cg-media-preview audio{width:180px}.cg-candidate div{display:grid;gap:2px;min-width:0;flex:1}.cg-candidate small{color:var(--wb-muted)}.cg-candidate.rejected{opacity:.55}.cg-rejected-label{color:var(--wb-danger)!important}.cg-reject-prompt{display:flex;align-items:center;gap:6px}.cg-reject-prompt input{width:110px;height:28px;padding:3px 7px;border:1px solid var(--wb-line);border-radius:6px;background:var(--wb-paper);color:var(--wb-ink);font:inherit}.cg-history-row{display:grid;gap:2px;padding-bottom:8px;border-bottom:1px solid var(--wb-line-soft)}.cg-error{color:var(--wb-danger);font-size:12px}.cg-empty{display:flex;align-items:center;justify-content:center;gap:8px;flex-direction:column;min-height:120px;color:var(--wb-muted)}.cg-loading{display:flex;justify-content:center;align-items:center;gap:8px;padding:24px;color:var(--wb-muted)}
@media(max-width:700px){.cg-production{padding:12px}.cg-body{grid-template-columns:1fr}.cg-create{align-items:stretch}.cg-create button{align-self:end}}
`;
