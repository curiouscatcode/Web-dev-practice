const express = require("express");
const User = require("../models/users.model.js");
/** @type {import('mongoose').Model} */

const router = express.Router();

// test route
router.get("/", async (req, res) => {
  try {
    res.status(200).send("Welcome to book-store-user-api !");
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// 1. Register a new user.
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((e) => e.message);
      return res.status(422).json({
        message: "All required fields must be filled !",
        error: message,
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Email id should be unique ! Given email already exists !",
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

module.exports = router;
