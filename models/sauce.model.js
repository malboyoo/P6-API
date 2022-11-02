const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const sauceSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 40 },
  manufacturer: { type: String, required: true, maxlength: 40 },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, require: true, min: 1, max: 10 },
  likes: { type: Number, require: true },
  dislikes: { type: Number, require: true },
  usersLiked: { type: Array, require: true },
  usersDisliked: { type: Array, require: true },
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("sauces", sauceSchema);
