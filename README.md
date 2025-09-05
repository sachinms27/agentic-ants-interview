# AgenticAnts Technical Interview Repository

Welcome to the AgenticAnts technical interview! Choose your challenge based on the position you're interviewing for.

## 🎯 Choose Your Challenge

### [🏠 Challenge 1: Real Estate Search](./challenges/real-estate-search/)
**Position:** Full-Stack Developer with AI Integration  
**Duration:** 1 hour  
**Focus:** Natural language search, semantic understanding, full-stack implementation  

Build a notes application for real estate agents with AI-powered natural language search. Search for clients using queries like "3 bed 2 bath under 500k" or "families needing good schools."

[**Start Real Estate Challenge →**](./challenges/real-estate-search/)

---

### [🤖 Challenge 2: AI Support Triage Agent](./challenges/support-triage-agent/)
**Position:** AI Engineer / ML Engineer  
**Duration:** 1 hour  
**Focus:** AI agent design, LLM orchestration, complex business logic  

Build an intelligent support ticket triage system that analyzes, classifies, and routes customer support tickets using AI. Implement sophisticated routing rules, priority calculation, and automated responses.

[**Start Support Agent Challenge →**](./challenges/support-triage-agent/)

---

## 🚀 Quick Start Guide

### Step 1: Choose Your Challenge
Click on one of the challenges above to read the detailed requirements.

### Step 2: Select a Starter Template
Pick the starter that matches your preferred tech stack:

```bash
# Minimal starter (recommended for flexibility)
cd starters/minimal
npm install
npm run dev

# TypeScript starter
cd starters/typescript
npm install
npm run dev

# Python starter
cd starters/python
pip install -r requirements.txt
uvicorn server:app --reload
```

### Step 3: Import Test Data
Each challenge includes realistic test data:
- Real Estate: 20+ detailed meeting notes
- Support Agent: 50+ diverse support tickets

### Step 4: Implement & Test
- Focus on the primary requirements first
- Use the provided test scripts to validate your solution
- Leverage AI tools (Claude, Cursor, Copilot) - they're encouraged!

## 📁 Repository Structure

```
agentic-ants-interview/
├── challenges/
│   ├── real-estate-search/      # Full-stack + NLP search challenge
│   │   ├── README.md            # Challenge overview
│   │   ├── REQUIREMENTS.md      # Detailed specifications
│   │   ├── test-data/           # Sample meeting notes
│   │   └── test-solution.sh     # Automated tests
│   │
│   └── support-triage-agent/    # AI agent challenge
│       ├── README.md            # Challenge overview
│       ├── REQUIREMENTS.md      # Detailed specifications
│       ├── test-data/           # 50+ support tickets
│       ├── evaluation/          # Test scenarios & rubric
│       └── test-solution.sh     # Automated tests
│
└── starters/
    ├── minimal/                 # Minimal Express.js starter
    ├── typescript/              # TypeScript with type safety
    └── python/                  # Python FastAPI starter
```

## ⏱️ Interview Format

**Total Duration:** 1 hour
- **45 minutes:** Coding challenge
- **15 minutes:** Code review and discussion

### Time Management Tips
- **0-10 min:** Read requirements, choose tech stack, setup
- **10-30 min:** Build core functionality (API/agent logic)
- **30-40 min:** Implement AI features (search/analysis)
- **40-45 min:** Test with provided data
- **45-60 min:** Demo and discuss your solution

## 🎓 What We're Evaluating

### Both Challenges
- **AI Integration Quality** - How well you leverage LLMs and AI tools
- **Problem-Solving Approach** - Breaking down complex requirements
- **Code Organization** - Clean, maintainable architecture
- **Practical Thinking** - Real-world considerations

### Challenge-Specific Focus

**Real Estate Search:**
- Natural language understanding accuracy
- Search result relevance
- Full-stack implementation

**Support Agent:**
- LLM prompt engineering
- Business logic complexity
- Agent architecture design

## 💡 Tips for Success

### Do's ✅
- Use AI assistants actively (Claude, Cursor, Copilot)
- Focus on core requirements first
- Test with the provided data
- Keep your code organized
- Ask clarifying questions

### Don'ts ❌
- Don't over-engineer the solution
- Don't spend too much time on UI styling
- Don't implement authentication
- Don't worry about production deployment
- Don't build features not in requirements

## 🛠️ Recommended AI Tools

- **Claude Desktop** - For code generation and problem solving
- **Cursor** - AI-powered IDE
- **GitHub Copilot** - Inline code suggestions
- **ChatGPT** - General assistance
- **v0** - For quick UI components

## 📊 Testing Your Solution

Each challenge includes an automated test script:

```bash
# Navigate to your challenge directory
cd challenges/[your-challenge]/

# Run the test script
./test-solution.sh

# Or specify a custom port
./test-solution.sh 8080
```

## ❓ Frequently Asked Questions

**Q: Can I use external APIs like OpenAI?**  
A: Yes! AI integration is encouraged. Use any LLM API you're comfortable with.

**Q: Do I need to implement a frontend?**  
A: For Real Estate challenge: Yes, a simple UI is required. For Support Agent: Optional but bonus points for a dashboard.

**Q: Can I use libraries and frameworks?**  
A: Absolutely! Use whatever helps you build the best solution quickly.

**Q: What if I can't finish everything?**  
A: Focus on core functionality and be ready to discuss what you would do with more time.

**Q: Should I use the test data provided?**  
A: Yes! The test data is designed to showcase your solution's capabilities.

## 🎤 Discussion Topics

Be prepared to discuss:
1. Your technical approach and architecture decisions
2. How you integrated AI/LLM capabilities
3. Trade-offs you made due to time constraints
4. How you'd scale your solution
5. Security and privacy considerations
6. Your experience using AI tools during development

## 🏆 Success Criteria

Your solution should demonstrate:
- ✅ Core functionality working end-to-end
- ✅ Effective AI/LLM integration
- ✅ Clean, organized code
- ✅ Practical problem-solving
- ✅ Ability to work with test data
- ✅ Clear technical communication

---

**Good luck! We're excited to see what you build!** 🚀

*Remember: We value practical problem-solving and smart use of AI tools over perfect code. Focus on demonstrating your approach to building intelligent applications.*