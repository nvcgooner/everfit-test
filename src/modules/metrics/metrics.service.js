const metricsRepository = require('./metrics.repository');
const { convertDistance, convertTemperature } = require('../../shared/utils/unitConverter');
const { calculateBucketBoundaries, getHumanReadableBucketSize, calculateBucketSize } = require('../../shared/utils/bucketHelper');
const { DISTANCE_UNITS, TEMPERATURE_UNITS } = require('../../shared/enums/metric.enum');
const config = require('../../config/config');

class MetricsService {
  async createMetric(modelData) {
    const metric = await metricsRepository.create(modelData);
    return metric;
  }

  async getMetrics(filters, targetUnit, maxDataPoints = null) {
    const maxPoints = maxDataPoints || config.maxDataPoints;
    
    const bucketBoundaries = calculateBucketBoundaries(
      filters.startDate,
      filters.endDate,
      maxPoints
    );
    
    const aggregatedData = await metricsRepository.findAggregatedByBuckets(
      filters,
      bucketBoundaries
    );
    
    let processedData = aggregatedData;
    
    processedData = aggregatedData.map(bucket => {
        let bucketMax = null;
        let bucketMin = null;
        let totalSum = 0;
        let totalCount = 0;

        bucket.unitSummaries.forEach(summary => {
          let convertedSum = summary.sum;
          let convertedMax = summary.max;
          let convertedMin = summary.min;

          if (Object.values(DISTANCE_UNITS).includes(summary.unit) && Object.values(DISTANCE_UNITS).includes(targetUnit)) {
            convertedSum = convertDistance(summary.sum, summary.unit, targetUnit);
            convertedMax = convertDistance(summary.max, summary.unit, targetUnit);
            convertedMin = convertDistance(summary.min, summary.unit, targetUnit);
          } else if (Object.values(TEMPERATURE_UNITS).includes(summary.unit) && Object.values(TEMPERATURE_UNITS).includes(targetUnit)) {
            convertedSum = convertTemperature(summary.sum, summary.unit, targetUnit);
            convertedMax = convertTemperature(summary.max, summary.unit, targetUnit);
            convertedMin = convertTemperature(summary.min, summary.unit, targetUnit);
          }

          if (bucketMax === null || convertedMax > bucketMax) bucketMax = convertedMax;
          if (bucketMin === null || convertedMin < bucketMin) bucketMin = convertedMin;

          totalSum += convertedSum;
          totalCount += summary.count;
        });

        return {
          startBucket: bucket.startBucket,
          endBucket: bucket.endBucket,
          count: bucket.count,
          totalAvgValue: totalSum / totalCount,
          max: bucketMax,
          min: bucketMin,
        };
      });
    
    const bucketSizeMs = calculateBucketSize(filters.startDate, filters.endDate, maxPoints);
    const totalCount = processedData.reduce((acc, bucket) => acc + bucket.count, 0);
    
    return {
      data: processedData,
      meta: {
        unit: targetUnit,
        type: filters.type,
        totalRecords: totalCount,
        returnedPoints: processedData.length,
        bucketSize: bucketSizeMs,
        maxDataPoints: maxPoints,
      }
    };
  }
}

module.exports = new MetricsService();

