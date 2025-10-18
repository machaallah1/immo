import { NextRequest, NextResponse } from 'next/server'
import { createClient } from './lib/db/middleware'

const authRoutes = [
  '/login',
  '/register',
  '/forgot-password'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  let isAuthenticated = false;
  let userRole: string | null = null;

  const response = NextResponse.next()

  try {
    const supabase = createClient(request, response);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      isAuthenticated = true;
      // Récupérer le rôle depuis la base de données
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      // Par défaut ADMIN si pas de rôle trouvé
      userRole = userData?.role || 'ADMIN';
    }
  } catch (error) {
    isAuthenticated = false;
    userRole = null;
  }

  // Protection des routes par rôle
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  } else if (pathname.startsWith('/owner')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  } else if (pathname.startsWith('/tenant')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirection depuis login/register si déjà connecté
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated && userRole) {
      let redirectPath = '/admin/dashboard'; // Par défaut admin
      
      switch (userRole) {
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
      
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  // Redirection depuis /dashboard vers le bon dashboard
  if (pathname === '/dashboard') {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (userRole) {
      let redirectPath = '/admin/dashboard'; // Par défaut admin
      
      switch (userRole) {
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
      
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/|favicon.ico|public/).*)',
  ],
}