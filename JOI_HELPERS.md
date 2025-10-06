# Joi Helpers - Auto-Generate Validation Messages

## Overview

The Joi Helpers system automatically generates validation messages based on field names and validation rules, eliminating the need to manually write `.messages()` for each field.

---

## Location

`src/shared/utils/joiHelpers.js`

---

## Core Functions

### 1. `createJoiSchema(schemaDefinition)`

Creates a Joi schema with auto-generated messages.

**Parameters:**
- `schemaDefinition` (Object) - Schema definition object

**Returns:**
- Joi schema object with auto-generated messages

### 2. `field(validator, options)`

Helper function to define a field with validation rules.

**Parameters:**
- `validator` (Joi) - Joi validator
- `options` (Object) - Optional configuration
  - `required` (Boolean) - Is field required? (default: true)
  - `messages` (Object) - Custom messages to override defaults

**Returns:**
- Field definition object

### 3. `generateMessages(fieldName, fieldDef)`

Generates validation messages based on field name and validator.

**Parameters:**
- `fieldName` (String) - Name of the field
- `fieldDef` (Object) - Field definition

**Returns:**
- Object with validation messages

---

## Usage

### Before (Manual Messages)

```javascript
const schema = Joi.object({
  date: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'Date must be a valid date',
      'date.format': 'Date must be in ISO 8601 format',
      'any.required': 'Date is required',
    }),

  value: Joi.number()
    .required()
    .messages({
      'number.base': 'Value must be a number',
      'any.required': 'Value is required',
    }),

  unit: Joi.string()
    .uppercase()
    .valid('METER', 'CENTIMETER')
    .required()
    .messages({
      'string.base': 'Unit must be a string',
      'any.only': 'Unit must be one of: METER, CENTIMETER',
      'any.required': 'Unit is required',
    }),
});
```

### After (Auto-Generated Messages)

```javascript
const { createJoiSchema, field } = require('../../../shared/utils/joiHelpers');

const schema = createJoiSchema({
  date: field(
    Joi.date().iso().required()
  ),

  value: field(
    Joi.number().required()
  ),

  unit: field(
    Joi.string().uppercase().valid('METER', 'CENTIMETER').required()
  ),
});
```

**Auto-generated messages:**
- `date` → "Date is required", "Date must be a valid date", "Date must be in ISO 8601 format"
- `value` → "Value is required", "Value must be a number"
- `unit` → "Unit is required", "Unit must be a string", "Unit must be one of: METER, CENTIMETER"

---

## Message Generation Rules

### Field Name Capitalization

Field names are automatically capitalized in messages:
- `date` → "Date"
- `value` → "Value"  
- `userId` → "UserId"
- `emailAddress` → "EmailAddress"

### Type-Based Messages

#### String
```javascript
field(Joi.string().required())
```
**Generates:**
- `string.base`: "FieldName must be a string"
- `string.empty`: "FieldName cannot be empty"
- `any.required`: "FieldName is required"

With additional rules:
```javascript
field(Joi.string().min(3).max(100).email())
```
**Additional messages:**
- `string.min`: "FieldName must be at least 3 characters"
- `string.max`: "FieldName cannot exceed 100 characters"
- `string.email`: "FieldName must be a valid email"

#### Number
```javascript
field(Joi.number().required())
```
**Generates:**
- `number.base`: "FieldName must be a number"
- `any.required`: "FieldName is required"

With additional rules:
```javascript
field(Joi.number().min(0).max(100).positive().integer())
```
**Additional messages:**
- `number.min`: "FieldName must be at least 0"
- `number.max`: "FieldName cannot exceed 100"
- `number.positive`: "FieldName must be a positive number"
- `number.integer`: "FieldName must be an integer"

#### Date
```javascript
field(Joi.date().iso().required())
```
**Generates:**
- `date.base`: "FieldName must be a valid date"
- `date.format`: "FieldName must be in ISO 8601 format"
- `any.required`: "FieldName is required"

#### Array
```javascript
field(Joi.array().items(Joi.string()).required())
```
**Generates:**
- `array.base`: "FieldName must be an array"
- `any.required`: "FieldName is required"

#### Object
```javascript
field(Joi.object().required())
```
**Generates:**
- `object.base`: "FieldName must be an object"
- `any.required`: "FieldName is required"

#### Enum (using .valid())
```javascript
field(Joi.string().valid('admin', 'user', 'guest').required())
```
**Generates:**
- `string.base`: "FieldName must be a string"
- `any.only`: "FieldName must be one of: admin, user, guest"
- `any.required`: "FieldName is required"

---

## Optional Fields

For optional fields, set `required: false`:

```javascript
const schema = createJoiSchema({
  name: field(
    Joi.string().optional(),
    { required: false }
  ),
  
  age: field(
    Joi.number().optional(),
    { required: false }
  ),
});
```

**Generated messages (no "required" message):**
- `string.base`: "Name must be a string"
- `number.base`: "Age must be a number"

---

## Custom Messages Override

You can override auto-generated messages:

```javascript
const schema = createJoiSchema({
  email: field(
    Joi.string().email().required(),
    {
      messages: {
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is mandatory',
      }
    }
  ),
});
```

---

## Real-World Examples

### Example 1: Simple Schema

```javascript
const userSchema = createJoiSchema({
  username: field(Joi.string().min(3).max(30).required()),
  password: field(Joi.string().min(8).required()),
  age: field(Joi.number().min(18).max(100).required()),
});
```

**Auto-generated messages:**
- Username: "Username is required", "Username must be a string", "Username must be at least 3 characters", "Username cannot exceed 30 characters"
- Password: "Password is required", "Password must be a string", "Password must be at least 8 characters"
- Age: "Age is required", "Age must be a number", "Age must be at least 18", "Age cannot exceed 100"

### Example 2: With Optional Fields

```javascript
const profileSchema = createJoiSchema({
  name: field(Joi.string().required()),
  bio: field(Joi.string().max(500).optional(), { required: false }),
  website: field(Joi.string().uri().optional(), { required: false }),
});
```

### Example 3: With Enums

```javascript
const orderSchema = createJoiSchema({
  status: field(
    Joi.string().valid('pending', 'processing', 'completed', 'cancelled').required()
  ),
  priority: field(
    Joi.string().valid('low', 'medium', 'high').required()
  ),
});
```

**Auto-generated:**
- Status: "Status must be one of: pending, processing, completed, cancelled"
- Priority: "Priority must be one of: low, medium, high"

### Example 4: Complex Schema

```javascript
const productSchema = createJoiSchema({
  name: field(Joi.string().min(3).max(100).required()),
  
  price: field(Joi.number().positive().precision(2).required()),
  
  category: field(
    Joi.string().valid('electronics', 'clothing', 'food').required()
  ),
  
  tags: field(
    Joi.array().items(Joi.string()).min(1).max(10).required()
  ),
  
  description: field(
    Joi.string().max(1000).optional(),
    { required: false }
  ),
  
  inStock: field(Joi.boolean().required()),
});
```

---

## Benefits

✅ **Less Code** - No need to write `.messages()` for each field  
✅ **Consistency** - All messages follow the same pattern  
✅ **Maintainability** - Change message format in one place  
✅ **Auto-Discovery** - Messages generated from validation rules  
✅ **DRY Principle** - Don't repeat yourself  
✅ **Flexibility** - Can still override when needed  

---

## Comparison

### Lines of Code

**Before:**
```javascript
const schema = Joi.object({
  date: Joi.date().iso().required().messages({
    'date.base': 'Date must be a valid date',
    'date.format': 'Date must be in ISO 8601 format',
    'any.required': 'Date is required',
  }),
  value: Joi.number().required().messages({
    'number.base': 'Value must be a number',
    'any.required': 'Value is required',
  }),
  unit: Joi.string().valid(...units).required().messages({
    'string.base': 'Unit must be a string',
    'any.only': `Unit must be one of: ${units.join(', ')}`,
    'any.required': 'Unit is required',
  }),
});
// Total: ~20 lines
```

**After:**
```javascript
const schema = createJoiSchema({
  date: field(Joi.date().iso().required()),
  value: field(Joi.number().required()),
  unit: field(Joi.string().valid(...units).required()),
});
// Total: 5 lines (75% reduction!)
```

---

## Advanced Usage

### Custom Message Format

Want to change message format globally? Edit `joiHelpers.js`:

```javascript
// Change from "Field is required" to "Field là bắt buộc" (Vietnamese)
if (fieldDef.required !== false) {
  messages['any.required'] = `${capitalizedField} là bắt buộc`;
}
```

### Add New Validation Types

Add support for new validation types in `generateMessages()`:

```javascript
case 'boolean':
  messages['boolean.base'] = `${capitalizedField} must be a boolean`;
  break;
```

---

## Migration Guide

### Step 1: Import helpers

```javascript
const { createJoiSchema, field } = require('../../../shared/utils/joiHelpers');
```

### Step 2: Replace Joi.object() with createJoiSchema()

```javascript
// Before
const schema = Joi.object({
  // fields
});

// After
const schema = createJoiSchema({
  // fields
});
```

### Step 3: Wrap validators with field()

```javascript
// Before
name: Joi.string().required().messages({ ... }),

// After
name: field(Joi.string().required()),
```

### Step 4: Remove .messages()

Done! Messages are now auto-generated.

---

## Testing

Test auto-generated messages:

```javascript
const schema = createJoiSchema({
  email: field(Joi.string().email().required()),
});

const { error } = schema.validate({});

console.log(error.details);
// [{ message: 'Email is required', path: ['email'], type: 'any.required' }]

const { error: error2 } = schema.validate({ email: 'invalid' });

console.log(error2.details);
// [{ message: 'Email must be a valid email', path: ['email'], type: 'string.email' }]
```

---

## Current Implementation

✅ **Files Using Auto-Generated Messages:**
- `src/modules/metrics/validations/metric.validation.js`

✅ **Supported Types:**
- String, Number, Date, Array, Object, Enum

✅ **Supported Rules:**
- required, min, max, email, positive, integer, valid()

