/* Mathematics only: committed diagrams, initial previews and bounded presentation transitions. */
(function () {
  'use strict';
  if(document.body?.dataset.calulerCategory!=='Mathematics'||window.calulerMathDiagrams)return;
  const key=location.pathname.split('/').pop().replace(/\.html$/,'').replace(/-calculator$/,'');
  const NS='http://www.w3.org/2000/svg',C={blue:'var(--math-blue)',green:'var(--math-green)',amber:'var(--math-amber)',muted:'var(--muted)',red:'var(--math-red)'};
  const definitions={
    fraction:['Fraction arithmetic','Exact signed fraction operations.','a b c d'],
    ratio:['Ratio comparison','Relative sizes on a shared scale.','a b'],
    average:['Arithmetic mean','Each observation contributes equally to the mean.','numbers'],
    median:['The middle of the data','Ordered observations and the central position.','numbers'],
    mode:['Frequency of observations','Repeated values reveal the modal group or groups.','numbers'],
    'standard-deviation':['Spread around the mean','Observed data and a one-standard-deviation interval.','numbers kind'],
    gcd:['Common grouping unit','Both integers are divided into equal-sized groups.','a b'],
    lcm:['Common multiples','Two sequences meet at the least common multiple.','a b'],
    'prime-number-checker':['Prime or composite','A factor relationship, without decorative geometry.','n'],
    'quadratic-equation':['Quadratic roots and vertex','The real parabola explains the calculated roots.','a b c'],
    percentage:['Part and whole','The part is compared with one whole.','part total'],
    'polynomial-value':['Value on the polynomial','The marked point is the evaluation at the entered x.','v0 v1 v2 v3'],
    'matrix-determinant-22':['Determinant and oriented area','The matrix columns span a parallelogram.','v0 v1 v2 v3'],
    'matrix-inverse-22':['Matrix and inverse','A nonsingular matrix has an inverse transformation.','v0 v1 v2 v3'],
    'matrix-trace-22':['The main diagonal','Only the two diagonal entries contribute to the trace.','v0 v1 v2 v3'],
    'vector-dot-product':['Dot product contributions','Signed component products add to the dot product.','v0 v1 v2 v3 v4 v5'],
    'vector-magnitude':['Vector components in 3D','A projected coordinate view of the supplied vector.','v0 v1 v2'],
    'complex-number-magnitude':['Magnitude on the complex plane','The distance from the origin to a + bi.','v0 v1'],
    logarithm:['Logarithm and its inverse','The calculated point lies on y = log_b(x).','v0 v1'],
    permutation:['Ordered selections','The number of available choices decreases at each step.','v0 v1'],
    combination:['Unordered selections','Choose r items from n; their order does not matter.','v0 v1'],
    'probability-of-independent-events':['Independent event intersection','The overlap occupies P(A) × P(B) of one unit square.','v0 v1'],
    'z-score':['Distance in standard deviations','Standardization alone does not assume a normal distribution.','v0 v1 v2'],
    'linear-regression-slope':['Slope from correlation and spread','A centred regression relationship; the intercept is unspecified.','v0 v1 v2'],
    'geometric-mean':['Multiplicative midpoint','For positive values, the geometric mean is central on a log scale.','v0 v1']
  };
  const viewHeight=({ratio:150,gcd:200,lcm:220,'prime-number-checker':210,percentage:160,'matrix-trace-22':210,'vector-dot-product':200,permutation:200,average:225,median:225,mode:240})[key]||250;
  let panel,svg,structured,summary,note,warning,host,scene,displayed=null,committed=null,renderContext=null,motion=null,raf=0,nativePending=false,edited=false;
  let tooltip,activeTip=null,dismissedTip=null,tipPointer=null,tipPinned=false,tipX=null,tipSeries=0,lastPointerType='',nativeSnapshot=null;
  const duration=1800,reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),layers=[];
  const blend=(a,b,t)=>t<=0?a:t>=1?b:Math.max(Math.min(a,b),Math.min(Math.max(a,b),a*(1-t)+b*t));
  const fmt=n=>{if(!Number.isFinite(n))throw new Error('The diagram needs finite calculated values.');return n===0?'0':Math.abs(n)<.0001||Math.abs(n)>=1e7?n.toExponential(3):n.toLocaleString('en-US',{maximumSignificantDigits:8});};
  const tick=n=>n===0?'0':Math.abs(n)<.001||Math.abs(n)>=1e4?n.toExponential(1):String(Number(n.toPrecision(3)));
  const limit=(n,a,b)=>Math.max(a,Math.min(b,n));
  function el(tag,attrs={},parent=svg){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));parent.appendChild(n);return n;}
  function line(x1,y1,x2,y2,tone='muted',attrs={},parent=svg){return el('line',{x1,y1,x2,y2,stroke:C[tone],'stroke-width':1.6,'stroke-linecap':'round',...attrs},parent);}
  function text(x,y,value,anchor='middle',attrs={},parent=svg){const n=el('text',{x,y,'text-anchor':anchor,...attrs},parent);n.textContent=String(value);if(attrs.fill)n.style.fill=attrs.fill;return n;}
  function shape(tag,attrs,tone='blue',parent=svg){return el(tag,{fill:C[tone],'fill-opacity':.12,stroke:C[tone],'stroke-width':1.8,...attrs},parent);}
  const ink=tone=>'url(#caluler-math-fill-'+tone+')';
  function visualDefs(){
    const defs=el('defs');
    for(const tone of ['blue','green','amber']){
      const gradient=el('linearGradient',{id:'caluler-math-fill-'+tone,x1:'0%',y1:'0%',x2:'100%',y2:'100%'},defs);
      el('stop',{offset:'0%','stop-color':C[tone],'stop-opacity':.78},gradient);
      el('stop',{offset:'100%','stop-color':tone==='blue'?'var(--math-blue-end)':C[tone]},gradient);
    }
    if(key==='percentage'){const clip=el('clipPath',{id:'caluler-math-percentage-track'},defs);el('rect',{x:26,y:76,width:308,height:34,rx:8},clip);}
  }
  function numberAxis(lo,hi,left=30,right=330,y=140,labelY=169){
    line(left,y,right,y,'muted',{'stroke-width':2});
    for(let j=0;j<=8;j++){
      const x=blend(left,right,j/8),major=j%2===0;line(x,y-(major?5:3),x,y+(major?5:3),'muted',{'stroke-width':major?1.5:1,opacity:major?.7:.35});
      if(j%4===0)fit(text(x,labelY,tick(blend(lo,hi,j/8)),j===0?'start':j===8?'end':'middle',{class:'math-tick'}),80);
    }
  }
  function percentageTrack(data){
    const [part,whole]=data.values,share=part/whole,width=308*share;
    text(26,28,'Part','start',{class:'math-eyebrow'});text(334,28,'Whole','end',{class:'math-eyebrow'});
    fit(text(26,55,fmt(part),'start',{class:'math-value',fill:C.blue}),140);fit(text(334,55,fmt(whole),'end',{class:'math-value'}),140);
    inspect(shape('rect',{x:26,y:76,width:308,height:34,rx:8,'fill-opacity':.06,'stroke-opacity':.45,'stroke-width':1.2},'muted'),'Whole = '+exactNumber(whole)+'\n100%');
    inspect(shape('rect',{x:26,y:76,width,height:34,fill:ink('blue'),'fill-opacity':1,'stroke-width':0,'clip-path':'url(#caluler-math-percentage-track)'},'blue'),'Part = '+exactNumber(part)+'\nWhole = '+exactNumber(whole)+'\nPercentage = '+exactNumber(data.result)+'%');
    line(26+width,73,26+width,113,'blue',{'stroke-width':1.8,'pointer-events':'none'});
    for(let i=0;i<=4;i++){const x=26+308*i/4;line(x,117,x,122,'muted',{'stroke-width':1.3,opacity:.65});fit(text(x,145,(i*25)+'%',i===0?'start':i===4?'end':'middle',{class:'math-tick'}),49);}
  }
  function frequencyBars(data){
    const sorted=data.counts.slice().sort((a,b)=>b[1]-a[1]||a[0]-b[0]),shown=sorted.slice(0,10),w=280/shown.length;
    text(24,24,'Frequency','start',{class:'math-axis-title'});
    for(const count of new Set([0,Math.floor(data.frequency/2),data.frequency])){const y=160-115*count/data.frequency;line(55,y,335,y,'muted',{'stroke-width':1,opacity:.2});fit(text(44,y+5,String(count),'end',{class:'math-tick'}),38);}
    shown.forEach(([value,count],i)=>{const height=count/data.frequency*115,x=55+i*w,tone=count===data.frequency?'green':'blue';shape('rect',{x,y:45,width:Math.max(5,w-9),height:115,rx:4,'fill-opacity':.035,'stroke-width':0},'muted');inspect(shape('rect',{x,y:160-height,width:Math.max(5,w-9),height,rx:4,fill:ink(tone),'fill-opacity':.9,'stroke-width':1.2},tone),'Value = '+exactNumber(value)+'\nFrequency = '+count);fit(text(x+(w-9)/2,186,fmt(value),'middle',{class:'math-tick'}),w-3);});
    fit(text(180,221,sorted.length>10?'Ten most frequent values; full data used.':'Frequency by observed value','middle',{class:'math-axis-title'}),320);
  }
  const exactNumber=n=>Number.isFinite(n)?String(Object.is(n,-0)?0:n):'Undefined';
  function inspect(n,label){
    let target=n;
    // Transparent hit geometry enlarges thin lines/points without changing the drawing.
    if(n.namespaceURI===NS&&['path','line','circle','rect','polygon'].includes(n.tagName.toLowerCase())){
      const parent=n.parentNode,g=document.createElementNS(NS,'g');parent.insertBefore(g,n);g.append(n);target=g;
      const isLine=n.tagName.toLowerCase()==='line',degenerate=n.tagName.toLowerCase()==='rect'&&(!Number(n.getAttribute('width'))||!Number(n.getAttribute('height')))||isLine&&n.getAttribute('x1')===n.getAttribute('x2')&&n.getAttribute('y1')===n.getAttribute('y2'),hit=degenerate?document.createElementNS(NS,'circle'):n.cloneNode(false);for(const attr of hit.getAttributeNames())if(['id','role','tabindex','focusable'].includes(attr)||attr.startsWith('aria-')||attr.startsWith('data-'))hit.removeAttribute(attr);
      if(degenerate){hit.setAttribute('cx',isLine?n.getAttribute('x1'):Number(n.getAttribute('x'))+Number(n.getAttribute('width'))/2);hit.setAttribute('cy',isLine?n.getAttribute('y1'):Number(n.getAttribute('y'))+Number(n.getAttribute('height'))/2);hit.setAttribute('r','10');}
      hit.setAttribute('class','math-hit');hit.setAttribute('fill',!degenerate&&(n.tagName.toLowerCase()==='path'||isLine)?'none':'transparent');hit.setAttribute('stroke','transparent');hit.setAttribute('stroke-width','14');hit.setAttribute('aria-hidden','true');hit.setAttribute('data-caluler-diagram-export-ignore','');
      if(n.tagName.toLowerCase()==='circle')hit.setAttribute('r',Math.max(10,Number(n.getAttribute('r'))));g.insertBefore(hit,n);
    }else if(n.namespaceURI===NS&&n.tagName.toLowerCase()==='g'){
      for(const child of Array.from(n.children).filter(child=>['line','path'].includes(child.tagName.toLowerCase()))){
        const hit=child.cloneNode(false);hit.setAttribute('class','math-hit');hit.setAttribute('fill','none');hit.setAttribute('stroke','transparent');hit.setAttribute('stroke-width','14');hit.setAttribute('aria-hidden','true');hit.setAttribute('data-caluler-diagram-export-ignore','');n.insertBefore(hit,child);
        if(child.tagName.toLowerCase()==='line'&&child.getAttribute('x1')===child.getAttribute('x2')&&child.getAttribute('y1')===child.getAttribute('y2'))el('circle',{cx:child.getAttribute('x1'),cy:child.getAttribute('y1'),r:10,fill:'transparent',class:'math-hit','aria-hidden':'true','data-caluler-diagram-export-ignore':''},n);
      }
    }
    target.setAttribute('data-math-tip',label);target.setAttribute('role','img');target.setAttribute('tabindex','0');target.setAttribute('aria-label',label);target.setAttribute('aria-describedby','caluler-math-tooltip');target.classList.add('math-hoverable');return target;
  }
  function arrow(x1,y1,x2,y2,tone='blue',attrs={}){const g=el('g',attrs);line(x1,y1,x2,y2,tone,{'stroke-width':2.2},g);if(Math.hypot(x2-x1,y2-y1)>1){const a=Math.atan2(y2-y1,x2-x1);el('path',{d:`M${x2-7*Math.cos(a-.5)},${y2-7*Math.sin(a-.5)} L${x2},${y2} L${x2-7*Math.cos(a+.5)},${y2-7*Math.sin(a+.5)}`,fill:'none',stroke:C[tone],'stroke-width':2},g);}return g;}
  function fit(n,width){if(n.textContent.length*9>width){n.setAttribute('textLength',width);n.setAttribute('lengthAdjust','spacingAndGlyphs');}return n;}
  function extent(values,zero=false){const v=values.filter(Number.isFinite);if(!v.length)throw new Error('These values exceed the diagram range.');let lo=Math.min(...v),hi=Math.max(...v);if(zero){lo=Math.min(0,lo);hi=Math.max(0,hi);}const s=Math.max(Math.abs(lo),Math.abs(hi))||1,span=hi/s-lo/s,pad=(span||.5)*s*.13||Number.MIN_VALUE;lo=Math.max(-Number.MAX_VALUE,lo-pad);hi=Math.min(Number.MAX_VALUE,hi+pad);if(!(hi>lo))throw new Error('These values exceed the diagram range.');return [lo,hi];}
  function fraction(n,lo,hi){const s=Math.max(Math.abs(n),Math.abs(lo),Math.abs(hi))||1;return (n/s-lo/s)/(hi/s-lo/s);}
  function plot(xs,ys,{xLabel='x',yLabel='y',equal=false}={}){
    let xd=extent(xs,true),yd=extent(ys,true);if(equal){const m=Math.max(...xs.map(Math.abs),...ys.map(Math.abs))||1,h=m*1.12;if(!Number.isFinite(h*254/152))throw new Error('These coordinates exceed the diagram range.');xd=[-h*254/152,h*254/152];yd=[-h,h];}
    const index=renderContext?.domains.length||0,override=renderContext?.overrides?.[index];
    if(override){xd=override.x.slice();yd=override.y.slice();const grow=(range,values)=>{const pad=(range[1]/2-range[0]/2)*.06;values.filter(Number.isFinite).forEach(n=>{range[0]=Math.min(range[0],n-pad);range[1]=Math.max(range[1],n+pad);});};grow(xd,renderContext.focus?.map(p=>p[0])||xs);grow(yd,renderContext.focus?.map(p=>p[1])||ys);}
    renderContext?.domains.push({x:xd.slice(),y:yd.slice()});
    const left=84,right=338,top=28,bottom=180,x=n=>left+fraction(n,...xd)*(right-left),y=n=>bottom-fraction(n,...yd)*(bottom-top);
    shape('rect',{x:left,y:top,width:right-left,height:bottom-top,rx:6,'fill-opacity':.025,'stroke-width':1,opacity:.6},'muted');
    for(let j=0;j<=4;j++){const f=j/4,a=blend(...xd,f),b=blend(...yd,f);line(left,top+(bottom-top)*f,right,top+(bottom-top)*f,'muted',{opacity:j%2?.12:.23,'stroke-width':1});line(left+(right-left)*f,top,left+(right-left)*f,bottom,'muted',{opacity:j%2?.12:.23,'stroke-width':1});if(j%2===0){fit(text(left-12,y(b)+5,tick(b),'end',{class:'math-tick'}),66);fit(text(x(a),bottom+25,tick(a),j===0?'start':j===4?'end':'middle',{class:'math-tick'}),76);}}
    line(left,y(0),right,y(0),'muted',{'stroke-width':1.9});line(x(0),top,x(0),bottom,'muted',{'stroke-width':1.9});el('circle',{cx:x(0),cy:y(0),r:2.5,fill:C.muted,'pointer-events':'none'});text(left,17,yLabel,'start',{class:'math-axis-title'});text(right,234,xLabel,'end',{class:'math-axis-title'});
    return {x,y,xd,yd,curve(points,tone='blue'){let d='',open=false;for(const [a,b] of points){if(!Number.isFinite(a)||!Number.isFinite(b)||a<xd[0]||a>xd[1]||b<yd[0]||b>yd[1]){open=false;continue;}d+=(open?' L':' M')+x(a)+','+y(b);open=true;}const target=inspect(el('path',{d,fill:'none',stroke:C[tone],'stroke-width':2.8,'stroke-linejoin':'round','stroke-linecap':'round'}),'Function curve; use Left/Right to inspect coordinates.');target.setAttribute('data-math-curve','true');return target;},point(a,b,label,tone='green',dy=-12){const n=inspect(shape('circle',{cx:x(a),cy:y(b),r:5.5,fill:'var(--card)','fill-opacity':1,'stroke-width':2.3,'data-x':a,'data-y':b},tone),(label||'Point')+': ('+exactNumber(a)+', '+exactNumber(b)+')');el('circle',{cx:x(a),cy:y(b),r:2.3,fill:C[tone],'pointer-events':'none'},n);if(label)fit(text(limit(x(a),left+18,right-18),limit(y(b)+dy,top+14,bottom-8),label,'middle',{class:'math-point-label',fill:C[tone]}),76);return n;}};
  }
  function strip(values,marks=[],bounds=values){const [lo,hi]=extent(bounds),x=n=>30+fraction(n,lo,hi)*300;numberAxis(lo,hi);const counts=new Map();values.forEach(n=>counts.set(n,(counts.get(n)||0)+1));let drawn=0;for(const[n,count]of counts){for(let i=0;i<Math.min(count,5)&&drawn<80;i++,drawn++)inspect(shape('circle',{cx:x(n),cy:126-i*13,r:4.5,fill:ink('blue'),'fill-opacity':1}),'Value = '+exactNumber(n)+'\nFrequency = '+count);}marks.forEach(({value,label,tone='green'},i)=>{inspect(line(x(value),54+i*27,x(value),145,tone,{'stroke-dasharray':'3 4','stroke-width':2.1}),label+' = '+exactNumber(value));fit(text(limit(x(value),72,288),43+i*27,label,'middle',{class:'math-marker-label',fill:C[tone]}),136);});if(drawn>=80||Array.from(counts.values()).some(n=>n>5))fit(text(180,205,'Marker sample · full data used.'),310);return{x,lo,hi};}
  function relation(items,resultLabel){const w=items.length===2?132:92,gap=items.length===2?44:16,start=(360-items.length*w-(items.length-1)*gap)/2,multiply=key==='geometric-mean'||key==='prime-number-checker'&&items.every(([label])=>label==='Factor');items.forEach(([label,value,detail],i)=>{const x=start+i*(w+gap),g=el('g'),tone=i===items.length-1?'green':'blue';shape('rect',{x,y:55,width:w,height:82,rx:12,fill:ink(tone),'fill-opacity':.12,'stroke-opacity':.45},tone,g);line(x+15,58,x+w-15,58,tone,{opacity:.25},g);text(x+w/2,80,label,'middle',{class:'math-eyebrow'},g);fit(text(x+w/2,113,value,'middle',{class:'math-value',fill:C[tone]},g),w-16);inspect(g,label+' = '+(detail??value));if(i<items.length-1){if(multiply)text(x+w+gap/2,105,'×','middle',{class:'math-value',fill:C.muted});else arrow(x+w+7,96,x+w+gap-7,96,'muted');}});if(resultLabel)fit(text(180,185,resultLabel,'middle',{class:'math-axis-title'}),320);}
  function bars(items){const max=Math.max(renderContext?.barScale||0,...items.map(x=>Math.abs(x.value)))||1,hasNegative=renderContext?.barSigned??items.some(x=>x.value<0),zero=hasNegative?220:110,available=hasNegative?110:218;if(renderContext){renderContext.barScale=max;renderContext.barSigned=hasNegative;}items.forEach((item,i)=>{const y=37+i*48,tone=item.tone||'blue';fit(text(16,y+21,item.label,'start',{class:'math-marker-label'}),82);shape('rect',{x:110,y:y+7,width:hasNegative?220:218,height:17,rx:5,'fill-opacity':.06,'stroke-opacity':.25,'stroke-width':1},'muted');line(zero,y+3,zero,y+27,'muted',{opacity:.65});const w=Math.abs(item.value)/max*available;inspect(shape('rect',{x:item.value<0?zero-w:zero,y:y+7,width:w,height:17,rx:5,fill:ink(tone),'fill-opacity':.9,'stroke-width':1.2},tone),item.label+' = '+exactNumber(item.value));fit(text(338,y+40,fmt(item.value),'end',{class:'math-bar-value',fill:C[tone]}),120);});}
  function matrix(values,x,y,width=118,diagonal=false){const gap=width/2;line(x-7,y,x-12,y);line(x-12,y,x-12,y+80);line(x-12,y+80,x-7,y+80);line(x+width+7,y,x+width+12,y);line(x+width+12,y,x+width+12,y+80);line(x+width+12,y+80,x+width+7,y+80);values.forEach((v,i)=>{const highlighted=diagonal&&(i===0||i===3),cell=el('g');shape('rect',{x:x+(i%2)*gap+2,y:y+Math.floor(i/2)*40+2,width:gap-4,height:36,rx:6,'fill-opacity':highlighted?.18:.04,'stroke-opacity':highlighted?.4:.18,'stroke-width':1},highlighted?'green':'muted',cell);fit(text(x+(i%2+.5)*gap,y+Math.floor(i/2)*40+26,fmt(v),'middle',{fill:highlighted?C.green:'var(--text)'},cell),gap-5);inspect(cell,'a'+(Math.floor(i/2)+1)+(i%2+1)+' = '+exactNumber(v)+(highlighted?'\nIncluded in trace':'\nNot included in trace'));});}
  function numberLine(value,label,reference=0){const d=extent([value,reference,0]),x=n=>30+fraction(n,...d)*300;line(30,128,330,128);[reference,value].forEach((v,i)=>{inspect(line(x(v),120,x(v),136,i?'green':'muted'),(i?label:'Reference')+' = '+exactNumber(v));fit(text(limit(x(v),70,290),i?84:180,(i?label:'Reference')+' = '+fmt(v),'middle',{fill:i?C.green:C.muted}),140);});inspect(arrow(x(reference),108,x(value),108,'green'),'Difference = '+exactNumber(value-reference));}
  function plain(html){const box=document.createElement('div');box.innerHTML=html;return {text:box.textContent.replace(/\s+/g,' ').trim(),bold:Array.from(box.querySelectorAll('b')).map(n=>n.textContent)};}
  function describe(input){
    const def=definitions[key];if(!def)throw new Error('This calculator has no registered diagram.');
    const ids=def[2].split(' '),raw=input.raw||{},values=input.values?input.values.slice():ids.map(id=>raw[id]);
    if(!input.values&&ids.some(id=>String(raw[id]??'').trim()===''))throw new Error('Enter every required field, then Calculate.');
    const parsed=input.html?plain(input.html):null;
    if(parsed&&/NaN|Infinity/.test(parsed.text))throw new Error('The calculated output exceeds the finite diagram range.');
    const data={values,rows:[],note:'',output:input.display==null?'':String(input.display),result:input.result};
    if(key==='fraction')data.fractionInputs=[String(raw.a)+'/'+String(raw.b),String(raw.c)+'/'+String(raw.d)];
    const row=(label,value)=>data.rows.push([label,String(value)]);
    if(['average','median','mode','standard-deviation'].includes(key)){
      const numbers=String(raw.numbers).split(',').map(Number).filter(Number.isFinite);if(!numbers.length||numbers.length>10000)throw new Error('Use 1–10,000 finite observations for this diagram.');
      data.numbers=numbers;data.values=[numbers];data.note='Finite comma-separated observations, matching the calculator.';
      if(key==='average'){data.result=numbers.reduce((a,b)=>a+b,0)/numbers.length;row('Arithmetic mean',parsed.bold[0]);}
      if(key==='median'){const sorted=numbers.slice().sort((a,b)=>a-b),m=Math.floor(sorted.length/2);data.result=sorted.length%2?sorted[m]:(sorted[m-1]+sorted[m])/2;row('Median',parsed.bold[0]);}
      if(key==='mode'){const counts=new Map();numbers.forEach(n=>counts.set(n,(counts.get(n)||0)+1));data.counts=Array.from(counts);data.frequency=Math.max(...counts.values());data.modes=data.counts.filter(x=>x[1]===data.frequency).map(x=>x[0]);data.result=data.frequency;row('Mode(s)',parsed.bold[0]);row('Frequency',parsed.bold[1]);}
      if(key==='standard-deviation'){if(raw.kind==='sample'&&numbers.length<2)throw new Error('Sample spread needs at least two observations.');data.mean=numbers.reduce((a,b)=>a+b,0)/numbers.length;data.result=Math.sqrt(numbers.reduce((a,b)=>a+(b-data.mean)**2,0)/(numbers.length-(raw.kind==='sample'?1:0)));row('Mean',parsed.bold[0]);row((raw.kind==='sample'?'Sample':'Population')+' standard deviation',parsed.bold[1]);data.note='Mean ± one standard deviation; no normal distribution is assumed.';}
    }else{
      data.values=values.map(Number);if(data.values.some(n=>!Number.isFinite(n)))throw new Error('Use finite numerical inputs.');
      const [a,b,c,d]=data.values;
      switch(key){
        case 'fraction':{const model=input.fraction||window.calulerFractionModel.evaluate(raw).fraction;data.fraction=model;data.result=model.value;data.title='Fraction '+model.name;data.caption=model.operation==='multiply'?'Product magnitude as an area; signs remain explicit.':model.operation==='divide'?'The quotient counts signed multiples of the divisor.':'Operand and result bars use one signed number scale.';row('Exact fraction',model.exact);if(model.mixed)row('Mixed number',model.mixed);row('Decimal',model.decimal);data.note=model.operation==='multiply'?'A × B · shaded area uses magnitudes; the signed factors determine the result sign.':model.operation==='divide'?'A ÷ B · the quotient Q satisfies A = Q × B.':'A '+model.symbol+' B · each unit has the same length on all three bars.';break;}
        case 'ratio':if(a<0||b<=0)throw new Error('Use a nonnegative first value and positive second value.');data.result=a/b;row('Equivalent ratio',parsed.bold[0]);data.note='Bar lengths share the same linear scale.';break;
        case 'gcd':case 'lcm':data.values=[Math.trunc(a),Math.trunc(b)];if(data.values.every(n=>n===0))throw new Error('A common grouping unit is not defined for two zero inputs.');data.result=Number(parsed.bold[0]);row(key==='gcd'?'Greatest common divisor':'Least common multiple',parsed.bold[0]);data.note='Groups use absolute values; integer truncation matches the existing calculator.';if(!Number.isSafeInteger(data.result)||data.result<=0)throw new Error('The grouping diagram needs a positive, safely representable integer result.');break;
        case 'prime-number-checker':data.n=Math.trunc(a);if(!Number.isSafeInteger(data.n)||data.n<0)throw new Error('Use a nonnegative safe integer for a prime diagram.');data.prime=/\bis prime\./.test(parsed.text);data.result=data.n;row('Classification',data.prime?'Prime':'Not prime');data.note='The classification comes from the original checker.';break;
        case 'quadratic-equation':if(!a)throw new Error('A quadratic requires a nonzero coefficient a.');data.D=b*b-4*a*c;data.vertex=[-b/(2*a),c-b*b/(4*a)];data.roots=data.D<0?[]:[(-b-Math.sqrt(data.D))/(2*a),(-b+Math.sqrt(data.D))/(2*a)];data.result=data.D;row('Discriminant',parsed.bold[0]);row('Real roots',data.roots.length?parsed.bold.slice(1).join(', '):'None');row('Vertex V','('+data.vertex.map(fmt).join(', ')+')');data.note='f(x) = '+a+'x² + ('+b+')x + ('+c+'). Roots are real-axis intersections.';break;
        case 'percentage':if(!b)throw new Error('The total must be nonzero.');row('Percentage',data.output);data.note=a>=0&&b>0&&a<=b?'The highlighted part occupies its actual share of one whole.':'Signed comparison; signed amounts and values outside 0–100% are not clipped into a part-to-whole bar.';break;
        case 'matrix-inverse-22':data.det=a*d-b*c;data.inverse=data.det===0?null:JSON.parse(String(input.result));if(data.inverse)data.inverse=data.inverse.flat();data.result=data.det;data.note='A A⁻¹ = I for a nonsingular matrix; inverse entries keep their original calculated precision.';break;
        case 'matrix-determinant-22':row('Column 1','('+a+', '+c+')');row('Column 2','('+b+', '+d+')');row('Determinant',data.output);data.note='Unsigned parallelogram area = |det A|; the determinant also records orientation.';break;
        case 'matrix-trace-22':row('Trace',data.output);data.note='tr(A) = a₁₁ + a₂₂; off-diagonal entries do not contribute.';break;
        case 'polynomial-value':row('f('+d+')',data.output);data.note='f(x) = '+a+'x² + ('+b+')x + ('+c+'). P is the calculated point.';break;
        case 'vector-dot-product':data.products=[a*d,b*data.values[4],c*data.values[5]];row('A · B',data.output);data.note='A · B = AₓBₓ + AᵧBᵧ + A_zB_z. Bars show signed component contributions.';break;
        case 'vector-magnitude':if(data.result===0&&data.values.some(n=>n!==0))throw new Error('The calculated magnitude underflowed; a nonzero vector cannot be shown as zero length.');row('Vector magnitude',data.output);data.note='3D coordinate projection; on-screen angles and lengths are foreshortened. |v| = √(x² + y² + z²).';break;
        case 'complex-number-magnitude':if(data.result===0&&(a!==0||b!==0))throw new Error('The calculated magnitude underflowed; a nonzero complex point cannot be shown as zero distance.');row('Complex number z',a+(b<0?' − ':' + ')+Math.abs(b)+'i');row('|z|',data.output);data.note='Equal coordinate scales; |z| = √(a² + b²).';break;
        case 'logarithm':if(a<=0||b<=0||b===1)throw new Error('A real logarithm needs x > 0, b > 0 and b ≠ 1.');row('Input x',a);row('Base b',b);row('log_b(x)',data.output);data.note='The marked point satisfies b^y = x.';break;
        case 'permutation':case 'combination':if(!Number.isSafeInteger(a)||!Number.isSafeInteger(b)||a<0||b<0||b>a)throw new Error('Use integers with 0 ≤ r ≤ n for a counting diagram.');row(key==='permutation'?'Ordered selections':'Unordered selections',data.output);data.note=key==='permutation'?'nPr = n(n−1)…(n−r+1); order matters.':'nCr = n! / (r!(n−r)!); order does not matter.';break;
        case 'probability-of-independent-events':if(a<0||a>1||b<0||b>1)throw new Error('Probabilities must lie between 0 and 1.');row('P(A ∩ B)',data.output);data.note='Independence gives P(A ∩ B) = P(A) × P(B). Rectangle area represents probability.';break;
        case 'z-score':if(c<=0)throw new Error('Standard deviation must be positive.');row('Observed x',a);row('Mean μ',b);row('Standardized z-score',data.output);data.note='z = (x − μ) / σ. A normal distribution is not assumed.';break;
        case 'linear-regression-slope':if(Math.abs(a)>1||b<0||c<=0)throw new Error('Use −1 ≤ r ≤ 1, σy ≥ 0 and σx > 0.');row('Run σx',c);row('Rise rσy',a*b);row('Regression slope',data.output);data.note='b = r σy / σx. The line uses centred differences; no intercept or raw observations are invented.';break;
        case 'geometric-mean':if(a<0||b<0)throw new Error('This real geometric-mean diagram requires nonnegative values.');row('Geometric mean',data.output);data.note=a&&b?'G = √(ab); G is the midpoint on a logarithmic scale.':'A zero factor gives a zero geometric mean; zero cannot be placed on a logarithmic axis.';break;
      }
    }
    if(typeof data.result==='number'&&!Number.isFinite(data.result))throw new Error('These calculated values exceed the finite diagram range.');
    return data;
  }
  function draw(data){
    const v=data.values,[a,b,c,d]=v;
    switch(key){
      case 'fraction':{
        const f=data.fraction,A=f.aValue,B=f.bValue;
        const raw=data.fractionInputs||[f.aLabel,f.bLabel],operand=i=>(i?'B':'A')+' = '+raw[i]+'\nDecimal: '+exactNumber(i?B:A),decimal=f.decimal.replace(/(\.\d*?)0+$/,'$1').replace(/\.$/,''),resultTip='A '+f.symbol+' B = '+f.exact+'\nDecimal: '+decimal;
        if(f.operation==='add'||f.operation==='subtract'){
          const parts=[A,f.operation==='subtract'?-B:B,f.value],lo=Math.floor(Math.min(0,...parts)),hi=Math.ceil(Math.max(1,...parts)),x=n=>128+206*fraction(n,lo,hi),zero=x(0);
          const labels=['A · '+f.aLabel,(f.operation==='subtract'?'−B':'B')+' · '+(f.operation==='subtract'?'−('+f.bLabel+')':f.bLabel),f.label];
          parts.forEach((value,i)=>{const y=28+i*55,tone=i===2?'green':value<0?'amber':'blue';fit(text(16,y+18,labels[i],'start'),100);shape('rect',{x:128,y,width:206,height:25,rx:6,'fill-opacity':.05,'stroke-opacity':.3,'stroke-width':1},'muted');const fill=shape('rect',{x:Math.min(zero,x(value)),y,width:Math.abs(x(value)-zero),height:25,rx:4,fill:ink(tone),'fill-opacity':i===2?.94:.82,'data-fraction-value':value,'data-fraction-scale-min':lo,'data-fraction-scale-max':hi},tone),target=inspect(fill,i===2?resultTip:operand(i)+(i===1&&f.operation==='subtract'?'\nSubtracted contribution: '+exactNumber(value):''));line(zero,y-3,zero,y+28,'muted');if(hi-lo<=8)for(let unit=Math.ceil(lo);unit<=hi;unit++)if(unit!==0)line(x(unit),y,x(unit),y+25,'muted',{opacity:.3,'pointer-events':'none'});if(value===0)shape('circle',{cx:zero,cy:y+12.5,r:3,fill:C[tone],'fill-opacity':1},tone,target);});
          line(128,204,334,204);const ticks=[lo,...(lo<0&&x(0)-x(lo)>42&&x(hi)-x(0)>42?[0]:[]),hi];if(hi-lo<=8){const step=Math.max(1,Math.ceil((hi-lo)/3));for(let unit=Math.ceil(lo/step)*step;unit<hi;unit+=step)if(unit>lo&&Math.abs(x(unit)-x(lo))>42&&Math.abs(x(hi)-x(unit))>42&&!ticks.includes(unit))ticks.push(unit);}ticks.sort((a,b)=>a-b);ticks.forEach((value,i,all)=>{line(x(value),200,x(value),208);fit(text(x(value),225,tick(value),i===0?'start':i===all.length-1?'end':'middle',{class:'math-tick'}),42);});text(231,245,'Shared number scale','middle',{class:'math-tick'});
        }else if(f.operation==='multiply'){
          const scale=Math.max(1,Math.abs(A),Math.abs(B)),left=84,bottom=177,w=240,h=125;
          line(left,bottom,left+w,bottom);line(left,bottom,left,bottom-h);const product=shape('rect',{x:left,y:bottom-h*(Math.abs(B)/scale),width:w*(Math.abs(A)/scale),height:h*(Math.abs(B)/scale),fill:ink(f.value<0?'amber':'green'),'fill-opacity':.32,'data-fraction-area':Math.abs(A/scale*(B/scale))},f.value<0?'amber':'green');inspect(product,resultTip+'\nArea uses absolute factor lengths.');inspect(line(left,bottom,left+w*(Math.abs(A)/scale),bottom,'blue',{'stroke-width':2.5}),operand(0));inspect(line(left,bottom,left,bottom-h*(Math.abs(B)/scale),'amber',{'stroke-width':2.5}),operand(1));
          text(left-10,bottom+18,'0','end',{class:'math-tick'});fit(text(left+w,bottom+18,tick(scale),'end',{class:'math-tick'}),72);fit(text(left-10,bottom-h+5,tick(scale),'end',{class:'math-tick'}),68);fit(text(180,25,'Magnitude area · sign from A × B'),320);fit(text(24,223,'A = '+f.aLabel,'start'),148);fit(text(336,223,'B = '+f.bLabel,'end'),148);
          if(!A||!B)text(190,115,'Zero product','middle',{class:'math-tick'});
        }else{
          const q=f.value,lo=Math.min(0,q),hi=Math.max(1,q),x=n=>64+270*fraction(n,lo,hi);
          inspect(fit(text(24,39,'A = '+f.aLabel,'start'),148),operand(0));inspect(fit(text(336,39,'B = '+f.bLabel,'end'),148),operand(1));line(64,128,334,128);inspect(arrow(x(0),103,x(q),103,q<0?'amber':'green'),resultTip);
          const ticks=new Set([lo,0,hi]);if(hi-lo<=10)for(let unit=Math.ceil(lo);unit<=hi;unit++)ticks.add(unit);
          const ordered=Array.from(ticks).sort((a,b)=>a-b),labels=[lo,hi],bounds=value=>{const width=Math.min(56,tick(value).length*9),left=x(value)-(value===lo?0:value===hi?width:width/2);return[left,left+width];};
          ordered.forEach(value=>{line(x(value),123,x(value),134);if(value===lo||value===hi)return;const box=bounds(value);if(labels.every(other=>{const peer=bounds(other);return box[1]+6<=peer[0]||peer[1]+6<=box[0];}))labels.push(value);});
          labels.sort((a,b)=>a-b).forEach(value=>fit(text(x(value),157,tick(value),value===lo?'start':value===hi?'end':'middle',{class:'math-tick'}),56));inspect(shape('circle',{cx:x(q),cy:128,r:4,fill:C.green,'fill-opacity':1},'green'),resultTip);text(limit(x(q),76,324),83,'Q','middle',{class:'math-value'});text(180,199,'One step = one divisor B');text(180,229,'Quotient number line','middle',{class:'math-tick'});
        }
        break;}
      case 'ratio':bars([{label:'First',value:a},{label:'Second',value:b,tone:'amber'}]);break;
      case 'average':case 'median':strip(data.numbers,[{value:data.result,label:key==='average'?'Mean':'Median'}]);break;
      case 'standard-deviation':{const s=strip(data.numbers,[{value:data.mean,label:'Mean'}],[...data.numbers,data.mean-data.result,data.mean+data.result]);inspect(shape('rect',{x:s.x(data.mean-data.result),y:183,width:s.x(data.mean+data.result)-s.x(data.mean-data.result),height:13,rx:3},'green'),'Standard deviation = '+exactNumber(data.result)+'\nMean ± σ: '+exactNumber(data.mean-data.result)+' to '+exactNumber(data.mean+data.result));text(180,229,'One standard deviation on either side');break;}
      case 'mode':frequencyBars(data);break;
      case 'gcd':{const unit=data.result,max=Math.max(...v.map(Math.abs))||1;v.forEach((n,i)=>{const y=48+i*73,w=238*Math.abs(n)/max;fit(text(18,y+22,fmt(n),'start'),68);shape('rect',{x:100,y,width:238,height:29,rx:6,'fill-opacity':.04,'stroke-opacity':.25,'stroke-width':1},'muted');inspect(shape('rect',{x:100,y,width:w,height:29,rx:6,fill:ink(i?'amber':'blue'),'fill-opacity':.85},i?'amber':'blue'),(i?'B':'A')+' = '+exactNumber(n)+'\nGCD = '+exactNumber(unit)+'\nGroups = '+exactNumber(Math.abs(n)/unit));const groups=Math.abs(n)/unit;if(groups<=24&&w/groups>=8)for(let k=1;k<groups;k++)line(100+w*k/groups,y,100+w*k/groups,y+29,'muted',{'pointer-events':'none'});fit(text(338,y+53,fmt(groups)+' groups × '+fmt(unit),'end'),250);});break;}
      case 'lcm':{const m=data.result;v.forEach((n,i)=>{n=Math.abs(n);const y=65+i*82;shape('rect',{x:86,y:y-3,width:244,height:6,rx:3,'fill-opacity':.08,'stroke-width':0},'muted');line(86,y,330,y,'muted',{'stroke-width':1.3,opacity:.5});fit(text(14,y+5,(i?'B':'A')+' = '+fmt(n),'start'),66);const count=m/n;for(let k=0;k<Math.min(count,12);k++){const x=86+244*(k/count);inspect(shape('circle',{cx:x,cy:y,r:4,fill:ink('blue'),'fill-opacity':1}),'Multiple '+k+' × '+exactNumber(n)+' = '+exactNumber(k*n));}inspect(shape('circle',{cx:330,cy:y,r:6,fill:ink('green'),'fill-opacity':1},'green'),'LCM = '+exactNumber(m)+'\n'+exactNumber(count)+' × '+exactNumber(n));if(count>12)text(180,y-16,'… '+fmt(count)+' multiples');});line(330,42,330,170,'green',{'stroke-dasharray':'3 4'});text(330,202,'LCM','end');break;}
      case 'prime-number-checker':{let factor=null;if(!data.prime&&data.n>=4)for(let k=2;k<=Math.sqrt(data.n)&&k<=10000;k++)if(data.n%k===0){factor=k;break;}relation(data.prime?[['Divisors','1 and '+fmt(data.n),'1 and '+exactNumber(data.n)],['Integer',fmt(data.n),exactNumber(data.n)]]:factor?[['Factor',fmt(factor),exactNumber(factor)],['Factor',fmt(data.n/factor),exactNumber(data.n/factor)]]:[['Integer',fmt(data.n),exactNumber(data.n)],['Classification','Not prime']],data.prime?'Exactly two positive divisors':factor?'Product = '+fmt(data.n):data.n<2?'Integers below 2 are not prime.':'Composite, per the original checker.');break;}
      case 'quadratic-equation':case 'polynomial-value':{const roots=data.roots||[],vx=a?-b/(2*a):0,center=key==='polynomial-value'?d:vx;let xd=renderContext?.overrides?.[0]?.x||extent([0,center,...roots]),points=Array.from({length:121},(_,i)=>{const x=xd[0]*(1-i/120)+xd[1]*(i/120);return[x,(a*x+b)*x+c];});const p=plot(points.map(x=>x[0]),points.map(x=>x[1]),{yLabel:'f(x)'});p.curve(Array.from({length:121},(_,i)=>{const x=blend(p.xd[0],p.xd[1],i/120);return [x,(a*x+b)*x+c];}));if(key==='polynomial-value')p.point(d,data.result,'P');else{if(data.D===0){const mark=p.point(...data.vertex,'','amber');const detail='Repeated root and vertex: ('+data.vertex.map(exactNumber).join(', ')+')';mark.setAttribute('aria-label',detail);mark.setAttribute('data-math-tip',detail);}else{p.point(...data.vertex,'V','amber');Array.from(new Set(roots)).forEach(x=>{const mark=p.point(x,0,'','green');const detail='Real root: ('+exactNumber(x)+', 0)';mark.setAttribute('aria-label',detail);mark.setAttribute('data-math-tip',detail);});}}break;}
      case 'percentage':if(a>=0&&b>0&&a<=b)percentageTrack(data);else bars([{label:'Part',value:a},{label:'Whole',value:b,tone:'amber'}]);break;
      case 'matrix-determinant-22':{const p=plot([0,a,b,a+b],[0,c,d,c+d],{equal:true});inspect(shape('polygon',{points:[[0,0],[a,c],[a+b,c+d],[b,d]].map(([x,y])=>p.x(x)+','+p.y(y)).join(' '),fill:ink('green'),'fill-opacity':.24},'green'),'Determinant = '+exactNumber(data.result)+'\nArea = '+exactNumber(Math.abs(data.result)));inspect(arrow(p.x(0),p.y(0),p.x(a),p.y(c)),'Column 1 = ('+exactNumber(a)+', '+exactNumber(c)+')');inspect(arrow(p.x(0),p.y(0),p.x(b),p.y(d),'amber'),'Column 2 = ('+exactNumber(b)+', '+exactNumber(d)+')');p.point(a,c,'col₁','blue');p.point(b,d,'col₂','amber',18);break;}
      case 'matrix-inverse-22':break; // Responsive HTML entries retain the original inverse precision.
      case 'matrix-trace-22':matrix(v,106,52,148,true);text(180,184,'a₁₁ + a₂₂');break;
      case 'vector-dot-product':bars(data.products.map((n,i)=>({label:['AₓBₓ','AᵧBᵧ','A_zB_z'][i],value:n,tone:n<0?'amber':'blue'})));break;
      case 'vector-magnitude':{const max=renderContext?.vectorScale||Math.max(...v.map(Math.abs))||1;if(renderContext)renderContext.vectorScale=max;const project=(x,y,z)=>[152+60*(x/max-.6*(z/max)),120+60*(-y/max+.35*(z/max))];[[1,0,0,'x'],[0,1,0,'y'],[0,0,1,'z']].forEach(([x,y,z,label])=>{const p=project(x*max,y*max,z*max);arrow(152,120,...p,'muted');text(p[0]+10,p[1]-8,label);});const componentPoints=[[0,0,0],[a,0,0],[a,b,0],[a,b,c]];['x','y','z'].forEach((label,i)=>{const start=project(...componentPoints[i]),end=project(...componentPoints[i+1]);inspect(line(...start,...end,['blue','amber','green'][i],{'stroke-width':2,'stroke-dasharray':'4 4'}),label+' component = '+exactNumber(v[i]));});const endpoint=project(a,b,c);inspect(arrow(152,120,...endpoint,'blue'),'Vector = ('+v.map(exactNumber).join(', ')+')\nMagnitude = '+exactNumber(data.result));fit(text(180,235,'('+v.map(fmt).join(', ')+')'),310);break;}
      case 'complex-number-magnitude':{const p=plot([0,a],[0,b],{xLabel:'Real',yLabel:'Imaginary',equal:true});shape('polygon',{points:[[0,0],[a,0],[a,b]].map(([x,y])=>p.x(x)+','+p.y(y)).join(' '),'fill-opacity':.08},'blue');inspect(line(p.x(a),p.y(0),p.x(a),p.y(b),'muted',{'stroke-dasharray':'4 4'}),'Imaginary part = '+exactNumber(b));inspect(line(p.x(0),p.y(b),p.x(a),p.y(b),'muted',{'stroke-dasharray':'4 4'}),'Real part = '+exactNumber(a));inspect(arrow(p.x(0),p.y(0),p.x(a),p.y(b),'blue'),'z = ('+exactNumber(a)+', '+exactNumber(b)+')\nMagnitude = '+exactNumber(data.result));p.point(a,b,'z');break;}
      case 'logarithm':{const lo=Math.min(a,1)*.3,hi=Math.min(Number.MAX_VALUE,Math.max(a,1)*1.3);if(!(lo>0&&hi>lo))throw new Error('This logarithm exceeds the plotting range.');const points=Array.from({length:121},(_,i)=>{const x=lo*(1-i/120)+hi*(i/120);return[x,Math.log(x)/Math.log(b)];});const p=plot(points.map(x=>x[0]),points.map(x=>x[1]),{yLabel:'log_b(x)'});p.curve(Array.from({length:161},(_,i)=>{const x=blend(p.xd[0],p.xd[1],i/160);return [x,x>0?Math.log(x)/Math.log(b):NaN];}));p.point(1,0,'1');p.point(a,data.result,'P','green',a===1?20:-12);break;}
      case 'permutation':{const shown=Math.min(8,b),w=shown?Math.min(60,290/shown):60;fit(text(180,34,'Available choices per ordered position','middle',{class:'math-axis-title'}),320);if(!b){relation([['Selected','0 items'],['Empty choice','1 way']]);break;}for(let i=0;i<shown;i++){inspect(shape('rect',{x:30+i*w,y:78,width:w-6,height:48,rx:7,fill:ink('blue'),'fill-opacity':.13,'stroke-opacity':.55}),'Position '+(i+1)+'\nAvailable choices = '+exactNumber(a-i)+'\nTotal ordered selections = '+exactNumber(data.result));fit(text(30+i*w+(w-6)/2,108,fmt(a-i),'middle',{class:'math-value'}),w-12);}fit(text(180,174,b>shown?'First '+shown+' of '+fmt(b)+' positions':'Multiply the choices for each position','middle',{class:'math-axis-title'}),320);break;}
      case 'combination':{if(a===0){relation([['Selected','0 items'],['Empty choice','1 way']],'The empty selection is one combination.');break;}const count=Math.min(a,30),selected=a?Math.round(b/a*count):0;for(let i=0;i<count;i++)inspect(shape('circle',{cx:43+(i%10)*30,cy:58+Math.floor(i/10)*33,r:8,fill:i<selected?ink('green'):C.muted,'fill-opacity':i<selected?.9:.08,'stroke-opacity':i<selected?1:.35},i<selected?'green':'muted'),'Choose '+exactNumber(b)+' from '+exactNumber(a)+'\nCombinations = '+exactNumber(data.result)+(a>30?'\nSchematic sample; this dot is not an individual item.':'\nExample item '+(i+1)+'; order ignored.'));text(180,191,fmt(b)+' selected from '+fmt(a));text(180,224,a>30?'Proportional sample · order ignored':'Order ignored');break;}
      case 'probability-of-independent-events':{const x=100,y=38,w=160,h=160;inspect(shape('rect',{x,y,width:w,height:h,'fill-opacity':.04,'stroke-opacity':.65},'muted'),'Sample space = 1');inspect(shape('rect',{x,y,width:w*a,height:h,fill:ink('blue'),'fill-opacity':.28},'blue'),'P(A) = '+exactNumber(a));inspect(shape('rect',{x,y,width:w,height:h*b,fill:ink('amber'),'fill-opacity':.22},'amber'),'P(B) = '+exactNumber(b));inspect(shape('rect',{x,y,width:w*a,height:h*b,fill:ink('green'),'fill-opacity':.65},'green'),'P(A ∩ B) = '+exactNumber(data.result));text(x+w/2,25,'P(A) = '+fmt(a));fit(text(91,124,'P(B) = '+fmt(b),'end'),82);text(180,232,'Unit probability square');break;}
      case 'z-score':{const all=[a,b,b-c,b+c],s=strip([a],[{value:b,label:'μ'},{value:a,label:'x',tone:'amber'}],all);inspect(shape('rect',{x:s.x(b-c),y:184,width:s.x(b+c)-s.x(b-c),height:16,rx:4,'fill-opacity':.1,'stroke-opacity':.3},'green'),'Mean ± σ: '+exactNumber(b-c)+' to '+exactNumber(b+c));inspect(arrow(s.x(b),192,s.x(a),192,'green'),'x − μ = '+exactNumber(a-b)+'\nσ = '+exactNumber(c)+'\nz = '+exactNumber(data.result));text(180,231,'σ = '+fmt(c));break;}
      case 'linear-regression-slope':{const rise=a*b,run=c,p=plot([-run,0,run],[-rise,0,rise],{xLabel:'Δx',yLabel:'Δŷ'});shape('polygon',{points:[[0,0],[run,0],[run,rise]].map(([x,y])=>p.x(x)+','+p.y(y)).join(' '),'fill-opacity':.08},'green');p.curve([[-run,-rise],[run,rise]]);inspect(line(p.x(0),p.y(0),p.x(run),p.y(0),'amber',{'stroke-dasharray':'4 4'}),'Run σx = '+exactNumber(run));inspect(line(p.x(run),p.y(0),p.x(run),p.y(rise),'amber',{'stroke-dasharray':'4 4'}),'Rise rσy = '+exactNumber(rise));p.point(run,rise,'P');break;}
      case 'geometric-mean':if(a&&b){const values=[Math.log(a),Math.log(b),Math.log(data.result)],domain=extent(values),x=n=>35+fraction(n,...domain)*290;line(35,128,325,128,'muted',{'stroke-width':2});for(let i=0;i<=8;i++)line(35+290*i/8,124,35+290*i/8,132,'muted',{opacity:i%2?.3:.55,'stroke-width':1});[[a,'a',a<=b?90:270,'blue'],[b,'b',a<=b?270:90,'amber'],[data.result,'G',limit(x(Math.log(data.result)),90,270),'green']].forEach(([n,label,labelX,tone])=>{const point=x(Math.log(n));inspect(line(point,label==='G'?121:135,labelX,label==='G'?88:169,tone,{'stroke-dasharray':'3 3'}),label+' = '+exactNumber(n));inspect(shape('circle',{cx:point,cy:128,r:5,fill:ink(tone),'fill-opacity':1},tone),label+' = '+exactNumber(n));fit(text(labelX,label==='G'?75:193,label==='G'?'G':label+' = '+fmt(n),'middle',{class:label==='G'?'math-marker-label':'math-tick',fill:C[tone]}),label==='G'?100:150);});text(180,238,'Logarithmic number line','middle',{class:'math-axis-title'});}else relation([['a',fmt(a),exactNumber(a)],['b',fmt(b),exactNumber(b)]],'Zero-factor relationship');break;
    }
  }
  function syncActions(ready){panel.querySelectorAll('.caluler-diagram-download,.caluler-diagram-print').forEach(b=>{b.disabled=!ready;b.setAttribute('aria-disabled',String(!ready));});}
  function inverseEntries(data){
    const content=document.createElement('div');content.className='math-matrices';
    const add=(title,entries)=>{const figure=document.createElement('figure'),caption=document.createElement('figcaption'),grid=document.createElement('div');caption.textContent=title;grid.className='math-matrix';entries.forEach((n,i)=>{if(!Number.isFinite(n))throw new Error('The inverse exceeds the finite diagram range.');const cell=document.createElement('span');cell.textContent=String(n);inspect(cell,title+' entry ('+(Math.floor(i/2)+1)+', '+(i%2+1)+') = '+exactNumber(n));grid.append(cell);});figure.append(caption,grid);content.append(figure);};
    add('A',data.values);if(data.inverse)add('A⁻¹',data.inverse);else{const message=document.createElement('p');message.textContent='Singular matrix: det A = 0. No inverse exists.';content.append(message);}return content;
  }
  function previewPrime(value){
    // Deterministic Miller–Rabin bases for 64-bit integers; inputs are safe JS integers.
    if(value<2)return false;const n=BigInt(value);
    for(const p of [2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n]){if(n===p)return true;if(n%p===0n)return false;}
    let d=n-1n,s=0;while(d%2n===0n){d/=2n;s++;}
    const power=(a,b)=>{let r=1n;for(;b;b>>=1n,a=a*a%n)if(b&1n)r=r*a%n;return r;};
    for(const base of [2n,325n,9375n,28178n,450775n,9780504n,1795265022n]){if(base%n===0n)continue;let x=power(base%n,d);if(x===1n||x===n-1n)continue;let passed=false;for(let j=1;j<s;j++){x=x*x%n;if(x===n-1n){passed=true;break;}}if(!passed)return false;}return true;
  }
  function snapshot(raw){
    if(key==='fraction')return window.calulerFractionModel.evaluate(raw);
    const ids=definitions[key][2].split(' ');if(ids.some(id=>String(raw[id]??'').trim()===''))throw new Error('Complete the required inputs.');
    const gcd=(a,b)=>{a=Math.abs(Math.trunc(a));b=Math.abs(Math.trunc(b));if(!Number.isFinite(a)||!Number.isFinite(b))throw new Error('Use finite integers.');while(b)[a,b]=[b,a%b];return a||1;};
    const html=out=>({raw:{...raw},html:out});
    if(['average','median','mode','standard-deviation'].includes(key)){
      const a=String(raw.numbers).split(',').map(Number).filter(Number.isFinite);if(!a.length||a.length>10000)throw new Error('Use a supported finite data set.');
      const mean=a.reduce((x,y)=>x+y,0)/a.length;
      if(key==='average')return html('Average: <b>'+mean.toFixed(4)+'</b><br>Count: <b>'+a.length+'</b>');
      if(key==='median'){const sorted=a.slice().sort((a,b)=>a-b),j=Math.floor(a.length/2),value=a.length%2?sorted[j]:(sorted[j-1]+sorted[j])/2;return html('Median: <b>'+value+'</b>');}
      if(key==='mode'){const m=new Map();a.forEach(n=>m.set(n,(m.get(n)||0)+1));const f=Math.max(...m.values());return html('Mode: <b>'+Array.from(m).filter(v=>v[1]===f).map(v=>v[0]).join(', ')+'</b><br>Frequency: <b>'+f+'</b>');}
      if(raw.kind==='sample'&&a.length<2)throw new Error('Sample spread needs two values.');const variance=a.reduce((sum,n)=>sum+(n-mean)**2,0)/(a.length-(raw.kind==='sample'?1:0));return html('Mean: <b>'+mean.toFixed(4)+'</b><br>Standard deviation: <b>'+Math.sqrt(variance).toFixed(4)+'</b>');
    }
    const values=ids.map(id=>id.startsWith('v')?parseFloat(raw[id]):Number(raw[id]));if(values.some(n=>!Number.isFinite(n)))throw new Error('Use finite inputs.');const [a,b,c,d,e,f]=values;let result;
    switch(key){
      case 'ratio':{if(a<0||b<=0)throw new Error('Invalid ratio.');const g=gcd(a,b);return html('Simplified ratio: <b>'+a/g+':'+b/g+'</b>');}
      case 'gcd':return html('GCD: <b>'+gcd(a,b)+'</b>');
      case 'lcm':{const x=Math.trunc(a),y=Math.trunc(b);if(!x||!y)throw new Error('Nonzero integers required.');return html('LCM: <b>'+Math.abs(x/gcd(x,y)*y)+'</b>');}
      case 'prime-number-checker':{const n=Math.trunc(a);if(!Number.isSafeInteger(n)||n<0)throw new Error('Use a nonnegative safe integer.');return html(n<2?'Not prime.':'<b>'+n+'</b> is '+(previewPrime(n)?'':'not ')+'prime.');}
      case 'quadratic-equation':{if(!a)throw new Error('Nonzero quadratic coefficient required.');const D=b*b-4*a*c;return html('Discriminant: <b>'+D+'</b><br>'+(D<0?'No real roots.':'Roots: <b>'+((-b+Math.sqrt(D))/(2*a)).toFixed(4)+'</b> and <b>'+((-b-Math.sqrt(D))/(2*a)).toFixed(4)+'</b>'));}
      case 'percentage':if(!b)throw new Error('Nonzero total required.');result=a/b*100;break;
      case 'polynomial-value':result=a*d*d+b*d+c;break;
      case 'matrix-determinant-22':result=a*d-b*c;break;
      case 'matrix-inverse-22':{const det=a*d-b*c;result=det===0?'No inverse (determinant is zero)':'[['+d/det+', '+(-b/det)+'], ['+(-c/det)+', '+a/det+']]';break;}
      case 'matrix-trace-22':result=a+d;break;
      case 'vector-dot-product':result=a*d+b*e+c*f;break;
      case 'vector-magnitude':result=Math.sqrt(a*a+b*b+c*c);break;
      case 'complex-number-magnitude':result=Math.sqrt(a*a+b*b);break;
      case 'logarithm':result=Math.log(a)/Math.log(b);break;
      case 'permutation':case 'combination':{if(!Number.isSafeInteger(a)||!Number.isSafeInteger(b)||a<0||b<0||b>a)throw new Error('Use integers with 0 ≤ r ≤ n.');result=1;const k=key==='combination'?Math.min(b,a-b):b;for(let i=1;i<=k;i++){result=key==='combination'?result*(a-k+i)/i:result*(a-i+1);if(!Number.isFinite(result))throw new Error('Counting result exceeds the finite range.');}break;}
      case 'probability-of-independent-events':result=a*b;break;
      case 'z-score':result=(a-b)/c;break;
      case 'linear-regression-slope':result=a*b/c;break;
      case 'geometric-mean':result=Math.sqrt(a*b);break;
    }
    if(typeof result==='number'&&!Number.isFinite(result))throw new Error('The preview exceeds the finite calculation range.');
    return{values,result,display:key==='percentage'?result.toFixed(2)+'%':typeof result==='number'?Number(result.toPrecision(8)).toLocaleString(undefined,{maximumFractionDigits:8}):String(result)};
  }
  function neutral(){
    visualDefs();svg.classList.add('math-neutral');svg.setAttribute('aria-label',definitions[key][0]+': neutral mathematical illustration, no calculated values.');
    if(['fraction','ratio','percentage','gcd','lcm'].includes(key)){const labels=key==='fraction'?['a / b','c / d','Σ']:['A','B'];labels.forEach((label,i)=>{const y=25+i*48;shape('rect',{x:100,y,width:225,height:26,rx:4},'muted');text(42,y+19,label);});}
    else if(key.startsWith('matrix')){['a₁₁','a₁₂','a₂₁','a₂₂'].forEach((n,i)=>{shape('rect',{x:106+(i%2)*80,y:50+Math.floor(i/2)*53,width:68,height:43,rx:6,'stroke-opacity':.25,'fill-opacity':.06},'blue');text(140+(i%2)*80,77+Math.floor(i/2)*53,n);});line(85,45,85,149);line(275,45,275,149);}
    else if(['quadratic-equation','polynomial-value','complex-number-magnitude','vector-magnitude','vector-dot-product','linear-regression-slope'].includes(key)){const base=Math.min(viewHeight-45,170);for(let i=0;i<5;i++){line(85+i*56,30,85+i*56,base,'muted',{opacity:.12,'stroke-width':1});line(85,30+i*(base-30)/4,325,30+i*(base-30)/4,'muted',{opacity:.12,'stroke-width':1});}arrow(65,base,325,base,'muted');arrow(85,base+25,85,30,'muted');text(322,base+24,'x');text(65,35,'y');if(key==='quadratic-equation'||key==='polynomial-value')el('path',{d:'M118 55 Q200 250 290 55',fill:'none',stroke:C.blue,'stroke-width':2.8,opacity:.65});else if(key==='vector-magnitude'){arrow(85,170,35,215,'muted');text(26,232,'z');}}
    else if(key==='probability-of-independent-events'){shape('rect',{x:100,y:38,width:160,height:160,rx:5,'fill-opacity':.06,'stroke-opacity':.55},'blue');text(180,25,'A');text(80,125,'B');}
    else if(['average','median','mode','standard-deviation','z-score'].includes(key)){line(35,130,325,130,'muted',{'stroke-width':2});['x₁','x₂','…','xₙ'].forEach((n,i)=>{shape('circle',{cx:65+i*75,cy:130,r:4,'fill-opacity':.45},'blue');text(65+i*75,105,n);});text(180,182,key==='standard-deviation'?'σ':key==='z-score'?'(x − μ) / σ':'Data → statistic');}
    else{shape('rect',{x:56,y:45,width:248,height:70,rx:12,'stroke-opacity':.3,fill:ink('blue'),'fill-opacity':.1},'blue');text(180,88,key==='logarithm'?'bʸ = x':key==='geometric-mean'?'G = √(ab)':key==='permutation'?'nPr':key==='combination'?'nCr':'n ↔ divisors','middle',{class:'math-value'});}
    note.textContent='Neutral illustration · enter valid values, then Calculate.';
  }
  function prepare(input,options={}){
    const data=describe(input),next=document.createElementNS(NS,'svg'),old=svg,previous=renderContext;
    const [a,b,c,d]=data.values;
    const focus=key==='polynomial-value'?[[d,data.result]]:key==='logarithm'?[[a,data.result],[1,0]]:key==='complex-number-magnitude'?[[0,0],[a,b]]:key==='matrix-determinant-22'?[[0,0],[a,c],[b,d],[a+b,c+d]]:key==='linear-regression-slope'?[[0,0],[c,a*b],[-c,-a*b]]:null;
    const context={domains:[],focus,...options};svg=next;renderContext=context;
    try{visualDefs();draw(data);}finally{svg=old;renderContext=previous;}
    // Prepare offscreen: invalid geometry can never blank the current picture.
    for(const n of next.querySelectorAll('path,line,polygon,rect,circle,text'))for(const name of ['d','points','x','y','cx','cy','x1','y1','x2','y2','width','height'])if(/NaN|Infinity/.test(n.getAttribute(name)||''))throw new Error('These values exceed the finite illustration range.');
    if(options.preview){const numbers=[...data.values.flat(),...(data.products||[]),data.result].filter(Number.isFinite);const tidy=s=>{for(const n of numbers)if(String(n).length>10)s=s.split(String(n)).join(fmt(n));return s;};data.note=tidy(data.note);data.rows=data.rows.map(row=>row.map(tidy));}
    const entries=key==='matrix-inverse-22'?inverseEntries(data):null,rows=document.createElement('dl');
    data.rows.forEach(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;rows.append(dt,dd);});
    data.domains=context.domains;data.barScale=context.barScale;data.barSigned=context.barSigned;data.vectorScale=context.vectorScale;
    return{data,next,entries,rows};
  }
  function reconcile(parent,next){
    const incoming=Array.from(next.childNodes);
    incoming.forEach((source,i)=>{
      let current=parent.childNodes[i];
      if(!current||current.nodeType!==source.nodeType||current.nodeName!==source.nodeName){const copy=source.cloneNode(true);parent.insertBefore(copy,current||null);if(current)current.remove();current=copy;}
      if(source.nodeType===3){current.nodeValue=source.nodeValue;return;}
      const names=source.getAttributeNames();for(const name of current.getAttributeNames())if(!names.includes(name))current.removeAttribute(name);for(const name of names)current.setAttribute(name,source.getAttribute(name));
      if(!source.children.length)current.textContent=source.textContent;else reconcile(current,source);
    });
    while(parent.childNodes.length>incoming.length)parent.lastChild.remove();
  }
  function apply(prepared){
    const {data,next,entries,rows}=prepared;reconcile(svg,next);svg.classList.remove('math-neutral');svg.hidden=!!entries;
    const box=document.createElement('div');if(entries)box.append(entries);reconcile(structured,box);reconcile(summary,rows);note.textContent=data.note;displayed=data;
    if(key==='fraction'){panel.querySelector('h2').textContent=data.title;panel.querySelector('.math-caption').textContent=data.caption;}
    panel.dataset.calulerDiagramReady='true';svg.setAttribute('aria-label',(data.title||definitions[key][0])+'. '+data.rows.map(x=>x.join(': ')).join('; '));syncActions(true);refreshTip();
  }
  function copyVisibleScene(){
    hideTip();
    // Rapid submissions before a paint must not accumulate invisible snapshots.
    const opaque=layers.findLastIndex(layer=>layer.alpha===1);
    if(opaque>=0){layers.splice(0,opaque).forEach(layer=>layer.node.remove());return;}
    const copy=scene.cloneNode(true),sources=scene.querySelectorAll('canvas'),canvases=copy.querySelectorAll('canvas');
    sources.forEach((source,i)=>{const target=canvases[i],box=source.getBoundingClientRect();target.width=source.width;target.height=source.height;target.getContext('2d').drawImage(source,0,0);target.style.width='100%';target.style.height=box.height+'px';});
    for(const n of [copy,...copy.querySelectorAll('[id]')])n.removeAttribute('id');copy.querySelectorAll('[tabindex]').forEach(n=>n.setAttribute('tabindex','-1'));
    copy.classList.add('math-motion-copy');copy.setAttribute('aria-hidden','true');copy.setAttribute('inert','');copy.setAttribute('data-caluler-diagram-export-ignore','');copy.style.opacity='1';
    host.insertBefore(copy,layers[0]?.node||null);layers.unshift({node:copy,alpha:1,start:1});
  }
  function finishMotion(){
    cancelAnimationFrame(raf);raf=0;
    if(motion?.target)apply(motion.target);
    layers.splice(0).forEach(layer=>layer.node.remove());host?.style.removeProperty('min-height');motion=null;nativePending=false;if(panel)panel.dataset.calulerAnimating='false';
  }
  function numericInput(values){const raw={};definitions[key][2].split(' ').forEach((id,i)=>raw[id]=String(values[i]));return snapshot(raw);}
  function morphable(from,to){
    if(!from||layers.length)return false;
    if(!['percentage','polynomial-value','matrix-determinant-22','matrix-trace-22','vector-dot-product','vector-magnitude','complex-number-magnitude','logarithm','z-score','linear-regression-slope','probability-of-independent-events'].includes(key))return false;
    const a=from.values,b=to.values;
    if(key==='percentage'){const whole=v=>v[0]>=0&&v[1]>0&&v[0]<=v[1];if(whole(a)!==whole(b)||Math.sign(a[1])!==Math.sign(b[1])||a.some(n=>n<0)!==b.some(n=>n<0))return false;}
    if(key==='logarithm'&&Math.sign(a[1]-1)!==Math.sign(b[1]-1))return false;
    if(key==='vector-dot-product'&&from.products.some(n=>n<0)!==to.products.some(n=>n<0))return false;
    return true;
  }
  function frame(from,to,t){
    const values=from.values.map((n,i)=>blend(n,to.values[i],t)),options={preview:true};
    options.overrides=from.domains.map((domain,i)=>({x:domain.x.map((n,j)=>blend(n,to.domains[i].x[j],t)),y:domain.y.map((n,j)=>blend(n,to.domains[i].y[j],t))}));
    const max=data=>Math.max(...(key==='vector-dot-product'?data.products:data.values).map(Math.abs))||0,old=max(from),end=max(to);
    options.barScale=blend(from.barScale||old||end||1,end||old||1,t);options.barSigned=from.barSigned;
    const magnitude=data=>Math.max(...data.values.map(Math.abs))||0,oldVector=from.vectorScale||magnitude(from),newVector=magnitude(to);
    options.vectorScale=blend(oldVector||newVector||1,newVector||oldVector||1,t);
    return prepare(numericInput(values),options);
  }
  function animate(target,mode){
    cancelAnimationFrame(raf);const from=displayed,start=performance.now(),oldHeight=host.getBoundingClientRect().height;
    if(mode==='fade'){if(!nativePending)copyVisibleScene();if(target)apply(target);}
    layers.forEach(layer=>layer.start=layer.alpha);const height=Math.max(oldHeight,host.getBoundingClientRect().height);if(height>0)host.style.minHeight=height+'px';
    motion={target,from,mode,start};panel.dataset.calulerAnimating='true';panel.dataset.mathMotion=mode;
    const step=now=>{
      const current=motion;if(!current)return;const p=limit((now-current.start)/duration,0,1),ease=(1-Math.cos(Math.PI*p))/2;
      if(p===1){finishMotion();return;}
      if(current.mode==='morph'){
        try{apply(frame(current.from,current.target.data,ease));}
        catch(_){try{copyVisibleScene();apply(current.target);current.mode='fade';current.fadeStart=ease;layers.forEach(layer=>layer.start=layer.alpha);}catch(_){finishMotion();return;}}
      }
      const fade=current.fadeStart==null?ease:(ease-current.fadeStart)/(1-current.fadeStart);
      layers.forEach(layer=>{layer.alpha=layer.start*(1-fade);layer.node.style.opacity=String(layer.alpha);});
      raf=requestAnimationFrame(step);
    };raf=requestAnimationFrame(step);
  }
  function commit(input,initial=false){
    if(!panel||key==='graphing')return;
    try{
      const target=prepare(input);committed=target;warning.hidden=true;
      if(initial||reduced.matches){finishMotion();apply(target);return;}
      let mode=morphable(displayed,target.data)?'morph':'fade';
      if(mode==='morph')try{frame(displayed,target.data,.5);}catch(_){mode='fade';}
      try{animate(target,mode);}catch(_){finishMotion();apply(target);}
    }catch(error){warning.textContent=(error?.message||'The diagram could not be displayed.')+' The last valid diagram is retained.';warning.hidden=false;}
  }
  function initialize(){
    if(displayed||edited||!definitions[key])return;
    try{const raw={};definitions[key][2].split(' ').forEach(id=>raw[id]=document.getElementById(id)?.value??'');if(key==='fraction')raw.operation=document.getElementById('operation')?.value||'add';const input=snapshot(raw),target=prepare(input);committed=target;apply(target);}catch(_){/* Empty/invalid inputs retain the neutral, uncalculated illustration. */}
  }
  function beforeGraph(){
    if(!panel||key!=='graphing'||reduced.matches)return;
    try{cancelAnimationFrame(raf);copyVisibleScene();nativePending=true;panel.dataset.calulerAnimating='true';}catch(_){finishMotion();}
  }
  function commitGraph(snapshot,initial=false){
    if(key!=='graphing'||!panel||!snapshot)return;
    const legend=panel.querySelector('.graph-legend');if(!legend)return;
    // The native canvas colors by compiled order, including when earlier inputs
    // are blank. Keep its third (dashed) series and theme palette in the legend.
    if(!initial&&!nativePending&&!reduced.matches)beforeGraph();
    nativeSnapshot={functions:snapshot.functions.slice(),view:{...snapshot.view}};
    const nodes=snapshot.functions.map(({name,expression},i)=>{const span=document.createElement('span'),dot=document.createElement('i');dot.className='legend-dot math-native-swatch-'+i;span.append(dot,document.createTextNode(name+' = '+expression));return inspect(span,name+' = '+expression);});legend.replaceChildren(...nodes);syncActions(nodes.length>0);panel.dataset.calulerDiagramReady=String(nodes.length>0);
    if(initial||reduced.matches)finishMotion();else try{animate(null,'fade');}catch(_){finishMotion();}
  }
  function hideTip(){
    activeTip?.classList.remove('math-tip-active');activeTip=null;dismissedTip=null;tipPointer=null;tipPinned=false;tipX=null;
    if(tooltip)tooltip.hidden=true;
  }
  function dismissTip(){const target=activeTip||dismissedTip;hideTip();dismissedTip=target;}
  function tipTarget(node){
    const target=node?.closest?.('[data-math-tip]');
    return target&&panel.contains(target)&&!target.closest('.math-motion-copy')?target:null;
  }
  function curveValue(x){
    const [a,b,c]=displayed.values;
    if(key==='quadratic-equation'||key==='polynomial-value')return(a*x+b)*x+c;
    if(key==='logarithm')return Math.log(x)/Math.log(b);
    return displayed.result*x; // Centred regression: intercept is not specified.
  }
  function svgPosition(pointer){
    const box=svg.getBoundingClientRect(),scale=Math.min(box.width/360,box.height/viewHeight);
    return{x:(pointer.x-box.left-(box.width-360*scale)/2)/scale,y:(pointer.y-box.top-(box.height-viewHeight*scale)/2)/scale};
  }
  function graphTip(node){
    if(node.hasAttribute('data-math-native')){
      const snapshot=nativeSnapshot,view=snapshot?.view,entries=snapshot?.functions||[];
      if(!view||!entries.length)return null;
      const box=node.getBoundingClientRect(),width=box.width-68,height=box.height-48;
      if(!(width>0&&height>0))return null;
      let x=tipX??limit(0,view.xMin,view.xMax),entry=entries[tipSeries%entries.length],value;
      if(tipPointer){
        const px=tipPointer.x-box.left-54,py=tipPointer.y-box.top-16;
        if(px<0||px>width||py<0||py>height)return null;
        x=blend(view.xMin,view.xMax,px/width);let nearest=Infinity;
        entries.forEach((candidate,i)=>{let y;try{y=candidate.fn?.(x);}catch(_){return;}if(!Number.isFinite(y)||y<view.yMin||y>view.yMax)return;const distance=Math.abs((view.yMax-y)/(view.yMax-view.yMin)*height-py);if(distance<nearest){nearest=distance;entry=candidate;value=y;tipSeries=i;}});
        if(nearest>18)return null;
      }else try{value=entry.fn?.(x);}catch(_){value=NaN;}
      return entry.name+' = '+entry.expression+'\nx = '+exactNumber(x)+'\ny = '+exactNumber(value)+(Number.isFinite(value)&&(value<view.yMin||value>view.yMax)?'\nOutside plotted y-range.':'');
    }
    if(!displayed?.domains?.length)return null;
    const domain=displayed.domains[0];if(tipX!==null)tipX=limit(tipX,...domain.x);let x=tipX??limit(key==='polynomial-value'?displayed.values[3]:key==='logarithm'?displayed.values[0]:0,...domain.x);
    if(tipPointer){const point=svgPosition(tipPointer);if(point.x<84||point.x>338)return null;x=blend(...domain.x,limit((point.x-84)/254,0,1));}
    const y=curveValue(x),equation=key==='linear-regression-slope'?'Δŷ = '+exactNumber(displayed.result)+' × Δx':key==='logarithm'?'y = log_'+exactNumber(displayed.values[1])+'(x)':displayed.note.split('. P is')[0].split('. Roots are')[0];
    return equation+'\nx = '+exactNumber(x)+'\ny = '+exactNumber(y)+(Number.isFinite(y)&&(y<domain.y[0]||y>domain.y[1])?'\nOutside plotted y-range.':'');
  }
  function refreshTip(){
    if(!activeTip||!tooltip)return;
    if(!panel.contains(activeTip)||layers.length||panel.dataset.calulerDiagramReady!=='true'){hideTip();return;}
    const label=activeTip.hasAttribute('data-math-curve')||activeTip.hasAttribute('data-math-native')?graphTip(activeTip):activeTip.getAttribute('data-math-tip');
    if(!label){tooltip.hidden=true;activeTip.classList.remove('math-tip-active');tipPinned=false;return;}
    tooltip.textContent=label;tooltip.hidden=false;activeTip.classList.add('math-tip-active');
    const card=panel.getBoundingClientRect(),viewport=document.documentElement.clientWidth;
    const reserved=Array.from(panel.children).filter(node=>/^H[1-6]$/.test(node.tagName)||node.classList.contains('math-caption')||node.classList.contains('finance-live-intro')||node.classList.contains('caluler-diagram-export-actions'));
    const headerBottom=Math.max(card.top,...reserved.map(node=>node.getBoundingClientRect().bottom));
    const left=Math.max(8,card.left+8),right=Math.min(viewport-8,card.right-8),top=Math.max(8,card.top+8,headerBottom+6),bottom=Math.min(window.innerHeight-8,card.bottom-8);
    tooltip.style.maxWidth=Math.max(1,Math.min(300,right-left))+'px';tooltip.style.maxHeight=Math.max(1,bottom-top)+'px';
    const box=tooltip.getBoundingClientRect(),anchor=activeTip.getBoundingClientRect(),px=tipPointer?.x??anchor.left+anchor.width/2,py=tipPointer?.y??anchor.top;
    const candidates=[[px+14,py-box.height-14],[px+14,py+18],[px-box.width-14,py-box.height-14],[anchor.right+12,anchor.top],[anchor.left-box.width-12,anchor.top]];
    const fits=([x,y])=>x>=left&&x+box.width<=right&&y>=top&&y+box.height<=bottom;
    const chosen=candidates.find(fits)||candidates[0],x=limit(chosen[0],left,Math.max(left,right-box.width)),y=limit(chosen[1],top,Math.max(top,bottom-box.height));
    // Absolute positioning keeps the tooltip inside the card, including a scrolled viewport.
    tooltip.style.left=x-card.left-panel.clientLeft+panel.scrollLeft+'px';tooltip.style.top=y-card.top-panel.clientTop+panel.scrollTop+'px';
  }
  function showTip(node,pointer=null,pinned=false){
    if(!node||layers.length||node===dismissedTip)return;
    dismissedTip=null;
    if(activeTip!==node){activeTip?.classList.remove('math-tip-active');tipX=null;tipSeries=0;}
    activeTip=node;tipPointer=pointer;tipPinned=pinned;refreshTip();
  }
  function setupTips(){
    tooltip=document.createElement('div');tooltip.className='math-tooltip';tooltip.id='caluler-math-tooltip';tooltip.setAttribute('role','tooltip');tooltip.setAttribute('data-caluler-diagram-export-ignore','');tooltip.hidden=true;panel.append(tooltip);
    panel.addEventListener('pointerover',event=>{if(event.pointerType==='touch')return;const target=tipTarget(event.target);if(target)showTip(target,{x:event.clientX,y:event.clientY});});
    panel.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||tooltip.contains(event.target))return;const target=tipTarget(event.target);if(target)showTip(target,{x:event.clientX,y:event.clientY});});
    panel.addEventListener('pointerout',event=>{if(dismissedTip&&!dismissedTip.contains(event.relatedTarget)&&!tooltip.contains(event.relatedTarget))dismissedTip=null;if(event.pointerType!=='touch'&&activeTip&&!activeTip.contains(event.relatedTarget)&&!tooltip.contains(event.relatedTarget))hideTip();});
    panel.addEventListener('focusin',event=>{const target=tipTarget(event.target);if(target){dismissedTip=null;showTip(target);}});
    panel.addEventListener('focusout',event=>{if(dismissedTip&&!dismissedTip.contains(event.relatedTarget))dismissedTip=null;if(activeTip&&!activeTip.contains(event.relatedTarget)&&!tooltip.contains(event.relatedTarget))hideTip();});
    panel.addEventListener('pointerdown',event=>{lastPointerType=event.pointerType;});
    panel.addEventListener('click',event=>{const target=tipTarget(event.target);if(!target){if(!tooltip.contains(event.target))hideTip();return;}dismissedTip=null;const touch=event.pointerType==='touch'||lastPointerType==='touch';if(touch&&activeTip===target&&tipPinned)hideTip();else showTip(target,event.detail?{x:event.clientX,y:event.clientY}:null,touch);});
    panel.addEventListener('keydown',event=>{
      if(event.key==='Escape'){dismissTip();return;}
      const target=tipTarget(event.target);if(!target)return;
      if(event.key==='Enter'||event.key===' '){event.preventDefault();dismissedTip=null;showTip(target);return;}
      if(!target.hasAttribute('data-math-curve')&&!target.hasAttribute('data-math-native'))return;
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
      const range=target.hasAttribute('data-math-native')?[nativeSnapshot.view.xMin,nativeSnapshot.view.xMax]:displayed.domains[0].x;
      event.preventDefault();dismissedTip=null;if(activeTip!==target)showTip(target);tipPointer=null;
      if(event.key==='ArrowUp'||event.key==='ArrowDown')tipSeries=Math.max(0,tipSeries+(event.key==='ArrowDown'?1:-1));
      else tipX=event.key==='Home'?range[0]:event.key==='End'?range[1]:limit((tipX??limit(0,...range))+(range[1]/50-range[0]/50)*(event.key==='ArrowLeft'?-1:1),...range);
      refreshTip();
    });
    tooltip.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch'&&!activeTip?.contains(event.relatedTarget))hideTip();});
    document.addEventListener('pointerdown',event=>{if(!tipTarget(event.target)&&!tooltip.contains(event.target))hideTip();},true);
    document.addEventListener('keydown',event=>{if(event.key==='Escape')dismissTip();});
    window.addEventListener('scroll',event=>{if(!tooltip.contains(event.target))hideTip();},{passive:true,capture:true});window.addEventListener('resize',hideTip,{passive:true});
  }
  function lifecycle(){
    reduced.addEventListener?.('change',()=>{if(reduced.matches)finishMotion();});
    window.addEventListener('pagehide',()=>{hideTip();finishMotion();});window.addEventListener('beforeprint',()=>{hideTip();finishMotion();});
    window.addEventListener('pageshow',()=>{finishMotion();if(key!=='graphing')initialize();});
  }
  function start(){
    const calculator=document.querySelector('.calculator');if(!calculator)return;
    if(key==='graphing'){
      panel=calculator.querySelector('.finance-live-diagram');if(!panel)return;panel.classList.add('math-diagram','math-native-graph');panel.dataset.mathKind=key;panel.setAttribute('data-caluler-diagram-panel','mathematics');panel.dataset.calulerAnimating='false';
      const intro=panel.querySelector('.finance-live-intro');if(intro)intro.textContent='Committed functions and viewing window; use Plot functions or the explicit view controls.';
      host=document.createElement('div');host.className='math-motion-root';scene=document.createElement('div');scene.className='math-motion-scene';
      Array.from(panel.children).filter(n=>!/^H[1-6]$/.test(n.tagName)&&n!==intro&&!n.classList.contains('caluler-diagram-export-ui')).forEach(n=>scene.append(n));host.append(scene);panel.append(host);
      setupTips();const canvas=scene.querySelector('canvas');if(canvas){inspect(canvas,'Function graph; use Left/Right for x and Up/Down to select a function.');canvas.setAttribute('data-math-native','true');}lifecycle();window.calulerDiagramExport?.discover();commitGraph(window.calulerMathGraphSnapshot,true);return;
    }
    if(!definitions[key]||calculator.querySelector('.math-diagram'))return;
    const result=document.getElementById('calcResult')||document.getElementById('result'),grid=calculator.querySelector('.form-grid'),button=document.getElementById('calculateBtn')||document.getElementById('calcBtn')||calculator.querySelector('button.btn');if(!result||!grid||!button)return;
    const form=document.createElement('div');form.className='math-form';calculator.insertBefore(form,calculator.firstChild);for(const child of Array.from(calculator.children)){if(child===result)break;if(child!==form)form.appendChild(child);}calculator.classList.add('math-layout');
    const numbers=document.getElementById('numbers');numbers?.closest('.field')?.classList.add('math-field-wide');
    panel=document.createElement('section');panel.className='math-diagram';panel.dataset.mathKind=key;panel.setAttribute('data-caluler-diagram-panel','mathematics');panel.dataset.calulerDiagramReady='false';panel.dataset.calulerAnimating='false';panel.setAttribute('aria-label',definitions[key][0]);
    const title=document.createElement('h2'),caption=document.createElement('p');title.textContent=definitions[key][0];caption.className='math-caption';caption.textContent=definitions[key][1];panel.append(title,caption);calculator.insertBefore(panel,result);
    host=document.createElement('div');host.className='math-motion-root';scene=document.createElement('div');scene.className='math-motion-scene';host.append(scene);panel.append(host);
    svg=el('svg',{viewBox:'0 0 360 '+viewHeight,class:'math-svg',role:'img'},scene);
    structured=document.createElement('div');structured.className='math-structured';summary=document.createElement('dl');summary.className='math-summary';note=document.createElement('p');note.className='math-note';warning=document.createElement('p');warning.className='math-warning';warning.setAttribute('role','status');warning.setAttribute('data-caluler-diagram-export-ignore','');warning.hidden=true;scene.append(structured,summary,note);panel.append(warning);neutral();
    if(key==='percentage')button.addEventListener('click',()=>{const values=[Number(document.getElementById('part').value),Number(document.getElementById('total').value)],bold=Array.from(result.querySelectorAll('b'));if(bold.length<2||!values[1]||values.some(n=>!Number.isFinite(n)))return;commit({values,result:Number(bold[1].textContent.replace('%','')),display:bold[1].textContent});});
    // Intercept Enter once; the original click handler remains the only calculator.
    grid.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.isComposing){event.preventDefault();event.stopPropagation();button.click();}},true);
    // These listeners only protect startup/autofill from user edits; they do not calculate.
    grid.addEventListener('input',()=>{edited=true;},true);grid.addEventListener('change',()=>{edited=true;},true);
    setupTips();lifecycle();window.calulerDiagramExport?.discover();syncActions(false);initialize();if(!displayed)requestAnimationFrame(initialize);
  }
  window.calulerMathDiagrams=Object.freeze({commit,commitGraph,beforeGraph,abortGraph:finishMotion});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
