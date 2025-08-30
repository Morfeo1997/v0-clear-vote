/**
 * JWT token verification endpoint
 * Verifies and returns decoded JWT token information
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
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        error: 'JWT token is required' 
      });
    }

    // Verify JWT token
    const decoded = await smartWalletAuth.verifyJWT(token);

    res.status(200).json({
      success: true,
      valid: true,
      payload: decoded
    });

  } catch (error) {
    console.error('❌ Token verification error:', error);
    res.status(401).json({ 
      success: false,
      valid: false,
      error: 'Invalid or expired token',
      message: error.message 
    });
  }
}
