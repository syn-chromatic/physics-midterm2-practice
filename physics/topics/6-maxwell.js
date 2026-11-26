/* Maxwell speeds: the spread of molecular speeds, and the three typical speeds.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,SQ,EQ,CALC,IMPLIES,AND,PAREN,PI,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,tri,rnd,gas,box,loopFade}=draw;

/* symbols used below */
const RR=mi("R"),TT=mi("T"),MOL=mi("M"),VP=sb(mi("v"),"p"),VAV=`⟨${mi("v")}⟩`,VRMS=sb(mi("v"),"rms");
const GASES={H2:["hydrogen",2.0],He:["helium",4.0],Ne:["neon",20.2],N2:["nitrogen",28.0],O2:["oxygen",32.0],Ar:["argon",39.9],CO2:["carbon dioxide",44.0]};
const gform=k=>k.replace(/(\d)/g,d=>"₀₁₂₃₄₅₆₇₈₉"[d]);
const speeds=(T,M)=>({vp:Math.sqrt(2*C.R*T/M),va:Math.sqrt(8*C.R*T/(Math.PI*M)),vr:Math.sqrt(3*C.R*T/M)});
/* the Maxwell speed distribution, per (m/s) */
const fM=(v,T,M)=>{const a=M/(2*C.R*T);return 4*Math.PI*Math.pow(a/Math.PI,1.5)*v*v*Math.exp(-a*v*v);};
const TERMS={
  maxwell:["Maxwell distribution","In a gas, molecules don't all move at the same speed. A few are slow, a few are very fast, and most are somewhere in between. The Maxwell distribution is the curve that says how many have each speed."],
  vp:["Most probable speed","The speed at the peak of the Maxwell curve: more molecules have speeds near this than any other."],
  vavg:["Average speed","Add up all the molecules' speeds and divide by how many there are."],
  rms:["Root-mean-square speed","Square every speed, average the squares, take the square root. It's the one that sets the average kinetic energy."]
};
const R_GIVEN={k:"R",sym:RR,name:"gas constant",unit:"J/(mol·K)",val:C.R,why:"Not in the question: a constant you're expected to know.",look:"Not in the question: the gas constant."};

PHYS.add("Maxwell speeds",[

/* ===== The three typical speeds ===== */
{
  id:"mx-speeds", level:"Medium", title:"Three typical speeds", hw:"Course topic: Maxwell distribution of velocities",
  base:{gas:"N2",tC:27},
  random:()=>({gas:pick(Object.keys(GASES)),tC:pick([-73,-23,0,20,27,100,227,527])}),
  calc:p=>{const T=toK(p.tC),M=GASES[p.gas][1]/1000;return Object.assign({T,M},speeds(T,M));},
  text:(p,G,T)=>`${GASES[p.gas][0][0].toUpperCase()+GASES[p.gas][0].slice(1)} gas (${gform(p.gas)}, molar mass ${G("M",`${GASES[p.gas][1]} g/mol`)}) is at ${G("T",`${fmt(p.tC)} °C`)}. Its molecules' speeds follow the ${T("maxwell","Maxwell distribution")}. Find (a) the ${T("vp","most probable speed")}, (b) the ${T("vavg","average speed")}, and (c) the ${T("rms","rms speed")}.`,
  terms:{maxwell:TERMS.maxwell,vp:TERMS.vp,vavg:TERMS.vavg,rms:TERMS.rms},
  given:p=>[
    {k:"M",sym:MOL,name:"molar mass",unit:"kg/mol",val:GASES[p.gas][1]/1000,why:`Speeds need kg/mol: ${GASES[p.gas][1]} g/mol = ${GASES[p.gas][1]/1000} kg/mol.`,look:"The molar mass in kg/mol (÷ 1000).",gtraps:[[GASES[p.gas][1],"That's in g/mol. Divide by 1000 to get kg/mol."]]},
    {k:"T",sym:TT,name:"temperature",unit:"K",val:toK(p.tC),why:"Add 273.15 to the °C.",look:"The temperature in kelvin.",gtraps:[[p.tC,`${fmt(p.tC)} is in °C. Add 273.15.`]]},
    R_GIVEN
  ],
  find:[{sym:VP,name:"most probable speed",unit:"m/s",why:"Part (a). The peak of the curve."},{sym:VAV,name:"average speed",unit:"m/s",why:"Part (b)."},{sym:VRMS,name:"rms speed",unit:"m/s",why:"Part (c). The biggest of the three."}],
  parts:[
    {id:"vp",label:"(a) Most probable speed",sym:VP,unit:"m/s",ans:(p,c)=>c.vp,traps:(p,c)=>clean([[c.vr,"That's the rms speed (with a 3). The most probable speed uses 2: √(2RT/M)."],[c.va,"That's the average speed (with 8/π). The most probable uses 2: √(2RT/M)."],[Math.sqrt(2*C.R*c.T/GASES[p.gas][1]),"The molar mass must be in kg/mol."],[Math.sqrt(2*C.R*Math.max(1,p.tC)/c.M),"Use kelvin."]],c.vp)},
    {id:"va",label:"(b) Average speed",sym:VAV,unit:"m/s",ans:(p,c)=>c.va,traps:(p,c)=>clean([[Math.sqrt(8*C.R*c.T/c.M),"Don't forget the π in the bottom: √(8RT/(πM))."],[c.vp,"That's the most probable speed. The average uses 8/π: √(8RT/(πM))."],[c.vr,"That's the rms speed. The average uses 8/π."],[Math.sqrt(8*C.R*c.T/(Math.PI*GASES[p.gas][1])),"The molar mass must be in kg/mol."]],c.va)},
    {id:"vr",label:"(c) rms speed",sym:VRMS,unit:"m/s",ans:(p,c)=>c.vr,traps:(p,c)=>clean([[c.vp,"That's the most probable speed. The rms speed has a 3: √(3RT/M)."],[c.va,"That's the average speed. The rms speed is √(3RT/M)."],[Math.sqrt(3*C.R*c.T/GASES[p.gas][1]),"The molar mass must be in kg/mol."]],c.vr)}
  ],
  idea:()=>`<p>The molecules in a gas have all sorts of speeds, spread out along the Maxwell curve. Three different "typical" speeds describe it, and they all have the same shape: <b>√(number × RT ÷ M)</b>. Only the number changes:</p>
    <ul class="plain"><li><b>2</b> for the most probable speed (the peak),</li><li><b>8/π ≈ 2.55</b> for the average speed,</li><li><b>3</b> for the rms speed.</li></ul>
    <p>So they always come in the same order: v_p &lt; ⟨v⟩ &lt; v_rms. M must be in kg/mol.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${VP}${OP("=")}${SQ(FR(`2${RR}${TT}`,MOL),true)}${AND}${VAV}${OP("=")}${SQ(FR(`8${RR}${TT}`,`${PI}${MOL}`),true)}${AND}${VRMS}${OP("=")}${SQ(FR(`3${RR}${TT}`,MOL),true)}`)+
    legend([[RR,"gas constant, 8.314","J/(mol·K)"],[TT,"temperature","K"],[MOL,"molar mass","kg/mol"]],"Memory trick: 2, 8/π (= 2.55), 3. Bigger number, bigger speed."),
  plug:(p,c)=>EQ(`${VP}${OP("=")}${SQ(FR(`2${OP("×")}8.314${OP("×")}${fmt(c.T)}`,c.M),true)}`)+EQ(`${VAV}${OP("=")}${SQ(FR(`8${OP("×")}8.314${OP("×")}${fmt(c.T)}`,`${PI}${OP("×")}${c.M}`),true)}${AND}${VRMS}${OP("=")}${SQ(FR(`3${OP("×")}8.314${OP("×")}${fmt(c.T)}`,c.M),true)}`)+calcTip(`sqrt(2*8.314*${R3(c.T)}/${c.M})`),
  solution:(p,c)=>steps([
      ["Units",`${TT} = ${fmt(p.tC)} + 273.15 = ${fmt(c.T)} K, &nbsp;${MOL} = ${c.M} kg/mol`],
      ["(a) Most probable",CALC(`${VP} = √(2 × 8.314 × ${fmt(c.T)} ÷ ${c.M}) = <b>${fmt(c.vp)} m/s</b>`)],
      ["(b) Average",CALC(`${VAV} = √(8 × 8.314 × ${fmt(c.T)} ÷ (π × ${c.M})) = <b>${fmt(c.va)} m/s</b>`)],
      ["(c) rms",CALC(`${VRMS} = √(3 × 8.314 × ${fmt(c.T)} ÷ ${c.M}) = <b>${fmt(c.vr)} m/s</b>`)]
    ])+checkline(`Order check: ${fmt(c.vp)} < ${fmt(c.va)} < ${fmt(c.vr)} ✓. The ratios are always 1 : 1.13 : 1.22.`)+
    finalAns(`${VP} = ${fmt(c.vp)} m/s, &nbsp;${VAV} = ${fmt(c.va)} m/s, &nbsp;${VRMS} = ${fmt(c.vr)} m/s`),
  sheet:[{name:"Maxwell speeds",eq:`${VP}${OP("=")}${SQ(FR(`2${RR}${TT}`,MOL),true)},${OP("")}${VAV}${OP("=")}${SQ(FR(`8${RR}${TT}`,`${PI}${MOL}`),true)},${OP("")}${VRMS}${OP("=")}${SQ(FR(`3${RR}${TT}`,MOL),true)}`,note:"2, 8/π, 3. M in kg/mol."}],
  takeEq:()=>`${VP}${OP("=")}${SQ(FR(`2${RR}${TT}`,MOL),true)}`,
  takeaway:"Three speeds, one shape √(xRT/M): x = 2 for the peak, 8/π for the average, 3 for rms. Always in that order.",
  link:"Your course list: “Maxwell [distribution] of velocities of the molecules”. These three speeds are what exam questions usually ask about it.",
  viz:plot((p,c)=>{const M=c.M,T0=c.T,vmax=3.2*speeds(1500,M).vp,ymax=1.15*fM(speeds(150,M).vp,150,M);
    return {note:"The Maxwell curve for your gas. Drag the temperature: hotter gas has a wider, flatter curve that reaches higher speeds. The area under it is always the same (all the molecules).",
      label:"Temperature",unit:"K",min:150,max:1500,step:10,value:Math.round(T0/10)*10,x:[0,vmax],y:[0,ymax],xl:"speed (m/s) →",yl:"how many",
      curves:s=>{const pts=[];for(let i=0;i<=120;i++){const v=vmax*i/120;pts.push([v,fM(v,s,M)]);}return [{pts,cls:"main",fill:true}];},
      marks:s=>{const q=speeds(s,M);return [{x:q.vp,label:"vₚ",c:"ink-2"},{x:q.va,label:"⟨v⟩",c:"blue",row:1},{x:q.vr,label:"v_rms",c:"heat",row:2}];},
      read:s=>{const q=speeds(s,M);return `At ${s} K: ${VP} = ${fmt(q.vp)}, ${VAV} = ${fmt(q.va)}, ${VRMS} = <b>${fmt(q.vr)} m/s</b>`;}};}),
  scene:{still:2,draw(K,t,p){box(K,40,30,260,170,{});
    for(let i=0;i<30;i++){const sp=0.3+1.6*Math.pow(rnd(i,3),1.4);gas(K,40,30,260,170,t,{n:1,v:60*sp,r:4,seed:i+40,c:sp>1.3?"heat":sp<0.6?"ink2":"blue"});}
    const bx=350,by=196,bw=220,bh=150,nb=11;K.line(bx,by,bx+bw,by,{c:"ink2",w:1.2});K.line(bx,by,bx,by-bh,{c:"ink2",w:1.2});
    const grow=Math.min(1,mod(t,8)/4);for(let i=0;i<nb;i++){const v=(i+0.5)/nb*3.2,h=bh*0.95*grow*(v*v*Math.exp(-v*v))/(Math.exp(-1));K.rect(bx+4+i*bw/nb,by-h,bw/nb-5,h,{fill:i>6?"heat":i<3?"ink2":"blue",c:false,alpha:0.75});}
    K.text("speed →",bx+bw,by+14,{size:11,c:"ink2",align:"right"});K.text("how many",bx+4,by-bh-8,{size:11,c:"ink2",align:"left"});
    loopFade(K,t,8,0.5,0.3);}}
},

/* ===== Light and heavy molecules ===== */
{
  id:"mx-compare", level:"Hard", title:"Light gas, heavy gas", hw:"Course topic: Maxwell distribution of velocities",
  base:{a:"H2",b:"O2",T:300},
  random:()=>{const pr=pick([["H2","O2"],["He","N2"],["He","Ar"],["H2","N2"],["Ne","CO2"],["He","O2"],["H2","CO2"]]);return {a:pr[0],b:pr[1],T:pick([200,250,273,300,350,400,500])};},
  calc:p=>{const Ma=GASES[p.a][1]/1000,Mb=GASES[p.b][1]/1000,va=Math.sqrt(3*C.R*p.T/Ma);return {Ma,Mb,va,ratio:Math.sqrt(Mb/Ma),Tb:p.T*Mb/Ma};},
  text:(p,G,T)=>`A container holds a mixture of ${GASES[p.a][0]} (${gform(p.a)}, ${G("Ma",`${GASES[p.a][1]} g/mol`)}) and ${GASES[p.b][0]} (${gform(p.b)}, ${G("Mb",`${GASES[p.b][1]} g/mol`)}) at ${G("T",`${p.T} K`)}. (a) What is the ${T("rms","rms speed")} of the ${GASES[p.a][0]} molecules? (b) How many times faster (in rms speed) are the ${GASES[p.a][0]} molecules than the ${GASES[p.b][0]} molecules? (c) To what temperature would you have to heat pure ${GASES[p.b][0]} so that its molecules have the same rms speed as the ${GASES[p.a][0]} molecules at ${p.T} K?`,
  terms:{rms:TERMS.rms},
  given:p=>[
    {k:"Ma",sym:sb(mi("M"),"light"),name:`molar mass of ${GASES[p.a][0]}`,unit:"kg/mol",val:GASES[p.a][1]/1000,why:"In kg/mol for speeds (÷ 1000).",look:"The lighter gas's molar mass, in kg/mol.",gtraps:[[GASES[p.a][1],"That's in g/mol. Divide by 1000 to get kg/mol."]]},
    {k:"Mb",sym:sb(mi("M"),"heavy"),name:`molar mass of ${GASES[p.b][0]}`,unit:"kg/mol",val:GASES[p.b][1]/1000,why:"In ratios the units cancel, but list it in kg/mol anyway.",look:"The heavier gas's molar mass, in kg/mol.",gtraps:[[GASES[p.b][1],"That's in g/mol. Divide by 1000 to get kg/mol."]]},
    {k:"T",sym:TT,name:"temperature",unit:"K",val:p.T,why:"Both gases share it: they're mixed together.",look:"The temperature in K."},
    R_GIVEN
  ],
  find:p=>[{sym:sb(mi("v"),"rms,light"),name:`rms speed of ${GASES[p.a][0]}`,unit:"m/s",why:"Part (a)."},{sym:`${sb(mi("v"),"light")}/${sb(mi("v"),"heavy")}`,name:"speed ratio",unit:"",why:"Part (b). No unit."},{sym:sb(mi("T"),"heavy"),name:`temperature for ${GASES[p.b][0]}`,unit:"K",why:"Part (c)."}],
  parts:[
    {id:"va",label:p=>`(a) rms speed of ${GASES[p.a][0]}`,sym:sb(mi("v"),"rms"),unit:"m/s",ans:(p,c)=>c.va,traps:(p,c)=>clean([[Math.sqrt(3*C.R*p.T/GASES[p.a][1]),"The molar mass must be in kg/mol."],[Math.sqrt(3*C.R*p.T/c.Mb),"That's the heavier gas. Part (a) is about the lighter one."],[Math.sqrt(C.R*p.T/c.Ma),"Don't forget the 3."]],c.va)},
    {id:"r",label:"(b) How many times faster",sym:`${sb(mi("v"),"light")}/${sb(mi("v"),"heavy")}`,unit:"",ans:(p,c)=>c.ratio,traps:(p,c)=>clean([[c.Mb/c.Ma,"The speed goes with the square root of 1/M, so take the square root of the mass ratio."],[1/c.ratio,"Upside down: the light gas is the faster one, so the answer is bigger than 1."],[Math.sqrt(c.Ma/c.Mb),"Upside down: √(M_heavy ÷ M_light)."]],c.ratio)},
    {id:"Tb",label:p=>`(c) Temperature for the ${GASES[p.b][0]}`,sym:sb(mi("T"),"heavy"),unit:"K",ans:(p,c)=>c.Tb,traps:(p,c)=>clean([[p.T*c.ratio,"Speed goes with √T, so the temperature has to go up by the square of the speed ratio: T × (M_heavy ÷ M_light)."],[p.T*c.Ma/c.Mb,"Upside down: the heavy gas needs a hotter temperature to keep up."],[p.T,"At the same temperature the heavy gas is slower. It needs to be hotter."]],c.Tb)}
  ],
  idea:()=>`<p>In a mixture, every gas has the same temperature, so every molecule has the same average kinetic energy, ½m₀v². A light molecule has to move faster to carry the same energy.</p>
    <p>From v_rms = √(3RT/M):</p>
    <ul class="plain"><li>At the same T, the speed ratio is √(M_heavy ÷ M_light). Note the square root.</li><li>To give the heavy gas the same speed, its T ÷ M must match: T_heavy = T × M_heavy ÷ M_light.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${VRMS}${OP("=")}${SQ(FR(`3${RR}${TT}`,MOL),true)}${IMPLIES}${FR(sb(mi("v"),"light"),sb(mi("v"),"heavy"))}${OP("=")}${SQ(FR(sb(mi("M"),"heavy"),sb(mi("M"),"light")),true)}`)+EQ(`${FR(sb(mi("T"),"heavy"),sb(mi("M"),"heavy"))}${OP("=")}${FR(TT,sb(mi("M"),"light"))}${IMPLIES}${sb(mi("T"),"heavy")}${OP("=")}${TT}${FR(sb(mi("M"),"heavy"),sb(mi("M"),"light"))}`)+
    legend([[VRMS,"rms speed","m/s"],[MOL,"molar mass","kg/mol"],[TT,"temperature","K"]],"Same speed means the same T ÷ M."),
  plug:(p,c)=>EQ(`${VRMS}${OP("=")}${SQ(FR(`3${OP("×")}8.314${OP("×")}${p.T}`,c.Ma),true)}${AND}${FR(sb(mi("v"),"light"),sb(mi("v"),"heavy"))}${OP("=")}${SQ(FR(GASES[p.b][1],GASES[p.a][1]),true)}`)+EQ(`${sb(mi("T"),"heavy")}${OP("=")}${p.T}${OP("×")}${FR(GASES[p.b][1],GASES[p.a][1])}`)+calcTip(`sqrt(3*8.314*${p.T}/${c.Ma})`),
  solution:(p,c)=>steps([
      ["(a) rms speed of the light gas",CALC(`v = √(3 × 8.314 × ${p.T} ÷ ${c.Ma}) = <b>${fmt(c.va)} m/s</b>`)],
      ["(b) Ratio",CALC(`√(${GASES[p.b][1]} ÷ ${GASES[p.a][1]}) = √${fmt(c.Mb/c.Ma)} = <b>${fmt(c.ratio)}</b>`)],
      ["(c) Same T ÷ M",CALC(`${sb(mi("T"),"heavy")} = ${p.T} × ${GASES[p.b][1]} ÷ ${GASES[p.a][1]} = <b>${fmt(c.Tb)} K</b>`)]
    ])+checkline(`Check (c): √(3 × 8.314 × ${fmt(c.Tb)} ÷ ${c.Mb}) = ${fmt(Math.sqrt(3*C.R*c.Tb/c.Mb))} m/s, the same as (a) ✓`)+
    finalAns(`${VRMS} = ${fmt(c.va)} m/s, &nbsp;ratio ${fmt(c.ratio)}, &nbsp;${sb(mi("T"),"heavy")} = ${fmt(c.Tb)} K`),
  sheet:[{name:"Speed ratio, same T",eq:`${FR(sb(mi("v"),"1"),sb(mi("v"),"2"))}${OP("=")}${SQ(FR(sb(mi("M"),"2"),sb(mi("M"),"1")),true)}`,note:"Lighter gas, faster molecules."}],
  takeEq:()=>`${FR(sb(mi("v"),"1"),sb(mi("v"),"2"))}${OP("=")}${SQ(FR(sb(mi("M"),"2"),sb(mi("M"),"1")),true)}`,
  takeaway:"Same temperature, same average energy: lighter molecules move faster, by √(mass ratio). Equal speeds need equal T ÷ M.",
  link:"This is why light gases like hydrogen and helium slowly escape from Earth's atmosphere: their molecules are the fastest.",
  viz:plot((p,c)=>{const vmax=3.5*speeds(p.T,c.Ma).vp,ymax=1.15*fM(speeds(p.T,c.Mb).vp,p.T,c.Mb);
    return {note:"Both gases at the same temperature: the heavy gas (blue) bunches at low speeds, the light gas (orange) spreads out to high speeds. Drag the temperature.",
      label:"Temperature",unit:"K",min:100,max:1000,step:10,value:p.T,x:[0,vmax],y:[0,ymax],xl:"speed (m/s) →",yl:"how many",
      curves:s=>{const a=[],b=[];for(let i=0;i<=140;i++){const v=vmax*i/140;a.push([v,fM(v,s,c.Ma)]);b.push([v,fM(v,s,c.Mb)]);}return [{pts:b,cls:"main",fill:true},{pts:a,cls:"heat"}];},
      read:s=>`At ${s} K: ${GASES[p.a][0]} <b>${fmt(Math.sqrt(3*C.R*s/c.Ma))} m/s</b>, ${GASES[p.b][0]} <b>${fmt(Math.sqrt(3*C.R*s/c.Mb))} m/s</b> (rms)`};}),
  scene:{still:2,draw(K,t,p){box(K,130,30,340,170,{});gas(K,130,30,340,170,t,{n:12,v:40,r:6,seed:51,c:"blue"});gas(K,130,30,340,170,t,{n:12,v:40*Math.sqrt(GASES[p.b][1]/GASES[p.a][1]),r:3,seed:52,c:"heat"});
    K.text(GASES[p.a][0],520,80,{size:12,c:"heat"});K.text(GASES[p.b][0],520,140,{size:12,c:"blue"});K.circle(520,98,3,{fill:"heat",c:false});K.circle(520,158,6,{fill:"blue",c:false});}}
}

]);
})();
