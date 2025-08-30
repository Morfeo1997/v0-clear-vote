#!/bin/bash

# Test script for requestCandidacy Edge Function
# Usage: ./test-request-candidacy.sh [SUPABASE_URL] [JWT_TOKEN] [ELECTION_ID] [PARTY_ID]

SUPABASE_URL="${1:-https://iryqlbksafhjgmtukjny.supabase.co}"
JWT_TOKEN="${2:-your_jwt_token_here}"
ELECTION_ID="${3:-election_id_here}"
PARTY_ID="${4:-party_id_here}"

echo "🏛️  Testing requestCandidacy Edge Function..."
echo "URL: $SUPABASE_URL/functions/v1/requestCandidacy"
echo "Authorization: Bearer $JWT_TOKEN"
echo "Election ID: $ELECTION_ID"
echo "Party ID: $PARTY_ID"
echo ""

curl -X POST "$SUPABASE_URL/functions/v1/requestCandidacy" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"electionId\": \"$ELECTION_ID\",
    \"partyId\": \"$PARTY_ID\",
    \"description\": \"Experienced leader committed to transparency and innovation\",
    \"proposals\": \"1. Digital government transformation 2. Sustainable economic growth 3. Educational reform\",
    \"photoUrl\": \"https://example.com/candidate-photo.jpg\"
  }" \
  --verbose

echo -e "\n\n✅ Test completed!"
echo "Expected response: Candidacy request submitted, waiting for approval"