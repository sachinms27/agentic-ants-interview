const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  clientName: { 
    type: String, 
    required: true 
  },
  meetingDate: { 
    type: String, 
    required: true 
  },
  contactInfo: {
    phone: { type: String },
    email: { type: String }
  },
  meetingType: { 
    type: String, 
    enum: ['Initial Consultation', 'Follow-up', 'Property Tour', 'Offer Discussion'],
    default: 'Initial Consultation'
  },
  notes: { 
    type: String, 
    required: true 
  },
  requirements: {
    propertyType: { 
      type: String, 
      enum: ['Single Family', 'Condo', 'Townhouse', 'Multi-family'],
      default: 'Single Family'
    },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    minPrice: { type: Number, min: 0 },
    maxPrice: { type: Number, min: 0 },
    preferredAreas: [{ type: String }],
    mustHaves: [{ type: String }],
    niceToHaves: [{ type: String }],
    dealBreakers: [{ type: String }]
  },
  timeline: { 
    type: String, 
    enum: ['ASAP', '1-3 months', '3-6 months', '6+ months'],
    default: '3-6 months'
  },
  preApproved: { 
    type: Boolean, 
    default: false 
  },
  followUpDate: { 
    type: String 
  },
  tags: [{ 
    type: String 
  }],
  createdAt: { 
    type: String, 
    required: true 
  },
  updatedAt: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
