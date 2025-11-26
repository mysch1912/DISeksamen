//services/twilioService.js
const twilio = require("twilio");

//opsætning af Twilio klient
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

//generel SMS funktion (bruges til test og interne beskeder)
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
    console.error("fejl ved SMS:", err);
    throw err;
  }
}

//præmie SMS funktion
async function sendPrizeSms(phone, prize, code) {
  const message = `Congratulations! You won: ${prize}\nYour code: ${code}\nUse it today 🌟`;
  return sendSMS("+45" + phone, message);
}

module.exports = { sendSMS, sendPrizeSms };

