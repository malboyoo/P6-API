const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, require: true },
  likes: { type: Number, require: true },
  dislikes: { type: Number, require: true },
  usersLiked: { type: Array, require: true },
  usersDisliked: { type: Array, require: true },
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("sauces", sauceSchema);
