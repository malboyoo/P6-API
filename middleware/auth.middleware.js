const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

module.exports = (req, res, next) => {
  try {
    // on récupère le token encodé
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secret);
    req.auth = {
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    res.status(401).send({ message: error });
  }
};
