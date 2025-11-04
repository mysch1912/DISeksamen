// src/controllers/gameController.js
const { sendPrizeSms } = require("../services/twilioService");

function generateCode() {
  return "UST-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

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

    const code = generateCode();
    await sendPrizeSms(user.phone, prize, code);

    return res.json({
      success: true,
      prize,
      code
    });
  } catch (err) {
    console.error("Fejl i spinWheel:", err);
    return res
      .status(500)
      .json({ success: false, error: "Serverfejl" });
  }
}

module.exports = { spinWheel };
