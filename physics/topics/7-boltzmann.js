/* Boltzmann distribution & the barometric formula: how molecules thin out with height.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,SQ,EQ,CALC,IMPLIES,AND,PAREN,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,tri,rnd,loopFade}=draw;

/* symbols used below */
const g=C.g,PP=mi("p"),P0=sb(mi("p"),"0"),MOL=mi("M"),G9=mi("g"),HH=mi("h"),RR=mi("R"),TT=mi("T"),HS=mi("H"),KB=mi("k"),NN=mi("n"),N0=sb(mi("n"),"0"),M0=sb(mi("m"),"0"),EE=mi("e"),H12=sb(mi("h"),"½");
const MAIR=0.029;
const GASES={O2:["oxygen",32.0],CO2:["carbon dioxide",44.0],Ar:["argon",39.9],He:["helium",4.0],N2:["nitrogen",28.0]};
const gform=k=>k.replace(/(\d)/g,d=>"₀₁₂₃₄₅₆₇₈₉"[d]);
const ex=x=>`${EE}<sup>${x}</sup>`;
const TERMS={
  iso:["Isothermal atmosphere","A simple model of the air where the temperature is the same at every height. Real air gets colder as you go up, but this model is close enough for a first estimate."],
  baro:["Barometric formula","How air pressure falls with height: p = p₀e^(−Mgh/RT). It drops by the same fraction for every extra metre you climb."],
  boltz:["Boltzmann distribution","In a gas at temperature T, the number of molecules with extra energy E is smaller by a factor e^(−E/kT). In gravity, E = m₀gh, so heavier molecules thin out faster with height."]
};
const R_GIVEN={k:"R",sym:RR,name:"gas constant",unit:"J/(mol·K)",val:C.R,why:"Not in the question: a constant you're expected to know.",look:"Not in the question: the gas constant."};
const G_GIVEN={k:"g",sym:G9,name:"acceleration due to gravity",unit:"m/s²",val:g,why:"Not in the question: you're expected to know it.",look:"Not in the question: g."};

PHYS.add("Boltzmann & barometric formula",[

/* ===== Air pressure on a mountain ===== */
{
  id:"bz-mountain", level:"Medium", title:"Air pressure on a mountain", hw:"Course topic: the barometric formula",
  base:{h:5000,T:273},
  random:()=>({h:pick([1000,1500,2000,3000,4000,5000,6000,8848]),T:pick([250,260,273,280,290,300])}),
  calc:p=>{const H=C.R*p.T/(MAIR*g),f=Math.exp(-p.h/H);return {H,f,pct:100*f,pk:101.3*f};},
  text:(p,G,T)=>`A climber is ${G("h",`${fmt(p.h)} m`)} above sea level. Treat the air as an ${T("iso","isothermal atmosphere")} at ${G("T",`${p.T} K`)}, with a molar mass of ${G("M","29 g/mol")}. At sea level the pressure is ${G("p0","101.3 kPa")}. Using the ${T("baro","barometric formula")}, find (a) the height H = RT/(Mg) over which the pressure falls by a factor of e (the “scale height”), (b) the pressure at the climber's height as a percentage of the sea-level pressure, and (c) that pressure in kPa.`,
  terms:{iso:TERMS.iso,baro:TERMS.baro},
  given:p=>[
    {k:"h",sym:HH,name:"height above sea level",unit:"m",val:p.h,why:"",look:"The height in m."},
    {k:"T",sym:TT,name:"temperature of the air",unit:"K",val:p.T,why:"The same at every height in this model.",look:"The temperature in K."},
    {k:"M",sym:MOL,name:"molar mass of air",unit:"kg/mol",val:MAIR,why:"29 g/mol = 0.029 kg/mol.",look:"The molar mass of air in kg/mol (÷ 1000).",gtraps:[[29,"That's in g/mol. Divide by 1000 to get kg/mol."]]},
    {k:"p0",sym:P0,name:"pressure at sea level",unit:"kPa",val:101.3,why:"",look:"The sea-level pressure in kPa."},
    R_GIVEN,G_GIVEN
  ],
  find:[{sym:HS,name:"scale height",unit:"m",why:"Part (a)."},{sym:`${PP}/${P0}`,name:"pressure as a percentage of sea level",unit:"%",why:"Part (b)."},{sym:PP,name:"pressure at the climber",unit:"kPa",why:"Part (c)."}],
  parts:[
    {id:"H",label:"(a) Scale height",sym:HS,unit:"m",ans:(p,c)=>c.H,traps:(p,c)=>clean([[C.R*p.T/(29*g),"The molar mass must be in kg/mol: 0.029."],[MAIR*g/(C.R*p.T),"Upside down: H = RT ÷ (Mg)."],[C.R*p.T/MAIR,"Divide by g too: H = RT ÷ (Mg)."]],c.H)},
    {id:"pct",label:"(b) Pressure as a percentage of sea level",sym:`${PP}/${P0}`,unit:"%",ans:(p,c)=>c.pct,traps:(p,c)=>clean([[100*(1-p.h/c.H),"Pressure doesn't fall in a straight line. It falls exponentially: p/p₀ = e^(−h/H)."],[c.f,"Give it as a percentage: multiply by 100."],[100*Math.exp(p.h/c.H),"The exponent is negative: the pressure gets smaller as you go up."],[100-c.pct,"That's how much has been lost. The question asks for what's left."]],c.pct)},
    {id:"pk",label:"(c) Pressure at the climber",sym:PP,unit:"kPa",ans:(p,c)=>c.pk,traps:(p,c)=>clean([[101.3*(1-p.h/c.H),"Use the exponential: p = p₀e^(−h/H)."],[101.3-c.pk,"That's how much the pressure dropped. The question asks for the pressure itself."],[c.pk*1000,"That's in Pa. The box wants kPa."]],c.pk)}
  ],
  idea:()=>`<p>Air is squashed by the weight of the air above it, so it's densest at the bottom. Going up, every metre the pressure drops by the <b>same fraction</b> (not the same amount). That's exponential decay:</p>
    <p style="text-align:center"><b>p = p₀ e<sup>−Mgh/RT</sup></b></p>
    <p>The combination H = RT ÷ (Mg) is a height: climb H metres and the pressure falls by a factor of e ≈ 2.72. Then p/p₀ = e^(−h/H).</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${PP}${OP("=")}${P0}${ex(`−${MOL}${G9}${HH}/${RR}${TT}`)}${OP("=")}${P0}${ex(`−${HH}/${HS}`)}${AND}${HS}${OP("=")}${FR(`${RR}${TT}`,`${MOL}${G9}`)}`)+
    legend([[P0,"pressure at height 0","kPa"],[MOL,"molar mass of air","kg/mol"],[HH,"height","m"],[HS,"scale height","m"],[TT,"temperature","K"]],"e^x is the e^x button on your calculator (often shift + ln)."),
  plug:(p,c)=>EQ(`${HS}${OP("=")}${FR(`8.314${OP("×")}${p.T}`,`0.029${OP("×")}9.8`)}${AND}${FR(PP,P0)}${OP("=")}${ex(`−${fmt(p.h)}/${HS}`)}`)+calcTip(`100*exp(-0.029*9.8*${p.h}/(8.314*${p.T}))`," That gives the percentage."),
  solution:(p,c)=>steps([
      ["(a) Scale height",CALC(`${HS} = 8.314 × ${p.T} ÷ (0.029 × 9.8) = <b>${fmt(c.H)} m</b>`)],
      ["(b) Barometric formula",CALC(`${PP}/${P0} = e^(−${fmt(p.h)} ÷ ${fmt(c.H)}) = e^(−${fmt(p.h/c.H)}) = ${fmt(c.f)} = <b>${fmt(c.pct)} %</b>`)],
      ["(c) In kPa",CALC(`${PP} = 101.3 × ${fmt(c.f)} = <b>${fmt(c.pk)} kPa</b>`)]
    ])+checkline(`Sense check: at ${fmt(c.H)} m the pressure would be 101.3 ÷ e = ${fmt(101.3/Math.E)} kPa. ${p.h<c.H?"The climber is lower than that, so the pressure is higher":"The climber is above that, so the pressure is lower"} ✓`)+
    finalAns(`${HS} = ${fmt(c.H)} m, &nbsp;${fmt(c.pct)} %, &nbsp;${PP} = ${fmt(c.pk)} kPa`),
  sheet:[{name:"Barometric formula",eq:`${PP}${OP("=")}${P0}${ex(`−${MOL}${G9}${HH}/${RR}${TT}`)}`,note:"Isothermal air. M of air = 0.029 kg/mol."}],
  takeEq:()=>`${PP}${OP("=")}${P0}${ex(`−${MOL}${G9}${HH}/${RR}${TT}`)}`,
  takeaway:"Pressure falls exponentially with height: p = p₀e^(−Mgh/RT). Over each scale height RT/(Mg) it drops by a factor of e.",
  link:"Your course list: “Boltzmann distribution, the barometric formula”. The barometric formula is the Boltzmann distribution for molecules in gravity.",
  viz:viz.slider((p,c)=>({note:"Drag the height. The pressure falls fast at first and then more slowly, because each metre takes the same fraction of what's left.",label:"Height",unit:"m",min:0,max:20000,step:100,value:p.h,
    bars:[{label:"Pressure (full bar = sea level)",segs:[{cls:"seg-ke",frac:x=>Math.exp(-x/c.H)}]}],
    read:x=>`${PP} = 101.3 × e^(−${fmt(x)} ÷ ${fmt(c.H)}) = <b>${fmt(101.3*Math.exp(-x/c.H))} kPa</b>`})),
  scene:{still:1,draw(K,t,p){const base=206;K.rect(0,0,600,base,{fill:"blueSoft",c:false,alpha:0.35});
    for(let i=0;i<120;i++){const y=base-180*(-Math.log(1-rnd(i,7)*0.95)/3.2),x=mod(rnd(i,8)*600+10*Math.sin(t*0.8+i),600);if(y>6&&y<base)K.circle(x,y+2*Math.sin(t*2+i),2.4,{fill:"blue",c:false,alpha:0.7});}
    K.poly([[60,base],[250,40],[330,90],[400,60],[540,base]],{fill:"rule",c:"ink",w:2,close:true});K.poly([[220,74],[250,40],[278,74]],{fill:"card",c:false,close:true});
    K.person(250,40,{s:0.45,c:"heat"});K.vdim(565,40,base,`${fmt(p.h)} m`);K.text("air molecules thin out with height",20,20,{size:11,c:"ink2",align:"left"});}}
},

/* ===== Where the pressure halves, and the Boltzmann factor ===== */
{
  id:"bz-half", level:"Hard", title:"Heavy molecules thin out faster", hw:"Course topic: the Boltzmann distribution",
  base:{gas:"O2",T:280},
  random:()=>({gas:pick(Object.keys(GASES).filter(k=>k!=="N2").concat(["O2"])),T:pick([250,260,270,280,290,300])}),
  calc:p=>{const Mg=GASES[p.gas][1]/1000,h=C.R*p.T*Math.log(2)/(MAIR*g),f=Math.exp(-Mg*g*h/(C.R*p.T)),m0=Mg/C.NA;return {Mg,h,f,pct:100*f,E:m0*g*h,ratio:m0*g*h/(C.k*p.T)};},
  text:(p,G,T)=>`Treat the atmosphere as ${T("iso","isothermal")} at ${G("T",`${p.T} K`)}. Air has a molar mass of ${G("Ma","29 g/mol")}, and ${GASES[p.gas][0]} (${gform(p.gas)}) has ${G("Mg",`${GASES[p.gas][1]} g/mol`)}. (a) At what height is the air pressure half of its sea-level value? (b) By the ${T("boltz","Boltzmann distribution")}, how many ${GASES[p.gas][0]} molecules are there per m³ at that height, as a percentage of the number at sea level? (c) What is the potential energy m₀gh of one ${GASES[p.gas][0]} molecule at that height, and (d) how many times kT is it?`,
  terms:{iso:TERMS.iso,boltz:TERMS.boltz},
  given:p=>[
    {k:"T",sym:TT,name:"temperature",unit:"K",val:p.T,why:"",look:"The temperature in K."},
    {k:"Ma",sym:sb(mi("M"),"air"),name:"molar mass of air",unit:"kg/mol",val:MAIR,why:"In kg/mol: 0.029.",look:"Air's molar mass in kg/mol.",gtraps:[[29,"That's in g/mol. Divide by 1000."]]},
    {k:"Mg",sym:sb(mi("M"),"gas"),name:`molar mass of ${GASES[p.gas][0]}`,unit:"kg/mol",val:GASES[p.gas][1]/1000,why:"In kg/mol (÷ 1000).",look:`${GASES[p.gas][0][0].toUpperCase()+GASES[p.gas][0].slice(1)}'s molar mass in kg/mol.`,gtraps:[[GASES[p.gas][1],"That's in g/mol. Divide by 1000."]]},
    R_GIVEN,G_GIVEN,
    {k:"kB",sym:KB,name:"Boltzmann constant",unit:"J/K",val:C.k,why:"Not in the question: R for one molecule. Type 1.38e-23.",look:"Not in the question: the Boltzmann constant."},
    {k:"NA",sym:sb(mi("N"),"A"),name:"Avogadro's number",unit:"1/mol",val:C.NA,why:"Not in the question: to get the mass of one molecule, m₀ = M ÷ N_A.",look:"Not in the question: particles per mole."}
  ],
  find:p=>[{sym:H12,name:"height where the pressure halves",unit:"m",why:"Part (a)."},{sym:`${NN}/${N0}`,name:`${GASES[p.gas][0]} remaining there`,unit:"%",why:"Part (b)."},{sym:sb(mi("E"),"p"),name:"potential energy of one molecule",unit:"J",why:"Part (c)."},{sym:`${sb(mi("E"),"p")}/${KB}${TT}`,name:"in units of kT",unit:"",why:"Part (d). No unit."}],
  parts:[
    {id:"h",label:"(a) Height where the pressure halves",sym:H12,unit:"m",ans:(p,c)=>c.h,traps:(p,c)=>clean([[C.R*p.T/(MAIR*g),"That's where it falls by a factor of e. For half, multiply by ln 2."],[C.R*p.T*Math.log10(2)/(MAIR*g),"Use ln 2 (natural log), not log 2."],[C.R*p.T/(MAIR*g)/2,"It's ln 2 × RT/(Mg), not half of RT/(Mg)."],[C.R*p.T*Math.log(2)/(c.Mg*g),"Use the molar mass of air for the air pressure."]],c.h)},
    {id:"pct",label:p=>`(b) ${GASES[p.gas][0][0].toUpperCase()+GASES[p.gas][0].slice(1)} left, as a percentage`,sym:`${NN}/${N0}`,unit:"%",ans:(p,c)=>c.pct,traps:(p,c)=>clean([[50,"That's for air as a whole. "+GASES[p.gas][0][0].toUpperCase()+GASES[p.gas][0].slice(1)+" has its own molar mass, so its own exponent: e^(−M_gas·g·h/RT)."],[c.f,"Give it as a percentage: × 100."],[100*Math.exp(-p.T*0+(-MAIR*g*c.h/(C.R*p.T))*(MAIR/c.Mg)),"Upside down: heavier molecules thin out faster, so the mass ratio goes on top."]],c.pct)},
    {id:"E",label:"(c) Potential energy of one molecule",sym:sb(mi("E"),"p"),unit:"J",ans:(p,c)=>c.E,traps:(p,c)=>clean([[c.Mg*g*c.h,"That's for a whole mole. For one molecule, divide by N_A."],[GASES[p.gas][1]*g*c.h/C.NA,"The molar mass must be in kg/mol."]],c.E)},
    {id:"r",label:"(d) Potential energy in units of kT",sym:`${sb(mi("E"),"p")}/${KB}${TT}`,unit:"",ans:(p,c)=>c.ratio,traps:(p,c)=>clean([[1/c.ratio,"Upside down: E ÷ kT."],[Math.exp(-c.ratio),"That's e^(−E/kT), the fraction left. Part (d) asks for E ÷ kT itself."]],c.ratio)}
  ],
  idea:p=>`<p>The <b>Boltzmann distribution</b>: in a gas at temperature T, places where a molecule has extra energy E hold fewer molecules, by a factor e^(−E/kT).</p>
    <p>In gravity, a molecule at height h has extra energy m₀gh. So the number per m³ falls as e^(−m₀gh/kT) = e^(−Mgh/RT). That's the barometric formula, and it works <b>for each gas separately</b>, with its own M.</p>
    <ul class="plain"><li>(a) For the whole air, set e^(−M_air·gh/RT) = ½ and solve for h (take ln of both sides).</li><li>(b) Put that h into ${GASES[p.gas][0]}'s own formula. ${GASES[p.gas][1]>29?"It's heavier than average air, so less than half is left.":"It's lighter than average air, so more than half is left."}</li>
    <li>(c) m₀ = M ÷ N_A. (d) Divide by kT: that's exactly the number in the exponent.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${NN}${OP("=")}${N0}${ex(`−${M0}${G9}${HH}/${KB}${TT}`)}${OP("=")}${N0}${ex(`−${MOL}${G9}${HH}/${RR}${TT}`)}`)+EQ(`${H12}${OP("=")}${FR(`${RR}${TT}${OP("·")}ln${OP("")}2`,`${sb(mi("M"),"air")}${G9}`)}${AND}${M0}${OP("=")}${FR(MOL,sb(mi("N"),"A"))}`)+
    legend([[N0,"molecules per m³ at sea level","1/m³"],[M0,"mass of one molecule","kg"],[KB,"Boltzmann constant","J/K"]],"m₀/k = M/R, so both forms of the exponent are the same number."),
  plug:(p,c)=>EQ(`${H12}${OP("=")}${FR(`8.314${OP("×")}${p.T}${OP("×")}0.693`,`0.029${OP("×")}9.8`)}${AND}${FR(NN,N0)}${OP("=")}${ex(`−${c.Mg}·9.8·${H12}/(8.314·${p.T})`)}`)+calcTip(`8.314*${p.T}*ln(2)/(0.029*9.8)`),
  solution:(p,c)=>steps([
      ["(a) Air pressure halves",CALC(`${H12} = 8.314 × ${p.T} × ln 2 ÷ (0.029 × 9.8) = <b>${fmt(c.h)} m</b>`)],
      ["(b) "+GASES[p.gas][0][0].toUpperCase()+GASES[p.gas][0].slice(1)+"'s own exponent",CALC(`${NN}/${N0} = e^(−${c.Mg} × 9.8 × ${fmt(c.h)} ÷ (8.314 × ${p.T})) = e^(−${fmt(c.ratio)}) = ${fmt(c.f)} = <b>${fmt(c.pct)} %</b>`)],
      ["(c) One molecule",CALC(`${M0} = ${c.Mg} ÷ 6.022 × 10²³ = ${fmt(c.Mg/C.NA)} kg &nbsp;→&nbsp; ${sb(mi("E"),"p")} = ${fmt(c.Mg/C.NA)} × 9.8 × ${fmt(c.h)} = <b>${fmt(c.E)} J</b>`)],
      ["(d) Compare with kT",CALC(`${sb(mi("E"),"p")} ÷ kT = ${fmt(c.E)} ÷ (1.38 × 10⁻²³ × ${p.T}) = <b>${fmt(c.ratio)}</b>`)]
    ])+checkline(`(b) and (d) fit together: e^(−${fmt(c.ratio)}) = ${fmt(c.f)} ✓. A shortcut for (b): the exponent is ln 2 × (M_gas ÷ M_air), so the fraction is (½)^(${GASES[p.gas][1]} ÷ 29) = ${fmt(Math.pow(0.5,GASES[p.gas][1]/29))}.`)+
    finalAns(`${H12} = ${fmt(c.h)} m, &nbsp;${fmt(c.pct)} %, &nbsp;${sb(mi("E"),"p")} = ${fmt(c.E)} J, &nbsp;${fmt(c.ratio)} kT`),
  sheet:[{name:"Boltzmann distribution in gravity",eq:`${NN}${OP("=")}${N0}${ex(`−${M0}${G9}${HH}/${KB}${TT}`)}`,note:"Each gas thins out with its own mass. e^(−E/kT) in general."},{name:"Half-pressure height",eq:`${H12}${OP("=")}${FR(`${RR}${TT}${OP("·")}ln${OP("")}2`,`${MOL}${G9}`)}`,note:"ln 2 ≈ 0.693."}],
  takeEq:()=>`${NN}${OP("=")}${N0}${ex(`−${M0}${G9}${HH}/${KB}${TT}`)}`,
  takeaway:"Boltzmann: the number of molecules falls as e^(−E/kT). In gravity E = m₀gh, so heavier molecules thin out faster with height.",
  link:"Your course list: “Boltzmann distribution, the barometric formula”. This connects the two: the barometric formula is the Boltzmann factor with E = m₀gh.",
  viz:viz.slider((p,c)=>({note:"Drag the height. Helium (light) hardly thins out; carbon dioxide (heavy) thins out fastest. Your gas is the middle bar.",label:"Height",unit:"m",min:0,max:20000,step:200,value:Math.round(c.h/200)*200,
    bars:[{label:"Helium, 4 g/mol",segs:[{cls:"seg-ke",frac:x=>Math.exp(-0.004*g*x/(C.R*p.T))}]},{label:`${GASES[p.gas][0]}, ${GASES[p.gas][1]} g/mol`,segs:[{cls:"seg-heat",frac:x=>Math.exp(-c.Mg*g*x/(C.R*p.T))}]},{label:"Carbon dioxide, 44 g/mol",segs:[{cls:"seg-alt",frac:x=>Math.exp(-0.044*g*x/(C.R*p.T))}]}],
    read:x=>`${GASES[p.gas][0][0].toUpperCase()+GASES[p.gas][0].slice(1)} at ${fmt(x)} m: <b>${fmt(100*Math.exp(-c.Mg*g*x/(C.R*p.T)))} %</b> of its sea-level number`})),
  scene:{still:1,draw(K,t,p){const base=200;K.line(40,base,560,base,{w:2});K.text("ground",300,base+12,{size:11,c:"ink2"});
    const light=GASES[p.gas][1]<29;
    for(let i=0;i<70;i++){const y=base-170*(-Math.log(1-rnd(i,3)*0.95)/2.6),x=60+mod(rnd(i,4)*230+8*Math.sin(t+i),230);if(y>14)K.circle(x,y+2*Math.sin(t*2+i),3,{fill:"blue",c:false,alpha:0.7});}
    const k=light?1.3:4.2;for(let i=0;i<70;i++){const y=base-170*(-Math.log(1-rnd(i,13)*0.95)/k),x=310+mod(rnd(i,14)*230+8*Math.sin(t+i),230);if(y>14)K.circle(x,y+2*Math.sin(t*2+i),3,{fill:"heat",c:false,alpha:0.75});}
    K.text("air",175,22,{size:12,c:"blue"});K.text(GASES[p.gas][0],425,22,{size:12,c:"heat"});K.line(300,30,300,base,{c:"rule",w:1,dash:[4,4]});}}
}

]);
})();
