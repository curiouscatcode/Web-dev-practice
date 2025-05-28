const jwt = require('jsonwebtoken');
const pool = require('../db');

// New Middleware for 'put' command on only author can edit the post 
async function checkAuthor(req, res, next) {
  // 1. fetch post id : req.params 
  const id = parseInt(req.params.id);
  
  try {
    // 2. query user_id from the db
    const result = await pool.query(
      "SELECT user_id FROM posts WHERE id = $1",
      [id]
    );

    // 3. Check if post with given id exists or not 
    if(result.rows.length === 0){
      return res.status(400).json({
        error: `Post with id: ${id} does not exists !`
      });
    }

    // 4. Get logged-in user ID from JWT (added by requireAuth middleware)
    const loggedInUserId = req.user.id;

    // 5. Extract the author
    const postAuthorId = result.rows[0].user_id;

    // 6. compare
    if(postAuthorId !== loggedInUserId){
      return res.status(403).json({
        error: 'You are not authorized to modify this post.'
      });
    }  

    // 7. go Ahead 
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: 'Server error while checking author'
    });
  }
}

module.exports = checkAuthor;