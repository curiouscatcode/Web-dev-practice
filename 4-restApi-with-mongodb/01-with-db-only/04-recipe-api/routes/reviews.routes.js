const express = require("express");
const Review = require("../models/reviews.model.js");

const router = require("express").Router({ mergeParams: true });

// `POST /api/recipes/:id/reviews` → Add review for a recipe
router.post("/", async (req, res) => {
  const { id: recipeId } = req.params;
  const { user, rating, comment } = req.body;
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Rating should be in range: [1,5] !",
    });
  }
  try {
    const newReview = await Review.create({
      recipe: recipeId,
      user: user,
      rating,
      comment,
    });

    res.status(201).json({
      message: "comment successfully added !",
      review: newReview,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid RecipeId: ${id} type !`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// GET /api/recipes/:id/reviews` → Get all reviews of a recipe
router.get("/", async (req, res) => {
  const { id: recipeId } = req.params;
  try {
    const review = await Review.find({ recipe: recipeId });

    if (review.length === 0) {
      return res.status(400).json({
        message: "No reviews !",
      });
    }

    res.status(200).json({
      message: "All reviews: ",
      review: review,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid recipeId:${id} !`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

module.exports = router;
