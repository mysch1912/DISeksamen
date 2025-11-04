// src/services/twilioService.js
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendPrizeSms(toPhone, prize, code) {
  return client.messages.create({
    to: toPhone,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `Tillykke! Du vandt: ${prize}. Din kode er: ${code}`
  });
}

module.exports = { sendPrizeSms };
