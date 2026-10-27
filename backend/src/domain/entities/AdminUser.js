/** A CMS account; the password hash never leaves the backend (see toPublic). */
export class AdminUser
{
  constructor({ id, username, passwordHash = null, lastLogin = null })
  {
    Object.assign(this, { id, username, passwordHash, lastLogin });
    Object.freeze(this);
  }

  toPublic()
  {
    return { id: this.id, username: this.username };
  }
}
