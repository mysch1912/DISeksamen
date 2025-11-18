const { findUserByPhone } = require("../models/userModel");
const bcrypt = require("bcrypt");

async function login(req, res) {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.send("Telefon og password er påkrævet");
  }

  //virker ik når password er hashed - slet
  //const user = await findUser(phone, password);

  //find bruger kun på nummer 
  const user = await findUserByPhone(phone);

  if (!user) {
    return res.send("Forkert telefonnummer eller password");
  }

  //sammenligner password med hashed password i db
  const match = await bcrypt.compare(password, user.password);

  //hvis ik matcher retuner besked 
  if (!match){
    return res.send("Forkert telefonnummer eller password")
  }

  //password korrekt
  req.session.user = { phone: user.phone };

  return res.redirect("/wheel");
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = { login, logout };
