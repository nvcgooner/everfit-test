const Metric = require('../src/modules/metrics/metrics.model');
const mongoose = require('mongoose');
const { DISTANCE_UNITS, TEMPERATURE_UNITS } = require('../src/shared/enums/metric.enum');

const userIds = ['1', '2'];
const types = [
  { type: 'DISTANCE', units: Object.values(DISTANCE_UNITS), valueRange: [1, 1000] },
  { type: 'TEMPERATURE', units: Object.values(TEMPERATURE_UNITS), valueRange: [1, 100] },
];

const startDate = new Date('2025-09-01T00:00:00Z');
const days = 30;

function randomValue(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

const seedData = [];

for (const userId of userIds) {
  for (let day = 0; day < days; day++) {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + day);
    for (const { type, units, valueRange } of types) {
      for (const unit of units) {
        seedData.push({
          userId,
          type,
          value: randomValue(valueRange[0], valueRange[1]),
          unit,
          date,
        });
      }
    }
  }
}

async function seed() {
  await mongoose.connect('mongodb://127.0.0.1:27017/everfit-test');
  await Metric.insertMany(seedData);
  console.log('Seeding completed!');
  await mongoose.disconnect();
}

seed().catch(console.error);
