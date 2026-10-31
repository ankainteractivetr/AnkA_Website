import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';

// Pages with their own HTML entry (their own title, description and link-preview tags without JavaScript): clean address → file.
const PAGES = Object.freeze({ '/restoran': '/restoran.html' });

// https://vite.dev/config/
export default defineConfig(({ mode }) =>
{
  const env = loadEnv(mode, process.cwd(), '');
  const build = { sourcemap: false, rolldownOptions: { input: { main: 'index.html', restoran: 'restoran.html' } } };
  return { plugins: [react(), tailwindcss(), cleanPageUrls()], server: { port: 5173, host: true, proxy: apiProxy(env) }, build };
});

// Same origin in development, so the httpOnly CMS cookie works without CORS: /api and /uploads go to the backend.
function apiProxy(env)
{
  const target = env.API_PROXY_TARGET || 'http://localhost:5000';
  return Object.fromEntries(['/api', '/uploads'].map((path) => [path, target]));
}

// The dev and preview servers answer /restoran with restoran.html, as .htaccess does in production.
function cleanPageUrls()
{
  const rewrite = (req, _res, next) => {
    const [path, query] = req.url.split('?');
    if (PAGES[path]) req.url = query ? `${PAGES[path]}?${query}` : PAGES[path];
    next();
  };
  // A configure hook may return a "post" hook, so these return nothing: middlewares.use() returns the server.
  const install = (server) => void server.middlewares.use(rewrite);
  return { name: 'clean-page-urls', configureServer: install, configurePreviewServer: install };
}
