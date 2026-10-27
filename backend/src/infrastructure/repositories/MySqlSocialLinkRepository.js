import { SocialLinkRepository } from '../../application/ports/SocialLinkRepository.js';
import { SocialLink } from '../../domain/entities/SocialLink.js';
import { MySqlDisplayOrder } from '../database/MySqlDisplayOrder.js';

const SELECT = 'SELECT id, platform, url, icon_name, display_order, is_active FROM social_links';
const ORDER = 'ORDER BY display_order, id';

export class MySqlSocialLinkRepository extends SocialLinkRepository
{
  #db;
  #displayOrder;

  constructor(db)
  {
    super();
    this.#db = db;
    this.#displayOrder = new MySqlDisplayOrder(db, 'social_links');
  }

  findAll()
  {
    return this.#select(ORDER);
  }

  findActive()
  {
    return this.#select(`WHERE is_active = 1 ${ORDER}`);
  }

  async findById(id)
  {
    const [link] = await this.#select('WHERE id = ?', [id]);
    return link ?? null;
  }

  async create(link)
  {
    const sql = 'INSERT INTO social_links (platform, url, icon_name, display_order, is_active) VALUES (?, ?, ?, ?, ?)';
    const result = await this.#db.query(sql, [link.platform, link.url, link.iconName, link.displayOrder, link.isActive ? 1 : 0]);
    return link.withId(result.insertId);
  }

  async update(link)
  {
    const sql = 'UPDATE social_links SET platform = ?, url = ?, icon_name = ?, is_active = ? WHERE id = ?';
    await this.#db.query(sql, [link.platform, link.url, link.iconName, link.isActive ? 1 : 0, link.id]);
  }

  async delete(id)
  {
    await this.#db.query('DELETE FROM social_links WHERE id = ?', [id]);
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
    return rows.map((row) => new SocialLink({ id: row.id, platform: row.platform, url: row.url, iconName: row.icon_name, displayOrder: row.display_order, isActive: Boolean(row.is_active) }));
  }
}
