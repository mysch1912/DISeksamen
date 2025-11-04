// src/routes/gameRoute.js
const express = require("express");
const { spinWheel } = require("../controllers/gameController");

const router = express.Router();

router.post("/spin", spinWheel);

module.exports = router;
