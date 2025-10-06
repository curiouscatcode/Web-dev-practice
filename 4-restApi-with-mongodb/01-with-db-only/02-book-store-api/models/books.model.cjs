const mongoose = require("mongoose");

const BookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter book title !"],
    },
    author: {
      type: String,
      required: [true, "Author name cannot be empty"],
      // Later this will "ObjectId" pointing the authors table
    },
    genre: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    inStock: {
      type: Number,
      required: true,
      default: 0,
    },
    publishedData: {
      type: Date,
    },
  },
  {
    timeStamps: true,
  }
);

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
