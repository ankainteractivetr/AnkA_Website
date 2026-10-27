import { AuthenticationError, ValidationError } from '../../../domain/errors.js';

/** Username + password login of a CMS account; resolves to the public user and a signed access token. */
export class LoginUseCase
{
  #adminUsers;
  #passwordHasher;
  #tokenService;

  constructor(adminUsers, passwordHasher, tokenService)
  {
    this.#adminUsers = adminUsers;
    this.#passwordHasher = passwordHasher;
    this.#tokenService = tokenService;
  }

  async execute(input)
  {
    const { username, password } = LoginUseCase.#credentialsOf(input);
    const user = await this.#adminUsers.findByUsername(username);
    const matches = await this.#passwordHasher.compare(password, user?.passwordHash); // also hashed for unknown users: timing reveals nothing
    if (!user || !matches) throw new AuthenticationError();
    await this.#adminUsers.recordLogin(user.id);
    return { user: user.toPublic(), token: this.#tokenService.sign(user) };
  }

  static #credentialsOf(input)
  {
    const username = typeof input?.username === 'string' ? input.username.trim() : '';
    const password = typeof input?.password === 'string' ? input.password : '';
    if (!username || !password) throw new ValidationError('Username and password required.');
    return { username, password };
  }
}
