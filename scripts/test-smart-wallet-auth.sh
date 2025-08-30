#!/bin/bash

# Smart Wallet Authentication Test Script
# Tests the complete authentication flow

echo "🧪 Testing Smart Wallet Authentication Implementation"
echo "=================================================="

# Set base URL (change this to your deployment URL)
BASE_URL="http://localhost:3000"

echo ""
echo "1. Testing OIDC Discovery Endpoint..."
echo "-------------------------------------"
curl -s "${BASE_URL}/.well-known/openid-configuration" | jq '.' || echo "❌ OIDC Discovery failed"

echo ""
echo "2. Testing JWKS Endpoint..."
echo "---------------------------"
curl -s "${BASE_URL}/.well-known/jwks.json" | jq '.' || echo "❌ JWKS endpoint failed"

echo ""
echo "3. Testing Authentication API..."
echo "--------------------------------"

# Generate a mock target public key for testing
MOCK_TARGET_KEY="0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# Test login endpoint
echo "Testing login with valid credentials..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"votante\",
    \"password\": \"vot123\",
    \"targetPublicKey\": \"${MOCK_TARGET_KEY}\"
  }")

echo $LOGIN_RESPONSE | jq '.' || echo "❌ Login API failed"

# Extract JWT token if login was successful
JWT_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.jwt // empty')

if [ ! -z "$JWT_TOKEN" ] && [ "$JWT_TOKEN" != "null" ]; then
  echo "✅ JWT Token obtained successfully"
  
  echo ""
  echo "4. Testing Token Verification..."
  echo "-------------------------------"
  curl -s -X POST "${BASE_URL}/api/auth/verify" \
    -H "Content-Type: application/json" \
    -d "{\"token\": \"${JWT_TOKEN}\"}" | jq '.' || echo "❌ Token verification failed"
  
  echo ""
  echo "5. Testing User Info Endpoint..."
  echo "-------------------------------"
  curl -s -X GET "${BASE_URL}/api/auth/userinfo" \
    -H "Authorization: Bearer ${JWT_TOKEN}" | jq '.' || echo "❌ User info failed"
else
  echo "❌ No JWT token received, skipping token tests"
fi

echo ""
echo "6. Testing Invalid Credentials..."
echo "--------------------------------"
curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"invalid\",
    \"password\": \"wrong\",
    \"targetPublicKey\": \"${MOCK_TARGET_KEY}\"
  }" | jq '.' || echo "❌ Invalid credentials test failed"

echo ""
echo "🏁 Test completed!"
echo "Check the output above for any ❌ failures"
echo ""
echo "Next steps:"
echo "- If tests pass, your Smart Wallet auth is ready"
echo "- Update your .env.local with proper Alchemy credentials"
echo "- Configure your domain in Alchemy Dashboard"
echo "- Replace mock users with real database integration"
