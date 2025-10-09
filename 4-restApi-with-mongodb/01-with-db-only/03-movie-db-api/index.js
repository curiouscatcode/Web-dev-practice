const express = require("express");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Movie Database API !");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the db !");
    app.listen(3000, () => {
      console.log(`Server is listening to ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("Connection failed !");
  });
