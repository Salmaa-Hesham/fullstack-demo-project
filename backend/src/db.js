const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const result = await pool.query("SELECT COUNT(*) FROM items;");
  const count = Number(result.rows[0].count);

  if (count === 0) {
    await pool.query(`
      INSERT INTO items (name)
      VALUES
        ('Item created during backend startup'),
        ('This item is stored in PostgreSQL'),
        ('This data is shown in the React frontend');
    `);
  }
}

module.exports = {
  pool,
  initDb
};
