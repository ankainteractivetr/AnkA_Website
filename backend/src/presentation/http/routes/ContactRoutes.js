import { Router } from 'express';
import { RateLimiter } from '../middleware/RateLimiter.js';

/** POST /api/<path>: the public contact form, rate limited per IP; mounted at /contact and at ulak.js's old /ulak. */
export class ContactRoutes
{
  #controller;

  constructor(path, controller)
  {
    this.path = path;
    this.#controller = controller;
  }

  build()
  {
    return Router().post('/', RateLimiter.contact(), this.#controller.submit);
  }
}
