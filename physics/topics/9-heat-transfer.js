/* Heat transfer: conduction through walls (one layer and two) and radiation (Stefan–Boltzmann).
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,EQ,CALC,IMPLIES,AND,PAREN,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,tri,rnd,heatArrow,thermo,loopFade}=draw;

/* symbols used below */
const PP=mi("P"),KK=mi("k"),AA=mi("A"),LL=mi("L"),DT=up("Δ")+mi("T"),QQ=mi("Q"),TT=mi("t"),RT=sb(mi("R"),"th"),SIG=mi("σ"),EPS=mi("ε"),TH=mi("T"),TE=sb(mi("T"),"room");
const K1=sb(mi("k"),"1"),K2=sb(mi("k"),"2"),L1=sb(mi("L"),"1"),L2=sb(mi("L"),"2"),R1=sb(mi("R"),"1"),R2=sb(mi("R"),"2"),TM=sb(mi("T"),"between");
const TERMS={
  cond:["Thermal conductivity","How easily heat flows through a material, in W/(m·K). Metals: hundreds. Glass: about 1. Foam insulation: a few hundredths."],
  rate:["Rate of heat flow","How many joules of heat pass through every second, in watts."],
  emis:["Emissivity","How well a surface radiates compared with a perfect radiator (a “black body”). 1 is perfect; human skin is about 0.97."],
  sb:["Stefan–Boltzmann law","Every object radiates heat. The power is εσAT⁴, with T in kelvin. Because of the fourth power, hotter objects radiate far more."]
};

PHYS.add("Heat transfer",[

/* ===== Heat through a window ===== */
{
  id:"ht-window", level:"Easy", title:"Heat through a window", hw:"Course topic: thermal conductivity",
  base:{k:0.8,A:1.5,Lmm:4,ti:20,to:-5},
  random:()=>({k:pick([0.8,0.9,1.0]),A:pick([0.5,0.8,1,1.2,1.5,2,2.5,3]),Lmm:pick([3,4,5,6,8,10]),ti:pick([18,20,21,22,24]),to:pick([-20,-15,-10,-5,0,5])}),
  calc:p=>{const dT=p.ti-p.to,P=p.k*p.A*dT/(p.Lmm/1000);return {dT,P,MJ:P*3600/1e6};},
  text:(p,G,T)=>`A single pane of window glass is ${G("A",`${p.A} m²`)} in area and ${G("L",`${p.Lmm} mm`)} thick. Its inside surface is at ${G("ti",`${p.ti} °C`)} and its outside surface at ${G("to",`${fmt(p.to)} °C`)}. The ${T("cond","thermal conductivity")} of the glass is ${G("k",`${p.k} W/(m·K)`)}. (a) What is the ${T("rate","rate of heat flow")} through the glass? (b) How much heat escapes in one hour, in MJ?`,
  terms:{cond:TERMS.cond,rate:TERMS.rate},
  given:p=>[
    {k:"A",sym:AA,name:"area",unit:"m²",val:p.A,why:"",look:"The area in m²."},
    {k:"L",sym:LL,name:"thickness",unit:"m",val:p.Lmm/1000,why:`Convert to metres: ${p.Lmm} mm = ${p.Lmm/1000} m.`,look:"The thickness is in mm. Divide by 1000.",gtraps:[[p.Lmm,`${p.Lmm} is in mm. Divide by 1000 to get metres.`]]},
    {k:"ti",sym:sb(mi("T"),"in"),name:"inside temperature",unit:"°C",val:p.ti,why:"Only the difference matters, so °C is fine.",look:"The inside temperature."},
    {k:"to",sym:sb(mi("T"),"out"),name:"outside temperature",unit:"°C",val:p.to,why:p.to<0?"Keep the minus sign.":"",look:"The outside temperature, with its sign.",gtraps:p.to<0?[[-p.to,"Keep the minus sign: it's below zero."]]:[]},
    {k:"k",sym:KK,name:"thermal conductivity",unit:"W/(m·K)",val:p.k,why:"",look:"The number in W/(m·K)."}
  ],
  find:[{sym:PP,name:"rate of heat flow",unit:"W",why:"Part (a)."},{sym:QQ,name:"heat lost in one hour",unit:"MJ",why:"Part (b). 1 MJ = 10⁶ J."}],
  parts:[
    {id:"P",label:"(a) Rate of heat flow",sym:PP,unit:"W",ans:(p,c)=>c.P,traps:(p,c)=>clean([[c.P/1000,"Convert the thickness to metres: "+p.Lmm+" mm = "+p.Lmm/1000+" m."],[p.k*p.A*(p.ti+p.to)/(p.Lmm/1000),"ΔT is the difference: "+p.ti+" − ("+p.to+") = "+c.dT+" °C."],[p.k*p.A*c.dT*(p.Lmm/1000),"Divide by the thickness, don't multiply: a thicker pane lets less heat through."]],c.P)},
    {id:"MJ",label:"(b) Heat lost in one hour",sym:QQ,unit:"MJ",ans:(p,c)=>c.MJ,traps:(p,c)=>clean([[c.P*3600,"That's in joules. Divide by 10⁶ for MJ."],[c.P*60/1e6,"One hour is 3600 seconds, not 60."],[c.P/1e6,"Multiply by the time too: Q = P × t, with t = 3600 s."]],c.MJ)}
  ],
  idea:()=>`<p>Heat flows from hot to cold through the glass. How fast it flows depends on:</p>
    <ul class="plain"><li>the <b>area</b> (more glass, more heat),</li><li>the <b>temperature difference</b> (a bigger push),</li><li>the material (its <b>conductivity</b> k),</li><li>and the <b>thickness</b>: thicker means slower, so it goes in the bottom.</li></ul>
    <p>(b) Power is joules per second, so heat = power × time in seconds.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${PP}${OP("=")}${FR(`${KK}${AA}${DT}`,LL)}${AND}${QQ}${OP("=")}${PP}${TT}`)+
    legend([[PP,"rate of heat flow","W"],[KK,"thermal conductivity","W/(m·K)"],[AA,"area","m²"],[DT,"temperature difference across it","K or °C"],[LL,"thickness","m"]]),
  plug:(p,c)=>EQ(`${PP}${OP("=")}${FR(`${p.k}${OP("×")}${p.A}${OP("×")}(${p.ti}${OP("−")}${pr(p.to)})`,p.Lmm/1000)}${AND}${QQ}${OP("=")}${PP}${OP("×")}3600`)+calcTip(`${p.k}*${p.A}*${c.dT}/${p.Lmm/1000}`),
  solution:(p,c)=>steps([
      ["Temperature difference",CALC(`${DT} = ${p.ti} − ${pr(p.to)} = ${c.dT} °C`)],
      ["(a) Conduction",CALC(`${PP} = ${p.k} × ${p.A} × ${c.dT} ÷ ${p.Lmm/1000} = <b>${fmt(c.P)} W</b>`)],
      ["(b) One hour",CALC(`${QQ} = ${fmt(c.P)} × 3600 = ${fmt(c.P*3600)} J = <b>${fmt(c.MJ)} MJ</b>`)]
    ])+checkline(`That's a lot! Real windows lose less, because still air on each side of the glass adds insulation: the glass surfaces are much closer in temperature than the room and the street.`)+
    finalAns(`${PP} = ${fmt(c.P)} W, &nbsp;${QQ} = ${fmt(c.MJ)} MJ`),
  sheet:[{name:"Heat conduction",eq:`${PP}${OP("=")}${FR(`${KK}${AA}${DT}`,LL)}`,note:"Thicker → less heat. L in metres."}],
  takeEq:()=>`${PP}${OP("=")}${FR(`${KK}${AA}${DT}`,LL)}`,
  takeaway:"Conduction: P = kAΔT ÷ L. Thickness in metres; heat = power × time in seconds.",
  link:"Your course list: thermal conductivity, under transport phenomena. This is the everyday, large-scale version of it.",
  viz:viz.slider((p,c)=>({note:"Drag the thickness. Double the glass and the heat loss halves: that's why double glazing (with a gap) helps.",label:"Thickness",unit:"mm",min:1,max:20,step:1,value:p.Lmm,
    bars:[{label:"Heat flow (full bar = 1 mm)",segs:[{cls:"seg-heat",frac:x=>1/x}]}],
    read:x=>`${PP} = <b>${fmt(p.k*p.A*c.dT/(x/1000))} W</b>`})),
  scene:{still:2,draw(K,t,p){K.rect(0,0,280,220,{fill:"heat",c:false,alpha:0.12});K.rect(320,0,280,220,{fill:"blueSoft",c:false});
    K.rect(280,20,40,180,{fill:"card",c:"ink",w:2});K.line(290,30,290,190,{c:"blue",w:1,alpha:0.4});
    for(let i=0;i<3;i++)heatArrow(K,180,60+i*50,430,60+i*50,t+i*0.4,{amp:3});
    for(let i=0;i<8;i++){const x=340+mod(rnd(i,3)*250,250),y=mod(rnd(i,5)*200+t*25,200);K.text("*",x,y,{size:13,c:"blue",alpha:0.5});}
    thermo(K,80,190,90,0.7,{});thermo(K,530,190,90,0.2,{});K.tag(`${p.ti} °C`,110,40,{size:11});K.tag(`${fmt(p.to)} °C`,500,40,{size:11});K.tag(`${p.Lmm} mm`,300,210,{size:11});}}
},

/* ===== Heat radiation from your body ===== */
{
  id:"ht-radiation", level:"Medium", title:"Heat radiated by your body", hw:"Course topic: heat radiation",
  base:{ts:33,A:1.8,e:0.97,tr:20},
  random:()=>({ts:pick([31,32,33,34,35]),A:pick([1.4,1.5,1.6,1.7,1.8,1.9,2.0]),e:pick([0.95,0.97,0.98]),tr:pick([5,10,15,18,20,22,25])}),
  calc:p=>{const Ts=toK(p.ts),Tr=toK(p.tr),Pe=p.e*C.sigma*p.A*Ts**4,Pa=p.e*C.sigma*p.A*Tr**4;return {Ts,Tr,Pe,Pa,net:Pe-Pa};},
  text:(p,G,T)=>`Your skin is at ${G("ts",`${p.ts} °C`)}, with a surface area of ${G("A",`${p.A} m²`)} and an ${T("emis","emissivity")} of ${G("e",`${p.e}`)}. You stand without clothes in a room whose walls are at ${G("tr",`${p.tr} °C`)}. Using the ${T("sb","Stefan–Boltzmann law")} (σ = 5.67 × 10⁻⁸ W/(m²·K⁴)), find (a) the power your skin radiates, (b) the power it absorbs from the walls, and (c) the net power you lose by radiation.`,
  terms:{emis:TERMS.emis,sb:TERMS.sb},
  given:p=>[
    {k:"ts",sym:sb(mi("T"),"skin"),name:"skin temperature",unit:"K",val:toK(p.ts),why:"Radiation needs kelvin (it's raised to the 4th power, so °C would be badly wrong).",look:"The skin temperature in kelvin (+ 273.15).",gtraps:[[p.ts,"Use kelvin: add 273.15. With T⁴, °C gives nonsense."]]},
    {k:"A",sym:AA,name:"surface area",unit:"m²",val:p.A,why:"",look:"The area in m²."},
    {k:"e",sym:EPS,name:"emissivity",unit:"",val:p.e,why:"No unit. The same number for emitting and absorbing.",look:"The plain number below 1."},
    {k:"tr",sym:TE,name:"temperature of the walls",unit:"K",val:toK(p.tr),why:"",look:"The room's temperature in kelvin.",gtraps:[[p.tr,"Use kelvin: add 273.15."]]},
    {k:"s",sym:SIG,name:"Stefan–Boltzmann constant",unit:"W/(m²·K⁴)",val:C.sigma,why:"Type it as 5.67e-8.",look:"The constant σ."}
  ],
  find:[{sym:sb(mi("P"),"emit"),name:"power radiated",unit:"W",why:"Part (a)."},{sym:sb(mi("P"),"abs"),name:"power absorbed",unit:"W",why:"Part (b)."},{sym:sb(mi("P"),"net"),name:"net power lost",unit:"W",why:"Part (c)."}],
  parts:[
    {id:"Pe",label:"(a) Power radiated",sym:sb(mi("P"),"emit"),unit:"W",ans:(p,c)=>c.Pe,traps:(p,c)=>clean([[p.e*C.sigma*p.A*p.ts**4,"Use kelvin: "+p.ts+" °C = "+fmt(c.Ts)+" K."],[C.sigma*p.A*c.Ts**4,"Multiply by the emissivity ε too."],[p.e*C.sigma*p.A*c.Ts,"Raise T to the 4th power."]],c.Pe)},
    {id:"Pa",label:"(b) Power absorbed",sym:sb(mi("P"),"abs"),unit:"W",ans:(p,c)=>c.Pa,traps:(p,c)=>clean([[p.e*C.sigma*p.A*p.tr**4,"Use kelvin."],[C.sigma*p.A*c.Tr**4,"Your skin absorbs with the same ε as it emits."]],c.Pa)},
    {id:"net",label:"(c) Net power lost",sym:sb(mi("P"),"net"),unit:"W",ans:(p,c)=>c.net,traps:(p,c)=>clean([[p.e*C.sigma*p.A*(c.Ts-c.Tr)**4,"Subtract the fourth powers, T_skin⁴ − T_room⁴, not the temperatures first."],[c.Pe,"That's only what you emit. You also absorb from the walls: subtract it."],[c.Pe+c.Pa,"Subtract what you absorb, don't add it."],[p.e*C.sigma*p.A*(p.ts**4-p.tr**4),"Use kelvin for both temperatures."]],c.net)}
  ],
  idea:()=>`<p>Everything warm radiates heat (invisible infrared light), and everything also absorbs radiation from its surroundings.</p>
    <ul class="plain"><li>The power radiated grows with the <b>fourth power</b> of the temperature in kelvin, times the area and the emissivity.</li>
    <li>You absorb from the walls by the same rule, with the walls' temperature.</li><li>The net loss is the difference.</li></ul>
    <p class="small">Try it now. The next hint gives you the formula.</p>`,
  formula:()=>EQ(`${PP}${OP("=")}${EPS}${SIG}${AA}${TH}<sup>4</sup>${AND}${sb(mi("P"),"net")}${OP("=")}${EPS}${SIG}${AA}${PAREN(`${sb(mi("T"),"skin")}<sup>4</sup>${OP("−")}${TE}<sup>4</sup>`)}`)+
    legend([[EPS,"emissivity (0 to 1)",""],[SIG,"Stefan–Boltzmann constant, 5.67 × 10⁻⁸","W/(m²·K⁴)"],[AA,"surface area","m²"],[TH,"temperature (always kelvin)","K"]]),
  plug:(p,c)=>EQ(`${sb(mi("P"),"emit")}${OP("=")}${p.e}${OP("×")}5.67${OP("×")}10<sup>−8</sup>${OP("×")}${p.A}${OP("×")}${fmt(c.Ts)}<sup>4</sup>`)+calcTip(`${p.e}*5.67e-8*${p.A}*${R3(c.Ts)}^4`),
  solution:(p,c)=>steps([
      ["Kelvin",`${sb(mi("T"),"skin")} = ${p.ts} + 273.15 = ${fmt(c.Ts)} K, &nbsp;${TE} = ${p.tr} + 273.15 = ${fmt(c.Tr)} K`],
      ["(a) Emitted",CALC(`${p.e} × 5.67 × 10⁻⁸ × ${p.A} × ${fmt(c.Ts)}⁴ = <b>${fmt(c.Pe)} W</b>`)],
      ["(b) Absorbed",CALC(`${p.e} × 5.67 × 10⁻⁸ × ${p.A} × ${fmt(c.Tr)}⁴ = <b>${fmt(c.Pa)} W</b>`)],
      ["(c) Net",CALC(`${fmt(c.Pe)} − ${fmt(c.Pa)} = <b>${fmt(c.net)} W</b>`)]
    ])+checkline(`Both (a) and (b) are big, but they nearly cancel. The net ${fmt(c.net)} W is the size of your resting metabolism (about 100 W), which is why an unclothed person feels cool in a room like this.`)+
    finalAns(`${sb(mi("P"),"emit")} = ${fmt(c.Pe)} W, &nbsp;${sb(mi("P"),"abs")} = ${fmt(c.Pa)} W, &nbsp;${sb(mi("P"),"net")} = ${fmt(c.net)} W`),
  sheet:[{name:"Stefan–Boltzmann law",eq:`${PP}${OP("=")}${EPS}${SIG}${AA}${TH}<sup>4</sup>`,note:"σ = 5.67 × 10⁻⁸ W/(m²·K⁴). T in kelvin."},{name:"Net radiation",eq:`${sb(mi("P"),"net")}${OP("=")}${EPS}${SIG}${AA}(${sb(mi("T"),"1")}<sup>4</sup>${OP("−")}${sb(mi("T"),"2")}<sup>4</sup>)`,note:"Subtract the fourth powers."}],
  takeEq:()=>`${PP}${OP("=")}${EPS}${SIG}${AA}${TH}<sup>4</sup>`,
  takeaway:"Radiated power = εσAT⁴ with T in kelvin. The net loss is εσA(T₁⁴ − T₂⁴): subtract the fourth powers, not the temperatures.",
  link:"Radiation is the third way heat travels, next to conduction and convection. It's in the same textbook chapter as HW 4's heat tasks.",
  viz:viz.slider((p,c)=>({note:"Drag the room's temperature. When the walls are as warm as your skin, the net loss drops to zero.",label:"Room temperature",unit:"°C",min:-10,max:p.ts,step:1,value:p.tr,
    bars:[{label:"Net radiation loss (full bar = at −10 °C)",segs:[{cls:"seg-heat",frac:x=>(c.Ts**4-toK(x)**4)/(c.Ts**4-toK(-10)**4)}]}],
    read:x=>`${sb(mi("P"),"net")} = <b>${fmt(p.e*C.sigma*p.A*(c.Ts**4-toK(x)**4))} W</b>`})),
  scene:{still:2,draw(K,t,p){K.rect(20,20,560,190,{fill:"card",c:"ink2",w:2,r:6});K.rect(20,20,560,190,{fill:"blueSoft",c:false,alpha:0.5});
    [[255,85,135,70],[255,135,135,150],[345,85,465,70],[345,135,465,150]].forEach((q,i)=>heatArrow(K,q[0],q[1],q[2],q[3],t+i*0.3,{amp:3}));
    [[40,50,150,50],[40,185,150,185],[560,50,450,50],[560,185,450,185]].forEach((q,i)=>heatArrow(K,q[0],q[1],q[2],q[3],t+i*0.4,{c:"blue",amp:3,alpha:0.8}));
    K.person(300,180,{s:1.6,c:"heat"});K.tag(`skin ${p.ts} °C`,300,206,{size:11});K.tag(`walls ${p.tr} °C`,300,36,{size:11});}}
},

/* ===== A wall made of two layers ===== */
{
  id:"ht-layers", level:"Hard", title:"Insulated wall", hw:"Course topic: thermal conductivity",
  base:{k1:0.6,L1:20,k2:0.04,L2:5,A:10,ti:20,to:-10},
  random:()=>({k1:pick([0.5,0.6,0.7,0.8,1.0]),L1:pick([10,12,15,20,25,30]),k2:pick([0.03,0.035,0.04,0.05]),L2:pick([3,4,5,8,10]),A:pick([5,8,10,12,15,20]),ti:pick([18,20,22]),to:pick([-20,-15,-10,-5,0])}),
  calc:p=>{const R1=p.L1/100/(p.k1*p.A),R2=p.L2/100/(p.k2*p.A),R=R1+R2,dT=p.ti-p.to,P=dT/R;return {R1,R2,R,dT,P,Tm:p.ti-P*R1};},
  text:(p,G,T)=>`A house wall has an area of ${G("A",`${p.A} m²`)}. From the inside out it's made of ${G("L1",`${p.L1} cm`)} of brick (${T("cond","thermal conductivity")} ${G("k1",`${p.k1} W/(m·K)`)}) and then ${G("L2",`${p.L2} cm`)} of foam insulation (${G("k2",`${p.k2} W/(m·K)`)}). The inside surface is at ${G("ti",`${p.ti} °C`)} and the outside surface at ${G("to",`${fmt(p.to)} °C`)}. Find (a) the total thermal resistance of the wall, (b) the rate of heat flow through it, and (c) the temperature where the brick meets the foam.`,
  terms:{cond:TERMS.cond},
  given:p=>[
    {k:"A",sym:AA,name:"area",unit:"m²",val:p.A,why:"",look:"The area in m²."},
    {k:"L1",sym:L1,name:"brick thickness",unit:"m",val:p.L1/100,why:"In metres.",look:"The brick's thickness in m (÷ 100).",gtraps:[[p.L1,"That's in cm. Divide by 100."]]},
    {k:"k1",sym:K1,name:"brick conductivity",unit:"W/(m·K)",val:p.k1,why:"",look:"The brick's conductivity."},
    {k:"L2",sym:L2,name:"foam thickness",unit:"m",val:p.L2/100,why:"In metres.",look:"The foam's thickness in m (÷ 100).",gtraps:[[p.L2,"That's in cm. Divide by 100."]]},
    {k:"k2",sym:K2,name:"foam conductivity",unit:"W/(m·K)",val:p.k2,why:"Tiny: foam is a great insulator.",look:"The foam's conductivity."},
    {k:"ti",sym:sb(mi("T"),"in"),name:"inside temperature",unit:"°C",val:p.ti,why:"",look:"The inside temperature."},
    {k:"to",sym:sb(mi("T"),"out"),name:"outside temperature",unit:"°C",val:p.to,why:p.to<0?"Keep the minus sign.":"",look:"The outside temperature, with its sign.",gtraps:p.to<0?[[-p.to,"Keep the minus sign."]]:[]}
  ],
  find:[{sym:RT,name:"total thermal resistance",unit:"K/W",why:"Part (a)."},{sym:PP,name:"rate of heat flow",unit:"W",why:"Part (b)."},{sym:TM,name:"temperature between the layers",unit:"°C",why:"Part (c)."}],
  parts:[
    {id:"R",label:"(a) Total thermal resistance",sym:RT,unit:"K/W",ans:(p,c)=>c.R,traps:(p,c)=>clean([[c.R1,"That's the brick alone. The heat has to get through both layers: add the foam's resistance."],[c.R2,"That's the foam alone. Add the brick's resistance too."],[c.R1*c.R2/(c.R1+c.R2),"The layers are one after the other (in series), so their resistances add: R = R₁ + R₂."],[c.R*100,"Convert the thicknesses to metres."]],c.R)},
    {id:"P",label:"(b) Rate of heat flow",sym:PP,unit:"W",ans:(p,c)=>c.P,traps:(p,c)=>clean([[c.dT/c.R1,"The same heat flows through both layers, so use the total resistance."],[c.dT/c.R2,"Use the total resistance of both layers."],[(p.ti+p.to)/c.R,"ΔT = "+p.ti+" − ("+p.to+") = "+c.dT+" °C."],[c.dT*c.R,"Divide by the resistance: P = ΔT ÷ R."]],c.P)},
    {id:"Tm",label:"(c) Temperature between the layers",sym:TM,unit:"°C",ans:(p,c)=>c.Tm,traps:(p,c)=>clean([[p.ti-c.P*c.R2,"The brick is on the inside, so the drop across the brick is P × R₁."],[(p.ti+p.to)/2,"The temperature doesn't drop evenly: most of the drop is across the foam, because it has most of the resistance."],[p.to+c.P*c.R1,"Start from the inside: T = T_in − P × R_brick."]],c.Tm)}
  ],
  idea:()=>`<p>Think of each layer as a resistance to heat, like a resistor in a circuit: <b>R = L ÷ (kA)</b>. Thicker or less conductive means more resistance.</p>
    <ul class="plain"><li>(a) The heat goes through one layer and then the other, so the resistances <b>add</b>.</li>
    <li>(b) Heat flow = temperature difference ÷ total resistance (like current = voltage ÷ resistance).</li>
    <li>(c) The <b>same</b> heat flows through each layer. The temperature drop across the brick is P × R_brick, so subtract that from the inside temperature.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${R1}${OP("=")}${FR(L1,`${K1}${AA}`)}${AND}${R2}${OP("=")}${FR(L2,`${K2}${AA}`)}${AND}${RT}${OP("=")}${R1}${OP("+")}${R2}`)+EQ(`${PP}${OP("=")}${FR(DT,RT)}${AND}${TM}${OP("=")}${sb(mi("T"),"in")}${OP("−")}${PP}${R1}`)+
    legend([[RT,"thermal resistance","K/W"],[LL,"thickness","m"],[KK,"conductivity","W/(m·K)"],[PP,"rate of heat flow","W"]],"Like resistors in series: R adds, and the same “current” (heat) flows through each."),
  plug:(p,c)=>EQ(`${R1}${OP("=")}${FR(p.L1/100,`${p.k1}${OP("×")}${p.A}`)}${AND}${R2}${OP("=")}${FR(p.L2/100,`${p.k2}${OP("×")}${p.A}`)}`)+EQ(`${PP}${OP("=")}${FR(`${p.ti}${OP("−")}${pr(p.to)}`,RT)}`)+calcTip(`${p.L1/100}/(${p.k1}*${p.A})+${p.L2/100}/(${p.k2}*${p.A})`," That's R."),
  solution:(p,c)=>steps([
      ["Each layer",CALC(`${R1} = ${p.L1/100} ÷ (${p.k1} × ${p.A}) = ${fmt(c.R1)} K/W, &nbsp;${R2} = ${p.L2/100} ÷ (${p.k2} × ${p.A}) = ${fmt(c.R2)} K/W`)],
      ["(a) In series: add",CALC(`${RT} = ${fmt(c.R1)} + ${fmt(c.R2)} = <b>${fmt(c.R)} K/W</b>`)],
      ["(b) Heat flow",CALC(`${PP} = ${c.dT} ÷ ${fmt(c.R)} = <b>${fmt(c.P)} W</b>`)],
      ["(c) Drop across the brick",CALC(`${TM} = ${p.ti} − ${fmt(c.P)} × ${fmt(c.R1)} = <b>${fmt(c.Tm)} °C</b>`)]
    ])+checkline(`From the outside: ${fmt(p.to)} + ${fmt(c.P)} × ${fmt(c.R2)} = ${fmt(p.to+c.P*c.R2)} °C, the same ✓. Most of the temperature drop is across the thin foam: that's what insulation does.`)+
    finalAns(`${RT} = ${fmt(c.R)} K/W, &nbsp;${PP} = ${fmt(c.P)} W, &nbsp;${TM} = ${fmt(c.Tm)} °C`),
  sheet:[{name:"Thermal resistance",eq:`${mi("R")}${OP("=")}${FR(LL,`${KK}${AA}`)},${OP("")}${PP}${OP("=")}${FR(DT,mi("R"))}`,note:"Layers in series: resistances add."}],
  takeEq:()=>`${PP}${OP("=")}${FR(DT,`${R1}${OP("+")}${R2}`)}`,
  takeaway:"Each layer has R = L/(kA); layers in series add. P = ΔT/R_total, and the same P flows through every layer.",
  link:"The one-layer version is “Heat through a window” (Easy). Real walls are always layered, which is why this version is popular on exams.",
  viz:viz.slider((p,c)=>({note:"Drag the foam's thickness. A few centimetres of foam cuts the heat loss far more than the whole brick does.",label:"Foam thickness",unit:"cm",min:0,max:20,step:1,value:p.L2,
    bars:[{label:"Heat flow (full bar = no foam)",segs:[{cls:"seg-heat",frac:x=>c.R1/(c.R1+x/100/(p.k2*p.A))}]}],
    read:x=>`${PP} = <b>${fmt(c.dT/(c.R1+x/100/(p.k2*p.A)))} W</b>`})),
  scene:{still:2,draw(K,t,p){K.rect(0,0,200,220,{fill:"heat",c:false,alpha:0.12});K.rect(400,0,200,220,{fill:"blueSoft",c:false});
    K.rect(200,10,140,200,{fill:"heat",c:"ink",w:2,alpha:0.25});K.rect(200,10,140,200,{c:"ink",w:2});for(let r=0;r<8;r++)for(let k=-1;k<3;k++){const a=Math.max(200,200+(r%2?-23:0)+k*47),b=Math.min(340,200+(r%2?-23:0)+(k+1)*47);if(b>a)K.rect(a,10+r*25,b-a,25,{c:"ink2",w:0.8,alpha:0.5});}
    K.rect(340,10,60,200,{fill:"marker",c:"ink",w:2,alpha:0.6});for(let i=0;i<12;i++)K.circle(352+(i%3)*18,26+Math.floor(i/3)*48,5,{c:"ink2",w:1,alpha:0.4});
    for(let i=0;i<2;i++)heatArrow(K,110,80+i*60,500,80+i*60,t+i*0.5,{amp:3});
    K.tag("brick",270,206,{size:11});K.tag("foam",370,206,{size:11});K.tag(`${p.ti} °C`,90,30,{size:11});K.tag(`${fmt(p.to)} °C`,510,30,{size:11});}}
}

]);
})();
