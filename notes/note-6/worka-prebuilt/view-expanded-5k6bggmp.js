import{b as Qo,d as z}from"./entry-3db3kfp6.js";import{A as F,B as Do,C as Yo,D as a,E as Co,L as B,M as Ho,N as Vo,P as mg,e as vo,m as Io,n as o,o as p,u as Q,v as qo,x as Eo,y as So,z as bo}from"./entry-arp1zbmh.js";import{$ as l,V as No}from"./entry-tpqcqsqc.js";var co=No(vo(),1);function S({mutation:w,resetLabel:I="继续编辑"}){let[$,G]=co.useState(!1),{status:U,draft:N}=w;return p("div",{"aria-live":"polite",style:{fontSize:12,color:"var(--wb-muted)",display:"grid",gap:8},children:[N&&!N.ready&&o("p",{role:"status",children:"正在恢复输入…"}),N?.ready&&N.dirty&&!N.retained&&o("p",{role:"status",children:"正在保留输入…"}),U==="pending"&&o("p",{role:"status",children:"正在处理…"}),U==="unknown"&&o("p",{role:"alert",children:"结果尚未确认，请核对原操作。"}),U==="success"&&o("p",{role:"status",children:"操作已确认。"}),w.error&&o("p",{role:"alert",children:w.error.message}),w.readError&&p("p",{role:"alert",children:["操作已确认，读取最新内容失败：",w.readError.message]}),(U==="unknown"||w.readError||N&&!N.ready&&w.error)&&o("button",{type:"button",onClick:()=>void w.retry(),children:"核对 / 重新读取"}),U==="success"&&o("button",{type:"button",disabled:!!w.readError,onClick:()=>void w.reset(),children:N?I:"清除提示"}),N?.dirty&&!N.locked&&($?p("span",{children:["放弃这份未提交输入？ ",o("button",{type:"button",onClick:()=>{w.reset().then((Y)=>{if(Y)G(!1)})},children:"确认放弃"})," ",o("button",{type:"button",onClick:()=>G(!1),children:"保留"})]}):o("button",{type:"button",onClick:()=>G(!0),children:"放弃输入"}))]})}var Ko=No(vo(),1);function Bo({onCreated:w}){let{actions:I,useQuery:$}=z(),G=$("projectChoices",{}),[U,N]=Ko.useState(!1),[Y,T]=Ko.useState(""),_=G.data?.items??[],R=B(I.createFeature,{draft:{initial:{title:"",summary:"",projectId:""}},input:(W)=>W}),C=R.draft,{title:L,summary:Z,projectId:X}=C.value,K=(W)=>C.set((y)=>({...y,projectId:W})),D=!C.ready||C.locked,n=R.error?.message??Y,c=(W)=>C.set((y)=>({...y,title:W})),u=(W)=>C.set((y)=>({...y,summary:W})),b=R.status==="success"&&R.data?.registered===!0?R.data.id:void 0;async function t(){if(!b)return;try{await w(b),T("")}catch(W){T(`需求已保存，打开失败：${W instanceof Error?W.message:String(W)}`)}}return p("div",{className:"feature-create",children:[o(Q,{variant:"secondary",onPress:()=>N((W)=>!W),children:U?"收起新需求":"新建需求"}),U&&p("section",{className:"feature-create-form","aria-label":"新建功能需求",children:[p(bo,{value:L,onChange:c,isDisabled:D,fullWidth:!0,children:[o(Do,{children:"需求名称"}),o(Eo,{placeholder:"这次想完成什么？"})]}),p(bo,{value:Z,onChange:u,isDisabled:D,fullWidth:!0,children:[o(Do,{children:"目标与验收"}),o(So,{rows:4,placeholder:"描述结果、约束和验收方式"})]}),p("div",{children:[o("p",{children:"所属项目"}),o("div",{className:"feature-project-choices",children:_.map((W)=>o(Q,{variant:X===W.id?"primary":"secondary","aria-pressed":X===W.id,onPress:()=>K(W.id),isDisabled:D,children:W.name},W.id))})]}),G.loading&&o("p",{role:"status",children:"正在读取项目…"}),G.error&&o("p",{role:"alert",children:G.error.message}),!G.loading&&!G.error&&!_.length&&o("p",{role:"alert",children:"尚未关联项目，请先在便笺对话中关联实际项目。"}),n&&o("p",{role:"alert",children:n}),o(S,{mutation:R,resetLabel:"再建需求"}),R.status==="success"&&R.data?.registered!==!0&&o("p",{role:"alert",children:"台账已返回，请核对记录是否登记成功。"}),b&&o(Q,{variant:"secondary",onPress:()=>{t()},children:"查看已创建需求"}),o(Q,{onPress:()=>void R.mutate(),isDisabled:D||!X||!L.trim()||!Z.trim(),children:D?"正在保存需求…":"创建需求"})]}),o("style",{children:".feature-create{padding:12px 20px 0}.feature-create-form{display:flex;flex-direction:column;gap:14px;padding:16px 0;max-width:720px}.feature-create-form p{margin:0 0 8px;font-size:13px}.feature-create-form [role=alert]{color:var(--wb-danger)}.feature-project-choices{display:flex;gap:8px;flex-wrap:wrap}.feature-create-form>.button{align-self:flex-start;min-height:44px}@media(max-width:680px){.feature-create{padding:12px 16px 0}.feature-create-form>.button{width:100%}}"})]})}var lo=No(vo(),1);var ho=No(vo(),1);function ko({items:w,limit:I,pending:$,busy:G,error:U,onRemove:N,onRefresh:Y,children:T}){let[_,R]=ho.useState(!1);return p("section",{"aria-label":"跨区域固定引用",style:{flexShrink:0,minWidth:0,color:"var(--wb-ink)",fontSize:12},children:[p("div",{style:{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"},children:[p(Q,{size:"sm",variant:"tertiary","aria-expanded":_,onPress:()=>R(!_),children:["固定引用 ",w.length,"/",I]}),w.some((C)=>C.warning)&&o("span",{role:"status",style:{color:"var(--wb-warning)"},children:"引用需核对"})]}),p(Ho,{open:_,onOpenChange:R,label:"固定引用",style:{width:520,maxWidth:"calc(100% - 32px)",margin:"auto",padding:20,border:0,borderRadius:"var(--wb-radius)",background:"var(--wb-paper)",color:"var(--wb-ink)",boxShadow:"var(--wb-shadow-popover)",boxSizing:"border-box"},children:[p("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12},children:[p("strong",{children:["固定引用 ",w.length,"/",I]}),o(Q,{size:"sm",variant:"tertiary",onPress:()=>R(!1),children:"关闭"})]}),o("p",{style:{color:"var(--wb-muted)"},children:"项目内共享，随下一条消息附加。"}),$&&o("p",{role:"status",children:"正在核对…"}),_&&p(qo,{style:{maxHeight:"55dvh",display:"flex",flexDirection:"column",gap:12},children:[T,!w.length&&o("span",{children:"尚无固定引用。固定不会发送消息或修改对象。"}),w.map((C)=>p("div",{style:{display:"flex",alignItems:"center",gap:8},children:[p("div",{style:{flex:1,minWidth:0,overflowWrap:"anywhere"},children:[o("strong",{children:C.label}),o("div",{style:{color:C.warning?"var(--wb-warning)":"var(--wb-muted)",marginTop:4},children:C.status})]}),o(Q,{size:"sm",variant:"tertiary",isDisabled:G,"aria-label":`移除固定引用 ${C.label}`,onPress:()=>N(C.key),children:"移除"})]},C.key)),o(Q,{size:"sm",variant:"tertiary",isDisabled:G,onPress:Y,children:"重新核对引用"})]}),U&&o("p",{role:"alert",style:{margin:"8px 0 0",overflowWrap:"anywhere"},children:U})]}),U&&!_&&o("p",{role:"alert",style:{margin:"8px 0 0",overflowWrap:"anywhere"},children:U})]})}var zo={draft:"草稿",running:"制作中","needs-input":"需要补充",failed:"制作失败",stale:"版本需核对",cancelled:"已取消",paused:"已暂停",interrupted:"制作中断",generated:"待建立候选",checking:"待试玩检查",review:"待我确认",adopted:"已加入游戏",undone:"已撤销"};function no({mode:w,metadata:I,candidateState:$,notices:G,ready:U,onEngineering:N,onDiscuss:Y,onPreview:T,onProduction:_,onCandidate:R}){let{actions:C,useQuery:L}=z(),Z=L("pinnedReferences",{},{enabled:w==="expanded"}),X=B(C.pinChangeReference,{query:Z}),K=B(C.removePinnedReference,{query:Z}),D=[X.status,K.status].some((m)=>m==="pending"||m==="unknown"),n=X.error?.message??K.error?.message,[c,u]=Qo("changes:search",""),[b,t]=Qo("changes:filter","all"),[W,y]=lo.useState(),[A,i]=lo.useState([]),[e,Uo]=lo.useState(""),[k,ro]=lo.useState(!1),[H,x]=lo.useState(),O=L("changes",{query:c,...b!=="all"?{filter:b}:{},limit:w==="compact"?3:30,...W?{cursor:W}:{}}),E=L("candidateDiff",{productionId:H?.change.productionId||"",candidateId:H?.candidateId||""},{enabled:Boolean(H)}),$o=O.data?.items??[],d=H&&$o.find((m)=>m.id===H.change.id&&m.projectId===H.change.projectId&&m.productionId===H.change.productionId&&m.featureId===H.change.featureId),J=d?.candidates.find((m)=>m.id===H?.candidateId),j=H?$(H.change,H.candidateId,H.operation):void 0,mo=!!d&&d.revision===H?.change.revision&&!!J&&(H?.operation==="undo"?J.status==="adopted":d.stage==="review"&&J.current&&J.previewVerified&&J.status==="candidate");async function Go(m){Uo("");try{await m()}catch(v){Uo(v instanceof Error?v.message:String(v))}}async function go(m){if(k)return;ro(!0);try{await Go(m)}finally{ro(!1)}}return p("section",{className:`gc-root gc-${w}`,children:[p("style",{children:[Cg,vg]}),p("header",{className:"gc-heading",children:[o(Vo,{icon:I.icon,size:20}),o("strong",{children:"改动"}),o("span",{children:O.data?`${O.data.total} 项`:"尚未读取"}),o(Q,{size:"sm",variant:"secondary",isDisabled:k,onPress:()=>Y(),children:"提出想法"}),w==="expanded"&&o(Q,{size:"sm",variant:"tertiary",onPress:()=>void Go(()=>O.refresh()),"aria-label":"刷新改动",children:"刷新"})]}),w==="expanded"&&p("div",{className:"gc-tools",children:[o(F,{"aria-label":"搜索改动",value:c,onChange:(m)=>{u(m),y(void 0),i([])},fullWidth:!0,children:p(F.Group,{children:[o(F.SearchIcon,{}),o(F.Input,{placeholder:"搜索改动"}),o(F.ClearButton,{})]})}),p(Co,{"aria-label":"筛选改动状态",value:b,onChange:(m)=>{t(String(m??"all")),y(void 0),i([])},style:{minWidth:160,flexShrink:0},children:[p(Co.Trigger,{children:[o(Co.Value,{}),o(Co.Indicator,{})]}),o(Co.Popover,{children:o(Yo,{children:Object.entries({all:"全部状态",draft:"草稿",running:"制作中",candidate:"待检查或确认",attention:"需处理",adopted:"已加入游戏",undone:"已撤销"}).map(([m,v])=>o(Yo.Item,{id:m,textValue:v,children:v},m))})})]}),o(Q,{variant:"tertiary",onPress:()=>N(),children:"工程记录"})]}),G,o(S,{mutation:X}),o(S,{mutation:K}),(O.error||e)&&o("p",{className:"gc-error",role:"alert",children:O.error?.message||e}),O.stale&&O.data&&o("span",{className:"gc-muted",children:"正在核对最新状态"}),O.loading&&o("p",{role:"status",children:"正在读取改动…"}),!O.loading&&!O.error&&!$o.length&&p("div",{className:"gc-empty",children:[o("strong",{children:c||b!=="all"?"没有匹配的改动":"还没有制作记录"}),o("p",{children:c||b!=="all"?"调整关键词或状态继续查找。":"通过便笺原生对话提出想法，生成结果后在这里查看。"})]}),o(qo,{className:"gc-list",children:$o.map((m)=>o("article",{className:"gc-item",children:w==="compact"?p("div",{className:"gc-item-heading",children:[p("div",{className:"gc-compact-meta",children:[o("small",{children:m.round?`第 ${m.round} 轮`:"制作记录"}),o("span",{className:`gc-stage gc-${m.stage}`,children:zo[m.stage]})]}),o("strong",{title:m.title,children:m.title})]}):p("details",{className:"gc-change",children:[p("summary",{className:"gc-item-heading",children:[o("strong",{title:m.title,children:m.title}),o("span",{className:`gc-stage gc-${m.stage}`,children:zo[m.stage]})]}),p("div",{className:"gc-change-body",children:[p("div",{className:"gc-meta",children:[m.round?`第 ${m.round} 轮 · `:"","需求版本 ",m.requirementRevision," · ",m.productionId]}),m.detail&&o("p",{children:m.detail}),o("div",{className:"gc-candidates",children:m.candidates.filter((v)=>v.current||v.status==="adopted").map((v)=>p("div",{className:"gc-candidate",children:[p("div",{children:[o("strong",{children:v.targetId}),p("span",{className:"gc-meta",children:["候选 ",v.commit.slice(0,8)," · ",v.status==="adopted"?"已加入":v.status==="undone"?"已撤销":v.previewVerified?"试玩检查已通过":"待试玩检查"]})]}),o(Ng,{productionId:m.productionId,candidateId:v.id}),o(Q,{size:"sm",variant:"tertiary",isDisabled:D||O.stale||!!O.error,onPress:()=>void X.mutate({productionId:m.productionId,revision:m.revision,candidateId:v.id,commit:v.commit}),children:"固定候选"}),o(Q,{size:"sm",variant:"secondary",isDisabled:k,onPress:()=>void go(()=>T(v.id,v.commit)),children:"试玩这个版本"}),m.stage==="review"&&v.status==="candidate"&&v.current&&v.previewVerified&&o(Q,{size:"sm",isDisabled:$(m,v.id,"confirm").blocked||!U||O.stale||!!O.error,onPress:()=>x({change:m,candidateId:v.id,operation:"confirm"}),children:"加入游戏"}),v.status==="adopted"&&o(Q,{size:"sm",variant:"secondary",isDisabled:$(m,v.id,"undo").blocked||!U||O.stale||!!O.error,onPress:()=>x({change:m,candidateId:v.id,operation:"undo"}),children:"撤销采用"}),$(m,v.id,v.status==="adopted"?"undo":"confirm").message&&o("p",{className:"gc-error",role:"alert",children:$(m,v.id,v.status==="adopted"?"undo":"confirm").message})]},v.id))}),p("div",{className:"gc-actions",children:[o(Q,{size:"sm",variant:"tertiary",isDisabled:D||O.stale||!!O.error,onPress:()=>void X.mutate({productionId:m.productionId,revision:m.revision}),children:"固定改动"}),o(Q,{size:"sm",variant:"secondary",isDisabled:k,onPress:()=>Y(m),children:"继续讨论"}),o(Q,{size:"sm",variant:"tertiary",isDisabled:k,onPress:()=>void go(()=>_(m)),children:"查看制作过程"}),m.featureId&&o(Q,{size:"sm",variant:"tertiary",onPress:()=>N(m.featureId),children:"功能与采用记录"})]})]})]})},`${m.projectId}:${m.id}`))}),w==="expanded"&&p("footer",{className:"gc-pagination",children:[o(Q,{size:"sm",variant:"tertiary",isDisabled:!A.length,onPress:()=>{y(A.at(-1)),i(A.slice(0,-1))},children:"上一页"}),p("span",{children:["第 ",A.length+1," 页"]}),o(Q,{size:"sm",variant:"tertiary",isDisabled:!O.data?.nextCursor||O.stale,onPress:()=>{i([...A,W]),y(O.data?.nextCursor)},children:"下一页"})]}),o("footer",{className:"gc-reference-tools",children:w==="expanded"&&o(ko,{items:(Z.data?.items??[]).map((m)=>({key:m.key,label:`${m.title}${m.anchor?` / ${m.anchor}`:""}`,warning:m.freshness!=="current",status:`${m.revision.slice(0,12)} · ${m.freshness==="current"?m.kind==="battleComparison"?"历史报告一致，不代表当前项目":"版本一致":m.freshness==="stale"?"版本已变化，需移除后重新固定":"无法读取或定位"}`})),limit:Z.data?.limit??8,pending:Z.loading||Z.stale,busy:D,error:n||Z.error?.message,onRemove:(m)=>void K.mutate({key:m}),onRefresh:()=>void Go(()=>Z.refresh()),children:o("span",{children:"使用下方“固定改动”或“固定候选”，不会发送消息或采用候选。"})})}),o(Ho,{open:!!H,label:H?.operation==="undo"?"撤销采用":"确认加入游戏",onOpenChange:(m)=>{if(!m&&!j?.pending)x(void 0)},children:p("div",{className:"gc-confirm",children:[o("h2",{children:H?.operation==="undo"?"撤销这次采用？":"加入游戏？"}),o("p",{children:H?.change.title}),p("p",{children:["候选 ",J?.commit.slice(0,8)," · ",J?.targetId]}),o("p",{children:H?.operation==="undo"?"将检查采用后的修改；存在冲突时保留当前内容并说明原因。":"仅将这个候选及其依赖加入正式游戏。试玩检查不代表已经完成人工体验。"}),E.loading&&o("p",{role:"status",children:"正在核对候选差异…"}),E.error&&o("p",{role:"alert",children:E.error.message}),E.data&&o(uo,{diff:E.data}),!mo&&o("p",{className:"gc-error",children:"记录已变化，请关闭并核对当前候选。"}),j?.message&&o("p",{className:"gc-error",role:"alert",children:j.message}),p("div",{className:"gc-actions",children:[o(Q,{variant:"secondary",isDisabled:j?.pending,onPress:()=>x(void 0),children:"取消"}),o(Q,{isDisabled:j?.blocked||!U||!mo||O.stale||!!O.error||H?.operation==="confirm"&&(!E.data?.baseCurrent||E.stale||!!E.error),onPress:()=>{if(H&&mo)R(H.change,H.candidateId,H.operation)},children:j?.pending?"正在处理…":H?.operation==="undo"?"确认撤销":"确认加入"})]})]})})]})}function Ng({productionId:w,candidateId:I}){let[$,G]=lo.useState(!1),{useQuery:U}=z(),N=U("candidateDiff",{productionId:w,candidateId:I},{enabled:$});return p("div",{className:"gc-diff",children:[o(Q,{size:"sm",variant:"tertiary",onPress:()=>G(!$),children:$?"收起差异":"查看差异"}),$&&p(Io,{children:[N.loading&&o("p",{role:"status",children:"正在读取差异…"}),N.error&&o("p",{role:"alert",children:N.error.message}),N.data&&o(uo,{diff:N.data})]})]})}function uo({diff:w}){return p("div",{className:"gc-diff-files",children:[o("p",{children:w.comparison==="adoption-record"?"采用时的历史差异":w.baseCurrent?"当前正式内容 → 所选候选":"正式基线已变化，需重新建立候选"}),o(qo,{style:{maxHeight:320},children:w.files.filter((I)=>I.changed).map((I)=>p("details",{children:[p("summary",{children:[I.path," · ",I.beforeBytes," → ",I.afterBytes," 字节"]}),I.binary?o("p",{children:"二进制资源发生变化，请在对应资源视图核对。"}):I.truncated?o("p",{children:"文件较大，请在制作记录中查看完整内容。"}):p("div",{className:"gc-diff-columns",children:[p("div",{children:[o("strong",{children:"变更前"}),o("pre",{children:I.before??"文件不存在"})]}),p("div",{children:[o("strong",{children:"变更后"}),o("pre",{children:I.after??"文件不存在"})]})]})]},I.path))})]})}var vg=".gc-compact .gc-item{box-sizing:border-box;padding:12px;margin-bottom:10px;border-radius:10px;background:var(--wb-surface)}.gc-compact .gc-item:first-child{padding-top:12px}.gc-compact .gc-item-heading{flex-direction:column;align-items:stretch;gap:8px;min-width:0}.gc-compact .gc-item-heading>strong{width:100%;max-width:100%;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;white-space:normal;overflow:hidden;line-height:1.6}.gc-compact-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--wb-muted);font-size:11px}.gc-compact .gc-stage{padding:2px 7px;background:var(--wb-surface-deep);border-radius:999px}.gc-compact .gc-list{overflow-x:hidden}",Cg='.gc-reference-tools{display:flex;justify-content:flex-end;flex-shrink:0}.gc-change>summary{cursor:pointer;min-height:44px;align-items:center}.gc-change>summary::before{content:"›";color:var(--wb-muted)}.gc-change[open]>summary::before{content:"⌄"}.gc-change>summary>strong{flex:1}.gc-change:not([open])>summary>strong{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.gc-change>summary:focus-visible{outline:2px solid var(--wb-accent);outline-offset:3px}.gc-change-body{padding-top:12px}.gc-change-body>p{white-space:pre-wrap;overflow-wrap:anywhere}.gc-heading{flex-wrap:wrap}.gc-diff{flex-basis:100%;min-width:0}.gc-diff-files{font-size:12px;overflow-wrap:anywhere}.gc-diff-files details{padding:8px 0}.gc-diff-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.gc-diff-columns pre{white-space:pre-wrap;overflow-wrap:anywhere}.gc-diff-columns>div{min-width:0}@media(max-width:520px){.gc-diff-columns{grid-template-columns:minmax(0,1fr)}}.gc-root{box-sizing:border-box;height:100dvh;display:flex;flex-direction:column;gap:16px;padding:20px;background:var(--wb-paper);color:var(--wb-ink);font-family:var(--wb-font-family);font-size:14px;min-width:0}.gc-heading,.gc-tools,.gc-actions,.gc-pagination{display:flex;align-items:center;gap:10px}.gc-heading>strong{font-size:18px}.gc-heading>span{color:var(--wb-muted);flex:1}.gc-tools>*{min-width:0}.gc-tools>button{flex-shrink:0}.gc-list{flex:1;min-height:0;min-width:0}.gc-item{padding:16px 0}.gc-item:first-child{padding-top:0}.gc-item-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.gc-item-heading>strong{min-width:0;overflow-wrap:anywhere}.gc-stage{font-size:12px;flex-shrink:0;color:var(--wb-muted)}.gc-review{color:var(--wb-accent)}.gc-failed,.gc-error{color:var(--wb-danger)}.gc-adopted{color:var(--wb-success)}.gc-running,.gc-needs-input,.gc-stale{color:var(--wb-warning)}.gc-meta,.gc-muted{display:block;font-size:12px;color:var(--wb-muted);overflow-wrap:anywhere;margin:5px 0}.gc-candidates{display:grid;gap:10px;margin:12px 0}.gc-candidate{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px;background:var(--wb-surface);border-radius:var(--wb-radius-small)}.gc-candidate>div{flex:1;min-width:120px}.gc-candidate>.gc-diff{flex:1 0 100%;min-width:0}.gc-candidate>p{flex-basis:100%;margin:0}.gc-actions{flex-wrap:wrap}.gc-pagination{justify-content:space-between;color:var(--wb-muted)}.gc-confirm{padding:20px;max-width:520px;overflow-wrap:anywhere}.gc-confirm h2{font-size:18px}.gc-empty p{color:var(--wb-muted)}.gc-error{overflow-wrap:anywhere;margin:0}.gc-compact{padding:14px;gap:10px;font-size:12px}.gc-compact .gc-heading>strong{font-size:14px}.gc-compact .gc-item{padding:7px 0}.gc-compact .gc-item-heading>strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gc-compact .gc-stage{font-size:11px}@media(max-width:520px){.gc-expanded{padding:14px}.gc-reference-tools{justify-content:flex-start}.gc-item-heading{flex-direction:column;gap:4px}.gc-tools{flex-wrap:wrap}.gc-candidate{align-items:flex-start}}';var h=No(vo(),1);var io=No(vo(),1);function ao(){let w=z();return io.useMemo(()=>({note:{id:w.metadata.id},resources:w.host.resources,resolvePreviewUrl:w.host.resolvePreviewUrl}),[w.metadata.id,w.host.resources,w.host.resolvePreviewUrl])}var $g=l.object({repo:l.string(),branches:l.array(l.string())}),Gg=l.looseObject({id:l.string(),title:l.string(),summary:l.string(),next:l.string(),body:l.string(),links:l.array($g)}),Rg=l.looseObject({id:l.string(),revision:l.string().nullable(),record:Gg.nullable(),registered:l.boolean().optional(),changed:l.boolean().optional()}),Bl=Rg.extend({context:l.looseObject({plugin:l.string(),home:l.string(),guide:l.string(),cli:l.string()}),existingFeatures:l.array(l.object({id:l.string(),title:l.string(),summary:l.string().optional(),links:l.array(l.object({repo:l.string(),repository:l.string().optional(),branches:l.array(l.string())}))}))}),qg=l.object({noteId:l.string().optional(),delegationId:l.string().optional()}),xo=l.object({file:l.string(),error:l.string()}),jo=l.object({id:l.string(),title:l.string(),summary:l.string().optional(),next:l.string().optional(),archived:l.boolean(),totalPrs:l.number(),mergedPrs:l.number(),execution:qg.optional()}),hl=l.looseObject({serverUrl:l.string(),status:l.enum(["error","running","syncing"]),totalCount:l.number(),activeCount:l.number(),archivedCount:l.number(),errors:l.array(xo),features:l.array(jo.extend({links:l.array(l.object({repo:l.string(),repoName:l.string()}))}))}),To=l.object({label:l.string(),tone:l.string(),stale:l.boolean().optional()}),to=l.object({url:l.string(),label:l.string(),title:l.string(),tone:l.string().optional()}),eo=l.object({number:l.number(),url:l.string(),label:l.string(),state:l.string().optional(),title:l.string(),tone:l.string().optional()}),so=l.looseObject({id:l.string(),projectId:l.string(),productionId:l.string(),cardId:l.string().optional(),featureId:l.string(),kind:l.enum(["card","story","documents","deck"]).optional(),targetId:l.string().optional(),candidateHash:l.string().optional(),targetBaseRevision:l.string().optional(),validationManifest:l.string().optional(),commit:l.string().optional(),status:l.enum(["candidate","adopted","undone"]),previewVerified:l.boolean().optional(),adoptedAt:l.string().optional(),undoneAt:l.string().optional(),adoptionId:l.string().optional()}),kl=l.object({serverUrl:l.string(),status:l.enum(["error","running","syncing"]),totalCount:l.number(),activeCount:l.number(),archivedCount:l.number(),errors:l.array(xo),features:l.array(jo.extend({body:l.string().optional(),createdAt:l.string().optional(),autoArchived:l.boolean(),gameCandidates:l.array(so),links:l.array(l.object({repo:l.string(),repoName:l.string(),repoNameShort:l.string(),url:l.string().optional(),trackingLabel:l.string().optional(),mappingIssue:l.string().optional(),branches:l.array(l.string()),allPrs:l.array(eo.extend({branch:l.string()})),envBranches:l.record(l.string(),l.object({branch:l.string(),merge:To,ci:To,deploy:To,prs:l.array(eo),ciLinks:l.array(to),deploymentLinks:l.array(to)}))}))}))}),Oo=l.string().trim().min(1),Jo=l.string().regex(/^[a-f\d]{64}$/i),og=l.object({projectId:Oo,productionId:Oo,candidateId:Oo,featureId:Oo,candidateHash:Jo,targetBaseRevision:Jo,validationManifest:Jo}),dl=l.object({candidate:so,production:l.looseObject({id:l.string(),projectId:l.string(),revision:l.number()}).optional(),adoptionId:l.string().optional(),reused:l.boolean().optional()});var Mo=(w)=>og.safeParse({...w,candidateId:w.id}),po=(w)=>{let I=Mo(w);return!I.success?I.error.message:w.status==="adopted"&&!w.adoptionId?"缺少采用记录，无法撤销":""};var gg=(w)=>w.kind==="deck"?`牌组 ${w.targetId}`:w.kind==="story"?`剧情 ${w.targetId}`:w.kind==="documents"?`资料 ${w.targetId}`:`卡牌 ${w.cardId}`,Lo=["dev","pre","main"];function Qg(w,I){let $=[],G=new Set;for(let N of w.links??[]){let Y=Lo.map((R)=>N.envBranches?.[R]?.branch||R),T=new Map;Y.forEach((R,C)=>{if(!T.has(R))T.set(R,C)});let _=(R)=>{if(!R.url||R.state==="merged")return;let C=JSON.stringify([N.repo,R.url]);if(G.has(C))return;G.add(C),$.push(R.url)};if(I==="all"){let R=[...N.allPrs??[]].sort((C,L)=>{let Z=C.branch||"未知分支",X=L.branch||"未知分支";return(T.get(Z)??Lo.length)-(T.get(X)??Lo.length)||Z.localeCompare(X)||(C.number??0)-(L.number??0)});for(let C of R)_(C)}else{let R=N.envBranches?.[I];for(let C of R?.prs??[])_(C)}}let U=[`Feature 内容
${w.title}`];return U.push(`PR 链接：
${$.length?$.join(`
`):"无该范围内的 PR"}`),{text:U.join(`

`),count:$.length}}function lg({compact:w=!1}){let{useQuery:I}=z(),$=I("diagnostics",{}),G=Object.entries($.data?.ci??{}).filter(([,U])=>U.error);if(w){if(G.length)return p("span",{className:"compact-diagnostic",title:"展开卡片查看 CI 查询详情",children:["CI 异常 · ",G.length]});return $.data?.syncing?o("span",{className:"compact-diagnostic",role:"status",children:"后台同步中"}):null}if(!G.length)return $.data?.syncing?o("span",{role:"status",children:"后台同步中…"}):null;return p("details",{style:{padding:"8px 12px",maxHeight:220,overflow:"auto"},children:[p("summary",{children:["CI 查询失败：",G.length," 项"]}),G.map(([U,N])=>p("p",{children:[N.stage," / ",N.category||N.error," · 上次成功：",N.checkedAt?new Date(N.checkedAt).toLocaleString():"尚无"," · 下一次重试：",N.retryAt?new Date(N.retryAt).toLocaleString():"待调度"]},U))]})}function pg({icon:w}){return o("span",{className:"brand-logo","aria-hidden":"true",children:o(Vo,{icon:w,size:13})})}function Ug(){let{mode:w,metadata:I,config:$,actions:G,useQuery:U,host:N}=z(),Y=ao(),[T,_]=h.useState(!1),R=$?.presentation==="changes"&&!T,C=U("view",{},{enabled:w==="expanded"}),L=U("summary",{},{enabled:w==="compact"}),Z=w==="compact"?L:C,X=Z.data,K=B(G.refresh,{query:C}),D=B(G.setArchiveStatus,{query:C}),n=B(G.confirmGameCandidate,{query:C}),c=B(G.undoGameCandidate,{query:C}),u=B(G.discussChange),b=K.status==="pending"||K.status==="unknown",[t,W]=h.useState(""),[y,A]=h.useState("all"),[i,e]=Qo("tracker:search",""),[Uo,k]=h.useState({}),[ro,H]=h.useState(!1),[x,O]=h.useState({}),E=()=>K.mutate({}),$o=async(g,P)=>{let{text:V,count:q}=Qg(g,P);try{await N.copyText(V),O((r)=>({...r,[g.id]:{message:q?`已复制 ${q} 个 PR`:"已复制文案（无 PR）",error:!1}}))}catch(r){console.error(r),O((M)=>({...M,[g.id]:{message:"复制失败，请重试",error:!0}}))}},d=async(g,P)=>{W("");let V=g?.execution;try{let q=V?.delegationId,r=V?.noteId,M=await Y.resources.read({name:"connectedNodes",input:{}});if(M.error)throw Error(M.error);let f=[...new Set((M.data??[]).flatMap((Ro)=>Ro.nodes.filter((oo)=>oo.queries.includes("progress")).map((oo)=>oo.noteId)))];if(!r&&g){let Ro=await Y.resources.read({name:"relatedObjects",input:{}});if(Ro.error)throw Error(Ro.error);let oo=[...new Set((Ro.data??[]).filter((Po)=>Po.source.objectId===g.id&&f.includes(Po.target.noteId)).map((Po)=>JSON.stringify(Po.target)))].map((Po)=>JSON.parse(Po));if(oo.length>1){W("该功能关联多个执行任务，请在执行台核对。");return}if(oo.length===1)r=oo[0].noteId,q=oo[0].objectId}if(!r&&f.length===1)r=f[0];if(r)await N.openNote(r,q);else W("没有唯一的关联执行台，请先检查连线。")}catch(q){let r=q instanceof Error?q.message:String(q);W(r),console.error(q)}},J=(g)=>g==="pending"||g==="unknown",j=(g)=>D.mutate({id:g.id,archived:!g.archived}),mo=(g)=>J(D.status),Go=(g)=>k((P)=>({...P,[g]:!P[g]})),go=(g,P)=>Boolean(po(g))||(P==="confirm"?g.status!=="candidate"||!g.previewVerified:g.status!=="adopted")||J(n.status)||J(c.status),m=(g,P)=>{if(go(g,P))return;let V=Mo(g);if(!V.success||P==="undo"&&!g.adoptionId)return;if(k((q)=>({...q,[g.featureId]:!0})),P==="confirm")n.mutate(V.data);else c.mutate({...V.data,adoptionId:g.adoptionId})},v=C.data?.features??[],s=X?.errors??[],Xo=h.useMemo(()=>v.filter((g)=>!g.archived),[v]),wg=(L.data?.features??[]).filter((g)=>!g.archived),Wo=X?.activeCount??Xo.length,Zo=h.useMemo(()=>v.filter((g)=>g.archived),[v]),wo=D.status==="success"?D.data:void 0,Ao=p(Io,{children:[o(S,{mutation:D}),o(S,{mutation:n}),o(S,{mutation:c}),o(S,{mutation:K}),o(S,{mutation:u}),wo&&!wo.receiptVerified&&o("p",{role:"alert",children:"归档请求已返回，但台账修订未核对，请查看当前记录。"}),wo&&(wo.event.status==="failed"||wo.event.status==="unconfirmed")&&p("p",{role:"alert",children:["归档已保存，通知状态：",wo.event.error.message]}),u.status==="success"&&u.data!==void 0&&o(Q,{onPress:()=>void N.openSession(u.data.sessionId).catch((g)=>W(g instanceof Error?g.message:String(g))),children:"打开已准备的讨论会话"})]}),Pg=(g,P,V)=>{let q=v.flatMap((r)=>r.gameCandidates).find((r)=>r.id===P&&r.productionId===g.productionId&&r.projectId===g.projectId&&r.featureId===g.featureId);return{blocked:!q||go(q,V),pending:J(n.status)||J(c.status),message:q?po(q)||"":"候选信息已变化，请刷新后重新选择"}},fo=h.useMemo(()=>{let g=v;if(y==="archived")g=Zo;else if(g=Xo,y==="has-links")g=g.filter((P)=>P.links&&P.links.length>0);else if(y==="pending")g=g.filter((P)=>P.links.some((V)=>["dev","pre","main"].some((q)=>V.envBranches[q]?.merge?.tone==="pending")));else if(y==="merged")g=g.filter((P)=>P.links.length>0&&P.totalPrs>0&&P.mergedPrs===P.totalPrs);if(i.trim()){let P=i.trim().toLowerCase();g=g.filter((V)=>V.title.toLowerCase().includes(P)||(V.summary??"").toLowerCase().includes(P)||V.id.toLowerCase().includes(P)||(V.next??"").toLowerCase().includes(P)||V.links.some((q)=>q.repoName.toLowerCase().includes(P)))}return g},[v,Xo,Zo,y,i]),Fo=(g)=>{if(!g.links||g.links.length===0)return o("span",{className:"badge-overall muted",children:"尚未关联项目"});if(g.totalPrs>0&&g.mergedPrs===g.totalPrs)return p("span",{className:"badge-overall ok",children:["✓ 全部合并 (",g.mergedPrs,"/",g.totalPrs,")"]});if(g.mergedPrs>0)return p("span",{className:"badge-overall pending",children:["部分合并 (",g.mergedPrs,"/",g.totalPrs,")"]});if(g.totalPrs>0)return p("span",{className:"badge-overall pending",children:["待合并 (",g.totalPrs," PR)"]});return o("span",{className:"badge-overall muted",children:"未登记 PR"})},yo=(g)=>{if(!g||g.length===0)return null;return g.map((P,V)=>{let q=P.tone?` tone-${P.tone}`:"";return o("a",{href:P.url,target:"_blank",rel:"noopener noreferrer",className:`chip-link${q}`,title:P.title,children:P.label??String(V+1)},V)})},_o=(g,P,V)=>{if(P?.hidden)return null;let q=P?.tone||"muted",r=P?.label||"未知",M=Boolean(P?.stale),f=q==="ok"?"✓ ":"";return p("div",{className:"stage-row",children:[o("span",{className:"stage-name",children:g}),p("div",{className:"stage-chip",children:[p("span",{className:`chip-status tone-${q}`,children:[f,r,M?" · 缓存":""]}),V]})]})};if(R)return o(no,{mode:w,metadata:I,candidateState:Pg,notices:Ao,ready:!Z.stale&&!Z.error,onDiscuss:(g)=>{u.mutate(g?{productionId:g.productionId}:{})},onPreview:async(g,P)=>{if(!$?.notes?.preview)throw Error("尚未关联试玩便笺，请配置项目便笺关系");await N.openNote($.notes.preview,`cg:${encodeURIComponent(JSON.stringify({kind:"preview",id:g,revision:P}))}`)},onEngineering:(g)=>{if(_(!0),e(g??""),g)k((P)=>({...P,[g]:!0}))},onProduction:async(g)=>{if(!$?.notes?.production)throw Error("尚未关联制作便笺，请配置项目便笺关系");await N.openNote($.notes.production,`cg:${encodeURIComponent(JSON.stringify({projectId:g.projectId,kind:"production",id:g.productionId}))}`)},onCandidate:(g,P,V)=>{let q=v.flatMap((r)=>r.gameCandidates??[]).find((r)=>r.id===P&&r.productionId===g.productionId&&r.projectId===g.projectId&&r.featureId===g.featureId);if(!q)throw Error("候选信息已变化，请刷新后重新选择");return m(q,V)}});if(w==="compact")return p("section",{className:"ft-widget compact",children:[o("style",{children:rg}),p("header",{className:"navbar-compact",children:[p("div",{className:"brand-box",children:[o(pg,{icon:I.icon}),o("span",{className:"brand-title",children:I.name}),p("span",{className:"brand-count",children:[Wo," 个功能"]})]}),p("div",{className:"navbar-actions",children:[$?.presentation==="changes"&&o(Q,{size:"sm",variant:"tertiary",onPress:()=>{_(!1),e("")},children:"返回改动"}),p("span",{className:"sync-box",children:[o("span",{className:`dot ${b?"busy":""}`}),b?"同步中...":"在线"]}),o("button",{className:"btn-compact-refresh",disabled:b,onClick:()=>void E(),"aria-label":"刷新功能进展",title:"刷新功能进展",children:o("svg",{className:`refresh-spin ${b?"is-spinning":""}`,width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:o("path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16m0 0h5m-5 0v5M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8m0 0h-5m5 0V3"})})})]})]}),p("div",{className:"compact-card-list",children:[wg.slice(0,3).map((g)=>o("article",{className:"feature-card-compact",children:o("div",{className:"compact-feature-card-head",children:p("div",{className:"card-header-compact",children:[p("div",{className:"compact-feature-title-row",children:[o("span",{className:"feature-title",style:{fontSize:"14px"},title:g.title,children:g.title}),o("button",{type:"button",className:"btn-compact-feature-execution",onClick:()=>void d(g),"aria-label":`打开「${g.title}」对应的执行台任务`,title:"打开该功能对应的执行台任务",children:"↗"})]}),p("div",{className:"compact-feature-meta",children:[Fo(g),g.summary&&o("div",{className:"feature-summary",title:g.summary,children:g.summary})]})]})})},g.id)),Wo>3&&p("div",{className:"compact-more",children:["还有 ",Wo-3," 个功能，展开查看完整矩阵 ↗"]})]}),p("footer",{className:"compact-footer",children:[p("div",{className:"compact-footer-status",children:[o(lg,{compact:!0}),o("span",{className:`compact-ledger-status${s.length>0?" is-warning":Z.error||X?.status==="error"?" is-failed":""}`,title:s.length>0?`台账 ${s.length} 条记录无法解析，其他记录仍可操作`:Z.error||X?.status==="error"?"状态同步暂不可用":"功能进展自动同步",children:s.length>0?`台账异常 · ${s.length}`:Z.error||X?.status==="error"?"同步异常":"自动同步"})]}),p("div",{className:"compact-footer-actions",children:[o("button",{type:"button",className:"btn-compact-execution",onClick:()=>void d(),title:"打开执行台总览",children:"执行台总览 ↗"}),o("a",{href:X?.serverUrl||"http://127.0.0.1:47831",target:"_blank",rel:"noopener noreferrer",style:{color:"var(--link)",fontWeight:550},children:"独立看板 ↗"})]}),K.error&&p("span",{role:"alert",children:["刷新未完成：",K.error.message]}),t&&p("span",{className:"navigation-error",role:"alert",children:["执行台打开失败：",t]})]})]});return p("section",{className:"ft-widget expanded",children:[o(lg,{}),o("style",{children:rg}),o(Bo,{onCreated:(g)=>{A("all"),e(""),k((P)=>({...P,[g]:!0}))}}),o("header",{className:"navbar",children:p("div",{className:"navbar-inner",children:[p("div",{className:"brand-box",children:[o(pg,{icon:I.icon}),o("span",{className:"brand-title",children:I.name}),p("span",{className:"brand-count",children:[Wo," 个功能"]})]}),p("div",{className:"navbar-actions",children:[o(F,{"aria-label":"搜索功能或仓库",value:i,onChange:e,fullWidth:!0,className:"search-box",children:p(F.Group,{children:[o(F.SearchIcon,{}),o(F.Input,{placeholder:"搜索功能或仓库…"}),o(F.ClearButton,{"aria-label":"清空搜索"})]})}),$?.presentation==="changes"&&o(Q,{size:"sm",variant:"tertiary",onPress:()=>{_(!1),e("")},children:"返回改动"}),p("span",{className:"sync-box",title:"后台自动同步，数据变化时更新",children:[o("span",{className:`dot ${b||X?.status==="syncing"?"busy":X?.status==="error"?"error":""}`}),b?"同步中...":X?.status==="syncing"?"后台同步中...":X?.status==="error"?"查询异常":"已就绪"]}),o("button",{className:"btn-nav",disabled:b,onClick:()=>void E(),children:"↻ 刷新"}),o("button",{type:"button",className:"btn-nav btn-execution",onClick:()=>void d(),title:"打开执行台总览",children:"对应任务 ↗"}),o("a",{href:X?.serverUrl||"http://127.0.0.1:47831",target:"_blank",rel:"noopener noreferrer",className:"btn-nav",title:"在新标签页打开独立看板",children:"独立页面 ↗"})]})]})}),t&&p("div",{className:"navigation-error expanded-navigation-error",role:"alert",children:["执行台打开失败：",t]}),s.length>0&&p("div",{className:"alert-box ledger-alert",role:"alert",children:[p("strong",{children:["台账有 ",s.length," 条记录无法解析，这些记录暂不可操作，其他记录可正常归档 / 恢复。"]}),o("ul",{className:"alert-list",children:s.map((g)=>p("li",{children:[o("code",{children:g.file.split("/").pop()||g.file})," — ",g.error]},g.file))}),o("span",{className:"alert-hint",children:"请按每条记录的具体错误修复，修复后自动恢复显示，无需重启。"})]}),K.error&&p("p",{role:"alert",children:["刷新未完成：",K.error.message]}),Ao,p("div",{className:"toolbar-strip",children:[p("div",{className:"segmented-control",children:[o("button",{className:`segment-tab ${y==="all"?"active":""}`,onClick:()=>A("all"),children:"全部"}),o("button",{className:`segment-tab ${y==="has-links"?"active":""}`,onClick:()=>A("has-links"),children:"有关联项目"}),o("button",{className:`segment-tab ${y==="pending"?"active":""}`,onClick:()=>A("pending"),children:"进行中"}),o("button",{className:`segment-tab ${y==="merged"?"active":""}`,onClick:()=>A("merged"),children:"已合并"}),p("button",{className:`segment-tab ${y==="archived"?"active":""}`,onClick:()=>A("archived"),children:["已归档 (",Zo.length,")"]})]}),o("button",{className:"btn-nav",onClick:()=>H(!ro),children:ro?"展开全部":"折叠全部"})]}),p("div",{className:"feature-feed",children:[fo.map((g)=>{let P=g.links&&g.links.length>0,V=Boolean(g.body&&g.body.trim()),q=Boolean(Uo[g.id]);return p("article",{className:"feature-card",children:[p("header",{className:"card-header",children:[p("div",{className:"card-header-main",children:[p("div",{className:"feature-title-row",children:[o("h2",{className:"feature-title",children:g.title}),Fo(g)]}),g.summary&&o("div",{className:"feature-summary",children:g.summary}),!!g.gameCandidates?.length&&p("div",{className:"feature-summary",children:["游戏创作：",g.gameCandidates.filter((r)=>r.status==="candidate").length," 个试玩候选 · ",g.gameCandidates.filter((r)=>r.status==="adopted").length," 个已采用"]}),p("div",{className:"feature-meta-bar",children:[o("span",{children:"首次记录于 12 小时前"}),g.next&&p(Io,{children:[o("span",{className:"meta-dot",children:"·"}),p("span",{children:[o("b",{children:"下一步："}),g.next]})]}),(V||Boolean(g.gameCandidates?.length))&&p(Io,{children:[o("span",{className:"meta-dot",children:"·"}),o("button",{className:"btn-doc-toggle",onClick:()=>Go(g.id),children:q?"收起决策与记录 ▴":"查看决策与记录 ▾"})]})]})]}),p("div",{className:"card-header-actions",children:[p(a,{children:[p(a.Trigger,{className:"copy-trigger","aria-label":`复制「${g.title}」的功能内容与 PR 链接`,children:["复制文案 ",o("span",{"aria-hidden":"true",children:"▾"})]}),o(a.Popover,{placement:"bottom end",children:p(a.Menu,{"aria-label":`选择「${g.title}」的 PR 范围`,onAction:(r)=>void $o(g,String(r)),children:[o(a.Item,{id:"dev",children:"全部 dev"}),o(a.Item,{id:"pre",children:"全部 pre"}),o(a.Item,{id:"main",children:"全部 main"}),o(a.Item,{id:"all",children:"全部分支"})]})})]}),x[g.id]&&o("span",{className:`copy-feedback${x[g.id].error?" is-error":""}`,role:"status",children:x[g.id].message}),o("button",{type:"button",className:"btn-nav btn-execution",onClick:()=>void d(g),title:"打开该功能对应的执行台任务",children:"对应任务 ↗"}),g.autoArchived?o("span",{className:"badge-auto-archived",title:"关联 PR 已合并且各环境部署完成，按交付状态自动归档；交付状态回退时会自动回到进行中，因此没有手动恢复",children:"自动归档"}):o("button",{type:"button",className:"btn-nav",disabled:mo(g.id),onClick:()=>void j(g),title:g.archived?"恢复为进行中":"归档该功能",children:mo(g.id)?D.status==="pending"?"处理中…":"待核实":g.archived?"恢复":"归档"})]})]}),!ro&&p("div",{className:"card-body-content",children:[!!g.gameCandidates?.length&&o("div",{className:"ft-candidates","aria-label":"游戏候选",children:g.gameCandidates.filter((r)=>r.status==="candidate").map((r)=>p("div",{className:"ft-candidate",children:[p("span",{children:[gg(r)," · 版本 ",r.commit?.slice(0,8)??"未记录"]}),o("span",{children:r.previewVerified?"试玩检查已通过":"等待试玩检查"}),r.previewVerified&&o("button",{className:"btn-nav",disabled:go(r,"confirm"),onClick:()=>void m(r,"confirm"),children:"加入我的游戏"}),po(r)&&o("span",{role:"alert",children:po(r)})]},r.id))}),P?o("div",{className:"table-scroll",children:p("table",{className:"matrix-table",children:[o("thead",{children:p("tr",{children:[o("th",{className:"col-project",children:"项目 / 仓库"}),o("th",{className:"col-env",children:p("span",{className:"env-header-badge",children:[o("span",{className:"env-dot dev"}),"DEV"]})}),o("th",{className:"col-env",children:p("span",{className:"env-header-badge",children:[o("span",{className:"env-dot pre"}),"PRE"]})}),o("th",{className:"col-env",children:p("span",{className:"env-header-badge",children:[o("span",{className:"env-dot prod"}),"MAIN"]})})]})}),o("tbody",{children:g.links.map((r)=>p("tr",{children:[o("td",{children:p("div",{className:"project-cell",children:[r.url?p("a",{href:r.url,target:"_blank",rel:"noopener noreferrer",className:"project-name-link",children:[o("span",{children:r.repoNameShort}),p("svg",{width:"10",height:"10",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[o("line",{x1:"7",y1:"17",x2:"17",y2:"7"}),o("polyline",{points:"7 7 17 7 17 17"})]})]}):o("span",{className:"project-name-link",children:r.repoNameShort}),r.mappingIssue&&o("div",{role:"status",children:r.mappingIssue}),r.trackingLabel&&!r.mappingIssue&&o("div",{children:r.trackingLabel}),o("div",{className:"project-repo-path",children:r.repoName}),r.branches&&r.branches.length>0&&o("div",{className:"branch-pills",children:r.branches.map((M)=>o("span",{className:"branch-tag",children:M},M))}),o("button",{type:"button",className:"project-execution-link",onClick:()=>void d(g,r),title:`在执行台打开 ${r.repoNameShort} 对应任务`,children:"执行台项目 ↗"})]})}),["dev","pre","main"].map((M)=>{let f=r.envBranches[M];return o("td",{className:"cell-env",children:p("div",{className:"stage-stack",children:[_o("合并",f?.merge,yo(f?.prs)),_o("CI",f?.ci,yo(f?.ciLinks)),_o("部署",f?.deploy,yo(f?.deploymentLinks))]})},M)})]},r.repo))})]})}):p("div",{className:"empty-links-box",children:[p("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2",children:[o("circle",{cx:"12",cy:"12",r:"10"}),o("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),o("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),o("span",{children:"尚未关联代码仓库 · 当前仅记录技术目标与方案决策"})]}),(V||Boolean(g.gameCandidates?.length))&&q&&p("div",{className:"doc-panel",children:[g.body,g.gameCandidates?.filter((r)=>r.status!=="candidate").map((r)=>p("div",{className:"ft-adoption-record",children:[p("span",{children:[gg(r)," · ",r.status==="adopted"?`已采用于 ${r.adoptedAt??""}`:`已撤销于 ${r.undoneAt??""}`," · 候选 ",r.commit?.slice(0,8)??"未记录"]}),r.status==="adopted"&&o("button",{className:"btn-nav",disabled:go(r,"undo"),onClick:()=>void m(r,"undo"),children:"撤销采用"}),po(r)&&o("span",{role:"alert",children:po(r)})]},r.id))]})]})]},g.id)}),fo.length===0&&o("div",{className:"empty-feed",children:"没有匹配的功能记录"})]})]})}var rg=`
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "PingFang SC", "Helvetica Neue", "Segoe UI", sans-serif;
  --font-mono: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;

  --bg-page: var(--wb-surface);
  --surface: var(--wb-paper);
  --surface-subtle: var(--wb-surface);
  --surface-header: var(--wb-paper);
  --surface-hover: var(--wb-surface-deep);
  --surface-active: var(--wb-surface-deep);


  --text-primary: var(--wb-ink);
  --text-secondary: var(--wb-ink-soft);
  --text-muted: var(--wb-muted);
  --text-faint: var(--wb-muted-light);

  --link: var(--wb-accent);
  --link-hover: var(--wb-accent-strong);

  --tone-ok-fg: var(--wb-success);
  --tone-ok-bg: var(--wb-success-pale);

  --tone-pending-fg: var(--wb-warning);
  --tone-pending-bg: var(--wb-warning-pale);

  --tone-failed-fg: var(--wb-danger);
  --tone-failed-bg: var(--wb-danger-pale);

  --tone-muted-fg: var(--wb-ink-soft);
  --tone-muted-bg: var(--wb-surface);


  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-pill: 9999px;
}

.ft-widget {
  box-sizing: border-box;
  width: 100%;
  font-family: var(--font-sans);
  color: var(--text-primary);
  background-color: var(--bg-page);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
.ft-widget * { box-sizing: border-box; }
.ft-widget.expanded { padding: 16px 20px 24px; min-width: 0; overflow-wrap: anywhere; }
.ft-widget .toolbar-strip { flex-wrap: wrap; }
.ft-widget .segmented-control { max-width: 100%; overflow-x: auto; }
.ft-widget .navbar-inner { flex-wrap: wrap; height: auto; min-height: 52px; padding: 8px 0; }
.ft-widget .feature-feed, .ft-widget .feature-card, .ft-widget .table-scroll { min-width: 0; max-width: 100%; }
.ft-widget .matrix-table { min-width: 760px; }
a { color: var(--link); text-decoration: none; }
a:hover { color: var(--link-hover); }

/* Compact View */
.ft-widget.compact {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 14px 16px 12px;
  background: var(--surface);
  border-radius: var(--radius-md);
}
.navbar-compact {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.compact-card-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 0 0 auto;
}
.compact-feature-card-head { display: block; }
.card-header-compact {
  min-width: 0;
  flex: 1;
}
.feature-card-compact {
  min-width: 0;
  border: 0;
  border-radius: var(--radius-md);
  padding: 0;
  background: var(--surface);
  box-shadow: none;
}

/* Expanded Navbar */
.navbar {
  background: var(--surface);
  border: 0;
  position: sticky;
  top: 0;
  z-index: 40;
  margin: 0 0 18px;
}
.navbar-inner {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 28px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand-box {
  flex-shrink: 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-logo {
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  border-radius: 5px;
  background: var(--link);
  color: var(--wb-accent-foreground);
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}
.brand-title {
  font-size: 15px;
  font-weight: 650;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}
.brand-count {
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 550;
  color: var(--text-muted);
  background: transparent;
  padding: 2px 0;
  border-radius: var(--radius-sm);
  border: 0;
}
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.card-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.copy-trigger { min-height: 32px; height: 32px; padding: 0 9px; font-size: 11px; font-weight: 600; gap: 5px; }
.copy-feedback { max-width: 170px; color: var(--tone-ok-fg); font-size: 11px; line-height: 1.35; text-align: right; }
.copy-feedback.is-error { color: var(--tone-failed-fg); }
.search-box {
  position: relative;
  width: 220px;
}
.sync-box {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--tone-ok-fg);
}
.dot.busy {
  background-color: var(--link);
  animation: pulse 1s infinite alternate;
}
.dot.error {
  background-color: var(--tone-failed-fg);
}
@keyframes pulse { from { opacity: 0.3; } to { opacity: 1; } }

.btn-nav {
  background: var(--surface-subtle);
  border: 0;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  height: 32px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.12s ease;
  white-space: nowrap;
}
.btn-nav:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.toolbar-strip {
  max-width: 1360px;
  margin: 0 auto 14px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.segmented-control {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: var(--surface-hover);
  padding: 2px;
  border-radius: var(--radius-md);
  border: 0;
}
.segment-tab {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.12s ease;
}
.segment-tab:hover { color: var(--text-primary); }
.segment-tab.active {
  background: var(--surface);
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: none;
}

.feature-feed {
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* Light mode needs a recessed canvas and white cards, not near-white on near-white. */
:root[data-theme="light"] .ft-widget.expanded {
  --bg-page: color-mix(in srgb, var(--wb-surface) 92%, var(--wb-ink));
  --surface-subtle: var(--wb-surface-deep);
}
:root[data-theme="light"] .expanded .feature-card {
  --feature-surface: var(--wb-paper);
  --feature-inset: var(--wb-surface-deep);
}

/* Dark mode: lower surface contrast and desaturate accents so dense status data stays calm. */
:root[data-theme="dark"] .ft-widget {
  --bg-page: color-mix(in srgb, var(--wb-surface) 90%, var(--wb-paper) 10%);
  --surface: color-mix(in srgb, var(--wb-paper) 86%, var(--wb-surface) 14%);
  --surface-subtle: color-mix(in srgb, var(--wb-surface-deep) 70%, var(--wb-surface) 30%);
  --surface-hover: color-mix(in srgb, var(--wb-surface-deep) 64%, var(--wb-paper) 36%);
  --surface-active: color-mix(in srgb, var(--wb-surface-deep) 52%, var(--wb-paper) 48%);
  --text-primary: color-mix(in srgb, var(--wb-ink) 82%, var(--wb-paper) 18%);
  --text-secondary: color-mix(in srgb, var(--wb-ink-soft) 82%, var(--wb-paper) 18%);
  --text-muted: color-mix(in srgb, var(--wb-muted) 90%, var(--wb-paper) 10%);
  --text-faint: color-mix(in srgb, var(--wb-muted-light) 88%, var(--wb-paper) 12%);
  --link: color-mix(in srgb, var(--wb-accent) 82%, var(--wb-paper) 18%);
  --link-hover: color-mix(in srgb, var(--wb-accent-strong) 82%, var(--wb-paper) 18%);
  --tone-ok-fg: color-mix(in srgb, var(--wb-success) 78%, var(--wb-paper) 22%);
  --tone-ok-bg: color-mix(in srgb, var(--wb-success-pale) 78%, var(--bg-page) 22%);
  --tone-pending-fg: color-mix(in srgb, var(--wb-warning) 78%, var(--wb-paper) 22%);
  --tone-pending-bg: color-mix(in srgb, var(--wb-warning-pale) 78%, var(--bg-page) 22%);
  --tone-failed-fg: color-mix(in srgb, var(--wb-danger) 78%, var(--wb-paper) 22%);
  --tone-failed-bg: color-mix(in srgb, var(--wb-danger-pale) 78%, var(--bg-page) 22%);
  --tone-muted-fg: var(--text-secondary);
  --tone-muted-bg: color-mix(in srgb, var(--surface-subtle) 76%, var(--bg-page) 24%);
}
:root[data-theme="dark"] .ft-widget .feature-card {
  --feature-surface: color-mix(in srgb, var(--surface) 88%, var(--bg-page) 12%);
  --feature-inset: color-mix(in srgb, var(--feature-surface) 85%, var(--bg-page) 15%);
}

/* Feature Card */
.feature-card {
  --feature-surface: color-mix(in srgb, var(--surface) 97%, var(--text-primary));
  --feature-inset: color-mix(in srgb, var(--feature-surface) 96%, var(--text-primary));
  background: var(--feature-surface);
  border: 0;
  border-radius: var(--radius-lg);
  box-shadow: none;
  overflow: hidden;
}
.feature-card:hover {
  box-shadow: none;
}
.card-header {
  padding: 24px 24px 18px;
  background: transparent;
  border: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.card-header-main { flex: 1; min-width: 0; }
.feature-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.feature-title {
  font-size: 16px;
  font-weight: 650;
  color: var(--text-primary);
  letter-spacing: -0.25px;
  margin: 0;
}
.badge-overall {
  font-size: 11px;
  font-weight: 550;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  line-height: 1.45;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
}
.badge-overall.ok {
  color: var(--tone-ok-fg);
  background: var(--tone-ok-bg);
}
.badge-overall.pending {
  color: var(--tone-pending-fg);
  background: var(--tone-pending-bg);
}
.badge-overall.muted {
  color: var(--tone-muted-fg);
  background: var(--tone-muted-bg);
}

.feature-summary {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 8px;
  line-height: 1.65;
  max-width: 960px;
}
.feature-meta-bar {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.meta-dot {
  color: var(--text-faint);
  font-size: 10px;
}
.feature-meta-bar b {
  color: var(--text-secondary);
  font-weight: 550;
}
.btn-doc-toggle {
  font-size: 11px;
  color: var(--link);
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.btn-doc-toggle:hover {
  color: var(--link-hover);
  text-decoration: underline;
}

/* Matrix Table Grid */
.table-scroll { overflow-x: auto; padding-bottom: 8px; }
.matrix-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  text-align: left;
}
.matrix-table thead th {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  padding: 12px 24px 8px;
  background: transparent;
  border: 0;
  letter-spacing: 0.3px;
}
.matrix-table th.col-project { width: 25%; }
.matrix-table th.col-env {
  width: 25%;
  border: 0;
}
.env-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 650;
  color: var(--text-secondary);
  text-transform: uppercase;
}
.env-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.env-dot.dev { background: var(--link); }
.env-dot.pre { background: var(--tone-pending-fg); }
.env-dot.prod { background: var(--tone-ok-fg); }

.matrix-table tbody tr {
  border: 0;
  transition: background-color 0.12s ease;
}
.matrix-table tbody tr:last-child { border-bottom: none; }
.matrix-table tbody tr:hover { background-color: var(--feature-inset); }
.matrix-table td {
  padding: 20px 24px;
  vertical-align: top;
}
.project-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.project-name-link {
  font-size: 13px;
  font-weight: 650;
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.project-name-link svg {
  opacity: 0.5;
  transition: opacity 0.15s;
}
.project-name-link:hover svg { opacity: 1; }
.project-repo-path {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  word-break: break-all;
}
.branch-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}
.branch-tag {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  background: var(--surface-subtle);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  border: 0;
}
.project-execution-link {
  align-self: flex-start;
  margin-top: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--link);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}
.project-execution-link:hover {
  color: var(--link-hover);
  text-decoration: underline;
}
.matrix-table td.cell-env {
  border: 0;
}

/* Pipeline Stages — one segmented chip per step
   (status verdict and source links share a single ButtonGroup) */
.stage-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stage-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 22px;
}
.stage-name {
  width: 24px;
  flex: 0 0 24px;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 550;
}
.stage-chip {
  display: inline-flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 2px;
  white-space: nowrap;
  border: 0;
  border-radius: var(--radius-sm);
  background: var(--surface-subtle);
  overflow: hidden;
  line-height: 1;
  box-shadow: none;
}
.chip-status {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  color: var(--tone-muted-fg);
  background: var(--surface-subtle);
  border: 0;
  user-select: none;
}
.chip-status.tone-ok { color: var(--tone-ok-fg); background: var(--tone-ok-bg); }
.chip-status.tone-pending { color: var(--tone-pending-fg); background: var(--tone-pending-bg); }
.chip-status.tone-failed { color: var(--tone-failed-fg); background: var(--tone-failed-bg); }
.chip-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  min-width: 20px;
  padding: 0 5px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  color: var(--link);
  text-decoration: none;
  border: 0;
  transition: background 0.12s ease, color 0.12s ease;
}
.chip-link:hover {
  background: var(--surface-hover);
  color: var(--link-hover);
}
.chip-link.tone-ok { color: var(--tone-ok-fg); background: var(--tone-ok-bg); font-weight: 650; }
.chip-link.tone-ok:hover { background: var(--tone-ok-bg); }
.chip-link.tone-failed { color: var(--tone-failed-fg); background: var(--tone-failed-bg); font-weight: 700; }
.chip-link.tone-failed:hover { background: var(--tone-failed-bg); }
.chip-link.tone-pending { color: var(--tone-pending-fg); background: var(--tone-pending-bg); font-weight: 600; }
.chip-link.tone-pending:hover { background: var(--tone-pending-bg); }
.chip-link.tone-muted { color: var(--wb-muted); background: var(--surface-subtle); font-weight: 500; }
.chip-link.tone-muted:hover { background: var(--surface-active); }
.stage-chip > :last-child {
  border: 0;
}

.empty-links-box {
  padding: 22px 24px;
  background: var(--surface-subtle);
  border: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}
.empty-links-box svg { color: var(--text-faint); }
.doc-panel {
  padding: 18px 22px;
  background: var(--surface-subtle);
  border: 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.65;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}
.empty-feed {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
  font-size: 13px;
  background: var(--surface);
  border: 0;
  border-radius: var(--radius-lg);
}

/* A tapered rule separates summaries: thin at both ends, thicker in the middle. */
.feature-card-compact + .feature-card-compact::before {
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  margin: 7px 0;
  background: var(--text-faint);
  opacity: .22;
  clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%);
}
.compact-feature-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.compact-feature-title-row .feature-title {
  flex: 1 1 auto;
}
.compact .feature-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}
.compact-feature-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin-top: 5px;
}
.compact-feature-meta .badge-overall {
  flex: 0 0 auto;
  min-height: 24px;
  padding: 0 8px;
  line-height: 1;
  white-space: nowrap;
}
.compact .feature-summary,
.compact-feature-meta .feature-summary {
  flex: 1 1 auto;
  min-width: 0;
  color: var(--text-muted);
  margin-top: 0;
  display: block;
  line-height: 1.4;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.compact .navbar-actions { width: auto; margin-left: auto; flex-shrink: 0; }
.compact-more { margin-top: 6px; font-size: 11px; line-height: 1.4; color: var(--text-muted); }
.compact-footer {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 10px;
  color: var(--text-faint);
  padding-top: 8px;
  margin-top: auto;
}
.compact-footer a { white-space: nowrap; }
.compact-footer-status {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
  gap: 8px;
  white-space: nowrap;
}
.compact-diagnostic { color: var(--text-muted); }
.compact-ledger-status { color: var(--text-faint); }
.compact-ledger-status.is-warning { color: var(--tone-pending-fg); }
.compact-ledger-status.is-failed { color: var(--tone-failed-fg); }
.compact-footer-actions {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 10px;
}
.btn-compact-execution {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--link);
  font: inherit;
  font-weight: 550;
  cursor: pointer;
  white-space: nowrap;
}
.btn-compact-execution:hover { color: var(--link-hover); text-decoration: underline; }
.btn-compact-feature-execution {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  margin: 0;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--text-faint);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.btn-compact-feature-execution:hover {
  color: var(--link);
  background: var(--surface-subtle);
}
.navigation-error {
  color: var(--tone-failed-fg);
  overflow-wrap: anywhere;
}
.expanded-navigation-error {
  max-width: 1360px;
  margin: -8px auto 12px;
  font-size: 11px;
}
/* Write-blocked / action-failed notices: same recessed surface as other inline panels. */
.alert-box {
  max-width: 1360px;
  margin: 0 auto 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--tone-failed-bg);
  color: var(--tone-failed-fg);
  font-size: 12px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.alert-list {
  margin: 6px 0 0;
  padding-left: 18px;
}
.alert-list code {
  font-family: var(--font-mono);
  font-size: 11px;
}
.alert-hint {
  display: block;
  margin-top: 6px;
  color: var(--text-secondary);
}
.archive-alert {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.alert-dismiss {
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 15px;
  line-height: 1;
  padding: 0 2px;
  cursor: pointer;
}
.badge-auto-archived {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  background: var(--surface-subtle);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.btn-compact-refresh {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; flex-shrink: 0; padding: 0;
  border: 0; border-radius: 8px; background: var(--surface-subtle);
  color: var(--text-muted); cursor: pointer;
}
.btn-compact-refresh:hover { background: var(--surface-hover); color: var(--text-primary); }
.refresh-spin.is-spinning { animation: ft-spin 1s linear infinite; }
@keyframes ft-spin { to { transform: rotate(360deg); } }
.ft-widget :is(button, a, input):focus-visible { outline: 2px solid var(--link); outline-offset: 3px; }
.ft-widget button:disabled { cursor: wait; opacity: .55; }
.ft-widget .sync-box { white-space: nowrap; flex-shrink: 0; }
.matrix-table tbody tr:nth-child(even) { background: var(--feature-inset); }
.feature-card .doc-panel, .feature-card .empty-links-box { background: var(--feature-inset); }
.ft-candidates{display:grid;gap:8px;margin-bottom:14px}.ft-candidate,.ft-adoption-record{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:9px 11px;border:1px solid var(--wb-muted-light);border-radius:8px;font-size:12px}.ft-candidate span:nth-child(2){color:var(--text-muted)}.ft-candidate [role=alert],.ft-adoption-record [role=alert]{color:var(--wb-danger);width:100%}.ft-adoption-record{margin-top:9px}.ft-adoption-record .btn-nav{margin-left:auto}
.stage-chip { max-width: 100%; }
.chip-link { overflow-wrap: anywhere; white-space: normal; line-height: 1.4; }
.chip-link:hover { text-decoration: underline; }
.expanded .navbar { background: var(--bg-page); }
.expanded .navbar-actions { flex-wrap: wrap; }
.expanded .search-box { flex: 1 1 180px; }
@media(max-width:680px){
  .ft-widget.expanded{padding:12px 12px 20px}
  .expanded .navbar-inner,.expanded .navbar-actions{gap:10px;flex-wrap:wrap}
  .expanded .navbar-actions{width:100%;min-width:0}
  .expanded .search-box{width:100%;min-width:0;flex:1 1 100%}
  .expanded .segmented-control{flex-wrap:nowrap;max-width:100%}
  .expanded .segmented-control button{flex-shrink:0;min-height:36px}
  .expanded .card-header{padding:18px 16px;gap:10px;flex-direction:column;align-items:stretch}
  .expanded .card-header-actions{flex-wrap:wrap;justify-content:flex-start}
  .expanded .copy-feedback{flex:0 1 100%;max-width:100%}
  .expanded .feature-title-row{align-items:flex-start;gap:8px}
  .expanded .table-scroll{overscroll-behavior-x:contain}
  .expanded .btn-nav{white-space:nowrap;flex-shrink:0;min-height:36px}
}
@media(prefers-reduced-motion:reduce){
  .ft-widget *, .ft-widget *::before { animation:none !important; transition:none !important; }
}
`,pp=mg(Ug);export{pp as default,Ug as View};
