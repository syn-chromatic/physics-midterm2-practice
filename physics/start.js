/* Starts the page with every question from physics/topics/, grouped by topic in course order.
   To add a topic: create its file in physics/topics/, add a <script> line for it in index.html,
   and put its name in TOPICS below (the position sets where it appears in the list). */
(function(){
"use strict";
const TOPICS=["Moles & atoms","Heat & phase changes","Thermal expansion","Fluids","Ideal gas & kinetic theory","Maxwell speeds","Boltzmann & barometric formula","Collisions & transport","Heat transfer","Internal energy","First law & gas processes","Engines & the second law","Entropy","Real gas"];
HL.start({
  id:"physics2-practice",
  title:"Physics Midterm 2 Practice",
  levels:PHYS.LEVELS,          /* the difficulty filter at the top: Easy / Medium / Hard */
  levelAll:true,               /* …plus "All", which shows every question */
  groupByTopic:true,           /* topic headings in the question list */
  random:true,
  newAll:true,
  themeToggle:true,
  linkLabel:"Where this comes up",
  questions:PHYS.ordered(TOPICS)
});
})();
