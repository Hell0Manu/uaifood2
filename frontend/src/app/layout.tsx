import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreInitializer } from '@/components/StoreInitializer';
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UaiFood - Plataforma de Venda de Alimentos",
  description: "A sua plataforma de delivery de comida favorita.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased flex flex-col",
        inter.className
      )}>
        <StoreInitializer />
        <Header />
          <main className="container mx-auto p-4 flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
