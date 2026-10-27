const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: Missing Authentication Token' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'apex_secret_key_2026');
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or Expired Token' });
  }
};
