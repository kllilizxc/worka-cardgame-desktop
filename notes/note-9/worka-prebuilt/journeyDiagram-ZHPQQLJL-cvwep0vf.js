import{e,H,S,A,R,_,L,O,I,i,u}from"./entry-7yhdbhve.js";import{qr,Qi,ml,Et}from"./entry-gajp2w86.js";import{nr}from"./entry-5217mtw5.js";import{dt}from"./entry-7fxrr34t.js";var nt=function(){var t=e(function(y,s,a,o){for(a=a||{},o=y.length;o--;a[y[o]]=s);return a},"o"),r=[6,8,10,11,12,14,16,17,18],l=[1,9],g=[1,10],n=[1,11],d=[1,12],m=[1,13],c=[1,14],x={trace:e(function(){},"trace"),yy:{},symbols_:{error:2,start:3,journey:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,title:11,acc_title:12,acc_title_value:13,acc_descr:14,acc_descr_value:15,acc_descr_multiline_value:16,section:17,taskName:18,taskData:19,$accept:0,$end:1},terminals_:{2:"error",4:"journey",6:"EOF",8:"SPACE",10:"NEWLINE",11:"title",12:"acc_title",13:"acc_title_value",14:"acc_descr",15:"acc_descr_value",16:"acc_descr_multiline_value",17:"section",18:"taskName",19:"taskData"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,2]],performAction:e(function(s,a,o,f,p,h,T){var v=h.length-1;switch(p){case 1:return h[v-1];case 2:this.$=[];break;case 3:h[v-1].push(h[v]),this.$=h[v-1];break;case 4:case 5:this.$=h[v];break;case 6:case 7:this.$=[];break;case 8:f.setDiagramTitle(h[v].substr(6)),this.$=h[v].substr(6);break;case 9:this.$=h[v].trim(),f.setAccTitle(this.$);break;case 10:case 11:this.$=h[v].trim(),f.setAccDescription(this.$);break;case 12:f.addSection(h[v].substr(8)),this.$=h[v].substr(8);break;case 13:f.addTask(h[v-1],h[v]),this.$="task";break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(r,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:l,12:g,14:n,16:d,17:m,18:c},t(r,[2,7],{1:[2,1]}),t(r,[2,3]),{9:15,11:l,12:g,14:n,16:d,17:m,18:c},t(r,[2,5]),t(r,[2,6]),t(r,[2,8]),{13:[1,16]},{15:[1,17]},t(r,[2,11]),t(r,[2,12]),{19:[1,18]},t(r,[2,4]),t(r,[2,9]),t(r,[2,10]),t(r,[2,13])],defaultActions:{},parseError:e(function(s,a){if(a.recoverable)this.trace(s);else{var o=Error(s);throw o.hash=a,o}},"parseError"),parse:e(function(s){var a=this,o=[0],f=[],p=[null],h=[],T=this.table,v="",j=0,ot=0,ct=0,vt=2,ht=1,wt=h.slice.call(arguments,1),w=Object.create(this.lexer),z={yy:{}};for(var Q in this.yy)if(Object.prototype.hasOwnProperty.call(this.yy,Q))z.yy[Q]=this.yy[Q];if(w.setInput(s,z.yy),z.yy.lexer=w,z.yy.parser=this,typeof w.yylloc>"u")w.yylloc={};var D=w.yylloc;h.push(D);var Tt=w.options&&w.options.ranges;if(typeof z.yy.parseError==="function")this.parseError=z.yy.parseError;else this.parseError=Object.getPrototypeOf(this).parseError;function St(C){o.length=o.length-2*C,p.length=p.length-C,h.length=h.length-C}e(St,"popStack");function ut(){var C=f.pop()||w.lex()||ht;if(typeof C!=="number"){if(C instanceof Array)f=C,C=f.pop();C=a.symbols_[C]||C}return C}e(ut,"lex");var M,tt,W,E,Ht,et,Y={},Z,V,yt,J;while(!0){if(W=o[o.length-1],this.defaultActions[W])E=this.defaultActions[W];else{if(M===null||typeof M>"u")M=ut();E=T[W]&&T[W][M]}if(typeof E>"u"||!E.length||!E[0]){var rt="";J=[];for(Z in T[W])if(this.terminals_[Z]&&Z>vt)J.push("'"+this.terminals_[Z]+"'");if(w.showPosition)rt="Parse error on line "+(j+1)+`:
`+w.showPosition()+`
Expecting `+J.join(", ")+", got '"+(this.terminals_[M]||M)+"'";else rt="Parse error on line "+(j+1)+": Unexpected "+(M==ht?"end of input":"'"+(this.terminals_[M]||M)+"'");this.parseError(rt,{text:w.match,token:this.terminals_[M]||M,line:w.yylineno,loc:D,expected:J})}if(E[0]instanceof Array&&E.length>1)throw Error("Parse Error: multiple actions possible at state: "+W+", token: "+M);switch(E[0]){case 1:if(o.push(M),p.push(w.yytext),h.push(w.yylloc),o.push(E[1]),M=null,!tt){if(ot=w.yyleng,v=w.yytext,j=w.yylineno,D=w.yylloc,ct>0)ct--}else M=tt,tt=null;break;case 2:if(V=this.productions_[E[1]][1],Y.$=p[p.length-V],Y._$={first_line:h[h.length-(V||1)].first_line,last_line:h[h.length-1].last_line,first_column:h[h.length-(V||1)].first_column,last_column:h[h.length-1].last_column},Tt)Y._$.range=[h[h.length-(V||1)].range[0],h[h.length-1].range[1]];if(et=this.performAction.apply(Y,[v,ot,j,z.yy,E[1],p,h].concat(wt)),typeof et<"u")return et;if(V)o=o.slice(0,-1*V*2),p=p.slice(0,-1*V),h=h.slice(0,-1*V);o.push(this.productions_[E[1]][0]),p.push(Y.$),h.push(Y._$),yt=T[o[o.length-2]][o[o.length-1]],o.push(yt);break;case 3:return!0}}return!0},"parse")},k=function(){var y={EOF:1,parseError:e(function(a,o){if(this.yy.parser)this.yy.parser.parseError(a,o);else throw Error(a)},"parseError"),setInput:e(function(s,a){if(this.yy=a||this.yy||{},this._input=s,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges)this.yylloc.range=[0,0];return this.offset=0,this},"setInput"),input:e(function(){var s=this._input[0];this.yytext+=s,this.yyleng++,this.offset++,this.match+=s,this.matched+=s;var a=s.match(/(?:\r\n?|\n).*/g);if(a)this.yylineno++,this.yylloc.last_line++;else this.yylloc.last_column++;if(this.options.ranges)this.yylloc.range[1]++;return this._input=this._input.slice(1),s},"input"),unput:e(function(s){var a=s.length,o=s.split(/(?:\r\n?|\n)/g);this._input=s+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-a),this.offset-=a;var f=this.match.split(/(?:\r\n?|\n)/g);if(this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),o.length-1)this.yylineno-=o.length-1;var p=this.yylloc.range;if(this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:o?(o.length===f.length?this.yylloc.first_column:0)+f[f.length-o.length].length-o[0].length:this.yylloc.first_column-a},this.options.ranges)this.yylloc.range=[p[0],p[0]+this.yyleng-a];return this.yyleng=this.yytext.length,this},"unput"),more:e(function(){return this._more=!0,this},"more"),reject:e(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:e(function(s){this.unput(this.match.slice(s))},"less"),pastInput:e(function(){var s=this.matched.substr(0,this.matched.length-this.match.length);return(s.length>20?"...":"")+s.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:e(function(){var s=this.match;if(s.length<20)s+=this._input.substr(0,20-s.length);return(s.substr(0,20)+(s.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:e(function(){var s=this.pastInput(),a=Array(s.length+1).join("-");return s+this.upcomingInput()+`
`+a+"^"},"showPosition"),test_match:e(function(s,a){var o,f,p;if(this.options.backtrack_lexer){if(p={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges)p.yylloc.range=this.yylloc.range.slice(0)}if(f=s[0].match(/(?:\r\n?|\n).*/g),f)this.yylineno+=f.length;if(this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:f?f[f.length-1].length-f[f.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+s[0].length},this.yytext+=s[0],this.match+=s[0],this.matches=s,this.yyleng=this.yytext.length,this.options.ranges)this.yylloc.range=[this.offset,this.offset+=this.yyleng];if(this._more=!1,this._backtrack=!1,this._input=this._input.slice(s[0].length),this.matched+=s[0],o=this.performAction.call(this,this.yy,this,a,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input)this.done=!1;if(o)return o;else if(this._backtrack){for(var h in p)this[h]=p[h];return!1}return!1},"test_match"),next:e(function(){if(this.done)return this.EOF;if(!this._input)this.done=!0;var s,a,o,f;if(!this._more)this.yytext="",this.match="";var p=this._currentRules();for(var h=0;h<p.length;h++)if(o=this._input.match(this.rules[p[h]]),o&&(!a||o[0].length>a[0].length)){if(a=o,f=h,this.options.backtrack_lexer)if(s=this.test_match(o,p[h]),s!==!1)return s;else if(this._backtrack){a=!1;continue}else return!1;else if(!this.options.flex)break}if(a){if(s=this.test_match(a,p[f]),s!==!1)return s;return!1}if(this._input==="")return this.EOF;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:e(function(){var a=this.next();if(a)return a;else return this.lex()},"lex"),begin:e(function(a){this.conditionStack.push(a)},"begin"),popState:e(function(){var a=this.conditionStack.length-1;if(a>0)return this.conditionStack.pop();else return this.conditionStack[0]},"popState"),_currentRules:e(function(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1])return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;else return this.conditions.INITIAL.rules},"_currentRules"),topState:e(function(a){if(a=this.conditionStack.length-1-Math.abs(a||0),a>=0)return this.conditionStack[a];else return"INITIAL"},"topState"),pushState:e(function(a){this.begin(a)},"pushState"),stateStackSize:e(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:e(function(a,o,f,p){var h=p;switch(f){case 0:break;case 1:break;case 2:return 10;case 3:break;case 4:break;case 5:return 4;case 6:return 11;case 7:return this.begin("acc_title"),12;break;case 8:return this.popState(),"acc_title_value";break;case 9:return this.begin("acc_descr"),14;break;case 10:return this.popState(),"acc_descr_value";break;case 11:this.begin("acc_descr_multiline");break;case 12:this.popState();break;case 13:return"acc_descr_multiline_value";case 14:return 17;case 15:return 18;case 16:return 19;case 17:return":";case 18:return 6;case 19:return"INVALID"}},"anonymous"),rules:[/^(?:%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:journey\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[12,13],inclusive:!1},acc_descr:{rules:[10],inclusive:!1},acc_title:{rules:[8],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,9,11,14,15,16,17,18,19],inclusive:!0}}};return y}();x.lexer=k;function b(){this.yy={}}return e(b,"Parser"),b.prototype=x,x.Parser=b,new b}();nt.parser=nt;var $t=nt,q="",at=[],X=[],G=[],Mt=e(function(){at.length=0,X.length=0,q="",G.length=0,S()},"clear"),Ct=e(function(t){q=t,at.push(t)},"addSection"),Pt=e(function(){return at},"getSections"),It=e(function(){let t=ft(),r=100,l=0;while(!t&&l<r)t=ft(),l++;return X.push(...G),X},"getTasks"),At=e(function(){let t=[];return X.forEach((l)=>{if(l.people)t.push(...l.people)}),[...new Set(t)].sort()},"updateActors"),Ft=e(function(t,r){let l=r.substr(1).split(":"),g=0,n=[];if(l.length===1)g=Number(l[0]),n=[];else g=Number(l[0]),n=l[1].split(",");let d=n.map((c)=>c.trim()),m={section:q,type:q,people:d,task:t,score:g};G.push(m)},"addTask"),Vt=e(function(t){let r={section:q,type:q,description:t,task:t,classes:[]};X.push(r)},"addTaskOrg"),ft=e(function(){let t=e(function(l){return G[l].processed},"compileTask"),r=!0;for(let[l,g]of G.entries())t(l),r=r&&g.processed;return r},"compileTasks"),Rt=e(function(){return At()},"getActors"),pt={getConfig:e(()=>i().journey,"getConfig"),clear:Mt,setDiagramTitle:O,getDiagramTitle:I,setAccTitle:A,getAccTitle:R,setAccDescription:_,getAccDescription:L,addSection:Ct,getSections:Pt,getTasks:It,addTask:Ft,addTaskOrg:Vt,getActors:Rt},Lt=e((t)=>`.label {
    font-family: ${t.fontFamily};
    color: ${t.textColor};
  }
  .mouth {
    stroke: #666;
  }

  line {
    stroke: ${t.textColor}
  }

  .legend {
    fill: ${t.textColor};
    font-family: ${t.fontFamily};
  }

  .label text {
    fill: #333;
  }
  .label {
    color: ${t.textColor}
  }

  .face {
    ${t.faceColor?`fill: ${t.faceColor}`:"fill: #FFF8DC"};
    stroke: #999;
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${t.mainBkg};
    stroke: ${t.nodeBorder};
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${t.arrowheadColor};
  }

  .edgePaths .path {
    stroke: ${t.lineColor};
    stroke-width: 1.5px;
  }

  .flowchart-link {
    stroke: ${t.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${t.edgeLabelBackground};
    rect {
      opacity: 0.5;
    }
    text-align: center;
  }

  .cluster rect {
  }

  .cluster text {
    fill: ${t.titleColor};
  }

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${t.fontFamily};
    font-size: 12px;
    background: ${t.tertiaryColor};
    border: 1px solid ${t.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .task-type-0, .section-type-0  {
    ${t.fillType0?`fill: ${t.fillType0}`:""};
  }
  .task-type-1, .section-type-1  {
    ${t.fillType0?`fill: ${t.fillType1}`:""};
  }
  .task-type-2, .section-type-2  {
    ${t.fillType0?`fill: ${t.fillType2}`:""};
  }
  .task-type-3, .section-type-3  {
    ${t.fillType0?`fill: ${t.fillType3}`:""};
  }
  .task-type-4, .section-type-4  {
    ${t.fillType0?`fill: ${t.fillType4}`:""};
  }
  .task-type-5, .section-type-5  {
    ${t.fillType0?`fill: ${t.fillType5}`:""};
  }
  .task-type-6, .section-type-6  {
    ${t.fillType0?`fill: ${t.fillType6}`:""};
  }
  .task-type-7, .section-type-7  {
    ${t.fillType0?`fill: ${t.fillType7}`:""};
  }

  .actor-0 {
    ${t.actor0?`fill: ${t.actor0}`:""};
  }
  .actor-1 {
    ${t.actor1?`fill: ${t.actor1}`:""};
  }
  .actor-2 {
    ${t.actor2?`fill: ${t.actor2}`:""};
  }
  .actor-3 {
    ${t.actor3?`fill: ${t.actor3}`:""};
  }
  .actor-4 {
    ${t.actor4?`fill: ${t.actor4}`:""};
  }
  .actor-5 {
    ${t.actor5?`fill: ${t.actor5}`:""};
  }
  ${dt()}
`,"getStyles"),Bt=Lt,lt=e(function(t,r){return qr(t,r)},"drawRect"),jt=e(function(t,r){let g=t.append("circle").attr("cx",r.cx).attr("cy",r.cy).attr("class","face").attr("r",15).attr("stroke-width",2).attr("overflow","visible"),n=t.append("g");n.append("circle").attr("cx",r.cx-5).attr("cy",r.cy-5).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666"),n.append("circle").attr("cx",r.cx+5).attr("cy",r.cy-5).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666");function d(x){let k=nr().startAngle(Math.PI/2).endAngle(3*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);x.append("path").attr("class","mouth").attr("d",k).attr("transform","translate("+r.cx+","+(r.cy+2)+")")}e(d,"smile");function m(x){let k=nr().startAngle(3*Math.PI/2).endAngle(5*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);x.append("path").attr("class","mouth").attr("d",k).attr("transform","translate("+r.cx+","+(r.cy+7)+")")}e(m,"sad");function c(x){x.append("line").attr("class","mouth").attr("stroke",2).attr("x1",r.cx-5).attr("y1",r.cy+7).attr("x2",r.cx+5).attr("y2",r.cy+7).attr("class","mouth").attr("stroke-width","1px").attr("stroke","#666")}if(e(c,"ambivalent"),r.score>3)d(n);else if(r.score<3)m(n);else c(n);return g},"drawFace"),xt=e(function(t,r){let l=t.append("circle");if(l.attr("cx",r.cx),l.attr("cy",r.cy),l.attr("class","actor-"+r.pos),l.attr("fill",r.fill),l.attr("stroke",r.stroke),l.attr("r",r.r),l.class!==void 0)l.attr("class",l.class);if(r.title!==void 0)l.append("title").text(r.title);return l},"drawCircle"),kt=e(function(t,r){return ml(t,r)},"drawText"),Nt=e(function(t,r){function l(n,d,m,c,x){return n+","+d+" "+(n+m)+","+d+" "+(n+m)+","+(d+c-x)+" "+(n+m-x*1.2)+","+(d+c)+" "+n+","+(d+c)}e(l,"genPoints");let g=t.append("polygon");g.attr("points",l(r.x,r.y,50,20,7)),g.attr("class","labelBox"),r.y=r.y+r.labelMargin,r.x=r.x+0.5*r.labelMargin,kt(t,r)},"drawLabel"),zt=e(function(t,r,l){let g=t.append("g"),n=Et();n.x=r.x,n.y=r.y,n.fill=r.fill,n.width=l.width*r.taskCount+l.diagramMarginX*(r.taskCount-1),n.height=l.height,n.class="journey-section section-type-"+r.num,n.rx=3,n.ry=3,lt(g,n),bt(l)(r.text,g,n.x,n.y,n.width,n.height,{class:"journey-section section-type-"+r.num},l,r.colour)},"drawSection"),st=-1,Wt=e(function(t,r,l,g){let n=r.x+l.width/2,d=t.append("g");st++;let m=450;d.append("line").attr("id",g+"-task"+st).attr("x1",n).attr("y1",r.y).attr("x2",n).attr("y2",m).attr("class","task-line").attr("stroke-width","1px").attr("stroke-dasharray","4 2").attr("stroke","#666"),jt(d,{cx:n,cy:300+(5-r.score)*30,score:r.score});let c=Et();c.x=r.x,c.y=r.y,c.fill=r.fill,c.width=l.width,c.height=l.height,c.class="task task-type-"+r.num,c.rx=3,c.ry=3,lt(d,c);let x=r.x+14;r.people.forEach((k)=>{let b=r.actors[k].color,y={cx:x,cy:r.y,r:7,fill:b,stroke:"#000",title:k,pos:r.actors[k].position};xt(d,y),x+=10}),bt(l)(r.task,d,c.x,c.y,c.width,c.height,{class:"task"},l,r.colour)},"drawTask"),Ot=e(function(t,r){Qi(t,r)},"drawBackgroundRect"),bt=function(){function t(n,d,m,c,x,k,b,y){let s=d.append("text").attr("x",m+x/2).attr("y",c+k/2+5).style("font-color",y).style("text-anchor","middle").text(n);g(s,b)}e(t,"byText");function r(n,d,m,c,x,k,b,y,s){let{taskFontSize:a,taskFontFamily:o}=y,f=n.split(/<br\s*\/?>/gi);for(let p=0;p<f.length;p++){let h=p*a-a*(f.length-1)/2,T=d.append("text").attr("x",m+x/2).attr("y",c).attr("fill",s).style("text-anchor","middle").style("font-size",a).style("font-family",o);T.append("tspan").attr("x",m+x/2).attr("dy",h).text(f[p]),T.attr("y",c+k/2).attr("dominant-baseline","central").attr("alignment-baseline","central"),g(T,b)}}e(r,"byTspan");function l(n,d,m,c,x,k,b,y){let s=d.append("switch"),o=s.append("foreignObject").attr("x",m).attr("y",c).attr("width",x).attr("height",k).attr("position","fixed").append("xhtml:div").style("display","table").style("height","100%").style("width","100%");o.append("div").attr("class","label").style("display","table-cell").style("text-align","center").style("vertical-align","middle").text(n),r(n,s,m,c,x,k,b,y),g(o,b)}e(l,"byFo");function g(n,d){for(let m in d)if(m in d)n.attr(m,d[m])}return e(g,"_setTextAttrs"),function(n){return n.textPlacement==="fo"?l:n.textPlacement==="old"?t:r}}(),Yt=e(function(t,r){st=-1,t.append("defs").append("marker").attr("id",r+"-arrowhead").attr("refX",5).attr("refY",2).attr("markerWidth",6).attr("markerHeight",4).attr("orient","auto").append("path").attr("d","M 0,0 V 4 L6,2 Z")},"initGraphics"),U={drawRect:lt,drawCircle:xt,drawSection:zt,drawText:kt,drawLabel:Nt,drawTask:Wt,drawBackgroundRect:Ot,initGraphics:Yt},qt=e(function(t){Object.keys(t).forEach(function(l){F[l]=t[l]})},"setConf"),B={},K=0;function _t(t){let r=i().journey,l=r.maxLabelWidth;K=0;let g=60;Object.keys(B).forEach((n)=>{let d=B[n].color,m={cx:20,cy:g,r:7,fill:d,stroke:"#000",pos:B[n].position};U.drawCircle(t,m);let c=t.append("text").attr("visibility","hidden").text(n),x=c.node().getBoundingClientRect().width;c.remove();let k=[];if(x<=l)k=[n];else{let b=n.split(" "),y="";if(c=t.append("text").attr("visibility","hidden"),b.forEach((s)=>{let a=y?`${y} ${s}`:s;if(c.text(a),c.node().getBoundingClientRect().width>l){if(y)k.push(y);if(y=s,c.text(s),c.node().getBoundingClientRect().width>l){let f="";for(let p of s)if(f+=p,c.text(f+"-"),c.node().getBoundingClientRect().width>l)k.push(f.slice(0,-1)+"-"),f=p;y=f}}else y=a}),y)k.push(y);c.remove()}k.forEach((b,y)=>{let s={x:40,y:g+7+y*20,fill:"#666",text:b,textMargin:r.boxTextMargin??5},o=U.drawText(t,s).node().getBoundingClientRect().width;if(o>K&&o>r.leftMargin-o)K=o}),g+=Math.max(20,k.length*20)})}e(_t,"drawActorLegend");var F=i().journey,N=0,Xt=e(function(t,r,l,g){let n=i(),d=n.journey.titleColor,m=n.journey.titleFontSize,c=n.journey.titleFontFamily,x=n.securityLevel,k;if(x==="sandbox")k=u("#i"+r);let b=x==="sandbox"?u(k.nodes()[0].contentDocument.body):u("body");P.init();let y=b.select("#"+r);U.initGraphics(y,r);let s=g.db.getTasks(),a=g.db.getDiagramTitle(),o=g.db.getActors();for(let j in B)delete B[j];let f=0;o.forEach((j)=>{B[j]={color:F.actorColours[f%F.actorColours.length],position:f},f++}),_t(y),N=F.leftMargin+K,P.insert(0,0,N,Object.keys(B).length*50),Gt(y,s,0,r);let p=P.getBounds();if(a)y.append("text").text(a).attr("x",N).attr("font-size",m).attr("font-weight","bold").attr("y",25).attr("fill",d).attr("font-family",c);let h=p.stopy-p.starty+2*F.diagramMarginY,T=N+p.stopx+2*F.diagramMarginX;H(y,h,T,F.useMaxWidth),y.append("line").attr("x1",N).attr("y1",F.height*4).attr("x2",T-N-4).attr("y2",F.height*4).attr("stroke-width",4).attr("stroke","black").attr("marker-end","url(#"+r+"-arrowhead)");let v=a?70:0;y.attr("viewBox",`${p.startx} -25 ${T} ${h+v}`),y.attr("preserveAspectRatio","xMinYMin meet"),y.attr("height",h+v+25)},"draw"),P={data:{startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},verticalPos:0,sequenceItems:[],init:e(function(){this.sequenceItems=[],this.data={startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},this.verticalPos=0},"init"),updateVal:e(function(t,r,l,g){if(t[r]===void 0)t[r]=l;else t[r]=g(l,t[r])},"updateVal"),updateBounds:e(function(t,r,l,g){let n=i().journey,d=this,m=0;function c(x){return e(function(b){m++;let y=d.sequenceItems.length-m+1;if(d.updateVal(b,"starty",r-y*n.boxMargin,Math.min),d.updateVal(b,"stopy",g+y*n.boxMargin,Math.max),d.updateVal(P.data,"startx",t-y*n.boxMargin,Math.min),d.updateVal(P.data,"stopx",l+y*n.boxMargin,Math.max),x!=="activation")d.updateVal(b,"startx",t-y*n.boxMargin,Math.min),d.updateVal(b,"stopx",l+y*n.boxMargin,Math.max),d.updateVal(P.data,"starty",r-y*n.boxMargin,Math.min),d.updateVal(P.data,"stopy",g+y*n.boxMargin,Math.max)},"updateItemBounds")}e(c,"updateFn"),this.sequenceItems.forEach(c())},"updateBounds"),insert:e(function(t,r,l,g){let n=Math.min(t,l),d=Math.max(t,l),m=Math.min(r,g),c=Math.max(r,g);this.updateVal(P.data,"startx",n,Math.min),this.updateVal(P.data,"starty",m,Math.min),this.updateVal(P.data,"stopx",d,Math.max),this.updateVal(P.data,"stopy",c,Math.max),this.updateBounds(n,m,d,c)},"insert"),bumpVerticalPos:e(function(t){this.verticalPos=this.verticalPos+t,this.data.stopy=this.verticalPos},"bumpVerticalPos"),getVerticalPos:e(function(){return this.verticalPos},"getVerticalPos"),getBounds:e(function(){return this.data},"getBounds")},{sectionFills:it,sectionColours:gt}=F,Gt=e(function(t,r,l,g){let n=i().journey,d="",m=n.height*2+n.diagramMarginY,c=l+m,x=0,k="#CCC",b="black",y=0;for(let[s,a]of r.entries()){if(d!==a.section){k=it[x%it.length],y=x%it.length,b=gt[x%gt.length];let f=0,p=a.section;for(let T=s;T<r.length;T++)if(r[T].section==p)f=f+1;else break;let h={x:s*n.taskMargin+s*n.width+N,y:50,text:a.section,fill:k,num:y,colour:b,taskCount:f};U.drawSection(t,h,n),d=a.section,x++}let o=a.people.reduce((f,p)=>{if(B[p])f[p]=B[p];return f},{});a.x=s*n.taskMargin+s*n.width+N,a.y=c,a.width=n.diagramMarginX,a.height=n.diagramMarginY,a.colour=b,a.fill=k,a.num=y,a.actors=o,U.drawTask(t,a,n,g),P.insert(a.x,a.y,a.x+a.width+n.taskMargin,450)}},"drawTasks"),mt={setConf:qt,draw:Xt},ee={parser:$t,db:pt,renderer:mt,styles:Bt,init:e((t)=>{mt.setConf(t.journey),pt.clear()},"init")};export{ee as diagram};
