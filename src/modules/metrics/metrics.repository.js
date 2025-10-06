const Metric = require('./metrics.model');

class MetricsRepository {
  async create(data) {
    return await Metric.create(data);
  }
}

module.exports = new MetricsRepository();

