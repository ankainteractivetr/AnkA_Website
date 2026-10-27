/** Thrown by a port (abstract class) method that the concrete adapter forgot to implement. */
export class NotImplementedError extends Error
{
  constructor(port, method)
  {
    super(`${port.constructor.name} must implement ${method}()`);
    this.name = 'NotImplementedError';
  }
}
