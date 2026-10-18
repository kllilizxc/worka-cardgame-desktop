import{e,r,Ze,g,S,A,R,_,L,M,I,i,u,ll,N,Ie,Te,Ce,tr,ze,je}from"./entry-mmtsa8rn.js";import{br}from"./entry-hdbd021s.js";import{Ne}from"./entry-7ks4v911.js";import{Se}from"./entry-hzz73qdx.js";var Ft=function(){var t=e(function(Q,h,y,o){for(y=y||{},o=Q.length;o--;y[Q[o]]=h);return y},"o"),s=[1,2],c=[1,3],a=[1,4],f=[2,4],p=[1,9],b=[1,11],k=[1,16],l=[1,17],v=[1,18],D=[1,19],G=[1,33],Y=[1,20],j=[1,21],O=[1,22],m=[1,23],V=[1,24],F=[1,26],z=[1,27],W=[1,28],K=[1,29],w=[1,30],st=[1,31],pt=[1,32],St=[1,35],gt=[1,36],yt=[1,37],mt=[1,38],rt=[1,34],T=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],bt=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],Yt=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],xt={trace:e(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"CLICK",39:"STRING",40:"HREF",41:"classDef",42:"CLASSDEF_ID",43:"CLASSDEF_STYLEOPTS",44:"DEFAULT",45:"style",46:"STYLE_IDS",47:"STYLEDEF_STYLEOPTS",48:"class",49:"CLASSENTITY_IDS",50:"STYLECLASS",51:"direction_tb",52:"direction_bt",53:"direction_rl",54:"direction_lr",56:";",57:"EDGE_STATE",58:"STYLE_SEPARATOR",59:"left_of",60:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:e(function(h,y,o,E,C,n,it){var d=n.length-1;switch(C){case 3:return E.setRootDoc(n[d]),n[d];break;case 4:this.$=[];break;case 5:if(n[d]!="nl")n[d-1].push(n[d]),this.$=n[d-1];break;case 6:case 7:this.$=n[d];break;case 8:this.$="nl";break;case 12:this.$=n[d];break;case 13:let Tt=n[d-1];Tt.description=E.trimColon(n[d]),this.$=Tt;break;case 14:this.$={stmt:"relation",state1:n[d-2],state2:n[d]};break;case 15:let Et=E.trimColon(n[d]);this.$={stmt:"relation",state1:n[d-3],state2:n[d-1],description:Et};break;case 19:this.$={stmt:"state",id:n[d-3],type:"default",description:"",doc:n[d-1]};break;case 20:var X=n[d],J=n[d-2].trim();if(n[d].match(":")){var lt=n[d].split(":");X=lt[0],J=[J,lt[1]]}this.$={stmt:"state",id:X,type:"default",description:J};break;case 21:this.$={stmt:"state",id:n[d-3],type:"default",description:n[d-5],doc:n[d-1]};break;case 22:this.$={stmt:"state",id:n[d],type:"fork"};break;case 23:this.$={stmt:"state",id:n[d],type:"join"};break;case 24:this.$={stmt:"state",id:n[d],type:"choice"};break;case 25:this.$={stmt:"state",id:E.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:n[d-1].trim(),note:{position:n[d-2].trim(),text:n[d].trim()}};break;case 29:this.$=n[d].trim(),E.setAccTitle(this.$);break;case 30:case 31:this.$=n[d].trim(),E.setAccDescription(this.$);break;case 32:this.$={stmt:"click",id:n[d-3],url:n[d-2],tooltip:n[d-1]};break;case 33:this.$={stmt:"click",id:n[d-3],url:n[d-1],tooltip:""};break;case 34:case 35:this.$={stmt:"classDef",id:n[d-1].trim(),classes:n[d].trim()};break;case 36:this.$={stmt:"style",id:n[d-1].trim(),styleClass:n[d].trim()};break;case 37:this.$={stmt:"applyClass",id:n[d-1].trim(),styleClass:n[d].trim()};break;case 38:E.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 39:E.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 40:E.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 41:E.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 44:case 45:this.$={stmt:"state",id:n[d].trim(),type:"default",description:""};break;case 46:this.$={stmt:"state",id:n[d-2].trim(),classes:[n[d].trim()],type:"default",description:""};break;case 47:this.$={stmt:"state",id:n[d-2].trim(),classes:[n[d].trim()],type:"default",description:""};break}},"anonymous"),table:[{3:1,4:s,5:c,6:a},{1:[3]},{3:5,4:s,5:c,6:a},{3:6,4:s,5:c,6:a},t([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],f,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:p,5:b,8:8,9:10,10:12,11:13,12:14,13:15,16:k,17:l,19:v,22:D,24:G,25:Y,26:j,27:O,28:m,29:V,32:25,33:F,35:z,37:W,38:K,41:w,45:st,48:pt,51:St,52:gt,53:yt,54:mt,57:rt},t(T,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:k,17:l,19:v,22:D,24:G,25:Y,26:j,27:O,28:m,29:V,32:25,33:F,35:z,37:W,38:K,41:w,45:st,48:pt,51:St,52:gt,53:yt,54:mt,57:rt},t(T,[2,7]),t(T,[2,8]),t(T,[2,9]),t(T,[2,10]),t(T,[2,11]),t(T,[2,12],{14:[1,40],15:[1,41]}),t(T,[2,16]),{18:[1,42]},t(T,[2,18],{20:[1,43]}),{23:[1,44]},t(T,[2,22]),t(T,[2,23]),t(T,[2,24]),t(T,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},t(T,[2,28]),{34:[1,49]},{36:[1,50]},t(T,[2,31]),{13:51,24:G,57:rt},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},t(bt,[2,44],{58:[1,56]}),t(bt,[2,45],{58:[1,57]}),t(T,[2,38]),t(T,[2,39]),t(T,[2,40]),t(T,[2,41]),t(T,[2,6]),t(T,[2,13]),{13:58,24:G,57:rt},t(T,[2,17]),t(Yt,f,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},t(T,[2,29]),t(T,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},t(T,[2,14],{14:[1,71]}),{4:p,5:b,8:8,9:10,10:12,11:13,12:14,13:15,16:k,17:l,19:v,21:[1,72],22:D,24:G,25:Y,26:j,27:O,28:m,29:V,32:25,33:F,35:z,37:W,38:K,41:w,45:st,48:pt,51:St,52:gt,53:yt,54:mt,57:rt},t(T,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},t(T,[2,34]),t(T,[2,35]),t(T,[2,36]),t(T,[2,37]),t(bt,[2,46]),t(bt,[2,47]),t(T,[2,15]),t(T,[2,19]),t(Yt,f,{7:78}),t(T,[2,26]),t(T,[2,27]),{5:[1,79]},{5:[1,80]},{4:p,5:b,8:8,9:10,10:12,11:13,12:14,13:15,16:k,17:l,19:v,21:[1,81],22:D,24:G,25:Y,26:j,27:O,28:m,29:V,32:25,33:F,35:z,37:W,38:K,41:w,45:st,48:pt,51:St,52:gt,53:yt,54:mt,57:rt},t(T,[2,32]),t(T,[2,33]),t(T,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:e(function(h,y){if(y.recoverable)this.trace(h);else{var o=Error(h);throw o.hash=y,o}},"parseError"),parse:e(function(h){var y=this,o=[0],E=[],C=[null],n=[],it=this.table,d="",X=0,J=0,lt=0,Tt=2,Et=1,he=n.slice.call(arguments,1),x=Object.create(this.lexer),tt={yy:{}};for(var Lt in this.yy)if(Object.prototype.hasOwnProperty.call(this.yy,Lt))tt.yy[Lt]=this.yy[Lt];if(x.setInput(h,tt.yy),tt.yy.lexer=x,tt.yy.parser=this,typeof x.yylloc>"u")x.yylloc={};var wt=x.yylloc;n.push(wt);var de=x.options&&x.options.ranges;if(typeof tt.yy.parseError==="function")this.parseError=tt.yy.parseError;else this.parseError=Object.getPrototypeOf(this).parseError;function ue(H){o.length=o.length-2*H,C.length=C.length-H,n.length=n.length-H}e(ue,"popStack");function Vt(){var H=E.pop()||x.lex()||Et;if(typeof H!=="number"){if(H instanceof Array)E=H,H=E.pop();H=y.symbols_[H]||H}return H}e(Vt,"lex");var P,It,et,U,qe,Nt,at={},_t,q,Mt,vt;while(!0){if(et=o[o.length-1],this.defaultActions[et])U=this.defaultActions[et];else{if(P===null||typeof P>"u")P=Vt();U=it[et]&&it[et][P]}if(typeof U>"u"||!U.length||!U[0]){var Ot="";vt=[];for(_t in it[et])if(this.terminals_[_t]&&_t>Tt)vt.push("'"+this.terminals_[_t]+"'");if(x.showPosition)Ot="Parse error on line "+(X+1)+`:
`+x.showPosition()+`
Expecting `+vt.join(", ")+", got '"+(this.terminals_[P]||P)+"'";else Ot="Parse error on line "+(X+1)+": Unexpected "+(P==Et?"end of input":"'"+(this.terminals_[P]||P)+"'");this.parseError(Ot,{text:x.match,token:this.terminals_[P]||P,line:x.yylineno,loc:wt,expected:vt})}if(U[0]instanceof Array&&U.length>1)throw Error("Parse Error: multiple actions possible at state: "+et+", token: "+P);switch(U[0]){case 1:if(o.push(P),C.push(x.yytext),n.push(x.yylloc),o.push(U[1]),P=null,!It){if(J=x.yyleng,d=x.yytext,X=x.yylineno,wt=x.yylloc,lt>0)lt--}else P=It,It=null;break;case 2:if(q=this.productions_[U[1]][1],at.$=C[C.length-q],at._$={first_line:n[n.length-(q||1)].first_line,last_line:n[n.length-1].last_line,first_column:n[n.length-(q||1)].first_column,last_column:n[n.length-1].last_column},de)at._$.range=[n[n.length-(q||1)].range[0],n[n.length-1].range[1]];if(Nt=this.performAction.apply(at,[d,J,X,tt.yy,U[1],C,n].concat(he)),typeof Nt<"u")return Nt;if(q)o=o.slice(0,-1*q*2),C=C.slice(0,-1*q),n=n.slice(0,-1*q);o.push(this.productions_[U[1]][0]),C.push(at.$),n.push(at._$),Mt=it[o[o.length-2]][o[o.length-1]],o.push(Mt);break;case 3:return!0}}return!0},"parse")},ce=function(){var Q={EOF:1,parseError:e(function(y,o){if(this.yy.parser)this.yy.parser.parseError(y,o);else throw Error(y)},"parseError"),setInput:e(function(h,y){if(this.yy=y||this.yy||{},this._input=h,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges)this.yylloc.range=[0,0];return this.offset=0,this},"setInput"),input:e(function(){var h=this._input[0];this.yytext+=h,this.yyleng++,this.offset++,this.match+=h,this.matched+=h;var y=h.match(/(?:\r\n?|\n).*/g);if(y)this.yylineno++,this.yylloc.last_line++;else this.yylloc.last_column++;if(this.options.ranges)this.yylloc.range[1]++;return this._input=this._input.slice(1),h},"input"),unput:e(function(h){var y=h.length,o=h.split(/(?:\r\n?|\n)/g);this._input=h+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-y),this.offset-=y;var E=this.match.split(/(?:\r\n?|\n)/g);if(this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),o.length-1)this.yylineno-=o.length-1;var C=this.yylloc.range;if(this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:o?(o.length===E.length?this.yylloc.first_column:0)+E[E.length-o.length].length-o[0].length:this.yylloc.first_column-y},this.options.ranges)this.yylloc.range=[C[0],C[0]+this.yyleng-y];return this.yyleng=this.yytext.length,this},"unput"),more:e(function(){return this._more=!0,this},"more"),reject:e(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:e(function(h){this.unput(this.match.slice(h))},"less"),pastInput:e(function(){var h=this.matched.substr(0,this.matched.length-this.match.length);return(h.length>20?"...":"")+h.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:e(function(){var h=this.match;if(h.length<20)h+=this._input.substr(0,20-h.length);return(h.substr(0,20)+(h.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:e(function(){var h=this.pastInput(),y=Array(h.length+1).join("-");return h+this.upcomingInput()+`
`+y+"^"},"showPosition"),test_match:e(function(h,y){var o,E,C;if(this.options.backtrack_lexer){if(C={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges)C.yylloc.range=this.yylloc.range.slice(0)}if(E=h[0].match(/(?:\r\n?|\n).*/g),E)this.yylineno+=E.length;if(this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:E?E[E.length-1].length-E[E.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+h[0].length},this.yytext+=h[0],this.match+=h[0],this.matches=h,this.yyleng=this.yytext.length,this.options.ranges)this.yylloc.range=[this.offset,this.offset+=this.yyleng];if(this._more=!1,this._backtrack=!1,this._input=this._input.slice(h[0].length),this.matched+=h[0],o=this.performAction.call(this,this.yy,this,y,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input)this.done=!1;if(o)return o;else if(this._backtrack){for(var n in C)this[n]=C[n];return!1}return!1},"test_match"),next:e(function(){if(this.done)return this.EOF;if(!this._input)this.done=!0;var h,y,o,E;if(!this._more)this.yytext="",this.match="";var C=this._currentRules();for(var n=0;n<C.length;n++)if(o=this._input.match(this.rules[C[n]]),o&&(!y||o[0].length>y[0].length)){if(y=o,E=n,this.options.backtrack_lexer)if(h=this.test_match(o,C[n]),h!==!1)return h;else if(this._backtrack){y=!1;continue}else return!1;else if(!this.options.flex)break}if(y){if(h=this.test_match(y,C[E]),h!==!1)return h;return!1}if(this._input==="")return this.EOF;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:e(function(){var y=this.next();if(y)return y;else return this.lex()},"lex"),begin:e(function(y){this.conditionStack.push(y)},"begin"),popState:e(function(){var y=this.conditionStack.length-1;if(y>0)return this.conditionStack.pop();else return this.conditionStack[0]},"popState"),_currentRules:e(function(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1])return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;else return this.conditions.INITIAL.rules},"_currentRules"),topState:e(function(y){if(y=this.conditionStack.length-1-Math.abs(y||0),y>=0)return this.conditionStack[y];else return"INITIAL"},"topState"),pushState:e(function(y){this.begin(y)},"pushState"),stateStackSize:e(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:e(function(y,o,E,C){function n(){let d=o.yytext.indexOf("%%");if(d===0)return!1;if(d>0){let X=o.yytext.slice(0,d),J=o.yytext.slice(d);if(J)y.lexer.unput(J);o.yytext=X}return!0}e(n,"processId");var it=C;switch(E){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:return 5;case 9:break;case 10:break;case 11:break;case 12:break;case 13:return this.pushState("SCALE"),17;break;case 14:return 18;case 15:this.popState();break;case 16:return this.begin("acc_title"),33;break;case 17:return this.popState(),"acc_title_value";break;case 18:return this.begin("acc_descr"),35;break;case 19:return this.popState(),"acc_descr_value";break;case 20:this.begin("acc_descr_multiline");break;case 21:this.popState();break;case 22:return"acc_descr_multiline_value";case 23:return this.pushState("CLASSDEF"),41;break;case 24:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";break;case 25:return this.popState(),this.pushState("CLASSDEFID"),42;break;case 26:return this.popState(),43;break;case 27:return this.pushState("CLASS"),48;break;case 28:return this.popState(),this.pushState("CLASS_STYLE"),49;break;case 29:return this.popState(),50;break;case 30:return this.pushState("STYLE"),45;break;case 31:return this.popState(),this.pushState("STYLEDEF_STYLES"),46;break;case 32:return this.popState(),47;break;case 33:return this.pushState("SCALE"),17;break;case 34:return 18;case 35:this.popState();break;case 36:this.pushState("STATE");break;case 37:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),25;break;case 38:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),26;break;case 39:return this.popState(),o.yytext=o.yytext.slice(0,-10).trim(),27;break;case 40:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),25;break;case 41:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),26;break;case 42:return this.popState(),o.yytext=o.yytext.slice(0,-10).trim(),27;break;case 43:return 51;case 44:return 52;case 45:return 53;case 46:return 54;case 47:this.pushState("STATE_STRING");break;case 48:return this.pushState("STATE_ID"),"AS";break;case 49:if(!n())return;return this.popState(),"ID";break;case 50:this.popState();break;case 51:return"STATE_DESCR";case 52:throw Error('Error: State name must be a single word. Found: "'+o.yytext.trim()+'"');case 53:return 19;case 54:this.popState();break;case 55:return this.popState(),this.pushState("struct"),20;break;case 56:return this.popState(),21;break;case 57:break;case 58:return this.begin("NOTE"),29;break;case 59:return this.popState(),this.pushState("NOTE_ID"),59;break;case 60:return this.popState(),this.pushState("NOTE_ID"),60;break;case 61:this.popState(),this.pushState("FLOATING_NOTE");break;case 62:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";break;case 63:break;case 64:return"NOTE_TEXT";case 65:if(!n())return;return this.popState(),"ID";break;case 66:if(!n())return;return this.popState(),this.pushState("NOTE_TEXT"),24;break;case 67:return this.popState(),o.yytext=o.yytext.substr(2).trim(),31;break;case 68:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),31;break;case 69:return 6;case 70:return 6;case 71:return 16;case 72:return 57;case 73:if(!n())return;return 24;case 74:return o.yytext=o.yytext.trim(),14;break;case 75:return 15;case 76:return 28;case 77:return 58;case 78:return 5;case 79:return"INVALID"}},"anonymous"),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:\w+\s+\w+.*?\{)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?\n\s*end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:(?:[^:\n;]|:[^:\n;])+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[10,11,12],inclusive:!1},struct:{rules:[10,11,12,23,27,30,36,43,44,45,46,56,57,58,72,73,74,75,76,77],inclusive:!1},FLOATING_NOTE_ID:{rules:[65],inclusive:!1},FLOATING_NOTE:{rules:[62,63,64],inclusive:!1},NOTE_TEXT:{rules:[67,68],inclusive:!1},NOTE_ID:{rules:[66],inclusive:!1},NOTE:{rules:[59,60,61],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[32],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[31],inclusive:!1},CLASS_STYLE:{rules:[29],inclusive:!1},CLASS:{rules:[28],inclusive:!1},CLASSDEFID:{rules:[26],inclusive:!1},CLASSDEF:{rules:[24,25],inclusive:!1},acc_descr_multiline:{rules:[21,22],inclusive:!1},acc_descr:{rules:[19],inclusive:!1},acc_title:{rules:[17],inclusive:!1},SCALE:{rules:[14,15,34,35],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[49],inclusive:!1},STATE_STRING:{rules:[50,51],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[10,11,12,37,38,39,40,41,42,47,48,52,53,54,55],inclusive:!1},ID:{rules:[10,11,12],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,11,12,13,16,18,20,23,27,30,33,36,55,58,69,70,71,72,73,74,75,77,78,79],inclusive:!0}}};return Q}();xt.lexer=ce;function kt(){this.yy={}}return e(kt,"Parser"),kt.prototype=xt,xt.Parser=kt,new kt}();Ft.parser=Ft;var fe=Ft,pe="TB",Xt="TB",Wt="dir",ot="state",nt="root",Pt="relation",ge="classDef",ye="style",me="applyClass",ut="default",Jt="divider",qt="fill:none",Qt="fill: #333",Zt="c",te="markdown",ee="normal",Rt="rect",$t="rectWithTitle",be="stateStart",ke="stateEnd",Bt="divider",jt="roundedWithTitle",Ee="note",_e="noteGroup",ft="statediagram",ve="state",De=`${ft}-${ve}`,se="transition",Ae="note",xe="note-edge",Le=`${se} ${xe}`,we=`${ft}-${Ae}`,Oe="cluster",Re=`${ft}-${Oe}`,$e="cluster-alt",Fe=`${ft}-${$e}`,re="parent",ie="note",Pe="state",Gt="----",Be=`${Gt}${ie}`,Ut=`${Gt}${re}`,Ct=new Map,Z=0,ae=0,ct=new Map,Ge=e((t,s,c,a)=>{if(t===Bt&&c?.id!==void 0&&ct.has(c.id)){let b=ct.get(c.id);return ct.set(s,b),b}let f=ae++,p=a?void 0:f;return ct.set(s,p),p},"colorSlotFor");function At(t="",s=0,c="",a=Gt){let f=c!==null&&c.length>0?`${a}${c}`:"";return`${Pe}-${t}${f}-${s}`}e(At,"stateDomId");var Ye=e((t,s,c,a,f,p,b,k)=>{r.trace("items",s),s.forEach((l)=>{switch(l.stmt){case ot:dt(t,l,c,a,f,p,b,k);break;case ut:dt(t,l,c,a,f,p,b,k);break;case Pt:{dt(t,l.state1,c,a,f,p,b,k),dt(t,l.state2,c,a,f,p,b,k);let v=b==="neo",D={id:"edge"+Z,start:l.state1.id,end:l.state2.id,arrowhead:"normal",arrowTypeEnd:v?"arrow_barb_neo":"arrow_barb",style:qt,labelStyle:"",label:g.sanitizeText(l.description??"",i()),arrowheadStyle:Qt,labelpos:Zt,labelType:te,thickness:ee,classes:se,look:b};f.push(D),Z++}break}})},"setupDoc"),Ht=e((t,s=Xt)=>{let c=s;if(t.doc){for(let a of t.doc)if(a.stmt==="dir")c=a.value}return c},"getDir");function ht(t,s,c){if(!s.id||s.id==="</join></fork>"||s.id==="</choice>")return;if(s.cssClasses){if(!Array.isArray(s.cssCompiledStyles))s.cssCompiledStyles=[];s.cssClasses.split(" ").forEach((f)=>{let p=c.get(f);if(p)s.cssCompiledStyles=[...s.cssCompiledStyles??[],...p.styles]})}let a=t.find((f)=>f.id===s.id);if(a)Object.assign(a,s);else t.push(s)}e(ht,"insertOrUpdateNode");function ne(t){return t?.classes?.join(" ")??""}e(ne,"getClassesFromDbInfo");function oe(t){return t?.styles??[]}e(oe,"getStylesFromDbInfo");var dt=e((t,s,c,a,f,p,b,k)=>{let l=s.id,v=c.get(l),D=ne(v),G=oe(v),Y=i(),j=D.trim()!==""||G.length>0;if(r.info("dataFetcher parsedItem",s,v,G),l!=="root"){let O=Rt;if(s.start===!0)O=be;else if(s.start===!1)O=ke;if(s.type!==ut)O=s.type;if(!Ct.get(l))Ct.set(l,{id:l,shape:O,description:g.sanitizeText(l,Y),cssClasses:`${D} ${De}`,cssStyles:G});let m=Ct.get(l);if(s.description){if(Array.isArray(m.description))m.shape=$t,m.description.push(s.description);else if(m.description?.length&&m.description.length>0)if(m.shape=$t,m.description===l)m.description=[s.description];else m.description=[m.description,s.description];else m.shape=Rt,m.description=s.description;m.description=g.sanitizeTextOrArray(m.description,Y)}if(m.description?.length===1&&m.shape===$t)if(m.type==="group")m.shape=jt;else m.shape=Rt;if(!m.type&&s.doc)r.info("Setting cluster for XCX",l,Ht(s)),m.type="group",m.isGroup=!0,m.dir=Ht(s),m.shape=s.type===Jt?Bt:jt,m.colorIndex=Ge(m.shape,l,t,j),m.cssClasses=`${m.cssClasses} ${Re} ${p?Fe:""}`;let V={labelStyle:"",shape:m.shape,label:m.description,cssClasses:m.cssClasses,cssCompiledStyles:[],cssStyles:m.cssStyles,id:l,dir:m.dir,domId:At(l,Z),type:m.type,isGroup:m.type==="group",colorIndex:m.colorIndex,padding:8,rx:10,ry:10,look:b,labelType:"markdown"};if(V.shape===Bt)V.label="";if(t&&t.id!=="root")r.trace("Setting node ",l," to be child of its parent ",t.id),V.parentId=t.id;if(V.centerLabel=!0,s.note){let F={labelStyle:"",shape:Ee,label:s.note.text,labelType:"markdown",cssClasses:we,cssStyles:[],cssCompiledStyles:[],id:l+Be+"-"+Z,domId:At(l,Z,ie),type:"node",isGroup:!1,padding:Y.flowchart?.padding,look:b,position:s.note.position},z=l+Ut,W={labelStyle:"",shape:_e,label:s.note.text,cssClasses:m.cssClasses,cssStyles:[],id:l+Ut,domId:At(l,Z,re),type:"group",isGroup:!0,padding:16,look:b,position:s.note.position};Z++,W.id=z,F.parentId=z,ht(a,W,k),ht(a,F,k),ht(a,V,k);let K=l,w=F.id;if(s.note.position==="left of")K=F.id,w=l;f.push({id:K+"-"+w,start:K,end:w,arrowhead:"none",arrowTypeEnd:"",style:qt,labelStyle:"",classes:Le,pattern:"dashed",arrowheadStyle:Qt,labelpos:Zt,labelType:te,thickness:ee,look:b})}else ht(a,V,k)}if(s.doc)r.trace("Adding nodes children "),Ye(s,s.doc,c,a,f,!p,b,k)},"dataFetcher"),Ve=e(()=>{Ct.clear(),Z=0,ae=0,ct.clear()},"reset"),le=e((t,s=Xt)=>{if(!t.doc)return s;let c=s;for(let a of t.doc)if(a.stmt==="dir")c=a.value;return c},"getDir"),Me=e(function(t,s){return s.db.getClasses()},"getClasses"),We=e(async function(t,s,c,a){r.info("REF0:"),r.info("Drawing state diagram (v2)",s);let{securityLevel:f,state:p,layout:b}=i();a.db.extract(a.db.getRootDocV2());let k=a.db.getData(),l=Ne(s,f);if(k.type=a.type,k.layoutAlgorithm=je(b),k.nodeSpacing=p?.nodeSpacing||50,k.rankSpacing=p?.rankSpacing||50,i().look==="neo")k.markers=["barbNeo"];else k.markers=["barb"];k.diagramId=s,await ze(k,l);let D=8;try{(typeof a.db.getLinks==="function"?a.db.getLinks():new Map).forEach((Y,j)=>{let O=typeof j==="string"?j:typeof j?.id==="string"?j.id:"",m=k.nodes.find((w)=>w.id===O);if(!O){r.warn("⚠️ Invalid or missing stateId from key:",JSON.stringify(j));return}let V=l.node()?.querySelectorAll("g.node, g.rough-node"),F;if(V?.forEach((w)=>{let st=w.textContent?.trim();if(w.id===m?.domId||st===O)F=w}),!F){r.warn("⚠️ Could not find node matching text:",O);return}let z=F.parentNode;if(!z){r.warn("⚠️ Node has no parent, cannot wrap:",O);return}let W=document.createElementNS("http://www.w3.org/2000/svg","a"),K=Y.url.replace(/^"+|"+$/g,"");if(W.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",K),W.setAttribute("target","_blank"),Y.tooltip){let w=Y.tooltip.replace(/^"+|"+$/g,"");W.setAttribute("title",w),F.setAttribute("title",w)}z.replaceChild(W,F),W.appendChild(F),r.info("\uD83D\uDD17 Wrapped node in <a> tag for:",O,Y.url)})}catch(G){r.error("❌ Error injecting clickable links:",G)}N.insertTitle(l,"statediagramTitleText",p?.titleTopMargin??25,a.db.getDiagramTitle()),Se(l,D,ft,p?.useMaxWidth??!0)},"draw"),Ue={getClasses:Me,draw:We,getDir:le},B={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},zt=e(()=>new Map,"newClassesList"),Kt=e(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),Dt=e((t)=>JSON.parse(JSON.stringify(t)),"clone"),He=class{constructor(t){this.version=t,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=zt(),this.documents={root:Kt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.funs=[],this.getAccTitle=R,this.setAccTitle=A,this.getAccDescription=L,this.setAccDescription=_,this.setDiagramTitle=M,this.getDiagramTitle=I,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this),this.bindFunctions=this.bindFunctions.bind(this)}static{e(this,"StateDB")}static{this.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3}}extract(t){this.clear(!0);for(let a of Array.isArray(t)?t:t.doc)switch(a.stmt){case ot:this.addState(a.id.trim(),a.type,a.doc,a.description,a.note);break;case Pt:this.addRelation(a.state1,a.state2,a.description);break;case ge:this.addStyleClass(a.id.trim(),a.classes);break;case ye:this.handleStyleDef(a);break;case me:this.setCssClass(a.id.trim(),a.styleClass);break;case"click":this.addLink(a.id,a.url,a.tooltip);break}let s=this.getStates(),c=i();Ve(),dt(void 0,this.getRootDocV2(),s,this.nodes,this.edges,!0,c.look,this.classes);for(let a of this.nodes){if(!Array.isArray(a.label))continue;if(a.description=a.label.slice(1),a.isGroup&&a.description.length>0)throw Error(`Group nodes can only have label. Remove the additional description for node [${a.id}]`);a.label=a.label[0]}}handleStyleDef(t){let s=t.id.trim().split(","),c=t.styleClass.split(",");for(let a of s){let f=this.getState(a);if(!f){let p=a.trim();this.addState(p),f=this.getState(p)}if(f)f.styles=c.map((p)=>p.replace(/;/g,"")?.trim())}}setRootDoc(t){if(r.info("Setting root doc",t),this.rootDoc=t,this.version===1)this.extract(t);else this.extract(this.getRootDocV2())}docTranslator(t,s,c){if(s.stmt===Pt){this.docTranslator(t,s.state1,!0),this.docTranslator(t,s.state2,!1);return}if(s.stmt===ot)if(s.id===B.START_NODE)s.id=t.id+(c?"_start":"_end"),s.start=c;else s.id=s.id.trim();if(s.stmt!==nt&&s.stmt!==ot||!s.doc)return;let a=[],f=[];for(let p of s.doc)if(p.type===Jt){let b=Dt(p);b.doc=Dt(f),a.push(b),f=[]}else f.push(p);if(a.length>0&&f.length>0){let p={stmt:ot,id:ll(),type:"divider",doc:Dt(f)};a.push(Dt(p)),s.doc=a}s.doc.forEach((p)=>this.docTranslator(s,p,!0))}getRootDocV2(){return this.docTranslator({id:nt,stmt:nt},{id:nt,stmt:nt,doc:this.rootDoc},!0),{id:nt,doc:this.rootDoc}}addState(t,s=ut,c=void 0,a=void 0,f=void 0,p=void 0,b=void 0,k=void 0){let l=t?.trim();if(!this.currentDocument.states.has(l))r.info("Adding state ",l,a),this.currentDocument.states.set(l,{stmt:ot,id:l,descriptions:[],type:s,doc:c,note:f,classes:[],styles:[],textStyles:[]});else{let v=this.currentDocument.states.get(l);if(!v)throw Error(`State not found: ${l}`);if(!v.doc)v.doc=c;if(!v.type)v.type=s}if(a)r.info("Setting state description",l,a),(Array.isArray(a)?a:[a]).forEach((D)=>this.addDescription(l,D.trim()));if(f){let v=this.currentDocument.states.get(l);if(!v)throw Error(`State not found: ${l}`);v.note=f,v.note.text=g.sanitizeText(v.note.text,i())}if(p)r.info("Setting state classes",l,p),(Array.isArray(p)?p:[p]).forEach((D)=>this.setCssClass(l,D.trim()));if(b)r.info("Setting state styles",l,b),(Array.isArray(b)?b:[b]).forEach((D)=>this.setStyle(l,D.trim()));if(k)r.info("Setting state styles",l,b),(Array.isArray(k)?k:[k]).forEach((D)=>this.setTextStyle(l,D.trim()))}clear(t){if(this.nodes=[],this.edges=[],this.funs=[this.setupToolTips.bind(this)],this.documents={root:Kt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=zt(),!t)this.links=new Map,S()}getState(t){return this.currentDocument.states.get(t)}getStates(){return this.currentDocument.states}logDocuments(){r.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}addLink(t,s,c){this.links.set(t,{url:s,tooltip:c}),r.warn("Adding link",t,s,c)}getLinks(){return this.links}startIdIfNeeded(t=""){if(t===B.START_NODE)return this.startEndCount++,`${B.START_TYPE}${this.startEndCount}`;return t}startTypeIfNeeded(t="",s=ut){return t===B.START_NODE?B.START_TYPE:s}endIdIfNeeded(t=""){if(t===B.END_NODE)return this.startEndCount++,`${B.END_TYPE}${this.startEndCount}`;return t}endTypeIfNeeded(t="",s=ut){return t===B.END_NODE?B.END_TYPE:s}addRelationObjs(t,s,c=""){let a=this.startIdIfNeeded(t.id.trim()),f=this.startTypeIfNeeded(t.id.trim(),t.type),p=this.startIdIfNeeded(s.id.trim()),b=this.startTypeIfNeeded(s.id.trim(),s.type);this.addState(a,f,t.doc,t.description,t.note,t.classes,t.styles,t.textStyles),this.addState(p,b,s.doc,s.description,s.note,s.classes,s.styles,s.textStyles),this.currentDocument.relations.push({id1:a,id2:p,relationTitle:g.sanitizeText(c,i())})}addRelation(t,s,c){if(typeof t==="object"&&typeof s==="object")this.addRelationObjs(t,s,c);else if(typeof t==="string"&&typeof s==="string"){let a=this.startIdIfNeeded(t.trim()),f=this.startTypeIfNeeded(t),p=this.endIdIfNeeded(s.trim()),b=this.endTypeIfNeeded(s);this.addState(a,f),this.addState(p,b),this.currentDocument.relations.push({id1:a,id2:p,relationTitle:c?g.sanitizeText(c,i()):void 0})}}addDescription(t,s){let c=this.currentDocument.states.get(t),a=s.startsWith(":")?s.replace(":","").trim():s;c?.descriptions?.push(g.sanitizeText(a,i()))}cleanupLabel(t){return t.startsWith(":")?t.slice(2).trim():t.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(t,s=""){if(!this.classes.has(t))this.classes.set(t,{id:t,styles:[],textStyles:[]});let c=this.classes.get(t);if(s&&c)s.split(B.STYLECLASS_SEP).forEach((a)=>{let f=a.replace(/([^;]*);/,"$1").trim();if(RegExp(B.COLOR_KEYWORD).exec(a)){let b=f.replace(B.FILL_KEYWORD,B.BG_FILL).replace(B.COLOR_KEYWORD,B.FILL_KEYWORD);c.textStyles.push(b)}c.styles.push(f)})}getClasses(){return this.classes}setupToolTips(t){let s=br();u(t).select("svg").selectAll("g.node, g.rough-node").on("mouseover",(f)=>{let p=u(f.currentTarget),b=p.attr("title");if(b===null)return;let k=f.currentTarget?.getBoundingClientRect();s.transition().duration(200).style("opacity",".9"),s.style("left",window.scrollX+k.left+(k.right-k.left)/2+"px").style("top",window.scrollY+k.bottom+"px"),s.html(Ze.sanitize(b)),p.classed("hover",!0)}).on("mouseout",(f)=>{s.transition().duration(500).style("opacity",0),u(f.currentTarget).classed("hover",!1)})}setCssClass(t,s){t.split(",").forEach((c)=>{let a=this.getState(c);if(!a){let f=c.trim();this.addState(f),a=this.getState(f)}a?.classes?.push(s)})}setStyle(t,s){this.getState(t)?.styles?.push(s)}setTextStyle(t,s){this.getState(t)?.textStyles?.push(s)}bindFunctions(t){this.funs.forEach((s)=>{s(t)})}getDirectionStatement(){return this.rootDoc.find((t)=>t.stmt===Wt)}getDirection(){return this.getDirectionStatement()?.value??pe}setDirection(t){let s=this.getDirectionStatement();if(s)s.value=t;else this.rootDoc.unshift({stmt:Wt,value:t})}trimColon(t){return t.startsWith(":")?t.slice(1).trim():t.trim()}getData(){let t=i();for(let s of this.nodes)if(s.wrappingWidth??=t.state?.wrappingWidth,!s.isGroup)s.minWidth??=t.state?.minNodeWidth;return{nodes:this.nodes,edges:this.edges,other:{},config:t,direction:le(this.getRootDocV2())}}getConfig(){return i().state}},Ke=e((t)=>{let{theme:s,bkgColorArray:c,borderColorArray:a}=t;if(!Te(s,a))return"";let f=Ce(t.look),p=Ie(c),b="";for(let k=0;k<tr(a);k++){let l=a[k],v=p?`fill: ${c[k%c.length]};`:"",D=`[data-look="${f}"][data-color-id="color-${k}"]`;b+=`

    /* The title strip: \`rect.outer\` spans the whole composite and \`rect.inner\` covers
       the body, so what stays visible of \`outer\` is the band behind the label. */
    ${D}.statediagram-cluster rect.outer {
      stroke: ${l};
      ${v}
    }

    ${D}.statediagram-cluster rect.inner {
      stroke: ${l};
    }

    /* Concurrency regions. Siblings of one composite share a slot, so a divided composite
       reads as one thing split into parts rather than as several composites. */
    ${D}.statediagram-cluster rect.divider {
      stroke: ${l};
      ${v}
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
    ${D}.statediagram-cluster .outer path[stroke='none'] {
      ${v}
    }

    ${D}.statediagram-cluster .outer path[fill='none'] {
      stroke: ${l};
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
    ${D}.statediagram-cluster .divider path[stroke='none'] {
      ${v}
    }

    ${D}.statediagram-cluster .divider path[fill='none'] {
      stroke: ${l};
    }
    `}return b},"genColor"),Xe=e((t)=>`
${Ke(t)}
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
`,"getStyles"),Je=Xe,ms={parser:fe,get db(){return new He(2)},renderer:Ue,styles:Je,init:e((t)=>{if(!t.state)t.state={};t.state.arrowMarkerAbsolute=t.arrowMarkerAbsolute},"init")};export{ms as diagram};
