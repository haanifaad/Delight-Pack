const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Check cookies or Authorization header
  let token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(400).json({ error: 'Invalid token.' });
  }
};

const requireRole = (level) => {
  return (req, res, next) => {
    if (!req.user || req.user.role_level < level) {
      return res.status(403).json({ error: 'Forbidden. Insufficient role level.' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole
};
