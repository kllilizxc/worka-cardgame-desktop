import{e,r,we,h,b,v,x,w,k,C,T,i,s,Aa,A,ie,Q,ee,at,ue,fe}from"./entry-79v5dffy.js";import{Tt}from"./entry-shsqwvdq.js";import{le}from"./entry-qxhfg0rv.js";import{te}from"./entry-xdrs0rma.js";var Gt=function(){var t=e(function(Z,u,g,l){for(g=g||{},l=Z.length;l--;g[Z[l]]=u);return g},"o"),a=[1,2],d=[1,3],n=[1,4],p=[2,4],S=[1,9],m=[1,11],E=[1,16],c=[1,17],L=[1,18],I=[1,19],Y=[1,33],V=[1,20],j=[1,21],F=[1,22],y=[1,23],M=[1,24],P=[1,26],z=[1,27],W=[1,28],K=[1,29],R=[1,30],rt=[1,31],gt=[1,32],yt=[1,35],mt=[1,36],bt=[1,37],kt=[1,38],it=[1,34],_=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],Et=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],Wt=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],It={trace:e(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"CLICK",39:"STRING",40:"HREF",41:"classDef",42:"CLASSDEF_ID",43:"CLASSDEF_STYLEOPTS",44:"DEFAULT",45:"style",46:"STYLE_IDS",47:"STYLEDEF_STYLEOPTS",48:"class",49:"CLASSENTITY_IDS",50:"STYLECLASS",51:"direction_tb",52:"direction_bt",53:"direction_rl",54:"direction_lr",56:";",57:"EDGE_STATE",58:"STYLE_SEPARATOR",59:"left_of",60:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:e(function(u,g,l,D,N,o,nt){var f=o.length-1;switch(N){case 3:return D.setRootDoc(o[f]),o[f];break;case 4:this.$=[];break;case 5:if(o[f]!="nl")o[f-1].push(o[f]),this.$=o[f-1];break;case 6:case 7:this.$=o[f];break;case 8:this.$="nl";break;case 12:this.$=o[f];break;case 13:let vt=o[f-1];vt.description=D.trimColon(o[f]),this.$=vt;break;case 14:this.$={stmt:"relation",state1:o[f-2],state2:o[f]};break;case 15:let Dt=D.trimColon(o[f]);this.$={stmt:"relation",state1:o[f-3],state2:o[f-1],description:Dt};break;case 19:this.$={stmt:"state",id:o[f-3],type:"default",description:"",doc:o[f-1]};break;case 20:var X=o[f],J=o[f-2].trim();if(o[f].match(":")){var ht=o[f].split(":");X=ht[0],J=[J,ht[1]]}this.$={stmt:"state",id:X,type:"default",description:J};break;case 21:this.$={stmt:"state",id:o[f-3],type:"default",description:o[f-5],doc:o[f-1]};break;case 22:this.$={stmt:"state",id:o[f],type:"fork"};break;case 23:this.$={stmt:"state",id:o[f],type:"join"};break;case 24:this.$={stmt:"state",id:o[f],type:"choice"};break;case 25:this.$={stmt:"state",id:D.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:o[f-1].trim(),note:{position:o[f-2].trim(),text:o[f].trim()}};break;case 29:this.$=o[f].trim(),D.setAccTitle(this.$);break;case 30:case 31:this.$=o[f].trim(),D.setAccDescription(this.$);break;case 32:this.$={stmt:"click",id:o[f-3],url:o[f-2],tooltip:o[f-1]};break;case 33:this.$={stmt:"click",id:o[f-3],url:o[f-1],tooltip:""};break;case 34:case 35:this.$={stmt:"classDef",id:o[f-1].trim(),classes:o[f].trim()};break;case 36:this.$={stmt:"style",id:o[f-1].trim(),styleClass:o[f].trim()};break;case 37:this.$={stmt:"applyClass",id:o[f-1].trim(),styleClass:o[f].trim()};break;case 38:D.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 39:D.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 40:D.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 41:D.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 44:case 45:this.$={stmt:"state",id:o[f].trim(),type:"default",description:""};break;case 46:this.$={stmt:"state",id:o[f-2].trim(),classes:[o[f].trim()],type:"default",description:""};break;case 47:this.$={stmt:"state",id:o[f-2].trim(),classes:[o[f].trim()],type:"default",description:""};break}},"anonymous"),table:[{3:1,4:a,5:d,6:n},{1:[3]},{3:5,4:a,5:d,6:n},{3:6,4:a,5:d,6:n},t([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],p,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:S,5:m,8:8,9:10,10:12,11:13,12:14,13:15,16:E,17:c,19:L,22:I,24:Y,25:V,26:j,27:F,28:y,29:M,32:25,33:P,35:z,37:W,38:K,41:R,45:rt,48:gt,51:yt,52:mt,53:bt,54:kt,57:it},t(_,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:E,17:c,19:L,22:I,24:Y,25:V,26:j,27:F,28:y,29:M,32:25,33:P,35:z,37:W,38:K,41:R,45:rt,48:gt,51:yt,52:mt,53:bt,54:kt,57:it},t(_,[2,7]),t(_,[2,8]),t(_,[2,9]),t(_,[2,10]),t(_,[2,11]),t(_,[2,12],{14:[1,40],15:[1,41]}),t(_,[2,16]),{18:[1,42]},t(_,[2,18],{20:[1,43]}),{23:[1,44]},t(_,[2,22]),t(_,[2,23]),t(_,[2,24]),t(_,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},t(_,[2,28]),{34:[1,49]},{36:[1,50]},t(_,[2,31]),{13:51,24:Y,57:it},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},t(Et,[2,44],{58:[1,56]}),t(Et,[2,45],{58:[1,57]}),t(_,[2,38]),t(_,[2,39]),t(_,[2,40]),t(_,[2,41]),t(_,[2,6]),t(_,[2,13]),{13:58,24:Y,57:it},t(_,[2,17]),t(Wt,p,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},t(_,[2,29]),t(_,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},t(_,[2,14],{14:[1,71]}),{4:S,5:m,8:8,9:10,10:12,11:13,12:14,13:15,16:E,17:c,19:L,21:[1,72],22:I,24:Y,25:V,26:j,27:F,28:y,29:M,32:25,33:P,35:z,37:W,38:K,41:R,45:rt,48:gt,51:yt,52:mt,53:bt,54:kt,57:it},t(_,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},t(_,[2,34]),t(_,[2,35]),t(_,[2,36]),t(_,[2,37]),t(Et,[2,46]),t(Et,[2,47]),t(_,[2,15]),t(_,[2,19]),t(Wt,p,{7:78}),t(_,[2,26]),t(_,[2,27]),{5:[1,79]},{5:[1,80]},{4:S,5:m,8:8,9:10,10:12,11:13,12:14,13:15,16:E,17:c,19:L,21:[1,81],22:I,24:Y,25:V,26:j,27:F,28:y,29:M,32:25,33:P,35:z,37:W,38:K,41:R,45:rt,48:gt,51:yt,52:mt,53:bt,54:kt,57:it},t(_,[2,32]),t(_,[2,33]),t(_,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:e(function(u,g){if(g.recoverable)this.trace(u);else{var l=Error(u);throw l.hash=g,l}},"parseError"),parse:e(function(u){var g=this,l=[0],D=[],N=[null],o=[],nt=this.table,f="",X=0,J=0,ht=0,vt=2,Dt=1,be=o.slice.call(arguments,1),O=Object.create(this.lexer),et={yy:{}};for(var Nt in this.yy)if(Object.prototype.hasOwnProperty.call(this.yy,Nt))et.yy[Nt]=this.yy[Nt];if(O.setInput(u,et.yy),et.yy.lexer=O,et.yy.parser=this,typeof O.yylloc>"u")O.yylloc={};var Ot=O.yylloc;o.push(Ot);var ke=O.options&&O.options.ranges;if(typeof et.yy.parseError==="function")this.parseError=et.yy.parseError;else this.parseError=Object.getPrototypeOf(this).parseError;function Te(H){l.length=l.length-2*H,N.length=N.length-H,o.length=o.length-H}e(Te,"popStack");function jt(){var H=D.pop()||O.lex()||Dt;if(typeof H!=="number"){if(H instanceof Array)D=H,H=D.pop();H=g.symbols_[H]||H}return H}e(jt,"lex");var B,Rt,st,U,ts,$t,ot={},Ct,q,Ut,At;while(!0){if(st=l[l.length-1],this.defaultActions[st])U=this.defaultActions[st];else{if(B===null||typeof B>"u")B=jt();U=nt[st]&&nt[st][B]}if(typeof U>"u"||!U.length||!U[0]){var Ft="";At=[];for(Ct in nt[st])if(this.terminals_[Ct]&&Ct>vt)At.push("'"+this.terminals_[Ct]+"'");if(O.showPosition)Ft="Parse error on line "+(X+1)+`:
`+O.showPosition()+`
Expecting `+At.join(", ")+", got '"+(this.terminals_[B]||B)+"'";else Ft="Parse error on line "+(X+1)+": Unexpected "+(B==Dt?"end of input":"'"+(this.terminals_[B]||B)+"'");this.parseError(Ft,{text:O.match,token:this.terminals_[B]||B,line:O.yylineno,loc:Ot,expected:At})}if(U[0]instanceof Array&&U.length>1)throw Error("Parse Error: multiple actions possible at state: "+st+", token: "+B);switch(U[0]){case 1:if(l.push(B),N.push(O.yytext),o.push(O.yylloc),l.push(U[1]),B=null,!Rt){if(J=O.yyleng,f=O.yytext,X=O.yylineno,Ot=O.yylloc,ht>0)ht--}else B=Rt,Rt=null;break;case 2:if(q=this.productions_[U[1]][1],ot.$=N[N.length-q],ot._$={first_line:o[o.length-(q||1)].first_line,last_line:o[o.length-1].last_line,first_column:o[o.length-(q||1)].first_column,last_column:o[o.length-1].last_column},ke)ot._$.range=[o[o.length-(q||1)].range[0],o[o.length-1].range[1]];if($t=this.performAction.apply(ot,[f,J,X,et.yy,U[1],N,o].concat(be)),typeof $t<"u")return $t;if(q)l=l.slice(0,-1*q*2),N=N.slice(0,-1*q),o=o.slice(0,-1*q);l.push(this.productions_[U[1]][0]),N.push(ot.$),o.push(ot._$),Ut=nt[l[l.length-2]][l[l.length-1]],l.push(Ut);break;case 3:return!0}}return!0},"parse")},me=function(){var Z={EOF:1,parseError:e(function(g,l){if(this.yy.parser)this.yy.parser.parseError(g,l);else throw Error(g)},"parseError"),setInput:e(function(u,g){if(this.yy=g||this.yy||{},this._input=u,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges)this.yylloc.range=[0,0];return this.offset=0,this},"setInput"),input:e(function(){var u=this._input[0];this.yytext+=u,this.yyleng++,this.offset++,this.match+=u,this.matched+=u;var g=u.match(/(?:\r\n?|\n).*/g);if(g)this.yylineno++,this.yylloc.last_line++;else this.yylloc.last_column++;if(this.options.ranges)this.yylloc.range[1]++;return this._input=this._input.slice(1),u},"input"),unput:e(function(u){var g=u.length,l=u.split(/(?:\r\n?|\n)/g);this._input=u+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-g),this.offset-=g;var D=this.match.split(/(?:\r\n?|\n)/g);if(this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),l.length-1)this.yylineno-=l.length-1;var N=this.yylloc.range;if(this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:l?(l.length===D.length?this.yylloc.first_column:0)+D[D.length-l.length].length-l[0].length:this.yylloc.first_column-g},this.options.ranges)this.yylloc.range=[N[0],N[0]+this.yyleng-g];return this.yyleng=this.yytext.length,this},"unput"),more:e(function(){return this._more=!0,this},"more"),reject:e(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:e(function(u){this.unput(this.match.slice(u))},"less"),pastInput:e(function(){var u=this.matched.substr(0,this.matched.length-this.match.length);return(u.length>20?"...":"")+u.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:e(function(){var u=this.match;if(u.length<20)u+=this._input.substr(0,20-u.length);return(u.substr(0,20)+(u.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:e(function(){var u=this.pastInput(),g=Array(u.length+1).join("-");return u+this.upcomingInput()+`
`+g+"^"},"showPosition"),test_match:e(function(u,g){var l,D,N;if(this.options.backtrack_lexer){if(N={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges)N.yylloc.range=this.yylloc.range.slice(0)}if(D=u[0].match(/(?:\r\n?|\n).*/g),D)this.yylineno+=D.length;if(this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:D?D[D.length-1].length-D[D.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+u[0].length},this.yytext+=u[0],this.match+=u[0],this.matches=u,this.yyleng=this.yytext.length,this.options.ranges)this.yylloc.range=[this.offset,this.offset+=this.yyleng];if(this._more=!1,this._backtrack=!1,this._input=this._input.slice(u[0].length),this.matched+=u[0],l=this.performAction.call(this,this.yy,this,g,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input)this.done=!1;if(l)return l;else if(this._backtrack){for(var o in N)this[o]=N[o];return!1}return!1},"test_match"),next:e(function(){if(this.done)return this.EOF;if(!this._input)this.done=!0;var u,g,l,D;if(!this._more)this.yytext="",this.match="";var N=this._currentRules();for(var o=0;o<N.length;o++)if(l=this._input.match(this.rules[N[o]]),l&&(!g||l[0].length>g[0].length)){if(g=l,D=o,this.options.backtrack_lexer)if(u=this.test_match(l,N[o]),u!==!1)return u;else if(this._backtrack){g=!1;continue}else return!1;else if(!this.options.flex)break}if(g){if(u=this.test_match(g,N[D]),u!==!1)return u;return!1}if(this._input==="")return this.EOF;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:e(function(){var g=this.next();if(g)return g;else return this.lex()},"lex"),begin:e(function(g){this.conditionStack.push(g)},"begin"),popState:e(function(){var g=this.conditionStack.length-1;if(g>0)return this.conditionStack.pop();else return this.conditionStack[0]},"popState"),_currentRules:e(function(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1])return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;else return this.conditions.INITIAL.rules},"_currentRules"),topState:e(function(g){if(g=this.conditionStack.length-1-Math.abs(g||0),g>=0)return this.conditionStack[g];else return"INITIAL"},"topState"),pushState:e(function(g){this.begin(g)},"pushState"),stateStackSize:e(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:e(function(g,l,D,N){function o(){let f=l.yytext.indexOf("%%");if(f===0)return!1;if(f>0){let X=l.yytext.slice(0,f),J=l.yytext.slice(f);if(J)g.lexer.unput(J);l.yytext=X}return!0}e(o,"processId");var nt=N;switch(D){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:return 5;case 9:break;case 10:break;case 11:break;case 12:break;case 13:return this.pushState("SCALE"),17;break;case 14:return 18;case 15:this.popState();break;case 16:return this.begin("acc_title"),33;break;case 17:return this.popState(),"acc_title_value";break;case 18:return this.begin("acc_descr"),35;break;case 19:return this.popState(),"acc_descr_value";break;case 20:this.begin("acc_descr_multiline");break;case 21:this.popState();break;case 22:return"acc_descr_multiline_value";case 23:return this.pushState("CLASSDEF"),41;break;case 24:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";break;case 25:return this.popState(),this.pushState("CLASSDEFID"),42;break;case 26:return this.popState(),43;break;case 27:return this.pushState("CLASS"),48;break;case 28:return this.popState(),this.pushState("CLASS_STYLE"),49;break;case 29:return this.popState(),50;break;case 30:return this.pushState("STYLE"),45;break;case 31:return this.popState(),this.pushState("STYLEDEF_STYLES"),46;break;case 32:return this.popState(),47;break;case 33:return this.pushState("SCALE"),17;break;case 34:return 18;case 35:this.popState();break;case 36:this.pushState("STATE");break;case 37:return this.popState(),l.yytext=l.yytext.slice(0,-8).trim(),25;break;case 38:return this.popState(),l.yytext=l.yytext.slice(0,-8).trim(),26;break;case 39:return this.popState(),l.yytext=l.yytext.slice(0,-10).trim(),27;break;case 40:return this.popState(),l.yytext=l.yytext.slice(0,-8).trim(),25;break;case 41:return this.popState(),l.yytext=l.yytext.slice(0,-8).trim(),26;break;case 42:return this.popState(),l.yytext=l.yytext.slice(0,-10).trim(),27;break;case 43:return 51;case 44:return 52;case 45:return 53;case 46:return 54;case 47:this.pushState("STATE_STRING");break;case 48:return this.pushState("STATE_ID"),"AS";break;case 49:if(!o())return;return this.popState(),"ID";break;case 50:this.popState();break;case 51:return"STATE_DESCR";case 52:throw Error('Error: State name must be a single word. Found: "'+l.yytext.trim()+'"');case 53:return 19;case 54:this.popState();break;case 55:return this.popState(),this.pushState("struct"),20;break;case 56:return this.popState(),21;break;case 57:break;case 58:return this.begin("NOTE"),29;break;case 59:return this.popState(),this.pushState("NOTE_ID"),59;break;case 60:return this.popState(),this.pushState("NOTE_ID"),60;break;case 61:this.popState(),this.pushState("FLOATING_NOTE");break;case 62:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";break;case 63:break;case 64:return"NOTE_TEXT";case 65:if(!o())return;return this.popState(),"ID";break;case 66:if(!o())return;return this.popState(),this.pushState("NOTE_TEXT"),24;break;case 67:return this.popState(),l.yytext=l.yytext.substr(2).trim(),31;break;case 68:return this.popState(),l.yytext=l.yytext.slice(0,-8).trim(),31;break;case 69:return 6;case 70:return 6;case 71:return 16;case 72:return 57;case 73:if(!o())return;return 24;case 74:return l.yytext=l.yytext.trim(),14;break;case 75:return 15;case 76:return 28;case 77:return 58;case 78:return 5;case 79:return"INVALID"}},"anonymous"),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:\w+\s+\w+.*?\{)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?\n\s*end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:(?:[^:\n;]|:[^:\n;])+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[10,11,12],inclusive:!1},struct:{rules:[10,11,12,23,27,30,36,43,44,45,46,56,57,58,72,73,74,75,76,77],inclusive:!1},FLOATING_NOTE_ID:{rules:[65],inclusive:!1},FLOATING_NOTE:{rules:[62,63,64],inclusive:!1},NOTE_TEXT:{rules:[67,68],inclusive:!1},NOTE_ID:{rules:[66],inclusive:!1},NOTE:{rules:[59,60,61],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[32],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[31],inclusive:!1},CLASS_STYLE:{rules:[29],inclusive:!1},CLASS:{rules:[28],inclusive:!1},CLASSDEFID:{rules:[26],inclusive:!1},CLASSDEF:{rules:[24,25],inclusive:!1},acc_descr_multiline:{rules:[21,22],inclusive:!1},acc_descr:{rules:[19],inclusive:!1},acc_title:{rules:[17],inclusive:!1},SCALE:{rules:[14,15,34,35],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[49],inclusive:!1},STATE_STRING:{rules:[50,51],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[10,11,12,37,38,39,40,41,42,47,48,52,53,54,55],inclusive:!1},ID:{rules:[10,11,12],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,11,12,13,16,18,20,23,27,30,33,36,55,58,69,70,71,72,73,74,75,77,78,79],inclusive:!0}}};return Z}();It.lexer=me;function _t(){this.yy={}}return e(_t,"Parser"),_t.prototype=It,It.Parser=_t,new _t}();Gt.parser=Gt;var Ee=Gt,_e="TB",Qt="TB",Ht="dir",ct="state",lt="root",Yt="relation",ve="classDef",De="style",Ce="applyClass",pt="default",Zt="divider",se="fill:none",re="fill: #333",ae="c",ne="markdown",oe="normal",Pt="rect",Bt="rectWithTitle",Ae="stateStart",xe="stateEnd",Vt="divider",zt="roundedWithTitle",Le="note",Ie="noteGroup",St="statediagram",Ne="state",Oe=`${St}-${Ne}`,ce="transition",Re="note",$e="note-edge",Fe=`${ce} ${$e}`,Pe=`${St}-${Re}`,Be="cluster",Ge=`${St}-${Be}`,Ye="cluster-alt",Ve=`${St}-${Ye}`,he="parent",de="note",Me="state",Mt="----",We=`${Mt}${de}`,Kt=`${Mt}${he}`,Lt=new Map,tt=0,pe=0,dt=new Map,je=e((t,a,d,n)=>{if(t===Vt&&d?.id!==void 0&&dt.has(d.id)){let m=dt.get(d.id);return dt.set(a,m),m}let p=pe++,S=n?void 0:p;return dt.set(a,S),S},"colorSlotFor");function wt(t="",a=0,d="",n=Mt){let p=d!==null&&d.length>0?`${n}${d}`:"";return`${Me}-${t}${p}-${a}`}e(wt,"stateDomId");var Ue=e((t,a,d,n,p,S,m,E)=>{r.trace("items",a),a.forEach((c)=>{switch(c.stmt){case ct:ft(t,c,d,n,p,S,m,E);break;case pt:ft(t,c,d,n,p,S,m,E);break;case Yt:{ft(t,c.state1,d,n,p,S,m,E),ft(t,c.state2,d,n,p,S,m,E);let L=m==="neo",I={id:"edge"+tt,start:c.state1.id,end:c.state2.id,arrowhead:"normal",arrowTypeEnd:L?"arrow_barb_neo":"arrow_barb",style:se,labelStyle:"",label:h.sanitizeText(c.description??"",i()),arrowheadStyle:re,labelpos:ae,labelType:ne,thickness:oe,classes:ce,look:m};p.push(I),tt++}break}})},"setupDoc"),Xt=e((t,a=Qt)=>{let d=a;if(t.doc){for(let n of t.doc)if(n.stmt==="dir")d=n.value}return d},"getDir");function ut(t,a,d){if(!a.id||a.id==="</join></fork>"||a.id==="</choice>")return;if(a.cssClasses){if(!Array.isArray(a.cssCompiledStyles))a.cssCompiledStyles=[];a.cssClasses.split(" ").forEach((p)=>{let S=d.get(p);if(S)a.cssCompiledStyles=[...a.cssCompiledStyles??[],...S.styles]})}let n=t.find((p)=>p.id===a.id);if(n)Object.assign(n,a);else t.push(a)}e(ut,"insertOrUpdateNode");function Se(t){return t?.classes?.join(" ")??""}e(Se,"getClassesFromDbInfo");function ge(t){return t?.styles??[]}e(ge,"getStylesFromDbInfo");var ft=e((t,a,d,n,p,S,m,E)=>{let c=a.id,L=d.get(c),I=Se(L),Y=ge(L),V=i(),j=I.trim()!==""||Y.length>0;if(r.info("dataFetcher parsedItem",a,L,Y),c!=="root"){let F=Pt;if(a.start===!0)F=Ae;else if(a.start===!1)F=xe;if(a.type!==pt)F=a.type;if(!Lt.get(c))Lt.set(c,{id:c,shape:F,description:h.sanitizeText(c,V),cssClasses:`${I} ${Oe}`,cssStyles:Y});let y=Lt.get(c);if(a.description){if(Array.isArray(y.description))y.shape=Bt,y.description.push(a.description);else if(y.description?.length&&y.description.length>0)if(y.shape=Bt,y.description===c)y.description=[a.description];else y.description=[y.description,a.description];else y.shape=Pt,y.description=a.description;y.description=h.sanitizeTextOrArray(y.description,V)}if(y.description?.length===1&&y.shape===Bt)if(y.type==="group")y.shape=zt;else y.shape=Pt;if(!y.type&&a.doc)r.info("Setting cluster for XCX",c,Xt(a)),y.type="group",y.isGroup=!0,y.dir=Xt(a),y.shape=a.type===Zt?Vt:zt,y.colorIndex=je(y.shape,c,t,j),y.cssClasses=`${y.cssClasses} ${Ge} ${S?Ve:""}`;let M={labelStyle:"",shape:y.shape,label:y.description,cssClasses:y.cssClasses,cssCompiledStyles:[],cssStyles:y.cssStyles,id:c,dir:y.dir,domId:wt(c,tt),type:y.type,isGroup:y.type==="group",colorIndex:y.colorIndex,padding:8,rx:10,ry:10,look:m,labelType:"markdown"};if(M.shape===Vt)M.label="";if(t&&t.id!=="root")r.trace("Setting node ",c," to be child of its parent ",t.id),M.parentId=t.id;if(M.centerLabel=!0,a.note){let P={labelStyle:"",shape:Le,label:a.note.text,labelType:"markdown",cssClasses:Pe,cssStyles:[],cssCompiledStyles:[],id:c+We+"-"+tt,domId:wt(c,tt,de),type:"node",isGroup:!1,padding:V.flowchart?.padding,look:m,position:a.note.position},z=c+Kt,W={labelStyle:"",shape:Ie,label:a.note.text,cssClasses:y.cssClasses,cssStyles:[],id:c+Kt,domId:wt(c,tt,he),type:"group",isGroup:!0,padding:16,look:m,position:a.note.position};tt++,W.id=z,P.parentId=z,ut(n,W,E),ut(n,P,E),ut(n,M,E);let K=c,R=P.id;if(a.note.position==="left of")K=P.id,R=c;p.push({id:K+"-"+R,start:K,end:R,arrowhead:"none",arrowTypeEnd:"",style:se,labelStyle:"",classes:Fe,pattern:"dashed",arrowheadStyle:re,labelpos:ae,labelType:ne,thickness:oe,look:m})}else ut(n,M,E)}if(a.doc)r.trace("Adding nodes children "),Ue(a,a.doc,d,n,p,!S,m,E)},"dataFetcher"),He=e(()=>{Lt.clear(),tt=0,pe=0,dt.clear()},"reset"),ye=e((t,a=Qt)=>{if(!t.doc)return a;let d=a;for(let n of t.doc)if(n.stmt==="dir")d=n.value;return d},"getDir"),ze=e(function(t,a){return a.db.getClasses()},"getClasses"),Ke=e(async function(t,a,d,n){r.info("REF0:"),r.info("Drawing state diagram (v2)",a);let{securityLevel:p,state:S,layout:m}=i();n.db.extract(n.db.getRootDocV2());let E=n.db.getData(),c=le(a,p);if(E.type=n.type,E.layoutAlgorithm=fe(m),E.nodeSpacing=S?.nodeSpacing||50,E.rankSpacing=S?.rankSpacing||50,i().look==="neo")E.markers=["barbNeo"];else E.markers=["barb"];E.diagramId=a,await ue(E,c);let I=8;try{(typeof n.db.getLinks==="function"?n.db.getLinks():new Map).forEach((V,j)=>{let F=typeof j==="string"?j:typeof j?.id==="string"?j.id:"",y=E.nodes.find((R)=>R.id===F);if(!F){r.warn("⚠️ Invalid or missing stateId from key:",JSON.stringify(j));return}let M=c.node()?.querySelectorAll("g.node, g.rough-node"),P;if(M?.forEach((R)=>{let rt=R.textContent?.trim();if(R.id===y?.domId||rt===F)P=R}),!P){r.warn("⚠️ Could not find node matching text:",F);return}let z=P.parentNode;if(!z){r.warn("⚠️ Node has no parent, cannot wrap:",F);return}let W=document.createElementNS("http://www.w3.org/2000/svg","a"),K=V.url.replace(/^"+|"+$/g,"");if(W.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",K),W.setAttribute("target","_blank"),V.tooltip){let R=V.tooltip.replace(/^"+|"+$/g,"");W.setAttribute("title",R),P.setAttribute("title",R)}z.replaceChild(W,P),W.appendChild(P),r.info("\uD83D\uDD17 Wrapped node in <a> tag for:",F,V.url)})}catch(Y){r.error("❌ Error injecting clickable links:",Y)}A.insertTitle(c,"statediagramTitleText",S?.titleTopMargin??25,n.db.getDiagramTitle()),te(c,I,St,S?.useMaxWidth??!0)},"draw"),Xe={getClasses:ze,draw:Ke,getDir:ye},G={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},Jt=e(()=>new Map,"newClassesList"),qt=e(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),xt=e((t)=>JSON.parse(JSON.stringify(t)),"clone"),Je=class{constructor(t){this.version=t,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=Jt(),this.documents={root:qt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.funs=[],this.getAccTitle=x,this.setAccTitle=v,this.getAccDescription=k,this.setAccDescription=w,this.setDiagramTitle=C,this.getDiagramTitle=T,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this),this.bindFunctions=this.bindFunctions.bind(this)}static{e(this,"StateDB")}static{this.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3}}extract(t){this.clear(!0);for(let n of Array.isArray(t)?t:t.doc)switch(n.stmt){case ct:this.addState(n.id.trim(),n.type,n.doc,n.description,n.note);break;case Yt:this.addRelation(n.state1,n.state2,n.description);break;case ve:this.addStyleClass(n.id.trim(),n.classes);break;case De:this.handleStyleDef(n);break;case Ce:this.setCssClass(n.id.trim(),n.styleClass);break;case"click":this.addLink(n.id,n.url,n.tooltip);break}let a=this.getStates(),d=i();He(),ft(void 0,this.getRootDocV2(),a,this.nodes,this.edges,!0,d.look,this.classes);for(let n of this.nodes){if(!Array.isArray(n.label))continue;if(n.description=n.label.slice(1),n.isGroup&&n.description.length>0)throw Error(`Group nodes can only have label. Remove the additional description for node [${n.id}]`);n.label=n.label[0]}}handleStyleDef(t){let a=t.id.trim().split(","),d=t.styleClass.split(",");for(let n of a){let p=this.getState(n);if(!p){let S=n.trim();this.addState(S),p=this.getState(S)}if(p)p.styles=d.map((S)=>S.replace(/;/g,"")?.trim())}}setRootDoc(t){if(r.info("Setting root doc",t),this.rootDoc=t,this.version===1)this.extract(t);else this.extract(this.getRootDocV2())}docTranslator(t,a,d){if(a.stmt===Yt){this.docTranslator(t,a.state1,!0),this.docTranslator(t,a.state2,!1);return}if(a.stmt===ct)if(a.id===G.START_NODE)a.id=t.id+(d?"_start":"_end"),a.start=d;else a.id=a.id.trim();if(a.stmt!==lt&&a.stmt!==ct||!a.doc)return;let n=[],p=[];for(let S of a.doc)if(S.type===Zt){let m=xt(S);m.doc=xt(p),n.push(m),p=[]}else p.push(S);if(n.length>0&&p.length>0){let S={stmt:ct,id:Aa(),type:"divider",doc:xt(p)};n.push(xt(S)),a.doc=n}a.doc.forEach((S)=>this.docTranslator(a,S,!0))}getRootDocV2(){return this.docTranslator({id:lt,stmt:lt},{id:lt,stmt:lt,doc:this.rootDoc},!0),{id:lt,doc:this.rootDoc}}addState(t,a=pt,d=void 0,n=void 0,p=void 0,S=void 0,m=void 0,E=void 0){let c=t?.trim();if(!this.currentDocument.states.has(c))r.info("Adding state ",c,n),this.currentDocument.states.set(c,{stmt:ct,id:c,descriptions:[],type:a,doc:d,note:p,classes:[],styles:[],textStyles:[]});else{let L=this.currentDocument.states.get(c);if(!L)throw Error(`State not found: ${c}`);if(!L.doc)L.doc=d;if(!L.type)L.type=a}if(n)r.info("Setting state description",c,n),(Array.isArray(n)?n:[n]).forEach((I)=>this.addDescription(c,I.trim()));if(p){let L=this.currentDocument.states.get(c);if(!L)throw Error(`State not found: ${c}`);L.note=p,L.note.text=h.sanitizeText(L.note.text,i())}if(S)r.info("Setting state classes",c,S),(Array.isArray(S)?S:[S]).forEach((I)=>this.setCssClass(c,I.trim()));if(m)r.info("Setting state styles",c,m),(Array.isArray(m)?m:[m]).forEach((I)=>this.setStyle(c,I.trim()));if(E)r.info("Setting state styles",c,m),(Array.isArray(E)?E:[E]).forEach((I)=>this.setTextStyle(c,I.trim()))}clear(t){if(this.nodes=[],this.edges=[],this.funs=[this.setupToolTips.bind(this)],this.documents={root:qt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=Jt(),!t)this.links=new Map,b()}getState(t){return this.currentDocument.states.get(t)}getStates(){return this.currentDocument.states}logDocuments(){r.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}addLink(t,a,d){this.links.set(t,{url:a,tooltip:d}),r.warn("Adding link",t,a,d)}getLinks(){return this.links}startIdIfNeeded(t=""){if(t===G.START_NODE)return this.startEndCount++,`${G.START_TYPE}${this.startEndCount}`;return t}startTypeIfNeeded(t="",a=pt){return t===G.START_NODE?G.START_TYPE:a}endIdIfNeeded(t=""){if(t===G.END_NODE)return this.startEndCount++,`${G.END_TYPE}${this.startEndCount}`;return t}endTypeIfNeeded(t="",a=pt){return t===G.END_NODE?G.END_TYPE:a}addRelationObjs(t,a,d=""){let n=this.startIdIfNeeded(t.id.trim()),p=this.startTypeIfNeeded(t.id.trim(),t.type),S=this.startIdIfNeeded(a.id.trim()),m=this.startTypeIfNeeded(a.id.trim(),a.type);this.addState(n,p,t.doc,t.description,t.note,t.classes,t.styles,t.textStyles),this.addState(S,m,a.doc,a.description,a.note,a.classes,a.styles,a.textStyles),this.currentDocument.relations.push({id1:n,id2:S,relationTitle:h.sanitizeText(d,i())})}addRelation(t,a,d){if(typeof t==="object"&&typeof a==="object")this.addRelationObjs(t,a,d);else if(typeof t==="string"&&typeof a==="string"){let n=this.startIdIfNeeded(t.trim()),p=this.startTypeIfNeeded(t),S=this.endIdIfNeeded(a.trim()),m=this.endTypeIfNeeded(a);this.addState(n,p),this.addState(S,m),this.currentDocument.relations.push({id1:n,id2:S,relationTitle:d?h.sanitizeText(d,i()):void 0})}}addDescription(t,a){let d=this.currentDocument.states.get(t),n=a.startsWith(":")?a.replace(":","").trim():a;d?.descriptions?.push(h.sanitizeText(n,i()))}cleanupLabel(t){return t.startsWith(":")?t.slice(2).trim():t.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(t,a=""){if(!this.classes.has(t))this.classes.set(t,{id:t,styles:[],textStyles:[]});let d=this.classes.get(t);if(a&&d)a.split(G.STYLECLASS_SEP).forEach((n)=>{let p=n.replace(/([^;]*);/,"$1").trim();if(RegExp(G.COLOR_KEYWORD).exec(n)){let m=p.replace(G.FILL_KEYWORD,G.BG_FILL).replace(G.COLOR_KEYWORD,G.FILL_KEYWORD);d.textStyles.push(m)}d.styles.push(p)})}getClasses(){return this.classes}setupToolTips(t){let a=Tt();s(t).select("svg").selectAll("g.node, g.rough-node").on("mouseover",(p)=>{let S=s(p.currentTarget),m=S.attr("title");if(m===null)return;let E=p.currentTarget?.getBoundingClientRect();a.transition().duration(200).style("opacity",".9"),a.style("left",window.scrollX+E.left+(E.right-E.left)/2+"px").style("top",window.scrollY+E.bottom+"px"),a.html(we.sanitize(m)),S.classed("hover",!0)}).on("mouseout",(p)=>{a.transition().duration(500).style("opacity",0),s(p.currentTarget).classed("hover",!1)})}setCssClass(t,a){t.split(",").forEach((d)=>{let n=this.getState(d);if(!n){let p=d.trim();this.addState(p),n=this.getState(p)}n?.classes?.push(a)})}setStyle(t,a){this.getState(t)?.styles?.push(a)}setTextStyle(t,a){this.getState(t)?.textStyles?.push(a)}bindFunctions(t){this.funs.forEach((a)=>{a(t)})}getDirectionStatement(){return this.rootDoc.find((t)=>t.stmt===Ht)}getDirection(){return this.getDirectionStatement()?.value??_e}setDirection(t){let a=this.getDirectionStatement();if(a)a.value=t;else this.rootDoc.unshift({stmt:Ht,value:t})}trimColon(t){return t.startsWith(":")?t.slice(1).trim():t.trim()}getData(){let t=i();for(let a of this.nodes)if(a.wrappingWidth??=t.state?.wrappingWidth,!a.isGroup)a.minWidth??=t.state?.minNodeWidth;return{nodes:this.nodes,edges:this.edges,other:{},config:t,direction:ye(this.getRootDocV2())}}getConfig(){return i().state}},qe=e((t)=>{let{theme:a,bkgColorArray:d,borderColorArray:n}=t;if(!Q(a,n))return"";let p=ee(t.look),S=ie(d),m="";for(let E=0;E<at(n);E++){let c=n[E],L=S?`fill: ${d[E%d.length]};`:"",I=`[data-look="${p}"][data-color-id="color-${E}"]`;m+=`

    /* The title strip: \`rect.outer\` spans the whole composite and \`rect.inner\` covers
       the body, so what stays visible of \`outer\` is the band behind the label. */
    ${I}.statediagram-cluster rect.outer {
      stroke: ${c};
      ${L}
    }

    ${I}.statediagram-cluster rect.inner {
      stroke: ${c};
    }

    /* Concurrency regions. Siblings of one composite share a slot, so a divided composite
       reads as one thing split into parts rather than as several composites. */
    ${I}.statediagram-cluster rect.divider {
      stroke: ${c};
      ${L}
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
    ${I}.statediagram-cluster .outer path[stroke='none'] {
      ${L}
    }

    ${I}.statediagram-cluster .outer path[fill='none'] {
      stroke: ${c};
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
    ${I}.statediagram-cluster .divider path[stroke='none'] {
      ${L}
    }

    ${I}.statediagram-cluster .divider path[fill='none'] {
      stroke: ${c};
    }
    `}return m},"genColor"),Qe=e((t)=>`
${qe(t)}
defs [id$="-barbEnd"] {
    fill: ${t.transitionColor};
    stroke: ${t.transitionColor};
  }
g.stateGroup text {
  fill: ${t.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${t.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${t.stateLabelColor};
}

g.stateGroup rect {
  fill: ${t.mainBkg};
  stroke: ${t.nodeBorder};
}

g.stateGroup line {
  stroke: ${t.lineColor};
  stroke-width: ${t.strokeWidth||1};
}

.transition {
  stroke: ${t.transitionColor};
  stroke-width: ${t.strokeWidth||1};
  fill: none;
}

.stateGroup .composit {
  fill: ${t.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${t.noteBorderColor};
  fill: ${t.noteBkgColor};

  text {
    fill: ${t.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${t.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${t.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${t.edgeLabelBackground};
  p {
    background-color: ${t.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${t.edgeLabelBackground};
    fill: ${t.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${t.transitionLabelColor||t.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${t.transitionLabelColor||t.tertiaryTextColor};
}

.stateLabel text {
  fill: ${t.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node .fork-join {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node circle.state-end {
  fill: ${t.innerEndBackground};
  stroke: ${t.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${t.compositeBackground||t.background};
  // stroke: ${t.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${t.stateBkg||t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth||1}px;
}
.node polygon {
  fill: ${t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};;
  stroke-width: ${t.strokeWidth||1}px;
}
[id$="-barbEnd"] {
  fill: ${t.lineColor};
}

.statediagram-cluster rect {
  fill: ${t.compositeTitleBackground};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth||1}px;
}

.cluster-label, .nodeLabel {
  color: ${t.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${t.stateBorder||t.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${t.compositeBackground||t.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${t.altBackground?t.altBackground:"#efefef"};
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
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${t.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${t.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${t.noteTextColor};
}

[id$="-dependencyStart"], [id$="-dependencyEnd"] {
  fill: ${t.lineColor};
  stroke: ${t.lineColor};
  stroke-width: ${t.strokeWidth||1};
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${t.textColor};
}

[data-look="neo"].statediagram-cluster rect {
  fill: ${t.mainBkg};
  stroke: ${t.useGradient?"url("+t.svgId+"-gradient)":t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth??1};
}
[data-look="neo"].statediagram-cluster rect.outer {
  rx: ${t.radius}px;
  ry: ${t.radius}px;
  filter: ${t.dropShadow?t.dropShadow.replace("url(#drop-shadow)",`url(${t.svgId}-drop-shadow)`):"none"}
}
`,"getStyles"),Ze=Qe,ks={parser:Ee,get db(){return new Je(2)},renderer:Xe,styles:Ze,init:e((t)=>{if(!t.state)t.state={};t.state.arrowMarkerAbsolute=t.arrowMarkerAbsolute},"init")};export{ks as diagram};
