/*/ src/data/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  ssl: { rejectUnauthorized: false }, // fordi sslmode = REQUIRED hos DO
});

// Test forbindelsen én gang ved opstart
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Forbundet til MySQL database:", process.env.MYSQL_DB);
    connection.release();
  } catch (err) {
    console.error("Fejl ved databaseforbindelse:", err.message);
  }
})();

module.exports = pool;
*/