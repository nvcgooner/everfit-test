/**
 * Export all shared middlewares
 */
const { validateUserId } = require('./validateHeaders');
const validateRequest = require('./validateRequest');

module.exports = {
  validateUserId,
  validateRequest,
};

