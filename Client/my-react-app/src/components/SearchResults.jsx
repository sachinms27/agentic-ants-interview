import React from 'react'

const SearchResults = ({ results, searchTerm, onResultClick, onClearSearch }) => {
  if (!searchTerm) {
    return null
  }

  if (results.length === 0) {
    return (
      <div className="search-results">
        <div className="search-header">
          <h3>Search Results</h3>
          <button onClick={onClearSearch} className="clear-search-btn">
            Clear Search
          </button>
        </div>
        <div className="no-results">
          <p>No notes found for "{searchTerm}"</p>
          <p>Try different keywords or check your spelling.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="search-results">
      <div className="search-header">
        <h3>Search Results for "{searchTerm}"</h3>
        <span className="results-count">{results.length} note{results.length !== 1 ? 's' : ''} found</span>
        <button onClick={onClearSearch} className="clear-search-btn">
          Clear Search
        </button>
      </div>
      
      <div className="results-list">
        {results.map((note) => (
          <div 
            key={note.id} 
            className="result-item"
            onClick={() => onResultClick(note)}
          >
            <h4 className="result-title">{note.title}</h4>
            <p className="result-content">
              {note.content.length > 150 
                ? `${note.content.substring(0, 150)}...` 
                : note.content
              }
            </p>
            <div className="result-meta">
              <span className="result-date">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
              {note.updatedAt !== note.createdAt && (
                <span className="result-updated">
                  Updated: {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResults
