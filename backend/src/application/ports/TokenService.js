import { NotImplementedError } from './NotImplementedError.js';

/** Port (Strategy): issuing and verifying access tokens. */
export class TokenService
{
  sign(_adminUser)
  {
    throw new NotImplementedError(this, 'sign');
  }

  /** Returns the payload, or null when the token is missing, invalid or expired. */
  verify(_token)
  {
    throw new NotImplementedError(this, 'verify');
  }
}
