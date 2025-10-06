# Everfit Test - Node.js Express MongoDB API

A modular Node.js REST API built with Express and MongoDB, featuring a comprehensive Metrics module.

## Features

- 🏗️ Modular architecture for better code organization
- 🚀 RESTful API endpoints
- 🗄️ MongoDB integration with Mongoose
- ✅ Input validation using Joi
- 🔍 Base Router with automatic validation
- 📊 Metrics module with DTO pattern
- 🛡️ Error handling middleware
- 📝 Request logging with Morgan
- 🎯 Header validation for authentication

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Validation**: Joi
- **Logging**: Morgan

## Project Structure

```
everfit-test/
├── src/
│   ├── config/
│   │   ├── config.js           # Application configuration
│   │   └── database.js         # Database connection
│   ├── middlewares/
│   │   ├── errorHandler.js     # Global error handler
│   │   └── notFound.js         # 404 handler
│   ├── modules/
│   │   └── metrics/
│   │       ├── metrics.model.js      # Mongoose model
│   │       ├── metrics.service.js    # Business logic
│   │       ├── metrics.controller.js # Request handlers
│   │       ├── metrics.routes.js     # Route definitions
│   │       └── metrics.validator.js  # Input validation
│   ├── utils/
│   │   └── responseHandler.js  # Response utilities
│   └── index.js                # Application entry point
├── .gitignore
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd everfit-test
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/everfit-test
NODE_ENV=development
```

4. Make sure MongoDB is running on your system.

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /` - API health check

### Metrics Module

#### Create a Metric
- **POST** `/api/metrics`
- **Headers**:
  - `user-id`: User identifier (required)
- **Body**:
```json
{
  "date": "2024-01-15T10:30:00Z",
  "value": 1500,
  "unit": "meter"
}
```

Or for Temperature:
```json
{
  "date": "2024-01-15T14:30:00Z",
  "value": 25.5,
  "unit": "celsius"
}
```

**Note:** 
- `userId` is passed in the **header** as `user-id`
- `date` is **required** in ISO 8601 format
- The `type` field is automatically determined by the backend based on the `unit`
- Unit is case-insensitive (will be converted to uppercase)

## Metrics Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | String | Yes | User identifier (from header) |
| date | Date | Yes | Measurement date (ISO 8601 format) |
| value | Number | Yes | Metric value |
| type | String | Auto | Metric type: DISTANCE or TEMPERATURE (determined by BE) |
| unit | String | Yes | Unit of measurement (case-insensitive) |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

### Available Units (Type Auto-Determined)

**Distance Units:**
- METER
- CENTIMETER
- INCH
- FEET
- YARD

**Temperature Units:**
- CELSIUS
- FAHRENHEIT
- KELVIN

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "stack": "Stack trace (only in development)"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

## Error Handling

The API uses a centralized error handling middleware that catches and formats errors consistently:
- 400: Bad Request (validation errors)
- 404: Not Found
- 500: Internal Server Error

## Development

### Adding a New Module

1. Create a new folder in `src/modules/`
2. Create the following files:
   - `<module>.model.js` - Mongoose schema
   - `<module>.service.js` - Business logic
   - `<module>.controller.js` - Request handlers
   - `<module>.routes.js` - Route definitions
   - `<module>.validator.js` - Input validation
3. Import routes in `src/index.js`

### Code Organization

- **Models**: Define database schemas and models
- **Services**: Contain business logic and database operations
- **Controllers**: Handle HTTP requests/responses
- **Routes**: Define API endpoints
- **Validators**: Validate input data
- **Middlewares**: Process requests before reaching controllers
- **Utils**: Reusable utility functions

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/everfit-test |
| NODE_ENV | Environment mode | development |

## License

ISC

## Author

Your Name

