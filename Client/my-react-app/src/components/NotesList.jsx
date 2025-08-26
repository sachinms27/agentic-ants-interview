import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchNotes, searchNotesNatural } from '../data/api'

const NotesList = ({ onDeleteNote }) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true)
        const response = await fetchNotes()
        // Extract the notes array from the response
        const notesData = response.notes || response || []
        setNotes(notesData)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch notes:', err)
        setError('Failed to load notes. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [])

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setSearchError(null)
      return
    }

    try {
      setIsSearching(true)
      setSearchError(null)
      console.log('🔍 Searching for:', query)
      
      const response = await searchNotesNatural(query)
      console.log('📡 API Response:', response)
      
      // Handle different response structures
      let results = []
      if (response.results && Array.isArray(response.results)) {
        // If response has a results array
        results = response.results
        console.log('✅ Found results array:', results)
      } else if (Array.isArray(response)) {
        // If response is directly an array
        results = response
        console.log('✅ Response is direct array:', results)
      } else if (response && typeof response === 'object') {
        // If response is a single object, wrap it in array
        results = [response]
        console.log('✅ Response is single object, wrapped in array:', results)
      } else {
        console.log('❌ No valid results found in response:', response)
        results = []
      }
      
      setSearchResults(results)
      console.log('🎯 Final search results set:', results)
      
    } catch (err) {
      console.error('Search failed:', err)
      setSearchError('Search failed. Please try again.')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchInputChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // Clear search results when input changes
    if (!query.trim()) {
      setSearchResults([])
      setSearchError(null)
    }
  }

  const handleSearchButtonClick = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setSearchError(null)
  }

  const handleNoteClick = (note) => {
    const noteId = note.id || note._id
    navigate(`/notes/${noteId}`)
  }

  if (loading) {
    return (
      <div className="notes-list loading">
        <p>Loading notes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="notes-list error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Retry
        </button>
      </div>
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="notes-list empty">
        <p>No client notes found. Create your first client note!</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Determine which notes to display
  const displayNotes = searchResults.length > 0 ? searchResults : notes

  return (
    <div className="notes-list">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search notes with natural language (e.g., '3 bed 2 bath homes in Westside under 600k')"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="search-input"
        />
        {searchQuery && (
          <button onClick={clearSearch} className="clear-search-btn">
            ×
          </button>
        )}
        <button 
          onClick={handleSearchButtonClick}
          className="search-btn"
          disabled={!searchQuery.trim()}
        >
          Search
        </button>
      </div>

      {/* Search Status Messages */}
      {isSearching && (
        <div className="search-status">
          <p>🔍 Searching...</p>
        </div>
      )}

      {searchResults.length > 0 && !isSearching && (
        <div className="search-status">
          <p>✅ Found {searchResults.length} result(s) for "{searchQuery}"</p>
        </div>
      )}

      {searchError && (
        <div className="search-status error">
          <p>❌ {searchError}</p>
        </div>
      )}

      {/* Debug Info */}
      {searchQuery && (
        <div className="search-status" style={{background: '#e3f2fd', color: '#1976d2'}}>
          <p>🔍 Debug: Query: "{searchQuery}" | Results: {searchResults.length} | Display Notes: {displayNotes.length}</p>
          <p>🔍 Search Results Array: {JSON.stringify(searchResults, null, 2)}</p>
        </div>
      )}

      {/* No Search Results Message */}
      {searchQuery && searchResults.length === 0 && !isSearching && !searchError && (
        <div className="search-status" style={{background: '#fff3cd', color: '#856404'}}>
          <p>🔍 No search results found for "{searchQuery}"</p>
        </div>
      )}

      {/* Notes Display */}
      {displayNotes.length > 0 ? (
        displayNotes.map((note) => (
          <div key={note.id || note._id} className="note-item client-note" onClick={() => handleNoteClick(note)}>
            <div className="note-header">
              <h3 className="note-title">{note.clientName}</h3>
              <div className="note-actions">
                <span className="meeting-type-badge">{note.meetingType}</span>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteNote(note.id || note._id)
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="note-content">
              <div className="note-section">
                <strong>📅</strong> {formatDate(note.meetingDate)} • <strong>🏠</strong> {note.requirements?.propertyType || 'N/A'}
              </div>
              
              <div className="note-section">
                <strong>💰</strong> {formatPrice(note.requirements?.minPrice)} - {formatPrice(note.requirements?.maxPrice)}
              </div>
              
              <div className="note-section">
                <strong>⏰</strong> {note.timeline || 'N/A'} • <strong>✅</strong> {note.preApproved ? 'Pre-approved' : 'Not pre-approved'}
              </div>
              
              {note.tags && note.tags.length > 0 && (
                <div className="note-section">
                  <strong>🏷️</strong> 
                  <div className="tags-container">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                    {note.tags.length > 3 && <span className="tag">+{note.tags.length - 3}</span>}
                  </div>
                </div>
              )}
            </div>
            
            <div className="note-meta">
              <span className="note-date">Created: {formatDate(note.createdAt)}</span>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <span className="note-updated">Updated: {formatDate(note.updatedAt)}</span>
              )}
            </div>
          </div>
        ))
      ) : (
        searchQuery && !isSearching && !searchError && (
          <div className="search-status" style={{background: '#f8d7da', color: '#721c24'}}>
            <p>❌ No notes to display. Search results: {searchResults.length}, Regular notes: {notes.length}</p>
          </div>
        )
      )}
    </div>
  )
}

export default NotesList
