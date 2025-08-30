"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

export default function ErrorPage({ error, onRetry, onGoHome }) {
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Error en el Sistema</CardTitle>
          <CardDescription className="text-muted-foreground">
            {error || "Ha ocurrido un error inesperado en el sistema de votación"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Posibles causas:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Problema de conectividad</li>
              <li>Error en la blockchain</li>
              <li>Sesión expirada</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onRetry} className="flex-1 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
            <Button onClick={onGoHome} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
