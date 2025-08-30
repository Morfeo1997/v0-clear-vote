/**
 * RSA Key Management for Smart Wallet Authentication
 * Generates and manages RSA key pairs for JWT signing/verification
 */

import NodeRSA from 'node-rsa';
import fs from 'fs';
import path from 'path';

class KeyManager {
  constructor() {
    this.keyDir = path.join(process.cwd(), 'keys');
    this.privateKeyPath = path.join(this.keyDir, 'private.pem');
    this.publicKeyPath = path.join(this.keyDir, 'public.pem');
    this.keyId = 'clear-vote-key-1';
  }

  /**
   * Ensures keys directory exists
   */
  ensureKeysDirectory() {
    if (!fs.existsSync(this.keyDir)) {
      fs.mkdirSync(this.keyDir, { recursive: true });
    }
  }

  /**
   * Generates a new RSA key pair
   */
  generateKeyPair() {
    const key = new NodeRSA({ b: 2048 });
    
    this.ensureKeysDirectory();
    
    // Save private key
    const privateKey = key.exportKey('private');
    fs.writeFileSync(this.privateKeyPath, privateKey);
    
    // Save public key
    const publicKey = key.exportKey('public');
    fs.writeFileSync(this.publicKeyPath, publicKey);
    
    console.log('✅ New RSA key pair generated and saved');
    return { privateKey, publicKey };
  }

  /**
   * Loads existing keys or generates new ones
   */
  getKeys() {
    try {
      if (fs.existsSync(this.privateKeyPath) && fs.existsSync(this.publicKeyPath)) {
        const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
        const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
        return { privateKey, publicKey };
      } else {
        console.log('🔄 No keys found, generating new RSA key pair...');
        return this.generateKeyPair();
      }
    } catch (error) {
      console.error('❌ Error loading keys, generating new ones:', error);
      return this.generateKeyPair();
    }
  }

  /**
   * Gets private key for JWT signing
   */
  getPrivateKey() {
    const { privateKey } = this.getKeys();
    return privateKey;
  }

  /**
   * Gets public key for JWT verification
   */
  getPublicKey() {
    const { publicKey } = this.getKeys();
    return publicKey;
  }

  /**
   * Converts RSA public key to JWKS format
   */
  getJWKS() {
    const { publicKey } = this.getKeys();
    
    try {
      const key = new NodeRSA(publicKey);
      const publicKeyComponents = key.exportKey('components-public');
      
      // Convert modulus (n) to base64url encoding
      const n = Buffer.from(publicKeyComponents.n).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      // Convert exponent (e) to base64url encoding
      // Handle the case where e might be a number (usually 65537)
      let eBuffer;
      if (typeof publicKeyComponents.e === 'number') {
        // Convert number to buffer
        const eArray = [];
        let num = publicKeyComponents.e;
        while (num > 0) {
          eArray.unshift(num & 0xFF);
          num = num >> 8;
        }
        eBuffer = Buffer.from(eArray);
      } else if (Buffer.isBuffer(publicKeyComponents.e)) {
        eBuffer = publicKeyComponents.e;
      } else {
        eBuffer = Buffer.from(publicKeyComponents.e);
      }
      
      const e = eBuffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      return {
        keys: [
          {
            kty: 'RSA',
            use: 'sig',
            kid: this.keyId,
            alg: 'RS256',
            n: n,
            e: e
          }
        ]
      };
    } catch (error) {
      console.error('❌ Error generating JWKS:', error);
      throw new Error('Failed to generate JWKS');
    }
  }

  /**
   * Gets the key ID for JWT header
   */
  getKeyId() {
    return this.keyId;
  }
}

export const keyManager = new KeyManager();
