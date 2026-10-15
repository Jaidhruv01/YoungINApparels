import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';

interface WishlistContextType {
  wishlist: number[];
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (productId: number, productTitle?: string) => void;
  wishlistCount: number;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'youngin_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { showToast } = useCart();

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const isWishlisted = (productId: number) => wishlist.includes(productId);

  const toggleWishlist = (productId: number, productTitle?: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        if (productTitle && showToast) {
          showToast(`Removed from your Atelier Wishlist`);
        }
        return prev.filter((id) => id !== productId);
      } else {
        if (productTitle && showToast) {
          showToast(`Saved to your Atelier Wishlist`);
        }
        return [...prev, productId];
      }
    });
  };

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
