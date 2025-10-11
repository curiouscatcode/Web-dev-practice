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
