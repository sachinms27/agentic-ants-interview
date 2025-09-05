#!/bin/bash

# Test script for AI Support Triage Agent
# Usage: ./test-solution.sh [port]

PORT=${1:-3000}
BASE_URL="http://localhost:$PORT"

echo "🤖 Testing AI Support Triage Agent at $BASE_URL"
echo "================================================"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local test_name=$5
    local check_field=$6
    local expected_value=$7
    
    ((TESTS_TOTAL++))
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$status_code" = "$expected_status" ]; then
        if [ -n "$check_field" ] && [ -n "$expected_value" ]; then
            # Check if response contains expected field/value
            if echo "$body" | grep -q "$expected_value"; then
                echo -e "${GREEN}✓${NC} $test_name (HTTP $status_code, verified: $check_field)"
                ((TESTS_PASSED++))
            else
                echo -e "${YELLOW}⚠${NC} $test_name (HTTP $status_code OK, but $check_field not as expected)"
                echo "  Expected to find: $expected_value"
                ((TESTS_FAILED++))
            fi
        else
            echo -e "${GREEN}✓${NC} $test_name (HTTP $status_code)"
            ((TESTS_PASSED++))
        fi
    else
        echo -e "${RED}✗${NC} $test_name (Expected: $expected_status, Got: $status_code)"
        ((TESTS_FAILED++))
    fi
}

echo "🔍 Running API tests..."
echo

# Test 1: Health check
test_endpoint "GET" "/health" "" "200" "Health check endpoint"

# Test 2: Ingest a simple ticket
TICKET_DATA='{
  "customerId": "CUST-TEST-001",
  "email": "test@example.com",
  "subject": "Cannot login to my account",
  "message": "I forgot my password and need help resetting it",
  "channel": "email"
}'
test_endpoint "POST" "/api/tickets/ingest" "$TICKET_DATA" "200" "Ingest support ticket" "ticketId" "TICK"

# Test 3: Analyze a critical security ticket
SECURITY_TICKET='{
  "customerId": "CUST-ENTERPRISE-001",
  "customerTier": "enterprise",
  "subject": "Security vulnerability detected",
  "message": "Found SQL injection vulnerability in your API",
  "channel": "email"
}'
test_endpoint "POST" "/api/tickets/analyze" "$SECURITY_TICKET" "200" "Analyze security ticket" "category" "security"

# Test 4: Test routing for premium angry customer
ANGRY_TICKET='{
  "ticketId": "TICK-TEST-002",
  "customerId": "CUST-PREMIUM-001",
  "customerTier": "premium",
  "customerLTV": 50000,
  "subject": "Your service is terrible!",
  "message": "This is the worst service ever. I want my money back NOW!",
  "channel": "email"
}'
test_endpoint "POST" "/api/tickets/analyze" "$ANGRY_TICKET" "200" "Analyze angry customer" "sentiment" "angry"

# Test 5: Test auto-resolution for password reset
PASSWORD_TICKET='{
  "customerId": "CUST-FREE-001",
  "customerTier": "free",
  "subject": "Reset password",
  "message": "How do I reset my password?",
  "channel": "chat"
}'
test_endpoint "POST" "/api/tickets/analyze" "$PASSWORD_TICKET" "200" "Auto-resolve password reset" "intent" "password"

# Test 6: Test bulk import
test_endpoint "POST" "/api/tickets/bulk-import" "@test-data/support-tickets.json" "200" "Bulk import tickets"

# Test 7: Get ticket by ID
test_endpoint "GET" "/api/tickets/TICK-001" "" "200" "Get ticket by ID"

# Test 8: Test routing decision
ROUTE_DATA='{
  "ticketId": "TICK-TEST-003",
  "analysis": {
    "urgency": "critical",
    "category": "billing",
    "sentiment": "angry",
    "customerTier": "enterprise"
  }
}'
test_endpoint "POST" "/api/tickets/TICK-TEST-003/route" "$ROUTE_DATA" "200" "Execute routing decision" "team" ""

# Test 9: Generate response
test_endpoint "GET" "/api/tickets/TICK-TEST-003/response" "" "200" "Generate AI response"

# Test 10: Analytics dashboard
test_endpoint "GET" "/api/analytics/dashboard" "" "200" "Get analytics dashboard"

echo
echo "================================================"
echo "📊 Test Results Summary:"
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED / $TESTS_TOTAL"
echo -e "${RED}Failed:${NC} $TESTS_FAILED / $TESTS_TOTAL"

# Calculate pass percentage
if [ $TESTS_TOTAL -gt 0 ]; then
    PASS_RATE=$((TESTS_PASSED * 100 / TESTS_TOTAL))
    echo "Pass Rate: ${PASS_RATE}%"
    
    if [ $PASS_RATE -ge 80 ]; then
        echo -e "${GREEN}🎉 Great job! Core functionality is working.${NC}"
        exit 0
    elif [ $PASS_RATE -ge 60 ]; then
        echo -e "${YELLOW}⚠️ Good progress, but some features need work.${NC}"
        exit 1
    else
        echo -e "${RED}❌ Several core features are not working yet.${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ No tests could be run.${NC}"
    exit 1
fi