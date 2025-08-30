"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Clock, CheckCircle } from "lucide-react"

export default function ElectionOptionsPage({ election, userType, onBack }) {
  const [candidates] = useState([
    {
      id: 1,
      name: "María González",
      party: "Lista Estudiantil Progresista",
      description: "Propuesta enfocada en mejorar la infraestructura y servicios estudiantiles.",
      votes: 0,
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      party: "Movimiento Universitario",
      description: "Plan de trabajo centrado en la participación estudiantil y transparencia.",
      votes: 0,
    },
    {
      id: 3,
      name: "Ana Martínez",
      party: "Frente Académico",
      description: "Enfoque en la calidad académica y oportunidades de investigación.",
      votes: 0,
    },
  ])

  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = () => {
    if (selectedCandidate) {
      setHasVoted(true)
      alert(`Voto registrado exitosamente para ${selectedCandidate.name}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{election?.title}</h1>
          <p className="text-muted-foreground mb-4">{election?.description}</p>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Finaliza: {new Date(election?.endDate).toLocaleDateString("es-ES")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{candidates.length} candidatos</span>
            </div>
          </div>
        </div>
      </div>

      {userType === "votante" && !hasVoted && (
        <div className="mb-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Instrucciones de Votación</CardTitle>
              <CardDescription>
                Selecciona un candidato y confirma tu voto. Una vez confirmado, no podrás cambiar tu elección.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {hasVoted && (
        <div className="mb-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Voto Registrado
              </CardTitle>
              <CardDescription className="text-green-700">
                Tu voto ha sido registrado exitosamente en la blockchain.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      <div className="grid gap-6">
        {candidates.map((candidate) => (
          <Card
            key={candidate.id}
            className={`cursor-pointer transition-all ${
              selectedCandidate?.id === candidate.id
                ? "border-primary ring-2 ring-primary/20"
                : "hover:border-primary/40"
            } ${hasVoted ? "opacity-60" : ""}`}
            onClick={() => !hasVoted && setSelectedCandidate(candidate)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{candidate.name}</CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {candidate.party}
                  </Badge>
                </div>
                {selectedCandidate?.id === candidate.id && !hasVoted && (
                  <CheckCircle className="h-6 w-6 text-primary" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{candidate.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {userType === "votante" && !hasVoted && (
        <div className="mt-8 flex justify-center">
          <Button onClick={handleVote} disabled={!selectedCandidate} size="lg" className="px-8">
            Confirmar Voto
          </Button>
        </div>
      )}
    </div>
  )
}
