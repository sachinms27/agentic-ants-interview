const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const moment = require("moment");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Google Generative AI (Gemini)
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "your-gemini-api-key-here"
);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.log(
      "MongoDB connection failed, using in-memory storage:",
      err.message
    );
  });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schemas
const ticketSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  customerId: { type: String, required: true },
  customerTier: { type: String, required: true },
  customerLTV: { type: Number, default: 0 },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  channel: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  attachments: [String],
  previousTickets: { type: Number, default: 0 },
  metadata: {
    browser: String,
    os: String,
    location: String,
  },
  analysis: {
    urgency: { type: String, enum: ["critical", "high", "medium", "low"] },
    category: {
      type: String,
      enum: [
        "billing",
        "technical",
        "account",
        "feature",
        "general",
        "security",
        "compliance",
        "legal",
      ],
    },
    sentiment: {
      type: String,
      enum: ["angry", "frustrated", "neutral", "satisfied"],
    },
    intent: {
      type: String,
      enum: [
        "troubleshooting",
        "refund",
        "information",
        "complaint",
        "upgrade",
        "downgrade",
        "cancellation",
        "feature_request",
        "password_reset",
        "data_deletion",
        "security_issue",
        "bug_report",
        "account_update",
        "correction",
      ],
    },
    confidence: { type: Number, min: 0, max: 1 },
    entities: {
      errorCodes: [String],
      productNames: [String],
      transactionIds: [String],
      amounts: [Number],
      dates: [String],
      competitors: [String],
    },
  },
  routing: {
    team: String,
    priority: { type: Number, min: 0, max: 100 },
    sla: String,
    escalationPath: [String],
    autoResolve: { type: Boolean, default: false },
  },
  response: {
    acknowledgment: String,
    suggestedActions: [String],
    estimatedResolutionTime: String,
    generatedAt: { type: Date, default: Date.now },
  },
  status: {
    type: String,
    enum: ["received", "analyzed", "routed", "in_progress", "resolved"],
    default: "received",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

// Load configuration data
let customerTiers = {};
let routingRules = [];
let teams = {};

// Load external configuration files
const fs = require("fs");
const path = require("path");

// Helper functions
let ticketCounter = 0;
const generateTicketId = () => {
  ticketCounter++;
  return `TICK-${ticketCounter.toString().padStart(3, "0")}`;
};
const getCurrentTimestamp = () => new Date().toISOString();

// Load configuration data
const loadConfigurationData = () => {
  try {
    // Try multiple possible paths for the configuration files
    const possiblePaths = [
      path.join(
        __dirname,
        "../../challenges/support-triage-agent/test-data/customer-tiers.json"
      ),
      path.join(
        __dirname,
        "../challenges/support-triage-agent/test-data/customer-tiers.json"
      ),
      path.join(
        process.cwd(),
        "challenges/support-triage-agent/test-data/customer-tiers.json"
      ),
      path.join(
        process.cwd(),
        "../challenges/support-triage-agent/test-data/customer-tiers.json"
      ),
    ];

    let customerTiersPath = null;
    let routingRulesPath = null;

    // Find customer tiers file
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        customerTiersPath = testPath;
        routingRulesPath = testPath.replace(
          "customer-tiers.json",
          "routing-rules.json"
        );
        break;
      }
    }

    if (customerTiersPath && fs.existsSync(customerTiersPath)) {
      const customerTiersData = JSON.parse(
        fs.readFileSync(customerTiersPath, "utf8")
      );
      customerTiers = customerTiersData.tiers;
      console.log(
        `✅ Loaded ${Object.keys(customerTiers).length} customer tiers`
      );
    } else {
      throw new Error("Customer tiers file not found");
    }

    if (routingRulesPath && fs.existsSync(routingRulesPath)) {
      const routingRulesData = JSON.parse(
        fs.readFileSync(routingRulesPath, "utf8")
      );
      routingRules = routingRulesData.rules;
      teams = routingRulesData.teams;
      console.log(`✅ Loaded ${routingRules.length} routing rules`);
      console.log(`✅ Loaded ${Object.keys(teams).length} teams`);
    } else {
      throw new Error("Routing rules file not found");
    }
  } catch (error) {
    console.error("Error loading configuration data:", error.message);
    // Fallback to hardcoded data
    loadFallbackConfiguration();
  }
};

const loadFallbackConfiguration = () => {
  // Customer tiers configuration
  customerTiers = {
    enterprise: {
      name: "Enterprise",
      priorityMultiplier: 1.5,
      slaResponseTime: "30 minutes",
      slaResolutionTime: "4 hours",
      features: [
        "24/7 phone support",
        "Dedicated account manager",
        "Custom SLA",
        "Priority routing",
        "Executive escalation path",
      ],
      minimumLTV: 100000,
      autoEscalate: true,
      dedicatedTeam: true,
    },
    premium: {
      name: "Premium",
      priorityMultiplier: 1.3,
      slaResponseTime: "2 hours",
      slaResolutionTime: "24 hours",
      features: [
        "Priority email support",
        "Phone support (business hours)",
        "Account manager",
        "Faster response times",
      ],
      minimumLTV: 20000,
      autoEscalate: false,
      dedicatedTeam: false,
    },
    standard: {
      name: "Standard",
      priorityMultiplier: 1.0,
      slaResponseTime: "8 hours",
      slaResolutionTime: "48 hours",
      features: [
        "Email support",
        "Chat support (business hours)",
        "Knowledge base access",
      ],
      minimumLTV: 1000,
      autoEscalate: false,
      dedicatedTeam: false,
    },
    free: {
      name: "Free",
      priorityMultiplier: 0.8,
      slaResponseTime: "48 hours",
      slaResolutionTime: "5 days",
      features: [
        "Community support",
        "Knowledge base access",
        "Auto-resolution for common issues",
      ],
      minimumLTV: 0,
      autoEscalate: false,
      dedicatedTeam: false,
    },
  };

  // Teams configuration
  teams = {
    security_team: {
      name: "Security Team",
      email: "security@company.com",
      slack: "#security-incidents",
      oncall: true,
    },
    backend_team: {
      name: "Backend Engineering",
      email: "backend@company.com",
      slack: "#backend-support",
      oncall: true,
    },
    frontend_team: {
      name: "Frontend Engineering",
      email: "frontend@company.com",
      slack: "#frontend-support",
      oncall: false,
    },
    mobile_team: {
      name: "Mobile Development",
      email: "mobile@company.com",
      slack: "#mobile-support",
      oncall: false,
    },
    infrastructure_team: {
      name: "Infrastructure/DevOps",
      email: "infrastructure@company.com",
      slack: "#infrastructure",
      oncall: true,
    },
    finance_team: {
      name: "Finance",
      email: "finance@company.com",
      slack: "#finance-support",
      oncall: false,
    },
    finance_senior: {
      name: "Senior Finance",
      email: "finance-senior@company.com",
      slack: "#finance-escalations",
      oncall: false,
    },
    legal_team: {
      name: "Legal/Compliance",
      email: "legal@company.com",
      slack: "#legal-compliance",
      oncall: false,
    },
    product_team: {
      name: "Product Management",
      email: "product@company.com",
      slack: "#product-feedback",
      oncall: false,
    },
    sales_team: {
      name: "Sales",
      email: "sales@company.com",
      slack: "#sales-support",
      oncall: false,
    },
    retention_team: {
      name: "Customer Retention",
      email: "retention@company.com",
      slack: "#save-team",
      oncall: false,
    },
    senior_support: {
      name: "Senior Support",
      email: "senior-support@company.com",
      slack: "#senior-support",
      oncall: true,
    },
    technical_support: {
      name: "Technical Support",
      email: "tech-support@company.com",
      slack: "#tech-support",
      oncall: false,
    },
    general_support: {
      name: "General Support",
      email: "support@company.com",
      slack: "#general-support",
      oncall: false,
    },
    customer_success: {
      name: "Customer Success",
      email: "success@company.com",
      slack: "#customer-success",
      oncall: false,
    },
    executive_team: {
      name: "Executive Team",
      email: "executives@company.com",
      slack: "#executive-escalations",
      oncall: true,
    },
  };

  // Fallback routing rules
  routingRules = [
    {
      id: "RULE-DEFAULT",
      name: "Default Routing",
      priority: 999,
      conditions: {
        all: [{ field: "*", operator: "any", value: "*" }],
      },
      actions: {
        routeTo: "general_support",
        setPriority: "medium",
        standardSLA: true,
      },
    },
  ];
};

// AI Analysis Functions
const analyzeTicketWithAI = async (ticket) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Analyze this support ticket and provide a structured JSON response with the following fields:

Ticket Details:
- Subject: ${ticket.subject}
- Message: ${ticket.message}
- Customer Tier: ${ticket.customerTier}
- Customer LTV: $${ticket.customerLTV}
- Channel: ${ticket.channel}
- Previous Tickets: ${ticket.previousTickets}

Please analyze and return JSON with:
1. urgency: "critical", "high", "medium", or "low" based on business impact
2. category: "billing", "technical", "account", "feature", "general", "security", "compliance", or "legal"
3. sentiment: "angry", "frustrated", "neutral", or "satisfied"
4. intent: primary customer intent (troubleshooting, refund, information, complaint, upgrade, downgrade, cancellation, feature_request, password_reset, data_deletion, security_issue, bug_report, account_update, correction)
5. confidence: confidence score 0-1
6. entities: extract key information including:
   - errorCodes: array of error codes (e.g., ["DB_CONN_TIMEOUT", "PAY_GATEWAY_500"])
   - productNames: array of product/service names mentioned
   - transactionIds: array of transaction IDs (e.g., ["TXN-456789", "INV-2024-1234"])
   - amounts: array of dollar amounts mentioned (e.g., [599, 1000])
   - dates: array of dates mentioned
   - competitors: array of competitor names mentioned
7. reasoning: brief explanation for urgency and category decisions

Focus on:
- Business impact (revenue loss, security issues, compliance)
- Customer value (tier and LTV)
- Sentiment and urgency indicators
- Technical vs non-technical issues
- Error codes and specific technical details
- Extract ALL amounts, transaction IDs, and error codes mentioned

Return only valid JSON, no additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const analysis = JSON.parse(text);
    return analysis;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    // Fallback to rule-based analysis
    return fallbackAnalysis(ticket);
  }
};

const fallbackAnalysis = (ticket) => {
  const message = ticket.message.toLowerCase();
  const subject = ticket.subject.toLowerCase();

  let urgency = "medium";
  let category = "general";
  let sentiment = "neutral";
  let intent = "information";
  let entities = {
    errorCodes: [],
    productNames: [],
    transactionIds: [],
    amounts: [],
    dates: [],
    competitors: [],
  };

  // Extract error codes
  const errorCodeRegex = /[A-Z_]+(?:\d+)?/g;
  const errorCodes = message.match(errorCodeRegex) || [];
  entities.errorCodes = errorCodes.filter(
    (code) => code.length > 3 && (code.includes("_") || /\d/.test(code))
  );

  // Extract amounts
  const amountRegex = /\$[\d,]+(?:\.\d{2})?/g;
  const amounts = message.match(amountRegex) || [];
  entities.amounts = amounts.map((amt) => parseFloat(amt.replace(/[$,]/g, "")));

  // Extract transaction IDs
  const txIdRegex = /(?:TXN|INV|ORDER|WH|PURGE|EXPORT|API_KEY)-\d+/gi;
  const transactionIds = message.match(txIdRegex) || [];
  entities.transactionIds = transactionIds;

  // Extract product names
  const productRegex = /(?:API|SDK|webhook|dashboard|mobile app|admin panel)/gi;
  const productNames = message.match(productRegex) || [];
  entities.productNames = productNames;

  // Extract dates
  const dateRegex =
    /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/gi;
  const dates = message.match(dateRegex) || [];
  entities.dates = dates;

  // Extract competitors
  const competitorRegex =
    /(?:competitor|alternative|switching to|migrate to)/gi;
  const competitors = message.match(competitorRegex) || [];
  entities.competitors = competitors;

  // Urgency detection
  if (
    message.includes("urgent") ||
    message.includes("critical") ||
    message.includes("emergency") ||
    (message.includes("losing") && message.includes("thousands")) ||
    message.includes("completely broken")
  ) {
    urgency = "critical";
  } else if (
    message.includes("asap") ||
    message.includes("immediately") ||
    message.includes("broken") ||
    message.includes("not working")
  ) {
    urgency = "high";
  } else if (
    message.includes("when you have time") ||
    message.includes("no rush") ||
    message.includes("just wondering")
  ) {
    urgency = "low";
  }

  // Category detection
  if (
    message.includes("payment") ||
    message.includes("billing") ||
    message.includes("invoice") ||
    message.includes("refund") ||
    message.includes("charged")
  ) {
    category = "billing";
  } else if (
    message.includes("error") ||
    message.includes("bug") ||
    message.includes("not working") ||
    message.includes("api") ||
    message.includes("database") ||
    message.includes("timeout")
  ) {
    category = "technical";
  } else if (
    message.includes("password") ||
    message.includes("login") ||
    message.includes("account")
  ) {
    category = "account";
  } else if (
    message.includes("feature") ||
    message.includes("request") ||
    message.includes("suggestion")
  ) {
    category = "feature";
  } else if (
    message.includes("security") ||
    message.includes("breach") ||
    message.includes("vulnerability") ||
    message.includes("exploit")
  ) {
    category = "security";
  } else if (
    message.includes("compliance") ||
    message.includes("gdpr") ||
    message.includes("hipaa") ||
    message.includes("audit")
  ) {
    category = "compliance";
  }

  // Sentiment detection
  if (
    message.includes("angry") ||
    message.includes("terrible") ||
    message.includes("awful") ||
    message.includes("unacceptable") ||
    message.includes("worst") ||
    message.includes("switching to competitor")
  ) {
    sentiment = "angry";
  } else if (
    message.includes("frustrated") ||
    message.includes("annoying") ||
    message.includes("disappointed") ||
    message.includes("upset")
  ) {
    sentiment = "frustrated";
  } else if (
    message.includes("thank") ||
    message.includes("great") ||
    message.includes("awesome") ||
    message.includes("love") ||
    message.includes("amazing")
  ) {
    sentiment = "satisfied";
  }

  // Intent detection - check password reset first
  if (
    message.includes("password reset") ||
    message.includes("forgot password") ||
    message.includes("reset my password") ||
    message.includes("password") ||
    subject.includes("password") ||
    subject.includes("reset")
  ) {
    intent = "password_reset";
  } else if (message.includes("refund") || message.includes("money back")) {
    intent = "refund";
  } else if (message.includes("cancel") || message.includes("terminate")) {
    intent = "cancellation";
  } else if (message.includes("upgrade") || message.includes("downgrade")) {
    intent = "upgrade";
  } else if (message.includes("delete") && message.includes("data")) {
    intent = "data_deletion";
  } else if (
    message.includes("error") ||
    message.includes("not working") ||
    message.includes("broken")
  ) {
    intent = "troubleshooting";
  } else if (
    message.includes("feature") ||
    message.includes("request") ||
    message.includes("suggestion")
  ) {
    intent = "feature_request";
  } else if (
    message.includes("security") ||
    message.includes("breach") ||
    message.includes("vulnerability")
  ) {
    intent = "security_issue";
  } else if (message.includes("bug") || message.includes("issue")) {
    intent = "bug_report";
  } else {
    intent = "information";
  }

  return {
    urgency,
    category,
    sentiment,
    intent,
    confidence: 0.7,
    entities,
    reasoning: "Rule-based fallback analysis",
  };
};

// Rule evaluation helper functions
const evaluateCondition = (condition, ticket, analysis) => {
  const { field, operator, value } = condition;

  let fieldValue;
  if (field === "*") {
    return true; // Wildcard condition
  }

  // Get field value from ticket or analysis
  if (field.includes(".")) {
    const [parent, child] = field.split(".");
    if (parent === "analysis") {
      fieldValue = analysis[child];
    } else if (parent === "customerTier") {
      fieldValue = ticket.customerTier;
    } else if (parent === "customerLTV") {
      fieldValue = ticket.customerLTV;
    } else if (parent === "entities") {
      fieldValue = analysis.entities?.[child];
    } else {
      fieldValue = ticket[parent]?.[child];
    }
  } else {
    // Handle direct field references
    if (field === "category") {
      fieldValue = analysis.category;
    } else if (field === "urgency") {
      fieldValue = analysis.urgency;
    } else if (field === "sentiment") {
      fieldValue = analysis.sentiment;
    } else if (field === "intent") {
      fieldValue = analysis.intent;
    } else if (field === "customerTier") {
      fieldValue = ticket.customerTier;
    } else if (field === "customerLTV") {
      fieldValue = ticket.customerLTV;
    } else if (field === "amount") {
      // Extract amount from entities
      fieldValue = analysis.entities?.amounts?.[0] || 0;
    } else if (field === "errorCode") {
      // Extract error codes from entities
      fieldValue = analysis.entities?.errorCodes?.[0];
    } else if (field === "affectedUsers") {
      // Extract from message or metadata
      const message = ticket.message.toLowerCase();
      const userMatch = message.match(/(\d+)\s*(?:users?|customers?|people)/);
      fieldValue = userMatch ? parseInt(userMatch[1]) : 0;
    } else {
      fieldValue = ticket[field] || analysis[field];
    }
  }

  // Evaluate operator
  switch (operator) {
    case "equals":
      return fieldValue === value;
    case "contains":
      if (Array.isArray(value)) {
        return value.some(
          (v) =>
            fieldValue &&
            fieldValue.toString().toLowerCase().includes(v.toLowerCase())
        );
      }
      return (
        fieldValue &&
        fieldValue.toString().toLowerCase().includes(value.toLowerCase())
      );
    case "in":
      return Array.isArray(value) && value.includes(fieldValue);
    case "greaterThan":
      return Number(fieldValue) > Number(value);
    case "startsWith":
      return fieldValue && fieldValue.toString().startsWith(value);
    case "any":
      return true;
    default:
      return false;
  }
};

const evaluateRule = (rule, ticket, analysis) => {
  const { conditions } = rule;

  if (conditions.all) {
    return conditions.all.every((condition) =>
      evaluateCondition(condition, ticket, analysis)
    );
  }

  if (conditions.any) {
    return conditions.any.some((condition) =>
      evaluateCondition(condition, ticket, analysis)
    );
  }

  return false;
};

// Routing Engine
const routeTicket = (ticket, analysis) => {
  let team = "general_support";
  let priority = 50;
  let sla = "24 hours";
  let escalationPath = ["general_support", "senior_support"];
  let autoResolve = false;
  let appliedRules = [];

  // Sort rules by priority (lower number = higher priority)
  const sortedRules = [...routingRules].sort((a, b) => a.priority - b.priority);

  // Find the first matching rule
  for (const rule of sortedRules) {
    if (evaluateRule(rule, ticket, analysis)) {
      appliedRules.push(rule.id);

      // Apply rule actions
      const { actions } = rule;

      if (actions.routeTo) {
        team = actions.routeTo;
      }

      if (actions.setPriority) {
        if (actions.setPriority === "critical") {
          priority = 100;
        } else if (actions.setPriority === "high") {
          priority = 75;
        } else if (actions.setPriority === "medium") {
          priority = 50;
        } else if (actions.setPriority === "low") {
          priority = 25;
        }
      }

      if (actions.priorityBoost) {
        priority += actions.priorityBoost;
      }

      if (actions.sla) {
        sla = actions.sla;
      }

      if (actions.autoResolve) {
        autoResolve = true;
        sla = "auto";
      }

      // Set escalation path based on team
      if (teams[team]) {
        escalationPath = teams[team].escalation || [team, "senior_support"];
      }

      break; // Use first matching rule
    }
  }

  // Calculate base priority if not set by rule
  if (priority === 50) {
    const basePriority =
      {
        critical: 100,
        high: 75,
        medium: 50,
        low: 25,
      }[analysis.urgency] || 50;

    priority = basePriority;
  }

  // Apply customer tier multiplier
  const tierConfig = customerTiers[ticket.customerTier];
  if (tierConfig) {
    priority = Math.round(priority * tierConfig.priorityMultiplier);

    // Set SLA based on tier if not set by rule
    if (sla === "24 hours" && tierConfig.slaResponseTime) {
      sla = tierConfig.slaResponseTime;
    }
  }

  // Sentiment boost
  if (analysis.sentiment === "angry") {
    priority += 15;
  } else if (analysis.sentiment === "frustrated") {
    priority += 10;
  }

  // Customer value boost
  if (ticket.customerLTV > 50000) {
    priority += 20;
  } else if (ticket.customerLTV > 10000) {
    priority += 10;
  }

  // Cap priority at 100
  priority = Math.min(priority, 100);

  return {
    team,
    priority,
    sla,
    escalationPath,
    autoResolve,
    appliedRules,
  };
};

// Response Generation
const generateResponse = async (ticket, analysis, routing) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a friendly, empathetic customer support agent writing a personalized acknowledgment email. Write as if you're a real human who genuinely cares about helping this customer.

Customer Details:
- Name: ${ticket.email.split("@")[0]}
- Email: ${ticket.email}
- Subject: ${ticket.subject}
- Message: ${ticket.message}
- Customer Tier: ${ticket.customerTier}
- Customer LTV: $${ticket.customerLTV}

Analysis Results:
- Urgency: ${analysis.urgency}
- Category: ${analysis.category}
- Sentiment: ${analysis.sentiment}
- Intent: ${analysis.intent}
- Confidence: ${analysis.confidence}

Routing Decision:
- Assigned Team: ${teams[routing.team]?.name || routing.team}
- Priority: ${routing.priority}
- SLA: ${routing.sla}

Write a warm, human acknowledgment that:
1. Uses the customer's first name naturally
2. Shows genuine understanding of their specific issue
3. Matches their emotional tone (if they're frustrated, be apologetic; if satisfied, be enthusiastic)
4. Uses conversational language, not corporate speak
5. Includes specific details from their message to show you read it
6. Sets realistic expectations about response time
7. Ends with a personal touch

Examples of good tone:
- "Hi Sarah! I can totally understand why you'd be frustrated with this..."
- "Hey Mike, thanks for reaching out about the billing issue..."
- "Hi there! I'm so sorry you're running into this problem..."

Avoid:
- "Thank you for contacting us" (too formal)
- "We have received your ticket" (robotic)
- "We appreciate your patience" (generic)
- Corporate jargon

Write 2-3 short paragraphs maximum. Be warm, personal, and human.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Response Generation Error:", error);
    return generateFallbackResponse(ticket, analysis, routing);
  }
};

const generateFallbackResponse = (ticket, analysis, routing) => {
  const teamName = teams[routing.team]?.name || "Support Team";
  const sla = routing.sla;
  const customerName = ticket.email.split("@")[0];

  let response = `Hi ${customerName}!\n\n`;

  if (analysis.sentiment === "angry") {
    response += `I'm really sorry you're dealing with this issue. I can see why you'd be frustrated, and I want to make sure we get this sorted out for you right away.\n\n`;
  } else if (analysis.sentiment === "frustrated") {
    response += `I totally get why this would be annoying! Let me help you get this resolved quickly.\n\n`;
  } else {
    response += `Thanks for reaching out! I'm here to help you with this.\n\n`;
  }

  response += `I've got your message about "${ticket.subject}" and I'm making sure our ${teamName} takes a look at this. You should hear back from us within ${sla}.\n\n`;

  if (routing.autoResolve) {
    response += `Actually, I think I can help you with this right now! `;
  }

  response += `Feel free to reach out if you have any other questions in the meantime.\n\nTake care,\n${
    customerName === "Sarah" ? "Sarah" : "The Support Team"
  }`;

  return response;
};

// API Endpoints

app.get("/api", (req, res) => {
  res.json({
    message: "AI Customer Support Triage Agent",
    version: "1.0.0",
    endpoints: [
      "POST /api/tickets/ingest - Receive new ticket",
      "POST /api/tickets/analyze - Analyze with AI",
      "GET /api/tickets/:id - Get ticket details",
      "POST /api/tickets/:id/route - Execute routing",
      "GET /api/tickets/:id/response - Get AI response",
      "POST /api/tickets/bulk-import - Import test data",
      "GET /api/analytics/dashboard - View metrics",
    ],
  });
});

// Add health endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// POST /api/tickets/ingest - Receive new ticket
app.post("/api/tickets/ingest", async (req, res) => {
  try {
    const ticketData = req.body;

    // Validate required fields
    if (
      !ticketData.customerId ||
      !ticketData.email ||
      !ticketData.subject ||
      !ticketData.message
    ) {
      return res.status(400).json({
        error: "Missing required fields: customerId, email, subject, message",
      });
    }

    // Generate ticket ID
    const ticketId = generateTicketId();

    // Set default values for missing fields
    const enrichedTicketData = {
      ...ticketData,
      id: ticketId,
      customerTier: ticketData.customerTier || "standard",
      customerLTV: ticketData.customerLTV || 0,
      channel: ticketData.channel || "email",
      timestamp: ticketData.timestamp || new Date(),
      status: "received",
      attachments: ticketData.attachments || [],
      previousTickets: ticketData.previousTickets || 0,
      metadata: ticketData.metadata || {},
    };

    // Try to save to MongoDB, fallback to in-memory if it fails
    try {
      const ticket = new Ticket(enrichedTicketData);
      await ticket.save();
    } catch (dbError) {
      console.log(
        "MongoDB save failed, using in-memory storage:",
        dbError.message
      );
      // Store in memory as fallback
      if (!global.inMemoryTickets) {
        global.inMemoryTickets = new Map();
      }
      global.inMemoryTickets.set(ticketId, enrichedTicketData);
    }

    res.json({
      ticketId: ticketId,
      status: "received",
      estimatedResponseTime:
        customerTiers[ticketData.customerTier]?.slaResponseTime || "24 hours",
    });
  } catch (error) {
    console.error("Ticket ingestion error:", error);
    res.status(500).json({ error: "Failed to ingest ticket" });
  }
});

// POST /api/tickets/analyze - Analyze with AI (updated to handle both ticketId and full ticket data)
app.post("/api/tickets/analyze", async (req, res) => {
  try {
    let ticket;

    // Handle both ticketId and full ticket data
    if (req.body.ticketId) {
      // First try to find existing ticket in MongoDB
      try {
        ticket = await Ticket.findOne({ id: req.body.ticketId });
      } catch (dbError) {
        console.log(
          "MongoDB query failed, checking in-memory storage:",
          dbError.message
        );
        // Check in-memory storage
        if (
          global.inMemoryTickets &&
          global.inMemoryTickets.has(req.body.ticketId)
        ) {
          ticket = global.inMemoryTickets.get(req.body.ticketId);
        }
      }

      if (!ticket) {
        // Create new ticket with provided ticketId
        const ticketData = req.body;

        // Validate required fields (email is optional for some tests)
        if (
          !ticketData.customerId ||
          !ticketData.subject ||
          !ticketData.message
        ) {
          return res.status(400).json({
            error: "Missing required fields: customerId, subject, message",
          });
        }

        // Use provided ticketId or generate new one
        const ticketId = ticketData.ticketId || generateTicketId();

        // Set default values for missing fields
        const enrichedTicketData = {
          ...ticketData,
          id: ticketId,
          customerTier: ticketData.customerTier || "standard",
          customerLTV: ticketData.customerLTV || 0,
          email: ticketData.email || "test@example.com", // Default email
          channel: ticketData.channel || "email",
          timestamp: ticketData.timestamp || new Date(),
          status: "received",
          attachments: ticketData.attachments || [],
          previousTickets: ticketData.previousTickets || 0,
          metadata: ticketData.metadata || {},
        };

        // Try to save to MongoDB, fallback to in-memory
        try {
          ticket = new Ticket(enrichedTicketData);
          await ticket.save();
        } catch (dbError) {
          console.log(
            "MongoDB save failed, using in-memory storage:",
            dbError.message
          );
          ticket = enrichedTicketData;
          if (!global.inMemoryTickets) {
            global.inMemoryTickets = new Map();
          }
          global.inMemoryTickets.set(ticketId, ticket);
        }
      }
    } else {
      // Create ticket from request data if no ticketId provided
      const ticketData = req.body;

      // Validate required fields
      if (
        !ticketData.customerId ||
        !ticketData.subject ||
        !ticketData.message
      ) {
        return res.status(400).json({
          error: "Missing required fields: customerId, subject, message",
        });
      }

      // Generate ticket ID
      const ticketId = generateTicketId();

      // Set default values for missing fields
      const enrichedTicketData = {
        ...ticketData,
        id: ticketId,
        customerTier: ticketData.customerTier || "standard",
        customerLTV: ticketData.customerLTV || 0,
        email: ticketData.email || "test@example.com", // Default email
        channel: ticketData.channel || "email",
        timestamp: ticketData.timestamp || new Date(),
        status: "received",
        attachments: ticketData.attachments || [],
        previousTickets: ticketData.previousTickets || 0,
        metadata: ticketData.metadata || {},
      };

      // Try to save to MongoDB, fallback to in-memory
      try {
        ticket = new Ticket(enrichedTicketData);
        await ticket.save();
      } catch (dbError) {
        console.log(
          "MongoDB save failed, using in-memory storage:",
          dbError.message
        );
        ticket = enrichedTicketData;
        if (!global.inMemoryTickets) {
          global.inMemoryTickets = new Map();
        }
        global.inMemoryTickets.set(ticketId, ticket);
      }
    }

    // Perform AI analysis (use provided analysis if available)
    let analysis;
    if (req.body.analysis) {
      // Use provided analysis data
      analysis = req.body.analysis;
    } else {
      // Perform AI analysis
      analysis = await analyzeTicketWithAI(ticket);
    }

    // Update ticket with analysis
    ticket.analysis = analysis;
    ticket.status = "analyzed";
    ticket.updatedAt = new Date();

    // Try to save updated ticket
    try {
      if (ticket.save) {
        await ticket.save();
      } else {
        // Update in-memory storage
        if (global.inMemoryTickets) {
          global.inMemoryTickets.set(ticket.id, ticket);
        }
      }
    } catch (dbError) {
      console.log(
        "MongoDB update failed, using in-memory storage:",
        dbError.message
      );
      if (global.inMemoryTickets) {
        global.inMemoryTickets.set(ticket.id, ticket);
      }
    }

    res.json({
      ticketId: ticket.id,
      analysis: analysis,
      confidence: analysis.confidence,
      processingTime:
        Date.now() -
        (ticket.createdAt ? ticket.createdAt.getTime() : Date.now()),
    });
  } catch (error) {
    console.error("Ticket analysis error:", error);
    res.status(500).json({ error: "Failed to analyze ticket" });
  }
});

// GET /api/tickets/:id - Get ticket details
app.get("/api/tickets/:id", async (req, res) => {
  try {
    let ticket;

    // Try MongoDB first
    try {
      ticket = await Ticket.findOne({ id: req.params.id });
    } catch (dbError) {
      console.log(
        "MongoDB query failed, checking in-memory storage:",
        dbError.message
      );
      // Check in-memory storage
      if (global.inMemoryTickets && global.inMemoryTickets.has(req.params.id)) {
        ticket = global.inMemoryTickets.get(req.params.id);
      }
    }

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({ error: "Failed to retrieve ticket" });
  }
});

// POST /api/tickets/:id/route - Execute routing
app.post("/api/tickets/:id/route", async (req, res) => {
  try {
    let ticket;

    // Try MongoDB first
    try {
      ticket = await Ticket.findOne({ id: req.params.id });
    } catch (dbError) {
      console.log(
        "MongoDB query failed, checking in-memory storage:",
        dbError.message
      );
      // Check in-memory storage
      if (global.inMemoryTickets && global.inMemoryTickets.has(req.params.id)) {
        ticket = global.inMemoryTickets.get(req.params.id);
      }
    }

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (!ticket.analysis) {
      return res
        .status(400)
        .json({ error: "Ticket must be analyzed before routing" });
    }

    // Perform routing
    const routing = routeTicket(ticket, ticket.analysis);

    // Update ticket with routing
    ticket.routing = routing;
    ticket.status = "routed";
    ticket.updatedAt = new Date();

    // Try to save updated ticket
    try {
      if (ticket.save) {
        await ticket.save();
      } else {
        // Update in-memory storage
        if (global.inMemoryTickets) {
          global.inMemoryTickets.set(ticket.id, ticket);
        }
      }
    } catch (dbError) {
      console.log(
        "MongoDB update failed, using in-memory storage:",
        dbError.message
      );
      if (global.inMemoryTickets) {
        global.inMemoryTickets.set(ticket.id, ticket);
      }
    }

    res.json({
      ticketId: ticket.id,
      routing: {
        team: routing.team,
        teamName: teams[routing.team]?.name,
        priority: routing.priority,
        sla: routing.sla,
        escalationPath: routing.escalationPath,
        autoResolve: routing.autoResolve,
        appliedRules: routing.appliedRules,
      },
    });
  } catch (error) {
    console.error("Ticket routing error:", error);
    res.status(500).json({ error: "Failed to route ticket" });
  }
});

// GET /api/tickets/:id/response - Get AI response
app.get("/api/tickets/:id/response", async (req, res) => {
  try {
    let ticket;

    // Try MongoDB first
    try {
      ticket = await Ticket.findOne({ id: req.params.id });
    } catch (dbError) {
      console.log(
        "MongoDB query failed, checking in-memory storage:",
        dbError.message
      );
      // Check in-memory storage
      if (global.inMemoryTickets && global.inMemoryTickets.has(req.params.id)) {
        ticket = global.inMemoryTickets.get(req.params.id);
      }
    }

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (!ticket.routing) {
      return res
        .status(400)
        .json({ error: "Ticket must be routed before generating response" });
    }

    // Generate response if not already generated
    if (!ticket.response || !ticket.response.acknowledgment) {
      const acknowledgment = await generateResponse(
        ticket,
        ticket.analysis,
        ticket.routing
      );

      ticket.response = {
        acknowledgment,
        suggestedActions: [],
        estimatedResolutionTime: ticket.routing.sla,
        generatedAt: new Date(),
      };

      // Try to save updated ticket
      try {
        if (ticket.save) {
          await ticket.save();
        } else {
          // Update in-memory storage
          if (global.inMemoryTickets) {
            global.inMemoryTickets.set(ticket.id, ticket);
          }
        }
      } catch (dbError) {
        console.log(
          "MongoDB update failed, using in-memory storage:",
          dbError.message
        );
        if (global.inMemoryTickets) {
          global.inMemoryTickets.set(ticket.id, ticket);
        }
      }
    }

    res.json({
      ticketId: ticket.id,
      response: ticket.response,
    });
  } catch (error) {
    console.error("Response generation error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// POST /api/tickets/bulk-import - Import test data (updated to handle file uploads)
app.post("/api/tickets/bulk-import", async (req, res) => {
  try {
    let tickets;

    // Handle both JSON data and file uploads
    if (req.body.tickets) {
      tickets = req.body.tickets;
    } else if (req.body) {
      // If the entire body is the tickets array
      tickets = req.body;
    } else {
      return res.status(400).json({ error: "Invalid tickets data" });
    }

    if (!Array.isArray(tickets)) {
      return res.status(400).json({ error: "Tickets must be an array" });
    }

    const importedTickets = [];

    for (const ticketData of tickets) {
      // Use existing ID if provided, otherwise generate new one
      const ticketId = ticketData.id || generateTicketId();

      // Set default values for missing fields
      const enrichedTicketData = {
        id: ticketId,
        customerId: ticketData.customerId,
        customerTier: ticketData.customerTier || "standard",
        customerLTV: ticketData.customerLTV || 0,
        email: ticketData.email,
        subject: ticketData.subject,
        message: ticketData.message,
        channel: ticketData.channel || "email",
        timestamp: new Date(ticketData.timestamp),
        attachments: ticketData.attachments || [],
        previousTickets: ticketData.previousTickets || 0,
        metadata: ticketData.metadata || {},
        status: "received",
      };

      // Try to save to MongoDB, fallback to in-memory
      try {
        const ticket = new Ticket(enrichedTicketData);
        await ticket.save();
        importedTickets.push(ticketId);
      } catch (dbError) {
        console.log(
          "MongoDB save failed, using in-memory storage:",
          dbError.message
        );
        // Store in memory as fallback
        if (!global.inMemoryTickets) {
          global.inMemoryTickets = new Map();
        }
        global.inMemoryTickets.set(ticketId, enrichedTicketData);
        importedTickets.push(ticketId);
      }
    }

    res.json({
      message: `Successfully imported ${importedTickets.length} tickets`,
      ticketIds: importedTickets,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    res.status(500).json({ error: "Failed to import tickets" });
  }
});

// GET /api/analytics/dashboard - View metrics
app.get("/api/analytics/dashboard", async (req, res) => {
  try {
    let totalTickets = 0;
    let ticketsByStatus = {};
    let ticketsByCategory = {};
    let ticketsByUrgency = {};
    let ticketsByTier = {};
    let averagePriority = 0;
    let autoResolutionRate = 0;

    // Try MongoDB first
    try {
      totalTickets = await Ticket.countDocuments();
      const ticketsByStatusData = await Ticket.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      ticketsByStatus = ticketsByStatusData.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const ticketsByCategoryData = await Ticket.aggregate([
        { $group: { _id: "$analysis.category", count: { $sum: 1 } } },
      ]);
      ticketsByCategory = ticketsByCategoryData.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const ticketsByUrgencyData = await Ticket.aggregate([
        { $group: { _id: "$analysis.urgency", count: { $sum: 1 } } },
      ]);
      ticketsByUrgency = ticketsByUrgencyData.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const ticketsByTierData = await Ticket.aggregate([
        { $group: { _id: "$customerTier", count: { $sum: 1 } } },
      ]);
      ticketsByTier = ticketsByTierData.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const avgPriorityData = await Ticket.aggregate([
        { $group: { _id: null, avgPriority: { $avg: "$routing.priority" } } },
      ]);
      averagePriority = avgPriorityData[0]?.avgPriority || 0;

      autoResolutionRate =
        totalTickets > 0
          ? (await Ticket.countDocuments({ "routing.autoResolve": true })) /
            totalTickets
          : 0;
    } catch (dbError) {
      console.log(
        "MongoDB analytics failed, using in-memory data:",
        dbError.message
      );

      // Fallback to in-memory analytics
      if (global.inMemoryTickets) {
        const tickets = Array.from(global.inMemoryTickets.values());
        totalTickets = tickets.length;

        // Calculate analytics from in-memory data
        ticketsByStatus = tickets.reduce((acc, ticket) => {
          acc[ticket.status] = (acc[ticket.status] || 0) + 1;
          return acc;
        }, {});

        ticketsByCategory = tickets.reduce((acc, ticket) => {
          if (ticket.analysis && ticket.analysis.category) {
            acc[ticket.analysis.category] =
              (acc[ticket.analysis.category] || 0) + 1;
          }
          return acc;
        }, {});

        ticketsByUrgency = tickets.reduce((acc, ticket) => {
          if (ticket.analysis && ticket.analysis.urgency) {
            acc[ticket.analysis.urgency] =
              (acc[ticket.analysis.urgency] || 0) + 1;
          }
          return acc;
        }, {});

        ticketsByTier = tickets.reduce((acc, ticket) => {
          acc[ticket.customerTier] = (acc[ticket.customerTier] || 0) + 1;
          return acc;
        }, {});

        const priorities = tickets
          .filter((ticket) => ticket.routing && ticket.routing.priority)
          .map((ticket) => ticket.routing.priority);
        averagePriority =
          priorities.length > 0
            ? priorities.reduce((sum, p) => sum + p, 0) / priorities.length
            : 0;

        const autoResolveCount = tickets.filter(
          (ticket) => ticket.routing && ticket.routing.autoResolve
        ).length;
        autoResolutionRate =
          totalTickets > 0 ? autoResolveCount / totalTickets : 0;
      }
    }

    res.json({
      totalTickets,
      ticketsByStatus,
      ticketsByCategory,
      ticketsByUrgency,
      ticketsByTier,
      averagePriority,
      autoResolutionRate,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to retrieve analytics" });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Load configuration data
loadConfigurationData();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Support Triage Agent running on http://localhost:${PORT}`);
  console.log(
    `🤖 Gemini 2.5 Integration: ${
      process.env.GEMINI_API_KEY ? "Enabled" : "Disabled (using fallback)"
    }`
  );
  console.log(
    `📊 MongoDB: ${
      mongoose.connection.readyState === 1 ? "Connected" : "Connecting..."
    }`
  );
  console.log(`🎯 Ready to process support tickets!`);
});

module.exports = app;
