import{A as Mo,a as go,b as Lo,e as bo,f as o,g,h as Zo,i as Wo,j as ro,k as yo,l as G,m as Go,n as Fo,o as fo,p as Xo,q as T,r as qo,s as Bo,t as k,u as Po,v as Ho,w as Yo,x as _o,z as Co}from"./entry-4857kz7s.js";import{B as po}from"./entry-zg8e4sm9.js";var s=po(go(),1);var No=po(go(),1);function io(){let i=Yo(),w=s.useContext(Zo);if(!w)throw Error("useNote must be rendered inside a mounted note view");let c=Co(),N=_o(),d=s.useMemo(()=>new Proxy({},{get:(a,r)=>typeof r==="string"?(y,$)=>i.invokeAction(r,y,$):void 0}),[i]);function W(a,r,y){let $=Mo(a,r,{...y,client:i.resources}),I=s.useCallback(async()=>{await $.revalidate()},[$.revalidate]);return{data:$.data,loading:$.loading,stale:$.stale,error:$.error,draftSource:$.draftSource,refresh:I}}let V=s.useMemo(()=>({info:(a)=>i.files.info(a),read:(a)=>i.files.read(a),remove:(a)=>i.files.remove(a),put:async(a,r)=>{if(a.size>Lo)throw Error("Note files must be at most 4 MiB");return i.files.put(new Uint8Array(await a.arrayBuffer()),{name:a.name,mime:a.type||"application/octet-stream",requestId:r.requestId})}}),[i]),Z=s.useMemo(()=>({...N,resources:i.resources,resolvePreviewUrl:(a)=>i.resolvePreviewUrl(a),updateSharedState:async(a,r)=>{if(i.note.access?.kind!=="shared"||!i.note.access.actions.includes("state.patch")||!i.note.stateRef)throw Error("This shared note is read-only");return i.store.update(i.note.stateRef,{baseRevision:r,patch:a})}}),[N,i]);return{metadata:w.metadata,mode:w.mode,focus:w.focus,focusRequestId:w.focusRequestId,layout:w.layout,get state(){if(!w.snapshot)throw Error("This query-driven note has no full state snapshot. Use useQuery, or explicitly set defineNoteView({ state: 'legacy', ... }).");return w.snapshot.value},get stateRevision(){if(!w.snapshot)throw Error("This query-driven note has no state revision. Read a versioned query or opt in to legacy state.");return w.snapshot.revision},config:c??{},actions:d,useQuery:W,files:V,host:Z}}var no=po(go(),1);function ao(){return io().actions}function Ao(){return io().config}function ho(){return io().host}function Oo(){let i=io();return no.useMemo(()=>({note:{id:i.metadata.id},resources:i.host.resources,resolvePreviewUrl:i.host.resolvePreviewUrl}),[i.metadata.id,i.host.resources,i.host.resolvePreviewUrl])}function O(i,w={},c){let d=io().useQuery(i,w,{enabled:c?.enabled});return{...d,revalidate:d.refresh}}function So(){let i=io(),w=no.useRef(i);w.current=i;let c=no.useCallback((d)=>w.current.actions.setViewState({patch:d,expectedRevision:w.current.stateRevision}),[]),N=no.useMemo(()=>({note:{id:i.metadata.id},resources:i.host.resources,resolvePreviewUrl:i.host.resolvePreviewUrl}),[i.metadata.id,i.host.resources,i.host.resolvePreviewUrl]);return{metadata:i.metadata,data:i.state,mode:i.mode,focus:i.focus,layout:i.layout,runtime:N,updateData:c}}var $o=po(go(),1);function uo({onCreated:i}){let w=ao(),c=O("projectChoices",{}),[N,d]=$o.useState(!1),W=c.data?.items??[],V=$o.useRef(void 0),[Z,a]=$o.useState(""),r=Wo({key:"create-feature",value:{title:"",summary:"",projectId:""},save:async(b,D)=>{let H=await w.recordFeature({id:D.requestId,baseRevision:null,patch:{title:b.title.trim(),summary:b.summary.trim(),next:"完成规则核对、制作与试玩验收",body:b.summary.trim(),links:[{repo:b.projectId||(W.length===1?W[0].id:""),branches:[]}]}},D);if(!H.registered||!H.id)throw Error("台账未确认保存，请重试当前需求。");if(!D.signal.aborted)V.current=H.id;return{value:{title:"",summary:"",projectId:""}}}}),{title:y,summary:$}=r.value,I=r.value.projectId||(W.length===1?W[0].id:""),L=(b)=>r.set((D)=>({...D,projectId:b})),X=r.saving,Y=r.error?.message??Z,S=(b)=>r.set((D)=>({...D,title:b})),_=(b)=>r.set((D)=>({...D,summary:b}));async function j(){if(!V.current)return;try{await i(V.current),a(""),d(!1)}catch(b){a(`需求已保存，打开失败：${b instanceof Error?b.message:String(b)}`)}}async function C(){if(a(""),I&&y.trim()&&$.trim()&&await r.save())await j()}return g("div",{className:"feature-create",children:[o(G,{variant:"secondary",onPress:()=>d((b)=>!b),isDisabled:X,children:N?"收起新需求":"新建需求"}),N&&g("section",{className:"feature-create-form","aria-label":"新建功能需求",children:[g(Xo,{value:y,onChange:S,isDisabled:X,fullWidth:!0,children:[o(qo,{children:"需求名称"}),o(Fo,{placeholder:"这次想完成什么？"})]}),g(Xo,{value:$,onChange:_,isDisabled:X,fullWidth:!0,children:[o(qo,{children:"目标与验收"}),o(fo,{rows:4,placeholder:"描述结果、约束和验收方式"})]}),g("div",{children:[o("p",{children:"所属项目"}),o("div",{className:"feature-project-choices",children:W.map((b)=>o(G,{variant:I===b.id?"primary":"secondary","aria-pressed":I===b.id,onPress:()=>L(b.id),isDisabled:X,children:b.name},b.id))})]}),c.loading&&o("p",{role:"status",children:"正在读取项目…"}),c.error&&o("p",{role:"alert",children:c.error.message}),!c.loading&&!c.error&&!W.length&&o("p",{role:"alert",children:"尚未关联项目，请先在便笺对话中关联实际项目。"}),Y&&o("p",{role:"alert",children:Y}),Z&&V.current&&o(G,{variant:"secondary",onPress:()=>{j()},children:"查看已创建需求"}),o(G,{onPress:()=>void C(),isDisabled:X||!I||!y.trim()||!$.trim(),children:X?"正在保存需求…":"创建需求并查看"})]}),o("style",{children:".feature-create{padding:12px 20px 0}.feature-create-form{display:flex;flex-direction:column;gap:14px;padding:16px 0;max-width:720px}.feature-create-form p{margin:0 0 8px;font-size:13px}.feature-create-form [role=alert]{color:var(--wb-danger)}.feature-project-choices{display:flex;gap:8px;flex-wrap:wrap}.feature-create-form>.button{align-self:flex-start;min-height:44px}@media(max-width:680px){.feature-create{padding:12px 16px 0}.feature-create-form>.button{width:100%}}"})]})}var K=po(go(),1);var ko=po(go(),1);function Eo({items:i,limit:w,pending:c,busy:N,error:d,onRemove:W,onRefresh:V,children:Z}){let[a,r]=ko.useState(!1);return g("section",{"aria-label":"跨区域固定引用",style:{flexShrink:0,minWidth:0,color:"var(--wb-ink)",fontSize:12},children:[g("div",{style:{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"},children:[g(G,{size:"sm",variant:"tertiary","aria-expanded":a,onPress:()=>r(!a),children:["固定引用 ",i.length,"/",w]}),i.some((y)=>y.warning)&&o("span",{role:"status",style:{color:"var(--wb-warning)"},children:"引用需核对"})]}),g(ro,{open:a,onOpenChange:r,label:"固定引用",style:{width:520,maxWidth:"calc(100% - 32px)",margin:"auto",padding:20,border:0,borderRadius:"var(--wb-radius)",background:"var(--wb-paper)",color:"var(--wb-ink)",boxShadow:"var(--wb-shadow-popover)",boxSizing:"border-box"},children:[g("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12},children:[g("strong",{children:["固定引用 ",i.length,"/",w]}),o(G,{size:"sm",variant:"tertiary",onPress:()=>r(!1),children:"关闭"})]}),o("p",{style:{color:"var(--wb-muted)"},children:"项目内共享，随下一条消息附加。"}),c&&o("p",{role:"status",children:"正在核对…"}),a&&g(Go,{style:{maxHeight:"55dvh",display:"flex",flexDirection:"column",gap:12},children:[Z,!i.length&&o("span",{children:"尚无固定引用。固定不会发送消息或修改对象。"}),i.map((y)=>g("div",{style:{display:"flex",alignItems:"center",gap:8},children:[g("div",{style:{flex:1,minWidth:0,overflowWrap:"anywhere"},children:[o("strong",{children:y.label}),o("div",{style:{color:y.warning?"var(--wb-warning)":"var(--wb-muted)",marginTop:4},children:y.status})]}),o(G,{size:"sm",variant:"tertiary",isDisabled:N,"aria-label":`移除固定引用 ${y.label}`,onPress:()=>W(y.key),children:"移除"})]},y.key)),o(G,{size:"sm",variant:"tertiary",isDisabled:N,onPress:V,children:"重新核对引用"})]}),d&&o("p",{role:"alert",style:{margin:"8px 0 0",overflowWrap:"anywhere"},children:d})]}),d&&!a&&o("p",{role:"alert",style:{margin:"8px 0 0",overflowWrap:"anywhere"},children:d})]})}var xo={draft:"草稿",running:"制作中","needs-input":"需要补充",failed:"制作失败",stale:"版本需核对",cancelled:"已取消",paused:"已暂停",interrupted:"制作中断",generated:"待建立候选",checking:"待试玩检查",review:"待我确认",adopted:"已加入游戏",undone:"已撤销"};function eo({mode:i,metadata:w,busy:c,errors:N,ready:d,onEngineering:W,onDiscuss:V,onPreview:Z,onProduction:a,onCandidate:r}){let y=ao(),$=O("pinnedReferences",{},{enabled:i==="expanded"}),[I,L]=K.useState(!1),[X,Y]=K.useState("");async function S(m){L(!0),Y("");try{await m(),await $.revalidate()}catch(P){Y(P instanceof Error?P.message:String(P))}finally{L(!1)}}let[_,j]=K.useState(""),[C,b]=K.useState("all"),[D,H]=K.useState(),[q,F]=K.useState([]),[E,Uo]=K.useState(""),[f,mo]=K.useState(!1),[t,u]=K.useState(),U=O("changes",{query:_,...C!=="all"?{filter:C}:{},limit:i==="compact"?3:30,...D?{cursor:D}:{}}),B=O("candidateDiff",{productionId:t?.change.productionId||"",candidateId:t?.candidateId||""},{enabled:Boolean(t)}),lo=U.data?.items??[],M=t&&lo.find((m)=>m.id===t.change.id),A=M?.candidates.find((m)=>m.id===t?.candidateId),co=!!M&&M.revision===t?.change.revision&&!!A&&(t?.operation==="undo"?A.status==="adopted":M.stage==="review"&&A.current&&A.previewVerified&&A.status==="candidate");async function zo(m){Uo("");try{await m()}catch(P){Uo(P instanceof Error?P.message:String(P))}}async function h(m){if(f||c)return;mo(!0);try{await zo(m)}finally{mo(!1)}}return g("section",{className:`gc-root gc-${i}`,children:[g("style",{children:[rp,wp]}),g("header",{className:"gc-heading",children:[o(yo,{icon:w.icon,size:20}),o("strong",{children:"改动"}),o("span",{children:U.data?`${U.data.total} 项`:"尚未读取"}),o(G,{size:"sm",variant:"secondary",isDisabled:f||!!c,onPress:()=>void h(()=>V()),children:"提出想法"}),i==="expanded"&&o(G,{size:"sm",variant:"tertiary",onPress:()=>void zo(()=>U.revalidate()),"aria-label":"刷新改动",children:"刷新"})]}),i==="expanded"&&g("div",{className:"gc-tools",children:[o(T,{"aria-label":"搜索改动",value:_,onChange:(m)=>{j(m),H(void 0),F([])},fullWidth:!0,children:g(T.Group,{children:[o(T.SearchIcon,{}),o(T.Input,{placeholder:"搜索改动"}),o(T.ClearButton,{})]})}),g(Po,{"aria-label":"筛选改动状态",value:C,onChange:(m)=>{b(String(m??"all")),H(void 0),F([])},style:{minWidth:160,flexShrink:0},children:[g(Po.Trigger,{children:[o(Po.Value,{}),o(Po.Indicator,{})]}),o(Po.Popover,{children:o(Bo,{children:Object.entries({all:"全部状态",draft:"草稿",running:"制作中",candidate:"待检查或确认",attention:"需处理",adopted:"已加入游戏",undone:"已撤销"}).map(([m,P])=>o(Bo.Item,{id:m,textValue:P,children:P},m))})})]}),o(G,{variant:"tertiary",onPress:()=>W(),children:"工程记录"})]}),(U.error||E)&&o("p",{className:"gc-error",role:"alert",children:U.error?.message||E}),U.stale&&U.data&&o("span",{className:"gc-muted",children:"正在核对最新状态"}),U.loading&&o("p",{role:"status",children:"正在读取改动…"}),!U.loading&&!U.error&&!lo.length&&g("div",{className:"gc-empty",children:[o("strong",{children:_||C!=="all"?"没有匹配的改动":"还没有制作记录"}),o("p",{children:_||C!=="all"?"调整关键词或状态继续查找。":"通过便笺原生对话提出想法，生成结果后在这里查看。"})]}),o(Go,{className:"gc-list",children:lo.map((m)=>o("article",{className:"gc-item",children:i==="compact"?g("div",{className:"gc-item-heading",children:[g("div",{className:"gc-compact-meta",children:[o("small",{children:m.round?`第 ${m.round} 轮`:"制作记录"}),o("span",{className:`gc-stage gc-${m.stage}`,children:xo[m.stage]})]}),o("strong",{title:m.title,children:m.title})]}):g("details",{className:"gc-change",children:[g("summary",{className:"gc-item-heading",children:[o("strong",{title:m.title,children:m.title}),o("span",{className:`gc-stage gc-${m.stage}`,children:xo[m.stage]})]}),g("div",{className:"gc-change-body",children:[g("div",{className:"gc-meta",children:[m.round?`第 ${m.round} 轮 · `:"","需求版本 ",m.requirementRevision," · ",m.productionId]}),m.detail&&o("p",{children:m.detail}),o("div",{className:"gc-candidates",children:m.candidates.filter((P)=>P.current||P.status==="adopted").map((P)=>g("div",{className:"gc-candidate",children:[g("div",{children:[o("strong",{children:P.targetId}),g("span",{className:"gc-meta",children:["候选 ",P.commit.slice(0,8)," · ",P.status==="adopted"?"已加入":P.status==="undone"?"已撤销":P.previewVerified?"试玩检查已通过":"待试玩检查"]})]}),o(cp,{productionId:m.productionId,candidateId:P.id}),o(G,{size:"sm",variant:"tertiary",isDisabled:I||U.stale||!!U.error,onPress:()=>void S(()=>y.pinChangeReference({productionId:m.productionId,revision:m.revision,candidateId:P.id,commit:P.commit})),children:"固定候选"}),o(G,{size:"sm",variant:"secondary",isDisabled:f||!!c,onPress:()=>void h(()=>Z(P.id,P.commit)),children:"试玩这个版本"}),m.stage==="review"&&P.status==="candidate"&&P.current&&P.previewVerified&&o(G,{size:"sm",isDisabled:!!c||!d||U.stale||!!U.error,onPress:()=>u({change:m,candidateId:P.id,operation:"confirm"}),children:"加入游戏"}),P.status==="adopted"&&o(G,{size:"sm",variant:"secondary",isDisabled:!!c||!d||U.stale||!!U.error,onPress:()=>u({change:m,candidateId:P.id,operation:"undo"}),children:"撤销采用"}),N[P.id]&&o("p",{className:"gc-error",role:"alert",children:N[P.id]})]},P.id))}),g("div",{className:"gc-actions",children:[o(G,{size:"sm",variant:"tertiary",isDisabled:I||U.stale||!!U.error,onPress:()=>void S(()=>y.pinChangeReference({productionId:m.productionId,revision:m.revision})),children:"固定改动"}),o(G,{size:"sm",variant:"secondary",isDisabled:f||!!c,onPress:()=>void h(()=>V(m)),children:"继续讨论"}),o(G,{size:"sm",variant:"tertiary",isDisabled:f||!!c,onPress:()=>void h(()=>a(m)),children:"查看制作过程"}),m.featureId&&o(G,{size:"sm",variant:"tertiary",onPress:()=>W(m.featureId),children:"功能与采用记录"})]})]})]})},`${m.projectId}:${m.id}`))}),i==="expanded"&&g("footer",{className:"gc-pagination",children:[o(G,{size:"sm",variant:"tertiary",isDisabled:!q.length,onPress:()=>{H(q.at(-1)),F(q.slice(0,-1))},children:"上一页"}),g("span",{children:["第 ",q.length+1," 页"]}),o(G,{size:"sm",variant:"tertiary",isDisabled:!U.data?.nextCursor||U.stale,onPress:()=>{F([...q,D]),H(U.data?.nextCursor)},children:"下一页"})]}),o("footer",{className:"gc-reference-tools",children:i==="expanded"&&o(Eo,{items:($.data?.items??[]).map((m)=>({key:m.key,label:`${m.title}${m.anchor?` / ${m.anchor}`:""}`,warning:m.freshness!=="current",status:`${m.revision.slice(0,12)} · ${m.freshness==="current"?m.kind==="battleComparison"?"历史报告一致，不代表当前项目":"版本一致":m.freshness==="stale"?"版本已变化，需移除后重新固定":"无法读取或定位"}`})),limit:$.data?.limit??8,pending:$.loading||$.stale,busy:I,error:X||$.error?.message,onRemove:(m)=>void S(()=>y.removePinnedReference({key:m})),onRefresh:()=>void S(()=>$.revalidate()),children:o("span",{children:"使用下方“固定改动”或“固定候选”，不会发送消息或采用候选。"})})}),o(ro,{open:!!t,label:t?.operation==="undo"?"撤销采用":"确认加入游戏",onOpenChange:(m)=>{if(!m&&!c)u(void 0)},children:g("div",{className:"gc-confirm",children:[o("h2",{children:t?.operation==="undo"?"撤销这次采用？":"加入游戏？"}),o("p",{children:t?.change.title}),g("p",{children:["候选 ",A?.commit.slice(0,8)," · ",A?.targetId]}),o("p",{children:t?.operation==="undo"?"将检查采用后的修改；存在冲突时保留当前内容并说明原因。":"仅将这个候选及其依赖加入正式游戏。试玩检查不代表已经完成人工体验。"}),B.loading&&o("p",{role:"status",children:"正在核对候选差异…"}),B.error&&o("p",{role:"alert",children:B.error.message}),B.data&&o(so,{diff:B.data}),!co&&o("p",{className:"gc-error",children:"记录已变化，请关闭并核对当前候选。"}),t&&N[t.candidateId]&&o("p",{className:"gc-error",role:"alert",children:N[t.candidateId]}),g("div",{className:"gc-actions",children:[o(G,{variant:"secondary",isDisabled:!!c,onPress:()=>u(void 0),children:"取消"}),o(G,{isDisabled:!!c||!d||!co||U.stale||!!U.error||t?.operation==="confirm"&&(!B.data?.baseCurrent||B.stale||!!B.error),onPress:()=>void zo(async()=>{if(!t||!co)return;await r(t.change,t.candidateId,t.operation),u(void 0),await U.revalidate()}),children:c?"正在处理…":t?.operation==="undo"?"确认撤销":"确认加入"})]})]})})]})}function cp({productionId:i,candidateId:w}){let[c,N]=K.useState(!1),d=O("candidateDiff",{productionId:i,candidateId:w},{enabled:c});return g("div",{className:"gc-diff",children:[o(G,{size:"sm",variant:"tertiary",onPress:()=>N(!c),children:c?"收起差异":"查看差异"}),c&&g(bo,{children:[d.loading&&o("p",{role:"status",children:"正在读取差异…"}),d.error&&o("p",{role:"alert",children:d.error.message}),d.data&&o(so,{diff:d.data})]})]})}function so({diff:i}){return g("div",{className:"gc-diff-files",children:[o("p",{children:i.comparison==="adoption-record"?"采用时的历史差异":i.baseCurrent?"当前正式内容 → 所选候选":"正式基线已变化，需重新建立候选"}),o(Go,{style:{maxHeight:320},children:i.files.filter((w)=>w.changed).map((w)=>g("details",{children:[g("summary",{children:[w.path," · ",w.beforeBytes," → ",w.afterBytes," 字节"]}),w.binary?o("p",{children:"二进制资源发生变化，请在对应资源视图核对。"}):w.truncated?o("p",{children:"文件较大，请在制作记录中查看完整内容。"}):g("div",{className:"gc-diff-columns",children:[g("div",{children:[o("strong",{children:"变更前"}),o("pre",{children:w.before??"文件不存在"})]}),g("div",{children:[o("strong",{children:"变更后"}),o("pre",{children:w.after??"文件不存在"})]})]})]},w.path))})]})}var wp=".gc-compact .gc-item{box-sizing:border-box;padding:12px;margin-bottom:10px;border-radius:10px;background:var(--wb-surface)}.gc-compact .gc-item:first-child{padding-top:12px}.gc-compact .gc-item-heading{flex-direction:column;align-items:stretch;gap:8px;min-width:0}.gc-compact .gc-item-heading>strong{width:100%;max-width:100%;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;white-space:normal;overflow:hidden;line-height:1.6}.gc-compact-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--wb-muted);font-size:11px}.gc-compact .gc-stage{padding:2px 7px;background:var(--wb-surface-deep);border-radius:999px}.gc-compact .gc-list{overflow-x:hidden}",rp='.gc-reference-tools{display:flex;justify-content:flex-end;flex-shrink:0}.gc-change>summary{cursor:pointer;min-height:44px;align-items:center}.gc-change>summary::before{content:"›";color:var(--wb-muted)}.gc-change[open]>summary::before{content:"⌄"}.gc-change>summary>strong{flex:1}.gc-change:not([open])>summary>strong{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.gc-change>summary:focus-visible{outline:2px solid var(--wb-accent);outline-offset:3px}.gc-change-body{padding-top:12px}.gc-change-body>p{white-space:pre-wrap;overflow-wrap:anywhere}.gc-heading{flex-wrap:wrap}.gc-diff{flex-basis:100%;min-width:0}.gc-diff-files{font-size:12px;overflow-wrap:anywhere}.gc-diff-files details{padding:8px 0}.gc-diff-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.gc-diff-columns pre{white-space:pre-wrap;overflow-wrap:anywhere}.gc-diff-columns>div{min-width:0}@media(max-width:520px){.gc-diff-columns{grid-template-columns:minmax(0,1fr)}}.gc-root{box-sizing:border-box;height:100dvh;display:flex;flex-direction:column;gap:16px;padding:20px;background:var(--wb-paper);color:var(--wb-ink);font-family:var(--wb-font-family);font-size:14px;min-width:0}.gc-heading,.gc-tools,.gc-actions,.gc-pagination{display:flex;align-items:center;gap:10px}.gc-heading>strong{font-size:18px}.gc-heading>span{color:var(--wb-muted);flex:1}.gc-tools>*{min-width:0}.gc-tools>button{flex-shrink:0}.gc-list{flex:1;min-height:0;min-width:0}.gc-item{padding:16px 0}.gc-item:first-child{padding-top:0}.gc-item-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.gc-item-heading>strong{min-width:0;overflow-wrap:anywhere}.gc-stage{font-size:12px;flex-shrink:0;color:var(--wb-muted)}.gc-review{color:var(--wb-accent)}.gc-failed,.gc-error{color:var(--wb-danger)}.gc-adopted{color:var(--wb-success)}.gc-running,.gc-needs-input,.gc-stale{color:var(--wb-warning)}.gc-meta,.gc-muted{display:block;font-size:12px;color:var(--wb-muted);overflow-wrap:anywhere;margin:5px 0}.gc-candidates{display:grid;gap:10px;margin:12px 0}.gc-candidate{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px;background:var(--wb-surface);border-radius:var(--wb-radius-small)}.gc-candidate>div{flex:1;min-width:120px}.gc-candidate>.gc-diff{flex:1 0 100%;min-width:0}.gc-candidate>p{flex-basis:100%;margin:0}.gc-actions{flex-wrap:wrap}.gc-pagination{justify-content:space-between;color:var(--wb-muted)}.gc-confirm{padding:20px;max-width:520px;overflow-wrap:anywhere}.gc-confirm h2{font-size:18px}.gc-empty p{color:var(--wb-muted)}.gc-error{overflow-wrap:anywhere;margin:0}.gc-compact{padding:14px;gap:10px;font-size:12px}.gc-compact .gc-heading>strong{font-size:14px}.gc-compact .gc-item{padding:7px 0}.gc-compact .gc-item-heading>strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gc-compact .gc-stage{font-size:11px}@media(max-width:520px){.gc-expanded{padding:14px}.gc-reference-tools{justify-content:flex-start}.gc-item-heading{flex-direction:column;gap:4px}.gc-tools{flex-wrap:wrap}.gc-candidate{align-items:flex-start}}';var Q=po(go(),1);var jo=(i)=>i.kind==="deck"?`牌组 ${i.targetId}`:i.kind==="story"?`剧情 ${i.targetId}`:i.kind==="documents"?`资料 ${i.targetId}`:`卡牌 ${i.cardId}`,Ro=["dev","pre","main"];function yp(i,w){let c=[],N=new Set;for(let W of i.links??[]){let V=Ro.map((r)=>W.envBranches?.[r]?.branch||r),Z=new Map;V.forEach((r,y)=>{if(!Z.has(r))Z.set(r,y)});let a=(r)=>{if(!r.url||r.state==="merged")return;let y=JSON.stringify([W.repo,r.url]);if(N.has(y))return;N.add(y),c.push(r.url)};if(w==="all"){let r=[...W.allPrs??[]].sort((y,$)=>{let I=y.branch||"未知分支",L=$.branch||"未知分支";return(Z.get(I)??Ro.length)-(Z.get(L)??Ro.length)||I.localeCompare(L)||(y.number??0)-($.number??0)});for(let y of r)a(y)}else{let r=W.envBranches?.[w];for(let y of r?.prs??[])a(y)}}let d=[`Feature 内容
${i.title}`];return d.push(`PR 链接：
${c.length?c.join(`
`):"无该范围内的 PR"}`),{text:d.join(`

`),count:c.length}}function op({compact:i=!1}){let w=O("diagnostics",{}),c=Object.entries(w.data?.ci??{}).filter(([,N])=>N.error);if(i){if(c.length)return g("span",{className:"compact-diagnostic",title:"展开卡片查看 CI 查询详情",children:["CI 异常 · ",c.length]});return w.data?.syncing?o("span",{className:"compact-diagnostic",role:"status",children:"后台同步中"}):null}if(!c.length)return w.data?.syncing?o("span",{role:"status",children:"后台同步中…"}):null;return g("details",{style:{padding:"8px 12px",maxHeight:220,overflow:"auto"},children:[g("summary",{children:["CI 查询失败：",c.length," 项"]}),c.map(([N,d])=>g("p",{children:[d.stage," / ",d.category||d.error," · 上次成功：",d.checkedAt?new Date(d.checkedAt).toLocaleString():"尚无"," · 下一次重试：",d.retryAt?new Date(d.retryAt).toLocaleString():"待调度"]},N))]})}function pp({icon:i}){return o("span",{className:"brand-logo","aria-hidden":"true",children:o(yo,{icon:i,size:13})})}function dp(){let{data:i,mode:w,metadata:c}=So(),N=Oo(),d=Ao(),[W,V]=Q.useState(!1),Z=d?.presentation==="changes"&&!W,a=ao(),r=O(w==="compact"?"summary":"view",{}),y=r.data??i,$=ho(),[I,L]=Q.useState(!1),[X,Y]=Q.useState(""),[S,_]=Q.useState(""),[j,C]=Q.useState(""),[b,D]=Q.useState({}),[H,q]=Q.useState("all"),[F,E]=Q.useState(""),[Uo,f]=Q.useState({}),[mo,t]=Q.useState(!1),[u,U]=Q.useState({}),[B,lo]=Q.useState(""),[M,A]=Q.useState({}),co=async()=>{L(!0);try{await a.refresh({})}catch(p){console.error(p)}finally{L(!1)}},zo=async(p,l)=>{let{text:z,count:v}=yp(p,l);try{await $.copyText(z),U((n)=>({...n,[p.id]:{message:v?`已复制 ${v} 个 PR`:"已复制文案（无 PR）",error:!1}}))}catch(n){console.error(n),U((J)=>({...J,[p.id]:{message:"复制失败，请重试",error:!0}}))}},h=async(p,l)=>{Y("");let z=p?.execution;try{let v=z?.delegationId,n=z?.noteId,J=await N.resources.read({name:"connectedNodes",input:{}});if(J.error)throw Error(J.error);let R=[...new Set((J.data??[]).flatMap((vo)=>vo.nodes.filter((e)=>e.queries.includes("progress")).map((e)=>e.noteId)))];if(!n&&p){let vo=await N.resources.read({name:"relatedObjects",input:{}});if(vo.error)throw Error(vo.error);let e=[...new Set((vo.data??[]).filter((wo)=>wo.source.objectId===p.id&&R.includes(wo.target.noteId)).map((wo)=>JSON.stringify(wo.target)))].map((wo)=>JSON.parse(wo));if(e.length>1){Y("该功能关联多个执行任务，请在执行台核对。");return}if(e.length===1)n=e[0].noteId,v=e[0].objectId}if(!n&&R.length===1)n=R[0];if(n)await $.openNote(n,v);else Y("没有唯一的关联执行台，请先检查连线。")}catch(v){let n=v instanceof Error?v.message:String(v);Y(n),console.error(v)}},m=(p)=>b[p.id]??p.archived,P=async(p)=>{let l=!m(p);_(""),C(p.id),D((z)=>({...z,[p.id]:l}));try{await a.setArchiveStatus({id:p.id,archived:l})}catch(z){D((n)=>{let J={...n};return delete J[p.id],J});let v=z instanceof Error?z.message:String(z);_(`「${p.title}」${l?"归档":"恢复"}失败：${v}`);return}finally{C("")}try{await N.resources.revalidate({name:"view",input:{}}),D((z)=>{let v={...z};return delete v[p.id],v})}catch(z){console.error(z)}},ip=(p)=>{f((l)=>({...l,[p]:!l[p]}))},Qo=async(p,l)=>{lo(p.id),A((v)=>({...v,[p.id]:""}));let z={projectId:p.projectId,productionId:p.productionId,candidateId:p.id,featureId:p.featureId,candidateHash:p.candidateHash,targetBaseRevision:p.targetBaseRevision,validationManifest:p.validationManifest};try{if(l==="confirm")await a.confirmGameCandidate(z);else await a.undoGameCandidate({...z,adoptionId:p.adoptionId});await N.resources.revalidate({name:"view",input:{}})}catch(v){throw A((n)=>({...n,[p.id]:v.message})),v}finally{lo("")}},oo=y?.features??[],x=y?.errors??[],to=Q.useMemo(()=>oo.filter((p)=>!m(p)),[oo,b]),Io=y.activeCount??to.length,Vo=Q.useMemo(()=>oo.filter((p)=>m(p)),[oo,b]),To=Q.useMemo(()=>{let p=oo;if(H==="archived")p=Vo;else if(p=to,H==="has-links")p=p.filter((l)=>l.links&&l.links.length>0);else if(H==="pending")p=p.filter((l)=>l.links.some((z)=>["dev","pre","main"].some((v)=>z.envBranches[v]?.merge?.tone==="pending")));else if(H==="merged")p=p.filter((l)=>l.links.length>0&&l.totalPrs>0&&l.mergedPrs===l.totalPrs);if(F.trim()){let l=F.trim().toLowerCase();p=p.filter((z)=>z.title.toLowerCase().includes(l)||z.summary.toLowerCase().includes(l)||z.id.toLowerCase().includes(l)||z.next.toLowerCase().includes(l)||z.links.some((v)=>v.repoName.toLowerCase().includes(l)))}return p},[oo,to,Vo,H,F]),Ko=(p)=>{if(!p.links||p.links.length===0)return o("span",{className:"badge-overall muted",children:"尚未关联项目"});if(p.totalPrs>0&&p.mergedPrs===p.totalPrs)return g("span",{className:"badge-overall ok",children:["✓ 全部合并 (",p.mergedPrs,"/",p.totalPrs,")"]});if(p.mergedPrs>0)return g("span",{className:"badge-overall pending",children:["部分合并 (",p.mergedPrs,"/",p.totalPrs,")"]});if(p.totalPrs>0)return g("span",{className:"badge-overall pending",children:["待合并 (",p.totalPrs," PR)"]});return o("span",{className:"badge-overall muted",children:"未登记 PR"})},Do=(p)=>{if(!p||p.length===0)return null;return p.map((l,z)=>{let v=l.tone?` tone-${l.tone}`:"";return o("a",{href:l.url,target:"_blank",rel:"noopener noreferrer",className:`chip-link${v}`,title:l.title,children:l.label??String(z+1)},z)})},Jo=(p,l,z)=>{if(l?.hidden)return null;let v=l?.tone||"muted",n=l?.label||"未知",J=Boolean(l?.stale),R=v==="ok"?"✓ ":"";return g("div",{className:"stage-row",children:[o("span",{className:"stage-name",children:p}),g("div",{className:"stage-chip",children:[g("span",{className:`chip-status tone-${v}`,children:[R,n,J?" · 缓存":""]}),z]})]})};if(Z)return o(eo,{mode:w,metadata:c,busy:B,errors:M,ready:!r.stale&&!r.error,onDiscuss:async(p)=>{let l=await a.discussChange(p?{productionId:p.productionId}:{});await $.openSession(l.sessionId)},onPreview:async(p,l)=>{if(!d?.notes?.preview)throw Error("尚未关联试玩便笺，请配置项目便笺关系");await $.openNote(d.notes.preview,`cg:${encodeURIComponent(JSON.stringify({kind:"preview",id:p,revision:l}))}`)},onEngineering:(p)=>{if(V(!0),E(p??""),p)f((l)=>({...l,[p]:!0}))},onProduction:async(p)=>{if(!d?.notes?.production)throw Error("尚未关联制作便笺，请配置项目便笺关系");await $.openNote(d.notes.production,`cg:${encodeURIComponent(JSON.stringify({projectId:p.projectId,kind:"production",id:p.productionId}))}`)},onCandidate:async(p,l,z)=>{let v=oo.flatMap((n)=>n.gameCandidates??[]).find((n)=>n.id===l&&n.productionId===p.productionId&&n.projectId===p.projectId&&n.featureId===p.featureId);if(!v)throw Error("候选信息已变化，请刷新后重新选择");await Qo(v,z)}});if(w==="compact")return g("section",{className:"ft-widget compact",children:[o("style",{children:gp}),g("header",{className:"navbar-compact",children:[g("div",{className:"brand-box",children:[o(pp,{icon:c.icon}),o("span",{className:"brand-title",children:c.name}),g("span",{className:"brand-count",children:[Io," 个功能"]})]}),g("div",{className:"navbar-actions",children:[d?.presentation==="changes"&&o(G,{size:"sm",variant:"tertiary",onPress:()=>{V(!1),E("")},children:"返回改动"}),g("span",{className:"sync-box",children:[o("span",{className:`dot ${I?"busy":""}`}),I?"同步中...":"在线"]}),o("button",{className:"btn-compact-refresh",disabled:I,onClick:()=>void co(),"aria-label":"刷新功能进展",title:"刷新功能进展",children:o("svg",{className:`refresh-spin ${I?"is-spinning":""}`,width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:o("path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16m0 0h5m-5 0v5M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8m0 0h-5m5 0V3"})})})]})]}),g("div",{className:"compact-card-list",children:[to.slice(0,3).map((p)=>o("article",{className:"feature-card-compact",children:o("div",{className:"compact-feature-card-head",children:g("div",{className:"card-header-compact",children:[g("div",{className:"compact-feature-title-row",children:[o("span",{className:"feature-title",style:{fontSize:"14px"},title:p.title,children:p.title}),o("button",{type:"button",className:"btn-compact-feature-execution",onClick:()=>void h(p),"aria-label":`打开「${p.title}」对应的执行台任务`,title:"打开该功能对应的执行台任务",children:"↗"})]}),g("div",{className:"compact-feature-meta",children:[Ko(p),p.summary&&o("div",{className:"feature-summary",title:p.summary,children:p.summary})]})]})})},p.id)),Io>3&&g("div",{className:"compact-more",children:["还有 ",Io-3," 个功能，展开查看完整矩阵 ↗"]})]}),g("footer",{className:"compact-footer",children:[g("div",{className:"compact-footer-status",children:[o(op,{compact:!0}),o("span",{className:`compact-ledger-status${x.length>0?" is-warning":r.error||y?.status==="error"?" is-failed":""}`,title:x.length>0?`台账 ${x.length} 条记录无法解析，其他记录仍可操作`:r.error||y?.status==="error"?"状态同步暂不可用":"功能进展自动同步",children:x.length>0?`台账异常 · ${x.length}`:r.error||y?.status==="error"?"同步异常":"自动同步"})]}),g("div",{className:"compact-footer-actions",children:[o("button",{type:"button",className:"btn-compact-execution",onClick:()=>void h(),title:"打开执行台总览",children:"执行台总览 ↗"}),o("a",{href:y?.serverUrl||"http://127.0.0.1:47831",target:"_blank",rel:"noopener noreferrer",style:{color:"var(--link)",fontWeight:550},children:"独立看板 ↗"})]}),X&&g("span",{className:"navigation-error",role:"alert",children:["执行台打开失败：",X]})]})]});return g("section",{className:"ft-widget expanded",children:[o(op,{}),o("style",{children:gp}),o(uo,{onCreated:(p)=>{q("all"),E(""),f((l)=>({...l,[p]:!0}))}}),o("header",{className:"navbar",children:g("div",{className:"navbar-inner",children:[g("div",{className:"brand-box",children:[o(pp,{icon:c.icon}),o("span",{className:"brand-title",children:c.name}),g("span",{className:"brand-count",children:[Io," 个功能"]})]}),g("div",{className:"navbar-actions",children:[o(T,{"aria-label":"搜索功能或仓库",value:F,onChange:E,fullWidth:!0,className:"search-box",children:g(T.Group,{children:[o(T.SearchIcon,{}),o(T.Input,{placeholder:"搜索功能或仓库…"}),o(T.ClearButton,{"aria-label":"清空搜索"})]})}),d?.presentation==="changes"&&o(G,{size:"sm",variant:"tertiary",onPress:()=>{V(!1),E("")},children:"返回改动"}),g("span",{className:"sync-box",title:"后台自动同步，数据变化时更新",children:[o("span",{className:`dot ${I||y?.status==="syncing"?"busy":y?.status==="error"?"error":""}`}),I?"同步中...":y?.status==="syncing"?"后台同步中...":y?.status==="error"?"查询异常":"已就绪"]}),o("button",{className:"btn-nav",disabled:I,onClick:()=>void co(),children:"↻ 刷新"}),o("button",{type:"button",className:"btn-nav btn-execution",onClick:()=>void h(),title:"打开执行台总览",children:"对应任务 ↗"}),o("a",{href:y?.serverUrl||"http://127.0.0.1:47831",target:"_blank",rel:"noopener noreferrer",className:"btn-nav",title:"在新标签页打开独立看板",children:"独立页面 ↗"})]})]})}),X&&g("div",{className:"navigation-error expanded-navigation-error",role:"alert",children:["执行台打开失败：",X]}),x.length>0&&g("div",{className:"alert-box ledger-alert",role:"alert",children:[g("strong",{children:["台账有 ",x.length," 条记录无法解析，这些记录暂不可操作，其他记录可正常归档 / 恢复。"]}),o("ul",{className:"alert-list",children:x.map((p)=>g("li",{children:[o("code",{children:p.file.split("/").pop()||p.file})," — ",p.error]},p.file))}),o("span",{className:"alert-hint",children:"请按每条记录的具体错误修复，修复后自动恢复显示，无需重启。"})]}),S&&g("div",{className:"alert-box archive-alert",role:"alert",children:[o("span",{children:S}),o("button",{type:"button",className:"alert-dismiss",onClick:()=>_(""),"aria-label":"关闭提示",children:"×"})]}),g("div",{className:"toolbar-strip",children:[g("div",{className:"segmented-control",children:[o("button",{className:`segment-tab ${H==="all"?"active":""}`,onClick:()=>q("all"),children:"全部"}),o("button",{className:`segment-tab ${H==="has-links"?"active":""}`,onClick:()=>q("has-links"),children:"有关联项目"}),o("button",{className:`segment-tab ${H==="pending"?"active":""}`,onClick:()=>q("pending"),children:"进行中"}),o("button",{className:`segment-tab ${H==="merged"?"active":""}`,onClick:()=>q("merged"),children:"已合并"}),g("button",{className:`segment-tab ${H==="archived"?"active":""}`,onClick:()=>q("archived"),children:["已归档 (",Vo.length,")"]})]}),o("button",{className:"btn-nav",onClick:()=>t(!mo),children:mo?"展开全部":"折叠全部"})]}),g("div",{className:"feature-feed",children:[To.map((p)=>{let l=p.links&&p.links.length>0,z=Boolean(p.body&&p.body.trim()),v=Boolean(Uo[p.id]);return g("article",{className:"feature-card",children:[g("header",{className:"card-header",children:[g("div",{className:"card-header-main",children:[g("div",{className:"feature-title-row",children:[o("h2",{className:"feature-title",children:p.title}),Ko(p)]}),p.summary&&o("div",{className:"feature-summary",children:p.summary}),!!p.gameCandidates?.length&&g("div",{className:"feature-summary",children:["游戏创作：",p.gameCandidates.filter((n)=>n.status==="candidate").length," 个试玩候选 · ",p.gameCandidates.filter((n)=>n.status==="adopted").length," 个已采用"]}),g("div",{className:"feature-meta-bar",children:[o("span",{children:"首次记录于 12 小时前"}),p.next&&g(bo,{children:[o("span",{className:"meta-dot",children:"·"}),g("span",{children:[o("b",{children:"下一步："}),p.next]})]}),(z||Boolean(p.gameCandidates?.length))&&g(bo,{children:[o("span",{className:"meta-dot",children:"·"}),o("button",{className:"btn-doc-toggle",onClick:()=>ip(p.id),children:v?"收起决策与记录 ▴":"查看决策与记录 ▾"})]})]})]}),g("div",{className:"card-header-actions",children:[g(k,{children:[g(k.Trigger,{className:"copy-trigger","aria-label":`复制「${p.title}」的功能内容与 PR 链接`,children:["复制文案 ",o("span",{"aria-hidden":"true",children:"▾"})]}),o(k.Popover,{placement:"bottom end",children:g(k.Menu,{"aria-label":`选择「${p.title}」的 PR 范围`,onAction:(n)=>void zo(p,String(n)),children:[o(k.Item,{id:"dev",children:"全部 dev"}),o(k.Item,{id:"pre",children:"全部 pre"}),o(k.Item,{id:"main",children:"全部 main"}),o(k.Item,{id:"all",children:"全部分支"})]})})]}),u[p.id]&&o("span",{className:`copy-feedback${u[p.id].error?" is-error":""}`,role:"status",children:u[p.id].message}),o("button",{type:"button",className:"btn-nav btn-execution",onClick:()=>void h(p),title:"打开该功能对应的执行台任务",children:"对应任务 ↗"}),p.autoArchived?o("span",{className:"badge-auto-archived",title:"关联 PR 已合并且各环境部署完成，按交付状态自动归档；交付状态回退时会自动回到进行中，因此没有手动恢复",children:"自动归档"}):o("button",{type:"button",className:"btn-nav",disabled:j===p.id,onClick:()=>void P(p),title:m(p)?"恢复为进行中":"归档该功能",children:j===p.id?"处理中…":m(p)?"恢复":"归档"})]})]}),!mo&&g("div",{className:"card-body-content",children:[!!p.gameCandidates?.length&&o("div",{className:"ft-candidates","aria-label":"游戏候选",children:p.gameCandidates.filter((n)=>n.status==="candidate").map((n)=>g("div",{className:"ft-candidate",children:[g("span",{children:[jo(n)," · 版本 ",n.commit.slice(0,8)]}),o("span",{children:n.previewVerified?"试玩检查已通过":"等待试玩检查"}),n.previewVerified&&o("button",{className:"btn-nav",disabled:Boolean(B),onClick:()=>void Qo(n,"confirm").catch(()=>{return}),children:"加入我的游戏"}),M[n.id]&&o("span",{role:"alert",children:M[n.id]})]},n.id))}),l?o("div",{className:"table-scroll",children:g("table",{className:"matrix-table",children:[o("thead",{children:g("tr",{children:[o("th",{className:"col-project",children:"项目 / 仓库"}),o("th",{className:"col-env",children:g("span",{className:"env-header-badge",children:[o("span",{className:"env-dot dev"}),"DEV"]})}),o("th",{className:"col-env",children:g("span",{className:"env-header-badge",children:[o("span",{className:"env-dot pre"}),"PRE"]})}),o("th",{className:"col-env",children:g("span",{className:"env-header-badge",children:[o("span",{className:"env-dot prod"}),"MAIN"]})})]})}),o("tbody",{children:p.links.map((n)=>g("tr",{children:[o("td",{children:g("div",{className:"project-cell",children:[n.url?g("a",{href:n.url,target:"_blank",rel:"noopener noreferrer",className:"project-name-link",children:[o("span",{children:n.repoNameShort}),g("svg",{width:"10",height:"10",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[o("line",{x1:"7",y1:"17",x2:"17",y2:"7"}),o("polyline",{points:"7 7 17 7 17 17"})]})]}):o("span",{className:"project-name-link",children:n.repoNameShort}),n.mappingIssue&&o("div",{role:"status",children:n.mappingIssue}),n.trackingLabel&&!n.mappingIssue&&o("div",{children:n.trackingLabel}),o("div",{className:"project-repo-path",children:n.repoName}),n.branches&&n.branches.length>0&&o("div",{className:"branch-pills",children:n.branches.map((J)=>o("span",{className:"branch-tag",children:J},J))}),o("button",{type:"button",className:"project-execution-link",onClick:()=>void h(p,n),title:`在执行台打开 ${n.repoNameShort} 对应任务`,children:"执行台项目 ↗"})]})}),["dev","pre","main"].map((J)=>{let R=n.envBranches[J];return o("td",{className:"cell-env",children:g("div",{className:"stage-stack",children:[Jo("合并",R?.merge,Do(R?.prs)),Jo("CI",R?.ci,Do(R?.ciLinks)),Jo("部署",R?.deploy,Do(R?.deploymentLinks))]})},J)})]},n.repo))})]})}):g("div",{className:"empty-links-box",children:[g("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2",children:[o("circle",{cx:"12",cy:"12",r:"10"}),o("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),o("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),o("span",{children:"尚未关联代码仓库 · 当前仅记录技术目标与方案决策"})]}),(z||Boolean(p.gameCandidates?.length))&&v&&g("div",{className:"doc-panel",children:[p.body,p.gameCandidates?.filter((n)=>n.status!=="candidate").map((n)=>g("div",{className:"ft-adoption-record",children:[g("span",{children:[jo(n)," · ",n.status==="adopted"?`已采用于 ${n.adoptedAt??""}`:`已撤销于 ${n.undoneAt??""}`," · 候选 ",n.commit.slice(0,8)]}),n.status==="adopted"&&o("button",{className:"btn-nav",disabled:Boolean(B),onClick:()=>void Qo(n,"undo").catch(()=>{return}),children:"撤销采用"}),M[n.id]&&o("span",{role:"alert",children:M[n.id]})]},n.id))]})]})]},p.id)}),To.length===0&&o("div",{className:"empty-feed",children:"没有匹配的功能记录"})]})]})}var gp=`
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
`,dg=Ho(dp);export{dg as default,dp as View};
