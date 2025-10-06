const getMetricsDto = (req) => {
  const { type, startDate, endDate } = req.query;
  const userId = req.userId;

  const filters = {
    userId,
    type,
    startDate,
    endDate,
  };

  return filters;
};

module.exports = getMetricsDto;

