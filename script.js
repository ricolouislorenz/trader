// Pity-Zähler
let pullsSinceRareOrLegendary = 0;
let pullsSinceLegendary = 0;

// DOM-Elemente
const lastResultsEl = document.getElementById("last-results");
const sinceRLEl = document.getElementById("since-rl");
const sinceLEl = document.getElementById("since-l");
const animCircle = document.getElementById("animation-circle");

const resultsOrbsSection = document.getElementById("results-orbs");
const orbListEl = document.getElementById("orb-list");

// Event-Handler für die Buttons
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
 * - Basiswahrscheinlichkeiten: 85% normal, 12% rare, 3% legendary
 * - Rare-Pity: spätestens alle 10 Ziehungen mindestens Rare
 * - Legendary-Pity: spätestens alle 70 Ziehungen Legendary
 */
function drawOne() {
  let result;

  // 1) Hard-Pity Legendary: spätestens bei 70 Ziehungen
  if (pullsSinceLegendary >= 69) {
    result = "legendary";
  } else {
    const roll = Math.random();

    // Basiswahrscheinlichkeiten ohne Soft-Pity
    if (roll < 0.85) {
      result = "normal";
    } else if (roll < 0.97) {
      result = "rare";
    } else {
      result = "legendary";
    }
  }

  // 2) Rare-Pity (10er-Garantie)
  // Wenn schon 9 Ziehungen ohne Rare/Legendary und wieder "normal":
  if (result === "normal") {
    if (pullsSinceRareOrLegendary >= 9) {
      result = "rare"; // Upgrade
      pullsSinceRareOrLegendary = 0;
    } else {
      pullsSinceRareOrLegendary++;
    }
  } else {
    // Rare oder Legendary resetten den Rare/Legendary-Zähler
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
 * Textausgabe und Mini-Orbs (nur bei 10er-Ziehung).
 */
function showResults(results) {
  const germanNames = {
    normal: "Normal",
    rare: "Selten",
    legendary: "Legendär",
  };

  // Text
  if (results.length === 1) {
    lastResultsEl.textContent = `Letzte Ziehung: ${
      germanNames[results[0]]
    }`;
  } else {
    const list = results.map((r) => germanNames[r]).join(", ");
    lastResultsEl.textContent = `Letzte ${results.length} Ziehungen: ${list}`;
  }

  // Mini-Orbs:
  // - nur anzeigen, wenn es genau 10 Ziehungen waren
  // - ansonsten Sektion ausblenden
  orbListEl.innerHTML = "";

  if (results.length === 10) {
    resultsOrbsSection.classList.add("visible");

    results.forEach((r) => {
      const orb = document.createElement("div");
      orb.classList.add("mini-orb", r);
      orbListEl.appendChild(orb);
    });
  } else {
    resultsOrbsSection.classList.remove("visible");
  }
}

/**
 * Aktualisiert die Anzeige der Zähler unter dem Text.
 */
function updateCountersDisplay() {
  sinceRLEl.textContent = pullsSinceRareOrLegendary;
  sinceLEl.textContent = pullsSinceLegendary;
}

/**
 * Spielt die Animation in zwei Phasen:
 * 1) neutraler "Ungewiss"-Look
 * 2) nach kurzer Verzögerung Farb-Reveal (blau/lila/Regenbogen)
 */
function playAnimationForRarity(rarity) {
  // 1) Neutraler Start: unbekannt
  animCircle.className = "animation-circle";
  void animCircle.offsetWidth; // Reflow-Trick

  animCircle.classList.add("unknown", "show");

  // 2) Farb-Reveal nach kurzer Verzögerung
  setTimeout(() => {
    animCircle.className = "animation-circle";
    void animCircle.offsetWidth;

    animCircle.classList.add(rarity, "show");
  }, 700);
}
