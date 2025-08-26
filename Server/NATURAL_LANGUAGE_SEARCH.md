# Natural Language Search API

## Overview
The Natural Language Search API provides an intelligent search system that understands context and intent from natural language queries. It uses regex patterns to extract specific criteria and builds MongoDB queries accordingly.

## Endpoint
```
POST /api/notes/search/natural
```

## Request Format
```json
{
  "query": "clients looking for 3 bed 2 bath homes in Westside under 600k"
}
```

## Features

### 1. Property Requirements Detection
- **Bedrooms**: Recognizes patterns like "3 bed", "4+ bedrooms", "2 BR"
- **Bathrooms**: Identifies "2 bath", "3 bathrooms", "2.5 BA"
- **Price Ranges**: Understands "under 600k", "over 800k", "500k budget"

### 2. Location Preferences
- **Areas**: Westside, downtown, uptown, midtown, suburbs
- **Proximity**: "near", "in", "around", "close to"
- **School Districts**: "good schools", "school district"

### 3. Client Type Recognition
- **First-time Buyers**: "first-time", "first time", "new buyer"
- **Investors**: "investor", "investment property"
- **Families**: "family", "families", "with children"

### 4. Approval & Timeline
- **Pre-approval**: "pre-approval", "pre approval", "approved"
- **Urgency**: "urgent", "ASAP", "this month", "ready to offer"

### 5. Special Requirements
- **Pet-friendly**: "pet-friendly", "pet friendly"
- **Amenities**: "pool", "garage", "parking", "garden", "basement"
- **Education**: "good schools", "schools"

## Response Format
```json
{
  "query": "clients looking for 3 bed 2 bath homes in Westside under 600k",
  "extractedCriteria": {
    "bedrooms": 3,
    "bathrooms": 2,
    "maxPrice": 600000,
    "location": "Westside"
  },
  "mongoQuery": {
    "$and": [
      { "requirements.bedrooms": { "$gte": 3 } },
      { "requirements.bathrooms": { "$gte": 2 } },
      { "requirements.maxPrice": { "$lte": 600000 } }
    ]
  },
  "results": [...],
  "count": 5
}
```

## Example Queries

### Property Requirements
- "clients looking for 3 bed 2 bath homes in Westside under 600k"
- "buyers wanting 4+ bedrooms with pool"
- "homes with 2 bathrooms and garage"

### Location & Budget
- "clients interested in downtown properties"
- "buyers looking near good schools"
- "clients with budget under 500k"

### Client Types
- "first-time buyers with pre-approval"
- "investors looking for properties"
- "families with children"

### Timeline & Urgency
- "urgent buyers ready this month"
- "clients ready to make offer"
- "ASAP buyers"

### Special Requirements
- "pet-friendly homes"
- "properties with pool"
- "homes with parking"
- "good school districts"

### Complex Combinations
- "first-time buyers looking for 3 bed 2 bath homes under 400k near schools"
- "investors wanting multi-family properties in Westside"
- "families looking for pet-friendly homes with garage under 600k"

## How It Works

1. **Query Processing**: Converts input to lowercase for case-insensitive matching
2. **Pattern Recognition**: Uses regex patterns to identify specific criteria
3. **Criteria Extraction**: Extracts numerical values, locations, and preferences
4. **Query Building**: Constructs MongoDB queries based on extracted criteria
5. **Fallback Search**: If no specific criteria found, performs general text search
6. **Results**: Returns matching notes with extracted criteria and query details

## Regex Patterns Used

### Property Requirements
```javascript
const bedroomPattern = /(\d+)\s*(?:bed|bedroom|br)/i;
const bathroomPattern = /(\d+)\s*(?:bath|bathroom|ba)/i;
const pricePattern = /(?:under|below|less than|max|maximum)\s*\$?(\d+[k]?)/i;
```

### Location & Preferences
```javascript
const locationPattern = /(?:in|at|near|around|close to)\s+([a-zA-Z\s]+?)(?:\s+under|\s+over|\s+with|\s+for|$)/i;
const clientTypePattern = /(?:first-time|first time|new|experienced|investor|family|families|buyer|buyers)/i;
```

## Error Handling
- Returns 400 if query is missing
- Returns 500 for server errors
- Logs detailed error information for debugging

## Performance Considerations
- Uses MongoDB indexes on frequently searched fields
- Regex patterns are optimized for common query patterns
- Fallback to general text search ensures results even with unrecognized queries

## Future Enhancements
- Machine learning for better query understanding
- Synonym recognition (e.g., "condo" = "apartment")
- Fuzzy matching for typos and variations
- Query suggestions and autocomplete
