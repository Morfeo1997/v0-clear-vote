/**
 * User authentication endpoint
 * Validates user credentials and returns a JWT token for Smart Wallet authentication
 */
import { smartWalletAuth } from '../../../components/smart-wallet/SmartWalletAuth.js';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password, targetPublicKey } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    if (!targetPublicKey) {
      return res.status(400).json({ 
        error: 'Target public key is required for Smart Wallet authentication' 
      });
    }

    // Validate user credentials
    const user = await smartWalletAuth.validateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Generate JWT token for Smart Wallet
    const jwt = await smartWalletAuth.createSmartWalletJWT(user, targetPublicKey);

    res.status(200).json({
      success: true,
      jwt: jwt,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        institution: user.institucion
      }
    });

  } catch (error) {
    console.error('❌ Authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
}
