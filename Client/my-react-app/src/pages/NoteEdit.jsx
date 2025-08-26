import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchNote, updateNote } from '../data/api'
import NoteForm from '../components/NoteForm'

const NoteEdit = () => {
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
        setError('Failed to load note for editing. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (noteId) {
      loadNote()
    }
  }, [noteId])

  const handleSubmit = async (noteData) => {
    try {
      await updateNote(noteId, noteData)
      navigate(`/notes/${noteId}`)
    } catch (err) {
      console.error('Failed to update note:', err)
      alert('Failed to update note. Please try again.')
    }
  }

  const handleCancel = () => {
    navigate(`/notes/${noteId}`)
  }

  if (loading) {
    return (
      <div className="note-edit loading">
        <p>Loading note for editing...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="note-edit error">
        <p>{error}</p>
        <button onClick={() => navigate('/notes')} className="btn btn-primary">
          Back to Notes
        </button>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="note-edit not-found">
        <p>Note not found</p>
        <button onClick={() => navigate('/notes')} className="btn btn-primary">
          Back to Notes
        </button>
      </div>
    )
  }

  return (
    <div className="note-edit">
      <div className="note-edit-header">
        <button onClick={() => navigate(`/notes/${noteId}`)} className="btn btn-secondary back-btn">
          ← Back to Note
        </button>
        <h1>Edit Client Note</h1>
      </div>

      <NoteForm
        note={note}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default NoteEdit
