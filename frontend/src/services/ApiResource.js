/** A read-only API endpoint whose JSON wraps its payload in one key, e.g. GET /home → { content }. */
export class ApiResource
{
  #http;
  #path;
  #responseKey;

  constructor(httpClient, path, responseKey)
  {
    this.#http = httpClient;
    this.#path = path;
    this.#responseKey = responseKey;
  }

  async fetch(params)
  {
    const body = await this.#http.get(this.#path, params);
    return body[this.#responseKey];
  }
}
