const { calculateBucketBoundaries } = require('../src/shared/utils/bucketHelper');

describe('calculateBucketBoundaries', () => {
  it('should return correct number of boundaries', () => {
    const startDate = '2025-10-01T00:00:00Z';
    const endDate = '2025-10-10T00:00:00Z';
    const maxDataPoints = 5;
    const { bucketBoundaries } = calculateBucketBoundaries(startDate, endDate, maxDataPoints);
    expect(bucketBoundaries.length).toBeLessThanOrEqual(maxDataPoints + 1);
  });

  it('should return unique boundaries', () => {
    const startDate = '2025-10-01T00:00:00Z';
    const endDate = '2025-10-10T00:00:00Z';
    const maxDataPoints = 5;
    const { bucketBoundaries } = calculateBucketBoundaries(startDate, endDate, maxDataPoints);
    const unique = Array.from(new Set(bucketBoundaries.map(d => d.getTime())));
    expect(bucketBoundaries.length).toBe(unique.length);
  });

  it('should not exceed totalDuration buckets', () => {
    const startDate = '2025-10-01T00:00:00.000Z';
    const endDate = '2025-10-01T00:00:00.000Z';
    const maxDataPoints = 10;
    const { bucketBoundaries } = calculateBucketBoundaries(startDate, endDate, maxDataPoints);
    console.log(bucketBoundaries)
    expect(bucketBoundaries.length).toBeLessThanOrEqual(2);
  });

  it('should return sorted boundaries', () => {
    const startDate = '2025-10-01T00:00:00Z';
    const endDate = '2025-10-10T00:00:00Z';
    const maxDataPoints = 5;
    const { bucketBoundaries } = calculateBucketBoundaries(startDate, endDate, maxDataPoints);
    for (let i = 1; i < bucketBoundaries.length; i++) {
      expect(bucketBoundaries[i].getTime()).toBeGreaterThanOrEqual(bucketBoundaries[i - 1].getTime());
    }
  });
});
