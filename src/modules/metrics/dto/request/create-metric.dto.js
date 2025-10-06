const { METRIC_TYPES, DISTANCE_UNITS, TEMPERATURE_UNITS } = require('../../../../shared/enums/metric.enum');

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

