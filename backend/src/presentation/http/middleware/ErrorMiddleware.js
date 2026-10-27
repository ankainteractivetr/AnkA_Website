import { AuthenticationError, ConflictError, NotFoundError, ValidationError } from '../../../domain/errors.js';

const STATUS_BY_ERROR = new Map([
  [ValidationError, 400],
  [AuthenticationError, 401],
  [NotFoundError, 404],
  [ConflictError, 409],
]);

/** Maps domain errors to HTTP responses: { error: message }. */
export class ErrorMiddleware
{
  #config;

  constructor(config)
  {
    this.#config = config;
  }

  // Express recognises error handlers by their four parameters, so `_next` must stay.
  handle = (err, _req, res, _next) =>
  {
    const status = ErrorMiddleware.#statusOf(err);
    if (status >= 500) console.error(err);
    res.status(status).json({ error: this.#messageOf(err, status) });
  };

  static #statusOf(err)
  {
    for (const [ErrorType, status] of STATUS_BY_ERROR) {
      if (err instanceof ErrorType) return status;
    }
    return Number.isInteger(err.status) ? err.status : 500; // e.g. malformed JSON from express.json(), a missing upload
  }

  #messageOf(err, status)
  {
    const hidden = (status >= 500 && this.#config.isProduction) || !err.message;
    return hidden ? 'Internal server error' : err.message;
  }
}
