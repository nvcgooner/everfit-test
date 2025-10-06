# Metrics API Documentation

## Overview

The Metrics API allows you to create and track Distance and Temperature measurements. The backend automatically determines the metric type based on the unit provided.

---

## Enums

### Metric Types (Auto-determined by BE)
- `DISTANCE`
- `TEMPERATURE`

### Distance Units
- `METER`
- `CENTIMETER`
- `INCH`
- `FEET`
- `YARD`

### Temperature Units
- `CELSIUS`
- `FAHRENHEIT`
- `KELVIN`

---

## Create Metric API

### Endpoint
**POST** `/api/metrics`

### Headers
```
user-id: string (required)
Content-Type: application/json
```

### Request Body
```json
{
  "date": "ISO 8601 date string (required)",
  "value": "number",
  "unit": "string (case-insensitive)"
}
```

### Fields Description

**Headers:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user-id | String | Yes | User identifier |

**Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| date | String/Date | Yes | Measurement date (ISO 8601 format) |
| value | Number | Yes | Metric value |
| unit | String | Yes | Measurement unit (case-insensitive, will be converted to uppercase by BE) |

**Note:** The `type` field is automatically determined by the backend based on the `unit` provided.

---

## Examples

### Example 1: Create Distance Metric (Meter)

**Request:**
```bash
POST /api/metrics
Content-Type: application/json
user-id: user123

{
  "date": "2024-01-15T10:30:00Z",
  "value": 1500,
  "unit": "meter"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "user123",
    "date": "2024-01-15T10:30:00.000Z",
    "value": 1500,
    "type": "DISTANCE",
    "unit": "METER",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "formattedDate": "2024-01-15T10:30:00.000Z"
  },
  "message": "Metric created successfully"
}
```

---

### Example 2: Create Distance Metric (Centimeter)

**Request:**
```bash
POST /api/metrics
Content-Type: application/json
user-id: user123

{
  "value": 175,
  "unit": "centimeter"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "userId": "user123",
    "date": "2024-01-15T14:20:00.000Z",
    "value": 175,
    "type": "DISTANCE",
    "unit": "CENTIMETER",
    "createdAt": "2024-01-15T14:20:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z",
    "formattedDate": "2024-01-15T14:20:00.000Z"
  },
  "message": "Metric created successfully"
}
```

---

### Example 3: Create Temperature Metric (Celsius)

**Request:**
```bash
POST /api/metrics
Content-Type: application/json
user-id: user456

{
  "date": "2024-01-15T14:30:00Z",
  "value": 25.5,
  "unit": "celsius"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "userId": "user456",
    "date": "2024-01-15T14:30:00.000Z",
    "value": 25.5,
    "type": "TEMPERATURE",
    "unit": "CELSIUS",
    "createdAt": "2024-01-15T14:30:00.000Z",
    "updatedAt": "2024-01-15T14:30:00.000Z",
    "formattedDate": "2024-01-15T14:30:00.000Z"
  },
  "message": "Metric created successfully"
}
```

---

### Example 4: Create Temperature Metric (Fahrenheit)

**Request:**
```bash
POST /api/metrics
Content-Type: application/json
user-id: user789

{
  "value": 98.6,
  "unit": "fahrenheit"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
    "userId": "user789",
    "date": "2024-01-15T15:00:00.000Z",
    "value": 98.6,
    "type": "TEMPERATURE",
    "unit": "FAHRENHEIT",
    "createdAt": "2024-01-15T15:00:00.000Z",
    "updatedAt": "2024-01-15T15:00:00.000Z",
    "formattedDate": "2024-01-15T15:00:00.000Z"
  },
  "message": "Metric created successfully"
}
```

---

### Example 5: All Distance Units

```bash
# Meter
POST /api/metrics
Headers: user-id: user123
{"value": 1000, "unit": "meter"}

# Centimeter
POST /api/metrics
Headers: user-id: user123
{"value": 100000, "unit": "centimeter"}

# Inch
POST /api/metrics
Headers: user-id: user123
{"value": 39370, "unit": "inch"}

# Feet
POST /api/metrics
Headers: user-id: user123
{"value": 3280, "unit": "feet"}

# Yard
POST /api/metrics
Headers: user-id: user123
{"value": 1094, "unit": "yard"}
```

---

### Example 6: All Temperature Units

```bash
# Celsius
POST /api/metrics
Headers: user-id: user456
{"value": 25, "unit": "celsius"}

# Fahrenheit
POST /api/metrics
Headers: user-id: user456
{"value": 77, "unit": "fahrenheit"}

# Kelvin
POST /api/metrics
Headers: user-id: user456
{"value": 298, "unit": "kelvin"}
```

---

## Error Responses

### Validation Error (400 Bad Request)

**Missing userId:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "userId",
      "message": "User ID is required"
    }
  ]
}
```

**Missing value:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "value",
      "message": "Value must be a valid number"
    }
  ]
}
```

**Invalid unit:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "unit",
      "message": "Invalid unit. Must be one of: METER, CENTIMETER, INCH, FEET, YARD, CELSIUS, FAHRENHEIT, KELVIN"
    }
  ]
}
```

**Multiple validation errors:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "userId",
      "message": "User ID is required"
    },
    {
      "field": "value",
      "message": "Value must be a valid number"
    },
    {
      "field": "unit",
      "message": "Unit is required"
    }
  ]
}
```

---

## Testing with cURL

### Create Distance Metric:
```bash
curl -X POST http://localhost:3000/api/metrics \
  -H "Content-Type: application/json" \
  -H "user-id: user123" \
  -d '{
    "date": "2024-01-15T10:30:00Z",
    "value": 1500,
    "unit": "meter"
  }'
```

### Create Temperature Metric:
```bash
curl -X POST http://localhost:3000/api/metrics \
  -H "Content-Type: application/json" \
  -H "user-id: user456" \
  -d '{
    "value": 25.5,
    "unit": "celsius"
  }'
```

### Without Date (uses current time):
```bash
curl -X POST http://localhost:3000/api/metrics \
  -H "Content-Type: application/json" \
  -H "user-id: user789" \
  -d '{
    "value": 100,
    "unit": "centimeter"
  }'
```

---

## Notes

1. **Unit is case-insensitive**: You can send "meter", "METER", or "Meter" - the backend will convert it to uppercase.

2. **Type is auto-determined**: You don't need to send the `type` field. The backend automatically determines it based on the unit:
   - Units: METER, CENTIMETER, INCH, FEET, YARD → Type: DISTANCE
   - Units: CELSIUS, FAHRENHEIT, KELVIN → Type: TEMPERATURE

3. **Date is optional**: If not provided, the current date and time will be used.

4. **DTO Validation**: All validation is handled by the DTO (Data Transfer Object) layer before saving to the database.

5. **User ID is required**: Every metric must be associated with a user ID.

