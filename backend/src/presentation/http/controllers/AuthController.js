export class AuthController
{
  #login;
  #authCookie;

  constructor(loginUseCase, authCookie)
  {
    this.#login = loginUseCase;
    this.#authCookie = authCookie;
  }

  login = async (req, res) =>
  {
    const { user, token } = await this.#login.execute(req.body);
    this.#authCookie.set(res, token);
    res.json({ user });
  };

  logout = (_req, res) =>
  {
    this.#authCookie.clear(res);
    res.status(204).end();
  };

  me = (req, res) =>
  {
    res.json({ user: req.user });
  };
}
