const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(express.json());

// Sample test data - DO NOT MODIFY THIS DATA
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
    message: 'Real Estate Notes API Challenge', 
    endpoints: [
      'GET /api/notes',
      'GET /api/notes/:id',
      'POST /api/notes',
      'DELETE /api/notes/:id',
      'GET /api/notes/search'
    ],
    searchParams: [
      'q: search in clientName and notes',
      'tag: search for exact tag match',
      'clientName: search by client name',
      'meetingType: filter by meeting type',
      'propertyType: filter by property type',
      'timeline: filter by timeline'
    ]
  });
});
// Mount the note routes
const noteRoutes = require('./routes/noteRoutes');
app.use('/api/notes', noteRoutes);

// Debug: Log all registered routes
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(`Route: ${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

// Requirement 1: List all notes


// Requirement 1: Get a specific note
// app.get('/api/notes/:id', (req, res) => {
//   // TODO: Implement this endpoint
//   res.status(501).json({ error: 'Not implemented' });
// });

// Requirement 1: Create a new note
// app.post('/api/notes', (req, res) => {
//   // TODO: Implement this endpoint
//   // Hint: Use uuidv4() to generate a unique ID
//   // Hint: Use getCurrentTimestamp() for createdAt
//   res.status(501).json({ error: 'Not implemented' });
// });

// Requirement 1: Delete a note
// app.delete('/api/notes/:id', (req, res) => {
//   // TODO: Implement this endpoint
//   res.status(501).json({ error: 'Not implemented' });
// });

// Requirement 2: Search notes
// app.get('/api/notes/search', (req, res) => {
//   // TODO: Implement search functionality
//   // Query parameters: 
//   //   - q: search in title and content
//   //   - tag: search for exact tag match
//   res.status(501).json({ error: 'Not implemented' });
// });

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