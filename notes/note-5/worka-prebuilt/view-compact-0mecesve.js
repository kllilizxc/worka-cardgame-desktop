import{o,c,e,r,v,d}from"./entry-gjxwp211.js";import{J}from"./entry-hc55ch8s.js";import{t,Y}from"./entry-hf6afrfx.js";import{i}from"./entry-0wtkqkkn.js";var j=i(o(),1);var T={0:{get label(){return t("晴")},group:"clear"},1:{get label(){return t("晴间多云")},group:"partly"},2:{get label(){return t("多云")},group:"partly"},3:{get label(){return t("阴")},group:"cloudy"},45:{get label(){return t("有雾")},group:"fog"},48:{get label(){return t("冻雾")},group:"fog"},51:{get label(){return t("毛毛雨")},group:"drizzle"},53:{get label(){return t("毛毛雨")},group:"drizzle"},55:{get label(){return t("浓毛毛雨")},group:"drizzle"},56:{get label(){return t("冻毛毛雨")},group:"drizzle"},57:{get label(){return t("浓冻毛毛雨")},group:"drizzle"},61:{get label(){return t("小雨")},group:"rain"},63:{get label(){return t("中雨")},group:"rain"},65:{get label(){return t("大雨")},group:"rain"},66:{get label(){return t("冻雨")},group:"rain"},67:{get label(){return t("强冻雨")},group:"rain"},71:{get label(){return t("小雪")},group:"snow"},73:{get label(){return t("中雪")},group:"snow"},75:{get label(){return t("大雪")},group:"snow"},77:{get label(){return t("米雪")},group:"snow"},80:{get label(){return t("阵雨")},group:"rain"},81:{get label(){return t("强阵雨")},group:"rain"},82:{get label(){return t("暴雨")},group:"rain"},85:{get label(){return t("阵雪")},group:"snow"},86:{get label(){return t("强阵雪")},group:"snow"},95:{get label(){return t("雷阵雨")},group:"thunder"},96:{get label(){return t("雷阵雨伴冰雹")},group:"thunder"},99:{get label(){return t("强雷雨伴冰雹")},group:"thunder"}};function P(n){return T[n??-1]??{label:t("天气未知"),group:"cloudy"}}var B={clear:{day:"radial-gradient(circle at 86% 26%,rgba(255,201,105,.5) 0%,rgba(255,201,105,0) 58%),linear-gradient(158deg,#16589b 0%,#2867a5 58%,#3374ae 100%)",night:"radial-gradient(circle at 86% 26%,rgba(146,176,255,.22) 0%,rgba(146,176,255,0) 62%),linear-gradient(158deg,#070c22 0%,#161f42 58%,#2b3763 100%)"},partly:{day:"radial-gradient(circle at 86% 26%,rgba(255,214,150,.42) 0%,rgba(255,214,150,0) 56%),linear-gradient(158deg,#144f7d 0%,#245f8d 58%,#2f6e97 100%)",night:"radial-gradient(circle at 86% 26%,rgba(140,170,235,.18) 0%,rgba(140,170,235,0) 58%),linear-gradient(158deg,#0b1229 0%,#1c2647 58%,#334066 100%)"},cloudy:{day:"radial-gradient(circle at 86% 26%,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 58%),linear-gradient(158deg,#2f3c48 0%,#3f4d5c 58%,#4c5b6a 100%)",night:"linear-gradient(158deg,#141a24 0%,#29313d 58%,#3f4854 100%)"},fog:{day:"radial-gradient(circle at 86% 26%,rgba(255,255,255,.18) 0%,rgba(255,255,255,0) 58%),linear-gradient(158deg,#3f4952 0%,#4d5760 58%,#5a646d 100%)",night:"linear-gradient(158deg,#1c2229 0%,#333a42 58%,#4b535c 100%)"},drizzle:{day:"radial-gradient(circle at 86% 26%,rgba(184,222,255,.18) 0%,rgba(184,222,255,0) 58%),linear-gradient(158deg,#1f3a53 0%,#2c4b68 58%,#37597a 100%)",night:"linear-gradient(158deg,#0d1622 0%,#1f2e40 58%,#33475c 100%)"},rain:{day:"radial-gradient(circle at 86% 26%,rgba(184,222,255,.18) 0%,rgba(184,222,255,0) 58%),linear-gradient(158deg,#182f47 0%,#24405e 58%,#2e5075 100%)",night:"linear-gradient(158deg,#0a1220 0%,#1a2a3d 58%,#2c4157 100%)"},snow:{day:"radial-gradient(circle at 86% 26%,rgba(255,255,255,.24) 0%,rgba(255,255,255,0) 58%),linear-gradient(158deg,#2a4a6b 0%,#38587c 58%,#44678c 100%)",night:"linear-gradient(158deg,#101a2c 0%,#223252 58%,#37496b 100%)"},thunder:{day:"radial-gradient(circle at 86% 26%,rgba(255,225,150,.18) 0%,rgba(255,225,150,0) 58%),linear-gradient(158deg,#161c29 0%,#262f42 58%,#364056 100%)",night:"linear-gradient(158deg,#05070f 0%,#161c2c 58%,#2b3346 100%)"}};function A(n,p){return(B[n]??B.cloudy)[p?"day":"night"]}var F={glass:{sun:"#ffd166",sunCore:"#ffb01f",cloud:"rgba(255,255,255,0.96)",cloudBack:"rgba(255,255,255,0.62)",rain:"#c6e4fb",snow:"#f4faff",bolt:"#ffe066",moon:"#eef3ff"},paper:{sun:"#f8c74f",sunCore:"#efa92a",cloud:"#bfd0e2",cloudBack:"#d9e3ee",rain:"#7cb4de",snow:"#b6d1e8",bolt:"#f2b73c",moon:"#c3d2e8"}};function D({ink:n,cx:p,cy:x,r:s,rays:l=!0}){return d(),r("g",{transform:`translate(${p} ${x})`,children:[l?e("g",{stroke:n.sun,strokeWidth:"3",strokeLinecap:"round",children:Array.from({length:8},(a,g)=>{let b=g*45*Math.PI/180;return e("line",{x1:Math.cos(b)*(s+6),y1:Math.sin(b)*(s+6),x2:Math.cos(b)*(s+12),y2:Math.sin(b)*(s+12)},g)})}):null,e("circle",{r:s,fill:n.sunCore}),e("circle",{r:s*0.62,fill:n.sun})]})}function I({ink:n,cx:p,cy:x,r:s}){d();let l=`wx-moon-${j.useId().replace(/[^a-zA-Z0-9]/g,"")}`;return r("g",{children:[r("mask",{id:l,children:[e("rect",{x:"0",y:"0",width:"72",height:"72",fill:"black"}),e("circle",{cx:p,cy:x,r:s,fill:"white"}),e("circle",{cx:p+s*0.62,cy:x-s*0.42,r:s*0.92,fill:"black"})]}),e("circle",{cx:p,cy:x,r:s,fill:n.moon,mask:`url(#${l})`})]})}function f({ink:n,x:p,y:x,scale:s,back:l=!1}){return d(),r("g",{transform:`translate(${p} ${x}) scale(${s})`,fill:l?n.cloudBack:n.cloud,children:[e("circle",{cx:"20",cy:"30",r:"10"}),e("circle",{cx:"33",cy:"23",r:"13.5"}),e("circle",{cx:"46",cy:"30",r:"10"}),e("rect",{x:"18",y:"29",width:"30",height:"11.5",rx:"5.75"})]})}function N({code:n,isDay:p,size:x=46,tone:s="glass"}){d();let{group:l}=P(n),a=F[s],g=!p,b=(w,h)=>r("g",{stroke:a.rain,strokeWidth:"3.2",strokeLinecap:"round",children:[e("line",{x1:"24",y1:w,x2:22,y2:w+h}),e("line",{x1:"36",y1:w,x2:"34",y2:w+h}),e("line",{x1:"48",y1:w,x2:"46",y2:w+h})]}),m=r("g",{fill:a.snow,children:[e("circle",{cx:"24",cy:"47",r:"2.6"}),e("circle",{cx:"36",cy:"47",r:"2.6"}),e("circle",{cx:"48",cy:"47",r:"2.6"}),e("circle",{cx:"30",cy:"56",r:"2.6"}),e("circle",{cx:"42",cy:"56",r:"2.6"})]});return r("svg",{viewBox:"0 0 72 72",width:x,height:x,className:"wx-glyph","aria-hidden":"true",focusable:"false",children:[l==="clear"?g?e(I,{ink:a,cx:36,cy:36,r:15}):e(D,{ink:a,cx:36,cy:36,r:14}):null,l==="partly"?r(c,{children:[g?e(I,{ink:a,cx:26,cy:25,r:11}):e(D,{ink:a,cx:26,cy:25,r:10}),e(f,{ink:a,x:6,y:10,scale:0.95})]}):null,l==="cloudy"?r(c,{children:[e(f,{ink:a,x:-5,y:-6,scale:0.78,back:!0}),e(f,{ink:a,x:9,y:9,scale:0.95})]}):null,l==="fog"?r(c,{children:[e(f,{ink:a,x:6,y:-6,scale:0.95}),r("g",{stroke:a.cloud,strokeWidth:"3",strokeLinecap:"round",opacity:"0.85",children:[e("line",{x1:"12",y1:"45",x2:"60",y2:"45"}),e("line",{x1:"18",y1:"54",x2:"54",y2:"54"}),e("line",{x1:"25",y1:"63",x2:"47",y2:"63"})]})]}):null,l==="drizzle"?r(c,{children:[e(f,{ink:a,x:6,y:-6,scale:0.95}),r("g",{stroke:a.rain,strokeWidth:"3.2",strokeLinecap:"round",children:[e("line",{x1:"26",y1:"44",x2:"24",y2:"50"}),e("line",{x1:"38",y1:"44",x2:"36",y2:"50"}),e("line",{x1:"50",y1:"44",x2:"48",y2:"50"})]})]}):null,l==="rain"?r(c,{children:[e(f,{ink:a,x:6,y:-6,scale:0.95}),b(43,12)]}):null,l==="snow"?r(c,{children:[e(f,{ink:a,x:6,y:-6,scale:0.95}),m]}):null,l==="thunder"?r(c,{children:[e(f,{ink:a,x:6,y:-8,scale:0.95}),e("path",{d:"M38 40 L26 58 L35 58 L31 69 L45 49 L36 49 Z",fill:a.bolt})]}):null]})}function H(n){let p=/T(\d{2})/.exec(n);return p?t("{p0}时",{p0:Number(p[1])}):""}function y(n){return Number.isFinite(n)?String(Math.round(n)):"—"}function R({busy:n,onPress:p,label:x=t("刷新")}){return d(),e("button",{type:"button",className:`wx-iconbtn${n?" is-busy":""}`,onClick:p,disabled:n,"aria-label":x,title:x,children:r("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"1.9",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{d:"M20.5 12a8.5 8.5 0 1 1-2.6-6.1"}),e("path",{d:"M20.6 4.2v5h-5"})]})})}function K(){return d(),r("span",{className:"wx-dots","aria-hidden":"true",children:[e("i",{}),e("i",{}),e("i",{})]})}function Z(){d();let{config:n,useQuery:p,metadata:x,host:s}=J(),l=p("view",{}),a={...Y(l.data,n),...n},g=a.current??null,b=(a.hourly??[]).slice(0,24),m=a.daily??[],w=P(g?.code??m[0]?.code),h=A(w.group,g?.isDay??!0),L=a.status==="error"||!!l.error,k=l.loading&&!l.data,W=a.current?.time?t("观测时间 {p0}",{p0:a.current.time.replace("T"," ")}):t("尚无观测数据"),z=a.place?.name??t("未设置城市"),M=[a.place?.admin1,a.place?.country].filter((u)=>Boolean(u)&&!u.includes(z)&&!z.includes(u)).join(" · "),G=M?`${z} · ${M}`:z,C=()=>s.openNote(x.id),S=(u)=>u();return r("section",{className:"wx wx-compact",style:{background:`linear-gradient(var(--wx-theme-shade, transparent), var(--wx-theme-shade, transparent)), ${h}`},children:[e("style",{children:E}),r("header",{className:"wx-top",children:[r("span",{className:"wx-place",children:[r("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{d:"M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"}),e("circle",{cx:"12",cy:"10",r:"2.6"})]}),G]}),e(R,{busy:k,onPress:()=>void S(()=>C())})]}),g?r(c,{children:[r("div",{className:"wx-hero",children:[r("div",{className:"wx-hero-text",children:[r("div",{className:"wx-temp",children:[y(g.temperature),e("sup",{children:"°"})]}),e("div",{className:"wx-cond",children:w.label}),e("div",{className:"wx-sub",children:t.rich("体感 {p0}° · 最高 {p1}° 最低 {p2}°",{p0:y(g.apparent),p1:y(m[0]?.tMax),p2:y(m[0]?.tMin)})})]}),e(N,{code:g.code,isDay:g.isDay,size:62})]}),b.length>=4?e("div",{className:"wx-strip",children:b.slice(0,6).map((u,O)=>r("div",{className:"wx-strip-cell",children:[e("span",{children:O===0?t("现在"):H(u.time)}),e(N,{code:u.code,isDay:u.isDay,size:22}),r("b",{children:[y(u.temperature),"°"]})]},u.time))}):null,r("footer",{className:"wx-foot",children:[e("span",{className:L?"wx-warn":void 0,children:L?t("更新失败，显示旧数据"):W}),e("span",{children:"Open-Meteo"})]})]}):r("div",{className:"wx-placeholder",children:[e(N,{code:3,isDay:!0,size:44}),e("p",{children:k?t("正在获取天气…"):a.error??(a.place?t("还没有天气数据"):t("选择城市，查看当地天气"))}),e(v,{size:"sm",variant:"secondary",className:"wx-sky-btn",onPress:()=>void S(()=>a.place?C():s.openNote(x.id)),isDisabled:k,children:k?r(c,{children:[t.rich("获取中"),e(K,{})]}):a.place?t("立即获取"):t("选择城市")})]})]})}var E=`
.wx{box-sizing:border-box;width:100%;margin-inline:auto;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:13px;line-height:1.5;border-radius:18px;overflow:hidden;text-shadow:0 1px 3px rgba(4,12,24,.34)}
[data-theme="dark"] .wx{--wx-theme-shade:color-mix(in srgb,var(--wb-surface) 45%,transparent)}
.wx *{box-sizing:border-box}
.wx h3,.wx p,.wx ul{margin:0;padding:0}
.wx sup{font-size:20px;font-weight:400;margin-top:8px;opacity:.8}
.wx-glyph{display:block;filter:drop-shadow(0 3px 7px rgba(6,18,36,.16))}
.wx-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.wx-place{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:600;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wx-top-actions{display:flex;align-items:center;gap:8px}
.wx-iconbtn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:rgba(255,255,255,.2);color:#fff;cursor:pointer;transition:background .15s,transform .15s;text-shadow:none}
.wx-iconbtn:hover{background:rgba(255,255,255,.32)}
.wx-iconbtn:active{transform:scale(.94)}
.wx-iconbtn:disabled{opacity:.6;cursor:default}
.wx-iconbtn.is-busy svg{animation:wx-spin 1s linear infinite}
@keyframes wx-spin{to{transform:rotate(360deg)}}
.wx-glassbtn{padding:5px 11px;border-radius:999px;border:1px solid rgba(255,255,255,.34);background:rgba(255,255,255,.16);color:#fff;font-size:11.5px;font-family:inherit;cursor:pointer;transition:background .15s;text-shadow:none}
.wx-glassbtn:hover{background:rgba(255,255,255,.28)}
.wx-glassbtn:disabled{opacity:.6;cursor:default}
.wx-temp{display:flex;align-items:flex-start;font-size:64px;font-weight:250;line-height:.98;letter-spacing:-.055em;font-variant-numeric:tabular-nums}
.wx-cond{font-size:15px;font-weight:600;margin-top:8px}
.wx-sub{font-size:11.5px;opacity:.86;margin-top:5px}

/* compact */
.wx-compact{min-height:100dvh;box-sizing:border-box;padding:16px 18px 13px;display:flex;flex-direction:column}
.wx-compact .wx-hero{flex:1}
.wx-compact .wx-placeholder{flex:1;align-content:center;padding-block:20px}
.wx-hero{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px}
.wx-hero-text{min-width:0}
.wx-strip{display:grid;grid-template-columns:repeat(6,1fr);gap:2px;margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.24)}
.wx-strip-cell{display:grid;justify-items:center;gap:5px;font-size:10px}
.wx-strip-cell span{opacity:.84;white-space:nowrap}
.wx-strip-cell b{font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}
.wx-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px;font-size:10px;opacity:.88}
.wx-placeholder{display:grid;justify-items:center;gap:10px;padding:18px 0 6px;text-align:center}
.wx-placeholder p{font-size:12px;opacity:.85;max-width:80%}
.wx-placeholder-wide{padding:26px 0 20px}
/* On the sky the call to action is frosted glass in the sky's own ink, not the palette accent. */
.wx-sky-btn{color:#fff!important;background:rgba(255,255,255,.2)!important;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-weight:600}
.wx-sky-btn:hover{background:rgba(255,255,255,.3)!important}

/* expanded */
.wx-expanded{background:var(--wb-paper);color:var(--wb-ink);text-shadow:none;border-radius:18px}
.wx-setup{min-height:100dvh;display:grid;place-items:center;padding:32px 24px}
.wx-setup-content{width:100%;max-width:540px;text-align:center}
.wx-setup-content>.wx-glyph{margin:0 auto 20px}
.wx-setup h2{font-size:24px;font-weight:600;letter-spacing:-.03em}
.wx-setup-content>p{margin:12px 0 28px;color:var(--wb-muted);line-height:1.8}
.wx-setup .wx-search{text-align:left;border:0;padding:0;background:transparent}
.wx-setup .wx-search-field{flex-basis:100%;min-width:0}
.wx-setup .wx-search-row{justify-content:center;row-gap:14px}
.wx-setup-content>small{display:block;margin-top:4px;color:var(--wb-muted);font-size:12px}
.wx-band{padding:20px 26px 22px;color:#fff;text-shadow:0 1px 3px rgba(4,12,24,.34)}
.wx-band-main{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:12px}
.wx-band .wx-temp{font-size:74px}
.wx-band-temp{min-width:0}
.wx-facts{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,.24)}
.wx-facts>div{min-width:0}
.wx-facts span{display:block;font-size:10.5px;opacity:.86;margin-bottom:4px}
.wx-facts b{font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
.wx-facts b small{font-size:10px;font-weight:400;opacity:.82;margin-left:2px}
.wx-body{padding:20px 26px 22px;background:var(--wb-paper)}
.wx-panel+.wx-panel{margin-top:22px}
.wx-panel-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:10px}
.wx-panel-head h3{font-size:13.5px;font-weight:650;color:var(--wb-ink)}
.wx-panel-head span{font-size:11px;color:var(--wb-muted)}
.wx-chart{display:block;width:100%;height:auto}
.wx-chart-temp{font-size:12px;font-weight:600;fill:var(--wb-accent);font-family:inherit}
.wx-chart-temp.is-cool{fill:var(--wb-muted)}
.wx-chart-label{font-size:11px;fill:var(--wb-muted);font-family:inherit}
.wx-days{display:grid;gap:2px}
.wx-day{display:grid;grid-template-columns:48px 30px 1fr 42px 38px 132px 38px;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--wb-line-soft)}
.wx-day:last-child{border-bottom:0}
.wx-day-name{font-size:12.5px;color:var(--wb-ink-soft);font-weight:600}
.wx-day-cond{font-size:12px;color:var(--wb-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wx-day-pop{font-size:11px;color:#6aa8dd;text-align:right;font-variant-numeric:tabular-nums}
.wx-day-min{font-size:12px;color:var(--wb-muted);text-align:right;font-variant-numeric:tabular-nums}
.wx-day-max{font-size:12.5px;color:var(--wb-ink-soft);font-weight:600;text-align:right;font-variant-numeric:tabular-nums}
.wx-day-track{position:relative;display:block;height:5px;border-radius:999px;background:var(--wb-line-soft)}
.wx-day-track i{position:absolute;top:0;height:5px;border-radius:999px;background:linear-gradient(90deg,#7cb4de,#f2b73c)}
.wx-search{margin-bottom:20px;padding:14px 16px;border:1px solid var(--wb-line);border-radius:14px;background:var(--wb-surface)}
.wx-search-row{display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap}
.wx-search-field{flex:1;min-width:200px}
.wx-results{list-style:none;margin-top:12px!important;display:grid;gap:2px}
.wx-results li{display:flex;align-items:center;gap:10px;padding:7px 2px;border-top:1px solid var(--wb-line-soft)}
.wx-result-name{font-size:12.5px;font-weight:600;color:var(--wb-ink-soft)}
.wx-result-area{flex:1;font-size:11px;color:var(--wb-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wx-message{margin-top:10px!important;font-size:11.5px;color:var(--wb-warning)}
.wx-footer{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:22px;padding-top:14px;border-top:1px solid var(--wb-line-soft);font-size:10.5px;color:var(--wb-muted)}
.wx-units{display:inline-flex;border:1px solid var(--wb-line);border-radius:999px;overflow:hidden}
.wx-units button{padding:3px 10px;border:0;background:transparent;color:var(--wb-muted);font-size:11px;font-family:inherit;cursor:pointer}
.wx-units button.is-on{background:var(--wb-ink-soft);color:var(--wb-paper)}
.wx-source{margin-left:auto;text-align:right}
.wx-warn{color:#ffd9c7}
.wx-body .wx-warn{color:var(--wb-warning)}
.wx-dots{display:inline-flex;gap:4px;margin-left:6px;vertical-align:middle}
.wx-dots i{width:4px;height:4px;border-radius:50%;background:currentColor;opacity:.5;animation:wx-blink 1.1s infinite}
.wx-dots i:nth-child(2){animation-delay:.18s}
.wx-dots i:nth-child(3){animation-delay:.36s}
@keyframes wx-blink{0%,80%,100%{opacity:.25}40%{opacity:.9}}
@media(max-width:640px){
  .wx-band{padding:18px 18px 20px}
  .wx-body{padding:14px}
  .wx-search-field{min-width:0;flex-basis:100%}
  .wx input{font-size:16px}
  .wx-glassbtn,.wx-units button{min-height:36px}
  .wx-day>span{min-width:0;overflow-wrap:anywhere}
  .wx-facts{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
  .wx-day{grid-template-columns:40px 24px minmax(0,1fr) 30px 56px 30px;gap:5px}
  .wx-day-pop{display:none}
  .wx-band .wx-temp{font-size:62px}
  .wx-source{margin-left:0;text-align:left}
}
`;export{Z as default};
