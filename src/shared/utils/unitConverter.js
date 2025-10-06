const { DISTANCE_UNITS, TEMPERATURE_UNITS } = require('../enums/metric.enum');

/**
 * Distance conversion factors to METER
 */
const DISTANCE_TO_METER = {
  [DISTANCE_UNITS.METER]: 1,
  [DISTANCE_UNITS.CENTIMETER]: 0.01,
  [DISTANCE_UNITS.INCH]: 0.0254,
  [DISTANCE_UNITS.FEET]: 0.3048,
  [DISTANCE_UNITS.YARD]: 0.9144,
};

/**
 * Temperature conversion functions
 */
const TEMPERATURE_CONVERTERS = {
  // Convert from any unit to Celsius first
  toCelsius: {
    [TEMPERATURE_UNITS.CELSIUS]: (value) => value,
    [TEMPERATURE_UNITS.FAHRENHEIT]: (value) => (value - 32) * 5 / 9,
    [TEMPERATURE_UNITS.KELVIN]: (value) => value - 273.15,
  },
  // Convert from Celsius to target unit
  fromCelsius: {
    [TEMPERATURE_UNITS.CELSIUS]: (value) => value,
    [TEMPERATURE_UNITS.FAHRENHEIT]: (value) => (value * 9 / 5) + 32,
    [TEMPERATURE_UNITS.KELVIN]: (value) => value + 273.15,
  },
};

/**
 * Convert distance value between units
 * @param {number} value - Original value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
const convertDistance = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  
  // Convert to meter first, then to target unit
  const valueInMeters = value * DISTANCE_TO_METER[fromUnit];
  return valueInMeters / DISTANCE_TO_METER[toUnit];
};

/**
 * Convert temperature value between units
 * @param {number} value - Original value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
const convertTemperature = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  
  // Convert to Celsius first, then to target unit
  const valueInCelsius = TEMPERATURE_CONVERTERS.toCelsius[fromUnit](value);
  return TEMPERATURE_CONVERTERS.fromCelsius[toUnit](valueInCelsius);
};

/**
 * Convert metric value based on type and units
 * @param {Object} metric - Metric object with value, unit, type
 * @param {string} targetUnit - Target unit to convert to
 * @returns {Object} Metric with converted value
 */
const convertMetricUnit = (metric, targetUnit) => {
  if (!targetUnit || metric.unit === targetUnit) {
    return metric;
  }

  const metricCopy = { ...metric.toObject ? metric.toObject() : metric };
  
  if (Object.values(DISTANCE_UNITS).includes(metric.unit) && 
      Object.values(DISTANCE_UNITS).includes(targetUnit)) {
    metricCopy.value = convertDistance(metric.value, metric.unit, targetUnit);
    metricCopy.unit = targetUnit;
    metricCopy.originalValue = metric.value;
    metricCopy.originalUnit = metric.unit;
  } else if (Object.values(TEMPERATURE_UNITS).includes(metric.unit) && 
             Object.values(TEMPERATURE_UNITS).includes(targetUnit)) {
    metricCopy.value = convertTemperature(metric.value, metric.unit, targetUnit);
    metricCopy.unit = targetUnit;
    metricCopy.originalValue = metric.value;
    metricCopy.originalUnit = metric.unit;
  }

  return metricCopy;
};

module.exports = {
  convertDistance,
  convertTemperature,
  convertMetricUnit,
};

