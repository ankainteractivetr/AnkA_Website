import bcrypt from 'bcryptjs';
import { PasswordHasher } from '../../application/ports/PasswordHasher.js';

export class BcryptPasswordHasher extends PasswordHasher
{
  #rounds;
  #dummyHash;

  constructor(rounds = 12)
  {
    super();
    this.#rounds = rounds;
    this.#dummyHash = bcrypt.hashSync('timing-safe-placeholder', rounds);
  }

  hash(plain)
  {
    return bcrypt.hash(plain, this.#rounds);
  }

  // Compares against a dummy hash for unknown users, so the response time does not reveal which usernames exist.
  compare(plain, hash)
  {
    return bcrypt.compare(plain, hash ?? this.#dummyHash);
  }
}
