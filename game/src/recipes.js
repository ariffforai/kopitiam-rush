// recipes.js — the kopitiam menu: 12 hawker dishes and the 8 ingredients
// every dish is built from. Each recipe is an ordered list of ingredient
// ids: the player must add them to the plate in exactly that order, which
// is what makes assembling a dish a skill instead of a shopping list.

export const INGREDIENTS = [
  { id: 'rice',     name: 'Rice',        key: '1', color: '#f7f3e3', price: 2 },
  { id: 'noodle',   name: 'Noodles',     key: '2', color: '#f2c14e', price: 2 },
  { id: 'egg',      name: 'Egg',         key: '3', color: '#ffd23f', price: 3 },
  { id: 'chicken',  name: 'Chicken',     key: '4', color: '#c97b2d', price: 4 },
  { id: 'prawn',    name: 'Prawn',       key: '5', color: '#ff7f51', price: 4 },
  { id: 'sambal',   name: 'Sambal',      key: '6', color: '#c1121f', price: 2 },
  { id: 'veg',      name: 'Veg & Lime',  key: '7', color: '#6ab04c', price: 2 },
  { id: 'broth',    name: 'Broth',       key: '8', color: '#e07a2f', price: 3 },
];

export const INGREDIENT_BY_ID = {};
for (const ing of INGREDIENTS) INGREDIENT_BY_ID[ing.id] = ing;

export const RECIPES = [
  { id: 'nasi-lemak',      name: 'Nasi Lemak',      steps: ['rice', 'egg', 'sambal', 'veg', 'chicken'], price: 14, difficulty: 2, blurb: 'Coconut rice, egg, sambal' },
  { id: 'char-kway-teow',  name: 'Char Kway Teow',  steps: ['noodle', 'prawn', 'egg', 'veg'],            price: 13, difficulty: 2, blurb: 'Smoky wok noodles' },
  { id: 'roti-canai',      name: 'Roti Canai',      steps: ['egg', 'broth', 'veg'],                     price: 9,  difficulty: 1, blurb: 'Flaky flatbread, curry' },
  { id: 'laksa',           name: 'Penang Laksa',    steps: ['noodle', 'broth', 'prawn', 'veg'],        price: 15, difficulty: 3, blurb: 'Sour fish broth, thick noodles' },
  { id: 'mee-goreng',      name: 'Mee Goreng',      steps: ['noodle', 'chicken', 'egg', 'sambal'],      price: 12, difficulty: 2, blurb: 'Fried noodles, spicy kick' },
  { id: 'chicken-rice',    name: 'Hainanese Rice',  steps: ['rice', 'chicken', 'broth', 'veg'],         price: 13, difficulty: 2, blurb: 'Silky chicken, fragrant rice' },
  { id: 'satay',           name: 'Satay Skewers',   steps: ['chicken', 'sambal', 'veg', 'broth'],      price: 12, difficulty: 2, blurb: 'Char-grilled skewers' },
  { id: 'curry-mee',       name: 'Curry Mee',       steps: ['noodle', 'broth', 'chicken', 'egg'],      price: 14, difficulty: 3, blurb: 'Rich curry soup noodles' },
  { id: 'nasi-goreng',     name: 'Nasi Goreng',     steps: ['rice', 'egg', 'chicken', 'sambal', 'veg'], price: 14, difficulty: 3, blurb: 'Wok-fried rice, fiery' },
  { id: 'teh-tarik',       name: 'Teh Tarik Set',   steps: ['broth', 'egg', 'rice'],                    price: 8,  difficulty: 1, blurb: 'Pulled tea + kaya toast' },
  { id: 'prawn-mee',       name: 'Prawn Mee',       steps: ['noodle', 'prawn', 'broth', 'egg'],         price: 16, difficulty: 3, blurb: 'Prawn broth, big flavour' },
  { id: 'ayam-percik',     name: 'Ayam Percik',     steps: ['chicken', 'sambal', 'rice', 'veg'],       price: 15, difficulty: 3, blurb: 'Coconut-grilled chicken' },
];

export const RECIPE_BY_ID = {};
for (const recipe of RECIPES) RECIPE_BY_ID[recipe.id] = recipe;

// The next step the plate still needs, or null when the dish is complete.
export function nextStepFor(recipe, plateSteps) {
  if (plateSteps.length >= recipe.steps.length) return null;
  return recipe.steps[plateSteps.length];
}

// True when the plate so far matches the recipe's prefix exactly.
export function plateMatchesPrefix(recipe, plateSteps) {
  for (let i = 0; i < plateSteps.length; i++) {
    if (plateSteps[i] !== recipe.steps[i]) return false;
  }
  return true;
}

export function plateIsComplete(recipe, plateSteps) {
  return plateSteps.length === recipe.steps.length && plateMatchesPrefix(recipe, plateSteps);
}
