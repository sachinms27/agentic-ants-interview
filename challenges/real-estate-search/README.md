# Real Estate Notes Application with Natural Language Search

**Duration:** 1 hour (45 minutes coding + 15 minutes discussion)  
**Position:** Full-Stack Developer with AI Integration  
**Difficulty:** Medium to Hard  

## 📋 Challenge Overview

Build a full-stack notes application designed for real estate agents that allows them to create, manage, and search through meeting notes using natural language queries. 

The key differentiator is the ability to search notes using conversational queries like:
- "Show me all clients looking for 3-bedroom homes under $500k"
- "Find buyers interested in properties near good schools"
- "Which clients are ready to buy immediately?"

## 🎯 What You'll Build

1. **Full CRUD API** for managing meeting notes
2. **Database persistence** using SQLite or PostgreSQL
3. **Natural language search** using AI/LLM integration
4. **Frontend interface** for creating and searching notes
5. **Test data import** functionality

## 📁 Challenge Files

- `REQUIREMENTS.md` - Detailed technical requirements
- `test-data/meeting-notes.json` - 20+ realistic meeting notes for testing
- `test-solution.sh` - Automated test script for API validation

## 🚀 Quick Start

1. **Choose a starter template** from `/starters/`
2. **Read the requirements** in `REQUIREMENTS.md`
3. **Build the API** with all required endpoints
4. **Implement natural language search** (primary focus!)
5. **Create a simple UI** for interaction
6. **Import test data** and validate your search

## 💡 Implementation Approaches

You can choose from several approaches for the natural language search:

### Option 1: Embedding-Based Search
- Convert notes to embeddings (OpenAI, Cohere, Sentence Transformers)
- Use cosine similarity for semantic search
- Store embeddings alongside notes

### Option 2: LLM-Powered Search
- Send query + notes to an LLM
- Use structured prompts for consistent results
- Let the LLM understand and filter

### Option 3: Hybrid Approach
- Combine keyword search with AI enhancement
- Use rule-based extraction for structured fields
- Apply LLM for complex queries

## ⏱️ Time Management

- **0-10 min:** Setup and understand requirements
- **10-30 min:** Build CRUD API and database
- **30-40 min:** Implement natural language search
- **40-45 min:** Create frontend and import test data
- **45-60 min:** Demo and discuss implementation

## 🎯 Evaluation Focus

**Primary (70%):**
- Natural language search quality and accuracy
- AI/LLM integration approach
- Search result relevance

**Secondary (30%):**
- Full-stack implementation completeness
- Code organization
- UI functionality

## 📊 Test Your Implementation

```bash
# Import the test data
curl -X POST http://localhost:3000/api/notes/bulk-import \
  -H "Content-Type: application/json" \
  -d @test-data/meeting-notes.json

# Test natural language search
curl -X POST http://localhost:3000/api/notes/search \
  -H "Content-Type: application/json" \
  -d '{"query": "families with kids looking for good schools"}'

# Run automated tests
./test-solution.sh
```

## 💬 Discussion Topics

Be prepared to discuss:
- Your approach to natural language understanding
- Trade-offs between different search implementations
- How you'd scale this for 100,000+ notes
- Performance vs. accuracy considerations

Good luck! 🏠🔍🤖