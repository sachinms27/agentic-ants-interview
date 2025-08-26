import mongoose from 'mongoose';

const meetingNoteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  meetingDate: { type: Date, required: true },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  meetingType: { type: String, required: true },
  notes: { type: String, required: true },
  requirements: {
    propertyType: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    preferredAreas: { type: [String], required: true },
    mustHaves: { type: [String], required: true },
    niceToHaves: { type: [String], required: true },
    dealBreakers: { type: [String], required: true }
  },
  timeline: { type: String, required: true },
  preApproved: { type: Boolean, required: true },
  followUpDate: { type: Date, required: true },
  tags: { type: [String], required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});

const MeetingNote = mongoose.model('MeetingNote', meetingNoteSchema);

export default MeetingNote;