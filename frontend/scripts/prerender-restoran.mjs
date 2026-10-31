// After `vite build`: renders /restoran to HTML and writes it into dist/restoran.html's #root, so the page shows its
// content before any JavaScript runs (faster first paint; main.jsx then hydrates it).
import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const PAGE_FILE = new URL('../dist/restoran.html', import.meta.url);
const ROOT = '<div id="root"></div>';

async function renderPage()
{
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
  const { RestoranPage } = await vite.ssrLoadModule('/src/restoran/RestoranPage.jsx');
  await vite.close();
  return renderToString(createElement(RestoranPage));
}

async function prerender()
{
  const html = await readFile(PAGE_FILE, 'utf8');
  if (!html.includes(ROOT)) throw new Error('dist/restoran.html has no empty #root to fill.');
  await writeFile(PAGE_FILE, html.replace(ROOT, `<div id="root">${await renderPage()}</div>`));
  console.log('Prerendered dist/restoran.html');
}

await prerender();
