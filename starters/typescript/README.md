# TypeScript Starter - Notes API Challenge

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

   Or build and run:
   ```bash
   npm run build
   npm start
   ```

## 📁 Structure

- `src/server.ts` - Main server file with TypeScript types
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies

## 💡 Helpful Tips

### TypeScript Benefits
- **Type Safety** - Catch errors at compile time
- **Better IDE Support** - Auto-completion and IntelliSense
- **Clear Interfaces** - Defined data structures

### Type Definitions
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}
```

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
```

## 🎯 TypeScript Tips

- Use type annotations for function parameters
- Leverage interfaces for data structures
- Handle undefined/null cases explicitly
- Use the `as` keyword for type assertions when needed

## ✅ Checklist

- [ ] GET /api/notes - List all notes
- [ ] GET /api/notes/:id - Get specific note
- [ ] POST /api/notes - Create new note
- [ ] DELETE /api/notes/:id - Delete a note
- [ ] GET /api/notes/search - Search functionality

Good luck! 🎉