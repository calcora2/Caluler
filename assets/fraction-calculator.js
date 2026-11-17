/* Fraction arithmetic: one exact rational model for Calculate and initial diagrams. */
(function () {
  'use strict';
  if (window.calulerFractionModel) return;
  const operations = {
    add: {name:'addition', label:'Sum', symbol:'+'},
    subtract: {name:'subtraction', label:'Difference', symbol:'−'},
    multiply: {name:'multiplication', label:'Product', symbol:'×'},
    divide: {name:'division', label:'Quotient', symbol:'÷'}
  };
  const abs = n => n < 0n ? -n : n;
  function gcd(a,b) { a=abs(a); b=abs(b); while(b) [a,b]=[b,a%b]; return a||1n; }
  function rational(n,d=1n) {
    if (!d) throw new Error('Both fraction denominators must be nonzero.');
    if (d<0n) { n=-n; d=-d; }
    const g=gcd(n,d); return {n:n/g,d:d/g};
  }
  function parse(value) {
    const text=String(value??'').trim();
    if (!text || text.length>160) throw new Error('Enter a finite number in each fraction field.');
    const m=text.match(/^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:e([+-]?\d{1,3}))?$/i);
    if (!m || !Number.isFinite(Number(text))) throw new Error('Enter a finite number in each fraction field.');
    const decimals=m[3]??m[4]??'', exponent=Number(m[5]||0)-decimals.length;
    if (Math.abs(exponent)>450) throw new Error('These inputs exceed the supported fraction range.');
    const n=BigInt((m[2]||'0')+decimals)*(m[1]==='-'?-1n:1n);
    return exponent>=0?rational(n*10n**BigInt(exponent)):rational(n,10n**BigInt(-exponent));
  }
  const divide = (a,b) => rational(a.n*b.d,a.d*b.n);
  const exact = a => a.d===1n?String(a.n):a.n+'/'+a.d;
  function approximate(a) {
    if (!a.n) return 0;
    const n=String(abs(a.n)),d=String(a.d);
    const mantissa=s=>Number(s.slice(0,16))/10**(Math.min(16,s.length)-1);
    const value=Number(((a.n<0n?-1:1)*(mantissa(n)/mantissa(d)))+'e'+(n.length-d.length));
    if (!Number.isFinite(value)||value===0) throw new Error('These fractions exceed the finite diagram range.');
    return value;
  }
  function decimal(a,value) {
    if (value!==0 && Math.abs(value)<.0001) return value.toExponential(6);
    const numerator=abs(a.n)*10000n,whole=numerator/a.d+(numerator%a.d*2n>=a.d?1n:0n);
    const digits=String(whole).padStart(5,'0');
    return (a.n<0n&&whole?'-':'')+digits.slice(0,-4)+'.'+digits.slice(-4);
  }
  function evaluate(raw) {
    const operation=raw.operation||'add', op=operations[operation];
    if (!Object.prototype.hasOwnProperty.call(operations,operation)) throw new Error('Choose a supported fraction operation.');
    const [a,b,c,d]=['a','b','c','d'].map(id=>parse(raw[id]));
    const first=divide(a,b),second=divide(c,d);
    if (operation==='divide'&&!second.n) throw new Error('Cannot divide by a zero fraction. The second numerator must be nonzero.');
    let result;
    if (operation==='add'||operation==='subtract') result=rational(first.n*second.d+(operation==='add'?1n:-1n)*second.n*first.d,first.d*second.d);
    else if (operation==='multiply') result=rational(first.n*second.n,first.d*second.d);
    else result=divide(first,second);
    const value=approximate(result),magnitude=abs(result.n),whole=magnitude/result.d,remainder=magnitude%result.d;
    const mixed=whole&&remainder?(result.n<0n?'-':'')+whole+' '+remainder+'/'+result.d:'';
    const model={operation,name:op.name,label:op.label,symbol:op.symbol,aValue:approximate(first),bValue:approximate(second),aLabel:exact(first),bLabel:exact(second),value,exact:exact(result),mixed,decimal:decimal(result,value)};
    const rows=[['Exact fraction',model.exact],...(mixed?[['Mixed number',mixed]]:[]),['Decimal',model.decimal]];
    return {raw:{...raw,operation},fraction:model,html:rows.map(([label,value])=>label+': <b>'+value+'</b>').join('<br>')};
  }
  window.calulerFractionModel=Object.freeze({evaluate});
  const button=document.getElementById('calcBtn'),result=document.getElementById('result'),error=document.getElementById('fraction-error');
  if (!button||!result||!error) return;
  button.addEventListener('click',()=>{
    try {
      const raw={}; for (const id of ['a','b','c','d','operation']) raw[id]=document.getElementById(id).value;
      const snapshot=evaluate(raw); result.innerHTML=snapshot.html; error.hidden=true;
      window.calulerMathDiagrams?.commit(snapshot);
    } catch (e) { error.textContent=e.message||'Please check your fractions.'; error.hidden=false; }
  });
  // The Math form's single Enter handler delegates to this same Calculate button.
})();
