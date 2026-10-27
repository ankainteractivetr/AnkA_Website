import { ClientWorkRepository } from '../../application/ports/ClientWorkRepository.js';
import { ClientWork } from '../../domain/entities/ClientWork.js';
import { WorkMedia } from '../../domain/value-objects/WorkMedia.js';
import { MySqlDisplayOrder } from '../database/MySqlDisplayOrder.js';

const SELECT = 'SELECT id, title, kind, url, display_order, is_published FROM client_works';
const ORDER = 'ORDER BY display_order, id';

export class MySqlClientWorkRepository extends ClientWorkRepository
{
  #db;
  #displayOrder;

  constructor(db)
  {
    super();
    this.#db = db;
    this.#displayOrder = new MySqlDisplayOrder(db, 'client_works');
  }

  findAll()
  {
    return this.#select(ORDER);
  }

  findPublished()
  {
    return this.#select(`WHERE is_published = 1 ${ORDER}`);
  }

  async findById(id)
  {
    const [work] = await this.#select('WHERE id = ?', [id]);
    return work ?? null;
  }

  async create(work)
  {
    const sql = 'INSERT INTO client_works (title, kind, url, display_order, is_published) VALUES (?, ?, ?, ?, ?)';
    const result = await this.#db.query(sql, [work.title, work.media.kind, work.media.url, work.displayOrder, work.isPublished ? 1 : 0]);
    return work.withId(result.insertId);
  }

  async update(work)
  {
    const sql = 'UPDATE client_works SET title = ?, kind = ?, url = ?, is_published = ? WHERE id = ?';
    await this.#db.query(sql, [work.title, work.media.kind, work.media.url, work.isPublished ? 1 : 0, work.id]);
  }

  async delete(id)
  {
    await this.#db.query('DELETE FROM client_works WHERE id = ?', [id]);
  }

  nextDisplayOrder()
  {
    return this.#displayOrder.next();
  }

  reorder(ids)
  {
    return this.#displayOrder.save(ids);
  }

  async #select(clause, params = [])
  {
    const rows = await this.#db.query(`${SELECT} ${clause}`, params);
    return rows.map((row) => new ClientWork({ id: row.id, title: row.title, media: new WorkMedia(row.kind, row.url), displayOrder: row.display_order, isPublished: Boolean(row.is_published) }));
  }
}
