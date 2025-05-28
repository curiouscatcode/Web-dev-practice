const pool = require('../db');

async function checkCommenter(req, res, next) {
  try {
    // 1. req.params extract query 
    const commentId = parseInt(req.params.id);

    // 2. query DB to get user_id of that post 
    const result = await pool.query(
      "SELECT user_id FROM comments WHERE id = $1",
      [commentId]
    );

    // 3. Check if post exists 
    if(result.rows.length === 0){
      return res.status(404).json({
        error: 'Comment not found !'
      });
    }

    // 4. Compare post's user_id with logged-in userID (req.user.id)
    const commenterId = result.rows[0].user_id;
    const loggedInUserId = req.user.id;

    if(commenterId !== loggedInUserId){
      return res.status(403).json({
        error: 'You are not the author of this post '
      });
    }

    // 5. If all checks pass, allow request to continue
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
}

module.exports = checkCommenter;