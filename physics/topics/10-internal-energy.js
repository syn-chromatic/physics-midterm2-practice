/* Internal energy: degrees of freedom, equipartition, and heat capacities of gases.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,EQ,CALC,IMPLIES,AND,PAREN,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,tri,rnd,box,flame,loopFade}=draw;

/* symbols used below */
const UU=mi("U"),NN=mi("n"),II=mi("i"),RR=mi("R"),TT=mi("T"),KB=mi("k"),DT=up("Δ")+mi("T"),QQ=mi("Q"),CV=sb(mi("C"),"V"),CP=sb(mi("C"),"p"),GAM=mi("γ"),EM=`⟨${mi("E")}⟩`;
/* name, formula, degrees of freedom */
const MONO={He:["helium","He"],Ne:["neon","Ne"],Ar:["argon","Ar"]};
const DI={N2:["nitrogen","N₂"],O2:["oxygen","O₂"],H2:["hydrogen","H₂"]};
const ALL={He:["helium","He",3],Ar:["argon","Ar",3],N2:["nitrogen","N₂",5],O2:["oxygen","O₂",5],H2O:["water vapour","H₂O",6],CH4:["methane","CH₄",6]};
const kind=i=>i===3?"one atom":i===5?"two atoms":"three or more atoms, not in a line";
const TERMS={
  dof:["Degrees of freedom","The independent ways a molecule can hold energy. Every molecule can move in 3 directions. A two-atom molecule can also spin about 2 axes (5 in total). A bigger, bent molecule can spin about 3 (6 in total)."],
  equi:["Equipartition","Each degree of freedom holds, on average, ½kT of energy per molecule (½RT per mole)."],
  internal:["Internal energy","The total energy of all the molecules' motion inside the gas: moving and spinning. For an ideal gas it depends only on the temperature."],
  cv:["Molar heat capacity","The heat needed to warm 1 mol of gas by 1 K. It's bigger at constant pressure (C_p) than at constant volume (C_V), because at constant pressure the gas also pushes outward and does work."]
};
const R_GIVEN={k:"R",sym:RR,name:"gas constant",unit:"J/(mol·K)",val:C.R,why:"Not in the question: a constant you're expected to know.",look:"Not in the question: the gas constant."};

PHYS.add("Internal energy",[

/* ===== Internal energy of a one-atom and a two-atom gas ===== */
{
  id:"ie-gases", level:"Easy", title:"Energy stored in a gas", hw:"Course topic: internal energy and degrees of freedom",
  base:{m:"He",d:"N2",n:2,T:300},
  random:()=>({m:pick(Object.keys(MONO)),d:pick(Object.keys(DI)),n:pick([0.5,1,1.5,2,3,4,5]),T:pick([200,250,273,300,350,400,500])}),
  calc:p=>({Um:1.5*p.n*C.R*p.T,Ud:2.5*p.n*C.R*p.T,Em:2.5*C.k*p.T}),
  text:(p,G,T)=>`Two containers each hold ${G("n",`${p.n} mol`)} of gas at ${G("T",`${p.T} K`)}: one holds ${MONO[p.m][0]} (${MONO[p.m][1]}, single atoms), the other ${DI[p.d][0]} (${DI[p.d][1]}, two atoms per molecule). Treat both as ideal gases, using ${T("dof","degrees of freedom")} and ${T("equi","equipartition")}. Find (a) the ${T("internal","internal energy")} of the ${MONO[p.m][0]}, (b) the internal energy of the ${DI[p.d][0]}, and (c) the average energy of one ${DI[p.d][0]} molecule.`,
  terms:{dof:TERMS.dof,equi:TERMS.equi,internal:TERMS.internal},
  given:p=>[
    {k:"n",sym:NN,name:"amount of each gas",unit:"mol",val:p.n,why:"",look:"The number measured in mol."},
    {k:"T",sym:TT,name:"temperature",unit:"K",val:p.T,why:"",look:"The temperature in K."},
    {k:"im",sym:sb(II,"mono"),name:`degrees of freedom of ${MONO[p.m][0]}`,unit:"",val:3,why:"Single atoms can only move in 3 directions: no spinning that counts.",look:"Not in the question: how many ways can a single atom move?"},
    {k:"id",sym:sb(II,"di"),name:`degrees of freedom of ${DI[p.d][0]}`,unit:"",val:5,why:"3 directions of moving + 2 ways of spinning.",look:"Not in the question: a two-atom molecule moves in 3 directions and spins about 2 axes."},
    R_GIVEN,{k:"kB",sym:KB,name:"Boltzmann constant",unit:"J/K",val:C.k,why:"For part (c), one molecule. Type 1.38e-23.",look:"Not in the question: the Boltzmann constant."}
  ],
  find:p=>[{sym:sb(UU,"mono"),name:`internal energy of the ${MONO[p.m][0]}`,unit:"J",why:"Part (a)."},{sym:sb(UU,"di"),name:`internal energy of the ${DI[p.d][0]}`,unit:"J",why:"Part (b)."},{sym:EM,name:"average energy of one molecule",unit:"J",why:"Part (c)."}],
  parts:[
    {id:"Um",label:p=>`(a) Internal energy of the ${MONO[p.m][0]}`,sym:sb(UU,"mono"),unit:"J",ans:(p,c)=>c.Um,traps:(p,c)=>clean([[c.Ud,"That uses 5 degrees of freedom. Single atoms have only 3: U = (3/2)nRT."],[p.n*C.R*p.T,"Use i/2 = 3/2: U = (3/2)nRT."],[3*p.n*C.R*p.T,"Each degree of freedom holds ½RT per mole, so it's 3 × ½ = 3/2."]],c.Um)},
    {id:"Ud",label:p=>`(b) Internal energy of the ${DI[p.d][0]}`,sym:sb(UU,"di"),unit:"J",ans:(p,c)=>c.Ud,traps:(p,c)=>clean([[c.Um,"That's only the moving part (3/2). A two-atom molecule also spins: 5/2."],[3.5*p.n*C.R*p.T,"That's 7/2, which is C_p's number. Internal energy uses i/2 = 5/2."],[3*p.n*C.R*p.T,"Two atoms: 3 + 2 = 5 degrees of freedom, so 5/2."]],c.Ud)},
    {id:"Em",label:"(c) Average energy of one molecule",sym:EM,unit:"J",ans:(p,c)=>c.Em,traps:(p,c)=>clean([[1.5*C.k*p.T,"That's only the moving part. With spinning, a two-atom molecule holds (5/2)kT."],[2.5*C.R*p.T,"That's per mole (with R). For one molecule use k."],[c.Ud/p.n,"That's per mole. Divide by N_A as well, or use (5/2)kT."]],c.Em)}
  ],
  idea:()=>`<p><b>Equipartition</b>: every way a molecule can hold energy (each degree of freedom) gets, on average, ½kT per molecule, or ½RT per mole.</p>
    <ul class="plain"><li>A single atom can move in 3 directions: <b>i = 3</b>.</li><li>A two-atom molecule can also spin about 2 axes (spinning about the line through both atoms doesn't count): <b>i = 5</b>.</li></ul>
    <p>So the internal energy is (i/2)nRT for the whole gas, and (i/2)kT for one molecule.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${UU}${OP("=")}${FR(II,"2")}${NN}${RR}${TT}${AND}${EM}${OP("=")}${FR(II,"2")}${KB}${TT}`)+
    legend([[II,"degrees of freedom: 3 (one atom), 5 (two atoms), 6 (bigger, bent)",""],[UU,"internal energy","J"],[EM,"average energy of one molecule","J"]],"These are for moderate temperatures, where molecules spin but don't vibrate."),
  plug:(p,c)=>EQ(`${sb(UU,"mono")}${OP("=")}${FR("3","2")}${OP("×")}${p.n}${OP("×")}8.314${OP("×")}${p.T}${AND}${sb(UU,"di")}${OP("=")}${FR("5","2")}${OP("×")}${p.n}${OP("×")}8.314${OP("×")}${p.T}`)+calcTip(`1.5*${p.n}*8.314*${p.T}`),
  solution:(p,c)=>steps([
      ["(a) One atom: i = 3",CALC(`${sb(UU,"mono")} = 3/2 × ${p.n} × 8.314 × ${p.T} = <b>${fmt(c.Um)} J</b>`)],
      ["(b) Two atoms: i = 5",CALC(`${sb(UU,"di")} = 5/2 × ${p.n} × 8.314 × ${p.T} = <b>${fmt(c.Ud)} J</b>`)],
      ["(c) One molecule",CALC(`${EM} = 5/2 × 1.38 × 10⁻²³ × ${p.T} = <b>${fmt(c.Em)} J</b>`)]
    ])+checkline(`Same temperature, same amount, but the two-atom gas stores 5/3 as much energy (${fmt(c.Ud/c.Um)} ×), because its molecules also spin.`)+
    finalAns(`${sb(UU,"mono")} = ${fmt(c.Um)} J, &nbsp;${sb(UU,"di")} = ${fmt(c.Ud)} J, &nbsp;${EM} = ${fmt(c.Em)} J`),
  sheet:[{name:"Internal energy (equipartition)",eq:`${UU}${OP("=")}${FR(II,"2")}${NN}${RR}${TT}`,note:"i = 3 one atom, 5 two atoms, 6 bigger bent molecules."}],
  takeEq:()=>`${UU}${OP("=")}${FR(II,"2")}${NN}${RR}${TT}`,
  takeaway:"Each degree of freedom holds ½kT per molecule. U = (i/2)nRT: i = 3 for single atoms, 5 for two-atom molecules.",
  link:"Your course list: “Internal energy of the system. Law of the energy distribution on the degree of freedom of the molecules.”",
  viz:viz.slider((p,c)=>({note:"Drag the temperature. Both energies grow in step with T, and the two-atom gas always holds 5/3 as much.",label:"Temperature",unit:"K",min:50,max:1000,step:10,value:p.T,
    bars:[{label:`${MONO[p.m][0]} (i = 3)`,segs:[{cls:"seg-ke",frac:x=>1.5*x/(2.5*1000)}]},{label:`${DI[p.d][0]} (i = 5)`,segs:[{cls:"seg-ke",frac:x=>1.5*x/(2.5*1000)},{cls:"seg-alt",frac:x=>x/(2.5*1000)}]}],
    read:x=>`${sb(UU,"mono")} = <b>${fmt(1.5*p.n*C.R*x)} J</b>, &nbsp;${sb(UU,"di")} = <b>${fmt(2.5*p.n*C.R*x)} J</b>`})),
  scene:{still:1,draw(K,t,p){box(K,40,30,240,170,{});box(K,320,30,240,170,{});
    for(let i=0;i<14;i++){const x=40+14+212*tri(rnd(i,1)*2+t*0.25*(0.5+rnd(i,2))),y=30+14+142*tri(rnd(i,3)*2+t*0.2*(0.5+rnd(i,4)));K.circle(x,y,6,{fill:"blue",c:false,alpha:0.85});}
    for(let i=0;i<10;i++){const x=320+20+200*tri(rnd(i,5)*2+t*0.2*(0.5+rnd(i,6))),y=30+20+130*tri(rnd(i,7)*2+t*0.17*(0.5+rnd(i,8))),a=t*(2+2*rnd(i,9))+i;
      K.line(x-8*Math.cos(a),y-8*Math.sin(a),x+8*Math.cos(a),y+8*Math.sin(a),{c:"heat",w:3});K.circle(x-8*Math.cos(a),y-8*Math.sin(a),5.5,{fill:"heat",c:false});K.circle(x+8*Math.cos(a),y+8*Math.sin(a),5.5,{fill:"heat",c:false});}
    K.tag(`${MONO[p.m][0]}: moves`,160,212,{size:11});K.tag(`${DI[p.d][0]}: moves and spins`,440,212,{size:11});}}
},

/* ===== Heating at constant volume vs constant pressure ===== */
{
  id:"ie-capacity", level:"Medium", title:"Constant volume or constant pressure?", hw:"Course topic: heat capacities of ideal gases",
  base:{gas:"O2",n:3,dT:40},
  random:()=>({gas:pick(Object.keys(ALL)),n:pick([0.5,1,2,3,4,5]),dT:pick([10,20,25,40,50,80,100])}),
  calc:p=>{const i=ALL[p.gas][2],Cv=i/2*C.R,Cp=Cv+C.R;return {i,Cv,Cp,Qv:p.n*Cv*p.dT,Qp:p.n*Cp*p.dT,g:Cp/Cv};},
  text:(p,G,T)=>`You heat ${G("n",`${p.n} mol`)} of ${ALL[p.gas][0]} (${ALL[p.gas][1]}: ${kind(ALL[p.gas][2])}) by ${G("dT",`${p.dT} K`)}. Treat it as an ideal gas at moderate temperature. How much heat is needed (a) in a closed rigid container (constant volume), and (b) in a cylinder with a freely sliding piston (constant pressure)? (c) What is the ratio γ = C_p/C_V for this gas? Use ${T("cv","molar heat capacities")}.`,
  terms:{cv:TERMS.cv},
  given:p=>[
    {k:"n",sym:NN,name:"amount of gas",unit:"mol",val:p.n,why:"",look:"The number measured in mol."},
    {k:"dT",sym:DT,name:"temperature rise",unit:"K",val:p.dT,why:"",look:"The temperature change in K."},
    {k:"i",sym:II,name:"degrees of freedom",unit:"",val:ALL[p.gas][2],why:ALL[p.gas][2]===3?"Single atoms: 3 ways to move.":ALL[p.gas][2]===5?"Two atoms: 3 ways to move + 2 ways to spin.":"A bent molecule with 3+ atoms: 3 ways to move + 3 ways to spin.",look:"Not in the question: count from the shape of the molecule.",gtraps:[[ALL[p.gas][2]===5?3:5,ALL[p.gas][2]===5?"A two-atom molecule also spins about 2 axes: 3 + 2 = 5.":ALL[p.gas][2]===3?"Single atoms can't spin in a way that counts: i = 3.":"A bent molecule spins about all 3 axes: 3 + 3 = 6."]]},
    R_GIVEN
  ],
  find:[{sym:sb(QQ,"V"),name:"heat at constant volume",unit:"J",why:"Part (a)."},{sym:sb(QQ,"p"),name:"heat at constant pressure",unit:"J",why:"Part (b)."},{sym:GAM,name:"ratio of heat capacities",unit:"",why:"Part (c). No unit."}],
  parts:[
    {id:"Qv",label:"(a) Heat at constant volume",sym:sb(QQ,"V"),unit:"J",ans:(p,c)=>c.Qv,traps:(p,c)=>clean([[c.Qp,"That's at constant pressure. At constant volume no work is done, so C_V = (i/2)R."],[p.n*1.5*C.R*p.dT,"Count the degrees of freedom: i = "+c.i+" for "+kind(c.i)+"."],[p.n*C.R*p.dT,"C_V = (i/2)R, not R."]].filter(t=>Math.abs(t[0]-c.Qv)>1e-6),c.Qv)},
    {id:"Qp",label:"(b) Heat at constant pressure",sym:sb(QQ,"p"),unit:"J",ans:(p,c)=>c.Qp,traps:(p,c)=>clean([[c.Qv,"At constant pressure the gas also expands and does work, so it needs more heat: C_p = C_V + R."],[p.n*(c.Cv-C.R)*p.dT,"Add R, don't subtract: C_p = C_V + R."],[c.Qv+C.R,"Add R to C_V before multiplying by nΔT: Q = n(C_V + R)ΔT."]],c.Qp)},
    {id:"g",label:"(c) γ = C_p/C_V",sym:GAM,unit:"",ans:(p,c)=>c.g,traps:(p,c)=>clean([[1/c.g,"Upside down: γ = C_p ÷ C_V, which is always bigger than 1."],[(c.i===5?5/3:7/5),"Check the degrees of freedom: i = "+c.i+", so γ = (i + 2)/i."]],c.g)}
  ],
  idea:()=>`<p>The heat needed depends on what else the gas does while it warms:</p>
    <ul class="plain"><li><b>Constant volume</b>: the walls don't move, so no work is done. All the heat goes into internal energy: C_V = (i/2)R per mole.</li>
    <li><b>Constant pressure</b>: the gas pushes the piston out while it warms, doing work nRΔT on top. So it needs more heat: C_p = C_V + R (Mayer's relation).</li></ul>
    <p>Count i from the molecule: 3 for one atom, 5 for two atoms, 6 for a bent molecule with three or more.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${CV}${OP("=")}${FR(II,"2")}${RR}${AND}${CP}${OP("=")}${CV}${OP("+")}${RR}${AND}${GAM}${OP("=")}${FR(CP,CV)}${OP("=")}${FR(`${II}${OP("+")}2`,II)}`)+EQ(`${sb(QQ,"V")}${OP("=")}${NN}${CV}${DT}${AND}${sb(QQ,"p")}${OP("=")}${NN}${CP}${DT}`)+
    legend([[CV,"molar heat capacity at constant volume","J/(mol·K)"],[CP,"molar heat capacity at constant pressure","J/(mol·K)"],[II,"degrees of freedom",""],[GAM,"heat capacity ratio",""]],"Monatomic: γ = 5/3 ≈ 1.67. Diatomic: γ = 7/5 = 1.4."),
  plug:(p,c)=>EQ(`${CV}${OP("=")}${FR(c.i,"2")}${OP("×")}8.314${AND}${sb(QQ,"V")}${OP("=")}${p.n}${OP("×")}${CV}${OP("×")}${p.dT}`)+EQ(`${CP}${OP("=")}${CV}${OP("+")}8.314${AND}${sb(QQ,"p")}${OP("=")}${p.n}${OP("×")}${CP}${OP("×")}${p.dT}`)+calcTip(`${p.n}*${c.i}/2*8.314*${p.dT}`),
  solution:(p,c)=>steps([
      ["Degrees of freedom",`${ALL[p.gas][0][0].toUpperCase()+ALL[p.gas][0].slice(1)}: ${kind(c.i)}, so i = ${c.i}. &nbsp;${CV} = ${c.i}/2 × 8.314 = ${fmt(c.Cv)} J/(mol·K), &nbsp;${CP} = ${fmt(c.Cv)} + 8.314 = ${fmt(c.Cp)} J/(mol·K)`],
      ["(a) Constant volume",CALC(`${sb(QQ,"V")} = ${p.n} × ${fmt(c.Cv)} × ${p.dT} = <b>${fmt(c.Qv)} J</b>`)],
      ["(b) Constant pressure",CALC(`${sb(QQ,"p")} = ${p.n} × ${fmt(c.Cp)} × ${p.dT} = <b>${fmt(c.Qp)} J</b>`)],
      ["(c) Ratio",CALC(`${GAM} = ${fmt(c.Cp)} ÷ ${fmt(c.Cv)} = (${c.i} + 2) ÷ ${c.i} = <b>${fmt(c.g)}</b>`)]
    ])+checkline(`The difference Q_p − Q_V = ${fmt(c.Qp-c.Qv)} J is exactly the work the gas does pushing the piston: nRΔT = ${p.n} × 8.314 × ${p.dT} = ${fmt(p.n*C.R*p.dT)} J ✓`)+
    finalAns(`${sb(QQ,"V")} = ${fmt(c.Qv)} J, &nbsp;${sb(QQ,"p")} = ${fmt(c.Qp)} J, &nbsp;${GAM} = ${fmt(c.g)}`),
  sheet:[{name:"Heat capacities of an ideal gas",eq:`${CV}${OP("=")}${FR(II,"2")}${RR},${OP("")}${CP}${OP("=")}${CV}${OP("+")}${RR},${OP("")}${GAM}${OP("=")}${FR(`${II}${OP("+")}2`,II)}`,note:"Per mole. C_p − C_V = R (Mayer)."}],
  takeEq:()=>`${CP}${OP("=")}${CV}${OP("+")}${RR}`,
  takeaway:"C_V = (i/2)R; C_p = C_V + R, because at constant pressure the gas also does work. γ = (i + 2)/i.",
  link:"These heat capacities feed straight into the first law questions next: constant pressure, constant temperature and adiabatic processes.",
  viz:viz.slider((p,c)=>({note:"Drag the degrees of freedom. More ways to store energy means more heat for the same warming, and γ gets closer to 1.",label:"Degrees of freedom i",unit:"",min:3,max:7,step:1,value:c.i,
    bars:[{label:"Heat at constant pressure (full bar = i = 7)",segs:[{cls:"seg-ke",name:"internal energy (C_V)",frac:x=>x/2/(7/2+1)},{cls:"seg-alt",name:"work pushing the piston (R)",frac:x=>1/(7/2+1)}]}],
    read:x=>`${CV} = ${fmt(x/2*C.R)}, ${CP} = ${fmt(x/2*C.R+C.R)} J/(mol·K), &nbsp;${GAM} = <b>${fmt((x+2)/x)}</b>`})),
  scene:{still:2,draw(K,t,p){const u=mod(t,7),f=K.ease(Math.min(1,u/4));
    K.rect(60,60,180,130,{fill:"blueSoft",c:"ink",w:3,r:6});draw.gas(K,64,64,172,122,t,{n:14,v:40+40*f,r:4,seed:81});flame(K,150,212,t,0.7);K.tag("constant volume",150,40,{size:11});
    const top=90-45*f;draw.cylinder(K,360,40,180,150,top,{});draw.gas(K,362,top,176,190-top,t,{n:14,v:40+40*f,r:4,seed:82});flame(K,450,212,t,0.7);K.tag("constant pressure",450,22,{size:11});
    loopFade(K,t,7,0.6,0.3);}}
}

]);
})();
