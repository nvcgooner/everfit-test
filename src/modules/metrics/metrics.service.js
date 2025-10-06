const metricsRepository = require('./metrics.repository');
const { convertMetricUnit } = require('../../shared/utils/unitConverter');

class MetricsService {
  async createMetric(modelData) {
    const metric = await metricsRepository.create(modelData);
    return metric;
  }

  async getMetrics(filters, targetUnit = null) {
    const metrics = await metricsRepository.findByFilters(filters);
    
    if (!targetUnit) {
      return metrics;
    }
    
    const convertedMetrics = metrics.map(metric => convertMetricUnit(metric, targetUnit));
    return convertedMetrics;
  }
}

module.exports = new MetricsService();

