const express = require("express");
const Post = require("../models/posts.models.js");

const isPostOwner = async (req, res, next) => {
  // 1. Extract post by id
  const post = await Post.findById(req.params.id);
  // 2. edge case
  if (!post) {
    return res.status(404).json({
      error: "Post not found !",
    });
  }
  // 3. check access
  if (post.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      error: "Forbidden !",
    });
  }
  // 4. pass to next router
  next();
};

module.exports = isPostOwner;
