import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchNote, deleteNote } from '../data/api'

const NoteDetail = () => {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadNote = async () => {
      try {
        setLoading(true)
        const noteData = await fetchNote(noteId)
        setNote(noteData)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch note:', err)
        setError('Failed to load note. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (noteId) {
      loadNote()
    }
  }, [noteId])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId)
        navigate('/notes')
      } catch (err) {
        console.error('Failed to delete note:', err)
        alert('Failed to delete note. Please try again.')
      }
    }
  }

  const handleEdit = () => {
    navigate(`/notes/${noteId}/edit`)
  }

  if (loading) {
    return (
      <div className="note-detail loading">
        <p>Loading note...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="note-detail error">
        <p>{error}</p>
        <button onClick={() => navigate('/notes')} className="btn btn-primary">
          Back to Notes
        </button>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="note-detail not-found">
        <p>Note not found</p>
        <button onClick={() => navigate('/notes')} className="btn btn-primary">
          Back to Notes
        </button>
      </div>
    )
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

  return (
    <div className="note-detail">
      <div className="note-detail-header">
        <button onClick={() => navigate('/notes')} className="btn btn-secondary back-btn">
          ← Back to Notes
        </button>
        <div className="note-actions">
          <button onClick={handleEdit} className="btn btn-primary">
            Edit Note
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete Note
          </button>
        </div>
      </div>

      <div className="note-detail-content">
        <div className="note-title-section">
          <h1>{note.clientName}</h1>
          <div className="note-meta-info">
            <span className="meeting-type-badge">{note.meetingType}</span>
            <span className="meeting-date">{formatDate(note.meetingDate)}</span>
          </div>
        </div>

        <div className="note-sections">
          <div className="note-section">
            <h3>Meeting Information</h3>
            <div className="section-content">
              <p><strong>Meeting Type:</strong> {note.meetingType}</p>
              <p><strong>Meeting Date:</strong> {formatDate(note.meetingDate)}</p>
              <p><strong>Timeline:</strong> {note.timeline || 'N/A'}</p>
              <p><strong>Pre-approved:</strong> {note.preApproved ? 'Yes' : 'No'}</p>
              {note.followUpDate && (
                <p><strong>Follow-up Date:</strong> {formatDate(note.followUpDate)}</p>
              )}
            </div>
          </div>

          <div className="note-section">
            <h3>Contact Information</h3>
            <div className="section-content">
              <p><strong>Phone:</strong> {note.contactInfo?.phone || 'N/A'}</p>
              <p><strong>Email:</strong> {note.contactInfo?.email || 'N/A'}</p>
            </div>
          </div>

          <div className="note-section">
            <h3>Meeting Notes</h3>
            <div className="section-content">
              <p>{note.notes}</p>
            </div>
          </div>

          <div className="note-section">
            <h3>Property Requirements</h3>
            <div className="section-content">
              <div className="requirements-grid">
                <div className="requirement-item">
                  <strong>Property Type:</strong> {note.requirements?.propertyType || 'N/A'}
                </div>
                <div className="requirement-item">
                  <strong>Bedrooms:</strong> {note.requirements?.bedrooms || 'N/A'}
                </div>
                <div className="requirement-item">
                  <strong>Bathrooms:</strong> {note.requirements?.bathrooms || 'N/A'}
                </div>
                <div className="requirement-item">
                  <strong>Min Price:</strong> {formatPrice(note.requirements?.minPrice)}
                </div>
                <div className="requirement-item">
                  <strong>Max Price:</strong> {formatPrice(note.requirements?.maxPrice)}
                </div>
              </div>

              {note.requirements?.preferredAreas && note.requirements.preferredAreas.length > 0 && (
                <div className="requirement-list">
                  <strong>Preferred Areas:</strong>
                  <ul>
                    {note.requirements.preferredAreas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              )}

              {note.requirements?.mustHaves && note.requirements.mustHaves.length > 0 && (
                <div className="requirement-list">
                  <strong>Must Haves:</strong>
                  <ul>
                    {note.requirements.mustHaves.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {note.requirements?.niceToHaves && note.requirements.niceToHaves.length > 0 && (
                <div className="requirement-list">
                  <strong>Nice to Haves:</strong>
                  <ul>
                    {note.requirements.niceToHaves.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {note.requirements?.dealBreakers && note.requirements.dealBreakers.length > 0 && (
                <div className="requirement-list">
                  <strong>Deal Breakers:</strong>
                  <ul>
                    {note.requirements.dealBreakers.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {note.tags && note.tags.length > 0 && (
            <div className="note-section">
              <h3>Tags</h3>
              <div className="section-content">
                <div className="tags-container">
                  {note.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="note-section">
            <h3>Timestamps</h3>
            <div className="section-content">
              <p><strong>Created:</strong> {formatDate(note.createdAt)}</p>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <p><strong>Last Updated:</strong> {formatDate(note.updatedAt)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetail
