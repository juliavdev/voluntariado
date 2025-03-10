const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

async function query(sql, params) {
    const connection = await db.getConnection();
    try {
        const [rows] = await connection.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Erro ao executar query:', error);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = { query };
