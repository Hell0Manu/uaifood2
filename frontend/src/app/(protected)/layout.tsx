// frontend/src/app/(protected)/layout.tsx (CÓDIGO AJUSTADO)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {

    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Carregando...</p>
      </div>
    );
  }


  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}