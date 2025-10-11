const mongoose = require("mongoose");

const IngredientsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter ingredient name !"],
      unique: true,
    },
    unit: {
      type: String,
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

const Ingredients = mongoose.model("ingredients", IngredientsSchema);

module.exports = Ingredients;
