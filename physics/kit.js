/* Shared tools for the physics questions.
   Each file in physics/topics/ adds its questions with PHYS.add("Topic", [ ...questions ]).
   physics/start.js then starts the page with every question, in course order.
   See ADDING-QUESTIONS.md for how to add a question or a topic. */
window.PHYS=(function(){
"use strict";
const {fmt,mi,sb,viz}=HL;

/* ---------- constants (the values the questions tell students to use) ---------- */
const C={g:9.8,R:8.314,k:1.38e-23,NA:6.022e23,sigma:5.67e-8,cw:4186,cice:2200,Lf:333000,Lv:2256000,rhow:1000,p0:101300,K0:273.15};

/* ---------- small helpers for writing questions ---------- */
const R3=n=>Math.round(n*1000)/1000;
/* round to 3 significant figures (for numbers that are shown in a question and then used) */
const S3=n=>Number(Number(n).toPrecision(3));
/* Mistake checks ("traps") are [wrong value, message]. clean() drops traps that are too close to the right answer to ever fire. */
const clean=(list,ans)=>list.filter(t=>t&&Number.isFinite(t[0])&&Math.abs(t[0]-ans)>0.03*Math.abs(ans)+1e-30);
/* a number in brackets when it's negative: (−3) */
const pr=x=>x<0?`(${fmt(x)})`:fmt(x);
/* "6.02 × 10²³" written the way you type it into the answer box: 6.02e23 */
const typ=x=>{if(x===0)return "0";const ax=Math.abs(x);if(ax>=1e6||ax<1e-3){const e=Math.floor(Math.log10(ax));let m=Number((x/Math.pow(10,e)).toPrecision(4));return `${m}e${e}`;}return String(Number(x.toPrecision(5)));};
/* °C → K */
const toK=c=>c+273.15;

/* ---------- a graph for "See it": a slider moves a point, or reshapes the curves ----------
   o(p,c) returns {note,label,unit,min,max,step,value, x:[x0,x1], y:[y0,y1], xl, yl,
                   curves:s=>[{pts:[[x,y],...], cls:"main"|"soft"|"heat", fill:bool}], point:s=>[x,y]|null,
                   marks:s=>[{x,label}], read:s=>html} */
function plot(o){
  const W=420,H=230,L=48,Rm=14,T=14,B=36;
  return {
    html:(p,c)=>{const q=o(p,c);
      return `${q.note?`<p class="sec-note">${q.note}</p>`:""}<div class="viz-box">
        ${q.label?`<label class="viz-l" for="pl-s">${q.label}: <output id="pl-so">${fmt(q.value)}</output> ${q.unit||""}</label>
        <input type="range" id="pl-s" min="${q.min}" max="${q.max}" step="${q.step}" value="${q.value}">`:""}
        <svg class="vsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${q.yl} against ${q.xl}">
          <line x1="${L}" y1="${H-B}" x2="${W-Rm}" y2="${H-B}" style="stroke:var(--ink-2);stroke-width:1.2"/><line x1="${L}" y1="${T}" x2="${L}" y2="${H-B}" style="stroke:var(--ink-2);stroke-width:1.2"/>
          <text class="v-text" x="${W-Rm}" y="${H-10}" text-anchor="end">${q.xl}</text><text class="v-text" x="${L-6}" y="${T+4}" text-anchor="end">${q.yl.split(" ")[0]}</text>
          <g id="pl-c"></g><g id="pl-m"></g><circle id="pl-p" r="6" style="fill:var(--heat);stroke:var(--card);stroke-width:2;display:none"/>
        </svg><p class="viz-read" id="pl-r"></p></div>`;},
    setup:(p,c,ctx)=>{const q=o(p,c),r=ctx.$("#pl-s");
      const X=x=>L+(W-L-Rm)*(x-q.x[0])/(q.x[1]-q.x[0]),Y=y=>H-B-(H-B-T)*(y-q.y[0])/(q.y[1]-q.y[0]);
      const upd=()=>{const s=r?+r.value:q.value;if(r)ctx.$("#pl-so").textContent=fmt(s);
        ctx.$("#pl-c").innerHTML=(q.curves(s)||[]).map(cv=>{const d=cv.pts.map((pt,i)=>`${i?"L":"M"}${X(pt[0]).toFixed(1)},${Y(pt[1]).toFixed(1)}`).join(" ")+(cv.close?" Z":"");
          const st=cv.cls==="heat"?"stroke:var(--heat)":cv.cls==="soft"?"stroke:var(--ink-2);stroke-dasharray:4 4":"stroke:var(--blue)";
          return `<path d="${d}" style="fill:${cv.fill?"var(--blue-soft)":"none"};${st};stroke-width:${cv.cls==="soft"?1.4:2.4};stroke-linejoin:round"/>`;}).join("");
        ctx.$("#pl-m").innerHTML=(q.marks?q.marks(s):[]).map(m=>`<line x1="${X(m.x)}" y1="${T}" x2="${X(m.x)}" y2="${H-B}" style="stroke:var(--${m.c||"ink-2"});stroke-width:1.2;stroke-dasharray:3 4"/><text class="v-text" x="${X(m.x)+4}" y="${T+12+(m.row||0)*14}">${m.label}</text>`).join("");
        const pt=q.point?q.point(s):null,dot=ctx.$("#pl-p");if(pt){dot.style.display="";dot.setAttribute("cx",X(pt[0]));dot.setAttribute("cy",Y(pt[1]));}else dot.style.display="none";
        ctx.$("#pl-r").innerHTML=q.read?q.read(s):"";};
      if(r)r.addEventListener("input",upd);upd();}
  };
}

/* ---------- drawing helpers for the question animations ---------- */
const F=x=>fmt(x);
const mod=(a,b)=>((a%b)+b)%b;
const fadeIn=(u,a,b)=>Math.max(0,Math.min(1,(u-a)/(b-a)));
/* 0 → 1 → 0 → 1 … : bouncing back and forth between two walls */
const tri=u=>{const v=mod(u,2);return v<1?v:2-v;};
/* a fixed pseudo-random number in [0,1) for molecule i (same every frame) */
const rnd=(i,s)=>{const x=Math.sin(i*127.1+(s||0)*311.7)*43758.5453;return x-Math.floor(x);};
/* molecules bouncing inside a box: o.n molecules, o.v speed (px/s), o.r radius, o.c colour, o.seed */
function gas(K,x,y,w,h,t,o={}){const n=o.n||24,r=o.r||4,v=o.v||60,c=o.c||"blue";
  for(let i=0;i<n;i++){const a=rnd(i,o.seed)*2*Math.PI,sp=v*(0.55+0.9*rnd(i+50,o.seed)),W=w-2*r,H=h-2*r;
    const px=x+r+W*tri(rnd(i+100,o.seed)*2+sp*Math.cos(a)*t/W),py=y+r+H*tri(rnd(i+200,o.seed)*2+sp*Math.sin(a)*t/H);
    K.circle(px,py,r,{fill:i===o.mark?"heat":c,c:false,alpha:o.alpha!=null?o.alpha:0.85});}}
/* a closed box (gas container) */
function box(K,x,y,w,h,o={}){K.rect(x,y,w,h,{fill:o.fill||"card",c:o.c||"ink",w:o.w||2.2,r:o.r||4});}
/* a cylinder with a piston at height `top` (y of the piston's underside); returns nothing */
function cylinder(K,x,y,w,h,top,o={}){K.rect(x,top,w,y+h-top,{fill:o.fill||"blueSoft",c:false});
  K.line(x,y,x,y+h,{w:2.6});K.line(x+w,y,x+w,y+h,{w:2.6});K.line(x,y+h,x+w,y+h,{w:2.6});
  K.rect(x+2,top-14,w-4,14,{fill:"ink2",c:"ink",w:1.4,r:2});K.line(x+w/2,top-14,x+w/2,y-18,{w:4,c:"ink2"});}
/* a flickering flame centred at (x, y) = its base */
function flame(K,x,y,t,s=1){const f=1+0.12*Math.sin(t*13)+0.08*Math.sin(t*21+1);
  K.poly([[x-12*s,y],[x-9*s,y-14*s*f],[x-3*s,y-22*s*f],[x,y-32*s*f],[x+4*s,y-21*s*f],[x+10*s,y-12*s*f],[x+12*s,y]],{fill:"heat",c:false,close:true,alpha:0.9});
  K.poly([[x-5*s,y],[x-3*s,y-9*s*f],[x,y-16*s*f],[x+3*s,y-9*s*f],[x+5*s,y]],{fill:"marker",c:false,close:true});}
/* a thermometer: bulb at the bottom (x, y), height h, filled to frac (0..1) */
function thermo(K,x,y,h,frac,o={}){const c=o.c||"bad";K.rect(x-5,y-h,10,h,{fill:"card",c:"ink",w:1.4,r:5});
  K.rect(x-2.5,y-6-(h-10)*K.clamp(frac,0,1),5,(h-10)*K.clamp(frac,0,1)+6,{fill:c,c:false});K.circle(x,y+4,8,{fill:c,c:"ink",w:1.4});
  if(o.label)K.tag(o.label,x+14,y-h+8,{align:"left",size:11});}
/* an open container with liquid up to `level` (0..1 of its height) */
function beaker(K,x,y,w,h,level,o={}){const ly=y+h-h*level;K.rect(x,ly,w,y+h-ly,{fill:o.liquid||"blueSoft",c:false});
  if(o.wave){const pts=[];for(let i=0;i<=20;i++)pts.push([x+w*i/20,ly+Math.sin(i*0.9+o.wave*3)*1.5]);K.poly(pts,{c:"blue",w:1.4});}
  K.line(x,y,x,y+h,{w:2.4});K.line(x+w,y,x+w,y+h,{w:2.4});K.line(x,y+h,x+w,y+h,{w:2.4});}
/* an ice cube */
function ice(K,x,y,s,o={}){K.rect(x-s/2,y-s/2,s,s,{fill:"card",c:"blue",w:1.6,r:s*0.18,alpha:o.alpha!=null?o.alpha:1});
  K.line(x-s*0.25,y-s*0.28,x+s*0.1,y-s*0.28,{c:"blue",w:1.2,alpha:(o.alpha!=null?o.alpha:1)*0.6});}
/* a wavy heat arrow from (x1,y1) to (x2,y2), drifting with time */
function heatArrow(K,x1,y1,x2,y2,t,o={}){const c=o.c||"heat",L=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/L,uy=(y2-y1)/L,nx=-uy,ny=ux,pts=[];
  for(let i=0;i<=24;i++){const d=L*i/24-8*(i/24),a=Math.sin(i*0.8-t*6)*(o.amp||4);pts.push([x1+ux*d+nx*a,y1+uy*d+ny*a]);}
  K.poly(pts,{c,w:o.w||2.2,alpha:o.alpha});K.arrow(x2-ux*14,y2-uy*14,x2,y2,{c,head:9,alpha:o.alpha});if(o.label)K.tag(o.label,(x1+x2)/2+nx*16,(y1+y2)/2+ny*16,{size:11,c});}
/* a hot or cold reservoir block */
function reservoir(K,x,y,w,h,label,hot){K.rect(x,y,w,h,{fill:hot?"heat":"blueSoft",c:"ink",w:1.6,r:6,alpha:hot?0.22:1});K.rect(x,y,w,h,{c:"ink",w:1.6,r:6});K.text(label,x+w/2,y+h/2,{size:12,bold:true});}
/* dots flowing along a straight path (energy moving), n dots */
function flow(K,x1,y1,x2,y2,t,o={}){const n=o.n||4;for(let i=0;i<n;i++){const u=mod(t*(o.speed||0.6)+i/n,1);K.circle(x1+(x2-x1)*u,y1+(y2-y1)*u,o.r||3.5,{fill:o.c||"heat",c:false,alpha:Math.sin(Math.PI*u)});}}
/* a heat engine (or a refrigerator, with o.fridge): hot block on top, cold below, machine in the middle */
function engineDiagram(K,t,o={}){const cx=o.cx||300,top=16,bot=166;
  reservoir(K,cx-110,top,220,40,o.hotLabel||"Hot",true);reservoir(K,cx-110,bot,220,40,o.coldLabel||"Cold",false);
  const sp=o.fridge?-1:1,a=K.mod(t*0.9,2*Math.PI);
  K.circle(cx,111,26,{fill:"card",c:"ink",w:2});for(let i=0;i<4;i++){const b=a*sp+i*Math.PI/2;K.line(cx,111,cx+18*Math.cos(b),111+18*Math.sin(b),{c:"ink2",w:1.6});}
  if(!o.fridge){flow(K,cx,58,cx,84,t,{c:"heat"});K.arrow(cx,58,cx,84,{c:"heat",w:2});flow(K,cx,138,cx,164,t,{c:"blue"});K.arrow(cx,138,cx,164,{c:"blue",w:2});
    flow(K,cx+28,111,cx+120,111,t,{c:"ok"});K.arrow(cx+28,111,cx+120,111,{c:"ok",w:2.4});}
  else{flow(K,cx,164,cx,138,t,{c:"blue"});K.arrow(cx,164,cx,138,{c:"blue",w:2});flow(K,cx,84,cx,58,t,{c:"heat"});K.arrow(cx,84,cx,58,{c:"heat",w:2});
    flow(K,cx+120,111,cx+28,111,t,{c:"ok"});K.arrow(cx+120,111,cx+28,111,{c:"ok",w:2.4});}
  (o.tags||[]).forEach(g=>K.tag(g[0],g[1],g[2],{size:11,c:g[3]}));}
/* hides a loop's restart: the picture fades out over the last `out` seconds of each loop and back in over the first `inn` */
function loopFade(K,t,period,out=0.5,inn=0.3){const u=mod(t,period),a=u<inn?1-u/inn:u>period-out?(u-(period-out))/out:0;if(a>0)K.rect(0,0,K.W||600,K.H||220,{fill:"bg",c:false,alpha:Math.min(1,a)});}
function block(K,x,y,w,h,label,o={}){K.rect(x-w/2,y-h,w,h,{fill:o.fill||"marker",c:"ink",w:1.6,r:3});if(label)K.text(label,x,y-h/2,{size:o.size||12,bold:true,c:"#14244a"});}

/* ---------- the question list ---------- */
const LEVELS=["Easy","Medium","Hard"],registry=[];
function add(topic,list){
  list.forEach(q=>{
    q.topic=q.topic||topic;
    if(!LEVELS.includes(q.level))throw new Error(`${q.id}: level must be one of ${LEVELS.join(", ")}`);
    if(registry.some(r=>r.id===q.id))throw new Error(`two questions have the id "${q.id}"`);
    registry.push(q);
  });
}
/* every question, sorted by topic (in the order given), then Easy → Medium → Hard, then the order they were added */
const ordered=topics=>registry.map((q,i)=>({q,i})).sort((a,b)=>(topics.indexOf(a.q.topic)-topics.indexOf(b.q.topic))||(LEVELS.indexOf(a.q.level)-LEVELS.indexOf(b.q.level))||(a.i-b.i)).map(x=>x.q);

return {add,ordered,LEVELS,C,R3,S3,clean,pr,typ,toK,plot,
  draw:{F,mod,fadeIn,tri,rnd,gas,box,cylinder,flame,thermo,beaker,ice,heatArrow,reservoir,flow,engineDiagram,loopFade,block}};
})();
