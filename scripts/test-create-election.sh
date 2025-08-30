#!/bin/bash

# Test script for createElection Edge Function
# Usage: ./test-create-election.sh [SUPABASE_URL] [JWT_TOKEN]

SUPABASE_URL="${1}"
JWT_TOKEN="${2}"

if [ -z "$SUPABASE_URL" ]; then
    echo "❌ Supabase URL is required"
    echo "Usage: ./test-create-election.sh [SUPABASE_URL] [JWT_TOKEN]"
    echo ""
    echo "📋 Example:"
    echo "   ./test-create-election.sh https://yourproject.supabase.co your_jwt_token"
    echo ""
    exit 1
fi

if [ -z "$JWT_TOKEN" ]; then
    echo "❌ JWT Token is required"
    echo "Usage: ./test-create-election.sh [SUPABASE_URL] [JWT_TOKEN]"
    echo ""
    echo "📋 Get your JWT token from your frontend login or generate one manually"
    echo ""
    exit 1
fi

echo "🗳️  Testing createElection Edge Function with deployed contract..."
echo "📋 Contract: 0x88Cf938baf924Fb0DA22f4d56679f6d00fa44E48"
echo "🌐 Network: Polygon Amoy (80002)"
echo "URL: $SUPABASE_URL/functions/v1/createElection"
echo ""

# Use future dates for the test
TOMORROW=$(date -d "+1 day" -u +"%Y-%m-%dT%H:%M:%SZ")
WEEK_LATER=$(date -d "+7 days" -u +"%Y-%m-%dT%H:%M:%SZ")
CANDIDACY_END=$(date -d "+6 hours" -u +"%Y-%m-%dT%H:%M:%SZ")

curl -X POST "$SUPABASE_URL/functions/v1/createElection" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Integration Test Election $(date +%Y%m%d_%H%M%S)\",
    \"description\": \"Testing with deployed contract 0x88Cf938baf924Fb0DA22f4d56679f6d00fa44E48\",
    \"startDate\": \"$TOMORROW\",
    \"endDate\": \"$WEEK_LATER\",
    \"candidacyStart\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
    \"candidacyEnd\": \"$CANDIDACY_END\",
    \"maxCandidatesPerParty\": 3
  }" \
  --verbose

echo -e "\n\n✅ Test completed!"
echo "Expected response: Election created with on-chain transaction hash"
echo "🔗 Check transaction on: https://amoy.polygonscan.com/"
