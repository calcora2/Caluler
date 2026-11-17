/* CALULER Electricity & Electronics: original calculator snapshots only. */
(function () {
 'use strict';
 if(document.body?.dataset.calulerCategory!=='Electricity & Electronics'||window.calulerElectronics)return;
 const key=decodeURIComponent(location.pathname.split('/').pop()).replace(/\.html$/,'').replace(/-calculator$/,'');
 const definitions={
  'ohms-law':['Ohm’s law circuit','circuit','Power'],
  'voltage-current-resistance':['Voltage–current balance','circuit','Calculated quantity'],
  'electrical-power':['Electrical power to a load','power','Electrical power'],
  'electrical-power-from-voltage-and-current':['Voltage × current → power','power','Electrical power'],
  'led-resistor':['LED current limiter','led','Series resistance'],
  'diode-series-resistor':['Diode and series resistor','led','Series resistance'],
  'voltage-divider':['Two-resistor voltage divider','divider','Output voltage'],
  'series-resistance':['Resistors in series','series-r','Equivalent resistance'],
  'parallel-resistance':['Two parallel resistance paths','parallel-r','Equivalent resistance'],
  'series-capacitance':['Capacitors in series','series-c','Equivalent capacitance'],
  'parallel-capacitance':['Capacitors in parallel','parallel-c','Equivalent capacitance'],
  'capacitance-from-charge':['Charge across capacitor plates','capacitor','Capacitance'],
  'capacitor-energy':['Energy stored between plates','capacitor','Stored energy'],
  'rc-time-constant':['RC charge and discharge','rc','Time constant τ'],
  'rl-time-constant':['RL current response','rl','Time constant τ'],
  'rlc-resonant-frequency':['Ideal LC energy exchange','lc','Resonant frequency'],
  'capacitive-reactance':['Capacitor under AC excitation','xc','Capacitive reactance'],
  'ac-circuit-impedance':['Resistance and net reactance','impedance','Impedance magnitude'],
  'power-factor':['Real and apparent power','pf','Power factor'],
  'three-phase-power':['Balanced three-phase supply','three','Real power'],
  'electrical-energy-cost':['Energy Cost','energy','Energy cost'],
  'electrical-wire-resistance':['Copper conductor geometry','wire','Wire resistance'],
  'kirchhoff-loop-voltage':['Loop voltage accounting','kvl','Residual voltage']
 };
 if(!definitions[key])return;
 const [title,kind,outputLabel]=definitions[key],NS='http://www.w3.org/2000/svg';
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const speed=(n,ref=1)=>{const x=Math.min(Number.MAX_VALUE,Math.abs(n)/ref);return x===0?0:.12+2.4*Math.log1p(x)/Math.log(101+x);};
 const fmt=n=>{if(!Number.isFinite(n))return '—';if(n===0)return '0';if(Math.abs(n)>=.001&&Math.abs(n)<1e6)return n.toLocaleString('en-US',{maximumSignificantDigits:6});const [m,e]=n.toExponential(2).split('e'),sup={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};return m.replace('-','−')+' × 10'+String(Number(e)).split('').map(c=>sup[c]).join('');};
 const exact=n=>Number.isFinite(n)?n.toLocaleString('en-US',{maximumSignificantDigits:12}):'—';
 const tone={blue:'var(--ee-blue)',green:'var(--ee-green)',amber:'var(--ee-amber)',red:'var(--ee-red)',neutral:'var(--muted)'};
 let panel,svg,resultNode,metrics,readout,note,warning,tooltip,drawScene,displayed=null,target=null,from=null,started=0,raf=0,lastTime=0,phase=0,clock=0,visible=true,activeTip=null,pointer=null;
 const bindings=[],tracks=[],signalDots=[];
 let capacitorList,capacitorListTitle,capacitorListValues,lcMotion=null,transientMotion=null,transientPhase=0,kvlTraversal=null;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const metric=(label,n,unit='',color='blue')=>({label,n,unit,color});
 function describe(s){
  const a=s.values,r=s.result,m=[],v={s,metrics:m,current:null,ref:1,note:'Schematic geometry. Values are the last successful calculation.'};
  switch(kind){
   case 'circuit': v.V=a[0];v.I=a[1];v.R=a[2];v.P=key==='ohms-law'?a[3]:a[0]*a[1];m.push(metric('Voltage',v.V,'V'),metric('Current',v.I,'A'),metric('Resistance',v.R,'Ω','amber'));if(key==='ohms-law')m.push(metric('Power',v.P,'W','green'));if(key==='voltage-current-resistance')m.length=0;if(s.hasDuration)m.push(metric('Duration',a[4],'s','neutral'),metric('Energy',a[5],'J','green'));v.current=v.I;v.note=key==='ohms-law'?'Conventional current; speed and component geometry are schematic.':'Conventional current follows the signed reference direction. Motion is relative, not electron drift speed.';break;
   case 'power':v.V=a[0];v.I=a[1];v.P=r;v.current=v.I;m.push(metric('Voltage',v.V,'V'),metric('Current',v.I,'A'));v.note='Conventional current shown on a schematic source–load circuit; brightness is illustrative.';break;
   case 'led':v.V=a[0];v.forward=a[1];v.I=a[2];v.R=r;v.P=(a[0]-a[1])*a[2];v.current=v.I;v.ref=.02;m.push(metric('Supply',v.V,'V'),metric('Forward drop',v.forward,'V','green'),metric('Target current',v.I,'A'));v.note='Forward-biased LED/diode with a series current limiter. Flow is schematic conventional current.';break;
   case 'divider':v.V=a[0];v.R1=a[1];v.R2=a[2];v.I=a[0]/(a[1]+a[2]);v.current=v.I;v.ref=.01;m.push(metric('Input',v.V,'V'),metric('R₁',v.R1,'Ω','amber'),metric('R₂',v.R2,'Ω','amber'),metric('Unloaded current',v.I,'A'));v.note='Unloaded divider; output is measured relative to the lower reference node.';break;
   case 'series-r':case 'series-c':case 'parallel-c':case 'parallel-r':v.parts=a.slice();v.unit=kind.endsWith('-r')?'Ω':'F';v.count=a.length;m.push(...a.slice(0,3).map((n,i)=>metric((v.unit==='F'?'C':'R')+(i+1),n,v.unit,'amber')));v.note=(a.length>3?'Representative first three of '+a.length+' components; the equivalent uses every entry. ':'')+'Passive network: no source or current is specified.';if(v.unit==='F')v.note=(a.length>3?'First three of '+a.length+' components are drawn; all values are listed below. ':'')+(kind==='series-c'?'Series: equal charge magnitude for initially uncharged floating junctions. Individual voltages need a specified total voltage or charge.':'Parallel: common terminal voltage. Individual charges need a specified voltage.')+' No source, voltage or charge is assumed.';break;
   case 'capacitor':v.C=key==='capacitor-energy'?a[0]:r;v.V=a[1];v.Q=key==='capacitor-energy'?a[0]*a[1]:a[0];v.energy=key==='capacitor-energy'?r:.5*v.Q*v.V;m.push(metric('Capacitance',v.C,'F','amber'),metric('Voltage',v.V,'V'),metric('Charge Q (left plate)',v.Q,'C','green'));if(Number.isFinite(v.energy))m.push(metric('Stored energy',v.energy,'J','green'));v.note='Opposite plate charges; electric field points from + to −. Plate spacing is not supplied, so field magnitude is not inferred. No steady DC current.';break;
   case 'rc':case 'rl':v.tau=r;v.R=kind==='rc'?a[0]:a[1];v.C=kind==='rc'?a[1]:null;v.L=kind==='rl'?a[0]:null;m.push(metric('Resistance',v.R,'Ω','amber'),metric(kind==='rc'?'Capacitance':'Inductance',a[kind==='rc'?1:0],kind==='rc'?'F':'H','green'));v.note=r===0?'Instantaneous limit: no finite transient is animated.':'Repeated 4τ on/off example with continuous residual state. Amplitudes unspecified; normalized motion, not measured amps or real-time.';break;
   case 'lc':v.L=a[0];v.C=a[1];v.frequency=r;m.push(metric('Inductance',v.L,'H','green'),metric('Capacitance',v.C,'F','amber'));v.note='Relative energy: E_C ∝ cos²φ, E_L ∝ sin²φ. Positive current: counterclockwise. Amplitudes unspecified; schematic speed, not real-time.';break;
   case 'xc':v.frequency=a[0];v.C=a[1];m.push(metric('Frequency',v.frequency,'Hz'),metric('Capacitance',v.C,'F','amber'));v.note='Normalized AC illustration; amplitude/current are not specified. Visual cycles are not shown in real time.';break;
   case 'impedance':v.R=a[0];v.X=a[1];v.magnitude=r;m.push(metric('Resistance',v.R,'Ω','amber'),metric('Net reactance',v.X,'Ω','green'));v.note='Signed R–X impedance triangle; positive X is inductive, negative X capacitive. Applied voltage/current are not specified.';break;
   case 'pf':v.P=a[0];v.S=a[1];v.Q=Math.sqrt(Math.max(0,v.S*v.S-v.P*v.P));v.magnitude=v.S;m.push(metric('Real power',v.P,'W','green'),metric('Apparent power',v.S,'VA'),metric('Reactive magnitude',v.Q,'var','amber'));v.note='Reactive magnitude is derived from P and S. Leading/lagging sign and current are not specified.';break;
   case 'three':v.V=a[0];v.I=a[1];v.PF=a[2];v.P=r;v.current=v.I;v.ref=10;v.ac=true;m.push(metric('Line voltage',v.V,'V'),metric('Line current',v.I,'A'),metric('Power factor',v.PF,'','green'));v.note='Balanced three-phase AC. Alternating current cues are schematic; frequency/phase sequence are not supplied.';break;
   case 'energy':v.P=a[0];v.hours=a[1];v.days=a[2];v.tariff=a[3];v.energy=a[0]/1000*a[1]*a[2];v.cost=r;v.currency=String(s.unit||'currency');m.push(metric('Power',v.P,'W'),metric('Usage',v.hours,'h/day'),metric('Period',v.days,'days','neutral'),metric('Tariff',v.tariff,v.currency+'/kWh','green'),metric('Energy',v.energy,'kWh','green'),metric('Cost',v.cost,v.currency,'green'));v.note='Energy = (Power ÷ 1,000) × hours/day × days; Cost = Energy × Tariff.';break;
   case 'wire':v.length=a[0];v.area=a[1];m.push(metric('Length',v.length,'m'),metric('Area',v.area,'mm²','amber'));v.note='Copper approximation: ρ = 0.0175 Ω·mm²/m. Geometry is schematic; no current is specified.';break;
   case 'kvl':v.parts=a.slice();v.rises=a[0]+a[1];v.drops=a[2]+a[3];v.residual=r;v.tolerance=32*Number.EPSILON*Math.max(...a.map(Math.abs));v.balanced=Math.abs(r)<=v.tolerance;m.push(...a.map((n,i)=>metric((i<2?'Rise ':'Drop ')+(i%2+1),n,'V',i<2?'blue':'amber')));break;
  }
  return v;
 }
 function valid(s,transition=false){
  if(!s||!Array.isArray(s.values)||!s.values.length||s.values.some(n=>!Number.isFinite(n))||!Number.isFinite(s.result))return false;
  const a=s.values;
  if(['series-r','parallel-r','series-c','parallel-c'].includes(kind)&&a.some(n=>kind.endsWith('-c')?n<=0:n<0))return false;
  if(kind==='led'&&!(a[0]>a[1]&&a[1]>=0&&a[2]>0&&s.result>=0))return false;
  if(kind==='divider'&&!(a[1]>=0&&a[2]>=0&&a[1]+a[2]>0))return false;
  if(kind==='capacitor'&&!(a[1]!==0||key==='capacitor-energy'||transition))return false;
  if(kind==='capacitor'&&(key==='capacitor-energy'?a[0]<0:s.result<0))return false;
  if(['rc','rl'].includes(kind)&&(a.some(n=>n<0)||s.result<0))return false;
  if(['lc','xc'].includes(kind)&&a.some(n=>n<=0))return false;
  if(kind==='pf'&&!(a[1]>0&&Math.abs(a[0])<=a[1]))return false;
  if(kind==='three'&&!(a[0]>=0&&Math.abs(a[2])<=1))return false;
  if(kind==='wire'&&!(a[0]>=0&&a[1]>0))return false;
  if(kind==='energy'&&a.slice(1).some(n=>n<0))return false;
  const d=describe(s);return d.metrics.every(m=>Number.isFinite(m.n))&&(d.current===null||Number.isFinite(d.current));
 }

 function el(tag,cls,parent){const n=document.createElement(tag);if(cls)n.className=cls;if(parent)parent.appendChild(n);return n;}
 function n(tag,attrs={},parent=svg){const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));parent.appendChild(e);return e;}
 const attrs=(e,a)=>{for(const[k,v]of Object.entries(a))e.setAttribute(k,String(v));};
 const path=(d,color='blue',width=2.5,parent=svg)=>n('path',{d,fill:'none',stroke:tone[color]||color,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'},parent);
 const line=(x1,y1,x2,y2,color='blue',parent=svg)=>path('M'+x1+' '+y1+' L'+x2+' '+y2,color,2.5,parent);
 function text(x,y,value,parent=svg,anchor='middle'){const t=n('text',{x,y,'text-anchor':anchor},parent);t.textContent=value;return t;}
 function bind(node,color,label,get){node.classList.add('ee-interactive');node.setAttribute('tabindex','0');node.setAttribute('role','button');node.style.setProperty('--ee-tip-color',tone[color]||tone.blue);bindings.push({node,color,label,get});return node;}
 function metalDefs(){const defs=n('defs'),g=n('linearGradient',{id:'ee-metal',x1:'0',y1:'0',x2:'0',y2:'1'},defs);[['0%','var(--ee-metal-edge)'],['32%','var(--ee-metal-light)'],['62%','var(--ee-metal-edge)'],['100%','var(--ee-metal-light)']].forEach(([offset,color])=>n('stop',{offset,'stop-color':color},g));}
 function wire(d,parent=svg){path(d,'var(--ee-metal-edge)',7,parent);path(d,'var(--ee-metal-light)',3.2,parent);}
 function flow(d,slot=0,ac=false){const g=n('g',{'data-caluler-diagram-export-ignore':'',class:'ee-flow','aria-hidden':'true','pointer-events':'none'}),p=path(d,'blue',3.8,g),core=path(d,'#F4FFFF',2.5,g);p.classList.add('ee-flow-trail');core.classList.add('ee-flow-core');p.setAttribute('stroke-dasharray','2 26');core.setAttribute('stroke-dasharray','2 26');tracks.push({g,p,core,slot,ac,offset:0});return g;}
 function resistor(x,y,vertical=false,label='R'){const g=n('g',{transform:'translate('+x+' '+y+')'+(vertical?' rotate(90)':'')});path('M-40 0H-29M29 0H40','var(--ee-metal-edge)',4,g);n('rect',{x:-29,y:-11,width:58,height:22,rx:6,fill:'var(--ee-resistor)',stroke:'var(--ee-amber)','stroke-width':1.4},g);[-14,0,14].forEach(x=>n('rect',{x:x-2,y:-10,width:4,height:20,fill:'var(--ee-resistor-band)',rx:1},g));g.eeLabel=text(x+(vertical?-25:0),y+(vertical?4:-21),label,svg,vertical?'end':'middle');return g;}
 function capacitor(x,y,vertical=false,label='C'){const g=n('g',{transform:'translate('+x+' '+y+')'+(vertical?' rotate(90)':'')});n('rect',{x:-8,y:-24,width:16,height:48,fill:'var(--card)',stroke:'none'},g);path('M-36 0H-7M7 0H36','var(--ee-metal-edge)',4,g);[-7,7].forEach(x=>n('rect',{x:x-2,y:-22,width:4,height:44,rx:1,fill:'url(#ee-metal)',stroke:'var(--ee-blue)','stroke-width':1.2},g));g.eeLabel=text(x+(vertical?-28:0),y+(vertical?4:-32),label,svg,vertical?'end':'middle');return g;}
 function coil(x,y,label='L'){const g=n('g');n('rect',{x:x-34,y:y-16,width:68,height:32,fill:'var(--card)',stroke:'none'},g);let d='M'+(x-44)+' '+y+'H'+(x-32);for(let i=0;i<4;i++)d+=' a8 13 0 0 1 16 0';d+='H'+(x+44);path(d,'var(--ee-metal-edge)',6,g);path(d,'var(--ee-metal-light)',2.7,g);text(x,y-26,label);return g;}
 function batterySource(x,y,scale=1){
  if(!svg.querySelector('#ee-battery-body')){
   const defs=n('defs'),gradient=n('linearGradient',{id:'ee-battery-body',x1:'0',y1:'0',x2:'1',y2:'0'},defs);
   [['0%','var(--caluler-brand-primary)'],['42%','var(--caluler-brand-secondary)'],['100%','var(--caluler-brand-primary)']].forEach(([offset,color])=>n('stop',{offset,'stop-color':color},gradient));
  }
  const g=n('g',{class:'ee-battery',transform:'translate('+x+' '+y+') scale('+scale+')','aria-label':'DC battery source'});
  const casing=n('g',{class:'ee-battery-casing'},g);
  n('rect',{x:-8,y:-39,width:16,height:9,rx:2,fill:'url(#ee-metal)',stroke:'var(--ee-metal-edge)'},casing);
  n('rect',{x:-7,y:31,width:14,height:7,rx:2,fill:'url(#ee-metal)',stroke:'var(--ee-metal-edge)'},casing);
  n('rect',{x:-17,y:-32,width:34,height:65,rx:8,fill:'url(#ee-battery-body)',stroke:'var(--ee-blue)','stroke-width':1.5},casing);
  n('rect',{x:-14,y:-27,width:3,height:53,rx:1.5,fill:'#FFFFFF','fill-opacity':.38},casing);
  const plus=text(0,-12,'+',g),minus=text(0,20,'−',g);
  for(const mark of [plus,minus]){mark.classList.add('ee-battery-polarity');mark.setAttribute('aria-hidden','true');mark.style.setProperty('fill','#FFFFFF');mark.style.setProperty('font-size',scale<.8?'24px':'20px');mark.style.setProperty('font-weight','700');}
  return{g,top:y-35*scale,bottom:y+36*scale,set(V){casing.setAttribute('transform',V<0?'rotate(180)':'rotate(0)');plus.textContent=V<0?'−':'+';minus.textContent=V<0?'+':'−';}};
 }
 function lamp(x,y,led=false){const g=n('g'),glow=n('circle',{cx:x,cy:y,r:27,fill:'var(--ee-green)','fill-opacity':0,stroke:'none'},g);n('circle',{cx:x,cy:y,r:21,fill:'var(--card)',stroke:led?'var(--ee-green)':'var(--ee-amber)','stroke-width':2},g);if(led){const diode=n('g',{transform:'rotate(90 '+x+' '+y+')'},g);path('M'+(x-9)+' '+(y-8)+'l16 8-16 8Z','green',2,diode);line(x+8,y-9,x+8,y+9,'green',diode);if(key==='led-resistor')path('M'+(x+17)+' '+(y-19)+'l9-9m-5 0h5v5M'+(x+25)+' '+(y-11)+'l9-9m-5 0h5v5','green',1.6,g);}else{path('M'+(x-8)+' '+(y+12)+'l-4-10 7-7 5 7 5-7 7 7-4 10','amber',1.7,g);path('M'+(x-9)+' '+(y+17)+'h18m-16 4h14','var(--ee-metal-edge)',3,g);}text(x-29,y+4,led?(key==='diode-series-resistor'?'Diode':'LED'):'Load / port',svg,'end');return{g,glow};}

 // Scoped VCR scene: geometry and committed labels share the existing motion engine.
 function vcrCircuit(){
  const defs=n('defs');
  const resistorGradient=n('linearGradient',{id:'ee-vcr-resistor',x1:'0',y1:'0',x2:'1',y2:'0'},defs);
  [['0%','var(--ee-resistor)'],['42%','var(--ee-vcr-resistor-light)'],['100%','var(--ee-resistor)']].forEach(([offset,color])=>n('stop',{offset,'stop-color':color},resistorGradient));
  wire('M56 78V52H284V73M284 153V180H56V149');
  flow('M56 113V52H284V180H56Z');
  const moving=tracks[tracks.length-1].p;moving.setAttribute('pathLength','720');moving.setAttribute('stroke-dasharray','2 28');
  const battery=batterySource(56,113);
  const load=n('g');wire('M284 73V87M284 139V153',load);
  n('rect',{x:273,y:86,width:22,height:54,rx:7,fill:'url(#ee-vcr-resistor)',stroke:'var(--ee-amber)','stroke-width':1.4},load);
  [96,108,120].forEach(y=>n('rect',{x:274,y,width:20,height:4,rx:1,fill:'var(--ee-resistor-band)'},load));
  n('rect',{x:276,y:89,width:3,height:47,rx:1.5,fill:'#FFFFFF','fill-opacity':.24},load);
  const direction=text(180,25,'Conventional current');direction.setAttribute('class','ee-vcr-direction');
  const current=text(180,116,'I = —');current.setAttribute('class','ee-vcr-current');
  text(86,205,'Battery');text(274,205,'Resistor');
  const voltage=text(86,226,'V = —'),resistance=text(274,226,'R = —');voltage.setAttribute('class','ee-vcr-voltage');resistance.setAttribute('class','ee-vcr-resistance');
  bind(battery.g,'blue','Battery voltage',d=>exact(d.V)+' V');bind(load,'amber','Resistance',d=>exact(d.R)+' Ω');
  bind(voltage,'blue','Battery voltage',d=>exact(d.V)+' V');bind(resistance,'amber','Resistance',d=>exact(d.R)+' Ω');bind(current,'blue','Conventional current',d=>exact(d.I)+' A');
  const draw=d=>{if(!d){battery.set(0);setText(direction,'Conventional current');setText(current,'I = —');setText(voltage,'V = —');setText(resistance,'R = —');return;}
   battery.set(d.V);setText(direction,d.I===0?'Current stopped':d.I<0?'← Conventional current':'Conventional current →');
   setText(current,'I = '+fmt(d.I)+' A');setText(voltage,'V = '+fmt(d.V)+' V');setText(resistance,'R = '+fmt(d.R)+' Ω');
  };
  draw.reset=()=>draw(null);return draw;
 }
 function vcrOutputFields(){
  const select=document.getElementById('solve'),fields=['v','i','r'].map(id=>document.getElementById(id));
  const descriptions=fields.map(field=>field.getAttribute('aria-describedby')||'');
  const badges=fields.map((field,i)=>{const label=field.parentNode.querySelector('label');const badge=el('span','ee-vcr-field-status',label);badge.id='ee-vcr-output-'+field.id;badge.hidden=true;return badge;});
  function sync(){fields.forEach((field,i)=>{const output=field.id===select.value;field.readOnly=output;field.setAttribute('aria-readonly',String(output));field.setAttribute('aria-describedby',[descriptions[i],output?badges[i].id:''].filter(Boolean).join(' '));badges[i].hidden=!output;badges[i].textContent='Calculated output';if(output){field.value='';field.placeholder='Calculated on Calculate';}else field.placeholder='';});}
  select.addEventListener('change',sync);sync();
 }

 function circuit(){
  if(key==='voltage-current-resistance'||key==='ohms-law')return vcrCircuit();
  const full='M64 118V50H296V186H64Z',battery=batterySource(64,118);
  wire('M64 '+battery.top+'V50H296V95M296 141V186H64V'+battery.bottom);flow(full);svg.appendChild(battery.g);let load;
  if(kind==='led'){bind(resistor(210,50),'amber','Series resistor',d=>exact(d.s.result)+' Ω');load=lamp(296,118,true);}
  else if(kind==='divider'){
   wire('M296 50V186');
   const top=resistor(296,84,true,'R₁'),bottom=resistor(296,152,true,'R₂');
   top.setAttribute('transform',top.getAttribute('transform')+' scale(.85)');bottom.setAttribute('transform',bottom.getAttribute('transform')+' scale(.85)');
   bind(top,'amber','Top resistor',d=>exact(d.R1)+' Ω');bind(bottom,'amber','Bottom resistor',d=>exact(d.R2)+' Ω');
   line(296,118,340,118,'green');n('circle',{cx:296,cy:118,r:4,fill:'var(--ee-green)'});text(336,101,'Vout');text(316,219,'0 V',svg,'end');
  }
  else if(kind==='power')load=lamp(296,118);
  else bind(resistor(296,118,true),'amber','Resistance',d=>exact(d.R)+' Ω');
  text(64,219,'Source');text(180,kind==='led'?220:26,'I reference →');bind(battery.g,'blue','Source voltage',d=>exact(d.V)+' V');
  return d=>{battery.set(d.V);if(load){const lightPower=kind==='power'?Math.max(0,d.P):key==='led-resistor'?Math.max(0,d.forward*d.I):0;load.glow.setAttribute('fill-opacity',lightPower===0?0:Math.min(.3,.05+.04*Math.log1p(lightPower/(kind==='led' ? .04 : 1))));}};
 }
 function network(){
  if(kind.endsWith('-c'))return capacitorNetwork();
  const isCap=kind.endsWith('-c'),parallel=kind.startsWith('parallel'),groups=[];
  if(parallel)wire('M30 60H290M30 220H290');else wire('M15 140H305');
  for(let i=0;i<3;i++){
   const wrapper=n('g'),x=parallel?70+i*90:60+i*100,y=140;
   if(parallel)wire('M'+x+' 60V105M'+x+' 175V220',wrapper);
   const component=isCap?capacitor(x,y,parallel,'C'+(i+1)):resistor(x,y,parallel,'R'+(i+1));
   wrapper.append(component,component.eeLabel);groups.push(wrapper);
   bind(wrapper,isCap?'blue':'amber','Component '+(i+1),d=>i<d.parts.length?exact(d.parts[i])+' '+d.unit:'Representative connection');
  }
  text(160,255,parallel?'Shared terminals':'Single series path');return d=>{groups.forEach((g,i)=>{g.setAttribute('display',i<Math.min(3,d.count)?'inline':'none');g.setAttribute('tabindex',i<Math.min(3,d.count)?'0':'-1');});};
 }
 function capacitorNetwork(){
  panel.classList.add('ee-smart-cap-panel','ee-cap-network-panel');
  const parallel=kind==='parallel-c',groups=[],values=[];
  svg.setAttribute('viewBox',parallel?'0 0 320 184':'0 0 320 146');
  const lead=(d,parent=svg)=>{const edge=path(d,'var(--ee-metal-edge)',4,parent),highlight=path(d,'var(--ee-metal-light)',1.6,parent);return[edge,highlight];};
  const rails=lead(parallel?'M24 30H296M24 126H296':'M16 78H54M74 78H150M170 78H246M266 78H304');
  for(let i=0;i<3;i++){
   const g=n('g',{class:'ee-cap-network-component',transform:'translate('+(64+i*96)+' 0)'}),body=n('g',{class:'ee-cap-network-plates'},g);
   if(parallel){lead('M0 30V68M0 88V126',g);for(const y of [70,86])n('rect',{x:-22,y:y-2,width:44,height:4,rx:1.5,fill:'url(#ee-metal)',stroke:'var(--ee-blue)','stroke-width':1.2},body);}
   else for(const x of [-8,8])n('rect',{x:x-2,y:56,width:4,height:44,rx:1.5,fill:'url(#ee-metal)',stroke:'var(--ee-blue)','stroke-width':1.2},body);
   const label=text(0,parallel?149:121,'C'+(i+1),g),value=text(0,parallel?169:140,'—',g);label.classList.add('ee-cap-network-label');value.classList.add('ee-cap-network-value');
   groups.push(g);values.push(value);bind(g,'blue','Capacitor C'+(i+1),d=>i<d.parts.length?exact(d.parts[i])+' F':'Not used');
  }
  const output=el('div','ee-cap-network-output',panel),label=el('span','',output);label.textContent='Equivalent Capacitance';readout=el('strong','',output);readout.textContent='—';bind(readout,'green','Equivalent Capacitance',d=>exact(d.s.result)+' F');
  const formula=el('p','ee-cap-network-formula',panel);formula.textContent=parallel?'C_eq = C1 + C2 + … + Cn':'1/C_eq = 1/C1 + 1/C2 + … + 1/Cn';
  const subset=el('p','ee-cap-network-subset',panel);subset.hidden=true;
  capacitorList=el('details','ee-cap-components',panel);capacitorList.hidden=true;capacitorListTitle=el('summary','',capacitorList);capacitorListValues=el('p','',capacitorList);
  if(!parallel){const assumption=el('p','ee-cap-network-assumption',panel);assumption.textContent='Equal charge magnitude assumes initially uncharged floating junctions. No voltage or charge is specified.';}
  return d=>{
   const count=Math.min(3,d.count),positions=Array.from({length:count},(_,i)=>160+(i-(count-1)/2)*96);
   groups.forEach((g,i)=>{const used=i<count;g.setAttribute('display',used?'inline':'none');g.setAttribute('tabindex',used?'0':'-1');if(!used)return;g.setAttribute('transform','translate('+positions[i]+' 0)');const shown=fmt(d.parts[i])+' F';setText(values[i],shown);values[i].style.fontSize=shown.length>12?'11px':'15px';});
   if(!parallel){let route='M16 78';positions.forEach((x,i)=>{route+='H'+(x-10)+'M'+(x+10)+' 78';});route+='H304';rails.forEach(p=>p.setAttribute('d',route));}
   const names=d.count<=4?Array.from({length:d.count},(_,i)=>'C'+(i+1)):['C1','C2','…','C'+d.count];
   setText(formula,(parallel?'C_eq = ':'1/C_eq = ')+names.map(s=>parallel||s==='…'?s:'1/'+s).join(' + '));
   subset.hidden=d.count<=3;setText(subset,'First 3 of '+d.count+' components shown; all '+d.count+' included in the equivalent.');
   panel.dataset.capacitorPrinciple=parallel?'equal-voltage':'equal-charge-uncharged-junctions';
  };
 }
 function storedCapacitor(){
  panel.classList.add('ee-smart-cap-panel');svg.setAttribute('viewBox','0 0 320 210');
  wire('M28 110H115M205 110H292');
  const space=n('rect',{x:122,y:62,width:76,height:96,rx:4,fill:'var(--ee-blue)','fill-opacity':0,stroke:'none'});
  const plateXs=[118,202],chargeRows=[82,110,138];
  const plates=plateXs.map(x=>n('rect',{x:x-3,y:60,width:6,height:100,rx:2,fill:'url(#ee-metal)',stroke:'var(--ee-blue)','stroke-width':1.6}));
  const signs=plateXs.map((x,i)=>chargeRows.map(y=>{const t=text(x+(i?-12:12),y,'0');t.classList.add('ee-cap-sign');t.setAttribute('dominant-baseline','central');t.setAttribute('aria-hidden','true');return t;}));
  const field=n('g'),arrows=chargeRows.map(y=>({y,path:path('','blue',2.5,field)}));
  bind(plates[0],'blue','Left plate charge',d=>exact(d.Q)+' C');bind(plates[1],'amber','Right plate charge',d=>exact(-d.Q)+' C');
  bind(field,'blue','Electric field direction',d=>d.Q===0?'No stored charge':(d.V<0?'Right to left':'Left to right')+' (+ to −); magnitude needs plate spacing');
  const caption=text(160,190,'Field direction; spacing is schematic');caption.classList.add('ee-cap-caption');
  return d=>{
   const direction=d.Q===0?0:Math.sign(d.V);panel.dataset.capacitorPolarity=direction>0?'left-positive':direction<0?'right-positive':'neutral';
   space.setAttribute('fill-opacity',direction ? .08 : 0);field.setAttribute('opacity',direction?1:0);field.setAttribute('tabindex',direction?'0':'-1');
   arrows.forEach(a=>{const start=direction>0?138:182,end=direction>0?182:138,back=end-direction*7;a.path.setAttribute('d',direction?'M'+start+' '+a.y+'H'+end+'M'+back+' '+(a.y-4)+'L'+end+' '+a.y+'L'+back+' '+(a.y+4):'');});
   plates.forEach((plate,i)=>{const sign=direction*(i?-1:1),color=sign===0?'neutral':sign>0?'blue':'amber',binding=bindings.find(b=>b.node===plate);binding.color=color;plate.style.setProperty('--ee-tip-color',tone[color]);plate.setAttribute('stroke',tone[color]);signs[i].forEach(t=>{setText(t,sign>0?'+':sign<0?'−':'0');t.style.fill=tone[color];});});
  };
 }
 function transientState(position){
  const cycle=(position%8+8)%8,driven=cycle<4,u=driven?cycle:cycle-4,tail=Math.exp(-4),low=tail/(1+tail),high=1/(1+tail);
  const level=driven?1-(1-low)*Math.exp(-u):high*Math.exp(-u);
  return {driven,u,level,current:kind==='rc'?(driven?1-level:-level):level,low,high};
 }
 function transient(){
  panel.classList.add('ee-transient-panel');
  const isCap=kind==='rc',battery=batterySource(30,84,.55);
  wire('M30 '+battery.top+'V45H58M30 '+battery.bottom+'V126M58 65V126M92 45H130M210 45H280');
  resistor(170,45);const switchArm=path('M92 45H58','blue',2.5);
  for(const [x,y] of [[58,45],[58,65],[92,45]])n('circle',{cx:x,cy:y,r:2.8,fill:'var(--card)',stroke:'var(--ee-metal-edge)','stroke-width':1.4});
  const mode=text(77,20,'Step model'),drive=text(30,147,'Drive');mode.classList.add('ee-transient-label');drive.classList.add('ee-transient-label');
  let fieldGlow,fieldLines=[],plateSigns=[];
  if(isCap){
   wire('M280 45V73M280 99V126H30');
   fieldGlow=n('rect',{x:259,y:76,width:42,height:20,rx:2,fill:'var(--ee-blue)','fill-opacity':0});
   for(const y of [73,99])n('rect',{x:258,y:y-2,width:44,height:4,rx:1,fill:'url(#ee-metal)',stroke:'var(--ee-blue)','stroke-width':1.2});
   fieldLines=[268,280,292].map(x=>path('M'+x+' 79V93m-3-4 3 4 3-4','blue',1.3));
   plateSigns=[text(309,82,'0'),text(309,108,'0')];text(245,90,'C');
  }else{
   wire('M280 45V126H214M126 126H30');
   fieldGlow=n('ellipse',{cx:170,cy:126,rx:59,ry:18,fill:'var(--ee-green)','fill-opacity':0});
   fieldLines=[12,17].map(ry=>n('ellipse',{cx:170,cy:126,rx:55,ry,fill:'none',stroke:'var(--ee-green)','stroke-width':1.4,'stroke-opacity':0}));coil(170,126);
  }
  let coilReturn='H202';for(let i=0;i<4;i++)coilReturn+=' a8 13 0 0 0 -16 0';
  const paths=isCap?['M280 99V126H30V45H280V73','M280 99V126H58V65L92 45H280V73']:['M30 84V45H280V126'+coilReturn+'H30Z','M92 45H280V126'+coilReturn+'H58V65Z'];
  const current=n('g',{class:'ee-transient-current',opacity:0}),moving=path(paths[0],'blue',3.6,current),direction=path('','blue',1.5);moving.setAttribute('stroke-dasharray','2 26');
  const left=52,right=292,top=185,bottom=238,w=right-left,h=bottom-top;
  line(left,bottom,right,bottom,'neutral');line(left,top,left,bottom,'neutral');text(left-10,top+4,'1',svg,'end');text(left-10,bottom+4,'0',svg,'end');
  const rise=path('','green',2.5),decay=path('','amber',2.5),marker=n('circle',{cx:left,cy:bottom,r:4,fill:'var(--ee-green)',opacity:0});
  const ratioLabel=text(172,178,isCap?'Vc / Vref':'I / Iref'),riseLabel=text(100,160,'Rise'),decayLabel=text(230,160,'Decay');riseLabel.style.fill=tone.green;decayLabel.style.fill=tone.amber;
  const t1=text(left+w/4,258,'τ'),t4=text(right,258,'4τ',svg,'end'),origin=text(left,258,'0',svg,'start'),axis=text(172,279,'Time since switch / τ');
  for(const t of [ratioLabel,riseLabel,decayLabel,t1,t4,origin,axis,...plateSigns])t.classList.add('ee-transient-label');
  let state={level:0,current:0,u:0,driven:true},offset=0;
  bind(marker,'green',isCap?'Normalized capacitor state':'Normalized inductor current',d=>'t = '+exact(state.u*d.tau)+' s (illustrative); level = '+exact(state.level)+'; current / reference-current = '+exact(state.current));
  bind(t1,'blue','Time constant',d=>exact(d.tau)+' s');
  transientMotion=(position,seconds=0,enabled=true)=>{
   state=enabled?transientState(position):{level:0,current:0,u:0,driven:true};
   setText(mode,enabled?(state.driven?(isCap?'Charging':'Build-up'):'Decay'):'Instant limit');mode.style.fill=tone[state.driven?'green':'amber'];
   switchArm.setAttribute('d',state.driven?'M92 45H58':'M92 45L58 65');battery.g.setAttribute('opacity',state.driven?1:.3);moving.setAttribute('d',paths[state.driven?0:1]);
   offset+=seconds*80*state.current;moving.style.strokeDashoffset=String(-offset);current.setAttribute('opacity',enabled&&!reduced.matches&&Math.abs(state.current)>1e-9?1:0);
   const x=isCap?310:298;direction.setAttribute('d',!enabled?'':state.current>0?'M'+x+' 48V66m-3-4 3 4 3-4':'M'+x+' 66V48m-3 4 3-4 3 4');
   fieldGlow.setAttribute('fill-opacity',.14*state.level*state.level);
   fieldLines.forEach(p=>p.setAttribute('stroke-opacity',.6*state.level));plateSigns.forEach((t,i)=>{setText(t,enabled?(i?'−':'+'):'0');t.style.fill=tone[i?'amber':'blue'];});
   attrs(marker,{cx:left+w*state.u/4,cy:bottom-h*state.level,opacity:enabled?1:0,fill:tone[state.driven?'green':'amber'],tabindex:enabled?'0':'-1'});
   panel.dataset.transientMode=enabled?(state.driven?'rise':'decay'):'instantaneous-limit';panel.dataset.transientLevel=String(state.level);panel.dataset.transientCurrent=String(state.current);panel.dataset.transientTime=String(state.u);
   if(displayed)marker.setAttribute('aria-label',(isCap?'Capacitor':'Inductor')+' normalized level '+exact(state.level)+'; normalized current '+exact(state.current));
   if(activeTip?.node===marker)refreshTip();
  };
  return d=>{
   const enabled=d.tau>0,low=Math.exp(-4)/(1+Math.exp(-4)),high=1/(1+Math.exp(-4));
   const curve=fall=>Array.from({length:61},(_,i)=>{const u=4*i/60,y=fall?high*Math.exp(-u):1-(1-low)*Math.exp(-u);return(i?'L':'M')+(left+w*i/60)+' '+(bottom-h*y);}).join(' ');
   rise.setAttribute('d',enabled?curve(false):'');decay.setAttribute('d',enabled?curve(true):'');transientMotion(transientPhase*8,0,enabled);
  };
 }
 function lcOscillation(){
  panel.classList.add('ee-lc-panel');
  const state={q:0,current:0,electric:0,magnetic:0},magnetic=n('g',{class:'ee-lc-magnetic-field'});
  const magneticGlow=n('ellipse',{cx:160,cy:50,rx:67,ry:22,fill:'var(--ee-green)','fill-opacity':0,stroke:'none'},magnetic);
  const fieldLoops=[14,18,22].map((ry,i)=>n('ellipse',{cx:160,cy:50,rx:53+i*7,ry,fill:'none',stroke:'var(--ee-green)','stroke-width':1.4,'stroke-opacity':0},magnetic));
  wire('M45 125V50H116M204 50H275V110M275 140V183H45V125');coil(160,50);
  const electric=n('g',{class:'ee-lc-electric-field'}),electricGlow=n('rect',{x:253,y:113,width:44,height:24,rx:3,fill:'var(--ee-blue)','fill-opacity':0,stroke:'none'},electric);
  const eArrows=[261,275,289].map(x=>({x,p:path('','blue',1.4,electric)}));
  [110,140].forEach(y=>n('rect',{x:253,y:y-2,width:44,height:4,rx:1,fill:'url(#ee-metal)',stroke:'var(--ee-blue)','stroke-width':1.2}));
  text(238,130,'C');const topCharge=text(306,115,'0'),bottomCharge=text(306,145,'0');topCharge.classList.add('ee-lc-charge');bottomCharge.classList.add('ee-lc-charge');
  // Positive current leaves the top plate: CCW around the conductor, never across the dielectric.
  let conductor='M275 110V50H192';for(let i=0;i<4;i++)conductor+=' a8 13 0 0 0 -16 0';conductor+='H45V183H275V140';
  const current=n('g',{class:'ee-lc-current',opacity:0}),dots=path(conductor,'blue',3.5,current);dots.setAttribute('stroke-dasharray','2 26');
  const direction=path('','blue',1.6);let offset=0;
  const x0=38,y0=220,w=244,h=18;line(x0,y0,x0+w,y0,'neutral');
  path(Array.from({length:81},(_,i)=>(i?'L':'M')+(x0+w*i/80)+' '+(y0-h*Math.sin(i/80*2*Math.PI))).join(' '),'blue',2.3);
  const dot=n('circle',{class:'ee-lc-wave-marker',cx:x0,cy:y0,r:4,fill:'var(--ee-green)',opacity:0});
  text(x0,255,'0',svg,'start');text(x0+w/2,255,'π');text(x0+w,255,'2π',svg,'end');
  const caption=text(160,277,'Normalized current · CCW +');caption.classList.add('ee-lc-caption');
  const first=bindings.length,ratio=value=>Number(value.toFixed(3)).toString();
  bind(electric,'blue','Capacitor electric energy (relative)',()=> 'E_C / E_total = '+ratio(state.electric)+'; q_top / Q_peak = '+ratio(state.q));
  bind(magnetic,'green','Inductor magnetic energy (relative)',()=> 'E_L / E_total = '+ratio(state.magnetic));
  bind(current,'blue','Normalized conductor current',()=> 'I / I_peak = '+ratio(state.current)+'; '+(state.current>0?'counterclockwise':state.current<0?'clockwise':'zero'));
  bind(dot,'green','Normalized current waveform',()=> 'I / I_peak = '+ratio(state.current)+' (counterclockwise positive)');
  const phaseBindings=bindings.slice(first);
  lcMotion=(angle,seconds=0,enabled=true)=>{
   const rawQ=enabled?Math.cos(angle):0,rawI=enabled?Math.sin(angle):0;
   state.q=Math.abs(rawQ)<1e-9?0:rawQ;state.current=Math.abs(rawI)<1e-9?0:rawI;state.electric=state.q*state.q;state.magnetic=state.current*state.current;
   electricGlow.setAttribute('fill-opacity',.13*state.electric);magneticGlow.setAttribute('fill-opacity',.15*state.magnetic);
   fieldLoops.forEach(loop=>loop.setAttribute('stroke-opacity',.55*Math.abs(state.current)));
   eArrows.forEach(({x,p})=>{const sign=Math.sign(state.q),start=sign>0?117:133,end=sign>0?133:117,back=end-sign*5;p.setAttribute('d',sign?'M'+x+' '+start+'V'+end+'M'+(x-3)+' '+back+'L'+x+' '+end+'L'+(x+3)+' '+back:'');p.setAttribute('stroke-opacity',Math.abs(state.q));});
   setText(topCharge,state.q>0?'+':state.q<0?'−':'0');setText(bottomCharge,state.q>0?'−':state.q<0?'+':'0');topCharge.style.fill=tone[state.q===0?'neutral':state.q>0?'blue':'amber'];bottomCharge.style.fill=tone[state.q===0?'neutral':state.q>0?'amber':'blue'];
   offset+=seconds*70*state.current;dots.style.strokeDashoffset=String(-offset);current.setAttribute('opacity',enabled&&!reduced.matches&&state.current!==0?1:0);current.dataset.flowDirection=state.current>0?'counterclockwise':state.current<0?'clockwise':'stopped';current.setAttribute('tabindex',enabled&&state.current!==0&&!reduced.matches?'0':'-1');
   direction.setAttribute('d',!enabled||state.current===0?'':state.current>0?'M28 100V133m-4-6 4 6 4-6':'M28 133V100m-4 6 4-6 4 6');
   attrs(dot,{cx:x0+w*((angle/(2*Math.PI)%1+1)%1),cy:y0-h*state.current,opacity:enabled?1:0});
   panel.dataset.lcPhase=String(angle);panel.dataset.lcCurrentNormalized=String(state.current);panel.dataset.lcElectricFraction=String(state.electric);panel.dataset.lcMagneticFraction=String(state.magnetic);
   for(const b of phaseBindings)b.node.setAttribute('aria-label',b.label+': '+b.get());
   if(activeTip&&phaseBindings.includes(activeTip))refreshTip();
  };
  return d=>lcMotion(phase*2*Math.PI,0,d.frequency>0);
 }
 function oscillation(){
  if(kind==='lc')return lcOscillation();
  wire('M30 110H124M196 110H290');const cap=capacitor(160,110);cap.eeLabel.setAttribute('y',158);text(160,48,'AC voltage (normalized)');
  const signs=[text(144,82,'0'),text(177,82,'0')],field=path('','blue',1.3);let voltage=0;
  const paint=sample=>{voltage=Math.abs(sample)<1e-9?0:sample;const sign=Math.sign(voltage),start=sign>0?156:164,end=sign>0?164:156,back=end-sign*3;field.setAttribute('d',sign?'M'+start+' 110H'+end+'M'+back+' 108L'+end+' 110L'+back+' 112':'');field.setAttribute('stroke-opacity',Math.abs(voltage));setText(signs[0],sign>0?'+':sign<0?'−':'0');setText(signs[1],sign>0?'−':sign<0?'+':'0');panel.dataset.acVoltageNormalized=String(voltage);if(displayed)cap.setAttribute('aria-label','AC capacitor: '+exact(describe(displayed).C)+' F; normalized voltage '+exact(voltage));if(activeTip?.node===cap)refreshTip();};
  bind(cap,'amber','AC capacitor',d=>exact(d.C)+' F; normalized voltage '+exact(voltage)+'; actual voltage/current amplitude unspecified');
  const curve=path('','blue',2.5);const x0=38,y0=220,w=244,h=18;curve.setAttribute('d',Array.from({length:81},(_,i)=>(i?'L':'M')+(x0+w*i/80)+' '+(y0-h*Math.sin(i/80*2*Math.PI))).join(' '));line(x0,y0,x0+w,y0,'neutral');text(160,270,'Normalized AC voltage');const dot=n('circle',{cx:x0,cy:y0,r:4,fill:'var(--ee-green)'});signalDots.push({dot,x0,y0,w,h,paint});return()=>paint(Math.sin(phase*2*Math.PI));
 }
 function triangle(){
  const ox=kind==='pf'?125:160,oy=140,scale=105;line(20,oy,300,oy,'neutral');line(ox,36,ox,250,'neutral');text(298,oy+22,kind==='pf'?'P':'R',svg,'end');text(ox-10,36,kind==='pf'?'|Q|':'X',svg,'end');const h=path('','amber',4),v=path('','green',4),hyp=path('','blue',3),dot=n('circle',{cx:ox,cy:oy,r:4,fill:'var(--ee-blue)'});text(160,276,kind==='pf'?'P / S = cos φ':'|Z|² = R² + X²');bind(hyp,'blue',kind==='pf'?'Apparent power':'Impedance',d=>exact(d.magnitude)+(kind==='pf'?' VA':' Ω'));
  return d=>{const norm=d.magnitude||1,x=ox+scale*(kind==='pf'?d.P:d.R)/norm,y=oy-scale*(kind==='pf'?d.Q:d.X)/norm;h.setAttribute('d','M'+ox+' '+oy+'H'+x);v.setAttribute('d','M'+x+' '+oy+'V'+y);hyp.setAttribute('d','M'+ox+' '+oy+'L'+x+' '+y);attrs(dot,{cx:x,cy:y});};
 }
 function threePhase(){
  n('rect',{x:20,y:55,width:65,height:174,rx:12,fill:'var(--card)',stroke:'var(--ee-blue)','stroke-width':2});n('rect',{x:243,y:55,width:57,height:174,rx:10,fill:'url(#ee-metal)',stroke:'var(--border)'});text(52,35,'AC source');text(271,35,'Load');for(let i=0;i<3;i++){const y=83+i*58;wire('M85 '+y+'H243');flow('M85 '+y+'H243',i,true);text(53,y+5,['L₁','L₂','L₃'][i]);}text(160,265,'Balanced three-phase model');return()=>{};
 }
 function energy(){
  panel.classList.add('ee-energy-panel');svg.setAttribute('hidden','');
  const flowView=el('div','ee-energy-flow',panel);
  flowView.setAttribute('role','group');flowView.setAttribute('aria-label','Power to energy to cost');
  function stage(name,cls,unit,pathData){
   const host=el('div','ee-energy-node '+cls,flowView),icon=n('svg',{viewBox:'0 0 24 24',class:'ee-energy-icon',fill:'none',stroke:'currentColor','stroke-width':1.6,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',focusable:'false'},host);
   n('path',{d:pathData},icon);
   const label=el('span','ee-energy-label',host);label.textContent=name;
   const row=el('div','ee-energy-value',host),value=el('strong','ee-energy-number',row);value.textContent='—';
   const units=el('span','ee-energy-unit',row);units.textContent=unit;units.hidden=!unit;
   return {host,value,units};
  }
  function connector(){const icon=n('svg',{viewBox:'0 0 18 12',class:'ee-energy-arrow',fill:'none',stroke:'currentColor','stroke-width':1.3,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',focusable:'false'},flowView);n('path',{d:'M2 6h14M12 2l4 4-4 4'},icon);}
  const power=stage('Power','ee-energy-node-power','W','m13 2-9 12h7l-1 8 10-12h-7z');connector();
  const usage=stage('Energy','ee-energy-node-usage','kWh','M4 20V10h4v10M10 20V6h4v14M16 20V3h4v17M3 20h18');connector();
  const cost=stage('Cost','ee-energy-node-cost','','M6 3h12v18l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h3');
  bind(power.host,'blue','Power',d=>exact(d.P)+' W');
  bind(usage.host,'green','Energy usage',d=>exact(d.energy)+' kWh; '+exact(d.hours)+' h/day × '+exact(d.days)+' days');
  bind(cost.host,'green','Estimated cost',d=>exact(d.cost)+' '+d.currency+'; tariff '+exact(d.tariff)+' '+d.currency+'/kWh');
  return d=>{
   setText(power.value,exact(d.P));setText(usage.value,exact(d.energy));setText(cost.value,exact(d.cost));setText(cost.units,d.currency);cost.units.hidden=d.currency==='currency';
   for(const [stage,value,base] of [[power,d.P,'blue'],[usage,d.energy,'green'],[cost,d.cost,'green']]){
    const color=value<0?'red':base,binding=bindings.find(b=>b.node===stage.host);stage.host.dataset.negative=String(value<0);binding.color=color;stage.host.style.setProperty('--ee-tip-color',tone[color]);
   }
  };
 }
 function copperWire(){
  const body=n('rect',{x:45,y:105,width:225,height:60,rx:6,fill:'url(#ee-metal)',stroke:'var(--ee-amber)','stroke-width':2}),end=n('ellipse',{cx:270,cy:135,rx:17,ry:30,fill:'var(--ee-resistor)',stroke:'var(--ee-amber)','stroke-width':2});const measure=line(45,205,270,205,'blue'),startTick=line(45,196,45,214,'blue');line(270,196,270,214,'blue');text(160,232,'Length L');text(270,83,'Area A');bind(body,'blue','Conductor length',d=>exact(d.length)+' m');bind(end,'amber','Cross-sectional area',d=>exact(d.area)+' mm²');return d=>{const fraction=Math.log1p(d.length)/(1+Math.log1p(d.length)),width=150+75*fraction;attrs(body,{x:270-width,width});measure.setAttribute('d','M'+(270-width)+' 205H270');startTick.setAttribute('d','M'+(270-width)+' 196V214');};
 }
 function loopVoltage(){
  panel.classList.add('ee-kvl-panel');svg.setAttribute('viewBox','0 0 320 184');
  const route='M48 96V24H272V160H48Z';wire(route);
  const trace=path(route,'blue',3);attrs(trace,{class:'ee-kvl-trace',pathLength:100,'stroke-dasharray':'12 88','aria-hidden':'true','pointer-events':'none'});
  let traversalOffset=0;kvlTraversal=seconds=>{traversalOffset=(traversalOffset+seconds*18)%100;trace.style.strokeDashoffset=String(-traversalOffset);};
  const signed=value=>Number.isFinite(value)?(value>0?'+':value<0?'−':'')+fmt(Math.abs(value))+' V':'—';
  const parts=[[48,64],[272,64],[272,120],[48,120]].map(([x,y],i)=>{
   const color=i<2?'blue':'amber',label=(i<2?'Rise ':'Drop ')+(i%2+1),g=n('g',{class:'ee-kvl-part ee-kvl-'+color});
   n('rect',{x:x-42,y:y-21,width:84,height:42,rx:7,fill:'var(--card)',stroke:tone[color],'stroke-width':1.5},g);
   const name=text(x,y-5,label,g),value=text(x,y+12,'—',g);name.classList.add('ee-kvl-name');value.classList.add('ee-kvl-value');
   bind(g,color,label,d=>'Input: '+exact(d.parts[i])+' V; signed traversal contribution: '+signed(i<2?d.parts[i]:-d.parts[i]));return value;
  });
  const totals=el('div','ee-kvl-totals',panel);
  const total=(label,get)=>{const host=el('div','ee-kvl-total',totals),name=el('span','',host),value=el('strong','',host);name.textContent=label;value.textContent='—';bind(host,'neutral',label,d=>exact(get(d))+' V');return value;};
  const rises=total('Σ Rises',d=>d.rises),drops=total('Σ Drops',d=>d.drops);
  const output=el('div','ee-kvl-residual',totals),result=el('div','ee-kvl-total',output),label=el('span','',result),value=el('strong','',result),status=el('span','ee-kvl-status',output);
  label.textContent='Residual';value.textContent='—';status.textContent='Awaiting calculation';status.dataset.state='pending';
  bind(result,'neutral','Residual',d=>signed(d.residual));
  bind(status,'neutral','Loop balance',d=>d.balanced?'Balanced within floating-point roundoff tolerance ('+exact(d.tolerance)+' V).':'Voltage imbalance: these signed voltages do not describe closed-loop equilibrium.');
  return d=>{
   parts.forEach((node,i)=>{const contribution=i<2?d.parts[i]:-d.parts[i];let shown=signed(contribution);if(shown.length>13)shown=(contribution>0?'+':contribution<0?'−':'')+Math.abs(contribution).toExponential(2)+' V';setText(node,shown);node.style.fontSize=shown.length>11?'11px':shown.length>8?'13px':'16px';});
   setText(rises,fmt(d.rises)+' V');setText(drops,fmt(d.drops)+' V');setText(value,signed(d.residual));
   const settled=!from||d.s===target||reduced.matches,state=settled?(d.balanced?'balanced':'imbalanced'):'pending';
   status.dataset.state=state;output.dataset.state=state;setText(status,settled?(d.balanced?'Balanced Loop':'Voltage Imbalance'):'Updating…');
  };
 }
 function build(){metalDefs();switch(kind){case'circuit':case'power':case'led':case'divider':return circuit();case'series-r':case'parallel-r':case'series-c':case'parallel-c':return network();case'capacitor':return storedCapacitor();case'rc':case'rl':return transient();case'lc':case'xc':return oscillation();case'impedance':case'pf':return triangle();case'three':return threePhase();case'energy':return energy();case'wire':return copperWire();case'kvl':return loopVoltage();}}

 function setText(node,value){if(node.textContent!==value)node.textContent=value;}
 const slots=[];
 function render(s){
  displayed=s;const d=describe(s);drawScene(d);
  if(capacitorList){capacitorList.hidden=d.count<=3;setText(capacitorListTitle,'Additional '+Math.max(0,d.count-3)+' capacitances');setText(capacitorListValues,d.parts.slice(3).map((value,i)=>'C'+(i+4)+' = '+exact(value)+' F').join(' · '));}
  slots.forEach((slot,i)=>{const m=d.metrics[i];slot.host.hidden=!m;if(!m)return;setText(slot.label,m.label);setText(slot.value,fmt(m.n)+(m.unit?' '+m.unit:''));slot.host.style.color=tone[m.n<0?'red':m.color];slot.binding.label=m.label;slot.binding.color=m.n<0?'red':m.color;slot.host.style.setProperty('--ee-tip-color',tone[slot.binding.color]);});
  if(key==='voltage-current-resistance')readout.parentNode.firstChild.textContent=({v:'Calculated voltage',i:'Calculated current',r:'Calculated resistance'})[s.mode]||'Calculated output';
  if(readout){setText(readout,fmt(s.result)+(s.unit?' '+s.unit:''));const outputTone=s.result<0?'red':'green';readout.style.color=tone[outputTone];bindings.find(b=>b.node===readout).color=outputTone;readout.style.setProperty('--ee-tip-color',tone[outputTone]);}
  if(note)setText(note,key==='voltage-current-resistance'?'Conventional current; speed and component bands are schematic, not electron drift velocity.':d.note);
  for(const b of bindings){const value=b.get(d);b.node.setAttribute('aria-label',b.label+': '+value);}
  for(const t of tracks){const value=d.current??0;t.g.style.opacity=value===0?'0':'1';t.g.dataset.flowMagnitude=String(Math.abs(value));t.g.dataset.flowRate=String(speed(value,d.ref));t.g.dataset.flowDirection=value===0?'stopped':d.ac?'alternating':value<0?'reverse':'forward';}
  refreshTip();
 }
 function hideTip(){activeTip=null;pointer=null;if(tooltip)tooltip.hidden=true;}
 function refreshTip(){
  if(!activeTip||!tooltip)return;const b=activeTip,d=displayed?describe(displayed):null;
  setText(tooltip,b.label+': '+(d?b.get(d):'Calculate to show a value'));
  tooltip.style.setProperty('--ee-tip-color',tone[b.color]||tone.blue);tooltip.hidden=false;
  const r=b.node.getBoundingClientRect(),box=tooltip.getBoundingClientRect(),vw=document.documentElement.clientWidth,vh=window.innerHeight;
  tooltip.style.left=clamp((pointer?.x??r.left+r.width/2)+10,8,Math.max(8,vw-box.width-8))+'px';
  tooltip.style.top=clamp((pointer?.y??r.top)-box.height-10,8,Math.max(8,vh-box.height-8))+'px';
 }
 function setupTips(){
  tooltip=el('div','ee-tooltip',document.body);tooltip.id='caluler-electronics-tooltip';tooltip.setAttribute('role','tooltip');tooltip.hidden=true;
  for(const b of bindings){b.node.setAttribute('aria-describedby',tooltip.id);b.node.setAttribute('aria-label',b.label+' — Calculate to show values');
   b.node.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;activeTip=b;pointer={x:e.clientX,y:e.clientY};refreshTip();});
   b.node.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||activeTip!==b)return;pointer={x:e.clientX,y:e.clientY};refreshTip();});
   b.node.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')hideTip();});
   b.node.addEventListener('focus',()=>{activeTip=b;pointer=null;refreshTip();});b.node.addEventListener('blur',hideTip);
   b.node.addEventListener('click',e=>{if(activeTip===b&&b.tapped){b.tapped=false;hideTip();}else{bindings.forEach(t=>t.tapped=false);b.tapped=true;activeTip=b;pointer=e.detail?{x:e.clientX,y:e.clientY}:null;refreshTip();}});
   b.node.addEventListener('keydown',e=>{if(e.key==='Escape')hideTip();if(e.key==='Enter'||e.key===' '){e.preventDefault();activeTip=b;pointer=null;refreshTip();}});
  }
  document.addEventListener('click',e=>{if(!bindings.some(b=>b.node.contains(e.target)))hideTip();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hideTip();});window.addEventListener('scroll',hideTip,{passive:true});window.addEventListener('resize',hideTip,{passive:true});
 }
 function interpolateSnapshot(a,b,ease){
  const s={...b,values:b.values.map((value,i)=>(a.values[i]??value)*(1-ease)+value*ease),result:a.result*(1-ease)+b.result*ease};
  if(kind==='capacitor'){
   // Interpolate C and V; derive Q and U so polarity/energy stay physically coherent.
   const ca=key==='capacitor-energy'?a.values[0]:a.result,cb=key==='capacitor-energy'?b.values[0]:b.result;
   const C=ca*(1-ease)+cb*ease,V=s.values[1];
   s.values[0]=key==='capacitor-energy'?C:C*V;s.result=key==='capacitor-energy' ? .5*C*V*V : C;
  }else if(kind==='energy'){
   s.result=s.values[0]/1000*s.values[1]*s.values[2]*s.values[3];
  }
  return s;
 }
 function running(){if(!displayed||reduced.matches)return false;const d=describe(displayed);return tracks.length&&d.current!==null&&d.current!==0||signalDots.length&&d.frequency>0||lcMotion&&d.frequency>0||transientMotion&&d.tau>0||kvlTraversal;}
 function loop(){if(!raf&&!document.hidden&&visible&&(from||running()))raf=requestAnimationFrame(tick);}
 function tick(now){
  raf=0;const dt=Math.min(80,lastTime?now-lastTime:0);lastTime=now;clock+=dt;
  if(from){const p=clamp((now-started)/1800,0,1),ease=(1-Math.cos(Math.PI*p))/2;const s=p===1?target:interpolateSnapshot(from,target,ease);if(!displayed&&p===0){loop();return;}if(!valid(s,p<1)){render(target);from=null;panel.dataset.calulerAnimating='false';}else render(s);if(p===1){from=null;panel.dataset.calulerAnimating='false';}}
  if(displayed&&!reduced.matches){const d=describe(displayed);
   for(const t of tracks){const value=d.current??0,rate=speed(value,d.ref);if(!rate)continue;let dashOffset;
    if(t.ac)dashOffset=-Math.sin(clock/800+t.slot*2*Math.PI/3)*22*rate*Math.sign(value);
    else{t.offset+=dt/1000*22*rate*Math.sign(value);dashOffset=-t.offset;}
    t.p.style.strokeDashoffset=String(dashOffset);if(t.core)t.core.style.strokeDashoffset=String(dashOffset);
   }
   for(const dot of signalDots){if(!(d.frequency>0))continue;phase+=dt/1000*speed(d.frequency,50)/signalDots.length;const p=(phase%1+1)%1;attrs(dot.dot,{cx:dot.x0+dot.w*p,cy:dot.y0-dot.h*Math.sin(p*2*Math.PI)});if(dot.paint)dot.paint(Math.sin(p*2*Math.PI));}
   if(lcMotion&&d.frequency>0){const normalizedRate=.2+.35*Math.log1p(d.frequency)/(1+Math.log1p(d.frequency));phase=(phase+dt/1000*normalizedRate)%1;lcMotion(phase*2*Math.PI,dt/1000);}
   if(kvlTraversal)kvlTraversal(dt/1000);
   if(transientMotion&&d.tau>0){const rate=.11+.07/(1+Math.log1p(d.tau));transientPhase=(transientPhase+dt/1000*rate)%1;transientMotion(transientPhase*8,dt/1000);}
  }
  loop();
 }
 function commit(snapshot){
  if(!panel)return;
  if(!valid(snapshot)){warning.hidden=false;setText(warning,'The illustration needs finite, physically applicable values. The previous diagram is preserved; calculator Results are unchanged.');return;}
  warning.hidden=true;target={...snapshot,values:snapshot.values.slice()};
  if(key==='voltage-current-resistance'&&document.getElementById('solve').value===snapshot.mode)document.getElementById(snapshot.mode).value=String(snapshot.result);
  if(reduced.matches){from=null;render(target);panel.dataset.calulerAnimating='false';for(const t of tracks)t.g.style.opacity='0';return;}
  from=displayed?{...displayed,values:displayed.values.slice(),result:displayed.unit===target.unit?displayed.result:target.result}:{...target,values:target.values.map(()=>0),result:0};started=performance.now();panel.dataset.calulerAnimating='true';loop();
 }
 function preference(){
  if(reduced.matches){if(raf)cancelAnimationFrame(raf);raf=0;from=null;if(target)render(target);if(panel)panel.dataset.calulerAnimating='false';tracks.forEach(t=>t.g.style.opacity='0');}
  else{if(displayed)render(displayed);loop();}
 }
 function reset(){
  if(key!=='ohms-law'||!panel)return;
  if(raf)cancelAnimationFrame(raf);raf=0;lastTime=0;phase=0;clock=0;from=null;target=null;displayed=null;
  if(drawScene?.reset)drawScene.reset();
  if(readout)setText(readout,'—');
  if(note)note.textContent='Enter values and select Calculate. Geometry and component sizes are schematic.';
  if(warning){warning.hidden=true;warning.textContent='';}
  const preview=describe({values:Array(6).fill(0),result:0,unit:''});
  slots.forEach((slot,i)=>{const m=preview.metrics[i];slot.host.hidden=!m;if(!m)return;setText(slot.label,m.label);setText(slot.value,'—');slot.host.style.color=tone[m.color];slot.binding.label=m.label;slot.binding.color=m.color;slot.host.style.setProperty('--ee-tip-color',tone[m.color]);});
  for(const binding of bindings)binding.node.setAttribute('aria-label',binding.label+' — Calculate to show a value');
  tracks.forEach(track=>{track.g.style.opacity='0';track.g.dataset.flowMagnitude='0';track.g.dataset.flowRate='0';track.g.dataset.flowDirection='stopped';track.offset=0;track.p.style.strokeDashoffset='0';if(track.core)track.core.style.strokeDashoffset='0';});
  hideTip();panel.dataset.calulerAnimating='false';
 }
 function start(){
  const calculator=document.querySelector('.calculator');resultNode=document.getElementById(key==='ohms-law'?'ohmsResult':'calcResult');const button=document.getElementById(key==='ohms-law'?'ohmsCalculate':'calculateBtn');
  if(!calculator||!resultNode||!button||calculator.querySelector('.ee-panel'))return;
  const wrapper=el('div','ee-form');calculator.insertBefore(wrapper,calculator.firstChild);
  for(const child of Array.from(calculator.childNodes)){if(child===wrapper)continue;if(child===resultNode)break;wrapper.appendChild(child);}
  calculator.classList.add('ee-layout');
  panel=el('section','ee-panel');panel.dataset.calulerDiagramPanel='electronics';panel.dataset.calulerAnimating='false';panel.setAttribute('aria-label',title);calculator.insertBefore(panel,resultNode);
  const heading=el('h2','',panel);heading.textContent=title;
  if(kind!=='energy'){const caption=el('p','ee-caption',panel);caption.textContent=kind==='parallel-c'?'Parallel capacitors share a common voltage.':kind==='series-c'?'Series capacitors form a single path.':kind==='kvl'?'KVL loop traversal · not current':key==='voltage-current-resistance'||key==='ohms-law'?'Battery–resistor circuit':'Calculation-aware schematic';}
  if(['circuit','power','led','divider'].includes(kind))panel.classList.add('ee-circuit-panel');
  if(key==='voltage-current-resistance'||key==='ohms-law')panel.classList.add('ee-vcr-panel');
  if(key==='ohms-law'){panel.classList.add('ee-ohms-panel');wrapper.classList.add('ee-ohms-form');}
  svg=n('svg',{viewBox:['circuit','power','led','divider'].includes(kind)?'0 0 360 240':'0 0 320 284',class:'ee-svg',role:'group','aria-label':title},panel);drawScene=build();tracks.forEach(t=>t.g.style.opacity='0');
  if(!['energy','kvl','series-c','parallel-c'].includes(kind)){
  metrics=el('div','ee-metrics',panel);const preview=describe({values:Array(6).fill(0),result:0,unit:''});
  for(let i=0;i<6;i++){const host=el('div','ee-metric',metrics),label=el('span','',host),value=el('strong','',host);host.hidden=i>=preview.metrics.length;label.textContent=preview.metrics[i]?.label||'Quantity';value.textContent='—';bind(host,'blue',label.textContent,d=>{const m=d.metrics[i];return m?exact(m.n)+(m.unit?' '+m.unit:''):'Not used in this mode';});slots.push({host,label,value,binding:bindings[bindings.length-1]});}
  const output=el('div','ee-output',panel),outLabel=el('span','',output);outLabel.textContent=key==='voltage-current-resistance'?'Calculated output':outputLabel;readout=el('strong','',output);readout.textContent='—';bind(readout,'green',outputLabel,d=>exact(d.s.result)+' '+d.s.unit);
  if(key==='ohms-law')output.hidden=true;
  note=el('p','ee-note',panel);note.textContent='Enter values and select Calculate. Geometry and component sizes are schematic.';
  }
  warning=el('p','ee-warning',panel);warning.setAttribute('role','status');warning.setAttribute('data-caluler-diagram-export-ignore','');warning.hidden=true;
  setupTips();
  if(key==='voltage-current-resistance'){wrapper.classList.add('ee-vcr-form');vcrOutputFields();}
  wrapper.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing&&e.target.tagName==='INPUT'){e.preventDefault();button.click();}});
  document.addEventListener('visibilitychange',()=>{lastTime=0;if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else loop();});
  if(typeof IntersectionObserver!=='undefined'){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){if(raf)cancelAnimationFrame(raf);raf=0;lastTime=0;}else loop();},{rootMargin:'100px'}).observe(panel);}
  reduced.addEventListener?.('change',preference);
  window.addEventListener('pageshow',()=>{if(displayed)render(displayed);loop();});
  window.calulerDiagramExport?.discover();
 }
 window.calulerElectronics=Object.freeze({commit,reset});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
