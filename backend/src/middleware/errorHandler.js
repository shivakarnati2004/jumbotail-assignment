/**
 * Error Handler Middleware
 * Catches all errors thrown in route handlers and returns
 * a standardized JSON error response.
 */
function errorHandler(err, req, res, next) {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`[ERROR] ${statusCode} — ${message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            code: statusCode,
        },
    });
}

module.exports = errorHandler;
