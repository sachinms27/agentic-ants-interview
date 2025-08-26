# Update Note API

## Overview
The Update Note API allows you to modify existing note records. It provides comprehensive validation, prevents unauthorized field updates, and maintains data integrity.

## Endpoint
```
PUT /api/notes/:id
```

## Request Format
```json
{
  "clientName": "Updated Client Name",
  "meetingDate": "2024-01-15",
  "contactInfo": {
    "phone": "555-0123",
    "email": "updated@email.com"
  },
  "meetingType": "Follow-up",
  "notes": "Updated meeting notes",
  "requirements": {
    "propertyType": "Single Family",
    "bedrooms": 4,
    "bathrooms": 2.5,
    "minPrice": 400000,
    "maxPrice": 600000,
    "preferredAreas": ["Westside", "Downtown"],
    "mustHaves": ["Pool", "Garage"],
    "niceToHaves": ["Garden"],
    "dealBreakers": ["High HOA fees"]
  },
  "timeline": "1-3 months",
  "preApproved": true,
  "followUpDate": "2024-02-01",
  "tags": ["urgent", "first-time-buyer", "family"]
}
```

## Features

### 1. **Partial Updates**
- Update only the fields you need
- All fields are optional in the request body
- Only provided fields will be updated

### 2. **Field Protection**
- **Protected Fields**: `id`, `createdAt` cannot be modified
- **Auto-updated**: `updatedAt` is automatically set to current timestamp
- **All other fields**: Can be updated as needed

### 3. **Validation**
- **Required Fields**: If updating `clientName`, `meetingDate`, or `notes`, they cannot be empty
- **Schema Validation**: MongoDB schema validation is enforced
- **Data Types**: Ensures proper data types for all fields

### 4. **Error Handling**
- **404**: Note not found
- **400**: Validation errors (empty required fields, schema violations)
- **500**: Server errors

## Example Requests

### Update Client Information
```json
PUT /api/notes/123e4567-e89b-12d3-a456-426614174000
{
  "clientName": "John Smith",
  "contactInfo": {
    "phone": "555-0123",
    "email": "john.smith@email.com"
  }
}
```

### Update Property Requirements
```json
PUT /api/notes/123e4567-e89b-12d3-a456-426614174000
{
  "requirements": {
    "bedrooms": 4,
    "bathrooms": 3,
    "maxPrice": 750000,
    "preferredAreas": ["Westside", "Uptown"]
  }
}
```

### Update Timeline and Status
```json
PUT /api/notes/123e4567-e89b-12d3-a456-426614174000
{
  "timeline": "ASAP",
  "preApproved": true,
  "followUpDate": "2024-01-20"
}
```

### Update Tags and Notes
```json
PUT /api/notes/123e4567-e89b-12d3-a456-426614174000
{
  "tags": ["urgent", "ready-to-offer"],
  "notes": "Client is very interested and ready to make an offer this week."
}
```

## Response Format

### Success Response (200)
```json
{
  "message": "Note updated successfully",
  "note": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "clientName": "John Smith",
    "meetingDate": "2024-01-15",
    "contactInfo": {
      "phone": "555-0123",
      "email": "john.smith@email.com"
    },
    "meetingType": "Follow-up",
    "notes": "Updated meeting notes",
    "requirements": {
      "propertyType": "Single Family",
      "bedrooms": 4,
      "bathrooms": 2.5,
      "minPrice": 400000,
      "maxPrice": 600000,
      "preferredAreas": ["Westside", "Downtown"],
      "mustHaves": ["Pool", "Garage"],
      "niceToHaves": ["Garden"],
      "dealBreakers": ["High HOA fees"]
    },
    "timeline": "1-3 months",
    "preApproved": true,
    "followUpDate": "2024-02-01",
    "tags": ["urgent", "first-time-buyer", "family"],
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-15T14:30:00.000Z"
  }
}
```

### Error Responses

#### Note Not Found (404)
```json
{
  "error": "Note not found"
}
```

#### Validation Error (400)
```json
{
  "error": "Validation error",
  "details": [
    "Client name cannot be empty",
    "Notes cannot be empty"
  ]
}
```

#### Server Error (500)
```json
{
  "error": "Error updating note"
}
```

## Field Descriptions

### Basic Information
- **clientName**: Client's full name (required if updating)
- **meetingDate**: Date of the meeting (required if updating)
- **notes**: Meeting notes and details (required if updating)

### Contact Information
- **contactInfo.phone**: Client's phone number
- **contactInfo.email**: Client's email address

### Meeting Details
- **meetingType**: Type of meeting (Initial Consultation, Follow-up, Property Tour, Offer Discussion)
- **timeline**: Client's timeline (ASAP, 1-3 months, 3-6 months, 6+ months)
- **preApproved**: Whether client is pre-approved (boolean)
- **followUpDate**: Date for next follow-up

### Property Requirements
- **requirements.propertyType**: Type of property (Single Family, Condo, Townhouse, Multi-family)
- **requirements.bedrooms**: Number of bedrooms (number)
- **requirements.bathrooms**: Number of bathrooms (number)
- **requirements.minPrice**: Minimum price (number)
- **requirements.maxPrice**: Maximum price (number)
- **requirements.preferredAreas**: Array of preferred neighborhoods
- **requirements.mustHaves**: Array of must-have features
- **requirements.niceToHaves**: Array of nice-to-have features
- **requirements.dealBreakers**: Array of deal-breaker features

### Tags
- **tags**: Array of tags for categorization and search

## Best Practices

### 1. **Partial Updates**
- Only send the fields you want to update
- Reduces bandwidth and processing time
- Minimizes risk of unintended changes

### 2. **Validation**
- Always validate data on the client side
- Handle validation errors gracefully
- Provide clear error messages to users

### 3. **Error Handling**
- Implement proper error handling for all response codes
- Log errors for debugging
- Provide user-friendly error messages

### 4. **Data Integrity**
- Use the returned updated note for UI updates
- Don't assume the update was successful without checking the response
- Handle network errors and timeouts appropriately

## Security Considerations

- **Field Protection**: Critical fields like `id` and `createdAt` are protected
- **Input Validation**: All input is validated against the schema
- **SQL Injection**: MongoDB prevents SQL injection attacks
- **Authentication**: Ensure proper authentication before allowing updates

## Performance Notes

- **Indexing**: The `id` field is indexed for fast lookups
- **Validation**: Schema validation runs on every update
- **Timestamps**: `updatedAt` is automatically managed
- **Partial Updates**: Only modified fields are processed
