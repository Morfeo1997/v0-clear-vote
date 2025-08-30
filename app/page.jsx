"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import LandingSection from "@/components/landing-section"
import HomePage from "@/pages/home"
import LoginPage from "@/pages/login"
import { SmartWalletProvider } from "@/components/smart-wallet/AlchemyProvider"

export default function MainPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState(null) // 'propietario', 'votante', 'candidato', 'developer', 'administrador'
  const [showRegister, setShowRegister] = useState(false)

  const handleLogin = (loginData) => {
    // Handle navigation requests from navbar
    if (typeof loginData === "object" && loginData.type === "viewResults") {
      // This will be handled by HomePage component
      return
    }

    // Handle regular login and Smart Wallet login
    setIsAuthenticated(true)
    
    // For Smart Wallet login, loginData will be an object with additional properties
    if (typeof loginData === "object" && loginData.smartWallet) {
      setUserType(loginData.type)
      console.log("Smart Wallet connected:", {
        address: loginData.address,
        user: loginData.userData
      })
    } else {
      // Traditional login - loginData is just the user type string
      setUserType(loginData)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserType(null)
    setShowRegister(false)
  }

  const handleShowRegister = () => {
    setShowRegister(true)
  }

  const handleRoleChange = (newRole) => {
    setUserType(newRole)
  }

  return (
    <SmartWalletProvider>
      <div className="min-h-screen bg-background">
        <Navbar
          userType={userType}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onShowRegister={handleShowRegister}
          onLogin={handleLogin}
        />

        {isAuthenticated ? (
          <div className="pt-16">
            <HomePage userType={userType} onShowRegister={handleShowRegister} />
          </div>
        ) : (
          <LandingSection />
        )}

        {showRegister && (
          <LoginPage
            isOpen={showRegister}
            onClose={() => setShowRegister(false)}
            onLogin={handleLogin}
            defaultToRegister={true}
          />
        )}

        {userType === "developer" && (
          <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-black p-2 text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="font-semibold">Modo Developer:</span>
              <select
                value={userType}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="px-2 py-1 rounded bg-white text-black"
              >
                <option value="developer">Developer</option>
                <option value="propietario">Propietario</option>
                <option value="administrador">Administrador</option>
                <option value="votante">Votante</option>
                <option value="candidato">Candidato</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </SmartWalletProvider>
  )
}
