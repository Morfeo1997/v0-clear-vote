"use client"

import { createConfig } from "@account-kit/react";
import { polygon, polygonAmoy } from "@account-kit/react/chains";
import { AlchemyAccountProvider } from "@account-kit/react";

// Create the configuration for Alchemy Smart Wallets
const alchemyConfig = createConfig({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  chain: process.env.CHAIN_ID === "137" ? polygon : polygonAmoy,
  ssr: true, // Enable server-side rendering support
  enablePopupOauth: true, // Enable popup-based OAuth
  signerConnection: {
    iframeConfig: {
      iframeContainerId: "alchemy-signer-iframe",
    },
  },
  // Configure for "Bring Your Own Auth" with JWT
  auth: {
    mode: "jwt", // Use JWT authentication mode
    jwtAuth: {
      // Your OIDC issuer (must match the 'iss' claim in your JWTs)
      issuer: process.env.NEXT_PUBLIC_OIDC_ISSUER || 'https://auth.clear-vote.app',
      // Your Alchemy-provided audience ID
      audience: process.env.NEXT_PUBLIC_SMART_WALLET_AUDIENCE_ID || 'clear-vote-app',
      // JWKS endpoint for public key verification
      jwksUri: `${process.env.NEXT_PUBLIC_OIDC_ISSUER || 'https://auth.clear-vote.app'}/.well-known/jwks.json`,
    }
  },
});

export function SmartWalletProvider({ children }) {
  return (
    <AlchemyAccountProvider config={alchemyConfig} queryClient={undefined}>
      {children}
      {/* Hidden iframe container for Alchemy Signer */}
      <div id="alchemy-signer-iframe" style={{ display: "none" }} />
    </AlchemyAccountProvider>
  );
}

export { alchemyConfig };
