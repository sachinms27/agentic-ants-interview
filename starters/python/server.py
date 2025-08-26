from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(title="Notes API Challenge", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class Note(BaseModel):
    id: str
    title: str
    content: str
    tags: List[str]
    createdAt: str

class CreateNoteRequest(BaseModel):
    title: str
    content: str
    tags: List[str]

# Sample test data - DO NOT MODIFY THIS DATA
test_notes = [
    {
        "id": "note-001",
        "title": "Project Kickoff Meeting",
        "content": "Met with the team to discuss the new mobile app project. Key decisions: React Native for cross-platform development, 3-month timeline, $50k budget allocated.",
        "tags": ["meeting", "project", "mobile"],
        "createdAt": "2025-01-10T09:00:00Z"
    },
    {
        "id": "note-002",
        "title": "Bug Fix - Login Issue",
        "content": "Fixed authentication bug where users couldn't login with special characters in password. Issue was with regex validation. Updated regex pattern and added unit tests.",
        "tags": ["bug", "authentication", "resolved"],
        "createdAt": "2025-01-11T14:30:00Z"
    },
    {
        "id": "note-003",
        "title": "Customer Feedback Summary",
        "content": "Compiled feedback from 5 customer interviews. Main points: Need better mobile experience, want dark mode, requesting export to PDF feature. Priority: mobile experience.",
        "tags": ["feedback", "customer", "feature-request"],
        "createdAt": "2025-01-12T11:00:00Z"
    },
    {
        "id": "note-004",
        "title": "Team Standup Notes",
        "content": "Daily standup: John working on API optimization, Sarah finishing UI redesign, Mike investigating performance issues. Blocker: waiting for design approval from client.",
        "tags": ["meeting", "standup", "daily"],
        "createdAt": "2025-01-13T09:15:00Z"
    },
    {
        "id": "note-005",
        "title": "Architecture Decision - Database",
        "content": "Decided to migrate from MongoDB to PostgreSQL for better relational data handling and ACID compliance. Migration planned for next sprint. Need to update ORM from Mongoose to Prisma.",
        "tags": ["architecture", "database", "decision"],
        "createdAt": "2025-01-14T16:00:00Z"
    }
]

# In-memory storage - Start with test data
notes = test_notes.copy()

# Helper function to generate unique ID
def generate_id() -> str:
    return f"note-{str(uuid.uuid4())[:8]}"

# Helper function to get current timestamp
def get_current_timestamp() -> str:
    return datetime.utcnow().isoformat() + "Z"

# =====================================================
# TODO: IMPLEMENT YOUR API ENDPOINTS HERE
# =====================================================

@app.get("/api")
def root():
    """Base endpoint with API information"""
    return {
        "message": "Notes API Challenge",
        "endpoints": [
            "GET /api/notes",
            "GET /api/notes/{id}",
            "POST /api/notes",
            "DELETE /api/notes/{id}",
            "GET /api/notes/search"
        ],
        "docs": "/docs"
    }

@app.get("/api/notes", response_model=List[Note])
def get_all_notes():
    """Requirement 1: List all notes"""
    # TODO: Implement this endpoint
    raise HTTPException(status_code=501, detail="Not implemented")

@app.get("/api/notes/search", response_model=List[Note])
def search_notes(
    q: Optional[str] = Query(None, description="Search in title and content"),
    tag: Optional[str] = Query(None, description="Search by exact tag match")
):
    """Requirement 2: Search notes by query or tag"""
    # TODO: Implement search functionality
    # If q is provided: search in title and content (case-insensitive)
    # If tag is provided: search for exact tag match
    raise HTTPException(status_code=501, detail="Not implemented")

@app.get("/api/notes/{note_id}", response_model=Note)
def get_note(note_id: str):
    """Requirement 1: Get a specific note by ID"""
    # TODO: Implement this endpoint
    raise HTTPException(status_code=501, detail="Not implemented")

@app.post("/api/notes", response_model=Note)
def create_note(note: CreateNoteRequest):
    """Requirement 1: Create a new note"""
    # TODO: Implement this endpoint
    # Hint: Use generate_id() for ID
    # Hint: Use get_current_timestamp() for createdAt
    raise HTTPException(status_code=501, detail="Not implemented")

@app.delete("/api/notes/{note_id}")
def delete_note(note_id: str):
    """Requirement 1: Delete a note"""
    # TODO: Implement this endpoint
    raise HTTPException(status_code=501, detail="Not implemented")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Notes API Challenge - Python/FastAPI")
    print(f"📊 Loaded {len(notes)} test notes")
    print("📚 API Documentation: http://localhost:3000/docs")
    uvicorn.run(app, host="0.0.0.0", port=3000)