const jwt = require('jsonwebtoken');

// backend/src/middleware/authMiddleware.js
const auth = (requiredRole) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (requiredRole) {
        const roles = {
          admin: 3,
          manager: 2,
          staff: 1
        };
        
        if (!roles[decoded.role] || roles[decoded.role] < roles[requiredRole]) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }
      }
      
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};

module.exports = auth;