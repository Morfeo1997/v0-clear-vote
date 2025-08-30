#!/bin/bash

# Setup script for Supabase Environment Variables
# Updates Supabase Edge Functions with deployed contract information

echo "🔧 Setting up Supabase Environment Variables..."
echo ""

# Contract deployment info
CONTRACT_ADDRESS="0x88Cf938baf924Fb0DA22f4d56679f6d00fa44E48"
ALCHEMY_RPC_URL="https://polygon-amoy.g.alchemy.com/v2/ZluJ7pXTyZSeM19sInGA4"
CHAIN_ID="80002"
PRIVATE_KEY_OWNER="1374ce70e5a0af652f8ecd39e2f11143ac357834395719744b309311d16b6da6"
JWT_SECRET="nY74CZx+pgU2AlmcfeXGoV9tJzcg7lnqGmLirmysOP3HcuetylCxUDdLw2YKreno2ijkfMvNphSBK0KMVAPIag=="
ADMIN_EMAIL="pablo.gallar@gmail.com"

echo "📋 Deployment Information:"
echo "   Contract Address: $CONTRACT_ADDRESS"
echo "   Network: Polygon Amoy (Chain ID: $CHAIN_ID)"
echo "   RPC URL: $ALCHEMY_RPC_URL"
echo "   Admin Email: $ADMIN_EMAIL"
echo ""

echo "🚀 Required Supabase Edge Function Environment Variables:"
echo ""
echo "Go to your Supabase Dashboard > Settings > Edge Functions > Environment Variables"
echo "Add the following variables:"
echo ""
echo "ALCHEMY_RPC_URL=$ALCHEMY_RPC_URL"
echo "CHAIN_ID=$CHAIN_ID"
echo "CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
echo "PRIVATE_KEY_OWNER=$PRIVATE_KEY_OWNER"
echo "JWT_SECRET=$JWT_SECRET"
echo "ADMIN_EMAIL=$ADMIN_EMAIL"
echo ""

echo "⚠️  SECURITY NOTE:"
echo "   - These variables are automatically available to your Edge Functions"
echo "   - PRIVATE_KEY_OWNER should be kept secure"
echo "   - JWT_SECRET should be kept secure"
echo ""

echo "🔗 Useful Links:"
echo "   Contract Explorer: https://amoy.polygonscan.com/address/$CONTRACT_ADDRESS"
echo "   Supabase Dashboard: https://supabase.com/dashboard"
echo "   Polygon Amoy Faucet: https://faucet.polygon.technology/"
echo ""

echo "✅ Environment setup information ready!"
echo "Please manually add these variables to your Supabase Dashboard."