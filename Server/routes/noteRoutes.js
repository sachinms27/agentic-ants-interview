const express = require('express');
const router = express.Router();
const {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
  searchNotes,

  searchNotesNaturalLanguage
} = require('../controller/noteController');

// Get all notes
router.get('/', getAllNotes);

// Search notes (must come before /:id to avoid conflicts)
router.get('/search', searchNotes);

// Get note by ID
router.get('/:id', getNoteById);

// Create new note
router.post('/', createNote);

// Update note
router.put('/:id', updateNote);

// Delete note
router.delete('/:id', deleteNote);


// Natural Language Search endpoint
router.post('/search/natural', searchNotesNaturalLanguage);

module.exports = router;
