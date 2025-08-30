"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Users, CheckCircle2 } from "lucide-react"
import CandidateCard from "@/components/election-components/candidate-card"

export default function ElectionView({ election, userType, onBack }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  const [candidates] = useState([
    {
      id: 1,
      name: "María González",
      party: "Partido Estudiantil Progresista",
      proposal:
        "Propongo mejorar la infraestructura tecnológica de la universidad, implementar más espacios de estudio colaborativo y crear programas de mentoría entre estudiantes de diferentes semestres.",
      fullProposal:
        "Mi propuesta se centra en tres pilares fundamentales: 1) Modernización tecnológica con nuevos laboratorios de computación y mejora del WiFi en todo el campus, 2) Creación de espacios de estudio 24/7 con recursos multimedia, y 3) Implementación de un programa integral de mentoría que conecte estudiantes de primer año con estudiantes avanzados para mejorar el rendimiento académico y la integración social.",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      party: "Movimiento Universitario Renovador",
      proposal:
        "Mi enfoque está en fortalecer la representación estudiantil, mejorar los servicios de bienestar universitario y promover actividades culturales y deportivas que enriquezcan la experiencia académica.",
      fullProposal:
        "Como representante estudiantil, mi compromiso es crear canales de comunicación más efectivos entre estudiantes y administración, expandir los servicios de apoyo psicológico y académico, establecer un fondo de ayuda económica para estudiantes en situación vulnerable, y desarrollar un calendario anual de eventos culturales, deportivos y académicos que fortalezcan la comunidad universitaria.",
    },
    {
      id: 3,
      name: "Ana Martínez",
      party: "Coalición Estudiantil Independiente",
      proposal:
        "Busco implementar políticas de sostenibilidad ambiental en el campus, mejorar la seguridad estudiantil y crear más oportunidades de prácticas profesionales y empleabilidad.",
      fullProposal:
        "Mi plan de gobierno estudiantil incluye la implementación de un campus verde con programas de reciclaje, energías renovables y transporte sostenible. También propongo mejorar la iluminación y seguridad en todas las áreas del campus, establecer convenios con empresas para garantizar prácticas profesionales remuneradas, y crear un centro de empleabilidad que prepare a los estudiantes para el mercado laboral con talleres, simulacros de entrevistas y networking profesional.",
    },
  ])

  const handleCandidateSelect = (candidateId) => {
    if (!hasVoted) {
      setSelectedCandidate(candidateId)
    }
  }

  const handleConfirmVote = () => {
    if (selectedCandidate && !hasVoted) {
      const candidate = candidates.find((c) => c.id === selectedCandidate)
      alert(`Voto confirmado para: ${candidate.name}`)
      setHasVoted(true)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4 hover:bg-muted">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Elecciones
        </Button>

        <div className="bg-card border border-border/50 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{election.title}</h1>
              <Badge variant={election.status === "active" ? "default" : "secondary"} className="mb-2">
                {election.status === "active" ? "Elección Activa" : "Elección Finalizada"}
              </Badge>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">{election.description}</p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Finaliza: {formatDate(election.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{candidates.length} candidatos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Voting Status */}
      {hasVoted && (
        <div className="mb-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">¡Voto registrado exitosamente!</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Candidates Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Candidatos</h2>

        {/* Candidates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedCandidate === candidate.id}
              onSelect={handleCandidateSelect}
              disabled={hasVoted}
            />
          ))}
        </div>

        {/* Confirm Vote Button */}
        {!hasVoted && election.status === "active" && (
          <div className="flex justify-center">
            <Button onClick={handleConfirmVote} disabled={!selectedCandidate} size="lg" className="px-8">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Confirmar Voto
              {selectedCandidate && (
                <span className="ml-2 text-sm opacity-90">
                  ({candidates.find((c) => c.id === selectedCandidate)?.name})
                </span>
              )}
            </Button>
          </div>
        )}

        {election.status !== "active" && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Esta elección ha finalizado. Ya no es posible votar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
