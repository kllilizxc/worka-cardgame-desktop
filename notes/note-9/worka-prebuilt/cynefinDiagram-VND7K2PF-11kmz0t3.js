import{d as X0}from"./entry-0gc4ttty.js";import{f as R0}from"./entry-jqw0qfy9.js";import{g as E0}from"./entry-g01164ap.js";import"./entry-y1st9cqk.js";import"./entry-57z9q68s.js";import"./entry-ydnkt8e6.js";import"./entry-y6a5k1ba.js";import"./entry-x2898hey.js";import"./entry-mhz3jedm.js";import"./entry-yfrn9cd5.js";import"./entry-p3e53aym.js";import"./entry-z31183mv.js";import"./entry-wbqrwhwg.js";import"./entry-knwt3sgy.js";import"./entry-ka569avc.js";import"./entry-kvc1pn5d.js";import"./entry-0q77z30y.js";import"./entry-41ap9avs.js";import"./entry-c9gbeayk.js";import{Oe as d}from"./entry-r25rswdq.js";import"./entry-cbb8dzk2.js";import{If as Z0,Nf as J0,Of as V0,Pf as F0,Qf as B0,Rf as j0,Sf as P0,Tf as L0,if as i,kf as U0,vf as s}from"./entry-n67ezgch.js";import{ag as u}from"./entry-2d6vybcz.js";import{$g as U}from"./entry-6228z9nn.js";import"./entry-j27rn7mz.js";var I0=U(()=>({domains:new Map,transitions:[]}),"createDefaultData"),g=I0(),Y0=U(()=>g.domains,"getDomains"),C0=U(()=>g.transitions,"getTransitions"),D0=U(($)=>{if(!$)return;for(let Q of $){let q=Q.domain,z=(Q.items??[]).map((V)=>({label:V.label}));g.domains.set(q,{name:q,items:z})}},"setDomains"),w0=U(($)=>{if(!$)return;g.transitions=$.filter((Q)=>{if(Q.from===Q.to)return u.warn(`Cynefin: self-loop transition on domain "${Q.from}" is not meaningful and will be skipped.`),!1;return!0}).map((Q)=>({from:Q.from,to:Q.to,label:Q.label||void 0}))},"setTransitions"),_0=U(()=>{return d({...U0.cynefin,...s().cynefin})},"getConfig"),b0=U(()=>{J0(),g=I0()},"clear"),r={getDomains:Y0,getTransitions:C0,setDomains:D0,setTransitions:w0,getConfig:_0,clear:b0,setAccTitle:V0,getAccTitle:F0,setDiagramTitle:P0,getDiagramTitle:L0,getAccDescription:j0,setAccDescription:B0},x0=U(($)=>{X0($,r),r.setDomains($.domains),r.setTransitions($.transitions)},"populate"),f0={parse:U(async($)=>{let Q=await E0("cynefin",$);u.debug(Q),x0(Q)},"parse")};function l($){let Q=$+1831565813|0;return Q=Math.imul(Q^Q>>>15,Q|1),Q^=Q+Math.imul(Q^Q>>>7,Q|61),((Q^Q>>>14)>>>0)/4294967296}U(l,"seededRandom");function M0($){let Q=0;for(let q=0;q<$.length;q++){let z=$.charCodeAt(q);Q=(Q<<5)-Q+z,Q|=0}return Q}U(M0,"hashString");function k0($,Q){if(typeof $==="number"&&Number.isFinite($)&&$!==0)return $;return M0(Q)}U(k0,"resolveSeed");function G0($,Q,q,z){let V=$/2,P=z??$*0.015,h=7,x=Q/7,B=[];for(let K=0;K<=7;K++){let L=l(q+K*17)*P*2-P;B.push({x:V+L,y:K*x})}let W=`M${B[0].x},${B[0].y}`;for(let K=0;K<B.length-1;K++){let L=B[K],J=B[K+1],j=(L.y+J.y)/2,G=K%2===0?1:-1,E=P*1.5*G*l(q+K*31+7),f=L.x+E,y=j,p=J.x-E;W+=` C${f},${y} ${p},${j} ${J.x},${J.y}`}return W}U(G0,"generateFoldPath");function H0($,Q,q,z){let V=Q/2,P=z??Q*0.015,h=7,x=$/7,B=[];for(let K=0;K<=7;K++){let L=l(q+K*23)*P*2-P;B.push({x:K*x,y:V+L})}let W=`M${B[0].x},${B[0].y}`;for(let K=0;K<B.length-1;K++){let L=B[K],J=B[K+1],j=(L.x+J.x)/2,G=K%2===0?1:-1,E=P*1.5*G*l(q+K*37+11),f=j,y=L.y+E,p=j,C=J.y-E;W+=` C${f},${y} ${p},${C} ${J.x},${J.y}`}return W}U(H0,"generateHorizontalBoundary");function O0($,Q){let q=$/2,z=Q*0.5,V=Q,P=$*0.03;return[`M${q},${z}`,`C${q+P},${z+(V-z)*0.2}`,`${q-P*1.5},${z+(V-z)*0.55}`,`${q+P*0.5},${z+(V-z)*0.75}`,`C${q-P},${z+(V-z)*0.85}`,`${q+P*0.3},${z+(V-z)*0.95}`,`${q},${V}`].join(" ")}U(O0,"generateCliffPath");function W0($,Q,q,z){return[`M${$-q},${Q}`,`A${q},${z} 0 1,1 ${$+q},${Q}`,`A${q},${z} 0 1,1 ${$-q},${Q}`,"Z"].join(" ")}U(W0,"generateConfusionPath");var K0={complex:{model:"Probe → Sense → Respond",practice:"Emergent Practices"},complicated:{model:"Sense → Analyse → Respond",practice:"Good Practices"},clear:{model:"Sense → Categorise → Respond",practice:"Best Practices"},chaotic:{model:"Act → Sense → Respond",practice:"Novel Practices"},confusion:{model:"",practice:"Disorder"}},y0=U(($,Q)=>{let q=$/2,z=Q/2;return{complex:{cx:q/2,cy:z/2,x:0,y:0,w:q,h:z},complicated:{cx:q+q/2,cy:z/2,x:q,y:0,w:q,h:z},chaotic:{cx:q/2,cy:z+z/2,x:0,y:z,w:q,h:z},clear:{cx:q+q/2,cy:z+z/2,x:q,y:z,w:q,h:z},confusion:{cx:q,cy:z,x:q*0.7,y:z*0.7,w:q*0.6,h:z*0.6}}},"getDomainLayouts"),p0=U(()=>{let $=i(),Q=s();return d($,Q.themeVariables).cynefin},"getCynefinDomainColors"),o=3,c0=U(($,Q,q,z)=>{let V=z.db,P=V.getDomains(),h=V.getTransitions(),x=V.getDiagramTitle(),B=V.getAccTitle(),W=V.getAccDescription(),K=V.getConfig(),L=p0();u.debug("Rendering Cynefin diagram");let{width:J,height:j,padding:G,showDomainDescriptions:E,boundaryAmplitude:f}=K,y=J+G*2,p=j+G*2,C={complex:L.complexBg,complicated:L.complicatedBg,clear:L.clearBg,chaotic:L.chaoticBg,confusion:L.confusionBg},A=R0(Q);if(Z0(A,p,y,K.useMaxWidth??!0),A.attr("viewBox",`0 0 ${y} ${p}`),B)A.append("title").text(B);if(W)A.append("desc").text(W);let T=A.append("g").attr("transform",`translate(${G}, ${G})`),c=y0(J,j),e=k0(K.seed,Q),A0=T.append("g").attr("class","cynefin-backgrounds"),n=["complex","complicated","chaotic","clear"];for(let F of n){let Z=c[F];A0.append("rect").attr("class","cynefinDomain").attr("x",Z.x).attr("y",Z.y).attr("width",Z.w).attr("height",Z.h).attr("fill",C[F]).attr("fill-opacity",0.4).attr("stroke","none")}let a=T.append("g").attr("class","cynefin-boundaries");a.append("path").attr("class","cynefinBoundary").attr("d",G0(J,j,e,f)).attr("fill","none"),a.append("path").attr("class","cynefinBoundary").attr("d",H0(J,j,e+100,f)).attr("fill","none"),a.append("path").attr("class","cynefinCliff").attr("d",O0(J,j)).attr("fill","none");let T0=J*0.15,v0=j*0.15;T.append("path").attr("class","cynefinConfusion").attr("d",W0(J/2,j/2,T0,v0)).attr("fill",C.confusion).attr("fill-opacity",0.5);let t=T.append("g").attr("class","cynefin-labels");for(let F of n){let Z=c[F];t.append("text").attr("class","cynefinDomainLabel").attr("x",Z.cx).attr("y",E?Z.cy-30:Z.cy).attr("text-anchor","middle").attr("dominant-baseline","middle").text(F.charAt(0).toUpperCase()+F.slice(1))}if(t.append("text").attr("class","cynefinDomainLabel").attr("x",J/2).attr("y",E?j/2-10:j/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text("Confusion"),E){let F=T.append("g").attr("class","cynefin-subtitles");for(let Z of n){let X=c[Z],R=K0[Z];F.append("text").attr("class","cynefinSubtitle").attr("x",X.cx).attr("y",X.cy-10).attr("text-anchor","middle").attr("dominant-baseline","middle").text(R.model),F.append("text").attr("class","cynefinSubtitle").attr("x",X.cx).attr("y",X.cy+5).attr("text-anchor","middle").attr("dominant-baseline","middle").text(R.practice)}F.append("text").attr("class","cynefinSubtitle").attr("x",J/2).attr("y",j/2+8).attr("text-anchor","middle").attr("dominant-baseline","middle").text(K0.confusion.practice)}let $0=T.append("g").attr("class","cynefin-items"),v=26,Q0=10,S0=["complex","complicated","chaotic","clear","confusion"];for(let F of S0){let Z=P.get(F);if(!Z||Z.items.length===0)continue;let X=c[F],R=F==="confusion",D=Z.items,w=0;if(R&&Z.items.length>o)w=Z.items.length-o,D=Z.items.slice(0,o);let S;if(R){let M=E?22:14;S=X.cy+M}else S=X.cy+(E?25:15);if([...D].forEach((M,N)=>{let H=S+N*(v+4),Y=$0.append("g"),_=Y.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",v/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(M.label),k=M.label.length*7,I=_.node();if(I&&typeof I.getBBox==="function"){let m=I.getBBox();if(m.width>0)k=m.width}let O=k+Q0*2,b=X.cx-O/2;Y.attr("transform",`translate(${b}, ${H})`),Y.insert("rect","text").attr("class","cynefinItem").attr("x",0).attr("y",0).attr("width",O).attr("height",v).attr("rx",4).attr("ry",4).attr("fill",C[F]).attr("fill-opacity",0.95),_.attr("x",O/2).attr("y",v/2)}),w>0){let M=S+D.length*(v+4),N=`+${w} more`,H=$0.append("g"),Y=H.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",v/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(N),_=N.length*7,k=Y.node();if(k&&typeof k.getBBox==="function"){let b=k.getBBox();if(b.width>0)_=b.width}let I=_+Q0*2,O=X.cx-I/2;H.attr("transform",`translate(${O}, ${M})`),H.insert("rect","text").attr("class","cynefinItemOverflow").attr("x",0).attr("y",0).attr("width",I).attr("height",v).attr("rx",4).attr("ry",4).attr("fill",C[F]).attr("fill-opacity",0.6),Y.attr("x",I/2).attr("y",v/2)}}if(h.length>0){let F=A.select("defs").empty()?A.append("defs"):A.select("defs"),Z=`cynefin-arrow-${Q}`;F.append("marker").attr("id",Z).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","cynefinArrowHead");let X=T.append("g").attr("class","cynefin-arrows");h.forEach((R)=>{let D=c[R.from],w=c[R.to];if(!D||!w)return;if(R.from===R.to){u.warn(`Cynefin renderer: skipping self-loop on domain "${R.from}"`);return}let{cx:S,cy:M}=D,N=w.cx,H=w.cy,Y=(S+N)/2,_=(M+H)/2,k=N-S,I=H-M,O=Math.sqrt(k*k+I*I),b=O*0.15,m=-I/O,N0=k/O,q0=Y+m*b,z0=_+N0*b;if(X.append("path").attr("class","cynefinArrowLine").attr("d",`M${S},${M} Q${q0},${z0} ${N},${H}`).attr("fill","none").attr("marker-end",`url(#${Z})`),R.label)X.append("text").attr("class","cynefinArrowLabel").attr("x",q0).attr("y",z0-6).attr("text-anchor","middle").attr("dominant-baseline","auto").text(R.label)})}if(x)T.append("text").attr("class","cynefinTitle").attr("x",J/2).attr("y",-G/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text(x)},"draw"),u0={draw:c0},l0=U(()=>{let $=i(),Q=s();return d($,Q.themeVariables).cynefin},"getCynefinTheme"),g0=U(()=>{let $=l0();return`
	.cynefinDomain {
		stroke: none;
	}
	.cynefinDomainLabel {
		font-size: ${$.domainFontSize}px;
		font-weight: bold;
		fill: ${$.labelColor};
	}
	.cynefinSubtitle {
		font-size: ${$.itemFontSize-1}px;
		fill: ${$.textColor};
		font-style: italic;
	}
	.cynefinItem {
		fill-opacity: 0.95;
		stroke: ${$.boundaryColor};
		stroke-width: 1;
	}
	.cynefinItemText {
		font-size: ${$.itemFontSize}px;
		fill: ${$.textColor};
	}
	.cynefinItemOverflow {
		fill-opacity: 0.6;
		stroke: ${$.boundaryColor};
		stroke-width: 1;
		stroke-dasharray: 3 2;
	}
	.cynefinBoundary {
		stroke: ${$.boundaryColor};
		stroke-width: ${$.boundaryWidth};
		stroke-dasharray: 6 3;
	}
	.cynefinCliff {
		stroke: ${$.cliffColor};
		stroke-width: ${$.cliffWidth};
	}
	.cynefinConfusion {
		stroke: ${$.boundaryColor};
		stroke-width: 1.5;
		stroke-dasharray: 4 2;
	}
	.cynefinArrowLine {
		stroke: ${$.arrowColor};
		stroke-width: ${$.arrowWidth};
		fill: none;
	}
	.cynefinArrowHead {
		fill: ${$.arrowColor};
		stroke: none;
	}
	.cynefinArrowLabel {
		font-size: ${$.itemFontSize-1}px;
		fill: ${$.textColor};
	}
	.cynefinTitle {
		font-size: ${$.domainFontSize+2}px;
		font-weight: bold;
		fill: ${$.labelColor};
	}
	`},"styles"),h0=g0,i0={parser:f0,db:r,renderer:u0,styles:h0};export{i0 as diagram};
