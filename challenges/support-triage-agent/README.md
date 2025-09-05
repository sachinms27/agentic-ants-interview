# AI Customer Support Triage Agent

**Duration:** 1 hour (45 minutes coding + 15 minutes discussion)  
**Position:** AI Engineer / ML Engineer  
**Difficulty:** Medium to Hard  

## 📋 Challenge Overview

Build an intelligent support ticket triage system that automatically analyzes, classifies, and routes customer support tickets using AI. The system should demonstrate sophisticated business logic, LLM integration, and practical AI agent design.

Your agent will:
- **Analyze** incoming support tickets for urgency, category, and sentiment
- **Extract** key entities like product names, error codes, and customer intent
- **Route** tickets to appropriate teams based on complex business rules
- **Generate** context-aware initial responses
- **Prioritize** based on customer tier, issue severity, and SLA requirements

## 🎯 Core Requirements

### 1. Ticket Ingestion & Analysis
- Accept support tickets via API
- Analyze with LLM for classification and entity extraction
- Calculate urgency and priority scores
- Extract sentiment and customer intent

### 2. Intelligent Routing Engine
- Route based on category, urgency, and customer tier
- Apply business rules (premium customers, security issues, etc.)
- Handle escalation paths
- Support multi-stage approval workflows

### 3. Response Generation
- Generate personalized acknowledgments
- Suggest resolution steps based on similar tickets
- Match tone to customer sentiment
- Provide confidence scores

### 4. Required API Endpoints
```
POST /api/tickets/ingest       # Receive new ticket
POST /api/tickets/analyze      # Analyze with AI
GET  /api/tickets/:id          # Get ticket details
POST /api/tickets/:id/route    # Execute routing
GET  /api/tickets/:id/response # Get AI response
POST /api/tickets/bulk-import  # Import test data
GET  /api/analytics/dashboard  # View metrics
```

## 📁 Challenge Files

- `REQUIREMENTS.md` - Detailed technical specifications
- `test-data/support-tickets.json` - 50+ diverse support tickets
- `test-data/customer-tiers.json` - Customer priority data
- `test-data/routing-rules.json` - Business routing configuration
- `evaluation/test-scenarios.json` - Specific test cases
- `evaluation/scoring-rubric.md` - Evaluation criteria
- `test-solution.sh` - Automated test script

## 🚀 Quick Start

1. **Choose a starter template** from `/starters/`
2. **Read the requirements** in `REQUIREMENTS.md`
3. **Import test data** to understand the problem space
4. **Build the analysis pipeline** with LLM integration
5. **Implement routing logic** with business rules
6. **Test with various scenarios** from evaluation folder

## 💡 Technical Approaches

### LLM Integration Options
- **OpenAI GPT-4** for analysis and response generation
- **Claude API** for nuanced understanding
- **Local models** via Ollama or Hugging Face
- **Hybrid approach** combining multiple models

### Architecture Patterns
```python
# Pipeline approach
ticket -> preprocess -> analyze -> route -> respond

# Agent approach  
class SupportAgent:
    def perceive(ticket)    # Understand the ticket
    def decide(analysis)    # Make routing decision
    def act(decision)       # Execute routing & response
```

## ⏱️ Time Management

- **0-5 min:** Review requirements and test data
- **5-15 min:** Set up API structure and data models
- **15-30 min:** Implement LLM analysis pipeline
- **30-40 min:** Build routing engine with business logic
- **40-50 min:** Add response generation
- **50-55 min:** Test with provided scenarios
- **55-60 min:** Demo and explain design decisions

## 🎯 Evaluation Criteria

**Primary Focus (70%):**
- LLM integration quality and prompt engineering
- Business logic complexity and correctness
- Agent architecture and design patterns
- Error handling and confidence scoring

**Secondary Focus (30%):**
- API design and documentation
- Code quality and organization
- Performance considerations
- UI/dashboard (if implemented)

## 📊 Test Your Implementation

```bash
# Import test tickets
curl -X POST http://localhost:3000/api/tickets/bulk-import \
  -H "Content-Type: application/json" \
  -d @test-data/support-tickets.json

# Test ticket analysis
curl -X POST http://localhost:3000/api/tickets/analyze \
  -H "Content-Type: application/json" \
  -d '{"subject": "Payment failed", "message": "..."}'

# Run automated tests
./test-solution.sh
```

## 🎓 What We're Looking For

1. **AI/LLM Integration** - How well you leverage AI for understanding
2. **Business Logic** - Complex routing rules and priority calculation
3. **System Design** - Clean architecture with clear separation
4. **Error Handling** - Graceful degradation when LLM fails
5. **Practical Thinking** - Real-world considerations

## 💬 Discussion Topics

Be prepared to discuss:
- Handling LLM failures and high latency
- Improving routing accuracy over time
- Scaling to 100K tickets/day
- Maintaining consistency across agents
- Privacy and security considerations
- Success metrics and KPIs

Good luck building an intelligent support agent! 🤖🎯