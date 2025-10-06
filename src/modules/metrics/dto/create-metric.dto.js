const { METRIC_TYPES, DISTANCE_UNITS, TEMPERATURE_UNITS } = require('../../../shared/enums/metric.enum');

/**
 * Determine metric type based on unit
 */
const determineType = (unit) => {
  if (!unit) return null;

  if (Object.values(DISTANCE_UNITS).includes(unit)) {
    return METRIC_TYPES.DISTANCE;
  }

  if (Object.values(TEMPERATURE_UNITS).includes(unit)) {
    return METRIC_TYPES.TEMPERATURE;
  }

  return null;
};

/**
 * Transform request to model data for creating metric
 * @param {Object} req - Express request object
 * @returns {Object} Model data ready for database
 */
const createMetricDto = (req) => {
  const { date, value, unit } = req.body;
  const userId = req.userId;

  return {
    userId,
    value,
    unit,
    date: date,
    type: determineType(unit),
  };
};

module.exports = createMetricDto;

