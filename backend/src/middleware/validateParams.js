/**
 * Validation Middleware
 * Helpers to validate query parameters and request body fields.
 */

/**
 * Validate required query parameters.
 * Returns 400 if any are missing.
 */
function validateQueryParams(...params) {
    return (req, res, next) => {
        const missing = params.filter((p) => !req.query[p]);
        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: `Missing required query parameter(s): ${missing.join(', ')}`,
                    code: 400,
                },
            });
        }
        next();
    };
}

/**
 * Validate required body fields.
 * Returns 400 if any are missing.
 */
function validateBodyParams(...params) {
    return (req, res, next) => {
        const missing = params.filter((p) => req.body[p] === undefined || req.body[p] === null);
        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: `Missing required body field(s): ${missing.join(', ')}`,
                    code: 400,
                },
            });
        }
        next();
    };
}

module.exports = { validateQueryParams, validateBodyParams };
