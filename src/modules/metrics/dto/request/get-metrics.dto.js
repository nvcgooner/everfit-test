const getMetricsDto = (req) => {
  const { type, startDate, endDate } = req.query;
  const userId = req.userId;

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    throw new Error('startDate must be less than or equal to endDate');
  }

  const filters = {
    userId,
    type,
    startDate,
    endDate,
  };

  return filters;
};

module.exports = getMetricsDto;

