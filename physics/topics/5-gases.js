/* Ideal gas & kinetic theory: pV = nRT, changes of state, and what the molecules are doing.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,SQ,EQ,CALC,IMPLIES,AND,PAREN,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,tri,rnd,gas,box,cylinder,flame,thermo,loopFade}=draw;

/* symbols used below */
const PP=mi("p"),VV=mi("V"),NN=mi("n"),RR=mi("R"),TT=mi("T"),KB=mi("k"),MOL=mi("M"),RHO=mi("ρ"),NA=sb(mi("N"),"A");
const P1=sb(mi("p"),"1"),P2=sb(mi("p"),"2"),VA=sb(mi("V"),"1"),VB=sb(mi("V"),"2"),TA=sb(mi("T"),"1"),TB=sb(mi("T"),"2");
const EK=`⟨${sb(mi("E"),"k")}⟩`,VRMS=sb(mi("v"),"rms"),N0=sb(mi("n"),"0"),M0=sb(mi("m"),"0"),EKT=sb(mi("E"),"k,total");
const GASES={He:["helium",4.0],Ne:["neon",20.2],Ar:["argon",39.9],N2:["nitrogen",28.0],O2:["oxygen",32.0],CO2:["carbon dioxide",44.0],H2:["hydrogen",2.0]};
const gform=k=>k.replace(/(\d)/g,d=>"₀₁₂₃₄₅₆₇₈₉"[d]);
const TERMS={
  rigid:["Rigid tank","Its walls don't stretch, so the volume of the gas stays the same."],
  ideal:["Ideal gas","A gas whose molecules are tiny and don't pull on each other. Real gases behave like this when they're not too cold or too squashed."],
  sealed:["Sealed","No gas gets in or out, so the amount of gas (in moles) stays the same."],
  trans:["Translational kinetic energy","The energy of a molecule moving from place to place (not spinning). On average it's (3/2)kT, the same for every gas at the same temperature."],
  rms:["Root-mean-square speed","Square every molecule's speed, take the average, then the square root. It's a typical molecular speed, and it's what sets the average kinetic energy."],
  numden:["Number density","How many molecules there are in each cubic metre."]
};
const R_GIVEN={k:"R",sym:RR,name:"gas constant",unit:"J/(mol·K)",val:C.R,why:"Not in the question: a constant you're expected to know.",look:"Not in the question: the gas constant."};
const K_GIVEN={k:"kB",sym:KB,name:"Boltzmann constant",unit:"J/K",val:C.k,why:"Not in the question: the gas constant for one molecule, R ÷ N_A. Type it as 1.38e-23.",look:"Not in the question: the Boltzmann constant."};
const T_GIVEN=(tC,why)=>({k:"T",sym:TT,name:"temperature",unit:"K",val:toK(tC),why:why||"Gas formulas need kelvin: add 273.15.",look:"The temperature is in °C. Add 273.15 to get kelvin.",gtraps:[[tC,`${fmt(tC)} is in °C. Add 273.15 to get kelvin.`]]});

PHYS.add("Ideal gas & kinetic theory",[

/* ===== Pressure in a rigid tank ===== */
{
  id:"gas-tank", level:"Easy", title:"Gas in a steel tank", hw:"Course topic: the ideal gas law",
  base:{gas:"N2",n:0.8,V:10,tC:27},
  random:()=>({gas:pick(["He","N2","O2","Ar","CO2"]),n:pick([0.2,0.4,0.5,0.8,1,1.5,2,3]),V:pick([2,5,8,10,20,25,50]),tC:pick([0,10,20,27,35,50,80])}),
  calc:p=>{const T=toK(p.tC),pk=p.n*C.R*T/(p.V/1000)/1000;return {T,pk};},
  text:(p,G,T)=>`A ${T("rigid","rigid")} steel tank with a volume of ${G("V",`${p.V} L`)} holds ${G("n",`${p.n} mol`)} of ${GASES[p.gas][0]} at ${G("T",`${p.tC} °C`)}. Treat it as an ${T("ideal","ideal gas")}. (a) What is the temperature in kelvin? (b) What is the pressure in the tank, in kPa?`,
  terms:{rigid:TERMS.rigid,ideal:TERMS.ideal},
  given:p=>[
    {k:"V",sym:VV,name:"volume",unit:"m³",val:p.V/1000,why:`1 L = 0.001 m³, so ${p.V} L = ${p.V/1000} m³.`,look:"The volume is in litres. Divide by 1000 to get m³.",gtraps:[[p.V,`${p.V} is in litres. Divide by 1000 to get m³.`]]},
    {k:"n",sym:NN,name:"amount of gas",unit:"mol",val:p.n,why:"",look:"The number measured in mol."},
    T_GIVEN(p.tC),R_GIVEN
  ],
  find:[{sym:TT,name:"temperature in kelvin",unit:"K",why:"Part (a)."},{sym:PP,name:"pressure",unit:"kPa",why:"Part (b)."}],
  parts:[
    {id:"T",label:"(a) Temperature in kelvin",sym:TT,unit:"K",tol:0.002,ans:(p,c)=>c.T,traps:(p,c)=>[[p.tC,"That's in °C. Add 273.15 to get kelvin."],[p.tC-273.15,"Add 273.15, don't subtract: kelvin numbers are bigger."]].filter(t=>Math.abs(t[0]-c.T)>1)},
    {id:"p",label:"(b) Pressure",sym:PP,unit:"kPa",ans:(p,c)=>c.pk,traps:(p,c)=>clean([[c.pk*1000,"That's in pascals. Divide by 1000 to get kPa."],[c.pk*p.tC/c.T,"Use the temperature in kelvin, not °C."],[c.pk/1000,"Check the volume: "+p.V+" L = "+p.V/1000+" m³, and the answer in Pa then ÷ 1000 for kPa."],[(p.V/1000)/(p.n*C.R*c.T),"Upside down: p = nRT ÷ V."]],c.pk)}
  ],
  idea:()=>`<p>The ideal gas law links pressure, volume, amount of gas and temperature: <b>pV = nRT</b>. You know n, V and T, so solve for p.</p>
    <p>Two unit rules make it work: temperature in <b>kelvin</b> (add 273.15 to °C), and volume in <b>m³</b> (1 L = 0.001 m³). Then p comes out in pascals.</p>
    <p class="small">Try it now. The next hint gives you the formula.</p>`,
  formula:()=>EQ(`${PP}${VV}${OP("=")}${NN}${RR}${TT}${IMPLIES}${PP}${OP("=")}${FR(`${NN}${RR}${TT}`,VV)}`)+EQ(`${TT}${OP("=")}${mi("t")}${OP("+")}273.15`)+
    legend([[PP,"pressure","Pa"],[VV,"volume","m³"],[NN,"amount of gas","mol"],[RR,"gas constant, 8.314","J/(mol·K)"],[TT,"temperature","K"]],"1 kPa = 1000 Pa."),
  plug:(p,c)=>EQ(`${TT}${OP("=")}${p.tC}${OP("+")}273.15${AND}${PP}${OP("=")}${FR(`${p.n}${OP("×")}8.314${OP("×")}${fmt(c.T)}`,p.V/1000)}`)+calcTip(`${p.n}*8.314*${R3(c.T)}/${p.V/1000}/1000`," That gives kPa."),
  solution:(p,c)=>steps([
      ["(a) Kelvin",CALC(`${TT} = ${p.tC} + 273.15 = <b>${fmt(c.T)} K</b>`)],
      ["(b) Ideal gas law",CALC(`${PP} = ${p.n} × 8.314 × ${fmt(c.T)} ÷ ${p.V/1000} = ${fmt(c.pk*1000)} Pa = <b>${fmt(c.pk)} kPa</b>`)]
    ])+checkline(`For comparison, air pressure is about 101 kPa, so this tank is at ${fmt(c.pk/101.3)} atmospheres.`)+
    finalAns(`${TT} = ${fmt(c.T)} K, &nbsp;${PP} = ${fmt(c.pk)} kPa`),
  sheet:[{name:"Ideal gas law",eq:`${PP}${VV}${OP("=")}${NN}${RR}${TT}`,note:"Pa, m³, mol, K. R = 8.314 J/(mol·K)."}],
  takeEq:()=>`${PP}${VV}${OP("=")}${NN}${RR}${TT}`,
  takeaway:"pV = nRT, with T in kelvin and V in m³; the pressure comes out in pascals.",
  link:"The ideal gas law is the starting point for the whole molecular-kinetic part of your course list.",
  viz:viz.slider((p,c)=>({note:"Same tank, same gas. Drag the temperature: the pressure grows in step with the temperature in kelvin (not °C).",label:"Temperature",unit:"°C",min:-100,max:300,step:5,value:p.tC,
    bars:[{label:"Pressure (full bar = at 300 °C)",segs:[{cls:"seg-heat",frac:x=>toK(x)/toK(300)}]}],
    read:x=>`${PP} = <b>${fmt(p.n*C.R*toK(x)/(p.V/1000)/1000)} kPa</b>`})),
  scene:{still:1,draw(K,t,p){K.rect(160,40,250,150,{fill:"card",c:"ink",w:3,r:40});gas(K,175,52,220,126,t,{n:28,v:80,r:4,seed:5});K.rect(160,40,250,150,{c:"ink",w:3,r:40});
    const gx=470,gy=70;K.line(410,115,gx,115,{w:4,c:"ink2"});K.line(gx,115,gx,gy+26,{w:4,c:"ink2"});K.circle(gx,gy,28,{fill:"card",c:"ink",w:2});
    const a=-2.4+1.6+0.05*Math.sin(t*6);K.line(gx,gy,gx+20*Math.cos(a),gy+20*Math.sin(a),{c:"bad",w:2});K.circle(gx,gy,3,{fill:"ink",c:false});K.text("p",gx,gy+14,{size:10,c:"ink2"});
    K.tag(`${p.V} L`,285,206,{size:11});K.tag(`${p.tC} °C`,90,60,{size:11});}}
},

/* ===== Squeezing and heating a sealed syringe ===== */
{
  id:"gas-change", level:"Medium", title:"Squeeze and heat a gas", hw:"Course topic: ideal gas, change of state",
  base:{p1:100,V1:2,V2:0.5,t1:20,t2:80},
  random:()=>{const V1=pick([1,1.5,2,3,4,5]);return {p1:pick([90,100,101.3,120,150,200]),V1,V2:S3(V1*pick([0.2,0.25,0.4,0.5,0.6])),t1:pick([0,10,15,20,25]),t2:pick([40,60,80,100,150,200])};},
  calc:p=>{const V2=p.V2||S3(p.V1*0.25),T1=toK(p.t1),T2=toK(p.t2),p2=p.p1*p.V1*T2/(V2*T1);return {V2,T1,T2,p2,n:p.p1*1000*p.V1/1000/(C.R*T1),piso:p.p1*p.V1/V2};},
  text:(p,G,T)=>{const V2=p.V2||S3(p.V1*0.25);return `A ${T("sealed","sealed")} cylinder holds ${G("V1",`${p.V1} L`)} of air at ${G("t1",`${p.t1} °C`)} and ${G("p1",`${p.p1} kPa`)}. A piston squeezes it down to ${G("V2",`${V2} L`)} while it's heated to ${G("t2",`${p.t2} °C`)}. Treat the air as an ${T("ideal","ideal gas")}. Find (a) the new pressure, in kPa, (b) how many moles of air are in the cylinder, and (c) what the new pressure would be if the temperature had stayed at ${p.t1} °C.`;},
  terms:{sealed:TERMS.sealed,ideal:TERMS.ideal},
  given:p=>{const V2=p.V2||S3(p.V1*0.25);return [
    {k:"V1",sym:VA,name:"starting volume",unit:"L",val:p.V1,why:"In the ratio V₁ ÷ V₂ the units cancel, so litres are fine there.",look:"The first volume."},
    {k:"t1",sym:TA,name:"starting temperature",unit:"K",val:toK(p.t1),why:"Temperatures must be in kelvin, even in a ratio.",look:"The first temperature, in kelvin (+ 273.15).",gtraps:[[p.t1,"Use kelvin: add 273.15. In a ratio, °C gives the wrong answer."]]},
    {k:"p1",sym:P1,name:"starting pressure",unit:"kPa",val:p.p1,why:"",look:"The pressure in kPa."},
    {k:"V2",sym:VB,name:"final volume",unit:"L",val:V2,why:"",look:"The second volume."},
    {k:"t2",sym:TB,name:"final temperature",unit:"K",val:toK(p.t2),why:"",look:"The second temperature, in kelvin.",gtraps:[[p.t2,"Use kelvin: add 273.15."]]},
    R_GIVEN];},
  find:p=>[{sym:P2,name:"new pressure",unit:"kPa",why:"Part (a)."},{sym:NN,name:"amount of air",unit:"mol",why:"Part (b). It doesn't change: the cylinder is sealed."},{sym:sb(mi("p"),"2,iso"),name:"new pressure if T stayed the same",unit:"kPa",why:"Part (c)."}],
  parts:[
    {id:"p2",label:"(a) New pressure",sym:P2,unit:"kPa",ans:(p,c)=>c.p2,traps:(p,c)=>clean([[p.p1*p.V1*p.t2/(c.V2*p.t1),"Use kelvin for both temperatures. With °C the ratio comes out wrong."],[c.piso,"That ignores the heating. Include the temperature ratio T₂ ÷ T₁ too."],[p.p1*c.V2*c.T2/(p.V1*c.T1),"Upside down for the volumes: squeezing raises the pressure, so it's × V₁ ÷ V₂."],[p.p1*p.V1*c.T1/(c.V2*c.T2),"Upside down for the temperatures: heating raises the pressure, so it's × T₂ ÷ T₁."]],c.p2)},
    {id:"n",label:"(b) Amount of air",sym:NN,unit:"mol",ans:(p,c)=>c.n,traps:(p,c)=>clean([[c.n*1e6,"Convert units: kPa → Pa (× 1000) and L → m³ (÷ 1000). They happen to cancel, but only if you do both."],[c.n*c.T1/p.t1,"Use the temperature in kelvin."],[c.n/1000,"Convert the pressure to pascals: × 1000."],[c.n*1000,"Convert litres to m³: ÷ 1000."]],c.n)},
    {id:"pi",label:p=>`(c) New pressure if it stayed at ${p.t1} °C`,sym:sb(mi("p"),"2,iso"),unit:"kPa",ans:(p,c)=>c.piso,traps:(p,c)=>clean([[c.p2,"That's with the heating. Here the temperature stays the same: p₂ = p₁ × V₁ ÷ V₂."],[p.p1*c.V2/p.V1,"Upside down: a smaller volume means a higher pressure."]],c.piso)}
  ],
  idea:()=>`<p>The cylinder is sealed, so n stays the same. Then pV = nRT says <b>pV ÷ T is the same before and after</b>:</p>
    <p style="text-align:center"><b>p₁V₁ ÷ T₁ = p₂V₂ ÷ T₂</b></p>
    <p>Squeezing (smaller V) raises the pressure. Heating (bigger T) raises it too. Solve for p₂. In ratios, pressure and volume units cancel, but <b>temperature must always be in kelvin</b>.</p>
    <p>(b) For the number of moles you need real SI units: pascals and m³. (c) Same as (a) with T₂ = T₁.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${FR(`${P1}${VA}`,TA)}${OP("=")}${FR(`${P2}${VB}`,TB)}${IMPLIES}${P2}${OP("=")}${P1}${OP("·")}${FR(VA,VB)}${OP("·")}${FR(TB,TA)}`)+EQ(`${NN}${OP("=")}${FR(`${P1}${VA}`,`${RR}${TA}`)}`)+
    legend([[P1,"starting pressure","kPa (any unit, it cancels)"],[VA,"starting volume","L (any unit, it cancels)"],[TA,"starting temperature","K, always"],[NN,"moles: needs Pa and m³","mol"]],"Check the direction: squeezing and heating should both push the pressure up."),
  plug:(p,c)=>EQ(`${P2}${OP("=")}${p.p1}${OP("×")}${FR(p.V1,c.V2)}${OP("×")}${FR(fmt(c.T2),fmt(c.T1))}`)+EQ(`${NN}${OP("=")}${FR(`${fmt(p.p1*1000)}${OP("×")}${p.V1/1000}`,`8.314${OP("×")}${fmt(c.T1)}`)}`)+calcTip(`${p.p1}*${p.V1}/${c.V2}*${R3(c.T2)}/${R3(c.T1)}`),
  solution:(p,c)=>steps([
      ["Kelvin",`${TA} = ${p.t1} + 273.15 = ${fmt(c.T1)} K, &nbsp;${TB} = ${p.t2} + 273.15 = ${fmt(c.T2)} K`],
      ["(a) Combined gas law",CALC(`${P2} = ${p.p1} × (${p.V1} ÷ ${c.V2}) × (${fmt(c.T2)} ÷ ${fmt(c.T1)}) = ${p.p1} × ${fmt(p.V1/c.V2)} × ${fmt(c.T2/c.T1)} = <b>${fmt(c.p2)} kPa</b>`)],
      ["(b) Moles, in SI units",CALC(`${NN} = ${fmt(p.p1*1000)} × ${p.V1/1000} ÷ (8.314 × ${fmt(c.T1)}) = <b>${fmt(c.n)} mol</b>`)],
      ["(c) Without the heating",CALC(`${sb(mi("p"),"2,iso")} = ${p.p1} × ${p.V1} ÷ ${c.V2} = <b>${fmt(c.piso)} kPa</b>`)]
    ])+checkline(`Check (a) with n: p₂ = nRT₂ ÷ V₂ = ${fmt(c.n)} × 8.314 × ${fmt(c.T2)} ÷ ${c.V2/1000} = ${fmt(c.n*C.R*c.T2/(c.V2/1000)/1000)} kPa ✓`)+
    finalAns(`${P2} = ${fmt(c.p2)} kPa, &nbsp;${NN} = ${fmt(c.n)} mol, &nbsp;${sb(mi("p"),"2,iso")} = ${fmt(c.piso)} kPa`),
  sheet:[{name:"Combined gas law",eq:`${FR(`${P1}${VA}`,TA)}${OP("=")}${FR(`${P2}${VB}`,TB)}`,note:"Sealed gas. T in kelvin; p and V in any matching units."}],
  takeEq:()=>`${FR(`${P1}${VA}`,TA)}${OP("=")}${FR(`${P2}${VB}`,TB)}`,
  takeaway:"For a sealed gas, pV/T stays the same. Temperatures always in kelvin; pressure and volume units cancel in the ratio.",
  link:"This is the ideal gas law applied twice. The gas processes later on (constant pressure, constant temperature) are special cases of it.",
  viz:viz.slider((p,c)=>({note:"Drag the final volume. Halve the volume and the pressure doubles; the heating multiplies it by T₂ ÷ T₁ on top of that.",label:"Final volume",unit:"L",min:R3(p.V1*0.1),max:p.V1,step:0.05,value:c.V2,
    bars:[{label:"New pressure (full bar = at the smallest volume)",segs:[{cls:"seg-heat",frac:x=>(p.V1*0.1)/x}]}],
    read:x=>`${P2} = <b>${fmt(p.p1*p.V1/x*c.T2/c.T1)} kPa</b>`})),
  scene:{still:3,draw(K,t,p){const u=mod(t,7),f=K.ease(Math.min(1,u/4)),top=50+80*f;
    cylinder(K,250,40,100,150,top,{});gas(K,252,top,96,190-top,t,{n:22,v:60+60*f,r:3.6,seed:7});
    if(u>0.5&&u<5)flame(K,300,212,t,0.7);thermo(K,430,180,110,0.25+0.5*f,{});
    K.tag(`${p.V1} L → ${p.V2||S3(p.V1*0.25)} L`,140,70,{size:11});K.tag(`${p.t1} °C → ${p.t2} °C`,140,110,{size:11});
    loopFade(K,t,7,0.6,0.3);}}
},

/* ===== The energy and speed of gas molecules ===== */
{
  id:"gas-ke", level:"Medium", title:"How fast are the molecules?", hw:"Course topic: molecular kinetic theory",
  base:{gas:"O2",tC:27,n:2},
  random:()=>({gas:pick(Object.keys(GASES)),tC:pick([-50,-20,0,20,27,100,200,500]),n:pick([0.5,1,2,3,4,5])}),
  calc:p=>{const T=toK(p.tC),M=GASES[p.gas][1]/1000;return {T,M,Ek:1.5*C.k*T,v:Math.sqrt(3*C.R*T/M),Et:1.5*p.n*C.R*T};},
  text:(p,G,T)=>`A container holds ${G("n",`${p.n} mol`)} of ${GASES[p.gas][0]} gas (${gform(p.gas)}, molar mass ${G("M",`${GASES[p.gas][1]} g/mol`)}) at ${G("T",`${fmt(p.tC)} °C`)}. Find (a) the average ${T("trans","translational kinetic energy")} of one molecule, (b) the ${T("rms","root-mean-square speed")} of the molecules, and (c) the total translational kinetic energy of all the gas.`,
  terms:{trans:TERMS.trans,rms:TERMS.rms},
  given:p=>[
    T_GIVEN(p.tC),
    {k:"M",sym:MOL,name:"molar mass",unit:"kg/mol",val:GASES[p.gas][1]/1000,why:`For speeds, use kg/mol: ${GASES[p.gas][1]} g/mol = ${GASES[p.gas][1]/1000} kg/mol.`,look:"The molar mass is in g/mol. Divide by 1000 to get kg/mol.",gtraps:[[GASES[p.gas][1],`That's in g/mol. Divide by 1000 to get kg/mol.`]]},
    {k:"n",sym:NN,name:"amount of gas",unit:"mol",val:p.n,why:"For part (c).",look:"The number measured in mol."},
    K_GIVEN,R_GIVEN
  ],
  find:[{sym:EK,name:"average translational kinetic energy of one molecule",unit:"J",why:"Part (a). A tiny number."},{sym:VRMS,name:"root-mean-square speed",unit:"m/s",why:"Part (b)."},{sym:EKT,name:"total translational kinetic energy",unit:"J",why:"Part (c)."}],
  parts:[
    {id:"Ek",label:"(a) Average kinetic energy of one molecule",sym:EK,unit:"J",ans:(p,c)=>c.Ek,traps:(p,c)=>clean([[C.k*c.T,"Don't forget the 3/2: ⟨E_k⟩ = (3/2)kT."],[0.5*C.k*c.T,"It's 3/2, not 1/2: ⟨E_k⟩ = (3/2)kT (½kT for each of the three directions)."],[1.5*C.k*p.tC,"Use the temperature in kelvin."],[1.5*C.R*c.T,"That's per mole (with R). For one molecule use k = 1.38 × 10⁻²³ J/K."],[2.5*C.k*c.T,"Translational energy only: (3/2)kT. The 5/2 includes spinning, which isn't asked here."]],c.Ek)},
    {id:"v",label:"(b) Root-mean-square speed",sym:VRMS,unit:"m/s",ans:(p,c)=>c.v,traps:(p,c)=>clean([[Math.sqrt(3*C.R*c.T/GASES[p.gas][1]),"The molar mass must be in kg/mol: divide the g/mol by 1000."],[Math.sqrt(C.R*c.T/c.M),"Don't forget the 3: v = √(3RT/M)."],[3*C.R*c.T/c.M,"Take the square root."],[Math.sqrt(3*C.R*Math.max(p.tC,1)/c.M),"Use the temperature in kelvin."],[Math.sqrt(2*C.R*c.T/c.M),"That's the most probable speed (√(2RT/M)). The rms speed has a 3."]],c.v)},
    {id:"Et",label:"(c) Total translational kinetic energy",sym:EKT,unit:"J",ans:(p,c)=>c.Et,traps:(p,c)=>clean([[2.5*p.n*C.R*c.T,"Translational only: (3/2)nRT. The 5/2 would include rotation."],[p.n*C.R*c.T,"Don't forget the 3/2: E = (3/2)nRT."],[c.Ek,"That's one molecule. Multiply by the number of molecules, nN_A, or use (3/2)nRT."],[1.5*p.n*C.R*p.tC,"Use kelvin."]],c.Et)}
  ],
  idea:()=>`<p>Temperature <b>is</b> the jiggling of molecules. Kinetic theory makes this exact:</p>
    <ul class="plain"><li>(a) The average translational kinetic energy of a molecule depends <b>only on the temperature</b>: (3/2)kT. Same for every gas.</li>
    <li>(b) Set that equal to ½m₀v² and solve for v. Written per mole, it becomes v_rms = √(3RT/M). Light molecules move faster.</li>
    <li>(c) For all the gas, multiply by the number of molecules, which turns k into R: (3/2)nRT.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${EK}${OP("=")}${FR("3","2")}${KB}${TT}${AND}${VRMS}${OP("=")}${SQ(FR(`3${RR}${TT}`,MOL),true)}${AND}${EKT}${OP("=")}${FR("3","2")}${NN}${RR}${TT}`)+
    legend([[KB,"Boltzmann constant, 1.38 × 10⁻²³","J/K"],[TT,"temperature","K"],[MOL,"molar mass (in kg/mol!)","kg/mol"],[RR,"gas constant, 8.314","J/(mol·K)"]],"k is R for one molecule: k = R ÷ N_A."),
  plug:(p,c)=>EQ(`${EK}${OP("=")}1.5${OP("×")}1.38${OP("×")}10<sup>−23</sup>${OP("×")}${fmt(c.T)}`)+EQ(`${VRMS}${OP("=")}${SQ(FR(`3${OP("×")}8.314${OP("×")}${fmt(c.T)}`,c.M),true)}${AND}${EKT}${OP("=")}1.5${OP("×")}${p.n}${OP("×")}8.314${OP("×")}${fmt(c.T)}`)+calcTip(`sqrt(3*8.314*${R3(c.T)}/${c.M})`," For (a) you can type <code>1.5*1.38e-23*"+R3(c.T)+"</code>."),
  solution:(p,c)=>steps([
      ["Kelvin and kg/mol",`${TT} = ${fmt(p.tC)} + 273.15 = ${fmt(c.T)} K, &nbsp;${MOL} = ${c.M} kg/mol`],
      ["(a) One molecule",CALC(`${EK} = 1.5 × 1.38 × 10⁻²³ × ${fmt(c.T)} = <b>${fmt(c.Ek)} J</b>`)],
      ["(b) rms speed",CALC(`${VRMS} = √(3 × 8.314 × ${fmt(c.T)} ÷ ${c.M}) = <b>${fmt(c.v)} m/s</b>`)],
      ["(c) All of it",CALC(`${EKT} = 1.5 × ${p.n} × 8.314 × ${fmt(c.T)} = <b>${fmt(c.Et)} J</b>`)]
    ])+checkline(`(c) another way: number of molecules × (a) = ${p.n} × 6.022 × 10²³ × ${fmt(c.Ek)} = ${fmt(p.n*C.NA*c.Ek)} J ✓`)+
    finalAns(`${EK} = ${fmt(c.Ek)} J, &nbsp;${VRMS} = ${fmt(c.v)} m/s, &nbsp;${EKT} = ${fmt(c.Et)} J`),
  sheet:[{name:"Average kinetic energy per molecule",eq:`${EK}${OP("=")}${FR("3","2")}${KB}${TT}`,note:"Depends only on T. k = 1.38 × 10⁻²³ J/K."},{name:"rms speed",eq:`${VRMS}${OP("=")}${SQ(FR(`3${RR}${TT}`,MOL),true)}`,note:"M in kg/mol!"}],
  takeEq:()=>`${EK}${OP("=")}${FR("3","2")}${KB}${TT},${OP("")}${VRMS}${OP("=")}${SQ(FR(`3${RR}${TT}`,MOL),true)}`,
  takeaway:"Average kinetic energy per molecule is (3/2)kT, whatever the gas. v_rms = √(3RT/M), with M in kg/mol: lighter molecules are faster.",
  link:"Your course list: “The main molecular kinetic theory equation”. This is what it means for the molecules: temperature measures their kinetic energy.",
  viz:viz.slider((p,c)=>({note:"Drag the temperature (in kelvin). The energy grows in step with T, but the speed only grows with √T: four times hotter means twice as fast.",label:"Temperature",unit:"K",min:20,max:1500,step:10,value:Math.round(c.T/10)*10,
    bars:[{label:"Average energy (full bar = 1500 K)",segs:[{cls:"seg-heat",frac:x=>x/1500}]},{label:"rms speed (full bar = 1500 K)",segs:[{cls:"seg-ke",frac:x=>Math.sqrt(x/1500)}]}],
    read:x=>`${EK} = <b>${fmt(1.5*C.k*x)} J</b>, &nbsp;${VRMS} = <b>${fmt(Math.sqrt(3*C.R*x/c.M))} m/s</b>`})),
  scene:{still:1,draw(K,t,p){const T=toK(p.tC);box(K,110,30,320,170,{});gas(K,110,30,320,170,t,{n:26,v:20+0.25*T,r:4.2,seed:11,mark:3});
    K.tag(`${fmt(p.tC)} °C`,510,50,{size:11});K.text("orange: one molecule",510,180,{size:11,c:"heat"});}}
},

/* ===== The main equation of molecular kinetic theory ===== */
{
  id:"gas-mkt", level:"Hard", title:"Pressure from the molecules", hw:"Course topic: the main equation of molecular kinetic theory",
  base:{gas:"N2",T:273,pk:100,rho:1.25},
  random:()=>{const gas=pick(["He","Ne","N2","O2","Ar","CO2"]),T=pick([250,273,293,300,350,400,500]),pk=pick([50,80,100,101.3,150,200]);return {gas,T,pk,rho:S3(pk*1000*GASES[gas][1]/1000/(C.R*T))};},
  calc:p=>{const P=p.pk*1000,v=Math.sqrt(3*P/p.rho),n0=P/(C.k*p.T),m0=p.rho/n0;return {P,v,n0,m0,M:m0*C.NA*1000};},
  text:(p,G,T)=>`An unknown gas is at a pressure of ${G("p",`${p.pk} kPa`)} and a temperature of ${G("T",`${p.T} K`)}. Its density is ${G("rho",`${p.rho} kg/m³`)}. Using the main equation of molecular kinetic theory, find (a) the ${T("rms","rms speed")} of its molecules, (b) its ${T("numden","number density")} (molecules per m³), (c) the mass of one molecule, and (d) its molar mass in g/mol. Which gas could it be?`,
  terms:{rms:TERMS.rms,numden:TERMS.numden},
  given:p=>[
    {k:"p",sym:PP,name:"pressure",unit:"Pa",val:p.pk*1000,why:`${p.pk} kPa = ${fmt(p.pk*1000)} Pa.`,look:"The pressure in pascals (× 1000).",gtraps:[[p.pk,"That's in kPa. Multiply by 1000 to get pascals."]]},
    {k:"T",sym:TT,name:"temperature",unit:"K",val:p.T,why:"Already in kelvin.",look:"The temperature in K."},
    {k:"rho",sym:RHO,name:"density",unit:"kg/m³",val:p.rho,why:"Mass of gas in each cubic metre.",look:"The number measured in kg/m³."},
    K_GIVEN,{k:"NA",sym:NA,name:"Avogadro's number",unit:"1/mol",val:C.NA,why:"Not in the question: for part (d). Type 6.022e23.",look:"Not in the question: particles per mole."}
  ],
  find:[{sym:VRMS,name:"rms speed",unit:"m/s",why:"Part (a)."},{sym:N0,name:"number density",unit:"1/m³",why:"Part (b)."},{sym:M0,name:"mass of one molecule",unit:"kg",why:"Part (c)."},{sym:MOL,name:"molar mass",unit:"g/mol",why:"Part (d). Compare it with the periodic table."}],
  parts:[
    {id:"v",label:"(a) rms speed",sym:VRMS,unit:"m/s",ans:(p,c)=>c.v,traps:(p,c)=>clean([[Math.sqrt(c.P/p.rho),"Don't forget the 3: p = ⅓ρv², so v = √(3p/ρ)."],[3*c.P/p.rho,"Take the square root."],[Math.sqrt(3*p.pk/p.rho),"Use pascals: "+p.pk+" kPa = "+fmt(c.P)+" Pa."],[Math.sqrt(c.P/(3*p.rho)),"Multiply by 3, don't divide: v = √(3p/ρ)."]],c.v)},
    {id:"n0",label:"(b) Number density",sym:N0,unit:"1/m³",ans:(p,c)=>c.n0,traps:(p,c)=>clean([[c.P/(C.R*p.T),"That's moles per m³ (with R). For molecules per m³, use k: n₀ = p ÷ (kT)."],[c.P*C.k*p.T,"Divide: n₀ = p ÷ (kT)."],[p.pk/(C.k*p.T),"Use pascals, not kPa."]],c.n0)},
    {id:"m0",label:"(c) Mass of one molecule",sym:M0,unit:"kg",ans:(p,c)=>c.m0,traps:(p,c)=>clean([[p.rho*c.n0,"Divide the density by the number density: m₀ = ρ ÷ n₀."],[c.n0/p.rho,"Upside down: m₀ = ρ ÷ n₀ (kg per m³ ÷ molecules per m³)."]],c.m0)},
    {id:"M",label:"(d) Molar mass",sym:MOL,unit:"g/mol",ans:(p,c)=>c.M,traps:(p,c)=>clean([[c.M/1000,"That's in kg/mol. Multiply by 1000 for g/mol."],[c.m0*1000,"Multiply the mass of one molecule by Avogadro's number to get a mole's worth."]],c.M)}
  ],
  idea:()=>`<p>The <b>main equation of molecular kinetic theory</b> explains pressure as molecules hitting the walls:</p>
    <p style="text-align:center"><b>p = ⅓ n₀ m₀ ⟨v²⟩ = ⅓ ρ v_rms²</b></p>
    <p>(n₀ molecules per m³, each of mass m₀, so n₀m₀ is the density ρ.)</p>
    <ul class="plain"><li>(a) You know p and ρ, so solve for v_rms.</li><li>(b) Combine it with ⟨E_k⟩ = (3/2)kT and you get p = n₀kT. Solve for n₀.</li>
    <li>(c) Density = (molecules per m³) × (mass of each), so m₀ = ρ ÷ n₀.</li><li>(d) A mole has N_A molecules: M = m₀N_A. Then turn kg into g.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${PP}${OP("=")}${FR("1","3")}${N0}${M0}⟨${mi("v")}<sup>2</sup>⟩${OP("=")}${FR("1","3")}${RHO}${sq(VRMS)}${IMPLIES}${VRMS}${OP("=")}${SQ(FR(`3${PP}`,RHO),true)}`)+EQ(`${PP}${OP("=")}${N0}${KB}${TT}${AND}${M0}${OP("=")}${FR(RHO,N0)}${AND}${MOL}${OP("=")}${M0}${NA}`)+
    legend([[N0,"number density: molecules per m³","1/m³"],[M0,"mass of one molecule","kg"],[RHO,"density, n₀m₀","kg/m³"],[KB,"Boltzmann constant","J/K"]],"p = n₀kT is the ideal gas law written per molecule."),
  plug:(p,c)=>EQ(`${VRMS}${OP("=")}${SQ(FR(`3${OP("×")}${fmt(c.P)}`,p.rho),true)}${AND}${N0}${OP("=")}${FR(fmt(c.P),`1.38${OP("×")}10<sup>−23</sup>${OP("×")}${p.T}`)}`)+EQ(`${M0}${OP("=")}${FR(p.rho,N0)}${AND}${MOL}${OP("=")}${M0}${OP("×")}6.022${OP("×")}10<sup>23</sup>${OP("×")}1000`)+calcTip(`sqrt(3*${c.P}/${p.rho})`," For (b): <code>"+c.P+"/(1.38e-23*"+p.T+")</code>."),
  solution:(p,c)=>steps([
      ["(a) From p = ⅓ρv²",CALC(`${VRMS} = √(3 × ${fmt(c.P)} ÷ ${p.rho}) = <b>${fmt(c.v)} m/s</b>`)],
      ["(b) From p = n₀kT",CALC(`${N0} = ${fmt(c.P)} ÷ (1.38 × 10⁻²³ × ${p.T}) = <b>${fmt(c.n0)} m⁻³</b>`)],
      ["(c) Density ÷ number density",CALC(`${M0} = ${p.rho} ÷ ${fmt(c.n0)} = <b>${fmt(c.m0)} kg</b>`)],
      ["(d) A mole's worth, in grams",CALC(`${MOL} = ${fmt(c.m0)} × 6.022 × 10²³ = ${fmt(c.M/1000)} kg/mol = <b>${fmt(c.M)} g/mol</b>`)]
    ])+checkline(`${fmt(c.M)} g/mol is closest to ${(()=>{let b=null,d=1e9;for(const k in GASES){const e=Math.abs(GASES[k][1]-c.M);if(e<d){d=e;b=k;}}return `${GASES[b][0]} (${gform(b)}, ${GASES[b][1]} g/mol)`;})()}. Check (a) the other way: √(3RT/M) = ${fmt(Math.sqrt(3*C.R*p.T/(c.M/1000)))} m/s ✓`)+
    finalAns(`${VRMS} = ${fmt(c.v)} m/s, &nbsp;${N0} = ${fmt(c.n0)} m⁻³, &nbsp;${M0} = ${fmt(c.m0)} kg, &nbsp;${MOL} = ${fmt(c.M)} g/mol`),
  sheet:[{name:"Main equation of kinetic theory",eq:`${PP}${OP("=")}${FR("1","3")}${N0}${M0}⟨${mi("v")}<sup>2</sup>⟩${OP("=")}${FR("2","3")}${N0}${EK}`,note:"Pressure = molecules hitting the walls."},{name:"Per molecule",eq:`${PP}${OP("=")}${N0}${KB}${TT}`,note:"n₀ = molecules per m³."}],
  takeEq:()=>`${PP}${OP("=")}${FR("1","3")}${RHO}${sq(VRMS)}${OP("=")}${N0}${KB}${TT}`,
  takeaway:"p = ⅓ρv_rms² gives the speed; p = n₀kT gives the molecules per m³; ρ ÷ n₀ gives one molecule's mass, and × N_A the molar mass.",
  link:"Your course list: “The main molecular kinetic theory equation”. This question uses it forwards and backwards, which is how it tends to appear on exams.",
  viz:viz.slider((p,c)=>({note:"Same pressure and temperature. Drag the molar mass: heavier molecules are slower but each one hits harder, so the pressure stays the same.",label:"Molar mass",unit:"g/mol",min:2,max:80,step:1,value:Math.round(c.M),
    bars:[{label:"rms speed (full bar = hydrogen, 2 g/mol)",segs:[{cls:"seg-ke",frac:x=>Math.sqrt(2/x)}]}],
    read:x=>`${VRMS} = <b>${fmt(Math.sqrt(3*C.R*p.T/(x/1000)))} m/s</b>, density <b>${fmt(c.P*x/1000/(C.R*p.T))} kg/m³</b>`})),
  scene:{still:1,draw(K,t,p){box(K,140,30,240,170,{});gas(K,140,30,240,170,t,{n:24,v:110,r:4,seed:21});
    for(let i=0;i<6;i++){const y=50+i*26,ph=mod(t*1.3+i*0.37,1);if(ph<0.18){K.circle(374-12*Math.sin(Math.PI*ph/0.18),y,4,{fill:"heat",c:false});K.arc(380,y,10,-1,1,{c:"heat",w:2,alpha:1-ph/0.18});}}
    K.text("each hit pushes the wall",396,110,{size:11,c:"heat",align:"left"});K.tag(`${p.pk} kPa`,260,212,{size:11});}}
}

]);
function sq(x){return `${x}<sup>2</sup>`;}
})();
