import{Z}from"./entry-mcj0cczr.js";import{e,r,L,z,x,k,C,T,S,A,E,i,Te,On,ba,W,ut,H}from"./entry-q62xrf2s.js";import{oe}from"./entry-1sjs52q7.js";import{mt}from"./entry-rm41ee1j.js";import{qt}from"./entry-6nh9xvja.js";function et(t,l){return l<t?-1:l>t?1:l>=t?0:NaN}function rt(t){return t}function at(){var t=rt,l=et,M=null,_=Te(0),g=Te(On),h=Te(0);function s(a){var o,u=(a=ba(a)).length,m,R,N=0,v=Array(u),c=Array(u),P=+_.apply(this,arguments),I=Math.min(On,Math.max(-On,g.apply(this,arguments)-P)),G,j=Math.min(Math.abs(I)/u,h.apply(this,arguments)),p=j*(I<0?-1:1),O;for(o=0;o<u;++o)if((O=c[v[o]=o]=+t(a[o],o,a))>0)N+=O;if(l!=null)v.sort(function(V,y){return l(c[V],c[y])});else if(M!=null)v.sort(function(V,y){return M(a[V],a[y])});for(o=0,R=N?(I-u*p)/N:0;o<u;++o,P=G)m=v[o],O=c[m],G=P+(O>0?O*R:0)+p,c[m]={data:a[m],index:o,value:O,startAngle:P,endAngle:G,padAngle:j};return c}return s.value=function(a){return arguments.length?(t=typeof a==="function"?a:Te(+a),s):t},s.sortValues=function(a){return arguments.length?(l=a,M=null,s):l},s.sort=function(a){return arguments.length?(M=a,l=null,s):M},s.startAngle=function(a){return arguments.length?(_=typeof a==="function"?a:Te(+a),s):_},s.endAngle=function(a){return arguments.length?(g=typeof a==="function"?a:Te(+a),s):g},s.padAngle=function(a){return arguments.length?(h=typeof a==="function"?a:Te(+a),s):h},s}var gt=L.pie,nt={sections:new Map,showData:!1,config:gt},{sections:J,showData:it}=nt,St=structuredClone(gt),yt=e(()=>structuredClone(St),"getConfig"),wt=e(()=>{J=new Map,it=nt.showData,x()},"clear"),At=e(({label:t,value:l})=>{if(l<0)throw Error(`"${t}" has invalid value: ${l}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);if(!J.has(t))J.set(t,l),r.debug(`added new section: ${t}, with value: ${l}`)},"addSection"),Ct=e(()=>J,"getSections"),$t=e((t)=>{it=t},"setShowData"),Dt=e(()=>it,"getShowData"),dt={getConfig:yt,clear:wt,setDiagramTitle:A,getDiagramTitle:E,setAccTitle:k,getAccTitle:C,setAccDescription:T,getAccDescription:S,addSection:At,getSections:Ct,setShowData:$t,getShowData:Dt},Tt=e((t,l)=>{Z(t,l),l.setShowData(t.showData),t.sections.map(l.addSection)},"populateDb"),bt={parse:e(async(t)=>{let l=await oe("pie",t);r.debug(l),Tt(l,dt)},"parse")},kt=e((t)=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
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
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),zt=kt,Et=e((t)=>{let l=[...t.values()].reduce((g,h)=>g+h,0),M=[...t.entries()].map(([g,h])=>({label:g,value:h})).filter((g)=>g.value/l*100>=1);return at().value((g)=>g.value).sort(null)(M)},"createPieArcs"),Mt=e((t,l,M,_)=>{r.debug(`rendering pie chart
`+t);let g=_.db,h=i(),s=H(g.getConfig(),h.pie),a=40,o=18,u=4,m=450,R=m,N=W(l),v=N.append("g");v.attr("transform","translate("+R/2+","+m/2+")");let{themeVariables:c}=h,[P]=ut(c.pieOuterStrokeWidth);P??=2;let{legendPosition:I,textPosition:G}=s,j=s.donutHole>0&&s.donutHole<=0.9?s.donutHole:0,p=Math.min(R,m)/2-a,O=qt().innerRadius(j*p).outerRadius(p),V=qt().innerRadius(p*G).outerRadius(p*G),y=v.append("g");y.append("circle").attr("cx",0).attr("cy",0).attr("r",p+P/2).attr("class","pieOuterCircle");let X=g.getSections(),pt=Et(X),ft=[c.pie1,c.pie2,c.pie3,c.pie4,c.pie5,c.pie6,c.pie7,c.pie8,c.pie9,c.pie10,c.pie11,c.pie12],K=0;X.forEach((n)=>{K+=n});let ot=pt.filter((n)=>(n.data.value/K*100).toFixed(0)!=="0"),Q=mt(ft).domain([...X.keys()]);y.selectAll("mySlices").data(ot).enter().append("path").attr("d",O).attr("fill",(n)=>Q(n.data.label)).attr("class",(n)=>{let d="pieCircle";if(s.highlightSlice==="hover")d+=" highlightedOnHover";else if(s.highlightSlice===n.data.label)d+=" highlighted";return d}),y.selectAll("mySlices").data(ot).enter().append("text").text((n)=>(n.data.value/K*100).toFixed(0)+"%").attr("transform",(n)=>"translate("+V.centroid(n)+")").style("text-anchor","middle").attr("class","slice");let ht=v.append("text").text(g.getDiagramTitle()).attr("x",0).attr("y",-(m-50)/2).attr("class","pieTitleText"),U=[...X.entries()].map(([n,d])=>({label:n,value:d})),F=v.selectAll(".legend").data(U).enter().append("g").attr("class","legend");F.append("rect").attr("width",o).attr("height",o).style("fill",(n)=>Q(n.label)).style("stroke",(n)=>Q(n.label)),F.append("text").attr("x",o+u).attr("y",o-u).text((n)=>{if(g.getShowData())return`${n.label} [${n.value}]`;return n.label});let B=Math.max(...F.selectAll("text").nodes().map((n)=>n?.getBoundingClientRect().width??0)),q=m,Y=R+a,f=o+u,tt=U.length*f;switch(I){case"center":F.attr("transform",(n,d)=>{let w=f*U.length/2,D=-B/2-(o+u),b=d*f-w;return"translate("+D+","+b+")"});break;case"top":q+=tt,F.attr("transform",(n,d)=>{let w=p,D=-B/2-(o+u),b=d*f-w;return`translate(${D}, ${b})`}),y.attr("transform",()=>`translate(0, ${tt+f})`);break;case"bottom":q+=tt,F.attr("transform",(n,d)=>{let w=-p-f,D=-B/2-(o+u),b=d*f-w;return"translate("+D+","+b+")"});break;case"left":Y+=o+u+B,F.attr("transform",(n,d)=>{let w=f*U.length/2,D=-p-(o+u),b=d*f-w;return"translate("+D+","+b+")"}),y.attr("transform",()=>`translate(${B+o+u}, 0)`);break;case"right":default:Y+=o+u+B,F.attr("transform",(n,d)=>{let w=f*U.length/2,D=12*o,b=d*f-w;return"translate("+D+","+b+")"});break}let lt=ht.node()?.getBoundingClientRect().width??0,vt=R/2-lt/2,xt=R/2+lt/2,st=Math.min(0,vt),ct=Math.max(Y,xt)-st;N.attr("viewBox",`${st} 0 ${ct} ${q}`),z(N,q,ct,s.useMaxWidth)},"draw"),Rt={draw:Mt},Kt={parser:bt,db:dt,renderer:Rt,styles:zt};export{Kt as diagram};
