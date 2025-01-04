// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (requiredRole) => {
  return (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (requiredRole && !hasPermission(decoded.role, requiredRole)) {
        throw new Error();
      }
      
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Please authenticate' });
    }
  };
};

const hasPermission = (userRole, requiredRole) => {
  const roles = {
    admin: 3,
    manager: 2,
    staff: 1
  };
  return roles[userRole] >= roles[requiredRole];
};

module.exports = auth;