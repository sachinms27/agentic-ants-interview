const Note = require('../model/Note');
const { v4: uuidv4 } = require('uuid');

// Helper function to generate timestamp
const getCurrentTimestamp = () => new Date().toISOString();

// Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notes' });
  }
};

// Get note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ id: req.params.id });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching note' });
  }
};

// Create new note
const createNote = async (req, res) => {
  try {
    const { 
      clientName, 
      meetingDate, 
      contactInfo, 
      meetingType, 
      notes, 
      requirements, 
      timeline, 
      preApproved, 
      followUpDate, 
      tags 
    } = req.body;
    
    if (!clientName || !meetingDate || !notes) {
      return res.status(400).json({ error: 'Client name, meeting date, and notes are required' });
    }

    const currentTime = getCurrentTimestamp();
    const newNote = new Note({
      id: uuidv4(),
      clientName,
      meetingDate,
      contactInfo: contactInfo || {},
      meetingType: meetingType || 'Initial Consultation',
      notes,
      requirements: requirements || {},
      timeline: timeline || '3-6 months',
      preApproved: preApproved || false,
      followUpDate,
      tags: tags || [],
      createdAt: currentTime,
      updatedAt: currentTime
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: 'Error creating note' ,error: error});
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ id: req.params.id });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting note' });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    const { id: bodyId, createdAt, ...allowedUpdates } = updateData;
    
    // Validate required fields if they're being updated
    if (allowedUpdates.clientName !== undefined && !allowedUpdates.clientName) {
      return res.status(400).json({ error: 'Client name cannot be empty' });
    }
    
    if (allowedUpdates.meetingDate !== undefined && !allowedUpdates.meetingDate) {
      return res.status(400).json({ error: 'Meeting date cannot be empty' });
    }
    
    if (allowedUpdates.notes !== undefined && !allowedUpdates.notes) {
      return res.status(400).json({ error: 'Notes cannot be empty' });
    }
    
    // Add updated timestamp
    allowedUpdates.updatedAt = getCurrentTimestamp();
    
    // Find and update the note
    const updatedNote = await Note.findOneAndUpdate(
      { id: id },
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({
      message: 'Note updated successfully',
      note: updatedNote
    });
    
  } catch (error) {
    console.error('Update note error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation error', 
        details: validationErrors 
      });
    }
    
    res.status(500).json({ error: 'Error updating note' });
  }
};

// Search notes
const searchNotes = async (req, res) => {
  try {
    const { q, tag, clientName, meetingType, propertyType, timeline } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { clientName: { $regex: q, $options: 'i' } },
        { notes: { $regex: q, $options: 'i' } }
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    if (clientName) {
      query.clientName = { $regex: clientName, $options: 'i' };
    }

    if (meetingType) {
      query.meetingType = meetingType;
    }

    if (propertyType) {
      query['requirements.propertyType'] = propertyType;
    }

    if (timeline) {
      query.timeline = timeline;
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Error searching notes' });
  }
};





// Natural Language Search with Regex Logic
const searchNotesNaturalLanguage = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Convert query to lowercase for case-insensitive matching
    const searchQuery = query.toLowerCase();
    
    // Build MongoDB query based on regex patterns
    let mongoQuery = {};
    let queryConditions = [];

    // Property requirements patterns
    const bedroomPattern = /(\d+)\s*(?:bed|bedroom|br)/i;
    const bathroomPattern = /(\d+)\s*(?:bath|bathroom|ba)/i;
    const pricePattern = /(?:under|below|less than|max|maximum)\s*\$?(\d+[k]?)/i;
    const minPricePattern = /(?:over|above|more than|min|minimum)\s*\$?(\d+[k]?)/i;
    const exactPricePattern = /\$?(\d+[k]?)\s*(?:budget|price)/i;

    // Location patterns
    const locationPattern = /(?:in|at|near|around|close to)\s+([a-zA-Z\s]+?)(?:\s+under|\s+over|\s+with|\s+for|$)/i;
    const areaPattern = /(?:westside|downtown|uptown|midtown|suburbs|school district)/i;

    // Client preference patterns
    const clientTypePattern = /(?:first-time|first time|new|experienced|investor|family|families|buyer|buyers)/i;
    const approvalPattern = /(?:pre-approval|pre approval|approved|ready|qualified)/i;
    const urgencyPattern = /(?:urgent|asap|immediate|this month|next month|ready to offer)/i;

    // Special requirements patterns
    const specialPattern = /(?:pet-friendly|pet friendly|pool|garage|parking|good schools|schools|garden|basement)/i;

    // Extract and apply patterns
    let extractedCriteria = {};

    // Bedrooms
    const bedroomMatch = searchQuery.match(bedroomPattern);
    if (bedroomMatch) {
      extractedCriteria.bedrooms = parseInt(bedroomMatch[1]);
    }

    // Bathrooms
    const bathroomMatch = searchQuery.match(bathroomPattern);
    if (bathroomMatch) {
      extractedCriteria.bathrooms = parseInt(bathroomMatch[1]);
    }

    // Price constraints
    const priceMatch = searchQuery.match(pricePattern);
    if (priceMatch) {
      let maxPrice = priceMatch[1];
      if (maxPrice.includes('k')) {
        maxPrice = parseInt(maxPrice.replace('k', '')) * 1000;
      } else {
        maxPrice = parseInt(maxPrice);
      }
      extractedCriteria.maxPrice = maxPrice;
    }

    const minPriceMatch = searchQuery.match(minPricePattern);
    if (minPriceMatch) {
      let minPrice = minPriceMatch[1];
      if (minPrice.includes('k')) {
        minPrice = parseInt(minPrice.replace('k', '')) * 1000;
      } else {
        minPrice = parseInt(minPrice);
      }
      extractedCriteria.minPrice = minPrice;
    }

    const exactPriceMatch = searchQuery.match(exactPricePattern);
    if (exactPriceMatch) {
      let price = exactPriceMatch[1];
      if (price.includes('k')) {
        price = parseInt(price.replace('k', '')) * 1000;
      } else {
        price = parseInt(price);
      }
      extractedCriteria.maxPrice = price;
      extractedCriteria.minPrice = price * 0.8; // 20% range
    }

    // Location
    const locationMatch = searchQuery.match(locationPattern);
    if (locationMatch) {
      extractedCriteria.location = locationMatch[1].trim();
    }

    // Build MongoDB query
    if (extractedCriteria.bedrooms) {
      queryConditions.push({ 'requirements.bedrooms': { $gte: extractedCriteria.bedrooms } });
    }

    if (extractedCriteria.bathrooms) {
      queryConditions.push({ 'requirements.bathrooms': { $gte: extractedCriteria.bathrooms } });
    }

    if (extractedCriteria.maxPrice) {
      queryConditions.push({ 'requirements.maxPrice': { $lte: extractedCriteria.maxPrice } });
    }

    if (extractedCriteria.minPrice) {
      queryConditions.push({ 'requirements.minPrice': { $gte: extractedCriteria.minPrice } });
    }

    // Text-based searches using regex
    let textSearchConditions = [];

    // Client type search
    if (searchQuery.includes('first-time') || searchQuery.includes('first time') || searchQuery.includes('new buyer')) {
      textSearchConditions.push({ tags: { $regex: 'first-time', $options: 'i' } });
    }

    if (searchQuery.includes('investor') || searchQuery.includes('investment')) {
      textSearchConditions.push({ tags: { $regex: 'investor', $options: 'i' } });
    }

    if (searchQuery.includes('family') || searchQuery.includes('families')) {
      textSearchConditions.push({ tags: { $regex: 'family', $options: 'i' } });
    }

    // Approval status
    if (searchQuery.includes('pre-approval') || searchQuery.includes('pre approval') || searchQuery.includes('approved')) {
      textSearchConditions.push({ preApproved: true });
    }

    // Urgency
    if (searchQuery.includes('urgent') || searchQuery.includes('asap') || searchQuery.includes('this month')) {
      textSearchConditions.push({ timeline: 'ASAP' });
    }

    if (searchQuery.includes('ready to offer') || searchQuery.includes('make offer')) {
      textSearchConditions.push({ timeline: 'ASAP' });
    }

    // Special requirements
    if (searchQuery.includes('pet-friendly') || searchQuery.includes('pet friendly')) {
      textSearchConditions.push({ 'requirements.mustHaves': { $regex: 'pet', $options: 'i' } });
    }

    if (searchQuery.includes('pool')) {
      textSearchConditions.push({ 'requirements.mustHaves': { $regex: 'pool', $options: 'i' } });
    }

    if (searchQuery.includes('garage') || searchQuery.includes('parking')) {
      textSearchConditions.push({ 'requirements.mustHaves': { $regex: 'garage|parking', $options: 'i' } });
    }

    if (searchQuery.includes('good schools') || searchQuery.includes('schools')) {
      textSearchConditions.push({ 'requirements.mustHaves': { $regex: 'school|education', $options: 'i' } });
    }

    // Location text search
    if (extractedCriteria.location) {
      textSearchConditions.push({
        $or: [
          { 'requirements.preferredAreas': { $regex: extractedCriteria.location, $options: 'i' } },
          { notes: { $regex: extractedCriteria.location, $options: 'i' } }
        ]
      });
    }

    // Combine all conditions
    if (queryConditions.length > 0) {
      mongoQuery.$and = queryConditions;
    }

    if (textSearchConditions.length > 0) {
      if (mongoQuery.$and) {
        mongoQuery.$and.push({ $or: textSearchConditions });
      } else {
        mongoQuery.$or = textSearchConditions;
      }
    }

    // If no specific criteria found, fall back to general text search
    if (Object.keys(mongoQuery).length === 0) {
      mongoQuery = {
        $or: [
          { clientName: { $regex: searchQuery, $options: 'i' } },
          { notes: { $regex: searchQuery, $options: 'i' } },
          { tags: { $regex: searchQuery, $options: 'i' } }
        ]
      };
    }

    const notes = await Note.find(mongoQuery).sort({ createdAt: -1 });
    
    res.json({
      query: query,
      extractedCriteria: extractedCriteria,
      mongoQuery: mongoQuery,
      results: notes,
      count: notes.length
    });

  } catch (error) {
    console.error('Natural language search error:', error);
    res.status(500).json({ error: 'Error performing natural language search' });
  }
};


module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
  searchNotes,

  searchNotesNaturalLanguage
};
