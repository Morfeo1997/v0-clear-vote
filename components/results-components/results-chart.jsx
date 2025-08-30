"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function ResultsChart({ election, results }) {
  const totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0)
  const winner = results[0]

  const chartData = results.map((candidate) => ({
    name: candidate.name.split(" ").slice(0, 2).join(" "), // Shortened name for chart
    votes: candidate.votes,
    percentage: candidate.percentage,
    fullName: candidate.name,
    party: candidate.party,
  }))

  return (
    <div className="space-y-6">
      {/* Winner Card */}
      <Card className="border-yellow-200 bg-yellow-50">
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

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados por Candidato</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [value, "Votos"]}
                  labelFormatter={(label) => {
                    const candidate = chartData.find((c) => c.name === label)
                    return candidate ? candidate.fullName : label
                  }}
                />
                <Bar dataKey="votes" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Votos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="votes"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, "Votos"]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.fullName
                    }
                    return label
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados Detallados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((candidate, index) => (
              <div key={candidate.id} className="relative overflow-hidden border rounded-lg p-4">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all"
                  style={{ width: `${candidate.percentage}%` }}
                />
                <div className="relative flex items-center justify-between">
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Election Stats */}
      <Card>
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
