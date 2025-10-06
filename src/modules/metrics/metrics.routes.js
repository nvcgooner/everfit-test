const BaseRouter = require('../../shared/base/baseRouter');
const { validateUserId, validateRequest, validateQuery } = require('../../shared/middlewares');
const { createMetricSchema, getMetricsSchema } = require('./validations/metric.validation');
const metricsController = require('./metrics.controller');

const baseRouter = new BaseRouter();

baseRouter.post(
  '/',
  [
    validateUserId,
    validateRequest(createMetricSchema),
  ],
  metricsController.createMetric.bind(metricsController)
);

baseRouter.get(
  '/',
  [
    validateUserId,
    validateQuery(getMetricsSchema),
  ],
  metricsController.getMetrics.bind(metricsController)
);

module.exports = baseRouter.getRouter();

