require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Getting db
const User = require("../models/users.models.js");

// Get other middlewares
const requireAuth = require("../middleware/requireAuth.js");

// 1. `POST /register` → Register new user (hash password, store in DB).  (Signup)
router.post("/register", async (req, res) => {
  try {
    // 1. Extract body
    const { name, email, password } = req.body;
    // 2. edge case: if body is empty
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields required !",
      });
    }
    // 3. check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        error: "Email already exists !",
      });
    }
    // 4. Create new user
    const user = await User.create({
      name,
      email,
      password,
    });
    // 5. response
    res.status(201).json({
      message: "Successful !",
      user: user,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email and name should be unique !",
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// 2. `POST /login` → Authenticate user, return JWT.
router.post("/login", async (req, res) => {
  try {
    // 1. Extract the body
    const { email, password } = req.body;
    // 2. egde case:
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required !",
      });
    }
    // 3. find the user
    const user = await User.findOne({ email });
    // 4. edge case: No user exists (signup first)
    if (!user) {
      return res.status(400).json({
        message: "You don't have account ! First signup !",
      });
    }
    // 5. Compare the password
    const isMatch = await user.comparePassword(password);
    // 6. edge case: invalid credentials
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials !",
      });
    }
    // 7. sign the jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 8. respond
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        message: "Login Successful !",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
    });
  }
});

// 3. `POST /logout` → (Optional if using cookies, clear cookie).
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({
    message: "Logged Out !",
  });
});

// 4. `GET /me` → Get logged-in user profile (protected route).
router.get("/me", requireAuth, async (req, res) => {
  res.status(200).json({
    message: "Here is your profile !",
    user: req.user,
  });
});

module.exports = router;
