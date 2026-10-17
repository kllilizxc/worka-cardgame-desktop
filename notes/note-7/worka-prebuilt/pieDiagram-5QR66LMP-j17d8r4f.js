import{U}from"./entry-wrqvnc8j.js";import{e,r,_,N,b,v,x,w,k,C,T,i,ne,Rr,In,z,Me,F}from"./entry-79v5dffy.js";import{W}from"./entry-c6s124hx.js";import{$e}from"./entry-zqc39emn.js";import{ct}from"./entry-0pj9kd17.js";function rt(t,l){return l<t?-1:l>t?1:l>=t?0:NaN}function at(t){return t}function nt(){var t=at,l=rt,M=null,G=ne(0),g=ne(Rr),h=ne(0);function s(a){var o,u=(a=In(a)).length,m,R,H=0,S=Array(u),c=Array(u),P=+G.apply(this,arguments),V=Math.min(Rr,Math.max(-Rr,g.apply(this,arguments)-P)),B,Z=Math.min(Math.abs(V)/u,h.apply(this,arguments)),p=Z*(V<0?-1:1),L;for(o=0;o<u;++o)if((L=c[S[o]=o]=+t(a[o],o,a))>0)H+=L;if(l!=null)S.sort(function(j,y){return l(c[j],c[y])});else if(M!=null)S.sort(function(j,y){return M(a[j],a[y])});for(o=0,R=H?(V-u*p)/H:0;o<u;++o,P=B)m=S[o],L=c[m],B=P+(L>0?L*R:0)+p,c[m]={data:a[m],index:o,value:L,startAngle:P,endAngle:B,padAngle:Z};return c}return s.value=function(a){return arguments.length?(t=typeof a==="function"?a:ne(+a),s):t},s.sortValues=function(a){return arguments.length?(l=a,M=null,s):l},s.sort=function(a){return arguments.length?(M=a,l=null,s):M},s.startAngle=function(a){return arguments.length?(G=typeof a==="function"?a:ne(+a),s):G},s.endAngle=function(a){return arguments.length?(g=typeof a==="function"?a:ne(+a),s):g},s.padAngle=function(a){return arguments.length?(h=typeof a==="function"?a:ne(+a),s):h},s}var dt=_.pie,it={sections:new Map,showData:!1,config:dt},{sections:K,showData:ot}=it,St=structuredClone(dt),yt=e(()=>structuredClone(St),"getConfig"),wt=e(()=>{K=new Map,ot=it.showData,b()},"clear"),At=e(({label:t,value:l})=>{if(l<0)throw Error(`"${t}" has invalid value: ${l}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);if(!K.has(t))K.set(t,l),r.debug(`added new section: ${t}, with value: ${l}`)},"addSection"),Ct=e(()=>K,"getSections"),$t=e((t)=>{ot=t},"setShowData"),Dt=e(()=>ot,"getShowData"),pt={getConfig:yt,clear:wt,setDiagramTitle:C,getDiagramTitle:T,setAccTitle:v,getAccTitle:x,setAccDescription:w,getAccDescription:k,addSection:At,getSections:Ct,setShowData:$t,getShowData:Dt},Tt=e((t,l)=>{U(t,l),l.setShowData(t.showData),t.sections.map(l.addSection)},"populateDb"),bt={parse:e(async(t)=>{let l=await W("pie",t);r.debug(l),Tt(l,pt)},"parse")},kt=e((t)=>`
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
`,"getStyles"),zt=kt,Et=e((t)=>{let l=[...t.values()].reduce((g,h)=>g+h,0),M=[...t.entries()].map(([g,h])=>({label:g,value:h})).filter((g)=>g.value/l*100>=1);return nt().value((g)=>g.value).sort(null)(M)},"createPieArcs"),Mt=e((t,l,M,G)=>{r.debug(`rendering pie chart
`+t);let g=G.db,h=i(),s=F(g.getConfig(),h.pie),a=40,o=18,u=4,m=450,R=m,H=z(l),S=H.append("g");S.attr("transform","translate("+R/2+","+m/2+")");let{themeVariables:c}=h,[P]=Me(c.pieOuterStrokeWidth);P??=2;let{legendPosition:V,textPosition:B}=s,Z=s.donutHole>0&&s.donutHole<=0.9?s.donutHole:0,p=Math.min(R,m)/2-a,L=ct().innerRadius(Z*p).outerRadius(p),j=ct().innerRadius(p*B).outerRadius(p*B),y=S.append("g");y.append("circle").attr("cx",0).attr("cy",0).attr("r",p+P/2).attr("class","pieOuterCircle");let q=g.getSections(),ft=Et(q),ht=[c.pie1,c.pie2,c.pie3,c.pie4,c.pie5,c.pie6,c.pie7,c.pie8,c.pie9,c.pie10,c.pie11,c.pie12],Q=0;q.forEach((n)=>{Q+=n});let lt=ft.filter((n)=>(n.data.value/Q*100).toFixed(0)!=="0"),Y=$e(ht).domain([...q.keys()]);y.selectAll("mySlices").data(lt).enter().append("path").attr("d",L).attr("fill",(n)=>Y(n.data.label)).attr("class",(n)=>{let d="pieCircle";if(s.highlightSlice==="hover")d+=" highlightedOnHover";else if(s.highlightSlice===n.data.label)d+=" highlighted";return d}),y.selectAll("mySlices").data(lt).enter().append("text").text((n)=>(n.data.value/Q*100).toFixed(0)+"%").attr("transform",(n)=>"translate("+j.centroid(n)+")").style("text-anchor","middle").attr("class","slice");let mt=S.append("text").text(g.getDiagramTitle()).attr("x",0).attr("y",-(m-50)/2).attr("class","pieTitleText"),X=[...q.entries()].map(([n,d])=>({label:n,value:d})),O=S.selectAll(".legend").data(X).enter().append("g").attr("class","legend");O.append("rect").attr("width",o).attr("height",o).style("fill",(n)=>Y(n.label)).style("stroke",(n)=>Y(n.label)),O.append("text").attr("x",o+u).attr("y",o-u).text((n)=>{if(g.getShowData())return`${n.label} [${n.value}]`;return n.label});let I=Math.max(...O.selectAll("text").nodes().map((n)=>n?.getBoundingClientRect().width??0)),J=m,tt=R+a,f=o+u,et=X.length*f;switch(V){case"center":O.attr("transform",(n,d)=>{let A=f*X.length/2,D=-I/2-(o+u),E=d*f-A;return"translate("+D+","+E+")"});break;case"top":J+=et,O.attr("transform",(n,d)=>{let A=p,D=-I/2-(o+u),E=d*f-A;return`translate(${D}, ${E})`}),y.attr("transform",()=>`translate(0, ${et+f})`);break;case"bottom":J+=et,O.attr("transform",(n,d)=>{let A=-p-f,D=-I/2-(o+u),E=d*f-A;return"translate("+D+","+E+")"});break;case"left":tt+=o+u+I,O.attr("transform",(n,d)=>{let A=f*X.length/2,D=-p-(o+u),E=d*f-A;return"translate("+D+","+E+")"}),y.attr("transform",()=>`translate(${I+o+u}, 0)`);break;case"right":default:tt+=o+u+I,O.attr("transform",(n,d)=>{let A=f*X.length/2,D=12*o,E=d*f-A;return"translate("+D+","+E+")"});break}let st=mt.node()?.getBoundingClientRect().width??0,vt=R/2-st/2,xt=R/2+st/2,ut=Math.min(0,vt),gt=Math.max(tt,xt)-ut;H.attr("viewBox",`${ut} 0 ${gt} ${J}`),N(H,J,gt,s.useMaxWidth)},"draw"),Rt={draw:Mt},Jt={parser:bt,db:pt,renderer:Rt,styles:zt};export{Jt as diagram};
