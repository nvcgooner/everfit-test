## API Documentation

You can view and try the API online using Swagger UI at:

```
http://localhost:3000/api-docs
```

This documentation is generated from `docs/swagger.yaml` and includes all available endpoints, parameters, and response formats.
## Everfit Test Project

### Setup & Usage


#### 1. Prepare environment variables

Copy the example environment file and adjust values if needed:

```bash
copy .env.example .env
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Run development server

```bash
npm run dev
```

#### 4. Running Unit Tests

To run all unit tests (using Jest):

```bash
npm test
```

#### 5. Seed sample data

You can seed sample data for metrics using one of the provided scripts:

```bash
node scripts/seed.js
```
or
```bash
node scripts/seed.api.js
```

### API Design Idea

The GET /api/metrics endpoint is designed to group and aggregate metric data into buckets based on time ranges. This approach ensures that the client receives a reasonable and manageable amount of data points, making it efficient for chart rendering and visualization. The bucket size and maximum data points can be controlled via query parameters, allowing flexible chart resolutions for different use cases.
#### Missing Features: can be added but skipped due to time constraint
- Can be further optimized by applying MongoDB Time Series collections for more efficient time series data storage and querying
