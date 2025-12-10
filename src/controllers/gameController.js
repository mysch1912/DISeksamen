
// src/controllers/gameController.js
const { sendPrizeSms } = require("../services/twilioService");
const fs = require("fs");
const path = require("path");

// === SINGLE SOURCE OF TRUTH: prize.json ===
const prizePath = path.join(__dirname, "..", "data", "prize.json");
const prizeConfig = JSON.parse(fs.readFileSync(prizePath, "utf-8"));

// DEBUG – kan fjernes når du er tryg
console.log("DEBUG prizeConfig =", prizeConfig);

// ren liste med præmienavne i samme rækkefølge som i prize.json
const PRIZES = Array.isArray(prizeConfig)
  ? prizeConfig.map((p) => p.name)
  : [];

// in-memory: hvornår en given bruger sidst har spinnet
// key = phone, value = dato-string "dd/mm/yyyy"
const lastSpinByPhone = {};

// helper: generer kuponkode
function generateCode() {
  return "UST-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// helper: dagens dato i dansk tid
function getDanishDateString() {
  return new Date().toLocaleDateString("da-DK", {
    timeZone: "Europe/Copenhagen",
  });
}

// helper: vægtet lodtrækning baseret på weight i prize.json
function drawWeightedPrizeIndex() {
  if (!Array.isArray(prizeConfig) || prizeConfig.length === 0) {
    return 0;
  }

  const weights = prizeConfig.map((p) =>
    typeof p.weight === "number" && p.weight > 0 ? p.weight : 1
  );
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let rnd = Math.random() * totalWeight;
  for (let i = 0; i < weights.length; i++) {
    if (rnd < weights[i]) {
      return i;
    }
    rnd -= weights[i];
  }

  // fallback hvis noget går galt med afrunding
  return weights.length - 1;
}

// === CONTROLLERS ===

// GET /game/prizes
// Frontend bruger denne til at tegne hjulet – ingen login påkrævet.
async function getPrizes(req, res) {
  try {
    return res.json(PRIZES);
  } catch (err) {
    console.error("Fejl i getPrizes:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /game/check
// Tjekker om brugeren må spinne i dag
async function checkSpin(req, res) {
  try {
    const user = req.session.user;

    if (!user || !user.phone) {
      return res
        .status(401)
        .json({ canSpin: false, error: "You are not logged in" });
    }

    const phone = user.phone;
    const today = getDanishDateString();

    if (lastSpinByPhone[phone] === today) {
      return res.json({
        canSpin: false,
        message:
          "You have used your spin for today – come back tomorrow! 🎡",
      });
    }

    return res.json({ canSpin: true });
  } catch (err) {
    console.error("Fejl i checkSpin:", err);
    return res
      .status(500)
      .json({ canSpin: false, error: "Server error" });
  }
}

// POST /game/spin
// Selve spin-ruten: vælg præmie, lås brugeren til i dag, send SMS
async function spinWheel(req, res) {
  try {
    const user = req.session.user;

    if (!user || !user.phone) {
      return res
        .status(401)
        .json({ success: false, error: "You are not logged in" });
    }

    const phone = user.phone;
    const today = getDanishDateString();

    // har allerede spinnet i dag?
    if (lastSpinByPhone[phone] === today) {
      return res.json({
        success: false,
        reason: "already_spun",
        message:
          "You have already used your spin for today – try again tomorrow! 🎡",
      });
    }

    // serveren vælger præmie baseret på prize.json
    const prizeIndex = drawWeightedPrizeIndex();
    const prize = PRIZES[prizeIndex];

    // lås dagens spin
    lastSpinByPhone[phone] = today;

    // generer kode + send sms
    const code = generateCode();
    await sendPrizeSms(phone, prize, code);

    return res.json({
      success: true,
      prize,
      code,
      prizeIndex,
    });
  } catch (err) {
    console.error("Fejl i spinWheel:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

module.exports = { spinWheel, checkSpin, getPrizes };


