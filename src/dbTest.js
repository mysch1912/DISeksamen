// src/dbTest.js
require("dotenv").config();
const db = require("./data/db");

(async () => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("✅ DB test OK! 1+1 =", rows[0].result);
  } catch (err) {
    console.error("❌ DB test FEJLEDE:");
    console.error(err);
  } finally {
    process.exit();
  }
})();
