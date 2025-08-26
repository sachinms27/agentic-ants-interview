const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample test data - DO NOT MODIFY THIS DATA
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

// In-memory storage - Start with test data
let notes = [...testNotes];

// Helper function to generate timestamp
const getCurrentTimestamp = () => new Date().toISOString();

// =====================================================
// TODO: IMPLEMENT YOUR API ENDPOINTS HERE
// =====================================================

// Example endpoint to get you started
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Notes API Challenge', 
    endpoints: [
      'GET /api/notes',
      'GET /api/notes/:id',
      'POST /api/notes',
      'DELETE /api/notes/:id',
      'GET /api/notes/search'
    ]
  });
});

// Requirement 1: List all notes
app.get('/api/notes', (req, res) => {
  // TODO: Implement this endpoint
  res.status(501).json({ error: 'Not implemented' });
});

// Requirement 1: Get a specific note
app.get('/api/notes/:id', (req, res) => {
  // TODO: Implement this endpoint
  res.status(501).json({ error: 'Not implemented' });
});

// Requirement 1: Create a new note
app.post('/api/notes', (req, res) => {
  // TODO: Implement this endpoint
  // Hint: Use uuidv4() to generate a unique ID
  // Hint: Use getCurrentTimestamp() for createdAt
  res.status(501).json({ error: 'Not implemented' });
});

// Requirement 1: Delete a note
app.delete('/api/notes/:id', (req, res) => {
  // TODO: Implement this endpoint
  res.status(501).json({ error: 'Not implemented' });
});

// Requirement 2: Search notes
app.get('/api/notes/search', (req, res) => {
  // TODO: Implement search functionality
  // Query parameters: 
  //   - q: search in title and content
  //   - tag: search for exact tag match
  res.status(501).json({ error: 'Not implemented' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Notes API Challenge - Node.js Starter`);
  console.log(`📊 Loaded ${notes.length} test notes`);
});