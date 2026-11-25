// nights.js — the 7-night structure and the 3 boss nights of KOPITIAM RUSH.
// Each night is a shift: a quota of dishes to serve, a patience budget for
// the customers, and an order pace. Difficulty rises by serving more orders
// faster to less patient customers, never by adding chores.

export const NIGHTS = [
  { night: 1, name: 'First Shift',     quota: 4,  patience: 46, spawnEvery: 9.0, maxOrders: 2, menu: 4,  boss: null },
  { night: 2, name: 'Lunch Crowd',     quota: 6,  patience: 42, spawnEvery: 8.0, maxOrders: 3, menu: 6,  boss: null },
  { night: 3, name: 'The Food Critic', quota: 1,  patience: 30, spawnEvery: 99,  maxOrders: 1, menu: 8,  boss: 'critic' },
  { night: 4, name: 'Rainy Evening',   quota: 8,  patience: 38, spawnEvery: 7.0, maxOrders: 3, menu: 8,  boss: null },
  { night: 5, name: 'Festival Rush',   quota: 10, patience: 36, spawnEvery: 4.5, maxOrders: 4, menu: 10, boss: 'festival' },
  { night: 6, name: 'Supper Rush',     quota: 10, patience: 34, spawnEvery: 6.0, maxOrders: 4, menu: 12, boss: null },
  { night: 7, name: 'The Midnight Feast', quota: 12, patience: 32, spawnEvery: 5.0, maxOrders: 4, menu: 12, boss: 'feast' },
];

export const BOSSES = {
  critic: {
    id: 'critic',
    title: 'BOSS — THE FOOD CRITIC',
    name: 'Mak Cik Siti, food critic',
    rule: 'One perfect dish. No mistakes.',
    dish: 'nasi-lemak',
    patience: 30,
  },
  festival: {
    id: 'festival',
    title: 'BOSS — FESTIVAL RUSH',
    name: 'The night-market festival crowd',
    rule: 'Double orders, double pace.',
    dish: null,
    patience: 36,
  },
  feast: {
    id: 'feast',
    title: 'FINAL BOSS — THE MIDNIGHT FEAST',
    name: 'The Midnight Feast banquet',
    rule: 'A 5-dish banquet against the clock.',
    dish: null,
    patience: 32,
    banquet: ['nasi-lemak', 'char-kway-teow', 'laksa', 'prawn-mee', 'ayam-percik'],
  },
};

export function nightConfig(nightNumber) {
  return NIGHTS[Math.min(Math.max(nightNumber, 1), NIGHTS.length) - 1];
}

export function bossForNight(nightNumber) {
  const cfg = nightConfig(nightNumber);
  return cfg.boss ? BOSSES[cfg.boss] : null;
}

// Coins the night pays out on top of dish prices, scaled by night.
export function nightBonus(nightNumber) {
  return 10 + nightNumber * 5;
}
