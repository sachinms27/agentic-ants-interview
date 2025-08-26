# TypeScript/Express Starter - Real Estate Notes API

Minimal TypeScript starter for building the Real Estate Notes application with natural language search.

## 🎯 Challenge Focus

**Build natural language search** that understands queries like:
- "3-bedroom homes under $500k"
- "first-time buyers with pre-approval"
- "clients interested in Westside neighborhood"

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📊 Test Data

- **2 sample notes** included to get started
- **Full dataset:** Import from `/test-data/meeting-notes.json` (20+ realistic client notes)
- **Import endpoint:** You'll need to build `POST /api/notes/bulk-import`

## 🔧 What You Need to Build

### Required API Endpoints
```
GET    /api/notes           # List all notes
GET    /api/notes/:id       # Get specific note  
POST   /api/notes           # Create new note
PUT    /api/notes/:id       # Update note
DELETE /api/notes/:id       # Delete note

POST   /api/notes/search    # 🎯 PRIMARY FEATURE - Natural language search
POST   /api/notes/bulk-import # Bulk import test data
```

### Data Structure Design
The starter includes basic sample data. You need to:
- Design proper TypeScript interfaces for complex real estate requirements
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
- Embeddings (OpenAI, Cohere, local models)
- LLM-powered (GPT, Claude with structured prompts)
- Entity extraction + rules (parse requirements, match criteria)
- Hybrid approach (combine techniques)

## 💡 TypeScript Benefits

- **Type Safety:** Catch errors early with complex nested data
- **Better IDE Support:** Auto-completion for real estate domain objects
- **Refactoring:** Safe changes to data structures

## 📝 Getting Started

1. **Understand the data:** Check sample notes and `/test-data/meeting-notes.json`
2. **Design interfaces:** Create TypeScript types for the full real estate data structure
3. **Build CRUD APIs:** Implement basic endpoints first
4. **Focus on search:** This is the primary evaluation criteria
5. **Import test data:** Build bulk import to load the full dataset

## ⏱️ Time Management

- **0-15 min:** Set up basic CRUD endpoints
- **15-35 min:** Focus on natural language search implementation  
- **35-45 min:** Test with realistic queries, refine results

## 🔍 Success Criteria

Your search will be judged on:
- **Understanding queries:** Does it parse intent correctly?
- **Result relevance:** Are returned clients actually good matches?
- **Implementation approach:** Smart use of AI/NLP techniques

Good luck! Focus on building search that actually works. 🏠🔍