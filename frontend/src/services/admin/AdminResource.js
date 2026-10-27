/** An admin endpoint edited as a whole: GET loads { [key]: value }, PUT saves { [key]: value }. */
export class AdminResource
{
  #http;
  #path;
  #key;

  constructor(httpClient, path, key)
  {
    this.#http = httpClient;
    this.#path = path;
    this.#key = key;
  }

  async load()
  {
    const body = await this.#http.get(this.#path);
    return body[this.#key];
  }

  /** Resolves to the saved value as the API returns it, or `value` itself when the API answers 204. */
  async save(value)
  {
    const body = await this.#http.put(this.#path, { [this.#key]: value });
    return body?.[this.#key] ?? value;
  }
}
