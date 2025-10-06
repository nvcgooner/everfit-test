const Joi = require('joi');
const { METRIC_TYPES, DISTANCE_UNITS, TEMPERATURE_UNITS } = require('../../../shared/enums/metric.enum');
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

const getMetricsSchema = createJoiSchema({
  type: field(
    Joi.string().valid(...Object.values(METRIC_TYPES)).required()
  ),

  unit: field(
    Joi.string().valid(...validUnits).required()
  ),

  startDate: field(
    Joi.date().iso().required()
  ),

  endDate: field(
    Joi.date().iso().required()
  ),

  maxDataPoints: field(
    Joi.number().integer().min(1).max(1000).optional()
  ),
});

module.exports = {
  createMetricSchema,
  getMetricsSchema,
};

