// Zähler für Pity
let pullsSinceRareOrLegendary = 0;
let pullsSinceLegendary = 0;

// Referenzen auf DOM-Elemente
const lastResultsEl = document.getElementById("last-results");
const sinceRLEl = document.getElementById("since-rl");
const sinceLEl = document.getElementById("since-l");
const animCircle = document.getElementById("animation-circle");
const animLabel = document.getElementById("animation-label");

const countNormalEl = document.getElementById("count-normal");
const countRareEl = document.getElementById("count-rare");
const countLegendaryEl = document.getElementById("count-legendary");

// Buttons verknüpfen
document.getElementById("pull1").addEventListener("click", () => pull(1));
document.getElementById("pull10").addEventListener("click", () => pull(10));

/**
 * Führt n Ziehungen aus und aktualisiert Anzeige & Animation.
 */
function pull(n) {
  const results = [];
  let highest = "normal";

  for (let i = 0; i < n; i++) {
    const r = drawOne();
    results.push(r);

    if (r === "legendary") {
      highest = "legendary";
    } else if (r === "rare" && highest === "normal") {
      highest = "rare";
    }
  }

  showResults(results);
  playAnimationForRarity(highest);
  updateCountersDisplay();
}

/**
 * Eine einzelne Ziehung mit:
 * - Basiswahrscheinlichkeiten
 * - Soft-Pity ab 50 Ziehungen ohne Legendary
 * - Hard-Pity: spätestens bei 70 Ziehungen Legendary
 * - Rare-Pity: spätestens alle 10 Ziehungen mindestens Rare
 */
function drawOne() {
  let result;

  // 1) Hard-Pity Legendary: spätestens bei 70 Ziehungen
  if (pullsSinceLegendary >= 69) {
    result = "legendary";
  } else {
    const inSoftPity = pullsSinceLegendary >= 50;
    const roll = Math.random();

    if (!inSoftPity) {
      // Normale Wahrscheinlichkeiten
      if (roll < 0.8) {
        result = "normal";
      } else if (roll < 0.97) {
        result = "rare";
      } else {
        result = "legendary";
      }
    } else {
      // Soft-Pity: deutlich erhöhte Legendary-Rate
      const pLegend = 0.33;
      const pNormal = 0.5526;
      const pRare = 0.1174;

      if (roll < pNormal) {
        result = "normal";
      } else if (roll < pNormal + pRare) {
        result = "rare";
      } else {
        result = "legendary";
      }
    }
  }

  // 2) Rare-Pity (10er-Garantie)
  if (result === "normal") {
    if (pullsSinceRareOrLegendary >= 9) {
      result = "rare"; // Upgrade
      pullsSinceRareOrLegendary = 0;
    } else {
      pullsSinceRareOrLegendary++;
    }
  } else {
    pullsSinceRareOrLegendary = 0;
  }

  // 3) Legendary-Zähler aktualisieren
  if (result === "legendary") {
    pullsSinceLegendary = 0;
  } else {
    pullsSinceLegendary++;
  }

  return result;
}

/**
 * Textausgabe und Kugel-Counter der Resultate.
 */
function showResults(results) {
  const germanNames = {
    normal: "Normal",
    rare: "Selten",
    legendary: "Legendär",
  };

  if (results.length === 1) {
    lastResultsEl.textContent = `Letzte Ziehung: ${
      germanNames[results[0]]
    }`;
  } else {
    const list = results.map((r) => germanNames[r]).join(", ");
    lastResultsEl.textContent = `Letzte ${results.length} Ziehungen: ${list}`;
  }

  // Counts berechnen
  let normalCount = 0;
  let rareCount = 0;
  let legendaryCount = 0;

  for (const r of results) {
    if (r === "normal") normalCount++;
    if (r === "rare") rareCount++;
    if (r === "legendary") legendaryCount++;
  }

  countNormalEl.textContent = normalCount;
  countRareEl.textContent = rareCount;
  countLegendaryEl.textContent = legendaryCount;
}

/**
 * Aktualisiert die Anzeige der Zähler unter dem Text.
 */
function updateCountersDisplay() {
  sinceRLEl.textContent = pullsSinceRareOrLegendary;
  sinceLEl.textContent = pullsSinceLegendary;
}
