const { UNIT_MAPPING } = require('../../../../shared/enums/metric.enum');

const createMetricDto = (req) => {
  const { date, value, unit } = req.body;
  const userId = req.userId;

  return {
    userId,
    value,
    unit,
    date: date,
    type: UNIT_MAPPING[unit],
  };
};

module.exports = createMetricDto;

