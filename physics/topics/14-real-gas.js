/* Real gases: the van der Waals equation and the critical point.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,OP,FR,EQ,CALC,IMPLIES,AND,PAREN,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {C,R3,S3,clean,pr,typ,toK,plot,draw}=PHYS;
const {F,mod,fadeIn,tri,rnd,gas,box,flame,loopFade}=draw;

/* symbols used below */
const PP=mi("p"),VV=mi("V"),NN=mi("n"),RR=mi("R"),TT=mi("T"),AA=mi("a"),BB=mi("b"),TC=sb(mi("T"),"c"),PC=sb(mi("p"),"c"),VC=sb(mi("V"),"c");
/* van der Waals constants: name, formula, a (Pa·m⁶/mol²), b (m³/mol) */
const VDW={CO2:["carbon dioxide","CO₂",0.364,4.27e-5],N2:["nitrogen","N₂",0.137,3.87e-5],O2:["oxygen","O₂",0.138,3.18e-5],H2O:["water vapour","H₂O",0.554,3.05e-5],NH3:["ammonia","NH₃",0.422,3.71e-5],CH4:["methane","CH₄",0.228,4.28e-5]};
const TERMS={
  vdw:["van der Waals equation","A better gas law for real gases. It adds two fixes to pV = nRT: molecules take up some space (b), and they pull on each other a little (a)."],
  a:["Constant a","How strongly the molecules attract each other. The attraction lowers the pressure on the walls."],
  b:["Constant b","The volume one mole of molecules takes up by itself, which isn't free for moving in."],
  critical:["Critical point","Above the critical temperature a gas can't be turned into a liquid by squeezing, however hard. At the critical point, liquid and gas become the same."]
};

PHYS.add("Real gas",[

/* ===== Ideal vs van der Waals ===== */
{
  id:"rg-vdw", level:"Medium", title:"When the ideal gas law fails", hw:"Course topic: real gases, van der Waals equation",
  base:{g:"CO2",n:2,VL:1,T:300},
  random:()=>{for(;;){const n=pick([1,2,3,4,5]),q={g:pick(Object.keys(VDW)),n,VL:+(n*pick([0.2,0.25,0.3,0.4,0.5])).toFixed(2),T:pick([300,350,400,450,500])};
    /* keep sets where the correction is clear (2 % or more) but the gas is still a gas (under 40 %) */
    const a=VDW[q.g][2],b=VDW[q.g][3],V=q.VL/1000,pi=n*C.R*q.T/V,pv=n*C.R*q.T/(V-n*b)-a*n*n/V/V,d=Math.abs(pi-pv)/pv*100;if(d>=2&&d<=40)return q;}},
  calc:p=>{const a=VDW[p.g][2],b=VDW[p.g][3],V=p.VL/1000,pi=p.n*C.R*p.T/V,pv=p.n*C.R*p.T/(V-p.n*b)-a*p.n**2/V**2;return {a,b,V,pi:pi/1e6,pv:pv/1e6,diff:(pi-pv)/pv*100,rep:p.n*C.R*p.T/(V-p.n*b)/1e6,att:a*p.n**2/V**2/1e6};},
  text:(p,G,T)=>`A ${G("V",`${p.VL} L`)} steel cylinder holds ${G("n",`${p.n} mol`)} of ${VDW[p.g][0]} (${VDW[p.g][1]}) at ${G("T",`${p.T} K`)}. Its ${T("vdw","van der Waals")} constants are ${G("a",`a = ${VDW[p.g][2]} Pa·m⁶/mol²`)} and ${G("b",`b = ${fmt(VDW[p.g][3])} m³/mol`)}. Find the pressure in MPa (a) with the ideal gas law and (b) with the van der Waals equation. (c) By how many percent does the ideal gas law overestimate the pressure?`,
  terms:{vdw:TERMS.vdw},
  given:p=>[
    {k:"V",sym:VV,name:"volume",unit:"m³",val:p.VL/1000,why:"In m³.",look:"The volume in m³ (÷ 1000).",gtraps:[[p.VL,"Convert litres to m³: ÷ 1000."]]},
    {k:"n",sym:NN,name:"amount of gas",unit:"mol",val:p.n,why:"",look:"The number measured in mol."},
    {k:"T",sym:TT,name:"temperature",unit:"K",val:p.T,why:"",look:"The temperature."},
    {k:"a",sym:AA,name:"attraction constant",unit:"Pa·m⁶/mol²",val:VDW[p.g][2],why:"",look:"The constant a."},
    {k:"b",sym:BB,name:"molecule volume constant",unit:"m³/mol",val:VDW[p.g][3],why:"Type it with e: "+VDW[p.g][3].toExponential().replace("e-","e-")+".",look:"The constant b."},
    {k:"R",sym:RR,name:"gas constant",unit:"J/(mol·K)",val:C.R,why:"Not in the question: a constant you're expected to know.",look:"Not in the question: the gas constant."}
  ],
  find:[{sym:sb(PP,"ideal"),name:"ideal gas pressure",unit:"MPa",why:"Part (a)."},{sym:sb(PP,"vdW"),name:"van der Waals pressure",unit:"MPa",why:"Part (b)."},{sym:"%",name:"how much too high the ideal law is",unit:"%",why:"Part (c): (ideal − vdW) ÷ vdW."}],
  parts:[
    {id:"pi",label:"(a) Ideal gas law",sym:sb(PP,"ideal"),unit:"MPa",ans:(p,c)=>c.pi,traps:(p,c)=>clean([[c.pi*1000,"Convert litres to m³."],[c.pi*1e6,"That's in Pa. Divide by 10⁶ for MPa."]],c.pi)},
    {id:"pv",label:"(b) van der Waals",sym:sb(PP,"vdW"),unit:"MPa",ans:(p,c)=>c.pv,traps:(p,c)=>clean([[c.rep,"Subtract the attraction term an²/V² too."],[c.pi-c.att,"Use V − nb in the first term: the molecules take up some of the space."],[c.rep+c.att,"Subtract the attraction term an²/V², don't add it: attraction lowers the pressure."],[(p.n*C.R*p.T/(c.V-c.b)-c.a/c.V**2)/1e6,"Both corrections scale with n: V − nb, and an²/V²."]],c.pv)},
    {id:"d",label:"(c) Ideal law too high by",sym:"%",unit:"%",ans:(p,c)=>c.diff,traps:(p,c)=>clean([[(c.pi-c.pv)/c.pi*100,"Compare with the van der Waals (more accurate) value: divide by p_vdW."],[c.diff/100,"As a percentage: × 100."]],c.diff)}
  ],
  idea:()=>`<p>The ideal gas law pretends molecules are points that never touch. Real molecules:</p>
    <ul class="plain"><li><b>take up space</b>: the free room to move in is V − nb, which pushes the pressure <b>up</b>;</li>
    <li><b>attract each other</b> a little: molecules about to hit the wall are pulled back, which brings the pressure <b>down</b> by an²/V².</li></ul>
    <p>Squeezed into a small space, both effects matter. At low pressure, the van der Waals answer and the ideal answer agree.</p>`,
  formula:()=>EQ(`${sb(PP,"ideal")}${OP("=")}${FR(`${NN}${RR}${TT}`,VV)}${AND}${sb(PP,"vdW")}${OP("=")}${FR(`${NN}${RR}${TT}`,`${VV}${OP("−")}${NN}${BB}`)}${OP("−")}${FR(`${AA}${NN}<sup>2</sup>`,`${VV}<sup>2</sup>`)}`)+
    legend([[AA,"attraction constant","Pa·m⁶/mol²"],[BB,"volume of 1 mol of molecules","m³/mol"],[VV,"volume of the container","m³"]],"The same as (p + an²/V²)(V − nb) = nRT."),
  plug:(p,c)=>EQ(`${sb(PP,"vdW")}${OP("=")}${FR(`${p.n}${OP("×")}8.314${OP("×")}${p.T}`,`${p.VL/1000}${OP("−")}${p.n}${OP("×")}${fmt(c.b)}`)}${OP("−")}${FR(`${c.a}${OP("×")}${p.n}<sup>2</sup>`,`${p.VL/1000}<sup>2</sup>`)}`)+calcTip(`${p.n}*8.314*${p.T}/(${p.VL/1000}-${p.n}*${c.b})-${c.a}*${p.n}^2/${p.VL/1000}^2`," That's in Pa."),
  solution:(p,c)=>steps([
      ["(a) Ideal",CALC(`${p.n} × 8.314 × ${p.T} ÷ ${p.VL/1000} = ${fmt(c.pi*1e6)} Pa = <b>${fmt(c.pi)} MPa</b>`)],
      ["Space taken by the molecules",CALC(`${VV} − ${NN}${BB} = ${p.VL/1000} − ${p.n} × ${fmt(c.b)} = ${fmt(c.V-p.n*c.b)} m³ &nbsp;→ &nbsp;${fmt(c.rep)} MPa`)],
      ["Attraction",CALC(`${AA}${NN}²/${VV}² = ${c.a} × ${p.n}² ÷ ${p.VL/1000}² = ${fmt(c.att)} MPa`)],
      ["(b) van der Waals",CALC(`${fmt(c.rep)} − ${fmt(c.att)} = <b>${fmt(c.pv)} MPa</b>`)],
      ["(c) Difference",CALC(`(${fmt(c.pi)} − ${fmt(c.pv)}) ÷ ${fmt(c.pv)} × 100 = <b>${fmt(c.diff)} %</b>`)]
    ])+checkline(c.diff>0?"Here attraction wins, so the real pressure is lower than the ideal one.":"Here the molecules' own size wins, so the real pressure is higher, and the ideal law underestimates it (a negative answer).")+
    finalAns(`${sb(PP,"ideal")} = ${fmt(c.pi)} MPa, &nbsp;${sb(PP,"vdW")} = ${fmt(c.pv)} MPa, &nbsp;${fmt(c.diff)} %`),
  sheet:[{name:"van der Waals equation",eq:`${PAREN(`${PP}${OP("+")}${FR(`${AA}${NN}<sup>2</sup>`,`${VV}<sup>2</sup>`)}`)}${PAREN(`${VV}${OP("−")}${NN}${BB}`)}${OP("=")}${NN}${RR}${TT}`,note:"a: attraction; b: molecules' own volume per mole."}],
  takeEq:()=>`${PP}${OP("=")}${FR(`${NN}${RR}${TT}`,`${VV}${OP("−")}${NN}${BB}`)}${OP("−")}${FR(`${AA}${NN}<sup>2</sup>`,`${VV}<sup>2</sup>`)}`,
  takeaway:"Real gas: p = nRT/(V − nb) − an²/V². b (size) raises p, a (attraction) lowers it. SI units throughout.",
  link:"Your course list: “Real gas. Van der Waals equation.”",
  viz:viz.slider((p,c)=>({note:"Drag the volume. In a big container the two laws agree; squeeze the gas and they split apart.",label:"Volume",unit:"L",min:+(p.n*0.1).toFixed(2),max:+(p.n*5).toFixed(1),step:+(p.n*0.05).toFixed(2),value:p.VL,
    bars:[{label:"van der Waals ÷ ideal (full bar = equal)",segs:[{cls:"seg-ke",frac:x=>{const V=x/1000,i=p.n*C.R*p.T/V,v=p.n*C.R*p.T/(V-p.n*c.b)-c.a*p.n**2/V**2;return Math.max(0,Math.min(1,v/i));}}]}],
    read:x=>{const V=x/1000,i=p.n*C.R*p.T/V/1e6,v=(p.n*C.R*p.T/(V-p.n*c.b)-c.a*p.n**2/V**2)/1e6;return `ideal ${fmt(i)} MPa, &nbsp;van der Waals <b>${fmt(v)} MPa</b>`;}})),
  scene:{still:2,draw(K,t,p){box(K,60,30,240,170,{});gas(K,62,32,236,166,t,{n:30,v:30,r:3,seed:71});K.tag("ideal: points",180,212,{size:11});
    box(K,330,30,240,170,{});const pts=[];for(let i=0;i<22;i++){const x=345+210*tri(rnd(i,1)*2+t*0.06*(0.5+rnd(i,2))),y=45+140*tri(rnd(i,3)*2+t*0.05*(0.5+rnd(i,4)));pts.push([x,y]);}
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const d=Math.hypot(pts[i][0]-pts[j][0],pts[i][1]-pts[j][1]);if(d<48)K.line(pts[i][0],pts[i][1],pts[j][0],pts[j][1],{c:"heat",w:2,alpha:0.9*(1-d/48)});}
    pts.forEach(q=>K.circle(q[0],q[1],10,{fill:"blue",c:"ink",w:1,alpha:0.8}));K.tag("real: size + attraction",450,212,{size:11});}}
},

/* ===== Critical point ===== */
{
  id:"rg-critical", level:"Hard", title:"Critical point from a and b", hw:"Course topic: real gases, critical state",
  base:{g:"CO2"},
  random:()=>({g:pick(Object.keys(VDW))}),
  calc:p=>{const a=VDW[p.g][2],b=VDW[p.g][3];return {a,b,Tc:8*a/(27*C.R*b),pc:a/(27*b*b)/1e6,Vc:3*b*1e6};},
  text:(p,G,T)=>`For ${VDW[p.g][0]} (${VDW[p.g][1]}), the van der Waals constants are ${G("a",`a = ${VDW[p.g][2]} Pa·m⁶/mol²`)} and ${G("b",`b = ${fmt(VDW[p.g][3])} m³/mol`)}. Find its ${T("critical","critical point")}: (a) the critical temperature, (b) the critical pressure in MPa, and (c) the critical volume of one mole in cm³.`,
  terms:{critical:TERMS.critical},
  given:p=>[
    {k:"a",sym:AA,name:"attraction constant",unit:"Pa·m⁶/mol²",val:VDW[p.g][2],why:"",look:"The constant a."},
    {k:"b",sym:BB,name:"molecule volume constant",unit:"m³/mol",val:VDW[p.g][3],why:"",look:"The constant b."},
    {k:"R",sym:RR,name:"gas constant",unit:"J/(mol·K)",val:C.R,why:"Not in the question: a constant you're expected to know.",look:"Not in the question: the gas constant."}
  ],
  find:[{sym:TC,name:"critical temperature",unit:"K",why:"Part (a)."},{sym:PC,name:"critical pressure",unit:"MPa",why:"Part (b)."},{sym:VC,name:"critical volume of one mole",unit:"cm³",why:"Part (c). 1 m³ = 10⁶ cm³."}],
  parts:[
    {id:"Tc",label:"(a) Critical temperature",sym:TC,unit:"K",ans:(p,c)=>c.Tc,traps:(p,c)=>clean([[c.a/(27*C.R*c.b),"Don't forget the 8 on top: T_c = 8a/(27Rb)."],[8*c.a/(C.R*c.b),"Divide by 27 too."],[8*c.a*c.b/(27*C.R),"b goes in the bottom."]],c.Tc)},
    {id:"pc",label:"(b) Critical pressure",sym:PC,unit:"MPa",ans:(p,c)=>c.pc,traps:(p,c)=>clean([[c.a/(27*c.b)/1e6,"Square b: p_c = a/(27b²)."],[c.pc*1e6,"That's in Pa. Divide by 10⁶."],[c.a/(c.b*c.b)/1e6,"Divide by 27 too."]],c.pc)},
    {id:"Vc",label:"(c) Critical volume of one mole",sym:VC,unit:"cm³",ans:(p,c)=>c.Vc,traps:(p,c)=>clean([[c.b*1e6,"The critical volume is 3b."],[3*c.b,"That's in m³. Multiply by 10⁶ for cm³."],[3*c.b*1000,"1 m³ = 10⁶ cm³ (10³ is litres)."]],c.Vc)}
  ],
  idea:()=>`<p>On the p–V graph, van der Waals curves at low temperature have a wiggle (where the gas would turn liquid). As you raise the temperature the wiggle shrinks, and at the <b>critical temperature</b> it flattens into a single point where the curve is level and changes its bend.</p>
    <p>Solving for that point gives three neat formulas in terms of a and b. Above T_c you can't liquefy the gas by squeezing alone.</p>`,
  formula:()=>EQ(`${TC}${OP("=")}${FR(`8${AA}`,`27${RR}${BB}`)}${AND}${PC}${OP("=")}${FR(AA,`27${BB}<sup>2</sup>`)}${AND}${VC}${OP("=")}3${BB}`)+
    legend([[TC,"critical temperature","K"],[PC,"critical pressure","Pa"],[VC,"volume of one mole at the critical point","m³"]],"From the conditions dp/dV = 0 and d²p/dV² = 0 on the van der Waals curve."),
  plug:(p,c)=>EQ(`${TC}${OP("=")}${FR(`8${OP("×")}${c.a}`,`27${OP("×")}8.314${OP("×")}${fmt(c.b)}`)}${AND}${PC}${OP("=")}${FR(c.a,`27${OP("×")}(${fmt(c.b)})<sup>2</sup>`)}`)+calcTip(`8*${c.a}/(27*8.314*${c.b})`),
  solution:(p,c)=>steps([
      ["(a) Temperature",CALC(`${TC} = 8 × ${c.a} ÷ (27 × 8.314 × ${fmt(c.b)}) = <b>${fmt(c.Tc)} K</b>`)+` (${fmt(c.Tc-273.15)} °C)`],
      ["(b) Pressure",CALC(`${PC} = ${c.a} ÷ (27 × (${fmt(c.b)})²) = ${fmt(c.pc*1e6)} Pa = <b>${fmt(c.pc)} MPa</b>`)],
      ["(c) Volume",CALC(`${VC} = 3 × ${fmt(c.b)} = ${fmt(3*c.b)} m³ = <b>${fmt(c.Vc)} cm³</b>`)]
    ])+checkline(`Check: p_c V_c ÷ (R T_c) = ${fmt(c.pc*1e6*3*c.b/(C.R*c.Tc))}, which is 3/8 = 0.375 for every van der Waals gas ✓`)+
    finalAns(`${TC} = ${fmt(c.Tc)} K, &nbsp;${PC} = ${fmt(c.pc)} MPa, &nbsp;${VC} = ${fmt(c.Vc)} cm³`),
  sheet:[{name:"Critical point (van der Waals)",eq:`${TC}${OP("=")}${FR(`8${AA}`,`27${RR}${BB}`)},${OP("")}${PC}${OP("=")}${FR(AA,`27${BB}<sup>2</sup>`)},${OP("")}${VC}${OP("=")}3${BB}`,note:"Per mole."}],
  takeEq:()=>`${TC}${OP("=")}${FR(`8${AA}`,`27${RR}${BB}`)}`,
  takeaway:"Critical point: T_c = 8a/(27Rb), p_c = a/(27b²), V_c = 3b per mole. Above T_c, no squeezing can make a liquid.",
  link:"Your course list: “Real gas. Critical state.” The same a and b as in “When the ideal gas law fails”.",
  viz:plot((p,c)=>{const Vm=12*c.b*1e6,pm=2.2*c.pc;
    return {note:"van der Waals curves for one mole near the critical point. Drag the temperature: below T_c the curve has a wiggle (the gas can liquefy); at T_c it just flattens; above it, no wiggle.",label:"Temperature",unit:"K",min:Math.round(c.Tc*0.85),max:Math.round(c.Tc*1.2),step:1,value:Math.round(c.Tc*0.92),x:[0,Vm],y:[0,pm],xl:"V (cm³) →",yl:"p (MPa)",
      curves:s=>{const f=T=>{const a=[];for(let k=0;k<=120;k++){const V=1.25*c.b+(Vm/1e6-1.25*c.b)*k/120,pp=(C.R*T/(V-c.b)-c.a/V/V)/1e6;if(pp>=0&&pp<=pm)a.push([V*1e6,pp]);}return a;};return [{pts:f(c.Tc),cls:"soft"},{pts:f(s),cls:s<c.Tc?"main":"heat"}];},
      marks:()=>[{x:c.Vc,label:"V_c",c:"ink-2"}],read:s=>`At ${s} K: ${s<c.Tc?"below":"above"} ${TC} = ${fmt(c.Tc)} K${s<c.Tc?", can liquefy":", can't liquefy"}`};}),
  scene:{still:3.5,draw(K,t,p){const u=mod(t,8),f=K.ease(Math.min(1,u/6)),lv=110+30*f,menA=Math.max(0,1-f*1.4);
    K.rect(240,30,120,160,{fill:"card",c:"ink",w:2.5,r:8});K.rect(242,lv,116,186-lv,{fill:"blue",c:false,alpha:0.35*menA,r:6});K.rect(242,32,116,lv-32,{fill:"blue",c:false,alpha:0.12+0.2*f*(1-menA)});
    if(menA>0.02)K.line(244,lv,356,lv,{c:"blue",w:2,alpha:menA});gas(K,250,40,100,140,t,{n:14,v:40+40*f,r:3,seed:91,alpha:0.6});
    flame(K,280,214,t,0.7);flame(K,320,214,t,0.7);K.tag(menA>0.02?"liquid + gas":"one phase (above T_c)",430,110,{size:11});loopFade(K,t,8,0.6,0.3);}}
}

]);
})();
