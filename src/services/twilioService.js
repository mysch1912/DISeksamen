const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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

module.exports = { sendSMS };

