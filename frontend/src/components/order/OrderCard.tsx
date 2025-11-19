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

// --- Tipos Locais ---
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
  onUpdate: () => void; // Função para recarregar a lista após update
}

// --- Constantes Visuais ---
const STATUS_MAP = {
  PENDING: { label: 'Pendente', color: 'bg-yellow-500 hover:bg-yellow-600' },
  PROCESSING: { label: 'Em Preparo', color: 'bg-blue-500 hover:bg-blue-600' },
  DELIVERED: { label: 'Entregue', color: 'bg-green-500 hover:bg-green-600' },
  CANCELED: { label: 'Cancelado', color: 'bg-red-500 hover:bg-red-600' },
};

const PAYMENT_MAP: Record<string, string> = {
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  PIX: 'PIX',
  CASH: 'Dinheiro',
};

export function OrderCard({ order, onUpdate }: OrderCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Função para alterar status
  const handleStatusChange = async (newStatus: 'DELIVERED' | 'CANCELED') => {
    try {
      setIsLoading(true);
      await api.patch(`/orders/status/${order.id}`, { status: newStatus });
      onUpdate(); // Recarrega a lista pai
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((acc, curr) => {
      return acc + parseFloat(curr.unitPrice) * curr.quantity;
    }, 0);
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="bg-gray-50/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Pedido #{order.id}</CardTitle>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <Badge className={`${STATUS_MAP[order.status].color} border-none`}>
            {STATUS_MAP[order.status].label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="mb-4 space-y-1">
          <p className="text-sm font-medium text-gray-500 mb-2">Resumo do Pedido:</p>
          {order.items.map((orderItem) => (
            <div key={orderItem.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                <span className="font-semibold">{orderItem.quantity}x</span> {orderItem.item.description}
              </span>
              <span className="text-gray-500">
                R$ {(parseFloat(orderItem.unitPrice) * orderItem.quantity).toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Pagamento: <span className="font-medium text-gray-900">{PAYMENT_MAP[order.paymentMethod]}</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              Total: R$ {calculateTotal(order.items).toFixed(2).replace('.', ',')}
            </div>
          </div>

          {/* --- BOTÕES DE AÇÃO DO CLIENTE (Só aparecem se PROCESSING) --- */}
          {order.status === 'PROCESSING' && (
            <div className="flex justify-end gap-3 pt-2 border-t border-dashed">
              
              {/* Botão Cancelar */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 border-red-200" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                    Cancelar Pedido
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você está prestes a cancelar este pedido. Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleStatusChange('CANCELED')} className="bg-red-600 hover:bg-red-700">
                      Sim, cancelar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Botão Confirmar Entrega */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Confirmar Recebimento
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Entrega</AlertDialogTitle>
                    <AlertDialogDescription>
                      Confirme apenas se você já recebeu todos os itens do pedido. Isso finalizará o processo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Ainda não recebi</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleStatusChange('DELIVERED')} className="bg-green-600 hover:bg-green-700">
                      Sim, recebi tudo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}