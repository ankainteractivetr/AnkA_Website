/** Creates the CMS account from ADMIN_USERNAME / ADMIN_PASSWORD on every start, or resets its password: .env stays the source of truth. */
export class EnsureAdminUseCase
{
  #adminUsers;
  #passwordHasher;

  constructor(adminUsers, passwordHasher)
  {
    this.#adminUsers = adminUsers;
    this.#passwordHasher = passwordHasher;
  }

  async execute({ username, password })
  {
    await this.#adminUsers.saveCredentials(username, await this.#passwordHasher.hash(password));
    console.log(`[bootstrap] admin user "${username}" ready.`);
  }
}
