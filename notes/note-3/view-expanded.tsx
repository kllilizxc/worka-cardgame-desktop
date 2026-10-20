import { useEffect, useState } from 'react';
import { Button, ScrollShadow } from '@heroui/react';
import {NoteDialog,NoteGuidance,NoteIcon,ManagedEmbed,QueryState} from '@dsh-workbench/react';
import {useNote} from '@dsh-workbench/react';
import { FormalPreview } from './formal-preview';
import { CandidateReport } from './view-report';
import { PreviewReferences } from './pinned-references';
import { STATUS, TONE, FONT, MONO, GLYPH, Glyph, TransportButton, PreviewLoading, failureMessage, canViewPreview, navigationUrl, featureTitle, previewWantsVersions, type PreviewModel } from './view-model';

export default function ExpandedView({ model }: { model: PreviewModel }) {
  const { config, runtime, data, actions, workbench, stage, operations, collapsed, setCollapsed, menu, setMenu, showAddress, setShowAddress, showArchive, setShowArchive, setUrls, draft, setDraft, frameReady, setFrameReady, fullscreen, error, setError, setActiveKey, loaded, reload, confirmForget, setConfirmForget, run, archived, rows, current, currentIsCandidate, resolvedUrls, accessKey, currentUrl, accessError, activeDevice, cycleDevice, mutations, mutationNotices, effectiveStatus, repairButton, frameToken, label, attach, reloadFrame, startAndAttach, openDelegation, draftTodo, attachedHere, layout } = model;
  const compact = model.mode !== 'expanded';
  const openPlayer = (versions = false) => {
    const focus = current || versions ? 'cg:' + encodeURIComponent(JSON.stringify({kind:'preview',id:current?.owner.key ?? '',revision:current?.owner.repos?.game?.commit ?? current?.owner.revision ?? '',...(versions ? {intent:'versions'} : {})})) : undefined;
    void workbench.openNote(runtime.note.id, focus).catch(cause => setError(String(cause)));
  };
  const [showReport,setShowReport]=useState(false);
  useEffect(()=>setShowReport(false),[current?.spec.key]);
  const [versions, setVersions] = useState(() => previewWantsVersions(model.focus));
  const {mode} = useNote<typeof import('./actions')>();
  const visible = mode === 'expanded';
  useEffect(() => {
    // Reopen the requested versions panel when focus navigation changes.
    if (visible && previewWantsVersions(model.focus)) setVersions(true);
  }, [visible, model.focus, model.focusRequestId]);
  const {useQuery}=useNote<typeof import('./actions')>();
  const formal = useQuery('formalPreview', {}, { enabled: !!config?.projectId });
  const busy = ['starting', 'stopping', 'checking'].includes(effectiveStatus);
  const cancellable = ['starting', 'checking'].includes(effectiveStatus);
  const playing = canViewPreview(effectiveStatus) && current?.live && attachedHere;
  const showFailure = Boolean(current && !busy && !canViewPreview(current.status) && (current.error || error));
  const failure = current ? failureMessage(current, error) : undefined;
  const formalSelected = current?.owner.options?.formalPreview === true;
  const historical = formalSelected && formal.data && (formal.data.record?.key !== current?.owner.key || formal.data.freshness === 'stale');
  const title = current ? formalSelected ? '正式版快照' : featureTitle(current.groupName) : '选择版本';
  const toggle = () => {
    if (!current) return;
    if(playing||cancellable){void mutations.stop.mutate({key:current.owner.key,surface:current.surface});}
    else if (canViewPreview(current.status)) attach(current.spec.key);
    else startAndAttach(current.spec.key);
  };
  const toggleFullscreen = () => run(() => document.fullscreenElement ? document.exitFullscreen() : stage.current?.requestFullscreen() ?? Promise.reject(new Error('预览画面尚未就绪')));
  const dialogStyle = { width: 560, maxWidth: 'calc(100% - 24px)', maxHeight: '85dvh', margin: 'auto', padding: 20, border: 0, borderRadius: 'var(--wb-radius)', background: 'var(--wb-paper)', color: 'var(--wb-ink)', boxShadow: 'var(--wb-shadow-popover)', boxSizing: 'border-box' as const };
  const closeMenu = (operation: () => void) => { operation(); setMenu(false); };
  const groups = [...model.groups].sort((a, b) => Number(b.rows[0].owner.options?.formalPreview === true) - Number(a.rows[0].owner.options?.formalPreview === true));

  return <section className={`preview-player${compact ? ' preview-player-compact' : ''}`}>
    <style>{styles}</style>
    <header className="preview-controls">
      {compact ? <><NoteIcon icon={model.metadata.icon} size={18}/><strong>试玩</strong><Button size="sm" variant="tertiary" onPress={() => openPlayer(true)}>版本 ▾</Button></> : <>
      <Button size="sm" variant="secondary" className="preview-version" aria-label={`选择试玩版本，当前${title}`} aria-expanded={versions} onPress={() => setVersions(true)}><span>{title}</span><span aria-hidden="true">⌄</span></Button>
      {current && <span className="preview-state" style={{ color: TONE[effectiveStatus] }}>{historical ? '历史快照' : STATUS[effectiveStatus] ?? '待核对'}</span>}
      <div className="preview-transport">
        <TransportButton primary path={playing || cancellable ? GLYPH.stop : GLYPH.play} filled={!playing && !cancellable} label={cancellable ? '停止本次启动或检查' : busy ? `${STATUS[effectiveStatus]}…` : playing ? '停止当前端预览' : '启动全部端并播放'} disabled={!current || effectiveStatus === 'stopping' || showFailure} loading={effectiveStatus === 'stopping'} onClick={toggle} />
        <TransportButton path={GLYPH.reload} label="刷新页面" disabled={!attachedHere || busy} onClick={() => reloadFrame(current!.spec.key)} />
        <TransportButton path={GLYPH.fullscreen} label={fullscreen ? '退出全屏' : '全屏'} onClick={toggleFullscreen} />
        <TransportButton path={GLYPH.more} label="更多试玩操作" onClick={() => { setMenu(true); setShowArchive(false); }} />
      </div></>}
    </header>
    {!compact && historical && <p className="preview-notice" role="status">当前为历史快照；选择版本可更新正式版。</p>}
    {!compact && formalSelected && (formal.error || formal.data?.freshness === 'unavailable') && <p className="preview-notice" role="status">正式内容版本暂时无法核对。</p>}
    {!compact && (data.outbox?.some((item: any) => item.deliveryBlocked) ? <p className="preview-notice" role="alert">检查结果回传被拒绝：{data.outbox.find((item: any) => item.deliveryBlocked)?.deliveryBlocked}</p> : data.feedbackError && <p className="preview-notice" role="status">检查结果回传待重试：{data.feedbackError}</p>)}
    {current && !showFailure && (error || accessError || current.status === 'verificationFailed' && current.error) && <p className="preview-notice" role="alert">{accessError || error || current.error}</p>}

    <div ref={stage} className="preview-stage">
      {current&&loaded.includes(current.spec.key)&&canViewPreview(current.status)&&model.previewTarget(current)&&<ManagedEmbed key={current.spec.key+':'+(reload[current.spec.key]??0)} embedKey={current.spec.key+':'+(reload[current.spec.key]??0)} target={model.previewTarget(current)} title={`${label(current.spec)} 内嵌预览`} onClose={model.closePreview} className="preview-managed-embed" style={{position:'absolute',top:current.owner.repos?.game?'50%':0,left:'50%',width:current.owner.repos?.game?'min(100cqw, calc(100cqh * 16 / 9))':'100%',maxWidth:activeDevice.maxWidth,height:current.owner.repos?.game?'auto':'100%',aspectRatio:current.owner.repos?.game?'16 / 9':undefined,transform:current.owner.repos?.game?'translate(-50%, -50%)':'translateX(-50%)',background:'var(--wb-paper)'}}/>}

      {compact ? <><span className="preview-compact-status" role="status">{!currentUrl ? accessError ? '画面读取失败' : current ? STATUS[current.status] ?? current.status : '选择版本开始试玩' : ''}</span><button className="preview-compact-open" aria-label={`展开试玩：${title}`} onClick={() => openPlayer()}/></> : <>

      {showFailure && current && failure && <div className="preview-overlay" role="alert" aria-labelledby="preview-failure-title">
        <div className="preview-failure"><h2 id="preview-failure-title">{failure.title}</h2><p>{failure.description}</p>{failure.reason && <details><summary>错误详情</summary><code>{failure.reason}</code></details>}<div className="preview-dialog-actions"><Button onPress={() => startAndAttach(current.spec.key, true)}>重新启动</Button>{repairButton(current)}</div></div>
      </div>}
      {current?.feedback && !showFailure && !busy && <div className="preview-repair">{repairButton(current)}</div>}
      {current?.activeOperation && !busy && <div className="preview-operation"><PreviewLoading key={current.operationId ?? current.spec.key} progress={current.progress} tasks={current.tasks} status="starting" startedAt={current.startedAt} /></div>}
      {current && busy && <div className="preview-overlay"><div className="preview-loading-shell"><PreviewLoading key={current.operationId ?? current.spec.key} progress={current.progress} tasks={current.tasks} status={effectiveStatus} startedAt={current.startedAt} />{cancellable && <Button variant="secondary" onPress={toggle}>停止</Button>}</div></div>}
      {!busy && !attachedHere && !showFailure && <div className="preview-overlay">
        {!current ? <NoteGuidance title="选择试玩版本" description={config?.projectId ? '正式版与候选使用各自的独立存档。' : '执行台产出的预览会出现在这里。'} action={{ label: '选择版本', onPress: () => setVersions(true) }} /> : <Button onPress={() => canViewPreview(current.status) ? attach(current.spec.key) : startAndAttach(current.spec.key)}>{canViewPreview(current.status) ? '打开试玩' : '启动试玩'}</Button>}
      </div>}
      </>}
    </div>
    <QueryState query={model.query}>{()=>null}</QueryState>{mutationNotices}
    {current&&<div><Button size="sm" aria-expanded={showReport} onPress={()=>setShowReport(value=>!value)}>查看检查与诊断</Button>{showReport&&<CandidateReport candidate={current.owner} surface={current.surface}/>}</div>}
    {config?.projectId && <footer className="preview-context">{compact ? <><strong>{title}</strong><small style={{color:current ? TONE[current.status] : undefined}}>{current ? STATUS[current.status] ?? current.status : `${rows.length} 个版本`}</small><Button size="sm" variant="secondary" onPress={attachedHere || !current ? () => openPlayer() : () => startAndAttach(current.spec.key)}>{attachedHere ? '进入试玩' : current ? '启动试玩' : '打开试玩'}</Button></> : <PreviewReferences candidate={current?.owner}/>}</footer>}

    <NoteDialog open={versions} onOpenChange={setVersions} label="选择试玩版本" style={dialogStyle}>
      <div className="preview-dialog-heading"><strong>试玩版本</strong><Button size="sm" variant="tertiary" onPress={() => setVersions(false)}>关闭</Button></div>
      {config?.projectId && <FormalPreview onOpen={key => { attach(key); setVersions(false); }} />}
      <ScrollShadow className="preview-version-list">
        {groups.map(group => {
          const closed = collapsed.includes(group.key), selected = group.rows.find(row => row.spec.key === current?.spec.key);
          return <section key={group.key} className="preview-version-group">
            <div className="preview-dialog-heading"><Button size="sm" variant="tertiary" className="preview-group-title" aria-expanded={!closed} onPress={() => setCollapsed(value => closed ? value.filter(key => key !== group.key) : [...value, group.key])}>{group.rows[0].owner.options?.formalPreview ? `正式快照 · ${new Date(String(group.rows[0].owner.options.snapshotCreatedAt)).toLocaleString()}` : featureTitle(group.rows[0].groupName)} {closed ? '▸' : '▾'}</Button><Button size="sm" variant="tertiary" isDisabled={group.rows.some(row => row.activeOperation) || Boolean(operations[group.rows[0].owner.key])} onPress={() => { startAndAttach((selected ?? group.rows[0]).spec.key); setVersions(false); }}>启动全部</Button></div>
            {(!closed ? group.rows : selected ? [selected] : []).map(row => <Button size="sm" variant={row.spec.key === current?.spec.key ? 'secondary' : 'tertiary'} className="preview-version-row" key={row.spec.key} aria-pressed={row.spec.key === current?.spec.key} onPress={() => { if (canViewPreview(row.status)) attach(row.spec.key); else setActiveKey(row.spec.key); setError(''); setVersions(false); }}><span>{row.name}</span><small>{STATUS[row.status] ?? row.status}</small></Button>)}
          </section>;
        })}
        <div><Button size="sm" isDisabled={!model.page.hasPrevious} onPress={model.previousPage}>上一页</Button><Button size="sm" isDisabled={!model.page.hasNext} onPress={model.nextPage}>下一页</Button><Button size="sm" onPress={model.resetPage}>回到首页</Button></div>
        {!rows.length && <p>尚无候选预览。</p>}
      </ScrollShadow>
    </NoteDialog>

    <NoteDialog open={menu} onOpenChange={setMenu} label="更多试玩操作" style={dialogStyle}>
      <div className="preview-dialog-heading"><strong>试玩操作</strong><Button size="sm" variant="tertiary" onPress={() => setMenu(false)}>关闭</Button></div>
      <ScrollShadow className="preview-menu">
        {config?.feedbackInTodo && config.notes?.todo && <Button variant="secondary" onPress={() => closeMenu(draftTodo)}>记录试玩反馈</Button>}
        {current?.owner.originNoteId && current.owner.delegationId && <Button variant="tertiary" onPress={() => closeMenu(() => openDelegation(current.owner))}>查看来源需求 / 执行台</Button>}
        <Button variant="tertiary" isDisabled={!current || !canViewPreview(current.status)} onPress={() => closeMenu(() => setShowAddress(true))}>编辑预览地址</Button>
        <Button variant="tertiary" onPress={cycleDevice}>画面尺寸：{activeDevice.label === 'phone' ? '手机' : activeDevice.label === 'pad' ? '平板' : '桌面'} · 点击切换</Button>
        <Button variant="tertiary" isDisabled={!currentUrl} onPress={() => closeMenu(() => run(() => workbench.openExternal(currentUrl)))}>在新标签页打开预览</Button>
        {current?.surface && <Button variant="tertiary" onPress={() => closeMenu(() => startAndAttach(current.spec.key, true))}>仅启动当前端</Button>}
        {current?.owner.adapter && <><Button variant="tertiary" onPress={() => closeMenu(() => mutations.verify.mutate({ key: current.owner.key, ...(current.surface ? { surface: current.surface } : {}) })) }>重新检查预览</Button><Button variant="tertiary" onPress={() => closeMenu(() => mutations.check.mutate({ key: current.owner.key, ...(current.surface ? { surface: current.surface } : {}) })) }>检查候选依赖</Button></>}
        <Button variant="tertiary" onPress={() => closeMenu(() => run(() => model.refresh()))}>同步进程状态</Button>
        {current?.live && <Button variant="tertiary" isDisabled={effectiveStatus === 'stopping'} onPress={() => closeMenu(() => mutations.stop.mutate({ key: current.owner.key, surface: current.surface }))}>停止当前端预览</Button>}
        {currentIsCandidate && <Button variant="tertiary" isDisabled={effectiveStatus === 'stopping'} onPress={() => closeMenu(() => mutations.archive.mutate({ key: current!.owner.key }))}>归档当前候选及预览</Button>}
        <Button variant="tertiary" aria-expanded={showArchive} onPress={() => setShowArchive(!showArchive)}>已归档（{archived.length}）{showArchive ? '▾' : '▸'}</Button>
        {showArchive && <div><Button size="sm" isDisabled={!model.archivePage.hasPrevious} onPress={model.previousArchive}>上一页</Button><Button size="sm" isDisabled={!model.archivePage.hasNext} onPress={model.nextArchive}>下一页</Button>{!archived.length && <p>暂无归档候选</p>}{archived.map(spec => <article key={spec.key}><strong>{label(spec)}</strong><div className="preview-dialog-actions"><Button size="sm" variant="secondary" onPress={() => mutations.restore.mutate({ key: spec.key })}>恢复</Button><Button size="sm" variant="tertiary" onPress={() => { if (confirmForget === spec.key) { setConfirmForget(null); void mutations.forget.mutate({ key: spec.key }); } else setConfirmForget(spec.key); }}>{confirmForget === spec.key ? '确认永久删除' : '删除'}</Button>{confirmForget === spec.key && <Button size="sm" variant="tertiary" onPress={() => setConfirmForget(null)}>取消</Button>}</div></article>)}</div>}
      </ScrollShadow>
    </NoteDialog>

    <NoteDialog open={showAddress} onOpenChange={setShowAddress} label="编辑预览地址" style={dialogStyle}>
      <div className="preview-dialog-heading"><strong>预览地址</strong><Button size="sm" variant="tertiary" onPress={() => setShowAddress(false)}>关闭</Button></div>
      <form onSubmit={event => { event.preventDefault(); try { const url = navigationUrl(draft, currentUrl); setUrls(value => ({ ...value, [current!.spec.key]: url })); setDraft(url); setError(''); attach(current!.spec.key); reloadFrame(current!.spec.key); setShowAddress(false); } catch (cause) { setError(String(cause)); } }} className="preview-address"><input aria-label="预览地址" value={draft} onChange={event => setDraft(event.target.value)} style={{ fontFamily: MONO }} /><Button type="submit" isDisabled={!current}>访问</Button></form>
      {error && <p role="alert">{error}</p>}
    </NoteDialog>
  </section>;
}

const styles = `
.preview-player{box-sizing:border-box;width:100%;height:100dvh;min-height:300px;background:var(--wb-paper);padding:12px;font-family:${FONT};font-size:13px;color:var(--wb-ink);display:flex;flex-direction:column;gap:10px;min-width:0;position:relative}
.preview-controls,.preview-transport,.preview-dialog-heading,.preview-dialog-actions{display:flex;align-items:center;gap:8px;min-width:0;flex-shrink:0}
.preview-dialog-heading{justify-content:space-between;margin-bottom:14px}.preview-dialog-actions{flex-wrap:wrap;margin-top:14px}
.preview-version{min-width:0;max-width:420px;justify-content:space-between}.preview-version>span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.preview-state{font-size:12px;white-space:nowrap}.preview-transport{margin-left:auto}
.preview-stage{position:relative;flex:1;min-height:0;border-radius:var(--wb-radius-small);overflow:hidden;container-type:size;background:var(--wb-surface)}
.preview-managed-embed{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}.preview-managed-embed>iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}.preview-managed-embed>button{position:absolute;top:8px;right:8px;z-index:2;border:1px solid var(--wb-line);border-radius:var(--wb-radius-small);padding:6px 10px;background:var(--wb-paper);color:var(--wb-ink);cursor:pointer}.preview-stage:fullscreen{width:100vw!important;height:100vh!important;border-radius:0}.preview-context{display:flex;justify-content:flex-end;flex-shrink:0}
.preview-notice{font-size:12px;color:var(--wb-warning);margin:0;overflow-wrap:anywhere}.preview-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;overflow:auto;box-sizing:border-box;text-align:center;background:var(--wb-surface)}
.preview-loading-shell,.preview-failure{max-width:520px;width:100%;min-width:0;overflow-wrap:anywhere}.preview-failure h2{font-size:20px}.preview-failure details{text-align:left}.preview-failure code{white-space:pre-wrap}.preview-operation,.preview-repair{position:absolute;bottom:12px;right:12px;max-width:calc(100% - 24px);background:var(--wb-paper);border-radius:var(--wb-radius-small);padding:8px}
.preview-version-list{max-height:50dvh;display:flex;flex-direction:column;gap:16px;margin-top:16px}.preview-version-group{min-width:0}.preview-group-title{min-width:0;text-align:left;white-space:normal;height:auto!important;justify-content:flex-start;overflow-wrap:anywhere}.preview-version-row{display:flex;justify-content:space-between;width:100%;min-height:44px;gap:12px;margin-top:4px}.preview-version-row>span{min-width:0;overflow-wrap:anywhere;white-space:normal}.preview-version-row small{flex-shrink:0;color:var(--wb-muted)}
.preview-menu{max-height:60dvh;display:flex;flex-direction:column;gap:6px}.preview-menu>button{justify-content:flex-start;min-height:44px;white-space:normal;height:auto}.preview-menu article{padding:12px 0;overflow-wrap:anywhere}
.preview-address{display:flex;gap:8px}.preview-address input{min-width:0;flex:1;color:var(--wb-ink);background:var(--wb-surface);border:0;border-radius:var(--wb-radius-small);padding:10px;font-size:16px}
.preview-player button:focus-visible,.preview-player input:focus-visible{outline:2px solid var(--wb-accent);outline-offset:2px}.preview-player summary{cursor:pointer;min-height:32px}
@media(max-width:680px){.preview-player{padding:8px;min-height:0}.preview-controls{flex-wrap:wrap}.preview-version{flex:1;max-width:none}.preview-transport{flex-basis:100%;margin-left:0}.preview-context{justify-content:flex-start}.preview-transport>button{width:40px!important;height:40px!important}.preview-overlay{padding:16px}.preview-version-row{align-items:flex-start}}

.preview-player-compact{padding:14px;gap:12px;font-size:13px}.preview-player-compact .preview-controls{flex-wrap:nowrap;gap:8px}.preview-player-compact .preview-controls>strong{flex:1}.preview-player-compact .preview-controls>button{height:26px;min-height:26px;padding:0 8px;font-size:11px}.preview-player-compact .preview-stage{border-radius:10px}.preview-player-compact .preview-stage iframe{pointer-events:none}.preview-compact-open{position:absolute;inset:0;background:transparent;border:0;border-radius:10px;width:100%;height:100%;cursor:pointer}.preview-compact-status{position:absolute;inset:0;display:grid;place-items:center;padding:16px;text-align:center;font-size:12px;color:var(--wb-muted);pointer-events:none}.preview-player-compact .preview-context{flex-direction:column;gap:8px;justify-content:initial}.preview-player-compact .preview-context>strong{font-size:12px;overflow-wrap:anywhere}.preview-player-compact .preview-context>small{font-size:11px;color:var(--wb-muted)}.preview-player-compact .preview-context>button{width:100%;height:32px;min-height:32px}
`;
