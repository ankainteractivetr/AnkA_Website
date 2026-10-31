import express, { Router } from 'express';
import { join } from 'node:path';

// Addresses the API answers itself: an unknown one there is a 404, not the site's index.html.
const SITE_PAGE = /^\/(?!api(\/|$)|uploads(\/|$)).*/;
// Pages with their own HTML entry (own title and link-preview tags), as in public_html/.htaccess: clean address → file.
const PAGES = Object.freeze({ '/restoran': 'restoran.html' });

/** Serves the built frontend (FRONTEND_DIR) when no separate web server does: its files, its own pages, and index.html for every other site address. */
export class FrontendRoutes
{
  #dir;

  constructor(dir)
  {
    this.#dir = dir;
  }

  build()
  {
    const router = Router().get(/^\/restoran(\/|\.html)$/, (req, res) => res.redirect(301, `/restoran${FrontendRoutes.#query(req)}`));
    for (const [path, file] of Object.entries(PAGES)) router.get(path, (_req, res) => res.sendFile(join(this.#dir, file)));
    return router.use(express.static(this.#dir, { index: false })).get(SITE_PAGE, (_req, res) => res.sendFile(join(this.#dir, 'index.html')));
  }

  static #query(req)
  {
    const at = req.originalUrl.indexOf('?');
    return at < 0 ? '' : req.originalUrl.slice(at);
  }
}
