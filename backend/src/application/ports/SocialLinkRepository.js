import { NotImplementedError } from './NotImplementedError.js';
import { OrderedListRepository } from './OrderedListRepository.js';

/** Port: the footer's social media links, in display order. */
export class SocialLinkRepository extends OrderedListRepository
{
  async findActive()
  {
    throw new NotImplementedError(this, 'findActive');
  }
}
