// main.js — KOPITIAM RUSH: the game loop, the night state machine, and the
// assemble-and-serve core verb. Orders arrive on the board; the player
// picks an order, taps ingredients in recipe order to build the dish on
// the plate, and serves before the patience timer runs out.

import { INGREDIENTS, RECIPES, RECIPE_BY_ID, nextStepFor, plateIsComplete } from './recipes.js';
import { makeOrder, tickOrders, servePayout, removeServedOrders } from './orders.js';
import { nightConfig, bossForNight, nightBonus } from './nights.js';
import { mulberry32, shuffleDeck, rangeInt } from './random.js';
import { drawScene, VIEW_W, VIEW_H } from './render.js';
import { installInput, hitRect } from './input.js';
import { ensureAudio, playAddIngredient, playWrongIngredient, playServeDish, playCustomerWalkout, playNightClear, playBossAlarm, toggleMute } from './audio.js';
import { buildShotState } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function freshState() {
  return {
    screen: 'start',
    night: 1,
    nightName: 'First Shift',
    quota: 4,
    menuSize: 4,
    boss: null,
    score: 0,
    coins: 0,
    combo: 1,
    bestCombo: 1,
    hearts: 3,
    served: 0,
    walkouts: 0,
    orders: [],
    plate: [],
    selectedOrderId: null,
    stoveLevel: 1,
    counterSlots: 1,
    upgradeHint: 'Buy upgrades between nights',
    steamSeed: 7,
    lastBonus: 0,
    won: false,
    time: 0,
    spawnTimer: 4,
    deck: [],
    rng: mulberry32(20261125),
  };
}

let state = freshState();
let staged = null;

function startNight(nightNumber) {
  const cfg = nightConfig(nightNumber);
  state.night = nightNumber;
  state.nightName = cfg.name;
  state.quota = cfg.quota;
  state.menuSize = cfg.menu;
  state.boss = bossForNight(nightNumber);
  state.served = 0;
  state.walkouts = 0;
  state.orders = [];
  state.plate = [];
  state.selectedOrderId = null;
  state.spawnTimer = 2.5;
  state.screen = 'playing';
  const menuIds = RECIPES.slice(0, cfg.menu).map((r) => r.id);
  state.deck = shuffleDeck(menuIds.concat(menuIds), state.rng);
  if (state.boss && state.boss.id === 'critic') {
    state.deck = ['nasi-lemak'];
    playBossAlarm();
  }
  if (state.boss && state.boss.id === 'feast') {
    state.deck = shuffleDeck(state.boss.banquet.slice(), state.rng);
  }
  spawnOrder();
}

function spawnOrder() {
  const cfg = nightConfig(state.night);
  if (state.orders.length >= Math.min(cfg.maxOrders, state.counterSlots + 2)) return;
  if (state.deck.length === 0) {
    const menuIds = RECIPES.slice(0, cfg.menu).map((r) => r.id);
    state.deck = shuffleDeck(menuIds, state.rng);
  }
  const recipeId = state.deck.pop();
  const patience = state.boss && state.boss.id === 'critic' ? 30 : cfg.patience;
  const order = makeOrder(recipeId, patience, rangeInt(1, 999, state.rng));
  state.orders.push(order);
  if (!state.selectedOrderId) {
    state.selectedOrderId = order.id;
    state.plate = [];
  }
}

function selectedOrder() {
  return state.orders.find((o) => o.id === state.selectedOrderId) || null;
}

function addIngredient(index) {
  if (state.screen !== 'playing') return;
  const order = selectedOrder();
  if (!order) return;
  const ing = INGREDIENTS[index];
  if (!ing) return;
  ensureAudio();
  const expected = nextStepFor(order.recipe, state.plate);
  if (ing.id === expected) {
    state.plate.push(ing.id);
    playAddIngredient();
  } else {
    // Wrong ingredient: combo breaks, plate stays as it was.
    state.combo = 1;
    playWrongIngredient();
    if (state.boss && state.boss.id === 'critic') {
      endGame(false, 'The critic saw the wrong ingredient.');
    }
  }
}

function serveDish() {
  if (state.screen !== 'playing') return;
  const order = selectedOrder();
  if (!order) return;
  if (!plateIsComplete(order.recipe, state.plate)) return;
  const payout = servePayout(order, state.combo);
  state.coins += payout;
  state.score += payout * 10;
  state.combo = Math.min(state.combo + 1, 9);
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  state.served += 1;
  order.served = true;
  playServeDish();
  state.plate = [];
  state.orders = removeServedOrders(state.orders);
  state.selectedOrderId = state.orders.length ? state.orders[0].id : null;
  if (state.served >= state.quota) {
    nightCleared();
  } else if (state.orders.length === 0) {
    spawnOrder();
  }
}

function trashPlate() {
  if (state.screen !== 'playing') return;
  state.plate = [];
  state.combo = 1;
}

function nightCleared() {
  const bonus = nightBonus(state.night);
  state.lastBonus = bonus;
  state.coins += bonus;
  state.score += bonus * 10;
  playNightClear();
  if (state.night >= 7) {
    endGame(true, '');
    return;
  }
  state.screen = 'nightClear';
}

function endGame(won, reason) {
  state.won = won;
  state.screen = 'over';
  state.endReason = reason || '';
}

function buyUpgrade(kind) {
  if (kind === 'stove' && state.coins >= 40) {
    state.coins -= 40;
    state.stoveLevel += 1;
    state.upgradeHint = 'Stove Lv' + state.stoveLevel + ' — dishes cook faster';
  } else if (kind === 'slot' && state.coins >= 50) {
    state.coins -= 50;
    state.counterSlots += 1;
    state.upgradeHint = 'Counter slots ' + state.counterSlots + ' — more orders at once';
  } else if (kind === 'calm' && state.coins >= 35) {
    state.coins -= 35;
    state.upgradeHint = 'Calm customers — patience +8s next night';
    state.calmBonus = 8;
  }
}

function update(dt) {
  if (state.screen !== 'playing') return;
  state.time += dt;
  const walkedOut = tickOrders(state.orders, dt);
  for (const order of walkedOut) {
    state.walkouts += 1;
    state.hearts -= 1;
    state.combo = 1;
    playCustomerWalkout();
    if (state.selectedOrderId === order.id) {
      state.selectedOrderId = null;
      state.plate = [];
    }
  }
  state.orders = removeServedOrders(state.orders);
  if (!state.selectedOrderId && state.orders.length) {
    state.selectedOrderId = state.orders[0].id;
  }
  if (state.hearts <= 0 || state.walkouts >= 3) {
    endGame(false, 'Too many customers walked out.');
    return;
  }
  const cfg = nightConfig(state.night);
  if (!state.boss || state.boss.id === 'festival') {
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnOrder();
      state.spawnTimer = cfg.spawnEvery;
    }
  }
  if (state.boss && state.boss.id === 'feast' && state.orders.length === 0 && state.served < state.quota) {
    spawnOrder();
  }
}

function orderCardRect(index) {
  const oh = state.orders.length > 3 ? 96 : 116;
  const top = (state.boss ? 116 : 72) + 62 + index * (oh + 10);
  return { x: 28, y: top, w: 260, h: oh };
}

function ingredientRect(index) {
  return { x: 16 + index * 126, y: 694, w: 118, h: 82 };
}

function serveRect() {
  return { x: 1064, y: 694, w: 200, h: 82 };
}

function handleClick(x, y) {
  ensureAudio();
  if (state.screen === 'start') {
    if (hitRect(x, y, { x: 490, y: 470, w: 300, h: 64 })) startNight(1);
    return;
  }
  if (state.screen === 'nightClear') {
    startNight(state.night + 1);
    return;
  }
  if (state.screen === 'over') {
    state = freshState();
    return;
  }
  // Order board: click a card to cook it.
  for (let i = 0; i < state.orders.length; i++) {
    if (hitRect(x, y, orderCardRect(i))) {
      state.selectedOrderId = state.orders[i].id;
      state.plate = [];
      return;
    }
  }
  // Ingredient counter.
  for (let i = 0; i < INGREDIENTS.length; i++) {
    if (hitRect(x, y, ingredientRect(i))) {
      addIngredient(i);
      return;
    }
  }
  if (hitRect(x, y, serveRect())) serveDish();
}

installInput(canvas, {
  onClick: (x, y) => handleClick(x, y),
  onHover: () => {},
  onIngredientKey: (i) => addIngredient(i),
  onServeKey: () => serveDish(),
  onTrashKey: () => trashPlate(),
  onMuteKey: () => toggleMute(),
  onConfirmKey: () => {
    if (state.screen === 'start') startNight(1);
    else if (state.screen === 'nightClear') startNight(state.night + 1);
    else if (state.screen === 'over') state = freshState();
  },
});

function resizeCanvas() {
  const scale = Math.min(window.innerWidth / VIEW_W, window.innerHeight / VIEW_H);
  canvas.style.width = Math.floor(VIEW_W * scale) + 'px';
  canvas.style.height = Math.floor(VIEW_H * scale) + 'px';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Staged screenshot states: ?shot=cover&seed=7 renders a fixed frame.
const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const shotSeed = Number(params.get('seed') || '7');
if (shotName) {
  staged = buildShotState(shotName, shotSeed);
  staged.time = 1.5;
}

let lastTime = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  if (staged) {
    drawScene(ctx, staged, staged.time);
  } else {
    update(dt);
    drawScene(ctx, state, state.time);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
