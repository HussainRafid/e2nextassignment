const mariadb = require('mariadb');
require('dotenv').config()
const poolDb = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

async function testConnection() {
  var conn
  try {
    conn = await poolDb.getConnection()
    console.log('✅ Connected to MariaDB successfully!')
  } catch (err) {
    console.error('❌ Database connection failed:', err)
  } finally {
    if (conn) conn.release()
  }
}

testConnection()

module.exports = poolDb;