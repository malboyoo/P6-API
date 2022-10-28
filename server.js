const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const cors = require("cors");
const dbConfig = require("./config/db.config.js");

//import des Routes
const auth = require("./Routes/auth.js");
const sauces = require("./Routes/sauces.js");

const app = express();

// MIDDLEWARE

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(morgan("tiny"));

// connection à la database
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
