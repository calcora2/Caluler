const calulerGetElement = (id)=>document.getElementById(id);
function show(id, html){ const el=calulerGetElement(id); if(el) el.innerHTML=html; }
function n(id){ return parseFloat(calulerGetElement(id)?.value); }
function calculateAge(){
 const dob=calulerGetElement('dob').value; if(!dob) return show('result','Please select your date of birth.');
 const b=new Date(dob), t=new Date(); let y=t.getFullYear()-b.getFullYear(), m=t.getMonth()-b.getMonth(), d=t.getDate()-b.getDate();
 if(d<0){m--; d+=new Date(t.getFullYear(),t.getMonth(),0).getDate()} if(m<0){y--;m+=12}
 const days=Math.floor((t-b)/(1000*60*60*24));
 show('result',`You are <b>${y}</b> years, <b>${m}</b> months and <b>${d}</b> days old.<br>Total days lived: <b>${days.toLocaleString()}</b>`);
}
function calculateSleep(){
 const time=calulerGetElement('wake').value; if(!time) return show('result','Please choose wake-up time.');
 const [h,m]=time.split(':').map(Number); const wake=new Date(); wake.setHours(h,m,0,0);
 let out=[]; [6,5,4,3].forEach(c=>{let bed=new Date(wake.getTime()-c*90*60000-15*60000); out.push(`${c} cycles: <b>${bed.toLocaleTimeString([], {hour:'numeric',minute:'2-digit',hour12:true})}</b>`)});
 show('result','Approximate bedtime options (sleep cycles vary):<br>'+out.join('<br>'));
}
function calculateBMI(){
 const w=n('weight'), heightCm=n('height'), h=heightCm/100;
 if(!Number.isFinite(w)||w<20||w>350||!Number.isFinite(heightCm)||heightCm<100||heightCm>230) return show('result','Enter weight from 20–350 kg and height from 100–230 cm.');
 const bmi=w/(h*h); let s=bmi<18.5?'Underweight':bmi<25?'Normal weight':bmi<30?'Overweight':'Obese';
 show('result','Your BMI is <b>'+bmi.toFixed(1)+'</b> — '+s+'.');
}
function calculateBMR(){
 const w=n('weight'), h=n('height'), age=n('age'), gender=calulerGetElement('gender').value; if(!w||!h||!age) return show('result','Please enter all values.');
 let bmr=10*w+6.25*h-5*age+(gender==='male'?5:-161);
 show('result',`Your estimated BMR is <b>${Math.round(bmr)}</b> calories/day.`);
}
function calculateCalorie(){
 const w=n('weight'), h=n('height'), age=n('age'), gender=calulerGetElement('gender').value, act=parseFloat(calulerGetElement('activity').value); if(!w||!h||!age) return show('result','Please enter all values.');
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
  const valueEl = calulerGetElement('value');
  const fromEl = calulerGetElement('from');
  const toEl = calulerGetElement('to');

  if (!valueEl || !fromEl || !toEl) {
    show('result', 'Converter controls could not be found.');
    return;
  }

  const raw = valueEl.value.trim();
  if (raw === '') {
    show('result', 'Enter a numeric value to convert.');
    return;
  }

  const value = Number(raw);
  if (!Number.isFinite(value)) {
    show('result', 'Enter a valid finite number.');
    return;
  }

  const units = {"mm":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Millimetres (mm)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"cm":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Centimetres (cm)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.01,"offset":0},"m":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Metres (m)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"km":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilometres (km)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000,"offset":0},"in":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Inches (in)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.0254,"offset":0},"ft":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Feet (ft)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.3048,"offset":0},"yd":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Yards (yd)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.9144,"offset":0},"mi":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Miles (mi)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1609.344,"offset":0},"mg":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Milligrams (mg)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1E-06,"offset":0},"g":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Grams (g)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"kg":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilograms (kg)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"tonne":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Metric tonnes (t)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000,"offset":0},"oz":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Ounces (oz)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.028349523125,"offset":0},"lb":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Pounds (lb)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.45359237,"offset":0},"stone":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Stones (st)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":6.35029318,"offset":0},"mm2":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Square millimetres (mm²)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1E-06,"offset":0},"cm2":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Square centimetres (cm²)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.0001,"offset":0},"m2":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Square metres (m²)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"km2":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Square kilometres (km²)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000000,"offset":0},"ha":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Hectares (ha)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":10000,"offset":0},"acre":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Acres","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":4046.8564224,"offset":0},"ft2":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Square feet (ft²)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.09290304,"offset":0},"ml":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Millilitres (mL)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1E-06,"offset":0},"litre":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Litres (L)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"m3":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Cubic metres (m³)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"usfloz":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"US fluid ounces","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":2.95735295625E-05,"offset":0},"uscup":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"US cups","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.0002365882365,"offset":0},"uspint":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"US pints","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.000473176473,"offset":0},"usquart":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"US quarts","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.000946352946,"offset":0},"usgal":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"US gallons","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.003785411784,"offset":0},"c":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Celsius (°C)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"f":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Fahrenheit (°F)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.55555555555555558,"offset":-32},"k":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kelvin (K)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":-273.15},"mps":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Metres per second (m/s)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"kmh":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilometres per hour (km/h)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.27777777777777779,"offset":0},"mph":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Miles per hour (mph)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.44704,"offset":0},"knot":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Knots (kn)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.51444444444444448,"offset":0},"millisecond":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Milliseconds (ms)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"second":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Seconds (s)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"minute":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Minutes (min)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":60,"offset":0},"hour":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Hours (h)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":3600,"offset":0},"day":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Days (d)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":86400,"offset":0},"week":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Weeks","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":604800,"offset":0},"julianyear":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Julian years (365.25 days)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":31557600,"offset":0},"bit":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Bits (bit)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"byte":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Bytes (B)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":8,"offset":0},"kb":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilobytes (kB, decimal)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":8000,"offset":0},"mb":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Megabytes (MB, decimal)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":8000000,"offset":0},"gb":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Gigabytes (GB, decimal)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":8000000000,"offset":0},"tb":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Terabytes (TB, decimal)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":8000000000000,"offset":0},"kib":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kibibytes (KiB, binary)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":8192,"offset":0},"mib":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Mebibytes (MiB, binary)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":8388608,"offset":0},"gib":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Gibibytes (GiB, binary)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":8589934592,"offset":0},"tib":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Tebibytes (TiB, binary)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":8796093022208,"offset":0},"pa":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Pascals (Pa)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"kpa":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilopascals (kPa)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000,"offset":0},"bar":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Bar","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":100000,"offset":0},"atm":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Standard atmospheres (atm)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":101325,"offset":0},"psi":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Pounds per square inch (psi)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":6894.757293168,"offset":0},"joule":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Joules (J)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"kj":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilojoules (kJ)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000,"offset":0},"cal":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Thermochemical calories (cal)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":4.184,"offset":0},"kcal":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilocalories (kcal)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":4184,"offset":0},"wh":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Watt-hours (Wh)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":3600,"offset":0},"kwh":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilowatt-hours (kWh)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":3600000,"offset":0},"btu":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"International BTU (BTU)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1055.05585262,"offset":0},"milliwatt":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Milliwatts (mW)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"watt":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Watts (W)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"kilowatt":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilowatts (kW)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000,"offset":0},"megawatt":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Megawatts (MW)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000000,"offset":0},"hp":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Mechanical horsepower (hp)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":745.69987158227025,"offset":0},"hz":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Hertz (Hz)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"khz":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilohertz (kHz)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000,"offset":0},"mhz":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Megahertz (MHz)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000000,"offset":0},"ghz":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Gigahertz (GHz)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000000000,"offset":0},"millinewton":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Millinewtons (mN)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"newton":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Newtons (N)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"kilonewton":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilonewtons (kN)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000,"offset":0},"lbf":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Pound-force (lbf)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":4.4482216152605,"offset":0},"dyn":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Dynes (dyn)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1E-05,"offset":0},"rad":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Radians (rad)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"deg":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Degrees (°)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.017453292519943295,"offset":0},"arcmin":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Arcminutes","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.00029088820866572158,"offset":0},"arcsec":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Arcseconds","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":4.84813681109536E-06,"offset":0},"revolution":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Revolutions","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":6.2831853071795862,"offset":0},"millivolt":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Millivolts (mV)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"volt":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Volts (V)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"kilovolt":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kilovolts (kV)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000,"offset":0},"microamp":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Microamperes (µA)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1E-06,"offset":0},"milliamp":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Milliamperes (mA)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"amp":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Amperes (A)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"kiloamp":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kiloamperes (kA)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000,"offset":0},"milliohm":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Milliohms (mΩ)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"ohm":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Ohms (Ω)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"kiloohm":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Kiloohms (kΩ)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000,"offset":0},"megaohm":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Megaohms (MΩ)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1000000,"offset":0},"picofarad":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Picofarads (pF)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1E-12,"offset":0},"nanofarad":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Nanofarads (nF)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1E-09,"offset":0},"microfarad":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Microfarads (µF)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1E-06,"offset":0},"millifarad":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Millifarads (mF)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"farad":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Farads (F)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"microhenry":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Microhenries (µH)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1E-06,"offset":0},"millihenry":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Millihenries (mH)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"henry":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Henries (H)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"microtesla":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Microteslas (µT)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1E-06,"offset":0},"millitesla":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Milliteslas (mT)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"tesla":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Teslas (T)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"gauss":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Gauss (G)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.0001,"offset":0},"microcoulomb":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Microcoulombs (µC)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1E-06,"offset":0},"millicoulomb":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Millicoulombs (mC)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":0.001,"offset":0},"coulomb":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Coulombs (C)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":1,"offset":0},"mah":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Milliampere-hours (mAh)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":3.6,"offset":0},"ah":{"group":"Length Mass Area Volume Temperature Speed Time Digital storage Pressure Energy Power Frequency Force Angle Voltage Current Resistance Capacitance Inductance Magnetic field Electric charge","label":"Ampere-hours (Ah)","baseLabel":"m kg m² m³ °C m/s s bit Pa J W Hz N rad V A Ω F H T C","factor":3600,"offset":0}};
  const groupByUnit = {"c":"Temperature","f":"Temperature","k":"Temperature","millisecond":"Time","second":"Time","minute":"Time","hour":"Time","day":"Time","week":"Time","julianyear":"Time","millinewton":"Force","newton":"Force","kilonewton":"Force","lbf":"Force","dyn":"Force","rad":"Angle","deg":"Angle","arcmin":"Angle","arcsec":"Angle","revolution":"Angle","millivolt":"Voltage","volt":"Voltage","kilovolt":"Voltage","microamp":"Current","milliamp":"Current","amp":"Current","kiloamp":"Current","milliohm":"Resistance","ohm":"Resistance","kiloohm":"Resistance","megaohm":"Resistance","picofarad":"Capacitance","nanofarad":"Capacitance","microfarad":"Capacitance","millifarad":"Capacitance","farad":"Capacitance","microhenry":"Inductance","millihenry":"Inductance","henry":"Inductance","microtesla":"Magnetic field","millitesla":"Magnetic field","tesla":"Magnetic field","gauss":"Magnetic field","microcoulomb":"Electric charge","millicoulomb":"Electric charge","coulomb":"Electric charge","mah":"Electric charge","ah":"Electric charge"};
  const baseLabels = {"Temperature":"°C","Time":"s","Force":"N","Angle":"rad","Voltage":"V","Current":"A","Resistance":"Ω","Capacitance":"F","Inductance":"H","Magnetic field":"T","Electric charge":"C"};

  const from = units[fromEl.value];
  const to = units[toEl.value];

  if (!from || !to || !groupByUnit[fromEl.value] ||
      !groupByUnit[toEl.value]) {
    show('result', 'Select valid source and target units.');
    return;
  }

  const fromGroup = groupByUnit[fromEl.value];
  const toGroup = groupByUnit[toEl.value];

  if (fromGroup !== toGroup) {
    show('result', 'Choose source and target units from the same category.');
    return;
  }

  const baseValue = (value + from.offset) * from.factor;

  if (!Number.isFinite(baseValue)) {
    show('result', 'Value is outside the supported numeric range.');
    return;
  }

  if (fromGroup === 'Temperature' && baseValue < -273.15 - 1e-9) {
    show('result', 'Temperature cannot be below absolute zero (-273.15 °C).');
    return;
  }

  const converted = baseValue / to.factor - to.offset;

  if (!Number.isFinite(converted)) {
    show('result', 'Conversion result is outside the supported numeric range.');
    return;
  }

  const fmt = n => Number(n.toPrecision(12)).toLocaleString(undefined, {
    maximumFractionDigits: 12,
    maximumSignificantDigits: 12
  });

  const formula = 'Base value = (input + (' + from.offset +
    ')) × ' + from.factor + '; result = base value ÷ ' +
    to.factor + ' − (' + to.offset + ').';

  const resultHtml =
    '<div><strong>Converted result:</strong> ' +
    fmt(value) + ' ' + from.label + ' = <strong>' +
    fmt(converted) + ' ' + to.label + '</strong></div>' +
    '<p><strong>Category:</strong> ' + fromGroup + '</p>' +
    '<p><strong>Base-unit equivalent:</strong> ' +
    fmt(baseValue) + ' ' + baseLabels[fromGroup] + '</p>' +
    '<p><strong>Calculation method:</strong> ' + formula + '</p>';

  show('result', resultHtml);
}
function wordCounter(){
 const text=calulerGetElement('text').value.trim(), words=text?text.split(/\s+/).length:0, chars=text.length, noSpace=text.replace(/\s/g,'').length;
 show('result',`Words: <b>${words}</b><br>Characters: <b>${chars}</b><br>Characters without spaces: <b>${noSpace}</b>`);
}
function characterCounter(){ wordCounter(); }
function caseConverter(mode){
 let text=calulerGetElement('text').value; if(mode==='upper') text=text.toUpperCase(); if(mode==='lower') text=text.toLowerCase();
 if(mode==='title') text=text.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
 calulerGetElement('text').value=text; show('result','Text converted successfully.');
}
function timeCalc(){
 const start=calulerGetElement('start').value, end=calulerGetElement('end').value; if(!start||!end) return show('result','Enter both times.');
 let [sh,sm]=start.split(':').map(Number), [eh,em]=end.split(':').map(Number);
 let s=sh*60+sm,e=eh*60+em;if(e<s)e+=1440; let diff=e-s;
 show('result',`Difference: <b>${Math.floor(diff/60)} hours ${diff%60} minutes</b>`);
}
function dateCalc(){
 const start=calulerGetElement('start').value, end=calulerGetElement('end').value; if(!start||!end) return show('result','Choose both dates.');
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
 const amount=n('amount'), rate=n('rate'), from=calulerGetElement('currencyFrom')?.value||'PKR', to=calulerGetElement('currencyTo')?.value||'USD';
 if(!Number.isFinite(amount)||amount<0||!Number.isFinite(rate)||rate<=0) return show('result','Enter a valid amount and a positive exchange rate.');
 show('result',`${amount.toLocaleString()} ${from} = <b>${(amount*rate).toLocaleString(undefined,{maximumFractionDigits:4})} ${to}</b><br><small>Manual rate: 1 ${from} = ${rate} ${to}. Rates are not live.</small>`);
}
function syncCurrencyRateLabel(){const from=calulerGetElement('currencyFrom')?.value||'PKR',to=calulerGetElement('currencyTo')?.value||'USD';if(calulerGetElement('rateFrom'))calulerGetElement('rateFrom').textContent=from;if(calulerGetElement('rateTo'))calulerGetElement('rateTo').textContent=to;}
document.addEventListener('DOMContentLoaded',()=>{['currencyFrom','currencyTo'].forEach(id=>calulerGetElement(id)?.addEventListener('change',syncCurrencyRateLabel));syncCurrencyRateLabel();});
function searchTools(){
 const q=(calulerGetElement('toolSearch')?.value||'').trim().toLowerCase();
 const cards=[...document.querySelectorAll('.tools-grid .tool-card')];
 let visible=0;
 cards.forEach(card=>{
   const hay=(card.dataset.tool||'').toLowerCase();
   const match=!q||hay.includes(q);
   card.style.display=match?'':'none';
   if(match) visible++;
 });
 const heading=calulerGetElement('toolsHeading');
 if(heading && q) heading.textContent=`Search results for “${q}”`;
 else if(heading) heading.textContent=`All ${cards.length} Tools`;
 const no=calulerGetElement('noResults');
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
  // The tools directory uses its own URL-aware filtering controller.
  // Avoid the older homepage controller resetting category selections.
  if (document.querySelector('.tools-directory-page')) return;

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
   Caluler homepage advanced calculator
   Safe recursive-descent math parser; no eval() or Function() execution.
   ========================= */
(function () {
  const root = document.getElementById('advancedCalculator');
  if (!root) return;

  const display = root.querySelector('#calcDisplay');
  const exprEl = root.querySelector('#calcExpression');
  const keys = root.querySelector('#calcKeys');
  const keypadArea = root.querySelector('#calcKeypadArea');
  const displayWrap = root.querySelector('#calcDisplayWrap');
  const toolbar = root.querySelector('#calcToolbar');
  const angleSelect = root.querySelector('#calcAngleMode');
  const memoryStatus = root.querySelector('#calcMemoryStatus');
  const programmerPanel = root.querySelector('#calcProgrammerPanel');
  const statisticsPanel = root.querySelector('#calcStatisticsPanel');
  const historyList = root.querySelector('#calcHistory');
  const historyCount = root.querySelector('#calcHistoryCount');
  const undoButton = root.querySelector('#calcUndo');
  const redoButton = root.querySelector('#calcRedo');
  const lcdLightButton = root.querySelector('#calcLcdLightToggle');

  if (!display || !exprEl || !keys) return;

  let expression = '';
  let cursorPos = 0;
  let lastTrackedExpression = '';
  let suppressUndoTracking = false;
  const undoStack = [];
  const redoStack = [];
  const MAX_EDIT_STATES = 100;
  let memory = 0;
  let lastAnswer = 0;
  let justEvaluated = false;
  let awaitingExponent = false;
  let currentMode = 'basic';
  let angleMode = 'deg';
  let statusMessage = '';
  const history = [];
  const MAX_HISTORY = 30;
  const MAX_EXPRESSION_LENGTH = 500;
  const MAX_TOKENS = 300;

  const KEY_SETS = {
    basic: [
      [['MC','memory'],['MR','memory'],['M+','memory'],['M−','memory'],['AC','clear']],
      [['(','paren'],[')','paren'],['%','percent'],['⌫','backspace'],['÷','operator']],
      [['7','number'],['8','number'],['9','number'],['×','operator'],['√','sqrt']],
      [['4','number'],['5','number'],['6','number'],['−','operator'],['x²','square']],
      [['1','number'],['2','number'],['3','number'],['+','operator'],['±','sign']],
      [['0','number wide'],['.','number'],['Ans','constant'],['=','equals']]
    ],
    scientific: [
      [['MC','memory'],['MR','memory'],['M+','memory'],['M−','memory'],['AC','clear'],['π','constant'],['e','constant']],
      [['sin','function'],['cos','function'],['7','number'],['8','number'],['9','number'],['÷','operator'],['log','function']],
      [['sin⁻¹','function'],['cos⁻¹','function'],['4','number'],['5','number'],['6','number'],['×','operator'],['ln','function']],
      [['tan','function'],['tan⁻¹','function'],['1','number'],['2','number'],['3','number'],['−','operator'],['√','sqrt']],
      [['sinh','function'],['cosh','function'],['0','number'],['.','number'],['±','sign'],['+','operator'],['∛','cbrt']],
      [['tanh','function'],['EXP','exp-entry'],['(','paren'],[')','paren'],['%','percent'],['⌫','backspace'],['1/x','reciprocal']],
      [['|x|','function'],['floor','function'],['ceil','function'],['round','function'],['log2','function'],['xʸ','power'],['x²','square']],
      [['Ans','constant'],['10ˣ','pow10'],['eˣ','exp'],['!','factorial'],['=','equals'],['x³','cube'],['ⁿ√','function']],
      [['a⁄b','fraction'],[',','comma'],['τ','constant'],['min','function'],['max','function'],['mod','function']]
    ]
  };

  const FUNCTION_NAMES = new Set([
    'sin','cos','tan','asin','acos','atan','atan2','sinh','cosh','tanh','asinh','acosh','atanh',
    'sqrt','cbrt','abs','floor','ceil','round','trunc','exp','pow10','ln','log','log2','pow','root','min','max','mod','fact'
  ]);

  function formatNumber(value) {
    if (!Number.isFinite(value)) throw new Error('The result is outside the supported numeric range.');
    if (Object.is(value, -0) || value === 0) return '0';
    const abs = Math.abs(value);
    if (abs >= 1e12 || abs < 1e-8) return value.toExponential(10).replace(/(?:\.0+|(?:(\.\d*?)0+))e/, '$1e').replace('e+', 'e');
    return Number(value.toPrecision(12)).toString();
  }

  function parseIntegerLiteral(text, base) {
    let source = String(text).trim();
    if (!source) throw new Error('Enter a whole number.');
    if (source.length > 4096) throw new Error('The value is too long to process.');
    let sign = 1n;
    if (source[0] === '-' || source[0] === '+') {
      if (source[0] === '-') sign = -1n;
      source = source.slice(1);
    }
    const prefixes = {2: /^0b/i, 8: /^0o/i, 16: /^0x/i};
    if (prefixes[base]) source = source.replace(prefixes[base], '');
    if (!source) throw new Error('Enter digits after the sign or base prefix.');
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let n = 0n;
    for (const char of source.toUpperCase()) {
      const digit = chars.indexOf(char);
      if (digit < 0 || digit >= base) throw new Error(`Digit “${char}” is not valid in base ${base}.`);
      n = n * BigInt(base) + BigInt(digit);
    }
    return sign * n;
  }

  function factorial(n) {
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires a non-negative whole number.');
    if (n > 170) throw new Error('Factorial is supported only up to 170! with standard numeric precision.');
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  function checked(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('That operation has no finite real-number result.');
    return value;
  }

  function callFunction(name, args) {
    const oneArg = () => {
      if (args.length !== 1) throw new Error(`${name}() requires one argument.`);
      return args[0];
    };
    const twoArgs = () => {
      if (args.length !== 2) throw new Error(`${name}() requires two arguments.`);
      return args;
    };
    const angleIn = value => angleMode === 'deg' ? value * Math.PI / 180 : value;
    const angleOut = value => angleMode === 'deg' ? value * 180 / Math.PI : value;
    const x = args[0];
    switch (name) {
      case 'sin': return checked(Math.sin(angleIn(oneArg())));
      case 'cos': return checked(Math.cos(angleIn(oneArg())));
      case 'tan': {
        const angle = angleIn(oneArg());
        if (Math.abs(Math.cos(angle)) < 1e-12) throw new Error('Tangent is undefined at this angle.');
        return checked(Math.tan(angle));
      }
      case 'asin': return checked(angleOut(Math.asin(oneArg())));
      case 'acos': return checked(angleOut(Math.acos(oneArg())));
      case 'atan': return checked(angleOut(Math.atan(oneArg())));
      case 'atan2': { const [a,b] = twoArgs(); return checked(angleOut(Math.atan2(a,b))); }
      case 'sinh': return checked(Math.sinh(oneArg()));
      case 'cosh': return checked(Math.cosh(oneArg()));
      case 'tanh': return checked(Math.tanh(oneArg()));
      case 'asinh': return checked(Math.asinh(oneArg()));
      case 'acosh': return checked(Math.acosh(oneArg()));
      case 'atanh': return checked(Math.atanh(oneArg()));
      case 'sqrt': { const a = oneArg(); if (a < 0) throw new Error('Square root requires a value of zero or greater.'); return checked(Math.sqrt(a)); }
      case 'cbrt': return checked(Math.cbrt(oneArg()));
      case 'abs': return checked(Math.abs(oneArg()));
      case 'floor': return checked(Math.floor(oneArg()));
      case 'ceil': return checked(Math.ceil(oneArg()));
      case 'round': return checked(Math.round(oneArg()));
      case 'trunc': return checked(Math.trunc(oneArg()));
      case 'exp': return checked(Math.exp(oneArg()));
      case 'pow10': return checked(Math.pow(10, oneArg()));
      case 'ln': { const a = oneArg(); if (a <= 0) throw new Error('Natural logarithm requires a value greater than zero.'); return checked(Math.log(a)); }
      case 'log': { const a = oneArg(); if (a <= 0) throw new Error('Logarithm requires a value greater than zero.'); return checked(Math.log10(a)); }
      case 'log2': { const a = oneArg(); if (a <= 0) throw new Error('Logarithm requires a value greater than zero.'); return checked(Math.log2(a)); }
      case 'pow': { const [a,b] = twoArgs(); return checked(Math.pow(a,b)); }
      case 'root': {
        const [a,n] = twoArgs();
        if (n === 0) throw new Error('The root index cannot be zero.');
        if (a < 0 && Number.isInteger(n) && Math.abs(n % 2) === 1) return checked(-Math.pow(-a, 1/n));
        if (a < 0) throw new Error('A negative value requires an odd integer root index.');
        return checked(Math.pow(a, 1/n));
      }
      case 'min': if (!args.length) throw new Error('min() needs at least one number.'); return checked(Math.min(...args));
      case 'max': if (!args.length) throw new Error('max() needs at least one number.'); return checked(Math.max(...args));
      case 'mod': { const [a,b] = twoArgs(); if (b === 0) throw new Error('Modulo by zero is undefined.'); return checked(a % b); }
      case 'fact': return factorial(oneArg());
      default: throw new Error(`Unknown function: ${name}().`);
    }
  }

  function evaluateMath(source) {
    const input = String(source || '').trim();
    if (!input) throw new Error('Enter a calculation first.');
    if (input.length > MAX_EXPRESSION_LENGTH) throw new Error('The expression is too long.');
    const normalized = input.replace(/[×]/g, '*').replace(/[÷]/g, '/').replace(/[−]/g, '-').replace(/π/g, 'pi');
    const tokens = [];
    let pos = 0;
    while (pos < normalized.length) {
      if (/\s/.test(normalized[pos])) { pos++; continue; }
      const tail = normalized.slice(pos);
      const number = tail.match(/^(?:(?:\d+\.?\d*)|(?:\.\d+))(?:[eE][+-]?\d+)?/);
      if (number) {
        const value = Number(number[0]);
        if (!Number.isFinite(value)) throw new Error('A numeric input is too large.');
        tokens.push({type:'number', value}); pos += number[0].length; continue;
      }
      const ident = tail.match(/^[A-Za-z_][A-Za-z_0-9]*/);
      if (ident) { tokens.push({type:'ident', value:ident[0].toLowerCase()}); pos += ident[0].length; continue; }
      const char = normalized[pos];
      if ('+-*/^()%!,'.includes(char)) { tokens.push({type:char, value:char}); pos++; continue; }
      throw new Error(`Unsupported character: “${char}”.`);
    }
    if (!tokens.length) throw new Error('Enter a calculation first.');
    if (tokens.length > MAX_TOKENS) throw new Error('The expression contains too many parts.');

    // Make products such as 2π, 3(4+5), and (2+1)(7-3) explicit.
    const expanded = [];
    const endsValue = t => t && (t.type === 'number' || t.type === ')' || t.type === '!' || t.type === '%'
      || (t.type === 'ident' && !FUNCTION_NAMES.has(t.value)));
    const startsValue = t => t && (t.type === 'number' || t.type === 'ident' || t.type === '(');
    for (let i = 0; i < tokens.length; i++) {
      const current = tokens[i];
      expanded.push(current);
      const next = tokens[i + 1];
      const functionCall = current.type === 'ident' && FUNCTION_NAMES.has(current.value) && next && next.type === '(';
      if (endsValue(current) && startsValue(next) && !functionCall) expanded.push({type:'*', value:'*'});
    }

    let index = 0;
    const peek = () => expanded[index];
    const consume = type => {
      const t = expanded[index];
      if (!t || t.type !== type) throw new Error('Check the operators and parentheses in your expression.');
      index++;
      return t;
    };
    const val = (value, percentLiteral=false) => ({value: checked(value), percentLiteral});

    function parseAdd() {
      let left = parseMultiply();
      while (peek() && (peek().type === '+' || peek().type === '-')) {
        const op = expanded[index++].type;
        const right = parseMultiply();
        const amount = right.percentLiteral ? left.value * right.value : right.value;
        left = val(op === '+' ? left.value + amount : left.value - amount);
      }
      return left;
    }
    function parseMultiply() {
      let left = parseUnary();
      while (peek() && ['*','/'].includes(peek().type)) {
        const op = expanded[index++].type;
        const right = parseUnary();
        if (op === '/' && right.value === 0) throw new Error('Division by zero is undefined.');
        left = val(op === '*' ? left.value * right.value : left.value / right.value);
      }
      return left;
    }
    function parseUnary() {
      if (peek() && (peek().type === '+' || peek().type === '-')) {
        const op = expanded[index++].type;
        const item = parseUnary();
        return val(op === '-' ? -item.value : item.value);
      }
      return parsePower();
    }
    function parsePower() {
      let left = parsePostfix();
      if (peek() && peek().type === '^') {
        index++;
        const right = parseUnary();
        left = val(Math.pow(left.value, right.value));
      }
      return left;
    }
    function parsePostfix() {
      let item = parsePrimary();
      while (peek() && (peek().type === '%' || peek().type === '!')) {
        const op = expanded[index++].type;
        if (op === '%') item = val(item.value / 100, true);
        else item = val(factorial(item.value));
      }
      return item;
    }
    function parsePrimary() {
      const t = peek();
      if (!t) throw new Error('The expression ends too early.');
      if (t.type === 'number') { index++; return val(t.value); }
      if (t.type === '(') {
        index++;
        const inner = parseAdd();
        consume(')');
        return val(inner.value);
      }
      if (t.type === 'ident') {
        index++;
        const name = t.value;
        if (peek() && peek().type === '(') {
          if (!FUNCTION_NAMES.has(name)) throw new Error(`Unknown function: ${name}().`);
          index++;
          const args = [];
          if (!peek() || peek().type !== ')') {
            args.push(parseAdd());
            while (peek() && peek().type === ',') { index++; args.push(parseAdd()); }
          }
          consume(')');
          return val(callFunction(name, args.map(a => a.value)));
        }
        if (name === 'pi') return val(Math.PI);
        if (name === 'e') return val(Math.E);
        if (name === 'tau') return val(2 * Math.PI);
        if (name === 'ans') return val(lastAnswer);
        throw new Error(`Unknown value: ${name}.`);
      }
      throw new Error('Check the expression near the current operator.');
    }

    const result = parseAdd();
    if (index < expanded.length) {
      const token = expanded[index];
      if (token.type === ')') throw new Error('There is an extra closing parenthesis.');
      throw new Error('Check the expression and operators.');
    }
    return checked(result.value);
  }

  function setStatus(message) {
    statusMessage = message || '';
    if (exprEl) exprEl.textContent = statusMessage || (justEvaluated ? 'Result' : expression);
  }
  function updateEditControls() {
    if (undoButton) undoButton.disabled = undoStack.length === 0;
    if (redoButton) redoButton.disabled = redoStack.length === 0;
  }
  function render() {
    if (!suppressUndoTracking && expression !== lastTrackedExpression) {
      undoStack.push(lastTrackedExpression);
      if (undoStack.length > MAX_EDIT_STATES) undoStack.shift();
      redoStack.length = 0;
      lastTrackedExpression = expression;
    }
    display.value = expression || '0';
    cursorPos = Math.max(0, Math.min(cursorPos, expression.length));
    if (document.activeElement === display && typeof display.setSelectionRange === 'function') {
      try { display.setSelectionRange(cursorPos, cursorPos); } catch (_) {}
    }
    setStatus(statusMessage);
    if (memoryStatus) memoryStatus.textContent = `Memory: ${formatNumber(memory)}`;
    updateEditControls();
  }
  function clear() { expression = ''; cursorPos = 0; justEvaluated = false; awaitingExponent = false; statusMessage = ''; render(); }
  function backspace() {
    if (justEvaluated) return clear();
    if (cursorPos <= 0) return;
    expression = expression.slice(0, cursorPos - 1) + expression.slice(cursorPos);
    cursorPos--;
    awaitingExponent = /(?:\d+\.?\d*|\.\d+)e[+\-]?$/i.test(expression.slice(0, cursorPos));
    statusMessage = ''; render();
  }
  function append(value) {
    if (justEvaluated && (/^[0-9.]$/.test(value) || ['pi','π','tau','e','Ans','(', 'sqrt(', 'sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 'ln(', 'log(', 'cbrt(', 'abs(', 'exp('].includes(value))) {
      expression = ''; cursorPos = 0;
    }
    justEvaluated = false; statusMessage = '';
    let before = expression.slice(0, cursorPos);
    const after = expression.slice(cursorPos);
    if (value === '.') {
      const part = before.split(/[+\-×÷*/^()%!,]/).pop();
      if (part.includes('.')) return;
      if (!part || /[A-Za-z_]$/.test(part)) value = '0.';
    }
    if (['+','−','×','÷','^'].includes(value) && !before && !['−','+'].includes(value)) return;
    if (['+','−','×','÷','^'].includes(value) && /[+−×÷^]$/.test(before)) {
      if ((value === '−' || value === '+') && /[×÷^]$/.test(before)) {
        expression = before + value + after;
        cursorPos = before.length + value.length;
        render();
        return;
      }
      before = before.slice(0, -1);
    }
    expression = before + value + after;
    cursorPos = before.length + value.length;
    if (expression.length > MAX_EXPRESSION_LENGTH) {
      expression = expression.slice(0, MAX_EXPRESSION_LENGTH);
      cursorPos = Math.min(cursorPos, expression.length);
    }
    render();
  }
  function completeExpression(text) { return !!text && /(?:\d|pi|\be\b|ans|tau|\)|%|!)$/i.test(text.trim()); }
  function applyFunction(name) {
    statusMessage = '';
    if (expression && completeExpression(expression)) {
      expression = `${name}(${expression})`;
      justEvaluated = false;
    } else {
      if (justEvaluated) { expression = ''; cursorPos = 0; }
      expression += `${name}(`;
      justEvaluated = false;
    }
    cursorPos = expression.length;
    render();
  }
  function applyPower(power) {
    if (!expression) { setStatus('Enter a value before using a power.'); return; }
    expression = `(${expression})^${power}`;
    cursorPos = expression.length;
    justEvaluated = false; statusMessage = ''; render();
  }
  function applySign() {
    if (!expression) { expression = '-'; cursorPos = 1; justEvaluated = false; render(); return; }
    if (/^-\((.*)\)$/.test(expression)) expression = expression.match(/^-\((.*)\)$/)[1];
    else expression = `-(${expression})`;
    cursorPos = expression.length;
    justEvaluated = false; statusMessage = ''; render();
  }
  function applyNthRoot() {
    statusMessage = '';
    if (expression && completeExpression(expression)) expression = `root(${expression},`;
    else expression += 'root(';
    cursorPos = expression.length;
    justEvaluated = false;
    render();
  }
  function applyFraction() {
    statusMessage = '';
    if (expression && completeExpression(expression)) expression = `(${expression})/(`;
    else expression += '(';
    cursorPos = expression.length;
    justEvaluated = false;
    render();
  }
  function moveCursor(offset) {
    cursorPos = Math.max(0, Math.min(expression.length, cursorPos + offset));
    statusMessage = '';
    display.focus();
    render();
    try { display.setSelectionRange(cursorPos, cursorPos); } catch (_) {}
  }
  function undoEdit() {
    if (!undoStack.length) { setStatus('Nothing to undo.'); return; }
    redoStack.push(expression);
    expression = undoStack.pop();
    cursorPos = expression.length;
    lastTrackedExpression = expression;
    justEvaluated = false; awaitingExponent = false; statusMessage = 'Undo';
    suppressUndoTracking = true; render(); suppressUndoTracking = false;
    updateEditControls();
  }
  function redoEdit() {
    if (!redoStack.length) { setStatus('Nothing to redo.'); return; }
    undoStack.push(expression);
    expression = redoStack.pop();
    cursorPos = expression.length;
    lastTrackedExpression = expression;
    justEvaluated = false; awaitingExponent = false; statusMessage = 'Redo';
    suppressUndoTracking = true; render(); suppressUndoTracking = false;
    updateEditControls();
  }
  function addHistory(mode, source, resultValue) {
    history.unshift({mode, source, result:formatNumber(resultValue), value:resultValue});
    if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
    renderHistory();
  }
  function renderHistory() {
    historyList.replaceChildren();
    historyCount.textContent = String(history.length);
    if (!history.length) {
      const li = document.createElement('li'); li.className = 'calc-history-empty'; li.textContent = 'No calculations yet.'; historyList.append(li); return;
    }
    history.forEach(item => {
      const li = document.createElement('li');
      const copy = document.createElement('div'); copy.className = 'calc-history-copy';
      const source = document.createElement('code'); source.textContent = item.source;
      const result = document.createElement('strong'); result.textContent = item.result;
      const meta = document.createElement('small'); meta.textContent = item.mode.charAt(0).toUpperCase() + item.mode.slice(1);
      copy.append(source, result, meta);
      const use = document.createElement('button'); use.type = 'button'; use.className = 'calc-history-use'; use.textContent = 'Use result';
      use.addEventListener('click', () => { expression = String(item.value); cursorPos = expression.length; lastAnswer = item.value; justEvaluated = false; currentMode = 'basic'; setMode('basic'); statusMessage = 'History result recalled'; render(); });
      li.append(copy, use); historyList.append(li);
    });
  }
  function evaluate() {
    if (awaitingExponent) { setStatus('Complete the exponent after EXP before calculating.'); return; }
    if (!expression.trim()) { setStatus('Enter a calculation first.'); return; }
    const source = expression;
    try {
      const value = evaluateMath(source);
      lastAnswer = value;
      expression = formatNumber(value);
      cursorPos = expression.length;
      justEvaluated = true;
      statusMessage = `${source} =`;
      render(); addHistory(currentMode, source, value);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to calculate this expression.');
    }
  }
  function currentValue() {
    if (!expression.trim()) return 0;
    return evaluateMath(expression);
  }
  function memoryAction(action) {
    if (action === 'MC') { memory = 0; render(); setStatus('Memory cleared.'); return; }
    if (action === 'MR') { expression = formatNumber(memory); cursorPos = expression.length; justEvaluated = false; statusMessage = 'Memory recalled.'; render(); return; }
    try {
      const value = currentValue();
      memory = checked(action === 'M+' ? memory + value : memory - value);
      render(); setStatus(action === 'M+' ? 'Value added to memory.' : 'Value subtracted from memory.');
    } catch (error) { setStatus(error.message || 'Cannot use memory with this expression.'); }
  }
  function press(key) {
    if (key === 'AC') return clear();
    if (key === '⌫') return backspace();
    if (key === '=') return evaluate();
    if (['MC','MR','M+','M−'].includes(key)) return memoryAction(key);
    if (key === 'sqrt' || key === '√') return applyFunction('sqrt');
    if (key === 'ⁿ√') return applyNthRoot();
    if (key === 'a⁄b') return applyFraction();
    if (key === '←') return moveCursor(-1);
    if (key === '→') return moveCursor(1);
    if (key === 'cbrt' || key === '∛') return applyFunction('cbrt');
    const inverseFunctions = {'sin⁻¹':'asin','cos⁻¹':'acos','tan⁻¹':'atan'};
    if (inverseFunctions[key]) return applyFunction(inverseFunctions[key]);
    if (['sin','cos','tan','asin','acos','atan','ln','log','log2','abs','floor','ceil','round','trunc','sinh','cosh','tanh','asinh','acosh','atanh','min','max','mod'].includes(key)) return applyFunction(key);
    if (key === 'x²') return applyPower(2);
    if (key === 'x³') return applyPower(3);
    if (key === '±') return applySign();
    if (key === '10ˣ') return applyFunction('pow10');
    if (key === 'eˣ') return applyFunction('exp');
    if (key === '|x|') return applyFunction('abs');
    if (key === '1/x') {
      if (expression && completeExpression(expression)) expression = `1/(${expression})`;
      else expression = '1/(';
      cursorPos = expression.length;
      justEvaluated = false; statusMessage = ''; render(); return;
    }
    if (key === 'EXP') {
      if (!expression || !/[0-9.]$/.test(expression) || /(?:\d|\.)e[+\-]?\d*$/i.test(expression)) { setStatus('Enter a number before using EXP.'); return; }
      expression += 'e'; cursorPos = expression.length; awaitingExponent = true; justEvaluated = false; statusMessage = ''; render(); return;
    }
    if (key === '!') return append('!');
    if (key === 'Ans') return append('Ans');
    if (key === 'π') return append('π');
    if (key === 'e') return append('e');
    if (key === 'τ') return append('tau');
    if (key === 'xʸ') return append('^');
    if (key === 'AC') return clear();
    if (key === 'MC' || key === 'MR' || key === 'M+' || key === 'M−') return memoryAction(key);
    if (key === ',') return append(',');
    if (['(',')','%','÷','×','−','+','.'].includes(key) || /^[0-9]$/.test(key)) return append(key);
  }

  function renderKeypad(mode) {
    const mobileScientificRows = [
      [['MC','memory'],['MR','memory'],['M+','memory'],['M−','memory'],['AC','clear']],
      [['π','constant'],['e','constant'],['sin','function'],['cos','function'],['log','function']],
      [['sin⁻¹','function'],['cos⁻¹','function'],['tan','function'],['tan⁻¹','function'],['ln','function']],
      [['7','number'],['8','number'],['9','number'],['÷','operator'],['√','sqrt']],
      [['4','number'],['5','number'],['6','number'],['×','operator'],['1/x','reciprocal']],
      [['1','number'],['2','number'],['3','number'],['−','operator'],['x²','square']],
      [['0','number'],['.','number'],['±','sign'],['+','operator'],['∛','cbrt']],
      [['sinh','function'],['cosh','function'],['tanh','function'],['EXP','exp-entry'],['%','percent']],
      [['(','paren'],[')','paren'],['⌫','backspace'],['|x|','function'],['floor','function']],
      [['ceil','function'],['round','function'],['log2','function'],['xʸ','power'],['x³','cube']],
      [['Ans','constant'],['10ˣ','pow10'],['eˣ','exp'],['!','factorial'],['=','equals']],
      [['ⁿ√','function'],['a⁄b','fraction'],[',','comma'],['τ','constant'],['min','function']],
      [['max','function'],['mod','function']]
    ];
    const isMobileScientific = mode === 'scientific' &&
      window.matchMedia('(max-width: 600px)').matches;
    const rows = isMobileScientific
      ? mobileScientificRows
      : (KEY_SETS[mode] || KEY_SETS.basic);
    keys.replaceChildren();
    rows.flat().forEach(([label, type]) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = `calc-key ${type}`; button.textContent = label;
      button.setAttribute('aria-label', label);
      button.dataset.key = label;
      keys.append(button);
    });
  }

  // CALULER-MOBILE-SCIENTIFIC-NUMBER-ORDER-V29
  const scientificMobileQuery = window.matchMedia('(max-width: 600px)');
  if (scientificMobileQuery.addEventListener) {
    scientificMobileQuery.addEventListener('change', () => {
      if (currentMode === 'scientific') renderKeypad(currentMode);
    });
  }
  function setMode(mode) {
    currentMode = mode;
    root.dataset.mode = mode;
    root.querySelectorAll('[data-calc-mode]').forEach(button => {
      const active = button.dataset.calcMode === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
root.querySelectorAll('[data-calc-tool]').forEach(button => {
      const active = button.dataset.calcTool === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const isProgrammer = mode === 'programmer';
    const isStatistics = mode === 'statistics';
    displayWrap.hidden = isProgrammer || isStatistics;
    keypadArea.hidden = isProgrammer || isStatistics;
    toolbar.hidden = isProgrammer || isStatistics;
    programmerPanel.hidden = !isProgrammer;
    statisticsPanel.hidden = !isStatistics;
    if (!isProgrammer && !isStatistics) {
      renderKeypad(mode);
      angleSelect.disabled = mode === 'basic';
    }
  }

  undoButton.addEventListener('click', undoEdit);
  if (lcdLightButton) {
    lcdLightButton.addEventListener('click', () => {
      const enabled = root.classList.toggle('lcd-backlight-on');
      lcdLightButton.setAttribute('aria-pressed', String(enabled));

      const label = enabled
        ? 'Turn LCD backlight off'
        : 'Turn LCD backlight on';

      lcdLightButton.setAttribute('aria-label', label);
      lcdLightButton.title = label;
    });
  }
  redoButton.addEventListener('click', redoEdit);
  root.querySelector('#calcCursorLeft').addEventListener('click', () => moveCursor(-1));
  root.querySelector('#calcCursorRight').addEventListener('click', () => moveCursor(1));

  keys.addEventListener('click', event => {
    const button = event.target.closest('button[data-key]');
    if (!button) return;
    press(button.dataset.key);
  });
  root.querySelectorAll('[data-calc-mode]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.calcMode)));
  root.querySelectorAll('[data-calc-tool]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.calcTool)));
  angleSelect.addEventListener('change', () => { angleMode = angleSelect.value; setStatus(`Angle mode: ${angleMode.toUpperCase()}.`); });
  root.querySelector('#calcHistoryClear').addEventListener('click', () => { history.length = 0; renderHistory(); });

  function setPanelMessage(id, message, error=false) {
    const el = root.querySelector(id); el.textContent = message || ''; el.classList.toggle('is-error', !!error);
  }
  function formatBigInt(value, base, width=0) {
    let out = value.toString(base).toUpperCase();
    if (width) out = out.padStart(width, '0');
    return out;
  }
  function runProgrammer() {
    const aText = root.querySelector('#calcProgrammerA').value;
    const bText = root.querySelector('#calcProgrammerB').value;
    const base = Number(root.querySelector('#calcProgrammerBase').value);
    const bits = Number(root.querySelector('#calcProgrammerBits').value);
    const operation = root.querySelector('#calcProgrammerOperation').value;
    const resultEl = root.querySelector('#calcProgrammerResults');
    resultEl.replaceChildren(); setPanelMessage('#calcProgrammerMessage', '');
    try {
      const a = parseIntegerLiteral(aText, base);
      const widthLimit = 1n << BigInt(bits);
      const mask = widthLimit - 1n;
      const minSigned = -(1n << BigInt(bits - 1));
      const maxUnsigned = mask;
      const validateRange = (value, label) => {
        if (value < minSigned || value > maxUnsigned) throw new Error(`${label} must be between ${minSigned} and ${maxUnsigned} for ${bits}-bit input.`);
      };
      validateRange(a, 'Value A');
      const aBits = a < 0n ? widthLimit + a : a;
      let resultBits = aBits;
      if (operation !== 'convert' && operation !== 'not') {
        const b = parseIntegerLiteral(bText, base);
        if (operation === 'lshift' || operation === 'rshift') {
          if (b < 0n || b >= BigInt(bits)) throw new Error(`Shift amount must be from 0 to ${bits - 1}.`);
          resultBits = operation === 'lshift' ? (aBits << b) & mask : aBits >> b;
        } else {
          validateRange(b, 'Value B');
          const bBits = b < 0n ? widthLimit + b : b;
          if (operation === 'and') resultBits = aBits & bBits;
          else if (operation === 'or') resultBits = aBits | bBits;
          else if (operation === 'xor') resultBits = aBits ^ bBits;
        }
      } else if (operation === 'not') resultBits = (~aBits) & mask;
      resultBits &= mask;
      const signed = (resultBits & (1n << BigInt(bits - 1))) ? resultBits - widthLimit : resultBits;
      const lines = [
        ['Binary', formatBigInt(resultBits, 2, bits)],
        ['Octal', formatBigInt(resultBits, 8)],
        ['Decimal (unsigned)', resultBits.toString(10)],
        ['Decimal (signed)', signed.toString(10)],
        ['Hexadecimal', '0x' + formatBigInt(resultBits, 16, Math.ceil(bits / 4))]
      ];
      lines.forEach(([label, value]) => {
        const row = document.createElement('div'); row.className = 'calc-programmer-result-row';
        const name = document.createElement('span'); name.textContent = label;
        const output = document.createElement('code'); output.textContent = value;
        row.append(name, output); resultEl.append(row);
      });
      setPanelMessage('#calcProgrammerMessage', `${bits}-bit operation completed.`);
      // BigInt values can exceed Number's exact integer range; do not put them in numeric history.
    } catch (error) {
      setPanelMessage('#calcProgrammerMessage', error.message || 'Unable to process these values.', true);
    }
  }
  root.querySelector('#calcProgrammerRun').addEventListener('click', runProgrammer);
  root.querySelector('#calcProgrammerOperation').addEventListener('change', event => {
    const bLabel = root.querySelector('label[for="calcProgrammerB"]');
    bLabel.hidden = event.target.value === 'not' || event.target.value === 'convert';
  });
  root.querySelector('#calcProgrammerOperation').dispatchEvent(new Event('change'));

  function runStatistics() {
    const messageEl = root.querySelector('#calcStatsMessage');
    const resultsEl = root.querySelector('#calcStatsResults');
    resultsEl.replaceChildren(); setPanelMessage('#calcStatsMessage', '');
    const raw = root.querySelector('#calcStatsInput').value.trim();
    try {
      if (!raw) throw new Error('Enter at least one number.');
      const parts = raw.split(/[\s,;]+/).filter(Boolean);
      if (parts.length > 10000) throw new Error('Please enter no more than 10,000 values at a time.');
      const values = parts.map(part => {
        if (!/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/i.test(part)) throw new Error(`“${part}” is not a valid number.`);
        const n = Number(part); if (!Number.isFinite(n)) throw new Error('All values must be finite numbers.'); return n;
      });
      const sorted = [...values].sort((a,b)=>a-b);
      const sum = values.reduce((acc,n)=>acc+n,0);
      if (!Number.isFinite(sum)) throw new Error('The sum is outside the supported numeric range.');
      const mean = sum / values.length;
      const median = sorted.length % 2 ? sorted[(sorted.length-1)/2] : sorted[sorted.length/2-1] / 2 + sorted[sorted.length/2] / 2;
      const counts = new Map(); values.forEach(n=>counts.set(n,(counts.get(n)||0)+1));
      const highestFrequency = Math.max(...counts.values());
      const modes = highestFrequency > 1 ? [...counts.entries()].filter(([,count])=>count===highestFrequency).map(([n])=>n).sort((a,b)=>a-b) : [];
      const populationVariance = values.reduce((acc,n)=>acc+(n-mean)**2,0) / values.length;
      const sampleVariance = values.length > 1 ? values.reduce((acc,n)=>acc+(n-mean)**2,0) / (values.length-1) : null;
      const stats = [
        ['Count', String(values.length)], ['Sum', formatNumber(sum)], ['Mean', formatNumber(mean)],
        ['Median', formatNumber(median)], ['Mode', modes.length ? modes.map(formatNumber).join(', ') : 'No repeated mode'],
        ['Minimum', formatNumber(sorted[0])], ['Maximum', formatNumber(sorted[sorted.length-1])],
        ['Range', formatNumber(sorted[sorted.length-1] - sorted[0])],
        ['Population variance', formatNumber(populationVariance)], ['Population standard deviation', formatNumber(Math.sqrt(populationVariance))],
        ['Sample variance', sampleVariance === null ? 'Not defined for fewer than 2 values' : formatNumber(sampleVariance)],
        ['Sample standard deviation', sampleVariance === null ? 'Not defined for fewer than 2 values' : formatNumber(Math.sqrt(sampleVariance))]
      ];
      stats.forEach(([label,value]) => {
        const row = document.createElement('div'); row.className = 'calc-stat-row';
        const name = document.createElement('span'); name.textContent = label;
        const output = document.createElement('strong'); output.textContent = value;
        row.append(name, output); resultsEl.append(row);
      });
      setPanelMessage('#calcStatsMessage', `${values.length} value${values.length===1?'':'s'} analyzed.`);
      addHistory('statistics', `Statistics for ${values.length} values`, mean);
    } catch (error) { setPanelMessage('#calcStatsMessage', error.message || 'Unable to calculate these statistics.', true); }
  }
  root.querySelector('#calcStatsRun').addEventListener('click', runStatistics);
  root.querySelector('#calcStatsClear').addEventListener('click', () => {
    root.querySelector('#calcStatsInput').value = ''; root.querySelector('#calcStatsResults').replaceChildren(); setPanelMessage('#calcStatsMessage', '');
  });

  // Keyboard shortcuts work across the homepage, but never intercept typing in editable fields.
  document.addEventListener('keydown', event => {
    if (!document.body.classList.contains('home-page') || currentMode === 'programmer' || currentMode === 'statistics') return;
    const target = event.target;
    const tag = (target && target.tagName || '').toLowerCase();
    if (tag === 'textarea' || tag === 'select' || (tag === 'input' && target !== display) || (target && target.isContentEditable)) return;
    if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) redoEdit(); else undoEdit();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'y') {
      event.preventDefault(); redoEdit(); return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (tag === 'button' && ['Enter',' ','Spacebar'].includes(event.key)) return;
    const map = {'*':'×','/':'÷','-':'−','Enter':'=','=':'=','Backspace':'⌫','Delete':'DEL','Escape':'AC','ArrowLeft':'←','ArrowRight':'→'};
    const key = map[event.key] || event.key;
    if (/^[0-9]$/.test(key) || ['.','(',')',',','+','−','×','÷','%','=','⌫','DEL','AC','←','→'].includes(key)) {
      event.preventDefault();
      if (key === 'DEL') {
        if (cursorPos < expression.length) { expression = expression.slice(0, cursorPos) + expression.slice(cursorPos + 1); render(); }
      } else press(key);
    }
  });

  renderKeypad('basic');
  renderHistory();
  render();
  setMode('basic');
})();


/* Caluler shared controls: cross-page language persistence, automatic language switching, theme and mobile menu. */
(function(){
  const LANGS=['en','ur','ar','hi','es','fr','de','it','pt','ru','zh-CN','ja','ko','tr','id','bn','pa','fa','nl','ta'];
  const RTL_LANGS=new Set(['ur','ar','fa','pa']);
  const $id=id=>document.getElementById(id);
  function read(key,fallback){try{return localStorage.getItem(key)||fallback}catch(e){return fallback}}
  function write(key,value){try{localStorage.setItem(key,value)}catch(e){}}
  function setCookie(name,value,days,domain){
    let exp=''; if(days!==null) exp='; expires='+new Date(Date.now()+days*864e5).toUTCString();
    let cookie=name+'='+value+'; path=/; SameSite=Lax'+exp;
    if(domain) cookie+='; domain='+domain;
    try{document.cookie=cookie}catch(e){}
  }
  function setTranslateCookie(code){
    // Google Translate reads this cookie at document load, including on nested tool pages.
    const domains=[null,location.hostname,'.caluler.work','caluler.work'];
    domains.forEach(domain=>{
      if(code==='en'){
        setCookie('googtrans','',0,domain);
        setCookie('googtrans','/en/en',0,domain);
      }else setCookie('googtrans','/en/'+code,365,domain);
    });
  }
  function applyTheme(mode){
    const dark=mode==='dark'; document.documentElement.setAttribute('data-theme',dark?'dark':'light');
    document.documentElement.style.colorScheme=dark?'dark':'light';
    if(document.body) document.body.classList.toggle('dark-mode',dark);
    const btn=$id('calulerThemeToggle'); if(btn){if(!btn.querySelector('.theme-toggle-thumb')){btn.innerHTML='<span class="theme-toggle-icon theme-icon-sun" aria-hidden="true">☀</span><span class="theme-toggle-icon theme-icon-moon" aria-hidden="true">☾</span><span class="theme-toggle-thumb" aria-hidden="true"></span>';}btn.setAttribute('aria-pressed',String(dark));btn.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');btn.title=dark?'Switch to light mode':'Switch to dark mode'}
    write('caluler-theme',dark?'dark':'light');
  }
  function applyDirection(code){
    const rtl=RTL_LANGS.has(code);document.documentElement.setAttribute('dir',rtl?'rtl':'ltr');document.documentElement.setAttribute('lang',code);
    if(document.body)document.body.classList.toggle('caluler-rtl',rtl);
  }
  function setGoogleCombo(code){
    const combo=document.querySelector('.goog-te-combo'); if(!combo)return false;
    const target=code==='en'?'':code;
    if(combo.value!==target){combo.value=target;combo.dispatchEvent(new Event('change',{bubbles:true}))}
    return true;
  }
  function applyLanguage(code){
    if(!LANGS.includes(code))code='en';
    const previous=read('caluler-language','en');
    write('caluler-language',code); applyDirection(code);
    setTranslateCookie(code);
    // If Google Translate is already initialized, translate immediately without a reload.
    if(setGoogleCombo(code)) return;
    // Otherwise reload this same page once after saving the cookie. Google Translate reads it on load.
    // A session guard prevents repeated reloads if the third-party translation script is blocked.
    try{
      const stamp=code+':'+location.pathname;
      if(sessionStorage.getItem('caluler-lang-reload')===stamp){return;}
      sessionStorage.setItem('caluler-lang-reload',stamp);
    }catch(e){}
    setTimeout(()=>location.reload(),80);
  }
  function init(){
    const menu=$id('mobileMenu'),btn=document.querySelector('.menu-toggle');
    if(menu&&btn&&!btn.dataset.calulerBound){btn.dataset.calulerBound='1';btn.addEventListener('click',e=>{e.preventDefault();const open=menu.getAttribute('data-open')==='true';menu.setAttribute('data-open',String(!open));menu.classList.toggle('active',!open);btn.setAttribute('aria-expanded',String(!open));btn.textContent=open?'☰':'✕'});}
    if(menu){menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('data-open','false');menu.classList.remove('active');if(btn){btn.textContent='☰';btn.setAttribute('aria-expanded','false')}}))}
    applyTheme(read('caluler-theme','light'));
    const theme=$id('calulerThemeToggle');if(theme&&!theme.dataset.calulerBound){theme.dataset.calulerBound='1';theme.addEventListener('click',()=>applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'))}
    const lang=$id('calulerLanguage');const selected=read('caluler-language','en');applyDirection(selected);
    if(lang){lang.value=selected;if(!lang.dataset.calulerBound){lang.dataset.calulerBound='1';lang.addEventListener('change',()=>applyLanguage(lang.value))}}
    // Restore selected language on every page; Google Translate may initialize after this script.
    let tries=0;const timer=setInterval(()=>{
      tries++;const code=read('caluler-language','en');
      if(setGoogleCombo(code)){clearInterval(timer);try{sessionStorage.removeItem('caluler-lang-reload')}catch(e){}}
      else if(tries>=80)clearInterval(timer);
    },250);
  }
  window.calulerGoogleTranslateInit=function(){
    try{new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'ur,ar,hi,es,fr,de,it,pt,ru,zh-CN,ja,ko,tr,id,bn,pa,fa,nl,ta',autoDisplay:false,layout:google.translate.TranslateElement.InlineLayout.SIMPLE},'google_translate_element')}catch(e){}
    let tries=0;const timer=setInterval(()=>{tries++;const code=read('caluler-language','en');if(setGoogleCombo(code)){clearInterval(timer)}else if(tries>=80)clearInterval(timer)},250);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


/* CALULER-HEADER-REFINEMENT-V8 */
(function () {
  "use strict";

  if (window.__calulerHeaderV8Loaded) return;
  window.__calulerHeaderV8Loaded = true;

  const LANGUAGE_NATIVE_LABELS = Object.freeze({
    en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português',
    it: 'Italiano', 'zh-CN': '简体中文', ja: '日本語', ko: '한국어', ru: 'Русский',
    ar: 'العربية', hi: 'हिन्दी', ur: 'اردو', tr: 'Türkçe', id: 'Bahasa Indonesia',
    nl: 'Nederlands', bn: 'বাংলা', pa: 'ਪੰਜਾਬੀ', fa: 'فارسی', ta: 'தமிழ்'
  });

  function cleanLanguageLabel(option) {
    return LANGUAGE_NATIVE_LABELS[option.value] || option.value || 'Language';
  }

  function initLanguagePicker() {
    const select = document.getElementById('calulerLanguage');

    if (!select || select.dataset.calulerV8 === 'ready') return;

    const parent = select.parentElement;
    if (!parent) return;

    const picker = document.createElement('div');
    picker.className = 'caluler-language-picker';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'caluler-language-trigger notranslate';
    trigger.setAttribute('translate', 'no');
    trigger.setAttribute('aria-label', 'Choose language');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('div');
    menu.className = 'caluler-language-menu notranslate';
    menu.setAttribute('translate', 'no');
    menu.id = 'calulerLanguageMenu';
    menu.setAttribute('popover', 'manual');
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', 'Available languages');
    trigger.setAttribute('aria-controls', menu.id);

    const options = Array.from(select.options).filter(function (option) {
      return !option.disabled;
    });

    if (!options.length) return;

    function updateSelectedLabel() {
      const selected = options.find(function (option) {
        return option.value === select.value;
      }) || options[0];

      trigger.replaceChildren();

      const label = document.createElement('span');
      label.className = 'caluler-language-trigger-label notranslate';
      label.setAttribute('translate', 'no');
      label.textContent = cleanLanguageLabel(selected);
      trigger.appendChild(label);

      const arrow = document.createElement('span');
      arrow.className = 'caluler-language-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '▾';
      trigger.appendChild(arrow);
    }

    function closeMenu() {
      picker.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      if (typeof menu.hidePopover === 'function' && menu.matches(':popover-open')) {
        menu.hidePopover();
      }
    }

    let positionFrame = 0;
    function positionMenu() {
      if (!menu.classList.contains('is-open')) return;

      const triggerRect = trigger.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const viewportHeight = window.innerHeight;
      const edge = 10;
      const gap = 7;
      const width = Math.max(0, Math.min(246, viewportWidth - edge * 2));

      menu.style.setProperty('position', 'fixed', 'important');
      menu.style.setProperty('width', width + 'px', 'important');
      menu.style.setProperty('max-width', width + 'px', 'important');
      menu.style.setProperty('max-height', Math.max(0, viewportHeight - edge * 2) + 'px', 'important');

      const menuWidth = menu.getBoundingClientRect().width || width;
      const roomRight = viewportWidth - triggerRect.left - edge;
      const roomLeft = triggerRect.right - edge;
      let left;

      if (roomRight >= menuWidth) left = triggerRect.left;
      else if (roomLeft >= menuWidth) left = triggerRect.right - menuWidth;
      else if (roomRight >= roomLeft) left = triggerRect.left;
      else left = triggerRect.right - menuWidth;

      left = Math.max(edge, Math.min(left, viewportWidth - edge - menuWidth));

      const roomBelow = Math.max(0, viewportHeight - triggerRect.bottom - gap - edge);
      const roomAbove = Math.max(0, triggerRect.top - gap - edge);
      const desiredHeight = Math.min(menu.scrollHeight, 310);
      const openAbove = roomBelow < desiredHeight && roomAbove > roomBelow;
      const availableHeight = openAbove ? roomAbove : roomBelow;
      menu.style.setProperty('max-height', Math.min(310, availableHeight) + 'px', 'important');

      const menuHeight = menu.getBoundingClientRect().height;
      const top = openAbove ? triggerRect.top - gap - menuHeight : triggerRect.bottom + gap;
      menu.style.setProperty('left', left + 'px', 'important');
      menu.style.setProperty('right', 'auto', 'important');
      menu.style.setProperty('top', Math.max(edge, Math.min(top, viewportHeight - edge - menuHeight)) + 'px', 'important');
      menu.style.setProperty('bottom', 'auto', 'important');
    }

    function revealOption(item) {
      const menuRect = menu.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const safeTop = menuRect.top + menu.clientTop + 4;
      const safeBottom = menuRect.top + menu.clientTop + menu.clientHeight - 4;

      if (itemRect.top < safeTop) {
        menu.scrollTop -= safeTop - itemRect.top;
      } else if (itemRect.bottom > safeBottom) {
        menu.scrollTop += itemRect.bottom - safeBottom;
      }
    }

    function schedulePosition() {
      if (!menu.classList.contains('is-open') || positionFrame) return;
      positionFrame = window.requestAnimationFrame(function () {
        positionFrame = 0;
        positionMenu();
      });
    }

    options.forEach(function (option) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'caluler-language-option';
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', String(option.value === select.value));
      item.dataset.languageCode = option.value;

      const text = document.createElement('span');
      text.className = 'notranslate';
      text.setAttribute('translate', 'no');
      text.textContent = cleanLanguageLabel(option);
      item.appendChild(text);

      item.addEventListener('click', function () {
        select.value = option.value;

        // Preserve existing theme/translation integrations.
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));

        menu.querySelectorAll('.caluler-language-option').forEach(function (button) {
          button.setAttribute('aria-selected', String(button.dataset.languageCode === option.value));
        });

        updateSelectedLabel();
        closeMenu();
        trigger.focus();
      });

      menu.appendChild(item);
    });

    menu.addEventListener('keydown', function (event) {
      const key = event.key;
      if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Home' && key !== 'End') return;

      const items = Array.from(menu.querySelectorAll('.caluler-language-option'));
      if (!items.length) return;

      const current = items.indexOf(document.activeElement);
      const selected = items.findIndex(function (item) {
        return item.getAttribute('aria-selected') === 'true';
      });
      let next;

      if (key === 'Home') next = 0;
      else if (key === 'End') next = items.length - 1;
      else if (current < 0) next = selected >= 0 ? selected : (key === 'ArrowDown' ? 0 : items.length - 1);
      else next = (current + (key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;

      event.preventDefault();
      items[next].focus({ preventScroll: true });
      revealOption(items[next]);
    });

    picker.appendChild(trigger);
    picker.appendChild(menu);

    select.insertAdjacentElement('beforebegin', picker);
    select.hidden = true;
    select.setAttribute('aria-hidden', 'true');
    select.tabIndex = -1;
    select.dataset.calulerV8 = 'ready';

    trigger.addEventListener('click', function (event) {
      const open = !picker.classList.contains('is-open');

      document.querySelectorAll('.caluler-language-picker.is-open').forEach(function (other) {
        other.classList.remove('is-open');
        const otherTrigger = other.querySelector('.caluler-language-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        const otherMenu = other.querySelector('.caluler-language-menu');
        if (otherMenu) {
          otherMenu.classList.remove('is-open');
          if (typeof otherMenu.hidePopover === 'function' && otherMenu.matches(':popover-open')) otherMenu.hidePopover();
        }
      });

      picker.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      if (open) {
        menu.classList.add('caluler-viewport-menu');
        // Keep the popup outside the mobile drawer's overflow/scroll container.
        if (menu.parentElement !== document.body) document.body.appendChild(menu);
        if (typeof menu.showPopover === 'function') menu.showPopover();
        positionMenu();
        const selectedItem = menu.querySelector('.caluler-language-option[aria-selected="true"]');
        if (selectedItem) {
          if (event.detail === 0) selectedItem.focus({ preventScroll: true });
          revealOption(selectedItem);
        }
      } else if (typeof menu.hidePopover === 'function' && menu.matches(':popover-open')) {
        menu.hidePopover();
      }
    });

    trigger.addEventListener('keydown', function (event) {
      const key = event.key;
      if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Home' && key !== 'End') return;

      event.preventDefault();
      if (!picker.classList.contains('is-open')) trigger.click();

      const items = Array.from(menu.querySelectorAll('.caluler-language-option'));
      if (!items.length) return;
      const selected = items.findIndex(function (item) {
        return item.getAttribute('aria-selected') === 'true';
      });
      let index;
      if (key === 'Home') index = 0;
      else if (key === 'End') index = items.length - 1;
      else if (selected >= 0) index = (selected + (key === 'ArrowDown' ? 0 : -1) + items.length) % items.length;
      else index = key === 'ArrowDown' ? 0 : items.length - 1;
      items[index].focus({ preventScroll: true });
      revealOption(items[index]);
    });

    document.addEventListener('click', function (event) {
      if (!picker.contains(event.target) && !menu.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (menu.classList.contains('is-open')) {
          closeMenu();
          trigger.focus();
        }
      }
    });

    window.addEventListener('resize', schedulePosition, { passive: true });
    window.addEventListener('scroll', function (event) {
      // Scrolling the popup itself must not reposition or interrupt its scroll.
      if (menu.contains(event.target)) return;
      schedulePosition();
    }, { passive: true, capture: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', schedulePosition, { passive: true });
      window.visualViewport.addEventListener('scroll', schedulePosition, { passive: true });
    }
    if (window.MutationObserver) {
      new MutationObserver(schedulePosition).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['dir', 'lang']
      });
    }

    select.addEventListener('change', updateSelectedLabel);
    updateSelectedLabel();
  }

  function initDesktopMenu() {
    const nav = document.querySelector('.nav .nav-inner, .nav-inner');
    if (!nav || nav.dataset.calulerMenuV8 === 'ready') return;

    const navLinks = nav.querySelector('.nav-links');
    const utility = nav.querySelector('.caluler-utility-controls');

    if (!navLinks || !utility) return;

    const links = Array.from(navLinks.querySelectorAll('a'));
    const toolsLink = links.find(function (link) {
      return /^\s*tools(?:\s|$)/i.test((link.textContent || '').trim());
    });

    if (!toolsLink || links.length < 2) {
      console.warn('Caluler navigation links could not be reorganized safely.');
      return;
    }

    const menuLinks = links.filter(function (link) {
      return link !== toolsLink;
    });

    const siteMenu = document.createElement('div');
    siteMenu.className = 'caluler-site-menu';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'caluler-site-menu-trigger';
    trigger.setAttribute('aria-label', 'Open navigation menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');

    const icon = document.createElement('span');
    icon.className = 'caluler-menu-hamburger';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = '<span></span><span></span><span></span>';

    const caption = document.createElement('span');
    caption.className = 'caluler-menu-caption';
    caption.textContent = 'Menu';

    trigger.appendChild(icon);
    trigger.appendChild(caption);

    const panel = document.createElement('div');
    panel.className = 'caluler-site-menu-panel';
    panel.setAttribute('aria-label', 'More navigation links');

    menuLinks.forEach(function (link) {
      link.classList.add('caluler-menu-link');
      panel.appendChild(link);
    });

    navLinks.replaceChildren(toolsLink);
    navLinks.setAttribute('aria-label', 'Primary navigation');

    siteMenu.appendChild(trigger);
    siteMenu.appendChild(panel);

    nav.appendChild(siteMenu);

    function closeMenu() {
      siteMenu.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Open navigation menu');
    }

    trigger.addEventListener('click', function () {
      const open = !siteMenu.classList.contains('is-open');
      siteMenu.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute(
        'aria-label',
        open ? 'Close navigation menu' : 'Open navigation menu'
      );
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.setAttribute('role', 'menuitem');
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
      if (!siteMenu.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && siteMenu.classList.contains('is-open')) {
        closeMenu();
        trigger.focus();
      }
    });

    nav.dataset.calulerMenuV8 = 'ready';
  }

  function initialise() {
    initDesktopMenu();
    initLanguagePicker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})();

/* CALULER-ALL-NAV-LINKS-MENU-V9 */
(function () {
  "use strict";

  if (window.__calulerAllLinksMenuV9) return;
  window.__calulerAllLinksMenuV9 = true;

  function moveAllNavigationLinks() {
    const nav = document.querySelector('.nav .nav-inner, .nav-inner');

    if (!nav) return false;

    const panel = nav.querySelector('.caluler-site-menu-panel');
    const oldNav = nav.querySelector('.nav-links');

    if (!panel || !oldNav) return false;

    const links = Array.from(new Set([
      ...panel.querySelectorAll('a'),
      ...oldNav.querySelectorAll('a')
    ]));

    const required = [
      'tools.html',
      'about.html',
      'contact.html',
      'privacy.html'
    ];

    const hasLink = function (filename) {
      return links.some(function (link) {
        const href = (link.getAttribute('href') || '')
          .toLowerCase()
          .split(/[?#]/)[0];

        return href.endsWith(filename);
      });
    };

    if (!required.every(hasLink)) {
      console.error('Caluler navigation validation failed: required link missing.');
      return false;
    }

    links.forEach(function (link) {
      link.classList.add('caluler-menu-link');
      link.setAttribute('role', 'menuitem');
      panel.appendChild(link);

      if (!link.dataset.calulerV9Bound) {
        link.dataset.calulerV9Bound = '1';

        link.addEventListener('click', function () {
          const menu = link.closest('.caluler-site-menu');

          if (menu) {
            menu.classList.remove('is-open');

            const trigger = menu.querySelector(
              '.caluler-site-menu-trigger'
            );

            if (trigger) {
              trigger.setAttribute('aria-expanded', 'false');
              trigger.setAttribute(
                'aria-label',
                'Open navigation menu'
              );
            }
          }
        });
      }
    });

    panel.setAttribute('aria-label', 'All site navigation links');
    oldNav.remove();

    const trigger = nav.querySelector('.caluler-site-menu-trigger');

    if (trigger) {
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
    }

    return required.every(hasLink);
  }

  function retry(attempt) {
    if (moveAllNavigationLinks()) {
      console.info(
        'Caluler V9: Tools, About, Contact and Privacy are in the hamburger menu.'
      );
      return;
    }

    if (attempt < 40) {
      setTimeout(function () {
        retry(attempt + 1);
      }, 50);
    } else {
      console.error(
        'Caluler V9: menu could not be verified. Check the existing navigation.'
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(function () {
        retry(0);
      }, 0);
    }, { once: true });
  } else {
    retry(0);
  }
})();

/* CALULER-GOOGLE-TRANSLATE-REDIRECT-V10 */
(function () {
  "use strict";

  if (window.__calulerGoogleTranslateV10) return;
  window.__calulerGoogleTranslateV10 = true;

  function getSourcePage() {
    const siteBase = "https://caluler.work/";

    // Keep the actual public page URL when already online.
    if (
      location.protocol !== "file:" &&
      (location.hostname === "caluler.work" ||
       location.hostname.endsWith(".caluler.work"))
    ) {
      return location.href;
    }

    // Local HTML cannot itself be translated as a public website.
    // Map its project-relative path to the matching live page.
    if (location.protocol === "file:") {
      const path = decodeURIComponent(location.pathname)
        .replace(/\\/g, "/");

      const projectMarker = "/caluler/";
      const position = path.toLowerCase().lastIndexOf(projectMarker);

      const relativePath = position >= 0
        ? path.slice(position + projectMarker.length)
        : "index.html";

      return new URL(
        relativePath + location.search + location.hash,
        siteBase
      ).href;
    }

    return siteBase;
  }

  function init() {
    const select = document.getElementById("calulerLanguage");

    if (!select || select.dataset.googleTranslateV10 === "ready") {
      return;
    }

    select.dataset.googleTranslateV10 = "ready";

    select.addEventListener("change", function () {
      const selected = (select.value || "").trim();

      if (!selected) return;

      const knownCodes = {
        "en-gb": "en",
        "en-us": "en",
        "zh-cn": "zh-CN"
      };

      const target = knownCodes[selected.toLowerCase()] || selected;
      const sourceUrl = getSourcePage();

      // English is the original website language.
      if (target.toLowerCase() === "en") {
        window.location.assign(sourceUrl);
        return;
      }

      const translateUrl =
        "https://translate.google.com/translate" +
        "?js=n" +
        "&sl=auto" +
        "&tl=" + encodeURIComponent(target) +
        "&u=" + encodeURIComponent(sourceUrl);

      window.location.assign(translateUrl);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/* CALULER-RELATED-TOOLS-DARK-V12 */
(function () {
  "use strict";

  if (window.__calulerRelatedToolsV12) return;
  window.__calulerRelatedToolsV12 = true;

  function initialiseRelatedTools() {
    const headings = Array.from(
      document.querySelectorAll('h1,h2,h3,h4,h5,h6')
    );

    headings.forEach(function (heading) {
      const title = (heading.textContent || '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[:：]\s*$/, '');

      if (!/^related tools$/i.test(title)) return;

      // Find the nearest ancestor that contains the heading
      // and multiple related links, without styling the whole page.
      let panel = null;
      let node = heading.parentElement;

      for (let depth = 0; node && depth < 8; depth++) {
        const links = node.querySelectorAll(
          'a[href], button, [role="link"]'
        );

        if (links.length >= 3 &&
            node.querySelector('h1,h2,h3,h4,h5,h6') === heading) {
          panel = node;
          break;
        }

        node = node.parentElement;
      }

      if (!panel) {
        console.warn(
          'Caluler Related Tools: panel container could not be identified.'
        );
        return;
      }

      panel.classList.add('caluler-related-tools-v12');
      heading.classList.add('caluler-related-tools-heading-v12');

      panel.querySelectorAll(
        'a[href], button, [role="link"]'
      ).forEach(function (link) {
        link.classList.add('caluler-related-tool-link-v12');
      });
    });

    const panels = document.querySelectorAll('.caluler-related-tools-v12');

    console.info(
      'Caluler V12: Related Tools panels marked:',
      panels.length
    );

    return panels.length;
  }

  function run() {
    initialiseRelatedTools();
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      run,
      { once: true }
    );
  } else {
    run();
  }
})();

/* CALULER-FREE-TOOLS-BADGE-DARK-V13 */
(function () {
  "use strict";

  if (window.__calulerFreeToolsBadgeV13) return;
  window.__calulerFreeToolsBadgeV13 = true;

  function findBadge() {
    const all = Array.from(document.querySelectorAll('body *'));

    const exactBadge = /^\d+\s+tools\s*[·•\-–]\s*free to use$/i;

    function normalise(element) {
      return (element.innerText || element.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    const matching = all.filter(function (element) {
      return exactBadge.test(normalise(element));
    });

    const marked = new Set();

    matching.forEach(function (element) {
      let node = element;
      let target = element;

      // Prefer an existing badge/count/pill wrapper, if present.
      for (let depth = 0; node && depth < 5; depth++) {
        const identity = (
          (node.className && typeof node.className === 'string'
            ? node.className : '') +
          ' ' +
          (node.id || '')
        );

        if (/(badge|pill|count|tool-count|tools-count)/i.test(identity)) {
          target = node;
          break;
        }

        if (!node.parentElement) break;

        const parentText = normalise(node.parentElement);

        // Do not climb into a container containing unrelated content.
        if (parentText !== normalise(element)) break;

        target = node.parentElement;
        node = node.parentElement;
      }

      marked.add(target);
    });

    marked.forEach(function (element) {
      element.classList.add('caluler-free-tools-badge-v13');
    });

    if (marked.size) {
      console.info(
        'Caluler V13: free-tools badge styled:',
        marked.size
      );
    } else {
      console.warn(
        'Caluler V13: exact free-tools badge was not found on this page.'
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', findBadge, { once: true });
  } else {
    findBadge();
  }
})();

/* CALULER-HOMEPAGE-CARDS-DARK-V21 */
(function () {
  "use strict";

  if (window.__calulerHomepageCardsDarkV21) return;
  window.__calulerHomepageCardsDarkV21 = true;

  const popularNames = [
    "Percentage Calculator",
    "Age Calculator",
    "BMI Calculator",
    "Discount Calculator"
  ];

  const benefitNames = [
    "Free to Use",
    "Instant Results",
    "No Sign-up Required"
  ];

  function normalise(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function findTitle(name) {
    const elements = Array.from(
      document.querySelectorAll("h1,h2,h3,h4,h5,h6,strong,b")
    );

    return elements.filter(function (element) {
      return normalise(element.textContent) === name;
    });
  }

  function findCard(titleElement, name, isBenefit) {
    let current = titleElement.parentElement;
    let best = null;
    let bestScore = -1;

    for (let depth = 0; current && depth < 8; depth++) {
      const text = normalise(current.innerText || current.textContent);

      if (!text.includes(name) || text.length > 360) {
        current = current.parentElement;
        continue;
      }

      const hasDescription = Array.from(
        current.querySelectorAll("p")
      ).some(function (paragraph) {
        return normalise(paragraph.textContent).length > 0;
      });

      const iconNodes = Array.from(
        current.querySelectorAll("div,span,i,figure")
      ).filter(function (element) {
        const classes = typeof element.className === "string"
          ? element.className
          : "";

        const label = normalise(element.textContent);

        return /icon|emoji|symbol|check|feature-mark|benefit-mark/i.test(classes) ||
          (isBenefit && /^(✓|✔|☑)$/.test(label));
      });

      const classes = typeof current.className === "string"
        ? current.className
        : "";

      let score = 0;

      if (hasDescription) score += 5;
      if (iconNodes.length > 0) score += 5;
      if (/(card|popular|quick|tool|benefit|feature|item)/i.test(classes)) score += 4;
      if (current.matches("a,article,li")) score += 2;
      if (text.length < 240) score += 1;

      if (score > bestScore) {
        best = current;
        bestScore = score;
      }

      // Stop when the actual card appears to contain both
      // its description and icon.
      if (hasDescription && iconNodes.length > 0 && score >= 10) {
        break;
      }

      current = current.parentElement;
    }

    return best;
  }

  function markCard(titleElement, name, isBenefit) {
    const card = findCard(titleElement, name, isBenefit);

    if (!card) return false;

    card.classList.add(
      isBenefit
        ? "caluler-home-benefit-card-v21"
        : "caluler-home-popular-card-v21"
    );

    titleElement.classList.add(
      isBenefit
        ? "caluler-home-benefit-title-v21"
        : "caluler-home-popular-title-v21"
    );

    card.querySelectorAll("p").forEach(function (paragraph) {
      paragraph.classList.add("caluler-home-card-description-v21");
    });

    Array.from(
      card.querySelectorAll("div,span,i,figure")
    ).forEach(function (element) {
      const classes = typeof element.className === "string"
        ? element.className
        : "";

      const label = normalise(element.textContent);

      const hasIconClass =
        /icon|emoji|symbol|feature-mark|benefit-mark/i.test(classes);

      const isCheckMark =
        isBenefit && /^(✓|✔|☑)$/.test(label);

      if (hasIconClass || isCheckMark) {
        element.classList.add("caluler-home-card-icon-v21");
      }
    });

    return true;
  }

  function initialise() {
    // Do nothing on individual tool pages.
    if (!findTitle("Popular Calculators").length) return;

    let popularCount = 0;
    let benefitCount = 0;

    popularNames.forEach(function (name) {
      findTitle(name).forEach(function (element) {
        if (markCard(element, name, false)) popularCount++;
      });
    });

    benefitNames.forEach(function (name) {
      findTitle(name).forEach(function (element) {
        if (markCard(element, name, true)) benefitCount++;
      });
    });

    console.info(
      "Caluler V21 homepage card detection:",
      { popularCards: popularCount, benefitCards: benefitCount }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();

/* CALULER_HEALTH_LIVE_PREVIEW_RUNTIME_JS_START */
/* The preview heading is generated dynamically by inline calculator scripts.
   Tag its real rendered panel instead of trying to parse HTML inside JavaScript strings. */
(function () {
  'use strict';
  if (window.__calulerHealthLivePreviewThemeTagger) return;
  window.__calulerHealthLivePreviewThemeTagger = true;

  var markerText = 'LIVE DIAGRAM CALCULATION';
  var panelClass = 'health-diagram-live-preview';
  var titleClass = 'health-diagram-live-title';

  function normalise(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function visiblePanelAncestor(startNode) {
    var node = startNode;
    var fallback = null;
    var depth = 0;

    while (node && node !== document.body && depth < 7) {
      depth += 1;
      if (node.nodeType === 1 && node.classList) {
        if (node.classList.contains(panelClass)) return node;

        var rect = node.getBoundingClientRect();
        var style = window.getComputedStyle(node);
        var padding = parseFloat(style.paddingTop) || 0;
        var radius = parseFloat(style.borderTopLeftRadius) || 0;
        var borderWidth = parseFloat(style.borderTopWidth) || 0;
        var hasBorder = borderWidth > 0 && style.borderTopStyle !== 'none';
        var bg = style.backgroundColor;
        var hasBackground = !!bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)';
        var panelSized = rect.width >= 240 && rect.height >= 70;

        if (panelSized && padding >= 8 && (hasBackground || (hasBorder && radius >= 8))) {
          return node;
        }
        if (panelSized && hasBorder && radius >= 8) fallback = node;
      }
      node = node.parentElement;
    }

    return fallback;
  }

  function scanLivePreviewPanels() {
    if (!document.body) return;
    var elements = document.body.querySelectorAll('*');

    for (var i = 0; i < elements.length; i += 1) {
      var element = elements[i];
      if (element.children.length !== 0) continue;
      if (normalise(element.textContent) !== markerText) continue;

      element.classList.add(titleClass);
      var panel = visiblePanelAncestor(element.parentElement || element);
      if (panel) panel.classList.add(panelClass);
    }
  }

  function startObserver() {
    if (!document.body) return;
    scanLivePreviewPanels();
    var observer = new MutationObserver(function () {
      scanLivePreviewPanels();
    });
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver, { once: true });
  } else {
    startObserver();
  }
})();
/* CALULER_HEALTH_LIVE_PREVIEW_RUNTIME_JS_END */

/* CALULER_BODYFAT_LIGHT_WRAPPER_JS_START */
(function () {
    'use strict';

    function applyCalulerBodyFatLightFix() {
        var pathname = (window.location.pathname || '').toLowerCase();

        if (!pathname.endsWith('/body-fat-calculator.html')) {
            return;
        }

        var svg = document.querySelector(
            'svg.health-diagram-illustration[role="img"]'
        ) || document.querySelector('svg.health-diagram-illustration');

        if (!svg) {
            console.warn('Caluler Body Fat theme fix: diagram SVG not found.');
            return;
        }

        /*
         * Find the smallest ancestor containing both the remaining
         * Measurement Guide heading and the Live Diagram Calculation panel.
         * Do not depend on the removed "not to scale" caption.
         */
        var target = null;
        var node = svg.parentElement;

        while (node && node !== document.body) {
            var content = (node.innerText || node.textContent || '')
                .replace(/\s+/g, ' ');

            if (
                /measurement guide/i.test(content) &&
                /live diagram calculation/i.test(content)
            ) {
                target = node;
                break;
            }

            node = node.parentElement;
        }

        if (!target) {
            console.warn(
                'Caluler Body Fat theme fix: guide wrapper could not be identified.'
            );
            return;
        }

        document.body.classList.add('caluler-bodyfat-lightfix');
        target.classList.add('health-bodyfat-guide-lightfix');
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            applyCalulerBodyFatLightFix,
            { once: true }
        );
    } else {
        applyCalulerBodyFatLightFix();
    }
}());
/* CALULER_BODYFAT_LIGHT_WRAPPER_JS_END */

/* CALULER-GLOBAL-HEADER-SEARCH-V2 */
(function () {
  'use strict';

  if (window.__calulerHeaderSearchV2) return;
  window.__calulerHeaderSearchV2 = true;

  const SEARCH_INDEX = [{"title":"Ideal Weight Calculator","description":"Estimate a Devine-style reference weight from adult height and the selected equation.","category":"Health Calculators","keywords":"ideal weight calculator, Devine-style formula, reference weight estimate, adult height, Health Calculators","url":"tools/ideal-weight-calculator.html"},{"title":"Body Fat Calculator","description":"Estimate body-fat percentage with the U.S. Navy circumference method.","category":"Health Calculators","keywords":"body fat percentage, U.S. Navy body fat equation, circumference estimate, Health Calculators","url":"tools/body-fat-calculator.html"},{"title":"Macro \u0026 Protein Calculator","description":"Calculate daily macro grams from calories or estimate a protein target from body weight.","category":"Health Calculators","keywords":"macro calculator, protein calculator, carbohydrate grams, fat grams, daily protein target, Health Calculators","url":"tools/macro-calculator.html"},{"title":"Water Intake Calculator","description":"Estimate daily water intake from body weight as a flexible starting point.","category":"Health Calculators","keywords":"water intake calculator, daily water estimate, body weight hydration, Health Calculators","url":"tools/water-intake-calculator.html"},{"title":"Heart Rate Recovery Calculator","description":"Measure the one-minute heart-rate drop after exercise.","category":"Health Calculators","keywords":"heart rate recovery, one minute heart rate drop, bpm, Health Calculators","url":"tools/heart-rate-recovery-calculator.html"},{"title":"Lean Body Mass Calculator","description":"Estimate lean body mass from weight and body-fat percentage.","category":"Health Calculators","keywords":"lean body mass calculator, LBM, body fat percentage, Health Calculators","url":"tools/lean-body-mass-calculator.html"},{"title":"Heart Rate Zone Calculator","description":"Estimate five training heart-rate zones from age and resting pulse.","category":"Health Calculators","keywords":"heart rate zones, Karvonen calculator, target BPM, Health Calculators","url":"tools/heart-rate-zone-calculator.html"},{"title":"One Rep Max Calculator","description":"Estimate one-repetition maximum from lifted weight and repetitions.","category":"Health Calculators","keywords":"one rep max calculator, 1RM, strength estimate, Health Calculators","url":"tools/one-rep-max-calculator.html"},{"title":"VO₂ Max Calculator","description":"Estimate aerobic fitness from distance covered in a 12-minute Cooper test.","category":"Health Calculators","keywords":"VO₂ Max Calculator Estimate aerobic fitness from distance covered in a 12-minute Cooper test. Health Calculators","url":"tools/vo2-max-calculator.html"},{"title":"Body Surface Area Calculator","description":"Estimate BSA from height and weight using the Mosteller formula.","category":"Health Calculators","keywords":"body surface area, BSA, Mosteller formula, Health Calculators","url":"tools/body-surface-area-calculator.html"},{"title":"Waist to Hip Ratio Calculator","description":"Calculate waist-to-hip ratio from two circumference measurements.","category":"Health Calculators","keywords":"waist to hip ratio, WHR, circumference ratio, Health Calculators","url":"tools/waist-to-hip-ratio-calculator.html"},{"title":"Body Weight Change Calculator","description":"Calculate weight change, percentage change and average weekly rate.","category":"Health Calculators","keywords":"weight change calculator, percentage weight change, weekly change, Health Calculators","url":"tools/body-weight-change-calculator.html"},{"title":"Pace Calculator","description":"Calculate running pace and average speed from distance and time.","category":"Health Calculators","keywords":"running pace calculator, pace per kilometre, running speed, Health Calculators","url":"tools/pace-calculator.html"},{"title":"Waist-to-Height Ratio Calculator","description":"Calculate waist-to-height ratio as a screening measure.","category":"Health Calculators","keywords":"waist to height ratio, WHtR, central adiposity screening, Health Calculators","url":"tools/waist-to-height-ratio-calculator.html"},{"title":"Training Load Calculator","description":"Estimate session training load from duration and perceived exertion.","category":"Health Calculators","keywords":"Training Load Calculator Estimate session training load from duration and perceived exertion. Health Calculators","url":"tools/training-load-calculator.html"},{"title":"Interest \u0026 Time Value Calculator","description":"Switch between simple interest, compound growth, PV, FV and effective annual rate.","category":"Finance Calculators","keywords":"Interest \u0026 Time Value Calculator Finance Calculators simple interest calculator, compound interest calculator, present value calculator, future value calculator, effective annual rate calculator Finance Calculators","url":"tools/compound-interest-calculator.html"},{"title":"Savings Planner","description":"Projection and goal modes with starting balance, deposits and optional interest.","category":"Finance Calculators","keywords":"Savings Planner Finance Calculators savings planner, savings growth calculator, monthly savings goal, savings goal calculator Finance Calculators","url":"tools/savings-calculator.html"},{"title":"Investment Return Calculator","description":"Total-value or per-unit return analysis with fees, distributions and holding period.","category":"Finance Calculators","keywords":"Investment Return Calculator Finance Calculators investment return calculator, ROI calculator, annualized return, CAGR calculator, investment profit after fees Finance Calculators","url":"tools/roi-calculator.html"},{"title":"Sales Tax \u0026 VAT Calculator","description":"Add tax to a net price or extract tax from a tax-inclusive total.","category":"Finance Calculators","keywords":"Sales Tax \u0026 VAT Calculator Finance Calculators sales tax calculator, VAT calculator, add tax, remove tax, tax inclusive price calculator Finance Calculators","url":"tools/sales-tax-calculator.html"},{"title":"Commission \u0026 Split Calculator","description":"Calculate sales commission, your share and the remaining team split.","category":"Finance Calculators","keywords":"Commission \u0026 Split Calculator Finance Calculators commission calculator, commission split calculator, sales commission, commission sharing Finance Calculators","url":"tools/commission-calculator.html"},{"title":"Pay \u0026 Salary Calculator","description":"Hourly-to-salary, salary-to-hourly and gross-to-net estimate modes.","category":"Finance Calculators","keywords":"Pay \u0026 Salary Calculator Finance Calculators hourly to salary calculator, salary to hourly calculator, paycheck calculator, take home pay estimate Finance Calculators","url":"tools/paycheck-calculator.html"},{"title":"Debt Payoff Planner","description":"Compare monthly payment and extra-payment scenarios with an amortization estimate.","category":"Finance Calculators","keywords":"Debt Payoff Planner Finance Calculators debt payoff planner, credit card payoff, extra payment calculator, debt interest calculator Finance Calculators","url":"tools/debt-payoff-calculator.html"},{"title":"Break Even Calculator","description":"Find the sales volume needed to cover fixed and variable costs.","category":"Business \u0026 Productivity","keywords":"Break Even Calculator Finance Calculators break even calculator, break even point, business break even, units to break even Business \u0026 Productivity","url":"tools/break-even-calculator.html"},{"title":"Cash Flow Calculator","description":"Separate cash flows by activity for a more useful cash position summary.","category":"Finance Calculators","keywords":"Cash Flow Calculator Finance Calculators cash flow calculator, operating cash flow, investing cash flow, financing cash flow Finance Calculators","url":"tools/cash-flow-calculator.html"},{"title":"Business Valuation Calculator","description":"Choose an earnings or revenue multiple and adjust debt and cash.","category":"Finance Calculators","keywords":"Business Valuation Calculator Finance Calculators business valuation calculator, EBITDA multiple, revenue multiple, enterprise value, equity valuation Finance Calculators","url":"tools/business-valuation-calculator.html"},{"title":"Dividend Yield Calculator","description":"Yield, share value, annual dividend income and growth scenario.","category":"Finance Calculators","keywords":"Dividend Yield Calculator Finance Calculators dividend yield calculator, annual dividend income, stock dividend yield Finance Calculators","url":"tools/dividend-yield-calculator.html"},{"title":"Fraction Calculator","description":"Add, subtract, multiply or divide two fractions.","category":"Mathematics","keywords":"Fraction Calculator Math Calculators fraction calculator, add fractions, subtract fractions, fraction math calculator Mathematics","url":"tools/fraction-calculator.html"},{"title":"Ratio Calculator","description":"Simplify a ratio and calculate a proportional value.","category":"Mathematics","keywords":"Ratio Calculator Math Calculators ratio calculator, simplify ratio, ratio simplifier, proportion calculator Mathematics","url":"tools/ratio-calculator.html"},{"title":"Average Calculator","description":"Calculate the arithmetic mean of a list of numbers.","category":"Mathematics","keywords":"Average Calculator Math Calculators average calculator, mean calculator, arithmetic mean, average of numbers Mathematics","url":"tools/average-calculator.html"},{"title":"Median Calculator","description":"Find the median of a list of numbers.","category":"Mathematics","keywords":"Median Calculator Math Calculators median calculator, median of numbers, statistics calculator, median finder Mathematics","url":"tools/median-calculator.html"},{"title":"Mode Calculator","description":"Find the most frequent value in a list of numbers.","category":"Mathematics","keywords":"Mode Calculator Math Calculators mode calculator, mode of numbers, statistics mode, frequency calculator Mathematics","url":"tools/mode-calculator.html"},{"title":"Standard Deviation Calculator","description":"Calculate population or sample standard deviation for a list of values.","category":"Mathematics","keywords":"Standard Deviation Calculator Math Calculators standard deviation calculator, standard deviation, statistics calculator, variance Mathematics","url":"tools/standard-deviation-calculator.html"},{"title":"GCD Calculator","description":"Find the greatest common divisor of two integers.","category":"Mathematics","keywords":"GCD Calculator Math Calculators GCD calculator, greatest common divisor, greatest common factor, GCF calculator Mathematics","url":"tools/gcd-calculator.html"},{"title":"LCM Calculator","description":"Find the least common multiple of two integers.","category":"Mathematics","keywords":"LCM Calculator Math Calculators LCM calculator, least common multiple, common multiple calculator Mathematics","url":"tools/lcm-calculator.html"},{"title":"Prime Number Checker","description":"Check whether an integer is prime.","category":"Mathematics","keywords":"Prime Number Checker Math Calculators prime number checker, is this number prime, prime calculator, prime test Mathematics","url":"tools/prime-number-checker.html"},{"title":"Quadratic Equation Calculator","description":"Solve ax² + bx + c = 0 and show the roots or discriminant.","category":"Mathematics","keywords":"Quadratic Equation Calculator Math Calculators quadratic equation calculator, quadratic formula, solve quadratic equation, roots calculator Mathematics","url":"tools/quadratic-equation-calculator.html"},{"title":"Final Grade Calculator","description":"Calculate the final grade needed on an exam based on current grade and exam weight.","category":"Education Tools","keywords":"Final Grade Calculator Education Tools final grade calculator, grade needed calculator, exam grade calculator, required score Education Tools","url":"tools/final-grade-calculator.html"},{"title":"Grade Percentage Calculator","description":"Convert points earned and total points into a percentage.","category":"Education Tools","keywords":"Grade Percentage Calculator Education Tools grade percentage calculator, score percentage calculator, marks percentage Education Tools","url":"tools/grade-percentage-calculator.html"},{"title":"Weighted Grade Calculator","description":"Calculate a weighted course grade from scores and weights.","category":"Education Tools","keywords":"Weighted Grade Calculator Education Tools weighted grade calculator, weighted average grade, course grade calculator Education Tools","url":"tools/weighted-grade-calculator.html"},{"title":"Attendance Calculator","description":"Calculate attendance percentage and the number of classes needed to reach a target.","category":"Education Tools","keywords":"Attendance Calculator Education Tools attendance calculator, attendance percentage, classes needed attendance Education Tools","url":"tools/attendance-calculator.html"},{"title":"Study Time Calculator","description":"Estimate study time needed from a total topic load and available study hours per day.","category":"Education Tools","keywords":"Study Time Calculator Education Tools study time calculator, study planner calculator, hours to study, exam study time Education Tools","url":"tools/study-time-calculator.html"},{"title":"Exam Score Calculator","description":"Calculate an exam percentage and letter-grade estimate from marks.","category":"Education Tools","keywords":"Exam Score Calculator Education Tools exam score calculator, test score calculator, marks to grade, exam percentage Education Tools","url":"tools/exam-score-calculator.html"},{"title":"Reading Time Calculator","description":"Estimate reading time from word count and reading speed.","category":"Education Tools","keywords":"Reading Time Calculator Education Tools reading time calculator, read time calculator, words per minute, reading speed Education Tools","url":"tools/reading-time-calculator.html"},{"title":"GPA Scale Converter","description":"Convert a percentage or score into a simple 4.0 GPA estimate.","category":"Education Tools","keywords":"GPA Scale Converter Education Tools GPA scale converter, percentage to GPA, GPA conversion, 4.0 GPA Education Tools","url":"tools/gpa-scale-converter.html"},{"title":"Date Difference Calculator","description":"Calculate the number of days between two dates.","category":"Date \u0026 Time Tools","keywords":"Date Difference Calculator Date \u0026 Time Tools date difference calculator, days between dates, date duration calculator Date \u0026 Time Tools","url":"tools/date-difference-calculator.html"},{"title":"Add Days to Date Calculator","description":"Add or subtract a number of days from a starting date.","category":"Date \u0026 Time Tools","keywords":"Add Days to Date Calculator Date \u0026 Time Tools add days calculator, date calculator add days, days from date, future date calculator Date \u0026 Time Tools","url":"tools/add-days-to-date-calculator.html"},{"title":"Business Days Calculator","description":"Count weekdays between two dates, excluding Saturdays and Sundays.","category":"Date \u0026 Time Tools","keywords":"Business Days Calculator Date \u0026 Time Tools business days calculator, working days calculator, weekdays between dates Date \u0026 Time Tools","url":"tools/business-days-calculator.html"},{"title":"Countdown Calculator","description":"Calculate the time remaining until a selected date and time.","category":"Date \u0026 Time Tools","keywords":"Countdown Calculator Date \u0026 Time Tools countdown calculator, countdown timer calculator, time until date, days until Date \u0026 Time Tools","url":"tools/countdown-calculator.html"},{"title":"Age at Date Calculator","description":"Calculate age on a specific date rather than today.","category":"Date \u0026 Time Tools","keywords":"Age at Date Calculator Date \u0026 Time Tools age at date calculator, age on date, age calculator specific date Date \u0026 Time Tools","url":"tools/age-at-date-calculator.html"},{"title":"Hours to Minutes Calculator","description":"Convert hours and minutes into total minutes.","category":"Date \u0026 Time Tools","keywords":"Hours to Minutes Calculator Date \u0026 Time Tools hours to minutes calculator, time conversion hours minutes, minutes converter Date \u0026 Time Tools","url":"tools/hours-to-minutes-calculator.html"},{"title":"Seconds Converter","description":"Convert seconds into hours, minutes and seconds.","category":"Date \u0026 Time Tools","keywords":"Seconds Converter Date \u0026 Time Tools seconds converter, seconds to hours minutes, time converter Date \u0026 Time Tools","url":"tools/seconds-converter.html"},{"title":"Unix Timestamp Converter","description":"Convert a Unix timestamp into a readable UTC date and time.","category":"Date \u0026 Time Tools","keywords":"Unix Timestamp Converter Date \u0026 Time Tools unix timestamp converter, epoch converter, timestamp to date, epoch time Date \u0026 Time Tools","url":"tools/unix-timestamp-converter.html"},{"title":"Length Converter","description":"Convert common length units.","category":"Conversion Tools","keywords":"Length Converter Conversion Tools length converter, feet to meters, inches to cm, km to miles, length conversion Conversion Tools","url":"tools/length-converter.html"},{"title":"Area Converter","description":"Convert common area units.","category":"Conversion Tools","keywords":"Area Converter Conversion Tools area converter, square feet to square meters, acres converter, hectare converter Conversion Tools","url":"tools/area-converter.html"},{"title":"Volume Converter","description":"Convert liters, gallons, milliliters, cups and cubic meters.","category":"Conversion Tools","keywords":"Volume Converter Conversion Tools volume converter, liters to gallons, gallons to liters, ml converter, cups converter Conversion Tools","url":"tools/volume-converter.html"},{"title":"Weight Converter","description":"Convert kilograms, grams, pounds and ounces.","category":"Conversion Tools","keywords":"Weight Converter Conversion Tools weight converter, kg to pounds, pounds to kg, ounces converter, mass converter Conversion Tools","url":"tools/weight-converter.html"},{"title":"Speed Converter","description":"Convert speed between km/h, mph, m/s and knots.","category":"Conversion Tools","keywords":"Speed Converter Conversion Tools speed converter, kmh to mph, mph to kmh, knots converter, meters per second Conversion Tools","url":"tools/speed-converter.html"},{"title":"Pressure Converter","description":"Convert pressure between pascals, bar, psi, atm and kPa.","category":"Conversion Tools","keywords":"Pressure Converter Conversion Tools pressure converter, psi to bar, bar to psi, kPa converter, pressure conversion Conversion Tools","url":"tools/pressure-converter.html"},{"title":"Energy Converter","description":"Convert joules, calories, kilojoules, watt-hours and kilowatt-hours.","category":"Conversion Tools","keywords":"Energy Converter Conversion Tools energy converter, joules to calories, kwh converter, watt hour converter Conversion Tools","url":"tools/energy-converter.html"},{"title":"Power Converter","description":"Convert watts, kilowatts, horsepower and BTU per hour.","category":"Conversion Tools","keywords":"Power Converter Conversion Tools power converter, watts to horsepower, kw to watts, horsepower converter Conversion Tools","url":"tools/power-converter.html"},{"title":"Data Storage Converter","description":"Convert bytes, KB, MB, GB and TB using decimal units.","category":"Conversion Tools","keywords":"Data Storage Converter Conversion Tools data converter, bytes to kb, MB to GB, storage converter, file size converter Conversion Tools","url":"tools/data-storage-converter.html"},{"title":"Frequency Converter","description":"Convert hertz, kilohertz, megahertz and gigahertz.","category":"Conversion Tools","keywords":"Frequency Converter Conversion Tools frequency converter, Hz to kHz, MHz to GHz, frequency conversion Conversion Tools","url":"tools/frequency-converter.html"},{"title":"Markup Calculator","description":"Calculate markup amount, selling price and markup percentage from cost.","category":"Business \u0026 Productivity","keywords":"Markup Calculator Business Calculators markup calculator, markup percentage calculator, selling price calculator, retail markup Business \u0026 Productivity","url":"tools/markup-calculator.html"},{"title":"Profit Calculator","description":"Calculate gross profit and profit percentage from cost and revenue.","category":"Business \u0026 Productivity","keywords":"Profit Calculator Business Calculators profit calculator, profit percentage calculator, gross profit calculator, business profit Business \u0026 Productivity","url":"tools/profit-calculator.html"},{"title":"Markup from Margin Calculator","description":"Convert a target profit margin into the equivalent markup percentage.","category":"Business \u0026 Productivity","keywords":"Markup from Margin Calculator Business Calculators markup from margin calculator, margin to markup, retail pricing calculator Business \u0026 Productivity","url":"tools/markup-from-margin-calculator.html"},{"title":"Meeting Cost Calculator","description":"Estimate the cost of a meeting from attendee count, hourly pay and duration.","category":"Business \u0026 Productivity","keywords":"Meeting Cost Calculator Business Calculators meeting cost calculator, meeting cost, meeting productivity calculator, employee meeting cost Business \u0026 Productivity","url":"tools/meeting-cost-calculator.html"},{"title":"Cost Per Unit Calculator","description":"Calculate unit cost from total cost and quantity.","category":"Business \u0026 Productivity","keywords":"Cost Per Unit Calculator Business Calculators cost per unit calculator, unit cost calculator, price per item Business \u0026 Productivity","url":"tools/cost-per-unit-calculator.html"},{"title":"Free Online Age Calculator","description":"Free online Age Calculator by Caluler. Calculate your exact age in years, months, weeks, days, hours and minutes instantly. Fast, accurate and mobile friendly.","category":"Date \u0026 Time Tools","keywords":"Age Calculator Health Calculators Age Calculator, Calculate Age, Exact Age Calculator, Birthday Calculator, Online Age Calculator Date \u0026 Time Tools","url":"tools/age-calculator.html"},{"title":"BMI Calculator","description":"Calculate body mass index from height and weight.","category":"Health Calculators","keywords":"BMI calculator, body mass index, height and weight, Health Calculators","url":"tools/bmi-calculator.html"},{"title":"Fat-Free Mass Index Calculator","description":"Estimate FFMI from weight, height and body-fat percentage.","category":"Health Calculators","keywords":"fat free mass index, FFMI calculator, lean mass index, Health Calculators","url":"tools/fat-free-mass-index-calculator.html"},{"title":"Advanced Calorie \u0026 Energy Calculator","description":"Estimate BMR, TDEE, calorie targets and MET-based exercise calories.","category":"Health Calculators","keywords":"BMR calculator, TDEE, maintenance calories, calorie deficit, exercise calorie burn, MET calculator, Health Calculators","url":"tools/calorie-calculator.html"},{"title":"Case Converter","description":"Convert text into uppercase, lowercase or title case.","category":"Text \u0026 Productivity","keywords":"Case Converter Text Tools case converter, uppercase converter, lowercase converter, title case converter Text \u0026 Productivity","url":"tools/case-converter.html"},{"title":"CGPA Calculator","description":"Calculate updated CGPA after a semester.","category":"Education Tools","keywords":"CGPA Calculator Education Tools CGPA calculator, cumulative GPA calculator, semester CGPA, CGPA after semester Education Tools","url":"tools/cgpa-calculator.html"},{"title":"Character Counter","description":"Count total characters and characters without spaces.","category":"Text \u0026 Productivity","keywords":"Character Counter Text Tools character counter, character count tool, letter counter, text length calculator Text \u0026 Productivity","url":"tools/character-counter.html"},{"title":"Currency Converter","description":"Manual exchange rate, source/target currency labels and fee estimate; no live quote.","category":"Finance Calculators","keywords":"Currency Converter Finance Calculators currency converter, manual exchange rate calculator, currency conversion fee calculator Finance Calculators","url":"tools/currency-converter.html"},{"title":"Date Calculator","description":"Calculate days between two dates.","category":"Date \u0026 Time Tools","keywords":"Date Calculator Date \u0026 Time Tools date calculator, days between dates, date difference calculator, date duration Date \u0026 Time Tools","url":"tools/date-calculator.html"},{"title":"Discount \u0026 Sale Price Calculator","description":"Original price, one or two discounts, plus optional tax in one calculator.","category":"Finance Calculators","keywords":"Discount \u0026 Sale Price Calculator Finance Calculators discount calculator, sale price calculator, stacked discount calculator, savings after discount Finance Calculators","url":"tools/discount-calculator.html"},{"title":"EMI \u0026 Loan Amortization Calculator","description":"Advanced installment schedules with EMI, alternative repayment methods and remaining-balance breakdown.","category":"Finance Calculators","keywords":"EMI \u0026 Loan Amortization Calculator Finance Calculators EMI calculator, loan amortization calculator, installment schedule, reducing balance loan, flat markup loan Finance Calculators","url":"tools/emi-calculator.html"},{"title":"GPA Calculator","description":"Calculate GPA from grades and credit hours.","category":"Education Tools","keywords":"GPA Calculator Education Tools GPA calculator, grade point average calculator, college GPA calculator, GPA by credits Education Tools","url":"tools/gpa-calculator.html"},{"title":"Percentage Calculator","description":"Calculate what percentage one number is of another.","category":"Mathematics","keywords":"Percentage Calculator Health Calculators percentage calculator, percent calculator, percentage increase, percentage decrease Mathematics","url":"tools/percentage-calculator.html"},{"title":"Profit Margin Calculator","description":"Revenue, direct costs, operating expenses and additional costs.","category":"Finance Calculators","keywords":"Profit Margin Calculator Finance Calculators profit margin calculator, gross margin, operating margin, markup calculator Finance Calculators","url":"tools/profit-margin-calculator.html"},{"title":"Sleep Calculator","description":"Plan an estimated bedtime from wake time using sleep-cycle assumptions.","category":"Health Calculators","keywords":"sleep calculator, bedtime planner, wake time, sleep cycle, Health Calculators","url":"tools/sleep-calculator.html"},{"title":"Time Calculator","description":"Calculate time difference between two times.","category":"Date \u0026 Time Tools","keywords":"Time Calculator Date \u0026 Time Tools time calculator, time duration calculator, time difference calculator, hours minutes calculator Date \u0026 Time Tools","url":"tools/time-calculator.html"},{"title":"Tip Calculator","description":"Tip and tax estimate with split-by-person results.","category":"Finance Calculators","keywords":"Tip Calculator Finance Calculators tip calculator, bill split calculator, tip and tax calculator, restaurant bill calculator Finance Calculators","url":"tools/tip-calculator.html"},{"title":"Inflation \u0026 Purchasing Power Calculator","description":"Future equivalent cost, real purchasing power and purchasing-power loss.","category":"Finance Calculators","keywords":"Inflation \u0026 Purchasing Power Calculator Finance Calculators inflation calculator, purchasing power calculator, future cost calculator, inflation impact Finance Calculators","url":"tools/inflation-purchasing-power-calculator.html"},{"title":"Net Worth Calculator","description":"Assets minus liabilities with category subtotals.","category":"Finance Calculators","keywords":"Net Worth Calculator Finance Calculators net worth calculator, assets and liabilities calculator, personal net worth Finance Calculators","url":"tools/net-worth-calculator.html"},{"title":"Budget Allocation Planner","description":"Custom needs, wants and savings shares with validation.","category":"Finance Calculators","keywords":"Budget Allocation Planner Finance Calculators budget allocation calculator, monthly budget planner, 50 30 20 budget calculator Finance Calculators","url":"tools/budget-allocation-calculator.html"},{"title":"Emergency Fund Calculator","description":"Target months, current savings, coverage and a monthly savings plan.","category":"Finance Calculators","keywords":"Emergency Fund Calculator Finance Calculators emergency fund calculator, emergency savings goal, months of expenses calculator Finance Calculators","url":"tools/emergency-fund-calculator.html"},{"title":"Retirement Planner","description":"Current savings, monthly contributions, time to retirement, returns and inflation.","category":"Finance Calculators","keywords":"Retirement Planner Finance Calculators retirement planner calculator, retirement savings projection, retirement income estimator Finance Calculators","url":"tools/retirement-planner-calculator.html"},{"title":"Loan Affordability \u0026 Debt-to-Income Calculator","description":"Income, existing debt, proposed payment and an adjustable DTI threshold.","category":"Finance Calculators","keywords":"Loan Affordability \u0026 Debt-to-Income Calculator Finance Calculators loan affordability calculator, debt to income ratio calculator, DTI calculator Finance Calculators","url":"tools/loan-affordability-calculator.html"},{"title":"Loan-to-Value Calculator","description":"Property value and outstanding loan balance with equity outputs.","category":"Finance Calculators","keywords":"Loan-to-Value Calculator Finance Calculators loan to value calculator, LTV calculator, property equity calculator Finance Calculators","url":"tools/loan-to-value-calculator.html"},{"title":"Credit Utilization Calculator","description":"Three-card balance and limit inputs plus a user-selected target ratio.","category":"Finance Calculators","keywords":"Credit Utilization Calculator Finance Calculators credit utilization calculator, credit card utilization ratio, overall credit limit calculator Finance Calculators","url":"tools/credit-utilization-calculator.html"},{"title":"Capital Gains Tax Estimator","description":"Cost basis, improvement costs, selling costs and a user-entered rate.","category":"Finance Calculators","keywords":"Capital Gains Tax Estimator Finance Calculators capital gains tax estimator, taxable gain calculator, sale proceeds and cost basis calculator Finance Calculators","url":"tools/capital-gains-tax-calculator.html"},{"title":"Bond Yield Calculator","description":"Coupon rate, market price, face value and maturity with a transparent YTM approximation.","category":"Finance Calculators","keywords":"Bond Yield Calculator Finance Calculators bond yield calculator, current yield calculator, approximate yield to maturity calculator Finance Calculators","url":"tools/bond-yield-calculator.html"},{"title":"Portfolio Rebalancing Calculator","description":"Four asset classes, target percentages and buy/reduce estimates.","category":"Finance Calculators","keywords":"Portfolio Rebalancing Calculator Finance Calculators portfolio rebalancing calculator, target asset allocation, portfolio weight calculator Finance Calculators","url":"tools/portfolio-rebalancing-calculator.html"},{"title":"Rental Property Yield Calculator","description":"Rent, vacancy, expenses, debt service and cash invested.","category":"Finance Calculators","keywords":"Rental Property Yield Calculator Finance Calculators rental property yield calculator, rental property cap rate, net operating income calculator Finance Calculators","url":"tools/rental-property-yield-calculator.html"},{"title":"NPV \u0026 IRR Project Calculator","description":"Initial outlay, discount rate and up to five annual future cash flows.","category":"Finance Calculators","keywords":"NPV \u0026 IRR Project Calculator Finance Calculators NPV calculator, IRR calculator, discounted cash flow, project investment calculator Finance Calculators","url":"tools/npv-irr-calculator.html"},{"title":"Rent vs Buy Calculator","description":"Mortgage payment, rent growth, home appreciation, ownership costs and sale costs.","category":"Finance Calculators","keywords":"Rent vs Buy Calculator Finance Calculators rent vs buy calculator, renting versus buying, home ownership cost calculator Finance Calculators","url":"tools/rent-vs-buy-calculator.html"},{"title":"Unit Converter","description":"Convert temperature, time, force, angle, and electrical and magnetic units.","category":"Conversion Tools","keywords":"Unit Converter Conversion Tools unit converter, measurement converter, conversion calculator, metric converter Conversion Tools","url":"tools/unit-converter.html"},{"title":"Word Counter","description":"Count words, characters and characters without spaces.","category":"Text \u0026 Productivity","keywords":"Word Counter Text Tools word counter, word count tool, character count, writing counter Text \u0026 Productivity","url":"tools/word-counter.html"},{"title":"Coulomb’s Law Calculator","description":"Calculate electrostatic force between two point charges.","category":"Physics \u0026 Electromagnetism","keywords":"Coulomb’s Law Calculator Physics \u0026 Electromagnetism Calculate electrostatic force between two point charges. Physics \u0026 Electromagnetism","url":"tools/coulombs-law-calculator.html"},{"title":"Electric Charge Calculator","description":"Calculate charge from current and time.","category":"Physics \u0026 Electromagnetism","keywords":"Electric Charge Calculator Physics \u0026 Electromagnetism Calculate charge from current and time. Physics \u0026 Electromagnetism","url":"tools/electric-charge-calculator.html"},{"title":"Electric Field from Charge Calculator","description":"Calculate electric field magnitude from a point charge and distance.","category":"Physics \u0026 Electromagnetism","keywords":"Electric Field from Charge Calculator Physics \u0026 Electromagnetism Calculate electric field magnitude from a point charge and distance. Physics \u0026 Electromagnetism","url":"tools/electric-field-from-charge-calculator.html"},{"title":"Electric Potential from Charge Calculator","description":"Calculate electric potential due to a point charge.","category":"Physics \u0026 Electromagnetism","keywords":"Electric Potential from Charge Calculator Physics \u0026 Electromagnetism Calculate electric potential due to a point charge. Physics \u0026 Electromagnetism","url":"tools/electric-potential-from-charge-calculator.html"},{"title":"Frequency \u0026 Wavelength Calculator","description":"Convert frequency to wavelength or wavelength to frequency for a wave.","category":"Physics \u0026 Electromagnetism","keywords":"Frequency \u0026 Wavelength Calculator Physics \u0026 Electromagnetism Convert frequency to wavelength or wavelength to frequency for a wave. Physics \u0026 Electromagnetism","url":"tools/frequency-wavelength-calculator.html"},{"title":"Magnetic Field of a Straight Wire Calculator","description":"Estimate magnetic field around a long straight current-carrying wire.","category":"Physics \u0026 Electromagnetism","keywords":"Magnetic Field of a Straight Wire Calculator Physics \u0026 Electromagnetism Estimate magnetic field around a long straight current-carrying wire. Physics \u0026 Electromagnetism","url":"tools/magnetic-field-of-a-straight-wire-calculator.html"},{"title":"Magnetic Field of a Solenoid Calculator","description":"Calculate ideal solenoid magnetic field from turns, current and length.","category":"Physics \u0026 Electromagnetism","keywords":"Magnetic Field of a Solenoid Calculator Physics \u0026 Electromagnetism Calculate ideal solenoid magnetic field from turns, current and length. Physics \u0026 Electromagnetism","url":"tools/magnetic-field-of-a-solenoid-calculator.html"},{"title":"Magnetic Field of a Circular Coil Calculator","description":"Calculate field at the center of a circular coil.","category":"Physics \u0026 Electromagnetism","keywords":"Magnetic Field of a Circular Coil Calculator Physics \u0026 Electromagnetism Calculate field at the center of a circular coil. Physics \u0026 Electromagnetism","url":"tools/magnetic-field-of-a-circular-coil-calculator.html"},{"title":"Magnetic Field on Coil Axis Calculator","description":"Calculate axial magnetic field of a circular coil.","category":"Physics \u0026 Electromagnetism","keywords":"Magnetic Field on Coil Axis Calculator Physics \u0026 Electromagnetism Calculate axial magnetic field of a circular coil. Physics \u0026 Electromagnetism","url":"tools/magnetic-field-on-coil-axis-calculator.html"},{"title":"Biot–Savart Law Calculator","description":"Calculate magnetic field contribution for a current element.","category":"Physics \u0026 Electromagnetism","keywords":"Biot–Savart Law Calculator Physics \u0026 Electromagnetism Calculate magnetic field contribution for a current element. Physics \u0026 Electromagnetism","url":"tools/biotsavart-law-calculator.html"},{"title":"Ampere’s Law Magnetic Field Calculator","description":"Ideal circular path magnetic field from enclosed current.","category":"Physics \u0026 Electromagnetism","keywords":"Ampere’s Law Magnetic Field Calculator Physics \u0026 Electromagnetism Ideal circular path magnetic field from enclosed current. Physics \u0026 Electromagnetism","url":"tools/amperes-law-magnetic-field-calculator.html"},{"title":"Magnetic Force on Moving Charge Calculator","description":"Calculate magnetic force magnitude qvB sin(theta).","category":"Physics \u0026 Electromagnetism","keywords":"Magnetic Force on Moving Charge Calculator Physics \u0026 Electromagnetism Calculate magnetic force magnitude qvB sin(theta). Physics \u0026 Electromagnetism","url":"tools/magnetic-force-on-moving-charge-calculator.html"},{"title":"Force on Current-Carrying Wire Calculator","description":"Calculate force on a wire in a magnetic field.","category":"Physics \u0026 Electromagnetism","keywords":"Force on Current-Carrying Wire Calculator Physics \u0026 Electromagnetism Calculate force on a wire in a magnetic field. Physics \u0026 Electromagnetism","url":"tools/force-on-current-carrying-wire-calculator.html"},{"title":"Force Between Parallel Wires Calculator","description":"Calculate force per length between long parallel currents.","category":"Physics \u0026 Electromagnetism","keywords":"Force Between Parallel Wires Calculator Physics \u0026 Electromagnetism Calculate force per length between long parallel currents. Physics \u0026 Electromagnetism","url":"tools/force-between-parallel-wires-calculator.html"},{"title":"Magnetic Flux Calculator","description":"Calculate magnetic flux through a surface.","category":"Physics \u0026 Electromagnetism","keywords":"Magnetic Flux Calculator Physics \u0026 Electromagnetism Calculate magnetic flux through a surface. Physics \u0026 Electromagnetism","url":"tools/magnetic-flux-calculator.html"},{"title":"Faraday Induced EMF Calculator","description":"Calculate average induced EMF from flux change.","category":"Physics \u0026 Electromagnetism","keywords":"Faraday Induced EMF Calculator Physics \u0026 Electromagnetism Calculate average induced EMF from flux change. Physics \u0026 Electromagnetism","url":"tools/faraday-induced-emf-calculator.html"},{"title":"Motional EMF Calculator","description":"Calculate motional EMF for a conductor moving across a field.","category":"Physics \u0026 Electromagnetism","keywords":"Motional EMF Calculator Physics \u0026 Electromagnetism Calculate motional EMF for a conductor moving across a field. Physics \u0026 Electromagnetism","url":"tools/motional-emf-calculator.html"},{"title":"Self-Inductance Calculator","description":"Calculate inductance from flux linkage and current.","category":"Physics \u0026 Electromagnetism","keywords":"Self-Inductance Calculator Physics \u0026 Electromagnetism Calculate inductance from flux linkage and current. Physics \u0026 Electromagnetism","url":"tools/self-inductance-calculator.html"},{"title":"Mutual Inductance Calculator","description":"Calculate mutual inductance from induced EMF and current change rate.","category":"Physics \u0026 Electromagnetism","keywords":"Mutual Inductance Calculator Physics \u0026 Electromagnetism Calculate mutual inductance from induced EMF and current change rate. Physics \u0026 Electromagnetism","url":"tools/mutual-inductance-calculator.html"},{"title":"Energy Stored in an Inductor Calculator","description":"Calculate magnetic energy stored in an inductor.","category":"Physics \u0026 Electromagnetism","keywords":"Energy Stored in an Inductor Calculator Physics \u0026 Electromagnetism Calculate magnetic energy stored in an inductor. Physics \u0026 Electromagnetism","url":"tools/energy-stored-in-an-inductor-calculator.html"},{"title":"Solenoid Turns Calculator","description":"Estimate turns needed for a target ideal solenoid field.","category":"Physics \u0026 Electromagnetism","keywords":"Solenoid Turns Calculator Physics \u0026 Electromagnetism Estimate turns needed for a target ideal solenoid field. Physics \u0026 Electromagnetism","url":"tools/solenoid-turns-calculator.html"},{"title":"Electromagnetic Torque Calculator","description":"Calculate torque on a current loop in a magnetic field.","category":"Physics \u0026 Electromagnetism","keywords":"Electromagnetic Torque Calculator Physics \u0026 Electromagnetism Calculate torque on a current loop in a magnetic field. Physics \u0026 Electromagnetism","url":"tools/electromagnetic-torque-calculator.html"},{"title":"Magnetic Dipole Moment Calculator","description":"Calculate magnetic dipole moment of a current loop.","category":"Physics \u0026 Electromagnetism","keywords":"Magnetic Dipole Moment Calculator Physics \u0026 Electromagnetism Calculate magnetic dipole moment of a current loop. Physics \u0026 Electromagnetism","url":"tools/magnetic-dipole-moment-calculator.html"},{"title":"Magnetic Permeability Calculator","description":"Calculate permeability from B and H.","category":"Physics \u0026 Electromagnetism","keywords":"Magnetic Permeability Calculator Physics \u0026 Electromagnetism Calculate permeability from B and H. Physics \u0026 Electromagnetism","url":"tools/magnetic-permeability-calculator.html"},{"title":"Magnetic Susceptibility Calculator","description":"Calculate volume susceptibility from magnetization and field strength.","category":"Physics \u0026 Electromagnetism","keywords":"Magnetic Susceptibility Calculator Physics \u0026 Electromagnetism Calculate volume susceptibility from magnetization and field strength. Physics \u0026 Electromagnetism","url":"tools/magnetic-susceptibility-calculator.html"},{"title":"Transformer Turns Ratio Calculator","description":"Calculate ideal transformer voltage ratio from turns.","category":"Physics \u0026 Electromagnetism","keywords":"Transformer Turns Ratio Calculator Physics \u0026 Electromagnetism Calculate ideal transformer voltage ratio from turns. Physics \u0026 Electromagnetism","url":"tools/transformer-turns-ratio-calculator.html"},{"title":"Transformer Secondary Current Calculator","description":"Estimate ideal secondary current from primary and turns ratio.","category":"Physics \u0026 Electromagnetism","keywords":"Transformer Secondary Current Calculator Physics \u0026 Electromagnetism Estimate ideal secondary current from primary and turns ratio. Physics \u0026 Electromagnetism","url":"tools/transformer-secondary-current-calculator.html"},{"title":"AC Generator Peak EMF Calculator","description":"Calculate peak EMF of a rotating coil generator.","category":"Physics \u0026 Electromagnetism","keywords":"AC Generator Peak EMF Calculator Physics \u0026 Electromagnetism Calculate peak EMF of a rotating coil generator. Physics \u0026 Electromagnetism","url":"tools/ac-generator-peak-emf-calculator.html"},{"title":"Inductor Reactance Calculator","description":"Calculate inductive reactance in an AC circuit.","category":"Physics \u0026 Electromagnetism","keywords":"Inductor Reactance Calculator Physics \u0026 Electromagnetism Calculate inductive reactance in an AC circuit. Physics \u0026 Electromagnetism","url":"tools/inductor-reactance-calculator.html"},{"title":"Magnetic Energy Density Calculator","description":"Calculate energy density in a linear magnetic field.","category":"Physics \u0026 Electromagnetism","keywords":"Magnetic Energy Density Calculator Physics \u0026 Electromagnetism Calculate energy density in a linear magnetic field. Physics \u0026 Electromagnetism","url":"tools/magnetic-energy-density-calculator.html"},{"title":"Ohm’s Law Calculator","description":"Calculate voltage, current, resistance and power using Ohm’s law.","category":"Electricity \u0026 Electronics","keywords":"Ohm’s Law Calculator Electricity \u0026 Electronics Calculate voltage, current, resistance and power using Ohm’s law. Electricity \u0026 Electronics","url":"tools/ohms-law-calculator.html"},{"title":"Voltage, Current \u0026 Resistance Calculator","description":"Solve for voltage, current, or resistance from two known values.","category":"Electricity \u0026 Electronics","keywords":"Voltage, Current \u0026 Resistance Calculator Electricity \u0026 Electronics Solve for voltage, current, or resistance from two known values. Electricity \u0026 Electronics","url":"tools/voltage-current-resistance-calculator.html"},{"title":"Electrical Power Calculator","description":"Calculate electrical power from voltage, current, or resistance.","category":"Electricity \u0026 Electronics","keywords":"Electrical Power Calculator Electricity \u0026 Electronics Calculate electrical power from voltage, current, or resistance. Electricity \u0026 Electronics","url":"tools/electrical-power-calculator.html"},{"title":"LED Series Resistor Calculator","description":"Estimate a current-limiting resistor for an LED circuit.","category":"Electricity \u0026 Electronics","keywords":"LED Series Resistor Calculator Electricity \u0026 Electronics Estimate a current-limiting resistor for an LED circuit. Electricity \u0026 Electronics","url":"tools/led-resistor-calculator.html"},{"title":"Series Resistance Calculator","description":"Calculate total resistance for resistors connected in series.","category":"Electricity \u0026 Electronics","keywords":"Series Resistance Calculator Electricity \u0026 Electronics Calculate total resistance for resistors connected in series. Electricity \u0026 Electronics","url":"tools/series-resistance-calculator.html"},{"title":"Series Capacitance Calculator","description":"Calculate equivalent capacitance for capacitors connected in series.","category":"Electricity \u0026 Electronics","keywords":"Series Capacitance Calculator Electricity \u0026 Electronics Calculate equivalent capacitance for capacitors connected in series. Electricity \u0026 Electronics","url":"tools/series-capacitance-calculator.html"},{"title":"Parallel Capacitance Calculator","description":"Calculate total capacitance for capacitors connected in parallel.","category":"Electricity \u0026 Electronics","keywords":"Parallel Capacitance Calculator Electricity \u0026 Electronics Calculate total capacitance for capacitors connected in parallel. Electricity \u0026 Electronics","url":"tools/parallel-capacitance-calculator.html"},{"title":"Kirchhoff Loop Voltage Calculator","description":"Apply Kirchhoff voltage law by summing known signed loop voltages.","category":"Electricity \u0026 Electronics","keywords":"Kirchhoff Loop Voltage Calculator Electricity \u0026 Electronics Apply Kirchhoff voltage law by summing known signed loop voltages. Electricity \u0026 Electronics","url":"tools/kirchhoff-loop-voltage-calculator.html"},{"title":"Parallel Resistance Calculator","description":"Calculate equivalent resistance for two resistors connected in parallel.","category":"Electricity \u0026 Electronics","keywords":"Parallel Resistance Calculator Electricity \u0026 Electronics Calculate equivalent resistance for two resistors connected in parallel. Electricity \u0026 Electronics","url":"tools/parallel-resistance-calculator.html"},{"title":"Capacitance from Charge Calculator","description":"Calculate capacitance from stored charge and voltage.","category":"Electricity \u0026 Electronics","keywords":"Capacitance from Charge Calculator Electricity \u0026 Electronics Calculate capacitance from stored charge and voltage. Electricity \u0026 Electronics","url":"tools/capacitance-from-charge-calculator.html"},{"title":"Capacitor Energy Calculator","description":"Calculate energy stored in a capacitor.","category":"Electricity \u0026 Electronics","keywords":"Capacitor Energy Calculator Electricity \u0026 Electronics Calculate energy stored in a capacitor. Electricity \u0026 Electronics","url":"tools/capacitor-energy-calculator.html"},{"title":"RC Time Constant Calculator","description":"Calculate RC circuit time constant.","category":"Electricity \u0026 Electronics","keywords":"RC Time Constant Calculator Electricity \u0026 Electronics Calculate RC circuit time constant. Electricity \u0026 Electronics","url":"tools/rc-time-constant-calculator.html"},{"title":"RL Time Constant Calculator","description":"Calculate RL circuit time constant.","category":"Electricity \u0026 Electronics","keywords":"RL Time Constant Calculator Electricity \u0026 Electronics Calculate RL circuit time constant. Electricity \u0026 Electronics","url":"tools/rl-time-constant-calculator.html"},{"title":"RLC Resonant Frequency Calculator","description":"Calculate ideal LC resonance frequency.","category":"Electricity \u0026 Electronics","keywords":"RLC Resonant Frequency Calculator Electricity \u0026 Electronics Calculate ideal LC resonance frequency. Electricity \u0026 Electronics","url":"tools/rlc-resonant-frequency-calculator.html"},{"title":"Capacitive Reactance Calculator","description":"Calculate capacitive reactance.","category":"Electricity \u0026 Electronics","keywords":"Capacitive Reactance Calculator Electricity \u0026 Electronics Calculate capacitive reactance. Electricity \u0026 Electronics","url":"tools/capacitive-reactance-calculator.html"},{"title":"AC Circuit Impedance Calculator","description":"Calculate impedance magnitude from resistance and net reactance.","category":"Electricity \u0026 Electronics","keywords":"AC Circuit Impedance Calculator Electricity \u0026 Electronics Calculate impedance magnitude from resistance and net reactance. Electricity \u0026 Electronics","url":"tools/ac-circuit-impedance-calculator.html"},{"title":"Power Factor Calculator","description":"Calculate power factor from real and apparent power.","category":"Electricity \u0026 Electronics","keywords":"Power Factor Calculator Electricity \u0026 Electronics Calculate power factor from real and apparent power. Electricity \u0026 Electronics","url":"tools/power-factor-calculator.html"},{"title":"Three-Phase Power Calculator","description":"Estimate balanced three-phase real power.","category":"Electricity \u0026 Electronics","keywords":"Three-Phase Power Calculator Electricity \u0026 Electronics Estimate balanced three-phase real power. Electricity \u0026 Electronics","url":"tools/three-phase-power-calculator.html"},{"title":"Diode Series Resistor Calculator","description":"Calculate series resistor for a simple LED/diode circuit.","category":"Electricity \u0026 Electronics","keywords":"Diode Series Resistor Calculator Electricity \u0026 Electronics Calculate series resistor for a simple LED/diode circuit. Electricity \u0026 Electronics","url":"tools/diode-series-resistor-calculator.html"},{"title":"Voltage Divider Calculator","description":"Calculate output voltage of a two-resistor divider.","category":"Electricity \u0026 Electronics","keywords":"Voltage Divider Calculator Electricity \u0026 Electronics Calculate output voltage of a two-resistor divider. Electricity \u0026 Electronics","url":"tools/voltage-divider-calculator.html"},{"title":"Electrical Power from Voltage and Current","description":"Calculate DC power from voltage and current.","category":"Electricity \u0026 Electronics","keywords":"Electrical Power from Voltage and Current Electricity \u0026 Electronics Calculate DC power from voltage and current. Electricity \u0026 Electronics","url":"tools/electrical-power-from-voltage-and-current.html"},{"title":"Electrical Energy Cost Calculator","description":"Estimate electricity cost from power, usage time and price per kWh.","category":"Electricity \u0026 Electronics","keywords":"Electrical Energy Cost Calculator Electricity \u0026 Electronics Estimate electricity cost from power, usage time and price per kWh. Electricity \u0026 Electronics","url":"tools/electrical-energy-cost-calculator.html"},{"title":"Scientific Notation Converter","description":"Convert a number to normalized scientific notation.","category":"Conversion Tools","keywords":"Scientific Notation Converter Mathematics Convert a number to normalized scientific notation. Conversion Tools","url":"tools/scientific-notation-converter.html"},{"title":"Polynomial Value Calculator","description":"Evaluate ax² + bx + c at x.","category":"Mathematics","keywords":"Polynomial Value Calculator Mathematics Evaluate ax² + bx + c at x. Mathematics","url":"tools/polynomial-value-calculator.html"},{"title":"Matrix Determinant 2×2 Calculator","description":"Calculate determinant of a 2 by 2 matrix.","category":"Mathematics","keywords":"Matrix Determinant 2×2 Calculator Mathematics Calculate determinant of a 2 by 2 matrix. Mathematics","url":"tools/matrix-determinant-22-calculator.html"},{"title":"Matrix Inverse 2×2 Calculator","description":"Calculate inverse matrix entries for a nonsingular 2 by 2 matrix.","category":"Mathematics","keywords":"Matrix Inverse 2×2 Calculator Mathematics Calculate inverse matrix entries for a nonsingular 2 by 2 matrix. Mathematics","url":"tools/matrix-inverse-22-calculator.html"},{"title":"Matrix Trace 2×2 Calculator","description":"Calculate the trace of a 2 by 2 matrix.","category":"Mathematics","keywords":"Matrix Trace 2×2 Calculator Mathematics Calculate the trace of a 2 by 2 matrix. Mathematics","url":"tools/matrix-trace-22-calculator.html"},{"title":"Vector Dot Product Calculator","description":"Calculate the dot product of two 3D vectors.","category":"Mathematics","keywords":"Vector Dot Product Calculator Mathematics Calculate the dot product of two 3D vectors. Mathematics","url":"tools/vector-dot-product-calculator.html"},{"title":"Vector Magnitude Calculator","description":"Calculate magnitude of a 3D vector.","category":"Mathematics","keywords":"Vector Magnitude Calculator Mathematics Calculate magnitude of a 3D vector. Mathematics","url":"tools/vector-magnitude-calculator.html"},{"title":"Complex Number Magnitude Calculator","description":"Calculate magnitude of a complex number a + bi.","category":"Mathematics","keywords":"Complex Number Magnitude Calculator Mathematics Calculate magnitude of a complex number a + bi. Mathematics","url":"tools/complex-number-magnitude-calculator.html"},{"title":"Logarithm Calculator","description":"Calculate logarithm of x to a chosen base.","category":"Mathematics","keywords":"Logarithm Calculator Mathematics Calculate logarithm of x to a chosen base. Mathematics","url":"tools/logarithm-calculator.html"},{"title":"Permutation Calculator","description":"Calculate permutations nPr for integer inputs.","category":"Mathematics","keywords":"Permutation Calculator Mathematics Calculate permutations nPr for integer inputs. Mathematics","url":"tools/permutation-calculator.html"},{"title":"Combination Calculator","description":"Calculate combinations nCr for integer inputs.","category":"Mathematics","keywords":"Combination Calculator Mathematics Calculate combinations nCr for integer inputs. Mathematics","url":"tools/combination-calculator.html"},{"title":"Probability of Independent Events Calculator","description":"Calculate joint probability of two independent events.","category":"Mathematics","keywords":"Probability of Independent Events Calculator Mathematics Calculate joint probability of two independent events. Mathematics","url":"tools/probability-of-independent-events-calculator.html"},{"title":"Z-Score Calculator","description":"Calculate standardized z-score from value, mean and standard deviation.","category":"Mathematics","keywords":"Z-Score Calculator Mathematics Calculate standardized z-score from value, mean and standard deviation. Mathematics","url":"tools/z-score-calculator.html"},{"title":"Linear Regression Slope Calculator","description":"Calculate slope from correlation and standard deviations.","category":"Mathematics","keywords":"Linear Regression Slope Calculator Mathematics Calculate slope from correlation and standard deviations. Mathematics","url":"tools/linear-regression-slope-calculator.html"},{"title":"Geometric Mean Calculator","description":"Calculate geometric mean of two positive values.","category":"Mathematics","keywords":"Geometric Mean Calculator Mathematics Calculate geometric mean of two positive values. Mathematics","url":"tools/geometric-mean-calculator.html"},{"title":"Solar Panel Size Calculator","description":"Estimate solar array size from daily energy use and peak sun hours.","category":"Engineering \u0026 Renewable Energy","keywords":"Solar Panel Size Calculator Engineering \u0026 Renewable Energy Estimate solar array size from daily energy use and peak sun hours. Engineering \u0026 Renewable Energy","url":"tools/solar-panel-size-calculator.html"},{"title":"Solar Battery Backup Calculator","description":"Estimate nominal battery capacity for desired backup hours.","category":"Engineering \u0026 Renewable Energy","keywords":"Solar Battery Backup Calculator Engineering \u0026 Renewable Energy Estimate nominal battery capacity for desired backup hours. Engineering \u0026 Renewable Energy","url":"tools/solar-battery-backup-calculator.html"},{"title":"Solar Charge Controller Calculator","description":"Estimate controller current from panel power and battery voltage.","category":"Engineering \u0026 Renewable Energy","keywords":"Solar Charge Controller Calculator Engineering \u0026 Renewable Energy Estimate controller current from panel power and battery voltage. Engineering \u0026 Renewable Energy","url":"tools/solar-charge-controller-calculator.html"},{"title":"Inverter Runtime Calculator","description":"Estimate runtime from battery voltage, capacity, load and efficiency.","category":"Engineering \u0026 Renewable Energy","keywords":"Inverter Runtime Calculator Engineering \u0026 Renewable Energy Estimate runtime from battery voltage, capacity, load and efficiency. Engineering \u0026 Renewable Energy","url":"tools/inverter-runtime-calculator.html"},{"title":"Battery Charging Time Calculator","description":"Estimate ideal battery charge time from capacity and charging current.","category":"Engineering \u0026 Renewable Energy","keywords":"Battery Charging Time Calculator Engineering \u0026 Renewable Energy Estimate ideal battery charge time from capacity and charging current. Engineering \u0026 Renewable Energy","url":"tools/battery-charging-time-calculator.html"},{"title":"Battery Energy Calculator","description":"Convert battery voltage and amp-hours to watt-hours.","category":"Engineering \u0026 Renewable Energy","keywords":"Battery Energy Calculator Engineering \u0026 Renewable Energy Convert battery voltage and amp-hours to watt-hours. Engineering \u0026 Renewable Energy","url":"tools/battery-energy-calculator.html"},{"title":"Cable Voltage Drop Calculator","description":"Estimate DC voltage drop for copper cable using resistivity approximation.","category":"Engineering \u0026 Renewable Energy","keywords":"Cable Voltage Drop Calculator Engineering \u0026 Renewable Energy Estimate DC voltage drop for copper cable using resistivity approximation. Engineering \u0026 Renewable Energy","url":"tools/cable-voltage-drop-calculator.html"},{"title":"Electrical Wire Resistance Calculator","description":"Estimate copper wire resistance using length and cross-sectional area.","category":"Electricity \u0026 Electronics","keywords":"Electrical Wire Resistance Calculator Engineering \u0026 Renewable Energy Estimate copper wire resistance using length and cross-sectional area. Electricity \u0026 Electronics","url":"tools/electrical-wire-resistance-calculator.html"},{"title":"Fuse Size Estimator","description":"Estimate preliminary fuse current from continuous load current and margin.","category":"Engineering \u0026 Renewable Energy","keywords":"Fuse Size Estimator Engineering \u0026 Renewable Energy Estimate preliminary fuse current from continuous load current and margin. Engineering \u0026 Renewable Energy","url":"tools/fuse-size-estimator.html"},{"title":"DC Motor Speed Calculator","description":"Estimate motor speed from back EMF and motor constant.","category":"Engineering \u0026 Renewable Energy","keywords":"DC Motor Speed Calculator Engineering \u0026 Renewable Energy Estimate motor speed from back EMF and motor constant. Engineering \u0026 Renewable Energy","url":"tools/dc-motor-speed-calculator.html"},{"title":"Motor Torque Calculator","description":"Calculate torque from power and rotational speed.","category":"Engineering \u0026 Renewable Energy","keywords":"Motor Torque Calculator Engineering \u0026 Renewable Energy Calculate torque from power and rotational speed. Engineering \u0026 Renewable Energy","url":"tools/motor-torque-calculator.html"},{"title":"Gear Ratio Calculator","description":"Calculate gear ratio from driven and driver tooth counts.","category":"Engineering \u0026 Renewable Energy","keywords":"Gear Ratio Calculator Engineering \u0026 Renewable Energy Calculate gear ratio from driven and driver tooth counts. Engineering \u0026 Renewable Energy","url":"tools/gear-ratio-calculator.html"},{"title":"Mechanical Efficiency Calculator","description":"Calculate output/input efficiency.","category":"Engineering \u0026 Renewable Energy","keywords":"Mechanical Efficiency Calculator Engineering \u0026 Renewable Energy Calculate output/input efficiency. Engineering \u0026 Renewable Energy","url":"tools/mechanical-efficiency-calculator.html"},{"title":"Hydraulic Pressure Calculator","description":"Calculate pressure from force and piston area.","category":"Engineering \u0026 Renewable Energy","keywords":"Hydraulic Pressure Calculator Engineering \u0026 Renewable Energy Calculate pressure from force and piston area. Engineering \u0026 Renewable Energy","url":"tools/hydraulic-pressure-calculator.html"},{"title":"Pump Hydraulic Power Calculator","description":"Estimate hydraulic power from pressure and flow rate.","category":"Engineering \u0026 Renewable Energy","keywords":"Pump Hydraulic Power Calculator Engineering \u0026 Renewable Energy Estimate hydraulic power from pressure and flow rate. Engineering \u0026 Renewable Energy","url":"tools/pump-hydraulic-power-calculator.html"},{"title":"Number System Converter","description":"Convert integers between common number bases and perform exact arithmetic.","category":"Computer Science \u0026 Digital Tools","keywords":"Number System Converter Computer Science \u0026 Digital Tools Convert integers between common number bases and perform exact arithmetic. Computer Science \u0026 Digital Tools","url":"tools/number-system-converter.html"},{"title":"Two’s Complement Converter","description":"Encode a signed integer as fixed-width two’s-complement binary and hexadecimal.","category":"Computer Science \u0026 Digital Tools","keywords":"Two’s Complement Converter Computer Science \u0026 Digital Tools Encode a signed integer as fixed-width two’s-complement binary and hexadecimal. Computer Science \u0026 Digital Tools","url":"tools/twos-complement-converter.html"},{"title":"IEEE 754 Float32 Converter","description":"Encode or decode IEEE 754 32-bit floating-point values.","category":"Computer Science \u0026 Digital Tools","keywords":"IEEE 754 Float32 Converter Computer Science \u0026 Digital Tools Encode or decode IEEE 754 32-bit floating-point values. Computer Science \u0026 Digital Tools","url":"tools/ieee-754-converter.html"},{"title":"Binary Fraction Converter","description":"Convert binary fractions to decimal or approximate decimal values to binary.","category":"Computer Science \u0026 Digital Tools","keywords":"Binary Fraction Converter Computer Science \u0026 Digital Tools Convert binary fractions to decimal or approximate decimal values to binary. Computer Science \u0026 Digital Tools","url":"tools/binary-fraction-converter.html"},{"title":"ASCII and Unicode Converter","description":"Inspect text as Unicode code points or decode decimal and hexadecimal code points.","category":"Computer Science \u0026 Digital Tools","keywords":"ASCII and Unicode Converter Computer Science \u0026 Digital Tools Inspect text as Unicode code points or decode decimal and hexadecimal code points. Computer Science \u0026 Digital Tools","url":"tools/ascii-unicode-converter.html"},{"title":"Bitwise AND Calculator","description":"Calculate bitwise AND of two non-negative integers.","category":"Computer Science \u0026 Digital Tools","keywords":"Bitwise AND Calculator Computer Science \u0026 Digital Calculate bitwise AND of two non-negative integers. Computer Science \u0026 Digital Tools","url":"tools/bitwise-and-calculator.html"},{"title":"Download Time Calculator","description":"Estimate download time from file size and connection speed.","category":"Computer Science \u0026 Digital Tools","keywords":"Download Time Calculator Computer Science \u0026 Digital Estimate download time from file size and connection speed. Computer Science \u0026 Digital Tools","url":"tools/download-time-calculator.html"},{"title":"Data Transfer Speed Calculator","description":"Calculate data rate from transferred data and elapsed time.","category":"Computer Science \u0026 Digital Tools","keywords":"Data Transfer Speed Calculator Computer Science \u0026 Digital Calculate data rate from transferred data and elapsed time. Computer Science \u0026 Digital Tools","url":"tools/data-transfer-speed-calculator.html"},{"title":"IPv4 CIDR Host Count Calculator","description":"Estimate usable IPv4 hosts for a CIDR prefix from /0 to /32.","category":"Computer Science \u0026 Digital Tools","keywords":"IPv4 CIDR Host Count Calculator Computer Science \u0026 Digital Estimate usable IPv4 hosts for a CIDR prefix from /0 to /32. Computer Science \u0026 Digital Tools","url":"tools/ipv4-cidr-host-count-calculator.html"},{"title":"Subnet Mask from Prefix Calculator","description":"Convert an IPv4 CIDR prefix length to dotted decimal subnet mask.","category":"Computer Science \u0026 Digital Tools","keywords":"Subnet Mask from Prefix Calculator Computer Science \u0026 Digital Convert an IPv4 CIDR prefix length to dotted decimal subnet mask. Computer Science \u0026 Digital Tools","url":"tools/subnet-mask-from-prefix-calculator.html"},{"title":"Molarity Calculator","description":"Calculate molarity from moles of solute and solution volume.","category":"Chemistry","keywords":"Molarity Calculator Chemistry Calculate molarity from moles of solute and solution volume. Chemistry","url":"tools/molarity-calculator.html"},{"title":"Mole Calculator","description":"Calculate amount in moles from mass and molar mass.","category":"Chemistry","keywords":"Mole Calculator Chemistry Calculate amount in moles from mass and molar mass. Chemistry","url":"tools/mole-calculator.html"},{"title":"Molecular Weight Calculator","description":"Calculate total molar mass from number of atoms and atomic mass for a single element.","category":"Chemistry","keywords":"Molecular Weight Calculator Chemistry Calculate total molar mass from number of atoms and atomic mass for a single element. Chemistry","url":"tools/molecular-weight-calculator.html"},{"title":"Dilution Calculator","description":"Calculate final concentration using C1V1=C2V2.","category":"Chemistry","keywords":"Dilution Calculator Chemistry Calculate final concentration using C1V1=C2V2. Chemistry","url":"tools/dilution-calculator.html"},{"title":"pH from Hydrogen Ion Concentration","description":"Calculate pH from hydrogen ion concentration.","category":"Chemistry","keywords":"pH from Hydrogen Ion Concentration Chemistry Calculate pH from hydrogen ion concentration. Chemistry","url":"tools/ph-from-hydrogen-ion-concentration.html"},{"title":"Marla Kanal Square Feet Converter","description":"Convert common Pakistan land area units using the selected local standard of 272.25 square feet per marla.","category":"Everyday Calculators","keywords":"Marla Kanal Square Feet Converter Everyday Calculators Convert common Pakistan land area units using the selected local standard of 272.25 square feet per marla. Everyday Calculators","url":"tools/marla-kanal-square-feet-converter.html"},{"title":"Electricity Bill Calculator","description":"Estimate electricity bill using units consumed and an editable per-unit rate.","category":"Everyday Calculators","keywords":"Electricity Bill Calculator Everyday Calculators Estimate electricity bill using units consumed and an editable per-unit rate. Everyday Calculators","url":"tools/electricity-bill-calculator.html"},{"title":"Gold Weight Converter","description":"Convert gold weight between grams, tola and troy ounces.","category":"Everyday Calculators","keywords":"Gold Weight Converter Everyday Calculators Convert gold weight between grams, tola and troy ounces. Everyday Calculators","url":"tools/gold-weight-converter.html"},{"title":"Zakat Calculator","description":"Estimate 2.5% zakat on eligible net zakatable assets; confirm nisab and rulings locally.","category":"Everyday Calculators","keywords":"Zakat Calculator Everyday Calculators Estimate 2.5% zakat on eligible net zakatable assets; confirm nisab and rulings locally. Everyday Calculators","url":"tools/zakat-calculator.html"},{"title":"WAPDA Unit Cost Estimator","description":"Estimate bill from user-entered energy units and effective rate; tariffs vary by category and taxes.","category":"Everyday Calculators","keywords":"WAPDA Unit Cost Estimator Everyday Calculators Estimate bill from user-entered energy units and effective rate; tariffs vary by category and taxes. Everyday Calculators","url":"tools/wapda-unit-cost-estimator.html"},{"title":"Solar System Cost Estimator","description":"Estimate installed solar system cost from capacity and cost per watt.","category":"Everyday Calculators","keywords":"Solar System Cost Estimator Everyday Calculators Estimate installed solar system cost from capacity and cost per watt. Everyday Calculators","url":"tools/solar-system-cost-estimator.html"},{"title":"Petrol Fuel Cost Calculator","description":"Calculate trip fuel cost from distance, fuel economy and fuel price.","category":"Everyday Calculators","keywords":"Petrol Fuel Cost Calculator Everyday Calculators Calculate trip fuel cost from distance, fuel economy and fuel price. Everyday Calculators","url":"tools/petrol-fuel-cost-calculator.html"},{"title":"Travel Fuel Average Calculator","description":"Calculate vehicle fuel economy from distance traveled and fuel used.","category":"Everyday Calculators","keywords":"Travel Fuel Average Calculator Everyday Calculators Calculate vehicle fuel economy from distance traveled and fuel used. Everyday Calculators","url":"tools/travel-fuel-average-calculator.html"},{"title":"Construction Material Estimator","description":"Estimate material quantity from area and per-unit consumption rate.","category":"Everyday Calculators","keywords":"Construction Material Estimator Everyday Calculators Estimate material quantity from area and per-unit consumption rate. Everyday Calculators","url":"tools/construction-material-estimator.html"},{"title":"Water Tank Capacity Calculator","description":"Calculate rectangular water tank volume and approximate liters.","category":"Everyday Calculators","keywords":"Water Tank Capacity Calculator Everyday Calculators Calculate rectangular water tank volume and approximate liters. Everyday Calculators","url":"tools/water-tank-capacity-calculator.html"},{"title":"Gross Margin Calculator","description":"Calculate gross margin percentage from selling price and cost.","category":"Business \u0026 Productivity","keywords":"Gross Margin Calculator Business \u0026 Productivity Calculate gross margin percentage from selling price and cost. Business \u0026 Productivity","url":"tools/gross-margin-calculator.html"},{"title":"Inventory Turnover Calculator","description":"Calculate inventory turnover from cost of goods sold and average inventory.","category":"Business \u0026 Productivity","keywords":"Inventory Turnover Calculator Business \u0026 Productivity Calculate inventory turnover from cost of goods sold and average inventory. Business \u0026 Productivity","url":"tools/inventory-turnover-calculator.html"},{"title":"Days Inventory Outstanding Calculator","description":"Estimate days inventory is held based on average inventory and COGS.","category":"Business \u0026 Productivity","keywords":"Days Inventory Outstanding Calculator Business \u0026 Productivity Estimate days inventory is held based on average inventory and COGS. Business \u0026 Productivity","url":"tools/days-inventory-outstanding-calculator.html"},{"title":"Operating Margin Calculator","description":"Calculate operating margin from operating income and revenue.","category":"Business \u0026 Productivity","keywords":"Operating Margin Calculator Business \u0026 Productivity Calculate operating margin from operating income and revenue. Business \u0026 Productivity","url":"tools/operating-margin-calculator.html"},{"title":"Hourly Wage with Overtime Calculator","description":"Estimate weekly pay with a user-entered overtime multiplier.","category":"Business \u0026 Productivity","keywords":"Hourly Wage with Overtime Calculator Business \u0026 Productivity Estimate weekly pay with a user-entered overtime multiplier. Business \u0026 Productivity","url":"tools/hourly-wage-with-overtime-calculator.html"},{"title":"Current Feedback Circuit Calculator","description":"Calculate ideal negative current-feedback gain, output current, feedback current and error current with a signed block model.","category":"Electricity & Electronics","keywords":"current feedback circuit negative feedback current amplifier Ai beta loop gain closed-loop current gain input output error current mA A Electricity & Electronics","url":"tools/current-feedback-calculator.html"},{"title":"Voltage Feedback Circuit Calculator","description":"Calculate ideal negative voltage-feedback gain, output voltage, feedback voltage and error voltage from Av, beta and input voltage.","category":"Electricity & Electronics","keywords":"voltage feedback circuit negative feedback amplifier Av beta loop gain closed-loop voltage gain input output error voltage V mV Electricity & Electronics","url":"tools/voltage-feedback-calculator.html"}];

  if (!Array.isArray(SEARCH_INDEX) || !SEARCH_INDEX.length || new Set(SEARCH_INDEX.map(item => item.url)).size !== SEARCH_INDEX.length) {
    console.error('Caluler search index validation failed.');
    return;
  }

  // The search inventory is the shared source of displayed tool totals.
  window.calulerToolInventory = Object.freeze(SEARCH_INDEX.map(item => Object.freeze({...item})));
  function syncInventoryCounts() {
    const count = window.calulerToolInventory.length;
    document.querySelectorAll('a[href]').forEach(anchor => {
      const label = anchor.querySelector('span') || anchor;
      if (/^(?:Browse )?All(?: \d+)? Tools$/i.test(anchor.textContent.trim())) {
        label.textContent = (/^Browse /i.test(anchor.textContent.trim()) ? 'Browse All ' : 'All ') + count + ' Tools';
      }
    });
    document.querySelectorAll('input[placeholder]').forEach(input => {
      input.placeholder = input.placeholder.replace(/\b\d+(?=\s+(?:calculators|tools))/i,String(count));
    });
    document.querySelectorAll('.caluler-free-tools-badge-v13,[data-caluler-tool-count]').forEach(badge => {
      const walker = document.createTreeWalker(badge,NodeFilter.SHOW_TEXT); let text;
      while ((text = walker.nextNode())) if (/^\s*\d+\s+tools\b/i.test(text.nodeValue)) text.nodeValue = text.nodeValue.replace(/\d+/,String(count));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',syncInventoryCounts,{once:true});
  else syncInventoryCounts();
  window.addEventListener('pageshow',syncInventoryCounts);

  function normalize(value) {
    return String(value || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\w\u0600-\u06ff\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function scoreItem(item, query) {
    const title = normalize(item.title);
    const keywords = normalize(item.keywords);
    const description = normalize(item.description);
    const category = normalize(item.category);

    let score = 0;

    if (title === query) score += 180;
    if (title.startsWith(query)) score += 90;
    if (title.includes(query)) score += 55;
    if (keywords.includes(query)) score += 25;
    if (description.includes(query)) score += 20;
    if (category.includes(query)) score += 15;

    const tokens = query.split(' ').filter(Boolean);
    let hits = 0;

    tokens.forEach(function (token) {
      if (title.includes(token)) {
        score += 22;
        hits++;
      } else if (keywords.includes(token)) {
        score += 12;
        hits++;
      } else if (description.includes(token) || category.includes(token)) {
        score += 5;
        hits++;
      }
    });

    if (tokens.length && hits === tokens.length) score += 20;

    return score;
  }

  function createSearchButton() {
    const button = document.createElement('button');
    button.type = 'submit';
    button.setAttribute('aria-label', 'Search all calculators');
    button.title = 'Search all calculators';

    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<circle cx="10.8" cy="10.8" r="6.8"></circle>' +
      '<path d="m16 16 5 5"></path></svg>';

    return button;
  }

  function initialise() {
    const nav = document.querySelector('.nav .nav-inner');

    if (!nav || nav.dataset.calulerSearchV2 === 'ready') return;

    const logo = Array.from(nav.children).find(function (element) {
      return element.classList && element.classList.contains('logo');
    });

    const utility = Array.from(nav.children).find(function (element) {
      return element.classList &&
        element.classList.contains('caluler-utility-controls');
    });

    const toolsLink = Array.from(nav.querySelectorAll('a')).find(function (link) {
      const href = (link.getAttribute('href') || '').split(/[?#]/)[0];
      return /(^|\/)tools\.html$/i.test(href);
    });

    if (!logo || !utility || !toolsLink) {
      console.error('Caluler header search: existing header could not be verified.');
      return;
    }

    if (nav.querySelector('.caluler-global-search')) {
      nav.dataset.calulerSearchV2 = 'ready';
      return;
    }

    const toolsHref = toolsLink.getAttribute('href');

    const host = document.createElement('div');
    host.className = 'caluler-global-search';

    const existingHomeForm = document.getElementById('calulerHomeToolSearch');

    let form;
    let input;
    let button;

    if (existingHomeForm) {
      // Move the existing homepage form into the shared header.
      // This prevents two visible search bars on the homepage.
      form = existingHomeForm;
      form.classList.remove('caluler-home-tool-search');
      form.classList.add('caluler-global-search-form');

      const label = form.querySelector('label');
      if (label) label.classList.add('caluler-global-search-sr-only');

      const oldIcon = form.querySelector('.caluler-home-search-icon');

      if (oldIcon) oldIcon.classList.add('caluler-global-search-icon');

      input = form.querySelector('input[type="search"]');
      button = form.querySelector('button[type="submit"]');

      if (button) {
        const replacement = createSearchButton();
        button.replaceWith(replacement);
        button = replacement;
      }
    } else {
      form = document.createElement('form');
      form.className = 'caluler-global-search-form';

      const label = document.createElement('label');
      label.className = 'caluler-global-search-sr-only';
      label.textContent = 'Search all calculators and tools';

      input = document.createElement('input');
      input.id = 'calulerGlobalSearchInput';

      const icon = document.createElement('span');
      icon.className = 'caluler-global-search-icon';
      icon.setAttribute('aria-hidden', 'true');

      button = createSearchButton();

      form.append(label, icon, input, button);
    }

    form.action = toolsHref;
    form.method = 'get';
    form.setAttribute('role', 'search');
    form.setAttribute('autocomplete', 'off');

    if (!input) {
      console.error('Caluler header search input could not be identified.');
      return;
    }

    if (!input.id) input.id = 'calulerGlobalSearchInput';

    const label = form.querySelector('label');

    if (label) label.setAttribute('for', input.id);

    input.name = 'q';
    input.type = 'search';
    input.maxLength = 100;
    input.placeholder = 'Search calculators and tools...';
    input.setAttribute('aria-label', 'Search all calculators and tools');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', 'calulerGlobalSearchResults');
    input.setAttribute('aria-expanded', 'false');

    const results = document.createElement('div');
    results.className = 'caluler-global-search-results';
    results.id = 'calulerGlobalSearchResults';
    results.setAttribute('role', 'listbox');
    results.setAttribute('aria-label', 'Calculator search suggestions');
    results.hidden = true;

    host.append(form, results);

    // Keep search directly after the logo.
    nav.insertBefore(host, utility);
    nav.dataset.calulerSearchV2 = 'ready';

    const toolsPage = new URL(toolsHref, window.location.href);
    const siteRoot = new URL('.', toolsPage);

    const initialQuery = new URLSearchParams(window.location.search).get('q');

    if (initialQuery) input.value = initialQuery.slice(0, 100);

    function closeResults() {
      results.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }

    function renderResults() {
      const query = normalize(input.value);
      results.replaceChildren();

      if (!query) {
        closeResults();
        return;
      }

      const matches = SEARCH_INDEX.map(function (item) {
        return {
          item: item,
          score: scoreItem(item, query)
        };
      })
      .filter(function (entry) {
        return entry.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score ||
          a.item.title.localeCompare(b.item.title);
      })
      .slice(0, 7);

      if (!matches.length) {
        const empty = document.createElement('div');
        empty.className = 'caluler-global-search-empty';
        empty.textContent =
          'No matching calculators. Press Enter to search the full directory.';
        empty.setAttribute('role', 'status');
        results.appendChild(empty);
      } else {
        matches.forEach(function (entry) {
          const item = entry.item;

          const link = document.createElement('a');
          link.className = 'caluler-global-search-result';
          link.setAttribute('role', 'option');
          link.href = new URL(item.url, siteRoot).href;

          const title = document.createElement('span');
          title.className = 'caluler-global-search-result-title';
          title.textContent = item.title;

          const description = document.createElement('span');
          description.className = 'caluler-global-search-result-description';
          description.textContent = item.description;

          const category = document.createElement('span');
          category.className = 'caluler-global-search-result-category';
          category.textContent = item.category;

          link.append(title, description, category);
          results.appendChild(link);
        });
      }

      results.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    input.addEventListener('input', renderResults);

    input.addEventListener('focus', function () {
      if (input.value.trim()) renderResults();
    });

    input.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeResults();
        return;
      }

      if (event.key === 'ArrowDown') {
        const first = results.querySelector('a.caluler-global-search-result');

        if (first && !results.hidden) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    results.addEventListener('keydown', function (event) {
      const links = Array.from(
        results.querySelectorAll('a.caluler-global-search-result')
      );

      const current = links.indexOf(document.activeElement);

      if (event.key === 'Escape') {
        closeResults();
        input.focus();
      }

      if (
        event.key === 'ArrowDown' &&
        current >= 0 &&
        current < links.length - 1
      ) {
        event.preventDefault();
        links[current + 1].focus();
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();

        if (current <= 0) input.focus();
        else links[current - 1].focus();
      }
    });

    form.addEventListener('submit', function (event) {
      if (!input.value.trim()) {
        event.preventDefault();
        closeResults();
        input.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (!host.contains(event.target) && !host.calulerSearchPanel?.contains(event.target)) closeResults();
    });

    if (initialQuery) renderResults();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})();
/* CALULER-TOP-NAV-V3 */
(function () {
  'use strict';
  if (window.__calulerTopNavV3) return;
  window.__calulerTopNavV3 = true;

  const CATEGORIES = ["Health Calculators","Finance Calculators","Business \u0026 Productivity","Mathematics","Education Tools","Date \u0026 Time Tools","Conversion Tools","Text \u0026 Productivity","Physics \u0026 Electromagnetism","Electricity \u0026 Electronics","Engineering \u0026 Renewable Energy","Computer Science \u0026 Digital Tools","Chemistry","Everyday Calculators"];
  const FEATURED = [{"title":"Free Online Age Calculator","url":"tools/age-calculator.html"},{"title":"BMI Calculator","url":"tools/bmi-calculator.html"},{"title":"Percentage Calculator","url":"tools/percentage-calculator.html"},{"title":"EMI \u0026 Loan Amortization Calculator","url":"tools/emi-calculator.html"}];

  const pathOf = value => String(value || '')
    .toLowerCase().split(/[?#]/)[0].replace(/\\/g, '/');

  const makeLink = (href, label, cls) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.className = cls || 'caluler-nav-link';
    return a;
  };

  function dropdown(label, entries, extraClass) {
    const wrap = document.createElement('div');
    wrap.className = 'caluler-nav-dropdown ' + (extraClass || '');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'caluler-nav-link caluler-nav-dropdown-trigger';
    btn.append(document.createTextNode(label));

    const arrow = document.createElement('span');
    arrow.className = 'caluler-nav-chevron';
    arrow.setAttribute('aria-hidden','true');
    arrow.textContent = '⌄';
    btn.appendChild(arrow);
    btn.setAttribute('aria-haspopup','true');
    btn.setAttribute('aria-expanded','false');

    const panel = document.createElement('div');
    panel.className = 'caluler-nav-dropdown-panel';
    panel.setAttribute('aria-label',label);

    entries.forEach(entry => {
      if (entry.heading) {
        const h = document.createElement('div');
        h.className = 'caluler-nav-dropdown-heading';
        h.textContent = entry.label;
        panel.appendChild(h);
      } else {
        panel.appendChild(makeLink(
          entry.href,entry.label,'caluler-nav-dropdown-link'
        ));
      }
    });

    btn.addEventListener('click',e => {
      e.preventDefault();
      const open = !wrap.classList.contains('is-open');

      wrap.parentElement.querySelectorAll(
        '.caluler-nav-dropdown.is-open'
      ).forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('button')?.setAttribute(
          'aria-expanded','false'
        );
      });

      wrap.classList.toggle('is-open',open);
      btn.setAttribute('aria-expanded',String(open));
    });

    wrap.append(btn,panel);
    return wrap;
  }

  function build() {
    const nav = document.querySelector('.nav .nav-inner, .nav-inner');
    if (!nav || nav.dataset.calulerTopNavV3 === 'ready') return true;

    const logo = Array.from(nav.children).find(n =>
      n.classList?.contains('logo')
    );

    const search = nav.querySelector(':scope > .caluler-global-search');
    const utility = nav.querySelector(':scope > .caluler-utility-controls');
    const siteMenu = nav.querySelector(':scope > .caluler-site-menu');
    const oldNav = nav.querySelector('.nav-links');
    const panel = siteMenu?.querySelector('.caluler-site-menu-panel');

    if (!logo || !search || !utility || !panel) return false;

    const links = Array.from(new Set([
      ...panel.querySelectorAll('a[href]'),
      ...(oldNav ? oldNav.querySelectorAll('a[href]') : [])
    ]));

    const find = file => links.find(a =>
      pathOf(a.href || a.getAttribute('href')).endsWith(file)
    );

    const tools = find('tools.html');
    const about = find('about.html');
    const contact = find('contact.html');
    const privacy = find('privacy.html');

    if (!tools || !about || !contact || !privacy) return false;

    const form = search.querySelector('form');
    const input = search.querySelector('input[type="search"]');
    const submit = form?.querySelector('button[type="submit"]');

    if (!form || !input || !submit) return false;

    const primary = document.createElement('div');
    primary.className = 'caluler-primary-nav';
    primary.setAttribute('aria-label','Main navigation');

    const home = makeLink(logo.href,'Home');
    primary.appendChild(home);

    const allToolsUrl = new URL(tools.href,location.href);
    allToolsUrl.searchParams.set('category','All');

    const toolEntries = [
      {href:allToolsUrl.href,label:'All tools'},
    ];

    FEATURED.forEach(t => toolEntries.push({
      href:new URL(t.url,new URL(tools.href,location.href)).href,
      label:t.title
    }));

    primary.appendChild(dropdown(
      'Tools',toolEntries,'caluler-tools-dropdown'
    ));

    const categoryEntries = CATEGORIES.map(c => {
      const u = new URL(tools.href,location.href);
      u.searchParams.set('category',c);
      return {href:u.href,label:c};
    });

    primary.appendChild(dropdown(
      'Categories',categoryEntries,'caluler-categories-dropdown'
    ));

    primary.append(
      makeLink(about.href,'About'),
      makeLink(contact.href,'Contact'),
      makeLink(privacy.href,'Privacy')
    );

    logo.insertAdjacentElement('afterend',primary);
    primary.insertAdjacentElement('afterend',search);
    search.insertAdjacentElement('afterend',utility);

    siteMenu.remove();
    if (oldNav) oldNav.remove();
    nav.querySelector(':scope > .menu-toggle')?.remove();

    const mobile = document.createElement('button');
    mobile.type = 'button';
    mobile.className = 'caluler-primary-mobile-toggle';
    mobile.setAttribute('aria-label','Open main menu');
    mobile.setAttribute('aria-expanded','false');
    mobile.innerHTML =
      '<span aria-hidden="true"><i></i><i></i><i></i></span><b>Menu</b>';

    utility.insertAdjacentElement('afterend',mobile);

    mobile.addEventListener('click',() => {
      const navRoot = nav.closest('.nav') || nav;
      const open = !navRoot.classList.contains('caluler-mobile-nav-open');
      navRoot.classList.toggle('caluler-mobile-nav-open',open);
      mobile.setAttribute('aria-expanded',String(open));
      mobile.setAttribute(
        'aria-label',open ? 'Close main menu' : 'Open main menu'
      );
    });

    if (!search.dataset.calulerTopSearchV3) {
      search.dataset.calulerTopSearchV3 = 'ready';
      const results = search.querySelector('.caluler-global-search-results');
      const searchPanel = document.createElement('div');
      searchPanel.id = 'calulerHeaderSearchPanel';
      searchPanel.className = 'caluler-header-search-panel';
      searchPanel.hidden = true;
      searchPanel.inert = true;
      searchPanel.setAttribute('aria-hidden','true');
      const content = document.createElement('div');
      content.className = 'caluler-header-search-content';
      searchPanel.append(content);
      content.append(form,results);
      nav.closest('.nav').append(searchPanel);
      search.calulerSearchPanel = searchPanel;
      results.hidden = true;
      input.setAttribute('aria-expanded','false');

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'caluler-search-toggle';
      toggle.innerHTML = submit.innerHTML;
      toggle.setAttribute('aria-label','Open search');
      toggle.setAttribute('aria-controls',searchPanel.id);
      toggle.setAttribute('aria-expanded','false');
      toggle.title = 'Open search';
      search.append(toggle);
      // Keep the original native submit control: Enter uses the existing GET search.
      submit.hidden = true;
      submit.tabIndex = -1;
      const makeControl = (className,label,path) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = className;
        button.setAttribute('aria-label',label);
        button.title = label;
        button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + path + '"/></svg>';
        return button;
      };
      const clear = makeControl('caluler-search-clear','Clear search query','M8 8l8 8M16 8l-8 8');
      const close = makeControl('caluler-search-close','Close search','M6 6l12 12M18 6L6 18');
      form.append(clear,close);
      const syncClear = () => { clear.hidden = !input.value; };
      syncClear();

      const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let opened = false;
      let closeTimer = 0;
      let measureFrame = 0;
      const measure = () => {
        measureFrame = 0;
        if (!opened) return;
        const height = Math.ceil(content.getBoundingClientRect().height);
        if (searchPanel.style.height !== height + 'px') {
          searchPanel.dataset.settled = motion.matches ? 'true' : 'false';
          searchPanel.style.height = height + 'px';
        }
      };
      const queueMeasure = () => {
        if (opened && !measureFrame) measureFrame = requestAnimationFrame(measure);
      };
      const setOpen = (next,restoreFocus = false) => {
        opened = next;
        clearTimeout(closeTimer);
        cancelAnimationFrame(measureFrame);
        measureFrame = 0;
        toggle.setAttribute('aria-expanded',String(next));
        toggle.setAttribute('aria-label',next ? 'Close search' : 'Open search');
        toggle.title = next ? 'Close search' : 'Open search';
        searchPanel.inert = !next;
        searchPanel.setAttribute('aria-hidden',String(!next));
        searchPanel.dataset.settled = 'false';
        if (next) {
          searchPanel.hidden = false;
          // Establish the collapsed start once; subsequent measurements are RAF-coalesced.
          void searchPanel.offsetHeight;
          searchPanel.classList.add('is-open');
          syncClear();
          input.focus({preventScroll:true});
          queueMeasure();
        } else {
          searchPanel.classList.remove('is-open');
          searchPanel.style.height = '0px';
          results.hidden = true;
          input.setAttribute('aria-expanded','false');
          if (restoreFocus) toggle.focus({preventScroll:true});
          if (motion.matches) searchPanel.hidden = true;
          else closeTimer = setTimeout(() => {
            if (!opened) searchPanel.hidden = true;
          },200);
        }
      };
      toggle.addEventListener('click',() => setOpen(!opened));
      close.addEventListener('click',() => setOpen(false,true));
      clear.addEventListener('click',() => {
        input.value = '';
        input.dispatchEvent(new Event('input',{bubbles:true}));
        input.focus({preventScroll:true});
      });
      input.addEventListener('input',() => { syncClear(); queueMeasure(); });
      input.addEventListener('focus',queueMeasure);
      searchPanel.addEventListener('keydown',event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setOpen(false,true);
        }
      });
      searchPanel.addEventListener('transitionend',event => {
        if (event.target === searchPanel && event.propertyName === 'height' && opened) {
          searchPanel.dataset.settled = 'true';
        }
      });
      document.addEventListener('click',event => {
        if (opened && !search.contains(event.target) && !searchPanel.contains(event.target)) {
          setOpen(false);
        }
      });
      window.addEventListener('resize',queueMeasure,{passive:true});
      if (typeof ResizeObserver !== 'undefined') new ResizeObserver(queueMeasure).observe(content);
    }

    document.addEventListener('click',e => {
      if (!primary.contains(e.target)) {
        primary.querySelectorAll(
          '.caluler-nav-dropdown.is-open'
        ).forEach(d => {
          d.classList.remove('is-open');
          d.querySelector('button')?.setAttribute(
            'aria-expanded','false'
          );
        });
      }
      if (!nav.contains(e.target)) {
        nav.classList.remove('caluler-mobile-nav-open');
        mobile.setAttribute('aria-expanded','false');
      }
    });

    primary.addEventListener('keydown',e => {
      if (e.key === 'Escape') {
        primary.querySelectorAll(
          '.caluler-nav-dropdown.is-open'
        ).forEach(d => {
          d.classList.remove('is-open');
          d.querySelector('button')?.setAttribute(
            'aria-expanded','false'
          );
        });
        nav.classList.remove('caluler-mobile-nav-open');
        mobile.setAttribute('aria-expanded','false');
      }
    });

    primary.querySelectorAll('a').forEach(a => {
      a.addEventListener('click',() => {
        nav.classList.remove('caluler-mobile-nav-open');
        mobile.setAttribute('aria-expanded','false');
      });
    });

    const current = pathOf(location.pathname);
    if (current.endsWith('/index.html') || current.endsWith('/')) {
      home.classList.add('is-current');
    }
    if (
      current.endsWith('/tools.html') ||
      /\/tools\/[^/]+\.html$/.test(current)
    ) {
      primary.querySelector(
        '.caluler-tools-dropdown-trigger'
      )?.classList.add('is-current');
    }

    [about,contact,privacy].forEach(a => {
      if (pathOf(a.href) === current) {
        const target = Array.from(primary.querySelectorAll('a'))
          .find(x => pathOf(x.href) === current);
        target?.classList.add('is-current');
      }
    });

    nav.dataset.calulerTopNavV3 = 'ready';
    console.info('Caluler Top Navigation V3 ready.');
    return true;
  }

  function retry(n) {
    if (build()) return;
    if (n < 40) {
      window.setTimeout(() => retry(n + 1),50);
    } else {
      console.error(
        'Top Nav V3 stopped safely: required V2/V9 elements not found.'
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',() => {
      window.setTimeout(() => retry(0),0);
    },{once:true});
  } else {
    retry(0);
  }
})();

/* CALULER-FINANCE-READABLE-TYPOGRAPHY-V2 */
(function () {
  'use strict';

  const FINANCE_PATHS = ["/tools/compound-interest-calculator.html","/tools/savings-calculator.html","/tools/roi-calculator.html","/tools/sales-tax-calculator.html","/tools/commission-calculator.html","/tools/paycheck-calculator.html","/tools/debt-payoff-calculator.html","/tools/cash-flow-calculator.html","/tools/business-valuation-calculator.html","/tools/dividend-yield-calculator.html","/tools/currency-converter.html","/tools/discount-calculator.html","/tools/emi-calculator.html","/tools/profit-margin-calculator.html","/tools/tip-calculator.html","/tools/inflation-purchasing-power-calculator.html","/tools/net-worth-calculator.html","/tools/budget-allocation-calculator.html","/tools/emergency-fund-calculator.html","/tools/retirement-planner-calculator.html","/tools/loan-affordability-calculator.html","/tools/loan-to-value-calculator.html","/tools/credit-utilization-calculator.html","/tools/capital-gains-tax-calculator.html","/tools/bond-yield-calculator.html","/tools/portfolio-rebalancing-calculator.html","/tools/rental-property-yield-calculator.html","/tools/npv-irr-calculator.html","/tools/rent-vs-buy-calculator.html"];

  function applyFinanceTypography() {
    let path = window.location.pathname || '';

    try {
      path = decodeURIComponent(path);
    } catch (_) {}

    path = path.toLowerCase().replace(/\\/g, '/');

    const isFinance = FINANCE_PATHS.some(function (suffix) {
      return path.endsWith(suffix);
    });

    if (isFinance) {
      document.documentElement.setAttribute(
        'data-caluler-finance-font',
        'true'
      );
    }
  }

  applyFinanceTypography();
})();


/* CALULER-CATEGORY-ICONS-V2 */
(function () {
    'use strict';

    if (window.__calulerCategoryIconsV2) return;
    window.__calulerCategoryIconsV2 = true;

    const CATEGORIES = ["Health Calculators","Finance Calculators","Business \u0026 Productivity","Mathematics","Education Tools","Date \u0026 Time Tools","Conversion Tools","Text \u0026 Productivity","Physics \u0026 Electromagnetism","Electricity \u0026 Electronics","Engineering \u0026 Renewable Energy","Computer Science \u0026 Digital Tools","Chemistry","Everyday Calculators"];

    const ICONS = {
        heart:
            '<path d="M20.8 8.8c0 5.4-8.8 11-8.8 11S3.2 14.2 3.2 8.8a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6Z"/>' +
            '<path d="M3 12h4l2-3 3 6 2-3h7"/>',

        bank:
            '<path d="m3 10 9-7 9 7M4 10h16M5 10v9M9 10v9M15 10v9M19 10v9M3 21h18"/>',

        calculator:
            '<rect x="5" y="3" width="14" height="18" rx="2"/>' +
            '<path d="M8 7h8 M8 11h.01 M12 11h.01 M16 11h.01 M8 15h.01 M12 15h.01 M16 15h.01"/>',

        atom:
            '<ellipse cx="12" cy="12" rx="9" ry="3.8"/>' +
            '<ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)"/>' +
            '<ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)"/>' +
            '<circle cx="12" cy="12" r="1"/>',

        zap:
            '<path d="M13 2 4 14h7l-1 8 10-13h-7V2Z"/>',

        engineering:
            '<path d="M12 2 14 5l3-1 1 4 3 2-2 4 1 3-4 1-2 4-4-2-4 1-1-4-3-2 2-4-1-3 4-1 2-4Z"/>' +
            '<circle cx="12" cy="12" r="3"/>',

        conversion:
            '<path d="M17 2l4 4-4 4M3 6h18M7 22l-4-4 4-4M21 18H3"/>',

        briefcase:
            '<rect x="3" y="7" width="18" height="13" rx="2"/>' +
            '<path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/>',

        calendar:
            '<rect x="3" y="5" width="18" height="16" rx="2"/>' +
            '<path d="M16 3v4M8 3v4M3 10h18M8 14h3M8 17h3"/>',

        computer:
            '<rect x="3" y="4" width="18" height="13" rx="2"/>' +
            '<path d="M8 21h8M12 17v4M9 9l-2 2 2 2M15 9l2 2-2 2"/>',

        education:
            '<path d="m2 10 10-6 10 6-10 6-10-6Z"/>' +
            '<path d="M6 12v5c4 3 8 3 12 0v-5M22 10v6"/>',

        home:
            '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/>' +
            '<path d="M9 21v-8h6v8"/>',

        flask:
            '<path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/>' +
            '<path d="M8 15h8"/>',

        text:
            '<path d="M6 3h9l4 4v14H6zM14 3v5h5"/>' +
            '<path d="M9 12h7M9 16h7"/>'
    };

    const COLORS = {
        heart: '#0e8cbf',
        bank: '#21856e',
        calculator: '#667b94',
        atom: '#8176bd',
        zap: '#d89a25',
        engineering: '#4284a9',
        conversion: '#2385a8',
        briefcase: '#607d99',
        calendar: '#5784ab',
        computer: '#5b78a6',
        education: '#6685a5',
        home: '#70839a',
        flask: '#8b72b8',
        text: '#5b829d'
    };

    function normalize(value) {
        return String(value || '')
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g,'')
            .toLowerCase()
            .replace(/[^a-z0-9\s&]/g,'')
            .replace(/\s+/g,' ')
            .trim();
    }

    function keyFor(category) {
        const s = category.toLowerCase();

        if (/health|medical|fitness/.test(s)) return 'heart';
        if (/finance|money|bank/.test(s)) return 'bank';
        if (/mathematics|math/.test(s)) return 'calculator';
        if (/physics|electromagnet/.test(s)) return 'atom';
        if (/electric|electronic|circuit/.test(s)) return 'zap';
        if (/engineering|renewable/.test(s)) return 'engineering';
        if (/conversion|converter/.test(s)) return 'conversion';
        if (/business/.test(s)) return 'briefcase';
        if (/date|time|calendar/.test(s)) return 'calendar';
        if (/computer|digital|programming/.test(s)) return 'computer';
        if (/education|school|learning/.test(s)) return 'education';
        if (/everyday|daily|lifestyle/.test(s)) return 'home';
        if (/chemistry|chemical/.test(s)) return 'flask';
        if (/text|writing/.test(s)) return 'text';

        return '';
    }

    function decorate() {
        const panel = document.querySelector(
            '.caluler-categories-dropdown .caluler-nav-dropdown-panel'
        );

        if (!panel) return false;

        const links = Array.from(
            panel.querySelectorAll('.caluler-nav-dropdown-link')
        );

        if (!links.length) return false;

        const validNames = new Map(
            CATEGORIES.map(name => [normalize(name),name])
        );

        let count = 0;

        links.forEach(link => {
            if (link.dataset.calulerCategoryIconV2 === 'ready') {
                count++;
                return;
            }

            const rawName = (link.textContent || '').trim();
            const category = validNames.get(normalize(rawName));

            if (!category) return;

            const key = keyFor(category);
            if (!key || !ICONS[key]) return;

            const icon = document.createElement('span');
            icon.className = 'caluler-category-dropdown-icon';
            icon.setAttribute('aria-hidden','true');
            icon.style.color = COLORS[key];

            const svg = document.createElementNS(
                'http://www.w3.org/2000/svg','svg'
            );

            svg.setAttribute('viewBox','0 0 24 24');
            svg.setAttribute('width','21');
            svg.setAttribute('height','21');
            svg.setAttribute('fill','none');
            svg.setAttribute('stroke','currentColor');
            svg.setAttribute('stroke-width','1.8');
            svg.setAttribute('stroke-linecap','round');
            svg.setAttribute('stroke-linejoin','round');
            svg.setAttribute('focusable','false');

            // Predefined internal SVG paths only.
            svg.innerHTML = ICONS[key];

            const label = document.createElement('span');
            label.className = 'caluler-category-dropdown-label';
            label.textContent = category;

            icon.appendChild(svg);
            link.replaceChildren(icon,label);

            link.dataset.calulerCategoryIconV2 = 'ready';
            link.setAttribute('aria-label',category);
            count++;
        });

        if (count === CATEGORIES.length) {
            panel.dataset.calulerCategoryIconsV2 = 'ready';
            console.info(
                'Caluler category icons V2:',
                count,'categories decorated.'
            );
            return true;
        }

        return false;
    }

    let observer = null;
    let attempts = 0;

    function retry() {
        if (decorate()) {
            if (observer) observer.disconnect();
            return;
        }

        attempts++;

        if (attempts < 60) {
            window.setTimeout(retry,100);
        } else {
            console.warn(
                'Caluler category icons: dropdown did not become ready.'
            );
        }
    }

    function initialise() {
        retry();

        if (window.MutationObserver && document.body) {
            observer = new MutationObserver(function () {
                decorate();
            });

            observer.observe(document.body,{
                childList:true,
                subtree:true
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            initialise,
            {once:true}
        );
    } else {
        initialise();
    }
})();
/* END CALULER-CATEGORY-ICONS-V2 */
/* CALULER-MOBILE-SIDE-DRAWER-JS-V2 */
(function () {
  "use strict";

  if (window.__calulerMobileSideDrawerV2) return;

  function installDrawer() {
    var nav = document.querySelector('.nav .nav-inner, .nav-inner');
    if (!nav || !document.body) return false;

    var siteMenu = nav.querySelector('.caluler-site-menu');
    var trigger = siteMenu && siteMenu.querySelector('.caluler-site-menu-trigger');
    var panel = siteMenu && siteMenu.querySelector('.caluler-site-menu-panel');
    var logo = nav.querySelector(':scope > .logo') || nav.querySelector('.logo');
    var logoImage = logo && (logo.querySelector('img.logo-nav') || logo.querySelector('img'));

    if (!siteMenu || !trigger || !panel || !logo || !logoImage) return false;

    if (!panel.querySelector('.caluler-mobile-drawer-header')) {
      var header = document.createElement('div');
      header.className = 'caluler-mobile-drawer-header';

      var brand = document.createElement('a');
      brand.className = 'caluler-mobile-drawer-brand';
      brand.href = logo.getAttribute('href') || 'index.html';
      brand.setAttribute('aria-label', 'Caluler home');

      var brandImage = logoImage.cloneNode(true);
      brandImage.removeAttribute('id');
      brand.appendChild(brandImage);

      var closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.className = 'caluler-mobile-drawer-close';
      closeButton.setAttribute('aria-label', 'Close navigation menu');
      closeButton.setAttribute('title', 'Close menu');
      closeButton.textContent = '\u00D7';

      header.appendChild(brand);
      header.appendChild(closeButton);

      var section = document.createElement('div');
      section.className = 'caluler-mobile-drawer-section';
      section.textContent = 'Pages';

      panel.insertBefore(section, panel.firstChild);
      panel.insertBefore(header, panel.firstChild);
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Caluler site navigation');

    }

    var closeButtonReady = panel.querySelector('.caluler-mobile-drawer-close');
    var backdrop = document.querySelector('.caluler-mobile-drawer-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'caluler-mobile-drawer-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      backdrop.tabIndex = -1;
      document.body.appendChild(backdrop);
    }

    function isMobile() {
      return window.matchMedia
        ? window.matchMedia('(max-width: 900px)').matches
        : window.innerWidth <= 900;
    }

    function syncDrawerState() {
      var open = isMobile() && siteMenu.classList.contains('is-open');
      document.body.classList.toggle('caluler-mobile-drawer-open', open);
      backdrop.setAttribute('aria-hidden', String(!open));
      trigger.setAttribute('aria-expanded', String(open));
      if (open) {
        panel.setAttribute('aria-modal', 'true');
      } else {
        panel.removeAttribute('aria-modal');
      }
    }

    function closeDrawer(returnFocus) {
      siteMenu.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Open navigation menu');
      syncDrawerState();
      if (returnFocus && isMobile()) trigger.focus();
    }

    if (!siteMenu.dataset.calulerDrawerBound) {
      siteMenu.dataset.calulerDrawerBound = 'true';

      if (closeButtonReady) {
        closeButtonReady.addEventListener('click', function () {
          closeDrawer(true);
        });
      }

      backdrop.addEventListener('click', function () {
        closeDrawer(true);
      });

      trigger.addEventListener('click', function () {
        window.requestAnimationFrame(syncDrawerState);
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && siteMenu.classList.contains('is-open') && isMobile()) {
          event.preventDefault();
          closeDrawer(true);
        }
      });

      var stateObserver = new MutationObserver(syncDrawerState);
      stateObserver.observe(siteMenu, { attributes: true, attributeFilter: ['class'] });
      window.addEventListener('resize', syncDrawerState, { passive: true });
      window.addEventListener('orientationchange', syncDrawerState, { passive: true });
    }

    syncDrawerState();
    window.__calulerMobileSideDrawerV2 = true;
    console.info('Caluler mobile side drawer V2 ready: V9 menu detected.');
    return true;
  }

  function startDrawerObserver() {
    if (installDrawer()) return;

    var root = document.documentElement;
    if (!root) {
      document.addEventListener('DOMContentLoaded', startDrawerObserver, { once: true });
      return;
    }

    var observer = new MutationObserver(function () {
      if (installDrawer()) {
        observer.disconnect();
        window.clearTimeout(timeoutId);
      }
    });

    observer.observe(root, { childList: true, subtree: true });

    var timeoutId = window.setTimeout(function () {
      observer.disconnect();
      if (!window.__calulerMobileSideDrawerV2) {
        console.error('Caluler mobile drawer V2: V9 menu did not appear within 20 seconds.');
      }
    }, 20000);

    // Close the small race between the first lookup and observer registration.
    if (installDrawer()) {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDrawerObserver, { once: true });
  } else {
    startDrawerObserver();
  }
})();
/* CALULER-MOBILE-SIDE-DRAWER-V3-BRIDGE */
(function () {
  "use strict";

  if (window.__calulerMobileSideDrawerV3BridgeInstalled) return;

  var navInner = null;
  var navRoot = null;
  var trigger = null;
  var primaryNav = null;
  var logo = null;
  var wrapper = null;
  var panel = null;
  var desktopAnchor = null;
  var treeObserver = null;
  var stateObserver = null;
  var resizeBound = false;
  var ready = false;

  function isMobile() {
    return window.matchMedia
      ? window.matchMedia('(max-width: 900px)').matches
      : window.innerWidth <= 900;
  }

  /* CALULER-MOBILE-DRAWER-V3-STATE-SYNC-FIX */
  function syncOpenState(source) {
    if (!wrapper || !trigger || !navRoot || !document.body) return;

    // The V3 hamburger owns navRoot.caluler-mobile-nav-open.
    // The legacy drawer controller owns wrapper.is-open.
    // Synchronize both directions so either trigger or drawer controls can close it.
    var open = source === 'nav'
      ? navRoot.classList.contains('caluler-mobile-nav-open')
      : wrapper.classList.contains('is-open');

    if (wrapper.classList.contains('is-open') !== open) {
      wrapper.classList.toggle('is-open', open);
    }
    if (navRoot.classList.contains('caluler-mobile-nav-open') !== open) {
      navRoot.classList.toggle('caluler-mobile-nav-open', open);
    }

    document.body.classList.toggle('caluler-mobile-drawer-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'Close main menu' : 'Open main menu');
  }

  function syncViewportLayout() {
    if (!navInner || !primaryNav || !panel || !wrapper) return;

    if (isMobile()) {
      if (primaryNav.parentNode !== panel) panel.appendChild(primaryNav);
    } else {
      wrapper.classList.remove('is-open');
      navRoot.classList.remove('caluler-mobile-nav-open');
      document.body.classList.remove('caluler-mobile-drawer-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Open main menu');

      if (desktopAnchor && desktopAnchor.parentNode === navInner && primaryNav.parentNode !== navInner) {
        navInner.insertBefore(primaryNav, desktopAnchor.nextSibling);
      }
    }
  }

  function installBridge() {
    var foundNav = document.querySelector('.nav .nav-inner, .nav-inner');
    if (!foundNav || !document.body) return false;

    var foundTrigger = foundNav.querySelector('.caluler-primary-mobile-toggle');
    var foundPrimary = foundNav.querySelector('.caluler-primary-nav');
    var foundLogo = foundNav.querySelector(':scope > .logo') || foundNav.querySelector('.logo');

    if (!foundTrigger || !foundPrimary || !foundLogo) return false;

    navInner = foundNav;
    navRoot = foundNav.closest('.nav') || document.querySelector('.nav');
    trigger = foundTrigger;
    primaryNav = foundPrimary;
    logo = foundLogo;

    if (!navRoot) return false;

    wrapper = navInner.querySelector(':scope > .caluler-site-menu.caluler-mobile-drawer-v3-bridge');

    if (!wrapper) {
      desktopAnchor = document.createComment('Caluler primary navigation desktop position');
      navInner.insertBefore(desktopAnchor, primaryNav);

      wrapper = document.createElement('div');
      wrapper.className = 'caluler-site-menu caluler-mobile-drawer-v3-bridge';
      wrapper.setAttribute('data-caluler-v3-drawer-bridge', 'ready');

      panel = document.createElement('div');
      panel.className = 'caluler-site-menu-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Caluler site navigation');
      panel.setAttribute('aria-modal', 'true');

      // The V3-created button keeps its original click listener and receives
      // the legacy V2 class that the existing drawer controller expects.
      trigger.classList.add('caluler-site-menu-trigger');
      navInner.insertBefore(wrapper, trigger);
      wrapper.appendChild(trigger);
      wrapper.appendChild(panel);
      panel.appendChild(primaryNav);
    } else {
      panel = wrapper.querySelector('.caluler-site-menu-panel');
      if (!panel) return false;
      if (!wrapper.contains(trigger)) wrapper.insertBefore(trigger, panel);
      if (primaryNav.parentNode !== panel && isMobile()) panel.appendChild(primaryNav);
    }

    if (!stateObserver && window.MutationObserver) {
      // Drawer controls (close button/backdrop) change wrapper.is-open.
      stateObserver = new MutationObserver(function () {
        syncOpenState('wrapper');
      });
      stateObserver.observe(wrapper, {
        attributes: true,
        attributeFilter: ['class']
      });

      // The actual V3 hamburger changes navRoot.caluler-mobile-nav-open.
      // Observe that class too, then mirror it to the drawer wrapper.
      var navStateObserver = new MutationObserver(function () {
        syncOpenState('nav');
      });
      navStateObserver.observe(navRoot, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    if (!resizeBound) {
      window.addEventListener('resize', syncViewportLayout, { passive: true });
      resizeBound = true;
    }

    syncViewportLayout();
    syncOpenState();
    ready = true;
    window.__calulerMobileSideDrawerV3BridgeInstalled = true;

    // V2 watches the document for its expected wrapper/trigger/panel structure.
    // Verify its header and backdrop were added before reporting the bridge ready.
    window.setTimeout(function () {
      var headerReady = !!(panel && panel.querySelector('.caluler-mobile-drawer-header'));
      var backdropReady = !!document.querySelector('.caluler-mobile-drawer-backdrop');
      if (headerReady && backdropReady) {
        console.info('Caluler mobile drawer V3 bridge ready: V3 hamburger connected to left-side drawer.');
      } else {
        console.warn('Caluler mobile drawer V3 bridge structure is ready; legacy drawer controller has not completed its header/backdrop setup yet.');
      }
    }, 1200);

    return true;
  }

  function start() {
    if (installBridge()) return;

    if (window.MutationObserver && document.documentElement) {
      treeObserver = new MutationObserver(function () {
        if (installBridge() && treeObserver) {
          treeObserver.disconnect();
          treeObserver = null;
        }
      });
      treeObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    window.addEventListener('load', function onLoad() {
      if (installBridge() && treeObserver) {
        treeObserver.disconnect();
        treeObserver = null;
      }
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
/* END CALULER-MOBILE-SIDE-DRAWER-V3-BRIDGE */
/* CALULER-MOBILE-DRAWER-SETTINGS-BAR-V1 */
(function () {
  'use strict';

  if (window.__calulerMobileDrawerSettingsBarV1) return;

  function installSettingsBar() {
    var navInner = document.querySelector('.nav .nav-inner, .nav-inner');
    if (!navInner || !document.body) return false;

    var utility = navInner.querySelector(':scope > .caluler-utility-controls');
    if (!utility) utility = navInner.querySelector('.caluler-utility-controls');

    var themeToggle = utility && utility.querySelector('#calulerThemeToggle, .caluler-theme-toggle');
    var languageLabel = utility && utility.querySelector('.caluler-language-label');
    var languageSelect = utility && utility.querySelector('#calulerLanguage');

    if (!utility || !themeToggle || !languageLabel || !languageSelect) return false;
    if (!utility.parentNode) return false;

    var originalLabel = languageLabel.textContent;
    var originalParent = utility.parentNode;
    var restorePoint = document.createComment('Caluler settings controls original position');
    originalParent.insertBefore(restorePoint, utility);

    var syncing = false;

    function isMobile() {
      return window.matchMedia
        ? window.matchMedia('(max-width: 900px)').matches
        : window.innerWidth <= 900;
    }

    function getDrawerParts() {
      var panel = navInner.querySelector('.caluler-site-menu-panel');
      var header = panel && panel.querySelector('.caluler-mobile-drawer-header');
      return { panel: panel, header: header };
    }

    function restoreToHeader() {
      if (restorePoint.parentNode && utility.parentNode !== restorePoint.parentNode) {
        restorePoint.parentNode.insertBefore(utility, restorePoint.nextSibling);
      }
      utility.classList.remove('caluler-mobile-drawer-settings-bar');
      if (languageLabel.textContent !== originalLabel) {
        languageLabel.textContent = originalLabel;
      }
    }

    function synchronize() {
      if (syncing) return;
      syncing = true;
      try {
        if (!isMobile()) {
          restoreToHeader();
          return;
        }

        var parts = getDrawerParts();
        if (!parts.panel || !parts.header) {
          // If the drawer is being rebuilt, keep the live controls in their safe
          // original location until the real drawer header is present.
          restoreToHeader();
          return;
        }

        utility.classList.add('caluler-mobile-drawer-settings-bar');
        if (languageLabel.textContent.trim() !== 'Languages:') {
          languageLabel.textContent = 'Languages:';
        }
        if (utility.parentNode !== parts.panel) {
          parts.panel.insertBefore(utility, parts.header.nextSibling);
        }
      } finally {
        syncing = false;
      }
    }

    window.addEventListener('resize', synchronize, { passive: true });
    if (window.matchMedia) {
      var media = window.matchMedia('(max-width: 900px)');
      if (media.addEventListener) media.addEventListener('change', synchronize);
      else if (media.addListener) media.addListener(synchronize);
    }

    if (window.MutationObserver && document.documentElement) {
      var observer = new MutationObserver(synchronize);
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    synchronize();
    window.__calulerMobileDrawerSettingsBarV1 = true;
    console.info('Caluler mobile drawer settings bar V1 ready: existing theme and language controls are reused.');
    return true;
  }

  function start() {
    if (installSettingsBar()) return;
    if (!window.MutationObserver || !document.documentElement) return;

    var startupObserver = new MutationObserver(function () {
      if (installSettingsBar()) startupObserver.disconnect();
    });
    startupObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
/* END CALULER-MOBILE-DRAWER-SETTINGS-BAR-V1 */
/* CALULER-MOBILE-DRAWER-MENU-ORDER-FLYOUT-V2 */
(function () {
  'use strict';

  if (window.__calulerMobileDrawerMenuOrderFlyoutV2) return;

  var currentDrop = null;
  var currentFlyout = null;
  var scheduled = false;
  var documentObserver = null;
  var wrapperObserver = null;
  var boundWrapper = null;

  function isMobile() {
    return window.matchMedia
      ? window.matchMedia('(max-width: 900px)').matches
      : window.innerWidth <= 900;
  }

  function getPrimary() {
    return document.querySelector(
      '.caluler-site-menu-panel .caluler-primary-nav'
    ) || document.querySelector('.caluler-primary-nav');
  }

  function getParts() {
    var navInner = document.querySelector('.nav .nav-inner, .nav-inner');
    var siteMenu = navInner && navInner.querySelector('.caluler-site-menu');
    var panel = siteMenu && siteMenu.querySelector('.caluler-site-menu-panel');
    var header = panel && panel.querySelector('.caluler-mobile-drawer-header');
    var section = panel && panel.querySelector('.caluler-mobile-drawer-section');
    var utility = navInner && (
      navInner.querySelector('.caluler-mobile-drawer-settings-bar') ||
      navInner.querySelector('.caluler-utility-controls')
    );
    var primary = panel && panel.querySelector('.caluler-primary-nav');
    if (!primary) primary = getPrimary();

    return {
      navInner: navInner,
      siteMenu: siteMenu,
      panel: panel,
      header: header,
      section: section,
      utility: utility,
      primary: primary
    };
  }

  function getTrigger(drop) {
    if (!drop) return null;
    return drop.querySelector(
      ':scope > .caluler-nav-link, :scope > button, :scope > a, :scope > [role="button"]'
    ) || drop.querySelector('.caluler-nav-link, button, a, [role="button"]');
  }

  function getFlyout(drop) {
    if (!drop) return null;
    if (drop.__calulerMobileFlyoutPanel) return drop.__calulerMobileFlyoutPanel;
    var panel = drop.querySelector('.caluler-nav-dropdown-panel');
    if (panel) drop.__calulerMobileFlyoutPanel = panel;
    return panel;
  }

  function getKind(drop) {
    var trigger = getTrigger(drop);
    if (!trigger) return '';
    var label = (trigger.textContent || '')
      .replace(/[âŒ„â–¾â–¼Ë…â€ºÂ»]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    if (/^tools(?:\s|$)/.test(label)) return 'tools';
    if (/^categories(?:\s|$)/.test(label)) return 'categories';
    return '';
  }

  function getDropdowns(primary) {
    if (!primary) return [];
    return Array.prototype.slice.call(
      primary.querySelectorAll('.caluler-nav-dropdown')
    ).filter(function (drop) {
      return !!getKind(drop) && !!getFlyout(drop);
    });
  }

  function prepareTrigger(drop) {
    var trigger = getTrigger(drop);
    if (!trigger) return;

    trigger.classList.add('caluler-mobile-flyout-trigger');
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', drop.classList.contains('is-open') ? 'true' : 'false');

    Array.prototype.slice.call(trigger.childNodes).forEach(function (node) {
      if (node.nodeType === 3 && /[âŒ„â–¾â–¼Ë…]/.test(node.nodeValue || '')) {
        node.nodeValue = node.nodeValue.replace(/[âŒ„â–¾â–¼Ë…]/g, '');
      }
    });

    var arrow = trigger.querySelector(':scope > .caluler-mobile-flyout-arrow');
    if (!arrow) {
      var existingArrow = Array.prototype.slice.call(
        trigger.querySelectorAll('span, i, b, em')
      ).find(function (el) {
        return /^[\s]*[âŒ„â–¾â–¼Ë…â€ºÂ»][\s]*$/.test(el.textContent || '');
      });

      if (existingArrow) {
        arrow = existingArrow;
        arrow.textContent = 'â€º';
      } else {
        arrow = document.createElement('span');
        arrow.textContent = 'â€º';
        trigger.appendChild(arrow);
      }
      arrow.classList.add('caluler-mobile-flyout-arrow');
      arrow.setAttribute('aria-hidden', 'true');
    }
  }

  function updateAria(drop, open) {
    var trigger = getTrigger(drop);
    var flyout = getFlyout(drop);
    if (trigger) {
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (flyout && flyout.id) trigger.setAttribute('aria-controls', flyout.id);
    }
  }

  function positionFlyout(drop) {
    var flyout = getFlyout(drop);
    var trigger = getTrigger(drop);
    if (!flyout || !trigger) return;

    var rect = trigger.getBoundingClientRect();
    var viewportWidth = Math.max(240, window.innerWidth || document.documentElement.clientWidth);
    var viewportHeight = Math.max(240, window.innerHeight || document.documentElement.clientHeight);
    var width = Math.min(252, Math.max(196, Math.round(viewportWidth * 0.57)));
    var left = Math.max(8, viewportWidth - width - 8);
    var maxHeight = Math.max(170, viewportHeight - 24);
    var measuredHeight = flyout.scrollHeight || 360;
    var height = Math.min(maxHeight, Math.max(170, measuredHeight));
    var top = Math.max(8, Math.min(rect.top - 2, viewportHeight - height - 8));

    flyout.style.setProperty('--caluler-mobile-flyout-left', left + 'px');
    flyout.style.setProperty('--caluler-mobile-flyout-top', top + 'px');
    flyout.style.setProperty('--caluler-mobile-flyout-width', width + 'px');
    flyout.style.setProperty('--caluler-mobile-flyout-max-height', maxHeight + 'px');
  }

  function closeDropdown(drop, returnFocus) {
    if (!drop) return;
    var flyout = getFlyout(drop);
    var trigger = getTrigger(drop);

    drop.classList.remove('is-open');
    drop.classList.remove('caluler-mobile-flyout-open');
    updateAria(drop, false);

    if (flyout) {
      flyout.classList.remove('caluler-mobile-flyout-portal');
      flyout.classList.remove('caluler-mobile-flyout-active');
      flyout.style.removeProperty('--caluler-mobile-flyout-left');
      flyout.style.removeProperty('--caluler-mobile-flyout-top');
      flyout.style.removeProperty('--caluler-mobile-flyout-width');
      flyout.style.removeProperty('--caluler-mobile-flyout-max-height');

      if (flyout.parentNode !== drop) drop.appendChild(flyout);
    }

    if (currentDrop === drop) {
      currentDrop = null;
      currentFlyout = null;
    }

    if (returnFocus && trigger && document.contains(trigger)) {
      try { trigger.focus({ preventScroll: true }); }
      catch (ignore) { trigger.focus(); }
    }
  }

  function closeAll(returnFocus) {
    var focusTrigger = returnFocus && currentDrop ? getTrigger(currentDrop) : null;
    var primary = getPrimary();
    getDropdowns(primary).forEach(function (drop) {
      closeDropdown(drop, false);
    });
    if (focusTrigger && document.contains(focusTrigger)) {
      try { focusTrigger.focus({ preventScroll: true }); }
      catch (ignore) { focusTrigger.focus(); }
    }
    currentDrop = null;
    currentFlyout = null;
  }

  function openDropdown(drop) {
    var flyout = getFlyout(drop);
    var trigger = getTrigger(drop);
    if (!flyout || !trigger) return;

    closeAll(false);

    if (!flyout.id) {
      flyout.id = 'caluler-mobile-flyout-' + getKind(drop);
    }

    drop.classList.add('is-open');
    drop.classList.add('caluler-mobile-flyout-open');
    updateAria(drop, true);

    flyout.classList.add('caluler-mobile-flyout-portal');
    flyout.classList.add('caluler-mobile-flyout-active');
    document.body.appendChild(flyout);

    currentDrop = drop;
    currentFlyout = flyout;
    positionFlyout(drop);
  }

  function installPrimaryHandlers(primary) {
    if (!primary || primary.dataset.calulerDrawerFlyoutV2Bound === 'true') return;
    primary.dataset.calulerDrawerFlyoutV2Bound = 'true';

    primary.addEventListener('click', function (event) {
      if (!isMobile()) return;

      var target = event.target;
      var drop = target && target.closest
        ? target.closest('.caluler-nav-dropdown')
        : null;

      if (!drop || !primary.contains(drop)) return;
      if (!getKind(drop)) return;

      var trigger = getTrigger(drop);
      if (!trigger || !(trigger === target || trigger.contains(target))) return;

      // Own only Tools/Categories flyout taps on mobile. Desktop handlers and
      // all ordinary page links remain untouched.
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (drop.classList.contains('is-open')) {
        closeDropdown(drop, false);
      } else {
        openDropdown(drop);
      }
    }, true);
  }

  function moveSettingsAndOrder(parts) {
    if (!parts.panel || !parts.header || !parts.utility || !parts.primary) return;

    parts.utility.classList.add('caluler-mobile-drawer-settings-bar');

    // Settings row is forced directly below the logo/close header and above Pages.
    var firstNavigationBlock = parts.section || parts.primary;
    if (firstNavigationBlock && parts.utility.parentNode === parts.panel) {
      if (parts.utility.nextElementSibling !== firstNavigationBlock) {
        parts.panel.insertBefore(parts.utility, firstNavigationBlock);
      }
    } else if (parts.utility.parentNode !== parts.panel) {
      parts.panel.insertBefore(parts.utility, parts.header.nextSibling);
    }

    parts.header.classList.add('caluler-drawer-order-header');
    parts.utility.classList.add('caluler-drawer-order-settings');
    if (parts.section) parts.section.classList.add('caluler-drawer-order-section');
    parts.primary.classList.add('caluler-drawer-order-links');

    getDropdowns(parts.primary).forEach(function (drop) {
      var kind = getKind(drop);
      if (kind === 'tools') {
        drop.classList.add('caluler-mobile-tools-last');
        drop.classList.remove('caluler-mobile-categories-last');
      } else if (kind === 'categories') {
        drop.classList.add('caluler-mobile-categories-last');
        drop.classList.remove('caluler-mobile-tools-last');
      }
      prepareTrigger(drop);
      updateAria(drop, drop.classList.contains('is-open'));
    });
  }

  function sync() {
    scheduled = false;
    var parts = getParts();

    if (!isMobile()) {
      closeAll(false);
      if (parts.utility) parts.utility.classList.remove('caluler-mobile-drawer-settings-bar');
      if (parts.panel) parts.panel.classList.remove('caluler-mobile-drawer-flyout-layout');
      if (parts.header) parts.header.classList.remove('caluler-drawer-order-header');
      if (parts.utility) parts.utility.classList.remove('caluler-drawer-order-settings');
      if (parts.section) parts.section.classList.remove('caluler-drawer-order-section');
      if (parts.primary) parts.primary.classList.remove('caluler-drawer-order-links');
      getDropdowns(parts.primary).forEach(function (drop) {
        drop.classList.remove('caluler-mobile-tools-last');
        drop.classList.remove('caluler-mobile-categories-last');
        prepareTrigger(drop);
      });
      return;
    }

    if (!parts.panel || !parts.header || !parts.primary || !parts.utility) return;

    parts.panel.classList.add('caluler-mobile-drawer-flyout-layout');
    moveSettingsAndOrder(parts);
    installPrimaryHandlers(parts.primary);

    if (parts.siteMenu && parts.siteMenu !== boundWrapper && window.MutationObserver) {
      if (wrapperObserver) wrapperObserver.disconnect();
      boundWrapper = parts.siteMenu;
      wrapperObserver = new MutationObserver(function () {
        if (!parts.siteMenu.classList.contains('is-open')) closeAll(false);
      });
      wrapperObserver.observe(parts.siteMenu, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  function scheduleSync() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(sync);
  }

  document.addEventListener('click', function (event) {
    if (!isMobile() || !currentDrop) return;
    if (currentDrop.contains(event.target)) return;
    if (currentFlyout && currentFlyout.contains(event.target)) return;
    closeAll(false);
  }, true);

  document.addEventListener('keydown', function (event) {
    if (!isMobile() || event.key !== 'Escape' || !currentDrop) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    closeAll(true);
  }, true);

  window.addEventListener('resize', function () {
    if (!isMobile()) {
      closeAll(false);
      scheduleSync();
      return;
    }
    if (currentDrop) positionFlyout(currentDrop);
  }, { passive: true });

  if (window.MutationObserver && document.documentElement) {
    documentObserver = new MutationObserver(scheduleSync);
    documentObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleSync, { once: true });
  } else {
    scheduleSync();
  }

  window.__calulerMobileDrawerMenuOrderFlyoutV2 = true;
  console.info('Caluler mobile drawer V2: settings top, Tools/Categories bottom, right-side flyouts ready.');
})();
/* END CALULER-MOBILE-DRAWER-MENU-ORDER-FLYOUT-V2 */
/* CALULER-CUSTOM-SELECT-ARROW-HIGHLIGHT-V1 */
(function () {
  'use strict';

  if (window.__calulerCustomSelectArrowHighlightV1) return;
  window.__calulerCustomSelectArrowHighlightV1 = true;

  var selector = 'select:not(#calulerLanguage):not(.caluler-language-select)';
  var sequence = 0;
  var activePicker = null;

  function enhance(select) {
    if (!select || select.tagName !== 'SELECT') return;
    if (select.dataset.calulerCustomSelectV1 === 'ready') return;
    if (select.multiple || select.size > 1 || !select.options.length) return;
    if (select.hidden || select.getAttribute('aria-hidden') === 'true') return;
    if (select.closest('.caluler-language-picker, #google_translate_element, .goog-te-combo, .skiptranslate')) return;

    sequence++;

    var wrap = document.createElement('div');
    wrap.className = 'caluler-custom-select-wrap';
    wrap.setAttribute('data-caluler-custom-select', 'true');

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'caluler-custom-select-trigger';
    trigger.style.setProperty('font-weight', '400', 'important');
    trigger.style.setProperty('font-style', 'normal', 'important');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    var value = document.createElement('span');
    value.className = 'caluler-custom-select-value';
    value.style.setProperty('font-weight', '400', 'important');
    value.style.setProperty('font-style', 'normal', 'important');

    var arrow = document.createElement('span');
    arrow.className = 'caluler-custom-select-arrow';
    arrow.setAttribute('aria-hidden', 'true');

    trigger.append(value, arrow);

    var menu = document.createElement('div');
    menu.className = 'caluler-custom-select-menu';
    menu.style.setProperty('font-weight', '400', 'important');
    menu.style.setProperty('font-style', 'normal', 'important');
    menu.id = 'caluler-custom-select-menu-' + sequence;
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    var labelText = select.getAttribute('aria-label') || '';
    if (!labelText && select.labels && select.labels.length) {
      labelText = Array.from(select.labels).map(function (l) {
        return (l.textContent || '').trim();
      }).filter(Boolean).join(' ');
    }
    labelText = labelText || 'Choose an option';

    trigger.setAttribute('aria-label', labelText);
    trigger.setAttribute('aria-controls', menu.id);
    menu.setAttribute('aria-label', labelText);

    wrap.append(trigger, menu);
    select.insertAdjacentElement('afterend', wrap);

    // Keep the original select as the real form/calculation control.
    select.classList.add('caluler-custom-select-source');
    select.dataset.calulerCustomSelectV1 = 'ready';
    select.setAttribute('aria-hidden', 'true');
    select.tabIndex = -1;

    var ui = {
      select: select,
      wrapper: wrap,
      trigger: trigger,
      value: value,
      menu: menu,
      isOpen: false
    };

    function enabledButtons() {
      return Array.from(menu.querySelectorAll(
        'button[data-option-index]:not(:disabled)'
      ));
    }

    function optionButton(index) {
      return menu.querySelector(
        'button[data-option-index="' + index + '"]'
      );
    }

    function setActive(index, moveFocus) {
      var buttons = enabledButtons();
      if (!buttons.length) return;

      var target = buttons.find(function (b) {
        return Number(b.dataset.optionIndex) === index;
      }) || buttons[0];

      menu.querySelectorAll('button[data-option-index]').forEach(function (b) {
        b.classList.toggle('is-active', b === target);
      });

      if (moveFocus) {
        try { target.focus({preventScroll:true}); }
        catch (e) { target.focus(); }
      }

      if (target.scrollIntoView) {
        target.scrollIntoView({block:'nearest'});
      }
    }

    function sync() {
      var option = select.selectedIndex >= 0
        ? select.options[select.selectedIndex] : null;

      value.textContent = option
        ? (option.label || option.textContent || '').trim()
        : (select.getAttribute('data-placeholder') || 'Select an option');

      trigger.disabled = select.disabled;
      trigger.setAttribute('aria-required', String(select.required));
      trigger.setAttribute(
        'aria-invalid',
        String(select.getAttribute('aria-invalid') === 'true')
      );

      menu.querySelectorAll('button[data-option-index]').forEach(function (b) {
        var o = select.options[Number(b.dataset.optionIndex)];
        b.setAttribute('aria-selected', String(Boolean(o && o.selected)));
        if (o) {
          b.disabled = Boolean(
            o.disabled || (o.parentElement && o.parentElement.disabled)
          );
        }
      });
    }

    function render() {
      menu.replaceChildren();
      var previousGroup = null;

      Array.from(select.options).forEach(function (option) {
        if (option.hidden) return;

        var group = option.parentElement &&
          option.parentElement.tagName === 'OPTGROUP'
          ? option.parentElement : null;

        if (group !== previousGroup) {
          if (group && group.label) {
            var heading = document.createElement('div');
            heading.className = 'caluler-custom-select-group-label';
            heading.style.setProperty('font-weight', '400', 'important');
            heading.style.setProperty('font-style', 'normal', 'important');
            heading.setAttribute('role', 'presentation');
            heading.textContent = group.label;
            menu.appendChild(heading);
          }
          previousGroup = group;
        }

        var item = document.createElement('button');
        item.type = 'button';
        item.className = 'caluler-custom-select-option';
        item.style.setProperty('font-weight', '400', 'important');
        item.style.setProperty('font-style', 'normal', 'important');
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', String(option.selected));
        item.dataset.optionIndex = String(option.index);
        item.tabIndex = -1;
        item.textContent = (option.label || option.textContent || '').trim();
        item.disabled = Boolean(option.disabled || (group && group.disabled));

        item.addEventListener('mouseenter', function () {
          if (!item.disabled) setActive(option.index, false);
        });

        item.addEventListener('click', function () {
          if (item.disabled) return;

          var previous = select.selectedIndex;
          select.selectedIndex = option.index;

          if (select.selectedIndex !== previous) {
            select.dispatchEvent(new Event('input', {bubbles:true}));
            select.dispatchEvent(new Event('change', {bubbles:true}));
          } else {
            sync();
          }

          close(true);
        });

        menu.appendChild(item);
      });

      sync();
    }

    function position() {
      var r = trigger.getBoundingClientRect();
      var below = window.innerHeight - r.bottom - 12;
      var above = r.top - 12;
      var desired = Math.min(320, Math.floor(window.innerHeight * .45));
      var upward = below < Math.min(170, desired) && above > below;

      wrap.classList.toggle('opens-up', upward);
      menu.style.maxHeight =
        Math.max(110, Math.min(desired, upward ? above : below)) + 'px';
    }

    function close(returnFocus) {
      if (!ui.isOpen) return;

      ui.isOpen = false;
      wrap.classList.remove('is-open', 'opens-up');
      menu.hidden = true;
      menu.style.removeProperty('max-height');
      trigger.setAttribute('aria-expanded', 'false');

      if (activePicker === ui) activePicker = null;
      if (returnFocus) trigger.focus();
    }

    function open(focusItem) {
      if (trigger.disabled) return;

      if (activePicker && activePicker !== ui) {
        activePicker.close(false);
      }

      render();
      ui.isOpen = true;
      activePicker = ui;
      menu.hidden = false;
      wrap.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');

      position();

      var index = select.selectedIndex;
      var selectedButton = optionButton(index);

      if (!selectedButton || selectedButton.disabled) {
        var first = enabledButtons()[0];
        index = first ? Number(first.dataset.optionIndex) : -1;
      }

      if (index >= 0) setActive(index, Boolean(focusItem));
    }

    ui.close = close;

    trigger.addEventListener('click', function () {
      if (ui.isOpen) close(false);
      else open(false);
    });

    trigger.addEventListener('keydown', function (event) {
      var key = event.key;
      if (['ArrowDown','ArrowUp','Home','End','Enter',' '].indexOf(key) < 0) return;

      event.preventDefault();
      if (!ui.isOpen) open(false);

      var buttons = enabledButtons();
      if (!buttons.length) return;

      var active = menu.querySelector('.caluler-custom-select-option.is-active');
      var index = active
        ? Number(active.dataset.optionIndex)
        : Number(buttons[0].dataset.optionIndex);

      if (key === 'Home') setActive(Number(buttons[0].dataset.optionIndex), true);
      else if (key === 'End') setActive(Number(buttons[buttons.length-1].dataset.optionIndex), true);
      else if (key === 'ArrowDown') {
        var down = buttons.find(function (b) {
          return Number(b.dataset.optionIndex) > index;
        }) || buttons[0];
        setActive(Number(down.dataset.optionIndex), true);
      } else if (key === 'ArrowUp') {
        var up = buttons.slice().reverse().find(function (b) {
          return Number(b.dataset.optionIndex) < index;
        }) || buttons[buttons.length-1];
        setActive(Number(up.dataset.optionIndex), true);
      } else {
        var selected = optionButton(select.selectedIndex);
        (selected && !selected.disabled ? selected : buttons[0]).focus();
      }
    });

    menu.addEventListener('keydown', function (event) {
      var key = event.key;

      if (key === 'Escape') {
        event.preventDefault();
        close(true);
        return;
      }

      if (key === 'Tab') {
        close(false);
        return;
      }

      if (['ArrowDown','ArrowUp','Home','End'].indexOf(key) < 0) return;

      event.preventDefault();

      var buttons = enabledButtons();
      if (!buttons.length) return;

      var current = event.target.closest('button[data-option-index]');
      var index = current
        ? Number(current.dataset.optionIndex)
        : Number(buttons[0].dataset.optionIndex);

      if (key === 'Home') setActive(Number(buttons[0].dataset.optionIndex), true);
      else if (key === 'End') setActive(Number(buttons[buttons.length-1].dataset.optionIndex), true);
      else if (key === 'ArrowDown') {
        var down = buttons.find(function (b) {
          return Number(b.dataset.optionIndex) > index;
        }) || buttons[0];
        setActive(Number(down.dataset.optionIndex), true);
      } else if (key === 'ArrowUp') {
        var up = buttons.slice().reverse().find(function (b) {
          return Number(b.dataset.optionIndex) < index;
        }) || buttons[buttons.length-1];
        setActive(Number(up.dataset.optionIndex), true);
      }
    });

    select.addEventListener('input', sync);
    select.addEventListener('change', sync);

    // Preserve native required validation while focusing the visible control.
    select.addEventListener('invalid', function (event) {
      event.preventDefault();
      trigger.setAttribute('aria-invalid', 'true');
      trigger.focus();
      open(true);
    }, true);

    if (select.form) {
      select.form.addEventListener('reset', function () {
        window.setTimeout(sync, 0);
      });
    }

    Array.from(select.labels || []).forEach(function (label) {
      label.addEventListener('click', function (event) {
        event.preventDefault();
        trigger.focus();
      });
    });

    if (window.MutationObserver) {
      var optionObserver = new MutationObserver(render);
      optionObserver.observe(select, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['disabled','label','hidden','selected','value']
      });
    }

    render();
  }

  function scan(root) {
    if (!root) return;
    if (root.nodeType === 1 && root.matches && root.matches(selector)) enhance(root);
    if (root.querySelectorAll) root.querySelectorAll(selector).forEach(enhance);
  }

  function start() {
    scan(document);

    document.addEventListener('pointerdown', function (event) {
      if (activePicker && !activePicker.wrapper.contains(event.target)) {
        activePicker.close(false);
      }
    }, true);

    window.addEventListener('resize', function () {
      if (activePicker) activePicker.close(false);
    }, {passive:true});

    if (window.MutationObserver && document.documentElement) {
      var observer = new MutationObserver(function (records) {
        records.forEach(function (record) {
          record.addedNodes.forEach(function (node) {
            if (node.nodeType === 1) scan(node);
          });
        });
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    console.info('Caluler custom dropdown V1 initialized.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, {once:true});
  } else {
    start();
  }
})();
/* END CALULER-CUSTOM-SELECT-ARROW-HIGHLIGHT-V1 */
// CALULER-CUSTOM-SELECT-INLINE-REGULAR-V2

/* CALULER-FINANCE-INLINE-AFFIX-JS-V1 */
(function () {
    'use strict';

    if (window.__calulerFinanceInlineAffixV1) return;
    window.__calulerFinanceInlineAffixV1 = true;

    var selector = '.field[data-caluler-affix]';
    var observed = new WeakSet();
    var resizeObserver = null;

    function position(field) {
        var input = field.querySelector('input');
        if (!input || !input.offsetHeight) return;

        var y = input.offsetTop + (input.offsetHeight / 2);
        field.style.setProperty('--caluler-affix-y', y + 'px');
        input.style.setProperty('padding-right', '46px', 'important');
    }

    function enhance(field) {
        if (!field || field.nodeType !== 1 || !field.matches(selector)) return;

        var input = field.querySelector('input');
        if (!input) return;

        position(field);

        if (observed.has(field)) return;
        observed.add(field);

        if (resizeObserver) {
            resizeObserver.observe(field);
            resizeObserver.observe(input);
        }
    }

    function scan(root) {
        if (!root) return;

        if (root.nodeType === 1 && root.matches && root.matches(selector)) {
            enhance(root);
        }

        if (root.querySelectorAll) {
            root.querySelectorAll(selector).forEach(enhance);
        }
    }

    function start() {
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(function (entries) {
                entries.forEach(function (entry) {
                    var field = entry.target.matches(selector)
                        ? entry.target
                        : entry.target.closest(selector);

                    if (field) position(field);
                });
            });
        }

        scan(document);

        window.addEventListener('resize', function () {
            document.querySelectorAll(selector).forEach(position);
        }, { passive: true });

        if (window.MutationObserver && document.documentElement) {
            var observer = new MutationObserver(function (records) {
                records.forEach(function (record) {
                    record.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1) scan(node);
                    });
                });
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }

        console.info('Caluler Finance inline affixes initialized.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
/* END CALULER-FINANCE-INLINE-AFFIX-JS-V1 */

/* CALULER-FINANCE-RESULT-ACTIONS-V2 */
(function () {
  'use strict';

  if (window.__calulerFinanceResultActionsV2) return;

  // Layout only: move existing text/nodes; never parse or recalculate numeric values.
  function decorateResultRows(result) {
    if(result.classList.contains('error'))return;
    const skip='table,thead,tbody,tr,td,th,ul,ol,dl,pre,code,svg,canvas,form,button,a,small,h1,h2,h3,h4,h5,h6,[role="alert"],[role="table"],.caluler-result-toolbar,.caluler-result-actionbar';
    const note=/\b(?:note|warning|disclaimer|explanation|description|caption|intro|error)\b/i;
    const inline=node=>node.nodeType===3||node.nodeType===8||(node.nodeType===1&&/^(B|STRONG|SPAN|SUP|SUB)$/.test(node.tagName)&&Array.from(node.childNodes).every(inline));
    const labelText=nodes=>nodes.map(node=>node.textContent).join('').trim();
    function split(nodes){
      if(!nodes.length||!nodes.every(inline))return null;
      const bold=nodes.filter(node=>node.nodeType===1&&/^(B|STRONG)$/.test(node.tagName));
      if(bold.length!==1)return null;
      const index=nodes.indexOf(bold[0]),before=labelText(nodes.slice(0,index)),after=labelText(nodes.slice(index+1));
      let boundary;
      if(before.endsWith(':')&&bold[0].textContent.trim())boundary=index;
      else if(!before&&bold[0].textContent.trim().endsWith(':')&&after)boundary=index+1;
      else return null;
      const label=labelText(nodes.slice(0,boundary));
      if(label.length>120||/^(?:note|warning|disclaimer|please|error|formula|explanation)\b/i.test(label))return null;
      return boundary;
    }
    function wrap(nodes,className){
      const span=document.createElement('span');span.className=className;span.setAttribute('data-caluler-result-wrap','');
      nodes.forEach(node=>span.appendChild(node));return span;
    }
    function visit(container){
      if(container!==result&&(container.matches(skip)||note.test(container.className)))return;
      if(container.classList.contains('caluler-result-pair')){
        const parts=Array.from(container.children);
        if(parts.length===2&&parts[0].classList.contains('caluler-result-pair-label')&&parts[1].classList.contains('caluler-result-pair-value'))return;
        container.classList.remove('caluler-result-pair');
      }
      if(container.classList.contains('finance-result-line')){
        const children=Array.from(container.children);
        if(children.length===2&&children[0].classList.contains('finance-result-label')&&children[1].classList.contains('finance-result-value')){
          container.classList.add('caluler-result-pair');children[0].classList.add('caluler-result-pair-label');children[1].classList.add('caluler-result-pair-value');return;
        }
      }
      const original=Array.from(container.childNodes),groups=[];let nodes=[];
      if(container.tagName==='P'&&original.some(node=>!inline(node)&&node.tagName!=='BR'))return;
      for(const node of original){
        if(node.nodeType===1&&node.tagName==='BR'){groups.push({nodes,br:node});nodes=[];}
        else if(!inline(node)){if(nodes.length)groups.push({nodes,br:null});nodes=[];}
        else nodes.push(node);
      }
      groups.push({nodes,br:null});
      for(const group of groups){
        const boundary=split(group.nodes);
        if(boundary===null)continue;
        const reuse=container!==result&&original.every(inline);
        const row=reuse?container:document.createElement('span');
        if(!reuse){row.setAttribute('data-caluler-result-wrap','');container.insertBefore(row,group.nodes[0]);}
        row.classList.add('caluler-result-pair');
        row.append(wrap(group.nodes.slice(0,boundary),'caluler-result-pair-label'),wrap(group.nodes.slice(boundary),'caluler-result-pair-value'));
        if(group.br)group.br.classList.add('caluler-result-pair-break');
      }
      Array.from(container.children).forEach(node=>{if(/^(DIV|P|SPAN)$/.test(node.tagName))visit(node);});
    }
    visit(result);
    if(result.querySelector('.caluler-result-pair'))result.classList.add('caluler-result-layout');
  }
  function restoreResultText(clone) {
    // Readiness comparisons keep the original text/BR structure; PNG and Print retain the layout.
    Array.from(clone.querySelectorAll('[data-caluler-result-wrap]')).reverse().forEach(node=>node.replaceWith(...Array.from(node.childNodes)));
    [clone,...clone.querySelectorAll('.caluler-result-pair,.caluler-result-pair-label,.caluler-result-pair-value,.caluler-result-pair-break')].forEach(node=>node.classList.remove('caluler-result-layout','caluler-result-pair','caluler-result-pair-label','caluler-result-pair-value','caluler-result-pair-break'));
  }

  function resultClipboard(result) {
    const clone=result.cloneNode(true),host=getComputedStyle(result);
    const canvasSources=new WeakMap(),liveCanvases=Array.from(result.querySelectorAll('canvas'));
    Array.from(clone.querySelectorAll('canvas')).forEach((node,index)=>canvasSources.set(node,liveCanvases[index]));
    const liveFields=Array.from(result.querySelectorAll('input,textarea,select'));
    Array.from(clone.querySelectorAll('input,textarea,select')).forEach((node,index)=>{
      const source=liveFields[index],text=document.createElement('span');
      text.textContent=source?.tagName==='SELECT'?Array.from(source.selectedOptions||[]).map(option=>option.textContent).join(', '):source?.value||'';
      if(source?.type==='hidden')node.remove();else node.replaceWith(text);
    });
    clone.querySelectorAll('button,nav,script,style,iframe,object,embed,.caluler-result-toolbar,.caluler-result-actions,.caluler-result-actionbar,.caluler-result-action-status,.caluler-diagram-export-ui,[data-caluler-export-ui],[role="tooltip"],[popover],[hidden],[aria-hidden="true"],[style*="display:none"],[style*="display: none"]').forEach(node=>node.remove());
    decorateResultRows(clone);
    const clean=value=>value.replace(/\r\n?/g,'\n').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
    const tag=node=>(node.localName||node.tagName||'').toLowerCase();
    const superDigits={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻','−':'⁻','=':'⁼','(':'⁽',')':'⁾','n':'ⁿ','i':'ⁱ'};
    const subDigits={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','+':'₊','-':'₋','−':'₋','=':'₌','(':'₍',')':'₎','n':'ₙ','i':'ᵢ'};
    const scriptText=(text,map,marker)=>Array.from(text).every(char=>map[char])?Array.from(text).map(char=>map[char]).join(''):marker+'('+text+')';
    let labelWidth=12;const protectedText=[];
    function children(node){return Array.from(node.childNodes).map(plain).join('');}
    function pair(node){
      if(!node.classList?.contains('caluler-result-pair'))return null;
      const nodes=Array.from(node.children),label=nodes.find(child=>child.classList.contains('caluler-result-pair-label')),value=nodes.find(child=>child.classList.contains('caluler-result-pair-value'));
      return label&&value?{label,value}:null;
    }
    function plain(node){
      if(node.nodeType===3)return node.textContent.replace(/\r\n?/g,'\n');
      if(node.nodeType!==1)return '';
      const name=tag(node),row=pair(node);
      if(row){const label=clean(plain(row.label)).replace(/\s+/g,' ').replace(/:\s*$/,'');const value=clean(plain(row.value));return label.padEnd(labelWidth)+'  ........  '+value.replace(/\n/g,'\n    ')+'\n';}
      if(node.classList.contains('caluler-result-pair-break'))return '';
      if(name==='br')return '\n';
      if(name==='pre'){const token='\uE000CALULER_PRE_'+protectedText.length+'\uE001';protectedText.push(node.textContent.replace(/\r\n?/g,'\n'));return '\n'+token+'\n';}
      if(name==='sup')return scriptText(children(node),superDigits,'^');
      if(name==='sub')return scriptText(children(node),subDigits,'_');
      if(name==='semantics')return node.firstElementChild?plain(node.firstElementChild):children(node);
      if(name==='annotation'||name==='annotation-xml')return '';
      if(name==='msup'||name==='msub'){const nodes=Array.from(node.children);return (nodes[0]?plain(nodes[0]):'')+scriptText(nodes[1]?plain(nodes[1]):'',name==='msup'?superDigits:subDigits,name==='msup'?'^':'_');}
      if(name==='mfrac'){const nodes=Array.from(node.children);return '('+(nodes[0]?plain(nodes[0]):'')+')/('+(nodes[1]?plain(nodes[1]):'')+')';}
      if(name==='msqrt')return '√('+children(node)+')';
      if(name==='svg'){const title=node.getAttribute('aria-label')||node.querySelector('title,desc')?.textContent||'',labels=Array.from(node.querySelectorAll('text'));return [title,...labels.map(children)].filter(Boolean).join('\n')||children(node);}
      if(name==='img')return node.getAttribute('alt')||'';
      if(name==='table'){
        const caption=node.querySelector('caption'),rows=Array.from(node.querySelectorAll('tr')).filter(row=>row.closest('table')===node);
        return '\n'+(caption?clean(plain(caption))+'\n':'')+rows.map(row=>Array.from(row.children).filter(cell=>/^(td|th)$/.test(tag(cell))).map(cell=>clean(plain(cell))).join('\t')).join('\n')+'\n';
      }
      if(name==='li'){
        const parent=node.parentElement,ordered=tag(parent)==='ol',start=Number(parent?.getAttribute('start')||1),index=Array.from(parent?.children||[]).indexOf(node);
        return '\n'+(ordered?String(Number(node.getAttribute('value')||start+index))+'. ':'• ')+children(node).trim()+'\n';
      }
      const text=children(node);
      return /^(div|section|article|p|h[1-6]|blockquote|ul|ol|dl|dt|dd|tr|caption|hr)$/.test(name)?'\n'+text+'\n':text;
    }
    const widths=Array.from(clone.querySelectorAll('.caluler-result-pair-label')).map(node=>node.textContent.trim().replace(/:\s*$/,'').length);
    labelWidth=Math.min(32,Math.max(12,...widths));
    let text=clean(plain(clone));protectedText.forEach((value,index)=>{text=text.replace('\uE000CALULER_PRE_'+index+'\uE001',()=>value);});
    const background=host.backgroundColor&&host.backgroundColor!=='rgba(0, 0, 0, 0)'?host.backgroundColor:'#EFF5F9',ink=host.color||'#111111',muted=host.getPropertyValue('--muted').trim()||ink;
    const make=(name,style)=>{const node=document.createElement(name);if(style)node.setAttribute('style',style);return node;};
    const allowed=new Set('div span p b strong em i u s del sub sup small br ul ol li dl dt dd table caption thead tbody tfoot tr th td pre code blockquote h1 h2 h3 h4 h5 h6 a hr'.split(' '));
    function rich(node){
      if(node.nodeType===3)return document.createTextNode(node.textContent);
      if(node.nodeType!==1)return null;
      const name=tag(node),row=pair(node);
      if(row){
        const table=make('table','width:100%;border-collapse:collapse;table-layout:fixed;margin:0;'),body=make('tbody'),tr=make('tr');table.setAttribute('role','presentation');table.appendChild(body);body.appendChild(tr);
        const label=make('td','width:40%;padding:6px 0;vertical-align:top;color:'+muted+';font-weight:500;overflow-wrap:anywhere;'),connector=make('td','width:20%;padding:6px 12px;vertical-align:middle;'),value=make('td','width:40%;padding:6px 0;vertical-align:top;text-align:right;font-weight:650;overflow-wrap:anywhere;');
        const line=make('div','height:0;line-height:0;font-size:0;border-top:2px solid #FFFFFF;');line.setAttribute('aria-hidden','true');line.textContent='\u200B';connector.appendChild(line);
        for(const child of row.label.childNodes){const copy=rich(child);if(copy)label.appendChild(copy);}for(const child of row.value.childNodes){const copy=rich(child);if(copy)value.appendChild(copy);}
        tr.append(label,connector,value);return table;
      }
      if(node.classList.contains('caluler-result-pair-break'))return null;
      if(name==='canvas'){
        const live=canvasSources.get(node);
        try{const image=make('img','max-width:100%;height:auto;');image.src=live.toDataURL('image/png');image.alt='Calculated result chart';return image;}catch(error){return null;}
      }
      if(name==='img'){
        const source=node.currentSrc||node.getAttribute('src')||'';if(!/^(https?:|data:image\/(?:png|jpeg|webp|gif);base64,)/i.test(source))return document.createTextNode(node.getAttribute('alt')||'');
        const image=make('img','max-width:100%;height:auto;');image.setAttribute('src',source);image.setAttribute('alt',node.getAttribute('alt')||'');return image;
      }
      if(name==='math'||name==='svg')return document.createTextNode(clean(plain(node)));
      const next=make(allowed.has(name)?name:'span');
      if(name==='table')next.setAttribute('style','width:100%;border-collapse:collapse;margin:8px 0;');
      else if(name==='td'||name==='th')next.setAttribute('style','padding:6px 8px;text-align:left;vertical-align:top;border-bottom:1px solid '+muted+';overflow-wrap:anywhere;');
      else if(name==='pre')next.setAttribute('style','white-space:pre-wrap;overflow-wrap:anywhere;');
      else if(/^(p|h[1-6]|blockquote)$/.test(name))next.setAttribute('style','margin:6px 0;');
      for(const attr of ['colspan','rowspan','start','value'])if(node.hasAttribute(attr)&&/^-?\d+$/.test(node.getAttribute(attr)))next.setAttribute(attr,node.getAttribute(attr));
      if(name==='a'){try{const href=new URL(node.getAttribute('href')||'',document.baseURI);if(/^(https?:|mailto:)$/.test(href.protocol))next.setAttribute('href',href.href);}catch(error){}}
      for(const child of node.childNodes){const copy=rich(child);if(copy)next.appendChild(copy);}return next;
    }
    const wrapper=make('div','font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;max-width:680px;padding:16px;background:'+background+';color:'+ink+';');
    const heading=make('h2','font-size:16px;margin:0 0 12px;');heading.textContent='RESULT — Caluler.Work';wrapper.appendChild(heading);
    for(const child of clone.childNodes){const copy=rich(child);if(copy)wrapper.appendChild(copy);}
    return {text:'RESULT — Caluler.Work\n\n'+text,html:wrapper.outerHTML};
  }
  async function writeResultClipboard(payload,fallback){
    if(navigator.clipboard?.write&&typeof window.ClipboardItem==='function'){
      try{
        if(!window.ClipboardItem.supports||window.ClipboardItem.supports('text/html')){
          await navigator.clipboard.write([new window.ClipboardItem({'text/plain':new Blob([payload.text],{type:'text/plain'}),'text/html':new Blob([payload.html],{type:'text/html'})})]);return true;
        }
      }catch(error){/* A plain-text attempt still works when rich clipboard formats are unavailable. */}
    }
    if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(payload.text);return true;}catch(error){}}
    try{return !!fallback(payload.text);}catch(error){return false;}
  }

  function init() {
    const root = document.documentElement;
    const isHealth = document.body?.getAttribute('data-caluler-category') === 'Health Calculators';

    const isFinance = document.body?.getAttribute('data-caluler-category') === 'Finance Calculators';
    if (!root || !document.body?.getAttribute('data-caluler-category')) return;

    if (window.__calulerFinanceResultActionsV2) return;

    const calculator = document.querySelector('body .calculator');
    if (!calculator) return;

    const results = calculator.querySelectorAll('.result');
    if (results.length !== 1) return;

    const result = results[0];
    if (result.querySelector('.caluler-result-toolbar')) return;
    if (isHealth) result.classList.add('caluler-health-result');
    if (!isHealth && !isFinance) result.classList.add('caluler-standard-result-actions');
    const isEmi = result.id === 'amResult';

    const copySource = isEmi
      ? document.getElementById('amCopyBtn')
      : null;

    const csvSource = isEmi
      ? document.getElementById('amCsvBtn')
      : null;

    const calculateSource = isEmi
      ? document.getElementById('amCalculateBtn')
      : calculator.querySelector('button.btn');

    const form = isEmi
      ? null
      : calculator.querySelector('form');

    if (isEmi && (!copySource || !csvSource || !calculateSource)) return;
    if (!isEmi && !calculateSource) return;

    window.__calulerFinanceResultActionsV2 = true;

    const iconPaths = {
      download:
        '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
        '<path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',

      print:
        '<path d="M6 9V2h12v7"/>' +
        '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>' +
        '<path d="M6 14h12v8H6z"/>',

      copy:
        '<rect x="8" y="8" width="14" height="14" rx="2"/>' +
        '<path d="M4 16H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/>'
    };

    function makeButton(name, label) {
      const button = document.createElement('button');

      button.type = 'button';
      button.className = 'caluler-result-action';
      button.setAttribute('aria-label', label);
      button.title = label;

      const svg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );

      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', '19');
      svg.setAttribute('height', '19');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.8');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('aria-hidden', 'true');

      svg.innerHTML = iconPaths[name];
      button.appendChild(svg);

      return button;
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'caluler-result-toolbar';
    toolbar.setAttribute('role', 'group');
    toolbar.setAttribute('aria-label', 'Result actions');

    const heading = document.createElement('strong');
    heading.className = 'caluler-result-title';
    heading.textContent = 'Result:';

    const actions = document.createElement('div');
    actions.className = 'caluler-result-actions';

    const downloadButton = makeButton('download', 'Download result as PNG');
    const printButton = makeButton('print', 'Print result');
    const copyButton = makeButton('copy', 'Copy result');

    const status = document.createElement('span');
    status.className = 'caluler-result-action-status';
    status.setAttribute('aria-live', 'polite');

    actions.append(downloadButton, printButton, copyButton);
    toolbar.append(heading, actions, status);

    function cleanClone() {
      const clone = result.cloneNode(true);

      clone.querySelectorAll('.caluler-result-toolbar,[data-caluler-export-ui]').forEach(
        node => node.remove()
      );

      clone.removeAttribute('id');
      clone.removeAttribute('aria-live');

      return clone;
    }

    function getResultText() {
      const clone = cleanClone();
      restoreResultText(clone);

      return (
        clone.innerText || clone.textContent || ''
      ).replace(/\r/g, '')
       .replace(/\n{3,}/g, '\n\n')
       .trim();
    }

    function healthResultIsReady() {
      const clone = cleanClone();
      const text = (clone.innerText || clone.textContent || '').trim();
      return !!(text && /\d/.test(text) && clone.querySelector('b,strong') &&
        !result.classList.contains('error') && !clone.querySelector('.error,[role="alert"]'));
    }

    const initialText = getResultText();
    const placeholderPattern =
      /^(enter\b|please\b|choose\b|select\b|fill\b|add\b|your result will appear here\b|the live diagram previews\b)/i;

    function genericResultIsReady() {
      const clone = cleanClone();
      const text = (clone.innerText || clone.textContent || '').trim();
      const plainOutput = (result.id === 'toolResult' && !/^Input error:/i.test(text)) ||
        text === 'Text converted successfully.' || /^\d+ h \d+ min \d+ sec$/.test(text);
      return !!(text && !placeholderPattern.test(text) && !/^Input error:/i.test(text) && !/\b(?:NaN|Infinity)\b/.test(text) &&
        !result.classList.contains('error') && !clone.querySelector('.error,[role="alert"]') &&
        (plainOutput || clone.querySelector('b,strong,table,svg,canvas')));
    }

    let ready = isHealth ? healthResultIsReady() : (!isFinance && genericResultIsReady());
    let calculationPending = false;
    let observer = null;
    let downloading = false;

    function canUseActions() {
      if (isEmi) {
        return !copySource.disabled && !csvSource.disabled;
      }

      return ready;
    }

    function refresh() {
      const disabled = !canUseActions();

      downloadButton.disabled = disabled || downloading;
      printButton.disabled = disabled;
      copyButton.disabled = disabled;
    }

    function notify(message) {
      status.textContent = message;

      window.setTimeout(function () {
        if (status.textContent === message) {
          status.textContent = '';
        }
      }, 2500);
    }

    function markReadyAfterCalculation() {
      if (isHealth) { ready = healthResultIsReady(); refresh(); return; }
      if (!isFinance) {
        ready = genericResultIsReady();
        calculationPending = false;
        refresh();
        return;
      }
      if (!calculationPending) return;

      const text = getResultText();

      const hasError = result.classList.contains('error') ||
        !!result.querySelector('.error, [role="alert"]');

      if (
        text &&
        text !== initialText &&
        !placeholderPattern.test(text) &&
        !hasError
      ) {
        ready = true;
        calculationPending = false;
      }

      refresh();
    }

    function ensureToolbar() {
      if (isHealth) result.classList.add('caluler-health-result');
      if (!isHealth && !isFinance) result.classList.add('caluler-standard-result-actions');
      if (observer) observer.disconnect();
      try {
        decorateResultRows(result);
        if (toolbar.parentNode !== result || result.firstElementChild !== toolbar) {
          result.insertBefore(toolbar, result.firstChild);
        }
      } finally {
        if (observer) observer.observe(result, { childList:true, subtree:true, characterData:true });
      }
    }

    function legacyCopy(text) {
      const active = document.activeElement;
      const selection = document.getSelection?.();
      const ranges = selection ? Array.from({length:selection.rangeCount},(_,index)=>selection.getRangeAt(index).cloneRange()) : [];
      const inputSelection = active && typeof active.selectionStart === 'number' ? [active.selectionStart,active.selectionEnd,active.selectionDirection] : null;
      const field = document.createElement('textarea');
      field.value = text;field.readOnly = true;field.tabIndex = -1;
      Object.assign(field.style,{position:'fixed',left:'-9999px',top:'0',fontSize:'16px'});
      document.body.appendChild(field);
      try { field.select();return document.execCommand('copy'); }
      finally {
        field.remove();
        if (active?.isConnected) {
          active.focus({preventScroll:true});
          try { if(inputSelection)active.setSelectionRange(...inputSelection); } catch (_) {}
        }
        try { if(selection){selection.removeAllRanges();ranges.forEach(range=>selection.addRange(range));} } catch (_) {}
      }
    }

    async function copyResult() {
      if (!canUseActions()) return;
      try {
        const payload = resultClipboard(result);
        if (!await writeResultClipboard(payload, legacyCopy)) throw new Error('Clipboard unavailable');
        notify('Result copied');
      } catch (_) { notify('Copy unavailable in this browser'); }
    }

    async function downloadResult() {
      if (downloading) return;
      if (!canUseActions()) { notify('Calculate first to download this result.'); return; }
      downloading = true;
      downloadButton.disabled = true;
      downloadButton.setAttribute('aria-busy', 'true');
      try {
        if (!window.calulerDiagramExport?.download) throw new Error('PNG export is unavailable. Refresh the page and try again.');
        await window.calulerDiagramExport.download(result);
      } catch (error) {
        const notice = result.querySelector('.caluler-result-export-status');
        if (!notice || notice.hidden || notice.dataset.kind !== 'error') notify('Result download failed: ' + (error.message || 'Please try again.'));
      } finally {
        downloading = false;
        downloadButton.removeAttribute('aria-busy');
        refresh();
      }
    }

    async function printResult() {
      if (!canUseActions()) return;
      try {
        if (!window.calulerDiagramExport?.printResult) throw new Error('Print is unavailable. Refresh and try again.');
        await window.calulerDiagramExport.printResult(result);
      } catch (error) { notify('Print failed: ' + (error?.message || 'Please try again.')); }
    }

    downloadButton.addEventListener('click', downloadResult);
    printButton.addEventListener('click', printResult);
    copyButton.addEventListener('click', copyResult);

    if (isEmi) {
      calculateSource.addEventListener('click', function () {
        window.setTimeout(refresh, 0);
        window.setTimeout(refresh, 80);
      });
    } else {
      (form || calculateSource).addEventListener(form ? 'submit' : 'click', function () {
        ready = false;
        calculationPending = true;
        refresh();

        [0, 80, 300, 900].forEach(function (delay) {
          window.setTimeout(markReadyAfterCalculation, delay);
        });
      }, true);
    }

    calculator.addEventListener('input', function (event) {
      if (isHealth || !isFinance) return;
      if(calculator.querySelector('.finance-live-diagram[data-caluler-submit-only="true"]'))return;
      if (
        !event.target ||
        !/^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName)
      ) return;

      if (!isEmi) {
        ready = false;
        calculationPending = false;
        refresh();
      } else {
        window.setTimeout(refresh, 0);
      }
    }, true);

    calculator.addEventListener('change', function (event) {
      if (isHealth || !isFinance) return;
      if(calculator.querySelector('.finance-live-diagram[data-caluler-submit-only="true"]'))return;
      if (
        !event.target ||
        !/^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName)
      ) return;

      if (!isEmi) {
        ready = false;
        calculationPending = false;
        refresh();
      } else {
        window.setTimeout(refresh, 0);
      }
    }, true);

    ensureToolbar();

    observer = new MutationObserver(function () {
      ensureToolbar();
      markReadyAfterCalculation();
      refresh();
    });

    observer.observe(result, {
      childList: true,
      subtree: true,
      characterData: true
    });

    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
/* END CALULER-FINANCE-RESULT-ACTIONS-V2 */

/* CALULER-FINANCE-RESULT-SHARE-BAR-V1 */
(function () {
  'use strict';
  if (window.__calulerFinanceResultShareBarV1) return;
  window.__calulerFinanceResultShareBarV1 = true;

  function start() {
    var body = document.body;
    var isHealth = body && body.getAttribute('data-caluler-category') === 'Health Calculators';
    var isFinance = body && body.getAttribute('data-caluler-category') === 'Finance Calculators';
    var sharePageOnly = !isFinance;
    if (!body || !body.getAttribute('data-caluler-category')) return;
    var calculator = body.querySelector('.calculator');

    var isEmi = /\/emi-calculator\.html$/i.test(window.location.pathname);
    var form = sharePageOnly ? calculator?.querySelector('form') || calculator : document.getElementById('financeForm');
    var result = sharePageOnly ? calculator?.querySelector('.result') : document.getElementById(isEmi ? 'amResult' : 'result');
    if (calculator?.querySelector('.caluler-result-actionbar')) return;
    if (!result || (!isEmi && !form)) {
      console.warn('Caluler Finance Share Bar: expected calculator result target was not found.');
      return;
    }

    var canonicalNode = document.querySelector('link[rel="canonical"]');
    if (!canonicalNode || !canonicalNode.href) return;
    var canonicalUrl;
    try { canonicalUrl = new URL(canonicalNode.href); } catch (e) { return; }
    if (canonicalUrl.protocol !== 'https:' || canonicalUrl.hostname !== 'caluler.work') return;
    if (!isFinance && !isHealth) calculator.classList.add('caluler-standard-feedback-layout');

    var allowedEmiIds = [
      'amLoanAmount', 'amAnnualRate', 'amTermValue', 'amFixedPrincipal', 'amExtraPayment',
      'amRateBasis', 'amTermUnit', 'amPaymentFrequency', 'amRepaymentMethod'
    ];
    var shareParam = 'caluler_share';
    var title = (document.querySelector('h1') && document.querySelector('h1').textContent.trim()) || document.title;

    function getControls() {
      var list;
      if (isEmi) {
        list = allowedEmiIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
      } else {
        list = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
      }
      return list.filter(function (el) {
        if (!el.id || el.id === 'calulerLanguage') return false;
        var type = (el.type || '').toLowerCase();
        return ['hidden', 'button', 'submit', 'reset', 'file', 'password'].indexOf(type) === -1;
      });
    }

    function packValues() {
      var values = {};
      getControls().forEach(function (el) {
        var type = (el.type || el.tagName || '').toLowerCase();
        if (type === 'checkbox' || type === 'radio') {
          values[el.id] = { type: type, checked: !!el.checked };
        } else {
          values[el.id] = { type: type, value: String(el.value == null ? '' : el.value) };
        }
      });
      return values;
    }

    function encodeBase64Url(value) {
      var bytes = new TextEncoder().encode(value);
      var binary = '';
      for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    }

    function decodeBase64Url(value) {
      var padded = value.replace(/-/g, '+').replace(/_/g, '/');
      while (padded.length % 4) padded += '=';
      var binary = window.atob(padded);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    }

    function calculateCurrentValues() {
      if (isEmi) {
        var calculateButton = document.getElementById('amCalculateBtn');
        if (calculateButton) calculateButton.click();
      } else if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }

    function buildShareUrl() {
      // Page-only actions never read measurements or trigger an implicit calculation.
      if (sharePageOnly) return canonicalUrl.href;
      calculateCurrentValues();
      var payload = { version: 1, path: window.location.pathname, values: packValues() };
      var encoded = encodeBase64Url(JSON.stringify(payload));
      var url = new URL(canonicalUrl.href);
      url.searchParams.set(shareParam, encoded);
      return url.href;
    }

    function copyText(value) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(value);
      }
      return new Promise(function (resolve, reject) {
        var field = document.createElement('textarea');
        field.value = value;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        field.remove();
        if (ok) resolve(); else reject(new Error('Copy unavailable'));
      });
    }

    var bar = document.createElement('section');
    bar.className = 'caluler-result-actionbar';
    bar.setAttribute('aria-label', 'Calculator feedback and sharing');
    bar.innerHTML = `
      <div class="caluler-result-help">
        <span class="caluler-result-help-label"><span class="caluler-result-help-label-full">Was this helpful?</span><span class="caluler-result-help-label-short" aria-hidden="true">Helpful?</span></span>
        <button type="button" class="caluler-result-vote" data-vote="yes" aria-pressed="false">Yes</button>
        <button type="button" class="caluler-result-vote" data-vote="no" aria-pressed="false">No</button>
        <span class="caluler-result-thanks" hidden role="status">Thanks for your feedback.</span>
      </div>
      <div class="caluler-result-tools">
        <button type="button" class="caluler-result-tool" data-action="embed" aria-label="Embed code" title="Embed code">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></svg><span>Embed</span>
        </button>
        <button type="button" class="caluler-result-tool" data-action="share" aria-label="Share result" title="Share result">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4"/></svg><span>Share</span>
        </button>
        <button type="button" class="caluler-result-tool" data-action="report" aria-label="Report an issue" title="Report an issue">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z"/></svg><span>Report</span>
        </button>
      </div>
      <div class="caluler-result-popover" data-panel="share" hidden>
        <div class="caluler-result-popover-title">Share this result</div>
        <p>The link includes the calculator inputs so the recipient can reproduce this result.</p>
        <div class="caluler-share-links">
          <a data-social="facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a data-social="x" target="_blank" rel="noopener noreferrer">X</a>
          <a data-social="linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a data-social="whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
        <button type="button" class="caluler-result-copy-action" data-action="copy-link">Copy result link</button>
      </div>
      <div class="caluler-result-popover" data-panel="embed" hidden>
        <div class="caluler-result-popover-title">Embed this calculator</div>
        <p>This iframe opens the full calculator page with the current inputs restored.</p>
        <textarea readonly rows="4" aria-label="Embed code" data-embed-code></textarea>
        <button type="button" class="caluler-result-copy-action" data-action="copy-embed">Copy embed code</button>
      </div>
      <div class="caluler-result-popover" data-panel="report" hidden>
        <div class="caluler-result-popover-title">Report an issue</div>
        <p>This static site does not currently submit feedback to a server. Copy this report and send it through the site's contact channel.</p>
        <textarea rows="5" aria-label="Issue report" data-report-text></textarea>
        <button type="button" class="caluler-result-copy-action" data-action="copy-report">Copy issue report</button>
      </div>
      <span class="caluler-result-action-status" role="status" aria-live="polite"></span>
    `;

    result.insertAdjacentElement('afterend', bar);

    /* CALULER-RESULT-ACTIONBAR-GRID-POSITION-V6-START */
/* Position the action bar from the actual result and schedule geometry. */
var positionActionBarAfterResult = function () {
  if (!result || !bar || !result.parentElement) return;

  var parent = result.parentElement;

  if (bar.parentNode !== parent || result.nextElementSibling !== bar) {
    result.insertAdjacentElement('afterend', bar);
  }

  // One fraction of the same parent for both siblings; never shrink a wrapper.
  [result, bar].forEach(function (section) {
    section.style.setProperty('width', 'var(--caluler-result-section-width, 100%)', 'important');
    section.style.setProperty('max-width', '100%', 'important');
    section.style.setProperty('min-width', '0', 'important');
    section.style.setProperty('box-sizing', 'border-box', 'important');
    section.style.setProperty('margin-left', '0px', 'important');
    section.style.setProperty('margin-right', 'auto', 'important');
    section.style.setProperty('justify-self', 'start', 'important');
  });
  var parentStyle = window.getComputedStyle(parent);
  var sectionGap = parseFloat(parentStyle.getPropertyValue('--caluler-result-section-gap')) || 18;
  var parentIsGrid = parentStyle.display === 'grid' || parentStyle.display === 'inline-grid';
  var rowGap = parentIsGrid ? parseFloat(parentStyle.rowGap) || 0 : 0;
  if (parentIsGrid) {
    result.style.setProperty('grid-column', '1 / -1', 'important');
    bar.style.setProperty('grid-column', '1 / -1', 'important');
  }
  result.style.setProperty('margin-bottom', '0px', 'important');
  bar.style.setProperty('margin-top', (sectionGap - rowGap) + 'px', 'important');

  // Existing Finance grid/schedule placement stays below; other categories keep their own layout.
  if (!isFinance) return;

  /* Cancel any old offset before calculating natural geometry. */
  if (isEmi) {
    bar.style.setProperty('position', 'relative', 'important');
    bar.style.setProperty('top', '0px', 'important');
    bar.style.setProperty('margin-bottom', '0px', 'important');
  }

  var resultRect = result.getBoundingClientRect();
  if (!resultRect || resultRect.width <= 0) return;

  bar.style.setProperty('display', 'flex', 'important');
  bar.style.setProperty('flex-direction', 'row', 'important');
  bar.style.setProperty('align-items', 'center', 'important');
  bar.style.setProperty('justify-content', 'space-between', 'important');
  bar.style.setProperty('min-width', '0', 'important');
  bar.style.setProperty('box-sizing', 'border-box', 'important');
  bar.style.setProperty('overflow', 'visible', 'important');

  var help = bar.querySelector('.caluler-result-help');
  var tools = bar.querySelector('.caluler-result-tools');

  if (help) {
    help.style.setProperty('display', 'flex', 'important');
    help.style.setProperty('flex', '1 1 auto', 'important');
    help.style.setProperty('align-items', 'center', 'important');
    help.style.setProperty('justify-content', 'flex-start', 'important');
    help.style.setProperty('min-width', '0', 'important');
  }

  if (tools) {
    tools.style.setProperty('display', 'flex', 'important');
    tools.style.setProperty('flex', '0 0 auto', 'important');
    tools.style.setProperty('align-items', 'center', 'important');
    tools.style.setProperty('justify-content', 'flex-end', 'important');
    tools.style.setProperty('width', 'auto', 'important');
    tools.style.setProperty('margin-left', 'auto', 'important');
  }

  var parentDisplay = parentStyle.display;
  var isGrid = parentDisplay === 'grid' || parentDisplay === 'inline-grid';

  if (isGrid) {
    var resultGrid = window.getComputedStyle(result);
    var rowEnd = parseInt(resultGrid.gridRowEnd, 10);
    var colStart = parseInt(resultGrid.gridColumnStart, 10);
    var colEnd = parseInt(resultGrid.gridColumnEnd, 10);

    if (Number.isFinite(rowEnd) && rowEnd > 0) {
      bar.style.setProperty('grid-row', rowEnd + ' / span 1', 'important');
    }

    if (
      Number.isFinite(colStart) &&
      Number.isFinite(colEnd) &&
      colStart > 0 &&
      colEnd > colStart
    ) {
      bar.style.setProperty(
        'grid-column',
        colStart + ' / ' + colEnd,
        'important'
      );
    }

    bar.style.setProperty('justify-self', 'start', 'important');
    bar.style.setProperty('align-self', 'start', 'important');
  } else {
    bar.style.removeProperty('grid-row');
    bar.style.removeProperty('grid-column');
    bar.style.removeProperty('grid-area');
  }

  /* Only move EMI bar when a repayment schedule is actually present. */
  if (
    isEmi &&
    window.matchMedia('(min-width: 900px)').matches
  ) {
    var schedule =
      result.querySelector('.emi-schedule-scroll') ||
      result.querySelector('.emi-repayment-table');

    if (schedule && schedule.getClientRects().length > 0) {
      var finalResultRect = result.getBoundingClientRect();
      var naturalBarRect = bar.getBoundingClientRect();

      var desiredTop = finalResultRect.bottom + sectionGap;
      var adjustment = Math.round(desiredTop - naturalBarRect.top);

      if (Math.abs(adjustment) > 1) {
        bar.style.setProperty('top', adjustment + 'px', 'important');
        bar.style.setProperty('margin-bottom', adjustment + 'px', 'important');
      }
    }
  }
};

positionActionBarAfterResult();

if (!bar.__calulerActionWidthV6Bound) {
  bar.__calulerActionWidthV6Bound = true;

  var refreshActionWidthV6 = function () {
    window.requestAnimationFrame(positionActionBarAfterResult);
  };

  window.addEventListener('resize', refreshActionWidthV6, {
    passive: true
  });

  if ('ResizeObserver' in window) {
    var resultWidthObserverV6 = new ResizeObserver(refreshActionWidthV6);
    resultWidthObserverV6.observe(result);
    resultWidthObserverV6.observe(result.parentElement);
    bar.__calulerResultWidthObserverV6 = resultWidthObserverV6;
  }

  if ('MutationObserver' in window) {
    var resultMutationObserverV6 = new MutationObserver(refreshActionWidthV6);

    resultMutationObserverV6.observe(result, {
      childList: true,
      subtree: true,
      characterData: true
    });

    bar.__calulerResultMutationObserverV6 = resultMutationObserverV6;
  }
}
/* CALULER-RESULT-ACTIONBAR-GRID-POSITION-V6-END */

    var sharePanel = bar.querySelector('[data-panel="share"]');
    var embedPanel = bar.querySelector('[data-panel="embed"]');
    var reportPanel = bar.querySelector('[data-panel="report"]');
    var status = bar.querySelector('.caluler-result-action-status');
    if (sharePageOnly) {
      sharePanel.querySelector('.caluler-result-popover-title').textContent = 'Share this calculator';
      sharePanel.querySelector('p').textContent = 'Share the calculator page link.';
      embedPanel.querySelector('p').textContent = isHealth ? 'This iframe opens the calculator page without including personal measurements.' : 'This iframe opens the calculator page without including input values.';
      var shareButton = bar.querySelector('[data-action="share"]');
      shareButton.setAttribute('aria-label', 'Share calculator'); shareButton.title = 'Share calculator';
      var contact = document.createElement('a');
      contact.href = new URL('/contact.html', canonicalUrl.href).href;
      contact.textContent = 'Open contact page'; contact.target = '_blank'; contact.rel = 'noopener noreferrer';
      reportPanel.appendChild(contact);
    }

    function showStatus(message) {
      status.textContent = message;
      window.clearTimeout(showStatus.timer);
      showStatus.timer = window.setTimeout(function () { status.textContent = ''; }, 3500);
    }

    function closePanels() {
      [sharePanel, embedPanel, reportPanel].forEach(function (panel) { panel.hidden = true; });
    }

    function createEmbedCode(shareUrl) {
      var embedUrl = new URL(shareUrl);
      embedUrl.searchParams.set('caluler_embed', '1');
      var safeUrl = embedUrl.href.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      var safeTitle = String(title || 'Caluler calculator').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
      return '<iframe src="' + safeUrl + '" title="' + safeTitle + '" width="100%" height="900" loading="lazy" style="border:0;max-width:100%;" allow="clipboard-write"></iframe>';
    }

    function refreshShareDestinations() {
      var shareUrl = buildShareUrl();
      var encodedUrl = encodeURIComponent(shareUrl);
      var encodedTitle = encodeURIComponent(title);
      bar.querySelector('[data-social="facebook"]').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl;
      bar.querySelector('[data-social="x"]').href = 'https://twitter.com/intent/tweet?url=' + encodedUrl + '&text=' + encodedTitle;
      bar.querySelector('[data-social="linkedin"]').href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodedUrl;
      bar.querySelector('[data-social="whatsapp"]').href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(title + ' - ' + shareUrl);
      return shareUrl;
    }

    function fillReportText() {
      var report = [
        'Caluler calculator issue report',
        'Calculator: ' + title,
        'Page: ' + canonicalUrl.href,
        (sharePageOnly ? 'Page link: ' : 'Shared input link: ') + buildShareUrl(),
        'Browser: ' + navigator.userAgent,
        'Please describe the issue below:'
      ].join('\n');
      bar.querySelector('[data-report-text]').value = report + '\n';
    }

    bar.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-action],button[data-vote]');
      if (!button || !bar.contains(button)) return;

      var vote = button.getAttribute('data-vote');
      if (vote) {
        bar.querySelectorAll('[data-vote]').forEach(function (item) {
          item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
        });
        bar.querySelector('.caluler-result-thanks').hidden = false;
        showStatus(sharePageOnly ? 'Feedback noted for this page only; no server submission.' : 'Feedback acknowledged on this device.');
        return;
      }

      var action = button.getAttribute('data-action');
      if (action === 'share' && (sharePageOnly || typeof navigator.share === 'function')) {
        closePanels();
        var pageUrl = buildShareUrl();
        var copyPageLink = function () {
          return copyText(pageUrl).then(function () { showStatus('Calculator link copied.'); })
            .catch(function () { showStatus('Could not copy the calculator link.'); });
        };
        if (typeof navigator.share === 'function') {
          try {
            Promise.resolve(navigator.share({title:title,url:pageUrl})).then(function () { showStatus('Sharing completed.'); })
              .catch(function (error) { if (error && error.name === 'AbortError') showStatus('Sharing cancelled.'); else copyPageLink(); });
          } catch (error) { copyPageLink(); }
        } else copyPageLink();
        return;
      }
      try {
        if (action === 'share') {
          var shareWasOpen = !sharePanel.hidden;
          closePanels();
          if (!shareWasOpen) {
            refreshShareDestinations();
            sharePanel.hidden = false;
          }
        } else if (action === 'embed') {
          var embedWasOpen = !embedPanel.hidden;
          closePanels();
          if (!embedWasOpen) {
            var embedUrl = refreshShareDestinations();
            bar.querySelector('[data-embed-code]').value = createEmbedCode(embedUrl);
            embedPanel.hidden = false;
          }
        } else if (action === 'report') {
          var reportWasOpen = !reportPanel.hidden;
          closePanels();
          if (!reportWasOpen) {
            fillReportText();
            reportPanel.hidden = false;
          }
        } else if (action === 'copy-link') {
          copyText(buildShareUrl()).then(function () { showStatus('Result link copied.'); }).catch(function () { showStatus('Could not copy the result link.'); });
        } else if (action === 'copy-embed') {
          copyText(bar.querySelector('[data-embed-code]').value).then(function () { showStatus('Embed code copied.'); }).catch(function () { showStatus('Could not copy the embed code.'); });
        } else if (action === 'copy-report') {
          copyText(bar.querySelector('[data-report-text]').value).then(function () { showStatus('Issue report copied.'); }).catch(function () { showStatus('Could not copy the issue report.'); });
        }
      } catch (error) {
        showStatus(error && error.message ? error.message : 'This action could not be completed.');
      }
    });

    document.addEventListener('click', function (event) {
      if (!bar.contains(event.target)) closePanels();
    });

    function restoreSharedValues() {
      if (sharePageOnly) return;
      var params = new URLSearchParams(window.location.search);
      var encoded = params.get(shareParam);
      if (!encoded) return;
      try {
        var payload = JSON.parse(decodeBase64Url(encoded));
        if (!payload || payload.version !== 1 || payload.path !== window.location.pathname || !payload.values) return;
        Object.keys(payload.values).forEach(function (id) {
          if (id === 'calulerLanguage') return;
          if (isEmi && allowedEmiIds.indexOf(id) === -1) return;
          var field = document.getElementById(id);
          if (!field || (!isEmi && !form.contains(field))) return;
          var saved = payload.values[id];
          if (saved && (saved.type === 'checkbox' || saved.type === 'radio')) field.checked = !!saved.checked;
          else if (saved && Object.prototype.hasOwnProperty.call(saved, 'value')) field.value = String(saved.value);
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.dispatchEvent(new Event('change', { bubbles: true }));
        });
        if(document.querySelector('.finance-live-diagram[data-caluler-submit-only="true"]')){showStatus('Shared inputs restored. Select Calculate to refresh results and diagram.');return;}
        window.setTimeout(function () {
          if (isEmi) {
            var emiButton = document.getElementById('amCalculateBtn');
            if (emiButton) emiButton.click();
          } else if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
          showStatus('Shared calculator inputs restored.');
        }, 80);
      } catch (error) {
        showStatus('The shared calculator link could not be read.');
      }
    }

    restoreSharedValues();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
/* END CALULER-FINANCE-RESULT-SHARE-BAR-V1 */
/* CALULER-WHOLE-WEBSITE-RELATED-PANEL-ORDER-V2-START */
/* Keep Related Tools, one existing/new content placeholder, then the guide. Never touch hero or legacy body slots. */
(function calulerWholeWebsiteRelatedPanelOrderV2() {
  function moveRelatedPanelsBelowCalculators() {
    document.querySelectorAll('body[data-caluler-category] .tool-layout').forEach(function (layout) {
      var children=Array.from(layout.children),main=children.find(node=>node.tagName==='MAIN');
      if(!main)return;
      var sidebar=children.find(node=>node.tagName==='ASIDE')||Array.from(main.children).find(node=>node.tagName==='ASIDE'&&(node.classList.contains('caluler-master-related-panel')||node.querySelector('.related,.caluler-related-tools')));
      if(!sidebar)return;
      var blocks=Array.from(main.children),calculator=blocks.find(node=>node.classList.contains('calculator'));
      var target=blocks.slice(calculator?blocks.indexOf(calculator)+1:0).find(node=>node!==sidebar&&node.matches('.ad-slot,.caluler-ad-slot,.content-box,.tool-faq'));
      if(target){if(sidebar.parentNode!==main||sidebar.nextElementSibling!==target)main.insertBefore(sidebar,target);}
      else if(sidebar.parentNode!==main||sidebar!==main.lastElementChild)main.appendChild(sidebar);
      sidebar.classList.add('caluler-master-related-panel');
      var ad=Array.from(main.children).find(node=>node.classList.contains('caluler-related-ad-space'))||Array.from(main.children).find(node=>node.matches('.ad-slot,.caluler-ad-slot--content'));
      if(!ad){ad=document.createElement('div');ad.className='ad-slot';ad.textContent='Advertisement';}
      var next=sidebar.nextElementSibling;
      if(ad!==next){
        // Preserve loaded advertising state when a browser supports a state-preserving move.
        if(ad.querySelector('iframe,ins.adsbygoogle[data-adsbygoogle-status],ins.adsbygoogle[data-ad-status]')&&typeof main.moveBefore!=='function'){
          layout.dataset.calulerAdPlacement='preserved-loaded-ad';return;
        }
        if(typeof main.moveBefore==='function'&&ad.isConnected)main.moveBefore(ad,next);
        else main.insertBefore(ad,next);
      }
      ad.classList.add('caluler-related-ad-space');
      if(!ad.getAttribute('role'))ad.setAttribute('role','complementary');
      if(!ad.getAttribute('aria-label'))ad.setAttribute('aria-label','Advertisement');
      if(!ad.children.length&&/^(?:Ad space|Advertisement(?: space)?)?$/i.test(ad.textContent.trim())&&ad.textContent!=='Advertisement')ad.textContent='Advertisement';
      layout.dataset.calulerAdPlacement='ready';
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',moveRelatedPanelsBelowCalculators,{once:true});
  else moveRelatedPanelsBelowCalculators();
  window.addEventListener('pageshow',moveRelatedPanelsBelowCalculators);
})();
/* CALULER-WHOLE-WEBSITE-RELATED-PANEL-ORDER-V2-END */

/* CALULER-ALL-TOOLS-REFRESH-PERSISTENCE-V1-START */
(function () {
  'use strict';

  if (window.__calulerAllToolsRefreshPersistenceV1) return;
  window.__calulerAllToolsRefreshPersistenceV1 = true;

  var CONTROL_SELECTOR =
    '.calculator input, .calculator select, .calculator textarea';
  var RESULT_SELECTOR = '.calculator .result';
  var STORAGE_KEY =
    'caluler:calculator-state:v1:' + window.location.pathname;
  var MAX_AGE = 90 * 24 * 60 * 60 * 1000;

  var saveTimer = null;
  var restoring = false;
  var resultObserver = null;

  function readState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}

    try {
      var fallback = window.sessionStorage.getItem(STORAGE_KEY);
      if (fallback) return JSON.parse(fallback);
    } catch (_) {}

    return null;
  }

  function writeState(state) {
    var raw;

    try {
      raw = JSON.stringify(state);
    } catch (_) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, raw);
      return;
    } catch (_) {}

    try {
      window.sessionStorage.setItem(STORAGE_KEY, raw);
    } catch (_) {}
  }

  function getControls() {
    return Array.prototype.slice.call(
      document.querySelectorAll(CONTROL_SELECTOR)
    ).filter(function (el) {
      var type = (el.type || '').toLowerCase();
      return !['file', 'button', 'submit', 'reset', 'image'].includes(type);
    });
  }

  function captureControls() {
    return getControls().map(function (el, index) {
      var tag = el.tagName.toLowerCase();
      var item = {
        index: index,
        tag: tag,
        type: (el.type || '').toLowerCase(),
        value: el.value
      };

      if (typeof el.checked === 'boolean') {
        item.checked = el.checked;
      }

      if (tag === 'select') {
        item.selectedIndex = el.selectedIndex;
      }

      return item;
    });
  }

  function captureResults() {
    return Array.prototype.slice.call(
      document.querySelectorAll(RESULT_SELECTOR)
    ).map(function (result, index) {
      var clone = result.cloneNode(true);

      clone.querySelectorAll(
        '.caluler-result-toolbar,[data-caluler-export-ui]'
      ).forEach(function (toolbar) {
        toolbar.remove();
      });

      return {
        index: index,
        id: result.id || '',
        html: clone.innerHTML
      };
    });
  }

  function saveNow() {
    if (restoring || !document.querySelector('.calculator')) return;

    writeState({
      version: 1,
      savedAt: Date.now(),
      controls: captureControls(),
      results: captureResults()
    });
  }

  function scheduleSave() {
    if (restoring) return;

    if (saveTimer !== null) {
      window.clearTimeout(saveTimer);
    }

    saveTimer = window.setTimeout(function () {
      saveTimer = null;
      saveNow();
    }, 120);
  }

  function restoreState() {
    var state = readState();

    if (!state || state.version !== 1) return;

    if (
      !state.savedAt ||
      Date.now() - state.savedAt > MAX_AGE
    ) {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch (_) {}
      try { window.sessionStorage.removeItem(STORAGE_KEY); } catch (_) {}
      return;
    }

    restoring = true;

    try {
      var controls = getControls();

      (state.controls || []).forEach(function (item) {
        var el = controls[item.index];

        if (!el || el.tagName.toLowerCase() !== item.tag) return;

        if (
          item.type &&
          (el.type || '').toLowerCase() !== item.type
        ) return;

        if (typeof item.value === 'string') {
          el.value = item.value;
        }

        if (
          typeof item.checked === 'boolean' &&
          typeof el.checked === 'boolean'
        ) {
          el.checked = item.checked;
        }

        if (
          item.tag === 'select' &&
          el.value !== item.value &&
          typeof item.selectedIndex === 'number'
        ) {
          el.selectedIndex = item.selectedIndex;
        }
      });

      var results = document.querySelectorAll(RESULT_SELECTOR);

      (state.results || []).forEach(function (item) {
        var result = results[item.index];

        if (!result || typeof item.html !== 'string') return;

        if (item.id && result.id !== item.id) return;

        if(result.closest('.calculator')?.querySelector('.finance-live-diagram[data-caluler-submit-only="true"]'))return;
        result.innerHTML = item.html;
      });

    } catch (error) {
      console.warn(
        '[Caluler persistence] Restore skipped:',
        error
      );
    }

    window.setTimeout(function () {
      restoring = false;
      saveNow();
    }, 250);
  }

  function initialise() {
    restoreState();

    document.addEventListener('input', function (event) {
      if (event.target && event.target.closest('.calculator')) {
        scheduleSave();
      }
    }, true);

    document.addEventListener('change', function (event) {
      if (event.target && event.target.closest('.calculator')) {
        scheduleSave();
      }
    }, true);

    document.addEventListener('click', function (event) {
      if (!event.target || !event.target.closest('.calculator')) return;

      var button = event.target.closest('button');
      if (button) scheduleSave();
    }, true);

    document.querySelectorAll(RESULT_SELECTOR).forEach(function (result) {
      if (!window.MutationObserver) return;

      var observer = new MutationObserver(function () {
        scheduleSave();
      });

      observer.observe(result, {
        childList: true,
        subtree: true,
        characterData: true
      });

      if (!resultObserver) resultObserver = [];
      resultObserver.push(observer);
    });

    window.addEventListener('pagehide', saveNow);
    window.addEventListener('beforeunload', saveNow);

    // Capture the current state once after all page scripts have initialised.
    scheduleSave();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})();
/* CALULER-ALL-TOOLS-REFRESH-PERSISTENCE-V1-END */


/* CALULER-FINANCE-CONTEXTUAL-VALUE-TOOLTIPS-V1 */
(function () {
  'use strict';
  if (window.__calulerFinanceValueTooltips) return;
  window.__calulerFinanceValueTooltips = true;

  function initialise() {
    const body = document.body;
    if (!body || body.dataset.calulerCategory !== 'Finance Calculators') return;
    const panels = Array.from(document.querySelectorAll('.finance-live-diagram'));
    if (!panels.length) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'caluler-finance-value-tooltip';
    tooltip.id = 'caluler-finance-value-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.hidden = true;
    document.body.appendChild(tooltip);
    let activeNode = null;
    let suppressedFocusNode = null;
    let lastPointer={x:0,y:0,pointer:false,sample:false};

    // Opt-in keeps unrelated Finance diagrams on their existing interaction path.
    const colorMatched=node=>Boolean(node?.closest('.finance-live-diagram[data-caluler-color-tooltips="true"]'));
    function rgb(value){
      if(!value||value==='none'||value==='transparent')return null;
      const h=String(value).trim().match(/^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i);
      if(h){let t=h[1];if(t.length===3)t=t.split('').map(c=>c+c).join('');if(t.length===8&&parseInt(t.slice(6),16)<32)return null;return [0,2,4].map(i=>parseInt(t.slice(i,i+2),16));}
      const m=String(value).match(/^rgba?\(([^)]+)\)/i);if(!m)return null;
      const p=m[1].split(/[, /]+/).filter(Boolean).map(Number);return p.length>=3&&(p.length<4||p[3]>.12)?p.slice(0,3):null;
    }
    function svgPaint(value,node){
      const c=rgb(value);if(c)return c;
      const id=String(value||'').match(/url\(["']?[^#)]*#([^)"']+)/),g=id&&node.ownerSVGElement?.querySelector('#'+id[1]),stops=g?Array.from(g.querySelectorAll('stop')):[];
      if(!stops.length)return null;const stop=stops[Math.floor(stops.length/2)];return rgb(getComputedStyle(stop).stopColor||stop.getAttribute('stop-color'));
    }
    function readPaint(node){
      const s=getComputedStyle(node);
      if(node.ownerSVGElement){const first=/^(line|polyline)$/i.test(node.tagName);const c=svgPaint(first?s.stroke:s.fill,node)||svgPaint(first?s.fill:s.stroke,node);if(c)return c;}
      for(const side of ['Left','Right','Top','Bottom'])if(parseFloat(s['border'+side+'Width'])>=3){const c=rgb(s['border'+side+'Color']);if(c)return c;}
      const gradient=String(s.backgroundImage||'').match(/rgba?\([^)]+\)|#[\da-f]{3,8}/gi);if(gradient?.length){const c=rgb(gradient[Math.floor(gradient.length/2)]);if(c)return c;}
      const bg=rgb(s.backgroundColor);if(bg&&Math.min(...bg)<244)return bg;
      const pseudo=rgb(getComputedStyle(node,'::before').backgroundColor);if(pseudo)return pseudo;
      for(const side of ['Top','Bottom','Left','Right'])if(parseFloat(s['border'+side+'Width'])>0){const c=rgb(s['border'+side+'Color']);if(c)return c;}
      return null;
    }
    function matchedColor(node){
      const source=node.dataset.calulerColorSource||'';
      if(source.startsWith('--')){const c=rgb(getComputedStyle(node).getPropertyValue(source));if(c)return c;}
      if(source==='text')return rgb(getComputedStyle(node).color);
      if(source.startsWith('selector:')){const child=node.querySelector(source.slice(9));if(child)return readPaint(child)||rgb(getComputedStyle(child).color);}
      const panel=node.closest('.finance-live-diagram');
      for(let el=node;el&&el!==panel;el=el.parentElement){const c=readPaint(el);if(c)return c;}
      return rgb(getComputedStyle(node).color)||[17,111,159];
    }
    function contrast(a,b){
      const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
      const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
    }
    function applyMatchedColor(node){
      if(!colorMatched(node)){tooltip.removeAttribute('data-caluler-color-match');tooltip.style.removeProperty('--caluler-tooltip-color');tooltip.style.removeProperty('--caluler-tooltip-ink');return;}
      const accent=matchedColor(node)||[17,111,159],dark=document.documentElement.dataset.theme==='dark'||document.body.classList.contains('dark-mode');
      const bg=rgb(getComputedStyle(tooltip).backgroundColor)||(dark?[17,28,46]:[255,255,255]);
      const target=contrast([255,255,255],bg)>contrast([0,0,0],bg)?[255,255,255]:[0,0,0];let ink=accent;
      for(let i=1;contrast(ink,bg)<4.5&&i<=20;i++)ink=accent.map((v,k)=>Math.round(v+(target[k]-v)*i/20));
      tooltip.dataset.calulerColorMatch='true';tooltip.style.setProperty('--caluler-tooltip-color','rgb('+accent.join(',')+')');tooltip.style.setProperty('--caluler-tooltip-ink','rgb('+ink.join(',')+')');
    }
    function valueAt(node,x,sample){
      const fallback={label:node.dataset.calulerValueLabel,value:node.dataset.calulerValue};
      if(!sample||!node.dataset.calulerTooltipSeries||!Number.isFinite(x))return fallback;
      try{const points=JSON.parse(node.dataset.calulerTooltipSeries),svg=node.ownerSVGElement;if(!points.length||!svg)return fallback;
        const rect=svg.getBoundingClientRect(),view=svg.viewBox.baseVal;if(rect.width<=0)return fallback;
        const local=view.x+(x-rect.left)*view.width/rect.width;
        return points.reduce((best,p)=>Math.abs(p.x-local)<Math.abs(best.x-local)?p:best,points[0]);
      }catch(_error){return fallback;}
    }


    function hide() {
      if (activeNode) activeNode.removeAttribute('aria-describedby');
      activeNode = null;
      tooltip.hidden = true;
      tooltip.setAttribute('aria-hidden', 'true');
    }
    function place(node, x, y, pointer) {
      const margin = 8;
      const mobile = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
      const anchor = node.getBoundingClientRect();
      tooltip.hidden = false;
      tooltip.setAttribute('aria-hidden', 'false');
      const box = tooltip.getBoundingClientRect();
      let left, top;
      if (mobile) {
        const chart = node.closest('svg');
        const area = chart ? chart.getBoundingClientRect() : anchor;
        left = Math.max(margin, Math.min(window.innerWidth - box.width - margin, anchor.left + anchor.width / 2 - box.width / 2));
        top = area.bottom + margin;
        if (top + box.height > window.innerHeight - margin) top = area.top - box.height - margin;
      } else if (pointer && Number.isFinite(x) && Number.isFinite(y)) {
        left = x + 14;
        top = y + 14;
        if (left + box.width > window.innerWidth - margin) left = x - box.width - 14;
        if (top + box.height > window.innerHeight - margin) top = y - box.height - 14;
      } else {
        left = anchor.right + 10;
        top = anchor.top + anchor.height / 2 - box.height / 2;
        if (left + box.width > window.innerWidth - margin) left = anchor.left - box.width - 10;
      }
      left = Math.max(margin, Math.min(window.innerWidth - box.width - margin, left));
      top = Math.max(margin, Math.min(window.innerHeight - box.height - margin, top));
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    }
    function show(node, x, y, pointer, sample = pointer) {
      if (!node || !node.isConnected) return;
      if (activeNode && activeNode !== node) activeNode.removeAttribute('aria-describedby');
      activeNode = node;
      lastPointer={x,y,pointer,sample};
      const current=valueAt(node,x,sample);
      tooltip.textContent=current.label+': '+current.value;
      applyMatchedColor(node);
      node.setAttribute('aria-describedby', tooltip.id);
      place(node, x, y, pointer);
    }
    window.calulerFinanceAnnotate=annotate;
    window.calulerFinanceRefreshTooltip=panel=>{if(activeNode&&panel.contains(activeNode)&&!tooltip.hidden)show(activeNode,lastPointer.x,lastPointer.y,lastPointer.pointer,lastPointer.sample);};
    function normalise(value) {
      return String(value || '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    }
    function informativePaint(element) {
      const paints = [element.getAttribute('fill'), element.getAttribute('stroke')].filter(Boolean);
      return paints.some(function (paint) {
        const value = paint.toLowerCase().replace(/\s+/g, '');
        if (value === 'none' || value === 'transparent' || value === '#fff' || value === '#ffffff' || value === '#000000' || value.startsWith('url(#')) return value.startsWith('url(#');
        if (value.includes('var(')) return !/(border|line|surface|muted|text|pale|white)/.test(value);
        const hex = value.match(/^#([0-9a-f]{6})$/i);
        if (!hex) return false;
        const number = parseInt(hex[1], 16), r = number >> 16, g = (number >> 8) & 255, b = number & 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        return max > 70 && max - min > 35;
      });
    }
    function boxOf(element) {
      try { const box = element.getBBox(); return box && box.width + box.height > 0 ? box : null; }
      catch (_) { return null; }
    }
    function annotate(panel) {
      const items = panel.querySelector('.finance-live-items');
      if (!items) return;
      if (activeNode && (!activeNode.isConnected || (!colorMatched(activeNode) && !tooltip.hidden && !activeNode.dataset.calulerTooltipSeries && tooltip.textContent!==activeNode.dataset.calulerValueLabel+': '+activeNode.dataset.calulerValue))) hide();
      if(panel.dataset.calulerColorTooltips==='true'){
        items.querySelectorAll('.finance-mobile-card').forEach(card=>{
          const label=card.querySelector('.finance-mobile-label')?.textContent?.trim(),value=card.querySelector('.finance-mobile-value')?.textContent?.trim();
          if(!label||!value)return;
          card.dataset.calulerValueLabel=label;card.dataset.calulerValue=value;card.dataset.calulerColorSource='selector:.finance-mobile-fill';card.setAttribute('tabindex','0');if(!card.hasAttribute('role'))card.setAttribute('role','img');card.setAttribute('aria-label',label+': '+value);
        });
        if(!items.querySelector('svg.finance-visual-svg'))return;
      }
      if(panel.dataset.calulerColorTooltips!=='true')items.querySelectorAll('[data-caluler-value-label]').forEach(function (node) {
        if (node.dataset.calulerSvgTooltip === 'true') {
          node.removeAttribute('data-caluler-value-label');
          node.removeAttribute('data-caluler-value');
          node.removeAttribute('tabindex');
          node.removeAttribute('aria-label');
          node.removeAttribute('aria-describedby');
          node.removeAttribute('data-caluler-svg-tooltip');
        }
      });
      const cards = Array.from(items.querySelectorAll('.finance-mobile-card'));
      const rows = cards.map(function (card) {
        return {
          label: card.querySelector('.finance-mobile-label')?.textContent?.trim() || '',
          value: card.querySelector('.finance-mobile-value')?.textContent?.trim() || ''
        };
      }).filter(row => row.label && row.value);
      items.querySelectorAll('svg.finance-visual-svg').forEach(function (svg) {
        const texts = Array.from(svg.querySelectorAll('text')).map(element => ({element, box:boxOf(element), text:normalise(element.textContent)})).filter(item => item.box && item.text.length >= 6);
        const viewBox = (svg.getAttribute('viewBox') || '0 0 720 270').split(/[ ,]+/).map(Number);
        const canvasArea = Math.max(1, (viewBox[2] || 720) * (viewBox[3] || 270));
        const shapes = Array.from(svg.querySelectorAll('rect,circle,line,path,polyline,polygon')).map(element => ({element,box:boxOf(element)})).filter(item => {
          if (!item.box || !informativePaint(item.element)) return false;
          return item.box.width * item.box.height < canvasArea * .22;
        });
        let added = false;
        rows.forEach(function (row) {
          const key = normalise(row.label);
          const matchingTexts = texts.filter(item => item.text === key || (item.text.length >= 8 && key.startsWith(item.text)) || (key.length >= 8 && item.text.startsWith(key)));
          matchingTexts.forEach(function (text) {
            const tx = text.box.x + text.box.width / 2, ty = text.box.y + text.box.height / 2;
            let nearest = null, nearestDistance = Infinity;
            shapes.forEach(function (shape) {
              const sx = shape.box.x + shape.box.width / 2, sy = shape.box.y + shape.box.height / 2;
              const distance = Math.hypot(tx - sx, ty - sy);
              if (distance < nearestDistance) { nearest = shape; nearestDistance = distance; }
            });
            if (!nearest || nearestDistance > 125 || (nearest.element.hasAttribute('data-caluler-value-label')&&nearest.element.dataset.calulerSvgTooltip!=='true')) return;
            const node = nearest.element;
            if (node.hasAttribute('title') || node.querySelector('title')) return;
            node.dataset.calulerValueLabel = row.label;
            node.dataset.calulerValue = row.value;
            node.dataset.calulerSvgTooltip = 'true';
            node.setAttribute('tabindex', '0');
            node.setAttribute('role', 'img');
            node.setAttribute('aria-label', `${row.label}: ${row.value}`);
            added = true;
          });
        });
        if (added) svg.setAttribute('role', 'group');
      });
    }

    panels.forEach(function (panel) {
      annotate(panel);
      const items = panel.querySelector('.finance-live-items');
      if (!items || !window.MutationObserver) return;
      const observer = new MutationObserver(function () { annotate(panel); });
      observer.observe(items, {childList:true, subtree:true, characterData:true});
    });

    document.addEventListener('pointerover', function (event) {
      if (event.pointerType !== 'mouse') return;
      const node = event.target.closest?.('[data-caluler-value-label]');
      if (node) show(node, event.clientX, event.clientY, true);
    });
    document.addEventListener('pointermove', function (event) {
      if (event.pointerType === 'mouse' && activeNode && event.target.closest?.('[data-caluler-value-label]') === activeNode){if(colorMatched(activeNode))show(activeNode,event.clientX,event.clientY,true);else place(activeNode,event.clientX,event.clientY,true);}
    });
    document.addEventListener('pointerout', function (event) {
      if (event.pointerType !== 'mouse') return;
      const node = event.target.closest?.('[data-caluler-value-label]');
      if (node && !event.relatedTarget?.closest?.('[data-caluler-value-label]')) hide();
    });
    document.addEventListener('pointerdown', function (event) {
      const node = event.target.closest?.('[data-caluler-value-label]');
      if(node&&colorMatched(node)&&event.pointerType!=='mouse'){
        if(activeNode===node&&!tooltip.hidden){hide();suppressedFocusNode=node;return;}
        show(node,event.clientX,event.clientY,false,true);suppressedFocusNode=node;return;
      }
      suppressedFocusNode=null;
      if (node) show(node,event.clientX,event.clientY,false,true);
      else hide();
    });
    document.addEventListener('focusin', function (event) {
      const node = event.target.closest?.('[data-caluler-value-label]');
      if(node===suppressedFocusNode){suppressedFocusNode=null;return;}
      suppressedFocusNode=null;
      if (node) show(node, 0, 0, false);
    });
    document.addEventListener('focusout', function (event) {
      const node=event.target.closest?.('[data-caluler-value-label]'),next=event.relatedTarget?.closest?.('[data-caluler-value-label]');
      if(node&&((colorMatched(node)&&node!==next)||!next))hide();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !tooltip.hidden) hide();
    });
    window.addEventListener('resize', function () { if (activeNode){applyMatchedColor(activeNode);place(activeNode, 0, 0, false);} });
    if(window.MutationObserver)new MutationObserver(()=>{if(activeNode&&colorMatched(activeNode)&&!tooltip.hidden){applyMatchedColor(activeNode);place(activeNode,0,0,false);}}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    window.addEventListener('scroll', function () { if (activeNode) place(activeNode, 0, 0, false); }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, {once:true});
  else initialise();
})();
/* END CALULER-FINANCE-CONTEXTUAL-VALUE-TOOLTIPS-V1 */

/* CALULER-FINANCE-PERSISTENT-MOTION-V1 */
(function(){
  'use strict';
  const duration=1900;
  const numberPattern=/[+−-]?\d[\d,]*(?:\.\d+)?(?:e[+-]?\d+)?/gi;
  function textBetween(a,b,p){
    const before=String(a).match(numberPattern)||[],after=String(b).match(numberPattern)||[];
    if(!before.length||before.length!==after.length)return b;
    let i=0;
    return String(b).replace(numberPattern,token=>{
      const x=Number(before[i++].replace(/,/g,'').replace('−','-')),y=Number(token.replace(/,/g,'').replace('−','-'));
      if(!Number.isFinite(x)||!Number.isFinite(y))return token;
      const value=x*(1-p)+y*p,decimals=Math.max(2,(token.split('.')[1]||'').length);
      return (token.startsWith('+')&&value>=0?'+':'')+value.toLocaleString(undefined,{maximumFractionDigits:Math.min(6,decimals)});
    });
  }
  function sample(array,fraction){
    if(!array?.length)return undefined;
    const at=fraction*(array.length-1),lo=Math.floor(at),hi=Math.ceil(at);
    return blend(array[lo],array[hi],at-lo);
  }
  function blend(a,b,p){
    if(p===1)return b;
    if(a===undefined){if(typeof b==='number')return b*p;if(Array.isArray(b))return b.map(v=>blend(undefined,v,p));if(b&&typeof b==='object')return Object.fromEntries(Object.keys(b).map(k=>[k,blend(undefined,b[k],p)]));return typeof b==='string'?textBetween(String(b).replace(numberPattern,'0'),b,p):b;}
    if(typeof b==='number')return typeof a==='number'?a*(1-p)+b*p:b;
    if(Array.isArray(b))return b.map((value,i)=>blend(sample(a,b.length>1?i/(b.length-1):0),value,p));
    if(b&&typeof b==='object')return Object.fromEntries(Object.keys(b).map(key=>[key,blend(a?.[key],b[key],p)]));
    if(typeof b==='boolean')return a===b?b:false;
    if(typeof b==='string')return textBetween(a,b,p);
    return b;
  }
  const signature=node=>node.nodeType===3?'#text':node.tagName+'|'+(node.getAttribute('class')||'').split(/\s+/)[0];
  function sync(live,template,childrenOnly=false){
    if(live.nodeType===3){if(live.nodeValue!==template.nodeValue)live.nodeValue=template.nodeValue;return;}
    if(!childrenOnly){
    const next=new Set(Array.from(template.attributes,attr=>attr.name));
    Array.from(live.attributes).forEach(attr=>{if(!next.has(attr.name)&&attr.name!=='aria-describedby'&&attr.name!=='data-finance-retained'&&!(live.dataset.calulerSvgTooltip==='true'&&/^(data-caluler-(value-label|value|svg-tooltip)|tabindex|role|aria-label)$/.test(attr.name)))live.removeAttribute(attr.name);});
    Array.from(template.attributes).forEach(attr=>{if(attr.name!=='aria-describedby'&&live.getAttribute(attr.name)!==attr.value)live.setAttribute(attr.name,attr.value);});
    }
    const pool=Array.from(live.childNodes).filter(n=>n.nodeType!==1||n.dataset.financeRetained!=='true'),used=new Set();
    Array.from(template.childNodes).forEach((wanted,index)=>{
      let node=pool[index];if(!node||used.has(node)||signature(node)!==signature(wanted))node=pool.find(n=>!used.has(n)&&signature(n)===signature(wanted));
      if(!node){node=wanted.cloneNode(true);live.insertBefore(node,live.childNodes[index]||null);}
      else{used.add(node);if(live.childNodes[index]!==node)live.insertBefore(node,live.childNodes[index]||null);sync(node,wanted);}
    });
    pool.forEach(node=>{if(!used.has(node)&&node.parentNode===live)node.remove();});
  }
  window.calulerFinanceMotion={blend,sync,create(panel,host,items){
    let current=null,target=null,frame=0,started=0,from=null;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
    function render(state){
      const template=document.createElement('div');host.calulerFinanceRender(state,template);
      const invalid=template.querySelector('.ci-live-state,.savings-goal-state')||(!template.querySelector('.cu-credit-track')&&template.querySelector('.cu-credit-status'));
      if(invalid)throw new Error(invalid.textContent);
      if(!template.childNodes.length)throw new Error('The financial diagram could not be rendered.');
      sync(items,template,true);items.classList.add('finance-live-visual-surface');
      host.calulerFinanceAfterFrame?.(state);
      window.calulerFinanceAnnotate?.(panel);
      window.calulerFinanceRefreshTooltip?.(panel);
    }
    function stop(){if(frame)cancelAnimationFrame(frame);frame=0;}
    function finish(){stop();if(target){current=target;render(current);}panel.dataset.calulerAnimating='false';panel.setAttribute('aria-busy','false');}
    function tick(now){
      const p=Math.min(1,Math.max(0,(now-started)/duration)),ease=(1-Math.cos(Math.PI*p))/2;
      current=p===1?target:blend(from,target,ease);render(current);
      if(p<1)frame=requestAnimationFrame(tick);else{frame=0;items.getBoundingClientRect();panel.dataset.calulerAnimating='false';panel.setAttribute('aria-busy','false');}
    }
    function commit(state,immediate=false){
      // Validate a detached template before interrupting the last valid visible state.
      const probe=document.createElement('div');host.calulerFinanceRender(state,probe);
      const bad=probe.querySelector('.ci-live-state,.savings-goal-state')||(!probe.querySelector('.cu-credit-track')&&probe.querySelector('.cu-credit-status'));if(bad)throw new Error(bad.textContent);
      stop();target=state;panel.dataset.calulerMotion='ready';
      if(!current||immediate||reduced?.matches){current=state;render(state);panel.dataset.calulerAnimating='false';panel.setAttribute('aria-busy','false');return;}
      from=current;started=performance.now();panel.dataset.calulerAnimating='true';panel.setAttribute('aria-busy','true');frame=requestAnimationFrame(tick);
    }
    function initialize(){
      try{const state=host.calulerFinanceRead();commit(state,true);panel.dataset.calulerMotion='ready';}
      catch(error){const fallback=document.createElement('p');fallback.className='caluler-finance-initial-state';fallback.setAttribute('role','status');fallback.textContent='Diagram unavailable: '+error.message;items.appendChild(fallback);}
    }
    reduced?.addEventListener?.('change',event=>{if(event.matches)finish();});
    let width=0;
    const reflow=()=>{if(current)render(current);};
    window.addEventListener('resize',reflow,{passive:true});
    if(typeof ResizeObserver==='function')new ResizeObserver(entries=>{
      const next=entries[0]?.contentRect?.width||items.getBoundingClientRect().width;
      if(next!==width){width=next;reflow();}
    }).observe(items);
    window.addEventListener('pageshow',()=>{if(current)reflow();else initialize();});
    return {commit,initialize,get current(){return current;},get target(){return target;}};
  }};
})();
/* END CALULER-FINANCE-PERSISTENT-MOTION-V1 */

/* CALULER-FINANCE-SUBMIT-ONLY-V1 */
(function(){
  'use strict';
  if(window.__calulerFinanceSubmitOnlyV1)return;
  window.__calulerFinanceSubmitOnlyV1=true;
  function start(){
    if(document.body?.dataset.calulerCategory!=='Finance Calculators')return;
    document.querySelectorAll('.finance-live-diagram[data-caluler-submit-only="true"]').forEach(panel=>{
      const calculator=panel.closest('.calculator'),host=calculator&&(calculator.querySelector('form')||calculator);
      const result=calculator?.querySelector('.result'),items=panel.querySelector('.finance-live-items');
      if(!host||!result||!items||typeof host.calulerFinanceDraw!=='function')return;
      const status=document.createElement('p');status.className='caluler-finance-submit-status';status.hidden=true;status.setAttribute('role','alert');result.insertAdjacentElement('beforebegin',status);
      let committed=false,busy=false;
      host.calulerFinanceError=message=>{
        status.textContent=String(message||'Check your inputs and select Calculate again.')+(committed?' The previous valid calculation is unchanged.':'');status.hidden=false;
      };
      // Recheck page-specific initial snapshots after persisted/shared inputs have been restored.
      try{host.calulerFinanceInitialize?.();}catch(error){status.textContent='Check the initial inputs. '+error.message;status.hidden=false;}
      // ROI and Business Valuation retain their verified persistent, page-specific timelines.
      if(typeof host.calulerFinanceRead!=='function'||typeof host.calulerFinanceRender!=='function')return;
      const motion=window.calulerFinanceMotion.create(panel,host,items);host.calulerFinanceMotion=motion;
      motion.initialize();
      host.calulerFinanceDraw=()=>motion.commit(host.calulerFinanceRead());
      host.calulerFinanceCommit=paint=>{
        if(busy)throw new Error('A calculation is already being updated.');
        const nodes=Array.from(result.childNodes),className=result.className,checkpoint=host.calulerFinanceCheckpoint?.();
        busy=true;
        try{
          paint();
          const next=host.calulerFinanceRead();motion.commit(next);
          result.removeAttribute('data-finance-result-stale');status.hidden=true;status.textContent='';committed=true;
          const intro=panel.querySelector('.finance-live-intro');if(intro)intro.textContent='Shows the last calculated values. Select Calculate to refresh.';
        }catch(error){
          result.replaceChildren(...nodes);result.className=className;host.calulerFinanceRestore?.(checkpoint);throw error;
        }finally{busy=false;}
      };
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
/* END CALULER-FINANCE-SUBMIT-ONLY-V1 */


/* CALULER-DIAGRAM-PNG-DOWNLOAD-V1
 * One export path for HTML/CSS, inline SVG and canvas diagrams.
 * No financial input reads, recalculation, motion cancellation or live DOM capture mutations.
 */
(function () {
  'use strict';
  if (window.calulerDiagramExport) return;
  const selectors = new Set(['.finance-live-diagram', '.health-tool-diagram', '.finance-tool-diagram', '[data-caluler-diagram-panel]']);
  const excluded = '.caluler-diagram-export-ui,[data-caluler-diagram-export-ignore],.caluler-result-actions,.caluler-result-action-status,.caluler-result-actionbar,[data-caluler-export-ui],[role="tooltip"],[popover],.caluler-finance-value-tooltip,.result,.ad-slot,nav,input,select,textarea,script,noscript,iframe';
  const definitions = new Set(['defs', 'linearGradient', 'radialGradient', 'clipPath', 'mask', 'filter', 'pattern', 'symbol', 'marker']);
  const svgNS = 'http://www.w3.org/2000/svg', htmlNS = 'http://www.w3.org/1999/xhtml';
  const assetBase = new URL('.', document.currentScript?.src || new URL('../assets/script.js', document.baseURI));
  const mediaNames = new Set(['health-human-body-real.webp', 'body-fat-female-measurement.png', 'pace-runner-real.webp','caluler-logo.webp']);
  const attached = new WeakMap(), resultNotices = new WeakMap(), resources = new Map();
  let mediaPromise, brandingPromise, brandingSource, scheduled = false, printPending = false;

  function deadline(promise, milliseconds, message) {
    let timer;
    return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), milliseconds); })]).finally(() => clearTimeout(timer));
  }
  function nextPaint() { return new Promise(resolve => requestAnimationFrame(resolve)); }
  function filename(pathname, date = new Date(), kind = 'diagram') {
    const slug = (pathname.split('/').pop() || 'calculator').replace(/\.html?$/i, '').replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    const pad = value => String(value).padStart(2, '0');
    const stamp = date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()) + '-' + pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
    return kind === 'result' ? slug + '-result.png' : 'caluler-' + slug + '-diagram-' + stamp + '.png';
  }
  function resultNotice(panel){
    if(!(panel instanceof HTMLElement)||!panel.matches('.result')||!panel.closest('.calculator'))return null;
    let ui=resultNotices.get(panel);
    if(!ui||ui.status.parentNode!==panel){
      if(ui){clearTimeout(ui.noticeTimer);clearTimeout(ui.fadeTimer);}
      const status=document.createElement('p');
      status.className='caluler-diagram-export-status caluler-result-export-status caluler-diagram-export-ui';
      status.setAttribute('data-caluler-export-ui','');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');status.hidden=true;
      panel.classList.add('caluler-result-toast-host');panel.appendChild(status);
      ui={status,isResult:true};resultNotices.set(panel,ui);
    }
    return ui;
  }
  function message(panel, text, error = false, success = false) {
    const ui = attached.get(panel)||resultNotice(panel);
    if (!ui) return;
    clearTimeout(ui.noticeTimer);clearTimeout(ui.fadeTimer);
    const version=ui.noticeVersion=(ui.noticeVersion||0)+1;
    const status=ui.status;
    status.classList.remove('is-leaving');
    status.setAttribute('role',error?'alert':'status');
    status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
    status.dataset.kind=error?'error':success?'success':'progress';
    if(!ui.label||ui.label.parentNode!==status){
      const icon=document.createElement('span'),label=document.createElement('span');
      icon.className='caluler-diagram-toast-icon caluler-diagram-export-ui';icon.setAttribute('aria-hidden','true');
      label.className='caluler-diagram-toast-text caluler-diagram-export-ui';status.replaceChildren(icon,label);ui.icon=icon;ui.label=label;
    }
    ui.icon.textContent=success?'✓ ':error?'! ':'… ';ui.label.textContent=text;
    status.hidden=!text;
    if((!success&&!(ui.isResult&&error))||!text)return;
    const hide=()=>{if(ui.noticeVersion!==version)return;status.hidden=true;status.classList.remove('is-leaving');ui.label.textContent='';};
    ui.noticeTimer=setTimeout(()=>{
      if(ui.noticeVersion!==version)return;
      if(ui.isResult||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){hide();return;}
      status.classList.add('is-leaving');ui.fadeTimer=setTimeout(hide,180);
    },3000);
  }
  function connect(panel, button, status, downloadName) {
    if(!(panel instanceof HTMLElement)||!(button instanceof HTMLElement)||!(status instanceof HTMLElement)||!panel.closest('.calculator'))return false;
    if(attached.has(panel))return true;
    panel.classList.add('caluler-diagram-export-panel');
    status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');status.hidden=true;
    const toolbar=document.createElement('div');
    toolbar.className='caluler-diagram-export-actions caluler-diagram-export-ui';
    toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label','Diagram actions');
    const printButton=document.createElement('button');
    printButton.type='button';printButton.className='caluler-diagram-print caluler-diagram-export-ui';
    printButton.title='Print diagram';printButton.setAttribute('aria-label','Print diagram');
    printButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6zM18 12h.01"/></svg>';
    if(button.parentNode)button.parentNode.insertBefore(toolbar,button);else panel.appendChild(toolbar);
    toolbar.append(button,printButton);
    attached.set(panel,{button,printButton,status,downloadName});
    button.addEventListener('click',()=>{download(panel).catch(()=>{});});
    printButton.addEventListener('click',()=>{printDiagram(panel).catch(()=>{});});
    return true;
  }
  async function settled(panel) {
    const started = performance.now();
    let quiet = 0;
    while (quiet < 2) {
      if (!panel.isConnected) throw new Error('The diagram is no longer on this page.');
      const moving = [panel, ...panel.querySelectorAll('[data-caluler-animating="true"],[aria-busy="true"]')]
        .some(node => !node.closest('.caluler-diagram-export-ui,.caluler-result-actions,[data-caluler-export-ui]') && (node.dataset.calulerAnimating === 'true' || node.getAttribute('aria-busy') === 'true'));
      const cssMoving = (panel.getAnimations?.({subtree:true}) || []).some(animation => {
        const timing = animation.effect?.getComputedTiming();
        return animation.playState === 'running' && Number.isFinite(timing?.endTime);
      });
      quiet = moving || cssMoving ? 0 : quiet + 1;
      if (performance.now() - started > 12000) throw new Error('The diagram is still moving. Try again after Calculate finishes.');
      await nextPaint();
    }
  }
  function fileData(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('An image or font could not be read.'));
      reader.readAsDataURL(blob);
    });
  }
  function bundledMedia() {
    if (window.calulerDiagramExportMedia) return Promise.resolve(window.calulerDiagramExportMedia);
    if (!mediaPromise) mediaPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timer = setTimeout(() => finish(new Error('Local diagram images could not be loaded.')), 12000);
      function finish(error) {
        clearTimeout(timer); script.onload=null; script.onerror=null; script.remove();
        if (error) { mediaPromise = null; reject(error); }
        else resolve(window.calulerDiagramExportMedia);
      }
      script.src = new URL('diagram-export-media.js?v=logo-77ed6829ac0f', assetBase).href;
      script.onload = () => finish(window.calulerDiagramExportMedia ? null : new Error('The local image adapter is unavailable.'));
      script.onerror = () => finish(new Error('The local image adapter could not be loaded.'));
      document.head.appendChild(script);
    });
    return mediaPromise;
  }
  function localMediaName(url) {
    const name = url.pathname.split('/').pop();
    return mediaNames.has(name) && url.href.split(/[?#]/)[0] === new URL(name, assetBase).href ? name : null;
  }
  async function resourceData(value) {
    if (/^data:/i.test(value)) return value;
    const url = new URL(value, document.baseURI), name = localMediaName(url);
    if (resources.has(url.href)) return resources.get(url.href);
    const task = (async () => {
      if (url.protocol === 'file:' && name) {
        const data = (await bundledMedia())[name];
        if (!data) throw new Error('A local diagram image is missing from its export adapter.');
        return data;
      }
      const abort = new AbortController(), timer = setTimeout(() => abort.abort(), 12000);
      try {
        const response = await fetch(url.href, {credentials:'same-origin', mode:'cors', signal:abort.signal});
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return await fileData(await response.blob());
      } catch (error) {
        if (name) {const data=(await bundledMedia())[name];if(data)return data;}
        throw new Error('A diagram image/font is blocked or unavailable. Open the site over HTTP(S), or allow its source to be embedded.');
      } finally { clearTimeout(timer); }
    })();
    resources.set(url.href, task);
    try { return await task; } catch (error) { resources.delete(url.href); throw error; }
  }
  function reference(value) {
    if (value.startsWith('#') || /^data:/i.test(value)) return value;
    const url = new URL(value, document.baseURI), here = new URL(document.baseURI);
    if (url.hash && url.origin === here.origin && url.pathname === here.pathname && url.search === here.search) return url.hash;
    return url.href;
  }
  function styleText(computed) {
    const style = document.createElement('span').style;
    for (const property of computed) {
      if (/^(animation|transition)(-|$)/.test(property)) continue;
      const value = computed.getPropertyValue(property).replace(/url\((['"]?)(.*?)\1\)/g, (_, quote, url) => 'url("' + reference(url) + '")');
      style.setProperty(property, value);
    }
    style.setProperty('animation', 'none', 'important');
    style.setProperty('transition', 'none', 'important');
    return style.cssText;
  }
  function background(panel) {
    for (let node = panel; node; node = node.parentElement) {
      const color = getComputedStyle(node).backgroundColor;
      if (color && color !== 'transparent' && !/rgba\([^)]*,\s*0(?:\.0+)?\s*\)/.test(color)) return color;
    }
    return document.documentElement.dataset.theme === 'dark' || document.body.classList.contains('dark-mode') ? '#101c2e' : '#ffffff';
  }
  function snapshot(panel) {
    const rect = panel.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) throw new Error('The diagram is hidden or has no visible size.');
    const pseudo = [], families = new Set(), pairs = [], values = [];
    let sequence = 0, left = rect.left, top = rect.top, right = rect.right, bottom = rect.bottom;
    function copy(live, inDefinition = false) {
      if (live.nodeType === Node.TEXT_NODE) return document.createTextNode(live.nodeValue);
      if (live.nodeType !== Node.ELEMENT_NODE || (live !== panel && live.matches(excluded))) return null;
      const definition = inDefinition || definitions.has(live.localName);
      const computed = getComputedStyle(live);
      if (computed.display === 'none' && !definition) return null;
      const clone = live.localName === 'canvas' ? document.createElement('img') : live.cloneNode(false);
      if (live.localName === 'canvas') {
        try { clone.src = live.toDataURL('image/png'); }
        catch (error) { throw new Error('This canvas uses a protected image and cannot be exported.'); }
      }
      clone.removeAttribute('aria-describedby');
      clone.removeAttribute('autofocus');
      clone.setAttribute('style', styleText(computed));
      const id = 'n' + (++sequence);
      clone.setAttribute('data-caluler-export-node', id);
      families.add(computed.fontFamily);
      const type=live.localName;
      const source=type==='img' ? live.currentSrc || live.src : live.getAttribute('href') || live.getAttribute('xlink:href');
      pairs.push({clone,type,source,base:live.baseURI});
      if (live.dataset.calulerValueLabel && live.dataset.calulerValue) values.push({label:live.dataset.calulerValueLabel, value:live.dataset.calulerValue});
      if (!definition && computed.visibility !== 'hidden') {
        const box = live.getBoundingClientRect();
        if (box.width && box.height) {
          left = Math.min(left, box.left); top = Math.min(top, box.top);
          right = Math.max(right, box.right); bottom = Math.max(bottom, box.bottom);
        }
      }
      if (live.namespaceURI === htmlNS) for (const kind of ['::before', '::after']) {
        const css = getComputedStyle(live, kind);
        if (css.content && css.content !== 'none' && css.content !== 'normal' && css.display !== 'none') {
          pseudo.push('[data-caluler-export-node="' + id + '"]' + kind + '{' + styleText(css) + '}');
        }
      }
      for (const child of live.childNodes) {
        const next = copy(child, definition);
        if (next) clone.appendChild(next);
      }
      return clone;
    }
    // All styles, SVG geometry, canvas pixels and numeric text are read in one synchronous task.
    const clone = copy(panel);
    const bleed = 8, width = Math.ceil(right - left + bleed * 2), height = Math.ceil(bottom - top + bleed * 2);
    if (width * height * 4 > 32000000 || width * 2 > 16384 || height * 2 > 16384) throw new Error('This diagram is too large for a safe 2x PNG. Use a smaller viewport.');
    Object.assign(clone.style, {position:'absolute', margin:'0', width:rect.width+'px', height:rect.height+'px', minWidth:'0', maxWidth:'none', boxSizing:'border-box'});
    for (const [key, value] of Object.entries({top:(rect.top-top+bleed)+'px',left:(rect.left-left+bleed)+'px',right:'auto',bottom:'auto',transform:'none'})) clone.style.setProperty(key,value,'important');
    const wrapper = document.createElementNS(htmlNS, 'div');
    wrapper.setAttribute('xmlns',htmlNS);
    wrapper.setAttribute('style','position:relative;box-sizing:border-box;display:block;width:'+width+'px;height:'+height+'px;background:'+background(panel)+';overflow:hidden;');
    wrapper.appendChild(clone);
    const style = document.createElementNS(htmlNS,'style');
    style.textContent=pseudo.join('\n'); wrapper.appendChild(style);
    return {wrapper,pairs,families,width,height,color:background(panel),values};
  }
  async function embedUrls(value) {
    const matches = [...value.matchAll(/url\((['"]?)(.*?)\1\)/g)];
    for (const match of matches) if (match[2] && !match[2].startsWith('#') && !/^data:/i.test(match[2])) {
      const data = await resourceData(match[2]);
      value = value.replace(match[0], 'url("' + data + '")');
    }
    return value;
  }
  async function embedFonts(families) {
    const used = new Set([...families].flatMap(value=>value.split(',').map(v=>v.trim().replace(/^['"]|['"]$/g,'').toLowerCase())));
    const found = new Set(), rules = [];
    async function scan(sheet) {
      let list; try { list=sheet.cssRules; } catch (error) { return; }
      for (const rule of list || []) {
        if (rule.type === CSSRule.FONT_FACE_RULE) {
          const family=rule.style.getPropertyValue('font-family').replace(/['"]/g,'').trim().toLowerCase();
          if (!used.has(family)) continue;
          let text=rule.cssText;
          const base=sheet.href || document.baseURI;
          text=text.replace(/url\((['"]?)(.*?)\1\)/g,(_,q,url)=>'url("'+new URL(url,base).href+'")');
          rules.push(await embedUrls(text)); found.add(family);
        } else if (rule.styleSheet) await scan(rule.styleSheet);
        else if (rule.cssRules) await scan(rule);
      }
    }
    for (const sheet of document.styleSheets) await scan(sheet);
    for (const face of document.fonts || []) if (used.has(face.family.replace(/['"]/g,'').toLowerCase()) && !found.has(face.family.replace(/['"]/g,'').toLowerCase())) {
      throw new Error('A custom diagram font cannot be embedded. Use an accessible font source before downloading.');
    }
    return rules.join('\n');
  }
  async function embed(snapshot) {
    for (const {clone,type,source,base} of snapshot.pairs) {
      const style=clone.getAttribute('style');
      if (style?.includes('url(')) clone.setAttribute('style',await embedUrls(style));
      if (type === 'img') {
        clone.removeAttribute('srcset'); clone.removeAttribute('sizes');
        clone.setAttribute('src',await resourceData(source));
      } else if (type === 'image') {
        const href=source;
        if (href) {
          clone.removeAttributeNS('http://www.w3.org/1999/xlink','href');
          clone.setAttribute('href',await resourceData(new URL(href,base).href));
        }
      } else if (type === 'use') {
        const href=reference(source || '');
        if (!href.startsWith('#') || !snapshot.wrapper.querySelector('[id="'+CSS.escape(href.slice(1))+'"]')) throw new Error('An SVG icon references a symbol outside this diagram. Embed that symbol in its panel first.');
        clone.removeAttributeNS('http://www.w3.org/1999/xlink','href'); clone.setAttribute('href',href);
      }
    }
    for (const style of snapshot.wrapper.querySelectorAll('style')) style.textContent=await embedUrls(style.textContent);
    const fonts=await embedFonts(snapshot.families);
    if (fonts) {const style=document.createElementNS(htmlNS,'style');style.textContent=fonts;snapshot.wrapper.prepend(style);}
  }
  function imageOf(source) {
    return deadline(new Promise((resolve,reject)=>{
      const image=new Image();
      image.onload=()=>resolve(image);
      image.onerror=()=>reject(new Error('This browser could not render the diagram image. Try an up-to-date desktop Chrome or Edge.'));
      image.src=source;
    }),15000,'Diagram rendering timed out. Please try again.');
  }

  async function pngBranding(width) {
    const header=document.querySelector('.nav .logo-nav');
    const source=header?.currentSrc||header?.src||new URL('caluler-logo.webp',assetBase).href;
    if(!brandingPromise||brandingSource!==source){
      brandingSource=source;
      brandingPromise=(async()=>{
        const logo=await imageOf(await resourceData(source));
        if(!(logo.naturalWidth>0&&logo.naturalHeight>0))throw new Error('Invalid header logo dimensions.');
        return logo;
      })().catch(()=>{if(brandingSource===source)brandingPromise=null;throw new Error('The Caluler header logo could not be loaded. Refresh and try again.');});
    }
    const image=await brandingPromise,margin=Math.min(14,width/4),logoWidth=Math.min(120,width*.11);
    const logoHeight=logoWidth*image.naturalHeight/image.naturalWidth;
    return {image,width:logoWidth,height:logoHeight,margin,space:Math.ceil(logoHeight+margin*2)};
  }
  function paintPngBranding(context,canvas,shot,branding) {
    const stamp=document.createElement('canvas');
    stamp.width=branding.image.naturalWidth;stamp.height=branding.image.naturalHeight;
    try{
      const ink=stamp.getContext('2d');if(!ink)throw new Error('Logo branding is unavailable in this browser.');
      const pixel=context.getImageData(0,canvas.height-1,1,1).data;
      const linear=n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;};
      const alpha=(pixel[3]??255)/255;
      const darkPage=document.documentElement.dataset?.theme==='dark'||document.body?.classList.contains('dark-mode');
      const surface=n=>n*alpha+(darkPage?16:255)*(1-alpha);
      const luminance=.2126*linear(surface(pixel[0]))+.7152*linear(surface(pixel[1]))+.0722*linear(surface(pixel[2]));
      const darkInk=getComputedStyle(document.documentElement).getPropertyValue('--caluler-brand-primary').trim()||'#116F9F';
      const brandLuminance=.2126*linear(17)+.7152*linear(111)+.0722*linear(159);
      const darkContrast=(Math.max(luminance,brandLuminance)+.05)/(Math.min(luminance,brandLuminance)+.05);
      const lightContrast=1.05/(luminance+.05);
      ink.drawImage(branding.image,0,0);
      // Reuse original artwork/alpha, never redraw lettering or add a logo background.
      ink.globalCompositeOperation='source-in';ink.fillStyle=lightContrast>darkContrast?'#FFFFFF':darkInk;ink.fillRect(0,0,stamp.width,stamp.height);
      ink.globalCompositeOperation='source-over';
      // The verified source has a transparent gap at 18%; preserve its full-color calculator icon.
      const iconWidth=Math.round(stamp.width*.18);
      ink.clearRect(0,0,iconWidth,stamp.height);
      ink.drawImage(branding.image,0,0,iconWidth,stamp.height,0,0,iconWidth,stamp.height);
      context.save();
      try{
        context.globalAlpha=1;context.globalCompositeOperation='source-over';context.filter='none';context.shadowColor='transparent';context.shadowBlur=0;context.shadowOffsetX=0;context.shadowOffsetY=0;
        context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
        context.drawImage(stamp,(shot.width-branding.margin-branding.width)*2,(shot.height+branding.margin)*2,branding.width*2,branding.height*2);
      }finally{context.restore();}
    }finally{stamp.width=0;stamp.height=0;}
  }

  async function pngWithValues(blob, values) {
    // Ancillary PNG metadata keeps hover-only calculated values without permanent result cards.
    if (!values.length) return blob;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const encoder = new TextEncoder();
    const payload = encoder.encode('Caluler Diagram\0\0\0\0\0'+JSON.stringify({calculator:location.pathname,values}));
    const type = encoder.encode('iTXt'), chunk = new Uint8Array(payload.length+12);
    const view = new DataView(chunk.buffer);
    view.setUint32(0,payload.length);chunk.set(type,4);chunk.set(payload,8);
    let crc=0xffffffff;
    for (const value of chunk.subarray(4,chunk.length-4)) {
      crc^=value;
      for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);
    }
    view.setUint32(chunk.length-4,(crc^0xffffffff)>>>0);
    const end=bytes.length-12;
    if(end<8 || String.fromCharCode(...bytes.subarray(end+4,end+8))!=='IEND')throw new Error('The browser produced an invalid PNG.');
    return new Blob([bytes.subarray(0,end),chunk,bytes.subarray(end)],{type:'image/png'});
  }

  async function capture(panel, {branding:includeBranding = true,onSnapshot} = {}) {
    if (!(panel instanceof HTMLElement) || !panel.closest('.calculator') ||
        (!panel.matches([...selectors].join(',')) && !panel.matches('.result'))) throw new Error('Choose a supported result or diagram card.');
    if (panel.matches('.result')) {
      const content = panel.cloneNode(true);
      content.querySelectorAll('.caluler-result-toolbar,[data-caluler-export-ui]').forEach(node => node.remove());
      const text = (content.textContent || '').trim();
      if (!text || panel.classList.contains('error') || content.querySelector('.error,[role="alert"]') ||
          /^(Your result will appear here\.|Enter\b|Please\b|Choose\b|Select\b|Input error:|The live diagram previews\b)/i.test(text) || /\b(?:NaN|Infinity)\b/.test(text)) {
        throw new Error('Calculate first to download this result.');
      }
    }
    if (document.fonts?.ready) await deadline(document.fonts.ready,12000,'Diagram fonts are still loading.');
    await settled(panel);
    const shot=snapshot(panel);
    if(onSnapshot)onSnapshot();
    const [branding]=await Promise.all([includeBranding ? pngBranding(shot.width) : {space:0},embed(shot)]);
    const markup=new XMLSerializer().serializeToString(shot.wrapper);
    const svg='<svg xmlns="'+svgNS+'" width="'+shot.width*2+'" height="'+shot.height*2+'" viewBox="0 0 '+shot.width+' '+shot.height+'"><foreignObject x="0" y="0" width="100%" height="100%">'+markup+'</foreignObject></svg>';
    const image=await imageOf('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg));
    const canvas=document.createElement('canvas');
    canvas.width=shot.width*2;canvas.height=(shot.height+branding.space)*2;
    const context=canvas.getContext('2d');
    if (!context) throw new Error('PNG export is unavailable in this browser.');
    try {
      context.fillStyle=shot.color;context.fillRect(0,0,canvas.width,canvas.height);
      context.drawImage(image,0,0);
      const probe=document.createElement('canvas');probe.width=96;probe.height=96;
      const check=probe.getContext('2d');check.drawImage(canvas,0,0,canvas.width,shot.height*2,0,0,96,96);
      const pixels=check.getImageData(0,0,96,96).data;
      probe.width=0;probe.height=0;
      let min=255,max=0;for(let i=0;i<pixels.length;i+=4){const light=(pixels[i]+pixels[i+1]+pixels[i+2])/3;min=Math.min(min,light);max=Math.max(max,light);}
      if (max-min<6) throw new Error('The browser produced a blank image. No file was downloaded.');
      if(includeBranding)paintPngBranding(context,canvas,shot,branding);
      const blob=await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('The PNG could not be encoded.')),'image/png'));
      return await pngWithValues(blob,shot.values);
    } catch(error) {
      if(error.name==='SecurityError')throw new Error('Browser image security blocked this diagram export. Open the hosted site or check its image sources.');
      throw error;
    } finally {canvas.width=0;canvas.height=0;image.src='';}
  }
  async function download(panel) {
    const ui=attached.get(panel);
    if(ui?.button.disabled)return;
    if(ui){ui.button.disabled=true;ui.button.setAttribute('aria-busy','true');}
    const label=panel instanceof HTMLElement&&panel.matches('.result')?'Result':'Diagram';
    let url;
    try {
      message(panel,'Preparing '+label.toLowerCase()+' download…');
      const blob=await capture(panel);
      url=URL.createObjectURL(blob);
      const anchor=document.createElement('a');
      anchor.href=url;anchor.download=ui?.downloadName||filename(location.pathname,new Date(),panel.matches('.result')?'result':'diagram');document.body.appendChild(anchor);
      try{anchor.click();}finally{anchor.remove();}
      message(panel,label+' PNG downloaded successfully.',false,true);
      const released=url;url=null;setTimeout(()=>URL.revokeObjectURL(released),3000);
    }catch(error){message(panel,label+' download failed: '+(error?.message||'Please try again.'),true);throw error;}
    finally{if(url)URL.revokeObjectURL(url);if(ui){ui.button.disabled=false;ui.button.removeAttribute('aria-busy');}}
  }
  let printJob=null,printTimer,printGeneration=0,printLogoPromise,printLogoSource,printIdSequence=0;
  const isolatedPrintCss=String.raw`@page{size:A4 portrait;margin:12mm}
*{box-sizing:border-box}html,body{display:block!important;margin:0!important;padding:0!important;width:auto!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;background:#fff;color:#111;font:10.5pt/1.45 Arial,Helvetica,sans-serif}
.caluler-unified-print-root{display:block!important;position:static!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0!important;padding:0!important;border:0;break-before:auto;break-after:auto;break-inside:auto}
h2{font-size:12pt;line-height:1.3;margin:0 0 8pt;break-after:avoid}
.result{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0!important;border:0!important;border-radius:6pt;background:#EFF5F9!important;color:#111!important;overflow:visible!important;break-inside:auto}
.result p{margin:6pt 0}.result :is(b,strong){font-weight:650}.result .finance-result-summary{display:block;max-width:100%;margin:0;padding:0}
.caluler-result-pair{display:grid!important;grid-template-columns:minmax(0,max-content) minmax(16px,1fr) minmax(0,max-content)!important;align-items:start;column-gap:14px;width:100%;min-width:0;margin:0!important;padding:4pt 0!important;border:0;background:transparent;line-height:1.45;break-inside:avoid;page-break-inside:avoid}
.caluler-result-pair::after{content:"";display:block;grid-column:2;grid-row:1;align-self:center;width:100%;height:0;border-top:2px solid #fff}
.caluler-result-pair> :is(.caluler-result-pair-label,.caluler-result-pair-value){display:block!important;min-width:0;max-width:100%;margin:0!important;padding:0!important;border:0!important;white-space:normal!important;overflow-wrap:anywhere}
.caluler-result-pair-label{grid-column:1;grid-row:1;text-align:start;color:#4B5563;font-weight:500}.caluler-result-pair-value{grid-column:3;grid-row:1;text-align:end;color:#111;font-weight:650;font-variant-numeric:tabular-nums}.caluler-result-pair :is(b,strong){color:inherit;font-size:inherit;font-weight:inherit}
button,input,select,textarea,form,nav,.caluler-result-toolbar,.caluler-result-actions,.caluler-result-actionbar,.caluler-result-tools,.caluler-result-tool,.caluler-result-help,.caluler-result-vote,.caluler-result-popover,.caluler-result-copy-action,.caluler-result-action-status,.caluler-diagram-export-ui,.caluler-result-pair-break,[data-caluler-export-ui],[role="button"],[role="tooltip"],[popover],a.btn,a[download]{display:none!important}
table{width:100%!important;max-width:100%!important;min-width:0!important;border-collapse:collapse;font-size:9pt;white-space:normal!important}th,td{padding:4pt 6pt;border-bottom:1px solid #D1D5DB;overflow-wrap:anywhere;white-space:normal!important}tr{break-inside:avoid;page-break-inside:avoid}thead{display:table-header-group}.emi-schedule-scroll,.table-responsive,.table-scroll{overflow:visible!important;max-width:100%}pre{white-space:pre-wrap;overflow-wrap:anywhere}svg,canvas,img{max-width:100%}
.caluler-print-diagram{position:relative;max-width:100%;margin:0 auto;break-inside:avoid;page-break-inside:avoid;print-color-adjust:exact;-webkit-print-color-adjust:exact}.caluler-print-diagram>img{display:block;width:auto;height:auto;max-width:100%;max-height:250mm;margin:0 auto;border:0;box-shadow:none}
.caluler-print-brand{display:block;position:static;inset:auto;width:110px;height:auto;margin:8px 0 0 auto;padding:0;float:none;break-before:avoid;page-break-before:avoid;break-inside:avoid;page-break-inside:avoid;border:0;border-radius:0;background:none!important;box-shadow:none!important}.caluler-print-brand>img{display:block;width:100%;max-width:110px;height:auto;margin:0;padding:0;border:0;background:none;box-shadow:none;print-color-adjust:exact;-webkit-print-color-adjust:exact}.caluler-print-logo-fallback{filter:brightness(0)}
`;
  function headerLogoSource(){const logo=document.querySelector('.nav .logo-nav');return logo?.currentSrc||logo?.src||new URL('caluler-logo.webp',assetBase).href;}
  function preparePrintLogo(){
    const source=headerLogoSource();
    if(!printLogoPromise||printLogoSource!==source){
      printLogoSource=source;
      printLogoPromise=(async()=>{
        const branding=await pngBranding(1000),canvas=document.createElement('canvas');
        canvas.width=branding.image.naturalWidth;canvas.height=branding.image.naturalHeight;
        try{
          const ink=canvas.getContext('2d');if(!ink)throw new Error('Print logo rendering is unavailable.');
          ink.drawImage(branding.image,0,0);ink.globalCompositeOperation='source-in';
          ink.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--caluler-brand-primary').trim()||'#116F9F';ink.fillRect(0,0,canvas.width,canvas.height);
          ink.globalCompositeOperation='source-over';const iconWidth=Math.round(canvas.width*.18);
          ink.clearRect(0,0,iconWidth,canvas.height);ink.drawImage(branding.image,0,0,iconWidth,canvas.height,0,0,iconWidth,canvas.height);
          const data=canvas.toDataURL('image/png');printLogoSource=source;preparePrintLogo.data=data;return data;
        }finally{canvas.width=0;canvas.height=0;}
      })().catch(error=>{printLogoPromise=null;throw error;});
    }
    return printLogoPromise;
  }
  function printResultClone(result){
    if(!result)return null;
    const clone=result.cloneNode(true);
    const liveFields=Array.from(result.querySelectorAll('input,textarea,select'));
    Array.from(clone.querySelectorAll('input,textarea,select')).forEach((node,index)=>{
      const source=liveFields[index],text=document.createElement('span');
      text.textContent=source?.tagName==='SELECT'?Array.from(source.selectedOptions||[]).map(option=>option.textContent).join(', '):source?.value||'';
      if(source?.type==='hidden')node.remove();else node.replaceWith(text);
    });
    clone.querySelectorAll('button,nav,iframe,script,noscript,.caluler-result-toolbar,.caluler-result-actions,.caluler-result-actionbar,.caluler-result-tools,.caluler-result-tool,.caluler-result-help,.caluler-result-vote,.caluler-result-popover,.caluler-result-copy-action,.caluler-result-action-status,.caluler-diagram-export-ui,[data-caluler-export-ui],[role="tooltip"],[popover],.ad-slot,a.btn,a[download],[role="button"],[data-action="embed"],[data-action="share"],[data-action="report"]').forEach(node=>node.remove());
    const liveCanvases=Array.from(result.querySelectorAll('canvas'));
    Array.from(clone.querySelectorAll('canvas')).forEach((node,index)=>{
      const image=document.createElement('img');image.alt='Calculated result chart';
      try{image.src=liveCanvases[index].toDataURL('image/png');image.style.maxWidth='100%';image.style.height='auto';node.replaceWith(image);}
      catch(error){const note=document.createElement('span');note.textContent='The result chart is unavailable for printing.';node.replaceWith(note);}
    });
    clone.removeAttribute('id');namespacePrintIds(clone);
    clone.removeAttribute('aria-live');
    for(const [name,value] of Object.entries({display:'block',position:'static',width:'100%',maxWidth:'100%',minWidth:'0',height:'auto',minHeight:'0',maxHeight:'none',margin:'0',padding:'8pt 10pt',border:'0',background:'#EFF5F9',color:'#111111',overflow:'visible',transform:'none',contain:'none',breakBefore:'auto',breakAfter:'auto',breakInside:'auto',pageBreakBefore:'auto',pageBreakAfter:'auto',pageBreakInside:'auto'}))clone.style.setProperty(name.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()),value,'important');
    return clone;
  }
  function makePrintRoot(resultClone,diagramNode,mode='result'){
    const root=document.createElement('section');root.className='caluler-result-print-root caluler-unified-print-root';root.dataset.printMode=mode;
    if(mode==='diagram'&&diagramNode)root.appendChild(diagramNode);
    if(mode!=='diagram'){
      const heading=document.createElement('h2');heading.textContent='Result:';root.appendChild(heading);
      if(resultClone)root.appendChild(resultClone);else{const note=document.createElement('p');note.textContent='Calculate to include the current result.';root.appendChild(note);}
    }
    const footer=document.createElement('footer');footer.className='caluler-print-brand';
    const logo=document.createElement('img');logo.alt='Caluler.Work';logo.src=preparePrintLogo.data||headerLogoSource();
    if(!preparePrintLogo.data)logo.className='caluler-print-logo-fallback';
    footer.appendChild(logo);root.appendChild(footer);return root;
  }
  function mountPrintRoot(job){
    document.body.appendChild(job.root);document.body.classList.add('caluler-unified-printing');document.documentElement.classList.add('caluler-unified-printing');printJob=job;
    clearTimeout(printTimer);printTimer=setTimeout(cleanupPrint,300000);
  }
  function cleanupPrint(){
    clearTimeout(printTimer);const job=printJob;printJob=null;printPending=false;printGeneration++;
    job?.printWindow?.removeEventListener('afterprint',cleanupPrint);
    job?.root.remove();job?.frame?.remove();for(const url of job?.urls||[])URL.revokeObjectURL(url);
    document.body.classList.remove('caluler-unified-printing');document.documentElement.classList.remove('caluler-unified-printing');
    if(job?.ui){job.ui.printButton.disabled=false;job.ui.printButton.removeAttribute('aria-busy');}
    if(job?.previousFocus?.isConnected)job.previousFocus.focus({preventScroll:true});
  }
  function findPrintDiagram(calculator){
    const panels=Array.from(calculator.querySelectorAll([...selectors].join(',')));
    return panels.find(panel=>!panels.some(other=>other!==panel&&panel.contains(other)))||null;
  }
  function namespacePrintIds(wrapper){
    const ids=new Map();
    wrapper.querySelectorAll('[id]').forEach(node=>{const old=node.getAttribute('id'),next='caluler-print-'+printGeneration+'-'+(++printIdSequence);ids.set(old,next);node.setAttribute('id',next);});
    const refs=value=>value.replace(/url\((['"]?)[^)]*?#([^)'"\s]+)\1\)/g,(whole,quote,id)=>ids.has(id)?'url(#'+ids.get(id)+')':whole);
    [wrapper,...wrapper.querySelectorAll('*')].forEach(node=>{
      for(const attr of Array.from(node.attributes||[])){
        let value=refs(attr.value);if(/^(?:href|xlink:href)$/.test(attr.name)&&value.includes('#')){const id=value.slice(value.lastIndexOf('#')+1);if(ids.has(id))value='#'+ids.get(id);}
        if(value!==attr.value)node.setAttribute(attr.name,value);
      }
      if(node.tagName?.toLowerCase()==='style')node.textContent=refs(node.textContent);
    });
  }
  function nativePrint(){
    if(printJob||!document.body?.dataset.calulerCategory)return;
    printGeneration++;
    const calculator=document.querySelector('.calculator');if(!calculator)return;
    mountPrintRoot({root:makePrintRoot(printResultClone(calculator.querySelector('.result')),null,'result'),urls:[],previousFocus:document.activeElement});
  }
  async function printTool(result,panel){
    if(printPending||printJob)return;
    printPending=true;const generation=++printGeneration,ui=panel?attached.get(panel):null,urls=[];
    if(ui){ui.printButton.disabled=true;ui.printButton.setAttribute('aria-busy','true');}
    let launched=false,root,frame;
    try{
      let resultClone,diagram;
      if(panel){
        message(panel,'Preparing diagram print…');
        const blob=await capture(panel,{branding:false});
        const url=URL.createObjectURL(blob);urls.push(url);
        diagram=document.createElement('div');diagram.className='caluler-print-diagram';
        const image=document.createElement('img');image.alt=(panel.querySelector('h1,h2,h3,h4,h5,h6')?.textContent||'Calculator diagram').trim();
        const loaded=new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('The diagram print image could not be loaded.'));});
        diagram.appendChild(image);image.src=url;await deadline(loaded,12000,'The diagram print image is still loading.');
      }else resultClone=printResultClone(result);
      await preparePrintLogo();
      if(generation!==printGeneration)return;
      root=makePrintRoot(resultClone,diagram,panel?'diagram':'result');
      const logo=root.querySelector('.caluler-print-brand img');
      if(logo?.decode)await deadline(logo.decode(),12000,'The print logo is still loading.');
      if(generation!==printGeneration)return;
      frame=document.createElement('iframe');frame.className='caluler-diagram-print-frame caluler-diagram-export-ui';frame.title=panel?'Diagram print preview':'Result print preview';frame.setAttribute('aria-hidden','true');frame.setAttribute('tabindex','-1');
      document.body.appendChild(frame);
      const doc=frame.contentDocument,printWindow=frame.contentWindow;
      if(!doc||typeof printWindow?.print!=='function')throw new Error('Printing is unavailable in this browser.');
      doc.open();doc.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');doc.close();
      doc.title=panel?'Diagram — Caluler.Work':'Result — Caluler.Work';doc.documentElement.lang=document.documentElement.lang||'en';doc.documentElement.dir=document.documentElement.dir||'ltr';
      const style=doc.createElement('style');style.textContent=isolatedPrintCss;doc.head.appendChild(style);doc.body.appendChild(root);
      printJob={root,frame,printWindow,urls,ui,previousFocus:document.activeElement};
      printWindow.addEventListener('afterprint',cleanupPrint,{once:true});clearTimeout(printTimer);printTimer=setTimeout(cleanupPrint,300000);
      await Promise.all(Array.from(root.querySelectorAll('img')).map(image=>image.decode?deadline(image.decode(),12000,'A print image is still loading.'):Promise.resolve()));
      await nextPaint();await nextPaint();
      if(panel)message(panel,'');
      printWindow.focus();printWindow.print();launched=true;
    }catch(error){if(panel)message(panel,'Diagram print failed: '+(error?.message||'Please try again.'),true);throw error;}
    finally{
      if(!launched){if(root&&printJob?.root===root)cleanupPrint();else{root?.remove();frame?.remove();urls.forEach(url=>URL.revokeObjectURL(url));if(generation===printGeneration)printPending=false;}}
      if(ui&&(!launched||!printJob)){ui.printButton.disabled=false;ui.printButton.removeAttribute('aria-busy');}
    }
  }
  function printDiagram(panel){
    if(!attached.has(panel))return Promise.resolve();
    return printTool(null,panel);
  }
  function attach(panel) {
    if (!(panel instanceof HTMLElement) || !panel.closest('.calculator')) return;
    const existing=attached.get(panel);
    // A page-local nested adapter (Exchange Ticket) owns its existing controls.
    if(!existing && panel.querySelector('.caluler-diagram-download'))return;
    const heading=Array.from(panel.children).find(node=>/^H[1-6]$/.test(node.tagName)) || panel.querySelector('h1,h2,h3,h4,h5,h6');
    if(!heading)return;
    const header=heading.closest('header'),nestedHeader=header && panel.contains(header)?header:null;
    if(existing){
      // Renderers may move an already-bound title into their premium header.
      const toolbar=existing.button.parentElement;
      if(nestedHeader && toolbar?.classList.contains('caluler-diagram-export-actions')){
        nestedHeader.classList.add('caluler-diagram-export-header');
        if(toolbar.parentElement!==nestedHeader)nestedHeader.appendChild(toolbar);
      }
      return;
    }
    const button=document.createElement('button');
    button.type='button';button.className='caluler-diagram-download caluler-diagram-export-ui';
    button.title='Download Diagram';button.setAttribute('aria-label','Download Diagram');
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>';
    const status=document.createElement('p');status.className='caluler-diagram-export-status caluler-diagram-export-ui';status.hidden=true;status.setAttribute('aria-live','polite');
    panel.classList.add('caluler-diagram-export-panel');heading.classList.add('caluler-diagram-export-heading');
    if(nestedHeader){nestedHeader.classList.add('caluler-diagram-export-header');nestedHeader.appendChild(button);panel.appendChild(status);}
    else panel.append(button,status);
    connect(panel,button,status);
  }
  function discover() {
    if(!document.body?.dataset.calulerCategory)return;
    document.querySelectorAll([...selectors].join(',')).forEach(attach);
  }
  window.calulerDiagramExport=Object.freeze({
    capture,download,print:printDiagram,printResult:result=>printTool(result,null),filename,connect,
    register(selector){document.querySelector(selector);selectors.add(selector);discover();},
    discover
  });
  function start(){
    discover();
    if(document.body?.dataset.calulerCategory){
      preparePrintLogo().catch(()=>{});
      window.addEventListener('beforeprint',nativePrint);
      window.addEventListener('afterprint',cleanupPrint);
    }
    new MutationObserver(records=>{
      if(!records.some(record=>Array.from(record.addedNodes).some(node=>node.nodeType===1&&!node.matches?.('.caluler-diagram-export-ui'))))return;
      if(scheduled)return;scheduled=true;
      requestAnimationFrame(()=>{scheduled=false;discover();});
    }).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
/* END CALULER-DIAGRAM-PNG-DOWNLOAD-V1 */


/* CALULER-HEALTH-FINANCE-INPUT-LAYOUT-V1 */
(function () {
  'use strict';
  function initialise() {
    if (document.body?.dataset.calulerCategory !== 'Health Calculators') return;
    document.querySelectorAll('.calculator').forEach(calculator => {
      if (calculator.classList.contains('caluler-health-layout')) return;
      const children = Array.from(calculator.children);
      if (!children.some(node => node.classList.contains('health-tool-diagram'))) return;
      let group = children.find(node => node.tagName === 'FORM');
      if (!group) {
        const controls = children.filter(node => node.matches('.form-grid,.field,button.btn,input[type="submit"]'));
        if (!controls.length) return;
        // Only group contiguous existing controls; never pull Results or diagrams into a form.
        const first = children.indexOf(controls[0]), last = children.indexOf(controls.at(-1));
        if (children.slice(first,last+1).some(node => !controls.includes(node))) return;
        group = document.createElement('div');
        calculator.insertBefore(group,controls[0]);
        let looseGrid = null;
        controls.forEach(node => {
          if (node.classList.contains('field')) {
            if (!looseGrid) {
              looseGrid = document.createElement('div');
              looseGrid.className = 'form-grid';
              group.appendChild(looseGrid);
            }
            looseGrid.appendChild(node);
          } else {
            looseGrid = null;
            group.appendChild(node);
          }
        });
      }
      // Move nodes, not markup: preserve IDs, values, conditional state and event listeners.
      group.classList.add('caluler-health-form');
      calculator.classList.add('caluler-health-layout');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initialise,{once:true});
  else initialise();
})();
/* END CALULER-HEALTH-FINANCE-INPUT-LAYOUT-V1 */

/* CALULER-TOOL-HERO-AD-LAYOUT-V1: move the existing top slot; never clone or request ads. */
(function () {
  'use strict';
  if (window.__calulerToolHeroAdLayoutV1) return;
  window.__calulerToolHeroAdLayoutV1 = true;
  function initialise() {
    const body = document.body;
    if (!body?.dataset.calulerCategory) return;
    body.querySelectorAll('.page-hero').forEach(hero => {
      if (hero.classList.contains('caluler-hero-has-ad')) return;
      const container = Array.from(hero.children).find(node => node.classList.contains('container'));
      if (!container?.querySelector('h1')) return;
      let ad = hero.nextElementSibling;
      if (!ad?.classList.contains('caluler-hero-ad-space')) {
        // Missing top slots are approved; content/sidebar advertising is never repurposed.
        if (body.querySelector('.caluler-hero-ad-space')) return;
        ad = document.createElement('div');
        ad.className = 'caluler-hero-ad-space';
        ad.setAttribute('role', 'complementary');
        ad.setAttribute('aria-label', 'Advertisement');
        ad.textContent = 'Advertisement';
      }
      // Reparenting a loaded iframe in older browsers can reload it. Keep it untouched instead.
      if (ad.querySelector('iframe,ins.adsbygoogle[data-adsbygoogle-status],ins.adsbygoogle[data-ad-status]') &&
          typeof container.moveBefore !== 'function') return;
      const copy = document.createElement('div');
      copy.className = 'caluler-hero-copy';
      copy.append(...Array.from(container.childNodes));
      container.appendChild(copy);
      if (typeof container.moveBefore === 'function' && ad.isConnected) container.moveBefore(ad, null);
      else container.appendChild(ad);
      container.classList.add('caluler-hero-ad-layout');
      hero.classList.add('caluler-hero-has-ad');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, {once:true});
  else initialise();
  window.addEventListener('pageshow', initialise);
})();
/* END CALULER-TOOL-HERO-AD-LAYOUT-V1 */

/* CALULER-RELATED-TOOLS-UI-V1: reuse every existing heading, card and Browse destination. */
(function () {
  'use strict';
  if (window.__calulerRelatedToolsUIV1) return;
  window.__calulerRelatedToolsUIV1 = true;
  function icon(pathData, className) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', className);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData); svg.appendChild(path);
    return svg;
  }
  function initialise() {
    if (!document.body?.dataset.calulerCategory) return;
    document.querySelectorAll('.sidebar-box > .related').forEach(related => {
      const box = related.parentElement;
      if (box.classList.contains('caluler-related-tools')) return;
      const heading = Array.from(box.children).find(node => /^H[23]$/.test(node.tagName));
      const rows = box.querySelectorAll('.sidebar-browse');
      if (!heading || rows.length !== 1) return;
      const oldRow = rows[0], links = oldRow.querySelectorAll('a');
      if (links.length !== 1 || !links[0].getAttribute('href')) return;
      const browse = links[0], destination = browse.getAttribute('href');
      const cards = Array.from(related.children).filter(node => node.tagName === 'A');
      const header = document.createElement('div'); header.className = 'caluler-related-header';
      heading.classList.add('caluler-related-heading'); header.appendChild(heading);
      const label = document.createElement('span'); label.textContent = 'Browse All ' + window.calulerToolInventory.length + ' Tools';
      browse.classList.add('caluler-related-browse');
      browse.replaceChildren(label, icon('M7 17 17 7M7 7h10v10', 'caluler-related-browse-icon'));
      header.appendChild(browse); box.insertBefore(header, related);
      // Remove only the now-empty former Browse row, after preserving its working anchor/URL.
      if (browse.parentElement === header && browse.getAttribute('href') === destination &&
          oldRow.children.length === 0 && !oldRow.textContent.trim()) oldRow.remove();
      cards.forEach(card => {
        card.classList.add('caluler-related-card');
        const tile = card.querySelector('.related-icon');
        if (tile) tile.setAttribute('aria-hidden', 'true');
        const name = Array.from(card.children).find(node => node.tagName === 'SPAN' && node !== tile);
        if (name) name.classList.add('caluler-related-name');
        card.appendChild(icon('m9 5 7 7-7 7', 'caluler-related-chevron'));
      });
      box.classList.add('caluler-related-tools');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, {once:true});
  else initialise();
  window.addEventListener('pageshow', initialise);
})();
/* END CALULER-RELATED-TOOLS-UI-V1 */

/* CALULER-FACEBOOK-WHITE-GLYPH-V1 */
(function () {
  'use strict';
  function initialiseFacebookIcons() {
    document.querySelectorAll('.footer-social-facebook svg').forEach(function (svg) {
      if (svg.querySelector('path[data-caluler-facebook-glyph]')) return;
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('data-caluler-facebook-glyph', '');
      path.setAttribute('d', 'M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.6 1.6-1.6h1.7V3.5c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.6v1.9H7v3.1h2.8v8z');
      path.setAttribute('fill', '#FFFFFF');
      // White f only: no badge, background shape or mask IDs.
      var descriptions = Array.from(svg.children).filter(function (child) {
        return child.localName === 'title' || child.localName === 'desc';
      });
      svg.replaceChildren(...descriptions, path);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiseFacebookIcons, { once: true });
  } else initialiseFacebookIcons();
})();
/* END CALULER-FACEBOOK-WHITE-GLYPH-V1 */

/* CALULER-FOOTER-SOCIAL-NAMES-V1: preserve existing spans/links and profile URLs. */
(function () {
  'use strict';
  function initialiseFooterSocialNames() {
    var names = {
      'footer-social-youtube': 'Caluler on YouTube',
      'footer-social-facebook': 'Caluler on Facebook',
      'footer-social-x': 'Caluler on X'
    };
    document.querySelectorAll('footer.footer .footer-socials--brand > .footer-social-icon').forEach(function (icon) {
      Object.keys(names).forEach(function (name) {
        if (icon.classList.contains(name)) icon.setAttribute('aria-label', names[name]);
      });
      if (icon.tagName === 'A' && (icon.getAttribute('target') || '').toLowerCase() === '_blank') {
        var rel = (icon.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
        ['noopener', 'noreferrer'].forEach(function (token) {
          if (!rel.some(function (value) { return value.toLowerCase() === token; })) rel.push(token);
        });
        icon.setAttribute('rel', rel.join(' '));
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiseFooterSocialNames, { once: true });
  } else initialiseFooterSocialNames();
})();
/* END CALULER-FOOTER-SOCIAL-NAMES-V1 */
