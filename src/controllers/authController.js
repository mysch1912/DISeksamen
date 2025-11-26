//controllers/authController.js
const { findUserByPhone } = require("../models/userModel");
const bcrypt = require("bcrypt");

//login funktion 
async function login(req, res) {
  
  //henter telefon og password fra body
  const body = req.body || {};
  const phone = body.phone;
  const password = body.password;

  //hvis der mangler felter retuneres beskeden
  if (!phone || !password) {
    return res.send("Phone number and password are required");
  }

  //find bruger kun på nummer 
  const user = await findUserByPhone(phone);

  if (!user) {
    return res.send("Invalid phone number or password");
  }

  //sammenligner password med hashed password i DB
  const match = await bcrypt.compare(password, user.password);
  console.log("Login password match:", match); //test password match

  //ved intet match retuner besked 
  if (!match) {
    return res.send("Invalid phone number or password");
  }

  //password korrekt
  req.session.user = { phone: user.phone };

  //redirecter til wheel siden
  return res.redirect("/wheel");
}

//logout funktion
function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = { login, logout };
