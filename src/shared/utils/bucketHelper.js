const calculateBucketBoundaries = (startDate, endDate, maxDataPoints) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const totalDuration = end - start + 1;
  const safeMaxDataPoints = totalDuration < maxDataPoints ? totalDuration : maxDataPoints;
  const bucketSize = totalDuration / safeMaxDataPoints;

  const bucketBoundaries = [];
  for (let i = 0; i <= safeMaxDataPoints; i++) {
    bucketBoundaries.push(new Date(start + (bucketSize * i)));
  }

  return { bucketBoundaries, bucketSize };
};

module.exports = {
  calculateBucketBoundaries,
};

