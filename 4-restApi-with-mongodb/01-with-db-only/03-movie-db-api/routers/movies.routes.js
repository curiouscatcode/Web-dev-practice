const express = require("express");
const Movie = require("../models/movies.model");

const router = express.Router();

// * `GET /movies` → List all movies
router.get("/", async (req, res) => {
  try {
    const allMovies = await Movie.find();

    if (!allMovies) {
      return res.status(400).json({
        message: "No movie exists !",
      });
    }

    res.status(200).json({
      message: "Here's the list of all movies: ",
      movies: allMovies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `POST /movies` → Add a new movie
router.post("/movies", async (req, res) => {
  const { title, description, releaseYear, genre, director, actors, rating } =
    req.body;

  if (
    (!title, !director, !description, !actors, !releaseYear, !genre, !rating)
  ) {
    return res.status(400).json({
      message: "All fields required !",
    });
  }
  if (rating < 0 || rating > 10) {
    res.status(400).send("Rating has to be in range [0,10]");
  }
  try {
    const newMovie = await Movie.create(req.body);

    res.status(201).json(newMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `GET /movies/:id` → Get movie details (populate director & actors)
router.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(400).json({
        message: `No movie with id:${id} exists !`,
      });
    }

    res.status(200).json(movie);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} !`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `PATCH /movies/:id` → Update movie info
router.patch("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidator: true,
    });

    if (!movie) {
      return res.status(400).json({
        message: `No movie with id:${id} exists !`,
      });
    }

    res.status(200).json({
      message: "Here's the updated version: ",
      movie: movie,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} !`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `DELETE /movies/:id` → Delete a movie
router.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(400).json({
        message: `No movie with id:${id} exists !`,
      });
    }

    res.status(200).json({
      message: `Movie with id:${id} deleted successfully !`,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} !`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

module.exports = router;
