#!/bin/bash

# Deploy Edge Functions to Supabase
# Usage: ./deploy-edge-functions.sh [PROJECT_REF] [ACCESS_TOKEN]

PROJECT_REF="${1}"
ACCESS_TOKEN="${2}"

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project reference is required"
    echo "Usage: ./deploy-edge-functions.sh [PROJECT_REF] [ACCESS_TOKEN]"
    echo ""
    echo "📋 To find your PROJECT_REF:"
    echo "   1. Go to https://supabase.com/dashboard"
    echo "   2. Open your project"
    echo "   3. Go to Settings > General"
    echo "   4. Copy the 'Project ID' (looks like: abc123def456ghi789)"
    echo ""
    exit 1
fi

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Access token is required"
    echo "Usage: ./deploy-edge-functions.sh [PROJECT_REF] [ACCESS_TOKEN]"
    echo ""
    echo "📋 To get your ACCESS_TOKEN:"
    echo "   1. Go to https://supabase.com/dashboard/account/tokens"
    echo "   2. Click 'Generate new token'"
    echo "   3. Give it a name like 'Edge Functions Deploy'"
    echo "   4. Copy the generated token"
    echo ""
    exit 1
fi

echo "🚀 Deploying Edge Functions to Supabase..."
echo "📋 Project: $PROJECT_REF"
echo ""

# Set environment variables
export SUPABASE_ACCESS_TOKEN="$ACCESS_TOKEN"

# Link project (if not already linked)
echo "🔗 Linking project..."
npx supabase link --project-ref "$PROJECT_REF"

if [ $? -ne 0 ]; then
    echo "❌ Failed to link project"
    echo "Please check your PROJECT_REF and ACCESS_TOKEN"
    exit 1
fi

echo "✅ Project linked successfully!"
echo ""

# Deploy all functions
echo "📦 Deploying Edge Functions..."
echo ""

echo "1️⃣ Deploying createElection..."
npx supabase functions deploy createElection

echo "2️⃣ Deploying requestCandidacy..."
npx supabase functions deploy requestCandidacy

echo "3️⃣ Deploying approveCandidacy..."
npx supabase functions deploy approveCandidacy

echo "4️⃣ Deploying vote..."
npx supabase functions deploy vote

echo "5️⃣ Deploying getElectionResults..."
npx supabase functions deploy getElectionResults

echo "6️⃣ Deploying pollOnchainEvents..."
npx supabase functions deploy pollOnchainEvents

echo ""
echo "🎉 All Edge Functions deployed successfully!"
echo ""
echo "🔗 Your Edge Functions are now available at:"
echo "   https://$PROJECT_REF.supabase.co/functions/v1/createElection"
echo "   https://$PROJECT_REF.supabase.co/functions/v1/requestCandidacy"
echo "   https://$PROJECT_REF.supabase.co/functions/v1/approveCandidacy"
echo "   https://$PROJECT_REF.supabase.co/functions/v1/vote"
echo "   https://$PROJECT_REF.supabase.co/functions/v1/getElectionResults"
echo "   https://$PROJECT_REF.supabase.co/functions/v1/pollOnchainEvents"
echo ""
echo "✅ Ready to test with deployed smart contract!"