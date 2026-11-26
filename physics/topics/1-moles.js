/* Moles & atoms: amount of substance, molar mass and Avogadro's number.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,EQ,CALC,IMPLIES,AND,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,tri,rnd,gas,box,loopFade}=draw;

/* symbols used below */
const NN=mi("n"),MM=mi("m"),MOL=mi("M"),NUM=mi("N"),NA=sb(mi("N"),"A"),PP=mi("p"),VV=mi("V"),TT=mi("T"),RR=mi("R");
const ELEMENTS={Ni:["nickel",58.693],Cu:["copper",63.546],Fe:["iron",55.845],Al:["aluminium",26.982],Au:["gold",196.97],Ag:["silver",107.87],Zn:["zinc",65.38]};
const GASES={He:["helium",4.0,1],Ne:["neon",20.2,1],Ar:["argon",39.9,1],N2:["nitrogen",28.0,2],O2:["oxygen",32.0,2],CO2:["carbon dioxide",44.0,3]};
const gform=k=>k.replace(/(\d)/g,d=>"₀₁₂₃₄₅₆₇₈₉"[d]);
const one=m=>m%1?String(m):m.toFixed(1);
const TERMS={
  mole:["Mole","A counting unit, like a dozen but far bigger: one mole is 6.022 × 10²³ particles. That number is Avogadro's number, N_A."],
  molar:["Molar mass","The mass of one mole of a substance, in grams per mole (g/mol). For an element it's the number on the periodic table."],
  ideal:["Ideal gas","A gas whose molecules are tiny and don't pull on each other. Real gases behave like this when they're not too cold or too squashed, so pV = nRT works for them."]
};
const NA_GIVEN={k:"NA",sym:NA,name:"Avogadro's number",unit:"1/mol",val:C.NA,why:"Not in the question: the number of particles in one mole. You're expected to know it. You can type it as 6.022e23.",look:"Not in the question: how many particles are in one mole?"};
const R_GIVEN={k:"R",sym:RR,name:"gas constant",unit:"J/(mol·K)",val:C.R,why:"Not in the question: a constant you're expected to know.",look:"Not in the question: the gas constant in pV = nRT."};

PHYS.add("Moles & atoms",[

/* ===== Moles and atoms in a sample (HW 4, task 4) ===== */
{
  id:"mol-sample", level:"Easy", title:"Atoms in a metal sample", hw:"HW 4, task 4",
  base:{el:"Ni",m:3.0},
  random:()=>({el:pick(Object.keys(ELEMENTS)),m:pick([2,3,5,8,10,12.5,20,25,50])}),
  calc:p=>{const M=ELEMENTS[p.el][1],n=p.m/M;return {M,n,N:n*C.NA};},
  text:(p,G,T)=>{const [name,M]=ELEMENTS[p.el];return `${name[0].toUpperCase()+name.slice(1)} (${p.el}) has a ${T("molar","molar mass")} of ${G("M",`${M} g/mol`)}. Calculate (a) the number of ${T("mole","moles")} in a ${G("m",`${one(p.m)} g`)} sample of pure ${name} and (b) the number of atoms in it.`;},
  terms:{molar:TERMS.molar,mole:TERMS.mole},
  given:p=>[
    {k:"m",sym:MM,name:"mass of the sample",unit:"g",val:p.m,why:"Keep it in grams: the molar mass is in grams per mole too.",look:"The number measured in g."},
    {k:"M",sym:MOL,name:"molar mass",unit:"g/mol",val:ELEMENTS[p.el][1],why:"The mass of one mole of this metal.",look:"The number measured in g/mol."},
    NA_GIVEN
  ],
  find:[{sym:NN,name:"number of moles",unit:"mol",why:"Part (a)."},{sym:NUM,name:"number of atoms",unit:"",why:"Part (b). A huge number, so write it with a power of ten."}],
  parts:[
    {id:"n",label:"(a) Number of moles",sym:NN,unit:"mol",ans:(p,c)=>c.n,traps:(p,c)=>clean([[c.M/p.m,"Upside down: n = m ÷ M, with the mass on top."],[p.m*c.M,"Divide the mass by the molar mass, don't multiply."],[p.m/1000/c.M,"No need to change grams to kilograms here: the molar mass is in g/mol, so grams ÷ (g/mol) gives moles directly."]],c.n)},
    {id:"N",label:"(b) Number of atoms",sym:NUM,unit:"",ans:(p,c)=>c.N,traps:(p,c)=>clean([[c.n/C.NA,"Multiply by Avogadro's number, don't divide: N = n × N_A."],[p.m*C.NA,"Use the number of moles from (a), not the mass: N = n × N_A."],[C.NA,"That's how many atoms are in one whole mole. Multiply it by your n."],[c.N/1000,"Keep the mass in grams. Grams ÷ (g/mol) already gives moles."]],c.N)}
  ],
  idea:()=>`<p>A mole is just a (very big) number of particles, like a dozen means 12. One mole of anything is 6.022 × 10²³ particles.</p>
    <p>(a) The molar mass tells you how many grams one mole weighs. So the number of moles is <b>how many grams you have ÷ how many grams one mole weighs</b>.</p>
    <p>(b) Each mole holds N_A atoms, so multiply the number of moles by N_A.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${NN}${OP("=")}${FR(MM,MOL)}${AND}${NUM}${OP("=")}${NN}${OP("·")}${NA}`)+
    legend([[NN,"number of moles","mol"],[MM,"mass of the sample","g"],[MOL,"molar mass","g/mol"],[NUM,"number of atoms",""],[NA,"Avogadro's number, 6.022 × 10²³","1/mol"]],"Grams ÷ (grams per mole) = moles. The units tell you which way round to divide."),
  plug:(p,c)=>EQ(`${NN}${OP("=")}${FR(one(p.m),c.M)}${AND}${NUM}${OP("=")}${NN}${OP("×")}6.022${OP("×")}10<sup>23</sup>`)+calcTip(`${p.m}/${c.M}`,` For (b), type <code>${p.m}/${c.M}*6.022e23</code>: the box reads e23 as × 10²³.`),
  solution:(p,c)=>steps([
      ["(a) Grams ÷ grams per mole",CALC(`${NN} = ${one(p.m)} ÷ ${c.M} = <b>${fmt(c.n)} mol</b>`)],
      ["(b) Moles × atoms per mole",CALC(`${NUM} = ${fmt(c.n)} × 6.022 × 10²³ = <b>${fmt(c.N)} atoms</b>`)]
    ])+checkline(`Sense check: ${one(p.m)} g is ${fmt(p.m/c.M)} of the ${c.M} g that one mole weighs, so you get ${fmt(c.n)} of a mole's worth of atoms ✓`)+
    finalAns(`${NN} = ${fmt(c.n)} mol, &nbsp;${NUM} = ${fmt(c.N)}`),
  sheet:[{name:"Moles from mass",eq:`${NN}${OP("=")}${FR(MM,MOL)}`,note:"m in g and M in g/mol."},{name:"Number of particles",eq:`${NUM}${OP("=")}${NN}${NA}`,note:"N_A = 6.022 × 10²³ per mole."}],
  takeEq:()=>`${NN}${OP("=")}${FR(MM,MOL)},${OP("")}${NUM}${OP("=")}${NN}${NA}`,
  takeaway:"Moles = mass ÷ molar mass (both in grams). Particles = moles × 6.022 × 10²³.",
  link:"This is HW 4, task 4 (3.0 g of nickel, 58.693 g/mol). The first numbers on this page are exactly those.",
  viz:viz.slider((p,c)=>({note:"Drag the mass of the sample. Twice the grams means twice the moles and twice the atoms.",label:"Mass of the sample",unit:"g",min:0.5,max:Math.max(10,2*p.m),step:0.5,value:p.m,
    bars:[{label:"Number of moles (full bar = the biggest sample)",segs:[{cls:"seg-ke",frac:x=>x/Math.max(10,2*p.m)}]}],
    read:x=>`${NN} = ${fmt(x)} ÷ ${c.M} = <b>${fmt(x/c.M)} mol</b>, that's <b>${fmt(x/c.M*C.NA)}</b> atoms`})),
  scene:{still:1,draw(K,t,p){const name=ELEMENTS[p.el][0];
    K.poly([[70,150],[130,150],[150,130],[90,130]],{fill:"rule",c:"ink",w:1.6,close:true});K.rect(70,150,60,40,{fill:"blueSoft",c:"ink",w:1.6});K.poly([[130,150],[150,130],[150,170],[130,190]],{fill:"rule",c:"ink",w:1.6,close:true,alpha:0.8});
    K.tag(`${one(p.m)} g of ${name}`,110,206,{size:11});
    K.line(148,150,300,58,{c:"ink2",w:1.2,dash:[4,4]});K.line(148,170,300,190,{c:"ink2",w:1.2,dash:[4,4]});
    K.circle(410,124,96,{fill:"card",c:"ink",w:2.4});
    for(let i=0;i<7;i++)for(let j=0;j<7;j++){const x=350+i*20,y=64+j*20;if(Math.hypot(x-410,y-124)>86)continue;
      K.circle(x+2.2*Math.sin(t*9+i*1.7+j),y+2.2*Math.cos(t*8+j*2.1+i),7,{fill:"blue",c:false,alpha:0.85});}
    K.tag("each dot = one atom",530,30,{size:11});}}
},

/* ===== How much gas is in a container ===== */
{
  id:"mol-gas", level:"Medium", title:"How much gas is in there?", hw:"Course topic: ideal gas, moles and molecules",
  base:{gas:"He",V:5,tC:20,pk:120},
  random:()=>({gas:pick(Object.keys(GASES)),V:pick([2,4,5,8,10,20,25,50]),tC:pick([0,10,15,20,25,30,37,50]),pk:pick([100,110,120,150,180,200,250,300])}),
  calc:p=>{const M=GASES[p.gas][1],T=toK(p.tC),P=p.pk*1000,V=p.V/1000,n=P*V/(C.R*T);return {M,T,P,V,n,N:n*C.NA,m:n*M};},
  text:(p,G,T)=>{const [name,M,at]=GASES[p.gas];return `A sealed container holds ${G("V",`${p.V} L`)} of ${name} gas (${gform(p.gas)}, ${T("molar","molar mass")} ${G("M",`${M} g/mol`)}) at ${G("T",`${p.tC} °C`)} and a pressure of ${G("p",`${p.pk} kPa`)}. Treat it as an ${T("ideal","ideal gas")}. Find (a) the amount of gas in ${T("mole","moles")}, (b) the number of ${at===1?"atoms":"molecules"} in the container, and (c) the mass of the gas, in grams.`;},
  terms:{molar:TERMS.molar,mole:TERMS.mole,ideal:TERMS.ideal},
  given:p=>[
    {k:"p",sym:PP,name:"pressure",unit:"Pa",val:p.pk*1000,why:`pV = nRT needs pascals: ${p.pk} kPa = ${fmt(p.pk*1000)} Pa.`,look:`The pressure is in kPa. Multiply by 1000 to get Pa.`,gtraps:[[p.pk,`${p.pk} is in kPa. Multiply by 1000 to get pascals.`]]},
    {k:"V",sym:VV,name:"volume",unit:"m³",val:p.V/1000,why:`pV = nRT needs cubic metres: 1 L = 0.001 m³, so ${p.V} L = ${p.V/1000} m³.`,look:"The volume is in litres. Divide by 1000 to get m³.",gtraps:[[p.V,`${p.V} is in litres. Divide by 1000 to get m³.`]]},
    {k:"T",sym:TT,name:"temperature",unit:"K",val:toK(p.tC),why:`Gas formulas always use kelvin: add 273.15 to the °C.`,look:"The temperature is in °C. Add 273.15 to get kelvin.",gtraps:[[p.tC,`${p.tC} is in °C. Gas formulas need kelvin: add 273.15.`]]},
    {k:"M",sym:MOL,name:"molar mass",unit:"g/mol",val:GASES[p.gas][1],why:"For part (c).",look:"The number measured in g/mol."},
    R_GIVEN,NA_GIVEN
  ],
  find:p=>[{sym:NN,name:"amount of gas",unit:"mol",why:"Part (a)."},{sym:NUM,name:`number of ${GASES[p.gas][2]===1?"atoms":"molecules"}`,unit:"",why:"Part (b)."},{sym:MM,name:"mass of the gas",unit:"g",why:"Part (c)."}],
  parts:[
    {id:"n",label:"(a) Amount of gas",sym:NN,unit:"mol",ans:(p,c)=>c.n,traps:(p,c)=>clean([[c.n*1000,"The volume must be in m³, not litres: 1 L = 0.001 m³."],[c.n/1000,"The pressure must be in pascals, not kPa: multiply by 1000."],[c.P*c.V/(C.R*p.tC),"The temperature must be in kelvin: add 273.15 to the °C."],[C.R*c.T/(c.P*c.V),"Upside down: n = pV ÷ (RT)."]],c.n)},
    {id:"N",label:p=>`(b) Number of ${GASES[p.gas][2]===1?"atoms":"molecules"}`,sym:NUM,unit:"",ans:(p,c)=>c.N,traps:(p,c)=>clean([[c.n/C.NA,"Multiply by Avogadro's number, don't divide: N = n × N_A."],[C.NA,"That's one mole's worth. Multiply it by your n."],[c.N*1000,"Check part (a): the volume must be in m³."]],c.N)},
    {id:"m",label:"(c) Mass of the gas",sym:MM,unit:"g",ans:(p,c)=>c.m,traps:(p,c)=>clean([[c.n/c.M,"Multiply the moles by the molar mass, don't divide: m = n × M."],[c.m/1000,"The question wants grams. With M in g/mol, n × M already gives grams."],[c.M,"That's the mass of one mole. Multiply by your n."]],c.m)}
  ],
  idea:p=>`<p>The ideal gas law links the four things that describe a gas: pressure, volume, temperature and how much gas there is (in moles):</p>
    <p style="text-align:center"><b>pV = nRT</b></p>
    <p>(a) You know p, V and T, so solve it for n. <b>Units first:</b> the law only works with pascals, cubic metres and kelvin.</p>
    <p>(b) Moles × Avogadro's number gives the number of particles. (c) Moles × molar mass gives the mass.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${PP}${VV}${OP("=")}${NN}${RR}${TT}${IMPLIES}${NN}${OP("=")}${FR(`${PP}${VV}`,`${RR}${TT}`)}`)+EQ(`${NUM}${OP("=")}${NN}${NA}${AND}${MM}${OP("=")}${NN}${MOL}`)+
    legend([[PP,"pressure","Pa"],[VV,"volume","m³"],[TT,"temperature (kelvin!)","K"],[RR,"gas constant, 8.314","J/(mol·K)"],[NN,"amount of gas","mol"],[MOL,"molar mass","g/mol"]],"1 kPa = 1000 Pa. 1 L = 0.001 m³. T(K) = t(°C) + 273.15."),
  plug:(p,c)=>EQ(`${NN}${OP("=")}${FR(`${fmt(c.P)}${OP("×")}${c.V}`,`8.314${OP("×")}${fmt(c.T)}`)}`)+EQ(`${NUM}${OP("=")}${NN}${OP("×")}6.022${OP("×")}10<sup>23</sup>${AND}${MM}${OP("=")}${NN}${OP("×")}${c.M}`)+calcTip(`${c.P}*${c.V}/(8.314*${R3(c.T)})`),
  solution:(p,c)=>steps([
      ["Units first",`${PP} = ${p.pk} kPa = ${fmt(c.P)} Pa, &nbsp;${VV} = ${p.V} L = ${c.V} m³, &nbsp;${TT} = ${p.tC} + 273.15 = ${fmt(c.T)} K`],
      ["(a) Solve pV = nRT for n",CALC(`${NN} = ${fmt(c.P)} × ${c.V} ÷ (8.314 × ${fmt(c.T)}) = <b>${fmt(c.n)} mol</b>`)],
      ["(b) Moles × Avogadro's number",CALC(`${NUM} = ${fmt(c.n)} × 6.022 × 10²³ = <b>${fmt(c.N)}</b>`)],
      ["(c) Moles × molar mass",CALC(`${MM} = ${fmt(c.n)} × ${c.M} = <b>${fmt(c.m)} g</b>`)]
    ])+checkline(`Put it back: nRT ÷ V = ${fmt(c.n)} × 8.314 × ${fmt(c.T)} ÷ ${c.V} = ${fmt(c.n*C.R*c.T/c.V)} Pa, the pressure we started with ✓`)+
    finalAns(`${NN} = ${fmt(c.n)} mol, &nbsp;${NUM} = ${fmt(c.N)}, &nbsp;${MM} = ${fmt(c.m)} g`),
  sheet:[{name:"Ideal gas law",eq:`${PP}${VV}${OP("=")}${NN}${RR}${TT}`,note:"Pa, m³, K. R = 8.314 J/(mol·K)."},{name:"Mass from moles",eq:`${MM}${OP("=")}${NN}${MOL}`,note:"With M in g/mol you get grams."}],
  takeEq:()=>`${NN}${OP("=")}${FR(`${PP}${VV}`,`${RR}${TT}`)}`,
  takeaway:"Convert to Pa, m³ and K first, then n = pV ÷ RT. Moles × N_A gives particles, moles × M gives mass.",
  link:"HW 4, task 4 counts the atoms in a solid; this does the same for a gas, where the moles come from pV = nRT instead of from the mass.",
  viz:viz.slider((p,c)=>({note:"Same container, same pressure. Drag the temperature: hotter molecules hit harder, so fewer of them are needed to make the same pressure.",label:"Temperature",unit:"°C",min:-50,max:200,step:5,value:p.tC,
    bars:[{label:"Amount of gas (full bar = at −50 °C)",segs:[{cls:"seg-ke",frac:x=>toK(-50)/toK(x)}]}],
    read:x=>`${NN} = ${fmt(c.P)} × ${c.V} ÷ (8.314 × ${fmt(toK(x))}) = <b>${fmt(c.P*c.V/(C.R*toK(x)))} mol</b>`})),
  scene:{still:1,draw(K,t,p){box(K,170,30,260,160,{fill:"card"});gas(K,170,30,260,160,t,{n:30,v:70,r:4.5,seed:3});
    K.tag(`V = ${p.V} L`,300,206,{size:11});K.tag(`${p.tC} °C`,470,60,{size:11});K.tag(`${p.pk} kPa`,470,96,{size:11});K.text(GASES[p.gas][0],130,110,{c:"ink2",size:12,align:"right"});}}
}

]);
})();
