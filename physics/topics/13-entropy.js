/* Entropy: ΔS = Q/T, mixing hot and cold water, free expansion, and the statistical meaning (S = k ln W).
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,EQ,CALC,IMPLIES,AND,PAREN,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,tri,rnd,gas,box,beaker,ice,heatArrow,loopFade}=draw;

/* symbols used below */
const DS=up("Δ")+mi("S"),QQ=mi("Q"),TT=mi("T"),MM=mi("m"),LF=sb(mi("L"),"f"),CW=mi("c"),NN=mi("n"),RR=mi("R"),KB=mi("k"),WW=mi("W"),OM=up("Ω"),PR=mi("P"),NNm=mi("N"),LN="ln";
const T1=sb(mi("T"),"1"),T2=sb(mi("T"),"2"),TF=sb(mi("T"),"f"),M1=sb(mi("m"),"1"),M2=sb(mi("m"),"2"),V1=sb(mi("V"),"1"),V2=sb(mi("V"),"2");
const TERMS={
  entropy:["Entropy","A measure of how spread out (disordered) energy is. When heat Q flows in at temperature T, the entropy rises by Q/T. In a closed system it never decreases."],
  second:["Second law (entropy form)","The total entropy of an isolated system never decreases. Real, one-way processes (mixing, heat flowing hot → cold, a gas rushing into a vacuum) always increase it."],
  free:["Free expansion","A gas rushes into an empty space. Nothing is pushed, so no work is done; the container is insulated, so no heat flows. Yet the entropy goes up."],
  micro:["Microstates","The number of different ways the molecules can be arranged that look the same from outside. Boltzmann: S = k ln Ω, where Ω is that number."]
};

PHYS.add("Entropy",[

/* ===== Melting ice ===== */
{
  id:"s-melt", level:"Easy", title:"Entropy of melting ice", hw:"Course topic: entropy",
  base:{m:0.5,tr:20},
  random:()=>({m:pick([0.1,0.2,0.25,0.3,0.5,0.75,1,1.5,2]),tr:pick([15,18,20,22,25,30])}),
  calc:p=>{const Q=p.m*C.Lf,dSi=Q/C.K0,dSr=-Q/toK(p.tr);return {Q,dSi,dSr,tot:dSi+dSr};},
  text:(p,G,T)=>`${G("m",`${p.m} kg`)} of ice at 0 °C sits in a room at ${G("tr",`${p.tr} °C`)} and slowly melts into water at 0 °C. The heat of fusion of ice is 333 kJ/kg. Find (a) the heat the ice absorbs, (b) the change in the ${T("entropy","entropy")} of the ice, and (c) the total entropy change of the ice and the room together.`,
  terms:{entropy:TERMS.entropy},
  given:p=>[
    {k:"m",sym:MM,name:"mass of ice",unit:"kg",val:p.m,why:"",look:"The mass in kg."},
    {k:"Lf",sym:LF,name:"heat of fusion",unit:"J/kg",val:C.Lf,why:"In J/kg: 333 kJ/kg = 333 000 J/kg.",look:"The heat of fusion, in J/kg.",gtraps:[[333,"Convert kJ/kg to J/kg: × 1000."]]},
    {k:"T0",sym:sb(mi("T"),"ice"),name:"melting temperature",unit:"K",val:C.K0,why:"0 °C in kelvin. Never divide by 0 °C!",look:"Not a number given directly: the melting point, in kelvin.",gtraps:[[0,"Kelvin: 0 °C = 273.15 K."]]},
    {k:"tr",sym:sb(mi("T"),"room"),name:"room temperature",unit:"K",val:toK(p.tr),why:"For part (c).",look:"The room temperature in kelvin.",gtraps:[[p.tr,"Use kelvin: add 273.15."]]}
  ],
  find:[{sym:QQ,name:"heat absorbed",unit:"J",why:"Part (a)."},{sym:sb(DS,"ice"),name:"entropy change of the ice",unit:"J/K",why:"Part (b)."},{sym:sb(DS,"total"),name:"total entropy change",unit:"J/K",why:"Part (c)."}],
  parts:[
    {id:"Q",label:"(a) Heat absorbed",sym:QQ,unit:"J",ans:(p,c)=>c.Q,traps:(p,c)=>clean([[p.m*333,"Use L in J/kg: 333 000."],[p.m*C.cw*p.tr,"The ice stays at 0 °C: it only melts. Q = mL."]],c.Q)},
    {id:"dSi",label:"(b) Entropy change of the ice",sym:sb(DS,"ice"),unit:"J/K",ans:(p,c)=>c.dSi,traps:(p,c)=>clean([[c.Q/toK(p.tr),"The ice melts at its own temperature, 273.15 K."],[c.Q/p.tr,"Divide by kelvin: 273.15 K."],[-c.dSi,"Heat flows into the ice, so its entropy goes up: positive."]],c.dSi)},
    {id:"tot",label:"(c) Total entropy change",sym:sb(DS,"total"),unit:"J/K",ans:(p,c)=>c.tot,traps:(p,c)=>clean([[c.dSi,"The room loses the same heat, at "+fmt(toK(p.tr))+" K: subtract Q/T_room."],[c.dSi-c.dSr,"The room loses heat, so its entropy change is negative: add −Q/T_room."],[0,"The heat flows from warm to cold, which is one-way, so the total goes up a little."]],c.tot)}
  ],
  idea:()=>`<p>When heat Q flows in at a fixed temperature T (in kelvin), the entropy rises by <b>Q/T</b>.</p>
    <ul class="plain"><li>(a) Melting needs Q = mL.</li><li>(b) The ice melts at 0 °C = 273.15 K the whole time.</li>
    <li>(c) The room gives up that same heat, at its own (warmer) temperature, so it loses Q/T_room. A warmer T means a smaller loss, so the total is positive: the second law at work.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${QQ}${OP("=")}${MM}${LF}${AND}${DS}${OP("=")}${FR(QQ,TT)}${AND}${sb(DS,"total")}${OP("=")}${FR(QQ,sb(mi("T"),"ice"))}${OP("−")}${FR(QQ,sb(mi("T"),"room"))}`)+
    legend([[DS,"entropy change","J/K"],[QQ,"heat in (negative if it flows out)","J"],[TT,"temperature where the heat flows","K"]]),
  plug:(p,c)=>EQ(`${QQ}${OP("=")}${p.m}${OP("×")}333000${AND}${sb(DS,"ice")}${OP("=")}${FR(QQ,"273.15")}${AND}${sb(DS,"room")}${OP("=")}${FR(`−${QQ}`,fmt(toK(p.tr)))}`)+calcTip(`${p.m}*333000/273.15`),
  solution:(p,c)=>steps([
      ["(a) Melting",CALC(`${QQ} = ${p.m} × 333 000 = <b>${fmt(c.Q)} J</b>`)],
      ["(b) Ice",CALC(`${sb(DS,"ice")} = ${fmt(c.Q)} ÷ 273.15 = <b>+${fmt(c.dSi)} J/K</b>`)],
      ["Room",CALC(`${sb(DS,"room")} = −${fmt(c.Q)} ÷ ${fmt(toK(p.tr))} = ${fmt(c.dSr)} J/K`)],
      ["(c) Total",CALC(`${sb(DS,"total")} = ${fmt(c.dSi)} ${pr(c.dSr)} = <b>+${fmt(c.tot)} J/K</b>`)]
    ])+checkline("Positive, as the second law demands: heat flowing from warm to cold always raises the total entropy.")+
    finalAns(`${QQ} = ${fmt(c.Q)} J, &nbsp;${sb(DS,"ice")} = ${fmt(c.dSi)} J/K, &nbsp;${sb(DS,"total")} = ${fmt(c.tot)} J/K`),
  sheet:[{name:"Entropy from heat at fixed T",eq:`${DS}${OP("=")}${FR(QQ,TT)}`,note:"T in kelvin; Q < 0 when heat leaves."}],
  takeEq:()=>`${DS}${OP("=")}${FR(QQ,TT)}`,
  takeaway:"ΔS = Q/T (kelvin) for heat at a fixed temperature. Heat flowing from warm to cold raises the total entropy.",
  link:"Your course list: “Entropy. The second law of thermodynamics.” This is the most direct use of ΔS = Q/T.",
  viz:viz.slider((p,c)=>({note:"Drag the room's temperature. The warmer the room, the bigger the total entropy gain. If the room were at 0 °C, the total would be zero (a reversible melt).",label:"Room temperature",unit:"°C",min:0,max:60,step:1,value:p.tr,
    bars:[{label:"Ice gains",segs:[{cls:"seg-ke",frac:()=>1}]},{label:"Room loses",segs:[{cls:"seg-heat",frac:x=>C.K0/toK(x)}]}],
    read:x=>`${sb(DS,"total")} = <b>+${fmt(c.Q/C.K0-c.Q/toK(x))} J/K</b>`})),
  scene:{still:2,draw(K,t,p){const u=mod(t,8),f=K.ease(Math.min(1,u/6));K.rect(0,0,600,220,{fill:"heat",c:false,alpha:0.06});beaker(K,220,70,160,130,0.15+0.35*f,{wave:t});
    const s=56*(1-f);if(s>4)ice(K,300,200-130*(0.15+0.35*f)-s*0.3,s,{});
    heatArrow(K,90,120,205,140,t,{amp:3});heatArrow(K,510,120,395,140,t+0.4,{amp:3});K.tag("0 °C",300,52,{size:11});K.tag(`room ${p.tr} °C`,90,40,{size:11});loopFade(K,t,8,0.6,0.3);}}
},

/* ===== Free expansion ===== */
{
  id:"s-free", level:"Medium", title:"Gas rushes into a vacuum", hw:"Course topic: entropy of an ideal gas",
  base:{n:2,V1:3,k:3,tc:20},
  random:()=>({n:pick([0.5,1,1.5,2,3,4]),V1:pick([1,2,3,5,10]),k:pick([2,3,4,5,10]),tc:pick([0,20,25,50])}),
  calc:p=>{const V2=p.V1*p.k,dS=p.n*C.R*Math.log(p.k);return {V2,dS,Qrev:toK(p.tc)*dS};},
  text:(p,G,T)=>`An insulated box is split by a thin wall. One side holds ${G("n",`${p.n} mol`)} of an ideal gas at ${G("tc",`${p.tc} °C`)} in ${G("V1",`${p.V1} L`)}; the other side is empty. The wall breaks and the gas fills the whole box, ${G("V2",`${p.V1*p.k} L`)} (a ${T("free","free expansion")}). Find (a) the work done by the gas, (b) its change in ${T("entropy","entropy")}, and (c) the heat a gas would have to absorb to make the same change slowly at constant temperature.`,
  terms:{free:TERMS.free,entropy:TERMS.entropy},
  given:p=>[
    {k:"n",sym:NN,name:"amount of gas",unit:"mol",val:p.n,why:"",look:"The number measured in mol."},
    {k:"V1",sym:V1,name:"starting volume",unit:"L",val:p.V1,why:"Only the ratio matters, so litres are fine.",look:"The volume the gas starts in."},
    {k:"V2",sym:V2,name:"final volume",unit:"L",val:p.V1*p.k,why:"",look:"The whole box's volume."},
    {k:"tc",sym:TT,name:"temperature",unit:"K",val:toK(p.tc),why:"Only needed for (c). It doesn't change: no work, no heat, so ΔU = 0.",look:"The temperature in kelvin.",gtraps:[[p.tc,"Use kelvin: add 273.15."]]},
    {k:"R",sym:RR,name:"gas constant",unit:"J/(mol·K)",val:C.R,why:"Not in the question: a constant you're expected to know.",look:"Not in the question: the gas constant."}
  ],
  find:[{sym:WW,name:"work done by the gas",unit:"J",why:"Part (a)."},{sym:DS,name:"entropy change",unit:"J/K",why:"Part (b)."},{sym:sb(QQ,"rev"),name:"heat on a slow path",unit:"J",why:"Part (c)."}],
  parts:[
    {id:"W",label:"(a) Work done by the gas",sym:WW,unit:"J",ans:()=>0,traps:(p,c)=>[[c.Qrev,"That's for a slow expansion pushing a piston. Rushing into a vacuum, the gas pushes nothing: W = 0."]],closeMsg:"Nothing to push in a vacuum: W = 0."},
    {id:"dS",label:"(b) Entropy change",sym:DS,unit:"J/K",ans:(p,c)=>c.dS,traps:(p,c)=>clean([[0,"Q = 0 here, but ΔS isn't Q/T for a one-way process. Use a slow path between the same start and end: ΔS = nR ln(V₂/V₁)."],[p.n*C.R*Math.log10(p.k),"Use the natural log."],[p.n*C.R*p.k,"Take the log of the ratio."],[C.k*Math.log(p.k),"For n moles, use nR (not k)."]],c.dS)},
    {id:"Q",label:"(c) Heat on a slow path",sym:sb(QQ,"rev"),unit:"J",ans:(p,c)=>c.Qrev,traps:(p,c)=>clean([[p.tc*c.dS,"Use kelvin."],[c.dS/toK(p.tc),"Multiply: Q = TΔS."]],c.Qrev)}
  ],
  idea:()=>`<p>Entropy is a property of the <b>state</b>, like temperature: its change depends only on where the gas starts and ends, not on how it got there.</p>
    <ul class="plain"><li>The real process is one-way and wild: no work (nothing to push), no heat (insulated), so ΔU = 0 and the temperature stays the same.</li>
    <li>To get ΔS, pick a <b>slow</b> path with the same start and end: a constant-temperature expansion. That path absorbs Q = nRT ln(V₂/V₁), so ΔS = Q/T = <b>nR ln(V₂/V₁)</b>.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${WW}${OP("=")}0${AND}${DS}${OP("=")}${NN}${RR}${OP(" ")}${LN}${PAREN(FR(V2,V1))}${AND}${sb(QQ,"rev")}${OP("=")}${TT}${DS}`)+
    legend([[DS,"entropy change","J/K"],[sb(QQ,"rev"),"heat on the slow, constant-temperature path","J"]],"ln is the natural log."),
  plug:(p,c)=>EQ(`${DS}${OP("=")}${p.n}${OP("×")}8.314${OP("×")}${LN}${PAREN(FR(c.V2,p.V1))}`)+calcTip(`${p.n}*8.314*ln(${p.k})`),
  solution:(p,c)=>steps([
      ["(a) Into a vacuum","Nothing to push: <b>W = 0</b>. Insulated: Q = 0. So ΔU = 0 and T stays the same."],
      ["(b) Slow path, same ends",CALC(`${DS} = ${p.n} × 8.314 × ln(${p.k}) = <b>+${fmt(c.dS)} J/K</b>`)],
      ["(c) Heat on that path",CALC(`${sb(QQ,"rev")} = ${fmt(toK(p.tc))} × ${fmt(c.dS)} = <b>${fmt(c.Qrev)} J</b>`)]
    ])+checkline("Entropy rose although no heat flowed: free expansion is one-way. The gas never squeezes itself back into one side.")+
    finalAns(`${WW} = 0, &nbsp;${DS} = ${fmt(c.dS)} J/K, &nbsp;${sb(QQ,"rev")} = ${fmt(c.Qrev)} J`),
  sheet:[{name:"Entropy of an ideal gas (constant T)",eq:`${DS}${OP("=")}${NN}${RR}${OP(" ")}${LN}${PAREN(FR(V2,V1))}`,note:"Also true for a free expansion."}],
  takeEq:()=>`${DS}${OP("=")}${NN}${RR}${OP(" ")}${LN}${PAREN(FR(V2,V1))}`,
  takeaway:"Free expansion: W = 0, Q = 0, ΔU = 0, but ΔS = nR ln(V₂/V₁) > 0. Find ΔS along a slow path with the same start and end.",
  link:"Uses the constant-temperature formula from “Slow expansion in a warm bath”. ΔS = Q_rev/T.",
  viz:viz.slider((p,c)=>({note:"Drag how many times bigger the box is. Each doubling adds the same amount of entropy, nR ln 2.",label:"V₂/V₁",unit:"",min:1,max:20,step:1,value:p.k,
    bars:[{label:"Entropy gained (full bar = 20 times)",segs:[{cls:"seg-ke",frac:x=>Math.log(x)/Math.log(20)}]}],
    read:x=>`${DS} = <b>${fmt(p.n*C.R*Math.log(x))} J/K</b>`})),
  scene:{still:1,draw(K,t,p){const u=mod(t,8),open=u>1.2;box(K,80,40,440,150,{fill:"card"});
    if(!open)K.line(80+440/p.k,40,80+440/p.k,190,{c:"ink",w:3});
    const w=open?Math.min(440,440/p.k+(440-440/p.k)*K.ease(Math.min(1,(u-1.2)/1.2))):440/p.k;gas(K,82,42,w-4,146,t,{n:24,v:80,r:4,seed:61});
    if(!open)K.text("vacuum",80+440/p.k+(440-440/p.k)/2,118,{size:12,c:"ink2"});K.text("insulated",300,210,{size:11,c:"ink2"});loopFade(K,t,8,0.6,0.3);}}
},

/* ===== Mixing hot and cold water ===== */
{
  id:"s-mix", level:"Hard", title:"Mixing hot and cold water", hw:"Course topic: entropy, second law",
  base:{m1:0.3,t1:80,m2:0.5,t2:10},
  random:()=>({m1:pick([0.1,0.2,0.3,0.4,0.5,1]),t1:pick([60,70,80,90]),m2:pick([0.2,0.3,0.5,0.8,1,2]),t2:pick([0,5,10,15,20])}),
  calc:p=>{const tf=(p.m1*p.t1+p.m2*p.t2)/(p.m1+p.m2),Tf=toK(tf),dh=p.m1*C.cw*Math.log(Tf/toK(p.t1)),dc=p.m2*C.cw*Math.log(Tf/toK(p.t2));return {tf,Tf,dh,dc,tot:dh+dc};},
  text:(p,G,T)=>`You pour ${G("m1",`${p.m1} kg`)} of water at ${G("t1",`${p.t1} °C`)} into ${G("m2",`${p.m2} kg`)} of water at ${G("t2",`${p.t2} °C`)} in an insulated jug (c = 4186 J/(kg·K)). Find (a) the final temperature, (b) the ${T("entropy","entropy")} change of the hot water, (c) the entropy change of the cold water, and (d) the total entropy change.`,
  terms:{entropy:TERMS.entropy,second:TERMS.second},
  given:p=>[
    {k:"m1",sym:M1,name:"hot water's mass",unit:"kg",val:p.m1,why:"",look:"The hot water's mass."},
    {k:"t1",sym:T1,name:"hot water's temperature",unit:"K",val:toK(p.t1),why:"Kelvin: it goes inside a log.",look:"The hot temperature in kelvin.",gtraps:[[p.t1,"Use kelvin: add 273.15."]]},
    {k:"m2",sym:M2,name:"cold water's mass",unit:"kg",val:p.m2,why:"",look:"The cold water's mass."},
    {k:"t2",sym:T2,name:"cold water's temperature",unit:"K",val:toK(p.t2),why:"",look:"The cold temperature in kelvin.",gtraps:[[p.t2,"Use kelvin: add 273.15."]]},
    {k:"c",sym:CW,name:"specific heat of water",unit:"J/(kg·K)",val:C.cw,why:"",look:"The specific heat."}
  ],
  find:[{sym:TF,name:"final temperature",unit:"°C",why:"Part (a)."},{sym:sb(DS,"hot"),name:"entropy change of the hot water",unit:"J/K",why:"Part (b). Negative: it loses heat."},{sym:sb(DS,"cold"),name:"entropy change of the cold water",unit:"J/K",why:"Part (c)."},{sym:sb(DS,"total"),name:"total",unit:"J/K",why:"Part (d)."}],
  parts:[
    {id:"tf",label:"(a) Final temperature",sym:TF,unit:"°C",ans:(p,c)=>c.tf,traps:(p,c)=>clean([[(p.t1+p.t2)/2,"Weight by mass: the bigger amount of water pulls the final temperature towards its own."],[(p.m2*p.t1+p.m1*p.t2)/(p.m1+p.m2),"The masses are swapped: each temperature is weighted by its own water's mass."]],c.tf)},
    {id:"dh",label:"(b) Entropy change of the hot water",sym:sb(DS,"hot"),unit:"J/K",ans:(p,c)=>c.dh,traps:(p,c)=>clean([[-c.dh,"The hot water loses heat, so its entropy goes down: negative."],[p.m1*C.cw*(c.tf-p.t1)/toK(p.t1),"The temperature changes as it cools, so ΔS isn't Q/T with one T: use mc ln(T_f/T₁)."],[p.m1*C.cw*Math.log(c.tf/p.t1),"Use kelvin inside the log."]],c.dh)},
    {id:"dc",label:"(c) Entropy change of the cold water",sym:sb(DS,"cold"),unit:"J/K",ans:(p,c)=>c.dc,traps:(p,c)=>clean([[-c.dh,"Same heat, but it enters at a lower temperature, so the entropy gain is bigger: use mc ln(T_f/T₂)."],[p.m2*C.cw*(c.tf-p.t2)/toK(p.t2),"Use mc ln(T_f/T₂): the temperature changes along the way."]],c.dc)},
    {id:"tot",label:"(d) Total entropy change",sym:sb(DS,"total"),unit:"J/K",ans:(p,c)=>c.tot,traps:(p,c)=>clean([[0,"The heat lost equals the heat gained, but the entropies don't cancel: add (b) and (c)."],[c.dc-c.dh,"(b) is already negative. Just add: ΔS_hot + ΔS_cold."]],c.tot)}
  ],
  idea:()=>`<p>(a) Heat lost by the hot water = heat gained by the cold, so the final temperature is the mass-weighted average.</p>
    <p>(b, c) The temperature changes while the heat flows, so you can't use Q/T with one T. Adding up tiny steps dQ/T gives <b>ΔS = mc ln(T_final/T_start)</b>, in kelvin: negative for the water that cools, positive for the water that warms.</p>
    <p>(d) The cold water gains more entropy than the hot water loses, so the total is positive. Mixing never un-mixes.</p>`,
  formula:()=>EQ(`${TF}${OP("=")}${FR(`${M1}${T1}${OP("+")}${M2}${T2}`,`${M1}${OP("+")}${M2}`)}${AND}${DS}${OP("=")}${MM}${CW}${OP(" ")}${LN}${PAREN(FR(TF,sb(mi("T"),"start")))}`)+
    legend([[TF,"final temperature (the average works in °C or K)",""],[DS,"entropy change","J/K"],[CW,"specific heat","J/(kg·K)"]],"Kelvin inside the log."),
  plug:(p,c)=>EQ(`${TF}${OP("=")}${FR(`${p.m1}${OP("×")}${p.t1}${OP("+")}${p.m2}${OP("×")}${p.t2}`,`${p.m1}${OP("+")}${p.m2}`)}${AND}${sb(DS,"hot")}${OP("=")}${p.m1}${OP("×")}4186${OP("×")}${LN}${PAREN(FR(TF,fmt(toK(p.t1))))}`)+calcTip(`${p.m1}*4186*ln(${R3(c.Tf)}/${R3(toK(p.t1))})`),
  solution:(p,c)=>steps([
      ["(a) Mix",CALC(`${TF} = (${p.m1} × ${p.t1} + ${p.m2} × ${p.t2}) ÷ ${fmt(p.m1+p.m2)} = <b>${fmt(c.tf)} °C</b>`)+` = ${fmt(c.Tf)} K`],
      ["(b) Hot water cools",CALC(`${sb(DS,"hot")} = ${p.m1} × 4186 × ln(${fmt(c.Tf)} ÷ ${fmt(toK(p.t1))}) = <b>${fmt(c.dh)} J/K</b>`)],
      ["(c) Cold water warms",CALC(`${sb(DS,"cold")} = ${p.m2} × 4186 × ln(${fmt(c.Tf)} ÷ ${fmt(toK(p.t2))}) = <b>+${fmt(c.dc)} J/K</b>`)],
      ["(d) Total",CALC(`${sb(DS,"total")} = ${fmt(c.dh)} + ${fmt(c.dc)} = <b>+${fmt(c.tot)} J/K</b>`)]
    ])+checkline("Small but positive, as the second law says it must be.")+
    finalAns(`${TF} = ${fmt(c.tf)} °C, &nbsp;${sb(DS,"hot")} = ${fmt(c.dh)} J/K, &nbsp;${sb(DS,"cold")} = ${fmt(c.dc)} J/K, &nbsp;${sb(DS,"total")} = ${fmt(c.tot)} J/K`),
  sheet:[{name:"Entropy when T changes",eq:`${DS}${OP("=")}${MM}${CW}${OP(" ")}${LN}${PAREN(FR(T2,T1))}`,note:"Kelvin. Negative when cooling."}],
  takeEq:()=>`${DS}${OP("=")}${MM}${CW}${OP(" ")}${LN}${PAREN(FR(T2,T1))}`,
  takeaway:"Heating or cooling: ΔS = mc ln(T₂/T₁) in kelvin. Mixing hot and cold always gives a positive total.",
  link:"Combines the mixing calculation from “Ice in a drink” with entropy. A common long exam question.",
  viz:viz.slider((p,c)=>({note:"Drag the hot water's temperature. The bigger the gap, the more entropy the mixing creates. With no gap, nothing happens.",label:"Hot water",unit:"°C",min:p.t2,max:100,step:1,value:p.t1,
    bars:[{label:"Total entropy created (full bar = at 100 °C)",segs:[{cls:"seg-ke",frac:x=>{const f=s=>{const tf=(p.m1*s+p.m2*p.t2)/(p.m1+p.m2);return p.m1*C.cw*Math.log(toK(tf)/toK(s))+p.m2*C.cw*Math.log(toK(tf)/toK(p.t2));};return f(x)/f(100);}}]}],
    read:x=>{const tf=(p.m1*x+p.m2*p.t2)/(p.m1+p.m2);return `${TF} = ${fmt(tf)} °C, &nbsp;${sb(DS,"total")} = <b>+${fmt(p.m1*C.cw*Math.log(toK(tf)/toK(x))+p.m2*C.cw*Math.log(toK(tf)/toK(p.t2)))} J/K</b>`;}})),
  scene:{still:2,draw(K,t,p){const u=mod(t,8),f=K.ease(Math.min(1,Math.max(0,(u-1)/3)));
    const hh=120*(1-f)+1;K.rect(110,180-hh,120,hh,{fill:"heat",c:false,alpha:0.35});K.line(110,40,110,180,{w:2.4});K.line(230,40,230,180,{w:2.4});K.line(110,180,230,180,{w:2.4});K.tag(`${p.t1} °C`,170,26,{size:11});
    const lv=0.35+0.4*f;beaker(K,340,60,170,140,lv,{wave:t,liquid:f>0.95?"blueSoft":"blueSoft"});
    const mixc=Math.min(1,Math.max(0,(u-3.5)/2));K.rect(340,200-140*lv,170,140*lv,{fill:"heat",c:false,alpha:0.25*(f*(1-mixc)+mixc*0.6)});
    if(f>0&&f<1)K.line(232,62,330,96,{c:"heat",w:6,alpha:0.5});K.tag(mixc>0.9?`${fmt((p.m1*p.t1+p.m2*p.t2)/(p.m1+p.m2))} °C`:`${p.t2} °C`,425,44,{size:11});K.text("insulated",425,214,{size:11,c:"ink2"});loopFade(K,t,8,0.6,0.3);}}
},

/* ===== Counting arrangements ===== */
{
  id:"s-micro", level:"Medium", title:"Will the gas ever un-mix?", hw:"Course topic: statistical meaning of entropy",
  base:{N:10,n:1},
  random:()=>({N:pick([4,5,6,8,10,12,20]),n:pick([0.5,1,2,3])}),
  calc:p=>({P:Math.pow(0.5,p.N)*100,dS:p.n*C.NA*C.k*Math.log(2),dSn:p.N*C.k*Math.log(2)}),
  text:(p,G,T)=>`A box holds ${G("N",`${p.N} molecules`)}, each equally likely to be in the left or right half at any moment. (a) What is the probability, in %, that all of them are in the left half at once? (b) By how much does the entropy go up when the molecules spread from the left half into the whole box? Use S = k ln Ω, where Ω is the number of ${T("micro","microstates")}. (c) The same for ${G("n",`${p.n} mol`)} of gas doubling its volume.`,
  terms:{micro:TERMS.micro},
  given:p=>[
    {k:"N",sym:NNm,name:"number of molecules",unit:"",val:p.N,why:"",look:"How many molecules."},
    {k:"n",sym:NN,name:"amount of gas in (c)",unit:"mol",val:p.n,why:"",look:"The number measured in mol."},
    {k:"kB",sym:KB,name:"Boltzmann constant",unit:"J/K",val:C.k,why:"Not in the question. Type 1.38e-23.",look:"Not in the question: the Boltzmann constant."},
    {k:"NA",sym:sb(mi("N"),"A"),name:"Avogadro's number",unit:"1/mol",val:C.NA,why:"Not in the question. Type 6.022e23.",look:"Not in the question: molecules per mole."}
  ],
  find:[{sym:PR,name:"probability all on the left",unit:"%",why:"Part (a)."},{sym:DS,name:"entropy gain for the "+"N molecules",unit:"J/K",why:"Part (b). Tiny!"},{sym:sb(DS,"mol"),name:"entropy gain for the moles",unit:"J/K",why:"Part (c)."}],
  parts:[
    {id:"P",label:"(a) Probability all on the left",sym:PR,unit:"%",ans:(p,c)=>c.P,traps:(p,c)=>clean([[50/p.N,"Each molecule has a ½ chance, and all must be on the left at once: multiply, (½)^N."],[c.P/100,"As a percentage: × 100."],[100*Math.pow(0.5,p.N-1),"Each of the "+p.N+" molecules has its own ½: (½)^"+p.N+"."]],c.P)},
    {id:"dS",label:"(b) Entropy gain for the molecules",sym:DS,unit:"J/K",ans:(p,c)=>c.dSn,traps:(p,c)=>clean([[C.k*Math.log(p.N),"Ω grows by 2^N (each molecule now has 2 places), so ΔS = k ln 2^N = Nk ln 2."],[p.N*C.k*Math.log10(2),"Natural log."],[p.N*C.k*2,"Take ln 2, not 2."]],c.dSn)},
    {id:"dSm",label:"(c) Entropy gain for the moles",sym:sb(DS,"mol"),unit:"J/K",ans:(p,c)=>c.dS,traps:(p,c)=>clean([[C.R*Math.log(2),"That's for 1 mol. Multiply by n."],[p.n*C.R*2,"Take ln 2."],[c.dSn,"That's for "+p.N+" molecules. A mole has 6.022 × 10²³."]],c.dS)}
  ],
  idea:()=>`<p>Boltzmann's idea: entropy counts the <b>number of ways</b> Ω the molecules can be arranged, S = k ln Ω.</p>
    <ul class="plain"><li>(a) Each molecule has a ½ chance of being on the left. All N at once: (½)<sup>N</sup>.</li>
    <li>(b) Once the whole box is open, each molecule has twice as many places to be, so Ω grows by 2 × 2 × … = 2<sup>N</sup>. ΔS = k ln 2<sup>N</sup> = <b>Nk ln 2</b>.</li>
    <li>(c) For n moles, N = nN<sub>A</sub>, and N<sub>A</sub>k = R. So ΔS = nR ln 2, the same answer the heat route gives.</li></ul>`,
  formula:()=>EQ(`${mi("S")}${OP("=")}${KB}${OP(" ")}${LN}${OM}${AND}${PR}${OP("=")}${PAREN(FR("1","2"))}<sup>${NNm}</sup>${AND}${DS}${OP("=")}${NNm}${KB}${OP(" ")}${LN}2${AND}${sb(DS,"mol")}${OP("=")}${NN}${RR}${OP(" ")}${LN}2`)+
    legend([[OM,"number of microstates",""],[KB,"Boltzmann constant","J/K"],[RR,"N_A k = 8.314","J/(mol·K)"]]),
  plug:(p,c)=>EQ(`${PR}${OP("=")}${PAREN(FR("1","2"))}<sup>${p.N}</sup>${AND}${DS}${OP("=")}${p.N}${OP("×")}1.38${OP("×")}10<sup>−23</sup>${OP("×")}${LN}2`)+calcTip(`${p.N}*1.38e-23*ln(2)`),
  solution:(p,c)=>steps([
      ["(a) All on the left",CALC(`${PR} = (½)<sup>${p.N}</sup> = ${fmt(c.P/100)} = <b>${fmt(c.P)} %</b>`)],
      ["(b) Ω × 2^N",CALC(`${DS} = ${p.N} × 1.38 × 10⁻²³ × ln 2 = <b>${fmt(c.dSn)} J/K</b>`)],
      ["(c) n moles",CALC(`${sb(DS,"mol")} = ${p.n} × 8.314 × ln 2 = <b>${fmt(c.dS)} J/K</b>`)]
    ])+checkline(`With ${p.N} molecules it happens now and then. With a mole the chance is (½)<sup>6×10²³</sup>: it will never be seen. That's why the second law looks absolute.`)+
    finalAns(`${PR} = ${fmt(c.P)} %, &nbsp;${DS} = ${fmt(c.dSn)} J/K, &nbsp;${sb(DS,"mol")} = ${fmt(c.dS)} J/K`),
  sheet:[{name:"Boltzmann entropy",eq:`${mi("S")}${OP("=")}${KB}${OP(" ")}${LN}${OM}`,note:"Doubling the space for N molecules: Ω × 2^N."}],
  takeEq:()=>`${mi("S")}${OP("=")}${KB}${OP(" ")}${LN}${OM}`,
  takeaway:"S = k ln Ω. Doubling the space multiplies Ω by 2^N, so ΔS = Nk ln 2 = nR ln 2. One-way processes are just overwhelmingly likely ones.",
  link:"The statistical meaning of entropy, from the same chapter as the second law. It agrees with “Gas rushes into a vacuum” for V₂ = 2V₁.",
  viz:viz.slider((p,c)=>({note:"Drag the number of molecules. The chance they all crowd into one half collapses towards zero.",label:"Molecules",unit:"",min:1,max:30,step:1,value:p.N,
    bars:[{label:"Chance all on the left (full bar = 50 %)",segs:[{cls:"seg-heat",frac:x=>Math.pow(0.5,x)/0.5}]}],
    read:x=>`${PR} = <b>${fmt(Math.pow(0.5,x)*100)} %</b> (1 in ${fmt(Math.pow(2,x))})`})),
  scene:{still:1,draw(K,t,p){box(K,100,40,400,150,{});K.line(300,40,300,190,{c:"ink2",w:1,alpha:0.4});const n=Math.min(p.N,20);let left=0;
    for(let i=0;i<n;i++){const x=104+392*tri(rnd(i,7)*2+t*0.12*(0.5+rnd(i,8))),y=44+142*tri(rnd(i,9)*2+t*0.1*(0.5+rnd(i,10)));if(x<300)left++;K.circle(x,y,6,{fill:"blue",c:false,alpha:0.85});}
    K.tag(`left: ${left}`,200,210,{size:11});K.tag(`right: ${n-left}`,400,210,{size:11});}}
}

]);
})();
