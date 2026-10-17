import{e as Mq}from"./entry-z0hd46n2.js";import{f as Qq}from"./entry-tg591dep.js";import{g as Xq}from"./entry-repqhmfy.js";import"./entry-4c2axy96.js";import"./entry-an845mmb.js";import"./entry-zwp5mpbr.js";import"./entry-qfkap0t1.js";import"./entry-tpwze22z.js";import"./entry-33aec2h8.js";import"./entry-1wt3te41.js";import"./entry-x521f2q2.js";import"./entry-d3ngv03f.js";import"./entry-88qc9nyb.js";import"./entry-2w1r5g19.js";import"./entry-8kscn94e.js";import"./entry-pcrv5ked.js";import"./entry-ktm23d7a.js";import"./entry-4dpyffe1.js";import"./entry-2nwef42g.js";import{nd as yq,od as Kq}from"./entry-tg2g1jp0.js";import"./entry-dq81ephj.js";import{Md as g,ie as d,ne as s,oe as l,pe as n,qe as o,re as a,se as i,te as t,ue as e}from"./entry-w263c3eq.js";import{De as f,Oe as qq,ff as S,if as $q}from"./entry-csmcz0zk.js";import{Cf as Y}from"./entry-2e1h0a6c.js";import"./entry-f9xsqzhp.js";var Yq=g.pie,C={sections:new Map,showData:!1,config:Yq},T=C.sections,b=C.showData,Zq=structuredClone(Yq),Rq=Y(()=>structuredClone(Zq),"getConfig"),Hq=Y(()=>{T=new Map,b=C.showData,s()},"clear"),Pq=Y(({label:q,value:Q})=>{if(Q<0)throw Error(`"${q}" has invalid value: ${Q}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);if(!T.has(q))T.set(q,Q),f.debug(`added new section: ${q}, with value: ${Q}`)},"addSection"),Wq=Y(()=>T,"getSections"),xq=Y((q)=>{b=q},"setShowData"),vq=Y(()=>b,"getShowData"),Jq={getConfig:Rq,clear:Hq,setDiagramTitle:i,getDiagramTitle:t,setAccTitle:l,getAccTitle:n,setAccDescription:o,getAccDescription:a,addSection:Pq,getSections:Wq,setShowData:xq,getShowData:vq},Tq=Y((q,Q)=>{Mq(q,Q),Q.setShowData(q.showData),q.sections.map(Q.addSection)},"populateDb"),fq={parse:Y(async(q)=>{let Q=await Xq("pie",q);f.debug(Q),Tq(Q,Jq)},"parse")},Aq=Y((q)=>`
  .pieCircle{
    stroke: ${q.pieStrokeColor};
    stroke-width : ${q.pieStrokeWidth};
    opacity : ${q.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${q.pieOuterStrokeColor};
    stroke-width: ${q.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${q.pieTitleTextSize};
    fill: ${q.pieTitleTextColor};
    font-family: ${q.fontFamily};
  }
  .slice {
    font-family: ${q.fontFamily};
    fill: ${q.pieSectionTextColor};
    font-size:${q.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${q.pieLegendTextColor};
    font-family: ${q.fontFamily};
    font-size: ${q.pieLegendTextSize};
  }
`,"getStyles"),Iq=Aq,Lq=Y((q)=>{let Q=[...q.values()].reduce((X,F)=>X+F,0),D=[...q.entries()].map(([X,F])=>({label:X,value:F})).filter((X)=>X.value/Q*100>=1);return $q().value((X)=>X.value).sort(null)(D)},"createPieArcs"),Nq=Y((q,Q,D,u)=>{f.debug(`rendering pie chart
`+q);let X=u.db,F=e(),k=Kq(X.getConfig(),F.pie),m=40,K=18,U=4,Z=450,R=Z,A=Qq(Q),W=A.append("g");W.attr("transform","translate("+R/2+","+Z/2+")");let{themeVariables:M}=F,[p]=yq(M.pieOuterStrokeWidth);p??=2;let{legendPosition:Uq,textPosition:_}=k,Bq=k.donutHole>0&&k.donutHole<=0.9?k.donutHole:0,w=Math.min(R,Z)/2-m,Oq=S().innerRadius(Bq*w).outerRadius(w),zq=S().innerRadius(w*_).outerRadius(w*_),H=W.append("g");H.append("circle").attr("cx",0).attr("cy",0).attr("r",w+p/2).attr("class","pieOuterCircle");let x=X.getSections(),kq=Lq(x),wq=[M.pie1,M.pie2,M.pie3,M.pie4,M.pie5,M.pie6,M.pie7,M.pie8,M.pie9,M.pie10,M.pie11,M.pie12],I=0;x.forEach(($)=>{I+=$});let c=kq.filter(($)=>($.data.value/I*100).toFixed(0)!=="0"),L=qq(wq).domain([...x.keys()]);H.selectAll("mySlices").data(c).enter().append("path").attr("d",Oq).attr("fill",($)=>{return L($.data.label)}).attr("class",($)=>{let y="pieCircle";if(k.highlightSlice==="hover")y+=" highlightedOnHover";else if(k.highlightSlice===$.data.label)y+=" highlighted";return y}),H.selectAll("mySlices").data(c).enter().append("text").text(($)=>{return($.data.value/I*100).toFixed(0)+"%"}).attr("transform",($)=>{return"translate("+zq.centroid($)+")"}).style("text-anchor","middle").attr("class","slice");let jq=W.append("text").text(X.getDiagramTitle()).attr("x",0).attr("y",-(Z-50)/2).attr("class","pieTitleText"),P=[...x.entries()].map(([$,y])=>({label:$,value:y})),j=W.selectAll(".legend").data(P).enter().append("g").attr("class","legend");j.append("rect").attr("width",K).attr("height",K).style("fill",($)=>L($.label)).style("stroke",($)=>L($.label)),j.append("text").attr("x",K+U).attr("y",K-U).text(($)=>{if(X.getShowData())return`${$.label} [${$.value}]`;return $.label});let V=Math.max(...j.selectAll("text").nodes().map(($)=>$?.getBoundingClientRect().width??0)),v=Z,N=R+m,J=K+U,G=P.length*J;switch(Uq){case"center":j.attr("transform",($,y)=>{let B=J*P.length/2,O=-V/2-(K+U),z=y*J-B;return"translate("+O+","+z+")"});break;case"top":v+=G,j.attr("transform",($,y)=>{let B=w,O=-V/2-(K+U),z=y*J-B;return`translate(${O}, ${z})`}),H.attr("transform",()=>{return`translate(0, ${G+J})`});break;case"bottom":v+=G,j.attr("transform",($,y)=>{let B=-w-J,O=-V/2-(K+U),z=y*J-B;return"translate("+O+","+z+")"});break;case"left":N+=K+U+V,j.attr("transform",($,y)=>{let B=J*P.length/2,O=-w-(K+U),z=y*J-B;return"translate("+O+","+z+")"}),H.attr("transform",()=>{return`translate(${V+K+U}, 0)`});break;case"right":default:N+=K+U+V,j.attr("transform",($,y)=>{let B=J*P.length/2,O=12*K,z=y*J-B;return"translate("+O+","+z+")"});break}let h=jq.node()?.getBoundingClientRect().width??0,Fq=R/2-h/2,Vq=R/2+h/2,E=Math.min(0,Fq),r=Math.max(N,Vq)-E;A.attr("viewBox",`${E} 0 ${r} ${v}`),d(A,v,r,k.useMaxWidth)},"draw"),Gq={draw:Nq},hq={parser:fq,db:Jq,renderer:Gq,styles:Iq};export{hq as diagram};
