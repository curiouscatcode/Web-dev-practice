const express = require("express");
const mongoose = require("mongoose");

const WorkoutLog = require("../models/workout-logs.model");

const router = express.Router();

// * `POST /api/logs` → Add workout log for a user
router.post("/", async (req, res) => {
  try {
    const { user, workout, date, reps, set, duration, notes } = req.body;

    const workoutDoc = await Workout.findById(workout);
    if (!workoutDoc) {
      return res.status(400).json({
        message: "Invalid workout id !",
      });
    }
    if (workoutDoc.type === "Strength") {
      if (!reps || !set) {
        return res.status(400).json({
          message: "Strength workout requires reps and set !",
        });
      }

      if (duration) {
        return res.status(400).json({
          message: "Strength workout cannot have duration !",
        });
      }
    }
    if (workoutDoc.type === "Cardio" || workoutDoc.type === "Flexibility") {
      if (!duration) {
        return res.status(400).json({
          message: "Cardio/Flexibility workout requires duration !",
        });
      }

      if (reps || set) {
        return res.status(400).json({
          message: "Cardio/Flexibility workout does not requires reps or set !",
        });
      }
    }

    const log = await WorkoutLog.create({
      user,
      workout,
      date,
      reps,
      set,
      duration,
      notes,
    });

    res.status(201).json({
      message: "Successfully created workout log !",
      log: log,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `GET /api/logs/user/:userId` → Get all logs for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const log = await WorkoutLog.find({ user: userId });

    if (!log || log.length === 0) {
      return res.status(400).json({
        message: `No logs exist for userId: ${userId} !`,
      });
    }

    res.status(200).json(log);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${userId} type !`,
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong",
      error: err,
    });
  }
});

// * `GET /api/logs/workout/:workoutId` → Get all logs for a workout
router.get("/workout/:workoutId", async (req, res) => {
  const { workoutId } = req.params;
  try {
    const log = await WorkoutLog.find({ workout: workoutId });

    if (!log || log.length === 0) {
      return res.status(400).json({
        message: `No logs exist for workoutId: ${workoutId} !`,
      });
    }

    res.status(200).json(log);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${workoutId} type !`,
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong",
      error: err,
    });
  }
});

// * `PATCH /api/logs/:id` → Update log
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const log = await WorkoutLog.findByIdAndUpdate(id, req.body, {
      new: true,
      newValidator: true,
    });

    if (!log) {
      return res.status(400).json({
        message: `No log with id:${id} exists !`,
      });
    }

    res.status(200).json(log);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} type !`,
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong",
      error: err,
    });
  }
});

// * `DELETE /api/logs/:id` → Delete log
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const log = await WorkoutLog.findByIdAndDelete(id);
    if (!log) {
      return res.status(400).json({
        message: `No log with id:${id}`,
      });
    }
    res.status(200).json({
      message: "Successfully deleted the log !",
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} type !`,
        error: err,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

module.exports = router;
