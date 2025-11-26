//routes/authRoute.js
const express = require("express");
const { login, logout } = require("../controllers/authController");
const { register } = require("../controllers/registerController");
const loginLimiter = require("../middleware/loginLimiter");

const router = express.Router();

//login route med rate limiting
router.post("/login", loginLimiter, login);
//logout route
router.get("/logout", logout);
//register route
router.post("/register", register);

module.exports = router;
