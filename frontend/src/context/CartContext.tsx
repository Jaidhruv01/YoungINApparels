import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartState } from '../types';
import { api } from '../services/api';

interface CartContextType {
  cart: CartState | null;
  loading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (variantId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getOrCreateSessionId(): string {
  let id = localStorage.getItem('yin_session_id');
  if (!id) {
    id = 'yin_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
    localStorage.setItem('yin_session_id', id);
  }
  return id;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId] = useState<string>(getOrCreateSessionId);
  const [cart, setCart] = useState<CartState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const refreshCart = async () => {
    try {
      const data = await api.getCart(sessionId);
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [sessionId]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (variantId: number, quantity: number = 1) => {
    try {
      setLoading(true);
      const updated = await api.addToCart(sessionId, variantId, quantity);
      setCart(updated);
      setIsCartOpen(true);
      showToast('Garment added to your bag');
    } catch (err: any) {
      alert(err.message || 'Failed to add item to bag');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setLoading(true);
      const updated = await api.updateCartItem(sessionId, itemId, quantity);
      setCart(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setLoading(true);
      const updated = await api.removeCartItem(sessionId, itemId);
      setCart(updated);
      showToast('Item removed from bag');
    } catch (err: any) {
      console.error('Failed to remove item:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const updated = await api.clearCart(sessionId);
      setCart(updated);
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
