const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter name please !"],
    },
    age: {
      type: Number,
    },
    country: {
      type: String,
    },
    booksWritten: {
      type: Number,
      default: 0,
    },
  },
  {
    timeStamps: true,
  }
);

const Author = mongoose.model("Author", AuthorSchema);

module.exports = Author;
