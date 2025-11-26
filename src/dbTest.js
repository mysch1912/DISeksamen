require("dotenv").config({ override: true }); 
const { sql, poolPromise } = require("./data/db");

async function testConnection() {
  try {
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_USER:", process.env.DB_USER); 

    const pool = await poolPromise;
    const result = await pool.request().query("SELECT 1 + 1 AS result");
    console.log("DB virker! Result:", result.recordset[0].result);
  } catch (err) {
    console.error("Fejl ved DB forbindelse:", err);
  } finally {
    process.exit();
  }
}

testConnection();

