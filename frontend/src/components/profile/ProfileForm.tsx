'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';

export function ProfileForm() {
  const { user, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', birthDate: '',
  });

  useEffect(() => {
    if (user) {
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
      const payload: any = {
        name: formData.name,
        phone: formData.phone,
      };
      if (formData.birthDate) {
        payload.birthDate = formData.birthDate;
      }

      const response = await api.put(`/users/${user.id}`, payload);
      const token = localStorage.getItem('uaifood-token');
      if (token) {
        login(token, response.data);
      }
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Erro ao atualizar perfil.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "bg-[#2D303E] border-[#2D303E] text-white placeholder:text-[#889898] focus:bg-[#252836] focus:ring-1 focus:ring-[#EA7C69] transition-all duration-200 h-12";

  return (
    <div >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Nome Completo</Label>
            <Input id="name" value={formData.name} onChange={handleChange} placeholder="Seu nome" className={inputStyles + ' bg-[#1F1D2B]'} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input id="email" value={formData.email} disabled className="bg-[#1F1D2B] cursor-not-allowed border-none text-[#889898] h-12" title="O email não pode ser alterado." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Telefone</Label>
            <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" className={inputStyles + ' bg-[#1F1D2B]'} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-white">Data de Nascimento</Label>
            <Input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} className={inputStyles + ' date-picker-style bg-[#1F1D2B]'} />
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
            {message.text}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="bg-[#EA7C69] hover:bg-[#d96a5b] text-[#1F1D2B] font-bold h-12 px-6">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}