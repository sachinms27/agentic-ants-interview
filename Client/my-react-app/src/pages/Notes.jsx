import React, { useState, useEffect } from 'react'
import { NotesList, NoteForm, SearchBar, SearchResults } from '../components'

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [editingNote, setEditingNote] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showForm, setShowForm] = useState(false)

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = notes.filter(note => 
        note.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.requirements?.propertyType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchTerm, notes])

  const handleCreateNote = () => {
    console.log('Create note button clicked!')
    setEditingNote(null)
    setShowForm(true)
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setShowForm(true)
  }

  const handleSubmitNote = (noteData) => {
    if (editingNote) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === noteData.id ? noteData : note
      ))
    } else {
      // Create new note
      setNotes([...notes, noteData])
    }
    setShowForm(false)
    setEditingNote(null)
  }

  const handleCancelNote = () => {
    setShowForm(false)
    setEditingNote(null)
  }

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId))
    if (editingNote && editingNote.id === noteId) {
      setShowForm(false)
      setEditingNote(null)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
  }

  const handleResultClick = (note) => {
    handleEditNote(note)
    setSearchTerm('')
    setSearchResults([])
  }

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h1>Client Notes</h1>
        <button 
          onClick={handleCreateNote}
          className="btn btn-primary create-note-btn"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          ✨ Create Client Note
        </button>
      </div>

      <SearchBar onSearch={handleSearch} />

      {searchTerm && (
        <SearchResults
          results={searchResults}
          searchTerm={searchTerm}
          onResultClick={handleResultClick}
          onClearSearch={handleClearSearch}
        />
      )}

      {showForm && (
        <NoteForm
          note={editingNote}
          onSubmit={handleSubmitNote}
          onCancel={handleCancelNote}
        />
      )}

      <NotesList
        onDeleteNote={handleDeleteNote}
      />
    </div>
  )
}

export default Notes
