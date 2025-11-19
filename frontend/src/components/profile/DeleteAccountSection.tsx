'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      // Chama a API: DELETE /users/:id
      await api.delete(`/users/${user.id}`);
      
      // Logout forçado e redirecionamento
      await logout(); // Limpa store e chama API de logout se existir
      router.push('/login');
      
    } catch (error) {
      console.error('Erro crítico ao deletar conta:', error);
      // Feedback visual simples caso falhe (opcional, já que o console log foi pedido)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-red-100 bg-red-50/30">
      <CardHeader>
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <CardTitle className="text-lg">Zona de Perigo</CardTitle>
        </div>
        <CardDescription>
          A exclusão da conta é permanente e não pode ser desfeita. Todos os seus pedidos e dados serão removidos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Deletar Minha Conta
            </Button>
          </AlertDialogTrigger>
          
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                <strong> {user?.name}</strong> e removerá seus dados de nossos servidores.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isLoading ? 'Deletando...' : 'Sim, deletar minha conta'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}