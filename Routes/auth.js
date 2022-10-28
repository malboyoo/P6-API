const express = require("express");
const controller = require("../controllers/auth.controllers.js");

const router = express.Router();

///////// SIGN UP /////////

router.post("/signup", controller.checkEmail, controller.createUser);

////////// LOGIN //////////

router.post("/login", controller.isUserExist, controller.passwordCheck);

module.exports = router;
