require("dotenv").config({ path: "../.env", override: true });
const { sendSMS } = require("./services/twilioService");

async function run() {
  try {
    console.log("Sender SMS test...");

    await sendSMS(
      "+4530705510", 
      "Test fra din DIS-app – Twilio virker!"
    );

    console.log("SMS sendt!");
  } catch (err) {
    console.error("Fejl:", err);
  }
}

run();
