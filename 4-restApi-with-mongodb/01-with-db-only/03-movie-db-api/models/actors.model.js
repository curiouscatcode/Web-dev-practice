const mongoose = require("mongoose");

const ActorsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter actor name !"],
    },
    dateOfBirth: {
      type: Date,
    },
    Bio: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Actors = mongoose.model("Actors", ActorsSchema);

module.exports = Actors;
