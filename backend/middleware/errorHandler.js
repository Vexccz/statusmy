const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // SQLite UNIQUE constraint violation
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    statusCode = 400;
    const match = err.message.match(/UNIQUE constraint failed: \w+\.(\w+)/);
    const field = match ? match[1] : 'field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // SQLite CHECK constraint violation
  if (err.message && err.message.includes('CHECK constraint failed')) {
    statusCode = 400;
    message = 'Invalid value provided';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
