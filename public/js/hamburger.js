const hamTl = gsap.timeline({defaults:{ ease: "elastic.inOut(4, 0.5)" }});

hamTl
  .to("#ham-top", { y: 40 })
  .to("#ham-mid", { y: 20 }, "<")
  .to("#ham-top, #ham-mid, #ham-bot", {y:0}, { y:20,  fill: "#FFC9D8", rotation: -20 }, "<-25%")
  .to("#ham-mid", {y:0}, { y:20, fill: "#FFC9D8", rotation: 20 }, "<")
  .reverse();

hamTl.totalDuration(5);
console.log("total duration: ", hamTl.totalDuration());

let menuIsOpen = false;
document.getElementById("title-menu-button").addEventListener("click", () => {
  console.log("total duration: ", hamTl.totalDuration());
  menuIsOpen ? (menuIsOpen = false) : (menuIsOpen = true);
  hamTl.reversed(!hamTl.reversed());
});
