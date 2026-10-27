import { NotImplementedError } from './NotImplementedError.js';

/** Port (Strategy): password hashing algorithm. */
export class PasswordHasher
{
  async hash(_plain)
  {
    throw new NotImplementedError(this, 'hash');
  }

  /** Must stay timing-safe when `hash` is null (unknown user). */
  async compare(_plain, _hash)
  {
    throw new NotImplementedError(this, 'compare');
  }
}
