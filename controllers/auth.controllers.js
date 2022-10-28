const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

///////// SIGN UP /////////

exports.checkEmail = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        res.status(400).send({ message: "This email is already registered." });
        return;
      }
      next();
    });
};

exports.createUser = (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });
  user
    .save()
    .then(() => res.status(201).send({ message: "User was registered successfully." }))
    .catch((err) => res.status(400).send({ message: err }));
};

////////// LOGIN //////////

exports.isUserExist = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "User not found." });
        return;
      }
      next();
    })
    .catch((error) => res.status(500).send({ message: error }));
};
const tokenAndId = (user) => {
  const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: 86400 }); //24h
  return {
    userId: user._id,
    token,
  };
};

exports.passwordCheck = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
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
