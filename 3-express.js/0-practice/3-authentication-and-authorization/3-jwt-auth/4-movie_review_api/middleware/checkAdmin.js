async function checkAdmin(req, res, next) {
  try {
    // 1. get the user object 
    const user = req.user;
    // console.log(user);

    // 2. if condition to check admin 
    if(!user || user.role !== 'admin'){
      return res.status(403).json({
        error: 'Unauthorized. You are not the admin ! Only admins can post movies !'
      });
    }

    // pass the control 
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server Error !'
    });
  }  
}

module.exports = checkAdmin;