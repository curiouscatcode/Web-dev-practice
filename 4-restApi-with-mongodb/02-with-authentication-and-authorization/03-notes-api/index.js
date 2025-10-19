require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const jwt = require("jsonwebtoken");

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to note API !");
});

// db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to db !");
    app.listen(PORT, () => {
      console.log(`Server is listening to the port:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Server error !", err);
  });
