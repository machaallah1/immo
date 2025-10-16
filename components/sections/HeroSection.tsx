// src/components/sections/HeroSection.tsx
import { Button } from "@/components/ui/button"
import { ArrowRight, PlayCircle } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      className="relative text-white overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to bottom right, rgba(10, 20, 60, 0.75), rgba(0, 0, 50, 0.75)),
          url('/images/img1.jpg')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Contenu principal */}
      <div className="relative container mx-auto px-4 py-24 lg:py-32 text-center space-y-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Gérez vos locations{" "}
            <span className="block text-blue-300">en toute simplicité</span>
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            La plateforme tout-en-un pour propriétaires et locataires au Togo. 
            Automatisez vos paiements, factures et communications.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-3 font-semibold shadow-lg"
            asChild
          >
            <Link href="/register">
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white text-white bg-transparent hover:bg-white/10 text-lg px-8 py-3 font-semibold backdrop-blur-sm"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Voir la démo
          </Button>
        </div>

        <div className="pt-12">
          <p className="text-blue-200 text-sm uppercase tracking-wider mb-4">
            Déjà utilisé par plus de 500 propriétaires au Togo
          </p>
          <div className="flex justify-center items-center space-x-8 text-blue-100">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm">Propriétaires</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">1 200+</div>
              <div className="text-sm">Locataires</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
