#!/bin/bash

# Test script for verifying candidate solutions
# Usage: ./test-solution.sh

PORT=${1:-3000}
BASE_URL="http://localhost:$PORT"

echo "🧪 Testing Notes API at $BASE_URL"
echo "=================================="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local test_name=$5
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL$endpoint")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} $test_name (HTTP $status_code)"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC} $test_name (Expected: $expected_status, Got: $status_code)"
        ((TESTS_FAILED++))
    fi
}

echo "🔍 Running tests..."
echo

# Test 1: Get all notes
test_endpoint "GET" "/api/notes" "" "200" "GET /api/notes - List all notes"

# Test 2: Get specific note
test_endpoint "GET" "/api/notes/note-001" "" "200" "GET /api/notes/:id - Get existing note"

# Test 3: Get non-existent note
test_endpoint "GET" "/api/notes/note-999" "" "404" "GET /api/notes/:id - Note not found"

# Test 4: Create new note
test_endpoint "POST" "/api/notes" '{"title":"Test","content":"Test content","tags":["test"]}' "201" "POST /api/notes - Create new note"

# Test 5: Search by query
test_endpoint "GET" "/api/notes/search?q=meeting" "" "200" "GET /api/notes/search?q=meeting - Search by text"

# Test 6: Search by tag
test_endpoint "GET" "/api/notes/search?tag=bug" "" "200" "GET /api/notes/search?tag=bug - Search by tag"

# Test 7: Delete note
test_endpoint "DELETE" "/api/notes/note-005" "" "200" "DELETE /api/notes/:id - Delete existing note"

# Test 8: Delete non-existent note
test_endpoint "DELETE" "/api/notes/note-999" "" "404" "DELETE /api/notes/:id - Note not found"

echo
echo "=================================="
echo "📊 Test Results:"
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
echo -e "${RED}Failed:${NC} $TESTS_FAILED"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️ Some tests failed${NC}"
    exit 1
fi