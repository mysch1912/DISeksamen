const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// GENEREL SMS-FUNKTION (bruges til test og interne beskeder)
async function sendSMS(to, message) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_FROM_NUMBER,
      to: to
    });

    console.log("SMS sendt:", result.sid);
    return result;

  } catch (err) {
    console.error("Fejl ved SMS:", err);
    throw err;
  }
}

// PRÆMIE-SMS (bruges af gameController)
async function sendPrizeSms(phone, prize, code) {
  const message = `Tillykke! Du vandt: ${prize}\nDin kode: ${code}\nBrug den i dag 🌟`;
  return sendSMS("+45" + phone, message);
}

module.exports = { sendSMS, sendPrizeSms };

