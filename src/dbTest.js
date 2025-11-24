// i app.js eller en test-route
const pool = require("./data/db");

app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.send(`DB virker! Result: ${rows[0].result}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Fejl ved DB-forbindelse");
  }
});