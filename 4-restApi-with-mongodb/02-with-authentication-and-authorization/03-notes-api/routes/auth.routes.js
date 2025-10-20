require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/users.models.js");

// Signup
router.post("/signup", async (req, res) => {
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

// Login
router.post("/login", async (req, res) => {
  try {
    // 1. extract body
    const { email, password } = req.body;
    // 2. edge case 01: Checking if input is there or not
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required !",
      });
    }
    // 3. find that one user
    const user = await User.findOne({ email });
    // 4. edge case 02: User not signup !
    if (!user) {
      return res.status(400).json({
        message: "First signup ! User is not registered !",
      });
    }
    // 5. check match  and edge case 03
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials !",
      });
    }
    // 6. make token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    // 7. respond
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        message: "LogIn Successful !",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
    });
  }
});

module.exports = router;
