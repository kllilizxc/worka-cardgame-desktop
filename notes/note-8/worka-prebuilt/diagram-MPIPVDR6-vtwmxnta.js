import{e as v}from"./entry-z0hd46n2.js";import{f as A}from"./entry-tg591dep.js";import{g as _}from"./entry-repqhmfy.js";import"./entry-4c2axy96.js";import"./entry-an845mmb.js";import"./entry-zwp5mpbr.js";import"./entry-qfkap0t1.js";import"./entry-tpwze22z.js";import"./entry-33aec2h8.js";import"./entry-1wt3te41.js";import"./entry-x521f2q2.js";import"./entry-d3ngv03f.js";import"./entry-88qc9nyb.js";import"./entry-2w1r5g19.js";import"./entry-8kscn94e.js";import"./entry-pcrv5ked.js";import"./entry-ktm23d7a.js";import"./entry-4dpyffe1.js";import"./entry-2nwef42g.js";import{od as D}from"./entry-tg2g1jp0.js";import"./entry-dq81ephj.js";import{Kd as S,Md as T,Xd as R,ie as M,ne as y,oe as k,pe as h,qe as b,re as C,se as O,te as V}from"./entry-w263c3eq.js";import{De as w}from"./entry-csmcz0zk.js";import{Cf as Z}from"./entry-2e1h0a6c.js";import"./entry-f9xsqzhp.js";var L={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},j=32,x={axes:[],curves:[],options:L},Y=structuredClone(x),c=T.radar,r=Z(()=>{return D({...c,...R().radar})},"getConfig"),f=Z(()=>Y.axes,"getAxes"),o=Z(()=>Y.curves,"getCurves"),t=Z(()=>Y.options,"getOptions"),s=Z((z)=>{Y.axes=z.map((q)=>{return{name:q.name,label:q.label??q.name}})},"setAxes"),n=Z((z)=>{Y.curves=z.map((q)=>{return{name:q.name,label:q.label??q.name,entries:a(q.entries)}})},"setCurves"),a=Z((z)=>{if(z[0].axis==null)return z.map(($)=>$.value);let q=f();if(q.length===0)throw Error("Axes must be populated before curves for reference entries");return q.map(($)=>{let N=z.find((U)=>U.axis?.$refText===$.name);if(N===void 0)throw Error("Missing entry for axis "+$.label);return N.value})},"computeCurveEntries"),i=Z((z)=>{let q=z.reduce(($,N)=>{return $[N.name]=N,$},{});if(Y.options={showLegend:q.showLegend?.value??L.showLegend,ticks:q.ticks?.value??L.ticks,max:q.max?.value??L.max,min:q.min?.value??L.min,graticule:q.graticule?.value??L.graticule},Y.options.ticks>j)w.warn(`Radar diagram ticks (${Y.options.ticks}) exceeds maximum allowed (${j}). Using ${j} instead.`),Y.options.ticks=j},"setOptions"),e=Z(()=>{y(),Y=structuredClone(x)},"clear"),I={getAxes:f,getCurves:o,getOptions:t,setAxes:s,setCurves:n,setOptions:i,getConfig:r,clear:e,setAccTitle:k,getAccTitle:h,setDiagramTitle:O,getDiagramTitle:V,getAccDescription:C,setAccDescription:b},qq=Z((z)=>{v(z,I);let{axes:q,curves:$,options:N}=z;I.setAxes(q),I.setCurves($),I.setOptions(N)},"populate"),$q={parse:Z(async(z)=>{let q=await _("radar",z);w.debug(q),qq(q)},"parse")},zq=Z((z,q,$,N)=>{let U=N.db,F=U.getAxes(),H=U.getCurves(),B=U.getOptions(),Q=U.getConfig(),W=U.getDiagramTitle(),G=A(q),E=Nq(G,Q),J=B.max??Math.max(...H.map((P)=>Math.max(...P.entries))),K=B.min,X=Math.min(Q.width,Q.height)/2;Uq(E,F,X,B.ticks,B.graticule),Bq(E,F,X,Q),m(E,F,H,K,J,B.graticule,Q),u(E,H,B.showLegend,Q),E.append("text").attr("class","radarTitle").text(W).attr("x",0).attr("y",-Q.height/2-Q.marginTop)},"draw"),Nq=Z((z,q)=>{let $=q.width+q.marginLeft+q.marginRight,N=q.height+q.marginTop+q.marginBottom,U={x:q.marginLeft+q.width/2,y:q.marginTop+q.height/2};return M(z,N,$,q.useMaxWidth??!0),z.attr("viewBox",`0 0 ${$} ${N}`).attr("overflow","visible"),z.append("g").attr("transform",`translate(${U.x}, ${U.y})`)},"drawFrame"),Uq=Z((z,q,$,N,U)=>{if(U==="circle")for(let F=0;F<N;F++){let H=$*(F+1)/N;z.append("circle").attr("r",H).attr("class","radarGraticule")}else if(U==="polygon"){let F=q.length;for(let H=0;H<N;H++){let B=$*(H+1)/N,Q=q.map((W,G)=>{let E=2*G*Math.PI/F-Math.PI/2,J=B*Math.cos(E),K=B*Math.sin(E);return`${J},${K}`}).join(" ");z.append("polygon").attr("points",Q).attr("class","radarGraticule")}}},"drawGraticule"),Bq=Z((z,q,$,N)=>{let U=q.length;for(let F=0;F<U;F++){let H=q[F].label,B=2*F*Math.PI/U-Math.PI/2,Q=Math.cos(B),W=Math.sin(B);z.append("line").attr("x1",0).attr("y1",0).attr("x2",$*N.axisScaleFactor*Q).attr("y2",$*N.axisScaleFactor*W).attr("class","radarAxisLine");let G=Q>0.01?"start":Q<-0.01?"end":"middle",E=W>0.01?"hanging":W<-0.01?"auto":"central",J=4;z.append("text").text(H).attr("x",$*N.axisLabelFactor*Q+J*Q).attr("y",$*N.axisLabelFactor*W+J*W).attr("text-anchor",G).attr("dominant-baseline",E).attr("class","radarAxisLabel")}},"drawAxes");function m(z,q,$,N,U,F,H){let B=q.length,Q=Math.min(H.width,H.height)/2;$.forEach((W,G)=>{if(W.entries.length!==B)return;let E=W.entries.map((J,K)=>{let X=2*Math.PI*K/B-Math.PI/2,P=l(J,N,U,Q),d=P*Math.cos(X),g=P*Math.sin(X);return{x:d,y:g}});if(F==="circle")z.append("path").attr("d",p(E,H.curveTension)).attr("class",`radarCurve-${G}`);else if(F==="polygon")z.append("polygon").attr("points",E.map((J)=>`${J.x},${J.y}`).join(" ")).attr("class",`radarCurve-${G}`)})}Z(m,"drawCurves");function l(z,q,$,N){let U=Math.min(Math.max(z,q),$);return N*(U-q)/($-q)}Z(l,"relativeRadius");function p(z,q){let $=z.length,N=`M${z[0].x},${z[0].y}`;for(let U=0;U<$;U++){let F=z[(U-1+$)%$],H=z[U],B=z[(U+1)%$],Q=z[(U+2)%$],W={x:H.x+(B.x-F.x)*q,y:H.y+(B.y-F.y)*q},G={x:B.x-(Q.x-H.x)*q,y:B.y-(Q.y-H.y)*q};N+=` C${W.x},${W.y} ${G.x},${G.y} ${B.x},${B.y}`}return`${N} Z`}Z(p,"closedRoundCurve");function u(z,q,$,N){if(!$)return;let U=(N.width/2+N.marginRight)*3/4,F=-(N.height/2+N.marginTop)*3/4,H=20;q.forEach((B,Q)=>{let W=z.append("g").attr("transform",`translate(${U}, ${F+Q*H})`);W.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${Q}`),W.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(B.label)})}Z(u,"drawLegend");var Qq={draw:zq},Zq=Z((z,q)=>{let $="";for(let N=0;N<z.THEME_COLOR_LIMIT;N++){let U=z[`cScale${N}`];$+=`
		.radarCurve-${N} {
			color: ${U};
			fill: ${U};
			fill-opacity: ${q.curveOpacity};
			stroke: ${U};
			stroke-width: ${q.curveStrokeWidth};
		}
		.radarLegendBox-${N} {
			fill: ${U};
			fill-opacity: ${q.curveOpacity};
			stroke: ${U};
		}
		`}return $},"genIndexStyles"),Fq=Z((z)=>{let q=S(),$=R(),N=D(q,$.themeVariables),U=D(N.radar,z);return{themeVariables:N,radarOptions:U}},"buildRadarStyleOptions"),Hq=Z(({radar:z}={})=>{let{themeVariables:q,radarOptions:$}=Fq(z);return`
	.radarTitle {
		font-size: ${q.fontSize};
		color: ${q.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${$.axisColor};
		stroke-width: ${$.axisStrokeWidth};
	}
	.radarAxisLabel {
		font-size: ${$.axisLabelFontSize}px;
		color: ${$.axisColor};
	}
	.radarGraticule {
		fill: ${$.graticuleColor};
		fill-opacity: ${$.graticuleOpacity};
		stroke: ${$.graticuleColor};
		stroke-width: ${$.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${$.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${Zq(q,$)}
	`},"styles"),Xq={parser:$q,db:I,renderer:Qq,styles:Hq};export{Xq as diagram};
