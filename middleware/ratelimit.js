const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  msg: "veuillez réessayer dans 15 minutes",
});

module.exports = limiter;
