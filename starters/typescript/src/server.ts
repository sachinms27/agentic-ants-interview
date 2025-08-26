import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

// Type definitions for Real Estate Meeting Notes
interface MeetingNote {
  id: string;
  clientName: string;
  meetingDate: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  meetingType: 'Initial Consultation' | 'Follow-up' | 'Property Tour' | 'Offer Discussion';
  notes: string;
  requirements: {
    propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-family' | 'Mixed-use';
    bedrooms: number;
    bathrooms: number;
    minPrice: number;
    maxPrice: number;
    preferredAreas: string[];
    mustHaves: string[];
    niceToHaves: string[];
    dealBreakers: string[];
  };
  timeline: 'ASAP' | '1-3 months' | '3-6 months' | '6+ months';
  preApproved: boolean;
  followUpDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreateNoteRequest {
  clientName: string;
  meetingDate: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  meetingType: 'Initial Consultation' | 'Follow-up' | 'Property Tour' | 'Offer Discussion';
  notes: string;
  requirements: {
    propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-family' | 'Mixed-use';
    bedrooms: number;
    bathrooms: number;
    minPrice: number;
    maxPrice: number;
    preferredAreas: string[];
    mustHaves: string[];
    niceToHaves: string[];
    dealBreakers: string[];
  };
  timeline: 'ASAP' | '1-3 months' | '3-6 months' | '6+ months';
  preApproved: boolean;
  followUpDate: string;
  tags: string[];
}

interface SearchRequest {
  query: string;
}

interface SearchResult {
  note: MeetingNote;
  relevanceScore?: number;
  matchReasons?: string[];
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample test data - Real Estate Meeting Notes
// To get comprehensive test data, import from /test-data/meeting-notes.json
const testNotes: MeetingNote[] = [
  {
    id: "note-001",
    clientName: "Michael and Sarah Johnson",
    meetingDate: "2025-01-10T14:00:00Z",
    contactInfo: {
      phone: "555-0123",
      email: "mjohnson@email.com"
    },
    meetingType: "Initial Consultation",
    notes: "First-time homebuyers, both teachers. Pre-approved for $480k. Looking for starter home to raise family. Expecting first child in 6 months. Want Westside Elementary zone.",
    requirements: {
      propertyType: "Single Family",
      bedrooms: 3,
      bathrooms: 2,
      minPrice: 400000,
      maxPrice: 480000,
      preferredAreas: ["Westside", "School District 23"],
      mustHaves: ["yard", "good schools", "safe neighborhood"],
      niceToHaves: ["garage", "updated kitchen", "nursery potential"],
      dealBreakers: ["busy street", "major repairs needed", "bad school zone"]
    },
    timeline: "ASAP",
    preApproved: true,
    followUpDate: "2025-01-15",
    tags: ["first-time buyer", "expecting parents", "teachers", "urgent"],
    createdAt: "2025-01-10T14:00:00Z",
    updatedAt: "2025-01-10T14:00:00Z"
  },
  {
    id: "note-002",
    clientName: "Robert Chen", 
    meetingDate: "2025-01-12T10:30:00Z",
    contactInfo: {
      phone: "555-0234",
      email: "rchen@techcorp.com"
    },
    meetingType: "Initial Consultation",
    notes: "Software engineer looking for investment property. Has cash reserves. Wants multi-family properties in up-and-coming neighborhoods for rental income. Prefers properties near tech companies.",
    requirements: {
      propertyType: "Multi-family",
      bedrooms: 2,
      bathrooms: 2,
      minPrice: 300000,
      maxPrice: 600000,
      preferredAreas: ["University District", "Tech Corridor", "Downtown"],
      mustHaves: ["rental income potential", "good location", "structural soundness"],
      niceToHaves: ["multiple units", "parking", "low maintenance"],
      dealBreakers: ["negative cash flow", "major structural issues", "bad neighborhood trends"]
    },
    timeline: "3-6 months",
    preApproved: false,
    followUpDate: "2025-01-20",
    tags: ["investor", "cash buyer", "tech professional", "analytical"],
    createdAt: "2025-01-12T10:30:00Z",
    updatedAt: "2025-01-12T10:30:00Z"
  }
];

// In-memory storage - Start with test data
let notes: MeetingNote[] = [...testNotes];

// Helper functions
const generateId = (): string => `note-${uuidv4().substring(0, 8)}`;
const getCurrentTimestamp = (): string => new Date().toISOString();

// =====================================================
// TODO: IMPLEMENT YOUR API ENDPOINTS HERE
// Focus on implementing the natural language search!
// =====================================================

// Base endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({ 
    message: 'Real Estate Notes API Challenge - TypeScript', 
    description: 'Build intelligent search for real estate agent meeting notes',
    focus: 'Natural Language Search Implementation',
    endpoints: [
      'GET /api/notes - List all notes with pagination',
      'GET /api/notes/:id - Get specific note',
      'POST /api/notes - Create new meeting note',
      'PUT /api/notes/:id - Update existing note', 
      'DELETE /api/notes/:id - Delete note',
      'POST /api/notes/search - Natural language search (PRIMARY FEATURE)',
      'POST /api/notes/bulk-import - Import test data from JSON'
    ],
    testData: 'Import comprehensive test data from /test-data/meeting-notes.json'
  });
});

// Requirement 1: List all notes (with pagination)
app.get('/api/notes', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const paginatedNotes = notes.slice(start, end);
  
  res.json({
    notes: paginatedNotes,
    pagination: {
      page,
      limit,
      total: notes.length,
      pages: Math.ceil(notes.length / limit)
    }
  });
});

// Requirement 2: NATURAL LANGUAGE SEARCH (PRIMARY FEATURE)
app.post('/api/notes/search', (req: Request, res: Response) => {
  const { query }: SearchRequest = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // TODO: IMPLEMENT NATURAL LANGUAGE SEARCH HERE
  // This is the core feature that will be evaluated!
  // 
  // Approaches you can consider:
  // 1. Embedding-based search using OpenAI/Cohere
  // 2. LLM-powered search with structured prompts 
  // 3. Entity extraction + rule-based matching
  // 4. Hybrid approach combining multiple techniques
  //
  // Example queries to handle:
  // - "3 bed 2 bath under 500k"
  // - "first-time buyers with pre-approval"
  // - "clients interested in Westside neighborhood"
  // - "families with kids looking for good schools"
  // - "investment property buyers"
  // - "urgent buyers ready to purchase immediately"

  // Placeholder implementation - replace with actual search logic
  const results: SearchResult[] = notes.map(note => ({
    note,
    relevanceScore: 0.5,
    matchReasons: ['Placeholder match']
  }));

  res.json({
    query,
    results,
    totalResults: results.length,
    searchApproach: 'TODO: Implement your search approach here'
  });
});

// Get a specific note
app.get('/api/notes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const note = notes.find(n => n.id === id);
  
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  
  res.json(note);
});

// Create a new meeting note
app.post('/api/notes', (req: Request, res: Response) => {
  try {
    const noteData: CreateNoteRequest = req.body;
    
    // Basic validation
    if (!noteData.clientName || !noteData.notes) {
      return res.status(400).json({ error: 'Client name and notes are required' });
    }

    const newNote: MeetingNote = {
      id: generateId(),
      ...noteData,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };

    notes.push(newNote);
    
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ error: 'Invalid note data' });
  }
});

// Update an existing note
app.put('/api/notes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex(n => n.id === id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  const updatedNote: MeetingNote = {
    ...notes[noteIndex],
    ...req.body,
    id, // Preserve original ID
    updatedAt: getCurrentTimestamp()
  };

  notes[noteIndex] = updatedNote;
  
  res.json(updatedNote);
});

// Delete a note
app.delete('/api/notes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex(n => n.id === id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  const deletedNote = notes.splice(noteIndex, 1)[0];
  
  res.json({ 
    message: 'Note deleted successfully',
    deletedNote 
  });
});

// Bulk import notes (for loading test data)
app.post('/api/notes/bulk-import', (req: Request, res: Response) => {
  try {
    const importedNotes: MeetingNote[] = req.body;
    
    if (!Array.isArray(importedNotes)) {
      return res.status(400).json({ error: 'Expected array of notes' });
    }

    // Clear existing notes and replace with imported ones
    notes = [...importedNotes];
    
    res.json({
      message: 'Notes imported successfully',
      count: notes.length
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to import notes' });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🏠 Real Estate Notes API Challenge - TypeScript Starter`);
  console.log(`📊 Loaded ${notes.length} sample meeting notes`);
  console.log(`🔧 TypeScript provides type safety for complex data structures`);
  console.log(`🎯 PRIMARY GOAL: Implement natural language search at POST /api/notes/search`);
  console.log(`📁 Import full test data from /test-data/meeting-notes.json using POST /api/notes/bulk-import`);
});