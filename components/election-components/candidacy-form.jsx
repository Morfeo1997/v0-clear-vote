"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, UserPlus, Edit } from "lucide-react"

export default function CandidacyForm({ election, onClose, onSubmit, existingCandidacy = null }) {
  const [formData, setFormData] = useState({
    slogan: existingCandidacy?.slogan || "",
    party: existingCandidacy?.party || "",
    proposal: existingCandidacy?.proposal || "",
    speech: existingCandidacy?.speech || "",
  })

  const [showFullSpeech, setShowFullSpeech] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.slogan.trim()) newErrors.slogan = "El lema es requerido"
    if (!formData.party.trim()) newErrors.party = "El partido es requerido"
    if (!formData.proposal.trim()) newErrors.proposal = "La propuesta es requerida"
    if (!formData.speech.trim()) newErrors.speech = "El discurso es requerido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const candidacyData = {
      ...formData,
      electionId: election.id,
      candidateId: Date.now(), // Simulated ID
      status: "registered",
    }

    onSubmit(candidacyData)
    onClose()
  }

  const isEditing = !!existingCandidacy

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isEditing ? <Edit className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                {isEditing ? "Editar Candidatura" : "Postularse a Elección"}
              </CardTitle>
              <CardDescription>
                {isEditing ? "Modifica los datos de tu candidatura" : `Completa tu candidatura para: ${election.title}`}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Lema o Titular */}
            <div className="space-y-2">
              <Label htmlFor="slogan">Lema o Titular *</Label>
              <Input
                id="slogan"
                value={formData.slogan}
                onChange={(e) => handleInputChange("slogan", e.target.value)}
                placeholder="Ej: Por un futuro mejor"
                className={errors.slogan ? "border-red-500" : ""}
              />
              {errors.slogan && <p className="text-sm text-red-500">{errors.slogan}</p>}
            </div>

            {/* Partido */}
            <div className="space-y-2">
              <Label htmlFor="party">Partido *</Label>
              <Input
                id="party"
                value={formData.party}
                onChange={(e) => handleInputChange("party", e.target.value)}
                placeholder="Ej: Partido Estudiantil Progresista"
                className={errors.party ? "border-red-500" : ""}
              />
              {errors.party && <p className="text-sm text-red-500">{errors.party}</p>}
            </div>

            {/* Propuesta */}
            <div className="space-y-2">
              <Label htmlFor="proposal">Propuesta *</Label>
              <Textarea
                id="proposal"
                value={formData.proposal}
                onChange={(e) => handleInputChange("proposal", e.target.value)}
                placeholder="Describe tu propuesta principal..."
                rows={4}
                className={errors.proposal ? "border-red-500" : ""}
              />
              {errors.proposal && <p className="text-sm text-red-500">{errors.proposal}</p>}
            </div>

            {/* Discurso */}
            <div className="space-y-2">
              <Label htmlFor="speech">Discurso *</Label>
              <Textarea
                id="speech"
                value={formData.speech}
                onChange={(e) => handleInputChange("speech", e.target.value)}
                placeholder="Escribe tu discurso completo..."
                rows={showFullSpeech ? 8 : 4}
                className={errors.speech ? "border-red-500" : ""}
              />
              {formData.speech.length > 200 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullSpeech(!showFullSpeech)}
                  className="text-primary"
                >
                  {showFullSpeech ? "Ver menos" : "Ver más"}
                </Button>
              )}
              {errors.speech && <p className="text-sm text-red-500">{errors.speech}</p>}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                <UserPlus className="h-4 w-4 mr-2" />
                {isEditing ? "Actualizar Candidatura" : "Postularse"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
