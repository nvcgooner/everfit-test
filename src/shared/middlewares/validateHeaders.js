const { validationMessages } = require('../constants/validationMessages');

const validateUserId = (req, res, next) => {
  const userId = req.headers['user-id'] || req.headers['userid'];
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      errors: [
        {
          field: 'user-id',
          message: validationMessages.fields.userId.required,
        },
      ],
    });
  }

  req.userId = userId;
  next();
};

module.exports = {
  validateUserId,
};

