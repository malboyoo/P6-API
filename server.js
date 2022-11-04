const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const dbConfig = require("./config/db.config.js");

// import des routes
const auth = require("./routes/auth.js");
const sauces = require("./routes/sauces.js");

// création de l'app express
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
// récuperer l'information avec le "Content-Type: application/json" sans utiliser JSON.parse()
app.use(express.json());
// récuperer l'information avec le "Content-Type: application/x-www-form-urlencoded" (paramètre dans l'URL)
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

// écoute des requêtes lié à l'authentification
app.use("/api/auth", auth);

// écoute des requêtes lié au sauces
app.use("/api/sauces", sauces);

// PORT
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
