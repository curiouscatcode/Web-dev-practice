const express = require("express");
const Comment = require("../models/comments.models.js");

const isCommentOwner = async (req, res, next) => {
  const { id } = req.params;
  // 1. Extract post by id
  const comment = await Comment.findById(id);
  // 2. edge case
  if (!comment) {
    return res.status(404).json({
      error: "comment not found !",
    });
  }
  // 3. check access
  if (comment.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      error: "Forbidden !",
    });
  }
  // 4. pass to next router
  next();
};

module.exports = isCommentOwner;
