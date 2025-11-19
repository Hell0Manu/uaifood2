'use client'; // <-- Este é o Componente Cliente!

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore'; // Ajuste o caminho

export function StoreInitializer() {
  // Pega o 'initialize' da store
  const { initialize } = useAuthStore();

  // Roda o initialize APENAS UMA VEZ quando o app carrega
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Este componente não renderiza nada,
  // ele só faz o trabalho de inicialização.
  return null;
}