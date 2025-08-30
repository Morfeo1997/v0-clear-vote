"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Calendar, Plus } from "lucide-react"

export default function CreateElectionForm({ onClose, onCreateElection }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    candidateDeadline: "",
    electionDeadline: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validación básica
    if (
      !formData.title ||
      !formData.description ||
      !formData.startDate ||
      !formData.candidateDeadline ||
      !formData.electionDeadline
    ) {
      alert("Por favor completa todos los campos")
      return
    }

    // Validar fechas
    const startDate = new Date(formData.startDate)
    const candidateDeadline = new Date(formData.candidateDeadline)
    const electionDeadline = new Date(formData.electionDeadline)
    const today = new Date()

    if (startDate < today) {
      alert("La fecha de inicio debe ser posterior a hoy")
      return
    }

    if (candidateDeadline < startDate) {
      alert("La fecha límite de candidatura debe ser posterior a la fecha de inicio")
      return
    }

    if (electionDeadline < candidateDeadline) {
      alert("La fecha límite de elección debe ser posterior a la fecha límite de candidatura")
      return
    }

    // Crear la elección
    const newElection = {
      id: Date.now(), // ID temporal
      title: formData.title,
      description: formData.description,
      status: "pending",
      startDate: formData.startDate,
      candidateDeadline: formData.candidateDeadline,
      endDate: formData.electionDeadline,
      createdAt: new Date().toISOString(),
    }

    onCreateElection(newElection)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Plus className="h-6 w-6 text-primary" />
              Crear Nueva Elección
            </CardTitle>
            <CardDescription>Configura los detalles de la nueva elección académica</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título de la Elección */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Título de la Elección *
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Ej: Elección Consejo Estudiantil 2024"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descripción de la Elección *
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe el propósito y alcance de esta elección..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full min-h-[100px] resize-none"
                required
              />
            </div>

            {/* Fechas */}
            <div className="grid gap-4 md:grid-cols-1">
              {/* Fecha de Inicio */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha de Inicio de Elección *
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>

              {/* Fecha Límite de Candidatura */}
              <div className="space-y-2">
                <Label htmlFor="candidateDeadline" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha Límite de Candidatura *
                </Label>
                <Input
                  id="candidateDeadline"
                  name="candidateDeadline"
                  type="datetime-local"
                  value={formData.candidateDeadline}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
                <p className="text-xs text-muted-foreground">Fecha límite para que los candidatos se postulen</p>
              </div>

              {/* Fecha Límite de Elección */}
              <div className="space-y-2">
                <Label htmlFor="electionDeadline" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha Límite de Elección *
                </Label>
                <Input
                  id="electionDeadline"
                  name="electionDeadline"
                  type="datetime-local"
                  value={formData.electionDeadline}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
                <p className="text-xs text-muted-foreground">Fecha límite para que los votantes emitan su voto</p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Crear Elección
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
