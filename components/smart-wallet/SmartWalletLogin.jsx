"use client"

import { useState } from "react";
import { useAuthenticate, useSignerStatus, useUser } from "@account-kit/react";
import { AlchemySignerWebClient } from "@account-kit/signer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wallet, LogOut } from "lucide-react";

export default function SmartWalletLogin({ onLogin, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [authStep, setAuthStep] = useState("credentials"); // "credentials", "wallet", "connected"

  // Alchemy hooks
  const { authenticate, isPending } = useAuthenticate();
  const { isConnected } = useSignerStatus();
  const user = useUser();

  // Initialize Alchemy Signer
  const alchemySigner = new AlchemySignerWebClient({
    connection: {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    },
    iframeConfig: {
      iframeContainerId: "alchemy-signer-iframe",
    },
  });

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Step 1: Generate target public key from Alchemy
      const targetPublicKey = await alchemySigner.targetPublicKey();
      
      if (!targetPublicKey) {
        throw new Error("Error generando clave pública. Intenta de nuevo.");
      }

      console.log("🔑 Target public key generated:", targetPublicKey);

      // Step 2: Authenticate with backend API to get JWT
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          targetPublicKey: targetPublicKey
        }),
      });

      const authResult = await response.json();

      if (!response.ok || !authResult.success) {
        throw new Error(authResult.error || 'Error en la autenticación');
      }

      console.log("✅ JWT token obtained from backend");

      // Step 3: Authenticate with Alchemy using custom JWT
      await authenticate({
        type: "custom-jwt",
        jwt: authResult.jwt
      });

      console.log("✅ Smart Wallet authenticated successfully");
      setAuthStep("connected");
      
      // Call parent login handler
      if (onLogin) {
        onLogin({
          type: authResult.user.role,
          smartWallet: true,
          address: user?.address,
          userData: authResult.user,
          jwt: authResult.jwt
        });
      }

    } catch (err) {
      console.error("❌ Smart Wallet authentication error:", err);
      setError(err.message || "Error en la autenticación con Smart Wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Disconnect from Alchemy
      await alchemySigner.disconnect();
      setAuthStep("credentials");
      setCredentials({ username: "", password: "" });
      setError("");
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  // Show connected state
  if (isConnected && user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-green-600">
            <Wallet className="h-5 w-5" />
            Smart Wallet Conectada
          </CardTitle>
          <CardDescription>Tu billetera inteligente está activa</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Dirección de la billetera:</div>
            <div className="font-mono text-sm bg-white p-2 rounded border break-all">
              {user.address}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-700 mb-1">Email:</div>
            <div className="text-sm font-medium">{user.email}</div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="flex-1"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Desconectar
            </Button>
            <Button
              onClick={onClose}
              className="flex-1"
            >
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Wallet className="h-5 w-5" />
          Smart Wallet Login
        </CardTitle>
        <CardDescription>
          Inicia sesión y conecta tu billetera inteligente
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ 
                ...prev, 
                username: e.target.value 
              }))}
              placeholder="Ingresa tu usuario"
              required
              disabled={isLoading || isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ 
                ...prev, 
                password: e.target.value 
              }))}
              placeholder="Ingresa tu contraseña"
              required
              disabled={isLoading || isPending}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || isPending}
          >
            {(isLoading || isPending) ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {authStep === "credentials" ? "Validando..." : "Conectando Smart Wallet..."}
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Conectar Smart Wallet
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            <p>Se creará automáticamente una billetera inteligente</p>
            <p>segura para tu cuenta</p>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t">
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
