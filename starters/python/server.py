from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

app = FastAPI(
    title="Real Estate Notes API Challenge", 
    version="1.0.0",
    description="Build intelligent search for real estate agent meeting notes"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models for Real Estate Meeting Notes
class ContactInfo(BaseModel):
    phone: str
    email: str

class Requirements(BaseModel):
    propertyType: str
    bedrooms: int
    bathrooms: int
    minPrice: int
    maxPrice: int
    preferredAreas: List[str]
    mustHaves: List[str]
    niceToHaves: List[str]
    dealBreakers: List[str]

class MeetingNote(BaseModel):
    id: str
    clientName: str
    meetingDate: str
    contactInfo: ContactInfo
    meetingType: str
    notes: str
    requirements: Requirements
    timeline: str
    preApproved: bool
    followUpDate: str
    tags: List[str]
    createdAt: str
    updatedAt: str

class CreateNoteRequest(BaseModel):
    clientName: str
    meetingDate: str
    contactInfo: ContactInfo
    meetingType: str
    notes: str
    requirements: Requirements
    timeline: str
    preApproved: bool
    followUpDate: str
    tags: List[str]

class SearchRequest(BaseModel):
    query: str

class SearchResult(BaseModel):
    note: MeetingNote
    relevanceScore: Optional[float] = None
    matchReasons: Optional[List[str]] = None

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    totalResults: int
    searchApproach: str

# Sample test data - Real Estate Meeting Notes
# To get comprehensive test data, import from /test-data/meeting-notes.json
test_notes = [
    {
        "id": "note-001",
        "clientName": "Michael and Sarah Johnson",
        "meetingDate": "2025-01-10T14:00:00Z",
        "contactInfo": {
            "phone": "555-0123",
            "email": "mjohnson@email.com"
        },
        "meetingType": "Initial Consultation",
        "notes": "First-time homebuyers, both teachers. Pre-approved for $480k. Looking for starter home to raise family. Expecting first child in 6 months. Want Westside Elementary zone.",
        "requirements": {
            "propertyType": "Single Family",
            "bedrooms": 3,
            "bathrooms": 2,
            "minPrice": 400000,
            "maxPrice": 480000,
            "preferredAreas": ["Westside", "School District 23"],
            "mustHaves": ["yard", "good schools", "safe neighborhood"],
            "niceToHaves": ["garage", "updated kitchen", "nursery potential"],
            "dealBreakers": ["busy street", "major repairs needed", "bad school zone"]
        },
        "timeline": "ASAP",
        "preApproved": True,
        "followUpDate": "2025-01-15",
        "tags": ["first-time buyer", "expecting parents", "teachers", "urgent"],
        "createdAt": "2025-01-10T14:00:00Z",
        "updatedAt": "2025-01-10T14:00:00Z"
    },
    {
        "id": "note-002",
        "clientName": "Robert Chen",
        "meetingDate": "2025-01-12T10:30:00Z",
        "contactInfo": {
            "phone": "555-0234",
            "email": "rchen@techcorp.com"
        },
        "meetingType": "Initial Consultation",
        "notes": "Software engineer looking for investment property. Has cash reserves. Wants multi-family properties in up-and-coming neighborhoods for rental income. Prefers properties near tech companies.",
        "requirements": {
            "propertyType": "Multi-family",
            "bedrooms": 2,
            "bathrooms": 2,
            "minPrice": 300000,
            "maxPrice": 600000,
            "preferredAreas": ["University District", "Tech Corridor", "Downtown"],
            "mustHaves": ["rental income potential", "good location", "structural soundness"],
            "niceToHaves": ["multiple units", "parking", "low maintenance"],
            "dealBreakers": ["negative cash flow", "major structural issues", "bad neighborhood trends"]
        },
        "timeline": "3-6 months",
        "preApproved": False,
        "followUpDate": "2025-01-20",
        "tags": ["investor", "cash buyer", "tech professional", "analytical"],
        "createdAt": "2025-01-12T10:30:00Z",
        "updatedAt": "2025-01-12T10:30:00Z"
    }
]

# In-memory storage - Start with test data
notes = test_notes.copy()

# Helper functions
def generate_id() -> str:
    return f"note-{str(uuid.uuid4())[:8]}"

def get_current_timestamp() -> str:
    return datetime.utcnow().isoformat() + "Z"

# =====================================================
# TODO: IMPLEMENT YOUR API ENDPOINTS HERE
# Focus on implementing the natural language search!
# =====================================================

@app.get("/api")
def root():
    """Base endpoint with API information"""
    return {
        "message": "Real Estate Notes API Challenge - Python/FastAPI",
        "description": "Build intelligent search for real estate agent meeting notes",
        "focus": "Natural Language Search Implementation",
        "endpoints": [
            "GET /api/notes - List all notes with pagination",
            "GET /api/notes/{id} - Get specific note",
            "POST /api/notes - Create new meeting note",
            "PUT /api/notes/{id} - Update existing note", 
            "DELETE /api/notes/{id} - Delete note",
            "POST /api/notes/search - Natural language search (PRIMARY FEATURE)",
            "POST /api/notes/bulk-import - Import test data from JSON"
        ],
        "docs": "/docs",
        "testData": "Import comprehensive test data from /test-data/meeting-notes.json"
    }

@app.get("/api/notes")
def get_all_notes(page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)):
    """List all notes with pagination"""
    start = (page - 1) * limit
    end = start + limit
    
    paginated_notes = notes[start:end]
    
    return {
        "notes": paginated_notes,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": len(notes),
            "pages": (len(notes) + limit - 1) // limit
        }
    }

@app.post("/api/notes/search", response_model=SearchResponse)
def search_notes_natural_language(request: SearchRequest):
    """Natural language search - PRIMARY FEATURE"""
    query = request.query
    
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    # TODO: IMPLEMENT NATURAL LANGUAGE SEARCH HERE
    # This is the core feature that will be evaluated!
    # 
    # Approaches you can consider:
    # 1. Embedding-based search using OpenAI/Cohere/sentence-transformers
    # 2. LLM-powered search with structured prompts 
    # 3. Entity extraction + rule-based matching using spaCy/NLTK
    # 4. Hybrid approach combining multiple techniques
    #
    # Example queries to handle:
    # - "3 bed 2 bath under 500k"
    # - "first-time buyers with pre-approval"  
    # - "clients interested in Westside neighborhood"
    # - "families with kids looking for good schools"
    # - "investment property buyers"
    # - "urgent buyers ready to purchase immediately"
    
    # Placeholder implementation - replace with actual search logic
    results = [
        SearchResult(
            note=MeetingNote(**note),
            relevanceScore=0.5,
            matchReasons=["Placeholder match"]
        ) for note in notes
    ]
    
    return SearchResponse(
        query=query,
        results=results,
        totalResults=len(results),
        searchApproach="TODO: Implement your search approach here"
    )

@app.get("/api/notes/{note_id}")
def get_note(note_id: str):
    """Get a specific note by ID"""
    note = next((n for n in notes if n["id"] == note_id), None)
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return note

@app.post("/api/notes")
def create_note(note_request: CreateNoteRequest):
    """Create a new meeting note"""
    try:
        new_note = {
            "id": generate_id(),
            **note_request.dict(),
            "createdAt": get_current_timestamp(),
            "updatedAt": get_current_timestamp()
        }
        
        notes.append(new_note)
        return new_note
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid note data")

@app.put("/api/notes/{note_id}")
def update_note(note_id: str, note_request: CreateNoteRequest):
    """Update an existing note"""
    note_index = next((i for i, n in enumerate(notes) if n["id"] == note_id), None)
    
    if note_index is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    updated_note = {
        **notes[note_index],
        **note_request.dict(),
        "id": note_id,  # Preserve original ID
        "updatedAt": get_current_timestamp()
    }
    
    notes[note_index] = updated_note
    return updated_note

@app.delete("/api/notes/{note_id}")
def delete_note(note_id: str):
    """Delete a note"""
    note_index = next((i for i, n in enumerate(notes) if n["id"] == note_id), None)
    
    if note_index is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    deleted_note = notes.pop(note_index)
    
    return {
        "message": "Note deleted successfully",
        "deletedNote": deleted_note
    }

@app.post("/api/notes/bulk-import")
def bulk_import_notes(imported_notes: List[Dict[str, Any]]):
    """Bulk import notes (for loading test data)"""
    try:
        global notes
        notes = imported_notes
        
        return {
            "message": "Notes imported successfully",
            "count": len(notes)
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to import notes")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Real Estate Notes API Challenge - Python/FastAPI")
    print(f"📊 Loaded {len(notes)} sample meeting notes")
    print("🐍 Python provides excellent AI/ML libraries for NLP")
    print("🎯 PRIMARY GOAL: Implement natural language search at POST /api/notes/search")
    print("📁 Import full test data from /test-data/meeting-notes.json using POST /api/notes/bulk-import")
    print("📚 API Documentation: http://localhost:3000/docs")
    uvicorn.run(app, host="0.0.0.0", port=3000)