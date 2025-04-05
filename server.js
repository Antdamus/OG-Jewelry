// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres',     // change this
  host: 'localhost',
  database: 'og_jewelry',
  password: "@Sql2093", // change this
  port: 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to handle form submission
app.post('/api/register', async (req, res) => {
  const { username, password, firstName, lastName, email, phone, zipCode } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (username, password, first_name, last_name, email, phone, zip_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [username, password, firstName, lastName, email, phone || null, zipCode || null]
    );

    res.status(201).json({ message: 'User registered', userId: result.rows[0].id });
  } catch (err) {
    console.error('Error inserting into database:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
