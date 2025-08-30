"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Users, BarChart3 } from "lucide-react"

export default function ResultsPage({ election, onBack }) {
  const [results] = useState([
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
  ])

  const totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0)
  const winner = results[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Resultados de {election?.title}</h1>
          <p className="text-muted-foreground mb-4">{election?.description}</p>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{totalVotes} votos totales</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Resultados finales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Card */}
      <Card className="border-yellow-200 bg-yellow-50 mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-yellow-800 flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Ganador de la Elección
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-yellow-900">{winner.name}</h3>
              <Badge variant="outline" className="mt-1 border-yellow-300 text-yellow-800">
                {winner.party}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-900">{winner.percentage}%</div>
              <div className="text-sm text-yellow-700">{winner.votes} votos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Resultados Detallados</h2>

        {results.map((candidate, index) => (
          <Card key={candidate.id} className="relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all"
              style={{ width: `${candidate.percentage}%` }}
            />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {candidate.party}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{candidate.percentage}%</div>
                  <div className="text-sm text-muted-foreground">{candidate.votes} votos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Election Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Estadísticas de la Elección</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{totalVotes}</div>
              <div className="text-sm text-muted-foreground">Total de Votos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{results.length}</div>
              <div className="text-sm text-muted-foreground">Candidatos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Participación</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">✓</div>
              <div className="text-sm text-muted-foreground">Verificado</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
