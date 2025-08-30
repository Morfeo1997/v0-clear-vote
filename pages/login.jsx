"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LoginPage({ isOpen, onClose, onLogin, defaultToRegister = false }) {
  const [isLogin, setIsLogin] = useState(!defaultToRegister)
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nombre: "",
    apellido: "",
    rol: "",
    email: "",
    dni: "",
    institucion: "",
    partido: "",
    confirmPassword: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    // Simulación de login de admin
    if (formData.username === "admin" && formData.password === "admin") {
      setIsAdmin(true)
      if (onLogin) onLogin("owner")
      onClose()
      alert("Bienvenido Administrador")
    } else if (formData.username === "votante" && formData.password === "123") {
      if (onLogin) onLogin("votante")
      onClose()
      alert("Bienvenido Votante")
    } else if (formData.username === "candidato" && formData.password === "123") {
      if (onLogin) onLogin("candidato")
      onClose()
      alert("Bienvenido Candidato")
    } else {
      alert("Credenciales incorrectas")
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    alert("Usuario registrado exitosamente")
    setIsLogin(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            {isLogin ? "Iniciar Sesión" : "Registro de Usuario"}
          </CardTitle>
          <CardDescription>{isLogin ? "Accede a tu cuenta de votación" : "Crea una nueva cuenta"}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => alert("Funcionalidad en desarrollo")}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {isAdmin && (
                <div className="pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setIsLogin(false)}
                  >
                    Registrar Nuevo Usuario
                  </Button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange("apellido", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Select onValueChange={(value) => handleInputChange("rol", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="votante">Votante</SelectItem>
                    <SelectItem value="candidato">Candidato</SelectItem>
                    <SelectItem value="propietario">Propietario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dni">Documento de Identidad (DNI)</Label>
                <Input
                  id="dni"
                  type="text"
                  value={formData.dni}
                  onChange={(e) => handleInputChange("dni", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institucion">Institución</Label>
                <Input
                  id="institucion"
                  type="text"
                  value={formData.institucion}
                  onChange={(e) => handleInputChange("institucion", e.target.value)}
                  required
                />
              </div>

              {formData.rol === "candidato" && (
                <div className="space-y-2">
                  <Label htmlFor="partido">Partido</Label>
                  <Input
                    id="partido"
                    type="text"
                    value={formData.partido}
                    onChange={(e) => handleInputChange("partido", e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setIsLogin(true)}
                >
                  Volver
                </Button>
                <Button type="submit" className="flex-1">
                  Registrar
                </Button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t">
            <Button type="button" variant="ghost" className="w-full" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
