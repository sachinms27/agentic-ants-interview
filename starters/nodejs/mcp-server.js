#!/usr/bin/env node

/**
 * Real Estate Meeting Notes MCP Server
 * Provides enhanced search capabilities through Model Context Protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the MeetingNote model (we'll need to adapt it for ES modules)
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

// Load test data
let testNotes = [];
try {
  const testDataPath = path.join(__dirname, '../../test-data/meeting-notes.json');
  const testDataContent = fs.readFileSync(testDataPath, 'utf8');
  testNotes = JSON.parse(testDataContent);
} catch (error) {
  console.error('Error loading test data:', error);
  testNotes = [];
}

let inMemoryNotes = [...testNotes];
let useInMemory = false;

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://admin:password@localhost:27017/testdb");
    console.error('MCP Server: Connected to MongoDB successfully');
    
    const count = await MeetingNote.countDocuments();
    if (count === 0 && testNotes.length > 0) {
      const notesToInsert = testNotes.map(note => ({
        ...note,
        meetingDate: new Date(note.meetingDate),
        followUpDate: new Date(note.followUpDate),
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      await MeetingNote.insertMany(notesToInsert);
      console.error('MCP Server: Initialized database with test meeting notes');
    }
  } catch (error) {
    console.error('MCP Server: Error connecting to MongoDB:', error.message);
    console.error('MCP Server: Running in fallback mode with in-memory storage');
    useInMemory = true;
  }
};

// Enhanced search functions
class EnhancedSearch {
  static async semanticSearch(query, notes = null) {
    const notesToSearch = notes || (useInMemory ? inMemoryNotes : await MeetingNote.find().lean());
    const results = [];
    
    const searchQuery = query.toLowerCase();
    const queryTokens = searchQuery.split(/\s+/).filter(token => token.length > 2);
    
    for (const note of notesToSearch) {
      let score = 0;
      let matches = [];
      let explanations = [];
      
      // Create searchable text
      const searchableFields = {
        clientName: note.clientName || '',
        notes: note.notes || '',
        propertyType: note.requirements?.propertyType || '',
        preferredAreas: (note.requirements?.preferredAreas || []).join(' '),
        mustHaves: (note.requirements?.mustHaves || []).join(' '),
        niceToHaves: (note.requirements?.niceToHaves || []).join(' '),
        dealBreakers: (note.requirements?.dealBreakers || []).join(' '),
        tags: (note.tags || []).join(' '),
        timeline: note.timeline || '',
        meetingType: note.meetingType || ''
      };
      
      // Exact phrase matching (highest priority)
      const fullText = Object.values(searchableFields).join(' ').toLowerCase();
      if (fullText.includes(searchQuery)) {
        score += 100;
        matches.push('exact_phrase_match');
        explanations.push(`Found exact phrase "${query}" in content`);
      }
      
      // Token-based scoring
      for (const token of queryTokens) {
        Object.entries(searchableFields).forEach(([field, content]) => {
          if (content.toLowerCase().includes(token)) {
            const fieldWeight = this.getFieldWeight(field);
            score += fieldWeight;
            matches.push(`${field}_${token}`);
            explanations.push(`"${token}" found in ${field} (weight: ${fieldWeight})`);
          }
        });
      }
      
      // Specialized matching patterns
      const specialMatches = this.performSpecializedMatching(searchQuery, note);
      score += specialMatches.score;
      matches.push(...specialMatches.matches);
      explanations.push(...specialMatches.explanations);
      
      // Intent-based scoring
      const intentScore = this.analyzeIntent(searchQuery, note);
      score += intentScore.score;
      matches.push(...intentScore.matches);
      explanations.push(...intentScore.explanations);
      
      if (score > 0) {
        results.push({
          note,
          score,
          matches,
          explanations,
          relevance: Math.min(score / 200, 1.0) // Normalize to 0-1
        });
      }
    }
    
    return results.sort((a, b) => b.score - a.score);
  }
  
  static getFieldWeight(field) {
    const weights = {
      clientName: 25,
      notes: 20,
      propertyType: 15,
      mustHaves: 30,
      preferredAreas: 25,
      tags: 35,
      timeline: 20,
      meetingType: 15,
      niceToHaves: 10,
      dealBreakers: 40
    };
    return weights[field] || 10;
  }
  
  static performSpecializedMatching(query, note) {
    let score = 0;
    let matches = [];
    let explanations = [];
    
    // Price range matching
    const priceMatches = query.match(/(\d+)k?/g);
    if (priceMatches && note.requirements) {
      for (const priceMatch of priceMatches) {
        const searchPrice = parseInt(priceMatch.replace('k', '000'));
        if (searchPrice >= note.requirements.minPrice && searchPrice <= note.requirements.maxPrice) {
          score += 50;
          matches.push('price_range_match');
          explanations.push(`Price $${searchPrice.toLocaleString()} falls within budget range $${note.requirements.minPrice?.toLocaleString()} - $${note.requirements.maxPrice?.toLocaleString()}`);
        }
      }
    }
    
    // Bedroom/bathroom matching
    const bedroomMatch = query.match(/(\d+)\s*(bed|bedroom)/i);
    if (bedroomMatch && note.requirements?.bedrooms === parseInt(bedroomMatch[1])) {
      score += 60;
      matches.push('bedroom_match');
      explanations.push(`Exact bedroom match: ${bedroomMatch[1]} bedrooms`);
    }
    
    const bathroomMatch = query.match(/(\d+)\s*(bath|bathroom)/i);
    if (bathroomMatch && note.requirements?.bathrooms === parseInt(bathroomMatch[1])) {
      score += 60;
      matches.push('bathroom_match');
      explanations.push(`Exact bathroom match: ${bathroomMatch[1]} bathrooms`);
    }
    
    // Timeline urgency matching
    if (/urgent|asap|immediately|soon/i.test(query)) {
      if (note.timeline === 'ASAP') {
        score += 75;
        matches.push('urgent_timeline');
        explanations.push('Client has urgent timeline matching search intent');
      }
    }
    
    // Pre-approval matching
    if (/pre.?approved|preapproved/i.test(query)) {
      if (note.preApproved) {
        score += 40;
        matches.push('preapproved');
        explanations.push('Client is pre-approved for financing');
      }
    }
    
    return { score, matches, explanations };
  }
  
  static analyzeIntent(query, note) {
    let score = 0;
    let matches = [];
    let explanations = [];
    
    // Family-oriented search
    if (/family|children|kids|school/i.test(query)) {
      if (note.requirements?.mustHaves?.some(item => /school|family|yard|safe/i.test(item))) {
        score += 30;
        matches.push('family_oriented');
        explanations.push('Family-oriented requirements match search intent');
      }
    }
    
    // First-time buyer detection
    if (/first.?time|starter|beginning/i.test(query)) {
      if (note.tags?.some(tag => /first.?time|starter/i.test(tag))) {
        score += 40;
        matches.push('first_time_buyer');
        explanations.push('First-time buyer profile matches search intent');
      }
    }
    
    // Investment property detection
    if (/investment|rental|flip|multi.?family/i.test(query)) {
      if (note.requirements?.propertyType?.includes('Multi-family') || 
          note.tags?.some(tag => /investment|rental/i.test(tag))) {
        score += 45;
        matches.push('investment_intent');
        explanations.push('Investment property intent detected');
      }
    }
    
    // Luxury search detection
    if (/luxury|high.?end|premium|executive/i.test(query)) {
      if (note.requirements?.maxPrice > 800000 || 
          note.requirements?.niceToHaves?.some(item => /pool|luxury|high.?end/i.test(item))) {
        score += 35;
        matches.push('luxury_intent');
        explanations.push('Luxury property requirements detected');
      }
    }
    
    return { score, matches, explanations };
  }
  
  static async findSimilarClients(clientNote) {
    const allNotes = useInMemory ? inMemoryNotes : await MeetingNote.find().lean();
    const similarities = [];
    
    for (const note of allNotes) {
      if (note.id === clientNote.id) continue;
      
      let similarityScore = 0;
      let similarities_found = [];
      
      // Property type similarity
      if (note.requirements?.propertyType === clientNote.requirements?.propertyType) {
        similarityScore += 20;
        similarities_found.push('same_property_type');
      }
      
      // Price range overlap
      if (note.requirements && clientNote.requirements) {
        const overlap = Math.min(note.requirements.maxPrice, clientNote.requirements.maxPrice) - 
                       Math.max(note.requirements.minPrice, clientNote.requirements.minPrice);
        if (overlap > 0) {
          similarityScore += 30;
          similarities_found.push('price_range_overlap');
        }
      }
      
      // Bedroom/bathroom similarity
      if (note.requirements?.bedrooms === clientNote.requirements?.bedrooms) {
        similarityScore += 15;
        similarities_found.push('same_bedrooms');
      }
      
      if (note.requirements?.bathrooms === clientNote.requirements?.bathrooms) {
        similarityScore += 15;
        similarities_found.push('same_bathrooms');
      }
      
      // Area preferences overlap
      const areaOverlap = (note.requirements?.preferredAreas || [])
        .filter(area => (clientNote.requirements?.preferredAreas || []).includes(area));
      if (areaOverlap.length > 0) {
        similarityScore += areaOverlap.length * 25;
        similarities_found.push(`shared_areas: ${areaOverlap.join(', ')}`);
      }
      
      // Must-haves overlap
      const mustHaveOverlap = (note.requirements?.mustHaves || [])
        .filter(item => (clientNote.requirements?.mustHaves || []).includes(item));
      if (mustHaveOverlap.length > 0) {
        similarityScore += mustHaveOverlap.length * 20;
        similarities_found.push(`shared_must_haves: ${mustHaveOverlap.join(', ')}`);
      }
      
      // Timeline similarity
      if (note.timeline === clientNote.timeline) {
        similarityScore += 10;
        similarities_found.push('same_timeline');
      }
      
      if (similarityScore > 30) { // Threshold for considering similarity
        similarities.push({
          note,
          similarityScore,
          similarities: similarities_found,
          relevance: Math.min(similarityScore / 100, 1.0)
        });
      }
    }
    
    return similarities.sort((a, b) => b.similarityScore - a.similarityScore);
  }
}

// Create the MCP server
const server = new Server(
  {
    name: 'real-estate-search',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define the search tools
const searchTools = [
  {
    name: 'semantic_search',
    description: 'Perform enhanced semantic search on real estate meeting notes with intelligent scoring and explanation',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Natural language search query (e.g., "3 bedroom family home under 500k", "first-time buyers with urgent timeline")',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
          default: 10,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'find_similar_clients',
    description: 'Find clients with similar requirements to a given client',
    inputSchema: {
      type: 'object',
      properties: {
        clientId: {
          type: 'string',
          description: 'ID of the client to find similar matches for',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of similar clients to return (default: 5)',
          default: 5,
        },
      },
      required: ['clientId'],
    },
  },
  {
    name: 'advanced_filter',
    description: 'Apply advanced filtering with multiple criteria',
    inputSchema: {
      type: 'object',
      properties: {
        filters: {
          type: 'object',
          properties: {
            priceRange: {
              type: 'object',
              properties: {
                min: { type: 'number' },
                max: { type: 'number' },
              },
            },
            bedrooms: { type: 'number' },
            bathrooms: { type: 'number' },
            propertyType: { type: 'string' },
            areas: { type: 'array', items: { type: 'string' } },
            timeline: { type: 'string' },
            preApproved: { type: 'boolean' },
            tags: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      required: ['filters'],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: searchTools,
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'semantic_search': {
        const { query, limit = 10 } = args;
        
        if (!query) {
          throw new McpError(ErrorCode.InvalidParams, 'Query is required');
        }
        
        const results = await EnhancedSearch.semanticSearch(query);
        const limitedResults = results.slice(0, limit);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                query,
                totalResults: results.length,
                results: limitedResults.map(result => ({
                  note: {
                    id: result.note.id,
                    clientName: result.note.clientName,
                    meetingType: result.note.meetingType,
                    timeline: result.note.timeline,
                    requirements: result.note.requirements,
                    tags: result.note.tags,
                    preApproved: result.note.preApproved,
                  },
                  score: result.score,
                  relevance: result.relevance,
                  matches: result.matches,
                  explanations: result.explanations,
                })),
              }, null, 2),
            },
          ],
        };
      }

      case 'find_similar_clients': {
        const { clientId, limit = 5 } = args;
        
        if (!clientId) {
          throw new McpError(ErrorCode.InvalidParams, 'Client ID is required');
        }
        
        // Find the client note
        const clientNote = useInMemory 
          ? inMemoryNotes.find(note => note.id === clientId)
          : await MeetingNote.findOne({ id: clientId }).lean();
          
        if (!clientNote) {
          throw new McpError(ErrorCode.InvalidParams, 'Client not found');
        }
        
        const similarities = await EnhancedSearch.findSimilarClients(clientNote);
        const limitedSimilarities = similarities.slice(0, limit);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                clientId,
                clientName: clientNote.clientName,
                totalSimilar: similarities.length,
                similarClients: limitedSimilarities.map(sim => ({
                  note: {
                    id: sim.note.id,
                    clientName: sim.note.clientName,
                    requirements: sim.note.requirements,
                    timeline: sim.note.timeline,
                    tags: sim.note.tags,
                  },
                  similarityScore: sim.similarityScore,
                  relevance: sim.relevance,
                  similarities: sim.similarities,
                })),
              }, null, 2),
            },
          ],
        };
      }

      case 'advanced_filter': {
        const { filters } = args;
        
        const notes = useInMemory ? inMemoryNotes : await MeetingNote.find().lean();
        const filteredNotes = notes.filter(note => {
          // Price range filter
          if (filters.priceRange) {
            const { min, max } = filters.priceRange;
            if (min && note.requirements.maxPrice < min) return false;
            if (max && note.requirements.minPrice > max) return false;
          }
          
          // Property specifications
          if (filters.bedrooms && note.requirements.bedrooms !== filters.bedrooms) return false;
          if (filters.bathrooms && note.requirements.bathrooms !== filters.bathrooms) return false;
          if (filters.propertyType && note.requirements.propertyType !== filters.propertyType) return false;
          
          // Areas
          if (filters.areas && filters.areas.length > 0) {
            const hasMatchingArea = filters.areas.some(area => 
              note.requirements.preferredAreas.some(prefArea => 
                prefArea.toLowerCase().includes(area.toLowerCase())
              )
            );
            if (!hasMatchingArea) return false;
          }
          
          // Timeline and status
          if (filters.timeline && note.timeline !== filters.timeline) return false;
          if (filters.preApproved !== undefined && note.preApproved !== filters.preApproved) return false;
          
          // Tags
          if (filters.tags && filters.tags.length > 0) {
            const hasMatchingTag = filters.tags.some(tag => 
              note.tags.some(noteTag => 
                noteTag.toLowerCase().includes(tag.toLowerCase())
              )
            );
            if (!hasMatchingTag) return false;
          }
          
          return true;
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                filters,
                totalMatches: filteredNotes.length,
                results: filteredNotes.map(note => ({
                  id: note.id,
                  clientName: note.clientName,
                  meetingType: note.meetingType,
                  requirements: note.requirements,
                  timeline: note.timeline,
                  tags: note.tags,
                  preApproved: note.preApproved,
                })),
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
  }
});

// Start the server
async function main() {
  await connectDB();
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Real Estate MCP Server started');
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
