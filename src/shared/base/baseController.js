/**
 * Base Controller with common functionality
 */
class BaseController {
  /**
   * Async handler wrapper to catch errors
   * @param {Function} fn - Async function to wrap
   */
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Send success response
   */
  sendSuccess(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  }

  /**
   * Send created response
   */
  sendCreated(res, data, message = 'Resource created successfully') {
    return this.sendSuccess(res, data, message, 201);
  }

  /**
   * Send error response
   */
  sendError(res, message = 'Error', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  }

  /**
   * Send validation error response
   */
  sendValidationError(res, errors) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  /**
   * Handle validation errors from DTO or other sources
   */
  handleValidationError(error, res) {
    if (error.validationErrors) {
      return this.sendValidationError(res, error.validationErrors);
    }
    return null;
  }
}

module.exports = BaseController;

