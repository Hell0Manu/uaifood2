// frontend/src/app/layout.tsx (CÓDIGO CORRIGIDO)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreInitializer } from '@/components/StoreInitializer';
import { cn } from "@/lib/utils";
import { LayoutContainer } from "@/components/layout/LayoutContainer"; 

export const metadata: Metadata = {
  title: "UaiFood",
  description: "Peça sua comida favorita.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased"
      )}>
        <StoreInitializer />
        
        <LayoutContainer>
          {children}
        </LayoutContainer>
        
      </body>
    </html>
  );
}