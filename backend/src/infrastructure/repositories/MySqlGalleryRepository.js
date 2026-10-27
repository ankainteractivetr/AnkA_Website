import { GalleryRepository } from '../../application/ports/GalleryRepository.js';
import { GalleryImage } from '../../domain/entities/GalleryImage.js';
import { NotFoundError } from '../../domain/errors.js';

const COLUMNS = 'id, image_url, alt_text, display_order';
const ORDER = 'ORDER BY display_order, id';

/**
 * The ordered images of one gallery table. `table` is the row mapping (strategy, see galleryTables.js): { name, ownerColumn };
 * with an owner column every query is scoped to that owner, without one the table is a single gallery.
 */
export class MySqlGalleryRepository extends GalleryRepository
{
  #db;
  #table;

  constructor(db, table)
  {
    super();
    this.#db = db;
    this.#table = table;
  }

  findAll(ownerId)
  {
    return this.#select(ownerId, ORDER);
  }

  async findByOwners(ownerIds)
  {
    const { name, ownerColumn } = this.#table;
    if (!ownerColumn || ownerIds.length === 0) return new Map();
    const rows = await this.#db.query(`SELECT ${ownerColumn} AS owner_id, ${COLUMNS} FROM ${name} WHERE ${ownerColumn} IN (?) ${ORDER}`, [ownerIds]);
    return MySqlGalleryRepository.#groupByOwner(rows);
  }

  async findById(ownerId, id)
  {
    const [image] = await this.#select(ownerId, 'AND id = ?', [id]);
    return image ?? null;
  }

  async add(ownerId, image)
  {
    const displayOrder = await this.#nextDisplayOrder(ownerId);
    const insert = this.#insertOf(ownerId, [image.url, image.alt, displayOrder]);
    const result = await this.#db.query(insert.sql, insert.params).catch(MySqlGalleryRepository.#rejectMissingOwner);
    return image.withId(result.insertId).withDisplayOrder(displayOrder);
  }

  async remove(ownerId, id)
  {
    const scope = this.#scope(ownerId);
    await this.#db.query(`DELETE FROM ${this.#table.name} WHERE ${scope.sql} AND id = ?`, [...scope.params, id]);
  }

  reorder(ownerId, ids)
  {
    const scope = this.#scope(ownerId);
    const sql = `UPDATE ${this.#table.name} SET display_order = ? WHERE ${scope.sql} AND id = ?`;
    return this.#db.transaction(async (tx) => {
      for (const [index, id] of ids.entries()) await tx.query(sql, [index, ...scope.params, id]);
    });
  }

  async #select(ownerId, clause, params = [])
  {
    const scope = this.#scope(ownerId);
    const rows = await this.#db.query(`SELECT ${COLUMNS} FROM ${this.#table.name} WHERE ${scope.sql} ${clause}`, [...scope.params, ...params]);
    return rows.map((row) => MySqlGalleryRepository.#toEntity(row));
  }

  async #nextDisplayOrder(ownerId)
  {
    const scope = this.#scope(ownerId);
    const [row] = await this.#db.query(`SELECT COALESCE(MAX(display_order), -1) + 1 AS next FROM ${this.#table.name} WHERE ${scope.sql}`, scope.params);
    return Number(row.next);
  }

  #scope(ownerId)
  {
    const { ownerColumn } = this.#table;
    return ownerColumn ? { sql: `${ownerColumn} = ?`, params: [ownerId] } : { sql: 'TRUE', params: [] };
  }

  #insertOf(ownerId, values)
  {
    const { name, ownerColumn } = this.#table;
    if (!ownerColumn) return { sql: `INSERT INTO ${name} (image_url, alt_text, display_order) VALUES (?, ?, ?)`, params: values };
    return { sql: `INSERT INTO ${name} (${ownerColumn}, image_url, alt_text, display_order) VALUES (?, ?, ?, ?)`, params: [ownerId, ...values] };
  }

  static #rejectMissingOwner(error)
  {
    throw error.code === 'ER_NO_REFERENCED_ROW_2' ? new NotFoundError('Project not found.') : error;
  }

  static #groupByOwner(rows)
  {
    const groups = new Map();
    for (const row of rows) groups.set(row.owner_id, [...(groups.get(row.owner_id) ?? []), MySqlGalleryRepository.#toEntity(row)]);
    return groups;
  }

  static #toEntity(row)
  {
    return new GalleryImage({ id: row.id, url: row.image_url, alt: row.alt_text ?? '', displayOrder: row.display_order });
  }
}
