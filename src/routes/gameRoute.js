// src/routes/gameRoute.js
const express = require("express");
const { spinWheel, checkSpin } = require("../controllers/gameController");

const router = express.Router();

// Tjek først om brugeren må spinne i dag
router.get("/check", checkSpin);

// Selve spin-routen, som sender SMS osv.
router.post("/spin", spinWheel);

module.exports = router;
