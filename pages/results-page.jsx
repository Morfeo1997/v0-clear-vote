"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3 } from "lucide-react"
import ResultsCard from "@/components/results-components/results-card"
import ResultsChart from "@/components/results-components/results-chart"

export default function ResultsPage({ onBack }) {
  const [currentView, setCurrentView] = useState("list") // 'list' or 'chart'
  const [selectedElection, setSelectedElection] = useState(null)

  const [electionsWithResults] = useState([
    {
      id: 1,
      title: "Elección Consejo Estudiantil 2024",
      description: "Votación para elegir representantes del consejo estudiantil para el período académico 2024-2025.",
      status: "completed",
      endDate: "2024-03-15",
      totalVotes: 580,
    },
    {
      id: 2,
      title: "Elección Rector Universidad",
      description: "Proceso electoral para la elección del nuevo rector de la universidad.",
      status: "completed",
      endDate: "2024-03-20",
      totalVotes: 1250,
    },
  ])

  const mockResults = {
    1: [
      {
        id: 1,
        name: "María González",
        party: "Lista Estudiantil Progresista",
        votes: 245,
        percentage: 42.3,
      },
      {
        id: 2,
        name: "Carlos Rodríguez",
        party: "Movimiento Universitario",
        votes: 198,
        percentage: 34.1,
      },
      {
        id: 3,
        name: "Ana Martínez",
        party: "Frente Académico",
        votes: 137,
        percentage: 23.6,
      },
    ],
    2: [
      {
        id: 1,
        name: "Dr. Roberto Silva",
        party: "Coalición Académica",
        votes: 625,
        percentage: 50.0,
      },
      {
        id: 2,
        name: "Dra. Carmen López",
        party: "Renovación Universitaria",
        votes: 375,
        percentage: 30.0,
      },
      {
        id: 3,
        name: "Dr. Miguel Torres",
        party: "Independiente",
        votes: 250,
        percentage: 20.0,
      },
    ],
  }

  const handleElectionClick = (election) => {
    setSelectedElection(election)
    setCurrentView("chart")
  }

  const handleBackToList = () => {
    setCurrentView("list")
    setSelectedElection(null)
  }

  if (currentView === "chart" && selectedElection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBackToList} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Resultados
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Resultados de {selectedElection.title}</h1>
            <p className="text-muted-foreground mb-4">{selectedElection.description}</p>
          </div>
        </div>

        <ResultsChart election={selectedElection} results={mockResults[selectedElection.id] || []} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        )}

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Resultados de Elecciones
          </h1>
          <p className="text-muted-foreground">Consulta los resultados de las elecciones finalizadas</p>
        </div>
      </div>

      {/* Results Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {electionsWithResults.map((election) => (
          <ResultsCard key={election.id} election={election} onClick={handleElectionClick} />
        ))}
      </div>

      {electionsWithResults.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay resultados disponibles</h3>
          <p className="text-muted-foreground">No hay elecciones finalizadas para mostrar resultados</p>
        </div>
      )}
    </div>
  )
}
