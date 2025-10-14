const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/users.models.js");

const requireAuth = async (req, res, next) => {
  try {
    // 1. Extract token from cookies
    const token = req.cookies.token;
    // 2. Edge case: No token exists
    if (!token) {
      return res.status(401).json({
        error: "Unauthorized.",
      });
    }

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. get user
    const user = await User.findById(decoded.userId);

    // 5. edge case: no user exists with such id !
    if (!user) {
      return res.status(401).json({
        error: "User not found !",
      });
    }
    // 6. get user
    req.user = user;

    // 7. pass to next middleware
    next();
  } catch (err) {
    res.status(401).json({
      error: "Invalid token !",
    });
  }
};

module.exports = requireAuth;
