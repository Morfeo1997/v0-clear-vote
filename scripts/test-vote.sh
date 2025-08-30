#!/bin/bash

# Test script for vote Edge Function
# Usage: ./test-vote.sh [SUPABASE_URL] [JWT_TOKEN] [ELECTION_ID] [CANDIDATE_ID]

SUPABASE_URL="${1:-https://iryqlbksafhjgmtukjny.supabase.co}"
JWT_TOKEN="${2:-your_jwt_token_here}"
ELECTION_ID="${3:-election_id_here}"
CANDIDATE_ID="${4:-candidate_id_here}"

echo "🗳️  Testing vote Edge Function..."
echo "URL: $SUPABASE_URL/functions/v1/vote"
echo "Authorization: Bearer $JWT_TOKEN"
echo "Election ID: $ELECTION_ID"
echo "Candidate ID: $CANDIDATE_ID"
echo ""

curl -X POST "$SUPABASE_URL/functions/v1/vote" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"electionId\": \"$ELECTION_ID\",
    \"candidateId\": \"$CANDIDATE_ID\"
  }" \
  --verbose

echo -e "\n\n✅ Test completed!"
echo "Expected response: Vote cast successfully with anonymous hash"
