import { Router } from 'express';

/** /api/games: the endpoints the game clients call (formerly katip.py and umay.py). */
export class GameRoutes
{
  path = '/games';
  #controller;

  constructor(controller)
  {
    this.#controller = controller;
  }

  build()
  {
    return Router()
      .post('/feedback', this.#controller.feedback)
      .post('/high-score', this.#controller.highScore)
      .get('/leaderboard', this.#controller.leaderboard);
  }
}
