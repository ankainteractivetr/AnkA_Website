import { NotImplementedError } from './NotImplementedError.js';

/** Port: CMS accounts. */
export class AdminUserRepository
{
  async findByUsername(_username)
  {
    throw new NotImplementedError(this, 'findByUsername');
  }

  async findById(_id)
  {
    throw new NotImplementedError(this, 'findById');
  }

  /** Creates the account, or replaces its password hash when the username exists. */
  async saveCredentials(_username, _passwordHash)
  {
    throw new NotImplementedError(this, 'saveCredentials');
  }

  async recordLogin(_id)
  {
    throw new NotImplementedError(this, 'recordLogin');
  }
}
