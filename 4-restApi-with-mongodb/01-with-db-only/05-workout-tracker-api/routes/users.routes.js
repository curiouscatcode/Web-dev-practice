const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/users.model.js");

const router = express.Router();

//  * `POST /api/users` → Add a user
router.post("/", async (req, res) => {
  const { name, email, age, height, weight } = req.body;

  if (!name || !email || !age || !height || !weight) {
    return res.status(400).json({
      message: "All fields required !",
    });
  }
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      message: "Successfully created user !",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email must be unique !",
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went error !",
      error: err,
    });
  }
});

// * `GET /api/users` → Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({
        message: "No users exists !",
      });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

//  * `GET /api/users/:id` → Get a user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        message: `No user with id:${id} exists !`,
      });
    }

    res.status(200).json({
      message: `Here's the user with id:${id}: `,
      user: user,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} type !`,
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `PATCH /api/users/:id` → Update user info
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidator: true,
    });

    if (!user) {
      return res.status(400).json({
        message: `No user with id:${id} exists !`,
        error: err,
      });
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Here's the updatedUser: ",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} type !`,
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong ! ",
      error: err,
    });
  }
});

// * `DELETE /api/users/:id` → Delete a user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json({
        message: `No user with id:${id} !`,
      });
    }
    res.status(200).json({
      message: `Successfully deleted user with id:${id} !`,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} type !`,
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
