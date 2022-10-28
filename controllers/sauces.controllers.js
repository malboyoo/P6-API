const Sauce = require("../models/sauce.model.js");
const dbConfig = require("../config/db.config.js");
const PORT = 3000;

///////// ADD SAUCE /////////

exports.createSauce = (req, res, next) => {
  const reqSauce = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    name: reqSauce.name,
    manufacturer: reqSauce.manufacturer,
    description: reqSauce.description,
    mainPepper: reqSauce.mainPepper,
    heat: reqSauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://localhost:${PORT}/images/${req.file.filename}`,
  });
  sauce
    .save()
    .then(() => res.status(201).send({ message: "Sauce sucessfully created." }))
    .catch((err) => res.status(400).send({ message: err }));
};

///////// ALL SAUCES /////////

exports.getAllSauces = (req, res, next) => {
  Sauce.find({})
    .exec()
    .then((sauces) => {
      res.status(200).send(JSON.stringify(sauces));
    })
    .catch((err) => res.status(400).send({ err }));
};

///////// SAUCE (detailed page) /////////

exports.getSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .exec()
    .then((sauce) => {
      res.status(200).send(JSON.stringify(sauce));
    })
    .catch((err) => res.status(400).send({ message: err }));
};

exports.addLikesDislikes = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .exec()
    .then((sauce) => {
      if (req.body.like == 1) {
        sauce.usersLiked.push(req.auth.userId);
        sauce.likes++;
      } else if (req.body.like == -1) {
        sauce.usersDisliked.push(req.auth.userId);
        sauce.dislikes++;
      } else if (req.body.like == 0) {
        //likes
        if (sauce.usersLiked.includes(req.auth.userId)) {
          const index = sauce.usersLiked.indexOf(req.body.userId);
          sauce.usersLiked.splice(index, 1);
          sauce.likes--;
          //dislikes
        } else if (sauce.usersDisliked.includes(req.auth.userId)) {
          const index = sauce.usersDisliked.indexOf(req.body.userId);
          sauce.usersDisliked.splice(index, 1);
          sauce.dislikes--;
        }
      }
      sauce.save();
    })
    .then(() => res.status(200).send({ message: "change successfully save" }))
    .catch((err) => res.status(400).send({ message: err }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .exec()
    .then((sauce) => {
      if (sauce.userId === req.auth.userId) {
        sauce.deleteOne();
      } else {
        res.status(401).send({ message: "You are not the Author of this Sauce." });
      }
    })
    .then(() => res.status(200).send({ message: "Sauce deleted successfully" }))
    .catch((err) => res.status(400).send({ message: err }));
};

exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .exec()
    .then((sauce) => {
      if (sauce.userId === req.auth.userId) {
        const reqSauce = JSON.parse(req.body.sauce);
        sauce.set({
          ...reqSauce,
          imageUrl: `${req.protocol}://localhost:${PORT}/images/${req.file.filename}`,
        });
        sauce.save();
      } else {
        res.status(401).send({ message: "You are not the owner of this Sauce." });
      }
    })
    .then(() => res.status(200).send({ message: "change successfully save" }))
    .catch((err) => res.status(400).send({ message: err }));
};
