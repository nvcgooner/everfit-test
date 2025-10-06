# DTO Pattern - Simple Function Approach

## Overview

DTOs are simple functions that transform request data into model data. They are called directly in the controller.

---

## Pattern

### DTO as Function

```javascript
// dto/create-metric.dto.js
const createMetricDto = (req) => {
  // Transform and return model data
  return {
    userId: req.userId,
    date: new Date(req.body.date),
    value: req.body.value,
    unit: req.body.unit,
    type: determineType(req.body.unit),
  };
};

module.exports = createMetricDto;
```

### Usage in Controller

```javascript
// controller.js
const createMetricDto = require('./dto/create-metric.dto');

async createMetric(req, res, next) {
  // Transform request with DTO
  const modelData = createMetricDto(req);
  
  // Use transformed data
  const metric = await service.createMetric(modelData);
  
  return this.sendCreated(res, metric);
}
```

---

## Complete Example

### 1. Define DTO Function

```javascript
// dto/create-metric.dto.js
const { METRIC_TYPES, DISTANCE_UNITS, TEMPERATURE_UNITS } = require('../../../shared/enums/metric.enum');

const determineType = (unit) => {
  if (Object.values(DISTANCE_UNITS).includes(unit)) {
    return METRIC_TYPES.DISTANCE;
  }
  if (Object.values(TEMPERATURE_UNITS).includes(unit)) {
    return METRIC_TYPES.TEMPERATURE;
  }
  return null;
};

const createMetricDto = (req) => {
  const { date, value, unit } = req.body;
  const userId = req.userId;

  return {
    userId,
    date: date instanceof Date ? date : new Date(date),
    value,
    unit,
    type: determineType(unit),
  };
};

module.exports = createMetricDto;
```

### 2. Use in Controller

```javascript
// metrics.controller.js
const createMetricDto = require('./dto/create-metric.dto');

class MetricsController extends BaseController {
  async createMetric(req, res, next) {
    try {
      // Transform with DTO
      const modelData = createMetricDto(req);
      
      // Create metric
      const metric = await metricsService.createMetric(modelData);
      
      return this.sendCreated(res, metric, 'Metric created successfully');
    } catch (error) {
      next(error);
    }
  }
}
```

### 3. Service

```javascript
// metrics.service.js
class MetricsService {
  async createMetric(modelData) {
    return await Metric.create(modelData);
  }
}
```

---

## Request Flow

```
1. Client sends request
   ↓
2. validateUserId middleware
   → req.userId = "user123"
   ↓
3. validateRequest middleware
   → req.body = { date, value, unit: "METER" }
   ↓
4. Controller
   → modelData = createMetricDto(req)
   → { userId, date, value, unit, type: "DISTANCE" }
   ↓
5. Service
   → Metric.create(modelData)
```

---

## Multiple DTOs

### Create DTO

```javascript
// dto/create-metric.dto.js
const createMetricDto = (req) => {
  return {
    userId: req.userId,
    date: new Date(req.body.date),
    value: req.body.value,
    unit: req.body.unit,
    type: determineType(req.body.unit),
  };
};

module.exports = createMetricDto;
```

### Update DTO

```javascript
// dto/update-metric.dto.js
const updateMetricDto = (req) => {
  const updates = {};
  
  if (req.body.date) {
    updates.date = new Date(req.body.date);
  }
  
  if (req.body.value !== undefined) {
    updates.value = req.body.value;
  }
  
  if (req.body.unit) {
    updates.unit = req.body.unit;
    updates.type = determineType(req.body.unit);
  }
  
  return updates;
};

module.exports = updateMetricDto;
```

### Usage

```javascript
// In controller
const createMetricDto = require('./dto/create-metric.dto');
const updateMetricDto = require('./dto/update-metric.dto');

async createMetric(req, res, next) {
  const modelData = createMetricDto(req);
  // ...
}

async updateMetric(req, res, next) {
  const updates = updateMetricDto(req);
  // ...
}
```

---

## Benefits

✅ **Simple** - Just a function, no class overhead  
✅ **Clear** - Input: req, Output: model data  
✅ **Testable** - Easy to test pure functions  
✅ **Flexible** - Can have helper functions  
✅ **Direct** - Called directly in controller  

---

## Example: User DTO

```javascript
// dto/create-user.dto.js
const createUserDto = (req) => {
  const { email, username, firstName, lastName } = req.body;
  
  return {
    userId: req.userId,
    email: email.toLowerCase(),
    username,
    fullName: `${firstName} ${lastName}`.trim(),
    role: 'user',
    createdAt: new Date(),
  };
};

module.exports = createUserDto;
```

---

## Example: Order DTO

```javascript
// dto/create-order.dto.js
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const createOrderDto = (req) => {
  const { items, shippingAddress } = req.body;
  
  return {
    userId: req.userId,
    items,
    shippingAddress,
    total: calculateTotal(items),
    status: 'pending',
    orderDate: new Date(),
  };
};

module.exports = createOrderDto;
```

---

## Testing

```javascript
// __tests__/dto/create-metric.dto.test.js
const createMetricDto = require('../dto/create-metric.dto');

describe('createMetricDto', () => {
  it('should transform request to model data', () => {
    const req = {
      userId: 'user123',
      body: {
        date: '2024-01-15T10:30:00Z',
        value: 1500,
        unit: 'METER',
      },
    };
    
    const result = createMetricDto(req);
    
    expect(result).toEqual({
      userId: 'user123',
      date: expect.any(Date),
      value: 1500,
      unit: 'METER',
      type: 'DISTANCE',
    });
  });
  
  it('should determine type from unit', () => {
    const req = {
      userId: 'user123',
      body: {
        date: '2024-01-15T10:30:00Z',
        value: 25,
        unit: 'CELSIUS',
      },
    };
    
    const result = createMetricDto(req);
    
    expect(result.type).toBe('TEMPERATURE');
  });
});
```

---

## Best Practices

### 1. One Function Per Operation

```javascript
// ✅ Good
const createMetricDto = (req) => { /* ... */ };
const updateMetricDto = (req) => { /* ... */ };

// ❌ Bad - One function for multiple operations
const metricDto = (req, operation) => {
  if (operation === 'create') { /* ... */ }
  if (operation === 'update') { /* ... */ }
};
```

### 2. Pure Functions

```javascript
// ✅ Good - Pure function
const createMetricDto = (req) => {
  return {
    userId: req.userId,
    value: req.body.value,
    // ...
  };
};

// ❌ Bad - Side effects
const createMetricDto = (req) => {
  console.log('Creating metric');  // Side effect
  req.transformed = true;           // Mutates input
  // ...
};
```

### 3. Extract Helper Functions

```javascript
// ✅ Good
const determineType = (unit) => { /* ... */ };
const formatDate = (date) => { /* ... */ };

const createMetricDto = (req) => {
  return {
    type: determineType(req.body.unit),
    date: formatDate(req.body.date),
    // ...
  };
};

// ❌ Bad - All logic inline
const createMetricDto = (req) => {
  return {
    type: req.body.unit === 'METER' ? 'DISTANCE' : 'TEMPERATURE',
    date: req.body.date instanceof Date ? req.body.date : new Date(req.body.date),
    // ...
  };
};
```

---

## Comparison

### DTO as Class (Before)

```javascript
class CreateMetricDto {
  constructor(data) {
    this.userId = data.userId;
    this.value = data.value;
  }
  
  toModel() {
    return { /* ... */ };
  }
}

// Usage
const dto = new CreateMetricDto(data);
const modelData = dto.toModel();
```

### DTO as Function (After)

```javascript
const createMetricDto = (req) => {
  return {
    userId: req.userId,
    value: req.body.value,
    // ...
  };
};

// Usage
const modelData = createMetricDto(req);
```

**Benefits of Function:**
- ✅ Simpler
- ✅ Less code
- ✅ No class overhead
- ✅ Direct transformation

---

## Summary

DTO Pattern with Functions:
1. **Define** - Simple function that takes `req` and returns model data
2. **Transform** - Business logic to transform/enrich data
3. **Return** - Clean model data ready for database
4. **Use** - Call directly in controller

Simple, clean, and effective! 🎯

