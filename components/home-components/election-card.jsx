"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, CheckCircle } from "lucide-react"

export default function ElectionCard({ election, userType }) {
  const handleVote = () => {
    alert(`Redirigiendo a la votación: ${election.title}`)
  }

  const handleManage = () => {
    alert(`Gestionando elección: ${election.title}`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow border-border/50">
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
          {userType === "owner" ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleManage} className="flex-1 bg-transparent">
                Gestionar
              </Button>
              <Button size="sm" onClick={handleVote} className="flex-1">
                Ver Resultados
              </Button>
            </div>
          ) : userType === "votante" ? (
            <Button onClick={handleVote} className="w-full" disabled={election.status !== "active"}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {election.status === "active" ? "Votar Ahora" : "Elección Finalizada"}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleVote} className="w-full bg-transparent">
              Ver Detalles
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
