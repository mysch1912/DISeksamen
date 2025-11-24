const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST, // fx dis-app.database.windows.net
  port: 1433,                  // SQL Server standardport
  options: {
    encrypt: true,             // kræves til Azure SQL
    trustServerCertificate: false,
  },
};

// Én fælles pool-forbindelse til hele app’en
const poolPromise = sql
  .connect(config)
  .then((pool) => {
    console.log("Forbundet til Azure SQL Database");
    return pool;
  })
  .catch((err) => {
    console.error("Fejl ved forbindelse til Azure SQL:", err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};
