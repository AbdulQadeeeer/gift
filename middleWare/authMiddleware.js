const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';
const authenticateUser = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).redirect('/login');
    }
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
      }
      req.user = decoded; // Attach user data to request
      next();
    });
  };

  module.exports = authenticateUser;
  