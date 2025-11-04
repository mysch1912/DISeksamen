// src/controllers/gameController.js
const { sendPrizeSms } = require("../services/twilioService");

// midlertidig "database" i hukommelse: phone -> dato-string
const lastSpinByPhone = {};

// Hjælpefunktion til kuponkode
function generateCode() {
  return "UST-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Hjælpefunktion til at få dagens dato i dansk tid
function getDanishDateString() {
  return new Date().toLocaleDateString("da-DK", {
    timeZone: "Europe/Copenhagen",
  });
}

// 🔹 NY FUNKTION: Bruges til at tjekke, om brugeren MÅ spinne i dag
async function checkSpin(req, res) {
  try {
    const user = req.session.user;

    if (!user || !user.phone) {
      return res
        .status(401)
        .json({ canSpin: false, error: "Ikke logget ind" });
    }

    const phone = user.phone;
    const today = getDanishDateString();

    // Har brugeren allerede spinnet i dag?
    if (lastSpinByPhone[phone] === today) {
      return res.json({
        canSpin: false,
        message:
          "Du har brugt dit spin for i dag, kom tilbage i morgen! 🇩🇰🎡",
      });
    }

    // Må gerne spinne
    return res.json({ canSpin: true });
  } catch (err) {
    console.error("Fejl i checkSpin:", err);
    return res
      .status(500)
      .json({ canSpin: false, error: "Serverfejl" });
  }
}

// 🔹 EKSISTERENDE: selve spin + SMS + opdatering af lastSpinByPhone
async function spinWheel(req, res) {
  try {
    const { prize } = req.body;
    const user = req.session.user;

    if (!user || !user.phone) {
      return res
        .status(401)
        .json({ success: false, error: "Ikke logget ind" });
    }

    if (!prize) {
      return res
        .status(400)
        .json({ success: false, error: "Ingen præmie angivet" });
    }

    const phone = user.phone;
    const today = getDanishDateString(); // fx "04.11.2025"

    // Tjek om brugeren allerede har spinnet i dag (sikkerhedslag nr. 2)
    if (lastSpinByPhone[phone] === today) {
      return res.json({
        success: false,
        reason: "already_spun",
        message:
          "Du har brugt dit spin for i dag, kom tilbage i morgen! 🇩🇰🎡",
      });
    }

    // Opdater sidste spin til dagsdato
    lastSpinByPhone[phone] = today;

    // Generér kuponkode og send SMS
    const code = generateCode();
    await sendPrizeSms(phone, prize, code);

    return res.json({
      success: true,
      prize,
      code,
    });
  } catch (err) {
    console.error("Fejl i spinWheel:", err);
    return res
      .status(500)
      .json({ success: false, error: "Serverfejl" });
  }
}

// 🔹 VIGTIGT: Eksportér BEGGE funktioner
module.exports = { spinWheel, checkSpin };
