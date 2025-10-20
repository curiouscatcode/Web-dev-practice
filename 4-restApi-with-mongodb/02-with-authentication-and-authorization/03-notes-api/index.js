require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const jwt = require("jsonwebtoken");

const User = require("./models/users.models.js");

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
const requireAuth = require("./middleware/requireAuth.js");

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to note API !");
});

// Signup
app.post("/signup", async (req, res) => {
  try {
    // 1. extract data and edge case 01
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields required !",
      });
    }
    // 2. check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        error: "Email already exists !",
      });
    }
    // 3. create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    // 4. response
    res.status(201).json({
      message: "Successfully registered !",
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(401).json({
        message: "Email should be unique !",
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
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
