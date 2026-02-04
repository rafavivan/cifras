const preview = document.getElementById("chord-preview");
const image = document.getElementById("targetimage");

document.querySelectorAll(".chord").forEach(chord => {

  chord.addEventListener("mouseenter", e => {
    image.src = chord.dataset.img;
    preview.style.display = "visible";
  });

  chord.addEventListener("mousemove", e => {
    preview.style.left = e.pageX + 15 + "px";
    preview.style.top = e.pageY + 15 + "px";
  });

  chord.addEventListener("mouseleave", () => {
    preview.style.display = "none";
    image.src = "";
  });

});
