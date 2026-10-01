const env = require('../config/env');

module.exports = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({ error: { code: 'DUPLICATE_RECORD', message: 'That record already exists.' } });
  }
  const status = err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: { code: err.code || 'INTERNAL_ERROR', message: status >= 500 ? 'An unexpected error occurred.' : err.message },
    ...(env.nodeEnv === 'development' && status >= 500 ? { stack: err.stack } : {})
  });
};
