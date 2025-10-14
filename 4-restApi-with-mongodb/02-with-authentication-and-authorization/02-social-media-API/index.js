require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const jwt = require("jsonwebtoken");

// Getting db
const User = require("./models/users.models.js");
const Post = require("./models/posts.models.js");

// Get other middlewares
const requireAuth = require("./middleware/requireAuth.js");
const isPostOwner = require("./middleware/isPostOwner.js");
const checkAdmin = require("./middleware/checkAdmin.js");
const isUser = require("./middleware/isUser.js");

// Getting routes
const Auth = require("./routes/auth.routes.js");
const authUser = require("./routes/users.routes.js");

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

// Test: Check admin dashboard !
app.get("/admin-dashboard", requireAuth, checkAdmin, (req, res) => {
  res.send("Welcome Admin!");
});

// 1. `POST /` → Create a post (protected).
app.post("/post", requireAuth, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({
      message: "Content cannot be empty !",
    });
  }
  try {
    // Create a post
    const newPost = await Post.create({
      content,
      createdBy: req.user._id,
    });

    // response
    res.status(201).json({
      message: "Post successfully created !",
      post: newPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// 2. `GET /` → Get all posts (maybe public).
app.get("/posts", async (req, res) => {
  try {
    const allPosts = await Post.find();

    if (!allPosts) {
      return res.status(400).json({
        message: "No post exists !",
      });
    }

    res.status(200).json({
      message: "Here is the all posts: ",
      posts: allPosts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !",
    });
  }
});

// 3. `GET /:id` → Get single post.
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).json({
        message: `No post with id:${id} exists !`,
      });
    }
    res.status(200).json({
      message: "Here's the post: ",
      post: post,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid id:${id} type !`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// 4. `PUT /:id` → Update post (owner only).
app.put("/post/:id", requireAuth, isPostOwner, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(400).json({
        message: `No post with id:${id} exists !`,
      });
    }

    const updatedUser = await post.save();

    res.status(200).json({
      message: "Updated successfully !",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid Post_owner id:${id} type !`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
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
