import { AuthenticationError } from '../../../domain/errors.js';

/** Turns an access token back into the signed-in admin; the account is re-read, so a deleted one loses access at once. */
export class AuthenticateTokenUseCase
{
  #tokenService;
  #adminUsers;

  constructor(tokenService, adminUsers)
  {
    this.#tokenService = tokenService;
    this.#adminUsers = adminUsers;
  }

  async execute(token)
  {
    const payload = this.#tokenService.verify(token);
    const user = payload ? await this.#adminUsers.findById(payload.sub) : null;
    if (!user) throw new AuthenticationError('Authentication required.');
    return user.toPublic();
  }
}
