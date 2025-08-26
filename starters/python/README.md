# Python/FastAPI Starter - Real Estate Notes API

Minimal Python starter for building the Real Estate Notes application with natural language search.

## 🎯 Challenge Focus

**Build natural language search** that understands queries like:
- "3-bedroom homes under $500k"
- "first-time buyers with pre-approval" 
- "clients interested in Westside neighborhood"

## 🚀 Quick Start

```bash
# Optional: Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
python server.py
```

## 📊 Test Data

- **2 sample notes** included to get started
- **Full dataset:** Import from `/test-data/meeting-notes.json` (20+ realistic client notes)
- **Import endpoint:** You'll need to build `POST /api/notes/bulk-import`

## 🔧 What You Need to Build

### Required API Endpoints
```
GET    /api/notes           # List all notes
GET    /api/notes/{id}      # Get specific note
POST   /api/notes           # Create new note
PUT    /api/notes/{id}      # Update note
DELETE /api/notes/{id}      # Delete note

POST   /api/notes/search    # 🎯 PRIMARY FEATURE - Natural language search
POST   /api/notes/bulk-import # Bulk import test data
```

### Data Structure Design
The starter includes basic sample data. You need to:
- Design proper Pydantic models for complex real estate requirements
- Handle nested data (contact info, property requirements, preferences)
- Support structured search on price ranges, locations, property features

View the full data structure in `/test-data/meeting-notes.json`

## 🧠 Natural Language Search Implementation

Your **primary task** is implementing intelligent search at `POST /api/notes/search`.

**Example queries to handle:**
- "3 bed 2 bath under 500k"
- "first-time buyers with pre-approval"
- "families with kids looking for good schools"
- "investment property buyers"
- "urgent buyers ready to purchase immediately"

**Implementation approaches:**
- Embeddings (sentence-transformers, OpenAI, Cohere)
- LLM-powered (OpenAI, Anthropic with structured prompts)
- Entity extraction + rules (spaCy, NLTK for parsing)
- Hybrid approach (combine techniques)

## 💡 Python/FastAPI Benefits

- **Rich AI/ML Ecosystem:** Best-in-class libraries for NLP and embeddings
- **Interactive Docs:** Automatic API documentation at `/docs`
- **Type Safety:** Pydantic models with validation

## 📦 Optional Dependencies

Install AI libraries as needed:
```bash
pip install openai                # OpenAI API
pip install sentence-transformers # Local embeddings
pip install spacy                 # Advanced NLP
pip install scikit-learn          # ML utilities
pip install numpy                 # Numerical computing
```

## 📝 Getting Started

1. **Understand the data:** Check sample notes and `/test-data/meeting-notes.json`
2. **Design Pydantic models:** Create proper data structures
3. **Build CRUD APIs:** Implement basic endpoints first
4. **Focus on search:** This is the primary evaluation criteria
5. **Import test data:** Build bulk import to load the full dataset
6. **Test at `/docs`:** Use FastAPI's interactive documentation

## ⏱️ Time Management

- **0-15 min:** Set up basic CRUD endpoints and data models
- **15-35 min:** Focus on natural language search implementation
- **35-45 min:** Test with realistic queries, refine results

## 🔍 Success Criteria

Your search will be judged on:
- **Understanding queries:** Does it parse intent correctly?
- **Result relevance:** Are returned clients actually good matches?
- **Implementation approach:** Smart use of AI/NLP techniques

Good luck! Focus on building search that actually works. 🏠🔍🐍