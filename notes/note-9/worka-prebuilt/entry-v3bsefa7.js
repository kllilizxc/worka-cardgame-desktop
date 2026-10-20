import{f as h}from"./entry-jqw0qfy9.js";import{Bf as g,If as R,Nf as p,Uf as c,if as _,vf as z}from"./entry-n67ezgch.js";import{ag as N}from"./entry-2d6vybcz.js";import{$g as w}from"./entry-6228z9nn.js";var O="",Y="",D="",C=[],A=new Map,W=w((q)=>{return g(q,c())},"sanitizeText"),F=w((q)=>{switch(q.type){case"terminal":return{...q,value:W(q.value)};case"nonterminal":return{...q,name:W(q.name)};case"sequence":return{...q,elements:q.elements.map(F)};case"choice":return{...q,alternatives:q.alternatives.map(F)};case"optional":return{...q,element:F(q.element)};case"repetition":return{...q,element:F(q.element),separator:q.separator?F(q.separator):void 0};case"special":return{...q,text:W(q.text)}}},"sanitizeAstNode"),n=w(()=>{O="",Y="",D="",C.length=0,A.clear(),p(),N.debug("[Railroad] Database cleared")},"clear"),m=w((q)=>{O=W(q),N.debug("[Railroad] Title set:",q)},"setTitle"),u=w(()=>{return O},"getTitle"),l=w((q)=>{let Z={...q,name:W(q.name),definition:F(q.definition),comment:q.comment?W(q.comment):void 0};if(N.debug("[Railroad] Adding rule:",Z.name),A.has(Z.name))N.warn(`[Railroad] Rule '${Z.name}' is already defined. Overwriting.`);C.push(Z),A.set(Z.name,Z)},"addRule"),r=w(()=>{return C},"getRules"),i=w((q)=>{return A.get(q)},"getRule"),t=w((q)=>{Y=W(q).replace(/^\s+/g,""),N.debug("[Railroad] Accessibility title set:",q)},"setAccTitle"),a=w(()=>{return Y},"getAccTitle"),e=w((q)=>{D=W(q).replace(/\n\s+/g,`
`),N.debug("[Railroad] Accessibility description set:",q)},"setAccDescription"),qq=w(()=>{return D},"getAccDescription"),$q=m,Qq=u,Zq={clear:n,setTitle:m,getTitle:u,addRule:l,getRules:r,getRule:i,setAccTitle:t,getAccTitle:a,setAccDescription:e,getAccDescription:qq,setDiagramTitle:$q,getDiagramTitle:Qq},k={compactMode:!1,padding:10,verticalSeparation:8,horizontalSeparation:10,arcRadius:10,fontSize:14,fontFamily:"monospace",terminalFill:"#FFFFC0",terminalStroke:"#000000",terminalTextColor:"#000000",nonTerminalFill:"#FFFFFF",nonTerminalStroke:"#000000",nonTerminalTextColor:"#000000",lineColor:"#000000",strokeWidth:2,markerFill:"#000000",commentFill:"#E8E8E8",commentStroke:"#888888",commentTextColor:"#666666",specialFill:"#F0E0FF",specialStroke:"#8800CC",ruleNameColor:"#000066",showMarkers:!0,markerRadius:5},Jq=/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$|^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s%+,./-]+\)$|^[a-z]+$/i,Kq=/^[\w "',.-]+$/,jq=new Set(["compactMode","padding","verticalSeparation","horizontalSeparation","arcRadius","fontSize","fontFamily","terminalFill","terminalStroke","terminalTextColor","nonTerminalFill","nonTerminalStroke","nonTerminalTextColor","lineColor","strokeWidth","markerFill","commentFill","commentStroke","commentTextColor","specialFill","specialStroke","ruleNameColor","showMarkers","markerRadius"]),d=w((q)=>{if(!q)return!1;return Object.keys(q).every((Z)=>Z==="railroad"||jq.has(Z))},"isRailroadStyleOptions"),Mq=w((q)=>{if(!q)return{};if("railroad"in q&&q.railroad)return q.railroad;return d(q)?q:{}},"extractRailroadOverrides"),Hq=w((q)=>{if(!q||d(q))return{};let{railroad:Z,svgId:K,theme:Q,look:$,...J}=q;return J},"extractThemeOverrides"),X=w((q,Z)=>{if(typeof q!=="string")return Z;let K=q.trim();return Jq.test(K)?K:Z},"sanitizeColorValue"),s=w((q,Z)=>{if(typeof q!=="string")return Z;let K=q.trim();return Kq.test(K)?K:Z},"sanitizeFontFamilyValue"),v=w((q,Z)=>{let K=typeof q==="number"?q:typeof q==="string"?Number.parseFloat(q):Number.NaN;return Number.isFinite(K)&&K>=0?K:Z},"sanitizeNumberValue"),Gq=w((q)=>{let Z=typeof q==="number"?q:typeof q==="string"?Number.parseFloat(q):Number.NaN;return Number.isFinite(Z)&&Z>0?Z:void 0},"parseThemeFontSize"),Bq=w((q)=>{let Z=s(q.fontFamily,k.fontFamily),K=Gq(q.fontSize)??k.fontSize;return{...k,fontFamily:Z,fontSize:K,terminalFill:X(q.secondBkg??q.secondaryColor,k.terminalFill),terminalStroke:X(q.secondaryBorderColor??q.lineColor,k.terminalStroke),terminalTextColor:X(q.secondaryTextColor??q.textColor,k.terminalTextColor),nonTerminalFill:X(q.mainBkg??q.background,k.nonTerminalFill),nonTerminalStroke:X(q.primaryBorderColor??q.lineColor,k.nonTerminalStroke),nonTerminalTextColor:X(q.primaryTextColor??q.textColor,k.nonTerminalTextColor),lineColor:X(q.lineColor,k.lineColor),markerFill:X(q.lineColor,k.markerFill),commentFill:X(q.labelBackground??q.tertiaryColor,k.commentFill),commentStroke:X(q.tertiaryBorderColor??q.lineColor,k.commentStroke),commentTextColor:X(q.tertiaryTextColor??q.textColor,k.commentTextColor),specialFill:X(q.tertiaryColor??q.secondaryColor,k.specialFill),specialStroke:X(q.tertiaryBorderColor??q.secondaryBorderColor,k.specialStroke),ruleNameColor:X(q.titleColor??q.textColor,k.ruleNameColor)}},"buildThemeDefaults"),x=w((q)=>{let Z=z(),K={..._(),...Z.themeVariables??{},...Hq(q)},Q=Bq(K),$={...Z.railroad??{},...Mq(q)};return{compactMode:$.compactMode??Q.compactMode,padding:v($.padding,Q.padding),verticalSeparation:v($.verticalSeparation,Q.verticalSeparation),horizontalSeparation:v($.horizontalSeparation,Q.horizontalSeparation),arcRadius:v($.arcRadius,Q.arcRadius),fontSize:v($.fontSize,Q.fontSize),fontFamily:s($.fontFamily,Q.fontFamily),terminalFill:X($.terminalFill,Q.terminalFill),terminalStroke:X($.terminalStroke,Q.terminalStroke),terminalTextColor:X($.terminalTextColor,Q.terminalTextColor),nonTerminalFill:X($.nonTerminalFill,Q.nonTerminalFill),nonTerminalStroke:X($.nonTerminalStroke,Q.nonTerminalStroke),nonTerminalTextColor:X($.nonTerminalTextColor,Q.nonTerminalTextColor),lineColor:X($.lineColor,Q.lineColor),strokeWidth:v($.strokeWidth,Q.strokeWidth),markerFill:X($.markerFill,Q.markerFill),commentFill:X($.commentFill,Q.commentFill),commentStroke:X($.commentStroke,Q.commentStroke),commentTextColor:X($.commentTextColor,Q.commentTextColor),specialFill:X($.specialFill,Q.specialFill),specialStroke:X($.specialStroke,Q.specialStroke),ruleNameColor:X($.ruleNameColor,Q.ruleNameColor),showMarkers:$.showMarkers??Q.showMarkers,markerRadius:v($.markerRadius,Q.markerRadius)}},"buildRailroadStyleOptions"),Sq=w((q)=>{let{fontFamily:Z,fontSize:K,terminalFill:Q,terminalStroke:$,terminalTextColor:J,nonTerminalFill:E,nonTerminalStroke:H,nonTerminalTextColor:j,lineColor:U,strokeWidth:B,markerFill:G,commentFill:I,commentStroke:M,commentTextColor:P,specialFill:T,specialStroke:y,ruleNameColor:L}=x(q);return`
  .railroad-diagram {
    font-family: ${Z};
    font-size: ${K}px;
  }

  .railroad-terminal rect {
    fill: ${Q};
    stroke: ${$};
    stroke-width: ${B}px;
  }

  .railroad-terminal text {
    fill: ${J};
    font-family: ${Z};
    font-size: ${K}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-nonterminal rect {
    fill: ${E};
    stroke: ${H};
    stroke-width: ${B}px;
  }

  .railroad-nonterminal text {
    fill: ${j};
    font-family: ${Z};
    font-size: ${K}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-line {
    stroke: ${U};
    stroke-width: ${B}px;
    fill: none;
  }

  .railroad-start circle,
  .railroad-end circle {
    fill: ${G};
  }

  .railroad-comment ellipse {
    fill: ${I};
    stroke: ${M};
    stroke-width: ${B}px;
  }

  .railroad-comment text {
    fill: ${P};
    font-style: italic;
    font-family: ${Z};
    font-size: ${K}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-special rect {
    fill: ${T};
    stroke: ${y};
    stroke-width: ${B}px;
    stroke-dasharray: 5,3;
  }

  .railroad-special text {
    fill: ${j};
    font-family: ${Z};
    font-size: ${K}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-rule-name {
    font-weight: bold;
    fill: ${L};
    font-family: ${Z};
    font-size: ${K}px;
  }

  .railroad-group {
    /* Grouping container, no specific styles */
  }
`},"getStyles"),S=class{constructor(){this.d=""}static{w(this,"PathBuilder")}moveTo(q,Z){return this.d+=`M ${q} ${Z} `,this}lineTo(q,Z){return this.d+=`L ${q} ${Z} `,this}horizontalTo(q){return this.d+=`H ${q} `,this}verticalTo(q){return this.d+=`V ${q} `,this}arcTo(q,Z,K,Q,$,J,E){return this.d+=`A ${q} ${Z} ${K} ${Q?1:0} ${$?1:0} ${J} ${E} `,this}build(){return this.d.trim()}},Xq=class{constructor(q,Z=x()){this.textCache=new Map,this.svg=q,this.config=Z}static{w(this,"RailroadRenderer")}measureText(q){if(this.textCache.has(q))return this.textCache.get(q);let Z=this.svg.append("text").attr("font-family",this.config.fontFamily).attr("font-size",this.config.fontSize).text(q),K=Z.node().getBBox(),Q={width:K.width,height:K.height};return Z.remove(),this.textCache.set(q,Q),Q}renderTerminal(q,Z){let K=this.measureText(Z),Q=K.width+this.config.padding*2,$=K.height+this.config.padding*2,J=q.append("g").attr("class","railroad-terminal");return J.append("rect").attr("x",0).attr("y",0).attr("width",Q).attr("height",$).attr("rx",10).attr("ry",10),J.append("text").attr("x",Q/2).attr("y",$/2).text(Z),{element:J.node(),dimensions:{width:Q,height:$,up:$/2,down:$/2}}}renderNonTerminal(q,Z){let K=this.measureText(Z),Q=K.width+this.config.padding*2,$=K.height+this.config.padding*2,J=q.append("g").attr("class","railroad-nonterminal");return J.append("rect").attr("x",0).attr("y",0).attr("width",Q).attr("height",$),J.append("text").attr("x",Q/2).attr("y",$/2).text(Z),{element:J.node(),dimensions:{width:Q,height:$,up:$/2,down:$/2}}}renderSequence(q,Z){let K=Z.map((j)=>this.renderExpression(q,j)),Q=0,$=0,J=0;for(let j of K)Q+=j.dimensions.width,$=Math.max($,j.dimensions.up),J=Math.max(J,j.dimensions.down);Q+=(K.length-1)*this.config.horizontalSeparation;let E=q.append("g").attr("class","railroad-sequence"),H=0;for(let j=0;j<K.length;j++){let U=K[j],B=$-U.dimensions.up;if(E.node().appendChild(U.element).setAttribute("transform",`translate(${H}, ${B})`),j<K.length-1){let I=H+U.dimensions.width,M=I+this.config.horizontalSeparation,P=$;E.append("path").attr("class","railroad-line").attr("d",new S().moveTo(I,P).lineTo(M,P).build())}H+=U.dimensions.width+this.config.horizontalSeparation}return{element:E.node(),dimensions:{width:Q,height:$+J,up:$,down:J}}}renderChoice(q,Z){let K=Z.map((G)=>this.renderExpression(q,G)),Q=0,$=0;for(let G of K)Q=Math.max(Q,G.dimensions.width),$+=G.dimensions.height;$+=(K.length-1)*this.config.verticalSeparation;let J=this.config.arcRadius,E=J*4,H=Q+E,j=q.append("g").attr("class","railroad-choice"),U=0,B=$/2;for(let G of K){let I=U,M=I+G.dimensions.up,P=J*2+(Q-G.dimensions.width)/2;j.node().appendChild(G.element).setAttribute("transform",`translate(${P}, ${I})`);let y=new S,L=M>B;if(M===B)y.moveTo(0,B).lineTo(P,M);else y.moveTo(0,B).arcTo(J,J,0,!1,L,J,B+(L?J:-J)).lineTo(J,M-(L?J:-J)).arcTo(J,J,0,!1,!L,J*2,M).lineTo(P,M);j.append("path").attr("class","railroad-line").attr("d",y.build());let f=new S,b=P+G.dimensions.width,o=H-J*2;if(M===B)f.moveTo(b,M).lineTo(H,B);else f.moveTo(b,M).lineTo(o,M).arcTo(J,J,0,!1,!L,H-J,M+(L?-J:J)).lineTo(H-J,B+(L?J:-J)).arcTo(J,J,0,!1,L,H,B);j.append("path").attr("class","railroad-line").attr("d",f.build()),U+=G.dimensions.height+this.config.verticalSeparation}return{element:j.node(),dimensions:{width:H,height:$,up:B,down:$-B}}}renderOptional(q,Z){let K=this.renderExpression(q,Z),Q=this.config.arcRadius,$=Q*2,J=K.dimensions.width+Q*4,E=K.dimensions.height+$,H=q.append("g").attr("class","railroad-optional"),j=Q*2,U=$;H.node().appendChild(K.element).setAttribute("transform",`translate(${j}, ${U})`);let G=U+K.dimensions.up,I=new S().moveTo(0,G).lineTo(Q*2,G);H.append("path").attr("class","railroad-line").attr("d",I.build());let M=new S().moveTo(j+K.dimensions.width,G).lineTo(J,G);H.append("path").attr("class","railroad-line").attr("d",M.build());let P=new S().moveTo(0,G).arcTo(Q,Q,0,!1,!1,Q,G-Q).lineTo(Q,Q).arcTo(Q,Q,0,!1,!0,Q*2,0).lineTo(J-Q*2,0).arcTo(Q,Q,0,!1,!0,J-Q,Q).lineTo(J-Q,G-Q).arcTo(Q,Q,0,!1,!1,J,G);return H.append("path").attr("class","railroad-line").attr("d",P.build()),{element:H.node(),dimensions:{width:J,height:E,up:G,down:E-G}}}renderRepetition(q,Z,K){let Q=this.renderExpression(q,Z),$=this.config.arcRadius,J=$*2,E=Q.dimensions.width+$*4,H=K===0,j=Q.dimensions.height+J+(H?J:0),U=q.append("g").attr("class","railroad-repetition"),B=$*2,G=H?J:0;U.node().appendChild(Q.element).setAttribute("transform",`translate(${B}, ${G})`);let M=G+Q.dimensions.up;U.append("path").attr("class","railroad-line").attr("d",new S().moveTo(0,M).lineTo($*2,M).build()),U.append("path").attr("class","railroad-line").attr("d",new S().moveTo(B+Q.dimensions.width,M).lineTo(E,M).build());let P=G+Q.dimensions.height+$,T=new S().moveTo(B+Q.dimensions.width,M).arcTo($,$,0,!1,!0,B+Q.dimensions.width+$,M+$).lineTo(B+Q.dimensions.width+$,P).arcTo($,$,0,!1,!0,B+Q.dimensions.width,P+$).lineTo($*2,P+$).arcTo($,$,0,!1,!0,$,P).lineTo($,M+$).arcTo($,$,0,!1,!0,$*2,M);if(U.append("path").attr("class","railroad-line").attr("d",T.build()),H){let y=new S().moveTo(0,M).arcTo($,$,0,!1,!1,$,M-$).lineTo($,$).arcTo($,$,0,!1,!0,$*2,0).lineTo(E-$*2,0).arcTo($,$,0,!1,!0,E-$,$).lineTo(E-$,M-$).arcTo($,$,0,!1,!1,E,M);U.append("path").attr("class","railroad-line").attr("d",y.build())}return{element:U.node(),dimensions:{width:E,height:j,up:M,down:j-M}}}renderSpecial(q,Z){let K=this.measureText("? "+Z+" ?"),Q=K.width+this.config.padding*2,$=K.height+this.config.padding*2,J=q.append("g").attr("class","railroad-special");return J.append("rect").attr("x",0).attr("y",0).attr("width",Q).attr("height",$),J.append("text").attr("x",Q/2).attr("y",$/2).text("? "+Z+" ?"),{element:J.node(),dimensions:{width:Q,height:$,up:$/2,down:$/2}}}renderExpression(q,Z){switch(Z.type){case"terminal":return this.renderTerminal(q,Z.value);case"nonterminal":return this.renderNonTerminal(q,Z.name);case"sequence":return this.renderSequence(q,Z.elements);case"choice":return this.renderChoice(q,Z.alternatives);case"optional":return this.renderOptional(q,Z.element);case"repetition":return this.renderRepetition(q,Z.element,Z.min);case"special":return this.renderSpecial(q,Z.text);default:throw Error(`Unknown node type: ${Z.type}`)}}renderRule(q,Z){let K=this.svg.append("g").attr("class","railroad-rule").attr("transform",`translate(0, ${Z})`),Q=q.name+" =",$=this.measureText(Q).width+20,J=$+20,E=K.append("g"),H=this.renderExpression(E,q.definition),j=Math.max(20,H.dimensions.up),U=j-H.dimensions.up;return E.attr("transform",`translate(${J}, ${U})`),K.append("g").attr("class","railroad-rule-name-group").append("text").attr("class","railroad-rule-name").attr("x",0).attr("y",j).text(Q),K.append("g").attr("class","railroad-start").append("circle").attr("cx",$).attr("cy",j).attr("r",this.config.markerRadius),K.append("g").attr("class","railroad-end").append("circle").attr("cx",J+H.dimensions.width+10).attr("cy",j).attr("r",this.config.markerRadius),K.append("path").attr("class","railroad-line").attr("d",new S().moveTo($+this.config.markerRadius,j).lineTo(J,j).build()),K.append("path").attr("class","railroad-line").attr("d",new S().moveTo(J+H.dimensions.width,j).lineTo(J+H.dimensions.width+10-this.config.markerRadius,j).build()),{height:Math.max(40,U+H.dimensions.height+this.config.padding*2),width:J+H.dimensions.width+10+this.config.markerRadius}}renderDiagram(q){let Z=this.config.padding,K=0;for(let Q of q){let $=this.renderRule(Q,Z);Z+=$.height+this.config.verticalSeparation,K=Math.max(K,$.width)}return{width:K+this.config.padding*2,height:Z+this.config.padding}}},V=w((q,Z,K)=>{R(q,Z.height,Z.width,K),q.attr("viewBox",`0 0 ${Z.width} ${Z.height}`)},"configureRailroadSvgSize"),wq=w((q,Z,K)=>{N.debug(`[Railroad] Rendering diagram
`+q);try{let Q=h(Z);Q.attr("class","railroad-diagram");let J=z().railroad?.useMaxWidth??!0,E=Zq.getRules();if(N.debug(`[Railroad] Rendering ${E.length} rules`),E.length===0){N.warn("[Railroad] No rules to render"),V(Q,{height:100,width:200},J);return}let j=new Xq(Q,x()).renderDiagram(E);V(Q,j,J),N.debug("[Railroad] Render complete")}catch(Q){throw N.error("[Railroad] Render error:",Q),Q}},"draw"),Nq={draw:wq};
export{Zq as a,Sq as b,Nq as c};
