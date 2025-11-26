//middleware/loginLimiter.js
const rateLimit = require("express-rate-limit");

//rate limiting regler for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10,

    //brugerens telefonnummer som nøgle
    keyGenerator: (req) => req.body?.phone || "unknown user",

    //tilpasset besked ved overskridelse af grænse
    handler: (req, res) => {
        const key = req.body?.phone || "unknown user";
        console.log(`Rate limit hit for nøgle: ${key}`);
        return res.status(429).json({
            success: false,
            message: "Too many login attempts - please try again in 15 minutes.",
        });
    },
});

module.exports = loginLimiter;