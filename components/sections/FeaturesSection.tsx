// src/components/sections/FeaturesSection.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const ownerFeatures = [
  "Tableau de bord propriétaire personnalisé",
  "Gestion multi-propriétés",
  "Suivi des paiements en temps réel",
  "Génération automatique de factures PDF",
  "Notifications de rappel automatiques",
  "Rapports financiers détaillés"
]

const tenantFeatures = [
  "Espace locataire sécurisé",
  "Historique complet des paiements",
  "Paiement en ligne sécurisé",
  "Téléchargement des reçus et factures",
  "Notifications personnalisées",
  "Signalement de problèmes en ligne"
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary" className="text-sm">Fonctionnalités</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Conçu pour tous les acteurs</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète qui répond aux besoins des propriétaires et locataires
          </p>
        </div>

        <Tabs defaultValue="owner" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="owner" className="text-lg py-3">Pour les Propriétaires</TabsTrigger>
            <TabsTrigger value="tenant" className="text-lg py-3">Pour les Locataires</TabsTrigger>
          </TabsList>
          
          <TabsContent value="owner">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Gestion Locative Simplifiée</CardTitle>
                <CardDescription className="text-base">
                  Tout ce dont vous avez besoin pour gérer efficacement vos biens immobiliers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ownerFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenant">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Expérience Locataire Moderne</CardTitle>
                <CardDescription className="text-base">
                  Gerez vos locations en toute simplicité depuis votre espace personnel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tenantFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}