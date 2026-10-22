import{b as bo,c as D}from"./entry-gr61gnrm.js";import{I as S,J as ho,K as Co,M as er,d as ao,j as wo,k as o,l,m as b,n as fo,o as Ko,p as So,q as Jo,r as _,s as To,t as Oo,u as s,v as mo}from"./entry-a8fm45nk.js";import{S as go,Y as i}from"./entry-011ww5m3.js";var Xo=go(ao(),1);function K({mutation:n,resetLabel:w="继续编辑"}){let[c,y]=Xo.useState(!1),{status:u,draft:g}=n;return l("div",{"aria-live":"polite",style:{fontSize:12,color:"var(--wb-muted)",display:"grid",gap:8},children:[g&&!g.ready&&o("p",{role:"status",children:"正在恢复输入…"}),g?.ready&&g.dirty&&!g.retained&&o("p",{role:"status",children:"正在保留输入…"}),u==="pending"&&o("p",{role:"status",children:"正在处理…"}),u==="unknown"&&o("p",{role:"alert",children:"结果尚未确认，请核对原操作。"}),u==="success"&&o("p",{role:"status",children:"操作已确认。"}),n.error&&o("p",{role:"alert",children:n.error.message}),n.readError&&l("p",{role:"alert",children:["操作已确认，读取最新内容失败：",n.readError.message]}),(u==="unknown"||n.readError||g&&!g.ready&&n.error)&&o("button",{type:"button",onClick:()=>void n.retry(),children:"核对 / 重新读取"}),u==="success"&&o("button",{type:"button",disabled:!!n.readError,onClick:()=>void n.reset(),children:g?w:"清除提示"}),g?.dirty&&!g.locked&&(c?l("span",{children:["放弃这份未提交输入？ ",o("button",{type:"button",onClick:()=>{n.reset().then((U)=>{if(U)y(!1)})},children:"确认放弃"})," ",o("button",{type:"button",onClick:()=>y(!1),children:"保留"})]}):o("button",{type:"button",onClick:()=>y(!0),children:"放弃输入"}))]})}var Uo=go(ao(),1);function Eo({onCreated:n}){let{actions:w,useQuery:c}=D(),y=c("projectChoices",{}),[u,g]=Uo.useState(!1),[U,O]=Uo.useState(""),G=y.data?.items??[],v=S(w.createFeature,{draft:{initial:{title:"",summary:"",projectId:""}},input:(d)=>d}),m=v.draft,{title:L,summary:N,projectId:I}=m.value,T=(d)=>m.set(($)=>({...$,projectId:d})),J=!m.ready||m.locked,M=v.error?.message??U,Q=(d)=>m.set(($)=>({...$,title:d})),R=(d)=>m.set(($)=>({...$,summary:d})),q=v.status==="success"&&v.data?.registered===!0?v.data.id:void 0;async function A(){if(!q)return;try{await n(q),O("")}catch(d){O(`需求已保存，打开失败：${d instanceof Error?d.message:String(d)}`)}}return l("div",{className:"feature-create",children:[o(b,{variant:"secondary",onPress:()=>g((d)=>!d),children:u?"收起新需求":"新建需求"}),u&&l("section",{className:"feature-create-form","aria-label":"新建功能需求",children:[l(Jo,{value:L,onChange:Q,isDisabled:J,fullWidth:!0,children:[o(To,{children:"需求名称"}),o(Ko,{placeholder:"这次想完成什么？"})]}),l(Jo,{value:N,onChange:R,isDisabled:J,fullWidth:!0,children:[o(To,{children:"目标与验收"}),o(So,{rows:4,placeholder:"描述结果、约束和验收方式"})]}),l("div",{children:[o("p",{children:"所属项目"}),o("div",{className:"feature-project-choices",children:G.map((d)=>o(b,{variant:I===d.id?"primary":"secondary","aria-pressed":I===d.id,onPress:()=>T(d.id),isDisabled:J,children:d.name},d.id))})]}),y.loading&&o("p",{role:"status",children:"正在读取项目…"}),y.error&&o("p",{role:"alert",children:y.error.message}),!y.loading&&!y.error&&!G.length&&o("p",{role:"alert",children:"尚未关联项目，请先在便笺对话中关联实际项目。"}),M&&o("p",{role:"alert",children:M}),o(K,{mutation:v,resetLabel:"再建需求"}),v.status==="success"&&v.data?.registered!==!0&&o("p",{role:"alert",children:"台账已返回，请核对记录是否登记成功。"}),q&&o(b,{variant:"secondary",onPress:()=>{A()},children:"查看已创建需求"}),o(b,{onPress:()=>void v.mutate(),isDisabled:J||!I||!L.trim()||!N.trim(),children:J?"正在保存需求…":"创建需求"})]}),o("style",{children:".feature-create{padding:12px 20px 0}.feature-create-form{display:flex;flex-direction:column;gap:14px;padding:16px 0;max-width:720px}.feature-create-form p{margin:0 0 8px;font-size:13px}.feature-create-form [role=alert]{color:var(--wb-danger)}.feature-project-choices{display:flex;gap:8px;flex-wrap:wrap}.feature-create-form>.button{align-self:flex-start;min-height:44px}@media(max-width:680px){.feature-create{padding:12px 16px 0}.feature-create-form>.button{width:100%}}"})]})}var io=go(ao(),1);var Yo=go(ao(),1);function Vo({items:n,limit:w,pending:c,busy:y,error:u,onRemove:g,onRefresh:U,children:O}){let[G,v]=Yo.useState(!1);return l("section",{"aria-label":"跨区域固定引用",style:{flexShrink:0,minWidth:0,color:"var(--wb-ink)",fontSize:12},children:[l("div",{style:{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"},children:[l(b,{size:"sm",variant:"tertiary","aria-expanded":G,onPress:()=>v(!G),children:["固定引用 ",n.length,"/",w]}),n.some((m)=>m.warning)&&o("span",{role:"status",style:{color:"var(--wb-warning)"},children:"引用需核对"})]}),l(ho,{open:G,onOpenChange:v,label:"固定引用",style:{width:520,maxWidth:"calc(100% - 32px)",margin:"auto",padding:20,border:0,borderRadius:"var(--wb-radius)",background:"var(--wb-paper)",color:"var(--wb-ink)",boxShadow:"var(--wb-shadow-popover)",boxSizing:"border-box"},children:[l("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12},children:[l("strong",{children:["固定引用 ",n.length,"/",w]}),o(b,{size:"sm",variant:"tertiary",onPress:()=>v(!1),children:"关闭"})]}),o("p",{style:{color:"var(--wb-muted)"},children:"项目内共享，随下一条消息附加。"}),c&&o("p",{role:"status",children:"正在核对…"}),G&&l(fo,{style:{maxHeight:"55dvh",display:"flex",flexDirection:"column",gap:12},children:[O,!n.length&&o("span",{children:"尚无固定引用。固定不会发送消息或修改对象。"}),n.map((m)=>l("div",{style:{display:"flex",alignItems:"center",gap:8},children:[l("div",{style:{flex:1,minWidth:0,overflowWrap:"anywhere"},children:[o("strong",{children:m.label}),o("div",{style:{color:m.warning?"var(--wb-warning)":"var(--wb-muted)",marginTop:4},children:m.status})]}),o(b,{size:"sm",variant:"tertiary",isDisabled:y,"aria-label":`移除固定引用 ${m.label}`,onPress:()=>g(m.key),children:"移除"})]},m.key)),o(b,{size:"sm",variant:"tertiary",isDisabled:y,onPress:U,children:"重新核对引用"})]}),u&&o("p",{role:"alert",style:{margin:"8px 0 0",overflowWrap:"anywhere"},children:u})]}),u&&!G&&o("p",{role:"alert",style:{margin:"8px 0 0",overflowWrap:"anywhere"},children:u})]})}var Do={draft:"草稿",running:"制作中","needs-input":"需要补充",failed:"制作失败",stale:"版本需核对",cancelled:"已取消",paused:"已暂停",interrupted:"制作中断",generated:"待建立候选",checking:"待试玩检查",review:"待我确认",adopted:"已加入游戏",undone:"已撤销"};function Mo({mode:n,metadata:w,candidateState:c,notices:y,ready:u,onEngineering:g,onDiscuss:U,onPreview:O,onProduction:G,onCandidate:v}){let{actions:m,useQuery:L}=D(),N=L("pinnedReferences",{},{enabled:n==="expanded"}),I=S(m.pinChangeReference,{query:N}),T=S(m.removePinnedReference,{query:N}),J=[I.status,T.status].some((e)=>e==="pending"||e==="unknown"),M=I.error?.message??T.error?.message,[Q,R]=bo("changes:search",""),[q,A]=bo("changes:filter","all"),[d,$]=io.useState(),[B,F]=io.useState([]),[k,uo]=io.useState(""),[Y,po]=io.useState(!1),[P,z]=io.useState(),C=L("changes",{query:Q,...q!=="all"?{filter:q}:{},limit:n==="compact"?3:30,...d?{cursor:d}:{}}),X=L("candidateDiff",{productionId:P?.change.productionId||"",candidateId:P?.candidateId||""},{enabled:Boolean(P)}),co=C.data?.items??[],V=P&&co.find((e)=>e.id===P.change.id&&e.projectId===P.change.projectId&&e.productionId===P.change.productionId&&e.featureId===P.change.featureId),W=V?.candidates.find((e)=>e.id===P?.candidateId),x=P?c(P.change,P.candidateId,P.operation):void 0,eo=!!V&&V.revision===P?.change.revision&&!!W&&(P?.operation==="undo"?W.status==="adopted":V.stage==="review"&&W.current&&W.previewVerified&&W.status==="candidate");async function yo(e){uo("");try{await e()}catch(a){uo(a instanceof Error?a.message:String(a))}}async function ro(e){if(Y)return;po(!0);try{await yo(e)}finally{po(!1)}}return l("section",{className:`gc-root gc-${n}`,children:[l("style",{children:[mr,ar]}),l("header",{className:"gc-heading",children:[o(Co,{icon:w.icon,size:20}),o("strong",{children:"改动"}),o("span",{children:C.data?`${C.data.total} 项`:"尚未读取"}),o(b,{size:"sm",variant:"secondary",isDisabled:Y,onPress:()=>U(),children:"提出想法"}),n==="expanded"&&o(b,{size:"sm",variant:"tertiary",onPress:()=>void yo(()=>C.refresh()),"aria-label":"刷新改动",children:"刷新"})]}),n==="expanded"&&l("div",{className:"gc-tools",children:[o(_,{"aria-label":"搜索改动",value:Q,onChange:(e)=>{R(e),$(void 0),F([])},fullWidth:!0,children:l(_.Group,{children:[o(_.SearchIcon,{}),o(_.Input,{placeholder:"搜索改动"}),o(_.ClearButton,{})]})}),l(mo,{"aria-label":"筛选改动状态",value:q,onChange:(e)=>{A(String(e??"all")),$(void 0),F([])},style:{minWidth:160,flexShrink:0},children:[l(mo.Trigger,{children:[o(mo.Value,{}),o(mo.Indicator,{})]}),o(mo.Popover,{children:o(Oo,{children:Object.entries({all:"全部状态",draft:"草稿",running:"制作中",candidate:"待检查或确认",attention:"需处理",adopted:"已加入游戏",undone:"已撤销"}).map(([e,a])=>o(Oo.Item,{id:e,textValue:a,children:a},e))})})]}),o(b,{variant:"tertiary",onPress:()=>g(),children:"工程记录"})]}),y,o(K,{mutation:I}),o(K,{mutation:T}),(C.error||k)&&o("p",{className:"gc-error",role:"alert",children:C.error?.message||k}),C.stale&&C.data&&o("span",{className:"gc-muted",children:"正在核对最新状态"}),C.loading&&o("p",{role:"status",children:"正在读取改动…"}),!C.loading&&!C.error&&!co.length&&l("div",{className:"gc-empty",children:[o("strong",{children:Q||q!=="all"?"没有匹配的改动":"还没有制作记录"}),o("p",{children:Q||q!=="all"?"调整关键词或状态继续查找。":"通过便笺原生对话提出想法，生成结果后在这里查看。"})]}),o(fo,{className:"gc-list",children:co.map((e)=>o("article",{className:"gc-item",children:n==="compact"?l("div",{className:"gc-item-heading",children:[l("div",{className:"gc-compact-meta",children:[o("small",{children:e.round?`第 ${e.round} 轮`:"制作记录"}),o("span",{className:`gc-stage gc-${e.stage}`,children:Do[e.stage]})]}),o("strong",{title:e.title,children:e.title})]}):l("details",{className:"gc-change",children:[l("summary",{className:"gc-item-heading",children:[o("strong",{title:e.title,children:e.title}),o("span",{className:`gc-stage gc-${e.stage}`,children:Do[e.stage]})]}),l("div",{className:"gc-change-body",children:[l("div",{className:"gc-meta",children:[e.round?`第 ${e.round} 轮 · `:"","需求版本 ",e.requirementRevision," · ",e.productionId]}),e.detail&&o("p",{children:e.detail}),o("div",{className:"gc-candidates",children:e.candidates.filter((a)=>a.current||a.status==="adopted").map((a)=>l("div",{className:"gc-candidate",children:[l("div",{children:[o("strong",{children:a.targetId}),l("span",{className:"gc-meta",children:["候选 ",a.commit.slice(0,8)," · ",a.status==="adopted"?"已加入":a.status==="undone"?"已撤销":a.previewVerified?"试玩检查已通过":"待试玩检查"]})]}),o(gr,{productionId:e.productionId,candidateId:a.id}),o(b,{size:"sm",variant:"tertiary",isDisabled:J||C.stale||!!C.error,onPress:()=>void I.mutate({productionId:e.productionId,revision:e.revision,candidateId:a.id,commit:a.commit}),children:"固定候选"}),o(b,{size:"sm",variant:"secondary",isDisabled:Y,onPress:()=>void ro(()=>O(a.id,a.commit)),children:"试玩这个版本"}),e.stage==="review"&&a.status==="candidate"&&a.current&&a.previewVerified&&o(b,{size:"sm",isDisabled:c(e,a.id,"confirm").blocked||!u||C.stale||!!C.error,onPress:()=>z({change:e,candidateId:a.id,operation:"confirm"}),children:"加入游戏"}),a.status==="adopted"&&o(b,{size:"sm",variant:"secondary",isDisabled:c(e,a.id,"undo").blocked||!u||C.stale||!!C.error,onPress:()=>z({change:e,candidateId:a.id,operation:"undo"}),children:"撤销采用"}),c(e,a.id,a.status==="adopted"?"undo":"confirm").message&&o("p",{className:"gc-error",role:"alert",children:c(e,a.id,a.status==="adopted"?"undo":"confirm").message})]},a.id))}),l("div",{className:"gc-actions",children:[o(b,{size:"sm",variant:"tertiary",isDisabled:J||C.stale||!!C.error,onPress:()=>void I.mutate({productionId:e.productionId,revision:e.revision}),children:"固定改动"}),o(b,{size:"sm",variant:"secondary",isDisabled:Y,onPress:()=>U(e),children:"继续讨论"}),o(b,{size:"sm",variant:"tertiary",isDisabled:Y,onPress:()=>void ro(()=>G(e)),children:"查看制作过程"}),e.featureId&&o(b,{size:"sm",variant:"tertiary",onPress:()=>g(e.featureId),children:"功能与采用记录"})]})]})]})},`${e.projectId}:${e.id}`))}),n==="expanded"&&l("footer",{className:"gc-pagination",children:[o(b,{size:"sm",variant:"tertiary",isDisabled:!B.length,onPress:()=>{$(B.at(-1)),F(B.slice(0,-1))},children:"上一页"}),l("span",{children:["第 ",B.length+1," 页"]}),o(b,{size:"sm",variant:"tertiary",isDisabled:!C.data?.nextCursor||C.stale,onPress:()=>{F([...B,d]),$(C.data?.nextCursor)},children:"下一页"})]}),o("footer",{className:"gc-reference-tools",children:n==="expanded"&&o(Vo,{items:(N.data?.items??[]).map((e)=>({key:e.key,label:`${e.title}${e.anchor?` / ${e.anchor}`:""}`,warning:e.freshness!=="current",status:`${e.revision.slice(0,12)} · ${e.freshness==="current"?e.kind==="battleComparison"?"历史报告一致，不代表当前项目":"版本一致":e.freshness==="stale"?"版本已变化，需移除后重新固定":"无法读取或定位"}`})),limit:N.data?.limit??8,pending:N.loading||N.stale,busy:J,error:M||N.error?.message,onRemove:(e)=>void T.mutate({key:e}),onRefresh:()=>void yo(()=>N.refresh()),children:o("span",{children:"使用下方“固定改动”或“固定候选”，不会发送消息或采用候选。"})})}),o(ho,{open:!!P,label:P?.operation==="undo"?"撤销采用":"确认加入游戏",onOpenChange:(e)=>{if(!e&&!x?.pending)z(void 0)},children:l("div",{className:"gc-confirm",children:[o("h2",{children:P?.operation==="undo"?"撤销这次采用？":"加入游戏？"}),o("p",{children:P?.change.title}),l("p",{children:["候选 ",W?.commit.slice(0,8)," · ",W?.targetId]}),o("p",{children:P?.operation==="undo"?"将检查采用后的修改；存在冲突时保留当前内容并说明原因。":"仅将这个候选及其依赖加入正式游戏。试玩检查不代表已经完成人工体验。"}),X.loading&&o("p",{role:"status",children:"正在核对候选差异…"}),X.error&&o("p",{role:"alert",children:X.error.message}),X.data&&o(Ro,{diff:X.data}),!eo&&o("p",{className:"gc-error",children:"记录已变化，请关闭并核对当前候选。"}),x?.message&&o("p",{className:"gc-error",role:"alert",children:x.message}),l("div",{className:"gc-actions",children:[o(b,{variant:"secondary",isDisabled:x?.pending,onPress:()=>z(void 0),children:"取消"}),o(b,{isDisabled:x?.blocked||!u||!eo||C.stale||!!C.error||P?.operation==="confirm"&&(!X.data?.baseCurrent||X.stale||!!X.error),onPress:()=>{if(P&&eo)v(P.change,P.candidateId,P.operation)},children:x?.pending?"正在处理…":P?.operation==="undo"?"确认撤销":"确认加入"})]})]})})]})}function gr({productionId:n,candidateId:w}){let[c,y]=io.useState(!1),{useQuery:u}=D(),g=u("candidateDiff",{productionId:n,candidateId:w},{enabled:c});return l("div",{className:"gc-diff",children:[o(b,{size:"sm",variant:"tertiary",onPress:()=>y(!c),children:c?"收起差异":"查看差异"}),c&&l(wo,{children:[g.loading&&o("p",{role:"status",children:"正在读取差异…"}),g.error&&o("p",{role:"alert",children:g.error.message}),g.data&&o(Ro,{diff:g.data})]})]})}function Ro({diff:n}){return l("div",{className:"gc-diff-files",children:[o("p",{children:n.comparison==="adoption-record"?"采用时的历史差异":n.baseCurrent?"当前正式内容 → 所选候选":"正式基线已变化，需重新建立候选"}),o(fo,{style:{maxHeight:320},children:n.files.filter((w)=>w.changed).map((w)=>l("details",{children:[l("summary",{children:[w.path," · ",w.beforeBytes," → ",w.afterBytes," 字节"]}),w.binary?o("p",{children:"二进制资源发生变化，请在对应资源视图核对。"}):w.truncated?o("p",{children:"文件较大，请在制作记录中查看完整内容。"}):l("div",{className:"gc-diff-columns",children:[l("div",{children:[o("strong",{children:"变更前"}),o("pre",{children:w.before??"文件不存在"})]}),l("div",{children:[o("strong",{children:"变更后"}),o("pre",{children:w.after??"文件不存在"})]})]})]},w.path))})]})}var ar=".gc-compact .gc-item{box-sizing:border-box;padding:12px;margin-bottom:10px;border-radius:10px;background:var(--wb-surface)}.gc-compact .gc-item:first-child{padding-top:12px}.gc-compact .gc-item-heading{flex-direction:column;align-items:stretch;gap:8px;min-width:0}.gc-compact .gc-item-heading>strong{width:100%;max-width:100%;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;white-space:normal;overflow:hidden;line-height:1.6}.gc-compact-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--wb-muted);font-size:11px}.gc-compact .gc-stage{padding:2px 7px;background:var(--wb-surface-deep);border-radius:999px}.gc-compact .gc-list{overflow-x:hidden}",mr='.gc-reference-tools{display:flex;justify-content:flex-end;flex-shrink:0}.gc-change>summary{cursor:pointer;min-height:44px;align-items:center}.gc-change>summary::before{content:"›";color:var(--wb-muted)}.gc-change[open]>summary::before{content:"⌄"}.gc-change>summary>strong{flex:1}.gc-change:not([open])>summary>strong{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.gc-change>summary:focus-visible{outline:2px solid var(--wb-accent);outline-offset:3px}.gc-change-body{padding-top:12px}.gc-change-body>p{white-space:pre-wrap;overflow-wrap:anywhere}.gc-heading{flex-wrap:wrap}.gc-diff{flex-basis:100%;min-width:0}.gc-diff-files{font-size:12px;overflow-wrap:anywhere}.gc-diff-files details{padding:8px 0}.gc-diff-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.gc-diff-columns pre{white-space:pre-wrap;overflow-wrap:anywhere}.gc-diff-columns>div{min-width:0}@media(max-width:520px){.gc-diff-columns{grid-template-columns:minmax(0,1fr)}}.gc-root{box-sizing:border-box;height:100dvh;display:flex;flex-direction:column;gap:16px;padding:20px;background:var(--wb-paper);color:var(--wb-ink);font-family:var(--wb-font-family);font-size:14px;min-width:0}.gc-heading,.gc-tools,.gc-actions,.gc-pagination{display:flex;align-items:center;gap:10px}.gc-heading>strong{font-size:18px}.gc-heading>span{color:var(--wb-muted);flex:1}.gc-tools>*{min-width:0}.gc-tools>button{flex-shrink:0}.gc-list{flex:1;min-height:0;min-width:0}.gc-item{padding:16px 0}.gc-item:first-child{padding-top:0}.gc-item-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.gc-item-heading>strong{min-width:0;overflow-wrap:anywhere}.gc-stage{font-size:12px;flex-shrink:0;color:var(--wb-muted)}.gc-review{color:var(--wb-accent)}.gc-failed,.gc-error{color:var(--wb-danger)}.gc-adopted{color:var(--wb-success)}.gc-running,.gc-needs-input,.gc-stale{color:var(--wb-warning)}.gc-meta,.gc-muted{display:block;font-size:12px;color:var(--wb-muted);overflow-wrap:anywhere;margin:5px 0}.gc-candidates{display:grid;gap:10px;margin:12px 0}.gc-candidate{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px;background:var(--wb-surface);border-radius:var(--wb-radius-small)}.gc-candidate>div{flex:1;min-width:120px}.gc-candidate>.gc-diff{flex:1 0 100%;min-width:0}.gc-candidate>p{flex-basis:100%;margin:0}.gc-actions{flex-wrap:wrap}.gc-pagination{justify-content:space-between;color:var(--wb-muted)}.gc-confirm{padding:20px;max-width:520px;overflow-wrap:anywhere}.gc-confirm h2{font-size:18px}.gc-empty p{color:var(--wb-muted)}.gc-error{overflow-wrap:anywhere;margin:0}.gc-compact{padding:14px;gap:10px;font-size:12px}.gc-compact .gc-heading>strong{font-size:14px}.gc-compact .gc-item{padding:7px 0}.gc-compact .gc-item-heading>strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gc-compact .gc-stage{font-size:11px}@media(max-width:520px){.gc-expanded{padding:14px}.gc-reference-tools{justify-content:flex-start}.gc-item-heading{flex-direction:column;gap:4px}.gc-tools{flex-wrap:wrap}.gc-candidate{align-items:flex-start}}';var E=go(ao(),1);var Fo=go(ao(),1);function so(){let n=D();return Fo.useMemo(()=>({note:{id:n.metadata.id},resources:n.host.resources,resolvePreviewUrl:n.host.resolvePreviewUrl}),[n.metadata.id,n.host.resources,n.host.resolvePreviewUrl])}var cr=i.object({repo:i.string(),branches:i.array(i.string())}),yr=i.looseObject({id:i.string(),title:i.string(),summary:i.string(),next:i.string(),body:i.string(),links:i.array(cr)}),vr=i.looseObject({id:i.string(),revision:i.string().nullable(),record:yr.nullable(),registered:i.boolean().optional(),changed:i.boolean().optional()}),Li=vr.extend({context:i.looseObject({plugin:i.string(),home:i.string(),guide:i.string(),cli:i.string()}),existingFeatures:i.array(i.object({id:i.string(),title:i.string(),summary:i.string().optional(),links:i.array(i.object({repo:i.string(),repository:i.string().optional(),branches:i.array(i.string())}))}))}),fr=i.object({noteId:i.string().optional(),delegationId:i.string().optional()}),zo=i.object({file:i.string(),error:i.string()}),xo=i.object({id:i.string(),title:i.string(),summary:i.string().optional(),next:i.string().optional(),archived:i.boolean(),totalPrs:i.number(),mergedPrs:i.number(),execution:fr.optional()}),Bi=i.looseObject({serverUrl:i.string(),status:i.enum(["error","running","syncing"]),totalCount:i.number(),activeCount:i.number(),archivedCount:i.number(),errors:i.array(zo),features:i.array(xo.extend({links:i.array(i.object({repo:i.string(),repoName:i.string()}))}))}),Wo=i.object({label:i.string(),tone:i.string(),stale:i.boolean().optional()}),Ao=i.object({url:i.string(),label:i.string(),title:i.string(),tone:i.string().optional()}),ko=i.object({number:i.number(),url:i.string(),label:i.string(),state:i.string().optional(),title:i.string(),tone:i.string().optional()}),jo=i.looseObject({id:i.string(),projectId:i.string(),productionId:i.string(),cardId:i.string().optional(),featureId:i.string(),kind:i.enum(["card","story","documents","deck"]).optional(),targetId:i.string().optional(),candidateHash:i.string().optional(),targetBaseRevision:i.string().optional(),validationManifest:i.string().optional(),commit:i.string().optional(),status:i.enum(["candidate","adopted","undone"]),previewVerified:i.boolean().optional(),adoptedAt:i.string().optional(),undoneAt:i.string().optional(),adoptionId:i.string().optional()}),Zi=i.object({serverUrl:i.string(),status:i.enum(["error","running","syncing"]),totalCount:i.number(),activeCount:i.number(),archivedCount:i.number(),errors:i.array(zo),features:i.array(xo.extend({body:i.string().optional(),createdAt:i.string().optional(),autoArchived:i.boolean(),gameCandidates:i.array(jo),links:i.array(i.object({repo:i.string(),repoName:i.string(),repoNameShort:i.string(),url:i.string().optional(),trackingLabel:i.string().optional(),mappingIssue:i.string().optional(),branches:i.array(i.string()),allPrs:i.array(ko.extend({branch:i.string()})),envBranches:i.record(i.string(),i.object({branch:i.string(),merge:Wo,ci:Wo,deploy:Wo,prs:i.array(ko),ciLinks:i.array(Ao),deploymentLinks:i.array(Ao)}))}))}))}),Io=i.string().trim().min(1),Ho=i.string().regex(/^[a-f\d]{64}$/i),or=i.object({projectId:Io,productionId:Io,candidateId:Io,featureId:Io,candidateHash:Ho,targetBaseRevision:Ho,validationManifest:Ho}),_i=i.object({candidate:jo,production:i.looseObject({id:i.string(),projectId:i.string(),revision:i.number()}).optional(),adoptionId:i.string().optional(),reused:i.boolean().optional()});var Lo=(n)=>or.safeParse({...n,candidateId:n.id}),lo=(n)=>{let w=Lo(n);return!w.success?w.error.message:n.status==="adopted"&&!n.adoptionId?"缺少采用记录，无法撤销":""};var rr=(n)=>n.kind==="deck"?`牌组 ${n.targetId}`:n.kind==="story"?`剧情 ${n.targetId}`:n.kind==="documents"?`资料 ${n.targetId}`:`卡牌 ${n.cardId}`,Bo=["dev","pre","main"];function br(n,w){let c=[],y=new Set;for(let g of n.links??[]){let U=Bo.map((v)=>g.envBranches?.[v]?.branch||v),O=new Map;U.forEach((v,m)=>{if(!O.has(v))O.set(v,m)});let G=(v)=>{if(!v.url||v.state==="merged")return;let m=JSON.stringify([g.repo,v.url]);if(y.has(m))return;y.add(m),c.push(v.url)};if(w==="all"){let v=[...g.allPrs??[]].sort((m,L)=>{let N=m.branch||"未知分支",I=L.branch||"未知分支";return(O.get(N)??Bo.length)-(O.get(I)??Bo.length)||N.localeCompare(I)||(m.number??0)-(L.number??0)});for(let m of v)G(m)}else{let v=g.envBranches?.[w];for(let m of v?.prs??[])G(m)}}let u=[`Feature 内容
${n.title}`];return u.push(`PR 链接：
${c.length?c.join(`
`):"无该范围内的 PR"}`),{text:u.join(`

`),count:c.length}}function ir({compact:n=!1}){let{useQuery:w}=D(),c=w("diagnostics",{}),y=Object.entries(c.data?.ci??{}).filter(([,u])=>u.error);if(n){if(y.length)return l("span",{className:"compact-diagnostic",title:"展开卡片查看 CI 查询详情",children:["CI 异常 · ",y.length]});return c.data?.syncing?o("span",{className:"compact-diagnostic",role:"status",children:"后台同步中"}):null}if(!y.length)return c.data?.syncing?o("span",{role:"status",children:"后台同步中…"}):null;return l("details",{style:{padding:"8px 12px",maxHeight:220,overflow:"auto"},children:[l("summary",{children:["CI 查询失败：",y.length," 项"]}),y.map(([u,g])=>l("p",{children:[g.stage," / ",g.category||g.error," · 上次成功：",g.checkedAt?new Date(g.checkedAt).toLocaleString():"尚无"," · 下一次重试：",g.retryAt?new Date(g.retryAt).toLocaleString():"待调度"]},u))]})}function lr({icon:n}){return o("span",{className:"brand-logo","aria-hidden":"true",children:o(Co,{icon:n,size:13})})}function ur(){let{mode:n,metadata:w,config:c,actions:y,useQuery:u,host:g}=D(),U=so(),[O,G]=E.useState(!1),v=c?.presentation==="changes"&&!O,m=u("view",{},{enabled:n==="expanded"}),L=u("summary",{},{enabled:n==="compact"}),N=n==="compact"?L:m,I=N.data,T=S(y.refresh,{query:m}),J=S(y.setArchiveStatus,{query:m}),M=S(y.confirmGameCandidate,{query:m}),Q=S(y.undoGameCandidate,{query:m}),R=S(y.discussChange),q=T.status==="pending"||T.status==="unknown",[A,d]=E.useState(""),[$,B]=E.useState("all"),[F,k]=bo("tracker:search",""),[uo,Y]=E.useState({}),[po,P]=E.useState(!1),[z,C]=E.useState({}),X=()=>T.mutate({}),co=async(r,t)=>{let{text:h,count:f}=br(r,t);try{await g.copyText(h),C((p)=>({...p,[r.id]:{message:f?`已复制 ${f} 个 PR`:"已复制文案（无 PR）",error:!1}}))}catch(p){console.error(p),C((H)=>({...H,[r.id]:{message:"复制失败，请重试",error:!0}}))}},V=async(r,t)=>{d("");let h=r?.execution;try{let f=h?.delegationId,p=h?.noteId,H=await U.resources.read({name:"connectedNodes",input:{}});if(H.error)throw Error(H.error);let Z=[...new Set((H.data??[]).flatMap((vo)=>vo.nodes.filter((oo)=>oo.queries.includes("progress")).map((oo)=>oo.noteId)))];if(!p&&r){let vo=await U.resources.read({name:"relatedObjects",input:{}});if(vo.error)throw Error(vo.error);let oo=[...new Set((vo.data??[]).filter((to)=>to.source.objectId===r.id&&Z.includes(to.target.noteId)).map((to)=>JSON.stringify(to.target)))].map((to)=>JSON.parse(to));if(oo.length>1){d("该功能关联多个执行任务，请在执行台核对。");return}if(oo.length===1)p=oo[0].noteId,f=oo[0].objectId}if(!p&&Z.length===1)p=Z[0];if(p)await g.openNote(p,f);else d("没有唯一的关联执行台，请先检查连线。")}catch(f){let p=f instanceof Error?f.message:String(f);d(p),console.error(f)}},W=(r)=>r==="pending"||r==="unknown",x=(r)=>J.mutate({id:r.id,archived:!r.archived}),eo=(r)=>W(J.status),yo=(r)=>Y((t)=>({...t,[r]:!t[r]})),ro=(r,t)=>Boolean(lo(r))||(t==="confirm"?r.status!=="candidate"||!r.previewVerified:r.status!=="adopted")||W(M.status)||W(Q.status),e=(r,t)=>{if(ro(r,t))return;let h=Lo(r);if(!h.success||t==="undo"&&!r.adoptionId)return;if(Y((f)=>({...f,[r.featureId]:!0})),t==="confirm")M.mutate(h.data);else Q.mutate({...h.data,adoptionId:r.adoptionId})},a=m.data?.features??[],j=I?.errors??[],No=E.useMemo(()=>a.filter((r)=>!r.archived),[a]),nr=(L.data?.features??[]).filter((r)=>!r.archived),Po=I?.activeCount??No.length,$o=E.useMemo(()=>a.filter((r)=>r.archived),[a]),no=J.status==="success"?J.data:void 0,Zo=l(wo,{children:[o(K,{mutation:J}),o(K,{mutation:M}),o(K,{mutation:Q}),o(K,{mutation:T}),o(K,{mutation:R}),no&&!no.receiptVerified&&o("p",{role:"alert",children:"归档请求已返回，但台账修订未核对，请查看当前记录。"}),no&&(no.event.status==="failed"||no.event.status==="unconfirmed")&&l("p",{role:"alert",children:["归档已保存，通知状态：",no.event.error.message]}),R.status==="success"&&R.data!==void 0&&o(b,{onPress:()=>void g.openSession(R.data.sessionId).catch((r)=>d(r instanceof Error?r.message:String(r))),children:"打开已准备的讨论会话"})]}),tr=(r,t,h)=>{let f=a.flatMap((p)=>p.gameCandidates).find((p)=>p.id===t&&p.productionId===r.productionId&&p.projectId===r.projectId&&p.featureId===r.featureId);return{blocked:!f||ro(f,h),pending:W(M.status)||W(Q.status),message:f?lo(f)||"":"候选信息已变化，请刷新后重新选择"}},_o=E.useMemo(()=>{let r=a;if($==="archived")r=$o;else if(r=No,$==="has-links")r=r.filter((t)=>t.links&&t.links.length>0);else if($==="pending")r=r.filter((t)=>t.links.some((h)=>["dev","pre","main"].some((f)=>h.envBranches[f]?.merge?.tone==="pending")));else if($==="merged")r=r.filter((t)=>t.links.length>0&&t.totalPrs>0&&t.mergedPrs===t.totalPrs);if(F.trim()){let t=F.trim().toLowerCase();r=r.filter((h)=>h.title.toLowerCase().includes(t)||(h.summary??"").toLowerCase().includes(t)||h.id.toLowerCase().includes(t)||(h.next??"").toLowerCase().includes(t)||h.links.some((f)=>f.repoName.toLowerCase().includes(t)))}return r},[a,No,$o,$,F]),Qo=(r)=>{if(!r.links||r.links.length===0)return o("span",{className:"badge-overall muted",children:"尚未关联项目"});if(r.totalPrs>0&&r.mergedPrs===r.totalPrs)return l("span",{className:"badge-overall ok",children:["✓ 全部合并 (",r.mergedPrs,"/",r.totalPrs,")"]});if(r.mergedPrs>0)return l("span",{className:"badge-overall pending",children:["部分合并 (",r.mergedPrs,"/",r.totalPrs,")"]});if(r.totalPrs>0)return l("span",{className:"badge-overall pending",children:["待合并 (",r.totalPrs," PR)"]});return o("span",{className:"badge-overall muted",children:"未登记 PR"})},Go=(r)=>{if(!r||r.length===0)return null;return r.map((t,h)=>{let f=t.tone?` tone-${t.tone}`:"";return o("a",{href:t.url,target:"_blank",rel:"noopener noreferrer",className:`chip-link${f}`,title:t.title,children:t.label??String(h+1)},h)})},qo=(r,t,h)=>{if(t?.hidden)return null;let f=t?.tone||"muted",p=t?.label||"未知",H=Boolean(t?.stale),Z=f==="ok"?"✓ ":"";return l("div",{className:"stage-row",children:[o("span",{className:"stage-name",children:r}),l("div",{className:"stage-chip",children:[l("span",{className:`chip-status tone-${f}`,children:[Z,p,H?" · 缓存":""]}),h]})]})};if(v)return o(Mo,{mode:n,metadata:w,candidateState:tr,notices:Zo,ready:!N.stale&&!N.error,onDiscuss:(r)=>{R.mutate(r?{productionId:r.productionId}:{})},onPreview:async(r,t)=>{if(!c?.notes?.preview)throw Error("尚未关联试玩便笺，请配置项目便笺关系");await g.openNote(c.notes.preview,`cg:${encodeURIComponent(JSON.stringify({kind:"preview",id:r,revision:t}))}`)},onEngineering:(r)=>{if(G(!0),k(r??""),r)Y((t)=>({...t,[r]:!0}))},onProduction:async(r)=>{if(!c?.notes?.production)throw Error("尚未关联制作便笺，请配置项目便笺关系");await g.openNote(c.notes.production,`cg:${encodeURIComponent(JSON.stringify({projectId:r.projectId,kind:"production",id:r.productionId}))}`)},onCandidate:(r,t,h)=>{let f=a.flatMap((p)=>p.gameCandidates??[]).find((p)=>p.id===t&&p.productionId===r.productionId&&p.projectId===r.projectId&&p.featureId===r.featureId);if(!f)throw Error("候选信息已变化，请刷新后重新选择");return e(f,h)}});if(n==="compact")return l("section",{className:"ft-widget compact",children:[o("style",{children:pr}),l("header",{className:"navbar-compact",children:[l("div",{className:"brand-box",children:[o(lr,{icon:w.icon}),o("span",{className:"brand-title",children:w.name}),l("span",{className:"brand-count",children:[Po," 个功能"]})]}),l("div",{className:"navbar-actions",children:[c?.presentation==="changes"&&o(b,{size:"sm",variant:"tertiary",onPress:()=>{G(!1),k("")},children:"返回改动"}),l("span",{className:"sync-box",children:[o("span",{className:`dot ${q?"busy":""}`}),q?"同步中...":"在线"]}),o("button",{className:"btn-compact-refresh",disabled:q,onClick:()=>void X(),"aria-label":"刷新功能进展",title:"刷新功能进展",children:o("svg",{className:`refresh-spin ${q?"is-spinning":""}`,width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:o("path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16m0 0h5m-5 0v5M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8m0 0h-5m5 0V3"})})})]})]}),l("div",{className:"compact-card-list",children:[nr.slice(0,3).map((r)=>o("article",{className:"feature-card-compact",children:o("div",{className:"compact-feature-card-head",children:l("div",{className:"card-header-compact",children:[l("div",{className:"compact-feature-title-row",children:[o("span",{className:"feature-title",style:{fontSize:"14px"},title:r.title,children:r.title}),o("button",{type:"button",className:"btn-compact-feature-execution",onClick:()=>void V(r),"aria-label":`打开「${r.title}」对应的执行台任务`,title:"打开该功能对应的执行台任务",children:"↗"})]}),l("div",{className:"compact-feature-meta",children:[Qo(r),r.summary&&o("div",{className:"feature-summary",title:r.summary,children:r.summary})]})]})})},r.id)),Po>3&&l("div",{className:"compact-more",children:["还有 ",Po-3," 个功能，展开查看完整矩阵 ↗"]})]}),l("footer",{className:"compact-footer",children:[l("div",{className:"compact-footer-status",children:[o(ir,{compact:!0}),o("span",{className:`compact-ledger-status${j.length>0?" is-warning":N.error||I?.status==="error"?" is-failed":""}`,title:j.length>0?`台账 ${j.length} 条记录无法解析，其他记录仍可操作`:N.error||I?.status==="error"?"状态同步暂不可用":"功能进展自动同步",children:j.length>0?`台账异常 · ${j.length}`:N.error||I?.status==="error"?"同步异常":"自动同步"})]}),l("div",{className:"compact-footer-actions",children:[o("button",{type:"button",className:"btn-compact-execution",onClick:()=>void V(),title:"打开执行台总览",children:"执行台总览 ↗"}),o("a",{href:I?.serverUrl||"http://127.0.0.1:47831",target:"_blank",rel:"noopener noreferrer",style:{color:"var(--link)",fontWeight:550},children:"独立看板 ↗"})]}),T.error&&l("span",{role:"alert",children:["刷新未完成：",T.error.message]}),A&&l("span",{className:"navigation-error",role:"alert",children:["执行台打开失败：",A]})]})]});return l("section",{className:"ft-widget expanded",children:[o(ir,{}),o("style",{children:pr}),o(Eo,{onCreated:(r)=>{B("all"),k(""),Y((t)=>({...t,[r]:!0}))}}),o("header",{className:"navbar",children:l("div",{className:"navbar-inner",children:[l("div",{className:"brand-box",children:[o(lr,{icon:w.icon}),o("span",{className:"brand-title",children:w.name}),l("span",{className:"brand-count",children:[Po," 个功能"]})]}),l("div",{className:"navbar-actions",children:[o(_,{"aria-label":"搜索功能或仓库",value:F,onChange:k,fullWidth:!0,className:"search-box",children:l(_.Group,{children:[o(_.SearchIcon,{}),o(_.Input,{placeholder:"搜索功能或仓库…"}),o(_.ClearButton,{"aria-label":"清空搜索"})]})}),c?.presentation==="changes"&&o(b,{size:"sm",variant:"tertiary",onPress:()=>{G(!1),k("")},children:"返回改动"}),l("span",{className:"sync-box",title:"后台自动同步，数据变化时更新",children:[o("span",{className:`dot ${q||I?.status==="syncing"?"busy":I?.status==="error"?"error":""}`}),q?"同步中...":I?.status==="syncing"?"后台同步中...":I?.status==="error"?"查询异常":"已就绪"]}),o("button",{className:"btn-nav",disabled:q,onClick:()=>void X(),children:"↻ 刷新"}),o("button",{type:"button",className:"btn-nav btn-execution",onClick:()=>void V(),title:"打开执行台总览",children:"对应任务 ↗"}),o("a",{href:I?.serverUrl||"http://127.0.0.1:47831",target:"_blank",rel:"noopener noreferrer",className:"btn-nav",title:"在新标签页打开独立看板",children:"独立页面 ↗"})]})]})}),A&&l("div",{className:"navigation-error expanded-navigation-error",role:"alert",children:["执行台打开失败：",A]}),j.length>0&&l("div",{className:"alert-box ledger-alert",role:"alert",children:[l("strong",{children:["台账有 ",j.length," 条记录无法解析，这些记录暂不可操作，其他记录可正常归档 / 恢复。"]}),o("ul",{className:"alert-list",children:j.map((r)=>l("li",{children:[o("code",{children:r.file.split("/").pop()||r.file})," — ",r.error]},r.file))}),o("span",{className:"alert-hint",children:"请按每条记录的具体错误修复，修复后自动恢复显示，无需重启。"})]}),T.error&&l("p",{role:"alert",children:["刷新未完成：",T.error.message]}),Zo,l("div",{className:"toolbar-strip",children:[l("div",{className:"segmented-control",children:[o("button",{className:`segment-tab ${$==="all"?"active":""}`,onClick:()=>B("all"),children:"全部"}),o("button",{className:`segment-tab ${$==="has-links"?"active":""}`,onClick:()=>B("has-links"),children:"有关联项目"}),o("button",{className:`segment-tab ${$==="pending"?"active":""}`,onClick:()=>B("pending"),children:"进行中"}),o("button",{className:`segment-tab ${$==="merged"?"active":""}`,onClick:()=>B("merged"),children:"已合并"}),l("button",{className:`segment-tab ${$==="archived"?"active":""}`,onClick:()=>B("archived"),children:["已归档 (",$o.length,")"]})]}),o("button",{className:"btn-nav",onClick:()=>P(!po),children:po?"展开全部":"折叠全部"})]}),l("div",{className:"feature-feed",children:[_o.map((r)=>{let t=r.links&&r.links.length>0,h=Boolean(r.body&&r.body.trim()),f=Boolean(uo[r.id]);return l("article",{className:"feature-card",children:[l("header",{className:"card-header",children:[l("div",{className:"card-header-main",children:[l("div",{className:"feature-title-row",children:[o("h2",{className:"feature-title",children:r.title}),Qo(r)]}),r.summary&&o("div",{className:"feature-summary",children:r.summary}),!!r.gameCandidates?.length&&l("div",{className:"feature-summary",children:["游戏创作：",r.gameCandidates.filter((p)=>p.status==="candidate").length," 个试玩候选 · ",r.gameCandidates.filter((p)=>p.status==="adopted").length," 个已采用"]}),l("div",{className:"feature-meta-bar",children:[o("span",{children:"首次记录于 12 小时前"}),r.next&&l(wo,{children:[o("span",{className:"meta-dot",children:"·"}),l("span",{children:[o("b",{children:"下一步："}),r.next]})]}),(h||Boolean(r.gameCandidates?.length))&&l(wo,{children:[o("span",{className:"meta-dot",children:"·"}),o("button",{className:"btn-doc-toggle",onClick:()=>yo(r.id),children:f?"收起决策与记录 ▴":"查看决策与记录 ▾"})]})]})]}),l("div",{className:"card-header-actions",children:[l(s,{children:[l(s.Trigger,{className:"copy-trigger","aria-label":`复制「${r.title}」的功能内容与 PR 链接`,children:["复制文案 ",o("span",{"aria-hidden":"true",children:"▾"})]}),o(s.Popover,{placement:"bottom end",children:l(s.Menu,{"aria-label":`选择「${r.title}」的 PR 范围`,onAction:(p)=>void co(r,String(p)),children:[o(s.Item,{id:"dev",children:"全部 dev"}),o(s.Item,{id:"pre",children:"全部 pre"}),o(s.Item,{id:"main",children:"全部 main"}),o(s.Item,{id:"all",children:"全部分支"})]})})]}),z[r.id]&&o("span",{className:`copy-feedback${z[r.id].error?" is-error":""}`,role:"status",children:z[r.id].message}),o("button",{type:"button",className:"btn-nav btn-execution",onClick:()=>void V(r),title:"打开该功能对应的执行台任务",children:"对应任务 ↗"}),r.autoArchived?o("span",{className:"badge-auto-archived",title:"关联 PR 已合并且各环境部署完成，按交付状态自动归档；交付状态回退时会自动回到进行中，因此没有手动恢复",children:"自动归档"}):o("button",{type:"button",className:"btn-nav",disabled:eo(r.id),onClick:()=>void x(r),title:r.archived?"恢复为进行中":"归档该功能",children:eo(r.id)?J.status==="pending"?"处理中…":"待核实":r.archived?"恢复":"归档"})]})]}),!po&&l("div",{className:"card-body-content",children:[!!r.gameCandidates?.length&&o("div",{className:"ft-candidates","aria-label":"游戏候选",children:r.gameCandidates.filter((p)=>p.status==="candidate").map((p)=>l("div",{className:"ft-candidate",children:[l("span",{children:[rr(p)," · 版本 ",p.commit?.slice(0,8)??"未记录"]}),o("span",{children:p.previewVerified?"试玩检查已通过":"等待试玩检查"}),p.previewVerified&&o("button",{className:"btn-nav",disabled:ro(p,"confirm"),onClick:()=>void e(p,"confirm"),children:"加入我的游戏"}),lo(p)&&o("span",{role:"alert",children:lo(p)})]},p.id))}),t?o("div",{className:"table-scroll",children:l("table",{className:"matrix-table",children:[o("thead",{children:l("tr",{children:[o("th",{className:"col-project",children:"项目 / 仓库"}),o("th",{className:"col-env",children:l("span",{className:"env-header-badge",children:[o("span",{className:"env-dot dev"}),"DEV"]})}),o("th",{className:"col-env",children:l("span",{className:"env-header-badge",children:[o("span",{className:"env-dot pre"}),"PRE"]})}),o("th",{className:"col-env",children:l("span",{className:"env-header-badge",children:[o("span",{className:"env-dot prod"}),"MAIN"]})})]})}),o("tbody",{children:r.links.map((p)=>l("tr",{children:[o("td",{children:l("div",{className:"project-cell",children:[p.url?l("a",{href:p.url,target:"_blank",rel:"noopener noreferrer",className:"project-name-link",children:[o("span",{children:p.repoNameShort}),l("svg",{width:"10",height:"10",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[o("line",{x1:"7",y1:"17",x2:"17",y2:"7"}),o("polyline",{points:"7 7 17 7 17 17"})]})]}):o("span",{className:"project-name-link",children:p.repoNameShort}),p.mappingIssue&&o("div",{role:"status",children:p.mappingIssue}),p.trackingLabel&&!p.mappingIssue&&o("div",{children:p.trackingLabel}),o("div",{className:"project-repo-path",children:p.repoName}),p.branches&&p.branches.length>0&&o("div",{className:"branch-pills",children:p.branches.map((H)=>o("span",{className:"branch-tag",children:H},H))}),o("button",{type:"button",className:"project-execution-link",onClick:()=>void V(r,p),title:`在执行台打开 ${p.repoNameShort} 对应任务`,children:"执行台项目 ↗"})]})}),["dev","pre","main"].map((H)=>{let Z=p.envBranches[H];return o("td",{className:"cell-env",children:l("div",{className:"stage-stack",children:[qo("合并",Z?.merge,Go(Z?.prs)),qo("CI",Z?.ci,Go(Z?.ciLinks)),qo("部署",Z?.deploy,Go(Z?.deploymentLinks))]})},H)})]},p.repo))})]})}):l("div",{className:"empty-links-box",children:[l("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2",children:[o("circle",{cx:"12",cy:"12",r:"10"}),o("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),o("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),o("span",{children:"尚未关联代码仓库 · 当前仅记录技术目标与方案决策"})]}),(h||Boolean(r.gameCandidates?.length))&&f&&l("div",{className:"doc-panel",children:[r.body,r.gameCandidates?.filter((p)=>p.status!=="candidate").map((p)=>l("div",{className:"ft-adoption-record",children:[l("span",{children:[rr(p)," · ",p.status==="adopted"?`已采用于 ${p.adoptedAt??""}`:`已撤销于 ${p.undoneAt??""}`," · 候选 ",p.commit?.slice(0,8)??"未记录"]}),p.status==="adopted"&&o("button",{className:"btn-nav",disabled:ro(p,"undo"),onClick:()=>void e(p,"undo"),children:"撤销采用"}),lo(p)&&o("span",{role:"alert",children:lo(p)})]},p.id))]})]})]},r.id)}),_o.length===0&&o("div",{className:"empty-feed",children:"没有匹配的功能记录"})]})]})}var pr=`
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
`,ki=er(ur);export{ki as default,ur as View};
