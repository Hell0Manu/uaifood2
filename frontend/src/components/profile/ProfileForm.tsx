'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

export function ProfileForm() {
  const { user, login } = useAuthStore(); // 'login' aqui serve para atualizar o estado global
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
  });

  // Carrega os dados quando o componente monta ou o user muda
  useEffect(() => {
    if (user) {
      // Formata a data para o input (YYYY-MM-DD)
      let formattedDate = '';
      if (user.birthDate) {
        const dateObj = new Date(user.birthDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      }

      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: formattedDate,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!user?.id) return;

    try {
      // Prepara o payload (apenas campos preenchidos)
      const payload: any = {
        name: formData.name,
        phone: formData.phone,
        // O email geralmente não se altera assim, mas deixamos aqui se sua regra permitir
        // email: formData.email, 
      };

      if (formData.birthDate) {
        payload.birthDate = formData.birthDate;
      }

      // Chama a API: PUT /users/:id
      // Nota: Usando a rota correta que definimos no back-end
      const response = await api.put(`/users/${user.id}`, payload);

      // Atualiza a store local com os novos dados retornados
      // Precisamos manter o token antigo
      const token = localStorage.getItem('uaifood-token');
      if (token) {
        login(token, response.data);
      }

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      const errorMsg = error.response?.data?.error || 'Erro ao atualizar perfil.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>Atualize seus dados de cadastro.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={formData.email} 
                disabled 
                className="bg-gray-100 cursor-not-allowed"
                title="O email não pode ser alterado por aqui."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input 
                id="birthDate" 
                type="date" 
                value={formData.birthDate} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* Mensagens de Feedback Inline */}
          {message && (
            <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}