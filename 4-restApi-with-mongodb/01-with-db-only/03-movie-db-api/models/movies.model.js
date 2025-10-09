const mongoose = require("mongoose");

const MovieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Enter the movie name"],
    },
    description: {
      type: String,
    },
    releaseYear: {
      type: Number,
    },
    genre: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    director: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Directors",
      },
    ],
    actors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actors",
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

const Movies = mongoose.model("Movies", MovieSchema);

module.exports = Movies;
