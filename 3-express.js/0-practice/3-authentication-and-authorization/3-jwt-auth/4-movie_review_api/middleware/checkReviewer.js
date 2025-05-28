const pool = require('../db');

async function checkReviewer(req, res, next) {
  try {
    // 1. get loggedInUserId
    const loggedInUserId = req.user.id;
    const reviewId = req.params.id;

    // 2. Get the review from the database 
    const reviewResult = await pool.query(
      "SELECT user_id FROM reviews WHERE id = $1",
      [reviewId]
    );

    // 3. If review not found 
    if(reviewResult.rows.length === 0){
      return res.status(404).json({
        error: `Review with id: ${reviewId} does not exists !`
      });
    }

    const reviewerId = reviewResult.rows[0].user_id;

    // 4. Check if the logged in user is the reviewer 
    if(loggedInUserId !== reviewerId){
      return res.status(403).json({
        error: 'Access denied: Not your review'
      });
    }

    // 5. move on if authorized
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
}

module.exports = checkReviewer;