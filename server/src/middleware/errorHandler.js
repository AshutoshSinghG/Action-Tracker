class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Internal server error';

    if (!err.isOperational) {
        console.error('Unhandled error:', err);
    }

    res.status(statusCode).json({ error: message });
}

module.exports = { AppError, errorHandler };
