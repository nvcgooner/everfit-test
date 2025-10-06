const mongoose = require('mongoose');
const { METRIC_TYPES, DISTANCE_UNITS, TEMPERATURE_UNITS } = require('../../shared/enums/metric.enum');

const metricSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    value: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(METRIC_TYPES),
    },
    unit: {
      type: String,
      required: true,
      enum: [...Object.values(DISTANCE_UNITS), ...Object.values(TEMPERATURE_UNITS)],
    },
  },
  {
    timestamps: true,
  }
);

metricSchema.index({ userId: 1, date: -1, type: 1 });

const Metric = mongoose.model('Metric', metricSchema);

module.exports = Metric;

