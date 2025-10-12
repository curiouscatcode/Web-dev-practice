const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/users.model.js");
const Workout = require("./models/workouts.model.js");

const authUser = require("./routes/users.routes.js");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to workout tracker API !");
});

// Users API
app.use("/api/users", authUser);

// name, type (Strength/Cardio/Flexibility), duration, difficulty(Easy/Medium/Hard)

// * `POST /api/workouts` → Add a workout
app.post("/workouts", async (req, res) => {
  const { name, type, duration, difficulty } = req.body;

  if (!name || !type || !duration) {
    return res.status(400).json({
      message: "All fields required !",
    });
  }
  if (
    difficulty !== "Easy" &&
    difficulty !== "Medium" &&
    difficulty !== "Hard"
  ) {
    return res.status(400).json({
      message: "difficulty should be either Easy, Medium or Hard !",
    });
  }
  try {
    const workout = await Workout.create(
      (req.body = {
        name: name,
        type: type,
        duration: duration,
        difficulty: difficulty,
      })
    );

    res.status(201).json({
      message: "Successfully created a workout !",
      workout: workout,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `GET /api/workouts` → Get all workouts (filter by type or difficulty)
app.get("/workouts", async (req, res) => {
  const { type, difficulty } = req.query;

  const filter = {};

  if (type) {
    filter.type = type;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }
  try {
    const workout = await Workout.find(filter);

    if (!workout) {
      return res.status(400).json({
        message: "No workout done yet !",
      });
    }

    res.status(200).json({
      message: "Here's the complete list of workouts done: ",
      workout: workout,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `GET /api/workouts/:id` → Get workout details
app.get("/workouts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const workout = await Workout.findById(id);

    if (!workout) {
      return res.status(400).json({
        message: `Workout with id: ${id} does not exists !`,
      });
    }

    res.status(200).json(workout);
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

// * `PATCH /api/workouts/:id` → Update workout
app.patch("/workouts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Workout.findByIdAndUpdate(id, req.body, {
      new: true,
      newValidator: true,
    });

    const updatedUser = await user.save();

    res.status(200).json({
      message: `User with id:${id} updated successfully !`,
      user: updatedUser,
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

// * `DELETE /api/workouts/:id` → Delete workout
app.delete("/workouts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Workout.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json({
        message: `No user with id:${id} exists !`,
      });
    }
    res.status(200).json({
      message: `Successfully deleted user with id:${id} !`,
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

mongoose
  .connect(
    "mongodb+srv://amitsuthar4887_db_user:302188oZVtZ9YW12@ab-cluster.xolxkxo.mongodb.net/Workout-tracker-API-practice?retryWrites=true&w=majority&appName=ab-cluster"
  )
  .then(() => {
    console.log("Connected to the db !");
    app.listen(PORT, () => {
      console.log(`Server is listening to the port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Connection failed !", err);
  });
