import{Z}from"./entry-mcj0cczr.js";import{e,r,L,y,z,x,k,C,T,S,A,E,W,H}from"./entry-q62xrf2s.js";import{oe}from"./entry-1sjs52q7.js";var P=L.packet,w=class{constructor(){this.packet=[],this.setAccTitle=k,this.getAccTitle=C,this.setDiagramTitle=A,this.getDiagramTitle=E,this.getAccDescription=S,this.setAccDescription=T}static{e(this,"PacketDB")}getConfig(){let t=H({...P,...y().packet});if(t.showBits)t.paddingY+=10;return t}getPacket(){return this.packet}pushWord(t){if(t.length>0)this.packet.push(t)}clear(){x(),this.packet=[]}},F=1e4,_=e((t,a)=>{Z(t,a);let i=-1,s=[],c=1,{bitsPerRow:d}=a.getConfig();for(let{start:o,end:l,bits:g,label:p}of t.blocks){if(o!==void 0&&l!==void 0&&l<o)throw Error(`Packet block ${o} - ${l} is invalid. End must be greater than start.`);if(o??=i+1,o!==i+1)throw Error(`Packet block ${o} - ${l??o} is not contiguous. It should start from ${i+1}.`);if(g===0)throw Error(`Packet block ${o} is invalid. Cannot have a zero bit field.`);l??=o+(g??1)-1,g??=l-o+1,i=l,r.debug(`Packet block ${o} - ${i} with label ${p}`);while(s.length<=d+1&&a.getPacket().length<F){let[h,n]=N({start:o,end:l,bits:g,label:p},c,d);if(s.push(h),h.end+1===c*d)a.pushWord(s),s=[],c++;if(!n)break;({start:o,end:l,bits:g,label:p}=n)}}a.pushWord(s)},"populate"),N=e((t,a,i)=>{if(t.start===void 0)throw Error("start should have been set during first phase");if(t.end===void 0)throw Error("end should have been set during first phase");if(t.start>t.end)throw Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=a*i)return[t,void 0];let s=a*i-1,c=a*i;return[{start:t.start,end:s,label:t.label,bits:s-t.start},{start:c,end:t.end,label:t.label,bits:t.end-c}]},"getNextFittingBlock"),v={parser:{yy:void 0},parse:e(async(t)=>{let a=await oe("packet",t),i=v.parser?.yy;if(!(i instanceof w))throw Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");r.debug(a),_(a,i)},"parse")},M=e((t,a,i,s)=>{let c=s.db,d=c.getConfig(),{rowHeight:o,paddingY:l,bitWidth:g,bitsPerRow:p}=d,h=c.getPacket(),n=c.getDiagramTitle(),m=o+l,f=m*(h.length+1)-(n?0:o),b=g*p+2,u=W(a);u.attr("viewBox",`0 0 ${b} ${f}`),z(u,f,b,d.useMaxWidth);for(let[B,D]of h.entries())Y(u,D,B,d);u.append("text").text(n).attr("x",b/2).attr("y",f-m/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),Y=e((t,a,i,{rowHeight:s,paddingX:c,paddingY:d,bitWidth:o,bitsPerRow:l,showBits:g})=>{let p=t.append("g"),h=i*(s+d)+d;for(let n of a){let m=n.start%l*o+1,f=(n.end-n.start+1)*o-c;if(p.append("rect").attr("x",m).attr("y",h).attr("width",f).attr("height",s).attr("class","packetBlock"),p.append("text").attr("x",m+f/2).attr("y",h+s/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(n.label),!g)continue;let b=n.end===n.start,u=h-2;if(p.append("text").attr("x",m+(b?f/2:0)).attr("y",u).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",b?"middle":"start").text(n.start),!b)p.append("text").attr("x",m+f).attr("y",u).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(n.end)}},"drawWord"),I={draw:M},O={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},j=e(({packet:t}={})=>{let a=H(O,t);return`
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
	`},"styles"),Q={parser:v,get db(){return new w},renderer:I,styles:j};export{Q as diagram};
