const Sauce = require("../models/sauce.model.js");
const fs = require("fs");
const PORT = 3000;
const path = require("path");

///////// ADD SAUCE /////////
exports.createSauce = (req, res, next) => {
  const reqSauce = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...reqSauce,
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

///////// Likes and Dislikes SAUCE /////////
exports.addLikesDislikes = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.body.like == 1) {
        sauce.usersLiked.push(req.auth.userId);
        sauce.likes++;
      } else if (req.body.like == -1) {
        sauce.usersDisliked.push(req.auth.userId);
        sauce.dislikes++;
      } else if (req.body.like == 0) {
        // likes
        if (sauce.usersLiked.includes(req.auth.userId)) {
          const index = sauce.usersLiked.indexOf(req.body.userId);
          sauce.usersLiked.splice(index, 1);
          sauce.likes--;
          // dislikes
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

///////// DELETE SAUCE /////////
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (sauce.userId === req.auth.userId) {
      sauce
        .deleteOne()
        .then((sauce) => {
          // supprime l'image de la sauce supprimée dans la database.
          deleteFile(sauce.imageUrl);
          res.status(200).send({ message: "Sauce deleted successfully" });
        })
        .catch((err) => res.status(400).send({ message: err }));
    } else {
      res.status(401).send({ message: "You are not the Author of this Sauce." });
    }
  });
};

///////// MODIFY SAUCE /////////
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://localhost:${PORT}/images/${req.file.filename}`,
      }
    : {
        ...req.body,
      };

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId === req.auth.userId) {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => {
            // supprime l'ancienne image du répertoire si une nouvelle image est uploadé.
            if (req.file) {
              deleteFile(sauce.imageUrl);
            }
            res.status(200).send({ message: "Sauce updated." });
          })
          .catch((err) => res.status(401).send({ err }));
      } else {
        res.status(401).send({ message: "You are not the owner of this sauce." });
      }
    })
    .catch((err) => res.status(400).send({ err }));
};

// supprime le fichier passé en argument
const deleteFile = (imgPath) => {
  const fullPath = path.join("public", "images", path.basename(imgPath));
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("old data removed:", fullPath);
    }
  });
};
