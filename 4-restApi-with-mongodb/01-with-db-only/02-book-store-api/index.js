const express = require("express");
const mongoose = require("mongoose");
/** @type {import('mongoose').Model} */

const authorRoute = require("./routers/authors.routes.js");
const usersRoute = require("./routers/users.routes.js");
const booksRoute = require("./routers/books.routes.js");

// Testing

const app = express();
app.use(express.json()); // middleware to parse JSON
app.use(express.urlencoded({ extended: false }));

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Welcome to Book store API with mongoDB !");
});

// --------------------------BOOKS-API-------------------------------------------------

app.use("/api/books", booksRoute);

// --------------------------Author-API---------------------------------------------------

app.use("/api/authors", authorRoute);

// --------------------------USERS-API----------------------------------------------------

app.use("/api/users", usersRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the db !");
    app.listen(5000, () => {
      console.log(`Server is listening to ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection failed !", err);
  });
