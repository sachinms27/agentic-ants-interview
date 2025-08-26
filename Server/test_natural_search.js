// Test file for Natural Language Search API
// This demonstrates various natural language queries that the API can handle

const testQueries = [
  // Property requirements
  "clients looking for 3 bed 2 bath homes in Westside under 600k",
  "buyers wanting 4+ bedrooms with pool",
  "homes with 2 bathrooms and garage",
  
  // Location preferences
  "clients interested in downtown properties",
  "buyers looking near good schools",
  "properties in Westside area",
  
  // Budget constraints
  "clients with budget under 500k",
  "buyers looking for homes over 800k",
  "500k budget homes",
  
  // Client preferences
  "first-time buyers with pre-approval",
  "investors looking for properties",
  "families with children",
  
  // Timeline
  "urgent buyers ready this month",
  "clients ready to make offer",
  "ASAP buyers",
  
  // Special requirements
  "pet-friendly homes",
  "properties with pool",
  "homes with parking",
  "good school districts",
  
  // Complex combinations
  "first-time buyers looking for 3 bed 2 bath homes under 400k near schools",
  "investors wanting multi-family properties in Westside",
  "families looking for pet-friendly homes with garage under 600k"
];

console.log("Natural Language Search Test Queries:");
console.log("=====================================");
console.log("API Endpoint: POST /api/notes/search/natural");
console.log("Content-Type: application/json");
console.log("\nExample Request Body:");
console.log('{\n  "query": "clients looking for 3 bed 2 bath homes in Westside under 600k"\n}');
console.log("\nTest Queries:");
testQueries.forEach((query, index) => {
  console.log(`${index + 1}. "${query}"`);
});

console.log("\nThe API will:");
console.log("- Extract property requirements (bedrooms, bathrooms, price)");
console.log("- Identify location preferences");
console.log("- Recognize client types (first-time, investor, family)");
console.log("- Detect urgency and timeline");
console.log("- Find special requirements (pet-friendly, pool, garage, schools)");
console.log("- Build MongoDB queries based on extracted criteria");
console.log("- Return matching notes with extracted criteria and query details");
