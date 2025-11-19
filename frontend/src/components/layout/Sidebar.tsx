// frontend/src/components/layout/Sidebar.tsx (CÓDIGO CORRIGIDO)
'use client'; 

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore'; 
import {
  Home,
  Store,
  ShoppingCart,
  ClipboardList,
  MapPin, 
  Settings,
  LogOut,
  User,
  ChefHat, 
} from 'lucide-react';

const navItems = [
  // Loja deve ser o primeiro item para o check de "Home" ser mais limpo
  { href: '/', icon: Store, label: 'Loja' }, 
  { href: '/orders', icon: ClipboardList, label: 'Pedidos' }, 
  { href: '/cart', icon: ShoppingCart, label: 'Carrinho' }, 
  { href: '/address', icon: MapPin, label: 'Endereços' },
  { href: '/profile', icon: User, label: 'Perfil' },
  { href: '/settings', icon: Settings, label: 'Configurações' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout); 

  const handleLogout = async () => {
    await logout();
    router.push('/login'); 
  };

  return (
    <aside className="h-desktop w-25 flex flex-col items-center py-6 bg-gradient-to-b from-[#211E2C] to-[#1A1826] shadow-lg relative z-10">
      {/* Topo: Ícone da Loja */}
      <div className="relative w-14 h-14 bg-[#332A3B] rounded-xl flex items-center justify-center mb-10 overflow-hidden">
        {/* Adiciona um gradiente para o efeito de "brilho" da imagem */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#8B5CF6] to-transparent opacity-20 animate-pulse-slow"></div>
        <ChefHat className="w-8 h-8 text-[#FF8562]" />
      </div>

      {/* Itens de Navegação */}
      <nav className="flex flex-col items-center gap-6 flex-grow">
        {navItems.map((item) => {
          
          // LÓGICA CORRIGIDA PARA ATIVAÇÃO:
          const isRootLink = item.href === '/';
          
          const isActive = isRootLink
            ? pathname === item.href // Se for o link raiz, verifica se o pathname é EXATAMENTE '/'
            : pathname.startsWith(item.href); // Para os outros links, usa startsWith
          
          return (
            <Link key={item.href} href={item.href} className="relative group">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#FF8562] text-white shadow-lg' 
                    : 'text-[#FF8562]/60 hover:text-[#FF8562] hover:bg-[#332A3B]' 
                }`}
              >
                <item.icon className={`w-7 h-7 ${isActive ? 'drop-shadow-sm' : ''}`} />
              </div>
              {/* Efeito de onda na lateral (parte da imagem) */}
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