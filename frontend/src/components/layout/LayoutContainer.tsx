// frontend/src/components/layout/LayoutContainer.tsx
'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutContainerProps {
  children: React.ReactNode;
}

const publicAuthRoutes = ['/login', '/register'];

export function LayoutContainer({ children }: LayoutContainerProps) {
  const pathname = usePathname();

  const isAuthRoute = publicAuthRoutes.some(route => pathname.startsWith(route));

  if (isAuthRoute) {
    return <div className="flex-1">{children}</div>;
  }
  

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
    <main className="flex-grow p-8 bg-[#252836]">
        {children}
      </main>
    </div>
  );
}