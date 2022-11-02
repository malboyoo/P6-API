const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const cors = require("cors");
const dbConfig = require("./config/db.config.js");

//import des routes
const auth = require("./routes/auth.js");
const sauces = require("./routes/sauces.js");

//création de l'app express
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// connexion à la database
mongoose
  .connect(`mongodb+srv://${dbConfig.USER}:${dbConfig.PWD}@${dbConfig.ADDRESS}/${dbConfig.DB}`)
  .then(() => {
    console.log("connected to mongoDB.");
  })
  .catch((err) => {
    console.log("impossible to connect to mongoDB:", err);
  });

//ecoute des requêtes lié à l'authentification
app.use("/api/auth", auth);

//ecoute des requêtes lié au sauces
app.use("/api/sauces", sauces);

// PORT
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
