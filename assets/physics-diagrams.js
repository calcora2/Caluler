/* Calculator-specific scientific scenes; calculation snapshots come from the original page equations. */
(function () {
  'use strict';
  if (document.body?.dataset.calulerCategory !== 'Physics & Electromagnetism' || window.calulerPhysicsDiagrams) return;
  const NS='http://www.w3.org/2000/svg';
  const key=location.pathname.split('/').pop().replace(/-calculator\.html$/,'');
  const palette={current:'var(--phys-current)',field:'var(--phys-field)',positive:'var(--phys-positive)',secondary:'var(--phys-secondary)',negative:'var(--phys-negative)',material:'var(--phys-material)',neutral:'var(--muted)'};
  const number=n=>!Number.isFinite(n)?'—':n===0?'0':Math.abs(n)<0.0001||Math.abs(n)>=1e7?n.toExponential(5):n.toLocaleString('en-US',{maximumSignificantDigits:8});
  const axis=n=>!Number.isFinite(n)?'—':n!==0&&(Math.abs(n)<.01||Math.abs(n)>=10000)?n.toExponential(1):String(Number(n.toPrecision(3)));
  const nice=n=>{if(n===Infinity)return Number.MAX_VALUE;if(!Number.isFinite(n)||n<=0)return 1;const p=10**Math.floor(Math.log10(n));return Math.min(Number.MAX_VALUE,Math.ceil(n/p)*p);};
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const premiumTools=new Set(["magnetic-field-of-a-solenoid","magnetic-field-on-coil-axis","inductor-reactance","amperes-law-magnetic-field","force-between-parallel-wires","solenoid-turns","magnetic-dipole-moment","transformer-secondary-current","electric-potential-from-charge","magnetic-flux","magnetic-susceptibility","ac-generator-peak-emf"]);
  function scientificNumber(n,force=false){
    if(!Number.isFinite(n))return '—';if(n===0)return '0';
    if(!force&&Math.abs(n)>=.001&&Math.abs(n)<1e5)return n.toLocaleString('en-US',{maximumSignificantDigits:3}).replace('-','−');
    const superscript={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'},[mantissa,exponent]=n.toExponential(2).split('e');
    return mantissa.replace('-','−')+' × 10'+String(Number(exponent)).split('').map(c=>superscript[c]).join('');
  }
  function instrumentDefs(){
    const defs=node('defs'),metal=node('linearGradient',{id:'caluler-physics-metal',x1:'0%',y1:'0%',x2:'100%',y2:'100%'},defs);
    [['0%','var(--phys-metal-edge)'],['30%','var(--phys-metal-light)'],['52%','var(--phys-metal-edge)'],['78%','var(--phys-metal-light)'],['100%','var(--phys-metal-edge)']].forEach(([offset,color])=>node('stop',{offset,'stop-color':color},metal));
  }
  function finishInstrument(){
    // Inline fragment references are document-local, including in the PNG clone.
    // External stylesheet URLs can otherwise resolve against the CSS file.
    svg.querySelectorAll('.phys-wire-edge,.phys-instrument-core').forEach(el=>el.style.stroke='url(#caluler-physics-metal)');
    svg.querySelectorAll('.phys-instrument-pole').forEach(el=>el.style.fill='url(#caluler-physics-metal)');
  }
  function valueLabel(x,y,label,getter,tone='current',anchor='middle'){
    const t=text(x,y,'—',anchor);t.classList.add('phys-instrument-value');bind(t,tone,label,getter);
    return s=>{t.textContent=label+' = '+getter(s);};
  }
  function instrumentPlot(xLabel,yLabel,{signed=true,header=0,height=168}={}){
    const g=graph(xLabel,yLabel,false),compact=window.matchMedia('(max-width:560px)');
    const top=52+header,bottom=top+height,right=304;
    let left=132;
    const halo=circle(100,100,9,'positive');halo.classList.add('phys-marker-halo');svg.insertBefore(halo,g.mark);
    g.mark.classList.add('phys-calculated-point');
    function layout(){
      const previous=g.ticks[0].textContent;g.ticks[0].textContent='−8.88 × 10⁻³²⁴';const width=g.ticks[0].getComputedTextLength?.();g.ticks[0].textContent=previous;
      left=Math.max(120,Math.ceil(Number.isFinite(width)&&width>0?width:132)+24);
      svg.setAttribute('viewBox','0 0 320 '+(bottom+82));
      const zero=signed?(top+bottom)/2:bottom;
      attr(g.axisX,{x1:left,y1:zero,x2:right,y2:zero});attr(g.axisY,{x1:left,y1:top,x2:left,y2:bottom});
      attr(g.yTitle,{x:left,y:top-28});attr(g.xTitle,{x:right,y:bottom+62,'text-anchor':'end'});
      g.ticks.forEach((t,j)=>{const y=top+height*j/4;attr(g.gridLines[j],{x1:left,y1:y,x2:right,y2:y});attr(t,{x:left-14,y:y+6,'text-anchor':'end'});});
      g.xTicks.forEach((t,j)=>attr(t,{x:j===0?left:j===2?right:(left+right)/2,y:bottom+28,visibility:j===1?'hidden':'visible'}));
    }
    layout();compact.addEventListener('change',()=>{layout();if(displayed)update(displayed);});
    return {...g,draw({minX=0,maxX,maxY,points,pointX,pointY}){
      const x=n=>left+(right-left)*(n-minX)/(maxX-minX||1),y=n=>signed?(top+bottom)/2-n/maxY*height/2:bottom-n/maxY*height;
      g.curve.setAttribute('d',points.map(([a,b],i)=>(i?' L':'M')+x(a)+','+y(b)).join(''));
      attr(g.mark,{cx:x(pointX),cy:y(pointY)});attr(halo,{cx:x(pointX),cy:y(pointY)});
      g.ticks.forEach((t,j)=>t.textContent=scientificNumber(maxY*(signed?1-j/2:1-j/4),true));
      // A shared axis multiplier keeps long scientific endpoints readable without
      // shrinking text or moving tick rows. Coordinates still use unscaled values.
      const magnitude=Math.max(Math.abs(minX),Math.abs(maxX)),scaled=magnitude>0&&(magnitude<.01||magnitude>=1e4),exponent=scaled?clamp(Math.floor(Math.log10(magnitude)),-308,308):0,factor=scaled?10**exponent:1;
      const superscript={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
      g.xTitle.textContent=xLabel+(scaled?' × 10'+String(exponent).split('').map(c=>superscript[c]).join(''):'');
      g.xTicks.forEach((t,j)=>t.textContent=scientificNumber((minX+(maxX-minX)*j/2)/factor));
    }};
  }
  const scenes={};
  let displayed=null, frame=0, panel, svg, readout, detail, note, validation, updateScene;
  const bindings=[];
  function node(tag,attrs={},parent=svg) {
    const el=document.createElementNS(NS,tag);
    for(const [name,value] of Object.entries(attrs))el.setAttribute(name,String(value));
    parent.appendChild(el);return el;
  }
  const attr=(el,attrs)=>{for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));};
  const line=(x1,y1,x2,y2,tone='field',parent=svg)=>node('line',{x1,y1,x2,y2,stroke:palette[tone],'stroke-width':2.5,'stroke-linecap':'round'},parent);
  const path=(d,tone='field',width=2.5,parent=svg)=>node('path',{d,fill:'none',stroke:palette[tone],'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'},parent);
  function text(x,y,value,anchor='middle',parent=svg) { const el=node('text',{x,y,'text-anchor':anchor},parent);el.textContent=value;return el; }
  function fitValue(el,width) {
    el.removeAttribute('textLength');el.removeAttribute('lengthAdjust');
    const measured=el.getComputedTextLength?.();
    const length=Number.isFinite(measured)&&measured>0?measured:el.textContent.length*9;
    if(length>width)attr(el,{textLength:width,lengthAdjust:'spacingAndGlyphs'});
  }
  const circle=(cx,cy,r,tone='field',parent=svg)=>node('circle',{cx,cy,r,fill:'var(--card)',stroke:palette[tone],'stroke-width':2.5},parent);
  function arrow(x1,y1,x2,y2,tone='field',parent=svg) {
    const g=node('g',{color:palette[tone]},parent),shaft=line(x1,y1,x2,y2,tone,g),head=path('',tone,2.5,g);
    const set=(a,b,c,d)=>{const angle=Math.atan2(d-b,c-a),size=7;attr(shaft,{x1:a,y1:b,x2:c,y2:d});head.setAttribute('d','M'+(c-size*Math.cos(angle-.5))+','+(d-size*Math.sin(angle-.5))+' L'+c+','+d+' L'+(c-size*Math.cos(angle+.5))+','+(d-size*Math.sin(angle+.5)));g.setAttribute('opacity',Math.hypot(c-a,d-b)<1?0:1);};
    const setTone=t=>{shaft.setAttribute('stroke',palette[t]);head.setAttribute('stroke',palette[t]);g.style.color=palette[t];const b=bindings.find(b=>b.el===g);if(b)b.tone=t;};
    set(x1,y1,x2,y2);return {g,set,setTone};
  }
  function bind(el,tone,label,getter) {
    el.classList.add('phys-interactive');el.setAttribute('tabindex','0');el.style.color=palette[tone];
    // These are inspectable data graphics, not action buttons. Print cleanup
    // intentionally removes real buttons; it must retain the scientific data.
    if(el.namespaceURI===NS)el.setAttribute('role','img');
    if(el.tagName.toLowerCase()==='text')el.style.fill=palette[tone];
    bindings.push({el,tone,label,getter});return el;
  }
  function charge(cx,cy,label,getter) {
    const g=node('g'),c=circle(cx,cy,19,'current',g),sign=text(cx,cy+6,'?', 'middle',g);text(cx,cy+43,label);
    bind(g,'current',label,getter);
    return q=>{sign.textContent=q>0?'+':q<0?'−':'0';c.setAttribute('stroke',q<0?palette.negative:palette.current);g.style.color=q<0?palette.negative:palette.current;const b=bindings.find(b=>b.el===g);b.tone=q<0?'negative':'current';};
  }
  function winding(x,y,width=100,height=50,turns=7,tone='current') {
    const g=node('g');line(x-12,y+height/2,x,y+height/2,tone,g);
    for(let i=0;i<turns;i++)node('ellipse',{cx:x+(i+.5)*width/turns,cy:y+height/2,rx:width/turns*.7,ry:height/2,fill:'none',stroke:palette[tone],'stroke-width':2},g);
    line(x+width,y+height/2,x+width+12,y+height/2,tone,g);return g;
  }
  // Presentation-only mobile coordinates. Reflow never reads inputs or commits a calculation.
  const mobileLayouts=[];
  function mobileLayout(el,compact) {
    mobileLayouts.push({el,compact,desktop:Object.fromEntries(Object.keys(compact).map(name=>[name,el.getAttribute(name)]))});
    return el;
  }
  function setupMobileLayout() {
    if(!mobileLayouts.length)return;
    const media=window.matchMedia('(max-width:560px)');
    const apply=()=>mobileLayouts.forEach(({el,compact,desktop})=>attr(el,media.matches?compact:desktop));
    apply();media.addEventListener('change',apply);
  }
  function graph(xLabel,yLabel,sharedMobile=true) {
    if(sharedMobile)mobileLayout(svg,{viewBox:'0 0 300 254'});
    const axisX=line(42,110,280,110,'neutral'),axisY=line(42,22,42,190,'neutral');
    const xTitle=text(165,216,xLabel);if(sharedMobile)mobileLayout(xTitle,{y:240});const yl=text(43,15,yLabel,'start');yl.classList.add('phys-small');
    const gridLines=[];
    const ticks=[0,1,2,3,4].map(i=>{const y=34+i*38;const l=line(42,y,280,y,'neutral');l.setAttribute('opacity','.3');gridLines.push(l);const t=text(47,y-4,'','start');t.classList.add('phys-small');return t;});
    const curve=path('','field',3),mark=circle(100,100,5,'positive');
    const xTicks=[42,161,280].map((x,i)=>{const t=text(x,201,'',i===0?'start':i===2?'end':'middle');t.classList.add('phys-small');return t;});
    return {curve,mark,ticks,xTicks,axisX,axisY,gridLines,xTitle,yTitle:yl};
  }
  function meter(title,tone='positive') {
    node('rect',{x:35,y:95,width:230,height:28,rx:8,fill:'var(--border)'});
    const bar=node('rect',{x:35,y:95,width:0,height:28,rx:8,fill:palette[tone]});
    text(35,146,'0','start');const max=text(265,146,'','end');text(150,183,title);
    bind(bar,tone,title,s=>number(s.result)+' '+s.unit);
    return s=>{const top=s.scales[0],actualTone=s.result<0?'negative':tone;attr(bar,{width:230*Math.abs(s.result)/top,fill:palette[actualTone]});bindings.find(b=>b.el===bar).tone=actualTone;max.textContent=number(top)+' '+s.unit;};
  }
  function resultLabel(name,s) { return (premiumTools.has(key)?scientificNumber(s.result):number(s.result))+' '+s.unit; }
  const I=s=>number(s.values[0])+' A';
  const field=s=>(premiumTools.has(key)?scientificNumber(s.result):number(s.result))+' '+s.unit;
  scenes['coulombs-law']=(function(){
    const superscript={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'};
    const scientific=(n,digits=7)=>{
      if(!Number.isFinite(n))return '—';if(n===0)return '0';
      const parts=n.toExponential(digits).split('e'),power=String(Number(parts[1])).split('').map(c=>superscript[c]).join('');
      return String(Number(parts[0]))+' × 10'+power;
    };
    const compact=n=>n!==0&&(Math.abs(n)<.001||Math.abs(n)>=1e5)?scientific(n,3):String(Number(n.toPrecision(4)));
    const interaction=s=>s.values[0]===0||s.values[1]===0?'NO FORCE':s.result===0?'BELOW NUMERICAL RANGE':Math.sign(s.values[0])===Math.sign(s.values[1])?'REPULSION':'ATTRACTION';
    return {
      title:'Electrostatic Force',caption:'See how two electric charges attract or repel.',output:'ELECTROSTATIC FORCE',
      read:s=>scientific(s.result,2)+' N',readoutTone:'material',
      initialNote:'Enter charges and separation, then Calculate.',note:'Schematic spacing; forces are equal and opposite.',
      invalidNote:'Enter finite charges and a positive separation. The previous valid diagram is preserved.',
      detailsInitial:'Awaiting input',details:s=>({'REPULSION':'Repulsion','ATTRACTION':'Attraction','NO FORCE':'Zero Force','BELOW NUMERICAL RANGE':'Below numerical range'}[interaction(s)]),
      interpolate(from,target,ease,progress){
        const next={...target,result:from.result*(1-ease)+target.result*ease,values:target.values.map((n,i)=>from.values[i]*(1-ease)+n*ease),scales:target.scales.map((n,i)=>from.scales[i]*(1-ease)+n*ease)};
        const reverses=[0,1].map(i=>Math.sign(from.values[i])*Math.sign(target.values[i])<0);
        if(reverses.some(Boolean)){
          // A sign reversal passes through a neutral, zero-force midpoint. No direction is guessed.
          const first=progress<=.5,local=first?progress*2:progress*2-1,phase=(1-Math.cos(Math.PI*local))/2;
          reverses.forEach((reverse,i)=>{if(reverse)next.values[i]=first?from.values[i]*(1-phase):target.values[i]*phase;});
          next.result=first?from.result*(1-phase):target.result*phase;
        }
        return next;
      },
      build(){
        panel.classList.add('phys-coulomb');panel.dataset.interaction='pending';
        svg.setAttribute('viewBox','0 0 320 220');
        const defs=node('defs');
        for(const [id,tone] of [['positive','current'],['negative','negative']]){
          const gradient=node('radialGradient',{id:'caluler-coulomb-'+id,cx:'.32',cy:'.22',r:'.9'},defs);
          node('stop',{offset:'0%','stop-color':'var(--card)'},gradient);
          node('stop',{offset:'65%','stop-color':palette[tone],'stop-opacity':'.12'},gradient);
          node('stop',{offset:'100%','stop-color':palette[tone],'stop-opacity':'.3'},gradient);
        }
        const particles=[0,1].map(i=>{
          const x=i?240:80,g=node('g',{class:'phys-coulomb-charge'});
          const orb=circle(x,86,30,'neutral',g);orb.setAttribute('stroke-width','2');
          const shine=path('','neutral',1.5,g);shine.setAttribute('opacity','.35');
          const sign=text(x,96,'?', 'middle',g);sign.classList.add('phys-coulomb-sign');
          const label=text(x,137,i?'q₂':'q₁');label.classList.add('phys-coulomb-label');
          const value=text(x,158,'— C');value.classList.add('phys-coulomb-charge-value');
          bind(g,'current',i?'Charge 2 (q₂)':'Charge 1 (q₁)',s=>number(s.values[i])+' C');
          return {g,orb,shine,sign,label,value};
        });
        const vectors=[0,1].map(i=>{
          const a=arrow(80,35,80,35,'material');a.g.classList.add('phys-coulomb-vector');
          const guide=line(80,40,80,53,'material');guide.setAttribute('opacity','0');
          const label=text(80,19,i?'F₂':'F₁');label.classList.add('phys-coulomb-vector-label');label.setAttribute('opacity','0');
          bind(a.g,'material',i?'Force on q₂ (F₂)':'Force on q₁ (F₁)',field);
          return {a,guide,label};
        });
        const dimension=node('g',{class:'phys-coulomb-dimension'}),distanceLine=line(80,185,240,185,'field',dimension);
        const ticks=[80,240].map(x=>line(x,178,x,192,'field',dimension));
        const distance=text(160,209,'r = — m','middle',dimension);distance.classList.add('phys-coulomb-distance');
        bind(dimension,'field','Separation r',s=>number(s.values[2])+' m');
        return s=>{
          const [q1,q2,r]=s.values,kind=interaction(s),hasForce=q1!==0&&q2!==0&&s.result>0;
          panel.dataset.interaction=kind==='REPULSION'?'repulsion':kind==='ATTRACTION'?'attraction':'zero';
          const separation=128+40*clamp(r/s.scales[1],0,1),positions=[160-separation/2,160+separation/2];
          particles.forEach((p,i)=>{
            const q=s.values[i],tone=q<0?'negative':q>0?'current':'field',x=positions[i];
            attr(p.orb,{cx:x,fill:q===0?'var(--card)':'url(#caluler-coulomb-'+(q<0?'negative':'positive')+')',stroke:palette[tone]});
            p.shine.setAttribute('d','M'+(x-20)+',74 Q'+x+',48 '+(x+19)+',67');p.shine.setAttribute('stroke',palette[tone]);
            p.sign.textContent=q>0?'+':q<0?'−':'0';attr(p.sign,{x});p.sign.style.fill=palette[tone];
            attr(p.label,{x});attr(p.value,{x});p.value.textContent=compact(q)+' C';fitValue(p.value,Math.min(118,separation-24));
            p.g.style.color=palette[tone];bindings.find(b=>b.el===p.g).tone=tone;
          });
          const direction=Math.sign(q1)*Math.sign(q2),length=hasForce?52*clamp(s.result/s.scales[0],0,1):0;
          vectors.forEach((v,i)=>{
            const x=positions[i],dx=(i?direction:-direction)*length;
            v.a.set(x,35,x+dx,35);v.a.g.setAttribute('tabindex',hasForce?'0':'-1');v.a.g.setAttribute('aria-hidden',String(!hasForce));
            attr(v.guide,{x1:x,x2:x,opacity:hasForce?'.35':'0'});attr(v.label,{x:x+dx/2,opacity:hasForce?'1':'0'});
          });
          attr(distanceLine,{x1:positions[0],x2:positions[1]});ticks.forEach((t,i)=>attr(t,{x1:positions[i],x2:positions[i]}));
          distance.textContent='r = '+compact(r)+' m';
        };
      }
    };
  })();
  scenes['electric-charge']=(function(){
    const display=n=>{
      if(!Number.isFinite(n))return '—';if(n===0)return '0';
      if(Math.abs(n)>=1e6||Math.abs(n)<.0001){const p=n.toExponential(3).split('e');return String(Number(p[0]))+'e'+String(Number(p[1]));}
      return n.toLocaleString('en-US',{maximumSignificantDigits:6});
    };
    return {
      title:'Charge Transfer Flow',caption:'See how electric current over time transfers charge.',
      output:'TOTAL TRANSFERRED CHARGE',read:s=>number(s.result)+' C',readoutTone:'positive',
      initialNote:'Enter current and time, then Calculate.',
      note:'Relative conventional-current flow; schematic, not charge-carrier speed.',
      detailsInitial:'Q = I × t',details:()=>'Q = I × t',
      interpolate(from,target,ease,progress){
        const next={...target,values:target.values.map((n,i)=>from.values[i]*(1-ease)+n*ease),scales:target.scales.map((n,i)=>from.scales[i]*(1-ease)+n*ease)};
        // The equation and the three counters share one displayed state. A zero bridge
        // handles extreme cross-products without overflowing between finite endpoints.
        const bridge=!Number.isFinite(from.values[0]*target.values[1])||!Number.isFinite(target.values[0]*from.values[1]);
        if(bridge){const first=progress<=.5,local=first?progress*2:progress*2-1,p=(1-Math.cos(Math.PI*local))/2;next.values=target.values.map((n,i)=>from.values[i]===n?n:first?from.values[i]*(1-p):n*p);}
        next.result=next.values[0]*next.values[1];
        return next;
      },
      build(){
        panel.classList.add('phys-charge-transfer');panel.dataset.flow='neutral';
        const metrics=document.createElement('div');metrics.className='phys-transfer-metrics';
        const quantities=[['Electric Current','A','current'],['Time Interval','s','secondary']].map(([label,unit,tone],i)=>{
          const cell=document.createElement('div');cell.className='phys-transfer-metric phys-transfer-'+(i?'time':'current');
          const name=document.createElement('span');name.textContent=label;
          const value=document.createElement('strong');value.textContent='— '+unit;cell.append(name,value);metrics.append(cell);
          bind(cell,tone,label,s=>number(s.values[i])+' '+unit);return {value,unit};
        });
        panel.insertBefore(metrics,svg);svg.setAttribute('viewBox','0 0 320 100');
        const defs=node('defs'),gradient=node('linearGradient',{id:'caluler-charge-conductor',x1:'0%',y1:'0%',x2:'100%',y2:'0%'},defs);
        node('stop',{offset:'0%','stop-color':'var(--caluler-brand-primary)','stop-opacity':'.08'},gradient);
        node('stop',{offset:'100%','stop-color':'var(--caluler-brand-secondary)','stop-opacity':'.25'},gradient);
        const track=node('rect',{class:'phys-transfer-track',x:18,y:16,width:284,height:34,rx:17,fill:'var(--border)','fill-opacity':'.35',stroke:palette.current,'stroke-width':1.2});
        bind(track,'current','Conventional current',s=>number(s.values[0])+' A');
        const wash=node('rect',{x:18,y:16,width:284,height:34,rx:17,fill:'url(#caluler-charge-conductor)',opacity:0,'pointer-events':'none'});
        const conductor=arrow(124,64,196,64,'current');conductor.g.classList.add('phys-transfer-direction');
        conductor.g.setAttribute('opacity','0');conductor.g.setAttribute('aria-hidden','true');
        currentConductor('M34,33 L286,33',s=>s.values[0],{gate:s=>s.values[1],label:'Conventional current'});
        const flowLabel=text(160,92,'Conventional-current track');flowLabel.classList.add('phys-transfer-flow-label');
        return s=>{
          quantities.forEach((q,i)=>q.value.textContent=display(s.values[i])+' '+q.unit);
          const active=s.values[0]!==0&&s.values[1]!==0,direction=Math.sign(s.values[0]);
          // Direction is schematic; speed comes from the shared monotonic |I|
          // mapping, never from normalizing the illustration against this input.
          const span=active?72*direction:0;
          conductor.set(160-span/2,64,160+span/2,64);
          wash.setAttribute('opacity',active?1:0);

          panel.dataset.flow=active?(direction>0?'forward':'reverse'):'neutral';
          flowLabel.textContent=active?(direction>0?'Forward conventional current':'Reverse conventional current'):'No transfer in this interval';
        };
      }
    };
  })();
  scenes['electric-field-from-charge']={
    title:'Radial electric field',caption:'Electric field direction around a point charge.',output:'Field magnitude',
    read:s=>scientificNumber(s.result,true)+' '+s.unit,readoutTone:'field',
    initialNote:'Enter a charge and a positive distance, then Calculate.',detailsInitial:'Awaiting calculation',
    invalidNote:'Enter a finite charge and a positive distance. The previous valid diagram is preserved.',
    details:s=>s.values[0]>0?'Outward field':s.values[0]<0?'Inward field':'Zero field',
    note:'r: source center to point P. Geometry is not to scale.',
    build(){
      panel.classList.add('phys-radial-field');svg.setAttribute('viewBox','0 0 320 246');
      const source=document.createElement('div');source.className='phys-radial-source';
      const label=document.createElement('span');label.textContent='Source q';
      const value=document.createElement('strong');value.textContent='q = — C';source.append(label,value);panel.insertBefore(source,svg);
      bind(source,'current','Source charge q',s=>number(s.values[0])+' C');
      const defs=node('defs');
      for(const [id,tone] of [['positive','current'],['negative','negative']]){
        const gradient=node('radialGradient',{id:'caluler-radial-'+id,cx:'.3',cy:'.22',r:'.9'},defs);
        node('stop',{offset:'0%','stop-color':'var(--card)'},gradient);
        node('stop',{offset:'65%','stop-color':palette[tone],'stop-opacity':'.14'},gradient);
        node('stop',{offset:'100%','stop-color':palette[tone],'stop-opacity':'.34'},gradient);
      }
      const cx=150,cy=108;
      const rays=Array.from({length:8},(_,i)=>{
        const t=i*Math.PI/4,a=arrow(cx+35*Math.cos(t),cy+35*Math.sin(t),cx+82*Math.cos(t),cy+82*Math.sin(t));
        a.g.classList.add('phys-radial-ray');bind(a.g,'field','Electric field',s=>scientificNumber(s.result,true)+' '+s.unit);
        attr(a.g,{opacity:0,tabindex:'-1','aria-hidden':'true','pointer-events':'none'});return {a,t};
      });
      const dimension=node('g',{class:'phys-radial-dimension'}),px=274,py=156;
      line(cx,cy,px,py,'secondary',dimension).setAttribute('stroke-dasharray','4 4');
      const angle=Math.atan2(py-cy,px-cx),dx=5*Math.sin(angle),dy=-5*Math.cos(angle);
      [[cx,cy],[px,py]].forEach(([x,y])=>line(x-dx,y-dy,x+dx,y+dy,'secondary',dimension));
      line(px,py+8,px,208,'secondary',dimension).setAttribute('stroke-dasharray','2 4');
      const distance=text(160,234,'r = — m','middle',dimension);distance.classList.add('phys-radial-distance');
      bind(dimension,'secondary','Distance from source center',s=>number(s.values[1])+' m');
      const point=circle(px,py,5,'positive'),pointLabel=text(px,py-13,'P');pointLabel.classList.add('phys-radial-point-label');
      bind(point,'positive','Measurement point P',s=>'r = '+number(s.values[1])+' m\nE = '+scientificNumber(s.result,true)+' '+s.unit);
      const particle=node('g',{class:'phys-radial-charge'});
      node('circle',{cx,cy,r:26,fill:'var(--card)',stroke:'none'},particle);
      const orb=circle(cx,cy,26,'current',particle);
      const shine=path('M132 101 Q143 80 166 94','current',1.5,particle);shine.setAttribute('opacity','.4');
      const sign=text(cx,cy+10,'?','middle',particle);sign.classList.add('phys-radial-sign');
      bind(particle,'current','Source charge q',s=>number(s.values[0])+' C');
      return s=>{
        const q=s.values[0],direction=Math.sign(q),tone=q<0?'negative':q>0?'current':'neutral';
        panel.dataset.charge=q>0?'positive':q<0?'negative':'zero';
        value.textContent='q = '+scientificNumber(q)+' C';distance.textContent='r = '+scientificNumber(s.values[1])+' m';
        source.style.color=palette[tone];particle.style.color=palette[tone];
        bindings.find(b=>b.el===source).tone=tone;bindings.find(b=>b.el===particle).tone=tone;
        attr(orb,{fill:q===0?'var(--card)':'url(#caluler-radial-'+(q<0?'negative':'positive')+')',stroke:palette[tone]});
        shine.setAttribute('stroke',palette[tone]);sign.style.fill=palette[tone];sign.textContent=q>0?'+':q<0?'−':'0';
        rays.forEach(({a,t})=>{
          const start=direction<0?82:35,end=direction<0?35:82;
          a.set(cx+start*Math.cos(t),cy+start*Math.sin(t),cx+(direction?end:start)*Math.cos(t),cy+(direction?end:start)*Math.sin(t));
          attr(a.g,{tabindex:direction?'0':'-1','aria-hidden':direction?'false':'true','pointer-events':direction?'auto':'none'});
        });
      };
    }
  };
  scenes['electric-potential-from-charge']={title:'Potential versus distance',caption:'The signed potential follows V ∝ 1/r. The highlighted point is the calculated separation.',output:'Electric potential',build(){
    const g=instrumentPlot('Distance (m)','Potential (V)');bind(g.mark,'positive','Calculated location',s=>'r: '+scientificNumber(s.values[1])+' m\nV: '+field(s));
    return s=>{const r=Math.abs(s.values[1]),peak=s.scales[0],points=Array.from({length:71},(_,j)=>{const ratio=.25+3.75*j/70;return [r*ratio,s.result/ratio];});g.draw({minX:r*.25,maxX:r*4,maxY:peak,points,pointX:r,pointY:s.result});};
  }};

  scenes['frequency-wavelength']={title:'One wave, two scales',caption:'Wavelength is spatial spacing; frequency counts cycles per second. The axis uses actual metres.',output:'Wave relationship',build(){
    line(20,100,280,100,'neutral');const wave=path('','current',3),bracket=line(25,165,160,165,'secondary');const end=line(160,158,160,172,'secondary');line(25,158,25,172,'secondary');text(150,195,'Wavelength λ');const domain=text(150,35,'');
    bind(wave,'current','Wave',s=>'f: '+number(s.values[1])+' Hz\nλ: '+number(s.values[2])+' m');bind(bracket,'secondary','Wavelength',s=>number(s.values[2])+' m');
    return s=>{const lambda=Math.abs(s.values[2]),span=s.scales[0],length=260*lambda/span;let d='';for(let i=0;i<=100;i++){const x=20+260*i/100,y=100-(lambda?42*Math.sin(2*Math.PI*(span*i/100)/lambda):0);d+=(i?' L':'M')+x+','+y;}wave.setAttribute('d',d);attr(bracket,{x1:20,x2:20+length});attr(end,{x1:20+length,x2:20+length});domain.textContent='0 → '+number(span)+' m';};
  },read:s=>'λ '+number(s.values[2])+' m · f '+number(s.values[1])+' Hz'};
  scenes['amperes-law-magnetic-field']={title:'Ampèrian loop around a conductor',caption:'Solid ring: selected Amperian path. Geometry is schematic, not to scale.',output:'Magnetic field B',build(){
    panel.classList.add('phys-ampere-field');svg.setAttribute('viewBox','0 0 320 264');
    const guides=[54,112].map(rx=>node('ellipse',{cx:160,cy:112,rx,ry:rx*.31,fill:'none',stroke:palette.field,'stroke-width':1.7,class:'phys-ampere-field-guide'}));
    node('ellipse',{cx:160,cy:112,rx:84,ry:26,fill:'none',stroke:palette.positive,'stroke-width':7,opacity:'.12','pointer-events':'none'});
    const selected=node('ellipse',{cx:160,cy:112,rx:84,ry:26,fill:'none',stroke:palette.positive,'stroke-width':3.2,class:'phys-ampere-selected-path'});
    bind(selected,'positive','Selected Amperian path',s=>'r: '+scientificNumber(s.values[1])+' m\nB: '+field(s));
    const circulation=[0,Math.PI].map(shift=>({shift,arrow:arrow(0,0,0,0,'positive')}));circulation.forEach(a=>bind(a.arrow.g,'positive','Field circulation at r',field));
    const radial=node('g',{class:'phys-ampere-radius'});line(160,112,244,112,'secondary',radial);[160,244].forEach(x=>line(x,107,x,117,'secondary',radial));
    bind(radial,'secondary','Radius from conductor axis',s=>scientificNumber(s.values[1])+' m');
    // A short direction cue leaves most of the metallic conductor free for flow.
    currentConductor('M160,178 L160,34',s=>s.values[0],{width:12,endpoints:[[160,34],[160,178]],indicator:[160,66,160,42],label:'Enclosed conventional current'});
    const current=valueLabel(16,216,'I',s=>scientificNumber(s.values[0])+' A','current','start'),radius=valueLabel(16,245,'r',s=>scientificNumber(s.values[1])+' m','secondary','start');
    scientificMotion('field',circulation.map(a=>a.arrow.g),s=>s.result,{gate:s=>s.values[0]});
    return s=>{current(s);radius(s);const sign=Math.sign(s.values[0]);guides.forEach(r=>r.setAttribute('opacity',sign?'.72':'0'));
      circulation.forEach(({shift,arrow:a})=>{const from=1.05+shift,to=.4+shift,x=t=>160+84*Math.cos(t),y=t=>112+26*Math.sin(t),start=sign<0?to:from,end=sign===0?start:sign<0?from:to;a.set(x(start),y(start),x(end),y(end));});
    };
  }};

  scenes['magnetic-field-of-a-straight-wire']={title:'Field around a straight wire',caption:'End view: ⊙ out, ⊗ in. Rings are magnetic field lines; the inset is a side view of the wire axis.',output:'Magnetic field B',build(){
    const rings=[40,65,90].map(r=>{const c=circle(135,105,r);c.setAttribute('fill','none');return c;});const sign=text(135,113,'?');circle(135,105,17,'current');svg.appendChild(sign);
    const radial=line(135,105,225,105,'secondary');text(190,95,'r');const tangent=arrow(225,105,225,70,'field');
    bind(radial,'secondary','Radial distance',s=>number(s.values[1])+' m');bind(tangent.g,'field','Field at r',field);bind(sign,'current','Current',I);
    scientificMotion('field',[...rings,tangent.g],s=>s.result,{gate:s=>s.values[0]});
    // Separate axial projection: the circular paths remain magnetic field lines.
    currentConductor('M270,145 L270,70',s=>s.values[0],{indicator:[270,130,270,90],endpoints:[[270,70],[270,145]],label:'Wire current (+I upward in side view)'});
    text(270,172,'I axis').classList.add('phys-small');
    return s=>{const v=Math.sign(s.values[0]);sign.textContent=v>0?'⊙':v<0?'⊗':'0';tangent.set(225,105,225,105-v*35);};
  }};
  function solenoidScene(turnsMode) {
    const coil=currentWinding(65,80,170,60,9,s=>s.values[turnsMode?2:1]);bind(coil,'current',turnsMode?'Calculated turns':'Turns and current',s=>turnsMode?'I: '+number(s.values[2])+' A\nN: '+field(s):'N: '+number(s.values[0])+'\nI: '+number(s.values[1])+' A');
    const inside=[94,110,126].map(y=>arrow(80,y,220,y,'field'));
    const outside=path('M65 88 C20 30 280 30 235 88 M65 132 C20 190 280 190 235 132','field',2);text(150,25,'Return field outside');text(150,181,'Nearly uniform inside');
    const direction=arrow(175,48,135,48,'field');bind(outside,'field',turnsMode?'Target field':'Interior field',s=>turnsMode?number(s.values[0])+' T':field(s));
    const current=s=>s.values[turnsMode?2:1];
    scientificMotion('field',[...inside.map(a=>a.g),outside,direction.g],s=>turnsMode?s.values[0]:s.result,{gate:current});
    return s=>{const signed=turnsMode?s.values[0]:s.values[0]*s.values[1],sign=Math.sign(signed);inside.forEach((a,i)=>a.set(150-sign*65,94+i*16,150+sign*65,94+i*16));direction.set(150+sign*25,48,150-sign*25,48);};
  }
  scenes['magnetic-field-of-a-solenoid']={title:'Solenoid field',caption:'Representative windings; highlights show conventional current.',output:'Magnetic field B',read:s=>scientificNumber(s.result,true)+' '+s.unit,build(){
    panel.classList.add('phys-solenoid-field');svg.setAttribute('viewBox','0 0 320 252');
    text(160,24,'Return field outside');
    const guides=node('g',{class:'phys-solenoid-magnetic-guides'});
    const inside=[116,130,144].map(y=>arrow(88,y,232,y,'field',guides));
    const outside=path('M60 110 C20 48 300 48 260 110 M60 152 C20 221 300 221 260 152','field',2.3,guides);outside.classList.add('phys-field-guide');
    const direction=arrow(182,64,138,64,'field',guides);
    bind(outside,'field','Schematic return field',s=>'Interior B: '+scientificNumber(s.result,true)+' T');inside.forEach(a=>bind(a.g,'field','Interior magnetic field',s=>scientificNumber(s.result,true)+' T'));
    // Windings and current highlights sit in front of the field guides.
    currentConductor(windingGeometry(60,98,200,64,9),s=>s.values[1],{width:8,gate:s=>s.values[0],indicator:[48,130,60,130],label:'Conventional winding current'});
    text(160,236,'Nearly uniform inside');
    const parameters=document.createElement('dl');parameters.className='phys-solenoid-parameters';
    const quantity=n=>n!==0&&(Math.abs(n)<.001||Math.abs(n)>=1e5)?scientificNumber(n):number(n);
    const fields=[['N','Turns',0,'turns','material'],['I','Current',1,'A','current'],['L','Length',2,'m','secondary']].map(([symbol,label,index,unit,tone])=>{
      const term=document.createElement('dt'),value=document.createElement('dd');term.textContent=symbol+' =';term.setAttribute('aria-label',label);value.textContent='— '+unit;parameters.append(term,value);
      const getter=s=>quantity(s.values[index])+' '+unit;bind(value,tone,label,getter);return {value,getter};
    });panel.append(parameters);
    scientificMotion('field',[...inside.map(a=>a.g),outside,direction.g],s=>s.result,{gate:s=>s.values[1]});
    return s=>{const sign=Math.sign(s.result);inside.forEach((a,j)=>a.set(160-sign*72,116+j*14,160+sign*72,116+j*14));direction.set(160+sign*22,64,160-sign*22,64);fields.forEach(f=>f.value.textContent=f.getter(s));};
  }};

  scenes['solenoid-turns']={title:'Turns needed for the target field',caption:'Continuous representative windings are schematic; the calculated turn count is not a drawn winding count.',output:'Calculated turns N',invalidNote:'Target B and current I must agree with the reference winding direction; a negative turn count cannot describe this coil. The previous diagram is preserved.',build(){
    svg.setAttribute('viewBox','0 0 320 280');
    const coil=currentConductor(windingGeometry(60,92,200,72,9),s=>s.values[2],{width:5,gate:s=>s.result}).g;bind(coil,'current','Turns and current',s=>'I: '+scientificNumber(s.values[2])+' A\nN: '+field(s));
    const inside=[108,130,152].map(y=>arrow(82,y,238,y,'field'));
    const outside=path('M60 104 C20 45 300 45 260 104 M60 152 C20 224 300 224 260 152','field',2);outside.classList.add('phys-field-guide');const returnDirection=arrow(182,60,138,60,'field');
    text(160,26,'Return field outside');text(160,232,'Nearly uniform inside');text(160,262,'N = B L / (μ₀ I)');
    bind(outside,'field','Schematic return path',s=>'Target interior B: '+scientificNumber(s.values[0])+' T');
    scientificMotion('field',[...inside.map(a=>a.g),outside,returnDirection.g],s=>s.values[0],{gate:s=>s.values[2]});
    return s=>{const sign=Math.sign(s.values[0]);returnDirection.set(160+sign*22,60,160-sign*22,60);inside.forEach((a,j)=>a.set(160-sign*72,108+j*22,160+sign*72,108+j*22));};
  }};

  scenes['magnetic-field-of-a-circular-coil']={title:'Field at the coil centre',caption:'Front view; the chosen winding convention links signed current to the central field.',output:'Centre field B',build(){
    const rings=[72,76,80].map(r=>{const c=circle(150,105,r,'current');c.setAttribute('fill','none');return c;});const mark=text(150,115,'?');const flow=arrow(230,105,230,65,'current');text(150,210,'Radius R');
    bind(mark,'field','Centre field',field);bind(flow.g,'current','Coil current',s=>number(s.values[1])+' A');
    rings.forEach(c=>c.classList.add('phys-current-reference'));
    currentConductor(loopGeometry(150,105,80,80),s=>s.values[1],{gate:s=>s.values[0],label:'Coil current',width:5});
    scientificMotion('vector',flow.g,s=>s.values[1],{gate:s=>s.values[0]});
    scientificMotion('field',mark,s=>s.result,{gate:s=>s.values[1],text:true});
    return s=>{const sign=Math.sign(s.values[0]*s.values[1]);mark.textContent=sign>0?'⊙':sign<0?'⊗':'0';flow.set(230,105,230,105-sign*35);};
  }};
  scenes['magnetic-field-on-coil-axis']={title:'Field along a coil axis',caption:'The curve follows the circular-coil axial field equation. The coil reference is separated from the plot.',output:'Axial field B',read:field,build(){
    const g=instrumentPlot('|Axial distance| (m)','B (T)',{header:70});bind(g.mark,'positive','Observation point',s=>'x: '+scientificNumber(s.values[3])+' m\nB: '+field(s));
    currentConductor(loopGeometry(270,50,12,33),s=>s.values[1],{gate:s=>s.values[0],indicator:[282,50,280,36],label:'Coil current',width:4});
    return s=>{const [n,i,r,x]=s.values,span=s.scales[0],base=4*Math.PI*1e-7*n*i/(2*r),top=Math.max(s.scales[1],Math.abs(base))||1,points=Array.from({length:71},(_,j)=>{const xx=span*(j/70),ratio=r/Math.hypot(r,xx);return [xx,base*ratio**3];});g.draw({maxX:span,maxY:top,points,pointX:Math.abs(x),pointY:s.result});};
  }};

  scenes['biotsavart-law']={title:'Field from a current element',caption:'A representative plane is shown. sin θ fixes magnitude but does not uniquely specify the 3D geometry.',output:'Element field dB',build(){
    const current=arrow(55,150,145,150,'current'),radius=arrow(100,150,212,38,'secondary');text(100,185,'I dℓ');const p=circle(212,38,5,'positive'),pointLabel=text(224,26,'P'),radiusLabel=text(160,95,'r');text(160,214,'dB ⟂ illustrated plane');
    bind(current.g,'current','Current element',s=>'I: '+number(s.values[0])+' A\ndl: '+number(s.values[1])+' m');bind(radius.g,'secondary','Separation',s=>'r: '+number(s.values[3])+' m\nsin θ: '+number(s.values[2]));bind(p,'positive','Field at P',field);
    currentConductor('M55,150 L145,150',s=>s.values[0],{gate:s=>s.values[1],endpoints:[[55,150],[145,150]],label:'Current in element'});
    return s=>{const theta=Math.asin(clamp(s.values[2],0,1)),x=100+112*Math.cos(theta),y=150-112*Math.sin(theta);radius.set(100,150,x,y);attr(p,{cx:x,cy:y});attr(pointLabel,{x:x+12,y:y-12});attr(radiusLabel,{x:(100+x)/2+20*Math.sin(theta),y:(150+y)/2+20*Math.cos(theta)});current.set(100-Math.sign(s.values[0])*45,150,100+Math.sign(s.values[0])*45,150);};
  }};
  function forceVectors(wire) {
    const origin={x:150,y:120};
    const conductor=wire?line(40,120,260,120,'current'):null;
    const primary=arrow(origin.x,origin.y,origin.x+105,origin.y,'current'),b=arrow(origin.x,origin.y,origin.x,45,'field');
    const primaryLabel=text(255,148,wire?'I':'v'),bLabel=text(150,26,'B');text(160,214,'F perpendicular to plane');
    const force=text(260,183,'F');bind(primary.g,'current',wire?'Current':'Charge velocity',s=>wire?number(s.values[0])+' A':'q: '+number(s.values[0])+' C\nv: '+number(s.values[1])+' m/s');bind(b.g,'field','Magnetic field',s=>number(s.values[2])+' T');bind(force,'positive','Force magnitude',field);
    const particle=wire?null:charge(origin.x,origin.y,'q',s=>number(s.values[0])+' C');
    if(wire)currentConductor('M40,120 L260,120',s=>s.values[0],{gate:s=>s.values[1],endpoints:[[40,120],[260,120]],label:'Wire current'});
    return s=>{if(particle)particle(s.values[0]);const angle=Math.asin(clamp(s.values[3],0,1)),sign=Math.sign(s.values[2]),direction=wire?Math.sign(s.values[0]):Math.sign(s.values[1]);primary.set(origin.x,origin.y,origin.x+direction*105,origin.y);const bx=origin.x+90*Math.cos(angle)*sign,by=origin.y-90*Math.sin(angle)*sign;b.set(origin.x,origin.y,bx,by);attr(primaryLabel,{x:origin.x+direction*105,y:148});attr(bLabel,{x:clamp(bx+(sign<0?-14:14),24,276),y:clamp(by-14,16,188)});force.textContent=s.result===0?'F = 0':(wire?Math.sign(s.values[0]*s.values[2]):Math.sign(s.values[0]*s.values[1]*s.values[2]))>=0?'F ⊙':'F ⊗';};
  }
  scenes['magnetic-force-on-moving-charge']={title:'Magnetic force on a charge',caption:'Reference v is rightward; B is in the shown plane. ⊙/⊗ is F in this illustrative frame, reversed for negative q.',output:'Force magnitude',build(){return forceVectors(false);}};
  scenes['force-on-current-carrying-wire']={title:'Force on a conducting wire',caption:'Reference positive I is rightward; B is shown in-plane. Actual 3D orientation is not specified by sin θ alone.',output:'Force magnitude',build(){return forceVectors(true);}};
  scenes['force-between-parallel-wires']={title:'Parallel currents: attraction or repulsion',caption:'Same-direction currents attract; opposite currents repel. Force arrows are separate from current highlights.',output:'Force per length',resultTone:'positive',read:field,build(){
    panel.classList.add('phys-parallel-currents');svg.setAttribute('viewBox','0 0 320 292');
    const status=text(160,24,'Awaiting calculation');status.classList.add('phys-current-status');
    [82,238].forEach((x,i)=>text(x,204,i?'I₂':'I₁'));
    const values=[82,238].map(x=>text(x,231,'— A'));values.forEach((t,i)=>{t.classList.add('phys-instrument-value');bind(t,i?'secondary':'current',i?'Current I₂':'Current I₁',s=>scientificNumber(s.values[i])+' A');});
    const dimension=line(82,253,238,253,'neutral');[82,238].forEach(x=>line(x,248,x,258,'neutral'));const distance=text(160,283,'r = — m');
    bind(dimension,'neutral','Separation',s=>scientificNumber(s.values[2])+' m');
    currentConductor('M82,178 L82,48',s=>s.values[0],{width:10,endpoints:[[82,48],[82,178]],indicator:[82,162,82,64],label:'Current I₁'});
    currentConductor('M238,178 L238,48',s=>s.values[1],{width:10,endpoints:[[238,48],[238,178]],indicator:[238,162,238,64],tone:'secondary',label:'Current I₂'});
    const f1=arrow(82,112,120,112,'positive'),f2=arrow(238,112,200,112,'positive');bind(f1.g,'positive','Force per length',field);bind(f2.g,'positive','Force per length',field);
    return s=>{const [a,b]=s.values,sign=Math.sign(a*b),tone=sign<0?'negative':sign>0?'positive':'neutral';status.textContent=sign>0?'Attraction':sign<0?'Repulsion':'Zero force';status.style.fill=palette[tone];values.forEach((t,i)=>t.textContent=scientificNumber(s.values[i])+' A');distance.textContent='r = '+scientificNumber(s.values[2])+' m';f1.set(82,112,82+sign*42,112);f2.set(238,112,238-sign*42,112);f1.setTone(tone);f2.setTone(tone);};
  }};

  scenes['magnetic-flux']={title:'Field through an oriented surface',caption:'θ is the angle between B and the surface normal n. Φ = B A cos θ, including its sign.',output:'Magnetic flux Φ',resultTone:'positive',build(){
    svg.setAttribute('viewBox','0 0 320 288');
    const fieldArrows=[62,110,158,206,254].map(x=>arrow(x,46,x,181,'field'));
    const area=node('ellipse',{cx:160,cy:118,rx:82,ry:23,fill:'var(--card)',stroke:palette.material,'stroke-width':3});
    const normal=arrow(160,118,160,182,'secondary');
    const b=valueLabel(160,25,'B',s=>scientificNumber(s.values[0])+' T','field'),a=valueLabel(160,224,'A',s=>scientificNumber(s.values[1])+' m²','material'),angle=text(160,260,'θ = —° · n to B');
    bind(area,'material','Surface area',s=>scientificNumber(s.values[1])+' m²');bind(normal.g,'secondary','Surface normal',s=>'θ: '+scientificNumber(Math.acos(clamp(s.values[2],-1,1))*180/Math.PI)+'°');bind(angle,'secondary','Angle to normal',s=>scientificNumber(Math.acos(clamp(s.values[2],-1,1))*180/Math.PI)+'°');
    scientificMotion('field',fieldArrows.map(a=>a.g),s=>s.values[0]);
    return s=>{const theta=Math.acos(clamp(s.values[2],-1,1));normal.set(160,118,160+64*Math.sin(theta),118+64*Math.cos(theta));angle.textContent='θ = '+scientificNumber(theta*180/Math.PI)+'° · n to B';area.setAttribute('transform','rotate('+(-theta*180/Math.PI)+' 160 118)');area.setAttribute('fill-opacity',s.values[1]===0?.25:1);b(s);a(s);};
  }};

  scenes['faraday-induced-emf']={title:'Flux change induces EMF',caption:'The arrow denotes increasing/decreasing flux, not magnet motion. The calculation gives EMF magnitude, without circuit polarity.',output:'Induced EMF magnitude',build(){
    const coil=winding(85,70,150,65,7);const flux=arrow(160,171,160,147,'secondary');text(160,32,'Flux-linked coil');text(160,222,'ΔΦ trend');
    const linkage=[92,112].map(y=>line(65,y,255,y,'field'));linkage.forEach(l=>l.setAttribute('stroke-dasharray','5 5'));
    bind(coil,'current','Coil turns',s=>number(s.values[0])+' turns');bind(flux.g,'secondary','Flux change',s=>'ΔΦ: '+number(s.values[1])+' Wb\nΔt: '+number(s.values[2])+' s');
    scientificMotion('coil',coil,s=>s.result);
    scientificMotion('field',linkage,s=>s.values[1]);
    scientificMotion('vector',flux.g,s=>s.values[1]);
    return s=>{const sign=Math.sign(s.values[1]);flux.set(160,171,160,171-sign*24);};
  }};
  scenes['motional-emf']={title:'Moving rod on conducting rails',caption:'Rail-plane projection: B⊥ = B sin θ; × into, · out of the page. Rightward v is the chosen reference; circuit polarity is unspecified.',output:'Motional EMF magnitude',build(){
    line(30,60,265,60,'neutral');line(30,160,265,160,'neutral');const marks=[70,125,180,235].flatMap(x=>[text(x,95,'×'),text(x,140,'×')]);const rod=line(175,58,175,162,'current');rod.setAttribute('stroke-width',7);const velocity=arrow(175,35,245,35,'secondary');text(260,36,'v');text(192,186,'Rod L');bind(rod,'current','Conductor length',s=>number(s.values[1])+' m');bind(velocity.g,'secondary','Speed',s=>number(s.values[2])+' m/s');
    marks.forEach(m=>bind(m,'field','Perpendicular field projection B⊥',s=>scientificNumber(s.values[0]*s.values[3])+' T'));
    scientificMotion('field',marks,s=>s.values[0]*s.values[3],{text:true});
    scientificMotion('vector',velocity.g,s=>s.values[2]);
    return s=>{marks.forEach(m=>m.textContent=s.values[0]<0?'·':'×');const length=65*Math.abs(s.values[2])/s.scales[0];velocity.set(175,35,175+length,35);};
  }};
  scenes['self-inductance']={title:'Flux linkage per ampere',caption:'A single coil stores flux linkage. Induced EMF additionally needs dI/dt, which is not entered here.',output:'Self-inductance L',invalidNote:'A passive self-inductance cannot be negative. Flux linkage and current must use the same winding reference. The previous diagram is preserved.',build(){
    const coil=currentWinding(70,75,160,65,8,s=>s.values[1]);const flux=arrow(75,50,225,50,'field');text(150,32,'Flux linkage NΦ');text(150,185,'L = NΦ / I');bind(coil,'current','Current',s=>number(s.values[1])+' A');bind(flux.g,'field','Flux linkage',s=>number(s.values[0])+' Wb-turn');
    scientificMotion('field',flux.g,s=>s.values[0]);
    return s=>{const sign=Math.sign(s.values[0]);flux.set(150-sign*65,50,150+sign*65,50);};
  }};
  scenes['mutual-inductance']={title:'Magnetic coupling between coils',caption:'Shared flux linkage · representative windings.',output:'Mutual Inductance |M|',read:s=>number(Math.abs(s.result))+' '+s.unit,note:'|M| = |ε| / |dI/dt|. Schematic coupling; phase, polarity and flux magnitude are unspecified.',build(){
    panel.classList.add('phys-mutual');svg.setAttribute('viewBox','0 0 320 164');
    const defs=node('defs'),metal=node('linearGradient',{id:'caluler-mutual-metal',x1:'0%',y1:'0%',x2:'100%',y2:'100%'},defs);
    [['0%','var(--phys-mutual-metal-edge)'],['38%','var(--phys-mutual-metal-light)'],['64%','var(--phys-mutual-metal-edge)'],['100%','var(--phys-mutual-metal-light)']].forEach(([offset,color])=>node('stop',{offset,'stop-color':color},metal));
    // One shared axial reference and shallow return contours, with no chosen
    // flux direction, calibrated strength, core or electrical connection.
    const linkage=node('g',{class:'phys-mutual-linkage'});
    line(28,76,292,76,'field',linkage).setAttribute('stroke-width','1.6');
    path('M28 76 C28 20 292 20 292 76','field',1.6,linkage);
    path('M28 76 C28 132 292 132 292 76','field',1.6,linkage);
    bind(linkage,'field','Shared magnetic flux linkage',()=> 'Schematic linkage; flux magnitude, direction and AC phase are unspecified.');
    const highlights=[];
    [48,200].forEach((x,i)=>{
      const g=node('g',{class:'phys-mutual-coil'}),d=windingGeometry(x,52,72,48,6);
      const body=path(d,'neutral',4.5,g);body.style.stroke='url(#caluler-mutual-metal)';
      const highlight=path(d,'field',1.2,g);highlight.classList.add('phys-mutual-highlight');highlights.push(highlight);
      const label=text(x+36,146,i?'Secondary':'Primary');label.classList.add('phys-mutual-label');
      bind(g,i?'secondary':'current',i?'Induced EMF magnitude':'Primary current-change rate',s=>number(i?Math.abs(s.values[0]):s.values[1])+(i?' V':' A/s'));
    });
    // Synchronized emphasis on Calculate, not travelling particles or an
    // inferred instantaneous AC phase. Metal windings stay visible at zero.
    scientificMotion('coupling',[linkage,...highlights],s=>s.result===0?0:1);
    return ()=>{};
  }};
  scenes['energy-stored-in-an-inductor']={title:'Energy stored in the magnetic field',caption:'Stored energy belongs to the magnetic field, not a calibrated capacity gauge.',output:'Stored energy U',note:'U = ½ L I². Field geometry is schematic; current highlights are not electron drift speed.',build(){
    svg.setAttribute('viewBox','0 0 320 214');
    const region=node('ellipse',{cx:160,cy:103,rx:112,ry:61,fill:palette.field,'fill-opacity':.035,stroke:'none'});
    const guides=[83,103,123].map(y=>arrow(82,y,238,y,'field'));
    const coil=currentWinding(70,72,180,62,8,s=>s.values[1]);
    bind(coil,'current','Inductor',s=>'L: '+number(s.values[0])+' H\nI: '+number(s.values[1])+' A');
    bind(region,'field','Stored magnetic energy',field);text(160,190,'Magnetic energy · schematic');
    return s=>{const sign=s.result>0?Math.sign(s.values[1]):0;guides.forEach((a,j)=>a.set(160-sign*78,83+j*20,160+sign*78,83+j*20));region.setAttribute('fill-opacity',sign?.045:0);};
  }};
  scenes['electromagnetic-torque']={title:'Torque on a current loop',caption:'Torque depends on sin θ between the loop normal and B. Rotation sense also needs the winding orientation.',output:'Electromagnetic torque',build(){
    node('rect',{x:15,y:60,width:35,height:95,rx:6,fill:'var(--border)'});node('rect',{x:250,y:60,width:35,height:95,rx:6,fill:'var(--border)'});const poles=[text(33,115,'N'),text(267,115,'S')];const fieldVector=arrow(55,40,245,40,'field');const coil=node('rect',{x:90,y:65,width:120,height:85,rx:5,fill:'none',stroke:palette.current,'stroke-width':4});const torque=path('M110 174 A52 22 0 0 0 198 172','positive',3);text(150,207,'Torque · sense unspecified');bind(coil,'current','Current loop',s=>'N: '+number(s.values[0])+'\nI: '+number(s.values[1])+' A\nA: '+number(s.values[2])+' m²');bind(torque,'positive','Torque',field);
    const loop=currentConductor('M210,108 L210,70 Q210,65 205,65 L95,65 Q90,65 90,70 L90,145 Q90,150 95,150 L205,150 Q210,150 210,145 Z',s=>s.values[1],{gate:s=>s.values[0],indicator:[210,120,210,90],label:'Loop current',width:4});
    scientificMotion('vector',torque,s=>s.result);
    scientificMotion('field',fieldVector.g,s=>s.values[4]);
    return s=>{const direction=Math.sign(s.values[4]);fieldVector.set(150-direction*95,40,150+direction*95,40);poles[0].textContent=direction===0?'—':direction<0?'S':'N';poles[1].textContent=direction===0?'—':direction<0?'N':'S';const projection=clamp(s.values[3],0,1);attr(coil,{x:150-(30+80*projection)/2,width:30+80*projection});const left=150-(30+80*projection)/2,right=300-left;loop.setGeometry('M'+right+',108 L'+right+',70 Q'+right+',65 '+(right-5)+',65 L'+(left+5)+',65 Q'+left+',65 '+left+',70 L'+left+',145 Q'+left+',150 '+(left+5)+',150 L'+(right-5)+',150 Q'+right+',150 '+right+',145 Z',[right,120,right,90]);torque.setAttribute('opacity',s.result===0?.2:1);};
  }};
  scenes['magnetic-dipole-moment']={title:'Current loop & magnetic moment',caption:'The signed moment follows the reference winding normal. The loop represents the entered area and turns schematically.',output:'Magnetic moment m',resultTone:'positive',build(){
    svg.setAttribute('viewBox','0 0 320 302');
    currentConductor(loopGeometry(160,108,98,34),s=>s.values[0],{gate:s=>s.values[2],width:8,indicator:[239,128,258,108],label:'Loop current'});
    const moment=arrow(160,108,160,30,'positive'),m=text(184,33,'m');bind(moment.g,'positive','Magnetic moment',field);
    const current=valueLabel(16,218,'I',s=>scientificNumber(s.values[0])+' A','current','start'),area=valueLabel(16,251,'A',s=>scientificNumber(s.values[1])+' m²','secondary','start'),turns=valueLabel(16,284,'N',s=>scientificNumber(s.values[2]),'material','start');
    scientificMotion('vector',moment.g,s=>s.result);
    return s=>{const sign=Math.sign(s.result);moment.set(160,108,160,108-sign*76);m.textContent=sign?'m':'m = 0';attr(m,{y:sign<0?189:33});current(s);area(s);turns(s);};
  }};

  scenes['magnetic-permeability']={title:'Material field response',caption:'B = μH relates the supplied signed fields. Line counts are illustrative and do not classify the material.',output:'Permeability μ',build(){
    node('rect',{x:170,y:48,width:105,height:120,rx:9,fill:'var(--border)'});text(72,200,'Applied H');text(222,200,'Material B');const h=[65,105,145].map(y=>arrow(25,y,120,y,'current')),b=[65,105,145].map(y=>arrow(180,y,265,y,'field'));h.forEach(a=>bind(a.g,'current','Field strength H',s=>number(s.values[1])+' A/m'));b.forEach(a=>bind(a.g,'field','Flux density B',s=>number(s.values[0])+' T'));
    scientificMotion('field',h.map(a=>a.g),s=>s.values[1]);
    scientificMotion('field',b.map(a=>a.g),s=>s.values[0]);
    return s=>{h.forEach((a,i)=>a.set(72-Math.sign(s.values[1])*43,65+i*40,72+Math.sign(s.values[1])*43,65+i*40));b.forEach((a,i)=>a.set(222-Math.sign(s.values[0])*40,65+i*40,222+Math.sign(s.values[0])*40,65+i*40));};
  }};
  scenes['magnetic-susceptibility']={title:'Signed magnetic response',caption:'Positive χ aligns magnetization with H; negative χ opposes it. The scale is illustrative and labelled.',output:'Susceptibility χ',resultTone:'material',build(){
    svg.setAttribute('viewBox','0 0 320 238');
    const negative=node('rect',{x:34,y:92,width:126,height:30,rx:8,fill:palette.negative,'fill-opacity':'.07'}),positive=node('rect',{x:160,y:92,width:126,height:30,rx:8,fill:palette.positive,'fill-opacity':'.07'});
    line(34,107,286,107,'neutral');line(160,85,160,129,'neutral');text(160,155,'0');text(18,192,'Opposing','start');text(302,192,'Aligned','end');
    const left=text(18,62,'' ,'start'),right=text(302,62,'','end'),response=arrow(160,107,200,107,'material'),status=text(160,218,'Neutral response');
    bind(response.g,'material','Susceptibility',field);bind(negative,'negative','Opposing reference',s=>scientificNumber(-s.scales[0]));bind(positive,'positive','Aligned reference',s=>scientificNumber(s.scales[0]));
    return s=>{const max=s.scales[0],sign=Math.sign(s.result);response.set(160,107,160+112*s.result/max,107);response.setTone(sign<0?'negative':sign>0?'positive':'neutral');left.textContent=scientificNumber(-max);right.textContent=scientificNumber(max);status.textContent=sign<0?'Opposing response':sign>0?'Aligned response':'Neutral response';status.style.fill=palette[sign<0?'negative':sign>0?'positive':'neutral'];};
  }};

  function transformer(currentMode) {
    const core=node('rect',{x:90,y:40,width:120,height:140,rx:14,fill:'none',stroke:'var(--border)','stroke-width':16});const primary=currentMode?currentWinding(50,75,65,80,7,s=>s.values[0]):winding(50,75,65,80,7),secondary=currentMode?currentWinding(185,75,65,80,7,s=>s.result,{tone:'secondary'}):winding(185,75,65,80,7,'secondary');text(75,205,'Primary');text(220,205,'Secondary');path('M125 33 Q150 20 175 33','field',2);
    bind(primary,'current',currentMode?'Primary current':'Primary winding',s=>currentMode?number(s.values[0])+' A':'Np: '+number(s.values[0])+'\nVp: '+number(s.values[2])+' V');bind(secondary,'secondary',currentMode?'Secondary current':'Secondary winding',s=>currentMode?field(s):'Ns: '+number(s.values[1])+'\nVs: '+field(s));
    const primaryArrow=arrow(25,20,90,20,'current'),secondaryArrow=arrow(200,20,265,20,'secondary');
    text(150,225,currentMode?'Is / Ip = Np / Ns':'Vs / Vp = Ns / Np');
    bind(primaryArrow.g,'current',currentMode?'Primary current':'Primary voltage',s=>number(s.values[currentMode?0:2])+(currentMode?' A':' V'));
    bind(secondaryArrow.g,'secondary',currentMode?'Secondary current':'Secondary voltage',field);
    if(!currentMode){scientificMotion('coil',primary,s=>s.values[2]);scientificMotion('coil',secondary,s=>s.result);}
    scientificMotion('coupling',core,s=>s.values[currentMode?0:2],{structural:true});
    return s=>{const input=s.values[currentMode?0:2],max=Math.max(Math.abs(input),Math.abs(s.result))||1;primaryArrow.set(25,20,25+65*Math.abs(input)/max,20);secondaryArrow.set(200,20,200+65*Math.abs(s.result)/max,20);};
  }
  scenes['transformer-turns-ratio']={title:'Transformer winding ratio',caption:'Ideal voltage ratio Vs/Vp = Ns/Np. Drawn turns are representative; voltage arrows compare magnitudes, not instantaneous AC direction or phase.',output:'Secondary voltage Vs',details:s=>'Np '+number(s.values[0])+' · Ns '+number(s.values[1])+' · Ns/Np '+number(s.values[1]/s.values[0])+' · Vp '+number(s.values[2])+' V',build(){return transformer(false);}};
  scenes['transformer-secondary-current']={title:'Transformer current transfer',caption:'Primary and secondary windings are electrically isolated. Turns determine the ideal current ratio.',output:'Secondary current Is',inlineOutput:true,note:'AC winding-current reference values; frequency, instantaneous direction and relative phase are unspecified. No one-way flow is inferred.',details:s=>'Turns ratio Np/Ns = '+scientificNumber(s.values[1]/s.values[2]),build(){
    svg.setAttribute('viewBox','0 0 320 286');
    const core=node('rect',{x:94,y:44,width:132,height:104,rx:12,fill:'none',stroke:'var(--border)','stroke-width':18});core.classList.add('phys-instrument-core');
    const coupling=node('rect',{x:94,y:44,width:132,height:104,rx:12,fill:'none',stroke:palette.field,'stroke-width':2});coupling.classList.add('phys-field-guide');bind(coupling,'field','Magnetic coupling',s=>'Ideal turns ratio Np/Ns: '+scientificNumber(s.values[1]/s.values[2]));
    currentConductor(windingGeometry(56,61,64,72,7),s=>s.values[0],{width:5,label:'Primary current',magnitudeOnly:true});
    currentConductor(windingGeometry(200,61,64,72,7),s=>s.result,{width:5,tone:'secondary',label:'Secondary current',magnitudeOnly:true});
    text(80,20,'Primary');text(240,20,'Secondary');text(80,172,'Iₚ');text(240,172,'Iₛ');text(80,220,'Nₚ');text(240,220,'Nₛ');text(160,270,'Iₛ / Iₚ = Nₚ / Nₛ');
    const ip=bind(text(80,194,'—'),'current','Primary current',s=>scientificNumber(s.values[0])+' A'),is=bind(text(240,194,'—'),'secondary','Secondary current',field),np=bind(text(80,242,'—'),'current','Primary turns',s=>scientificNumber(s.values[1])),ns=bind(text(240,242,'—'),'secondary','Secondary turns',s=>scientificNumber(s.values[2]));is.classList.add('phys-inline-result');
    scientificMotion('coupling',coupling,s=>s.values[0]);
    return s=>{ip.textContent=scientificNumber(s.values[0])+' A';is.textContent=field(s);np.textContent=scientificNumber(s.values[1]);ns.textContent=scientificNumber(s.values[2]);[ip,is,np,ns].forEach(t=>fitValue(t,136));};
  }};

  scenes['ac-generator-peak-emf']={title:'Rotating-coil generator',caption:'The coil is shown at reference phase θ = 0. The waveform uses the calculated signed peak and entered angular speed.',output:'Peak EMF εpk',resultTone:'positive',build(){
    const g=instrumentPlot('Time (s)','EMF (V)',{header:104,height:144});
    [82,212].forEach(x=>node('rect',{x,y:12,width:26,height:58,rx:5,class:'phys-instrument-pole'}));const poles=[text(95,48,'N'),text(225,48,'S')];
    const coil=node('rect',{x:157,y:20,width:6,height:44,rx:3,fill:'none',stroke:palette.current,'stroke-width':4});text(160,94,'Reference θ = 0');
    bind(coil,'current','Reference coil',s=>'N: '+scientificNumber(s.values[0])+'\nB: '+scientificNumber(s.values[1])+' T\nA: '+scientificNumber(s.values[2])+' m²');bind(g.curve,'positive','Generated EMF',s=>'Peak: '+field(s)+'\nω: '+scientificNumber(s.values[3])+' rad/s');bind(g.mark,'positive','Reference phase',s=>'t: 0 s\nEMF: 0 V\nPeak: '+field(s));
    scientificMotion('coil',coil,s=>s.result);scientificMotion('wave',g.curve,s=>s.result);
    return s=>{const direction=Math.sign(s.values[1]);poles[0].textContent=direction<0?'S':direction>0?'N':'—';poles[1].textContent=direction<0?'N':direction>0?'S':'—';const time=s.scales[0],peak=s.scales[1],points=Array.from({length:81},(_,j)=>[time*j/80,s.result===0?0:s.result*Math.sin(s.values[3]*time*j/80)]);g.draw({maxX:time,maxY:peak,points,pointX:0,pointY:0});};
  }};

  scenes['inductor-reactance']={title:'Reactance rises with frequency',caption:'XL = 2πfL. Nonnegative frequency and inductance produce a nonnegative reactance scale.',output:'Inductive reactance XL',build(){
    const g=instrumentPlot('Frequency (Hz)','XL (Ω)',{signed:false});bind(g.mark,'positive','Calculated point',s=>'f: '+scientificNumber(s.values[0])+' Hz\nXL: '+field(s));
    return s=>{const [f,l]=s.values,xmax=s.scales[0],slope=f?s.result/f:2*Math.PI*l,ymax=Math.max(s.scales[1],Math.abs(slope*xmax))||1;g.draw({maxX:xmax,maxY:ymax,points:[[0,0],[xmax,slope*xmax]],pointX:f,pointY:s.result});};
  }};

  scenes['magnetic-energy-density']={
    title:'Magnetic field region',caption:'',output:'Energy Density',
    initialNote:'u = B² / (2μ)',note:'u = B² / (2μ)',
    invalidNote:'Use finite B and positive permeability μ > 0. The previous diagram is preserved.',
    interpolate(from,target,ease){
      const oldB=from.values[0],newB=target.values[0];
      let B=clamp(oldB+(newB-oldB)*ease,Math.min(oldB,newB),Math.max(oldB,newB));
      // Remove easing roundoff only at a signed zero crossing, never at an input endpoint.
      if(ease>0&&ease<1&&oldB!==0&&newB!==0&&Math.sign(oldB)!==Math.sign(newB)&&Math.abs(B)<=8*Number.EPSILON*Math.max(Math.abs(oldB),Math.abs(newB)))B=0;
      const oldMu=from.values[1]>0?from.values[1]:target.values[1],newMu=target.values[1];
      const mu=clamp(oldMu*(1-ease)+newMu*ease,Math.min(oldMu,newMu),Math.max(oldMu,newMu));
      return {...target,values:[B,mu],result:B*B/(2*mu),scales:target.scales.map((n,i)=>from.scales[i]*(1-ease)+n*ease)};
    },
    build(){
      panel.classList.add('phys-energy-density');svg.setAttribute('viewBox','0 0 320 220');
      const cube=node('g',{class:'phys-energy-cube',role:'img','aria-label':'Schematic unit volume; enter B and positive permeability, then Calculate.'});
      const description=node('title',{},cube);description.textContent='Schematic unit volume, not a calibrated field-strength scale.';
      node('polygon',{points:'118,34 242,34 242,158 118,158',fill:'none',stroke:palette.field,'stroke-width':1.4,'stroke-opacity':.25},cube);
      node('path',{d:'M78 188L118 158H242M118 158V34',fill:'none',stroke:palette.field,'stroke-width':1.3,'stroke-opacity':.3,'stroke-dasharray':'3 4'},cube);
      node('polygon',{points:'78,64 118,34 242,34 202,64',fill:palette.field,'fill-opacity':.025,stroke:palette.field,'stroke-width':1.4,'stroke-opacity':.6},cube);
      node('polygon',{points:'202,64 242,34 242,158 202,188',fill:palette.field,'fill-opacity':.055,stroke:palette.field,'stroke-width':1.4,'stroke-opacity':.7},cube);
      const shade=node('polygon',{points:'78,64 202,64 202,188 78,188',fill:palette.field,'fill-opacity':0,stroke:palette.field,'stroke-width':1.6,'stroke-opacity':.75},cube);
      const fieldLines=node('g',{class:'phys-energy-field','aria-hidden':'true'},cube);
      const arrows=[71,91,111,131,151].map(y=>{const a=arrow(110,y,210,y,'field',fieldLines);a.g.setAttribute('opacity','0');return{...a,y};});
      const volume=text(160,210,'Unit volume · schematic');volume.classList.add('phys-energy-volume');
      return s=>{
        const B=s.values[0],direction=Math.sign(B),magnitude=Math.log1p(Math.abs(B)),strength=magnitude/(1+magnitude);
        shade.setAttribute('fill-opacity',direction ? .025+.055*strength : 0);
        arrows.forEach(a=>{a.set(direction>0?110:direction<0?210:160,a.y,direction>0?210:direction<0?110:160,a.y);a.g.setAttribute('stroke-opacity',.65+.25*strength);});
        cube.dataset.fieldDirection=direction>0?'positive-reference':direction<0?'negative-reference':'zero';
        const summary='B = '+number(B)+' T; μ = '+number(s.values[1])+' H/m. '+(direction?'Uniform field along the '+(direction>0?'positive':'negative')+' reference direction.':'No magnetic field.')+' Cube size, five line count and shading are schematic, not a calibrated field-strength or energy scale.';
        description.textContent=summary;cube.setAttribute('aria-label',summary);
      };
    }
  };
  // Only source-backed current paths travel. Field/coil emphasis is schematic,
  // never a particle count, drift speed, measured phase or inferred core flux.
  const scientificTracks=[];
  function scientificMotion(kind,roots,value,options={}) {
    const ink=[];
    function collect(el){
      const tag=el.tagName.toLowerCase();
      if(['line','path','ellipse','circle','rect'].includes(tag)||(options.text&&tag==='text')){
        ink.push({el,width:Number(el.getAttribute('stroke-width'))||2.5,text:tag==='text'});
        el.setAttribute('data-scientific-cue',kind);
      }
      Array.from(el.children).forEach(collect);
    }
    (Array.isArray(roots)?roots:[roots]).forEach(collect);
    const track={kind,value,options,ink};
    if(kind==='current'){
      track.cue=line(0,0,0,0,options.tone||'current');
      attr(track.cue,{'stroke-width':4,opacity:0,'aria-hidden':'true','pointer-events':'none','data-scientific-current':'true'});
    }
    scientificTracks.push(track);
  }
  function scientificMotionNote(){
    if(scientificTracks.some(t=>t.kind==='current'))return 'Conventional-current cue, not drift speed; fields are not moving matter.';
    if(scientificTracks.some(t=>t.kind==='coupling'))return 'Schematic winding/coupling emphasis; AC phase and core flux are not inferred.';
    if(scientificTracks.some(t=>t.kind==='wave'))return 'Wave reshaping uses the entered angular speed; no measured phase or rotation is inferred.';
    return 'Schematic field/coil emphasis; field lines are not particles or moving matter.';
  }
  function scientificReferences(target,property,getter){
    return scientificTracks.map((t,i)=>Math.max(Math.abs(getter(t,target))||0,displayed?.[property]?.[i]||0)||1);
  }
  function updateScientificMotion(s){
    const fraction=s.scientificPhase-Math.floor(s.scientificPhase),pulse=Math.max(0,Math.sin(Math.PI*fraction));
    scientificTracks.forEach((t,i)=>{
      const value=t.value(s),gate=t.options.gate?t.options.gate(s):1;
      const strength=clamp(Math.abs(value)/s.scientificRefs[i],0,1)*clamp(Math.abs(gate)/s.scientificGateRefs[i],0,1);
      const base=(t.kind==='coil'||t.options.structural) ? .4 : 0;
      t.ink.forEach(p=>{
        p.el.setAttribute(p.text?'fill-opacity':'stroke-opacity',base+(1-base)*strength*(.85+.15*pulse));
        if(!p.text)p.el.setAttribute('stroke-width',p.width+Math.min(.45,p.width*.12)*pulse*strength);
      });
      if(t.cue){
        const {x1,y1,x2,y2}=t.options,dx=x2-x1,dy=y2-y1,length=Math.hypot(dx,dy);
        const position=value<0?1-fraction:fraction,half=Math.min(7,length*.08),f=clamp(position,half/length,1-half/length);
        attr(t.cue,{x1:x1+dx*f-dx/length*half,y1:y1+dy*f-dy/length*half,x2:x1+dx*f+dx/length*half,y2:y1+dy*f+dy/length*half,opacity:pulse*strength*.8,'data-current-value':value,'data-current-direction':value===0||gate===0?'zero':value<0?'reverse':'forward'});
      }
    });
  }
  // A separate CSS clock animates only actual conductors. Financial/scientific
  // calculation snapshots still use the existing 1800 ms RAF timeline.
  const conductorTracks=[];
  const flowPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
  // The CSS cycle is only a phase basis. Its live playback rate determines speed.
  const flowPhaseMs=1000;
  // Visual calibration in amperes, not a physical velocity or current limit.
  // Fixed per tool: editing, calculating and refreshing never renormalize to I.
  const flowReferenceAmps=Object.freeze({"electric-charge":20,"magnetic-field-of-a-straight-wire":20,"magnetic-field-of-a-solenoid":50,"magnetic-field-of-a-circular-coil":5,"magnetic-field-on-coil-axis":5,"biotsavart-law":1,"amperes-law-magnetic-field":20,"force-on-current-carrying-wire":20,"force-between-parallel-wires":20,"self-inductance":1,"energy-stored-in-an-inductor":1,"solenoid-turns":10,"electromagnetic-torque":5,"magnetic-dipole-moment":5,"transformer-secondary-current":10});
  const currentFlowReference=flowReferenceAmps[key]||1;
  let flowInView=true;
  function currentFlowRate(current){
    const magnitude=Math.abs(current);
    if(!Number.isFinite(magnitude)||!magnitude||!currentFlowReference)return 0;
    // Stable log(1 + |I|/reference), without overflowing or underflowing the ratio.
    const delta=Math.log(magnitude)-Math.log(currentFlowReference);
    const logarithm=delta>0?delta+Math.log1p(Math.exp(-delta)):Math.log1p(Math.exp(delta));
    return 1/30+(1/3-1/30)*logarithm/(1+logarithm);
  }
  function flowActivity(){
    const paused=document.hidden||!flowInView||flowPreference.matches;
    for(const t of conductorTracks){
      t.g.dataset.flowReduced=String(flowPreference.matches);
      const animation=t.sparks.getAnimations?.()[0];
      const controlled=!!animation&&(typeof animation.updatePlaybackRate==='function'||'playbackRate' in animation);
      if(controlled){
        if(t.direction&&t.direction!==t.appliedDirection){
          const elapsed=animation.currentTime;
          t.sparks.style.animationDirection=t.direction<0?'reverse':'normal';
          if(t.appliedDirection&&typeof elapsed==='number'&&Number.isFinite(elapsed)){
            const phase=elapsed%flowPhaseMs;
            animation.currentTime=elapsed-phase+flowPhaseMs-phase;
          }
          t.appliedDirection=t.direction;
        }
        if(animation!==t.animation||t.rate!==t.appliedRate){
          if(typeof animation.updatePlaybackRate==='function')animation.updatePlaybackRate(t.rate);
          else{
            const elapsed=animation.currentTime;animation.playbackRate=t.rate;
            if(typeof elapsed==='number'&&Number.isFinite(elapsed))animation.currentTime=elapsed;
          }
          t.animation=animation;t.appliedRate=t.rate;
        }
      }
      t.g.dataset.flowRateSupported=String(controlled);
      t.sparks.style.animationPlayState=paused||!t.active||!controlled?'paused':'running';
    }
  }
  function commitCurrentFlow(s){
    for(const t of conductorTracks){
      const value=t.value(s),enabled=!t.options.magnitudeOnly&&Number.isFinite(value)&&value!==0&&(!t.options.gate||t.options.gate(s)!==0);
      if(enabled)t.direction=Math.sign(value);
      t.active=enabled;t.rate=enabled?currentFlowRate(value):0;
      t.g.dataset.flowActive=String(enabled);
      t.g.dataset.flowDirection=t.options.magnitudeOnly&&value!==0?'AC phase unspecified':enabled?(value>0?'forward':'reverse'):'zero';
      t.g.dataset.flowCurrent=String(value);
      t.g.dataset.flowReferenceCurrent=String(currentFlowReference);
      t.g.dataset.flowRate=String(t.rate);
      t.g.dataset.flowPeriodMs=String(t.rate?flowPhaseMs/t.rate:0);
      if(t.indicator)t.setIndicator(enabled?t.direction:0);
    }
    flowActivity();
  }
  function setupCurrentFlow(){
    if(!conductorTracks.length)return;
    panel.classList.add('phys-continuous-current');
    document.addEventListener('visibilitychange',flowActivity);
    flowPreference.addEventListener?.('change',flowActivity);
    if(typeof IntersectionObserver!=='undefined'){
      const observer=new IntersectionObserver(entries=>{
        flowInView=entries[0].isIntersecting;flowActivity();
      },{rootMargin:'100px',threshold:0});
      observer.observe(panel);
    }
    flowActivity();
  }
  function currentConductor(d,value,options={}){
    const tone=options.tone||'current',g=node('g',{class:'phys-current-conductor','data-flow-phase-ms':flowPhaseMs,'data-flow-period-ms':0,'data-flow-active':'false','data-flow-direction':'zero'},options.parent||svg);
    g.style.setProperty('--phys-flow-color',palette[tone]);
    const edge=path(d,tone,options.width||7,g),core=path(d,tone,(options.width||7)*.52,g);
    edge.classList.add('phys-wire-edge');core.classList.add('phys-wire-core');
    const sparks=node('g',{class:'phys-current-sparks','data-caluler-diagram-export-ignore':'','aria-hidden':'true','pointer-events':'none'},g);
    const trail=path(d,tone,5,sparks),spark=path(d,tone,2.8,sparks);
    [trail,spark].forEach(p=>{p.setAttribute('pathLength','100');p.setAttribute('vector-effect','non-scaling-stroke');});
    trail.classList.add('phys-current-trail');spark.classList.add('phys-current-spark');
    const caps=(options.endpoints||[]).map(([cx,cy])=>node('circle',{cx,cy,r:4,class:'phys-wire-cap','pointer-events':'none'},g));
    const indicator=options.indicator?arrow(0,0,0,0,tone,g):null;
    if(indicator)indicator.g.classList.add('phys-current-static');
    const track={g,sparks,value,options,active:false,direction:0,appliedDirection:0,rate:0,appliedRate:null,animation:null,indicator,
      setIndicator(sign){const [x1,y1,x2,y2]=options.indicator;indicator.set(sign<0?x2:x1,sign<0?y2:y1,sign===0?x1:sign<0?x1:x2,sign===0?y1:sign<0?y1:y2);},
      setGeometry(next,indicatorPoints){[edge,core,trail,spark].forEach(p=>p.setAttribute('d',next));if(indicatorPoints){options.indicator=indicatorPoints;this.setIndicator(this.active?this.direction:0);}}
    };
    if(indicator)track.setIndicator(0);
    if(options.label)bind(g,tone,options.label,s=>number(value(s))+' A');
    conductorTracks.push(track);return track;
  }
  function loopGeometry(cx,cy,rx,ry){
    // Positive path is counter-clockwise in this drawing's reference view.
    return 'M'+(cx+rx)+','+cy+' A'+rx+','+ry+' 0 1 0 '+(cx-rx)+','+cy+' A'+rx+','+ry+' 0 1 0 '+(cx+rx)+','+cy+' Z';
  }
  function windingGeometry(x,y,width,height,turns){
    const cy=y+height/2,rx=width/turns*.35,ry=height/2,pitch=width/turns,k=4/3*Math.tan(Math.PI/8);
    let d='M'+(x-12)+','+cy+' L'+x+','+cy;
    for(let q=0;q<turns*4;q++){
      const a=q*Math.PI/2,b=(q+1)*Math.PI/2;
      const ax=x+pitch*q/4+rx*(Math.cos(a)-1),ay=cy-ry*Math.sin(a);
      const bx=x+pitch*(q+1)/4+rx*(Math.cos(b)-1),by=cy-ry*Math.sin(b);
      d+=' C'+(ax+pitch/12-k*rx*Math.sin(a))+','+(ay-k*ry*Math.cos(a))+' '+(bx-pitch/12+k*rx*Math.sin(b))+','+(by+k*ry*Math.cos(b))+' '+bx+','+by;
    }
    return d+' L'+(x+width+12)+','+cy;
  }
  function currentWinding(x,y,width,height,turns,value,options={}){
    return currentConductor(windingGeometry(x,y,width,height,turns),value,{...options,width:4,indicator:[x-12,y+height/2,x,y+height/2]}).g;
  }
  function scalesFor(s) {
    const v=s.values;
    if(key==='coulombs-law')return [nice(Math.abs(s.result)*1.25),nice(Math.abs(v[2])*1.25)];
    if(key==='electric-potential-from-charge')return [nice(Math.abs(s.result)*4),Math.abs(v[1])*4];
    if(key==='frequency-wavelength')return [nice(Math.abs(v[2])*2)];
    if(key==='magnetic-field-on-coil-axis')return [Math.max(Math.abs(v[3])*1.25,Math.abs(v[2])*3),Math.abs(4*Math.PI*1e-7*v[0]*v[1]/(2*v[2]))||1];
    if(key==='inductor-reactance'){const span=nice(Math.abs(v[0])*1.25);return [span,Math.abs(2*Math.PI*v[1]*span)||1];}
    if(key==='ac-generator-peak-emf')return [v[3]?nice(2*Math.PI/Math.abs(v[3])):0,nice(Math.abs(s.result))];
    if(key==='motional-emf')return [nice(Math.abs(v[2])*1.2)];
    return [nice(Math.abs(s.result)*1.25)];
  }
  function validateSnapshot(s) {
    if(!s||!Array.isArray(s.values)||!Number.isFinite(s.result)||s.values.some(v=>!Number.isFinite(v)))return false;
    const v=s.values;
    if(key==='magnetic-energy-density'&&(v.length!==2||s.result<0))return false;
    const positive={ 'coulombs-law':[2],'electric-field-from-charge':[1],'electric-potential-from-charge':[1],'amperes-law-magnetic-field':[1],'magnetic-field-of-a-straight-wire':[1],'magnetic-field-of-a-solenoid':[2],'magnetic-field-of-a-circular-coil':[2],'magnetic-field-on-coil-axis':[2],'biotsavart-law':[3],'force-between-parallel-wires':[2],'faraday-induced-emf':[2],'magnetic-energy-density':[1],'transformer-turns-ratio':[0],'transformer-secondary-current':[2] };
    if((positive[key]||[]).some(i=>v[i]<=0))return false;
    const turns={'magnetic-field-of-a-solenoid':[0],'magnetic-field-of-a-circular-coil':[0],'magnetic-field-on-coil-axis':[0],'faraday-induced-emf':[0],'electromagnetic-torque':[0],'magnetic-dipole-moment':[2],'transformer-turns-ratio':[0,1],'transformer-secondary-current':[1,2],'ac-generator-peak-emf':[0]};
    if((turns[key]||[]).some(i=>v[i]<0))return false;
    if((key==='magnetic-dipole-moment'&&v[1]<0)||(['electromagnetic-torque','ac-generator-peak-emf'].includes(key)&&v[2]<0))return false;
    if(key==='solenoid-turns'&&v[1]<=0)return false;
    const sine={'biotsavart-law':2,'magnetic-force-on-moving-charge':3,'force-on-current-carrying-wire':3,'motional-emf':3,'electromagnetic-torque':3};
    if(key in sine&&(v[sine[key]]<0||v[sine[key]]>1))return false;
    if(key==='magnetic-flux'&&(Math.abs(v[2])>1||v[1]<0||v[0]<0))return false;
    if(key==='biotsavart-law'&&v[1]<0)return false;
    if(key==='inductor-reactance'&&(v[0]<0||v[1]<0))return false;
    if(key==='energy-stored-in-an-inductor'&&v[0]<0)return false;
    if((key==='self-inductance'||key==='solenoid-turns')&&s.result<0)return false;
    if(key==='magnetic-force-on-moving-charge'&&v[1]<0)return false;
    if(key==='force-on-current-carrying-wire'&&v[1]<0)return false;
    if(key==='motional-emf'&&(v[1]<0||v[2]<0))return false;
    if(key==='frequency-wavelength'&&(v[0]<0||v[1]<0||v[2]<0))return false;
    return true;
  }
  let active=null, pointer=null, tooltip;
  function hideTip(){active=null;tooltip.hidden=true;bindings.forEach(b=>b.el.dataset.tapped='false');}
  function refreshTip(){
    if(!active||!displayed)return;
    const b=active;tooltip.textContent=b.label+': '+b.getter(displayed);
    tooltip.style.setProperty('--phys-tip',getComputedStyle(panel).getPropertyValue('--phys-'+b.tone));
    tooltip.hidden=false;
    const r=b.el.getBoundingClientRect(),x=pointer?.x??r.left+r.width/2,y=pointer?.y??r.top;
    const box=tooltip.getBoundingClientRect(),vw=document.documentElement.clientWidth,vh=window.innerHeight;
    tooltip.style.left=clamp(x+12,8,Math.max(8,vw-box.width-8))+'px';
    tooltip.style.top=clamp(y-box.height-12,8,Math.max(8,vh-box.height-8))+'px';
  }
  function update(s){
    displayed=s;updateScene(s);if(conductorTracks.length)commitCurrentFlow(s);if(scientificTracks.length)updateScientificMotion(s);
    if(readout)readout.textContent=scenes[key].read?scenes[key].read(s):resultLabel(scenes[key].output,s);
    if(readout&&premiumTools.has(key)){const tone=s.result<0?'negative':s.result===0?'neutral':scenes[key].resultTone||'current';readout.style.color=palette[tone];const binding=bindings.find(b=>b.el===readout);if(binding)binding.tone=tone;}
    if(detail)detail.textContent=scenes[key].details(s);
    for(const b of bindings)b.el.setAttribute('aria-label',b.label+': '+b.getter(s));
    refreshTip();
  }
  function commit(target,initial=false) {
    if(!panel)return;
    if(!validateSnapshot(target)) {validation.textContent=scenes[key].invalidNote||'Check finite values, positive geometry, non-negative turns and valid angle factors. Passive inductance must be non-negative. The previous diagram is preserved.';validation.hidden=false;return;}
    validation.hidden=true;
    target={...target,values:target.values.slice(),scales:scalesFor(target)};
    if(target.scales.some(n=>!Number.isFinite(n)||n<0)){validation.textContent='These values exceed the scientific illustration range. The previous diagram is preserved.';validation.hidden=false;return;}
    if(scientificTracks.length){
      target.scientificRefs=scientificReferences(target,'scientificRefs',(t,s)=>t.value(s));
      target.scientificGateRefs=scientificReferences(target,'scientificGateRefs',(t,s)=>t.options.gate?t.options.gate(s):1);
      target.scientificPhase=initial?0:Math.floor(displayed?.scientificPhase||0)+1;
    }
    cancelAnimationFrame(frame);
    note.textContent=scenes[key].note||(conductorTracks.length?'Relative conventional-current rate; schematic, not electron drift speed.':scientificTracks.length?scientificMotionNote():'Schematic geometry; numerical labels use the calculated values.');
    if(initial||window.matchMedia('(prefers-reduced-motion: reduce)').matches){update(target);panel.dataset.calulerAnimating='false';return;}
    const from=displayed?{...displayed,values:displayed.values.slice()}:{...target,result:0,values:target.values.map(()=>0)},start=performance.now();
    if(scientificTracks.length&&!displayed)from.scientificPhase=0;
    panel.dataset.calulerAnimating='true';
    function animate(now){
      const progress=clamp((now-start)/1800,0,1),ease=(1-Math.cos(Math.PI*progress))/2;
      const next=scenes[key].interpolate?scenes[key].interpolate(from,target,ease,progress):{...target,result:from.result*(1-ease)+target.result*ease,values:target.values.map((n,i)=>from.values[i]*(1-ease)+n*ease),scales:target.scales.map((n,i)=>from.scales[i]*(1-ease)+n*ease)};
      if(scientificTracks.length){
        for(const property of ['scientificRefs','scientificGateRefs'])next[property]=target[property].map((n,i)=>from[property][i]*(1-ease)+n*ease);
        next.scientificPhase=from.scientificPhase*(1-ease)+target.scientificPhase*ease;
      }
      if(progress===1){update(target);panel.dataset.calulerAnimating='false';frame=0;return;}
      // First calculation starts from neutral geometry, never from zero denominators.
      if(!displayed&&progress===0){frame=requestAnimationFrame(animate);return;}
      update(next);frame=requestAnimationFrame(animate);
    }
    frame=requestAnimationFrame(animate);
  }
  function start() {
    const scene=scenes[key],calculator=document.querySelector('.calculator'),button=document.getElementById('calculateBtn'),result=document.getElementById('calcResult');
    if(!scene||!calculator||!button||!result||calculator.querySelector('.phys-diagram'))return;
    const grid=calculator.querySelector('.form-grid');if(!grid)return;
    const form=document.createElement('div');form.className='phys-form';calculator.insertBefore(form,grid);form.append(grid,button);calculator.classList.add('phys-layout');
    panel=document.createElement('section');panel.className='phys-diagram';panel.setAttribute('data-caluler-diagram-panel','physics');panel.setAttribute('aria-label',scene.title);panel.dataset.calulerAnimating='false';
    if(key!=='magnetic-energy-density')panel.classList.add('phys-reviewed');
    const heading=document.createElement('h2');heading.textContent=scene.title;
    const caption=document.createElement('p');caption.className='phys-caption';caption.textContent=scene.caption;panel.append(heading,caption);
    calculator.insertBefore(panel,result);
    svg=node('svg',{viewBox:'0 0 300 230',class:'phys-svg',role:'group','aria-label':scene.title},panel);
    if(premiumTools.has(key)){panel.classList.add('phys-premium','phys-scene-'+key);instrumentDefs();}
    updateScene=scene.build();if(premiumTools.has(key))finishInstrument();setupMobileLayout();
    if(!scene.inlineOutput){
      const row=document.createElement('div');row.className='phys-readout';const label=document.createElement('span');label.textContent=scene.output;readout=document.createElement('strong');readout.textContent='—';row.append(label,readout);panel.append(row);
      if(scene.readoutTone||premiumTools.has(key))bind(readout,scene.readoutTone||'current',scene.title,field);
    }
    if(scene.details){detail=document.createElement('p');detail.className='phys-detail';detail.textContent=scene.detailsInitial||'Representative windings; calculate for turn counts and ratio.';panel.append(detail);}
    note=document.createElement('p');note.className='phys-note';note.textContent=scene.initialNote||'Illustration only. Enter values and select Calculate for scientific values.';panel.append(note);
    validation=document.createElement('p');validation.className='phys-validation';validation.setAttribute('role','status');validation.setAttribute('data-caluler-diagram-export-ignore','');validation.hidden=true;panel.append(validation);
    tooltip=document.createElement('div');tooltip.className='phys-tooltip';tooltip.setAttribute('role','tooltip');tooltip.id='caluler-physics-tooltip';tooltip.hidden=true;document.body.append(tooltip);
    for(const b of bindings){
      b.el.setAttribute('aria-label',b.label+' — calculate to show values');b.el.setAttribute('aria-describedby',tooltip.id);
      b.el.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;active=b;pointer={x:e.clientX,y:e.clientY};refreshTip();});
      b.el.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||active!==b)return;pointer={x:e.clientX,y:e.clientY};refreshTip();});
      b.el.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')hideTip();});
      b.el.addEventListener('focus',()=>{active=b;pointer=null;refreshTip();});b.el.addEventListener('blur',hideTip);
      b.el.addEventListener('click',e=>{if(e.detail===0){active=b;pointer=null;refreshTip();return;}if(active===b&&b.el.dataset.tapped==='true'){b.el.dataset.tapped='false';hideTip();}else{bindings.forEach(v=>v.el.dataset.tapped='false');b.el.dataset.tapped='true';active=b;pointer={x:e.clientX,y:e.clientY};refreshTip();}});
      b.el.addEventListener('keydown',e=>{if(e.key==='Escape')hideTip();if(e.key==='Enter'||e.key===' '){e.preventDefault();active=b;pointer=null;refreshTip();}});
    }
    document.addEventListener('click',e=>{if(!bindings.some(b=>b.el.contains(e.target)))hideTip();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')hideTip();});
    window.addEventListener('scroll',hideTip,{passive:true});window.addEventListener('resize',hideTip,{passive:true});
    grid.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();button.click();}});
    const initial=window.calulerPhysicsRead?.();if(initial)commit(initial,true);
    setupCurrentFlow();
    window.calulerDiagramExport?.discover();
    window.addEventListener('pageshow',()=>{if(displayed)update(displayed);});
  }
  window.calulerPhysicsDiagrams=Object.freeze({commit});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
