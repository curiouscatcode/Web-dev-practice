const checkAdmin = async (req, res, next) => {
  try {
    // 1. Extract the user
    const user = req.user;

    // 2. edge case: User does not exists
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized !",
      });
    }

    // 3. check if admin or not
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden. Admins Only",
      });
    }

    // 4. pass to next middleware
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something wrong with middleware !",
      error: err,
    });
  }
};

module.exports = checkAdmin;
