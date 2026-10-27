import { NotImplementedError } from './NotImplementedError.js';

/** Port: anything whose availability the health check reports. */
export class HealthProbe
{
  async isReachable()
  {
    throw new NotImplementedError(this, 'isReachable');
  }
}
