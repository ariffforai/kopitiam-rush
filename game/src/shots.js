// shots.js — deterministic staged states for the screenshots. Each shot is
// a hand-built game state at the busiest, most readable moment of its
// night, driven by a fixed seed so the same URL always renders the same
// frame. Shot 1 is peak gameplay, never a menu.

import { makeOrder } from './orders.js';
import { nightConfig, bossForNight } from './nights.js';
import { RECIPE_BY_ID } from './recipes.js';

function baseState(nightNumber, seed) {
  const cfg = nightConfig(nightNumber);
  const boss = bossForNight(nightNumber);
  return {
    screen: 'playing',
    night: nightNumber,
    nightName: cfg.name,
    quota: cfg.quota,
    menuSize: cfg.menu,
    boss,
    score: 0,
    coins: 0,
    combo: 1,
    hearts: 3,
    served: 0,
    walkouts: 0,
    orders: [],
    plate: [],
    selectedOrderId: null,
    stoveLevel: 1,
    counterSlots: 1,
    upgradeHint: 'Buy upgrades between nights',
    steamSeed: seed,
    lastBonus: 0,
    won: false,
    time: 0,
  };
}

function stagedOrder(recipeId, patience, patienceMax) {
  const order = makeOrder(recipeId, patienceMax, 7);
  order.patience = patience;
  return order;
}

export function buildShotState(shotName, seed) {
  if (shotName === 'cover') {
    // Peak Night 7: final boss banquet, full board, dish mid-assembly.
    const state = baseState(7, seed);
    state.score = 48850;
    state.coins = 312;
    state.combo = 8;
    state.served = 9;
    state.stoveLevel = 3;
    state.counterSlots = 3;
    state.orders = [
      stagedOrder('nasi-lemak', 9, 32),
      stagedOrder('laksa', 14, 32),
      stagedOrder('prawn-mee', 21, 32),
      stagedOrder('ayam-percik', 27, 32),
    ];
    state.selectedOrderId = state.orders[0].id;
    state.plate = ['rice', 'egg', 'sambal'];
    return state;
  }
  if (shotName === 'orders') {
    // Night 2: the order board and the ingredient counter doing the work.
    const state = baseState(2, seed);
    state.score = 1240;
    state.coins = 58;
    state.combo = 3;
    state.served = 2;
    state.orders = [
      stagedOrder('char-kway-teow', 28, 42),
      stagedOrder('roti-canai', 19, 42),
      stagedOrder('mee-goreng', 35, 42),
    ];
    state.selectedOrderId = state.orders[0].id;
    state.plate = ['noodle'];
    return state;
  }
  if (shotName === 'serve') {
    // A finished plate, timer nearly done, SERVE glowing.
    const state = baseState(4, seed);
    state.score = 9860;
    state.coins = 145;
    state.combo = 5;
    state.served = 5;
    state.stoveLevel = 2;
    state.orders = [
      stagedOrder('curry-mee', 6, 38),
      stagedOrder('nasi-goreng', 24, 38),
    ];
    state.selectedOrderId = state.orders[0].id;
    state.plate = ['noodle', 'broth', 'chicken', 'egg'];
    return state;
  }
  if (shotName === 'boss') {
    // Night 3: the Food Critic, one perfect dish, tiny timer.
    const state = baseState(3, seed);
    state.score = 3120;
    state.coins = 84;
    state.combo = 4;
    state.served = 0;
    state.orders = [stagedOrder('nasi-lemak', 12, 30)];
    state.selectedOrderId = state.orders[0].id;
    state.plate = ['rice', 'egg'];
    return state;
  }
  // Default: a lively mid-game frame.
  const state = baseState(1, seed);
  state.orders = [stagedOrder('nasi-lemak', 30, 46)];
  state.selectedOrderId = state.orders[0].id;
  state.plate = ['rice'];
  return state;
}

export function shotNames() {
  return ['cover', 'orders', 'serve', 'boss'];
}

// The recipe the boss nights demand, for the banner text.
export function bossDishName(boss) {
  if (!boss || !boss.dish) return null;
  return RECIPE_BY_ID[boss.dish].name;
}
