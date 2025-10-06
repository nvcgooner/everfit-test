const metricsService = require('./metrics.service');
const BaseController = require('../../shared/base/baseController');
const createMetricDto = require('./dto/request/create-metric.dto');
const getMetricsDto = require('./dto/request/get-metrics.dto');

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

  async getMetrics(req, res, next) {
    try {
      const { unit } = req.query;
      const filters = getMetricsDto(req);

      const metrics = await metricsService.getMetrics(filters, unit);

      return this.sendSuccess(res, metrics);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MetricsController();

