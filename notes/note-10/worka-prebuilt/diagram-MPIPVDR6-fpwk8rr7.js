import{Z}from"./entry-mcj0cczr.js";import{e,r,Ne,L,y,z,x,k,C,T,S,A,E,W,H}from"./entry-q62xrf2s.js";import{oe}from"./entry-1sjs52q7.js";var v={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},O=32,R={axes:[],curves:[],options:v},h=structuredClone(R),V=L.radar,j=e(()=>H({...V,...y().radar}),"getConfig"),I=e(()=>h.axes,"getAxes"),U=e(()=>h.curves,"getCurves"),X=e(()=>h.options,"getOptions"),K=e((n)=>{h.axes=n.map((t)=>({name:t.name,label:t.label??t.name}))},"setAxes"),N=e((n)=>{h.curves=n.map((t)=>({name:t.name,label:t.label??t.name,entries:Y(t.entries)}))},"setCurves"),Y=e((n)=>{if(n[0].axis==null)return n.map((a)=>a.value);let t=I();if(t.length===0)throw Error("Axes must be populated before curves for reference entries");return t.map((a)=>{let s=n.find((o)=>o.axis?.$refText===a.name);if(s===void 0)throw Error("Missing entry for axis "+a.label);return s.value})},"computeCurveEntries"),q=e((n)=>{let t=n.reduce((a,s)=>(a[s.name]=s,a),{});if(h.options={showLegend:t.showLegend?.value??v.showLegend,ticks:t.ticks?.value??v.ticks,max:t.max?.value??v.max,min:t.min?.value??v.min,graticule:t.graticule?.value??v.graticule},h.options.ticks>O)r.warn(`Radar diagram ticks (${h.options.ticks}) exceeds maximum allowed (${O}). Using ${O} instead.`),h.options.ticks=O},"setOptions"),J=e(()=>{x(),h=structuredClone(R)},"clear"),b={getAxes:I,getCurves:U,getOptions:X,setAxes:K,setCurves:N,setOptions:q,getConfig:j,clear:J,setAccTitle:k,getAccTitle:C,setDiagramTitle:A,getDiagramTitle:E,getAccDescription:S,setAccDescription:T},Q=e((n)=>{Z(n,b);let{axes:t,curves:a,options:s}=n;b.setAxes(t),b.setCurves(a),b.setOptions(s)},"populate"),tt={parse:e(async(n)=>{let t=await oe("radar",n);r.debug(t),Q(t)},"parse")},et=e((n,t,a,s)=>{let o=s.db,c=o.getAxes(),d=o.getCurves(),i=o.getOptions(),l=o.getConfig(),u=o.getDiagramTitle(),m=W(t),p=at(m,l),g=i.max??Math.max(...d.map((M)=>Math.max(...M.entries))),f=i.min,w=Math.min(l.width,l.height)/2;rt(p,c,w,i.ticks,i.graticule),nt(p,c,w,l),_(p,c,d,f,g,i.graticule,l),P(p,d,i.showLegend,l),p.append("text").attr("class","radarTitle").text(u).attr("x",0).attr("y",-l.height/2-l.marginTop)},"draw"),at=e((n,t)=>{let a=t.width+t.marginLeft+t.marginRight,s=t.height+t.marginTop+t.marginBottom,o={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return z(n,s,a,t.useMaxWidth??!0),n.attr("viewBox",`0 0 ${a} ${s}`).attr("overflow","visible"),n.append("g").attr("transform",`translate(${o.x}, ${o.y})`)},"drawFrame"),rt=e((n,t,a,s,o)=>{if(o==="circle")for(let c=0;c<s;c++){let d=a*(c+1)/s;n.append("circle").attr("r",d).attr("class","radarGraticule")}else if(o==="polygon"){let c=t.length;for(let d=0;d<s;d++){let i=a*(d+1)/s,l=t.map((u,m)=>{let p=2*m*Math.PI/c-Math.PI/2,g=i*Math.cos(p),f=i*Math.sin(p);return`${g},${f}`}).join(" ");n.append("polygon").attr("points",l).attr("class","radarGraticule")}}},"drawGraticule"),nt=e((n,t,a,s)=>{let o=t.length;for(let c=0;c<o;c++){let d=t[c].label,i=2*c*Math.PI/o-Math.PI/2,l=Math.cos(i),u=Math.sin(i);n.append("line").attr("x1",0).attr("y1",0).attr("x2",a*s.axisScaleFactor*l).attr("y2",a*s.axisScaleFactor*u).attr("class","radarAxisLine");let m=l>0.01?"start":l<-0.01?"end":"middle",p=u>0.01?"hanging":u<-0.01?"auto":"central",g=4;n.append("text").text(d).attr("x",a*s.axisLabelFactor*l+g*l).attr("y",a*s.axisLabelFactor*u+g*u).attr("text-anchor",m).attr("dominant-baseline",p).attr("class","radarAxisLabel")}},"drawAxes");function _(n,t,a,s,o,c,d){let i=t.length,l=Math.min(d.width,d.height)/2;a.forEach((u,m)=>{if(u.entries.length!==i)return;let p=u.entries.map((g,f)=>{let w=2*Math.PI*f/i-Math.PI/2,M=F(g,s,o,l),G=M*Math.cos(w),B=M*Math.sin(w);return{x:G,y:B}});if(c==="circle")n.append("path").attr("d",D(p,d.curveTension)).attr("class",`radarCurve-${m}`);else if(c==="polygon")n.append("polygon").attr("points",p.map((g)=>`${g.x},${g.y}`).join(" ")).attr("class",`radarCurve-${m}`)})}e(_,"drawCurves");function F(n,t,a,s){let o=Math.min(Math.max(n,t),a);return s*(o-t)/(a-t)}e(F,"relativeRadius");function D(n,t){let a=n.length,s=`M${n[0].x},${n[0].y}`;for(let o=0;o<a;o++){let c=n[(o-1+a)%a],d=n[o],i=n[(o+1)%a],l=n[(o+2)%a],u={x:d.x+(i.x-c.x)*t,y:d.y+(i.y-c.y)*t},m={x:i.x-(l.x-d.x)*t,y:i.y-(l.y-d.y)*t};s+=` C${u.x},${u.y} ${m.x},${m.y} ${i.x},${i.y}`}return`${s} Z`}e(D,"closedRoundCurve");function P(n,t,a,s){if(!a)return;let o=(s.width/2+s.marginRight)*3/4,c=-(s.height/2+s.marginTop)*3/4,d=20;t.forEach((i,l)=>{let u=n.append("g").attr("transform",`translate(${o}, ${c+l*d})`);u.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${l}`),u.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(i.label)})}e(P,"drawLegend");var st={draw:et},ot=e((n,t)=>{let a="";for(let s=0;s<n.THEME_COLOR_LIMIT;s++){let o=n[`cScale${s}`];a+=`
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
		`}return a},"genIndexStyles"),it=e((n)=>{let t=Ne(),a=y(),s=H(t,a.themeVariables),o=H(s.radar,n);return{themeVariables:s,radarOptions:o}},"buildRadarStyleOptions"),lt=e(({radar:n}={})=>{let{themeVariables:t,radarOptions:a}=it(n);return`
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
	${ot(t,a)}
	`},"styles"),ht={parser:tt,db:b,renderer:st,styles:lt};export{ht as diagram};
