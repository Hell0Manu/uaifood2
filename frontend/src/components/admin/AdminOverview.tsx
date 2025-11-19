'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, ShoppingBag, Activity, Loader2, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from "sonner";

export function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalItems: 0,
    activeOrders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscamos tudo em paralelo para ser mais rápido
        const [ordersRes, usersRes, itemsRes] = await Promise.all([
          api.get('/orders'),
          api.get('/users'),
          api.get('/items')
        ]);

        const orders = ordersRes.data || [];
        const users = usersRes.data || [];
        const items = itemsRes.data || [];

        // Cálculos
        // 1. Faturamento Total (Soma de pedidos não cancelados)
        const revenue = orders
          .filter((o: any) => o.status !== 'CANCELED')
          .reduce((acc: number, order: any) => {
            const orderTotal = (order.items || []).reduce((sum: number, item: any) => {
              return sum + (Number(item.unitPrice) * item.quantity);
            }, 0);
            return acc + orderTotal;
          }, 0);

        // 2. Pedidos Ativos (Pendentes ou Em Preparo)
        const active = orders.filter((o: any) => 
          ['PENDING', 'PROCESSING'].includes(o.status)
        ).length;

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalItems: items.length,
          activeOrders: active
        });

      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
        toast.error("Não foi possível carregar o resumo.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#EA7C69]" />
        <span className="ml-3 text-lg text-[#889898]">Carregando dashboard...</span>
      </div>
    );
  }

  const cards = [
    {
      title: "Faturamento Total",
      value: formatPrice(stats.totalRevenue),
      description: "Vendas confirmadas + taxa de entrega",
      icon: DollarSign,
      color: "text-green-400",
      bgGradient: "from-green-500/10 to-emerald-500/5",
      border: "border-green-500/20"
    },
    {
      title: "Pedidos Ativos",
      value: stats.activeOrders,
      description: "Aguardando ou em preparo",
      icon: Activity,
      color: "text-[#EA7C69]",
      bgGradient: "from-[#EA7C69]/10 to-orange-600/5",
      border: "border-[#EA7C69]/30"
    },
    {
      title: "Total de Pedidos",
      value: stats.totalOrders,
      description: "Desde o lançamento da loja",
      icon: ShoppingBag,
      color: "text-blue-400",
      bgGradient: "from-blue-500/10 to-cyan-500/5",
      border: "border-blue-500/20"
    },
    {
      title: "Clientes Cadastrados",
      value: stats.totalUsers,
      description: "Usuários na plataforma",
      icon: Users,
      color: "text-purple-400",
      bgGradient: "from-purple-500/10 to-pink-500/5",
      border: "border-purple-500/20"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Visão Geral da Loja
        </h2>
        <div className="flex items-center gap-2 text-sm text-[#889898]">
          <TrendingUp className="h-5 w-5 text-green-400" />
          <span>Atualizado agora</span>
        </div>
      </div>

      {/* Grid de Cards Premium */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`
              group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${card.bgGradient} ${card.border}
              p-6 backdrop-blur-xl transition-all duration-300
              hover:shadow-2xl hover:shadow-${card.color.split('-')[1]}-500/10
              hover:border-${card.color.split('-')[1]}-500/40 hover:scale-[1.02]
            `}
          >
            {/* Fundo com glow sutil no hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`absolute -top-10 -right-10 h-40 w-40 rounded-full bg-${card.color.split('-')[1]}-500/20 blur-3xl`} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-[#889898]">
                  {card.title}
                </span>
                <card.icon className={`h-5 w-5 ${card.color} opacity-80`} />
              </div>

              <div className="space-y-1">
                <div className={`text-3xl font-bold text-white`}>
                  {card.value}
                </div>
                <p className="text-xs text-[#889898]/80">
                  {card.description}
                </p>
              </div>
            </div>

            {/* Linha decorativa inferior */}
            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-${card.color.split('-')[1]}-500/30 to-transparent`} />
          </div>
        ))}
      </div>

      {/* Card de dica com estilo premium */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2D303E] bg-[#1F1D2B]/50 backdrop-blur-sm p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EA7C69]/10 text-[#EA7C69]">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              Dica do dia
            </p>
            <p className="mt-1 text-sm text-[#889898]">
              Atualize rapidamente os pedidos em preparo para "Entregue". Isso libera o faturamento no dashboard e melhora a experiência do cliente!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}