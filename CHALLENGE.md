# Technical Interview Challenge
## Quick Notes API with Smart Search

**Duration:** 1 hour (45 minutes coding + 15 minutes discussion)  
**Difficulty:** Easy to Medium  
**Tools Allowed:** Any AI assistants (Claude, Cursor, GitHub Copilot, ChatGPT, etc.)

---

## 📋 Problem Statement

Build a simple note-taking application with a REST API backend that allows users to create, view, delete, and intelligently search through notes. You should demonstrate your ability to work efficiently with AI tools while maintaining code quality and understanding.

---

## 🎯 Core Requirements

### Requirement 1: Basic CRUD API
Implement a REST API with the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notes` | Create a new note |
| GET | `/api/notes` | List all notes |
| GET | `/api/notes/:id` | Get a specific note |
| DELETE | `/api/notes/:id` | Delete a note |

**Note Data Structure:**
```json
{
  "id": "unique-id",
  "title": "Meeting Notes",
  "content": "Discussed Q4 targets and budget allocation...",
  "tags": ["meeting", "budget"],
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### Requirement 2: Smart Search Feature
Implement a search endpoint that can find notes by:
- **Title** - partial match (case-insensitive)
- **Content** - partial match (case-insensitive)
- **Tags** - exact match

**Search Endpoints:**
```
GET /api/notes/search?q=budget     # Search in title and content
GET /api/notes/search?tag=meeting  # Search by specific tag
```

---

## 🌟 Bonus Features (Optional)
Complete these if you finish the core requirements early:

1. **Auto-tagging:** Automatically generate tags based on note content
2. **Summary Generation:** Create a one-line summary for notes longer than 100 characters
3. **Simple UI:** Basic frontend to create and view notes
4. **Pagination:** Add pagination support to the list endpoint
5. **Validation:** Add input validation for note creation

---

## 🧪 Test Data

Use this sample data to test your implementation:

```javascript
const testNotes = [
  {
    id: "note-001",
    title: "Project Kickoff Meeting",
    content: "Met with the team to discuss the new mobile app project. Key decisions: React Native for cross-platform development, 3-month timeline, $50k budget allocated.",
    tags: ["meeting", "project", "mobile"],
    createdAt: "2025-01-10T09:00:00Z"
  },
  {
    id: "note-002", 
    title: "Bug Fix - Login Issue",
    content: "Fixed authentication bug where users couldn't login with special characters in password. Issue was with regex validation. Updated regex pattern and added unit tests.",
    tags: ["bug", "authentication", "resolved"],
    createdAt: "2025-01-11T14:30:00Z"
  },
  {
    id: "note-003",
    title: "Customer Feedback Summary",
    content: "Compiled feedback from 5 customer interviews. Main points: Need better mobile experience, want dark mode, requesting export to PDF feature. Priority: mobile experience.",
    tags: ["feedback", "customer", "feature-request"],
    createdAt: "2025-01-12T11:00:00Z"
  },
  {
    id: "note-004",
    title: "Team Standup Notes",
    content: "Daily standup: John working on API optimization, Sarah finishing UI redesign, Mike investigating performance issues. Blocker: waiting for design approval from client.",
    tags: ["meeting", "standup", "daily"],
    createdAt: "2025-01-13T09:15:00Z"
  },
  {
    id: "note-005",
    title: "Architecture Decision - Database",
    content: "Decided to migrate from MongoDB to PostgreSQL for better relational data handling and ACID compliance. Migration planned for next sprint. Need to update ORM from Mongoose to Prisma.",
    tags: ["architecture", "database", "decision"],
    createdAt: "2025-01-14T16:00:00Z"
  }
];
```

---

## ✅ Test Scenarios

Your implementation should handle these test cases:

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Search "meeting" | `GET /api/notes/search?q=meeting` | Returns 2 notes (note-001, note-004) |
| Search tag "bug" | `GET /api/notes/search?tag=bug` | Returns 1 note (note-002) |
| Create note | `POST /api/notes` with valid payload | Returns created note with generated ID |
| Get specific note | `GET /api/notes/note-003` | Returns note-003 details |
| Delete note | `DELETE /api/notes/note-005` | Returns success, note no longer in list |
| Get deleted note | `GET /api/notes/note-005` (after delete) | Returns 404 Not Found |
| Empty search | `GET /api/notes/search?q=xyz123` | Returns empty array |

---

## 🚀 Getting Started

Choose one of the starter templates from the `starters/` directory:
- **Node.js**: Simple Express.js setup
- **Python**: FastAPI with automatic documentation
- **TypeScript**: Type-safe Express.js setup

Each starter includes:
- Basic server setup
- Test data pre-loaded
- Example endpoint structure
- README with run instructions

---

## 💡 Tips & Guidelines

### Do's:
- ✅ Use AI tools actively and explain how you're using them
- ✅ Ask clarifying questions if needed
- ✅ Focus on getting core requirements working first
- ✅ Think out loud as you code
- ✅ Handle basic error cases (404, 400)
- ✅ Keep your code organized and readable

### Don'ts:
- ❌ Don't spend too much time on perfection
- ❌ Don't implement complex features before core requirements
- ❌ Don't worry about authentication or security (unless you have extra time)
- ❌ Don't use an actual database - in-memory storage is fine

---

## 📊 Evaluation Criteria

### We're Looking For:
1. **AI Tool Proficiency:** How effectively you use AI assistants for development
2. **Problem Solving:** Your approach to breaking down and solving problems
3. **Code Quality:** Clean, readable, and organized code
4. **API Design:** RESTful principles and consistent endpoint design
5. **Error Handling:** Basic error cases and validation
6. **Time Management:** Prioritization and completion of core features
7. **Communication:** Clear explanation of your approach and decisions

### What Will Impress Us:
- Efficient search implementation
- Clean code structure and organization
- Thoughtful error handling
- Quick completion with bonus features
- Good testing approach
- Clear understanding of generated code

---

## 🎤 Discussion Topics (Final 15 Minutes)

Be prepared to discuss:
1. Your search implementation approach and its efficiency
2. How you would scale this for 1 million notes
3. Security considerations for production
4. Testing strategies for your API
5. Your experience using AI tools during the challenge
6. What you would add with more time

---

## 📝 Submission

At the end of the session, you should have:
1. Working API with core requirements implemented
2. A way to demonstrate the functionality (Postman, curl commands, or simple UI)
3. Be ready to walk through your code and explain your decisions

---

## ❓ Questions?

Feel free to ask any clarifying questions before or during the challenge. Remember, we're more interested in seeing your problem-solving process and how you collaborate with AI tools than in perfect code.

Good luck! 🚀