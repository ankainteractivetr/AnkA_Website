import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Router } from 'express';
import helmet from 'helmet';
import { NotFoundMiddleware } from './middleware/NotFoundMiddleware.js';

/** Facade over Express: builds the app from route modules (`routeModules` under /api, `siteRoutes` at the root) and runs it. */
export class HttpServer
{
  #config;
  #routeModules;
  #siteRoutes;
  #errorMiddleware;
  #app;
  #server = null;

  constructor(config, routeModules, errorMiddleware, siteRoutes = [])
  {
    this.#config = config;
    this.#routeModules = routeModules;
    this.#siteRoutes = siteRoutes;
    this.#errorMiddleware = errorMiddleware;
    this.#app = this.#createApp();
  }

  listen()
  {
    return new Promise((resolve) => {
      this.#server = this.#app.listen(this.#config.port, () => resolve(this.#config.port));
    });
  }

  close()
  {
    return new Promise((resolve) => (this.#server ? this.#server.close(() => resolve()) : resolve()));
  }

  #createApp()
  {
    const app = express();
    this.#applySecurity(app);
    this.#applyParsers(app);
    this.#mountRoutes(app);
    this.#applyErrorHandling(app);
    return app;
  }

  #applySecurity(app)
  {
    app.disable('x-powered-by');
    if (this.#config.isProduction) app.set('trust proxy', 1); // behind the host's reverse proxy
    // No Content-Security-Policy: the API serves JSON. Uploads are loaded cross-origin by the site (api.ankainteractive.com).
    app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
    app.use(cors({ origin: this.#allowsOrigin, credentials: true }));
  }

  /** Requests without an Origin (game clients, curl) are allowed, and every origin when CORS_ORIGINS is empty. */
  #allowsOrigin = (origin, callback) =>
  {
    const origins = this.#config.corsOrigins;
    callback(null, !origin || origins.length === 0 || origins.includes(origin));
  };

  #applyParsers(app)
  {
    app.use(express.json({ limit: '2mb' }));
    app.use(express.urlencoded({ extended: true, limit: '2mb' })); // the game clients post HTML-form fields
    app.use(cookieParser());
  }

  #mountRoutes(app)
  {
    const api = Router();
    for (const module of this.#routeModules) api.use(module.path, module.build());
    app.use('/uploads', express.static(this.#config.uploadsDir, { fallthrough: false }));
    app.use('/api', api);
    for (const module of this.#siteRoutes) app.use(module.build());
  }

  #applyErrorHandling(app)
  {
    app.use(new NotFoundMiddleware().handle);
    app.use(this.#errorMiddleware.handle);
  }
}
