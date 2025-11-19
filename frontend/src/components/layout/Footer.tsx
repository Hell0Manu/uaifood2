import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6 mt-auto">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        
        {/* Copyright */}
        <p className="text-center text-sm text-gray-500 md:text-left">
          &copy; {new Date().getFullYear()} UaiFood. Todos os direitos reservados.
        </p>

        {/* Links Legais/Úteis */}
        <nav className="flex gap-6 text-sm text-gray-500">
          <Link href="#" className="hover:text-gray-900 hover:underline transition-colors">
            Termos de Uso
          </Link>
          <Link href="#" className="hover:text-gray-900 hover:underline transition-colors">
            Privacidade
          </Link>
          <Link href="#" className="hover:text-gray-900 hover:underline transition-colors">
            Ajuda
          </Link>
        </nav>

        {/* Ícones Sociais (Discretos) */}
        <div className="flex gap-4">
          <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
            <Instagram className="h-4 w-4" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
            <Facebook className="h-4 w-4" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}