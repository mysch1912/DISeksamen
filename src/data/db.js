const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,  // 👈 RIGTIGT
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  ssl: { rejectUnauthorized: true } // Azure kræver SSL
});

module.exports = pool;
