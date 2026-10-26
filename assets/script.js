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

  function flagSvg(country) {
    const base = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">';
    const end = '<rect x=".5" y=".5" width="29" height="19" rx="1" fill="none" stroke="#cbd5e1" stroke-width=".7"/></svg>';

    const flags = {
      gb: '<rect width="30" height="20" fill="#012169"/><path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="5"/><path d="M0 0L30 20M30 0L0 20" stroke="#c8102e" stroke-width="2"/><path d="M15 0V20M0 10H30" stroke="#fff" stroke-width="7"/><path d="M15 0V20M0 10H30" stroke="#c8102e" stroke-width="3"/>',
      us: '<rect width="30" height="20" fill="#fff"/><path d="M0 0H30V2H0ZM0 4H30V6H0ZM0 8H30V10H0ZM0 12H30V14H0ZM0 16H30V18H0Z" fill="#b22234"/><path d="M0 0H13V11H0Z" fill="#3c3b6e"/>',
      pk: '<rect width="30" height="20" fill="#01411c"/><rect width="7" height="20" fill="#fff"/><circle cx="18" cy="10" r="5.2" fill="#fff"/><circle cx="20" cy="8.5" r="4.5" fill="#01411c"/><path d="M23 4.5L24 6.8L26.5 7L24.6 8.6L25.2 11L23 9.7L20.9 11L21.4 8.6L19.5 7L22 6.8Z" fill="#fff"/>',
      sa: '<rect width="30" height="20" fill="#006c35"/><path d="M7 13H23M8 15H22" stroke="#fff" stroke-width="1.4"/><path d="M8 6H22" stroke="#fff" stroke-width="1.1"/>',
      in: '<rect width="30" height="6.67" fill="#ff9933"/><rect y="6.67" width="30" height="6.66" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#138808"/><circle cx="15" cy="10" r="2.7" fill="none" stroke="#000080" stroke-width=".65"/>',
      es: '<rect width="30" height="5" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/><rect y="15" width="30" height="5" fill="#aa151b"/>',
      fr: '<rect width="10" height="20" fill="#0055a4"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ef4135"/>',
      de: '<rect width="30" height="6.67" fill="#000"/><rect y="6.67" width="30" height="6.66" fill="#dd0000"/><rect y="13.33" width="30" height="6.67" fill="#ffce00"/>',
      it: '<rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ce2b37"/>',
      pt: '<rect width="12" height="20" fill="#006600"/><rect x="12" width="18" height="20" fill="#ff0000"/><circle cx="12" cy="10" r="3.3" fill="#ffcc00"/>',
      ru: '<rect width="30" height="6.67" fill="#fff"/><rect y="6.67" width="30" height="6.66" fill="#0039a6"/><rect y="13.33" width="30" height="6.67" fill="#d52b1e"/>',
      cn: '<rect width="30" height="20" fill="#de2910"/><path d="M6 2L7.2 5.2L10.5 5.3L7.9 7.2L8.9 10.3L6 8.4L3.1 10.3L4.1 7.2L1.5 5.3L4.8 5.2Z" fill="#ffde00"/><circle cx="13" cy="4" r=".9" fill="#ffde00"/><circle cx="15" cy="7" r=".9" fill="#ffde00"/><circle cx="15" cy="11" r=".9" fill="#ffde00"/><circle cx="13" cy="14" r=".9" fill="#ffde00"/>',
      jp: '<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="5.2" fill="#bc002d"/>',
      kr: '<rect width="30" height="20" fill="#fff"/><path d="M10 7A5 5 0 0 1 20 10A2.5 2.5 0 0 1 15 10A2.5 2.5 0 0 0 10 7Z" fill="#cd2e3a"/><path d="M10 7A5 5 0 0 0 20 10A2.5 2.5 0 0 1 15 10A2.5 2.5 0 0 0 10 7Z" fill="#0047a0"/>',
      tr: '<rect width="30" height="20" fill="#e30a17"/><circle cx="12" cy="10" r="5" fill="#fff"/><circle cx="14" cy="9" r="4" fill="#e30a17"/><path d="M19 5L20.1 8.1L23.2 8.2L20.8 10.1L21.7 13.2L19 11.3L16.3 13.2L17.2 10.1L14.8 8.2L17.9 8.1Z" fill="#fff"/>',
      id: '<rect width="30" height="10" fill="#ce1126"/><rect y="10" width="30" height="10" fill="#fff"/>',
      bd: '<rect width="30" height="20" fill="#006a4e"/><circle cx="14" cy="10" r="5" fill="#f42a41"/>',
      ir: '<rect width="30" height="6.67" fill="#239f40"/><rect y="6.67" width="30" height="6.66" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#da0000"/><path d="M3 10H27" stroke="#da0000" stroke-width=".55"/>',
      nl: '<rect width="30" height="6.67" fill="#ae1c28"/><rect y="6.67" width="30" height="6.66" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#21468b"/>'
    };

    const art = flags[country] || '<rect width="30" height="20" fill="#e2e8f0"/><circle cx="15" cy="10" r="6" fill="none" stroke="#64748b" stroke-width="1.4"/><path d="M5 10H25M15 3C11 7 11 13 15 17M15 3C19 7 19 13 15 17" stroke="#64748b" stroke-width=".8" fill="none"/>';

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(base + art + end);
  }

  function cleanLanguageLabel(option) {
    return (option.textContent || option.value || 'Language')
      .replace(/^[\u{1F1E6}-\u{1F1FF}]{2}\s*/u, '')
      .replace(/^[A-Z]{2}\s+(?=[A-Za-z])/, '')
      .trim() || option.value || 'Language';
  }

  function flagCountry(option) {
    const value = (option.value || '').toLowerCase().replace(/_/g, '-');

    const map = {
      'en-us': 'us', 'en-gb': 'gb', 'en': 'gb',
      'ur': 'pk', 'ar': 'sa', 'hi': 'in',
      'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it',
      'pt': 'pt', 'ru': 'ru', 'zh-cn': 'cn', 'zh': 'cn',
      'ja': 'jp', 'ko': 'kr', 'tr': 'tr', 'id': 'id',
      'bn': 'bd', 'pa': 'in', 'fa': 'ir',
      'nl': 'nl', 'ta': 'in'
    };

    if (map[value]) return map[value];

    const prefix = value.split('-')[0];
    return map[prefix] || 'world';
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
    trigger.className = 'caluler-language-trigger';
    trigger.setAttribute('aria-label', 'Choose language');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('div');
    menu.className = 'caluler-language-menu';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', 'Available languages');

    const options = Array.from(select.options).filter(function (option) {
      return !option.disabled;
    });

    if (!options.length) return;

    const flagCache = new Map();

    function getFlag(option) {
      const code = flagCountry(option);

      if (!flagCache.has(code)) {
        flagCache.set(code, flagSvg(code));
      }

      return flagCache.get(code);
    }

    function makeFlag(option) {
      const img = document.createElement('img');
      img.className = 'caluler-language-flag';
      img.src = getFlag(option);
      img.alt = '';
      img.width = 30;
      img.height = 20;
      img.setAttribute('aria-hidden', 'true');
      return img;
    }

    function updateSelectedLabel() {
      const selected = options.find(function (option) {
        return option.value === select.value;
      }) || options[0];

      trigger.replaceChildren();

      trigger.appendChild(makeFlag(selected));

      const label = document.createElement('span');
      label.className = 'caluler-language-trigger-label';
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
    }

    options.forEach(function (option) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'caluler-language-option';
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', String(option.value === select.value));

      item.appendChild(makeFlag(option));

      const text = document.createElement('span');
      text.textContent = cleanLanguageLabel(option);
      item.appendChild(text);

      item.addEventListener('click', function () {
        select.value = option.value;

        // Preserve existing theme/translation integrations.
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));

        menu.querySelectorAll('.caluler-language-option').forEach(function (button) {
          button.setAttribute(
            'aria-selected',
            String(button.querySelector('span').textContent === cleanLanguageLabel(option))
          );
        });

        updateSelectedLabel();
        closeMenu();
        trigger.focus();
      });

      menu.appendChild(item);
    });

    picker.appendChild(trigger);
    picker.appendChild(menu);

    select.insertAdjacentElement('beforebegin', picker);
    select.hidden = true;
    select.setAttribute('aria-hidden', 'true');
    select.tabIndex = -1;
    select.dataset.calulerV8 = 'ready';

    trigger.addEventListener('click', function () {
      const open = !picker.classList.contains('is-open');

      document.querySelectorAll('.caluler-language-picker.is-open').forEach(function (other) {
        other.classList.remove('is-open');
        const otherTrigger = other.querySelector('.caluler-language-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      picker.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', function (event) {
      if (!picker.contains(event.target)) closeMenu();
    });

    picker.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
        trigger.focus();
      }
    });

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
