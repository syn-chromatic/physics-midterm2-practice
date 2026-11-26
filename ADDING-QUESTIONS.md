# Adding questions

## How the files fit together

```
index.html                 loads everything below, in this order
engine.js / engine.css     the page itself: hints, answer checks, levels, formula sheet, theme
                           (the same engine as the Midterm 1 site)
physics/kit.js             shared helpers: PHYS.add, levels, constants (C), the p–V / curve plot
                           for "See it", and drawing helpers (gas molecules, cylinders, flames,
                           thermometers, engine diagrams…)
physics/topics/1-moles.js … 14-real-gas.js
                           one file per topic; each holds that topic's questions
physics/start.js           the topic order, and starts the page
```

Questions are shown grouped by topic (in the order of `TOPICS` in `start.js`), then Easy → Medium → Hard inside each topic. The filter at the top shows every question (All) or one level; each level has a colour (Easy green, Medium blue, Hard orange) that also marks its questions in the list.

Constants live in `C` (from `kit.js`): `C.g` 9.8, `C.R` 8.314, `C.k` 1.38e-23, `C.NA` 6.022e23, `C.sigma` 5.67e-8, `C.cw` 4186, `C.cice` 2200, `C.Lf` 333000, `C.Lv` 2256000, `C.rhow` 1000, `C.p0` 101300, `C.K0` 273.15. `toK(t)` turns °C into kelvin.

## Add a question to an existing topic

Open the topic's file in `physics/topics/` and add one object to the list inside `PHYS.add("Topic", [ … ])`. The easiest start is to copy a question at the same level and change it. `heat-kettle` in `2-heat.js` is a short, complete example, and its shape is shown below.

```js
{
  id:"heat-kettle",                 // unique across the whole site
  level:"Easy",                     // "Easy", "Medium" or "Hard"
  title:"Electric kettle",          // the name in the question list
  hw:"Course topic: heat and specific heat",   // small label above the question

  base:{m:1.5,t1:18,t2:100,P:2000},                         // the first numbers shown
  random:()=>({m:pick([0.5,1,1.5,2]),t1:pick([10,15,18,20]),t2:100,P:pick([1500,2000,2200])}),
  calc:p=>{const Q=p.m*C.cw*(p.t2-p.t1);return {Q,t:Q/p.P};},   // every result, worked out once

  // G("m", …) marks a number the student lists in hint 1; T("heat", …) is a tappable word
  text:(p,G,T)=>`An electric kettle heats ${G("m",`${p.m} kg`)} of water … ${T("heat","heat")} …`,
  terms:{heat:["Heat","Energy that flows because of a temperature difference."]},

  given:p=>[      // hint 1: what the student should list (k matches the G("…") keys in text)
    {k:"m",sym:MM,name:"mass of water",unit:"kg",val:p.m,why:"…",look:"…",
     gtraps:[[wrongValue,"message if they type this"]]}      // optional
  ],
  find:[{sym:QQ,name:"heat absorbed",unit:"J",why:"Part (a)."}],

  parts:[         // the answer boxes
    {id:"Q",label:"(a) Heat absorbed",sym:QQ,unit:"J",
     ans:(p,c)=>c.Q,
     traps:(p,c)=>clean([[p.m*C.cw*p.t2,"Use the change in temperature: ΔT = final − start."]],c.Q)}
  ],              // optional per part: tol (relative, default 0.02), abs, fmt, closeMsg

  idea:()=>`<p>…the physics in plain words…</p>`,           // hint 2
  formula:()=>EQ(…)+legend([[sym,"meaning","unit"],…]),     // hint 3 (also fills the formula sheet)
  plug:(p,c)=>EQ(…)+calcTip(`${p.m}*4186*${p.t2-p.t1}`),   // hint 4
  solution:(p,c)=>steps([["Title",CALC(`…`)],…])+checkline(`…`)+finalAns(`…`),  // hint 5

  sheet:[{name:"Heat",eq:`${QQ}${OP("=")}${MM}${CC}${DT}`,note:"…"}],
  takeEq:()=>`…`,  takeaway:"One line to remember.",
  link:"Where this comes up (a string, or (p,c)=>string).",

  viz:viz.slider(…),        // "See it" panel: a slider with bars, or plot(…) from kit.js for a graph
  scene:{still:2,draw(K,t,p){ … }}   // the animation: K draws, t is the time in seconds
}
```

Rules that keep things working:

- Traps are `[wrong value, message]`. Wrap the list in `clean(list, rightAnswer)` so a trap that lands on the right answer is dropped.
- The animation must not give away the answer. It shows the situation, not the result.
- Symbols (like `MM`, `QQ`) sit at the top of each topic file; add new ones there.
- Write temperatures that go into a product or a ratio in kelvin (`toK`). Only differences may stay in °C.
- The first law is written Q = ΔU + W, with W the work done **by** the gas, everywhere on the site. Keep new questions the same.
- HW 4 questions use `hw:"HW 4, task N"` and their `base` holds the homework's exact numbers.

## Add a new topic

1. Create `physics/topics/15-your-topic.js`. Copy the first 8 lines of any topic file (the imports), then:
   ```js
   PHYS.add("Your topic",[ { …question… }, { …question… } ]);
   })();
   ```
2. In `index.html`, add `<script src="physics/topics/15-your-topic.js?v=1"></script>` before `physics/start.js`.
3. In `physics/start.js`, add `"Your topic"` to `TOPICS` where it should appear in the list.

## Check your work

Open the page, then in the browser console run:

```js
HL.selfTest()
```

It tries every question with its first numbers and 60 random sets, and lists anything wrong: a missing field, a number that isn't a number, a trap equal to the right answer, a marked number with no matching `given` entry. An empty list `[]` means all good.

When you change a file, raise the `?v=1` in `index.html` (for example to `?v=2`) so browsers load the new version.
