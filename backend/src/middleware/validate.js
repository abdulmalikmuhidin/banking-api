const AppError = require('../utils/AppError');

module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return next(new AppError('Request validation failed.', 400, 'VALIDATION_ERROR'));
  req.body = result.data;
  next();
};
