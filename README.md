# AgenticAnts Technical Interview Repository
## Real Estate Notes Application with Natural Language Search

Welcome to the AgenticAnts technical interview! This repository contains everything you need to complete the advanced coding challenge focused on building intelligent search capabilities for real estate professionals.

## 📋 Interview Structure

- **Duration:** 1 hour total
  - 45 minutes: Coding challenge
  - 15 minutes: Code review and discussion
- **Tools:** You're encouraged to use AI assistants (Claude, Cursor, GitHub Copilot, ChatGPT, etc.)
- **Focus:** Building AI-powered search functionality with full-stack implementation

## 🎯 Challenge Overview

Build a **full-stack real estate notes application** that enables real estate agents to:

1. **Create and manage detailed meeting notes** with client requirements
2. **Search notes using natural language** queries like:
   - "Show me all clients looking for 3-bedroom homes under $500k"
   - "Find first-time buyers who need good schools"
   - "Which clients are ready to buy immediately?"
3. **Import comprehensive test data** for immediate testing
4. **Demonstrate AI/LLM integration** for semantic understanding

This challenge tests your ability to integrate modern AI capabilities with traditional web development to solve real business problems.

## 🚀 Getting Started

### Step 1: Read the Challenge
Start by reading [CHALLENGE.md](./CHALLENGE.md) for the complete requirements, technical specifications, and evaluation criteria.

### Step 2: Choose Your Tech Stack
Pick from one of our starter templates or build from scratch:
- [TypeScript/Express](./starters/typescript) - Type-safe backend with Express
- [Node.js/Express](./starters/nodejs) - Simple JavaScript backend
- [Python/FastAPI](./starters/python) - Python with auto-generated API docs

### Step 3: Load Test Data
Import the realistic real estate meeting notes from `test-data/meeting-notes.json` (20+ detailed client profiles) to test your natural language search implementation.

### Step 4: Implement Core Features
- Full CRUD API for meeting notes
- Database persistence (SQLite/PostgreSQL)
- Frontend interface for creating and viewing notes
- **Natural language search functionality** (primary focus)

### Step 5: Test Your Search
Use the provided test scenarios to validate your implementation handles complex queries effectively.

## 📁 Repository Structure

```
agentic-ants-interview/
├── CHALLENGE.md              # Complete challenge requirements
├── README.md                 # This file
├── test-data/
│   └── meeting-notes.json    # Realistic real estate client data
├── starters/                 # Optional starter templates
│   ├── typescript/           # TypeScript with Express
│   ├── nodejs/               # Node.js with Express
│   └── python/               # Python with FastAPI
└── test-solution.sh          # Automated testing script
```

## 🧪 Test Data Highlights

The `test-data/meeting-notes.json` includes diverse scenarios:
- **First-time buyers** with specific school district needs
- **Investment property** seekers looking for cash flow
- **Empty nesters** downsizing to luxury condos
- **Military families** needing quick relocation
- **Cash buyers** ready for immediate purchase
- **Families** requiring larger homes in safe neighborhoods

Perfect for testing natural language queries like:
- "urgent buyers with pre-approval"
- "families with kids looking for good schools" 
- "investment property buyers"
- "clients interested in Westside neighborhood"

## 💡 What Makes This Challenge Unique

### Traditional Interview vs. AgenticAnts Interview:

**Traditional:** Build a simple CRUD API  
**AgenticAnts:** Build intelligent search that understands user intent

**Traditional:** Focus on basic database queries  
**AgenticAnts:** Integrate AI/LLM capabilities for semantic search

**Traditional:** Test with simple data  
**AgenticAnts:** Work with realistic, complex real estate data

**Traditional:** Demonstrate coding skills  
**AgenticAnts:** Show how you leverage AI tools to build practical solutions

## 🎯 What We're Looking For

### Primary Evaluation (70%):
1. **Natural Language Search Quality** - Does it actually understand queries?
2. **Search Result Accuracy** - Returns relevant, ranked results
3. **AI Tool Integration** - Smart use of LLMs, embeddings, or NLP
4. **Problem-solving Approach** - How you tackle complex requirements

### Secondary Evaluation (30%):
1. **Full-stack Implementation** - Working frontend and backend
2. **Code Quality** - Clean, organized, maintainable code
3. **User Experience** - Functional and intuitive interface
4. **Technical Communication** - Explain your implementation choices

## 🔧 Technical Approaches You Might Consider

- **Embedding-based search** using OpenAI, Cohere, or Sentence Transformers
- **LLM-powered search** with structured prompts to GPT/Claude
- **Hybrid approach** combining keyword search with AI enhancement
- **Entity extraction** using spaCy or similar NLP libraries
- **Vector databases** for semantic similarity matching

## ⏱️ Time Management Suggestion

- **0-10 min:** Read requirements, choose tech stack, set up project
- **10-30 min:** Build basic CRUD API and database schema
- **30-40 min:** Implement natural language search functionality
- **40-45 min:** Create simple frontend and import test data
- **45-60 min:** Demo your solution and discuss implementation

## 🎤 Discussion Topics (Final 15 Minutes)

Be prepared to discuss:
- Your natural language search implementation approach
- Trade-offs between different AI/search techniques
- How you'd scale this for 100,000+ notes
- Performance vs. accuracy considerations
- Privacy and security considerations for client data
- Your experience using AI tools during development

## 💻 AI Integration Examples

### Embeddings Approach:
```python
# Convert notes to embeddings for semantic search
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(note_texts)
```

### LLM Approach:
```javascript
// Use structured prompts for intelligent filtering
const prompt = `Given these real estate meeting notes: ${notes}
Find clients matching: "${query}"
Return note IDs and relevance scores.`;
```

## 🏆 Success Criteria

Your solution should demonstrate:
- ✅ **Working natural language search** with realistic queries
- ✅ **Full-stack implementation** with database persistence
- ✅ **Test data integration** showing practical usage
- ✅ **Clean code architecture** with separation of concerns
- ✅ **AI tool utilization** for enhanced functionality
- ✅ **Clear communication** of technical decisions

## ❓ Questions?

Feel free to ask about:
- Technical requirements or constraints
- Expected search behavior
- Evaluation criteria
- Available tools and resources

Remember: We're more interested in seeing your problem-solving process and ability to integrate AI tools than perfect implementation. Focus on building something that actually works and can be demonstrated effectively.

**Good luck building the future of intelligent real estate tools!** 🏠🔍🤖