const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.dis-app.database.windows.net,
  user: process.env.disproject,
  password: process.env.CBS2025PROJECT,
  database: process.env.dis-app,
  port: 3306,
  ssl: { rejectUnauthorized: true } // Azure kræver SSL
});

module.exports = pool;
