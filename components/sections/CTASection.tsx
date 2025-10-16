// src/components/sections/CTASection.tsx
'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Shield, Clock, Zap, Users } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const benefits = [
  {
    icon: Clock,
    text: "Configuration en 5 minutes"
  },
  {
    icon: Shield,
    text: "Essai gratuit 30 jours"
  },
  {
    icon: Zap,
    text: "Aucun engagement requis"
  },
  {
    icon: Users,
    text: "Support dédié inclus"
  }
]

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyNTI1MzEiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
            <div className="text-center space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  Prêt à transformer votre
                  <span className="block text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                    gestion locative ?
                  </span>
                </h2>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Rejoignez les centaines de professionnels qui font confiance à RHM 
                  pour simplifier et optimiser leur gestion immobilière.
                </p>
              </motion.div>

              {/* Benefits Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6"
              >
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-300 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <benefit.icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
              >
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-blue-500/25 font-semibold" asChild>
                  <Link href="/register" className="flex items-center gap-2">
                    Commencer gratuitement
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-black hover:bg-white/10 text-lg px-8 py-6 rounded-xl backdrop-blur-sm font-semibold">
                  Demander une démo
                </Button>
              </motion.div>

              {/* Trust Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="pt-6"
              >
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Aucune carte de crédit requise • Support 7j/7 • Données 100% sécurisées</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}