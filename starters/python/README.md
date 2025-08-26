# Python/FastAPI Starter - Real Estate Notes API

This starter provides a Python backend with FastAPI for building the Real Estate Notes application with natural language search capabilities.

## 🎯 Challenge Focus

Build a **natural language search system** that can understand queries like:
- "Show me all clients looking for 3-bedroom homes under $500k"
- "Find first-time buyers who need good schools"
- "Which clients are ready to buy immediately?"

## 🚀 Quick Start

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python server.py
```

## 📊 Load Test Data

The server includes 2 sample notes, but for comprehensive testing:

1. **Start your server:** `python server.py`
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
- `GET /api/notes/{id}` - Get specific note
- `POST /api/notes` - Create new meeting note
- `PUT /api/notes/{id}` - Update existing note
- `DELETE /api/notes/{id}` - Delete note

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

```python
class MeetingNote(BaseModel):
    id: str
    clientName: str
    meetingDate: str
    contactInfo: ContactInfo  # phone, email
    meetingType: str  # Initial Consultation, Follow-up, etc.
    notes: str  # Free-form meeting notes
    requirements: Requirements  # Structured property requirements
    timeline: str  # ASAP, 1-3 months, etc.
    preApproved: bool
    followUpDate: str
    tags: List[str]
    createdAt: str
    updatedAt: str

class Requirements(BaseModel):
    propertyType: str
    bedrooms: int
    bathrooms: int
    minPrice: int
    maxPrice: int
    preferredAreas: List[str]
    mustHaves: List[str]
    niceToHaves: List[str]
    dealBreakers: List[str]
```

## 🧠 Natural Language Search Implementation

Your main task is implementing the search endpoint at `POST /api/notes/search`. Consider these approaches:

### Option 1: Embedding-Based Search
```python
# Install: pip install sentence-transformers
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(note_texts)
```

### Option 2: LLM-Powered Search  
```python
# Install: pip install openai
import openai
# Send structured prompts with notes and query
# Parse LLM response for relevant note IDs
```

### Option 3: Entity Extraction + Rules
```python
# Install: pip install spacy
import spacy
nlp = spacy.load("en_core_web_sm")
# Extract entities: prices, locations, features
# Apply rule-based matching on structured fields
```

### Option 4: Hybrid Approach
```python
# Combine multiple techniques
# Use structured matching for exact criteria
# Use semantic search for contextual understanding
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

## 💡 Python/FastAPI Advantages

- **Excellent AI/ML Ecosystem:** Rich libraries for NLP, embeddings, and AI
- **Interactive API Docs:** Automatic OpenAPI documentation at `/docs`
- **Type Safety:** Pydantic models with automatic validation
- **Scientific Computing:** NumPy, scikit-learn for vector operations
- **Mature NLP Libraries:** spaCy, NLTK, transformers readily available

## 📦 Dependencies

### Required
- `fastapi` - Modern web framework
- `uvicorn` - ASGI server
- `pydantic` - Data validation using type hints

### Optional (for AI features)
Install as needed:
```bash
pip install openai                # OpenAI API integration
pip install sentence-transformers # Local embeddings
pip install spacy                 # Advanced NLP
pip install scikit-learn          # Machine learning utilities
pip install numpy                 # Numerical computing
```

## 🎯 Implementation Tips

1. **Start Simple:** Begin with keyword matching, then enhance
2. **Leverage Python's AI Strengths:** Use the rich ML/NLP ecosystem
3. **Test Frequently:** Use the provided test data extensively
4. **Use FastAPI Features:** Leverage automatic documentation and validation
5. **Document Approach:** Be ready to explain your implementation choice

## 🔍 Search Quality Criteria

Your search will be evaluated on:
- **Understanding Intent:** Does it grasp what the user is looking for?
- **Result Relevance:** Are the returned clients actually good matches?
- **Ranking Quality:** Are results ordered by relevance?
- **Query Handling:** Does it handle various query types and phrasings?
- **Performance:** Reasonable response times for the dataset size

## 📚 FastAPI Features

### Interactive Documentation
Visit `http://localhost:3000/docs` to:
- Test API endpoints directly from the browser
- See request/response schemas
- Understand expected data formats

### Automatic Validation
Pydantic models provide:
- Request validation
- Response formatting
- Clear error messages
- Type hints throughout

### Testing Examples
```bash
# Basic CRUD operations
curl http://localhost:3000/api/notes
curl http://localhost:3000/api/notes/note-001
curl -X DELETE http://localhost:3000/api/notes/note-002

# Create new note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test Client",
    "meetingDate": "2025-01-15T10:00:00Z",
    "contactInfo": {"phone": "555-0000", "email": "test@email.com"},
    "meetingType": "Initial Consultation",
    "notes": "Looking for first home",
    "requirements": {
      "propertyType": "Single Family",
      "bedrooms": 2,
      "bathrooms": 1,
      "minPrice": 200000,
      "maxPrice": 300000,
      "preferredAreas": ["Downtown"],
      "mustHaves": ["parking"],
      "niceToHaves": ["yard"],
      "dealBreakers": ["bad area"]
    },
    "timeline": "1-3 months",
    "preApproved": false,
    "followUpDate": "2025-01-20",
    "tags": ["first-time buyer"]
  }'
```

## 📝 Next Steps

1. **Implement the search endpoint** in `server.py`
2. **Choose your approach** (embeddings, LLM, rules, or hybrid)
3. **Import test data** using the bulk import endpoint
4. **Test extensively** with various natural language queries
5. **Optimize and refine** based on result quality

Good luck! Focus on building search that actually understands and returns relevant results. 🏠🔍🐍