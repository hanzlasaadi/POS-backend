class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //true for me 'cause I want to give max info to users

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
