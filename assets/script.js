
const $ = (id)=>document.getElementById(id);
function show(id, html){ const el=$(id); if(el) el.innerHTML=html; }
function n(id){ return parseFloat($(id)?.value); }
function calculateAge(){
 const dob=$('dob').value; if(!dob) return show('result','Please select your date of birth.');
 const b=new Date(dob), t=new Date(); let y=t.getFullYear()-b.getFullYear(), m=t.getMonth()-b.getMonth(), d=t.getDate()-b.getDate();
 if(d<0){m--; d+=new Date(t.getFullYear(),t.getMonth(),0).getDate()} if(m<0){y--;m+=12}
 const days=Math.floor((t-b)/(1000*60*60*24));
 show('result',`You are <b>${y}</b> years, <b>${m}</b> months and <b>${d}</b> days old.<br>Total days lived: <b>${days.toLocaleString()}</b>`);
}
function calculateSleep(){
 const time=$('wake').value; if(!time) return show('result','Please choose wake-up time.');
 const [h,m]=time.split(':').map(Number); const wake=new Date(); wake.setHours(h,m,0,0);
 let out=[]; [6,5,4,3].forEach(c=>{let bed=new Date(wake.getTime()-c*90*60000-15*60000); out.push(`${c} cycles: <b>${bed.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</b>`)});
 show('result','Recommended bedtimes:<br>'+out.join('<br>'));
}
function calculateBMI(){
 const w=n('weight'), h=n('height')/100; if(!w||!h) return show('result','Please enter weight and height.');
 const bmi=w/(h*h); let s=bmi<18.5?'Underweight':bmi<25?'Normal weight':bmi<30?'Overweight':'Obese';
 show('result',`Your BMI is <b>${bmi.toFixed(1)}</b> — ${s}.`);
}
function calculateBMR(){
 const w=n('weight'), h=n('height'), age=n('age'), gender=$('gender').value; if(!w||!h||!age) return show('result','Please enter all values.');
 let bmr=10*w+6.25*h-5*age+(gender==='male'?5:-161);
 show('result',`Your estimated BMR is <b>${Math.round(bmr)}</b> calories/day.`);
}
function calculateCalorie(){
 const w=n('weight'), h=n('height'), age=n('age'), gender=$('gender').value, act=parseFloat($('activity').value); if(!w||!h||!age) return show('result','Please enter all values.');
 let bmr=10*w+6.25*h-5*age+(gender==='male'?5:-161), cal=bmr*act;
 show('result',`Maintenance calories: <b>${Math.round(cal)}</b>/day.<br>Weight loss target: <b>${Math.round(cal-500)}</b>/day.`);
}
function percentageCalc(){
 const part=n('part'), total=n('total'); if(isNaN(part)||isNaN(total)||total===0) return show('result','Please enter valid numbers.');
 show('result',`<b>${part}</b> is <b>${(part/total*100).toFixed(2)}%</b> of ${total}.`);
}
function gpaCalc(){
 let grades=document.querySelectorAll('.grade'), credits=document.querySelectorAll('.credit'), points=0, csum=0;
 grades.forEach((g,i)=>{let gr=parseFloat(g.value), cr=parseFloat(credits[i].value); if(!isNaN(gr)&&!isNaN(cr)){points+=gr*cr;csum+=cr}});
 if(!csum) return show('result','Enter at least one grade and credit.');
 show('result',`Your GPA is <b>${(points/csum).toFixed(2)}</b>.`);
}
function cgpaCalc(){
 const current=n('current'), completed=n('completed'), sem=n('sem'), semCredits=n('semCredits');
 if([current,completed,sem,semCredits].some(x=>isNaN(x))) return show('result','Please enter all values.');
 const cgpa=(current*completed+sem*semCredits)/(completed+semCredits);
 show('result',`Your new CGPA is <b>${cgpa.toFixed(2)}</b>.`);
}
function loanCalc(){
 const p=n('amount'), rate=n('rate')/100/12, months=n('months'); if(!p||isNaN(rate)||!months) return show('result','Please enter all values.');
 const pay= rate===0 ? p/months : p*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1);
 show('result',`Monthly payment: <b>${pay.toFixed(2)}</b><br>Total payment: <b>${(pay*months).toFixed(2)}</b><br>Total interest: <b>${(pay*months-p).toFixed(2)}</b>`);
}
const emiCalc=loanCalc;
function unitConvert(){
 const v=n('value'), type=$('type').value; if(isNaN(v)) return show('result','Enter value.');
 const map={'kg-lb':[v*2.20462,'lb'],'lb-kg':[v/2.20462,'kg'],'km-mi':[v*.621371,'miles'],'mi-km':[v/.621371,'km'],'cm-in':[v*.393701,'inches'],'in-cm':[v/.393701,'cm'],'c-f':[v*9/5+32,'°F'],'f-c':[(v-32)*5/9,'°C']};
 let r=map[type]; show('result',`Result: <b>${r[0].toFixed(2)} ${r[1]}</b>`);
}
function wordCounter(){
 const text=$('text').value.trim(), words=text?text.split(/\s+/).length:0, chars=text.length, noSpace=text.replace(/\s/g,'').length;
 show('result',`Words: <b>${words}</b><br>Characters: <b>${chars}</b><br>Characters without spaces: <b>${noSpace}</b>`);
}
function characterCounter(){ wordCounter(); }
function caseConverter(mode){
 let text=$('text').value; if(mode==='upper') text=text.toUpperCase(); if(mode==='lower') text=text.toLowerCase();
 if(mode==='title') text=text.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
 $('text').value=text; show('result','Text converted successfully.');
}
function timeCalc(){
 const start=$('start').value, end=$('end').value; if(!start||!end) return show('result','Enter both times.');
 let [sh,sm]=start.split(':').map(Number), [eh,em]=end.split(':').map(Number);
 let s=sh*60+sm,e=eh*60+em;if(e<s)e+=1440; let diff=e-s;
 show('result',`Difference: <b>${Math.floor(diff/60)} hours ${diff%60} minutes</b>`);
}
function dateCalc(){
 const start=$('start').value, end=$('end').value; if(!start||!end) return show('result','Choose both dates.');
 let d=Math.abs((new Date(end)-new Date(start))/(1000*60*60*24));
 show('result',`Difference: <b>${Math.round(d)}</b> days.`);
}
function discountCalc(){
 const price=n('price'), dis=n('discount'); if(isNaN(price)||isNaN(dis)) return show('result','Enter valid values.');
 const save=price*dis/100, final=price-save; show('result',`You save: <b>${save.toFixed(2)}</b><br>Final price: <b>${final.toFixed(2)}</b>`);
}
function marginCalc(){
 const cost=n('cost'), sell=n('sell'); if(isNaN(cost)||isNaN(sell)||sell===0) return show('result','Enter valid values.');
 const profit=sell-cost, margin=profit/sell*100, markup=profit/cost*100;
 show('result',`Profit: <b>${profit.toFixed(2)}</b><br>Margin: <b>${margin.toFixed(2)}%</b><br>Markup: <b>${markup.toFixed(2)}%</b>`);
}
function tipCalc(){
 const bill=n('bill'), tip=n('tip'), people=n('people')||1; if(isNaN(bill)||isNaN(tip)) return show('result','Enter valid values.');
 const tipAmt=bill*tip/100, total=bill+tipAmt; show('result',`Tip: <b>${tipAmt.toFixed(2)}</b><br>Total: <b>${total.toFixed(2)}</b><br>Per person: <b>${(total/people).toFixed(2)}</b>`);
}
function currencyCalc(){
 const amount=n('amount'), rate=n('rate'); if(isNaN(amount)||isNaN(rate)) return show('result','Enter amount and exchange rate.');
 show('result',`Converted amount: <b>${(amount*rate).toFixed(2)}</b><br><small>Manual rate converter. For live rates, add an API later.</small>`);
}
function searchTools(){
 const q=($('toolSearch')?.value||'').trim().toLowerCase();
 const cards=[...document.querySelectorAll('.tool-card')];
 let visible=0;
 cards.forEach(card=>{
   const hay=(card.dataset.tool||'').toLowerCase();
   const match=!q||hay.includes(q);
   card.style.display=match?'':'none';
   if(match) visible++;
 });
 const heading=$('toolsHeading');
 if(heading && q) heading.textContent=`Search results for “${q}”`;
 else if(heading) heading.textContent=`All ${cards.length} Tools`;
 const no=$('noResults');
 if(no) no.hidden=visible!==0;
}
document.querySelectorAll('.cat').forEach(btn => {
    btn.addEventListener('click', function () {

        document.querySelectorAll('.cat').forEach(item => {
            item.classList.remove('active');
        });

        this.classList.add('active');const heading=document.getElementById('toolsHeading');

if(this.textContent.includes('Health')){
    heading.innerHTML='❤️ Health Calculators';
}
else if(this.textContent.includes('Finance')){
    heading.innerHTML='💰 Finance Calculators';
}
else if(this.textContent.includes('Education')){
    heading.innerHTML='🎓 Education Tools';
}
else if(this.textContent.includes('Text')){
    heading.innerHTML='📝 Text Tools';
}
else if(this.textContent.includes('Conversion')){
    heading.innerHTML='🔄 Conversion Tools';
}
else{
    heading.textContent='All Tools';
}
    });
});

function toggleMenu() {
 const menu=document.getElementById('mobileMenu');
 const btn=document.querySelector('.menu-toggle');
 if(!menu) return;
 const open=menu.getAttribute('data-open') === 'true';
 const next=!open;
 menu.setAttribute('data-open', String(next));
 if(btn){
   btn.setAttribute('aria-expanded',String(next));
   btn.setAttribute('aria-label',next?'Close navigation':'Open navigation');
   btn.textContent=next?'✕':'☰';
 }
}

// Keep the mobile menu closed on every fresh page load.
(function(){
 const menu=document.getElementById('mobileMenu');
 const btn=document.querySelector('.menu-toggle');
 if(menu){ menu.setAttribute('data-open','false'); menu.classList.remove('active'); }
 if(btn){ btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-label','Open navigation'); btn.textContent='☰'; }
})();

document.addEventListener('click', function(e){
 const menu=document.getElementById('mobileMenu'), btn=document.querySelector('.menu-toggle');
 if(!menu || menu.getAttribute('data-open') !== 'true') return;
 if(!menu.contains(e.target) && !btn?.contains(e.target)){
   menu.setAttribute('data-open','false');
   btn?.setAttribute('aria-expanded','false');
   btn?.setAttribute('aria-label','Open navigation');
   if(btn) btn.textContent='☰';
 }
});

document.querySelectorAll('#mobileMenu a').forEach(function(link){
 link.addEventListener('click', function(){
   const menu=document.getElementById('mobileMenu');
   const btn=document.querySelector('.menu-toggle');
   menu?.setAttribute('data-open','false');
   menu?.classList.remove('active');
   btn?.setAttribute('aria-expanded','false');
   btn?.setAttribute('aria-label','Open navigation');
   if(btn) btn.textContent='☰';
 });
});

/* Professional home-page directory controls */
(function(){
  const heroSearch=document.getElementById('toolSearch');
  const dirSearch=document.getElementById('directorySearch');
  const cards=[...document.querySelectorAll('#tools .tool-card')];
  const buttons=[...document.querySelectorAll('.filter-btn')];
  const status=document.getElementById('directoryStatus');
  const heading=document.getElementById('toolsHeading');
  let activeFilter='All';

  function applyDirectory(){
    const q=(dirSearch?.value || heroSearch?.value || '').trim().toLowerCase();
    let visible=0;
    cards.forEach(card=>{
      const hay=(card.dataset.tool||'').toLowerCase();
      const cat=(card.dataset.category||'').toLowerCase();
      const matchesText=!q || hay.includes(q);
      const matchesCat=activeFilter==='All' || cat===activeFilter.toLowerCase();
      const show=matchesText && matchesCat;
      card.style.display=show?'':'none';
      if(show) visible++;
    });
    if(status) status.textContent=`Showing ${visible} of ${cards.length} tools`;
    if(heading){
      if(activeFilter!=='All' && !q) heading.textContent=activeFilter;
      else if(q) heading.textContent=`Search results for “${q}”`;
      else heading.textContent=`All ${cards.length} Tools`;
    }
    const no=document.getElementById('noResults');
    if(no) no.hidden=visible!==0;
  }

  window.searchTools=applyDirectory;

  heroSearch?.addEventListener('input',()=>{
    if(dirSearch) dirSearch.value=heroSearch.value;
    activeFilter='All';
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.filter==='All'));
    applyDirectory();
  });
  dirSearch?.addEventListener('input',()=>{
    if(heroSearch) heroSearch.value=dirSearch.value;
    applyDirectory();
  });
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
    activeFilter=btn.dataset.filter||'All';
    buttons.forEach(b=>b.classList.toggle('active',b===btn));
    applyDirectory();
    document.getElementById('tools')?.scrollIntoView({behavior:'smooth',block:'start'});
  }));

  document.querySelectorAll('.cat[data-jump-category]').forEach(cat=>cat.addEventListener('click',()=>{
    const target=cat.dataset.jumpCategory||'All';
    const match=buttons.find(b=>b.dataset.filter===target);
    if(match) match.click();
  }));

  applyDirectory();
})();

/* =========================
   Home-page math calculator
   ========================= */
(function(){
  const display=document.getElementById('calcDisplay');
  const exprEl=document.getElementById('calcExpression');
  const keys=document.getElementById('calcKeys');
  if(!display || !keys) return;
  let expression='';
  let memory=0;
  let justEvaluated=false;

  display.setAttribute('tabindex','-1');
  function render(){
    display.value=expression || '0';
    if(exprEl) exprEl.textContent=justEvaluated ? 'Result' : expression;
  }
  function cleanExpression(s){
    return s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
  }
  function validExpression(s){
    return /^[0-9+\-*/%.()\s]+$/.test(s);
  }
  function evaluate(){
    if(!expression) return;
    let s=cleanExpression(expression).replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
    if(!validExpression(s)) return;
    try{
      const value=Function('"use strict"; return ('+s+')')();
      if(!Number.isFinite(value)) throw new Error('Invalid result');
      expression=Number(value.toPrecision(12)).toString();
      justEvaluated=true;
      render();
    }catch(e){
      if(exprEl) exprEl.textContent='Invalid expression';
    }
  }
  function append(v){
    if(justEvaluated && /[0-9.(]/.test(v)) expression='';
    justEvaluated=false;
    if(v==='.'){
      const part=expression.split(/[+\-×÷()]/).pop();
      if(part.includes('.')) return;
      if(!part) v='0.';
    }
    if(/[+\-×÷]/.test(v) && !expression && v!=='−') return;
    const last=expression.slice(-1);
    if(/[+\-×÷]/.test(v) && /[+\-×÷]/.test(last)) expression=expression.slice(0,-1);
    expression+=v;
    render();
  }
  function clear(){expression='';justEvaluated=false;render();}
  function backspace(){if(justEvaluated){clear();return;} expression=expression.slice(0,-1);render();}
  function percent(){
    const m=expression.match(/(\d+(?:\.\d+)?)$/); if(!m) return;
    expression=expression.slice(0,-m[1].length)+(Number(m[1])/100); render();
  }
  function square(){
    if(!expression) return;
    try{const v=Number(Function('"use strict"; return ('+cleanExpression(expression)+')')()); if(!Number.isFinite(v)) throw 0; expression=String(v*v); justEvaluated=true; render();}catch(e){}
  }
  function sqrt(){
    if(!expression) return;
    try{const v=Number(Function('"use strict"; return ('+cleanExpression(expression)+')')()); if(v<0||!Number.isFinite(v)) throw 0; expression=String(Math.sqrt(v)); justEvaluated=true; render();}catch(e){}
  }
  function sign(){
    if(!expression) return;
    const m=expression.match(/(\d+(?:\.\d+)?)$/); if(!m) return;
    const start=expression.slice(0,-m[1].length);
    expression=start+(Number(m[1])*-1); render();
  }
  function memoryAction(type){
    let current=0;
    try{current=expression?Number(Function('"use strict"; return ('+cleanExpression(expression)+')')()):0;}catch(e){current=0;}
    if(type==='MC') memory=0;
    if(type==='MR'){expression=String(memory);justEvaluated=false;render();}
    if(type==='M+') memory+=current;
    if(type==='M−') memory-=current;
  }
  function press(k){
    if(k==='AC') return clear();
    if(k==='⌫') return backspace();
    if(k==='=') return evaluate();
    if(k==='%') return percent();
    if(k==='√') return sqrt();
    if(k==='x²') return square();
    if(k==='±') return sign();
    if(['MC','MR','M+','M−'].includes(k)) return memoryAction(k);
    if(k==='×'||k==='÷'||k==='+'||k==='−'||k==='('||k===')'||k==='.'||/^[0-9]$/.test(k)) return append(k);
  }
  keys.addEventListener('click',e=>{const b=e.target.closest('button[data-key]');if(b){press(b.dataset.key); b.blur();}});
  document.addEventListener('keydown',e=>{
    if(!document.body.classList.contains('home-page')) return;
    const tag=(e.target.tagName||'').toLowerCase();
    const isCalcDisplay=e.target && e.target.id==='calcDisplay';
    if(['textarea','select'].includes(tag) || (tag==='input' && !isCalcDisplay)) return;
    let k=e.key;
    if(/^[0-9]$/.test(k)||k==='.'||k==='('||k===')'){e.preventDefault();press(k);return;}
    if(k==='+'){e.preventDefault();press('+');return;}
    if(k==='-'){e.preventDefault();press('−');return;}
    if(k==='*'||k==='x'||k==='X'){e.preventDefault();press('×');return;}
    if(k==='/'){e.preventDefault();press('÷');return;}
    if(k==='%'){e.preventDefault();press('%');return;}
    if(k==='Enter'||k==='='){e.preventDefault();press('=');return;}
    if(k==='Backspace'){e.preventDefault();press('⌫');return;}
    if(k==='Escape'){e.preventDefault();press('AC');return;}
  });
  render();
})();
