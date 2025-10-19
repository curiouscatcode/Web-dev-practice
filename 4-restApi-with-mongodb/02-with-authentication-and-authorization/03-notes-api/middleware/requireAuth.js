const jwt = require("jsonwebtoken");
const User = require("../models/users.models.js");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: "User not found !",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Invalid token !",
      error: err,
    });
  }
};

module.exports = requireAuth;
