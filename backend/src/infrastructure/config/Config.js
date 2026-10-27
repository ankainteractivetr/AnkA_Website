import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ThumbnailSettings } from './ThumbnailSettings.js';

const BACKEND_DIR = fileURLToPath(new URL('../../../', import.meta.url));
const UPLOADS_DIR = resolve(BACKEND_DIR, 'uploads');
const MB = 1024 * 1024;

/** Validated, immutable application settings read from environment variables (backend/.env). */
export class Config
{
  constructor(env)
  {
    Object.assign(this, Config.#server(env), Config.#security(env));
    Object.assign(this, { db: Config.#database(env), mail: Config.#mail(env), uploads: Config.#uploads(env) });
    Object.freeze(this);
  }

  static fromEnvironment()
  {
    return new Config(process.env);
  }

  /** backend/uploads: where uploaded images are stored and served from (/uploads). */
  get uploadsDir()
  {
    return UPLOADS_DIR;
  }

  get isProduction()
  {
    return this.nodeEnv === 'production';
  }

  /** `frontendDir` is the built frontend the API serves itself (FRONTEND_DIR, relative to backend/), or null. */
  static #server(env)
  {
    const corsOrigins = (env.CORS_ORIGINS ?? '').split(',').map((origin) => origin.trim()).filter(Boolean);
    const frontendDir = env.FRONTEND_DIR ? resolve(BACKEND_DIR, env.FRONTEND_DIR) : null;
    return { nodeEnv: env.NODE_ENV || 'development', port: Number(env.PORT || 5000), corsOrigins, frontendDir };
  }

  /** The CMS account (re-created from these on every start) and the access token settings. */
  static #security(env)
  {
    const admin = Object.freeze({ username: env.ADMIN_USERNAME || 'admin', password: Config.#required(env, 'ADMIN_PASSWORD') });
    return { admin, jwt: Object.freeze({ secret: Config.#required(env, 'JWT_SECRET'), expiresIn: env.JWT_EXPIRES_IN || '7d' }) };
  }

  static #database(env)
  {
    return Object.freeze({ host: env.DB_HOST || 'localhost', port: Number(env.DB_PORT || 3306), user: env.DB_USER || 'root', password: env.DB_PASSWORD ?? '', database: env.DB_NAME || 'anka_website' });
  }

  /** Outgoing mail; `smtp` is null unless SMTP_HOST and SMTP_USER are set, and contact e-mails are then only logged. */
  static #mail(env)
  {
    const smtp = env.SMTP_HOST && env.SMTP_USER ? Config.#smtp(env) : null;
    return Object.freeze({ from: env.SMTP_FROM || env.SMTP_USER, to: env.SMTP_TO || env.SMTP_USER, smtp });
  }

  static #smtp(env)
  {
    const secure = String(env.SMTP_SECURE).toLowerCase() === 'true';
    return Object.freeze({ host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 465), secure, auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD ?? '' } });
  }

  static #uploads(env)
  {
    return Object.freeze({ maxBytes: Number(env.MAX_UPLOAD_SIZE_MB || 10) * MB, thumbnail: ThumbnailSettings.from(env) });
  }

  static #required(env, name)
  {
    if (!env[name]) throw new Error(`Missing required environment variable: ${name}`);
    return env[name];
  }
}
