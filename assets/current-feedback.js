/* Shared ideal current/voltage feedback models. Explicit page domain; no hardware simulation. */
(function () {
  'use strict';
  const voltage = document.body?.dataset.feedbackDomain === 'voltage';
  const domain = voltage ? 'voltage' : 'current', prefix = voltage ? 'vf' : 'cf';
  const baseUnit = voltage ? 'V' : 'A', milliUnit = voltage ? 'mV' : 'mA';
  const gainKey = voltage ? 'Av' : 'Ai', inputKey = voltage ? 'inputV' : 'inputA';
  const outputKey = voltage ? 'outputV' : 'outputA', feedbackKey = voltage ? 'feedbackV' : 'feedbackA', errorKey = voltage ? 'errorV' : 'errorA';
  const finite = (value, field) => {
    if (value === null || value === undefined || String(value).trim() === '' || !Number.isFinite(Number(value))) {
      const error = new Error('Enter a finite number for ' + field + '.'); error.field = field; throw error;
    }
    return Number(value);
  };
  function calculate(values) {
    const gain = finite(values[gainKey],gainKey), beta = finite(values.beta,'beta'), input = finite(values.input,'input');
    if (![baseUnit,milliUnit].includes(values.unit)) throw new Error('Select '+baseUnit+' or '+milliUnit+' as the '+domain+' unit.');
    const inputSI = values.unit === milliUnit ? input / 1000 : input;
    const loopGain = gain * beta, denominator = 1 + loopGain;
    if (!Number.isFinite(loopGain) || (gain !== 0 && beta !== 0 && loopGain === 0) || (input !== 0 && inputSI === 0)) {
      throw new Error('These inputs exceed the reliable numeric range. Use smaller gains or a different '+domain+' unit.');
    }
    if (Math.abs(denominator) <= 32 * Number.EPSILON * Math.max(1,Math.abs(loopGain))) {
      throw new Error('1 + '+gainKey+' × β is zero or too close to zero for a reliable finite solution. Change '+gainKey+' or β.');
    }
    const closedGain = gain / denominator, outputSI = closedGain * inputSI, feedbackSI = beta * outputSI;
    // Algebraically input − feedback; division avoids cancellation at high loop gain.
    const errorSI = inputSI / denominator;
    if (![closedGain,outputSI,feedbackSI,errorSI].every(Number.isFinite) ||
        (gain !== 0 && closedGain === 0) || (closedGain !== 0 && inputSI !== 0 && outputSI === 0) ||
        (beta !== 0 && outputSI !== 0 && feedbackSI === 0) || (inputSI !== 0 && errorSI === 0)) {
      throw new Error('The calculated '+domain+' signals exceed the reliable numeric range. Adjust the gains or input.');
    }
    return Object.freeze({[gainKey]:gain,beta,[inputKey]:inputSI,loopGain,denominator,closedGain,[outputKey]:outputSI === 0 ? 0 : outputSI,[feedbackKey]:feedbackSI === 0 ? 0 : feedbackSI,[errorKey]:errorSI === 0 ? 0 : errorSI,unit:values.unit});
  }
  function format(value, digits = 10) {
    if (value === 0) return '0';
    if (Math.abs(value) >= 0.0001 && Math.abs(value) < 1e8) return value.toLocaleString('en-US', {maximumSignificantDigits: digits});
    const [mantissa, exponent] = value.toExponential(digits - 1).split('e');
    const superscript = {'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
    return Number(mantissa).toString().replace('-', '−') + ' × 10' + String(Number(exponent)).split('').map(c => superscript[c]).join('');
  }
  function formatSignal(value, unit, digits = 10) {
    const converted = unit === milliUnit ? value * 1000 : value;
    if (!Number.isFinite(converted) || (value !== 0 && converted === 0)) return format(value,digits)+' '+baseUnit;
    return format(converted,digits)+' '+unit;
  }
  function canInterpolate(a, b) {
    const dA = b[gainKey] - a[gainKey], dB = b.beta - a.beta, candidates = [0, 1];
    const quadratic = dA * dB, linear = a[gainKey] * dB + a.beta * dA;
    if (![dA, dB, quadratic, linear].every(Number.isFinite)) return false;
    if (quadratic !== 0) { const vertex = -linear / (2 * quadratic); if (vertex > 0 && vertex < 1) candidates.push(vertex); }
    const denominators = candidates.map(t => 1 + (a[gainKey] + dA * t) * (a.beta + dB * t));
    return denominators.every(d => Number.isFinite(d) && Math.abs(d) > 1e-10 && Math.sign(d) === Math.sign(a.denominator));
  }
  window[voltage ? 'calulerVoltageFeedback' : 'calulerCurrentFeedback'] = Object.freeze({calculate,...(voltage ? {formatVoltage:formatSignal} : {formatCurrent:formatSignal}),canInterpolate});
  function start() {
    const form = document.getElementById(domain+'-feedback-form'); if (!form) return;
    const panel = document.getElementById(domain+'-feedback-diagram'), result = document.getElementById('calcResult');
    let content = document.getElementById(prefix+'-result-values');
    if (!content) { content = document.createElement('div'); content.id = prefix+'-result-values'; result.appendChild(content); }
    const validation = document.getElementById(prefix+'-validation'), modelNote = document.getElementById(prefix+'-model-note');
    const controls = {[gainKey]:document.getElementById(prefix+gainKey),beta:document.getElementById(prefix+'Beta'),input:document.getElementById(prefix+'Input'),unit:document.getElementById(prefix+'Unit')};
    const gainReadout = document.getElementById(prefix+'-closed-gain');
    const fields = Object.fromEntries(['input','error','gain','output','beta','feedback'].map(key => [key, document.getElementById(prefix+'-value-'+key)]));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)'), storageKey = 'caluler:'+domain+'-feedback:committed:v1';
    const tracks = Array.from(panel.querySelectorAll('[data-cf-signal]')).map(node => ({node, offset: 0}));
    let displayed = null, committed = null, transition = null, raf = 0, lastTime = 0, visible = true;
    function signalRate(value) {
      if (value === 0) return 0;
      const magnitude = Math.log1p(Math.min(Number.MAX_VALUE, Math.abs(value) / 0.001));
      // Voltage polarity does not reverse the directed block-model signal path.
      return (voltage ? 1 : Math.sign(value)) * (8 + 24 * magnitude / (1 + magnitude));
    }
    function setValue(node, value, exact) {
      const textNode = node.querySelector('tspan'); textNode.textContent = value;
      node.querySelector('title').textContent = exact;
      textNode.style.fontSize = value.length > 14 ? '11px' : value.length > 11 ? '13px' : '15px';
      const width = Number(node.dataset.cfWidth || 84);
      textNode.removeAttribute('textLength'); textNode.removeAttribute('lengthAdjust');
      const measured = textNode.getComputedTextLength?.() || value.length * parseFloat(textNode.style.fontSize) * 0.6;
      if (measured > width) { textNode.setAttribute('textLength',String(width)); textNode.setAttribute('lengthAdjust','spacingAndGlyphs'); }
    }
    function paint(state) {
      displayed = state;
      for (const [key, value] of [['input',state[inputKey]],['error',state[errorKey]],['output',state[outputKey]],['feedback',state[feedbackKey]]]) {
        setValue(fields[key], formatSignal(value, state.unit, 5), formatSignal(value, state.unit, 15));
      }
      setValue(fields.gain, format(state[gainKey],5), gainKey+' = '+format(state[gainKey],15));
      setValue(fields.beta, format(state.beta, 5), 'β = ' + format(state.beta, 15));
      if (gainReadout) { gainReadout.textContent = format(state.closedGain,6)+' '+baseUnit+'/'+baseUnit; gainReadout.title = 'Af = '+gainKey+' / (1 + '+gainKey+' × β) = ' + format(state.closedGain,15)+' '+baseUnit+'/'+baseUnit; }
      modelNote.textContent = state.loopGain < 0
        ? 'Signed '+gainKey+' × β is negative: the subtraction loop is regenerative for these signs. Stability is not assessed.'
        : 'Schematic signals, not electron drift. Arrows define signed references; stability is not assessed.';
      panel.dataset.feedbackSign = state.loopGain < 0 ? 'regenerative-signs' : state.loopGain === 0 ? 'zero-loop-gain' : 'opposing-signs';
      tracks.forEach(track => { const value = state[track.node.dataset.cfSignal]; track.node.style.opacity = value === 0 || reduced.matches ? '0' : '.65'; track.node.dataset.direction = value === 0 ? 'stopped' : !voltage && value < 0 ? 'reverse' : 'forward'; track.node.dataset.polarity = value === 0 ? 'zero' : value < 0 ? 'negative' : 'positive'; });
    }
    function results(state) {
      content.replaceChildren();
      const loopRow = ['Loop gain '+gainKey+' × β',format(state.loopGain)], gainRow = ['Closed-loop '+domain+' gain',format(state.closedGain)+' '+baseUnit+'/'+baseUnit];
      const gainRows = voltage ? [loopRow,gainRow] : [gainRow,loopRow];
      for (const [label,value] of [...gainRows,['Output '+domain,formatSignal(state[outputKey],state.unit)],['Feedback '+domain,formatSignal(state[feedbackKey],state.unit)],['Error '+domain,formatSignal(state[errorKey],state.unit)]]) {
        const row = document.createElement('div'); row.className = 'caluler-result-pair';
        const name = document.createElement('span'); name.className = 'caluler-result-pair-label'; name.textContent = label + ':';
        const number = document.createElement('span'); number.className = 'caluler-result-pair-value'; number.textContent = value;
        row.append(name,number); content.appendChild(row);
      }
      result.classList.add('caluler-result-layout');
    }
    function schedule() { if (!raf && !document.hidden && visible && (transition || (displayed && !reduced.matches && tracks.some(t => displayed[t.node.dataset.cfSignal] !== 0)))) raf = requestAnimationFrame(tick); }
    function tick(now) {
      raf = 0; const seconds = Math.min(80, lastTime ? now - lastTime : 0) / 1000; lastTime = now;
      if (transition) {
        const p = Math.min(1, (now - transition.started) / 1800), ease = (1 - Math.cos(Math.PI * p)) / 2, {from,to} = transition;
        try { const next = p === 1 ? to : calculate({[gainKey]:from[gainKey]*(1-ease)+to[gainKey]*ease,beta:from.beta*(1-ease)+to.beta*ease,input:from[inputKey]*(1-ease)+to[inputKey]*ease,unit:baseUnit}); paint(Object.freeze({...next,unit:to.unit})); }
        catch (_) { paint(to); transition = null; }
        if (p === 1 || !transition) { transition = null; panel.dataset.calulerAnimating = 'false'; }
      }
      if (displayed && !reduced.matches) for (const track of tracks) {
        track.offset = (track.offset + seconds * signalRate(displayed[track.node.dataset.cfSignal])) % 48;
        track.node.style.strokeDashoffset = String(-track.offset);
      }
      schedule();
    }
    function commit(state, animate) {
      committed = state;
      if (animate && displayed && !reduced.matches && canInterpolate(displayed,state)) {
        transition = {from:displayed,to:state,started:performance.now()}; panel.dataset.calulerAnimating = 'true';
      } else { transition = null; panel.dataset.calulerAnimating = 'false'; paint(state); }
      schedule();
    }
    form.addEventListener('submit', event => {
      event.preventDefault(); Object.values(controls).forEach(node => node.removeAttribute('aria-invalid'));
      try {
        const state = calculate(Object.fromEntries(Object.entries(controls).map(([key,node]) => [key,node.value])));
        validation.hidden = true; results(state); commit(state,true);
        try { localStorage.setItem(storageKey,JSON.stringify({[gainKey]:state[gainKey],beta:state.beta,input:state[inputKey],unit:baseUnit,displayUnit:state.unit})); } catch (_) {}
      } catch (error) {
        validation.textContent = error.message; validation.hidden = false;
        if (controls[error.field]) { controls[error.field].setAttribute('aria-invalid','true'); controls[error.field].focus(); }
      }
    });
    let restored = null;
    try { const raw = JSON.parse(localStorage.getItem(storageKey)); if (raw) { const state = calculate(raw); restored = Object.freeze({...state,unit:[baseUnit,milliUnit].includes(raw.displayUnit)?raw.displayUnit:baseUnit}); } } catch (_) {}
    if (restored) { results(restored); commit(restored,false); }
    else {
      content.replaceChildren(); content.textContent = 'Enter your values and select Calculate.';
      try { commit(calculate(Object.fromEntries(Object.entries(controls).map(([key,node]) => [key,node.value]))),false); }
      catch (_) { modelNote.textContent = 'Enter valid values, then select Calculate to update this ideal block model.'; }
    }
    function resume() { if (raf) cancelAnimationFrame(raf); raf = 0; lastTime = 0; schedule(); }
    document.addEventListener('visibilitychange',resume);
    if (typeof IntersectionObserver !== 'undefined') new IntersectionObserver(entries => { visible = entries[0].isIntersecting; resume(); },{rootMargin:'100px'}).observe(panel);
    reduced.addEventListener?.('change',() => { if (committed) { transition = null; panel.dataset.calulerAnimating = 'false'; paint(committed); } resume(); });
    window.addEventListener('pageshow',resume);
    window.calulerDiagramExport?.discover();
  }
  // Run after the shared persistence and Result/action components have restored their DOM.
  if (document.readyState === 'complete') start(); else document.addEventListener('DOMContentLoaded',start,{once:true});
})();
