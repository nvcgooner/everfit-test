# Validation Architecture với Joi

## Overview

Project sử dụng **Joi** cho validation của request data. Validation được thực hiện ở tầng middleware trước khi request đến controller.

---

## Validation Flow

```
Client Request
    ↓
validateUserId middleware (validate headers)
    ↓
validateRequest(schema) middleware (validate body với Joi)
    ↓
Controller (data đã được validated và sanitized)
    ↓
Service → DTO → Model
```

---

## Joi Validation Middleware

### Location
`src/shared/middlewares/validateRequest.js`

### Features
- ✅ Validate request body với Joi schema
- ✅ Return tất cả errors (không chỉ error đầu tiên)
- ✅ Tự động loại bỏ unknown fields
- ✅ Transform data (ví dụ: lowercase → uppercase)
- ✅ Sanitize input data

### Usage

```javascript
const validateRequest = require('../../shared/middlewares/validateRequest');
const { createMetricSchema } = require('./validations/metric.validation');

router.post(
  '/',
  validateRequest(createMetricSchema),
  controller.create
);
```

---

## Metric Validation Schema

### Location
`src/modules/metrics/validations/metric.validation.js`

### Create Metric Schema

```javascript
const createMetricSchema = Joi.object({
  date: Joi.date()
    .iso()
    .required(),
  
  value: Joi.number()
    .required(),
  
  unit: Joi.string()
    .uppercase()          // Tự động convert to uppercase
    .valid(...validUnits) // Validate against enum
    .required(),
});
```

### Validation Rules

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| date | Date | Yes | ISO 8601 format |
| value | Number | Yes | Must be a number |
| unit | String | Yes | Must be valid unit from enum, auto uppercase |

---

## Validation Examples

### Valid Request

**Request:**
```bash
POST /api/metrics
user-id: user123
Content-Type: application/json

{
  "date": "2024-01-15T10:30:00Z",
  "value": 1500,
  "unit": "meter"  // Will be converted to "METER"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "date": "2024-01-15T10:30:00.000Z",
    "value": 1500,
    "unit": "METER",  // Converted to uppercase
    "type": "DISTANCE"
  },
  "message": "Metric created successfully"
}
```

---

### Invalid Request - Missing Required Field (value)

**Request:**
```bash
POST /api/metrics
user-id: user123

{
  "date": "2024-01-15T10:30:00Z",
  "unit": "meter"
  // Missing "value"
}
```

**Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "value",
      "message": "Value is required"
    }
  ]
}
```

---

### Invalid Request - Missing Date

**Request:**
```bash
POST /api/metrics
user-id: user123

{
  "value": 1500,
  "unit": "meter"
  // Missing "date"
}
```

**Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "date",
      "message": "Date is required"
    }
  ]
}
```

---

### Invalid Request - Invalid Unit

**Request:**
```bash
POST /api/metrics
user-id: user123

{
  "value": 100,
  "unit": "invalid_unit"
}
```

**Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "unit",
      "message": "Unit must be one of: METER, CENTIMETER, INCH, FEET, YARD, CELSIUS, FAHRENHEIT, KELVIN"
    }
  ]
}
```

---

### Invalid Request - Multiple Errors

**Request:**
```bash
POST /api/metrics
user-id: user123

{
  "value": "not_a_number",
  "unit": "invalid_unit",
  "date": "invalid_date"
}
```

**Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "date",
      "message": "Date must be a valid date"
    },
    {
      "field": "value",
      "message": "Value must be a number"
    },
    {
      "field": "unit",
      "message": "Unit must be one of: METER, CENTIMETER, INCH, FEET, YARD, CELSIUS, FAHRENHEIT, KELVIN"
    }
  ]
}
```

---

### Invalid Request - Missing Header

**Request:**
```bash
POST /api/metrics
# Missing user-id header

{
  "value": 100,
  "unit": "meter"
}
```

**Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "user-id",
      "message": "User ID is required in headers"
    }
  ]
}
```

---

## Joi Validation Options

### Current Configuration

```javascript
schema.validate(req.body, {
  abortEarly: false,  // Return all errors
  stripUnknown: true, // Remove unknown fields
});
```

### Options Explained

- **abortEarly: false** - Validate tất cả fields và return tất cả errors, không dừng ở error đầu tiên
- **stripUnknown: true** - Tự động loại bỏ các fields không có trong schema

---

## Creating New Validation Schemas

### Example: Add GET validation

```javascript
// src/modules/metrics/validations/metric.validation.js

const getMetricsQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
  
  type: Joi.string()
    .valid(...Object.values(METRIC_TYPES))
    .optional(),
  
  startDate: Joi.date()
    .iso()
    .optional(),
  
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .optional(),
});
```

### Use in Route

```javascript
router.get(
  '/',
  validateRequest(getMetricsQuerySchema),
  controller.getAll
);
```

---

## Benefits of Joi Validation

1. ✅ **Centralized Validation** - All validation logic in one place
2. ✅ **Auto Transformation** - Convert data (uppercase, trim, etc.)
3. ✅ **Rich Validation Rules** - Number ranges, date formats, string patterns
4. ✅ **Custom Error Messages** - User-friendly error messages
5. ✅ **Type Coercion** - Automatic type conversion
6. ✅ **Conditional Validation** - Validate based on other fields
7. ✅ **Reusable Schemas** - Share schemas across routes
8. ✅ **Documentation** - Schema serves as documentation

---

## Common Joi Validation Rules

### String Validation
```javascript
Joi.string()
  .min(3)
  .max(100)
  .trim()
  .lowercase()
  .uppercase()
  .email()
  .uri()
  .pattern(/regex/)
  .required()
```

### Number Validation
```javascript
Joi.number()
  .integer()
  .min(0)
  .max(100)
  .positive()
  .negative()
  .required()
```

### Date Validation
```javascript
Joi.date()
  .iso()
  .min('2024-01-01')
  .max('now')
  .required()
```

### Array Validation
```javascript
Joi.array()
  .items(Joi.string())
  .min(1)
  .max(10)
  .unique()
  .required()
```

### Object Validation
```javascript
Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
})
  .min(1)
  .required()
```

---

## Testing Validation

### Test Cases to Cover

1. ✅ Valid data
2. ✅ Missing required fields
3. ✅ Invalid data types
4. ✅ Out of range values
5. ✅ Invalid enum values
6. ✅ Invalid formats (date, email, etc.)
7. ✅ Unknown fields (should be stripped)
8. ✅ Multiple validation errors

---

## Migration from DTO Validation

### Before (DTO validation)
```javascript
// DTO validates internally
const dto = new CreateMetricDto(data);
const errors = dto.validate();
if (errors.length > 0) {
  throw error;
}
```

### After (Joi validation)
```javascript
// Validation happens in middleware
// Controller receives validated data
const metricData = req.body; // Already validated
```

### Benefits
- ✅ Separation of concerns
- ✅ Reusable validation
- ✅ Consistent error format
- ✅ Automatic data transformation
- ✅ DTO focuses on business logic only

