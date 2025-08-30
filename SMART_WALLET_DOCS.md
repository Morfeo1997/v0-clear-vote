# Smart Wallet Authentication Implementation

This implementation provides "Bring Your Own Auth" integration with Alchemy Smart Wallets using JWT tokens and OpenID Connect (OIDC) compliance.

## Architecture Overview

```
User Login Flow:
1. User enters credentials → Frontend
2. Generate target public key → Alchemy Signer
3. Create JWT with nonce → Backend API
4. Authenticate with JWT → Alchemy Account Kit
5. Smart Wallet ready → User can perform blockchain operations
```

## Components

### 1. Key Management (`utils/keyManager.js`)

Handles RSA key pair generation and management for JWT signing:

- **Auto-generates** RSA 2048-bit key pairs
- **Stores keys** in `keys/` directory (add to .gitignore)
- **Provides JWKS** format for public key sharing
- **Thread-safe** key access and management

### 2. Authentication Service (`components/smart-wallet/SmartWalletAuth.js`)

Core authentication logic:

- **User validation** (replace with your database)
- **JWT creation** with proper RS256 signing
- **Nonce generation** from Alchemy target public key
- **Token verification** for server-side validation

### 3. OIDC Endpoints (`pages/api/.well-known/`)

Required by Alchemy for JWT verification:

- **`openid-configuration.js`**: OIDC discovery endpoint
- **`jwks.json.js`**: JSON Web Key Set for public keys

### 4. Auth API Endpoints (`pages/api/auth/`)

RESTful API for authentication:

- **`login.js`**: Validates credentials and returns JWT
- **`verify.js`**: Verifies JWT token validity
- **`userinfo.js`**: Returns user information from valid JWT

### 5. React Components

- **`AlchemyProvider.jsx`**: Configures Alchemy Account Kit
- **`SmartWalletLogin.jsx`**: Login UI with Smart Wallet integration

## Environment Configuration

Create `.env.local` with the following variables:

```bash
# Alchemy Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_OIDC_ISSUER=https://your-domain.com
NEXT_PUBLIC_SMART_WALLET_AUDIENCE_ID=your_alchemy_audience_id_here

# Chain Configuration
CHAIN_ID=80002  # Polygon Amoy testnet

# JWT Secret (fallback, RSA keys preferred)
JWT_SECRET=your_super_secret_key_here
```

## Alchemy Dashboard Setup

1. **Create Account Kit App** in [Alchemy Dashboard](https://dashboard.alchemy.com)
2. **Get API Key** from your app settings
3. **Configure Authentication**:
   - Mode: "Bring Your Own Auth"
   - JWT Issuer: `https://your-domain.com`
   - JWKS URI: `https://your-domain.com/.well-known/jwks.json`
   - Audience ID: Copy this to your env vars

## JWT Token Structure

### Header
```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "clear-vote-key-1"
}
```

### Payload
```json
{
  "iss": "https://your-domain.com",
  "sub": "user123",
  "aud": "your-alchemy-audience-id",
  "nonce": "sha256_hash_of_target_public_key",
  "iat": 1640995200,
  "exp": 1641081600,
  "email": "user@example.com",
  "role": "votante",
  "clear-vote/user_id": 123,
  "clear-vote/institution": "Universidad Nacional"
}
```

## Security Features

### 1. RSA Key Pairs
- **2048-bit RSA keys** for production security
- **Automatic key generation** if not present
- **Public key sharing** via JWKS endpoint

### 2. JWT Security
- **RS256 algorithm** (required by Alchemy)
- **Short token lifetime** (24 hours)
- **Proper nonce generation** with target public key

### 3. CORS Configuration
- **Proper CORS headers** for OIDC endpoints
- **Secure key exposure** only via JWKS format

## Testing

### 1. Test OIDC Endpoints

```bash
# Test discovery endpoint
curl https://your-domain.com/.well-known/openid-configuration

# Test JWKS endpoint
curl https://your-domain.com/.well-known/jwks.json
```

### 2. Test Authentication API

```bash
# Test login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "votante",
    "password": "vot123",
    "targetPublicKey": "0x1234..."
  }'

# Test token verification
curl -X POST https://your-domain.com/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"token": "eyJ..."}'
```

### 3. Validate JWT Structure

Use [jwt.io](https://jwt.io/) to decode and validate your JWT tokens.

## Production Deployment

### 1. Security Checklist

- [ ] **Keys directory** in .gitignore
- [ ] **HTTPS only** for all endpoints
- [ ] **Environment variables** properly set
- [ ] **RSA keys** backed up securely
- [ ] **CORS** configured for your domain only

### 2. Monitoring

- **JWT creation errors** in server logs
- **Authentication failures** in frontend
- **Key generation** success/failure
- **OIDC endpoint** availability

### 3. Backup Strategy

- **RSA keys**: Backup private keys securely
- **User data**: Implement proper user database
- **Configuration**: Document environment setup

## Integration with Clear Vote

### Smart Wallet in Elections

1. **Voter Authentication**: Users log in with existing credentials
2. **Automatic Wallet Creation**: Smart wallet created transparently
3. **Gas-Free Voting**: Use Alchemy's gas sponsorship
4. **Transparent Operations**: All votes recorded on-chain

### User Roles

- **`votante`**: Can cast votes with Smart Wallet
- **`candidato`**: Can register candidacy and vote
- **`administrador`**: Can create elections and manage system
- **`propietario`**: Full system control

## Troubleshooting

### Common Issues

1. **"Invalid JWT"**: Check nonce generation and key signing
2. **"Key not found"**: Ensure JWKS endpoint is accessible
3. **"Authentication failed"**: Verify Alchemy audience ID
4. **"CORS error"**: Check OIDC endpoint CORS headers

### Debug Steps

1. **Check logs** for JWT creation/verification errors
2. **Validate OIDC** endpoints are accessible
3. **Test JWKS** format with online validators
4. **Verify audience ID** matches Alchemy dashboard

## Next Steps

1. **Replace mock user database** with real user system
2. **Implement gas sponsorship** for free transactions
3. **Add session management** for better UX
4. **Set up monitoring** and alerting
5. **Create user management** interface

## Resources

- [Alchemy Account Kit Docs](https://www.alchemy.com/docs/wallets)
- [OpenID Connect Specification](https://openid.net/specs/openid-connect-core-1_0.html)
- [JWT.io Token Debugger](https://jwt.io/)
- [JWKS Format Reference](https://tools.ietf.org/html/rfc7517)
