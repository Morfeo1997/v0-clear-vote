"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import LoginPage from "@/pages/login"

export default function Navbar({ userType, isAuthenticated, onLogout, onShowRegister, onLogin }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleLogout = () => {
    onLogout()
    setIsLoginOpen(false)
  }

  const handleLogin = (type) => {
    if (onLogin) onLogin(type)
    setIsLoginOpen(false)
  }

  const handleViewResults = () => {
    if (onLogin) onLogin({ type: "viewResults" })
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90 font-semibold text-lg">
                🗳️ Clear-Vote
              </Button>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {userType === "developer" && (
                    <>
                      <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                        Home
                      </Button>
                      <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">DEV</span>
                    </>
                  )}

                  {userType === "propietario" && (
                    <>
                      <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                        Home
                      </Button>
                      <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                        Crear Elecciones
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-primary-foreground hover:bg-primary/90"
                        onClick={handleViewResults}
                      >
                        Ver Resultados
                      </Button>
                    </>
                  )}

                  {userType === "administrador" && (
                    <>
                      <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                        Home
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium"
                        onClick={onShowRegister}
                      >
                        Crear Usuarios
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-primary-foreground hover:bg-primary/90"
                        onClick={handleViewResults}
                      >
                        Ver Resultados
                      </Button>
                    </>
                  )}

                  {userType === "candidato" && (
                    <>
                      <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                        Home
                      </Button>
                      <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                        Mis Postulaciones
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-primary-foreground hover:bg-primary/90"
                        onClick={handleViewResults}
                      >
                        Ver Resultados
                      </Button>
                    </>
                  )}

                  {userType === "votante" && (
                    <>
                      <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                        Home
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-primary-foreground hover:bg-primary/90"
                        onClick={handleViewResults}
                      >
                        Ver Resultados
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginPage isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
    </>
  )
}
