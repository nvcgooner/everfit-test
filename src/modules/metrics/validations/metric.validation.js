const Joi = require('joi');
const { DISTANCE_UNITS, TEMPERATURE_UNITS } = require('../../../shared/enums/metric.enum');
const { createJoiSchema, field } = require('../../../shared/utils/joiHelpers');

const validUnits = [
  ...Object.values(DISTANCE_UNITS),
  ...Object.values(TEMPERATURE_UNITS),
];

const createMetricSchema = createJoiSchema({
  date: field(
    Joi.date().iso().required()
  ),

  value: field(
    Joi.number().required()
  ),

  unit: field(
    Joi.string().valid(...validUnits).required()
  ),
});

module.exports = {
  createMetricSchema,
};

