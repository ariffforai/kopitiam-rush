# KOPITIAM RUSH

[![make.fun](https://make.fun/badge/competition/best-cooking-game-20261125-0137)](https://make.fun/c/best-cooking-game-20261125-0137)
[![make.fun](https://make.fun/badge/repo/ariffforai/kopitiam-rush)](https://make.fun/c/best-cooking-game-20261125-0137)
[![make.fun](https://make.fun/badge/entry/ariffforai/kopitiam-rush)](https://make.fun/c/best-cooking-game-20261125-0137)

**KOPITIAM RUSH: assemble hawker dishes against the clock — 7 nights, 12 recipes, 8 ingredients, 3 bosses.**

A complete, original 2D cooking game set in a Malaysian kopitiam / night-market hawker stall. Orders arrive on the order board; you click an order, tap ingredients in recipe order to build the dish mid-assembly on the plate, and serve before the customer's patience timer runs out. Entry for the [Make the best cooking game](https://make.fun/c/best-cooking-game-20261125-0137) bounty.

## How to play

- **Click an order** on the order board to cook it, then **click ingredients** (or press keys **1–8**) in the recipe's order to add them to the plate.
- **S** serves a finished dish. **T** trashes the plate. **M** mutes. **Enter** starts / continues.
- A wrong ingredient breaks your combo — and on the Food Critic's night, it ends the night.
- Serve fast: a shrinking patience bar pays a shrinking tip. Three walkouts close the stall.

## Structure

- **7 nights** — order volume and impatience rise each night; serve the quota to clear the night.
- **3 bosses** — Night 3: **The Food Critic** (one perfect dish, tiny timer); Night 5: **Festival Rush** (double orders); Night 7: **The Midnight Feast** (final boss: a 5-dish banquet against the clock).
- **12 recipes** (Nasi Lemak, Char Kway Teow, Penang Laksa, Prawn Mee…) built from **8 ingredients** in exact order.
- **Combo multiplier, coins, tips, hearts, upgrades** — Faster Stove, Extra Counter Slot, Calm Customers — bought between nights.
- Win by clearing Night 7; lose when too many customers walk out.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network requests, no assets — all art is drawn in code on a 2D canvas, all sound is WebAudio synth.

## Layout

- `main.ts` — the hand-in program: copies `game/` + `screenshots/` to `/output` and writes `dossier.json` (Node 22, stdlib only).
- `game/index.html` + `game/src/` — the playable game, split by job: `recipes.js` (menu), `orders.js` (order board + patience), `nights.js` (nights + bosses), `render.js` (all canvas art), `input.js`, `audio.js`, `random.js` (seeded RNG), `shots.js` (staged screenshot states), `main.js` (loop + state machine).
- `screenshots/` — 4 real renders of the game's own code: cover = peak Night 7 rush, then orders, serve, and the Food Critic boss night.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.

## License

MIT — see [LICENSE](LICENSE).
