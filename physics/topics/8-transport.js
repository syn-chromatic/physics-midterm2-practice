/* Collisions & transport: effective diameter, mean free path, and diffusion, viscosity and heat conduction in a gas.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,SQ,EQ,CALC,IMPLIES,AND,PAREN,PI,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,tri,rnd,gas,box,loopFade}=draw;

/* symbols used below */
const PP=mi("p"),TT=mi("T"),KB=mi("k"),DD=mi("d"),N0=sb(mi("n"),"0"),LAM=mi("λ"),VAV=`⟨${mi("v")}⟩`,ZZ=mi("z"),RR=mi("R"),MOL=mi("M"),RHO=mi("ρ");
const DIF=mi("D"),ETA=mi("η"),KAP=mi("κ"),CV=sb(mi("c"),"V");
/* molar mass (g/mol) and effective diameter (m) */
const GASES={He:["helium",4.0,2.2e-10],N2:["nitrogen",28.0,3.7e-10],O2:["oxygen",32.0,3.6e-10],Ar:["argon",39.9,3.4e-10],CO2:["carbon dioxide",44.0,4.6e-10]};
const gform=k=>k.replace(/(\d)/g,d=>"₀₁₂₃₄₅₆₇₈₉"[d]);
const pw=x=>fmt(x);
const TERMS={
  diam:["Effective diameter","How big a molecule acts in a collision: two molecules hit if their centres come closer than d. It's a few tenths of a nanometre (10⁻¹⁰ m)."],
  mfp:["Mean free path","The average distance a molecule travels between one collision and the next."],
  freq:["Collision frequency","How many collisions one molecule has every second."],
  diff:["Diffusion","Molecules of one kind slowly spreading through another gas, like a smell spreading through a room. D says how fast."],
  visc:["Viscosity","A fluid's resistance to flowing: its “thickness”. In a gas it comes from molecules carrying momentum between layers moving at different speeds."],
  cond:["Thermal conductivity","How well a material lets heat flow through it. In a gas, molecules carry energy from hot places to cold ones."]
};
const K_GIVEN={k:"kB",sym:KB,name:"Boltzmann constant",unit:"J/K",val:C.k,why:"Not in the question: type it as 1.38e-23.",look:"Not in the question: the Boltzmann constant."};
const R_GIVEN={k:"R",sym:RR,name:"gas constant",unit:"J/(mol·K)",val:C.R,why:"Not in the question: for the average speed.",look:"Not in the question: the gas constant."};
const calcAll=(gasKey,T,P)=>{const [,Mg,d]=GASES[gasKey],M=Mg/1000,n0=P/(C.k*T),lam=1/(Math.SQRT2*Math.PI*d*d*n0),va=Math.sqrt(8*C.R*T/(Math.PI*M));return {M,d,n0,lam,va,z:va/lam};};

PHYS.add("Collisions & transport",[

/* ===== Mean free path and collisions per second ===== */
{
  id:"tr-path", level:"Medium", title:"How far between collisions?", hw:"Course topic: effective diameter and mean free path",
  base:{gas:"N2",T:293,pk:101.3},
  random:()=>({gas:pick(Object.keys(GASES)),T:pick([250,273,293,300,350,400,500]),pk:pick([101.3,100,50,20,10,1])}),
  calc:p=>calcAll(p.gas,p.T,p.pk*1000),
  text:(p,G,T)=>`${GASES[p.gas][0][0].toUpperCase()+GASES[p.gas][0].slice(1)} (${gform(p.gas)}, molar mass ${G("M",`${GASES[p.gas][1]} g/mol`)}) is at ${G("T",`${p.T} K`)} and ${G("p",`${p.pk} kPa`)}. Its molecules have an ${T("diam","effective diameter")} of ${G("d",`${pw(GASES[p.gas][2])} m`)}. Find (a) the number of molecules per m³, (b) the ${T("mfp","mean free path")}, in nanometres, (c) the average speed of the molecules, and (d) the ${T("freq","collision frequency")} of one molecule.`,
  terms:{diam:TERMS.diam,mfp:TERMS.mfp,freq:TERMS.freq},
  given:p=>[
    {k:"M",sym:MOL,name:"molar mass",unit:"kg/mol",val:GASES[p.gas][1]/1000,why:"In kg/mol for the speed (÷ 1000).",look:"The molar mass in kg/mol.",gtraps:[[GASES[p.gas][1],"That's in g/mol. Divide by 1000."]]},
    {k:"T",sym:TT,name:"temperature",unit:"K",val:p.T,why:"",look:"The temperature in K."},
    {k:"p",sym:PP,name:"pressure",unit:"Pa",val:p.pk*1000,why:"",look:"The pressure in Pa (× 1000).",gtraps:[[p.pk,"That's in kPa. Multiply by 1000 to get Pa."]]},
    {k:"d",sym:DD,name:"effective diameter",unit:"m",val:GASES[p.gas][2],why:"Type it like "+typ(GASES[p.gas][2])+".",look:"The tiny length with × 10⁻¹⁰."},
    K_GIVEN,R_GIVEN
  ],
  find:[{sym:N0,name:"molecules per m³",unit:"1/m³",why:"Part (a)."},{sym:LAM,name:"mean free path",unit:"nm",why:"Part (b). 1 nm = 10⁻⁹ m."},{sym:VAV,name:"average speed",unit:"m/s",why:"Part (c)."},{sym:ZZ,name:"collision frequency",unit:"1/s",why:"Part (d)."}],
  parts:[
    {id:"n0",label:"(a) Molecules per m³",sym:N0,unit:"1/m³",ans:(p,c)=>c.n0,traps:(p,c)=>clean([[p.pk/(C.k*p.T),"Use pascals: × 1000."],[p.pk*1000/(C.R*p.T),"That's moles per m³. For molecules, use k instead of R: n₀ = p ÷ (kT)."]],c.n0)},
    {id:"lam",label:"(b) Mean free path",sym:LAM,unit:"nm",ans:(p,c)=>c.lam*1e9,traps:(p,c)=>clean([[c.lam*1e9*Math.SQRT2,"Don't forget the √2 in the bottom: λ = 1 ÷ (√2 π d² n₀)."],[1e9/(Math.SQRT2*Math.PI*c.d*c.n0),"Square the diameter: d²."],[c.lam*1e9*4,"Use the diameter d, not the radius: the molecules touch when their centres are one whole diameter apart."],[c.lam,"That's in metres. Multiply by 10⁹ for nanometres."],[c.lam*1e6,"1 m = 10⁹ nm, not 10⁶ (that's micrometres)."]],c.lam*1e9)},
    {id:"va",label:"(c) Average speed",sym:VAV,unit:"m/s",ans:(p,c)=>c.va,traps:(p,c)=>clean([[Math.sqrt(3*C.R*p.T/c.M),"That's the rms speed. The average speed is √(8RT/(πM))."],[Math.sqrt(8*C.R*p.T/(Math.PI*GASES[p.gas][1])),"The molar mass must be in kg/mol."]],c.va)},
    {id:"z",label:"(d) Collision frequency",sym:ZZ,unit:"1/s",ans:(p,c)=>c.z,traps:(p,c)=>clean([[c.lam/c.va,"Upside down: collisions per second = speed ÷ distance between collisions."],[c.va/(c.lam*1e9),"Use λ in metres here, not nanometres."]],c.z)}
  ],
  idea:()=>`<p>Picture one molecule zig-zagging through the others. It hits another whenever their centres come within one diameter d, so it sweeps out a cylinder of cross-section πd² as it moves.</p>
    <ul class="plain"><li>(a) First, how crowded is it? From p = n₀kT, the number of molecules per m³ is n₀ = p ÷ (kT).</li>
    <li>(b) The mean free path is the length of cylinder that contains, on average, one other molecule: 1 ÷ (πd²n₀). The √2 corrects for the fact that the other molecules are moving too.</li>
    <li>(c) The average speed is √(8RT/(πM)), from the Maxwell distribution.</li><li>(d) Distance travelled per second ÷ distance per collision = collisions per second.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${N0}${OP("=")}${FR(PP,`${KB}${TT}`)}${AND}${LAM}${OP("=")}${FR("1",`${SQ("2")}${PI}${DD}<sup>2</sup>${N0}`)}`)+EQ(`${VAV}${OP("=")}${SQ(FR(`8${RR}${TT}`,`${PI}${MOL}`),true)}${AND}${ZZ}${OP("=")}${FR(VAV,LAM)}`)+
    legend([[N0,"molecules per m³","1/m³"],[DD,"effective diameter","m"],[LAM,"mean free path","m"],[ZZ,"collisions per second","1/s"]],"Together: λ = kT ÷ (√2 π d² p). Lower pressure means a longer mean free path."),
  plug:(p,c)=>EQ(`${N0}${OP("=")}${FR(fmt(p.pk*1000),`1.38${OP("×")}10<sup>−23</sup>${OP("×")}${p.T}`)}${AND}${LAM}${OP("=")}${FR("1",`${SQ("2")}${OP("×")}${PI}${OP("×")}(${pw(c.d)})<sup>2</sup>${OP("×")}${N0}`)}`)+calcTip(`1/(sqrt(2)*pi*(${typ(c.d)})^2*${typ(c.n0)})*1e9`," That gives λ in nm."),
  solution:(p,c)=>steps([
      ["(a) Molecules per m³",CALC(`${N0} = ${fmt(p.pk*1000)} ÷ (1.38 × 10⁻²³ × ${p.T}) = <b>${fmt(c.n0)} m⁻³</b>`)],
      ["(b) Mean free path",CALC(`${LAM} = 1 ÷ (√2 × π × (${pw(c.d)})² × ${fmt(c.n0)}) = ${fmt(c.lam)} m = <b>${fmt(c.lam*1e9)} nm</b>`)],
      ["(c) Average speed",CALC(`${VAV} = √(8 × 8.314 × ${p.T} ÷ (π × ${c.M})) = <b>${fmt(c.va)} m/s</b>`)],
      ["(d) Collisions per second",CALC(`${ZZ} = ${fmt(c.va)} ÷ ${fmt(c.lam)} = <b>${fmt(c.z)} s⁻¹</b>`)]
    ])+checkline(`Sense check: λ is ${fmt(c.lam/c.d)} times the molecule's own size, so the gas is mostly empty space ✓`)+
    finalAns(`${N0} = ${fmt(c.n0)} m⁻³, &nbsp;${LAM} = ${fmt(c.lam*1e9)} nm, &nbsp;${VAV} = ${fmt(c.va)} m/s, &nbsp;${ZZ} = ${fmt(c.z)} s⁻¹`),
  sheet:[{name:"Mean free path",eq:`${LAM}${OP("=")}${FR("1",`${SQ("2")}${PI}${DD}<sup>2</sup>${N0}`)}${OP("=")}${FR(`${KB}${TT}`,`${SQ("2")}${PI}${DD}<sup>2</sup>${PP}`)}`,note:"d = effective diameter."},{name:"Collision frequency",eq:`${ZZ}${OP("=")}${FR(VAV,LAM)}`,note:"⟨v⟩ = √(8RT/πM)."}],
  takeEq:()=>`${LAM}${OP("=")}${FR(`${KB}${TT}`,`${SQ("2")}${PI}${DD}<sup>2</sup>${PP}`)}`,
  takeaway:"n₀ = p/kT, λ = 1/(√2 π d² n₀), and collisions per second = ⟨v⟩/λ. Lower pressure, longer free path.",
  link:"Your course list: “Effective molecular diameter and free fly path [mean free path]”.",
  viz:viz.slider((p,c)=>({note:"Drag the pressure. Halve it and the mean free path doubles. In a good vacuum it reaches metres.",label:"Pressure",unit:"kPa",min:1,max:200,step:1,value:Math.min(200,Math.max(1,Math.round(p.pk))),
    bars:[{label:"Mean free path (full bar = at 1 kPa)",segs:[{cls:"seg-ke",frac:x=>1/x}]}],
    read:x=>`${LAM} = <b>${fmt(c.lam*p.pk/x*1e9)} nm</b>, &nbsp;${ZZ} = <b>${fmt(c.z*x/p.pk)} s⁻¹</b>`})),
  scene:{still:2,draw(K,t,p){box(K,60,24,480,180,{});gas(K,60,24,480,180,t*0.4,{n:40,v:40,r:5,seed:61,c:"ink2",alpha:0.45});
    const pts=[[90,150]];for(let i=1;i<9;i++)pts.push([90+i*55+30*(rnd(i,3)-0.5),50+130*rnd(i,5)]);
    const L=[];let tot=0;for(let i=1;i<pts.length;i++){const l=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(l);tot+=l;}
    let s=mod(t*70,tot+60),x=pts[0][0],y=pts[0][1];const drawn=[pts[0]];
    for(let i=1;i<pts.length&&s>0;i++){const l=L[i-1],f=Math.min(1,s/l);x=pts[i-1][0]+(pts[i][0]-pts[i-1][0])*f;y=pts[i-1][1]+(pts[i][1]-pts[i-1][1])*f;drawn.push([x,y]);if(f===1)K.circle(pts[i][0],pts[i][1],9,{c:"heat",w:1.4,alpha:0.6});s-=l;}
    K.poly(drawn,{c:"heat",w:1.6,dash:[4,4]});K.circle(x,y,5.5,{fill:"heat",c:false});K.tag("each straight bit: a free path",420,212,{size:11});}}
},

/* ===== Diffusion, viscosity and heat conduction in a gas ===== */
{
  id:"tr-transport", level:"Hard", title:"Diffusion, viscosity, heat conduction", hw:"Course topic: transport phenomena",
  base:{gas:"N2",T:273,pk:100},
  random:()=>({gas:pick(["N2","O2","Ar","He","CO2"]),T:pick([250,273,300,350,400]),pk:pick([50,80,100,101.3,150])}),
  calc:p=>{const b=calcAll(p.gas,p.T,p.pk*1000),rho=p.pk*1000*b.M/(C.R*p.T),D=b.lam*b.va/3,eta=rho*D,i=["He","Ar"].includes(p.gas)?3:5,cv=i/2*C.R/b.M;return Object.assign(b,{rho,D,eta,i,cv,kap:eta*cv});},
  text:(p,G,T)=>{const [name,Mg,d]=GASES[p.gas];return `${name[0].toUpperCase()+name.slice(1)} (${gform(p.gas)}, molar mass ${G("M",`${Mg} g/mol`)}, ${T("diam","effective diameter")} ${G("d",`${pw(d)} m`)}) is at ${G("T",`${p.T} K`)} and ${G("p",`${p.pk} kPa`)}. Use the simple kinetic-theory formulas to find (a) the mean free path, in nm, (b) the ${T("diff","diffusion coefficient")}, (c) the ${T("visc","viscosity")}, and (d) the ${T("cond","thermal conductivity")}. ${["He","Ar"].includes(p.gas)?`${name[0].toUpperCase()+name.slice(1)} is monatomic`:"The molecule has two atoms"}, which sets its specific heat.`;},
  terms:{diam:TERMS.diam,diff:TERMS.diff,visc:TERMS.visc,cond:TERMS.cond},
  given:p=>[
    {k:"M",sym:MOL,name:"molar mass",unit:"kg/mol",val:GASES[p.gas][1]/1000,why:"",look:"The molar mass in kg/mol.",gtraps:[[GASES[p.gas][1],"That's in g/mol. Divide by 1000."]]},
    {k:"d",sym:DD,name:"effective diameter",unit:"m",val:GASES[p.gas][2],why:"",look:"The tiny length with × 10⁻¹⁰."},
    {k:"T",sym:TT,name:"temperature",unit:"K",val:p.T,why:"",look:"The temperature in K."},
    {k:"p",sym:PP,name:"pressure",unit:"Pa",val:p.pk*1000,why:"",look:"The pressure in Pa (× 1000).",gtraps:[[p.pk,"That's in kPa. Multiply by 1000."]]},
    K_GIVEN,R_GIVEN
  ],
  find:[{sym:LAM,name:"mean free path",unit:"nm",why:"Part (a)."},{sym:DIF,name:"diffusion coefficient",unit:"m²/s",why:"Part (b)."},{sym:ETA,name:"viscosity",unit:"Pa·s",why:"Part (c)."},{sym:KAP,name:"thermal conductivity",unit:"W/(m·K)",why:"Part (d)."}],
  parts:[
    {id:"lam",label:"(a) Mean free path",sym:LAM,unit:"nm",ans:(p,c)=>c.lam*1e9,traps:(p,c)=>clean([[c.lam*1e9*Math.SQRT2,"Don't forget the √2: λ = kT ÷ (√2 π d² p)."],[c.lam,"That's in metres. × 10⁹ for nm."]],c.lam*1e9)},
    {id:"D",label:"(b) Diffusion coefficient",sym:DIF,unit:"m²/s",ans:(p,c)=>c.D,traps:(p,c)=>clean([[c.lam*c.va,"Don't forget the ⅓: D = ⅓λ⟨v⟩."],[c.lam*Math.sqrt(3*C.R*p.T/c.M)/3,"Use the average speed √(8RT/πM), not the rms speed."],[c.D*1e9,"Use λ in metres, not nm."]],c.D)},
    {id:"eta",label:"(c) Viscosity",sym:ETA,unit:"Pa·s",ans:(p,c)=>c.eta,traps:(p,c)=>clean([[c.D,"That's D. Viscosity is the density times D: η = ρD."],[c.eta*3,"Keep the ⅓: η = ⅓ρλ⟨v⟩."],[c.D*p.pk*1000*GASES[p.gas][1]/(C.R*p.T),"The density needs M in kg/mol: ρ = pM ÷ (RT)."]],c.eta)},
    {id:"kap",label:"(d) Thermal conductivity",sym:KAP,unit:"W/(m·K)",ans:(p,c)=>c.kap,traps:(p,c)=>clean([[c.eta*(c.i===3?5:3)/2*C.R/c.M,c.i===3?"A monatomic gas has 3 degrees of freedom, so c_V = (3/2)R ÷ M.":"A two-atom molecule has 5 degrees of freedom (3 moving + 2 spinning), so c_V = (5/2)R ÷ M."],[c.eta*(c.i/2)*C.R,"Use the specific heat per kilogram: divide by M (in kg/mol)."],[c.eta*(c.i/2+1)*C.R/c.M,"Use c_V (constant volume), not c_p."]],c.kap)}
  ],
  idea:p=>`<p>All three transport effects are the same picture: molecules wander about, each carrying something with it for one free path λ before it collides. They're just carrying different things:</p>
    <ul class="plain"><li><b>Diffusion</b> (D): they carry <i>themselves</i>. D = ⅓λ⟨v⟩.</li><li><b>Viscosity</b> (η): they carry <i>momentum</i> between faster and slower layers. Multiply D by the density: η = ρD.</li>
    <li><b>Heat conduction</b> (κ): they carry <i>energy</i>. Multiply η by the specific heat per kg: κ = η c_V.</li></ul>
    <p>You'll need λ (from the last question's formula), the average speed √(8RT/πM), the density ρ = pM/(RT), and c_V = (i/2)R ÷ M, with i = ${["He","Ar"].includes(p.gas)?"3 for a monatomic gas":"5 for a two-atom molecule"}.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${LAM}${OP("=")}${FR(`${KB}${TT}`,`${SQ("2")}${PI}${DD}<sup>2</sup>${PP}`)}${AND}${VAV}${OP("=")}${SQ(FR(`8${RR}${TT}`,`${PI}${MOL}`),true)}`)+EQ(`${DIF}${OP("=")}${FR("1","3")}${LAM}${VAV}${AND}${ETA}${OP("=")}${RHO}${DIF}${AND}${KAP}${OP("=")}${ETA}${CV}`)+EQ(`${RHO}${OP("=")}${FR(`${PP}${MOL}`,`${RR}${TT}`)}${AND}${CV}${OP("=")}${FR(mi("i"),"2")}${FR(RR,MOL)}`)+
    legend([[DIF,"diffusion coefficient","m²/s"],[ETA,"viscosity","Pa·s"],[KAP,"thermal conductivity","W/(m·K)"],[CV,"specific heat per kg at constant volume","J/(kg·K)"],[mi("i"),"degrees of freedom: 3 (one atom), 5 (two atoms)",""]]),
  plug:(p,c)=>EQ(`${DIF}${OP("=")}${FR("1","3")}${OP("×")}${fmt(c.lam)}${OP("×")}${fmt(c.va)}${AND}${RHO}${OP("=")}${FR(`${fmt(p.pk*1000)}${OP("×")}${c.M}`,`8.314${OP("×")}${p.T}`)}`)+EQ(`${ETA}${OP("=")}${RHO}${DIF}${AND}${CV}${OP("=")}${FR(c.i,"2")}${OP("×")}${FR("8.314",c.M)}`)+calcTip(`${typ(c.lam)}*${R3(c.va)}/3`," That's D."),
  solution:(p,c)=>steps([
      ["(a) Mean free path",CALC(`${LAM} = 1.38 × 10⁻²³ × ${p.T} ÷ (√2 × π × (${pw(c.d)})² × ${fmt(p.pk*1000)}) = ${fmt(c.lam)} m = <b>${fmt(c.lam*1e9)} nm</b>`)],
      ["Average speed",CALC(`${VAV} = √(8 × 8.314 × ${p.T} ÷ (π × ${c.M})) = ${fmt(c.va)} m/s`)],
      ["(b) Diffusion",CALC(`${DIF} = ⅓ × ${fmt(c.lam)} × ${fmt(c.va)} = <b>${fmt(c.D)} m²/s</b>`)],
      ["(c) Viscosity",CALC(`${RHO} = ${fmt(p.pk*1000)} × ${c.M} ÷ (8.314 × ${p.T}) = ${fmt(c.rho)} kg/m³ &nbsp;→&nbsp; ${ETA} = ${fmt(c.rho)} × ${fmt(c.D)} = <b>${fmt(c.eta)} Pa·s</b>`)],
      ["(d) Thermal conductivity",CALC(`${CV} = ${c.i}/2 × 8.314 ÷ ${c.M} = ${fmt(c.cv)} J/(kg·K) &nbsp;→&nbsp; ${KAP} = ${fmt(c.eta)} × ${fmt(c.cv)} = <b>${fmt(c.kap)} W/(m·K)</b>`)]
    ])+checkline(`These simple formulas get the right size (real gases are within a factor of about 2): air's real viscosity is about 1.8 × 10⁻⁵ Pa·s and its conductivity about 0.025 W/(m·K).`)+
    finalAns(`${LAM} = ${fmt(c.lam*1e9)} nm, &nbsp;${DIF} = ${fmt(c.D)} m²/s, &nbsp;${ETA} = ${fmt(c.eta)} Pa·s, &nbsp;${KAP} = ${fmt(c.kap)} W/(m·K)`),
  sheet:[{name:"Transport in a gas",eq:`${DIF}${OP("=")}${FR("1","3")}${LAM}${VAV},${OP("")}${ETA}${OP("=")}${RHO}${DIF},${OP("")}${KAP}${OP("=")}${ETA}${CV}`,note:"Molecules carry mass, momentum or energy one free path at a time."}],
  takeEq:()=>`${DIF}${OP("=")}${FR("1","3")}${LAM}${VAV},${OP("")}${ETA}${OP("=")}${RHO}${DIF},${OP("")}${KAP}${OP("=")}${ETA}${CV}`,
  takeaway:"Diffusion D = ⅓λ⟨v⟩; viscosity η = ρD; heat conduction κ = ηc_V. Same molecules, carrying different things.",
  link:"Your course list: “Transport phenomena: diffusion, thermal conductivity, viscosity”. All three come from the mean free path.",
  viz:viz.slider((p,c)=>({note:"Drag the pressure. The mean free path shrinks as the gas gets denser, and diffusion slows down. Viscosity and conductivity don't change at all: more molecules, but each carries things a shorter distance.",label:"Pressure",unit:"kPa",min:10,max:300,step:5,value:Math.round(p.pk/5)*5,
    bars:[{label:"Diffusion coefficient D (full bar = at 10 kPa)",segs:[{cls:"seg-ke",frac:x=>10/x}]},{label:"Viscosity η (doesn't depend on pressure)",segs:[{cls:"seg-alt",frac:x=>0.6}]}],
    read:x=>`${DIF} = <b>${fmt(c.D*p.pk/x)} m²/s</b>, &nbsp;${ETA} = <b>${fmt(c.eta)} Pa·s</b>`})),
  scene:{still:3,draw(K,t,p){box(K,40,30,520,170,{});const u=mod(t,10),spread=Math.min(1,u/8);
    for(let i=0;i<30;i++){const x0=60+60*rnd(i,1),xr=60+460*rnd(i,2),x=x0+(xr-x0)*Math.sqrt(spread)+6*Math.sin(t*3+i),y=40+150*rnd(i,3)+6*Math.cos(t*2.6+i);K.circle(x,y,4,{fill:"heat",c:false,alpha:0.85});}
    gas(K,40,30,520,170,t*0.3,{n:40,v:30,r:3.5,seed:71,c:"blue",alpha:0.4});K.tag("diffusing molecules spread out",300,212,{size:11});
    loopFade(K,t,10,0.6,0.3);}}
}

]);
})();
