const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limite l'ip à 100 requêtes maximum pour 15 mins
  standardHeaders: true, // retourne le rate limit info dans le `RateLimit-*` headers
  legacyHeaders: false, // désactive `X-RateLimit-*` headers
});

// on exporte le middleware
module.exports = limiter;
