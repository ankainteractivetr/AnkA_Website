import { NotFoundError } from '../../../domain/errors.js';

export class NotFoundMiddleware
{
  handle = (req, _res, next) =>
  {
    next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
  };
}
