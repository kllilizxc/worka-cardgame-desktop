import{O as Pq}from"./entry-11a314fd.js";import{P as Eq,Q as Cq,R as Lq,U as e}from"./entry-bm12n97g.js";import"./entry-c6ya8xm6.js";import{fg as zq,kg as Yq,lg as Iq,mg as Mq,ng as Nq,og as Rq,pg as Fq,qg as Wq,rg as u}from"./entry-mq8wbpjf.js";import{Fg as k,bh as n}from"./entry-fx4ha537.js";import{yh as J}from"./entry-qk00c3wq.js";import"./entry-8fhwzgx3.js";var o=function(){var q=J(function(z,U,G,Z){for(G=G||{},Z=z.length;Z--;G[z[Z]]=U);return G},"o"),K=[6,8,10,11,12,14,16,17,18],X=[1,9],N=[1,10],Q=[1,11],Y=[1,12],R=[1,13],B=[1,14],F={trace:J(function(){},"trace"),yy:{},symbols_:{error:2,start:3,journey:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,title:11,acc_title:12,acc_title_value:13,acc_descr:14,acc_descr_value:15,acc_descr_multiline_value:16,section:17,taskName:18,taskData:19,$accept:0,$end:1},terminals_:{2:"error",4:"journey",6:"EOF",8:"SPACE",10:"NEWLINE",11:"title",12:"acc_title",13:"acc_title_value",14:"acc_descr",15:"acc_descr_value",16:"acc_descr_multiline_value",17:"section",18:"taskName",19:"taskData"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,2]],performAction:J(function(U,G,Z,I,M,H,P){var C=H.length-1;switch(M){case 1:return H[C-1];case 2:this.$=[];break;case 3:H[C-1].push(H[C]),this.$=H[C-1];break;case 4:case 5:this.$=H[C];break;case 6:case 7:this.$=[];break;case 8:I.setDiagramTitle(H[C].substr(6)),this.$=H[C].substr(6);break;case 9:this.$=H[C].trim(),I.setAccTitle(this.$);break;case 10:case 11:this.$=H[C].trim(),I.setAccDescription(this.$);break;case 12:I.addSection(H[C].substr(8)),this.$=H[C].substr(8);break;case 13:I.addTask(H[C-1],H[C]),this.$="task";break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},q(K,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:X,12:N,14:Q,16:Y,17:R,18:B},q(K,[2,7],{1:[2,1]}),q(K,[2,3]),{9:15,11:X,12:N,14:Q,16:Y,17:R,18:B},q(K,[2,5]),q(K,[2,6]),q(K,[2,8]),{13:[1,16]},{15:[1,17]},q(K,[2,11]),q(K,[2,12]),{19:[1,18]},q(K,[2,4]),q(K,[2,9]),q(K,[2,10]),q(K,[2,13])],defaultActions:{},parseError:J(function(U,G){if(G.recoverable)this.trace(U);else{var Z=Error(U);throw Z.hash=G,Z}},"parseError"),parse:J(function(U){var G=this,Z=[0],I=[],M=[null],H=[],P=this.table,C="",w=0,Kq=0,Qq=0,Sq=2,Uq=1,jq=H.slice.call(arguments,1),L=Object.create(this.lexer),$={yy:{}};for(var m in this.yy)if(Object.prototype.hasOwnProperty.call(this.yy,m))$.yy[m]=this.yy[m];if(L.setInput(U,$.yy),$.yy.lexer=L,$.yy.parser=this,typeof L.yylloc>"u")L.yylloc={};var l=L.yylloc;H.push(l);var Tq=L.options&&L.options.ranges;if(typeof $.yy.parseError==="function")this.parseError=$.yy.parseError;else this.parseError=Object.getPrototypeOf(this).parseError;function wq(O){Z.length=Z.length-2*O,M.length=M.length-O,H.length=H.length-O}J(wq,"popStack");function Gq(){var O=I.pop()||L.lex()||Uq;if(typeof O!=="number"){if(O instanceof Array)I=O,O=I.pop();O=G.symbols_[O]||O}return O}J(Gq,"lex");var V,i,b,A,oq,r,g={},_,j,Jq,p;while(!0){if(b=Z[Z.length-1],this.defaultActions[b])A=this.defaultActions[b];else{if(V===null||typeof V>"u")V=Gq();A=P[b]&&P[b][V]}if(typeof A>"u"||!A.length||!A[0]){var c="";p=[];for(_ in P[b])if(this.terminals_[_]&&_>Sq)p.push("'"+this.terminals_[_]+"'");if(L.showPosition)c="Parse error on line "+(w+1)+`:
`+L.showPosition()+`
Expecting `+p.join(", ")+", got '"+(this.terminals_[V]||V)+"'";else c="Parse error on line "+(w+1)+": Unexpected "+(V==Uq?"end of input":"'"+(this.terminals_[V]||V)+"'");this.parseError(c,{text:L.match,token:this.terminals_[V]||V,line:L.yylineno,loc:l,expected:p})}if(A[0]instanceof Array&&A.length>1)throw Error("Parse Error: multiple actions possible at state: "+b+", token: "+V);switch(A[0]){case 1:if(Z.push(V),M.push(L.yytext),H.push(L.yylloc),Z.push(A[1]),V=null,!i){if(Kq=L.yyleng,C=L.yytext,w=L.yylineno,l=L.yylloc,Qq>0)Qq--}else V=i,i=null;break;case 2:if(j=this.productions_[A[1]][1],g.$=M[M.length-j],g._$={first_line:H[H.length-(j||1)].first_line,last_line:H[H.length-1].last_line,first_column:H[H.length-(j||1)].first_column,last_column:H[H.length-1].last_column},Tq)g._$.range=[H[H.length-(j||1)].range[0],H[H.length-1].range[1]];if(r=this.performAction.apply(g,[C,Kq,w,$.yy,A[1],M,H].concat(jq)),typeof r<"u")return r;if(j)Z=Z.slice(0,-1*j*2),M=M.slice(0,-1*j),H=H.slice(0,-1*j);Z.push(this.productions_[A[1]][0]),M.push(g.$),H.push(g._$),Jq=P[Z[Z.length-2]][Z[Z.length-1]],Z.push(Jq);break;case 3:return!0}}return!0},"parse")},W=function(){var z={EOF:1,parseError:J(function(G,Z){if(this.yy.parser)this.yy.parser.parseError(G,Z);else throw Error(G)},"parseError"),setInput:J(function(U,G){if(this.yy=G||this.yy||{},this._input=U,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges)this.yylloc.range=[0,0];return this.offset=0,this},"setInput"),input:J(function(){var U=this._input[0];this.yytext+=U,this.yyleng++,this.offset++,this.match+=U,this.matched+=U;var G=U.match(/(?:\r\n?|\n).*/g);if(G)this.yylineno++,this.yylloc.last_line++;else this.yylloc.last_column++;if(this.options.ranges)this.yylloc.range[1]++;return this._input=this._input.slice(1),U},"input"),unput:J(function(U){var G=U.length,Z=U.split(/(?:\r\n?|\n)/g);this._input=U+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-G),this.offset-=G;var I=this.match.split(/(?:\r\n?|\n)/g);if(this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),Z.length-1)this.yylineno-=Z.length-1;var M=this.yylloc.range;if(this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:Z?(Z.length===I.length?this.yylloc.first_column:0)+I[I.length-Z.length].length-Z[0].length:this.yylloc.first_column-G},this.options.ranges)this.yylloc.range=[M[0],M[0]+this.yyleng-G];return this.yyleng=this.yytext.length,this},"unput"),more:J(function(){return this._more=!0,this},"more"),reject:J(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:J(function(U){this.unput(this.match.slice(U))},"less"),pastInput:J(function(){var U=this.matched.substr(0,this.matched.length-this.match.length);return(U.length>20?"...":"")+U.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:J(function(){var U=this.match;if(U.length<20)U+=this._input.substr(0,20-U.length);return(U.substr(0,20)+(U.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:J(function(){var U=this.pastInput(),G=Array(U.length+1).join("-");return U+this.upcomingInput()+`
`+G+"^"},"showPosition"),test_match:J(function(U,G){var Z,I,M;if(this.options.backtrack_lexer){if(M={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges)M.yylloc.range=this.yylloc.range.slice(0)}if(I=U[0].match(/(?:\r\n?|\n).*/g),I)this.yylineno+=I.length;if(this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:I?I[I.length-1].length-I[I.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+U[0].length},this.yytext+=U[0],this.match+=U[0],this.matches=U,this.yyleng=this.yytext.length,this.options.ranges)this.yylloc.range=[this.offset,this.offset+=this.yyleng];if(this._more=!1,this._backtrack=!1,this._input=this._input.slice(U[0].length),this.matched+=U[0],Z=this.performAction.call(this,this.yy,this,G,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input)this.done=!1;if(Z)return Z;else if(this._backtrack){for(var H in M)this[H]=M[H];return!1}return!1},"test_match"),next:J(function(){if(this.done)return this.EOF;if(!this._input)this.done=!0;var U,G,Z,I;if(!this._more)this.yytext="",this.match="";var M=this._currentRules();for(var H=0;H<M.length;H++)if(Z=this._input.match(this.rules[M[H]]),Z&&(!G||Z[0].length>G[0].length)){if(G=Z,I=H,this.options.backtrack_lexer)if(U=this.test_match(Z,M[H]),U!==!1)return U;else if(this._backtrack){G=!1;continue}else return!1;else if(!this.options.flex)break}if(G){if(U=this.test_match(G,M[I]),U!==!1)return U;return!1}if(this._input==="")return this.EOF;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:J(function(){var G=this.next();if(G)return G;else return this.lex()},"lex"),begin:J(function(G){this.conditionStack.push(G)},"begin"),popState:J(function(){var G=this.conditionStack.length-1;if(G>0)return this.conditionStack.pop();else return this.conditionStack[0]},"popState"),_currentRules:J(function(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1])return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;else return this.conditions.INITIAL.rules},"_currentRules"),topState:J(function(G){if(G=this.conditionStack.length-1-Math.abs(G||0),G>=0)return this.conditionStack[G];else return"INITIAL"},"topState"),pushState:J(function(G){this.begin(G)},"pushState"),stateStackSize:J(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:J(function(G,Z,I,M){var H=M;switch(I){case 0:break;case 1:break;case 2:return 10;case 3:break;case 4:break;case 5:return 4;case 6:return 11;case 7:return this.begin("acc_title"),12;break;case 8:return this.popState(),"acc_title_value";break;case 9:return this.begin("acc_descr"),14;break;case 10:return this.popState(),"acc_descr_value";break;case 11:this.begin("acc_descr_multiline");break;case 12:this.popState();break;case 13:return"acc_descr_multiline_value";case 14:return 17;case 15:return 18;case 16:return 19;case 17:return":";case 18:return 6;case 19:return"INVALID"}},"anonymous"),rules:[/^(?:%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:journey\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[12,13],inclusive:!1},acc_descr:{rules:[10],inclusive:!1},acc_title:{rules:[8],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,9,11,14,15,16,17,18,19],inclusive:!0}}};return z}();F.lexer=W;function E(){this.yy={}}return J(E,"Parser"),E.prototype=F,F.Parser=E,new E}();o.parser=o;var Dq=o,h="",t=[],f=[],y=[],$q=J(function(){t.length=0,f.length=0,h="",y.length=0,Yq()},"clear"),bq=J(function(q){h=q,t.push(q)},"addSection"),uq=J(function(){return t},"getSections"),gq=J(function(){let q=Xq(),K=100,X=0;while(!q&&X<K)q=Xq(),X++;return f.push(...y),f},"getTasks"),hq=J(function(){let q=[];return f.forEach((X)=>{if(X.people)q.push(...X.people)}),[...new Set(q)].sort()},"updateActors"),fq=J(function(q,K){let X=K.substr(1).split(":"),N=0,Q=[];if(X.length===1)N=Number(X[0]),Q=[];else N=Number(X[0]),Q=X[1].split(",");let Y=Q.map((B)=>B.trim()),R={section:h,type:h,people:Y,task:q,score:N};y.push(R)},"addTask"),yq=J(function(q){let K={section:h,type:h,description:q,task:q,classes:[]};f.push(K)},"addTaskOrg"),Xq=J(function(){let q=J(function(X){return y[X].processed},"compileTask"),K=!0;for(let[X,N]of y.entries())q(X),K=K&&N.processed;return K},"compileTasks"),xq=J(function(){return hq()},"getActors"),Zq={getConfig:J(()=>u().journey,"getConfig"),clear:$q,setDiagramTitle:Fq,getDiagramTitle:Wq,setAccTitle:Iq,getAccTitle:Mq,setAccDescription:Nq,getAccDescription:Rq,addSection:bq,getSections:uq,getTasks:gq,addTask:fq,addTaskOrg:yq,getActors:xq},_q=J((q)=>`.label {
    font-family: ${q.fontFamily};
    color: ${q.textColor};
  }
  .mouth {
    stroke: #666;
  }

  line {
    stroke: ${q.textColor}
  }

  .legend {
    fill: ${q.textColor};
    font-family: ${q.fontFamily};
  }

  .label text {
    fill: #333;
  }
  .label {
    color: ${q.textColor}
  }

  .face {
    ${q.faceColor?`fill: ${q.faceColor}`:"fill: #FFF8DC"};
    stroke: #999;
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${q.mainBkg};
    stroke: ${q.nodeBorder};
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${q.arrowheadColor};
  }

  .edgePaths .path {
    stroke: ${q.lineColor};
    stroke-width: 1.5px;
  }

  .flowchart-link {
    stroke: ${q.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${q.edgeLabelBackground};
    rect {
      opacity: 0.5;
    }
    text-align: center;
  }

  .cluster rect {
  }

  .cluster text {
    fill: ${q.titleColor};
  }

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${q.fontFamily};
    font-size: 12px;
    background: ${q.tertiaryColor};
    border: 1px solid ${q.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .task-type-0, .section-type-0  {
    ${q.fillType0?`fill: ${q.fillType0}`:""};
  }
  .task-type-1, .section-type-1  {
    ${q.fillType0?`fill: ${q.fillType1}`:""};
  }
  .task-type-2, .section-type-2  {
    ${q.fillType0?`fill: ${q.fillType2}`:""};
  }
  .task-type-3, .section-type-3  {
    ${q.fillType0?`fill: ${q.fillType3}`:""};
  }
  .task-type-4, .section-type-4  {
    ${q.fillType0?`fill: ${q.fillType4}`:""};
  }
  .task-type-5, .section-type-5  {
    ${q.fillType0?`fill: ${q.fillType5}`:""};
  }
  .task-type-6, .section-type-6  {
    ${q.fillType0?`fill: ${q.fillType6}`:""};
  }
  .task-type-7, .section-type-7  {
    ${q.fillType0?`fill: ${q.fillType7}`:""};
  }

  .actor-0 {
    ${q.actor0?`fill: ${q.actor0}`:""};
  }
  .actor-1 {
    ${q.actor1?`fill: ${q.actor1}`:""};
  }
  .actor-2 {
    ${q.actor2?`fill: ${q.actor2}`:""};
  }
  .actor-3 {
    ${q.actor3?`fill: ${q.actor3}`:""};
  }
  .actor-4 {
    ${q.actor4?`fill: ${q.actor4}`:""};
  }
  .actor-5 {
    ${q.actor5?`fill: ${q.actor5}`:""};
  }
  ${Pq()}
`,"getStyles"),pq=_q,qq=J(function(q,K){return Eq(q,K)},"drawRect"),kq=J(function(q,K){let N=q.append("circle").attr("cx",K.cx).attr("cy",K.cy).attr("class","face").attr("r",15).attr("stroke-width",2).attr("overflow","visible"),Q=q.append("g");Q.append("circle").attr("cx",K.cx-5).attr("cy",K.cy-5).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666"),Q.append("circle").attr("cx",K.cx+5).attr("cy",K.cy-5).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666");function Y(F){let W=n().startAngle(Math.PI/2).endAngle(3*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);F.append("path").attr("class","mouth").attr("d",W).attr("transform","translate("+K.cx+","+(K.cy+2)+")")}J(Y,"smile");function R(F){let W=n().startAngle(3*Math.PI/2).endAngle(5*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);F.append("path").attr("class","mouth").attr("d",W).attr("transform","translate("+K.cx+","+(K.cy+7)+")")}J(R,"sad");function B(F){F.append("line").attr("class","mouth").attr("stroke",2).attr("x1",K.cx-5).attr("y1",K.cy+7).attr("x2",K.cx+5).attr("y2",K.cy+7).attr("class","mouth").attr("stroke-width","1px").attr("stroke","#666")}if(J(B,"ambivalent"),K.score>3)Y(Q);else if(K.score<3)R(Q);else B(Q);return N},"drawFace"),Vq=J(function(q,K){let X=q.append("circle");if(X.attr("cx",K.cx),X.attr("cy",K.cy),X.attr("class","actor-"+K.pos),X.attr("fill",K.fill),X.attr("stroke",K.stroke),X.attr("r",K.r),X.class!==void 0)X.attr("class",X.class);if(K.title!==void 0)X.append("title").text(K.title);return X},"drawCircle"),Aq=J(function(q,K){return Lq(q,K)},"drawText"),dq=J(function(q,K){function X(Q,Y,R,B,F){return Q+","+Y+" "+(Q+R)+","+Y+" "+(Q+R)+","+(Y+B-F)+" "+(Q+R-F*1.2)+","+(Y+B)+" "+Q+","+(Y+B)}J(X,"genPoints");let N=q.append("polygon");N.attr("points",X(K.x,K.y,50,20,7)),N.attr("class","labelBox"),K.y=K.y+K.labelMargin,K.x=K.x+0.5*K.labelMargin,Aq(q,K)},"drawLabel"),mq=J(function(q,K,X){let N=q.append("g"),Q=e();Q.x=K.x,Q.y=K.y,Q.fill=K.fill,Q.width=X.width*K.taskCount+X.diagramMarginX*(K.taskCount-1),Q.height=X.height,Q.class="journey-section section-type-"+K.num,Q.rx=3,Q.ry=3,qq(N,Q),Oq(X)(K.text,N,Q.x,Q.y,Q.width,Q.height,{class:"journey-section section-type-"+K.num},X,K.colour)},"drawSection"),a=-1,lq=J(function(q,K,X,N){let Q=K.x+X.width/2,Y=q.append("g");a++;let R=450;Y.append("line").attr("id",N+"-task"+a).attr("x1",Q).attr("y1",K.y).attr("x2",Q).attr("y2",R).attr("class","task-line").attr("stroke-width","1px").attr("stroke-dasharray","4 2").attr("stroke","#666"),kq(Y,{cx:Q,cy:300+(5-K.score)*30,score:K.score});let B=e();B.x=K.x,B.y=K.y,B.fill=K.fill,B.width=X.width,B.height=X.height,B.class="task task-type-"+K.num,B.rx=3,B.ry=3,qq(Y,B);let F=K.x+14;K.people.forEach((W)=>{let E=K.actors[W].color,z={cx:F,cy:K.y,r:7,fill:E,stroke:"#000",title:W,pos:K.actors[W].position};Vq(Y,z),F+=10}),Oq(X)(K.task,Y,B.x,B.y,B.width,B.height,{class:"task"},X,K.colour)},"drawTask"),iq=J(function(q,K){Cq(q,K)},"drawBackgroundRect"),Oq=function(){function q(Q,Y,R,B,F,W,E,z){let U=Y.append("text").attr("x",R+F/2).attr("y",B+W/2+5).style("font-color",z).style("text-anchor","middle").text(Q);N(U,E)}J(q,"byText");function K(Q,Y,R,B,F,W,E,z,U){let{taskFontSize:G,taskFontFamily:Z}=z,I=Q.split(/<br\s*\/?>/gi);for(let M=0;M<I.length;M++){let H=M*G-G*(I.length-1)/2,P=Y.append("text").attr("x",R+F/2).attr("y",B).attr("fill",U).style("text-anchor","middle").style("font-size",G).style("font-family",Z);P.append("tspan").attr("x",R+F/2).attr("dy",H).text(I[M]),P.attr("y",B+W/2).attr("dominant-baseline","central").attr("alignment-baseline","central"),N(P,E)}}J(K,"byTspan");function X(Q,Y,R,B,F,W,E,z){let U=Y.append("switch"),Z=U.append("foreignObject").attr("x",R).attr("y",B).attr("width",F).attr("height",W).attr("position","fixed").append("xhtml:div").style("display","table").style("height","100%").style("width","100%");Z.append("div").attr("class","label").style("display","table-cell").style("text-align","center").style("vertical-align","middle").text(Q),K(Q,U,R,B,F,W,E,z),N(Z,E)}J(X,"byFo");function N(Q,Y){for(let R in Y)if(R in Y)Q.attr(R,Y[R])}return J(N,"_setTextAttrs"),function(Q){return Q.textPlacement==="fo"?X:Q.textPlacement==="old"?q:K}}(),rq=J(function(q,K){a=-1,q.append("defs").append("marker").attr("id",K+"-arrowhead").attr("refX",5).attr("refY",2).attr("markerWidth",6).attr("markerHeight",4).attr("orient","auto").append("path").attr("d","M 0,0 V 4 L6,2 Z")},"initGraphics"),x={drawRect:qq,drawCircle:Vq,drawSection:mq,drawText:Aq,drawLabel:dq,drawTask:lq,drawBackgroundRect:iq,initGraphics:rq},cq=J(function(q){Object.keys(q).forEach(function(X){S[X]=q[X]})},"setConf"),T={},d=0;function vq(q){let K=u().journey,X=K.maxLabelWidth;d=0;let N=60;Object.keys(T).forEach((Q)=>{let Y=T[Q].color,R={cx:20,cy:N,r:7,fill:Y,stroke:"#000",pos:T[Q].position};x.drawCircle(q,R);let B=q.append("text").attr("visibility","hidden").text(Q),F=B.node().getBoundingClientRect().width;B.remove();let W=[];if(F<=X)W=[Q];else{let E=Q.split(" "),z="";if(B=q.append("text").attr("visibility","hidden"),E.forEach((U)=>{let G=z?`${z} ${U}`:U;if(B.text(G),B.node().getBoundingClientRect().width>X){if(z)W.push(z);if(z=U,B.text(U),B.node().getBoundingClientRect().width>X){let I="";for(let M of U)if(I+=M,B.text(I+"-"),B.node().getBoundingClientRect().width>X)W.push(I.slice(0,-1)+"-"),I=M;z=I}}else z=G}),z)W.push(z);B.remove()}W.forEach((E,z)=>{let U={x:40,y:N+7+z*20,fill:"#666",text:E,textMargin:K.boxTextMargin??5},Z=x.drawText(q,U).node().getBoundingClientRect().width;if(Z>d&&Z>K.leftMargin-Z)d=Z}),N+=Math.max(20,W.length*20)})}J(vq,"drawActorLegend");var S=u().journey,D=0,sq=J(function(q,K,X,N){let Q=u(),Y=Q.journey.titleColor,R=Q.journey.titleFontSize,B=Q.journey.titleFontFamily,F=Q.securityLevel,W;if(F==="sandbox")W=k("#i"+K);let E=F==="sandbox"?k(W.nodes()[0].contentDocument.body):k("body");v.init();let z=E.select("#"+K);x.initGraphics(z,K);let U=N.db.getTasks(),G=N.db.getDiagramTitle(),Z=N.db.getActors();for(let w in T)delete T[w];let I=0;Z.forEach((w)=>{T[w]={color:S.actorColours[I%S.actorColours.length],position:I},I++}),vq(z),D=S.leftMargin+d,v.insert(0,0,D,Object.keys(T).length*50),nq(z,U,0,K);let M=v.getBounds();if(G)z.append("text").text(G).attr("x",D).attr("font-size",R).attr("font-weight","bold").attr("y",25).attr("fill",Y).attr("font-family",B);let H=M.stopy-M.starty+2*S.diagramMarginY,P=D+M.stopx+2*S.diagramMarginX;zq(z,H,P,S.useMaxWidth),z.append("line").attr("x1",D).attr("y1",S.height*4).attr("x2",P-D-4).attr("y2",S.height*4).attr("stroke-width",4).attr("stroke","black").attr("marker-end","url(#"+K+"-arrowhead)");let C=G?70:0;z.attr("viewBox",`${M.startx} -25 ${P} ${H+C}`),z.attr("preserveAspectRatio","xMinYMin meet"),z.attr("height",H+C+25)},"draw"),v={data:{startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},verticalPos:0,sequenceItems:[],init:J(function(){this.sequenceItems=[],this.data={startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},this.verticalPos=0},"init"),updateVal:J(function(q,K,X,N){if(q[K]===void 0)q[K]=X;else q[K]=N(X,q[K])},"updateVal"),updateBounds:J(function(q,K,X,N){let Q=u().journey,Y=this,R=0;function B(F){return J(function(E){R++;let z=Y.sequenceItems.length-R+1;if(Y.updateVal(E,"starty",K-z*Q.boxMargin,Math.min),Y.updateVal(E,"stopy",N+z*Q.boxMargin,Math.max),Y.updateVal(v.data,"startx",q-z*Q.boxMargin,Math.min),Y.updateVal(v.data,"stopx",X+z*Q.boxMargin,Math.max),F!=="activation")Y.updateVal(E,"startx",q-z*Q.boxMargin,Math.min),Y.updateVal(E,"stopx",X+z*Q.boxMargin,Math.max),Y.updateVal(v.data,"starty",K-z*Q.boxMargin,Math.min),Y.updateVal(v.data,"stopy",N+z*Q.boxMargin,Math.max)},"updateItemBounds")}J(B,"updateFn"),this.sequenceItems.forEach(B())},"updateBounds"),insert:J(function(q,K,X,N){let Q=Math.min(q,X),Y=Math.max(q,X),R=Math.min(K,N),B=Math.max(K,N);this.updateVal(v.data,"startx",Q,Math.min),this.updateVal(v.data,"starty",R,Math.min),this.updateVal(v.data,"stopx",Y,Math.max),this.updateVal(v.data,"stopy",B,Math.max),this.updateBounds(Q,R,Y,B)},"insert"),bumpVerticalPos:J(function(q){this.verticalPos=this.verticalPos+q,this.data.stopy=this.verticalPos},"bumpVerticalPos"),getVerticalPos:J(function(){return this.verticalPos},"getVerticalPos"),getBounds:J(function(){return this.data},"getBounds")},s=S.sectionFills,Bq=S.sectionColours,nq=J(function(q,K,X,N){let Q=u().journey,Y="",R=Q.height*2+Q.diagramMarginY,B=X+R,F=0,W="#CCC",E="black",z=0;for(let[U,G]of K.entries()){if(Y!==G.section){W=s[F%s.length],z=F%s.length,E=Bq[F%Bq.length];let I=0,M=G.section;for(let P=U;P<K.length;P++)if(K[P].section==M)I=I+1;else break;let H={x:U*Q.taskMargin+U*Q.width+D,y:50,text:G.section,fill:W,num:z,colour:E,taskCount:I};x.drawSection(q,H,Q),Y=G.section,F++}let Z=G.people.reduce((I,M)=>{if(T[M])I[M]=T[M];return I},{});G.x=U*Q.taskMargin+U*Q.width+D,G.y=B,G.width=Q.diagramMarginX,G.height=Q.diagramMarginY,G.colour=E,G.fill=W,G.num=z,G.actors=Z,x.drawTask(q,G,Q,N),v.insert(G.x,G.y,G.x+G.width+Q.taskMargin,450)}},"drawTasks"),Hq={setConf:cq,draw:sq},GK={parser:Dq,db:Zq,renderer:Hq,styles:pq,init:J((q)=>{Hq.setConf(q.journey),Zq.clear()},"init")};export{GK as diagram};
