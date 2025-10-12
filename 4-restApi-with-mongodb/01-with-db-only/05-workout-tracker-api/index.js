const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/users.model.js");

const authUser = require("./routes/users.routes.js");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to workout tracker API !");
});

// Users API
app.use("/api/users", authUser);

mongoose
  .connect(
    "mongodb+srv://amitsuthar4887_db_user:302188oZVtZ9YW12@ab-cluster.xolxkxo.mongodb.net/Workout-tracker-API-practice?retryWrites=true&w=majority&appName=ab-cluster"
  )
  .then(() => {
    console.log("Connected to the db !");
    app.listen(PORT, () => {
      console.log(`Server is listening to the port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Connection failed !", err);
  });
