//original
//routes/gameRoute.js
/*
const express = require("express");
const { spinWheel, checkSpin } = require("../controllers/gameController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

//tjek først om brugeren må spinne i dag
router.get("/check", requireAuth, checkSpin);
//selve spin routen, som sender SMS osv.
router.post("/spin", requireAuth, spinWheel);

module.exports = router;
*/

// src/routes/gameRoute.js
const express = require("express");
const { spinWheel, checkSpin, getPrizes } = require("../controllers/gameController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/prizes", getPrizes);
router.get("/check", requireAuth, checkSpin);
router.post("/spin", requireAuth, spinWheel);

module.exports = router;


