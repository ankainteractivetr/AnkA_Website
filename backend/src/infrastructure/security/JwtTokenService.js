import jwt from 'jsonwebtoken';
import { TokenService } from '../../application/ports/TokenService.js';

export class JwtTokenService extends TokenService
{
  static #ALGORITHM = 'HS256';
  #secret;
  #expiresIn;

  constructor({ secret, expiresIn })
  {
    super();
    this.#secret = secret;
    this.#expiresIn = expiresIn;
  }

  sign(adminUser)
  {
    const payload = { sub: String(adminUser.id), username: adminUser.username };
    return jwt.sign(payload, this.#secret, { algorithm: JwtTokenService.#ALGORITHM, expiresIn: this.#expiresIn });
  }

  verify(token)
  {
    if (!token) return null;
    try {
      return jwt.verify(token, this.#secret, { algorithms: [JwtTokenService.#ALGORITHM] });
    } catch {
      return null;
    }
  }
}
