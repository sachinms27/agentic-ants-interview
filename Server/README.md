# Notes API Challenge - Node.js

A RESTful API for managing notes with MongoDB integration, built using Node.js, Express, and Mongoose.

## Features

- ✅ CRUD operations for notes
- ✅ Search functionality (by text and tags)
- ✅ MongoDB integration with Mongoose
- ✅ RESTful API design
- ✅ Error handling and validation

## Project Structure

```
Server/
├── config/
│   ├── database.js      # MongoDB connection configuration
│   └── config.js        # Environment configuration
├── controller/
│   └── noteController.js # Business logic for notes
├── model/
│   └── Note.js          # MongoDB schema and model
├── routes/
│   └── noteRoutes.js    # API route definitions
├── app.js               # Main application file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally, or
   - Use MongoDB Atlas (cloud service)

3. **Environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/notes-api
   ```

4. **Start the server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/:id` | Get note by ID |
| POST | `/api/notes` | Create new note |
| DELETE | `/api/notes/:id` | Delete note |
| GET | `/api/notes/search?q=text&tag=tag` | Search notes |

## Example Usage

### Create a note
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Note",
    "content": "This is the content of my note",
    "tags": ["personal", "important"]
  }'
```

### Search notes
```bash
curl "http://localhost:3000/api/notes/search?q=meeting&tag=work"
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: Cross-origin resource sharing
- **uuid**: Unique ID generation
- **dotenv**: Environment variable management

## License

MIT
