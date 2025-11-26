//data/db.js
const sql = require("mssql");

//konfigurationsobjekt til Azure SQL Database
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST, 
  port: 1433, //SQL server standardport
  options: {
    encrypt: true, 
    trustServerCertificate: false,
  },
};

//en fælles pool forbindelse til hele appen
const poolPromise = sql
  //opretter forbindelse til Azure SQL Database
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
