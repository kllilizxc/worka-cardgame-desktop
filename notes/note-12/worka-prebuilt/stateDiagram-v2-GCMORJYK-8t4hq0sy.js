import{W as QJ}from"./entry-wp1v8p1e.js";import{X as WJ}from"./entry-h54j6bqx.js";import{Z as zJ,_ as JJ}from"./entry-7prjh1gj.js";import{$ as XJ}from"./entry-ekkdcj42.js";import"./entry-fgfhw8sn.js";import"./entry-a8v3fk5n.js";import"./entry-xakswadk.js";import"./entry-7n346g41.js";import"./entry-0yst6azd.js";import"./entry-8f0yn3tb.js";import"./entry-hw42zbkw.js";import{le as sz,me as oz,ne as tz,oe as ez}from"./entry-r0dh9z5n.js";import"./entry-k25h3z2y.js";import"./entry-ve3hj3e0.js";import{Ge as nz,Pe as az}from"./entry-r25rswdq.js";import"./entry-cbb8dzk2.js";import{$e as cz,Hf as $,Nf as pz,Of as mz,Pf as $z,Qf as lz,Rf as rz,Sf as dz,Tf as iz,Uf as V}from"./entry-n67ezgch.js";import{ag as w,gg as Fz}from"./entry-2d6vybcz.js";import{$g as U}from"./entry-6228z9nn.js";import"./entry-j27rn7mz.js";var hz=function(){var z=U(function(p,q,Y,X){for(Y=Y||{},X=p.length;X--;Y[p[X]]=q);return Y},"o"),J=[1,2],K=[1,3],Q=[1,4],B=[2,4],H=[1,9],G=[1,11],R=[1,16],Z=[1,17],P=[1,18],L=[1,19],f=[1,33],N=[1,20],k=[1,21],u=[1,22],M=[1,23],E=[1,24],A=[1,26],g=[1,27],D=[1,28],S=[1,29],b=[1,30],d=[1,31],Xz=[1,32],Zz=[1,35],Kz=[1,36],qz=[1,37],jz=[1,38],i=[1,34],F=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],Bz=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],Dz=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],Lz={trace:U(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"CLICK",39:"STRING",40:"HREF",41:"classDef",42:"CLASSDEF_ID",43:"CLASSDEF_STYLEOPTS",44:"DEFAULT",45:"style",46:"STYLE_IDS",47:"STYLEDEF_STYLEOPTS",48:"class",49:"CLASSENTITY_IDS",50:"STYLECLASS",51:"direction_tb",52:"direction_bt",53:"direction_rl",54:"direction_lr",56:";",57:"EDGE_STATE",58:"STYLE_SEPARATOR",59:"left_of",60:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:U(function(q,Y,X,v,O,W,n){var j=W.length-1;switch(O){case 3:return v.setRootDoc(W[j]),W[j];break;case 4:this.$=[];break;case 5:if(W[j]!="nl")W[j-1].push(W[j]),this.$=W[j-1];break;case 6:case 7:this.$=W[j];break;case 8:this.$="nl";break;case 12:this.$=W[j];break;case 13:let Yz=W[j-1];Yz.description=v.trimColon(W[j]),this.$=Yz;break;case 14:this.$={stmt:"relation",state1:W[j-2],state2:W[j]};break;case 15:let Uz=v.trimColon(W[j]);this.$={stmt:"relation",state1:W[j-3],state2:W[j-1],description:Uz};break;case 19:this.$={stmt:"state",id:W[j-3],type:"default",description:"",doc:W[j-1]};break;case 20:var I=W[j],y=W[j-2].trim();if(W[j].match(":")){var t=W[j].split(":");I=t[0],y=[y,t[1]]}this.$={stmt:"state",id:I,type:"default",description:y};break;case 21:this.$={stmt:"state",id:W[j-3],type:"default",description:W[j-5],doc:W[j-1]};break;case 22:this.$={stmt:"state",id:W[j],type:"fork"};break;case 23:this.$={stmt:"state",id:W[j],type:"join"};break;case 24:this.$={stmt:"state",id:W[j],type:"choice"};break;case 25:this.$={stmt:"state",id:v.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:W[j-1].trim(),note:{position:W[j-2].trim(),text:W[j].trim()}};break;case 29:this.$=W[j].trim(),v.setAccTitle(this.$);break;case 30:case 31:this.$=W[j].trim(),v.setAccDescription(this.$);break;case 32:this.$={stmt:"click",id:W[j-3],url:W[j-2],tooltip:W[j-1]};break;case 33:this.$={stmt:"click",id:W[j-3],url:W[j-1],tooltip:""};break;case 34:case 35:this.$={stmt:"classDef",id:W[j-1].trim(),classes:W[j].trim()};break;case 36:this.$={stmt:"style",id:W[j-1].trim(),styleClass:W[j].trim()};break;case 37:this.$={stmt:"applyClass",id:W[j-1].trim(),styleClass:W[j].trim()};break;case 38:v.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 39:v.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 40:v.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 41:v.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 44:case 45:this.$={stmt:"state",id:W[j].trim(),type:"default",description:""};break;case 46:this.$={stmt:"state",id:W[j-2].trim(),classes:[W[j].trim()],type:"default",description:""};break;case 47:this.$={stmt:"state",id:W[j-2].trim(),classes:[W[j].trim()],type:"default",description:""};break}},"anonymous"),table:[{3:1,4:J,5:K,6:Q},{1:[3]},{3:5,4:J,5:K,6:Q},{3:6,4:J,5:K,6:Q},z([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],B,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:H,5:G,8:8,9:10,10:12,11:13,12:14,13:15,16:R,17:Z,19:P,22:L,24:f,25:N,26:k,27:u,28:M,29:E,32:25,33:A,35:g,37:D,38:S,41:b,45:d,48:Xz,51:Zz,52:Kz,53:qz,54:jz,57:i},z(F,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:R,17:Z,19:P,22:L,24:f,25:N,26:k,27:u,28:M,29:E,32:25,33:A,35:g,37:D,38:S,41:b,45:d,48:Xz,51:Zz,52:Kz,53:qz,54:jz,57:i},z(F,[2,7]),z(F,[2,8]),z(F,[2,9]),z(F,[2,10]),z(F,[2,11]),z(F,[2,12],{14:[1,40],15:[1,41]}),z(F,[2,16]),{18:[1,42]},z(F,[2,18],{20:[1,43]}),{23:[1,44]},z(F,[2,22]),z(F,[2,23]),z(F,[2,24]),z(F,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},z(F,[2,28]),{34:[1,49]},{36:[1,50]},z(F,[2,31]),{13:51,24:f,57:i},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},z(Bz,[2,44],{58:[1,56]}),z(Bz,[2,45],{58:[1,57]}),z(F,[2,38]),z(F,[2,39]),z(F,[2,40]),z(F,[2,41]),z(F,[2,6]),z(F,[2,13]),{13:58,24:f,57:i},z(F,[2,17]),z(Dz,B,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},z(F,[2,29]),z(F,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},z(F,[2,14],{14:[1,71]}),{4:H,5:G,8:8,9:10,10:12,11:13,12:14,13:15,16:R,17:Z,19:P,21:[1,72],22:L,24:f,25:N,26:k,27:u,28:M,29:E,32:25,33:A,35:g,37:D,38:S,41:b,45:d,48:Xz,51:Zz,52:Kz,53:qz,54:jz,57:i},z(F,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},z(F,[2,34]),z(F,[2,35]),z(F,[2,36]),z(F,[2,37]),z(Bz,[2,46]),z(Bz,[2,47]),z(F,[2,15]),z(F,[2,19]),z(Dz,B,{7:78}),z(F,[2,26]),z(F,[2,27]),{5:[1,79]},{5:[1,80]},{4:H,5:G,8:8,9:10,10:12,11:13,12:14,13:15,16:R,17:Z,19:P,21:[1,81],22:L,24:f,25:N,26:k,27:u,28:M,29:E,32:25,33:A,35:g,37:D,38:S,41:b,45:d,48:Xz,51:Zz,52:Kz,53:qz,54:jz,57:i},z(F,[2,32]),z(F,[2,33]),z(F,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:U(function(q,Y){if(Y.recoverable)this.trace(q);else{var X=Error(q);throw X.hash=Y,X}},"parseError"),parse:U(function(q){var Y=this,X=[0],v=[],O=[null],W=[],n=this.table,j="",I=0,y=0,t=0,Yz=2,Uz=1,OJ=W.slice.call(arguments,1),x=Object.create(this.lexer),l={yy:{}};for(var Oz in this.yy)if(Object.prototype.hasOwnProperty.call(this.yy,Oz))l.yy[Oz]=this.yy[Oz];if(x.setInput(q,l.yy),l.yy.lexer=x,l.yy.parser=this,typeof x.yylloc>"u")x.yylloc={};var wz=x.yylloc;W.push(wz);var wJ=x.options&&x.options.ranges;if(typeof l.yy.parseError==="function")this.parseError=l.yy.parseError;else this.parseError=Object.getPrototypeOf(this).parseError;function xJ(_){X.length=X.length-2*_,O.length=O.length-_,W.length=W.length-_}U(xJ,"popStack");function kz(){var _=v.pop()||x.lex()||Uz;if(typeof _!=="number"){if(_ instanceof Array)v=_,_=v.pop();_=Y.symbols_[_]||_}return _}U(kz,"lex");var C,xz,r,T,zQ,bz,a={},Mz,c,Tz,Gz;while(!0){if(r=X[X.length-1],this.defaultActions[r])T=this.defaultActions[r];else{if(C===null||typeof C>"u")C=kz();T=n[r]&&n[r][C]}if(typeof T>"u"||!T.length||!T[0]){var uz="";Gz=[];for(Mz in n[r])if(this.terminals_[Mz]&&Mz>Yz)Gz.push("'"+this.terminals_[Mz]+"'");if(x.showPosition)uz="Parse error on line "+(I+1)+`:
`+x.showPosition()+`
Expecting `+Gz.join(", ")+", got '"+(this.terminals_[C]||C)+"'";else uz="Parse error on line "+(I+1)+": Unexpected "+(C==Uz?"end of input":"'"+(this.terminals_[C]||C)+"'");this.parseError(uz,{text:x.match,token:this.terminals_[C]||C,line:x.yylineno,loc:wz,expected:Gz})}if(T[0]instanceof Array&&T.length>1)throw Error("Parse Error: multiple actions possible at state: "+r+", token: "+C);switch(T[0]){case 1:if(X.push(C),O.push(x.yytext),W.push(x.yylloc),X.push(T[1]),C=null,!xz){if(y=x.yyleng,j=x.yytext,I=x.yylineno,wz=x.yylloc,t>0)t--}else C=xz,xz=null;break;case 2:if(c=this.productions_[T[1]][1],a.$=O[O.length-c],a._$={first_line:W[W.length-(c||1)].first_line,last_line:W[W.length-1].last_line,first_column:W[W.length-(c||1)].first_column,last_column:W[W.length-1].last_column},wJ)a._$.range=[W[W.length-(c||1)].range[0],W[W.length-1].range[1]];if(bz=this.performAction.apply(a,[j,y,I,l.yy,T[1],O,W].concat(OJ)),typeof bz<"u")return bz;if(c)X=X.slice(0,-1*c*2),O=O.slice(0,-1*c),W=W.slice(0,-1*c);X.push(this.productions_[T[1]][0]),O.push(a.$),W.push(a._$),Tz=n[X[X.length-2]][X[X.length-1]],X.push(Tz);break;case 3:return!0}}return!0},"parse")},LJ=function(){var p={EOF:1,parseError:U(function(Y,X){if(this.yy.parser)this.yy.parser.parseError(Y,X);else throw Error(Y)},"parseError"),setInput:U(function(q,Y){if(this.yy=Y||this.yy||{},this._input=q,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges)this.yylloc.range=[0,0];return this.offset=0,this},"setInput"),input:U(function(){var q=this._input[0];this.yytext+=q,this.yyleng++,this.offset++,this.match+=q,this.matched+=q;var Y=q.match(/(?:\r\n?|\n).*/g);if(Y)this.yylineno++,this.yylloc.last_line++;else this.yylloc.last_column++;if(this.options.ranges)this.yylloc.range[1]++;return this._input=this._input.slice(1),q},"input"),unput:U(function(q){var Y=q.length,X=q.split(/(?:\r\n?|\n)/g);this._input=q+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-Y),this.offset-=Y;var v=this.match.split(/(?:\r\n?|\n)/g);if(this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),X.length-1)this.yylineno-=X.length-1;var O=this.yylloc.range;if(this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:X?(X.length===v.length?this.yylloc.first_column:0)+v[v.length-X.length].length-X[0].length:this.yylloc.first_column-Y},this.options.ranges)this.yylloc.range=[O[0],O[0]+this.yyleng-Y];return this.yyleng=this.yytext.length,this},"unput"),more:U(function(){return this._more=!0,this},"more"),reject:U(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:U(function(q){this.unput(this.match.slice(q))},"less"),pastInput:U(function(){var q=this.matched.substr(0,this.matched.length-this.match.length);return(q.length>20?"...":"")+q.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:U(function(){var q=this.match;if(q.length<20)q+=this._input.substr(0,20-q.length);return(q.substr(0,20)+(q.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:U(function(){var q=this.pastInput(),Y=Array(q.length+1).join("-");return q+this.upcomingInput()+`
`+Y+"^"},"showPosition"),test_match:U(function(q,Y){var X,v,O;if(this.options.backtrack_lexer){if(O={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges)O.yylloc.range=this.yylloc.range.slice(0)}if(v=q[0].match(/(?:\r\n?|\n).*/g),v)this.yylineno+=v.length;if(this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+q[0].length},this.yytext+=q[0],this.match+=q[0],this.matches=q,this.yyleng=this.yytext.length,this.options.ranges)this.yylloc.range=[this.offset,this.offset+=this.yyleng];if(this._more=!1,this._backtrack=!1,this._input=this._input.slice(q[0].length),this.matched+=q[0],X=this.performAction.call(this,this.yy,this,Y,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input)this.done=!1;if(X)return X;else if(this._backtrack){for(var W in O)this[W]=O[W];return!1}return!1},"test_match"),next:U(function(){if(this.done)return this.EOF;if(!this._input)this.done=!0;var q,Y,X,v;if(!this._more)this.yytext="",this.match="";var O=this._currentRules();for(var W=0;W<O.length;W++)if(X=this._input.match(this.rules[O[W]]),X&&(!Y||X[0].length>Y[0].length)){if(Y=X,v=W,this.options.backtrack_lexer)if(q=this.test_match(X,O[W]),q!==!1)return q;else if(this._backtrack){Y=!1;continue}else return!1;else if(!this.options.flex)break}if(Y){if(q=this.test_match(Y,O[v]),q!==!1)return q;return!1}if(this._input==="")return this.EOF;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:U(function(){var Y=this.next();if(Y)return Y;else return this.lex()},"lex"),begin:U(function(Y){this.conditionStack.push(Y)},"begin"),popState:U(function(){var Y=this.conditionStack.length-1;if(Y>0)return this.conditionStack.pop();else return this.conditionStack[0]},"popState"),_currentRules:U(function(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1])return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;else return this.conditions.INITIAL.rules},"_currentRules"),topState:U(function(Y){if(Y=this.conditionStack.length-1-Math.abs(Y||0),Y>=0)return this.conditionStack[Y];else return"INITIAL"},"topState"),pushState:U(function(Y){this.begin(Y)},"pushState"),stateStackSize:U(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:U(function(Y,X,v,O){function W(){let j=X.yytext.indexOf("%%");if(j===0)return!1;if(j>0){let I=X.yytext.slice(0,j),y=X.yytext.slice(j);if(y)Y.lexer.unput(y);X.yytext=I}return!0}U(W,"processId");var n=O;switch(v){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:return 5;case 9:break;case 10:break;case 11:break;case 12:break;case 13:return this.pushState("SCALE"),17;break;case 14:return 18;case 15:this.popState();break;case 16:return this.begin("acc_title"),33;break;case 17:return this.popState(),"acc_title_value";break;case 18:return this.begin("acc_descr"),35;break;case 19:return this.popState(),"acc_descr_value";break;case 20:this.begin("acc_descr_multiline");break;case 21:this.popState();break;case 22:return"acc_descr_multiline_value";case 23:return this.pushState("CLASSDEF"),41;break;case 24:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";break;case 25:return this.popState(),this.pushState("CLASSDEFID"),42;break;case 26:return this.popState(),43;break;case 27:return this.pushState("CLASS"),48;break;case 28:return this.popState(),this.pushState("CLASS_STYLE"),49;break;case 29:return this.popState(),50;break;case 30:return this.pushState("STYLE"),45;break;case 31:return this.popState(),this.pushState("STYLEDEF_STYLES"),46;break;case 32:return this.popState(),47;break;case 33:return this.pushState("SCALE"),17;break;case 34:return 18;case 35:this.popState();break;case 36:this.pushState("STATE");break;case 37:return this.popState(),X.yytext=X.yytext.slice(0,-8).trim(),25;break;case 38:return this.popState(),X.yytext=X.yytext.slice(0,-8).trim(),26;break;case 39:return this.popState(),X.yytext=X.yytext.slice(0,-10).trim(),27;break;case 40:return this.popState(),X.yytext=X.yytext.slice(0,-8).trim(),25;break;case 41:return this.popState(),X.yytext=X.yytext.slice(0,-8).trim(),26;break;case 42:return this.popState(),X.yytext=X.yytext.slice(0,-10).trim(),27;break;case 43:return 51;case 44:return 52;case 45:return 53;case 46:return 54;case 47:this.pushState("STATE_STRING");break;case 48:return this.pushState("STATE_ID"),"AS";break;case 49:if(!W())return;return this.popState(),"ID";break;case 50:this.popState();break;case 51:return"STATE_DESCR";case 52:throw Error('Error: State name must be a single word. Found: "'+X.yytext.trim()+'"');case 53:return 19;case 54:this.popState();break;case 55:return this.popState(),this.pushState("struct"),20;break;case 56:return this.popState(),21;break;case 57:break;case 58:return this.begin("NOTE"),29;break;case 59:return this.popState(),this.pushState("NOTE_ID"),59;break;case 60:return this.popState(),this.pushState("NOTE_ID"),60;break;case 61:this.popState(),this.pushState("FLOATING_NOTE");break;case 62:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";break;case 63:break;case 64:return"NOTE_TEXT";case 65:if(!W())return;return this.popState(),"ID";break;case 66:if(!W())return;return this.popState(),this.pushState("NOTE_TEXT"),24;break;case 67:return this.popState(),X.yytext=X.yytext.substr(2).trim(),31;break;case 68:return this.popState(),X.yytext=X.yytext.slice(0,-8).trim(),31;break;case 69:return 6;case 70:return 6;case 71:return 16;case 72:return 57;case 73:if(!W())return;return 24;case 74:return X.yytext=X.yytext.trim(),14;break;case 75:return 15;case 76:return 28;case 77:return 58;case 78:return 5;case 79:return"INVALID"}},"anonymous"),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:\w+\s+\w+.*?\{)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?\n\s*end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:(?:[^:\n;]|:[^:\n;])+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[10,11,12],inclusive:!1},struct:{rules:[10,11,12,23,27,30,36,43,44,45,46,56,57,58,72,73,74,75,76,77],inclusive:!1},FLOATING_NOTE_ID:{rules:[65],inclusive:!1},FLOATING_NOTE:{rules:[62,63,64],inclusive:!1},NOTE_TEXT:{rules:[67,68],inclusive:!1},NOTE_ID:{rules:[66],inclusive:!1},NOTE:{rules:[59,60,61],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[32],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[31],inclusive:!1},CLASS_STYLE:{rules:[29],inclusive:!1},CLASS:{rules:[28],inclusive:!1},CLASSDEFID:{rules:[26],inclusive:!1},CLASSDEF:{rules:[24,25],inclusive:!1},acc_descr_multiline:{rules:[21,22],inclusive:!1},acc_descr:{rules:[19],inclusive:!1},acc_title:{rules:[17],inclusive:!1},SCALE:{rules:[14,15,34,35],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[49],inclusive:!1},STATE_STRING:{rules:[50,51],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[10,11,12,37,38,39,40,41,42,47,48,52,53,54,55],inclusive:!1},ID:{rules:[10,11,12],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,11,12,13,16,18,20,23,27,30,33,36,55,58,69,70,71,72,73,74,75,77,78,79],inclusive:!0}}};return p}();Lz.lexer=LJ;function Hz(){this.yy={}}return U(Hz,"Parser"),Hz.prototype=Lz,Lz.Parser=Hz,new Hz}();hz.parser=hz;var bJ=hz,uJ="TB",ZJ="TB",_z="dir",o="state",s="root",fz="relation",AJ="classDef",CJ="style",hJ="applyClass",Qz="default",KJ="divider",qJ="fill:none",jJ="fill: #333",BJ="c",HJ="markdown",YJ="normal",Az="rect",Cz="rectWithTitle",fJ="stateStart",NJ="stateEnd",Nz="divider",Vz="roundedWithTitle",EJ="note",DJ="noteGroup",Wz="statediagram",kJ="state",TJ=`${Wz}-${kJ}`,UJ="transition",_J="note",VJ="note-edge",gJ=`${UJ} ${VJ}`,SJ=`${Wz}-${_J}`,IJ="cluster",yJ=`${Wz}-${IJ}`,cJ="cluster-alt",pJ=`${Wz}-${cJ}`,MJ="parent",GJ="note",mJ="state",Ez="----",$J=`${Ez}${GJ}`,gz=`${Ez}${MJ}`,vz=new Map,m=0,RJ=0,e=new Map,lJ=U((z,J,K,Q)=>{if(z===Nz&&K?.id!==void 0&&e.has(K.id)){let G=e.get(K.id);return e.set(J,G),G}let B=RJ++,H=Q?void 0:B;return e.set(J,H),H},"colorSlotFor");function Pz(z="",J=0,K="",Q=Ez){let B=K!==null&&K.length>0?`${Q}${K}`:"";return`${mJ}-${z}${B}-${J}`}U(Pz,"stateDomId");var rJ=U((z,J,K,Q,B,H,G,R)=>{w.trace("items",J),J.forEach((Z)=>{switch(Z.stmt){case o:Jz(z,Z,K,Q,B,H,G,R);break;case Qz:Jz(z,Z,K,Q,B,H,G,R);break;case fz:{Jz(z,Z.state1,K,Q,B,H,G,R),Jz(z,Z.state2,K,Q,B,H,G,R);let P=G==="neo",L={id:"edge"+m,start:Z.state1.id,end:Z.state2.id,arrowhead:"normal",arrowTypeEnd:P?"arrow_barb_neo":"arrow_barb",style:qJ,labelStyle:"",label:$.sanitizeText(Z.description??"",V()),arrowheadStyle:jJ,labelpos:BJ,labelType:HJ,thickness:YJ,classes:UJ,look:G};B.push(L),m++}break}})},"setupDoc"),Sz=U((z,J=ZJ)=>{let K=J;if(z.doc){for(let Q of z.doc)if(Q.stmt==="dir")K=Q.value}return K},"getDir");function zz(z,J,K){if(!J.id||J.id==="</join></fork>"||J.id==="</choice>")return;if(J.cssClasses){if(!Array.isArray(J.cssCompiledStyles))J.cssCompiledStyles=[];J.cssClasses.split(" ").forEach((B)=>{let H=K.get(B);if(H)J.cssCompiledStyles=[...J.cssCompiledStyles??[],...H.styles]})}let Q=z.find((B)=>B.id===J.id);if(Q)Object.assign(Q,J);else z.push(J)}U(zz,"insertOrUpdateNode");function FJ(z){return z?.classes?.join(" ")??""}U(FJ,"getClassesFromDbInfo");function vJ(z){return z?.styles??[]}U(vJ,"getStylesFromDbInfo");var Jz=U((z,J,K,Q,B,H,G,R)=>{let Z=J.id,P=K.get(Z),L=FJ(P),f=vJ(P),N=V(),k=L.trim()!==""||f.length>0;if(w.info("dataFetcher parsedItem",J,P,f),Z!=="root"){let u=Az;if(J.start===!0)u=fJ;else if(J.start===!1)u=NJ;if(J.type!==Qz)u=J.type;if(!vz.get(Z))vz.set(Z,{id:Z,shape:u,description:$.sanitizeText(Z,N),cssClasses:`${L} ${TJ}`,cssStyles:f});let M=vz.get(Z);if(J.description){if(Array.isArray(M.description))M.shape=Cz,M.description.push(J.description);else if(M.description?.length&&M.description.length>0)if(M.shape=Cz,M.description===Z)M.description=[J.description];else M.description=[M.description,J.description];else M.shape=Az,M.description=J.description;M.description=$.sanitizeTextOrArray(M.description,N)}if(M.description?.length===1&&M.shape===Cz)if(M.type==="group")M.shape=Vz;else M.shape=Az;if(!M.type&&J.doc)w.info("Setting cluster for XCX",Z,Sz(J)),M.type="group",M.isGroup=!0,M.dir=Sz(J),M.shape=J.type===KJ?Nz:Vz,M.colorIndex=lJ(M.shape,Z,z,k),M.cssClasses=`${M.cssClasses} ${yJ} ${H?pJ:""}`;let E={labelStyle:"",shape:M.shape,label:M.description,cssClasses:M.cssClasses,cssCompiledStyles:[],cssStyles:M.cssStyles,id:Z,dir:M.dir,domId:Pz(Z,m),type:M.type,isGroup:M.type==="group",colorIndex:M.colorIndex,padding:8,rx:10,ry:10,look:G,labelType:"markdown"};if(E.shape===Nz)E.label="";if(z&&z.id!=="root")w.trace("Setting node ",Z," to be child of its parent ",z.id),E.parentId=z.id;if(E.centerLabel=!0,J.note){let A={labelStyle:"",shape:EJ,label:J.note.text,labelType:"markdown",cssClasses:SJ,cssStyles:[],cssCompiledStyles:[],id:Z+$J+"-"+m,domId:Pz(Z,m,GJ),type:"node",isGroup:!1,padding:N.flowchart?.padding,look:G,position:J.note.position},g=Z+gz,D={labelStyle:"",shape:DJ,label:J.note.text,cssClasses:M.cssClasses,cssStyles:[],id:Z+gz,domId:Pz(Z,m,MJ),type:"group",isGroup:!0,padding:16,look:G,position:J.note.position};m++,D.id=g,A.parentId=g,zz(Q,D,R),zz(Q,A,R),zz(Q,E,R);let S=Z,b=A.id;if(J.note.position==="left of")S=A.id,b=Z;B.push({id:S+"-"+b,start:S,end:b,arrowhead:"none",arrowTypeEnd:"",style:qJ,labelStyle:"",classes:gJ,pattern:"dashed",arrowheadStyle:jJ,labelpos:BJ,labelType:HJ,thickness:YJ,look:G})}else zz(Q,E,R)}if(J.doc)w.trace("Adding nodes children "),rJ(J,J.doc,K,Q,B,!H,G,R)},"dataFetcher"),dJ=U(()=>{vz.clear(),m=0,RJ=0,e.clear()},"reset"),PJ=U((z,J=ZJ)=>{if(!z.doc)return J;let K=J;for(let Q of z.doc)if(Q.stmt==="dir")K=Q.value;return K},"getDir"),iJ=U(function(z,J){return J.db.getClasses()},"getClasses"),nJ=U(async function(z,J,K,Q){w.info("REF0:"),w.info("Drawing state diagram (v2)",J);let{securityLevel:B,state:H,layout:G}=V();Q.db.extract(Q.db.getRootDocV2());let R=Q.db.getData(),Z=WJ(J,B);if(R.type=Q.type,R.layoutAlgorithm=JJ(G),R.nodeSpacing=H?.nodeSpacing||50,R.rankSpacing=H?.rankSpacing||50,V().look==="neo")R.markers=["barbNeo"];else R.markers=["barb"];R.diagramId=J,await zJ(R,Z);let L=8;try{(typeof Q.db.getLinks==="function"?Q.db.getLinks():new Map).forEach((N,k)=>{let u=typeof k==="string"?k:typeof k?.id==="string"?k.id:"",M=R.nodes.find((b)=>b.id===u);if(!u){w.warn("⚠️ Invalid or missing stateId from key:",JSON.stringify(k));return}let E=Z.node()?.querySelectorAll("g.node, g.rough-node"),A;if(E?.forEach((b)=>{let d=b.textContent?.trim();if(b.id===M?.domId||d===u)A=b}),!A){w.warn("⚠️ Could not find node matching text:",u);return}let g=A.parentNode;if(!g){w.warn("⚠️ Node has no parent, cannot wrap:",u);return}let D=document.createElementNS("http://www.w3.org/2000/svg","a"),S=N.url.replace(/^"+|"+$/g,"");if(D.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",S),D.setAttribute("target","_blank"),N.tooltip){let b=N.tooltip.replace(/^"+|"+$/g,"");D.setAttribute("title",b),A.setAttribute("title",b)}g.replaceChild(D,A),D.appendChild(A),w.info("\uD83D\uDD17 Wrapped node in <a> tag for:",u,N.url)})}catch(f){w.error("❌ Error injecting clickable links:",f)}az.insertTitle(Z,"statediagramTitleText",H?.titleTopMargin??25,Q.db.getDiagramTitle()),XJ(Z,L,Wz,H?.useMaxWidth??!0)},"draw"),aJ={getClasses:iJ,draw:nJ,getDir:PJ},h={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},Iz=U(()=>new Map,"newClassesList"),yz=U(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),Rz=U((z)=>JSON.parse(JSON.stringify(z)),"clone"),sJ=class{constructor(z){this.version=z,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=Iz(),this.documents={root:yz()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.funs=[],this.getAccTitle=$z,this.setAccTitle=mz,this.getAccDescription=rz,this.setAccDescription=lz,this.setDiagramTitle=dz,this.getDiagramTitle=iz,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this),this.bindFunctions=this.bindFunctions.bind(this)}static{U(this,"StateDB")}static{this.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3}}extract(z){this.clear(!0);for(let Q of Array.isArray(z)?z:z.doc)switch(Q.stmt){case o:this.addState(Q.id.trim(),Q.type,Q.doc,Q.description,Q.note);break;case fz:this.addRelation(Q.state1,Q.state2,Q.description);break;case AJ:this.addStyleClass(Q.id.trim(),Q.classes);break;case CJ:this.handleStyleDef(Q);break;case hJ:this.setCssClass(Q.id.trim(),Q.styleClass);break;case"click":this.addLink(Q.id,Q.url,Q.tooltip);break}let J=this.getStates(),K=V();dJ(),Jz(void 0,this.getRootDocV2(),J,this.nodes,this.edges,!0,K.look,this.classes);for(let Q of this.nodes){if(!Array.isArray(Q.label))continue;if(Q.description=Q.label.slice(1),Q.isGroup&&Q.description.length>0)throw Error(`Group nodes can only have label. Remove the additional description for node [${Q.id}]`);Q.label=Q.label[0]}}handleStyleDef(z){let J=z.id.trim().split(","),K=z.styleClass.split(",");for(let Q of J){let B=this.getState(Q);if(!B){let H=Q.trim();this.addState(H),B=this.getState(H)}if(B)B.styles=K.map((H)=>H.replace(/;/g,"")?.trim())}}setRootDoc(z){if(w.info("Setting root doc",z),this.rootDoc=z,this.version===1)this.extract(z);else this.extract(this.getRootDocV2())}docTranslator(z,J,K){if(J.stmt===fz){this.docTranslator(z,J.state1,!0),this.docTranslator(z,J.state2,!1);return}if(J.stmt===o)if(J.id===h.START_NODE)J.id=z.id+(K?"_start":"_end"),J.start=K;else J.id=J.id.trim();if(J.stmt!==s&&J.stmt!==o||!J.doc)return;let Q=[],B=[];for(let H of J.doc)if(H.type===KJ){let G=Rz(H);G.doc=Rz(B),Q.push(G),B=[]}else B.push(H);if(Q.length>0&&B.length>0){let H={stmt:o,id:nz(),type:"divider",doc:Rz(B)};Q.push(Rz(H)),J.doc=Q}J.doc.forEach((H)=>this.docTranslator(J,H,!0))}getRootDocV2(){return this.docTranslator({id:s,stmt:s},{id:s,stmt:s,doc:this.rootDoc},!0),{id:s,doc:this.rootDoc}}addState(z,J=Qz,K=void 0,Q=void 0,B=void 0,H=void 0,G=void 0,R=void 0){let Z=z?.trim();if(!this.currentDocument.states.has(Z))w.info("Adding state ",Z,Q),this.currentDocument.states.set(Z,{stmt:o,id:Z,descriptions:[],type:J,doc:K,note:B,classes:[],styles:[],textStyles:[]});else{let P=this.currentDocument.states.get(Z);if(!P)throw Error(`State not found: ${Z}`);if(!P.doc)P.doc=K;if(!P.type)P.type=J}if(Q)w.info("Setting state description",Z,Q),(Array.isArray(Q)?Q:[Q]).forEach((L)=>this.addDescription(Z,L.trim()));if(B){let P=this.currentDocument.states.get(Z);if(!P)throw Error(`State not found: ${Z}`);P.note=B,P.note.text=$.sanitizeText(P.note.text,V())}if(H)w.info("Setting state classes",Z,H),(Array.isArray(H)?H:[H]).forEach((L)=>this.setCssClass(Z,L.trim()));if(G)w.info("Setting state styles",Z,G),(Array.isArray(G)?G:[G]).forEach((L)=>this.setStyle(Z,L.trim()));if(R)w.info("Setting state styles",Z,G),(Array.isArray(R)?R:[R]).forEach((L)=>this.setTextStyle(Z,L.trim()))}clear(z){if(this.nodes=[],this.edges=[],this.funs=[this.setupToolTips.bind(this)],this.documents={root:yz()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=Iz(),!z)this.links=new Map,pz()}getState(z){return this.currentDocument.states.get(z)}getStates(){return this.currentDocument.states}logDocuments(){w.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}addLink(z,J,K){this.links.set(z,{url:J,tooltip:K}),w.warn("Adding link",z,J,K)}getLinks(){return this.links}startIdIfNeeded(z=""){if(z===h.START_NODE)return this.startEndCount++,`${h.START_TYPE}${this.startEndCount}`;return z}startTypeIfNeeded(z="",J=Qz){return z===h.START_NODE?h.START_TYPE:J}endIdIfNeeded(z=""){if(z===h.END_NODE)return this.startEndCount++,`${h.END_TYPE}${this.startEndCount}`;return z}endTypeIfNeeded(z="",J=Qz){return z===h.END_NODE?h.END_TYPE:J}addRelationObjs(z,J,K=""){let Q=this.startIdIfNeeded(z.id.trim()),B=this.startTypeIfNeeded(z.id.trim(),z.type),H=this.startIdIfNeeded(J.id.trim()),G=this.startTypeIfNeeded(J.id.trim(),J.type);this.addState(Q,B,z.doc,z.description,z.note,z.classes,z.styles,z.textStyles),this.addState(H,G,J.doc,J.description,J.note,J.classes,J.styles,J.textStyles),this.currentDocument.relations.push({id1:Q,id2:H,relationTitle:$.sanitizeText(K,V())})}addRelation(z,J,K){if(typeof z==="object"&&typeof J==="object")this.addRelationObjs(z,J,K);else if(typeof z==="string"&&typeof J==="string"){let Q=this.startIdIfNeeded(z.trim()),B=this.startTypeIfNeeded(z),H=this.endIdIfNeeded(J.trim()),G=this.endTypeIfNeeded(J);this.addState(Q,B),this.addState(H,G),this.currentDocument.relations.push({id1:Q,id2:H,relationTitle:K?$.sanitizeText(K,V()):void 0})}}addDescription(z,J){let K=this.currentDocument.states.get(z),Q=J.startsWith(":")?J.replace(":","").trim():J;K?.descriptions?.push($.sanitizeText(Q,V()))}cleanupLabel(z){return z.startsWith(":")?z.slice(2).trim():z.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(z,J=""){if(!this.classes.has(z))this.classes.set(z,{id:z,styles:[],textStyles:[]});let K=this.classes.get(z);if(J&&K)J.split(h.STYLECLASS_SEP).forEach((Q)=>{let B=Q.replace(/([^;]*);/,"$1").trim();if(RegExp(h.COLOR_KEYWORD).exec(Q)){let G=B.replace(h.FILL_KEYWORD,h.BG_FILL).replace(h.COLOR_KEYWORD,h.FILL_KEYWORD);K.textStyles.push(G)}K.styles.push(B)})}getClasses(){return this.classes}setupToolTips(z){let J=QJ();Fz(z).select("svg").selectAll("g.node, g.rough-node").on("mouseover",(B)=>{let H=Fz(B.currentTarget),G=H.attr("title");if(G===null)return;let R=B.currentTarget?.getBoundingClientRect();J.transition().duration(200).style("opacity",".9"),J.style("left",window.scrollX+R.left+(R.right-R.left)/2+"px").style("top",window.scrollY+R.bottom+"px"),J.html(cz.sanitize(G)),H.classed("hover",!0)}).on("mouseout",(B)=>{J.transition().duration(500).style("opacity",0),Fz(B.currentTarget).classed("hover",!1)})}setCssClass(z,J){z.split(",").forEach((K)=>{let Q=this.getState(K);if(!Q){let B=K.trim();this.addState(B),Q=this.getState(B)}Q?.classes?.push(J)})}setStyle(z,J){this.getState(z)?.styles?.push(J)}setTextStyle(z,J){this.getState(z)?.textStyles?.push(J)}bindFunctions(z){this.funs.forEach((J)=>{J(z)})}getDirectionStatement(){return this.rootDoc.find((z)=>z.stmt===_z)}getDirection(){return this.getDirectionStatement()?.value??uJ}setDirection(z){let J=this.getDirectionStatement();if(J)J.value=z;else this.rootDoc.unshift({stmt:_z,value:z})}trimColon(z){return z.startsWith(":")?z.slice(1).trim():z.trim()}getData(){let z=V();for(let J of this.nodes)if(J.wrappingWidth??=z.state?.wrappingWidth,!J.isGroup)J.minWidth??=z.state?.minNodeWidth;return{nodes:this.nodes,edges:this.edges,other:{},config:z,direction:PJ(this.getRootDocV2())}}getConfig(){return V().state}},oJ=U((z)=>{let{theme:J,bkgColorArray:K,borderColorArray:Q}=z;if(!oz(J,Q))return"";let B=tz(z.look),H=sz(K),G="";for(let R=0;R<ez(Q);R++){let Z=Q[R],P=H?`fill: ${K[R%K.length]};`:"",L=`[data-look="${B}"][data-color-id="color-${R}"]`;G+=`

    /* The title strip: \`rect.outer\` spans the whole composite and \`rect.inner\` covers
       the body, so what stays visible of \`outer\` is the band behind the label. */
    ${L}.statediagram-cluster rect.outer {
      stroke: ${Z};
      ${P}
    }

    ${L}.statediagram-cluster rect.inner {
      stroke: ${Z};
    }

    /* Concurrency regions. Siblings of one composite share a slot, so a divided composite
       reads as one thing split into parts rather than as several composites. */
    ${L}.statediagram-cluster rect.divider {
      stroke: ${Z};
      ${P}
    }

    /* handDrawn draws the same container as roughjs shapes rather than plain rects, so it
       needs its own rules. \`roundedWithTitle\` and \`divider\` name those groups \`outer\`,
       \`inner\` and \`divider\` to match the classic branch, which is what lets these
       discriminate -- a bare \`.statediagram-cluster path\` rule reached the body as well and
       tinted the whole composite, losing \`compositeBackground\` and diverging from what
       classic and neo do.

       roughjs emits two paths per shape and marks them: the filled shape carries
       \`stroke="none"\` and the sketched outline carries \`fill="none"\`. Splitting on that is
       what keeps \`fill\` off the outline -- a rough outline is open squiggles, not a closed
       region, so filling it produces smears -- and keeps \`stroke\` off the fill shape, which
       would otherwise gain an edge it was drawn without. */
    ${L}.statediagram-cluster .outer path[stroke='none'] {
      ${P}
    }

    ${L}.statediagram-cluster .outer path[fill='none'] {
      stroke: ${Z};
    }

    /* No \`.inner\` rule on purpose. The body shape is left entirely alone under handDrawn,
       where a rect's \`inner\` counterpart cannot be recoloured safely: roughjs draws a
       hachure fill as *stroked* lines, so its fill paths carry \`fill="none"\` exactly like
       the outline and no selector separates them. An \`.inner\` stroke rule therefore
       repainted the hatching of every alt composite in the palette colour instead of
       leaving it on \`altBackground\`. The container still reads as palette-coloured: the
       \`outer\` shape spans the whole composite, so its outline already frames the body. */

    /* Regions split the same way, which is why \`divider\` fills solid rather than taking
       roughjs's default hachure -- see the note on that call. Hatched, both of its paths
       carried \`fill="none"\` and these two rules degenerated: the tint matched nothing and
       the border rule repainted the hatching. */
    ${L}.statediagram-cluster .divider path[stroke='none'] {
      ${P}
    }

    ${L}.statediagram-cluster .divider path[fill='none'] {
      stroke: ${Z};
    }
    `}return G},"genColor"),tJ=U((z)=>`
${oJ(z)}
defs [id$="-barbEnd"] {
    fill: ${z.transitionColor};
    stroke: ${z.transitionColor};
  }
g.stateGroup text {
  fill: ${z.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${z.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${z.stateLabelColor};
}

g.stateGroup rect {
  fill: ${z.mainBkg};
  stroke: ${z.nodeBorder};
}

g.stateGroup line {
  stroke: ${z.lineColor};
  stroke-width: ${z.strokeWidth||1};
}

.transition {
  stroke: ${z.transitionColor};
  stroke-width: ${z.strokeWidth||1};
  fill: none;
}

.stateGroup .composit {
  fill: ${z.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${z.noteBorderColor};
  fill: ${z.noteBkgColor};

  text {
    fill: ${z.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${z.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${z.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${z.edgeLabelBackground};
  p {
    background-color: ${z.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${z.edgeLabelBackground};
    fill: ${z.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${z.transitionLabelColor||z.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${z.transitionLabelColor||z.tertiaryTextColor};
}

.stateLabel text {
  fill: ${z.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${z.specialStateColor};
  stroke: ${z.specialStateColor};
}

.node .fork-join {
  fill: ${z.specialStateColor};
  stroke: ${z.specialStateColor};
}

.node circle.state-end {
  fill: ${z.innerEndBackground};
  stroke: ${z.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${z.compositeBackground||z.background};
  // stroke: ${z.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${z.stateBkg||z.mainBkg};
  stroke: ${z.stateBorder||z.nodeBorder};
  stroke-width: ${z.strokeWidth||1}px;
}
.node polygon {
  fill: ${z.mainBkg};
  stroke: ${z.stateBorder||z.nodeBorder};;
  stroke-width: ${z.strokeWidth||1}px;
}
[id$="-barbEnd"] {
  fill: ${z.lineColor};
}

.statediagram-cluster rect {
  fill: ${z.compositeTitleBackground};
  stroke: ${z.stateBorder||z.nodeBorder};
  stroke-width: ${z.strokeWidth||1}px;
}

.cluster-label, .nodeLabel {
  color: ${z.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${z.stateBorder||z.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${z.compositeBackground||z.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${z.altBackground?z.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${z.altBackground?z.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${z.noteBkgColor};
  stroke: ${z.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${z.noteBkgColor};
  stroke: ${z.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${z.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${z.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${z.noteTextColor};
}

[id$="-dependencyStart"], [id$="-dependencyEnd"] {
  fill: ${z.lineColor};
  stroke: ${z.lineColor};
  stroke-width: ${z.strokeWidth||1};
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${z.textColor};
}

[data-look="neo"].statediagram-cluster rect {
  fill: ${z.mainBkg};
  stroke: ${z.useGradient?"url("+z.svgId+"-gradient)":z.stateBorder||z.nodeBorder};
  stroke-width: ${z.strokeWidth??1};
}
[data-look="neo"].statediagram-cluster rect.outer {
  rx: ${z.radius}px;
  ry: ${z.radius}px;
  filter: ${z.dropShadow?z.dropShadow.replace("url(#drop-shadow)",`url(${z.svgId}-drop-shadow)`):"none"}
}
`,"getStyles"),eJ=tJ,OQ={parser:bJ,get db(){return new sJ(2)},renderer:aJ,styles:eJ,init:U((z)=>{if(!z.state)z.state={};z.state.arrowMarkerAbsolute=z.arrowMarkerAbsolute},"init")};export{OQ as diagram};
