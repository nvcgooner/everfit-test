const { DISTANCE_UNITS, TEMPERATURE_UNITS } = require('../enums/metric.enum');

const DISTANCE_TO_METER = {
  [DISTANCE_UNITS.METER]: 1,
  [DISTANCE_UNITS.CENTIMETER]: 1/100,
  [DISTANCE_UNITS.INCH]: 2.54 / 100,
  [DISTANCE_UNITS.FEET]: 12 * 2.54 / 100,
  [DISTANCE_UNITS.YARD]: 3 * 12 * 2.54 / 100,
};

const TEMPERATURE_CONVERTERS = {
  toCelsius: {
    [TEMPERATURE_UNITS.CELSIUS]: (value) => value,
    [TEMPERATURE_UNITS.FAHRENHEIT]: (value) => (value - 32) * 5 / 9,
    [TEMPERATURE_UNITS.KELVIN]: (value) => value - 273.15,
  },
  fromCelsius: {
    [TEMPERATURE_UNITS.CELSIUS]: (value) => value,
    [TEMPERATURE_UNITS.FAHRENHEIT]: (value) => (value * 9 / 5) + 32,
    [TEMPERATURE_UNITS.KELVIN]: (value) => value + 273.15,
  },
};

const convertDistance = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;

  const valueInMeters = value * DISTANCE_TO_METER[fromUnit];
  return valueInMeters / DISTANCE_TO_METER[toUnit];
};

const convertTemperature = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;

  const valueInCelsius = TEMPERATURE_CONVERTERS.toCelsius[fromUnit](value);
  return TEMPERATURE_CONVERTERS.fromCelsius[toUnit](valueInCelsius);
};

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

