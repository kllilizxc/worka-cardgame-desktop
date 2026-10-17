import{U}from"./entry-qgmpeywp.js";import{e,r,ge,_,p,N,b,v,x,w,k,C,T,z,F}from"./entry-xgcbp131.js";import{W}from"./entry-r3cdv4sz.js";var y={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},O=32,R={axes:[],curves:[],options:y},f=structuredClone(R),H=_.radar,j=e(()=>F({...H,...p().radar}),"getConfig"),I=e(()=>f.axes,"getAxes"),X=e(()=>f.curves,"getCurves"),K=e(()=>f.options,"getOptions"),Y=e((n)=>{f.axes=n.map((t)=>({name:t.name,label:t.label??t.name}))},"setAxes"),Z=e((n)=>{f.curves=n.map((t)=>({name:t.name,label:t.label??t.name,entries:q(t.entries)}))},"setCurves"),q=e((n)=>{if(n[0].axis==null)return n.map((a)=>a.value);let t=I();if(t.length===0)throw Error("Axes must be populated before curves for reference entries");return t.map((a)=>{let s=n.find((o)=>o.axis?.$refText===a.name);if(s===void 0)throw Error("Missing entry for axis "+a.label);return s.value})},"computeCurveEntries"),J=e((n)=>{let t=n.reduce((a,s)=>(a[s.name]=s,a),{});if(f.options={showLegend:t.showLegend?.value??y.showLegend,ticks:t.ticks?.value??y.ticks,max:t.max?.value??y.max,min:t.min?.value??y.min,graticule:t.graticule?.value??y.graticule},f.options.ticks>O)r.warn(`Radar diagram ticks (${f.options.ticks}) exceeds maximum allowed (${O}). Using ${O} instead.`),f.options.ticks=O},"setOptions"),Q=e(()=>{b(),f=structuredClone(R)},"clear"),L={getAxes:I,getCurves:X,getOptions:K,setAxes:Y,setCurves:Z,setOptions:J,getConfig:j,clear:Q,setAccTitle:v,getAccTitle:x,setDiagramTitle:C,getDiagramTitle:T,getAccDescription:k,setAccDescription:w},tt=e((n)=>{U(n,L);let{axes:t,curves:a,options:s}=n;L.setAxes(t),L.setCurves(a),L.setOptions(s)},"populate"),et={parse:e(async(n)=>{let t=await W("radar",n);r.debug(t),tt(t)},"parse")},at=e((n,t,a,s)=>{let o=s.db,c=o.getAxes(),d=o.getCurves(),i=o.getOptions(),l=o.getConfig(),u=o.getDiagramTitle(),g=z(t),m=rt(g,l),h=i.max??Math.max(...d.map((S)=>Math.max(...S.entries))),A=i.min,M=Math.min(l.width,l.height)/2;nt(m,c,M,i.ticks,i.graticule),st(m,c,M,l),E(m,c,d,A,h,i.graticule,l),G(m,d,i.showLegend,l),m.append("text").attr("class","radarTitle").text(u).attr("x",0).attr("y",-l.height/2-l.marginTop)},"draw"),rt=e((n,t)=>{let a=t.width+t.marginLeft+t.marginRight,s=t.height+t.marginTop+t.marginBottom,o={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return N(n,s,a,t.useMaxWidth??!0),n.attr("viewBox",`0 0 ${a} ${s}`).attr("overflow","visible"),n.append("g").attr("transform",`translate(${o.x}, ${o.y})`)},"drawFrame"),nt=e((n,t,a,s,o)=>{if(o==="circle")for(let c=0;c<s;c++){let d=a*(c+1)/s;n.append("circle").attr("r",d).attr("class","radarGraticule")}else if(o==="polygon"){let c=t.length;for(let d=0;d<s;d++){let i=a*(d+1)/s,l=t.map((u,g)=>{let m=2*g*Math.PI/c-Math.PI/2,h=i*Math.cos(m),A=i*Math.sin(m);return`${h},${A}`}).join(" ");n.append("polygon").attr("points",l).attr("class","radarGraticule")}}},"drawGraticule"),st=e((n,t,a,s)=>{let o=t.length;for(let c=0;c<o;c++){let d=t[c].label,i=2*c*Math.PI/o-Math.PI/2,l=Math.cos(i),u=Math.sin(i);n.append("line").attr("x1",0).attr("y1",0).attr("x2",a*s.axisScaleFactor*l).attr("y2",a*s.axisScaleFactor*u).attr("class","radarAxisLine");let g=l>0.01?"start":l<-0.01?"end":"middle",m=u>0.01?"hanging":u<-0.01?"auto":"central",h=4;n.append("text").text(d).attr("x",a*s.axisLabelFactor*l+h*l).attr("y",a*s.axisLabelFactor*u+h*u).attr("text-anchor",g).attr("dominant-baseline",m).attr("class","radarAxisLabel")}},"drawAxes");function E(n,t,a,s,o,c,d){let i=t.length,l=Math.min(d.width,d.height)/2;a.forEach((u,g)=>{if(u.entries.length!==i)return;let m=u.entries.map((h,A)=>{let M=2*Math.PI*A/i-Math.PI/2,S=D(h,s,o,l),B=S*Math.cos(M),V=S*Math.sin(M);return{x:B,y:V}});if(c==="circle")n.append("path").attr("d",P(m,d.curveTension)).attr("class",`radarCurve-${g}`);else if(c==="polygon")n.append("polygon").attr("points",m.map((h)=>`${h.x},${h.y}`).join(" ")).attr("class",`radarCurve-${g}`)})}e(E,"drawCurves");function D(n,t,a,s){let o=Math.min(Math.max(n,t),a);return s*(o-t)/(a-t)}e(D,"relativeRadius");function P(n,t){let a=n.length,s=`M${n[0].x},${n[0].y}`;for(let o=0;o<a;o++){let c=n[(o-1+a)%a],d=n[o],i=n[(o+1)%a],l=n[(o+2)%a],u={x:d.x+(i.x-c.x)*t,y:d.y+(i.y-c.y)*t},g={x:i.x-(l.x-d.x)*t,y:i.y-(l.y-d.y)*t};s+=` C${u.x},${u.y} ${g.x},${g.y} ${i.x},${i.y}`}return`${s} Z`}e(P,"closedRoundCurve");function G(n,t,a,s){if(!a)return;let o=(s.width/2+s.marginRight)*3/4,c=-(s.height/2+s.marginTop)*3/4,d=20;t.forEach((i,l)=>{let u=n.append("g").attr("transform",`translate(${o}, ${c+l*d})`);u.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${l}`),u.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(i.label)})}e(G,"drawLegend");var ot={draw:at},it=e((n,t)=>{let a="";for(let s=0;s<n.THEME_COLOR_LIMIT;s++){let o=n[`cScale${s}`];a+=`
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
		`}return a},"genIndexStyles"),lt=e((n)=>{let t=ge(),a=p(),s=F(t,a.themeVariables),o=F(s.radar,n);return{themeVariables:s,radarOptions:o}},"buildRadarStyleOptions"),ct=e(({radar:n}={})=>{let{themeVariables:t,radarOptions:a}=lt(n);return`
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
	${it(t,a)}
	`},"styles"),vt={parser:et,db:L,renderer:ot,styles:ct};export{vt as diagram};
