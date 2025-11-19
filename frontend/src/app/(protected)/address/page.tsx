'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Address } from '@/types';
import { AddressCard } from '@/components/address/AddressCard';
import { AddressFormModal } from '@/components/order/AddressFormModal'; // Ajuste o import
import { Loader2, Map } from 'lucide-react';

export default function AddressesPage() {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await api.get(`/address/${user.id}`);
      setAddresses(response.data);
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user, fetchAddresses]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meus Endereços</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus locais de entrega.
          </p>
        </div>
        
        {/* Modal para CRIAR (sem addressToEdit) */}
        <AddressFormModal onSuccess={fetchAddresses} />
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center bg-gray-50">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
              <Map className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Nenhum endereço cadastrado</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-2">
              Adicione um endereço para facilitar suas compras e entregas.
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <AddressCard 
              key={address.id} 
              address={address} 
              onUpdate={fetchAddresses} 
            />
          ))
        )}
      </div>
    </div>
  );
}