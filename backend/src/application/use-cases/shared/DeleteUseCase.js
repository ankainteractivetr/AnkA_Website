import { Input } from '../../../domain/value-objects/Input.js';

/** Deletes one record by id; deleting a record that is already gone succeeds. */
export class DeleteUseCase
{
  #repository;
  #field;

  constructor(repository, field)
  {
    this.#repository = repository;
    this.#field = field;
  }

  async execute(id)
  {
    await this.#repository.delete(Input.id(id, this.#field));
  }
}
