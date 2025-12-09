const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // max 10 requests per minute
  message: { error: "Too many requests. Try again later." }
});

module.exports = authLimiter;