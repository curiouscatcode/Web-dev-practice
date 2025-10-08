const express = require("express");
const User = require("../models/users.model.js");
/** @type {import('express').Router} */
/** @type {import('mongoose').Model} */

const router = express.Router();

// test route
router.get("/", async (req, res) => {
  try {
    //res.status(200).send("Welcome to book-store-user-api !");
    const allUsers = await User.find();

    res.status(200).json({
      users: allUsers,
    });
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

// 2. Get details of a user by ID.
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        message: `No user with id:${id} exists !`,
      });
    }

    res.status(200).json(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({
        message: "Invalid id !",
        error: err,
      });
    }
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// 3. Update user information by ID.
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      newValidator: true,
    });
    if (!user) {
      return res.status(404).json({
        message: `No user with id:${id} found !`,
      });
    }
    // re-checking from db
    const updatedUser = await User.findById(id);

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(404).json({
        message: "Invalid id !",
        error: err,
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Email id should be unique ! Given email already exists !",
        error: err,
      });
    }
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((e) => e.message);
      return res.status(422).json({
        message: "All required fields must be filled !",
        error: message,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

//  4. Delete a user by ID.

module.exports = router;
