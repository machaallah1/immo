"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      try {
        const user = await getCurrentUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        let redirectPath = '/admin/dashboard';
        
        switch (user.role) {
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
        
        router.push(redirectPath);
      } catch (error) {
        console.error('Redirect error:', error);
        router.push('/login');
      }
    };

    redirect();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirection...</p>
      </div>
    </div>
  );
}
