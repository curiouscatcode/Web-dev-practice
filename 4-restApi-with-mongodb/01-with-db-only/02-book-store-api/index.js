const express = require("express");
const mongoose = require("mongoose");
/** @type {import('mongoose').Model} */
const Book = require("./models/books.model.cjs");

const Author = require("./models/author.model.js");

const authorRoute = require("./routers/authors.routes.js");

// Testing

const app = express();
app.use(express.json()); // middleware to parse JSON
app.use(express.urlencoded({ extended: false }));

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Welcome to Book store API with mongoDB !");
});

// -------------------------------------BOOKS_API-------------------------------------------------

// 1. List all books.
app.get("/api/books", async (req, res) => {
  try {
    const allBooks = await Book.find();

    if (allBooks.length === 0) {
      res.status(400).json({
        message: "No books available !",
      });
    }

    res.status(200).json(allBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong !",
    });
  }
});

// 2. Get details of a single book by ID.
app.get("/api/books/:id", async (req, res) => {
  // extract the id
  const { id } = req.params;
  try {
    // find book
    const book = await Book.findById(id);

    // edge case
    if (!book) {
      return res.status(404).json({
        message: `Book with id:${id} not found`,
      });
    }

    // return
    res.status(200).json({
      message: "Here's the book: ",
      book: book,
    });
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(500).json({
        message: `Invalid id:${id} type`,
      });
    }

    res.status(500).json({
      Manual_message: "Something went wrong !",
      error: err,
    });
  }
});

// 3. Add a new book
app.post("/api/books", async (req, res) => {
  try {
    console.log(req.body);

    const newBook = await Book.create(req.body);

    res.status(201).send(newBook);
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      // collect missing field
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(422).json({
        message: "All required filleds must be filled !",
        error: messages,
      });
    }

    res.status(500).json({
      error: "Server error ! Something went wrong !",
    });
  }
});

//  4. A. Update an existing book by ID: PATCH
app.patch("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!book) {
      return res.status(404).json({
        message: "NO BOOk FOUND !",
      });
    }

    res.status(202).json({
      message: "Here's the updated data: ",
      book: book,
    });
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(500).json({
        message: `Invalid id:${id} object !`,
      });
    }

    res.status(500).json({
      Manual_message: "Something went wrong !",
      err: err,
    });
  }
});

//  4. B. Update an existing book by ID: PUT
app.put("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(400).json({
        error: `No book with id:${id} exists !`,
      });
    }

    // edge case 2: checking required fields
    if (!req.body.title || !req.body.author || !req.body.price) {
      return res.status(400).json({
        message: "Required fields are must !",
      });
    }

    // Get the fields data : both required and optional
    book.title = req.body.title;
    book.author = req.body.author;
    book.price = req.body.price;

    if (req.body.genre !== undefined) {
      book.genre = req.body.genre;
    }
    if (req.body.inStock !== undefined) {
      book.inStock = req.body.inStock;
    }

    // Save it and run validators '
    const updatedBook = await book.save();

    // response
    res.status(200).json({
      message: "Book updated successfully!",
      book: updatedBook,
    });
  } catch (err) {
    // console.error(err);
    // Invalid 'id'
    if (err.name === "CastError") {
      return res.status(400).json({ message: `Invalid ID format: ${id}` });
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ message: "Validation failed", errors: messages });
    }

    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

//  5. Delete a book by ID.
app.delete("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        message: `Book with id:${id} not found !`,
      });
    }

    res.status(200).json({
      message: `Book with id:${id} deleted successfully !`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong !",
    });
  }
});

// --------------------------Author-API---------------------------------------------------

app.use("/api/authors", authorRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the db !");
    app.listen(5000, () => {
      console.log(`Server is listening to ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("Connection failed !");
  });
