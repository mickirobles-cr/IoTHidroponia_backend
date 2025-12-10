const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return res.status(401).json({ message: 'Invalid token format.' });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ AQUÍ ESTÁ LA CORRECCIÓN CLAVE:
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid token.', 
      error: error.message 
    });
  }
};
