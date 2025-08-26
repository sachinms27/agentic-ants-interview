# Python/FastAPI Starter - Notes API Challenge

## 🚀 Quick Start

1. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the server:**
   ```bash
   python server.py
   ```

4. **View API documentation:**
   Open http://localhost:3000/docs in your browser

## 📁 Structure

- `server.py` - Main server file with FastAPI endpoints
- `requirements.txt` - Python dependencies

## 💡 Helpful Tips

### FastAPI Features
- **Automatic documentation** at `/docs`
- **Type hints** for better code completion
- **Pydantic models** for data validation

### Testing with curl

```bash
# Create a note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Note",
    "content": "This is a test",
    "tags": ["test"]
  }'

# Search notes
curl "http://localhost:3000/api/notes/search?q=meeting"
curl "http://localhost:3000/api/notes/search?tag=bug"

# Get all notes
curl http://localhost:3000/api/notes

# Get specific note
curl http://localhost:3000/api/notes/note-001

# Delete a note
curl -X DELETE http://localhost:3000/api/notes/note-005
```

## 🎯 FastAPI Advantages

- **Interactive API docs** - Test your endpoints directly from the browser
- **Type validation** - Automatic request/response validation
- **Clear error messages** - Helpful debugging information

## ✅ Checklist

- [ ] GET /api/notes - List all notes
- [ ] GET /api/notes/{id} - Get specific note
- [ ] POST /api/notes - Create new note
- [ ] DELETE /api/notes/{id} - Delete a note
- [ ] GET /api/notes/search - Search functionality

Good luck! 🎉