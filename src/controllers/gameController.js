// //controllers/gameController.js
// const { sendPrizeSms } = require("../services/twilioService");

// //holder styr på sidste spin pr. bruger i hukommelsen
// const lastSpinByPhone = {};

// //serveren bestemmer præmien, ikke frontend
// const PRIZES = [
//   "10% discount on a optional experience",
//   "Better luck next time",
//   "2 for 1 experience price",
//   "Too bad!",
//   "15% discount on a optional experience",
//   "Better luck next time",
//   "100 kr. discount on a optional experience",
//   "Too bad!"
// ];

// //hjælpefunktion til kuponkode
// function generateCode() {
//   return "UST-" + Math.random().toString(36).substring(2, 8).toUpperCase();
// }

// //dato i dansk tid
// function getDanishDateString() {
//   return new Date().toLocaleDateString("da-DK", {
//     timeZone: "Europe/Copenhagen",
//   });
// }

// //tjek om brugeren må spinne
// async function checkSpin(req, res) {
//   try {
//     const user = req.session.user;

//     if (!user || !user.phone) {
//       return res
//         .status(401)
//         .json({ canSpin: false, error: "You are not logged in" });
//     }

//     const phone = user.phone;
//     const today = getDanishDateString();

//     //tjekker om brugeren allerede har spinnet i dag
//     if (lastSpinByPhone[phone] === today) {
//       return res.json({
//         canSpin: false,
//         message:
//           "You have used your spin for today – come back tomorrow! 🎡🇩🇰",
//       });
//     }

//   //brugeren kan spinne
//   return res.json({ canSpin: true });

//   } catch (err) {
//     console.error("fejl i checkSpin:", err);
//     return res.status(500).json({ canSpin: false, error: "Server error" });
//   }
// }

// //selve spin ruten
// async function spinWheel(req, res) {
//   try {
//     const user = req.session.user;

//     if (!user || !user.phone) {
//       return res
//         .status(401)
//         .json({ success: false, error: "You are not logged in" });
//     }

//     const phone = user.phone;
//     const today = getDanishDateString();

//     //tjekker om brugeren allerede har spinnet i dag
//     if (lastSpinByPhone[phone] === today) {
//       return res.json({
//         success: false,
//         reason: "already_spun",
//         message: "You have already used your spin for today – try again tomorrow! 🎡"
//       });
//     }

//     //serveren vælger tilfældig præmie
//     const prize = PRIZES[Math.floor(Math.random() * PRIZES.length)];

//     //markerer at brugeren har spinnet i dag
//     lastSpinByPhone[phone] = today;

//     //sender SMS med præmie og kode
//     const code = generateCode();
//     await sendPrizeSms(phone, prize, code);

//     //sender præmie og kode tilbage til frontend
//     return res.json({
//       success: true,
//       prize,
//       code
//     });

//   } catch (err) {
//     console.error("Fejl i spinWheel:", err);
//     return res.status(500).json({ success: false, error: "Server error" });
//   }
// }

// module.exports = { spinWheel, checkSpin };
//controllers/gameController.js
const { sendPrizeSms } = require("../services/twilioService");

//holder styr på sidste spin pr. bruger i hukommelsen
const lastSpinByPhone = {};

//serveren bestemmer præmien, ikke frontend
const PRIZES = [
  "10% discount on a optional experience",
  "Better luck next time",
  "2 for 1 experience price",
  "Too bad!",
  "15% discount on a optional experience",
  "Better luck next time",
  "100 kr. discount on a optional experience",
  "Too bad!"
];

//hjælpefunktion til kuponkode
function generateCode() {
  return "UST-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

//dato i dansk tid
function getDanishDateString() {
  return new Date().toLocaleDateString("da-DK", {
    timeZone: "Europe/Copenhagen",
  });
}

//tjek om brugeren må spinne
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

    //tjekker om brugeren allerede har spinnet i dag
    if (lastSpinByPhone[phone] === today) {
      return res.json({
        canSpin: false,
        message:
          "You have used your spin for today – come back tomorrow! 🎡🇩🇰",
      });
    }

    //brugeren kan spinne
    return res.json({ canSpin: true });
  } catch (err) {
    console.error("fejl i checkSpin:", err);
    return res.status(500).json({ canSpin: false, error: "Server error" });
  }
}

//selve spin ruten
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

    //tjekker om brugeren allerede har spinnet i dag
    if (lastSpinByPhone[phone] === today) {
      return res.json({
        success: false,
        reason: "already_spun",
        message:
          "You have already used your spin for today – try again tomorrow! 🎡",
      });
    }

    // 👉 serveren vælger indeks OG præmie
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[prizeIndex];

    //markerer at brugeren har spinnet i dag
    lastSpinByPhone[phone] = today;

    //sender SMS med præmie og kode
    const code = generateCode();
    await sendPrizeSms(phone, prize, code);

    //sender præmie + kode + indeks tilbage til frontend
    return res.json({
      success: true,
      prize,
      code,
      prizeIndex, // <--- vigtigt
    });
  } catch (err) {
    console.error("Fejl i spinWheel:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

module.exports = { spinWheel, checkSpin };
