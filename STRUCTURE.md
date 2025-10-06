# Project Structure

## Overview

Node.js Express + MongoDB application with modular architecture, featuring a Metrics module with DTO pattern.

## Directory Structure

```
everfit-test/
├── src/
│   ├── config/
│   │   ├── config.js              # App configuration
│   │   └── database.js            # MongoDB connection
│   │
│   ├── shared/
│   │   ├── base/
│   │   │   ├── baseController.js  # Base controller class
│   │   │   ├── baseRouter.js      # Base router factory
│   │   │   └── index.js           # Base exports
│   │   ├── constants/
│   │   │   ├── validationMessages.js # Shared validation messages
│   │   │   └── index.js           # Constants exports
│   │   ├── enums/
│   │   │   └── metric.enum.js     # Shared enums (UPPERCASE format)
│   │   └── middlewares/
│   │       ├── validateHeaders.js # Header validation middleware
│   │       ├── validateRequest.js # Joi validation middleware
│   │       └── index.js           # Middleware exports
│   │
│   ├── modules/
│   │   └── metrics/
│   │       ├── dto/
│   │       │   └── create-metric.dto.js  # Data Transfer Object
│   │       ├── validations/
│   │       │   └── metric.validation.js  # Joi validation schemas
│   │       ├── metrics.model.js          # Mongoose model
│   │       ├── metrics.service.js        # Business logic
│   │       ├── metrics.controller.js     # Request handler (extends BaseController)
│   │       └── metrics.routes.js         # API routes (uses BaseRouter)
│   │
│   ├── middlewares/
│   │   ├── errorHandler.js        # Global error handler
│   │   └── notFound.js            # 404 handler
│   │
│   ├── utils/
│   │   └── responseHandler.js     # Response utilities
│   │
│   └── index.js                   # Application entry point
│
├── .gitignore
├── package.json
├── README.md
├── API_DOCUMENTATION.md           # Complete API documentation
├── test-api.http                  # HTTP test file
└── STRUCTURE.md                   # This file
```

## Architecture Layers

### 1. Routes Layer (`metrics.routes.js`)
- Defines API endpoints
- Routes requests to controllers
- Currently: Only POST /api/metrics

### 2. Controller Layer (`metrics.controller.js`)
- Handles HTTP requests/responses
- Calls service layer
- Handles validation errors from DTO

### 3. DTO Layer (`dto/create-metric.dto.js`)
- **Data Transfer Object pattern**
- Validates input data
- Transforms data (e.g., unit to uppercase)
- **Auto-determines type based on unit**
- Converts DTO to model format

### 4. Service Layer (`metrics.service.js`)
- Business logic
- Uses DTO for validation and transformation
- Calls model layer for database operations

### 5. Model Layer (`metrics.model.js`)
- Mongoose schema definition
- Database validation
- Indexes for performance
- Virtual fields

### 6. Shared Layer (`shared/enums/`)
- **Shared enums in UPPERCASE format**
- Used across multiple modules
- Single source of truth for constants

## Data Flow

```
Client Request (with user-id header)
    ↓
Route (metrics.routes.js - BaseRouter)
    ↓
Middleware 1: validateUserId
    ├── Validate user-id header
    └── Attach userId to req.userId
    ↓
Middleware 2: validateRequest (Joi Schema)
    ├── Validate request body with Joi
    ├── Transform data (uppercase unit)
    ├── Strip unknown fields
    └── Replace req.body with validated data
    ↓
Controller (metrics.controller.js)
    ├── Call DTO function: createMetricDto(req)
    ├── DTO transforms data & determines type
    └── Pass to service
    ↓
Service (metrics.service.js)
    ├── Receive transformed data
    └── Save to database
    ↓
Model (metrics.model.js)
    ↓
MongoDB
    ↓
BaseController response methods
    ↓
Response back to Client
```

## Key Features

### DTO Pattern
- **Input validation**: Checks required fields
- **Data transformation**: Unit to uppercase
- **Type determination**: Automatically sets type based on unit
- **Error handling**: Returns structured validation errors

### Enums in Shared Folder
```javascript
// src/shared/enums/metric.enum.js
METRIC_TYPES = {
  DISTANCE: 'DISTANCE',
  TEMPERATURE: 'TEMPERATURE'
}

DISTANCE_UNITS = {
  METER: 'METER',
  CENTIMETER: 'CENTIMETER',
  INCH: 'INCH',
  FEET: 'FEET',
  YARD: 'YARD'
}

TEMPERATURE_UNITS = {
  CELSIUS: 'CELSIUS',
  FAHRENHEIT: 'FAHRENHEIT',
  KELVIN: 'KELVIN'
}
```

### Model Schema
```javascript
{
  userId: String (required, indexed),
  date: Date (required, default: now),
  value: Number (required),
  type: String (required, enum: DISTANCE|TEMPERATURE),
  unit: String (required, enum: all units),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## API Endpoint

### POST /api/metrics

**Headers:**
```
user-id: user123
Content-Type: application/json
```

**Request Body:**
```json
{
  "date": "2024-01-15T10:30:00Z",  // Optional
  "value": 1500,
  "unit": "meter"                   // Case-insensitive
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "date": "2024-01-15T10:30:00.000Z",
    "value": 1500,
    "type": "DISTANCE",              // Auto-determined by BE
    "unit": "METER",                 // Converted to uppercase
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Metric created successfully"
}
```

## How Type is Determined

The DTO automatically determines the type based on the unit:

```javascript
// In create-metric.dto.js
determineType(unit) {
  if (DISTANCE_UNITS includes unit) → return 'DISTANCE'
  if (TEMPERATURE_UNITS includes unit) → return 'TEMPERATURE'
  return null (will fail validation)
}
```

**Example:**
- Unit: "meter" → Type: "DISTANCE"
- Unit: "celsius" → Type: "TEMPERATURE"
- Unit: "FAHRENHEIT" → Type: "TEMPERATURE"
- Unit: "invalid" → Type: null (validation error)

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Reusability**: Enums in shared folder can be used anywhere
3. **Maintainability**: Easy to add new metric types or units
4. **Type Safety**: Enums prevent typos and ensure consistency
5. **Auto-determination**: Frontend doesn't need to send type
6. **Validation**: DTO validates before database operations
7. **Flexibility**: Easy to add more DTOs for different operations

## Future Expansion

To add more APIs (GET, UPDATE, DELETE), simply:
1. Add routes in `metrics.routes.js`
2. Add controllers in `metrics.controller.js`
3. Add/use services in `metrics.service.js`
4. Create DTOs if needed (e.g., `update-metric.dto.js`)

## Testing

Use the `test-api.http` file with REST Client extension in VS Code or similar tools to test the API.

