import { NotImplementedError } from './NotImplementedError.js';
import { OrderedListRepository } from './OrderedListRepository.js';

/** Port: the works of the Services section, in display order. */
export class ClientWorkRepository extends OrderedListRepository
{
  async findPublished()
  {
    throw new NotImplementedError(this, 'findPublished');
  }
}
