import{e,r,ge,p,M,N,b,i,z}from"./entry-79v5dffy.js";var E="",W="",_="",B=[],O=new Map,S=e((t)=>M(t,i()),"sanitizeText"),R=e((t)=>{switch(t.type){case"terminal":return{...t,value:S(t.value)};case"nonterminal":return{...t,name:S(t.name)};case"sequence":return{...t,elements:t.elements.map(R)};case"choice":return{...t,alternatives:t.alternatives.map(R)};case"optional":return{...t,element:R(t.element)};case"repetition":return{...t,element:R(t.element),separator:t.separator?R(t.separator):void 0};case"special":return{...t,text:S(t.text)}}},"sanitizeAstNode"),U=e(()=>{E="",W="",_="",B.length=0,O.clear(),b(),r.debug("[Railroad] Database cleared")},"clear"),I=e((t)=>{E=S(t),r.debug("[Railroad] Title set:",t)},"setTitle"),X=e(()=>E,"getTitle"),j=e((t)=>{let o={...t,name:S(t.name),definition:R(t.definition),comment:t.comment?S(t.comment):void 0};if(r.debug("[Railroad] Adding rule:",o.name),O.has(o.name))r.warn(`[Railroad] Rule '${o.name}' is already defined. Overwriting.`);B.push(o),O.set(o.name,o)},"addRule"),J=e(()=>B,"getRules"),Q=e((t)=>O.get(t),"getRule"),Z=e((t)=>{W=S(t).replace(/^\s+/g,""),r.debug("[Railroad] Accessibility title set:",t)},"setAccTitle"),V=e(()=>W,"getAccTitle"),ee=e((t)=>{_=S(t).replace(/\n\s+/g,`
`),r.debug("[Railroad] Accessibility description set:",t)},"setAccDescription"),te=e(()=>_,"getAccDescription"),re=I,ie=X,K={clear:U,setTitle:I,getTitle:X,addRule:j,getRules:J,getRule:Q,setAccTitle:Z,getAccTitle:V,setAccDescription:ee,getAccDescription:te,setDiagramTitle:re,getDiagramTitle:ie},x={compactMode:!1,padding:10,verticalSeparation:8,horizontalSeparation:10,arcRadius:10,fontSize:14,fontFamily:"monospace",terminalFill:"#FFFFC0",terminalStroke:"#000000",terminalTextColor:"#000000",nonTerminalFill:"#FFFFFF",nonTerminalStroke:"#000000",nonTerminalTextColor:"#000000",lineColor:"#000000",strokeWidth:2,markerFill:"#000000",commentFill:"#E8E8E8",commentStroke:"#888888",commentTextColor:"#666666",specialFill:"#F0E0FF",specialStroke:"#8800CC",ruleNameColor:"#000066",showMarkers:!0,markerRadius:5},ne=/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$|^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s%+,./-]+\)$|^[a-z]+$/i,ae=/^[\w "',.-]+$/,oe=new Set(["compactMode","padding","verticalSeparation","horizontalSeparation","arcRadius","fontSize","fontFamily","terminalFill","terminalStroke","terminalTextColor","nonTerminalFill","nonTerminalStroke","nonTerminalTextColor","lineColor","strokeWidth","markerFill","commentFill","commentStroke","commentTextColor","specialFill","specialStroke","ruleNameColor","showMarkers","markerRadius"]),H=e((t)=>{if(!t)return!1;return Object.keys(t).every((o)=>o==="railroad"||oe.has(o))},"isRailroadStyleOptions"),le=e((t)=>{if(!t)return{};if("railroad"in t&&t.railroad)return t.railroad;return H(t)?t:{}},"extractRailroadOverrides"),se=e((t)=>{if(!t||H(t))return{};let{railroad:o,svgId:s,theme:a,look:n,...l}=t;return l},"extractThemeOverrides"),g=e((t,o)=>{if(typeof t!=="string")return o;let s=t.trim();return ne.test(s)?s:o},"sanitizeColorValue"),q=e((t,o)=>{if(typeof t!=="string")return o;let s=t.trim();return ae.test(s)?s:o},"sanitizeFontFamilyValue"),y=e((t,o)=>{let s=typeof t==="number"?t:typeof t==="string"?Number.parseFloat(t):Number.NaN;return Number.isFinite(s)&&s>=0?s:o},"sanitizeNumberValue"),de=e((t)=>{let o=typeof t==="number"?t:typeof t==="string"?Number.parseFloat(t):Number.NaN;return Number.isFinite(o)&&o>0?o:void 0},"parseThemeFontSize"),ce=e((t)=>{let o=q(t.fontFamily,x.fontFamily),s=de(t.fontSize)??x.fontSize;return{...x,fontFamily:o,fontSize:s,terminalFill:g(t.secondBkg??t.secondaryColor,x.terminalFill),terminalStroke:g(t.secondaryBorderColor??t.lineColor,x.terminalStroke),terminalTextColor:g(t.secondaryTextColor??t.textColor,x.terminalTextColor),nonTerminalFill:g(t.mainBkg??t.background,x.nonTerminalFill),nonTerminalStroke:g(t.primaryBorderColor??t.lineColor,x.nonTerminalStroke),nonTerminalTextColor:g(t.primaryTextColor??t.textColor,x.nonTerminalTextColor),lineColor:g(t.lineColor,x.lineColor),markerFill:g(t.lineColor,x.markerFill),commentFill:g(t.labelBackground??t.tertiaryColor,x.commentFill),commentStroke:g(t.tertiaryBorderColor??t.lineColor,x.commentStroke),commentTextColor:g(t.tertiaryTextColor??t.textColor,x.commentTextColor),specialFill:g(t.tertiaryColor??t.secondaryColor,x.specialFill),specialStroke:g(t.tertiaryBorderColor??t.secondaryBorderColor,x.specialStroke),ruleNameColor:g(t.titleColor??t.textColor,x.ruleNameColor)}},"buildThemeDefaults"),Y=e((t)=>{let o=p(),s={...ge(),...o.themeVariables??{},...se(t)},a=ce(s),n={...o.railroad??{},...le(t)};return{compactMode:n.compactMode??a.compactMode,padding:y(n.padding,a.padding),verticalSeparation:y(n.verticalSeparation,a.verticalSeparation),horizontalSeparation:y(n.horizontalSeparation,a.horizontalSeparation),arcRadius:y(n.arcRadius,a.arcRadius),fontSize:y(n.fontSize,a.fontSize),fontFamily:q(n.fontFamily,a.fontFamily),terminalFill:g(n.terminalFill,a.terminalFill),terminalStroke:g(n.terminalStroke,a.terminalStroke),terminalTextColor:g(n.terminalTextColor,a.terminalTextColor),nonTerminalFill:g(n.nonTerminalFill,a.nonTerminalFill),nonTerminalStroke:g(n.nonTerminalStroke,a.nonTerminalStroke),nonTerminalTextColor:g(n.nonTerminalTextColor,a.nonTerminalTextColor),lineColor:g(n.lineColor,a.lineColor),strokeWidth:y(n.strokeWidth,a.strokeWidth),markerFill:g(n.markerFill,a.markerFill),commentFill:g(n.commentFill,a.commentFill),commentStroke:g(n.commentStroke,a.commentStroke),commentTextColor:g(n.commentTextColor,a.commentTextColor),specialFill:g(n.specialFill,a.specialFill),specialStroke:g(n.specialStroke,a.specialStroke),ruleNameColor:g(n.ruleNameColor,a.ruleNameColor),showMarkers:n.showMarkers??a.showMarkers,markerRadius:y(n.markerRadius,a.markerRadius)}},"buildRailroadStyleOptions"),bt=e((t)=>{let{fontFamily:o,fontSize:s,terminalFill:a,terminalStroke:n,terminalTextColor:l,nonTerminalFill:f,nonTerminalStroke:m,nonTerminalTextColor:d,lineColor:T,strokeWidth:u,markerFill:h,commentFill:k,commentStroke:c,commentTextColor:w,specialFill:A,specialStroke:F,ruleNameColor:v}=Y(t);return`
  .railroad-diagram {
    font-family: ${o};
    font-size: ${s}px;
  }

  .railroad-terminal rect {
    fill: ${a};
    stroke: ${n};
    stroke-width: ${u}px;
  }

  .railroad-terminal text {
    fill: ${l};
    font-family: ${o};
    font-size: ${s}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-nonterminal rect {
    fill: ${f};
    stroke: ${m};
    stroke-width: ${u}px;
  }

  .railroad-nonterminal text {
    fill: ${d};
    font-family: ${o};
    font-size: ${s}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-line {
    stroke: ${T};
    stroke-width: ${u}px;
    fill: none;
  }

  .railroad-start circle,
  .railroad-end circle {
    fill: ${h};
  }

  .railroad-comment ellipse {
    fill: ${k};
    stroke: ${c};
    stroke-width: ${u}px;
  }

  .railroad-comment text {
    fill: ${w};
    font-style: italic;
    font-family: ${o};
    font-size: ${s}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-special rect {
    fill: ${A};
    stroke: ${F};
    stroke-width: ${u}px;
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
    fill: ${v};
    font-family: ${o};
    font-size: ${s}px;
  }

  .railroad-group {
    /* Grouping container, no specific styles */
  }
`},"getStyles"),C=class{constructor(){this.d=""}static{e(this,"PathBuilder")}moveTo(t,o){return this.d+=`M ${t} ${o} `,this}lineTo(t,o){return this.d+=`L ${t} ${o} `,this}horizontalTo(t){return this.d+=`H ${t} `,this}verticalTo(t){return this.d+=`V ${t} `,this}arcTo(t,o,s,a,n,l,f){return this.d+=`A ${t} ${o} ${s} ${a?1:0} ${n?1:0} ${l} ${f} `,this}build(){return this.d.trim()}},me=class{constructor(t,o=Y()){this.textCache=new Map,this.svg=t,this.config=o}static{e(this,"RailroadRenderer")}measureText(t){if(this.textCache.has(t))return this.textCache.get(t);let o=this.svg.append("text").attr("font-family",this.config.fontFamily).attr("font-size",this.config.fontSize).text(t),s=o.node().getBBox(),a={width:s.width,height:s.height};return o.remove(),this.textCache.set(t,a),a}renderTerminal(t,o){let s=this.measureText(o),a=s.width+this.config.padding*2,n=s.height+this.config.padding*2,l=t.append("g").attr("class","railroad-terminal");return l.append("rect").attr("x",0).attr("y",0).attr("width",a).attr("height",n).attr("rx",10).attr("ry",10),l.append("text").attr("x",a/2).attr("y",n/2).text(o),{element:l.node(),dimensions:{width:a,height:n,up:n/2,down:n/2}}}renderNonTerminal(t,o){let s=this.measureText(o),a=s.width+this.config.padding*2,n=s.height+this.config.padding*2,l=t.append("g").attr("class","railroad-nonterminal");return l.append("rect").attr("x",0).attr("y",0).attr("width",a).attr("height",n),l.append("text").attr("x",a/2).attr("y",n/2).text(o),{element:l.node(),dimensions:{width:a,height:n,up:n/2,down:n/2}}}renderSequence(t,o){let s=o.map((d)=>this.renderExpression(t,d)),a=0,n=0,l=0;for(let d of s)a+=d.dimensions.width,n=Math.max(n,d.dimensions.up),l=Math.max(l,d.dimensions.down);a+=(s.length-1)*this.config.horizontalSeparation;let f=t.append("g").attr("class","railroad-sequence"),m=0;for(let d=0;d<s.length;d++){let T=s[d],u=n-T.dimensions.up;if(f.node().appendChild(T.element).setAttribute("transform",`translate(${m}, ${u})`),d<s.length-1){let k=m+T.dimensions.width,c=k+this.config.horizontalSeparation,w=n;f.append("path").attr("class","railroad-line").attr("d",new C().moveTo(k,w).lineTo(c,w).build())}m+=T.dimensions.width+this.config.horizontalSeparation}return{element:f.node(),dimensions:{width:a,height:n+l,up:n,down:l}}}renderChoice(t,o){let s=o.map((h)=>this.renderExpression(t,h)),a=0,n=0;for(let h of s)a=Math.max(a,h.dimensions.width),n+=h.dimensions.height;n+=(s.length-1)*this.config.verticalSeparation;let l=this.config.arcRadius,f=l*4,m=a+f,d=t.append("g").attr("class","railroad-choice"),T=0,u=n/2;for(let h of s){let k=T,c=k+h.dimensions.up,w=l*2+(a-h.dimensions.width)/2;d.node().appendChild(h.element).setAttribute("transform",`translate(${w}, ${k})`);let F=new C,v=c>u;if(c===u)F.moveTo(0,u).lineTo(w,c);else F.moveTo(0,u).arcTo(l,l,0,!1,v,l,u+(v?l:-l)).lineTo(l,c-(v?l:-l)).arcTo(l,l,0,!1,!v,l*2,c).lineTo(w,c);d.append("path").attr("class","railroad-line").attr("d",F.build());let D=new C,P=w+h.dimensions.width,G=m-l*2;if(c===u)D.moveTo(P,c).lineTo(m,u);else D.moveTo(P,c).lineTo(G,c).arcTo(l,l,0,!1,!v,m-l,c+(v?-l:l)).lineTo(m-l,u+(v?l:-l)).arcTo(l,l,0,!1,v,m,u);d.append("path").attr("class","railroad-line").attr("d",D.build()),T+=h.dimensions.height+this.config.verticalSeparation}return{element:d.node(),dimensions:{width:m,height:n,up:u,down:n-u}}}renderOptional(t,o){let s=this.renderExpression(t,o),a=this.config.arcRadius,n=a*2,l=s.dimensions.width+a*4,f=s.dimensions.height+n,m=t.append("g").attr("class","railroad-optional"),d=a*2,T=n;m.node().appendChild(s.element).setAttribute("transform",`translate(${d}, ${T})`);let h=T+s.dimensions.up,k=new C().moveTo(0,h).lineTo(a*2,h);m.append("path").attr("class","railroad-line").attr("d",k.build());let c=new C().moveTo(d+s.dimensions.width,h).lineTo(l,h);m.append("path").attr("class","railroad-line").attr("d",c.build());let w=new C().moveTo(0,h).arcTo(a,a,0,!1,!1,a,h-a).lineTo(a,a).arcTo(a,a,0,!1,!0,a*2,0).lineTo(l-a*2,0).arcTo(a,a,0,!1,!0,l-a,a).lineTo(l-a,h-a).arcTo(a,a,0,!1,!1,l,h);return m.append("path").attr("class","railroad-line").attr("d",w.build()),{element:m.node(),dimensions:{width:l,height:f,up:h,down:f-h}}}renderRepetition(t,o,s){let a=this.renderExpression(t,o),n=this.config.arcRadius,l=n*2,f=a.dimensions.width+n*4,m=s===0,d=a.dimensions.height+l+(m?l:0),T=t.append("g").attr("class","railroad-repetition"),u=n*2,h=m?l:0;T.node().appendChild(a.element).setAttribute("transform",`translate(${u}, ${h})`);let c=h+a.dimensions.up;T.append("path").attr("class","railroad-line").attr("d",new C().moveTo(0,c).lineTo(n*2,c).build()),T.append("path").attr("class","railroad-line").attr("d",new C().moveTo(u+a.dimensions.width,c).lineTo(f,c).build());let w=h+a.dimensions.height+n,A=new C().moveTo(u+a.dimensions.width,c).arcTo(n,n,0,!1,!0,u+a.dimensions.width+n,c+n).lineTo(u+a.dimensions.width+n,w).arcTo(n,n,0,!1,!0,u+a.dimensions.width,w+n).lineTo(n*2,w+n).arcTo(n,n,0,!1,!0,n,w).lineTo(n,c+n).arcTo(n,n,0,!1,!0,n*2,c);if(T.append("path").attr("class","railroad-line").attr("d",A.build()),m){let F=new C().moveTo(0,c).arcTo(n,n,0,!1,!1,n,c-n).lineTo(n,n).arcTo(n,n,0,!1,!0,n*2,0).lineTo(f-n*2,0).arcTo(n,n,0,!1,!0,f-n,n).lineTo(f-n,c-n).arcTo(n,n,0,!1,!1,f,c);T.append("path").attr("class","railroad-line").attr("d",F.build())}return{element:T.node(),dimensions:{width:f,height:d,up:c,down:d-c}}}renderSpecial(t,o){let s=this.measureText("? "+o+" ?"),a=s.width+this.config.padding*2,n=s.height+this.config.padding*2,l=t.append("g").attr("class","railroad-special");return l.append("rect").attr("x",0).attr("y",0).attr("width",a).attr("height",n),l.append("text").attr("x",a/2).attr("y",n/2).text("? "+o+" ?"),{element:l.node(),dimensions:{width:a,height:n,up:n/2,down:n/2}}}renderExpression(t,o){switch(o.type){case"terminal":return this.renderTerminal(t,o.value);case"nonterminal":return this.renderNonTerminal(t,o.name);case"sequence":return this.renderSequence(t,o.elements);case"choice":return this.renderChoice(t,o.alternatives);case"optional":return this.renderOptional(t,o.element);case"repetition":return this.renderRepetition(t,o.element,o.min);case"special":return this.renderSpecial(t,o.text);default:throw Error(`Unknown node type: ${o.type}`)}}renderRule(t,o){let s=this.svg.append("g").attr("class","railroad-rule").attr("transform",`translate(0, ${o})`),a=t.name+" =",n=this.measureText(a).width+20,l=n+20,f=s.append("g"),m=this.renderExpression(f,t.definition),d=Math.max(20,m.dimensions.up),T=d-m.dimensions.up;return f.attr("transform",`translate(${l}, ${T})`),s.append("g").attr("class","railroad-rule-name-group").append("text").attr("class","railroad-rule-name").attr("x",0).attr("y",d).text(a),s.append("g").attr("class","railroad-start").append("circle").attr("cx",n).attr("cy",d).attr("r",this.config.markerRadius),s.append("g").attr("class","railroad-end").append("circle").attr("cx",l+m.dimensions.width+10).attr("cy",d).attr("r",this.config.markerRadius),s.append("path").attr("class","railroad-line").attr("d",new C().moveTo(n+this.config.markerRadius,d).lineTo(l,d).build()),s.append("path").attr("class","railroad-line").attr("d",new C().moveTo(l+m.dimensions.width,d).lineTo(l+m.dimensions.width+10-this.config.markerRadius,d).build()),{height:Math.max(40,T+m.dimensions.height+this.config.padding*2),width:l+m.dimensions.width+10+this.config.markerRadius}}renderDiagram(t){let o=this.config.padding,s=0;for(let a of t){let n=this.renderRule(a,o);o+=n.height+this.config.verticalSeparation,s=Math.max(s,n.width)}return{width:s+this.config.padding*2,height:o+this.config.padding}}},L=e((t,o,s)=>{N(t,o.height,o.width,s),t.attr("viewBox",`0 0 ${o.width} ${o.height}`)},"configureRailroadSvgSize"),he=e((t,o,s)=>{r.debug(`[Railroad] Rendering diagram
`+t);try{let a=z(o);a.attr("class","railroad-diagram");let l=p().railroad?.useMaxWidth??!0,f=K.getRules();if(r.debug(`[Railroad] Rendering ${f.length} rules`),f.length===0){r.warn("[Railroad] No rules to render"),L(a,{height:100,width:200},l);return}let d=new me(a,Y()).renderDiagram(f);L(a,d,l),r.debug("[Railroad] Render complete")}catch(a){throw r.error("[Railroad] Render error:",a),a}},"draw"),vt={draw:he};
export{K,bt,vt};
