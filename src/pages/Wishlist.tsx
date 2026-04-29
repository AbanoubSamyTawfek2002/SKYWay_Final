import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Heart, Plane, Hotel, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { toast } from 'sonner';
import { getFlightImage } from '../lib/imageUtils';

export default function Wishlist() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { formatPrice } = useCurrency();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [token]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      const res = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setItems(items.filter(i => i._id !== id));
        toast.success('Removed from wishlist');
      }
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return (
    <div className="container mx-auto p-20 text-center flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-bold italic uppercase tracking-widest text-xs">Loading your favorites...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-4 italic">Your Collection</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none italic">My Wishlist</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-32 text-center border-2 border-dashed border-muted/20 rounded-[40px] bg-muted/5 flex flex-col items-center gap-6"
            >
              <Heart className="w-20 h-20 text-muted-foreground opacity-20" />
              <div className="space-y-2">
                <p className="text-2xl font-black uppercase italic tracking-tighter">Your wishlist is empty</p>
                <p className="text-muted-foreground italic">Start saving your dream flights and hotels today!</p>
              </div>
              <Button onClick={() => navigate('/')} className="rounded-full px-10 h-14 font-black uppercase tracking-widest gap-2">
                Explore Destinations <ArrowRight size={18} />
              </Button>
            </motion.div>
          ) : items.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-none shadow-2xl bg-background/50 backdrop-blur rounded-[30px] group h-full flex flex-col">
                <div className="aspect-[16/10] relative overflow-hidden">
                  {item.itemType === 'flight' ? (
                      <div className="w-full h-full relative">
                         <img src={getFlightImage(item.details?.arrivalCity, item.details?.image, item.itemId)} alt={item.details?.arrivalCity} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                         <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                            {item.details?.airlineLogo ? (
                               <div className="bg-white p-1 rounded"><img src={item.details?.airlineLogo} alt={item.details?.airline} className="h-6 w-auto object-contain" /></div>
                            ) : (
                               <Plane className="w-6 h-6 text-white opacity-80" />
                            )}
                            <span className="text-white font-bold text-sm leading-tight drop-shadow-md">{item.details?.airline || item.details?.airline}</span>
                         </div>
                      </div>
                  ) : (
                      <img 
                        src={item.itemType === 'hotel' ? item.details?.images?.[0] : "https://images.unsplash.com/photo-1436491865332-7a61a109ce05?auto=format&fit=crop&w=800&q=80"} 
                        alt={item.details?.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                  )}
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-background/90 backdrop-blur text-foreground font-black px-4 py-1.5 rounded-full border-none shadow-lg items-center gap-2">
                      {item.itemType === 'hotel' ? <Hotel size={14} /> : <Plane size={14} />}
                      <span className="uppercase tracking-widest text-[10px]">{item.itemType}</span>
                    </Badge>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-6 right-6 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                    onClick={() => removeFromWishlist(item._id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>

                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight mb-2">
                      {item.itemType === 'hotel' ? item.details?.name : `${item.details?.airline || item.details?.airline} (${item.details?.flightNumber})`}
                    </h3>
                    <p className="text-muted-foreground italic text-sm">
                      {item.itemType === 'hotel' 
                        ? `${item.details?.city}, ${item.details?.country}` 
                        : `${item.details?.departureCity} to ${item.details?.arrivalCity}`}
                    </p>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-end pb-4 border-b border-border/50">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic mb-1">Price</p>
                        <p className="text-2xl font-black italic tracking-tighter">
                          {formatPrice(item.itemType === 'hotel' ? item.details?.pricePerNight : (item.details?.price / 100))}
                          <span className="text-[10px] opacity-60 ml-1 uppercase">
                            {item.itemType === 'hotel' ? '/ night' : 'one way'}
                          </span>
                        </p>
                      </div>
                      <Badge variant="outline" className="rounded-full font-black italic border-primary/20 text-primary">
                        {item.itemType === 'hotel' ? `${item.details?.rating} ★` : item.details?.class}
                      </Badge>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/10"
                        onClick={() => navigate(item.itemType === 'hotel' ? `/hotels/${item.itemId}` : `/booking/flight/${item.itemId}`)}
                      >
                        {item.itemType === 'hotel' ? 'Book Stay' : 'Book Flight'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-14 w-14 rounded-2xl border-primary/10 text-primary hover:bg-primary/5"
                        onClick={() => navigate(item.itemType === 'hotel' ? `/hotels/${item.itemId}` : '/flights')}
                      >
                        <ExternalLink size={20} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
