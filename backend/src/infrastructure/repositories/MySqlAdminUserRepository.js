import { AdminUserRepository } from '../../application/ports/AdminUserRepository.js';
import { AdminUser } from '../../domain/entities/AdminUser.js';

const SELECT = 'SELECT id, username, password_hash, last_login FROM admin_users';

export class MySqlAdminUserRepository extends AdminUserRepository
{
  #db;

  constructor(db)
  {
    super();
    this.#db = db;
  }

  findByUsername(username)
  {
    return this.#findOne('WHERE username = ?', [username]);
  }

  findById(id)
  {
    return this.#findOne('WHERE id = ?', [id]);
  }

  async saveCredentials(username, passwordHash)
  {
    const { affectedRows } = await this.#db.query('UPDATE admin_users SET password_hash = ? WHERE username = ?', [passwordHash, username]);
    if (affectedRows === 0) await this.#db.query('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', [username, passwordHash]);
  }

  async recordLogin(id)
  {
    await this.#db.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [id]);
  }

  async #findOne(clause, params)
  {
    const [row] = await this.#db.query(`${SELECT} ${clause}`, params);
    return row ? new AdminUser({ id: row.id, username: row.username, passwordHash: row.password_hash, lastLogin: row.last_login }) : null;
  }
}
