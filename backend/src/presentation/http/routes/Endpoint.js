import { CommandController } from '../controllers/CommandController.js';
import { QueryController } from '../controllers/QueryController.js';

/** Factory of the { method, path, handlers } entries that EndpointRoutes mounts. */
export class Endpoint
{
  static of(method, path, ...handlers)
  {
    return { method, path, handlers };
  }

  /** GET-style endpoint answering { [responseKey]: result }. */
  static query(method, path, useCase, responseKey, inputOf)
  {
    return Endpoint.of(method, path, new QueryController(useCase, responseKey, inputOf).handle);
  }

  /** Write endpoint; see CommandController for the options. */
  static command(method, path, useCase, options)
  {
    return Endpoint.of(method, path, new CommandController(useCase, options).handle);
  }
}
