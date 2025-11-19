import { create } from "zustand";

import { persist } from "zustand/middleware";

interface Item {
  id: string;
  description: string;
  unitPrice: number;
  categoryId: string;
}

interface CartItem extends Item {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create(
  persist<CartState>(
    (set) => ({
      items: [],
      total: 0,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          let newItems: CartItem[];

          if (existingItem) {
            newItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else {
            newItems = [...state.items, { ...item, quantity: 1 }];
          }

          const newTotal = newItems.reduce(
            (sum, cartItem) => sum + cartItem.unitPrice * cartItem.quantity,
            0
          );

          return { items: newItems, total: newTotal };
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== itemId);
          const newTotal = newItems.reduce(
            (sum, cartItem) => sum + cartItem.unitPrice * cartItem.quantity,
            0
          );
          return { items: newItems, total: newTotal };
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          const newItems = state.items
            .map((i) => (i.id === itemId ? { ...i, quantity: quantity } : i))
            .filter((i) => i.quantity > 0);

          const newTotal = newItems.reduce(
            (sum, cartItem) => sum + cartItem.unitPrice * cartItem.quantity,
            0
          );

          return { items: newItems, total: newTotal };
        });
      },

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      // 3. Dê um nome para a chave no localStorage
      name: "uaifood-cart-storage",
    }
  )
);
