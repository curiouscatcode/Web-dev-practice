const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'user_auth_db',
  password: 'amit4887',
  port: 5432,
});

module.exports = pool;