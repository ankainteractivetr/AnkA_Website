/** Stores the CMS access token in a cookie that JavaScript cannot read. */
export class AuthCookie
{
  static NAME = 'anka_admin_token';
  #options;

  constructor(config)
  {
    this.#options = Object.freeze({
      httpOnly: true, // not readable from JS, so XSS cannot steal the token
      secure: config.isProduction, // HTTPS only in production
      sameSite: 'strict', // not sent on cross-site requests (CSRF protection)
      path: '/api',
    });
  }

  // No maxAge: a session cookie, while the JWT itself carries the expiry.
  set(res, token)
  {
    res.cookie(AuthCookie.NAME, token, this.#options);
  }

  clear(res)
  {
    res.clearCookie(AuthCookie.NAME, this.#options);
  }

  read(req)
  {
    return req.cookies?.[AuthCookie.NAME];
  }
}
