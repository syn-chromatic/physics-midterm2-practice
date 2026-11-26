/* Fluids: pressure in a liquid, the U-tube, floating, and flow in a pipe (continuity and Bernoulli).
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,EQ,CALC,HALF,sq2,IMPLIES,AND,PAREN,PI,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,tri,rnd,flow,loopFade,block}=draw;

/* symbols used below */
const g=C.g,RHO=mi("ρ"),G9=mi("g"),HH=mi("h"),PP=mi("p"),P0=sb(mi("p"),"0"),PG=sb(mi("p"),"gauge"),VV=mi("v"),AA=mi("A"),DD=mi("d"),LL=mi("l"),QV=sb(mi("Q"),"V");
const RW=sb(mi("ρ"),"water"),RO=sb(mi("ρ"),"oil"),RB=sb(mi("ρ"),"block"),FB=sb(mi("F"),"B"),VS=sb(mi("V"),"sub");
const V1=sb(mi("v"),"1"),V2=sb(mi("v"),"2"),P1=sb(mi("p"),"1"),P2=sb(mi("p"),"2"),A1=sb(mi("A"),"1"),A2=sb(mi("A"),"2"),D1=sb(mi("d"),"1"),D2=sb(mi("d"),"2");
const G_GIVEN={k:"g",sym:G9,name:"acceleration due to gravity",unit:"m/s²",val:g,why:"Not in the question: you're expected to know it.",look:"Not in the question: the acceleration due to gravity."};
const TERMS={
  gauge:["Gauge pressure","The extra pressure on top of the air's pressure: what a tyre gauge reads. In a liquid it's the pressure from the liquid alone, ρgh."],
  abs:["Absolute pressure","The total pressure: the air pressing on the surface plus the liquid's own weight below it."],
  density:["Density","Mass per cubic metre, ρ (Greek letter rho). Water: 1000 kg/m³."],
  equil:["Static equilibrium","Nothing moves. So at any one height in the same connected liquid, the pressure is the same on both sides."],
  buoy:["Buoyant force","The upward push from a liquid on anything in it. Archimedes: it equals the weight of the liquid pushed out of the way."],
  horiz:["Horizontal pipe","The pipe doesn't go up or down, so the height terms in Bernoulli's equation cancel."]
};

PHYS.add("Fluids",[

/* ===== Pressure on a diver ===== */
{
  id:"fd-depth", level:"Easy", title:"Pressure on a diver", hw:"Course topic: pressure in a liquid",
  base:{h:12,sea:1},
  random:()=>({h:pick([5,8,10,12,15,18,20,25,30,40]),sea:pick([0,1])}),
  calc:p=>{const rho=p.sea?1025:1000,pg=rho*g*p.h/1000,pa=C.p0/1000+pg;return {rho,pg,pa,ratio:pa/(C.p0/1000)};},
  text:(p,G,T)=>`A diver is ${G("h",`${p.h} m`)} below the surface of ${p.sea?"the sea":"a lake"}. ${p.sea?"Sea":"Lake"} water has a ${T("density","density")} of ${G("rho",`${p.sea?1025:1000} kg/m³`)}, and the air pressure at the surface is ${G("p0","101.3 kPa")}. Find (a) the ${T("gauge","gauge pressure")} on the diver (from the water alone), in kPa, (b) the ${T("abs","absolute pressure")} on the diver, in kPa, and (c) how many times the surface air pressure that is.`,
  terms:{density:TERMS.density,gauge:TERMS.gauge,abs:TERMS.abs},
  given:p=>[
    {k:"h",sym:HH,name:"depth",unit:"m",val:p.h,why:"",look:"The depth in m."},
    {k:"rho",sym:RHO,name:"density of the water",unit:"kg/m³",val:p.sea?1025:1000,why:"",look:"The number measured in kg/m³."},
    {k:"p0",sym:P0,name:"air pressure at the surface",unit:"Pa",val:C.p0,why:"101.3 kPa = 101 300 Pa. Work in pascals, then convert.",look:"The air pressure, in pascals (× 1000).",gtraps:[[101.3,"That's in kPa. Multiply by 1000 to get pascals."]]},
    G_GIVEN
  ],
  find:[{sym:PG,name:"gauge pressure",unit:"kPa",why:"Part (a)."},{sym:PP,name:"absolute pressure",unit:"kPa",why:"Part (b)."},{sym:`${PP}/${P0}`,name:"ratio to air pressure",unit:"",why:"Part (c). No unit."}],
  parts:[
    {id:"pg",label:"(a) Gauge pressure",sym:PG,unit:"kPa",ans:(p,c)=>c.pg,traps:(p,c)=>clean([[c.pg*1000,"That's in pascals. The box wants kPa: divide by 1000."],[c.rho*p.h/1000,"You forgot g: p = ρgh."],[c.pa,"That's the absolute pressure (with the air). Gauge pressure is the water alone, ρgh."]],c.pg)},
    {id:"pa",label:"(b) Absolute pressure",sym:PP,unit:"kPa",ans:(p,c)=>c.pa,traps:(p,c)=>clean([[c.pg,"That's the water alone. Add the air pressure on the surface: p = p₀ + ρgh."],[c.pa*1000,"That's in pascals. The box wants kPa."],[C.p0/1000+c.pg*1000,"Add kPa to kPa: ρgh is "+fmt(c.pg)+" kPa, not "+fmt(c.pg*1000)+"."]],c.pa)},
    {id:"r",label:"(c) Times the surface air pressure",sym:`${PP}/${P0}`,unit:"",ans:(p,c)=>c.ratio,traps:(p,c)=>clean([[c.pg/(C.p0/1000),"Use the absolute pressure from (b), with the air included."],[1/c.ratio,"Upside down: divide the diver's pressure by the air pressure."]],c.ratio)}
  ],
  idea:()=>`<p>A liquid presses down with its own weight. The deeper you go, the more water is above you, so the pressure grows steadily with depth: it depends on the density, g and the depth.</p>
    <p>On top of that, the air presses on the water's surface, and that pressure is passed all the way down. So:</p>
    <ul class="plain"><li><b>Gauge pressure</b> = the water alone.</li><li><b>Absolute pressure</b> = air pressure + the water.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${PG}${OP("=")}${RHO}${G9}${HH}${AND}${PP}${OP("=")}${P0}${OP("+")}${RHO}${G9}${HH}`)+
    legend([[RHO,"density of the liquid","kg/m³"],[HH,"depth below the surface","m"],[P0,"air pressure at the surface","Pa"],[PP,"absolute pressure","Pa"]],"ρgh comes out in pascals. 1 kPa = 1000 Pa. Rule of thumb: every 10 m of water adds about one atmosphere."),
  plug:(p,c)=>EQ(`${PG}${OP("=")}${c.rho}${OP("×")}9.8${OP("×")}${p.h}`)+EQ(`${PP}${OP("=")}101${OP(" ")}300${OP("+")}${PG}`)+calcTip(`${c.rho}*9.8*${p.h}/1000`," That gives the gauge pressure in kPa."),
  solution:(p,c)=>steps([
      ["(a) The water's own pressure",CALC(`${PG} = ${c.rho} × 9.8 × ${p.h} = ${fmt(c.pg*1000)} Pa = <b>${fmt(c.pg)} kPa</b>`)],
      ["(b) Add the air on top",CALC(`${PP} = 101.3 + ${fmt(c.pg)} = <b>${fmt(c.pa)} kPa</b>`)],
      ["(c) Compare",CALC(`${fmt(c.pa)} ÷ 101.3 = <b>${fmt(c.ratio)}</b>`)]
    ])+checkline(`Rule of thumb: each 10 m of water adds about 100 kPa, one atmosphere. ${p.h} m adds about ${fmt(p.h/10)} atmospheres ✓`)+
    finalAns(`${PG} = ${fmt(c.pg)} kPa, &nbsp;${PP} = ${fmt(c.pa)} kPa, &nbsp;${fmt(c.ratio)} × the air pressure`),
  sheet:[{name:"Pressure in a liquid",eq:`${PP}${OP("=")}${P0}${OP("+")}${RHO}${G9}${HH}`,note:"Gauge pressure is the ρgh part alone."}],
  takeEq:()=>`${PP}${OP("=")}${P0}${OP("+")}${RHO}${G9}${HH}`,
  takeaway:"Pressure grows with depth as ρgh. Gauge pressure is that alone; absolute pressure adds the air on top.",
  link:"HW 4, task 2 (the U-tube) is built on this: at the same depth in a still liquid, the pressure is the same. Try “Oil and water in a U-tube” on Medium next.",
  viz:viz.slider((p,c)=>({note:"Drag the depth. The pressure grows in a straight line: every 10 m adds about one atmosphere.",label:"Depth",unit:"m",min:0,max:50,step:1,value:p.h,
    bars:[{label:"Absolute pressure (full bar = at 50 m)",segs:[{cls:"seg-alt",name:"air on the surface",frac:x=>101.3/(101.3+c.rho*g*50/1000)},{cls:"seg-ke",name:"the water",frac:x=>c.rho*g*x/1000/(101.3+c.rho*g*50/1000)}]}],
    read:x=>`${PP} = 101.3 + ${fmt(c.rho*g*x/1000)} = <b>${fmt(101.3+c.rho*g*x/1000)} kPa</b>`})),
  scene:{still:2,draw(K,t,p){K.rect(0,40,600,180,{fill:"blueSoft",c:false});const wv=[];for(let i=0;i<=40;i++)wv.push([i*15,40+3*Math.sin(i*0.7+t*2)]);K.poly(wv,{c:"blue",w:2});
    const y=150+4*Math.sin(t*1.2),x=330;K.ellipse(x,y,30,9,{fill:"ink2",c:"ink",w:1.4});K.circle(x+34,y-4,8,{fill:"card",c:"ink",w:1.6});K.rect(x-26,y-15,30,8,{fill:"marker",c:"ink",w:1.2,r:3});
    K.line(x-30,y,x-52,y-6+4*Math.sin(t*5),{w:2});K.line(x-30,y+3,x-52,y+8+4*Math.cos(t*5),{w:2});
    for(let i=0;i<5;i++){const s=mod(t*0.4+i/5,1);K.circle(x+38+6*Math.sin(t*3+i),y-14-s*(y-56),2.5+2*s,{c:"blue",w:1.2,alpha:1-s});}
    K.vdim(180,44,y,`${p.h} m`);K.text(p.sea?"sea":"lake",560,64,{size:12,c:"blue"});}}
},

/* ===== Oil and water in a U-tube (HW 4, task 2) ===== */
{
  id:"fd-utube", level:"Medium", title:"Oil and water in a U-tube", hw:"HW 4, task 2",
  base:{rw:997.05,d:11.8,l:135},
  random:()=>({rw:pick([997.05,998,1000]),d:pick([5,8,10,11.8,15,20,25,30]),l:pick([80,100,120,135,150,180,200])}),
  calc:p=>{const ho=p.l+p.d,ro=p.rw*p.l/ho;return {ho,ro,pb:p.rw*g*p.l/1000};},
  text:(p,G,T)=>`In a U-tube filled with water and oil, the liquids are in ${T("equil","static equilibrium")}. The top level of the water, with a ${T("density","density")} of ${G("rw",`${p.rw} kg/m³`)}, is ${G("d",`d = ${p.d} mm`)} below the top level of the oil. The boundary between the oil and the water (the bottom of the oil) is ${G("l",`l = ${p.l} mm`)} below the top level of the water. Find (a) the height of the oil column, in mm, (b) the density of the oil, and (c) the gauge pressure at the boundary, in Pa.`,
  terms:{equil:TERMS.equil,density:TERMS.density},
  given:p=>[
    {k:"rw",sym:RW,name:"density of the water",unit:"kg/m³",val:p.rw,why:"",look:"The number measured in kg/m³."},
    {k:"d",sym:DD,name:"how far the water's top is below the oil's top",unit:"mm",val:p.d,why:"The oil sticks up higher, because it's lighter.",look:"The distance called d."},
    {k:"l",sym:LL,name:"how far the boundary is below the water's top",unit:"mm",val:p.l,why:"This is also the height of water that balances the oil.",look:"The distance called l."},
    G_GIVEN
  ],
  find:[{sym:sb(mi("h"),"oil"),name:"height of the oil column",unit:"mm",why:"Part (a). From the boundary up to the top of the oil."},{sym:RO,name:"density of the oil",unit:"kg/m³",why:"Part (b). That's the answer to the homework."},{sym:PG,name:"gauge pressure at the boundary",unit:"Pa",why:"Part (c)."}],
  parts:[
    {id:"ho",label:"(a) Height of the oil column",sym:sb(mi("h"),"oil"),unit:"mm",ans:(p,c)=>c.ho,traps:(p,c)=>clean([[p.l-p.d,"The oil's top is above the water's top, so add: l + d."],[p.l,"That's the water column. The oil reaches d higher: l + d."],[p.d,"That's only the difference in the tops. The oil column runs from the boundary up: l + d."]],c.ho)},
    {id:"ro",label:"(b) Density of the oil",sym:RO,unit:"kg/m³",ans:(p,c)=>c.ro,traps:(p,c)=>clean([[p.rw*c.ho/p.l,"Upside down. The taller column is the lighter liquid: ρ_oil = ρ_water × l ÷ (l + d)."],[p.rw*p.d/p.l,"Compare the two columns at the boundary level: oil of height l + d balances water of height l."],[p.rw*(p.l-p.d)/p.l,"The oil column is l + d tall, not l − d."]],c.ro)},
    {id:"pb",label:"(c) Gauge pressure at the boundary",sym:PG,unit:"Pa",ans:(p,c)=>c.pb,traps:(p,c)=>clean([[c.pb/1000,"That's in kPa. The box wants pascals."],[p.rw*g*c.ho/1000,"Use the water column (l) with the water's density, or the oil column (l + d) with the oil's density, not a mix."],[p.rw*p.l/1000,"You forgot g: p = ρgh."],[p.rw*g*p.l,"Convert mm to m first: "+p.l+" mm = "+p.l/1000+" m."]],c.pb)}
  ],
  idea:()=>`<p>The key fact about a still liquid: <b>at the same height, in the same connected liquid, the pressure is the same</b>.</p>
    <p>Look at the level of the boundary (the bottom of the oil). On the oil side, the pressure there comes from the whole oil column above it. On the water side, at that same level, it comes from the water above that level. These two pressures must be equal.</p>
    <p>The oil column is taller (it reaches d higher than the water), because oil is lighter: a taller column of a lighter liquid weighs the same as a shorter column of water.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${RO}${G9}${PAREN(`${LL}${OP("+")}${DD}`)}${OP("=")}${RW}${G9}${LL}${IMPLIES}${RO}${OP("=")}${RW}${FR(LL,`${LL}${OP("+")}${DD}`)}`)+EQ(`${PG}${OP("=")}${RW}${G9}${LL}`)+
    legend([[LL,"water column above the boundary level","m"],[`${LL}${OP("+")}${DD}`,"oil column","m"],[RO,"density of the oil","kg/m³"]],"g cancels in the density formula, and so do the units of length (mm on top and bottom). For the pressure, use metres."),
  plug:(p,c)=>EQ(`${RO}${OP("=")}${p.rw}${OP("×")}${FR(p.l,`${p.l}${OP("+")}${p.d}`)}`)+EQ(`${PG}${OP("=")}${p.rw}${OP("×")}9.8${OP("×")}${p.l/1000}`)+calcTip(`${p.rw}*${p.l}/(${p.l}+${p.d})`),
  solution:(p,c)=>steps([
      ["(a) Height of the oil column",CALC(`${sb(mi("h"),"oil")} = ${p.l} + ${p.d} = <b>${fmt(c.ho)} mm</b>`)],
      ["Same pressure at the boundary level",CALC(`${RO} × g × ${fmt(c.ho)} = ${p.rw} × g × ${p.l}`)+`<p class="small">g cancels, and so do the millimetres.</p>`],
      ["(b) Solve for the oil's density",CALC(`${RO} = ${p.rw} × ${p.l} ÷ ${fmt(c.ho)} = <b>${fmt(c.ro)} kg/m³</b>`)],
      ["(c) Pressure at the boundary",CALC(`${PG} = ${p.rw} × 9.8 × ${p.l/1000} = <b>${fmt(c.pb)} Pa</b>`)]
    ])+checkline(`From the oil side: ${fmt(c.ro)} × 9.8 × ${fmt(c.ho/1000)} = ${fmt(c.ro*g*c.ho/1000)} Pa, the same ✓. Sense check: the oil is lighter than water, as oils are.`)+
    finalAns(`${sb(mi("h"),"oil")} = ${fmt(c.ho)} mm, &nbsp;${RO} = ${fmt(c.ro)} kg/m³, &nbsp;${PG} = ${fmt(c.pb)} Pa`),
  sheet:[{name:"U-tube with two liquids",eq:`${sb(mi("ρ"),"1")}${sb(mi("h"),"1")}${OP("=")}${sb(mi("ρ"),"2")}${sb(mi("h"),"2")}`,note:"Heights measured from the boundary level. Same height, same pressure."}],
  takeEq:()=>`${RO}${PAREN(`${LL}${OP("+")}${DD}`)}${OP("=")}${RW}${LL}`,
  takeaway:"Same level, same pressure. At the boundary level: oil column (l + d) × ρ_oil = water column (l) × ρ_water.",
  link:"This is HW 4, task 2 (997.05 kg/m³, d = 11.8 mm, l = 135 mm). The first numbers on this page are exactly those.",
  viz:viz.slider((p,c)=>({note:"Drag the oil's density. A lighter oil needs a taller column to balance the same water, so its top sits higher above the water's top.",label:"Density of the oil",unit:"kg/m³",min:600,max:990,step:5,value:Math.round(c.ro/5)*5,
    bars:[{label:"How far the oil sticks up above the water, d (full bar = 100 mm)",segs:[{cls:"seg-heat",frac:x=>p.l*(p.rw/x-1)/100}]}],
    read:x=>`${DD} = ${p.l} × (${p.rw} ÷ ${x} − 1) = <b>${fmt(p.l*(p.rw/x-1))} mm</b>`})),
  scene:{still:3,draw(K,t,p){const s=Math.exp(-mod(t,9)*0.7)*Math.sin(mod(t,9)*4)*10,x1=220,x2=380,w=46,bot=196,yb=150,yw=yb-70+s,yo=yb-70-18-s;
    K.rect(x1-w/2,yb,w,bot-yb,{fill:"blueSoft",c:false});K.rect(x2-w/2,yw,w,bot-yw,{fill:"blueSoft",c:false});K.rect(x1-w/2,bot-14,x2-x1+w,14,{fill:"blueSoft",c:false});
    K.rect(x1-w/2,yo,w,yb-yo,{fill:"marker",c:false,alpha:0.85});
    K.line(x1-w/2,20,x1-w/2,bot,{w:2.4});K.line(x1+w/2,20,x1+w/2,bot-16,{w:2.4});K.line(x2-w/2,20,x2-w/2,bot-16,{w:2.4});K.line(x2+w/2,20,x2+w/2,bot,{w:2.4});
    K.line(x1-w/2,bot,x2+w/2,bot,{w:2.4});K.line(x1+w/2,bot-16,x2-w/2,bot-16,{w:2.4});
    K.line(x1-w/2,yb,x2+w/2,yb,{c:"ink2",w:1,dash:[4,4]});K.line(x2+w/2,yw,x2+w/2+70,yw,{c:"ink2",w:1,dash:[3,4]});K.line(x1+w/2,yo,x2+w/2+70,yo,{c:"ink2",w:1,dash:[3,4]});
    K.vdim(x2+w/2+60,yo,yw,"d");K.vdim(x2+w/2+40,yw,yb,"l");K.text("oil",x1,yo+22,{size:12,bold:true,c:"#14244a"});K.text("water",x2,yb+20,{size:12,c:"blue"});}}
},

/* ===== Water through a narrowing pipe ===== */
{
  id:"fd-pipe", level:"Medium", title:"Water in a narrowing pipe", hw:"Course topic: continuity and Bernoulli's equation",
  base:{d1:4,d2:2,v1:1.5,p1:200},
  random:()=>{for(;;){const p={d1:pick([3,4,5,6,8]),d2:0,v1:pick([0.5,0.8,1,1.2,1.5,2]),p1:pick([150,180,200,250,300])};p.d2=pick([0.4,0.5,0.6,0.7].map(f=>R3(f*p.d1)));
    const v2=p.v1*(p.d1/p.d2)**2,p2=p.p1-0.5*C.rhow*(v2*v2-p.v1*p.v1)/1000;if(p2>40&&v2<15)return p;}},
  calc:p=>{const v2=p.v1*(p.d1/p.d2)**2,p2=p.p1-0.5*C.rhow*(v2*v2-p.v1*p.v1)/1000,A1=Math.PI*(p.d1/200)**2;return {v2,p2,A1,Q:A1*p.v1*1000};},
  text:(p,G,T)=>`Water flows through a ${T("horiz","horizontal pipe")}. In the wide part the pipe's inner diameter is ${G("d1",`${p.d1} cm`)}, the water moves at ${G("v1",`${p.v1} m/s`)}, and its pressure is ${G("p1",`${p.p1} kPa`)}. Further on, the pipe narrows to a diameter of ${G("d2",`${p.d2} cm`)}. Find (a) the speed of the water in the narrow part, (b) the pressure there, in kPa, and (c) how many litres of water flow through the pipe each second.`,
  terms:{horiz:TERMS.horiz},
  given:p=>[
    {k:"d1",sym:D1,name:"diameter of the wide part",unit:"cm",val:p.d1,why:"Only the ratio of the diameters matters for the speed, so cm are fine there.",look:"The first diameter."},
    {k:"v1",sym:V1,name:"speed in the wide part",unit:"m/s",val:p.v1,why:"",look:"The speed in m/s."},
    {k:"p1",sym:P1,name:"pressure in the wide part",unit:"kPa",val:p.p1,why:"Keep kPa and convert the ½ρv² term to kPa too.",look:"The pressure in kPa."},
    {k:"d2",sym:D2,name:"diameter of the narrow part",unit:"cm",val:p.d2,why:"",look:"The second diameter."},
    {k:"rho",sym:RHO,name:"density of water",unit:"kg/m³",val:1000,why:"Not in the question: you're expected to know it.",look:"Not in the question: the density of water."}
  ],
  find:[{sym:V2,name:"speed in the narrow part",unit:"m/s",why:"Part (a)."},{sym:P2,name:"pressure in the narrow part",unit:"kPa",why:"Part (b)."},{sym:QV,name:"volume flow rate",unit:"L/s",why:"Part (c). 1 m³ = 1000 L."}],
  parts:[
    {id:"v2",label:"(a) Speed in the narrow part",sym:V2,unit:"m/s",ans:(p,c)=>c.v2,traps:(p,c)=>clean([[p.v1*p.d1/p.d2,"The area goes with the diameter squared: v₂ = v₁ × (d₁ ÷ d₂)²."],[p.v1*(p.d2/p.d1)**2,"Upside down. The water speeds up where the pipe is narrow: v₂ = v₁ × (d₁ ÷ d₂)²."],[p.v1,"The same amount of water has to get through a smaller opening each second, so it speeds up."]],c.v2)},
    {id:"p2",label:"(b) Pressure in the narrow part",sym:P2,unit:"kPa",ans:(p,c)=>c.p2,traps:(p,c)=>clean([[p.p1+0.5*C.rhow*(c.v2**2-p.v1**2)/1000,"Faster water has lower pressure: subtract ½ρ(v₂² − v₁²)."],[p.p1-0.5*C.rhow*c.v2**2/1000,"Subtract the difference of the squares, ½ρ(v₂² − v₁²), not just ½ρv₂²."],[p.p1-C.rhow*(c.v2**2-p.v1**2)/1000,"Don't forget the ½ in ½ρv²."],[p.p1*1000-0.5*C.rhow*(c.v2**2-p.v1**2),"That's in pascals. The box wants kPa."],[p.p1-0.5*C.rhow*(c.v2-p.v1)**2/1000,"Square each speed first, then subtract: v₂² − v₁², not (v₂ − v₁)²."]],c.p2)},
    {id:"Q",label:"(c) Litres per second",sym:QV,unit:"L/s",ans:(p,c)=>c.Q,traps:(p,c)=>clean([[c.Q/1000,"That's in m³/s. Multiply by 1000 for litres."],[4*c.Q,"Use the radius in A = πr², which is half the diameter."],[Math.PI*(p.d1/2)**2*p.v1,"Convert the diameter to metres first: "+p.d1+" cm = "+p.d1/100+" m."]],c.Q)}
  ],
  idea:()=>`<p>Two ideas, one for the speed and one for the pressure:</p>
    <ul class="plain"><li><b>Continuity:</b> water doesn't pile up or vanish, so every second the same volume passes through the wide part and the narrow part. Volume per second = area × speed, so where the pipe is narrow the water must move faster. Area goes with the diameter squared.</li>
    <li><b>Bernoulli:</b> along a horizontal pipe, pressure + ½ρv² stays the same. So where the water is faster, its pressure is lower.</li></ul>
    <p>(c) Volume per second = area × speed, in m³/s. Then change to litres.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${A1}${V1}${OP("=")}${A2}${V2}${IMPLIES}${V2}${OP("=")}${V1}${PAREN(FR(D1,D2))}<sup>2</sup>`)+EQ(`${P1}${OP("+")}${HALF}${RHO}${sq2(V1)}${OP("=")}${P2}${OP("+")}${HALF}${RHO}${sq2(V2)}`)+EQ(`${QV}${OP("=")}${A1}${V1}${AND}${AA}${OP("=")}${PI}${PAREN(FR(DD,"2"))}<sup>2</sup>`)+
    legend([[AA,"area of the pipe's cross-section","m²"],[VV,"speed of the water","m/s"],[PP,"pressure","Pa"],[RHO,"density of water, 1000","kg/m³"],[QV,"volume flow rate","m³/s"]],"½ρv² comes out in Pa: divide by 1000 to subtract it from kPa. 1 m³ = 1000 L."),
  plug:(p,c)=>EQ(`${V2}${OP("=")}${p.v1}${OP("×")}${PAREN(FR(p.d1,p.d2))}<sup>2</sup>`)+EQ(`${P2}${OP("=")}${p.p1}${OP("−")}${FR(`½${OP("×")}1000${OP("×")}(${sq2(V2)}${OP("−")}${sq2(p.v1)})`,"1000")}`)+EQ(`${QV}${OP("=")}${PI}${OP("×")}${p.d1/200}<sup>2</sup>${OP("×")}${p.v1}`)+calcTip(`${p.v1}*(${p.d1}/${p.d2})^2`),
  solution:(p,c)=>steps([
      ["(a) Continuity",CALC(`${V2} = ${p.v1} × (${p.d1} ÷ ${p.d2})² = ${p.v1} × ${fmt((p.d1/p.d2)**2)} = <b>${fmt(c.v2)} m/s</b>`)],
      ["(b) Bernoulli, horizontal pipe",CALC(`½ρ(v₂² − v₁²) = ½ × 1000 × (${fmt(c.v2)}² − ${p.v1}²) = ${fmt(0.5*C.rhow*(c.v2**2-p.v1**2))} Pa = ${fmt(0.5*(c.v2**2-p.v1**2))} kPa`)+CALC(`${P2} = ${p.p1} − ${fmt(0.5*(c.v2**2-p.v1**2))} = <b>${fmt(c.p2)} kPa</b>`)],
      ["(c) Volume per second",CALC(`${QV} = π × ${p.d1/200}² × ${p.v1} = ${fmt(c.Q/1000)} m³/s = <b>${fmt(c.Q)} L/s</b>`)]
    ])+checkline(`Through the narrow part: π × ${p.d2/200}² × ${fmt(c.v2)} = ${fmt(Math.PI*(p.d2/200)**2*c.v2*1000)} L/s, the same flow ✓`)+
    finalAns(`${V2} = ${fmt(c.v2)} m/s, &nbsp;${P2} = ${fmt(c.p2)} kPa, &nbsp;${QV} = ${fmt(c.Q)} L/s`),
  sheet:[{name:"Continuity",eq:`${A1}${V1}${OP("=")}${A2}${V2}`,note:"Narrower pipe, faster flow. Area ∝ diameter²."},{name:"Bernoulli (horizontal)",eq:`${PP}${OP("+")}${HALF}${RHO}${sq2(VV)}${OP("=")}const`,note:"Add ρgh too if the height changes. Faster flow, lower pressure."}],
  takeEq:()=>`${A1}${V1}${OP("=")}${A2}${V2},${OP("")}${P1}${OP("+")}${HALF}${RHO}${sq2(V1)}${OP("=")}${P2}${OP("+")}${HALF}${RHO}${sq2(V2)}`,
  takeaway:"Continuity: A₁v₁ = A₂v₂, so narrower means faster (diameter squared). Bernoulli: faster flow means lower pressure.",
  link:"Continuity and Bernoulli's equation are in the same textbook chapter as the U-tube in HW 4, task 2, and they're common exam questions.",
  viz:viz.slider((p,c)=>({note:"Drag the narrow part's diameter. Halving the diameter makes the water 4 times faster, and the pressure drops a lot.",label:"Narrow diameter",unit:"cm",min:R3(p.d1*0.35),max:p.d1,step:0.1,value:p.d2,
    bars:[{label:"Speed in the narrow part (full bar = the narrowest setting)",segs:[{cls:"seg-ke",frac:x=>(p.d1/x)**2/(1/0.35)**2}]},{label:"Pressure in the narrow part (full bar = p₁)",segs:[{cls:"seg-alt",frac:x=>Math.max(0,p.p1-0.5*(p.v1**2*(p.d1/x)**4-p.v1**2))/p.p1}]}],
    read:x=>{const v=p.v1*(p.d1/x)**2,pp=p.p1-0.5*(v*v-p.v1*p.v1);return `${V2} = <b>${fmt(v)} m/s</b>, ${P2} = <b>${pp>0?fmt(pp)+" kPa":"below zero: the water would boil and bubble (cavitation)"}</b>`;}})),
  scene:{still:2,draw(K,t,p){const T=x=>x<230?80:x>330?102:80+22*(x-230)/100,B=x=>x<230?160:x>330?138:160-22*(x-230)/100;
    const up=[],dn=[];for(let x=20;x<=580;x+=10){up.push([x,T(x)]);dn.push([x,B(x)]);}
    K.poly(up.concat(dn.slice().reverse()),{fill:"blueSoft",c:false,close:true});K.poly(up,{w:2.6});K.poly(dn,{w:2.6});
    const fast=Math.min(5,(p.d1/p.d2)**2);
    for(let i=0;i<14;i++){const lane=0.15+0.7*rnd(i,2),xw=20+mod(rnd(i,5)*205+t*32,205),xn=335+mod(rnd(i,7)*245+t*32*fast,245);
      K.circle(xw,T(xw)+(B(xw)-T(xw))*lane,2.6,{fill:"blue",c:false,alpha:0.7});K.circle(xn,T(xn)+(B(xn)-T(xn))*lane,2.6,{fill:"blue",c:false,alpha:0.7});}
    [[120,80,48],[460,102,30]].forEach(([x,y,h])=>{K.rect(x-7,y-70,14,70,{fill:"card",c:"ink",w:1.6});K.rect(x-5,y-h,10,h,{fill:"blueSoft",c:false});K.line(x-5,y-h,x+5,y-h,{c:"blue",w:2});});
    K.tag(`${p.d1} cm`,120,184,{size:11});K.tag(`${p.d2} cm`,460,162,{size:11});K.tag("pressure tubes",290,22,{size:11});}}
},

/* ===== A floating block ===== */
{
  id:"fd-float", level:"Hard", title:"Floating block", hw:"Course topic: Archimedes' principle",
  base:{rb:650,a:20,sea:0},
  random:()=>({rb:pick([450,500,550,600,650,700,750,800,850]),a:pick([10,15,20,25,30,40]),sea:pick([0,0,1])}),
  calc:p=>{const rl=p.sea?1025:1000,V=(p.a/100)**3,frac=p.rb/rl,FB=p.rb*V*g;return {rl,V,frac,pct:100*frac,FB,dm:(rl-p.rb)*V,depth:frac*p.a};},
  text:(p,G,T)=>`A solid cube of wood, ${G("a",`${p.a} cm`)} on each side, has a ${T("density","density")} of ${G("rb",`${p.rb} kg/m³`)}. It floats in ${p.sea?"sea":"fresh"} water (${G("rl",`${p.sea?1025:1000} kg/m³`)}). (a) What percentage of its volume is under water? (b) What is the ${T("buoy","buoyant force")} on it? (c) How deep does its bottom sit below the surface, in cm? (d) What extra mass, placed on top, would push it just completely under water?`,
  terms:{density:TERMS.density,buoy:TERMS.buoy},
  given:p=>[
    {k:"a",sym:mi("a"),name:"side of the cube",unit:"m",val:p.a/100,why:`Convert to metres: ${p.a} cm = ${p.a/100} m. Volume = a³.`,look:"The side is in cm. Divide by 100 to get metres.",gtraps:[[p.a,`${p.a} is in cm. Divide by 100 to get metres.`]]},
    {k:"rb",sym:RB,name:"density of the wood",unit:"kg/m³",val:p.rb,why:"",look:"The wood's density."},
    {k:"rl",sym:RW,name:"density of the water",unit:"kg/m³",val:p.sea?1025:1000,why:"",look:"The water's density."},
    G_GIVEN
  ],
  find:[{sym:`${VS}/${mi("V")}`,name:"percentage under water",unit:"%",why:"Part (a)."},{sym:FB,name:"buoyant force",unit:"N",why:"Part (b)."},{sym:HH,name:"depth of the bottom",unit:"cm",why:"Part (c)."},{sym:up("Δ")+mi("m"),name:"extra mass to sink it",unit:"kg",why:"Part (d)."}],
  parts:[
    {id:"pct",label:"(a) Percentage under water",sym:`${VS}/${mi("V")}`,unit:"%",ans:(p,c)=>c.pct,traps:(p,c)=>clean([[100-c.pct,"That's the part above the water. Under water is ρ_block ÷ ρ_water."],[c.frac,"Give it as a percentage: multiply by 100."],[100*c.rl/p.rb,"Upside down: fraction under water = ρ_block ÷ ρ_water."]],c.pct)},
    {id:"FB",label:"(b) Buoyant force",sym:FB,unit:"N",ans:(p,c)=>c.FB,traps:(p,c)=>clean([[c.rl*c.V*g,"That would be the force if it were completely under water. It only sinks until the push equals its weight: F_B = mg."],[p.rb*c.V,"That's the mass in kg. Force = mass × g."],[p.rb*p.a**3*g,"Convert cm to m before cubing."]],c.FB)},
    {id:"h",label:"(c) Depth of the bottom",sym:HH,unit:"cm",ans:(p,c)=>c.depth,traps:(p,c)=>clean([[p.a-c.depth,"That's the part sticking out. The bottom is (fraction under water) × side below the surface."],[c.depth/100,"That's in metres. The question asks for cm."]],c.depth)},
    {id:"dm",label:"(d) Extra mass to sink it",sym:up("Δ")+mi("m"),unit:"kg",ans:(p,c)=>c.dm,traps:(p,c)=>clean([[c.rl*c.V,"That's the mass of water the whole cube pushes away. Subtract the cube's own mass: it already helps."],[p.rb*c.V,"That's the cube's own mass. The extra mass makes up the difference: (ρ_water − ρ_block)V."],[(c.rl-p.rb)*c.V*g,"That's a force in N. The question asks for a mass in kg."]],c.dm)}
  ],
  idea:()=>`<p><b>Archimedes:</b> a liquid pushes up on anything in it with a force equal to the weight of the liquid that's been pushed aside.</p>
    <p>A floating block sinks until that push equals its own weight. So:</p>
    <ul class="plain"><li>(b) Buoyant force = the block's weight, mg.</li><li>(a) The weight of the water pushed aside equals the block's weight. That happens when the fraction under water = ρ_block ÷ ρ_water.</li>
    <li>(c) For a cube floating flat, that fraction of its height is under water.</li><li>(d) To push it fully under, the total weight on the water must equal the weight of water the <i>whole</i> cube displaces.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${FB}${OP("=")}${RW}${VS}${G9}${OP("=")}${mi("m")}${G9}${IMPLIES}${FR(VS,mi("V"))}${OP("=")}${FR(RB,RW)}`)+EQ(`${up("Δ")}${mi("m")}${OP("=")}${PAREN(`${RW}${OP("−")}${RB}`)}${mi("V")}${AND}${mi("V")}${OP("=")}${mi("a")}<sup>3</sup>`)+
    legend([[FB,"buoyant force","N"],[VS,"volume under water","m³"],[mi("V"),"whole volume of the cube, a³","m³"],[RB,"density of the block","kg/m³"]],"The block's mass is m = ρ_block × V."),
  plug:(p,c)=>EQ(`${mi("V")}${OP("=")}${p.a/100}<sup>3</sup>${AND}${FR(VS,mi("V"))}${OP("=")}${FR(p.rb,c.rl)}`)+EQ(`${FB}${OP("=")}${p.rb}${OP("×")}${mi("V")}${OP("×")}9.8${AND}${up("Δ")}${mi("m")}${OP("=")}(${c.rl}${OP("−")}${p.rb})${OP("×")}${mi("V")}`)+calcTip(`${p.rb}*${p.a/100}^3*9.8`," That's the buoyant force."),
  solution:(p,c)=>steps([
      ["Volume and mass of the cube",CALC(`V = ${p.a/100}³ = ${fmt(c.V)} m³, &nbsp;m = ${p.rb} × ${fmt(c.V)} = ${fmt(p.rb*c.V)} kg`)],
      ["(a) Fraction under water",CALC(`${p.rb} ÷ ${c.rl} = ${fmt(c.frac)} = <b>${fmt(c.pct)} %</b>`)],
      ["(b) Buoyant force = weight",CALC(`${FB} = ${fmt(p.rb*c.V)} × 9.8 = <b>${fmt(c.FB)} N</b>`)],
      ["(c) Depth of the bottom",CALC(`${HH} = ${fmt(c.frac)} × ${p.a} = <b>${fmt(c.depth)} cm</b>`)],
      ["(d) Sinking it completely",CALC(`${up("Δ")}m = (${c.rl} − ${p.rb}) × ${fmt(c.V)} = <b>${fmt(c.dm)} kg</b>`)]
    ])+checkline(`Check (b) with Archimedes: water pushed aside = ${fmt(c.frac)} × ${fmt(c.V)} m³, weighing ${c.rl} × ${fmt(c.frac*c.V)} × 9.8 = ${fmt(c.rl*c.frac*c.V*g)} N ✓`)+
    finalAns(`${fmt(c.pct)} % under, &nbsp;${FB} = ${fmt(c.FB)} N, &nbsp;${HH} = ${fmt(c.depth)} cm, &nbsp;${up("Δ")}m = ${fmt(c.dm)} kg`),
  sheet:[{name:"Archimedes' principle",eq:`${FB}${OP("=")}${sb(mi("ρ"),"liquid")}${VS}${G9}`,note:"Equal to the weight of liquid pushed aside."},{name:"Floating",eq:`${FR(VS,mi("V"))}${OP("=")}${FR(RB,RW)}`,note:"Fraction under water = density ratio."}],
  takeEq:()=>`${FR(VS,mi("V"))}${OP("=")}${FR(RB,RW)}`,
  takeaway:"Floating: buoyant force = weight, so the fraction under water = ρ_block ÷ ρ_liquid. To sink it fully, add (ρ_liquid − ρ_block)V of mass.",
  link:"Archimedes' principle is in the same textbook chapter as HW 4, task 2. It's the classic follow-up to pressure in a liquid.",
  viz:viz.slider((p,c)=>({note:"Drag the density of the block. A denser block sits lower, and at 1000 kg/m³ (the water's own density) it's fully under.",label:"Density of the block",unit:"kg/m³",min:100,max:c.rl,step:10,value:p.rb,
    bars:[{label:"Part under water",segs:[{cls:"seg-ke",frac:x=>x/c.rl}]}],
    read:x=>`<b>${fmt(100*x/c.rl)} %</b> under water, bottom at <b>${fmt(x/c.rl*p.a)} cm</b> deep`})),
  scene:{still:2,draw(K,t,p){const wl=110,s=86,bob=3*Math.sin(t*1.6),f=p.rb/(p.sea?1025:1000),y0=wl-s*(1-f)+bob;
    K.rect(0,wl,600,110,{fill:"blueSoft",c:false});
    K.rect(300-s/2,y0,s,s,{fill:"marker",c:"ink",w:2,r:3});for(let i=1;i<4;i++)K.line(300-s/2+6,y0+i*s/4,300+s/2-6,y0+i*s/4+3*Math.sin(i),{c:"heat",w:1,alpha:0.5});
    const wv=[];for(let i=0;i<=40;i++)wv.push([i*15,wl+2.5*Math.sin(i*0.6+t*2)]);K.poly(wv,{c:"blue",w:2});
    K.arrow(300,y0+s+40,300,y0+s+6,{c:"blue",w:2.4});K.text("buoyant force",318,y0+s+30,{size:11,c:"blue",align:"left"});
    K.tag(`${p.a} cm cube`,460,50,{size:11});K.text(p.sea?"sea water":"fresh water",540,200,{size:11,c:"blue"});}}
}

]);
})();
