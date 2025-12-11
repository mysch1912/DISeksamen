// src/routes/gameRoute.js
const express = require("express");
const { spinWheel, checkSpin, getPrizes } = require("../controllers/gameController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/prizes", getPrizes);
router.get("/check", requireAuth, checkSpin);
router.post("/spin", requireAuth, spinWheel);

module.exports = router;


