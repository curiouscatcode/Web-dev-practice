require('dotenv').config();
const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool ({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// test the db connection 
pool.query("SELECT NOW()", (err,res) => {
  if(err) console.error("Database connection error ", err);
  else console.log("Database connected at: ", res.rows[0].now);
});

module.exports = pool;