"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Vote } from "lucide-react"
import ElectionCard from "@/components/home-components/election-card"

export default function HomePage({ userType, onShowRegister }) {
  const [elections] = useState([
    {
      id: 1,
      title: "Elección Consejo Estudiantil 2024",
      description: "Votación para elegir representantes del consejo estudiantil para el período académico 2024-2025.",
      status: "active",
      endDate: "2024-03-15",
    },
    {
      id: 2,
      title: "Elección Rector Universidad",
      description: "Proceso electoral para la elección del nuevo rector de la universidad.",
      status: "active",
      endDate: "2024-03-20",
    },
  ])

  const handleStartElection = () => {
    alert("Funcionalidad para iniciar nueva elección en desarrollo")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Owner Dashboard */}
      {userType === "owner" && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona las elecciones y supervisa el proceso electoral</p>
          </div>

          <div className="grid gap-6 mb-8">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Iniciar Nueva Elección
                </CardTitle>
                <CardDescription>Crea y configura un nuevo proceso electoral</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleStartElection} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Elección
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Vote className="h-6 w-6 text-primary" />
              Votaciones Activas
            </h2>
          </div>
        </>
      )}

      {/* Voter/Candidate Dashboard */}
      {(userType === "votante" || userType === "candidato") && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {userType === "votante" ? "Portal de Votación" : "Portal del Candidato"}
            </h1>
            <p className="text-muted-foreground">
              {userType === "votante"
                ? "Participa en las elecciones disponibles"
                : "Consulta las elecciones en las que participas"}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Vote className="h-6 w-6 text-primary" />
              Elecciones Disponibles
            </h2>
          </div>
        </>
      )}

      {/* Elections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {elections.map((election) => (
          <ElectionCard key={election.id} election={election} userType={userType} />
        ))}
      </div>

      {elections.length === 0 && (
        <div className="text-center py-12">
          <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay elecciones disponibles</h3>
          <p className="text-muted-foreground">
            {userType === "owner"
              ? "Crea una nueva elección para comenzar"
              : "No hay elecciones activas en este momento"}
          </p>
        </div>
      )}
    </div>
  )
}
