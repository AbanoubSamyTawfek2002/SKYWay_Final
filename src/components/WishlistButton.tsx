import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useWishlist } from '../contexts/WishlistContext';
import { toast } from 'sonner';

interface WishlistButtonProps {
  itemType: 'flight' | 'hotel';
  itemId: string;
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ itemType, itemId, className }) => {
  const { user } = useAuth();
  const { isItemInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isSaved = isItemInWishlist(itemId);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save items');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        await removeFromWishlist(itemId, itemType);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(itemId, itemType);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80 transition-all ${className}`}
      onClick={toggleWishlist}
      disabled={loading}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isSaved ? 'saved' : 'unsaved'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
          />
        </motion.div>
      </AnimatePresence>
    </Button>
  );
};
