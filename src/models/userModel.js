const db = require("../data/db");

async function findUser(phone, password) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE phone = ? AND password = ?",
    [phone, password]
  );
  return rows[0];
}

async function createUser(phone, hashedPassword) {
  await db.query(
    "INSERT INTO users (phone, password) VALUES (?, ?)",
    [phone, hashedPassword]
  );
}

module.exports = {
  findUser,
  createUser
};
