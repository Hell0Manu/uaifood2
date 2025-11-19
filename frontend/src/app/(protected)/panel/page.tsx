'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { AdminCategories } from "@/components/admin/AdminCategories";
import { AdminItems } from "@/components/admin/AdminItems"; 
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminOrders } from "@/components/admin/AdminOrders";
// 1. Importe o novo componente 👇
import { AdminOverview } from "@/components/admin/AdminOverview";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.userType !== 'ADMIN') {
        router.push('/'); 
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user || user.userType !== 'ADMIN') {
    return <div className="flex h-screen items-center justify-center text-[#FF8562]">Carregando painel...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-white">Painel Administrativo</h1>
      <p className="text-gray-400 mb-8">Gerencie sua loja, cardápio e pedidos em um só lugar.</p>

      {/* 'overview' será a aba padrão agora */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-[#211E2C] text-gray-400 p-1 h-auto">
           {/* Nova Aba Visão Geral */}
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-[#FF8562] data-[state=active]:text-white">Visão Geral</TabsTrigger>
          <TabsTrigger value="orders" className="text-white data-[state=active]:bg-[#FF8562] data-[state=active]:text-white">Pedidos</TabsTrigger>
          <TabsTrigger value="items" className="text-white data-[state=active]:bg-[#FF8562] data-[state=active]:text-white">Produtos</TabsTrigger>
          <TabsTrigger value="categories" className="text-white data-[state=active]:bg-[#FF8562] data-[state=active]:text-white">Categorias</TabsTrigger>
          <TabsTrigger value="users" className="text-white data-[state=active]:bg-[#FF8562] data-[state=active]:text-white">Usuários</TabsTrigger>
        </TabsList>

        {/* Conteúdo da Aba Visão Geral */}
        <TabsContent value="overview" className="mt-6">
           <AdminOverview />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
           <AdminOrders />
        </TabsContent>
        
        <TabsContent value="items" className="mt-6">
            <AdminItems />
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
            <AdminCategories />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
            <AdminUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}