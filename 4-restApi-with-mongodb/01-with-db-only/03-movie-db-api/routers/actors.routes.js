const express = require("express");
const Actor = require("../models/actors.model.js");

const router = express.Router();

// * `POST /actors` → Add actor
router.post("/", async (req, res) => {
  try {
    const actor = await Actor.create(req.body);

    res.status(201).json({
      message: "Successfully created this data in Actors db: ",
      data: actor,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        message: "req.body cannot be empty !",
        error: message,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `GET /actors` → List all actors
router.get("/", async (req, res) => {
  try {
    const allActors = await Actor.find();

    if (!allActors) {
      return res.status(400).json({
        message: "No actor exists !",
      });
    }

    res.status(200).json({
      message: "Here is the list of all actors: ",
      actors: allActors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

module.exports = router;
