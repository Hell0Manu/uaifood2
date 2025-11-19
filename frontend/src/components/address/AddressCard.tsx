'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Trash2, Loader2 } from 'lucide-react';
import { Address } from '@/types';
import { AddressFormModal } from '../order/AddressFormModal'; // Ajuste o import conforme onde você salvou
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

interface AddressCardProps {
  address: Address;
  onUpdate: () => void; // Função para recarregar a lista
}

export function AddressCard({ address, onUpdate }: AddressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/addresses/${address.id}`);
      onUpdate();
    } catch (error) {
      console.error('Erro ao deletar endereço:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:border-red-200 transition-colors">
      <CardContent className="p-5 flex items-start justify-between">
        <div className="flex gap-4">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">
              {address.street}, {address.number}
            </h3>
            <p className="text-sm text-gray-500">
              {address.district}
            </p>
            <p className="text-sm text-gray-500">
              {address.city} - {address.state}
            </p>
            <p className="text-xs text-gray-400 font-mono pt-1">
              CEP: {address.zipCode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão de Editar (Reusa o Modal) */}
          <AddressFormModal 
            onSuccess={onUpdate} 
            addressToEdit={address} 
          />

          {/* Botão de Deletar (Alert Dialog) */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600">
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir endereço?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. O endereço será removido da sua conta permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Sim, excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}