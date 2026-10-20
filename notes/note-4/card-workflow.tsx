import {type PipelineCard,type CardOperation} from './contracts';
import { DeckOutcome } from './deck-outcome';
import { CompanionContext } from './companion-context';
import { CompanionCreate } from './companion-create';
import {useMutation,useViewState} from '@dsh-workbench/react';
import {MutationNotice} from './mutation-notice';
import {cardBoostEffect,cardEditorValue,type CardFields} from './card-draft';
import {useProductionNote} from './surface';
import { Button, Input, Label, ScrollShadow, Spinner, TextArea, TextField } from '@heroui/react';
import {useEffect,useState} from 'react';
import { CARD_FACE_THEMES, CARD_KIND_LABELS, cardRules } from './card-face';

const LABELS: Record<string, string> = { review: '核对定义', art: '等待插画', assemble: '待组装', integrate: '待建候选', done: '候选已建立' };

function QueryFailure({resource,label}:{resource:{error?:Error|null;refresh():Promise<unknown>};label:string}) {
  const [retrying,setRetrying]=useState(false),[error,setError]=useState('');
  async function retry(){setRetrying(true);try{await resource.refresh();setError('');}catch(cause){setError(cause instanceof Error?cause.message:String(cause));}finally{setRetrying(false);}}
  return <div><p role="alert" className="cw-error">{error||resource.error?.message}</p><Button variant="secondary" isDisabled={retrying} onPress={()=>void retry()}>{retrying?'正在重新读取…':label}</Button></div>;
}

export function CreateCardWorkflow({onCreated}:{onCreated:(id:string)=>void|Promise<void>}) {
  const {actions,useQuery,projectId,scopeGeneration}=useProductionNote();
  const features=useQuery('featureChoices',{});
  const input=useQuery('cardRequestInput',{projectGeneration:scopeGeneration});
  const save=useMutation(actions.createCardRequest,{draft:input,input:value=>value});
  const draft=save.draft,{brief,featureId}=draft.ready?draft.value:{brief:'',featureId:''};
  const [navigationError,setNavigationError]=useState('');
  async function openCreated(){if(save.status!=='success'||save.data===undefined)return;try{await onCreated(save.data.production.id);}catch(cause){setNavigationError(cause instanceof Error?cause.message:String(cause));}}
  return <><div className="cw-create"><style>{STYLE+REFINEMENTS+COMPACT_REFINEMENTS+REUSE_STYLE}</style>
    <TextField value={brief} onChange={brief=>draft.set(value=>({...value,brief}))} isDisabled={!draft.ready||draft.locked} fullWidth><Label>卡牌生成工作流</Label><Input placeholder="例如：设计一套青云宗灵兽卡组，先制作 3 张"/></TextField>
    <label className="cw-feature">所属功能<select aria-label="所属功能" disabled={!draft.ready||draft.locked} value={featureId} onChange={event=>draft.set(value=>({...value,featureId:event.target.value}))}><option value="">选择已有功能</option>{(features.data?.items??[]).map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
    <Button isDisabled={!draft.ready||draft.locked||!brief.trim()||!featureId} onPress={()=>void save.mutate()}>新建卡牌工作流</Button>
    {features.error&&<QueryFailure resource={features} label="重试读取所属功能"/>}<MutationNotice mutation={save} resetLabel="再建制作单"/>
    {save.status==='success'&&save.data!==undefined&&<Button variant="secondary" onPress={()=>void openCreated()}>打开已创建制作单</Button>}{navigationError&&<p role="alert">{navigationError}</p>}
  </div><CompanionCreate onCreated={onCreated}/></>;
}

export function CardWorkflow({ productionId, libraryNoteId, onEditing }: { productionId: string; libraryNoteId?: string; onEditing?:(dirty:boolean)=>void }) {
  const { actions, useQuery, host: workbench, metadata, projectId } = useProductionNote();
  const resource = useQuery('cardBatch', { productionId });
  const [selected,setSelected]=useViewState(`production:${productionId}:card`,'');
  const [showSteps,setShowSteps]=useViewState('card-workflow:steps',false);
  const value = resource.data;
  const [editing, setEditing] = useState(false);
  useEffect(()=>{onEditing?.(editing);return ()=>onEditing?.(false);},[editing,onEditing]);
  if (!value) return <div className="cw-workflow"><style>{STYLE + REFINEMENTS + COMPACT_REFINEMENTS + REUSE_STYLE}</style>{resource.error ? <QueryFailure resource={resource} label="重试读取制作单" /> : <Spinner />}</div>;
  const { batch, production, stages } = value;
  if (batch.deck) return <DeckOutcome value={value} />;
  const card = batch.cards.find((item) => item.definition.id === selected) ?? batch.cards[0];
  const currentStep = !card ? 0 : ({ review: 1, art: 2, assemble: 3, integrate: 4, done: 5 } as Record<string, number>)[stages[card.definition.id]] ?? 0;
  return <section className="cw-workflow"><style>{STYLE + REFINEMENTS + COMPACT_REFINEMENTS + REUSE_STYLE}</style>
    <CompanionContext production={production} />
    <header className="cw-heading"><div><span className="cw-muted">卡牌生成 · Codex 插画</span><h2>{production.brief}</h2></div><span>{batch.cards.length} 张</span></header>
    <Button className="cw-step-toggle" variant="tertiary" aria-expanded={showSteps} aria-controls="cw-production-steps" onPress={() => setShowSteps(value => !value)}>{currentStep >= 5 ? "制作已完成" : `第 ${currentStep + 1}/5 步 · ${card ? LABELS[stages[card.definition.id]] : "草稿"}`} · {showSteps ? "收起步骤" : "查看步骤"}</Button>
    <ol id="cw-production-steps" className={`cw-steps${showSteps ? " is-expanded" : ""}`} aria-label="制作进度">{['AI 卡组草稿', '人工微调', 'Codex 生图', '模板组装', '试玩候选'].map((step, index) => <li key={step} className={index < currentStep ? 'is-complete' : index === currentStep ? 'is-current' : ''} aria-current={index === currentStep ? 'step' : undefined}><span>{index < currentStep ? '✓' : index + 1}</span>{step}</li>)}</ol>
    {!card ? <div className="cw-empty"><strong>等待卡组草稿</strong><p>在便笺原生对话中描述想要的卡组，草稿会保存在这份制作单中。</p></div> : <>
      {batch.cards.length > 1 && <div className="cw-card-nav">{batch.cards.map((item) => <Button key={item.definition.id} size="sm" variant={card.definition.id === item.definition.id ? 'primary' : 'tertiary'} onPress={() => setSelected(item.definition.id)}>{item.definition.name} · {LABELS[stages[item.definition.id]]}</Button>)}</div>}
      <CardEditor key={card.definition.id} card={card} stage={stages[card.definition.id]} productionId={productionId} featureId={production.featureId} companion={batch.companion} adopted={production.gameCandidates?.filter((candidate) => candidate.cardId === card.definition.id).at(-1)?.status === "adopted"} baseRevision={production.revision} onDirty={setEditing} onOpenLibrary={libraryNoteId ? () => { void workbench.openNote(libraryNoteId, `cg:${encodeURIComponent(JSON.stringify({ projectId:production.projectId, kind: 'card', id: card.definition.id }))}`); } : undefined} />
    </>}
  </section>;
}

const REFINEMENTS = `
.cw-workflow{width:min(100%,1120px);margin:0 auto;padding:8px 0 28px;background:transparent}
.cw-heading{align-items:center}.cw-heading h2{margin:4px 0 0;font-size:22px;line-height:1.35}.cw-heading>span{color:var(--wb-muted);font-size:12px}
.cw-steps{gap:clamp(8px,2vw,26px);margin:14px 0 26px;padding:13px 0 0}.cw-steps li{color:var(--wb-muted);font-weight:600}.cw-steps li>span{width:23px;height:23px;padding:0;display:grid;place-items:center;background:var(--wb-surface-deep);border-radius:50%}.cw-steps li.is-current{color:var(--wb-ink)}.cw-steps li.is-current>span{background:var(--wb-accent);color:var(--wb-accent-foreground)}.cw-steps li.is-complete>span{background:var(--wb-success-pale);color:var(--wb-success)}
.cw-editor{gap:clamp(20px,4vw,48px);align-items:start}.cw-preview-image{width:min(100%,290px);background:transparent}.cw-preview>strong{font-size:15px}.cw-controls{gap:18px;padding:24px 26px;background:var(--wb-surface);border-radius:var(--wb-radius)}
.cw-stage-intro h3{font-size:21px;line-height:1.3;margin:3px 0 8px}.cw-stage-intro p{margin:0;color:var(--wb-muted);font-size:13px;line-height:1.6}.cw-eyebrow{font-size:12px;color:var(--wb-accent);font-weight:650}
.cw-edit-fields{display:flex;flex-direction:column;gap:14px}.cw-definition-summary{display:flex;flex-direction:column;gap:8px;padding:15px 18px;border-radius:var(--wb-radius-small);background:var(--wb-surface-deep)}.cw-definition-summary strong{font-size:16px}.cw-definition-summary span{font-size:13px;color:var(--wb-ink-soft)}.cw-definition-summary p{margin:0;white-space:pre-wrap;line-height:1.7;font-size:13px}
.cw-next{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.cw-file-pick{position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:37px;padding:7px 14px;border-radius:var(--wb-radius-small);background:var(--wb-accent-pale);color:var(--wb-accent);font-size:13px;font-weight:600;cursor:pointer}.cw-file-pick:focus-within{outline:2px solid var(--wb-accent);outline-offset:2px}.cw-file-pick input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}
.cw-revise,.cw-request{color:var(--wb-ink-soft);font-size:13px}.cw-revise summary,.cw-request summary{cursor:pointer;padding:7px 0}.cw-revise .cw-edit-fields{padding:12px 0}.cw-theme-buttons{justify-content:center}
@media(max-width:680px){.cw-workflow{padding:4px 0 20px}.cw-heading h2{font-size:18px}.cw-steps{margin:10px 0 18px;gap:9px}.cw-steps li{font-size:11px}.cw-steps li>span{width:20px;height:20px}.cw-controls{padding:18px}.cw-preview-image{width:min(100%,235px)}.cw-editor.stage-review .cw-preview{flex-direction:row;justify-content:center;flex-wrap:wrap}.cw-editor.stage-review .cw-preview-image{width:86px}.cw-editor.stage-review .cw-preview strong{font-size:14px}.cw-editor.stage-art .cw-preview{display:none}}
`;

function CardEditor({card,stage,productionId,featureId,companion,adopted,baseRevision,onDirty,onOpenLibrary}:{card:PipelineCard;stage:string;productionId:string;featureId?:string;companion?:{cardId:string;revision:string};adopted?:boolean;baseRevision:number;onDirty:(dirty:boolean)=>void;onOpenLibrary?:()=>void}) {
  const {actions,useQuery,host:workbench,scopeGeneration}=useProductionNote();
  const key=JSON.stringify([scopeGeneration,productionId,card.definition.id]);
  const source=useQuery('cardEditInput',{productionId,cardId:card.definition.id,projectGeneration:scopeGeneration});
  const query=useQuery('cardBatch',{productionId});
  const save=useMutation(actions.saveCardEdits,{draft:source,input:(value,{baseline})=>({productionId:baseline.productionId,cardId:baseline.cardId,projectGeneration:baseline.projectGeneration,baseRevision:baseline.revision,fields:{name:value.name,description:value.description,attack:value.attack,health:value.health,artBrief:value.artBrief,boost:value.boost}})});
  const draft=save.draft;
  const operation=useMutation(actions.cardWorkflow,{key,query});
  const bind=useMutation(actions.updateProduction,{key,query});
  const busy=[operation.status,bind.status].some(status=>status==='pending'||status==='unknown');
  const error=operation.error?.message??bind.error?.message;
  const canEditBoost=Boolean(cardBoostEffect(card));
  const [feedback,setFeedback]=useState('');
  const {name,description,attack,health,artBrief,boost}=draft.ready?draft.value:cardEditorValue(card);
  const dirty = draft.dirty;
  const [chosenFeatureId, setChosenFeatureId] = useState(featureId ?? '');
  const features = useQuery('featureChoices', {}, { enabled: !featureId });
  const [reuseSourceId, setReuseSourceId] = useState(companion?.cardId ?? '');
  const reuseChoices = useQuery('companionChoices', {}, { enabled: stage === 'review' || stage === 'art' });
  const reuseSource = useQuery('sourceCard', { id: reuseSourceId }, { enabled: Boolean(reuseSourceId) });
  useEffect(() => { onDirty(dirty || draft.locked); return () => onDirty(false); }, [dirty,draft.locked,onDirty]);
  function edit(field:keyof CardFields,value:string) { draft.set(previous => ({ ...previous, [field]: value })); }
  const args={productionId,projectGeneration:scopeGeneration,cardId:card.definition.id,baseRevision};
  const previewId = stage === 'art' ? undefined : ['integrate', 'done'].includes(stage) ? card.assembly?.variants?.[card.presentation.themeId]?.previewId : card.art?.id;
  const media = useQuery('media', { id: previewId, variant: 'original' }, { enabled: Boolean(previewId) });
  function run(name:CardOperation,extra:Record<string,unknown>={}) {setFeedback('');return operation.mutate({...args,operation:name,...extra});}
  function requestArt(){return run('requestCardArt');}
  async function copyHandoff(){if(operation.status!=='success'||typeof operation.data?.handoff!=='string')return;try{await workbench.copyText(operation.data.handoff);setFeedback('生图任务已复制，发到 Codex 后回填图片。');}catch(cause){setFeedback(cause instanceof Error?cause.message:String(cause));}}
  const disabled=busy||dirty||!draft.ready||draft.locked;
  const unit = card.definition.kind === 'unit';
  const editFields = <div className="cw-edit-fields">
    <div className={`cw-fields${unit ? '' : ' cw-fields-single'}`}><TextField isDisabled={!draft.ready||draft.locked} value={name} onChange={value => edit('name', value)}><Label>名称</Label><Input /></TextField>{unit && <><TextField isDisabled={!draft.ready||draft.locked} value={attack} onChange={value => edit('attack', value)}><Label>攻击</Label><Input type="number" min={0} max={999} /></TextField><TextField isDisabled={!draft.ready||draft.locked} value={health} onChange={value => edit('health', value)}><Label>生命</Label><Input type="number" min={1} max={999} /></TextField></>}</div>
    <TextField isDisabled={!draft.ready||draft.locked} value={description} onChange={value => edit('description', value)} fullWidth><Label>说明</Label><TextArea rows={2} /></TextField>
    {canEditBoost && <TextField isDisabled={!draft.ready||draft.locked} value={boost} onChange={value => edit('boost', value)}><Label>本回合攻击增益</Label><Input type="number" min={1} max={9} /></TextField>}
    <p className="cw-rules">{cardRules(card.definition)}</p>
    <TextField isDisabled={!draft.ready||draft.locked} value={artBrief} onChange={value => edit('artBrief', value)} fullWidth><Label>插画要求</Label><TextArea rows={3} /></TextField>
    {dirty && <div className="cw-actions"><Button size="sm" isDisabled={busy||!draft.ready||draft.locked} onPress={() => { void save.mutate(); }}>保存微调</Button><span className="cw-muted">尚未保存</span></div>}
    <MutationNotice mutation={save}/>
  </div>;
  const generation = card.artGeneration;
  const generating = stage === 'art' && generation?.status === 'running';
  const stageTitle = stage === 'review' ? '核对卡牌定义' : stage === 'art' ? generating ? 'Codex 正在生成插画' : '生成并回填插画' : stage === 'assemble' ? '组装卡面' : stage === 'integrate' ? '建立可试玩候选' : adopted ? '这张卡已加入我的游戏' : '试玩候选已建立';
  const stageHint = stage === 'review' ? '确认名称、说明、规则与插画要求后，开始自动制作。' : stage === 'art' ? generating ? '完成后会自动组装两套卡面并建立试玩候选。' : generation?.status === 'failed' ? '生图未完成，可重试当前请求或上传插画。' : generation?.status === 'unavailable' ? '当前宿主无法自动生图，可复制任务到 Codex 并上传插画。' : '用 Codex 生成插画；也可以上传已有的插画。' : stage === 'assemble' ? '插画已就绪。两套卡面会使用同一张插画。' : stage === 'integrate' ? '卡牌定义与资源将写入隔离的候选版本；确认采用只在功能进展中进行。' : adopted ? '当前卡牌候选已本地采用；可在卡牌库查看正式卡面，或回到来源记录查看验收结论。' : '候选已登记到试玩便笺。';
  return <div className={`cw-editor stage-${stage}`}>
    <div className="cw-preview"><div className="cw-preview-image">{media.data?.url ? <img src={media.data.url} alt={`${card.definition.name} · ${['integrate', 'done'].includes(stage) ? '卡面' : '插画'}`} /> : <span>{media.loading ? '读取预览…' : stage === 'art' ? '等待当前要求的插画' : '等待插画'}</span>}</div>{media.error && <p className="cw-error">{media.error.message}</p>}<div className="cw-preview-identity"><strong>{card.definition.name}</strong><small>{card.definition.id}</small></div>
      {(stage === 'integrate' || stage === 'done') && <><div className="cw-theme-buttons" aria-label="卡面主题">{CARD_FACE_THEMES.map(theme => <Button key={theme.id} size="sm" isDisabled={disabled} variant={theme.id === card.presentation.themeId ? 'primary' : 'secondary'} onPress={() => void run('saveCardDraft', { presentation: { themeId: theme.id } })}>{theme.name}</Button>)}</div><span className="cw-muted">切换主题会生成新的候选版本</span></>}
      {stage === 'done' && <span className="cw-muted">请在试玩便笺体验，然后到对应功能项确认采用。</span>}
    </div>
    <div className="cw-controls"><div className="cw-stage-intro" aria-live="polite"><span className="cw-eyebrow">{LABELS[stage]}</span><h3>{stageTitle}</h3><p>{stageHint}</p></div>
      {stage === 'done' && <><div className="cw-definition-summary"><strong>{card.definition.name}</strong><span>{CARD_KIND_LABELS[card.definition.kind] ?? card.definition.kind}{unit ? ` · 攻击 ${card.definition.attack} · 生命 ${card.definition.health}` : ''}</span><p>{cardRules(card.definition)}</p></div><details className="cw-revise" open={dirty}><summary>修改卡牌定义或插画要求{dirty ? ' · 未保存' : ''}</summary>{editFields}</details><div className="cw-next"><Button isDisabled={disabled} onPress={() => void run('integrateCard')}>重新建立试玩候选</Button></div></>}
      {stage !== 'done' && <>
        {stage === 'review' || stage === 'art' ? editFields : <details className="cw-revise" open={dirty}><summary>修改卡牌定义或插画要求{dirty ? ' · 未保存' : ''}</summary>{editFields}</details>}
        {(stage === 'review' || stage === 'art') && <div className="cw-reuse"><label>复用现有插画<select aria-label="复用插画来源" value={reuseSourceId} disabled={disabled} onChange={event => setReuseSourceId(event.target.value)}><option value="">选择已有卡牌</option>{(reuseChoices.data?.units ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><Button variant="secondary" isDisabled={disabled || !reuseSource.data?.json?.cardFace?.artwork} onPress={() => void run('reuseCardArt', { sourceCardId: reuseSourceId, sourceRevision: reuseSourceId === companion?.cardId ? companion.revision : reuseSource.data?.revision })}>复用选中卡牌的插画</Button>{reuseChoices.error && <QueryFailure resource={reuseChoices} label="重试读取插画来源列表" />}{reuseSourceId && reuseSource.loading && <p role="status" className="cw-muted">正在读取来源插画…</p>}{reuseSourceId && !reuseSource.loading && !reuseSource.error && reuseSource.data && !reuseSource.data.json?.cardFace?.artwork && <p role="status" className="cw-muted">这张卡牌还没有可复用的插画，请选择其他来源，或点击“继续制作”生成插画。</p>}{reuseSource.error && <QueryFailure key={reuseSourceId} resource={reuseSource} label="重试读取来源插画" />}</div>}
        {card.art?.provider === 'existing' && <p className="cw-muted">插画复用自 {reuseSource.data?.name ?? card.art.sourceCardId}，已保存来源与版本。</p>}
        <div className="cw-next">
          {stage === 'review' && <Button isDisabled={disabled} onPress={() => void requestArt()}>继续制作</Button>}
          {stage === 'art' && <><Button isDisabled={disabled || generating} onPress={() => void requestArt()}>{generating ? 'Codex 生图中…' : generation?.status === 'unavailable' ? '准备给 Codex 的生图任务' : generation?.status === 'failed' ? '重试 Codex 生图' : '用 Codex 生成插画'}</Button>{card.artRequest&&!generating&&<ArtworkUpload productionId={productionId} cardId={card.definition.id} disabled={busy||dirty}/>}</>}
          {stage === 'assemble' && <Button isDisabled={disabled} onPress={() => void run('assembleCardFaces')}>组装青玉与宣纸卡面</Button>}
          {stage === 'integrate' && !featureId && <label className="cw-feature">所属功能<select aria-label="所属功能" value={chosenFeatureId} onChange={event => setChosenFeatureId(event.target.value)}><option value="">选择已有功能</option>{(features.data?.items ?? []).map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select><Button size="sm" isDisabled={!chosenFeatureId || disabled} onPress={()=>void bind.mutate({productionId,projectGeneration:scopeGeneration,baseRevision,patch:{featureId:chosenFeatureId}})}>绑定功能</Button></label>}
          {stage === 'integrate' && featureId && <Button isDisabled={disabled} onPress={() => void run('integrateCard')}>建立试玩候选</Button>}
        </div>
        {card.artRequest && (stage === 'art' || stage === 'assemble') && <details className="cw-request"><summary>查看生图提示词</summary><ScrollShadow className="cw-prompt">{card.artRequest.prompt}</ScrollShadow></details>}
        {stage === 'integrate' && <p className="cw-muted">新卡的掉落、商店和初始牌组入口由游戏内容配置决定。</p>}
      </>}
      {generating && <span className="cw-muted" role="status">Codex 正在生成插画…</span>}{generation?.status === 'failed' && <p role="alert" className="cw-error">{generation.error}</p>}{busy && <span className="cw-muted" role="status">正在处理…</span>}{error && <p role="alert" className="cw-error">{error}</p>}{feedback&&<p role="status">{feedback}</p>}<MutationNotice mutation={operation}/><MutationNotice mutation={bind}/>
      {operation.status==='success'&&typeof operation.data?.handoff==='string'&&<Button variant="secondary" onPress={()=>void copyHandoff()}>复制已准备的生图任务</Button>}
      {operation.status==='success'&&operation.data?.automaticGeneration===true&&<p>Codex 正在生成插画；完成后会自动组装卡面并建立试玩候选。</p>}
      {operation.status==='success'&&operation.data?.reusedArt===true&&<p>已沿用当前插画，可以继续组装卡面。</p>}
    </div>
  </div>;
}

function ArtworkUpload({productionId,cardId,disabled}:{productionId:string;cardId:string;disabled:boolean}) {
  const {actions,useQuery,scopeGeneration}=useProductionNote();
  const source=useQuery('artworkInput',{productionId,cardId,projectGeneration:scopeGeneration});
  const save=useMutation(actions.attachCardArtwork,{draft:source,input:(value,{baseline})=>({productionId:baseline.productionId,cardId:baseline.cardId,projectGeneration:baseline.projectGeneration,artRequestId:baseline.artRequestId,baseRevision:baseline.revision,files:value.files})});
  const draft=save.draft;
  return <div className="cw-upload"><label className="cw-file-pick">选择已生成的插画<input aria-label="选择生成的插画" type="file" accept="image/png,image/jpeg,image/webp" disabled={disabled||!draft.ready||draft.locked} onChange={event=>{const files=Array.from(event.target.files??[]);if(files.length)void draft.attach('files',files,'file');event.target.value='';}}/></label><small>PNG、JPEG 或 WebP，最大 4 MiB。文件由宿主保留后再提交。</small>
    {draft.ready&&draft.value.files.map(file=><span key={file.id}>{file.name}<Button size="sm" variant="tertiary" isDisabled={draft.locked} onPress={()=>draft.set(value=>({...value,files:value.files.filter(item=>item.id!==file.id)}))}>移除</Button></span>)}
    {draft.attachments.map(job=><p key={job.id}>{job.name} · {job.status}{job.error&&<span role="alert">{job.error.message}</span>}<Button size="sm" onPress={()=>void job.retry()}>重试文件</Button><Button size="sm" onPress={()=>void job.remove()}>移除</Button></p>)}
    <Button isDisabled={disabled||!draft.ready||draft.locked||draft.value.files.length!==1} onPress={()=>void save.mutate()}>提交这张插画</Button><MutationNotice mutation={save} resetLabel="重新选择插画"/>
  </div>;
}

const STYLE = `.cw-create{display:flex;gap:12px;align-items:end;flex-wrap:wrap}.cw-create>div{flex:1;min-width:180px}.cw-feature{display:grid;gap:5px;color:var(--wb-ink-soft);font-size:12px}.cw-feature select{min-height:38px;max-width:260px;border:1px solid var(--wb-muted-light);border-radius:var(--wb-radius-small);background:var(--wb-surface);color:var(--wb-ink);padding:5px 8px}.cw-workflow{color:var(--wb-ink);background:var(--wb-surface);padding:20px;border-radius:var(--wb-radius);min-width:0}.cw-heading{display:flex;justify-content:space-between;align-items:start;gap:12px}.cw-heading h2{margin:6px 0 14px;font-size:20px}.cw-muted,.cw-preview small{color:var(--wb-muted);font-size:12px;line-height:1.65}.cw-steps{padding:0;margin:0;display:flex;gap:16px;list-style:none;flex-wrap:wrap}.cw-steps li{display:flex;align-items:center;gap:6px;font-size:12px}.cw-card-nav,.cw-actions,.cw-theme-buttons{display:flex;gap:8px;flex-wrap:wrap}.cw-card-nav{margin:18px 0}.cw-card-nav button{white-space:normal;height:auto;min-height:30px}.cw-editor{display:grid;grid-template-columns:minmax(180px,300px) minmax(0,1fr);gap:24px}.cw-preview{display:flex;flex-direction:column;align-items:center;gap:10px;min-width:0}.cw-preview-image{width:min(100%,270px);aspect-ratio:540/780;background:var(--wb-paper);display:grid;place-items:center;border-radius:10px;overflow:hidden}.cw-preview-image img{width:100%;height:100%;object-fit:contain}.cw-controls{display:flex;flex-direction:column;gap:14px;min-width:0}.cw-fields{display:grid;grid-template-columns:minmax(0,2fr) minmax(65px,1fr) minmax(65px,1fr);gap:10px}.cw-fields-single{grid-template-columns:minmax(0,1fr)}.cw-rules{line-height:1.8;margin:0;white-space:pre-wrap;font-size:13px}.cw-upload{display:flex;flex-direction:column;gap:6px;font-size:12px;max-width:100%;overflow-wrap:anywhere}.cw-upload input{max-width:100%;font-size:12px}.cw-error{color:var(--wb-danger);overflow-wrap:anywhere}.cw-prompt{max-height:160px;white-space:pre-wrap;font-size:12px;line-height:1.7;overflow-wrap:anywhere}.cw-empty{padding:30px 0;display:grid;gap:12px;justify-items:start}.cw-empty p{margin:0;color:var(--wb-muted)}@media(max-width:680px){.cw-workflow{padding:12px}.cw-editor{grid-template-columns:minmax(0,1fr)}.cw-preview-image{width:220px}.cw-fields{grid-template-columns:minmax(0,1fr) minmax(60px,.5fr) minmax(60px,.5fr)}.cw-fields-single{grid-template-columns:minmax(0,1fr)}}`;

const COMPACT_REFINEMENTS = "\n.cg-production:has(>.cw-workflow)>.cg-header{display:none}\n.cw-step-toggle{display:none}.cw-preview-identity{display:flex;align-items:baseline;justify-content:center;gap:8px;flex-wrap:wrap}.cw-preview-identity strong{font-size:15px}\n.cw-preview-image{display:block;position:relative;min-width:0;min-height:0;flex:none;overflow:visible;aspect-ratio:540/780}.cw-preview-image img{display:block;width:100%;height:auto;max-height:none;aspect-ratio:540/780;object-fit:contain;border-radius:inherit}\n@media(max-width:680px){\n .cg-production:has(>.cw-workflow){position:relative;padding:8px 12px max(144px,calc(env(safe-area-inset-bottom) + 144px));gap:6px}\n .cg-production:has(>.cw-workflow)>.cg-card-route{position:absolute;top:8px;left:12px;z-index:2}.cg-card-route .button{min-height:44px;padding-inline:0}\n .cw-workflow{padding:0}.cw-heading{padding-left:72px;min-height:44px;gap:8px}.cw-heading .cw-muted{display:none}.cw-heading h2{font-size:16px;margin:0;line-height:1.4}.cw-heading>span{flex:none;font-size:11px}\n .cw-step-toggle{display:flex;min-height:38px;margin:4px 0 8px;font-size:12px}.cw-steps:not(.is-expanded){display:none}.cw-steps.is-expanded{margin:0 0 12px;padding:0;gap:8px}\n .cw-preview-image{width:min(100%,210px)}.cw-preview{gap:8px}.cw-preview-identity strong{font-size:14px}.cw-editor{gap:14px}.cw-controls{padding:12px;gap:12px}.cw-stage-intro h3{font-size:18px}.cw-stage-intro .cw-eyebrow{display:none}\n .cw-editor.stage-integrate .cw-next{position:fixed;bottom:max(76px,calc(env(safe-area-inset-bottom) + 76px));left:12px;right:12px;z-index:5;padding:8px 0;background:var(--wb-paper);border-top:1px solid var(--wb-line-soft)}.cw-editor.stage-integrate .cw-next .button{width:100%;min-height:44px}\n}\n";

const REUSE_STYLE = `.cw-reuse{display:flex;flex-direction:column;gap:10px}.cw-reuse label{display:flex;flex-direction:column;gap:6px}.cw-reuse select{width:100%;min-height:44px;min-width:0;border:1px solid var(--wb-line);border-radius:var(--wb-radius-small);color:var(--wb-ink);background:var(--wb-surface);padding:8px}`;
