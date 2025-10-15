require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const jwt = require("jsonwebtoken");

// Getting db
// const User = require("./models/users.models.js");
// const Post = require("./models/posts.models.js");
// const Comment = require("./models/comments.models.js");

// Get other middlewares
const requireAuth = require("./middleware/requireAuth.js");
const isPostOwner = require("./middleware/isPostOwner.js");
const checkAdmin = require("./middleware/checkAdmin.js");
const isUser = require("./middleware/isUser.js");
const isCommentOwner = require("./middleware/isCommentOwner.js");

// Getting routes
const Auth = require("./routes/auth.routes.js");
const authUser = require("./routes/users.routes.js");
const authPost = require("./routes/posts.routes.js");
const authComment = require("./routes/comments.routes.js");

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const PORT = process.env.PORT || 5000;

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Social Media API !");
});

// Auth routes API
app.use("/api", Auth);

// User routes API
app.use("/api", authUser);

// Post routes API
app.use("/api/post", authPost);

// Comment routes API
app.use("/api/comments", authComment);

// Test: Check admin dashboard !
app.get("/admin-dashboard", requireAuth, checkAdmin, (req, res) => {
  res.send("Welcome Admin!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database !");
    app.listen(PORT, () => {
      console.log(`Server is listening to PORT: ${PORT} !`);
    });
  })
  .catch((err) => {
    console.error("Server error !", err);
  });
