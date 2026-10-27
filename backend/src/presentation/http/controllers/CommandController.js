/**
 * Write endpoint: runs a use case with input taken from the request.
 * Responds { [responseKey]: result } with `status`, or 204 No Content when there is no responseKey.
 */
export class CommandController
{
  #useCase;
  #inputOf;
  #responseKey;
  #status;

  constructor(useCase, { inputOf = (req) => req.body, responseKey = null, status = 200 } = {})
  {
    this.#useCase = useCase;
    this.#inputOf = inputOf;
    this.#responseKey = responseKey;
    this.#status = status;
  }

  handle = async (req, res) =>
  {
    const result = await this.#useCase.execute(this.#inputOf(req));
    if (!this.#responseKey) return void res.status(204).end();
    res.status(this.#status).json({ [this.#responseKey]: result });
  };
}
