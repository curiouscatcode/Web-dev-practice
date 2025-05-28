const jwt = require('jsonwebtoken');

// Middleware to protect routes 
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access token missing !');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token !');
 
    req.user = user; // Set user in request 
    next();
  })
}

// Optional: role based access 
function authorizeRole(role){
  return (req, res, next) => {
    if (req.user?.role !== role){
      return res.status(403).send('Access denied: insufficient permissions');
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };