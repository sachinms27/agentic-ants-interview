# Minimal Starter Template

This is a minimal Express.js starter template for AgenticAnts interview challenges. It provides basic scaffolding for both challenges with placeholder implementations.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
```

Server will run on http://localhost:3000

## What's Included

- ✅ Basic Express server setup
- ✅ CORS enabled
- ✅ JSON body parsing
- ✅ In-memory storage (replace with database)
- ✅ Placeholder routes for both challenges
- ✅ Health check endpoint

## Available Endpoints

### Support Triage Agent
- `POST /api/tickets/ingest` - Receive new ticket
- `POST /api/tickets/analyze` - Analyze ticket (needs LLM integration)
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets/:id/route` - Route ticket (needs business logic)
- `GET /api/tickets/:id/response` - Generate response (needs AI)
- `POST /api/tickets/bulk-import` - Import test data
- `GET /api/analytics/dashboard` - View metrics

### Real Estate Notes
- `POST /api/notes` - Create note
- `GET /api/notes` - List all notes
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/search` - Natural language search (needs AI)
- `POST /api/notes/bulk-import` - Import test data

## TODO - Implement These

### For Support Agent Challenge:
1. **LLM Integration** in `/api/tickets/analyze`
   - Add OpenAI, Anthropic, or other LLM
   - Extract urgency, category, sentiment, entities
   - Add confidence scores

2. **Routing Logic** in `/api/tickets/:id/route`
   - Implement business rules from routing-rules.json
   - Calculate priority based on multiple factors
   - Handle escalation paths

3. **Response Generation** in `/api/tickets/:id/response`
   - Generate contextual responses
   - Use ticket history
   - Match tone to customer sentiment

### For Real Estate Challenge:
1. **Natural Language Search** in `/api/notes/search`
   - Implement embedding-based search OR
   - LLM-powered search OR
   - Hybrid approach

2. **Database Integration**
   - Replace in-memory storage with SQLite/PostgreSQL
   - Add persistence between restarts

## Adding AI Capabilities

### Option 1: OpenAI
```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeWithLLM(ticket) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [/* your prompt */]
  });
  return completion.choices[0].message.content;
}
```

### Option 2: Anthropic Claude
```javascript
const Anthropic = require('anthropic');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function analyzeWithClaude(ticket) {
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    messages: [/* your prompt */]
  });
  return response.content;
}
```

### Option 3: Local Models
```javascript
// Using Ollama or similar
async function analyzeWithLocalLLM(ticket) {
  // Implement local model integration
}
```

## Environment Variables

Create a `.env` file:
```
PORT=3000
OPENAI_API_KEY=your-key-here
ANTHROPIC_API_KEY=your-key-here
DATABASE_URL=sqlite://./database.db
```

## Testing Your Implementation

```bash
# For Support Agent
cd challenges/support-triage-agent
./test-solution.sh

# For Real Estate
cd challenges/real-estate-search
./test-solution.sh
```

## Tips

1. Start by getting basic CRUD working
2. Add AI integration incrementally
3. Test with provided test data
4. Focus on the primary evaluation criteria
5. Use error handling for LLM failures

Good luck! 🚀