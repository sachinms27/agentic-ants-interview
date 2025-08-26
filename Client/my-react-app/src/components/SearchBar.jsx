import React, { useState } from 'react'

const SearchBar = ({ onSearch, placeholder = "Search notes..." }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim())
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="search-bar">
      {/* <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-btn"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <button type="submit" className="search-btn">
          Search
        </button>
      </form> */}
    </div>
  )
}

export default SearchBar
