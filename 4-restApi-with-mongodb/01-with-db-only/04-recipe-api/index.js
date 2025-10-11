const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/users.model.js");
const Recipe = require("./models/recipes.model.js");

const authUser = require("./routes/users.routes.js");
const authRecipe = require("./routes/recipes.routes.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

require("dotenv").config();

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Recipe API !");
});

// Users API
app.use("/api/users", authUser);
app.use("/api/recipes", authRecipe);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the DB !");
    app.listen(PORT, () => {
      console.log(`Server is listening on the port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection Failed !", err);
  });
