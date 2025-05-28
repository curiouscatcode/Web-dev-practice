const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  try {
    // 1. Get Authorization Header 
    const authHeader = req.headers.authorization;

    // console.log('authHeader', authHeader);
    // 2. Edge case: No token present 
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      return res.status(401).json({
        error: 'Unauthorized. Token missing !'
      });
    }

    // 3. Extract token 
    const token = authHeader.split(' ')[1];
    // console.log('token', token);

    // 4. Verify token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    // 5. Attach userId to request for future use 
    req.user = { 
      id: decoded.userId ,
      role: decoded.role
    };
    // console.log(req.user);
  
    // 6. Pass the control to next middleware 
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Unauthorized. Invalid token !'
    });
  }  
}

module.exports = requireAuth;