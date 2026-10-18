import{ne}from"./entry-569z3p7x.js";import{e,r,P,H,S,A,R,_,L,M,I,i,Le,Hn,Da,Q,bt,Z}from"./entry-mmtsa8rn.js";import{fe}from"./entry-fc1fke48.js";import{St}from"./entry-egsf8k6a.js";import{nr}from"./entry-w8thz341.js";function tt(t,l){return l<t?-1:l>t?1:l>=t?0:NaN}function et(t){return t}function rt(){var t=et,l=tt,D=null,O=Le(0),g=Le(Hn),h=Le(0);function s(a){var o,u=(a=Da(a)).length,m,T,z=0,v=Array(u),c=Array(u),E=+O.apply(this,arguments),N=Math.min(Hn,Math.max(-Hn,g.apply(this,arguments)-E)),W,V=Math.min(Math.abs(N)/u,h.apply(this,arguments)),p=V*(N<0?-1:1),b;for(o=0;o<u;++o)if((b=c[v[o]=o]=+t(a[o],o,a))>0)z+=b;if(l!=null)v.sort(function(G,x){return l(c[G],c[x])});else if(D!=null)v.sort(function(G,x){return D(a[G],a[x])});for(o=0,T=z?(N-u*p)/z:0;o<u;++o,E=W)m=v[o],b=c[m],W=E+(b>0?b*T:0)+p,c[m]={data:a[m],index:o,value:b,startAngle:E,endAngle:W,padAngle:V};return c}return s.value=function(a){return arguments.length?(t=typeof a==="function"?a:Le(+a),s):t},s.sortValues=function(a){return arguments.length?(l=a,D=null,s):l},s.sort=function(a){return arguments.length?(D=a,l=null,s):D},s.startAngle=function(a){return arguments.length?(O=typeof a==="function"?a:Le(+a),s):O},s.endAngle=function(a){return arguments.length?(g=typeof a==="function"?a:Le(+a),s):g},s.padAngle=function(a){return arguments.length?(h=typeof a==="function"?a:Le(+a),s):h},s}var ct=P.pie,at={sections:new Map,showData:!1,config:ct},{sections:X,showData:nt}=at,mt=structuredClone(ct),vt=e(()=>structuredClone(mt),"getConfig"),xt=e(()=>{X=new Map,nt=at.showData,S()},"clear"),yt=e(({label:t,value:l})=>{if(l<0)throw Error(`"${t}" has invalid value: ${l}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);if(!X.has(t))X.set(t,l),r.debug(`added new section: ${t}, with value: ${l}`)},"addSection"),wt=e(()=>X,"getSections"),At=e((t)=>{nt=t},"setShowData"),Ct=e(()=>nt,"getShowData"),ut={getConfig:vt,clear:xt,setDiagramTitle:M,getDiagramTitle:I,setAccTitle:A,getAccTitle:R,setAccDescription:_,getAccDescription:L,addSection:yt,getSections:wt,setShowData:At,getShowData:Ct},$t=e((t,l)=>{ne(t,l),l.setShowData(t.showData),t.sections.map(l.addSection)},"populateDb"),Dt={parse:e(async(t)=>{let l=await fe("pie",t);r.debug(l),$t(l,ut)},"parse")},Tt=e((t)=>`
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
`,"getStyles"),kt=Tt,zt=e((t)=>{let l=[...t.values()].reduce((g,h)=>g+h,0),D=[...t.entries()].map(([g,h])=>({label:g,value:h})).filter((g)=>g.value/l*100>=1);return rt().value((g)=>g.value).sort(null)(D)},"createPieArcs"),Et=e((t,l,D,O)=>{r.debug(`rendering pie chart
`+t);let g=O.db,h=i(),s=Z(g.getConfig(),h.pie),a=40,o=18,u=4,m=450,T=m,z=Q(l),v=z.append("g");v.attr("transform","translate("+T/2+","+m/2+")");let{themeVariables:c}=h,[E]=bt(c.pieOuterStrokeWidth);E??=2;let{legendPosition:N,textPosition:W}=s,V=s.donutHole>0&&s.donutHole<=0.9?s.donutHole:0,p=Math.min(T,m)/2-a,b=nr().innerRadius(V*p).outerRadius(p),G=nr().innerRadius(p*W).outerRadius(p*W),x=v.append("g");x.append("circle").attr("cx",0).attr("cy",0).attr("r",p+E/2).attr("class","pieOuterCircle");let U=g.getSections(),gt=zt(U),dt=[c.pie1,c.pie2,c.pie3,c.pie4,c.pie5,c.pie6,c.pie7,c.pie8,c.pie9,c.pie10,c.pie11,c.pie12],q=0;U.forEach((n)=>{q+=n});let it=gt.filter((n)=>(n.data.value/q*100).toFixed(0)!=="0"),J=St(dt).domain([...U.keys()]);x.selectAll("mySlices").data(it).enter().append("path").attr("d",b).attr("fill",(n)=>J(n.data.label)).attr("class",(n)=>{let d="pieCircle";if(s.highlightSlice==="hover")d+=" highlightedOnHover";else if(s.highlightSlice===n.data.label)d+=" highlighted";return d}),x.selectAll("mySlices").data(it).enter().append("text").text((n)=>(n.data.value/q*100).toFixed(0)+"%").attr("transform",(n)=>"translate("+G.centroid(n)+")").style("text-anchor","middle").attr("class","slice");let pt=v.append("text").text(g.getDiagramTitle()).attr("x",0).attr("y",-(m-50)/2).attr("class","pieTitleText"),B=[...U.entries()].map(([n,d])=>({label:n,value:d})),k=v.selectAll(".legend").data(B).enter().append("g").attr("class","legend");k.append("rect").attr("width",o).attr("height",o).style("fill",(n)=>J(n.label)).style("stroke",(n)=>J(n.label)),k.append("text").attr("x",o+u).attr("y",o-u).text((n)=>{if(g.getShowData())return`${n.label} [${n.value}]`;return n.label});let F=Math.max(...k.selectAll("text").nodes().map((n)=>n?.getBoundingClientRect().width??0)),j=m,K=T+a,f=o+u,Y=B.length*f;switch(N){case"center":k.attr("transform",(n,d)=>{let y=f*B.length/2,w=-F/2-(o+u),C=d*f-y;return"translate("+w+","+C+")"});break;case"top":j+=Y,k.attr("transform",(n,d)=>{let y=p,w=-F/2-(o+u),C=d*f-y;return`translate(${w}, ${C})`}),x.attr("transform",()=>`translate(0, ${Y+f})`);break;case"bottom":j+=Y,k.attr("transform",(n,d)=>{let y=-p-f,w=-F/2-(o+u),C=d*f-y;return"translate("+w+","+C+")"});break;case"left":K+=o+u+F,k.attr("transform",(n,d)=>{let y=f*B.length/2,w=-p-(o+u),C=d*f-y;return"translate("+w+","+C+")"}),x.attr("transform",()=>`translate(${F+o+u}, 0)`);break;case"right":default:K+=o+u+F,k.attr("transform",(n,d)=>{let y=f*B.length/2,w=12*o,C=d*f-y;return"translate("+w+","+C+")"});break}let ot=pt.node()?.getBoundingClientRect().width??0,ft=T/2-ot/2,ht=T/2+ot/2,lt=Math.min(0,ft),st=Math.max(K,ht)-lt;z.attr("viewBox",`${lt} 0 ${st} ${j}`),H(z,j,st,s.useMaxWidth)},"draw"),Mt={draw:Et},qt={parser:Dt,db:ut,renderer:Mt,styles:kt};export{qt as diagram};
