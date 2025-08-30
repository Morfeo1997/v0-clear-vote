import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90 font-semibold text-lg">
              🗳️ VotaciónAcadémica
            </Button>
          </div>

          {/* Login Button */}
          <div className="flex items-center">
            <Button
              variant="secondary"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
