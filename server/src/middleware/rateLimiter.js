const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests per IP per minute
  message: { message: 'Too many requests, slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, publicLimiter };