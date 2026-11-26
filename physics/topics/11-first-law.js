/* First law of thermodynamics and the four gas processes (constant volume, pressure, temperature; adiabatic) and a cycle.
   Sign convention used throughout: Q = ΔU + W, with W the work done BY the gas (heat in and work out are positive).
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,EQ,CALC,IMPLIES,AND,PAREN,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,tri,rnd,gas,box,cylinder,flame,thermo,heatArrow,loopFade,block}=draw;

/* symbols used below */
const QQ=mi("Q"),WW=mi("W"),DU=up("Δ")+mi("U"),NN=mi("n"),RR=mi("R"),TT=mi("T"),II=mi("i"),PP=mi("p"),VV=mi("V"),DT=up("Δ")+mi("T"),DV=up("Δ")+mi("V"),GAM=mi("γ"),ETA=mi("η"),LN="ln";
const T1=sb(mi("T"),"1"),T2=sb(mi("T"),"2"),P1=sb(mi("p"),"1"),P2=sb(mi("p"),"2"),V1=sb(mi("V"),"1"),V2=sb(mi("V"),"2"),CV=sb(mi("C"),"V"),QIN=sb(mi("Q"),"in");
const GASES={He:["helium","He",3],Ar:["argon","Ar",3],N2:["nitrogen","N₂",5],O2:["oxygen","O₂",5],air:["air","mostly N₂ and O₂",5]};
const kind=i=>i===3?"single atoms, i = 3":"two-atom molecules, i = 5";
const TERMS={
  first:["First law of thermodynamics","Energy is conserved: heat put into a gas either raises its internal energy or is spent as work the gas does pushing outward. Q = ΔU + W, with W the work done BY the gas."],
  internal:["Internal energy","The energy of the molecules' motion. For an ideal gas it depends only on temperature: ΔU = (i/2)nRΔT, in any process."],
  isochoric:["Constant volume (isochoric)","The container can't change size, so the gas can't push anything: no work."],
  isobaric:["Constant pressure (isobaric)","A freely sliding piston keeps the pressure fixed; the gas expands as it warms."],
  isothermal:["Constant temperature (isothermal)","The gas is kept at one temperature (slowly, in contact with a large bath), so its internal energy doesn't change."],
  adiabatic:["Adiabatic","No heat goes in or out (insulated, or so fast there's no time). All the work goes into or comes out of the internal energy."],
  cycle:["Cycle","A series of processes that brings the gas back to where it started. Engines run in cycles."]
};
const R_GIVEN={k:"R",sym:RR,name:"gas constant",unit:"J/(mol·K)",val:C.R,why:"Not in the question: a constant you're expected to know.",look:"Not in the question: the gas constant."};
const iGiven=(p,g)=>({k:"i",sym:II,name:"degrees of freedom",unit:"",val:GASES[g][2],why:GASES[g][2]===3?"Single atoms: 3 ways to move.":"Two-atom molecules: 3 ways to move + 2 ways to spin.",look:"Not in the question: count it from the kind of molecule.",gtraps:[[GASES[g][2]===3?5:3,GASES[g][2]===3?"Single atoms can't spin in a way that counts: i = 3.":"A two-atom molecule also spins about 2 axes: i = 5."]]});
const CONV="We use Q = ΔU + W, where W is the work done <b>by</b> the gas. If your course writes the first law as ΔU = Q + W (work done <b>on</b> the gas), only the sign of W flips.";
/* scene helper: a cylinder whose piston sits at `top`, with a weight on it */
function piston(K,x,y,w,h,top,t,o={}){cylinder(K,x,y,w,h,top,{fill:o.fill});gas(K,x+2,top,w-4,y+h-top-2,t,{n:o.n||16,v:o.v||60,r:4,seed:o.seed||1,c:o.c});
  if(o.weight)block(K,x+w/2,top-14,70,26,o.weight);}

PHYS.add("First law & gas processes",[

/* ===== Constant volume ===== */
{
  id:"fl-isochoric", level:"Easy", title:"Heating a sealed tank", hw:"Course topic: first law, constant volume",
  base:{g:"N2",n:2,t1:20,t2:120,p1:100},
  random:()=>({g:pick(Object.keys(GASES)),n:pick([0.5,1,1.5,2,3,4]),t1:pick([0,10,15,20,25,30]),t2:pick([80,100,120,150,200,250]),p1:pick([100,120,150,200,250])}),
  calc:p=>{const i=GASES[p.g][2],dT=p.t2-p.t1,dU=i/2*p.n*C.R*dT;return {i,dT,dU,Q:dU,p2:p.p1*toK(p.t2)/toK(p.t1)};},
  text:(p,G,T)=>`A rigid sealed tank holds ${G("n",`${p.n} mol`)} of ${GASES[p.g][0]} (${GASES[p.g][1]}) at ${G("t1",`${p.t1} °C`)} and ${G("p1",`${p.p1} kPa`)}. It's heated to ${G("t2",`${p.t2} °C`)}. Treat the gas as ideal (${T("isochoric","constant volume")}). Find (a) the work done by the gas, (b) the change in its ${T("internal","internal energy")}, (c) the heat supplied, and (d) the final pressure. Use the ${T("first","first law")}.`,
  terms:{isochoric:TERMS.isochoric,internal:TERMS.internal,first:TERMS.first},
  given:p=>[
    {k:"n",sym:NN,name:"amount of gas",unit:"mol",val:p.n,why:"",look:"The number measured in mol."},
    {k:"t1",sym:T1,name:"starting temperature",unit:"K",val:toK(p.t1),why:"Kelvin, for the pressure in (d). For ΔT alone °C would be fine.",look:"The starting temperature in kelvin.",gtraps:[[p.t1,"Use kelvin: add 273.15."]]},
    {k:"t2",sym:T2,name:"final temperature",unit:"K",val:toK(p.t2),why:"",look:"The final temperature in kelvin.",gtraps:[[p.t2,"Use kelvin: add 273.15."]]},
    {k:"p1",sym:P1,name:"starting pressure",unit:"kPa",val:p.p1,why:"Only needed for (d). kPa is fine: the answer comes out in kPa too.",look:"The pressure in kPa."},
    iGiven(p,p.g),R_GIVEN
  ],
  find:[{sym:WW,name:"work done by the gas",unit:"J",why:"Part (a)."},{sym:DU,name:"change in internal energy",unit:"J",why:"Part (b)."},{sym:QQ,name:"heat supplied",unit:"J",why:"Part (c)."},{sym:P2,name:"final pressure",unit:"kPa",why:"Part (d)."}],
  parts:[
    {id:"W",label:"(a) Work done by the gas",sym:WW,unit:"J",ans:()=>0,traps:(p,c)=>[[p.n*C.R*c.dT,"That's the work at constant pressure. Here the walls can't move, so the gas pushes nothing: W = 0."],[c.dU,"The volume doesn't change, so no work is done: W = 0."]],closeMsg:"The walls don't move, so W = 0."},
    {id:"dU",label:"(b) Change in internal energy",sym:DU,unit:"J",ans:(p,c)=>c.dU,traps:(p,c)=>clean([[(c.i===3?2.5:1.5)*p.n*C.R*c.dT,"Check the degrees of freedom: "+GASES[p.g][0]+" has "+kind(c.i)+"."],[(c.i+2)/2*p.n*C.R*c.dT,"That's C_p. Internal energy always uses (i/2)nRΔT."],[c.i/2*p.n*C.R*toK(p.t2),"Use the change in temperature, ΔT = "+c.dT+" K, not the final temperature."]],c.dU)},
    {id:"Q",label:"(c) Heat supplied",sym:QQ,unit:"J",ans:(p,c)=>c.Q,traps:(p,c)=>clean([[(c.i+2)/2*p.n*C.R*c.dT,"No work is done, so Q = ΔU: no extra R for pushing a piston."],[0,"Heat was supplied: Q = ΔU + W = ΔU."]],c.Q)},
    {id:"p2",label:"(d) Final pressure",sym:P2,unit:"kPa",ans:(p,c)=>c.p2,traps:(p,c)=>clean([[p.p1*p.t2/p.t1,"Use kelvin: pressure is proportional to the absolute temperature."],[p.p1*toK(p.t1)/toK(p.t2),"Upside down: heating at constant volume raises the pressure."]],c.p2)}
  ],
  idea:()=>`<p>The ${"first law"} says: heat in = rise in internal energy + work done by the gas.</p>
    <ul class="plain"><li>The tank is rigid, so nothing moves: <b>W = 0</b>.</li><li>So all the heat goes into internal energy: <b>Q = ΔU</b>.</li>
    <li>ΔU = (i/2)nRΔT, as always for an ideal gas.</li><li>(d) At constant volume, p is proportional to T in kelvin.</li></ul>
    <p class="small">${CONV}</p>`,
  formula:()=>EQ(`${QQ}${OP("=")}${DU}${OP("+")}${WW}${AND}${WW}${OP("=")}0${AND}${DU}${OP("=")}${FR(II,"2")}${NN}${RR}${DT}${AND}${FR(P2,T2)}${OP("=")}${FR(P1,T1)}`)+
    legend([[QQ,"heat into the gas","J"],[DU,"change in internal energy","J"],[WW,"work done by the gas","J"],[II,"degrees of freedom",""]]),
  plug:(p,c)=>EQ(`${DU}${OP("=")}${FR(c.i,"2")}${OP("×")}${p.n}${OP("×")}8.314${OP("×")}${c.dT}${AND}${P2}${OP("=")}${p.p1}${OP("×")}${FR(fmt(toK(p.t2)),fmt(toK(p.t1)))}`)+calcTip(`${c.i}/2*${p.n}*8.314*${c.dT}`),
  solution:(p,c)=>steps([
      ["(a) Rigid tank","Nothing moves, so <b>W = 0</b>."],
      ["(b) Internal energy",`${GASES[p.g][0][0].toUpperCase()+GASES[p.g][0].slice(1)}: ${kind(c.i)}. `+CALC(`${DU} = ${c.i}/2 × ${p.n} × 8.314 × ${c.dT} = <b>${fmt(c.dU)} J</b>`)],
      ["(c) First law",CALC(`${QQ} = ${DU} + 0 = <b>${fmt(c.Q)} J</b>`)],
      ["(d) Pressure",CALC(`${P2} = ${p.p1} × ${fmt(toK(p.t2))} ÷ ${fmt(toK(p.t1))} = <b>${fmt(c.p2)} kPa</b>`)]
    ])+finalAns(`${WW} = 0, &nbsp;${DU} = ${QQ} = ${fmt(c.dU)} J, &nbsp;${P2} = ${fmt(c.p2)} kPa`),
  sheet:[{name:"First law",eq:`${QQ}${OP("=")}${DU}${OP("+")}${WW}`,note:"W = work by the gas."},{name:"Constant volume",eq:`${WW}${OP("=")}0,${OP("")}${QQ}${OP("=")}${DU}${OP("=")}${FR(II,"2")}${NN}${RR}${DT}`,note:"All heat → internal energy."}],
  takeEq:()=>`${QQ}${OP("=")}${DU}${OP("+")}${WW}`,
  takeaway:"Constant volume: W = 0, so Q = ΔU = (i/2)nRΔT. Pressure rises in proportion to T in kelvin.",
  link:"Your course list: “The first law of thermodynamics. Applying it to isoprocesses.” This is the simplest of the four processes.",
  viz:viz.slider((p,c)=>({note:"Drag the final temperature. At constant volume every joule of heat goes into internal energy; none is spent on work.",label:"Final temperature",unit:"°C",min:p.t1,max:400,step:5,value:p.t2,
    bars:[{label:"Heat in (full bar = 400 °C)",segs:[{cls:"seg-ke",name:"ΔU",frac:x=>(x-p.t1)/(400-p.t1)}]}],
    read:x=>`${QQ} = ${DU} = <b>${fmt(c.i/2*p.n*C.R*(x-p.t1))} J</b>, &nbsp;${WW} = 0`})),
  scene:{still:2,draw(K,t,p){const u=mod(t,7),f=K.ease(Math.min(1,u/5));box(K,180,40,240,140,{fill:"blueSoft"});gas(K,184,44,232,132,t,{n:18,v:40+70*f,r:4.5,seed:11,c:f>0.6?"heat":"blue"});
    flame(K,260,212,t,0.8);flame(K,340,212,t,0.8);thermo(K,470,170,110,0.2+0.65*f,{});K.tag("W = 0",120,110,{size:12});loopFade(K,t,7,0.6,0.3);}}
},

/* ===== Constant pressure ===== */
{
  id:"fl-isobaric", level:"Medium", title:"Heating under a free piston", hw:"Course topic: first law, constant pressure",
  base:{g:"O2",n:2,dT:50,p:200},
  random:()=>({g:pick(Object.keys(GASES)),n:pick([0.5,1,2,3,4,5]),dT:pick([20,30,40,50,60,80,100]),p:pick([100,150,200,250,300])}),
  calc:p=>{const i=GASES[p.g][2],W=p.n*C.R*p.dT,dU=i/2*W;return {i,W,dU,Q:W+dU,dVL:W/(p.p*1000)*1000};},
  text:(p,G,T)=>`${G("n",`${p.n} mol`)} of ${GASES[p.g][0]} (${GASES[p.g][1]}) sits in a cylinder under a freely sliding piston, which keeps the pressure at ${G("p",`${p.p} kPa`)}. The gas is heated by ${G("dT",`${p.dT} K`)} (${T("isobaric","constant pressure")}). Treat it as an ideal gas. Find (a) the work done by the gas, (b) the change in its ${T("internal","internal energy")}, (c) the heat supplied, and (d) how much its volume grows, in litres.`,
  terms:{isobaric:TERMS.isobaric,internal:TERMS.internal},
  given:p=>[
    {k:"n",sym:NN,name:"amount of gas",unit:"mol",val:p.n,why:"",look:"The number measured in mol."},
    {k:"dT",sym:DT,name:"temperature rise",unit:"K",val:p.dT,why:"",look:"The temperature change."},
    {k:"p",sym:PP,name:"pressure",unit:"Pa",val:p.p*1000,why:"Only needed for (d). In pascals.",look:"The pressure, in Pa (× 1000).",gtraps:[[p.p,"Convert kPa to Pa: × 1000."]]},
    iGiven(p,p.g),R_GIVEN
  ],
  find:[{sym:WW,name:"work done by the gas",unit:"J",why:"Part (a)."},{sym:DU,name:"change in internal energy",unit:"J",why:"Part (b)."},{sym:QQ,name:"heat supplied",unit:"J",why:"Part (c)."},{sym:DV,name:"growth in volume",unit:"L",why:"Part (d). 1 m³ = 1000 L."}],
  parts:[
    {id:"W",label:"(a) Work done by the gas",sym:WW,unit:"J",ans:(p,c)=>c.W,traps:(p,c)=>clean([[0,"The piston moves up, so the gas does work: W = pΔV = nRΔT."],[c.dU,"That's the internal energy. Work at constant pressure is pΔV = nRΔT."],[c.Q,"That's the heat. Work alone is nRΔT."]],c.W)},
    {id:"dU",label:"(b) Change in internal energy",sym:DU,unit:"J",ans:(p,c)=>c.dU,traps:(p,c)=>clean([[(c.i===3?2.5:1.5)*c.W,"Check the degrees of freedom: "+GASES[p.g][0]+" has "+kind(c.i)+"."],[c.Q,"That's the heat. ΔU is just (i/2)nRΔT, whatever the process."]],c.dU)},
    {id:"Q",label:"(c) Heat supplied",sym:QQ,unit:"J",ans:(p,c)=>c.Q,traps:(p,c)=>clean([[c.dU,"Part of the heat is spent pushing the piston: Q = ΔU + W."],[c.dU-c.W,"Add the work, don't subtract: Q = ΔU + W."]],c.Q)},
    {id:"dV",label:"(d) Growth in volume",sym:DV,unit:"L",ans:(p,c)=>c.dVL,traps:(p,c)=>clean([[c.dVL/1000,"That's in m³. Multiply by 1000 for litres."],[c.dVL*1000,"Use the pressure in pascals: "+p.p+" kPa = "+p.p*1000+" Pa."]],c.dVL)}
  ],
  idea:()=>`<p>At constant pressure the gas expands as it warms, so the heat does two jobs:</p>
    <ul class="plain"><li>it raises the internal energy, <b>ΔU = (i/2)nRΔT</b>, as always;</li><li>and it pays for the work of pushing the piston up, <b>W = pΔV</b>. From pV = nRT at constant p, pΔV = nRΔT.</li></ul>
    <p>Heat = both together. (d) ΔV = W ÷ p.</p><p class="small">${CONV}</p>`,
  formula:()=>EQ(`${WW}${OP("=")}${PP}${DV}${OP("=")}${NN}${RR}${DT}${AND}${DU}${OP("=")}${FR(II,"2")}${NN}${RR}${DT}${AND}${QQ}${OP("=")}${DU}${OP("+")}${WW}${OP("=")}${FR(`${II}${OP("+")}2`,"2")}${NN}${RR}${DT}`)+
    legend([[WW,"work done by the gas","J"],[DV,"change in volume","m³"],[PP,"pressure","Pa"]]),
  plug:(p,c)=>EQ(`${WW}${OP("=")}${p.n}${OP("×")}8.314${OP("×")}${p.dT}${AND}${DU}${OP("=")}${FR(c.i,"2")}${OP("×")}${WW}${AND}${DV}${OP("=")}${FR(WW,p.p*1000)}`)+calcTip(`${p.n}*8.314*${p.dT}`),
  solution:(p,c)=>steps([
      ["(a) Work",CALC(`${WW} = ${p.n} × 8.314 × ${p.dT} = <b>${fmt(c.W)} J</b>`)],
      ["(b) Internal energy",`${kind(c.i)}: `+CALC(`${DU} = ${c.i}/2 × ${fmt(c.W)} = <b>${fmt(c.dU)} J</b>`)],
      ["(c) First law",CALC(`${QQ} = ${fmt(c.dU)} + ${fmt(c.W)} = <b>${fmt(c.Q)} J</b>`)],
      ["(d) Volume",CALC(`${DV} = ${fmt(c.W)} ÷ ${p.p*1000} = ${fmt(c.dVL/1000)} m³ = <b>${fmt(c.dVL)} L</b>`)]
    ])+checkline(`Only ${fmt(c.dU/c.Q*100)} % of the heat stays in the gas as internal energy; the other ${fmt(c.W/c.Q*100)} % leaves as work.`)+
    finalAns(`${WW} = ${fmt(c.W)} J, &nbsp;${DU} = ${fmt(c.dU)} J, &nbsp;${QQ} = ${fmt(c.Q)} J, &nbsp;${DV} = ${fmt(c.dVL)} L`),
  sheet:[{name:"Constant pressure",eq:`${WW}${OP("=")}${PP}${DV}${OP("=")}${NN}${RR}${DT},${OP("")}${QQ}${OP("=")}${FR(`${II}${OP("+")}2`,"2")}${NN}${RR}${DT}`,note:"Q = ΔU + W."}],
  takeEq:()=>`${WW}${OP("=")}${PP}${DV}${OP("=")}${NN}${RR}${DT}`,
  takeaway:"Constant pressure: W = pΔV = nRΔT, ΔU = (i/2)nRΔT, Q = ((i+2)/2)nRΔT.",
  link:"The same split as C_p = C_V + R in “Constant volume or constant pressure?”: the extra R is the work.",
  viz:viz.slider((p,c)=>({note:"Drag the temperature rise and watch the heat split into internal energy and work.",label:"Temperature rise",unit:"K",min:0,max:200,step:5,value:p.dT,
    bars:[{label:"Heat in (full bar = 200 K)",segs:[{cls:"seg-ke",name:"ΔU",frac:x=>c.i/(c.i+2)*x/200},{cls:"seg-alt",name:"work",frac:x=>2/(c.i+2)*x/200}]}],
    read:x=>`${DU} = ${fmt(c.i/2*p.n*C.R*x)} J, &nbsp;${WW} = ${fmt(p.n*C.R*x)} J, &nbsp;${QQ} = <b>${fmt((c.i+2)/2*p.n*C.R*x)} J</b>`})),
  scene:{still:2,draw(K,t,p){const u=mod(t,7),f=K.ease(Math.min(1,u/5)),top=120-60*f;piston(K,220,40,160,150,top,t,{v:45+40*f,seed:21,weight:`${p.p} kPa`});
    flame(K,270,212,t,0.8);flame(K,330,212,t,0.8);K.arrow(420,130,420,130-60*f-1,{c:"ok",w:2.4});K.tag("W",440,100,{size:12});loopFade(K,t,7,0.6,0.3);}}
},

/* ===== Constant temperature ===== */
{
  id:"fl-isothermal", level:"Medium", title:"Slow expansion in a warm bath", hw:"Course topic: first law, constant temperature",
  base:{n:1,tc:27,V1:5,V2:15},
  random:()=>{const V1=pick([2,3,4,5,6,8,10]);return {n:pick([0.2,0.5,1,1.5,2]),tc:pick([0,20,27,37,50,100]),V1,V2:V1*pick([1.5,2,2.5,3,4,5])};},
  calc:p=>{const T=toK(p.tc),W=p.n*C.R*T*Math.log(p.V2/p.V1);return {T,W,Q:W,p2:p.n*C.R*T/(p.V2/1000)/1000,p1:p.n*C.R*T/(p.V1/1000)/1000};},
  text:(p,G,T)=>`${G("n",`${p.n} mol`)} of an ideal gas sits in a cylinder dipped in a large water bath at ${G("tc",`${p.tc} °C`)}. The piston is pulled out slowly, so the gas stays at the bath's temperature (${T("isothermal","constant temperature")}), and its volume grows from ${G("V1",`${p.V1} L`)} to ${G("V2",`${p.V2} L`)}. Find (a) the work done by the gas, (b) the heat it takes from the bath, and (c) its final pressure.`,
  terms:{isothermal:TERMS.isothermal},
  given:p=>[
    {k:"n",sym:NN,name:"amount of gas",unit:"mol",val:p.n,why:"",look:"The number measured in mol."},
    {k:"tc",sym:TT,name:"temperature",unit:"K",val:toK(p.tc),why:"Kelvin: it multiplies, so °C would be wrong.",look:"The bath's temperature in kelvin.",gtraps:[[p.tc,"Use kelvin: add 273.15."]]},
    {k:"V1",sym:V1,name:"starting volume",unit:"L",val:p.V1,why:"Litres are fine inside the log (only the ratio matters).",look:"The starting volume."},
    {k:"V2",sym:V2,name:"final volume",unit:"L",val:p.V2,why:"",look:"The final volume."},
    R_GIVEN
  ],
  find:[{sym:WW,name:"work done by the gas",unit:"J",why:"Part (a)."},{sym:QQ,name:"heat taken from the bath",unit:"J",why:"Part (b)."},{sym:P2,name:"final pressure",unit:"kPa",why:"Part (c)."}],
  parts:[
    {id:"W",label:"(a) Work done by the gas",sym:WW,unit:"J",ans:(p,c)=>c.W,traps:(p,c)=>clean([[p.n*C.R*p.tc*Math.log(p.V2/p.V1),"Use kelvin: "+p.tc+" °C = "+fmt(c.T)+" K."],[p.n*C.R*c.T*Math.log10(p.V2/p.V1),"Use the natural log (ln), not log₁₀."],[p.n*C.R*c.T*Math.log(p.V1/p.V2),"V₂ goes on top: the gas expands, so it does positive work."],[p.n*C.R*c.T*(p.V2/p.V1),"Take the natural log of the ratio: W = nRT ln(V₂/V₁)."],[c.p2*1000*(p.V2-p.V1)/1000,"The pressure falls as the gas expands, so W isn't p × ΔV with one pressure. Use nRT ln(V₂/V₁)."]],c.W)},
    {id:"Q",label:"(b) Heat taken from the bath",sym:QQ,unit:"J",ans:(p,c)=>c.Q,traps:(p,c)=>clean([[0,"The temperature doesn't change, so ΔU = 0, but heat still flows: Q = W."],[-c.W,"Heat flows in, since the gas does work and stays at the same temperature: Q = +W."]],c.Q)},
    {id:"p2",label:"(c) Final pressure",sym:P2,unit:"kPa",ans:(p,c)=>c.p2,traps:(p,c)=>clean([[c.p1,"That's the starting pressure. Use V₂."],[c.p2*1000,"That's in Pa. Divide by 1000 for kPa."],[c.p2/1000,"Convert litres to m³ (÷ 1000) before using pV = nRT."]],c.p2)}
  ],
  idea:()=>`<p>The temperature stays the same, so the internal energy doesn't change: <b>ΔU = 0</b>.</p>
    <ul class="plain"><li>The first law then says <b>Q = W</b>: every joule of work the gas does is paid for by heat from the bath.</li>
    <li>The pressure falls as the gas expands, so the work is the area under the curve p = nRT/V, which gives <b>W = nRT ln(V₂/V₁)</b>.</li>
    <li>(c) pV = nRT with the final volume (in m³).</li></ul><p class="small">${CONV}</p>`,
  formula:()=>EQ(`${DU}${OP("=")}0${AND}${QQ}${OP("=")}${WW}${OP("=")}${NN}${RR}${TT}${OP(" ")}${LN}${PAREN(FR(V2,V1))}${AND}${P2}${OP("=")}${FR(`${NN}${RR}${TT}`,V2)}`)+
    legend([[WW,"work done by the gas","J"],[TT,"temperature (constant)","K"],[V1,"starting volume",""],[V2,"final volume",""]],"ln is the natural log (the “ln” key)."),
  plug:(p,c)=>EQ(`${WW}${OP("=")}${p.n}${OP("×")}8.314${OP("×")}${fmt(c.T)}${OP("×")}${LN}${PAREN(FR(p.V2,p.V1))}${AND}${P2}${OP("=")}${FR(`${p.n}${OP("×")}8.314${OP("×")}${fmt(c.T)}`,p.V2/1000)}`)+calcTip(`${p.n}*8.314*${R3(c.T)}*ln(${p.V2}/${p.V1})`),
  solution:(p,c)=>steps([
      ["Kelvin",`${TT} = ${p.tc} + 273.15 = ${fmt(c.T)} K`],
      ["(a) Work",CALC(`${WW} = ${p.n} × 8.314 × ${fmt(c.T)} × ln(${fmt(p.V2/p.V1)}) = <b>${fmt(c.W)} J</b>`)],
      ["(b) ΔU = 0",CALC(`${QQ} = ${WW} = <b>${fmt(c.Q)} J</b>`)],
      ["(c) Pressure",CALC(`${P2} = ${p.n} × 8.314 × ${fmt(c.T)} ÷ ${p.V2/1000} = ${fmt(c.p2*1000)} Pa = <b>${fmt(c.p2)} kPa</b>`)]
    ])+checkline(`Check: p₁V₁ = p₂V₂ at constant temperature: ${fmt(c.p1)} × ${p.V1} = ${fmt(c.p2)} × ${p.V2} ✓`)+
    finalAns(`${WW} = ${QQ} = ${fmt(c.W)} J, &nbsp;${P2} = ${fmt(c.p2)} kPa`),
  sheet:[{name:"Constant temperature",eq:`${QQ}${OP("=")}${WW}${OP("=")}${NN}${RR}${TT}${OP(" ")}${LN}${PAREN(FR(V2,V1))}`,note:"ΔU = 0. Natural log."}],
  takeEq:()=>`${WW}${OP("=")}${NN}${RR}${TT}${OP(" ")}${LN}${PAREN(FR(V2,V1))}`,
  takeaway:"Constant temperature: ΔU = 0, so Q = W = nRT ln(V₂/V₁). T in kelvin, natural log.",
  link:"The same formula gives the entropy change in a free expansion (Entropy topic) and the heat in the hot step of a Carnot cycle.",
  viz:plot((p,c)=>{const Vm=Math.max(p.V2*1.2,p.V1*6),pm=c.p1*1.15,curve=a=>{const pts=[];for(let k=0;k<=80;k++){const V=p.V1*0.6+(Vm-p.V1*0.6)*k/80;pts.push([V,p.n*C.R*c.T/(V/1000)/1000]);}return pts;};
    return {note:"Pressure against volume at constant temperature. The shaded area under the curve is the work. Drag the final volume.",label:"Final volume",unit:"L",min:p.V1,max:+(Vm).toFixed(1),step:0.5,value:p.V2,x:[0,Vm],y:[0,pm],xl:"V (L) →",yl:"p (kPa)",
      curves:s=>{const a=[[p.V1,0]];for(let k=0;k<=40;k++){const V=p.V1+(s-p.V1)*k/40;a.push([V,p.n*C.R*c.T/(V/1000)/1000]);}a.push([s,0]);return [{pts:a,cls:"main",fill:true,close:true},{pts:curve(),cls:"soft"}];},
      point:s=>[s,p.n*C.R*c.T/(s/1000)/1000],read:s=>`${WW} = ${QQ} = <b>${fmt(p.n*C.R*c.T*Math.log(s/p.V1))} J</b>, &nbsp;${P2} = ${fmt(p.n*C.R*c.T/(s/1000)/1000)} kPa`};}),
  scene:{still:2,draw(K,t,p){const u=mod(t,8),f=K.ease(Math.min(1,u/6)),top=150-90*f;K.rect(150,90,300,124,{fill:"blueSoft",c:"ink2",w:1.6,r:6});
    piston(K,240,40,120,160,top,t,{v:55,seed:31,n:14});
    heatArrow(K,165,170,232,170,t,{amp:2.5});heatArrow(K,435,170,368,170,t+0.4,{amp:2.5});K.tag(`bath ${p.tc} °C`,300,206,{size:11});if(f<1)K.arrow(335,top-10,335,top-45,{c:"ok",w:2.2});
    loopFade(K,t,8,0.6,0.3);}}
},

/* ===== Adiabatic compression ===== */
{
  id:"fl-adiabatic", level:"Hard", title:"Diesel compression stroke", hw:"Course topic: adiabatic process",
  base:{VL:0.5,r:16,t1:27,p1:100},
  random:()=>({VL:pick([0.4,0.5,0.6,0.8,1.0]),r:pick([8,10,12,15,16,18,20]),t1:pick([7,17,27,37]),p1:pick([90,100,110])}),
  calc:p=>{const g=1.4,T1=toK(p.t1),T2=T1*p.r**(g-1),p2=p.p1*p.r**g,n=p.p1*1000*p.VL/1000/(C.R*T1),W=2.5*n*C.R*(T2-T1);return {g,T1,T2,p2M:p2/1000,n,W};},
  text:(p,G,T)=>`In a diesel engine, ${G("V1",`${p.VL} L`)} of air at ${G("t1",`${p.t1} °C`)} and ${G("p1",`${p.p1} kPa`)} is squeezed so fast that no heat escapes (${T("adiabatic","adiabatic")}), down to 1/${G("r",`${p.r}`)} of its volume. Treat air as an ideal gas of two-atom molecules (γ = 1.4). Find (a) the final temperature, (b) the final pressure in MPa, and (c) the work done on the air.`,
  terms:{adiabatic:TERMS.adiabatic},
  given:p=>[
    {k:"V1",sym:V1,name:"starting volume",unit:"m³",val:p.VL/1000,why:"In m³, for the amount of gas in (c).",look:"The volume in m³ (÷ 1000).",gtraps:[[p.VL,"Convert litres to m³: ÷ 1000."]]},
    {k:"t1",sym:T1,name:"starting temperature",unit:"K",val:toK(p.t1),why:"Kelvin: temperatures in these formulas are multiplied.",look:"The temperature in kelvin.",gtraps:[[p.t1,"Use kelvin: add 273.15."]]},
    {k:"p1",sym:P1,name:"starting pressure",unit:"Pa",val:p.p1*1000,why:"In pascals.",look:"The pressure in Pa (× 1000).",gtraps:[[p.p1,"Convert kPa to Pa: × 1000."]]},
    {k:"r",sym:FR(V1,V2),name:"compression ratio",unit:"",val:p.r,why:"The volume shrinks to 1/"+p.r+", so V₁/V₂ = "+p.r+".",look:"How many times smaller the volume gets."},
    {k:"g",sym:GAM,name:"heat capacity ratio",unit:"",val:1.4,why:"Two-atom molecules: (5 + 2)/5.",look:"The number γ."},
    R_GIVEN
  ],
  find:[{sym:T2,name:"final temperature",unit:"K",why:"Part (a)."},{sym:P2,name:"final pressure",unit:"MPa",why:"Part (b). 1 MPa = 10⁶ Pa."},{sym:sb(WW,"on"),name:"work done on the air",unit:"J",why:"Part (c)."}],
  parts:[
    {id:"T2",label:"(a) Final temperature",sym:T2,unit:"K",ans:(p,c)=>c.T2,traps:(p,c)=>clean([[p.t1*p.r**0.4,"Use kelvin: "+p.t1+" °C = "+fmt(c.T1)+" K."],[c.T1*p.r,"That would be at constant pressure. Adiabatic: T₂ = T₁(V₁/V₂)^(γ−1), with γ − 1 = 0.4."],[c.T1*p.r**1.4,"The exponent is γ − 1 = 0.4 for temperature (γ is for pressure)."],[c.T1,"No heat escapes, so the work done on the air heats it up."]],c.T2)},
    {id:"p2",label:"(b) Final pressure",sym:P2,unit:"MPa",ans:(p,c)=>c.p2M,traps:(p,c)=>clean([[p.p1*p.r/1000,"That's Boyle's law (constant temperature). Adiabatic: p₂ = p₁(V₁/V₂)^γ, higher, because the gas also heats up."],[p.p1*p.r**0.4/1000,"For pressure the exponent is γ = 1.4, not γ − 1."],[c.p2M*1000,"That's in kPa. Divide by 1000 for MPa."]],c.p2M)},
    {id:"W",label:"(c) Work done on the air",sym:sb(WW,"on"),unit:"J",ans:(p,c)=>c.W,traps:(p,c)=>clean([[-c.W,"Work is done ON the air (it's squeezed), so give it as a positive number."],[1.5*c.n*C.R*(c.T2-c.T1),"Air is two-atom molecules: ΔU = (5/2)nRΔT."],[3.5*c.n*C.R*(c.T2-c.T1),"That's C_p. Internal energy uses C_V = (5/2)R."],[2.5*(p.p1*1000*p.VL/1000)/(C.R*p.t1)*C.R*(c.T2-c.T1),"Use kelvin when finding n = pV/(RT)."]],c.W)}
  ],
  idea:()=>`<p>No heat gets in or out (Q = 0), so the first law says all the work done <b>on</b> the air goes into its internal energy: it gets hot. That's how a diesel lights its fuel without a spark.</p>
    <ul class="plain"><li>For an adiabatic process, <b>pV<sup>γ</sup></b> stays constant, and so does <b>TV<sup>γ−1</sup></b>.</li>
    <li>(c) Work on the gas = ΔU = (5/2)nRΔT. Get n from pV = nRT at the start.</li></ul><p class="small">${CONV}</p>`,
  formula:()=>EQ(`${T2}${OP("=")}${T1}${PAREN(FR(V1,V2))}<sup>${GAM}−1</sup>${AND}${P2}${OP("=")}${P1}${PAREN(FR(V1,V2))}<sup>${GAM}</sup>`)+EQ(`${NN}${OP("=")}${FR(`${P1}${V1}`,`${RR}${T1}`)}${AND}${sb(WW,"on")}${OP("=")}${DU}${OP("=")}${FR("5","2")}${NN}${RR}${PAREN(`${T2}${OP("−")}${T1}`)}`)+
    legend([[GAM,"C_p/C_V: 1.4 for two-atom gases, 5/3 for single atoms",""],[FR(V1,V2),"compression ratio",""]]),
  plug:(p,c)=>EQ(`${T2}${OP("=")}${fmt(c.T1)}${OP("×")}${p.r}<sup>0.4</sup>${AND}${P2}${OP("=")}${p.p1*1000}${OP("×")}${p.r}<sup>1.4</sup>`)+calcTip(`${R3(c.T1)}*${p.r}^0.4`),
  solution:(p,c)=>steps([
      ["(a) Temperature",CALC(`${T2} = ${fmt(c.T1)} × ${p.r}<sup>0.4</sup> = <b>${fmt(c.T2)} K</b>`)+` (${fmt(c.T2-273.15)} °C)`],
      ["(b) Pressure",CALC(`${P2} = ${p.p1*1000} × ${p.r}<sup>1.4</sup> = ${fmt(c.p2M*1e6)} Pa = <b>${fmt(c.p2M)} MPa</b>`)],
      ["Amount of air",CALC(`${NN} = ${p.p1*1000} × ${p.VL/1000} ÷ (8.314 × ${fmt(c.T1)}) = ${fmt(c.n)} mol`)],
      ["(c) Work = ΔU",CALC(`${sb(WW,"on")} = 5/2 × ${fmt(c.n)} × 8.314 × (${fmt(c.T2)} − ${fmt(c.T1)}) = <b>${fmt(c.W)} J</b>`)]
    ])+checkline(`Check with the ideal gas law at the end: p₂V₂/T₂ = ${fmt(c.p2M*1e6)} × ${fmt(p.VL/1000/p.r)} ÷ ${fmt(c.T2)} = ${fmt(c.p2M*1e6*p.VL/1000/p.r/c.T2)}, the same as nR = ${fmt(c.n*C.R)} ✓`)+
    finalAns(`${T2} = ${fmt(c.T2)} K, &nbsp;${P2} = ${fmt(c.p2M)} MPa, &nbsp;${sb(WW,"on")} = ${fmt(c.W)} J`),
  sheet:[{name:"Adiabatic process",eq:`${PP}${VV}<sup>${GAM}</sup>${OP("=")}const,${OP("")}${TT}${VV}<sup>${GAM}−1</sup>${OP("=")}const`,note:"Q = 0, so W_on = ΔU."}],
  takeEq:()=>`${T2}${OP("=")}${T1}${PAREN(FR(V1,V2))}<sup>${GAM}−1</sup>`,
  takeaway:"Adiabatic: Q = 0. TV^(γ−1) and pV^γ stay constant; the work done on the gas all becomes internal energy.",
  link:"Your course list: adiabatic process. HW 4's diesel task is about the fuel; this is what happens to the air in the same engine.",
  viz:plot((p,c)=>{const pm=p.p1*30**1.4/1000*1.05;
    return {note:"Pressure against volume (shrinking to the left). The adiabat (blue) climbs far above the constant-temperature curve (dashed), because the gas heats up as it's squeezed. Drag the compression ratio.",label:"Compression ratio",unit:"",min:1,max:30,step:1,value:p.r,x:[0,p.VL*1.05],y:[0,pm],xl:"V (L) →",yl:"p (MPa)",
      curves:s=>{const a=[],b=[];for(let k=0;k<=80;k++){const V=p.VL/s+(p.VL-p.VL/s)*k/80;a.push([V,p.p1*(p.VL/V)**1.4/1000]);b.push([V,p.p1*(p.VL/V)/1000]);}return [{pts:a,cls:"main"},{pts:b,cls:"soft"}];},
      point:s=>[p.VL/s,p.p1*s**1.4/1000],read:s=>`${T2} = <b>${fmt(c.T1*s**0.4)} K</b>, &nbsp;${P2} = <b>${fmt(p.p1*s**1.4/1000)} MPa</b>`};}),
  scene:{still:1,draw(K,t,p){const u=mod(t,6),f=u<1?0:K.ease(Math.min(1,(u-1)/0.8)),top=50+120*f;
    K.rect(200,30,200,170,{fill:"ink2",c:false,alpha:0.15});
    piston(K,214,40,172,150,top,t,{v:50+150*f,seed:41,n:18,c:f>0.5?"heat":"blue"});
    K.text("insulated",300,214,{size:11,c:"ink2"});if(f>0&&f<1)K.arrow(300,10,300,top-20,{c:"ink",w:3});if(f>0.9)K.tag("hot!",450,150,{size:12,c:"heat"});
    loopFade(K,t,6,0.6,0.3);}}
},

/* ===== A rectangular cycle ===== */
{
  id:"fl-cycle", level:"Hard", title:"A rectangle on the p–V graph", hw:"Course topic: cycles and efficiency",
  base:{g:"He",p1:100,dp:200,V1:2,dV:3},
  random:()=>({g:pick(["He","Ar","N2","O2"]),p1:pick([100,150,200]),dp:pick([100,150,200,300]),V1:pick([1,2,3,4]),dV:pick([1,2,3,4,5])}),
  calc:p=>{const i=GASES[p.g][2],p2=p.p1+p.dp,V2=p.V1+p.dV,W=p.dp*p.dV,Qab=i/2*p.V1*p.dp,Qbc=(i+2)/2*p2*p.dV;return {i,p2,V2,W,Qab,Qbc,Qin:Qab+Qbc,eta:W/(Qab+Qbc)*100};},
  text:(p,G,T)=>`An ideal gas (${GASES[p.g][0]}) runs round a ${T("cycle","cycle")} that makes a rectangle on the p–V graph. Starting at A (${G("V1",`${p.V1} L`)}, ${G("p1",`${p.p1} kPa`)}): A→B it's heated at constant volume to ${G("p2",`${p.p1+p.dp} kPa`)}; B→C it expands at constant pressure to ${G("V2",`${p.V1+p.dV} L`)}; C→D it cools at constant volume back to ${p.p1} kPa; D→A it's compressed at constant pressure back to A. Find (a) the net work done by the gas in one cycle, (b) the heat taken in during one cycle, and (c) the efficiency of the cycle.`,
  terms:{cycle:TERMS.cycle},
  given:p=>[
    {k:"V1",sym:V1,name:"smaller volume",unit:"L",val:p.V1,why:"kPa × L = J, so you can stay in kPa and L.",look:"The volume at A."},
    {k:"V2",sym:V2,name:"larger volume",unit:"L",val:p.V1+p.dV,why:"",look:"The volume at C."},
    {k:"p1",sym:P1,name:"lower pressure",unit:"kPa",val:p.p1,why:"",look:"The pressure at A."},
    {k:"p2",sym:P2,name:"higher pressure",unit:"kPa",val:p.p1+p.dp,why:"",look:"The pressure at B."},
    iGiven(p,p.g)
  ],
  find:[{sym:sb(WW,"net"),name:"net work per cycle",unit:"J",why:"Part (a)."},{sym:QIN,name:"heat taken in per cycle",unit:"J",why:"Part (b)."},{sym:ETA,name:"efficiency",unit:"%",why:"Part (c)."}],
  parts:[
    {id:"W",label:"(a) Net work per cycle",sym:sb(WW,"net"),unit:"J",ans:(p,c)=>c.W,traps:(p,c)=>clean([[c.p2*p.dV,"That's only the work out along B→C. On D→A the gas is squeezed back, so subtract p₁ΔV: the net work is the rectangle's area."],[c.W*1000,"kPa × L is already joules (10³ × 10⁻³ = 1)."],[c.p2*c.V2,"The net work is the area inside the rectangle: (p₂ − p₁)(V₂ − V₁)."]],c.W)},
    {id:"Qin",label:"(b) Heat taken in per cycle",sym:QIN,unit:"J",ans:(p,c)=>c.Qin,traps:(p,c)=>clean([[c.W,"That's the work. Heat comes in on A→B and B→C, and some heat leaves on C→D and D→A."],[c.Qbc,"Heat also comes in on A→B (the gas is heated at constant volume)."],[c.Qab,"Heat also comes in on B→C (the gas is heated while it expands)."],[c.i/2*p.V1*p.dp+c.i/2*c.p2*p.dV,"On B→C the pressure is constant, so the heat is ((i + 2)/2)pΔV, not (i/2)pΔV: it includes the work."]],c.Qin)},
    {id:"eta",label:"(c) Efficiency",sym:ETA,unit:"%",ans:(p,c)=>c.eta,traps:(p,c)=>clean([[c.W/c.Qbc*100,"Count all the heat taken in: A→B and B→C."],[c.eta/100,"Give it as a percentage: × 100."],[(1-p.p1/c.p2)*100,"That's not a Carnot cycle, so use η = W ÷ Q_in."]],c.eta)}
  ],
  idea:()=>`<p>Over a full cycle the gas ends where it started, so ΔU = 0 for the cycle: the net heat in equals the net work out.</p>
    <ul class="plain"><li>(a) The net work is the <b>area inside the loop</b> on the p–V graph: here a rectangle.</li>
    <li>(b) Heat goes <b>in</b> on the two legs where the gas gets hotter: A→B (pressure up at fixed volume) and B→C (expands at fixed pressure). Use ΔU = (i/2)Δ(pV), since pV = nRT.</li>
    <li>(c) Efficiency = what you get (net work) ÷ what you pay (heat in).</li></ul>
    <p class="small">Handy: kPa × L = J, and nRΔT = Δ(pV).</p>`,
  formula:()=>EQ(`${sb(WW,"net")}${OP("=")}${PAREN(`${P2}${OP("−")}${P1}`)}${PAREN(`${V2}${OP("−")}${V1}`)}`)+EQ(`${sb(QQ,"AB")}${OP("=")}${FR(II,"2")}${V1}${PAREN(`${P2}${OP("−")}${P1}`)}${AND}${sb(QQ,"BC")}${OP("=")}${FR(`${II}${OP("+")}2`,"2")}${P2}${PAREN(`${V2}${OP("−")}${V1}`)}${AND}${ETA}${OP("=")}${FR(sb(WW,"net"),QIN)}`)+
    legend([[sb(QQ,"AB"),"heat in at constant volume = ΔU","J"],[sb(QQ,"BC"),"heat in at constant pressure = ΔU + W","J"],[ETA,"efficiency",""]]),
  plug:(p,c)=>EQ(`${sb(WW,"net")}${OP("=")}${p.dp}${OP("×")}${p.dV}${AND}${sb(QQ,"AB")}${OP("=")}${FR(c.i,"2")}${OP("×")}${p.V1}${OP("×")}${p.dp}${AND}${sb(QQ,"BC")}${OP("=")}${FR(c.i+2,"2")}${OP("×")}${c.p2}${OP("×")}${p.dV}`),
  solution:(p,c)=>steps([
      ["(a) Area of the rectangle",CALC(`${sb(WW,"net")} = (${c.p2} − ${p.p1}) × (${c.V2} − ${p.V1}) = <b>${fmt(c.W)} J</b>`)],
      ["Heat in on A→B",`${kind(c.i)}. `+CALC(`${sb(QQ,"AB")} = ${c.i}/2 × ${p.V1} × ${p.dp} = ${fmt(c.Qab)} J`)],
      ["Heat in on B→C",CALC(`${sb(QQ,"BC")} = ${c.i+2}/2 × ${c.p2} × ${p.dV} = ${fmt(c.Qbc)} J`)],
      ["(b) Total in",CALC(`${QIN} = ${fmt(c.Qab)} + ${fmt(c.Qbc)} = <b>${fmt(c.Qin)} J</b>`)],
      ["(c) Efficiency",CALC(`${ETA} = ${fmt(c.W)} ÷ ${fmt(c.Qin)} = <b>${fmt(c.eta)} %</b>`)]
    ])+checkline(`The heat thrown away on C→D and D→A is ${fmt(c.Qin)} − ${fmt(c.W)} = ${fmt(c.Qin-c.W)} J. A real cycle can never turn all its heat into work.`)+
    finalAns(`${sb(WW,"net")} = ${fmt(c.W)} J, &nbsp;${QIN} = ${fmt(c.Qin)} J, &nbsp;${ETA} = ${fmt(c.eta)} %`),
  sheet:[{name:"Cycle",eq:`${sb(WW,"net")}${OP("=")}area of loop,${OP("")}${ETA}${OP("=")}${FR(sb(WW,"net"),QIN)}`,note:"ΔU = 0 over a cycle. kPa·L = J."}],
  takeEq:()=>`${ETA}${OP("=")}${FR(sb(WW,"net"),QIN)}`,
  takeaway:"Net work of a cycle = area inside its loop on the p–V graph. Efficiency = net work ÷ heat taken in (only the legs where heat goes in).",
  link:"Engines run in cycles like this. The Carnot cycle (next topic) is the most efficient cycle possible between two temperatures.",
  viz:plot((p,c)=>({note:"The cycle on the p–V graph. The shaded area is the net work. Drag the top pressure and watch the area and the efficiency change.",label:"Pressure at B",unit:"kPa",min:p.p1+50,max:p.p1+600,step:50,value:c.p2,x:[0,c.V2*1.25],y:[0,(p.p1+600)*1.1],xl:"V (L) →",yl:"p (kPa)",
    curves:s=>[{pts:[[p.V1,p.p1],[p.V1,s],[c.V2,s],[c.V2,p.p1]],cls:"main",fill:true,close:true}],
    read:s=>{const W=(s-p.p1)*p.dV,Q=c.i/2*p.V1*(s-p.p1)+(c.i+2)/2*s*p.dV;return `${sb(WW,"net")} = ${fmt(W)} J, &nbsp;${QIN} = ${fmt(Q)} J, &nbsp;${ETA} = <b>${fmt(W/Q*100)} %</b>`;}})),
  scene:{still:1.5,draw(K,t,p){const X0=150,Y0=190,x1=230,x2=430,y1=160,y2=50;K.arrow(X0,Y0,520,Y0,{c:"ink2",w:1.4});K.arrow(X0,Y0,X0,20,{c:"ink2",w:1.4});K.text("V",530,Y0+4,{size:12,c:"ink2"});K.text("p",X0-14,22,{size:12,c:"ink2"});
    K.rect(x1,y2,x2-x1,y1-y2,{fill:"blueSoft",c:false});K.line(x1,y1,x1,y2,{c:"heat",w:2.6});K.line(x1,y2,x2,y2,{c:"heat",w:2.6});K.line(x2,y2,x2,y1,{c:"blue",w:2.6});K.line(x2,y1,x1,y1,{c:"blue",w:2.6});
    K.text("W",(x1+x2)/2,(y1+y2)/2+4,{size:16,bold:true,c:"ink2"});[["A",x1-14,y1+12],["B",x1-14,y2-6],["C",x2+14,y2-6],["D",x2+14,y1+12]].forEach(q=>K.text(q[0],q[1],q[2],{size:13,bold:true}));
    const u=mod(t*0.25,1),L=[[x1,y1],[x1,y2],[x2,y2],[x2,y1],[x1,y1]],seg=[110,200,110,200],tot=620;let d=u*tot,k=0;while(k<3&&d>seg[k]){d-=seg[k];k++;}
    const a=L[k],b=L[k+1],s=d/seg[k];K.circle(a[0]+(b[0]-a[0])*s,a[1]+(b[1]-a[1])*s,7,{fill:k<2?"heat":"blue",c:"card",w:2});
    K.tag("heat in",x1-58,(y1+y2)/2,{size:11,c:"heat"});K.tag("heat out",x2+62,(y1+y2)/2,{size:11,c:"blue"});}}
}

]);
})();
