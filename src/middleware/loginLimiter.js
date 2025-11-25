const rateLimit = require("express-rate-limit");

//rate limiting regler for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    handler: (req, res) => {
        console.log(`Rate limit hit for IP: ${req.ip}`);
        return res.status(429).json({
            success: false,
            message: "For mange login forsøg - prøv igen om 15 minutter.",
        });
    },
});

module.exports = loginLimiter;