'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteAccountSection() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      await api.delete(`/users/${user.id}`);
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro crítico ao deletar conta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#2D303E]/30 p-6 shadow-lg border-2 border-red-500/30">
      <div className="mb-4">
        <div className="flex items-center gap-3 text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Zona de Perigo</h2>
        </div>
        <p className="text-[#889898] mt-2">
          A exclusão da sua conta é uma ação permanente e removerá todos os seus dados.
        </p>
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isLoading} className="bg-red-600/80 hover:bg-red-600 text-white font-bold">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Deletar Minha Conta
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-[#1F1D2B] border-[#2D303E] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#889898]">
              Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-[#2D303E] border-none hover:bg-[#3f4357]">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Deletando...' : 'Sim, deletar conta'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}