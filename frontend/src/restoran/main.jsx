import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { RestoranPage } from './RestoranPage.jsx';
import './restoran.css';

// /restoran's own entry (restoran.html): Turkish only, without the main site's router, CMS data or language switch.
// The build prerenders the page into #root (scripts/prerender-restoran.mjs), so it is hydrated; the dev server starts it empty.
const root = document.getElementById('root');
const page = <StrictMode><RestoranPage /></StrictMode>;
if (root.hasChildNodes()) hydrateRoot(root, page);
else createRoot(root).render(page);
