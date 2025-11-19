"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/dist/client/link";

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
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login UaiFood</CardTitle>
        <CardDescription>
          Entre com seu email e senha para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Entrar
            </Button>

            <p className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="font-medium text-red-600 hover:underline"
              >
                Registre-se
              </Link>
            </p>
            
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
