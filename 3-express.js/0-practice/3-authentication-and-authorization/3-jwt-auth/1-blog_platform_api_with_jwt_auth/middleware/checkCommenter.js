const pool = require('../db');

async function checkCommenter(req, res, next) {
  try {
    // 1. fetch post id: req.params
    const commentId = parseInt(req.params.id);
    
    // 2. query user_id from the db
    const result = await pool.query(
      "SELECT user_id FROM comments WHERE id = $1",
      [commentId]
    );
    if(result.rows.length === 0){
      return res.status(404).json({
        error: `Comment with id: ${commentId} does not exist.`
      });
    }

    // 3. compare user_id
    const commentAuthorId = result.rows[0].user_id;
    const loggedInUserId = req.user.id;

    if(commentAuthorId !== loggedInUserId){
      return res.status(403).json({
        error: 'You are not the author of this comment.'
      });
    }

    // GoAhead 
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error'
    });
  }
}

module.exports = checkCommenter;