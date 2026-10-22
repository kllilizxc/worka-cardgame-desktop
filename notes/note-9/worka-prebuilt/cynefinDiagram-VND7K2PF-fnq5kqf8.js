import{Z}from"./entry-mcj0cczr.js";import{e,r,Ne,L,y,z,x,k,C,T,S,A,E,W,H}from"./entry-q62xrf2s.js";import{oe}from"./entry-1sjs52q7.js";var gt=e(()=>({domains:new Map,transitions:[]}),"createDefaultData"),nt=gt(),Bt=e(()=>nt.domains,"getDomains"),St=e(()=>nt.transitions,"getTransitions"),Mt=e((t)=>{if(!t)return;for(let n of t){let o=n.domain,a=(n.items??[]).map((l)=>({label:l.label}));nt.domains.set(o,{name:o,items:a})}},"setDomains"),zt=e((t)=>{if(!t)return;nt.transitions=t.filter((n)=>{if(n.from===n.to)return r.warn(`Cynefin: self-loop transition on domain "${n.from}" is not meaningful and will be skipped.`),!1;return!0}).map((n)=>({from:n.from,to:n.to,label:n.label||void 0}))},"setTransitions"),Lt=e(()=>H({...L.cynefin,...y().cynefin}),"getConfig"),Nt=e(()=>{x(),nt=gt()},"clear"),rt={getDomains:Bt,getTransitions:St,setDomains:Mt,setTransitions:zt,getConfig:Lt,clear:Nt,setAccTitle:k,getAccTitle:C,setDiagramTitle:A,getDiagramTitle:E,getAccDescription:S,setAccDescription:T},Pt=e((t)=>{Z(t,rt),rt.setDomains(t.domains),rt.setTransitions(t.transitions)},"populate"),It={parse:e(async(t)=>{let n=await oe("cynefin",t);r.debug(n),Pt(n)},"parse")};function et(t){let n=t+1831565813|0;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}e(et,"seededRandom");function ht(t){let n=0;for(let o=0;o<t.length;o++){let a=t.charCodeAt(o);n=(n<<5)-n+a,n|=0}return n}e(ht,"hashString");function xt(t,n){if(typeof t==="number"&&Number.isFinite(t)&&t!==0)return t;return ht(n)}e(xt,"resolveSeed");function $t(t,n,o,a){let l=t/2,p=a??t*0.015,ot=7,U=n/7,f=[];for(let i=0;i<=7;i++){let u=et(o+i*17)*p*2-p;f.push({x:l+u,y:i*U})}let P=`M${f[0].x},${f[0].y}`;for(let i=0;i<f.length-1;i++){let u=f[i],c=f[i+1],m=(u.y+c.y)/2,B=i%2===0?1:-1,b=p*1.5*B*et(o+i*31+7),Q=u.x+b,J=m,K=c.x-b;P+=` C${Q},${J} ${K},${m} ${c.x},${c.y}`}return P}e($t,"generateFoldPath");function bt(t,n,o,a){let l=n/2,p=a??n*0.015,ot=7,U=t/7,f=[];for(let i=0;i<=7;i++){let u=et(o+i*23)*p*2-p;f.push({x:i*U,y:l+u})}let P=`M${f[0].x},${f[0].y}`;for(let i=0;i<f.length-1;i++){let u=f[i],c=f[i+1],m=(u.x+c.x)/2,B=i%2===0?1:-1,b=p*1.5*B*et(o+i*37+11),Q=m,J=u.y+b,K=m,Y=c.y-b;P+=` C${Q},${J} ${K},${Y} ${c.x},${c.y}`}return P}e(bt,"generateHorizontalBoundary");function wt(t,n){let o=t/2,a=n*0.5,l=n,p=t*0.03;return[`M${o},${a}`,`C${o+p},${a+(l-a)*0.2}`,`${o-p*1.5},${a+(l-a)*0.55}`,`${o+p*0.5},${a+(l-a)*0.75}`,`C${o-p},${a+(l-a)*0.85}`,`${o+p*0.3},${a+(l-a)*0.95}`,`${o},${l}`].join(" ")}e(wt,"generateCliffPath");function Ct(t,n,o,a){return[`M${t-o},${n}`,`A${o},${a} 0 1,1 ${t+o},${n}`,`A${o},${a} 0 1,1 ${t-o},${n}`,"Z"].join(" ")}e(Ct,"generateConfusionPath");var ut={complex:{model:"Probe → Sense → Respond",practice:"Emergent Practices"},complicated:{model:"Sense → Analyse → Respond",practice:"Good Practices"},clear:{model:"Sense → Categorise → Respond",practice:"Best Practices"},chaotic:{model:"Act → Sense → Respond",practice:"Novel Practices"},confusion:{model:"",practice:"Disorder"}},Wt=e((t,n)=>{let o=t/2,a=n/2;return{complex:{cx:o/2,cy:a/2,x:0,y:0,w:o,h:a},complicated:{cx:o+o/2,cy:a/2,x:o,y:0,w:o,h:a},chaotic:{cx:o/2,cy:a+a/2,x:0,y:a,w:o,h:a},clear:{cx:o+o/2,cy:a+a/2,x:o,y:a,w:o,h:a},confusion:{cx:o,cy:a,x:o*0.7,y:a*0.7,w:o*0.6,h:a*0.6}}},"getDomainLayouts"),Rt=e(()=>{let t=Ne(),n=y();return H(t,n.themeVariables).cynefin},"getCynefinDomainColors"),ct=3,Ft=e((t,n,o,a)=>{let l=a.db,p=l.getDomains(),ot=l.getTransitions(),U=l.getDiagramTitle(),f=l.getAccTitle(),P=l.getAccDescription(),i=l.getConfig(),u=Rt();r.debug("Rendering Cynefin diagram");let{width:c,height:m,padding:B,showDomainDescriptions:b,boundaryAmplitude:Q}=i,J=c+B*2,K=m+B*2,Y={complex:u.complexBg,complicated:u.complicatedBg,clear:u.clearBg,chaotic:u.chaoticBg,confusion:u.confusionBg},I=W(n);if(z(I,K,J,i.useMaxWidth??!0),I.attr("viewBox",`0 0 ${J} ${K}`),f)I.append("title").text(f);if(P)I.append("desc").text(P);let R=I.append("g").attr("transform",`translate(${B}, ${B})`),tt=Wt(c,m),lt=xt(i.seed,n),vt=R.append("g").attr("class","cynefin-backgrounds"),it=["complex","complicated","chaotic","clear"];for(let d of it){let s=tt[d];vt.append("rect").attr("class","cynefinDomain").attr("x",s.x).attr("y",s.y).attr("width",s.w).attr("height",s.h).attr("fill",Y[d]).attr("fill-opacity",0.4).attr("stroke","none")}let st=R.append("g").attr("class","cynefin-boundaries");st.append("path").attr("class","cynefinBoundary").attr("d",$t(c,m,lt,Q)).attr("fill","none"),st.append("path").attr("class","cynefinBoundary").attr("d",bt(c,m,lt+100,Q)).attr("fill","none"),st.append("path").attr("class","cynefinCliff").attr("d",wt(c,m)).attr("fill","none");let Dt=c*0.15,kt=m*0.15;R.append("path").attr("class","cynefinConfusion").attr("d",Ct(c/2,m/2,Dt,kt)).attr("fill",Y.confusion).attr("fill-opacity",0.5);let dt=R.append("g").attr("class","cynefin-labels");for(let d of it){let s=tt[d];dt.append("text").attr("class","cynefinDomainLabel").attr("x",s.cx).attr("y",b?s.cy-30:s.cy).attr("text-anchor","middle").attr("dominant-baseline","middle").text(d.charAt(0).toUpperCase()+d.slice(1))}if(dt.append("text").attr("class","cynefinDomainLabel").attr("x",c/2).attr("y",b?m/2-10:m/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text("Confusion"),b){let d=R.append("g").attr("class","cynefin-subtitles");for(let s of it){let h=tt[s],g=ut[s];d.append("text").attr("class","cynefinSubtitle").attr("x",h.cx).attr("y",h.cy-10).attr("text-anchor","middle").attr("dominant-baseline","middle").text(g.model),d.append("text").attr("class","cynefinSubtitle").attr("x",h.cx).attr("y",h.cy+5).attr("text-anchor","middle").attr("dominant-baseline","middle").text(g.practice)}d.append("text").attr("class","cynefinSubtitle").attr("x",c/2).attr("y",m/2+8).attr("text-anchor","middle").attr("dominant-baseline","middle").text(ut.confusion.practice)}let ft=R.append("g").attr("class","cynefin-items"),F=26,mt=10,Tt=["complex","complicated","chaotic","clear","confusion"];for(let d of Tt){let s=p.get(d);if(!s||s.items.length===0)continue;let h=tt[d],g=d==="confusion",O=s.items,X=0;if(g&&s.items.length>ct)X=s.items.length-ct,O=s.items.slice(0,ct);let V;if(g){let v=b?22:14;V=h.cy+v}else V=h.cy+(b?25:15);if([...O].forEach((v,_)=>{let M=V+_*(F+4),G=ft.append("g"),j=G.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",F/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(v.label),D=v.label.length*7,w=j.node();if(w&&typeof w.getBBox==="function"){let at=w.getBBox();if(at.width>0)D=at.width}let N=D+mt*2,q=h.cx-N/2;G.attr("transform",`translate(${q}, ${M})`),G.insert("rect","text").attr("class","cynefinItem").attr("x",0).attr("y",0).attr("width",N).attr("height",F).attr("rx",4).attr("ry",4).attr("fill",Y[d]).attr("fill-opacity",0.95),j.attr("x",N/2).attr("y",F/2)}),X>0){let v=V+O.length*(F+4),_=`+${X} more`,M=ft.append("g"),G=M.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",F/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(_),j=_.length*7,D=G.node();if(D&&typeof D.getBBox==="function"){let q=D.getBBox();if(q.width>0)j=q.width}let w=j+mt*2,N=h.cx-w/2;M.attr("transform",`translate(${N}, ${v})`),M.insert("rect","text").attr("class","cynefinItemOverflow").attr("x",0).attr("y",0).attr("width",w).attr("height",F).attr("rx",4).attr("ry",4).attr("fill",Y[d]).attr("fill-opacity",0.6),G.attr("x",w/2).attr("y",F/2)}}if(ot.length>0){let d=I.select("defs").empty()?I.append("defs"):I.select("defs"),s=`cynefin-arrow-${n}`;d.append("marker").attr("id",s).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","cynefinArrowHead");let h=R.append("g").attr("class","cynefin-arrows");ot.forEach((g)=>{let O=tt[g.from],X=tt[g.to];if(!O||!X)return;if(g.from===g.to){r.warn(`Cynefin renderer: skipping self-loop on domain "${g.from}"`);return}let{cx:V,cy:v}=O,{cx:_,cy:M}=X,G=(V+_)/2,j=(v+M)/2,D=_-V,w=M-v,N=Math.sqrt(D*D+w*w),q=N*0.15,at=-w/N,At=D/N,pt=G+at*q,yt=j+At*q;if(h.append("path").attr("class","cynefinArrowLine").attr("d",`M${V},${v} Q${pt},${yt} ${_},${M}`).attr("fill","none").attr("marker-end",`url(#${s})`),g.label)h.append("text").attr("class","cynefinArrowLabel").attr("x",pt).attr("y",yt-6).attr("text-anchor","middle").attr("dominant-baseline","auto").text(g.label)})}if(U)R.append("text").attr("class","cynefinTitle").attr("x",c/2).attr("y",-B/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text(U)},"draw"),Vt={draw:Ft},_t=e(()=>{let t=Ne(),n=y();return H(t,n.themeVariables).cynefin},"getCynefinTheme"),Et=e(()=>{let t=_t();return`
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
	`},"styles"),Ht=Et,Qt={parser:It,db:rt,renderer:Vt,styles:Ht};export{Qt as diagram};
