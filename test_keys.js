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
