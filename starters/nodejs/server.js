const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample test data - Real Estate Meeting Notes
// TODO: You'll need to design proper data structures for complex requirements
const testNotes = [
  {
    id: "note-001",
    clientName: "Michael and Sarah Johnson",
    meetingDate: "2025-01-10T14:00:00Z",
    notes: "First-time homebuyers, both teachers. Pre-approved for $480k. Looking for starter home to raise family. Expecting first child in 6 months. Want Westside Elementary zone.",
    tags: ["first-time buyer", "expecting parents", "teachers", "urgent"],
    createdAt: "2025-01-10T14:00:00Z"
  },
  {
    id: "note-002",
    clientName: "Robert Chen",
    meetingDate: "2025-01-12T10:30:00Z",
    notes: "Software engineer looking for investment property. Has cash reserves. Wants multi-family properties in up-and-coming neighborhoods for rental income. Prefers properties near tech companies.",
    tags: ["investor", "cash buyer", "tech professional", "analytical"],
    createdAt: "2025-01-12T10:30:00Z"
  }
];

// In-memory storage
let notes = [...testNotes];

// Helper functions
const generateId = () => `note-${uuidv4().substring(0, 8)}`;
const getCurrentTimestamp = () => new Date().toISOString();

// =====================================================
// TODO: IMPLEMENT YOUR API ENDPOINTS HERE
// Focus on implementing the natural language search!
// =====================================================

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Real Estate Notes API Challenge - Node.js',
    focus: 'Build natural language search for real estate meeting notes',
    primaryFeature: 'POST /api/notes/search',
    testData: 'Import from /test-data/meeting-notes.json'
  });
});

// TODO: Implement your CRUD endpoints here
// GET /api/notes - List notes
// GET /api/notes/:id - Get specific note
// POST /api/notes - Create note
// PUT /api/notes/:id - Update note  
// DELETE /api/notes/:id - Delete note

// TODO: IMPLEMENT NATURAL LANGUAGE SEARCH (PRIMARY FEATURE)
// POST /api/notes/search
// This should handle queries like:
// - "3 bed 2 bath under 500k"
// - "first-time buyers with pre-approval"
// - "clients interested in Westside neighborhood"

// TODO: Implement bulk import for test data
// POST /api/notes/bulk-import

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🏠 Real Estate Notes API Challenge - Node.js Starter`);
  console.log(`📊 Loaded ${notes.length} sample meeting notes`);
  console.log(`🎯 PRIMARY GOAL: Implement natural language search`);
});