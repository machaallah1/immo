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

// Routes par rôle
const ownerRoutes = ["/owner/dashboard"];
const tenantRoutes = ["/tenant/dashboard"];
const adminRoutes = ["/admin/dashboard"];

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
        
        const isOwnerRoute = ownerRoutes.some(route => 
          pathname.startsWith(route)
        );
        
        const isTenantRoute = tenantRoutes.some(route => 
          pathname.startsWith(route)
        );
        
        const isAdminRoute = adminRoutes.some(route => 
          pathname.startsWith(route)
        );

        const isProtectedRoute = isOwnerRoute || isTenantRoute || isAdminRoute;
        if (!session) {
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

        const dbUser = await getCurrentUser();
        
        if (!dbUser) {
          console.error('User not found in database');
          if (mounted) {
            router.push('/login');
          }
          return;
        }

        if (isProtectedRoute) {
          let hasAccess = false;
          
          if (isOwnerRoute && dbUser.role === 'OWNER') hasAccess = true;
          if (isTenantRoute && dbUser.role === 'TENANT') hasAccess = true;
          if (isAdminRoute && dbUser.role === 'ADMIN') hasAccess = true;

          if (!hasAccess) {
            let redirectPath = '/admin/dashboard'; // Par défaut ADMIN
            switch (dbUser.role) {
              case 'ADMIN':
                redirectPath = '/admin/dashboard';
                break;
              case 'OWNER':
                redirectPath = '/owner/dashboard';
                break;
              case 'TENANT':
                redirectPath = '/tenant/dashboard';
                break;
            }
            
            if (mounted) {
              router.push(redirectPath);
            }
            return;
          }
        }

        // Rediriger depuis login/register vers le dashboard approprié
        if ((pathname === '/login' || pathname === '/register') && dbUser) {
          let redirectPath = '/admin/dashboard'; // Par défaut ADMIN
          switch (dbUser.role) {
            case 'ADMIN':
              redirectPath = '/admin/dashboard';
              break;
            case 'OWNER':
              redirectPath = '/owner/dashboard';
              break;
            case 'TENANT':
              redirectPath = '/tenant/dashboard';
              break;
          }
          
          if (mounted) {
            router.push(redirectPath);
          }
          return;
        }

        // Autoriser l'accès
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      try {
        if (event === 'SIGNED_OUT') {
          // Rediriger vers l'accueil après déconnexion
          if (pathname.startsWith('/owner') || pathname.startsWith('/tenant') || pathname.startsWith('/admin')) {
            router.push('/');
          }
        }
        
        if (event === 'SIGNED_IN' && session) {
          // Récupérer le rôle de l'utilisateur
          const dbUser = await getCurrentUser();
          if (dbUser) {
            let redirectPath = '/admin/dashboard'; // Par défaut ADMIN
            switch (dbUser.role) {
              case 'ADMIN':
                redirectPath = '/admin/dashboard';
                break;
              case 'OWNER':
                redirectPath = '/owner/dashboard';
                break;
              case 'TENANT':
                redirectPath = '/tenant/dashboard';
                break;
            }
            if (pathname === '/login' || pathname === '/register' || pathname === '/') {
              router.push(redirectPath);
            }
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
  }, [pathname, router]);

  return children;
}