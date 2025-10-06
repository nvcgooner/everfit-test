class BaseController {
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  sendSuccess(res, data, messageOrMeta = 'Success', statusCode = 200) {
    const response = {
      success: true,
      data,
    };

    if (typeof messageOrMeta === 'string') {
      response.message = messageOrMeta;
    } else if (typeof messageOrMeta === 'object') {
      response.meta = messageOrMeta;
    }

    return res.status(statusCode).json(response);
  }

  sendCreated(res, data, message = 'Resource created successfully') {
    return this.sendSuccess(res, data, message, 201);
  }

  sendError(res, message = 'Error', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  }

  sendValidationError(res, errors) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  handleValidationError(error, res) {
    if (error.validationErrors) {
      return this.sendValidationError(res, error.validationErrors);
    }
    return null;
  }
}

module.exports = BaseController;

