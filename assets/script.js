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
 let out=[]; [6,5,4,3].forEach(c=>{let bed=new Date(wake.getTime()-c*90*60000-15*60000); out.push(`${c} cycles: <b>${bed.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</b>`)});
 show('result','Recommended bedtimes:<br>'+out.join('<br>'));
}
function calculateBMI(){
 const w=n('weight'), h=n('height')/100; if(!w||!h) return show('result','Please enter weight and height.');
 const bmi=w/(h*h); let s=bmi<18.5?'Underweight':bmi<25?'Normal weight':bmi<30?'Overweight':'Obese';
 show('result',`Your BMI is <b>${bmi.toFixed(1)}</b> — ${s}.`);
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
    let s=cleanExpression(expression).replace(/(\d+(?:\.\d+)?)\s*%\s*(\d+(?:\.\d+)?)/g,'($1*$2/100)').replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
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
    if (!expression) return;
    if (!/[0-9.)]$/.test(expression)) return;
    expression += '%';
    justEvaluated = false;
    render();
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
    const formatMemory=value=>Number(value.toPrecision(12)).toString();
    if(type==='MC'){
      memory=0;
      if(exprEl) exprEl.textContent='Memory cleared (0)';
      return;
    }
    if(type==='MR'){
      expression=String(memory);
      justEvaluated=false;
      render();
      if(exprEl) exprEl.textContent='Memory recalled';
      return;
    }
    let current=0;
    try{
      current=expression?Number(Function('"use strict"; return ('+cleanExpression(expression)+')')()):0;
      if(!Number.isFinite(current)) throw new Error('Invalid value');
    }catch(e){
      if(exprEl) exprEl.textContent='Cannot use memory with an invalid value';
      return;
    }
    if(type==='M+'){
      memory+=current;
      if(exprEl) exprEl.textContent='Memory saved: '+formatMemory(memory);
      return;
    }
    if(type==='M−'){
      memory-=current;
      if(exprEl) exprEl.textContent='Memory updated: '+formatMemory(memory);
    }
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
    const btn=$id('calulerThemeToggle'); if(btn){btn.textContent=dark?'☀️':'🌙';btn.setAttribute('aria-pressed',String(dark));btn.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode')}
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
