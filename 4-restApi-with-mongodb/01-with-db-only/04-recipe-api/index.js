const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Recipe API !");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the DB !");
    app.listen(5000, () => {
      console.log(`Server is listening on the port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection Failed !", err);
  });
