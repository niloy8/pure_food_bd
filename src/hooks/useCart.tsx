import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product } from '@/types';
import * as storage from '@/services/storage';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setCart(storage.getCart());
  }, []);

  useEffect(() => {
    setTotal(storage.getCartTotal());
    setItemCount(storage.getCartItemCount());
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    storage.addToCart(product, quantity);
    setCart(storage.getCart());
  };

  const removeFromCart = (productId: string) => {
    storage.removeFromCart(productId);
    setCart(storage.getCart());
  };

  const updateQuantity = (productId: string, quantity: number) => {
    storage.updateCartQuantity(productId, quantity);
    setCart(storage.getCart());
  };

  const clearCart = () => {
    storage.clearCart();
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
