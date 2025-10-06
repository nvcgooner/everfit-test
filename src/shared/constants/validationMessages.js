const validationMessages = {
  required: (field) => `${field} is required`,
  invalid: (field) => `${field} is invalid`,

  string: {
    base: (field) => `${field} must be a string`,
    empty: (field) => `${field} cannot be empty`,
    min: (field, limit) => `${field} must be at least ${limit} characters`,
    max: (field, limit) => `${field} cannot exceed ${limit} characters`,
  },
  
  number: {
    base: (field) => `${field} must be a number`,
    min: (field, limit) => `${field} must be at least ${limit}`,
    max: (field, limit) => `${field} cannot exceed ${limit}`,
    positive: (field) => `${field} must be a positive number`,
    negative: (field) => `${field} must be a negative number`,
    integer: (field) => `${field} must be an integer`,
  },
  
  date: {
    base: (field) => `${field} must be a valid date`,
    format: (field, format = 'ISO 8601') => `${field} must be in ${format} format`,
    min: (field) => `${field} must be after the minimum date`,
    max: (field) => `${field} must be before the maximum date`,
  },
  
  array: {
    base: (field) => `${field} must be an array`,
    empty: (field) => `${field} cannot be empty`,
    min: (field, limit) => `${field} must contain at least ${limit} items`,
    max: (field, limit) => `${field} cannot contain more than ${limit} items`,
  },
  
  object: {
    base: (field) => `${field} must be an object`,
  },
  
  enum: {
    only: (field, values) => `${field} must be one of: ${values.join(', ')}`,
  },

  fields: {
    date: {
      base: 'Date must be a valid date',
      format: 'Date must be in ISO 8601 format',
      required: 'Date is required',
    },
    value: {
      base: 'Value must be a number',
      required: 'Value is required',
    },
    unit: {
      base: 'Unit must be a string',
      required: 'Unit is required',
      invalid: (validUnits) => `Unit must be one of: ${validUnits.join(', ')}`,
    },
    userId: {
      required: 'User ID is required',
      invalid: 'User ID is invalid',
    },
  },
};

const generateJoiMessages = (field, type, customMessages = {}) => {
  const baseMessages = {
    'any.required': validationMessages.required(field),
    'any.invalid': validationMessages.invalid(field),
  };

  const typeMessages = {
    string: {
      'string.base': validationMessages.string.base(field),
      'string.empty': validationMessages.string.empty(field),
    },
    number: {
      'number.base': validationMessages.number.base(field),
    },
    date: {
      'date.base': validationMessages.date.base(field),
      'date.format': validationMessages.date.format(field),
    },
  };

  return {
    ...baseMessages,
    ...(typeMessages[type] || {}),
    ...customMessages,
  };
};

module.exports = {
  validationMessages,
  generateJoiMessages,
};

