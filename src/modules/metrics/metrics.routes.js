const BaseRouter = require('../../shared/base/baseRouter');
const { validateUserId, validateRequest } = require('../../shared/middlewares');
const { createMetricSchema } = require('./validations/metric.validation');
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

module.exports = baseRouter.getRouter();

