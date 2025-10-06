const axios = require('axios');
const { DISTANCE_UNITS, TEMPERATURE_UNITS } = require('../src/shared/enums/metric.enum');

const userIds = ['1', '2'];
const units = [...Object.values(DISTANCE_UNITS), ...Object.values(TEMPERATURE_UNITS)];
const valueRange = [1, 1000];
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
    for (const unit of units) {
      seedData.push({
        userId,
        value: randomValue(valueRange[0], valueRange[1]),
        unit,
        date,
      });
    }
  }
}

async function seed() {
  for (const data of seedData) {
    try {
      await axios.post('http://localhost:3000/api/metrics', {
        value: data.value,
        unit: data.unit,
        date: data.date,
      }, {
        headers: { userId: data.userId }
      });
      console.log(`Seeded: ${JSON.stringify(data)}`);
    } catch (err) {
      console.error(`Error seeding: ${JSON.stringify(data)}`, err.response?.data || err.message);
    }
  }
  console.log('Seeding via API completed!');
}

seed().catch(console.error);
