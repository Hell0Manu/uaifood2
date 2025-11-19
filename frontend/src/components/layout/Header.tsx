'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ShoppingCart,
  LogOut,
  UserCircle,
  ClipboardList,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleProtectedLink = (href: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${href}`);
    } else {
      router.push(href);
    }
  };

  const handleLoginClick = () => {
    if (pathname !== '/login' && pathname !== '/register') {
      router.push(`/login?redirect=${pathname}`);
    } else {
      router.push('/login');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex w-full justify-center border-b bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
          <Image
            src="./images/LogoHorizontalDestaque.svg"
            alt="UaiFood Logo"
            width={120}
            height={40}
            priority
            style={{ objectFit: 'contain' }}
          />
        </Link>

        {/* --- Ações (Direita) --- */}
        <nav className="flex items-center gap-4">
          {/* Carrinho */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 hover:text-red-600 hover:bg-red-50"
            onClick={() => handleProtectedLink('/cart')}
            aria-label="Carrinho de Compras"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-sm ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
          </Button>

          {/* Autenticação */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 rounded-full hover:bg-gray-100">
                  <span className="hidden text-sm font-medium text-gray-700 sm:inline-block">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <Avatar className="h-9 w-9 border border-gray-200">
                    <AvatarImage src="" alt={user?.name || 'Usuário'} />
                    <AvatarFallback className="bg-red-100 text-red-700 font-bold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/my-orders">
                  <DropdownMenuItem className="cursor-pointer">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    <span>Meus Pedidos</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleLoginClick}
                className="text-gray-600 hover:text-red-600 font-medium"
              >
                Entrar
              </Button>
              <Link href="/register">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-md hover:shadow-lg transition-all">
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}