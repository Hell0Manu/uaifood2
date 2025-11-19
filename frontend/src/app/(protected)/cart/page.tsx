import { CartAndCheckout } from '@/components/order/CartAndCheckout';

export default function CartPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Carrinho de Compras</h1>
      <CartAndCheckout />
    </div>
  );
}
