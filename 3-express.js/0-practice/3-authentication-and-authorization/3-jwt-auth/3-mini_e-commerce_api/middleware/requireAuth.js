const jwt = require('jsonwebtoken');
const pool = require('../db');

async function requireAuth(req, res, next) {
  try {
    // 1. Get Authorization headers 
    const authHeader = req.headers.authorization;

    // 2. edge case: No token present 
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      return res.status(401).json({
        error: 'Unauthorized. Token missing !'
      });
    }

    // 3. Extract token 
    const token = authHeader.split(' ')[1];

    // console.log(token);
    
    // 4. Verify token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decoded);

    // 5. fetch full user
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

    if (userCheck.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized. User not found!' });
    }    
    const user = userCheck.rows[0];

    // 6. Attach user to req.user
    req.user = {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    };


    // 7. pass control to next middleware 
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    })
  }  
}

module.exports = requireAuth;
