// serve.ts — a tiny static server for local play-testing of KOPITIAM RUSH.
// Serves game/ at http://localhost:8080 with no build step and no network.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const gameDir = join(here, 'game');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let path = url.pathname === '/' ? '/index.html' : url.pathname;
    const file = join(gameDir, path);
    if (!file.startsWith(gameDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': mimeTypes[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8080, () => {
  console.log('KOPITIAM RUSH at http://localhost:8080');
});
