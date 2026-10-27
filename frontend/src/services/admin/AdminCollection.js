/**
 * An admin collection edited item by item (slides, menu products) under `path`: list, create/update, reorder, delete.
 * `keys` name the response fields: { item: 'slide', list: 'slides' }.
 */
export class AdminCollection
{
  #http;
  #path;
  #keys;

  constructor(httpClient, path, keys)
  {
    this.#http = httpClient;
    this.#path = path;
    this.#keys = keys;
  }

  async list()
  {
    const body = await this.#http.get(this.#path);
    return body[this.#keys.list];
  }

  async save(entry)
  {
    const { id, ...fields } = entry;
    const body = id ? await this.#http.put(`${this.#path}/${id}`, fields) : await this.#http.post(this.#path, fields);
    return body[this.#keys.item];
  }

  /** Saves an order: the `ids` in their new order, first one first; resolves to the reordered list. */
  async reorder(ids)
  {
    const body = await this.#http.put(`${this.#path}/order`, { ids });
    return body[this.#keys.list];
  }

  async remove(id)
  {
    await this.#http.delete(`${this.#path}/${id}`);
  }
}
