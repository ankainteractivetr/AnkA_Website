// ============================================================================
//  Database — mysql2 promise pool
// ============================================================================
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'anka',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4_unicode_ci',
});

async function query(sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

async function queryOne(sql, params = []) {
    const rows = await query(sql, params);
    return rows[0] || null;
}

async function testConnection() {
    const conn = await pool.getConnection();
    try {
        await conn.ping();
    } finally {
        conn.release();
    }
}

module.exports = { pool, query, queryOne, testConnection };
