const Joi = require('joi');

const createJoiSchema = (schemaDefinition) => {
  const schema = {};

  Object.keys(schemaDefinition).forEach((fieldName) => {
    const fieldDef = schemaDefinition[fieldName];
    let field = fieldDef.validator;

    const messages = generateMessages(fieldName, fieldDef);
    
    if (Object.keys(messages).length > 0) {
      field = field.messages(messages);
    }

    schema[fieldName] = field;
  });

  return Joi.object(schema);
};

const generateMessages = (fieldName, fieldDef) => {
  const messages = {};
  const capitalizedField = capitalize(fieldName);
  const validator = fieldDef.validator;

  const type = validator.type;

  if (fieldDef.required !== false) {
    messages['any.required'] = `${capitalizedField} is required`;
  }
  messages['any.invalid'] = `${capitalizedField} is invalid`;

  switch (type) {
    case 'string':
      messages['string.base'] = `${capitalizedField} must be a string`;
      messages['string.empty'] = `${capitalizedField} cannot be empty`;

      if (validator._rules) {
        validator._rules.forEach(rule => {
          if (rule.name === 'min') {
            messages['string.min'] = `${capitalizedField} must be at least {{#limit}} characters`;
          }
          if (rule.name === 'max') {
            messages['string.max'] = `${capitalizedField} cannot exceed {{#limit}} characters`;
          }
          if (rule.name === 'email') {
            messages['string.email'] = `${capitalizedField} must be a valid email`;
          }
        });
      }
      break;

    case 'number':
      messages['number.base'] = `${capitalizedField} must be a number`;
      
      if (validator._rules) {
        validator._rules.forEach(rule => {
          if (rule.name === 'min') {
            messages['number.min'] = `${capitalizedField} must be at least {{#limit}}`;
          }
          if (rule.name === 'max') {
            messages['number.max'] = `${capitalizedField} cannot exceed {{#limit}}`;
          }
          if (rule.name === 'positive') {
            messages['number.positive'] = `${capitalizedField} must be a positive number`;
          }
          if (rule.name === 'integer') {
            messages['number.integer'] = `${capitalizedField} must be an integer`;
          }
        });
      }
      break;

    case 'date':
      messages['date.base'] = `${capitalizedField} must be a valid date`;
      messages['date.format'] = `${capitalizedField} must be in ISO 8601 format`;
      break;

    case 'array':
      messages['array.base'] = `${capitalizedField} must be an array`;
      break;

    case 'object':
      messages['object.base'] = `${capitalizedField} must be an object`;
      break;
  }

  if (validator._valids && validator._valids._values.size > 0) {
    const values = Array.from(validator._valids._values).filter(v => v !== null);
    if (values.length > 0) {
      messages['any.only'] = `${capitalizedField} must be one of: ${values.join(', ')}`;
    }
  }

  if (fieldDef.messages) {
    Object.assign(messages, fieldDef.messages);
  }

  return messages;
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const field = (validator, options = {}) => {
  return {
    validator,
    required: options.required !== false,
    messages: options.messages || {},
  };
};

module.exports = {
  createJoiSchema,
  generateMessages,
  field,
};

