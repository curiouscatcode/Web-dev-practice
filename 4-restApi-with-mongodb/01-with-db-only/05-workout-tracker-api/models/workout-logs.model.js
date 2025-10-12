const mongoose = require("mongoose");

const WorkoutLogSchema = mongoose.Schema(
  {
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    workouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
    ],
    date: {
      type: Date,
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
