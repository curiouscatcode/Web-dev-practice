const mongoose = require("mongoose");

const ReviewsSchema = mongoose.Schema(
  {
    movie: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movies",
      },
    ],
    reviewerName: {
      type: String,
      required: [true, "Reviewer name is must !"],
    },
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", ReviewsSchema);

module.exports = Review;
