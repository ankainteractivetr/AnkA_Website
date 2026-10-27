import express, { Router } from 'express';
import { join } from 'node:path';

// Addresses the API answers itself: an unknown one there is a 404, not the site's index.html.
const SITE_PAGE = /^\/(?!api(\/|$)|uploads(\/|$)).*/;

/** Serves the built frontend (FRONTEND_DIR) when no separate web server does: its files, and index.html for every site address. */
export class FrontendRoutes
{
  #dir;

  constructor(dir)
  {
    this.#dir = dir;
  }

  build()
  {
    const index = join(this.#dir, 'index.html');
    return Router().use(express.static(this.#dir, { index: false })).get(SITE_PAGE, (_req, res) => res.sendFile(index));
  }
}
