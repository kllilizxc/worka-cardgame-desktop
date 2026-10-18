import{ne}from"./entry-569z3p7x.js";import{e,r,P,y,H,S,A,R,_,L,M,I,Q,Z}from"./entry-mmtsa8rn.js";import{fe}from"./entry-fc1fke48.js";var B=P.packet,u=class{constructor(){this.packet=[],this.setAccTitle=A,this.getAccTitle=R,this.setDiagramTitle=M,this.getDiagramTitle=I,this.getAccDescription=L,this.setAccDescription=_}static{e(this,"PacketDB")}getConfig(){let t=Z({...B,...y().packet});if(t.showBits)t.paddingY+=10;return t}getPacket(){return this.packet}pushWord(t){if(t.length>0)this.packet.push(t)}clear(){S(),this.packet=[]}},C=1e4,D=e((t,a)=>{ne(t,a);let i=-1,s=[],c=1,{bitsPerRow:d}=a.getConfig();for(let{start:o,end:l,bits:g,label:p}of t.blocks){if(o!==void 0&&l!==void 0&&l<o)throw Error(`Packet block ${o} - ${l} is invalid. End must be greater than start.`);if(o??=i+1,o!==i+1)throw Error(`Packet block ${o} - ${l??o} is not contiguous. It should start from ${i+1}.`);if(g===0)throw Error(`Packet block ${o} is invalid. Cannot have a zero bit field.`);l??=o+(g??1)-1,g??=l-o+1,i=l,r.debug(`Packet block ${o} - ${i} with label ${p}`);while(s.length<=d+1&&a.getPacket().length<C){let[h,n]=T({start:o,end:l,bits:g,label:p},c,d);if(s.push(h),h.end+1===c*d)a.pushWord(s),s=[],c++;if(!n)break;({start:o,end:l,bits:g,label:p}=n)}}a.pushWord(s)},"populate"),T=e((t,a,i)=>{if(t.start===void 0)throw Error("start should have been set during first phase");if(t.end===void 0)throw Error("end should have been set during first phase");if(t.start>t.end)throw Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=a*i)return[t,void 0];let s=a*i-1,c=a*i;return[{start:t.start,end:s,label:t.label,bits:s-t.start},{start:c,end:t.end,label:t.label,bits:t.end-c}]},"getNextFittingBlock"),w={parser:{yy:void 0},parse:e(async(t)=>{let a=await fe("packet",t),i=w.parser?.yy;if(!(i instanceof u))throw Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");r.debug(a),D(a,i)},"parse")},z=e((t,a,i,s)=>{let c=s.db,d=c.getConfig(),{rowHeight:o,paddingY:l,bitWidth:g,bitsPerRow:p}=d,h=c.getPacket(),n=c.getDiagramTitle(),k=o+l,f=k*(h.length+1)-(n?0:o),m=g*p+2,b=Q(a);b.attr("viewBox",`0 0 ${m} ${f}`),H(b,f,m,d.useMaxWidth);for(let[v,x]of h.entries())E(b,x,v,d);b.append("text").text(n).attr("x",m/2).attr("y",f-k/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),E=e((t,a,i,{rowHeight:s,paddingX:c,paddingY:d,bitWidth:o,bitsPerRow:l,showBits:g})=>{let p=t.append("g"),h=i*(s+d)+d;for(let n of a){let k=n.start%l*o+1,f=(n.end-n.start+1)*o-c;if(p.append("rect").attr("x",k).attr("y",h).attr("width",f).attr("height",s).attr("class","packetBlock"),p.append("text").attr("x",k+f/2).attr("y",h+s/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(n.label),!g)continue;let m=n.end===n.start,b=h-2;if(p.append("text").attr("x",k+(m?f/2:0)).attr("y",b).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",m?"middle":"start").text(n.start),!m)p.append("text").attr("x",k+f).attr("y",b).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(n.end)}},"drawWord"),F={draw:z},W={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},N=e(({packet:t}={})=>{let a=Z(W,t);return`
	.packetByte {
		font-size: ${a.byteFontSize};
	}
	.packetByte.start {
		fill: ${a.startByteColor};
	}
	.packetByte.end {
		fill: ${a.endByteColor};
	}
	.packetLabel {
		fill: ${a.labelColor};
		font-size: ${a.labelFontSize};
	}
	.packetTitle {
		fill: ${a.titleColor};
		font-size: ${a.titleFontSize};
	}
	.packetBlock {
		stroke: ${a.blockStrokeColor};
		stroke-width: ${a.blockStrokeWidth};
		fill: ${a.blockFillColor};
	}
	`},"styles"),q={parser:w,get db(){return new u},renderer:F,styles:N};export{q as diagram};
