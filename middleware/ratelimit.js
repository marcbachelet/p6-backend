const rateLimit = require("express-rate-limit").default;

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Veuillez réessayer dans 5 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
