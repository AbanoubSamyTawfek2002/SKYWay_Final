import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Confirmation() {
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVerifying(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[70vh] text-center">
      {verifying ? (
        <div className="flex flex-col items-center gap-6">
           <Loader2 className="w-16 h-16 animate-spin text-primary" />
           <h1 className="text-3xl font-black uppercase tracking-widest italic">Verifying Payment...</h1>
           <p className="text-muted-foreground font-semibold">Please do not close this window.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4 duration-700 fade-in zoom-in-95">
           <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
             <CheckCircle2 className="w-12 h-12 text-green-500" />
           </div>
           <h1 className="text-5xl font-black uppercase tracking-tighter italic">Booking Confirmed!</h1>
           <p className="text-muted-foreground max-w-md font-semibold mb-4">Your payment has been successfully processed. An email receipt and itinerary have been sent to your inbox.</p>
           
           <div className="flex gap-4">
             <Button onClick={() => navigate('/my-bookings')} className="rounded-xl font-bold uppercase tracking-widest h-14 px-8 shadow-xl hover:shadow-primary/20">
               View My Bookings
             </Button>
             <Button onClick={() => navigate('/')} variant="outline" className="rounded-xl font-bold uppercase tracking-widest h-14 px-8 border-2 border-primary/20 hover:bg-primary/5 text-primary">
               Return Home
             </Button>
           </div>
        </div>
      )}
    </div>
  );
}
