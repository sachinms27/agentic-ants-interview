# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose
This is an AgenticAnts technical interview repository with two distinct challenges:
1. **Real Estate Search** - Full-stack application with AI-powered natural language search
2. **Support Triage Agent** - AI agent for analyzing and routing support tickets

Both challenges test the ability to integrate AI/LLM capabilities with practical business applications.

## Project Structure

```
agentic-ants-interview/
├── challenges/
│   ├── real-estate-search/      # Full-stack NLP search challenge
│   │   ├── README.md
│   │   ├── REQUIREMENTS.md
│   │   ├── test-data/
│   │   └── test-solution.sh
│   └── support-triage-agent/    # AI agent challenge
│       ├── README.md
│       ├── REQUIREMENTS.md
│       ├── test-data/
│       ├── evaluation/
│       └── test-solution.sh
└── starters/
    ├── minimal/                 # Minimal Express.js starter
    ├── typescript/              # TypeScript starter
    └── python/                  # Python FastAPI starter
```

### Starter Templates
- `starters/minimal/` - Minimal Express.js with placeholder routes for both challenges
- `starters/typescript/` - TypeScript with Express
- `starters/python/` - Python with FastAPI

## Core Development Commands

### For Minimal starter:
```bash
cd starters/minimal
npm install
npm run dev       # Run development server
npm start         # Run production server
```

### For TypeScript starter:
```bash
cd starters/typescript
npm install
npm run build     # Compile TypeScript
npm run dev       # Run development server with ts-node
npm start         # Run compiled production server
```

### For Python starter:
```bash
cd starters/python
pip install -r requirements.txt
uvicorn server:app --reload --port 3000  # Run development server
```

### Testing solutions:
```bash
# For Real Estate challenge
cd challenges/real-estate-search
./test-solution.sh [port]

# For Support Agent challenge
cd challenges/support-triage-agent
./test-solution.sh [port]
```

## Challenge-Specific Requirements

### Real Estate Search Challenge
**Location:** `challenges/real-estate-search/`

**Key Requirements:**
- Full CRUD API for meeting notes
- Natural language search understanding queries like:
  - "3 bed 2 bath under 500k"
  - "families with kids looking for good schools"
  - "urgent buyers with pre-approval"
- Frontend UI for note creation and search
- Database persistence

**Implementation Approaches:**
- Embedding-based semantic search
- LLM-powered search with structured prompts
- Hybrid keyword + AI enhancement

### Support Triage Agent Challenge
**Location:** `challenges/support-triage-agent/`

**Key Requirements:**
- Ticket ingestion and analysis pipeline
- LLM integration for classification (urgency, category, sentiment)
- Complex routing based on business rules
- Priority calculation considering multiple factors
- AI-generated responses

**Key Endpoints:**
- `POST /api/tickets/ingest` - Receive tickets
- `POST /api/tickets/analyze` - AI analysis
- `POST /api/tickets/:id/route` - Routing logic
- `GET /api/tickets/:id/response` - Generate response
- `GET /api/analytics/dashboard` - Metrics

**Test Data:**
- 50+ diverse support tickets in `test-data/support-tickets.json`
- Customer tier definitions in `test-data/customer-tiers.json`
- Routing rules in `test-data/routing-rules.json`

## Technical Architecture Considerations

### Database Options
- SQLite for simplicity during interview
- Store embeddings if using vector search approach
- Persist notes between application restarts

### AI/NLP Integration Options
The starter packages include optional dependencies for:
- OpenAI API for GPT embeddings/search
- Cohere for semantic search
- Hugging Face for local models
- Traditional NLP libraries (spaCy, NLTK, natural)

### Frontend Requirements
Build a functional UI with:
- Note creation form
- Notes list/grid view
- Search interface with natural language input
- Search results display with relevance highlighting

## Testing and Validation

1. Import test data: Use the bulk import endpoint with `test-data/meeting-notes.json`
2. Test natural language queries from the test scenarios in `CHALLENGE.md`
3. Run the automated test script: `./test-solution.sh`

## Time Management Guidance
- **0-10 min:** Choose challenge, setup, understand requirements
- **10-30 min:** Build core functionality (API/agent logic)
- **30-40 min:** Implement AI features (search/analysis)
- **40-45 min:** Test with provided data
- **45-60 min:** Demo and code review

## Primary Evaluation Focus

### Both Challenges:
- AI/LLM integration quality
- Problem-solving approach
- Code organization
- Practical thinking

### Real Estate Search:
- Natural language search accuracy (70%)
- Full-stack implementation (30%)

### Support Agent:
- LLM prompt engineering (35%)
- Business logic complexity (25%)
- System architecture (20%)
- API implementation (10%)
- Code quality (10%)

Focus on demonstrating AI capabilities rather than perfect UI or production-ready features.