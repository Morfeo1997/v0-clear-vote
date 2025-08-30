import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { keyManager } from '../../utils/keyManager.js';

/**
 * Generates a JWT token compatible with Alchemy Smart Wallets
 * This implements the "Bring Your Own Auth" pattern with proper RS256 signing
 */
export class SmartWalletAuthService {
  constructor() {
    this.issuer = process.env.NEXT_PUBLIC_OIDC_ISSUER || 'https://auth.clear-vote.app';
    this.audience = process.env.NEXT_PUBLIC_SMART_WALLET_AUDIENCE_ID || 'clear-vote-app';
  }

  /**
   * Generates target public key hash (nonce) required by Alchemy
   * @param {string} targetPublicKey - The target public key from Alchemy Signer
   * @returns {string} The hex-encoded SHA256 hash without 0x prefix
   */
  generateNonce(targetPublicKey) {
    if (!targetPublicKey) {
      throw new Error('Target public key is required');
    }
    
    // Remove 0x prefix if present
    const cleanKey = targetPublicKey.startsWith('0x') ? targetPublicKey.slice(2) : targetPublicKey;
    
    // Generate SHA256 hash using Buffer (Node.js environment)
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(cleanKey, 'hex').digest('hex');
    
    return hash;
  }

  /**
   * Creates a JWT token for Smart Wallet authentication with proper RS256 signing
   * @param {Object} user - User object from your system
   * @param {string} targetPublicKey - Target public key from Alchemy Signer
   * @returns {string} JWT token
   */
  async createSmartWalletJWT(user, targetPublicKey) {
    if (!user || !targetPublicKey) {
      throw new Error('User and target public key are required');
    }

    const now = Math.floor(Date.now() / 1000);
    const nonce = this.generateNonce(targetPublicKey);

    // JWT Payload with required claims for Alchemy
    const payload = {
      iss: this.issuer, // Your auth provider domain (must match OIDC config)
      sub: user.id.toString(), // Unique user identifier
      aud: this.audience, // Alchemy-provided audience ID
      iat: now, // Issued at
      exp: now + (24 * 60 * 60), // Expires in 24 hours
      nonce: nonce, // Required: SHA256 hash of target public key (without 0x)
      
      // Additional claims for your application
      email: user.email,
      role: user.role || 'votante',
      active: user.is_active || true,
      
      // Custom claims for Clear Vote (namespaced to avoid conflicts)
      'clear-vote/user_id': user.id,
      'clear-vote/institution': user.institucion,
      'clear-vote/party': user.partido || null,
    };

    try {
      // Get private key for signing
      const privateKey = keyManager.getPrivateKey();
      const keyId = keyManager.getKeyId();

      // Sign JWT with RS256 algorithm
      const token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        keyid: keyId, // Key identifier for JWKS endpoint
        header: {
          alg: 'RS256',
          typ: 'JWT',
          kid: keyId
        }
      });

      console.log('✅ Smart Wallet JWT created successfully');
      return token;

    } catch (error) {
      console.error('❌ Error creating Smart Wallet JWT:', error);
      throw new Error('Failed to create JWT token');
    }
  }

  /**
   * Validates a user and returns user data for JWT creation
   * In production, this should connect to your actual user database
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Object|null} User object or null if invalid
   */
  async validateUser(username, password) {
    // Mock user database - replace with your actual user validation
    const mockUsers = {
      'developer': { 
        id: 1, 
        email: 'developer@clear-vote.app', 
        role: 'developer', 
        is_active: true, 
        institucion: 'Clear Vote Dev' 
      },
      'propietario': { 
        id: 2, 
        email: 'propietario@clear-vote.app', 
        role: 'propietario', 
        is_active: true, 
        institucion: 'Clear Vote Admin' 
      },
      'admin': { 
        id: 3, 
        email: 'admin@clear-vote.app', 
        role: 'administrador', 
        is_active: true, 
        institucion: 'Clear Vote' 
      },
      'votante': { 
        id: 4, 
        email: 'votante@clear-vote.app', 
        role: 'votante', 
        is_active: true, 
        institucion: 'Universidad Nacional' 
      },
      'candidato': { 
        id: 5, 
        email: 'candidato@clear-vote.app', 
        role: 'candidato', 
        is_active: true, 
        institucion: 'Universidad Nacional', 
        partido: 'Partido Demo' 
      }
    };

    const passwords = {
      'developer': 'dev',
      'propietario': 'prop123',
      'admin': 'admin123',
      'votante': 'vot123',
      'candidato': 'can123'
    };

    if (mockUsers[username] && passwords[username] === password) {
      return mockUsers[username];
    }

    return null;
  }

  /**
   * Verifies a JWT token (for server-side validation)
   * @param {string} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  async verifyJWT(token) {
    try {
      const publicKey = keyManager.getPublicKey();
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        issuer: this.issuer,
        audience: this.audience
      });

      return decoded;
    } catch (error) {
      console.error('❌ JWT verification failed:', error);
      throw new Error('Invalid or expired token');
    }
  }
}

export const smartWalletAuth = new SmartWalletAuthService();
