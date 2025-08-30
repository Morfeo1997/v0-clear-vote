#!/bin/bash

# Test script for approveCandidacy Edge Function
# Usage: ./test-approve-candidacy.sh [SUPABASE_URL] [JWT_TOKEN] [CANDIDATE_ID] [APPROVED]

SUPABASE_URL="${1:-https://iryqlbksafhjgmtukjny.supabase.co}"
JWT_TOKEN="${2:-your_jwt_token_here}"
CANDIDATE_ID="${3:-candidate_id_here}"
APPROVED="${4:-true}"

echo "✅ Testing approveCandidacy Edge Function..."
echo "URL: $SUPABASE_URL/functions/v1/approveCandidacy"
echo "Authorization: Bearer $JWT_TOKEN"
echo "Candidate ID: $CANDIDATE_ID"
echo "Approved: $APPROVED"
echo ""

curl -X POST "$SUPABASE_URL/functions/v1/approveCandidacy" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"candidateId\": \"$CANDIDATE_ID\",
    \"approved\": $APPROVED
  }" \
  --verbose

echo -e "\n\n✅ Test completed!"
echo "Expected response: Candidate approved/rejected with blockchain transaction"