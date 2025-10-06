const { convertDistance, convertTemperature } = require('../src/shared/utils/unitConverter');

describe('convertDistance', () => {
  it('should return the same value if units are the same', () => {
    expect(convertDistance(100, 'METER', 'METER')).toBe(100);
  });

  it('should convert meters to centimeters', () => {
    expect(convertDistance(1, 'METER', 'CENTIMETER')).toBe(100);
  });

  it('should convert centimeters to meters', () => {
    expect(convertDistance(100, 'CENTIMETER', 'METER')).toBe(1);
  });

  it('should convert meters to inches', () => {
    expect(convertDistance(1, 'METER', 'INCH')).toBeCloseTo(39.3701, 4);
  });

  it('should convert inches to meters', () => {
    expect(convertDistance(39.3701, 'INCH', 'METER')).toBeCloseTo(1, 2);
  });
});

describe('convertTemperature', () => {
  it('should return the same value if units are the same', () => {
    expect(convertTemperature(36.5, 'CELSIUS', 'CELSIUS')).toBe(36.5);
  });

  it('should convert Celsius to Fahrenheit', () => {
    expect(convertTemperature(0, 'CELSIUS', 'FAHRENHEIT')).toBe(32);
    expect(convertTemperature(100, 'CELSIUS', 'FAHRENHEIT')).toBe(212);
  });

  it('should convert Fahrenheit to Celsius', () => {
    expect(convertTemperature(32, 'FAHRENHEIT', 'CELSIUS')).toBeCloseTo(0, 2);
    expect(convertTemperature(212, 'FAHRENHEIT', 'CELSIUS')).toBeCloseTo(100, 2);
  });

  it('should convert Celsius to Kelvin', () => {
    expect(convertTemperature(0, 'CELSIUS', 'KELVIN')).toBe(273.15);
  });

  it('should convert Kelvin to Celsius', () => {
    expect(convertTemperature(273.15, 'KELVIN', 'CELSIUS')).toBe(0);
  });
});
