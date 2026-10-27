import { ContactMessageRepository } from '../../application/ports/ContactMessageRepository.js';
import { ContactMessage } from '../../domain/entities/ContactMessage.js';
import { Language } from '../../domain/value-objects/Language.js';

const SELECT = 'SELECT id, name, email, subject, message, language, is_read, created_at FROM contact_messages';
const RECENT_LIMIT = 500;

export class MySqlContactMessageRepository extends ContactMessageRepository
{
  #db;

  constructor(db)
  {
    super();
    this.#db = db;
  }

  async add(message)
  {
    const sql = 'INSERT INTO contact_messages (name, email, subject, message, language) VALUES (?, ?, ?, ?, ?)';
    const { insertId } = await this.#db.query(sql, [message.name, message.email, message.subject, message.message, message.language.legacyCode]);
    return insertId;
  }

  async findRecent()
  {
    const rows = await this.#db.query(`${SELECT} ORDER BY created_at DESC, id DESC LIMIT ?`, [RECENT_LIMIT]);
    return rows.map((row) => MySqlContactMessageRepository.#toEntity(row));
  }

  async findById(id)
  {
    const [row] = await this.#db.query(`${SELECT} WHERE id = ?`, [id]);
    return row ? MySqlContactMessageRepository.#toEntity(row) : null;
  }

  async setRead(id, isRead)
  {
    await this.#db.query('UPDATE contact_messages SET is_read = ? WHERE id = ?', [isRead ? 1 : 0, id]);
  }

  async delete(id)
  {
    await this.#db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
  }

  static #toEntity(row)
  {
    return new ContactMessage({
      id: row.id, name: row.name, email: row.email, subject: row.subject, message: row.message,
      language: Language.fromLegacyCode(row.language) ?? Language.EN, isRead: Boolean(row.is_read), createdAt: row.created_at,
    });
  }
}
