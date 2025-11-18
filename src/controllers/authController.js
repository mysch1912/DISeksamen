// src/controllers/authController.js
console.log("BRUGER DENNE FIL:", __filename);

const fs = require("fs");
const path = require("path");

const userFile = path.join(__dirname, "../data/users.json");
let users = [];

if (fs.existsSync(userFile)) {
  users = JSON.parse(fs.readFileSync(userFile));
}

function login(req, res) {
  // ✔ HENT TELEFON OG PASSWORD FRA FORM
  const { phone, password } = req.body;

  // ✔ FELTVALIDERING
  if (!phone || !password) {
    return res.send("Telefon og password er påkrævet");
  }

  // ✔ FIND BRUGER I users.json
  const user = users.find(u => u.phone === phone && u.password === password);

  if (!user) {
    return res.send("Forkert telefonnummer eller password");
  }

  // ✔ GEM SESSION
  req.session.user = { phone };

  // ✔ REDIRECT
  return res.redirect("/wheel");
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = { login, logout };
