/**
 * Utility functions for standardized API responses
 */

class ResponseHandler {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message = 'Error', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  }

  static created(res, data, message = 'Resource created successfully') {
    return ResponseHandler.success(res, data, message, 201);
  }

  static notFound(res, message = 'Resource not found') {
    return ResponseHandler.error(res, message, 404);
  }

  static badRequest(res, message = 'Bad request', errors = null) {
    return ResponseHandler.error(res, message, 400, errors);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return ResponseHandler.error(res, message, 401);
  }

  static forbidden(res, message = 'Forbidden') {
    return ResponseHandler.error(res, message, 403);
  }
}

module.exports = ResponseHandler;

