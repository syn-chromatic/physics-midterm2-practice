/* Thermal expansion: things get longer (and bigger) when they warm up.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,EQ,CALC,IMPLIES,AND,PAREN,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,flame,thermo,heatArrow,loopFade}=draw;

/* symbols used below */
const AL=mi("α"),BE=mi("β"),LL=mi("L"),L0=sb(mi("L"),"0"),DL=up("Δ")+mi("L"),DT=up("Δ")+mi("T"),VV=mi("V"),V0=sb(mi("V"),"0"),DV=up("Δ")+mi("V"),DD=mi("d"),DDD=up("Δ")+mi("d"),TT=mi("T");
const MATS={steel:["steel",12e-6],aluminium:["aluminium",23e-6],copper:["copper",17e-6],brass:["brass",19e-6],concrete:["concrete",12e-6]};
/* 12 × 10⁻⁶ written nicely */
const pw=x=>fmt(x).replace(" × ","&thinsp;×&thinsp;");
const TERMS={
  lin:["Coefficient of linear expansion","α (alpha): the fraction by which a length grows for every 1 °C of warming. Steel: 12 × 10⁻⁶ per °C, so a 1 m steel bar grows by 0.012 mm for each degree."],
  vol:["Coefficient of volume expansion","β (beta): the fraction by which a volume grows for every 1 °C of warming. Liquids expand much more than solids."]
};

PHYS.add("Thermal expansion",[

/* ===== A rail on a hot day ===== */
{
  id:"exp-rail", level:"Easy", title:"Rail on a hot day", hw:"Course topic: thermal expansion",
  base:{mat:"steel",L:25,t1:-15,t2:35},
  random:()=>{const mat=pick(["steel","aluminium","copper","concrete"]);return {mat,L:pick([10,12,20,25,30,40,50]),t1:pick([-20,-15,-10,-5,0,5]),t2:pick([25,30,35,40,45])};},
  calc:p=>{const a=MATS[p.mat][1],dT=p.t2-p.t1,dL=a*p.L*dT;return {a,dT,dL,mm:dL*1000};},
  text:(p,G,T)=>{const [name,a]=MATS[p.mat];return `A ${G("L",`${p.L} m`)} ${name} ${p.mat==="concrete"?"bridge section":"rail"} is laid on a day when it's ${G("t1",`${fmt(p.t1)} °C`)}. On a hot summer day it reaches ${G("t2",`${p.t2} °C`)}. The ${T("lin","coefficient of linear expansion")} of ${name} is ${G("a",`${pw(a)} /°C`)}. (a) By how much does its temperature change? (b) By how many millimetres does it get longer?`;},
  terms:{lin:TERMS.lin},
  given:p=>[
    {k:"L",sym:L0,name:"starting length",unit:"m",val:p.L,why:"",look:"The length in m."},
    {k:"t1",sym:sb(mi("T"),"1"),name:"starting temperature",unit:"°C",val:p.t1,why:p.t1<0?"Below zero: keep the minus sign.":"",look:"The first temperature, with its sign.",gtraps:p.t1<0?[[-p.t1,"Keep the minus sign: it starts below zero."]]:[]},
    {k:"t2",sym:sb(mi("T"),"2"),name:"hot-day temperature",unit:"°C",val:p.t2,why:"",look:"The second temperature."},
    {k:"a",sym:AL,name:"coefficient of linear expansion",unit:"1/°C",val:MATS[p.mat][1],why:"You can type it as "+typ(MATS[p.mat][1])+".",look:"The tiny number with × 10⁻⁶. Type it like 12e-6."}
  ],
  find:[{sym:DT,name:"temperature change",unit:"°C",why:"Part (a)."},{sym:DL,name:"how much longer it gets",unit:"mm",why:"Part (b). In millimetres."}],
  parts:[
    {id:"dT",label:"(a) Temperature change",sym:DT,unit:"°C",ans:(p,c)=>c.dT,traps:(p,c)=>clean([[p.t2+p.t1,"Subtract: ΔT = final − start = "+p.t2+" − ("+p.t1+")."],[p.t2,"Use the change from the start temperature, not the final temperature alone."]],c.dT)},
    {id:"mm",label:"(b) Change in length",sym:DL,unit:"mm",ans:(p,c)=>c.mm,traps:(p,c)=>clean([[c.dL,"That's in metres. The question asks for millimetres: multiply by 1000."],[c.a*p.L*p.t2*1000,"Use the temperature change from (a), not the final temperature."],[c.a*p.L*(p.t2+p.t1)*1000,"The temperature change is "+p.t2+" − ("+p.t1+") = "+c.dT+" °C."],[3*c.mm,"3α is for volumes. A length grows with α itself."]],c.mm)}
  ],
  idea:()=>`<p>When something warms up, its atoms jiggle more and push each other a little further apart, so it gets longer.</p>
    <p>How much longer depends on three things: how long it was to start with, how much warmer it got, and what it's made of (the coefficient α). Multiply them together.</p>
    <p>The answer comes out in the same unit as the length (metres), so convert to millimetres at the end.</p>
    <p class="small">Try it now. The next hint gives you the formula.</p>`,
  formula:()=>EQ(`${DL}${OP("=")}${AL}${L0}${DT}`)+legend([[DL,"change in length","m"],[AL,"coefficient of linear expansion","1/°C"],[L0,"starting length","m"],[DT,"temperature change (final − start)","°C or K"]],"1 m = 1000 mm. A change of 1 °C equals a change of 1 K, so either unit works for ΔT."),
  plug:(p,c)=>EQ(`${DT}${OP("=")}${p.t2}${OP("−")}${pr(p.t1)}${AND}${DL}${OP("=")}${pw(c.a)}${OP("×")}${p.L}${OP("×")}${DT}`)+calcTip(`${typ(c.a)}*${p.L}*${c.dT}*1000`," That gives the answer in mm."),
  solution:(p,c)=>steps([
      ["(a) Temperature change",CALC(`${DT} = ${p.t2} − ${pr(p.t1)} = <b>${c.dT} °C</b>`)],
      ["(b) Change in length",CALC(`${DL} = ${pw(c.a)} × ${p.L} × ${c.dT} = ${fmt(c.dL)} m = <b>${fmt(c.mm)} mm</b>`)]
    ])+checkline(`Sense check: a few millimetres to a few centimetres over tens of metres is what real rails and bridges do. That's why they have expansion gaps.`)+
    finalAns(`${DT} = ${c.dT} °C, &nbsp;${DL} = ${fmt(c.mm)} mm`),
  sheet:[{name:"Linear expansion",eq:`${DL}${OP("=")}${AL}${L0}${DT}`,note:"Steel α ≈ 12 × 10⁻⁶ /°C."}],
  takeEq:()=>`${DL}${OP("=")}${AL}${L0}${DT}`,
  takeaway:"ΔL = αL₀ΔT. Get ΔT from final − start (watch the minus sign), and convert m to mm at the end.",
  link:"HW 4, task 1 uses the volume version of this, ΔV = βV₀ΔT, for a tank of diesel. Try “Diesel shrinks in the cold” on Medium next.",
  viz:viz.slider((p,c)=>({note:"Drag the temperature. The rail grows by the same amount for every degree, so the growth is a straight line.",label:"Temperature",unit:"°C",min:p.t1,max:60,step:1,value:p.t2,
    bars:[{label:"How much longer than at the start (full bar = at 60 °C)",segs:[{cls:"seg-heat",frac:x=>(x-p.t1)/(60-p.t1)}]}],
    read:x=>`${DL} = ${pw(c.a)} × ${p.L} × ${x-p.t1} = <b>${fmt(c.a*p.L*(x-p.t1)*1000)} mm</b>`})),
  scene:{still:3,draw(K,t,p){const u=mod(t,7),f=0.5-0.5*Math.cos(Math.PI*Math.min(1,u/3.2))*(u<3.6?1:Math.max(0,1-(u-3.6)/0.01)),hot=u<3.6?f:Math.max(0,1-(u-3.6)/3);
    K.line(20,150,580,150,{c:"ink2",w:1.4});for(let x=30;x<580;x+=40)K.rect(x,150,24,10,{fill:"rule",c:false});
    const gap=26*(1-hot)+3;K.rect(30,132,270-gap/2,16,{fill:"ink2",c:"ink",w:1.4,r:2});K.rect(300+gap/2,132,270-gap/2,16,{fill:"ink2",c:"ink",w:1.4,r:2});
    K.tag("expansion gap",300,112,{size:11});
    const sx=520,sy=48;K.circle(sx,sy,18,{fill:"marker",c:"heat",w:2,alpha:0.3+0.7*hot});for(let i=0;i<8;i++){const a=i*Math.PI/4+t*0.3;K.line(sx+24*Math.cos(a),sy+24*Math.sin(a),sx+32*Math.cos(a),sy+32*Math.sin(a),{c:"heat",w:2,alpha:hot});}
    thermo(K,80,96,70,0.15+0.75*hot,{});K.tag(`${p.L} m`,165,180,{size:11});}}
},

/* ===== Diesel shrinks in the cold (HW 4, task 1) ===== */
{
  id:"exp-diesel", level:"Medium", title:"Diesel shrinks in the cold", hw:"HW 4, task 1",
  base:{V:37500,dT:23.5,b:9.52e-4,a:1.1e-6},
  random:()=>({V:pick([20000,25000,30000,37500,40000,45000]),dT:pick([10,12.5,15,20,23.5,25,30]),b:pick([9.0e-4,9.52e-4,9.6e-4,1.0e-3]),a:pick([1.1e-6,1.1e-5,1.2e-5,2.3e-5])}),
  calc:p=>{const dV=p.b*p.V*p.dT;return {dV,Vd:p.V-dV};},
  text:(p,G,T)=>`A truck loaded with ${G("V",`${fmt(p.V)} litres`)} of diesel fuel arrives in a region where the temperature is ${G("dT",`${p.dT} °C lower`)} than in the place where the driver filled the whole tank. How many litres of diesel does the truck deliver? The ${T("vol","coefficient of volume expansion")} of diesel is ${G("b",`${pw(p.b)} /°C`)}, and the ${T("lin","coefficient of linear expansion")} of the steel tank is ${G("a",`${pw(p.a)} /°C`)}. Answer in two steps: (a) by how many litres does the diesel shrink, and (b) how many litres are delivered?`,
  terms:{vol:TERMS.vol,lin:TERMS.lin},
  given:p=>[
    {k:"V",sym:V0,name:"volume of diesel loaded",unit:"L",val:p.V,why:"Litres are fine here: the answer is wanted in litres too.",look:"The number measured in litres."},
    {k:"dT",sym:DT,name:"temperature change",unit:"°C",val:-p.dT,why:"It gets colder, so the change is negative.",look:"How much colder it is, with a minus sign because it's a drop.",gtraps:[[p.dT,"The temperature drops, so ΔT is negative. Put a minus sign in front."]]},
    {k:"b",sym:BE,name:"volume expansion of diesel",unit:"1/°C",val:p.b,why:"How much the fuel's volume changes per degree.",look:"The diesel's coefficient (type it like 9.52e-4)."},
    {k:"a",sym:AL,name:"linear expansion of the tank",unit:"1/°C",val:p.a,why:"A distractor! The delivered diesel is measured by its own volume, wherever it sits. The tank shrinking doesn't change how much diesel there is.",look:"The tank's coefficient. List it, but think about whether you need it."}
  ],
  find:[{sym:DV,name:"how much the diesel shrinks",unit:"L",why:"Part (a). Give it as a positive number."},{sym:sb(mi("V"),"delivered"),name:"volume delivered",unit:"L",why:"Part (b)."}],
  parts:[
    {id:"dV",label:"(a) How many litres the diesel shrinks",sym:DV,unit:"L",ans:(p,c)=>c.dV,traps:(p,c)=>clean([[3*p.a*p.V*p.dT,"That's the tank. The diesel shrinks by its own coefficient: ΔV = βV₀ΔT."],[p.b*p.V*p.dT/3,"β is already for volume, so don't divide it by 3. (Only a linear α gets multiplied by 3 for volume.)"],[(p.b-3*p.a)*p.V*p.dT,"Leave the tank out: what's delivered is the diesel itself, measured by its own volume."],[p.b*p.V,"Multiply by the temperature change too: ΔV = βV₀ΔT."]],c.dV)},
    {id:"Vd",label:"(b) Litres delivered",sym:sb(mi("V"),"delivered"),unit:"L",tol:0.002,closeMsg:"Very close, but here the difference is what matters. Keep more digits: give the answer to the nearest litre.",ans:(p,c)=>c.Vd,traps:(p,c)=>[[p.V+c.dV,"It's colder, so the diesel shrinks: subtract ΔV, don't add it."],[p.V,"The diesel shrinks in the cold, so fewer litres arrive: subtract ΔV."],[p.V-(p.b-3*p.a)*p.V*p.dT,"Leave the tank out: what's delivered is the diesel itself."],[p.V-3*p.a*p.V*p.dT,"Use the diesel's coefficient β, not the tank's."]].filter(t=>Math.abs(t[0]-c.Vd)>0.003*c.Vd)}
  ],
  idea:()=>`<p>Liquids shrink when they cool, just like solids, only much more. The volume changes by a fixed fraction β for every degree.</p>
    <p>So the diesel's volume change is β × (its volume) × (temperature change). It got colder, so the change is negative: the diesel shrinks.</p>
    <p><b>What about the tank?</b> It shrinks a tiny bit too, but that doesn't matter. The question is how much diesel comes out of the truck, and that's set by the diesel's own volume. The tank's coefficient is a distractor (a classic exam trick).</p>
    <p class="small">Try it now. The next hint gives you the formula.</p>`,
  formula:()=>EQ(`${DV}${OP("=")}${BE}${V0}${DT}${AND}${sb(mi("V"),"delivered")}${OP("=")}${V0}${OP("+")}${DV}`)+
    legend([[DV,"change in volume (negative when it cools)","L"],[BE,"coefficient of volume expansion","1/°C"],[V0,"starting volume","L"],[DT,"temperature change","°C"]],"For a solid, β = 3α. For a liquid, use its own β, given in the question."),
  plug:(p,c)=>EQ(`${DV}${OP("=")}${pw(p.b)}${OP("×")}${fmt(p.V)}${OP("×")}(−${p.dT})`)+EQ(`${sb(mi("V"),"delivered")}${OP("=")}${fmt(p.V)}${OP("+")}${DV}`)+calcTip(`${p.V}-${typ(p.b)}*${p.V}*${p.dT}`," That gives the litres delivered."),
  solution:(p,c)=>steps([
      ["Which coefficient?",`The diesel's own β. The tank's α would only matter if the question asked how full the tank looks.`],
      ["(a) Volume change of the diesel",CALC(`${DV} = ${pw(p.b)} × ${fmt(p.V)} × (−${p.dT}) = −${fmt(c.dV)} L`)+`<p class="small">It shrinks by <b>${fmt(c.dV)} L</b>.</p>`],
      ["(b) What's delivered",CALC(`${sb(mi("V"),"delivered")} = ${fmt(p.V)} − ${fmt(c.dV)} = <b>${fmt(c.Vd)} L</b>`)]
    ])+checkline(`Sense check: ${fmt(c.dV)} L is ${fmt(100*c.dV/p.V)} % of the load. Small, but at fuel prices that's a lot of money, which is why fuel is sold by volume at a standard temperature.`)+
    finalAns(`${DV} = ${fmt(c.dV)} L, &nbsp;${sb(mi("V"),"delivered")} = ${fmt(c.Vd)} L`),
  sheet:[{name:"Volume expansion",eq:`${DV}${OP("=")}${BE}${V0}${DT}`,note:"For a solid β = 3α. Liquids: use their own β."}],
  takeEq:()=>`${DV}${OP("=")}${BE}${V0}${DT}`,
  takeaway:"ΔV = βV₀ΔT, with ΔT negative when it cools. The tank's expansion is a distractor: the delivered diesel is the diesel's own volume.",
  link:"This is HW 4, task 1 (37 500 L, 23.5 °C colder, β = 9.52 × 10⁻⁴ /°C). The first numbers on this page are exactly those.",
  viz:viz.slider((p,c)=>({note:"Drag how much colder it is at the delivery point. Every degree costs the same number of litres.",label:"Temperature drop",unit:"°C",min:0,max:40,step:0.5,value:p.dT,
    bars:[{label:"Diesel lost to shrinking (full bar = a 40 °C drop)",segs:[{cls:"seg-alt",frac:x=>x/40}]}],
    read:x=>`It shrinks by <b>${fmt(p.b*p.V*x)} L</b>, so <b>${fmt(p.V-p.b*p.V*x)} L</b> is delivered`})),
  scene:{still:2,draw(K,t,p){const u=mod(t,7),x=-140+640*Math.min(1,u/5.5),cold=K.clamp((x-180)/200,0,1);
    K.line(0,186,600,186,{w:2});K.rect(300,0,300,186,{fill:"blueSoft",c:false,alpha:0.6});K.text("warm",150,24,{size:12,c:"heat"});K.text("cold",450,24,{size:12,c:"blue"});
    for(let i=0;i<14;i++){const sx=310+mod(draw.rnd(i,4)*280+8*Math.sin(t+i),280),sy=mod(draw.rnd(i,9)*170+t*28,170);K.text("*",sx,sy,{size:14,c:"blue",alpha:0.6});}
    K.rect(x,120,150,52,{fill:"card",c:"ink",w:2,r:24});K.rect(x+152,128,48,44,{fill:"blue",c:"ink",w:1.6,r:6});K.rect(x+176,134,18,16,{fill:"card",c:false});
    K.rect(x+8,128+6*cold,134,38-6*cold,{fill:"marker",c:false,r:16,alpha:0.8});K.text("diesel",x+75,146,{size:11,bold:true,c:"#14244a"});
    K.wheel(x+30,178,10,x/10);K.wheel(x+110,178,10,x/10);K.wheel(x+180,178,10,x/10);
    thermo(K,40,96,64,0.75-0.6*cold,{});
    loopFade(K,t,7,0.6,0.3);}}
},

/* ===== Shrink-fitting a ring onto a shaft ===== */
{
  id:"exp-ring", level:"Hard", title:"Heating a ring to fit a shaft", hw:"Course topic: thermal expansion",
  base:{mat:"steel",d:40,gap:0.1,t0:20},
  random:()=>{for(;;){const p={mat:pick(["steel","aluminium","copper","brass"]),d:pick([20,25,30,40,50,60,80]),gap:pick([0.04,0.05,0.06,0.08,0.1,0.12,0.15]),t0:pick([15,18,20,22,25])};
    const dT=p.gap/(MATS[p.mat][1]*p.d);if(dT>40&&dT<500)return p;}},
  calc:p=>{const a=MATS[p.mat][1],dT=p.gap/(a*p.d);return {a,dT,T:p.t0+dT,ds:p.d+p.gap};},
  text:(p,G,T)=>{const [name,a]=MATS[p.mat];return `A ${name} ring has an inner diameter of ${G("d",`${p.d.toFixed(2)} mm`)} at ${G("t0",`${p.t0} °C`)}. It has to slide over a shaft with a diameter of ${G("ds",`${(p.d+p.gap).toFixed(2)} mm`)}, which stays at ${p.t0} °C. The ${T("lin","coefficient of linear expansion")} of ${name} is ${G("a",`${pw(a)} /°C`)}. (a) By how much must the ring's inner diameter grow, in mm? (b) By how many degrees must the ring be heated? (c) To what temperature?`;},
  terms:{lin:TERMS.lin},
  given:p=>[
    {k:"d",sym:sb(mi("d"),"ring"),name:"inner diameter of the ring",unit:"mm",val:p.d,why:"The hole grows exactly like a piece of the metal would. Keep it in mm, the same as the gap.",look:"The ring's diameter."},
    {k:"t0",sym:sb(mi("T"),"0"),name:"starting temperature",unit:"°C",val:p.t0,why:"",look:"The starting temperature."},
    {k:"ds",sym:sb(mi("d"),"shaft"),name:"diameter of the shaft",unit:"mm",val:p.d+p.gap,why:"The ring's hole has to reach this size.",look:"The shaft's diameter."},
    {k:"a",sym:AL,name:"coefficient of linear expansion",unit:"1/°C",val:MATS[p.mat][1],why:"A diameter is a length, so use the linear coefficient.",look:"The tiny number with × 10⁻⁶. Type it like "+typ(MATS[p.mat][1])+"."}
  ],
  find:[{sym:DDD,name:"how much the hole must grow",unit:"mm",why:"Part (a)."},{sym:DT,name:"temperature rise",unit:"°C",why:"Part (b)."},{sym:TT,name:"temperature to heat it to",unit:"°C",why:"Part (c)."}],
  parts:[
    {id:"dd",label:"(a) How much the hole must grow",sym:DDD,unit:"mm",ans:(p,c)=>p.gap,traps:(p,c)=>clean([[p.gap/2,"The diameter has to grow by the whole difference, not half of it."],[c.ds,"That's the shaft's diameter. The hole only has to grow by the difference."]],p.gap)},
    {id:"dT",label:"(b) Temperature rise",sym:DT,unit:"°C",ans:(p,c)=>c.dT,traps:(p,c)=>clean([[c.dT/2,"A diameter is a length: use α, not 2α (2α is for areas)."],[c.dT/3,"A diameter is a length: use α, not 3α (3α is for volumes)."],[p.gap/c.a,"Divide by the diameter too: ΔT = Δd ÷ (α d)."],[c.dT*1000,"Keep Δd and d in the same unit (both in mm), so they cancel."],[c.dT/1000,"Keep Δd and d in the same unit (both in mm), so they cancel."],[c.T,"That's the final temperature. Part (b) asks for the rise."]],c.dT)},
    {id:"T",label:"(c) Temperature to heat it to",sym:TT,unit:"°C",ans:(p,c)=>c.T,traps:(p,c)=>clean([[c.dT,"That's the temperature rise. Add the starting "+p.t0+" °C."],[c.dT/2+p.t0,"A diameter is a length: use α, not 2α."]],c.T)}
  ],
  idea:()=>`<p>The surprising part first: <b>a hole in a ring gets bigger when the ring is heated</b>, not smaller. Every length in the ring grows by the same fraction, including the hole's diameter, exactly as if the hole were filled with the same metal.</p>
    <p>So treat the inner diameter like any other length: Δd = α × d × ΔT. You know how much it must grow, so solve for ΔT.</p>
    <p>Keep Δd and d in the same unit (mm) so they cancel, and add the starting temperature at the end.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${DDD}${OP("=")}${AL}${DD}${DT}${IMPLIES}${DT}${OP("=")}${FR(DDD,`${AL}${DD}`)}${AND}${TT}${OP("=")}${sb(mi("T"),"0")}${OP("+")}${DT}`)+
    legend([[DDD,"how much the diameter must grow","mm"],[DD,"starting inner diameter","mm"],[AL,"coefficient of linear expansion","1/°C"],[DT,"temperature rise","°C"]],"A diameter is a length, so it uses α. Areas use 2α and volumes 3α."),
  plug:(p,c)=>EQ(`${DDD}${OP("=")}${c.ds.toFixed(2)}${OP("−")}${p.d.toFixed(2)}${AND}${DT}${OP("=")}${FR(DDD,`${pw(c.a)}${OP("×")}${p.d}`)}`)+calcTip(`${p.gap}/(${typ(c.a)}*${p.d})`),
  solution:(p,c)=>steps([
      ["(a) How much the hole must grow",CALC(`${DDD} = ${c.ds.toFixed(2)} − ${p.d.toFixed(2)} = <b>${p.gap} mm</b>`)],
      ["(b) Solve Δd = αdΔT for ΔT",CALC(`${DT} = ${p.gap} ÷ (${pw(c.a)} × ${p.d}) = <b>${fmt(c.dT)} °C</b>`)],
      ["(c) Add the starting temperature",CALC(`${TT} = ${p.t0} + ${fmt(c.dT)} = <b>${fmt(c.T)} °C</b>`)]
    ])+checkline(`Put it back: ${pw(c.a)} × ${p.d} mm × ${fmt(c.dT)} °C = ${fmt(c.a*p.d*c.dT)} mm, the gap we needed ✓`)+
    finalAns(`${DDD} = ${p.gap} mm, &nbsp;${DT} = ${fmt(c.dT)} °C, &nbsp;${TT} = ${fmt(c.T)} °C`),
  sheet:[{name:"Holes expand too",eq:`${DDD}${OP("=")}${AL}${DD}${DT}`,note:"A hole grows as if it were filled with the same material."}],
  takeEq:()=>`${DT}${OP("=")}${FR(DDD,`${AL}${DD}`)}`,
  takeaway:"Holes grow when heated, by the same fraction as the metal. Use α for a diameter, keep units matching, and add the starting temperature.",
  link:"This is how gears and bearings are fitted onto shafts in real machines (a “shrink fit”). It uses the same ΔL = αL₀ΔT as the rail question.",
  viz:viz.slider((p,c)=>({note:"Drag the ring's temperature. The hole grows steadily; it fits once it's bigger than the shaft.",label:"Ring temperature",unit:"°C",min:p.t0,max:Math.ceil((c.T+60)/10)*10,step:1,value:p.t0,
    bars:[{label:"Hole grown so far (full bar = the gap that's needed)",segs:[{cls:"seg-heat",frac:x=>c.a*p.d*(x-p.t0)/p.gap}]}],
    read:x=>{const d=p.d+c.a*p.d*(x-p.t0);return `Hole: <b>${d.toFixed(3)} mm</b>, shaft: ${c.ds.toFixed(3)} mm. ${d>=c.ds-1e-9?"<b>It fits.</b>":"Too small."}`;}})),
  scene:{still:3,draw(K,t,p){const u=mod(t,7.5),heat=K.clamp(u/3,0,1),drop=K.clamp((u-3.4)/1.4,0,1),rx=300,ry=40+drop*drop*96,r=36+5*heat;
    K.rect(rx-32,120,64,86,{fill:"rule",c:"ink",w:2});K.ellipse(rx,120,32,8,{fill:"card",c:"ink",w:2});K.text("shaft",rx,190,{size:11,c:"ink2"});
    if(u<3.4)flame(K,rx,ry+52,t,0.9);
    K.ellipse(rx,ry,r+12,(r+12)*0.25,{fill:"ink2",c:"ink",w:2,alpha:1});K.ellipse(rx,ry,r,r*0.25,{fill:"bg",c:"ink",w:1.6});
    K.ellipse(rx,ry,r+12,(r+12)*0.25,{c:"heat",w:3,alpha:heat*(1-drop)*0.8});
    if(u<3.4){heatArrow(K,rx-110,ry+10,rx-56,ry+4,t,{amp:2.5});heatArrow(K,rx+110,ry+10,rx+56,ry+4,t,{amp:2.5});}
    K.tag(`${p.mat}, starts at ${p.t0} °C`,480,40,{size:11});
    loopFade(K,t,7.5,0.6,0.3);}}
}

]);
})();
