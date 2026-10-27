import { NotFoundError } from '../../../domain/errors.js';
import { Input } from '../../../domain/value-objects/Input.js';

/**
 * Creates an entry of an OrderedListRepository at the end of the list, or updates one in place. `entity` is the entry's
 * class, used as its factory: entity.create(input, id) validates the admin input (e.g. SocialLink, ClientWork).
 */
export class SaveListItemUseCase
{
  #repository;
  #entity;
  #field;

  constructor(repository, entity, field)
  {
    this.#repository = repository;
    this.#entity = entity;
    this.#field = field;
  }

  execute({ id, input })
  {
    return id === undefined ? this.#create(input) : this.#update(Input.id(id, this.#field), input);
  }

  async #create(input)
  {
    const entry = this.#entity.create(input);
    return this.#repository.create(entry.withDisplayOrder(await this.#repository.nextDisplayOrder()));
  }

  async #update(id, input)
  {
    const existing = await this.#repository.findById(id);
    if (!existing) throw new NotFoundError(`${this.#field} not found.`);
    const entry = this.#entity.create(input, id).withDisplayOrder(existing.displayOrder);
    await this.#repository.update(entry);
    return entry;
  }
}
