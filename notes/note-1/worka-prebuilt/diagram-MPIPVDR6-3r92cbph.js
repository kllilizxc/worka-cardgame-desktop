import{ne}from"./entry-9msgvsxp.js";import{e,r,je,P,y,H,S,A,R,_,L,M,I,Z,X}from"./entry-g9ybjgzx.js";import{fe}from"./entry-145v886k.js";var h={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},b=32,T={axes:[],curves:[],options:h},x=structuredClone(T),B=P.radar,W=e(()=>X({...B,...y().radar}),"getConfig"),k=e(()=>x.axes,"getAxes"),V=e(()=>x.curves,"getCurves"),j=e(()=>x.options,"getOptions"),U=e((n)=>{x.axes=n.map((t)=>({name:t.name,label:t.label??t.name}))},"setAxes"),K=e((n)=>{x.curves=n.map((t)=>({name:t.name,label:t.label??t.name,entries:N(t.entries)}))},"setCurves"),N=e((n)=>{if(n[0].axis==null)return n.map((a)=>a.value);let t=k();if(t.length===0)throw Error("Axes must be populated before curves for reference entries");return t.map((a)=>{let s=n.find((o)=>o.axis?.$refText===a.name);if(s===void 0)throw Error("Missing entry for axis "+a.label);return s.value})},"computeCurveEntries"),Y=e((n)=>{let t=n.reduce((a,s)=>(a[s.name]=s,a),{});if(x.options={showLegend:t.showLegend?.value??h.showLegend,ticks:t.ticks?.value??h.ticks,max:t.max?.value??h.max,min:t.min?.value??h.min,graticule:t.graticule?.value??h.graticule},x.options.ticks>b)r.warn(`Radar diagram ticks (${x.options.ticks}) exceeds maximum allowed (${b}). Using ${b} instead.`),x.options.ticks=b},"setOptions"),q=e(()=>{S(),x=structuredClone(T)},"clear"),w={getAxes:k,getCurves:V,getOptions:j,setAxes:U,setCurves:K,setOptions:Y,getConfig:W,clear:q,setAccTitle:A,getAccTitle:R,setDiagramTitle:M,getDiagramTitle:I,getAccDescription:L,setAccDescription:_},J=e((n)=>{ne(n,w);let{axes:t,curves:a,options:s}=n;w.setAxes(t),w.setCurves(a),w.setOptions(s)},"populate"),Q={parse:e(async(n)=>{let t=await fe("radar",n);r.debug(t),J(t)},"parse")},tt=e((n,t,a,s)=>{let o=s.db,c=o.getAxes(),d=o.getCurves(),i=o.getOptions(),l=o.getConfig(),u=o.getDiagramTitle(),m=Z(t),p=et(m,l),g=i.max??Math.max(...d.map((C)=>Math.max(...C.entries))),v=i.min,f=Math.min(l.width,l.height)/2;at(p,c,f,i.ticks,i.graticule),rt(p,c,f,l),O(p,c,d,v,g,i.graticule,l),D(p,d,i.showLegend,l),p.append("text").attr("class","radarTitle").text(u).attr("x",0).attr("y",-l.height/2-l.marginTop)},"draw"),et=e((n,t)=>{let a=t.width+t.marginLeft+t.marginRight,s=t.height+t.marginTop+t.marginBottom,o={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return H(n,s,a,t.useMaxWidth??!0),n.attr("viewBox",`0 0 ${a} ${s}`).attr("overflow","visible"),n.append("g").attr("transform",`translate(${o.x}, ${o.y})`)},"drawFrame"),at=e((n,t,a,s,o)=>{if(o==="circle")for(let c=0;c<s;c++){let d=a*(c+1)/s;n.append("circle").attr("r",d).attr("class","radarGraticule")}else if(o==="polygon"){let c=t.length;for(let d=0;d<s;d++){let i=a*(d+1)/s,l=t.map((u,m)=>{let p=2*m*Math.PI/c-Math.PI/2,g=i*Math.cos(p),v=i*Math.sin(p);return`${g},${v}`}).join(" ");n.append("polygon").attr("points",l).attr("class","radarGraticule")}}},"drawGraticule"),rt=e((n,t,a,s)=>{let o=t.length;for(let c=0;c<o;c++){let d=t[c].label,i=2*c*Math.PI/o-Math.PI/2,l=Math.cos(i),u=Math.sin(i);n.append("line").attr("x1",0).attr("y1",0).attr("x2",a*s.axisScaleFactor*l).attr("y2",a*s.axisScaleFactor*u).attr("class","radarAxisLine");let m=l>0.01?"start":l<-0.01?"end":"middle",p=u>0.01?"hanging":u<-0.01?"auto":"central",g=4;n.append("text").text(d).attr("x",a*s.axisLabelFactor*l+g*l).attr("y",a*s.axisLabelFactor*u+g*u).attr("text-anchor",m).attr("dominant-baseline",p).attr("class","radarAxisLabel")}},"drawAxes");function O(n,t,a,s,o,c,d){let i=t.length,l=Math.min(d.width,d.height)/2;a.forEach((u,m)=>{if(u.entries.length!==i)return;let p=u.entries.map((g,v)=>{let f=2*Math.PI*v/i-Math.PI/2,C=E(g,s,o,l),z=C*Math.cos(f),G=C*Math.sin(f);return{x:z,y:G}});if(c==="circle")n.append("path").attr("d",F(p,d.curveTension)).attr("class",`radarCurve-${m}`);else if(c==="polygon")n.append("polygon").attr("points",p.map((g)=>`${g.x},${g.y}`).join(" ")).attr("class",`radarCurve-${m}`)})}e(O,"drawCurves");function E(n,t,a,s){let o=Math.min(Math.max(n,t),a);return s*(o-t)/(a-t)}e(E,"relativeRadius");function F(n,t){let a=n.length,s=`M${n[0].x},${n[0].y}`;for(let o=0;o<a;o++){let c=n[(o-1+a)%a],d=n[o],i=n[(o+1)%a],l=n[(o+2)%a],u={x:d.x+(i.x-c.x)*t,y:d.y+(i.y-c.y)*t},m={x:i.x-(l.x-d.x)*t,y:i.y-(l.y-d.y)*t};s+=` C${u.x},${u.y} ${m.x},${m.y} ${i.x},${i.y}`}return`${s} Z`}e(F,"closedRoundCurve");function D(n,t,a,s){if(!a)return;let o=(s.width/2+s.marginRight)*3/4,c=-(s.height/2+s.marginTop)*3/4,d=20;t.forEach((i,l)=>{let u=n.append("g").attr("transform",`translate(${o}, ${c+l*d})`);u.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${l}`),u.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(i.label)})}e(D,"drawLegend");var nt={draw:tt},st=e((n,t)=>{let a="";for(let s=0;s<n.THEME_COLOR_LIMIT;s++){let o=n[`cScale${s}`];a+=`
		.radarCurve-${s} {
			color: ${o};
			fill: ${o};
			fill-opacity: ${t.curveOpacity};
			stroke: ${o};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${s} {
			fill: ${o};
			fill-opacity: ${t.curveOpacity};
			stroke: ${o};
		}
		`}return a},"genIndexStyles"),ot=e((n)=>{let t=je(),a=y(),s=X(t,a.themeVariables),o=X(s.radar,n);return{themeVariables:s,radarOptions:o}},"buildRadarStyleOptions"),it=e(({radar:n}={})=>{let{themeVariables:t,radarOptions:a}=ot(n);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${a.axisColor};
		stroke-width: ${a.axisStrokeWidth};
	}
	.radarAxisLabel {
		font-size: ${a.axisLabelFontSize}px;
		color: ${a.axisColor};
	}
	.radarGraticule {
		fill: ${a.graticuleColor};
		fill-opacity: ${a.graticuleOpacity};
		stroke: ${a.graticuleColor};
		stroke-width: ${a.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${a.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${st(t,a)}
	`},"styles"),xt={parser:Q,db:w,renderer:nt,styles:it};export{xt as diagram};
