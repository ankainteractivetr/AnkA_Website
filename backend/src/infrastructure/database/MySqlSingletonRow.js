/**
 * A table that holds a single settings row (id = 1): reads it, and saves by updating it or, the first time, inserting it.
 * Plain UPDATE / INSERT instead of an upsert, so it works the same on MySQL and MariaDB.
 */
export class MySqlSingletonRow
{
  #db;
  #sql;

  constructor(db, table, columns)
  {
    this.#db = db;
    this.#sql = MySqlSingletonRow.#statements(table, columns);
  }

  /** The row's columns, or null when the row does not exist yet. */
  async find()
  {
    const [row] = await this.#db.query(this.#sql.select);
    return row ?? null;
  }

  /** `values` in the order of the columns given to the constructor. */
  async save(values)
  {
    const [existing] = await this.#db.query(this.#sql.exists);
    await this.#db.query(existing ? this.#sql.update : this.#sql.insert, values);
  }

  static #statements(table, columns)
  {
    return {
      select: `SELECT ${columns.join(', ')} FROM ${table} WHERE id = 1`, exists: `SELECT id FROM ${table} WHERE id = 1`,
      update: `UPDATE ${table} SET ${columns.map((column) => `${column} = ?`).join(', ')} WHERE id = 1`,
      insert: `INSERT INTO ${table} (id, ${columns.join(', ')}) VALUES (1, ${columns.map(() => '?').join(', ')})`,
    };
  }
}
