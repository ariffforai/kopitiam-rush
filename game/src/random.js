// random.js — deterministic seeded randomness for KOPITIAM RUSH.
// Every run of the game that matters (staged screenshots, the nightly
// order deck) draws from mulberry32 with a fixed seed, so the same seed
// always deals the same night. Nothing here reads the clock.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function nextRandom() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleDeck(items, rng) {
  const deck = items.slice();
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = deck[i];
    deck[i] = deck[j];
    deck[j] = tmp;
  }
  return deck;
}

export function pickFrom(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

export function rangeInt(min, max, rng) {
  return min + Math.floor(rng() * (max - min + 1));
}
