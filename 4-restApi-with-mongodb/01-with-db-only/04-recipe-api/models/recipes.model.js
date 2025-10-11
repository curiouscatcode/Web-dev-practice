const mongoose = require("mongoose");

const RecipesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is must !"],
    },
    description: {
      type: String,
    },
    cuisine: {
      type: String,
    },
    ingredients: [
      {
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
        quantity: Number,
        unit: String,
      },
    ],
    steps: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 1,
      max: 10,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Recipes = mongoose.model("Recipes", RecipesSchema);

module.exports = Recipes;
