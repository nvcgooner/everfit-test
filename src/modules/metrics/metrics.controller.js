const metricsService = require('./metrics.service');
const BaseController = require('../../shared/base/baseController');
const createMetricDto = require('./dto/create-metric.dto');

class MetricsController extends BaseController {
  async createMetric(req, res, next) {
    try {
      const modelData = createMetricDto(req);

      const metric = await metricsService.createMetric(modelData);

      return this.sendCreated(res, metric, 'Metric created successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MetricsController();

