# Technical Interview Challenge
## Real Estate Notes Application with Natural Language Search

**Duration:** 1 hour (45 minutes coding + 15 minutes discussion)  
**Difficulty:** Medium to Hard  
**Tools Allowed:** Any AI assistants (Claude, Cursor, GitHub Copilot, ChatGPT, etc.)

---

## 📋 Problem Statement

Build a full-stack notes application designed for real estate agents that allows them to create, manage, and search through meeting notes using natural language queries. The key differentiator is the ability to search notes using conversational queries like "Show me all clients looking for 3-bedroom homes under $500k" or "Find buyers interested in properties near good schools."

This challenge tests your ability to integrate modern AI/LLM capabilities with traditional web development to solve real-world business problems.

---

## 🎯 Core Requirements

### Requirement 1: Full-Stack Notes Application

Build a complete web application with:

#### Backend API:
- **POST** `/api/notes` - Create a new meeting note
- **GET** `/api/notes` - List all notes (with pagination)
- **GET** `/api/notes/:id` - Get a specific note
- **PUT** `/api/notes/:id` - Update a note
- **DELETE** `/api/notes/:id` - Delete a note
- **POST** `/api/notes/bulk-import` - Import multiple notes from JSON

#### Frontend UI:
- Create new meeting notes with rich text
- View all notes in a list/grid view
- Edit existing notes
- Delete notes
- Search interface for natural language queries
- Display search results with relevance highlighting

#### Database:
- Use SQLite, PostgreSQL, or any embedded database
- Persist notes between application restarts
- Store embeddings for semantic search (if using vector approach)

### Requirement 2: Natural Language Search

Implement an intelligent search system that understands context and intent:

**Search Endpoint:**
```
POST /api/notes/search
{
  "query": "clients looking for 3 bed 2 bath homes in Westside under 600k"
}
```

The search should understand:
- **Property requirements** (bedrooms, bathrooms, type, size)
- **Location preferences** (neighborhoods, school districts, proximity)
- **Budget constraints** (price ranges, financing needs)
- **Client preferences** (first-time buyers, investors, families)
- **Timeline** (urgent buyers, future prospects)
- **Special requirements** (pet-friendly, pool, garage, etc.)

**Example Natural Language Queries:**
- "Show me all first-time buyers with pre-approval"
- "Find clients interested in investment properties"
- "Which clients mentioned good schools as a priority?"
- "Buyers ready to make an offer this month"
- "Clients looking for homes near downtown with parking"

### Requirement 3: Meeting Note Structure

Each note should capture:
```json
{
  "id": "unique-id",
  "clientName": "John and Jane Doe",
  "meetingDate": "2025-01-15T10:00:00Z",
  "contactInfo": {
    "phone": "555-0123",
    "email": "client@email.com"
  },
  "meetingType": "Initial Consultation | Follow-up | Property Tour | Offer Discussion",
  "notes": "Detailed meeting notes...",
  "requirements": {
    "propertyType": "Single Family | Condo | Townhouse | Multi-family",
    "bedrooms": 3,
    "bathrooms": 2,
    "minPrice": 400000,
    "maxPrice": 600000,
    "preferredAreas": ["Westside", "Downtown", "Riverside"],
    "mustHaves": ["garage", "good schools", "yard"],
    "niceToHaves": ["pool", "modern kitchen"],
    "dealBreakers": ["HOA over $500", "busy street"]
  },
  "timeline": "ASAP | 1-3 months | 3-6 months | 6+ months",
  "preApproved": true,
  "followUpDate": "2025-01-20",
  "tags": ["first-time buyer", "urgent", "cash buyer"],
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

---

## 🌟 Implementation Approaches

You can choose one of these approaches (or combine them):

### Option 1: Embedding-Based Semantic Search
- Convert notes to embeddings using OpenAI, Cohere, or local models
- Store embeddings in a vector database (or in-memory)
- Use cosine similarity for search
- Return ranked results by relevance

### Option 2: LLM-Powered Search
- Send the query and notes to an LLM
- Let the LLM understand and filter relevant notes
- Use structured prompts for consistent results
- Can use OpenAI, Anthropic, or local models

### Option 3: Hybrid Approach
- Use traditional keyword search for basic filtering
- Apply rule-based extraction for structured fields
- Enhance with LLM for complex queries
- Combine scores for final ranking

### Option 4: Advanced NLP Pipeline
- Extract entities (prices, locations, features)
- Build a knowledge graph of requirements
- Use NER and intent classification
- Query the structured data

---

## 🧪 Test Data

A comprehensive set of realistic real estate meeting notes is provided in `test-data/meeting-notes.json`. This includes 20+ detailed meeting notes with various client types, requirements, and scenarios.

**Quick Import Instructions:**
1. Start your application
2. Use the bulk import endpoint: `POST /api/notes/bulk-import`
3. Upload the `test-data/meeting-notes.json` file
4. Begin testing natural language searches

---

## ✅ Test Scenarios

Your implementation should handle these queries effectively:

| Natural Language Query | Expected Results |
|------------------------|------------------|
| "3 bed 2 bath under 500k" | Returns the Johnsons, Patels, and other matching clients |
| "families with kids looking for good schools" | Returns clients who mentioned schools as priority |
| "urgent buyers with pre-approval" | Returns pre-approved clients with ASAP timeline |
| "investment property buyers" | Returns clients interested in rental/investment properties |
| "clients interested in Westside neighborhood" | Returns all clients with Westside in preferred areas |
| "first-time homebuyers" | Returns clients tagged or noted as first-time buyers |
| "clients who need to sell first" | Returns clients with contingency on selling current home |
| "cash buyers no financing needed" | Returns clients who can pay cash |

---

## 🚀 Getting Started

### Required Setup:
1. Choose your tech stack (React/Vue/Svelte for frontend, Node/Python/Go for backend)
2. Set up a database (SQLite is fine for the interview)
3. Implement the API endpoints
4. Build a functional UI
5. Integrate natural language search
6. Import and test with provided data

### Suggested Architecture:
```
/frontend
  /src
    /components
      - NotesList.jsx
      - NoteForm.jsx
      - SearchBar.jsx
      - SearchResults.jsx
    /services
      - api.js
      - searchService.js

/backend
  /src
    /routes
      - notes.js
      - search.js
    /services
      - database.js
      - searchEngine.js
      - nlpService.js
    /models
      - Note.js

/test-data
  - meeting-notes.json
```

---

## 💡 Tips & Guidelines

### Do's:
- ✅ Focus on making search actually work with real queries
- ✅ Use AI tools to help implement the NLP features
- ✅ Create a simple but functional UI
- ✅ Handle edge cases in natural language parsing
- ✅ Show search result relevance/ranking
- ✅ Make the import feature work smoothly

### Don'ts:
- ❌ Don't spend too much time on UI styling
- ❌ Don't implement user authentication
- ❌ Don't worry about production deployment
- ❌ Don't build complex state management
- ❌ Don't overthink the database schema

### AI Integration Options:
- **OpenAI API** - GPT-3.5/4 for search or embeddings
- **Anthropic API** - Claude for natural language understanding
- **Cohere** - For embeddings and semantic search
- **Hugging Face** - Local models like Sentence Transformers
- **LangChain/LlamaIndex** - For RAG implementation
- **Simple Rule-Based** - Regex and keyword matching (baseline)

---

## 📊 Evaluation Criteria

### Primary Focus (70%):
1. **Natural Language Search Quality** - How well it understands queries
2. **Search Result Accuracy** - Returns relevant notes
3. **Implementation Approach** - Smart use of AI/NLP techniques
4. **Code Organization** - Clean, modular architecture

### Secondary Focus (30%):
1. **UI/UX** - Functional and usable interface
2. **Database Design** - Appropriate schema and queries
3. **Error Handling** - Graceful failure modes
4. **Performance** - Reasonable response times
5. **Testing Approach** - How you validate the solution

### Bonus Points For:
- Explaining why certain results match
- Ranking results by relevance score
- Handling typos and variations in queries
- Query suggestion/auto-complete
- Partial matching and fuzzy search
- Export search results feature

---

## 🎤 Discussion Topics (Final 15 Minutes)

Be prepared to discuss:
1. Your approach to natural language understanding
2. Trade-offs between different search implementations
3. How you'd scale this for 100,000+ notes
4. Accuracy vs. performance considerations
5. How you'd improve search quality over time
6. Privacy considerations for client data
7. Your experience using AI tools during development
8. Production deployment considerations

---

## 📝 Deliverables

At the end of the session, you should have:
1. **Working Application** - Both frontend and backend running
2. **Natural Language Search** - Demonstrable with test queries
3. **Imported Test Data** - Ready for testing
4. **Search Demo** - Show various query types working
5. **Code Walkthrough** - Explain your implementation choices

---

## 🔧 Technical Hints

### For Embeddings Approach:
```python
# Example using sentence-transformers
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(notes_text)
```

### For LLM Approach:
```javascript
// Example structured prompt
const prompt = `Given these meeting notes: ${notes}
Find all clients matching: "${query}"
Return matching note IDs and relevance scores.`;
```

### For Entity Extraction:
```python
# Example using spaCy
import spacy
nlp = spacy.load("en_core_web_sm")
doc = nlp(query)
prices = [ent.text for ent in doc.ents if ent.label_ == "MONEY"]
```

---

## ❓ Questions?

Feel free to ask clarifying questions about:
- API requirements
- Search behavior expectations
- Technology constraints
- Test data format
- Evaluation criteria

Remember: We want to see how you approach complex problems, leverage AI tools effectively, and build practical solutions. Perfect code is less important than demonstrating good problem-solving skills and understanding of the solution you're building.

Good luck! 🏠🔍