"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Vote, Users, Trophy, UserCheck } from "lucide-react"
import ElectionCard from "@/components/home-components/election-card"
import ElectionView from "./election-view"
import CreateElectionForm from "@/components/home-components/create-election-form"
import ResultsPage from "./results-page"

export default function HomePage({ userType, onShowRegister }) {
  const [currentView, setCurrentView] = useState("home") // 'home', 'election', or 'results'
  const [selectedElection, setSelectedElection] = useState(null)
  const [showCreateElection, setShowCreateElection] = useState(false)

  const [elections, setElections] = useState([
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

  const handleElectionClick = (election) => {
    setSelectedElection(election)
    setCurrentView("election")
  }

  const handleBackToHome = () => {
    setCurrentView("home")
    setSelectedElection(null)
  }

  const handleStartElection = () => {
    setShowCreateElection(true)
  }

  const handleCreateElection = (newElection) => {
    setElections((prev) => [...prev, newElection])
  }

  const handleCreateApplication = () => {
    alert("Selecciona una elección específica para postularte desde las tarjetas de elección")
  }

  const handleViewResults = () => {
    setCurrentView("results")
  }

  if (currentView === "election" && selectedElection) {
    return <ElectionView election={selectedElection} userType={userType} onBack={handleBackToHome} />
  }

  if (currentView === "results") {
    return <ResultsPage onBack={handleBackToHome} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Developer Dashboard */}
      {userType === "developer" && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Desarrollo</h1>
            <p className="text-muted-foreground">
              Modo desarrollador - Gestiona todas las funcionalidades y prueba el sistema
            </p>
          </div>
        </>
      )}

      {/* Propietario Dashboard */}
      {userType === "propietario" && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Panel del Propietario</h1>
            <p className="text-muted-foreground">
              Crea elecciones, supervisa el proceso electoral y consulta resultados
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Button onClick={handleStartElection} size="lg" className="px-8 py-3 text-lg font-semibold">
              <Plus className="h-5 w-5 mr-2" />
              Crear Nueva Elección
            </Button>
          </div>

          <div className="flex justify-center mb-8">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Trophy className="h-5 w-5 text-primary" />
                  Ver Resultados
                </CardTitle>
                <CardDescription className="text-center">Consulta los resultados de las elecciones</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button onClick={handleViewResults} variant="outline" className="w-full bg-transparent">
                  <Trophy className="h-4 w-4 mr-2" />
                  Ver Resultados
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Administrador Dashboard */}
      {userType === "administrador" && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona usuarios, supervisa votaciones y consulta resultados</p>
          </div>

          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Gestionar Usuarios
                </CardTitle>
                <CardDescription>Crea y administra cuentas de usuario</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={onShowRegister} className="w-full sm:w-auto">
                  <Users className="h-4 w-4 mr-2" />
                  Crear Usuarios
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Ver Resultados
                </CardTitle>
                <CardDescription>Consulta los resultados de las elecciones</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleViewResults} variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Trophy className="h-4 w-4 mr-2" />
                  Ver Resultados
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Candidato Dashboard */}
      {userType === "candidato" && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Portal del Candidato</h1>
            <p className="text-muted-foreground">
              Postúlate a elecciones, consulta tus candidaturas y ve los resultados
            </p>
          </div>

          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Postularse a Elección
                </CardTitle>
                <CardDescription>Registra tu candidatura para una elección</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleCreateApplication} className="w-full sm:w-auto">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Postularse
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Ver Resultados
                </CardTitle>
                <CardDescription>Consulta los resultados de las elecciones</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleViewResults} variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Trophy className="h-4 w-4 mr-2" />
                  Ver Resultados
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Votante Dashboard */}
      {userType === "votante" && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Portal de Votación</h1>
            <p className="text-muted-foreground">Participa en las elecciones disponibles y consulta los resultados</p>
          </div>

          <div className="mb-6">
            <Button onClick={handleViewResults} variant="outline" className="mb-4 bg-transparent">
              <Trophy className="h-4 w-4 mr-2" />
              Ver Resultados de Elecciones
            </Button>
          </div>
        </>
      )}

      {/* Elections Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Vote className="h-6 w-6 text-primary" />
          {userType === "propietario"
            ? "Elecciones Creadas"
            : userType === "administrador"
              ? "Elecciones Supervisadas"
              : userType === "candidato"
                ? "Elecciones Disponibles"
                : "Elecciones para Votar"}
        </h2>
      </div>

      {/* Elections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {elections.map((election) => (
          <ElectionCard
            key={election.id}
            election={election}
            userType={userType}
            onElectionClick={handleElectionClick}
          />
        ))}
      </div>

      {elections.length === 0 && (
        <div className="text-center py-12">
          <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay elecciones disponibles</h3>
          <p className="text-muted-foreground">
            {userType === "propietario"
              ? "Crea una nueva elección para comenzar"
              : userType === "administrador"
                ? "No hay elecciones para supervisar"
                : "No hay elecciones activas en este momento"}
          </p>
        </div>
      )}

      {showCreateElection && (
        <CreateElectionForm onClose={() => setShowCreateElection(false)} onCreateElection={handleCreateElection} />
      )}
    </div>
  )
}
