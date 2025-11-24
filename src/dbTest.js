require("dotenv").config();       // .env ligger i src/
const pool = require("./data/db");

async function testConnection() {
  try {
    console.log("DB_HOST:", process.env.DB_HOST); // debug
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("DB virker! Result:", rows[0].result);
  } catch (err) {
    console.error("Fejl ved DB-forbindelse:", err);
  } finally {
    process.exit();
  }
}

testConnection();
