// src/routes/authRoute.js
const express = require("express");
const { login, logout } = require("../controllers/authController");
const { register } = require("../controllers/registerController");

const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.post("/register", register);

module.exports = router;
