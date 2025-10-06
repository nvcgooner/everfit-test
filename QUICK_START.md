# Quick Start Guide

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/everfit-test
NODE_ENV=development
```

3. **Start MongoDB:**
Make sure MongoDB is running on your system.

4. **Run the application:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

---

## Test the API

### Using cURL

**Create a Distance Metric:**
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

**Create a Temperature Metric:**
```bash
curl -X POST http://localhost:3000/api/metrics \
  -H "Content-Type: application/json" \
  -H "user-id: user456" \
  -d '{
    "date": "2024-01-15T14:30:00Z",
    "value": 25.5,
    "unit": "celsius"
  }'
```

### Using REST Client (VS Code)

Open `test-api.http` file and click "Send Request" above each test case.

---

## Project Structure

```
src/
├── shared/
│   ├── base/              # Base classes
│   │   ├── baseController.js
│   │   └── baseRouter.js
│   ├── enums/             # Shared enums
│   │   └── metric.enum.js
│   └── middlewares/       # Shared middlewares
│       ├── validateHeaders.js
│       └── validateRequest.js
│
├── modules/
│   └── metrics/
│       ├── validations/   # Joi schemas
│       ├── dto/          # Data Transfer Objects
│       ├── metrics.model.js
│       ├── metrics.service.js
│       ├── metrics.controller.js
│       └── metrics.routes.js
│
└── config/
    ├── config.js
    └── database.js
```

---

## Key Features

### 1. Base Router with Validation
```javascript
// metrics.routes.js
baseRouter.post(
  '/',
  [
    validateUserId,                     // Validate header
    validateRequest(createMetricSchema) // Validate body with Joi
  ],
  controller.createMetric
);
```

### 2. Joi Validation
```javascript
// validations/metric.validation.js
const createMetricSchema = Joi.object({
  value: Joi.number().required(),
  unit: Joi.string().uppercase().valid(...units).required(),
  date: Joi.date().iso().optional()
});
```

### 3. DTO Pattern
```javascript
// dto/create-metric.dto.js
class CreateMetricDto {
  constructor(data) {
    this.userId = data.userId;
    this.value = data.value;
    this.unit = data.unit; // Already validated and uppercase
    this.type = this.determineType(this.unit); // Auto-determine
  }
}
```

### 4. Base Controller
```javascript
// metrics.controller.js
class MetricsController extends BaseController {
  async createMetric(req, res, next) {
    const metric = await service.createMetric(req.body);
    return this.sendCreated(res, metric, 'Success');
  }
}
```

---

## API Endpoints

### POST /api/metrics
Create a new metric

**Headers:**
- `user-id`: User identifier (required)

**Body:**
```json
{
  "date": "2024-01-15T10:30:00Z",
  "value": 1500,
  "unit": "meter"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "value": 1500,
    "unit": "METER",
    "type": "DISTANCE",
    "date": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Metric created successfully"
}
```

---

## Available Units

### Distance
- METER
- CENTIMETER
- INCH
- FEET
- YARD

### Temperature
- CELSIUS
- FAHRENHEIT
- KELVIN

**Note:** Units are case-insensitive in request, automatically converted to uppercase.

---

## Validation

All requests are validated with Joi:

✅ **Header validation** - `user-id` is required  
✅ **Body validation** - Schema validation with Joi  
✅ **Type safety** - Automatic type checking  
✅ **Data transformation** - Auto uppercase for units  
✅ **Custom error messages** - User-friendly validation errors  

---

## Error Responses

### Missing Required Field
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

### Invalid Unit
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

## Documentation

- **README.md** - Project overview and setup
- **API_DOCUMENTATION.md** - Complete API reference
- **STRUCTURE.md** - Architecture and patterns
- **VALIDATION.md** - Joi validation guide
- **test-api.http** - Ready-to-use test cases

---

## Next Steps

1. ✅ Test the API with provided examples
2. ✅ Review validation schemas
3. ✅ Understand the architecture
4. ✅ Add more modules following the same pattern
5. ✅ Customize as needed

Happy coding! 🚀

