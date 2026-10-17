import{U}from"./entry-qgmpeywp.js";import{e,r,ge,_,p,N,b,v,x,w,k,C,T,z,F}from"./entry-xgcbp131.js";import{W}from"./entry-r3cdv4sz.js";var ht=e(()=>({domains:new Map,transitions:[]}),"createDefaultData"),ot=ht(),St=e(()=>ot.domains,"getDomains"),Mt=e(()=>ot.transitions,"getTransitions"),zt=e((t)=>{if(!t)return;for(let n of t){let o=n.domain,a=(n.items??[]).map((l)=>({label:l.label}));ot.domains.set(o,{name:o,items:a})}},"setDomains"),Lt=e((t)=>{if(!t)return;ot.transitions=t.filter((n)=>{if(n.from===n.to)return r.warn(`Cynefin: self-loop transition on domain "${n.from}" is not meaningful and will be skipped.`),!1;return!0}).map((n)=>({from:n.from,to:n.to,label:n.label||void 0}))},"setTransitions"),Nt=e(()=>F({..._.cynefin,...p().cynefin}),"getConfig"),Pt=e(()=>{b(),ot=ht()},"clear"),it={getDomains:St,getTransitions:Mt,setDomains:zt,setTransitions:Lt,getConfig:Nt,clear:Pt,setAccTitle:v,getAccTitle:x,setDiagramTitle:C,getDiagramTitle:T,getAccDescription:k,setAccDescription:w},It=e((t)=>{U(t,it),it.setDomains(t.domains),it.setTransitions(t.transitions)},"populate"),Wt={parse:e(async(t)=>{let n=await W("cynefin",t);r.debug(n),It(n)},"parse")};function nt(t){let n=t+1831565813|0;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}e(nt,"seededRandom");function xt(t){let n=0;for(let o=0;o<t.length;o++){let a=t.charCodeAt(o);n=(n<<5)-n+a,n|=0}return n}e(xt,"hashString");function $t(t,n){if(typeof t==="number"&&Number.isFinite(t)&&t!==0)return t;return xt(n)}e($t,"resolveSeed");function bt(t,n,o,a){let l=t/2,y=a??t*0.015,at=7,Z=n/7,f=[];for(let i=0;i<=7;i++){let u=nt(o+i*17)*y*2-y;f.push({x:l+u,y:i*Z})}let I=`M${f[0].x},${f[0].y}`;for(let i=0;i<f.length-1;i++){let u=f[i],c=f[i+1],m=(u.y+c.y)/2,M=i%2===0?1:-1,D=y*1.5*M*nt(o+i*31+7),J=u.x+D,K=m,tt=c.x-D;I+=` C${J},${K} ${tt},${m} ${c.x},${c.y}`}return I}e(bt,"generateFoldPath");function wt(t,n,o,a){let l=n/2,y=a??n*0.015,at=7,Z=t/7,f=[];for(let i=0;i<=7;i++){let u=nt(o+i*23)*y*2-y;f.push({x:i*Z,y:l+u})}let I=`M${f[0].x},${f[0].y}`;for(let i=0;i<f.length-1;i++){let u=f[i],c=f[i+1],m=(u.x+c.x)/2,M=i%2===0?1:-1,D=y*1.5*M*nt(o+i*37+11),J=m,K=u.y+D,tt=m,O=c.y-D;I+=` C${J},${K} ${tt},${O} ${c.x},${c.y}`}return I}e(wt,"generateHorizontalBoundary");function Ct(t,n){let o=t/2,a=n*0.5,l=n,y=t*0.03;return[`M${o},${a}`,`C${o+y},${a+(l-a)*0.2}`,`${o-y*1.5},${a+(l-a)*0.55}`,`${o+y*0.5},${a+(l-a)*0.75}`,`C${o-y},${a+(l-a)*0.85}`,`${o+y*0.3},${a+(l-a)*0.95}`,`${o},${l}`].join(" ")}e(Ct,"generateCliffPath");function vt(t,n,o,a){return[`M${t-o},${n}`,`A${o},${a} 0 1,1 ${t+o},${n}`,`A${o},${a} 0 1,1 ${t-o},${n}`,"Z"].join(" ")}e(vt,"generateConfusionPath");var gt={complex:{model:"Probe → Sense → Respond",practice:"Emergent Practices"},complicated:{model:"Sense → Analyse → Respond",practice:"Good Practices"},clear:{model:"Sense → Categorise → Respond",practice:"Best Practices"},chaotic:{model:"Act → Sense → Respond",practice:"Novel Practices"},confusion:{model:"",practice:"Disorder"}},Rt=e((t,n)=>{let o=t/2,a=n/2;return{complex:{cx:o/2,cy:a/2,x:0,y:0,w:o,h:a},complicated:{cx:o+o/2,cy:a/2,x:o,y:0,w:o,h:a},chaotic:{cx:o/2,cy:a+a/2,x:0,y:a,w:o,h:a},clear:{cx:o+o/2,cy:a+a/2,x:o,y:a,w:o,h:a},confusion:{cx:o,cy:a,x:o*0.7,y:a*0.7,w:o*0.6,h:a*0.6}}},"getDomainLayouts"),Ft=e(()=>{let t=ge(),n=p();return F(t,n.themeVariables).cynefin},"getCynefinDomainColors"),lt=3,Vt=e((t,n,o,a)=>{let l=a.db,y=l.getDomains(),at=l.getTransitions(),Z=l.getDiagramTitle(),f=l.getAccTitle(),I=l.getAccDescription(),i=l.getConfig(),u=Ft();r.debug("Rendering Cynefin diagram");let{width:c,height:m,padding:M,showDomainDescriptions:D,boundaryAmplitude:J}=i,K=c+M*2,tt=m+M*2,O={complex:u.complexBg,complicated:u.complicatedBg,clear:u.clearBg,chaotic:u.chaoticBg,confusion:u.confusionBg},R=z(n);if(N(R,tt,K,i.useMaxWidth??!0),R.attr("viewBox",`0 0 ${K} ${tt}`),f)R.append("title").text(f);if(I)R.append("desc").text(I);let V=R.append("g").attr("transform",`translate(${M}, ${M})`),et=Rt(c,m),dt=$t(i.seed,n),Dt=V.append("g").attr("class","cynefin-backgrounds"),st=["complex","complicated","chaotic","clear"];for(let d of st){let s=et[d];Dt.append("rect").attr("class","cynefinDomain").attr("x",s.x).attr("y",s.y).attr("width",s.w).attr("height",s.h).attr("fill",O[d]).attr("fill-opacity",0.4).attr("stroke","none")}let ct=V.append("g").attr("class","cynefin-boundaries");ct.append("path").attr("class","cynefinBoundary").attr("d",bt(c,m,dt,J)).attr("fill","none"),ct.append("path").attr("class","cynefinBoundary").attr("d",wt(c,m,dt+100,J)).attr("fill","none"),ct.append("path").attr("class","cynefinCliff").attr("d",Ct(c,m)).attr("fill","none");let kt=c*0.15,Tt=m*0.15;V.append("path").attr("class","cynefinConfusion").attr("d",vt(c/2,m/2,kt,Tt)).attr("fill",O.confusion).attr("fill-opacity",0.5);let ft=V.append("g").attr("class","cynefin-labels");for(let d of st){let s=et[d];ft.append("text").attr("class","cynefinDomainLabel").attr("x",s.cx).attr("y",D?s.cy-30:s.cy).attr("text-anchor","middle").attr("dominant-baseline","middle").text(d.charAt(0).toUpperCase()+d.slice(1))}if(ft.append("text").attr("class","cynefinDomainLabel").attr("x",c/2).attr("y",D?m/2-10:m/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text("Confusion"),D){let d=V.append("g").attr("class","cynefin-subtitles");for(let s of st){let h=et[s],g=gt[s];d.append("text").attr("class","cynefinSubtitle").attr("x",h.cx).attr("y",h.cy-10).attr("text-anchor","middle").attr("dominant-baseline","middle").text(g.model),d.append("text").attr("class","cynefinSubtitle").attr("x",h.cx).attr("y",h.cy+5).attr("text-anchor","middle").attr("dominant-baseline","middle").text(g.practice)}d.append("text").attr("class","cynefinSubtitle").attr("x",c/2).attr("y",m/2+8).attr("text-anchor","middle").attr("dominant-baseline","middle").text(gt.confusion.practice)}let mt=V.append("g").attr("class","cynefin-items"),E=26,pt=10,At=["complex","complicated","chaotic","clear","confusion"];for(let d of At){let s=y.get(d);if(!s||s.items.length===0)continue;let h=et[d],g=d==="confusion",X=s.items,j=0;if(g&&s.items.length>lt)j=s.items.length-lt,X=s.items.slice(0,lt);let H;if(g){let B=D?22:14;H=h.cy+B}else H=h.cy+(D?25:15);if([...X].forEach((B,G)=>{let L=H+G*(E+4),Y=mt.append("g"),q=Y.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",E/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(B.label),S=B.label.length*7,A=q.node();if(A&&typeof A.getBBox==="function"){let rt=A.getBBox();if(rt.width>0)S=rt.width}let P=S+pt*2,Q=h.cx-P/2;Y.attr("transform",`translate(${Q}, ${L})`),Y.insert("rect","text").attr("class","cynefinItem").attr("x",0).attr("y",0).attr("width",P).attr("height",E).attr("rx",4).attr("ry",4).attr("fill",O[d]).attr("fill-opacity",0.95),q.attr("x",P/2).attr("y",E/2)}),j>0){let B=H+X.length*(E+4),G=`+${j} more`,L=mt.append("g"),Y=L.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",E/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(G),q=G.length*7,S=Y.node();if(S&&typeof S.getBBox==="function"){let Q=S.getBBox();if(Q.width>0)q=Q.width}let A=q+pt*2,P=h.cx-A/2;L.attr("transform",`translate(${P}, ${B})`),L.insert("rect","text").attr("class","cynefinItemOverflow").attr("x",0).attr("y",0).attr("width",A).attr("height",E).attr("rx",4).attr("ry",4).attr("fill",O[d]).attr("fill-opacity",0.6),Y.attr("x",A/2).attr("y",E/2)}}if(at.length>0){let d=R.select("defs").empty()?R.append("defs"):R.select("defs"),s=`cynefin-arrow-${n}`;d.append("marker").attr("id",s).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","cynefinArrowHead");let h=V.append("g").attr("class","cynefin-arrows");at.forEach((g)=>{let X=et[g.from],j=et[g.to];if(!X||!j)return;if(g.from===g.to){r.warn(`Cynefin renderer: skipping self-loop on domain "${g.from}"`);return}let{cx:H,cy:B}=X,{cx:G,cy:L}=j,Y=(H+G)/2,q=(B+L)/2,S=G-H,A=L-B,P=Math.sqrt(S*S+A*A),Q=P*0.15,rt=-A/P,Bt=S/P,yt=Y+rt*Q,ut=q+Bt*Q;if(h.append("path").attr("class","cynefinArrowLine").attr("d",`M${H},${B} Q${yt},${ut} ${G},${L}`).attr("fill","none").attr("marker-end",`url(#${s})`),g.label)h.append("text").attr("class","cynefinArrowLabel").attr("x",yt).attr("y",ut-6).attr("text-anchor","middle").attr("dominant-baseline","auto").text(g.label)})}if(Z)V.append("text").attr("class","cynefinTitle").attr("x",c/2).attr("y",-M/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text(Z)},"draw"),_t={draw:Vt},Et=e(()=>{let t=ge(),n=p();return F(t,n.themeVariables).cynefin},"getCynefinTheme"),Ht=e(()=>{let t=Et();return`
	.cynefinDomain {
		stroke: none;
	}
	.cynefinDomainLabel {
		font-size: ${t.domainFontSize}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	.cynefinSubtitle {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
		font-style: italic;
	}
	.cynefinItem {
		fill-opacity: 0.95;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
	}
	.cynefinItemText {
		font-size: ${t.itemFontSize}px;
		fill: ${t.textColor};
	}
	.cynefinItemOverflow {
		fill-opacity: 0.6;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
		stroke-dasharray: 3 2;
	}
	.cynefinBoundary {
		stroke: ${t.boundaryColor};
		stroke-width: ${t.boundaryWidth};
		stroke-dasharray: 6 3;
	}
	.cynefinCliff {
		stroke: ${t.cliffColor};
		stroke-width: ${t.cliffWidth};
	}
	.cynefinConfusion {
		stroke: ${t.boundaryColor};
		stroke-width: 1.5;
		stroke-dasharray: 4 2;
	}
	.cynefinArrowLine {
		stroke: ${t.arrowColor};
		stroke-width: ${t.arrowWidth};
		fill: none;
	}
	.cynefinArrowHead {
		fill: ${t.arrowColor};
		stroke: none;
	}
	.cynefinArrowLabel {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
	}
	.cynefinTitle {
		font-size: ${t.domainFontSize+2}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	`},"styles"),Gt=Ht,Zt={parser:Wt,db:it,renderer:_t,styles:Gt};export{Zt as diagram};
