const express = require("express");
const cors = require("cors");
const { pool, initDb } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1;");

    res.json({
      status: "healthy",
      backend: "running",
      database: "connected",
      environment: process.env.NODE_ENV || "not set",
      message: process.env.APP_MESSAGE || "APP_MESSAGE is not configured"
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      backend: "running",
      database: "not connected",
      error: error.message
    });
  }
});

app.get("/api/items", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, created_at
      FROM items
      ORDER BY id ASC;
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch items",
      details: error.message
    });
  }
});

app.post("/api/items", async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      error: "Item name is required"
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO items (name)
      VALUES ($1)
      RETURNING id, name, created_at;
      `,
      [name.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create item",
      details: error.message
    });
  }
});

async function startServer() {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Backend is running on port ${PORT}`);
      console.log(`Database host: ${process.env.DB_HOST}`);
      console.log(`Database name: ${process.env.DB_NAME}`);
      console.log(`App message: ${process.env.APP_MESSAGE}`);
    });
  } catch (error) {
    console.error("Backend failed to start:", error);
    process.exit(1);
  }
}

startServer();
