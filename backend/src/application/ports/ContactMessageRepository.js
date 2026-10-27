import { NotImplementedError } from './NotImplementedError.js';

/** Port: messages from the contact form. */
export class ContactMessageRepository
{
  async add(_message)
  {
    throw new NotImplementedError(this, 'add');
  }

  /** The latest messages, newest first. */
  async findRecent()
  {
    throw new NotImplementedError(this, 'findRecent');
  }

  async findById(_id)
  {
    throw new NotImplementedError(this, 'findById');
  }

  async setRead(_id, _isRead)
  {
    throw new NotImplementedError(this, 'setRead');
  }

  async delete(_id)
  {
    throw new NotImplementedError(this, 'delete');
  }
}
