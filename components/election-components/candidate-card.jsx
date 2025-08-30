"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, User } from "lucide-react"

export default function CandidateCard({ candidate, isSelected, onSelect, disabled }) {
  const [showFullProposal, setShowFullProposal] = useState(false)

  const handleSelect = () => {
    if (!disabled) {
      onSelect(candidate.id)
    }
  }

  const toggleProposal = () => {
    setShowFullProposal(!showFullProposal)
  }

  const isLongProposal = candidate.proposal.length > 150

  return (
    <Card
      className={`transition-all duration-200 ${
        isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border/50 hover:shadow-lg hover:border-border"
      } ${disabled ? "opacity-60" : "cursor-pointer"}`}
      onClick={handleSelect}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-foreground">{candidate.name}</CardTitle>
              <Badge variant="outline" className="mt-1 text-xs">
                {candidate.party}
              </Badge>
            </div>
          </div>

          {/* Vote Checkbox */}
          <div className="flex items-center">
            <Checkbox
              checked={isSelected}
              disabled={disabled}
              className="h-5 w-5"
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={handleSelect}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Proposal */}
        <div>
          <h4 className="font-medium text-foreground mb-2">Propuesta:</h4>
          <CardDescription className="text-sm leading-relaxed">
            {showFullProposal ? candidate.fullProposal : candidate.proposal}
          </CardDescription>

          {/* Show More/Less Button */}
          {isLongProposal && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                toggleProposal()
              }}
              className="mt-2 h-auto p-0 text-primary hover:text-primary/80"
            >
              {showFullProposal ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Ver menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Ver más
                </>
              )}
            </Button>
          )}
        </div>

        {/* Vote Status */}
        {isSelected && !disabled && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <Checkbox checked={true} className="h-4 w-4" />
              <span>Candidato seleccionado</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
