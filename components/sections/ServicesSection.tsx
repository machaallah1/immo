// src/components/sections/ServicesSection.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, Bell, Users, Home, CreditCard } from "lucide-react"

const services = [
  {
    icon: <Home className="h-8 w-8" />,
    title: "Gestion des Propriétés",
    description: "Enregistrez et gérez facilement vos maisons et chambres en location avec une interface intuitive."
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Gestion des Locataires",
    description: "Ajoutez, modifiez et suivez vos locataires avec un système de profils complet."
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Suivi des Paiements",
    description: "Suivez les loyers, visualisez les retards et gérez les avances en temps réel."
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Paiement en Ligne",
    description: "Acceptez les paiements en ligne sécurisés via mobile money et cartes bancaires."
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Facturation Automatique",
    description: "Générez automatiquement des factures PDF professionnelles pour chaque transaction."
  },
  {
    icon: <Bell className="h-8 w-8" />,
    title: "Notifications Intelligentes",
    description: "Envoyez des rappels automatiques pour les loyers et factures à vos locataires."
  }
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Nos Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment RHM révolutionne la gestion locative au Togo avec des outils modernes et efficaces
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}