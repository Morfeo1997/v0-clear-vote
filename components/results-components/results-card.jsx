"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users } from "lucide-react"

export default function ResultsCard({ election, onClick }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card
      className="hover:shadow-lg transition-shadow border-border/50 cursor-pointer"
      onClick={() => onClick(election)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground mb-2">{election.title}</CardTitle>
            <Badge variant={election.status === "completed" ? "secondary" : "default"} className="mb-2">
              {election.status === "completed" ? "Finalizada" : "En Progreso"}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground">{election.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Finalizada: {formatDate(election.endDate)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{election.totalVotes || 0} votos registrados</span>
        </div>
      </CardContent>
    </Card>
  )
}
