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

// * `GET /api/notes` → get all notes of logged-in user
router.get("/notes", requireAuth, async (req, res) => {
  try {
    const notes = await Notes.find();
    if (!notes || notes.length === 0) {
      return res.status(400).json({
        message: `No notes exists !`,
      });
    }
    res.status(200).json({
      message: "Here's the list is on notes: ",
      notes: notes,
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
