const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const isPostOwner = require("../middleware/isPostOwner");

const Post = require("../models/posts.models.js");

// 1. `POST /` → Create a post (protected).
router.post("/", requireAuth, async (req, res) => {
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
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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
router.put("/:id", requireAuth, isPostOwner, async (req, res) => {
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

// 5. `DELETE /:id` → Delete post (owner only).
router.delete("/:id", requireAuth, isPostOwner, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(400).json({
        message: `No post with id:${id} exists !`,
      });
    }

    res.status(200).json({
      message: `Post with id:${id} deleted successfully !`,
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

// 7. `GET /user/:id` → Get all posts by a specific user.
router.get("/user/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.find({ createdBy: id });

    if (!post || post.length === 0) {
      return res.status(400).json({
        message: `No post by user with id:${id} !`,
      });
    }

    res.status(200).json({
      message: `Here are all the posts by user with id:${id} !`,
      posts: post,
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

module.exports = router;
