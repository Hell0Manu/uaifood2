'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface Address {
  id: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  userId: string;
}

interface AddressFormModalProps {
  onSuccess: () => void;
  addressToEdit?: Address | null;
}

export function AddressFormModal({ onSuccess, addressToEdit }: AddressFormModalProps) {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    street: '', number: '', district: '', city: '', state: '', zipCode: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (addressToEdit) {
        setFormData({
          street: addressToEdit.street,
          number: addressToEdit.number,
          district: addressToEdit.district,
          city: addressToEdit.city,
          state: addressToEdit.state,
          zipCode: addressToEdit.zipCode,
        });
      } else {
        setFormData({
          street: '', number: '', district: '', city: '', state: '', zipCode: '',
        });
      }
      setError(''); // Limpa o erro ao abrir
    }
  }, [isOpen, addressToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!user) return;

    try {
      if (addressToEdit) {
        await api.put(`/address/${addressToEdit.id}`, formData);
      } else {
        await api.post(`/address/${user.id}/`, formData);
      }
      setIsOpen(false);
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao salvar endereço.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!addressToEdit;
  const inputStyles = "bg-[#2D303E] border-[#2D303E] text-white placeholder:text-[#889898] focus:bg-[#252836] focus:ring-1 focus:ring-[#EA7C69] transition-all duration-200";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon" className="text-[#889898] hover:text-[#EA7C69] hover:bg-[#2D303E]">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="text-sm text-[#EA7C69] hover:text-[#d96a5b] px-2">
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="bg-[#1F1D2B] border-[#2D303E] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? 'Editar Endereço' : 'Adicionar Novo Endereço'}</DialogTitle>
          <DialogDescription className="text-[#889898]">
            {isEditing ? 'Altere os dados e salve.' : 'Preencha os detalhes para entrega.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input id="street" value={formData.street} onChange={handleChange} required className={inputStyles} />
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input id="number" value={formData.number} onChange={handleChange} required className={inputStyles} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="district">Bairro</Label>
            <Input id="district" value={formData.district} onChange={handleChange} required className={inputStyles} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-3 sm:col-span-1 space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" value={formData.city} onChange={handleChange} required className={inputStyles} />
            </div>
            <div className="col-span-3 sm:col-span-1 space-y-2">
              <Label htmlFor="state">UF</Label>
              <Input id="state" value={formData.state} onChange={handleChange} maxLength={2} required className={inputStyles} />
            </div>
            <div className="col-span-3 sm:col-span-1 space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" value={formData.zipCode} onChange={handleChange} required className={inputStyles} />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-400 text-center pt-2">{error}</p>}

          <DialogFooter className="pt-6">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="text-[#889898] hover:text-white hover:bg-[#2D303E]">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} className="bg-[#EA7C69] hover:bg-[#d96a5b] text-[#1F1D2B] font-bold">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Salvar Alterações' : 'Adicionar Endereço'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}