const CHORD_PATH = "./Acordes/";
const chordIndex = window.chordIndex;
//let chordIndex = {};

if (!chordIndex) {
  alert("CHORD_INDEX not loaded!");
}

const preview = document.getElementById("chord-preview");
const image = document.getElementById("chord-image");
const dots = document.getElementById("dots");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let images = [];
let index = 0;

/* Load chord index 
fetch("/acordes.json")
  .then(res => res.json())
  .then(data => chordIndex = data); 
*/

/* Expand multi-chord spans for Spaces */
document.querySelectorAll(".chord").forEach(span => {
  const text = span.textContent;

  // Split into chords + spaces
  const parts = text.match(/([^\s|]+|\s+|\|)/g);
  if (!parts) return;

  const wrapper = document.createElement("span");
  wrapper.className = "chord-group";

  parts.forEach(part => {
    if (part.trim() === "") {
      // preserve spacing
      const space = document.createElement("span");
      space.className = "chord-space";
      space.textContent = part;
      wrapper.appendChild(space);
    } else {
      // chord token
      const chord = document.createElement("span");
      chord.className = "chord-item";
      chord.textContent = part;
      wrapper.appendChild(chord);
    }
  });

  span.replaceWith(wrapper);
});

/* Preload */
function preload(imgs) {
  imgs.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

function render() {
  image.src = images[index];
  [...dots.children].forEach((d, i) =>
    d.classList.toggle("active", i === index)
  );
}

function createDots() {
  dots.innerHTML = "";
  images.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", e => {
      e.preventDefault();
      index = i;
      render();
    });
    dots.appendChild(dot);
  });
}

/* Lyrics chords */
document.querySelectorAll(".chord-item").forEach(el => {
  el.addEventListener("mouseenter", () => {
    const chord = el.textContent.trim();

    if (!chordIndex[chord]) {
      console.warn("Chord not found:", chord);
      return;
    }

    images = chordIndex[chord].map(f => CHORD_PATH + encodeURIComponent(f));
    index = 0;

    preload(images);
    createDots();
    render();

    const r = el.getBoundingClientRect();
    preview.style.left = r.right + 10 + "px";
    preview.style.top = r.top + window.scrollY + "px";
    preview.style.display = "block";
  });
});

preview.addEventListener("mouseleave", () => {
  preview.style.display = "none";
});

/* Navigation */
prevBtn.addEventListener("click", e => {
  e.preventDefault();
  index = (index - 1 + images.length) % images.length;
  render();
});

nextBtn.addEventListener("click", e => {
  e.preventDefault();
  index = (index + 1) % images.length;
  render();
});
