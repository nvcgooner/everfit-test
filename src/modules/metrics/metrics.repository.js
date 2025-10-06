const Metric = require('./metrics.model');

class MetricsRepository {
  async create(data) {
    return await Metric.create(data);
  }

  async findByFilters(filters) {
    const { userId, type, startDate, endDate } = filters;
    const query = {
      userId,
      type,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
    
    return await Metric.find(query).sort({ date: -1 });
  }
}

module.exports = new MetricsRepository();

