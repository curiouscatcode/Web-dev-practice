const User = require("../models/users.models.js");

const isUser = async (req, res, next) => {
  const { id } = req.params;
  // 1. Extract
  const user = await User.findById(id);

  // 2. check edge case
  if (!user) {
    return res.status(400).json({
      message: `No user with id:${id} exists !`,
    });
  }

  // 3. Check if the logged-in user is the same as the target user
  if (req.user._id.toString() !== id) {
    return res.status(403).json({
      message: "Forbidden. Only owner can modify the user details !",
    });
  }

  // 4. pass to next middleware
  next();
};

module.exports = isUser;
