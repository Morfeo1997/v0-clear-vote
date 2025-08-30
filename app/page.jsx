"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import LandingSection from "@/components/landing-section"
import Home from "@/components/home"
import LoginForm from "@/components/login-form"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState(null) // 'owner', 'votante', 'candidato'
  const [showRegister, setShowRegister] = useState(false)

  const handleLogin = (type) => {
    setIsAuthenticated(true)
    setUserType(type)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserType(null)
    setShowRegister(false)
  }

  const handleShowRegister = () => {
    setShowRegister(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userType={userType}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onShowRegister={handleShowRegister}
      />

      {isAuthenticated ? (
        <div className="pt-16">
          <Home userType={userType} onShowRegister={handleShowRegister} />
        </div>
      ) : (
        <LandingSection />
      )}

      {showRegister && (
        <LoginForm isOpen={showRegister} onClose={() => setShowRegister(false)} defaultToRegister={true} />
      )}
    </div>
  )
}
