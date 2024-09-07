const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_ADMIN_SECRET;

const AdminAuth = (req, res, next) => {

  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {

    const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
  } catch (err) {
    // Token verification failed
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Export the middleware function
module.exports = AdminAuth;
