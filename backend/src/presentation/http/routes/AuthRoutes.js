import { Router } from 'express';
import { RateLimiter } from '../middleware/RateLimiter.js';

/** /api/auth: CMS login (sets the auth cookie), logout and the signed-in admin. */
export class AuthRoutes
{
  path = '/auth';
  #controller;
  #authMiddleware;

  constructor(controller, authMiddleware)
  {
    this.#controller = controller;
    this.#authMiddleware = authMiddleware;
  }

  build()
  {
    return Router()
      .post('/login', RateLimiter.login(), this.#controller.login)
      .post('/logout', this.#controller.logout)
      .get('/me', this.#authMiddleware.handle, this.#controller.me);
  }
}
