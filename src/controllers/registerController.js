// src/controllers/registerController.js
const fs = require("fs");
const path = require("path");

const userFile = path.join(__dirname, "../data/users.json");

let users = [];

// Indlæs brugere hvis fil findes
if (fs.existsSync(userFile)) {
  users = JSON.parse(fs.readFileSync(userFile));
}

exports.register = (req, res) => {
  const { phone, password } = req.body;

  // Hvis felter mangler
  if (!phone || !password) {
    return res.json({ status: "missing" });
  }

  // Tjek om telefon allerede findes
  const exists = users.find(u => u.phone === phone);
  if (exists) {
    return res.json({ status: "exists" });
  }

  // Opret ny bruger
  users.push({ phone, password });

  // Gem til fil
  fs.writeFileSync(userFile, JSON.stringify(users, null, 2));

  return res.json({ status: "ok" });
};
