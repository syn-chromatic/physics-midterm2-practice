/* Heat engines, the Carnot cycle, the second law and refrigerators.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,EQ,CALC,IMPLIES,AND,PAREN,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,engineDiagram}=draw;

/* symbols used below */
const ETA=mi("η"),WW=mi("W"),QH=sb(mi("Q"),"H"),QL=sb(mi("Q"),"L"),TH=sb(mi("T"),"H"),TL=sb(mi("T"),"L"),PP=mi("P"),TT=mi("t"),DS=up("Δ")+mi("S"),KC=sb(mi("K"),"C"),EC=sb(mi("η"),"C"),FF=mi("f");
const TERMS={
  engine:["Heat engine","A machine that takes heat from something hot, turns part of it into work, and dumps the rest into something cold. A car engine, a power station."],
  carnot:["Carnot engine","An ideal, reversible engine. No engine working between the same two temperatures can be more efficient: η = 1 − T_L/T_H."],
  second:["Second law of thermodynamics","Heat can't be turned completely into work in a cycle: some must always be dumped into a colder place. So no engine beats the Carnot efficiency."],
  fridge:["Refrigerator","A heat engine run backwards: work pumps heat out of a cold place and dumps it into a warmer one."],
  cop:["Coefficient of performance","How good a refrigerator is: heat pulled out of the cold space ÷ work you pay for. It can be bigger than 1."],
  entropy:["Entropy","A measure of how spread out the energy is. Heat Q entering at temperature T changes the entropy by Q/T."]
};

PHYS.add("Engines & the second law",[

/* ===== Efficiency of a real engine ===== */
{
  id:"en-efficiency", level:"Easy", title:"How efficient is the engine?", hw:"Course topic: heat engines",
  base:{QH:12,W:3,f:25},
  random:()=>{const QH=pick([5,8,10,12,15,20,25,30]);return {QH,W:+(QH*pick([0.15,0.2,0.25,0.3,0.35,0.4])).toFixed(2),f:pick([10,20,25,30,40,50])};},
  calc:p=>({eta:p.W/p.QH*100,QL:p.QH-p.W,P:p.W*p.f}),
  text:(p,G,T)=>`In every cycle, a ${T("engine","heat engine")} takes ${G("QH",`${p.QH} kJ`)} of heat from its hot source and does ${G("W",`${p.W} kJ`)} of work. It runs ${G("f",`${p.f} cycles per second`)}. Find (a) its efficiency, (b) the heat it dumps into the cold surroundings every cycle, and (c) its power output in kW.`,
  terms:{engine:TERMS.engine},
  given:p=>[
    {k:"QH",sym:QH,name:"heat taken in per cycle",unit:"kJ",val:p.QH,why:"Staying in kJ is fine here.",look:"The heat from the hot source."},
    {k:"W",sym:WW,name:"work per cycle",unit:"kJ",val:p.W,why:"",look:"The work done each cycle."},
    {k:"f",sym:FF,name:"cycles per second",unit:"1/s",val:p.f,why:"",look:"How many cycles per second."}
  ],
  find:[{sym:ETA,name:"efficiency",unit:"%",why:"Part (a)."},{sym:QL,name:"heat dumped per cycle",unit:"kJ",why:"Part (b)."},{sym:PP,name:"power output",unit:"kW",why:"Part (c). kJ per second = kW."}],
  parts:[
    {id:"eta",label:"(a) Efficiency",sym:ETA,unit:"%",ans:(p,c)=>c.eta,traps:(p,c)=>clean([[p.QH/p.W*100,"Upside down: η = W ÷ Q_H, always below 100 %."],[c.eta/100,"Give it as a percentage: × 100."],[p.W/c.QL*100,"Divide by the heat taken in, Q_H, not the heat dumped."]],c.eta)},
    {id:"QL",label:"(b) Heat dumped per cycle",sym:QL,unit:"kJ",ans:(p,c)=>c.QL,traps:(p,c)=>clean([[p.QH+p.W,"Energy is conserved: Q_H = W + Q_L, so Q_L = Q_H − W."],[p.W,"That's the work. The heat dumped is what's left over: Q_H − W."]],c.QL)},
    {id:"P",label:"(c) Power output",sym:PP,unit:"kW",ans:(p,c)=>c.P,traps:(p,c)=>clean([[p.W/p.f,"Multiply by the cycles per second, don't divide."],[p.QH*p.f,"Power output is the work per second, not the heat taken in."],[c.P*1000,"That's in W. kJ/s = kW."]],c.P)}
  ],
  idea:()=>`<p>An engine is an energy bookkeeper. Each cycle:</p>
    <ul class="plain"><li>heat <b>in</b> from the hot side = work <b>out</b> + heat <b>dumped</b> to the cold side (the gas comes back to where it started, so nothing is stored);</li>
    <li><b>efficiency</b> = what you get (work) ÷ what you pay for (heat in);</li><li><b>power</b> = work per cycle × cycles per second.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${ETA}${OP("=")}${FR(WW,QH)}${AND}${QH}${OP("=")}${WW}${OP("+")}${QL}${AND}${PP}${OP("=")}${WW}${FF}`)+
    legend([[ETA,"efficiency",""],[QH,"heat taken from the hot side",""],[QL,"heat dumped to the cold side",""],[WW,"work per cycle",""],[FF,"cycles per second","1/s"]]),
  plug:(p,c)=>EQ(`${ETA}${OP("=")}${FR(p.W,p.QH)}${AND}${QL}${OP("=")}${p.QH}${OP("−")}${p.W}${AND}${PP}${OP("=")}${p.W}${OP("×")}${p.f}`),
  solution:(p,c)=>steps([
      ["(a) Efficiency",CALC(`${ETA} = ${p.W} ÷ ${p.QH} = ${fmt(c.eta/100)} = <b>${fmt(c.eta)} %</b>`)],
      ["(b) Energy balance",CALC(`${QL} = ${p.QH} − ${p.W} = <b>${fmt(c.QL)} kJ</b>`)],
      ["(c) Power",CALC(`${PP} = ${p.W} kJ × ${p.f} /s = <b>${fmt(c.P)} kW</b>`)]
    ])+finalAns(`${ETA} = ${fmt(c.eta)} %, &nbsp;${QL} = ${fmt(c.QL)} kJ, &nbsp;${PP} = ${fmt(c.P)} kW`),
  sheet:[{name:"Heat engine",eq:`${ETA}${OP("=")}${FR(WW,QH)}${OP("=")}1${OP("−")}${FR(QL,QH)}`,note:"Q_H = W + Q_L."}],
  takeEq:()=>`${ETA}${OP("=")}${FR(WW,QH)}`,
  takeaway:"Efficiency = W/Q_H; energy balance Q_H = W + Q_L; power = work × cycles per second.",
  link:"Your course list: “Heat engines. The second law of thermodynamics.” The Carnot engine (next) sets the upper limit.",
  viz:viz.slider((p,c)=>({note:"Drag the work per cycle. Whatever isn't turned into work has to be dumped as heat.",label:"Work per cycle",unit:"kJ",min:0,max:p.QH,step:0.1,value:p.W,
    bars:[{label:`Heat in, ${p.QH} kJ`,segs:[{cls:"seg-alt",name:"work",frac:x=>x/p.QH},{cls:"seg-heat",name:"dumped",frac:x=>1-x/p.QH}]}],
    read:x=>`${ETA} = <b>${fmt(x/p.QH*100)} %</b>, &nbsp;${QL} = ${fmt(p.QH-x)} kJ`})),
  scene:{still:1,draw(K,t,p){engineDiagram(K,t,{hotLabel:"Hot source",coldLabel:"Cold surroundings",tags:[[`${p.QH} kJ`,370,70,"heat"],[`${p.W} kJ`,400,96,"ok"],[`${fmt(p.QH-p.W)} kJ`,370,152,"blue"]]});}}
},

/* ===== HW 4: a Carnot engine ===== */
{
  id:"en-carnot", level:"Medium", title:"Carnot engine", hw:"HW 4, task 3",
  base:{TH:879,TL:293,W:1.85,t:0.32},
  random:()=>({TH:pick([500,600,700,800,879,900,1000,1200]),TL:pick([273,280,293,300,320]),W:pick([0.8,1.2,1.5,1.85,2.4,3,4.5]),t:pick([0.1,0.2,0.25,0.32,0.4,0.5])}),
  calc:p=>{const e=1-p.TL/p.TH,QH=p.W/e,QL=QH-p.W;return {e,eta:e*100,P:p.W*1000/p.t,QH,QL,dS:QH*1000/p.TH};},
  text:(p,G,T)=>`A ${T("carnot","Carnot engine")} works between temperatures ${G("TH",`T_H = ${p.TH} K`)} and ${G("TL",`T_L = ${p.TL} K`)}. It does ${G("W",`${p.W} kJ`)} of work in a single cycle lasting ${G("t",`${p.t} s`)}. (a) What is its efficiency and average power? (b) How much heat does it take from the hot reservoir, and deliver to the cold reservoir, per cycle? (c) By how much does the ${T("entropy","entropy")} of the working substance change because of the heat it receives from the hot reservoir?`,
  terms:{carnot:TERMS.carnot,entropy:TERMS.entropy},
  given:p=>[
    {k:"TH",sym:TH,name:"hot temperature",unit:"K",val:p.TH,why:"",look:"The higher temperature."},
    {k:"TL",sym:TL,name:"cold temperature",unit:"K",val:p.TL,why:"",look:"The lower temperature."},
    {k:"W",sym:WW,name:"work per cycle",unit:"J",val:p.W*1000,why:"In joules, for the power in watts.",look:"The work, in J (× 1000).",gtraps:[[p.W,"Convert kJ to J: × 1000."]]},
    {k:"t",sym:TT,name:"time for one cycle",unit:"s",val:p.t,why:"",look:"How long one cycle lasts."}
  ],
  find:[{sym:ETA,name:"efficiency",unit:"%",why:"Part (a)."},{sym:PP,name:"average power",unit:"W",why:"Part (a)."},{sym:QH,name:"heat from the hot reservoir",unit:"kJ",why:"Part (b)."},{sym:QL,name:"heat to the cold reservoir",unit:"kJ",why:"Part (b)."},{sym:DS,name:"entropy change from the hot reservoir",unit:"J/K",why:"Part (c)."}],
  parts:[
    {id:"eta",label:"(a) Efficiency",sym:ETA,unit:"%",ans:(p,c)=>c.eta,traps:(p,c)=>clean([[p.TL/p.TH*100,"That's T_L/T_H. Efficiency is 1 minus that."],[(1-p.TH/p.TL)*100,"Upside down: η = 1 − T_L/T_H (cold on top)."],[c.e,"Give it as a percentage: × 100."]],c.eta)},
    {id:"P",label:"(a) Average power",sym:PP,unit:"W",ans:(p,c)=>c.P,traps:(p,c)=>clean([[p.W/p.t,"That's in kW. Use the work in joules for watts."],[p.W*1000*p.t,"Divide by the time: P = W ÷ t."],[c.QH*1000/p.t,"Power output is work per second, not the heat taken in."]],c.P)},
    {id:"QH",label:"(b) Heat from the hot reservoir",sym:QH,unit:"kJ",ans:(p,c)=>c.QH,traps:(p,c)=>clean([[p.W*c.e,"Divide by the efficiency: Q_H = W ÷ η (Q_H is bigger than W)."],[c.QL,"That's the heat dumped to the cold side."],[p.W/(p.TL/p.TH),"Use the efficiency η = 1 − T_L/T_H."]],c.QH)},
    {id:"QL",label:"(b) Heat to the cold reservoir",sym:QL,unit:"kJ",ans:(p,c)=>c.QL,traps:(p,c)=>clean([[c.QH+p.W,"Q_L = Q_H − W: the cold side gets what isn't turned into work."],[c.QH,"That's the heat from the hot side."]],c.QL)},
    {id:"dS",label:"(c) Entropy change from the hot reservoir",sym:DS,unit:"J/K",ans:(p,c)=>c.dS,traps:(p,c)=>clean([[c.QH/p.TH,"Use Q_H in joules: × 1000."],[p.W*1000/p.TH,"Use the heat Q_H, not the work."],[c.QH*1000*p.TH,"Divide by the temperature: ΔS = Q/T."]],c.dS)}
  ],
  idea:()=>`<p>A Carnot engine is the ideal engine, so its efficiency depends <b>only</b> on the two temperatures (in kelvin): η = 1 − T_L/T_H.</p>
    <ul class="plain"><li>Power = work per cycle ÷ time per cycle.</li><li>η = W/Q_H, so Q_H = W/η. The rest, Q_L = Q_H − W, goes to the cold side.</li>
    <li>(c) Heat Q entering at a fixed temperature T changes the entropy by Q/T. Over the whole cycle the gas gains Q_H/T_H and loses Q_L/T_L: equal amounts, so the net change is zero.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${ETA}${OP("=")}1${OP("−")}${FR(TL,TH)}${AND}${PP}${OP("=")}${FR(WW,TT)}${AND}${QH}${OP("=")}${FR(WW,ETA)}${AND}${QL}${OP("=")}${QH}${OP("−")}${WW}${AND}${DS}${OP("=")}${FR(QH,TH)}`)+
    legend([[ETA,"Carnot efficiency",""],[QH,"heat from the hot side","J"],[QL,"heat to the cold side","J"],[DS,"entropy change","J/K"]],"Temperatures in kelvin."),
  plug:(p,c)=>EQ(`${ETA}${OP("=")}1${OP("−")}${FR(p.TL,p.TH)}${AND}${PP}${OP("=")}${FR(p.W*1000,p.t)}${AND}${QH}${OP("=")}${FR(p.W,fmt(c.e))}`)+calcTip(`${p.W}/(1-${p.TL}/${p.TH})`," That's Q_H in kJ."),
  solution:(p,c)=>steps([
      ["(a) Efficiency",CALC(`${ETA} = 1 − ${p.TL} ÷ ${p.TH} = ${fmt(c.e)} = <b>${fmt(c.eta)} %</b>`)],
      ["(a) Power",CALC(`${PP} = ${p.W*1000} J ÷ ${p.t} s = <b>${fmt(c.P)} W</b>`)],
      ["(b) Heat from the hot side",CALC(`${QH} = ${p.W} ÷ ${fmt(c.e)} = <b>${fmt(c.QH)} kJ</b>`)],
      ["(b) Heat to the cold side",CALC(`${QL} = ${fmt(c.QH)} − ${p.W} = <b>${fmt(c.QL)} kJ</b>`)],
      ["(c) Entropy",CALC(`${DS} = ${fmt(c.QH*1000)} ÷ ${p.TH} = <b>+${fmt(c.dS)} J/K</b>`)]
    ])+checkline(`From the cold side the gas loses ${fmt(c.QL*1000)} ÷ ${p.TL} = ${fmt(c.QL*1000/p.TL)} J/K, the same amount, so over a full cycle ΔS = 0 ✓`)+
    finalAns(`${ETA} = ${fmt(c.eta)} %, &nbsp;${PP} = ${fmt(c.P)} W, &nbsp;${QH} = ${fmt(c.QH)} kJ, &nbsp;${QL} = ${fmt(c.QL)} kJ, &nbsp;${DS} = ${fmt(c.dS)} J/K`),
  sheet:[{name:"Carnot efficiency",eq:`${EC}${OP("=")}1${OP("−")}${FR(TL,TH)}`,note:"T in kelvin. The maximum possible."},{name:"Entropy from heat at fixed T",eq:`${DS}${OP("=")}${FR(mi("Q"),mi("T"))}`,note:"Carnot cycle: Q_H/T_H = Q_L/T_L."}],
  takeEq:()=>`${EC}${OP("=")}1${OP("−")}${FR(TL,TH)}`,
  takeaway:"Carnot: η = 1 − T_L/T_H (kelvin). Q_H = W/η, Q_L = Q_H − W, and Q_H/T_H = Q_L/T_L, so ΔS over the cycle is 0.",
  link:"This is HW 4, task 3: with the first numbers (879 K, 293 K, 1.85 kJ, 0.32 s) your answers are exactly the homework's.",
  viz:plot((p,c)=>({note:"Carnot efficiency against the hot temperature, with the cold side fixed. Drag T_H: the hotter the source, the better, but never 100 %.",label:"Hot temperature",unit:"K",min:p.TL+10,max:2000,step:10,value:p.TH,x:[0,2000],y:[0,100],xl:"T_H (K) →",yl:"η (%)",
    curves:()=>{const a=[];for(let k=0;k<=80;k++){const T=p.TL+1+(2000-p.TL-1)*k/80;a.push([T,(1-p.TL/T)*100]);}return [{pts:a,cls:"main"}];},
    point:s=>[s,(1-p.TL/s)*100],read:s=>`${ETA} = <b>${fmt((1-p.TL/s)*100)} %</b>, &nbsp;${QH} = ${fmt(p.W/(1-p.TL/s))} kJ`})),
  scene:{still:1,draw(K,t,p){engineDiagram(K,t,{hotLabel:`${p.TH} K`,coldLabel:`${p.TL} K`,tags:[[`Q_H = ${fmt(p.W/(1-p.TL/p.TH))} kJ`,390,70,"heat"],[`W = ${p.W} kJ`,400,96,"ok"],[`Q_L`,350,152,"blue"]]});}}
},

/* ===== Is the inventor's claim possible? ===== */
{
  id:"en-claim", level:"Medium", title:"Too good to be true?", hw:"Course topic: second law of thermodynamics",
  base:{tH:250,tL:20,QH:100,W:55},
  random:()=>{const tH=pick([150,200,250,300,400,500]),tL=pick([10,15,20,25,30]),QH=pick([50,80,100,120,200]);return {tH,tL,QH,W:Math.round(QH*pick([0.2,0.3,0.4,0.5,0.55,0.6,0.7])) };},
  calc:p=>{const TH=toK(p.tH),TL=toK(p.tL),ec=(1-TL/TH)*100,claim=p.W/p.QH*100;return {TH,TL,ec,claim,Wmax:p.QH*(1-TL/TH),ok:claim<=ec};},
  text:(p,G,T)=>`An inventor says her new engine takes ${G("QH",`${p.QH} kJ`)} of heat from steam at ${G("tH",`${p.tH} °C`)}, dumps the waste heat into a river at ${G("tL",`${p.tL} °C`)}, and does ${G("W",`${p.W} kJ`)} of work. Find (a) the efficiency she claims, (b) the highest efficiency any engine could have between these temperatures, and (c) the most work any engine could get from ${p.QH} kJ here. Does her claim break the ${T("second","second law")}?`,
  terms:{second:TERMS.second},
  given:p=>[
    {k:"QH",sym:QH,name:"heat taken in",unit:"kJ",val:p.QH,why:"",look:"The heat from the steam."},
    {k:"W",sym:WW,name:"claimed work",unit:"kJ",val:p.W,why:"",look:"The work she says it does."},
    {k:"tH",sym:TH,name:"steam temperature",unit:"K",val:toK(p.tH),why:"The Carnot limit needs kelvin.",look:"The hot temperature in kelvin.",gtraps:[[p.tH,"Use kelvin: add 273.15. In °C the efficiency comes out far too high."]]},
    {k:"tL",sym:TL,name:"river temperature",unit:"K",val:toK(p.tL),why:"",look:"The cold temperature in kelvin.",gtraps:[[p.tL,"Use kelvin: add 273.15."]]}
  ],
  find:[{sym:sb(ETA,"claim"),name:"claimed efficiency",unit:"%",why:"Part (a)."},{sym:EC,name:"Carnot (maximum) efficiency",unit:"%",why:"Part (b)."},{sym:sb(WW,"max"),name:"most work possible",unit:"kJ",why:"Part (c)."}],
  parts:[
    {id:"cl",label:"(a) Claimed efficiency",sym:sb(ETA,"claim"),unit:"%",ans:(p,c)=>c.claim,traps:(p,c)=>clean([[p.QH/p.W*100,"η = W ÷ Q_H."],[c.claim/100,"As a percentage: × 100."]],c.claim)},
    {id:"ec",label:"(b) Highest possible efficiency",sym:EC,unit:"%",ans:(p,c)=>c.ec,traps:(p,c)=>clean([[(1-p.tL/p.tH)*100,"Use kelvin! In °C you get "+fmt((1-p.tL/p.tH)*100)+" %, far too high."],[c.TL/c.TH*100,"η = 1 − T_L/T_H."]],c.ec)},
    {id:"Wm",label:"(c) Most work possible",sym:sb(WW,"max"),unit:"kJ",ans:(p,c)=>c.Wmax,traps:(p,c)=>clean([[p.QH*(1-p.tL/p.tH),"Use kelvin for the Carnot efficiency."],[p.QH,"Some heat must always be dumped: W_max = η_C × Q_H."]],c.Wmax)}
  ],
  idea:()=>`<p>The second law sets a hard ceiling: no engine working between two temperatures can beat a Carnot engine between the same temperatures.</p>
    <ul class="plain"><li>Work out what she claims: W/Q_H.</li><li>Work out the ceiling: 1 − T_L/T_H, with kelvin.</li><li>If the claim is above the ceiling, it's impossible, however clever the design.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${sb(ETA,"claim")}${OP("=")}${FR(WW,QH)}${AND}${EC}${OP("=")}1${OP("−")}${FR(TL,TH)}${AND}${sb(WW,"max")}${OP("=")}${EC}${QH}`)+legend([[EC,"Carnot efficiency, the ceiling",""],[TH,"hot temperature","K"],[TL,"cold temperature","K"]]),
  plug:(p,c)=>EQ(`${sb(ETA,"claim")}${OP("=")}${FR(p.W,p.QH)}${AND}${EC}${OP("=")}1${OP("−")}${FR(fmt(c.TL),fmt(c.TH))}`)+calcTip(`1-${R3(c.TL)}/${R3(c.TH)}`),
  solution:(p,c)=>steps([
      ["(a) Claim",CALC(`${sb(ETA,"claim")} = ${p.W} ÷ ${p.QH} = <b>${fmt(c.claim)} %</b>`)],
      ["(b) Ceiling",CALC(`${EC} = 1 − ${fmt(c.TL)} ÷ ${fmt(c.TH)} = <b>${fmt(c.ec)} %</b>`)],
      ["(c) Most work",CALC(`${sb(WW,"max")} = ${fmt(c.ec/100)} × ${p.QH} = <b>${fmt(c.Wmax)} kJ</b>`)]
    ])+checkline(c.ok?`${fmt(c.claim)} % is below the ${fmt(c.ec)} % ceiling, so the second law allows it (though real engines usually fall well short of Carnot).`:`${fmt(c.claim)} % is above the ${fmt(c.ec)} % ceiling: <b>impossible</b>. It would break the second law.`)+
    finalAns(`${sb(ETA,"claim")} = ${fmt(c.claim)} %, &nbsp;${EC} = ${fmt(c.ec)} %, &nbsp;${sb(WW,"max")} = ${fmt(c.Wmax)} kJ: ${c.ok?"possible":"impossible"}`),
  sheet:[{name:"Second law test",eq:`${ETA}${OP("≤")}1${OP("−")}${FR(TL,TH)}`,note:"No engine beats Carnot."}],
  takeEq:()=>`${ETA}${OP("≤")}1${OP("−")}${FR(TL,TH)}`,
  takeaway:"To test any engine claim: compare W/Q_H with 1 − T_L/T_H (kelvin). Above it is impossible.",
  link:"A classic exam twist on the Carnot formula: the same numbers, but you have to judge a claim.",
  viz:viz.slider((p,c)=>({note:"Drag the steam's temperature. The ceiling rises with it; see when her claim becomes possible.",label:"Steam temperature",unit:"°C",min:p.tL+10,max:1000,step:10,value:p.tH,
    bars:[{label:"Carnot ceiling",segs:[{cls:"seg-ke",frac:x=>1-c.TL/toK(x)}]},{label:"Her claim",segs:[{cls:"seg-heat",frac:()=>c.claim/100}]}],
    read:x=>{const e=(1-c.TL/toK(x))*100;return `${EC} = <b>${fmt(e)} %</b>: ${c.claim<=e?"claim possible":"claim impossible"}`;}})),
  scene:{still:1,draw(K,t,p){engineDiagram(K,t,{hotLabel:`steam ${p.tH} °C`,coldLabel:`river ${p.tL} °C`,tags:[[`${p.QH} kJ`,360,70,"heat"],[`${p.W} kJ ?`,405,96,"ok"]]});}}
},

/* ===== Refrigerator ===== */
{
  id:"en-fridge", level:"Hard", title:"Ideal refrigerator", hw:"Course topic: refrigerators and heat pumps",
  base:{tin:4,tout:25,QL:300},
  random:()=>({tin:pick([-18,-10,0,2,4,5]),tout:pick([20,22,25,30,35]),QL:pick([100,150,200,300,400,500,800])}),
  calc:p=>{const TL=toK(p.tin),TH=toK(p.tout),K=TL/(TH-TL),W=p.QL/K;return {TL,TH,K,W,QH:p.QL+W};},
  text:(p,G,T)=>`An ideal (Carnot) ${T("fridge","refrigerator")} keeps its inside at ${G("tin",`${fmt(p.tin)} °C`)} in a kitchen at ${G("tout",`${p.tout} °C`)}. It has to pull ${G("QL",`${p.QL} kJ`)} of heat out of the food. Find (a) its ${T("cop","coefficient of performance")}, (b) the electrical work needed, in kJ, and (c) the heat it releases into the kitchen.`,
  terms:{fridge:TERMS.fridge,cop:TERMS.cop},
  given:p=>[
    {k:"tin",sym:TL,name:"inside temperature",unit:"K",val:toK(p.tin),why:"Kelvin!",look:"The cold temperature in kelvin.",gtraps:[[p.tin,"Use kelvin: add 273.15."]]},
    {k:"tout",sym:TH,name:"kitchen temperature",unit:"K",val:toK(p.tout),why:"Kelvin!",look:"The kitchen temperature in kelvin.",gtraps:[[p.tout,"Use kelvin: add 273.15."]]},
    {k:"QL",sym:QL,name:"heat pulled out of the food",unit:"kJ",val:p.QL,why:"",look:"The heat taken from inside."}
  ],
  find:[{sym:KC,name:"coefficient of performance",unit:"",why:"Part (a). No unit."},{sym:WW,name:"work needed",unit:"kJ",why:"Part (b)."},{sym:QH,name:"heat released into the kitchen",unit:"kJ",why:"Part (c)."}],
  parts:[
    {id:"K",label:"(a) Coefficient of performance",sym:KC,unit:"",ans:(p,c)=>c.K,traps:(p,c)=>clean([[c.TH/(c.TH-c.TL),"That's for a heat pump (heat delivered to the warm side). A fridge counts the heat taken out: T_L/(T_H − T_L)."],[1-c.TL/c.TH,"That's an engine's efficiency. A fridge's COP is T_L/(T_H − T_L)."],[p.tin/(p.tout-p.tin),"Use kelvin for T_L on top: "+fmt(p.tin)+" °C = "+fmt(c.TL)+" K."]],c.K)},
    {id:"W",label:"(b) Work needed",sym:WW,unit:"kJ",ans:(p,c)=>c.W,traps:(p,c)=>clean([[p.QL*c.K,"Divide by the COP: W = Q_L ÷ K."],[p.QL,"An ideal fridge needs much less work than the heat it moves: W = Q_L ÷ K."]],c.W)},
    {id:"QH",label:"(c) Heat released into the kitchen",sym:QH,unit:"kJ",ans:(p,c)=>c.QH,traps:(p,c)=>clean([[p.QL-c.W,"Add the work: the kitchen gets the heat from the food plus the electrical energy, Q_H = Q_L + W."],[p.QL,"The kitchen gets more than Q_L: the work also ends up as heat."]],c.QH)}
  ],
  idea:()=>`<p>A refrigerator is an engine run backwards: you pay work W to move heat Q_L out of the cold inside and dump Q_H into the warm kitchen.</p>
    <ul class="plain"><li>Energy: <b>Q_H = Q_L + W</b> (the kitchen gets both).</li><li>Its score is the coefficient of performance, <b>K = Q_L/W</b>: what you want ÷ what you pay.</li>
    <li>For an ideal (Carnot) fridge, K depends only on the temperatures: <b>K = T_L/(T_H − T_L)</b>, in kelvin.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${KC}${OP("=")}${FR(QL,WW)}${OP("=")}${FR(TL,`${TH}${OP("−")}${TL}`)}${AND}${QH}${OP("=")}${QL}${OP("+")}${WW}`)+
    legend([[KC,"coefficient of performance",""],[QL,"heat pulled out of the cold inside",""],[QH,"heat released to the warm room",""],[WW,"work (electrical energy)",""]],"Temperatures in kelvin."),
  plug:(p,c)=>EQ(`${KC}${OP("=")}${FR(fmt(c.TL),`${fmt(c.TH)}${OP("−")}${fmt(c.TL)}`)}${AND}${WW}${OP("=")}${FR(p.QL,KC)}`)+calcTip(`${R3(c.TL)}/(${R3(c.TH)}-${R3(c.TL)})`),
  solution:(p,c)=>steps([
      ["Kelvin",`${TL} = ${fmt(c.TL)} K, &nbsp;${TH} = ${fmt(c.TH)} K`],
      ["(a) COP",CALC(`${KC} = ${fmt(c.TL)} ÷ ${fmt(c.TH-c.TL)} = <b>${fmt(c.K)}</b>`)],
      ["(b) Work",CALC(`${WW} = ${p.QL} ÷ ${fmt(c.K)} = <b>${fmt(c.W)} kJ</b>`)],
      ["(c) Heat to the kitchen",CALC(`${QH} = ${p.QL} + ${fmt(c.W)} = <b>${fmt(c.QH)} kJ</b>`)]
    ])+checkline(`Every 1 kJ of electricity moves ${fmt(c.K)} kJ of heat out of the fridge. The smaller the temperature gap, the easier it is: that's why you shouldn't put a fridge next to the oven.`)+
    finalAns(`${KC} = ${fmt(c.K)}, &nbsp;${WW} = ${fmt(c.W)} kJ, &nbsp;${QH} = ${fmt(c.QH)} kJ`),
  sheet:[{name:"Refrigerator (Carnot)",eq:`${KC}${OP("=")}${FR(QL,WW)}${OP("=")}${FR(TL,`${TH}${OP("−")}${TL}`)}`,note:"Q_H = Q_L + W. Heat pump: T_H/(T_H − T_L)."}],
  takeEq:()=>`${KC}${OP("=")}${FR(TL,`${TH}${OP("−")}${TL}`)}`,
  takeaway:"Fridge: K = Q_L/W = T_L/(T_H − T_L) in kelvin; the room gets Q_H = Q_L + W.",
  link:"The engine run backwards. Same Carnot temperatures, but now the work goes in.",
  viz:viz.slider((p,c)=>({note:"Drag the kitchen's temperature. The bigger the gap between inside and outside, the more work every kilojoule of cooling costs.",label:"Kitchen temperature",unit:"°C",min:p.tin+2,max:50,step:1,value:p.tout,
    bars:[{label:`Work needed to pull out ${p.QL} kJ (full bar = ${p.QL} kJ)`,segs:[{cls:"seg-alt",frac:x=>(toK(x)-c.TL)/c.TL}]}],
    read:x=>{const k=c.TL/(toK(x)-c.TL);return `${KC} = <b>${fmt(k)}</b>, &nbsp;${WW} = ${fmt(p.QL/k)} kJ`;}})),
  scene:{still:1,draw(K,t,p){engineDiagram(K,t,{fridge:true,hotLabel:`kitchen ${p.tout} °C`,coldLabel:`inside ${fmt(p.tin)} °C`,tags:[[`${p.QL} kJ`,360,152,"blue"],["W",400,96,"ok"],["Q_H",350,70,"heat"]]});}}
}

]);
})();
