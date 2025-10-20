const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const router = express.Router();

const Notes = require("../models/notes.models.js");
const requireAuth = require("../middleware/requireAuth.js");

// * `POST /api/notes` → create a note (only logged-in user)
router.post("/notes", requireAuth, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      message: "All fields required !",
    });
  }
  try {
    // Create a note
    const newNote = await Notes.create({
      title,
      content,
      createdBy: req.user._id,
    });
    // Response
    res.status(201).json({
      message: "Note added successfully !",
      note: newNote,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

module.exports = router;
