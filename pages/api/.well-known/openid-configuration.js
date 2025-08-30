/**
 * OpenID Connect Discovery endpoint
 * Required by Alchemy Smart Wallets for JWT verification
 * This should be hosted at: /.well-known/openid-configuration
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const issuer = process.env.NEXT_PUBLIC_OIDC_ISSUER || 'https://auth.clear-vote.app';
  const baseUrl = req.headers.host ? `https://${req.headers.host}` : issuer;

  const openidConfig = {
    issuer: issuer,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    id_token_signing_alg_values_supported: ['RS256', 'HS256'],
    authorization_endpoint: `${baseUrl}/auth/authorize`,
    response_types_supported: ['id_token'],
    subject_types_supported: ['public'],
    token_endpoint: `${baseUrl}/auth/token`,
    
    // Additional OpenID Connect standard fields
    userinfo_endpoint: `${baseUrl}/auth/userinfo`,
    registration_endpoint: `${baseUrl}/auth/register`,
    scopes_supported: ['openid', 'profile', 'email'],
    claims_supported: [
      'iss', 'sub', 'aud', 'exp', 'iat', 'nonce',
      'email', 'role', 'active'
    ],
    grant_types_supported: ['authorization_code', 'implicit'],
    response_modes_supported: ['query', 'fragment'],
    
    // Clear Vote specific configuration
    service_documentation: `${baseUrl}/docs/oidc`,
    op_policy_uri: `${baseUrl}/privacy`,
    op_tos_uri: `${baseUrl}/terms`,
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.status(200).json(openidConfig);
}
