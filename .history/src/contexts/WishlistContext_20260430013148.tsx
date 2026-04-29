import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface WishlistItem {
  _id: string;
  itemId: string;
  itemType: 'flight' | 'hotel';
}

interface WishlistContextType {
  wishlistIds: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (itemId: string, itemType: 'flight' | 'hotel') => Promise<void>;
  removeFromWishlist: (itemId: string, itemType: 'flight' | 'hotel') => Promise<void>;
  isItemInWishlist: (itemId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<number>(0);

  const fetchWishlistIds = useCallback(async (token: string, force = false) => {
    // Basic throttle: don't fetch more than once every 5 seconds unless forced
    const now = Date.now();
    if (!force && lastFetched && now - lastFetched < 5000) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/ids', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistIds(Array.isArray(data) ? data : []);
        setLastFetched(now);
      }
    } catch (err) {
      console.error('Error fetching wishlist IDs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [lastFetched]);

  useEffect(() => {
    if (user && token) {
      fetchWishlistIds(token);
    } else {
      setWishlistIds([]);
      setLastFetched(0);
    }
  }, [user, token]);

  const addToWishlist = async (itemId: string, itemType: 'flight' | 'hotel') => {
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemType, itemId })
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistIds(prev => [...prev, { _id: data._id, itemId, itemType }]);
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      throw err;
    }
  };

  const removeFromWishlist = async (itemId: string, itemType: 'flight' | 'hotel') => {
    if (!token) return;

    const item = wishlistIds.find(i => i.itemId === itemId && i.itemType === itemType);
    if (!item) return;

    try {
      const res = await fetch(`/api/wishlist/${item._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setWishlistIds(prev => prev.filter(i => i._id !== item._id));
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      throw err;
    }
  };

  const isItemInWishlist = (itemId: string) => {
    return wishlistIds.some(i => i.itemId === itemId);
  };

  const refreshWishlist = async () => {
    if (token) {
      await fetchWishlistIds(token, true);
    }
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistIds, 
      isLoading, 
      addToWishlist, 
      removeFromWishlist, 
      isItemInWishlist,
      refreshWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
