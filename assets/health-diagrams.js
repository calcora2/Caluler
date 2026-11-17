/* Health-only committed visualizations. Existing calculator handlers remain the authority for Results. */
(function () {
  'use strict';
  if(window.calulerHealthDiagrams||document.body?.dataset.calulerCategory!=='Health Calculators')return;
  const key=location.pathname.split('/').pop().replace(/\.html$/,'').replace(/-calculator$/,'');
  const configs={
    'ideal-weight':['Height-based reference','height gender','result','', 'Devine-style single estimate; no personal healthy-weight range or current-weight measurement is supplied.'],
    'body-fat':['Circumference and composition','height waist neck hip gender','bodyFatResult','bodyFatForm','U.S. Navy circumference estimate; fat-free proportion is a complement, not measured lean mass in kg.'],
    macro:['Daily nutrition split','macroMode calories protein carbs fat proteinWeight proteinFactor','result','','Energy-based split uses 4/4/9 kcal per gram; the protein factor is selected by the user.'],
    'water-intake':['Weight-based fluid estimate','weight','result','','A 35 mL/kg starting estimate, not a measurement of hydration or water already consumed.'],
    'heart-rate-recovery':['One-minute recovery','hrrPeak hrrAfter','hrrResult','hrrForm','Two supplied readings; the connector is not a sampled recovery curve or a fitness diagnosis.'],
    'lean-body-mass':['Estimated body composition','weight bodyfat','result','','Fat-free and fat mass follow the supplied body-fat estimate; proportions are not direct measurements.'],
    'heart-rate-zone':['Heart-rate reserve zones','age resting','result','','Karvonen model with 220 − age; these are estimated reference zones, not measured personal limits.'],
    'one-rep-max':['Load and repetition estimate','weight reps','result','','Epley model; a one-repetition input returns the supplied load. No lifting speed is inferred.'],
    'vo2-max':['Twelve-minute field test','vo2Distance','vo2Result','vo2Form','Cooper run-test estimate; no laboratory oxygen measurement or age/sex fitness grade is inferred.'],
    'body-surface-area':['Mosteller surface estimate','height weight','result','','A height/weight formula estimate, not an anatomical surface map or a dosing recommendation.'],
    'waist-to-hip-ratio':['Circumference comparison','waist hip','result','','Tape locations are schematic; the added bars compare the two supplied circumferences on one scale.'],
    'body-weight-change':['Two-reading weight change','wcStart wcCurrent wcDays','wcResult','weightChangeForm','Only the two supplied readings are shown; no daily trajectory, goal or future weight is invented.'],
    pace:['Distance and elapsed time','distance minutes','result','','Average pace and speed describe the supplied trip, not individual splits or a future finish time.'],
    'waist-to-height-ratio':['Waist relative to height','whWaist whHeight','whResult','whratioForm','The ruler shows the supplied dimensionless ratio; it does not add a diagnosis or infer missing context.'],
    'training-load':['Session RPE load','trainingMinutes trainingRpe','trainingLoadResult','trainingLoadForm','Minutes × session RPE gives arbitrary units, not calories, physiological fatigue or injury probability.'],
    bmi:['Adult BMI reference','weight height','result','','Reference bands are for adults 20+; not a child, pregnancy or individual body-composition assessment. BMI is not a diagnosis.'],
    'fat-free-mass-index':['Mass normalized by height','ffWeight ffHeight ffBodyFat','ffResult','ffmiForm','FFMI uses estimated fat-free mass / height²; no physique rating or unsupported reference cut-off is added.'],
    calorie:['Resting and activity energy','energyWeight energyHeight energyAge energySex energyMethod energyActivity energyGoal energyAdjustment energyExerciseMinutes energyMET','energyResult','energyForm','Resting expenditure, daily expenditure and a selected target are distinct estimates; no weight-loss forecast is inferred.'],
    sleep:['Sleep arithmetic options','wake','result','','90-min cycles + 15-min onset; estimates, not sleep recommendations.']
  };
  if(!configs[key])return;
  const cfg=configs[key],NS='http://www.w3.org/2000/svg',colors={blue:'var(--health-blue)',teal:'var(--health-teal)',amber:'var(--health-amber)',purple:'var(--health-purple)',rose:'var(--health-rose)',muted:'var(--muted)'};
  const preserved=new Set(['body-fat','lean-body-mass','waist-to-hip-ratio','waist-to-height-ratio']);
  const bodyTools=new Set(['body-fat','waist-to-hip-ratio','waist-to-height-ratio']);
  let bodyView=null,bodyLegend=null,bodySummarySvg=null,bodyKey=null,bodyPrimary=null;
  const formId=cfg[3],duration=1800,reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let panel,stage,scene,svg,note,warning,tip,button,form,result,displayed=null,committed=null,motion=null,raf=0,edited=false,active=null,dismissed=null,pointer=null,pinned=false;
  const layers=[];
  const macroStates=key==='macro'?new Map():null;
  let macroStatus=null,macroShownMode='split';
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const blend=(a,b,t)=>t<=0?a:t>=1?b:a*(1-t)+b*t;
  const fmt=(n,d=1)=>Number.isFinite(n)?n.toLocaleString('en-US',{maximumFractionDigits:d}):'—';
  const fmtStable=(n,d)=>Number.isFinite(n)?n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
  // Match the calculator's toFixed rounding, retaining decimal places throughout a tween.
  const fmtFixed=(n,d)=>Number.isFinite(n)?Number(n.toFixed(d)).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
  const exact=n=>Number.isFinite(n)?String(Object.is(n,-0)?0:n):'—';
  function model(raw,presentation=false){
    const numeric={},v=(id,min=-Infinity,max=Infinity,integer=false)=>{const text=String(raw[id]??'').trim(),n=Number(text);if(!text||!Number.isFinite(n)||n<min||n>max||integer&&!presentation&&!Number.isInteger(n))throw new Error('Check the required values and supported ranges.');numeric[id]=n;return n;};
    const d={key,raw:{...raw},numeric,mode:key,ref:cfg[4],values:{},discrete:[]};let a,b,c;
    switch(key){
      case 'ideal-weight':a=v('height',120,230);d.mode=raw.gender;d.values={height:a,reference:(raw.gender==='male'?50:45.5)+2.3*Math.max(0,a/2.54-60),sex:raw.gender};break;
      case 'body-fat':{
        const height=v('height',120,230),waist=v('waist',20,250),neck=v('neck',15,100),female=raw.gender==='female';let density,hip;
        if(female){hip=v('hip',20,250);if(waist+hip<=neck)throw new Error('Waist plus hip must exceed neck circumference.');density=1.29579-.35004*Math.log10(waist+hip-neck)+.221*Math.log10(height);}else{if(waist<=neck)throw new Error('Waist must exceed neck circumference.');density=1.0324-.19077*Math.log10(waist-neck)+.15456*Math.log10(height);}
        const fat=495/density-450;if(!(density>0)||!Number.isFinite(fat)||fat<0||fat>70)throw new Error('Circumferences do not produce a supported body-fat estimate.');d.mode=raw.gender;d.values={height,waist,neck,hip,fat,lean:100-fat,sex:raw.gender};break;
      }
      case 'macro':
        d.mode=raw.macroMode;
        if(raw.macroMode==='protein'){a=v('proteinWeight',20,350);b=v('proteinFactor',.4,3);d.values={weight:a,factor:b,protein:a*b};}
        else{const calories=v('calories',Number.MIN_VALUE,10000),protein=v('protein',0,100),carbs=v('carbs',0,100),fat=v('fat',0,100);if(Math.abs(protein+carbs+fat-100)>.01)throw new Error('Protein, carbs and fat must total 100%.');d.values={calories,percent:[protein,carbs,fat],grams:[calories*protein/100/4,calories*carbs/100/4,calories*fat/100/9],energy:[calories*protein/100,calories*carbs/100,calories*fat/100]};}break;
      case 'water-intake':a=v('weight',20,350);d.values={weight:a,litres:a*.035,ounces:a*.035*33.814};break;
      case 'heart-rate-recovery':a=v('hrrPeak',40,240);b=v('hrrAfter',30,240);if(b>a)throw new Error('The one-minute reading must not exceed the end-exercise reading.');d.values={peak:a,after:b,drop:a-b};break;
      case 'lean-body-mass':a=v('weight',20,350);b=v('bodyfat',0,70);d.values={weight:a,fatPercent:b,leanPercent:100-b,lean:a*(1-b/100),fat:a*b/100};break;
      case 'heart-rate-zone':a=v('age',18,100,true);b=v('resting',30,120);c=220-a;if(b>=c)throw new Error('Resting heart rate must be below the age-estimated maximum.');d.values={age:a,rest:b,max:c,reserve:c-b,bounds:[.5,.6,.7,.8,.9,1].map(p=>b+(c-b)*p)};d.discrete=['age'];break;
      case 'one-rep-max':a=v('weight',1,1000);b=v('reps',1,30,true);d.values={weight:a,reps:b,estimate:b===1?a:a*(1+b/30)};d.discrete=['reps'];break;
      case 'vo2-max':a=v('vo2Distance',1000,5000);d.values={distance:a,vo2:(a-504.9)/44.73};break;
      case 'body-surface-area':a=v('height',120,230);b=v('weight',20,350);d.values={height:a,weight:b,area:Math.sqrt(a*b/3600)};break;
      case 'waist-to-hip-ratio':a=v('waist',20,250);b=v('hip',20,250);d.values={waist:a,hip:b,ratio:a/b};break;
      case 'body-weight-change':a=v('wcStart',20,500);b=v('wcCurrent',20,500);c=v('wcDays',1,36500,true);d.values={start:a,current:b,days:c,change:b-a,percent:(b-a)/a*100,weekly:(b-a)/c*7};d.discrete=['wcDays'];break;
      case 'pace':a=v('distance',Number.MIN_VALUE);b=v('minutes',Number.MIN_VALUE);d.values={distance:a,minutes:b,paceSeconds:Math.round(b/a*60),speed:a/(b/60)};break;
      case 'waist-to-height-ratio':a=v('whWaist',20,250);b=v('whHeight',80,250);d.values={waist:a,height:b,ratio:a/b};break;
      case 'training-load':a=v('trainingMinutes',1,600);b=v('trainingRpe',0,10);d.values={minutes:a,rpe:b,load:a*b};break;
      case 'bmi':a=v('weight',20,350);b=v('height',100,230);d.values={weight:a,height:b,bmi:a/(b/100)**2};break;
      case 'fat-free-mass-index':a=v('ffWeight',25,350);b=v('ffHeight',100,230)/100;c=v('ffBodyFat',0,70);d.values={weight:a,height:b,fatPercent:c,lean:a*(1-c/100),fat:a-a*(1-c/100),ffmi:a*(1-c/100)/(b*b)};break;
      case 'calorie':{
        const weight=v('energyWeight',25,350),goal=raw.energyGoal;d.mode=goal+'|'+raw.energySex+'|'+raw.energyMethod;
        if(goal==='exercise'){const minutes=v('energyExerciseMinutes',1,1440),met=v('energyMET',1,25);d.values={weight,minutes,met,exercise:met*3.5*weight/200*minutes};d.ref='MET model: gross exercise energy estimate, not BMR/TDEE or a measured calorie burn.';break;}
        const height=v('energyHeight',120,230),age=v('energyAge',18,100),activity=v('energyActivity',Number.MIN_VALUE),male=raw.energySex==='male',method=raw.energyMethod;
        const bmr=method==='mifflin'?10*weight+6.25*height-5*age+(male?5:-161):male?88.362+13.397*weight+4.799*height-5.677*age:447.593+9.247*weight+3.098*height-4.330*age;
        const tdee=bmr*activity;let target=tdee,adjustment=0;if(goal!=='maintenance'){adjustment=v('energyAdjustment',1,3000);target=goal==='deficit'?tdee-adjustment:tdee+adjustment;if(goal==='deficit'&&(adjustment>=tdee||target<bmr))throw new Error('The selected deficit is outside this calculator’s supported target range.');}
        d.values={weight,height,age,activity,bmr,tdee,target,adjustment,goal,method};break;
      }
      case 'sleep':{
        const match=String(raw.wake||'').match(/^(\d{2}):(\d{2})$/);if(!match||Number(match[1])>23||Number(match[2])>59)throw new Error('Choose a valid wake-up time.');
        const date=new Date();date.setHours(Number(match[1]),Number(match[2]),0,0);d.values={wake:date.getTime(),options:[6,5,4,3].map(cycles=>({cycles,time:date.getTime()-cycles*90*60000-15*60000,minutes:cycles*90+15}))};d.discrete=['wake'];break;
      }
    }
    const numbers=Object.values(d.values).flatMap(value=>typeof value==='number'?[value]:Array.isArray(value)?value.filter(v=>typeof v==='number'):[]);if(numbers.some(n=>!Number.isFinite(n)))throw new Error('These inputs exceed the finite visualization range.');return d;
  }
  function activeInputs(raw){
    if(key==='macro')return(raw.macroMode==='protein'?'proteinWeight proteinFactor':'calories protein carbs fat').split(' ');
    if(key==='calorie')return(raw.energyGoal==='exercise'?'energyWeight energyExerciseMinutes energyMET':'energyWeight energyHeight energyAge energyActivity'+(raw.energyGoal==='maintenance'?'':' energyAdjustment')).split(' ');
    return cfg[1].split(' ').filter(id=>!(key==='body-fat'&&id==='hip'&&raw.gender!=='female'));
  }
  function collect(){
    const raw={};cfg[1].split(' ').forEach(id=>raw[id]=document.getElementById(id)?.value??'');
    for(const id of activeInputs(raw)){const input=document.getElementById(id);if(input?.validity?.valid===false)throw new Error('Complete the required fields with valid values.');}return raw;
  }
  const heights={bmi:200,macro:200,'water-intake':190,'heart-rate-recovery':220,'heart-rate-zone':190,'body-weight-change':220,sleep:216,calorie:210};
  let drawing,guideBase=null,neutralSex='male';
  function el(tag,attrs={},parent=drawing){const node=document.createElementNS(NS,tag);for(const[name,value]of Object.entries(attrs))node.setAttribute(name,String(value));parent.append(node);return node;}
  function text(x,y,value,{anchor='middle',tone='ink',size=17,weight=500,width=320,parent=drawing}={}){const n=el('text',{x,y,'text-anchor':anchor,fill:colors[tone]||'var(--text)','font-size':size,'font-weight':weight},parent);n.textContent=String(value);if(n.textContent.length*size*.55>width){n.setAttribute('textLength',width);n.setAttribute('lengthAdjust','spacingAndGlyphs');}return n;}
  function line(x1,y1,x2,y2,tone='muted',attrs={},parent=drawing){return el('line',{x1,y1,x2,y2,stroke:colors[tone],'stroke-width':1.8,'stroke-linecap':'round',...attrs},parent);}
  function rect(x,y,width,height,tone='blue',attrs={},parent=drawing){return el('rect',{x,y,width,height,rx:5,fill:colors[tone],'fill-opacity':.1,stroke:colors[tone],'stroke-width':1.5,...attrs},parent);}
  // Reusable SVG pill: exact horizontal segment widths, one rounded outer clip,
  // and a neutral depth overlay. All paint resources travel with PNG/print SVGs.
  function pillBar(x,y,width,height,segments=[]){
    let defs=drawing.querySelector('defs.health-bar-defs');
    const shine='health-'+key+'-bar-depth';
    if(!defs){
      defs=el('defs',{'class':'health-bar-defs'});
      const gradient=el('linearGradient',{id:shine,x1:'0%',y1:'0%',x2:'0%',y2:'100%'},defs);
      for(const[offset,color,opacity]of [['0%','#FFFFFF',.22],['44%','#FFFFFF',.035],['58%','#000000',0],['100%','#000000',.10]])
        el('stop',{offset,'stop-color':color,'stop-opacity':opacity},gradient);
    }
    const id='health-'+key+'-bar-'+defs.querySelectorAll('clipPath').length;
    const clip=el('clipPath',{id,clipPathUnits:'userSpaceOnUse'},defs);
    rect(x,y,width,height,'muted',{rx:height/2,fill:'#000000','fill-opacity':1,'stroke-width':0},clip);
    const group=el('g',{'class':'health-bar','data-health-bar-width':width,'data-health-bar-height':height});
    rect(x,y,width,height,'muted',{'class':'health-bar-track',rx:height/2,'fill-opacity':.08,'stroke-width':0},group);
    const fills=el('g',{'clip-path':'url(#'+id+')'},group);let offset=0;
    const parts=segments.map(segment=>{
      const at=segment.offset??offset,part=rect(x+at,y,segment.width,height,segment.tone||'blue',{
        'class':'health-bar-segment',rx:segments.length===1?height/2:0,
        'fill-opacity':segment.opacity??.90,'stroke-width':0,...(segment.id?{id:segment.id}:{})
      },fills);
      if(segment.tip)hit(part,segment.tip,segment.tone||'blue');
      offset=at+segment.width;return part;
    });
    // Join lines are paint only; they never change segment widths or intercept input.
    segments.slice(1).forEach((segment,i)=>{const part=parts[i+1],at=Number(part.getAttribute('x'));line(at,y+2,at,y+height-2,'muted',{
      stroke:'var(--card)','stroke-width':1,opacity:segment.width>0&&segments[i].width>0?.45:0,'pointer-events':'none'
    },fills);});
    rect(x,y,width,height,'muted',{rx:height/2,fill:'url(#'+shine+')','fill-opacity':1,'stroke-width':0,'pointer-events':'none','aria-hidden':'true'},group);
    rect(x,y,width,height,'muted',{'class':'health-bar-outline',rx:height/2,fill:'none',stroke:'var(--border)','stroke-width':1,'pointer-events':'none','aria-hidden':'true'},group);
    return parts;
  }
  function point(x,y,tone='blue',r=5,parent=drawing){return el('circle',{cx:x,cy:y,r,fill:'var(--card)',stroke:colors[tone],'stroke-width':2.2},parent);}
  function hit(node,label,tone='blue'){
    let target=node;
    if(['rect','circle','path','line'].includes(node.tagName.toLowerCase())){const parent=node.parentNode,g=document.createElementNS(NS,'g');parent.insertBefore(g,node);g.append(node);target=g;let touch=node.cloneNode(false);for(const attr of touch.getAttributeNames())if(attr==='id'||attr==='tabindex'||attr.startsWith('aria-')||attr.startsWith('data-'))touch.removeAttribute(attr);touch.setAttribute('class','health-hit');touch.setAttribute('fill',node.tagName.toLowerCase()==='line'||node.tagName.toLowerCase()==='path'?'none':'transparent');touch.setAttribute('stroke','transparent');touch.setAttribute('stroke-width','14');touch.setAttribute('aria-hidden','true');touch.setAttribute('data-caluler-diagram-export-ignore','');if(node.tagName.toLowerCase()==='circle')touch.setAttribute('r','12');g.insertBefore(touch,node);}
    const area=target.querySelector?.('.health-hit');if(area?.tagName.toLowerCase()==='rect'&&Number(area.getAttribute('width'))<12){const x=Number(area.getAttribute('x')),width=Number(area.getAttribute('width'));area.setAttribute('x',x+(width-12)/2);area.setAttribute('width','12');}
    target.setAttribute('data-health-tip',label);target.setAttribute('data-health-tone',tone);target.setAttribute('tabindex','0');target.setAttribute('role','img');target.setAttribute('aria-label',label);target.setAttribute('aria-describedby','caluler-health-tooltip');target.classList.add('health-interactive');return target;
  }
  function value(value,unit,label,y=175,tone='blue',digits=null){text(180,y,(digits===null?fmtStable(value,2):fmtFixed(value,digits))+(unit?' '+unit:''),{size:25,weight:700,tone});if(label)text(180,y+24,label,{size:14,tone:'muted'});}
  function axis(lo,hi,y,left=30,right=330){line(left,y,right,y);for(let i=0;i<=4;i++){const x=left+(right-left)*i/4;line(x,y-4,x,y+4,'muted',{'stroke-width':1});if(i%2===0)text(x,y+23,fmt(blend(lo,hi,i/4),1),{size:14,tone:'muted',anchor:i===0?'start':i===4?'end':'middle',width:80});}}
  function arrow(x1,y1,x2,y2,tone='blue'){line(x1,y1,x2,y2,tone,{'stroke-width':2.4});if(Math.hypot(x2-x1,y2-y1)>1){const a=Math.atan2(y2-y1,x2-x1);el('path',{d:`M${x2-6*Math.cos(a-.5)},${y2-6*Math.sin(a-.5)} L${x2},${y2} L${x2-6*Math.cos(a+.5)},${y2-6*Math.sin(a+.5)}`,fill:'none',stroke:colors[tone],'stroke-width':2});}}
  // Card geometry belongs to the layout, never to a value or its formatted length.
  function node(x,y,label,display,tone='blue',width=134){
    const g=el('g',{'class':'health-metric-card','data-health-card-width':width,'data-health-card-height':63});
    rect(x,y,width,63,tone,{'class':'health-metric-surface','fill-opacity':.07,'stroke-opacity':.45},g);
    text(x+width/2,y+21,label,{size:14,tone:'muted',parent:g,width:width-12}).classList.add('health-metric-label');
    text(x+width/2,y+47,display,{size:21,weight:650,tone,parent:g,width:width-12}).classList.add('health-metric-value');
    return g;
  }
  function repMaxDiagram(v=null){
    line(41,91,145,91,'blue',{'stroke-width':5});for(const x of [55,119])rect(x,65,12,52,'blue',{'fill-opacity':.35});text(93,43,'Total load',{size:15,tone:'muted'});
    const load=text(93,145,v?fmt(v.weight,1)+' kg × '+fmt(v.reps,0):'Load × reps',{size:19,weight:600,width:150});
    load.setAttribute('data-health-rep-load','');
    if(v)hit(load,metricTip('Supplied total load',v.weight,'kg')+'\nRepetitions = '+v.reps);
    arrow(161,91,193,91);
    const estimate=node(205,58,'1RM estimate',v?fmtFixed(v.estimate,1)+' kg':'—','teal',128);
    estimate.querySelector('.health-metric-value').setAttribute('data-health-rep-estimate','');
    if(v)hit(estimate,metricTip('Epley estimate',v.estimate,'kg'),'teal');
  }
  function metricTip(name,n,unit=''){return name+' = '+exact(n)+(unit?' '+unit:'');}
  function sleepLayout(data){
    const scale=320/780,v=data?.values;
    let wakeX=344;
    if(v){
      const step=180*60000,end=Math.ceil(v.wake/step)*step;
      // A fixed UTC grid positions the 13-hour elapsed-time viewport even across
      // daylight-saving changes. Local clock labels and model arithmetic are untouched.
      wakeX=344-(end-v.wake)/60000*scale;
    }
    return{wakeX,opacity:v ? .90 : .12,rows:(v?.options||[6,5,4,3].map(cycles=>({cycles,minutes:cycles*90+15}))).map(option=>({
      startX:wakeX-option.minutes*scale,width:option.minutes*scale,onsetWidth:15*scale
    }))};
  }
  function sleepDay(time,wake){
    const day=t=>{const d=new Date(t);return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate());},offset=Math.round((day(time)-day(wake))/86400000);
    return offset===-1?'Previous day':offset===0?'Same day':offset===1?'Next day':Math.abs(offset)+' days '+(offset<0?'earlier':'later');
  }
  function sleepTimeline(data){
    const v=data?.values,layout=data?.sleepVisual||sleepLayout(data),clock=t=>new Date(t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit',hour12:true}),
      date=t=>new Date(t).toLocaleDateString([],{year:'numeric',month:'short',day:'numeric'}),duration=n=>{const h=Math.floor(n/60),m=n%60;return h+' h'+(m?' '+m+' min':'');};
    const days=v?v.options.map(option=>sleepDay(option.time,v.wake)):[],mixed=days.some(day=>day!==days[0]),
      context=!v?'Bedtime options':mixed?'† Previous day · others same day':'Bedtimes · '+days[0].toLowerCase();
    text(16,20,context,{anchor:'start',size:12,tone:'muted',width:190}).setAttribute('data-health-sleep-context','');
    text(344,20,v?'Wake '+clock(v.wake):'Wake —',{anchor:'end',size:14,weight:700,tone:'purple',width:126}).setAttribute('data-health-sleep-wake','');
    (v?.options||[6,5,4,3].map(cycles=>({cycles,minutes:cycles*90+15}))).forEach((option,i)=>{
      const y=50+i*44,position=layout.rows[i],tone=i%2?'purple':'blue',sleepMinutes=option.minutes-15;
      text(16,y,option.cycles+' cycles',{anchor:'start',size:15,weight:650,width:80});
      text(180,y,v?clock(option.time)+(mixed&&days[i]==='Previous day'?' †':''):'—',{size:16,weight:600,tone,width:132}).setAttribute('data-health-sleep-bedtime',String(option.cycles));
      text(344,y,duration(sleepMinutes),{anchor:'end',size:14,tone:'muted',width:88}).setAttribute('data-health-sleep-duration',String(option.cycles));
      const parts=pillBar(position.startX,y+11,position.width,8,[
        {width:position.onsetWidth,tone,opacity:layout.opacity*.4},
        {width:position.width-position.onsetWidth,tone,opacity:layout.opacity}
      ]),track=parts[0].closest('.health-bar');
      track.setAttribute('data-health-sleep-cycles',String(option.cycles));
      const tip=option.cycles+' assumed cycles\nSleep duration: '+duration(sleepMinutes)+'\nOnset allowance: 15 min\nTotal interval: '+duration(option.minutes)+(v?'\nBedtime: '+clock(option.time)+' · '+date(option.time)+'\nWake-up: '+clock(v.wake)+' · '+date(v.wake):'\nChoose a wake-up time, then Calculate.');
      hit(track,tip,tone);
      point(position.startX,y+15,tone,3,track).classList.add('health-sleep-start');
      point(layout.wakeX,y+15,'purple',3.5,track).classList.add('health-sleep-end');
    });
  }
  // Portrait geometry stays in its original coordinate system; labels use readable HTML.
  function bodyBadge(parent,x,y,letter,tone,anchor,label){
    const g=el('g',{'data-health-body-badge':letter},parent);line(anchor[0],anchor[1],x-10,y,tone,{'stroke-width':1.5},g);el('circle',{cx:x,cy:y,r:9,fill:'var(--card)',stroke:colors[tone],'stroke-width':1.5},g);text(x,y+4,letter,{tone,size:12,weight:700,parent:g});if(label)hit(g,label,tone);return g;
  }
  function bodyHeight(parent,x,top,bottom,label){
    const g=el('g',{},parent);line(x,top,x,bottom,'blue',{'stroke-width':1.6},g);el('path',{d:`M${x} ${top}l-4 7h8Z M${x} ${bottom}l-4-7h8Z`,fill:colors.blue},g);const n=text(x-13,(top+bottom)/2,'HEIGHT',{size:14,tone:'blue',parent:g});n.setAttribute('transform',`rotate(-90 ${x-13} ${(top+bottom)/2})`);if(label)hit(g,label);return g;
  }
  function bodyPortrait(d){
    const next=guideBase.cloneNode(false),v=d?.values;next.setAttribute('class','health-diagram-illustration health-body-portrait-svg');next.setAttribute('viewBox',key==='body-fat'?'95 0 250 285':key==='waist-to-hip-ratio'?'55 20 220 260':'85 0 235 255');
    for(const n of guideBase.children)if(['desc','defs'].includes(n.tagName.toLowerCase()))next.append(n.cloneNode(true));for(const n of guideBase.querySelectorAll('image'))next.append(n.cloneNode(true));drawing=next;
    if(key==='body-fat'){
      const female=(v?.sex||neutralSex)==='female';for(const sex of ['Male','Female'])next.querySelector('#bodyFat'+sex+'Figure').setAttribute('display',(sex==='Female')===female?'inline':'none');
      const male=el('g',{id:'bodyFatMaleMarkers',display:female?'none':'inline'}),woman=el('g',{id:'bodyFatFemaleMarkers',display:female?'inline':'none'});
      for(const id of ['bodyFatMaleNeckTape','bodyFatMaleWaistTape'])male.append(guideBase.querySelector('#'+id).cloneNode(true));
      bodyBadge(male,267,58,'A','blue',[247.2,58],v&&!female?metricTip('Neck',v.neck,'cm'):null);bodyBadge(male,280,125,'B','amber',[261.1,125],v&&!female?metricTip('Abdomen at navel',v.waist,'cm'):null);
      bodyBadge(woman,267,57,'A','blue',[247,57],v&&female?metricTip('Neck',v.neck,'cm'):null);bodyBadge(woman,274,110,'B','amber',[256,110],v&&female?metricTip('Natural waist',v.waist,'cm'):null);bodyBadge(woman,284,132,'C','purple',[265,132],v&&female?metricTip('Hip',v.hip,'cm'):null);
      bodyHeight(next,116,17,265,v?metricTip('Supplied height',v.height,'cm'):null);
    }else if(key==='waist-to-hip-ratio'){
      next.append(guideBase.querySelector('#whrMaleTapes').cloneNode(true));bodyBadge(next,205,132,'A','amber',[184.7,132],v?metricTip('Waist',v.waist,'cm'):null);bodyBadge(next,211,163,'B','purple',[190.6,163],v?metricTip('Hip',v.hip,'cm'):null);
    }else{
      next.append(guideBase.querySelector('#whtrMaleTapes').cloneNode(true));bodyBadge(next,253,108,'A','amber',[234.8,108],v?metricTip('Waist',v.waist,'cm'):null);bodyHeight(next,108,17,239,v?metricTip('Supplied height',v.height,'cm'):null);
    }
    return next;
  }
  function bodyLabels(d){
    const next=document.createElement('dl');next.className='health-body-legend';const v=d?.values,female=key==='body-fat'&&(v?.sex||neutralSex)==='female';
    const rows=key==='body-fat'?[['A','Neck','Just below the larynx','blue',v?.neck],['B','Waist',female?'Natural waist':'Navel level','amber',v?.waist],...(female?[['C','Hips','Widest hip region','purple',v?.hip]]:[])]:[['A','Waist','Midway between ribs and hips','amber',v?.waist],...(key==='waist-to-hip-ratio'?[['B','Hips','Widest hip / buttock level','purple',v?.hip]]:[])];
    for(const[letter,name,hint,tone,n]of rows){const row=document.createElement('div');row.className='health-body-item';row.setAttribute('data-health-tone',tone);const dt=document.createElement('dt'),dd=document.createElement('dd'),badge=document.createElement('span'),label=document.createElement('span');badge.className='health-body-letter';badge.setAttribute('aria-hidden','true');badge.textContent=letter;label.textContent=name;dt.append(badge,label);dd.textContent=hint;row.append(dt,dd);next.append(row);if(v)hit(row,metricTip(name,n,'cm')+'\n'+hint,tone);}
    return next;
  }
  function bodySummary(d){
    const next=document.createElementNS(NS,'svg');next.setAttribute('class','health-body-summary-svg');next.setAttribute('viewBox',key==='body-fat'?'0 0 320 36':'0 0 320 70');next.setAttribute('role','img');next.setAttribute('aria-label',key==='body-fat'?'Estimated fat-free and fat proportions':key==='waist-to-hip-ratio'?'Supplied circumferences on one common scale':'Supplied waist-to-height ratio, ruler from zero to one');drawing=next;const v=d?.values;
    if(key==='body-fat'){
      pillBar(8,8,304,18,[{width:v?304*v.lean/100:0,tone:'blue',tip:v?metricTip('Estimated fat-free proportion',v.lean,'%'):null},{width:v?304*v.fat/100:0,tone:'amber',tip:v?metricTip('Estimated fat proportion',v.fat,'%'):null}]);
    }else if(key==='waist-to-hip-ratio'){
      const max=v?(d.scales?.waist||Math.max(v.waist,v.hip)):1;for(const[label,n,y,tone]of [['Waist',v?.waist,8,'amber'],['Hip',v?.hip,39,'purple']]){text(8,y+14,label,{anchor:'start',size:17,tone,width:65});pillBar(79,y,233,17,v?[{width:233*n/max*(d.geometryProgress??1),tone,tip:metricTip(label,n,'cm')}]:[]);}
    }else{
      line(16,25,304,25);for(let i=0;i<=2;i++){const x=16+144*i;line(x,21,x,29);text(x,54,String(i/2),{size:17,tone:'muted',anchor:i===0?'start':i===2?'end':'middle'});}if(v){hit(point(16+288*clamp(v.ratio,0,1),25,'amber',6),metricTip('Waist / height',v.ratio)+(v.ratio>1?'\nAbove the displayed ruler.':''),'amber');if(v.ratio>1)text(303,13,'→',{anchor:'end',size:18,tone:'amber'});}
    }return next;
  }
  function setupBodyView(original){
    bodyView=panel.querySelector('.health-body-view');if(!bodyView){bodyView=document.createElement('div');bodyView.className='health-body-view';original.parentNode.insertBefore(bodyView,original);const frame=document.createElement('div');frame.className='health-body-frame';bodyLegend=document.createElement('dl');bodyLegend.className='health-body-legend';bodySummarySvg=document.createElementNS(NS,'svg');bodySummarySvg.setAttribute('class','health-body-summary-svg');bodyView.append(frame,bodySummarySvg);frame.append(original,bodyLegend);
      if(key==='body-fat'){const legend=document.createElement('div');legend.className='health-composition-key';for(const[tone,label]of [['blue','Fat-free'],['amber','Fat']]){const item=document.createElement('span');item.setAttribute('data-health-tone',tone);const swatch=document.createElement('i');swatch.className='health-composition-swatch';swatch.setAttribute('aria-hidden','true');item.append(swatch,document.createTextNode(label));legend.append(item);}bodyView.append(legend);}
    }else{bodyLegend=bodyView.querySelector('.health-body-legend');bodySummarySvg=bodyView.querySelector('.health-body-summary-svg');}
    if(key==='body-fat')bodyKey=bodyView.querySelector('.health-composition-key');else{bodyPrimary=bodyView.querySelector('.health-diagram-primary');if(!bodyPrimary){bodyPrimary=document.createElement('p');bodyPrimary.className='health-diagram-primary';bodyView.append(bodyPrimary);}}
    panel.classList.add('health-body-panel');return bodyView;
  }
  function bodyKeyValues(d){
    const next=document.createElement('div');next.className='health-composition-key';const v=d?.values,shownFat=v?Number(v.fat.toFixed(1)):null;
    for(const[tone,label,n,id]of [['blue','Fat-free:',v?100-shownFat:null,'fat-free-proportion'],['amber','Body Fat:',shownFat,'body-fat']]){const item=document.createElement('span'),swatch=document.createElement('i'),name=document.createElement('span'),value=document.createElement('strong');item.setAttribute('data-health-tone',tone);swatch.className='health-composition-swatch';swatch.setAttribute('aria-hidden','true');name.textContent=label;value.textContent=v?n.toFixed(1)+'%':'—';value.setAttribute('data-health-primary',id);item.append(swatch,name,value);next.append(item);}return next;
  }
  function bodyPrimaryValue(d){
    const next=document.createElement('p');next.className='health-diagram-primary';const label=document.createElement('span'),value=document.createElement('strong');label.textContent=(key==='waist-to-hip-ratio'?'Waist-to-hip ratio':'Waist-to-height ratio')+':';value.textContent=d?d.values.ratio.toFixed(2):'—';value.setAttribute('data-health-primary',key);next.append(label,value);return next;
  }
  function leanGuide(d){
    const next=document.createElementNS(NS,'svg');next.setAttribute('viewBox','0 0 320 132');next.setAttribute('class','health-new-svg health-composition-svg');next.setAttribute('role','img');next.setAttribute('aria-label','Estimated fat-free and fat mass, scaled from the supplied weight and body-fat percentage');drawing=next;const v=d?.values;
    text(160,26,v?'Supplied weight: '+fmt(v.weight,1)+' kg':'Estimated body composition',{size:18,tone:'muted'}).id='lbmTotalLabel';pillBar(16,48,288,26,[{width:v?288*v.leanPercent/100:0,tone:'blue',id:'lbmLeanSegment',tip:v?metricTip('Fat-free mass',v.lean,'kg')+'\n'+metricTip('Proportion',v.leanPercent,'%'):null},{width:v?288*v.fatPercent/100:0,tone:'amber',id:'lbmFatSegment',tip:v?metricTip('Fat mass',v.fat,'kg')+'\n'+metricTip('Proportion',v.fatPercent,'%'):null}]);text(16,99,'Fat-free',{anchor:'start',size:16,tone:'blue',weight:600}).id='lbmLeanLabel';text(304,99,'Fat',{anchor:'end',size:16,tone:'amber',weight:600}).id='lbmFatLabel';if(v){text(16,124,fmtFixed(v.lean,1)+' kg',{anchor:'start',size:20,tone:'blue',weight:700}).setAttribute('data-health-primary','lean-mass');text(304,124,fmtFixed(v.fat,1)+' kg',{anchor:'end',size:20,tone:'amber',weight:700}).setAttribute('data-health-primary','fat-mass');}return next;
  }
  function guide(d){return bodyTools.has(key)?bodyPortrait(d):leanGuide(d);}

  function attributes(current,source){const names=source.getAttributeNames();for(const n of current.getAttributeNames())if(!names.includes(n))current.removeAttribute(n);for(const n of names)if(current.getAttribute(n)!==source.getAttribute(n))current.setAttribute(n,source.getAttribute(n));}
  // Keep the live numeric and label text nodes, as in the stable 1RM path.
  function writeText(node,value){
    if(node.childNodes.length===1&&node.firstChild.nodeType===3){if(node.firstChild.nodeValue!==value)node.firstChild.nodeValue=value;}
    else if(node.textContent!==value||node.children.length)node.textContent=value;
  }
  function reconcile(parent,next){
    const incoming=Array.from(next.childNodes);incoming.forEach((source,i)=>{let current=parent.childNodes[i];if(!current||current.nodeType!==source.nodeType||current.nodeName!==source.nodeName){const copy=source.cloneNode(true);parent.insertBefore(copy,current||null);if(current)current.remove();current=copy;}if(source.nodeType===3){if(current.nodeValue!==source.nodeValue)current.nodeValue=source.nodeValue;return;}attributes(current,source);if(!source.children.length)writeText(current,source.textContent);else reconcile(current,source);});while(parent.childNodes.length>incoming.length)parent.lastChild.remove();
  }
  function prepare(raw){const data=model(raw);return{data,next:draw(data)};}
  function syncActions(ready){panel.dataset.calulerDiagramReady=String(ready);panel.querySelectorAll('.caluler-diagram-download,.caluler-diagram-print').forEach(n=>{n.disabled=!ready||n.getAttribute('aria-busy')==='true';n.setAttribute('aria-disabled',String(!ready));});}
  const macroModeName=mode=>mode==='protein'?'Protein target':'Calorie split';
  function syncMacroStatus(){
    if(!macroStatus)return;
    // Only mode metadata follows the selector; numerical data stays on its committed snapshot.
    const selected=document.getElementById('macroMode').value,shown=displayed?.mode||macroShownMode,previous=shown!==selected;
    const label=macroModeName(shown)+' · '+(displayed?(previous?'Previous mode':'Last calculated'):'Not calculated');
    if(macroStatus.textContent!==label)macroStatus.textContent=label;
    macroStatus.setAttribute('data-health-previous-mode',String(previous));
    macroStatus.setAttribute('aria-label',label+'. Selected mode: '+macroModeName(selected)+'. Press Calculate to update the diagram.');
  }
  function rememberMacro(data){
    if(!macroStates||!data)return;
    const state=macroStates.get(data.mode)||{};state.displayed=data;macroStates.set(data.mode,state);macroShownMode=data.mode;
  }
  let repMaxNodes=null;
  function updateRepMax(data){
    if(key!=='one-rep-max'||!data)return false;
    if(!repMaxNodes||!svg.contains(repMaxNodes.estimate)){
      const load=svg.querySelector('[data-health-rep-load]'),estimate=svg.querySelector('[data-health-rep-estimate]');
      if(!load||!estimate)return false;
      repMaxNodes={load,estimate,card:estimate.closest('.health-metric-card')};
    }
    const v=data.values,{load,estimate,card}=repMaxNodes;
    const describe=(n,s,tone)=>{if(!n.classList.contains('health-interactive'))hit(n,s,tone);else if(n.getAttribute('data-health-tip')!==s){n.setAttribute('data-health-tip',s);n.setAttribute('aria-label',s);}};
    writeText(load,fmt(v.weight,1)+' kg × '+fmt(v.reps,0));
    writeText(estimate,fmtFixed(v.estimate,1)+' kg');
    describe(load,metricTip('Supplied total load',v.weight,'kg')+'\nRepetitions = '+v.reps,'blue');
    describe(card,metricTip('Epley estimate',v.estimate,'kg'),'teal');
    const label=cfg[0]+' · calculated snapshot';if(svg.getAttribute('aria-label')!==label)svg.setAttribute('aria-label',label);
    return true;
  }
  function apply(prepared){
    // A fixed 1RM scene is mounted once. Counting changes text/accessible descriptions only.
    if(updateRepMax(prepared.data)){displayed=prepared.data;const ref=displayed.ref||cfg[4];if(note.textContent!==ref)note.textContent=ref;syncActions(true);refreshTip();return;}
    const labels=bodyLegend?bodyLabels(prepared.data):null,summary=bodySummarySvg?bodySummary(prepared.data):null,keyValues=bodyKey?bodyKeyValues(prepared.data):null,primary=bodyPrimary?bodyPrimaryValue(prepared.data):null;attributes(svg,prepared.next);reconcile(svg,prepared.next);if(labels)reconcile(bodyLegend,labels);if(summary){attributes(bodySummarySvg,summary);reconcile(bodySummarySvg,summary);}if(keyValues)reconcile(bodyKey,keyValues);if(primary)reconcile(bodyPrimary,primary);displayed=prepared.data;writeText(note,displayed?.ref||cfg[4]);rememberMacro(displayed);syncMacroStatus();syncActions(!!displayed);refreshTip();
  }
  function copyVisibleScene(){
    hideTip();const opaque=layers.findLastIndex(layer=>layer.alpha===1);if(opaque>=0){layers.splice(0,opaque).forEach(layer=>layer.node.remove());return;}
    const copy=scene.cloneNode(true);for(const n of [copy,...copy.querySelectorAll('[id]')])n.removeAttribute('id');copy.querySelectorAll('[tabindex]').forEach(n=>n.setAttribute('tabindex','-1'));copy.classList.add('health-motion-copy');copy.setAttribute('inert','');copy.setAttribute('aria-hidden','true');copy.setAttribute('data-caluler-diagram-export-ignore','');copy.style.opacity='1';stage.insertBefore(copy,layers[0]?.node||null);layers.unshift({node:copy,alpha:1,start:1});
  }
  function finishMotion(){cancelAnimationFrame(raf);raf=0;if(motion?.target)apply(motion.target);layers.splice(0).forEach(layer=>layer.node.remove());stage?.style.removeProperty('min-height');motion=null;if(panel)panel.dataset.calulerAnimating='false';}
  // Tween typed presentation values, not inputs to the scientific model. In particular,
  // changing integer repetitions must not force a fade or evaluate fractional reps.
  const outputFields={
    'ideal-weight':['reference'],'body-fat':['fat','lean'],macro:['grams','energy','protein'],
    'water-intake':['litres','ounces'],'heart-rate-recovery':['drop'],
    'lean-body-mass':['lean','fat','leanPercent','fatPercent'],
    'heart-rate-zone':['max','reserve','bounds'],'one-rep-max':['estimate'],'vo2-max':['vo2'],
    'body-surface-area':['area'],'waist-to-hip-ratio':['ratio'],
    'body-weight-change':['change','percent','weekly'],pace:['paceSeconds','speed'],
    'waist-to-height-ratio':['ratio'],'training-load':['load'],bmi:['bmi'],
    'fat-free-mass-index':['lean','fat','ffmi'],calorie:['bmr','tdee','target','exercise']
  };
  const discreteValues={'one-rep-max':['reps'],'heart-rate-zone':['age'],'body-weight-change':['days']};
  function baseline(to){
    const values={...to.values},zero=n=>Array.isArray(n)?n.map(zero):typeof n==='number'?0:n;
    for(const name of outputFields[key]||[])if(name in values)values[name]=zero(values[name]);
    if(key==='body-fat')values.lean=100;
    return{...to,values,geometryProgress:0};
  }
  function domains(d){
    const v=d.values;
    return{energy:Math.max(v.bmr||0,v.tdee||0,v.target||0,1),
      macro:Array.isArray(v.energy)?Math.max(v.energy.reduce((a,b)=>a+b,0),1):1,
      waist:Math.max(v.waist||0,v.hip||0,1)};
  }
  function morphable(from,to){return key!=='sleep'||Array.isArray(to?.values.options);}
  function frame(from,to,t){
    if(key==='sleep'){
      // Clock/date labels stay on the exact target. Only visual positions/paint tween.
      const a=from?.sleepVisual||sleepLayout(from),b=sleepLayout(to),sleepVisual={
        wakeX:blend(a.wakeX,b.wakeX,t),opacity:blend(a.opacity,b.opacity,t),
        rows:b.rows.map((row,i)=>Object.fromEntries(Object.entries(row).map(([name,n])=>[name,blend(a.rows[i][name],n,t)])))
      },data={...to,sleepVisual};
      return{data,next:draw(data)};
    }
    from=from||baseline(to);
    const base=baseline(to),old=from.values,values={},snap=discreteValues[key]||[];
    const numeric=(a,b)=>typeof a==='number'&&Number.isFinite(a)?blend(a,b,t):blend(0,b,t);
    for(const[name,target]of Object.entries(to.values)){
      const start=old[name]??base.values[name];
      values[name]=snap.includes(name)?target:Array.isArray(target)?target.map((n,i)=>numeric(start?.[i],n)):
        typeof target==='number'?numeric(start,target):target;
    }
    // Composition geometry follows the animated masses; no normalized full bar at zero.
    if(key==='lean-body-mass'||key==='fat-free-mass-index'){
      values.leanPercent=100*values.lean/values.weight;
      values.fatPercent=100*values.fat/values.weight;
    }
    const a=from.scales||domains(from),b=domains(to),scales={};
    for(const name of Object.keys(b))scales[name]=blend(a[name],b[name],t);
    // A first valid calculation grows a normalized graphic against its final domain.
    if(!(old.bmr>0))scales.energy=b.energy;
    if(!Array.isArray(old.energy)||!old.energy.some(n=>n>0))scales.macro=b.macro;
    const data={...to,values,scales,presentation:true,geometryProgress:blend(from.geometryProgress??1,1,t)};
    return{data,next:key==='one-rep-max'?null:draw(data)};
  }
  function animate(target,mode,from=displayed){
    cancelAnimationFrame(raf);const start=performance.now(),oldHeight=stage.getBoundingClientRect().height;
    if(mode==='fade'){copyVisibleScene();apply(target);}else apply(frame(from,target.data,0));layers.forEach(layer=>layer.start=layer.alpha);const height=Math.max(oldHeight,stage.getBoundingClientRect().height);if(height>0)stage.style.minHeight=height+'px';motion={target,from,mode,start};panel.dataset.calulerAnimating='true';
    const step=now=>{const current=motion;if(!current)return;const p=clamp((now-current.start)/duration,0,1),ease=(1-Math.cos(Math.PI*p))/2;if(p===1){finishMotion();return;}
      if(current.mode==='morph')try{apply(frame(current.from,current.target.data,ease));}catch(_){copyVisibleScene();apply(current.target);current.mode='fade';current.fadeStart=ease;layers.forEach(layer=>layer.start=layer.alpha);}
      const fade=current.fadeStart==null?ease:(ease-current.fadeStart)/(1-current.fadeStart);layers.forEach(layer=>{layer.alpha=layer.start*(1-fade);layer.node.style.opacity=String(layer.alpha);});raf=requestAnimationFrame(step);
    };raf=requestAnimationFrame(step);
  }
  function invalid(message){
    if(macroStates){warning.textContent=(message||'Complete the required values, then Calculate.')+(displayed?' Showing the last valid '+macroModeName(displayed.mode)+' diagram.':' No macro values have been calculated.');warning.setAttribute('data-health-mode',document.getElementById('macroMode').value);syncMacroStatus();}
    else warning.textContent=(message||'Complete the required values, then Calculate.')+(displayed?' The last valid diagram is retained.':' The illustration remains uncalculated.');
    warning.hidden=false;
  }
  function sameSnapshot(a,b){return !!a&&a.mode===b.mode&&a.ref===b.ref&&JSON.stringify(a.values)===JSON.stringify(b.values);}
  function commit(raw,initial=false){
    try{
      const target=prepare(raw),from=macroStates?(displayed?.mode===target.data.mode?displayed:macroStates.get(target.data.mode)?.displayed||null):displayed;
      if(macroStates){const state=macroStates.get(target.data.mode)||{};state.committed=target;macroStates.set(target.data.mode,state);}
      committed=target;warning.hidden=true;if(initial||reduced.matches){finishMotion();apply(target);return;}
      if(key!=='sleep'){
        // Duplicate Calculate clicks keep an active deadline; settled equal values do not tween.
        if(motion&&sameSnapshot(motion.target.data,target.data)){motion.target=target;syncMacroStatus();return;}
        if(!motion&&sameSnapshot(from,target.data)){apply(target);return;}
      }
      let mode=morphable(from,target.data)?'morph':'fade';if(mode==='morph')try{frame(from,target.data,.5);}catch(_){mode='fade';}animate(target,mode,from);
    }catch(error){invalid(error.message);}
  }
  function initialize(){if(displayed||edited)return;try{commit(collect(),true);}catch(_){/* Neutral source illustration already remains visible. */}if(!displayed)warning.hidden=true;}
  function hideTip(){active?.classList.remove('health-tip-active');active=null;dismissed=null;pointer=null;pinned=false;if(tip)tip.hidden=true;}
  function dismissTip(){const target=active||dismissed;hideTip();dismissed=target;}
  function tipTarget(node){const target=node?.closest?.('[data-health-tip]');return target&&panel.contains(target)&&!target.closest('.health-motion-copy')?target:null;}
  function refreshTip(){
    if(!active||!tip)return;if(!panel.contains(active)||layers.length||!displayed){hideTip();return;}writeText(tip,active.getAttribute('data-health-tip'));tip.hidden=false;active.classList.add('health-tip-active');tip.style.setProperty('--health-tip-color',colors[active.getAttribute('data-health-tone')]||colors.blue);
    const card=panel.getBoundingClientRect(),viewport=document.documentElement.clientWidth,reserved=Array.from(panel.children).filter(n=>/^H[1-6]$/.test(n.tagName)||n.classList.contains('health-caption')||n.classList.contains('caluler-diagram-export-actions')),headerBottom=Math.max(card.top,...reserved.map(n=>n.getBoundingClientRect().bottom)),left=Math.max(8,card.left+8),right=Math.min(viewport-8,card.right-8),top=Math.max(8,card.top+8,headerBottom+6),bottom=Math.min(window.innerHeight-8,card.bottom-8);
    tip.style.maxWidth=Math.max(1,Math.min(300,right-left))+'px';tip.style.maxHeight=Math.max(1,bottom-top)+'px';const box=tip.getBoundingClientRect(),anchor=active.getBoundingClientRect(),px=pointer?.x??anchor.left+anchor.width/2,py=pointer?.y??anchor.top,candidates=[[px+14,py-box.height-14],[px+14,py+18],[px-box.width-14,py-box.height-14],[anchor.right+12,anchor.top],[anchor.left-box.width-12,anchor.top]],fits=([x,y])=>x>=left&&x+box.width<=right&&y>=top&&y+box.height<=bottom,chosen=candidates.find(fits)||candidates[0];tip.style.left=clamp(chosen[0],left,Math.max(left,right-box.width))-card.left-panel.clientLeft+panel.scrollLeft+'px';tip.style.top=clamp(chosen[1],top,Math.max(top,bottom-box.height))-card.top-panel.clientTop+panel.scrollTop+'px';
  }
  function showTip(node,position=null,keep=false){if(!node||layers.length||node===dismissed)return;dismissed=null;if(active!==node)active?.classList.remove('health-tip-active');active=node;pointer=position;pinned=keep;refreshTip();}
  function setupTips(){
    tip=document.createElement('div');tip.className='health-tooltip';tip.id='caluler-health-tooltip';tip.setAttribute('role','tooltip');tip.setAttribute('data-caluler-diagram-export-ignore','');tip.hidden=true;panel.append(tip);let lastPointerType='';
    panel.addEventListener('pointerover',e=>{if(e.pointerType!=='touch')showTip(tipTarget(e.target),{x:e.clientX,y:e.clientY});});panel.addEventListener('pointermove',e=>{if(e.pointerType!=='touch'&&!tip.contains(e.target))showTip(tipTarget(e.target),{x:e.clientX,y:e.clientY});});
    panel.addEventListener('pointerout',e=>{if(dismissed&&!dismissed.contains(e.relatedTarget)&&!tip.contains(e.relatedTarget))dismissed=null;if(e.pointerType!=='touch'&&active&&!active.contains(e.relatedTarget)&&!tip.contains(e.relatedTarget))hideTip();});
    panel.addEventListener('focusin',e=>{const target=tipTarget(e.target);if(target){dismissed=null;showTip(target);}});panel.addEventListener('focusout',e=>{if(dismissed&&!dismissed.contains(e.relatedTarget))dismissed=null;if(active&&!active.contains(e.relatedTarget)&&!tip.contains(e.relatedTarget))hideTip();});
    panel.addEventListener('pointerdown',e=>{lastPointerType=e.pointerType;});panel.addEventListener('click',e=>{const target=tipTarget(e.target);if(!target){if(!tip.contains(e.target))hideTip();return;}dismissed=null;const touch=e.pointerType==='touch'||lastPointerType==='touch';if(touch&&active===target&&pinned)hideTip();else showTip(target,e.detail?{x:e.clientX,y:e.clientY}:null,touch);});
    panel.addEventListener('keydown',e=>{if(e.key==='Escape'){dismissTip();return;}const target=tipTarget(e.target);if(target&&(e.key==='Enter'||e.key===' ')){e.preventDefault();dismissed=null;showTip(target);}});
    tip.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch'&&!active?.contains(e.relatedTarget))hideTip();});document.addEventListener('pointerdown',e=>{if(!tipTarget(e.target)&&!tip.contains(e.target))hideTip();},true);document.addEventListener('keydown',e=>{if(e.key==='Escape')dismissTip();});window.addEventListener('scroll',e=>{if(!tip.contains(e.target))hideTip();},{passive:true,capture:true});window.addEventListener('resize',hideTip,{passive:true});
  }
  function normalizeGuide(original){
    const base=original.cloneNode(true);base.querySelectorAll('[data-health-dynamic],.health-hit').forEach(n=>n.remove());base.querySelectorAll('[data-health-tip]').forEach(n=>{n.classList.remove('health-interactive','health-tip-active');for(const a of n.getAttributeNames())if(a==='tabindex'||a==='role'||a.startsWith('data-health-')||a.startsWith('aria-'))n.removeAttribute(a);if(n.tagName.toLowerCase()==='g'&&!n.id){const parent=n.parentNode;while(n.firstChild)parent.insertBefore(n.firstChild,n);n.remove();}});const box=base.getAttribute('data-health-base-box')||base.getAttribute('viewBox');base.setAttribute('data-health-base-box',box);base.setAttribute('viewBox',box);base.querySelectorAll('title').forEach(n=>{const desc=document.createElementNS(NS,'desc');if(n.id)desc.id=n.id;desc.textContent=n.textContent;n.parentNode.replaceChild(desc,n);});return base;
  }
  function start(){
    const calculator=document.querySelector('.calculator');panel=calculator?.querySelector('.health-tool-diagram');if(!panel)return;const original=panel.querySelector('svg.health-diagram-illustration,svg.health-new-svg');if(!original)return;
    calculator.classList.add('health-premium-layout');panel.classList.add('health-premium-panel');panel.setAttribute('data-caluler-diagram-panel','health');panel.dataset.calulerAnimating='false';neutralSex=document.getElementById('gender')?.value||'male';if(preserved.has(key))guideBase=normalizeGuide(original);
    const content=bodyTools.has(key)?setupBodyView(original):original;stage=document.createElement('div');stage.className='health-motion-root';scene=document.createElement('div');scene.className='health-motion-scene';content.parentNode.insertBefore(stage,content);stage.append(scene);scene.append(content);svg=original;
    if(macroStates){macroShownMode=document.getElementById('macroMode').value;macroStatus=document.createElement('p');macroStatus.className='health-macro-status';macroStatus.setAttribute('role','status');macroStatus.setAttribute('aria-live','polite');scene.insertBefore(macroStatus,content);}
    note=panel.querySelector('.health-model-note')||document.createElement('p');note.className='health-model-note';scene.append(note);warning=document.createElement('p');warning.className='health-diagram-warning';warning.setAttribute('role','status');warning.setAttribute('aria-live','polite');warning.setAttribute('data-caluler-diagram-export-ignore','');warning.hidden=true;panel.append(warning);
    const caption=Array.from(panel.children).find(n=>n.tagName==='P');caption?.classList.add('health-caption');
    if(key==='sleep'){panel.classList.add('health-sleep-panel');if(caption)caption.textContent='Estimated bedtimes from your wake-up time.';}
    panel.querySelectorAll('figcaption').forEach(n=>n.hidden=true);setupTips();apply({data:null,next:draw(null)});
    form=formId?document.getElementById(formId):null;result=document.getElementById(cfg[2]);button=form?.querySelector('button[type="submit"]')||document.getElementById('calcBtn')||calculator.querySelector('button.btn');
    const onCalculate=()=>{try{const raw=collect();model(raw);if(!result?.querySelector('b,strong')){invalid('The calculator did not accept these values.');return;}commit(raw);}catch(error){invalid(error.message);}};
    if(form)form.addEventListener('submit',onCalculate);else button?.addEventListener('click',onCalculate);
    const controls=calculator.querySelector('.caluler-health-form')||form||calculator;controls.addEventListener('input',()=>{edited=true;});controls.addEventListener('change',()=>{edited=true;});controls.addEventListener('invalid',()=>invalid('Complete the required fields with valid values.'),true);
    if(macroStates)document.getElementById('macroMode').addEventListener('change',()=>{if(warning.getAttribute('data-health-mode')!==document.getElementById('macroMode').value)warning.hidden=true;syncMacroStatus();});
    // Enter takes exactly the same submit/click path as Calculate, before legacy key listeners.
    controls.addEventListener('keydown',e=>{if(e.key!=='Enter'||e.isComposing||!e.target?.matches('input,select'))return;e.preventDefault();e.stopImmediatePropagation();if(form)form.requestSubmit(button);else button?.click();},true);
    if(key==='body-fat'){const sex=document.getElementById('gender'),hip=document.getElementById('hip'),syncHip=()=>{const female=sex.value==='female';hip.closest('.field').hidden=!female;hip.required=female;};syncHip();sex.addEventListener('change',syncHip);}
    initialize();window.calulerDiagramExport?.discover?.();syncActions(!!displayed);requestAnimationFrame(()=>{initialize();syncActions(!!displayed);});
    reduced.addEventListener?.('change',()=>{if(reduced.matches)finishMotion();});window.addEventListener('pagehide',()=>{hideTip();finishMotion();});window.addEventListener('beforeprint',()=>{hideTip();finishMotion();});window.addEventListener('pageshow',()=>{finishMotion();initialize();});
  }
  window.calulerHealthDiagrams=Object.freeze({commit,initialize});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  function neutral(){
    if(key==='one-rep-max'){repMaxDiagram();return;}
    if(key==='bmi'){bmiBands(null);return;}
    if(key==='macro'){
      if(macroShownMode==='protein'){node(25,53,'Supplied body weight','— kg','blue',136);node(199,53,'Selected factor','— g/kg','amber',136);text(180,94,'×',{size:24});text(180,170,'— g/day',{size:25,weight:700,tone:'blue'});text(180,194,'Protein target',{size:14,tone:'muted'});}
      else for(const[label,x,tone]of [['Protein',25,'blue'],['Carbs',135,'teal'],['Fat',245,'amber']])node(x,58,label,'g',tone,90);
      return;
    }
    if(key==='water-intake'){el('path',{d:'M180 28 C166 55 135 83 135 115 A45 45 0 0 0 225 115 C225 83 194 55 180 28Z',fill:colors.blue,'fill-opacity':.07,stroke:colors.blue,'stroke-width':2});text(180,122,'Target (L)',{size:18});return;}
    if(key==='sleep'){sleepTimeline(null);return;}
    if(['heart-rate-recovery','body-weight-change','pace','vo2-max'].includes(key)){line(60,126,300,126);point(60,126);point(300,126,'teal');text(60,88,key==='pace'?'Distance':'Start',{size:16});text(300,88,key==='pace'?'Time':'Reading',{size:16});text(180,182,key==='vo2-max'?'12-minute test':key==='body-weight-change'?'Two supplied weights':'Supplied measurements',{size:16,tone:'muted'});return;}
    if(key==='heart-rate-zone'){pillBar(30,70,300,28,['blue','teal','amber','purple','rose'].map(tone=>({width:60,tone,opacity:.12})));for(let i=0;i<5;i++)text(60+i*60,123,'Z'+(i+1),{size:16});text(180,168,'Heart-rate reserve reference',{size:16,tone:'muted'});return;}
    if(key==='training-load'){node(27,58,'Duration','min','blue',130);node(203,58,'Session RPE','0–10','amber',130);text(180,99,'×',{size:25});return;}
    const labels=key==='ideal-weight'?['Adult height','Reference']:key==='body-surface-area'?['Height × weight','√(H × W / 3600)']:key==='one-rep-max'?['Load × reps','Epley model']:key==='fat-free-mass-index'?['Fat-free mass','Height²']:['Resting model','Activity / goal'];node(27,58,labels[0],'—','blue',130);node(203,58,labels[1],'—','teal',130);arrow(164,90,195,90);text(180,178,'Enter valid inputs, then Calculate',{size:15,tone:'muted'});
  }
  function bmiBands(v){
    const ranges=[[10,18.5,'Underweight','blue'],[18.5,25,'Healthy-weight reference','teal'],[25,30,'Overweight','amber'],[30,40,'Obesity reference','rose']],x=n=>30+(n-10)/30*300;
    pillBar(30,88,300,28,ranges.map(([lo,hi,label,tone])=>({width:x(hi)-x(lo),tone,tip:v?label+'\n'+(lo===10?'BMI <18.5':hi===40?'BMI ≥30':lo+' ≤ BMI <'+hi)+'\nAdult reference, not diagnosis':null})));
    for(const n of [10,18.5,25,30,40]){line(x(n),120,x(n),125);text(x(n),145,String(n),{size:14,tone:'muted',anchor:n===10?'start':n===40?'end':'middle',width:44});}
    if(v){const position=x(clamp(v.bmi,10,40));hit(point(position,77,'blue',6),metricTip('BMI',v.bmi,'kg/m²'));text(clamp(position,85,275),51,(v.bmi<10?'← ':'')+'BMI '+fmtFixed(v.bmi,1)+(v.bmi>40?' →':''),{size:24,weight:700,tone:'blue',width:180});const category=v.bmi<18.5?'Underweight':v.bmi<25?'Normal weight':v.bmi<30?'Overweight':'Obese';text(180,166,'Category: '+category,{size:16,tone:'blue',weight:600}).setAttribute('data-health-primary','bmi-category');}text(180,189,'Adult (20+) reference · kg/m²',{size:13,tone:'muted'});
  }
  function draw(d){
    if(preserved.has(key))return guide(d);
    const next=document.createElementNS(NS,'svg');next.setAttribute('viewBox','0 0 360 '+(heights[key]||210));next.setAttribute('class','health-new-svg');next.setAttribute('role','img');next.setAttribute('aria-label',cfg[0]+(d?' · calculated snapshot':' · neutral illustration, no calculated values'));drawing=next;
    if(!d){neutral();return next;}
    const v=d.values;
    switch(key){
      case 'bmi':bmiBands(v);break;
      case 'ideal-weight':{
        const y=150-(v.height-120)/110*95;line(70,43,70,155);line(62,43,78,43);line(62,155,78,155);hit(point(70,y),metricTip('Supplied height',v.height,'cm'));text(70,185,fmt(v.height,1)+' cm',{size:18});arrow(115,98,162,98);hit(node(180,64,'Devine-style reference',fmtFixed(v.reference,1)+' kg','teal',150),metricTip('Reference estimate',v.reference,'kg'));text(255,151,v.sex==='male'?'Male equation':'Female equation',{size:15,tone:'muted',width:150});break;
      }
      case 'macro':
        if(d.mode==='protein'){hit(node(25,53,'Supplied body weight',fmt(v.weight,1)+' kg','blue',136),metricTip('Weight',v.weight,'kg'));hit(node(199,53,'Selected factor',fmt(v.factor,2)+' g/kg','amber',136),metricTip('Selected factor',v.factor,'g/kg'),'amber');text(180,94,'×',{size:24});value(v.protein,'g/day','Protein target',170);}
        else{const total=v.percent.reduce((a,b)=>a+b,0),names=['Protein','Carbohydrates','Fat'],tones=['blue','teal','amber'];pillBar(30,72,300,32,v.percent.map((p,i)=>({width:300*(d.scales?v.energy[i]/d.scales.macro:p/total),tone:tones[i],tip:names[i]+'\n'+metricTip('Selected fraction',p,'%')+'\n'+metricTip('Energy',v.energy[i],'kcal')+'\n'+metricTip('Mass',v.grams[i],'g')})));['Protein','Carbs','Fat'].forEach((label,i)=>{text(75+i*105,133,label,{size:16,tone:tones[i],weight:600,width:95});text(75+i*105,159,fmtFixed(v.grams[i],1)+' g',{size:19,tone:tones[i],width:95});});text(180,41,fmt(v.calories,0)+' kcal supplied target',{size:20,weight:650});}break;
      case 'water-intake':el('path',{d:'M101 26 C87 53 57 77 57 104 A44 44 0 0 0 145 104 C145 77 115 53 101 26Z',fill:colors.blue,'fill-opacity':.12,stroke:colors.blue,'stroke-width':2});hit(node(173,62,'Estimated daily fluid',fmtFixed(v.litres,2)+' L','blue',155),metricTip('Fluid starting estimate',v.litres,'L')+'\n'+metricTip('Equivalent US fluid ounces',v.ounces,'fl oz'));text(101,112,fmt(v.weight,1)+' kg',{size:17,width:80});text(180,173,'35 mL/kg model · target, not hydration level',{size:14,tone:'muted'});break;
      case 'heart-rate-recovery':case 'body-weight-change':{
        const recovery=key==='heart-rate-recovery',a=recovery?v.peak:v.start,b=recovery?v.after:v.current,lo=Math.min(a,b)*.9,hi=Math.max(a,b)*1.1,y=n=>145-(n-lo)/(hi-lo||1)*83;
        line(70,160,295,160);line(70,y(a),295,y(b),'muted',{'stroke-dasharray':'4 4'});hit(point(70,y(a),'amber',6),metricTip(recovery?'End-exercise HR':'Starting weight',a,recovery?'bpm':'kg'),'amber');hit(point(295,y(b),'blue',6),metricTip(recovery?'One-minute HR':'Current weight',b,recovery?'bpm':'kg'));text(70,y(a)-18,fmt(a,1)+(recovery?' bpm':' kg'),{size:18,weight:650,width:115});text(295,y(b)-18,fmt(b,1)+(recovery?' bpm':' kg'),{size:18,weight:650,width:115});text(70,184,recovery?'End exercise':'Day 0',{size:14,tone:'muted'});text(295,184,recovery?'1 minute':'Day '+fmt(v.days,0),{size:14,tone:'muted'});
        const difference=recovery?v.drop:v.change;hit(text(180,31,(difference>0?'+':'')+(recovery?fmtStable(difference,2):fmtFixed(difference,2))+(recovery?' bpm drop':' kg change'),{size:21,weight:700,tone:recovery?'teal':'blue'}),recovery?metricTip('Observed HR drop',v.drop,'bpm'):metricTip('Weight change',v.change,'kg')+'\n'+metricTip('Change',v.percent,'%')+'\n'+metricTip('Average weekly change',v.weekly,'kg/week'));break;
      }
      case 'heart-rate-zone':{
        const tones=['blue','teal','amber','purple','rose'];text(180,38,'Target zone ranges (bpm)',{size:19,weight:600});pillBar(30,65,300,26,v.bounds.slice(0,5).map((lo,i)=>({width:60,tone:tones[i],tip:['Zone '+(i+1),exact(lo)+'–'+exact(v.bounds[i+1])+' bpm','Rounded model: '+Math.round(lo)+'–'+Math.round(v.bounds[i+1])+' bpm'].join('\n')})));v.bounds.slice(0,5).forEach((lo,i)=>{const cx=60+i*60;text(cx,114,'Z'+(i+1),{size:16,tone:tones[i],weight:650});const range=text(cx,137,Math.round(lo)+'–',{size:17,tone:tones[i],weight:600,width:57});el('tspan',{x:cx,y:159},range).textContent=String(Math.round(v.bounds[i+1]));range.setAttribute('data-health-primary','zone-'+(i+1));range.setAttribute('aria-label','Zone '+(i+1)+': '+Math.round(lo)+'–'+Math.round(v.bounds[i+1])+' bpm');});hit(text(180,184,'HR reserve: '+fmtStable(v.reserve,1)+' bpm',{size:14,tone:'muted'}),metricTip('Resting HR',v.rest,'bpm')+'\n'+metricTip('Age-estimated maximum',v.max,'bpm'));break;
      }
      case 'one-rep-max':repMaxDiagram(v);break;
      case 'vo2-max':el('rect',{x:28,y:45,width:133,height:91,rx:42,fill:'none',stroke:colors.blue,'stroke-width':2});el('rect',{x:39,y:56,width:111,height:69,rx:32,fill:'none',stroke:colors.blue,'stroke-width':1,opacity:.4});text(94,86,'12 min',{size:22,weight:650,tone:'blue'});text(94,112,fmt(v.distance,0)+' m',{size:16,width:113});arrow(172,92,196,92);hit(node(209,57,'Estimated VO₂ max',fmtFixed(v.vo2,1),'teal',125),metricTip('Cooper estimate',v.vo2,'ml/kg/min'),'teal');text(272,149,'ml/kg/min',{size:16,tone:'muted'});break;
      case 'body-surface-area':hit(node(25,38,'Height',fmt(v.height,1)+' cm','blue',132),metricTip('Height',v.height,'cm'));hit(node(203,38,'Weight',fmt(v.weight,1)+' kg','amber',132),metricTip('Weight',v.weight,'kg'),'amber');text(180,79,'×',{size:23});text(180,133,'√(height × weight / 3600)',{size:17,tone:'muted'});value(v.area,'m²','Mosteller estimate',174,'teal',2);break;
      case 'pace':line(43,83,317,83,'blue',{'stroke-width':3});hit(point(43,83,'blue',6),'Start distance = 0 km');hit(point(317,83,'teal',6),metricTip('Total distance',v.distance,'km'),'teal');text(180,52,fmt(v.distance,2)+' km in '+fmt(v.minutes,1)+' min',{size:19,weight:600});{const seconds=Math.round(v.paceSeconds);hit(text(180,140,Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')+' min/km',{size:26,weight:700,tone:'blue'}),metricTip('Average speed',v.speed,'km/h')+'\nElapsed seconds per km = '+seconds);}break;
      case 'training-load':text(30,38,fmt(v.minutes,0)+' min × session RPE',{anchor:'start',size:19,weight:600});pillBar(30,79,300,22,Array.from({length:10},(_,i)=>({offset:i*30,width:30*clamp(v.rpe-i,0,1),tone:i<5?'blue':'amber'})));hit(point(30+30*v.rpe,69,'blue',5),metricTip('Selected RPE',v.rpe));text(30,128,'0',{size:14,tone:'muted'});text(330,128,'10',{size:14,tone:'muted'});value(v.load,'a.u.','Session load',171,'teal');break;
      case 'fat-free-mass-index':{
        const leanShare=v.leanPercent===undefined?1-v.fatPercent/100:v.leanPercent/100,fatShare=v.leanPercent===undefined?1-leanShare:v.fatPercent/100;pillBar(30,53,300,22,[{width:300*leanShare,tone:'blue',tip:metricTip('Fat-free mass',v.lean,'kg')},{width:300*fatShare,tone:'amber',tip:metricTip('Fat mass',v.fat,'kg')}]);text(180,33,'Estimated body composition',{size:16,tone:'muted'});text(30,98,'Fat-free',{anchor:'start',size:16,tone:'blue'});text(330,98,'Fat',{anchor:'end',size:16,tone:'amber'});hit(text(180,128,'÷ '+fmt(v.height*v.height,4)+' m² height²',{size:20}),metricTip('Height',v.height,'m'));value(v.ffmi,'kg/m²','Fat-free mass index',170,'teal',2);break;
      }
      case 'calorie':{
        if(v.exercise!==undefined){hit(node(24,40,'MET × body weight',fmt(v.met,2)+' × '+fmt(v.weight,1)+' kg','blue',148),metricTip('Selected MET',v.met)+'\n'+metricTip('Weight',v.weight,'kg'));hit(node(190,40,'Duration',fmt(v.minutes,1)+' min','amber',146),metricTip('Duration',v.minutes,'min'),'amber');value(v.exercise,'kcal','Gross exercise estimate',169,'teal');break;}
        const bars=[['BMR',v.bmr,'blue'],['TDEE',v.tdee,'teal'],...(v.goal==='maintenance'?[]:[['Selected target',v.target,'amber']])],max=d.scales?.energy||Math.max(...bars.map(b=>b[1]),1);
        bars.forEach(([label,n,tone],i)=>{
          const y=36+i*48,labelX=24,labelWidth=110;
          // A dedicated label gutter leaves 17 units before the track. Wrap the
          // longer target label instead of squeezing it towards the bar.
          const name=text(labelX,y+(label==='Selected target'?7:15),label==='Selected target'?'Selected ':label,{anchor:'start',size:16,tone,width:labelWidth});
          name.setAttribute('data-health-energy-label',label);
          if(label==='Selected target')el('tspan',{x:labelX,y:y+23},name).textContent='target';
          pillBar(151,y,179,20,[{width:179*n/max,tone,tip:metricTip(label,n,'kcal/day')}]);
          text(330,y+40,fmt(n,0)+' kcal/day',{anchor:'end',size:16,tone,width:175}).setAttribute('data-health-energy-value',label);
        });
        text(180,195,v.method==='mifflin'?'Mifflin–St Jeor':'Revised Harris–Benedict',{size:15,tone:'muted'});break;
      }
      case 'sleep':sleepTimeline(d);break;
    }
    return next;
  }
})();
