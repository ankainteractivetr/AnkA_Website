import { NotImplementedError } from './NotImplementedError.js';

/** Port: a list kept in display order and edited one entry at a time in the CMS (social links, client works). */
export class OrderedListRepository
{
  async findAll()
  {
    throw new NotImplementedError(this, 'findAll');
  }

  async findById(_id)
  {
    throw new NotImplementedError(this, 'findById');
  }

  /** Resolves to the entry with its id. */
  async create(_entry)
  {
    throw new NotImplementedError(this, 'create');
  }

  /** Saves every field but the display order. */
  async update(_entry)
  {
    throw new NotImplementedError(this, 'update');
  }

  async delete(_id)
  {
    throw new NotImplementedError(this, 'delete');
  }

  /** The display position after the last entry. */
  async nextDisplayOrder()
  {
    throw new NotImplementedError(this, 'nextDisplayOrder');
  }

  /** Saves a new order: `ids` first one first. */
  async reorder(_ids)
  {
    throw new NotImplementedError(this, 'reorder');
  }
}
