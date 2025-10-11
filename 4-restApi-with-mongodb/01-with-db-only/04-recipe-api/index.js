const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/users.model.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Recipe API !");
});

// * `POST /api/users/signup` → Create a new user
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("Name, email and password are required !");
  }

  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      message: "Users created successfully !",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// GET /api/users/me` → Get user info
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      message: "Here's the list of all users: ",
      users: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// * `PATCH /api/users/:id` → Update profile
app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidator: true,
    });

    if (!user) {
      return res.status(400).json({
        message: `No user with id:${id} exists !`,
      });
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: `Here is the updated version of user with id: ${id}: `,
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the DB !");
    app.listen(5000, () => {
      console.log(`Server is listening on the port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection Failed !", err);
  });
