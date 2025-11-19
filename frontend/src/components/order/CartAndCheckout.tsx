'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@//components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, Loader2, ListPlus } from 'lucide-react';
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
        const selectedStillExists = response.data.find((a: { id: string; }) => a.id === selectedAddressId);
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
      router.push('/login');
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
        paymentMethod: paymentMethod,
        addressId: selectedAddressId,
        items: items.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
        })),
      };

      await api.post('/orders', orderData);
      
      setSuccess('Pedido realizado com sucesso!');
      clearCart();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao finalizar o pedido. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Carrinho</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Preço Unitário</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-center">R$ {parseFloat((item.unitPrice).toString()).toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const q = parseInt(e.target.value);
                            if (!isNaN(q) && q >= 1) {
                              updateQuantity(item.id, q);
                            }
                          }}
                          className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right text-xl text-green-600">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="address">Endereço de Entrega</Label>
                  
                  <div className="flex items-center gap-2">
                    {/* Botão 1: Adicionar Endereço (Modal) */}
                    <AddressFormModal onSuccess={() => user?.id && fetchAddresses(user.id)} />
                    
                    {/* Botão 2: Gerenciar Endereços (Link para a página) */}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.push('/address')}
                        className="text-sm text-red-600 hover:text-red-700"
                    >
                        <ListPlus className="h-4 w-4 mr-1" /> Gerenciar
                    </Button>
                  </div>
                </div>

                <Select
                  onValueChange={setSelectedAddressId}
                  value={selectedAddressId || ''}
                  disabled={addresses.length === 0}
                >
                  <SelectTrigger id="address">
                    <SelectValue placeholder="Selecione um endereço" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {`${address.street}, ${address.number} - ${address.district}, ${address.city}/${address.state}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {addresses.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">Nenhum endereço cadastrado. Use o botão Adicionar para continuar.</p>
                )}

              <div className="mt-4">
                <Label className='mb-2' htmlFor="payment">Método de Pagamento</Label>
                <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                  <SelectTrigger id="payment">
                    <SelectValue placeholder="Selecione o método de pagamento" />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="CREDIT">Cartão de Crédito</SelectItem>
                    <SelectItem value="DEBIT">Cartão de Débito</SelectItem>
                    <SelectItem value="CASH">Dinheiro (Pagamento na Entrega)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
              {success && <p className="text-sm text-green-500 mt-4">{success}</p>}

              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={loading || items.length === 0 || !selectedAddressId}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Finalizar Pedido'
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
