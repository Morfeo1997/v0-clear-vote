#!/bin/bash

# Test script for pollOnchainEvents Edge Function
# Usage: ./test-polling.sh [SUPABASE_URL] [JWT_TOKEN] [ELECTION_ID] [FORCE_SYNC]

SUPABASE_URL="${1:-https://iryqlbksafhjgmtukjny.supabase.co}"
JWT_TOKEN="${2:-your_jwt_token_here}"
ELECTION_ID="${3:-}"
FORCE_SYNC="${4:-false}"

echo "🔄 Testing pollOnchainEvents Edge Function..."
echo "URL: $SUPABASE_URL/functions/v1/pollOnchainEvents"
echo "Authorization: Bearer $JWT_TOKEN"

if [ -n "$ELECTION_ID" ]; then
    echo "Election ID: $ELECTION_ID"
    URL_PARAMS="?electionId=$ELECTION_ID&forceSync=$FORCE_SYNC"
else
    echo "Syncing all elections"
    URL_PARAMS="?forceSync=$FORCE_SYNC"
fi

echo "Force Sync: $FORCE_SYNC"
echo ""

curl -X POST "$SUPABASE_URL/functions/v1/pollOnchainEvents$URL_PARAMS" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  --verbose

echo -e "\n\n✅ Test completed!"
echo "Expected response: Events synchronized from blockchain"
