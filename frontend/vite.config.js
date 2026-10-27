import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) =>
{
  const env = loadEnv(mode, process.cwd(), '');
  return { plugins: [react(), tailwindcss()], server: { port: 5173, host: true, proxy: apiProxy(env) }, build: { sourcemap: false } };
});

// Same origin in development, so the httpOnly CMS cookie works without CORS: /api and /uploads go to the backend.
function apiProxy(env)
{
  const target = env.API_PROXY_TARGET || 'http://localhost:5000';
  return Object.fromEntries(['/api', '/uploads'].map((path) => [path, target]));
}
