/** The display_order column of one table whose rows form a single ordered list (e.g. social_links, client_works). */
export class MySqlDisplayOrder
{
  #db;
  #table;

  constructor(db, table)
  {
    this.#db = db;
    this.#table = table;
  }

  async next()
  {
    const [row] = await this.#db.query(`SELECT COALESCE(MAX(display_order), -1) + 1 AS next FROM ${this.#table}`);
    return Number(row.next);
  }

  /** Numbers the rows by their position in `ids`, in one transaction. */
  save(ids)
  {
    const sql = `UPDATE ${this.#table} SET display_order = ? WHERE id = ?`;
    return this.#db.transaction(async (tx) => {
      for (const [index, id] of ids.entries()) await tx.query(sql, [index, id]);
    });
  }
}
