# AI Customer Support Triage Agent - Detailed Requirements

## 🎯 Challenge Objective

Build an AI-powered support ticket triage system that demonstrates:
1. Advanced LLM integration for natural language understanding
2. Complex business logic implementation
3. Multi-stage processing pipeline
4. Intelligent routing and prioritization
5. Context-aware response generation

## 📋 Functional Requirements

### 1. Ticket Ingestion System

#### Input Format
```json
{
  "customerId": "CUST-12345",
  "email": "customer@example.com",
  "subject": "Payment processing error",
  "message": "I've been trying to process a payment for the past hour...",
  "channel": "email|chat|phone|social",
  "timestamp": "2025-01-15T10:00:00Z",
  "attachments": ["screenshot.png", "error.log"],
  "metadata": {
    "browser": "Chrome 120",
    "os": "macOS",
    "location": "New York, US",
    "sessionId": "sess_abc123"
  }
}
```

#### Required Processing
1. Validate incoming ticket format
2. Enrich with customer data (tier, history, value)
3. Generate unique ticket ID
4. Store in persistent storage
5. Trigger analysis pipeline

### 2. AI Analysis Pipeline

#### Stage 1: Language Detection
- Detect primary language
- Identify if translation needed
- Confidence threshold: 0.95

#### Stage 2: Classification
Extract the following with confidence scores:

```json
{
  "urgency": {
    "level": "critical|high|medium|low",
    "confidence": 0.92,
    "reasoning": "Customer mentioned losing money"
  },
  "category": {
    "primary": "billing|technical|account|feature|general",
    "secondary": ["payment", "subscription"],
    "confidence": 0.88
  },
  "sentiment": {
    "score": -0.8,  // -1 (very negative) to 1 (very positive)
    "label": "angry|frustrated|neutral|satisfied",
    "confidence": 0.95
  }
}
```

#### Stage 3: Entity Extraction
Identify and extract:
- Product names/SKUs
- Error codes or messages
- Transaction/Order IDs
- Dates and deadlines
- Dollar amounts
- Feature requests
- Competitor mentions

#### Stage 4: Intent Recognition
Determine primary customer intent:
- `refund` - Wants money back
- `troubleshooting` - Needs technical help
- `information` - Asking questions
- `complaint` - Expressing dissatisfaction
- `upgrade/downgrade` - Account changes
- `cancellation` - Wants to cancel
- `feature_request` - Requesting new functionality

### 3. Business Logic Router

#### Routing Rules Engine

```javascript
const routingRules = {
  // Priority Rules
  "premium_customer": {
    "condition": "customer.tier === 'premium'",
    "actions": {
      "priority_boost": 2,
      "max_wait_time": "30min",
      "auto_escalate": true,
      "route_to": "senior_support"
    }
  },
  
  // Security & Compliance
  "security_breach": {
    "condition": "category === 'security' || entities.includes('breach')",
    "actions": {
      "priority": "critical",
      "route_to": "security_team",
      "notify": ["ciso@company.com", "legal@company.com"],
      "create_incident": true
    }
  },
  
  // Financial Thresholds
  "high_value_billing": {
    "condition": "category === 'billing' && amount > 1000",
    "actions": {
      "route_to": "finance_senior",
      "requires_approval": true,
      "sla": "2_hours"
    }
  },
  
  // Technical Issues
  "database_error": {
    "condition": "entities.error_codes.includes('DB_')",
    "actions": {
      "route_to": "backend_team",
      "create_jira": true,
      "priority": "high"
    }
  },
  
  // Sentiment-Based
  "angry_valuable_customer": {
    "condition": "sentiment.label === 'angry' && customer.ltv > 10000",
    "actions": {
      "route_to": "retention_team",
      "priority_boost": 1,
      "manager_notification": true
    }
  },
  
  // Auto-Resolution
  "password_reset": {
    "condition": "intent === 'password_reset' && customer.tier === 'free'",
    "actions": {
      "auto_resolve": true,
      "send_template": "password_reset_instructions",
      "no_agent_needed": true
    }
  }
}
```

#### Priority Calculation
```python
def calculate_priority(ticket, analysis, customer):
    base_priority = {
        'critical': 100,
        'high': 75,
        'medium': 50,
        'low': 25
    }[analysis.urgency]
    
    # Customer tier modifier
    tier_boost = {
        'enterprise': 30,
        'premium': 20,
        'standard': 10,
        'free': 0
    }[customer.tier]
    
    # Sentiment modifier
    if analysis.sentiment.label == 'angry':
        base_priority += 15
    
    # Customer value modifier
    if customer.ltv > 50000:
        base_priority += 20
    elif customer.ltv > 10000:
        base_priority += 10
    
    # Time in queue modifier
    hours_waiting = ticket.hours_since_created()
    base_priority += min(hours_waiting * 5, 25)
    
    return min(base_priority + tier_boost, 100)
```

### 4. Response Generation

#### Initial Acknowledgment
Generate personalized acknowledgment based on:
- Urgency level
- Customer tier
- Sentiment
- Previous interactions

#### Solution Suggestions
1. Search for similar resolved tickets
2. Identify successful resolutions
3. Generate step-by-step solutions
4. Include relevant documentation links

#### Tone Matching
- Formal for enterprise customers
- Friendly for standard users  
- Apologetic for angry customers
- Technical for developer issues

### 5. API Specifications

#### POST /api/tickets/ingest
```
Request: Ticket object
Response: {
  "ticketId": "TICK-20250115-001",
  "status": "received",
  "estimatedResponseTime": "2 hours"
}
```

#### POST /api/tickets/analyze
```
Request: {
  "ticketId": "TICK-20250115-001"
}
Response: {
  "analysis": { /* classification results */ },
  "confidence": 0.89,
  "processingTime": 1250
}
```

#### POST /api/tickets/:id/route
```
Response: {
  "routing": {
    "team": "billing_senior",
    "priority": 85,
    "sla": "2_hours",
    "escalationPath": ["billing_senior", "billing_manager", "cfo"]
  }
}
```

#### GET /api/analytics/dashboard
```
Response: {
  "totalTickets": 1523,
  "avgResponseTime": "1.5 hours",
  "autoResolutionRate": 0.34,
  "customerSatisfaction": 0.78,
  "byCategory": { /* breakdown */ },
  "byUrgency": { /* breakdown */ }
}
```

## 🧪 Test Scenarios

### Scenario 1: Angry Premium Customer
- Customer tier: Premium
- Sentiment: Angry
- Issue: Billing error > $500
- Expected: Route to senior support, priority > 90

### Scenario 2: Security Breach Report
- Keywords: "data breach", "unauthorized access"
- Expected: Critical priority, security team, instant notifications

### Scenario 3: Simple Password Reset
- Customer tier: Free
- Intent: Password reset
- Expected: Auto-resolution with template

### Scenario 4: Technical Database Error
- Error codes: DB_CONNECTION_FAILED
- Expected: Route to backend team, create Jira ticket

### Scenario 5: Feature Request from Enterprise
- Customer tier: Enterprise
- Intent: Feature request
- Expected: Route to product team, high priority

## 📊 Success Metrics

1. **Accuracy Metrics**
   - Classification accuracy > 85%
   - Routing accuracy > 90%
   - False positive rate < 5%

2. **Performance Metrics**
   - Analysis time < 2 seconds
   - API response time < 500ms
   - Concurrent ticket handling > 100

3. **Business Metrics**
   - Auto-resolution rate > 30%
   - Correct first-touch routing > 80%
   - SLA compliance > 95%

## 🔧 Technical Constraints

- Must handle 100+ concurrent tickets
- LLM timeout: 5 seconds max
- Fallback mechanism for LLM failures
- All customer data must be sanitized in logs
- Responses must be stored for audit

## 💡 Implementation Tips

### LLM Prompt Engineering
```python
ANALYSIS_PROMPT = """
Analyze this support ticket and provide:
1. Urgency (critical/high/medium/low) with reasoning
2. Category (billing/technical/account/feature/general)
3. Sentiment score (-1 to 1) and label
4. Key entities (products, errors, IDs)
5. Customer intent

Ticket:
Subject: {subject}
Message: {message}
Customer Tier: {tier}

Return as structured JSON with confidence scores.
"""
```

### Error Handling
```javascript
async function analyzeWithFallback(ticket) {
  try {
    return await llm.analyze(ticket, { timeout: 5000 });
  } catch (error) {
    // Fallback to rule-based classification
    return ruleBasedClassifier.analyze(ticket);
  }
}
```

### Caching Strategy
- Cache customer data for 1 hour
- Cache similar ticket searches for 15 minutes
- Cache LLM responses for identical inputs

## 🎯 Bonus Challenges

1. **Multi-language Support** - Handle tickets in 5+ languages
2. **Predictive Escalation** - Predict which tickets will escalate
3. **Auto-learning** - Improve routing based on agent feedback
4. **Bulk Processing** - Handle batch imports efficiently
5. **Real-time Dashboard** - WebSocket-based live updates

## 📝 Deliverables

By the end of the session, you should have:
1. Working API with all required endpoints
2. LLM integration for analysis
3. Business logic router implementation
4. Response generation system
5. Test results showing accuracy
6. Brief documentation of approach

Remember: Focus on demonstrating AI agent design skills, not perfect implementation!