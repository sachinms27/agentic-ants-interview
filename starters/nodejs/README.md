# Node.js Starter - Notes API Challenge

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Test your API:**
   ```bash
   # Test the base endpoint
   curl http://localhost:3000/api
   
   # Test your implementations
   curl http://localhost:3000/api/notes
   ```

## 📁 Structure

- `server.js` - Main server file with endpoints to implement
- `package.json` - Project dependencies

## 💡 Helpful Tips

### Creating a Note
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Note",
    "content": "This is a test",
    "tags": ["test"]
  }'
```

### Searching Notes
```bash
# Search by text
curl "http://localhost:3000/api/notes/search?q=meeting"

# Search by tag
curl "http://localhost:3000/api/notes/search?tag=bug"
```

## 🧪 Test Data

The server comes pre-loaded with 5 test notes. Don't modify the `testNotes` array - work with the `notes` array for your implementation.

## ✅ Checklist

- [ ] GET /api/notes - List all notes
- [ ] GET /api/notes/:id - Get specific note
- [ ] POST /api/notes - Create new note
- [ ] DELETE /api/notes/:id - Delete a note
- [ ] GET /api/notes/search - Search functionality

Good luck! 🎉