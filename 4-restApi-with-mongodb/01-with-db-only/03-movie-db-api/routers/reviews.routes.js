const express = require("express");
const Review = require("../models/reviews.model");

const router = express.Router();

// * `GET /movies/:id/reviews` → Get reviews of a movie
router.get("/movies/:id/reviews", async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.find({ movie: id });

    if (!review) {
      return res.status(400).json({
        message: "No review for this movie ! Be first to add a review !",
      });
    }

    res.status(200).json({
      message: "Here are all the reviews of this movie: ",
      reviews: review,
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

// * `POST /movies/:id/reviews` → Add review to a movie
router.post("/movies/:id/reviews", async (req, res) => {
  const { id } = req.params;
  const { reviewerName, comment, rating } = req.body;

  if (rating < 0 || rating > 5) {
    return res.status(400).json({
      message: "Rating must be in range: (0,5]",
    });
  }

  try {
    const newReview = await Review.create({
      movie: [id],
      reviewerName,
      comment,
      rating,
    });

    const savedReview = newReview.save();

    res.status(201).json({
      message: "Review added successfully!",
      review: savedReview,
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
