import{U}from"./entry-wrqvnc8j.js";import{e,r,_,p,N,b,v,x,w,k,C,T,z,F}from"./entry-79v5dffy.js";import{W}from"./entry-c6s124hx.js";var A=_.packet,S=class{constructor(){this.packet=[],this.setAccTitle=v,this.getAccTitle=x,this.setDiagramTitle=C,this.getDiagramTitle=T,this.getAccDescription=k,this.setAccDescription=w}static{e(this,"PacketDB")}getConfig(){let t=F({...A,...p().packet});if(t.showBits)t.paddingY+=10;return t}getPacket(){return this.packet}pushWord(t){if(t.length>0)this.packet.push(t)}clear(){b(),this.packet=[]}},L=1e4,M=e((t,a)=>{U(t,a);let i=-1,s=[],c=1,{bitsPerRow:d}=a.getConfig();for(let{start:o,end:l,bits:h,label:g}of t.blocks){if(o!==void 0&&l!==void 0&&l<o)throw Error(`Packet block ${o} - ${l} is invalid. End must be greater than start.`);if(o??=i+1,o!==i+1)throw Error(`Packet block ${o} - ${l??o} is not contiguous. It should start from ${i+1}.`);if(h===0)throw Error(`Packet block ${o} is invalid. Cannot have a zero bit field.`);l??=o+(h??1)-1,h??=l-o+1,i=l,r.debug(`Packet block ${o} - ${i} with label ${g}`);while(s.length<=d+1&&a.getPacket().length<L){let[f,n]=Y({start:o,end:l,bits:h,label:g},c,d);if(s.push(f),f.end+1===c*d)a.pushWord(s),s=[],c++;if(!n)break;({start:o,end:l,bits:h,label:g}=n)}}a.pushWord(s)},"populate"),Y=e((t,a,i)=>{if(t.start===void 0)throw Error("start should have been set during first phase");if(t.end===void 0)throw Error("end should have been set during first phase");if(t.start>t.end)throw Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=a*i)return[t,void 0];let s=a*i-1,c=a*i;return[{start:t.start,end:s,label:t.label,bits:s-t.start},{start:c,end:t.end,label:t.label,bits:t.end-c}]},"getNextFittingBlock"),D={parser:{yy:void 0},parse:e(async(t)=>{let a=await W("packet",t),i=D.parser?.yy;if(!(i instanceof S))throw Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");r.debug(a),M(a,i)},"parse")},I=e((t,a,i,s)=>{let c=s.db,d=c.getConfig(),{rowHeight:o,paddingY:l,bitWidth:h,bitsPerRow:g}=d,f=c.getPacket(),n=c.getDiagramTitle(),u=o+l,m=u*(f.length+1)-(n?0:o),y=h*g+2,B=z(a);B.attr("viewBox",`0 0 ${y} ${m}`),N(B,m,y,d.useMaxWidth);for(let[P,E]of f.entries())O(B,E,P,d);B.append("text").text(n).attr("x",y/2).attr("y",m-u/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),O=e((t,a,i,{rowHeight:s,paddingX:c,paddingY:d,bitWidth:o,bitsPerRow:l,showBits:h})=>{let g=t.append("g"),f=i*(s+d)+d;for(let n of a){let u=n.start%l*o+1,m=(n.end-n.start+1)*o-c;if(g.append("rect").attr("x",u).attr("y",f).attr("width",m).attr("height",s).attr("class","packetBlock"),g.append("text").attr("x",u+m/2).attr("y",f+s/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(n.label),!h)continue;let y=n.end===n.start,B=f-2;if(g.append("text").attr("x",u+(y?m/2:0)).attr("y",B).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",y?"middle":"start").text(n.start),!y)g.append("text").attr("x",u+m).attr("y",B).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(n.end)}},"drawWord"),j={draw:I},G={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},H=e(({packet:t}={})=>{let a=F(G,t);return`
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
	`},"styles"),Z={parser:D,get db(){return new S},renderer:j,styles:H};export{Z as diagram};
