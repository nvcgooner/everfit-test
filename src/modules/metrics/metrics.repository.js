const Metric = require('./metrics.model');

class MetricsRepository {
  async create(data) {
    return await Metric.create(data);
  }

  async findAggregatedByBuckets(filters, bucketBoundaries) {
    const matchQuery = {};
    
    if (filters.userId) {
      matchQuery.userId = filters.userId;
    }
    
    if (filters.type) {
      matchQuery.type = filters.type;
    }
    
    if (filters.startDate || filters.endDate) {
      matchQuery.date = {};
      if (filters.startDate) {
        matchQuery.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        matchQuery.date.$lte = new Date(filters.endDate);
      }
    }

    const pipeline = [
      { $match: matchQuery },
      {
        $bucket: {
          groupBy: "$date",
          boundaries: bucketBoundaries,
          default: "other",
          output: {
            records: { 
              $push: {
                value: "$value",
                unit: "$unit",
                type: "$type",
                date: "$date"
              }
            },
            type: { $first: "$type" },
          }
        }
      },
      { $unwind: "$records" },
      {
        $group: {
          _id: {
            bucketId: "$_id",
            unit: "$records.unit"
          },
          sum: { $sum: "$records.value" },
          count: { $sum: 1 },
          type: { $first: "$type" },
          max: { $max: "$records.value" },
          min: { $min: "$records.value" },
        }
      },
      {
        $group: {
          _id: "$_id.bucketId",
          type: { $first: "$type" },
          count: { $sum: "$count" },
          unitSummaries: {
            $push: {
              unit: "$_id.unit",
              sum: "$sum",
              count: "$count",
                max: "$max",
                min: "$min",
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          startBucket: "$_id",
          type: 1,
          count: 1,
          unitSummaries: 1,
        }
      },
      { $sort: { bucketStart: 1 } }
    ];

    return await Metric.aggregate(pipeline);
  }
}

module.exports = new MetricsRepository();

