'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Loader2, SearchX } from 'lucide-react';
import { OrderFilters } from '@/components/order/OrderFilters';
import { OrderCard, Order } from '@/components/order/OrderCard';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [activeTab, setActiveTab] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('ALL_TIME');

  // useCallback garante que a função não seja recriada, evitando loops
  const fetchOrders = useCallback(async () => {
    try {
      // O loading só aparece na primeira carga ou se explicitamente desejado
      // Aqui optamos por não piscar a tela inteira ao atualizar um status
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // --- Lógica de Filtragem ---
  const isWithinPeriod = (dateString: string, period: string) => {
    if (period === 'ALL_TIME') return true;

    const orderDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (period === '30_DAYS') return diffDays <= 30;
    if (period === '6_MONTHS') return diffDays <= 180;
    if (period === '1_YEAR') return diffDays <= 365;
    
    return true;
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch = activeTab === 'ALL' || order.status === activeTab;
    const dateMatch = isWithinPeriod(order.createdAt, timeFilter);
    return statusMatch && dateMatch;
  });

  // --- Renderização ---

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Meus Pedidos</h1>

      <OrderFilters 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
      />

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <SearchX className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Nenhum pedido encontrado</h3>
            <p className="text-sm text-gray-500">
              {activeTab !== 'ALL' || timeFilter !== 'ALL_TIME'
                ? 'Tente mudar os filtros de busca.' 
                : 'Você ainda não fez nenhum pedido.'}
            </p>
          </div>
        ) : (
          // Renderiza os cartões
          filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onUpdate={fetchOrders} // Passa a função para recarregar a lista
            />
          ))
        )}
      </div>
    </div>
  );
}