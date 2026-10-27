/**
 * The access token lives in an httpOnly cookie set by the API, so JavaScript never sees it;
 * this service only talks to the auth endpoints.
 */
export class AuthService
{
  #http;

  constructor(httpClient)
  {
    this.#http = httpClient;
  }

  async login(username, password)
  {
    const { user } = await this.#http.post('/auth/login', { username, password });
    return user;
  }

  async logout()
  {
    await this.#http.post('/auth/logout');
  }

  async getCurrentUser()
  {
    const { user } = await this.#http.get('/auth/me');
    return user;
  }
}
