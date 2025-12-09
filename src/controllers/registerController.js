//controllers/registerController.js
const bcrypt = require("bcrypt");
const {createUser, findUserByPhone } = require("../models/userModel");

//register funktion
exports.register = async (req, res) => {
  const { phone, password } = req.body;

  //tjek for manglende felter
  if (!phone || !password) {
    return res.json({ status: "missing" });
  }

  //tjekker om bruger findes
  const exists = await findUserByPhone(phone);
  if (exists) {
    return res.json({ status: "exists" });
  }

  //hash password 
  const hashed = await bcrypt.hash(password, 10);
  console.log("Register hashed password:", hashed); //test hashed password

  //opretter bruger i MySQL 
  await createUser(phone, hashed);

  req.session.user = { phone };
  return res.json({ status: "ok" });
};
