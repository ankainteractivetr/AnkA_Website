import { NotImplementedError } from './NotImplementedError.js';

/** Port: the contact section's settings (one record). */
export class ContactInfoRepository
{
  async find()
  {
    throw new NotImplementedError(this, 'find');
  }

  async save(_contactInfo)
  {
    throw new NotImplementedError(this, 'save');
  }
}
