// src/routes/authRoute.js
const express = require("express");
const { login, logout } = require("../controllers/authController");
const { register } = require("../controllers/registerController");

const router = express.Router();

// LOGIN
router.post("/login", login);

// LOGOUT
router.get("/logout", logout);

// REGISTER (nyt endpoint)
router.post("/register", register);

module.exports = router;
