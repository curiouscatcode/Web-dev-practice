const express = require("express");
const Director = require("../models/directors.model.js");

const router = express.Router();

// * `GET /directors` → List all directors
router.get("/", async (req, res) => {
  try {
    const allDirectors = await Director.find();

    if (!allDirectors) {
      return res.status(400).json({
        message: "No data exists !",
      });
    }

    res.status(200).json({
      message: "here is the list of all the directors in db: ",
      allDirectors: allDirectors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `POST /directors` → Add director
router.post("/", async (req, res) => {
  const { name, dateOfBirth, bio } = req.body;

  if (!name || !dateOfBirth || !bio) {
    return res.status(400).json({
      message: "All fields required !",
    });
  }

  try {
    const newDirector = await Director.create(req.body);

    res.status(201).json(newDirector);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

module.exports = router;
