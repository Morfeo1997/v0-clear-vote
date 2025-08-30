import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LandingSection() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Bienvenido a Votación Académica
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
            El nuevo método en blockchain seguro para evitar fraudes gracias a la tecnología Blockchain
          </p>


        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Seguridad Total</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tecnología blockchain que garantiza la integridad de cada voto
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Académico</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Diseñado específicamente para instituciones educativas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Rápido y Confiable</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Resultados instantáneos con máxima transparencia
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Login Section */}
        <div className="max-w-md mx-auto">
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center text-card-foreground mb-6">Acceso al Sistema</h2>

              <form className="space-y-4">
                <div>
                  <label htmlFor="usuario" className="block text-sm font-medium text-card-foreground mb-2">
                    Usuario
                  </label>
                  <input
                    type="text"
                    id="usuario"
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Ingresa tu usuario"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Ingresa tu contraseña"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 mt-6"
                >
                  Iniciar Sesión
                </Button>

                <div className="text-center mt-4">
                  <a href="#" className="text-sm text-accent hover:text-accent/80">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
