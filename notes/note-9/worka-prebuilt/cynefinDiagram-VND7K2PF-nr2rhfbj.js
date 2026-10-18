import{ne}from"./entry-mggpcgs9.js";import{e,r,He,P,y,H,S,A,R,_,L,M,I,Q,Z}from"./entry-6qffa7q6.js";import{fe}from"./entry-hajckbw5.js";var ut=e(()=>({domains:new Map,transitions:[]}),"createDefaultData"),et=ut(),At=e(()=>et.domains,"getDomains"),Bt=e(()=>et.transitions,"getTransitions"),St=e((t)=>{if(!t)return;for(let n of t){let o=n.domain,a=(n.items??[]).map((l)=>({label:l.label}));et.domains.set(o,{name:o,items:a})}},"setDomains"),Mt=e((t)=>{if(!t)return;et.transitions=t.filter((n)=>{if(n.from===n.to)return r.warn(`Cynefin: self-loop transition on domain "${n.from}" is not meaningful and will be skipped.`),!1;return!0}).map((n)=>({from:n.from,to:n.to,label:n.label||void 0}))},"setTransitions"),zt=e(()=>Z({...P.cynefin,...y().cynefin}),"getConfig"),Lt=e(()=>{S(),et=ut()},"clear"),at={getDomains:At,getTransitions:Bt,setDomains:St,setTransitions:Mt,getConfig:zt,clear:Lt,setAccTitle:A,getAccTitle:R,setDiagramTitle:M,getDiagramTitle:I,getAccDescription:L,setAccDescription:_},Nt=e((t)=>{ne(t,at),at.setDomains(t.domains),at.setTransitions(t.transitions)},"populate"),Pt={parse:e(async(t)=>{let n=await fe("cynefin",t);r.debug(n),Nt(n)},"parse")};function tt(t){let n=t+1831565813|0;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}e(tt,"seededRandom");function gt(t){let n=0;for(let o=0;o<t.length;o++){let a=t.charCodeAt(o);n=(n<<5)-n+a,n|=0}return n}e(gt,"hashString");function ht(t,n){if(typeof t==="number"&&Number.isFinite(t)&&t!==0)return t;return gt(n)}e(ht,"resolveSeed");function xt(t,n,o,a){let l=t/2,p=a??t*0.015,nt=7,j=n/7,f=[];for(let i=0;i<=7;i++){let u=tt(o+i*17)*p*2-p;f.push({x:l+u,y:i*j})}let T=`M${f[0].x},${f[0].y}`;for(let i=0;i<f.length-1;i++){let u=f[i],c=f[i+1],m=(u.y+c.y)/2,v=i%2===0?1:-1,x=p*1.5*v*tt(o+i*31+7),q=u.x+x,U=m,J=c.x-x;T+=` C${q},${U} ${J},${m} ${c.x},${c.y}`}return T}e(xt,"generateFoldPath");function $t(t,n,o,a){let l=n/2,p=a??n*0.015,nt=7,j=t/7,f=[];for(let i=0;i<=7;i++){let u=tt(o+i*23)*p*2-p;f.push({x:i*j,y:l+u})}let T=`M${f[0].x},${f[0].y}`;for(let i=0;i<f.length-1;i++){let u=f[i],c=f[i+1],m=(u.x+c.x)/2,v=i%2===0?1:-1,x=p*1.5*v*tt(o+i*37+11),q=m,U=u.y+x,J=m,E=c.y-x;T+=` C${q},${U} ${J},${E} ${c.x},${c.y}`}return T}e($t,"generateHorizontalBoundary");function bt(t,n){let o=t/2,a=n*0.5,l=n,p=t*0.03;return[`M${o},${a}`,`C${o+p},${a+(l-a)*0.2}`,`${o-p*1.5},${a+(l-a)*0.55}`,`${o+p*0.5},${a+(l-a)*0.75}`,`C${o-p},${a+(l-a)*0.85}`,`${o+p*0.3},${a+(l-a)*0.95}`,`${o},${l}`].join(" ")}e(bt,"generateCliffPath");function wt(t,n,o,a){return[`M${t-o},${n}`,`A${o},${a} 0 1,1 ${t+o},${n}`,`A${o},${a} 0 1,1 ${t-o},${n}`,"Z"].join(" ")}e(wt,"generateConfusionPath");var yt={complex:{model:"Probe → Sense → Respond",practice:"Emergent Practices"},complicated:{model:"Sense → Analyse → Respond",practice:"Good Practices"},clear:{model:"Sense → Categorise → Respond",practice:"Best Practices"},chaotic:{model:"Act → Sense → Respond",practice:"Novel Practices"},confusion:{model:"",practice:"Disorder"}},It=e((t,n)=>{let o=t/2,a=n/2;return{complex:{cx:o/2,cy:a/2,x:0,y:0,w:o,h:a},complicated:{cx:o+o/2,cy:a/2,x:o,y:0,w:o,h:a},chaotic:{cx:o/2,cy:a+a/2,x:0,y:a,w:o,h:a},clear:{cx:o+o/2,cy:a+a/2,x:o,y:a,w:o,h:a},confusion:{cx:o,cy:a,x:o*0.7,y:a*0.7,w:o*0.6,h:a*0.6}}},"getDomainLayouts"),Wt=e(()=>{let t=He(),n=y();return Z(t,n.themeVariables).cynefin},"getCynefinDomainColors"),st=3,Rt=e((t,n,o,a)=>{let l=a.db,p=l.getDomains(),nt=l.getTransitions(),j=l.getDiagramTitle(),f=l.getAccTitle(),T=l.getAccDescription(),i=l.getConfig(),u=Wt();r.debug("Rendering Cynefin diagram");let{width:c,height:m,padding:v,showDomainDescriptions:x,boundaryAmplitude:q}=i,U=c+v*2,J=m+v*2,E={complex:u.complexBg,complicated:u.complicatedBg,clear:u.clearBg,chaotic:u.chaoticBg,confusion:u.confusionBg},B=Q(n);if(H(B,J,U,i.useMaxWidth??!0),B.attr("viewBox",`0 0 ${U} ${J}`),f)B.append("title").text(f);if(T)B.append("desc").text(T);let z=B.append("g").attr("transform",`translate(${v}, ${v})`),K=It(c,m),ct=ht(i.seed,n),Ct=z.append("g").attr("class","cynefin-backgrounds"),rt=["complex","complicated","chaotic","clear"];for(let d of rt){let s=K[d];Ct.append("rect").attr("class","cynefinDomain").attr("x",s.x).attr("y",s.y).attr("width",s.w).attr("height",s.h).attr("fill",E[d]).attr("fill-opacity",0.4).attr("stroke","none")}let it=z.append("g").attr("class","cynefin-boundaries");it.append("path").attr("class","cynefinBoundary").attr("d",xt(c,m,ct,q)).attr("fill","none"),it.append("path").attr("class","cynefinBoundary").attr("d",$t(c,m,ct+100,q)).attr("fill","none"),it.append("path").attr("class","cynefinCliff").attr("d",bt(c,m)).attr("fill","none");let vt=c*0.15,Dt=m*0.15;z.append("path").attr("class","cynefinConfusion").attr("d",wt(c/2,m/2,vt,Dt)).attr("fill",E.confusion).attr("fill-opacity",0.5);let lt=z.append("g").attr("class","cynefin-labels");for(let d of rt){let s=K[d];lt.append("text").attr("class","cynefinDomainLabel").attr("x",s.cx).attr("y",x?s.cy-30:s.cy).attr("text-anchor","middle").attr("dominant-baseline","middle").text(d.charAt(0).toUpperCase()+d.slice(1))}if(lt.append("text").attr("class","cynefinDomainLabel").attr("x",c/2).attr("y",x?m/2-10:m/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text("Confusion"),x){let d=z.append("g").attr("class","cynefin-subtitles");for(let s of rt){let h=K[s],g=yt[s];d.append("text").attr("class","cynefinSubtitle").attr("x",h.cx).attr("y",h.cy-10).attr("text-anchor","middle").attr("dominant-baseline","middle").text(g.model),d.append("text").attr("class","cynefinSubtitle").attr("x",h.cx).attr("y",h.cy+5).attr("text-anchor","middle").attr("dominant-baseline","middle").text(g.practice)}d.append("text").attr("class","cynefinSubtitle").attr("x",c/2).attr("y",m/2+8).attr("text-anchor","middle").attr("dominant-baseline","middle").text(yt.confusion.practice)}let dt=z.append("g").attr("class","cynefin-items"),N=26,ft=10,kt=["complex","complicated","chaotic","clear","confusion"];for(let d of kt){let s=p.get(d);if(!s||s.items.length===0)continue;let h=K[d],g=d==="confusion",G=s.items,Y=0;if(g&&s.items.length>st)Y=s.items.length-st,G=s.items.slice(0,st);let W;if(g){let w=x?22:14;W=h.cy+w}else W=h.cy+(x?25:15);if([...G].forEach((w,F)=>{let D=W+F*(N+4),V=dt.append("g"),O=V.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",N/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(w.label),C=w.label.length*7,b=O.node();if(b&&typeof b.getBBox==="function"){let ot=b.getBBox();if(ot.width>0)C=ot.width}let k=C+ft*2,X=h.cx-k/2;V.attr("transform",`translate(${X}, ${D})`),V.insert("rect","text").attr("class","cynefinItem").attr("x",0).attr("y",0).attr("width",k).attr("height",N).attr("rx",4).attr("ry",4).attr("fill",E[d]).attr("fill-opacity",0.95),O.attr("x",k/2).attr("y",N/2)}),Y>0){let w=W+G.length*(N+4),F=`+${Y} more`,D=dt.append("g"),V=D.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",N/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(F),O=F.length*7,C=V.node();if(C&&typeof C.getBBox==="function"){let X=C.getBBox();if(X.width>0)O=X.width}let b=O+ft*2,k=h.cx-b/2;D.attr("transform",`translate(${k}, ${w})`),D.insert("rect","text").attr("class","cynefinItemOverflow").attr("x",0).attr("y",0).attr("width",b).attr("height",N).attr("rx",4).attr("ry",4).attr("fill",E[d]).attr("fill-opacity",0.6),V.attr("x",b/2).attr("y",N/2)}}if(nt.length>0){let d=B.select("defs").empty()?B.append("defs"):B.select("defs"),s=`cynefin-arrow-${n}`;d.append("marker").attr("id",s).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","cynefinArrowHead");let h=z.append("g").attr("class","cynefin-arrows");nt.forEach((g)=>{let G=K[g.from],Y=K[g.to];if(!G||!Y)return;if(g.from===g.to){r.warn(`Cynefin renderer: skipping self-loop on domain "${g.from}"`);return}let{cx:W,cy:w}=G,{cx:F,cy:D}=Y,V=(W+F)/2,O=(w+D)/2,C=F-W,b=D-w,k=Math.sqrt(C*C+b*b),X=k*0.15,ot=-b/k,Tt=C/k,mt=V+ot*X,pt=O+Tt*X;if(h.append("path").attr("class","cynefinArrowLine").attr("d",`M${W},${w} Q${mt},${pt} ${F},${D}`).attr("fill","none").attr("marker-end",`url(#${s})`),g.label)h.append("text").attr("class","cynefinArrowLabel").attr("x",mt).attr("y",pt-6).attr("text-anchor","middle").attr("dominant-baseline","auto").text(g.label)})}if(j)z.append("text").attr("class","cynefinTitle").attr("x",c/2).attr("y",-v/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text(j)},"draw"),Ft={draw:Rt},Vt=e(()=>{let t=He(),n=y();return Z(t,n.themeVariables).cynefin},"getCynefinTheme"),_t=e(()=>{let t=Vt();return`
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
	`},"styles"),Et=_t,Ut={parser:Pt,db:at,renderer:Ft,styles:Et};export{Ut as diagram};
