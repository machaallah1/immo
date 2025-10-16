// components/layout/Footer.tsx
import Link from 'next/link';
import { Building2, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">RHM</span>
            </Link>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Votre partenaire de confiance pour la gestion locative au Togo. 
              Simplifiez la gestion de vos propriétés avec notre plateforme innovante.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-gray-800">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-gray-800">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-gray-800">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-blue-500 transition-colors text-sm block py-1">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-400 hover:text-blue-500 transition-colors text-sm block py-1">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-400 hover:text-blue-500 transition-colors text-sm block py-1">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-gray-400 hover:text-blue-500 transition-colors text-sm block py-1">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-blue-500 transition-colors text-sm block py-1">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-gray-400 hover:text-blue-500 transition-colors text-sm block py-1">
                  Gestion des Propriétés
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-blue-500 transition-colors text-sm block py-1">
                  Suivi des Paiements
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-blue-500 transition-colors text-sm block py-1">
                  Facturation Automatique
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-blue-500 transition-colors text-sm block py-1">
                  Paiement en Ligne
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-blue-500 transition-colors text-sm block py-1">
                  Notifications Intelligentes
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Lomé, Togo</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+228 90 00 00 00</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">contact@rhm.tg</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-300">Newsletter</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} RHM - Rent House Management. Tous droits réservés.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors whitespace-nowrap">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors whitespace-nowrap">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors whitespace-nowrap">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}