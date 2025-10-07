const express = require("express");
const Author = require("../models/author.model.js");
/** @type {import('mongoose').Model} */

const router = express.Router();

//  1. List all authors.
router.get("/", async (req, res) => {
  try {
    const author = await Author.find();

    if (!author) {
      return res.status(400).json({
        message: "No author exists !",
      });
    }

    res.status(200).json(author);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

//  2. Get details of a single author by ID.
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const author = await Author.findById(id);

    if (!author) {
      return res.status(400).json({
        message: `No author with id:${id} exists !`,
      });
    }

    res.status(200).json(author);
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid id type",
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

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

//  4. Update an existing author by ID.
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAuthor) {
      return res.status(400).json({
        message: `No author with id:${id} exists !`,
      });
    }

    res.status(202).json({
      message: "Here's the updated data: ",
      author: updatedAuthor,
    });
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(404).json({
        message: "Invalid id !",
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

//  5. Delete an author by ID.
router.delete("/:id", async (req, res) => {});

module.exports = router;
