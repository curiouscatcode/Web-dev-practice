const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const isCommentOwner = require("../middleware/isCommentOwner.js");

const Comment = require("../models/comments.models.js");

// 1. `POST /:postId` → Add comment on a post (protected).
router.post("/:postId", requireAuth, async (req, res) => {
  const { postId } = req.params; // from parameter
  const { content } = req.body; // From body
  const userId = req.user._id; // from requireAuth (loggedin)

  if (!content) {
    return res.status(400).json({
      message: "Content cannot be empty !",
    });
  }
  try {
    const comment = await Comment.create({
      content,
      createdBy: userId,
      post: postId,
    });

    res.status(201).json({
      message: "Comment successfully added !",
      comment: comment,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid type of id:${id} !`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// 2. `GET /:postId` → Get all comments for a post.
router.get("/:postId", requireAuth, async (req, res) => {
  const { postId } = req.params;
  try {
    const comment = await Comment.find({ post: postId });

    if (!comment || comment.length === 0) {
      return res.status(400).json({
        message: `No comment under post with id:${postId}`,
      });
    }

    res.status(200).json({
      message: "Here are all the comments under the post: ",
      comments: comment,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid type of id:${postId} !`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// 3. `PUT /:id` → Update comment (owner only).
router.put("/:id", requireAuth, isCommentOwner, async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!comment || comment.length === 0) {
      return res.status(400).json({
        message: `No comment with id:${id} exists !`,
      });
    }

    const updatedComment = await comment.save();

    res.status(200).json({
      message: `Comment with id:${id} updated successfully !`,
      comment: updatedComment,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid type of id:${id}`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

// 4. `DELETE /:id` → Delete comment (owner only).
router.delete("/:id", requireAuth, isCommentOwner, async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment || comment.length === 0) {
      return res.status(400).json({
        message: `No comment with id:${id} exists !`,
      });
    }

    res.status(200).json({
      message: `Comment with id:${id} deleted successfully !`,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({
        message: `Invalid type of id:${id} !`,
      });
    }
    res.status(500).json({
      message: "Something went wrong !",
      error: err,
    });
  }
});

module.exports = router;
