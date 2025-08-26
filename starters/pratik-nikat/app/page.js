'use client';
import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

export default function Home() {
  const [formData, setFormData] = useState({
    clientName: '',
    meetingDate: '',
    contactInfo: {
      phone: '',
      email: ''
    },
    meetingType: '',
    notes: '',
    requirements: {
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      minPrice: '',
      maxPrice: '',
      preferredAreas: '',
      mustHaves: '',
      niceToHaves: '',
      dealBreakers: ''
    },
    timeline: '',
    preApproved: false,
    followUpDate: '',
    tags: ''
  });
  
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // API Functions
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (noteData) => {
    try {
      const payload = {
        ...noteData,
        id: `note-${Date.now()}`,
        contactInfo: {
          phone: noteData.contactInfo.phone,
          email: noteData.contactInfo.email
        },
        requirements: {
          ...noteData.requirements,
          bedrooms: parseInt(noteData.requirements.bedrooms) || 0,
          bathrooms: parseInt(noteData.requirements.bathrooms) || 0,
          minPrice: parseInt(noteData.requirements.minPrice) || 0,
          maxPrice: parseInt(noteData.requirements.maxPrice) || 0,
          preferredAreas: noteData.requirements.preferredAreas.split(',').map(a => a.trim()).filter(a => a),
          mustHaves: noteData.requirements.mustHaves.split(',').map(a => a.trim()).filter(a => a),
          niceToHaves: noteData.requirements.niceToHaves.split(',').map(a => a.trim()).filter(a => a),
          dealBreakers: noteData.requirements.dealBreakers.split(',').map(a => a.trim()).filter(a => a)
        },
        tags: noteData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchNotes();
        resetForm();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating note:', error);
      return false;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });

      if (response.ok) {
        await fetchNotes();
        setEditingNote(null);
        resetForm();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating note:', error);
      return false;
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchNotes();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  };

  const searchNotes = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/notes/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error searching notes:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Basic validation
    if (!formData.clientName || !formData.meetingDate || !formData.meetingType) {
      setErrors({ general: 'Please fill in required fields' });
      setIsSubmitting(false);
      return;
    }

    const success = editingNote 
      ? await updateNote(editingNote.id, formData)
      : await createNote(formData);

    if (!success) {
      setErrors({ general: 'Error saving note. Please try again.' });
    }

    setIsSubmitting(false);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      clientName: note.clientName,
      meetingDate: note.meetingDate ? note.meetingDate.split('T')[0] : '',
      contactInfo: {
        phone: note.contactInfo.phone || '',
        email: note.contactInfo.email || ''
      },
      meetingType: note.meetingType,
      notes: note.notes,
      requirements: {
        propertyType: note.requirements.propertyType || '',
        bedrooms: note.requirements.bedrooms || '',
        bathrooms: note.requirements.bathrooms || '',
        minPrice: note.requirements.minPrice || '',
        maxPrice: note.requirements.maxPrice || '',
        preferredAreas: note.requirements.preferredAreas ? note.requirements.preferredAreas.join(', ') : '',
        mustHaves: note.requirements.mustHaves ? note.requirements.mustHaves.join(', ') : '',
        niceToHaves: note.requirements.niceToHaves ? note.requirements.niceToHaves.join(', ') : '',
        dealBreakers: note.requirements.dealBreakers ? note.requirements.dealBreakers.join(', ') : ''
      },
      timeline: note.timeline,
      preApproved: note.preApproved,
      followUpDate: note.followUpDate ? note.followUpDate.split('T')[0] : '',
      tags: note.tags ? note.tags.join(', ') : ''
    });
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      meetingDate: '',
      contactInfo: { phone: '', email: '' },
      meetingType: '',
      notes: '',
      requirements: {
        propertyType: '',
        bedrooms: '',
        bathrooms: '',
        minPrice: '',
        maxPrice: '',
        preferredAreas: '',
        mustHaves: '',
        niceToHaves: '',
        dealBreakers: ''
      },
      timeline: '',
      preApproved: false,
      followUpDate: '',
      tags: ''
    });
    setEditingNote(null);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      searchNotes(query);
    } else {
      setSearchResults([]);
    }
  };

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Real Estate Meeting Notes</h1>
        
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Natural Language Search</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Try: '3 bed 2 bath under 500k', 'first-time buyers', 'urgent pre-approved', 'Westside good schools'"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3">Search Results ({searchResults.length})</h3>
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{result.note.clientName}</h4>
                        <p className="text-sm text-gray-600 mb-2">{result.note.meetingType} • {result.note.timeline}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {result.note.requirements && (
                            <>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {result.note.requirements.propertyType}
                              </span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                {result.note.requirements.bedrooms}bed/{result.note.requirements.bathrooms}bath
                              </span>
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                ${result.note.requirements.minPrice?.toLocaleString()} - ${result.note.requirements.maxPrice?.toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-sm text-gray-700">
                          <strong>Match Reasons:</strong> {result.matches.join(', ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
                          Score: {result.score}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Relevance: {Math.round(result.relevance * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingNote ? 'Edit Meeting Note' : 'Add New Meeting Note'}
            </h2>
            
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Date *</label>
                  <input
                    type="date"
                    name="meetingDate"
                    value={formData.meetingDate}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type *</label>
                  <select
                    name="meetingType"
                    value={formData.meetingType}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="Initial Consultation">Initial Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Property Tour">Property Tour</option>
                    <option value="Offer Discussion">Offer Discussion</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    name="requirements.propertyType"
                    value={formData.requirements.propertyType}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="Single Family">Single Family</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Multi-family">Multi-family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    name="requirements.bedrooms"
                    value={formData.requirements.bedrooms}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    name="requirements.bathrooms"
                    value={formData.requirements.bathrooms}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    name="requirements.minPrice"
                    value={formData.requirements.minPrice}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    name="requirements.maxPrice"
                    value={formData.requirements.maxPrice}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Areas (comma-separated)</label>
                <input
                  type="text"
                  name="requirements.preferredAreas"
                  value={formData.requirements.preferredAreas}
                  onChange={handleChange}
                  placeholder="e.g., Westside, Downtown, School District 23"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Must Haves (comma-separated)</label>
                  <input
                    type="text"
                    name="requirements.mustHaves"
                    value={formData.requirements.mustHaves}
                    onChange={handleChange}
                    placeholder="e.g., garage, good schools"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nice to Haves (comma-separated)</label>
                  <input
                    type="text"
                    name="requirements.niceToHaves"
                    value={formData.requirements.niceToHaves}
                    onChange={handleChange}
                    placeholder="e.g., pool, updated kitchen"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deal Breakers (comma-separated)</label>
                <input
                  type="text"
                  name="requirements.dealBreakers"
                  value={formData.requirements.dealBreakers}
                  onChange={handleChange}
                  placeholder="e.g., busy street, major repairs"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Timeline</option>
                    <option value="ASAP">ASAP</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6+ months">6+ months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preApproved"
                      checked={formData.preApproved}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Pre-Approved</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., first-time buyer, urgent"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingNote ? 'Update Note' : 'Create Note'}
                </button>
                {editingNote && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Notes List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Meeting Notes ({notes.length})</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notes.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{note.clientName}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(note)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Meeting:</strong> {note.meetingType}</p>
                      <p><strong>Timeline:</strong> {note.timeline}</p>
                      {note.requirements && (
                        <p><strong>Looking for:</strong> {note.requirements.propertyType} • {note.requirements.bedrooms}bed/{note.requirements.bathrooms}bath</p>
                      )}
                      <p><strong>Contact:</strong> {note.contactInfo.email} • {note.contactInfo.phone}</p>
                      {note.preApproved && <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Pre-Approved</span>}
                    </div>
                    
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
