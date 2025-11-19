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
  // Pega o estado da store
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Se não está carregando e não está autenticado...
    if (!isLoading && !isAuthenticated) {
      router.push('/login'); // ...redireciona para o login
    }
  }, [isLoading, isAuthenticated, router]);

  // Mostra um loader ENQUANTO o initialize() (do RootLayout) está rodando
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Carregando...</p>
      </div>
    );
  }

  // Se está autenticado, mostra o conteúdo
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Se não estiver autenticado (mas antes do redirect), não mostra nada
  return null;
}