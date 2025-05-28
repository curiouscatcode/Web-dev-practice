const pool = require('../db');

async function checkAdmin(req, res, next) {
  try {
    // getting user object 
    const user = req.user;
    // condition
    if(!user || user.is_admin !== true){
      return res.status(403).json({
        error: 'Unauthorized. Only Admin can add products !'
      });
    }  
    // pass it forward
    next(); 
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
}

module.exports = checkAdmin;