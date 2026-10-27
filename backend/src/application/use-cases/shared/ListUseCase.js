/** Read use case that returns one repository listing as-is (e.g. the CMS's message list). */
export class ListUseCase
{
  #repository;
  #method;

  constructor(repository, method = 'findAll')
  {
    this.#repository = repository;
    this.#method = method;
  }

  execute(input)
  {
    return this.#repository[this.#method](input);
  }
}
