// src/models/userModel.js
const { sql, poolPromise } = require("../data/db");

// find bruger ud fra telefon
async function findUserByPhone(phone) {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input("phone", sql.VarChar, phone)
    .query("SELECT * FROM users WHERE phone = @phone");

  return result.recordset[0];
}

// opret bruger
async function createUser(phone, hashedPassword) {
  const pool = await poolPromise;

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
