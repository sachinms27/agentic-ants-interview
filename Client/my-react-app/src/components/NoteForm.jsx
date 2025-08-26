import React, { useState, useEffect } from 'react'
import { createNote, updateNote } from '../data/api'

const NoteForm = ({ note, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    clientName: '',
    meetingDate: '',
    contactInfo: { phone: '', email: '' },
    meetingType: 'Initial Consultation',
    notes: '',
    requirements: {
      propertyType: 'Single Family',
      bedrooms: '',
      bathrooms: '',
      minPrice: '',
      maxPrice: '',
      preferredAreas: [],
      mustHaves: [],
      niceToHaves: [],
      dealBreakers: []
    },
    timeline: '3-6 months',
    preApproved: false,
    followUpDate: '',
    tags: []
  })

  useEffect(() => {
    if (note) {
      setFormData({
        id: note.id || '',
        clientName: note.clientName || '',
        meetingDate: note.meetingDate || '',
        contactInfo: note.contactInfo || { phone: '', email: '' },
        meetingType: note.meetingType || 'Initial Consultation',
        notes: note.notes || '',
        requirements: note.requirements || {
          propertyType: 'Single Family',
          bedrooms: '',
          bathrooms: '',
          minPrice: '',
          maxPrice: '',
          preferredAreas: [],
          mustHaves: [],
          niceToHaves: [],
          dealBreakers: []
        },
        timeline: note.timeline || '3-6 months',
        preApproved: note.preApproved || false,
        followUpDate: note.followUpDate || '',
        tags: Array.isArray(note.tags) ? note.tags : []
      })
    }
  }, [note])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.clientName.trim() || !formData.notes.trim()) return

    const noteData = {
      id: note?.id || Date.now().toString(),
      clientName: formData.clientName.trim(),
      meetingDate: formData.meetingDate,
      contactInfo: {
        phone: formData.contactInfo.phone.trim(),
        email: formData.contactInfo.email.trim()
      },
      meetingType: formData.meetingType,
      notes: formData.notes.trim(),
      requirements: {
        propertyType: formData.requirements.propertyType,
        bedrooms: formData.requirements.bedrooms ? Number(formData.requirements.bedrooms) : undefined,
        bathrooms: formData.requirements.bathrooms ? Number(formData.requirements.bathrooms) : undefined,
        minPrice: formData.requirements.minPrice ? Number(formData.requirements.minPrice) : undefined,
        maxPrice: formData.requirements.maxPrice ? Number(formData.requirements.maxPrice) : undefined,
        preferredAreas: formData.requirements.preferredAreas.filter(area => area.trim()),
        mustHaves: formData.requirements.mustHaves.filter(item => item.trim()),
        niceToHaves: formData.requirements.niceToHaves.filter(item => item.trim()),
        dealBreakers: formData.requirements.dealBreakers.filter(item => item.trim())
      },
      timeline: formData.timeline,
      preApproved: formData.preApproved,
      followUpDate: formData.followUpDate,
      tags: (Array.isArray(formData.tags) ? formData.tags : []).filter(tag => tag.trim()),
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    try {
      let response
      if (note) {
        // Update existing note
        response = await updateNote(note.id, noteData)
      } else {
        // Create new note
        response = await createNote(noteData)
      }
      
      // Call the onSubmit callback with the response from API
      onSubmit(response || noteData)
      
      // Reset form
      setFormData({
        id: '',
        clientName: '',
        meetingDate: '',
        contactInfo: { phone: '', email: '' },
        meetingType: 'Initial Consultation',
        notes: '',
        requirements: {
          propertyType: 'Single Family',
          bedrooms: '',
          bathrooms: '',
          minPrice: '',
          maxPrice: '',
          preferredAreas: [],
          mustHaves: [],
          niceToHaves: [],
          dealBreakers: []
        },
        timeline: '3-6 months',
        preApproved: false,
        followUpDate: '',
        tags: []
      })
    } catch (error) {
      console.error('Failed to save note:', error)
      // You might want to show an error message to the user here
      alert('Failed to save note. Please try again.')
    }
  }

  const handleCancel = () => {
    setFormData({
      id: '',
      clientName: '',
      meetingDate: '',
      contactInfo: { phone: '', email: '' },
      meetingType: 'Initial Consultation',
      notes: '',
      requirements: {
        propertyType: 'Single Family',
        bedrooms: '',
        bathrooms: '',
        minPrice: '',
        maxPrice: '',
        preferredAreas: [],
        mustHaves: [],
        niceToHaves: [],
        dealBreakers: []
      },
      timeline: '3-6 months',
      preApproved: false,
      followUpDate: '',
      tags: []
    })
    onCancel()
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const addArrayItem = (parentField, childField) => {
    if (parentField === 'tags') {
      // Special handling for tags since it's a top-level array
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), '']
      }))
    } else {
      // Handle nested arrays under requirements
      setFormData(prev => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [childField]: [...(prev[parentField]?.[childField] || []), '']
        }
      }))
    }
  }

  const removeArrayItem = (parentField, childField, index) => {
    if (parentField === 'tags') {
      // Special handling for tags since it's a top-level array
      setFormData(prev => ({
        ...prev,
        tags: (prev.tags || []).filter((_, i) => i !== index)
      }))
    } else {
      // Handle nested arrays under requirements
      setFormData(prev => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [childField]: (prev[parentField]?.[childField] || []).filter((_, i) => i !== index)
        }
      }))
    }
  }

  const updateArrayItem = (parentField, childField, index, value) => {
    if (parentField === 'tags') {
      // Special handling for tags since it's a top-level array
      setFormData(prev => ({
        ...prev,
        tags: (prev.tags || []).map((item, i) => i === index ? value : item)
      }))
    } else {
      // Handle nested arrays under requirements
      setFormData(prev => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [childField]: (prev[parentField]?.[childField] || []).map((item, i) => i === index ? value : item)
        }
      }))
    }
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Client Information</h3>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Client Name *"
            value={formData.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="date"
            value={formData.meetingDate}
            onChange={(e) => handleInputChange('meetingDate', e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="tel"
              placeholder="Phone"
              value={formData.contactInfo.phone}
              onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={formData.contactInfo.email}
              onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <select
            value={formData.meetingType}
            onChange={(e) => handleInputChange('meetingType', e.target.value)}
            className="form-select"
          >
            <option value="Initial Consultation">Initial Consultation</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Property Tour">Property Tour</option>
            <option value="Offer Discussion">Offer Discussion</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3>Meeting Notes</h3>
        
        <div className="form-group">
          <textarea
            placeholder="Meeting notes and discussion points *"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="form-textarea"
            rows="4"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Property Requirements</h3>
        
        <div className="form-group">
          <select
            value={formData.requirements.propertyType}
            onChange={(e) => handleInputChange('requirements.propertyType', e.target.value)}
            className="form-select"
          >
            <option value="Single Family">Single Family</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Multi-family">Multi-family</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="number"
              placeholder="Bedrooms"
              value={formData.requirements.bedrooms}
              onChange={(e) => handleInputChange('requirements.bedrooms', e.target.value)}
              className="form-input"
              min="0"
            />
          </div>
          
          <div className="form-group">
            <input
              type="number"
              placeholder="Bathrooms"
              value={formData.requirements.bathrooms}
              onChange={(e) => handleInputChange('requirements.bathrooms', e.target.value)}
              className="form-input"
              min="0"
              step="0.5"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="number"
              placeholder="Min Price"
              value={formData.requirements.minPrice}
              onChange={(e) => handleInputChange('requirements.minPrice', e.target.value)}
              className="form-input"
              min="0"
            />
          </div>
          
          <div className="form-group">
            <input
              type="number"
              placeholder="Max Price"
              value={formData.requirements.maxPrice}
              onChange={(e) => handleInputChange('requirements.maxPrice', e.target.value)}
              className="form-input"
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Preferred Areas</label>
          {(formData.requirements.preferredAreas || []).map((area, index) => (
            <div key={index} className="array-input-row">
              <input
                type="text"
                placeholder="Preferred area"
                value={area}
                onChange={(e) => updateArrayItem('requirements', 'preferredAreas', index, e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('requirements', 'preferredAreas', index)}
                className="btn btn-danger btn-small"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('requirements', 'preferredAreas')}
            className="btn btn-secondary btn-small"
          >
            Add Preferred Area
          </button>
        </div>

        <div className="form-group">
          <label>Must Haves</label>
          {(formData.requirements.mustHaves || []).map((item, index) => (
            <div key={index} className="array-input-row">
              <input
                type="text"
                placeholder="Must have feature"
                value={item}
                onChange={(e) => updateArrayItem('requirements', 'mustHaves', index, e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('requirements', 'mustHaves', index)}
                className="btn btn-danger btn-small"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('requirements', 'mustHaves')}
            className="btn btn-secondary btn-small"
          >
            Add Must Have
          </button>
        </div>

        <div className="form-group">
          <label>Nice to Haves</label>
          {(formData.requirements.niceToHaves || []).map((item, index) => (
            <div key={index} className="array-input-row">
              <input
                type="text"
                placeholder="Nice to have feature"
                value={item}
                onChange={(e) => updateArrayItem('requirements', 'niceToHaves', index, e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('requirements', 'niceToHaves', index)}
                className="btn btn-danger btn-small"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('requirements', 'niceToHaves')}
            className="btn btn-secondary btn-small"
          >
            Add Nice to Have
          </button>
        </div>

        <div className="form-group">
          <label>Deal Breakers</label>
          {(formData.requirements.dealBreakers || []).map((item, index) => (
            <div key={index} className="array-input-row">
              <input
                type="text"
                placeholder="Deal breaker"
                value={item}
                onChange={(e) => updateArrayItem('requirements', 'dealBreakers', index, e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('requirements', 'dealBreakers', index)}
                className="btn btn-danger btn-small"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('requirements', 'dealBreakers')}
            className="btn btn-secondary btn-small"
          >
            Add Deal Breaker
          </button>
        </div>
      </div>

      <div className="form-section">
        <h3>Additional Information</h3>
        
        <div className="form-group">
          <select
            value={formData.timeline}
            onChange={(e) => handleInputChange('timeline', e.target.value)}
            className="form-select"
          >
            <option value="ASAP">ASAP</option>
            <option value="1-3 months">1-3 months</option>
            <option value="3-6 months">3-6 months</option>
            <option value="6+ months">6+ months</option>
          </select>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.preApproved}
              onChange={(e) => handleInputChange('preApproved', e.target.checked)}
            />
            Pre-approved for mortgage
          </label>
        </div>

        <div className="form-group">
          <input
            type="date"
            placeholder="Follow-up Date"
            value={formData.followUpDate}
            onChange={(e) => handleInputChange('followUpDate', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          {(formData.tags || []).map((tag, index) => (
            <div key={index} className="array-input-row">
              <input
                type="text"
                placeholder="Tag"
                value={tag}
                onChange={(e) => updateArrayItem('tags', '', index, e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('tags', '', index)}
                className="btn btn-danger btn-small"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('tags', '')}
            className="btn btn-secondary btn-small"
          >
            Add Tag
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {note ? 'Update Client Note' : 'Create Client Note'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  )


}

export default NoteForm
