// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let error = err.name || 'InternalError';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    error = 'ValidationError';
    message = 'Invalid input data';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    error = 'CastError';
    message = 'Invalid ID format';
  } else if (err.code === '23505') { // PostgreSQL unique constraint violation
    statusCode = 409;
    error = 'DuplicateError';
    message = 'Resource already exists';
  } else if (err.code === '23503') { // PostgreSQL foreign key constraint violation
    statusCode = 400;
    error = 'ReferenceError';
    message = 'Referenced resource does not exist';
  } else if (err.code === '42P01') { // PostgreSQL undefined table
    statusCode = 500;
    error = 'DatabaseError';
    message = 'Database configuration error';
  } else if (err.code === 'ENOTFOUND') {
    statusCode = 503;
    error = 'ServiceUnavailable';
    message = 'External service unavailable';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    error = 'ServiceUnavailable';
    message = 'Database connection refused';
  } else if (err.code === 'ETIMEDOUT') {
    statusCode = 504;
    error = 'GatewayTimeout';
    message = 'Request timeout';
  }

  // Handle OpenAI API errors
  if (err.response?.status) {
    switch (err.response.status) {
      case 400:
        statusCode = 400;
        error = 'OpenAIError';
        message = 'Invalid request to AI service';
        break;
      case 401:
        statusCode = 500;
        error = 'OpenAIError';
        message = 'AI service authentication failed';
        break;
      case 429:
        statusCode = 429;
        error = 'RateLimitError';
        message = 'AI service rate limit exceeded';
        break;
      case 500:
        statusCode = 503;
        error = 'OpenAIError';
        message = 'AI service temporarily unavailable';
        break;
    }
  }

  // Handle file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    error = 'FileTooLarge';
    message = 'File size exceeds the limit';
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    error = 'InvalidFile';
    message = 'Unexpected file field';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    error = 'InvalidToken';
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    error = 'TokenExpired';
    message = 'Authentication token expired';
  }

  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
      statusCode: err.statusCode
    });
  }

  // Send error response
  res.status(statusCode).json({
    error,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

// Async error wrapper for route handlers
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom error class for application errors
class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, 503, 'SERVICE_UNAVAILABLE_ERROR');
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServiceUnavailableError
};
