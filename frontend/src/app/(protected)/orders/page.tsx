'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Loader2, SearchX } from 'lucide-react';
import { OrderFilters } from '@/components/order/OrderFilters';
import { OrderCard, Order } from '@/components/order/OrderCard';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('ALL_TIME');

  const fetchOrders = useCallback(async () => {
    try {
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

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#EA7C69]" />
      </div>
    );
  }

  return (
    <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Meus Pedidos</h1>
          <p className="text-[#889898] mt-1">
            Gerencie seus pedidos.
          </p>
        </div>
      <div>
        <OrderFilters 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
        />

        <div className="space-y-6 mt-6">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2D303E] py-16 text-center bg-[#252836]">
              <SearchX className="h-16 w-16 text-[#4A4F60]" />
              <h3 className="mt-6 text-xl font-semibold text-white">Nenhum pedido encontrado</h3>
              <p className="text-md text-[#889898]">
                {activeTab !== 'ALL' || timeFilter !== 'ALL_TIME'
                  ? 'Tente ajustar os filtros.' 
                  : 'Parece que você ainda não fez nenhum pedido.'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onUpdate={fetchOrders}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}