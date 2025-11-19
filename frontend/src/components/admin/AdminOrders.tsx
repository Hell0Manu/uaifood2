'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Eye, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { formatPrice } from '@/lib/utils';

// Tipagem dos dados (Ajustada para garantir acesso correto)
interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number | string;
  item: { description: string };
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  // Adicionei '?' para evitar erro se vier nulo
  client?: { name: string; phone: string };
  address?: {
    street: string; 
    number: string; 
    district: string; 
    city: string;
  };
  items?: OrderItem[];
}

// Mapa de Cores e Nomes para os Status
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' },
  PROCESSING: { label: 'Em Preparo', color: 'bg-blue-500/20 text-blue-500 border-blue-500/50' },
  DELIVERED: { label: 'Entregue', color: 'bg-green-500/20 text-green-500 border-green-500/50' },
  CANCELED: { label: 'Cancelado', color: 'bg-red-500/20 text-red-500 border-red-500/50' },
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      // Ordenar por data (mais recentes primeiro)
      const sorted = response.data.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Polling a cada 30s
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/orders/status/${orderId}`, { status: newStatus });
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(`Status atualizado para ${STATUS_MAP[newStatus]?.label || newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Falha ao atualizar status.");
    }
  };

  // Calcula o total do pedido com proteção contra undefined
  const calculateTotal = (items?: OrderItem[]) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((acc, curr) => acc + (Number(curr.unitPrice) * curr.quantity), 0);
  };

  return (
    <div className="space-y-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#FF8562]">Pedidos Recentes</h2>
        <Button variant="outline" size="sm" onClick={fetchOrders} className="border-[#332A3B] hover:bg-[#332A3B] hover:text-white">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <div className="rounded-md border border-[#332A3B] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#211E2C]">
            <TableRow className="border-[#332A3B] hover:bg-[#211E2C]">
              <TableHead className="text-gray-300">Data/Hora</TableHead>
              <TableHead className="text-gray-300">Cliente</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Total</TableHead>
              <TableHead className="text-right text-gray-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-500' };
              
              return (
                <TableRow key={order.id} className="border-[#332A3B] hover:bg-[#211E2C]/50">
                  <TableCell className="text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleString('pt-BR')}
                    <div className="text-[10px] opacity-50">ID: {order.id.slice(0, 8)}...</div>
                  </TableCell>
                  
                  {/* Proteção para exibir nome do cliente ou fallback */}
                  <TableCell className="text-gray-200 font-medium">
                    {order.client?.name || <span className="text-gray-500 italic">Cliente Desconhecido</span>}
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={`${statusInfo.color} border px-2 py-0.5`}>
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  
                  {/* Cálculo do total com formatação */}
                  <TableCell className="text-gray-200">
                    {formatPrice(calculateTotal(order.items))}
                  </TableCell>
                  
                  <TableCell className="text-right flex justify-end gap-2 items-center">
                    <Select 
                      value={order.status} 
                      onValueChange={(val) => handleStatusChange(order.id, val)}
                    >
                      <SelectTrigger className="w-[130px] h-8 bg-[#1A1826] border-[#332A3B] text-xs text-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#211E2C] border-[#332A3B] text-white">
                        <SelectItem value="PENDING">Pendente</SelectItem>
                        <SelectItem value="PROCESSING">Em Preparo</SelectItem>
                        <SelectItem value="DELIVERED">Entregue</SelectItem>
                        <SelectItem value="CANCELED">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-[#332A3B] text-blue-400" title="Ver Detalhes">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#1A1826] border-[#332A3B] text-white max-w-md">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Pedido</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-2">
                          <div className="p-3 bg-[#211E2C] rounded border border-[#332A3B]">
                            <h4 className="text-sm font-bold text-[#FF8562] mb-2">Cliente</h4>
                            <p className="text-sm">{order.client?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-400">{order.client?.phone || 'Sem telefone'}</p>
                          </div>

                          <div className="p-3 bg-[#211E2C] rounded border border-[#332A3B]">
                            <h4 className="text-sm font-bold text-[#FF8562] mb-2">Endereço de Entrega</h4>
                            {order.address ? (
                                <p className="text-sm text-gray-300">
                                {order.address.street}, {order.address.number} <br/>
                                {order.address.district} - {order.address.city}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Retirada no local ou sem endereço.</p>
                            )}
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-[#FF8562] mb-2">Itens</h4>
                            <ul className="space-y-2">
                                {(order.items || []).map((item, idx) => (
                                    <li key={idx} className="flex justify-between text-sm border-b border-[#332A3B] pb-2">
                                        <span>{item.quantity}x {item.item?.description || 'Item removido'}</span>
                                        <span className="text-gray-400">{formatPrice(Number(item.unitPrice) * item.quantity)}</span>
                                    </li>
                                ))}
                                {(!order.items || order.items.length === 0) && (
                                  <li className="text-sm text-gray-500 italic">Nenhum item neste pedido.</li>
                                )}
                            </ul>
                            <div className="flex justify-between mt-4 pt-2 border-t border-[#332A3B] font-bold text-lg">
                                <span>Total:</span>
                                <span>{formatPrice(calculateTotal(order.items))}</span>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
            {orders.length === 0 && !loading && (
                 <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        Nenhum pedido encontrado.
                    </TableCell>
                 </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}