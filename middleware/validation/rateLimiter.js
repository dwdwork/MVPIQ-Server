const { rateLimit } = require('express-rate-limit');

module.exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false, 
});

module.exports.authRateLimiter = rateLimit({
    windowMs: 3 * 60 * 60 * 1000, 
    max: 20, 
    standardHeaders: true,
    legacyHeaders: false,
});

