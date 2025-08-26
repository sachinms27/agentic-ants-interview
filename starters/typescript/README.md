# TypeScript/Express Starter - Real Estate Notes API

This starter provides a TypeScript-based backend with Express.js for building the Real Estate Notes application with natural language search capabilities.

## 🎯 Challenge Focus

Build a **natural language search system** that can understand queries like:
- "Show me all clients looking for 3-bedroom homes under $500k"
- "Find first-time buyers who need good schools"
- "Which clients are ready to buy immediately?"

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 📊 Load Test Data

The server includes 2 sample notes, but for comprehensive testing:

1. **Start your server:** `npm run dev`
2. **Import full dataset:** 
   ```bash
   curl -X POST http://localhost:3000/api/notes/bulk-import \
     -H "Content-Type: application/json" \
     -d @../../test-data/meeting-notes.json
   ```
3. **Verify import:** Visit `http://localhost:3000/api/notes`

This loads 20+ realistic real estate meeting notes with diverse client scenarios.

## 🔧 API Endpoints

### Core CRUD Operations
- `GET /api/notes` - List all notes (with pagination)
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new meeting note
- `PUT /api/notes/:id` - Update existing note
- `DELETE /api/notes/:id` - Delete note

### Primary Feature (Focus Here!)
- `POST /api/notes/search` - **Natural language search**
  ```json
  {
    "query": "clients looking for 3 bed 2 bath homes in Westside under 600k"
  }
  ```

### Utility
- `POST /api/notes/bulk-import` - Import test data from JSON file

## 📋 Data Structure

Each meeting note contains:

```typescript
interface MeetingNote {
  id: string;
  clientName: string;
  meetingDate: string;
  contactInfo: { phone: string; email: string };
  meetingType: 'Initial Consultation' | 'Follow-up' | 'Property Tour' | 'Offer Discussion';
  notes: string; // Free-form meeting notes
  requirements: {
    propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-family' | 'Mixed-use';
    bedrooms: number;
    bathrooms: number;
    minPrice: number;
    maxPrice: number;
    preferredAreas: string[];
    mustHaves: string[];
    niceToHaves: string[];
    dealBreakers: string[];
  };
  timeline: 'ASAP' | '1-3 months' | '3-6 months' | '6+ months';
  preApproved: boolean;
  followUpDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

## 🧠 Natural Language Search Implementation

Your main task is implementing the search endpoint at `POST /api/notes/search`. Consider these approaches:

### Option 1: Embedding-Based Search
```typescript
// Install sentence-transformers or use OpenAI embeddings
// Convert notes to vector embeddings
// Use cosine similarity for matching
```

### Option 2: LLM-Powered Search  
```typescript
// Use OpenAI/Anthropic API
// Send structured prompts with notes and query
// Parse LLM response for relevant note IDs
```

### Option 3: Entity Extraction + Rules
```typescript
// Extract entities: price ranges, bedroom counts, locations
// Apply rule-based matching on structured fields
// Combine with keyword search on notes text
```

### Option 4: Hybrid Approach
```typescript
// Combine multiple techniques
// Use structured matching for exact criteria
// Use semantic search for contextual understanding
```

## 🧪 Test Your Implementation

Try these queries after importing test data:

```bash
# Price and property queries
curl -X POST http://localhost:3000/api/notes/search \
  -H "Content-Type: application/json" \
  -d '{"query": "3 bed 2 bath under 500k"}'

# Client type queries  
curl -X POST http://localhost:3000/api/notes/search \
  -H "Content-Type: application/json" \
  -d '{"query": "first-time buyers with pre-approval"}'

# Location queries
curl -X POST http://localhost:3000/api/notes/search \
  -H "Content-Type: application/json" \
  -d '{"query": "clients interested in Westside neighborhood"}'

# Urgency queries
curl -X POST http://localhost:3000/api/notes/search \
  -H "Content-Type: application/json" \
  -d '{"query": "urgent buyers ready to purchase immediately"}'
```

## 💡 TypeScript Advantages

- **Type Safety:** Catch errors at compile time
- **IntelliSense:** Better IDE support for complex data structures  
- **Refactoring:** Safer code changes with type checking
- **Documentation:** Types serve as inline documentation
- **API Contracts:** Ensure request/response type consistency

## 📦 Dependencies

### Production
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `uuid` - Generate unique note IDs

### Development  
- `typescript` - TypeScript compiler
- `ts-node` - Run TypeScript directly
- `@types/*` - Type definitions for JavaScript libraries

## 🎯 Implementation Tips

1. **Start Simple:** Begin with keyword matching, then enhance
2. **Use Types:** Leverage TypeScript for better code organization
3. **Test Frequently:** Use the provided test data extensively
4. **Focus on Search:** The search quality is the primary evaluation criteria
5. **Document Approach:** Be ready to explain your implementation choice

## 🔍 Search Quality Criteria

Your search will be evaluated on:
- **Understanding Intent:** Does it grasp what the user is looking for?
- **Result Relevance:** Are the returned clients actually good matches?
- **Ranking Quality:** Are results ordered by relevance?
- **Query Handling:** Does it handle various query types and phrasings?
- **Performance:** Reasonable response times for the dataset size

## 📝 Next Steps

1. **Implement the search endpoint** in `/src/server.ts`
2. **Choose your approach** (embeddings, LLM, rules, or hybrid)
3. **Import test data** using the bulk import endpoint
4. **Test extensively** with various natural language queries
5. **Optimize and refine** based on result quality

Good luck! Focus on building search that actually understands and returns relevant results. 🏠🔍