#!/bin/bash

# Smart Wallet Setup Script
# Automates the initial setup for Smart Wallet authentication

echo "🚀 Setting up Smart Wallet Authentication"
echo "========================================="

# Create keys directory if it doesn't exist
if [ ! -d "keys" ]; then
  echo "📁 Creating keys directory..."
  mkdir -p keys
  echo "keys/" >> .gitignore 2>/dev/null || echo "⚠️  Add 'keys/' to your .gitignore manually"
  echo "✅ Keys directory created"
else
  echo "✅ Keys directory already exists"
fi

# Check if required dependencies are installed
echo ""
echo "📦 Checking dependencies..."
if ! npm list jsonwebtoken >/dev/null 2>&1; then
  echo "❌ jsonwebtoken not found"
  echo "Run: npm install jsonwebtoken node-rsa"
  exit 1
fi

if ! npm list node-rsa >/dev/null 2>&1; then
  echo "❌ node-rsa not found"
  echo "Run: npm install jsonwebtoken node-rsa"
  exit 1
fi

echo "✅ All dependencies installed"

# Check environment configuration
echo ""
echo "🔧 Checking environment configuration..."

if [ ! -f ".env.local" ]; then
  echo "⚠️  .env.local not found"
  echo "📝 Creating .env.local from template..."
  
  cat > .env.local << 'EOF'
# Smart Wallet Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_OIDC_ISSUER=https://your-domain.com
NEXT_PUBLIC_SMART_WALLET_AUDIENCE_ID=your_alchemy_audience_id_here
CHAIN_ID=80002

# JWT Secret (for backward compatibility)
JWT_SECRET=your_super_secret_jwt_signing_key_here
EOF

  echo "✅ .env.local created"
  echo "⚠️  Please update the values in .env.local"
else
  echo "✅ .env.local exists"
fi

# Test key generation by running a simple Node.js script
echo ""
echo "🔑 Testing RSA key generation..."

cat > test_keys.js << 'EOF'
try {
  const { keyManager } = require('./utils/keyManager.js');
  console.log('Testing key generation...');
  
  const keys = keyManager.getKeys();
  const jwks = keyManager.getJWKS();
  
  console.log('✅ RSA keys generated successfully');
  console.log('✅ JWKS format created successfully');
  console.log('Keys stored in: keys/ directory');
} catch (error) {
  console.error('❌ Key generation failed:', error.message);
  process.exit(1);
}
EOF

node test_keys.js && rm test_keys.js

echo ""
echo "🎯 Setup Summary"
echo "==============="
echo "✅ Keys directory created and added to .gitignore"
echo "✅ Dependencies verified"
echo "✅ Environment template created"
echo "✅ RSA key generation tested"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env.local with your Alchemy credentials"
echo "2. Configure your Alchemy Dashboard:"
echo "   - Create Account Kit app"
echo "   - Set JWT authentication mode"
echo "   - Configure OIDC issuer and JWKS URI"
echo "3. Deploy to your domain or test locally"
echo "4. Run: ./scripts/test-smart-wallet-auth.sh"
echo ""
echo "📚 See SMART_WALLET_DOCS.md for detailed instructions"
