"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link"; 
import { ChefHat } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();

  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;
      login(token, user);

      const redirectPath = searchParams.get('redirect');

      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Erro ao fazer login. Verifique suas credenciais.";
      setError(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-[#1F1D2B] p-8 shadow-2xl space-y-6 border-2 border-[#2D303E]">
      <div className="text-center">
        <div className="inline-block bg-[#2D303E] p-3 rounded-full mb-4">
          <ChefHat className="h-8 w-8 text-[#EA7C69]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Bem-vindo!</h1>
        <p className="text-[#889898]">
          Entre com seu email e senha para continuar.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#2D303E] border-[#2D303E] text-white placeholder:text-[#889898] focus:bg-[#252836] focus:ring-2 focus:ring-[#EA7C69] transition-all duration-200 h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#2D303E] border-[#2D303E] text-white placeholder:text-[#889898] focus:bg-[#252836] focus:ring-2 focus:ring-[#EA7C69] transition-all duration-200 h-12"
          />
        </div>

        {error && <p className="text-sm text-red-400 text-center pt-2">{error}</p>}
        
        <Button 
          type="submit" 
          className="w-full bg-[#EA7C69] hover:bg-[#d96a5b] text-[#1F1D2B] font-bold text-lg h-14 transition-transform active:scale-95"
        >
          Entrar
        </Button>

        <p className="text-center text-sm text-[#889898]">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="font-medium text-[#EA7C69] hover:underline"
          >
            Registre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
