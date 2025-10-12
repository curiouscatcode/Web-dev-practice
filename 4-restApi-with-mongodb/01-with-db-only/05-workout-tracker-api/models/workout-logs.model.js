const mongoose = require("mongoose");

const WorkoutLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reps: {
      type: Number,
    },
    set: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutLog = mongoose.model("WorkoutLog", WorkoutLogSchema);

module.exports = WorkoutLog;
