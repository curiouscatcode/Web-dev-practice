const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Actor = require("./models/actors.model");
/** @type {import('mongoose').Model} */

const authActor = require("./routers/actors.routes.js");

const app = express();
app.use(express.json());
app.use(cors());

// Actors api
app.use("/api/actors", authActor);

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
  .catch((err) => {
    console.error(err);
    console.log("Connection failed !");
  });
