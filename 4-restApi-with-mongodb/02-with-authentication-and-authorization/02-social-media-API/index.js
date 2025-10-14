require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const jwt = require("jsonwebtoken");

// Getting db
const User = require("./models/users.models.js");

// Get other middlewares
const requireAuth = require("./middleware/requireAuth.js");
const isPostOwner = require("./middleware/isPostOwner.js");

// Getting routes
const Auth = require("./routes/auth.routes.js");

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Social Media API !");
});

// Auth routes API
app.use("/api", Auth);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database !");
    app.listen(PORT, () => {
      console.log(`Server is listening to PORT: ${PORT} !`);
    });
  })
  .catch((err) => {
    console.error("Server error !", err);
  });
