/* Heat & phase changes: specific heat, melting and boiling, and mixing hot and cold.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,EQ,CALC,IMPLIES,AND,PAREN,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,tri,flame,thermo,beaker,ice,heatArrow,loopFade}=draw;

/* symbols used below */
const QQ=mi("Q"),MM=mi("m"),CC=mi("c"),DT=up("Δ")+mi("T"),LL=mi("L"),PP=mi("P"),TT=mi("t");
const CW=sb(mi("c"),"water"),CI=sb(mi("c"),"ice"),LF=sb(mi("L"),"f"),LV=sb(mi("L"),"v"),Q1=sb(mi("Q"),"1"),Q2=sb(mi("Q"),"2"),Q3=sb(mi("Q"),"3"),TF=sb(mi("T"),"f");
const deg=x=>`${fmt(x)} °C`;
const TERMS={
  spec:["Specific heat","How much heat it takes to warm 1 kg of a material by 1 °C (which is the same as 1 K). Water's is 4186 J/(kg·K): water takes a lot of heat to warm up."],
  fusion:["Heat of fusion","The heat needed to melt 1 kg of a solid that's already at its melting point, without changing its temperature. For ice: 333 kJ/kg."],
  vap:["Heat of vaporization","The heat needed to turn 1 kg of boiling liquid into gas, without changing its temperature. For water: 2256 kJ/kg."],
  insul:["Insulated","No heat gets in or out. So all the heat the warm water loses goes into the ice, and nothing else."]
};
const CW_GIVEN=(why)=>({k:"cw",sym:CW,name:"specific heat of water",unit:"J/(kg·K)",val:C.cw,why:why||"Not in the question: water's specific heat, which you're expected to know.",look:"Not in the question: how much heat warms 1 kg of water by 1 °C?"});

PHYS.add("Heat & phase changes",[

/* ===== Warming water in a kettle ===== */
{
  id:"heat-kettle", level:"Easy", title:"Electric kettle", hw:"Course topic: heat and specific heat",
  base:{m:1.5,t1:18,t2:100,P:2000},
  random:()=>({m:pick([0.5,0.8,1,1.2,1.5,1.7,2]),t1:pick([5,10,12,15,18,20,25]),t2:pick([60,70,80,90,100]),P:pick([1200,1500,1800,2000,2200,2400,3000])}),
  calc:p=>{const dT=p.t2-p.t1,Q=p.m*C.cw*dT;return {dT,Q,t:Q/p.P};},
  text:(p,G,T)=>`An electric kettle heats ${G("m",`${p.m} kg`)} of water from ${G("t1",`${p.t1} °C`)} to ${G("t2",`${p.t2} °C`)}. The ${T("spec","specific heat")} of water is ${G("cw","4186 J/(kg·K)")}. (a) How much heat does the water absorb? (b) The kettle's heater delivers ${G("P",`${p.P} W`)}, and all of it goes into the water. How long does the heating take?`,
  terms:{spec:TERMS.spec},
  given:p=>[
    {k:"m",sym:MM,name:"mass of water",unit:"kg",val:p.m,why:"",look:"The number measured in kg."},
    {k:"t1",sym:sb(mi("T"),"1"),name:"starting temperature",unit:"°C",val:p.t1,why:"Only the change in temperature matters, so °C is fine here.",look:"The first temperature."},
    {k:"t2",sym:sb(mi("T"),"2"),name:"final temperature",unit:"°C",val:p.t2,why:"",look:"The second temperature."},
    {k:"cw",sym:CW,name:"specific heat of water",unit:"J/(kg·K)",val:C.cw,why:"Heat to warm 1 kg by 1 °C.",look:"The number measured in J/(kg·K)."},
    {k:"P",sym:PP,name:"heater power",unit:"W",val:p.P,why:"1 W = 1 J of heat every second.",look:"The number measured in W."}
  ],
  find:[{sym:QQ,name:"heat absorbed",unit:"J",why:"Part (a)."},{sym:TT,name:"heating time",unit:"s",why:"Part (b)."}],
  parts:[
    {id:"Q",label:"(a) Heat absorbed by the water",sym:QQ,unit:"J",ans:(p,c)=>c.Q,traps:(p,c)=>clean([[p.m*C.cw*p.t2,"Use the change in temperature, ΔT = final − start, not the final temperature."],[p.m*C.cw*(p.t1+p.t2),"Subtract the temperatures, don't add them: ΔT = final − start."],[c.Q/1000,"Right number, but in kJ. The box wants joules."],[p.m*4.186*c.dT,"Use c in J/(kg·K): 4186, with the mass in kg."]],c.Q)},
    {id:"t",label:"(b) Heating time",sym:TT,unit:"s",ans:(p,c)=>c.t,traps:(p,c)=>clean([[p.P/c.Q,"Upside down: time = energy ÷ power."],[c.Q*p.P,"Divide by the power, don't multiply: t = Q ÷ P."],[c.t/60,"That's in minutes. The box wants seconds."]],c.t)}
  ],
  idea:()=>`<p>The heat needed to warm something depends on three things: how much of it there is (mass), what it's made of (specific heat), and how much warmer it gets (ΔT). Multiply them together.</p>
    <p>(b) Power is energy per second. If the heater gives P joules every second, the time is the total energy ÷ P.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${QQ}${OP("=")}${MM}${CC}${DT}${AND}${TT}${OP("=")}${FR(QQ,PP)}`)+
    legend([[QQ,"heat","J"],[MM,"mass","kg"],[CC,"specific heat","J/(kg·K)"],[DT,"change in temperature (final − start)","K or °C"],[PP,"power","W = J/s"],[TT,"time","s"]],"A change of 1 °C is the same size as a change of 1 K, so for ΔT you can use either."),
  plug:(p,c)=>EQ(`${QQ}${OP("=")}${p.m}${OP("×")}4186${OP("×")}(${p.t2}${OP("−")}${p.t1})${AND}${TT}${OP("=")}${FR(QQ,p.P)}`)+calcTip(`${p.m}*4186*(${p.t2}-${p.t1})`),
  solution:(p,c)=>steps([
      ["Temperature change",CALC(`${DT} = ${p.t2} − ${p.t1} = ${c.dT} °C (= ${c.dT} K)`)],
      ["(a) Heat",CALC(`${QQ} = ${p.m} × 4186 × ${c.dT} = <b>${fmt(c.Q)} J</b>`)],
      ["(b) Time = energy ÷ power",CALC(`${TT} = ${fmt(c.Q)} ÷ ${p.P} = <b>${fmt(c.t)} s</b>`)+`<p class="small">That's about ${fmt(c.t/60)} minutes.</p>`]
    ])+checkline(`Units: kg × J/(kg·K) × K = J, and J ÷ (J/s) = s ✓`)+finalAns(`${QQ} = ${fmt(c.Q)} J, &nbsp;${TT} = ${fmt(c.t)} s`),
  sheet:[{name:"Heat to change temperature",eq:`${QQ}${OP("=")}${MM}${CC}${DT}`,note:"Water: c = 4186 J/(kg·K). ΔT in K or °C (same size)."},{name:"Power",eq:`${PP}${OP("=")}${FR(QQ,TT)}`,note:"1 W = 1 J/s."}],
  takeEq:()=>`${QQ}${OP("=")}${MM}${CC}${DT}`,
  takeaway:"Heat = mass × specific heat × temperature change. Time = heat ÷ power.",
  link:"HW 4, task 5 uses the same Q = mcΔT for the ice and for the water, with melting in between. Try “Melting ice” on Medium next.",
  viz:viz.slider((p,c)=>({note:"Drag the amount of water. Twice the water needs twice the heat, so with the same heater it takes twice as long.",label:"Mass of water",unit:"kg",min:0.2,max:3,step:0.1,value:p.m,
    bars:[{label:"Heating time (full bar = 3 kg)",segs:[{cls:"seg-heat",frac:x=>x/3}]}],
    read:x=>`${QQ} = ${fmt(x)} × 4186 × ${c.dT} = ${fmt(x*C.cw*c.dT)} J, so it takes <b>${fmt(x*C.cw*c.dT/p.P)} s</b>`})),
  scene:{still:2.5,draw(K,t,p){const u=mod(t,6.4),f=Math.min(1,u/5);
    K.rect(220,186,160,14,{fill:"ink2",c:"ink",w:1.6,r:4});K.poly([[236,186],[248,70],[352,70],[364,186]],{fill:"card",c:"ink",w:2.2,close:true});
    K.poly([[241,140],[245,100],[355,100],[359,140],[364,186],[236,186]],{fill:"blueSoft",c:false,close:true});K.poly([[236,186],[248,70],[352,70],[364,186]],{c:"ink",w:2.2,close:true});
    K.line(352,90,392,104,{w:2.2});K.line(364,160,392,104,{w:2.2});
    for(let i=0;i<6;i++){const by=180-mod(u*40*f+i*14,80);if(f>0.4)K.circle(262+i*16,by,3,{c:"blue",w:1.2,alpha:f});}
    heatArrow(K,300,206,300,176,t,{c:"heat",amp:3});
    thermo(K,460,170,120,0.12+0.75*f,{label:`${Math.round(p.t1+(p.t2-p.t1)*f)} °C`});K.tag(`${p.P} W`,180,193,{size:11});K.tag(`${p.m} kg of water`,300,52,{size:11});
    loopFade(K,t,6.4,0.6,0.3);}}
},

/* ===== Ice to warm water (HW 4, task 5) ===== */
{
  id:"heat-ice", level:"Medium", title:"Melting ice", hw:"HW 4, task 5",
  base:{mg:750,ti:-11,tf:23},
  random:()=>({mg:pick([200,250,400,500,750,1000,1500]),ti:pick([-25,-20,-15,-11,-8,-5]),tf:pick([10,15,20,23,30,40,50])}),
  calc:p=>{const m=p.mg/1000,Q1=m*C.cice*(0-p.ti),Q2=m*C.Lf,Q3=m*C.cw*p.tf;return {m,Q1,Q2,Q3,Q:Q1+Q2+Q3};},
  text:(p,G,T)=>`The ice absorbs heat and melts. How much heat must ${G("m",`${p.mg} g`)} of ice at ${G("ti",`${p.ti<0?"−":""}${Math.abs(p.ti)} °C`)} absorb to become liquid water at ${G("tf",`${p.tf} °C`)}? The ${T("spec","specific heat")} of ice is ${G("ci","2200 J/(kg·K)")}, the ${T("fusion","heat of fusion")} of ice is ${G("L","L = 0.333 MJ/kg")}, and the specific heat of water is ${G("cw","4.186 J/(g·°C)")}. Work it out in steps: (a) warming the ice to 0 °C, (b) melting it, (c) warming the water to ${p.tf} °C, and (d) the total.`,
  terms:{spec:TERMS.spec,fusion:TERMS.fusion},
  given:p=>[
    {k:"m",sym:MM,name:"mass of the ice",unit:"kg",val:p.mg/1000,why:`Convert to kg so it matches the other units: ${p.mg} g = ${p.mg/1000} kg.`,look:"The mass is in grams. Divide by 1000 to get kg.",gtraps:[[p.mg,`${p.mg} is in grams. Divide by 1000 to get kg.`]]},
    {k:"ti",sym:sb(mi("T"),"ice"),name:"starting temperature of the ice",unit:"°C",val:p.ti,why:"Below 0 °C, so the ice has to warm up before it can melt. Keep the minus sign.",look:"The temperature of the ice, with its minus sign.",gtraps:[[-p.ti,"Keep the minus sign: the ice starts below 0 °C."]]},
    {k:"tf",sym:TF,name:"final temperature of the water",unit:"°C",val:p.tf,why:"",look:"The temperature at the end."},
    {k:"ci",sym:CI,name:"specific heat of ice",unit:"J/(kg·K)",val:C.cice,why:"Ice warms up more easily than water: about half the heat per kg.",look:"The number for ice in J/(kg·K)."},
    {k:"L",sym:LF,name:"heat of fusion",unit:"J/kg",val:C.Lf,why:"0.333 MJ/kg = 333 000 J/kg (M means a million).",look:"The heat of fusion is in MJ/kg. Multiply by 1 000 000 to get J/kg.",gtraps:[[0.333,"That's in MJ/kg. Multiply by 1 000 000 to get J/kg."],[333,"That's in kJ/kg. Multiply by 1000 to get J/kg."]]},
    {k:"cw",sym:CW,name:"specific heat of water",unit:"J/(kg·K)",val:C.cw,why:"4.186 J per gram is 4186 J per kilogram (a kilogram is 1000 grams). A change of 1 °C is the same as 1 K.",look:"The question gives J/(g·°C). Multiply by 1000 to get J/(kg·K).",gtraps:[[4.186,"That's per gram. Multiply by 1000 to get J/(kg·K)."]]}
  ],
  find:p=>[{sym:Q1,name:"heat to warm the ice to 0 °C",unit:"J",why:"Part (a)."},{sym:Q2,name:"heat to melt the ice",unit:"J",why:"Part (b). The temperature stays at 0 °C while it melts."},{sym:Q3,name:`heat to warm the water to ${p.tf} °C`,unit:"J",why:"Part (c)."},{sym:QQ,name:"total heat",unit:"J",why:"Part (d). That's the answer to the question."}],
  parts:[
    {id:"Q1",label:"(a) Warming the ice to 0 °C",sym:Q1,unit:"J",ans:(p,c)=>c.Q1,traps:(p,c)=>clean([[c.Q1*1000,"Use the mass in kg, not grams."],[c.m*C.cw*(-p.ti),"Use the specific heat of ice here (2200), not water: it's still ice while it warms to 0 °C."],[-c.Q1,"The ice warms up, so the heat it absorbs is positive: ΔT = 0 − (" + p.ti + ") = " + (-p.ti) + " °C."]],c.Q1)},
    {id:"Q2",label:"(b) Melting the ice",sym:Q2,unit:"J",ans:(p,c)=>c.Q2,traps:(p,c)=>clean([[c.m*0.333,"Convert L to J/kg first: 0.333 MJ/kg = 333 000 J/kg."],[c.Q2*1000,"Use the mass in kg, not grams."],[c.m*C.Lf*(-p.ti),"Melting happens at one temperature: Q = mL, with no ΔT."]],c.Q2)},
    {id:"Q3",label:p=>`(c) Warming the water to ${p.tf} °C`,sym:Q3,unit:"J",ans:(p,c)=>c.Q3,traps:(p,c)=>clean([[c.m*4.186*p.tf,"Convert c to J/(kg·K) first: 4.186 J/(g·°C) = 4186 J/(kg·K)."],[c.m*C.cice*p.tf,"After melting it's water, so use the specific heat of water (4186)."],[c.m*C.cw*(p.tf-p.ti),"The water only warms from 0 °C. The part below 0 °C was ice, and you counted it in (a)."]],c.Q3)},
    {id:"Q",label:"(d) Total heat",sym:QQ,unit:"J",ans:(p,c)=>c.Q,traps:(p,c)=>clean([[c.Q1+c.Q3,"You left out the melting, which is the biggest part: add Q₂ = mL."],[c.Q2+c.Q3,"You left out warming the ice from below zero up to 0 °C: add Q₁."],[c.Q1+c.Q2,"Add the last step too: warming the meltwater to the final temperature."],[c.m*C.cw*(p.tf-p.ti)+c.Q2,"The ice part (below 0 °C) needs the specific heat of ice, not water."]],c.Q)}
  ],
  idea:p=>`<p>Ice doesn't go straight to warm water. It goes through <b>three stages</b>, and each needs its own heat:</p>
    <ol class="plain"><li><b>Warm the ice</b> from ${p.ti} °C up to 0 °C. It's still ice, so use the specific heat of ice.</li>
    <li><b>Melt it</b> at 0 °C. The temperature doesn't change while it melts: all the heat goes into breaking the ice apart. This uses the heat of fusion.</li>
    <li><b>Warm the water</b> from 0 °C up to ${p.tf} °C, with the specific heat of water.</li></ol>
    <p>Add the three. <b>Units first:</b> mass in kg, L in J/kg, c in J/(kg·K).</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${Q1}${OP("=")}${MM}${CI}${PAREN(`0${OP("−")}${sb(mi("T"),"ice")}`)}${AND}${Q2}${OP("=")}${MM}${LF}${AND}${Q3}${OP("=")}${MM}${CW}${PAREN(`${TF}${OP("−")}0`)}`)+EQ(`${QQ}${OP("=")}${Q1}${OP("+")}${Q2}${OP("+")}${Q3}`)+
    legend([[MM,"mass (the same all the way through)","kg"],[CI,"specific heat of ice","J/(kg·K)"],[LF,"heat of fusion (melting)","J/kg"],[CW,"specific heat of water","J/(kg·K)"]],"Converting: 1 MJ = 1 000 000 J. 4.186 J/(g·°C) = 4186 J/(kg·K)."),
  plug:(p,c)=>EQ(`${Q1}${OP("=")}${c.m}${OP("×")}2200${OP("×")}${Math.abs(p.ti)}${AND}${Q2}${OP("=")}${c.m}${OP("×")}333${OP(" ")}000`)+EQ(`${Q3}${OP("=")}${c.m}${OP("×")}4186${OP("×")}${p.tf}`)+calcTip(`${c.m}*2200*${-p.ti}+${c.m}*333000+${c.m}*4186*${p.tf}`," That one line gives the total."),
  solution:(p,c)=>steps([
      ["Units first",`${MM} = ${p.mg} g = ${c.m} kg, &nbsp;${LF} = 0.333 MJ/kg = 333 000 J/kg, &nbsp;${CW} = 4.186 J/(g·°C) = 4186 J/(kg·K)`],
      ["(a) Warm the ice to 0 °C",CALC(`${Q1} = ${c.m} × 2200 × (0 − (${p.ti})) = ${c.m} × 2200 × ${-p.ti} = <b>${fmt(c.Q1)} J</b>`)],
      ["(b) Melt it at 0 °C",CALC(`${Q2} = ${c.m} × 333 000 = <b>${fmt(c.Q2)} J</b>`)],
      ["(c) Warm the water to "+p.tf+" °C",CALC(`${Q3} = ${c.m} × 4186 × ${p.tf} = <b>${fmt(c.Q3)} J</b>`)],
      ["(d) Add them",CALC(`${QQ} = ${fmt(c.Q1)} + ${fmt(c.Q2)} + ${fmt(c.Q3)} = <b>${fmt(c.Q)} J</b>`)]
    ])+checkline(`Melting is the biggest step: ${fmt(c.Q2)} J out of ${fmt(c.Q)} J (${fmt(100*c.Q2/c.Q)} %). That's typical: melting ice takes as much heat as warming the same water by about 80 °C.`)+
    finalAns(`${QQ} = ${fmt(c.Q)} J (${fmt(c.Q/1000)} kJ)`),
  sheet:[{name:"Heat to melt",eq:`${QQ}${OP("=")}${MM}${LF}`,note:"At the melting point, no temperature change. Ice: L = 333 kJ/kg."},{name:"Ice to water",eq:`${QQ}${OP("=")}${MM}${CI}${up("Δ")}${sb(mi("T"),"ice")}${OP("+")}${MM}${LF}${OP("+")}${MM}${CW}${up("Δ")}${sb(mi("T"),"water")}`,note:"Warm the ice, melt it, warm the water."}],
  takeEq:()=>`${QQ}${OP("=")}${MM}${CI}${up("Δ")}${sb(mi("T"),"ice")}${OP("+")}${MM}${LF}${OP("+")}${MM}${CW}${up("Δ")}${sb(mi("T"),"water")}`,
  takeaway:"Three stages: warm the ice (c of ice), melt it at 0 °C (mL), warm the water (c of water). Convert g, MJ and J/g first.",
  link:"This is HW 4, task 5 (750 g of ice at −11 °C to water at 23 °C). The first numbers on this page are exactly those.",
  viz:viz.slider((p,c)=>({note:"Drag the final temperature of the water. The melting part never changes, and it's by far the biggest.",label:"Final temperature",unit:"°C",min:0,max:80,step:1,value:p.tf,
    bars:[{label:"Total heat (full bar = up to 80 °C)",segs:[{cls:"seg-alt",name:"warming the ice",frac:x=>c.Q1/(c.Q1+c.Q2+c.m*C.cw*80)},{cls:"seg-heat",name:"melting",frac:x=>c.Q2/(c.Q1+c.Q2+c.m*C.cw*80)},{cls:"seg-ke",name:"warming the water",frac:x=>c.m*C.cw*x/(c.Q1+c.Q2+c.m*C.cw*80)}]}],
    read:x=>`${QQ} = ${fmt(c.Q1)} + ${fmt(c.Q2)} + ${fmt(c.m*C.cw*x)} = <b>${fmt(c.Q1+c.Q2+c.m*C.cw*x)} J</b>`})),
  scene:{still:3,draw(K,t,p){const u=mod(t,8),f=Math.min(1,u/7);
    /* left: the ice melting in a beaker over a flame. right: the heating curve being drawn */
    const melt=K.clamp((f-0.15)/0.55,0,1);beaker(K,80,70,110,100,0.12+0.28*melt,{wave:melt>0?t:0});
    for(let i=0;i<3;i++)if(melt<1)ice(K,105+i*30,140-10*(i%2),26*(1-0.8*melt),{alpha:1-melt*0.9});
    flame(K,135,206,t,0.8);
    const gx=260,gy=190,gw=300,gh=150,tmin=p.ti-5,tmax=Math.max(p.tf,10)+8,Y=T=>gy-gh*(T-tmin)/(tmax-tmin);
    K.line(gx,gy,gx+gw,gy,{c:"ink2",w:1.2});K.line(gx,gy,gx,gy-gh,{c:"ink2",w:1.2});K.text("heat added →",gx+gw,gy+14,{size:11,c:"ink2",align:"right"});K.text("temperature",gx+4,gy-gh-6,{size:11,c:"ink2",align:"left"});
    K.line(gx,Y(0),gx+gw,Y(0),{c:"rule",w:1,dash:[3,4]});K.text("0 °C",gx-6,Y(0),{size:10,c:"ink2",align:"right"});
    const s1=0.15,s2=0.7,pts=[];for(let i=0;i<=60;i++){const v=i/60*f,T=v<s1?p.ti+(0-p.ti)*v/s1:v<s2?0:(p.tf)*(v-s2)/(1-s2);pts.push([gx+gw*v,Y(T)]);}
    K.poly(pts,{c:"heat",w:2.6});
    loopFade(K,t,8,0.6,0.3);}}
},

/* ===== Boiling water away ===== */
{
  id:"heat-boil", level:"Medium", title:"Boiling water away", hw:"Course topic: phase transitions",
  base:{m:0.2,t1:20,P:1500},
  random:()=>({m:pick([0.1,0.15,0.2,0.25,0.3,0.5]),t1:pick([10,15,20,25,30]),P:pick([800,1000,1200,1500,2000])}),
  calc:p=>{const Q1=p.m*C.cw*(100-p.t1),Q2=p.m*C.Lv,t=(Q1+Q2)/p.P;return {Q1,Q2,t,min:t/60};},
  text:(p,G,T)=>`A pot holds ${G("m",`${p.m} kg`)} of water at ${G("t1",`${p.t1} °C`)} on a ${G("P",`${p.P} W`)} hot plate. Assume all the heat goes into the water. The ${T("vap","heat of vaporization")} of water is ${G("L","2256 kJ/kg")}. (a) How much heat brings the water to the boil (100 °C)? (b) How much more heat boils it all away into steam? (c) How many minutes does the whole thing take?`,
  terms:{vap:TERMS.vap},
  given:p=>[
    {k:"m",sym:MM,name:"mass of water",unit:"kg",val:p.m,why:"",look:"The number measured in kg."},
    {k:"t1",sym:sb(mi("T"),"1"),name:"starting temperature",unit:"°C",val:p.t1,why:"It has to reach 100 °C before it can boil.",look:"The temperature of the water at the start."},
    {k:"P",sym:PP,name:"power of the hot plate",unit:"W",val:p.P,why:"Joules of heat every second.",look:"The number measured in W."},
    {k:"L",sym:LV,name:"heat of vaporization",unit:"J/kg",val:C.Lv,why:"2256 kJ/kg = 2 256 000 J/kg.",look:"It's in kJ/kg. Multiply by 1000 to get J/kg.",gtraps:[[2256,"That's in kJ/kg. Multiply by 1000 to get J/kg."]]},
    CW_GIVEN()
  ],
  find:[{sym:Q1,name:"heat to reach 100 °C",unit:"J",why:"Part (a)."},{sym:Q2,name:"heat to boil it all away",unit:"J",why:"Part (b). The temperature stays at 100 °C while it boils."},{sym:TT,name:"total time",unit:"min",why:"Part (c). In minutes."}],
  parts:[
    {id:"Q1",label:"(a) Heat to bring it to the boil",sym:Q1,unit:"J",ans:(p,c)=>c.Q1,traps:(p,c)=>clean([[p.m*C.cw*100,"Use the change in temperature: 100 − "+p.t1+" °C."],[p.m*C.Lv,"That's the boiling part (b). First the water has to warm up: Q = mcΔT."]],c.Q1)},
    {id:"Q2",label:"(b) Heat to boil it all away",sym:Q2,unit:"J",ans:(p,c)=>c.Q2,traps:(p,c)=>clean([[p.m*2256,"Convert L to J/kg first: 2256 kJ/kg = 2 256 000 J/kg."],[p.m*C.Lv*(100-p.t1),"Boiling happens at one temperature: Q = mL, with no ΔT."],[c.Q1+c.Q2,"That's both parts together. Part (b) asks only for the boiling."]],c.Q2)},
    {id:"min",label:"(c) Total time",sym:TT,unit:"min",ans:(p,c)=>c.min,traps:(p,c)=>clean([[c.t,"That's in seconds. Divide by 60 to get minutes."],[c.Q1/p.P/60,"That's only the time to reach the boil. Add the boiling time too: (Q₁ + Q₂) ÷ P."],[c.Q2/p.P/60,"That's only the boiling time. Add the time to reach 100 °C as well."]],c.min)}
  ],
  idea:()=>`<p>Two stages, just like melting ice but at the other end:</p>
    <ol class="plain"><li><b>Warm the water</b> up to 100 °C: Q = mcΔT.</li><li><b>Boil it</b> at 100 °C. The temperature stays at 100 °C until all the water has turned to steam. The heat for that is the heat of vaporization × mass.</li></ol>
    <p>(c) The hot plate gives P joules every second, so the time is the total heat ÷ P. Then change seconds to minutes.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${Q1}${OP("=")}${MM}${CW}${PAREN(`100${OP("−")}${sb(mi("T"),"1")}`)}${AND}${Q2}${OP("=")}${MM}${LV}${AND}${TT}${OP("=")}${FR(`${Q1}${OP("+")}${Q2}`,PP)}`)+
    legend([[LV,"heat of vaporization (boiling)","J/kg"],[CW,"specific heat of water, 4186","J/(kg·K)"],[PP,"power","W"],[TT,"time","s, then ÷ 60 for minutes"]]),
  plug:(p,c)=>EQ(`${Q1}${OP("=")}${p.m}${OP("×")}4186${OP("×")}${100-p.t1}${AND}${Q2}${OP("=")}${p.m}${OP("×")}2${OP(" ")}256${OP(" ")}000`)+EQ(`${TT}${OP("=")}${FR(`${Q1}${OP("+")}${Q2}`,p.P)}`)+calcTip(`(${p.m}*4186*${100-p.t1}+${p.m}*2256000)/${p.P}/60`,` That gives the time in minutes.`),
  solution:(p,c)=>steps([
      ["(a) Warm it to 100 °C",CALC(`${Q1} = ${p.m} × 4186 × (100 − ${p.t1}) = <b>${fmt(c.Q1)} J</b>`)],
      ["(b) Boil it all away",CALC(`${Q2} = ${p.m} × 2 256 000 = <b>${fmt(c.Q2)} J</b>`)],
      ["(c) Time",CALC(`${TT} = (${fmt(c.Q1)} + ${fmt(c.Q2)}) ÷ ${p.P} = ${fmt(c.t)} s = <b>${fmt(c.min)} min</b>`)]
    ])+checkline(`Boiling takes ${fmt(c.Q2/c.Q1)} times as much heat as warming the water up. That's why a pot reaches the boil quickly but takes ages to boil dry.`)+
    finalAns(`${Q1} = ${fmt(c.Q1)} J, &nbsp;${Q2} = ${fmt(c.Q2)} J, &nbsp;${TT} = ${fmt(c.min)} min`),
  sheet:[{name:"Heat to boil",eq:`${QQ}${OP("=")}${MM}${LV}`,note:"At the boiling point, no temperature change. Water: 2256 kJ/kg."}],
  takeEq:()=>`${QQ}${OP("=")}${MM}${CW}${DT}${OP("+")}${MM}${LV}`,
  takeaway:"Warming uses mcΔT, boiling uses mL at a constant 100 °C. Boiling water away takes far more heat than bringing it to the boil.",
  link:"Material phases and phase transitions are on your course list. This is the boiling version of HW 4, task 5, where the ice melts.",
  viz:viz.slider((p,c)=>({note:"Drag the starting temperature. The boiling part stays the same, and it's always the bigger one.",label:"Starting temperature",unit:"°C",min:0,max:90,step:1,value:p.t1,
    bars:[{label:"Total heat (full bar = from 0 °C)",segs:[{cls:"seg-ke",name:"warming to 100 °C",frac:x=>p.m*C.cw*(100-x)/(p.m*C.cw*100+c.Q2)},{cls:"seg-heat",name:"boiling",frac:x=>c.Q2/(p.m*C.cw*100+c.Q2)}]}],
    read:x=>`Total: <b>${fmt(p.m*C.cw*(100-x)+c.Q2)} J</b>, which takes <b>${fmt((p.m*C.cw*(100-x)+c.Q2)/p.P/60)} min</b>`})),
  scene:{still:4,draw(K,t,p){const u=mod(t,9),lev=u<3?0.6:0.6-0.5*Math.min(1,(u-3)/5.4);
    K.rect(210,186,180,14,{fill:"ink2",c:"ink",w:1.6,r:4});beaker(K,230,96,140,90,lev/0.9,{wave:t});
    K.line(222,96,378,96,{w:2.4,alpha:0});
    if(u>2)for(let i=0;i<7;i++){const yy=186-mod(t*50+i*19,186-(186-90*lev/0.9))-2;K.circle(246+i*18,yy,2.5+1.5*Math.sin(i),{c:"blue",w:1.2,alpha:0.8});}
    if(u>2.6)for(let i=0;i<4;i++){const s=mod(t*0.5+i/4,1),x0=255+i*30,y0=92-70*s,pts=[];for(let k=0;k<=8;k++)pts.push([x0+5*Math.sin(k*0.9+t*3+i),y0-k*3]);K.poly(pts,{c:"ink2",w:2,alpha:(1-s)*0.6});}
    heatArrow(K,300,212,300,190,t,{amp:2.5});thermo(K,450,170,120,u<3?0.2+0.6*u/3:0.8,{label:u<3?"warming up":"boiling"});K.tag(`${p.P} W`,170,193,{size:11});
    loopFade(K,t,9,0.6,0.3);}}
},

/* ===== Ice in warm water: the final temperature ===== */
{
  id:"heat-mix", level:"Hard", title:"Ice in a drink", hw:"Course topic: heat balance and phase changes",
  base:{mi:0.1,ti:-10,mw:0.5,tw:30},
  random:()=>{for(;;){const p={mi:pick([0.04,0.05,0.08,0.1,0.12,0.15]),ti:pick([-20,-15,-12,-10,-8,-5]),mw:pick([0.3,0.4,0.5,0.6,0.8,1]),tw:pick([25,30,35,40,45,50,60])};
    const need=p.mi*C.cice*(-p.ti)+p.mi*C.Lf,have=p.mw*C.cw*p.tw;if(have>need*1.15)return p;}},
  calc:p=>{const Qw=p.mw*C.cw*p.tw,Qa=p.mi*C.cice*(-p.ti),Qm=p.mi*C.Lf,Qi=Qa+Qm,Tf=(Qw-Qi)/((p.mi+p.mw)*C.cw);return {Qw,Qa,Qm,Qi,Tf};},
  text:(p,G,T)=>`An ice cube of mass ${G("mi",`${p.mi} kg`)} at ${G("ti",`−${-p.ti} °C`)} is dropped into ${G("mw",`${p.mw} kg`)} of water at ${G("tw",`${p.tw} °C`)} in an ${T("insul","insulated")} cup. Use c = 4186 J/(kg·K) for water, 2200 J/(kg·K) for ice, and L = 333 kJ/kg for melting. (a) How much heat would the water give out if it cooled all the way to 0 °C? (b) How much heat does the ice need to warm up to 0 °C and melt completely? (c) What is the final temperature of the drink?`,
  terms:{insul:TERMS.insul},
  given:p=>[
    {k:"mi",sym:sb(mi("m"),"ice"),name:"mass of the ice",unit:"kg",val:p.mi,why:"",look:"The first mass: the ice cube."},
    {k:"ti",sym:sb(mi("T"),"ice"),name:"temperature of the ice",unit:"°C",val:p.ti,why:"Below zero, so keep the minus sign.",look:"The ice's temperature, with its minus sign.",gtraps:[[-p.ti,"Keep the minus sign: the ice starts below 0 °C."]]},
    {k:"mw",sym:sb(mi("m"),"water"),name:"mass of the water",unit:"kg",val:p.mw,why:"",look:"The second mass: the water."},
    {k:"tw",sym:sb(mi("T"),"water"),name:"temperature of the water",unit:"°C",val:p.tw,why:"",look:"The water's temperature."}
  ],
  find:[{sym:sb(mi("Q"),"water"),name:"heat the water can give cooling to 0 °C",unit:"J",why:"Part (a)."},{sym:sb(mi("Q"),"ice"),name:"heat the ice needs to warm and melt",unit:"J",why:"Part (b)."},{sym:TF,name:"final temperature",unit:"°C",why:"Part (c)."}],
  parts:[
    {id:"Qw",label:"(a) Heat the water gives cooling to 0 °C",sym:sb(mi("Q"),"water"),unit:"J",ans:(p,c)=>c.Qw,traps:(p,c)=>clean([[p.mw*C.cice*p.tw,"It's water, so use the specific heat of water (4186)."],[(p.mw+p.mi)*C.cw*p.tw,"Only the warm water cools from "+p.tw+" °C. Use its mass alone."]],c.Qw)},
    {id:"Qi",label:"(b) Heat the ice needs to warm and melt",sym:sb(mi("Q"),"ice"),unit:"J",ans:(p,c)=>c.Qi,traps:(p,c)=>clean([[c.Qm,"Melting is only part of it. The ice first has to warm from "+p.ti+" °C to 0 °C: add m·c_ice·ΔT."],[c.Qa,"That only warms the ice to 0 °C. It also has to melt: add mL."],[p.mi*C.cw*(-p.ti)+c.Qm,"While it warms to 0 °C it's still ice: use c = 2200 for that part."],[p.mi*333*1+c.Qa,"Convert L to J/kg: 333 kJ/kg = 333 000 J/kg."]],c.Qi)},
    {id:"Tf",label:"(c) Final temperature",sym:TF,unit:"°C",ans:(p,c)=>c.Tf,traps:(p,c)=>clean([[(p.mw*p.tw+p.mi*p.ti)/(p.mw+p.mi),"A plain mass-weighted average ignores the melting, which soaks up a lot of heat. Do the heat balance."],[(c.Qw-c.Qm)/((p.mi+p.mw)*C.cw),"Don't forget the heat that warms the ice from below zero up to 0 °C."],[(c.Qw-c.Qi)/(p.mw*C.cw),"After melting, the ice is water too, and it warms up with the rest. Divide by the total mass of water."],[(c.Qw-c.Qa)/((p.mi+p.mw)*C.cw),"Don't forget the melting heat mL: it's the biggest part."],[(c.Qw+c.Qi)/((p.mi+p.mw)*C.cw),"The ice takes heat away from the water, so subtract it."]],c.Tf)}
  ],
  idea:p=>`<p>In an insulated cup, <b>heat lost by the warm water = heat gained by the ice</b>. Nothing else gets heat.</p>
    <p>A trick that saves a lot of algebra: first imagine everything going to 0 °C.</p>
    <ul class="plain"><li>(a) If the water cooled to 0 °C, how much heat could it give out?</li><li>(b) How much heat does the ice need to reach 0 °C and melt completely?</li></ul>
    <p>If (a) is bigger than (b), all the ice melts, and there's heat left over. (c) That leftover heat warms <b>all</b> the water (the original water plus the melted ice) up from 0 °C.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${sb(mi("Q"),"water")}${OP("=")}${sb(mi("m"),"w")}${CW}${PAREN(`${sb(mi("T"),"w")}${OP("−")}0`)}${AND}${sb(mi("Q"),"ice")}${OP("=")}${sb(mi("m"),"i")}${CI}${PAREN(`0${OP("−")}${sb(mi("T"),"i")}`)}${OP("+")}${sb(mi("m"),"i")}${LF}`)+
    EQ(`${TF}${OP("=")}${FR(`${sb(mi("Q"),"water")}${OP("−")}${sb(mi("Q"),"ice")}`,`(${sb(mi("m"),"w")}${OP("+")}${sb(mi("m"),"i")})${CW}`)}`)+
    legend([[sb(mi("m"),"w"),"mass of the warm water","kg"],[sb(mi("m"),"i"),"mass of the ice","kg"],[TF,"final temperature","°C"]],"This works when Q_water is bigger than Q_ice. If it isn't, not all the ice melts and the drink ends at exactly 0 °C."),
  plug:(p,c)=>EQ(`${sb(mi("Q"),"water")}${OP("=")}${p.mw}${OP("×")}4186${OP("×")}${p.tw}`)+EQ(`${sb(mi("Q"),"ice")}${OP("=")}${p.mi}${OP("×")}2200${OP("×")}${-p.ti}${OP("+")}${p.mi}${OP("×")}333${OP(" ")}000`)+
    EQ(`${TF}${OP("=")}${FR(`${sb(mi("Q"),"water")}${OP("−")}${sb(mi("Q"),"ice")}`,`(${p.mw}${OP("+")}${p.mi})${OP("×")}4186`)}`)+calcTip(`(${p.mw}*4186*${p.tw}-(${p.mi}*2200*${-p.ti}+${p.mi}*333000))/((${p.mw}+${p.mi})*4186)`),
  solution:(p,c)=>steps([
      ["(a) Water cooling to 0 °C",CALC(`${sb(mi("Q"),"water")} = ${p.mw} × 4186 × ${p.tw} = <b>${fmt(c.Qw)} J</b>`)],
      ["(b) Ice warming to 0 °C, then melting",CALC(`${sb(mi("Q"),"ice")} = ${p.mi} × 2200 × ${-p.ti} + ${p.mi} × 333 000 = ${fmt(c.Qa)} + ${fmt(c.Qm)} = <b>${fmt(c.Qi)} J</b>`)],
      ["Does it all melt?",`${fmt(c.Qw)} J is more than ${fmt(c.Qi)} J, so yes: all the ice melts, with ${fmt(c.Qw-c.Qi)} J left over.`],
      ["(c) The leftover heat warms all the water from 0 °C",CALC(`${TF} = ${fmt(c.Qw-c.Qi)} ÷ ((${p.mw} + ${p.mi}) × 4186) = <b>${fmt(c.Tf)} °C</b>`)]
    ])+checkline(`Heat balance: the warm water loses ${p.mw} × 4186 × (${p.tw} − ${fmt(c.Tf)}) = ${fmt(p.mw*C.cw*(p.tw-c.Tf))} J. The ice gains ${fmt(c.Qi)} J, plus ${p.mi} × 4186 × ${fmt(c.Tf)} = ${fmt(p.mi*C.cw*c.Tf)} J to warm its meltwater: ${fmt(c.Qi+p.mi*C.cw*c.Tf)} J ✓`)+
    finalAns(`${sb(mi("Q"),"water")} = ${fmt(c.Qw)} J, &nbsp;${sb(mi("Q"),"ice")} = ${fmt(c.Qi)} J, &nbsp;${TF} = ${fmt(c.Tf)} °C`),
  sheet:[{name:"Heat balance (insulated)",eq:`${sb(mi("Q"),"lost")}${OP("=")}${sb(mi("Q"),"gained")}`,note:"Trick: take everything to 0 °C first, then share out what's left."}],
  takeEq:()=>`${TF}${OP("=")}${FR(`${sb(mi("Q"),"water")}${OP("−")}${sb(mi("Q"),"ice")}`,`(${sb(mi("m"),"w")}${OP("+")}${sb(mi("m"),"i")})${CW}`)}`,
  takeaway:"Heat lost = heat gained. Take everything to 0 °C first: if the water has heat left after melting all the ice, that leftover warms all the water together.",
  link:"HW 4, task 5 is the ice part of this on its own. Exams like to combine it with the warm water, like here.",
  viz:viz.slider((p,c)=>({note:"Drag the mass of the ice. With too much ice, the water runs out of heat before it's all melted, and the drink stays at 0 °C with ice still floating.",label:"Mass of ice",unit:"kg",min:0.02,max:0.6,step:0.01,value:p.mi,
    bars:[{label:"Heat the ice needs (full bar = what the water can give)",segs:[{cls:"seg-heat",frac:x=>(x*C.cice*(-p.ti)+x*C.Lf)/c.Qw}]}],
    read:x=>{const need=x*C.cice*(-p.ti)+x*C.Lf;if(need<c.Qw)return `All the ice melts. Final temperature: <b>${fmt((c.Qw-need)/((x+p.mw)*C.cw))} °C</b>`;
      const melted=(c.Qw-x*C.cice*(-p.ti))/C.Lf;return melted>0?`Only ${fmt(melted)} kg of the ice melts. The drink ends at <b>0 °C</b> with ice left in it.`:`The water can't even warm all the ice to 0 °C, so the drink ends at <b>0 °C</b> or below.`;}})),
  scene:{still:4,draw(K,t,p){const u=mod(t,8),melt=K.clamp((u-1)/5,0,1),drop=Math.min(1,u/1);
    K.poly([[220,60],[380,60],[366,196],[234,196]],{fill:"card",c:"ink",w:2.4,close:true});
    K.poly([[225,100],[375,100],[366,196],[234,196]],{fill:"blueSoft",c:false,close:true});K.poly([[220,60],[380,60],[366,196],[234,196]],{c:"ink",w:2.4,close:true});
    const y=drop<1?20+90*drop*drop:110+3*Math.sin(t*2);if(melt<1)ice(K,300,y,42*(1-0.85*melt),{alpha:1-0.8*melt});
    if(u>1.2&&melt<1){heatArrow(K,250,160,282,y+10,t,{amp:2,w:1.8});heatArrow(K,350,160,318,y+10,t,{amp:2,w:1.8});}
    K.tag(`${p.mw} kg at ${p.tw} °C`,470,140,{size:11});K.tag(`ice: ${p.mi} kg at ${fmt(p.ti)} °C`,470,40,{size:11});K.text("insulated cup",300,212,{size:11,c:"ink2"});
    loopFade(K,t,8,0.6,0.3);}}
}

]);
})();
