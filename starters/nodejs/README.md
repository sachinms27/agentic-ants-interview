# Node.js/Express Starter - Real Estate Notes API

This starter provides a Node.js backend with Express.js for building the Real Estate Notes application with natural language search capabilities.

## 🎯 Challenge Focus

Build a **natural language search system** that can understand queries like:
- "Show me all clients looking for 3-bedroom homes under $500k"
- "Find first-time buyers who need good schools"
- "Which clients are ready to buy immediately?"

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server (with nodemon if available)
npm run dev

# Or start without auto-reload
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

```javascript
{
  id: "note-001",
  clientName: "Michael and Sarah Johnson",
  meetingDate: "2025-01-10T14:00:00Z",
  contactInfo: { phone: "555-0123", email: "mjohnson@email.com" },
  meetingType: "Initial Consultation",
  notes: "First-time homebuyers, both teachers...", // Free-form notes
  requirements: {
    propertyType: "Single Family",
    bedrooms: 3,
    bathrooms: 2,
    minPrice: 400000,
    maxPrice: 480000,
    preferredAreas: ["Westside", "School District 23"],
    mustHaves: ["yard", "good schools", "safe neighborhood"],
    niceToHaves: ["garage", "updated kitchen", "nursery potential"],
    dealBreakers: ["busy street", "major repairs needed", "bad school zone"]
  },
  timeline: "ASAP",
  preApproved: true,
  followUpDate: "2025-01-15",
  tags: ["first-time buyer", "expecting parents", "teachers", "urgent"],
  createdAt: "2025-01-10T14:00:00Z",
  updatedAt: "2025-01-10T14:00:00Z"
}
```

## 🧠 Natural Language Search Implementation

Your main task is implementing the search endpoint at `POST /api/notes/search`. Consider these approaches:

### Option 1: Embedding-Based Search
```javascript
// Use OpenAI embeddings or local models
// Convert notes to vector embeddings
// Use cosine similarity for matching
```

### Option 2: LLM-Powered Search  
```javascript
// Use OpenAI/Anthropic API
// Send structured prompts with notes and query
// Parse LLM response for relevant note IDs
```

### Option 3: Entity Extraction + Rules
```javascript
// Extract entities: price ranges, bedroom counts, locations
// Apply rule-based matching on structured fields
// Combine with keyword search on notes text
```

### Option 4: Hybrid Approach
```javascript
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

## 💡 Node.js Advantages

- **Rapid Prototyping:** Quick to get started with familiar JavaScript
- **JSON Native:** Easy handling of complex nested data structures  
- **Rich Ecosystem:** Large npm package selection for AI/ML libraries
- **Async Support:** Natural fit for API calls to external AI services
- **Flexibility:** Dynamic typing allows for quick experimentation

## 📦 Dependencies

### Required
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `uuid` - Generate unique note IDs

### Optional (for AI features)
Install as needed:
```bash
npm install openai          # OpenAI API integration
npm install cohere-ai       # Cohere embeddings
npm install natural         # Natural language processing
npm install compromise      # Text analysis and NLP
```

## 🎯 Implementation Tips

1. **Start Simple:** Begin with keyword matching, then enhance
2. **Use JavaScript Strengths:** Leverage object manipulation and async capabilities
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

1. **Implement the search endpoint** in `server.js`
2. **Choose your approach** (embeddings, LLM, rules, or hybrid)
3. **Import test data** using the bulk import endpoint
4. **Test extensively** with various natural language queries
5. **Optimize and refine** based on result quality

Good luck! Focus on building search that actually understands and returns relevant results. 🏠🔍