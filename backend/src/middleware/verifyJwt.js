const jwt = require('jsonwebtoken');
const { config } = require('../config');

function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, config.jwt.accessSecret);
    req.userId = payload.sub;
    req.userRole = payload.role;
    req.actor = payload.actor || 'user';
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { verifyJwt };
