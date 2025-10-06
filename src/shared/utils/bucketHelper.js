const calculateBucketBoundaries = (startDate, endDate, maxDataPoints) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const totalDuration = end - start + 1;
  const bucketSize = totalDuration / maxDataPoints;

  const boundaries = [];
  for (let i = 0; i <= maxDataPoints; i++) {
    boundaries.push(new Date(start + (bucketSize * i)));
  }

  return boundaries;
};

const calculateBucketSize = (startDate, endDate, maxDataPoints) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const totalDuration = end - start;
  return totalDuration / maxDataPoints;
};

module.exports = {
  calculateBucketBoundaries,
  calculateBucketSize,
};

