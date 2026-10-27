/** A list that visitors and games fill in (messages, feedback, high scores): the CMS reads its latest entries and deletes them. */
export class AdminLog
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

  async list()
  {
    const body = await this.#http.get(this.#path);
    return body[this.#key];
  }

  async remove(id)
  {
    await this.#http.delete(`${this.#path}/${id}`);
  }

  /** Contact messages only: marks one read or unread; resolves to the updated message. */
  async markRead(id, isRead)
  {
    const { message } = await this.#http.put(`${this.#path}/${id}/read`, { isRead });
    return message;
  }
}
