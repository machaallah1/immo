// src/components/sections/TestimonialsSection.tsx
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Koffi Mensah",
    role: "Propriétaire, Lomé",
    image: "/images/img1.jpg",
    content: "RHM a transformé ma façon de gérer mes 5 appartements. Les paiements automatiques et les rappels m'ont fait gagner un temps précieux.",
    rating: 5
  },
  {
    name: "Aïcha Diallo",
    role: "Locataire, Agoè",
    image: "/images/img2.jpg",
    content: "Enfin une plateforme moderne ! Je peux payer mon loyer en ligne et recevoir mes factures instantanément. Très pratique !",
    rating: 5
  },
  {
    name: "Jean Akakpo",
    role: "Gestionnaire, Bè",
    image: "/images/img3.jpg",
    content: "La gestion des factures d'eau et d'électricité est devenue tellement simple. Mes locataires adorent l'application.",
    rating: 4
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Ils nous font confiance</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez les retours de nos utilisateurs satisfaits au Togo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{testimonial.name}</div>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <StarRating rating={testimonial.rating} />
                <p className="text-sm text-muted-foreground italic">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}