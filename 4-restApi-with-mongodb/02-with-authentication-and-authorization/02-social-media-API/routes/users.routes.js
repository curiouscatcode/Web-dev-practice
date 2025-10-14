const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

// 1. `GET /` → Get all users (admin only, or limited info).
router.get("/users", requireAuth, checkAdmin, async (req, res) => {
  try {
    const allUsers = await User.find();

    if (!allUsers) {
      return res.status(400).json({
        message: "No users exists !",
      });
    }

    // response
    res.status(200).json({
      message: "Here is the list of all the users !",
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

// 2. `GET /:id` → Get user by ID.
router.get("/users/:id", requireAuth, checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        message: `No user with id:${id} exists !`,
      });
    }

    // repsonse
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

// 3. `PUT /:id` → Update user info (protected, self-only).
router.put("/users/:id", requireAuth, isUser, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      newValidator: true,
    });

    if (!user) {
      return res.status(400).json({
        message: `No user with id:${id} exists !`,
      });
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Successfully updated !",
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
      message: "Something went wrong !",
    });
  }
});

// 4. `DELETE /:id` → Delete account (protected, self-only).
router.delete("/users/:id", requireAuth, isUser, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(400).json({
        message: `User with id:${id} does not exists !`,
      });
    }

    res.status(200).json({
      message: `User with id:${id} deleted Successfully !`,
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
    });
  }
});

module.exports = router;
