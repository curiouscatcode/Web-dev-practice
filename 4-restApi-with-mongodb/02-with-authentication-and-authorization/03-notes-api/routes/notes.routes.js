const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const router = express.Router();

// db
const Notes = require("../models/notes.models.js");
// middleware
const requireAuth = require("../middleware/requireAuth.js");
const isNoteOwner = require("../middleware/isNoteOwner.js");

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

// * `GET /api/notes/:id` → get single note (only if owned)
router.get("/notes/:id", requireAuth, isNoteOwner, async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Notes.findById(id);
    if (!note || note.length === 0) {
      return res.status(400).json({
        message: `No note with id:${id} exists !`,
      });
    }
    res.status(200).json({
      message: `Here's the note you asked for: `,
      note: note,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid type of id:${id}`,
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `PUT /api/notes/:id` → update note (only if owned)
router.put("/notes/:id", requireAuth, isNoteOwner, async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Notes.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!note || note.length === 0) {
      return res.status(400).json({
        message: "note does not exists !",
      });
    }

    const updatedNote = await note.save();

    res.status(200).json({
      message: `Note with id:${id} updated successfully !`,
      updated: updatedNote,
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
