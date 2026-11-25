// orders.js — the order board: customers arrive, wait with a patience
// timer, and walk out if the timer runs dry. Serving a finished plate
// before the timer ends pays coins and score times the combo multiplier.

import { RECIPE_BY_ID } from './recipes.js';

let orderCounter = 0;

export function makeOrder(recipeId, patienceSeconds, seed) {
  orderCounter += 1;
  return {
    id: orderCounter,
    recipeId,
    recipe: RECIPE_BY_ID[recipeId],
    patience: patienceSeconds,
    patienceMax: patienceSeconds,
    seed: seed || 1,
    served: false,
    walkedOut: false,
  };
}

export function tickOrders(orders, dtSeconds) {
  const walkedOut = [];
  for (const order of orders) {
    if (order.served || order.walkedOut) continue;
    order.patience -= dtSeconds;
    if (order.patience <= 0) {
      order.patience = 0;
      order.walkedOut = true;
      walkedOut.push(order);
    }
  }
  return walkedOut;
}

export function patienceFraction(order) {
  return Math.max(0, order.patience / order.patienceMax);
}

export function patienceColor(order) {
  const f = patienceFraction(order);
  if (f > 0.5) return '#6ab04c';
  if (f > 0.25) return '#f2a541';
  return '#d64541';
}

// Coins for serving this order now: dish price, plus a tip that shrinks
// as patience runs down, times the current combo multiplier.
export function servePayout(order, comboMultiplier) {
  const tip = Math.round(order.recipe.price * 0.5 * patienceFraction(order));
  return (order.recipe.price + tip) * comboMultiplier;
}

export function removeServedOrders(orders) {
  return orders.filter((o) => !o.served && !o.walkedOut);
}
