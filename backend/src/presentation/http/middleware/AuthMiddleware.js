/** Lets a request through only with a valid CMS token; attaches the admin to req.user. */
export class AuthMiddleware
{
  #authenticateToken;
  #authCookie;

  constructor(authenticateToken, authCookie)
  {
    this.#authenticateToken = authenticateToken;
    this.#authCookie = authCookie;
  }

  handle = async (req, _res, next) =>
  {
    req.user = await this.#authenticateToken.execute(this.#authCookie.read(req));
    next();
  };
}
