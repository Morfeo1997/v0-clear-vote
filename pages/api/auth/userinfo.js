/**
 * User information endpoint
 * Returns user information based on valid JWT token
 */
import { smartWalletAuth } from '../../../components/smart-wallet/SmartWalletAuth.js';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authorization header with Bearer token is required' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify and decode JWT token
    const decoded = await smartWalletAuth.verifyJWT(token);

    // Return user information (excluding sensitive data)
    const userInfo = {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      active: decoded.active,
      institution: decoded['clear-vote/institution'],
      party: decoded['clear-vote/party'],
      iss: decoded.iss,
      aud: decoded.aud,
      iat: decoded.iat,
      exp: decoded.exp
    };

    res.status(200).json({
      success: true,
      user: userInfo
    });

  } catch (error) {
    console.error('❌ User info error:', error);
    res.status(401).json({ 
      error: 'Invalid or expired token',
      message: error.message 
    });
  }
}
