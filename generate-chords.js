const fs = require("fs");
const path = require("path");

const CHORDS_DIR = path.join(__dirname, "Acordes");
const OUTPUT_FILE = path.join(__dirname, "Acordes.json");

const chordMap = {};

// Match: "A (1).gif", "A# (3).png", "Bm (2).jpg"
const chordRegex = /^(.+?)\s*\((\d+)\)\.(gif|png|jpg|jpeg)$/i;

fs.readdirSync(CHORDS_DIR).forEach(file => {
  const match = file.match(chordRegex);
  if (!match) return;

  const chord = match[1].trim();
  const index = parseInt(match[2], 10);

  if (!chordMap[chord]) chordMap[chord] = [];

  chordMap[chord].push({ file, index });
});

// Sort variations numerically and clean output
Object.keys(chordMap).forEach(chord => {
  chordMap[chord] = chordMap[chord]
    .sort((a, b) => a.index - b.index)
    .map(e => e.file);
});

// Write JSON
fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(chordMap, null, 2),
  "utf8"
);

console.log("✅ chords.json generated successfully");
