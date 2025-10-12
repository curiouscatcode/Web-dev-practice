const mongoose = require("mongoose");

const WorkoutSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "enter the name !"],
    },
    type: {
      type: String,
      required: true,
      enum: ["Strength", "Cardio", "Flexibility"],
    },
    duration: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;
