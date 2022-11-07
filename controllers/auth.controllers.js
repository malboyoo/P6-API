const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const secretKey = require("../config/auth.config");
const passwordSchema = require("../models/passwordValidator.model.js");
const CryptoJS = require("crypto-js");

exports.createUser = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    const user = new User({
      email: hashedEmail(req.body.email, secretKey),
      password: bcrypt.hashSync(req.body.password),
    });
    user
      .save()
      .then(() => res.status(201).send({ message: "User was registered successfully." }))
      .catch((err) => res.status(400).send({ message: err }));
  } else {
    res.status(401).send({ message: "password not valid." });
  }
};

////////// LOGIN //////////

exports.isUserExist = (req, res, next) => {
  User.findOne({ email: hashedEmail(req.body.email, secretKey) })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "User not found." });
        return;
      }
      next();
    })
    .catch((error) => res.status(500).send({ message: error }));
};

// encode un token grace à l'userId et la clé secrète d'encodage
const tokenAndId = (user) => {
  const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: 86400 }); //24h
  return {
    userId: user._id,
    token,
  };
};

// vérifie que le mot de passe utilisateur est égal à celui dans la database(crypté)
exports.passwordCheck = (req, res, next) => {
  User.findOne({ email: hashedEmail(req.body.email, secretKey) })
    .then((user) => {
      const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
      if (!isPasswordValid) {
        res.status(401).send({ message: "Invalid password." });
        return;
      }
      res.status(200).send(tokenAndId(user));
    })
    .catch((error) => res.status(500).send({ message: error }));
};

// on chiffre l'email avant de le créer/comparer dans la base de données
const hashedEmail = (email, secretKey) => {
  return CryptoJS.HmacSHA256(email, secretKey.secret).toString();
};
