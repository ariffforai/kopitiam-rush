// render.js — every pixel of KOPITIAM RUSH is drawn here in code: the
// kopitiam wall, hanging lamps, wooden counter, order board, plates and
// food. No image assets, no fonts fetched: canvas primitives only.

import { INGREDIENTS, INGREDIENT_BY_ID, RECIPES, nextStepFor } from './recipes.js';
import { patienceFraction, patienceColor } from './orders.js';

export const VIEW_W = 1280;
export const VIEW_H = 800;

const WOOD = '#7a4a21';
const WOOD_DARK = '#5d3413';
const TILE = '#f3e3c2';
const TILE_LINE = '#d9c49a';
const CREAM = '#fff8e7';
const INK = '#2b1a0e';
const RED = '#c0392b';
const GOLD = '#f2a541';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, size, color, weight, align) {
  ctx.fillStyle = color;
  ctx.font = (weight || 'bold') + ' ' + size + 'px Georgia, serif';
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// One ingredient drawn as food, sized to fit a box centred at (cx, cy).
export function drawIngredient(ctx, ingredientId, cx, cy, size) {
  const s = size / 2;
  ctx.save();
  ctx.translate(cx, cy);
  if (ingredientId === 'rice') {
    ctx.fillStyle = '#f7f3e3';
    ctx.beginPath(); ctx.ellipse(0, s * 0.25, s * 0.95, s * 0.6, 0, Math.PI, 0); ctx.fill();
    ctx.strokeStyle = '#d9c49a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, s * 0.25, s * 0.95, s * 0.6, 0, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = '#fffdf5';
    ctx.beginPath(); ctx.ellipse(-s * 0.2, -s * 0.1, s * 0.5, s * 0.35, 0, 0, Math.PI * 2); ctx.fill();
  } else if (ingredientId === 'noodle') {
    ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = s * 0.28; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, s * (0.35 + i * 0.25), i * 1.1, i * 1.1 + Math.PI * 1.5);
      ctx.stroke();
    }
  } else if (ingredientId === 'egg') {
    ctx.fillStyle = '#fff6e0';
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.95, s * 0.75, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd23f';
    ctx.beginPath(); ctx.arc(s * 0.1, -s * 0.05, s * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffdf6b';
    ctx.beginPath(); ctx.arc(s * 0.02, -s * 0.12, s * 0.2, 0, Math.PI * 2); ctx.fill();
  } else if (ingredientId === 'chicken') {
    ctx.fillStyle = '#c97b2d';
    ctx.beginPath(); ctx.ellipse(-s * 0.3, s * 0.1, s * 0.55, s * 0.4, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.35, -s * 0.15, s * 0.5, s * 0.38, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e09a4a';
    ctx.beginPath(); ctx.arc(-s * 0.3, -s * 0.05, s * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.35, -s * 0.3, s * 0.16, 0, Math.PI * 2); ctx.fill();
  } else if (ingredientId === 'prawn') {
    ctx.strokeStyle = '#ff7f51'; ctx.lineWidth = s * 0.34; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, s * 0.1, s * 0.6, Math.PI * 1.05, Math.PI * 2.1); ctx.stroke();
    ctx.fillStyle = '#ff9e7d';
    ctx.beginPath(); ctx.arc(s * 0.55, -s * 0.35, s * 0.16, 0, Math.PI * 2); ctx.fill();
  } else if (ingredientId === 'sambal') {
    ctx.fillStyle = '#c1121f';
    ctx.beginPath(); ctx.ellipse(0, s * 0.15, s * 0.8, s * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e23b2e';
    ctx.beginPath(); ctx.ellipse(-s * 0.15, -s * 0.1, s * 0.4, s * 0.28, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff6b4a';
    ctx.beginPath(); ctx.arc(s * 0.25, -s * 0.2, s * 0.12, 0, Math.PI * 2); ctx.fill();
  } else if (ingredientId === 'veg') {
    ctx.fillStyle = '#6ab04c';
    ctx.beginPath(); ctx.ellipse(-s * 0.35, s * 0.1, s * 0.45, s * 0.3, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.3, -s * 0.1, s * 0.45, s * 0.3, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8bc34a';
    ctx.beginPath(); ctx.arc(0, s * 0.3, s * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#cddc39';
    ctx.beginPath(); ctx.arc(s * 0.05, s * 0.3, s * 0.14, 0, Math.PI * 2); ctx.fill();
  } else if (ingredientId === 'broth') {
    ctx.fillStyle = '#8d5a2b';
    ctx.beginPath(); ctx.ellipse(0, s * 0.2, s * 0.9, s * 0.55, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#e07a2f';
    ctx.beginPath(); ctx.ellipse(0, s * 0.05, s * 0.8, s * 0.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f2a541';
    ctx.beginPath(); ctx.ellipse(-s * 0.2, -s * 0.05, s * 0.3, s * 0.14, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawWallAndLamps(ctx, time) {
  ctx.fillStyle = '#e8c98f';
  ctx.fillRect(0, 0, VIEW_W, 300);
  ctx.fillStyle = TILE;
  for (let y = 0; y < 300; y += 46) {
    for (let x = (y / 46) % 2 ? -46 : 0; x < VIEW_W; x += 92) {
      ctx.fillRect(x + 2, y + 2, 88, 42);
    }
  }
  ctx.strokeStyle = TILE_LINE;
  ctx.lineWidth = 2;
  for (let y = 0; y <= 300; y += 46) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(VIEW_W, y); ctx.stroke(); }
  // Hanging lamps with a warm glow. The middle lamp hangs shorter so it
  // never collides with the boss banner below the top bar.
  for (const lx of [180, 640, 1100]) {
    const cord = lx === 640 ? 26 : 52;
    ctx.strokeStyle = '#4a2c12'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, cord); ctx.stroke();
    const flicker = 0.85 + 0.15 * Math.sin(time * 2 + lx);
    const glow = ctx.createRadialGradient(lx, cord + 26, 6, lx, cord + 26, 90);
    glow.addColorStop(0, 'rgba(255,214,120,' + (0.55 * flicker) + ')');
    glow.addColorStop(1, 'rgba(255,214,120,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(lx - 90, -10, 180, cord + 120);
    ctx.fillStyle = '#c0392b';
    ctx.beginPath(); ctx.moveTo(lx - 34, cord); ctx.lineTo(lx + 34, cord); ctx.lineTo(lx + 22, cord + 40); ctx.lineTo(lx - 22, cord + 40); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd76a';
    ctx.beginPath(); ctx.arc(lx, cord + 24, 12, 0, Math.PI * 2); ctx.fill();
  }
  // Kopitiam sign.
  ctx.fillStyle = '#7a1f1f';
  rr(ctx, 470, 8, 340, 44, 8); ctx.fill();
  ctx.strokeStyle = GOLD; ctx.lineWidth = 3; rr(ctx, 470, 8, 340, 44, 8); ctx.stroke();
  text(ctx, 'KOPITIAM RUSH', 640, 31, 26, '#ffe9b0', 'bold', 'center');
}

export function drawTopBar(ctx, state) {
  ctx.fillStyle = '#3d2410';
  ctx.fillRect(0, 0, VIEW_W, 58);
  ctx.fillStyle = GOLD;
  ctx.fillRect(0, 58, VIEW_W, 4);
  text(ctx, 'KOPITIAM RUSH', 16, 30, 24, '#ffe9b0');
  text(ctx, 'NIGHT ' + state.night + '/7 — ' + state.nightName, 250, 30, 20, '#fff8e7');
  text(ctx, 'SCORE ' + state.score, 560, 30, 20, '#fff8e7');
  text(ctx, 'COINS ' + state.coins + 'c', 730, 30, 20, '#ffd76a');
  const comboColor = state.combo >= 4 ? '#ffdf6b' : '#fff8e7';
  text(ctx, 'COMBO x' + state.combo, 880, 30, 22, comboColor);
  let hearts = '';
  for (let i = 0; i < state.hearts; i++) hearts += '♥ ';
  text(ctx, hearts, 1010, 30, 20, '#ff6b6b');
  text(ctx, 'SERVED ' + state.served + '/' + state.quota, 1150, 30, 20, '#a8e6a1');
}

export function drawBossBanner(ctx, state) {
  if (!state.boss) return;
  ctx.fillStyle = '#7a1f1f';
  rr(ctx, 240, 66, 800, 40, 8); ctx.fill();
  ctx.strokeStyle = GOLD; ctx.lineWidth = 2; rr(ctx, 240, 66, 800, 40, 8); ctx.stroke();
  text(ctx, state.boss.title + '  •  ' + state.boss.rule, 640, 87, 15, '#ffe9b0', 'bold', 'center');
}

export function drawOrderBoard(ctx, state) {
  const x = 16, y = state.boss ? 116 : 72, w = 284;
  ctx.fillStyle = '#4a2c12';
  rr(ctx, x, y, w, 540, 10); ctx.fill();
  ctx.fillStyle = '#f3e3c2';
  rr(ctx, x + 6, y + 6, w - 12, 528, 8); ctx.fill();
  text(ctx, 'ORDER BOARD', x + w / 2, y + 28, 20, INK, 'bold', 'center');
  ctx.fillStyle = RED;
  ctx.fillRect(x + 20, y + 46, w - 40, 2);
  if (state.orders.length === 0) {
    text(ctx, 'No orders yet —', x + w / 2, y + 120, 16, '#7a6a55', 'bold', 'center');
    text(ctx, 'the crowd is coming!', x + w / 2, y + 146, 16, '#7a6a55', 'bold', 'center');
  }
  let oy = y + 62;
  const oh = state.orders.length > 3 ? 96 : 116;
  for (let i = 0; i < state.orders.length; i++) {
    const order = state.orders[i];
    const selected = state.selectedOrderId === order.id;
    ctx.fillStyle = selected ? '#ffe9b0' : '#fff8e7';
    rr(ctx, x + 12, oy, w - 24, oh, 8); ctx.fill();
    ctx.strokeStyle = selected ? RED : '#d9c49a'; ctx.lineWidth = selected ? 3 : 2;
    rr(ctx, x + 12, oy, w - 24, oh, 8); ctx.stroke();
    text(ctx, (selected ? '▶ ' : '') + order.recipe.name.toUpperCase(), x + 24, oy + 18, 18, INK);
    text(ctx, order.recipe.price + 'c  •  ' + order.recipe.blurb, x + 24, oy + 38, 13, '#7a6a55');
    // Recipe steps as dots: filled = already on the plate for this order.
    const dotsY = oh === 96 ? 52 : 58;
    const nextY = oh === 96 ? 70 : 78;
    let dotX = x + 26;
    for (let s = 0; s < order.recipe.steps.length; s++) {
      const done = selected && s < state.plate.length;
      ctx.fillStyle = done ? '#6ab04c' : '#d9c49a';
      ctx.beginPath(); ctx.arc(dotX, oy + dotsY, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(dotX, oy + dotsY, 9, 0, Math.PI * 2); ctx.stroke();
      if (s < order.recipe.steps.length - 1) {
        ctx.strokeStyle = '#d9c49a'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(dotX + 10, oy + dotsY); ctx.lineTo(dotX + 22, oy + dotsY); ctx.stroke();
      }
      dotX += 32;
    }
    const next = selected ? nextStepFor(order.recipe, state.plate) : null;
    const ready = selected && state.plate.length === order.recipe.steps.length;
    text(ctx, ready ? 'READY — press SERVE!' : (next ? 'NEXT: ' + INGREDIENT_BY_ID[next].name.toUpperCase() : 'Tap to cook this'), x + 24, oy + nextY, 13, ready ? '#2e9e4f' : (selected ? RED : '#7a6a55'), 'bold');
    // Patience bar + seconds.
    const f = patienceFraction(order);
    ctx.fillStyle = '#e8dcc0';
    rr(ctx, x + 24, oy + oh - 16, w - 72, 10, 5); ctx.fill();
    ctx.fillStyle = patienceColor(order);
    rr(ctx, x + 24, oy + oh - 16, Math.max(10, (w - 72) * f), 10, 5); ctx.fill();
    text(ctx, Math.ceil(order.patience) + 's', x + w - 40, oy + oh - 11, 13, INK, 'bold');
    oy += oh + 10;
  }
  text(ctx, 'Click an order, then tap', x + w / 2, y + 500, 13, '#7a6a55', 'bold', 'center');
  text(ctx, 'ingredients in recipe order', x + w / 2, y + 520, 13, '#7a6a55', 'bold', 'center');
}

export function drawSteam(ctx, cx, cy, time, seed) {
  for (let i = 0; i < 9; i++) {
    const phase = (time * 0.35 + i * 0.13 + seed * 0.01) % 1;
    const px = cx + Math.sin(i * 2.4 + seed) * 26 * (1 - phase * 0.4);
    const py = cy - phase * 90;
    const r = 8 + phase * 16;
    ctx.fillStyle = 'rgba(255,255,255,' + (0.35 * (1 - phase)) + ')';
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
  }
}

export function drawPlate(ctx, state, cx, cy, time) {
  // Wooden counter top under the plate.
  ctx.fillStyle = WOOD;
  ctx.fillRect(316, 470, 648, 170);
  ctx.fillStyle = WOOD_DARK;
  ctx.fillRect(316, 470, 648, 8);
  // The big serving plate.
  ctx.fillStyle = '#e8e0cc';
  ctx.beginPath(); ctx.ellipse(cx, cy, 150, 104, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#b8a888'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(cx, cy, 150, 104, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#f7f3e3';
  ctx.beginPath(); ctx.ellipse(cx, cy, 122, 82, 0, 0, Math.PI * 2); ctx.fill();
  const order = state.orders.find((o) => o.id === state.selectedOrderId);
  if (order) {
    // Ingredients already on the plate, laid out in a row.
    const n = state.plate.length;
    for (let i = 0; i < n; i++) {
      const px = cx - (n - 1) * 34 + i * 68;
      drawIngredient(ctx, state.plate[i], px, cy - 6, 56);
    }
    // Ghost of the next ingredient to add, beside the plate.
    const next = nextStepFor(order.recipe, state.plate);
    if (next) {
      ctx.save();
      ctx.globalAlpha = 0.45;
      drawIngredient(ctx, next, cx + 205, cy - 30, 44);
      ctx.restore();
      text(ctx, 'NEXT: ' + INGREDIENT_BY_ID[next].name, cx + 205, cy + 8, 13, '#ffe9b0', 'bold', 'center');
    }
    // Progress dots under the plate.
    for (let s = 0; s < order.recipe.steps.length; s++) {
      ctx.fillStyle = s < n ? '#6ab04c' : '#d9c49a';
      ctx.beginPath(); ctx.arc(cx - (order.recipe.steps.length - 1) * 14 + s * 28, cy + 76, 8, 0, Math.PI * 2); ctx.fill();
    }
    text(ctx, order.recipe.name + '  ' + n + '/' + order.recipe.steps.length, cx, cy + 104, 16, CREAM, 'bold', 'center');
  } else {
    text(ctx, 'Pick an order from the board', cx, cy, 18, '#7a6a55', 'bold', 'center');
  }
  drawSteam(ctx, cx, cy - 60, time, state.steamSeed || 7);
}

export function drawCounter(ctx, state, time) {
  // Stove + wok on the left of the counter, big plate centre.
  const stoveX = 400, stoveY = 330;
  ctx.fillStyle = '#2b2b2b';
  rr(ctx, stoveX - 70, stoveY, 140, 120, 10); ctx.fill();
  ctx.fillStyle = '#ff6b35';
  ctx.beginPath(); ctx.ellipse(stoveX, stoveY + 30, 46, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3d3d3d';
  ctx.beginPath(); ctx.ellipse(stoveX, stoveY + 22, 58, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e07a2f';
  ctx.beginPath(); ctx.ellipse(stoveX, stoveY + 16, 48, 12, 0, 0, Math.PI * 2); ctx.fill();
  text(ctx, 'STOVE x' + state.stoveLevel, stoveX, stoveY + 66, 14, '#ffe9b0', 'bold', 'center');
  drawSteam(ctx, stoveX, stoveY - 10, time, 3);
  drawPlate(ctx, state, 700, 530, time);
}

export function drawRecipeMenu(ctx, state) {
  const x = 980, y = state.boss ? 116 : 72, w = 284;
  ctx.fillStyle = '#4a2c12';
  rr(ctx, x, y, w, 330, 10); ctx.fill();
  ctx.fillStyle = '#fff8e7';
  rr(ctx, x + 6, y + 6, w - 12, 318, 8); ctx.fill();
  text(ctx, 'MENU — 12 RECIPES', x + w / 2, y + 28, 18, INK, 'bold', 'center');
  let ry = y + 52;
  for (let i = 0; i < RECIPES.length; i++) {
    const recipe = RECIPES[i];
    const isTarget = state.orders.some((o) => o.recipeId === recipe.id);
    const onMenu = i < (state.menuSize || 12);
    text(ctx, (isTarget ? '★ ' : '') + recipe.name, x + 18, ry, 15, isTarget ? RED : (onMenu ? INK : '#b8a888'), 'bold');
    text(ctx, recipe.price + 'c', x + w - 22, ry, 15, onMenu ? '#7a6a55' : '#c9b896', 'bold', 'right');
    ry += 24;
  }
  // Tonight goals.
  const gy = y + 344;
  ctx.fillStyle = '#4a2c12';
  rr(ctx, x, gy, w, 190, 10); ctx.fill();
  ctx.fillStyle = '#fff8e7';
  rr(ctx, x + 6, gy + 6, w - 12, 178, 8); ctx.fill();
  text(ctx, 'TONIGHT', x + w / 2, gy + 28, 18, INK, 'bold', 'center');
  text(ctx, 'Serve ' + state.served + ' / ' + state.quota + ' dishes', x + 18, gy + 58, 15, INK);
  text(ctx, 'Walkouts: ' + state.walkouts + ' / 3', x + 18, gy + 84, 15, state.walkouts >= 2 ? RED : INK, 'bold');
  text(ctx, 'UPGRADES', x + 18, gy + 116, 15, INK, 'bold');
  text(ctx, 'Stove Lv' + state.stoveLevel + '  •  Slots ' + state.counterSlots, x + 18, gy + 140, 14, '#7a6a55');
  text(ctx, state.upgradeHint || 'Buy upgrades between nights', x + 18, gy + 164, 13, '#7a6a55');
}

export function drawIngredientButtons(ctx, state) {
  const y = 656;
  ctx.fillStyle = '#3d2410';
  ctx.fillRect(0, y, VIEW_W, VIEW_H - y);
  text(ctx, 'INGREDIENTS — click or press 1–8', 16, y + 22, 16, '#ffe9b0', 'bold');
  let bx = 16;
  for (let i = 0; i < INGREDIENTS.length; i++) {
    const ing = INGREDIENTS[i];
    const bw = 118;
    const selOrder = state.orders.find((o) => o.id === state.selectedOrderId);
    const next = selOrder ? nextStepFor(selOrder.recipe, state.plate) : null;
    const isNext = next === ing.id;
    ctx.fillStyle = isNext ? '#ffe9b0' : CREAM;
    rr(ctx, bx, y + 38, bw, 82, 10); ctx.fill();
    ctx.strokeStyle = isNext ? RED : '#d9c49a'; ctx.lineWidth = isNext ? 3 : 2;
    rr(ctx, bx, y + 38, bw, 82, 10); ctx.stroke();
    drawIngredient(ctx, ing.id, bx + bw / 2, y + 70, 44);
    text(ctx, ing.name, bx + bw / 2, y + 102, 13, INK, 'bold', 'center');
    ctx.fillStyle = RED;
    ctx.beginPath(); ctx.arc(bx + bw - 12, y + 50, 11, 0, Math.PI * 2); ctx.fill();
    text(ctx, ing.key, bx + bw - 12, y + 51, 12, '#fff', 'bold', 'center');
    bx += bw + 8;
  }
  // SERVE button.
  const order = state.orders.find((o) => o.id === state.selectedOrderId);
  const ready = order && state.plate.length === order.recipe.steps.length;
  const sx = 1064, sw = 200;
  ctx.fillStyle = ready ? '#2e9e4f' : '#8a8a8a';
  rr(ctx, sx, y + 38, sw, 82, 10); ctx.fill();
  ctx.strokeStyle = ready ? '#1d6b34' : '#666'; ctx.lineWidth = 3;
  rr(ctx, sx, y + 38, sw, 82, 10); ctx.stroke();
  text(ctx, ready ? 'SERVE!  (S)' : 'SERVE  (S)', sx + sw / 2, y + 70, 22, '#fff', 'bold', 'center');
  text(ctx, ready ? '+' + order.recipe.price + 'c ready' : 'finish the dish first', sx + sw / 2, y + 98, 13, '#fff', 'bold', 'center');
  // Trash button.
  ctx.fillStyle = '#7a1f1f';
  rr(ctx, 1064, y + 128, 200, 0, 0); ctx.fill();
  text(ctx, 'T = trash plate   •   M = mute', 640, y + 132, 13, '#d9c49a', 'bold', 'center');
}

export function drawStartScreen(ctx, state) {
  drawWallAndLamps(ctx, 0);
  ctx.fillStyle = 'rgba(43,26,14,0.55)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = CREAM;
  rr(ctx, 290, 150, 700, 460, 16); ctx.fill();
  ctx.strokeStyle = GOLD; ctx.lineWidth = 4; rr(ctx, 290, 150, 700, 460, 16); ctx.stroke();
  text(ctx, 'KOPITIAM RUSH', 640, 210, 44, RED, 'bold', 'center');
  text(ctx, 'Assemble hawker dishes against the clock', 640, 258, 20, INK, 'bold', 'center');
  text(ctx, '7 nights  •  12 recipes  •  8 ingredients  •  3 bosses', 640, 292, 18, '#7a6a55', 'bold', 'center');
  text(ctx, 'Click an order, tap ingredients in recipe order,', 640, 350, 18, INK, 'bold', 'center');
  text(ctx, 'then SERVE before the customer walks out.', 640, 378, 18, INK, 'bold', 'center');
  text(ctx, 'Keys 1–8 add ingredients  •  S serves  •  T trashes', 640, 420, 16, '#7a6a55', 'bold', 'center');
  ctx.fillStyle = '#2e9e4f';
  rr(ctx, 490, 470, 300, 64, 12); ctx.fill();
  text(ctx, 'START NIGHT 1', 640, 503, 24, '#fff', 'bold', 'center');
  text(ctx, 'Click START or press Enter', 640, 566, 15, '#7a6a55', 'bold', 'center');
}

export function drawNightClear(ctx, state) {
  ctx.fillStyle = 'rgba(43,26,14,0.6)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = CREAM;
  rr(ctx, 340, 220, 600, 320, 16); ctx.fill();
  ctx.strokeStyle = GOLD; ctx.lineWidth = 4; rr(ctx, 340, 220, 600, 320, 16); ctx.stroke();
  text(ctx, 'NIGHT ' + state.night + ' CLEAR!', 640, 280, 36, '#2e9e4f', 'bold', 'center');
  text(ctx, 'Served ' + state.served + ' dishes  •  Bonus +' + state.lastBonus + 'c', 640, 330, 20, INK, 'bold', 'center');
  text(ctx, 'Score ' + state.score + '  •  Coins ' + state.coins + 'c', 640, 364, 20, INK, 'bold', 'center');
  text(ctx, 'UPGRADE SHOP — click to buy (or press Enter to continue)', 640, 410, 16, RED, 'bold', 'center');
  text(ctx, 'Faster Stove 40c  •  Extra Counter Slot 50c  •  Calm Customers 35c', 640, 446, 16, INK, 'bold', 'center');
  text(ctx, 'Press Enter for Night ' + (state.night + 1), 640, 500, 18, '#7a6a55', 'bold', 'center');
}

export function drawGameOver(ctx, state) {
  ctx.fillStyle = 'rgba(43,26,14,0.7)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = CREAM;
  rr(ctx, 340, 240, 600, 280, 16); ctx.fill();
  ctx.strokeStyle = RED; ctx.lineWidth = 4; rr(ctx, 340, 240, 600, 280, 16); ctx.stroke();
  text(ctx, state.won ? 'KOPITIAM CROWN!' : 'STALL CLOSED', 640, 300, 38, state.won ? '#2e9e4f' : RED, 'bold', 'center');
  text(ctx, state.won
    ? 'You cleared the Midnight Feast — the kopitiam is yours!'
    : 'Too many customers walked out on Night ' + state.night + '.', 640, 350, 18, INK, 'bold', 'center');
  text(ctx, 'Final score ' + state.score + '  •  Coins ' + state.coins + 'c', 640, 392, 20, INK, 'bold', 'center');
  text(ctx, 'Press Enter to play again', 640, 452, 18, '#7a6a55', 'bold', 'center');
}

export function drawScene(ctx, state, time) {
  ctx.fillStyle = '#2b1a0e';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  drawWallAndLamps(ctx, time);
  drawTopBar(ctx, state);
  drawBossBanner(ctx, state);
  drawOrderBoard(ctx, state);
  drawCounter(ctx, state, time);
  drawRecipeMenu(ctx, state);
  drawIngredientButtons(ctx, state);
  if (state.screen === 'start') drawStartScreen(ctx, state);
  if (state.screen === 'nightClear') drawNightClear(ctx, state);
  if (state.screen === 'over') drawGameOver(ctx, state);
}
