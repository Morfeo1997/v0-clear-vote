"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, CheckCircle, Settings, Trophy, UserPlus, Edit } from "lucide-react"
import CandidacyForm from "@/components/election-components/candidacy-form"

export default function ElectionCard({ election, userType, onElectionClick }) {
  const [showCandidacyForm, setShowCandidacyForm] = useState(false)
  const [userCandidacy, setUserCandidacy] = useState(null) // Simulated user candidacy

  const handleElectionClick = () => {
    if (onElectionClick) {
      onElectionClick(election)
    }
  }

  const handleManage = (e) => {
    e.stopPropagation()
    alert(`Gestionando elección: ${election.title}`)
  }

  const handleViewResults = (e) => {
    e.stopPropagation()
    if (onElectionClick) {
      // Signal to parent that we want to view results
      onElectionClick({ type: "viewResults", election })
    }
  }

  const handleApply = (e) => {
    e.stopPropagation()
    setShowCandidacyForm(true)
  }

  const handleEditCandidacy = (e) => {
    e.stopPropagation()
    setShowCandidacyForm(true)
  }

  const handleCandidacySubmit = (candidacyData) => {
    setUserCandidacy(candidacyData)
    alert(userCandidacy ? "Candidatura actualizada exitosamente" : "Te has postulado exitosamente")
  }

  const canApply = () => {
    if (election.status !== "active") return false

    const candidacyDeadline = new Date(election.candidacyDeadline || election.endDate)
    const now = new Date()

    return now <= candidacyDeadline
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow border-border/50 cursor-pointer" onClick={handleElectionClick}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-foreground mb-2">{election.title}</CardTitle>
              <Badge variant={election.status === "active" ? "default" : "secondary"} className="mb-2">
                {election.status === "active" ? "Activa" : "Finalizada"}
              </Badge>
            </div>
          </div>
          <CardDescription className="text-sm text-muted-foreground">{election.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Finaliza: {formatDate(election.endDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Participantes habilitados</span>
          </div>

          <div className="pt-2">
            {userType === "developer" && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleManage} className="flex-1 bg-transparent">
                  <Settings className="h-4 w-4 mr-1" />
                  Gestionar
                </Button>
                <Button size="sm" onClick={handleViewResults} className="flex-1">
                  <Trophy className="h-4 w-4 mr-1" />
                  Resultados
                </Button>
              </div>
            )}

            {userType === "propietario" && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleManage} className="flex-1 bg-transparent">
                  <Settings className="h-4 w-4 mr-1" />
                  Gestionar
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleElectionClick()
                  }}
                  className="flex-1"
                  disabled={election.status !== "active"}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Votar
                </Button>
              </div>
            )}

            {userType === "administrador" && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleViewResults} className="flex-1 bg-transparent">
                  <Trophy className="h-4 w-4 mr-1" />
                  Resultados
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleElectionClick()
                  }}
                  className="flex-1"
                  disabled={election.status !== "active"}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Votar
                </Button>
              </div>
            )}

            {userType === "votante" && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleElectionClick()
                }}
                className="w-full"
                disabled={election.status !== "active"}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {election.status === "active" ? "Votar Ahora" : "Elección Finalizada"}
              </Button>
            )}

            {userType === "candidato" && (
              <div className="space-y-2">
                {userCandidacy ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleEditCandidacy} className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar Candidatura
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleElectionClick()
                      }}
                      className="flex-1"
                      disabled={election.status !== "active"}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Votar
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApply}
                      className="flex-1 bg-transparent"
                      disabled={!canApply()}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      {canApply() ? "Postularse" : "Candidaturas Cerradas"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleElectionClick()
                      }}
                      className="flex-1"
                      disabled={election.status !== "active"}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Votar
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showCandidacyForm && (
        <CandidacyForm
          election={election}
          existingCandidacy={userCandidacy}
          onClose={() => setShowCandidacyForm(false)}
          onSubmit={handleCandidacySubmit}
        />
      )}
    </>
  )
}
