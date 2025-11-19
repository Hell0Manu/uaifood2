'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Address } from '@/types';
import { AddressCard } from '@/components/address/AddressCard';
import { AddressFormModal } from '@/components/order/AddressFormModal';
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
        <Loader2 className="h-10 w-10 animate-spin text-[#EA7C69]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Meus Endereços</h1>
          <p className="text-[#889898] mt-1">
            Gerencie seus locais para entrega.
          </p>
        </div>
        
        <AddressFormModal onSuccess={fetchAddresses} />
      </div>

      <div className="rounded-2xl space-y-4">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2D303E] py-16 text-center bg-[#1F1D2B]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1F1D2B] text-[#889898] mb-4">
              <Map className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-white">Nenhum endereço cadastrado</h3>
            <p className="text-md text-[#889898] max-w-sm mt-2">
              Adicione um novo endereço para receber seus pedidos.
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