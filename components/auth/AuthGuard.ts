// components/AuthGuard.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/db/supabaseClient";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/auth";

// Routes publiques accessibles sans authentification
const publicRoutes = [
  "/",
  "/login", 
  "/register",
  "/about",
  "/contact",
  "/faq"
];

// Routes protégées nécessitant une authentification
const protectedRoutes = [
  "/owner",
  "/tenant",
  "/dashboard"
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      if (!mounted) return;

      try {
        // Vérifier l'état d'authentification
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Auth session error:', error.message);
        }

        // Vérifier le type de route
        const isPublicRoute = publicRoutes.some(route => 
          pathname === route || pathname.startsWith(route + '/')
        );
        
        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.startsWith(route)
        );
        const isAdminRoute = pathname.startsWith('/owner') || pathname.startsWith('/tenant');

        // LOGIQUE DE REDIRECTION AVEC VÉRIFICATION DES RÔLES

        // 1. Si l'utilisateur n'est PAS connecté
        if (!session) {
          // Bloquer l'accès aux routes protégées
          if (isProtectedRoute) {
            if (mounted) {
              router.push('/login');
            }
            return;
          }
          // Autoriser les routes publiques
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        // 2. Si l'utilisateur EST connecté
        // Récupérer les données utilisateur depuis la base de données
        const dbUser = await getCurrentUser();
        
        // VÉRIFICATION SPÉCIALE POUR LES ROUTES ADMIN
        if (isAdminRoute) {
          if (dbUser?.role !== 'ADMIN') {
            // Rediriger vers dashboard si l'utilisateur n'est pas ADMIN
            if (mounted) {
              router.push('/dashboard');
            }
            return;
          }
          // Autoriser l'accès admin
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        // Autoriser l'accès aux routes protégées (dashboard, etc.)
        if (isProtectedRoute) {
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        // Rediriger vers dashboard si sur login/register
        if (pathname === '/login' || pathname === '/register') {
          if (mounted) {
            router.push('/dashboard');
          }
          return;
        }
        
        // Pour toutes les autres routes (y compris /), autoriser l'accès
        if (mounted) {
          setLoading(false);
        }

      } catch (error) {
        console.error('Auth guard error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      try {
        if (event === 'SIGNED_OUT') {
          // Rediriger vers l'accueil après déconnexion
          if (protectedRoutes.some(route => pathname.startsWith(route))) {
            router.push('/');
          }
        }
        
        if (event === 'SIGNED_IN') {
          // Rediriger vers le dashboard après connexion
          if (pathname === '/login' || pathname === '/register' || pathname === '/') {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname]);

  return children;
}
