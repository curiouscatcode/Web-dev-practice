const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const Actor = require("./models/actors.model");
// const Director = require("./models/directors.model.js");
// const Movie = require("./models/movies.model.js");
// const Review = require("./models/reviews.model.js");
/** @type {import('mongoose').Model} */

const authActor = require("./routers/actors.routes.js");
const authDirector = require("./routers/directors.routes.js");
const authMovie = require("./routers/movies.routes.js");
const authReview = require("./routers/reviews.routes.js");

const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();

// Actors api
app.use("/api/actors", authActor);
// Directors API
app.use("/api/directors", authDirector);
// Movie API
app.use("/api/movies", authMovie);
// Review API
app.use("/api/", authReview);

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
