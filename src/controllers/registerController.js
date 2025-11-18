const bcrypt = require("bcrypt");
const { findByPhone, createUser } = require("../models/userModel");

exports.register = async (req, res) => {
  const { phone, password } = req.body;

  // Manglende felter
  if (!phone || !password) {
    return res.json({ status: "missing" });
  }

  // Find om bruger findes
  const exists = await findByPhone(phone);
  if (exists) {
    return res.json({ status: "exists" });
  }

  // Hash password 
  const hashed = await bcrypt.hash(password, 10);

  // Opret bruger i MySQL
  await createUser(phone, hashed);

  return res.json({ status: "ok" });
};
