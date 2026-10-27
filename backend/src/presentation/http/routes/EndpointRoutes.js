import { Router } from 'express';

/** Route module mounted under /api/<path>: its endpoints ({ method, path, handlers }) behind optional guards, e.g. the CMS login. */
export class EndpointRoutes
{
  #endpoints;
  #guards;

  constructor(path, endpoints, guards = [])
  {
    this.path = path;
    this.#endpoints = endpoints;
    this.#guards = guards;
  }

  build()
  {
    const router = Router();
    for (const guard of this.#guards) router.use(guard);
    for (const { method, path, handlers } of this.#endpoints) router[method](path, ...handlers);
    return router;
  }
}
