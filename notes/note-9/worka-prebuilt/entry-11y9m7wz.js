import{e,r,He,y,G,H,S,i,Q}from"./entry-mmtsa8rn.js";var M="",O="",D="",E=[],N=new Map,v=e((t)=>G(t,i()),"sanitizeText"),z=e((t)=>{switch(t.type){case"terminal":return{...t,value:v(t.value)};case"nonterminal":return{...t,name:v(t.name)};case"sequence":return{...t,elements:t.elements.map(z)};case"choice":return{...t,alternatives:t.alternatives.map(z)};case"optional":return{...t,element:z(t.element)};case"repetition":return{...t,element:z(t.element),separator:t.separator?z(t.separator):void 0};case"special":return{...t,text:v(t.text)}}},"sanitizeAstNode"),q=e(()=>{M="",O="",D="",E.length=0,N.clear(),S(),r.debug("[Railroad] Database cleared")},"clear"),Y=e((t)=>{M=v(t),r.debug("[Railroad] Title set:",t)},"setTitle"),P=e(()=>M,"getTitle"),U=e((t)=>{let o={...t,name:v(t.name),definition:z(t.definition),comment:t.comment?v(t.comment):void 0};if(r.debug("[Railroad] Adding rule:",o.name),N.has(o.name))r.warn(`[Railroad] Rule '${o.name}' is already defined. Overwriting.`);E.push(o),N.set(o.name,o)},"addRule"),j=e(()=>E,"getRules"),K=e((t)=>N.get(t),"getRule"),J=e((t)=>{O=v(t).replace(/^\s+/g,""),r.debug("[Railroad] Accessibility title set:",t)},"setAccTitle"),Z=e(()=>O,"getAccTitle"),V=e((t)=>{D=v(t).replace(/\n\s+/g,`
`),r.debug("[Railroad] Accessibility description set:",t)},"setAccDescription"),ee=e(()=>D,"getAccDescription"),te=Y,re=P,de={clear:q,setTitle:Y,getTitle:P,addRule:U,getRules:j,getRule:K,setAccTitle:J,getAccTitle:Z,setAccDescription:V,getAccDescription:ee,setDiagramTitle:te,getDiagramTitle:re},T={compactMode:!1,padding:10,verticalSeparation:8,horizontalSeparation:10,arcRadius:10,fontSize:14,fontFamily:"monospace",terminalFill:"#FFFFC0",terminalStroke:"#000000",terminalTextColor:"#000000",nonTerminalFill:"#FFFFFF",nonTerminalStroke:"#000000",nonTerminalTextColor:"#000000",lineColor:"#000000",strokeWidth:2,markerFill:"#000000",commentFill:"#E8E8E8",commentStroke:"#888888",commentTextColor:"#666666",specialFill:"#F0E0FF",specialStroke:"#8800CC",ruleNameColor:"#000066",showMarkers:!0,markerRadius:5},ie=/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$|^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s%+,./-]+\)$|^[a-z]+$/i,ne=/^[\w "',.-]+$/,ae=new Set(["compactMode","padding","verticalSeparation","horizontalSeparation","arcRadius","fontSize","fontFamily","terminalFill","terminalStroke","terminalTextColor","nonTerminalFill","nonTerminalStroke","nonTerminalTextColor","lineColor","strokeWidth","markerFill","commentFill","commentStroke","commentTextColor","specialFill","specialStroke","ruleNameColor","showMarkers","markerRadius"]),L=e((t)=>{if(!t)return!1;return Object.keys(t).every((o)=>o==="railroad"||ae.has(o))},"isRailroadStyleOptions"),oe=e((t)=>{if(!t)return{};if("railroad"in t&&t.railroad)return t.railroad;return L(t)?t:{}},"extractRailroadOverrides"),le=e((t)=>{if(!t||L(t))return{};let{railroad:o,svgId:s,theme:a,look:n,...l}=t;return l},"extractThemeOverrides"),u=e((t,o)=>{if(typeof t!=="string")return o;let s=t.trim();return ie.test(s)?s:o},"sanitizeColorValue"),I=e((t,o)=>{if(typeof t!=="string")return o;let s=t.trim();return ne.test(s)?s:o},"sanitizeFontFamilyValue"),R=e((t,o)=>{let s=typeof t==="number"?t:typeof t==="string"?Number.parseFloat(t):Number.NaN;return Number.isFinite(s)&&s>=0?s:o},"sanitizeNumberValue"),se=e((t)=>{let o=typeof t==="number"?t:typeof t==="string"?Number.parseFloat(t):Number.NaN;return Number.isFinite(o)&&o>0?o:void 0},"parseThemeFontSize"),ce=e((t)=>{let o=I(t.fontFamily,T.fontFamily),s=se(t.fontSize)??T.fontSize;return{...T,fontFamily:o,fontSize:s,terminalFill:u(t.secondBkg??t.secondaryColor,T.terminalFill),terminalStroke:u(t.secondaryBorderColor??t.lineColor,T.terminalStroke),terminalTextColor:u(t.secondaryTextColor??t.textColor,T.terminalTextColor),nonTerminalFill:u(t.mainBkg??t.background,T.nonTerminalFill),nonTerminalStroke:u(t.primaryBorderColor??t.lineColor,T.nonTerminalStroke),nonTerminalTextColor:u(t.primaryTextColor??t.textColor,T.nonTerminalTextColor),lineColor:u(t.lineColor,T.lineColor),markerFill:u(t.lineColor,T.markerFill),commentFill:u(t.labelBackground??t.tertiaryColor,T.commentFill),commentStroke:u(t.tertiaryBorderColor??t.lineColor,T.commentStroke),commentTextColor:u(t.tertiaryTextColor??t.textColor,T.commentTextColor),specialFill:u(t.tertiaryColor??t.secondaryColor,T.specialFill),specialStroke:u(t.tertiaryBorderColor??t.secondaryBorderColor,T.specialStroke),ruleNameColor:u(t.titleColor??t.textColor,T.ruleNameColor)}},"buildThemeDefaults"),W=e((t)=>{let o=y(),s={...He(),...o.themeVariables??{},...le(t)},a=ce(s),n={...o.railroad??{},...oe(t)};return{compactMode:n.compactMode??a.compactMode,padding:R(n.padding,a.padding),verticalSeparation:R(n.verticalSeparation,a.verticalSeparation),horizontalSeparation:R(n.horizontalSeparation,a.horizontalSeparation),arcRadius:R(n.arcRadius,a.arcRadius),fontSize:R(n.fontSize,a.fontSize),fontFamily:I(n.fontFamily,a.fontFamily),terminalFill:u(n.terminalFill,a.terminalFill),terminalStroke:u(n.terminalStroke,a.terminalStroke),terminalTextColor:u(n.terminalTextColor,a.terminalTextColor),nonTerminalFill:u(n.nonTerminalFill,a.nonTerminalFill),nonTerminalStroke:u(n.nonTerminalStroke,a.nonTerminalStroke),nonTerminalTextColor:u(n.nonTerminalTextColor,a.nonTerminalTextColor),lineColor:u(n.lineColor,a.lineColor),strokeWidth:R(n.strokeWidth,a.strokeWidth),markerFill:u(n.markerFill,a.markerFill),commentFill:u(n.commentFill,a.commentFill),commentStroke:u(n.commentStroke,a.commentStroke),commentTextColor:u(n.commentTextColor,a.commentTextColor),specialFill:u(n.specialFill,a.specialFill),specialStroke:u(n.specialStroke,a.specialStroke),ruleNameColor:u(n.ruleNameColor,a.ruleNameColor),showMarkers:n.showMarkers??a.showMarkers,markerRadius:R(n.markerRadius,a.markerRadius)}},"buildRailroadStyleOptions"),dr=e((t)=>{let{fontFamily:o,fontSize:s,terminalFill:a,terminalStroke:n,terminalTextColor:l,nonTerminalFill:g,nonTerminalStroke:m,nonTerminalTextColor:d,lineColor:f,strokeWidth:p,markerFill:h,commentFill:C,commentStroke:c,commentTextColor:x,specialFill:b,specialStroke:F,ruleNameColor:k}=W(t);return`
  .railroad-diagram {
    font-family: ${o};
    font-size: ${s}px;
  }

  .railroad-terminal rect {
    fill: ${a};
    stroke: ${n};
    stroke-width: ${p}px;
  }

  .railroad-terminal text {
    fill: ${l};
    font-family: ${o};
    font-size: ${s}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-nonterminal rect {
    fill: ${g};
    stroke: ${m};
    stroke-width: ${p}px;
  }

  .railroad-nonterminal text {
    fill: ${d};
    font-family: ${o};
    font-size: ${s}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-line {
    stroke: ${f};
    stroke-width: ${p}px;
    fill: none;
  }

  .railroad-start circle,
  .railroad-end circle {
    fill: ${h};
  }

  .railroad-comment ellipse {
    fill: ${C};
    stroke: ${c};
    stroke-width: ${p}px;
  }

  .railroad-comment text {
    fill: ${x};
    font-style: italic;
    font-family: ${o};
    font-size: ${s}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-special rect {
    fill: ${b};
    stroke: ${F};
    stroke-width: ${p}px;
    stroke-dasharray: 5,3;
  }

  .railroad-special text {
    fill: ${d};
    font-family: ${o};
    font-size: ${s}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-rule-name {
    font-weight: bold;
    fill: ${k};
    font-family: ${o};
    font-size: ${s}px;
  }

  .railroad-group {
    /* Grouping container, no specific styles */
  }
`},"getStyles"),w=class{constructor(){this.d=""}static{e(this,"PathBuilder")}moveTo(t,o){return this.d+=`M ${t} ${o} `,this}lineTo(t,o){return this.d+=`L ${t} ${o} `,this}horizontalTo(t){return this.d+=`H ${t} `,this}verticalTo(t){return this.d+=`V ${t} `,this}arcTo(t,o,s,a,n,l,g){return this.d+=`A ${t} ${o} ${s} ${a?1:0} ${n?1:0} ${l} ${g} `,this}build(){return this.d.trim()}},me=class{constructor(t,o=W()){this.textCache=new Map,this.svg=t,this.config=o}static{e(this,"RailroadRenderer")}measureText(t){if(this.textCache.has(t))return this.textCache.get(t);let o=this.svg.append("text").attr("font-family",this.config.fontFamily).attr("font-size",this.config.fontSize).text(t),s=o.node().getBBox(),a={width:s.width,height:s.height};return o.remove(),this.textCache.set(t,a),a}renderTerminal(t,o){let s=this.measureText(o),a=s.width+this.config.padding*2,n=s.height+this.config.padding*2,l=t.append("g").attr("class","railroad-terminal");return l.append("rect").attr("x",0).attr("y",0).attr("width",a).attr("height",n).attr("rx",10).attr("ry",10),l.append("text").attr("x",a/2).attr("y",n/2).text(o),{element:l.node(),dimensions:{width:a,height:n,up:n/2,down:n/2}}}renderNonTerminal(t,o){let s=this.measureText(o),a=s.width+this.config.padding*2,n=s.height+this.config.padding*2,l=t.append("g").attr("class","railroad-nonterminal");return l.append("rect").attr("x",0).attr("y",0).attr("width",a).attr("height",n),l.append("text").attr("x",a/2).attr("y",n/2).text(o),{element:l.node(),dimensions:{width:a,height:n,up:n/2,down:n/2}}}renderSequence(t,o){let s=o.map((d)=>this.renderExpression(t,d)),a=0,n=0,l=0;for(let d of s)a+=d.dimensions.width,n=Math.max(n,d.dimensions.up),l=Math.max(l,d.dimensions.down);a+=(s.length-1)*this.config.horizontalSeparation;let g=t.append("g").attr("class","railroad-sequence"),m=0;for(let d=0;d<s.length;d++){let f=s[d],p=n-f.dimensions.up;if(g.node().appendChild(f.element).setAttribute("transform",`translate(${m}, ${p})`),d<s.length-1){let C=m+f.dimensions.width,c=C+this.config.horizontalSeparation,x=n;g.append("path").attr("class","railroad-line").attr("d",new w().moveTo(C,x).lineTo(c,x).build())}m+=f.dimensions.width+this.config.horizontalSeparation}return{element:g.node(),dimensions:{width:a,height:n+l,up:n,down:l}}}renderChoice(t,o){let s=o.map((h)=>this.renderExpression(t,h)),a=0,n=0;for(let h of s)a=Math.max(a,h.dimensions.width),n+=h.dimensions.height;n+=(s.length-1)*this.config.verticalSeparation;let l=this.config.arcRadius,g=l*4,m=a+g,d=t.append("g").attr("class","railroad-choice"),f=0,p=n/2;for(let h of s){let C=f,c=C+h.dimensions.up,x=l*2+(a-h.dimensions.width)/2;d.node().appendChild(h.element).setAttribute("transform",`translate(${x}, ${C})`);let F=new w,k=c>p;if(c===p)F.moveTo(0,p).lineTo(x,c);else F.moveTo(0,p).arcTo(l,l,0,!1,k,l,p+(k?l:-l)).lineTo(l,c-(k?l:-l)).arcTo(l,l,0,!1,!k,l*2,c).lineTo(x,c);d.append("path").attr("class","railroad-line").attr("d",F.build());let A=new w,_=x+h.dimensions.width,X=m-l*2;if(c===p)A.moveTo(_,c).lineTo(m,p);else A.moveTo(_,c).lineTo(X,c).arcTo(l,l,0,!1,!k,m-l,c+(k?-l:l)).lineTo(m-l,p+(k?l:-l)).arcTo(l,l,0,!1,k,m,p);d.append("path").attr("class","railroad-line").attr("d",A.build()),f+=h.dimensions.height+this.config.verticalSeparation}return{element:d.node(),dimensions:{width:m,height:n,up:p,down:n-p}}}renderOptional(t,o){let s=this.renderExpression(t,o),a=this.config.arcRadius,n=a*2,l=s.dimensions.width+a*4,g=s.dimensions.height+n,m=t.append("g").attr("class","railroad-optional"),d=a*2,f=n;m.node().appendChild(s.element).setAttribute("transform",`translate(${d}, ${f})`);let h=f+s.dimensions.up,C=new w().moveTo(0,h).lineTo(a*2,h);m.append("path").attr("class","railroad-line").attr("d",C.build());let c=new w().moveTo(d+s.dimensions.width,h).lineTo(l,h);m.append("path").attr("class","railroad-line").attr("d",c.build());let x=new w().moveTo(0,h).arcTo(a,a,0,!1,!1,a,h-a).lineTo(a,a).arcTo(a,a,0,!1,!0,a*2,0).lineTo(l-a*2,0).arcTo(a,a,0,!1,!0,l-a,a).lineTo(l-a,h-a).arcTo(a,a,0,!1,!1,l,h);return m.append("path").attr("class","railroad-line").attr("d",x.build()),{element:m.node(),dimensions:{width:l,height:g,up:h,down:g-h}}}renderRepetition(t,o,s){let a=this.renderExpression(t,o),n=this.config.arcRadius,l=n*2,g=a.dimensions.width+n*4,m=s===0,d=a.dimensions.height+l+(m?l:0),f=t.append("g").attr("class","railroad-repetition"),p=n*2,h=m?l:0;f.node().appendChild(a.element).setAttribute("transform",`translate(${p}, ${h})`);let c=h+a.dimensions.up;f.append("path").attr("class","railroad-line").attr("d",new w().moveTo(0,c).lineTo(n*2,c).build()),f.append("path").attr("class","railroad-line").attr("d",new w().moveTo(p+a.dimensions.width,c).lineTo(g,c).build());let x=h+a.dimensions.height+n,b=new w().moveTo(p+a.dimensions.width,c).arcTo(n,n,0,!1,!0,p+a.dimensions.width+n,c+n).lineTo(p+a.dimensions.width+n,x).arcTo(n,n,0,!1,!0,p+a.dimensions.width,x+n).lineTo(n*2,x+n).arcTo(n,n,0,!1,!0,n,x).lineTo(n,c+n).arcTo(n,n,0,!1,!0,n*2,c);if(f.append("path").attr("class","railroad-line").attr("d",b.build()),m){let F=new w().moveTo(0,c).arcTo(n,n,0,!1,!1,n,c-n).lineTo(n,n).arcTo(n,n,0,!1,!0,n*2,0).lineTo(g-n*2,0).arcTo(n,n,0,!1,!0,g-n,n).lineTo(g-n,c-n).arcTo(n,n,0,!1,!1,g,c);f.append("path").attr("class","railroad-line").attr("d",F.build())}return{element:f.node(),dimensions:{width:g,height:d,up:c,down:d-c}}}renderSpecial(t,o){let s=this.measureText("? "+o+" ?"),a=s.width+this.config.padding*2,n=s.height+this.config.padding*2,l=t.append("g").attr("class","railroad-special");return l.append("rect").attr("x",0).attr("y",0).attr("width",a).attr("height",n),l.append("text").attr("x",a/2).attr("y",n/2).text("? "+o+" ?"),{element:l.node(),dimensions:{width:a,height:n,up:n/2,down:n/2}}}renderExpression(t,o){switch(o.type){case"terminal":return this.renderTerminal(t,o.value);case"nonterminal":return this.renderNonTerminal(t,o.name);case"sequence":return this.renderSequence(t,o.elements);case"choice":return this.renderChoice(t,o.alternatives);case"optional":return this.renderOptional(t,o.element);case"repetition":return this.renderRepetition(t,o.element,o.min);case"special":return this.renderSpecial(t,o.text);default:throw Error(`Unknown node type: ${o.type}`)}}renderRule(t,o){let s=this.svg.append("g").attr("class","railroad-rule").attr("transform",`translate(0, ${o})`),a=t.name+" =",n=this.measureText(a).width+20,l=n+20,g=s.append("g"),m=this.renderExpression(g,t.definition),d=Math.max(20,m.dimensions.up),f=d-m.dimensions.up;return g.attr("transform",`translate(${l}, ${f})`),s.append("g").attr("class","railroad-rule-name-group").append("text").attr("class","railroad-rule-name").attr("x",0).attr("y",d).text(a),s.append("g").attr("class","railroad-start").append("circle").attr("cx",n).attr("cy",d).attr("r",this.config.markerRadius),s.append("g").attr("class","railroad-end").append("circle").attr("cx",l+m.dimensions.width+10).attr("cy",d).attr("r",this.config.markerRadius),s.append("path").attr("class","railroad-line").attr("d",new w().moveTo(n+this.config.markerRadius,d).lineTo(l,d).build()),s.append("path").attr("class","railroad-line").attr("d",new w().moveTo(l+m.dimensions.width,d).lineTo(l+m.dimensions.width+10-this.config.markerRadius,d).build()),{height:Math.max(40,f+m.dimensions.height+this.config.padding*2),width:l+m.dimensions.width+10+this.config.markerRadius}}renderDiagram(t){let o=this.config.padding,s=0;for(let a of t){let n=this.renderRule(a,o);o+=n.height+this.config.verticalSeparation,s=Math.max(s,n.width)}return{width:s+this.config.padding*2,height:o+this.config.padding}}},B=e((t,o,s)=>{H(t,o.height,o.width,s),t.attr("viewBox",`0 0 ${o.width} ${o.height}`)},"configureRailroadSvgSize"),he=e((t,o,s)=>{r.debug(`[Railroad] Rendering diagram
`+t);try{let a=Q(o);a.attr("class","railroad-diagram");let l=y().railroad?.useMaxWidth??!0,g=de.getRules();if(r.debug(`[Railroad] Rendering ${g.length} rules`),g.length===0){r.warn("[Railroad] No rules to render"),B(a,{height:100,width:200},l);return}let d=new me(a,W()).renderDiagram(g);B(a,d,l),r.debug("[Railroad] Render complete")}catch(a){throw r.error("[Railroad] Render error:",a),a}},"draw"),pr={draw:he};
export{de,dr,pr};
