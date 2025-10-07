const express = require("express");
const Author = require("../models/author.model.js");
const mongoose = require("mongoose");

const router = express.Router();

//  3. Add a new author.
router.post("/", async (req, res) => {
  try {
    const newAuthor = await Author.create(req.body);

    res.status(200).json(newAuthor);
  } catch (err) {
    console.error(err);

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

//  1. List all authors.
router.get("/", async (req, res) => {
  res.status(200).send("Author api working !");
});

//  2. Get details of a single author by ID.
router.get("/:id", async (req, res) => {});

//  4. Update an existing author by ID.
router.patch("/:id", async (req, res) => {});

//  5. Delete an author by ID.
router.delete("/:id", async (req, res) => {});

module.exports = router;
