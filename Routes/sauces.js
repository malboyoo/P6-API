const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth.middleware.js");
const multer = require("../middleware/multer.middleware.js");
const controller = require("../controllers/sauces.controllers.js");

router.post("/", authToken, multer, controller.createSauce);
router.get("/", authToken, controller.getAllSauces);
router.get("/:id", authToken, controller.getSauce);
router.post("/:id/like", authToken, controller.addLikesDislikes);
router.delete("/:id", authToken, controller.deleteSauce);
router.put("/:id", authToken, multer, controller.modifySauce);

module.exports = router;
