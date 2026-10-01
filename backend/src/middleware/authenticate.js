const jwt = require('jsonwebtoken');
const env = require('../config/env');
const repository = require('../data/mongoBankRepository');
const AppError = require('../utils/AppError');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  if (!token) return next(new AppError('Authentication token is required.', 401, 'AUTH_REQUIRED'));
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await repository.users.findById(payload.sub);
    if (!user) return next(new AppError('User no longer exists.', 401, 'INVALID_TOKEN'));
    req.user = user;
    next();
  } catch (_) {
    next(new AppError('Authentication token is invalid or expired.', 401, 'INVALID_TOKEN'));
  }
};
