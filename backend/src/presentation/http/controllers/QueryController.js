/**
 * Read-only endpoint: runs a use case and responds with { [responseKey]: result }.
 * `inputOf` picks the use case's input from the request (default: none).
 */
export class QueryController
{
  #useCase;
  #responseKey;
  #inputOf;

  constructor(useCase, responseKey, inputOf = () => undefined)
  {
    this.#useCase = useCase;
    this.#responseKey = responseKey;
    this.#inputOf = inputOf;
  }

  handle = async (req, res) =>
  {
    res.json({ [this.#responseKey]: await this.#useCase.execute(this.#inputOf(req)) });
  };
}
