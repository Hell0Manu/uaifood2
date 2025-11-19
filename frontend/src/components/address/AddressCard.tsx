'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { MapPin, Trash2, Loader2 } from 'lucide-react';
import { Address } from '@/types';
import { AddressFormModal } from '../order/AddressFormModal';
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
  onUpdate: () => void;
}

export function AddressCard({ address, onUpdate }: AddressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/address/${address.id}`); // Corrigido endpoint
      onUpdate();
    } catch (error) {
      console.error('Erro ao deletar endereço:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#1F1D2B] rounded-xl border border-[#2D303E] p-5 flex items-start justify-between transition-all duration-200 hover:border-[#3f4357]">
      <div className="flex gap-4">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EA7C69]/20 text-[#EA7C69]">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-white">
            {address.street}, {address.number}
          </h3>
          <p className="text-sm text-[#889898]">
            {address.district}, {address.city} - {address.state}
          </p>
          <p className="text-xs text-[#5a5d6a] font-mono pt-1">
            CEP: {address.zipCode}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <AddressFormModal 
          onSuccess={onUpdate} 
          addressToEdit={address} 
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[#889898] hover:text-red-400 hover:bg-[#2D303E]" disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1F1D2B] border-[#2D303E] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir este endereço?</AlertDialogTitle>
              <AlertDialogDescription className="text-[#889898]">
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#2D303E] border-none hover:bg-[#3f4357]">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}