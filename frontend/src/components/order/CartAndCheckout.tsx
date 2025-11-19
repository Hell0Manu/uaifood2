'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, Loader2, ListPlus, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AddressFormModal } from './AddressFormModal';
import { Address } from '@/types';

export function CartAndCheckout() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('PIX');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchAddresses(user.id);
    }
  }, [isAuthenticated, user?.id]);

  const fetchAddresses = async (userId: string) => {
    try {
      const response = await api.get(`/address/${userId}`);
      setAddresses(response.data);
      if (response.data.length > 0 && !selectedAddressId) {
        setSelectedAddressId(response.data[0].id);
      } else if (response.data.length > 0 && selectedAddressId) {
        const selectedStillExists = response.data.find((a) => a.id === selectedAddressId);
        if (!selectedStillExists) {
           setSelectedAddressId(response.data[0].id);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar endereços:', err);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }
    if (items.length === 0) {
      setError('Seu carrinho está vazio.');
      return;
    }
    if (!selectedAddressId) {
      setError('Selecione um endereço de entrega.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const orderData = {
        paymentMethod,
        addressId: selectedAddressId,
        items: items.map(item => ({ itemId: item.id, quantity: item.quantity })),
      };
      await api.post('/orders', orderData);
      setSuccess('Pedido realizado com sucesso! Redirecionando...');
      clearCart();
      setTimeout(() => router.push('/orders'), 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao finalizar o pedido. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const selectStyles = "w-full bg-[#2D303E] border-none text-white focus:ring-1 focus:ring-[#EA7C69]";

  return (
    <div>     
              <div>
          <h1 className="text-4xl font-bold text-white">Meus pedidos e pagamentos</h1>
          <p className="text-[#889898] mt-1">
            Gerencie seus pedidos
          </p>
        </div>

      {items.length === 0 ? (
        <div className="text-center p-8 rounded-xl text-[#889898] border border-dashed border-[#2D303E]">
           <ShoppingCart className="mx-auto h-12 w-12 mb-4 text-[#EA7C69]" />
          <p className="text-lg">Seu carrinho está vazio.</p>
           <Button 
            className="mt-6 bg-[#EA7C69] hover:bg-[#d96a5b] text-[#1F1D2B] font-bold"
            onClick={() => router.push('/')}>
            Ver Cardápio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          {/* Coluna de Itens do Carrinho */}
          <div className="md:col-span-2 ">
            <div className="bg-[#1F1D2B] rounded-xl p-4 border border-[#2D303E]">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-[#2D303E]">
                    <TableHead className="text-[#889898]">Item</TableHead>
                    <TableHead className="text-center text-[#889898]">Qtd</TableHead>
                    <TableHead className="text-right text-[#889898]">Subtotal</TableHead>
                    <TableHead className="text-right text-[#889898]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="border-b-[#2D303E]">
                      <TableCell className="font-medium text-white">{item.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="bg-[#2D303E] border-none hover:bg-[#3f4357] text-white h-8 w-8">
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-white font-bold">{item.quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-[#2D303E] border-none hover:bg-[#3f4357] text-white h-8 w-8">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-white">
                        R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-[#889898] hover:text-[#EA7C69] hover:bg-[#2D303E]">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Coluna de Checkout */}
          <div className="space-y-6">
            <div className="space-y-4 bg-[#1F1D2B] p-4 rounded-xl border border-[#2D303E]">
              <div className=" items-center justify-between">
                <Label htmlFor="address" className="text-white mb-2">Endereço</Label>
                <div className="flex items-center gap-1">
                  <AddressFormModal onSuccess={() => user?.id && fetchAddresses(user.id)} />
                   <Button variant="ghost" size="sm" onClick={() => router.push('/address')} className="text-sm text-[#EA7C69] hover:text-[#d96a5b] px-2 ">
                      <ListPlus className="h-4 w-4 mr-1" /> 
                  </Button>
                </div>
              </div>
              <Select onValueChange={setSelectedAddressId} value={selectedAddressId || ''} disabled={addresses.length === 0}>
                <SelectTrigger id="address" className={selectStyles}>
                  <SelectValue placeholder="Selecione um endereço" />
                </SelectTrigger>
                <SelectContent className="bg-[#252836] border-[#2D303E] text-white">
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id}>
                      {`${address.street}, ${address.number}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {addresses.length === 0 && <p className="text-xs text-red-400 mt-1">Nenhum endereço cadastrado.</p>}
              
              <div>
                <Label className='mb-2 text-white' htmlFor="payment">Pagamento</Label>
                <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                  <SelectTrigger id="payment" className={selectStyles}>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#252836] border-[#2D303E] text-white">
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="CREDIT">Cartão de Crédito</SelectItem>
                    <SelectItem value="DEBIT">Cartão de Débito</SelectItem>
                    <SelectItem value="CASH">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t border-[#2D303E] my-4"></div>
              
              <div className="flex justify-between items-center text-white">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span>Taxa de Entrega</span>
                <span>R$ 5,00</span>
              </div>
              <div className="flex justify-between items-center text-2xl font-bold text-white pt-2">
                <span className="text-lg">Total</span>
                <span className="text-[#EA7C69]">R$ {(total + 5).toFixed(2).replace('.', ',')}</span>
              </div>
                          <Button className="w-full bg-[#EA7C69] hover:bg-[#d96a5b] text-[#1F1D2B] font-bold text-lg h-14 transition-transform active:scale-95" onClick={handleCheckout} disabled={loading || items.length === 0 || !selectedAddressId}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Confirmar Pedido'}
            </Button>
            </div>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            {success && <p className="text-sm text-green-400 text-center">{success}</p>}


          </div>
        </div>
      )}
    </div>
  );
}