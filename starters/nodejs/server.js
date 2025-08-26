import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { mcpClient } from './mcp-client.js';

const app = express();
const PORT = process.env.PORT || 3001;
import MeetingNote from './model/todo.js';

// Middleware
app.use(cors());
app.use(express.json());

// Sample test data will be loaded from meeting-notes.json
let testNotes = [];

// Load test data from file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const testDataPath = path.join(__dirname, '../../test-data/meeting-notes.json');
  const testDataContent = fs.readFileSync(testDataPath, 'utf8');
  testNotes = JSON.parse(testDataContent);
  console.log(`Loaded ${testNotes.length} test meeting notes`);
} catch (error) {
  console.error('Error loading test data:', error);
  testNotes = [];
}

// In-memory storage fallback
let inMemoryNotes = [...testNotes];
let useInMemory = false;

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://admin:password@localhost:27017/testdb");
    console.log('Connected to MongoDB successfully');
    
    // Initialize database with test data if empty
    // const count = await MeetingNote.countDocuments();
    // if (count === 0 && testNotes.length > 0) {
    //   const notesToInsert = testNotes.map(note => ({
    //     ...note,
    //     meetingDate: new Date(note.meetingDate),
    //     followUpDate: new Date(note.followUpDate),
    //     createdAt: new Date(note.createdAt),
    //     updatedAt: new Date(note.updatedAt)
    //   }));
    //   await MeetingNote.insertMany(notesToInsert);
    //   console.log('Initialized database with test meeting notes');
    // }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.log('Running in fallback mode with in-memory storage');
    useInMemory = true;
  }
}

// Helper functions
const generateId = () => `note-${uuidv4().substring(0, 8)}`;
const getCurrentTimestamp = () => new Date().toISOString();

// =====================================================
// TODO: IMPLEMENT YOUR API ENDPOINTS HERE
// Focus on implementing the natural language search!
// =====================================================

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Real Estate Meeting Notes API with MCP Integration', 
    endpoints: [
      'GET /api/notes',
      'GET /api/notes/:id',
      'POST /api/notes',
      'PUT /api/notes/:id',
      'DELETE /api/notes/:id',
      'POST /api/notes/bulk-import',
      'POST /api/notes/search',
      'POST /api/notes/similar/:id',
      'POST /api/notes/filter'
    ],
    mcpEnabled: mcpClient.isConnected,
    features: [
      'Enhanced semantic search with scoring',
      'Similar client matching',
      'Advanced filtering',
      'Intent analysis',
      'Relevance explanations'
    ]
  });
});

// Requirement 1: List all notes
app.get('/api/notes', async(req, res) => {
  try {
    if (useInMemory) {
      // Sort by createdAt descending (newest first)
      const sortedNotes = [...inMemoryNotes].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      return res.status(200).json(sortedNotes);
    }
    
    const notes = await MeetingNote.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Requirement 1: Get a specific note
app.get('/api/notes/:id', async(req, res) => {
  try {
    const { id } = req.params;
    
    if (useInMemory) {
      const note = inMemoryNotes.find(note => note.id === id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      return res.status(200).json(note);
    }
    
    // Check if it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const note = await MeetingNote.findById(id);
    if(!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Requirement 1: Create a new note
app.post('/api/notes', async(req, res) => {
  try {
    const { 
      id, clientName, meetingDate, contactInfo, meetingType, 
      notes, requirements, timeline, preApproved, followUpDate, tags 
    } = req.body;
    
    // Validation
    if (!clientName || !meetingDate || !contactInfo || !meetingType || !notes || !requirements || !timeline || preApproved === undefined || !followUpDate || !tags) {
      return res.status(400).json({ 
        error: 'All required fields must be provided' 
      });
    }
    
    if (useInMemory) {
      const newNote = {
        id: id || `note-${Date.now()}`,
        clientName,
        meetingDate,
        contactInfo,
        meetingType,
        notes,
        requirements,
        timeline,
        preApproved,
        followUpDate,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryNotes.push(newNote);
      return res.status(201).json(newNote);
    }
    
    const meetingNote = await MeetingNote.create({ 
      id: id || `note-${Date.now()}`,
      clientName,
      meetingDate: new Date(meetingDate),
      contactInfo,
      meetingType,
      notes,
      requirements,
      timeline,
      preApproved,
      followUpDate: new Date(followUpDate),
      tags,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json(meetingNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Requirement 1: Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const note = await MeetingNote.findByIdAndDelete(id);
    if(!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Requirement 2: Update a note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    // Add updatedAt timestamp
    updateData.updatedAt = new Date();
    
    const note = await MeetingNote.findByIdAndUpdate(id, updateData, { new: true });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.status(200).json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Requirement 3: Bulk import notes
app.post('/api/notes/bulk-import', async (req, res) => {
  try {
    const { notes } = req.body;
    
    if (!Array.isArray(notes)) {
      return res.status(400).json({ error: 'Notes must be an array' });
    }
    
    if (useInMemory) {
      const processedNotes = notes.map(note => ({
        ...note,
        createdAt: note.createdAt || new Date().toISOString(),
        updatedAt: note.updatedAt || new Date().toISOString()
      }));
      inMemoryNotes.push(...processedNotes);
      return res.status(201).json({ imported: processedNotes.length });
    }
    
    const processedNotes = notes.map(note => ({
      ...note,
      meetingDate: new Date(note.meetingDate),
      followUpDate: new Date(note.followUpDate),
      createdAt: new Date(note.createdAt || Date.now()),
      updatedAt: new Date(note.updatedAt || Date.now())
    }));
    
    await MeetingNote.insertMany(processedNotes);
    res.status(201).json({ imported: processedNotes.length });
  } catch (error) {
    console.error('Error importing notes:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Requirement 4: Enhanced Natural Language Search with MCP
app.post('/api/notes/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Try MCP enhanced search first
    if (mcpClient.isConnected) {
      try {
        const mcpResults = await mcpClient.semanticSearch(query, limit);
        return res.status(200).json({
          ...mcpResults,
          enhanced: true,
          source: 'mcp'
        });
      } catch (mcpError) {
        console.warn('MCP search failed, falling back to basic search:', mcpError.message);
      }
    }
    
    // Fallback to basic search
    if (useInMemory) {
      const results = performInMemorySearch(query, inMemoryNotes);
      return res.status(200).json({
        results: results.slice(0, limit),
        totalResults: results.length,
        enhanced: false,
        source: 'memory'
      });
    }
    
    const results = await performDatabaseSearch(query);
    res.status(200).json({
      results: results.slice(0, limit),
      totalResults: results.length,
      enhanced: false,
      source: 'database'
    });
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// New MCP-powered endpoints
app.post('/api/notes/similar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.body;
    
    if (!mcpClient.isConnected) {
      return res.status(503).json({ error: 'Enhanced search service unavailable' });
    }
    
    const results = await mcpClient.findSimilarClients(id, limit);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error finding similar clients:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

app.post('/api/notes/filter', async (req, res) => {
  try {
    const { filters } = req.body;
    
    if (!filters) {
      return res.status(400).json({ error: 'Filters are required' });
    }
    
    if (!mcpClient.isConnected) {
      return res.status(503).json({ error: 'Enhanced search service unavailable' });
    }
    
    const results = await mcpClient.advancedFilter(filters);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error applying advanced filters:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Helper function for in-memory natural language search
function performInMemorySearch(query, notes) {
  const searchQuery = query.toLowerCase();
  const results = [];
  
  notes.forEach(note => {
    let score = 0;
    let matches = [];
    
    // Search in various fields
    const searchableText = [
      note.clientName,
      note.notes,
      note.requirements?.propertyType,
      ...(note.requirements?.preferredAreas || []),
      ...(note.requirements?.mustHaves || []),
      ...(note.requirements?.niceToHaves || []),
      ...(note.tags || []),
      note.timeline,
      note.meetingType
    ].join(' ').toLowerCase();
    
    // Basic keyword matching
    if (searchableText.includes(searchQuery)) {
      score += 10;
      matches.push('general_match');
    }
    
    // Price range matching
    const priceMatch = searchQuery.match(/(\d+)k?/g);
    if (priceMatch && note.requirements) {
      const searchPrice = parseInt(priceMatch[0].replace('k', '000'));
      if (searchPrice >= note.requirements.minPrice && searchPrice <= note.requirements.maxPrice) {
        score += 15;
        matches.push('price_match');
      }
    }
    
    // Bedroom/bathroom matching
    const bedroomMatch = searchQuery.match(/(\d+)\s*(bed|bedroom)/);
    if (bedroomMatch && note.requirements?.bedrooms === parseInt(bedroomMatch[1])) {
      score += 20;
      matches.push('bedroom_match');
    }
    
    const bathroomMatch = searchQuery.match(/(\d+)\s*(bath|bathroom)/);
    if (bathroomMatch && note.requirements?.bathrooms === parseInt(bathroomMatch[1])) {
      score += 20;
      matches.push('bathroom_match');
    }
    
    // Tag matching
    note.tags?.forEach(tag => {
      if (searchQuery.includes(tag.toLowerCase())) {
        score += 25;
        matches.push(`tag_match: ${tag}`);
      }
    });
    
    // Timeline matching
    if (searchQuery.includes('urgent') || searchQuery.includes('asap')) {
      if (note.timeline === 'ASAP') {
        score += 30;
        matches.push('urgent_timeline');
      }
    }
    
    // Pre-approval matching
    if (searchQuery.includes('pre-approved') || searchQuery.includes('preapproved')) {
      if (note.preApproved) {
        score += 15;
        matches.push('preapproved');
      }
    }
    
    if (score > 0) {
      results.push({
        note,
        score,
        matches,
        relevance: score / 100
      });
    }
  });
  
  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

// Helper function for database natural language search
async function performDatabaseSearch(query) {
  const searchQuery = query.toLowerCase();
  const mongoQuery = { $or: [] };
  
  // Text search in various fields
  mongoQuery.$or.push(
    { clientName: { $regex: searchQuery, $options: 'i' } },
    { notes: { $regex: searchQuery, $options: 'i' } },
    { 'requirements.propertyType': { $regex: searchQuery, $options: 'i' } },
    { 'requirements.preferredAreas': { $regex: searchQuery, $options: 'i' } },
    { 'requirements.mustHaves': { $regex: searchQuery, $options: 'i' } },
    { 'requirements.niceToHaves': { $regex: searchQuery, $options: 'i' } },
    { tags: { $regex: searchQuery, $options: 'i' } },
    { timeline: { $regex: searchQuery, $options: 'i' } },
    { meetingType: { $regex: searchQuery, $options: 'i' } }
  );
  
  // Price range matching
  const priceMatch = searchQuery.match(/(\d+)k?/g);
  if (priceMatch) {
    const searchPrice = parseInt(priceMatch[0].replace('k', '000'));
    mongoQuery.$or.push({
      'requirements.minPrice': { $lte: searchPrice },
      'requirements.maxPrice': { $gte: searchPrice }
    });
  }
  
  // Bedroom matching
  const bedroomMatch = searchQuery.match(/(\d+)\s*(bed|bedroom)/);
  if (bedroomMatch) {
    mongoQuery.$or.push({
      'requirements.bedrooms': parseInt(bedroomMatch[1])
    });
  }
  
  // Bathroom matching
  const bathroomMatch = searchQuery.match(/(\d+)\s*(bath|bathroom)/);
  if (bathroomMatch) {
    mongoQuery.$or.push({
      'requirements.bathrooms': parseInt(bathroomMatch[1])
    });
  }
  
  // Timeline matching
  if (searchQuery.includes('urgent') || searchQuery.includes('asap')) {
    mongoQuery.$or.push({ timeline: 'ASAP' });
  }
  
  // Pre-approval matching
  if (searchQuery.includes('pre-approved') || searchQuery.includes('preapproved')) {
    mongoQuery.$or.push({ preApproved: true });
  }
  
  const notes = await MeetingNote.find(mongoQuery).sort({ createdAt: -1 });
  
  // Add basic scoring
  return notes.map(note => ({
    note,
    score: 50, // Basic score for database matches
    matches: ['database_match'],
    relevance: 0.5
  }));
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Notes API Challenge - Node.js Starter with MCP Integration`);
  
  // Connect to database
  await connectDB();
  
  // Initialize MCP client
  try {
    await mcpClient.connect();
    console.log(`🔍 Enhanced search powered by MCP is available`);
  } catch (error) {
    console.warn(`⚠️  MCP connection failed, using basic search: ${error.message}`);
  }
});