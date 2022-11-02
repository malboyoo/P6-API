const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

module.exports = (req, res, next) => {
  try {
    // on récupère le token encodé
    const token = req.headers.authorization.split(" ")[1];
    // on le décode grace à la clé secrète
    const decodedToken = jwt.verify(token, config.secret);
    //on stock l'userId dans la requête pour les étapes suivante
    req.auth = {
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    res.status(403).send({ message: error });
  }
};
