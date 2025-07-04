const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
function requireAuth(req, res, next) {
  try {
    // 1. Get Authorization header 
    const authHeader = req.headers.authorization;

    // 2. Edge case: No token present 
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      return res.status(401).json({
        error: 'Unauthorized. Token missing !'
      });
    }

    // 3. extract token 
    const token = authHeader.split(' ')[1];
    
    // 4. Verify token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach userId to request for future use 
    req.user = { id: decoded.userId };

    // 6. pass control to next middleware or route 
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      error: 'Unauthorized. Invalid token !'
    })
  }
}

module.exports = requireAuth;
