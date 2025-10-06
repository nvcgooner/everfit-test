const metricsRepository = require('./metrics.repository');

class MetricsService {
  async createMetric(modelData) {
    const metric = await metricsRepository.create(modelData);
    return metric;
  }
}

module.exports = new MetricsService();

