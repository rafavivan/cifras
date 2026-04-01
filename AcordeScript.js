/* ===============================
   CONFIG
================================ */

const CHORD_PATH = "../Acordes/";
const chordIndex = window.chordIndex;
const PREVIEW_ID = "chord-preview";

/* ===============================
   DEVICE DETECTION
================================ */

const isTouch =
  "ontouchstart" in window || navigator.maxTouchPoints > 0;

if (!window.chordIndex) {
  console.error("chordIndex not LOADED");
}

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

/* ===============================
   PREVIEW ELEMENT
================================ */

let preview = document.getElementById(PREVIEW_ID);

if (!preview) {
  preview = document.createElement("div");
  preview.id = PREVIEW_ID;
  preview.innerHTML = `
    <button class="prev" type="button"><</button>
    <img />
    <button class="next" type="button">></button>
    <div class="dots"></div>
    <button class="close" type="button">✕</button>
  `;
  document.body.appendChild(preview);
}

const img = preview.querySelector("img");
const prevBtn = preview.querySelector(".prev");
const nextBtn = preview.querySelector(".next");
const closeBtn = preview.querySelector(".close");
const dotsContainer = preview.querySelector(".dots");

/* ===============================
   STATE
================================ */

let images = [];
let index = 0;

/* ===============================
   HELPERS
================================ */

function preload(list) {
  list.forEach(src => {
    const i = new Image();
    i.src = src;
  });
}

function render() {
  img.src = images[index];
  [...dotsContainer.children].forEach((d, i) =>
    d.classList.toggle("active", i === index)
  );
}

function createDots() {
  dotsContainer.innerHTML = "";
  images.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      index = i;
      render();
    });
    dotsContainer.appendChild(dot);
  });
}

function showPrev() {
  index = (index - 1 + images.length) % images.length;
  render();
}

function showNext() {
  index = (index + 1) % images.length;
  render();
}

/* ===============================
   OPEN CHORD
================================ */

function openChord(el) {
  const chord = el.textContent.trim();

  if (!window.chordIndex[chord]) {
    console.warn("Chord not found:", chord);
    return;
  }

  images = window.chordIndex[chord].map(f =>
    CHORD_PATH + encodeURIComponent(f)
  );

  index = 0;
  preload(images);
  createDots();
  render();

  if (isTouch) {
    // Mobile: centered popup
    preview.style.position = "fixed";
    preview.style.left = "50%";
    preview.style.top = "50%";
    preview.style.transform = "translate(-50%, -50%)";
  } else {
    // Desktop: near chord
    const r = el.getBoundingClientRect();
    preview.style.position = "absolute";
    preview.style.left = r.right + 10 + "px";
    preview.style.top = r.top + window.scrollY + "px";
    preview.style.transform = "none";
  }

  preview.style.display = "block";
}

function closeChord() {
  preview.style.display = "none";
}

/* ===============================
   EVENTS
================================ */

/* Desktop hover */
if (!isTouch) {
  document.addEventListener("mouseover", e => {
    const chord = e.target.closest(".chord-item");
    if (chord) openChord(chord);
  });

  preview.addEventListener("mouseleave", closeChord);
}

/* Mobile + desktop click */
document.addEventListener("click", e => {
  const chord = e.target.closest(".chord-item");
  if (!chord) return;
  e.preventDefault();
  e.stopPropagation();
  openChord(chord);
});

/* Close on tap outside (mobile) */
document.addEventListener("click", e => {
  if (e.target.closest(".chord")) {;
    e.preventDefault(); }
  if (!isTouch) return;
  if (e.target.closest(".chord-item")) return;
  if (e.target.closest(`#${PREVIEW_ID}`)) return;

  closeChord();
});

/* Buttons */
prevBtn.addEventListener("click", e => {
  e.preventDefault();
  e.stopPropagation();
  showPrev();
});

nextBtn.addEventListener("click", e => {
  e.preventDefault();
  e.stopPropagation();
  showNext();
});

closeBtn.addEventListener("click", e => {
  e.preventDefault();
  e.stopPropagation();
  closeChord();
});

/* ===============================
   SWIPE SUPPORT (MOBILE)
================================ */

let startX = 0;

preview.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

preview.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) < 40) return;

  dx > 0 ? showPrev() : showNext();
});

/* =========================
   CONTROL PANEL COMPONENT
========================= */
(function () {
    function initControlPanel() {
      /* Prevent duplicate */
      if (document.getElementById("controlPanel")) return;

      /* CREATE PANEL */
      const panel = document.createElement("div");
      panel.id = "controlPanel";
      panel.innerHTML = `
        <button id="zoomOut">−</button>
        <button id="zoomIn">+</button>
        <div class="divider"></div>
        <button id="goPrev">←</button>
        <button id="goNext">→</button>
      `;
      document.body.appendChild(panel);

      /* =========================
          ZOOM
      ========================= */
      let currentZoom = 18;
      const minZoom = 10;
      const maxZoom = 40;

      function applyZoom() {
        document.querySelectorAll(".lyrics").forEach(el => {
            el.style.fontSize = currentZoom + "px";
        });
        localStorage.setItem("lyricsZoom", currentZoom);
      }

      panel.querySelector("#zoomIn").onclick = () => {
        if (currentZoom < maxZoom) {
          currentZoom += 2;
          applyZoom();
        }
      };

      panel.querySelector("#zoomOut").onclick = () => {
        if (currentZoom > minZoom) {
          currentZoom -= 2;
          applyZoom();
        }
      };

      /* =========================
          NAVIGATION
      ========================= */
      const sections = Array.from(document.querySelectorAll("section.song"));
      const anchors = sections.map(s => s.id);
      let currentIndex = 0;

      function detectCurrentSong() {
        let scrollPosition = window.scrollY + window.innerHeight / 3;

        for (let i = anchors.length - 1; i >= 0; i--) {
          const el = document.getElementById(anchors[i]);
          if (el && el.offsetTop <= scrollPosition) {
            currentIndex = i;
            break;
          }
        }
      }

      function goNext() {
        detectCurrentSong();
        if (currentIndex < anchors.length - 1) {
          window.location.hash = anchors[currentIndex + 1];
        }
      }

      function goPrev() {
        detectCurrentSong();
        if (currentIndex > 0) {
          window.location.hash = anchors[currentIndex - 1];
        }
      }

      panel.querySelector("#goNext").onclick = goNext;
      panel.querySelector("#goPrev").onclick = goPrev;

      window.addEventListener("scroll", detectCurrentSong);

      /* =========================
          AUTO HIDE
      ========================= */
      let hideTimer;
      const HIDE_DELAY = 2000;

      function showPanel() {
        panel.classList.remove("hidden");

        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          panel.classList.add("hidden");
        }, HIDE_DELAY);
      }

      ["scroll", "touchstart", "click"].forEach(event => {
        document.addEventListener(event, showPanel, { passive: true });
      });

      panel.addEventListener("click", e => {
        e.stopPropagation();
        showPanel();
      });

      showPanel();
  }

  /* Run after DOM is ready */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initControlPanel);
  } else {
    initControlPanel();
  }

}
)();