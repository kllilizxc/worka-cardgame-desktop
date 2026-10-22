import{d as Y}from"./entry-14y4ndgz.js";import{f as H}from"./entry-wj05qzh2.js";import{g as R}from"./entry-d9qtn06r.js";import"./entry-k54x5ta4.js";import"./entry-95tk6s8t.js";import"./entry-mke04aef.js";import"./entry-61j4kxv5.js";import"./entry-c29twb3z.js";import"./entry-wtvxzm6n.js";import"./entry-zh1te868.js";import"./entry-4sxgjwqg.js";import"./entry-k0pb60mz.js";import"./entry-v6smtzxe.js";import"./entry-4mgz7466.js";import"./entry-a05v3x9z.js";import"./entry-c88vqs2v.js";import"./entry-78kh4etc.js";import"./entry-wq21sd5k.js";import"./entry-mee3fvj6.js";import{lf as T}from"./entry-hd9qpb0m.js";import"./entry-c6ya8xm6.js";import{Jf as j,Uf as E,fg as C,kg as D,lg as X,mg as A,ng as W,og as f,pg as S,qg as v}from"./entry-mq8wbpjf.js";import{zg as N}from"./entry-fx4ha537.js";import{yh as x}from"./entry-qk00c3wq.js";import"./entry-8fhwzgx3.js";var m=j.packet,B=class{constructor(){this.packet=[],this.setAccTitle=X,this.getAccTitle=A,this.setDiagramTitle=S,this.getDiagramTitle=v,this.getAccDescription=f,this.setAccDescription=W}static{x(this,"PacketDB")}getConfig(){let q=T({...m,...E().packet});if(q.showBits)q.paddingY+=10;return q}getPacket(){return this.packet}pushWord(q){if(q.length>0)this.packet.push(q)}clear(){D(),this.packet=[]}},h=1e4,p=x((q,$)=>{Y(q,$);let V=-1,y=[],L=1,{bitsPerRow:M}=$.getConfig();for(let{start:U,end:G,bits:I,label:Q}of q.blocks){if(U!==void 0&&G!==void 0&&G<U)throw Error(`Packet block ${U} - ${G} is invalid. End must be greater than start.`);if(U??=V+1,U!==V+1)throw Error(`Packet block ${U} - ${G??U} is not contiguous. It should start from ${V+1}.`);if(I===0)throw Error(`Packet block ${U} is invalid. Cannot have a zero bit field.`);G??=U+(I??1)-1,I??=G-U+1,V=G,N.debug(`Packet block ${U} - ${V} with label ${Q}`);while(y.length<=M+1&&$.getPacket().length<h){let[O,z]=k({start:U,end:G,bits:I,label:Q},L,M);if(y.push(O),O.end+1===L*M)$.pushWord(y),y=[],L++;if(!z)break;({start:U,end:G,bits:I,label:Q}=z)}}$.pushWord(y)},"populate"),k=x((q,$,V)=>{if(q.start===void 0)throw Error("start should have been set during first phase");if(q.end===void 0)throw Error("end should have been set during first phase");if(q.start>q.end)throw Error(`Block start ${q.start} is greater than block end ${q.end}.`);if(q.end+1<=$*V)return[q,void 0];let y=$*V-1,L=$*V;return[{start:q.start,end:y,label:q.label,bits:y-q.start},{start:L,end:q.end,label:q.label,bits:q.end-L}]},"getNextFittingBlock"),_={parser:{yy:void 0},parse:x(async(q)=>{let $=await R("packet",q),V=_.parser?.yy;if(!(V instanceof B))throw Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");N.debug($),p($,V)},"parse")},w=x((q,$,V,y)=>{let L=y.db,M=L.getConfig(),{rowHeight:U,paddingY:G,bitWidth:I,bitsPerRow:Q}=M,O=L.getPacket(),z=L.getDiagramTitle(),F=U+G,Z=F*(O.length+1)-(z?0:U),K=I*Q+2,J=H($);J.attr("viewBox",`0 0 ${K} ${Z}`),C(J,Z,K,M.useMaxWidth);for(let[P,u]of O.entries())g(J,u,P,M);J.append("text").text(z).attr("x",K/2).attr("y",Z-F/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),g=x((q,$,V,{rowHeight:y,paddingX:L,paddingY:M,bitWidth:U,bitsPerRow:G,showBits:I})=>{let Q=q.append("g"),O=V*(y+M)+M;for(let z of $){let F=z.start%G*U+1,Z=(z.end-z.start+1)*U-L;if(Q.append("rect").attr("x",F).attr("y",O).attr("width",Z).attr("height",y).attr("class","packetBlock"),Q.append("text").attr("x",F+Z/2).attr("y",O+y/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(z.label),!I)continue;let K=z.end===z.start,J=O-2;if(Q.append("text").attr("x",F+(K?Z/2:0)).attr("y",J).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",K?"middle":"start").text(z.start),!K)Q.append("text").attr("x",F+Z).attr("y",J).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(z.end)}},"drawWord"),n={draw:w},a={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},c=x(({packet:q}={})=>{let $=T(a,q);return`
	.packetByte {
		font-size: ${$.byteFontSize};
	}
	.packetByte.start {
		fill: ${$.startByteColor};
	}
	.packetByte.end {
		fill: ${$.endByteColor};
	}
	.packetLabel {
		fill: ${$.labelColor};
		font-size: ${$.labelFontSize};
	}
	.packetTitle {
		fill: ${$.titleColor};
		font-size: ${$.titleFontSize};
	}
	.packetBlock {
		stroke: ${$.blockStrokeColor};
		stroke-width: ${$.blockStrokeWidth};
		fill: ${$.blockFillColor};
	}
	`},"styles"),o={parser:_,get db(){return new B},renderer:n,styles:c};export{o as diagram};
