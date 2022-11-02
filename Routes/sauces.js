const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth.middleware.js");
const multer = require("../middleware/multer.middleware.js");
const controller = require("../controllers/sauces.controllers.js");

// le middleware multer récuperer l'information avec le type-application Form-data et permet notamment de récuperer des fichiers

///////// ADD SAUCE /////////
router.post("/", authToken, multer, controller.createSauce);
///////// ALL SAUCES /////////
router.get("/", authToken, controller.getAllSauces);
///////// SAUCE /////////
router.get("/:id", authToken, controller.getSauce);
///////// LIKES - DISLIKES /////////
router.post("/:id/like", authToken, controller.addLikesDislikes);
///////// DELETE SAUCE /////////
router.delete("/:id", authToken, controller.deleteSauce);
///////// MODIFY SAUCE /////////
router.put("/:id", authToken, multer, controller.modifySauce);

module.exports = router;
