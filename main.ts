// main.ts — the hand-in program for KOPITIAM RUSH (Node 22, stdlib only).
//
// It copies this repository's game/ and screenshots/ into the output
// directory and writes dossier.json there with the vendored make.fun
// library, so the sealed scorer can check the entry and the judge can
// read its source outline. The copy is byte-for-byte, so running it twice
// writes the same bytes both times.
//
// Outside the grader's sandbox, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const gameDir = join(repoRoot, 'game');
const shotsDir = join(repoRoot, 'screenshots');

mkdirSync(outputDir, { recursive: true });

// Clear any stale output first, so a re-run never leaves files behind
// that the repository no longer holds.
rmSync(join(outputDir, 'game'), { recursive: true, force: true });
rmSync(join(outputDir, 'screenshots'), { recursive: true, force: true });
cpSync(gameDir, join(outputDir, 'game'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps (see the competition rules): only text_max_bytes
// shapes the dossier's bytes; the rest refuse an entry the scorer would
// refuse — more than 4 screenshots or one over 256 KiB, more than 993
// files in game/ or 48 MiB of game files in all, or a path under game/
// over 1000 bytes.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
