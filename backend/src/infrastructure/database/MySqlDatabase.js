import mysql from 'mysql2/promise';
import { HealthProbe } from '../../application/ports/HealthProbe.js';

/** Adapter around a mysql2 connection pool. */
export class MySqlDatabase extends HealthProbe
{
  static #POOL_OPTIONS = {
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4',
    timezone: 'Z',
  };

  #pool;

  constructor(dbConfig)
  {
    super();
    this.#pool = mysql.createPool({ ...dbConfig, ...MySqlDatabase.#POOL_OPTIONS });
    this.#pool.pool.on('connection', (connection) => MySqlDatabase.#useUtc(connection));
  }

  /** `timezone: 'Z'` makes mysql2 read dates as UTC, so the session must use UTC too, or timestamps read back hours off. */
  static #useUtc(connection)
  {
    connection.query("SET time_zone = '+00:00'");
  }

  async query(sql, params = [])
  {
    const [rows] = await this.#pool.query(sql, params);
    return rows;
  }

  /** Runs `work(tx)` on one connection inside a transaction; tx.query has the same shape as query(). */
  async transaction(work)
  {
    const connection = await this.#pool.getConnection();
    try {
      return await MySqlDatabase.#runInTransaction(connection, work);
    } finally {
      connection.release();
    }
  }

  async isReachable()
  {
    try {
      await this.#pool.query('SELECT 1');
      return true;
    } catch (error) {
      console.error(`[database] ${error.code ?? ''} ${error.message}`); // the health check only says "false"; the reason goes to the log
      return false;
    }
  }

  close()
  {
    return this.#pool.end();
  }

  static async #runInTransaction(connection, work)
  {
    await connection.beginTransaction();
    const result = await work(MySqlDatabase.#queryHandle(connection)).catch(async (error) => {
      await connection.rollback();
      throw error;
    });
    await connection.commit();
    return result;
  }

  static #queryHandle(connection)
  {
    return { query: async (sql, params = []) => (await connection.query(sql, params))[0] };
  }
}
