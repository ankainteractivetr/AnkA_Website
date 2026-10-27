import { Input } from '../../../domain/value-objects/Input.js';

/** Saves a list's order from the CMS's up/down buttons: `ids` first one first; resolves to the reordered list. */
export class ReorderUseCase
{
  #repository;

  constructor(repository)
  {
    this.#repository = repository;
  }

  async execute(ids)
  {
    await this.#repository.reorder(Input.ids(ids, 'Order'));
    return this.#repository.findAll();
  }
}
