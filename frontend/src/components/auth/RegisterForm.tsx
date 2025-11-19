'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function RegisterForm() {
  // Estados para todos os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // 1. Validação de front-end (ex: senhas)
    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      setIsLoading(false);
      return;
    }

    try {
      // 2. Chama a API de registro do back-end
      await api.post('/register', {
        name,
        email,
        password,
        phone,
        birthDate, // O input type="date" já envia no formato YYYY-MM-DD
      });

      // 3. Sucesso
      setSuccess('Conta criada com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000); // Aguarda 2s para o usuário ler a mensagem

    } catch (err: any) {
      // 4. Tratamento de Erro
      // (Pega o erro do Zod ou do Service, ex: "Email já em uso")
      const errorMessage = err.response?.data?.error || 'Erro ao criar conta. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>
          Preencha seus dados para se registrar no UaiFood.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            {/* --- Campo Nome --- */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* --- Campo Email --- */}
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

            {/* --- Campo Telefone --- */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Telefone (Celular)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(34) 99999-8888"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* --- Campo Data de Nascimento --- */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            {/* --- Campo Senha --- */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* --- Campo Confirmar Senha --- */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* --- Feedback --- */}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Conta'}
            </Button>
            
            <p className="text-center text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-medium text-red-600 hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}