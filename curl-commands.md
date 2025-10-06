# CURL Commands for GET Metrics API

## Basic Usage

### 1. Get All Metrics (Required: startDate & endDate)
```bash
curl -X GET 'http://localhost:3000/api/metrics?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \
  -H 'user-id: user123'
```

### 2. Get Metrics - Filter by Type (DISTANCE)
```bash
curl -X GET 'http://localhost:3000/api/metrics?type=DISTANCE&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \
  -H 'user-id: user123'
```

### 3. Get Metrics - Filter by Type (TEMPERATURE)
```bash
curl -X GET 'http://localhost:3000/api/metrics?type=TEMPERATURE&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \
  -H 'user-id: user456'
```

### 4. Get Metrics - With Unit Conversion (to FEET)
```bash
curl -X GET 'http://localhost:3000/api/metrics?unit=FEET&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \
  -H 'user-id: user123'
```

**Response:** All distance values will be converted to FEET
```json
{
  "success": true,
  "data": [
    {
      "value": 4.92,
      "unit": "FEET",
      "originalValue": 1500,
      "originalUnit": "METER"
    }
  ]
}
```

### 5. Get Metrics - With Unit Conversion (to FAHRENHEIT)
```bash
curl -X GET 'http://localhost:3000/api/metrics?unit=FAHRENHEIT&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \
  -H 'user-id: user456'
```

### 6. Get Metrics - All Filters + Unit Conversion
```bash
curl -X GET 'http://localhost:3000/api/metrics?type=DISTANCE&unit=METER&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \
  -H 'user-id: user123'
```

### 7. Get Metrics - Specific Date Range
```bash
curl -X GET 'http://localhost:3000/api/metrics?startDate=2024-01-15T00:00:00Z&endDate=2024-01-15T23:59:59Z' \
  -H 'user-id: user123'
```

## Error Test Cases

### 8. Missing startDate (Should Return 400 Error)
```bash
curl -X GET 'http://localhost:3000/api/metrics?endDate=2024-12-31T23:59:59Z' \
  -H 'user-id: user123'
```

**Expected Response:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "startDate",
      "message": "StartDate is required"
    }
  ]
}
```

### 9. Missing endDate (Should Return 400 Error)
```bash
curl -X GET 'http://localhost:3000/api/metrics?startDate=2024-01-01T00:00:00Z' \
  -H 'user-id: user123'
```

### 10. Missing user-id Header (Should Return 400 Error)
```bash
curl -X GET 'http://localhost:3000/api/metrics?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z'
```

**Expected Response:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "user-id",
      "message": "User-id is required"
    }
  ]
}
```

### 11. Invalid Type (Should Return 400 Error)
```bash
curl -X GET 'http://localhost:3000/api/metrics?type=INVALID&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \
  -H 'user-id: user123'
```

### 12. Invalid Unit (Should Return 400 Error)
```bash
curl -X GET 'http://localhost:3000/api/metrics?unit=INVALID_UNIT&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \
  -H 'user-id: user123'
```

## Query Parameters

| Parameter | Required | Type | Valid Values | Description |
|-----------|----------|------|--------------|-------------|
| `startDate` | ✅ Yes | ISO 8601 Date | Any valid date | Start of date range |
| `endDate` | ✅ Yes | ISO 8601 Date | Any valid date | End of date range |
| `type` | ❌ No | String | `DISTANCE`, `TEMPERATURE` | Filter by metric type |
| `unit` | ❌ No | String | Distance: `METER`, `CENTIMETER`, `INCH`, `FEET`, `YARD`<br>Temperature: `CELSIUS`, `FAHRENHEIT`, `KELVIN` | Convert results to this unit |

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `user-id` | ✅ Yes | User identifier |

## Notes

- **Date Format**: Must be ISO 8601 format (e.g., `2024-01-15T10:30:00Z`)
- **Unit Conversion**: The `unit` parameter converts the response data, not filter the query
- **Type Filter**: Only returns metrics matching the specified type
- **Original Values**: When unit conversion is applied, the response includes both converted and original values
- **Sorting**: Results are sorted by date in descending order (newest first)

