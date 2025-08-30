#!/bin/bash

# Test script for getElectionResults Edge Function
# Usage: ./test-get-results.sh [SUPABASE_URL] [JWT_TOKEN] [ELECTION_ID]

SUPABASE_URL="${1:-https://iryqlbksafhjgmtukjny.supabase.co}"
JWT_TOKEN="${2:-your_jwt_token_here}"
ELECTION_ID="${3:-election_id_here}"

echo "📊 Testing getElectionResults Edge Function..."
echo "URL: $SUPABASE_URL/functions/v1/getElectionResults"
echo "Authorization: Bearer $JWT_TOKEN"
echo "Election ID: $ELECTION_ID"
echo ""

curl -X GET "$SUPABASE_URL/functions/v1/getElectionResults?electionId=$ELECTION_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  --verbose

echo -e "\n\n✅ Test completed!"
echo "Expected response: Complete election results with vote counts and percentages"
