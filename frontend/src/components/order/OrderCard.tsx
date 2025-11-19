'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle, XCircle, Loader2 } from 'lucide-react';
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

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  item: { description: string };
}

export interface Order {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELED';
  createdAt: string;
  paymentMethod: string;
  items: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  onUpdate: () => void;
}

const STATUS_MAP = {
  PENDING: { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  PROCESSING: { label: 'Em Preparo', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  DELIVERED: { label: 'Entregue', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  CANCELED: { label: 'Cancelado', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
};

const PAYMENT_MAP: Record<string, string> = {
  CREDIT: 'Cartão de Crédito',
  DEBIT: 'Cartão de Débito',
  PIX: 'PIX',
  CASH: 'Dinheiro',
};

export function OrderCard({ order, onUpdate }: OrderCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: 'DELIVERED' | 'CANCELED') => {
    try {
      setIsLoading(true);
      await api.patch(`/orders/status/${order.id}`, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((acc, curr) => acc + parseFloat(curr.unitPrice) * curr.quantity, 0);
  };

  return (
    <div className="bg-[#1F1D2B] rounded-xl border border-[#2D303E] overflow-hidden transition-all duration-200 hover:border-[#3f4357]">
      <div className="bg-[#2D303E]/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EA7C69]/20 text-[#EA7C69]">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Pedido #{order.id.substring(0, 8)}</p>
              <p className="text-xs text-[#889898]">
                {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <Badge className={`border ${STATUS_MAP[order.status].color} py-1 px-3 text-xs font-semibold`}>
            {STATUS_MAP[order.status].label}
          </Badge>
        </div>
      </div>

      <div className="p-4">
      <div className="mb-4 space-y-2">
        {(order.items ?? []).map((orderItem) => (
          <div key={orderItem.id} className="flex justify-between text-sm">
            <span className="text-white">
              <span className="font-semibold text-[#EA7C69]">{orderItem.quantity}x</span>{' '}
              {orderItem.item.description}
            </span>
            <span className="text-[#889898]">
              R$ {(parseFloat(orderItem.unitPrice) * orderItem.quantity).toFixed(2).replace('.', ',')}
            </span>
          </div>
        ))}

        {(!order.items || order.items.length === 0) && (
          <p className="text-sm text-[#889898] italic">Nenhum item no pedido</p>
        )}
      </div>
        <div className="border-t border-[#2D303E] pt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#889898]">
              Pagamento: <span className="font-medium text-white">{PAYMENT_MAP[order.paymentMethod]}</span>
            </div>
            <div className="text-lg font-bold text-[#EA7C69]">
              Total: R$ {calculateTotal(order.items).toFixed(2).replace('.', ',')}
            </div>
          </div>
          
          {order.status === 'PROCESSING' && (
            <div className="flex justify-end gap-3 pt-3 border-t border-dashed border-[#2D303E]">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-400 hover:bg-red-500/10 border-red-500/30 hover:text-red-300" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                    Cancelar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#1F1D2B] border-[#2D303E] text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription className="text-[#889898]">
                      Você está prestes a cancelar este pedido. Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-[#2D303E] border-none hover:bg-[#3f4357]">Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleStatusChange('CANCELED')} className="bg-red-600 hover:bg-red-700">
                      Sim, cancelar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Confirmar Entrega
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#1F1D2B] border-[#2D303E] text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Entrega</AlertDialogTitle>
                    <AlertDialogDescription className="text-[#889898]">
                      Confirme apenas se você já recebeu todos os itens do pedido.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-[#2D303E] border-none hover:bg-[#3f4357]">Ainda não recebi</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleStatusChange('DELIVERED')} className="bg-green-600 hover:bg-green-700">
                      Recebi
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}