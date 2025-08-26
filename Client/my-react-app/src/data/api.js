// API configuration
const API_BASE_URL = 'http://localhost:3000/api'

// Generic fetch function with error handling
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw new Error(`API request failed: ${error.message}`)
  }
}

// Notes API functions
export const fetchNotes = async () => {
  return await apiRequest('/notes/')
}

export const fetchNote = async (noteId) => {
  return await apiRequest(`/notes/${noteId}`)
}

export const createNote = async (noteData) => {
  return await apiRequest('/notes/', {
    method: 'POST',
    body: JSON.stringify(noteData),
  })
}

export const updateNote = async (noteId, noteData) => {
  return await apiRequest(`/notes/${noteId}`, {
    method: 'PUT',
    body: JSON.stringify(noteData),
  })
}

export const deleteNote = async (noteId) => {
  return await apiRequest(`/notes/${noteId}`, {
    method: 'DELETE',
  })
}

// Natural language search API function
export const searchNotesNatural = async (query) => {
  return await apiRequest('/notes/search/natural', {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}


// Custom hook for API calls
export const useApi = () => {
  return {
    // Notes API
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote,
    // Legacy API
  
  }
}
