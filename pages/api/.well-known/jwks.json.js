/**
 * JSON Web Key Set (JWKS) endpoint
 * Required by Alchemy Smart Wallets for JWT signature verification
 * This should be hosted at: /.well-known/jwks.json
 */
import { keyManager } from '../../../utils/keyManager.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get JWKS from key manager
    const jwks = keyManager.getJWKS();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS for JWKS
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    res.status(200).json(jwks);
  } catch (error) {
    console.error('❌ Error generating JWKS:', error);
    res.status(500).json({ 
      error: 'Failed to generate JWKS',
      message: error.message 
    });
  }
}
