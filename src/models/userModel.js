//models/userModel.js
const { sql, poolPromise } = require("../data/db");

//finder bruger ud fra telefonnummer
async function findUserByPhone(phone) {
  const pool = await poolPromise;

  //udfører query
  const result = await pool
    .request()
    .input("phone", sql.VarChar, phone)
    .query("SELECT * FROM users WHERE phone = @phone");

  return result.recordset[0];
}

//opretter bruger i databasen
async function createUser(phone, hashedPassword) {
  const pool = await poolPromise;

  //udfører insert query
  await pool
    .request()
    .input("phone", sql.VarChar, phone)
    .input("password", sql.VarChar, hashedPassword)
    .query(
      "INSERT INTO users (phone, password) VALUES (@phone, @password)"
    );
}

module.exports = {
  findUserByPhone,
  createUser,
};
