'use client'; 

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore'; 
import {
  Store,
  ShoppingCart,
  ClipboardList,
  MapPin, 
  Settings,
  LogOut,
  User,
  ChefHat,
  LayoutDashboard // Importamos o ícone do Painel
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore(); // Pegamos o 'user' do store também

  // Definimos os itens básicos
  const navItems = [
    { href: '/', icon: Store, label: 'Loja' }, 
    { href: '/orders', icon: ClipboardList, label: 'Pedidos' }, 
    { href: '/cart', icon: ShoppingCart, label: 'Carrinho' }, 
    { href: '/address', icon: MapPin, label: 'Endereços' },
    { href: '/profile', icon: User, label: 'Perfil' },
    // { href: '/settings', icon: Settings, label: 'Configurações' },
  ];

  // Se for ADMIN, inserimos o Painel no começo da lista (índice 1, logo após a Loja)
  if (user?.userType === 'ADMIN') {
    navItems.splice(1, 0, { href: '/panel', icon: LayoutDashboard, label: 'Painel' });
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login'); 
  };

  return (
    <aside className="h-desktop w-25 flex flex-col items-center py-6 bg-gradient-to-b from-[#211E2C] to-[#1A1826] shadow-lg relative z-10">
      {/* Topo: Ícone da Loja */}
      <div className="relative w-14 h-14 bg-[#332A3B] rounded-xl flex items-center justify-center mb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#8B5CF6] to-transparent opacity-20 animate-pulse-slow"></div>
        <ChefHat className="w-8 h-8 text-[#FF8562]" />
      </div>

      {/* Itens de Navegação */}
      <nav className="flex flex-col items-center gap-6 flex-grow">
        {navItems.map((item) => {
          const isRootLink = item.href === '/';
          const isActive = isRootLink
            ? pathname === item.href
            : pathname.startsWith(item.href);
          
          return (
            <Link key={item.href} href={item.href} className="relative group" title={item.label}>
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#FF8562] text-white shadow-lg' 
                    : 'text-[#FF8562]/60 hover:text-[#FF8562] hover:bg-[#332A3B]' 
                }`}
              >
                <item.icon className={`w-7 h-7 ${isActive ? 'drop-shadow-sm' : ''}`} />
              </div>
              {isActive && (
                <>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FF8562] rounded-full filter blur-md opacity-30"></div>
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-10 bg-[#FF8562] rounded-l-full filter blur-sm opacity-50"></div>
                  <div className="absolute -right-0.5 top-1/2 -translate-y-1/2  h-20 bg-[#FF8562] rounded-l-full"></div>
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Botão de Logout */}
      <div className="mt-auto relative group">
        <button
          onClick={handleLogout} 
          className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-200 text-[#FF8562]/60 hover:text-white hover:bg-[#FF8562] hover:shadow-lg"
        >
          <LogOut className="w-7 h-7" />
        </button>
      </div>
    </aside>
  );
}