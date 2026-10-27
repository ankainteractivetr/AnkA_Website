import axios from 'axios';

/** Adapter over axios: the rest of the app only sees get/post/put/delete that resolve to response bodies. */
export class HttpClient
{
  #axios;

  constructor(baseURL)
  {
    this.#axios = axios.create({
      baseURL,
      withCredentials: true, // sends the httpOnly auth cookie
      timeout: 15_000,
    });
  }

  async get(url, params)
  {
    const { data } = await this.#axios.get(url, { params });
    return data;
  }

  async post(url, body)
  {
    const { data } = await this.#axios.post(url, body);
    return data;
  }

  async put(url, body)
  {
    const { data } = await this.#axios.put(url, body);
    return data;
  }

  async delete(url)
  {
    const { data } = await this.#axios.delete(url);
    return data;
  }
}
