import rateLimit from 'express-rate-limit';
import { Language } from '../../../domain/value-objects/Language.js';
import { LocalizedText } from '../../../domain/value-objects/LocalizedText.js';

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const TOO_MANY_MESSAGES = new LocalizedText('Too many messages were sent. Please try again later.', 'Çok fazla ileti gönderildi. Lütfen daha sonra tekrar deneyin.');

/** Factory for the per-IP limits on the public write endpoints. */
export class RateLimiter
{
  /** Brute-force guard on the login: only failed attempts count, so signing in often never locks the admin out. */
  static login()
  {
    return RateLimiter.#create(FIFTEEN_MINUTES_MS, 10, () => ({ error: 'Too many failed attempts. Try again in 15 minutes.' }), { skipSuccessfulRequests: true });
  }

  /** Spam guard on the contact form; answers in the legacy form's shape and language. */
  static contact()
  {
    const language = (req) => Language.fromLegacyCode(req.body?.contact_lang) ?? Language.EN;
    return RateLimiter.#create(HOUR_MS, 10, (req) => ({ success: false, message: language(req).pick(TOO_MANY_MESSAGES) }));
  }

  static #create(windowMs, limit, message, options = {})
  {
    return rateLimit({ windowMs, limit, standardHeaders: 'draft-8', legacyHeaders: false, message, ...options });
  }
}
