from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from datetime import datetime
import uuid

app = FastAPI(title="Real Estate Notes API Challenge", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample test data - Real Estate Meeting Notes
# TODO: You'll need to design proper data models for this structure
test_notes = [
    {
        "id": "note-001",
        "clientName": "Michael and Sarah Johnson",
        "meetingDate": "2025-01-10T14:00:00Z",
        "notes": "First-time homebuyers, both teachers. Pre-approved for $480k. Looking for starter home to raise family. Expecting first child in 6 months. Want Westside Elementary zone.",
        "tags": ["first-time buyer", "expecting parents", "teachers", "urgent"],
        "createdAt": "2025-01-10T14:00:00Z"
    },
    {
        "id": "note-002",
        "clientName": "Robert Chen",
        "meetingDate": "2025-01-12T10:30:00Z", 
        "notes": "Software engineer looking for investment property. Has cash reserves. Wants multi-family properties in up-and-coming neighborhoods for rental income. Prefers properties near tech companies.",
        "tags": ["investor", "cash buyer", "tech professional", "analytical"],
        "createdAt": "2025-01-12T10:30:00Z"
    }
]

# In-memory storage
notes = test_notes.copy()

# Helper functions
def generate_id() -> str:
    return f"note-{str(uuid.uuid4())[:8]}"

def get_current_timestamp() -> str:
    return datetime.now().isoformat() + "Z"

# =====================================================
# TODO: IMPLEMENT YOUR API ENDPOINTS HERE
# Focus on implementing the natural language search!
# =====================================================

@app.get("/api")
def root():
    """Base endpoint"""
    return {
        "message": "Real Estate Notes API Challenge - Python/FastAPI",
        "focus": "Build natural language search for real estate meeting notes",
        "primaryFeature": "POST /api/notes/search",
        "testData": "Import from /test-data/meeting-notes.json",
        "docs": "/docs"
    }

# TODO: Implement your CRUD endpoints here
# GET /api/notes - List notes
# GET /api/notes/{id} - Get specific note  
# POST /api/notes - Create note
# PUT /api/notes/{id} - Update note
# DELETE /api/notes/{id} - Delete note

# TODO: IMPLEMENT NATURAL LANGUAGE SEARCH (PRIMARY FEATURE)
# POST /api/notes/search
# This should handle queries like:
# - "3 bed 2 bath under 500k"
# - "first-time buyers with pre-approval"
# - "clients interested in Westside neighborhood"

# TODO: Implement bulk import for test data
# POST /api/notes/bulk-import

if __name__ == "__main__":
    import uvicorn
    print("🚀 Real Estate Notes API Challenge - Python/FastAPI")
    print(f"📊 Loaded {len(notes)} sample meeting notes")
    print("🎯 PRIMARY GOAL: Implement natural language search")
    print("📚 API Documentation: http://localhost:3000/docs")
    uvicorn.run(app, host="0.0.0.0", port=3000)