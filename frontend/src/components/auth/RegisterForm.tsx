'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/register', {
        name,
        email,
        password,
        phone,
        birthDate,
      });

      setSuccess('Conta criada com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar conta. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "bg-[#2D303E] border-[#2D303E] text-white placeholder:text-[#889898] focus:bg-[#252836] focus:ring-2 focus:ring-[#EA7C69] transition-all duration-200 h-12";

  return (
    <div className="w-full max-w-md rounded-2xl bg-[#1F1D2B] p-8 shadow-2xl space-y-6 border-2 border-[#2D303E]">
      <div className="text-center">
        <div className="inline-block bg-[#2D303E] p-3 rounded-full mb-4">
          <UserPlus className="h-8 w-8 text-[#EA7C69]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Crie sua Conta</h1>
        <p className="text-[#889898]">
          Junte-se a nós e peça suas comidas favoritas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- Grid com 2 colunas para campos menores --- */}
        <div className=" ">
          <div className="space-y-2 mb-3">
            <Label htmlFor="name" className="text-white">Nome</Label>
            <Input id="name" type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required className={inputStyles} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Telefone</Label>
            <Input id="phone" type="tel" placeholder="(34) 9..." value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputStyles} />
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input id="email" type="email" placeholder="seu.email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputStyles} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate" className="text-white">Data de Nascimento</Label>
          <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required className={inputStyles + " date-picker-style"} />
        </div>

        <div className="mt-6">
          <div className="space-y-2 mb-3">
            <Label htmlFor="password" className="text-white">Senha</Label>
            <Input id="password" type="password" placeholder="Mín. 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputStyles} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
            <Input id="confirmPassword" type="password" placeholder="Repita a senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputStyles} />
          </div>
        </div>

        {error && <p className="text-sm text-red-400 text-center pt-2">{error}</p>}
        {success && <p className="text-sm text-green-400 text-center pt-2">{success}</p>}

        <Button type="submit" className="w-full bg-[#EA7C69] hover:bg-[#d96a5b] text-[#1F1D2B] font-bold text-lg h-14 transition-transform active:scale-95" disabled={isLoading}>
          {isLoading ? 'Criando...' : 'Criar Conta'}
        </Button>
        
        <p className="text-center text-sm text-[#889898]">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-[#EA7C69] hover:underline">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );
}