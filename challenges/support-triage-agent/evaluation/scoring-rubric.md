# AI Support Triage Agent - Evaluation Rubric

## Scoring Overview

Total Points: 100
- **AI/LLM Integration**: 35 points
- **Business Logic**: 25 points
- **System Architecture**: 20 points
- **API Implementation**: 10 points
- **Code Quality**: 10 points

---

## 1. AI/LLM Integration (35 points)

### Prompt Engineering (15 points)
- **Excellent (13-15)**: Sophisticated prompts with clear structure, examples, and output formatting. Handles edge cases.
- **Good (10-12)**: Well-structured prompts that reliably extract required information.
- **Fair (6-9)**: Basic prompts that work but may miss nuances or produce inconsistent results.
- **Poor (0-5)**: Minimal or poorly structured prompts with unreliable outputs.

### Analysis Accuracy (10 points)
- **Excellent (9-10)**: Correctly classifies urgency, category, sentiment, and intent >90% of the time.
- **Good (7-8)**: Accurate classification 75-90% of the time.
- **Fair (5-6)**: Accurate classification 60-75% of the time.
- **Poor (0-4)**: Accuracy below 60%.

### Entity Extraction (5 points)
- **Excellent (5)**: Reliably extracts product names, error codes, amounts, and other entities.
- **Good (4)**: Extracts most important entities with occasional misses.
- **Fair (2-3)**: Basic entity extraction with frequent misses.
- **Poor (0-1)**: Little to no entity extraction.

### Error Handling (5 points)
- **Excellent (5)**: Graceful fallback when LLM fails, timeout handling, retry logic.
- **Good (4)**: Basic error handling with some fallback options.
- **Fair (2-3)**: Minimal error handling, may crash on LLM failures.
- **Poor (0-1)**: No error handling for LLM issues.

---

## 2. Business Logic Implementation (25 points)

### Routing Rules (10 points)
- **Excellent (9-10)**: Complex routing with multiple conditions, priority calculation, and escalation paths.
- **Good (7-8)**: Good routing logic covering main scenarios.
- **Fair (5-6)**: Basic routing with limited rule complexity.
- **Poor (0-4)**: Minimal or hardcoded routing.

### Priority Calculation (8 points)
- **Excellent (7-8)**: Dynamic priority based on multiple factors (tier, LTV, sentiment, urgency, time).
- **Good (5-6)**: Priority calculation using 3-4 factors.
- **Fair (3-4)**: Basic priority using 1-2 factors.
- **Poor (0-2)**: Static or missing priority calculation.

### Customer Tier Handling (7 points)
- **Excellent (6-7)**: Different treatment paths, SLAs, and escalation for different tiers.
- **Good (4-5)**: Clear tier differentiation in routing and priority.
- **Fair (2-3)**: Basic tier recognition.
- **Poor (0-1)**: No tier-based logic.

---

## 3. System Architecture (20 points)

### Pipeline Design (8 points)
- **Excellent (7-8)**: Clear multi-stage pipeline with separation of concerns.
- **Good (5-6)**: Organized flow with distinct processing stages.
- **Fair (3-4)**: Basic linear processing.
- **Poor (0-2)**: Monolithic or unclear architecture.

### State Management (6 points)
- **Excellent (5-6)**: Proper ticket state tracking, audit logging, status updates.
- **Good (4)**: Good state management with some tracking.
- **Fair (2-3)**: Basic state handling.
- **Poor (0-1)**: No clear state management.

### Scalability Considerations (6 points)
- **Excellent (5-6)**: Async processing, queue management, concurrent handling.
- **Good (4)**: Some scalability features implemented.
- **Fair (2-3)**: Basic consideration for scale.
- **Poor (0-1)**: No scalability considerations.

---

## 4. API Implementation (10 points)

### Endpoint Completeness (5 points)
- **Excellent (5)**: All required endpoints implemented with proper HTTP methods.
- **Good (4)**: Most endpoints implemented correctly.
- **Fair (2-3)**: Core endpoints working.
- **Poor (0-1)**: Missing critical endpoints.

### Request/Response Format (5 points)
- **Excellent (5)**: Proper JSON structure, validation, error responses.
- **Good (4)**: Good formatting with minor issues.
- **Fair (2-3)**: Basic JSON handling.
- **Poor (0-1)**: Poor or inconsistent formatting.

---

## 5. Code Quality (10 points)

### Organization (5 points)
- **Excellent (5)**: Clean separation, modular design, clear file structure.
- **Good (4)**: Well-organized with minor issues.
- **Fair (2-3)**: Basic organization.
- **Poor (0-1)**: Poorly organized code.

### Documentation (5 points)
- **Excellent (5)**: Clear README, inline comments, API documentation.
- **Good (4)**: Good documentation coverage.
- **Fair (2-3)**: Basic documentation.
- **Poor (0-1)**: Little to no documentation.

---

## Bonus Points (up to 10 extra)

- **Auto-resolution System** (+3): Implements intelligent auto-resolution for common issues
- **Similar Ticket Clustering** (+3): Finds and uses similar resolved tickets
- **Real-time Dashboard** (+2): Live metrics and monitoring
- **Multi-language Support** (+2): Handles tickets in multiple languages

---

## Test Scenario Validation

Run through the 10 test scenarios in `test-scenarios.json`:

| Scenario | Pass/Fail | Points (2 each) |
|----------|-----------|-----------------|
| Critical Security Breach | | /2 |
| Simple Password Reset | | /2 |
| Angry Premium Customer | | /2 |
| Enterprise Outage | | /2 |
| GDPR Compliance | | /2 |
| Feature Request | | /2 |
| Database Error | | /2 |
| Refund Request | | /2 |
| Mobile SDK Bug | | /2 |
| Enterprise Cancellation | | /2 |

**Total Test Points: /20**

---

## Final Score Calculation

```
Base Score = AI/LLM (35) + Business Logic (25) + Architecture (20) + API (10) + Code Quality (10)
Test Score = Test Scenarios (20)
Bonus Points = (up to 10)

Final Score = Base Score + Test Score + Bonus Points
Maximum Possible = 130 points
```

---

## Grade Boundaries

- **A+ (120-130)**: Exceptional implementation with bonus features
- **A (110-119)**: Excellent implementation exceeding requirements
- **B (90-109)**: Good implementation meeting all core requirements
- **C (70-89)**: Fair implementation with some gaps
- **D (50-69)**: Basic implementation missing key features
- **F (0-49)**: Incomplete or non-functional implementation

---

## Key Evaluation Questions

1. **Does the agent correctly understand and classify support tickets?**
2. **Are routing decisions logical and based on business rules?**
3. **Is the LLM integration robust with proper error handling?**
4. **Does priority calculation consider multiple factors?**
5. **Is the code well-organized and maintainable?**
6. **Can the system handle the test scenarios correctly?**
7. **Are there clear escalation paths and SLA considerations?**
8. **Is the response generation contextual and appropriate?**

---

## Discussion Points Scoring (Interview Portion)

During the 15-minute discussion, evaluate:

1. **Technical Understanding** (5 points): Can they explain their LLM integration approach?
2. **Design Decisions** (5 points): Can they justify architectural choices?
3. **Scalability Thinking** (5 points): How would they scale to 100K tickets/day?
4. **Problem-Solving** (5 points): How do they handle edge cases and failures?
5. **Business Acumen** (5 points): Do they understand the business impact?

**Total Discussion Points: 25**