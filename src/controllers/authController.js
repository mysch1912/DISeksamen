const { findUser } = require("../models/userModel");

async function login(req, res) {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.send("Telefon og password er påkrævet");
  }

  const user = await findUser(phone, password);

  if (!user) {
    return res.send("Forkert telefonnummer eller password");
  }

  req.session.user = { phone: user.phone };

  return res.redirect("/wheel");
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = { login, logout };
