import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plane, Hotel, Car, Calendar, Info, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { format } from 'date-fns';

export default function BookingDetails() {
  const { t } = useTranslation();
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { formatPrice, currency } = useCurrency();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = type === 'flight' ? `/api/flights/${id}` : type === 'hotel' ? `/api/hotels/${id}` : `/api/cars/${id}`;
        const res = await fetch(endpoint);
        const item = await res.json();
        setData(item);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);

  const formattedDate = (date: Date | string) => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) return typeof date === 'string' ? date : 'Invalid Date';
      return format(d, 'dd MMM yyyy, hh:mm a');
    } catch (e) {
      return typeof date === 'string' ? date : 'Invalid Date';
    }
  };

  const getAirlineLogo = (airline: string) => {
    const logos: Record<string, string> = {
      'Emirates': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/200px-Emirates_logo.svg.png',
      'EgyptAir': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Egyptair.svg/200px-Egyptair.svg.png',
      'Nile Air': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Nile_Air_logo.svg/200px-Nile_Air_logo.svg.png',
      'FlyDubai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Flydubai_logo.svg/200px-Flydubai_logo.svg.png',
      'Qatar Airways': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Qatar_Airways_logo.svg/200px-Qatar_Airways_logo.svg.png',
      'Saudia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Saudia_logo.svg/200px-Saudia_logo.svg.png'
    };
    return logos[airline] || null;
  };

  const AirlineLogo = ({ airline, logo, className }: { airline: string, logo?: string, className?: string }) => {
    const logoSrc = getAirlineLogo(airline) || logo;
    const [error, setError] = useState(false);

    if (error || !logoSrc) {
      return (
        <div className={`rounded-2xl bg-black/5 flex items-center justify-center font-black italic p-2 ${className}`}>
          {airline?.substring(0, 3).toUpperCase() || '✈️'}
        </div>
      );
    }

    return (
      <div className={`rounded-2xl bg-black/5 flex items-center justify-center p-2 ${className}`}>
        <img 
          src={logoSrc} 
          alt={airline} 
          className="max-w-full max-h-full object-contain"
          onError={() => setError(true)}
        />
      </div>
    );
  };

  if (loading) return <div className="container mx-auto p-20 text-center">Loading details...</div>;
  if (!data) return <div className="container mx-auto p-20 text-center">Item not found.</div>;

  const handleProceed = () => {
    // Store booking info in session/state and navigate to checkout
    const bookingInfo = {
      type,
      id,
      item: data,
      amount: type === 'flight' ? data.price : type === 'hotel' ? data.pricePerNight : data.pricePerDay
    };
    sessionStorage.setItem('pending_booking', JSON.stringify(bookingInfo));
    navigate(type === 'car' ? `/checkout/car/${id}` : `/checkout/${type}/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-4 italic">Step 02: Review Selection</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-4">Complete your booking</h1>
        <p className="text-muted-foreground italic text-lg leading-none">Almost there! Review your trip details before secure payment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden border-none shadow-2xl bg-background/50 backdrop-blur rounded-[40px]">
            <div className="bg-primary p-8 flex items-center justify-between">
              <div className="flex items-center gap-4 text-primary-foreground">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  {type === 'flight' ? <Plane size={24} /> : type === 'hotel' ? <Hotel size={24} /> : <Car size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{type === 'flight' ? 'SkyWay Airlines' : type === 'hotel' ? 'SkyWay Exclusive Stay' : 'SkyWay Premium Wheels'}</p>
                  <h2 className="text-2xl font-black uppercase tracking-tighter leading-none italic">
                    {type === 'flight' ? t('flight_booking') : type === 'hotel' ? t('hotel_booking') : 'Car Rental Booking'}
                  </h2>
                </div>
              </div>
              <Badge className="bg-white text-primary font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-full">Confirmed Availability</Badge>
            </div>
            <CardContent className="p-10">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-48 h-48 rounded-[30px] overflow-hidden shadow-xl shrink-0 group">
                      {type === 'flight' ? (
                          <AirlineLogo airline={data.airline} logo={data.airlineLogo} className="w-full h-full" />
                      ) : (
                          <img 
                            src={type === 'hotel' ? data.images?.[0] : type === 'car' ? data.images?.[0] : (data.airlineLogo || 'https://images.unsplash.com/photo-1436491865332-7a61a109ce05?auto=format&fit=crop&w=800&q=80')} 
                            alt={data.name || data.airline || `${data.brand} ${data.model}`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                      )}
                  </div>
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-2">
                        {type === 'flight' ? `${data.departureCity} to ${data.arrivalCity}` : type === 'car' ? `${data.brand} ${data.model}` : data.name}
                      </h2>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                        <MapPin size={14} />
                        <span>
                          {type === 'flight' 
                            ? (data.airline || 'SkyWay') 
                            : (typeof data.location === 'string' 
                                ? data.location 
                                : (data.location?.name || (data.city ? `${data.city}, ${data.country}` : (data.location?.lat ? `${data.location.lat}, ${data.location.lng}` : 'Location'))))
                          }
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                      <div className="p-5 bg-muted/20 rounded-[20px] border border-border/50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">{type === 'car' ? 'Pickup Date' : 'Departure Date'}</p>
                        <p className="font-black text-xs italic uppercase">{formattedDate(data.departureTime || Date.now())}</p>
                      </div>
                      <div className="p-5 bg-muted/20 rounded-[20px] border border-border/50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Selection</p>
                        <p className="font-black text-lg tracking-tighter italic uppercase">{type === 'flight' ? data.class : type === 'car' ? data.type : 'Luxury Suite'}</p>
                      </div>
                      <div className="p-5 bg-muted/20 rounded-[20px] border border-border/50 col-span-2 md:col-span-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Status</p>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black text-[10px] tracking-widest uppercase">Refundable</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 p-6 border-2 border-dashed border-primary/20 bg-primary/5 rounded-[30px]">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-white" size={24} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="font-black italic uppercase tracking-tighter text-primary">SkyWay Platinum Shield Insurance Included</p>
                    <p className="text-xs text-muted-foreground">Your booking is protected against unforeseen cancellations and medical emergencies.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-background/50 rounded-[40px] p-10">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-6">Cancellation Policy</h3>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Info size={20} />
              </div>
              <p className="text-muted-foreground text-sm italic">
                Free cancellation until <span className="font-bold text-foreground">24 hours</span> before your {type === 'flight' ? 'departure' : 'scheduled check-in'}. 
                Full refund will be credited to your original payment method within <span className="font-bold text-foreground">3-5 business days</span>.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="sticky top-24 border-none shadow-2xl bg-background/80 backdrop-blur rounded-[40px] overflow-hidden">
            <div className="p-10 bg-muted/20 border-b border-border/50">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Fare Summary</h3>
            </div>
            <CardContent className="p-10 space-y-6">
              <div className="flex justify-between items-center text-sm font-bold italic">
                <span className="text-muted-foreground uppercase tracking-widest">Base Amount</span>
                <span>{formatPrice(type === 'flight' ? (data.price / 100) : type === 'car' ? data.pricePerDay : data.pricePerNight)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold italic">
                <span className="text-muted-foreground uppercase tracking-widest">Service Fee</span>
                <span>{formatPrice(25.00)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold italic">
                <span className="text-muted-foreground uppercase tracking-widest">Taxes (VAT)</span>
                <span>{formatPrice(20.00)}</span>
               </div>
              <div className="h-px bg-border/50 my-6" />
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Total Price</span>
                  <span className="text-5xl font-black tracking-tighter leading-none italic">{formatPrice((type === 'flight' ? (data.price / 100) : type === 'car' ? data.pricePerDay : data.pricePerNight) + 45)}</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{currency}</span>
              </div>
              <Button className="w-full h-16 rounded-full text-lg font-black uppercase tracking-widest mt-8 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1" onClick={handleProceed}>
                PROCEED TO PAYMENT
              </Button>
              <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest mt-4">Safe & Secure 256-bit SSL encrypted</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
